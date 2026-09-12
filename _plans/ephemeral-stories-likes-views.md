# Plan: Ephemeral Stories with Likes and Views

## Context

The product wants an Instagram-style "Story" feature: a user posts ephemeral content (text + optional image, same as a Post) that their followers can view and like for 2 hours; after that it disappears for everyone except the author, who can see it forever along with full view/like stats. This is a net-new feature — there is no `Story` model, no view-tracking concept, and no follower-scoped content visibility anywhere in the codebase today (the existing Post feed is global). There is also no cron/scheduler in this repo, so expiry must be computed at read time rather than enforced by a background job.

Confirmed answers to the spec's open questions (drive the decisions below):
- Expired stories are never deleted — kept forever for the author.
- No realtime/websocket notifications for story likes or views (deliberate deviation from the Post/Comment/Follow pattern, which does notify).
- Visibility is followers-only (author's followers + the author), not global like Posts.
- Max 3 active (non-expired) stories per user at a time; creating a 4th is rejected.
- Content types match Post: required text `content` + optional image upload via the existing Cloudinary pipeline.

The plan below mirrors the existing `Post` feature's route/validator/controller/hook/component structure as closely as possible, deviating only where the spec requires (follower-scoping, expiry, view-tracking, no notifications).

## Server changes

### 1. Prisma schema (`server/prisma/schema.prisma`)

Add a `Story` model modeled directly on `Post`, plus a `views` array mirroring the existing `likes` array convention (the codebase has no join tables for user-to-content relations anywhere, so a normalized `StoryView` model would be inconsistent — a flat `String[]` of viewer IDs matches how `likes` already works on `Post`/`Comment`):

```prisma
model Story {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now())
  image     String?
  likes     String[]
  views     String[]

  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

- Add `stories Story[]` to `User`'s relation block (alongside `posts Post[]`).
- No `expiresAt` column — expiry is always computed as `createdAt >= now() - 2h`, since there's no scheduler to keep a stored value in sync.
- No `comments` relation — spec doesn't mention story comments.
- Leave `NOTIFICATION_TYPE` untouched — no `STORY_LIKE`/`STORY_VIEW` values, since stories don't notify.
- After editing, run from `server/prisma`: `npx prisma migrate dev --name add_story` then `npx prisma generate`.

### 2. Routes — new `server/src/routes/story/index.ts`

Mirror `server/src/routes/post/index.ts`'s structure (`verifyToken` + optional `upload.single(...)` + validator + controller):

```
POST   /story              verifyToken, upload.single("storyImg"), storyValidator.createStory, storyController.createStory
PUT    /story/like/:id     verifyToken, storyController.likeUnlikeStory
PUT    /story/view/:id     verifyToken, storyController.viewStory
GET    /stories            verifyToken, storyController.getActiveStories   // follower-scoped, non-expired story rail
GET    /stories/:id        verifyToken, storyController.getUserStories     // one user's stories
DELETE /story/:id          verifyToken, storyController.deleteStory
```

No edit route — the spec doesn't ask for editing stories. Register `storyRouter` in `server/src/routes/allRoutes.ts` alongside the existing routers.

### 3. Validator — new `server/src/validators/story/index.ts`

Mirror `server/src/validators/post/index.ts`'s `createPost` function exactly: if `req.file` is present, Joi-validate file metadata (fieldname `"storyImg"`, `/\.(jpg|jpeg|png)$/i`, max 5MB, `image/jpeg`/`image/png`), cleaning up via `fs.unlinkSync` on failure; then validate `req.body.content` (`Joi.string().max(100).required()`). Reuse `utils/filterErrorMessage.ts` for error formatting.

### 4. Controller — new `server/src/controllers/story/index.ts`

Reuse `prisma`, `uploadToCloudinary`/`deleteFromCloudinary`, `fs`, `HttpStatusCode`, `customRequest` exactly as `controllers/post/index.ts` does. Do **not** import `sendNotificationAsync`.

- **`createStory`**: verify user exists (401 if not). Before creating, enforce the active-story cap:
  ```ts
  const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const activeCount = await prisma.story.count({
    where: { authorId: userId, createdAt: { gte: cutoff } },
  });
  if (activeCount >= 3) return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "You already have 3 active stories" });
  ```
  Then branch on `req.file` exactly like `createPost` (upload to Cloudinary + `fs.unlinkSync` + create with `image`, vs. create with content only), responding with `include: { author: { select: { id, fullName, profilepic } } }`.

- **`likeUnlikeStory`**: fetch the story (404 if missing). If the requester is not the author and `story.createdAt < cutoff`, return 404 (not 403 — an expired story should look absent to non-authors, same as a nonexistent one, so it doesn't leak "this existed but expired"). Otherwise toggle `likes` exactly like `likeUnlikePost` (`.includes` → filter+update "unliked" / push+update "liked"). No notification call — this is the deliberate deviation from `likeUnlikePost`'s `sendNotificationAsync`.

- **`viewStory`** (new, no Post equivalent): fetch the story (404 if missing), same expiry gate as above for non-authors. If `story.authorId === userId`, skip recording (an author's own opens shouldn't count as a view) and just return the story. Otherwise, idempotently add the viewer:
  ```ts
  if (!story.views.includes(userId)) {
    story = await prisma.story.update({ where: { id }, data: { views: { push: userId } }, include: {...} });
  }
  ```
  Repeated calls (e.g. reopening the viewer) are silent no-ops, still 200.

- **`getActiveStories`** (`GET /stories`): fetch the requester's `following` array, build `visibleAuthorIds = [...following, userId]` (the requester always sees their own active stories too), then:
  ```ts
  prisma.story.findMany({
    where: { authorId: { in: visibleAuthorIds }, createdAt: { gte: cutoff } },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id, fullName, profilepic } } },
  });
  ```
  No pagination — the active set is inherently small (≤3 stories × people followed).

- **`getUserStories`** (`GET /stories/:id`): verify target user exists (404 if not). If `requesterId === targetUserId` (author viewing their own), query **all** their stories, no `createdAt` filter — this is where "author sees forever" is implemented. Otherwise, check the target is in the requester's `following`; if not, return `data: []` (not an error, consistent with "invisible content looks absent" used for expiry above); if yes, query with the same `createdAt >= cutoff` filter as the active feed. Both branches return the raw `likes`/`views` ID arrays (scalar columns, no extra include needed) so the client can show counts, and the author's own branch is what powers the "who viewed/liked" stats view.

- **`deleteStory`**: mirror `deletePost` exactly (ownership check → 401, Cloudinary cleanup via the same `image.split("/").pop()!.split(".")[0]` pattern, then `prisma.story.delete`). No expiry restriction — an author can delete an expired story too.

No changes needed to `server/src/types/types.ts` — Post has no hand-declared type there either; Story will rely on Prisma's generated type inline, same as Post does.

## Client changes

### 5. Recoil state — new `client/src/global/Stories.ts`

```ts
import { atom } from "recoil";
import { Story } from "../types";

const storiesState = atom<Story[]>({ key: "storyState", default: [] });
export default storiesState;
```

One atom, reused contextually exactly like `postsState` is reused for both the global feed and a per-user feed in `useGetPosts` — `useGetStories(id?)` will hold either the active-feed rail or a specific user's story list depending on whether an id is passed.

### 6. Hooks — new `client/src/hooks/Story/`

All hooks follow the Post hooks' conventions precisely (local `loading` via `useState`, explicit per-call `Authorization: localStorage.getItem("access_token")` header — never rely on the axios instance's stale default — `toast.success`/`toast.error`, functional Recoil updates):

- **`useCreateStory.ts`** — `POST /story`, `FormData` with `content` + `storyImg`, prepends `response.data.data` to `storiesState`. Mirrors `useCreatePost.ts`.
- **`useGetStories.ts`** — `getStories(id?: string)` → `GET /stories/${id}` or `GET /stories`; no pagination (unlike `useGetPosts`, since the controller returns the full set); replaces `storiesState` wholesale.
- **`useLikeUnlikeStory.ts`** — `PUT /story/like/${storyId}`, functional findIndex-replace against `storiesState` with the server's returned story. Mirrors `useLikeUnlikePost.ts`.
- **`useViewStory.ts`** — `PUT /story/view/${storyId}`, same findIndex-replace, but **no toast** — viewing is meant to be a silent background action fired when the viewer opens, not a user-facing event.
- **`useDeleteStory.ts`** — `DELETE /story/${storyId}`, filters it out of `storiesState`. Mirrors `useDeletePost.ts`.

### 7. Components — new `client/src/components/common/story/`

- **`Stories.tsx`** — the story rail. Mounted in `client/src/pages/HomePage.tsx` above `<CreatePost/>`. On mount, calls `useGetStories().getStories()` (no id → active feed), groups the flat array client-side by `authorId`, renders a horizontal row of avatars (own avatar first with a "+" affordance for creating). Clicking an avatar opens `StoryViewer` for that author's stories.
- **`CreateStory.tsx`** — a `<dialog>` form, structurally identical to `CreatePost.tsx` (Formik + Yup: required `content`, optional `image` File validated via the same `.test()` type/size checks, hidden file input triggered by an `ImageUp` icon), submitting `FormData` (`content`, `storyImg`) via `useCreateStory`, closing the dialog on success like `EditPost.tsx` does.
- **`StoryViewer.tsx`** — a `<dialog>` showing one author's stories in sequence (image full-bleed or centered text). Reuses the exact like-button idiom from `Post.tsx` (`isLiked` derived from `story.likes.includes(authUser.id)`, `debounceFunc()` from `utils/debounce.ts` to guard rapid clicks) wired to `useLikeUnlikeStory`. Fires `useViewStory().viewStory(id)` once per story shown (via a `useEffect` keyed on the current story id, so it doesn't refire on re-render). When `authUser.id === story.authorId`, additionally renders a delete icon (`useDeleteStory`, gated the same way `Post.tsx` gates its owner-only edit/delete icons) and view/like counts (`story.views.length`, `story.likes.length`) — the spec's "full list" requirement is satisfied at the count level by default, consistent with how `Post.tsx` already only ever shows `post.likes.length` rather than resolved names anywhere in the current UI.

No route or `App.tsx`/`Layout.tsx` changes — everything is dialog-based, consistent with how Edit Post and Comments already work.

### 8. Client types (`client/src/types/index.ts`)

Add, mirroring `Post`/`PostProps`/`PostsProps`:

```ts
export type Story = {
  id: string;
  content: string;
  authorId: string;
  author: User;
  image?: string;
  likes: string[];
  views: string[];
  createdAt: string;
};

export type StoryProps = { story: Story };
export type StoriesProps = { getStories: (id?: string) => void; loading: Boolean };
```

## Verification

1. Run `npx prisma migrate dev --name add_story` then `npx prisma generate` from `server/prisma`.
2. Start both dev servers (`npm run dev` at repo root for the server, `npm run dev` in `client/`).
3. Create three users A, B, C (existing signup flow); have B follow A; leave C not following A.
4. As A, create a story via the new `CreateStory` form — confirm it appears in A's own rail immediately.
5. As B (a follower), confirm A's story shows in the `/stories` rail; open it and confirm a view is recorded exactly once (repeat opens shouldn't grow `views`); like/unlike it and confirm the toggle behaves like Post likes, with **no** row created in `Notification` and no websocket push.
6. As C (non-follower), confirm A's story does not appear in `/stories`, and directly requesting `GET /stories/<A's id>` returns `data: []`.
7. Test expiry by backdating a story's `createdAt` in the dev DB (`UPDATE "Story" SET "createdAt" = "createdAt" - INTERVAL '3 hours' WHERE id = '<id>';`): confirm B's `/stories` no longer includes it and direct like/view calls on it 404 for B, while A still sees it in full (with intact `likes`/`views`) via `GET /stories/<A's id>`.
8. As A, create a 2nd and 3rd story (both succeed), then attempt a 4th and confirm it's rejected with the active-story-cap message; expire one of the three (via backdating) and confirm a new 4th creation now succeeds.
9. As A, delete a story and confirm its Cloudinary image (if any) is removed and the row disappears without affecting A's other stories.
10. Confirm existing Post/Comment/Follow/Notification flows are unaffected (`allRoutes.ts` still lists all prior routers; only additive changes to shared files).

### Critical files
- `server/prisma/schema.prisma`
- `server/src/routes/story/index.ts` (new), `server/src/routes/allRoutes.ts`
- `server/src/validators/story/index.ts` (new)
- `server/src/controllers/story/index.ts` (new)
- `client/src/global/Stories.ts` (new)
- `client/src/hooks/Story/*.ts` (new)
- `client/src/components/common/story/Stories.tsx`, `CreateStory.tsx`, `StoryViewer.tsx` (new)
- `client/src/pages/HomePage.tsx`
- `client/src/types/index.ts`

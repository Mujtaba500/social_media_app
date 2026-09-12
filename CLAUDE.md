# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Konekt — a social media app (post/like/comment/follow, realtime notifications). Monorepo with two independent npm projects:

- `server/` — Express + TypeScript API, driven from the root `package.json`
- `client/` — Vite + React + TypeScript SPA, its own `package.json`

There are no automated tests in this repo (no test runner/scripts configured for either package).

## Commands

Run from the repo root unless noted.

```bash
nvm use                 # Node version pinned in .nvmrc
npm install              # root deps (server)
npm run dev               # runs server with nodemon: typechecks (tsc --noemit) then runs server/src/server.ts via ts-node/esm loader (server/dev/register.js)
npm run build              # tsc -p tsconfig.json -> compiles server/src to server/dist
npm start                   # pm2-runtime start server/dist/server.js (production)
npm run db:client            # cd server/prisma && npx prisma generate
```

Client (from `client/`):

```bash
npm install
npm run dev        # vite dev server
npm run build      # tsc -b && vite build
npm run lint       # eslint .
npm run preview    # preview production build
```

Prisma migrations live in `server/prisma/migrations`; the schema is `server/prisma/schema.prisma`. Run `npx prisma migrate dev` / `npx prisma generate` from `server/prisma`.

Env files: copy `server/.env.example` -> `server/.env` and `client/.env.example` -> `client/.env`. Server needs `PORT`, `DATABASE_URL`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, Cloudinary creds. Client needs `VITE_BACKEND_URL` (no protocol, used only in production mode).

## Architecture

### Server (`server/src`)

- `server.ts` creates a raw `http.Server`, attaches the Express `app` (`app.ts`) via `server.on("request", app)`, and layers a `ws` `WebSocketServer` on the **same** HTTP server/port — HTTP and WebSocket traffic share one port.
- `app.ts` wires global middleware (cors, morgan, cookie-parser, json/urlencoded body parsing) and mounts `routes/allRoutes.ts` under `/api/v1`.
- Routing is organized per-resource under `routes/<resource>/index.ts`, each pairing a `middleware/auth` JWT check, a `validators/<resource>` Joi validator, and a `controllers/<resource>/index.ts` handler. `routes/allRoutes.ts` is just an array of these routers, spread into `app.use("/api/v1", allRoutes)`.
- Auth is a two-token JWT scheme: short-lived access token sent as `Authorization: Bearer <token>` header (verified by `middleware/auth`), and a refresh token stored server-side in the `Token` Prisma model plus an httpOnly cookie (`req.cookies.jwt`), exchanged via `POST /api/v1/refresh_token` (`controllers/token`, `utils/createToken.ts`).
- `websocketServer.ts` authenticates WS connections by reading a `?token=` query param (`utils/helpers.ts: getTokenFromParams` + `extractUserFromToken`, verified against `ACCESS_TOKEN_SECRET`) and keeps an in-memory `connections` array mapping `{ user, ws }`. `sendDataToClient(userId, data)` fans out to all sockets open for that user (a user can have multiple tabs/pages open). There's no reconnection/cleanup on token expiry, and `removeElementFromArray`/close-handler cleanup is a stub — check current state before assuming presence tracking is robust.
- Realtime notifications: `utils/notification.ts: sendNotificationAsync` writes a `Notification` row via Prisma then immediately pushes it over the websocket to the recipient — this is the pattern to follow for any new realtime side effect (persist first, then `sendDataToClient`).
- Prisma (`db/config.ts`) is the only DB access layer — no repository/service abstraction; controllers call `prisma.*` directly.
- Data model (`prisma/schema.prisma`): `User` has denormalized `followers`/`following` as `String[]` of user IDs (no join table), and `Post`/`Comment` similarly track `likes` as `String[]` of user IDs. `Conversation`/`Message` models exist in the schema for DMs but there is no corresponding route/controller yet — treat that feature as schema-only/unimplemented.
- Image uploads go through `middleware/multer_cloudinary` (multer memory handling) into Cloudinary (`utils/cloudinary.ts`).
- TypeScript execution in dev never compiles to JS: `ts-node/esm` is registered as a loader (`server/dev/register.js`) and imports use `.js` extensions per NodeNext/ESM convention even though the files are `.ts`.

### Client (`client/src`)

- State: Recoil atoms live under `global/` (e.g. `global/Posts.ts`, `global/Notifications.ts`, `global/SuggestedUsers.ts`) and are read/written from hooks — data-fetching and mutation logic is pulled out of components into `hooks/<domain>/useX.ts` (e.g. `hooks/Post/useCreatePost.ts`, `hooks/comment/*`, `hooks/notification/*`, `hooks/user/*`). Prefer following this hook-per-action convention rather than fetching inline in components.
- Auth state is separate from Recoil: `context/authContext.tsx` provides `authUser`/`isLoading` via React context, fetched once on mount from `/auth/user`. `App.tsx` gates all routing on `authUser`/`isLoading` (redirects to `/login` or `/` accordingly); `ProfilePage` and `NotificationPage` are lazy-loaded.
- `axios/index.ts` builds the base axios instance; base URL switches on `import.meta.env.MODE` (`production` -> `VITE_BACKEND_URL` env var, `development` -> `localhost:4000`) — the access token is read from `localStorage` and baked into the client at construction time (not per-request), so after login/refresh the axios instance's default header can be stale; call sites pass `Authorization` explicitly where this matters (see `authContext.tsx`).
- Token refresh: `utils/refreshAccessToken.ts` posts to `/refresh_token`, stores the new access token in `localStorage`, and schedules its own next refresh via `refreshAccessTokenBg` (recursive `setTimeout`).
- WebSocket client: `axios/ws.ts: newSocketConnection()` opens `ws(s)://<backend>?token=<access_token>` (same host/mode logic as the axios base URL); `hooks/useWebSocket.ts` wraps this with basic open/error/close logging.
- Styling: Tailwind + daisyUI (`tailwind.config.js`), global styles in `index.css`.
- Forms use Formik + Yup (see `EditProfileModal.tsx`, post/comment edit dialogs).

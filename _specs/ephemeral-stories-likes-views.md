# Spec for Ephemeral Stories with Likes and Views

## Summary
Allow a user to post a "story" that other users can view and like. For everyone except the author, the story disappears 2 hours after it was posted. The author retains permanent access to their own story, including a full record of who viewed it and who liked it.

## Functional Requirements
- A user can create a story attached to their account, similar in spirit to an existing Post but ephemeral for viewers.
- Any user who can currently see the author's content (e.g. followers, or however Posts are scoped today) can view and like a story while it is within its 2-hour visible window.
- Exactly 2 hours after creation, the story stops being visible/likeable to everyone except the author.
- The author can view their own story indefinitely, even after the 2-hour window has passed for everyone else.
- The author can see, for their own story, at any time:
  - The full list (or count) of users who viewed it.
  - The full list (or count) of users who liked it.
- Viewing a story by another user is recorded as a "view," distinct from a "like."
- Liking/unliking a story follows the same toggle behavior users already expect from post likes.
- Expired stories are not shown in any "active stories" listing/feed to non-authors, but remain fully intact and queryable for the author.

## Possible Edge Cases
- Author views their own story — does this count as a "view" for analytics, or should the author be excluded from their own view count?
- A user views a story, then unfollows the author (or the author removes a follower) before the 2-hour window ends — does the viewer lose access immediately, or keep access until expiry since they already viewed it?
- A user likes a story right at/near the 2-hour boundary — should the like still register if the request lands just before vs. just after expiry?
- The author deletes their account or the story manually before the 2-hour window ends — views/likes recorded so far should be cleaned up consistently with how Post deletion is handled today.
- A non-author tries to access a story directly (e.g. a stale link/notification) after it has expired — should get a "not found"/"expired" response rather than the story content.
- Multiple stories per user — does "views other users can see" reset per story, and can a user have several active stories simultaneously, each with its own 2-hour clock?
- Viewing the same story multiple times by the same user — should this count as one view or increment each time?

## Acceptance Criteria
- Given a story was created less than 2 hours ago, when a non-author user requests it, then they can view it and like/unlike it.
- Given a story was created more than 2 hours ago, when a non-author user requests it, then it is not returned/visible to them.
- Given a story was created more than 2 hours ago, when the author requests it, then it is still fully visible to them, including its content.
- Given a non-author has viewed and/or liked a story, when the author later looks at that story (before or after the 2-hour window), then the author can see the total views and total likes, including who they came from.
- Given a user likes a story, when they like it again, then the like is toggled off (unliked), consistent with existing like/unlike behavior elsewhere in the app.

## Open Questions
- Should expired stories be permanently deleted from the database after some longer retention period, or kept forever for the author (current assumption is "forever" per the request)? -> forever
- Should viewing a story trigger a realtime notification to the author (similar to how post likes/comments/follows already notify via the websocket layer), or only likes? -> no need for notification
- Who can post/view stories — is visibility scoped to followers only, or is it open to any authenticated user (as with the current public Post feed)? -> followers only
- Should there be a limit on how many stories a user can have "active" (within the 2-hour window) at once? -> probably 3
- Do stories support the same content types as posts (text + optional image), or are they restricted to images/media only? -> same as posts

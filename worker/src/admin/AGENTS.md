# WORKER ADMIN NOTES

## OVERVIEW
Admin auth, settings, and moderation endpoints.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Handlers | `handlers.ts` | Auth, comments moderation, settings |

## CONVENTIONS
- CSRF token stored in `admin_sessions` table.

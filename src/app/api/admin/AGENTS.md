# ADMIN API PROXY NOTES

## OVERVIEW
Proxy handlers for admin APIs to the Worker backend.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Auth | `login/route.ts`, `setup/route.ts`, `setup-status/route.ts` | Admin auth endpoints |
| Analytics | `analytics/**/route.ts` | Umami analytics proxies |
| Comments | `comments/**/route.ts` | Moderation + analytics proxies |
| Settings | `settings/route.ts` | Admin settings proxy |

## CONVENTIONS
- Forward `X-CSRF-Token` from request headers.
- Forward `cookie` header for admin session.

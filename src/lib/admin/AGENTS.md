# ADMIN LIB NOTES

## OVERVIEW
Admin client wrappers and response types for dashboard features.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Admin client | `client.ts` | Auth + settings + comments |
| Analytics client | `analytics-client.ts` | Umami + comments analytics |
| Types | `types.ts` | Admin payloads + responses |

## CONVENTIONS
- CSRF token passed via `X-CSRF-Token` header.

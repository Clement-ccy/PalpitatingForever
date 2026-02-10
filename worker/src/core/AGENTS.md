# WORKER CORE NOTES

## OVERVIEW
Shared helpers for HTTP, requests, crypto, settings, and time.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| CORS helpers | `http.ts` | `withCors`, `handleOptions` |
| Request parsing | `request.ts` | IP, cookies, UA parsing |
| Crypto helpers | `crypto.ts` | hash/encrypt/password hash |
| Settings | `settings.ts` | D1 read/write helpers |
| Site rules | `site.ts` | Allowed hosts + origins |
| Types | `types.ts` | Env + payload shapes |

## CONVENTIONS
- CORS allows `X-CSRF-Token` header.

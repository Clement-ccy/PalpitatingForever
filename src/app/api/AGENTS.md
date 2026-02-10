# API ROUTES NOTES

## OVERVIEW
Next.js route handlers that proxy to the Worker backend.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Comments | `comments/*/route.ts` | Thread + submit + totals |
| Analytics | `analytics/*/route.ts` | Pageview + events |
| Admin proxy | `admin/**/route.ts` | Forwards CSRF + cookies |

## CONVENTIONS
- Proxies use `NEXT_PUBLIC_API_BASE_URL`.
- Admin routes forward `X-CSRF-Token` + `cookie` headers.

## ANTI-PATTERNS
- Do not change endpoint paths; worker expects stable routes.

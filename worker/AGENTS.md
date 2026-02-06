# WORKER NOTES

## OVERVIEW
Cloudflare Worker API for analytics, comments, and admin backed by D1.

## STRUCTURE
```
worker/
├── src/index.ts        # Router + scheduled cron entry
├── src/core/           # Shared helpers (http/crypto/request/site/settings/time)
├── src/analytics/      # Analytics handlers + rollups
├── src/comments/       # Comments handlers + rate limiting
├── src/admin/          # Admin auth/settings handlers
└── migrations/         # D1 schema + seed data
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Worker entry | `src/index.ts` | Routes + scheduled cron |
| CORS/HTTP | `src/core/http.ts` | `withCors`, `handleOptions`, JSON responses |
| Analytics | `src/analytics/handlers.ts` | collect/event + rollups |
| Comments | `src/comments/handlers.ts` | threads, submit, rate limit |
| Admin | `src/admin/handlers.ts` | auth, comments moderation, settings |
| Schema | `migrations/*.sql` | D1 tables + indexes |

## CONVENTIONS
- Plaintext fields are stored as `*_plain` (device/ip/ua, email/ip).
- Session tracking uses `device_plain` + 30min inactivity cutoff.
- Admin auth uses CSRF token stored in `admin_sessions`.

## ANTI-PATTERNS
- Do not change endpoint paths; frontend proxies rely on them.
- Avoid adding new tables without updating migrations.

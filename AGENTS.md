# PROJECT KNOWLEDGE BASE

**Generated:** 2026-02-04
**Commit:** 6a1096d
**Branch:** main

## OVERVIEW
Next.js App Router portfolio (React 19) with Notion-sourced content, Tailwind v4 CSS tokens, and a Cloudflare Worker + D1 backend for analytics, comments, and admin.

## STRUCTURE
```
./
├── src/                # App Router UI, API proxies, shared UI/lib
├── worker/             # Cloudflare Worker API + D1 schema
├── scripts/            # Notion fetch pipeline
├── public/data/        # Generated Notion JSON (pages + blocks)
├── public/media/notion # Mirrored Notion assets
└── wrangler.toml       # Worker config + cron + D1 binding
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| App shell | `src/app/layout.tsx` | Global layout + aurora/noise background |
| Middleware routing | `src/middleware.ts` | Admin subdomain rewrite |
| Admin UI | `src/app/admin/*` | Guarded dashboard + settings + comments |
| Admin API proxy | `src/app/api/admin/*` | Proxies to worker + forwards CSRF/cookies |
| Admin client | `src/lib/admin/client.ts` | Admin UI request wrappers |
| Notion data client | `src/lib/notion/client.ts` | Fetches `/public/data` JSON |
| Notion mapping | `src/lib/notion/{utils,mappers,types}.ts` | Map pages/blocks + helpers |
| Notion renderer | `src/components/notion/NotionBlockRenderer.tsx` | Recursive block rendering |
| Notion sync CI | `.github/workflows/notion-sync.yml` | Hourly data sync |
| Worker entry | `worker/src/index.ts` | Routes + scheduled cron |
| Worker schema | `worker/migrations/*.sql` | D1 tables + indexes |

## CONVENTIONS (PROJECT-SPECIFIC)
- Tailwind v4 config lives **only** in `src/app/globals.css` via `@theme` and CSS variables.
- Use `@/*` path alias (tsconfig paths).
- Types live in `src/lib/**/types.ts`; fetch logic lives in `src/lib/**/client.ts`.
- Admin routes use CSRF from `sessionStorage` and forward via `X-CSRF-Token` header.
- Notion content is mapped before UI; never render raw API objects.

## ANTI-PATTERNS (THIS PROJECT)
- **NEVER** use `any` (prefer `unknown`).
- **DO NOT** add `tailwind.config.js` (Tailwind v4 lives in CSS).
- Avoid using raw Notion API objects in UI components.

## UNIQUE STYLES
- Global effects: `.aurora-blob`, `.noise-bg`, `.glass-card`, `.custom-scrollbar` in `globals.css`.
- Theme tokens: `--accent-*` and `--accent-*-rgb` for page-specific glow styling.

## COMMANDS
```bash
npm run dev
npm run lint
npm run build
npm run fetch-notion

# D1 migrations
npx wrangler d1 migrations apply pf-database --local
```

## NOTES
- Admin runs on `admin.ccy.asia` via middleware rewrite.
- Worker cron runs daily at 00:10 Asia/Shanghai (`wrangler.toml`).
- LSP tools may be unavailable on Windows + Bun 1.3.5.

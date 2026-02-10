# APP ROUTER NOTES

## OVERVIEW
App Router pages for the portfolio, with admin UI and API proxy routes.

## STRUCTURE
```
src/app/
├── layout.tsx        # Root layout, aurora/noise background
├── page.tsx          # Home dashboard (bento grid)
├── admin/            # Admin UI (layout + pages)
├── api/              # API proxies to worker backend
├── api/admin/        # Proxy routes to worker backend
├── blogs/            # Blog list + [slug] detail
├── works/            # Works index
├── mlogs/            # Music/Podcast logs
├── plogs/            # Photo log collections
├── gears/            # Gear list
├── about/            # About page
└── links/            # Links page
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| App shell | `layout.tsx` | Global background effects |
| Admin shell | `admin/layout.tsx` | Admin layout wrapper |
| Admin guard | `components/admin/AdminGuard.tsx` | CSRF check + auth gate |
| API proxy entry | `api/*/route.ts` | Proxies to worker routes |
| Blog detail | `blogs/[slug]/page.tsx` | Loads blocks per page id |
| Works | `works/page.tsx` | Notion pages + theme accents |
| Mlogs | `mlogs/page.tsx` | Renders blocks below |
| Plogs | `plogs/page.tsx` | Collections + waterfall analytics |

## CONVENTIONS
- Pages are mostly `'use client'` and fetch from `/data/notion-pages.json`.
- Content blocks load from `/data/blocks-<pageId>.json` and render via `renderNotionBlocks`.
- Admin pages fetch via `lib/admin/client` and forward `X-CSRF-Token` from `sessionStorage`.

## ANTI-PATTERNS
- Do not reintroduce mock data once Notion data exists.
- Avoid mixing raw Notion API objects into UI; always map first.

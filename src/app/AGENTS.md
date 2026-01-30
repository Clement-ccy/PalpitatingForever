# APP ROUTER NOTES

## OVERVIEW
Client-side App Router pages for the portfolio sections and landing grid.

## STRUCTURE
```
src/app/
├── page.tsx            # Home dashboard (bento grid)
├── layout.tsx          # Root layout, theme provider, global effects
├── blogs/              # Blog list + [slug] detail
├── works/              # Works index
├── mlogs/              # Music/Podcast logs
├── plogs/              # Photo log collections
├── gears/              # Gear list
└── lab/                # Lab page
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Blog list layout | `blogs/page.tsx` | Timeline list + detail preview card |
| Blog detail | `blogs/[slug]/page.tsx` | Loads blocks dynamically per page id |
| Works | `works/page.tsx` | Uses Notion pages data, theme accents |
| Mlogs | `mlogs/page.tsx` | Area → Podcast/Music; renders blocks below |
| Plogs | `plogs/page.tsx` | Collections; images from block list |
| Gears | `gears/page.tsx` | Gear list from Notion pages |

## CONVENTIONS
- Pages are mostly `'use client'` and pull from `src/data/refs/notion-pages.json`.
- Content blocks load from `src/data/refs/blocks-<pageId>.json` and render via `renderNotionBlocks`.
- Use `@/` alias for imports and `cn()` for conditional classes.

## ANTI-PATTERNS
- Do not re-introduce mock data sources once Notion data exists.
- Avoid mixing raw Notion API objects into UI; always map first.

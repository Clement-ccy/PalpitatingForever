# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-30
**Commit:** 77b4772
**Branch:** main

## OVERVIEW
Next.js App Router portfolio using Notion as a CMS, Tailwind v4 in `globals.css`, Framer Motion UI, and a custom Notion block renderer.

## STRUCTURE
```
./
├── src/app/              # App Router pages (blogs, mlogs, plogs, works, gears)
├── src/components/       # UI + dashboard components
│   └── notion/            # Notion renderer + rich text
├── src/lib/              # Notion mappers, utils, shared helpers
├── public/data/           # Generated Notion JSON payloads
├── scripts/               # Data fetch automation
└── public/                 # Static assets
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Route pages | `src/app/**/page.tsx` | App Router, mostly client components |
| Notion rendering | `src/components/notion/NotionBlockRenderer.tsx` | Recursive render + list grouping |
| Notion mapping | `src/lib/notion-utils.ts`, `src/lib/notion-mappers.ts` | Category mapping + block normalization |
| Notion data fetch | `scripts/fetch-notion.ts` | Writes to `public/data/` |
| Global styling | `src/app/globals.css` | Tailwind v4 `@theme` and utilities |

## CODE MAP
| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `RootLayout` | function | `src/app/layout.tsx` | App shell, theme provider, global effects |
| `NotionBlockRenderer` | component | `src/components/notion/NotionBlockRenderer.tsx` | Recursive block rendering |
| `renderNotionBlocks` | function | `src/components/notion/NotionBlockRenderer.tsx` | Groups list blocks and handles depth |
| `mapNotionPage` | function | `src/lib/notion-utils.ts` | Page mapping + category/theme normalization |
| `mapNotionBlock` | function | `src/lib/notion-mappers.ts` | Block mapping + table support |

## CONVENTIONS (PROJECT-SPECIFIC)
- **Imports:** use `@/` alias; order: React/Next → external → UI → lib → types.
- **React Compiler:** enabled in `next.config.ts`; avoid unnecessary `useMemo`/`useCallback`.
- **Tailwind v4:** configuration lives in `src/app/globals.css` `@theme` only.
- **Icons:** `lucide-react` only.

## ANTI-PATTERNS (THIS PROJECT)
- **NEVER** use `any`. Prefer `unknown` if needed.
- **DO NOT** add `tailwind.config.js`.

## UNIQUE STYLES
- Global effects: `.aurora-blob`, `.noise-bg`, `.glass-card`, `.custom-scrollbar`.
- Theme tokens live in CSS variables (`--accent-*`) in `globals.css`.

## COMMANDS
```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
NOTION_TOKEN=... npm run fetch-notion
```

## NOTES
- Notion data JSONs in `public/data/` are generated artifacts.
- Notion file assets are mirrored to `public/media/notion/blocks` and page covers to `public/media/notion/pages`.
- `next.config.ts` allows remote images from Unsplash, Giphy, Notion S3, and notion.so.

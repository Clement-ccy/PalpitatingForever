# SCRIPTS NOTES

## OVERVIEW
Automation scripts for fetching and generating Notion data artifacts.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Notion fetch | `fetch-notion.ts` | Recursive blocks, writes to `public/data/` |

## CONVENTIONS
- Requires `NOTION_TOKEN` and `NOTION_DATA_SOURCE_ID` in env.
- Uses Notion API version `2025-09-03`.
- Writes `notion-pages.json` and `blocks-<pageId>.json` to `public/data/`.
- Mirrors Notion file assets to `public/media/notion/blocks` and page covers to `public/media/notion/pages`.
- Run via `npm run fetch-notion`.

## ANTI-PATTERNS
- Never commit secrets or tokens.

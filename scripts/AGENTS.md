# SCRIPTS NOTES

## OVERVIEW
Automation scripts for fetching and generating Notion data artifacts.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Notion fetch | `fetch-notion.ts` | Recursive blocks, writes to `src/data/refs/` |

## CONVENTIONS
- Requires `NOTION_TOKEN` in env.
- Uses Notion API version `2025-09-03`.
- Writes `notion-pages.json` and `blocks-<pageId>.json`.
- Run via `npm run fetch-notion`.

## ANTI-PATTERNS
- Never commit secrets or tokens.

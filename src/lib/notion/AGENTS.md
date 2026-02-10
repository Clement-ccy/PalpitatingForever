# NOTION LIB NOTES

## OVERVIEW
Notion mapping utilities, types, and local JSON fetchers.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Page mapping | `utils.ts` | `mapNotionPage`, slug/theme helpers |
| Block mapping | `mappers.ts` | `mapNotionBlock` switch |
| Types | `types.ts` | NotionPage/NotionBlock shapes |
| Client | `client.ts` | Fetches `/public/data` JSON |

## CONVENTIONS
- Always map raw Notion objects before UI.

# LIBRARY NOTES

## OVERVIEW
Notion mapping utilities and shared helpers used by pages and renderers.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Page mapping | `notion-utils.ts` | `mapNotionPage`, category/theme normalization |
| Block mapping | `notion-mappers.ts` | `mapNotionBlock` including table support |
| Class utils | `utils.ts` | `cn()` helper |

## CONVENTIONS
- Normalize Notion relation IDs by stripping hyphens before lookup.
- Map Notion pages into typed shapes before UI use.
- Use `getFallbackTheme` for deterministic theme assignment.

## ANTI-PATTERNS
- Do not pass raw Notion API objects to components.

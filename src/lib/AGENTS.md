# LIBRARY NOTES

## OVERVIEW
Shared helpers plus Notion, analytics, comments, and admin clients/types.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Class utils | `utils.ts` | `cn()` helper |
| API base URL | `api.ts` | `NEXT_PUBLIC_API_BASE_URL` + `buildApiUrl` |
| Analytics types | `analytics/types.ts` | Payload + response types |
| Analytics client | `analytics/client.ts` | Pageview + event tracking |
| Comments types | `comments/types.ts` | Comment payloads + API shapes |
| Comments client | `comments/client.ts` | Thread fetch + submit |
| Admin types | `admin/types.ts` | Admin payloads + responses |
| Admin client | `admin/client.ts` | Admin UI request wrappers |
| Notion types | `notion/types.ts` | Page/block shapes |
| Notion client | `notion/client.ts` | Fetches `/data` JSON |
| Notion utils | `notion/utils.ts` | Slug/theme/text helpers + page mapping |
| Notion mappers | `notion/mappers.ts` | Block mapping only |

## CONVENTIONS
- Types live in `src/lib/**/types.ts`.
- Client fetch logic lives in `src/lib/**/client.ts`.
- Notion pages must be mapped before UI use.

## ANTI-PATTERNS
- Do not pass raw Notion API objects to components.

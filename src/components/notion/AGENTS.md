# NOTION RENDERER NOTES

## OVERVIEW
Recursive renderer for mapped Notion blocks plus rich-text annotation handling.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Block rendering | `NotionBlockRenderer.tsx` | Main switch + list grouping |
| Rich text | `RichText.tsx` | Inline annotations/mentions |

## CONVENTIONS
- Always render via `renderNotionBlocks` to preserve list grouping + depth.
- Heading ids fallback to `block.id` when slug is empty.
- Use `ErrorBoundary` around fragile blocks (equation/code).
- Only render mapped blocks (`mapNotionBlock`), not raw API objects.

## ANTI-PATTERNS
- Do not add block types without updating `mapNotionBlock`.
- Avoid direct DOM parsing or `dangerouslySetInnerHTML`.

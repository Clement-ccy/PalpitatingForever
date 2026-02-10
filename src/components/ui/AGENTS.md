# UI COMPONENTS NOTES

## OVERVIEW
UI primitives for layout, navigation docks, and interactive cards.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Spotlight hover | `spotlight-card.tsx` | Radial spotlight + focus/keyboard handling |
| Bento layout | `bento-grid.tsx` | Grid + span helpers |
| Top dock | `top-dock.tsx` | Main nav dock with hover scale |
| Top-left dock | `top-left-dock.tsx` | Projects dropdown + home badge |
| Top-right dock | `top-right-dock.tsx` | Control panel + theme toggle |
| Particles | `particle-overlay.tsx` | Canvas drift layer |
| Error boundary | `error-boundary.tsx` | Shared UI error wrapper |

## CONVENTIONS
- Use `cn()` for class merging.
- Docks use `framer-motion` for hover/animate behaviors.
- Keep primitives presentational; domain logic stays in app/lib.

## ANTI-PATTERNS
- Do not add new icon libraries (use `lucide-react`).
- Avoid `dangerouslySetInnerHTML` in primitives.

# DASHBOARD COMPONENTS NOTES

## OVERVIEW
Home dashboard tiles for the bento layout.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Profile tile | `profile-card.tsx` | Avatar + status pill |
| Map widget | `map-widget.tsx` | Location card + pulse ring |
| Now playing | `now-playing.tsx` | Equalizer + status blip |
| Latest thought | `latest-thought.tsx` | Link to blogs |
| Extras | `extras.tsx` | Showcase, quick links, stack card |

## CONVENTIONS
- All tiles are `SpotlightCard` wrappers.
- Keep content static unless wired to data in app layer.

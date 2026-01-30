# COMPONENTS NOTES

## OVERVIEW
Shared UI primitives and dashboard widgets used across the site.

## STRUCTURE
```
src/components/
├── ui/         # Spotlight card, bento grid, docks, error boundary
├── dashboard/  # Home dashboard tiles
└── notion/     # Notion renderer (see its own AGENTS.md)
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Spotlight hover | `ui/spotlight-card.tsx` | Radial hover effect |
| Bento layout | `ui/bento-grid.tsx` | Home grid sizing |
| Docks | `ui/top-*.tsx` | Navigation docks |
| Dashboard tiles | `dashboard/*` | Home page content blocks |

## CONVENTIONS
- Keep components functional and presentational.
- Prefer `cn()` for class merging.
- Icons: `lucide-react` only.

## ANTI-PATTERNS
- Do not add new icon libraries.
- Notion rendering logic belongs in `components/notion` only.

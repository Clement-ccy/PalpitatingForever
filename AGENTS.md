# AGENTS.md

This file provides guidance to agents when working with code in this repository.

# Project-Specific Constraints & Patterns

- **Tailwind v4**: Config relies SOLELY on `src/app/globals.css` (`@theme`). DO NOT create `tailwind.config.js`.
- **Visual Primitives**: UI is built on `SpotlightCard` and `BentoGrid`. Use global classes `.glass-card`, `.noise-bg`, `.aurora-blob` for atmosphere.
- **Data Source**: Project currently uses static `src/data/mock-*.ts`. `notion-client` dependencies are installed but currently unused/disabled.
- **React Compiler**: Enabled in `next.config.ts`. Manual `useMemo`/`useCallback` is discouraged.
- **View Transitions**: Native CSS view transitions are active (`@view-transition`). Use `.fade-in-up` for entry animations.
- **Icons**: Use `lucide-react` exclusively.
- **CSS Variables**: Theme colors (background, card borders) are defined in `@theme` block in `globals.css`, not root.

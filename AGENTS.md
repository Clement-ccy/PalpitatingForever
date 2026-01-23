# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Commands

### Build and Development
- **Install dependencies:** `npm install`
- **Start development server:** `npm run dev`
- **Build for production:** `npm run build`
- **Start production server:** `npm run start`

### Linting and Quality
- **Run linter:** `npm run lint` (runs `eslint`)
- **Type check:** `npx tsc --noEmit`

### Testing
- **Note:** Currently, no testing framework is configured in this repository. 
- **Recommendation:** If adding tests, use `vitest` or `jest` and update this file with specific commands.

---

## Code Style & Guidelines

### Imports
- Use the `@/` alias for all internal imports (maps to `src/`).
- Import order: 
  1. React/Next.js core hooks and components
  2. External libraries (`lucide-react`, `framer-motion`, etc.)
  3. Internal UI components (`@/components/ui/...`)
  4. Internal logic/utils (`@/lib/...`)
  5. Types/Interfaces
- Use named exports for components and utilities.

### Formatting
- **Indentation:** 2 spaces.
- **Quotes:** Single quotes for strings, except for JSX attributes where double quotes are standard.
- **Semicolons:** Required.
- **Indentation Style:** Standard Prettier-like formatting.

### TypeScript & Types
- **Strict Mode:** TypeScript is configured in strict mode. Avoid `any`.
- **Interfaces vs Types:** Use `interface` for component props and public APIs. Use `type` for unions, intersections, and internal state.
- **Naming:** 
  - Components: `PascalCase` (e.g., `SpotlightCard`).
  - Functions/Variables: `camelCase` (e.g., `handleMouseMove`).
  - Interfaces: `PascalCase` (e.g., `SpotlightCardProps`).
  - Constants: `SCREAMING_SNAKE_CASE` for global constants.

### React Patterns
- **React Compiler:** Enabled in `next.config.ts`. Manual `useMemo` and `useCallback` are generally unnecessary and discouraged unless specific optimization is required.
- **Client Components:** Use `'use client';` directive at the top of files that use browser APIs, hooks, or event listeners.
- **Server Components:** Default to Server Components for data fetching and layout structure.
- **Icons:** Use `lucide-react` exclusively.

### Styling (Tailwind v4)
- **Configuration:** Relies SOLELY on `src/app/globals.css` using the `@theme` block. 
- **DO NOT** create a `tailwind.config.js`.
- **CSS Variables:** Define theme colors (background, card borders, etc.) in the `@theme` block in `globals.css`, not in `:root`.
- **Utility Classes:** Use `cn()` utility from `@/lib/utils` for conditional class merging.
- **Visual Primitives:**
  - Build UI on `SpotlightCard` and `BentoGrid`.
  - Use global classes like `.glass-card`, `.noise-bg`, and `.aurora-blob` for consistent atmosphere.
- **Animations:** 
  - Use `framer-motion` for complex interactive animations.
  - Use native CSS View Transitions (`@view-transition`) for page/navigation transitions.
  - Use the `.fade-in-up` utility for entry animations.

### Data Handling
- **Mock Data:** Current implementation uses static data in `src/data/mock-*.ts`.
- **Notion:** `notion-client` and `react-notion-x` are installed but currently unused. If implementing Notion integration, follow the patterns established in `react-notion-x` documentation.

### Error Handling
- Use React Error Boundaries for UI-level error catching.
- For async operations, use `try...catch` blocks with meaningful error messages or fallback UI states.
- Follow Next.js `error.tsx` and `not-found.tsx` patterns for route-level handling.

---

## Architecture

- **`src/app/`**: Next.js App Router. Contains pages, layouts, and global styles.
- **`src/components/`**: 
  - `ui/`: Reusable, atomic UI components (SpotlightCard, BentoGrid, etc.).
  - `dashboard/`: Feature-specific components for the main dashboard view.
- **`src/data/`**: Static mock data files.
- **`src/lib/`**: Shared utility functions and library initializations.

## Environment Constraints
- **Platform:** win32
- **Node Version:** Ensure compatibility with Next.js 16 and React 19.
- **Git:** This is a git repository. Follow standard commit message conventions.

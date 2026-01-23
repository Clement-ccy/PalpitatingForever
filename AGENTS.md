# AGENTS.md

This file provides guidance to agents when working with code in this repository.

# Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (uses next/core-web-vitals + typescript configs)

# Testing

No test framework is currently configured. When adding tests, check with the user first for preferred testing approach.

# Code Style Guidelines

## Imports & Dependencies
- Use absolute imports with `@/` prefix (configured in tsconfig.json)
- Import React components: `import React from 'react'` for client components, no import needed for server components
- Use `'use client'` directive for components using hooks or browser APIs
- Import utilities: `import { cn } from '@/lib/utils'` for className merging
- Icons: Use `lucide-react` exclusively

## TypeScript & Types
- Strict mode enabled in tsconfig.json
- Use interface definitions for data structures (see `src/data/mock-*.ts`)
- Prefer `React.HTMLAttributes<HTMLDivElement>` for extending component props
- Use `Readonly<{}>` for component prop types when appropriate

## Component Patterns
- Use `SpotlightCard` and `BentoGrid` as base UI primitives
- Apply `.glass-card`, `.noise-bg`, `.aurora-blob` global classes for visual effects
- Use `.fade-in-up` class for entry animations (view transitions enabled)
- Forward refs with `useRef` for DOM manipulation
- Use `cn()` utility for conditional className merging

## Styling & CSS
- **Tailwind v4**: Config relies SOLELY on `src/app/globals.css` (`@theme`). DO NOT create `tailwind.config.js`
- CSS Variables defined in `@theme` block: `--color-background`, `--color-foreground`, `--color-card`, etc.
- Use responsive prefixes: `md:`, `lg:`, `xl:`
- Glass morphism effect: `bg-white/[0.03] backdrop-blur-md border border-white/10`

## Performance & Optimization
- **React Compiler**: Enabled in `next.config.ts`. Manual `useMemo`/`useCallback` is discouraged
- Use native CSS view transitions (`@view-transition`) for page transitions
- Optimize images with Next.js Image component and configured remote patterns

## Data Management
- Currently uses static mock data in `src/data/mock-*.ts`
- `notion-client` dependencies installed but unused/disabled
- When adding data fetching, prefer Next.js data fetching patterns (Server Components, fetch)

## File Structure
- `src/app/` - Next.js app router pages
- `src/components/ui/` - Reusable UI components
- `src/components/dashboard/` - Dashboard-specific components
- `src/data/` - Static data and type definitions
- `src/lib/` - Utility functions

## Naming Conventions
- Components: PascalCase (e.g., `SpotlightCard`, `BentoGrid`)
- Files: kebab-case for utilities, PascalCase for components
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE for exports
- CSS classes: kebab-case with BEM-style when needed

## Error Handling
- Use try-catch blocks for async operations
- Implement proper error boundaries for React components
- Log errors appropriately without exposing sensitive information

# Project-Specific Constraints & Patterns

- **Visual Primitives**: UI is built on `SpotlightCard` and `BentoGrid`. Use global classes `.glass-card`, `.noise-bg`, `.aurora-blob` for atmosphere.
- **Data Source**: Project currently uses static `src/data/mock-*.ts`. `notion-client` dependencies are installed but currently unused/disabled.
- **React Compiler**: Enabled in `next.config.ts`. Manual `useMemo`/`useCallback` is discouraged.
- **View Transitions**: Native CSS view transitions are active (`@view-transition`). Use `.fade-in-up` for entry animations.
- **Icons**: Use `lucide-react` exclusively.
- **CSS Variables**: Theme colors (background, card borders) are defined in `@theme` block in `globals.css`, not root.

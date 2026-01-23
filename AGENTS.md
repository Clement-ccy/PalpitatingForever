# AGENTS.md

This file provides guidance for agentic coding agents operating in this repository.

## Overview and Project Constraints
- Tailwind v4 is used; the global styles live in `src/app/globals.css` with an `@theme` block. Do not add a separate `tailwind.config.js`.
- Visual primitives are `SpotlightCard` and `BentoGrid`. Atmosphere is built with global classes like `.glass-card`, `.noise-bg`, `.aurora-blob`.
- Data sources are currently static under `src/data/mock-*.ts`. The `notion-client` package is installed but not actively used.
- React compiler is enabled in `next.config.ts`; avoid unnecessary manual `useMemo`/`useCallback` optimizations.
- View transitions use native CSS with `@view-transition`; entry animations typically use `.fade-in-up`.
- Icons come from `lucide-react` exclusively.
- Theme colors and CSS variables are defined in the `@theme` block inside `globals.css`.
- Path aliases exist: `@/*` maps to `src/*` via `tsconfig.json`.
- Cursor rules (if present) and Copilot instructions: none found in this repo.

## Build / Lint / Test Commands
- Build for production: `npm run build`.
- Run the dev server: `npm run dev`.
- Run the app in production mode locally after building: `npm run start`.
- Lint the codebase: `npm run lint`.
- Lint with autofix (when safe): `npm run lint -- --fix`.
- Test commands (current repo state): there is no Node.js test script in `package.json`. The repository contains Python-based tests under specialized folders (e.g., `.agents` and `.opencode`).
- Run Python tests (example):
  - All tests: `pytest -q` from the repository root.
  - Specific test file: `pytest .agents/skills/pdf/scripts/check_bounding_boxes_test.py`.
  - Another test file: `pytest .opencode/skills/pdf/scripts/check_bounding_boxes_test.py`.
- Running a single test function in Python: `pytest -q path/to/test_file.py -k <test-name>`.

If you add a Node.js test suite in the future, add a `test` script to `package.json` and document it here.

## Code Style Guidelines
- General
  - Prioritize readability and straightforward logic over clever tricks.
  - Follow established patterns in the codebase (SpotlightCard, BentoGrid, and Tailwind-driven styling).
  - Use ESLint and TypeScript typing to catch issues early.

- Imports
  - External libraries first, then internal modules.
  - Prefer path aliases for internal modules, e.g. `import { X } from '@/lib/x'`.
  - Group imports by source and sort within groups when reasonable.
  - Avoid unused imports; enable ESLint to warn and fix where possible.

- Types and Interfaces
  - Props interfaces should be named `<ComponentName>Props`.
  - Prefer explicit types over `any`.
  - For React components, use simple function components; avoid unnecessary wrappers.
  - Consider `Readonly` where props should be immutable.

- Components and Naming
  - Files use dash-case names (e.g., `spotlight-card.tsx`).
  - Components use PascalCase (e.g., `SpotlightCard`).
  - Export named components; default exports are discouraged to aid readability.

- Formatting and Styling
  - Indentation: 2 spaces. End-of-line semicolons are used consistently.
  - Strings: prefer single quotes for JS/TS code; JSX attributes use double quotes by convention.
  - Tailwind: rely on utility classes; avoid large custom CSS unless necessary.
  - Inline styles: minimize; if used, type as `React.CSSProperties`.
  - Use a `cn` utility (className combiner) when composing multiple classes.

- Error Handling and Resilience
  - Guard against null/undefined DOM access when working with refs.
  - Use try/catch around risky async operations; surface helpful messages and fallbacks.
  - Do not render partial UI on unrecoverable errors; provide fallbacks or placeholders.

- Data and API Access
  - Prefer static mocks for UI predictability; when replacing with APIs, preserve component contracts.
  - Fetching should occur in effects, not in render; avoid side-effects during render.
  - Model API responses with TypeScript types; narrow unknown values early.

- Styling and Theming
  - Theme tokens live in `src/app/globals.css` under `@theme`; do not modify root CSS variables.
  - Use the atmosphere primitives for visual depth: `.glass-card`, `.noise-bg`, `.aurora-blob`.
  - Tailwind classes should reflect deliberate design choices; avoid generic, bland styling.

- Accessibility
  - Ensure interactive controls are keyboard accessible; provide ARIA labels where needed.
  - Prefer semantic HTML when possible; avoid oversized non-semantic containers for interactive regions.

- Testing and Quality
  - Add unit tests for core logic and UI state where feasible.
  - Consider Playwright for E2E tests if the project expands in that direction.

- Git and PR Hygiene
  - Run lint before committing; fix issues proactively.
  - Write concise, why-focused commit messages.
  - Do not commit secrets or credentials.

- Practical Examples
  - Import pattern: `import { SpotlightCard } from '@/components/ui/spotlight-card'`.
  - Props typing:
    ```ts
    export interface SampleProps { title: string; onClick?: () => void }
    export function Sample({ title, onClick }: SampleProps) {
      return <button onClick={onClick}>{title}</button>;
    }
    ```
  - Inline style example:
    ```ts
    const badgeStyle: React.CSSProperties = { background: 'rgba(0,0,0,0.5)' };
    ```

## Next Steps
- If you want, I can tailor these guidelines further to match any additional tools you plan to introduce (e.g., Prettier, Playwright, Vitest).
- I can also add a short README template for new contributors that references this AGENTS.md.

## Development Environment & Review Details
- Recommended local setup: Node.js LTS, Python 3.x, npm, and a Python environment (venv) for tests under `.agents`/`.opencode`.
- Use `eslint` for TypeScript linting and semantic checks; ensure presets align with Next.js and TypeScript rules.
- Run Python tests with `pytest` from the repo root; isolate test runs to target folders when iterating.
- For PRs: ensure lint passes, TypeScript types are sound, and tests (Python) run where applicable.

## Code Review & Quality Gates (Practice)
- Check for readability and intent; prefer explicit types and minimal side effects in components.
- Ensure imports are organized and used; avoid circular imports.
- Verify that UI components respect the existing design system and Tailwind usage.
- Confirm accessibility: keyboard support, ARIA labels, and semantic HTML when possible.
- Review commit messages for clarity: why the change was necessary, not only what changed.
- If security-sensitive changes occur (secrets, keys), exclude them from commits and coordinate with the team.

## Performance & Security Notes
 - Avoid heavy computations in render; rely on browser optimization and React's lifecycle when possible.
 - Be mindful of bundle size; prefer code-splitting and on-demand imports where appropriate.
 - Do not log sensitive information to browser console in production builds.

## Extending the Guidelines
- If you add new tooling (lint config, test harness, etc.), update this file with a short migration note and examples demonstrating expected usage.

## Code Ownership & Review Flow (Practical)
- PRs should include a short summary of intent and impact.
- Assign a reviewer per component area when possible; ensure cross-cutting concerns are considered.
- Run lint locally and validate TypeScript types before opening a PR.
- When tests exist (Python), run them and include a summary of the results in the PR description.

## Tests, Mocks & Data
- Prefer static mocks for UI to keep UI deterministic.
- When tests require network or API calls, rollout mocks/stubs in a dedicated test harness.
- Do not ship secrets in tests or mocks.

## CI / PR Checks
- The repository currently relies on local lint/type checks and Python tests; ensure CI passes for these steps if added.
- Ensure branch is up-to-date with base before pushing.

## Branching & Commits
- Use conventional prefixes: `feat/`, `fix/`, `refactor/`, `chore/`.
- Keep commits focused; one logical change per commit.
- Write commit messages that explain why, not only what.

## Performance Profiling Guidelines
- Use browser DevTools performance tab to measure render/paint; identify long tasks.
- Avoid unnecessary renders; rely on React DevTools to inspect props/state flows.
- Keep expensive operations off the critical render path.

## Accessibility & Internationalization
- Ensure keyboard navigation works for interactive UI.
- Provide aria-labels where needed; avoid low-contrast color combinations.
- If i18n is added, centralize strings; prefer a simple key-based lookup in a shared file.

## Contributor Onboarding
- New contributors should read this AGENTS.md to understand standards.
- Run the build, lint, and tests locally before contributing.

# Boulders Member SPA

A handover-ready React + TypeScript single-page application scaffold for the Boulders climbing community member portal.

<!-- Force deployment refresh --> The frontend ships with typed mock data, a reusable UI system, testing, and deployment automation for GitHub Pages.

## Features

- React 18 + Vite + TypeScript with absolute imports via `@/`
- Routing for `/login`, `/dashboard`, `/classes`, `/activity`, `/profile`, `/payments`
- React Query backed by deterministic in-memory mock API responses
- Theme tokens, accessible UI primitives (Button, Card, Input, Select, Toggle, Modal), and modal manager context
- Recharts integration for activity trends
- Tooling: ESLint, Prettier, Vitest + React Testing Library, Playwright, lint-staged pre-commit hooks
- GitHub Actions pipelines for CI and GitHub Pages deployment with SPA-friendly 404 fallback

## Getting Started

1. Install dependencies (Node.js 20+ recommended):
   ```bash
   npm install
   ```
2. Install Playwright browsers once before running E2E tests:
   ```bash
   npx playwright install --with-deps
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   The app is available at http://localhost:5173.

## Scripts

| Command              | Description                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `npm run dev`        | Start the Vite dev server                                                                |
| `npm run build`      | Type-check and build the production bundle (copies `dist/index.html` to `dist/404.html`) |
| `npm run preview`    | Preview the production build locally                                                     |
| `npm run lint`       | Run ESLint across the project                                                            |
| `npm run test`       | Execute Vitest unit/component tests                                                      |
| `npm run test:watch` | Run Vitest in watch mode                                                                 |
| `npm run test:e2e`   | Run Playwright end-to-end smoke tests                                                    |
| `npm run format`     | Format files with Prettier                                                               |

Enable pre-commit hooks once per clone:

```bash
npm run hooks
```

This wires `simple-git-hooks` + `lint-staged` to lint and format staged files.

## Project Structure

```
├── public/              # Static assets (favicon, etc.)
├── src/
│   ├── components/      # Reusable UI primitives and layout pieces
│   ├── context/         # Global contexts (modal manager)
│   ├── data/            # Mock API + React Query keys
│   ├── hooks/           # Data fetching hooks
│   ├── lib/             # Helpers (formatters, utils)
│   ├── pages/           # Route-level views
│   ├── providers/       # Application-wide providers
│   ├── routes/          # Route configuration & layout shell
│   ├── styles/          # Global styles and design tokens
│   └── mocks/           # (Reserved for future mocking utilities)
├── tests/e2e/           # Playwright smoke tests
├── scripts/             # Build/deploy helpers
└── docs/                # Additional architecture + design docs
```

## Data & Query Layer

React Query orchestrates data fetching against the typed mock API located in `src/data/mockApi.ts`. All responses are deterministic, making the UI predictable without a backend. Query keys are defined in `src/data/queryKeys.ts`, and dedicated hooks live inside `src/hooks/`.

## UI System

Design tokens live in `src/styles/tokens.css` and `src/styles/theme.ts`. Global styles (`src/styles/global.css`) import tokens, layout primitives, and component utility classes. Core UI primitives reside in `src/components/ui/`.

See `/docs/ui-tokens.md` for the full token catalogue.

## Testing Strategy

- **Unit / Component**: Vitest + Testing Library (`npm run test`). Jest DOM matchers are configured in `src/setupTests.ts`.
- **E2E**: Playwright smoke test under `tests/e2e/`. Install browsers with `npx playwright install --with-deps` before the first run.

## Deployment

GitHub Actions runs CI on every push/PR (`.github/workflows/ci.yml`) and deploys the site to GitHub Pages (`.github/workflows/deploy.yml`). The build step automatically creates `dist/404.html` from `dist/index.html` to support SPA routing refreshes on Pages.

## Additional Documentation

- [`docs/architecture.md`](docs/architecture.md): Architecture overview and data flow
- [`docs/routes.md`](docs/routes.md): Route map and URL parameters
- [`docs/ui-tokens.md`](docs/ui-tokens.md): Design tokens and usage notes

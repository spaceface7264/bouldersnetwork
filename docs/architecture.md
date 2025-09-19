# Architecture Overview

## Application Layers

1. **Entry & Providers** (`src/main.tsx`, `src/providers/AppProviders.tsx`)
   - Bootstraps React, wraps the app with React Query, React Router, and the modal manager context.
2. **Routing Shell** (`src/routes/`)
   - `MainLayout` hosts the persistent navigation and header.
   - `AppRoutes` maps the required member experiences (`/login`, `/dashboard`, `/classes`, `/activity`, `/profile`, `/payments`).
3. **Pages & Features** (`src/pages/`)
   - Each page composes UI primitives with data hooks. No business logic lives inside reusable components.
4. **UI System** (`src/components/ui/`, `src/styles/`)
   - Accessible, theme-aware primitives (Card, Button, Input, Select, Toggle, Modal) powered by global tokens.
5. **Data Layer** (`src/data/`, `src/hooks/`)
   - React Query orchestrates deterministic mock API responses. Hooks encapsulate query keys and typing.

## Data Flow

```
Page component → Domain hook (src/hooks) → React Query cache → Mock API (src/data/mockApi.ts)
```

- Hooks own the query key and fetch function, keeping components declarative.
- Mock API responses are typed via `src/types/api.ts` and resolved after a short delay to mimic network latency.
- React Query caching keeps derived UI (cards, charts, modals) in sync across the app.

## State Management

- Global state is intentionally minimal.
- The **ModalProvider** (`src/context/ModalContext.tsx`) exposes `openModal` / `closeModal` to any subtree via `useModal`.
- Local component state handles ephemeral UI concerns (e.g., profile preference toggles).

## Styling & Theming

- Design tokens live in `src/styles/tokens.css` and the TypeScript mirror `src/styles/theme.ts`.
- Global resets and layout primitives reside in `src/styles/global.css` and `src/styles/layout.css`.
- UI classes (`ui-button`, `ui-card`, etc.) ensure consistent styling without a full component library dependency.

## Testing

- Vitest + Testing Library cover components and hooks.
- Playwright performs a smoke regression, validating routing and navigation with the in-memory data.

## Extensibility Notes

- Replace `mockApi` implementations with real network calls without touching consumer hooks.
- Extend the modal manager by adding contextual metadata (size, non-dismissable) through the shared `ModalContent` shape.
- Introduce new routes by adding page components and registering them inside `AppRoutes`.

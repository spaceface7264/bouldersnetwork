# UI Tokens

Design tokens live in `src/styles/tokens.css` with a TypeScript mirror (`src/styles/theme.ts`). Values leverage CSS custom properties for runtime theming.

## Colors

| Token                    | Value                    | Usage               |
| ------------------------ | ------------------------ | ------------------- |
| `--color-bg`             | `#0f172a`                | Global background   |
| `--color-surface`        | `#111827`                | Cards, panels       |
| `--color-surface-muted`  | `#1f2937`                | Secondary surfaces  |
| `--color-border`         | `#27364a`                | Standard borders    |
| `--color-border-strong`  | `#3b4d65`                | Emphasized borders  |
| `--color-text-primary`   | `#f8fafc`                | Primary text        |
| `--color-text-secondary` | `#cbd5f5`                | Secondary text      |
| `--color-text-muted`     | `#94a3b8`                | Helper copy         |
| `--color-accent`         | `#38bdf8`                | Buttons, highlights |
| `--color-accent-strong`  | `#0ea5e9`                | Accent hover/focus  |
| `--color-success`        | `#34d399`                | Success labels      |
| `--color-warning`        | `#facc15`                | Warning status      |
| `--color-danger`         | `#f87171`                | Error states        |
| `--color-overlay`        | `rgba(15, 23, 42, 0.75)` | Modal backdrop      |

## Spacing

| Token           | Value     |
| --------------- | --------- |
| `--spacing-xxs` | `0.25rem` |
| `--spacing-xs`  | `0.5rem`  |
| `--spacing-sm`  | `0.75rem` |
| `--spacing-md`  | `1rem`    |
| `--spacing-lg`  | `1.5rem`  |
| `--spacing-xl`  | `2rem`    |
| `--spacing-xxl` | `3rem`    |

## Radii

| Token         | Value     |
| ------------- | --------- |
| `--radius-sm` | `0.5rem`  |
| `--radius-md` | `0.75rem` |
| `--radius-lg` | `1rem`    |

## Typography

| Token             | Value      |
| ----------------- | ---------- |
| `--font-size-xs`  | `0.75rem`  |
| `--font-size-sm`  | `0.875rem` |
| `--font-size-md`  | `1rem`     |
| `--font-size-lg`  | `1.25rem`  |
| `--font-size-xl`  | `1.5rem`   |
| `--font-size-xxl` | `2rem`     |

## Effects

| Token               | Value                                     |
| ------------------- | ----------------------------------------- |
| `--shadow-sm`       | `0 10px 15px -3px rgba(15, 23, 42, 0.35)` |
| `--shadow-md`       | `0 20px 25px -5px rgba(15, 23, 42, 0.35)` |
| `--shadow-lg`       | `0 25px 50px -12px rgba(15, 23, 42, 0.4)` |
| `--transition-base` | `150ms ease-in-out`                       |

### Usage Tips

- Import `src/styles/global.css` once (already done in `src/main.tsx`) to register tokens.
- Access variables via CSS (`color: var(--color-text-primary)`) or use the TypeScript mirror (`theme.colors.accent`) inside components.
- Tokens are scoped to `:root`, enabling future theming by toggling the root class or swapping token files.

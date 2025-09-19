export const theme = {
  colors: {
    background: 'var(--color-bg)',
    surface: 'var(--color-surface)',
    surfaceMuted: 'var(--color-surface-muted)',
    border: 'var(--color-border)',
    borderStrong: 'var(--color-border-strong)',
    textPrimary: 'var(--color-text-primary)',
    textSecondary: 'var(--color-text-secondary)',
    textMuted: 'var(--color-text-muted)',
    accent: 'var(--color-accent)',
    accentStrong: 'var(--color-accent-strong)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
    overlay: 'var(--color-overlay)',
  },
  spacing: {
    xxs: 'var(--spacing-xxs)',
    xs: 'var(--spacing-xs)',
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
    xl: 'var(--spacing-xl)',
    xxl: 'var(--spacing-xxl)',
  },
  radii: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
  },
  fontSizes: {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    md: 'var(--font-size-md)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
    xxl: 'var(--font-size-xxl)',
  },
  shadows: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
  },
  transitions: {
    base: 'var(--transition-base)',
  },
} as const

export type Theme = typeof theme

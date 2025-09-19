import { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface CardProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
  children?: ReactNode
  className?: string
}

export function Card({ title, subtitle, actions, children, className }: CardProps) {
  return (
    <div className={cn('ui-card', className)}>
      {(title || subtitle || actions) && (
        <header
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: title || subtitle ? 'var(--spacing-lg)' : 0,
            gap: 'var(--spacing-md)',
          }}
        >
          <div style={{ minWidth: 0 }}>
            {title && (
              <h3
                style={{
                  margin: 0,
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: subtitle ? 'var(--spacing-xs)' : 0,
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </header>
      )}
      {children && <div>{children}</div>}
    </div>
  )
} 
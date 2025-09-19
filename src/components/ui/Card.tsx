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
    <section className={cn('ui-card', className)}>
      {(title || subtitle || actions) && (
        <header
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--spacing-sm)',
            alignItems: 'center',
            marginBottom: 'var(--spacing-lg)',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {title && (
              <h2
                style={{
                  margin: 0,
                  fontSize: 'var(--font-size-lg)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  marginTop: 'var(--spacing-xxs)',
                  marginBottom: 0,
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div style={{ marginLeft: 'auto' }}>{actions}</div>}
        </header>
      )}
      <div>{children}</div>
    </section>
  )
}

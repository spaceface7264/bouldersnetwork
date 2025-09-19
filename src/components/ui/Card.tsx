import { ReactNode, useState } from 'react'
import { cn } from '@/lib/cn'
import { Button } from './Button'

interface CardProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
  children?: ReactNode
  className?: string
  editable?: boolean
  onEdit?: () => void
  premium?: boolean
  interactive?: boolean
  onClick?: () => void
  badge?: string
  status?: 'success' | 'warning' | 'info' | 'premium'
}

export function Card({ 
  title, 
  subtitle, 
  actions, 
  children, 
  className,
  editable = false,
  onEdit,
  premium = false,
  interactive = false,
  onClick,
  badge,
  status
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const cardClassName = cn(
    'ui-card',
    premium && 'ui-card--premium',
    interactive && 'ui-card--interactive',
    className
  )

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.()
  }

  const StatusBadge = () => {
    if (!status) return null
    
    return (
      <div className={cn('ui-badge', `ui-badge--${status}`)}>
        {status === 'success' && '✓'}
        {status === 'warning' && '⚠'}
        {status === 'info' && 'ℹ'}
        {status === 'premium' && '👑'}
        {badge || status}
      </div>
    )
  }

  return (
    <section 
      className={cardClassName}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: interactive ? 'pointer' : 'default'
      }}
    >
      {(title || subtitle || actions || editable || status) && (
        <header
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--spacing-sm)',
            alignItems: 'flex-start',
            marginBottom: 'var(--spacing-xl)',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {title && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: subtitle ? 'var(--spacing-xs)' : 0 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </h2>
                <StatusBadge />
              </div>
            )}
            {subtitle && (
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--font-size-md)',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.4,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-sm)',
            marginLeft: 'auto',
            flexShrink: 0
          }}>
            {editable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="ui-button--edit"
                aria-label="Edit section"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity var(--transition-base)'
                }}
              >
                ✏️
              </Button>
            )}
            {actions}
          </div>
        </header>
      )}
      <div>{children}</div>
    </section>
  )
} 
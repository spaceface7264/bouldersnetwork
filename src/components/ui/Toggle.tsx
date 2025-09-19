import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  id?: string
  checked: boolean
  onChange: (value: boolean) => void
  label?: string
  description?: string
}

export function Toggle({
  id,
  checked,
  onChange,
  label,
  description,
  className,
  ...props
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={label ? `${id}-label` : undefined}
      aria-describedby={description ? `${id}-description` : undefined}
      className={cn('ui-toggle', className)}
      id={id}
      onClick={() => onChange(!checked)}
      {...props}
    >
      <span
        className="ui-toggle__track"
        data-state={checked ? 'on' : 'off'}
        aria-hidden="true"
      >
        <span className="ui-toggle__thumb" />
      </span>
      <span>
        {label && (
          <span
            id={label ? `${id}-label` : undefined}
            style={{ display: 'block', fontWeight: 600 }}
          >
            {label}
          </span>
        )}
        {description && (
          <span
            id={description ? `${id}-description` : undefined}
            style={{
              display: 'block',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
            }}
          >
            {description}
          </span>
        )}
      </span>
    </button>
  )
}

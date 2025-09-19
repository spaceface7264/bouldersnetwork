import { forwardRef, SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
  containerClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { id, label, hint, error, className, containerClassName, children, ...props },
    ref,
  ) => (
    <div className={containerClassName}>
      {label && (
        <label className="ui-label" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn('ui-select', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        {...props}
      >
        {children}
      </select>
      {hint && !error && (
        <div id={id ? `${id}-hint` : undefined} className="ui-field-hint">
          {hint}
        </div>
      )}
      {error && <div className="ui-field-error">{error}</div>}
    </div>
  ),
)

Select.displayName = 'Select'

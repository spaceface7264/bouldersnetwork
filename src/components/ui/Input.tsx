import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, hint, error, className, containerClassName, ...props }, ref) => (
    <div className={containerClassName}>
      {label && (
        <label className="ui-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn('ui-input', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <div id={id ? `${id}-hint` : undefined} className="ui-field-hint">
          {hint}
        </div>
      )}
      {error && <div className="ui-field-error">{error}</div>}
    </div>
  ),
)

Input.displayName = 'Input'

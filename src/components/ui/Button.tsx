import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, type = 'button', ...props }, ref) => {
    const variantClass =
      variant === 'secondary'
        ? 'ui-button--secondary'
        : variant === 'ghost'
          ? 'ui-button--ghost'
          : undefined

    return (
      <button
        ref={ref}
        className={cn('ui-button', `ui-button--${size}`, variantClass, className)}
        type={type}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

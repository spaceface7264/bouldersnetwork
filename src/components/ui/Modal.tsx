import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
}: ModalProps) {
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeydown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="ui-modal__overlay" role="presentation">
      <button
        type="button"
        className="ui-modal__backdrop"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div
        className="ui-modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-description' : undefined}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <h2 id="modal-title" style={{ margin: 0, fontSize: 'var(--font-size-xl)' }}>
              {title}
            </h2>
            {description && (
              <p
                id="modal-description"
                style={{
                  marginTop: 'var(--spacing-xs)',
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                {description}
              </p>
            )}
          </div>
          <Button aria-label="Close modal" variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </header>
        <div style={{ marginTop: 'var(--spacing-lg)' }}>{children}</div>
        {actions && (
          <footer
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--spacing-sm)',
              marginTop: 'var(--spacing-xl)',
            }}
          >
            {actions}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  )
}

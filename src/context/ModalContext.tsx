import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { Modal } from '@/components/ui/Modal'

interface ModalContent {
  title: string
  description?: string
  content: ReactNode
  actions?: ReactNode
}

interface ModalContextValue {
  openModal: (modal: ModalContent) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalContent | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setModal(null)
  }, [])

  const openModal = useCallback((nextModal: ModalContent) => {
    setModal(nextModal)
    setIsOpen(true)
  }, [])

  const value = useMemo(
    () => ({
      openModal,
      closeModal,
    }),
    [openModal, closeModal],
  )

  return (
    <ModalContext.Provider value={value}>
      {children}
      <Modal
        isOpen={isOpen && Boolean(modal)}
        onClose={closeModal}
        title={modal?.title ?? ''}
        description={modal?.description}
        actions={modal?.actions}
      >
        {modal?.content ?? null}
      </Modal>
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

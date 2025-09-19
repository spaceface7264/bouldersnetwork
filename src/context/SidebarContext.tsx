import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface SidebarContextValue {
  isOpen: boolean
  isCollapsed: boolean
  toggle: () => void
  collapse: () => void
  expand: () => void
  close: () => void
  open: () => void
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  // On mobile, sidebar starts closed. On desktop, it starts expanded but can be collapsed
  const [isOpen, setIsOpen] = useState(false) // For mobile overlay
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved === 'true'
  })

  // Save collapse state
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed.toString())
  }, [isCollapsed])

  // Handle window resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setIsOpen(false) // Close mobile overlay on desktop
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle escape key
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeydown)
      return () => window.removeEventListener('keydown', handleKeydown)
    }
  }, [isOpen])

  const toggle = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(!isOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  const collapse = () => setIsCollapsed(true)
  const expand = () => setIsCollapsed(false)
  const close = () => setIsOpen(false)
  const open = () => setIsOpen(true)

  const value = {
    isOpen,
    isCollapsed,
    toggle,
    collapse,
    expand,
    close,
    open,
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

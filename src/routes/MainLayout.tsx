import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useMemberProfile } from '@/hooks/useMemberProfile'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/context/ThemeContext'
import { cn } from '@/lib/cn'

const navigation = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/classes', label: 'Classes' },
  { path: '/activity', label: 'Activity' },
  { path: '/profile', label: 'Profile' },
  { path: '/payments', label: 'Payments' },
]

export function MainLayout() {
  const { data: member } = useMemberProfile()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') {
      return true
    }

    return window.matchMedia('(min-width: 1024px)').matches
  })
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') {
      return true
    }

    return window.matchMedia('(min-width: 1024px)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(min-width: 1024px)')
    const handleChange = () => {
      const matches = media.matches
      setIsDesktop(matches)
      setIsSidebarOpen(matches)
    }

    handleChange()
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  function handleLogout() {
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  return (
    <div className={cn('app-shell', isSidebarOpen ? 'app-shell--sidebar-open' : 'app-shell--sidebar-collapsed')}>
      <aside
        id="app-sidebar"
        className={cn('app-sidebar', isSidebarOpen ? 'app-sidebar--open' : 'app-sidebar--collapsed')}
        aria-hidden={!isSidebarOpen && !isDesktop ? true : undefined}
      >
        <div className="app-logo">
          <img 
            src="https://storage.googleapis.com/boulderscss/logo-flat-white.png" 
            alt="Boulders Logo" 
            className="app-logo-image"
          />
        </div>
        <nav className="app-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(isActive && 'active')}
              title={item.label}
              data-initial={item.label.slice(0, 1).toUpperCase()}
              aria-label={isSidebarOpen ? undefined : item.label}
              onClick={!isDesktop ? () => setIsSidebarOpen(false) : undefined}
            >
              <span className="app-nav__label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="app-main">
        <header className="app-header">
          <div className="app-header__left">
            <button
              type="button"
              className="app-sidebar-toggle"
              onClick={() => setIsSidebarOpen((value) => !value)}
              aria-expanded={isSidebarOpen}
              aria-controls="app-sidebar"
              aria-label={isSidebarOpen ? 'Collapse sidebar navigation' : 'Expand sidebar navigation'}
            >
              <span className="app-sidebar-toggle__icon" aria-hidden>
                {isSidebarOpen ? '⟨⟨' : '⟩⟩'}
              </span>
              <span className="app-sidebar-toggle__label">
                {isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              </span>
            </button>
            <div className="app-header__intro">
              <h1>
                {member ? `Hi, ${member.name.split(' ')[0]}` : 'Loading member...'}
              </h1>
              <p>Track your climbing journey and upcoming sessions.</p>
            </div>
          </div>
          <div className="app-header__actions">
            <ThemeToggle />
            <Button variant="secondary">View Announcements</Button>
            <Button variant="ghost" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </header>
        {!isDesktop && isSidebarOpen ? (
          <button
            type="button"
            className="app-sidebar-overlay"
            aria-label="Close sidebar navigation"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}
        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

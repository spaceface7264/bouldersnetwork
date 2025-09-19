import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useMemberProfile } from '@/hooks/useMemberProfile'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/context/ThemeContext'
import { useSidebar } from '@/context/SidebarContext'
import { cn } from '@/lib/cn'

const navigation = [
  { path: '/dashboard', label: 'Dashboard', icon: '■' },
  { path: '/classes', label: 'Classes', icon: '●' },
  { path: '/activity', label: 'Activity', icon: '▲' },
  { path: '/profile', label: 'Profile', icon: '◆' },
  { path: '/payments', label: 'Billing', icon: '♦' },
]

export function MainLayout() {
  const { data: member } = useMemberProfile()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isOpen, isCollapsed, toggle, close } = useSidebar()

  function handleLogout() {
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  return (
    <>
      <div className={cn(
        'app-shell',
        isOpen && 'app-shell--sidebar-open',
        isCollapsed && !isMobile && 'app-shell--sidebar-collapsed'
      )}>
        {/* Mobile overlay */}
        {isMobile && (
          <div 
            className="sidebar-overlay" 
            onClick={close}
            style={{ 
              opacity: isOpen ? 1 : 0,
              pointerEvents: isOpen ? 'auto' : 'none' 
            }}
          />
        )}

        <aside className="app-sidebar">
          {/* Sidebar Toggle Button */}
          <button
            onClick={toggle}
            className="sidebar-toggle"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="currentColor"
              style={{ 
                transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform var(--transition)'
              }}
            >
              <path d="M10.5 8L6.5 4v8l4-4z"/>
            </svg>
          </button>

          {/* Logo */}
          <div className="app-logo">
            <img 
              src="https://storage.googleapis.com/boulderscss/logo-flat-white.png" 
              alt="Boulders Logo" 
              className="app-logo-image"
              style={{
                height: '32px',
                width: 'auto',
              }}
            />
            <span className="app-logo__text">Member Portal</span>
          </div>
          
          {/* Member Info */}
          {member && (
            <div className="member-info">
              <div className="member-info__avatar">
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="member-info__details">
                <div className="member-info__name">
                  {member.name}
                </div>
                <div className="member-info__tier">
                  {member.membershipTier}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="app-nav">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                data-tooltip={item.label}
                className={({ isActive }) => cn(isActive && 'active')}
                onClick={() => isMobile && close()}
              >
                <span className="app-nav__icon">
                  {item.icon}
                </span>
                <span className="app-nav__text">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Theme Toggle at bottom */}
          <div className="sidebar-theme-toggle">
            <ThemeToggle />
          </div>
        </aside>

        <main className="app-main">
          <header className="app-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              {/* Mobile menu button */}
              {isMobile && (
                <button
                  onClick={toggle}
                  style={{
                    padding: 'var(--spacing-xs)',
                    background: 'transparent',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd"/>
                  </svg>
                </button>
              )}
              <h1 style={{ margin: 0, fontSize: 'var(--font-size-xl)' }}>
                {member ? `Hi, ${member.name.split(' ')[0]}` : 'Loading member...'}
              </h1>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
              <Button variant="secondary">View Announcements</Button>
              <Button variant="ghost" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </header>
          
          <div className="app-content">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  )
}
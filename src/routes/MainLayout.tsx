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

  function handleLogout() {
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
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
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="app-main">
        <header className="app-header">
          <div>
            <h1 style={{ margin: 0, fontSize: 'var(--font-size-xl)' }}>
              {member ? `Hi, ${member.name.split(' ')[0]}` : 'Loading member...'}
            </h1>
            <p
              style={{ marginTop: 'var(--spacing-xs)', color: 'var(--color-text-muted)' }}
            >
              Track your climbing journey and upcoming sessions.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
            <ThemeToggle />
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
  )
}

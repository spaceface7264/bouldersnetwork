import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useMemberProfile } from '@/hooks/useMemberProfile'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const navigation = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊', description: 'Overview & stats' },
  { path: '/classes', label: 'Classes', icon: '🧗‍♂️', description: 'Sessions & training' },
  { path: '/activity', label: 'Activity', icon: '📈', description: 'Progress tracking' },
  { path: '/profile', label: 'Profile', icon: '👤', description: 'Account settings' },
  { path: '/payments', label: 'Billing', icon: '💳', description: 'Payments & plans' },
]

const quickActions = [
  { label: 'Book Session', icon: '📅', color: 'var(--color-accent)' },
  { label: 'Check In', icon: '🎯', color: 'var(--color-secondary)' },
  { label: 'View Routes', icon: '🗺️', color: 'var(--color-warning)' },
]

export function MainLayout() {
  const { data: member } = useMemberProfile()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  function handleLogout() {
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  function getPageTitle() {
    const currentNav = navigation.find(nav => nav.path === location.pathname)
    return currentNav?.label || 'Dashboard'
  }

  function getPageDescription() {
    const currentNav = navigation.find(nav => nav.path === location.pathname)
    return currentNav?.description || 'Track your climbing journey and upcoming sessions'
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        {/* Premium Logo */}
        <div className="app-logo">
          <span role="img" aria-label="boulder" style={{ fontSize: '1.5em' }}>
            🧗
          </span>
          <div>
            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
              Boulders
            </div>
            <div style={{ 
              fontSize: 'var(--font-size-xs)', 
              color: 'var(--color-accent)',
              fontWeight: 600,
              letterSpacing: '0.1em'
            }}>
              MEMBER PORTAL
            </div>
          </div>
        </div>

        {/* Member Info Card */}
        {member && (
          <div style={{
            padding: 'var(--spacing-lg)',
            background: 'linear-gradient(135deg, var(--color-surface-elevated), var(--color-surface-muted))',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            marginBottom: 'var(--spacing-xl)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              background: 'var(--color-accent)',
              color: 'white',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 600,
              borderBottomLeftRadius: 'var(--radius-md)'
            }}>
              PREMIUM
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)'
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-accent), var(--color-secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--font-size-lg)',
                fontWeight: 700,
                color: 'white',
                flexShrink: 0
              }}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: 'var(--font-size-md)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {member.name.split(' ')[0]}
                </div>
                <div style={{ 
                  fontSize: 'var(--font-size-xs)', 
                  color: 'var(--color-text-muted)' 
                }}>
                  {member.membershipTier}
                </div>
              </div>
            </div>
            <div style={{ 
              fontSize: 'var(--font-size-xs)', 
              color: 'var(--color-accent)',
              fontWeight: 600
            }}>
              🔥 {Math.floor(Math.random() * 10) + 5} day streak
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="app-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'ui-hover-lift',
                isActive && 'active'
              )}
              style={{ textDecoration: 'none' }}
            >
              <span style={{ fontSize: '1.2em' }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{item.label}</div>
                <div style={{ 
                  fontSize: 'var(--font-size-xs)', 
                  color: 'var(--color-text-muted)',
                  marginTop: '2px'
                }}>
                  {item.description}
                </div>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Quick Actions */}
        <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-xl)' }}>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--spacing-md)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Quick Actions
          </div>
          <div style={{ display: 'grid', gap: 'var(--spacing-xs)' }}>
            {quickActions.map((action) => (
              <button
                key={action.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  width: '100%',
                  textAlign: 'left'
                }}
                className="ui-hover-lift"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.color
                  e.currentTarget.style.background = action.color + '10'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="app-main">
        {/* Enhanced Header */}
        <header className="app-header">
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: 'var(--font-size-xxl)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-accent) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {getPageTitle()}
            </h1>
            <p style={{ 
              marginTop: 'var(--spacing-sm)', 
              color: 'var(--color-text-muted)',
              fontSize: 'var(--font-size-lg)',
              margin: 0
            }}>
              {getPageDescription()}
            </p>
          </div>
          
          <div className="action-bar">
            {/* Notifications */}
            <button
              style={{
                position: 'relative',
                padding: 'var(--spacing-sm)',
                background: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)'
              }}
              className="ui-hover-lift"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.color = 'var(--color-accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.color = 'var(--color-text-secondary)'
              }}
            >
              🔔
              <div style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                background: 'var(--color-accent)',
                borderRadius: '50%',
                fontSize: 0
              }} />
            </button>

            <Button variant="secondary" className="ui-hover-lift">
              📢 Announcements
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="ui-hover-lift">
              👋 Sign Out
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="app-content">
          <Outlet />
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: 'auto',
          paddingTop: 'var(--spacing-xl)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--spacing-md)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)'
        }}>
          <div>
            © 2024 Boulders.dk • Premium Member Portal
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Support</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          </div>
        </footer>
      </main>
    </div>
  )
} 
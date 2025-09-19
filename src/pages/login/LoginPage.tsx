import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/context/ThemeContext'

export function LoginPage() {
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg)',
      }}
    >
      {/* Header with theme toggle */}
      <header
        style={{
          padding: 'var(--spacing-lg) var(--spacing-xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
          }}
        >
          <img 
            src="https://storage.googleapis.com/boulderscss/logo-flat-white.png" 
            alt="Boulders Logo" 
            className="login-logo"
            style={{
              height: '32px',
              width: 'auto',
            }}
          />
          <span
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            Member Portal
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          placeItems: 'center',
          padding: 'var(--spacing-xl)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Card>
            <div style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
              <h1
                style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-sm)',
                }}
              >
                Member Login
              </h1>
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                }}
              >
                Sign in to access your climbing portal
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: 'grid', gap: 'var(--spacing-lg)' }}
            >
              <Input
                id="email"
                type="email"
                label="Email"
                required
                placeholder="member@boulders.dk"
              />
              <Input
                id="password"
                type="password"
                label="Password"
                required
                placeholder="Enter your password"
              />
              
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '3px',
                    }}
                  />
                  Remember me
                </label>
                <a
                  href="/forgot-password"
                  style={{
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                  }}
                >
                  Forgot password?
                </a>
              </div>

              <Button 
                type="submit" 
                variant="secondary"
                style={{ 
                  marginTop: 'var(--spacing-sm)',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid #e5e5e5'
                }}
              >
                Sign in
              </Button>
            </form>

            <div
              style={{
                marginTop: 'var(--spacing-xl)',
                paddingTop: 'var(--spacing-lg)',
                borderTop: '1px solid var(--color-border)',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                }}
              >
                New member?{' '}
                <a
                  href="/signup"
                  style={{
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Sign up.
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: 'var(--spacing-lg) var(--spacing-xl)',
          textAlign: 'center',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <p style={{ margin: 0 }}>
          © 2024 Boulders.dk • Member Portal •{' '}
          <a
            href="https://boulders.dk/privacy"
            style={{
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Privacy Policy
          </a>
          {' • '}
          <a
            href="https://boulders.dk/terms"
            style={{
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Terms of Service
          </a>
        </p>
      </footer>
    </div>
  )
}

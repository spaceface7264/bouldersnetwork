import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/context/ThemeContext'

interface LoginError {
  errorCode: string
  errorMessage: string
  fieldErrors?: Array<{
    field: string
    errorCode: string
    errorMessage: string
  }>
}

export function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<LoginError | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Demo mode - simulate different scenarios based on username
      if (formData.username === 'demo@boulders.dk') {
        // Simulate successful login
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
        localStorage.setItem('accessToken', 'demo-access-token')
        localStorage.setItem('refreshToken', 'demo-refresh-token')
        navigate('/dashboard')
        return
      } else if (formData.username === 'error@test.com') {
        // Simulate validation errors
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setError({
          errorCode: 'INVALID_INPUT',
          errorMessage: 'Please correct the errors below.',
          fieldErrors: [
            {
              field: 'username',
              errorCode: 'INVALID_EMAIL',
              errorMessage: 'Please enter a valid email address.',
            },
            {
              field: 'password',
              errorCode: 'PASSWORD_TOO_SHORT',
              errorMessage: 'Password must be at least 8 characters long.',
            },
          ],
        })
        return
      } else if (formData.username === 'invalid@test.com') {
        // Simulate authentication failure
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setError({
          errorCode: 'INVALID_CREDENTIALS',
          errorMessage:
            'Invalid email or password. Please check your credentials and try again.',
        })
        return
      }

      // Real API call - replace with actual authentication endpoint
      const response = await fetch('/api/ver3/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const errorData: LoginError = await response.json()
        setError(errorData)
        return
      }

      const { accessToken, refreshToken } = await response.json()

      // Store tokens securely
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      // Navigate to dashboard
      navigate('/dashboard')
    } catch (err) {
      // Handle network errors
      setError({
        errorCode: 'NETWORK_ERROR',
        errorMessage:
          'Unable to connect to the server. Please check your internet connection and try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  function getFieldError(fieldName: string): string | undefined {
    return error?.fieldErrors?.find((fe) => fe.field === fieldName)?.errorMessage
  }

  function handleInputChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear field-specific errors when user starts typing
    if (error?.fieldErrors) {
      setError((prev) =>
        prev
          ? {
              ...prev,
              fieldErrors: prev.fieldErrors?.filter((fe) => fe.field !== field),
            }
          : null,
      )
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Animated Gradient Background */}
      <div className="gradient-bg">
        <div className="gradient-wave wave-1"></div>
        <div className="gradient-wave wave-2"></div>
        <div className="gradient-wave wave-3"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      {/* Header with theme toggle */}
      <header
        style={{
          padding: 'var(--spacing-lg) var(--spacing-xl)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
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
            {/* Logo at top of login card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginBottom: 'var(--spacing-xl)',
                gap: 'var(--spacing-sm)',
              }}
            >
              <img
                src="https://storage.googleapis.com/boulderscss/logo-flat-white.png"
                alt="Boulders Logo"
                className="login-logo"
                style={{
                  height: '48px',
                  width: 'auto',
                }}
              />
              <span
                style={{
                  fontSize: 'var(--font-size-md)',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-md)',
                }}
              ></span>
              <h1
                style={{
                  display: 'none',
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-sm)',
                  margin: 0,
                }}
              >
                Sign in
              </h1>
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                }}
              >
                Sign in to Boulders
              </p>

              {/* Demo Credentials */}
              <div
                style={{
                  background: 'var(--color-info)',
                  color: 'white',
                  padding: 'var(--spacing-sm)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-size-xs)',
                  marginTop: 'var(--spacing-md)',
                }}
              >
                <strong>Demo Credentials:</strong>
                <br />• <code>demo@boulders.dk</code> - Successful login
                <br />• <code>error@test.com</code> - Field validation errors
                <br />• <code>invalid@test.com</code> - Authentication failure
              </div>
            </div>

            {/* General Error Display */}
            {error && !error.fieldErrors && (
              <div
                style={{
                  padding: 'var(--spacing-md)',
                  background: 'var(--color-danger)',
                  color: 'white',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-size-sm)',
                  marginBottom: 'var(--spacing-lg)',
                }}
              >
                <strong>{error.errorCode}:</strong> {error.errorMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: 'grid', gap: 'var(--spacing-lg)' }}
            >
              <div>
                <Input
                  id="username"
                  type="text"
                  label="Username or Email"
                  required
                  placeholder="member@boulders.dk"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
                {getFieldError('username') && (
                  <div
                    style={{
                      color: 'var(--color-danger)',
                      fontSize: 'var(--font-size-xs)',
                      marginTop: 'var(--spacing-xs)',
                    }}
                  >
                    {getFieldError('username')}
                  </div>
                )}
              </div>

              <div>
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
                {getFieldError('password') && (
                  <div
                    style={{
                      color: 'var(--color-danger)',
                      fontSize: 'var(--font-size-xs)',
                      marginTop: 'var(--spacing-xs)',
                    }}
                  >
                    {getFieldError('password')}
                  </div>
                )}
              </div>

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
                disabled={isLoading}
                style={{
                  marginTop: 'var(--spacing-sm)',
                  backgroundColor: isLoading ? 'var(--color-surface-muted)' : 'white',
                  color: isLoading ? 'var(--color-text-disabled)' : 'black',
                  border: '1px solid #e5e5e5',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
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

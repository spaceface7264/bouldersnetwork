import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

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
        display: 'grid',
        placeItems: 'center',
        padding: 'var(--spacing-xl)',
      }}
    >
      <Card
        title="Boulders Member Login"
        subtitle="Welcome back. Sign in to continue your session."
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: 'grid', gap: 'var(--spacing-md)' }}
        >
          <Input
            id="email"
            type="email"
            label="Email"
            required
            placeholder="you@example.com"
          />
          <Input
            id="password"
            type="password"
            label="Password"
            required
            placeholder="••••••••"
          />
          <Button type="submit">Sign in</Button>
        </form>
      </Card>
    </div>
  )
}

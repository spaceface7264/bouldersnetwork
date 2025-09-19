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
    <div className="login-page">
      <div className="login-page__background" aria-hidden />
      <Card
        className="login-page__card"
        title="Boulders Member Login"
        subtitle="Welcome back. Sign in to continue your session."
      >
        <form className="login-page__form" onSubmit={handleSubmit}>
          <Input
            id="email"
            type="email"
            label="Email"
            required
            placeholder="you@example.com"
            containerClassName="login-page__field login-page__field--1"
          />
          <Input
            id="password"
            type="password"
            label="Password"
            required
            placeholder="••••••••"
            containerClassName="login-page__field login-page__field--2"
          />
          <Button className="login-page__submit" type="submit">
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  )
}

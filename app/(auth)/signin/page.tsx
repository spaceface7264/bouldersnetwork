import Link from 'next/link';

export const metadata = {
  title: 'Sign in'
};

export default function SignInPage() {
  return (
    <main className="container" style={{ padding: 'var(--spacing-12) 0', display: 'grid', gap: 'var(--spacing-6)', maxWidth: '28rem' }}>
      <div>
        <h1 style={{ marginBottom: 'var(--spacing-3)' }}>Sign in</h1>
        <p style={{ margin: 0, color: 'var(--color-muted)' }}>Authenticate with Google to manage campaigns.</p>
      </div>
      <Link
        href="/api/auth/signin"
        style={{
          background: 'var(--color-primary)',
          color: '#fff',
          padding: 'var(--spacing-3) var(--spacing-4)',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
          textAlign: 'center'
        }}
      >
        Continue with Google
      </Link>
    </main>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container" style={{ padding: 'var(--spacing-12) 0', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-4)' }}>We couldn’t find that page</h1>
      <p style={{ color: 'var(--color-muted)' }}>Return to the admin or view the sample campaign.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
        <Link
          href="/admin"
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            padding: 'var(--spacing-3) var(--spacing-6)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600
          }}
        >
          Go to admin
        </Link>
        <Link
          href="/p/spring-flash-sale"
          style={{
            border: '1px solid var(--color-border)',
            padding: 'var(--spacing-3) var(--spacing-6)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600
          }}
        >
          Sample campaign
        </Link>
      </div>
    </main>
  );
}

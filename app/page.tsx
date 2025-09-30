import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: 'var(--spacing-12) 0' }}>
      <div className="container" style={{ display: 'grid', gap: 'var(--spacing-6)' }}>
        <header style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
          <p style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Campaign Landing Studio</p>
          <h1 style={{ fontSize: '3rem', lineHeight: 1.1, margin: 0, fontFamily: 'var(--font-heading)' }}>
            Build high-converting landing pages with brand-safe defaults in minutes.
          </h1>
          <p style={{ maxWidth: '48rem', color: 'var(--color-muted)', margin: 0 }}>
            This MVP shows how marketers can capture leads and publish localized offers instantly. Sign in to access the admin or
            preview a sample campaign page.
          </p>
        </header>
        <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
          <Link
            href="/api/auth/signin"
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
              padding: 'var(--spacing-3) var(--spacing-6)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600
            }}
          >
            Sign in to admin
          </Link>
          <Link
            href="/p/spring-flash-sale"
            style={{
              padding: 'var(--spacing-3) var(--spacing-6)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              fontWeight: 600
            }}
          >
            Preview sample campaign
          </Link>
        </div>
        <section style={{ display: 'grid', gap: 'var(--spacing-3)' }}>
          <h2 style={{ margin: 0, fontSize: '1.75rem' }}>MVP highlights</h2>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--color-muted)', display: 'grid', gap: 'var(--spacing-2)' }}>
            <li>Schema-driven renderer with hero, benefits, locations, FAQ, form, and footer sections.</li>
            <li>Admin workspace with guided campaign builder, JSON editor, and publish workflow.</li>
            <li>Lead capture with database storage and optional webhooks.</li>
            <li>AI SEO suggestions endpoint for metadata inspiration.</li>
            <li>Design tokens ensure visual consistency across landing pages.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

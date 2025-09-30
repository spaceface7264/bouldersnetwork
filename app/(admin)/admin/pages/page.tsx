import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function PagesListPage() {
  const workspace = await prisma.workspace.findFirst({
    include: { pages: true }
  });

  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-6)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0 }}>Campaigns</h1>
          <p style={{ margin: 0, color: 'var(--color-muted)' }}>Create, edit, and publish landing pages without code.</p>
        </div>
        <Link
          href="/admin/pages/new"
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            padding: 'var(--spacing-3) var(--spacing-5)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600
          }}
        >
          New campaign
        </Link>
      </header>
      <div style={{ display: 'grid', gap: 'var(--spacing-3)' }}>
        {workspace?.pages.length ? (
          workspace.pages.map((page) => (
            <div key={page.id} style={{ background: '#fff', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', display: 'grid', gap: 'var(--spacing-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0 }}>{page.title}</h2>
                  <p style={{ margin: 0, color: 'var(--color-muted)' }}>/p/{page.slug}</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      background: page.status === 'PUBLISHED' ? 'rgba(34,197,94,0.1)' : 'rgba(148,163,184,0.15)',
                      color: page.status === 'PUBLISHED' ? '#15803d' : '#475569',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    {page.status}
                  </span>
                  <Link href={`/admin/pages/${page.id}`} style={{ fontWeight: 600 }}>
                    Edit
                  </Link>
                  <Link href={`/p/${page.slug}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ margin: 0, color: 'var(--color-muted)' }}>No pages yet. Create your first campaign.</p>
        )}
      </div>
    </div>
  );
}

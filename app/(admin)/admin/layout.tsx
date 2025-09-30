import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/signin');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header
        style={{
          borderBottom: '1px solid var(--color-border)',
          background: '#fff'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--spacing-4) 0'
          }}
        >
          <Link href="/admin" style={{ fontWeight: 700, fontSize: '1.25rem' }}>
            Campaign Admin
          </Link>
          <nav style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <Link href="/admin" style={{ color: 'var(--color-muted)' }}>
              Dashboard
            </Link>
            <Link href="/admin/pages" style={{ color: 'var(--color-muted)' }}>
              Pages
            </Link>
            <Link href="/api/auth/signout?callbackUrl=/" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
              Sign out
            </Link>
          </nav>
        </div>
      </header>
      <main className="container" style={{ padding: 'var(--spacing-10) 0', display: 'grid', gap: 'var(--spacing-8)' }}>
        {children}
      </main>
    </div>
  );
}

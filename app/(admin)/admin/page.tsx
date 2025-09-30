import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [workspace] = await prisma.workspace.findMany({
    include: {
      pages: true,
      formSubmissions: true
    },
    take: 1
  });

  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-8)' }}>
      <section style={{ display: 'grid', gap: 'var(--spacing-2)' }}>
        <h1 style={{ margin: 0 }}>Workspace overview</h1>
        <p style={{ margin: 0, color: 'var(--color-muted)' }}>
          Manage campaigns, preview pages, and track recent submissions.
        </p>
      </section>
      {workspace ? (
        <div style={{ display: 'grid', gap: 'var(--spacing-6)' }}>
          <div
            style={{
              display: 'grid',
              gap: 'var(--spacing-4)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))'
            }}
          >
            <div style={{ background: '#fff', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>Campaigns</p>
              <h2 style={{ margin: 0 }}>{workspace.pages.length}</h2>
            </div>
            <div style={{ background: '#fff', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>Lead submissions</p>
              <h2 style={{ margin: 0 }}>{workspace.formSubmissions.length}</h2>
            </div>
          </div>
          <div>
            <h2 style={{ marginBottom: 'var(--spacing-3)' }}>Recent submissions</h2>
            {workspace.formSubmissions.slice(0, 5).length ? (
              <div style={{ display: 'grid', gap: 'var(--spacing-3)' }}>
                {workspace.formSubmissions
                  .slice(0, 5)
                  .map((submission) => (
                    <div key={submission.id} style={{ background: '#fff', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {JSON.stringify(submission.data, null, 2)}
                      </pre>
                    </div>
                  ))}
              </div>
            ) : (
              <p style={{ margin: 0, color: 'var(--color-muted)' }}>No submissions yet.</p>
            )}
          </div>
        </div>
      ) : (
        <p style={{ margin: 0, color: 'var(--color-muted)' }}>Create a workspace to begin.</p>
      )}
    </div>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PageEditor } from '@/components/admin/PageEditor';
import { Section } from '@/lib/schema';

export const revalidate = 0;

export default async function PageDetail({ params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({
    where: { id: params.id },
    include: { workspace: true }
  });

  if (!page) {
    notFound();
  }

  const seo = (page.seo as Record<string, unknown> | null) ?? null;
  const schema = page.schema as Section[];

  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-3)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>{page.title}</h1>
          <p style={{ margin: 0, color: 'var(--color-muted)' }}>
            Workspace: {page.workspace.name} · Slug: /p/{page.slug}
          </p>
        </div>
        <Link href={`/p/${page.slug}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          View live page
        </Link>
      </div>
      <PageEditor
        page={{
          id: page.id,
          title: page.title,
          slug: page.slug,
          status: page.status,
          schema,
          seo: seo ?? {}
        }}
      />
    </div>
  );
}

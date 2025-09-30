'use client';

import { PageStatus } from '@prisma/client';
import { useEffect, useState, useTransition } from 'react';
import { updatePage } from '@/app/(admin)/admin/pages/actions';
import { Section } from '@/lib/schema';

type PageEditorProps = {
  page: {
    id: string;
    title: string;
    slug: string;
    status: PageStatus;
    schema: Section[];
    seo: Record<string, unknown> | null;
  };
};

export function PageEditor({ page }: PageEditorProps) {
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [status, setStatus] = useState<PageStatus>(page.status);
  const [schemaJson, setSchemaJson] = useState(() => JSON.stringify(page.schema, null, 2));
  const [seoJson, setSeoJson] = useState(() => JSON.stringify(page.seo ?? {}, null, 2));
  const [message, setMessage] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMessage('');
  }, [title, slug, status, schemaJson, seoJson]);

  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-6)' }}>
      <section style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
        <h2 style={{ margin: 0 }}>Quick edit</h2>
        <div style={{ display: 'grid', gap: 'var(--spacing-3)', maxWidth: '40rem' }}>
          <label style={{ display: 'grid', gap: 'var(--spacing-2)' }}>
            <span style={{ fontWeight: 600 }}>Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
            />
          </label>
          <label style={{ display: 'grid', gap: 'var(--spacing-2)' }}>
            <span style={{ fontWeight: 600 }}>Slug</span>
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
            />
          </label>
          <label style={{ display: 'grid', gap: 'var(--spacing-2)' }}>
            <span style={{ fontWeight: 600 }}>Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as PageStatus)}
              style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
            >
              {Object.values(PageStatus).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              startTransition(async () => {
                try {
                  const seo = JSON.parse(seoJson || '{}');
                  await updatePage(page.id, {
                    title,
                    slug,
                    status,
                    seo
                  });
                  setMessage('Quick edits saved. Published pages revalidate within 60s.');
                } catch (error) {
                  setMessage('Invalid SEO metadata JSON. Please fix before saving.');
                }
              });
            }}
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--spacing-3) var(--spacing-6)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            disabled={isPending}
          >
            {isPending ? 'Saving…' : 'Save quick edits'}
          </button>
        </div>
      </section>
      <section style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <h2 style={{ margin: 0 }}>Schema editor</h2>
          <button
            type="button"
            onClick={() => {
              startTransition(async () => {
                try {
                  const parsedSchema = JSON.parse(schemaJson) as Section[];
                  const seo = JSON.parse(seoJson || '{}');
                  await updatePage(page.id, {
                    schema: parsedSchema,
                    seo,
                    status
                  });
                  setMessage('Schema updated.');
                } catch (error) {
                  setMessage('Invalid JSON. Please fix errors before saving.');
                }
              });
            }}
            style={{
              background: 'var(--color-secondary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--spacing-3) var(--spacing-6)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            disabled={isPending}
          >
            {isPending ? 'Saving…' : 'Save schema'}
          </button>
        </div>
        <div style={{ display: 'grid', gap: 'var(--spacing-3)' }}>
          <label style={{ display: 'grid', gap: 'var(--spacing-2)' }}>
            <span style={{ fontWeight: 600 }}>Landing page sections (JSON)</span>
            <textarea
              value={schemaJson}
              onChange={(event) => setSchemaJson(event.target.value)}
              rows={24}
              style={{
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                fontFamily: 'monospace',
                fontSize: '0.95rem'
              }}
            />
          </label>
          <label style={{ display: 'grid', gap: 'var(--spacing-2)' }}>
            <span style={{ fontWeight: 600 }}>SEO metadata (JSON)</span>
            <textarea
              value={seoJson}
              onChange={(event) => setSeoJson(event.target.value)}
              rows={8}
              style={{
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                fontFamily: 'monospace',
                fontSize: '0.95rem'
              }}
            />
          </label>
        </div>
      </section>
      {message ? <p style={{ color: 'var(--color-secondary)' }}>{message}</p> : null}
    </div>
  );
}

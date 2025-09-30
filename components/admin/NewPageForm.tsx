'use client';

import { useFormState } from 'react-dom';
import { createPage } from '@/app/(admin)/admin/pages/actions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const initialState = { success: false, message: '' } as const;

export function NewPageForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(createPage, initialState);

  useEffect(() => {
    if (state.success) {
      router.push('/admin/pages');
    }
  }, [state.success, router]);

  return (
    <form action={formAction} style={{ display: 'grid', gap: 'var(--spacing-4)', maxWidth: '40rem' }}>
      <div style={{ display: 'grid', gap: 'var(--spacing-2)' }}>
        <label htmlFor="title" style={{ fontWeight: 600 }}>
          Campaign title
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="Spring Renewal Campaign"
          style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
        />
      </div>
      <div style={{ display: 'grid', gap: 'var(--spacing-2)' }}>
        <label htmlFor="slug" style={{ fontWeight: 600 }}>
          URL slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          placeholder="spring-renewal"
          style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
        />
      </div>
      <div style={{ display: 'grid', gap: 'var(--spacing-2)' }}>
        <label htmlFor="campaignType" style={{ fontWeight: 600 }}>
          Campaign type
        </label>
        <select
          id="campaignType"
          name="campaignType"
          defaultValue="custom"
          style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
        >
          <option value="custom">Custom offer</option>
          <option value="event">Event</option>
        </select>
      </div>
      <button
        type="submit"
        style={{
          background: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--spacing-3) var(--spacing-6)',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        Create campaign
      </button>
      {state.message ? <p style={{ margin: 0, color: 'var(--color-secondary)' }}>{state.message}</p> : null}
    </form>
  );
}

import Link from 'next/link';
import { NewPageForm } from '@/components/admin/NewPageForm';

export default function NewPage() {
  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <h1 style={{ margin: 0 }}>Create campaign</h1>
        <p style={{ margin: 0, color: 'var(--color-muted)' }}>
          Guided fields auto-generate a starter schema. Refine details after creation.
        </p>
      </div>
      <NewPageForm />
      <Link href="/admin/pages" style={{ color: 'var(--color-muted)' }}>
        Cancel
      </Link>
    </div>
  );
}

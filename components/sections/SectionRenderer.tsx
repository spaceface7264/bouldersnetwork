'use client';

import { useEffect, useMemo, useState } from 'react';
import { Section, FormField, FormSection } from '@/lib/schema';
import { SubmitLeadForm } from '@/lib/server-mutations';
import { useFormStatus } from 'react-dom';

type SectionRendererProps = {
  sections: Section[];
  pageId: string;
  workspaceId: string;
};

function CtaButton({ label, target, variant }: { label: string; target: string; variant?: 'primary' | 'secondary' }) {
  const base = {
    padding: 'var(--spacing-3) var(--spacing-6)',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as const;

  const style =
    variant === 'secondary'
      ? {
          ...base,
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)'
        }
      : {
          ...base,
          background: 'var(--color-primary)',
          color: '#fff'
        };

  return (
    <a href={target} style={style}>
      {label}
    </a>
  );
}

function FormFieldControl({ field }: { field: FormField }) {
  const baseProps = {
    name: field.name,
    required: field.required,
    placeholder: field.placeholder,
    style: {
      width: '100%',
      padding: 'var(--spacing-3)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--color-border)',
      fontSize: '1rem'
    }
  } as const;

  if (field.type === 'select') {
    return (
      <select {...baseProps} defaultValue="">
        <option value="" disabled>
          Select an option
        </option>
        {field.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return <input type={field.type} {...baseProps} />;
}

function SubmitButton({ label }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      style={{
        background: 'var(--color-primary)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--spacing-3) var(--spacing-6)',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      disabled={pending}
    >
      {pending ? 'Submitting…' : label ?? 'Submit'}
    </button>
  );
}

function LeadForm({ section, pageId }: { section: FormSection; pageId: string }) {
  const [state, setState] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const action = useMemo(
    () =>
      SubmitLeadForm.bind(null, {
        pageId,
        fields: section.props.fields.map((field) => field.name)
      }),
    [pageId, section.props.fields]
  );

  if (state === 'success') {
    return (
      <div style={{ display: 'grid', gap: 'var(--spacing-2)' }}>
        <h3 style={{ margin: 0 }}>{section.props.successTitle ?? 'Thanks for reaching out!'}</h3>
        <p style={{ margin: 0 }}>{section.props.successBody ?? 'We will be in touch shortly.'}</p>
      </div>
    );
  }

  return (
    <form
      action={async (formData: FormData) => {
        const result = await action(formData);
        if (result.ok) {
          setState('success');
        } else {
          setState('error');
          setMessage(result.error ?? 'Something went wrong. Please try again.');
        }
      }}
      style={{ display: 'grid', gap: 'var(--spacing-3)' }}
    >
      {section.props.fields.map((field) => (
        <div key={field.name} style={{ display: 'grid', gap: 'var(--spacing-2)' }}>
          <label htmlFor={field.name} style={{ fontWeight: 600 }}>
            {field.label}
            {field.required ? ' *' : ''}
          </label>
          <FormFieldControl field={field} />
        </div>
      ))}
      <SubmitButton label={section.props.submitLabel} />
      {state === 'error' ? (
        <p style={{ color: 'var(--color-secondary)', margin: 0 }}>{message}</p>
      ) : null}
    </form>
  );
}

export function SectionRenderer({ sections, pageId, workspaceId }: SectionRendererProps) {
  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-12)' }}>
      {sections.map((section, index) => {
        switch (section.type) {
          case 'hero': {
            const { eyebrow, heading, subheading, primaryCta, secondaryCta } = section.props;
            return (
              <section key={index} className="section" style={{ paddingTop: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }}>
                <div className="container" style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
                  {eyebrow ? (
                    <p style={{ color: 'var(--color-secondary)', fontWeight: 600, margin: 0 }}>{eyebrow}</p>
                  ) : null}
                  <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', margin: 0 }}>{heading}</h1>
                  {subheading ? (
                    <p style={{ color: 'var(--color-muted)', maxWidth: '40rem', margin: 0 }}>{subheading}</p>
                  ) : null}
                  <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
                    {primaryCta ? <CtaButton {...primaryCta} variant="primary" /> : null}
                    {secondaryCta ? <CtaButton {...secondaryCta} variant="secondary" /> : null}
                  </div>
                </div>
              </section>
            );
          }
          case 'benefits': {
            const { heading, items } = section.props;
            return (
              <section key={index} className="section section--surface">
                <div className="container" style={{ display: 'grid', gap: 'var(--spacing-6)' }}>
                  {heading ? (
                    <h2 style={{ fontSize: '2rem', margin: 0 }}>{heading}</h2>
                  ) : null}
                  <div
                    style={{
                      display: 'grid',
                      gap: 'var(--spacing-4)',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))'
                    }}
                  >
                    {items.map((item) => (
                      <div
                        key={item.title}
                        className="shadow-card"
                        style={{ padding: 'var(--spacing-6)', borderRadius: 'var(--radius-md)', background: '#fff' }}
                      >
                        <h3 style={{ marginTop: 0 }}>{item.title}</h3>
                        <p style={{ marginBottom: 0, color: 'var(--color-muted)' }}>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }
          case 'locations': {
            const { heading, description } = section.props;
            return (
              <section key={index} id="locations" className="section">
                <div className="container" style={{ display: 'grid', gap: 'var(--spacing-3)' }}>
                  {heading ? <h2 style={{ margin: 0 }}>{heading}</h2> : null}
                  {description ? <p style={{ margin: 0, color: 'var(--color-muted)' }}>{description}</p> : null}
                  <LocationsList workspaceId={workspaceId} />
                </div>
              </section>
            );
          }
          case 'faq': {
            const { heading, items } = section.props;
            return (
              <section key={index} className="section section--surface">
                <div className="container" style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
                  {heading ? <h2 style={{ margin: 0 }}>{heading}</h2> : null}
                  <div style={{ display: 'grid', gap: 'var(--spacing-3)' }}>
                    {items.map((item) => (
                      <details
                        key={item.question}
                        style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: 'var(--spacing-3) var(--spacing-4)' }}
                      >
                        <summary style={{ fontWeight: 600, cursor: 'pointer' }}>{item.question}</summary>
                        <p style={{ marginBottom: 0, marginTop: 'var(--spacing-2)', color: 'var(--color-muted)' }}>{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            );
          }
          case 'form': {
            return (
              <section key={index} id={section.props.id} className="section">
                <div className="container" style={{ display: 'grid', gap: 'var(--spacing-4)', maxWidth: '40rem' }}>
                  {section.props.heading ? <h2 style={{ margin: 0 }}>{section.props.heading}</h2> : null}
                  {section.props.description ? (
                    <p style={{ margin: 0, color: 'var(--color-muted)' }}>{section.props.description}</p>
                  ) : null}
                  <LeadForm section={section} pageId={pageId} />
                </div>
              </section>
            );
          }
          case 'footer': {
            const { legal, links } = section.props;
            return (
              <footer
                key={index}
                className="section section--surface"
                style={{ padding: 'var(--spacing-6) 0', marginTop: 'var(--spacing-12)' }}
              >
                <div
                  className="container"
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <p style={{ margin: 0, color: 'var(--color-muted)' }}>{legal}</p>
                  {links?.length ? (
                    <nav style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
                      {links.map((link) => (
                        <a key={link.href} href={link.href} style={{ color: 'var(--color-muted)' }}>
                          {link.label}
                        </a>
                      ))}
                    </nav>
                  ) : null}
                </div>
              </footer>
            );
          }
          default:
            return (
              <section key={index} className="section">
                <div className="container">
                  <p>Unsupported section: {(section as Section).type}</p>
                </div>
              </section>
            );
        }
      })}
    </div>
  );
}

function LocationsList({ workspaceId }: { workspaceId: string }) {
  const [locations, setLocations] = useState<{ name: string; address?: string }[]>([]);

  useEffect(() => {
    async function fetchLocations() {
      const res = await fetch(`/api/brand/locations?workspaceId=${workspaceId}`);
      if (!res.ok) return;
      const data = (await res.json()) as { name: string; address?: string }[];
      setLocations(data);
    }
    fetchLocations();
  }, [workspaceId]);

  if (!locations.length) {
    return <p style={{ color: 'var(--color-muted)', margin: 0 }}>Locations will appear once the workspace is configured.</p>;
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-3)' }}>
      {locations.map((location) => (
        <div
          key={location.name}
          style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: 'var(--spacing-3)' }}
        >
          <strong>{location.name}</strong>
          {location.address ? <p style={{ margin: 0, color: 'var(--color-muted)' }}>{location.address}</p> : null}
        </div>
      ))}
    </div>
  );
}

'use server';

import { revalidatePath } from 'next/cache';
import { PageStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function createPage(prevState: unknown, formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  const campaignType = String(formData.get('campaignType') ?? 'custom');

  if (!title || !slug) {
    return { success: false, message: 'Title and slug are required.' };
  }

  const workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    throw new Error('Workspace not seeded. Run prisma/seed.ts first.');
  }

  await prisma.page.create({
    data: {
      workspaceId: workspace.id,
      title,
      slug,
      status: PageStatus.DRAFT,
      schema: defaultSchema(campaignType),
      seo: {
        title: `${title} | ${workspace.name}`,
        description: 'Auto-generated landing page ready for copy updates.',
        keywords: ['campaign', 'landing page']
      }
    }
  });

  revalidatePath('/admin/pages');
  return { success: true, message: '' };
}

export async function updatePage(
  pageId: string,
  values: { status?: PageStatus; schema?: unknown; seo?: unknown; title?: string; slug?: string }
) {
  const updated = await prisma.page.update({
    where: { id: pageId },
    data: {
      ...values,
      publishedAt: values.status
        ? values.status === PageStatus.PUBLISHED
          ? new Date()
          : null
        : undefined
    }
  });

  revalidatePath('/admin/pages');
  revalidatePath(`/admin/pages/${pageId}`);
  if (updated.slug) {
    revalidatePath(`/p/${updated.slug}`);
  }
}

function defaultSchema(campaignType: string) {
  switch (campaignType) {
    case 'event':
      return [
        {
          type: 'hero',
          props: {
            eyebrow: 'Upcoming event',
            heading: 'Join us for our next event',
            subheading: 'Update the copy in the editor to tailor this event to your audience.',
            primaryCta: { label: 'Save your seat', target: '#lead-form' }
          }
        },
        {
          type: 'form',
          props: {
            id: 'lead-form',
            heading: 'RSVP now',
            fields: [
              { name: 'name', label: 'Full name', type: 'text', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true }
            ],
            submitLabel: 'Reserve spot'
          }
        },
        {
          type: 'footer',
          props: {
            legal: 'Update event footer copy.'
          }
        }
      ];
    default:
      return [
        {
          type: 'hero',
          props: {
            eyebrow: 'New campaign',
            heading: 'Landing page headline goes here',
            subheading: 'Use the quick edit panel or JSON editor to refine your content.',
            primaryCta: { label: 'Get started', target: '#lead-form' }
          }
        },
        {
          type: 'benefits',
          props: {
            heading: 'Key benefits',
            items: [
              { title: 'Benefit 1', description: 'Describe the first benefit.' },
              { title: 'Benefit 2', description: 'Describe the second benefit.' }
            ]
          }
        },
        {
          type: 'form',
          props: {
            id: 'lead-form',
            heading: 'Request more info',
            fields: [
              { name: 'name', label: 'Full name', type: 'text', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'company', label: 'Company', type: 'text' }
            ]
          }
        },
        {
          type: 'footer',
          props: {
            legal: '© Company Name'
          }
        }
      ];
  }
}

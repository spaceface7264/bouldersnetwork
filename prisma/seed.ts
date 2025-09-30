import { PrismaClient, PageStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'acme-co' },
    update: {},
    create: {
      name: 'Acme Co',
      slug: 'acme-co',
      brandTokens: {
        colors: {
          primary: '#2563eb',
          secondary: '#f97316',
          background: '#ffffff',
          surface: '#f3f4f6',
          text: '#111827'
        },
        fonts: {
          heading: '"Inter", sans-serif',
          body: '"Inter", sans-serif'
        }
      },
      locations: [
        { name: 'Austin HQ', address: '123 Market St, Austin, TX' },
        { name: 'Denver Office', address: '456 Blake St, Denver, CO' }
      ],
      webhookUrl: null
    }
  });

  await prisma.page.upsert({
    where: { workspaceId_slug: { workspaceId: workspace.id, slug: 'spring-flash-sale' } },
    update: {},
    create: {
      workspaceId: workspace.id,
      title: 'Spring Flash Sale',
      slug: 'spring-flash-sale',
      status: PageStatus.PUBLISHED,
      publishedAt: new Date(),
      schema: [
        {
          type: 'hero',
          props: {
            eyebrow: 'Limited Time',
            heading: 'Spring Flash Sale',
            subheading: 'Save 25% on annual plans when you join before May 31.',
            primaryCta: { label: 'Claim Offer', target: '#lead-form' },
            secondaryCta: { label: 'See Locations', target: '#locations' }
          }
        },
        {
          type: 'benefits',
          props: {
            heading: 'Why marketers choose Acme',
            items: [
              { title: 'Fast Launch', description: 'Publish branded landing pages in minutes.' },
              { title: 'Lead Routing', description: 'Send new leads to the right rep instantly.' },
              { title: 'Analytics-ready', description: 'All campaigns include SEO, pixel, and UTM defaults.' }
            ]
          }
        },
        {
          type: 'locations',
          props: { heading: 'Where we operate', description: 'Pick the closest market to tailor your offer.' }
        },
        {
          type: 'faq',
          props: {
            heading: 'Common Questions',
            items: [
              { question: 'How quickly can we launch?', answer: 'Most teams launch within the first hour using our guided builder.' },
              { question: 'Can I connect my CRM?', answer: 'Yes, use built-in webhooks to push leads to HubSpot, Salesforce, or Zapier.' }
            ]
          }
        },
        {
          type: 'form',
          props: {
            id: 'lead-form',
            heading: 'Get the offer',
            submitLabel: 'Request demo',
            successTitle: 'Thanks for reaching out!',
            successBody: 'A campaign specialist will follow up within one business day.',
            fields: [
              { name: 'name', label: 'Full name', type: 'text', required: true },
              { name: 'email', label: 'Work email', type: 'email', required: true },
              { name: 'company', label: 'Company', type: 'text', required: true },
              { name: 'timeline', label: 'Expected launch timeline', type: 'select', options: ['<30 days', '30-60 days', '60+ days'] }
            ]
          }
        },
        {
          type: 'footer',
          props: {
            legal: '© ' + new Date().getFullYear() + ' Acme Co. All rights reserved.',
            links: [
              { label: 'Privacy', href: '#' },
              { label: 'Terms', href: '#' }
            ]
          }
        }
      ],
      seo: {
        title: 'Acme Co Spring Flash Sale',
        description: 'Claim a 25% discount on Acme annual plans before May 31.',
        keywords: ['landing pages', 'campaign builder', 'marketing automation']
      }
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

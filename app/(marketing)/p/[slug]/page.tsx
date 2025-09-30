import { CSSProperties } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { Section } from '@/lib/schema';

export const revalidate = 60;

type PageProps = {
  params: { slug: string };
};

const fallbackTokens = {
  colors: {
    primary: '#2563eb',
    secondary: '#f97316',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#0f172a'
  },
  fonts: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await prisma.page.findFirst({
    where: { slug: params.slug, status: 'PUBLISHED' },
    select: { seo: true }
  });

  if (!page?.seo) {
    return {};
  }

  const seo = page.seo as { title?: string; description?: string; keywords?: string[] };
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords
  };
}

export default async function LandingPage({ params }: PageProps) {
  const page = await prisma.page.findFirst({
    where: { slug: params.slug, status: 'PUBLISHED' },
    include: { workspace: true }
  });

  if (!page) {
    notFound();
  }

  const sections = page.schema as Section[];
  const brandTokens = page.workspace.brandTokens as {
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
  };

  const style = {
    '--color-primary': brandTokens?.colors?.primary ?? fallbackTokens.colors.primary,
    '--color-secondary': brandTokens?.colors?.secondary ?? fallbackTokens.colors.secondary,
    '--color-background': brandTokens?.colors?.background ?? fallbackTokens.colors.background,
    '--color-surface': brandTokens?.colors?.surface ?? fallbackTokens.colors.surface,
    '--color-text': brandTokens?.colors?.text ?? fallbackTokens.colors.text,
    '--font-heading': brandTokens?.fonts?.heading ?? fallbackTokens.fonts.heading,
    '--font-body': brandTokens?.fonts?.body ?? fallbackTokens.fonts.body
  } as CSSProperties;

  return (
    <main style={style}>
      <SectionRenderer sections={sections} pageId={page.id} workspaceId={page.workspaceId} />
    </main>
  );
}

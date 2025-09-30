'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from './prisma';

export async function SubmitLeadForm(
  config: { pageId: string; fields: string[] },
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const values: Record<string, string> = {};
  config.fields.forEach((field) => {
    const value = formData.get(field);
    if (typeof value === 'string' && value.trim().length > 0) {
      values[field] = value.trim();
    }
  });

  if (!Object.keys(values).length) {
    return { ok: false, error: 'Please complete the form.' };
  }

  const page = await prisma.page.findUnique({
    where: { id: config.pageId },
    include: { workspace: true }
  });

  if (!page || page.status !== 'PUBLISHED') {
    return { ok: false, error: 'This campaign is no longer accepting submissions.' };
  }

  await prisma.formSubmission.create({
    data: {
      pageId: page.id,
      data: values
    }
  });

  if (page.workspace.webhookUrl) {
    try {
      await fetch(page.workspace.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pageId: page.id,
          workspaceId: page.workspaceId,
          data: values
        })
      });
    } catch (error) {
      console.error('Failed to send webhook', error);
    }
  }

  revalidatePath(`/admin/pages/${page.id}`);
  revalidatePath(`/p/${page.slug}`);
  return { ok: true };
}

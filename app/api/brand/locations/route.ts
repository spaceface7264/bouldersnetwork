import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get('workspaceId');

  const workspace = workspaceId
    ? await prisma.workspace.findUnique({ where: { id: workspaceId } })
    : await prisma.workspace.findFirst();

  return NextResponse.json((workspace?.locations as unknown as { name: string; address?: string }[]) ?? []);
}

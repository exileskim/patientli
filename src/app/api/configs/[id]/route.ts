import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: configId } = await context.params;

  const config = await prisma.lookConfig.findUnique({
    where: { id: configId },
    select: { id: true, config: true },
  });

  if (!config) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ id: config.id, config: config.config });
}

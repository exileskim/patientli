import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';
import { createLookConfigRequestSchemaV1 } from '@/modules/looks/domain/config.schema';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = createLookConfigRequestSchemaV1.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { lookSlug, lookVersion, patch } = parsed.data;

  const lookVersionRow = await prisma.lookVersion.findFirst({
    where: {
      version: lookVersion,
      look: { slug: lookSlug },
    },
  });

  if (!lookVersionRow) {
    return NextResponse.json({ error: 'Unknown look or version' }, { status: 404 });
  }

  const configDocument = {
    schemaVersion: 1,
    lookSlug,
    lookVersion,
    ...patch,
  };

  const created = await prisma.lookConfig.create({
    data: {
      lookVersionId: lookVersionRow.id,
      config: configDocument,
    },
    select: { id: true },
  });

  await prisma.lookConfigRevision.create({
    data: {
      configId: created.id,
      revision: 1,
      snapshot: configDocument,
    },
  });

  return NextResponse.json({ id: created.id });
}


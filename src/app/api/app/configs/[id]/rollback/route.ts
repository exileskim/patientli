import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { prisma } from '@/lib/db/prisma';
import { createAuthOptions } from '@/lib/auth/options';
import { lookConfigDocumentSchemaV1 } from '@/modules/looks/domain/config.schema';

export const runtime = 'nodejs';

const requestSchema = z.object({
  revision: z.number().int().positive(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: configId } = await context.params;

  const session = await getServerSession(createAuthOptions());
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsedBody = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsedBody.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const configRow = await prisma.lookConfig.findFirst({
    where: {
      id: configId,
      OR: [
        { createdByUserId: user.id },
        { purchases: { some: { userId: user.id } } },
      ],
    },
    select: {
      id: true,
      createdByUserId: true,
      lookVersion: { select: { version: true, look: { select: { slug: true } } } },
    },
  });

  if (!configRow) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const targetRevision = await prisma.lookConfigRevision.findUnique({
    where: {
      configId_revision: { configId, revision: parsedBody.data.revision },
    },
    select: { snapshot: true },
  });

  if (!targetRevision) {
    return NextResponse.json({ error: 'Revision not found' }, { status: 404 });
  }

  const parsedSnapshot = lookConfigDocumentSchemaV1.safeParse(targetRevision.snapshot);
  if (!parsedSnapshot.success) {
    return NextResponse.json({ error: 'Stored revision is invalid' }, { status: 500 });
  }

  const snapshot = parsedSnapshot.data;
  if (
    snapshot.lookSlug !== configRow.lookVersion.look.slug ||
    snapshot.lookVersion !== configRow.lookVersion.version
  ) {
    return NextResponse.json({ error: 'Revision look mismatch' }, { status: 500 });
  }

  const latestRevision = await prisma.lookConfigRevision.findFirst({
    where: { configId },
    orderBy: { revision: 'desc' },
    select: { revision: true },
  });
  const nextRevisionNumber = (latestRevision?.revision ?? 0) + 1;

  const revision = await prisma.$transaction(async (db) => {
    const created = await db.lookConfigRevision.create({
      data: {
        configId,
        revision: nextRevisionNumber,
        snapshot,
        createdByUserId: user.id,
      },
      select: { id: true, revision: true, createdAt: true },
    });

    await db.lookConfig.update({
      where: { id: configId },
      data: {
        config: snapshot,
        ...(configRow.createdByUserId ? {} : { createdByUserId: user.id }),
      },
    });

    await db.auditLog.create({
      data: {
        actorUserId: user.id,
        action: 'lookConfig.rollback',
        targetType: 'LookConfig',
        targetId: configId,
        metadata: {
          fromRevision: parsedBody.data.revision,
          toRevision: nextRevisionNumber,
        },
      },
    });

    return created;
  });

  return NextResponse.json({
    config: snapshot,
    revision: {
      id: revision.id,
      revision: revision.revision,
      createdAt: revision.createdAt.toISOString(),
    },
  });
}


import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';

import { prisma } from '@/lib/db/prisma';
import { createAuthOptions } from '@/lib/auth/options';
import { lookConfigDocumentSchemaV1 } from '@/modules/looks/domain/config.schema';
import { lookTokensSchemaV1 } from '@/modules/looks/domain/tokens.schema';
import { ConfigEditorClient } from './ConfigEditorClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AppConfigEditorPage({ params }: PageProps) {
  const { id: configId } = await params;

  const session = await getServerSession(createAuthOptions());
  const email = session?.user?.email;

  if (!email) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    redirect('/auth/signin');
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
      config: true,
      lookVersion: {
        select: {
          version: true,
          baseTokens: true,
          look: { select: { slug: true, title: true } },
        },
      },
      revisions: {
        orderBy: { revision: 'desc' },
        take: 25,
        select: {
          id: true,
          revision: true,
          createdAt: true,
        },
      },
    },
  });

  if (!configRow) {
    notFound();
  }

  const parsedConfig = lookConfigDocumentSchemaV1.safeParse(configRow.config);
  if (!parsedConfig.success) {
    notFound();
  }

  const parsedTokens = lookTokensSchemaV1.safeParse(configRow.lookVersion.baseTokens);
  if (!parsedTokens.success) {
    notFound();
  }

  return (
    <ConfigEditorClient
      configId={configRow.id}
      lookSlug={configRow.lookVersion.look.slug}
      lookTitle={configRow.lookVersion.look.title}
      lookVersion={configRow.lookVersion.version}
      baseTokens={parsedTokens.data}
      initialConfig={parsedConfig.data}
      revisions={configRow.revisions.map((rev) => ({
        id: rev.id,
        revision: rev.revision,
        createdAt: rev.createdAt.toISOString(),
      }))}
    />
  );
}


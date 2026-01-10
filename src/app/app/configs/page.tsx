import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/db/prisma';
import { createAuthOptions } from '@/lib/auth/options';
import { lookConfigDocumentSchemaV1 } from '@/modules/looks/domain/config.schema';

export default async function AppConfigsPage() {
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

  const configs = await prisma.lookConfig.findMany({
    where: {
      OR: [
        { createdByUserId: user.id },
        { purchases: { some: { userId: user.id } } },
      ],
    },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      config: true,
      lookVersion: {
        select: {
          version: true,
          look: { select: { slug: true, title: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl">Configs</h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            All configs associated with your account.
          </p>
        </div>
        <Link
          href="/looks"
          className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          New config
        </Link>
      </div>

      <div className="rounded-3xl border border-[var(--color-border)] bg-white">
        {configs.length === 0 ? (
          <div className="p-6 text-sm text-[var(--color-text-secondary)]">
            No configs yet. Start by browsing Looks.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {configs.map((config) => {
              const parsed = lookConfigDocumentSchemaV1.safeParse(config.config);
              const practiceName = parsed.success ? parsed.data.practice.name : 'Untitled practice';
              const lookTitle = config.lookVersion.look.title;
              const lookSlug = config.lookVersion.look.slug;

              return (
                <div key={config.id} className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-medium">
                      {practiceName}{' '}
                      <span className="text-[var(--color-text-muted)]">·</span>{' '}
                      <span className="text-[var(--color-text-secondary)]">{lookTitle}</span>
                    </div>
                    <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                      Created {config.createdAt.toLocaleDateString()} · Updated {config.updatedAt.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/app/configs/${config.id}`}
                      className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/looks/${lookSlug}?id=${config.id}`}
                      className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm hover:bg-[var(--color-bg-cream)] transition-colors"
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


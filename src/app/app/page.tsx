import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/db/prisma';
import { createAuthOptions } from '@/lib/auth/options';
import { lookConfigDocumentSchemaV1 } from '@/modules/looks/domain/config.schema';

function formatPlanName(planKey: string) {
  switch (planKey) {
    case 'basic':
      return 'Basic';
    case 'starter':
      return 'Starter';
    case 'growth':
      return 'Growth';
    default:
      return planKey;
  }
}

export default async function AppHomePage() {
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

  const activePurchase = await prisma.purchase.findFirst({
    where: { userId: user.id, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    select: { planKey: true, status: true, createdAt: true },
  });

  const configs = await prisma.lookConfig.findMany({
    where: {
      OR: [
        { createdByUserId: user.id },
        { purchases: { some: { userId: user.id } } },
      ],
    },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    select: {
      id: true,
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
    <div className="space-y-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl">Dashboard</h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Manage your Patientli Look configs and request edits.
          </p>
        </div>
        <Link
          href="/looks"
          className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          Create a new config
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-cream)] p-6">
          <h2 className="font-heading text-xl">Plan</h2>
          {activePurchase ? (
            <div className="mt-4 space-y-2 text-sm text-[var(--color-text-secondary)]">
              <div className="flex items-center justify-between">
                <span>Current plan</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {formatPlanName(activePurchase.planKey)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium">
                  {activePurchase.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-[var(--color-text-secondary)]">
              No active subscription found for this account yet.
              <div className="mt-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  View pricing
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="font-heading text-xl">Support</h2>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            Need help or want edits beyond the editor? Schedule a call or email us.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="mailto:support@patient.li"
              className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg-dark)] hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Email support
            </a>
            <Link
              href="/demo"
              className="rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--color-bg-cream)] transition-colors"
            >
              Schedule a call
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
        <div className="flex items-center justify-between gap-6">
          <h2 className="font-heading text-xl">Your configs</h2>
          <Link href="/app/configs" className="text-sm text-[var(--color-primary)] hover:underline">
            View all
          </Link>
        </div>

        {configs.length === 0 ? (
          <div className="mt-4 text-sm text-[var(--color-text-secondary)]">
            No configs yet. Start by customizing a Look from the gallery.
          </div>
        ) : (
          <div className="mt-4 divide-y divide-[var(--color-border)]">
            {configs.map((config) => {
              const parsed = lookConfigDocumentSchemaV1.safeParse(config.config);
              const practiceName = parsed.success ? parsed.data.practice.name : 'Untitled practice';
              const lookTitle = config.lookVersion.look.title;
              const lookSlug = config.lookVersion.look.slug;

              return (
                <div key={config.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-medium">
                      {practiceName}{' '}
                      <span className="text-[var(--color-text-muted)]">·</span>{' '}
                      <span className="text-[var(--color-text-secondary)]">{lookTitle}</span>
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      Updated {config.updatedAt.toLocaleString()}
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


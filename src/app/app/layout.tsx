import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { createAuthOptions } from '@/lib/auth/options';
import { AppUserMenu } from '@/components/app/AppUserMenu';
import { SessionProvider } from '@/components/providers/SessionProvider';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(createAuthOptions());

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-heading text-lg text-[var(--color-primary)]">
                Patientli
              </Link>
              <nav className="hidden sm:flex items-center gap-4 text-sm">
                <Link href="/app" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
                  Dashboard
                </Link>
                <Link href="/app/configs" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
                  Configs
                </Link>
                <Link href="/app/crm" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
                  CRM Demo
                </Link>
                <Link href="/looks" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
                  Browse Looks
                </Link>
                <Link href="/app/support" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
                  Support
                </Link>
              </nav>
            </div>
            <AppUserMenu />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </div>
    </SessionProvider>
  );
}

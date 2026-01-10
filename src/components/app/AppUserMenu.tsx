'use client';

import { signOut, useSession } from 'next-auth/react';

export function AppUserMenu() {
  const { data: session } = useSession();

  const label = session?.user?.email ?? session?.user?.name ?? 'Account';

  return (
    <div className="flex items-center gap-3">
      <span className="hidden sm:inline text-sm text-[var(--color-text-muted)]">
        {label}
      </span>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/' })}
        className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm hover:bg-[var(--color-bg-cream)] transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}


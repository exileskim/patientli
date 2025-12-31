'use client';

import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Container } from '@/components/ui';

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <>
        <Header variant="light" />
        <main className="min-h-screen bg-white py-16">
          <Container>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <Header variant="light" />

      <main className="min-h-screen bg-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-heading mb-2">My Account</h1>
                <p className="text-[var(--color-text-secondary)]">
                  Welcome back, {session?.user?.name || session?.user?.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-6 py-2 border border-[var(--color-border)] rounded-full text-sm hover:bg-[var(--color-bg-cream)] transition-colors"
              >
                Sign Out
              </button>
            </div>

            {/* Dashboard Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Subscription Card */}
              <div className="bg-[var(--color-bg-cream)] rounded-3xl p-8">
                <h2 className="text-xl font-heading mb-4">Subscription</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-secondary)]">Plan</span>
                    <span className="font-medium">No active plan</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-secondary)]">Status</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      Inactive
                    </span>
                  </div>
                  <Link
                    href="/pricing"
                    className="block w-full text-center py-3 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-dark)] transition-colors mt-4"
                  >
                    Choose a Plan
                  </Link>
                </div>
              </div>

              {/* Profile Card */}
              <div className="bg-[var(--color-bg-mint)] rounded-3xl p-8">
                <h2 className="text-xl font-heading mb-4">Profile</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-secondary)]">Email</span>
                    <span className="font-medium">{session?.user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-secondary)]">Name</span>
                    <span className="font-medium">{session?.user?.name || 'Not set'}</span>
                  </div>
                  <button className="w-full py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-full hover:bg-white transition-colors mt-4">
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Quick Links Card */}
              <div className="bg-white border border-[var(--color-border)] rounded-3xl p-8">
                <h2 className="text-xl font-heading mb-4">Quick Links</h2>
                <nav className="space-y-3">
                  <Link
                    href="/looks"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-bg-cream)] transition-colors"
                  >
                    <span>Browse Looks</span>
                    <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/resources"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-bg-cream)] transition-colors"
                  >
                    <span>Resources</span>
                    <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/services"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-bg-cream)] transition-colors"
                  >
                    <span>Services</span>
                    <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </nav>
              </div>

              {/* Support Card */}
              <div className="bg-[var(--color-bg-dark)] text-white rounded-3xl p-8">
                <h2 className="text-xl font-heading mb-4" style={{ color: 'white' }}>Need Help?</h2>
                <p className="text-white/80 mb-6">
                  Our team is here to help you get the most out of Patientli.
                </p>
                <a
                  href="mailto:support@patient.li"
                  className="block w-full text-center py-3 bg-[var(--color-accent)] text-[var(--color-bg-dark)] rounded-full hover:bg-[var(--color-accent-dark)] transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

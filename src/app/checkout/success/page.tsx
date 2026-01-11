import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Container } from '@/components/ui';

type CheckoutSuccessPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const isMockCheckout = searchParams?.mock === '1';

  return (
    <>
      <Header variant="light" />

      <main className="min-h-screen bg-white py-24">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-[var(--color-bg-mint)] rounded-full flex items-center justify-center mx-auto mb-8">
              <svg
                className="w-10 h-10 text-[var(--color-primary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-heading mb-4">
              Welcome to Patientli!
            </h1>

            {/* Description */}
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
              Thank you for your subscription. Your payment was successful and your account is now active.
              We&apos;re excited to help you grow your practice!
              {isMockCheckout ? ' (Demo checkout — Stripe is not configured yet.)' : null}
            </p>

            {/* Next Steps */}
            <div className="bg-[var(--color-bg-cream)] rounded-2xl p-8 mb-8 text-left">
              <h2 className="text-xl font-heading mb-4">What happens next?</h2>
              <ul className="space-y-3 text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
                  <span>You&apos;ll receive a confirmation email with your subscription details.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
                  <span>Our team will reach out within 24 hours to schedule your onboarding call.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
                  <span>We&apos;ll start working on your custom Look and website right away.</span>
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/app"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/looks"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-full hover:bg-[var(--color-bg-cream)] transition-colors"
              >
                Browse Looks
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

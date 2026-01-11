'use client';

import { useEffect, useState } from 'react';
import { Header, Footer } from '@/components/layout';
import { Container } from '@/components/ui';

const plans = [
  {
    key: 'basic',
    name: 'Basic',
    price: 750,
    description: 'Get started with top-quality branding and a fast, effective website.',
    features: [
      'Basic Access to a Look',
      'Website Design & Management',
    ],
  },
  {
    key: 'starter',
    name: 'Starter',
    price: 1750,
    description: 'Begin attracting patients with a solid SEO strategy to build a strong foundation for growth.',
    includesText: 'Everything in Basic plus:',
    features: [
      'Expanded Access to a Look',
      'Search Engine Optimization',
      'Google Business Management',
      'Review & Reputation Management',
    ],
  },
  {
    key: 'growth',
    name: 'Growth',
    price: 3000,
    description: 'Scale up to a multi-channel marketing plan that engages patients across their entire journey.',
    includesText: 'Everything in Starter plus:',
    features: [
      'Full Access to a Look',
      'Digital Advertising Management',
      'Educational Content Marketing',
      'Social Media Management',
    ],
    popular: true,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [configId, setConfigId] = useState<string | undefined>(undefined);

  useEffect(() => {
    setConfigId(new URLSearchParams(window.location.search).get('configId') ?? undefined);
  }, []);

  const handleSubscribe = async (planKey: string) => {
    setLoading(planKey);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planKey, configId }),
      });

      const { url, error, redirect } = await response.json();

      if (response.status === 401 && redirect) {
        window.location.href = redirect;
        return;
      }

      if (error) {
        console.error('Checkout error:', error);
        alert(typeof error === 'string' ? error : 'Failed to start checkout. Please try again.');
        return;
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Header variant="light" />

      <main className="min-h-screen bg-white py-16">
        <Container>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading mb-6">
              Choose a Patientli plan that works for you.
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto">
              Whether you&apos;re just starting out or taking over the town, we&apos;ve got a plan that will fit your needs.
              Patientli plans are designed to grow with you. No long commitments, upgrade or downgrade anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.key}
                className={`rounded-3xl p-8 flex flex-col ${
                  plan.popular
                    ? 'bg-[var(--color-bg-dark)] text-white'
                    : 'bg-[var(--color-bg-mint)]'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <span className="inline-block self-start px-4 py-1.5 bg-[var(--color-accent)] text-[var(--color-bg-dark)] rounded-full text-xs font-medium uppercase tracking-wide mb-4">
                    Most Popular
                  </span>
                )}

                {/* Plan Name & Price */}
                <h2
                  className="text-2xl font-heading mb-4"
                  style={plan.popular ? { color: 'white' } : undefined}
                >
                  {plan.name} - ${plan.price.toLocaleString()}/mo
                </h2>

                {/* Description */}
                <p className={`mb-6 ${plan.popular ? 'text-white/80' : 'text-[var(--color-text-secondary)]'}`}>
                  {plan.description}
                </p>

                {/* Divider */}
                <div className={`border-t mb-6 ${plan.popular ? 'border-white/20' : 'border-[var(--color-border)]'}`} />

                {/* Includes Text */}
                {plan.includesText && (
                  <p className={`text-sm mb-4 ${plan.popular ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}>
                    {plan.includesText}
                  </p>
                )}

                {/* Features List */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.popular ? 'text-[var(--color-accent)]' : 'text-[var(--color-primary)]'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.key)}
                  disabled={loading === plan.key}
                  className={`w-full py-4 px-6 rounded-full font-medium transition-colors ${
                    plan.popular
                      ? 'bg-[var(--color-accent)] text-[var(--color-bg-dark)] hover:bg-[var(--color-accent-hover)]'
                      : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.key ? 'Loading...' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-[var(--color-text-secondary)]">
              Have questions? {' '}
              <a href="/demo" className="text-[var(--color-primary)] hover:underline">
                Schedule a call
              </a>
              {' '} with our team.
            </p>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

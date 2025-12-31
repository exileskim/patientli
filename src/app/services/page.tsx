'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Container } from '@/components/ui';
import servicesData from '@/content/services.json';

// Plan filters
const plans = ['Basic', 'Growth', 'Starter'];

export default function ServicesPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    if (!selectedPlan) return servicesData;
    return servicesData.filter(service =>
      service.plans?.includes(selectedPlan.toLowerCase())
    );
  }, [selectedPlan]);

  return (
    <>
      <Header variant="light" />

      <main className="min-h-screen bg-white">
        <Container>
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 py-12">
            {/* Sidebar */}
            <aside className="space-y-6">
              <div>
                <h1 className="text-2xl font-heading mb-4">Services</h1>
                <p className="text-[var(--color-text-secondary)]">
                  Filter services by available pricing plans.
                </p>
              </div>

              {/* Plan Filters */}
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className={`block w-full text-left py-2 transition-colors ${
                    !selectedPlan
                      ? 'text-[var(--color-primary)] font-medium'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  All Services
                </button>
                {plans.map(plan => (
                  <button
                    key={plan}
                    onClick={() => setSelectedPlan(selectedPlan === plan ? null : plan)}
                    className={`block w-full text-left py-2 transition-colors ${
                      selectedPlan === plan
                        ? 'text-[var(--color-primary)] font-medium'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {plan}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {filteredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  plans: string[];
}

function ServiceCard({ service }: { service: Service }) {
  // Clean the short description (remove any HTML tags)
  const cleanDescription = service.shortDescription
    .replace(/<[^>]*>/g, '')
    .substring(0, 200);

  // Format plan tags
  const planTags = service.plans
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(', ')
    .toUpperCase();

  return (
    <div className="bg-[var(--color-bg-cream)] rounded-3xl p-8 flex flex-col">
      {/* Plan Tags */}
      {planTags && (
        <span className="inline-block self-center px-4 py-1.5 bg-white rounded-full text-xs font-medium text-[var(--color-text-secondary)] mb-6">
          {planTags}
        </span>
      )}

      {/* Service Title */}
      <h2 className="text-2xl font-heading text-center mb-4">
        {service.title} Services
      </h2>

      {/* Description */}
      <p className="text-[var(--color-text-secondary)] text-center mb-6 flex-grow">
        {cleanDescription}
      </p>

      {/* CTA Button */}
      <Link
        href={`/services/${service.slug}`}
        className="inline-flex items-center justify-center px-6 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-colors mx-auto"
      >
        {service.title.split(' ')[0]}
        {service.title.split(' ').length > 1 && ` ${service.title.split(' ').slice(1).join(' ')}`}
      </Link>
    </div>
  );
}

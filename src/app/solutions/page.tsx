import Link from 'next/link';

import { Header, Footer } from '@/components/layout';
import { Container, Section } from '@/components/ui';
import { solutions } from '@/content/solutions';

export default function SolutionsIndexPage() {
  const entries = Object.entries(solutions);

  return (
    <>
      <Header variant="light" />

      <main>
        <Section variant="default" padding="xl">
          <Container>
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl mb-6 font-heading">
                Solutions
              </h1>
              <p className="text-lg text-[var(--color-text-secondary)]">
                Patientli helps healthcare practices grow with modern branding, websites, and marketing systems.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {entries.map(([slug, solution]) => (
                <Link
                  key={slug}
                  href={`/solutions/${slug}`}
                  className="group rounded-3xl border border-[var(--color-border)] bg-white p-8 hover:bg-[var(--color-bg-cream)] transition-colors"
                >
                  <h2 className="text-2xl font-heading mb-3 group-hover:text-[var(--color-primary)]">
                    {solution.title}
                  </h2>
                  <p className="text-[var(--color-text-secondary)] mb-6">
                    {solution.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]">
                    Learn more
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}


import { Header, Footer } from '@/components/layout';
import { Container, Section } from '@/components/ui';
import { notFound } from 'next/navigation';
import { solutions } from '@/content/solutions';

export default function SolutionPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const solution = solutions[slug];

  if (!solution) {
    notFound();
  }

  return (
    <>
      <Header variant="light" />

      <main>
        {/* Hero Section */}
        <Section variant="dark" padding="xl">
          <Container>
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-heading text-white" style={{ color: 'white' }}>
                {solution.title}
              </h1>
              <p className="text-lg text-white/80 mb-8">
                {solution.description}
              </p>
              <a
                href="/demo"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors font-medium"
              >
                Schedule a call
              </a>
            </div>
          </Container>
        </Section>

        {/* Benefits Section */}
        <Section variant="default" padding="lg">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl mb-8 font-heading">How we help you grow:</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {solution.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-accent)] mt-1" />
                    <p className="text-lg text-[var(--color-text-secondary)]">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* CTA Section */}
        <Section variant="mint" padding="lg">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl mb-6 font-heading">
                Ready to grow your practice?
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                Schedule a 30 minute call with a helpful practice marketing consultant to discover how Patientli can help you connect with more patients and thrive.
              </p>
              <a
                href="/demo"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium"
              >
                Schedule a call
              </a>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}

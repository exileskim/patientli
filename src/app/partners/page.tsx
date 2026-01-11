import { Header, Footer } from '@/components/layout';
import { Container, Section } from '@/components/ui';

export default function PartnersPage() {
  return (
    <>
      <Header variant="light" />

      <main>
        <Section variant="default" padding="lg">
          <Container>
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-heading">Partner Program</h1>
              <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                Earn commissions by referring new Patientli clients. This page is a placeholder while we migrate the full site content.
              </p>
              <a
                href="/demo"
                className="mt-8 inline-flex items-center justify-center rounded-xl border-2 border-[var(--color-primary)] bg-[var(--color-primary)] px-4 py-3 text-lg font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)] hover:border-[var(--color-primary-dark)]"
              >
                Talk to our team
              </a>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}


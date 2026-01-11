import { Header, Footer } from '@/components/layout';
import { Container, Section } from '@/components/ui';

export default function ContactPage() {
  return (
    <>
      <Header variant="light" />

      <main>
        <Section variant="default" padding="lg">
          <Container>
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-heading">Contact Us</h1>
              <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                For now, the fastest way to reach us is to schedule a call.
              </p>
              <a
                href="/demo"
                className="mt-8 inline-flex items-center justify-center rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-3 text-lg font-semibold text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
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


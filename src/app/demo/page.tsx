import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button, Container, Section } from '@/components/ui';

export default function DemoPage() {
  return (
    <>
      <Header variant="light" />

      <main>
        <Section variant="dark" padding="xl">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-heading text-white" style={{ color: 'white' }}>
                  Schedule a call with Patientli.
                </h1>
                <p className="text-lg text-white/80 mb-8">
                  Tell us about your practice and goals — we&apos;ll recommend the best Look and plan, and answer any questions.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button href="/pricing" variant="primary" size="lg">
                    See plans
                  </Button>
                  <a
                    href="mailto:hello@patient.li"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium border-2 rounded-xl transition-all duration-300 ease-in-out border-white text-white hover:bg-white hover:text-[var(--color-primary)]"
                  >
                    Email us
                  </a>
                </div>

                <p className="text-sm text-white/60 mt-6">
                  Prefer to browse first?{' '}
                  <Link className="underline underline-offset-2" href="/looks">
                    Explore Looks
                  </Link>
                  .
                </p>
              </div>

              <div className="hidden lg:block">
                <div className="aspect-square bg-white/10 rounded-3xl" />
              </div>
            </div>
          </Container>
        </Section>

        <Section variant="mint" padding="lg">
          <Container size="md">
            <h2 className="text-3xl md:text-4xl mb-6 font-heading">
              What we&apos;ll cover on the call
            </h2>
            <ul className="space-y-3 text-lg text-[var(--color-text-secondary)]">
              <li>Which Look best fits your practice and audience</li>
              <li>Recommended plan and timeline</li>
              <li>Next steps to launch your new brand + website</li>
            </ul>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}

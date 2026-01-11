import { notFound } from 'next/navigation';

import { Header, Footer } from '@/components/layout';
import { Container, Section } from '@/components/ui';

const insights: Record<
  string,
  {
    title: string;
    tag: string;
    paragraphs: string[];
  }
> = {
  'how-do-todays-patients-find-providers': {
    title: "How do today's patients find providers?",
    tag: 'INSIGHT',
    paragraphs: [
      'Understanding how patients find healthcare providers is crucial for any practice looking to grow.',
      'This post covers modern patient search behavior, including the role of online reviews, search engines, and word-of-mouth referrals.',
      'If you want help improving your practice visibility, Patientli can help you build a brand + website + marketing strategy that stands out.',
    ],
  },
  'how-hims-hers-uses-branding-to-command-premium-prices': {
    title: 'How Hims + Hers uses branding to command premium prices',
    tag: 'INSIGHT',
    paragraphs: [
      'Hims + Hers built a healthcare brand that feels modern, accessible, and premium—without losing trust.',
      'This post breaks down the branding patterns behind their positioning and how those same ideas apply to dental and healthcare practices.',
    ],
  },
  'how-tend-leveraged-patient-experience-design-to-raise-198m': {
    title: 'How Tend leverages patient experience design for growth',
    tag: 'INSIGHT',
    paragraphs: [
      'Tend grew by rethinking the entire patient experience, from brand to physical environment to digital touchpoints.',
      'This post highlights the design decisions that helped them earn trust quickly and scale their model.',
    ],
  },
};

export default function InsightDetailPage({ params }: { params: { slug: string } }) {
  const insight = insights[params.slug];
  if (!insight) notFound();

  return (
    <>
      <Header variant="dark" />

      <main>
        <Section variant="dark" padding="xl">
          <Container>
            <div className="max-w-4xl">
              <div className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                {insight.tag}
              </div>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-heading text-white">
                {insight.title}
              </h1>
              <a
                href="/demo"
                className="mt-10 inline-flex items-center justify-center rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-3 text-lg font-semibold text-[var(--color-primary)] transition-colors hover:border-white hover:bg-white"
              >
                Schedule a call
              </a>
            </div>
          </Container>
        </Section>

        <Section variant="default" padding="lg">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              {insight.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}


import { Header, Footer } from '@/components/layout';
import { Container, Section } from '@/components/ui';
import { notFound } from 'next/navigation';


// Resources data
const resources: Record<string, {
  title: string;
  type: string;
  content: string[];
}> = {
  'how-patients-find-providers': {
    title: 'How do today\'s patients find providers?',
    type: 'REPORT',
    content: [
      'Understanding how patients find healthcare providers is crucial for any practice looking to grow. Modern patients have fundamentally different expectations and search behaviors than previous generations.',
      'This report explores the latest data on patient search behavior, including the role of online reviews, search engines, social media, and word-of-mouth referrals in the patient decision-making process.',
      'Learn which marketing channels drive the most patient acquisition, how patients evaluate providers online, and what factors influence their final choice of practice.',
    ],
  },
  'hims-hers-branding': {
    title: 'How Hims + Hers uses branding to command premium prices',
    type: 'E-BOOK',
    content: [
      'Hims + Hers has revolutionized healthcare by building a brand that patients actually want to engage with. Their success demonstrates the power of modern branding in healthcare.',
      'This e-book breaks down the branding strategies that allow Hims + Hers to command premium prices while rapidly scaling their patient base.',
      'Discover how they use design, messaging, and customer experience to create a brand that stands out in a crowded healthcare market.',
    ],
  },
  'tend-patient-experience': {
    title: 'How Tend leverages patient experience design for growth',
    type: 'REPORT',
    content: [
      'Tend Dental has grown rapidly by completely reimagining the dental practice experience. Their approach proves that patient experience is a powerful growth driver.',
      'This report examines how Tend uses experience design – from their physical spaces to their digital presence – to attract and retain patients.',
      'Learn the specific strategies Tend uses to create a modern patient experience that drives word-of-mouth referrals and justifies premium pricing.',
    ],
  },
};

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = resources[slug];

  if (!resource) {
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
              <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium mb-6">
                {resource.type}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-heading text-white" style={{ color: 'white' }}>
                {resource.title}
              </h1>
              <a
                href="/demo"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors font-medium"
              >
                Download now
              </a>
            </div>
          </Container>
        </Section>

        {/* Content Section */}
        <Section variant="default" padding="lg">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {resource.content.map((paragraph, index) => (
                  <p key={index} className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    {paragraph}
                  </p>
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
                Schedule a call with our team to discover how Patientli can help you attract more patients and grow your practice.
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

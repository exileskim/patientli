import { Header, Footer } from '@/components/layout';
import { Container, Section } from '@/components/ui';
import { notFound } from 'next/navigation';

// Solutions data
const solutions: Record<string, {
  title: string;
  description: string;
  benefits: string[];
}> = {
  'dental-practices': {
    title: 'Marketing Solutions for Dental Practices',
    description: 'Attract more patients and grow your dental practice with our comprehensive marketing solutions designed specifically for general dentistry.',
    benefits: [
      'Modern website design that converts visitors into patients',
      'SEO strategies that rank you at the top of local search results',
      'Review management to build trust and credibility',
      'Social media content that engages your community',
    ],
  },
  'orthodontic-practices': {
    title: 'Marketing Solutions for Orthodontic Practices',
    description: 'Stand out in your market and attract more orthodontic patients with marketing strategies designed for orthodontists.',
    benefits: [
      'Showcase your expertise in Invisalign, braces, and modern orthodontics',
      'Attract families looking for orthodontic care',
      'Build a brand that resonates with parents and teens',
      'Generate consistent new patient consultations',
    ],
  },
  'cosmetic-dentistry-practices': {
    title: 'Marketing Solutions for Cosmetic Dentistry',
    description: 'Position your practice as the premier destination for cosmetic dentistry with marketing that showcases your transformative work.',
    benefits: [
      'Portfolio-focused websites that highlight your cosmetic results',
      'Premium brand positioning for high-value cases',
      'Before/after showcases that demonstrate your expertise',
      'Marketing that attracts patients seeking smile transformations',
    ],
  },
  'chiropractic-practices': {
    title: 'Marketing Solutions for Chiropractic Practices',
    description: 'Grow your chiropractic practice with marketing strategies that position you as the go-to wellness provider in your community.',
    benefits: [
      'Educational content that builds trust and authority',
      'Local SEO to dominate your service area',
      'Modern branding that appeals to health-conscious patients',
      'Patient acquisition strategies that drive consistent growth',
    ],
  },
  'dermatology-practices': {
    title: 'Marketing Solutions for Dermatology Practices',
    description: 'Attract more patients seeking medical and cosmetic dermatology services with marketing built for dermatologists.',
    benefits: [
      'Showcase your expertise in both medical and cosmetic dermatology',
      'Build authority in your specialty areas',
      'Modern, professional branding that builds patient trust',
      'Strategies to attract both aesthetic and medical patients',
    ],
  },
  'optometry-practices': {
    title: 'Marketing Solutions for Optometry Practices',
    description: 'Stand out from retail chains and grow your optometry practice with marketing that highlights your personalized care.',
    benefits: [
      'Differentiate from big-box optical retailers',
      'Showcase your expertise and personalized service',
      'Drive eyewear and eyecare appointment bookings',
      'Build a modern brand that attracts patients',
    ],
  },
  'plastic-surgery-practices': {
    title: 'Marketing Solutions for Plastic Surgery',
    description: 'Attract more consultations and grow your plastic surgery practice with premium marketing and branding.',
    benefits: [
      'Luxury brand positioning for high-value procedures',
      'Portfolio showcases that highlight your surgical artistry',
      'Patient acquisition strategies for cosmetic procedures',
      'Marketing that builds trust and credibility',
    ],
  },
  'dso-marketing-agency': {
    title: 'Marketing Agency for Dental Service Organizations',
    description: 'Scale your DSO with marketing solutions designed for multi-location dental organizations.',
    benefits: [
      'Consistent branding across all locations',
      'Centralized marketing management for efficiency',
      'Local SEO strategies for each practice location',
      'Data-driven approach to patient acquisition at scale',
    ],
  },
};

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors font-medium"
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

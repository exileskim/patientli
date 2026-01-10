import { Header, Footer } from '@/components/layout';
import { Container, Section } from '@/components/ui';
import { notFound } from 'next/navigation';


// Service pages data
const services: Record<string, {
  title: string;
  description: string;
  heroText: string;
}> = {
  'healthcare-website-design': {
    title: 'Beautiful and effective dental practice websites.',
    description: 'Long before a patient ever meets you, they\'ll see your website. A great website is more than a great first impression– it\'s your foundation for your entire marketing strategy. Patientli helps practices turn their websites into beautiful, helpful, trust-building patient attraction machines.',
    heroText: 'Be found, stand out and attract your best patients with Patientli.',
  },
  'brand-design': {
    title: 'Create a memorable brand that attracts patients.',
    description: 'Your brand is how patients perceive your practice. A strong brand helps you stand out, build trust, and attract the patients you want. Patientli creates distinctive brands that resonate with modern patients and set you apart from competitors.',
    heroText: 'Be found, stand out and attract your best patients with Patientli.',
  },
  'search-engine-optimization': {
    title: 'Rank higher and attract more patients with SEO.',
    description: 'When patients search for dental care in your area, will they find you? Our proven SEO strategies help practices rank at the top of Google search results, driving consistent new patient growth month after month.',
    heroText: 'Be found, stand out and attract your best patients with Patientli.',
  },
  'content-marketing': {
    title: 'Content that educates, builds trust, and attracts patients.',
    description: 'Great content helps patients find you, understand your services, and choose your practice. We create engaging, SEO-optimized content that positions you as the expert and drives patient acquisition.',
    heroText: 'Be found, stand out and attract your best patients with Patientli.',
  },
  'digital-advertising-management': {
    title: 'Targeted ads that bring in new patients.',
    description: 'Reach potential patients exactly when they\'re looking for dental care. Our data-driven advertising campaigns on Google and social media deliver consistent patient flow with measurable ROI.',
    heroText: 'Be found, stand out and attract your best patients with Patientli.',
  },
  'review-and-reputation-management': {
    title: 'Build trust with more positive reviews.',
    description: 'Your online reputation influences every patient decision. We help you generate more 5-star reviews, respond professionally to feedback, and build the trust that attracts new patients.',
    heroText: 'Be found, stand out and attract your best patients with Patientli.',
  },
  'social-media-management': {
    title: 'Connect with patients on social media.',
    description: 'Stay top-of-mind with engaging social media content that showcases your practice, educates patients, and builds community. We handle everything from strategy to posting.',
    heroText: 'Be found, stand out and attract your best patients with Patientli.',
  },
  'answer-engine-optimization': {
    title: 'Be the answer patients are looking for.',
    description: 'Modern patients ask AI and voice assistants for recommendations. Answer Engine Optimization ensures your practice shows up in ChatGPT, Google AI, and voice search results.',
    heroText: 'Be found, stand out and attract your best patients with Patientli.',
  },
};

export default function ServicePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const service = services[slug];

  if (!service) {
    notFound();
  }

  return (
    <>
      <Header variant="light" />

      <main>
        {/* Hero Section */}
        <Section variant="dark" padding="xl">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-heading text-white" style={{ color: 'white' }}>
                  {service.title}
                </h1>
                <p className="text-lg text-white/80 mb-8">
                  {service.description}
                </p>
                <a
                  href="/demo"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors font-medium"
                >
                  Schedule a call
                </a>
              </div>
              <div className="hidden lg:block">
                <div className="aspect-square bg-white/10 rounded-3xl" />
              </div>
            </div>
          </Container>
        </Section>

        {/* Info Section */}
        <Section variant="default" padding="lg">
          <Container>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl mb-6 font-heading">
                {service.heroText}
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)]">
                We&apos;re a new kind of dental marketing service that&apos;s been thoughtfully designed from the ground up to serve all of the marketing needs of growing practices. Our stunning designs and researched-backed marketing approaches help generate results for growth-minded dental businesses of all sizes.
              </p>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}

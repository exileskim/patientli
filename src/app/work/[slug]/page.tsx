import { Header, Footer } from '@/components/layout';
import { Container, Section } from '@/components/ui';
import { notFound } from 'next/navigation';

// This would typically come from a CMS or database
const caseStudies: Record<string, {
  title: string;
  subtitle: string;
  clientOverview: string;
  challenges: { title: string; description: string }[];
  solutions: { title: string; description: string }[];
  results: { title: string; description: string }[];
  images?: string[];
}> = {
  'forestville-family-dentistry-website-brand': {
    title: 'Forestville Family Dentistry: A Modern Brand + Website Helps a New Practice Gain Traction',
    subtitle: 'A new practice gains traction with a fresh website, brand and top page search results.',
    clientOverview: 'Forestville Family Dentistry operates in Forestville, CA, under a single practitioner. Following the acquisition from a retiring dentist, the owner aspired to introduce a revitalized brand and website, signaling a refreshing approach to dental care. The key goal was to mitigate potential patient loss during the transition and ensure new patient growth. Given the frequent patient migration to nearby towns for dental needs, it was crucial for the practice to be prominently visible in local online searches.',
    challenges: [
      {
        title: 'Generic Web Presence:',
        description: 'The previous website used a standard template, with the practice lacking content ownership. The initial website was not unique, and its content was not proprietary, making it hard to differentiate the practice in the local digital landscape.',
      },
      {
        title: 'Limited Mobile Usability:',
        description: 'The website lacked responsiveness for mobile users. Potential patients accessing the website on mobile devices encountered a less than ideal user experience, making it harder to retain their interest.',
      },
      {
        title: 'Absence of Distinct Branding:',
        description: 'The practice did not have its own logo or recognizable brand identity. Without a distinct visual identity, it was challenging to differentiate the newly acquired practice from its predecessor or other competitors.',
      },
    ],
    solutions: [
      {
        title: 'Branding Transformation:',
        description: 'Form + Function created a distinctive brand for Forestville Family Dentistry, infusing a fresh color scheme, tailored fonts, and a renewed visual identity. With a fresh visual direction, the practice could now showcase its new management\'s approach and ethos.',
      },
      {
        title: 'Custom Web Design:',
        description: 'The new brand was integrated into a tailor-made website, adhering to healthcare website best practices. Each service and location was given its dedicated webpage, ensuring the site\'s seamless usability across varying devices and screen dimensions.\n\nAs the practice didn\'t previously own any of the content or images on its website, Form + Function designed and developed the website and all content for it, which the practice now owns. We purposefully used a simple website layout to avoid the need for lots of custom or stock photography, instead generating visual interest with the use of color and custom fonts.',
      },
      {
        title: 'Comprehensive Digital Strategy:',
        description: 'A robust online marketing approach was implemented, integrating SEO, targeted social media campaigns, and automated review solicitations. This strategy aimed at amplifying the practice\'s local online presence and driving a consistent inflow of new patients.',
      },
    ],
    results: [
      {
        title: 'Prominent Online Visibility:',
        description: 'Forestville Family Dentistry now stands out in local search outcomes, especially when potential patients seek dental services. Their revamped digital presence ensures that they are one of the first options potential patients encounter when seeking dental care in and around Forestville.',
      },
      {
        title: 'Enhanced Patient Feedback:',
        description: 'The practice now boasts a wealth of positive patient testimonials across various platforms. Such positive feedback not only adds credibility to the practice but also offers potential patients a glimpse into the quality of care they can expect.',
      },
    ],
    images: [
      '/images/work/patientli-brand-forestville-bento.webp',
    ],
  },
  'moore-pascarella-heinzen-brand-website': {
    title: 'Moore, Pascarella & Heinzen leads in its local market with a new brand, website and marketing strategy.',
    subtitle: 'Moore, Pascarella & Heinzen leads in its local market with a new brand, website and marketing strategy.',
    clientOverview: 'Moore, Pascarella & Heinzen is a dental practice serving the Redding & Red Bluff communities in Northern California. The practice offers comprehensive dental care with a focus on family dentistry, cosmetic procedures, and restorative treatments.',
    challenges: [
      {
        title: 'Outdated Brand Identity:',
        description: 'The practice needed a modern, professional brand that would resonate with today\'s patients while maintaining trust and credibility.',
      },
      {
        title: 'Limited Online Presence:',
        description: 'The existing website did not effectively showcase the practice\'s services or convert visitors into patients.',
      },
      {
        title: 'Local Market Competition:',
        description: 'Standing out in a competitive market required a comprehensive digital strategy beyond just a new website.',
      },
    ],
    solutions: [
      {
        title: 'Modern Brand Development:',
        description: 'Created a contemporary brand identity that conveys professionalism, expertise, and patient care through refined typography, color palette, and visual elements.',
      },
      {
        title: 'Conversion-Focused Website:',
        description: 'Designed and developed a user-friendly website optimized for patient acquisition, featuring clear calls-to-action, service pages, and appointment scheduling.',
      },
      {
        title: 'Integrated Marketing Strategy:',
        description: 'Implemented comprehensive SEO, content marketing, and local search optimization to increase visibility and attract new patients.',
      },
    ],
    results: [
      {
        title: 'Market Leadership:',
        description: 'The practice now leads in local search rankings for key dental services in their service area.',
      },
      {
        title: 'Increased Patient Acquisition:',
        description: 'Significant growth in new patient inquiries and appointments through improved online presence.',
      },
      {
        title: 'Professional Brand Recognition:',
        description: 'Enhanced brand perception and recognition in the local community.',
      },
    ],
    images: [
      '/images/work/patientli-work-moore-and-pascarella.webp',
    ],
  },
  'mpdg-dental-web-design-example': {
    title: 'A comprehensive digital marketing strategy helps MPDG attract 100+ patients each month.',
    subtitle: 'A comprehensive digital marketing strategy helps MPDG attract 100+ patients each month.',
    clientOverview: 'Monterey Peninsula Dental Group (MPDG) is a multi-location dental practice serving the Monterey Peninsula. The practice needed to scale their patient acquisition efforts while maintaining quality care.',
    challenges: [
      {
        title: 'Multi-Location Marketing:',
        description: 'Managing marketing efforts across multiple locations while maintaining consistent branding and messaging.',
      },
      {
        title: 'Patient Volume Goals:',
        description: 'The practice needed to consistently attract over 100 new patients monthly to support growth.',
      },
      {
        title: 'Digital Presence:',
        description: 'Existing website and digital marketing efforts were not generating adequate patient flow.',
      },
    ],
    solutions: [
      {
        title: 'Multi-Channel Digital Strategy:',
        description: 'Implemented a comprehensive approach combining SEO, paid advertising, social media, and review management.',
      },
      {
        title: 'Optimized Website Design:',
        description: 'Created a high-converting website with location-specific pages and streamlined appointment booking.',
      },
      {
        title: 'Ongoing Campaign Management:',
        description: 'Continuous optimization of digital campaigns to maximize patient acquisition and ROI.',
      },
    ],
    results: [
      {
        title: '100+ New Patients Monthly:',
        description: 'Consistently generating over 100 new patient appointments each month through digital marketing efforts.',
      },
      {
        title: 'Improved Conversion Rates:',
        description: 'Website conversion rates increased significantly with optimized user experience and clear calls-to-action.',
      },
      {
        title: 'Scalable Growth:',
        description: 'Established sustainable marketing systems that support continued practice expansion.',
      },
    ],
    images: [
      '/images/work/mpdg-on-device.webp',
    ],
  },
};

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy = caseStudies[slug];

  if (!caseStudy) {
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
                {caseStudy.title}
              </h1>
              <p className="text-lg text-white/80 mb-8">
                {caseStudy.subtitle}
              </p>
              <a
                href="/demo"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[var(--color-primary)] transition-colors font-medium"
              >
                Work with us
              </a>
            </div>
          </Container>
        </Section>

        {/* Client Overview */}
        <Section variant="default" padding="lg">
          <Container>
            <div className="max-w-4xl">
              <h2 className="text-3xl mb-6 font-heading">Client Overview:</h2>
              <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                {caseStudy.clientOverview}
              </p>
            </div>
          </Container>
        </Section>

        {/* Challenges */}
        <Section variant="default" padding="lg">
          <Container>
            <div className="max-w-4xl">
              <h2 className="text-3xl mb-6 font-heading">Challenges:</h2>
              <div className="space-y-6">
                {caseStudy.challenges.map((challenge, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Solutions */}
        <Section variant="default" padding="lg">
          <Container>
            <div className="max-w-4xl">
              <h2 className="text-3xl mb-6 font-heading">Solutions:</h2>
              <div className="space-y-6">
                {caseStudy.solutions.map((solution, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold mb-2">
                      {solution.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                      {solution.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Results */}
        <Section variant="default" padding="lg">
          <Container>
            <div className="max-w-4xl">
              <h2 className="text-3xl mb-6 font-heading">Results:</h2>
              <div className="space-y-6">
                {caseStudy.results.map((result, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold mb-2">
                      {result.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      {result.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Images Section */}
        {caseStudy.images && caseStudy.images.length > 0 && (
          <Section variant="cream" padding="lg">
            <Container>
              <div className="grid md:grid-cols-2 gap-8">
                {caseStudy.images.map((image, index) => (
                  <div key={index} className="aspect-video bg-white rounded-2xl overflow-hidden">
                    <img
                      src={image}
                      alt={`${caseStudy.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </Container>
          </Section>
        )}
      </main>

      <Footer />
    </>
  );
}

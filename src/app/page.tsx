import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button, Container, Section, Card, CardTag } from '@/components/ui';

// Hero section content
const heroContent = {
  headline: 'Patientli helps you get',
  headlineAccent: 'more patients.',
  description: 'Patientli helps healthcare practices connect with more patients and thrive with modern brands, websites and marketing strategies.',
  cta: {
    text: 'Schedule a call',
    href: '/demo',
  },
};

// Features section
const features = [
  {
    title: 'Pick your look',
    description: "First impressions matter to today's patients. We arm dental businesses with modern, polished brands that command attention and build loyalty.",
    link: { text: 'Browse our Looks', href: '/looks' },
    image: '/images/home/patientli-brand-lumena-colors.webp',
  },
  {
    title: 'Pick your layouts',
    description: 'Choose from a variety of website layouts designed for dentists and informed by data. A beautiful and helpful website is the foundation for ranking on Google.',
    link: { text: 'Learn more', href: '/services/healthcare-website-design' },
    image: '/images/home/patientli-lumena-home-desktop-1440.webp',
  },
  {
    title: 'Pick your plan',
    description: "From search results to reviews sites, social media and ads, our services are designed to help your businesses become the clear, visible choice for patients.",
    link: null,
    image: '/images/home/patientli-brand-kit-bentobox-lumena.webp',
  },
];

// Case studies
const caseStudies = [
  {
    title: 'A new practice gains traction with a fresh website, brand and top page search results.',
    href: '/work/forestville-family-dentistry-website-brand',
    image: '/images/work/patientli-brand-forestville-bento.webp',
  },
  {
    title: 'Moore, Pascarella & Heinzen leads in its local market with a new brand, website and marketing strategy.',
    href: '/work/moore-pascarella-heinzen-brand-website',
    image: '/images/work/patientli-work-moore-and-pascarella.webp',
  },
  {
    title: 'A comprehensive digital marketing strategy helps MPDG attract 100+ patients each month.',
    href: '/work/mpdg-dental-web-design-example',
    image: '/images/work/mpdg-on-device.webp',
  },
];

// Resources
const resources = [
  {
    title: "How do today's patients find providers?",
    tag: 'REPORT',
    href: '/resources/how-patients-find-providers',
    variant: 'dark' as const,
    image: '/images/resources/patientli-featured-post-how-do-patients-find-providers.webp',
  },
  {
    title: 'How Hims + Hers uses branding to command premium prices',
    tag: 'E-BOOK',
    href: '/resources/hims-hers-branding',
    variant: 'peach' as const,
    image: '/images/resources/patientli-featured-post-hims-hers-premium-prices.webp',
  },
  {
    title: 'How Tend leverages patient experience design for growth',
    tag: 'REPORT',
    href: '/resources/tend-patient-experience',
    variant: 'sage' as const,
    image: '/images/resources/patientli-featured-post-how-tend-leverages-patient-experience-design.webp',
  },
];

export default function Home() {
  return (
    <>
      <Header variant="dark" />

      <main>
        {/* Hero Section */}
        <Section variant="dark" padding="xl" className="relative overflow-hidden">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
              {/* Left Content */}
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-heading" style={{ color: 'white' }}>
                  {heroContent.headline}{' '}
                  <span className="italic" style={{ color: 'var(--color-accent)' }}>{heroContent.headlineAccent}</span>
                </h1>
                <p className="text-lg text-white/80 mb-8">
                  {heroContent.description}
                </p>
                <Link
                  href={heroContent.cta.href}
                  className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-accent)] text-black rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors font-medium"
                  style={{ color: 'black' }}
                >
                  {heroContent.cta.text}
                </Link>
              </div>

              {/* Right - Hero Image */}
              <div className="relative hidden lg:block">
                <img
                  src="/images/home/patientli-homepage-hero.webp"
                  alt="Healthcare professional using Patientli"
                  className="w-full"
                />
              </div>
            </div>
          </Container>
        </Section>

        {/* Value Proposition Section */}
        <Section variant="default" padding="lg">
          <Container>
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl mb-6 font-heading">
                Be found, stand out and attract your best patients with Patientli.
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)]">
                We&apos;re a new kind of dental marketing service that&apos;s been thoughtfully designed from the ground up to serve all of the marketing needs of growing practices. Our stunning designs and researched-backed marketing approaches help generate results for growth-minded dental businesses of all sizes.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="aspect-[4/3] bg-[var(--color-bg-cream)] rounded-3xl mb-6 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl mb-3 font-heading">{feature.title}</h3>
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    {feature.description}
                  </p>
                  {feature.link && (
                    <Link
                      href={feature.link.href}
                      className="text-[var(--color-primary)] font-medium underline underline-offset-2 hover:no-underline"
                    >
                      {feature.link.text}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Find Your Look Section */}
        <Section variant="mint" padding="lg">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl mb-6 font-heading">
                  Find your practice&apos;s new Look today.
                </h2>
                <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                  Patientli Looks are a shortcut to world-class branding for dental practices. Designs for logos, websites, marketing materials and much more.
                </p>
                <Button href="/looks" variant="primary">
                  Find your look
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {/* Bento grid of look previews */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <p className="text-3xl font-heading text-[var(--color-primary)]">Aa</p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">Headings</p>
                  <p className="text-xl mt-4">Bb</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Paragraph</p>
                </div>
                <div className="bg-[var(--color-primary)] rounded-2xl p-4 flex flex-wrap items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#9AB69C]" />
                  <div className="w-12 h-12 rounded-full bg-[#C8D4C0]" />
                  <div className="w-12 h-12 rounded-full bg-white" />
                  <div className="w-12 h-12 rounded-full bg-[#F5D5C8]" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-sm row-span-2">
                  <img
                    src="/images/home/patientli-brand-lumena-signage.webp"
                    alt="Lumena Orthodontics signage"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="col-span-2 rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src="/images/home/patientli-brand-lumena-laptop-mock.webp"
                    alt="Lumena website mockup"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Case Studies Section */}
        <Section variant="default" padding="lg">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4 font-heading">Great design. Better results.</h2>
              <p className="text-lg text-[var(--color-text-secondary)]">
                Explore how practices like yours have achieved better visibility and reached their new patient goals with Patientli.
              </p>
            </div>

            <div className="space-y-6">
              {caseStudies.map((study, index) => (
                <Card key={index} href={study.href} variant="cream" className="block">
                  <div className="grid md:grid-cols-[1fr,2fr] items-center">
                    <div className="p-8">
                      <h3 className="text-xl md:text-2xl font-heading">{study.title}</h3>
                      <span className="inline-flex items-center mt-4 text-[var(--color-primary)] font-medium underline underline-offset-2">
                        Read More
                      </span>
                    </div>
                    <div className="aspect-video md:rounded-r-[2.5rem] overflow-hidden">
                      <img
                        src={study.image}
                        alt={study.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* CTA Section */}
        <Section variant="mint" padding="lg">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl mb-6 font-heading">
                  Schedule a call to see how Patientli can help your practice reach its goals.
                </h2>
                <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                  Schedule a 30 minute call with a helpful practice marketing consultant to discover how Patientli can help you connect with more patients and thrive.
                </p>
                <Button href="/demo" variant="primary">
                  Schedule a call
                </Button>
              </div>
              <div className="relative">
                {/* Growth chart illustration */}
                <div className="aspect-video relative">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    {/* Background bars */}
                    {[...Array(12)].map((_, i) => (
                      <rect
                        key={i}
                        x={20 + i * 32}
                        y={180 - (40 + i * 10)}
                        width={24}
                        height={40 + i * 10}
                        fill="var(--color-bg-cream)"
                        rx={4}
                      />
                    ))}
                    {/* Growth line */}
                    <path
                      d="M32 160 Q100 140 200 100 T380 40"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Resources Section */}
        <Section variant="cream" padding="lg">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4 font-heading">
                Need more info? Keep learning with these free resources:
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)]">
                Our best working relationships happen when our clients are informed and empowered partners in their marketing strategies. We&apos;ve created these free resources to earn your business and your trust.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <Card
                  key={index}
                  href={resource.href}
                  variant={resource.variant}
                  className="overflow-hidden"
                >
                  <div className="p-6 min-h-[350px] flex flex-col">
                    <CardTag variant={resource.variant === 'dark' ? 'default' : 'dark'}>
                      {resource.tag}
                    </CardTag>
                    <h3 className={`text-xl mt-4 font-heading ${resource.variant === 'dark' ? 'text-white' : ''}`}>
                      {resource.title.split(' ').map((word, i) => {
                        const italicWords = ['patients', 'command', 'premium', 'prices', 'patient', 'experience'];
                        const isItalic = italicWords.includes(word.toLowerCase().replace(/[^a-z]/g, ''));
                        return isItalic ? <em key={i}>{word} </em> : `${word} `;
                      })}
                    </h3>
                    <div className="mt-auto pt-6">
                      <div className="aspect-video rounded-xl overflow-hidden">
                        <img
                          src={resource.image}
                          alt={resource.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}

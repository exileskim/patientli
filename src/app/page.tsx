import Link from 'next/link';
import Image from 'next/image';
import { Header, Footer } from '@/components/layout';
import { Container, Section } from '@/components/ui';
import { HomeWorkCarousel } from '@/components/marketing/HomeWorkCarousel';

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
    description: (
      <>
        First impressions matter to today’s patients. We arm dental businesses with modern, polished brands that command
        attention and build loyalty. <Link href="/looks" className="underline underline-offset-2">Browse our Looks</Link>{' '}
        and pick or make tweaks to one you love.
      </>
    ),
    image: '/images/home/patientli-brand-lumena-colors.webp',
    width: 612,
    height: 412,
  },
  {
    title: 'Pick your layouts',
    description: (
      <>
        Choose from a variety of website layouts designed for dentists and informed by data. A beautiful and helpful
        website is the the foundation for ranking on Google, gaining new patients and increasing care acceptance.{' '}
        <Link href="/services/healthcare-website-design" className="underline underline-offset-2">Learn more</Link>.
      </>
    ),
    image: '/images/home/patientli-brand-lumena-laptop-mock.webp',
    width: 612,
    height: 412,
  },
  {
    title: 'Pick your plan',
    description: "From search results to reviews sites, social media and ads, our services are designed to help your businesses become the clear, visible choice for patients at each step of their journey to care.",
    image: '/images/home/Pick-Your-Plan.webp',
    width: 612,
    height: 411,
  },
];

// Case studies
const caseStudies = [
  {
    title: 'A new practice gains traction with a fresh website, brand and top page search results.',
    href: '/work/forestville-family-dentistry-website-brand',
    image: '/images/work/Forestville-Brand.webp',
    imageAlt: 'Patientli brand Forestville brand style',
    width: 800,
    height: 450,
  },
  {
    title: 'Moore, Pascarella & Heinzen leads in its local market with a new brand, website and marketing strategy.',
    href: '/work/moore-pascarella-heinzen-brand-website',
    image: '/images/work/moore-and-pascarella-4.webp',
    imageAlt: 'Patientli work Moore and Pascarella brand style',
    width: 800,
    height: 450,
  },
  {
    title: 'A comprehensive digital marketing strategy helps MPDG attract 100+ patients each month.',
    href: '/work/mpdg-dental-web-design-example',
    image: '/images/work/patientli-work-monterey-peninsula.webp',
    imageAlt: 'Patientli work website design for MPDG',
    width: 612,
    height: 612,
  },
];

const insights = [
  {
    href: '/insights/how-do-todays-patients-find-providers',
    logo: '/images/brand/patientli-logo-light-1.svg',
    logoWidth: 120,
    logoHeight: 52,
    title: (
      <>
        How do <span className="italic">today’s patients</span> find providers?
      </>
    ),
    backgroundColor: 'var(--color-primary)',
    backgroundImage: '/images/resources/patientli-featured-post-how-do-patients-find-providers.webp',
    textClassName: 'text-white',
  },
  {
    href: '/insights/how-hims-hers-uses-branding-to-command-premium-prices',
    logo: '/images/brand/patientli-logo-light-2.svg',
    logoWidth: 118,
    logoHeight: 52,
    title: (
      <>
        How Hims + Hers uses branding to <span className="italic">command premium prices</span>
      </>
    ),
    backgroundColor: '#D2AE8E',
    backgroundImage: '/images/resources/patientli-featured-post-hims-hers-premium-prices.webp',
    textClassName: 'text-white',
  },
  {
    href: '/insights/how-tend-leveraged-patient-experience-design-to-raise-198m',
    logo: '/images/brand/patientli-logo-dark-1.svg',
    logoWidth: 120,
    logoHeight: 52,
    title: <>How Tend leverages patient experience design for growth</>,
    backgroundColor: '#C2D3C1',
    backgroundImage: '/images/resources/patientli-post-how-tend-leverages-patient-experience-design-for-growth.webp',
    textClassName: 'text-[var(--color-text-primary)]',
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
                <h1 className="text-[40px] md:text-5xl lg:text-6xl mb-6 font-heading text-white">
                  {heroContent.headline}{' '}
                  <span style={{ color: 'var(--color-highlight)' }}>{heroContent.headlineAccent}</span>
                </h1>
                <p className="text-lg text-white mb-8">
                  {heroContent.description}
                </p>
                <Link
                  href={heroContent.cta.href}
                  className="inline-flex items-center justify-center rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-accent)] px-3 py-[14px] text-[15px] font-semibold text-[var(--color-primary)] transition-colors hover:border-white hover:bg-white"
                >
                  {heroContent.cta.text}
                </Link>
              </div>

              {/* Right - Hero Image */}
              <div className="relative hidden lg:block">
                <Image
                  src="/images/home/Patientli-Homepage-Hero-Illustration.webp"
                  alt="Patientli"
                  width={849}
                  height={824}
                  className="w-full h-auto"
                  priority
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
              <p className="text-lg">
                We&apos;re a new kind of dental marketing service that&apos;s been thoughtfully designed from the ground up to serve all of the marketing needs of growing practices. Our stunning designs and researched-backed marketing approaches help generate results for growth-minded dental businesses of all sizes.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="space-y-4">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={feature.width}
                    height={feature.height}
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="h-auto w-full rounded-[26px]"
                  />
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-lg">{feature.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Find Your Look Section */}
        <Section variant="default" padding="lg">
          <Container>
            <div className="rounded-2xl bg-[var(--color-bg-mint-strong)] p-4 md:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-16">
                <div className="lg:flex-1">
                  <h2 className="text-3xl md:text-4xl mb-6 font-heading">
                    Find your practice&apos;s new Look today.
                  </h2>
                  <p className="text-lg mb-8">
                    Patientli Looks are a shortcut to world-class branding for dental practices. Designs for logos, websites,
                    marketing materials and much more.
                  </p>
                  <Link
                    href="/looks"
                    className="inline-flex items-center justify-center rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-accent)] px-3 py-[14px] text-lg font-semibold text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                  >
                    Find your look
                  </Link>
                </div>
                <div className="w-full lg:max-w-[800px]">
                  <Image
                    src="/images/home/patientli-look-lumena-blocks.webp"
                    alt="The Lumena look by Patientli"
                    width={1308}
                    height={786}
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="h-auto w-full"
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
              <p className="text-lg">
                Explore how practices like yours have achieved better visibility and reached their new patient goals with Patientli.
              </p>
            </div>

            <HomeWorkCarousel items={caseStudies} />
          </Container>
        </Section>

        {/* CTA Section */}
        <Section variant="default" padding="lg">
          <Container>
            <div className="rounded-2xl bg-[var(--color-bg-mint-strong)] p-4 md:p-6 lg:p-10 bg-no-repeat [background-image:url(/images/home/patientli-SEO.webp)] [background-position:95%_90%] lg:[background-position:99%_90%] [background-size:60%_auto] lg:[background-size:40%_auto]">
              <div className="max-w-xl md:max-w-[55%]">
                <h2 className="text-3xl md:text-4xl mb-6 font-heading">
                  Schedule a call to see how Patientli can help your practice reach its goals.
                </h2>
                <p className="text-lg mb-8">
                  Schedule a 30 minute call with a helpful practice marketing consultant to discover how Patientli can help
                  you connect with more patients and thrive.
                </p>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-accent)] px-3 py-[14px] text-lg font-semibold text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                >
                  Schedule a call
                </Link>
              </div>
            </div>
          </Container>
        </Section>

        {/* Resources Section */}
        <Section variant="default" padding="lg">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4 font-heading">
                Need more info? Keep learning with these free resources:
              </h2>
              <p className="text-lg">
                Our best working relationships happen when our clients are informed and empowered partners in their marketing strategies. We&apos;ve created these free resources to earn your business and your trust.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              {insights.map((insight) => (
                <Link
                  key={insight.href}
                  href={insight.href}
                  className={`flex min-h-[400px] flex-col justify-between rounded-3xl p-8 lg:min-h-[600px] ${insight.textClassName}`}
                  style={{
                    backgroundColor: insight.backgroundColor,
                    backgroundImage: `url(${insight.backgroundImage})`,
                    backgroundPosition: 'bottom center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                  }}
                >
                  <Image
                    src={insight.logo}
                    alt="patient.li logo"
                    width={insight.logoWidth}
                    height={insight.logoHeight}
                  />
                  <h3 className="font-display text-4xl font-medium leading-tight">{insight.title}</h3>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}

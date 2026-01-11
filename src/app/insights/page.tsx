import Link from 'next/link';
import Image from 'next/image';

import { Header, Footer } from '@/components/layout';
import { Container, Section } from '@/components/ui';

const featuredInsights = [
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

export default function InsightsPage() {
  return (
    <>
      <Header variant="light" />

      <main>
        <Section variant="default" padding="lg">
          <Container>
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl mb-4 font-heading">Insights</h1>
              <p className="text-lg text-[var(--color-text-secondary)]">
                Expert marketing insights for dental practices.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              {featuredInsights.map((insight) => (
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
                  <h2 className="font-display text-4xl font-medium leading-tight">{insight.title}</h2>
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


import Link from 'next/link';
import Image from 'next/image';
import { Button, Container } from '@/components/ui';

const footerSections = [
  {
    title: 'Services',
    links: [
      { label: 'Answer Engine Optimization', href: '/services/answer-engine-optimization' },
      { label: 'Brand Design', href: '/services/brand-design' },
      { label: 'Content Marketing', href: '/services/content-marketing' },
      { label: 'Digital Advertising Management', href: '/services/digital-advertising-management' },
      { label: 'Healthcare Website Design', href: '/services/healthcare-website-design' },
      { label: 'Review and Reputation Management', href: '/services/review-and-reputation-management' },
      { label: 'Search Engine Optimization', href: '/services/search-engine-optimization' },
      { label: 'Social Media Management', href: '/services/social-media-management' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'DSO Marketing Agency', href: '/solutions/dso-marketing-agency' },
      { label: 'For Chiropractic Practices', href: '/solutions/chiropractic-practices' },
      { label: 'For Cosmetic Dentistry Practices', href: '/solutions/cosmetic-dentistry-practices' },
      { label: 'For Dental Practices', href: '/solutions/dental-practices' },
      { label: 'For Dermatology Practices', href: '/solutions/dermatology-practices' },
      { label: 'For Optometry Practices', href: '/solutions/optometry-practices' },
      { label: 'For Orthodontic Practices', href: '/solutions/orthodontic-practices' },
      { label: 'For Plastic Surgery Practices', href: '/solutions/plastic-surgery-practices' },
      { label: 'Looks', href: '/looks' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Resources', href: '/resources' },
      { label: 'Insights', href: '/insights' },
      { label: 'Partner Program', href: '/partner-program' },
      { label: 'Get a Demo', href: '/demo' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Legal', href: '/legal' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-bg-dark)] text-white">
      <Container>
        <div className="py-16 md:py-20">
          {/* Logo */}
          <div className="mb-12">
            <Image
              src="/images/brand/patientli-logo-light.svg"
              alt="Patientli"
              width={140}
              height={48}
            />
          </div>

          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* About Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">About us:</h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Patientli helps doctors and dentists get more patients with our transparent, research-backed marketing approach.
              </p>
              <Button href="/demo" variant="primary" size="sm">
                Get a demo
              </Button>
            </div>

            {/* Link Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-medium mb-4">{section.title}:</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              Copyright {new Date().getFullYear()} Patientli. Made by{' '}
              <a
                href="https://formfunction.co"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Form + Function
              </a>
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="text-white/60 text-sm hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/60 text-sm hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

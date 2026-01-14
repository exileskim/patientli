'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Container } from '@/components/ui';
import { LookThumbnail } from '@/modules/looks/ui/look-thumbnail';

interface MegaLink {
  label: string;
  href: string;
  description?: string;
}

interface MegaImageLink extends MegaLink {
  image?: string;
  imageAlt?: string;
  width?: number;
  height?: number;
  lookSlug?: string;
}

interface MegaMenu {
  columns: MegaLink[][];
  featured?: MegaImageLink[];
  aside?: {
    headline: MegaLink;
    sectionLabel: string;
    thumbnails: MegaImageLink[];
  };
}

interface NavItem {
  label: string;
  href: string;
  mega?: MegaMenu;
}

const navigation: NavItem[] = [
  {
    label: 'Services',
    href: '/services',
    mega: {
      columns: [
        [
          {
            label: 'Brand Design',
            href: '/services/brand-design',
            description: 'Stand out and impress patients with a modern brand.',
          },
          {
            label: 'Website Design',
            href: '/services/healthcare-website-design',
            description: 'Custom, patient-friendly websites for dental practices.',
          },
          {
            label: 'AEO',
            href: '/services/answer-engine-optimization',
            description: 'Healthcare AEO that can prepare you for the future of search.',
          },
        ],
        [
          {
            label: 'Search Engine Optimization',
            href: '/services/search-engine-optimization',
            description: 'Improve your search rankings and attract more patients.',
          },
          {
            label: 'Digital Advertising',
            href: '/services/digital-advertising-management',
            description: 'Boost your visibility with search and social ads.',
          },
        ],
        [
          {
            label: 'Social Media Management',
            href: '/services/social-media-management',
            description: 'Engage and educate your patient base with social.',
          },
          {
            label: 'Review Management',
            href: '/services/review-and-reputation-management',
            description: 'Collect and manage reviews to build trust.',
          },
        ],
      ],
    },
  },
  {
    label: 'Solutions',
    href: '/solutions',
    mega: {
      columns: [
        [
          {
            label: 'Patientli for DSOs/MSOs',
            href: '/solutions/dso-marketing-agency',
            description: 'Scalable marketing solutions for multi-location dental groups.',
          },
          {
            label: 'Patientli for Cosmetic Dentistry',
            href: '/solutions/cosmetic-dentistry-practices',
            description: 'Attract and convert high-value cosmetic dental patients.',
          },
          {
            label: 'Patientli for General Dentistry',
            href: '/solutions/dental-practices',
            description: 'Smart strategies to attract, retain, and grow your patient base.',
          },
          {
            label: 'Patientli for Optometry Practices',
            href: '/solutions/optometry-practices',
            description: 'Proven digital marketing services built for optometry practices.',
          },
        ],
        [
          {
            label: 'Patientli for Orthodontic Dentistry',
            href: '/solutions/orthodontic-practices',
            description: 'Targeted marketing to grow referrals and start more cases.',
          },
          {
            label: 'Patientli for Chiropractic Practices',
            href: '/solutions/chiropractic-practices',
            description: 'Digital tools to boost visibility and steady patient flow.',
          },
          {
            label: 'Patientli for Dermatology Practices',
            href: '/solutions/dermatology-practices',
            description: 'Highlight your expertise and drive more skin care bookings.',
          },
          {
            label: 'Patientli for Plastic Surgery Practices',
            href: '/solutions/plastic-surgery-practices',
            description: 'Premium branding and lead generation that converts.',
          },
        ],
      ],
      aside: {
        headline: {
          label: 'Explore Patientli Looks',
          href: '/looks',
          description:
            'Take a shortcut to a memorable and effective brand with a customizable Look for your practice.',
        },
        sectionLabel: 'Explore by Suggested Use',
        thumbnails: [
          {
            label: 'General',
            href: '/brand/general-dentistry',
            lookSlug: 'lumena',
          },
          {
            label: 'Ortho',
            href: '/brand/orthodontics',
            lookSlug: 'arches',
          },
          {
            label: 'Cosmetic',
            href: '/brand/cosmetic-surgery',
            lookSlug: 'aura',
          },
        ],
      },
    },
  },
  {
    label: 'Resources',
    href: '/resources',
    mega: {
      columns: [
        [
          {
            label: 'Partner Program',
            href: '/partners',
            description: 'Earn commissions by referring new clients.',
          },
          {
            label: 'Contact Us',
            href: '/contact',
            description: 'Get in touch with our experts.',
          },
        ],
        [
          {
            label: 'Free Resources',
            href: '/resources',
            description: 'Guides, templates, and tools to elevate your practice.',
          },
          {
            label: 'Insights',
            href: '/insights',
            description: 'Expert marketing insights for dental practices.',
          },
        ],
      ],
      featured: [
        {
          label: "How do today's patients find providers?",
          href: '/insights/how-do-todays-patients-find-providers',
          image: '/images/resources/patientli-featured-post-how-do-patients-find-providers.webp',
          imageAlt: 'Person on their phone with a light green radial circle in the background',
          width: 1200,
          height: 800,
        },
        {
          label: 'How Tend Leveraged Patient Experience Design to Raise $198M',
          href: '/insights/how-tend-leveraged-patient-experience-design-to-raise-198m',
          image: '/images/resources/patientli-featured-post-how-tend-leverages-patient-experience-design.webp',
          imageAlt: 'Three healthcare professionals smiling',
          width: 1200,
          height: 800,
        },
      ],
    },
  },
];

interface HeaderProps {
  variant?: 'light' | 'dark';
}

export function Header({ variant = 'dark' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isDark = variant === 'dark';

  return (
    <header
      className={`
        sticky top-0 z-50
        ${isDark ? 'bg-[var(--color-bg-dark)]' : 'bg-white'}
        transition-colors duration-300
      `}
    >
      <Container padding={false} className="px-8 lg:px-12">
        <nav className="flex items-center justify-between py-8 lg:py-12">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={isDark ? '/images/brand/patientli-logo-light.svg' : '/images/brand/patientli-logo-dark.svg'}
              alt="Patientli"
              width={120}
              height={52}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navigation.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => (item.mega ? setOpenDropdown(item.label) : null)}
                onMouseLeave={() => (item.mega ? setOpenDropdown(null) : null)}
              >
                {item.mega ? (
                  <button
                    className={`
                      flex items-center gap-1 py-2
                      text-sm font-semibold transition-colors
                      ${isDark ? 'text-white hover:text-[var(--color-accent)]' : 'text-[var(--color-primary)] hover:text-[var(--color-primary-light)]'}
                    `}
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-1 py-2
                      text-sm font-semibold transition-colors
                      ${isDark ? 'text-white hover:text-[var(--color-accent)]' : 'text-[var(--color-primary)] hover:text-[var(--color-primary-light)]'}
                    `}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Mega Menu Dropdown */}
                {item.mega && openDropdown === item.label && (
                  <div
                    className="absolute top-full left-0 right-0 w-screen"
                    style={{ marginLeft: 'calc(-50vw + 50%)' }}
                  >
                    <div
                      className={`
                        py-12 px-8
                        ${isDark ? 'bg-[var(--color-bg-dark)]' : 'bg-white'}
                        border-t ${isDark ? 'border-white/10' : 'border-[var(--color-border)]'}
                      `}
                    >
                      <Container>
                        <div className="grid grid-cols-3 gap-x-12 gap-y-8">
                          {item.mega.columns.map((column, columnIndex) => (
                            <div key={`${item.label}-col-${columnIndex}`} className="flex flex-col gap-8">
                              {column.map((link) => (
                                <Link key={link.href} href={link.href} className="block group">
                                  <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[var(--color-primary)]'}`}>
                                    {link.label}
                                  </p>
                                  {link.description ? (
                                    <p className={`mt-2 text-sm ${isDark ? 'text-white/70' : 'text-[var(--color-text-secondary)]'}`}>
                                      {link.description}
                                    </p>
                                  ) : null}
                                </Link>
                              ))}
                            </div>
                          ))}

                          {item.mega.aside ? (
                            <div className="flex flex-col gap-6">
                              <Link href={item.mega.aside.headline.href} className="block group">
                                <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[var(--color-primary)]'}`}>
                                  {item.mega.aside.headline.label}
                                </p>
                                {item.mega.aside.headline.description ? (
                                  <p className={`mt-2 text-sm ${isDark ? 'text-white/70' : 'text-[var(--color-text-secondary)]'}`}>
                                    {item.mega.aside.headline.description}
                                  </p>
                                ) : null}
                              </Link>

                              <p className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-[var(--color-text-secondary)]'}`}>
                                {item.mega.aside.sectionLabel}
                              </p>

                              <div className="grid grid-cols-3 gap-4">
                                {item.mega.aside.thumbnails.map((thumb) => (
                                  <Link key={thumb.href} href={thumb.href} className="group">
                                    <div className="overflow-hidden rounded-2xl bg-white/5">
                                      {thumb.lookSlug ? (
                                        <LookThumbnail
                                          lookSlug={thumb.lookSlug}
                                          practiceName="Your Practice"
                                          className="aspect-square w-full"
                                        />
                                      ) : thumb.image ? (
                                        <Image
                                          src={thumb.image}
                                          alt={thumb.imageAlt ?? ''}
                                          width={thumb.width ?? 566}
                                          height={thumb.height ?? 566}
                                          className="h-auto w-full"
                                        />
                                      ) : null}
                                    </div>
                                    <p className={`mt-2 text-sm ${isDark ? 'text-white/80' : 'text-[var(--color-text-secondary)]'}`}>
                                      {thumb.label}
                                    </p>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          {item.mega.featured ? (
                            <div className="flex flex-col gap-6">
                              {item.mega.featured.map((feature) => (
                                <Link key={feature.href} href={feature.href} className="block group">
                                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[var(--color-primary)]'}`}>
                                    {feature.label}
                                  </h3>
                                  <div className="mt-4 overflow-hidden rounded-2xl bg-white/5">
                                    {feature.image ? (
                                      <Image
                                        src={feature.image}
                                        alt={feature.imageAlt ?? ''}
                                        width={feature.width ?? 1200}
                                        height={feature.height ?? 800}
                                        sizes="(max-width: 1024px) 100vw, 360px"
                                        className="h-auto w-full"
                                      />
                                    ) : null}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </Container>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/demo"
              className={`
                inline-flex items-center justify-center px-6 py-3
                text-sm font-semibold rounded-xl transition-colors
                ${isDark
                  ? 'bg-white text-[var(--color-primary)] hover:bg-gray-100'
                  : 'bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent-hover)]'
                }
              `}
            >
              Schedule a call
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 ${isDark ? 'text-white' : 'text-[var(--color-primary)]'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={`
              lg:hidden py-6
              ${isDark ? 'bg-[var(--color-bg-dark)]' : 'bg-white'}
              border-t ${isDark ? 'border-white/10' : 'border-[var(--color-border)]'}
            `}
          >
            {navigation.map((item) => (
              <div key={item.label} className="mb-4">
                <Link
                  href={item.href}
                  className={`
                    block py-2 font-medium
                    ${isDark ? 'text-white' : 'text-[var(--color-primary)]'}
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.mega ? (
                  <div className="ml-4 mt-2 space-y-2">
                    {[...item.mega.columns.flat(), ...(item.mega.featured ?? []), ...(item.mega.aside?.thumbnails ?? [])].map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block py-1 ${isDark ? 'text-white/70' : 'text-[var(--color-text-secondary)]'}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <div className="mt-6">
              <Button href="/demo" variant="primary" fullWidth>
                Schedule a call
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Container } from '@/components/ui';

interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    label: 'Services',
    href: '/services',
    children: [
      {
        label: 'Brand Design',
        href: '/services/brand-design',
        description: 'Stand out and impress patients with a modern brand.'
      },
      {
        label: 'Website Design',
        href: '/services/healthcare-website-design',
        description: 'Custom, patient-friendly websites for dental practices.'
      },
      {
        label: 'AEO',
        href: '/services/answer-engine-optimization',
        description: 'Healthcare AEO that can prepare you for the future of search.'
      },
      {
        label: 'Search Engine Optimization',
        href: '/services/search-engine-optimization',
        description: 'Improve your search rankings and attract more patients.'
      },
      {
        label: 'Digital Advertising',
        href: '/services/digital-advertising-management',
        description: 'Boost your visibility with search and social ads.'
      },
      {
        label: 'Social Media Management',
        href: '/services/social-media-management',
        description: 'Engage and educate your patient base with social.'
      },
      {
        label: 'Review Management',
        href: '/services/review-and-reputation-management',
        description: 'Collect and manage reviews to build trust.'
      },
    ],
  },
  {
    label: 'Solutions',
    href: '/solutions',
    children: [
      {
        label: 'Patientli for DSOs/MSOs',
        href: '/solutions/dso-marketing-agency',
        description: 'Scalable marketing solutions for multi-location dental groups.'
      },
      {
        label: 'Patientli for Cosmetic Dentistry',
        href: '/solutions/cosmetic-dentistry-practices',
        description: 'Attract and convert high-value cosmetic dental patients.'
      },
      {
        label: 'Patientli for General Dentistry',
        href: '/solutions/dental-practices',
        description: 'Smart strategies to attract, retain, and grow your patient base.'
      },
      {
        label: 'Patientli for Optometry Practices',
        href: '/solutions/optometry-practices',
        description: 'Proven digital marketing services built for optometry practices.'
      },
      {
        label: 'Patientli for Orthodontic Dentistry',
        href: '/solutions/orthodontic-practices',
        description: 'Targeted marketing to grow referrals and start more cases.'
      },
      {
        label: 'Patientli for Chiropractic Practices',
        href: '/solutions/chiropractic-practices',
        description: 'Digital tools to boost visibility and steady patient flow.'
      },
      {
        label: 'Patientli for Dermatology Practices',
        href: '/solutions/dermatology-practices',
        description: 'Highlight your expertise and drive more skin care bookings.'
      },
      {
        label: 'Patientli for Plastic Surgery Practices',
        href: '/solutions/plastic-surgery-practices',
        description: 'Premium branding and lead generation that converts.'
      },
    ],
  },
  {
    label: 'Looks',
    href: '/looks',
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
  {
    label: 'Resources',
    href: '/resources',
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
      <Container>
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={isDark ? '/images/brand/patientli-logo-light.svg' : '/images/brand/patientli-logo-dark.svg'}
              alt="Patientli"
              width={120}
              height={40}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => (item.children ? setOpenDropdown(item.label) : null)}
                onMouseLeave={() => (item.children ? setOpenDropdown(null) : null)}
              >
                {item.children ? (
                  <button
                    className={`
                      flex items-center gap-1 py-2
                      font-medium transition-colors
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
                      font-medium transition-colors
                      ${isDark ? 'text-white hover:text-[var(--color-accent)]' : 'text-[var(--color-primary)] hover:text-[var(--color-primary-light)]'}
                    `}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Mega Menu Dropdown */}
                {item.children && openDropdown === item.label && (
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
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block group"
                            >
                              <h3 className={`
                                text-lg font-semibold mb-2
                                ${isDark ? 'text-white' : 'text-[var(--color-primary)]'}
                              `}>
                                {child.label}
                              </h3>
                              {child.description && (
                                <p className={`
                                  text-sm
                                  ${isDark ? 'text-white/70' : 'text-[var(--color-text-secondary)]'}
                                `}>
                                  {child.description}
                                </p>
                              )}
                            </Link>
                          ))}
                        </div>
                      </Container>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/demo"
              className={`
                inline-flex items-center justify-center px-6 py-3
                font-medium rounded-lg transition-colors
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
                {item.children && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`
                          block py-1
                          ${isDark ? 'text-white/70' : 'text-[var(--color-text-secondary)]'}
                        `}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
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

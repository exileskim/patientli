'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { Button, Container } from '@/components/ui';
import looksData from '@/content/looks.json';

// Preview tab types
type PreviewTab = 'desktop' | 'mobile' | 'print' | 'promotional' | 'social';

const previewTabs: { id: PreviewTab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'desktop',
    label: 'Website on desktop',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'mobile',
    label: 'Website on mobile',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'print',
    label: 'Print materials',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'promotional',
    label: 'Promotional products',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    id: 'social',
    label: 'Social media content',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function LookDetailPage({ params }: PageProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>('desktop');
  const resolvedParams = use(params);

  const look = looksData.find(l => l.slug === resolvedParams.slug);

  if (!look) {
    notFound();
  }

  return (
    <>
      <Header variant="light" />

      <main className="min-h-screen bg-white">
        <Container>
          {/* Breadcrumb */}
          <div className="py-6">
            <Link
              href="/looks"
              className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              All Looks
            </Link>
            <span className="mx-3 text-[var(--color-text-muted)]">&gt;</span>
            <span className="text-[var(--color-primary)]">{look.title}</span>
          </div>

          <div className="grid lg:grid-cols-[320px_1fr] gap-12 pb-16">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
              <div>
                <h1 className="text-2xl font-heading mb-3">{look.title}</h1>
                <p className="text-[var(--color-text-secondary)]">
                  Explore the premade look and layouts of {look.title}.
                </p>
              </div>

              {/* Preview Tabs */}
              <nav className="space-y-1">
                {previewTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[var(--color-bg-cream)] text-[var(--color-primary)] font-medium'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-cream)]/50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* CTA */}
              <div className="pt-4 border-t border-[var(--color-border)]">
                <p className="text-[var(--color-text-secondary)] mb-4">
                  Get started today to use {look.title} as the basis for your brand and website.
                </p>
                <Button href="/demo" variant="primary" fullWidth>
                  Get started with {look.title}
                </Button>
                <p className="text-sm text-[var(--color-text-muted)] mt-4 flex items-start gap-2">
                  <svg className="w-5 h-5 text-[var(--color-accent)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  You&apos;ll have the chance to request edits after purchase.
                </p>
              </div>
            </aside>

            {/* Preview Area */}
            <div className="relative">
              <div className="bg-[var(--color-bg-cream)] rounded-3xl overflow-hidden">
                {/* Desktop Preview */}
                {activeTab === 'desktop' && (
                  <div className="p-6">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                      {/* Browser Chrome */}
                      <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 bg-white rounded-md px-4 py-1 text-xs text-gray-400 text-center">
                          {look.title.toLowerCase().replace(/\s+/g, '')}.com
                        </div>
                      </div>
                      {/* Website Mockup */}
                      <div className="aspect-[16/10] bg-[var(--color-bg-dark)] relative overflow-hidden">
                        {/* Hero section mockup */}
                        <div className="absolute inset-0 p-8">
                          {/* Nav */}
                          <div className="flex justify-between items-center mb-16">
                            <span className="text-white font-heading text-xl">{look.title.toLowerCase()}</span>
                            <div className="flex gap-4 text-white/60 text-sm">
                              <span>Services</span>
                              <span>About</span>
                              <span>Blog</span>
                            </div>
                          </div>
                          {/* Hero content */}
                          <div className="grid grid-cols-2 gap-8 items-center h-[60%]">
                            <div>
                              <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Healthcare</p>
                              <h2 className="text-white text-2xl font-heading mb-4">
                                Beautiful smiles start here.
                              </h2>
                              <p className="text-white/70 text-sm mb-6">
                                We blend the latest technology with personalized care.
                              </p>
                              <div className="flex gap-3">
                                <span className="px-4 py-2 bg-white text-[var(--color-primary)] text-xs rounded-full">
                                  Book Now
                                </span>
                                <span className="px-4 py-2 border border-white/30 text-white text-xs rounded-full">
                                  Learn More
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <div className="w-40 h-40 rounded-full bg-white/20" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* More sections mockup */}
                      <div className="p-8 space-y-8">
                        <div className="text-center">
                          <h3 className="text-xl font-heading text-[var(--color-primary)] mb-2">
                            Modern care for modern patients.
                          </h3>
                          <p className="text-sm text-[var(--color-text-muted)]">
                            Experience the difference with our comprehensive approach.
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="aspect-square bg-[var(--color-bg-mint)] rounded-xl" />
                          <div className="aspect-square bg-[var(--color-bg-cream)] rounded-xl" />
                          <div className="aspect-square bg-[var(--color-bg-peach)] rounded-xl" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Preview */}
                {activeTab === 'mobile' && (
                  <div className="p-6 flex justify-center">
                    <div className="w-[280px] bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-8 border-gray-900">
                      {/* Phone notch */}
                      <div className="bg-gray-900 h-6 flex justify-center">
                        <div className="w-20 h-4 bg-black rounded-b-xl" />
                      </div>
                      {/* Screen content */}
                      <div className="aspect-[9/16] bg-[var(--color-bg-dark)] relative overflow-hidden">
                        <div className="p-4">
                          <span className="text-white font-heading">{look.title.toLowerCase()}</span>
                          <div className="mt-12">
                            <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Healthcare</p>
                            <h2 className="text-white text-lg font-heading mb-3">
                              Beautiful smiles start here.
                            </h2>
                            <p className="text-white/70 text-xs mb-4">
                              We blend the latest technology with personalized care.
                            </p>
                            <span className="inline-block px-4 py-2 bg-white text-[var(--color-primary)] text-xs rounded-full">
                              Book Now
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Print Materials Preview */}
                {activeTab === 'print' && (
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Business Card */}
                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="aspect-[1.75/1] bg-[var(--color-bg-dark)] rounded-lg p-4 flex flex-col justify-between">
                          <span className="text-white font-heading text-sm">{look.title}</span>
                          <div className="text-white/70 text-xs">
                            <p>Dr. Jane Smith</p>
                            <p>General Dentistry</p>
                          </div>
                        </div>
                        <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">Business Card</p>
                      </div>
                      {/* Letterhead */}
                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="aspect-[8.5/11] bg-white border border-gray-200 rounded-lg p-4">
                          <span className="text-[var(--color-primary)] font-heading text-sm">{look.title}</span>
                          <div className="mt-4 space-y-2">
                            <div className="h-2 bg-gray-100 rounded w-3/4" />
                            <div className="h-2 bg-gray-100 rounded w-full" />
                            <div className="h-2 bg-gray-100 rounded w-2/3" />
                          </div>
                        </div>
                        <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">Letterhead</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Promotional Products Preview */}
                {activeTab === 'promotional' && (
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Tote Bag */}
                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="aspect-square bg-[var(--color-bg-cream)] rounded-lg flex items-center justify-center">
                          <span className="text-[var(--color-primary)] font-heading">{look.title}</span>
                        </div>
                        <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">Tote Bag</p>
                      </div>
                      {/* Mug */}
                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="aspect-square bg-[var(--color-bg-mint)] rounded-lg flex items-center justify-center">
                          <span className="text-[var(--color-primary)] font-heading text-sm">{look.title}</span>
                        </div>
                        <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">Coffee Mug</p>
                      </div>
                      {/* ID Badge */}
                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="aspect-[2/3] bg-white border border-gray-200 rounded-lg p-2 flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-bg-cream)] mb-2" />
                          <span className="text-[var(--color-primary)] font-heading text-xs">{look.title}</span>
                          <p className="text-[6px] text-gray-400 mt-1">Dr. Jane Smith</p>
                        </div>
                        <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">ID Badge</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Media Preview */}
                {activeTab === 'social' && (
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                          <div className={`w-full h-full ${
                            i % 3 === 0 ? 'bg-[var(--color-bg-dark)]' :
                            i % 3 === 1 ? 'bg-[var(--color-bg-mint)]' :
                            'bg-[var(--color-bg-peach)]'
                          } flex items-center justify-center`}>
                            <span className={`font-heading ${i % 3 === 0 ? 'text-white' : 'text-[var(--color-primary)]'}`}>
                              {look.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scroll hint */}
                <div className="flex items-center justify-center gap-2 py-4 text-[var(--color-text-muted)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <span className="text-sm">Scroll to view full design</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="max-w-3xl pb-16">
            <h2 className="text-2xl font-heading mb-4">About {look.title}</h2>
            <div className="prose text-[var(--color-text-secondary)]">
              {look.description.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

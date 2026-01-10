'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { Button, Container } from '@/components/ui';
import looksData from '@/content/looks.json';
import { base64urlDecodeToString, base64urlEncodeString } from '@/lib/base64url';
import { lookConfigDocumentSchemaV1 } from '@/modules/looks/domain/config.schema';
import type { LookTokenOverridesV1, LookTokensV1 } from '@/modules/looks/domain/tokens.schema';
import { cssVarsFromLookTokensV1, mergeLookTokensV1 } from '@/modules/looks/ui/tokens';

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
  params: { slug: string };
}

const accentPresets = [
  { label: 'Lime', value: '#E8F59E' },
  { label: 'Peach', value: '#F5D5C8' },
  { label: 'Sage', value: '#D4E5D7' },
];

const fontPairs = [
  {
    label: 'Classic',
    headingFamily: '"ivypresto-display", Georgia, "Times New Roman", serif',
    bodyFamily: '"Outfit", system-ui, -apple-system, sans-serif',
  },
  {
    label: 'Serif',
    headingFamily: 'Georgia, "Times New Roman", serif',
    bodyFamily: '"Outfit", system-ui, -apple-system, sans-serif',
  },
  {
    label: 'Modern',
    headingFamily: '"Outfit", system-ui, -apple-system, sans-serif',
    bodyFamily: '"Outfit", system-ui, -apple-system, sans-serif',
  },
];

export default function LookDetailPage({ params }: PageProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>('desktop');
  const router = useRouter();
  const searchParams = useSearchParams();

  const [practiceName, setPracticeName] = useState('Forestville Family Dentistry');
  const [practicePhone, setPracticePhone] = useState('(555) 555-5555');
  const [tokenOverrides, setTokenOverrides] = useState<LookTokenOverridesV1>({});
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const lookSlug = params.slug;
  const look = useMemo(() => looksData.find((entry) => entry.slug === lookSlug), [lookSlug]);

  const baseTokens = useMemo<LookTokensV1>(() => {
    const headingDefault = fontPairs[0].headingFamily;
    const bodyDefault = fontPairs[0].bodyFamily;
    const colors = look?.colors ?? {
      primary: '#103034',
      secondary: '#E6F2EF',
      accent: '#E8F59E',
      background: '#FFFFFF',
    };

    return {
      color: {
        primary: colors.primary,
        accent: colors.accent,
        bg: colors.background,
        surface: colors.secondary,
        text: colors.primary,
      },
      typography: {
        headingFamily: headingDefault,
        bodyFamily: bodyDefault,
      },
    };
  }, [look?.colors]);

  const mergedTokens = useMemo(
    () => mergeLookTokensV1(baseTokens, tokenOverrides),
    [baseTokens, tokenOverrides]
  );

  const previewStyle = useMemo(
    () => cssVarsFromLookTokensV1(mergedTokens),
    [mergedTokens]
  );

  const practice = useMemo(
    () => ({
      name: practiceName.trim(),
      phone: practicePhone.trim() || undefined,
    }),
    [practiceName, practicePhone]
  );

  const domainLabel = useMemo(() => {
    const slugified = practice.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 32);
    return `${slugified || 'yourpractice'}.com`;
  }, [practice.name]);

  useEffect(() => {
    const encoded = searchParams.get('c');
    const configId = searchParams.get('id');
    if (!encoded && !configId) return;

    let cancelled = false;

    async function load() {
      try {
        if (encoded) {
          const decoded = base64urlDecodeToString(encoded);
          const json = JSON.parse(decoded);
          const parsed = lookConfigDocumentSchemaV1.safeParse(json);
          if (!parsed.success) return;

          const doc = parsed.data;
          if (doc.lookSlug !== lookSlug) return;

          if (cancelled) return;
          setPracticeName(doc.practice.name);
          setPracticePhone(doc.practice.phone ?? '');
          setTokenOverrides(doc.tokenOverrides ?? {});
          return;
        }

        if (configId) {
          const response = await fetch(`/api/configs/${configId}`);
          const json = await response.json();
          const parsed = lookConfigDocumentSchemaV1.safeParse(json.config);
          if (!parsed.success) return;

          const doc = parsed.data;
          if (doc.lookSlug !== lookSlug) return;

          if (cancelled) return;
          setPracticeName(doc.practice.name);
          setPracticePhone(doc.practice.phone ?? '');
          setTokenOverrides(doc.tokenOverrides ?? {});
        }
      } catch {
        // ignore
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [lookSlug, searchParams]);

  async function saveConfig() {
    if (!practice.name) {
      setShareMessage('Enter a practice name to continue.');
      return null;
    }

    const response = await fetch('/api/configs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lookSlug,
        lookVersion: 1,
        patch: {
          industry: 'dental',
          practice,
          tokenOverrides,
        },
      }),
    });

    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.id) {
      setShareMessage('Could not save configuration. Please try again.');
      return null;
    }

    return json.id as string;
  }

  async function handleCopyShareLink() {
    setShareMessage(null);

    const configDocument = {
      schemaVersion: 1 as const,
      lookSlug,
      lookVersion: 1,
      industry: 'dental' as const,
      practice,
      tokenOverrides,
    };

    const encoded = base64urlEncodeString(JSON.stringify(configDocument));
    let url = `${window.location.origin}/looks/${lookSlug}?c=${encoded}`;

    if (url.length > 2000) {
      const id = await saveConfig();
      if (!id) return;
      url = `${window.location.origin}/looks/${lookSlug}?id=${id}`;
    }

    await navigator.clipboard.writeText(url);
    setShareMessage('Share link copied.');
  }

  async function handleContinueToPricing() {
    setShareMessage(null);
    setIsSaving(true);
    try {
      const id = await saveConfig();
      if (!id) return;
      router.push(`/pricing?configId=${id}`);
    } finally {
      setIsSaving(false);
    }
  }

  if (!look) {
    return (
      <>
        <Header variant="light" />
        <main className="min-h-screen bg-white py-16">
          <Container>
            <h1 className="text-3xl font-heading mb-3">Look not found</h1>
            <p className="text-[var(--color-text-secondary)] mb-8">
              That Look doesn&apos;t exist (or hasn&apos;t been published yet).
            </p>
            <Link
              href="/looks"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Back to Looks
            </Link>
          </Container>
        </main>
        <Footer />
      </>
    );
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

              {/* Personalization */}
              <div className="pt-4 border-t border-[var(--color-border)] space-y-4">
                <div>
                  <h2 className="text-sm font-medium mb-3 text-[var(--color-text-muted)]">Personalize</h2>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="practiceName" className="block text-sm font-medium mb-1">
                        Practice name
                      </label>
                      <input
                        id="practiceName"
                        value={practiceName}
                        onChange={(e) => setPracticeName(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="Your practice name"
                      />
                    </div>
                    <div>
                      <label htmlFor="practicePhone" className="block text-sm font-medium mb-1">
                        Phone (optional)
                      </label>
                      <input
                        id="practicePhone"
                        value={practicePhone}
                        onChange={(e) => setPracticePhone(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="(555) 555-5555"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-medium mb-3 text-[var(--color-text-muted)]">Style</h2>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Accent color</p>
                      <div className="flex flex-wrap gap-2">
                        {accentPresets.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() =>
                              setTokenOverrides((prev) => ({
                                ...prev,
                                color: { ...prev.color, accent: preset.value },
                              }))
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[var(--color-border)] bg-white hover:bg-[var(--color-bg-cream)] transition-colors text-sm"
                          >
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.value }} />
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Font pair</p>
                      <div className="grid gap-2">
                        {fontPairs.map((pair) => (
                          <button
                            key={pair.label}
                            type="button"
                            onClick={() =>
                              setTokenOverrides((prev) => ({
                                ...prev,
                                typography: {
                                  ...prev.typography,
                                  headingFamily: pair.headingFamily,
                                  bodyFamily: pair.bodyFamily,
                                },
                              }))
                            }
                            className="w-full text-left px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white hover:bg-[var(--color-bg-cream)] transition-colors text-sm"
                          >
                            {pair.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {shareMessage ? (
                  <p className="text-sm text-[var(--color-text-muted)]">{shareMessage}</p>
                ) : null}

                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="w-full py-3 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-bg-cream)] transition-colors font-medium"
                  >
                    Copy share link
                  </button>

                  <button
                    type="button"
                    onClick={handleContinueToPricing}
                    disabled={isSaving || !practice.name}
                    className="w-full py-3 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving…' : 'Continue to pricing'}
                  </button>
                </div>
              </div>

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
              <div data-look-preview style={previewStyle} className="bg-[var(--color-bg-cream)] rounded-3xl overflow-hidden">
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
                          {domainLabel}
                        </div>
                      </div>
                      {/* Website Mockup */}
                      <div className="aspect-[16/10] bg-[var(--color-bg-dark)] relative overflow-hidden">
                        {/* Hero section mockup */}
                        <div className="absolute inset-0 p-8">
                          {/* Nav */}
                          <div className="flex justify-between items-center mb-16">
                            <span className="text-white font-heading text-xl">{practice.name}</span>
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
                          <span className="text-white font-heading">{practice.name}</span>
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
                          <span className="text-white font-heading text-sm">{practice.name}</span>
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
                          <span className="text-[var(--color-primary)] font-heading text-sm">{practice.name}</span>
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
                          <span className="text-[var(--color-primary)] font-heading">{practice.name}</span>
                        </div>
                        <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">Tote Bag</p>
                      </div>
                      {/* Mug */}
                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="aspect-square bg-[var(--color-bg-mint)] rounded-lg flex items-center justify-center">
                          <span className="text-[var(--color-primary)] font-heading text-sm">{practice.name}</span>
                        </div>
                        <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">Coffee Mug</p>
                      </div>
                      {/* ID Badge */}
                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="aspect-[2/3] bg-white border border-gray-200 rounded-lg p-2 flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-bg-cream)] mb-2" />
                          <span className="text-[var(--color-primary)] font-heading text-xs">{practice.name}</span>
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
                              {practice.name}
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

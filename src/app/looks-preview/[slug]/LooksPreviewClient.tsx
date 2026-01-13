'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { Button, Container } from '@/components/ui';
import looksData from '@/content/looks.json';
import { base64urlDecodeToString, base64urlEncodeString } from '@/lib/base64url';
import type { LookContentOverridesV1 } from '@/modules/looks/domain/content.schema';
import { lookConfigDocumentSchemaV1 } from '@/modules/looks/domain/config.schema';
import type { LookTokenOverridesV1, LookTokensV1 } from '@/modules/looks/domain/tokens.schema';
import { getDefaultLookContent, mergeLookContentV1 } from '@/modules/looks/ui/content';
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

type LookPreviewPayload = {
  desktop?: string[] | string;
  mobile?: string[] | string;
  print?: string[] | string;
  promotional?: string[] | string;
  social?: string[] | string;
};

type LookEntry = {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  previews?: LookPreviewPayload;
};


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

function normalizePreview(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0);
  }
  if (typeof value === 'string') return [value];
  return [];
}

export default function LooksPreviewClient({ slug }: { slug: string }) {
  const [activeTab, setActiveTab] = useState<PreviewTab>('desktop');
  const router = useRouter();
  const searchParams = useSearchParams();

  const [practiceName, setPracticeName] = useState('Forestville Family Dentistry');
  const [practicePhone, setPracticePhone] = useState('(555) 555-5555');
  const [practiceAddress1, setPracticeAddress1] = useState('123 Main Street');
  const [practiceAddress2, setPracticeAddress2] = useState('');
  const [practiceCity, setPracticeCity] = useState('Forestville');
  const [practiceState, setPracticeState] = useState('CA');
  const [practiceZip, setPracticeZip] = useState('95436');
  const [practiceLogoUrl, setPracticeLogoUrl] = useState('');
  const [tokenOverrides, setTokenOverrides] = useState<LookTokenOverridesV1>({});
  const [contentOverrides, setContentOverrides] = useState<LookContentOverridesV1>({});
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const lookSlug = slug;
  const look = useMemo(
    () => (looksData as LookEntry[]).find((entry) => entry.slug === lookSlug),
    [lookSlug]
  );

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

  const baseContent = useMemo(
    () => getDefaultLookContent({ practiceName }),
    [practiceName]
  );

  const mergedContent = useMemo(
    () => mergeLookContentV1(baseContent, contentOverrides),
    [baseContent, contentOverrides]
  );

  const previewStyle = useMemo(
    () => cssVarsFromLookTokensV1(mergedTokens),
    [mergedTokens]
  );

  const previewImages = useMemo(() => {
    const previews: LookPreviewPayload = look?.previews ?? {};
    return {
      desktop: normalizePreview(previews.desktop),
      mobile: normalizePreview(previews.mobile),
      print: normalizePreview(previews.print),
      promotional: normalizePreview(previews.promotional),
      social: normalizePreview(previews.social),
    };
  }, [look]);

  const practice = useMemo(
    () => ({
      name: practiceName.trim(),
      phone: practicePhone.trim() || undefined,
      address1: practiceAddress1.trim() || undefined,
      address2: practiceAddress2.trim() || undefined,
      city: practiceCity.trim() || undefined,
      state: practiceState.trim() || undefined,
      zip: practiceZip.trim() || undefined,
      logoUrl: practiceLogoUrl.trim() || undefined,
    }),
    [
      practiceAddress1,
      practiceAddress2,
      practiceCity,
      practiceLogoUrl,
      practiceName,
      practicePhone,
      practiceState,
      practiceZip,
    ]
  );

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
          setPracticeAddress1(doc.practice.address1 ?? '');
          setPracticeAddress2(doc.practice.address2 ?? '');
          setPracticeCity(doc.practice.city ?? '');
          setPracticeState(doc.practice.state ?? '');
          setPracticeZip(doc.practice.zip ?? '');
          setPracticeLogoUrl(doc.practice.logoUrl ?? '');
          setTokenOverrides(doc.tokenOverrides ?? {});
          setContentOverrides(doc.contentOverrides ?? {});
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
          setPracticeAddress1(doc.practice.address1 ?? '');
          setPracticeAddress2(doc.practice.address2 ?? '');
          setPracticeCity(doc.practice.city ?? '');
          setPracticeState(doc.practice.state ?? '');
          setPracticeZip(doc.practice.zip ?? '');
          setPracticeLogoUrl(doc.practice.logoUrl ?? '');
          setTokenOverrides(doc.tokenOverrides ?? {});
          setContentOverrides(doc.contentOverrides ?? {});
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
          contentOverrides,
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
      contentOverrides,
    };

    const encoded = base64urlEncodeString(JSON.stringify(configDocument));
    let url = `${window.location.origin}/looks-preview/${lookSlug}?c=${encoded}`;

    if (url.length > 2000) {
      const id = await saveConfig();
      if (!id) return;
      url = `${window.location.origin}/looks-preview/${lookSlug}?id=${id}`;
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

  function updateHeroField(
    key: 'headline' | 'subhead' | 'ctaLabel',
    value: string
  ) {
    setContentOverrides((prev) => {
      const nextHero = { ...(prev.hero ?? {}) } as Record<string, string>;
      if (!value.trim()) {
        delete nextHero[key];
      } else {
        nextHero[key] = value;
      }
      if (Object.keys(nextHero).length === 0) {
        const { hero, ...rest } = prev;
        return rest;
      }
      return { ...prev, hero: nextHero };
    });
  }

  function updateFooterField(
    key: 'headline' | 'body' | 'ctaLabel',
    value: string
  ) {
    setContentOverrides((prev) => {
      const nextFooter = { ...(prev.footerCta ?? {}) } as Record<string, string>;
      if (!value.trim()) {
        delete nextFooter[key];
      } else {
        nextFooter[key] = value;
      }
      if (Object.keys(nextFooter).length === 0) {
        const { footerCta, ...rest } = prev;
        return rest;
      }
      return { ...prev, footerCta: nextFooter };
    });
  }

  function updateAbout(value: string) {
    setContentOverrides((prev) => {
      if (!value.trim()) {
        const { about, ...rest } = prev;
        return rest;
      }
      return { ...prev, about: value };
    });
  }

  function parseLines(value: string) {
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function updateHighlights(value: string) {
    const lines = parseLines(value);
    setContentOverrides((prev) => {
      if (lines.length === 0) {
        const { highlights, ...rest } = prev;
        return rest;
      }
      return { ...prev, highlights: lines };
    });
  }

  function updateServices(value: string) {
    const lines = parseLines(value);
    setContentOverrides((prev) => {
      if (lines.length === 0) {
        const { services, ...rest } = prev;
        return rest;
      }
      return { ...prev, services: lines };
    });
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
              href="/looks-preview"
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
              href="/looks-preview"
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
                    <div>
                      <label htmlFor="practiceAddress1" className="block text-sm font-medium mb-1">
                        Address line 1
                      </label>
                      <input
                        id="practiceAddress1"
                        value={practiceAddress1}
                        onChange={(e) => setPracticeAddress1(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div>
                      <label htmlFor="practiceAddress2" className="block text-sm font-medium mb-1">
                        Address line 2 (optional)
                      </label>
                      <input
                        id="practiceAddress2"
                        value={practiceAddress2}
                        onChange={(e) => setPracticeAddress2(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="Suite 200"
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="practiceCity" className="block text-sm font-medium mb-1">
                          City
                        </label>
                        <input
                          id="practiceCity"
                          value={practiceCity}
                          onChange={(e) => setPracticeCity(e.target.value)}
                          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                          placeholder="Forestville"
                        />
                      </div>
                      <div>
                        <label htmlFor="practiceState" className="block text-sm font-medium mb-1">
                          State
                        </label>
                        <input
                          id="practiceState"
                          value={practiceState}
                          onChange={(e) => setPracticeState(e.target.value)}
                          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                          placeholder="CA"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="practiceZip" className="block text-sm font-medium mb-1">
                        ZIP
                      </label>
                      <input
                        id="practiceZip"
                        value={practiceZip}
                        onChange={(e) => setPracticeZip(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="95436"
                      />
                    </div>
                    <div>
                      <label htmlFor="practiceLogoUrl" className="block text-sm font-medium mb-1">
                        Logo URL (optional)
                      </label>
                      <input
                        id="practiceLogoUrl"
                        value={practiceLogoUrl}
                        onChange={(e) => setPracticeLogoUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="https://..."
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

                <div>
                  <h2 className="text-sm font-medium mb-3 text-[var(--color-text-muted)]">Content</h2>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="heroHeadline" className="block text-sm font-medium mb-1">
                        Hero headline
                      </label>
                      <input
                        id="heroHeadline"
                        value={mergedContent.hero.headline}
                        onChange={(e) => updateHeroField('headline', e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label htmlFor="heroSubhead" className="block text-sm font-medium mb-1">
                        Hero subhead
                      </label>
                      <textarea
                        id="heroSubhead"
                        value={mergedContent.hero.subhead}
                        onChange={(e) => updateHeroField('subhead', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label htmlFor="heroCta" className="block text-sm font-medium mb-1">
                        Hero button label
                      </label>
                      <input
                        id="heroCta"
                        value={mergedContent.hero.ctaLabel}
                        onChange={(e) => updateHeroField('ctaLabel', e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label htmlFor="highlights" className="block text-sm font-medium mb-1">
                        Highlights (one per line)
                      </label>
                      <textarea
                        id="highlights"
                        value={mergedContent.highlights.join('\n')}
                        onChange={(e) => updateHighlights(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label htmlFor="services" className="block text-sm font-medium mb-1">
                        Services (one per line)
                      </label>
                      <textarea
                        id="services"
                        value={mergedContent.services.join('\n')}
                        onChange={(e) => updateServices(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label htmlFor="aboutCopy" className="block text-sm font-medium mb-1">
                        About copy
                      </label>
                      <textarea
                        id="aboutCopy"
                        value={mergedContent.about}
                        onChange={(e) => updateAbout(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-cream)] p-3 space-y-2">
                      <div className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                        Footer call to action
                      </div>
                      <div>
                        <label htmlFor="footerHeadline" className="block text-sm font-medium mb-1">
                          Headline
                        </label>
                        <input
                          id="footerHeadline"
                          value={mergedContent.footerCta.headline}
                          onChange={(e) => updateFooterField('headline', e.target.value)}
                          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                      </div>
                      <div>
                        <label htmlFor="footerBody" className="block text-sm font-medium mb-1">
                          Body
                        </label>
                        <textarea
                          id="footerBody"
                          value={mergedContent.footerCta.body}
                          onChange={(e) => updateFooterField('body', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                      </div>
                      <div>
                        <label htmlFor="footerCtaLabel" className="block text-sm font-medium mb-1">
                          Button label
                        </label>
                        <input
                          id="footerCtaLabel"
                          value={mergedContent.footerCta.ctaLabel}
                          onChange={(e) => updateFooterField('ctaLabel', e.target.value)}
                          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
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
              <div
                data-look-preview
                style={previewStyle}
                className="bg-[var(--color-bg-cream)] rounded-3xl border border-[var(--color-border)] shadow-sm overflow-hidden"
              >
                <div data-look-preview-scroll className="max-h-[72vh] min-h-[520px] overflow-y-auto">
                  {/* Desktop Preview */}
                  {activeTab === 'desktop' && (
                    <div className="p-6">
                      {previewImages.desktop.length ? (
                        <div className="space-y-6">
                          {previewImages.desktop.map((src, index) => (
                            <img
                              key={`${src}-${index}`}
                              src={src}
                              alt={`${look.title} desktop preview ${index + 1}`}
                              className="w-full rounded-2xl border border-black/5 shadow-lg"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-white px-6 py-8 text-sm text-[var(--color-text-muted)]">
                          Desktop preview coming soon.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mobile Preview */}
                  {activeTab === 'mobile' && (
                    <div className="p-6">
                      {previewImages.mobile.length ? (
                        <div className="mx-auto max-w-sm space-y-6">
                          {previewImages.mobile.map((src, index) => (
                            <img
                              key={`${src}-${index}`}
                              src={src}
                              alt={`${look.title} mobile preview ${index + 1}`}
                              className="w-full rounded-2xl border border-black/5 shadow-lg"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-white px-6 py-8 text-sm text-[var(--color-text-muted)]">
                          Mobile preview coming soon.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Print Materials Preview */}
                  {activeTab === 'print' && (
                    <div className="p-6">
                      {previewImages.print.length ? (
                        <div className="grid gap-6 md:grid-cols-2">
                          {previewImages.print.map((src, index) => (
                            <img
                              key={`${src}-${index}`}
                              src={src}
                              alt={`${look.title} print preview ${index + 1}`}
                              className="w-full rounded-2xl border border-black/5 shadow-lg bg-white"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-white px-6 py-8 text-sm text-[var(--color-text-muted)]">
                          Print materials preview coming soon.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Promotional Products Preview */}
                  {activeTab === 'promotional' && (
                    <div className="p-6">
                      {previewImages.promotional.length ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {previewImages.promotional.map((src, index) => (
                            <img
                              key={`${src}-${index}`}
                              src={src}
                              alt={`${look.title} promotional preview ${index + 1}`}
                              className="w-full rounded-2xl border border-black/5 shadow-lg bg-white"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-white px-6 py-8 text-sm text-[var(--color-text-muted)]">
                          Promotional preview coming soon.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Social Media Preview */}
                  {activeTab === 'social' && (
                    <div className="p-6">
                      {previewImages.social.length ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {previewImages.social.map((src, index) => (
                            <img
                              key={`${src}-${index}`}
                              src={src}
                              alt={`${look.title} social preview ${index + 1}`}
                              className="w-full rounded-2xl border border-black/5 shadow-lg bg-white"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-white px-6 py-8 text-sm text-[var(--color-text-muted)]">
                          Social media preview coming soon.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 border-t border-[var(--color-border)] bg-white/70 py-3 text-[var(--color-text-muted)]">
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

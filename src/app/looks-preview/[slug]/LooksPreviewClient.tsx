'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
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
  fonts?: {
    heading: string;
    body: string;
  };
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

type PreviewVariant = 'classic' | 'minimal' | 'playful';

const previewVariantBySlug: Record<string, PreviewVariant> = {
  'luna-smiles': 'playful',
  'grincraft': 'playful',
  'radiance': 'playful',
  'illume': 'minimal',
  'align-chiropractics': 'minimal',
  'balance-chiropractic': 'minimal',
  'soho-orthodontics': 'minimal',
  'enamel': 'classic',
  'seaport-smiles': 'classic',
  'arches': 'classic',
  'pureglow': 'classic',
  'brilliance': 'classic',
  'lumena': 'classic',
  'aura': 'classic',
};

const heroImageBySlug: Record<string, string> = {
  'align-chiropractics': '/marketing/assets/uploads/2025/04/patientli-solutions-page-chiropractic-marketing-company-hero.webp',
  'balance-chiropractic': '/marketing/assets/uploads/2025/04/patientli-solutions-page-chiropractic-marketing-company-hero-2.webp',
  'soho-orthodontics': '/marketing/assets/uploads/2025/04/patientli-solutions-page-orthodontic-marketing-company-hero_2.webp',
  'illume': '/marketing/assets/uploads/2025/04/patientli-solutions-page-orthodontic-marketing-company-hero_2.webp',
};

const defaultHeroImage = '/marketing/assets/uploads/2025/04/patientli-solutions-page-general-dental-marketing-hero.webp';

const fontFamilyByName: Record<string, string> = {
  'IvyPresto Display': '"ivypresto-display", Georgia, "Times New Roman", serif',
  Outfit: '"Outfit", system-ui, -apple-system, sans-serif',
};

function resolveFontFamily(name: string | undefined, fallback: string) {
  if (!name) return fallback;
  return fontFamilyByName[name] ?? fallback;
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
  const displayName = practiceName.trim() || 'Your Practice';
  const phoneDisplay = practicePhone.trim() || '(555) 555-5555';
  const addressLine = [practiceAddress1, practiceAddress2]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(' ');
  const cityLine = [practiceCity, practiceState, practiceZip]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(' ');
  const contactLine = [addressLine, cityLine].filter(Boolean).join(' / ');

  const lookSlug = slug;
  const look = useMemo(
    () => (looksData as LookEntry[]).find((entry) => entry.slug === lookSlug),
    [lookSlug]
  );
  const previewVariant = previewVariantBySlug[lookSlug] ?? 'classic';
  const heroImage = heroImageBySlug[lookSlug] ?? defaultHeroImage;

  const baseTokens = useMemo<LookTokensV1>(() => {
    const headingDefault = resolveFontFamily(look?.fonts?.heading, fontPairs[0].headingFamily);
    const bodyDefault = resolveFontFamily(look?.fonts?.body, fontPairs[0].bodyFamily);
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
  }, [look?.colors, look?.fonts]);

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
  const highlightItems = mergedContent.highlights.slice(0, 3);
  const serviceItems = mergedContent.services.slice(0, 3);
  const highlightPrimary = highlightItems[0] ?? 'Personalized care';
  const servicePrimary = serviceItems[0] ?? 'General dentistry';
  const paletteItems = [
    { label: 'Primary', value: mergedTokens.color.primary },
    { label: 'Accent', value: mergedTokens.color.accent },
    { label: 'Surface', value: mergedTokens.color.surface },
    { label: 'Background', value: mergedTokens.color.bg },
  ];

  const heroFrameClass =
    previewVariant === 'playful'
      ? 'rounded-[36px] lg:rounded-[48px]'
      : previewVariant === 'minimal'
        ? 'rounded-[18px] lg:rounded-[24px]'
        : 'rounded-[28px] lg:rounded-[36px]';
  const heroAccentClass =
    previewVariant === 'playful'
      ? 'absolute -right-16 -top-20 h-56 w-56 rounded-[56px] opacity-30'
      : previewVariant === 'minimal'
        ? 'absolute -right-12 -top-16 h-48 w-48 rounded-full opacity-20'
        : 'absolute -right-12 -top-16 h-52 w-52 rounded-full opacity-25';

  const navLinks = ['Services', 'About', 'Blog', 'Contact'];

  const websitePreview = (
    <div className="rounded-3xl border border-black/5 overflow-hidden bg-[var(--color-bg-white)] shadow-sm">
      <div className="relative bg-[var(--color-bg-white)]">
        <div className={heroAccentClass} style={{ backgroundColor: 'var(--color-accent)' }} />
        <header className="relative z-10 flex items-center justify-between gap-4 border-b border-black/10 px-6 py-4 text-[var(--color-primary)]">
          <div className="flex items-center gap-3">
            {practiceLogoUrl ? (
              <img
                src={practiceLogoUrl}
                alt={`${displayName} logo`}
                className="h-9 w-auto object-contain"
              />
            ) : (
              <span className="font-heading text-lg">{displayName}</span>
            )}
          </div>
          <nav className="hidden items-center gap-5 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] md:flex">
            {navLinks.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </nav>
          <span className="inline-flex rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-[var(--color-primary)]">
            Book now
          </span>
        </header>
        <div className="relative z-10 grid gap-6 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              Modern dental care
            </p>
            <h2 className="mt-3 font-heading text-3xl text-[var(--color-primary)]">
              {mergedContent.hero.headline}
            </h2>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">{mergedContent.hero.subhead}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs">
              <span className="rounded-full bg-[var(--color-primary)] px-4 py-2 font-semibold text-white">
                {mergedContent.hero.ctaLabel}
              </span>
              <span className="rounded-full border border-[var(--color-border)] px-4 py-2 text-[var(--color-primary)]">
                Call {phoneDisplay}
              </span>
            </div>
          </div>
          <div className="relative">
            <div className={`${heroFrameClass} overflow-hidden bg-[var(--color-bg-cream)] shadow-md`}>
              <Image
                src={heroImage}
                alt="Preview hero"
                width={520}
                height={560}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <section className="bg-[var(--color-bg-cream)] px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              About {displayName}
            </p>
            <h3 className="mt-3 font-heading text-xl text-[var(--color-primary)]">
              A practice built around clarity and comfort.
            </h3>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">{mergedContent.about}</p>
          </div>
          <div className="grid gap-3 text-sm text-[var(--color-text-secondary)]">
            {highlightItems.map((highlight) => (
              <div
                key={highlight}
                className="rounded-2xl bg-white px-4 py-3 shadow-sm"
              >
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white px-6 py-8">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xl text-[var(--color-primary)]">Services</h3>
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Explore care
          </span>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {serviceItems.map((service) => (
            <div
              key={service}
              className="rounded-2xl border border-black/5 bg-[var(--color-bg-cream)] px-4 py-4 text-sm text-[var(--color-primary)]"
            >
              {service}
            </div>
          ))}
        </div>
      </section>
      <section className="bg-[var(--color-bg-mint)] px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              Let&apos;s talk
            </p>
            <h3 className="mt-2 font-heading text-xl text-[var(--color-primary)]">
              {mergedContent.footerCta.headline}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {mergedContent.footerCta.body}
            </p>
          </div>
          <span className="inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 text-xs font-semibold text-white">
            {mergedContent.footerCta.ctaLabel}
          </span>
        </div>
      </section>
    </div>
  );

  const mobileWebsitePreview = (
    <div className="rounded-3xl border border-black/5 overflow-hidden bg-[var(--color-bg-white)] shadow-sm">
      <div className="bg-[var(--color-bg-white)] px-4 py-4">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          <span>{displayName}</span>
          <span>Menu</span>
        </div>
        <h2 className="mt-4 font-heading text-2xl text-[var(--color-primary)]">
          {mergedContent.hero.headline}
        </h2>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">{mergedContent.hero.subhead}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-white">
            {mergedContent.hero.ctaLabel}
          </span>
          <span className="rounded-full border border-[var(--color-border)] px-4 py-2 text-[var(--color-primary)]">
            Call {phoneDisplay}
          </span>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl bg-[var(--color-bg-cream)]">
          <Image
            src={heroImage}
            alt="Preview hero"
            width={420}
            height={480}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="bg-[var(--color-bg-cream)] px-4 py-5">
        <h3 className="font-heading text-lg text-[var(--color-primary)]">About {displayName}</h3>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{mergedContent.about}</p>
      </div>
      <div className="bg-white px-4 py-5">
        <h3 className="font-heading text-lg text-[var(--color-primary)]">Services</h3>
        <div className="mt-3 grid gap-3 text-sm text-[var(--color-primary)]">
          {serviceItems.map((service) => (
            <div key={service} className="rounded-xl bg-[var(--color-bg-cream)] px-3 py-2">
              {service}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[var(--color-bg-mint)] px-4 py-5">
        <h3 className="font-heading text-lg text-[var(--color-primary)]">
          {mergedContent.footerCta.headline}
        </h3>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{mergedContent.footerCta.body}</p>
        <span className="mt-4 inline-flex rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white">
          {mergedContent.footerCta.ctaLabel}
        </span>
      </div>
    </div>
  );

  const brandBoardPreview = (
    <div className="rounded-2xl border border-black/5 overflow-hidden bg-white p-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        Brand board
      </p>
      <h3 className="mt-3 font-heading text-lg text-[var(--color-primary)]">{displayName}</h3>
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">{mergedContent.hero.subhead}</p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {paletteItems.map((item) => (
          <div key={item.label} className="space-y-1 text-[10px] text-[var(--color-text-muted)]">
            <div className="h-8 rounded-xl" style={{ backgroundColor: item.value }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-[var(--color-text-muted)]">
        <span className="font-heading">Aa</span> <span className="font-body">Bb</span>
      </div>
    </div>
  );

  const highlightsPreview = (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        Highlights
      </p>
      <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
        {highlightItems.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const servicesPreview = (
    <div className="rounded-2xl border border-black/5 bg-[var(--color-bg-cream)] p-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        Services
      </p>
      <div className="mt-3 grid gap-2 text-sm text-[var(--color-text-secondary)]">
        {serviceItems.map((service) => (
          <div key={service} className="rounded-lg bg-white px-3 py-2">
            {service}
          </div>
        ))}
      </div>
    </div>
  );

  const ctaPreview = (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        Call to action
      </p>
      <h3 className="mt-3 font-heading text-lg text-[var(--color-primary)]">
        {mergedContent.footerCta.headline}
      </h3>
      <p className="mt-2 text-xs text-[var(--color-text-muted)]">{mergedContent.footerCta.body}</p>
      <div className="mt-4 inline-flex rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-medium text-[var(--color-primary)]">
        {mergedContent.footerCta.ctaLabel}
      </div>
    </div>
  );

  const brandKitGallery = (
    <div className="grid gap-6 md:grid-cols-2">
      {brandBoardPreview}
      {highlightsPreview}
      {servicesPreview}
      {ctaPreview}
    </div>
  );

  const liveSocialGallery = (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl border border-black/5 overflow-hidden bg-[var(--color-bg-dark)] text-white p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Social post</p>
        <h3 className="mt-3 font-heading text-lg">{mergedContent.hero.headline}</h3>
        <p className="mt-2 text-xs text-white/75">{mergedContent.hero.subhead}</p>
      </div>
      <div className="rounded-2xl border border-black/5 overflow-hidden bg-white p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">New patient</p>
        <h3 className="mt-3 font-heading text-lg text-[var(--color-primary)]">
          Now welcoming new patients
        </h3>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          {displayName} appointments are open this week.
        </p>
      </div>
      <div className="rounded-2xl border border-black/5 overflow-hidden bg-[var(--color-bg-cream)] p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Highlight
        </p>
        <h3 className="mt-3 font-heading text-lg text-[var(--color-primary)]">
          {highlightPrimary}
        </h3>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">{contactLine || phoneDisplay}</p>
      </div>
      <div className="rounded-2xl border border-black/5 overflow-hidden bg-white p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Featured service
        </p>
        <h3 className="mt-3 font-heading text-lg text-[var(--color-primary)]">{servicePrimary}</h3>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">{mergedContent.about}</p>
      </div>
      <div className="rounded-2xl border border-black/5 overflow-hidden bg-[var(--color-bg-dark)] text-white p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Patient note</p>
        <p className="mt-3 text-xs text-white/75">
          &quot;The team at {displayName} made my visit easy and stress-free.&quot;
        </p>
        <p className="mt-4 text-xs text-white/60">— {displayName} patient</p>
      </div>
      <div className="rounded-2xl border border-black/5 overflow-hidden bg-white p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Call to action
        </p>
        <h3 className="mt-3 font-heading text-lg text-[var(--color-primary)]">
          {mergedContent.footerCta.headline}
        </h3>
        <div className="mt-4 inline-flex rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-medium text-[var(--color-primary)]">
          {mergedContent.footerCta.ctaLabel}
        </div>
      </div>
    </div>
  );

  const livePrintPreview = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Letterhead
        </p>
        <h3 className="mt-3 font-heading text-lg text-[var(--color-primary)]">{displayName}</h3>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">{contactLine || phoneDisplay}</p>
        <div className="mt-4 h-16 rounded-xl bg-[var(--color-bg-cream)]" />
      </div>
      <div className="rounded-2xl border border-black/5 bg-[var(--color-bg-cream)] p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Appointment card
        </p>
        <p className="mt-3 font-heading text-lg text-[var(--color-primary)]">{displayName}</p>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">{mergedContent.hero.subhead}</p>
      </div>
      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Business card
        </p>
        <div className="mt-4 rounded-xl bg-[var(--color-bg-dark)] p-4 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Practice info</p>
          <p className="mt-2 font-heading text-sm">{displayName}</p>
          <p className="mt-1 text-xs text-white/70">{contactLine || phoneDisplay}</p>
        </div>
      </div>
    </div>
  );

  const livePromotionalPreview = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Tote bag
        </p>
        <div className="mt-4 flex h-24 items-center justify-center rounded-xl bg-[var(--color-bg-dark)] px-4 text-center font-heading text-sm text-white">
          {displayName}
        </div>
      </div>
      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Coffee mug
        </p>
        <div className="mt-4 flex h-24 items-center justify-center rounded-full bg-[var(--color-bg-cream)] px-4 text-center font-heading text-sm text-[var(--color-primary)]">
          {displayName}
        </div>
      </div>
      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          ID badge
        </p>
        <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-cream)] p-4 text-[var(--color-primary)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Team member
          </p>
          <p className="mt-2 font-heading text-sm">{displayName}</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Dr. Jane Smith</p>
        </div>
      </div>
    </div>
  );

  const previewStyle = useMemo(
    () => cssVarsFromLookTokensV1(mergedTokens),
    [mergedTokens]
  );

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
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleContinueToPricing}
                  disabled={isSaving || !practice.name}
                  isLoading={isSaving}
                >
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
                className="bg-[var(--color-bg-cream)] rounded-3xl border border-[var(--color-border)] shadow-sm overflow-hidden font-body"
              >
                <div data-look-preview-scroll className="max-h-[72vh] min-h-[520px] overflow-y-auto">
                  {/* Desktop Preview */}
                  {activeTab === 'desktop' && (
                    <div className="p-6">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                            Personalized website preview
                          </p>
                          {websitePreview}
                        </div>
                        <div className="space-y-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                            Personalized brand kit
                          </p>
                          {brandKitGallery}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Preview */}
                  {activeTab === 'mobile' && (
                    <div className="p-6">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                            Personalized mobile preview
                          </p>
                          <div className="mx-auto max-w-sm">{mobileWebsitePreview}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Print Materials Preview */}
                  {activeTab === 'print' && (
                    <div className="p-6">
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                          Personalized print preview
                        </p>
                        {livePrintPreview}
                      </div>
                    </div>
                  )}

                  {/* Promotional Products Preview */}
                  {activeTab === 'promotional' && (
                    <div className="p-6">
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                          Personalized promotional preview
                        </p>
                        {livePromotionalPreview}
                      </div>
                    </div>
                  )}

                  {/* Social Media Preview */}
                  {activeTab === 'social' && (
                    <div className="p-6">
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                          Personalized social preview
                        </p>
                        {liveSocialGallery}
                      </div>
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

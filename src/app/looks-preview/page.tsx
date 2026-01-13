'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Container } from '@/components/ui';
import looksData from '@/content/looks.json';
import type { LookTokensV1 } from '@/modules/looks/domain/tokens.schema';
import { cssVarsFromLookTokensV1 } from '@/modules/looks/ui/tokens';

// Filter out non-Look products (plans, reports, etc.)
const looks = looksData.filter(look =>
  !['basic', 'starter', 'growth', 'full-ai-visibility-report'].includes(look.slug)
);

// Filter options
const practiceTypes = [
  'Chiropractics',
  'Cosmetic Dentistry',
  'Cosmetic Surgery',
  'Dermatology',
  'General Dentistry',
  'Orthodontics',
];

const styles = [
  'Approachable',
  'Minimal',
  'Modern',
  'Monochromatic',
  'Neutral',
  'Playful',
];

const defaultColors = {
  primary: '#103034',
  secondary: '#E6F2EF',
  accent: '#E8F59E',
  background: '#FFFFFF',
};

const defaultHeadingFont = '"ivypresto-display", Georgia, "Times New Roman", serif';
const defaultBodyFont = '"Outfit", system-ui, -apple-system, sans-serif';

function resolveFontFamily(fontName: string | undefined, fallback: string) {
  if (!fontName) return fallback;
  const normalized = fontName.toLowerCase();

  if (normalized.includes('ivypresto')) {
    return defaultHeadingFont;
  }

  if (normalized.includes('outfit')) {
    return defaultBodyFont;
  }

  return fallback;
}

export default function LooksPage() {
  const [selectedPracticeType, setSelectedPracticeType] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const filteredLooks = useMemo(() => {
    return looks.filter(look => {
      // Filter by practice type
      if (selectedPracticeType) {
        const hasType = look.practiceTypes?.some(
          type => type.toLowerCase().includes(selectedPracticeType.toLowerCase())
        );
        if (!hasType) return false;
      }

      // Filter by style (check shortDescription for style keywords)
      if (selectedStyle) {
        const hasStyle = look.shortDescription?.toLowerCase().includes(selectedStyle.toLowerCase());
        if (!hasStyle) return false;
      }

      return true;
    });
  }, [selectedPracticeType, selectedStyle]);

  return (
    <>
      <Header variant="light" />

      <main className="min-h-screen bg-white">
        <Container>
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 py-12">
            {/* Sidebar */}
            <aside className="space-y-8">
              <div>
                <h1 className="text-lg text-[var(--color-text-muted)] mb-6">All Looks</h1>
                <h2 className="text-2xl font-heading mb-4">Preview Looks</h2>
                <p className="text-[var(--color-text-secondary)]">
                  Explore premade looks by Patientli. Select a look from the results to preview brand details.
                </p>
              </div>

              {/* Practice Types Filter */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <button
                  onClick={() => setSelectedPracticeType(null)}
                  className={`block w-full text-left font-medium mb-4 ${
                    !selectedPracticeType ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  All Practice Types
                </button>
                <ul className="space-y-2">
                  {practiceTypes.map(type => (
                    <li key={type}>
                      <button
                        onClick={() => setSelectedPracticeType(selectedPracticeType === type ? null : type)}
                        className={`text-left transition-colors ${
                          selectedPracticeType === type
                            ? 'text-[var(--color-primary)] font-medium'
                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                        }`}
                      >
                        {type}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Styles Filter */}
              <div className="border-t border-[var(--color-border)] pt-6">
                <button
                  onClick={() => setSelectedStyle(null)}
                  className={`block w-full text-left font-medium mb-4 ${
                    !selectedStyle ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  All Styles
                </button>
                <ul className="space-y-2">
                  {styles.map(style => (
                    <li key={style}>
                      <button
                        onClick={() => setSelectedStyle(selectedStyle === style ? null : style)}
                        className={`text-left transition-colors ${
                          selectedStyle === style
                            ? 'text-[var(--color-primary)] font-medium'
                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                        }`}
                      >
                        {style}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredLooks.map(look => (
                <LookCard key={look.id} look={look} />
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

interface Look {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
}

function LookCard({ look }: { look: Look }) {
  const colors = look.colors ?? defaultColors;
  const tokens: LookTokensV1 = {
    color: {
      primary: colors.primary,
      accent: colors.accent,
      bg: colors.background,
      surface: colors.secondary,
      text: colors.primary,
    },
    typography: {
      headingFamily: resolveFontFamily(look.fonts?.heading, defaultHeadingFont),
      bodyFamily: resolveFontFamily(look.fonts?.body, defaultBodyFont),
    },
  };
  const previewStyle = cssVarsFromLookTokensV1(tokens);

  return (
    <div className="group">
      {/* Bento Preview Image */}
      <Link href={`/looks-preview/${look.slug}`} className="block">
        <div
          style={previewStyle}
          className="aspect-square rounded-2xl overflow-hidden mb-4 border border-black/5 bg-white p-4"
        >
          <div className="grid h-full grid-cols-2 grid-rows-2 gap-3">
            <div className="col-span-2 flex flex-col justify-between rounded-xl bg-[var(--color-bg-dark)] p-4 text-white">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Live preview</p>
              <div>
                <p className="font-heading text-sm">Your Practice</p>
                <p className="text-[10px] text-white/70">{look.title}</p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-[10px] text-[var(--color-primary)]">
                Schedule a call
              </span>
            </div>
            <div className="rounded-xl bg-[var(--color-bg-cream)] p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)] opacity-60">
                Highlights
              </p>
              <p className="mt-2 text-[11px] leading-snug text-[var(--color-primary)] opacity-80 max-h-[48px] overflow-hidden">
                {look.shortDescription}
              </p>
            </div>
            <div className="rounded-xl border border-black/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)] opacity-60">
                Palette
              </p>
              <div className="mt-3 flex gap-2">
                {[colors.primary, colors.accent, colors.secondary, colors.background].map((color) => (
                  <span
                    key={color}
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Card Content */}
      <Link href={`/looks-preview/${look.slug}`}>
        <h3 className="text-xl font-heading mb-2 group-hover:text-[var(--color-accent-hover)] transition-colors">
          {look.title}
        </h3>
      </Link>
      <p className="text-[var(--color-text-secondary)] text-sm mb-4">
        {look.shortDescription}
      </p>

      {/* Action Buttons */}
      <Link
        href={`/looks-preview/${look.slug}`}
        className="inline-flex w-full items-center justify-center gap-2 py-3 px-4 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
      >
        Customize & preview
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

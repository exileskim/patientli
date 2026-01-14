'use client';

import Image from 'next/image';

import looksData from '@/content/looks.json';
import type { LookContentV1 } from '../domain/content.schema';
import type { LookTokensV1 } from '../domain/tokens.schema';

import { getDefaultLookContent } from './content';
import { heroImageForLookSlug } from './preview-assets';
import { getLookWebsiteTemplate } from './site-templates';
import { cssVarsFromLookTokensV1 } from './tokens';

type LookEntry = {
  slug: string;
  title: string;
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

const fontFamilyByName: Record<string, string> = {
  'IvyPresto Display': '"ivypresto-display", Georgia, "Times New Roman", serif',
  Outfit: '"Outfit", system-ui, -apple-system, sans-serif',
};

function resolveFontFamily(name: string | undefined, fallback: string) {
  if (!name) return fallback;
  return fontFamilyByName[name] ?? fallback;
}

function getLookEntry(slug: string): LookEntry | undefined {
  return (looksData as LookEntry[]).find((entry) => entry.slug === slug);
}

function baseTokensForLook(slug: string): LookTokensV1 {
  const look = getLookEntry(slug);
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
      headingFamily: resolveFontFamily(look?.fonts?.heading, fontFamilyByName['IvyPresto Display']),
      bodyFamily: resolveFontFamily(look?.fonts?.body, fontFamilyByName.Outfit),
    },
  };
}

function heroBackgroundColor(params: { heroBackground: 'primary' | 'surface' | 'accent' }) {
  switch (params.heroBackground) {
    case 'accent':
      return 'var(--color-accent)';
    case 'surface':
      return 'var(--color-bg-cream)';
    case 'primary':
    default:
      return 'var(--color-primary)';
  }
}

export function LookThumbnail(props: {
  lookSlug: string;
  practiceName?: string;
  className?: string;
}) {
  const { lookSlug, practiceName = 'Forestville Family Dentistry', className } = props;
  const look = getLookEntry(lookSlug);
  const template = getLookWebsiteTemplate(lookSlug);
  const tone = template.heroTone ?? (template.heroBackground === 'surface' ? 'light' : 'dark');
  const heroBg = heroBackgroundColor({ heroBackground: template.heroBackground });
  const tokens = baseTokensForLook(lookSlug);
  const cssVars = cssVarsFromLookTokensV1(tokens);

  const content: LookContentV1 = getDefaultLookContent({ practiceName, lookSlug });
  const heroImage = heroImageForLookSlug(lookSlug);

  return (
    <div
      style={cssVars}
      className={[
        'relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="absolute inset-0" style={{ backgroundColor: heroBg }} />
      <div
        className={[
          'relative grid h-full grid-cols-[1.1fr_0.9fr] gap-3 p-4 font-body',
          tone === 'dark' ? 'text-white' : 'text-[var(--color-primary)]',
        ].join(' ')}
      >
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] opacity-75">Preview</p>
          <p className="mt-2 font-heading text-sm leading-snug">{content.hero.headline}</p>
          <p className="mt-2 text-[10px] leading-snug opacity-80">{look?.title ?? 'Patientli Look'}</p>
          <div className="mt-3 inline-flex rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold text-[var(--color-primary)]">
            Customize
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 rounded-full bg-white/15" />
            <div className="absolute inset-2 overflow-hidden rounded-full bg-white/15">
              <Image
                src={heroImage}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


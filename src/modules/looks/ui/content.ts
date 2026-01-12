import type { LookContentOverridesV1, LookContentV1 } from '../domain/content.schema';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeDeep<T>(base: T, override: unknown): T {
  if (!isRecord(base) || !isRecord(override)) return base;

  const output: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    const baseValue = (base as Record<string, unknown>)[key];

    if (isRecord(baseValue) && isRecord(value)) {
      output[key] = mergeDeep(baseValue, value);
      continue;
    }

    output[key] = value;
  }

  return output as T;
}

const baseContent: LookContentV1 = {
  hero: {
    headline: 'Beautiful smiles start here.',
    subhead:
      'Modern, calming care for patients who want a dental experience that feels personal and clear.',
    ctaLabel: 'Book now',
  },
  highlights: ['Same-week appointments', 'Transparent pricing', 'Friendly, modern care'],
  services: ['General dentistry', 'Cosmetic treatments', 'Dental implants'],
  about:
    'Our team blends modern care with a warm, relaxed atmosphere so every visit feels thoughtful and easy.',
  footerCta: {
    headline: 'Ready to meet your new dental team?',
    body: 'Schedule a quick call and we will map the best next step for your practice.',
    ctaLabel: 'Schedule a call',
  },
};

export function getDefaultLookContent(params?: { practiceName?: string }): LookContentV1 {
  const practiceName = params?.practiceName?.trim();

  if (!practiceName) {
    return baseContent;
  }

  return {
    ...baseContent,
    hero: {
      ...baseContent.hero,
      headline: `${practiceName} makes smiles easy.`,
    },
    about: `${practiceName} is a patient-first dental team focused on clear guidance, gentle care, and great outcomes.`,
  };
}

export function mergeLookContentV1(
  base: LookContentV1,
  overrides: LookContentOverridesV1
): LookContentV1 {
  return mergeDeep(base, overrides);
}

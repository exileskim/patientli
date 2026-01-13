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

const dentalBaseContent: LookContentV1 = {
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

const orthodonticBaseContent: LookContentV1 = {
  hero: {
    headline: 'Confident smiles start here.',
    subhead:
      'Modern orthodontic care designed to feel clear, supportive, and easy to stick with.',
    ctaLabel: 'Book now',
  },
  highlights: ['Flexible scheduling', 'Clear treatment plans', 'Comfort-first approach'],
  services: ['Invisalign', 'Braces', 'Retainers'],
  about:
    'We combine modern tools with a calm, thoughtful approach so your treatment stays on track and stress-free.',
  footerCta: {
    headline: 'Ready to feel confident about your smile?',
    body: 'Schedule a quick call and we will map the best next step for your treatment.',
    ctaLabel: 'Schedule a call',
  },
};

const chiropracticBaseContent: LookContentV1 = {
  hero: {
    headline: 'Move better. Feel better.',
    subhead:
      'Supportive chiropractic care focused on long-term movement, alignment, and relief.',
    ctaLabel: 'Book now',
  },
  highlights: ['Same-week availability', 'Whole-body wellness', 'Evidence-informed care'],
  services: ['Spinal adjustments', 'Injury rehab', 'Posture coaching'],
  about:
    'Our approach blends modern techniques with a calm environment so you can reset, recover, and stay moving.',
  footerCta: {
    headline: 'Ready to feel better?',
    body: 'Schedule a quick call and we will map the best next step for your body and goals.',
    ctaLabel: 'Schedule a call',
  },
};

const cosmeticBaseContent: LookContentV1 = {
  hero: {
    headline: 'A natural, confident smile.',
    subhead:
      'Cosmetic dentistry that keeps things subtle, polished, and true to you.',
    ctaLabel: 'Schedule a consultation',
  },
  highlights: ['Natural-looking results', 'Comfort-first visits', 'Clear treatment planning'],
  services: ['Veneers', 'Teeth whitening', 'Cosmetic bonding'],
  about:
    'We focus on refined details, thoughtful guidance, and results that feel effortlessly you.',
  footerCta: {
    headline: 'Ready for your next look?',
    body: 'Schedule a call and we will map a plan that fits your goals and timeline.',
    ctaLabel: 'Schedule a call',
  },
};

const presetBySlug: Record<string, LookContentOverridesV1> = {
  'align-chiropractics': {
    hero: {
      headline: 'Move freely. Live fully.',
      subhead:
        'Reconnect with your body’s natural rhythm — whether you’re recovering, optimizing, or simply seeking relief.',
    },
  },
  'balance-chiropractic': {
    hero: {
      headline: 'Find strength in balance.',
      subhead:
        'A calming, modern approach to care that helps you move with more ease and confidence.',
    },
  },
  'luna-smiles': {
    hero: {
      headline: 'Dental care as unique as you.',
      subhead:
        'We blend the latest in dental technology with a passion for personalized care, ensuring every visit leaves you with a reason to smile.',
    },
  },
  illume: {
    hero: {
      headline: 'A brighter, straighter smile awaits.',
      subhead:
        'We blend innovation and elegance to create a confident smile you’ll love to show off.',
      ctaLabel: 'Book your consultation',
    },
  },
  enamel: {
    hero: {
      headline: 'Modern dentistry. Beautiful smiles.',
      subhead:
        'Thoughtful care in a calm environment, designed to feel simple, clear, and comfortable.',
    },
  },
  'seaport-smiles': {
    hero: {
      headline: 'Navigate your way to a glowing, beautiful smile.',
      subhead:
        'A friendly, modern team focused on comfort, clarity, and results you can feel good about.',
    },
  },
  arches: {
    hero: {
      headline: 'Bringing healthy, straight smiles to you.',
      subhead:
        'Modern orthodontics for modern patients — with clear plans and supportive care.',
    },
  },
  pureglow: {
    hero: {
      headline: 'Cosmetic dentistry for a natural smile.',
      subhead:
        'Refined, comfort-first care focused on subtle enhancements and confident results.',
    },
  },
  grincraft: {
    hero: {
      headline: 'Where beautiful smiles begin.',
      subhead:
        'Top-quality dental care tailored to your lifestyle, with a welcoming and modern feel.',
    },
  },
  radiance: {
    hero: {
      headline: 'Illuminate your smile with expert care.',
      subhead:
        'Modern treatment built around clarity, comfort, and results you can trust.',
    },
  },
  brilliance: {
    hero: {
      headline: 'Advanced care for radiant smiles.',
      subhead:
        'A modern, supportive experience designed around comfort and confidence.',
    },
  },
  lumena: {
    hero: {
      headline: 'Advanced care for radiant smiles.',
      subhead:
        'Comfort-forward dentistry designed to feel modern, calm, and easy to maintain.',
    },
  },
  aura: {
    hero: {
      headline: 'Get your glow on.',
      subhead:
        'Natural-looking cosmetic care designed to elevate your smile without feeling overdone.',
    },
  },
  'soho-orthodontics': {
    hero: {
      headline: 'Elevate your smile with confidence.',
      subhead:
        'Orthodontic care designed to feel clear, supportive, and easy to stick with.',
    },
  },
};

function baseForSlug(lookSlug?: string) {
  switch (lookSlug) {
    case 'align-chiropractics':
    case 'balance-chiropractic':
      return chiropracticBaseContent;
    case 'illume':
    case 'soho-orthodontics':
    case 'arches':
      return orthodonticBaseContent;
    case 'pureglow':
      return cosmeticBaseContent;
    default:
      return dentalBaseContent;
  }
}

function aboutForSlug(params: { lookSlug?: string; practiceName: string }) {
  const { lookSlug, practiceName } = params;
  switch (lookSlug) {
    case 'align-chiropractics':
    case 'balance-chiropractic':
      return `${practiceName} is a modern chiropractic team focused on clear guidance, gentle care, and long-term movement.`;
    case 'illume':
    case 'soho-orthodontics':
    case 'arches':
      return `${practiceName} is an orthodontic team focused on clear plans, supportive care, and confident smiles.`;
    case 'pureglow':
      return `${practiceName} offers cosmetic dentistry focused on natural-looking results and comfort-first visits.`;
    default:
      return `${practiceName} is a patient-first dental team focused on clear guidance, gentle care, and great outcomes.`;
  }
}

export function getDefaultLookContent(params?: { practiceName?: string; lookSlug?: string }): LookContentV1 {
  const practiceName = params?.practiceName?.trim();
  const lookSlug = params?.lookSlug;

  const preset = lookSlug ? presetBySlug[lookSlug] : undefined;
  const base = baseForSlug(lookSlug);
  const content = preset ? mergeLookContentV1(base, preset) : base;

  if (!practiceName) return content;

  return {
    ...content,
    about: aboutForSlug({ lookSlug, practiceName }),
  };
}

export function mergeLookContentV1(
  base: LookContentV1,
  overrides: LookContentOverridesV1
): LookContentV1 {
  return mergeDeep(base, overrides);
}

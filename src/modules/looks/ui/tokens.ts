import type { CSSProperties } from 'react';

import type { LookTokenOverridesV1, LookTokensV1 } from '../domain/tokens.schema';

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

export function mergeLookTokensV1(base: LookTokensV1, overrides: LookTokenOverridesV1): LookTokensV1 {
  return mergeDeep(base, overrides);
}

export function cssVarsFromLookTokensV1(tokens: LookTokensV1): CSSProperties {
  const primary = tokens.color.primary;
  const accent = tokens.color.accent;
  const bg = tokens.color.bg;
  const surface = tokens.color.surface;
  const textPrimary = tokens.color.text ?? primary;

  return {
    '--color-primary': primary,
    '--color-primary-dark': primary,
    '--color-primary-light': primary,

    '--color-accent': accent,
    '--color-accent-hover': accent,

    '--color-bg-dark': primary,
    '--color-bg-white': bg,
    '--color-bg-mint': surface,
    '--color-bg-cream': bg,

    '--color-text-primary': textPrimary,
    '--color-text-secondary': textPrimary,
    '--color-text-muted': textPrimary,

    '--font-heading': tokens.typography.headingFamily,
    '--font-body': tokens.typography.bodyFamily,
  } as CSSProperties;
}


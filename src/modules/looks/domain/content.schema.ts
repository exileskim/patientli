import { z } from 'zod';

export const lookContentSchemaV1 = z.object({
  hero: z.object({
    headline: z.string().min(1),
    subhead: z.string().min(1),
    ctaLabel: z.string().min(1),
  }),
  highlights: z.array(z.string().min(1)).min(1).max(6),
  services: z.array(z.string().min(1)).min(1).max(6),
  about: z.string().min(1),
  footerCta: z.object({
    headline: z.string().min(1),
    body: z.string().min(1),
    ctaLabel: z.string().min(1),
  }),
});

export const lookContentOverridesSchemaV1 = lookContentSchemaV1.deepPartial();

export type LookContentV1 = z.infer<typeof lookContentSchemaV1>;
export type LookContentOverridesV1 = z.infer<typeof lookContentOverridesSchemaV1>;

import { z } from 'zod';

import { lookContentOverridesSchemaV1 } from './content.schema';
import { lookTokenOverridesSchemaV1 } from './tokens.schema';

export const practicePersonalizationSchemaV1 = z.object({
  name: z.string().min(1),
  phone: z.string().min(1).optional(),
  address1: z.string().min(1).optional(),
  address2: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  zip: z.string().min(1).optional(),
  logoUrl: z.string().url().optional(),
});

export const lookConfigPatchSchemaV1 = z.object({
  tokenOverrides: lookTokenOverridesSchemaV1.default({}),
  contentOverrides: lookContentOverridesSchemaV1.default({}),
  practice: practicePersonalizationSchemaV1,
  industry: z.literal('dental').default('dental'),
});

export type LookConfigPatchV1 = z.infer<typeof lookConfigPatchSchemaV1>;

export const lookConfigDocumentSchemaV1 = z.object({
  schemaVersion: z.literal(1),
  lookSlug: z.string().min(1),
  lookVersion: z.number().int().positive(),
  tokenOverrides: lookTokenOverridesSchemaV1.default({}),
  contentOverrides: lookContentOverridesSchemaV1.default({}),
  practice: practicePersonalizationSchemaV1,
  industry: z.literal('dental').default('dental'),
});

export type LookConfigDocumentV1 = z.infer<typeof lookConfigDocumentSchemaV1>;

export const createLookConfigRequestSchemaV1 = z.object({
  lookSlug: z.string().min(1),
  lookVersion: z.number().int().positive().default(1),
  patch: lookConfigPatchSchemaV1,
});

export type CreateLookConfigRequestV1 = z.infer<typeof createLookConfigRequestSchemaV1>;

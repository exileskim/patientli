import { z } from 'zod';

const hexColorSchema = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Expected hex color like #103034');

export const lookTokensSchemaV1 = z.object({
  color: z.object({
    primary: hexColorSchema,
    accent: hexColorSchema,
    bg: hexColorSchema,
    surface: hexColorSchema,
    text: hexColorSchema.optional(),
  }),
  typography: z.object({
    headingFamily: z.string().min(1),
    bodyFamily: z.string().min(1),
  }),
});

export const lookTokenOverridesSchemaV1 = lookTokensSchemaV1.deepPartial();

export type LookTokensV1 = z.infer<typeof lookTokensSchemaV1>;
export type LookTokenOverridesV1 = z.infer<typeof lookTokenOverridesSchemaV1>;


import Stripe from 'stripe';

import { getServerEnv } from '@/lib/env/server';

export type StripePlanKey = 'basic' | 'starter' | 'growth';

export function getStripeClient() {
  const env = getServerEnv();
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(env.STRIPE_SECRET_KEY);
}

export function getStripeWebhookSecret() {
  const env = getServerEnv();
  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }
  return env.STRIPE_WEBHOOK_SECRET;
}

export function getStripePriceIdForPlanKey(planKey: StripePlanKey) {
  const env = getServerEnv();

  const priceIdByPlanKey: Record<StripePlanKey, string | undefined> = {
    basic: env.STRIPE_BASIC_PRICE_ID,
    starter: env.STRIPE_STARTER_PRICE_ID,
    growth: env.STRIPE_GROWTH_PRICE_ID,
  };

  const priceId = priceIdByPlanKey[planKey];
  if (!priceId) {
    throw new Error(`Missing Stripe price id for planKey=${planKey}`);
  }

  return priceId;
}

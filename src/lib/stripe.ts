import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Pricing plans configuration
export const PLANS = {
  basic: {
    name: 'Basic',
    price: 750,
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
    description: 'Get started with top-quality branding and a fast, effective website.',
    features: [
      'Basic Access to a Look',
      'Website Design & Management',
    ],
  },
  starter: {
    name: 'Starter',
    price: 1750,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    description: 'Begin attracting patients with a solid SEO strategy to build a strong foundation for growth.',
    features: [
      'Everything in Basic plus:',
      'Expanded Access to a Look',
      'Search Engine Optimization',
      'Google Business Management',
      'Review & Reputation Management',
    ],
  },
  growth: {
    name: 'Growth',
    price: 3000,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID!,
    description: 'Scale up to a multi-channel marketing plan that engages patients across their entire journey.',
    features: [
      'Everything in Starter plus:',
      'Full Access to a Look',
      'Digital Advertising Management',
      'Educational Content Marketing',
      'Social Media Management',
    ],
    popular: true,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/db/prisma';
import { upsertPendingPurchaseForCheckoutSession } from '@/modules/looks/server/purchases.repo';
import { getStripeClient, getStripePriceIdForPlanKey } from '@/modules/looks/server/stripe.service';

const checkoutRequestSchema = z.object({
  planKey: z.enum(['basic', 'starter', 'growth']),
  configId: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  const parsedBody = checkoutRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const { planKey, configId } = parsedBody.data;

  let stripe;
  let priceId: string;
  try {
    stripe = getStripeClient();
    priceId = getStripePriceIdForPlanKey(planKey);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Stripe is not configured' },
      { status: 500 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  if (configId) {
    const configExists = await prisma.lookConfig.findUnique({ where: { id: configId } });
    if (!configExists) {
      return NextResponse.json(
        { error: 'Invalid configId' },
        { status: 400 }
      );
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pricing`,
    metadata: {
      planKey,
      ...(configId ? { configId } : {}),
    },
  });

  await upsertPendingPurchaseForCheckoutSession({
    stripeCheckoutSessionId: session.id,
    planKey,
    configId,
  });

  return NextResponse.json({ url: session.url });
}

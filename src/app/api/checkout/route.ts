import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { prisma } from '@/lib/db/prisma';
import { createAuthOptions } from '@/lib/auth/options';
import { getServerEnv } from '@/lib/env/server';
import {
  upsertActivePurchaseForCheckoutSession,
  upsertPendingPurchaseForCheckoutSession,
} from '@/modules/looks/server/purchases.repo';
import { getStripeClient, getStripePriceIdForPlanKey } from '@/modules/looks/server/stripe.service';

const checkoutRequestSchema = z.object({
  planKey: z.enum(['basic', 'starter', 'growth']),
  configId: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  const env = getServerEnv();
  const parsedBody = checkoutRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const { planKey, configId } = parsedBody.data;

  const mockCheckoutEnabled = env.NODE_ENV !== 'production' || env.MOCK_CHECKOUT_ENABLED === '1';

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

  let stripe: ReturnType<typeof getStripeClient> | null = null;
  let priceId: string | null = null;
  let stripeError: string | null = null;

  try {
    stripe = getStripeClient();
    priceId = getStripePriceIdForPlanKey(planKey);
  } catch (error) {
    stripeError = error instanceof Error ? error.message : 'Stripe is not configured';
  }

  if (!stripe || !priceId) {
    const checkoutNotConfiguredMessage =
      env.NODE_ENV === 'production'
        ? 'Checkout is not configured yet. Please schedule a call to get started.'
        : stripeError ?? 'Checkout is not configured yet. Please contact us or try again later.';

    if (!mockCheckoutEnabled) {
      return NextResponse.json({ error: checkoutNotConfiguredMessage }, { status: 500 });
    }

    const session = await getServerSession(createAuthOptions());
    const email = session?.user?.email;

    if (!email) {
      const callbackUrl = configId ? `/pricing?configId=${encodeURIComponent(configId)}` : '/pricing';
      const redirectTo = `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;

      return NextResponse.json(
        { error: 'Authentication required', redirect: redirectTo },
        { status: 401 }
      );
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
      select: { id: true },
    });

    const mockSessionId = `mock_${crypto.randomUUID()}`;

    await prisma.$transaction(async (db) => {
      if (configId) {
        await db.lookConfig.updateMany({
          where: { id: configId, createdByUserId: null },
          data: { createdByUserId: user.id },
        });
      }

      const purchase = await upsertActivePurchaseForCheckoutSession({
        stripeCheckoutSessionId: mockSessionId,
        planKey,
        configId,
        userId: user.id,
        db,
      });

      await db.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'purchase.mock_activated',
          targetType: 'Purchase',
          targetId: purchase.id,
          metadata: {
            planKey,
            ...(configId ? { configId } : {}),
          },
        },
      });
    });

    return NextResponse.json({ url: `${appUrl}/checkout/success?mock=1` });
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

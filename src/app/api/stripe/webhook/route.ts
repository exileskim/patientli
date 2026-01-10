import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { prisma } from '@/lib/db/prisma';
import {
  cancelPurchasesForSubscription,
  updatePurchasesForSubscription,
  upsertActivePurchaseForCheckoutSession,
} from '@/modules/looks/server/purchases.repo';
import { getStripeClient, getStripeWebhookSecret } from '@/modules/looks/server/stripe.service';

export const runtime = 'nodejs';

function purchaseStatusFromStripeSubscriptionStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'ACTIVE' as const;
    case 'past_due':
    case 'unpaid':
      return 'PAST_DUE' as const;
    case 'canceled':
    case 'incomplete_expired':
      return 'CANCELED' as const;
    case 'incomplete':
    case 'paused':
      return 'PENDING' as const;
    default:
      return 'PENDING' as const;
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  const body = await request.text();
  let stripe: Stripe;
  let webhookSecret: string;
  try {
    stripe = getStripeClient();
    webhookSecret = getStripeWebhookSecret();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Stripe is not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const planKey = session.metadata?.planKey;
        const configId = session.metadata?.configId || undefined;
        const customerEmail =
          session.customer_details?.email ?? session.customer_email ?? undefined;

        await prisma.$transaction(async (db) => {
          let userId: string | undefined;

          if (customerEmail) {
            const user = await db.user.upsert({
              where: { email: customerEmail },
              update: {},
              create: { email: customerEmail },
              select: { id: true },
            });
            userId = user.id;

            if (configId) {
              await db.lookConfig.updateMany({
                where: { id: configId, createdByUserId: null },
                data: { createdByUserId: userId },
              });
            }
          }

          const purchase = await upsertActivePurchaseForCheckoutSession({
            stripeCheckoutSessionId: session.id,
            planKey: planKey || undefined,
            configId,
            stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
            stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : undefined,
            userId,
            db,
          });

          if (userId) {
            await db.auditLog.create({
              data: {
                actorUserId: userId,
                action: 'purchase.activated',
                targetType: 'Purchase',
                targetId: purchase.id,
                metadata: {
                  stripeCheckoutSessionId: session.id,
                  ...(planKey ? { planKey } : {}),
                  ...(configId ? { configId } : {}),
                },
              },
            });
          }
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.$transaction(async (db) => {
          await updatePurchasesForSubscription({
            stripeSubscriptionId: subscription.id,
            status: purchaseStatusFromStripeSubscriptionStatus(subscription.status),
            stripeCustomerId: typeof subscription.customer === 'string' ? subscription.customer : undefined,
            db,
          });
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.$transaction(async (db) => {
          await cancelPurchasesForSubscription({ stripeSubscriptionId: subscription.id, db });
        });
        break;
      }

      default:
        break;
    }
  } catch {
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

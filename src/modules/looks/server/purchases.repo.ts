import type { Prisma, PrismaClient } from '@prisma/client';

import { prisma } from '@/lib/db/prisma';

type DbClient = PrismaClient | Prisma.TransactionClient;

export async function upsertPendingPurchaseForCheckoutSession(input: {
  stripeCheckoutSessionId: string;
  planKey: string;
  configId?: string;
  db?: DbClient;
}) {
  const { stripeCheckoutSessionId, planKey, configId, db: dbClient } = input;
  const db = dbClient ?? prisma;

  return db.purchase.upsert({
    where: { stripeCheckoutSessionId },
    update: { planKey, status: 'PENDING' },
    create: {
      planKey,
      status: 'PENDING',
      stripeCheckoutSessionId,
      configId,
    },
  });
}

export async function upsertActivePurchaseForCheckoutSession(input: {
  stripeCheckoutSessionId: string;
  planKey?: string;
  configId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  userId?: string;
  db?: DbClient;
}) {
  const {
    stripeCheckoutSessionId,
    planKey,
    configId,
    stripeCustomerId,
    stripeSubscriptionId,
    userId,
    db: dbClient,
  } = input;
  const db = dbClient ?? prisma;

  return db.purchase.upsert({
    where: { stripeCheckoutSessionId },
    update: {
      ...(planKey ? { planKey } : {}),
      status: 'ACTIVE',
      ...(userId ? { userId } : {}),
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
      ...(stripeSubscriptionId ? { stripeSubscriptionId } : {}),
      ...(configId ? { configId } : {}),
    },
    create: {
      planKey: planKey ?? 'unknown',
      status: 'ACTIVE',
      stripeCheckoutSessionId,
      ...(userId ? { userId } : {}),
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
      ...(stripeSubscriptionId ? { stripeSubscriptionId } : {}),
      ...(configId ? { configId } : {}),
    },
  });
}

export async function updatePurchasesForSubscription(input: {
  stripeSubscriptionId: string;
  status: 'PENDING' | 'ACTIVE' | 'CANCELED' | 'PAST_DUE';
  stripeCustomerId?: string;
  db?: DbClient;
}) {
  const { stripeSubscriptionId, status, stripeCustomerId, db: dbClient } = input;
  const db = dbClient ?? prisma;

  return db.purchase.updateMany({
    where: { stripeSubscriptionId },
    data: {
      status,
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
    },
  });
}

export async function cancelPurchasesForSubscription(input: {
  stripeSubscriptionId: string;
  db?: DbClient;
}) {
  const { stripeSubscriptionId, db: dbClient } = input;
  const db = dbClient ?? prisma;

  return db.purchase.updateMany({
    where: { stripeSubscriptionId },
    data: { status: 'CANCELED' },
  });
}

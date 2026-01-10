import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { prisma } from '@/lib/db/prisma';
import { createAuthOptions } from '@/lib/auth/options';
import { getServerEnv } from '@/lib/env/server';

export const runtime = 'nodejs';

const requestSchema = z.object({
  message: z.string().min(1).max(2000),
  configId: z.string().min(1).optional(),
});

async function maybeSendSupportEmail(params: { fromEmail: string; message: string; configId?: string }) {
  const env = getServerEnv();
  if (!env.RESEND_API_KEY || !env.RESEND_FROM) {
    if (env.NODE_ENV !== 'production') {
      console.log('[support] New support request', params);
    }
    return;
  }

  const subject = params.configId
    ? `Support request (config ${params.configId})`
    : 'Support request';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: 'support@patient.li',
      subject,
      text: `From: ${params.fromEmail}\n\n${params.message}\n`,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Resend email failed: ${response.status} ${body}`);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(createAuthOptions());
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsedBody = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsedBody.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { message, configId } = parsedBody.data;

  await prisma.auditLog.create({
    data: {
      actorUserId: user.id,
      action: 'support.request',
      targetType: 'Support',
      targetId: configId,
      metadata: {
        configId,
        message,
      },
    },
  });

  try {
    await maybeSendSupportEmail({ fromEmail: email, message, configId });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send support email' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}


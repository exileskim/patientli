import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import { prisma } from '@/lib/db/prisma';
import { getServerEnv } from '@/lib/env/server';

function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}

function html({ url, host }: { url: string; host: string }) {
  const escapedHost = host.replace(/\./g, '&#8203;.');
  return `
<body style="background:#f9f9f9;">
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background:#fff; max-width:600px; margin:auto; border-radius:12px;">
    <tr>
      <td align="center" style="padding:16px 0; font-size:22px; font-family:system-ui, -apple-system, Segoe UI, sans-serif; color:#103034;">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:8px 0 24px 0;">
        <a href="${url}" target="_blank" style="display:inline-block; font-size:16px; font-family:system-ui, -apple-system, Segoe UI, sans-serif; color:#103034; text-decoration:none; border-radius:10px; padding:12px 18px; border:2px solid #103034;">
          Sign in
        </a>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:0 24px 18px 24px; font-size:14px; line-height:20px; font-family:system-ui, -apple-system, Segoe UI, sans-serif; color:#4A5568;">
        If you did not request this email, you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

async function sendMagicLinkEmail(params: { identifier: string; url: string }) {
  const env = getServerEnv();
  const { identifier, url } = params;
  const host = new URL(url).host;

  const subject = `Sign in to ${host}`;

  if (!env.RESEND_API_KEY || !env.RESEND_FROM) {
    if (env.NODE_ENV === 'production') {
      throw new Error('Resend is not configured (RESEND_API_KEY, RESEND_FROM)');
    }

    // Dev/testing fallback: log magic link instead of sending email.
    console.log(`[auth] Magic link for ${identifier}: ${url}`);
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: identifier,
      subject,
      text: text({ url, host }),
      html: html({ url, host }),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Resend email failed: ${response.status} ${body}`);
  }
}

export function createAuthOptions(): NextAuthOptions {
  const env = getServerEnv();

  return {
    adapter: PrismaAdapter(prisma),
    providers: [
      EmailProvider({
        sendVerificationRequest: async ({ identifier, url }) => {
          await sendMagicLinkEmail({ identifier, url });
        },
      }),
      ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? [
            GoogleProvider({
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
              allowDangerousEmailAccountLinking: true,
            }),
          ]
        : []),
    ],
    pages: {
      signIn: '/auth/signin',
    },
    session: {
      strategy: 'database',
    },
    debug: env.NODE_ENV !== 'production',
  };
}

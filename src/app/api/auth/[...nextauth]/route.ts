import NextAuth from 'next-auth';

import { createAuthOptions } from '@/lib/auth/options';

export async function GET(request: Request) {
  const handler = NextAuth(createAuthOptions());
  return handler(request);
}

export async function POST(request: Request) {
  const handler = NextAuth(createAuthOptions());
  return handler(request);
}


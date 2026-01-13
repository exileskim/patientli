import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import looksData from './content/looks.json';

type LookRecord = { id?: string; slug?: string };

const nonLookSlugs = new Set(['basic', 'starter', 'growth', 'full-ai-visibility-report']);
const lookIdToSlug = new Map<string, string>();

(looksData as LookRecord[]).forEach((look) => {
  if (!look?.id || !look.slug) return;
  if (nonLookSlugs.has(look.slug)) return;
  lookIdToSlug.set(String(look.id), look.slug);
});

function normalizeRedirectPath(raw: string | null) {
  if (!raw) return null;
  let candidate = raw;
  try {
    candidate = decodeURIComponent(candidate);
  } catch {
    // ignore
  }

  try {
    const url = new URL(candidate, 'https://patient.li');
    candidate = `${url.pathname}${url.search}${url.hash}`;
  } catch {
    if (!candidate.startsWith('/')) return null;
  }

  if (candidate.startsWith('/choose-your-plan') || candidate.startsWith('/checkout')) {
    return '/pricing';
  }

  return candidate;
}

export function proxy(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('add-to-cart');
  if (productId) {
    const slug = lookIdToSlug.get(productId) ?? null;
    const destinationPath =
      (slug ? `/looks-preview/${slug}` : null) ??
      normalizeRedirectPath(
        request.nextUrl.searchParams.get('e-redirect') ??
          request.nextUrl.searchParams.get('redirect_to'),
      ) ??
      '/pricing';

    const destination = new URL(destinationPath, request.nextUrl.origin);
    return NextResponse.redirect(destination);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};

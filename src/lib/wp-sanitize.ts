import type { WpHeadTag } from '@/lib/wp-content';

const BLOCKED_LINK_PATTERNS = [
  /cookie-notice/i,
];

const BLOCKED_SCRIPT_PATTERNS = [
  /googletagmanager/i,
  /gtag/i,
  /google-analytics/i,
  /google-site-kit/i,
  /facebook\.com\/tr/i,
  /connect\.facebook\.net/i,
  /meta pixel/i,
  /fbq\(/i,
  /js\.hs-scripts\.com/i,
  /leadin/i,
  /hubspot/i,
  /afl[-_]?wc[-_]?utm/i,
  /cookie[-_ ]?notice/i,
  /rank-math/i,
  /wpemoji/i,
  /speculationrules/i,
];

const BLOCKED_STYLE_IDS = [
  /wp-emoji-styles-inline-css/i,
];

const BLOCKED_BODY_PATTERNS = [
  /googletagmanager/i,
  /gtag/i,
  /google-analytics/i,
  /google-site-kit/i,
  /facebook\.com\/tr/i,
  /connect\.facebook\.net/i,
  /meta pixel/i,
  /fbq\(/i,
  /js\.hs-scripts\.com/i,
  /leadin/i,
  /hubspot/i,
  /afl[-_]?wc[-_]?utm/i,
  /cookie[-_ ]?notice/i,
  /rank-math/i,
  /wpemoji/i,
  /speculationrules/i,
];

function isBlocked(value: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(value));
}

export function filterWpHeadTags(tags: WpHeadTag[]) {
  return tags.filter((tag) => {
    if (tag.tag === 'link') {
      return !isBlocked(tag.href, BLOCKED_LINK_PATTERNS);
    }

    if (tag.tag === 'style') {
      if (tag.id && isBlocked(tag.id, BLOCKED_STYLE_IDS)) {
        return false;
      }
      return true;
    }

    if (tag.tag === 'script') {
      if (tag.attributes.type === 'application/ld+json') {
        return false;
      }

      const src = typeof tag.attributes.src === 'string' ? tag.attributes.src : '';
      const id = typeof tag.attributes.id === 'string' ? tag.attributes.id : '';

      if (src && isBlocked(src, BLOCKED_SCRIPT_PATTERNS)) {
        return false;
      }
      if (id && isBlocked(id, BLOCKED_SCRIPT_PATTERNS)) {
        return false;
      }
      if (tag.content && isBlocked(tag.content, BLOCKED_SCRIPT_PATTERNS)) {
        return false;
      }

      return true;
    }

    return true;
  });
}

export function stripWpBodyHtml(html: string) {
  if (!html) return '';

  const stripIfBlocked = (block: string) =>
    isBlocked(block, BLOCKED_BODY_PATTERNS) ? '' : block;

  return html
    .replace(/<script[\s\S]*?<\/script>/gi, stripIfBlocked)
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, stripIfBlocked)
    .replace(/<div[^>]*id=['"]fb-pxl-ajax-code['"][^>]*><\/div>/gi, '');
}

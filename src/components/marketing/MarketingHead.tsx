'use client';

import { useEffect, useMemo } from 'react';
import { useServerInsertedHTML } from 'next/navigation';

const baseStyles = [
  '/marketing/inline.css',
  'https://use.typekit.net/tam7fax.css',
  '/wp-content/uploads/elementor/google-fonts/css/playfairdisplay.css',
  '/wp-content/uploads/elementor/google-fonts/css/outfit.css',
  '/wp-content/plugins/elementor/assets/css/conditionals/dialog.min.css',
  '/wp-content/plugins/elementor/assets/css/conditionals/lightbox.min.css',
];
const SMALLSCREEN_MEDIA = 'only screen and (max-width: 768px)';
const styleMediaMap = new Map<string, string>([
  ['/wp-content/plugins/woocommerce/assets/css/woocommerce-smallscreen.css', SMALLSCREEN_MEDIA],
]);

interface MarketingHeadProps {
  path: string;
  styles: string[];
  structuredData: string[];
}

function buildStyleList(styles: string[]) {
  const seen = new Set<string>();
  return [...baseStyles, ...styles].filter((href) => {
    if (!href) return false;
    if (seen.has(href)) return false;
    seen.add(href);
    return true;
  });
}

function getStyleMedia(href: string) {
  for (const [match, media] of styleMediaMap.entries()) {
    if (href.includes(match)) return media;
  }
  return undefined;
}

export default function MarketingHead({ path, styles, structuredData }: MarketingHeadProps) {
  const combinedStyles = useMemo(() => buildStyleList(styles), [styles]);

  useServerInsertedHTML(() => {
    return (
      <>
        {combinedStyles.map((href) => {
          const media = getStyleMedia(href);
          return (
            <link
              data-marketing-head="style"
              key={href}
              rel="stylesheet"
              href={href}
              media={media}
            />
          );
        })}
        {structuredData.map((json, index) => (
          <script
            dangerouslySetInnerHTML={{ __html: json }}
            data-marketing-head="jsonld"
            key={`${path}-jsonld-${index}`}
            type="application/ld+json"
          />
        ))}
      </>
    );
  });

  useEffect(() => {
    const head = document.head;
    const desiredLinks = new Set(combinedStyles);

    const existingLinks = Array.from(
      head.querySelectorAll<HTMLLinkElement>('link[data-marketing-head="style"]'),
    );

    existingLinks.forEach((link) => {
      const href = link.getAttribute('href') ?? '';
      if (!desiredLinks.has(href)) {
        link.remove();
      }
    });

    combinedStyles.forEach((href) => {
      if (head.querySelector(`link[data-marketing-head="style"][href="${href}"]`)) {
        const existingLink = head.querySelector<HTMLLinkElement>(
          `link[data-marketing-head="style"][href="${href}"]`,
        );
        if (existingLink) {
          const media = getStyleMedia(href);
          if (media) {
            existingLink.media = media;
          } else {
            existingLink.removeAttribute('media');
          }
        }
        return;
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.marketingHead = 'style';
      const media = getStyleMedia(href);
      if (media) {
        link.media = media;
      }
      head.appendChild(link);
    });

    const existingJson = Array.from(
      head.querySelectorAll<HTMLScriptElement>('script[data-marketing-head="jsonld"]'),
    );
    existingJson.forEach((script) => script.remove());

    structuredData.forEach((json, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = json;
      script.dataset.marketingHead = 'jsonld';
      script.dataset.marketingIndex = String(index);
      script.dataset.marketingPath = path;
      head.appendChild(script);
    });
  }, [combinedStyles, path, structuredData]);

  return null;
}

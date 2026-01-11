import type { ScriptHTMLAttributes } from 'react';

import { getWpEntry, normalizeWpPath } from '@/lib/wp-content';

interface MarketingHeadProps {
  params: { slug?: string[] };
}

export default function Head({ params }: MarketingHeadProps) {
  const pathname = normalizeWpPath(`/${params.slug?.join('/') ?? ''}`);
  const entry = getWpEntry(pathname);

  if (!entry) {
    return null;
  }

  return (
    <>
      {entry.headTags.map((tag, index) => {
        if (tag.tag === 'link') {
          return (
            <link
              key={tag.id ?? `${tag.href}-${tag.media ?? 'all'}`}
              id={tag.id}
              rel="stylesheet"
              type={tag.type}
              href={tag.href}
              media={tag.media}
            />
          );
        }

        if (tag.tag === 'script') {
          const attributes = tag.attributes as ScriptHTMLAttributes<HTMLScriptElement>;
          const key =
            (typeof attributes.id === 'string' && attributes.id) ||
            (typeof attributes.src === 'string' && attributes.src) ||
            `wp-script-${index}`;

          if (tag.content) {
            return (
              <script
                key={key}
                {...attributes}
                dangerouslySetInnerHTML={{ __html: tag.content }}
              />
            );
          }

          return <script key={key} {...attributes} />;
        }

        return (
          <style
            key={tag.id ?? `wp-inline-${index}`}
            id={tag.id}
            type={tag.type}
            media={tag.media}
            dangerouslySetInnerHTML={{ __html: tag.css }}
          />
        );
      })}
    </>
  );
}

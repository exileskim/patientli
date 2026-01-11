import type { LinkHTMLAttributes, ScriptHTMLAttributes } from 'react';

import type { WpHeadTag } from '@/lib/wp-content';

export function WpHeadTags({ headTags }: { headTags: WpHeadTag[] }) {
  return (
    <>
      {headTags.map((tag, index) => {
        if (tag.tag === 'link') {
          const key = tag.id ?? `${tag.href}-${tag.media ?? 'all'}`;
          const props: LinkHTMLAttributes<HTMLLinkElement> = {
            rel: 'stylesheet',
            href: tag.href,
            media: tag.media,
            id: tag.id,
            type: tag.type,
          };

          return <link key={key} {...props} />;
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

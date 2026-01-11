'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type WorkCarouselItem = {
  title: string;
  href: string;
  image: string;
  imageAlt: string;
  width: number;
  height: number;
};

export function HomeWorkCarousel({ items }: { items: WorkCarouselItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const active = items[activeIndex];

  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
      <div className="w-full lg:flex-1">
        <div
          className="mx-auto overflow-hidden rounded-[20px] bg-white shadow-sm"
          style={{ maxWidth: active.width }}
        >
          <Image
            src={active.image}
            alt={active.imageAlt}
            width={active.width}
            height={active.height}
            sizes={`(max-width: ${active.width}px) 100vw, ${active.width}px`}
            className="h-auto w-full"
            priority={activeIndex === 0}
          />
        </div>
      </div>

      <div className="w-full lg:w-1/3">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`w-full border-t border-[var(--color-text-primary)] p-6 text-left ${isLast ? 'border-b' : ''}`}
            >
              <p className="text-base font-semibold text-[var(--color-text-primary)]">{item.title}</p>
              <Link
                href={item.href}
                className="mt-1 inline-block text-base font-semibold text-[var(--color-text-primary)] underline underline-offset-2"
                onClick={(event) => event.stopPropagation()}
              >
                Read More
              </Link>
            </button>
          );
        })}
      </div>
    </div>
  );
}

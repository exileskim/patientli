'use client';

import { useEffect } from 'react';

interface MarketingBodyClassProps {
  className?: string;
}

export default function MarketingBodyClass({ className }: MarketingBodyClassProps) {
  useEffect(() => {
    const body = document.body;
    const marketingClasses = new Set(
      ['marketing-site', ...(className ?? '').split(/\s+/)].filter(Boolean),
    );
    const sanitizeBase = (value: string) =>
      Array.from(
        new Set(
          value
            .split(/\s+/)
            .map((entry) => entry.trim())
            .filter((entry) => entry && !marketingClasses.has(entry)),
        ),
      ).join(' ');

    const baseClass = body.dataset.baseClass ?? sanitizeBase(body.className);

    body.dataset.baseClass = baseClass;

    const nextClass = [baseClass, 'marketing-site', className]
      .filter(Boolean)
      .join(' ')
      .trim();

    body.className = nextClass;

    return () => {
      body.className = baseClass;
    };
  }, [className]);

  return null;
}

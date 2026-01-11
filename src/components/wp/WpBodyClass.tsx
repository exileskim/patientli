'use client';

import { useLayoutEffect } from 'react';

export function WpBodyClass({ className }: { className: string }) {
  useLayoutEffect(() => {
    const tokens = className ? className.split(/\s+/).filter(Boolean) : [];
    const classes = ['wp-site', ...tokens];
    classes.forEach((token) => document.body.classList.add(token));

    return () => {
      classes.forEach((token) => document.body.classList.remove(token));
    };
  }, [className]);

  return null;
}

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { WpBodyClass, WpFooter, WpHeader, WpHeadTags } from '@/components/wp';
import { getWpEntry, getWpFile, getWpHtml, normalizeWpPath } from '@/lib/wp-content';
import { stripWpBodyHtml } from '@/lib/wp-sanitize';

interface MarketingPageProps {
  params: { slug?: string[] };
}

export async function generateMetadata({ params }: MarketingPageProps): Promise<Metadata> {
  const pathname = normalizeWpPath(`/${params.slug?.join('/') ?? ''}`);
  const entry = getWpEntry(pathname);

  if (!entry) {
    return {};
  }

  return {
    title: entry.title || 'Patientli',
    description: entry.description || undefined,
  };
}

export default function MarketingPage({ params }: MarketingPageProps) {
  const pathname = normalizeWpPath(`/${params.slug?.join('/') ?? ''}`);
  const entry = getWpEntry(pathname);

  if (!entry) {
    notFound();
  }

  const html = getWpHtml(entry);
  const beforeHtml = entry.beforePath ? stripWpBodyHtml(getWpFile(entry.beforePath)) : '';
  const afterHtml = entry.afterPath ? stripWpBodyHtml(getWpFile(entry.afterPath)) : '';

  return (
    <>
      <WpBodyClass className={entry.bodyClass} />
      <WpHeadTags headTags={entry.headTags} />
      {beforeHtml ? <div dangerouslySetInnerHTML={{ __html: beforeHtml }} /> : null}
      <WpHeader htmlPath={entry.headerPath} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <WpFooter htmlPath={entry.footerPath} />
      {afterHtml ? <div dangerouslySetInnerHTML={{ __html: afterHtml }} /> : null}
    </>
  );
}

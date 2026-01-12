import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import MarketingBodyClass from '@/components/marketing/MarketingBodyClass';
import MarketingHead from '@/components/marketing/MarketingHead';
import MarketingScripts from '@/components/marketing/MarketingScripts';
import { getMarketingPage, getMarketingPartial, normalizeMarketingPath } from '@/lib/marketing-content';

type MarketingPageParams = { slug?: string[] };

interface MarketingPageProps {
  params: Promise<MarketingPageParams> | MarketingPageParams;
}

export async function generateMetadata({ params }: MarketingPageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const pathname = normalizeMarketingPath(`/${slug?.join('/') ?? ''}`);
  const entry = getMarketingPage(pathname);

  if (!entry) {
    return {};
  }

  return {
    title: entry.title || 'Patientli',
    description: entry.description || undefined,
    openGraph: {
      title: entry.title || 'Patientli',
      description: entry.description || undefined,
      url: `https://www.patient.li${pathname}`,
      siteName: 'Patientli',
      type: 'website',
    },
  };
}

export default async function MarketingPage({ params }: MarketingPageProps) {
  const { slug } = await Promise.resolve(params);
  const pathname = normalizeMarketingPath(`/${slug?.join('/') ?? ''}`);
  const entry = getMarketingPage(pathname);

  if (!entry) {
    notFound();
  }

  const headerHtml = entry.header ? getMarketingPartial(entry.header) : '';
  const footerHtml = entry.footer ? getMarketingPartial(entry.footer) : '';

  return (
    <>
      <MarketingHead path={entry.path} styles={entry.css} structuredData={entry.structuredData} />
      <MarketingBodyClass className={entry.bodyClass} />
      {headerHtml ? <div dangerouslySetInnerHTML={{ __html: headerHtml }} /> : null}
      <div dangerouslySetInnerHTML={{ __html: entry.html }} />
      {footerHtml ? <div dangerouslySetInnerHTML={{ __html: footerHtml }} /> : null}
      <MarketingScripts
        hubspotForms={entry.hubspotForms}
        hubspotMeetings={entry.hubspotMeetings}
        scripts={entry.scripts}
      />
    </>
  );
}

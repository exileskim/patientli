import fs from 'node:fs';
import path from 'node:path';

import pages from '@/content/marketing/pages.json';

export interface HubspotFormConfig {
  portalId: string;
  formId: string;
  target: string;
  region?: string;
}

export interface HubspotMeetingConfig {
  selector: string;
}

export interface MarketingPage {
  path: string;
  title: string;
  description: string;
  bodyClass: string;
  header: string | null;
  footer: string | null;
  html: string;
  css: string[];
  structuredData: string[];
  hubspotForms: HubspotFormConfig[];
  hubspotMeetings: HubspotMeetingConfig[];
  scripts: Array<{ src?: string; content?: string }>;
}

const CONTENT_ROOT = path.join(process.cwd(), 'src/content/marketing');

export function normalizeMarketingPath(pathname: string) {
  if (!pathname || pathname === '') return '/';
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function getMarketingPage(pathname: string): MarketingPage | null {
  const normalized = normalizeMarketingPath(pathname);
  return (pages as Record<string, MarketingPage>)[normalized] ?? null;
}

export function getMarketingPartial(partialPath: string): string {
  const fullPath = path.join(CONTENT_ROOT, partialPath);
  try {
    return fs.readFileSync(fullPath, 'utf8');
  } catch {
    return '';
  }
}

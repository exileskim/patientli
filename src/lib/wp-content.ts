import fs from 'node:fs';
import path from 'node:path';

import manifest from '@/content/wp/manifest.json';

export interface WpHeadTagLink {
  tag: 'link';
  href: string;
  media?: string;
  id?: string;
  type?: string;
}

export interface WpHeadTagStyle {
  tag: 'style';
  css: string;
  id?: string;
  media?: string;
  type?: string;
}

export interface WpHeadTagScript {
  tag: 'script';
  attributes: Record<string, string | boolean>;
  content?: string;
}

export type WpHeadTag = WpHeadTagLink | WpHeadTagStyle | WpHeadTagScript;

export interface WpEntry {
  path: string;
  htmlPath: string;
  headerPath: string;
  footerPath: string;
  beforePath?: string;
  afterPath?: string;
  title: string;
  description: string;
  bodyClass: string;
  headTags: WpHeadTag[];
}

const CONTENT_ROOT = path.join(process.cwd(), 'src/content/wp');

export function normalizeWpPath(input: string) {
  if (!input || input === '') return '/';
  if (input === '/') return '/';
  return input.endsWith('/') ? input : `${input}/`;
}

export function getWpEntry(pathname: string): WpEntry | undefined {
  const normalized = normalizeWpPath(pathname);
  return (manifest as { pages: Record<string, WpEntry> }).pages[normalized];
}

export function getWpHtml(entry: WpEntry) {
  return getWpFile(entry.htmlPath);
}

export function getWpFile(relativePath: string) {
  const filePath = path.join(CONTENT_ROOT, relativePath);
  return fs.readFileSync(filePath, 'utf8');
}

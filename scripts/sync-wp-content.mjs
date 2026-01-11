import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'https://www.patient.li';
const OUTPUT_DIR = path.join(process.cwd(), 'src/content/wp');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');
const HEADERS_DIR = path.join(OUTPUT_DIR, 'headers');
const FOOTERS_DIR = path.join(OUTPUT_DIR, 'footers');

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.text();
}

function extractLocs(xml) {
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
}

function normalizePathname(pathname) {
  if (!pathname || pathname === '') return '/';
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function toFilePath(pathname) {
  if (pathname === '/') return 'index.html';
  const segments = pathname.split('/').filter(Boolean);
  return path.join(...segments, 'index.html');
}

function localizeHtml(html) {
  return html
    .replaceAll('https://www.patient.li/wp-content/', '/wp-content/')
    .replaceAll('http://www.patient.li/wp-content/', '/wp-content/')
    .replaceAll('//www.patient.li/wp-content/', '/wp-content/')
    .replaceAll('https://www.patient.li/', '/')
    .replaceAll('http://www.patient.li/', '/')
    .replaceAll('//www.patient.li/', '/')
    .replaceAll('https://www.patient.li', '/')
    .replaceAll('http://www.patient.li', '/')
    .replaceAll('//www.patient.li', '/');
}

function hashHtml(html) {
  return crypto.createHash('sha256').update(html).digest('hex').slice(0, 12);
}

function extractHeaderFooter(html) {
  const bodyStart = html.indexOf('<body');
  if (bodyStart === -1) {
    throw new Error('Unable to find <body> tag.');
  }

  const bodyOpenEnd = html.indexOf('>', bodyStart);
  const bodyEnd = html.lastIndexOf('</body>');
  if (bodyOpenEnd === -1 || bodyEnd === -1) {
    throw new Error('Unable to find <body> boundaries.');
  }

  const bodyHtml = html.slice(bodyOpenEnd + 1, bodyEnd);
  const headerStart = bodyHtml.indexOf('<header data-elementor-type="header"');
  const headerEnd = headerStart === -1 ? -1 : bodyHtml.indexOf('</header>', headerStart);
  const footerStart = bodyHtml.indexOf('<footer data-elementor-type="footer"');
  const footerEnd = footerStart === -1 ? -1 : bodyHtml.indexOf('</footer>', footerStart);

  if (headerStart === -1 || headerEnd === -1 || footerStart === -1 || footerEnd === -1) {
    throw new Error('Unable to find header/footer boundaries.');
  }

  const headerHtml = bodyHtml.slice(headerStart, headerEnd + '</header>'.length);
  const footerHtml = bodyHtml.slice(footerStart, footerEnd + '</footer>'.length);
  const mainHtml = bodyHtml.slice(headerEnd + '</header>'.length, footerStart);
  const beforeHeaderHtml = bodyHtml.slice(0, headerStart);
  const afterFooterHtml = bodyHtml.slice(footerEnd + '</footer>'.length);

  return {
    beforeHeader: beforeHeaderHtml,
    header: headerHtml,
    main: mainHtml,
    footer: footerHtml,
    afterFooter: afterFooterHtml,
  };
}

function toBeforePath(pathname) {
  if (pathname === '/') return 'before.html';
  const segments = pathname.split('/').filter(Boolean);
  return path.join(...segments, 'before.html');
}

function toAfterPath(pathname) {
  if (pathname === '/') return 'after.html';
  const segments = pathname.split('/').filter(Boolean);
  return path.join(...segments, 'after.html');
}

function extractBodyClass(html) {
  const match = html.match(/<body[^>]*class=["']([^"']*)["'][^>]*>/i);
  return match ? match[1].trim() : '';
}

function extractTitle(html) {
  const match = html.match(/<title>([^<]+)<\/title>/i);
  return match ? match[1].trim() : '';
}

function extractDescription(html) {
  const match = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["'][^>]*>/i);
  return match ? match[1].trim() : '';
}

function extractHeadTags(html) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return [];

  const headHtml = headMatch[1];
  const linkRegex = /<link\s+[^>]*rel=["']stylesheet["'][^>]*>/gi;
  const styleRegex = /<style[^>]*>[\s\S]*?<\/style>/gi;
  const scriptRegex = /<script[^>]*>[\s\S]*?<\/script>/gi;
  const idRegex = /id=["']([^"']+)["']/i;
  const mediaRegex = /media=["']([^"']+)["']/i;
  const typeRegex = /type=["']([^"']+)["']/i;
  const hrefRegex = /href=["']([^"']+)["']/i;

  const tags = [];
  let match;

  while ((match = linkRegex.exec(headHtml))) {
    const tag = match[0];
    const hrefMatch = tag.match(hrefRegex);
    if (!hrefMatch) continue;
    const mediaMatch = tag.match(mediaRegex);
    const idMatch = tag.match(idRegex);
    const typeMatch = tag.match(typeRegex);

    tags.push({
      tag: 'link',
      href: localizeHtml(hrefMatch[1]),
      media: mediaMatch ? mediaMatch[1] : undefined,
      id: idMatch ? idMatch[1] : undefined,
      type: typeMatch ? typeMatch[1] : undefined,
      index: match.index ?? 0,
    });
  }

  while ((match = styleRegex.exec(headHtml))) {
    const fullTag = match[0];
    const attrsMatch = fullTag.match(/<style([^>]*)>/i);
    const attrs = attrsMatch ? attrsMatch[1] : '';
    const idMatch = attrs.match(idRegex);
    const mediaMatch = attrs.match(mediaRegex);
    const typeMatch = attrs.match(typeRegex);
    const cssMatch = fullTag.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const css = cssMatch ? cssMatch[1] : '';

    tags.push({
      tag: 'style',
      css: localizeHtml(css).trim(),
      id: idMatch ? idMatch[1] : undefined,
      media: mediaMatch ? mediaMatch[1] : undefined,
      type: typeMatch ? typeMatch[1] : undefined,
      index: match.index ?? 0,
    });
  }

  while ((match = scriptRegex.exec(headHtml))) {
    const fullTag = match[0];
    const attrsMatch = fullTag.match(/<script([^>]*)>/i);
    const attrs = attrsMatch ? attrsMatch[1] : '';
    const contentMatch = fullTag.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    const content = contentMatch ? contentMatch[1].trim() : '';
    const attributes = parseAttributes(attrs);

    tags.push({
      tag: 'script',
      attributes,
      content: content || undefined,
      index: match.index ?? 0,
    });
  }

  return tags
    .sort((a, b) => a.index - b.index)
    .map(({ index, ...rest }) => rest);
}

function parseAttributes(input) {
  const attrs = {};
  const attrRegex = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:=["']([^"']*)["'])?/g;
  let match;

  while ((match = attrRegex.exec(input))) {
    const name = match[1];
    const value = match[2];
    if (!name) continue;
    if (value === undefined) {
      attrs[name] = true;
      continue;
    }

    attrs[name] = localizeHtml(value);
  }

  if (typeof attrs.src === 'string') {
    attrs.src = localizeHtml(attrs.src);
  }

  return attrs;
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(HEADERS_DIR, { recursive: true });
  await fs.mkdir(FOOTERS_DIR, { recursive: true });

  const sitemapIndexXml = await fetchText(`${ROOT}/wp-sitemap.xml`);
  const sitemapUrls = extractLocs(sitemapIndexXml);

  const pageUrls = [];
  for (const sitemapUrl of sitemapUrls) {
    const xml = await fetchText(sitemapUrl);
    pageUrls.push(...extractLocs(xml));
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    pages: {},
  };
  const headerCache = new Set();
  const footerCache = new Set();

  for (const url of pageUrls) {
    const html = await fetchText(url);
    const {
      beforeHeader,
      header,
      main,
      footer,
      afterFooter,
    } = extractHeaderFooter(html);
    const localizedHeader = localizeHtml(header);
    const localizedFooter = localizeHtml(footer);
    const headerHash = hashHtml(localizedHeader);
    const footerHash = hashHtml(localizedFooter);
    const headerPath = path.join('headers', `${headerHash}.html`);
    const footerPath = path.join('footers', `${footerHash}.html`);

    if (!headerCache.has(headerHash)) {
      await fs.writeFile(path.join(OUTPUT_DIR, headerPath), localizedHeader);
      headerCache.add(headerHash);
    }

    if (!footerCache.has(footerHash)) {
      await fs.writeFile(path.join(OUTPUT_DIR, footerPath), localizedFooter);
      footerCache.add(footerHash);
    }

    const { pathname } = new URL(url);
    const normalizedPath = normalizePathname(pathname);
    const filePath = toFilePath(normalizedPath);
    const outputPath = path.join(OUTPUT_DIR, filePath);
    const beforePath = toBeforePath(normalizedPath);
    const afterPath = toAfterPath(normalizedPath);
    const beforeHtml = localizeHtml(beforeHeader).trim();
    const afterHtml = localizeHtml(afterFooter).trim();

    await ensureDir(outputPath);
    await fs.writeFile(outputPath, localizeHtml(main).trim());

    let storedBeforePath;
    let storedAfterPath;

    if (beforeHtml) {
      const beforeOutputPath = path.join(OUTPUT_DIR, beforePath);
      await ensureDir(beforeOutputPath);
      await fs.writeFile(beforeOutputPath, beforeHtml);
      storedBeforePath = beforePath;
    }

    if (afterHtml) {
      const afterOutputPath = path.join(OUTPUT_DIR, afterPath);
      await ensureDir(afterOutputPath);
      await fs.writeFile(afterOutputPath, afterHtml);
      storedAfterPath = afterPath;
    }

    const bodyClass = extractBodyClass(html);
    const headTags = extractHeadTags(html);

    manifest.pages[normalizedPath] = {
      path: normalizedPath,
      htmlPath: filePath,
      title: extractTitle(html),
      description: extractDescription(html),
      bodyClass,
      headTags,
      headerPath,
      footerPath,
      beforePath: storedBeforePath,
      afterPath: storedAfterPath,
    };

    process.stdout.write(`Synced ${normalizedPath}\n`);
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const ARCHIVE_PUBLIC_DIR = path.join(ROOT, 'Old Site Archive', 'files');
const CONTENT_DIR = path.join(ROOT, 'src/content/marketing');
const LEGACY_CONTENT_DIR = path.join(ROOT, 'src/content');
const PAGES_PATH = path.join(CONTENT_DIR, 'pages.json');
const PARTIALS_DIR = path.join(CONTENT_DIR, 'partials');
const MARKETING_DIR = path.join(PUBLIC_DIR, 'marketing');
const INLINE_CSS_PATH = path.join(MARKETING_DIR, 'inline.css');
const COMBINED_CSS_PATH = path.join(MARKETING_DIR, 'marketing.css');

const ASSET_PREFIX = '/marketing/assets';
const WP_URL_RE = /(?:https?:\/\/www\.patient\.li|\/\/www\.patient\.li)?(\/wp-content\/[^\t\n\r "'\\\)>,]+)/g;
const CSS_URL_RE = /url\(([^)]+)\)/gi;

const BASE_CSS_PATHS = [
  '/wp-content/uploads/elementor/google-fonts/css/playfairdisplay.css',
  '/wp-content/uploads/elementor/google-fonts/css/outfit.css',
  '/wp-content/plugins/elementor/assets/css/conditionals/dialog.min.css',
  '/wp-content/plugins/elementor/assets/css/conditionals/lightbox.min.css',
  '/wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css',
];

const assetMap = new Map();
const SOURCE_ROOTS = [PUBLIC_DIR, ARCHIVE_PUBLIC_DIR];

function toPublicPath(urlPath) {
  return path.join(PUBLIC_DIR, urlPath.replace(/^\//, ''));
}

async function resolveSourcePath(urlPath) {
  const relative = urlPath.replace(/^\//, '');
  for (const root of SOURCE_ROOTS) {
    const candidate = path.join(root, relative);
    try {
      await fs.access(candidate);
      return { filePath: candidate, root };
    } catch {
      // continue
    }
  }
  return { filePath: path.join(PUBLIC_DIR, relative), root: PUBLIC_DIR };
}

function normalizeWpPath(value) {
  if (!value) return null;
  const match = value.match(/(\/wp-content\/[^\s"')>]+)/);
  return match ? match[1] : null;
}

function mapWpPath(wpPath) {
  return `${ASSET_PREFIX}/${wpPath.replace(/^\/wp-content\//, '')}`;
}

function stripQueryAndHash(value) {
  return value.split(/[?#]/)[0];
}

function ensureAsset(wpPath) {
  const normalized = normalizeWpPath(wpPath);
  if (!normalized) return null;
  if (!normalized.startsWith('/wp-content/')) return null;
  const mapped = assetMap.get(normalized) ?? mapWpPath(normalized);
  assetMap.set(normalized, mapped);
  return mapped;
}

function collectWpPathsFromText(text) {
  if (!text) return;
  let match;
  while ((match = WP_URL_RE.exec(text))) {
    ensureAsset(match[1]);
  }
}

function normalizeUrlToken(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return { url: '', quote: '' };
  const quote = trimmed[0] === '"' || trimmed[0] === "'" ? trimmed[0] : '';
  const url = quote ? trimmed.slice(1, trimmed.endsWith(quote) ? -1 : undefined) : trimmed;
  return { url, quote };
}

function resolveRelativeUrl(url, sourceFile, sourceRoot) {
  const resolvedFs = path.resolve(path.dirname(sourceFile), url);
  const sitePath = `/${path.relative(sourceRoot, resolvedFs).replace(/\\/g, '/')}`;
  return sitePath;
}

function collectCssAssets(cssText, sourceFile, sourceRoot) {
  if (!cssText) return;
  collectWpPathsFromText(cssText);

  let match;
  while ((match = CSS_URL_RE.exec(cssText))) {
    const { url } = normalizeUrlToken(match[1] ?? '');
    if (!url || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('#')) {
      continue;
    }
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      collectWpPathsFromText(url);
      continue;
    }
    if (url.startsWith('/')) {
      ensureAsset(url);
      continue;
    }
    const sitePath = resolveRelativeUrl(url, sourceFile, sourceRoot);
    ensureAsset(sitePath);
  }
}

function rewriteWpUrls(text) {
  if (!text) return text;
  return text.replace(WP_URL_RE, (full, wpPath) => {
    const mapped = ensureAsset(wpPath);
    return mapped ?? full;
  });
}

function rewriteCss(cssText, sourceFile, sourceRoot) {
  if (!cssText) return cssText;
  const replaced = cssText.replace(CSS_URL_RE, (full, raw) => {
    const { url, quote } = normalizeUrlToken(raw ?? '');
    if (!url || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('#')) {
      return full;
    }
    if (url.startsWith('/marketing/')) {
      return full;
    }
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      const mapped = ensureAsset(url);
      if (!mapped) return full;
      return `url(${quote}${mapped}${quote})`;
    }
    if (url.startsWith('/')) {
      const mapped = ensureAsset(url);
      if (!mapped) return full;
      return `url(${quote}${mapped}${quote})`;
    }
    const sitePath = resolveRelativeUrl(url, sourceFile, sourceRoot);
    const mapped = ensureAsset(sitePath);
    if (!mapped) return full;
    return `url(${quote}${mapped}${quote})`;
  });

  return rewriteWpUrls(replaced);
}

async function listHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listHtmlFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function listTopLevelJsonFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.join(dir, entry.name));
}

async function readFileSafe(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return '';
  }
}

async function main() {
  const pagesRaw = await fs.readFile(PAGES_PATH, 'utf8');
  const pages = JSON.parse(pagesRaw);
  const legacyJsonFiles = await listTopLevelJsonFiles(LEGACY_CONTENT_DIR);

  const cssPaths = new Set(BASE_CSS_PATHS);
  for (const entry of Object.values(pages)) {
    for (const cssPath of entry.css || []) {
      if (cssPath) cssPaths.add(cssPath);
    }
  }
  if (await readFileSafe(INLINE_CSS_PATH)) {
    cssPaths.add('/marketing/inline.css');
  }

  for (const entry of Object.values(pages)) {
    collectWpPathsFromText(entry.html || '');
    for (const json of entry.structuredData || []) {
      collectWpPathsFromText(json);
    }
  }

  for (const legacyFile of legacyJsonFiles) {
    const raw = await readFileSafe(legacyFile);
    collectWpPathsFromText(raw);
  }

  const partialFiles = await listHtmlFiles(PARTIALS_DIR);
  for (const filePath of partialFiles) {
    const html = await readFileSafe(filePath);
    collectWpPathsFromText(html);
  }

  for (const cssPath of cssPaths) {
    if (!cssPath.startsWith('/')) continue;
    const { filePath, root } = await resolveSourcePath(cssPath);
    const cssText = await readFileSafe(filePath);
    if (!cssText) continue;
    collectCssAssets(cssText, filePath, root);
  }

  let combinedCss = '';
  for (const cssPath of cssPaths) {
    if (!cssPath.startsWith('/')) continue;
    const { filePath, root } = await resolveSourcePath(cssPath);
    const cssText = await readFileSafe(filePath);
    if (!cssText) continue;
    const rewritten = rewriteCss(cssText, filePath, root);
    combinedCss += `${rewritten}\n\n`;
  }

  if (combinedCss) {
    await fs.mkdir(path.dirname(COMBINED_CSS_PATH), { recursive: true });
    await fs.writeFile(COMBINED_CSS_PATH, combinedCss);
  }

  for (const entry of Object.values(pages)) {
    entry.html = rewriteWpUrls(entry.html || '');
    entry.structuredData = (entry.structuredData || []).map((json) => rewriteWpUrls(json));
    entry.scripts = (entry.scripts || []).map((script) => ({
      ...script,
      src: script.src ? rewriteWpUrls(script.src) : undefined,
    }));
  }

  await fs.writeFile(PAGES_PATH, JSON.stringify(pages, null, 2));

  for (const legacyFile of legacyJsonFiles) {
    const raw = await readFileSafe(legacyFile);
    if (!raw) continue;
    const rewritten = rewriteWpUrls(raw);
    await fs.writeFile(legacyFile, rewritten);
  }

  for (const filePath of partialFiles) {
    const html = await readFileSafe(filePath);
    if (!html) continue;
    const rewritten = rewriteWpUrls(html);
    await fs.writeFile(filePath, rewritten);
  }

  const missing = [];
  for (const [wpPath, assetPath] of assetMap.entries()) {
    const { filePath: source } = await resolveSourcePath(stripQueryAndHash(wpPath));
    const destination = toPublicPath(stripQueryAndHash(assetPath));
    try {
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.copyFile(source, destination);
    } catch {
      missing.push(wpPath);
    }
  }

  if (missing.length) {
    console.warn(`Missing assets: ${missing.length}`);
    missing.slice(0, 20).forEach((asset) => console.warn(`- ${asset}`));
    if (missing.length > 20) {
      console.warn(`...and ${missing.length - 20} more`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

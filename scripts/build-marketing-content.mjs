import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const WP_DIR = path.join(ROOT, 'src/content/wp');
const MANIFEST_PATH = path.join(WP_DIR, 'manifest.json');
const OUT_DIR = path.join(ROOT, 'src/content/marketing');
const PARTIALS_DIR = path.join(OUT_DIR, 'partials');
const HEADERS_DIR = path.join(PARTIALS_DIR, 'headers');
const FOOTERS_DIR = path.join(PARTIALS_DIR, 'footers');
const INLINE_CSS_PATH = path.join(ROOT, 'public/marketing/inline.css');

const CSS_EXCLUDE_PATTERNS = [
  /cookie-notice/i,
  /wp-includes\/css\/dist\/block-library/i,
];

const EXTERNAL_CSS_EXCLUDE = [
  /use\.typekit\.net/i,
];

const SCRIPT_KEEP_TYPES = new Set(['application/ld+json']);

function shouldKeepCss(href) {
  if (!href) return false;
  if (EXTERNAL_CSS_EXCLUDE.some((pattern) => pattern.test(href))) return false;
  return !CSS_EXCLUDE_PATTERNS.some((pattern) => pattern.test(href));
}

function stripQuery(url) {
  if (!url) return '';
  const [base] = url.split('?');
  return base;
}


function extractLinks(html) {
  const links = [];
  const linkRegex = /<link\s+[^>]*rel=["']stylesheet["'][^>]*>/gi;
  const hrefRegex = /href=["']([^"']+)["']/i;
  let match;

  while ((match = linkRegex.exec(html))) {
    const tag = match[0];
    const hrefMatch = tag.match(hrefRegex);
    if (!hrefMatch) continue;
    links.push(hrefMatch[1]);
  }

  return links;
}

function extractScripts(html) {
  const scripts = [];
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  const srcRegex = /src=["']([^"']+)["']/i;
  const typeRegex = /type=["']([^"']+)["']/i;
  let sanitized = html;
  let match;

  while ((match = scriptRegex.exec(html))) {
    const [full, attrs, content] = match;
    const typeMatch = attrs.match(typeRegex);
    const type = typeMatch ? typeMatch[1].trim() : '';

    if (type && SCRIPT_KEEP_TYPES.has(type)) {
      continue;
    }

    const srcMatch = attrs.match(srcRegex);
    const src = srcMatch ? srcMatch[1] : '';
    scripts.push({ src, content: content.trim() });
    sanitized = sanitized.replace(full, '');
  }

  return { sanitized, scripts };
}

function extractHubspotForms(scripts) {
  const forms = [];
  const keptScripts = [];

  for (const script of scripts) {
    if (!script.content) {
      keptScripts.push(script);
      continue;
    }

    if (!script.content.includes('hbspt.forms.create')) {
      keptScripts.push(script);
      continue;
    }

    const portalIdMatch = script.content.match(/portalId\s*:\s*(\d+)/);
    const formIdMatch = script.content.match(/formId\s*:\s*["']([^"']+)["']/);
    const targetMatch = script.content.match(/target\s*:\s*["']([^"']+)["']/);
    const regionMatch = script.content.match(/region\s*:\s*["']([^"']+)["']/);

    if (portalIdMatch && formIdMatch && targetMatch) {
      forms.push({
        portalId: portalIdMatch[1],
        formId: formIdMatch[1],
        target: targetMatch[1],
        region: regionMatch ? regionMatch[1] : undefined,
      });
      continue;
    }

    keptScripts.push(script);
  }

  return { forms, scripts: keptScripts };
}

function extractMeetings(scripts, html) {
  const meetings = [];
  const keptScripts = [];

  for (const script of scripts) {
    if (!script.content) {
      keptScripts.push(script);
      continue;
    }

    if (!script.content.includes('hbspt.meetings.create')) {
      keptScripts.push(script);
      continue;
    }

    const selectorMatch = script.content.match(/meetings\.create\(\s*["']([^"']+)["']\s*\)/);
    if (selectorMatch) {
      meetings.push({ selector: selectorMatch[1] });
      continue;
    }

    keptScripts.push(script);
  }

  if (meetings.length === 0 && html.includes('meetings-iframe-container')) {
    meetings.push({ selector: '.meetings-iframe-container' });
  }

  return { meetings, scripts: keptScripts };
}

function filterScripts(scripts) {
  const allowedExternal = [
    /js\.hsforms\.net\/forms\/embed\/v2\.js/i,
    /js\.hsforms\.net\/forms\/embed\/\d+\.js/i,
    /static\.hsappstatic\.net\/MeetingsEmbed/i,
    /\/wp-content\/plugins\/elementor\/assets\/lib\/swiper\/v8\/swiper\.min\.js/i,
  ];

  return scripts.filter((script) => {
    if (script.src) {
      return allowedExternal.some((pattern) => pattern.test(script.src));
    }

    if (script.content) {
      return /hbspt\.forms\.create|hbspt\.meetings\.create/i.test(script.content);
    }

    return false;
  });
}

function normalizeBodyClass(bodyClass) {
  if (!bodyClass) return '';
  const classes = new Set(bodyClass.split(/\s+/).filter(Boolean));
  if (classes.has('woocommerce-no-js')) {
    classes.delete('woocommerce-no-js');
    classes.add('woocommerce-js');
  }
  return Array.from(classes).join(' ');
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readFileSafe(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return '';
  }
}

async function main() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));

  const inlineCss = new Set();
  for (const entry of Object.values(manifest.pages)) {
    for (const tag of entry.headTags || []) {
      if (tag.tag !== 'style' || !tag.css) continue;
      const trimmed = tag.css.trim();
      if (!trimmed) continue;
      inlineCss.add(trimmed);
    }
  }

  await ensureDir(OUT_DIR);
  await ensureDir(PARTIALS_DIR);
  await ensureDir(HEADERS_DIR);
  await ensureDir(FOOTERS_DIR);
  await ensureDir(path.dirname(INLINE_CSS_PATH));

  const headerMap = new Map();
  const footerMap = new Map();

  const pages = {};

  for (const [pathname, entry] of Object.entries(manifest.pages)) {
    const html = await readFileSafe(path.join(WP_DIR, entry.htmlPath));
    const beforeHtml = entry.beforePath
      ? await readFileSafe(path.join(WP_DIR, entry.beforePath))
      : '';
    const afterHtml = entry.afterPath
      ? await readFileSafe(path.join(WP_DIR, entry.afterPath))
      : '';

    const headerPath = entry.headerPath ? path.join(WP_DIR, entry.headerPath) : '';
    const footerPath = entry.footerPath ? path.join(WP_DIR, entry.footerPath) : '';

    if (headerPath && !headerMap.has(headerPath)) {
      const headerHtml = await readFileSafe(headerPath);
      const outputPath = path.join(HEADERS_DIR, path.basename(headerPath));
      await fs.writeFile(outputPath, headerHtml);
      headerMap.set(headerPath, path.relative(OUT_DIR, outputPath));
    }

    if (footerPath && !footerMap.has(footerPath)) {
      const footerHtml = await readFileSafe(footerPath);
      const outputPath = path.join(FOOTERS_DIR, path.basename(footerPath));
      await fs.writeFile(outputPath, footerHtml);
      footerMap.set(footerPath, path.relative(OUT_DIR, outputPath));
    }

    const allScripts = [];
    const htmlResult = extractScripts(html);
    allScripts.push(...htmlResult.scripts);

    const beforeResult = extractScripts(beforeHtml);
    allScripts.push(...beforeResult.scripts);

    const afterResult = extractScripts(afterHtml);
    allScripts.push(...afterResult.scripts);

    const { forms, scripts: formsFiltered } = extractHubspotForms(allScripts);
    const { meetings, scripts: meetingFiltered } = extractMeetings(formsFiltered, html);

    const scripts = filterScripts(meetingFiltered).map((script) => ({
      src: script.src ? stripQuery(script.src) : undefined,
      content: script.content || undefined,
    }));

    const headCss = (entry.headTags || [])
      .filter((tag) => tag.tag === 'link' && tag.href)
      .map((tag) => tag.href)
      .filter(shouldKeepCss)
      .map(stripQuery);

    const afterCss = extractLinks(afterHtml)
      .filter(shouldKeepCss)
      .map(stripQuery);

    const css = Array.from(new Set([...headCss, ...afterCss]));

    const structuredData = (entry.headTags || [])
      .filter((tag) => tag.tag === 'script' && tag.attributes?.type === 'application/ld+json')
      .map((tag) => tag.content)
      .filter(Boolean);

    const pageHtml = htmlResult.sanitized.trim();

    pages[pathname] = {
      path: pathname,
      title: entry.title || 'Patientli',
      description: entry.description || '',
      bodyClass: normalizeBodyClass(entry.bodyClass || ''),
      header: headerPath ? headerMap.get(headerPath) : null,
      footer: footerPath ? footerMap.get(footerPath) : null,
      html: pageHtml,
      css,
      structuredData,
      hubspotForms: forms,
      hubspotMeetings: meetings,
      scripts,
    };
  }

  await fs.writeFile(path.join(OUT_DIR, 'pages.json'), JSON.stringify(pages, null, 2));
  if (inlineCss.size) {
    await fs.writeFile(INLINE_CSS_PATH, Array.from(inlineCss).join('\n\n'));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

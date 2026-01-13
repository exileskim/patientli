import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const looksPath = path.join(root, 'src', 'content', 'looks.json');
const pagesPath = path.join(root, 'src', 'content', 'marketing', 'pages.json');

const looks = JSON.parse(fs.readFileSync(looksPath, 'utf8'));
const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));

const tabLabelToKey = {
  'Website on desktop': 'desktop',
  'Website on mobile': 'mobile',
  'Print materials': 'print',
  'Promotional products': 'promotional',
  'Social media content': 'social',
};

const tabRegex =
  /<button[^>]+class=\"e-n-tab-title[^\"]*\"[^>]+aria-controls=\"([^\"]+)\"[^>]*>[\s\S]*?<span class=\"e-n-tab-title-text\">([\s\S]*?)<\/span>/g;

const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

function normalizeLabel(label) {
  return label.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractElementHtml(html, elementId) {
  const idIndex = html.indexOf(`id=\"${elementId}\"`);
  if (idIndex === -1) return null;

  const tagStart = html.lastIndexOf('<', idIndex);
  if (tagStart === -1) return null;

  const tagMatch = html.slice(tagStart).match(/^<([a-zA-Z0-9-]+)/);
  if (!tagMatch) return null;

  const tagEnd = html.indexOf('>', tagStart);
  if (tagEnd === -1) return null;

  if (html[tagEnd - 1] === '/') {
    return html.slice(tagStart, tagEnd + 1);
  }

  let depth = 0;
  let index = tagStart;
  while (index < html.length) {
    const nextTag = html.indexOf('<', index);
    if (nextTag === -1) break;

    if (html.startsWith('<!--', nextTag)) {
      const commentEnd = html.indexOf('-->', nextTag + 4);
      index = commentEnd === -1 ? html.length : commentEnd + 3;
      continue;
    }

    const closing = html.startsWith('</', nextTag);
    const nameMatch = html.slice(nextTag + (closing ? 2 : 1)).match(/^([a-zA-Z0-9-]+)/);
    if (!nameMatch) {
      index = nextTag + 1;
      continue;
    }

    const name = nameMatch[1].toLowerCase();
    const end = html.indexOf('>', nextTag);
    if (end === -1) break;

    const isSelfClosing = html[end - 1] === '/' || voidElements.has(name);

    if (!closing && !isSelfClosing) {
      depth += 1;
    } else if (closing) {
      depth -= 1;
      if (depth === 0) {
        return html.slice(tagStart, end + 1);
      }
    }

    index = end + 1;
  }

  return null;
}

function extractTabImages(html) {
  tabRegex.lastIndex = 0;
  const tabs = [];
  let match;
  while ((match = tabRegex.exec(html))) {
    tabs.push({ id: match[1], label: normalizeLabel(match[2]) });
  }

  const contentMap = {};
  for (const tab of tabs) {
    const content = extractElementHtml(html, tab.id) ?? '';
    const images = Array.from(
      new Set(
        [...content.matchAll(/<img[^>]+src=\"([^\"]+)\"/g)].map((img) => img[1]),
      ),
    );
    contentMap[tab.id] = images;
  }

  const previews = {};
  for (const tab of tabs) {
    const key = tabLabelToKey[tab.label];
    if (!key) continue;
    previews[key] = contentMap[tab.id] ?? [];
  }

  return previews;
}

const updated = looks.map((look) => {
  const page = pages[`/looks/${look.slug}/`];
  if (!page || !page.html) {
    return look;
  }

  const previews = extractTabImages(page.html);
  if (Object.keys(previews).length === 0) {
    return look;
  }

  return {
    ...look,
    previews: {
      desktop: previews.desktop ?? [],
      mobile: previews.mobile ?? [],
      print: previews.print ?? [],
      promotional: previews.promotional ?? [],
      social: previews.social ?? [],
    },
  };
});

fs.writeFileSync(looksPath, `${JSON.stringify(updated, null, 2)}\n`);
console.log('Updated look previews.');

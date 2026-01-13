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

function normalizeLabel(label) {
  return label.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractTabImages(html) {
  const tabs = [];
  let match;
  while ((match = tabRegex.exec(html))) {
    tabs.push({ id: match[1], label: normalizeLabel(match[2]) });
  }

  const sections = html.split(/id=\"(e-n-tab-content-[^\"]+)\"/);
  const contentMap = {};
  for (let i = 1; i < sections.length; i += 2) {
    const id = sections[i];
    const content = sections[i + 1] ?? '';
    const images = Array.from(
      new Set(
        [...content.matchAll(/<img[^>]+src=\"([^\"]+)\"/g)].map((img) => img[1]),
      ),
    );
    contentMap[id] = images;
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

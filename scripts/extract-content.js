#!/usr/bin/env node
/**
 * Extract content from WordPress SQL backup
 * Parses the backup.sql file and generates JSON content files
 */

const fs = require('fs');
const path = require('path');

const BACKUP_PATH = '/Users/westin/Patientli-123025-backup/backup.sql';
const CONTENT_DIR = path.join(__dirname, '../src/content');

// Ensure content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Read the SQL file
console.log('Reading SQL backup...');
const sql = fs.readFileSync(BACKUP_PATH, 'utf8');

// Helper to decode HTML entities
function decodeHtmlEntities(text) {
  if (!text) return '';
  return text
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(num))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"');
}

// Helper to extract values from INSERT statement
function parseInsertValues(sql, tableName) {
  const regex = new RegExp(`INSERT INTO \`${tableName}\` VALUES \\((.+?)\\);`, 'gs');
  const matches = [];
  let match;

  // For wp_posts, look for the INSERT with multiple rows
  const insertMatch = sql.match(new RegExp(`INSERT INTO \`${tableName}\` VALUES (.+?);\\n`, 's'));

  if (!insertMatch) {
    console.log(`No INSERT found for ${tableName}`);
    return [];
  }

  // Split by '),(' to get individual rows
  const valuesStr = insertMatch[1];

  // This is a simplified parser - real SQL parsing would need to handle nested quotes
  const rows = [];
  let currentRow = '';
  let inQuote = false;
  let depth = 0;

  for (let i = 0; i < valuesStr.length; i++) {
    const char = valuesStr[i];
    const prevChar = i > 0 ? valuesStr[i - 1] : '';

    if (char === "'" && prevChar !== '\\') {
      inQuote = !inQuote;
    }

    if (!inQuote) {
      if (char === '(') depth++;
      if (char === ')') depth--;

      if (depth === 0 && char === ')') {
        if (currentRow) {
          rows.push(currentRow);
        }
        currentRow = '';
        continue;
      }

      if (depth === 0 && char === '(') {
        continue;
      }
    }

    if (depth > 0 || inQuote) {
      currentRow += char;
    }
  }

  return rows;
}

// Parse a single row of values
function parseRow(row) {
  const values = [];
  let current = '';
  let inQuote = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const prevChar = i > 0 ? row[i - 1] : '';

    if (char === "'" && prevChar !== '\\') {
      inQuote = !inQuote;
      continue;
    }

    if (char === ',' && !inQuote) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  if (current) {
    values.push(current.trim());
  }

  return values;
}

// Extract posts data
function extractPosts(sql) {
  console.log('Extracting posts...');

  const posts = [];

  // Find all post data in a more reliable way
  // Look for patterns like (ID,'author','date',...,'post_type',...)
  const postRegex = /\((\d+),\d+,'[^']*','[^']*','((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)','(\w+)','[^']*','[^']*','[^']*','([^']+)'/g;

  let match;
  while ((match = postRegex.exec(sql)) !== null) {
    const [, id, content, title, excerpt, status, slug] = match;

    // Find the post_type (it comes later in the row)
    const fullRowMatch = sql.substring(match.index).match(/\([^)]+,'(\w+)','[^']*',\d+\)/);

    posts.push({
      id,
      title: decodeHtmlEntities(title),
      content: decodeHtmlEntities(content),
      excerpt: decodeHtmlEntities(excerpt),
      status,
      slug: decodeHtmlEntities(slug),
    });
  }

  return posts;
}

// Extract specific post types from the raw SQL
function extractByPostType(sql, postType) {
  console.log(`Extracting ${postType}...`);

  const results = [];

  // Match pattern for published posts of this type
  // Format: (ID,author,'date','date_gmt','content','title','excerpt','status','comment','ping','pass','slug','to_ping','pinged','modified','modified_gmt','filtered',parent,'guid',menu_order,'post_type','mime',comment_count)

  const regex = new RegExp(
    `\\((\\d+),\\d+,'[^']*','[^']*','((?:[^'\\\\]|\\\\.)*)','((?:[^'\\\\]|\\\\.)*)','((?:[^'\\\\]|\\\\.)*)','(publish|draft)','[^']*','[^']*','[^']*','([^']+)','[^']*','[^']*','[^']*','[^']*','[^']*',\\d+,'[^']*',\\d+,'${postType}'`,
    'g'
  );

  let match;
  while ((match = regex.exec(sql)) !== null) {
    const [, id, content, title, excerpt, status, slug] = match;

    if (status === 'publish' && title && slug) {
      results.push({
        id,
        slug: decodeHtmlEntities(slug),
        title: decodeHtmlEntities(title),
        content: decodeHtmlEntities(content),
        excerpt: decodeHtmlEntities(excerpt),
        status,
      });
    }
  }

  return results;
}

// Extract products (Looks)
function extractProducts(sql) {
  const products = extractByPostType(sql, 'product');

  return products.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.content,
    shortDescription: p.excerpt || p.content.substring(0, 200),
    featuredImage: `/images/looks/${p.slug}.webp`,
    practiceTypes: ['General Dentistry'], // Default, would need postmeta
    tags: ['modern'], // Default, would need term relationships
    colors: {
      primary: '#103034',
      secondary: '#E6F2EF',
      accent: '#E8F59E',
      background: '#FFFFFF',
    },
    fonts: {
      heading: 'IvyPresto Display',
      body: 'Outfit',
    },
    previews: {
      desktop: `/images/looks/${p.slug}-desktop.webp`,
      mobile: `/images/looks/${p.slug}-mobile.webp`,
      print: [],
      promotional: [],
      social: [],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

// Extract services
function extractServices(sql) {
  const services = extractByPostType(sql, 'service');

  return services.map((s, index) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    description: s.content,
    shortDescription: s.excerpt || s.content.substring(0, 200),
    featuredImage: `/images/services/${s.slug}.webp`,
    plans: ['basic', 'starter', 'growth'],
    features: [],
    order: index,
  }));
}

// Extract resources
function extractResources(sql) {
  const resources = extractByPostType(sql, 'resource');

  return resources.map(r => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.content,
    excerpt: r.excerpt || r.content.substring(0, 200),
    featuredImage: `/images/resources/${r.slug}.webp`,
    type: 'guide',
    content: r.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

// Extract pages
function extractPages(sql) {
  const pages = extractByPostType(sql, 'page');

  return pages.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    content: p.content,
    excerpt: p.excerpt,
  }));
}

// Extract work/portfolio
function extractWork(sql) {
  const work = extractByPostType(sql, 'work');

  return work.map(w => ({
    id: w.id,
    slug: w.slug,
    title: w.title,
    description: w.content,
    shortDescription: w.excerpt || w.content.substring(0, 200),
    featuredImage: `/images/work/${w.slug}.webp`,
    images: [],
    client: '',
    services: [],
    createdAt: new Date().toISOString(),
  }));
}

// Main extraction
console.log('Starting content extraction...\n');

const products = extractProducts(sql);
console.log(`Found ${products.length} products (Looks)`);

const services = extractServices(sql);
console.log(`Found ${services.length} services`);

const resources = extractResources(sql);
console.log(`Found ${resources.length} resources`);

const pages = extractPages(sql);
console.log(`Found ${pages.length} pages`);

const work = extractWork(sql);
console.log(`Found ${work.length} work items`);

// Write JSON files
fs.writeFileSync(
  path.join(CONTENT_DIR, 'looks.json'),
  JSON.stringify(products, null, 2)
);
console.log('\nWrote looks.json');

fs.writeFileSync(
  path.join(CONTENT_DIR, 'services.json'),
  JSON.stringify(services, null, 2)
);
console.log('Wrote services.json');

fs.writeFileSync(
  path.join(CONTENT_DIR, 'resources.json'),
  JSON.stringify(resources, null, 2)
);
console.log('Wrote resources.json');

fs.writeFileSync(
  path.join(CONTENT_DIR, 'pages.json'),
  JSON.stringify(pages, null, 2)
);
console.log('Wrote pages.json');

fs.writeFileSync(
  path.join(CONTENT_DIR, 'work.json'),
  JSON.stringify(work, null, 2)
);
console.log('Wrote work.json');

// Create site settings
const siteSettings = {
  siteName: 'Patientli',
  siteDescription: 'Patientli helps healthcare practices connect with more patients and thrive with modern brands, websites and marketing strategies.',
  logo: {
    light: '/images/patientli-logo-light.svg',
    dark: '/images/patientli-logo-dark.svg',
  },
  navigation: [
    {
      label: 'Services',
      href: '/services',
      children: [
        { label: 'Brand Design', href: '/services/brand-design' },
        { label: 'Website Design', href: '/services/healthcare-website-design' },
        { label: 'Search Engine Optimization', href: '/services/search-engine-optimization' },
        { label: 'Content Marketing', href: '/services/content-marketing' },
        { label: 'Digital Advertising', href: '/services/digital-advertising-management' },
        { label: 'Review Management', href: '/services/review-and-reputation-management' },
        { label: 'Social Media', href: '/services/social-media-management' },
      ],
    },
    {
      label: 'Solutions',
      href: '/solutions',
      children: [
        { label: 'For Dental Practices', href: '/solutions/dental-practices' },
        { label: 'For Orthodontic Practices', href: '/solutions/orthodontic-practices' },
        { label: 'For Cosmetic Dentistry', href: '/solutions/cosmetic-dentistry-practices' },
        { label: 'For Chiropractic Practices', href: '/solutions/chiropractic-practices' },
        { label: 'For Dermatology', href: '/solutions/dermatology-practices' },
        { label: 'For Optometry', href: '/solutions/optometry-practices' },
        { label: 'For Plastic Surgery', href: '/solutions/plastic-surgery-practices' },
        { label: 'DSO Marketing Agency', href: '/solutions/dso-marketing-agency' },
      ],
    },
    {
      label: 'Resources',
      href: '/resources',
      children: [
        { label: 'All Resources', href: '/resources' },
        { label: 'E-Books', href: '/resources?type=e-book' },
        { label: 'Reports', href: '/resources?type=report' },
        { label: 'Templates', href: '/resources?type=template' },
      ],
    },
  ],
  footer: {
    about: 'Patientli helps doctors and dentists get more patients with our transparent, research-backed marketing approach.',
    sections: [
      {
        title: 'Services',
        links: [
          { label: 'Answer Engine Optimization', href: '/services/answer-engine-optimization' },
          { label: 'Brand Design', href: '/services/brand-design' },
          { label: 'Content Marketing', href: '/services/content-marketing' },
          { label: 'Digital Advertising Management', href: '/services/digital-advertising-management' },
          { label: 'Healthcare Website Design', href: '/services/healthcare-website-design' },
          { label: 'Review and Reputation Management', href: '/services/review-and-reputation-management' },
          { label: 'Search Engine Optimization', href: '/services/search-engine-optimization' },
          { label: 'Social Media Management', href: '/services/social-media-management' },
        ],
      },
      {
        title: 'Solutions',
        links: [
          { label: 'DSO Marketing Agency', href: '/solutions/dso-marketing-agency' },
          { label: 'For Chiropractic Practices', href: '/solutions/chiropractic-practices' },
          { label: 'For Cosmetic Dentistry Practices', href: '/solutions/cosmetic-dentistry-practices' },
          { label: 'For Dental Practices', href: '/solutions/dental-practices' },
          { label: 'For Dermatology Practices', href: '/solutions/dermatology-practices' },
          { label: 'For Optometry Practices', href: '/solutions/optometry-practices' },
          { label: 'For Orthodontic Practices', href: '/solutions/orthodontic-practices' },
          { label: 'For Plastic Surgery Practices', href: '/solutions/plastic-surgery-practices' },
          { label: 'Looks', href: '/looks' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'Resources', href: '/resources' },
          { label: 'Insights', href: '/insights' },
          { label: 'Partner Program', href: '/partner-program' },
          { label: 'Get a Demo', href: '/demo' },
          { label: 'Contact Us', href: '/contact' },
          { label: 'Legal', href: '/legal' },
        ],
      },
    ],
    copyright: `Copyright ${new Date().getFullYear()} Patientli. Made by Form + Function`,
  },
  social: [],
};

fs.writeFileSync(
  path.join(CONTENT_DIR, 'settings.json'),
  JSON.stringify(siteSettings, null, 2)
);
console.log('Wrote settings.json');

console.log('\n✅ Content extraction complete!');

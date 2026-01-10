import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const excludedSlugs = new Set(['basic', 'starter', 'growth', 'full-ai-visibility-report']);

function getRepoRoot() {
  return path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
}

async function main() {
  const looksPath = path.join(getRepoRoot(), 'src', 'content', 'looks.json');
  const looksRaw = fs.readFileSync(looksPath, 'utf8');
  const looks = JSON.parse(looksRaw);

  const looksToSeed = looks.filter((look) => !excludedSlugs.has(look.slug));

  for (const look of looksToSeed) {
    const seededLook = await prisma.look.upsert({
      where: { slug: look.slug },
      update: { title: look.title },
      create: { slug: look.slug, title: look.title },
    });

    const baseTokens = {
      color: {
        primary: look.colors?.primary,
        accent: look.colors?.accent,
        bg: look.colors?.background,
        surface: look.colors?.secondary,
      },
      typography: {
        headingFamily: look.fonts?.heading,
        bodyFamily: look.fonts?.body,
      },
    };

    await prisma.lookVersion.upsert({
      where: { lookId_version: { lookId: seededLook.id, version: 1 } },
      update: {
        status: 'PUBLISHED',
        tokenSchemaVersion: 1,
        baseTokens,
        templateManifest: {},
        contentPackManifest: {},
      },
      create: {
        lookId: seededLook.id,
        version: 1,
        status: 'PUBLISHED',
        tokenSchemaVersion: 1,
        baseTokens,
        templateManifest: {},
        contentPackManifest: {},
      },
    });
  }

  console.log(`Seeded ${looksToSeed.length} Looks`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

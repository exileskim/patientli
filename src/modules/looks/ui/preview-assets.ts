const heroImageBySlug: Record<string, string> = {
  'align-chiropractics':
    '/marketing/assets/uploads/2025/04/patientli-solutions-page-chiropractic-marketing-company-hero.webp',
  'balance-chiropractic':
    '/marketing/assets/uploads/2025/04/patientli-solutions-page-chiropractic-marketing-company-hero-2.webp',
  'soho-orthodontics':
    '/marketing/assets/uploads/2025/04/patientli-solutions-page-orthodontic-marketing-company-hero_2.webp',
  illume: '/marketing/assets/uploads/2025/04/patientli-solutions-page-orthodontic-marketing-company-hero_2.webp',
};

export const defaultHeroImage =
  '/marketing/assets/uploads/2025/04/patientli-solutions-page-general-dental-marketing-hero.webp';

export function heroImageForLookSlug(slug: string) {
  return heroImageBySlug[slug] ?? defaultHeroImage;
}


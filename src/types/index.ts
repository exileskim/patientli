// Content Types for Patientli

export interface Look {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  practiceTypes: string[];
  tags: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  featuredImage: string;
  plans: ('basic' | 'starter' | 'growth')[];
  features: string[];
  order: number;
}

export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  featuredImage: string;
  type: 'e-book' | 'report' | 'template' | 'guide';
  content: string;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Work {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  featuredImage: string;
  images: string[];
  client: string;
  services: string[];
  results?: {
    metric: string;
    value: string;
  }[];
  createdAt: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  template?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo: {
    light: string;
    dark: string;
  };
  navigation: NavItem[];
  footer: {
    about: string;
    sections: FooterSection[];
    copyright: string;
  };
  social: {
    platform: string;
    url: string;
  }[];
}

// Filter types for archive pages
export interface LookFilters {
  practiceType?: string;
  tags?: string[];
}

export interface ServiceFilters {
  plan?: 'basic' | 'starter' | 'growth';
}

export interface ResourceFilters {
  type?: 'e-book' | 'report' | 'template' | 'guide';
}

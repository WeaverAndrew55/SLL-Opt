// types/sanity.d.ts
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface Slug {
  _type: 'slug';
  current: string;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _type: 'reference';
    _ref: string;
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface SanityImageWithUrl extends Omit<SanityImage, 'asset'> {
  url: string;
  width?: number;
  height?: number;
}

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  openGraphImage?: SanityImageWithUrl;
  keywords?: string[];
}

export interface Link {
  _key?: string;
  _type?: 'link';
  title: string;
  href: string;
  isExternal?: boolean;
}

export interface PageBase extends SanityDocument {
  title: string;
  slug: Slug;
  seo?: SEO;
}

// types/pages.d.ts
import { SanityDocument, PageBase, SanityImageWithUrl, Link } from './sanity';

// Hero Section
export interface HeroSection {
  _type: 'heroSection';
  _key: string;
  heading: string;
  subheading?: string;
  backgroundImage?: SanityImageWithUrl;
  cta?: Link;
}

// Features Section
export interface Feature {
  _key: string;
  title: string;
  description: string;
  icon?: string;
  image?: SanityImageWithUrl;
  link?: Link;
}

export interface FeaturesSection {
  _type: 'featuresSection';
  _key: string;
  heading: string;
  subheading?: string;
  features: Feature[];
  layout: 'grid' | 'list';
}

// Testimonial Section
export interface Testimonial {
  _key: string;
  quote: string;
  author: string;
  position?: string;
  company?: string;
  avatar?: SanityImageWithUrl;
}

export interface TestimonialsSection {
  _type: 'testimonialsSection';
  _key: string;
  heading: string;
  subheading?: string;
  testimonials: Testimonial[];
}

// CTA Section
export interface CTASection {
  _type: 'ctaSection';
  _key: string;
  heading: string;
  subheading?: string;
  backgroundImage?: SanityImageWithUrl;
  primaryCTA?: Link;
  secondaryCTA?: Link;
  alignment?: 'left' | 'center' | 'right';
}

// Contact Section
export interface ServiceOption {
  _key: string;
  label: string;
  value: string;
}

export interface ContactSection {
  _type: 'contactSection';
  _key: string;
  title?: string;
  subtitle?: string;
  services?: ServiceOption[];
  submitEndpoint?: string;
  successMessage?: string;
}

// Home Page
export interface HomePage extends PageBase {
  sections: (HeroSection | FeaturesSection | TestimonialsSection | CTASection | ContactSection)[];
}

// Generic Page
export interface GenericPage extends PageBase {
  sections: (HeroSection | FeaturesSection | TestimonialsSection | CTASection | ContactSection)[];
}

// Navigation types
export interface Navigation {
  _key: string;
  title: string;
  href: string;
  isExternal?: boolean;
}

export interface SiteSettings extends SanityDocument {
  siteName: string;
  mainNavigation: Navigation[];
  footerNavigation?: Navigation[];
  logo: SanityImageWithUrl;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

// Contact submission type
export interface ContactSubmission extends SanityDocument {
  name: string;
  email: string;
  phone?: string;
  message: string;
  service?: string;
  submittedAt: string;
}

// types/sanity.ts
export interface SiteSettings {
  siteName?: string;
  title?: string;
  description?: string;
  logo?: {
    url: string;
    alt?: string;
  };
  socialLinks?: Array<{
    platform?: string;
    url: string;
    title?: string;
  }>;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
  };
  businessHours?: Array<{
    days: string[];
    opens: string;
    closes: string;
  }>;
}

export interface Article {
  _id: string;
  _updatedAt?: string;
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  excerpt?: string;
  mainImage?: {
    url: string;
    alt?: string;
  };
  author?: {
    name: string;
    slug?: {
      current: string;
    };
    image?: {
      url: string;
    };
  };
  categories?: Array<{
    title: string;
    slug?: {
      current: string;
    };
  }>;
  body?: any; // Could be more specific depending on your content structure
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

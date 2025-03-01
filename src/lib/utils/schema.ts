// lib/utils/schema.ts
import { SiteSettings, Article, BreadcrumbItem } from '@/types/sanity';

// Base URL of the website
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sociallalunchlabs.com';

// Default logo path
const DEFAULT_LOGO = `${siteUrl}/images/logo.png`;

/**
 * Generates the organization schema for JSON-LD
 */
export function generateOrganizationSchema(siteSettings?: SiteSettings) {
  const logo = siteSettings?.logo?.url || DEFAULT_LOGO;
  const socialProfiles = siteSettings?.socialLinks?.map(link => link.url) || [];
  const contactEmail = siteSettings?.contactInfo?.email || 'contact@sociallalunchlabs.com';
  const contactPhone = siteSettings?.contactInfo?.phone || '+1-123-456-7890';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteSettings?.siteName || 'Social Launch Labs',
    url: siteUrl,
    logo,
    sameAs: socialProfiles,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: contactPhone,
        contactType: 'customer service',
        email: contactEmail
      }
    ]
  };
}

/**
 * Generates the website schema for JSON-LD
 */
export function generateWebsiteSchema(siteSettings?: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteSettings?.siteName || 'Social Launch Labs',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * Generates the breadcrumb schema for JSON-LD
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`
    }))
  };
}

/**
 * Generates the article schema for blog posts
 */
export function generateArticleSchema(article: Article) {
  if (!article) return null;
  
  const authorUrl = article.author?.slug?.current 
    ? `${siteUrl}/team/${article.author.slug.current}` 
    : `${siteUrl}/about`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.mainImage?.url ? [article.mainImage.url] : undefined,
    datePublished: article.publishedAt,
    dateModified: article._updatedAt || article.publishedAt,
    author: article.author ? {
      '@type': 'Person',
      name: article.author.name,
      url: authorUrl
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Social Launch Labs',
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_LOGO
      }
    },
    description: article.excerpt || '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${article.slug.current}`
    }
  };
}

/**
 * Generates a LocalBusiness schema if applicable
 */
export function generateLocalBusinessSchema(siteSettings?: SiteSettings) {
  const address = siteSettings?.contactInfo?.address;
  const coordinates = siteSettings?.contactInfo?.coordinates;
  const businessHours = siteSettings?.businessHours || [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00'
    }
  ];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteSettings?.siteName || 'Social Launch Labs',
    image: siteSettings?.logo?.url || DEFAULT_LOGO,
    '@id': siteUrl,
    url: siteUrl,
    telephone: siteSettings?.contactInfo?.phone || '+1-123-456-7890',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address?.street || '123 Main St',
      addressLocality: address?.city || 'City',
      addressRegion: address?.state || 'State',
      postalCode: address?.postalCode || '12345',
      addressCountry: address?.country || 'US'
    },
    geo: coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: coordinates.latitude || 40.7128,
      longitude: coordinates.longitude || -74.0060
    } : undefined,
    openingHoursSpecification: businessHours.map(hours => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.days,
      opens: hours.opens,
      closes: hours.closes
    })),
    sameAs: siteSettings?.socialLinks?.map(link => link.url) || []
  };
}

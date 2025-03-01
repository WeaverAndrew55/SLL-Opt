// lib/utils/schema.ts
import { SiteSettings } from '@/types/sanity';

// Base URL of the website
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sociallalunchlabs.com';

/**
 * Generates the organization schema for JSON-LD
 */
export function generateOrganizationSchema(siteSettings: SiteSettings) {
  // Get the company logo URL from site settings
  const logo = siteSettings?.logo?.url || `${siteUrl}/images/logo.png`;
  
  // Get the company social media profiles
  const socialProfiles = siteSettings?.socialLinks?.map(link => link.url) || [];
  
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
        telephone: '+1-123-456-7890', // Replace with actual phone number from settings
        contactType: 'customer service',
        email: 'contact@sociallalunchlabs.com' // Replace with actual email from settings
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
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Generates the article schema for blog posts
 */
export function generateArticleSchema(article: any) {
  if (!article) return null;
  
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
      url: `${siteUrl}/about` // Or a specific author page if available
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Social Launch Labs',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png` // Replace with actual logo URL
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
  // This is optional and only needed if the business has a physical location
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteSettings?.siteName || 'Social Launch Labs',
    image: siteSettings?.logo?.url || `${siteUrl}/images/logo.png`,
    '@id': siteUrl,
    url: siteUrl,
    telephone: '+1-123-456-7890', // Replace with actual phone number
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main St', // Replace with actual address
      addressLocality: 'City', // Replace with actual city
      addressRegion: 'State', // Replace with actual state
      postalCode: '12345', // Replace with actual postal code
      addressCountry: 'US' // Replace with actual country code
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.7128, // Replace with actual latitude
      longitude: -74.0060 // Replace with actual longitude
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday'
        ],
        opens: '09:00',
        closes: '17:00'
      }
    ],
    sameAs: siteSettings?.socialLinks?.map(link => link.url) || []
  };
}

// components/global/SchemaOrg.tsx
import { SiteSettings } from '@/types/sanity';
import Script from 'next/script';
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateLocalBusinessSchema
} from '@/lib/utils/schema';

interface SchemaOrgProps {
  siteSettings?: SiteSettings;
  breadcrumbs?: Array<{ name: string; url: string }>;
  article?: any; // For blog posts
  type?: 'organization' | 'website' | 'breadcrumbs' | 'article' | 'localbusiness' | 'all';
}

/**
 * Component for adding structured data to pages
 */
export default function SchemaOrg({
  siteSettings,
  breadcrumbs,
  article,
  type = 'all'
}: SchemaOrgProps) {
  // Generate the appropriate schema based on the type
  const schemas = [];
  
  if (type === 'all' || type === 'organization') {
    schemas.push(generateOrganizationSchema(siteSettings));
  }
  
  if (type === 'all' || type === 'website') {
    schemas.push(generateWebsiteSchema(siteSettings));
  }
  
  if ((type === 'all' || type === 'breadcrumbs') && breadcrumbs?.length) {
    schemas.push(generateBreadcrumbSchema(breadcrumbs));
  }
  
  if ((type === 'all' || type === 'article') && article) {
    const articleSchema = generateArticleSchema(article);
    if (articleSchema) {
      schemas.push(articleSchema);
    }
  }
  
  if (type === 'localbusiness') {
    schemas.push(generateLocalBusinessSchema(siteSettings));
  }
  
  // If no schemas, don't render anything
  if (schemas.length === 0) {
    return null;
  }
  
  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}

// Usage example in layout.tsx:
// import SchemaOrg from '@/components/global/SchemaOrg';
// ...
// <head>
//   <SchemaOrg siteSettings={siteSettings} />
// </head>

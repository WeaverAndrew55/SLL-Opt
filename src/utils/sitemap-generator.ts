// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getClient } from '@/lib/sanity/client';

/**
 * Generates a sitemap.xml file for the website
 * @returns Sitemap configuration
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    'https://www.sociallalunchlabs.com';
  
  // Fetch all pages from Sanity
  const pages = await getClient().fetch(`
    *[_type == "page" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }
  `);
  
  // Convert pages to sitemap entries
  const pageEntries = pages.map((page: any) => ({
    url: `${baseUrl}/${page.slug === 'home' ? '' : page.slug}`,
    lastModified: page._updatedAt,
    changeFrequency: 'weekly' as const,
    priority: page.slug === 'home' ? 1.0 : 0.8,
  }));
  
  // Add static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    // Add any other static routes not managed in Sanity
  ];
  
  return [...staticRoutes, ...pageEntries];
}

// app/robots.ts
import { MetadataRoute } from 'next';

/**
 * Generates a robots.txt file for the website
 * @returns Robots.txt configuration
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    'https://www.sociallalunchlabs.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

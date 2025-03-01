// components/global/SEO.tsx
import { Metadata } from 'next';
import { SanityDocument } from '@/types/sanity';

interface SEOProps {
  title?: string;
  description?: string;
  openGraphImage?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  keywords?: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
}

/**
 * Helper function to generate metadata for pages based on Sanity content
 * @param page - The page document from Sanity
 * @param baseTitle - Optional base title for the site
 * @returns Metadata object for use with generateMetadata
 */
export function generateSEO(
  page: SanityDocument & { 
    title?: string;
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      openGraphImage?: {
        url: string;
        alt?: string;
      };
      keywords?: string[];
    };
  }, 
  baseTitle = 'Social Launch Labs'
): Metadata {
  const title = page?.seo?.metaTitle || page?.title || '';
  const description = page?.seo?.metaDescription || '';
  
  const metadata: Metadata = {
    title: title ? `${title} | ${baseTitle}` : baseTitle,
    description,
  };
  
  // Open Graph image
  if (page?.seo?.openGraphImage?.url) {
    metadata.openGraph = {
      images: [
        {
          url: page.seo.openGraphImage.url,
          width: 1200,
          height: 630,
          alt: page.seo.openGraphImage.alt || title,
        },
      ],
    };
  }
  
  // Keywords
  if (page?.seo?.keywords?.length) {
    metadata.keywords = page.seo.keywords;
  }
  
  return metadata;
}

/**
 * Configure SEO properties for a specific page or component
 * This can be used in client components where Metadata cannot be used directly
 */
export function configureSEO({
  title,
  description,
  openGraphImage,
  keywords,
  canonicalUrl,
  noIndex,
}: SEOProps) {
  // Update document title
  if (title && typeof document !== 'undefined') {
    document.title = title;
  }
  
  // Create or update meta description
  if (description && typeof document !== 'undefined') {
    let metaDescription = document.querySelector('meta[name="description"]');
    
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    
    metaDescription.setAttribute('content', description);
  }
  
  // Add canonical URL
  if (canonicalUrl && typeof document !== 'undefined') {
    let canonical = document.querySelector('link[rel="canonical"]');
    
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    
    canonical.setAttribute('href', canonicalUrl);
  }
  
  // Handle noindex
  if (noIndex && typeof document !== 'undefined') {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    
    robotsMeta.setAttribute('content', 'noindex, nofollow');
  }
}

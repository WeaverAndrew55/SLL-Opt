// components/global/SchemaOrg.tsx
import Script from 'next/script';
import { useMemo } from 'react';
import { SiteSettings, Article, BreadcrumbItem } from '@/types/sanity';
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateLocalBusinessSchema
} from '@/lib/utils/schema';

type SchemaType = 'organization' | 'website' | 'breadcrumbs' | 'article' | 'localbusiness' | 'all';

interface SchemaOrgProps {
  siteSettings?: SiteSettings;
  breadcrumbs?: BreadcrumbItem[];
  article?: Article;
  type?: SchemaType;
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
  // Use memoization to prevent unnecessary recalculations
  const schemaJson = useMemo(() => {
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
    
    if (type === 'all' || type === 'localbusiness') {
      schemas.push(generateLocalBusinessSchema(siteSettings));
    }
    
    return schemas.length > 0 ? JSON.stringify(schemas) : null;
  }, [siteSettings, breadcrumbs, article, type]);
  
  // If no schema data, don't render anything
  if (!schemaJson) {
    return null;
  }
  
  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaJson }}
      strategy="afterInteractive"
    />
  );
}

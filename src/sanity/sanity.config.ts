// sanity.config.ts
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import { deskStructure } from './sanity/desk/deskStructure';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'social-launch-labs',
  title: 'Social Launch Labs',
  
  projectId,
  dataset,
  
  plugins: [
    deskTool({
      structure: deskStructure,
    }),
    visionTool(),
  ],
  
  schema: {
    types: schemaTypes,
  },
  
  basePath: '/studio',
});

// sanity.cli.ts
import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
});

// sanity/desk/deskStructure.ts
import { StructureBuilder } from 'sanity/desk';
import { CogIcon, FileTextIcon, HomeIcon, SettingsIcon, MailIcon } from '@sanity/icons';

export const deskStructure = (S: StructureBuilder) => {
  return S.list()
    .title('Content')
    .items([
      // Singleton for site settings
      S.listItem()
        .title('Site Settings')
        .icon(SettingsIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      
      // Home page as a singleton
      S.listItem()
        .title('Home Page')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('page')
            .documentId('home')
            .title('Home Page')
        ),
      
      // Regular pages
      S.listItem()
        .title('Pages')
        .icon(FileTextIcon)
        .child(
          S.documentTypeList('page')
            .title('Pages')
            // Filter out the home page since it's a singleton
            .filter('_id != "home"')
        ),
      
      // Contact submissions
      S.listItem()
        .title('Contact Submissions')
        .icon(MailIcon)
        .child(
          S.documentTypeList('contactSubmission')
            .title('Contact Submissions')
        ),
      
      // Add a divider
      S.divider(),
      
      // All other document types
      ...S.documentTypeListItems().filter(
        listItem => !['siteSettings', 'page', 'contactSubmission'].includes(listItem.getId() as string)
      ),
    ]);
};

// sanity/lib/client.ts
// This is used within Sanity Studio
import { createClient } from 'next-sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // We're running this on the server, so we want to always fetch the latest
});

// sanity/lib/image.ts
// For use within Sanity Studio
import createImageUrlBuilder from '@sanity/image-url';
import { client } from './client';

const imageBuilder = createImageUrlBuilder(client);

export const urlForImage = (source) => {
  if (!source || !source.asset) {
    return null;
  }
  
  return imageBuilder.image(source);
};

// Default preview component for images
export const imagePreviewConfig = {
  select: {
    imageUrl: 'asset.url',
    dimensions: 'asset.metadata.dimensions',
    alt: 'alt',
  },
  prepare({ imageUrl, dimensions, alt }) {
    return {
      title: alt || 'Image',
      subtitle: dimensions 
        ? `${dimensions.width}×${dimensions.height}` 
        : 'Unknown dimensions',
      media: imageUrl ? { asset: { _ref: imageUrl } } : undefined,
    };
  },
};

// sanity/lib/helpers.ts
// Sanity studio helper functions
import { Rule } from 'sanity';

/**
 * Helper function to create validation that requires exactly one of several fields
 */
export function requireExactlyOne(fields: string[]) {
  return (rule: Rule) =>
    rule.custom((value, context) => {
      const doc = context.document;
      const filledFields = fields.filter(field => doc[field]);
      
      if (filledFields.length !== 1) {
        return `Please fill exactly one of: ${fields.join(', ')}`;
      }
      
      return true;
    });
}

/**
 * Creates a validation rule that requires a field if another field exists
 */
export function requiredIfField(field: string, message = `Required because ${field} is set`) {
  return (rule: Rule) =>
    rule.custom((value, context) => {
      // If the dependent field has a value but this field doesn't
      if (context.document[field] && !value) {
        return message;
      }
      return true;
    });
}

/**
 * Formats a string for use in preview titles (truncates, capitalizes, etc.)
 */
export function formatPreviewTitle(str: string, maxLength = 50) {
  if (!str) return 'Untitled';
  
  // Truncate if too long
  const truncated = str.length > maxLength
    ? str.substring(0, maxLength) + '...'
    : str;
    
  return truncated;
}

// app/studio/[[...index]]/page.tsx
// This is the App Router route for the Sanity Studio
'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}

// app/api/revalidate/route.ts
// Webhook endpoint to revalidate pages when content changes
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// Secret token to validate the webhook request
const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check for secret
    const secret = request.headers.get('x-webhook-secret');
    if (secret !== SANITY_REVALIDATE_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Invalid secret' },
        { status: 401 }
      );
    }
    
    // Check which document was updated
    const { _id, _type } = body;
    
    // Revalidate specific paths based on the document type
    if (_type === 'page') {
      // If it's the home page
      if (_id === 'home') {
        revalidatePath('/');
      } else {
        // For other pages, revalidate their specific path and the homepage
        const slug = body.slug?.current;
        if (slug) {
          revalidatePath(`/${slug}`);
        }
        revalidatePath('/');
      }
    } else if (_type === 'siteSettings') {
      // Revalidate all pages if site settings are updated
      revalidatePath('/', 'layout');
    }
    
    return NextResponse.json({ success: true, revalidated: true });
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json(
      { success: false, message: 'Error revalidating' },
      { status: 500 }
    );
  }
}

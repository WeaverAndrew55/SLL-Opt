// sanity/plugins/customLogo.tsx
import React from 'react';
import { definePlugin } from 'sanity';

/**
 * Plugin to customize the logo in the Sanity Studio
 */
export const customLogo = definePlugin({
  name: 'custom-logo',
  studio: {
    components: {
      logo: () => (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          fontSize: '1.25rem',
          fontWeight: 'bold',
          gap: '0.5rem'
        }}>
          {/* You can replace this with an actual image import */}
          <div style={{ 
            background: '#0ea5e9', 
            color: 'white', 
            width: '32px', 
            height: '32px', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            SL
          </div>
          Social Launch Labs
        </div>
      )
    }
  }
});

// sanity/plugins/previewPane.tsx
import React from 'react';
import { definePlugin } from 'sanity';
import { DefaultDocumentNodeResolver } from 'sanity/desk';
import Iframe from 'sanity-plugin-iframe-pane';

/**
 * Creates a preview URL for the document
 */
function getPreviewUrl(doc: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const previewSecret = process.env.SANITY_PREVIEW_SECRET;
  const sanityToken = process.env.SANITY_API_READ_TOKEN;
  
  if (!previewSecret || !sanityToken) {
    console.warn('Preview secrets not configured');
    return null;
  }
  
  const params = new URLSearchParams({
    secret: previewSecret,
    'sanity-token': sanityToken
  });
  
  // For pages, include the slug
  if (doc._type === 'page') {
    const slug = doc.slug?.current;
    if (slug) {
      params.set('slug', slug);
    }
  }
  
  return `${baseUrl}/api/preview?${params}`;
}

export const previewPane: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  // Only add preview pane for page documents
  if (schemaType === 'page') {
    return S.document().views([
      // Default form view
      S.view.form(),
      
      // Preview pane
      S.view
        .component(Iframe)
        .options({
          url: (doc: any) => getPreviewUrl(doc),
          reload: {
            button: true,
            revision: true,
          },
          attributes: {
            allow: 'fullscreen',
            height: '100%',
            width: '100%',
            style: { height: '100%' }
          }
        })
        .title('Preview')
    ]);
  }
  
  // For other document types, just return the default form view
  return S.document().views([S.view.form()]);
};

// sanity/plugins/media.ts
import { definePlugin } from 'sanity';

/**
 * Plugin to configure media handling in Sanity Studio
 */
export const mediaPlugin = definePlugin({
  name: 'media-plugin',
  document: {
    // Custom asset sources could be added here
  },
  form: {
    // Custom file input and image components could be configured here
    image: {
      // Example of adding image metadata like alt text by default
      assetSources: (previousAssetSources) => previousAssetSources,
      directUploads: true,
    },
    file: {
      directUploads: true,
    },
  },
});

// Updated sanity.config.ts to include plugins
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { media } from 'sanity-plugin-media';
import { schemaTypes } from './sanity/schemas';
import { deskStructure } from './sanity/desk/deskStructure';
import { customLogo } from './sanity/plugins/customLogo';
import { previewPane } from './sanity/plugins/previewPane';
import { mediaPlugin } from './sanity/plugins/media';

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
      // Add the preview pane
      defaultDocumentNode: previewPane,
    }),
    // Add Vision tool for GROQ playground
    visionTool(),
    // Add custom logo
    customLogo(),
    // Add media library
    media(),
    // Add media plugin
    mediaPlugin(),
  ],
  
  schema: {
    types: schemaTypes,
  },
  
  document: {
    // New document actions
    actions: (prev, context) => {
      // For example, removing delete action from singletons
      if (
        context.schemaType === 'siteSettings' || 
        (context.schemaType === 'page' && context.documentId === 'home')
      ) {
        return prev.filter(({ action }) => action !== 'delete');
      }
      return prev;
    },
  },
  
  form: {
    // Custom form components
    components: {
      // You could add custom form components here
    },
  },
  
  studio: {
    components: {
      // The logo component is already handled by the customLogo plugin
    },
  },
  
  basePath: '/studio',
});

// sanity/components/ConditionalField.tsx
// A custom component for conditional field display
import React from 'react';
import { StringInputProps } from 'sanity';

interface ConditionalFieldProps extends StringInputProps {
  condition: boolean;
  fallback?: React.ReactNode;
}

export function ConditionalField(props: ConditionalFieldProps) {
  const { condition, fallback = null, renderDefault } = props;
  
  if (!condition) {
    return fallback ? <>{fallback}</> : null;
  }
  
  return renderDefault(props);
}

// Example of how to use it in a schema:
/*
fields: [
  {
    name: 'showAdditionalField',
    title: 'Show Additional Field',
    type: 'boolean',
  },
  {
    name: 'additionalField',
    title: 'Additional Field',
    type: 'string',
    components: {
      input: (props) => ConditionalField({
        ...props,
        condition: props.parent?.showAdditionalField,
        fallback: <div style={{ padding: '1em' }}>Enable "Show Additional Field" to access this</div>
      })
    }
  }
]
*/

// sanity.config.ts
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { deskStructure } from './desk/deskStructure';

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
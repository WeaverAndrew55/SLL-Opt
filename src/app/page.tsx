/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path are handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { NextStudio } from 'next-sanity/studio'
import { defineConfig } from 'sanity'
import sanityConfig from '../sanity/config'  // Correct import path

const config = defineConfig(sanityConfig)

// Force static rendering for better performance with Studio
export const dynamic = 'force-static'

// Export metadata and viewport from next-sanity/studio
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
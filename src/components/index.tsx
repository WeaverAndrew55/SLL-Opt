// app/page.tsx
import { Metadata } from 'next';
import { getClient } from '@/lib/sanity/client';
import { pageBySlugQuery } from '@/lib/sanity/queries';
import { SectionRenderer } from '@/components/sections/SectionRenderer';

export const metadata: Metadata = {
  title: 'Social Launch Labs | Social Media Strategy Experts',
  description: 'We help businesses grow through data-driven social media strategies, content creation, and audience engagement.',
  keywords: ['social media', 'marketing', 'strategy', 'management', 'content creation', 'audience engagement'],
};

export default async function HomePage() {
  // Fetch home page data from Sanity
  const pageData = await getClient().fetch(pageBySlugQuery, { slug: 'home' });
  
  if (!pageData) {
    // If no data is found, return a basic page
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Welcome to Social Launch Labs</h1>
        <p>We're setting up our new website. Please check back soon!</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {pageData.sections?.map((section: any) => (
        <SectionRenderer key={section._key} section={section} />
      ))}
    </div>
  );
}

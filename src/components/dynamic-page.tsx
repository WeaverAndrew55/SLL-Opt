// app/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClient } from '@/lib/sanity/client';
import { pageBySlugQuery } from '@/lib/sanity/queries';
import { SectionRenderer } from '@/components/sections/SectionRenderer';

// Type for route parameters
type Props = {
  params: { slug: string };
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch the page data
  const page = await getClient().fetch(pageBySlugQuery, { slug: params.slug });
  
  if (!page) {
    return {};
  }
  
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
    openGraph: page.seo?.openGraphImage
      ? {
          images: [
            {
              url: page.seo.openGraphImage.url,
              width: 1200,
              height: 630,
              alt: page.seo.openGraphImage.alt || page.title,
            },
          ],
        }
      : undefined,
  };
}

// Generate static paths at build time
export async function generateStaticParams() {
  const pages = await getClient().fetch(
    `*[_type == "page" && defined(slug.current)][].slug.current`
  );
  
  return pages.map((slug: string) => ({
    slug,
  }));
}

// Dynamic page component
export default async function Page({ params }: Props) {
  // Fetch the page data
  const page = await getClient().fetch(pageBySlugQuery, { slug: params.slug });
  
  // If the page doesn't exist, show the 404 page
  if (!page) {
    notFound();
  }
  
  return (
    <div className="min-h-screen">
      {/* Render each section in the page */}
      {page.sections?.map((section: any) => (
        <SectionRenderer key={section._key} section={section} />
      ))}
    </div>
  );
}

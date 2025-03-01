// components/preview/PreviewProvider.tsx
'use client';

import { useMemo } from 'react';
import { LiveQueryProvider } from 'next-sanity/preview';
import { getClient } from '@/lib/sanity/client';

interface PreviewProviderProps {
  children: React.ReactNode;
  token: string | null;
}

/**
 * Preview provider component for enabling live previews
 */
export default function PreviewProvider({ children, token }: PreviewProviderProps) {
  const client = useMemo(() => {
    if (!token) {
      return null;
    }
    
    return getClient(true).withConfig({
      token,
      perspective: 'previewDrafts',
      stega: {
        enabled: true,
        studioUrl: '/studio',
      },
    });
  }, [token]);
  
  if (!client) {
    return <>{children}</>;
  }
  
  return (
    <LiveQueryProvider client={client}>
      {children}
    </LiveQueryProvider>
  );
}

// components/preview/PreviewWrapper.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import PreviewProvider from './PreviewProvider';

interface PreviewWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that sets up preview mode when the preview query param is present
 */
export default function PreviewWrapper({ children }: PreviewWrapperProps) {
  const searchParams = useSearchParams();
  const preview = searchParams.get('preview');
  const token = searchParams.get('sanity-token');
  
  // Only enable preview mode if both preview=true and token is present
  if (preview !== 'true' || !token) {
    return <>{children}</>;
  }
  
  return (
    <PreviewProvider token={token}>
      <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white py-2 text-center text-sm z-50">
        Preview Mode Active - <a href="/api/exit-preview" className="underline">Exit Preview</a>
      </div>
      {children}
    </PreviewProvider>
  );
}

// app/api/preview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';
import { getClient } from '@/lib/sanity/client';

// Sanity preview secret (should match the one in Sanity studio)
const SANITY_PREVIEW_SECRET = process.env.SANITY_PREVIEW_SECRET;

export async function GET(request: NextRequest) {
  // Check the secret token
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug') || '';
  const sanityToken = searchParams.get('sanity-token');
  
  // Check if the secret is valid
  if (secret !== SANITY_PREVIEW_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret token' },
      { status: 401 }
    );
  }
  
  // Check if we have a token for Sanity API
  if (!sanityToken) {
    return NextResponse.json(
      { message: 'Missing Sanity token' },
      { status: 401 }
    );
  }
  
  // Verify that the slug exists
  if (slug) {
    const client = getClient(true);
    client.config({ token: sanityToken as string });
    
    const doc = await client.fetch(
      `*[_type == "page" && slug.current == $slug][0]`,
      { slug }
    );
    
    if (!doc) {
      return NextResponse.json(
        { message: `No document found for slug: ${slug}` },
        { status: 404 }
      );
    }
  }
  
  // Enable draft mode
  draftMode().enable();
  
  // Redirect to the path specified by slug (or home if no slug)
  const redirectUrl = slug ? `/${slug}` : '/';
  const url = new URL(redirectUrl, request.url);
  url.searchParams.set('preview', 'true');
  url.searchParams.set('sanity-token', sanityToken);
  
  return NextResponse.redirect(url);
}

// app/api/exit-preview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

export function GET(request: NextRequest) {
  // Disable draft mode
  draftMode().disable();
  
  // Redirect to the path without preview parameters
  const { searchParams, pathname } = new URL(request.url);
  const redirectUrl = new URL(pathname, request.url);
  
  return NextResponse.redirect(redirectUrl);
}

// app/layout.tsx (modification to add preview wrapper)
// Note: This is a partial edit to be integrated into your existing layout.tsx

// Add this import
import PreviewWrapper from '@/components/preview/PreviewWrapper';

// Inside your layout component, wrap the children with PreviewWrapper
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans min-h-screen flex flex-col">
        <Header /* your props */ />
        <PreviewWrapper>
          <main className="flex-grow">{children}</main>
        </PreviewWrapper>
        <Footer /* your props */ />
      </body>
    </html>
  );
}

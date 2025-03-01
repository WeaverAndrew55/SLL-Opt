// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getClient } from '@/lib/sanity/client';
import { navigationQuery } from '@/lib/sanity/queries';
import Header from '@/components/global/Header';
import Footer from '@/components/global/Footer';

// Load Inter font with Latin subset
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Default metadata
export const metadata: Metadata = {
  title: {
    template: '%s | Social Launch Labs',
    default: 'Social Launch Labs - Social Media Strategy Experts',
  },
  description: 'Expert social media strategy and management to help your business grow online.',
  keywords: ['social media', 'marketing', 'strategy', 'management', 'growth'],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch navigation data
  const navData = await getClient().fetch(navigationQuery);

  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans min-h-screen flex flex-col">
        <Header 
          navigation={navData.mainNavigation || []} 
          logo={navData.logo || { url: '/images/logo.png', alt: 'Social Launch Labs' }}
        />
        <main className="flex-grow">
          {children}
        </main>
        <Footer 
          navigation={navData.mainNavigation || []}
          footerNavigation={navData.footerNavigation || []}
          siteName={navData.siteName || 'Social Launch Labs'}
          logo={navData.logo || { url: '/images/logo.png', alt: 'Social Launch Labs' }}
        />
      </body>
    </html>
  );
}

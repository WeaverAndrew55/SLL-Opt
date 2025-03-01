// app/layout.tsx
import type { Metadata } from 'next';
import '@/styles/global.css'; // Ensure global styles are applied
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Define metadata for SEO
export const metadata: Metadata = {
  title: 'Your Site Name - Enhance Your Digital Presence',
  description: 'Providing top-notch solutions for digital growth, social media marketing, and audience engagement.',
};

// Dummy navigation data (replace with dynamic content if needed)
const navigation = [
  { _key: '1', title: 'Home', href: '/' },
  { _key: '2', title: 'About', href: '/about' },
  { _key: '3', title: 'Services', href: '/services' },
  { _key: '4', title: 'Contact', href: '/contact' },
];

// Placeholder logo
const logo = {
  url: '/logo.png', // Update with actual logo URL
  alt: 'Company Logo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Your Site Name - Enhance Your Digital Presence</title>
      </head>
      <body className="bg-background text-foreground font-sans">
        <Header navigation={navigation} logo={logo} />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
        <Footer siteName="Your Site Name" />
      </body>
    </html>
  );
}
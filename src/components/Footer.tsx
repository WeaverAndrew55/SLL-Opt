// components/global/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube 
} from 'lucide-react';

interface NavItem {
  _key: string;
  title: string;
  href: string;
  isExternal?: boolean;
}

interface FooterProps {
  navigation?: NavItem[];
  footerNavigation?: NavItem[];
  siteName: string;
  logo?: {
    url: string;
    alt: string;
  };
  socialLinks?: {
    platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
    url: string;
  }[];
}

export default function Footer({ 
  navigation = [], 
  footerNavigation = [], 
  siteName,
  logo,
  socialLinks = [] 
}: FooterProps) {
  // Get the current year for copyright
  const currentYear = new Date().getFullYear();
  
  // Use footer navigation if available, otherwise use main navigation
  const footerLinks = footerNavigation.length > 0 ? footerNavigation : navigation;
  
  // Render social media icon based on platform
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook size={20} />;
      case 'twitter':
        return <Twitter size={20} />;
      case 'instagram':
        return <Instagram size={20} />;
      case 'linkedin':
        return <Linkedin size={20} />;
      case 'youtube':
        return <Youtube size={20} />;
      default:
        return null;
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-2">
            {logo && (
              <Link href="/" className="inline-block mb-4">
                <div className="relative h-10 w-40">
                  <Image
                    src={logo.url}
                    alt={logo.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 160px, 160px"
                  />
                </div>
              </Link>
            )}
            <p className="text-gray-400 mb-6 max-w-md">
              We help businesses grow through effective social media strategies, content creation, and audience engagement.
            </p>
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={`Follow us on ${link.platform}`}
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.slice(0, Math.ceil(footerLinks.length / 2)).map((item) => (
                <li key={item._key}>
                  <Link
                    href={item.href}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* More Links (if there are enough) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.slice(Math.ceil(footerLinks.length / 2)).map((item) => (
                <li key={item._key}>
                  <Link
                    href={item.href}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              
              {/* Add contact link if not already in navigation */}
              {!footerLinks.some(link => link.href === '/contact') && (
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center md:text-left">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

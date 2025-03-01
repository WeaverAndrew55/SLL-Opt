// components/global/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface NavItem {
  _key: string;
  title: string;
  href: string;
  isExternal?: boolean;
}

interface HeaderProps {
  navigation: NavItem[];
  logo: {
    url: string;
    alt: string;
  };
}

export default function Header({ navigation, logo }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);
  
  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <div className="relative h-10 w-40">
              <Image
                src={logo.url}
                alt={logo.alt}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 160px, 160px"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navigation.map((item) => (
                <li key={item._key}>
                  <Link
                    href={item.href}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      pathname === item.href
                        ? 'text-blue-600'
                        : isScrolled
                        ? 'text-gray-800'
                        : 'text-white'
                    }`}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden relative z-10"
            onClick={() => setIsMenuOpen
// components/sections/HeroSection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSectionProps {
  heading: string;
  subheading?: string;
  backgroundImage?: {
    url: string;
    width?: number;
    height?: number;
    alt: string;
  };
  cta?: {
    title: string;
    href: string;
    isExternal?: boolean;
  };
}

export function HeroSection({
  heading,
  subheading,
  backgroundImage,
  cta,
}: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Create intersection observer to detect when section is in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, stop observing
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the element is visible
        rootMargin: '0px 0px -100px 0px', // Slightly before the element comes into view
      }
    );

    // Start observing the section
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Clean up on unmount
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center pt-20"
      aria-labelledby="hero-heading"
    >
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" aria-hidden="true" />
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 z-10 relative">
        <div className="max-w-3xl">
          <h1
            id="hero-heading"
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            {heading}
          </h1>

          {subheading && (
            <p
              className={`text-xl md:text-2xl text-white/90 mb-8 transition-all duration-700 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              {subheading}
            </p>
          )}

          {cta && (
            <div
              className={`transition-all duration-700 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <Link
                href={cta.href}
                target={cta.isExternal ? '_blank' : undefined}
                rel={cta.isExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {cta.title}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

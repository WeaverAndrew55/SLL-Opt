// components/sections/CTASection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CTAProps {
  title: string;
  href: string;
  isExternal?: boolean;
  variant?: 'primary' | 'secondary';
}

interface CTASectionProps {
  heading: string;
  subheading?: string;
  primaryCTA?: CTAProps;
  secondaryCTA?: CTAProps;
  backgroundImage?: {
    url: string;
    alt: string;
  };
  alignment?: 'left' | 'center' | 'right';
}

export function CTASection({
  heading,
  subheading,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  alignment = 'center',
}: CTASectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Create intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Alignment classes
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-24"
      aria-labelledby="cta-heading"
    >
      {/* Background Image or Color */}
      {backgroundImage ? (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage.url}
              alt={backgroundImage.alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60" aria-hidden="true" />
          </div>
          <div className="relative z-10">
            <div className="container mx-auto px-4 md:px-6">
              <div className={`flex flex-col ${alignmentClasses[alignment]} max-w-3xl mx-auto`}>
                <h2 
                  id="cta-heading"
                  className={`text-3xl md:text-4xl font-bold text-white mb-4 transition-all duration-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {heading}
                </h2>
                
                {subheading && (
                  <p 
                    className={`text-lg text-white/90 mb-8 transition-all duration-700 delay-200 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                  >
                    {subheading}
                  </p>
                )}
                
                <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-400 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                  {primaryCTA && (
                    <Link
                      href={primaryCTA.href}
                      target={primaryCTA.isExternal ? '_blank' : undefined}
                      rel={primaryCTA.isExternal ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      {primaryCTA.title}
                    </Link>
                  )}
                  
                  {secondaryCTA && (
                    <Link
                      href={secondaryCTA.href}
                      target={secondaryCTA.isExternal ? '_blank' : undefined}
                      rel={secondaryCTA.isExternal ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      {secondaryCTA.title}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Colored background version
        <div className="bg-blue-600">
          <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
            <div className={`flex flex-col ${alignmentClasses[alignment]} max-w-3xl mx-auto`}>
              <h2 
                id="cta-heading"
                className={`text-3xl md:text-4xl font-bold text-white mb-4 transition-all duration-700 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                {heading}
              </h2>
              
              {subheading && (
                <p 
                  className={`text-lg text-white/90 mb-8 transition-all duration-700 delay-200 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {subheading}
                </p>
              )}
              
              <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                {primaryCTA && (
                  <Link
                    href={primaryCTA.href}
                    target={primaryCTA.isExternal ? '_blank' : undefined}
                    rel={primaryCTA.isExternal ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  >
                    {primaryCTA.title}
                  </Link>
                )}
                
                {secondaryCTA && (
                  <Link
                    href={secondaryCTA.href}
                    target={secondaryCTA.isExternal ? '_blank' : undefined}
                    rel={secondaryCTA.isExternal ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  >
                    {secondaryCTA.title}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

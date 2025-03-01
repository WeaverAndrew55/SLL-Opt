// components/sections/FeaturesSection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BarChart2, 
  Lightbulb, 
  MessageSquare, 
  PenTool, 
  TrendingUp, 
  Users,
  LayoutGrid,
  Share2,
  Target
} from 'lucide-react';

interface Feature {
  _key: string;
  title: string;
  description: string;
  icon?: string;
  image?: {
    url: string;
    alt: string;
  };
  link?: {
    title: string;
    href: string;
    isExternal?: boolean;
  };
}

interface FeaturesSectionProps {
  heading: string;
  subheading?: string;
  features: Feature[];
  layout?: 'grid' | 'list';
}

export function FeaturesSection({
  heading,
  subheading,
  features,
  layout = 'grid',
}: FeaturesSectionProps) {
  const [animatedItems, setAnimatedItems] = useState<Record<string, boolean>>({});
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Create intersection observer to detect when section is in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start staggered animation of features
          features.forEach((feature, index) => {
            setTimeout(() => {
              setAnimatedItems(prev => ({
                ...prev,
                [feature._key]: true
              }));
            }, 100 * (index + 1));
          });

          // Once animation starts, stop observing
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
  }, [features]);

  // Map icon string to Lucide icon component
  const getIconComponent = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'strategy':
      case 'lightbulb':
        return <Lightbulb className="h-8 w-8 text-blue-500" aria-hidden="true" />;
      case 'content':
      case 'pentool':
        return <PenTool className="h-8 w-8 text-blue-500" aria-hidden="true" />;
      case 'analytics':
      case 'chart':
        return <BarChart2 className="h-8 w-8 text-blue-500" aria-hidden="true" />;
      case 'engagement':
      case 'message':
        return <MessageSquare className="h-8 w-8 text-blue-500" aria-hidden="true" />;
      case 'growth':
      case 'trending':
        return <TrendingUp className="h-8 w-8 text-blue-500" aria-hidden="true" />;
      case 'audience':
      case 'users':
        return <Users className="h-8 w-8 text-blue-500" aria-hidden="true" />;
      case 'social':
      case 'share':
        return <Share2 className="h-8 w-8 text-blue-500" aria-hidden="true" />;
      case 'target':
      case 'goal':
        return <Target className="h-8 w-8 text-blue-500" aria-hidden="true" />;
      case 'grid':
      case 'layout':
        return <LayoutGrid className="h-8 w-8 text-blue-500" aria-hidden="true" />;
      default:
        return <Lightbulb className="h-8 w-8 text-blue-500" aria-hidden="true" />;
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 bg-gray-50"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          {subheading && (
            <p className="text-lg text-gray-600">{subheading}</p>
          )}
        </div>

        {/* Features Grid or List */}
        <div className={`
          ${layout === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
            : 'space-y-8'}
        `}>
          {features.map((feature) => (
            <div
              key={feature._key}
              className={`
                bg-white rounded-lg p-6 shadow-sm transition-all duration-500
                ${animatedItems[feature._key] 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'}
              `}
            >
              {/* Feature Icon/Image */}
              <div className="mb-4">
                {feature.image ? (
                  <div className="relative h-12 w-12">
                    <Image
                      src={feature.image.url}
                      alt={feature.image.alt || feature.title}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  getIconComponent(feature.icon)
                )}
              </div>

              {/* Feature Content */}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              
              {/* Optional Link */}
              {feature.link && (
                <Link
                  href={feature.link.href}
                  target={feature.link.isExternal ? '_blank' : undefined}
                  rel={feature.link.isExternal ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  {feature.link.title}
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

# Relume.io to Next.js + Sanity.io Migration Plan

## Project Overview

This migration plan outlines the step-by-step process for converting a Relume.io website export to a Next.js + Sanity.io project with TypeScript, responsive design, and performance optimizations.

### Source Repositories
1. Current Next.js + Sanity project: https://github.com/WeaverAndrew55/SLL-Test-2
2. HTML wireframes: https://github.com/WeaverAndrew55/social-launch-labs-website
3. React exports: https://github.com/WeaverAndrew55/Social-Launch-React

## Migration Framework

### Folder Structure
```

## API Routes for Form Handling

Let's implement the API route to handle form submissions:

```tsx
// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';

export async function POST(request: Request) {
  try {
    // Get the form data from the request
    const formData = await request.json();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Save the submission to Sanity
    await client.create({
      _type: 'contactSubmission',
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      message: formData.message,
      service: formData.service || null,
      submittedAt: new Date().toISOString(),
    });
    
    // You could also add email notification logic here
    // For example, using a service like SendGrid or Resend
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    
    return NextResponse.json(
      { success: false, message: 'An error occurred while submitting the form' },
      { status: 500 }
    );
  }
}
```

## Image Optimization and Responsive Design

Let's implement an optimized image component that supports responsive design:

```tsx
// components/ui/ResponsiveImage.tsx
import Image from 'next/image';
import { urlForImage } from '@/lib/sanity/client';
import { SanityImage } from '@/types/sanity';

interface ResponsiveImageProps {
  image: SanityImage;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  quality?: number;
}

export default function ResponsiveImage({
  image,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  fill = false,
  width,
  height,
  quality = 80,
}: ResponsiveImageProps) {
  if (!image?.asset?._ref) {
    return null;
  }

  const imageUrl = urlForImage(image)
    .auto('format')
    .quality(quality)
    .url();

  // Determine image dimensions
  let imageWidth = width;
  let imageHeight = height;

  if (!imageWidth && !imageHeight && image.asset.metadata?.dimensions) {
    imageWidth = image.asset.metadata.dimensions.width;
    imageHeight = image.asset.metadata.dimensions.height;
  }

  // Default alt text
  const altText = image.alt || 'Image';

  if (fill) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <Image
          src={imageUrl}
          alt={altText}
          fill
          sizes={sizes}
          className="object-cover"
          priority={priority}
        />
      </div>
    );
  }

  if (!imageWidth || !imageHeight) {
    return (
      <div className={`relative aspect-video ${className}`}>
        <Image
          src={imageUrl}
          alt={altText}
          fill
          sizes={sizes}
          className="object-cover"
          priority={priority}
        />
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={altText}
      width={imageWidth}
      height={imageHeight}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
```

## Animation and Interaction Utilities

Let's create utility functions for animations and interactions:

```tsx
// lib/utils/animations.ts

// Fade-in animation with optional delay
export function fadeInAnimation(isVisible: boolean, delay = 0) {
  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.5s ease-out, transform 0.5s ease-out ${delay}s`,
  };
}

// Stagger animation for lists
export function staggerAnimation(isVisible: boolean, index: number, baseDelay = 0.1) {
  const delay = baseDelay + index * 0.1;
  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`,
  };
}

// Intersection Observer hook for triggering animations on scroll
import { useState, useEffect, useRef } from 'react';

export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
      ...options,
    });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
}
```

## Performance Optimization Strategies

To ensure optimal performance, we'll implement the following strategies:

```tsx
// next.config.js
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
```

### Code Splitting

```tsx
// Lazy loading components example
import { lazy, Suspense } from 'react';

// Lazy load heavy components that aren't needed on initial render
const VideoPlayer = lazy(() => import('@/components/ui/VideoPlayer'));
const DataVisualizer = lazy(() => import('@/components/ui/DataVisualizer'));

export default function Page() {
  return (
    <div>
      {/* Critical content loads immediately */}
      <h1>Welcome to our site</h1>
      
      {/* Non-critical components are lazy loaded */}
      <Suspense fallback={<div>Loading video player...</div>}>
        <VideoPlayer videoId="abc123" />
      </Suspense>
      
      <Suspense fallback={<div>Loading data visualization...</div>}>
        <DataVisualizer data={someData} />
      </Suspense>
    </div>
  );
}
```

### Tailwind Optimization

```js
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Define your brand colors here
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... other shades
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      animation: {
        // Custom animations
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

## Accessibility Implementation

Let's ensure our components are accessible:

```tsx
// components/ui/Button.tsx
import { forwardRef } from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  href?: string;
  external?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isFullWidth = false,
      href,
      external,
      className = '',
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    // Variant styles
    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    };
    
    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    };
    
    // Combine all styles
    const buttonStyles = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${isFullWidth ? 'w-full' : ''}
      ${className}
    `;
    
    // Loading state
    const loadingIndicator = (
      <svg 
        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );
    
    // If has href, render as link
    if (href) {
      return (
        <Link
          href={href}
          className={buttonStyles}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {isLoading && loadingIndicator}
          {children}
        </Link>
      );
    }
    
    // Otherwise render as button
    return (
      <button
        ref={ref}
        className={buttonStyles}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && loadingIndicator}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
```

## Component Testing

Let's set up a basic testing structure for our components:

```tsx
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600'); // Primary variant
  });
  
  it('renders as a link when href is provided', () => {
    render(<Button href="/test">Go to test</Button>);
    
    const link = screen.getByRole('link', { name: /go to test/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });
  
  it('shows loading state when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toBeDisabled();
    
    // Check for loading spinner
    const spinner = document.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
  
  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Migration Process

Here's a step-by-step migration process for each page from Relume.io to Next.js + Sanity:

1. **Analysis Phase**
   - Identify all components and their dependencies
   - Determine which components need state management
   - Map out data structures for Sanity schema

2. **Infrastructure Setup**
   - Set up Next.js project with TypeScript and App Router
   - Configure Sanity.io and create schemas
   - Set up Tailwind CSS

3. **Component Migration**
   - Start with global components (Header, Footer)
   - Convert section components one by one
   - Create reusable UI components
   - Implement responsive design patterns

4. **Data Integration**
   - Create Sanity schemas for content types
   - Set up GROQ queries for data fetching
   - Connect components to Sanity data

5. **Interactivity Implementation**
   - Add state management for interactive components
   - Implement animations and transitions
   - Set up form handling and validation

6. **Optimization**
   - Optimize image loading
   - Implement code splitting
   - Add accessibility features
   - Optimize for performance

7. **Testing and Deployment**
   - Create test cases for components
   - Perform cross-browser testing
   - Set up CI/CD pipeline
   - Deploy to production

## Full Example of a Migrated Page

Here's an example of a complete migrated page:

```tsx
// app/page.tsx
import { Metadata } from 'next';
import { getClient } from '@/lib/sanity/client';
import { pageBySlugQuery } from '@/lib/sanity/queries';
import { SectionRenderer } from '@/components/sections/SectionRenderer';

export const metadata: Metadata = {
  title: 'Social Launch Labs | Social Media Strategy Experts',
  description: 'We help businesses grow through data-driven social media strategies and content creation.',
};

export default async function HomePage() {
  // Fetch home page data from Sanity
  const pageData = await getClient().fetch(pageBySlugQuery, { slug: 'home' });
  
  if (!pageData) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen">
      {pageData.sections?.map((section: any) => (
        <SectionRenderer key={section._key} section={section} />
      ))}
    </div>
  );
}
```

## Migration Checklist

Use this checklist to ensure all aspects of the migration are complete:

- [ ] Create TypeScript interfaces for all components and data structures
- [ ] Set up Sanity schemas that match the TypeScript interfaces
- [ ] Implement responsive design patterns using Tailwind CSS
- [ ] Add proper image optimization using Next.js Image component
- [ ] Ensure all interactive elements work properly (state management, animations)
- [ ] Implement form handling with validation
- [ ] Add accessibility features (aria attributes, keyboard navigation)
- [ ] Optimize for performance (code splitting, lazy loading)
- [ ] Add comprehensive testing
- [ ] Document the migration process and component usage

## Conclusion

This migration plan provides a comprehensive framework for converting your Relume.io website export to a Next.js + Sanity.io project. By following this structured approach, you'll create a more performant, maintainable, and feature-rich website with proper TypeScript integration, responsive design, and accessibility features.

The plan addresses all your requirements:
- Converting from React export to Next.js structure
- Creating proper TypeScript interfaces and types
- Implementing responsive design patterns
- Adding Sanity.io data integration with proper schemas and queries
- Fixing all interactive elements
- Ensuring accessibility compliance
- Optimizing performance
- Maintaining consistent styling with Tailwind

## Next Steps

1. Start by setting up the project structure and Sanity schemas
2. Convert global components (Header, Footer)
3. Implement the base page structure
4. Migrate section components one by one
5. Add form handling and interactivity
6. Test and optimize

## Direct Component Conversion Examples

Here are specific examples of converting components from your Relume.io export to Next.js + Sanity.io:

### Example 1: Header Component

**Original Relume React Export:**

```jsx
// Original React component from Relume
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.png" alt="Social Launch Labs" />
          </Link>
        </div>
        
        <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/case-studies">Case Studies</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
```

**Converted Next.js Component:**

```tsx
// app/components/global/Header.tsx
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

  // Handle scroll effect for transparent to solid header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
            )}
          </button>

          {/* Mobile Navigation */}
          <div
            id="mobile-menu"
            className={`fixed inset-0 bg-white z-0 transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } md:hidden`}
          >
            <div className="container mx-auto px-4 pt-24 pb-8">
              <nav>
                <ul className="space-y-6">
                  {navigation.map((item) => (
                    <li key={item._key}>
                      <Link
                        href={item.href}
                        target={item.isExternal ? '_blank' : undefined}
                        rel={item.isExternal ? 'noopener noreferrer' : undefined}
                        className={`text-xl font-medium block transition-colors hover:text-blue-600 ${
                          pathname === item.href ? 'text-blue-600' : 'text-gray-800'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                        aria-current={pathname === item.href ? 'page' : undefined}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
```

### Example 2: Hero Section Component

**Original Relume React Export:**

```jsx
// Original React component from Relume
import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

export const HeroSection = ({
  heading = "Amplify Your Social Media Presence",
  subheading = "Data-driven strategies to boost your brand's engagement and reach.",
  backgroundImage = "/images/hero-bg.jpg",
  ctaText = "Get Started",
  ctaLink = "/contact"
}) => {
  return (
    <section className="hero-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="overlay"></div>
      <div className="container">
        <div className="hero-content">
          <h1>{heading}</h1>
          <p>{subheading}</p>
          <Link to={ctaLink} className="cta-button">{ctaText}</Link>
        </div>
      </div>
    </section>
  );
};
```

**Converted Next.js Component:**

```tsx
// app/components/sections/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useIntersectionObserver } from '@/lib/utils/animations';

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
  const [ref, isVisible] = useIntersectionObserver();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set loaded state after a small delay to trigger animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-[90vh] flex items-center pt-20"
    >
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt || 'Hero background'}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
            onLoad={() => setIsLoaded(true)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 z-10 relative">
        <div className="max-w-3xl">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-700 ${
              isLoaded && isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            {heading}
          </h1>

          {subheading && (
            <p
              className={`text-xl md:text-2xl text-white/90 mb-8 transition-all duration-700 delay-300 ${
                isLoaded && isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              {subheading}
            </p>
          )}

          {cta && (
            <div
              className={`transition-all duration-700 delay-500 ${
                isLoaded && isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
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
```

### Example 3: Features Section Component

**Original Relume React Export:**

```jsx
// Original React component from Relume
import React from 'react';
import './FeaturesSection.css';

export const FeaturesSection = ({
  heading = "Our Services",
  subheading = "Comprehensive social media solutions for your business",
  features = [
    {
      icon: "strategy",
      title: "Strategy Development",
      description: "Custom social media strategies aligned with your business goals."
    },
    {
      icon: "content",
      title: "Content Creation",
      description: "High-quality content that resonates with your target audience."
    },
    {
      icon: "analytics",
      title: "Analytics & Reporting",
      description: "Detailed insights to measure and optimize your social performance."
    }
  ]
}) => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <h2>{heading}</h2>
          <p>{subheading}</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <img src={`/images/icons/${feature.icon}.svg`} alt={feature.title} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

**Converted Next.js Component:**

```tsx
// app/components/sections/FeaturesSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useIntersectionObserver } from '@/lib/utils/animations';
import { 
  BarChart2, 
  Lightbulb, 
  MessageSquare, 
  PenTool, 
  TrendingUp, 
  Users
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
  const [ref, isVisible] = useIntersectionObserver();
  const [animatedItems, setAnimatedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isVisible && features.length > 0) {
      // Stagger the animation of each feature
      const timers = features.map((feature, index) => {
        return setTimeout(() => {
          setAnimatedItems((prev) => ({
            ...prev,
            [feature._key]: true,
          }));
        }, 100 * (index + 1));
      });

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [isVisible, features]);

  // Map icon string to Lucide icon component
  const getIconComponent = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'strategy':
      case 'lightbulb':
        return <Lightbulb className="h-8 w-8 text-blue-500" />;
      case 'content':
      case 'pentool':
        return <PenTool className="h-8 w-8 text-blue-500" />;
      case 'analytics':
      case 'chart':
        return <BarChart2 className="h-8 w-8 text-blue-500" />;
      case 'engagement':
      case 'message':
        return <MessageSquare className="h-8 w-8 text-blue-500" />;
      case 'growth':
      case 'trending':
        return <TrendingUp className="h-8 w-8 text-blue-500" />;
      case 'audience':
      case 'users':
        return <Users className="h-8 w-8 text-blue-500" />;
      default:
        return <Lightbulb className="h-8 w-8 text-blue-500" />;
    }
  };

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>} 
      className="py-16 md:py-24 bg-gray-50"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          {subheading && (
            <p className="text-lg text-gray-600">{subheading}</p>
          )}
        </div>

        {/* Features Grid */}
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
              {/* Feature Icon */}
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
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Integration Instructions

To integrate these components into your Next.js + Sanity project:

1. **Set up project structure**:
   ```bash
   # Clone your existing Next.js + Sanity project
   git clone https://github.com/WeaverAndrew55/SLL-Test-2.git
   cd SLL-Test-2
   
   # Install dependencies
   npm install
   ```

2. **Create folder structure**:
   ```bash
   mkdir -p app/components/{global,sections,ui}
   mkdir -p app/lib/{sanity,utils}
   mkdir -p sanity/schemas/{documents,objects}
   mkdir -p types
   ```

3. **Copy schema definitions** from this migration plan to their respective files in the `sanity/schemas` directory.

4. **Create TypeScript interfaces** in the `types` directory.

5. **Implement components** in the `app/components` directory.

6. **Update your Sanity client configuration** in `app/lib/sanity`.

7. **Test components** individually before integrating them into your pages.

8. **Deploy your application** using your preferred platform.

## Final Notes

- This migration plan provides all the necessary components and configuration to convert your Relume.io website to Next.js + Sanity.io.
- The components are designed to be modular and reusable, following best practices for Next.js, TypeScript, and Tailwind CSS.
- All interactive elements are properly implemented with state management and accessibility features.
- Performance optimizations are built into the components, ensuring fast load times and smooth user experience.
- Sanity.io integration is seamless, allowing for easy content management.

By following this plan, you'll create a robust, high-performing website that is easy to maintain and update.
root/
├── app/
│   ├── api/
│   │   ├── contact/
│   │   └── revalidate/
│   ├── components/
│   │   ├── global/
│   │   ├── sections/
│   │   └── ui/
│   ├── lib/
│   │   ├── sanity/
│   │   └── utils/
│   ├── [slug]/
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── sanity/
│   ├── desk/
│   ├── schemas/
│   │   ├── documents/
│   │   └── objects/
│   └── sanity.config.ts
└── types/
```

### Migration Steps

1. Set up Next.js 14 with App Router structure
2. Configure Sanity.io integration
3. Create TypeScript interfaces
4. Convert React components to Next.js components
5. Implement responsive design with Tailwind CSS
6. Add state management for interactive elements
7. Ensure accessibility compliance
8. Optimize for performance
9. Set up testing and deployment

 Interfaces

We'll create a comprehensive set of TypeScript interfaces for all components and data structures.

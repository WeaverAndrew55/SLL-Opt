# Integration Guide for Next.js + Sanity Migration

This guide provides step-by-step instructions for integrating the provided components into your existing Next.js + Sanity project.

## Prerequisites

- Node.js 18.x or later
- Git
- A Sanity.io account and project

## Setup Steps

### 1. Clone Your Existing Project

```bash
git clone https://github.com/WeaverAndrew55/SLL-Test-2.git
cd SLL-Test-2
npm install
```

### 2. Set Up Project Structure

Create the necessary directories:

```bash
mkdir -p app/components/{global,sections,ui}
mkdir -p app/lib/{sanity,utils}
mkdir -p types
```

### 3. Add TypeScript Interfaces

Copy the provided TypeScript interfaces into the `types` directory:

```bash
# Create types/sanity.d.ts and types/pages.d.ts with the provided code
```

### 4. Configure Sanity Integration

1. Set up the Sanity client:

```bash
# Add the provided client.ts and queries.ts to app/lib/sanity/
```

2. Create the `.env.local` file (don't commit this to Git):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

### 5. Add Core Components

Copy the provided components to the appropriate directories:

```bash
# Global components to app/components/global/
# Section components to app/components/sections/
# UI components to app/components/ui/
```

### 6. Set Up Routes and API Endpoints

1. Add the dynamic page route:

```bash
# Copy the provided [slug]/page.tsx to app/[slug]/page.tsx
```

2. Add the home page:

```bash
# Copy the provided page.tsx to app/page.tsx
```

3. Create the API route for contact form submissions:

```bash
mkdir -p app/api/contact
# Copy the provided route.ts to app/api/contact/route.ts
```

### 7. Add Utility Functions

Copy the animation utilities:

```bash
# Copy the provided animations.ts to app/lib/utils/animations.ts
```

### 8. Update Sanity Studio Schemas

Set up or update your Sanity schemas:

1. Create schema files in your Sanity Studio project
2. Add the provided schemas to the appropriate files
3. Import and export all schemas in the main schema index file

## Content Modeling in Sanity

### Creating Content with the New Schema

1. Log in to your Sanity Studio (usually at `http://localhost:3333`)
2. Create a new Site Settings document with navigation and logo
3. Create a Home Page document with slug "home"
4. Add sections to the page using the available section types

### Testing Your Setup

1. Start the Next.js development server:

```bash
npm run dev
```

2. Check that the home page loads with your Sanity content
3. Test the dynamic page routing by creating additional pages in Sanity
4. Verify that the contact form works correctly

## Component Migration Process

### Step 1: Analyze Original Components

For each component in your Relume React export:

1. Identify the component's purpose and functionality
2. Note all props and state variables
3. Determine which Next.js and Sanity features to use

### Step 2: Convert Components

Follow this process for each component:

1. Create the TypeScript interface for the component's props
2. Implement the component using Next.js conventions
3. Add responsive design with Tailwind CSS
4. Implement animations and interactivity
5. Ensure accessibility compliance

### Example: Converting a Hero Component

Original Relume React component:
```jsx
import React from 'react';
import './Hero.css';

export const Hero = ({ title, subtitle, image, cta }) => {
  return (
    <div className="hero" style={{ backgroundImage: `url(${image})` }}>
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <button onClick={cta.action}>{cta.text}</button>
      </div>
    </div>
  );
};
```

Converted Next.js component:
```tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useIntersectionObserver } from '@/lib/utils/animations';

interface HeroProps {
  heading: string;
  subheading?: string;
  backgroundImage?: {
    url: string;
    alt: string;
  };
  cta?: {
    title: string;
    href: string;
  };
}

export function Hero({
  heading,
  subheading,
  backgroundImage,
  cta
}: HeroProps) {
  const [ref, isVisible] = useIntersectionObserver();
  
  return (
    <section 
      ref={ref}
      className="relative min-h-[90vh] flex items-center"
    >
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-2xl transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {heading}
          </h1>
          
          {subheading && (
            <p className="text-xl text-white/90 mb-8">
              {subheading}
            </p>
          )}
          
          {cta && (
            <Link
              href={cta.href}
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {cta.title}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
```

## Performance Optimization

### Image Optimization

1. Use `next/image` for all images
2. Set appropriate `sizes` attribute for responsive images
3. Use `priority` for above-the-fold images
4. Add proper `alt` text for accessibility
5. Implement lazy loading for below-the-fold images

Example:
```tsx
<Image
  src={image.url}
  alt={image.alt}
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 800px"
  className="object-cover rounded-lg"
  loading="lazy"
/>
```

### Component Optimization

1. Use React Server Components where possible
2. Add `'use client'` directive only when necessary
3. Implement code splitting with dynamic imports
4. Memoize expensive calculations with `useMemo`
5. Optimize event handlers with `useCallback`

Example:
```tsx
'use client';

import { useMemo, useCallback } from 'react';

export function ExpensiveComponent({ data }) {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => /* complex processing */);
  }, [data]);
  
  // Optimize event handlers
  const handleClick = useCallback(() => {
    // Handle click event
  }, []);
  
  return (
    // Component JSX
  );
}
```

### Sanity Query Optimization

1. Only request the fields you need
2. Use projections to limit returned data
3. Implement proper caching strategies
4. Use ISR (Incremental Static Regeneration) for semi-dynamic content

Example:
```tsx
// Optimized GROQ query with projections
const query = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    // Only get the fields we need from the sections
    sections[] {
      _key,
      _type,
      heading,
      subheading,
      // Nested projections for images
      "image": image {
        "url": asset->url,
        "alt": alt
      }
    }
  }
`;
```

## Accessibility Implementation

Ensure your components are accessible by following these practices:

1. Use semantic HTML elements
2. Add proper ARIA attributes
3. Ensure sufficient color contrast
4. Implement keyboard navigation
5. Make form elements accessible

Example:
```tsx
<button
  type="button"
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
  onClick={() => setIsOpen(!isOpen)}
>
  Toggle Menu
</button>

<div
  id="dropdown-menu"
  role="menu"
  aria-labelledby="dropdown-button"
  className={`mt-2 ${isOpen ? 'block' : 'hidden'}`}
>
  {/* Menu items */}
</div>
```

## Responsive Design Implementation

Implement responsive design using Tailwind's breakpoint system:

1. Use mobile-first approach
2. Add responsive variants for different screen sizes
3. Test on multiple devices and viewports

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  {items.map(item => (
    <div key={item.id} className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg md:text-xl font-bold">{item.title}</h3>
      <p className="mt-2 text-sm md:text-base">{item.description}</p>
    </div>
  ))}
</div>
```

## Final Steps and Testing

### Cross-Browser Testing

Test your application in multiple browsers:
- Chrome
- Firefox
- Safari
- Edge

### Performance Testing

Use tools to measure and optimize performance:
1. Lighthouse in Chrome DevTools
2. WebPageTest
3. Next.js Analytics

### Accessibility Testing

Ensure your site meets accessibility standards:
1. Use axe DevTools
2. Test with keyboard navigation
3. Use screen readers to verify content accessibility

### Deployment

Deploy your Next.js + Sanity application:
1. Vercel (recommended for Next.js)
2. Netlify
3. AWS Amplify

## Troubleshooting Common Issues

### Issue: Sanity Content Not Loading

**Solution:**
1. Verify environment variables are set correctly
2. Check CORS settings in Sanity project settings
3. Ensure proper permissions for the API token

### Issue: Images Not Optimizing Correctly

**Solution:**
1. Add domains to next.config.js:
```js
module.exports = {
  images: {
    domains: ['cdn.sanity.io'],
  },
}
```
2. Verify image dimensions and aspect ratios

### Issue: SSR Errors with Client Components

**Solution:**
1. Use proper 'use client' directives
2. Move browser-specific code into useEffect hooks
3. Use dynamic imports for client-only libraries

## Conclusion

By following this guide, you'll successfully migrate your Relume.io website to Next.js + Sanity.io, improving performance, maintainability, and user experience. The modular component architecture allows for easy updates and expansion in the future.

Remember to:
1. Start with core components and infrastructure
2. Add pages and routes incrementally
3. Test thoroughly at each stage
4. Optimize performance and accessibility
5. Document your component library for future reference
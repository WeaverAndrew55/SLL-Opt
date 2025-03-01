// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure image domains
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // TypeScript settings
  typescript: {
    // Don't ignore errors in production
    ignoreBuildErrors: false,
  },
  
  // Experimental features
  experimental: {
    // Enable server actions with empty config
    serverActions: {},
  },
  
  // Redirects
  async redirects() {
    return [
      // Example redirects for old URLs
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
  
  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Cache static assets
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
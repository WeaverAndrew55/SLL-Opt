// components/analytics/AnalyticsProvider.tsx
'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface AnalyticsProviderProps {
  analyticsId?: string;
  children: React.ReactNode;
}

/**
 * Google Analytics provider component
 * This uses the GA4 setup with gtag.js
 */
export default function AnalyticsProvider({
  analyticsId = process.env.NEXT_PUBLIC_GA_ID,
  children,
}: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Track page views
  useEffect(() => {
    if (!analyticsId || !window.gtag) return;
    
    // Construct URL from pathname and search params
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Send page view to Google Analytics
    window.gtag('config', analyticsId, {
      page_path: url,
    });
  }, [analyticsId, pathname, searchParams]);
  
  // If no analytics ID is provided, just render children
  if (!analyticsId) {
    return <>{children}</>;
  }
  
  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${analyticsId}', {
            page_path: window.location.pathname,
            send_page_view: false
          });
        `}
      </Script>
      {children}
    </>
  );
}

// components/analytics/TrackEvent.tsx
'use client';

import { useCallback } from 'react';

/**
 * Hook for tracking custom events
 */
export function useTrackEvent() {
  const trackEvent = useCallback((eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, eventParams);
    }
  }, []);
  
  return trackEvent;
}

// Usage example:
// const trackEvent = useTrackEvent();
// <button onClick={() => trackEvent('button_click', { button_name: 'contact_us' })}>
//   Contact Us
// </button>

// types/global.d.ts
// Add global types for gtag
interface Window {
  gtag: (
    command: 'config' | 'event' | 'set', 
    targetId: string, 
    config?: Record<string, any> | undefined
  ) => void;
  dataLayer: any[];
}

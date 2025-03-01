'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Component that adds smooth page transitions between routes
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  // Update displayed children when the pathname changes
  useEffect(() => {
    if (pathname) {
      setIsTransitioning(true);
      
      // Set a timeout to update the children after the fade-out animation
      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setIsTransitioning(false);
      }, 300); // Match this duration with the CSS transition duration
      
      return () => clearTimeout(timeout);
    }
  }, [pathname, children]);

  return (
    <div
      className={`transition-opacity duration-300 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {displayChildren}
    </div>
  );
}

// Example usage in layout.tsx:
// 
// import PageTransition from '@/components/ui/PageTransition';
//
// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <Header />
//         <PageTransition>
//           <main>{children}</main>
//         </PageTransition>
//         <Footer />
//       </body>
//     </html>
//   );
// }

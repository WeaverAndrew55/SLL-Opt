// lib/utils/animations.ts
import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for detecting when an element enters the viewport
 * @param options IntersectionObserver options
 * @returns [ref, isIntersecting] - Ref to attach to the element and boolean indicating if element is visible
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Create intersection observer
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1, // Trigger when at least 10% of the element is visible
      rootMargin: '0px 0px -100px 0px', // Start slightly before element comes into view
      ...options,
    });

    // Start observing the element
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Clean up on unmount
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
}

/**
 * Hook for triggering animations once when element enters viewport
 * @param options IntersectionObserver options
 * @returns [ref, hasTriggered] - Ref to attach to the element and boolean indicating if animation has triggered
 */
export function useOnceVisible(options = {}) {
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (hasTriggered) return; // Skip if already triggered

    // Create intersection observer that triggers only once
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasTriggered(true);
        // Stop observing after triggering
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      }
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
      ...options,
    });

    // Start observing the element
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Clean up on unmount
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasTriggered, options]);

  return [ref, hasTriggered];
}

/**
 * Generate CSS styles for fade-in animation
 * @param isVisible Boolean to control if element is visible
 * @param delay Optional delay in seconds
 * @returns CSS style object for the animation
 */
export function fadeInAnimation(isVisible: boolean, delay = 0) {
  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
  };
}

/**
 * Generate CSS styles for staggered animations of multiple elements
 * @param isVisible Boolean to control if element is visible
 * @param index Index of the element in the list
 * @param baseDelay Base delay before starting the staggered animation
 * @returns CSS style object for the staggered animation
 */
export function staggerAnimation(isVisible: boolean, index: number, baseDelay = 0.1) {
  const delay = baseDelay + index * 0.1;
  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`,
  };
}

/**
 * Create CSS classes for animations with optional delay and duration
 * @param isVisible Boolean to control if element is visible
 * @param delay Optional delay in milliseconds
 * @param duration Optional duration in milliseconds
 * @returns String of Tailwind CSS classes for the animation
 */
export function getAnimationClasses(isVisible: boolean, delay = 0, duration = 700) {
  const delayClass = delay > 0 ? `delay-${delay}` : '';
  const durationClass = `duration-${duration}`;
  
  return `transition-all ${durationClass} ${delayClass} ${
    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
  }`;
}

// components/ui/Skeleton.tsx
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * A skeleton loader component for displaying loading state
 */
interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  );
}

// components/sections/skeletons/HeroSkeleton.tsx
import { Skeleton } from '@/components/ui/Skeleton';

export function HeroSkeleton() {
  return (
    <section className="relative min-h-[70vh] flex items-center pt-20">
      <div className="container mx-auto px-4 md:px-6 z-10 relative">
        <div className="max-w-3xl">
          <Skeleton className="h-14 w-3/4 mb-6" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6 mb-2" />
          <Skeleton className="h-6 w-4/6 mb-8" />
          <Skeleton className="h-12 w-40 rounded-lg" />
        </div>
      </div>
    </section>
  );
}

// components/sections/skeletons/FeaturesSkeleton.tsx
import { Skeleton } from '@/components/ui/Skeleton';

export function FeaturesSkeleton() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-5 w-3/4 mx-auto mb-1" />
          <Skeleton className="h-5 w-2/3 mx-auto" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              {/* Feature Icon */}
              <Skeleton className="h-12 w-12 rounded-full mb-4" />

              {/* Feature Content */}
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// components/sections/skeletons/TestimonialsSkeleton.tsx
import { Skeleton } from '@/components/ui/Skeleton';

export function TestimonialsSkeleton() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-5 w-3/4 mx-auto" />
        </div>

        {/* Testimonial */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
            {/* Quote Icon */}
            <Skeleton className="h-8 w-8 mb-6" />
            
            {/* Quote Text */}
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-8" />
            
            {/* Author Info */}
            <div className="flex items-center">
              <Skeleton className="h-14 w-14 rounded-full mr-4" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex items-center space-x-2 mx-4">
              <Skeleton className="h-2 w-8 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

// lib/utils/cn.ts
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that merges Tailwind CSS classes without conflict
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

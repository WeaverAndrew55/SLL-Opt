// components/sections/TestimonialsSection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  _key: string;
  quote: string;
  author: string;
  position?: string;
  company?: string;
  avatar?: {
    url: string;
    alt?: string;
  };
}

interface TestimonialsSectionProps {
  heading: string;
  subheading?: string;
  testimonials: Testimonial[];
}

export function TestimonialsSection({
  heading,
  subheading,
  testimonials,
}: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const totalTestimonials = testimonials.length;

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

  // Auto-advance testimonials
  useEffect(() => {
    if (totalTestimonials <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % totalTestimonials);
    }, 8000);

    return () => clearInterval(interval);
  }, [totalTestimonials]);

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + totalTestimonials) % totalTestimonials);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % totalTestimonials);
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 
            id="testimonials-heading" 
            className={`text-3xl md:text-4xl font-bold mb-4 transition-opacity duration-700 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {heading}
          </h2>
          {subheading && (
            <p 
              className={`text-lg text-gray-600 transition-opacity duration-700 delay-100 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {subheading}
            </p>
          )}
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial */}
          <div 
            className="bg-white rounded-lg shadow-lg p-6 md:p-10"
            aria-live="polite"
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial._key}
                className={`transition-opacity duration-500 ${
                  index === activeIndex ? 'block opacity-100' : 'hidden opacity-0'
                }`}
                aria-hidden={index !== activeIndex}
              >
                {/* Quote Icon */}
                <div className="mb-6 text-blue-500">
                  <Quote size={32} />
                </div>
                
                {/* Quote Text */}
                <blockquote className="text-xl md:text-2xl mb-8 text-gray-700 italic">
                  "{testimonial.quote}"
                </blockquote>
                
                {/* Author Info */}
                <div className="flex items-center">
                  {testimonial.avatar && (
                    <div className="mr-4 relative w-14 h-14 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.avatar.url}
                        alt={testimonial.avatar.alt || `${testimonial.author}'s avatar`}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  )}
                  
                  <div>
                    <div className="font-bold text-lg">{testimonial.author}</div>
                    {(testimonial.position || testimonial.company) && (
                      <div className="text-gray-600">
                        {testimonial.position}
                        {testimonial.position && testimonial.company && ', '}
                        {testimonial.company}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls (only if more than one testimonial) */}
          {totalTestimonials > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {/* Previous Button */}
              <button
                onClick={goToPrevious}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {/* Indicators */}
              <div className="flex items-center space-x-2 mx-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      activeIndex === index 
                        ? 'w-8 bg-blue-600' 
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                    aria-current={activeIndex === index ? 'true' : 'false'}
                  />
                ))}
              </div>
              
              {/* Next Button */}
              <button
                onClick={goToNext}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

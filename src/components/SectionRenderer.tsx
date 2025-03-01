// components/sections/SectionRenderer.tsx
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { TestimonialsSection } from './TestimonialsSection'; 
import { CTASection } from './CTASection';
import ContactForm from './ContactForm';

// Import additional section components as needed

// Type for the section props with a common _type and _key
type SectionProps = {
  _type: string;
  _key: string;
  [key: string]: any; // Allow for any additional props specific to the section type
};

interface SectionRendererProps {
  section: SectionProps;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  // Ensure section has the required _type
  if (!section || !section._type) {
    console.warn('Section missing _type or is undefined');
    return null;
  }

  // Render the appropriate component based on section type
  switch (section._type) {
    case 'heroSection':
      return <HeroSection {...section} />;
    
    case 'featuresSection':
      return <FeaturesSection {...section} />;
    
    case 'testimonialsSection':
      return <TestimonialsSection {...section} />;
    
    case 'ctaSection':
      return <CTASection {...section} />;
    
    case 'contactSection':
      return <ContactForm {...section} />;
    
    // Add additional section types as needed
    
    default:
      console.warn(`Unknown section type: ${section._type}`);
      return null;
  }
}

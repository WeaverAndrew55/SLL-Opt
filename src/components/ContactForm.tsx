// components/sections/ContactForm.tsx
'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  service?: string;
}

interface ServiceOption {
  _key: string;
  label: string;
  value: string;
}

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  services?: ServiceOption[];
  submitEndpoint?: string;
  successMessage?: string;
}

export default function ContactForm({
  title = 'Get in Touch',
  subtitle = 'Fill out the form below and we'll get back to you as soon as possible.',
  services = [],
  submitEndpoint = '/api/contact',
  successMessage = 'Thank you for contacting us! We will get back to you soon.',
}: ContactFormProps) {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: '',
  });

  // Form validation and submission state
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Clear error when user starts typing in a field
    if (errors[name as keyof FormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    // Name validation
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must contain at least 2 characters';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Message validation
    if (!formData.message || formData.message.length < 10) {
      newErrors.message = 'Message must contain at least 10 characters';
    }
    
    // If there are errors, update state and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // If validation passes, clear errors
    setErrors({});

    // Process form submission
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch(submitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form. Please try again.');
      }

      // Handle success
      setSubmitStatus('success');
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        service: '',
      });
    } catch (error) {
      // Handle error
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {submitStatus === 'success' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h3>
          <p className="text-green-700">{successMessage}</p>
          <button
            type="button"
            className="mt-4 text-sm font-medium text-green-700 underline"
            onClick={() => setSubmitStatus('idle')}
          >
            Send another message
          </button>
        </div>
      ) : (
        <div>
          {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                  errors.name
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Service Selection (if provided) */}
            {services.length > 0 && (
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Interested In
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Please select a service</option>
                  {services.map((service) => (
                    <option key={service._key} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                  errors.message
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-sm text-red-600">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm ${
                isSubmitting
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {errorMessage || 'There was an error submitting the form. Please try again.'}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

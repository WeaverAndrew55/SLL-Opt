// sanity/schemas/documents/page.ts
export const page = {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo'
    },
    {
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        { type: 'heroSection' },
        { type: 'featuresSection' },
        { type: 'testimonialsSection' },
        { type: 'ctaSection' },
        { type: 'contactSection' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current'
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: `/${slug}`
      };
    }
  }
};

// sanity/schemas/documents/siteSettings.ts
export const siteSettings = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'mainNavigation',
      title: 'Main Navigation',
      type: 'array',
      of: [{ type: 'link' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'footerNavigation',
      title: 'Footer Navigation',
      type: 'array',
      of: [{ type: 'link' }]
    },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Twitter', value: 'twitter' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'YouTube', value: 'youtube' }
                ]
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url'
            }
          }
        }
      ]
    }
  ]
};

// sanity/schemas/documents/contactSubmission.ts
export const contactSubmission = {
  name: 'contactSubmission',
  title: 'Contact Submissions',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string'
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'service',
      title: 'Service',
      type: 'string'
    },
    {
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      date: 'submittedAt'
    },
    prepare({ title, subtitle, date }) {
      const formattedDate = date ? new Date(date).toLocaleString() : '';
      return {
        title,
        subtitle: `${subtitle} - ${formattedDate}`
      };
    }
  },
  // Read-only to prevent accidental edits
  readOnly: true
};

// sanity/schemas/objects/seo.ts
export const seo = {
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title displayed in search results (max 60 characters)',
      validation: Rule => Rule.max(60)
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'Description displayed in search results (max 160 characters)',
      rows: 3,
      validation: Rule => Rule.max(160)
    },
    {
      name: 'openGraphImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image displayed when sharing on social media (1200 x 630 pixels recommended)',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string'
        }
      ]
    },
    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }
  ]
};

// sanity/schemas/objects/link.ts
export const link = {
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'href',
      title: 'URL',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'isExternal',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'href'
    }
  }
};

// sanity/schemas/objects/heroSection.ts
export const heroSection = {
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 3
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ]
    },
    {
      name: 'cta',
      title: 'Call to Action',
      type: 'link'
    }
  ],
  preview: {
    select: {
      title: 'heading',
      media: 'backgroundImage'
    },
    prepare({ title, media }) {
      return {
        title: title || 'Hero Section',
        subtitle: 'Hero section',
        media
      };
    }
  }
};

// sanity/schemas/objects/featuresSection.ts
export const featuresSection = {
  name: 'featuresSection',
  title: 'Features Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 3
    },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'List', value: 'list' }
        ],
        layout: 'radio'
      },
      initialValue: 'grid'
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: Rule => Rule.required()
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Name of icon from Lucide icon set (e.g., "lightbulb", "chart", "users")'
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alternative Text',
                  type: 'string'
                }
              ]
            },
            {
              name: 'link',
              title: 'Link',
              type: 'link'
            }
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image'
            }
          }
        }
      ],
      validation: Rule => Rule.min(1)
    }
  ],
  preview: {
    select: {
      title: 'heading',
      featuresCount: 'features.length'
    },
    prepare({ title, featuresCount = 0 }) {
      return {
        title: title || 'Features Section',
        subtitle: `${featuresCount} feature${featuresCount === 1 ? '' : 's'}`
      };
    }
  }
};

// sanity/schemas/objects/testimonialsSection.ts
export const testimonialsSection = {
  name: 'testimonialsSection',
  title: 'Testimonials Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 3
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 4,
              validation: Rule => Rule.required()
            },
            {
              name: 'author',
              title: 'Author',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'position',
              title: 'Position',
              type: 'string'
            },
            {
              name: 'company',
              title: 'Company',
              type: 'string'
            },
            {
              name: 'avatar',
              title: 'Avatar',
              type: 'image',
              options: {
                hotspot: true
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alternative Text',
                  type: 'string'
                }
              ]
            }
          ],
          preview: {
            select: {
              title: 'author',
              subtitle: 'company',
              media: 'avatar'
            }
          }
        }
      ],
      validation: Rule => Rule.min(1)
    }
  ],
  preview: {
    select: {
      title: 'heading',
      testimonialsCount: 'testimonials.length'
    },
    prepare({ title, testimonialsCount = 0 }) {
      return {
        title: title || 'Testimonials Section',
        subtitle: `${testimonialsCount} testimonial${testimonialsCount === 1 ? '' : 's'}`
      };
    }
  }
};

// sanity/schemas/objects/ctaSection.ts
export const ctaSection = {
  name: 'ctaSection',
  title: 'Call to Action Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 3
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string'
        }
      ]
    },
    {
      name: 'primaryCTA',
      title: 'Primary Call to Action',
      type: 'link'
    },
    {
      name: 'secondaryCTA',
      title: 'Secondary Call to Action',
      type: 'link'
    },
    {
      name: 'alignment',
      title: 'Content Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' }
        ],
        layout: 'radio'
      },
      initialValue: 'center'
    }
  ],
  preview: {
    select: {
      title: 'heading',
      media: 'backgroundImage'
    },
    prepare({ title, media }) {
      return {
        title: title || 'CTA Section',
        subtitle: 'Call to action section',
        media
      };
    }
  }
};

// sanity/schemas/objects/contactSection.ts
export const contactSection = {
  name: 'contactSection',
  title: 'Contact Form Section',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Get in Touch'
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'Fill out the form below and we'll get back to you as soon as possible.'
    },
    {
      name: 'services',
      title: 'Service Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'label'
            }
          }
        }
      ]
    },
    {
      name: 'submitEndpoint',
      title: 'Form Submission Endpoint',
      type: 'string',
      description: 'The API endpoint where form data will be sent',
      initialValue: '/api/contact'
    },
    {
      name: 'successMessage',
      title: 'Success Message',
      type: 'text',
      rows: 2,
      description: 'Message displayed after successful form submission',
      initialValue: 'Thank you for contacting us! We will get back to you soon.'
    }
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({ title }) {
      return {
        title: title || 'Contact Form Section',
        subtitle: 'Contact form'
      };
    }
  }
};

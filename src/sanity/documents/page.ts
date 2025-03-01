export const page = {
    name: 'page',
    title: 'Page',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: { source: 'title', maxLength: 96 },
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'seo',
        title: 'SEO',
        type: 'seo',
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
          { type: 'contactSection' },
        ],
      },
    ],
    preview: {
      select: {
        title: 'title',
        slug: 'slug.current',
      },
      prepare({ title, slug }) {
        return { title, subtitle: `/${slug}` };
      },
    },
  };
  
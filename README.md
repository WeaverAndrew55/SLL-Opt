# Social Launch Labs - Next.js + Sanity.io Website

This project is a migration from a Relume.io React export to a Next.js + Sanity.io application, featuring TypeScript, Tailwind CSS, and responsive design patterns.

## Features

- **Next.js 14**: Using the App Router for enhanced routing capabilities
- **Sanity.io**: Headless CMS for content management
- **TypeScript**: Type-safe code with interfaces and types
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Responsive Design**: Mobile-first approach with breakpoints for all screen sizes
- **Accessibility**: ARIA attributes and semantic HTML
- **Performance Optimizations**: Image optimization, code splitting, and more
- **Form Handling**: Contact form with validation and state management
- **Animations**: Smooth animations for enhanced user experience

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Sanity.io account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/WeaverAndrew55/SLL-Test-2.git
cd SLL-Test-2
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=your-api-token
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Sanity Studio

The Sanity Studio is available at `/studio` route. To start it separately:

```bash
npx sanity dev
```

## Project Structure

```
root/
├── app/
│   ├── api/
│   │   └── contact/          # API route for contact form
│   ├── components/
│   │   ├── global/           # Global components (Header, Footer)
│   │   ├── sections/         # Page section components
│   │   └── ui/               # Reusable UI components
│   ├── lib/
│   │   ├── sanity/           # Sanity.io configuration
│   │   └── utils/            # Utility functions
│   ├── [slug]/               # Dynamic page route
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── public/                   # Static assets
├── sanity/
│   ├── desk/                 # Custom desk structure
│   ├── schemas/              # Sanity schema definitions
│   └── sanity.config.ts      # Sanity configuration
├── types/                    # TypeScript type definitions
├── .env.local                # Environment variables (not in git)
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Component Architecture

The project follows a modular component architecture:

- **Global Components**: Header, Footer, etc.
- **Section Components**: Hero, Features, Testimonials, CTA, etc.
- **UI Components**: Button, Card, Input, etc.
- **Page Components**: Home, About, Contact, etc.

Each component is self-contained with its own TypeScript interface, styles, and functionality.

## Content Management

Content is managed through Sanity.io with the following structure:

- **Page**: Documents for each page with configurable sections
- **Site Settings**: Global settings for navigation, logo, etc.
- **Contact Submissions**: Form submissions stored as documents

## Deployment

This project is deployed on [Vercel](https://vercel.com), which provides optimal performance for Next.js applications.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Sanity.io](https://www.sanity.io/) - Headless CMS
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

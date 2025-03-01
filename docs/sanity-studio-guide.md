# Sanity Studio Content Management Guide

This guide provides instructions for managing content in your Social Launch Labs website using Sanity Studio.

## Getting Started

1. **Access the Studio**: Navigate to `/studio` on your website to access Sanity Studio.

2. **Authentication**: Log in with your Sanity credentials.

3. **Studio Interface**: Familiarize yourself with the main sections:
   - Desk: Main content editing interface
   - Vision: GROQ query playground for developers
   - Dataset: Allows switching between datasets (if configured)

## Content Structure

The content in Sanity Studio is organized as follows:

### Site Settings

This is a singleton document that contains global settings for the website:

- **Site Name**: The name of your website
- **Logo**: The main logo image
- **Main Navigation**: Navigation links for the header
- **Footer Navigation**: Navigation links for the footer
- **Social Links**: Social media profile links

### Pages

There are two types of pages:

1. **Home Page**: A special singleton page for the homepage content.
2. **Regular Pages**: Additional pages like About, Services, Contact, etc.

Each page consists of:
- **Title**: The page title (used for SEO and navigation)
- **Slug**: The URL path segment (e.g., "about" for yoursite.com/about)
- **SEO**: Search engine optimization settings
- **Sections**: Modular content sections that make up the page

### Contact Submissions

This document type stores submissions from the contact form.

## Editing Content

### Editing Site Settings

1. Click on "Site Settings" in the desk structure
2. Update the fields as needed
3. Click "Publish" to save your changes

### Creating a New Page

1. Click on "Pages" in the desk structure
2. Click the "Create new document" button
3. Fill out the required fields:
   - **Title**: Page title
   - **Slug**: URL path (will generate automatically from title)
   - **SEO**: SEO settings (optional but recommended)
4. Add sections to your page (see below)
5. Click "Publish" to make the page live

### Adding Sections to a Page

Pages are built using modular sections. To add a section:

1. In the "Sections" field, click the "Add item" button
2. Choose the type of section you want to add:
   - **Hero Section**: A prominent header area
   - **Features Section**: Highlight features or services
   - **Testimonials Section**: Display customer testimonials
   - **CTA Section**: Call-to-action area
   - **Contact Section**: Contact form
3. Fill out the fields for the selected section type
4. You can reorder sections by dragging them
5. You can remove sections by clicking the "×" button

### Section Types and Fields

#### Hero Section

- **Heading**: Main heading text
- **Subheading**: Secondary text (optional)
- **Background Image**: Image for the background
- **Call to Action**: Button link

#### Features Section

- **Heading**: Section heading
- **Subheading**: Section subheading (optional)
- **Layout**: Grid or list layout
- **Features**: List of features, each with:
  - **Title**: Feature name
  - **Description**: Feature description
  - **Icon**: Icon name (from Lucide icons)
  - **Image**: Feature image (optional)
  - **Link**: Call-to-action link (optional)

#### Testimonials Section

- **Heading**: Section heading
- **Subheading**: Section subheading (optional)
- **Testimonials**: List of testimonials, each with:
  - **Quote**: Testimonial text
  - **Author**: Person's name
  - **Position**: Job title (optional)
  - **Company**: Company name (optional)
  - **Avatar**: Profile picture (optional)

#### CTA Section

- **Heading**: Main call-to-action text
- **Subheading**: Supporting text (optional)
- **Background Image**: Background image (optional)
- **Primary CTA**: Main button
- **Secondary CTA**: Secondary button (optional)
- **Alignment**: Content alignment (left, center, right)

#### Contact Section

- **Title**: Form heading
- **Subtitle**: Form description
- **Services**: Service options for dropdown (optional)
- **Submit Endpoint**: API endpoint for form submission
- **Success Message**: Message shown after successful submission

## Working with Images

### Uploading Images

1. Click on any image field
2. Click "Upload" to select a file from your computer
3. Or click "Browse" to select from previously uploaded images
4. Use the crop and hotspot tools to adjust the image focus

### Image Best Practices

- **File Types**: Use JPG for photographs, PNG for graphics with transparency, SVG for icons and logos
- **Image Size**: Keep file sizes under 500KB when possible
- **Dimensions**:
  - Hero images: 1920×1080px or larger
  - Feature images: 800×600px or similar aspect ratio
  - Avatars: 200×200px (square)
- **Alt Text**: Always provide descriptive alternative text for accessibility

## SEO Settings

Each page has SEO settings that should be configured:

- **Meta Title**: The page title shown in search results (max 60 characters)
- **Meta Description**: Description shown in search results (max 160 characters)
- **Open Graph Image**: Image shown when shared on social media
- **Keywords**: Related keywords for search engines

## Preview and Publish

### Previewing Content

1. Make your edits
2. Click the "Preview" tab to see how the content will look on the website
3. You can continue making changes in the "Editor" tab

### Publishing Content

1. After making changes, click the "Publish" button
2. Your changes will be live on the website

### Working with Drafts

1. When you make changes, they are saved as drafts
2. You can see the status (published or draft) next to the document title
3. You can discard changes by clicking "Discard changes"
4. You can view the published version by clicking "Published"

## Advanced Features

### Content Versioning

Sanity keeps track of all changes to your content:

1. Click the "History" button at the top of any document
2. View the timeline of changes
3. You can revert to previous versions if needed

### Duplicate and Delete

- To duplicate a document, click "Duplicate" in the document menu
- To delete a document, click "Delete" in the document menu (this is irreversible)

## Troubleshooting

If you encounter issues while using Sanity Studio:

1. **Content not updating on the website**:
   - Make sure you've published your changes
   - Check if the website cache needs to be cleared
   - Contact your developer if the issue persists

2. **Cannot save or publish**:
   - Ensure you're connected to the internet
   - Check if you have the required permissions
   - Look for validation errors in red text

3. **Images not displaying correctly**:
   - Check that the image was successfully uploaded
   - Try re-uploading with a different file format
   - Verify the image dimensions are appropriate

## Getting Help

For additional assistance:

- Consult the Sanity documentation at https://www.sanity.io/docs
- Contact your website developer
- Email support@sociallalunchlabs.com for specific questions

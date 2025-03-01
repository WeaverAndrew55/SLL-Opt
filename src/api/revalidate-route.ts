// app/api/revalidate/route.ts
// Webhook endpoint to revalidate pages when content changes
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// Secret token to validate the webhook request
const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check for secret
    const secret = request.headers.get('x-webhook-secret');
    if (secret !== SANITY_REVALIDATE_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Invalid secret' },
        { status: 401 }
      );
    }
    
    // Check which document was updated
    const { _id, _type } = body;
    
    // Revalidate specific paths based on the document type
    if (_type === 'page') {
      // If it's the home page
      if (_id === 'home') {
        revalidatePath('/');
      } else {
        // For other pages, revalidate their specific path and the homepage
        const slug = body.slug?.current;
        if (slug) {
          revalidatePath(`/${slug}`);
        }
        revalidatePath('/');
      }
    } else if (_type === 'siteSettings') {
      // Revalidate all pages if site settings are updated
      revalidatePath('/', 'layout');
    }
    
    return NextResponse.json({ success: true, revalidated: true });
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json(
      { success: false, message: 'Error revalidating' },
      { status: 500 }
    );
  }
}

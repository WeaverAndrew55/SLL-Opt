// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const formData = await request.json();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a contact submission document in Sanity
    await client.create({
      _type: 'contactSubmission',
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      message: formData.message,
      service: formData.service || null,
      submittedAt: new Date().toISOString(),
    });
    
    // You could also add email notification logic here
    // For example, using a service like SendGrid or Resend
    // Example:
    // await sendNotificationEmail({
    //   to: 'your-email@example.com',
    //   subject: 'New Contact Form Submission',
    //   body: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`
    // });
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    
    return NextResponse.json(
      { success: false, message: 'An error occurred while submitting the form' },
      { status: 500 }
    );
  }
}

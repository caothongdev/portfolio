import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, subject, message, phone } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Name, email, and message are required',
          errors: {
            name: !name ? ['Name is required'] : [],
            email: !email ? ['Email is required'] : [],
            message: !message ? ['Message is required'] : [],
          },
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email',
          message: 'Please provide a valid email address',
          errors: {
            email: ['Invalid email format'],
          },
        },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message too short',
          message: 'Message must be at least 10 characters',
          errors: {
            message: ['Message must be at least 10 characters'],
          },
        },
        { status: 400 }
      );
    }

    // In production, send email using a service like:
    // - SendGrid
    // - Resend
    // - Nodemailer with SMTP
    // - AWS SES
    
    // For now, log to console
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      phone,
      timestamp: new Date().toISOString(),
    });

    // TODO: Implement actual email sending
    // Example with Resend:
    // const { data, error } = await resend.emails.send({
    //   from: 'onboarding@resend.dev',
    //   to: 'caothongdev@gmail.com',
    //   subject: subject || 'New Contact Form Submission',
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
      data: {
        name,
        email,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

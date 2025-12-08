import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { sendContactEmail, sendWelcomeEmail } from '@/lib/email';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validatedData = contactSchema.parse(body);

    // Send email to admin
    await sendContactEmail(validatedData);

    // Send welcome/confirmation email to user
    await sendWelcomeEmail(validatedData.email, validatedData.name);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
      data: {
        name: validatedData.name,
        email: validatedData.email,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Please check your input and try again',
          errors,
        },
        { status: 400 }
      );
    }

    // Handle email sending errors
    console.error('Contact form error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Server error',
        message: 'Failed to send message. Please try again later.',
      },
      { status: 500 }
    );
  }
}

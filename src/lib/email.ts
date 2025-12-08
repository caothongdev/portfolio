import { Resend } from 'resend';
import { ContactInput } from './validations';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(data: ContactInput) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'caothongdev@gmail.com',
      subject: `New Contact Form: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>From:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
          </div>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h3 style="color: #555;">Message:</h3>
            <p style="color: #333; line-height: 1.6;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to Hoang Cao Thong Portfolio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome, ${name}!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for contacting me through my portfolio website. 
            I've received your message and will get back to you as soon as possible.
          </p>
          <p style="color: #666;">
            Best regards,<br>
            Hoang Cao Thong
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Welcome email error:', error);
    }

    return { success: !error, data };
  } catch (error) {
    console.error('Welcome email sending error:', error);
    return { success: false };
  }
}

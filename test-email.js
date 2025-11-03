// test-email.js
import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Resend with your API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sending function
async function sendTestEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Tots and Teens Clinic <onboarding@resend.dev>',
      to: [process.env.CLINIC_EMAIL || 'rakeshrevathi2006@gmail.com'],
      subject: 'Test Email from Tots and Teens',
      html: `
        <h1>Hello from Tots and Teens Clinic!</h1>
        <p>This is a test email sent using Resend.</p>
        <p>If you're seeing this, email sending is working correctly!</p>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return;
    }

    console.log('Email sent successfully!', data);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

// Run the function
sendTestEmail();

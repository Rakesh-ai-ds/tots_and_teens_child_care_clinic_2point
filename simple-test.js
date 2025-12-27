// simple-test.js
import 'dotenv/config';
import { Resend } from 'resend';

// Use API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'drkcvgvsa@gmail.com',
      subject: 'Test from Resend',
      html: '<strong>Hello from Resend! This is a test email.</strong>',
    });

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Email sent successfully!', data);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

sendTestEmail();

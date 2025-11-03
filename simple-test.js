// simple-test.js
import { Resend } from 'resend';

// Replace 're_your_api_key_here' with your actual Resend API key
const resend = new Resend('re_your_api_key_here');

async function sendTestEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'rakeshrevathi2006@gmail.com',
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

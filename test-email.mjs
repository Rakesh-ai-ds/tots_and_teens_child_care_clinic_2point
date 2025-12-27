// Test script to verify email sending with Resend
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Check if Resend API key is set
if (!process.env.RESEND_API_KEY) {
  console.error('❌ Error: RESEND_API_KEY is not set in .env file');
  process.exit(1);
}

// Check if FROM email is set
if (!process.env.RESEND_FROM_EMAIL) {
  console.error('❌ Error: RESEND_FROM_EMAIL is not set in .env file');
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);
const testEmail = process.argv[2] || 'drkcvgvsa@gmail.com';

async function sendTestEmail() {
  try {
    console.log('🚀 Attempting to send test email...');
    console.log(`📧 From: ${process.env.RESEND_FROM_EMAIL}`);
    console.log(`📩 To: ${testEmail}`);

    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: testEmail,
      subject: 'Test Email from Tots and Teens',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4f46e5;">Test Email Successful! 🎉</h2>
          <p>Hello from Tots and Teens Child Care Clinic!</p>
          <p>If you're seeing this email, it means your email configuration is working correctly.</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
            <p><strong>Test Details:</strong></p>
            <p>✅ Email sent using Resend API</p>
            <p>✅ Timestamp: ${new Date().toLocaleString()}</p>
          </div>
          <p style="margin-top: 20px;">You can now proceed with testing the booking form.</p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', data.id);
    console.log('Check your inbox (and spam folder) for the test email.');

  } catch (error) {
    console.error('❌ Error sending email:');
    console.error(error);

    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

sendTestEmail();

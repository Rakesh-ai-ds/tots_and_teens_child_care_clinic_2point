// test-email.js
import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Resend with your API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sending function
async function sendWithRetry(maxAttempts = 5) {
  const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const to = process.env.CLINIC_EMAIL;

  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY missing in .env');
  if (!from) throw new Error('RESEND_FROM_EMAIL missing in .env');
  if (!to) throw new Error('CLINIC_EMAIL missing in .env');

  let attempt = 0;
  while (attempt < maxAttempts) {
    attempt++;
    try {
      const { data, error } = await resend.emails.send({
        from,
        to: [to],
        subject: `Test Email (attempt ${attempt})`,
        html: `<h1>Resend connectivity OK</h1><p>Attempt ${attempt} succeeded.</p>`,
      });
      if (error) throw new Error(error.message || 'Unknown Resend error');
      console.log('Email sent successfully!', data);
      return true;
    } catch (err) {
      const waitMs = Math.min(30000, 1000 * Math.pow(2, attempt - 1));
      console.error(`Attempt ${attempt} failed:`, err);
      if (attempt >= maxAttempts) return false;
      await new Promise(r => setTimeout(r, waitMs));
    }
  }
}

// Run the function
sendWithRetry(6).then((ok) => {
  if (!ok) process.exit(1);
});

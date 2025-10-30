import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY must be set.');
}

if (!process.env.RESEND_FROM_EMAIL) {
  throw new Error('RESEND_FROM_EMAIL must be set.');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getUncachableResendClient() {
  return {
    client: resend,
    fromEmail: process.env.RESEND_FROM_EMAIL,
  };
}
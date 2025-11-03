import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
console.log('Loading .env from:', envPath);

dotenv.config({ path: envPath });

console.log('Environment Variables:', {
  NODE_ENV: process.env.NODE_ENV,
  RESEND_API_KEY: process.env.RESEND_API_KEY ? '***' : 'Not set',
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'Not set',
  CLINIC_EMAIL: process.env.CLINIC_EMAIL || 'Not set',
  VITE_PUBLIC_URL: process.env.VITE_PUBLIC_URL || 'Not set',
  VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'Not set'
});

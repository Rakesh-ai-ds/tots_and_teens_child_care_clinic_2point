
// test-email.ts
import { sendBookingNotification } from './lib/emailService';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Mock booking data for testing
const mockBookingData = {
  parentName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  childName: 'Jane Doe',
  childAge: '5',
  serviceType: 'General Check-up',
  preferredDate: '2025-11-10',
  preferredTime: '10:00 AM',
  additionalNotes: 'This is a test booking.',
};

// Email sending function
async function sendTestEmail() {
  console.log('Sending test email...');
  
  try {
    const result = await sendBookingNotification(mockBookingData);

    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log('Message details:', result.data);
    } else {
      console.error('❌ Error sending test email:', result.message);
    }
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
  }
}

// Run the function
sendTestEmail();


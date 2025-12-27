// Test script to verify Resend email sending
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  // Check if Resend API key is available
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Error: RESEND_API_KEY is not set in .env file');
    console.log('\nPlease add this to your .env file:');
    console.log('RESEND_API_KEY=your_resend_api_key_here');
    console.log('RESEND_FROM_EMAIL=your_sender_email@example.com');
    console.log('CLINIC_EMAIL=your_clinic_email@example.com\n');
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'no-reply@totsandteens.com';
  const toEmail = process.env.CLINIC_EMAIL || 'drkcvgvsa@gmail.com';

  console.log('🚀 Testing email configuration...');
  console.log(`From: ${fromEmail}`);
  console.log(`To: ${toEmail}`);
  console.log('---');

  try {
    console.log('📨 Sending test email...');

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Test Email from Tots and Teens',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4f46e5;">Test Email</h2>
          <p>This is a test email to verify that email sending is working correctly.</p>
          <p>If you're seeing this, your Resend API is properly configured!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>Sent from Tots and Teens Child Care Clinic</p>
            <p>Time: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Error sending email:');
      console.error(JSON.stringify(error, null, 2));

      if (error.message.includes('invalid')) {
        console.log('\n🔑 It looks like there might be an issue with your Resend API key.');
        console.log('Please verify your RESEND_API_KEY in the .env file.');
        console.log('You can find your API key at: https://resend.com/api-keys');
      }

      if (error.message.includes('from')) {
        console.log('\n📧 There might be an issue with your sender email address.');
        console.log('Please verify your RESEND_FROM_EMAIL in the .env file.');
        console.log('Make sure this email is verified in your Resend dashboard.');
      }

      return;
    }

    console.log('✅ Test email sent successfully!');
    console.log('📩 Email ID:', data.id);
    console.log('\n📋 Next steps:');
    console.log('1. Check your email inbox (and spam folder) for the test email');
    console.log('2. If you received the email, your setup is working correctly!');
    console.log('3. If not, check your Resend dashboard for any errors: https://resend.com/emails');

  } catch (error) {
    console.error('❌ Unexpected error:');
    console.error(error);
  }
}

testEmail();

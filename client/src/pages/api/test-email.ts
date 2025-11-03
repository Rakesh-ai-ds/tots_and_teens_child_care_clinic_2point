import { NextApiRequest, NextApiResponse } from 'next';
import { getUncachableResendClient } from '@lib/resend';

// Environment variables with proper typing
declare const process: {
  env: {
    NODE_ENV?: 'development' | 'production';
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
    CLINIC_EMAIL?: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'RESEND_API_KEY is not configured',
      });
    }

    // In development, return a mock success response
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({
        success: true,
        message: 'Test email would be sent in production',
      });
    }

    // In production, send actual email
    const { client: resend, fromEmail } = await getUncachableResendClient();
    const toEmail = process.env.CLINIC_EMAIL || 'rakeshrevathi2006@gmail.com';

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
      console.error('Error sending test email:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Test email sent successfully!',
      data: {
        id: data?.id,
        to: toEmail,
        from: fromEmail,
      }
    });

  } catch (error) {
    console.error('Error in test email endpoint:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

import fs from 'fs';
import path from 'path';
import { getUncachableResendClient } from './resend';

type LoggableData = {
  type: string;
  [key: string]: any;
};

type BookingData = {
  parentName: string;
  email: string;
  phone?: string;
  childName?: string;
  childAge?: string;
  serviceType?: string;
  preferredDate?: string;
  preferredTime?: string;
  additionalNotes?: string;
  [key: string]: any; // For any additional fields
};

const LOG_FILE = path.join(process.cwd(), 'bookings.log');

// Simple file-based logging
const logData = (data: LoggableData) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${JSON.stringify(data)}\n`;
  
  fs.appendFile(LOG_FILE, logEntry, (err: NodeJS.ErrnoException | null) => {
    if (err) console.error('Error writing to log file:', err);
  });
};

// Build HTML email template
const buildEmailTemplate = (data: BookingData): string => {
  const bookedOn = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7fc; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
      <div style="background: linear-gradient(135deg, #6a11cb, #2575fc); color: #ffffff; padding: 40px; text-align: center;">
        <h1 style="margin: 0; font-size: 32px; font-weight: 700;">🎉 New Appointment! 🎉</h1>
        <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">A new booking has been made at Tots and Teens Clinic.</p>
      </div>
      <div style="padding: 30px 40px; background-color: #ffffff;">
        <h2 style="color: #6a11cb; font-size: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 25px; font-weight: 600;">Booking Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody style="font-size: 16px; color: #333;">
            <tr>
              <td style="padding: 12px 0; color: #555; font-weight: bold; width: 40%;">👤 Parent's Name:</td>
              <td style="padding: 12px 0; color: #2d3748;">${data.parentName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #555; font-weight: bold;">📧 Email:</td>
              <td style="padding: 12px 0; color: #2d3748;">${data.email}</td>
            </tr>
            ${data.phone ? `<tr><td style="padding: 12px 0; color: #555; font-weight: bold;">📞 Phone:</td><td style="padding: 12px 0; color: #2d3748;">${data.phone}</td></tr>` : ''}
            ${data.childName ? `<tr><td style="padding: 12px 0; color: #555; font-weight: bold;">👶 Child's Name:</td><td style="padding: 12px 0; color: #2d3748;">${data.childName}</td></tr>` : ''}
            ${data.childAge ? `<tr><td style="padding: 12px 0; color: #555; font-weight: bold;">🎂 Child's Age:</td><td style="padding: 12px 0; color: #2d3748;">${data.childAge}</td></tr>` : ''}
            <tr>
              <td style="padding: 12px 0; color: #555; font-weight: bold;">🩺 Service Type:</td>
              <td style="padding: 12px 0; color: #2d3748;">${data.serviceType}</td>
            </tr>
            ${data.preferredDate ? `<tr><td style="padding: 12px 0; color: #555; font-weight: bold;">🗓️ Preferred Date:</td><td style="padding: 12px 0; color: #2d3748;">${data.preferredDate}</td></tr>` : ''}
            ${data.preferredTime ? `<tr><td style="padding: 12px 0; color: #555; font-weight: bold;">⏰ Preferred Time:</td><td style="padding: 12px 0; color: #2d3748;">${data.preferredTime}</td></tr>` : ''}
            ${data.additionalNotes ? `<tr><td style="padding: 12px 0; color: #555; font-weight: bold;">📝 Additional Notes:</td><td style="padding: 12px 0; color: #2d3748;">${data.additionalNotes}</td></tr>` : ''}
          </tbody>
        </table>
        <p style="margin-top: 30px; font-size: 16px; color: #4a5568; line-height: 1.6;">
          Please ensure to confirm this appointment with the parent. If you need to reschedule, please contact them directly.
        </p>
      </div>
      <div style="background-color: #e2e8f0; padding: 25px 40px; font-size: 14px; color: #4a5568; text-align: center;">
        <p style="margin: 0 0 10px;">This is an automated notification from the Tots and Teens Clinic booking system.</p>
        <p style="margin: 0;"><strong>Booked On:</strong> ${bookedOn}</p>
      </div>
    </div>
  `;
};

// Email service with fallback to file logging
export const sendBookingNotification = async (bookingData: BookingData) => {
  const { parentName, email, childName = 'N/A', serviceType = 'General' } = bookingData;
  const clinicEmail = process.env.CLINIC_EMAIL || 'rakeshrevathi2006@gmail.com';
  
  // Create a log entry for the booking attempt
  const logEntry: LoggableData = {
    type: 'booking_attempt',
    parentName,
    email,
    childName,
    serviceType,
    timestamp: new Date().toISOString()
  };

  // Always log the booking attempt
  logData(logEntry);

  // If in development or no API key, just log and return
  if (process.env.NODE_ENV !== 'production' || !process.env.RESEND_API_KEY) {
    const logInfo = {
      type: 'development_booking',
      to: clinicEmail,
      subject: `New Booking: ${childName} - ${serviceType}`,
      data: bookingData,
      timestamp: new Date().toISOString()
    };
    
    console.log('\n=== NEW BOOKING (Not sent - Development Mode) ===');
    console.log(JSON.stringify(logInfo, null, 2));
    
    return { 
      success: true, 
      message: 'Booking logged (development mode)',
      data: logInfo
    };
  }

  // In production, try to send email
  try {
    const { client: resend, fromEmail } = await getUncachableResendClient();
    const emailSubject = `New Booking: ${childName} - ${serviceType}`;

    if (!fromEmail) {
      throw new Error('RESEND_FROM_EMAIL is not set.');
    }
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: clinicEmail,
      subject: emailSubject,
      html: buildEmailTemplate(bookingData),
    });

    if (error) {
      throw new Error(error.message);
    }
    
    return { 
      success: true, 
      message: 'Booking received and confirmation email sent',
      data: {
        to: clinicEmail,
        subject: emailSubject,
        emailId: data?.id
      }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in sendBookingNotification:', error);
    
    logData({
      type: 'error',
      error: errorMessage,
      timestamp: new Date().toISOString(),
      bookingData
    });
    
    return { 
      success: false, 
      message: 'Error processing booking',
      error: errorMessage
    };
  }
};


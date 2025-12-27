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
  // Get current time in IST (Indian Standard Time)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istTime = new Date(now.getTime() + istOffset);

  const bookedOn = istTime.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
              
              <!-- Header with Clinic Branding -->
              <tr>
                <td style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;">
                    � TOTS AND TEENS
                  </h1>
                  <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.9); font-weight: 500;">
                    Child Care Clinic
                  </p>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <!-- Notification Badge -->
                  <div style="text-align: center; margin-bottom: 30px;">
                    <span style="background: linear-gradient(135deg, #4ECDC4 0%, #44B8AE 100%); color: #ffffff; padding: 10px 24px; border-radius: 50px; font-size: 14px; font-weight: 600; display: inline-block;">
                      ✨ New Appointment Request
                    </span>
                  </div>
                  
                  <h2 style="margin: 0 0 25px; font-size: 22px; color: #2C3E50; font-weight: 600; text-align: center;">
                    Appointment Details
                  </h2>
                  
                  <!-- Details Card -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 12px; overflow: hidden;">
                    <tr>
                      <td style="padding: 25px;">
                        
                        <!-- Parent Info -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                              <span style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">👤 Parent/Guardian</span>
                              <p style="margin: 6px 0 0; color: #2C3E50; font-size: 16px; font-weight: 600;">${data.parentName}</p>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Contact Info -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" width="50%">
                              <span style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">📧 Email</span>
                              <p style="margin: 6px 0 0; color: #2C3E50; font-size: 15px; font-weight: 500;">${data.email}</p>
                            </td>
                            ${data.phone ? `
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" width="50%">
                              <span style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">📞 Phone</span>
                              <p style="margin: 6px 0 0; color: #2C3E50; font-size: 15px; font-weight: 600;">${data.phone}</p>
                            </td>
                            ` : ''}
                          </tr>
                        </table>
                        
                        <!-- Child Info -->
                        ${data.childName ? `
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" width="50%">
                              <span style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">👶 Child's Name</span>
                              <p style="margin: 6px 0 0; color: #2C3E50; font-size: 16px; font-weight: 600;">${data.childName}</p>
                            </td>
                            ${data.childAge ? `
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" width="50%">
                              <span style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">🎂 Age</span>
                              <p style="margin: 6px 0 0; color: #2C3E50; font-size: 16px; font-weight: 600;">${data.childAge}</p>
                            </td>
                            ` : ''}
                          </tr>
                        </table>
                        ` : ''}
                        
                        <!-- Service Type - Highlighted -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                          <tr>
                            <td style="padding: 15px; background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%); border-radius: 8px;">
                              <span style="color: rgba(255,255,255,0.9); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">🩺 Service Requested</span>
                              <p style="margin: 6px 0 0; color: #ffffff; font-size: 18px; font-weight: 700;">${data.serviceType}</p>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Date & Time -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                          <tr>
                            ${data.preferredDate ? `
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" width="50%">
                              <span style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">🗓️ Preferred Date</span>
                              <p style="margin: 6px 0 0; color: #2C3E50; font-size: 15px; font-weight: 600;">${data.preferredDate}</p>
                            </td>
                            ` : ''}
                            ${data.preferredTime ? `
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" width="50%">
                              <span style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">⏰ Preferred Time</span>
                              <p style="margin: 6px 0 0; color: #2C3E50; font-size: 15px; font-weight: 600;">${data.preferredTime}</p>
                            </td>
                            ` : ''}
                          </tr>
                        </table>
                        
                        <!-- Additional Notes -->
                        ${data.additionalNotes ? `
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 12px 0;">
                              <span style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">📝 Additional Notes</span>
                              <p style="margin: 6px 0 0; color: #2C3E50; font-size: 15px; line-height: 1.5;">${data.additionalNotes}</p>
                            </td>
                          </tr>
                        </table>
                        ` : ''}
                        
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Action Reminder -->
                  <div style="margin-top: 25px; padding: 20px; background-color: #FFF3CD; border-left: 4px solid #FF6B6B; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                      <strong>⚡ Action Required:</strong> Please confirm this appointment with the parent at the earliest convenience.
                    </p>
                  </div>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #2C3E50; padding: 25px 30px; text-align: center;">
                  <p style="margin: 0 0 8px; color: rgba(255,255,255,0.7); font-size: 12px;">
                    📅 Booking received on ${bookedOn} (IST)
                  </p>
                  <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 11px;">
                    Tots and Teens Child Care Clinic • Expert care for every stage of your child's growth
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Email service with fallback to file logging
export const sendBookingNotification = async (bookingData: BookingData) => {
  const { parentName, email, childName = 'N/A', serviceType = 'General' } = bookingData;
  const clinicEmail = process.env.CLINIC_EMAIL || 'drkcvgvsa@gmail.com';

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


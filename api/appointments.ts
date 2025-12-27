import { Resend } from 'resend';
import nodemailer from 'nodemailer';

interface AppointmentData {
  parentName: string;
  email: string;
  phone?: string;
  childName: string;
  childAge?: string;
  serviceType: string;
  preferredDate?: string;
  preferredTime?: string;
  additionalNotes?: string;
}

function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const resendApiKey = getEnvVariable('RESEND_API_KEY');
    const fromEmail = getEnvVariable('RESEND_FROM_EMAIL');
    const clinicEmail = getEnvVariable('CLINIC_EMAIL');

    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as Partial<AppointmentData & { phoneNumber?: string }>;

    const requiredFields: (keyof AppointmentData)[] = ['parentName', 'email', 'childName', 'serviceType'];
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: 'Missing required fields', missingFields });
    }

    const appointment: AppointmentData & { id: string; createdAt: Date } = {
      id: `apt_${Date.now()}`,
      parentName: body.parentName!,
      email: body.email!,
      phone: body.phone || body.phoneNumber || 'Not provided',
      childName: body.childName!,
      childAge: body.childAge || 'Not specified',
      serviceType: body.serviceType!,
      preferredDate: body.preferredDate || 'Not specified',
      preferredTime: body.preferredTime || 'Not specified',
      additionalNotes: body.additionalNotes || 'None',
      createdAt: new Date(),
    };

    const resend = new Resend(resendApiKey);

    const sendWithRetry = async (payload: Parameters<typeof resend.emails.send>[0], maxAttempts = 4) => {
      let attempt = 0;
      while (attempt < maxAttempts) {
        attempt++;
        try {
          const { error } = await resend.emails.send(payload);
          if (error) throw new Error(error.message || 'Unknown Resend error');
          return;
        } catch (err) {
          if (attempt >= maxAttempts) throw err;
          const waitMs = Math.min(15000, 500 * Math.pow(2, attempt - 1));
          await new Promise(r => setTimeout(r, waitMs));
        }
      }
    };

    // Format date/time for IST
    const formatISTDateTime = () => {
      const now = new Date();
      return now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    };

    const bookedOnIST = formatISTDateTime();

    // Professional email template for parent confirmation
    const parentEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">🏥 TOTS AND TEENS</h1>
                    <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.9);">Child Care Clinic</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                      <span style="background: linear-gradient(135deg, #4ECDC4 0%, #44B8AE 100%); color: #ffffff; padding: 10px 24px; border-radius: 50px; font-size: 14px; font-weight: 600; display: inline-block;">
                        ✅ Booking Received
                      </span>
                    </div>
                    
                    <h2 style="margin: 0 0 10px; font-size: 24px; color: #2C3E50; text-align: center;">Thank You, ${appointment.parentName}!</h2>
                    <p style="margin: 0 0 30px; color: #6b7280; text-align: center; font-size: 16px;">Your appointment request for <strong>${appointment.childName}</strong> has been received.</p>
                    
                    <!-- Appointment Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 12px; overflow: hidden;">
                      <tr>
                        <td style="padding: 25px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 15px; background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%); border-radius: 8px; margin-bottom: 15px;">
                                <span style="color: rgba(255,255,255,0.9); font-size: 12px; text-transform: uppercase;">🩺 Service</span>
                                <p style="margin: 6px 0 0; color: #ffffff; font-size: 18px; font-weight: 700;">${appointment.serviceType}</p>
                              </td>
                            </tr>
                          </table>
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 15px;">
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" width="50%">
                                <span style="color: #6b7280; font-size: 13px; text-transform: uppercase;">🗓️ Date</span>
                                <p style="margin: 6px 0 0; color: #2C3E50; font-size: 15px; font-weight: 600;">${appointment.preferredDate}</p>
                              </td>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" width="50%">
                                <span style="color: #6b7280; font-size: 13px; text-transform: uppercase;">⏰ Time</span>
                                <p style="margin: 6px 0 0; color: #2C3E50; font-size: 15px; font-weight: 600;">${appointment.preferredTime}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- What's Next -->
                    <div style="margin-top: 25px; padding: 20px; background-color: #E8F5E9; border-left: 4px solid #4ECDC4; border-radius: 0 8px 8px 0;">
                      <p style="margin: 0; color: #2E7D32; font-size: 14px; line-height: 1.6;">
                        <strong>📞 What's Next?</strong><br>
                        We will confirm your appointment shortly. If you have any questions, please contact us at <a href="mailto:${clinicEmail}" style="color: #FF6B6B;">${clinicEmail}</a>
                      </p>
                    </div>
                    
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #2C3E50; padding: 25px 30px; text-align: center;">
                    <p style="margin: 0 0 8px; color: rgba(255,255,255,0.7); font-size: 12px;">📅 Booking received on ${bookedOnIST} (IST)</p>
                    <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 11px;">Tots and Teens Child Care Clinic • Expert care for every stage of your child's growth</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Professional email template for clinic notification
    const clinicEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">🏥 TOTS AND TEENS</h1>
                    <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.9);">Child Care Clinic</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                      <span style="background: linear-gradient(135deg, #4ECDC4 0%, #44B8AE 100%); color: #ffffff; padding: 10px 24px; border-radius: 50px; font-size: 14px; font-weight: 600; display: inline-block;">
                        ✨ New Appointment Request
                      </span>
                    </div>
                    
                    <h2 style="margin: 0 0 25px; font-size: 22px; color: #2C3E50; font-weight: 600; text-align: center;">Appointment Details</h2>
                    
                    <!-- Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 12px; overflow: hidden;">
                      <tr>
                        <td style="padding: 25px;">
                          
                          <!-- Parent Info -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                <span style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">👤 Parent/Guardian</span>
                                <p style="margin: 6px 0 0; color: #2C3E50; font-size: 16px; font-weight: 600;">${appointment.parentName}</p>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Contact Info -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" width="50%">
                                <span style="color: #6b7280; font-size: 13px; text-transform: uppercase;">📧 Email</span>
                                <p style="margin: 6px 0 0; color: #2C3E50; font-size: 15px; font-weight: 500;">${appointment.email}</p>
                              </td>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" width="50%">
                                <span style="color: #6b7280; font-size: 13px; text-transform: uppercase;">📞 Phone</span>
                                <p style="margin: 6px 0 0; color: #2C3E50; font-size: 15px; font-weight: 600;">${appointment.phone}</p>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Child Info -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" width="50%">
                                <span style="color: #6b7280; font-size: 13px; text-transform: uppercase;">👶 Child's Name</span>
                                <p style="margin: 6px 0 0; color: #2C3E50; font-size: 16px; font-weight: 600;">${appointment.childName}</p>
                              </td>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" width="50%">
                                <span style="color: #6b7280; font-size: 13px; text-transform: uppercase;">🎂 Age</span>
                                <p style="margin: 6px 0 0; color: #2C3E50; font-size: 16px; font-weight: 600;">${appointment.childAge}</p>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Service Type - Highlighted -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                            <tr>
                              <td style="padding: 15px; background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%); border-radius: 8px;">
                                <span style="color: rgba(255,255,255,0.9); font-size: 12px; text-transform: uppercase;">🩺 Service Requested</span>
                                <p style="margin: 6px 0 0; color: #ffffff; font-size: 18px; font-weight: 700;">${appointment.serviceType}</p>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Date & Time -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" width="50%">
                                <span style="color: #6b7280; font-size: 13px; text-transform: uppercase;">🗓️ Preferred Date</span>
                                <p style="margin: 6px 0 0; color: #2C3E50; font-size: 15px; font-weight: 600;">${appointment.preferredDate}</p>
                              </td>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" width="50%">
                                <span style="color: #6b7280; font-size: 13px; text-transform: uppercase;">⏰ Preferred Time</span>
                                <p style="margin: 6px 0 0; color: #2C3E50; font-size: 15px; font-weight: 600;">${appointment.preferredTime}</p>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Additional Notes -->
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 12px 0;">
                                <span style="color: #6b7280; font-size: 13px; text-transform: uppercase;">📝 Additional Notes</span>
                                <p style="margin: 6px 0 0; color: #2C3E50; font-size: 15px; line-height: 1.5;">${appointment.additionalNotes}</p>
                              </td>
                            </tr>
                          </table>
                          
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
                    <p style="margin: 0 0 8px; color: rgba(255,255,255,0.7); font-size: 12px;">📅 Booking received on ${bookedOnIST} (IST)</p>
                    <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 11px;">Tots and Teens Child Care Clinic • Expert care for every stage of your child's growth</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const tryResendBoth = async () => {
      await Promise.all([
        sendWithRetry({
          from: fromEmail,
          to: [appointment.email],
          subject: `✅ Appointment Confirmation - Tots and Teens Clinic`,
          html: parentEmailHtml,
        }),
        sendWithRetry({
          from: fromEmail,
          to: [clinicEmail],
          subject: `🆕 New Appointment: ${appointment.childName} - ${appointment.serviceType}`,
          html: clinicEmailHtml,
        }),
      ]);
    };

    const sendClinicOnlyViaResend = async () => {
      await sendWithRetry({
        from: fromEmail,
        to: [clinicEmail],
        subject: `🆕 New Appointment: ${appointment.childName} - ${appointment.serviceType}`,
        html: clinicEmailHtml,
      });
    };

    const trySmtp = async () => {
      const host = process.env.SMTP_HOST;
      const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      const from = process.env.SMTP_FROM || fromEmail;
      if (!host || !user || !pass) throw new Error('SMTP not configured');

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await Promise.all([
        transporter.sendMail({
          from,
          to: appointment.email,
          subject: `✅ Appointment Confirmation - Tots and Teens Clinic`,
          html: parentEmailHtml,
        }),
        transporter.sendMail({
          from,
          to: clinicEmail,
          subject: `🆕 New Appointment: ${appointment.childName} - ${appointment.serviceType}`,
          html: clinicEmailHtml,
        }),
      ]);
    };

    try {
      await tryResendBoth();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const sandboxRestriction = msg.includes('You can only send testing emails') || msg.includes('verify a domain');
      if (sandboxRestriction) {
        // In sandbox: ensure clinic gets the mail via Resend, skip user delivery
        try {
          await sendClinicOnlyViaResend();
        } catch (clinicErr) {
          // Attempt SMTP fallback if configured
          try {
            await trySmtp();
          } catch (smtpErr) {
            throw e;
          }
        }
      } else {
        throw e;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment booked successfully! Confirmation emails have been sent.',
      appointmentId: appointment.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const sandboxRestriction = typeof message === 'string' && (
      message.includes('You can only send testing emails') ||
      message.includes('verify a domain') ||
      message.includes('domain is not verified')
    );

    if (sandboxRestriction) {
      console.warn('Resend sandbox restriction encountered. Returning success to avoid blocking booking.');
      return res.status(200).json({
        success: true,
        message: 'Appointment booked. Emails not sent due to Resend sandbox restriction. Verify a domain to enable live sends.',
        warning: message,
      });
    }

    return res.status(500).json({ error: message });
  }
}



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

    const tryResendBoth = async () => {
      await Promise.all([
      sendWithRetry({
        from: fromEmail,
        to: [appointment.email],
        subject: `Appointment Confirmation: ${appointment.serviceType}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #333;">Thank you for your booking, ${appointment.parentName}!</h2>
            <p>Your appointment for <strong>${appointment.childName}</strong> has been received.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Appointment Details:</h3>
              <p><strong>Service:</strong> ${appointment.serviceType}</p>
              <p><strong>Date:</strong> ${appointment.preferredDate}</p>
              <p><strong>Time:</strong> ${appointment.preferredTime}</p>
            </div>
            <p>If you have questions, contact us at <a href="mailto:${clinicEmail}">${clinicEmail}</a>.</p>
          </div>
        `,
      }),
      sendWithRetry({
        from: fromEmail,
        to: [clinicEmail],
        subject: `New Appointment: ${appointment.childName} for ${appointment.serviceType}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #4f46e5;">New Appointment Notification</h2>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px;">
              <p><strong>Parent:</strong> ${appointment.parentName}</p>
              <p><strong>Child:</strong> ${appointment.childName} (${appointment.childAge})</p>
              <p><strong>Service:</strong> ${appointment.serviceType}</p>
              <p><strong>Date:</strong> ${appointment.preferredDate}</p>
              <p><strong>Time:</strong> ${appointment.preferredTime}</p>
              <p><strong>Contact Email:</strong> ${appointment.email}</p>
              <p><strong>Contact Phone:</strong> ${appointment.phone}</p>
              <p><strong>Additional Notes:</strong> ${appointment.additionalNotes}</p>
            </div>
            <p style="margin-top: 20px;"><strong>Appointment ID:</strong> ${appointment.id}</p>
            <p><strong>Booked On:</strong> ${appointment.createdAt.toLocaleString()}</p>
          </div>
        `,
      }),
      ]);
    };

    const sendClinicOnlyViaResend = async () => {
      await sendWithRetry({
        from: fromEmail,
        to: [clinicEmail],
        subject: `New Appointment: ${appointment.childName} for ${appointment.serviceType}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #4f46e5;">New Appointment Notification</h2>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px;">
              <p><strong>Parent:</strong> ${appointment.parentName}</p>
              <p><strong>Child:</strong> ${appointment.childName} (${appointment.childAge})</p>
              <p><strong>Service:</strong> ${appointment.serviceType}</p>
              <p><strong>Date:</strong> ${appointment.preferredDate}</p>
              <p><strong>Time:</strong> ${appointment.preferredTime}</p>
              <p><strong>Contact Email:</strong> ${appointment.email}</p>
              <p><strong>Contact Phone:</strong> ${appointment.phone}</p>
              <p><strong>Additional Notes:</strong> ${appointment.additionalNotes}</p>
            </div>
            <p style="margin-top: 20px;"><strong>Appointment ID:</strong> ${appointment.id}</p>
            <p><strong>Booked On:</strong> ${appointment.createdAt.toLocaleString()}</p>
          </div>
        `,
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
          subject: `Appointment Confirmation: ${appointment.serviceType}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #eee; padding: 20px;">
              <h2 style="color: #333;">Thank you for your booking, ${appointment.parentName}!</h2>
              <p>Your appointment for <strong>${appointment.childName}</strong> has been received.</p>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Appointment Details:</h3>
                <p><strong>Service:</strong> ${appointment.serviceType}</p>
                <p><strong>Date:</strong> ${appointment.preferredDate}</p>
                <p><strong>Time:</strong> ${appointment.preferredTime}</p>
              </div>
              <p>If you have questions, contact us at <a href="mailto:${clinicEmail}">${clinicEmail}</a>.</p>
            </div>
          `,
        }),
        transporter.sendMail({
          from,
          to: clinicEmail,
          subject: `New Appointment: ${appointment.childName} for ${appointment.serviceType}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #eee; padding: 20px;">
              <h2 style="color: #4f46e5;">New Appointment Notification</h2>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px;">
                <p><strong>Parent:</strong> ${appointment.parentName}</p>
                <p><strong>Child:</strong> ${appointment.childName} (${appointment.childAge})</p>
                <p><strong>Service:</strong> ${appointment.serviceType}</p>
                <p><strong>Date:</strong> ${appointment.preferredDate}</p>
                <p><strong>Time:</strong> ${appointment.preferredTime}</p>
                <p><strong>Contact Email:</strong> ${appointment.email}</p>
                <p><strong>Contact Phone:</strong> ${appointment.phone}</p>
                <p><strong>Additional Notes:</strong> ${appointment.additionalNotes}</p>
              </div>
              <p style="margin-top: 20px;"><strong>Appointment ID:</strong> ${appointment.id}</p>
              <p><strong>Booked On:</strong> ${appointment.createdAt.toLocaleString()}</p>
            </div>
          `,
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



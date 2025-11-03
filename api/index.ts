import express from 'express';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

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

app.post('/appointments', async (req, res) => {
  try {
    const resendApiKey = getEnvVariable('RESEND_API_KEY');
    const fromEmail = getEnvVariable('RESEND_FROM_EMAIL');
    const clinicEmail = getEnvVariable('CLINIC_EMAIL');

    const body = req.body as Partial<AppointmentData>;

    const requiredFields: (keyof AppointmentData)[] = ['parentName', 'email', 'childName', 'serviceType'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ error: 'Missing required fields', missingFields });
    }

    const appointment: AppointmentData & { id: string; createdAt: Date } = {
      id: `apt_${Date.now()}`,
      parentName: body.parentName!,
      email: body.email!,
      phone: body.phone || 'Not provided',
      childName: body.childName!,
      childAge: body.childAge || 'Not specified',
      serviceType: body.serviceType!,
      preferredDate: body.preferredDate || 'Not specified',
      preferredTime: body.preferredTime || 'Not specified',
      additionalNotes: body.additionalNotes || 'None',
      createdAt: new Date(),
    };

    console.log('Processing appointment:', JSON.stringify(appointment, null, 2));

    const resend = new Resend(resendApiKey);

    console.log('Sending emails...');
    const emailPromise = Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: [appointment.email],
        subject: `Appointment Confirmation: ${appointment.serviceType}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #333;">Thank you for your booking, ${appointment.parentName}!</h2>
            <p>Your appointment for <strong>${appointment.childName}</strong> has been successfully scheduled.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Appointment Details:</h3>
              <p><strong>Service:</strong> ${appointment.serviceType}</p>
              <p><strong>Date:</strong> ${appointment.preferredDate}</p>
              <p><strong>Time:</strong> ${appointment.preferredTime}</p>
            </div>

            <p>If you have any questions, please contact us at <a href="mailto:${clinicEmail}">${clinicEmail}</a>.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply.</p>
          </div>
        `,
      }),
      resend.emails.send({
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

    console.log('Waiting for emails to be sent...');

    emailPromise.then(() => {
      console.log('Emails sent successfully!');
      return res.status(200).json({
        success: true,
        message: 'Appointment booked successfully! Confirmation emails have been sent.',
        appointmentId: appointment.id,
      });
    }).catch(error => {
      console.error('Error sending emails:', error);
      return res.status(500).json({ error: 'Failed to send emails.' });
    });

  } catch (error) {
    console.error('Error processing appointment:', error);
    
    let errorMessage = 'Failed to process appointment.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return res.status(500).json({ error: errorMessage });
  }
});

export default app;

// api/appointments.ts
import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { type Appointment } from "../shared/schema";

function getClientConfirmationEmail(appointment: Appointment) {
  const subject = `Appointment Confirmation - Tots and Teens Child Care Clinic`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', Arial, sans-serif;
      background-color: #f8f9fa;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      color: #ffffff;
      margin: 8px 0 0 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #2C3E50;
      margin-bottom: 20px;
    }
    .info-box {
      background-color: #f8f9fa;
      border-left: 4px solid #FF6B6B;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #e9ecef;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #2C3E50;
      min-width: 140px;
    }
    .info-value {
      color: #495057;
    }
    .highlight {
      background-color: #fff3cd;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
      border-left: 4px solid #ffc107;
    }
    .contact-section {
      background-color: #4ECDC4;
      color: #ffffff;
      padding: 25px;
      border-radius: 8px;
      margin: 30px 0;
      text-align: center;
    }
    .contact-section h3 {
      margin: 0 0 15px 0;
      font-size: 20px;
    }
    .contact-section p {
      margin: 5px 0;
      font-size: 14px;
    }
    .footer {
      background-color: #2C3E50;
      color: #ffffff;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
    .footer p {
      margin: 5px 0;
      opacity: 0.9;
    }
    .social-links {
      margin: 15px 0;
    }
    .social-links a {
      color: #ffffff;
      text-decoration: none;
      margin: 0 10px;
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Appointment Confirmed!</h1>
      <p>Tots and Teens Child Care Clinic</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Dear ${appointment.parentName},
      </div>
      
      <p style="color: #495057; line-height: 1.6;">
        Thank you for choosing Tots and Teens Child Care Clinic! We're delighted to confirm your appointment with Dr. Amudhadevi S.
      </p>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #2C3E50;">Appointment Details</h3>
        <div class="info-row">
          <span class="info-label">Child's Name:</span>
          <span class="info-value">${appointment.childName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Age:</span>
          <span class="info-value">${appointment.childAge} years</span>
        </div>
        <div class="info-row">
          <span class="info-label">Service:</span>
          <span class="info-value">${appointment.serviceType}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date:</span>
          <span class="info-value">${new Date(appointment.preferredDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Time:</span>
          <span class="info-value">${appointment.preferredTime}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Contact:</span>
          <span class="info-value">${appointment.phoneNumber}</span>
        </div>
      </div>
      
      ${appointment.additionalNotes ? `
      <div class="highlight">
        <strong>Your Notes:</strong><br/>
        ${appointment.additionalNotes}
      </div>
      ` : ''}
      
      <div class="contact-section">
        <h3>📍 Visit Us At</h3>
        <p><strong>Tots and Teens Child Care Clinic</strong></p>
        <p>Arisipalayam Main Rd, Near St. Mary's School</p>
        <p>Salem, Tamil Nadu 636009</p>
        <p style="margin-top: 15px;"><strong>📞 Contact:</strong> 63792 38880</p>
      </div>
      
      <p style="color: #6c757d; font-size: 14px; line-height: 1.6;">
        <strong>Please arrive 10 minutes early.</strong> If you need to reschedule or have any questions, feel free to call us at 63792 38880.
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Tots and Teens Child Care Clinic</strong></p>
      <p>Expert care for every stage of your child's growth</p>
      <div class="social-links">
        <a href="https://www.instagram.com/amudha1429/">Follow us on Instagram @amudha1429</a>
      </div>
      <p style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
        © ${new Date().getFullYear()} Tots and Teens Child Care Clinic. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html };
}

function getClinicNotificationEmail(appointment: Appointment) {
  const subject = `New Appointment Booking - ${appointment.childName}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', Arial, sans-serif;
      background-color: #f8f9fa;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%);
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      padding: 30px;
    }
    .alert {
      background-color: #fff3cd;
      border: 2px solid #ffc107;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      text-align: center;
      font-weight: 600;
      color: #856404;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .info-table td {
      padding: 12px;
      border-bottom: 1px solid #e9ecef;
    }
    .info-table td:first-child {
      font-weight: 600;
      color: #2C3E50;
      width: 180px;
    }
    .info-table td:last-child {
      color: #495057;
    }
    .notes-section {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
      border-left: 4px solid #FF6B6B;
    }
    .footer {
      background-color: #2C3E50;
      color: #ffffff;
      padding: 20px;
      text-align: center;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 New Appointment Booking</h1>
    </div>
    
    <div class="content">
      <div class="alert">
        NEW APPOINTMENT REQUEST
      </div>
      
      <table class="info-table">
        <tr>
          <td>Booking ID:</td>
          <td>${appointment.id}</td>
        </tr>
        <tr>
          <td>Parent/Guardian:</td>
          <td><strong>${appointment.parentName}</strong></td>
        </tr>
        <tr>
          <td>Child's Name:</td>
          <td><strong>${appointment.childName}</strong></td>
        </tr>
        <tr>
          <td>Age:</td>
          <td>${appointment.childAge} years</td>
        </tr>
        <tr>
          <td>Phone Number:</td>
          <td><a href="tel:+91${appointment.phoneNumber}" style="color: #FF6B6B; text-decoration: none;">${appointment.phoneNumber}</a></td>
        </tr>
        <tr>
          <td>Email:</td>
          <td><a href="mailto:${appointment.email}" style="color: #FF6B6B; text-decoration: none;">${appointment.email}</a></td>
        </tr>
        <tr>
          <td>Service Type:</td>
          <td><strong>${appointment.serviceType}</strong></td>
        </tr>
        <tr>
          <td>Preferred Date:</td>
          <td><strong>${new Date(appointment.preferredDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></td>
        </tr>
        <tr>
          <td>Preferred Time:</td>
          <td><strong>${appointment.preferredTime}</strong></td>
        </tr>
        <tr>
          <td>Booked On:</td>
          <td>${new Date(appointment.createdAt).toLocaleString('en-IN')}</td>
        </tr>
      </table>
      
      ${appointment.additionalNotes ? `
      <div class="notes-section">
        <strong style="color: #2C3E50;">Additional Notes:</strong><br/>
        <p style="margin: 10px 0 0 0; color: #495057;">${appointment.additionalNotes}</p>
      </div>
      ` : ''}
      
      <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
        Please contact the patient to confirm the appointment at your earliest convenience.
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Tots and Teens Child Care Clinic</strong></p>
      <p>Automated Appointment Booking System</p>
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Validate environment variables
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({
      message: "Server configuration error. Please contact support.",
    });
  }
  
  if (!process.env.RESEND_FROM_EMAIL) {
    console.error("RESEND_FROM_EMAIL is not set");
    return res.status(500).json({
      message: "Server configuration error. Please contact support.",
    });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const appointment = {
      ...req.body,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    const clientEmail = getClientConfirmationEmail(appointment);
    const clinicEmail = getClinicNotificationEmail(appointment);

    await Promise.all([
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: appointment.email,
        subject: clientEmail.subject,
        html: clientEmail.html,
      }),
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: "rakeshrevathi2006@gmail.com",
        subject: clinicEmail.subject,
        html: clinicEmail.html,
      }),
    ]);

    return res.status(200).json({
      message: "Appointment received and email sent (no database storage)",
    });
  } catch (error) {
    console.error("Appointment booking error:", error);
    return res.status(500).json({
      message: "Failed to process appointment. Please try again.",
    });
  }
}

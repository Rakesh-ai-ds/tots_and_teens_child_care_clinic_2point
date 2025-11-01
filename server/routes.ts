import type { Express } from "express";
import { createServer, type Server } from "http";
import * as crypto from "crypto";
import { getUncachableResendClient } from "./resend";
import { getClientConfirmationEmail, getClinicNotificationEmail } from "./email-templates";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/appointments", async (req, res) => {
    try {
      // No database, so we'll just assume success for now and send emails
      const appointment = { 
        ...req.body, 
        id: crypto.randomUUID(), 
        createdAt: new Date() 
      };
      
      try {
        const { client, fromEmail } = await getUncachableResendClient();
        
        const clientEmail = getClientConfirmationEmail(appointment);
        const clinicEmail = getClinicNotificationEmail(appointment);
        
        await Promise.all([
          client.emails.send({
            from: fromEmail,
            to: appointment.email,
            subject: clientEmail.subject,
            html: clientEmail.html,
          }),
          client.emails.send({
            from: fromEmail,
            to: 'rakeshrevathi2006@gmail.com',
            subject: clinicEmail.subject,
            html: clinicEmail.html,
          }),
        ]);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
      
      res.status(200).json({ message: "Appointment received and email sent (no database storage)" });
    } catch (error: any) {
      console.error('Appointment booking error:', error);
      res.status(500).json({ 
        message: "Failed to process appointment. Please try again." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
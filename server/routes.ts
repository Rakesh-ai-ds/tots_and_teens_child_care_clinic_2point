import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema } from "@shared/schema";
import { getUncachableResendClient } from "./resend";
import { getClientConfirmationEmail, getClinicNotificationEmail } from "./email-templates";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      
      const appointment = await storage.createAppointment(validatedData);
      
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
      
      res.status(201).json(appointment);
    } catch (error: any) {
      console.error('Appointment booking error:', error);
      
      if (error.name === 'ZodError') {
        res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to book appointment. Please try again." 
        });
      }
    }
  });

  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

import { z } from "zod";

export const insertAppointmentSchema = z.object({
  parentName: z.string().min(2, "Parent name must be at least 2 characters"),
  childName: z.string().min(2, "Child name must be at least 2 characters"),
  childAge: z.coerce.number().min(0, "Age must be positive").max(18, "Age must be 18 or under"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  email: z.string().email("Invalid email address"),
  serviceType: z.enum([
    "General Pediatrics",
    "Developmental Intervention", 
    "Adolescent Health",
    "Vaccination Services"
  ]),
  preferredDate: z.string().min(1, "Please select a date"),
  preferredTime: z.string().min(1, "Please select a time slot"),
  additionalNotes: z.string().optional(),
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = InsertAppointment & { id: string; createdAt: Date };

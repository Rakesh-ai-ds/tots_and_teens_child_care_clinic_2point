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

// Shared handler to support both '/appointments' and '/api/appointments' in local dev
const handleAppointmentPost: Parameters<typeof app.post>[1] = async (req, res) => {
	try {
		const resendApiKey = getEnvVariable('RESEND_API_KEY');
		const fromEmail = getEnvVariable('RESEND_FROM_EMAIL');
		const clinicEmail = getEnvVariable('CLINIC_EMAIL');

		const body = req.body as Partial<AppointmentData & { phoneNumber?: string }>;

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

		Promise.all([
			sendWithRetry({
				from: fromEmail,
				to: [appointment.email],
				subject: `Appointment Confirmation: ${appointment.serviceType}`,
				html: `<div>Thank you ${appointment.parentName}. Service: ${appointment.serviceType}. Date: ${appointment.preferredDate}. Time: ${appointment.preferredTime}.</div>`,
			}),
			sendWithRetry({
				from: fromEmail,
				to: [clinicEmail],
				subject: `New Appointment: ${appointment.childName} for ${appointment.serviceType}`,
				html: `<div>Parent: ${appointment.parentName}. Child: ${appointment.childName}. Phone: ${appointment.phone}.</div>`,
			}),
		])
			.then(() => {
				return res.status(200).json({
					success: true,
					message: 'Appointment booked successfully! Confirmation emails have been sent.',
					appointmentId: appointment.id,
				});
			})
			.catch(error => {
				const message = error instanceof Error ? error.message : (typeof error === 'string' ? error : 'Failed to send emails.');
				const sandboxRestriction = typeof message === 'string' && (
					message.includes('You can only send testing emails') ||
					message.includes('verify a domain') ||
					message.includes('domain is not verified')
				);
				if (sandboxRestriction) {
					return res.status(200).json({
						success: true,
						message: 'Appointment booked. Emails not sent due to Resend sandbox restriction. Verify a domain to enable live sends.',
						appointmentId: appointment.id,
						warning: message,
					});
				}
				return res.status(500).json({ error: message });
			});
	} catch (error) {
		let errorMessage = 'Failed to process appointment.';
		if (error instanceof Error) errorMessage = error.message;
		return res.status(500).json({ error: errorMessage });
	}
};

app.post('/appointments', handleAppointmentPost);
app.post('/api/appointments', handleAppointmentPost);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3002;
app.listen(PORT, () => {
	console.log(`API server listening on http://localhost:${PORT}`);
});


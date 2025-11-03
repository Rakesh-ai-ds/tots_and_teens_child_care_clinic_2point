# Vercel Deployment Guide

This project has been configured for deployment on Vercel with serverless functions.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A GitHub repository with your code pushed
3. A Resend account and API key

## Deployment Steps

### 1. Push to GitHub

Make sure all your changes are committed and pushed to your GitHub repository:

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the project settings

### 3. Configure Environment Variables

In the Vercel project settings, go to **Settings → Environment Variables** and add:

- `RESEND_API_KEY`: Your Resend API key (get it from https://resend.com/api-keys)
- `RESEND_FROM_EMAIL`: The email address you verified in Resend (e.g., `noreply@yourdomain.com`)

**Important**: 
- Add these for **Production**, **Preview**, and **Development** environments
- After adding environment variables, redeploy your project

### 4. Deploy

Vercel will automatically:
- Detect it's a Vite project
- Run `npm run build`
- Deploy the static files to CDN
- Deploy API routes as serverless functions

### 5. Verify Deployment

1. After deployment, visit your Vercel URL
2. Test the booking form
3. Check that emails are being sent via Resend

## Project Structure

```
ResendBooker/
├── api/                  # Vercel serverless functions
│   └── appointments.ts   # Email API endpoint
├── client/               # React/Vite frontend
│   ├── src/
│   └── index.html
├── shared/               # Shared TypeScript schemas
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies and scripts
```

## API Endpoint

The API endpoint `/api/appointments` is deployed as a Vercel serverless function:
- **Method**: POST
- **Content-Type**: application/json
- **Body**: Appointment data matching the schema in `shared/schema.ts`

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Verify TypeScript compilation passes: `npm run check`

### API Not Working
- Verify environment variables are set in Vercel dashboard
- Check Vercel function logs in the dashboard
- Ensure Resend API key is valid and has proper permissions

### Email Not Sending
- Verify `RESEND_FROM_EMAIL` is a verified domain/email in Resend
- Check Resend dashboard for email logs
- Review Vercel function logs for errors

## Local Development

To test locally before deploying:

```bash
npm install
npm run dev
```

For testing the API locally with Vercel:

```bash
npx vercel dev
```

Make sure to set environment variables in `.env.local`:
```
RESEND_API_KEY=your_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```



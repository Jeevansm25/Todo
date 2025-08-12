import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requiredEnvVars = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    SMTP_EMAIL: process.env.SMTP_EMAIL,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  const hasAllRequired = missingVars.length === 0;

  return Response.json({
    success: hasAllRequired,
    message: hasAllRequired ? 'All required environment variables are set' : 'Missing required environment variables',
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      ...requiredEnvVars
    },
    missing: missingVars,
    recommendations: {
      NEXTAUTH_SECRET: 'Generate a random string for session security',
      NEXTAUTH_URL: 'Set to http://localhost:3000 for development',
      DATABASE_URL: 'Your PostgreSQL connection string',
      SMTP_EMAIL: 'Your Gmail address for email notifications',
      SMTP_PASSWORD: 'Your Gmail app password'
    }
  });
}

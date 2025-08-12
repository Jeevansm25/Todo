# Gmail SMTP Setup Guide

## Quick Fix for Current Error

The error you're seeing is because Gmail SMTP credentials are not configured. Follow these steps:

## Method 1: App Password (Recommended for quick setup)

### 1. Enable 2-Factor Authentication
- Go to [Google Account Security](https://myaccount.google.com/security)
- Enable 2-Step Verification if not already enabled

### 2. Generate App Password
- Go to [App Passwords](https://myaccount.google.com/apppasswords)
- Select "Mail" and "Other (Custom name)"
- Enter a name like "Todo App"
- Copy the 16-character password

### 3. Create Environment File
Create a `.env` file in your project root:

```bash
# Gmail SMTP Configuration
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password

# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## Method 2: OAuth2 (More Secure, Professional)

### 1. Create Google Cloud Project
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing one
- Enable Gmail API

### 2. Create OAuth2 Credentials
- Go to APIs & Services → Credentials
- Create OAuth 2.0 Client ID
- Set application type to "Web application"
- Add authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
  - `http://localhost:3000`

### 3. Get Refresh Token
- Use the OAuth2 playground or implement OAuth2 flow
- Get refresh token for your email

### 4. Environment Variables
```bash
# Gmail SMTP Configuration (OAuth2)
SMTP_EMAIL=your-email@gmail.com
SMTP_CLIENT_ID=your-oauth-client-id
SMTP_CLIENT_SECRET=your-oauth-client-secret
SMTP_REFRESH_TOKEN=your-refresh-token

# Other variables...
```

## Testing

After setting up, restart your development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Troubleshooting

### Common Issues:

1. **"Username and Password not accepted"**
   - Use App Password, not your regular Gmail password
   - Ensure 2FA is enabled

2. **"Less secure app access"**
   - Google no longer supports this
   - Use App Password or OAuth2

3. **"Invalid credentials"**
   - Double-check environment variable names
   - Ensure no extra spaces in values

### Security Notes:

- Never commit `.env` files to git
- Use App Passwords instead of your main password
- OAuth2 is more secure for production applications
- Rotate App Passwords regularly

## Alternative Email Services

If Gmail continues to cause issues, consider:
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)
- **Resend** (free tier: 3,000 emails/month)

These services are designed for application emails and have better deliverability.

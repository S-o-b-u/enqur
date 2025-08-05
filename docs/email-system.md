# Email Notification System

## Overview

The Enqur application includes an email notification system that sends emails to users when they generate QR codes. This document explains how the system works and how to configure it.

## Features

- Sends email notifications when users generate QR codes
- Respects user preferences (users can enable/disable email notifications in their profile)
- Uses Nodemailer for sending emails
- Configurable email templates

## Implementation

### Components

1. **Email Utility (`src/backend/utils/email.ts`)**
   - Contains the Nodemailer configuration
   - Defines email templates and sending functions

2. **QR Code Generation API (`src/app/api/qr/generate/route.ts`)**
   - Checks user's email notification preference
   - Calls the email utility to send notifications when appropriate

3. **User Profile API (`src/app/api/user/profile/route.ts`)**
   - Handles updating the user's email notification preference

4. **User Model (`src/backend/models/User.ts`)**
   - Includes the `emailNotifications` field (boolean, default: true)

5. **Profile Page (`src/app/profile/page.tsx`)**
   - Provides UI for users to toggle email notifications

## Configuration

The email system is configured through environment variables in the `.env.local` file:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Gmail Configuration

If using Gmail as your SMTP provider:

1. Enable 2-Step Verification on your Google account
2. Generate an App Password for the application
3. Use this App Password in the `EMAIL_PASS` environment variable

## Email Flow

1. User generates a QR code
2. System checks if the user has email notifications enabled
3. If enabled, system sends an email with QR code details
4. Email includes a link to view the QR code in the dashboard

## Customizing Email Templates

Email templates are defined in the `sendQRCodeGenerationEmail` function in `src/backend/utils/email.ts`. To customize the template:

1. Edit the HTML content in the `html` property of the `sendMail` function
2. You can use variables like `${qrLink}` and `${qrDesign}` in the template
3. Update the styling to match your application's branding

## Error Handling

The system is designed to continue functioning even if email sending fails:

1. Email sending errors are caught and logged
2. The QR code generation process completes successfully regardless of email status
3. No error is returned to the user if email sending fails

## Future Improvements

- Add more email templates (welcome email, password reset, etc.)
- Implement email queue for better performance
- Add email analytics tracking
- Support for more complex email templates with images
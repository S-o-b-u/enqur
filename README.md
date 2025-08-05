## Deployment to Vercel

When deploying to Vercel, make sure to set the following environment variables in your Vercel project settings:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_SECURE=false
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
NEXT_PUBLIC_APP_URL=https://your-vercel-deployment-url.vercel.app
```

### Important Notes for Vercel Deployment

1. Make sure to update `NEXT_PUBLIC_APP_URL` to your actual Vercel deployment URL
2. If you encounter issues with the QR code frameText not appearing, check that the canvas library is properly installed and configured in your Vercel deployment
3. For the LightRays background component, ensure that the WebGL context is properly initialized

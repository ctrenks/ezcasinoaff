# Required Environment Variables for Vercel

Make sure these are set in your Vercel Project Settings → Environment Variables:

## Authentication (Required)

Either of these works (use the one you already have):

```
AUTH_SECRET=your-random-secret-here
```

OR (legacy NextAuth v4 naming):

```
NEXTAUTH_SECRET=your-random-secret-here
```

To generate a secure secret, run:

```bash
openssl rand -base64 32
```

## Database (Required)

```
DATABASE_PRISMA_URL=your-postgres-connection-url
```

## Email Provider (Resend)

```
RESEND_API_KEY=your-resend-api-key
```

## OAuth Providers (Optional)

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Important Notes

1. **AUTH_SECRET** is critical for email verification to work. Without it, you'll get verification errors.

2. After adding or changing environment variables in Vercel, you must **redeploy** your application for them to take effect.

3. Make sure the email link domain matches your Vercel deployment URL.

## Troubleshooting Verification Errors

If you're getting "Verification" errors when clicking email links:

1. Verify `AUTH_SECRET` or `NEXTAUTH_SECRET` is set in Vercel
2. Redeploy after setting environment variables
3. Check that your Vercel domain matches what's in the email link
4. Email verification links expire after some time - request a new link if needed
5. Verification tokens can only be used once - request a new link if you already clicked it

## Setting Environment Variables in Vercel

1. Go to your Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with its value
5. Select which environments (Production, Preview, Development)
6. Click "Save"
7. Redeploy your application

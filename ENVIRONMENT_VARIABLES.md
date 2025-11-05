# Required Environment Variables for Vercel

Make sure these are set in your Vercel Project Settings → Environment Variables:

## Authentication (Required)

### Auth Secret

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

### Auth URL (Required for Production)

Set your production URL to ensure HTTPS redirects work correctly:

```
NEXTAUTH_URL=https://www.ezcasinoaff.com
```

OR (Auth.js v5 naming):

```
AUTH_URL=https://www.ezcasinoaff.com
```

**Important:** Without this, sign-out and callback URLs will use HTTP instead of HTTPS, causing browser security warnings.

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

## Google reCAPTCHA Enterprise (Contact Form)

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeQTAMsAAAAANPW7z_vSrmq_mvf-t7zlX9ol8R6
RECAPTCHA_PROJECT_ID=slot-bot-captcha
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
```

**Note**: See `RECAPTCHA_ENTERPRISE_SETUP.md` for detailed setup instructions.

## Setting Environment Variables in Vercel

1. Go to your Vercel Dashboard
2. Select your project (ezcasinoaff)
3. Go to Settings → Environment Variables
4. Add each variable with its value:
   - `NEXTAUTH_SECRET` (or `AUTH_SECRET`)
   - `NEXTAUTH_URL=https://www.ezcasinoaff.com` (or `AUTH_URL`)
   - `DATABASE_PRISMA_URL`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - `RECAPTCHA_PROJECT_ID`
   - `GOOGLE_APPLICATION_CREDENTIALS_JSON`
5. Select which environments (Production, Preview, Development)
6. Click "Save"
7. **Redeploy your application** for changes to take effect

## Quick Fix for HTTP Warning

To fix the HTTP/HTTPS warning on sign-out:

1. Go to Vercel Dashboard → ezcasinoaff → Settings → Environment Variables
2. Add: `NEXTAUTH_URL` with value `https://www.ezcasinoaff.com`
3. Redeploy the application
4. The sign-out and all auth callbacks will now use HTTPS

# Environment Variables - PayPal Addition

## New Variables Required for PayPal Integration

Add these to your `.env` file:

```bash
# =================================
# PayPal Configuration
# =================================

# PayPal API Credentials (get from https://developer.paypal.com/)
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_secret_here

# PayPal Mode: 'sandbox' for testing, 'live' for production
PAYPAL_MODE=sandbox

# Public PayPal Mode (for client-side components)
NEXT_PUBLIC_PAYPAL_MODE=sandbox
```

## Getting PayPal Credentials

### For Development/Testing (Sandbox):

1. Go to https://developer.paypal.com/
2. Log in or create a developer account
3. Click "Dashboard" → "Apps & Credentials"
4. Switch to "Sandbox" tab
5. Click "Create App" or select an existing app
6. Copy:
   - **Client ID** → `PAYPAL_CLIENT_ID`
   - **Secret** → `PAYPAL_CLIENT_SECRET`

### For Production (Live):

1. Same steps as above
2. Switch to "Live" tab instead of "Sandbox"
3. **Important**: Only use live credentials when ready for real payments!

## Example `.env` File

```bash
# Database
DATABASE_PRISMA_URL=postgresql://...

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
AUTH_SECRET=your-secret-here

# Email (Resend)
RESEND_API_KEY=re_xxxxx

# PayPal - SANDBOX (for testing)
PAYPAL_CLIENT_ID=AZxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_CLIENT_SECRET=ELxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_MODE=sandbox
NEXT_PUBLIC_PAYPAL_MODE=sandbox

# When ready for production, change to:
# PAYPAL_MODE=live
# NEXT_PUBLIC_PAYPAL_MODE=live
# And update credentials to live ones
```

## Testing vs Production

### Testing (Sandbox):

- Set `PAYPAL_MODE=sandbox`
- Set `NEXT_PUBLIC_PAYPAL_MODE=sandbox`
- Use sandbox credentials
- No real money involved
- Use test PayPal accounts

### Production (Live):

- Set `PAYPAL_MODE=live`
- Set `NEXT_PUBLIC_PAYPAL_MODE=live`
- Use live credentials
- Real payments processed
- Use real PayPal accounts

## Security Notes

1. **Never commit** `.env` file to git
2. `.env` should be in `.gitignore`
3. Keep credentials secure
4. Rotate secrets regularly
5. Use different credentials for dev/staging/production

## Webhook Configuration

After deploying, configure PayPal webhook:

**Webhook URL**: `https://yourdomain.com/api/paypal/webhook`

**Events to subscribe to**:

- `PAYMENT.CAPTURE.COMPLETED`
- `PAYMENT.CAPTURE.REFUNDED`

Configure at: https://developer.paypal.com/dashboard/ → Your App → Webhooks

## Verification

To verify your PayPal setup is working:

```bash
# Check if variables are set
echo $PAYPAL_CLIENT_ID
echo $PAYPAL_MODE

# Or in Node.js
node -e "console.log(process.env.PAYPAL_CLIENT_ID)"
```

## All Environment Variables

For complete reference, your `.env` should include:

```bash
# =================================
# Database
# =================================
DATABASE_PRISMA_URL=postgresql://...

# =================================
# Authentication
# =================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
AUTH_SECRET=...
GOOGLE_CLIENT_ID=... (optional)
GOOGLE_CLIENT_SECRET=... (optional)

# =================================
# Email Service
# =================================
RESEND_API_KEY=...

# =================================
# Stripe (if using)
# =================================
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# =================================
# PayPal (NEW)
# =================================
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox
NEXT_PUBLIC_PAYPAL_MODE=sandbox

# =================================
# Optional Services
# =================================
# Add any other services you're using...
```

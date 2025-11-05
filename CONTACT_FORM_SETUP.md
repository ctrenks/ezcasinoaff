# Contact Form Setup Guide

The contact form has been implemented with the following features:

## ✅ Features Implemented

1. **Beautiful Contact Page** (`/contact`)

   - Responsive design
   - Contact information sidebar
   - Professional form layout

2. **Google reCAPTCHA v3 Integration**

   - Invisible protection against spam
   - Score-based verification (requires score ≥ 0.5)
   - Automatic token generation on form submission

3. **Honeypot Field**

   - Hidden "phone" field to catch bots
   - If filled, pretends to succeed but doesn't send email
   - Completely invisible to real users

4. **Email Notifications**

   - Sends to: `support@ezcasinoaff.com`
   - Beautiful HTML email template
   - Includes all form details
   - Reply-To set to sender's email

5. **Form Validation**
   - Required fields: Name, Email, Message
   - Optional: Subject
   - Email format validation
   - Frontend and backend validation

## 🔧 Setup Required

### 1. Get Google reCAPTCHA Enterprise Keys

You're already using reCAPTCHA Enterprise with:

- **Project ID**: `slot-bot-captcha`
- **Site Key**: `6LeQTAMsAAAAANPW7z_vSrmq_mvf-t7zlX9ol8R6`

If you need to create a new site:

1. Go to https://cloud.google.com/recaptcha-enterprise
2. Create a new reCAPTCHA Enterprise key
3. Note your Project ID and Site Key

### 2. Add Environment Variables

Add these to your Vercel project (Settings → Environment Variables):

```env
# Public site key (can be exposed in frontend)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeQTAMsAAAAANPW7z_vSrmq_mvf-t7zlX9ol8R6

# Google Cloud Project ID
RECAPTCHA_PROJECT_ID=slot-bot-captcha

# Google Cloud Service Account (for server-side verification)
# Create a service account in Google Cloud Console with reCAPTCHA Enterprise permissions
# Download the JSON key file and paste its contents as a single-line JSON string
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"slot-bot-captcha",...}
```

**Important**: For reCAPTCHA Enterprise, you need a **Service Account** with permissions:

1. Go to Google Cloud Console → IAM & Admin → Service Accounts
2. Create a service account with role: "reCAPTCHA Enterprise Agent"
3. Download the JSON key file
4. In Vercel, paste the entire JSON as a single line in `GOOGLE_APPLICATION_CREDENTIALS_JSON`

### 3. Verify SMTP Settings

The contact form uses your existing SMTP configuration:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

If using Gmail, make sure you have an **App Password** generated:

1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Generate App Password for "Mail"
4. Use that password as `SMTP_PASS`

### 4. Deploy

After adding environment variables in Vercel:

1. Redeploy your application
2. Test the contact form at `/contact`
3. Check that emails arrive at `support@ezcasinoaff.com`

## 🧪 Testing

### Test the Honeypot (Optional)

To verify the honeypot is working:

1. Open browser dev tools
2. Go to `/contact`
3. In console, run:
   ```javascript
   document.getElementById("phone").value = "test";
   ```
4. Fill out form and submit
5. Should succeed but no email is sent
6. Check server logs: should see "Honeypot triggered - bot detected"

### Test reCAPTCHA

1. Fill out form normally
2. Submit
3. Check Network tab: should see reCAPTCHA verification request
4. Email should arrive at support@ezcasinoaff.com

## 📧 Email Template

Emails include:

- Sender name and email (with reply-to)
- Subject (if provided)
- Message with line breaks preserved
- Timestamp
- Professional branding

## 🔒 Security Features

1. **reCAPTCHA v3** - Invisible bot detection
2. **Honeypot field** - Catches simple bots
3. **Server-side validation** - Email format, required fields
4. **Rate limiting** - Built into reCAPTCHA scoring
5. **Email sanitization** - XSS protection

## 📱 Responsive Design

- Mobile-friendly layout
- Touch-optimized form fields
- Accessible labels and error messages
- Clear visual feedback

## 🎨 Customization

To change the email recipient:

- Edit `app/api/contact/route.ts`
- Change line: `to: "support@ezcasinoaff.com"`

To change email styling:

- Edit the HTML template in `app/api/contact/route.ts`
- Look for the `mailOptions.html` section

## 🐛 Troubleshooting

**"reCAPTCHA verification failed"**

- Check that both environment variables are set
- Verify the domain is added in reCAPTCHA admin
- Check console for specific errors

**Emails not sending**

- Verify SMTP credentials are correct
- Check Gmail app password is being used (not account password)
- Look at server logs for specific SMTP errors
- Test SMTP settings using a simple test script

**Form not submitting**

- Check browser console for JavaScript errors
- Verify reCAPTCHA script loaded (check Network tab)
- Ensure all required fields are filled

## 📊 Monitoring

Check for:

- Honeypot triggers (bots caught)
- reCAPTCHA scores (in logs)
- Email delivery success rate
- Form submission patterns

## Next Steps

1. **Get reCAPTCHA keys** from Google
2. **Add to Vercel** environment variables
3. **Redeploy** application
4. **Test** the form
5. **Monitor** for spam/bot attempts

The contact form is production-ready once the reCAPTCHA keys are added!

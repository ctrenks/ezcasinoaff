# Contact Form - Quick Start

## ⚡ 3 Steps to Activate

### 1️⃣ Create Google Cloud Service Account

**📍 You only have a Site Key - that's correct for Enterprise!**

Now you need server-side credentials:

```bash
# Go to: https://console.cloud.google.com/
# Select project: slot-bot-captcha
# Menu → IAM & Admin → Service Accounts
# Click: CREATE SERVICE ACCOUNT
# Name: recaptcha-verifier
# Role: reCAPTCHA Enterprise Agent
# Click: CREATE KEY → JSON format
# Download the JSON file
```

### 2️⃣ Add to Vercel

```bash
# Vercel Dashboard → Settings → Environment Variables
```

Add these 3 variables:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeQTAMsAAAAANPW7z_vSrmq_mvf-t7zlX9ol8R6
RECAPTCHA_PROJECT_ID=slot-bot-captcha
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...paste entire JSON as single line...}
```

### 3️⃣ Redeploy

```bash
# Redeploy your app in Vercel
# Test at: /contact
```

## ✅ That's It!

Contact form will now:

- ✅ Send emails to `support@ezcasinoaff.com`
- ✅ Block bots with reCAPTCHA Enterprise
- ✅ Catch spam with honeypot field
- ✅ Show professional form with validation

---

**Need detailed instructions?** See `RECAPTCHA_ENTERPRISE_SETUP.md`

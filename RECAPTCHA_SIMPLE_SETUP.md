# reCAPTCHA v3 Setup - Simple Version

## ✅ You Have Both Keys - Use This Simple Setup!

If Google gave you both a **Site Key** and a **Secret Key**, you're using standard reCAPTCHA v3 (not Enterprise). This is much simpler!

## 🔑 Your Keys

```
Site Key (Public): 6LeQTAMsAAAAANPW7z_vSrmq_mvf-t7zlX9ol8R6
Secret Key (Private): [the legacy secret key you received]
```

## ⚡ Setup (2 Easy Steps)

### 1. Add to Vercel Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these **2 variables**:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeQTAMsAAAAANPW7z_vSrmq_mvf-t7zlX9ol8R6
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

**Important**: Replace `your_secret_key_here` with the actual secret key Google gave you.

### 2. Redeploy

That's it! Just redeploy your app and the contact form will work.

## 🧪 How It Works

**Frontend (`/contact`)**

- Loads: `https://www.google.com/recaptcha/api.js`
- Executes: `grecaptcha.execute()` with your site key
- Gets a token on form submit

**Backend (`/api/contact`)**

- Receives the token
- Verifies with Google using your secret key
- Checks the score (0-1, accepts ≥ 0.5)
- Sends email if valid

## 🔒 Security Features

✅ **reCAPTCHA v3** - Invisible bot detection
✅ **Honeypot field** - Hidden "phone" field catches basic bots
✅ **Score-based** - Only accepts scores ≥ 0.5
✅ **Server validation** - Email format, required fields

## 📊 Score Interpretation

- **0.9 - 1.0**: Very likely legitimate
- **0.5 - 0.9**: Likely legitimate (accepted)
- **0.0 - 0.5**: Likely bot (rejected)

## 🐛 Troubleshooting

**"reCAPTCHA verification failed"**

- Check both keys are set in Vercel
- Make sure you redeployed after adding them
- Verify the domain is authorized in reCAPTCHA admin

**Emails not sending**

- reCAPTCHA might be working, but SMTP failing
- Check SMTP credentials in environment variables
- Look at Vercel function logs for specific errors

## 🎯 Test It

1. Deploy to Vercel with the 2 environment variables
2. Go to `/contact` on your site
3. Fill out and submit the form
4. Check email arrives at `support@ezcasinoaff.com`
5. Check Vercel logs to see the reCAPTCHA score

## ✨ That's It!

No Service Accounts, no Google Cloud setup, no JSON credentials.
Just 2 environment variables and you're done! 🚀

---

**Note**: If you want to use the more advanced Enterprise version later, see `RECAPTCHA_ENTERPRISE_SETUP.md`

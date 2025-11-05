# reCAPTCHA Enterprise Setup Guide

Your contact form is configured to use **Google Cloud reCAPTCHA Enterprise**.

## Current Configuration

You already have:

- ✅ **Project ID**: `slot-bot-captcha`
- ✅ **Site Key**: `6LeQTAMsAAAAANPW7z_vSrmq_mvf-t7zlX9ol8R6`
- ✅ **Package installed**: `@google-cloud/recaptcha-enterprise`

## ⚠️ Important: No Secret Key with Enterprise!

**You only got a Site Key - that's correct!**

Unlike standard reCAPTCHA v3, Enterprise doesn't provide a secret key. Instead:

- 🌐 **Frontend**: Uses Site Key with `grecaptcha.enterprise.execute()`
- 🔒 **Backend**: Uses Google Cloud Service Account JSON credentials

## What You Need to Add

You need a **Service Account** with reCAPTCHA Enterprise permissions for server-side verification.

### Step 1: Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `slot-bot-captcha`
3. Navigate to: **IAM & Admin** → **Service Accounts**
4. Click **"+ CREATE SERVICE ACCOUNT"**
5. Fill in:
   - **Service account name**: `recaptcha-verifier`
   - **Service account ID**: (auto-generated)
   - **Description**: `Service account for reCAPTCHA Enterprise verification`
6. Click **"CREATE AND CONTINUE"**

### Step 2: Grant Permissions

1. In "Grant this service account access to project":
   - Click **"Select a role"**
   - Search for and select: **"reCAPTCHA Enterprise Agent"**
   - Click **"CONTINUE"**
2. Skip "Grant users access" (optional)
3. Click **"DONE"**

### Step 3: Create Key

1. Find your new service account in the list
2. Click on it to open details
3. Go to the **"KEYS"** tab
4. Click **"ADD KEY"** → **"Create new key"**
5. Choose **JSON** format
6. Click **"CREATE"**
7. A JSON file will be downloaded automatically

### Step 4: Add to Vercel

1. Open the downloaded JSON file in a text editor
2. Copy the **entire contents** (it should look like this):

```json
{
  "type": "service_account",
  "project_id": "slot-bot-captcha",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "recaptcha-verifier@slot-bot-captcha.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

3. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

4. Add these three variables:

   **Variable 1:**

   ```
   Name: NEXT_PUBLIC_RECAPTCHA_SITE_KEY
   Value: 6LeQTAMsAAAAANPW7z_vSrmq_mvf-t7zlX9ol8R6
   ```

   **Variable 2:**

   ```
   Name: RECAPTCHA_PROJECT_ID
   Value: slot-bot-captcha
   ```

   **Variable 3:**

   ```
   Name: GOOGLE_APPLICATION_CREDENTIALS_JSON
   Value: [Paste the entire JSON content as a SINGLE LINE]
   ```

   **Important**: For the JSON credential, paste it as a **single line** (no line breaks). Example:

   ```
   {"type":"service_account","project_id":"slot-bot-captcha",...}
   ```

5. Select environments: **Production**, **Preview**, **Development**

6. Click **"Save"**

### Step 5: Redeploy

1. After adding environment variables, **redeploy** your application
2. Vercel will automatically pick up the new variables
3. Test the contact form at `/contact`

## Testing

1. Go to `/contact` on your deployed site
2. Fill out the form
3. Submit
4. Check server logs in Vercel for:
   - `reCAPTCHA score: X.XX` (should be between 0-1)
   - Email should be sent to `support@ezcasinoaff.com`

## Score Interpretation

- **0.9 - 1.0**: Very likely a legitimate user
- **0.5 - 0.9**: Likely legitimate (contact form accepts ≥ 0.5)
- **0.0 - 0.5**: Likely a bot (rejected)

## Troubleshooting

### "Missing reCAPTCHA Enterprise configuration"

- Verify all 3 environment variables are set in Vercel
- Make sure you redeployed after adding them

### "reCAPTCHA token invalid"

- Check that the Site Key matches in frontend and backend
- Verify the domain is authorized in Google Cloud reCAPTCHA settings

### "Permission denied" or authentication errors

- Verify the Service Account has "reCAPTCHA Enterprise Agent" role
- Check that the JSON credentials are valid and complete
- Make sure the JSON is pasted as a single line (no line breaks)

### "Cannot parse GOOGLE_APPLICATION_CREDENTIALS_JSON"

- Ensure the JSON is valid (no syntax errors)
- Paste as a single line without any line breaks
- Don't add quotes around the entire JSON

## Security Notes

- ✅ The Service Account JSON contains sensitive credentials
- ✅ Never commit it to git
- ✅ Only store it in Vercel environment variables
- ✅ The Site Key is public and can be exposed in frontend code
- ✅ The Project ID is also safe to expose

## Alternative: Using Application Default Credentials

If deploying to Google Cloud (not Vercel), you can use Application Default Credentials instead:

1. Remove the `credentials` parameter from the client initialization
2. Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of your JSON file
3. The SDK will automatically find and use it

But for Vercel, use the `GOOGLE_APPLICATION_CREDENTIALS_JSON` method shown above.

## Need Help?

If you encounter issues:

1. Check Vercel function logs for specific error messages
2. Verify your Service Account has the correct permissions
3. Test reCAPTCHA in Google Cloud Console's test interface
4. Make sure the reCAPTCHA Enterprise API is enabled for your project

## API Reference

Google Cloud reCAPTCHA Enterprise Documentation:
https://cloud.google.com/recaptcha-enterprise/docs

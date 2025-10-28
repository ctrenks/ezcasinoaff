# PayPal Integration - Setup Complete ✅

## 🎉 What's Been Implemented

A complete PayPal payment system has been integrated for:

1. **Subscription Payments** - Users can pay for annual subscriptions via PayPal
2. **Radium Credits** - Users can purchase credits using PayPal
3. **Manual Credit Management** - Admins can manually add/remove credits for crypto payments

## 📦 Features Created

### PayPal Payment Flow

- Create PayPal orders for subscriptions and credits
- Redirect users to PayPal for payment approval
- Capture payments after user approval
- Handle refunds and webhook events
- Automatic affiliate commission creation on successful payments

### Admin Manual Credit System

- Search users by email
- Add credits with custom payment method tracking (crypto, bank transfer, cash, other)
- Remove credits if needed
- View transaction history
- Automatic notifications to users

## 🚀 Setup Instructions

### 1. Get PayPal Credentials

1. Go to https://developer.paypal.com/
2. Log in or create a PayPal developer account
3. Go to "Dashboard" → "Apps & Credentials"
4. Create a new app or use an existing one
5. Copy your **Client ID** and **Secret** (from both Sandbox and Live)

### 2. Configure Environment Variables

Add these to your `.env` file:

```bash
# PayPal Configuration
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_secret_here
PAYPAL_MODE=sandbox  # Use 'live' for production

# For the PayPal button component (public)
NEXT_PUBLIC_PAYPAL_MODE=sandbox  # Use 'live' for production
```

**Important**:

- Use **Sandbox** credentials for development/testing
- Use **Live** credentials for production
- The `PAYPAL_MODE` determines which environment to use

### 3. Set Up PayPal Webhooks

To receive real-time notifications about payments:

1. Go to https://developer.paypal.com/dashboard/
2. Click on your app
3. Scroll to "Webhooks"
4. Add webhook URL: `https://yourdomain.com/api/paypal/webhook`
5. Subscribe to these events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.REFUNDED`

### 4. Test in Sandbox Mode

1. Go to https://developer.paypal.com/dashboard/
2. Under "Sandbox" → "Accounts", you'll see test buyer and seller accounts
3. Use these test accounts to make payments
4. No real money is charged in sandbox mode

## 📋 API Endpoints Created

### Payment Endpoints

- **POST** `/api/paypal/create-order` - Create a PayPal order
- **GET** `/api/paypal/capture-order` - Capture payment after approval
- **POST** `/api/paypal/webhook` - Handle PayPal webhook events

### Admin Endpoints

- **POST** `/api/admin/credits/manual-adjust` - Manually adjust user credits
- **GET** `/api/admin/credits/manual-adjust` - Get manual adjustment history
- **GET** `/api/admin/users/search` - Search users by email

## 🎨 UI Components

### Admin Pages

- **`/admin/credits`** - Manual credit management interface
  - Search users
  - Add/remove credits
  - Track payment methods
  - View adjustment history

### Payment Components

- **`<PayPalButton />`** - Reusable PayPal payment button
  - Supports subscriptions and credits
  - Handles loading states
  - Redirects to PayPal approval

## 💳 Payment Flow

### For Users

1. **Subscriptions**:

   - User selects a plan on pricing page
   - Clicks "Pay with PayPal"
   - Redirected to PayPal for login/approval
   - After approval, redirected back to site
   - Subscription is activated automatically

2. **Credits**:

   - User selects credit amount
   - Clicks "Pay with PayPal"
   - Completes payment on PayPal
   - Credits are added to account automatically

3. **Crypto Payments** (Admin handled):
   - User contacts admin about crypto payment
   - Admin receives payment externally
   - Admin logs into `/admin/credits`
   - Searches for user by email
   - Adds credits with description (e.g., "Received 0.05 BTC")
   - User receives notification

### For Admins

**Manual Credit Management** (`/admin/credits`):

1. Enter user's email and click "Search"
2. Enter credit amount
3. Select payment method (Crypto, Bank Transfer, Cash, Other)
4. Add description (e.g., transaction hash, bank reference)
5. Click "Add Credits" or "Remove Credits"
6. User is notified automatically

## 🔧 Technical Details

### Affiliate Commission Integration

✅ Commissions are automatically created for PayPal payments
✅ Referrer gets their commission rate % of the payment
✅ Notifications sent to referrers

### Security Features

- Server-side PayPal SDK integration
- Proper error handling
- Transaction logging
- Admin-only access for manual adjustments
- Audit trail for all credit adjustments

### Database Records

Every payment creates:

- Payment record (with status tracking)
- Credit transaction (for credit purchases)
- Affiliate commission (if user was referred)
- Notification (for user and referrer)

## 📊 Payment Methods Supported

| Method         | Type      | Handled By |
| -------------- | --------- | ---------- |
| PayPal         | Automated | System     |
| Cryptocurrency | Manual    | Admin      |
| Bank Transfer  | Manual    | Admin      |
| Cash           | Manual    | Admin      |
| Other          | Manual    | Admin      |

## 🧪 Testing Guide

### Test Subscription Payment

1. Set `PAYPAL_MODE=sandbox` in .env
2. Go to `/pricing`
3. Click PayPal button on any plan
4. Log in with PayPal sandbox test account
5. Approve payment
6. Verify subscription is activated

### Test Credit Purchase

1. Go to `/profile/credits`
2. Select credit amount
3. Click PayPal button
4. Complete sandbox payment
5. Verify credits added to account

### Test Manual Credit Adjustment

1. Log in as super admin (role 0)
2. Go to `/admin/credits`
3. Search for a test user
4. Add credits with description
5. Verify user receives notification
6. Check transaction appears in history

## 🚨 Important Notes

### Sandbox vs Live Mode

**Sandbox (Testing)**:

- Use for development and testing
- No real money involved
- Uses test accounts
- URL: `sandbox.paypal.com`

**Live (Production)**:

- Real payments and real money
- Use live credentials
- Requires verified PayPal account
- URL: `paypal.com`

### Security Best Practices

1. **Never commit credentials** to git
2. **Use environment variables** for all secrets
3. **Test thoroughly** in sandbox before going live
4. **Monitor webhook events** for issues
5. **Keep audit logs** of all transactions

### Going Live Checklist

- [ ] Get live PayPal credentials
- [ ] Update environment variables
- [ ] Set `PAYPAL_MODE=live`
- [ ] Configure live webhook URL
- [ ] Test with small amounts first
- [ ] Monitor first few transactions
- [ ] Set up email alerts for failed payments

## 📞 Support & Troubleshooting

### Common Issues

**Payment not captured**:

- Check webhook is configured
- Verify PayPal credentials
- Check server logs for errors

**Credits not added**:

- Verify payment status in database
- Check PayPal dashboard
- Review webhook logs

**Admin can't adjust credits**:

- Verify user has role 0 (super admin)
- Check API endpoint is accessible
- Review browser console for errors

## 🔄 Payment Methods

This platform currently supports:

1. **PayPal** - Automated processing for subscriptions and credits
2. **Cryptocurrency** - Manual admin processing (BTC, ETH, USDT, etc.)
3. **Bank Transfer** - Manual admin processing
4. **Cash** - Manual admin processing

**Note:** Stripe integration is currently disabled. All credit card payments should use PayPal.

## 📚 Additional Documentation

- [PayPal Developer Docs](https://developer.paypal.com/docs/)
- [PayPal Orders API](https://developer.paypal.com/docs/api/orders/v2/)
- [PayPal Webhooks](https://developer.paypal.com/api/rest/webhooks/)

## ✨ Summary

You now have:

- ✅ Complete PayPal payment integration
- ✅ Subscription and credit payments via PayPal
- ✅ Manual credit management for crypto payments
- ✅ Admin interface for credit adjustments
- ✅ Webhook handling for automated updates
- ✅ Affiliate commission integration
- ✅ Full transaction logging

**Next Steps**:

1. Add PayPal credentials to environment variables
2. Update pricing page to include PayPal button
3. Test in sandbox mode
4. Go live! 🚀

---

**Built with ❤️ for your casino affiliate platform**

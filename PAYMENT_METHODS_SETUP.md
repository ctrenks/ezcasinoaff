# Payment Methods - Current Configuration

## 🎯 Active Payment Methods

This platform is configured with **PayPal + Manual Payments** only.

### Automated Payments ✅

**PayPal (Active)**

- Instant processing
- Automatic subscription/credit activation
- Webhook integration
- Refund handling
- Commission tracking
- User notifications

**Setup Required:**

- PayPal Client ID and Secret
- Webhook configuration
- See `PAYPAL_SETUP.md` for details

### Manual Payments ✅

**Cryptocurrency (Active)**

- Bitcoin (BTC)
- Ethereum (ETH)
- Tether (USDT)
- Others on request

**Bank Transfer (Active)**

- International wire transfer
- ACH (US)
- SEPA (Europe)

**Cash (Active)**

- In-person payments
- Money orders

**Admin Processing:**

- All manual payments processed via `/admin/credits`
- See admin manual credit adjustment guide
- Full audit trail maintained

## ❌ Disabled Payment Methods

**Stripe (Disabled)**

- Credit card processing via Stripe is currently disabled
- Users should use PayPal for card payments
- Database schema retains Stripe fields for future use
- No Stripe API calls are made

## 🎨 User Experience

### Pricing Page (`/pricing`)

Users see two payment options:

1. **Pay with PayPal** - Blue button, redirects to PayPal
2. **Pay with Crypto** - Gray button, opens contact modal

### Credits Page (`/profile/credits`)

Users see two payment options for each credit pack:

1. **Pay with PayPal** - Blue button, redirects to PayPal
2. **Pay with Crypto** - Gray button, opens contact modal

### No Stripe UI

- No "Pay with Card" buttons
- No Stripe checkout
- No Stripe Elements
- No Stripe.js loaded

## 💳 Payment Flow

### For Users - PayPal

1. Click "Pay with PayPal" button
2. Redirect to PayPal login
3. Approve payment
4. Return to site
5. Subscription/credits activated automatically

### For Users - Crypto

1. Click "Pay with Crypto" button
2. See contact modal with instructions
3. Email admin with payment details
4. Admin provides crypto address
5. User sends payment
6. User replies with transaction hash
7. Admin verifies and credits account
8. User receives notification

### For Admins - Manual Payments

1. Receive payment request from user
2. Provide payment instructions (wallet/bank details)
3. Wait for payment confirmation
4. Verify payment received (blockchain/bank)
5. Log into `/admin/credits`
6. Search for user by email
7. Add credits with payment details
8. User receives automatic notification

## 🔧 Technical Details

### Environment Variables

```bash
# PayPal (Required)
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret
PAYPAL_MODE=sandbox  # or 'live'
NEXT_PUBLIC_PAYPAL_MODE=sandbox

# Stripe (NOT USED - can be removed)
# STRIPE_SECRET_KEY=
# STRIPE_PUBLISHABLE_KEY=
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### API Endpoints Active

- ✅ `/api/paypal/create-order` - Create PayPal order
- ✅ `/api/paypal/capture-order` - Capture payment
- ✅ `/api/paypal/webhook` - Handle PayPal events
- ✅ `/api/admin/credits/manual-adjust` - Manual credit adjustments
- ✅ `/api/admin/users/search` - Search users for admin
- ❌ `/api/stripe/*` - No Stripe endpoints exist

### Database Schema

The database retains Stripe-related fields:

- `Subscription.stripeSubscriptionId`
- `Subscription.stripeCustomerId`
- `Payment.stripePaymentIntentId`
- `Payment.stripeInvoiceId`

**These fields are unused but retained for:**

- Future flexibility
- Migration capability
- No harm in keeping them

## 🚀 Enabling Stripe (Future)

If you decide to enable Stripe in the future:

1. **Install Dependencies**

   ```bash
   pnpm add stripe @stripe/stripe-js
   ```

2. **Add Environment Variables**

   ```bash
   STRIPE_SECRET_KEY=sk_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
   ```

3. **Create Stripe API Routes**

   - `/api/stripe/create-checkout-session`
   - `/api/stripe/webhook`

4. **Update UI Components**

   - Add "Pay with Card" buttons
   - Add Stripe Elements components
   - Update payment selection UI

5. **Configure Webhooks**

   - Add webhook endpoint in Stripe dashboard
   - Subscribe to payment events

6. **Update Documentation**
   - Add Stripe setup guide
   - Update payment methods list

## 📊 Payment Method Statistics

Track these metrics to inform payment strategy:

- **PayPal Success Rate**: Target > 95%
- **Crypto Payment Time**: Target < 2 hours
- **Manual Processing Time**: Target < 30 minutes
- **User Payment Preference**: Monitor PayPal vs Crypto ratio
- **Geographic Preferences**: Track by region

## 💡 Recommendations

### Current Setup (PayPal + Manual)

**Pros:**

- ✅ Lower fees than credit cards
- ✅ International support
- ✅ Crypto-friendly users supported
- ✅ Simple setup
- ✅ No PCI compliance needed

**Cons:**

- ❌ Requires PayPal account for card payments
- ❌ Manual work for crypto payments
- ❌ Some users prefer direct card input

### When to Add Stripe

Consider adding Stripe if:

- Users frequently request direct card payment
- PayPal conversion rate is low
- You want to offer more payment options
- You need advanced subscription features
- You want to reduce PayPal dependency

### When to Add Crypto Gateway

Consider automated crypto (Coinbase Commerce, BTCPay) if:

- High volume of crypto payments (>10/week)
- Admin time spent on manual processing is high
- You want real-time crypto payment confirmation
- You need multi-currency support

## 🔐 Security Considerations

### Current Security Features

- ✅ Server-side PayPal SDK (no client secrets)
- ✅ Webhook signature verification
- ✅ Admin-only manual credit access (role 0)
- ✅ Full audit trail for all transactions
- ✅ Payment method tracking
- ✅ No client-side payment processing

### Best Practices

1. **Never commit credentials** to git
2. **Use environment variables** for all secrets
3. **Test in sandbox** before going live
4. **Monitor webhook events** for anomalies
5. **Verify crypto transactions** on blockchain
6. **Keep audit logs** indefinitely
7. **Review manual adjustments** regularly

## 📞 Support & Troubleshooting

### Common User Questions

**Q: Can I pay with credit card?**
A: Yes, use PayPal - it accepts credit/debit cards without requiring a PayPal account.

**Q: Do you accept cryptocurrency?**
A: Yes! Click "Pay with Crypto" and follow the instructions to contact our team.

**Q: Why is Stripe not available?**
A: We've chosen to use PayPal for automated card payments. PayPal offers similar functionality with competitive rates.

**Q: How long does crypto payment take?**
A: Typically 30-60 minutes after we receive your payment and transaction confirmation.

### Admin Troubleshooting

**Issue: User says PayPal payment failed**

- Check payment status in PayPal dashboard
- Check database Payment records
- Review server logs for webhook events
- Verify webhook is properly configured

**Issue: Crypto payment not credited**

- Verify transaction on blockchain explorer
- Check if sufficient confirmations received
- Search user in `/admin/credits`
- Manually add credits with transaction hash

## ✨ Summary

**Current Configuration:**

- ✅ PayPal automated payments (Active)
- ✅ Manual crypto/bank/cash payments (Active)
- ❌ Stripe card payments (Disabled)

**Next Steps:**

1. Configure PayPal credentials
2. Test PayPal sandbox
3. Set up crypto wallet addresses
4. Train team on manual credit process
5. Go live!

---

**Last Updated:** October 2024
**Configuration:** PayPal + Manual Only

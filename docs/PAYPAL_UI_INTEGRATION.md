# PayPal UI Integration Guide

## Adding PayPal Buttons to Your Pages

This guide shows how to add PayPal payment buttons to your pricing and credits pages.

## 1. Pricing Page Integration

The PayPal button is already created as a component. You can add it to your pricing page alongside existing payment methods.

### Example: Add to Subscription Plans

```tsx
// In app/pricing/page.tsx or your pricing component
import PayPalButton from "@/components/PayPalButton";

// Inside your plan card, add the PayPal button option:
<div className="space-y-3">
  {/* Existing Stripe/other button */}
  <Link
    href="/profile/sites/add"
    className="block w-full text-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
  >
    Get Started
  </Link>

  {/* PayPal Button */}
  <PayPalButton
    type="subscription"
    amount={plan.annualPrice}
    planType={plan.id}
    onSuccess={() => {
      // Optional: Handle success
      window.location.href = "/profile/sites?success=subscription_activated";
    }}
    onError={(error) => {
      // Optional: Handle error
      console.error("Payment failed:", error);
    }}
  />
</div>;
```

### Complete Pricing Card Example

```tsx
<div
  key={plan.id}
  className="relative bg-white rounded-lg shadow-lg overflow-hidden p-8"
>
  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
  <p className="text-gray-600 mb-6">{plan.description}</p>

  <div className="mb-6">
    <div className="flex items-baseline">
      <span className="text-5xl font-bold text-gray-900">
        ${plan.monthlyRate}
      </span>
      <span className="text-gray-600 ml-2">/month</span>
    </div>
    <p className="text-sm text-gray-500 mt-2">
      ${plan.annualPrice}/year billed annually
    </p>
  </div>

  <ul className="space-y-3 mb-8">
    {plan.featureList.map((feature, index) => (
      <li key={index} className="flex items-start">
        <svg
          className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span className="text-gray-700">{feature}</span>
      </li>
    ))}
  </ul>

  {/* Payment Options */}
  <div className="space-y-3">
    <p className="text-sm font-medium text-gray-700 text-center mb-2">
      Choose your payment method:
    </p>

    {/* Option 1: PayPal */}
    <PayPalButton
      type="subscription"
      amount={plan.annualPrice}
      planType={plan.id}
    />

    {/* Option 2: Crypto (contact admin) */}
    <button
      onClick={() => {
        alert(
          "For cryptocurrency payments, please contact us at admin@yourdomain.com with your preferred crypto (BTC, ETH, USDT, etc.)"
        );
      }}
      className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold border border-gray-300"
    >
      Pay with Crypto
    </button>
  </div>
</div>
```

## 2. Credits Page Integration

Add PayPal buttons to your credit purchase options.

### Example: Add to CreditsDisplay Component

```tsx
// In app/profile/credits/CreditsDisplay.tsx
"use client";

import { useState, useEffect } from "react";
import PayPalButton from "@/components/PayPalButton";
import { CREDIT_PACKS } from "@/lib/pricing";

export default function CreditsDisplay() {
  const [balance, setBalance] = useState(0);
  const [selectedPack, setSelectedPack] = useState<any>(null);

  // Your existing fetch credit balance logic...

  return (
    <div>
      {/* Current Balance Display */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-2">Current Balance</h2>
        <p className="text-4xl font-bold text-purple-600">{balance} credits</p>
      </div>

      {/* Credit Packs */}
      <h2 className="text-2xl font-bold mb-6">Purchase Credits</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(CREDIT_PACKS).map((pack) => (
          <div key={pack.id} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-2">{pack.name}</h3>
            <p className="text-gray-600 mb-4">{pack.credits} credits</p>

            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ${pack.price}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                ${(pack.price / pack.credits).toFixed(3)} per credit
              </p>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 text-center mb-2">
                Choose payment method:
              </p>

              {/* Option 1: PayPal */}
              <PayPalButton
                type="credits"
                amount={pack.price}
                creditAmount={pack.credits}
                onSuccess={() => {
                  // Refresh balance
                  fetchBalance();
                }}
              />

              {/* Option 2: Crypto */}
              <button
                onClick={() => {
                  setSelectedPack(pack);
                  // Show crypto payment modal or instructions
                }}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold border border-gray-300"
              >
                Pay with Crypto
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Crypto Payment Instructions Modal */}
      {selectedPack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Cryptocurrency Payment</h3>
            <p className="text-gray-600 mb-4">
              To purchase {selectedPack.credits} credits for $
              {selectedPack.price} using cryptocurrency:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-6 text-sm">
              <li>
                Contact us at <strong>admin@yourdomain.com</strong>
              </li>
              <li>Specify the credit pack you want</li>
              <li>We'll provide wallet addresses for BTC, ETH, or USDT</li>
              <li>Send payment to the provided address</li>
              <li>Reply with transaction hash</li>
              <li>Credits added within 1 hour of confirmation</li>
            </ol>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  window.location.href =
                    "mailto:admin@yourdomain.com?subject=Crypto Payment for " +
                    selectedPack.credits +
                    " Credits";
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Email Us
              </button>
              <button
                onClick={() => setSelectedPack(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 3. PayPal Button Props Reference

```typescript
interface PayPalButtonProps {
  type: "subscription" | "credits"; // Type of purchase
  amount: number; // Price in USD
  planType?: string; // Plan ID for subscriptions
  creditAmount?: number; // Number of credits for credit purchases
  siteId?: string; // Optional site ID for subscriptions
  onSuccess?: () => void; // Optional success callback
  onError?: (error: string) => void; // Optional error callback
}
```

## 4. Success/Error Handling

The PayPal flow automatically handles success and redirects users, but you can add custom handlers:

```tsx
<PayPalButton
  type="subscription"
  amount={299}
  planType="BASIC"
  onSuccess={() => {
    // This runs before redirect
    console.log("Payment initiated successfully");
  }}
  onError={(error) => {
    // Handle errors
    alert(`Payment failed: ${error}`);
  }}
/>
```

## 5. Crypto Payment Instructions

For cryptocurrency payments, you have two options:

### Option A: Manual Process (Current Implementation)

1. User clicks "Pay with Crypto" button
2. Show modal with instructions to contact admin
3. Admin receives email/message
4. Admin provides crypto wallet address
5. User sends payment
6. User provides transaction hash
7. Admin verifies and adds credits via `/admin/credits`

### Option B: Automated Crypto Gateway (Advanced)

You can integrate services like:

- **Coinbase Commerce** - Accepts BTC, ETH, USDC, DAI
- **BTCPay Server** - Self-hosted, no fees
- **NOWPayments** - Multi-currency support
- **CoinGate** - Euro-friendly

Example integration available in the docs if needed.

## 6. Testing PayPal Integration

### In Development (Sandbox)

1. Set environment variables:

```bash
PAYPAL_MODE=sandbox
NEXT_PUBLIC_PAYPAL_MODE=sandbox
```

2. Use PayPal sandbox test accounts:

   - Get them from https://developer.paypal.com/dashboard/
   - They look like: `sb-xxxxx@personal.example.com`

3. Test the flow:
   - Click PayPal button
   - Log in with test account
   - Approve payment
   - Should redirect back to your site

### In Production

1. Update environment variables:

```bash
PAYPAL_MODE=live
NEXT_PUBLIC_PAYPAL_MODE=live
```

2. Use live PayPal credentials

3. Test with small amounts first

## 7. Styling Customization

The PayPal button uses PayPal's brand colors. You can customize:

```tsx
// Custom styled PayPal button
<button onClick={handlePayPalPayment} className="your-custom-classes">
  <YourPayPalIcon />
  <span>Pay with PayPal</span>
</button>
```

## 8. Mobile Optimization

The PayPal button is mobile-responsive by default, but ensure:

- Adequate touch target size (minimum 44x44px)
- Clear spacing between buttons
- Test on actual mobile devices

## 9. Analytics Tracking

Track PayPal payment attempts:

```tsx
<PayPalButton
  type="subscription"
  amount={299}
  planType="BASIC"
  onSuccess={() => {
    // Track in your analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "purchase", {
        transaction_id: Date.now().toString(),
        value: 299,
        currency: "USD",
        payment_type: "paypal",
      });
    }
  }}
/>
```

## 10. Common Issues

### Button doesn't redirect

- Check PayPal credentials in `.env`
- Verify `PAYPAL_MODE` is set correctly
- Check browser console for errors

### Payment not captured

- Ensure webhook is configured
- Check `/api/paypal/webhook` is accessible
- Review server logs

### Credits not added

- Check database for payment record
- Verify user is authenticated
- Review PayPal webhook logs

## Need Help?

Check the main PayPal setup guide: `PAYPAL_SETUP.md`

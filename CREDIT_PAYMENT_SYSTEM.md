# Radium Credit Payment System

## Overview

Users can now pay for subscriptions and credit packs using their Radium credit balance. The system uses a **1:1 ratio** where 1 credit = $1 USD.

## Features

✅ **Smart Display Logic**

- "Pay with Credits" button only appears when user has sufficient balance
- Real-time credit balance display
- Clear messaging about how many more credits are needed (if insufficient)

✅ **Payment Types Supported**

- Site subscriptions (all plans: BASIC, PRO, EVERYTHING)
- Radium credit pack purchases

✅ **Complete Transaction Flow**

- Instant credit deduction
- Automatic subscription activation
- Payment record creation
- Transaction history logging
- Affiliate commission generation (if user was referred)
- User notifications

✅ **Security & Validation**

- Balance verification before payment
- Confirmation dialog before processing
- Transaction-based operations (atomic)
- Site ownership verification for subscriptions

## Implementation

### API Endpoint

**`POST /api/credits/pay-with-credits`**

```typescript
{
  type: "subscription" | "credits",
  amount: number,           // Dollar amount
  planType?: string,        // For subscriptions (BASIC/PRO/EVERYTHING)
  creditAmount?: number,    // For credit purchases
  siteId?: string          // For subscriptions (required)
}
```

**Response:**

```typescript
{
  success: true,
  payment: Payment,
  subscription?: Subscription,  // For subscription type
  creditsUsed: number,
  creditsAdded?: number,        // For credit purchases
  newBalance?: number           // For credit purchases
}
```

### UI Components Updated

1. **`app/pricing/PricingClient.tsx`**

   - Shows credit payment option on pricing page
   - Displays user's credit balance
   - Handles credit payments for both subscriptions and credit packs

2. **`app/profile/sites/SiteSubscriptionModal.tsx`**
   - Shows credit payment option when adding/managing subscriptions
   - Includes balance info per plan
   - Processes credit payments with site-specific context

### Credit Balance Display

Users see their balance in multiple formats:

- **Sufficient balance**: Shows prominent "Pay with X Credits" button
- **Insufficient balance**: Shows balance + "Need X more credits" message
- **No balance**: Button hidden, only PayPal/Crypto options shown

## Usage Flow

### For Subscriptions:

1. User navigates to `/profile/sites` or `/pricing`
2. System fetches their credit balance
3. If balance ≥ subscription cost:
   - "💎 Pay with Credits" button appears (gradient purple/indigo)
4. User clicks button
5. Confirmation dialog shows:
   - Plan details
   - Site info (if applicable)
   - Credits to be deducted
6. On confirmation:
   - Credits deducted from balance
   - Subscription created and activated
   - Site status updated to ACTIVE
   - Payment record created
   - Affiliate commission generated (if applicable)
   - User receives notification
7. Page refreshes to show new subscription

### For Credit Purchases:

1. User on `/profile/credits` or `/pricing`
2. System checks if they have enough credits to "buy" more (unusual scenario)
3. If balance ≥ pack cost:
   - Credit payment option appears
4. Payment deducts cost, then adds purchased credits
5. Net result: User trades credits for a pack (potentially with bonus)

## Transaction Example

**Scenario**: User buys PRO plan ($199/year) with credits

```
Initial Balance: 500 credits
Plan Cost: $199 = 199 credits

Transaction:
1. Verify: 500 >= 199 ✓
2. Deduct: 500 - 199 = 301 credits
3. Create subscription (PRO, 1 year)
4. Update site status to ACTIVE
5. Create payment record ($199, SUCCEEDED)
6. Generate commission (if user was referred)
7. Send notification to user
8. Final Balance: 301 credits
```

## Database Records Created

For each credit payment:

1. **RadiumTransaction** (USAGE)

   - Negative amount (credits spent)
   - Description of purchase
   - Updated balance

2. **Payment**

   - Amount in USD
   - Status: SUCCEEDED
   - Type: SUBSCRIPTION or RADIUM_CREDITS
   - Description includes "Paid with Credits"

3. **Subscription** (for subscription payments)

   - Plan details
   - Status: ACTIVE
   - Start/end dates
   - Monthly rate

4. **AffiliateCommission** (if applicable)

   - Links to payment and subscription
   - Status: PENDING
   - Commission amount calculated

5. **Notification**
   - Confirms activation
   - Links to relevant page

## Advantages

✨ **For Users:**

- Instant activation (no payment processing delay)
- No transaction fees
- Use accumulated credits for purchases
- Flexible payment option

✨ **For Platform:**

- Encourages credit purchases
- Reduces payment processor fees
- Creates locked-in value
- Simplifies recurring payments

## Configuration

**Credit-to-Dollar Ratio:**

```typescript
const requiredCredits = Math.ceil(amount); // 1:1 ratio
```

**Minimum Balance Check:**

```typescript
if (userCredit.balance < requiredCredits) {
  return { error: "Insufficient credits", required, available };
}
```

## Future Enhancements

Potential additions:

- [ ] Credit payment history filtering
- [ ] Bulk site subscription payments
- [ ] Credit payment discounts (e.g., 5% off)
- [ ] Scheduled automatic renewals with credits
- [ ] Credit balance alerts/warnings

## Testing Checklist

- [ ] Verify credit balance fetches correctly
- [ ] Test insufficient balance scenario
- [ ] Confirm confirmation dialog shows correct info
- [ ] Verify subscription activation
- [ ] Check credit deduction transaction
- [ ] Verify payment record creation
- [ ] Test affiliate commission generation
- [ ] Confirm notification delivery
- [ ] Test with multiple sites
- [ ] Verify all plan types (BASIC, PRO, EVERYTHING)

## Notes

- Credit purchases with credits is technically possible but unusual
- System maintains full audit trail of all credit transactions
- Refunds would need manual processing via admin panel
- Credits are non-transferable between users

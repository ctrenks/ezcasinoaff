# Pay with EZ Credits for Radium Credits

**Last Updated:** October 28, 2025

---

## Overview

Users can now use their **EZ Credits** (payment currency) to purchase **Radium Credits** (AI review generation) at a 1:1 ratio where 1 EZ Credit = $1 USD.

---

## 🎯 Feature Summary

### What Changed

1. **Profile Credits Page** (`/profile/credits`)

   - Shows "Pay with EZ Credits" button for each Radium Credit pack
   - Only appears if user has sufficient EZ Credits
   - Displays current EZ Credit balance below each pack
   - Shows how many more EZ Credits needed if insufficient

2. **Pricing Page** (`/pricing`)

   - Shows "Pay with EZ Credits" button for Radium Credit packs
   - Only appears if user has sufficient EZ Credits
   - Displays current EZ Credit balance
   - Shows how many more EZ Credits needed if insufficient

3. **New API Endpoint**
   - `POST /api/credits/buy-radium-with-ez`
   - Handles the purchase transaction
   - Deducts EZ Credits
   - Adds Radium Credits
   - Creates transaction records for both
   - Creates payment record
   - Sends notification

---

## 💎 Payment Flow

### User Experience

1. **User has 500 EZ Credits**
2. **Views a Radium Credit pack** (e.g., "Medium Pack" - $99 for 30 credits)
3. **Sees "💎 Pay with 99 EZ Credits" button** (because 99 ≤ 500)
4. **Clicks button** → Confirmation dialog appears
5. **Confirms** → Payment processes instantly
6. **Result:**
   - **EZ Credits:** 500 → 401
   - **Radium Credits:** +30
   - **Notification:** "You've purchased 30 Radium Credits for 99 EZ Credits"
   - **Redirect:** Back to credits page with success message

---

## 🔧 Technical Implementation

### 1. API Endpoint: `/api/credits/buy-radium-with-ez/route.ts`

```typescript
POST /api/credits/buy-radium-with-ez

Request Body:
{
  "radiumAmount": 30,
  "ezCreditCost": 99,
  "packName": "Medium Pack"
}

Response:
{
  "success": true,
  "ezCreditBalance": 401,
  "radiumBalance": 30,
  "radiumAdded": 30
}
```

**What it does:**

1. Validates user authentication
2. Checks EZ Credit balance
3. Uses transaction to ensure atomicity:
   - Deducts EZ Credits
   - Creates `UserCreditTransaction` (type: USAGE)
   - Adds Radium Credits (upsert)
   - Creates `RadiumTransaction` (type: PURCHASE)
   - Creates `Payment` record (type: RADIUM_CREDITS, currency: EZ_CREDITS)
4. Sends notification to user
5. Returns updated balances

### 2. Profile Credits Page: `/app/profile/credits/CreditsDisplay.tsx`

**Changes:**

- Added `ezCredits` state to track EZ Credit balance
- Added `fetchEzCredits()` function
- Added `handlePayWithEzCredits(pack)` function
- Added conditional "Pay with EZ Credits" button
- Shows EZ Credit balance and shortfall

**UI Logic:**

```typescript
{
  ezCredits !== null && ezCredits >= Math.ceil(pack.price) && (
    <button onClick={() => handlePayWithEzCredits(pack)}>
      💎 Pay with {Math.ceil(pack.price)} EZ Credits
    </button>
  );
}

{
  ezCredits !== null && (
    <p>
      Your EZ Credits: {ezCredits.toLocaleString()}
      {ezCredits < Math.ceil(pack.price) && (
        <span>
          Need {(Math.ceil(pack.price) - ezCredits).toLocaleString()} more
        </span>
      )}
    </p>
  );
}
```

### 3. Pricing Page Client: `/app/pricing/PricingClient.tsx`

**Changes:**

- Updated `handlePayWithCredits()` to differentiate between:
  - **Subscriptions:** Uses `/api/credits/pay-with-credits` (existing)
  - **Radium Credits:** Uses `/api/credits/buy-radium-with-ez` (new)
- Updated button text: "Pay with EZ Credits"
- Updated balance display: "Your EZ Credits"
- Updated confirmation dialog: "Pay with X EZ Credits?"

---

## 📊 Transaction Records

### EZ Credits (UserCreditTransaction)

```typescript
{
  type: "USAGE",
  amount: -99,  // Negative (deduction)
  balance: 401,  // New balance
  description: "Purchased 30 Radium Credits (Medium Pack)"
}
```

### Radium Credits (RadiumTransaction)

```typescript
{
  type: "PURCHASE",
  amount: 30,  // Positive (addition)
  balance: 30,  // New balance
  cost: 99,
  currency: "EZ_CREDITS",
  description: "Purchased 30 Radium Credits with EZ Credits (Medium Pack)"
}
```

### Payment Record

```typescript
{
  userId: "...",
  amount: 99,
  currency: "EZ_CREDITS",
  status: "SUCCEEDED",
  type: "RADIUM_CREDITS",
  paidAt: new Date(),
  description: "Radium Credits purchase: Medium Pack",
  metadata: {
    radiumAmount: 30,
    ezCreditCost: 99,
    packName: "Medium Pack"
  }
}
```

---

## 🎨 UI Components

### Button Styling

```typescript
className="bg-gradient-to-r from-purple-600 to-pink-600 text-white
  rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700
  transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
```

### Balance Display

```typescript
Your EZ Credits: 500
Need 99 more  // Only shows if insufficient
```

---

## ✅ User Flow Examples

### Example 1: Sufficient Balance

**User has:** 500 EZ Credits
**Pack costs:** $99 (= 99 EZ Credits)
**Button shows:** "💎 Pay with 99 EZ Credits"
**User clicks:** Confirmation → Payment → Success!
**Result:** 401 EZ Credits, +30 Radium Credits

### Example 2: Insufficient Balance

**User has:** 50 EZ Credits
**Pack costs:** $99 (= 99 EZ Credits)
**Button shows:** Not visible
**Balance shows:** "Your EZ Credits: 50 | Need 49 more"
**Alternative:** User can pay with PayPal or Crypto

### Example 3: Exact Balance

**User has:** 99 EZ Credits
**Pack costs:** $99 (= 99 EZ Credits)
**Button shows:** "💎 Pay with 99 EZ Credits"
**User clicks:** Confirmation → Payment → Success!
**Result:** 0 EZ Credits, +30 Radium Credits

---

## 🔒 Security & Validation

### API Validation

1. ✅ User authentication required
2. ✅ Request data validation (amounts, types)
3. ✅ Balance verification (sufficient funds)
4. ✅ Transaction atomicity (all or nothing)
5. ✅ Audit trail (transaction records)

### UI Validation

1. ✅ Button only appears with sufficient balance
2. ✅ Button disabled while processing
3. ✅ Confirmation dialog before payment
4. ✅ Error handling with user feedback
5. ✅ Automatic balance refresh after purchase

---

## 📍 Where to Find It

### User Pages

- **Profile Credits:** https://www.ezcasinoaff.com/profile/credits
- **Pricing Page:** https://www.ezcasinoaff.com/pricing

### Admin Pages

- **EZ Credits Admin:** https://www.ezcasinoaff.com/admin/credits
- **Radium Credits Admin:** https://www.ezcasinoaff.com/admin/radium-credits

### API Endpoints

- `POST /api/credits/buy-radium-with-ez` - Buy Radium Credits with EZ Credits
- `GET /api/ez-credits` - Get user's EZ Credit balance
- `GET /api/credits` - Get user's Radium Credit balance

---

## 💡 Notes

1. **1:1 Ratio:** 1 EZ Credit = $1 USD, so a $99 pack costs 99 EZ Credits
2. **No Fractional Credits:** Amounts are rounded up (Math.ceil)
3. **Instant Processing:** No payment gateway delay
4. **Non-Reversible:** Once purchased, cannot be undone (no refund button)
5. **Transaction History:** Both credit types show the purchase in their history

---

## 🚀 Benefits

### For Users:

- ✅ Instant payment (no PayPal delays)
- ✅ Use existing EZ Credits
- ✅ No transaction fees
- ✅ No payment gateway
- ✅ Immediate access to Radium Credits

### For Admin:

- ✅ No payment processing fees
- ✅ Complete transaction control
- ✅ Detailed audit trail
- ✅ Encourages EZ Credit purchases
- ✅ Locked-in user value

---

## 🎯 Complete Payment Options for Radium Credits

Users can now purchase Radium Credits via:

1. **💳 PayPal** - Standard payment gateway
2. **💎 EZ Credits** - Instant internal payment (NEW!)
3. **💰 Crypto** - Contact form for crypto payments

---

**Ready to use!** Users with EZ Credits can now instantly purchase Radium Credits! 🚀

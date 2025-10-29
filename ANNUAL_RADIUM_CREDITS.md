# Annual Radium Credits Award System

**Last Updated:** October 28, 2025

---

## Overview

When users subscribe to an annual plan, they now receive **all Radium Credits upfront** for the entire year instead of monthly allocations. This simplifies management and gives users immediate access to all their credits.

---

## 🎯 Credit Allocation by Plan

### BASIC Plan

- **Monthly equivalent:** 10 Radium Credits
- **Annual award:** **120 Radium Credits** (10 × 12)
- **When awarded:** Immediately upon subscription activation
- **Price:** $300/year ($25/month)

### PRO Plan (Most Popular)

- **Monthly equivalent:** 25 Radium Credits
- **Annual award:** **300 Radium Credits** (25 × 12)
- **When awarded:** Immediately upon subscription activation
- **Price:** $360/year ($30/month)

### EVERYTHING Plan

- **Monthly equivalent:** 50 Radium Credits
- **Annual award:** **600 Radium Credits** (50 × 12)
- **When awarded:** Immediately upon subscription activation
- **Price:** $420/year ($35/month)

---

## 💡 Why Annual Upfront?

### Benefits:

1. **No Monthly Management** - Credits awarded once per year
2. **Immediate Access** - Users get all credits right away
3. **Flexibility** - Users can use credits at their own pace
4. **Simplified Tracking** - One transaction per subscription
5. **User Control** - No waiting for monthly allocations

### For the Admin:

- ✅ No monthly cron jobs needed
- ✅ Simpler accounting
- ✅ Fewer database transactions
- ✅ Less maintenance overhead

---

## 🔧 Implementation Details

### PayPal Payments

**File:** `app/api/paypal/capture-order/route.ts`

```typescript
const planKey = planType as keyof typeof SUBSCRIPTION_PLANS;
const plan = SUBSCRIPTION_PLANS[planKey];
const annualRadiumCredits = plan.features.includedCredits * 12; // Award full year upfront

// New subscription
const radiumCredit = await prisma.radiumCredit.upsert({
  where: { userId: session.user.id },
  create: {
    userId: session.user.id,
    balance: annualRadiumCredits,
    lifetime: annualRadiumCredits,
  },
  update: {
    balance: { increment: annualRadiumCredits },
    lifetime: { increment: annualRadiumCredits },
  },
});

// Create transaction record
await prisma.radiumTransaction.create({
  data: {
    userId: session.user.id,
    creditId: radiumCredit.id,
    type: "SUBSCRIPTION",
    amount: annualRadiumCredits,
    balance: radiumCredit.balance,
    description: `Annual Radium Credits for ${planType} subscription (${siteName})`,
  },
});
```

### EZ Credits Payment

**File:** `app/api/credits/pay-with-credits/route.ts`

Same logic as PayPal - awards full annual credits immediately when subscription is activated with EZ Credits.

---

## 📊 Transaction Records

### Radium Transaction Example

```typescript
{
  type: "SUBSCRIPTION",
  amount: 300,  // Full annual amount
  balance: 300,  // User's new balance
  description: "Annual Radium Credits for PRO subscription (mysite.com)"
}
```

### User Notification

```
Title: "Subscription Activated! 🎉"
Message: "Your PRO subscription for mysite.com is now active. You received 300 Radium Credits!"
Link: "/profile/credits"
```

---

## 🔄 Renewal Behavior

### On Annual Renewal:

1. User's subscription renews (payment processed)
2. **Another full year of credits awarded**
3. Credits **stack** with existing balance
4. No expiration on credits

### Example Scenario:

- **Year 1:** User subscribes to PRO → Gets 300 credits
- **Uses:** 150 credits throughout the year
- **Balance:** 150 credits remaining
- **Year 2:** Subscription renews → Gets 300 more credits
- **New Balance:** 450 credits (150 + 300)

---

## 📍 Where Credits Are Awarded

### 1. New Subscription (PayPal)

- Location: `app/api/paypal/capture-order/route.ts`
- Trigger: PayPal payment capture succeeds
- Action: Create subscription + Award annual credits

### 2. Subscription Renewal (PayPal)

- Location: `app/api/paypal/capture-order/route.ts`
- Trigger: PayPal payment capture succeeds (existing subscription)
- Action: Update subscription + Award annual credits

### 3. New Subscription (EZ Credits)

- Location: `app/api/credits/pay-with-credits/route.ts`
- Trigger: EZ Credits payment succeeds
- Action: Create subscription + Award annual credits

---

## 🎨 UI Updates

### Pricing Page (`lib/pricing.ts`)

**Before:**

```
"10 Radium credits per month"
"25 Radium credits per month"
"50 Radium credits per month"
```

**After:**

```
"120 Radium credits (10/mo - awarded annually)"
"300 Radium credits (25/mo - awarded annually)"
"600 Radium credits (50/mo - awarded annually)"
```

This makes it clear to users that:

- They get the full year's worth of credits upfront
- The monthly rate is just for reference
- All credits are available immediately

---

## ✅ User Experience Flow

### New Subscription Flow:

1. **User selects PRO plan** ($360/year)
2. **Pays via PayPal or EZ Credits**
3. **Subscription activates immediately**
4. **Receives notification:** "You received 300 Radium Credits!"
5. **Visits `/profile/credits`**
6. **Sees balance:** 300 Radium Credits
7. **Can start generating reviews immediately**

### Renewal Flow:

1. **Year passes, subscription expires**
2. **User renews for another year**
3. **Payment processes**
4. **Receives another full year of credits** (300 for PRO)
5. **Credits stack with unused balance**
6. **Notification:** "Your subscription has been renewed. You received 300 Radium Credits!"

---

## 🔒 Security & Validation

### Safeguards:

1. ✅ Credits only awarded on successful payment
2. ✅ Transaction-safe database operations
3. ✅ Duplicate prevention via payment status checks
4. ✅ Complete audit trail in RadiumTransaction table
5. ✅ User notifications for transparency

---

## 📈 Statistics & Tracking

### Admin Can Track:

- Total credits awarded per subscription type
- Credit usage patterns over time
- Unused credits per user
- Credit balance trends

### Query Examples:

**Total credits awarded from subscriptions:**

```sql
SELECT SUM(amount)
FROM RadiumTransaction
WHERE type = 'SUBSCRIPTION';
```

**Credits awarded per plan:**

```sql
SELECT description, SUM(amount) as total
FROM RadiumTransaction
WHERE type = 'SUBSCRIPTION'
GROUP BY description;
```

---

## 💡 Important Notes

1. **Credits Never Expire** - Users keep unused credits indefinitely
2. **Credits Stack** - Renewal credits add to existing balance
3. **Non-Refundable** - Credits are awarded immediately and cannot be refunded
4. **Account-Wide** - Credits work across all user's sites
5. **One-Time per Year** - Credits awarded once at subscription start/renewal

---

## 🚀 Benefits Summary

### For Users:

- ✅ Immediate access to all credits
- ✅ Use credits at own pace
- ✅ No waiting for monthly allocations
- ✅ Credits don't expire
- ✅ Credits stack on renewal

### For Admin:

- ✅ No monthly processing needed
- ✅ Simpler system architecture
- ✅ Fewer database transactions
- ✅ Easier to audit and track
- ✅ Less maintenance required

---

**All set!** Subscribers now receive their full year of Radium Credits immediately! 🎉

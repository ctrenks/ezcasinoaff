# Subscription Feature Flags Fix

## Issue

When users purchased Pro or Everything subscriptions, the site was activated and Radium credits were awarded correctly, but the **feature flags** (`hasGameScreenshots` and `hasBonusCodeFeed`) were **not being set** on the Site model.

## Root Cause

The subscription payment handlers were only updating:

- ✅ `isActive: true`
- ✅ `status: "ACTIVE"`
- ✅ Radium credits awarded
- ❌ Missing: `hasGameScreenshots`
- ❌ Missing: `hasBonusCodeFeed`

## Correct Feature Flags per Plan

According to `lib/pricing.ts`:

| Plan           | hasGameScreenshots | hasBonusCodeFeed |
| -------------- | ------------------ | ---------------- |
| **BASIC**      | `false`            | `false`          |
| **PRO**        | `true` ✅          | `false`          |
| **EVERYTHING** | `true` ✅          | `true` ✅        |

## Files Fixed

### 1. PayPal Payment Route: `app/api/paypal/capture-order/route.ts`

#### New Subscription (Lines 163-172)

```typescript
// Activate the site and set feature flags based on plan
await prisma.site.update({
  where: { id: existingSite.id },
  data: {
    isActive: true,
    status: "ACTIVE",
    hasGameScreenshots: plan.features.gameScreenshots,
    hasBonusCodeFeed: plan.features.bonusCodeFeed,
  },
});
```

#### Subscription Renewal/Upgrade (Lines 92-112)

```typescript
// Update existing subscription (renewal/upgrade)
await prisma.subscription.update({
  where: { id: existingSite.subscription.id },
  data: {
    plan: planType, // Update plan in case of upgrade
    status: "ACTIVE",
    lastPaymentDate: new Date(),
    lastPaymentAmount: paymentAmount,
  },
});

// Update site feature flags based on plan
await prisma.site.update({
  where: { id: existingSite.id },
  data: {
    isActive: true,
    status: "ACTIVE",
    hasGameScreenshots: plan.features.gameScreenshots,
    hasBonusCodeFeed: plan.features.bonusCodeFeed,
  },
});
```

### 2. EZ Credits Payment Route: `app/api/credits/pay-with-credits/route.ts`

#### New Subscription (Lines 156-166)

```typescript
// Update site and set feature flags based on plan
await tx.site.update({
  where: { id: site.id },
  data: {
    subscriptionId: subscription.id,
    isActive: true,
    status: "ACTIVE",
    hasGameScreenshots: plan.features.gameScreenshots,
    hasBonusCodeFeed: plan.features.bonusCodeFeed,
  },
});
```

## What This Fixes

### For PRO Subscribers:

- ✅ `hasGameScreenshots` will now be set to `true`
- ✅ Users will have access to game screenshot images via API
- ✅ `hasBonusCodeFeed` remains `false` (correct for PRO)

### For EVERYTHING Subscribers:

- ✅ `hasGameScreenshots` will be set to `true`
- ✅ `hasBonusCodeFeed` will be set to `true`
- ✅ Users will have access to both game screenshots AND bonus code feed

### For BASIC Subscribers:

- ✅ Both flags remain `false` (correct for BASIC)

## Plan Upgrades

The fix also handles plan upgrades correctly:

- When a user upgrades from BASIC → PRO, `hasGameScreenshots` is enabled
- When a user upgrades from PRO → EVERYTHING, `hasBonusCodeFeed` is enabled
- The subscription plan type is also updated in the database

## Testing Checklist

- [ ] New PRO subscription → `hasGameScreenshots = true`
- [ ] New EVERYTHING subscription → both flags `true`
- [ ] Renewal keeps the correct flags
- [ ] Upgrade from BASIC → PRO → `hasGameScreenshots` enabled
- [ ] Upgrade from PRO → EVERYTHING → `hasBonusCodeFeed` enabled
- [ ] Existing sites are unaffected
- [ ] Radium credits still awarded correctly (300 for PRO, 600 for EVERYTHING)

## Notes

- Admin routes for manual credit adjustments don't need changes (they only adjust credits, not subscriptions)
- No database migration needed (fields already exist in schema)
- No breaking changes to existing functionality

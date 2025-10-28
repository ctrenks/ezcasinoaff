# Dual Credit System

## Overview

The platform now has **two separate credit systems** with distinct purposes:

### 1. **User Credits** (Payment Currency)

- **Purpose**: Currency for purchasing subscriptions and services
- **Ratio**: 1 User Credit = $1 USD
- **Uses**:
  - Pay for site subscriptions
  - Purchase more User Credits
  - General payment currency

### 2. **Radium Credits** (AI Review Generation)

- **Purpose**: Credits for generating AI casino/game reviews
- **Cost**: ~$3-4 per Radium Credit (approximately 4 User Credits = 1 Radium Credit)
- **Uses**:
  - Generate casino reviews
  - Generate game reviews
  - AI content generation

## Database Schema

### User Credits

```prisma
model UserCredit {
  id            String                  @id
  userId        String                  @unique
  balance       Int                     // Current balance
  lifetime      Int                     // Total earned/purchased
  transactions  UserCreditTransaction[]
}

model UserCreditTransaction {
  id              String
  userId          String
  type            UserCreditTransactionType
  amount          Int                   // Credits (positive or negative)
  balance         Int                   // Balance after transaction
  cost            Decimal?              // For purchases
  description     String?
}

enum UserCreditTransactionType {
  PURCHASE        // Bought credits with money
  USAGE           // Used credits to pay for something
  REFUND          // Credits refunded
  ADMIN_ADJUST    // Admin adjustment
  BONUS           // Promotional credits
}
```

### Radium Credits

```prisma
model RadiumCredit {
  id            String              @id
  userId        String              @unique
  balance       Int                 // Radium credits for AI reviews
  lifetime      Int
  transactions  RadiumTransaction[]
}

model RadiumTransaction {
  id              String
  userId          String
  type            RadiumTransactionType
  amount          Int
  balance         Int
  siteId          String?           // Site where Radium was used
  description     String?
}

enum RadiumTransactionType {
  PURCHASE        // Purchased Radium
  USAGE           // Used Radium for review generation
  REFUND
  ADMIN_ADJUST
  BONUS
}
```

## Payment Type Updates

```prisma
enum PaymentType {
  SUBSCRIPTION
  USER_CREDITS       // Purchasing User Credits (payment currency)
  RADIUM_CREDITS     // Purchasing Radium Credits (AI reviews)
  ADDON
}
```

## Pricing Structure

### User Credits Packs

```typescript
{
  "starter": {
    credits: 100,
    price: 100,      // $100 = 100 User Credits
    bonus: 0
  },
  "popular": {
    credits: 500,
    price: 500,
    bonus: 50        // +50 bonus credits
  },
  "professional": {
    credits: 1000,
    price: 1000,
    bonus: 150       // +150 bonus credits
  },
  "enterprise": {
    credits: 5000,
    price: 5000,
    bonus: 1000      // +1000 bonus credits
  }
}
```

### Radium Credits Packs

```typescript
{
  "starter": {
    radium: 10,
    userCredits: 40,  // 4 User Credits per Radium
    price: 40,        // $40 for 10 Radium
    bonus: 0
  },
  "popular": {
    radium: 50,
    userCredits: 180, // Discounted: 3.6 per Radium
    price: 180,
    bonus: 5
  },
  "professional": {
    radium: 100,
    userCredits: 330, // Discounted: 3.3 per Radium
    price: 330,
    bonus: 15
  },
  "enterprise": {
    radium: 500,
    userCredits: 1500, // Discounted: 3 per Radium
    price: 1500,
    bonus: 100
  }
}
```

## Usage Flows

### Flow 1: User Buys Subscription with User Credits

```
1. User has 500 User Credits
2. PRO subscription costs $199 = 199 User Credits
3. User clicks "Pay with Credits"
4. Deduct 199 User Credits
5. Activate PRO subscription
6. New balance: 301 User Credits
```

### Flow 2: User Buys Radium Credits with Money

```
1. User selects "50 Radium Pack" ($180)
2. Pay via PayPal
3. Add 50 Radium Credits to user's account
4. User can now generate 50 AI reviews
```

### Flow 3: User Buys Radium Credits with User Credits

```
1. User has 500 User Credits
2. User wants 50 Radium Credits
3. Cost: 180 User Credits (from pricing)
4. User clicks "Pay with Credits"
5. Deduct 180 User Credits
6. Add 50 Radium Credits
7. New balances:
   - User Credits: 320
   - Radium Credits: 50
```

### Flow 4: User Generates AI Review

```
1. User selects a casino to review
2. Cost: 1 Radium Credit
3. Check Radium Credit balance
4. If balance >= 1:
   - Generate review
   - Deduct 1 Radium Credit
   - Log transaction with siteId
5. Else: Show "Buy Radium Credits" prompt
```

## API Changes Needed

### Current APIs Using "Credits" (Need Update)

1. **`/api/credits`** → Rename to `/api/user-credits`

   - Returns User Credit balance
   - Returns User Credit transactions

2. **`/api/credits/transactions`** → `/api/user-credits/transactions`

   - User Credit transaction history

3. **`/api/credits/pay-with-credits`** → `/api/user-credits/pay`

   - Pay for subscriptions/services with User Credits

4. **Create `/api/radium-credits`**

   - Returns Radium Credit balance
   - Returns Radium Credit transactions

5. **Create `/api/radium-credits/purchase`**

   - Purchase Radium Credits with money or User Credits

6. **Create `/api/radium-credits/use`**
   - Use Radium Credit for AI generation
   - Log which site/casino/game

### Admin APIs

1. **`/api/admin/credits/manual-adjust`** → Keep name, add type param
   - Add `type: "user" | "radium"` parameter
   - Adjust either User Credits or Radium Credits

## UI Components to Update

### `/profile/credits` Page

**Rename to:** `/profile/user-credits`

- Show User Credit balance
- Purchase User Credit packs
- Transaction history

### Create: `/profile/radium-credits` Page

- Show Radium Credit balance
- Purchase Radium Credit packs
- Transaction history with site details
- "Generate Review" button

### Navigation Updates

```tsx
<Link href="/profile/user-credits">
  <span>💰</span> User Credits
</Link>
<Link href="/profile/radium-credits">
  <span>🤖</span> Radium Credits
</Link>
```

### Admin Dashboard Stats

```tsx
{
  title: "User Credits in Circulation",
  value: totalUserCredits,
},
{
  title: "Radium Credits in Circulation",
  value: totalRadiumCredits,
}
```

## Migration Steps

### 1. Database Migration

```bash
npx prisma migrate dev --name add_user_credits
```

This will:

- Create `UserCredit` and `UserCreditTransaction` tables
- Keep existing `RadiumCredit` and `RadiumTransaction` tables
- Add new `USER_CREDITS` payment type

### 2. Data Migration Script

**Option A**: Keep existing data as User Credits

```sql
-- Copy RadiumCredit to UserCredit for all users
INSERT INTO "UserCredit" (id, userId, balance, lifetime, createdAt, updatedAt)
SELECT gen_random_uuid(), userId, balance, lifetime, createdAt, updatedAt
FROM "RadiumCredit";

-- Reset RadiumCredit balances to 0
UPDATE "RadiumCredit" SET balance = 0, lifetime = 0;
```

**Option B**: Fresh start (recommended if no users yet)

- Create UserCredit records as users sign up
- Keep RadiumCredit at 0 until purchased

### 3. Code Updates Priority

**High Priority (Breaking Changes)**:

1. ✅ Update `prisma/schema.prisma`
2. Create `/api/user-credits` endpoints
3. Update payment flows to use UserCredit
4. Update admin manual adjustment to support both types

**Medium Priority (Feature Completion)**:

1. Create Radium Credit purchase flow
2. Create Radium usage API for review generation
3. Update UI to show both credit types
4. Create separate credit pages

**Low Priority (Polish)**:

1. Update documentation
2. Add credit conversion calculator
3. Create credit pack recommendations
4. Add low-balance warnings

## Benefits of Dual System

### For Users:

- 💰 **Flexible spending**: User Credits for everything
- 🤖 **Specialized tool**: Radium for AI reviews
- 📊 **Clear tracking**: Separate balances prevent confusion
- 💵 **Bulk discounts**: Better rates when buying Radium in bulk

### For Platform:

- 💼 **Revenue streams**: Two products to sell
- 📈 **Higher value**: Radium Credits cost more per unit
- 🔒 **Locked-in value**: Credits create platform stickiness
- 📊 **Better analytics**: Track usage patterns separately

## Important Notes

- **User Credits** are general purpose (1:1 with USD)
- **Radium Credits** are specialized and more expensive
- Users can buy Radium with either money OR User Credits
- Conversion rate: ~4 User Credits = 1 Radium Credit
- Both credit types are non-transferable between users
- Admin can adjust either credit type independently
- Full audit trail maintained for both systems

## Next Steps

1. Run database migration
2. Update existing `/api/credits` endpoints
3. Create new Radium Credit endpoints
4. Update UI components
5. Test payment flows
6. Deploy to production

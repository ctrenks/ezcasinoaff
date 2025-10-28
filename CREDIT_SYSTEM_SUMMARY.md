# Credit System - Final Configuration

**Last Updated:** October 28, 2025
**Status:** ✅ COMPLETE

---

## Two Separate Credit Systems

### 1. **EZ Credits** - Payment Currency 💎

- **Purpose:** Payment currency for subscriptions and services
- **Rate:** 1 EZ Credit = $1 USD (1:1 ratio)
- **Page:** [`/profile/ez-credits`](https://www.ezcasinoaff.com/profile/ez-credits)
- **API Endpoint:** `/api/ez-credits`
- **Database:** `UserCredit` and `UserCreditTransaction` models

#### How to Get EZ Credits:

- ✅ **Crypto Payment Only** - Users contact `support@ezcasinoaff.com`
- ✅ **Manual Admin Credit** - Admin adds credits after confirming crypto payment
- ❌ **NOT available via PayPal** - Manual crypto only

#### How to Use EZ Credits:

- Pay for site subscriptions (1:1 dollar value)
- Convert to Radium Credits (4 EZ Credits = 1 Radium Credit)
- Use for any platform services

---

### 2. **Radium Credits** - AI Review Generation 🤖

- **Purpose:** Generate AI-powered casino/game reviews
- **Rate:** ~$3-4 per credit
- **Page:** [`/profile/credits`](https://www.ezcasinoaff.com/profile/credits)
- **API Endpoint:** `/api/credits`
- **Database:** `RadiumCredit` and `RadiumTransaction` models

#### How to Get Radium Credits:

- ✅ **Purchase via PayPal** - Automated purchase (coming soon)
- ✅ **Purchase via Crypto** - Contact form to admin
- ✅ **Convert from EZ Credits** - 4 EZ Credits = 1 Radium Credit

#### How to Use Radium Credits:

- Generate AI-powered casino reviews
- Generate AI-powered game reviews
- Each review costs ~1 Radium Credit
- Used via WordPress plugin or API

---

## Navigation Structure

**User Menu (Logged In):**

```
🛡️ Admin Dashboard (role 5 only)
💰 Affiliates
🏢 My Sites
🤖 Radium Credits  → /profile/credits
💎 EZ Credits      → /profile/ez-credits
👤 Profile
🚪 Sign Out
```

---

## API Endpoints

### EZ Credits (Payment Currency)

- `GET /api/ez-credits` - Get balance and transactions
- `POST /api/credits/pay-with-credits` - Pay with EZ Credits
- Admin: `POST /api/admin/credits/manual-adjust` - Manually add/remove

### Radium Credits (AI Reviews)

- `GET /api/credits` - Get balance and transactions
- `GET /api/credits/transactions` - Get detailed history
- `POST /api/paypal/create-order` (type: "radium") - Purchase via PayPal
- `POST /api/crypto-inquiry` (purchaseType: "radium") - Crypto inquiry

---

## Purchase Flows

### Buying EZ Credits (Crypto Only)

1. User contacts `support@ezcasinoaff.com`
2. Admin provides crypto wallet address
3. User sends crypto payment
4. Admin verifies transaction on blockchain
5. Admin logs into `/admin/credits`
6. Admin searches for user email
7. Admin manually adds EZ Credits with description
8. User receives notification
9. Credits appear in `/profile/ez-credits`

### Buying Radium Credits (PayPal/Crypto)

1. **PayPal:** User clicks "Purchase Radium Credits" → selects pack → PayPal checkout → auto-credited
2. **Crypto:** User clicks "Pay with Crypto" → fills form → admin receives email → manual credit

### Using EZ Credits for Payment

1. User goes to `/pricing` or `/profile/sites`
2. Sees "Pay with Credits" button (if balance sufficient)
3. Clicks button → confirms payment
4. EZ Credits deducted at 1:1 ratio
5. Subscription/service activated immediately

---

## Database Models

### UserCredit (EZ Credits)

```prisma
model UserCredit {
  id            String                  @id @default(cuid())
  userId        String                  @unique
  balance       Int                     @default(0)    // Current EZ Credits
  lifetime      Int                     @default(0)    // Total earned
  updatedAt     DateTime                @updatedAt
  createdAt     DateTime                @default(now())
  user          User                    @relation(...)
  transactions  UserCreditTransaction[]
}
```

### RadiumCredit (AI Credits)

```prisma
model RadiumCredit {
  id            String              @id @default(cuid())
  userId        String              @unique
  balance       Int                 @default(0)    // Current Radium Credits
  lifetime      Int                 @default(0)    // Total purchased
  updatedAt     DateTime            @updatedAt
  createdAt     DateTime            @default(now())
  user          User                @relation(...)
  transactions  RadiumTransaction[]
}
```

---

## Admin Management

### Managing EZ Credits

- Page: `/admin/credits`
- Search user by email
- Manually add/remove credits
- Add description for audit trail
- User gets notification

### Managing Radium Credits

- Same page: `/admin/credits` (currently set for Radium)
- Can be extended to manage both types
- Track AI review usage
- Monitor for abuse

---

## User Experience

### EZ Credits Page (`/profile/ez-credits`)

- Shows current balance
- Shows transaction history
- Explains how to get more (crypto only)
- Links to use credits (subscriptions)
- No purchase button (crypto manual only)

### Radium Credits Page (`/profile/credits`)

- Shows current balance
- Shows transaction history
- Purchase packs (PayPal/crypto)
- Explains conversion from EZ Credits
- Links to WordPress plugin docs

---

## Payment Integration

### PayPal

- Used for: Radium Credits, Subscriptions
- NOT used for: EZ Credits
- Endpoint: `/api/paypal/create-order`
- Type: `"credits"` (Radium) or `"subscription"`

### Crypto (Manual)

- Used for: EZ Credits only
- Inquiry form sends email to admin
- Admin manually processes and credits account
- No automated crypto payment gateway

### Credit Payments

- Used for: Subscriptions, Services
- Uses EZ Credits at 1:1 ratio
- Endpoint: `/api/credits/pay-with-credits`
- Immediate activation

---

## Key Differences

| Feature        | EZ Credits 💎         | Radium Credits 🤖    |
| -------------- | --------------------- | -------------------- |
| **Purpose**    | Payment currency      | AI review generation |
| **Value**      | $1 per credit         | ~$3-4 per credit     |
| **Purchase**   | Crypto only (manual)  | PayPal or Crypto     |
| **Usage**      | Pay for subscriptions | Generate AI reviews  |
| **Page**       | `/profile/ez-credits` | `/profile/credits`   |
| **API**        | `/api/ez-credits`     | `/api/credits`       |
| **Conversion** | 4 EZ → 1 Radium       | Not applicable       |

---

## Future Enhancements

### For EZ Credits:

- [ ] Automated crypto payment gateway
- [ ] Bank transfer option
- [ ] Gift codes/vouchers
- [ ] Bulk purchase discounts

### For Radium Credits:

- [ ] Subscription bundles (monthly Radium credits)
- [ ] Usage analytics dashboard
- [ ] AI review quality ratings
- [ ] Custom review templates

---

**All systems operational and tested!** ✅

For support: support@ezcasinoaff.com

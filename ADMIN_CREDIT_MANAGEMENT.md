# Admin Credit Management Guide

**Last Updated:** October 28, 2025

---

## Overview

As a super admin (role 5), you have two separate pages to manage the two different credit systems:

1. **EZ Credits Management** - `/admin/credits`
2. **Radium Credits Management** - `/admin/radium-credits`

---

## 💎 EZ Credits Management

**Page:** https://www.ezcasinoaff.com/admin/credits

### Purpose

Manage EZ Credits (payment currency) for:

- Crypto payment processing
- Special promotions
- Manual adjustments
- Refunds/compensation

### How to Add EZ Credits (Typical Crypto Flow)

1. **User contacts you** with preferred crypto and amount
2. **You provide** your crypto wallet address
3. **User sends payment** in crypto
4. **You verify** transaction on blockchain
5. **Go to** `/admin/credits`
6. **Search** for user by email
7. **Enter amount** (1 EZ Credit = $1 USD)
8. **Enter description:** e.g., "Crypto payment - BTC TxID: abc123..."
9. **Select method:** Crypto
10. **Click "Add EZ Credits"**
11. User receives notification and sees credits in `/profile/ez-credits`

### Example Use Cases

**Crypto Payment:**

- Amount: 500
- Description: "Crypto payment - BTC Transaction ID: 7f8a9b2c..."
- Method: Crypto

**Promotional Bonus:**

- Amount: 100
- Description: "Welcome bonus - New user promotion"
- Method: Promotion

**Refund:**

- Amount: -250
- Description: "Refund for cancelled subscription"
- Method: Refund

---

## 🤖 Radium Credits Management

**Page:** https://www.ezcasinoaff.com/admin/radium-credits

### Purpose

Manage Radium Credits (AI review generation) for:

- Promotional bonuses
- Compensations
- Special rewards
- Manual adjustments

### How to Add Radium Credits

1. **Go to** `/admin/radium-credits`
2. **Search** for user by email
3. **Enter amount** (~$3-4 value per credit)
4. **Enter description:** Reason for adjustment
5. **Select method:** Manual/Promotion/Bonus/etc.
6. **Click "Add Radium Credits"**
7. User receives notification and sees credits in `/profile/credits`

### Example Use Cases

**Promotional Bonus:**

- Amount: 10
- Description: "Launch promotion - 10 free Radium Credits"
- Method: Promotion

**Compensation:**

- Amount: 5
- Description: "Compensation for service downtime"
- Method: Compensation

**Refund:**

- Amount: -3
- Description: "Credit reversal - duplicate transaction"
- Method: Refund

---

## Admin Dashboard

**Main Dashboard:** https://www.ezcasinoaff.com/admin

From here you can access:

- **💎 Manage EZ Credits** → `/admin/credits`
- **🤖 Manage Radium Credits** → `/admin/radium-credits`
- **⚙️ Manage Affiliates** → `/admin/affiliates`
- **📢 Send Notifications** → `/admin/notifications`
- **💬 Forum Management** → `/forum/admin`

---

## API Endpoints

### EZ Credits

- `POST /api/admin/credits/manual-adjust` - Add/remove EZ Credits
- `GET /api/admin/credits/manual-adjust` - Get recent adjustments

### Radium Credits

- `POST /api/admin/radium-credits/manual-adjust` - Add/remove Radium Credits
- `GET /api/admin/radium-credits/manual-adjust` - Get recent adjustments

### User Search

- `GET /api/admin/users/search?email={email}` - Find user by email
- Returns both EZ Credit and Radium Credit balances

---

## Transaction Tracking

### EZ Credits

- Creates `UserCreditTransaction` record (type: `ADMIN_ADJUST`)
- Creates `Payment` record (type: `USER_CREDITS`)
- Sends notification with link to `/profile/ez-credits`
- Shows in user's EZ Credits transaction history

### Radium Credits

- Creates `RadiumTransaction` record (type: `ADMIN_ADJUST`)
- Creates `Payment` record (type: `RADIUM_CREDITS`)
- Sends notification with link to `/profile/credits`
- Shows in user's Radium Credits transaction history

---

## Best Practices

### For EZ Credits:

1. **Always include transaction ID** when processing crypto payments
2. **Verify on blockchain** before crediting
3. **Use descriptive reasons** for audit trail
4. **Double-check amounts** (1:1 with USD)
5. **Keep records** of crypto addresses used

### For Radium Credits:

1. **Be conservative** with promotional credits (~$3-4 each)
2. **Track promotional campaigns** in descriptions
3. **Monitor usage patterns** for abuse
4. **Set clear limits** on bonuses per user
5. **Document special cases** thoroughly

---

## Recent Transactions View

Both pages show a table of recent adjustments including:

- User name and email
- Amount added/removed
- Resulting balance
- Description
- Date of adjustment

Use this to:

- Audit recent changes
- Track promotional campaigns
- Verify crypto payments processed
- Review refunds issued

---

## Security Notes

⚠️ **Important:**

- Only role 5 (super admin) can access these pages
- All actions are logged with your admin email
- Users receive notifications for all adjustments
- All transactions are permanent (no undo)
- Always verify user email before adjusting credits

---

## Common Questions

**Q: What if I need to remove credits?**
A: Click "Remove Credits" instead of "Add Credits". Enter the amount to subtract.

**Q: Can users see who added credits?**
A: No, they only see "Admin adjustment" in their transaction history.

**Q: What happens if I enter the wrong amount?**
A: Make a second adjustment to correct it. Document both in descriptions.

**Q: Can I bulk add credits to multiple users?**
A: No, each adjustment must be done individually for security and audit purposes.

**Q: How do I know which credit type to use?**
A:

- **EZ Credits:** For crypto payments, general currency
- **Radium Credits:** For AI review generation only

---

## Support

For admin-related issues:

- Email: admin@ezcasinoaff.com
- Documentation: Review this guide
- Audit Trail: Check recent transactions table

---

**Remember:** With great power comes great responsibility! Always double-check before adjusting credits.

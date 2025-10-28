# Affiliate Program Documentation

## Overview

The affiliate program allows users to generate referral links and earn commissions when new users they refer make payments. The system tracks referrals, calculates commissions, and provides a comprehensive dashboard for affiliates.

## Features Implemented

### 1. Database Schema

- **User Extensions**: Added referral tracking fields to the User model

  - `referralCode`: Unique code for each user's referral link
  - `referredById`: Links user to their referrer
  - `commissionRate`: Customizable commission percentage (default 15%)

- **AffiliateCommission Model**: Tracks all commission earnings
  - Automatic commission calculation on payments
  - Status tracking (PENDING, PAID, CANCELLED)
  - Full audit trail with dates and reasons

### 2. API Endpoints

#### `/api/referrals` (GET)

- Returns user's referral information including:
  - Referral code and URL
  - Commission rate
  - Total referrals count
  - Earnings statistics (total, pending, paid)
  - List of referred users with payment history
  - Detailed commission history

#### `/api/referrals/link` (POST)

- Links a new user to their referrer based on referral cookie
- Automatically called on first login after signup
- Prevents self-referrals and duplicate linking

#### `/api/admin/referrals/commission-rate` (GET/PUT)

- **Super Admin Only** (role 0)
- GET: View all users with their commission rates and referral stats
- PUT: Update a specific user's commission rate
- Supports search and pagination

### 3. User Interface

#### Profile Page (`/profile`)

- Displays affiliate program card with:
  - Current commission rate
  - Total referrals count
  - Referral code
  - Quick link to full dashboard

#### Affiliates Dashboard (`/profile/affiliates`)

- **Overview Tab**

  - Stats cards showing total referrals, earnings, and pending commissions
  - Commission rate display
  - Terms and conditions

- **Referred Users Tab**

  - Complete list of all referred users
  - Join dates
  - Last payment dates and amounts
  - User contact information

- **Earnings History Tab**
  - Detailed commission breakdown
  - Payment amounts and commission percentages
  - Status badges (Pending/Paid/Cancelled)
  - Date tracking

#### Referral Link Management

- Automatic referral code generation on first access
- One-click copy to clipboard functionality
- Shareable referral URLs with format: `https://yoursite.com/auth/signin?ref=REFERRAL_CODE`

### 4. Referral Tracking System

#### How It Works:

1. User visits site with referral code in URL: `/auth/signin?ref=ABC123`
2. Referral code is stored in browser cookie (7 days)
3. When user signs up, the ReferralTracker component checks for the cookie
4. User is automatically linked to their referrer via `/api/referrals/link`
5. Cookie is cleared after successful linking

#### Security Features:

- Cannot refer yourself
- One referrer per user (no duplicate referrals)
- Referral link expires after 7 days
- All actions are audited and logged

### 5. Commission Processing

#### Automatic Commission Creation

When a payment is successfully processed, use the utility function:

```typescript
import { createAffiliateCommission } from "@/lib/affiliate-commissions";

// In your payment processing code:
await createAffiliateCommission(
  paymentId,
  userId,
  paymentAmount,
  subscriptionId // optional
);
```

This will:

- Check if user has a referrer
- Calculate commission based on referrer's commission rate
- Create commission record in PENDING status
- Send notification to referrer

#### Commission Management Functions

```typescript
// Mark commission as paid
await markCommissionAsPaid(commissionId);

// Cancel commission (e.g., due to refund)
await cancelCommission(commissionId, "Reason for cancellation");

// Get user's commission stats
const stats = await getUserCommissionStats(userId);
```

### 6. Admin Features

Super admins (role 0) can:

- View all users and their commission rates
- Update individual user commission rates
- Search and filter users
- See referral statistics per user

Access via: `/api/admin/referrals/commission-rate`

## Setup Instructions

### 1. Run Database Migration

After setting up your database connection, run:

```bash
npx prisma migrate dev --name add_affiliate_program
npx prisma generate
```

### 2. Update Payment Processing

In your payment success handler (e.g., Stripe webhook), add:

```typescript
import { createAffiliateCommission } from "@/lib/affiliate-commissions";

// After successful payment
if (payment.status === "SUCCEEDED") {
  await createAffiliateCommission(
    payment.id,
    payment.userId,
    payment.amount,
    payment.subscriptionId
  );
}
```

### 3. Configure Navigation

The affiliate link has been added to the main navigation. Users will see:

- 💰 Affiliates link in the header when logged in
- Affiliate section on their profile page

## Default Configuration

- **Default Commission Rate**: 15%
- **Cookie Expiry**: 7 days
- **Commission Status**: PENDING (requires manual payout)
- **Currency**: USD

## Program Terms (Displayed to Users)

- You will receive XX% (default 15%) of each payment from users you refer
- Commissions are paid out on the following month after payment is received
- We have full discretion on determining any fraud or misuse of this program
- Commission rates may be adjusted at our discretion

## Notification System Integration

The affiliate system is integrated with the notification system:

- Users receive notifications when they earn new commissions
- Notifications sent when commissions are paid
- Notifications sent if commissions are cancelled
- New notification type: `AFFILIATE_EARNING`

## Future Enhancements (Recommended)

1. **Automated Payouts**: Integrate with payment processor for automatic commission payouts
2. **Tiered Commissions**: Different rates based on referral volume
3. **Lifetime Value Tracking**: Track total revenue per referral
4. **Performance Analytics**: Charts and graphs showing referral performance over time
5. **Marketing Materials**: Pre-made banners and promotional content for affiliates
6. **Referral Bonuses**: One-time bonuses for milestone achievements
7. **Email Campaigns**: Automated emails to help affiliates promote their links

## Testing

To test the affiliate system:

1. **Create a Referral Link**

   - Log in as User A
   - Go to `/profile/affiliates`
   - Copy your referral link

2. **Sign Up New User**

   - Open referral link in incognito/private window
   - Sign up as User B
   - Check that User B is linked to User A

3. **Test Commission**

   - Process a payment for User B
   - Check that commission is created for User A
   - Verify notification is sent to User A

4. **Admin Functions**
   - Log in as super admin (role 0)
   - Visit `/api/admin/referrals/commission-rate`
   - Update User A's commission rate
   - Verify changes are reflected

## Troubleshooting

### User Not Linked to Referrer

- Check if referral cookie was set correctly
- Verify ReferralTracker component is loaded
- Check browser console for errors
- Ensure `/api/referrals/link` endpoint is accessible

### Commission Not Created

- Verify payment status is "SUCCEEDED"
- Check that `createAffiliateCommission` is called in payment handler
- Ensure user has a referrer linked
- Check server logs for errors

### Admin Access Denied

- Verify user has role 0 (super admin)
- Check session authentication
- Ensure proper authorization headers

## Files Created/Modified

### New Files:

- `app/api/referrals/route.ts` - Main referral API endpoint
- `app/api/referrals/link/route.ts` - Referral linking endpoint
- `app/api/admin/referrals/commission-rate/route.ts` - Admin commission management
- `app/profile/affiliates/page.tsx` - Affiliates dashboard page
- `app/profile/affiliates/AffiliatesDashboard.tsx` - Dashboard client component
- `components/ReferralTracker.tsx` - Cookie-based referral tracker
- `lib/affiliate-commissions.ts` - Commission utility functions
- `docs/AFFILIATE_PROGRAM.md` - This documentation

### Modified Files:

- `prisma/schema.prisma` - Added affiliate fields and models
- `auth.ts` - Extended for referral tracking
- `app/auth/signin/page.tsx` - Added referral code handling
- `app/auth/signin/SignInForm.tsx` - Added referral cookie storage
- `app/layout.tsx` - Added ReferralTracker and navigation link
- `app/profile/page.tsx` - Added affiliate section display

## Support

For issues or questions about the affiliate program:

1. Check this documentation
2. Review the code comments in relevant files
3. Check server logs for errors
4. Test in development environment first

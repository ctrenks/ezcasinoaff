# Forum Notifications Setup Guide

## Overview

The forum system now includes a comprehensive email notification system that alerts users about:

- **Private Messages (PMs)**: Get notified when someone sends you a PM
- **Topic Replies**: Get notified when someone replies to a topic you're following

## Features Implemented

### ✅ 1. Topic Sticky/Pinning

- Topics are already sorted with pinned topics at the top (via `isPinned` field)
- Admins (role 5) can pin/unpin topics via the topic management API

### ✅ 2. Private Messaging UI

- **Compose PM Page**: `/forum/messages/compose`
- **Send PM Button**: Added to all forum posts (appears next to user's name)
- **PM Compose with Pre-filled Recipient**: `/forum/messages/compose?to=USER_ID`

### ✅ 3. Topic Following System

- **Auto-follow**: Users automatically follow topics they create or reply to
- **Email Notifications**: Followers receive emails when someone replies
- **Database Table**: `ez_forum_topic_followers` with unique unsubscribe tokens

### ✅ 4. Email Notifications (Nodemailer)

- **PM Notifications**: Beautiful HTML emails when receiving a private message
- **Reply Notifications**: HTML emails with reply preview and unsubscribe link
- **Separate from Auth**: Uses Nodemailer (not Resend) for forum notifications

### ✅ 5. Unsubscribe Functionality

- Each notification includes a unique unsubscribe link
- One-click unsubscribe via `/api/forum/unsubscribe/[token]`
- User-friendly HTML confirmation page

## Email Configuration

Add these environment variables to your `.env.local` file:

```env
# Site URL for email links (IMPORTANT: Must be the base URL without /api/auth)
NEXT_PUBLIC_SITE_URL=https://www.ezcasinoaff.com

# Forum Email Notifications (Nodemailer SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FORUM_FROM_EMAIL=noreply@ezcasinoaff.com
FORUM_FROM_NAME="EZ Casino Affiliates Forum"
```

**⚠️ IMPORTANT**: The `NEXT_PUBLIC_SITE_URL` should be your base site URL (e.g., `https://www.ezcasinoaff.com`) **without** any path like `/api/auth`. This is used to generate correct links in email notifications.

### SMTP Provider Examples

#### Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Generate from Google Account > Security > App Passwords
```

#### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

#### AWS SES

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ses-smtp-user
SMTP_PASS=your-ses-smtp-password
```

## Database Changes

New table added: `ez_forum_topic_followers`

```prisma
model ez_forum_topic_followers {
  id                 String   @id @default(cuid())
  topicId            String
  userId             String
  createdAt          DateTime @default(now())
  emailNotifications Boolean  @default(true)
  unsubscribeToken   String   @unique @default(cuid())

  topic              ez_forum_topics   @relation(...)
  user               User              @relation(...)

  @@unique([topicId, userId])
}
```

## New Files Created

### Backend

- `lib/nodemailer.ts` - Nodemailer transporter configuration
- `lib/forum-email.ts` - Email template functions (PM and reply notifications)
- `app/api/forum/users/route.ts` - API to fetch forum users for PM recipient selection
- `app/api/forum/unsubscribe/[token]/route.ts` - Unsubscribe handler

### Frontend

- `app/forum/messages/compose/page.tsx` - Compose PM page (server component)
- `app/forum/messages/compose/ComposeMessageForm.tsx` - Compose PM form (client component)

### Modified Files

- `app/api/forum/messages/route.ts` - Added PM email notifications
- `app/api/forum/topics/route.ts` - Added auto-follow on topic creation
- `app/api/forum/posts/route.ts` - Added auto-follow and reply notifications
- `app/forum/topic/[slug]/TopicView.tsx` - Added "Send PM" button to posts
- `prisma/schema.prisma` - Added `ez_forum_topic_followers` table

## How It Works

### When a User Creates a Topic

1. Topic is created in the database
2. User is automatically subscribed to the topic (`ez_forum_topic_followers`)
3. A unique `unsubscribeToken` is generated for this follower relationship

### When Someone Replies to a Topic

1. Reply (post) is created in the database
2. Replier is automatically subscribed to the topic (if not already)
3. All followers (except the replier) receive an email notification with:
   - Replier's name
   - Topic title and link
   - Reply preview
   - Unsubscribe link

### When Someone Sends a PM

1. PM is created with participants (sender + recipients)
2. All recipients receive an email notification with:
   - Sender's name
   - Message subject
   - Link to read the full message

### When Someone Unsubscribes

1. User clicks unsubscribe link in email
2. `ez_forum_topic_followers` record is deleted
3. User sees confirmation page with option to return to topic
4. User can re-subscribe by visiting the topic again

## Testing

### Test PM Notifications

1. Sign in as User A
2. Go to any forum topic
3. Click "📧 Send PM" button on any post
4. Send a message to User B
5. Check User B's email for notification

### Test Topic Reply Notifications

1. Sign in as User A and create a new topic
2. Sign in as User B and reply to that topic
3. Check User A's email for reply notification
4. Click "Unsubscribe" in the email
5. Sign in as User C and reply again
6. User A should NOT receive an email

## Admin Role

Only **role 5** is recognized as Super Admin:

- Can pin/unpin topics
- Can lock/unlock topics
- Can edit/delete any post
- Can manage forum categories

## Security Notes

- PM notifications only send to valid forum users (`siteId: "ez"`)
- Unsubscribe tokens are unique and can only be used once
- Email sending is asynchronous and won't fail the request if SMTP is down
- SMTP credentials should be kept secure in environment variables

## Future Enhancements

Potential additions (not yet implemented):

- [ ] Manual follow/unfollow buttons in topic UI
- [ ] Notification preferences in user profile
- [ ] Digest emails (daily/weekly summaries)
- [ ] In-app notifications (bell icon with unread count)
- [ ] Push notifications (browser/mobile)
- [ ] Email verification before sending notifications
- [ ] Rate limiting for email notifications

# Notification System Documentation

## Overview

The notification system provides in-app notifications to users about important events and updates. Users see a bell icon in the navigation bar with an unread count badge, and can view/manage all notifications from a dedicated page.

## Features

### ✅ Implemented Features

1. **Notification Bell Component**

   - Real-time bell icon in navigation with unread count badge
   - Dropdown showing recent notifications (last 10)
   - Auto-refresh every 30 seconds
   - Click notification to navigate to related content
   - Mark individual notifications as read
   - Mark all as read button

2. **Full Notifications Page** (`/notifications`)

   - View all notifications (paginated up to 100)
   - Filter by "All" or "Unread only"
   - Mark notifications as read
   - Delete notifications
   - Click to navigate to related content

3. **Notification Types**

   - **PRIVATE_MESSAGE**: New PM received
   - **TOPIC_REPLY**: Reply in followed forum topic
   - **NEW_CASINO**: New casino added to database
   - **NEW_GAME**: New games added to database
   - **SYSTEM**: System announcements and admin broadcasts
   - **SUBSCRIPTION**: Subscription-related updates (future)

4. **Automatic Notifications**

   - **PMs**: Created automatically when a private message is sent
   - **Topic Replies**: Created automatically when someone replies to a topic you follow
   - Both include email notifications AND in-app notifications

5. **Admin Tools**
   - Broadcast custom notifications to all users
   - Notify users about new casinos
   - Notify users about new games
   - Send targeted notifications to specific users

## Database Schema

```prisma
enum NotificationType {
  PRIVATE_MESSAGE
  TOPIC_REPLY
  NEW_CASINO
  NEW_GAME
  SYSTEM
  SUBSCRIPTION
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  link      String?
  icon      String?
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())
  metadata  Json?

  user      User             @relation(...)

  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
  @@index([userId, isRead])
}
```

## API Endpoints

### User Endpoints

#### `GET /api/notifications`

Fetch user's notifications (paginated)

**Query Parameters:**

- `limit` (optional): Number of notifications to fetch (default: 20)
- `offset` (optional): Pagination offset (default: 0)
- `unreadOnly` (optional): If "true", only return unread notifications

**Response:**

```json
{
  "notifications": [...],
  "unreadCount": 5,
  "totalCount": 23,
  "hasMore": true
}
```

#### `PATCH /api/notifications/[id]`

Mark a notification as read

**Response:**

```json
{
  "id": "...",
  "isRead": true,
  ...
}
```

#### `DELETE /api/notifications/[id]`

Delete a notification

**Response:**

```json
{
  "success": true
}
```

#### `POST /api/notifications/mark-all-read`

Mark all notifications as read for the current user

**Response:**

```json
{
  "success": true,
  "count": 5
}
```

### Admin Endpoints (Role 5 Only)

#### `POST /api/admin/notifications/casino`

Notify all users about a new casino

**Body:**

```json
{
  "casinoName": "Casino Royal",
  "casinoId": "xyz123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Notifications sent to all users about Casino Royal",
  "result": { "count": 150 }
}
```

#### `POST /api/admin/notifications/games`

Notify all users about new games

**Body:**

```json
{
  "gameCount": 50,
  "provider": "NetEnt" // optional
}
```

**Response:**

```json
{
  "success": true,
  "message": "Notifications sent to all users about 50 new games from NetEnt",
  "result": { "count": 150 }
}
```

#### `POST /api/admin/notifications/broadcast`

Broadcast a custom notification

**Body:**

```json
{
  "title": "System Maintenance",
  "message": "The site will be down for maintenance on Saturday",
  "link": "/announcements",
  "icon": "🔧",
  "type": "SYSTEM",
  "targetAllUsers": true
}
```

Or target specific users:

```json
{
  "title": "Personal Message",
  "message": "You've been selected for beta testing",
  "link": "/beta",
  "icon": "✨",
  "type": "SYSTEM",
  "userIds": ["user1", "user2", "user3"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Notification sent to 150 user(s)",
  "count": 150,
  "result": { "count": 150 }
}
```

## Helper Functions

Located in `lib/notifications.ts`:

### `createNotification(params)`

Create a single notification for a user

```typescript
await createNotification({
  userId: "user123",
  type: "SYSTEM",
  title: "Welcome!",
  message: "Welcome to EZ Casino Affiliates",
  link: "/getting-started",
  icon: "👋",
  metadata: { source: "onboarding" },
});
```

### `createBulkNotifications(userIds, params)`

Create the same notification for multiple users

```typescript
await createBulkNotifications(["user1", "user2", "user3"], {
  type: "NEW_CASINO",
  title: "New Casino Added",
  message: "Bet365 has been added",
  link: "/casinos/bet365",
  icon: "🎰",
});
```

### `createPMNotification(recipientId, senderName, messageId, subject)`

Create a PM notification (called automatically when PMs are sent)

```typescript
await createPMNotification(
  "recipient123",
  "John Doe",
  "msg456",
  "Meeting tomorrow"
);
```

### `createTopicReplyNotification(userId, replierName, topicTitle, topicSlug)`

Create a topic reply notification (called automatically when replies are posted)

```typescript
await createTopicReplyNotification(
  "user123",
  "Jane Smith",
  "Best Casino Bonuses 2025",
  "best-casino-bonuses-2025"
);
```

### `notifyNewCasino(casinoName, casinoId)`

Notify all users about a new casino

```typescript
await notifyNewCasino("Casino Royal", "xyz123");
```

### `notifyNewGames(gameCount, provider?)`

Notify all users about new games

```typescript
await notifyNewGames(50, "NetEnt");
// or
await notifyNewGames(100); // No provider specified
```

## UI Components

### `NotificationBell`

Client component that displays the bell icon with unread count and dropdown

**Location:** `components/NotificationBell.tsx`

**Features:**

- Shows unread count badge
- Dropdown with last 10 notifications
- Auto-refresh every 30 seconds
- Mark as read functionality
- Navigate to notification link

**Usage:**

```tsx
import NotificationBell from "@/components/NotificationBell";

<NotificationBell />;
```

### `NotificationsPageClient`

Client component for the full notifications page

**Location:** `app/notifications/NotificationsPageClient.tsx`

**Features:**

- Filter by all/unread
- View up to 100 notifications
- Mark as read
- Delete notifications
- Navigate to links

## Integration Points

### 1. Private Messages

**File:** `app/api/forum/messages/route.ts`

When a PM is sent:

1. Email notification is sent via Nodemailer
2. In-app notification is created via `createPMNotification()`

### 2. Topic Replies

**File:** `app/api/forum/posts/route.ts`

When a reply is posted:

1. Email notification is sent to followers via Nodemailer
2. In-app notification is created for each follower via `createTopicReplyNotification()`

### 3. Layout/Navigation

**Files:**

- `app/layout.tsx` (desktop bell icon)
- `components/Navigation.tsx` (mobile notifications link)

The notification bell appears in:

- **Desktop:** In the top navigation bar (Row 2)
- **Mobile:** Link to `/notifications` in the hamburger menu

## Admin Usage Examples

### Example 1: Notify About New Casino

```bash
curl -X POST https://www.ezcasinoaff.com/api/admin/notifications/casino \
  -H "Content-Type: application/json" \
  -H "Cookie: ..." \
  -d '{
    "casinoName": "Betway Casino",
    "casinoId": "betway123"
  }'
```

### Example 2: Notify About New Games

```bash
curl -X POST https://www.ezcasinoaff.com/api/admin/notifications/games \
  -H "Content-Type: application/json" \
  -H "Cookie: ..." \
  -d '{
    "gameCount": 25,
    "provider": "Pragmatic Play"
  }'
```

### Example 3: Broadcast System Announcement

```bash
curl -X POST https://www.ezcasinoaff.com/api/admin/notifications/broadcast \
  -H "Content-Type: application/json" \
  -H "Cookie: ..." \
  -d '{
    "title": "New Feature Released",
    "message": "Check out our new AI content generator!",
    "link": "/features/ai-generator",
    "icon": "🚀",
    "type": "SYSTEM",
    "targetAllUsers": true
  }'
```

## Testing

### Test Notification Bell

1. Sign in as a user
2. Have another user send you a PM
3. See the bell icon show unread count
4. Click bell to see notification in dropdown
5. Click notification to navigate to the PM

### Test Notifications Page

1. Navigate to `/notifications`
2. View all your notifications
3. Filter by "Unread"
4. Mark notifications as read
5. Delete a notification

### Test Admin Notifications

1. Sign in as admin (role 5)
2. Use curl or Postman to send POST requests to admin endpoints
3. Check that all users receive the notification
4. Verify notification appears in bell dropdown and notifications page

## Future Enhancements

Potential additions (not yet implemented):

- [ ] Push notifications (browser/mobile)
- [ ] Email digest of notifications (daily/weekly)
- [ ] User preferences for notification types
- [ ] Notification sound effects
- [ ] Real-time notifications via WebSockets
- [ ] Notification grouping (e.g., "3 new forum replies")
- [ ] Rich notifications with images
- [ ] Action buttons in notifications (e.g., "Approve", "Decline")
- [ ] Notification scheduling (send at specific time)
- [ ] Notification templates

## Security Notes

- All notification endpoints require authentication
- Admin endpoints (broadcast, casino, games) require role 5
- Users can only view/modify their own notifications
- Notifications are auto-created server-side (users can't create their own)
- XSS protection: notification content is sanitized in UI

## Performance Considerations

- Notifications are indexed on `userId`, `isRead`, and `createdAt`
- Composite index on `[userId, isRead]` for efficient unread queries
- Bell component polls every 30 seconds (configurable)
- Notifications page fetches max 100 notifications
- Bulk notification creation uses `createMany` for efficiency
- Consider archiving/deleting old read notifications (future)

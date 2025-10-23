# Forum System Documentation

## Overview

A comprehensive forum system has been built for EZ Casino Affiliates with support for categories, topics, posts, private messaging, image uploads, and embedded content. The system shares the database with the sister site (AllMediaMatter) using table prefixes (`ez_` for this site, `amm_` for the other).

## Database Schema

### User Site Identifier

- Added `siteId` field to `User` model (default: "ez")
- Automatically assigned during user registration via `auth.ts`
- Allows differentiation between users from different sites

### Forum Tables (with `ez_` prefix)

1. **ez_forum_categories**

   - Forum category management
   - Fields: name, slug, description, icon, displayOrder, isActive
   - Admins can create, edit, delete, and reorder categories

2. **ez_forum_topics**

   - Discussion topics within categories
   - Fields: title, slug, isPinned, isLocked, viewCount, replyCount
   - Tracks last reply information

3. **ez_forum_posts**

   - Individual posts/replies in topics
   - Fields: content, isEdited, isDeleted (soft delete)
   - Supports HTML content and embeds

4. **ez_forum_attachments**

   - Image uploads stored in Vercel Blob
   - Linked to posts
   - Stores: url, filename, mimeType, size, dimensions

5. **ez_forum_private_messages**

   - Private messaging between users
   - Fields: senderId, subject, content

6. **ez_forum_message_participants**
   - Tracks message recipients and read status
   - Per-user soft delete support

## Features Implemented

### Public Features

- Browse forum categories and topics (no login required)
- View topic discussions and posts
- Search and filter topics

### Registered User Features

- Create new topics
- Reply to existing topics
- Edit own posts
- Delete own posts (soft delete)
- Upload images to posts (Vercel Blob storage)
- Embed YouTube videos and X/Twitter posts
- Send/receive private messages
- Message inbox with unread count
- Profile-based messaging

### Admin Features (role 1 or 0)

- Create, edit, delete forum categories
- Activate/deactivate categories
- Reorder categories
- Pin/unpin topics
- Lock/unlock topics
- Edit any post
- Hard delete posts
- Full moderation capabilities

## API Endpoints

### Public Endpoints

- `GET /api/forum/categories` - List active categories
- `GET /api/forum/topics` - List topics (with category filter)
- `GET /api/forum/topics/[slug]` - View topic with posts

### Authenticated Endpoints

- `POST /api/forum/topics` - Create new topic
- `PATCH /api/forum/topics/[slug]` - Update topic
- `DELETE /api/forum/topics/[slug]` - Delete topic
- `POST /api/forum/posts` - Create reply
- `PATCH /api/forum/posts/[id]` - Edit post
- `DELETE /api/forum/posts/[id]` - Delete post
- `POST /api/forum/posts/[id]/upload` - Upload image
- `GET /api/forum/messages` - List messages
- `POST /api/forum/messages` - Send message
- `GET /api/forum/messages/[id]` - View message
- `PATCH /api/forum/messages/[id]` - Mark read/unread
- `DELETE /api/forum/messages/[id]` - Delete message

### Admin Endpoints

- `GET /api/forum/admin/categories` - List all categories
- `POST /api/forum/admin/categories` - Create category
- `GET /api/forum/admin/categories/[id]` - Get category
- `PATCH /api/forum/admin/categories/[id]` - Update category
- `DELETE /api/forum/admin/categories/[id]` - Delete category

## UI Pages

### Public Pages

- `/forum` - Forum homepage with category list
- `/forum/category/[slug]` - Topics within a category
- `/forum/topic/[slug]` - Topic view with posts and replies

### Authenticated Pages

- `/forum/new-topic` - Create new topic form
- `/forum/messages` - Private messages inbox

### Admin Pages

- `/forum/admin` - Forum administration dashboard
  - Category management
  - Bulk operations

## Technical Features

### Image Upload System

- Integrates with Vercel Blob storage
- Max file size: 10MB
- Allowed types: JPEG, PNG, GIF, WebP
- Automatic dimension detection
- Organized in `forum/` folder with unique filenames

### Content Embeds

- **YouTube**: Automatically converts YouTube URLs to embedded players
- **X/Twitter**: Converts tweet URLs to Twitter embeds
- Supports multiple URL formats
- Embedded content is sanitized for security

### Utilities

- `lib/blob-upload.ts` - Image upload to Vercel Blob
- `lib/forum-utils.ts` - Slug generation, embed processing, time formatting
- `lib/utils.ts` - nanoid() for random ID generation

### Security Features

- Role-based access control
- Ownership verification for edits/deletes
- Input sanitization
- Soft delete for user actions
- Hard delete only for admins

## Mobile-Friendly

- Responsive design
- Hamburger navigation on mobile
- Touch-friendly UI elements
- Optimized for all screen sizes

## Navigation

- Added "Forum" link to main navigation (desktop and mobile)
- Accessible from all pages
- Message notifications (for future enhancement)

## User Experience Features

- Real-time view counts
- Reply counts and last activity timestamps
- User avatars throughout
- Admin badges
- Pinned topic indicators
- Locked topic indicators
- Unread message badges
- Relative time display ("2 hours ago")

## Future Enhancement Opportunities

1. Rich text editor (WYSIWYG) for post creation
2. File attachments (not just images)
3. Topic subscriptions and notifications
4. User reputation/karma system
5. Post reactions (like, upvote, etc.)
6. Advanced search functionality
7. Topic tags/labels
8. User mention system (@username)
9. Quote functionality
10. Pagination for large discussions
11. Real-time updates (WebSocket)
12. Spam detection/prevention
13. Report post functionality
14. Moderator tools panel

## Configuration Notes

- Uses existing NextAuth configuration
- Leverages existing Prisma setup
- Requires `NEXTAUTH_URL` environment variable for server-side fetching
- Image uploads require Vercel Blob token

## Testing Checklist

- [ ] Create forum categories as admin
- [ ] Create topics as registered user
- [ ] Reply to topics
- [ ] Upload images to posts
- [ ] Embed YouTube videos
- [ ] Embed X/Twitter posts
- [ ] Send private messages
- [ ] Pin/lock topics as admin
- [ ] Edit/delete posts
- [ ] Soft delete vs hard delete
- [ ] Mobile navigation
- [ ] View counts increment
- [ ] Unread message badges

## Shared Database Notes

The forum tables use the `ez_` prefix to distinguish them from potential `amm_` prefixed tables for the sister site (AllMediaMatter). The `User.siteId` field ensures users from different sites remain separated, even though they share the same database.

When implementing the forum on the sister site:

1. Update table names from `ez_forum_*` to `amm_forum_*` in Prisma schema
2. Set `siteId` to "amm" for new users on that site
3. Filter queries by `siteId` to show only relevant users
4. Consider cross-site user authentication if users should access both sites

---

**Built:** October 2025
**Database:** PostgreSQL (Neon)
**Storage:** Vercel Blob
**Framework:** Next.js 14, React 18, Prisma ORM

# Multi-Site Access and Forum Behavior

## Overview

Users can have access to one or both sites through boolean flags:

- `user.ezcasino` = Access to EZ Casino Affiliates (excasinoaff.com)
- `user.allmedia` = Access to All Media Matter (allmediamatter.com)

**Key Benefits**:

- ✅ Users can have access to **both sites simultaneously**
- ✅ Flags are **permanent** (don't change on login)
- ✅ Easy to check: `if (user.ezcasino)` or `if (user.allmedia)`
- ✅ Users can participate in both forums independently

## How Multi-Site Access Works

### User Registration & Login

1. User logs into `excasinoaff.com` → `user.ezcasino` set to `true`
2. Same user later logs into `allmediamatter.com` → `user.allmedia` set to `true`
3. User now has access to **both sites** with the same account

### Forum Access

Forum posts remain visible because:

1. **Forum posts are tied to user ID** (not a changing siteId)
2. **Forum access is determined by which site they're on**, not by a user field
3. **The forum tables themselves** (with prefixes) determine which forum the content belongs to

### The Solution

#### 1. Forum Tables are Site-Specific

Forum tables use prefixes to separate content by site:

- `ez_forum_*` tables = EZ Casino Affiliates forum
- `amm_forum_*` tables = All Media Matter forum (future)

The **table prefix**, not the user's `siteId`, determines which forum the content belongs to.

#### 2. Users Can Access Any Forum

Users are **NOT filtered** by their `siteId` when accessing forums. Instead:

- Access is determined by which domain/URL they visit
- `excasinoaff.com/forum` → uses `ez_forum_*` tables
- `allmediamatter.com/forum` → uses `amm_forum_*` tables (future)

#### 3. Forum Posts Are Always Visible

When displaying forum content:

- ✅ Posts are queried from `ez_forum_posts` (or `amm_forum_posts`)
- ✅ Authors are linked via `authorId` (User.id)
- ❌ **Never filter by user's current `siteId`**

### Code Changes Made

#### 1. User List API (`app/api/forum/users/route.ts`)

**Before** (❌ Wrong):

```typescript
const users = await prisma.user.findMany({
  where: {
    siteId: "ez", // ❌ This breaks when user switches sites
  },
});
```

**After** (✅ Correct):

```typescript
const users = await prisma.user.findMany({
  where: {
    NOT: {
      id: session.user.id,
    },
  },
  // No siteId filter - all users can receive PMs
});
```

#### 2. Forum Queries

All forum queries use the table name (with prefix) to determine which forum:

```typescript
// This automatically queries the EZ forum only
const topics = await prisma.ez_forum_topics.findMany({
  // No siteId filter needed
});
```

## User Scenarios

### Scenario 1: User Creates Forum Post on EZ Site

1. User logs into `excasinoaff.com` → `siteId` set to "ez"
2. User creates forum post → stored in `ez_forum_posts` with `authorId`
3. **Post is visible because it's in the `ez_forum_posts` table** ✅

### Scenario 2: User Switches to AMM Site

1. Same user logs into `allmediamatter.com` → `siteId` changed to "amm"
2. User returns to `excasinoaff.com/forum`
3. **Their old posts are STILL visible** because:
   - Posts are in `ez_forum_posts` (table determines site)
   - Author lookup uses `authorId` (not filtered by siteId) ✅

### Scenario 3: User Sends Private Message

1. User A (siteId: "ez") sends PM to User B (siteId: "amm")
2. **PM works correctly** because:
   - Messages stored in `ez_forum_private_messages`
   - Recipients can have any `siteId`
   - Email notification sent regardless of `siteId` ✅

## Database Schema Notes

### User Model

```prisma
model User {
  // Site access flags - users can have access to both sites
  ezcasino Boolean @default(true)  // Access to EZ Casino Affiliates
  allmedia Boolean @default(false) // Access to All Media Matter

  // Forum relations - work across both sites
  forumTopics        ez_forum_topics[]
  forumPosts         ez_forum_posts[]
  sentMessages       ez_forum_private_messages[]
  messageParticipants ez_forum_message_participants[]
  topicFollowers     ez_forum_topic_followers[]
}
```

### Forum Tables (EZ Site)

```prisma
model ez_forum_topics {
  // No siteId field - table prefix determines site
  authorId String
  author   User @relation(...)
}

model ez_forum_posts {
  // No siteId field - table prefix determines site
  authorId String
  author   User @relation(...)
}
```

## Best Practices

### ✅ DO:

- Use table prefixes (`ez_`, `amm_`) to separate forum content
- Query users without filtering by `ezcasino`/`allmedia` flags for forum/messaging
- Determine forum access by domain/URL (which site they're visiting)
- Keep forum relations on User model (they work across sites)
- Set `user.ezcasino = true` when they log into excasinoaff.com
- Set `user.allmedia = true` when they log into allmediamatter.com

### ❌ DON'T:

- Filter forum queries by user's `ezcasino` or `allmedia` flags
- Use these flags to determine which forum a user can access
- Restrict PMs or messages based on recipient's site flags
- Remove access flags (they're permanent once granted)

## Future: Multiple Forum Support

If we add AMM forums:

1. Create `amm_forum_*` tables (separate from `ez_forum_*`)
2. Use domain routing to determine which tables to query
3. Users can participate in both forums with the same account
4. Their `siteId` just tracks which site they last logged into

## Summary

**Key Principle**: The user's `ezcasino` and `allmedia` flags are **permanent access grants**, not **content filters**. Forum content is separated by **table prefix**, not by user flags.

This ensures:

- ✅ Users can have access to **both sites** with one account
- ✅ Forum posts remain visible regardless of which sites they have access to
- ✅ Private messages work across users on different sites
- ✅ Email notifications work correctly
- ✅ One account can participate in multiple forums
- ✅ Access flags are permanent and don't change on login
- ✅ Users can be granted access to new sites without losing existing access

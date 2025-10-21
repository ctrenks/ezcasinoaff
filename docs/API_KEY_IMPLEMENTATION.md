# API Key Implementation

## What's Implemented ✅

### 1. **Automatic API Key Generation**

When a new user registers via the site:

- ✅ **Role 2** is automatically assigned (Webmaster role)
- ✅ **Demo API Key** is automatically generated
- ✅ Key format: `demo_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (32 random characters)

### 2. **API Key Utilities** (`lib/api-key.ts`)

```typescript
generateDemoApiKey(); // Generates demo_xxxx keys
generateLiveApiKey(); // Generates live_xxxx keys (for future use)
isValidApiKey(key); // Validates key format
```

### 3. **User Authentication Flow** (`auth.ts`)

The sign-in callback now:

- Checks if user has a role, assigns role 2 if not
- Checks if user has an API key, generates demo key if not
- Only updates database if changes are needed (efficient)

### 4. **Profile Page Display** (`app/profile/ProfileForm.tsx`)

Users can now:

- ✅ View their demo API key
- ✅ Copy it to clipboard with one click
- ✅ See their demo access limits clearly displayed
- ✅ See a "Coming Soon" notice for site management

## Demo API Key Features

### Current Access Limits:

- Up to 50 approved casino brands
- Up to 200 games with playable demos
- All active payment methods and software providers
- Geographic restriction data
- Jurisdiction and licensing information

### Key Format:

```
demo_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- Prefix: `demo_`
- Random: 32 characters (base64url encoded)
- Cryptographically secure random generation

## Future Features 🚀

### Site Management (To Be Implemented)

#### 1. **Add Site Feature**

Users will be able to:

- Add multiple website domains
- Associate each site with their API key
- Set different subscription levels per site
- Track API usage per site

#### 2. **Database Schema** (Proposed)

```prisma
model Site {
  id          String   @id @default(cuid())
  userId      String
  domain      String
  apiKey      String   // Can be same or different from user's demo key
  subscriptionLevel String @default("demo") // demo, basic, pro, enterprise
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id])

  @@unique([userId, domain])
  @@index([userId])
  @@index([apiKey])
}
```

#### 3. **Subscription Levels**

| Level      | Casinos   | Games     | Rate Limit | Price  |
| ---------- | --------- | --------- | ---------- | ------ |
| Demo       | 50        | 200       | 100/hour   | Free   |
| Basic      | 200       | 500       | 500/hour   | $29/mo |
| Pro        | Unlimited | Unlimited | 2000/hour  | $99/mo |
| Enterprise | Unlimited | Unlimited | Unlimited  | Custom |

#### 4. **API Key Validation**

When API requests come in:

- Check if API key is valid
- Check if requesting domain is authorized
- Check subscription limits
- Track usage

#### 5. **UI Pages Needed**

- `/profile/sites` - Manage sites
- `/profile/sites/add` - Add new site
- `/profile/subscription` - Upgrade subscription
- `/profile/api-usage` - View API usage stats

## API Endpoints to Protect

Once site management is implemented, these endpoints should validate API keys:

- `/api/casinos` - Public currently (needs API key check later)
- `/api/affiliates` - Public currently (needs API key check later)
- `/api/stats` - Public currently (needs API key check later)
- `/api/games` - To be created
- `/api/bonuses` - To be created

## Implementation Steps

### Phase 1: Current (Completed) ✅

- [x] Generate demo API key on registration
- [x] Display API key in profile
- [x] Set role 2 for webmasters

### Phase 2: Site Management (Next)

- [ ] Create Site model in Prisma schema
- [ ] Create `/profile/sites` page
- [ ] Create "Add Site" form
- [ ] Create site management API endpoints
- [ ] Add domain validation

### Phase 3: API Key Enforcement

- [ ] Create API key middleware
- [ ] Add API key validation to endpoints
- [ ] Track API usage
- [ ] Implement rate limiting

### Phase 4: Subscriptions

- [ ] Create subscription plans
- [ ] Integrate payment provider (Stripe?)
- [ ] Create upgrade flow
- [ ] Generate live API keys for paid users
- [ ] Implement usage-based limits

## Notes

- Demo keys start with `demo_` prefix
- Live keys will start with `live_` prefix
- API keys are unique per user (enforced in schema)
- Keys are displayed but can be regenerated if compromised
- Site domain validation will prevent API key sharing

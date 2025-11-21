# API Usage Tracking System

## 📊 Database Table: `ApiUsage`

When your WordPress plugin (or other sites) calls your API, you need to track usage in this table.

### Schema Definition

```prisma
model ApiUsage {
  id              String    @id @default(cuid())
  siteId          String    // Which site made the request

  // Request details
  endpoint        String    // e.g., "/api/casinos", "/api/stats"
  method          String    // GET, POST, etc.
  statusCode      Int       // 200, 404, 500, etc.

  // Usage tracking
  requestCount    Int       @default(1)
  responseTime    Int?      // milliseconds

  // Rate limiting
  hour            DateTime  // Hourly bucket for rate limiting

  // Metadata
  ipAddress       String?
  userAgent       String?
  createdAt       DateTime  @default(now())

  // Relations
  site            Site      @relation(fields: [siteId], references: [id], onDelete: Cascade)
}
```

## 🔑 How to Track API Usage

### When an API Call Comes In:

1. **Authenticate** - Get the API key from the request
2. **Find the Site** - Look up which site owns that API key
3. **Process Request** - Handle the API call
4. **Record Usage** - Log to `ApiUsage` table

### Example Code Pattern:

```typescript
// In your API route that handles external requests
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  let siteId: string | null = null;
  let statusCode = 200;

  try {
    // 1. Get API key from headers
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      statusCode = 401;
      return NextResponse.json({ error: "API key required" }, { status: 401 });
    }

    // 2. Find the site by API key
    const site = await prisma.site.findUnique({
      where: { apiKey },
      select: {
        id: true,
        isActive: true,
        status: true,
      },
    });

    if (!site || !site.isActive) {
      statusCode = 403;
      return NextResponse.json(
        { error: "Invalid or inactive API key" },
        { status: 403 }
      );
    }

    siteId = site.id;

    // 3. Process your API request here
    const data = await yourApiLogic();

    statusCode = 200;
    return NextResponse.json(data);
  } catch (error) {
    statusCode = 500;
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    // 4. Record API usage (always, even on errors)
    if (siteId) {
      const responseTime = Date.now() - startTime;
      const hour = new Date();
      hour.setMinutes(0, 0, 0); // Round to hour for rate limiting

      await prisma.apiUsage
        .create({
          data: {
            siteId,
            endpoint: req.nextUrl.pathname,
            method: req.method || "GET",
            statusCode,
            requestCount: 1,
            responseTime,
            hour,
            ipAddress: req.ip || req.headers.get("x-forwarded-for") || null,
            userAgent: req.headers.get("user-agent") || null,
          },
        })
        .catch((err) => {
          // Don't fail the request if logging fails
          console.error("Failed to log API usage:", err);
        });
    }
  }
}
```

## 🎯 What Gets Tracked:

| Field          | Example Value         | Purpose                            |
| -------------- | --------------------- | ---------------------------------- |
| `siteId`       | `cm123abc...`         | Which site made the call           |
| `endpoint`     | `/api/casinos`        | Which API endpoint                 |
| `method`       | `GET`                 | HTTP method                        |
| `statusCode`   | `200`                 | Response status                    |
| `requestCount` | `1`                   | Number of requests (can aggregate) |
| `responseTime` | `150`                 | Milliseconds                       |
| `hour`         | `2025-11-05 14:00:00` | Hourly bucket                      |
| `ipAddress`    | `192.168.1.1`         | Client IP                          |
| `userAgent`    | `WordPress/6.0`       | Client info                        |

## 📈 Viewing Usage Stats

Users can see their API usage in their dashboard at `/profile/sites/[id]`:

```typescript
// Get API usage for a site
const usage = await prisma.apiUsage.findMany({
  where: { siteId: site.id },
  orderBy: { createdAt: "desc" },
  take: 100,
});

// Aggregate by endpoint
const byEndpoint = await prisma.apiUsage.groupBy({
  by: ["endpoint"],
  where: { siteId: site.id },
  _sum: { requestCount: true },
  _avg: { responseTime: true },
});
```

## ⚡ Rate Limiting

The `hour` field allows you to implement rate limiting:

```typescript
// Check if site exceeded hourly rate limit
const currentHour = new Date();
currentHour.setMinutes(0, 0, 0);

const hourlyUsage = await prisma.apiUsage.aggregate({
  where: {
    siteId: site.id,
    hour: currentHour,
  },
  _sum: {
    requestCount: true,
  },
});

const requestsThisHour = hourlyUsage._sum.requestCount || 0;
const rateLimit = 1000; // requests per hour

if (requestsThisHour >= rateLimit) {
  return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
}
```

## 🔧 Implementation Checklist

For each public API endpoint that WordPress sites call:

- [ ] Extract API key from request headers
- [ ] Validate API key and get `siteId`
- [ ] Check if site is active
- [ ] Process the request
- [ ] Record usage in `ApiUsage` table (in finally block)
- [ ] Include response time
- [ ] Track endpoint, method, status code

## 📝 Example: `/api/stats` Endpoint

Currently, `/api/stats` is public. If you want to track it:

```typescript
// app/api/stats/route.ts
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  let siteId: string | null = null;
  let statusCode = 200;

  try {
    // Optional: Require API key for stats
    const apiKey = req.headers.get("x-api-key");

    if (apiKey) {
      const site = await prisma.site.findUnique({
        where: { apiKey },
        select: { id: true, isActive: true },
      });

      if (site?.isActive) {
        siteId = site.id;
      }
    }

    // Your existing stats logic...
    const stats = await getStats();

    return NextResponse.json(stats);
  } finally {
    if (siteId) {
      // Log the usage
      await logApiUsage({
        siteId,
        endpoint: "/api/stats",
        method: "GET",
        statusCode,
        responseTime: Date.now() - startTime,
        req,
      });
    }
  }
}
```

## 🌐 WordPress Plugin Integration

Your WordPress plugin should:

1. **Store API Key** in WordPress options
2. **Send API Key** in every request header:
   ```php
   $headers = [
       'X-API-Key' => get_option('ezcasino_api_key'),
       'Content-Type' => 'application/json'
   ];
   ```
3. **Handle Errors** - Check for 401, 403, 429 responses

## 📊 Admin Dashboard

Show API usage statistics in admin:

```typescript
// Get total API calls by site
const topSites = await prisma.apiUsage.groupBy({
  by: ["siteId"],
  _sum: { requestCount: true },
  orderBy: { _sum: { requestCount: "desc" } },
  take: 10,
});

// Get most used endpoints
const topEndpoints = await prisma.apiUsage.groupBy({
  by: ["endpoint"],
  _sum: { requestCount: true },
  orderBy: { _sum: { requestCount: "desc" } },
});
```

## 🎯 Current Status

**Status**: Schema exists, but tracking may not be implemented in all routes.

**Action Items**:

1. Add API usage tracking to all public API routes
2. Require API key authentication for external calls
3. Create helper function to simplify logging
4. Add rate limiting logic
5. Build admin dashboard for API analytics
6. Show usage stats to users in their site dashboard

## 💡 Helper Function (Recommended)

Create a reusable helper:

```typescript
// lib/api-tracking.ts
export async function logApiUsage({
  siteId,
  endpoint,
  method,
  statusCode,
  responseTime,
  req,
}: {
  siteId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  req: NextRequest;
}) {
  const hour = new Date();
  hour.setMinutes(0, 0, 0);

  await prisma.apiUsage
    .create({
      data: {
        siteId,
        endpoint,
        method,
        statusCode,
        requestCount: 1,
        responseTime,
        hour,
        ipAddress: req.ip || req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    })
    .catch((err) => {
      console.error("Failed to log API usage:", err);
    });
}
```

Then use it everywhere:

```typescript
import { logApiUsage } from "@/lib/api-tracking";

// In your API route
await logApiUsage({
  siteId,
  endpoint: req.nextUrl.pathname,
  method: req.method || "GET",
  statusCode: 200,
  responseTime: Date.now() - startTime,
  req,
});
```

---

**Summary**: The `ApiUsage` table is defined in your schema. You need to add tracking code to your API routes that external sites (WordPress plugins) will call. Track every request with site ID, endpoint, status, and timing for analytics and rate limiting.


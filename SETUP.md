# ExCasinoAff Setup Instructions

This is the webmaster portal deployment that shares the database with allmediamatter.

## Quick Setup

### 1. Environment Variables

Copy the environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add:

```env
# IMPORTANT: Use the SAME database URL as allmediamatter
DATABASE_URL="postgresql://user:password@localhost:5432/your_database"

# NextAuth (generate a new secret: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-unique-secret-key-here"

# OAuth providers (optional, can use same as allmediamatter)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# Blob Storage (optional, can use same as allmediamatter)
BLOB_READ_WRITE_TOKEN="your-blob-token"

# Radium API (use same as allmediamatter)
RADIUM_API_URL="https://api.radiumpowered.com"
RADIUM_API_KEY="your-radium-api-key"
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Generate Prisma Client

```bash
pnpm prisma generate
```

### 4. Run Development Server

```bash
pnpm dev
```

The server will run on **http://localhost:3001**

## Database

⚠️ **IMPORTANT**: This application uses the **SAME** database as allmediamatter:

- Same `User` table
- Same casino/game data
- Same Radium sync data

**Do NOT** run `prisma db push` or migrations on this project if they're already applied to the shared database.

## Deployment

### Vercel Deployment

1. Create a **NEW** Vercel project
2. Point it to the `excasinoaff` directory
3. Add all environment variables from `.env.local`
4. Deploy
5. In Vercel Dashboard → Domains, add:
   - `excasinoaff.com`
   - `www.excasinoaff.com`

### Environment Variables for Production

Make sure to set in Vercel:

- `DATABASE_URL` - Same as allmediamatter
- `NEXTAUTH_URL` - https://excasinoaff.com
- `NEXTAUTH_SECRET` - Generate a new one
- All OAuth credentials
- `RADIUM_API_KEY`

## Architecture

```
C:\Users\Chris\Documents\GitHub\afcmedia\
├── afc-media/          # Operator portal (allmediamatter.com)
│   └── Database: PostgreSQL
│
└── excasinoaff/        # Webmaster portal (excasinoaff.com)
    └── Database: Same PostgreSQL ↑
```

Both applications:
✅ Share the same database
✅ Share the same user authentication
✅ Use the same Prisma schema
✅ Access the same casino/game data

## User Roles

- **Role 1**: Operator access (allmediamatter.com only)
- **Role 2**: Webmaster access (excasinoaff.com only)

Users are filtered by role in each application.

## Development

### Running Both Apps Locally

Terminal 1 (Operator Portal):

```bash
cd C:\Users\Chris\Documents\GitHub\afcmedia\afc-media
pnpm dev
# Runs on http://localhost:3000
```

Terminal 2 (Webmaster Portal):

```bash
cd C:\Users\Chris\Documents\GitHub\afcmedia\excasinoaff
pnpm dev
# Runs on http://localhost:3001
```

Both will connect to the same database.

## Troubleshooting

### Prisma Client Not Found

```bash
pnpm prisma generate
```

### Database Connection Error

Make sure `DATABASE_URL` matches exactly between both projects.

### Auth Not Working

1. Check `NEXTAUTH_URL` matches your deployment domain
2. Verify `NEXTAUTH_SECRET` is set
3. Make sure OAuth redirect URIs include excasinoaff.com

### Port Already in Use

The webmaster portal uses port **3001** by default. If it's in use:

```bash
pnpm dev -- -p 3002
```



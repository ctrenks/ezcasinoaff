# ExCasinoAff - Webmaster Portal

This is a separate Next.js deployment for the webmaster portal (role 2 users).

## Key Features

- **Separate Deployment**: Completely independent from the operator portal
- **Shared Database**: Uses the same database as allmediamatter (shared users and casino data)
- **Webmaster Focus**: Only includes webmaster-specific functionality
- **Port 3001**: Runs on port 3001 by default (allmediamatter uses 3000)

## Setup

1. **Copy environment variables**:
   ```bash
   cp .env.example .env.local
   ```

2. **Update .env.local** with your database credentials (same as allmediamatter)

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Run development server**:
   ```bash
   pnpm dev
   ```

5. **Open**: http://localhost:3001

## Deployment

Deploy this separately to your hosting provider (Vercel, etc.) and point the domain `excasinoaff.com` to it.

### Vercel Deployment

1. Create a new project in Vercel
2. Connect this directory (`excasinoaff`)
3. Add environment variables from `.env.local`
4. Deploy
5. Add domain `excasinoaff.com` in Vercel dashboard

## Database

This application shares the same database as the `allmediamatter` portal:
- Same `User` table
- Same casino/game data
- Same Radium API integration

Make sure both applications use the **same** `DATABASE_URL` in their `.env.local` files.

## Authentication

Uses NextAuth with the shared `User` table. Role 2 users (webmasters) can only access this portal.




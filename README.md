# Formify

Premium dark-UI form builder with anti-cheat quiz protection, real-time form fill experience, and response analytics.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Neon (PostgreSQL) + Drizzle ORM
- Better Auth (email/password)
- Resend (email)
- Cloudinary (media uploads)
- Upstash Redis (rate limiting)
- Vercel (production) + Cloudflare Workers via @opennextjs/cloudflare

## Prerequisites

- Node 20+
- Neon project (pooled + unpooled connection strings)
- Vercel account
- Cloudflare account (for dual deploy)

## Local setup

1. Clone: `git clone https://github.com/mahtamun-hoque-fahim/formify`
2. Install: `npm install`
3. Copy `.env.example` to `.env.local` and fill in values (see PLANNER.md → Env Vars)
4. Push schema: `npx drizzle-kit push`
5. Run dev: `npm run dev`

## Env vars

See PLANNER.md → Env Vars for full descriptions. Names:

```
DATABASE_URL
DATABASE_URL_UNPOOLED
BETTER_AUTH_SECRET
BETTER_AUTH_URL
NEXT_PUBLIC_APP_URL
RESEND_API_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
ADMIN_EMAILS
```

## Scripts

```bash
npm run dev                    # local dev (Turbopack)
npm run build                  # production build
npm run start                  # serve production build
npm run lint                   # ESLint
npx drizzle-kit generate       # generate migration from schema
npx drizzle-kit migrate        # apply migrations (production)
npx drizzle-kit push           # push schema directly (dev only)
npx wrangler dev               # Cloudflare local preview
```

## Deploy

- Push to `main` → Vercel auto-deploys
- Cloudflare Workers mirrors `main` via @opennextjs/cloudflare
- Verify env vars set in BOTH Vercel and Cloudflare dashboards before promoting

## Folder structure

```
app/           routes (App Router — auth, dashboard, fill, admin)
components/    ui primitives, builder, fill renderer, dashboard sections
lib/           db (schema + lazy getDb), auth, utils
drizzle/       generated migrations
public/        static assets
```

Full structure in PLANNER.md → Architecture.

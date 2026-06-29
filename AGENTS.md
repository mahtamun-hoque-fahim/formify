# Formify

Premium dark-UI form builder with anti-cheat quiz protection and response analytics, built free-first for personal use, ready to monetize publicly without touching code.

## Setup & Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Type check: `npx tsc --noEmit`
- DB push (dev only): `npx drizzle-kit push`
- DB migrate (production): `npx drizzle-kit generate` then `npx drizzle-kit migrate`
- CF local preview: `npx wrangler dev`

## Conventions & Non-Negotiables

- No emojis anywhere in code or UI — lucide-react icons only, never hand-rolled SVGs as default
- Dual deploy: Vercel (primary) + Cloudflare Workers via `@opennextjs/cloudflare` — every route must stay Edge Runtime compatible; neon-http driver only, no node-postgres
- Auth: Better Auth — session checked server-side via `auth.api.getSession()`, never client-only
- Route protection: proxy.ts (NOT middleware.ts) — Next.js 16 renamed middleware to proxy
- Admin bypass: all plan limit checks must short-circuit when `user.role === 'admin'` — admin is free forever, no exceptions
- Monetization is STUBBED — no payment flows, no pricing page, no Lemon Squeezy until Fahim explicitly says to wire it
- Tab-switch detection: `document.addEventListener('visibilitychange')` + `window.addEventListener('blur')` — three-strike model (warn / flag / auto-submit), threshold configurable per form
- `plan` column on users defaults to `free`; Pro/Team tiers are schema-defined but no upgrade UI until public launch
- Free tier limits (for future enforcement): 3 active forms, 100 responses per form — these are wired in API route checks but no upgrade flow exists yet

## Security Gotchas

- `.env.local` is never committed — if a secret leaks into git or chat, rotate it immediately
- Public form submission endpoint `/api/f/[slug]` must be rate-limited via Upstash Redis — it is the highest-traffic, unauthenticated route
- Cloudinary file uploads: validate MIME type server-side, use signed upload presets, restrict to image/* and application/pdf
- Response data may contain PII — soft-delete only (`deletedAt`), cascade must work, and owner-triggered deletes must propagate to responses
- Admin routes: role check at proxy.ts layer, not just UI-level hiding
- ADMIN_EMAILS env var seeds admin role on first login — never hardcode admin user IDs

## Session Log

(Newest first. Max 10 entries — drop oldest on overflow.)

### 2026-06-29
- Did: Full Citadel pipeline run — Singularity interview, palette selection (Ink & Signal), BRAIN.md, SITETREE.md, Council PRE-BUILD, repo-maintainer scaffold
- Decided: Admin free forever (no plan gating). Schema monetization-ready from Day 1 (plan column, responseCount) but no payment flows wired. Conditional logic in v1 builder scope after Council/Wizard flagged it as a bounce risk.
- Next: Create GitHub repo, scaffold Next.js 16 with Tailwind v4, write lib/db/schema.ts with all six tables

**Agent:** claude-sonnet-4-6 (claude.ai web)

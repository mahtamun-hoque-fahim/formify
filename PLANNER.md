# Formify — Planner

> Premium dark-UI form builder with anti-cheat quiz protection and response analytics, built free-first for personal use, ready to monetize publicly without touching code.

## Project Overview

**Purpose.** Formify replaces Google Forms with a premium dark-UI experience — real interactivity, landing-page-quality form fill pages, tab-switch detection for quiz integrity, and proper response analytics with multi-format export. Every competitor either looks bad (Google Forms, Tally) or charges too much (Typeform, Fillout). Formify fills the gap.

**Target user.** Anyone currently using Google Forms who needs quizzes they can trust, data collection with visual feedback, or forms that look like a real product — teachers, HR teams, indie builders, researchers.

**Key value.** Build a form that looks premium, protects quiz integrity with tab-switch detection, and gives respondents a smooth fill experience — all free, all in one place.

**Current phase.** Planning

---

## Architecture

**Stack:**
- Framework: Next.js 16 App Router
- Language: TypeScript (strict)
- Styling: Tailwind CSS v4 + CSS variables
- Database: Neon (PostgreSQL) via neon-http driver
- ORM: Drizzle ORM
- Auth: Better Auth (email/password)
- Email: Resend
- Media: Cloudinary (form image uploads)
- Rate limiting: Upstash Redis
- Payments: Lemon Squeezy (stubbed — not wired until public launch)
- Deployment: Vercel (primary) + Cloudflare Workers via @opennextjs/cloudflare

**Deployment topology:**
- `main` → Vercel production
- PRs → Vercel preview
- `main` → Cloudflare Workers (mirror via @opennextjs/cloudflare)
- Edge Runtime required on every route — neon-http driver only, no node-postgres

**Folder structure:**
```
app/
  (auth)/          login, signup, forgot-password, reset-password
  (public)/        landing page /
  dashboard/       authenticated app shell
    forms/
      new/         form builder
      [id]/
        responses/ response viewer
        settings/  form settings
    templates/     template library
    analytics/     aggregate analytics
    settings/      account settings
  f/[slug]/        public form fill page
    submitted/     thank you page
  admin/
    users/
    forms/
  api/             route handlers
components/
  ui/              primitives (button, input, badge, card)
  builder/         form builder drag-and-drop components
  fill/            respondent-facing form renderer
  dashboard/       dashboard layout and sections
lib/
  db/              schema.ts, index.ts (lazy getDb)
  auth/            better-auth config
  utils/           helpers
drizzle/           generated migrations
public/
```

---

## User Flows

### Flow 1: Creator builds and shares a form
1. Lands on `/` → clicks "Get started"
2. Signs up at `/signup` → Better Auth creates user with `role: user`, `plan: free`
3. Redirected to `/dashboard` → sees empty state with "Create your first form" CTA
4. Clicks → taken to `/dashboard/forms/new` (builder)
5. Drags fields onto canvas, configures settings, sets form title and slug
6. Optionally enables quiz mode → tab-switch detection toggle appears in settings
7. Publishes form → `/f/[slug]` is live
8. Shares link with respondents
9. Views responses at `/dashboard/forms/[id]/responses` → charts + export

### Flow 2: Respondent fills a form
1. Opens `/f/[slug]` — no account needed
2. Sees progress bar (if enabled), fills fields one by one or all at once
3. If quiz mode is active: warned upfront that focus monitoring is on
4. On tab switch / window blur: violation logged; first = warning overlay, second = flag, third = auto-submit
5. Submits → redirected to `/f/[slug]/submitted` (thank you page)

### Flow 3: Creator exports responses
1. Opens `/dashboard/forms/[id]/responses`
2. Views response table + summary charts (pie for MCQ, bar for ratings, text list for open-ended)
3. Clicks export → picks format: CSV, Excel (.xlsx), PDF, Google Sheets
4. File downloads immediately (CSV/Excel/PDF) or opens Sheets import flow

### Flow 4: Admin manages platform
1. Signs in as admin (`role: admin`)
2. Lands on `/admin` → platform stats
3. Navigates to `/admin/users` → can suspend or delete accounts
4. Navigates to `/admin/forms` → can view or delete any form
5. Admin accounts have no response limits, no plan gating, ever

---

## DB Schema

Schema lives in `lib/db/schema.ts`.

### users
| column | type | notes |
|---|---|---|
| id | text PK | nanoid |
| email | text unique | |
| name | text | |
| role | enum | `user` \| `admin` |
| plan | enum | `free` \| `pro` \| `team` — default `free`; admin always bypasses limits regardless of plan |
| emailVerified | boolean | default false |
| createdAt | timestamp | defaultNow |
| updatedAt | timestamp | |

### sessions / accounts / verifications
Standard Better Auth tables. See Better Auth docs.

### forms
| column | type | notes |
|---|---|---|
| id | text PK | nanoid |
| userId | text FK → users.id | cascade delete |
| title | text | |
| slug | text unique | URL-safe, user-editable |
| description | text | nullable |
| fields | jsonb | ordered array of field definitions |
| settings | jsonb | quiz mode, tab detection threshold, deadline, password, theme |
| isPublished | boolean | default false |
| responseCount | integer | default 0 — incremented on each submission; used for plan limit checks |
| deletedAt | timestamp | nullable — soft delete |
| createdAt | timestamp | defaultNow |
| updatedAt | timestamp | |

### responses
| column | type | notes |
|---|---|---|
| id | text PK | nanoid |
| formId | text FK → forms.id | cascade delete |
| answers | jsonb | map of fieldId → answer value |
| violations | jsonb | array of tab-switch events: `{ timestamp, type: 'blur'\|'visibility' }` |
| submittedAt | timestamp | defaultNow |
| deletedAt | timestamp | nullable — soft delete; must cascade via owner-delete flow |
| ipHash | text | nullable — hashed respondent IP for abuse detection |

### templates
| column | type | notes |
|---|---|---|
| id | text PK | nanoid |
| title | text | |
| description | text | |
| category | text | e.g. "quiz", "survey", "contact", "registration" |
| fields | jsonb | pre-filled field definitions |
| previewImage | text | Cloudinary URL |
| isPublic | boolean | default true |
| createdAt | timestamp | defaultNow |

---

## API Routes

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| GET | /api/forms | session | — | Form[] (user's own) |
| POST | /api/forms | session | `{ title, slug?, fields, settings }` | Form |
| GET | /api/forms/[id] | session + owner | — | Form |
| PATCH | /api/forms/[id] | session + owner | `{ title?, slug?, fields?, settings?, isPublished? }` | Form |
| DELETE | /api/forms/[id] | session + owner | — | `{ ok: true }` (soft delete) |
| GET | /api/forms/[id]/responses | session + owner | — | Response[] |
| DELETE | /api/forms/[id]/responses | session + owner | — | `{ ok: true }` (bulk soft delete) |
| GET | /api/forms/[id]/export | session + owner | `?format=csv\|xlsx\|pdf` | file download |
| POST | /api/f/[slug] | public | `{ answers, violations? }` | `{ ok: true, submittedAt }` |
| GET | /api/f/[slug]/meta | public | — | `{ title, fields, settings }` (no responses) |
| GET | /api/templates | session | — | Template[] |
| POST | /api/templates/[id]/clone | session | — | Form (cloned from template) |
| GET | /api/admin/users | admin | — | User[] |
| PATCH | /api/admin/users/[id] | admin | `{ suspended?: boolean }` | User |
| DELETE | /api/admin/users/[id] | admin | — | `{ ok: true }` |
| GET | /api/admin/forms | admin | — | Form[] (all users) |
| DELETE | /api/admin/forms/[id] | admin | — | `{ ok: true }` |

---

## Env Vars

| Name | Required | Description | Example |
|---|---|---|---|
| DATABASE_URL | yes | Neon pooled connection | `postgresql://...?sslmode=require` |
| DATABASE_URL_UNPOOLED | yes | Neon direct (migrations) | `postgresql://...?sslmode=require` |
| BETTER_AUTH_SECRET | yes | Session signing secret (32+ chars) | `openssl rand -base64 32` |
| BETTER_AUTH_URL | yes | Public app URL | `https://formify.vercel.app` |
| NEXT_PUBLIC_APP_URL | yes | Same, client-readable | `https://formify.vercel.app` |
| RESEND_API_KEY | yes | Transactional email | `re_...` |
| CLOUDINARY_CLOUD_NAME | yes | Media uploads | `mycloud` |
| CLOUDINARY_API_KEY | yes | Cloudinary auth | `123456789` |
| CLOUDINARY_API_SECRET | yes | Cloudinary auth | `abc...` |
| UPSTASH_REDIS_REST_URL | yes | Rate limiting | `https://....upstash.io` |
| UPSTASH_REDIS_REST_TOKEN | yes | Rate limiting | `AX...` |
| ADMIN_EMAILS | yes | Comma-separated admin email list | `fahim@example.com` |
| LEMON_SQUEEZY_API_KEY | no | Stubbed — do not wire until public launch | `eyJ...` |
| LEMON_SQUEEZY_WEBHOOK_SECRET | no | Stubbed — do not wire until public launch | `lsws_...` |

---

## Timeline / Phases

### Phase 0 — Repo & Foundation
Status: `[ ]` pending

- [ ] Repo created, Vercel + Cloudflare connected
- [ ] Next.js 16 scaffold with Tailwind v4, TypeScript strict
- [ ] `app/globals.css` with Ink & Signal tokens
- [ ] `lib/db/schema.ts` — all tables defined
- [ ] `lib/db/index.ts` — lazy getDb() singleton
- [ ] Drizzle migrations pushed
- [ ] Better Auth configured (email/password, role: user|admin, plan column)
- [ ] `wrangler.jsonc` + `open-next.config.ts` for Cloudflare Workers
- [ ] `CLAUDE.md` pointer file

### Phase 1 — Auth & Shell
Status: `[ ]` pending

- [ ] `/login`, `/signup`, `/forgot-password`, `/reset-password` pages
- [ ] Better Auth email verification via Resend
- [ ] Dashboard shell layout with sidebar nav
- [ ] proxy.ts protecting `/dashboard/*` and `/admin/*`
- [ ] Admin role check — `ADMIN_EMAILS` env var seeds admin on first login

### Phase 2 — Form Builder
Status: `[ ]` pending

- [ ] `/dashboard/forms` — forms list with search, filter, sort
- [ ] `/dashboard/forms/new` — drag-and-drop builder
  - [ ] Field types: short text, long text, multiple choice, checkbox, dropdown, date, file upload, section break
  - [ ] Conditional logic (if Q3 = X, skip to Q7)
  - [ ] Real-time preview panel (right side)
  - [ ] Slug editor with uniqueness check
  - [ ] Publish toggle
- [ ] `/dashboard/forms/[id]` — edit existing form
- [ ] `/dashboard/templates` — template library, clone into builder

### Phase 3 — Form Fill (Public)
Status: `[ ]` pending

- [ ] `/f/[slug]` — respondent-facing fill page
  - [ ] Progress bar (if enabled in settings)
  - [ ] Quiz mode: upfront warning banner if focus monitoring is active
  - [ ] Tab-switch detection: `visibilitychange` + `blur` events
    - Violation 1: warning overlay ("Please stay on this tab")
    - Violation 2: flag logged to response
    - Violation 3: auto-submit with violation record
  - [ ] Threshold configurable per form (1/2/3 violations before auto-submit)
  - [ ] File upload via Cloudinary signed upload
  - [ ] Rate limiting on submission endpoint via Upstash Redis
- [ ] `/f/[slug]/submitted` — thank you page with optional redirect URL

### Phase 4 — Responses & Analytics
Status: `[ ]` pending

- [ ] `/dashboard/forms/[id]/responses` — response table
  - [ ] Per-response row: answers, submitted at, violation count
  - [ ] Summary charts: pie (MCQ), bar (rating), text list (open-ended)
  - [ ] Export: CSV, Excel (.xlsx), PDF, Google Sheets link
  - [ ] Soft-delete responses (owner only)
- [ ] `/dashboard/analytics` — aggregate across all forms
  - [ ] Total submissions over time (line chart)
  - [ ] Top forms by response count
  - [ ] Average completion rate

### Phase 5 — Form Settings
Status: `[ ]` pending

- [ ] `/dashboard/forms/[id]/settings`
  - [ ] Quiz mode toggle
  - [ ] Tab-switch threshold (1 / 2 / 3 violations)
  - [ ] Form password protection
  - [ ] Response deadline (close form after date)
  - [ ] Custom thank-you message + redirect URL
  - [ ] Slug editor
  - [ ] Delete form (soft delete with confirmation)

### Phase 6 — Admin Panel
Status: `[ ]` pending

- [ ] `/admin` — platform stats (total users, forms, responses)
- [ ] `/admin/users` — list, suspend, delete users
- [ ] `/admin/forms` — view all forms, delete any form

### Phase 7 — Account & Polish
Status: `[ ]` pending

- [ ] `/dashboard/settings` — profile, change password, notification prefs
- [ ] OG images per form (`/f/[slug]` → `opengraph-image.tsx`)
- [ ] `app/sitemap.ts` — public routes only
- [ ] `app/robots.ts`
- [ ] Mobile responsiveness audit (especially builder + fill page)
- [ ] `plan` column gating logic in API routes (free tier limits wired but payments NOT live)
  - Free: 3 active forms, 100 responses per form
  - Pro/Team: unlimited (stubbed — no upgrade flow yet)
- [ ] Admin bypass: all plan checks short-circuit for `role: admin`

### Phase 8 — Monetization Ready (NOT live — stub only)
Status: `[ ]` pending — do not start until Fahim gives signal

- [ ] Lemon Squeezy webhook handler `/api/webhooks/lemon-squeezy`
- [ ] Upgrade flow: `/dashboard/settings` → "Upgrade" → Lemon Squeezy checkout
- [ ] `/pricing` page
- [ ] Plan upgrade email via Resend

---

## Next Steps

In order:
1. Create GitHub repo `formify`, connect Vercel and Cloudflare
2. Scaffold Next.js 16 with Tailwind v4, TypeScript strict, `wrangler.jsonc`
3. Write `lib/db/schema.ts` — all six tables from Day 1
4. Configure Better Auth with role + plan columns
5. Build auth pages (login, signup, forgot/reset password)

---

## Notes & Decisions

**2026-06-29.** Rebuild from scratch — original Formify predated the Citadel pipeline. No prior codebase referenced.

**2026-06-29.** Admin is free forever, no plan gating. Plan column defaults to `free` for all users; API limit checks always short-circuit for `role: admin`. This is a permanent product decision, not a launch phase toggle.

**2026-06-29.** Monetization schema wired in Phase 7 (plan limits enforced in API), but no payment flows, no pricing page, no Lemon Squeezy until Fahim gives explicit public-launch signal. Going public = flip a flag, not a migration.

**2026-06-29.** Tab-switch detection is deterrence, not enforcement. Marketed as "focus monitoring." Three-strike model: warn → flag → auto-submit. Threshold is creator-configurable.

**2026-06-29.** Conditional logic is in v1 builder scope — Council/Wizard flagged it as a bounce risk if missing.

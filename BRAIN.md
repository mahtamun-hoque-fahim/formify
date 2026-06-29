# BRAIN.md — Formify

> This file is maintained by the Singularity skill. It is the identity document of this project.
> When Claude drifts, hallucinates, or loses context — this file is the source of truth.
> Do not confuse this with PLANNER.md (tasks/phases) or DESIGN_GUIDE.md (design tokens).

---

## The One-Line Truth

Formify is a premium dark-UI form builder that replaces Google Forms with real interactivity, anti-cheat quiz protection, landing-page-quality form design, and proper response analytics — built to be monetized once Fahim is ready to flip the switch.

---

## Why It Exists

Google Forms works but it is ugly, passive, and easy to cheat. People who need quizzes with integrity, data collection with progress feedback, or forms that look like a real product — are stuck paying Typeform or Jotform and crossing a paywall just to get a decent experience. Fahim is building the version that looks better than all of them, costs less, and adds the one thing nobody else has locked down: tab-switching prevention in quiz mode. It starts as a personal tool and ships publicly when the time is right.

---

## What It Must Become

A form builder where someone opens it, drags a form together in minutes, shares a link, and respondents feel like they are filling out a premium SaaS product — not a school assignment. Responses land in a clean dashboard, visualised in charts, exportable in every format. Quiz takers cannot cheat by switching tabs. Done feels like: "I would pay for this."

---

## Core Decisions (Locked)

- [LOCKED] Dark-first UI, Ink & Signal palette — competitors own flat white and cold dark blue; this is the warm intelligent dark
- [LOCKED] Tab-switch detection in quiz mode — the primary differentiator; must be robust, not a gimmick
- [LOCKED] No Google OAuth as the only auth — credentials + Better Auth, keeps stack consistent
- [LOCKED] Formify is free during personal/pre-launch phase — no payment flows, no pricing page, no paywalls until Fahim gives the public launch signal
- [LOCKED] Admin accounts are free forever — no plan gating, no response limits, no upgrade prompts for admin role
- [LOCKED] Schema is monetization-ready from day one — users.plan column (default: free), forms.responseCount, soft-delete on responses — going public requires zero migrations
- [LOCKED] Lemon Squeezy stubbed in stack for future monetization — do not wire until explicitly asked
- [LOCKED] Starts as personal tool, public launch gated by Fahim — no investor pressure, no launch deadline
- [LOCKED] Next.js 16 App Router — Fahim's current canonical stack
- [LOCKED] Edge Runtime throughout — neon-http driver only, no node-postgres
- [LOCKED] Dual deploy: Vercel primary, Cloudflare Workers via @opennextjs/cloudflare secondary

---

## Visual Identity (Locked)

> Chosen in Phase 1.5 — Option A "Ink & Signal". These values are locked. Do not substitute with `#00e676`, `#0a0a0a default`, `#131720`, or `#6C63FF`. Do not invent new values. If you need a token not listed here, derive it from the accent at reduced opacity and flag it for Fahim.

| Token              | Value         | Usage                              |
|--------------------|---------------|------------------------------------|
| `bg`               | `#0a0a0f`     | Page background                    |
| `surface`          | `#13131c`     | Card, panel, input backgrounds     |
| `surface-elevated` | `#1a1a28`     | Dropdowns, modals, raised elements |
| `accent`           | `#6d28d9`     | Primary actions, links, focus rings|
| `accent-faint`     | `#6d28d91a`   | Ring/border accent at 10% opacity  |
| `border`           | `#1e1a30`     | Default border colour              |
| `text`             | `#f0eeff`     | Primary text                       |
| Font (display)     | Syne          | Headings, brand                    |
| Font (body)        | Onest         | Body copy, UI labels               |
| Font (mono)        | JetBrains Mono| Code, numeric values               |

---

## What It Must Never Become

- Never a no-code website builder — Formify makes forms, not full sites
- Never a CRM or contact management platform — responses are data, not relationships
- Never a survey-only tool — it must handle forms, quizzes, and data collection equally
- Never bloated with integrations added just to match a competitor checklist
- Never a Webflow, HubSpot, or Notion competitor — scope is forms, always
- Never light-mode first — the visual identity is the dark premium feel

---

## Current State

```
Status: Pre-build (Rebuild — original existed pre-pipeline)
Last updated: 2026-06-29

What works:
- Nothing yet — clean rebuild from scratch with the full Citadel pipeline

What's broken or incomplete:
- Everything — original Formify had no pipeline, no BRAIN.md, no structured stack

What's next (in spirit, not tasks):
- tree-man → SITETREE.md → Council PRE-BUILD → repo-maintainer → build
```

---

## The Stack (Frozen)

| Layer       | Choice                                              |
|-------------|-----------------------------------------------------|
| Framework   | Next.js 16 App Router                               |
| Language    | TypeScript                                          |
| Styling     | Tailwind CSS v4                                     |
| Database    | Neon (PostgreSQL) + Drizzle ORM                     |
| Auth        | Better Auth (email/password)                        |
| Payments    | Lemon Squeezy (when monetization is enabled)        |
| Deployment  | Vercel (primary) + Cloudflare Workers (secondary)   |
| CF Adapter  | @opennextjs/cloudflare                              |
| Email       | Resend                                              |
| Storage     | Cloudinary (form media/image uploads)               |
| Rate limit  | Upstash Redis                                       |

---

## Constraints & Non-Negotiables

- Must deploy to both Vercel and Cloudflare Workers (Edge Runtime compatible)
- No emojis in UI — lucide-react icons only, never hand-rolled SVGs as default
- Dark-first, no light mode
- No Supabase — Neon + Drizzle only
- Tab-switch detection must use the Page Visibility API + focus/blur events — not a Chrome extension dependency
- JSZip or file generation must run in Node runtime, not Edge, if needed for export
- No hardcoded hex literals in component files — all tokens from BRAIN.md Visual Identity via CSS variables
- Anti-cheat is a core feature, not a setting — it ships in quiz mode by default, not as an opt-in toggle

---

## Context Hooks (for Claude)

- Formify is a REBUILD — there is no prior codebase to reference; start clean
- Tab-switch detection uses `document.addEventListener('visibilitychange')` + `window.addEventListener('blur')` — the quiz locks or warns on trigger, Fahim decides severity level (warn vs. auto-submit)
- Anti-goals are firm: if a feature suggestion sounds like "CRM", "website builder", or "Notion", stop and flag it
- Lemon Squeezy is stubbed in stack but NOT wired — Formify is FREE until Fahim explicitly triggers monetization; do not build pricing pages, paywalls, or payment flows until asked
- Palette is Ink & Signal (Option A) — do NOT drift to the learnBEE mint (#3DF49A) or Notably green (#00e676)
- Edge Runtime is non-negotiable — every route handler and server action must be Edge-compatible; neon-http driver only
- `surface-elevated` (#1a1a28) is derived from accent at reduced opacity blended with surface — use for modals, dropdowns, and command palette

---

*Last updated by Singularity on 2026-06-29*

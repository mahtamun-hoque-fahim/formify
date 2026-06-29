# Formify — Design Guide

Implementation spec. No rationale. No marketing copy. Tokens, patterns, constraints only.

---

## Color tokens

`app/globals.css` (Tailwind v4 — tokens auto-promote to utilities):

```css
@import "tailwindcss";

@theme {
  /* Surfaces — Ink & Signal palette (locked in BRAIN.md) */
  --color-bg:               #0a0a0f;
  --color-surface:          #13131c;
  --color-surface-elevated: #1a1a28;
  --color-border:           #1e1a30;

  /* Text */
  --color-text:             #f0eeff;
  --color-text-muted:       #9d9ab8;
  --color-text-faint:       #5a5875;

  /* Brand — violet */
  --color-accent:           #6d28d9;
  --color-accent-hover:     #7c3aed;
  --color-accent-faint:     #6d28d91a;

  /* Semantic */
  --color-success:          #22c55e;
  --color-warning:          #f59e0b;
  --color-danger:           #ef4444;
  --color-info:             #3b82f6;

  /* Shadows */
  --shadow-sm:  0 1px 2px rgb(0 0 0 / 0.5);
  --shadow-md:  0 4px 12px rgb(0 0 0 / 0.6);
  --shadow-lg:  0 12px 32px rgb(0 0 0 / 0.7);
  --shadow-glow: 0 0 24px #6d28d91a;
}
```

---

## Typography

Fonts loaded via `next/font/google` in `app/layout.tsx`:

- **Display:** Syne (`--font-syne`) — h1, h2, hero text, form titles
- **Body:** Onest (`--font-onest`) — default for all UI text, labels, paragraphs
- **Mono:** JetBrains Mono (`--font-mono`) — IDs, timestamps, response counts, code

**Weights:**
- Body: 400 regular, 500 medium, 600 semibold (buttons)
- Display: 600 semibold, 700 bold (hero)
- Mono: 400, 500

**Scale:**
| Token | Size | Use |
|---|---|---|
| `text-xs` | 0.75rem | Captions, timestamps, badges |
| `text-sm` | 0.875rem | Labels, secondary text, table cells |
| `text-base` | 1rem | Body, form field labels |
| `text-lg` | 1.125rem | Lead text, section intros |
| `text-xl` | 1.25rem | h4, card titles |
| `text-2xl` | 1.5rem | h3, dashboard section headers |
| `text-3xl` | 1.875rem | h2, page titles |
| `text-4xl` | 2.25rem | h1 (interior pages) |
| `text-5xl` | 3rem | Hero headline (landing) |
| `text-6xl` | 3.75rem | Hero display (large viewport) |

**Line height:** 1.6 for body, 1.2 for display headings.

---

## Spacing scale

Tailwind defaults. Common values: 2 (8px), 3 (12px), 4 (16px), 6 (24px), 8 (32px), 12 (48px), 16 (64px), 24 (96px).

Dashboard sidebar: 240px fixed width. Builder canvas: flex-1. Preview panel: 360px fixed.

---

## Border radius

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 4px | Badges, small pills |
| `rounded-md` | 6px | Buttons, inputs (default) |
| `rounded-lg` | 8px | Cards, builder field blocks |
| `rounded-xl` | 12px | Modals, drawers, large panels |
| `rounded-2xl` | 16px | Feature cards on landing |
| `rounded-full` | 9999px | Avatars, toggle switches |

---

## Shadows

Use sparingly — elevation comes from surface color progression, not shadows.

```css
--shadow-sm:   0 1px 2px rgb(0 0 0 / 0.5);
--shadow-md:   0 4px 12px rgb(0 0 0 / 0.6);
--shadow-lg:   0 12px 32px rgb(0 0 0 / 0.7);
--shadow-glow: 0 0 24px #6d28d91a;
```

Glow used on: active form builder fields, focused inputs, primary CTA hover.

---

## Component patterns

### Button — primary
```tsx
<button className="bg-accent text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-accent-hover transition-colors duration-150">
  Publish form
</button>
```

### Button — secondary
```tsx
<button className="bg-surface text-text px-4 py-2 rounded-md border border-border text-sm hover:bg-surface-elevated transition-colors duration-150">
  Cancel
</button>
```

### Button — ghost
```tsx
<button className="text-text-muted hover:text-text px-3 py-2 rounded-md text-sm transition-colors duration-150">
  Skip
</button>
```

### Button — danger
```tsx
<button className="bg-danger/10 text-danger border border-danger/30 px-4 py-2 rounded-md text-sm hover:bg-danger/20 transition-colors duration-150">
  Delete form
</button>
```

### Input
```tsx
<input className="bg-surface border border-border rounded-md px-3 py-2 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none focus:shadow-glow transition-all duration-150 w-full" />
```

### Card
```tsx
<div className="bg-surface border border-border rounded-lg p-6">
  ...
</div>
```

### Card — elevated (modals, command palette)
```tsx
<div className="bg-surface-elevated border border-border rounded-xl p-6 shadow-lg">
  ...
</div>
```

### Badge — accent
```tsx
<span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-accent-faint text-accent">
  QUIZ
</span>
```

### Badge — success
```tsx
<span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-success/10 text-success">
  PUBLISHED
</span>
```

### Badge — muted
```tsx
<span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-surface-elevated text-text-muted">
  DRAFT
</span>
```

### Form builder field block (draggable)
```tsx
<div className="bg-surface border border-border rounded-lg p-4 cursor-grab hover:border-accent transition-colors duration-150 group">
  <div className="flex items-center gap-2 mb-2">
    <GripVertical className="w-4 h-4 text-text-faint group-hover:text-text-muted" />
    <span className="text-sm font-medium text-text">{field.label}</span>
  </div>
  ...
</div>
```

### Progress bar (form fill)
```tsx
<div className="w-full bg-surface rounded-full h-1.5">
  <div
    className="bg-accent h-1.5 rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

### Violation warning overlay (quiz mode)
```tsx
<div className="fixed inset-0 bg-bg/90 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="bg-surface-elevated border border-danger/30 rounded-xl p-8 max-w-sm text-center shadow-lg">
    <AlertTriangle className="w-8 h-8 text-danger mx-auto mb-4" />
    <h2 className="font-display text-xl font-semibold text-text mb-2">Please stay on this tab</h2>
    <p className="text-text-muted text-sm mb-6">This quiz monitors your focus. Switching tabs has been logged.</p>
    <button className="bg-accent text-white px-6 py-2 rounded-md text-sm font-semibold w-full">
      Resume quiz
    </button>
  </div>
</div>
```

---

## Animation defaults

- Hover / color transitions: `transition-colors duration-150 ease-out`
- Layout shifts (height, opacity): `transition-all duration-200 ease-out`
- Modal/drawer enter: `transition-all duration-200 ease-out`
- Page reveal: `transition-opacity duration-300 ease-out`
- Progress bar: `transition-all duration-300 ease-out`
- Maximum: 300ms. Never longer.

Always wrap in `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Focus indicators

Never `outline: none` without a replacement.

```css
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

---

## Dark mode notes

Dark-first. No light mode.

- Never pure black for bg — use `--color-bg` (#0a0a0f)
- Never pure white for text — use `--color-text` (#f0eeff)
- Surface elevation hierarchy: `bg` → `surface` → `surface-elevated` → modal/overlay
- Shadows are heavy; use sparingly. Elevation primarily via surface color, not shadow depth.
- Accent glow (`--shadow-glow`) reserved for interactive moments: focused inputs, active builder selections, primary CTA hover

---

## Icons

lucide-react only. No emojis, no hand-rolled SVGs as default.

Common icons used in Formify:
- `GripVertical` — drag handle on builder fields
- `Plus` — add field, create form
- `Trash2` — delete
- `Settings` — form settings
- `BarChart2` — analytics
- `Download` — export
- `Share2` — share form link
- `Eye` — preview
- `EyeOff` — hide
- `AlertTriangle` — violation warning
- `CheckCircle2` — success state
- `Copy` — copy link
- `LogOut` — sign out
- `Shield` — quiz mode / anti-cheat indicator

Default size: `w-4 h-4` inline, `w-5 h-5` standalone, `w-6 h-6` empty states.

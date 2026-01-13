# Design Tokens Reference

This document describes the two-tier design token system used in AI Operator Academy.

## Token Architecture

### Two-Tier System

**Tier 1: Semantic Tokens** — Always use these for UI elements. They automatically adapt to light/dark mode.

**Tier 2: Color Scales** — Use sparingly for status indicators, phase colors, and branded elements.

```
┌─────────────────────────────────────────────────────────────┐
│                    TIER 1: SEMANTIC TOKENS                  │
│                 (Use these for all UI elements)             │
├─────────────────────────────────────────────────────────────┤
│  --color-bg-primary     --color-text-primary                │
│  --color-bg-secondary   --color-text-secondary              │
│  --color-bg-tertiary    --color-text-tertiary               │
│  --color-border-primary --color-border-secondary            │
└─────────────────────────────────────────────────────────────┘
                              ↑
                    Automatically switch
                    based on theme
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    TIER 2: COLOR SCALES                     │
│            (Only for status, phases, branding)              │
├─────────────────────────────────────────────────────────────┤
│  --color-neutral-50 → --color-neutral-950                   │
│  --color-primary-50 → --color-primary-900                   │
│  --color-success-50 → --color-success-700                   │
│  --color-warning-50 → --color-warning-700                   │
│  --color-error-50   → --color-error-700                     │
│  --color-phase-1, --color-phase-2, etc.                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Semantic Tokens (Tier 1)

### Background Colors

| Token | Light Mode | Dark Mode | Use For |
|-------|------------|-----------|---------|
| `--color-bg-primary` | `#ffffff` | `neutral-950` | Main page background |
| `--color-bg-secondary` | `neutral-50` | `neutral-900` | Cards, sidebars, sections |
| `--color-bg-tertiary` | `neutral-100` | `neutral-800` | Hover states, nested cards |

### Text Colors

| Token | Light Mode | Dark Mode | Use For |
|-------|------------|-----------|---------|
| `--color-text-primary` | `neutral-900` | `neutral-50` | Headings, body text |
| `--color-text-secondary` | `neutral-600` | `neutral-300` | Descriptions, labels |
| `--color-text-tertiary` | `neutral-500` | `neutral-400` | Placeholders, captions |

### Border Colors

| Token | Light Mode | Dark Mode | Use For |
|-------|------------|-----------|---------|
| `--color-border-primary` | `neutral-200` | `neutral-700` | Card borders, dividers |
| `--color-border-secondary` | `neutral-100` | `neutral-800` | Subtle separators |

### Usage Example

```css
/* Always use semantic tokens */
.card {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: var(--border-width) solid var(--color-border-primary);
}

.card-description {
  color: var(--color-text-secondary);
}
```

---

## Color Scales (Tier 2)

### When to Use Color Scales

| Use Case | Allowed? | Example |
|----------|----------|---------|
| Status badges | ✅ Yes | `--color-success-500` for "Complete" badge |
| Phase indicators | ✅ Yes | `--color-phase-1` for Phase 1 accent |
| Progress bars | ✅ Yes | `--color-primary-500` for fill color |
| Card backgrounds | ❌ No | Use `--color-bg-secondary` instead |
| Text color | ❌ No | Use `--color-text-primary` instead |
| Borders | ❌ No | Use `--color-border-primary` instead |

### Neutral Scale

```css
--color-neutral-50:  #fafafa;   /* Lightest */
--color-neutral-100: #f5f5f5;
--color-neutral-200: #e5e5e5;
--color-neutral-300: #d4d4d4;
--color-neutral-400: #a3a3a3;
--color-neutral-500: #737373;   /* Mid */
--color-neutral-600: #525252;
--color-neutral-700: #404040;
--color-neutral-800: #262626;
--color-neutral-900: #171717;
--color-neutral-950: #0a0a0a;   /* Darkest */
```

### Primary Scale (Blue)

```css
--color-primary-50:  #eff6ff;   /* Subtle backgrounds */
--color-primary-100: #dbeafe;
--color-primary-200: #bfdbfe;
--color-primary-300: #93c5fd;
--color-primary-400: #60a5fa;
--color-primary-500: #3b82f6;   /* Default */
--color-primary-600: #2563eb;   /* Hover */
--color-primary-700: #1d4ed8;   /* Active */
--color-primary-800: #1e40af;
--color-primary-900: #1e3a8a;
```

### Status Colors

```css
/* Success (Green) */
--color-success-50:  #f0fdf4;
--color-success-100: #dcfce7;
--color-success-500: #22c55e;
--color-success-600: #16a34a;
--color-success-700: #15803d;

/* Warning (Amber) */
--color-warning-50:  #fffbeb;
--color-warning-100: #fef3c7;
--color-warning-500: #f59e0b;
--color-warning-600: #d97706;
--color-warning-700: #b45309;

/* Error (Red) */
--color-error-50:  #fef2f2;
--color-error-100: #fee2e2;
--color-error-500: #ef4444;
--color-error-600: #dc2626;
--color-error-700: #b91c1c;

/* Info (Cyan) */
--color-info-50:  #ecfeff;
--color-info-100: #cffafe;
--color-info-500: #06b6d4;
--color-info-600: #0891b2;
--color-info-700: #0e7490;
```

---

## Phase Colors

Each curriculum phase has a distinct color for visual navigation.

| Phase | Token | Color | Light BG |
|-------|-------|-------|----------|
| Phase 1 (AI Literacy) | `--color-phase-1` | `#3b82f6` (Blue) | `--color-phase-1-light` |
| Phase 2 (Workflow) | `--color-phase-2` | `#8b5cf6` (Purple) | `--color-phase-2-light` |
| Phase 3 (Agentic Orchestration) | `--color-phase-3` | `#14b8a6` (Teal) | `--color-phase-3-light` |
| Phase 4 (Strategy) | `--color-phase-4` | `#f97316` (Orange) | `--color-phase-4-light` |
| Capstone | `--color-capstone` | `#eab308` (Yellow) | `--color-capstone-light` |

### Phase Utilities

```css
/* Apply phase color via utility class */
.phase-1 { --phase-color: var(--color-phase-1); }
.phase-2 { --phase-color: var(--color-phase-2); }
.phase-3 { --phase-color: var(--color-phase-3); }
.phase-4 { --phase-color: var(--color-phase-4); }

/* Then use the local variable */
.phase-indicator {
  background-color: var(--phase-color);
}

.phase-card {
  border-left: 4px solid var(--phase-color);
}
```

---

## Typography

### Font Families

```css
--font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;
```

### Font Sizes (Fluid with `clamp()`)

| Token | Min | Preferred | Max | Use For |
|-------|-----|-----------|-----|---------|
| `--text-xs` | 0.75rem | — | — | Captions, badges |
| `--text-sm` | 0.875rem | — | — | Small text, labels |
| `--text-base` | 1rem | — | — | Body text |
| `--text-lg` | 1.125rem | `1rem + 0.625vw` | 1.25rem | Large body |
| `--text-xl` | 1.25rem | `1.1rem + 0.75vw` | 1.5rem | H4, subtitles |
| `--text-2xl` | 1.5rem | `1.25rem + 1.25vw` | 2rem | H3 |
| `--text-3xl` | 1.875rem | `1.5rem + 1.875vw` | 2.5rem | H2 |
| `--text-4xl` | 2.25rem | `1.75rem + 2.5vw` | 3rem | H1 |
| `--text-5xl` | 3rem | `2.25rem + 3.75vw` | 4rem | Hero text |

### Font Weights

```css
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

### Line Heights

```css
--leading-none:    1;
--leading-tight:   1.25;
--leading-snug:    1.375;
--leading-normal:  1.5;
--leading-relaxed: 1.625;
--leading-loose:   2;
```

---

## Spacing

Based on an 8px grid system.

| Token | Value | Pixels |
|-------|-------|--------|
| `--space-0` | 0 | 0px |
| `--space-1` | 0.25rem | 4px |
| `--space-2` | 0.5rem | 8px |
| `--space-3` | 0.75rem | 12px |
| `--space-4` | 1rem | 16px |
| `--space-5` | 1.25rem | 20px |
| `--space-6` | 1.5rem | 24px |
| `--space-8` | 2rem | 32px |
| `--space-10` | 2.5rem | 40px |
| `--space-12` | 3rem | 48px |
| `--space-16` | 4rem | 64px |
| `--space-20` | 5rem | 80px |
| `--space-24` | 6rem | 96px |

### Component Spacing

```css
--card-padding-sm: var(--space-4);   /* 16px */
--card-padding:    var(--space-6);   /* 24px */
--card-padding-lg: var(--space-8);   /* 32px */
--section-gap:     var(--space-8);   /* 32px */
--section-padding: var(--space-12);  /* 48px */
--content-max-width: 65ch;
```

---

## Shadows

Navy-toned shadows for sophistication.

| Token | Value | Use For |
|-------|-------|---------|
| `--shadow-xs` | `0 1px 2px 0 rgb(10 14 20 / 0.05)` | Subtle elevation |
| `--shadow-sm` | `0 2px 6px rgb(10 14 20 / 0.06)` | Buttons |
| `--shadow` | `0 4px 10px rgb(10 14 20 / 0.07)` | Cards (default) |
| `--shadow-md` | `0 6px 16px rgb(10 14 20 / 0.08)` | Cards (hover) |
| `--shadow-lg` | `0 12px 30px rgb(10 14 20 / 0.12)` | Modals |
| `--shadow-xl` | `0 20px 25px -5px rgb(10 14 20 / 0.1)` | Large modals |
| `--shadow-2xl` | `0 25px 50px -12px rgb(10 14 20 / 0.25)` | Hero sections |

### Colored Shadows (For Emphasis)

```css
--shadow-primary: 0 8px 20px -4px hsl(217 91% 60% / 0.4);  /* Blue glow */
--shadow-success: 0 8px 20px -4px hsl(142 71% 45% / 0.4);  /* Green glow */
--shadow-warning: 0 8px 20px -4px hsl(45 93% 47% / 0.4);   /* Amber glow */
--shadow-error:   0 8px 20px -4px hsl(0 84% 60% / 0.4);    /* Red glow */
```

---

## Border Radius

| Token | Value | Use For |
|-------|-------|---------|
| `--radius-sm` | 0.25rem | Small badges |
| `--radius-md` | 0.375rem | Buttons, inputs |
| `--radius-lg` | 0.5rem | Cards |
| `--radius-xl` | 0.75rem | Large cards |
| `--radius-2xl` | 1rem | Modals |
| `--radius-full` | 9999px | Pills, avatars |

---

## Layout

```css
/* Containers */
--container-sm:  640px;
--container-md:  768px;
--container-lg:  1024px;
--container-xl:  1280px;
--container-2xl: 1536px;

/* Fixed elements */
--sidebar-width: 280px;
--sidebar-width-collapsed: 64px;
--header-height: 64px;
```

### Z-Index Scale

| Token | Value | Use For |
|-------|-------|---------|
| `--z-dropdown` | 100 | Dropdown menus |
| `--z-sticky` | 200 | Sticky headers |
| `--z-fixed` | 300 | Fixed elements |
| `--z-modal-backdrop` | 400 | Modal overlays |
| `--z-modal` | 500 | Modals |
| `--z-popover` | 600 | Popovers |
| `--z-tooltip` | 700 | Tooltips |
| `--z-toast` | 800 | Toast notifications |

---

## Motion

### Durations

| Token | Value | Use For |
|-------|-------|---------|
| `--duration-75` | 75ms | Instant feedback |
| `--duration-100` | 100ms | Quick transitions |
| `--duration-150` | 150ms | Standard hover |
| `--duration-200` | 200ms | Default animations |
| `--duration-300` | 300ms | Expanded transitions |
| `--duration-500` | 500ms | Slow reveals |
| `--duration-700` | 700ms | Deliberate motion |
| `--duration-1000` | 1000ms | Very slow |

### Easing Functions

```css
--ease-linear:  linear;
--ease-in:      cubic-bezier(0.4, 0, 1, 1);
--ease-out:     cubic-bezier(0, 0, 0.2, 1);
--ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce:  cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## Component Tokens

### Buttons

```css
/* Primary */
--btn-primary-bg: var(--color-primary-600);
--btn-primary-bg-hover: var(--color-primary-700);
--btn-primary-text: white;

/* Secondary */
--btn-secondary-bg: var(--color-bg-secondary);
--btn-secondary-bg-hover: var(--color-bg-tertiary);
--btn-secondary-text: var(--color-text-primary);
--btn-secondary-border: var(--color-border-primary);

/* Ghost */
--btn-ghost-bg: transparent;
--btn-ghost-bg-hover: var(--color-bg-secondary);
--btn-ghost-text: var(--color-text-secondary);

/* Sizing */
--btn-height-sm: 32px;
--btn-height: 40px;
--btn-height-lg: 48px;
```

### Form Inputs

```css
--input-bg: var(--color-bg-primary);
--input-border: var(--color-border-primary);
--input-border-focus: var(--color-primary-500);
--input-text: var(--color-text-primary);
--input-placeholder: var(--color-text-tertiary);
--input-height: 40px;
--input-radius: var(--radius-md);
```

### Cards

```css
--card-bg: var(--color-bg-primary);
--card-border: var(--color-border-secondary);
--card-radius: var(--radius-lg);
--card-shadow: var(--shadow);
--card-shadow-hover: var(--shadow-md);
```

### Focus Ring

```css
--ring-width: 3px;
--ring-color: var(--color-primary-500);
--ring-offset: 2px;
--focus-ring: 0 0 0 var(--ring-width) var(--ring-color);
```

---

## Anti-Patterns

### ❌ Don't: Use Raw Hex Colors

```css
/* WRONG */
.card {
  background: #ffffff;
  color: #333333;
  border: 1px solid #e5e5e5;
}
```

### ✅ Do: Use Semantic Tokens

```css
/* CORRECT */
.card {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: var(--border-width) solid var(--color-border-primary);
}
```

### ❌ Don't: Add Component-Level Dark Mode

```css
/* WRONG - scattered dark mode overrides */
[data-theme='dark'] .my-component {
  background: #1a1a1a;
}
```

### ✅ Do: Rely on Semantic Tokens

```css
/* CORRECT - semantic tokens auto-switch */
.my-component {
  background-color: var(--color-bg-secondary);
}
```

### ❌ Don't: Use Magic Numbers

```css
/* WRONG */
.section {
  padding: 24px;
  margin-bottom: 16px;
  border-radius: 8px;
}
```

### ✅ Do: Use Spacing Tokens

```css
/* CORRECT */
.section {
  padding: var(--space-6);
  margin-bottom: var(--space-4);
  border-radius: var(--radius-lg);
}
```

---

## Dark Mode Audit Checklist

Before submitting CSS changes, verify:

- [ ] All background colors use `--color-bg-*` tokens
- [ ] All text colors use `--color-text-*` tokens
- [ ] All border colors use `--color-border-*` tokens
- [ ] No component-level `[data-theme='dark']` overrides
- [ ] No hardcoded hex colors
- [ ] Shadows work in both themes (navy-toned shadows are neutral)
- [ ] Test both light and dark mode visually

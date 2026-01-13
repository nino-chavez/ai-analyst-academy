# AI Analyst Academy — Design Tokens & Visual System

## Overview

This document defines the design tokens for the AI Analyst Academy platform. These tokens form the foundation of the visual design system, ensuring consistency across all components and pages while optimizing for learning and accessibility.

---

## Design Principles

### Learning-Optimized Design

1. **Reduce Cognitive Load**: Clean layouts, generous whitespace, limited color palette
2. **Clear Hierarchy**: Distinct visual levels guide attention to important content
3. **Consistent Patterns**: Same interactions behave the same way everywhere
4. **Accessibility First**: WCAG AA compliance as baseline, not afterthought
5. **Focus on Content**: Design supports learning, never distracts from it

---

## Color System

### Base Colors

```css
:root {
  /* Neutral Scale (Gray) */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;
  --color-neutral-950: #0a0a0a;
}
```

### Brand Colors

```css
:root {
  /* Primary - Learning/Progress (Blue) */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  /* Secondary - Engagement/Action (Indigo) */
  --color-secondary-50: #eef2ff;
  --color-secondary-100: #e0e7ff;
  --color-secondary-200: #c7d2fe;
  --color-secondary-300: #a5b4fc;
  --color-secondary-400: #818cf8;
  --color-secondary-500: #6366f1;
  --color-secondary-600: #4f46e5;
  --color-secondary-700: #4338ca;
  --color-secondary-800: #3730a3;
  --color-secondary-900: #312e81;
}
```

### Semantic Colors

```css
:root {
  /* Success (Green) - Completion, correct answers */
  --color-success-50: #f0fdf4;
  --color-success-100: #dcfce7;
  --color-success-200: #bbf7d0;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;

  /* Warning (Amber) - Caution, review needed */
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-200: #fde68a;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;

  /* Error (Red) - Incorrect, problems */
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-200: #fecaca;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;

  /* Info (Cyan) - Tips, information */
  --color-info-50: #ecfeff;
  --color-info-100: #cffafe;
  --color-info-200: #a5f3fc;
  --color-info-500: #06b6d4;
  --color-info-600: #0891b2;
  --color-info-700: #0e7490;
}
```

### Phase Colors

Each curriculum phase has a distinct accent color for visual navigation:

```css
:root {
  /* Phase 1: AI Literacy - Blue */
  --color-phase-1: #3b82f6;
  --color-phase-1-light: #eff6ff;
  --color-phase-1-dark: #1d4ed8;

  /* Phase 2: Workflow Engineering - Purple */
  --color-phase-2: #8b5cf6;
  --color-phase-2-light: #f5f3ff;
  --color-phase-2-dark: #6d28d9;

  /* Phase 3: Agentic Orchestration - Teal */
  --color-phase-3: #14b8a6;
  --color-phase-3-light: #f0fdfa;
  --color-phase-3-dark: #0d9488;

  /* Phase 4: Strategy - Orange */
  --color-phase-4: #f97316;
  --color-phase-4-light: #fff7ed;
  --color-phase-4-dark: #ea580c;

  /* Capstone - Gold */
  --color-capstone: #eab308;
  --color-capstone-light: #fefce8;
  --color-capstone-dark: #ca8a04;
}
```

### Dark Mode Colors

```css
[data-theme="dark"] {
  /* Background */
  --color-bg-primary: var(--color-neutral-950);
  --color-bg-secondary: var(--color-neutral-900);
  --color-bg-tertiary: var(--color-neutral-800);

  /* Text */
  --color-text-primary: var(--color-neutral-50);
  --color-text-secondary: var(--color-neutral-300);
  --color-text-tertiary: var(--color-neutral-400);

  /* Borders */
  --color-border-primary: var(--color-neutral-700);
  --color-border-secondary: var(--color-neutral-800);
}

[data-theme="light"] {
  /* Background */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: var(--color-neutral-50);
  --color-bg-tertiary: var(--color-neutral-100);

  /* Text */
  --color-text-primary: var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-600);
  --color-text-tertiary: var(--color-neutral-500);

  /* Borders */
  --color-border-primary: var(--color-neutral-200);
  --color-border-secondary: var(--color-neutral-100);
}
```

---

## Typography

### Font Families

```css
:root {
  /* Primary font - Body text, UI elements */
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;

  /* Monospace - Code, technical content */
  --font-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace;
}
```

### Font Sizes

Based on a 1.25 ratio scale (Major Third):

```css
:root {
  --text-xs: 0.75rem;     /* 12px - Captions, badges */
  --text-sm: 0.875rem;    /* 14px - Helper text, metadata */
  --text-base: 1rem;      /* 16px - Body text */
  --text-lg: 1.125rem;    /* 18px - Large body, intro text */
  --text-xl: 1.25rem;     /* 20px - H4, card titles */
  --text-2xl: 1.5rem;     /* 24px - H3, section headers */
  --text-3xl: 1.875rem;   /* 30px - H2, major sections */
  --text-4xl: 2.25rem;    /* 36px - H1, page titles */
  --text-5xl: 3rem;       /* 48px - Hero text */
}
```

### Font Weights

```css
:root {
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Line Heights

```css
:root {
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### Typography Presets

```css
/* Heading Styles */
.heading-1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: -0.025em;
}

.heading-2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

.heading-3 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

.heading-4 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

/* Body Styles */
.body-large {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
}

.body {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
}

.body-small {
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
}

/* Caption/Label Styles */
.caption {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  letter-spacing: 0.025em;
}

.label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
}
```

---

## Spacing

### Base Scale (8px grid)

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### Component Spacing

```css
:root {
  /* Card padding */
  --card-padding-sm: var(--space-4);
  --card-padding: var(--space-6);
  --card-padding-lg: var(--space-8);

  /* Section spacing */
  --section-gap: var(--space-8);
  --section-padding: var(--space-12);

  /* Content max-width */
  --content-max-width: 65ch;
  --content-max-width-wide: 80ch;
}
```

---

## Layout

### Container Widths

```css
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}
```

### Sidebar Dimensions

```css
:root {
  --sidebar-width: 280px;
  --sidebar-width-collapsed: 64px;
  --header-height: 64px;
}
```

### Z-Index Scale

```css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;
  --z-toast: 800;
}
```

---

## Borders & Shadows

### Border Radius

```css
:root {
  --radius-sm: 0.25rem;   /* 4px - Buttons, inputs */
  --radius-md: 0.375rem;  /* 6px - Cards, containers */
  --radius-lg: 0.5rem;    /* 8px - Modals, large cards */
  --radius-xl: 0.75rem;   /* 12px - Hero sections */
  --radius-2xl: 1rem;     /* 16px - Feature cards */
  --radius-full: 9999px;  /* Circular - Avatars, badges */
}
```

### Border Widths

```css
:root {
  --border-width: 1px;
  --border-width-2: 2px;
  --border-width-4: 4px;
}
```

### Shadows

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* Focus ring */
  --ring-width: 3px;
  --ring-color: var(--color-primary-500);
  --ring-offset: 2px;
}
```

---

## Motion & Animation

### Durations

```css
:root {
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;
}
```

### Easing Functions

```css
:root {
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Animation Presets

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Scale in */
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Pulse (for attention) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Spin (loading) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## Component Tokens

### Buttons

```css
:root {
  /* Primary button */
  --btn-primary-bg: var(--color-primary-600);
  --btn-primary-bg-hover: var(--color-primary-700);
  --btn-primary-text: white;

  /* Secondary button */
  --btn-secondary-bg: var(--color-bg-secondary);
  --btn-secondary-bg-hover: var(--color-bg-tertiary);
  --btn-secondary-text: var(--color-text-primary);
  --btn-secondary-border: var(--color-border-primary);

  /* Ghost button */
  --btn-ghost-bg: transparent;
  --btn-ghost-bg-hover: var(--color-bg-secondary);
  --btn-ghost-text: var(--color-text-secondary);

  /* Button sizing */
  --btn-height-sm: 32px;
  --btn-height: 40px;
  --btn-height-lg: 48px;
  --btn-padding-sm: var(--space-3);
  --btn-padding: var(--space-4);
  --btn-padding-lg: var(--space-6);
}
```

### Form Inputs

```css
:root {
  --input-bg: var(--color-bg-primary);
  --input-border: var(--color-border-primary);
  --input-border-focus: var(--color-primary-500);
  --input-text: var(--color-text-primary);
  --input-placeholder: var(--color-text-tertiary);
  --input-height: 40px;
  --input-padding: var(--space-3);
  --input-radius: var(--radius-md);
}
```

### Cards

```css
:root {
  --card-bg: var(--color-bg-primary);
  --card-border: var(--color-border-secondary);
  --card-radius: var(--radius-lg);
  --card-shadow: var(--shadow);
  --card-shadow-hover: var(--shadow-md);
}
```

### Progress Indicators

```css
:root {
  --progress-bg: var(--color-neutral-200);
  --progress-fill: var(--color-primary-500);
  --progress-height: 8px;
  --progress-radius: var(--radius-full);
}
```

---

## Responsive Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Tailwind-style media queries */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## Accessibility Tokens

### Focus States

```css
:root {
  --focus-ring: 0 0 0 var(--ring-width) var(--ring-color);
  --focus-ring-offset: 0 0 0 var(--ring-offset) var(--color-bg-primary);
}

/* Focus visible styles */
:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring-offset), var(--focus-ring);
}
```

### Color Contrast

All color combinations must meet WCAG AA standards:
- Normal text: 4.5:1 minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum
- UI components: 3:1 minimum

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Implementation Notes

### CSS Variables in Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          // ... etc
        },
        phase: {
          1: 'var(--color-phase-1)',
          2: 'var(--color-phase-2)',
          3: 'var(--color-phase-3)',
          4: 'var(--color-phase-4)',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      spacing: {
        // Use CSS variables for consistent spacing
      }
    }
  }
}
```

### Dark Mode Toggle

```javascript
// Toggle dark mode
function toggleDarkMode() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Initialize from preference
function initTheme() {
  const saved = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
}
```

---

## Token Export Formats

### CSS Custom Properties (Primary)

All tokens are defined as CSS custom properties in `:root` as shown above.

### JSON (For tooling)

```json
{
  "color": {
    "primary": {
      "500": { "value": "#3b82f6" }
    }
  },
  "spacing": {
    "4": { "value": "1rem" }
  }
}
```

### TypeScript Types

```typescript
type Phase = 1 | 2 | 3 | 4 | 'capstone';
type ColorScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

interface ThemeColors {
  primary: Record<ColorScale, string>;
  phase: Record<Phase, string>;
  // ... etc
}
```

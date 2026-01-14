# AI Analyst Academy - Development Guide

## Before You Start

**Always check [docs/PROGRESS.md](docs/PROGRESS.md) first.** It contains:
- Current implementation status for all features
- What's done, what's partial, what's not started
- Prioritized roadmap with dependencies
- Database tables and which are wired to UI

This prevents duplicate work and ensures you're building on the right foundation.

---

## Quick Verification

```bash
pnpm run check && pnpm run build && pnpm run dev
```

Test these routes for console errors:
- `/` — Landing page
- `/learn` — Curriculum overview
- `/learn/phase/1` — Phase overview
- `/learn/phase/1/1.1-economics-of-intelligence` — Module content
- `/learn/lab/lab-1-persona-stress-test` — Lab page

---

## Project Overview

AI Analyst Academy is a standalone interactive learning platform built with SvelteKit and Svelte 5. It delivers the AI Analyst curriculum through 6 phases, 24 modules, 12 labs, and a capstone project.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | SvelteKit 2.x + Svelte 5 (runes mode) |
| Styling | CSS custom properties (design tokens in `src/app.css`) |
| Database | Supabase PostgreSQL (schema ready, partial UI integration) |
| Auth | Supabase Auth (email/password enabled, OAuth ready) |
| Content | Markdown files processed at build time |

### Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── layout/       # Header, Sidebar, LearningLayout
│   │   ├── learning/     # ConceptCard, ExerciseBlock, ChecklistBlock, SectionNav
│   │   └── progress/     # ProgressRing, ProgressBar
│   ├── content/
│   │   ├── types.ts      # TypeScript interfaces for all content
│   │   └── loader.ts     # Content loading utilities
│   └── stores/           # Svelte stores (future)
├── routes/
│   ├── learn/
│   │   ├── phase/[phase]/           # Phase overview pages
│   │   │   └── [module]/            # Module content pages
│   │   └── lab/[slug]/              # Lab pages
│   └── +page.svelte                 # Landing page
└── app.css                          # Design tokens and global styles

content/
└── curriculum/
    ├── phases/           # Phase YAML + module markdown
    └── labs/             # Lab markdown files
```

---

## Svelte 5 Patterns (Critical)

This project uses Svelte 5 runes. Follow these patterns strictly to avoid runtime errors.

### Component Props — Pass Objects, Not Properties

Components define props with `$props()` and expect **whole objects**, not destructured properties.

```svelte
<script lang="ts">
  interface Props {
    item: ItemType;        // Expects the full object
    expanded?: boolean;
    onAction?: (id: string) => void;
  }

  let { item, expanded = false, onAction }: Props = $props();
</script>
```

**Usage:**

```svelte
<!-- CORRECT: Pass the whole object -->
{#each items as item}
  <ItemCard {item} onAction={handleAction} />
{/each}

<!-- WRONG: Don't destructure into individual props -->
{#each items as item}
  <ItemCard
    id={item.id}
    title={item.title}
    content={item.content}
  />
{/each}
```

### Reactive State with $state

```svelte
<script lang="ts">
  // Simple state
  let count = $state(0);

  // Set state (convert to array when passing to components)
  let selectedIds = $state<Set<string>>(new Set());
</script>

<!-- Convert Set to Array for components expecting arrays -->
<ComponentExpectingArray items={[...selectedIds]} />
```

### Effects with $effect — Avoiding Infinite Loops

**CRITICAL**: Effects that read AND write the same state cause infinite loops.

```svelte
<script lang="ts">
  import { untrack } from 'svelte';

  let expandedItems = $state<Set<string>>(new Set());
  let currentPath = $state('');

  // WRONG - Creates infinite loop
  $effect(() => {
    const shouldExpand = calculateFromPath(currentPath);
    if (shouldExpand && !expandedItems.has(shouldExpand)) {
      expandedItems = new Set([...expandedItems, shouldExpand]); // Reads AND writes!
    }
  });

  // CORRECT - Use untrack() to prevent reading from creating dependency
  $effect(() => {
    const shouldExpand = calculateFromPath(currentPath); // Only track this

    if (shouldExpand) {
      untrack(() => {
        if (!expandedItems.has(shouldExpand)) {
          expandedItems = new Set([...expandedItems, shouldExpand]);
        }
      });
    }
  });
</script>
```

### Derived State with $derived

```svelte
<script lang="ts">
  let items = $state<Item[]>([]);
  let filter = $state('');

  // Derived values are read-only and auto-update
  let filteredItems = $derived(
    items.filter(item => item.name.includes(filter))
  );

  // Complex derivations
  let stats = $derived.by(() => {
    const total = items.length;
    const completed = items.filter(i => i.done).length;
    return { total, completed, percentage: (completed / total) * 100 };
  });
</script>
```

---

## Component Interfaces

All learning components expect **object props** matching types from `$lib/content/types.ts`.

### Learning Components

| Component | Object Prop | Type | Notes |
|-----------|-------------|------|-------|
| `ConceptCard` | `concept` | `ConceptDefinition` | NOT individual `term`, `definition` |
| `ExerciseBlock` | `exercise` | `Exercise` | NOT individual `title`, `instructions` |
| `ChecklistBlock` | `checklist` | `Checklist` | NOT individual `items` |
| `SectionNav` | `sections` | `ContentSection[]` | `viewedSections` expects **Array**, not Set |

### Callback Props

| Component | Callback | Signature |
|-----------|----------|-----------|
| `ConceptCard` | `onToggleUnderstanding` | `(conceptId: string, understood: boolean) => void` |
| `ExerciseBlock` | `onToggleComplete` | `(exerciseId: string, completed: boolean) => void` |
| `ChecklistBlock` | `onToggleItem` | `(checklistId: string, itemId: string, completed: boolean) => void` |
| `SectionNav` | `onSectionClick` | `(sectionId: string) => void` |

### Usage Example (Module Page)

```svelte
<script lang="ts">
  let viewedSections = $state<Set<string>>(new Set());
  let conceptsUnderstood = $state<Set<string>>(new Set());

  function handleConceptToggle(conceptId: string, understood: boolean) {
    const next = new Set(conceptsUnderstood);
    if (understood) next.add(conceptId);
    else next.delete(conceptId);
    conceptsUnderstood = next;
  }
</script>

<!-- Convert Set to Array for SectionNav -->
<SectionNav
  sections={data.module.sections}
  activeSection={currentSectionId}
  viewedSections={[...viewedSections]}
  onSectionClick={handleSectionChange}
/>

<!-- Pass whole object for ConceptCard -->
{#each data.module.concepts as concept (concept.id)}
  <ConceptCard
    {concept}
    understood={conceptsUnderstood.has(concept.id)}
    onToggleUnderstanding={handleConceptToggle}
  />
{/each}
```

---

## CSS & Theming Standards

### Two-Tier Token Architecture

**Tier 1: Semantic Tokens (Always Use These)**

| Token | Purpose | Light | Dark |
|-------|---------|-------|------|
| `--color-bg-primary` | Main background | `#ffffff` | `neutral-950` |
| `--color-bg-secondary` | Cards, sidebars | `neutral-50` | `neutral-900` |
| `--color-bg-tertiary` | Hover states | `neutral-100` | `neutral-800` |
| `--color-text-primary` | Headings, body | `neutral-900` | `neutral-50` |
| `--color-text-secondary` | Descriptions | `neutral-600` | `neutral-300` |
| `--color-text-tertiary` | Placeholders | `neutral-500` | `neutral-400` |
| `--color-border-primary` | Card borders | `neutral-200` | `neutral-700` |
| `--color-border-secondary` | Subtle borders | `neutral-100` | `neutral-800` |

**Tier 2: Color Scales (Use Sparingly)**

Raw color scales (`--color-primary-500`, `--color-neutral-200`) should only be used for:
- Status indicators (success, warning, error)
- Phase colors (phase-1, phase-2, etc.)
- Progress indicators

### Anti-Patterns (Forbidden)

```css
/* FORBIDDEN: Component-level dark mode overrides */
[data-theme='dark'] .my-component {
  background: #1a1a1a;  /* Use semantic tokens instead */
}

/* FORBIDDEN: Raw hex colors */
.card {
  background: #ffffff;  /* Use var(--color-bg-primary) */
  color: #333;          /* Use var(--color-text-primary) */
}

/* FORBIDDEN: Magic numbers for spacing */
.section {
  padding: 24px;        /* Use var(--space-6) */
  margin-bottom: 16px;  /* Use var(--space-4) */
}
```

### Correct Patterns

```css
/* Use semantic tokens - auto-adapts to dark mode */
.card {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: var(--border-width) solid var(--color-border-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow);
}

.card:hover {
  box-shadow: var(--shadow-md);
}
```

### Phase Colors

```css
/* Phase-specific styling using CSS custom properties */
.phase-1 { --phase-color: var(--color-phase-1); }
.phase-2 { --phase-color: var(--color-phase-2); }
.phase-3 { --phase-color: var(--color-phase-3); }
.phase-4 { --phase-color: var(--color-phase-4); }

.phase-indicator {
  background-color: var(--phase-color);
}
```

---

## Content Types

All content types are defined in `src/lib/content/types.ts`:

```typescript
interface Module {
  id: string;
  title: string;
  description: string;
  phase: number;
  sections: ContentSection[];
  concepts: ConceptDefinition[];
  exercises: Exercise[];
  checklists: Checklist[];
}

interface ConceptDefinition {
  id: string;
  term: string;
  definition: string;
  htmlDefinition: string;
}

interface Exercise {
  id: string;
  title: string;
  type?: 'calculation' | 'analysis' | 'design' | 'practice' | 'reflection';
  scenario?: string;
  instructions: string;
  htmlInstructions: string;
}

interface ContentSection {
  id: string;
  title: string;
  type: 'why' | 'what' | 'how' | 'generic';
  content: string;
  htmlContent: string;
}
```

---

## Routes

> **Full status:** See [docs/PROGRESS.md](docs/PROGRESS.md) for complete implementation status.

### Core Routes (Production Ready)

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/learn` | Curriculum overview |
| `/learn/phase/[phase]` | Phase overview (1-4) |
| `/learn/phase/[phase]/[module]` | Module content |
| `/learn/lab/[slug]` | Lab pages |
| `/syllabus` | Course syllabus |
| `/auth/login`, `/auth/signup` | Authentication |
| `/settings`, `/settings/api-keys` | User settings, BYOK |

### Partial Implementation (UI exists, data integration pending)

| Route | Purpose | Status |
|-------|---------|--------|
| `/sandbox` | AI chat sandbox | Demo mode only |
| `/progress` | Progress dashboard | UI only, no persistence |
| `/portfolio` | User portfolio | UI only, no persistence |

### Not Started

| Route | Purpose |
|-------|---------|
| `/onboarding/*` | Role selection, goal setting |
| `/progress/review-queue` | Spaced repetition |
| `/portfolio/export` | PDF/HTML export |

---

## Code Review

See [docs/CODE_REVIEW.md](docs/CODE_REVIEW.md) for the full code review process.

### Quick Checklist

Before submitting code, verify:

### Svelte 5 Patterns
- [ ] Components receive **object props**, not destructured properties
- [ ] Sets converted to Arrays when passing to components: `[...mySet]`
- [ ] Effects use `untrack()` when reading AND writing same state
- [ ] Callback props use exact names from component interfaces

### CSS & Theming
- [ ] Uses semantic tokens (`--color-bg-primary`) not raw colors
- [ ] No component-level dark mode overrides
- [ ] Spacing uses design tokens (`--space-4`) not arbitrary values
- [ ] Interactive elements have focus ring styles

### TypeScript
- [ ] Props interfaces match component expectations
- [ ] No `any` types without explicit justification
- [ ] Types imported from `$lib/content/types.ts`

### Accessibility
- [ ] Interactive elements are keyboard accessible
- [ ] Focus states visible on all interactive elements
- [ ] ARIA labels on icon-only buttons
- [ ] Color contrast meets WCAG AA (4.5:1)

---

## Debugging Guide

### Console Errors and Their Causes

| Error | Likely Cause | Fix |
|-------|--------------|-----|
| `Cannot read properties of undefined (reading 'X')` | Component expects object prop, received individual properties | Pass whole object: `{concept}` not `term={concept.term}` |
| `X.includes is not a function` | Passed Set where Array expected | Convert: `{[...mySet]}` |
| `X.has is not a function` | Passed Array where Set expected | Ensure state is declared as Set |
| `effect_update_depth_exceeded` | Effect reads and writes same state | Use `untrack()` for write operation |
| Callback not firing | Prop name mismatch | Check exact prop name in component interface |

---

## Learning UX Design Principles (Critical)

This is a learning platform. All UI decisions must follow these research-backed principles.

### The Seven Principles

| Principle | Rule | Anti-Pattern |
|-----------|------|--------------|
| **Linear Flow** | Content scrolls top-to-bottom | Tabs for sequential content |
| **Visible Scope** | Learners see full module scope upfront | Hidden content, mystery progress |
| **Context Preservation** | Related content appears together | Concepts extracted to separate area |
| **Clear Sequencing** | WHY → WHAT → HOW is numbered | Equal-weight tabs implying "any order" |
| **Obvious Next Action** | "Continue" button at section end | No CTA after reading |
| **Meaningful Progress** | Progress = sections viewed + exercises done | Progress from time/views alone |
| **Respect the Skim** | Scannable headings, bold key terms | Walls of text without structure |

### Quick Decision Framework

Before building any learning UI, ask:
1. Can the learner scroll through this? (If no → reconsider)
2. Can they see what's ahead? (If no → add scope visibility)
3. Is related content together? (If no → inline it)
4. Is the sequence clear? (If no → add numbers)
5. Do they know what to do next? (If no → add CTA)

### Full Documentation

- [docs/LEARNING_UX_PRINCIPLES.md](docs/LEARNING_UX_PRINCIPLES.md) — Complete design principles
- [docs/architecture/learning-flow-architecture.md](docs/architecture/learning-flow-architecture.md) — Implementation patterns
- [docs/audits/ux-learning-flow-audit.md](docs/audits/ux-learning-flow-audit.md) — Original UX audit

---

## Documentation

### Start Here
- [docs/PROGRESS.md](docs/PROGRESS.md) — **Implementation status and roadmap (check first)**
- [docs/README.md](docs/README.md) — Documentation index

### Development
- [docs/DESIGN_TOKENS.md](docs/DESIGN_TOKENS.md) — Design token reference
- [docs/PATTERNS.md](docs/PATTERNS.md) — Comprehensive code patterns
- [docs/development/svelte5-patterns.md](docs/development/svelte5-patterns.md) — Svelte 5 patterns
- [docs/development/component-api.md](docs/development/component-api.md) — Component API reference

### Architecture
- [docs/design/sitemap.md](docs/design/sitemap.md) — Route structure with implementation status
- [docs/design/user-journeys.md](docs/design/user-journeys.md) — User flow requirements

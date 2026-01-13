# Learning Flow Architecture

This document defines the architectural patterns for implementing learning UX in AI Analyst Academy. These patterns ensure consistent, research-backed learning experiences across all routes.

---

## Core Architecture: Linear Content Flow

### Design Philosophy

Learning content follows a **scroll-first, click-second** architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRIMARY FLOW (Scroll)                       │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌────────┐ │
│  │   WHY    │ ──► │   WHAT   │ ──► │   HOW    │ ──► │  DONE  │ │
│  └──────────┘     └──────────┘     └──────────┘     └────────┘ │
│       │               │                │                │       │
│       ▼               ▼                ▼                ▼       │
│  [Concepts]      [Concepts]       [Exercises]      [Checklist] │
│                                                                 │
│  ════════════════════════════════════════════════════════════  │
│                     SECONDARY (Click)                          │
│              [Jump to Section] [Skip Ahead]                    │
└─────────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Default to scroll** — All content visible in document flow
2. **Progress via position** — Scroll position = learning progress
3. **Optional jumps** — Click navigation available but not required
4. **Inline everything** — Concepts, exercises where they're introduced

---

## Component Architecture

### Page Layout Pattern

```svelte
<!-- Learning page structure -->
<div class="learning-page">
  <!-- Sticky header with progress -->
  <header class="learning-header">
    <ModuleOverview {module} />
    <SectionProgress
      sections={module.sections}
      currentSection={visibleSection}
    />
  </header>

  <!-- Linear content flow -->
  <main class="learning-content">
    {#each module.sections as section, index}
      <section
        id="section-{section.id}"
        class="content-section"
        data-section-index={index}
      >
        <SectionHeader
          number={index + 1}
          total={module.sections.length}
          title={section.title}
          type={section.type}
        />

        <!-- Content with inline concepts -->
        <div class="section-content">
          {@html section.htmlContent}
        </div>

        <!-- Section-specific elements -->
        {#if section.type === 'how'}
          {#each getExercisesForSection(section.id) as exercise}
            <ExerciseBlock {exercise} />
          {/each}
        {/if}

        <!-- Continue button -->
        {#if index < module.sections.length - 1}
          <ContinueButton
            nextSection={module.sections[index + 1]}
            onClick={() => scrollToSection(index + 1)}
          />
        {/if}
      </section>
    {/each}

    <!-- Module completion -->
    <ModuleComplete
      checklist={module.checklist}
      nextModule={getNextModule()}
      prevModule={getPrevModule()}
    />
  </main>
</div>
```

### Component Hierarchy

```
LearningLayout
├── Header
│   └── GlobalProgress
│
├── Sidebar
│   ├── CurriculumNav
│   └── PhaseProgress
│
└── MainContent
    ├── ModuleOverview (scope visibility)
    ├── SectionProgress (sticky, scroll-aware)
    │
    ├── ContentSection (repeated)
    │   ├── SectionHeader (numbered, typed)
    │   ├── SectionContent (with inline concepts)
    │   ├── ExerciseBlock (in HOW section)
    │   └── ContinueButton
    │
    └── ModuleComplete
        ├── Checklist
        └── NavigationButtons
```

---

## State Management

### Scroll-Based Progress Tracking

```typescript
// src/lib/stores/learning-progress.svelte.ts

interface SectionProgress {
  sectionId: string;
  viewedAt: Date | null;
  scrollDepth: number; // 0-100
  completed: boolean;
}

interface ModuleProgress {
  moduleId: string;
  sections: Map<string, SectionProgress>;
  exercisesCompleted: Set<string>;
  checklistItems: Map<string, boolean>;
  startedAt: Date | null;
  completedAt: Date | null;
}

// Reactive state with Svelte 5 runes
let progress = $state<ModuleProgress>({...});

// Derived completion percentage
let completionPercentage = $derived.by(() => {
  const sections = Array.from(progress.sections.values());
  const viewed = sections.filter(s => s.completed).length;
  return Math.round((viewed / sections.length) * 100);
});
```

### Intersection Observer Pattern

```typescript
// Track visible section for progress indicator
function createSectionObserver(
  onSectionVisible: (sectionId: string) => void
) {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const sectionId = entry.target.getAttribute('data-section-id');
          if (sectionId) onSectionVisible(sectionId);
        }
      });
    },
    {
      threshold: [0.5],
      rootMargin: '-20% 0px -20% 0px' // Middle 60% of viewport
    }
  );
}
```

---

## Content Structure

### Section Types

| Type | Purpose | Content Pattern | Visual Treatment |
|------|---------|-----------------|------------------|
| `why` | Context & motivation | 1-2 paragraphs, real-world relevance | Opening section, bold intro |
| `what` | Core concepts | Key concepts inline, definitions | Concept cards highlighted |
| `how` | Application | Step-by-step, exercises | Exercise blocks, actionable |
| `summary` | Recap | Key takeaways, checklist | Completion section |

### Inline Content Rendering

Concepts appear **where introduced**, not extracted to a separate area:

```markdown
<!-- In markdown content -->
Understanding :::concept[tokens]{term="tokens" definition="..."} is
essential because they determine both cost and context limits.

The :::concept[context window]{term="context window" definition="..."}
defines how much information the model can process at once.
```

Rendered inline with the prose, not extracted below.

---

## Navigation Patterns

### Primary Navigation (Scroll)

- **Natural reading flow** — top to bottom
- **Section dividers** — clear visual breaks between WHY/WHAT/HOW
- **Continue buttons** — explicit "next" action at section end
- **Auto-progress** — scroll past 80% of section = viewed

### Secondary Navigation (Click)

- **Progress stepper** — sticky at top, shows current position
- **Jump to section** — click stepper nodes to jump
- **Sidebar** — always available for phase/module navigation
- **Keyboard** — PageDown/PageUp, arrow keys for section nav

### Progress Stepper Behavior

```
State: Reading WHAT section

┌─────────────────────────────────────────┐
│  ●━━━━━●━━━━━○━━━━━○                   │
│  WHY   WHAT  HOW   Done                 │
│  ✓     ●     ○     ○                    │
│ viewed active next  locked              │
└─────────────────────────────────────────┘

● Filled = viewed
━ Solid line = path completed
○ Empty = not yet viewed
● Active = currently visible (highlighted)
```

---

## Component Specifications

### SectionProgress (Sticky Progress Indicator)

**Purpose**: Show current position in WHY → WHAT → HOW flow

**Props**:
```typescript
interface SectionProgressProps {
  sections: ContentSection[];
  currentSection: string;        // Currently visible section ID
  viewedSections: string[];      // Array of viewed section IDs
  onSectionClick?: (id: string) => void;
}
```

**Behavior**:
- Sticky position at top of content area
- Updates as user scrolls through sections
- Click to jump to section
- Visual distinction: viewed, current, upcoming

### ContinueButton

**Purpose**: Explicit next action at end of each section

**Props**:
```typescript
interface ContinueButtonProps {
  nextSectionTitle: string;
  onClick: () => void;
}
```

**Behavior**:
- Appears at bottom of each section
- Smooth scroll to next section on click
- Primary visual weight (accent color)
- "Continue to [Section Name] →"

### ModuleOverview

**Purpose**: Show full scope before starting

**Props**:
```typescript
interface ModuleOverviewProps {
  module: {
    title: string;
    estimatedMinutes: number;
    sections: { title: string; type: string }[];
    conceptCount: number;
    exerciseCount: number;
  };
  phaseNumber: number;
  moduleIndex: number;
  totalModules: number;
}
```

**Content**:
- Phase X • Module Y of Z
- Estimated time
- Section preview (WHY, WHAT, HOW)
- Concept and exercise counts

---

## CSS Architecture

### Layout Tokens

```css
:root {
  /* Learning-specific layout */
  --learning-content-max-width: 720px;
  --learning-sidebar-width: 280px;
  --learning-header-height: 64px;
  --learning-progress-height: 56px;

  /* Section spacing */
  --section-gap: var(--space-16);
  --section-padding: var(--space-8);

  /* Sticky positioning */
  --sticky-top: calc(var(--learning-header-height) + var(--space-4));
}
```

### Section Styling

```css
.content-section {
  padding: var(--section-padding);
  margin-bottom: var(--section-gap);
  scroll-margin-top: var(--sticky-top);
}

.content-section:not(:last-child) {
  border-bottom: var(--border-width) solid var(--color-border-secondary);
}

/* Section type indicators */
.section-header[data-type="why"] {
  --section-accent: var(--color-info-500);
}

.section-header[data-type="what"] {
  --section-accent: var(--color-primary-500);
}

.section-header[data-type="how"] {
  --section-accent: var(--color-success-500);
}
```

---

## Implementation Checklist

### Phase 1: Core Flow

- [ ] Remove tabbed SectionNav from module pages
- [ ] Render all sections inline in scroll flow
- [ ] Add section dividers between WHY/WHAT/HOW
- [ ] Create ContinueButton component
- [ ] Add ContinueButton at end of each section

### Phase 2: Progress Tracking

- [ ] Create SectionProgress sticky component
- [ ] Implement IntersectionObserver for section visibility
- [ ] Update progress state on scroll
- [ ] Visual progress indicator (stepper dots)

### Phase 3: Scope Visibility

- [ ] Create ModuleOverview component
- [ ] Add at top of module pages
- [ ] Show sections, concepts, exercises, time

### Phase 4: Completion Flow

- [ ] Create ModuleComplete component
- [ ] Show checklist at module end
- [ ] Add prev/next module navigation
- [ ] Celebration state on completion

---

## Migration Guide

### From Tabbed to Linear

**Before (Tabbed)**:
```svelte
<SectionNav
  sections={module.sections}
  activeSection={currentSection}
  viewedSections={[...viewedSections]}
  onSectionClick={handleSectionChange}
/>

<div class="section-content">
  {#if activeSection}
    {@html getSectionContent(activeSection)}
  {/if}
</div>
```

**After (Linear)**:
```svelte
<SectionProgress
  sections={module.sections}
  currentSection={visibleSection}
  viewedSections={[...viewedSections]}
  onSectionClick={scrollToSection}
/>

<div class="sections-container">
  {#each module.sections as section, index}
    <section id="section-{section.id}" data-section-id={section.id}>
      <SectionHeader {section} number={index + 1} />
      {@html section.htmlContent}

      {#if index < module.sections.length - 1}
        <ContinueButton
          nextSectionTitle={module.sections[index + 1].title}
          onClick={() => scrollToSection(module.sections[index + 1].id)}
        />
      {/if}
    </section>
  {/each}
</div>
```

---

## References

- [Learning UX Principles](../LEARNING_UX_PRINCIPLES.md) — Design principles
- [UX Audit](../audits/ux-learning-flow-audit.md) — Original audit findings
- [Component API](../development/component-api.md) — Component documentation

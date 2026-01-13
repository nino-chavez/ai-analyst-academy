# Component API Reference

Complete API documentation for all reusable components in AI Operator Academy.

## Table of Contents

1. [Learning Components](#learning-components)
   - [ConceptCard](#conceptcard)
   - [ExerciseBlock](#exerciseblock)
   - [ChecklistBlock](#checklistblock)
   - [SectionNav](#sectionnav)
   - [ModuleContent](#modulecontent)
2. [Layout Components](#layout-components)
   - [Sidebar](#sidebar)
   - [Header](#header)
   - [LearningLayout](#learninglayout)
3. [Progress Components](#progress-components)
   - [ProgressRing](#progressring)
   - [ProgressBar](#progressbar)
4. [Type Definitions](#type-definitions)

---

## Learning Components

Located in `src/lib/components/learning/`

### ConceptCard

Displays a key concept/term definition with optional "mark as understood" functionality.

**Location:** `src/lib/components/learning/ConceptCard.svelte`

#### Props Interface

```typescript
interface Props {
  /** The concept to display (full object, NOT individual properties) */
  concept: ConceptDefinition;
  /** Whether the user has marked this concept as understood */
  understood?: boolean;
  /** Callback when understanding is toggled */
  onToggleUnderstanding?: (conceptId: string, understood: boolean) => void;
  /** Compact mode for inline display */
  compact?: boolean;
}
```

#### Props Table

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `concept` | `ConceptDefinition` | **Yes** | - | Full concept object with `id`, `term`, `definition`, `htmlDefinition` |
| `understood` | `boolean` | No | `false` | Whether marked as understood |
| `onToggleUnderstanding` | `(id, understood) => void` | No | - | Callback when toggled |
| `compact` | `boolean` | No | `false` | Compact inline display mode |

#### Example Usage

```svelte
<script lang="ts">
  import ConceptCard from '$lib/components/learning/ConceptCard.svelte';
  import type { ConceptDefinition } from '$lib/content/types';

  let conceptsUnderstood = $state<Set<string>>(new Set());

  function handleToggle(conceptId: string, understood: boolean) {
    const next = new Set(conceptsUnderstood);
    if (understood) next.add(conceptId);
    else next.delete(conceptId);
    conceptsUnderstood = next;
  }
</script>

{#each data.concepts as concept (concept.id)}
  <ConceptCard
    {concept}
    understood={conceptsUnderstood.has(concept.id)}
    onToggleUnderstanding={handleToggle}
  />
{/each}
```

#### Common Mistakes

```svelte
<!-- WRONG: Don't destructure the concept -->
<ConceptCard
  term={concept.term}
  definition={concept.definition}
  id={concept.id}
/>

<!-- CORRECT: Pass the whole object -->
<ConceptCard {concept} />
```

---

### ExerciseBlock

Displays a collapsible exercise with instructions and completion tracking.

**Location:** `src/lib/components/learning/ExerciseBlock.svelte`

#### Props Interface

```typescript
interface Props {
  /** The exercise to display (full object) */
  exercise: Exercise;
  /** Whether the exercise is marked complete */
  completed?: boolean;
  /** Callback when completion is toggled */
  onToggleComplete?: (exerciseId: string, completed: boolean) => void;
  /** Whether to show expanded content by default */
  expanded?: boolean;
}
```

#### Props Table

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `exercise` | `Exercise` | **Yes** | - | Full exercise object |
| `completed` | `boolean` | No | `false` | Whether marked complete |
| `onToggleComplete` | `(id, completed) => void` | No | - | Callback when completion toggled |
| `expanded` | `boolean` | No | `true` | Show expanded by default |

#### Example Usage

```svelte
<script lang="ts">
  import ExerciseBlock from '$lib/components/learning/ExerciseBlock.svelte';

  let exercisesCompleted = $state<Set<string>>(new Set());

  function handleComplete(exerciseId: string, completed: boolean) {
    const next = new Set(exercisesCompleted);
    if (completed) next.add(exerciseId);
    else next.delete(exerciseId);
    exercisesCompleted = next;
  }
</script>

{#each data.exercises as exercise (exercise.id)}
  <ExerciseBlock
    {exercise}
    completed={exercisesCompleted.has(exercise.id)}
    onToggleComplete={handleComplete}
  />
{/each}
```

---

### ChecklistBlock

Displays a progress checklist with individually toggleable items.

**Location:** `src/lib/components/learning/ChecklistBlock.svelte`

#### Props Interface

```typescript
interface Props {
  /** The checklist to display (full object) */
  checklist: Checklist;
  /** Map of item IDs to completion status */
  completedItems?: Record<string, boolean>;
  /** Callback when item is toggled */
  onToggleItem?: (checklistId: string, itemId: string, completed: boolean) => void;
}
```

#### Props Table

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `checklist` | `Checklist` | **Yes** | - | Full checklist object with `id` and `items` |
| `completedItems` | `Record<string, boolean>` | No | `{}` | Map of item IDs to completion status |
| `onToggleItem` | `(checklistId, itemId, completed) => void` | No | - | Callback when item toggled |

#### Example Usage

```svelte
<script lang="ts">
  import ChecklistBlock from '$lib/components/learning/ChecklistBlock.svelte';

  // State: checklistId -> { itemId -> completed }
  let checklistItems = $state<Record<string, Record<string, boolean>>>({});

  function handleToggle(checklistId: string, itemId: string, completed: boolean) {
    checklistItems = {
      ...checklistItems,
      [checklistId]: {
        ...checklistItems[checklistId],
        [itemId]: completed
      }
    };
  }
</script>

{#each data.checklists as checklist (checklist.id)}
  <ChecklistBlock
    {checklist}
    completedItems={checklistItems[checklist.id] || {}}
    onToggleItem={handleToggle}
  />
{/each}
```

---

### SectionNav

Navigation component for module sections (WHY/WHAT/HOW).

**Location:** `src/lib/components/learning/SectionNav.svelte`

#### Props Interface

```typescript
interface Props {
  /** Array of sections to display */
  sections: ContentSection[];
  /** ID of the currently active section */
  activeSection?: string;
  /** Array of section IDs that have been viewed (NOT a Set!) */
  viewedSections?: string[];
  /** Callback when section is clicked */
  onSectionClick?: (sectionId: string) => void;
}
```

#### Props Table

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `sections` | `ContentSection[]` | **Yes** | - | Array of sections |
| `activeSection` | `string` | No | - | Currently active section ID |
| `viewedSections` | `string[]` | No | `[]` | **Array** of viewed section IDs |
| `onSectionClick` | `(sectionId) => void` | No | - | Callback when section clicked |

#### Critical Note

**`viewedSections` expects an Array, NOT a Set.** Convert Sets using the spread operator.

#### Example Usage

```svelte
<script lang="ts">
  import SectionNav from '$lib/components/learning/SectionNav.svelte';

  let viewedSections = $state<Set<string>>(new Set());
  let currentSectionId = $state<string | null>(null);

  function handleSectionChange(sectionId: string) {
    currentSectionId = sectionId;
    viewedSections = new Set([...viewedSections, sectionId]);
  }
</script>

<SectionNav
  sections={data.module.sections}
  activeSection={currentSectionId || ''}
  viewedSections={[...viewedSections]}
  onSectionClick={handleSectionChange}
/>
```

#### Common Mistakes

```svelte
<!-- WRONG: Passing Set directly -->
<SectionNav viewedSections={viewedSections} />

<!-- CORRECT: Convert Set to Array -->
<SectionNav viewedSections={[...viewedSections]} />

<!-- WRONG: Using wrong callback name -->
<SectionNav onSectionChange={handleChange} />

<!-- CORRECT: Use exact prop name -->
<SectionNav onSectionClick={handleChange} />
```

---

### ModuleContent

Full module content renderer with integrated learning components.

**Location:** `src/lib/components/learning/ModuleContent.svelte`

#### Props Interface

```typescript
interface Props {
  /** Full module object with all content */
  module: Module;
  /** Current progress state */
  progress?: ModuleProgress;
  /** Callback for progress changes */
  onProgressUpdate?: (progress: Partial<ModuleProgress>) => void;
}
```

#### Props Table

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `module` | `Module` | **Yes** | - | Full module with sections, concepts, exercises |
| `progress` | `ModuleProgress` | No | - | Current progress state |
| `onProgressUpdate` | `(progress) => void` | No | - | Callback for progress changes |

---

## Layout Components

Located in `src/lib/components/layout/`

### Sidebar

Curriculum navigation sidebar with collapsible phases.

**Location:** `src/lib/components/layout/Sidebar.svelte`

#### Props Interface

```typescript
interface Props {
  /** Navigation items to display */
  navigation: NavigationItem[];
  /** Current active path */
  currentPath?: string;
  /** Whether sidebar is open (mobile) */
  isOpen?: boolean;
  /** Progress by phase ID */
  phaseProgress?: Record<string, number>;
  /** Module completion status by module ID */
  moduleCompletion?: Record<string, boolean>;
  /** Callback to close sidebar */
  onClose?: () => void;
}
```

#### Props Table

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `navigation` | `NavigationItem[]` | **Yes** | - | Navigation structure |
| `currentPath` | `string` | No | `''` | Current route for active state |
| `isOpen` | `boolean` | No | `true` | Sidebar open state (mobile) |
| `phaseProgress` | `Record<string, number>` | No | `{}` | Progress % by phase ID |
| `moduleCompletion` | `Record<string, boolean>` | No | `{}` | Completion by module ID |
| `onClose` | `() => void` | No | - | Close callback |

#### Note

The sidebar auto-expands the phase containing the active route. This uses `untrack()` internally to prevent infinite effect loops.

---

### Header

Top navigation header with theme toggle and user menu.

**Location:** `src/lib/components/layout/Header.svelte`

#### Props Interface

```typescript
interface Props {
  /** Callback when mobile menu is toggled */
  onMenuToggle?: () => void;
}
```

---

### LearningLayout

Main layout wrapper combining Header, Sidebar, and content area.

**Location:** `src/lib/components/layout/LearningLayout.svelte`

#### Props Interface

```typescript
interface Props {
  /** Navigation structure (passed to Sidebar) */
  navigation: NavigationItem[];
  /** Current route path */
  currentPath?: string;
}
```

#### Slots

- **Default slot**: Main content area

#### Example Usage

```svelte
<LearningLayout {navigation} {currentPath}>
  <h1>Module Title</h1>
  <p>Module content goes here...</p>
</LearningLayout>
```

---

## Progress Components

Located in `src/lib/components/progress/`

### ProgressRing

Circular progress indicator.

**Location:** `src/lib/components/progress/ProgressRing.svelte`

#### Props Interface

```typescript
interface Props {
  /** Progress value (0-100) */
  value: number;
  /** Diameter in pixels */
  size?: number;
  /** Ring stroke width */
  strokeWidth?: number;
  /** Ring color */
  color?: string;
  /** Show percentage text */
  showValue?: boolean;
}
```

#### Props Table

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `number` | **Yes** | - | Progress 0-100 |
| `size` | `number` | No | `48` | Diameter in px |
| `strokeWidth` | `number` | No | `4` | Ring stroke width |
| `color` | `string` | No | `var(--color-primary-500)` | Ring color |
| `showValue` | `boolean` | No | `true` | Show % text |

#### Example Usage

```svelte
<ProgressRing value={75} size={64} color="var(--color-phase-1)" />
```

---

### ProgressBar

Linear progress bar.

**Location:** `src/lib/components/progress/ProgressBar.svelte`

#### Props Interface

```typescript
interface Props {
  /** Progress value (0-100) */
  value: number;
  /** Bar color */
  color?: string;
  /** Bar height in pixels */
  height?: number;
  /** Show percentage label */
  showLabel?: boolean;
}
```

#### Props Table

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `number` | **Yes** | - | Progress 0-100 |
| `color` | `string` | No | `var(--color-primary-500)` | Bar color |
| `height` | `number` | No | `8` | Height in px |
| `showLabel` | `boolean` | No | `false` | Show % label |

---

## Type Definitions

All types are defined in `src/lib/content/types.ts`.

### Content Types

```typescript
interface Module {
  id: string;
  title: string;
  description: string;
  phase: number;
  order: number;
  sections: ContentSection[];
  concepts: ConceptDefinition[];
  exercises: Exercise[];
  checklists: Checklist[];
}

interface ContentSection {
  id: string;
  title: string;
  type: 'why' | 'what' | 'how' | 'generic';
  content: string;
  htmlContent: string;
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

interface Checklist {
  id: string;
  items: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}
```

### Navigation Types

```typescript
interface NavigationItem {
  id: string;
  title: string;
  href: string;
  type: 'phase' | 'module' | 'lab' | 'capstone';
  phase?: number;
  children?: NavigationItem[];
}
```

### Progress Types

```typescript
interface ModuleProgress {
  viewedSections: string[];
  understoodConcepts: string[];
  completedExercises: string[];
  checklistItems: Record<string, Record<string, boolean>>;
}
```

---

## Quick Reference: Common Mistakes

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot read properties of undefined (reading 'term')` | Passing individual props instead of object | Use `{concept}` not `term={concept.term}` |
| `viewedSections.includes is not a function` | Passing Set instead of Array | Use `[...viewedSections]` |
| Callback not firing | Wrong prop name | Use exact name: `onSectionClick` not `onSectionChange` |
| `effect_update_depth_exceeded` | Effect reads and writes same state | Use `untrack()` in Sidebar |

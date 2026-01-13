# Code Patterns Reference

Comprehensive patterns and anti-patterns for AI Analyst Academy development.

## Table of Contents

1. [Svelte 5 Runes](#svelte-5-runes)
2. [Component Patterns](#component-patterns)
3. [State Management](#state-management)
4. [SvelteKit Patterns](#sveltekit-patterns)
5. [TypeScript Patterns](#typescript-patterns)
6. [CSS Patterns](#css-patterns)
7. [Form Handling](#form-handling)
8. [Error Handling](#error-handling)
9. [Accessibility Patterns](#accessibility-patterns)
10. [Anti-Patterns](#anti-patterns)

---

## Svelte 5 Runes

### $state — Reactive State

```svelte
<script lang="ts">
  // Primitive state
  let count = $state(0);
  let name = $state('');

  // Object state
  let user = $state({ name: '', email: '' });

  // Array state
  let items = $state<Item[]>([]);

  // Set state
  let selected = $state<Set<string>>(new Set());

  // Map state
  let cache = $state<Map<string, Data>>(new Map());
</script>
```

### $derived — Computed Values

```svelte
<script lang="ts">
  let items = $state<Item[]>([]);
  let filter = $state('');

  // Simple derived
  let itemCount = $derived(items.length);

  // Filtered derived
  let filteredItems = $derived(
    items.filter(item => item.name.includes(filter))
  );

  // Complex derived with $derived.by
  let stats = $derived.by(() => {
    const total = items.length;
    const completed = items.filter(i => i.done).length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, percentage };
  });
</script>
```

### $effect — Side Effects

```svelte
<script lang="ts">
  import { untrack } from 'svelte';

  let value = $state('');

  // Basic effect - runs when dependencies change
  $effect(() => {
    console.log('Value changed:', value);
  });

  // Effect with cleanup
  $effect(() => {
    const handler = () => console.log('resize');
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
  });

  // CRITICAL: Avoiding infinite loops with untrack()
  let expandedItems = $state<Set<string>>(new Set());
  let currentPath = $state('');

  $effect(() => {
    // Only track currentPath, not expandedItems
    const shouldExpand = getActiveItem(currentPath);

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

### $props — Component Props

```svelte
<script lang="ts">
  interface Props {
    /** Required prop */
    item: ItemType;
    /** Optional with default */
    expanded?: boolean;
    /** Callback prop */
    onAction?: (id: string) => void;
    /** Rest props */
    class?: string;
  }

  let {
    item,
    expanded = false,
    onAction,
    class: className = ''
  }: Props = $props();
</script>
```

### $bindable — Two-Way Binding Props

```svelte
<script lang="ts">
  interface Props {
    value: string;
  }

  let { value = $bindable() }: Props = $props();
</script>

<!-- Usage -->
<Input bind:value={myValue} />
```

---

## Component Patterns

### Object Props Pattern

Components should accept whole objects, not destructured properties.

```svelte
<!-- Component definition -->
<script lang="ts">
  interface Props {
    concept: ConceptDefinition;  // NOT term, definition, etc.
    understood?: boolean;
    onToggle?: (id: string, understood: boolean) => void;
  }

  let { concept, understood = false, onToggle }: Props = $props();
</script>

<div class="concept-card">
  <h3>{concept.term}</h3>
  <p>{@html concept.htmlDefinition}</p>
</div>
```

```svelte
<!-- Usage -->
{#each concepts as concept (concept.id)}
  <ConceptCard
    {concept}
    understood={understoodSet.has(concept.id)}
    onToggle={handleToggle}
  />
{/each}
```

### Callback Props Naming

Use `on[Action]` pattern for callbacks:

| Component | Callback | Signature |
|-----------|----------|-----------|
| `ConceptCard` | `onToggleUnderstanding` | `(id, understood) => void` |
| `ExerciseBlock` | `onToggleComplete` | `(id, completed) => void` |
| `ChecklistBlock` | `onToggleItem` | `(checklistId, itemId, completed) => void` |
| `SectionNav` | `onSectionClick` | `(sectionId) => void` |

### Set to Array Conversion

Components often expect arrays, but Sets are more efficient for state:

```svelte
<script lang="ts">
  // State as Set for O(1) operations
  let selectedIds = $state<Set<string>>(new Set());

  function toggle(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    selectedIds = next;
  }
</script>

<!-- Convert to array when passing to component -->
<SelectionList items={[...selectedIds]} />
```

### Snippet Pattern

For reusable template fragments:

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    items: Item[];
    itemTemplate?: Snippet<[Item]>;
    emptyTemplate?: Snippet;
  }

  let { items, itemTemplate, emptyTemplate }: Props = $props();
</script>

{#if items.length === 0}
  {#if emptyTemplate}
    {@render emptyTemplate()}
  {:else}
    <p>No items</p>
  {/if}
{:else}
  {#each items as item}
    {#if itemTemplate}
      {@render itemTemplate(item)}
    {:else}
      <div>{item.name}</div>
    {/if}
  {/each}
{/if}
```

---

## State Management

### Local Component State

```svelte
<script lang="ts">
  // Simple state
  let isOpen = $state(false);

  // Complex state object
  let formState = $state({
    values: { name: '', email: '' },
    errors: {} as Record<string, string>,
    isSubmitting: false
  });

  function updateField(field: string, value: string) {
    formState.values[field] = value;
    formState.errors[field] = '';
  }
</script>
```

### Shared State with Context

```svelte
<!-- Provider.svelte -->
<script lang="ts">
  import { setContext } from 'svelte';

  interface ProgressState {
    viewedSections: Set<string>;
    completedExercises: Set<string>;
    markViewed: (id: string) => void;
  }

  let viewedSections = $state<Set<string>>(new Set());
  let completedExercises = $state<Set<string>>(new Set());

  const state: ProgressState = {
    get viewedSections() { return viewedSections; },
    get completedExercises() { return completedExercises; },
    markViewed(id: string) {
      viewedSections = new Set([...viewedSections, id]);
    }
  };

  setContext('progress', state);
</script>

<!-- Consumer.svelte -->
<script lang="ts">
  import { getContext } from 'svelte';

  const progress = getContext<ProgressState>('progress');
</script>
```

### URL State with SvelteKit

```svelte
<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  // Read from URL
  let currentPhase = $derived(page.url.searchParams.get('phase') ?? '1');

  // Update URL
  function setPhase(phase: string) {
    const url = new URL(page.url);
    url.searchParams.set('phase', phase);
    goto(url.toString(), { replaceState: true });
  }
</script>
```

---

## SvelteKit Patterns

### Page Data Loading

```typescript
// +page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const module = await loadModule(params.module);

  if (!module) {
    throw error(404, 'Module not found');
  }

  return { module };
};
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<h1>{data.module.title}</h1>
```

### Layout Data

```typescript
// +layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  const navigation = await buildNavigation();
  return { navigation };
};
```

```svelte
<!-- +layout.svelte -->
<script lang="ts">
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<Sidebar navigation={data.navigation} />
<main>
  {@render children()}
</main>
```

### Form Actions

```typescript
// +page.server.ts
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name');

    if (!name || typeof name !== 'string') {
      return fail(400, { error: 'Name is required' });
    }

    await saveData({ name });
    return { success: true };
  }
};
```

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
</script>

<form method="POST" use:enhance>
  <input name="name" required />
  <button type="submit">Save</button>
</form>
```

### Error Pages

```svelte
<!-- +error.svelte -->
<script lang="ts">
  import { page } from '$app/state';
</script>

<h1>{page.status}</h1>
<p>{page.error?.message}</p>
```

---

## TypeScript Patterns

### Content Types

```typescript
// src/lib/content/types.ts

export interface Module {
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

export interface ContentSection {
  id: string;
  title: string;
  type: 'why' | 'what' | 'how' | 'generic';
  content: string;
  htmlContent: string;
}

export interface ConceptDefinition {
  id: string;
  term: string;
  definition: string;
  htmlDefinition: string;
}

export interface Exercise {
  id: string;
  title: string;
  type?: ExerciseType;
  scenario?: string;
  instructions: string;
  htmlInstructions: string;
}

export type ExerciseType =
  | 'calculation'
  | 'analysis'
  | 'design'
  | 'practice'
  | 'reflection';
```

### Generic Utility Types

```typescript
// Record for key-value maps
type CompletionMap = Record<string, boolean>;

// Partial for optional updates
function updateModule(id: string, updates: Partial<Module>) { ... }

// Pick for subsets
type ModuleSummary = Pick<Module, 'id' | 'title' | 'description'>;

// Omit for exclusions
type ModuleInput = Omit<Module, 'id' | 'htmlContent'>;
```

### Type Guards

```typescript
function isModule(item: unknown): item is Module {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'title' in item &&
    'sections' in item
  );
}

// Usage
if (isModule(data)) {
  console.log(data.title); // TypeScript knows it's a Module
}
```

---

## CSS Patterns

### Semantic Token Usage

```css
/* Always use semantic tokens */
.card {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: var(--border-width) solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-2);
}

.card-description {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}
```

### Phase Color Pattern

```css
/* Set phase color via class */
.phase-1 { --phase-color: var(--color-phase-1); --phase-light: var(--color-phase-1-light); }
.phase-2 { --phase-color: var(--color-phase-2); --phase-light: var(--color-phase-2-light); }
.phase-3 { --phase-color: var(--color-phase-3); --phase-light: var(--color-phase-3-light); }
.phase-4 { --phase-color: var(--color-phase-4); --phase-light: var(--color-phase-4-light); }

/* Then use the variable */
.phase-badge {
  background-color: var(--phase-light);
  color: var(--phase-color);
  border: 1px solid var(--phase-color);
}

.phase-indicator {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: var(--phase-color);
}
```

### Interactive States

```css
/* Button with lift effect */
.btn-lift {
  transition: all var(--duration-200) var(--ease-out);
}

.btn-lift:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-lift:active {
  transform: translateY(0);
}

/* Primary button with glow */
.btn-primary:hover {
  box-shadow: var(--shadow-primary);
}

/* Card hover lift */
.card-interactive {
  cursor: pointer;
  transition: all var(--duration-200) var(--ease-out);
}

.card-interactive:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

### Focus Ring Pattern

```css
/* Consistent focus rings */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: var(--ring-offset);
}

/* Inset focus for inputs */
input:focus-visible,
textarea:focus-visible {
  outline-offset: 0;
  box-shadow: 0 0 0 3px var(--color-primary-100);
  border-color: var(--color-primary-500);
}
```

### Animation Stagger

```css
/* Stagger animation delays */
.stagger-children > *:nth-child(1) { animation-delay: 50ms; }
.stagger-children > *:nth-child(2) { animation-delay: 100ms; }
.stagger-children > *:nth-child(3) { animation-delay: 150ms; }
.stagger-children > *:nth-child(4) { animation-delay: 200ms; }
.stagger-children > *:nth-child(5) { animation-delay: 250ms; }

/* Usage */
<ul class="stagger-children">
  {#each items as item}
    <li class="animate-slide-up">{item.name}</li>
  {/each}
</ul>
```

---

## Form Handling

### Basic Form Pattern

```svelte
<script lang="ts">
  let formState = $state({
    values: { name: '', email: '' },
    errors: {} as Record<string, string>,
    isSubmitting: false
  });

  function validate() {
    const errors: Record<string, string> = {};

    if (!formState.values.name) {
      errors.name = 'Name is required';
    }

    if (!formState.values.email) {
      errors.email = 'Email is required';
    } else if (!formState.values.email.includes('@')) {
      errors.email = 'Invalid email';
    }

    formState.errors = errors;
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    formState.isSubmitting = true;

    try {
      await submitForm(formState.values);
    } catch (e) {
      formState.errors.form = 'Submission failed';
    } finally {
      formState.isSubmitting = false;
    }
  }
</script>

<form onsubmit|preventDefault={handleSubmit}>
  <div class="form-group">
    <label for="name">Name</label>
    <input
      id="name"
      bind:value={formState.values.name}
      class:error={formState.errors.name}
    />
    {#if formState.errors.name}
      <span class="error-message">{formState.errors.name}</span>
    {/if}
  </div>

  <button type="submit" disabled={formState.isSubmitting}>
    {formState.isSubmitting ? 'Saving...' : 'Save'}
  </button>
</form>
```

### Form Input Styling

```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.form-input {
  height: var(--input-height);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: all var(--duration-150) var(--ease-out);
}

.form-input:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
  outline: none;
}

.form-input.error {
  border-color: var(--color-error-500);
}

.error-message {
  font-size: var(--text-sm);
  color: var(--color-error-600);
}
```

---

## Error Handling

### Try-Catch Pattern

```typescript
async function loadModule(id: string): Promise<Module | null> {
  try {
    const response = await fetch(`/api/modules/${id}`);

    if (!response.ok) {
      console.error(`Failed to load module: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading module:', error);
    return null;
  }
}
```

### Error Boundary Pattern

```svelte
<!-- ErrorBoundary.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    fallback?: Snippet<[Error]>;
  }

  let { children, fallback }: Props = $props();
  let error = $state<Error | null>(null);

  // Reset error on retry
  function reset() {
    error = null;
  }
</script>

{#if error && fallback}
  {@render fallback(error)}
{:else}
  {@render children()}
{/if}
```

### SvelteKit Error Handling

```typescript
// In +page.server.ts
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
  const module = await loadModule(params.id);

  if (!module) {
    throw error(404, {
      message: 'Module not found',
      code: 'MODULE_NOT_FOUND'
    });
  }

  if (!module.published) {
    throw redirect(303, '/learn');
  }

  return { module };
};
```

---

## Accessibility Patterns

### Keyboard Navigation

```svelte
<script lang="ts">
  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusNext();
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusPrevious();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectCurrent();
        break;
      case 'Escape':
        close();
        break;
    }
  }
</script>

<div
  role="listbox"
  tabindex="0"
  onkeydown={handleKeyDown}
>
  {#each options as option}
    <div
      role="option"
      aria-selected={selected === option.id}
    >
      {option.label}
    </div>
  {/each}
</div>
```

### ARIA Attributes

```svelte
<!-- Expandable section -->
<button
  aria-expanded={isOpen}
  aria-controls="section-content"
  onclick={() => isOpen = !isOpen}
>
  {title}
</button>
<div
  id="section-content"
  aria-hidden={!isOpen}
>
  {content}
</div>

<!-- Progress indicator -->
<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Module progress"
>
  {progress}%
</div>

<!-- Navigation -->
<nav aria-label="Curriculum navigation">
  <ul>...</ul>
</nav>
```

### Screen Reader Only Text

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

```svelte
<button aria-label="Close menu">
  <svg>...</svg>
  <span class="sr-only">Close menu</span>
</button>
```

---

## Anti-Patterns

### ❌ Destructuring Object Props

```svelte
<!-- WRONG: Passing individual properties -->
<ConceptCard
  term={concept.term}
  definition={concept.definition}
  id={concept.id}
/>
```

```svelte
<!-- CORRECT: Pass the whole object -->
<ConceptCard {concept} />
```

### ❌ Passing Set Where Array Expected

```svelte
<!-- WRONG: Component expects array -->
<SectionNav viewedSections={viewedSections} />
```

```svelte
<!-- CORRECT: Convert Set to Array -->
<SectionNav viewedSections={[...viewedSections]} />
```

### ❌ Reading and Writing Same State in Effect

```svelte
<!-- WRONG: Creates infinite loop -->
$effect(() => {
  if (!expandedItems.has(activeId)) {
    expandedItems = new Set([...expandedItems, activeId]);
  }
});
```

```svelte
<!-- CORRECT: Use untrack() -->
$effect(() => {
  const activeId = getActiveId(currentPath);
  untrack(() => {
    if (!expandedItems.has(activeId)) {
      expandedItems = new Set([...expandedItems, activeId]);
    }
  });
});
```

### ❌ Wrong Callback Prop Name

```svelte
<!-- WRONG: Using incorrect prop name -->
<SectionNav onSectionChange={handleChange} />
```

```svelte
<!-- CORRECT: Match exact prop name -->
<SectionNav onSectionClick={handleChange} />
```

### ❌ Component-Level Dark Mode

```css
/* WRONG: Scattered dark mode overrides */
[data-theme='dark'] .my-card {
  background: #1a1a1a;
}
```

```css
/* CORRECT: Use semantic tokens */
.my-card {
  background-color: var(--color-bg-secondary);
}
```

### ❌ Hardcoded Values

```css
/* WRONG: Magic numbers */
.section {
  padding: 24px;
  margin: 16px;
  border-radius: 8px;
  color: #333;
}
```

```css
/* CORRECT: Use tokens */
.section {
  padding: var(--space-6);
  margin: var(--space-4);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
}
```

### ❌ Missing Type Safety

```typescript
// WRONG: Using any
function processData(data: any) {
  return data.items.map((i: any) => i.name);
}
```

```typescript
// CORRECT: Proper types
function processData(data: { items: Item[] }) {
  return data.items.map(i => i.name);
}
```

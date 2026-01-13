# Svelte 5 Patterns for AI Operator Academy

This document captures Svelte 5-specific patterns and pitfalls discovered during development. These patterns prevent common runtime errors and ensure consistent component usage.

## Table of Contents

1. [Component Props Pattern](#component-props-pattern)
2. [State Management with Sets](#state-management-with-sets)
3. [Effect Dependencies and Infinite Loops](#effect-dependencies-and-infinite-loops)
4. [Callback Props Convention](#callback-props-convention)

---

## Component Props Pattern

### Problem

In Svelte 5, components define their props using the `$props()` rune with a TypeScript interface. A common mistake is destructuring data when passing it to components instead of passing the whole object.

### Example: ConceptCard

**Component Interface:**
```typescript
interface Props {
  concept: ConceptDefinition;  // Expects the full object
  understood?: boolean;
  onToggleUnderstanding?: (conceptId: string, understood: boolean) => void;
}
```

**Incorrect Usage:**
```svelte
<!-- This will cause "Cannot read properties of undefined (reading 'term')" -->
{#each concepts as concept}
  <ConceptCard
    term={concept.term}
    definition={concept.definition}
    id={concept.id}
  />
{/each}
```

**Correct Usage:**
```svelte
{#each concepts as concept}
  <ConceptCard
    {concept}
    understood={conceptsUnderstood.has(concept.id)}
    onToggleUnderstanding={handleToggle}
  />
{/each}
```

### Why This Matters

The component expects `props.concept.term`, not `props.term`. Passing individual properties means `props.concept` is undefined, causing runtime errors.

### Learning Components Affected

| Component | Expected Prop | Type |
|-----------|--------------|------|
| `ConceptCard` | `concept` | `ConceptDefinition` |
| `ExerciseBlock` | `exercise` | `Exercise` |
| `ChecklistBlock` | `checklist` | `Checklist` |
| `SectionNav` | `sections` | `ContentSection[]` |

---

## State Management with Sets

### Problem

Svelte 5's `$state` works great with Sets for tracking unique items (like viewed sections or completed exercises). However, many components expect arrays, not Sets.

### Example: viewedSections

**State Declaration:**
```svelte
<script lang="ts">
  // Using Set for efficient add/delete/has operations
  let viewedSections = $state<Set<string>>(new Set());
</script>
```

**Incorrect Usage:**
```svelte
<!-- SectionNav expects string[], not Set<string> -->
<!-- This causes "viewedSections.includes is not a function" -->
<SectionNav
  sections={sections}
  viewedSections={viewedSections}
/>
```

**Correct Usage:**
```svelte
<!-- Convert Set to Array using spread operator -->
<SectionNav
  sections={sections}
  viewedSections={[...viewedSections]}
/>
```

### Pattern: Set for State, Array for Props

```svelte
<script lang="ts">
  // Internal state: Use Set for O(1) operations
  let selectedIds = $state<Set<string>>(new Set());

  function toggleSelection(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    selectedIds = next;
  }
</script>

<!-- External props: Convert to Array -->
<SelectionDisplay items={[...selectedIds]} />
```

---

## Effect Dependencies and Infinite Loops

### Problem

The `$effect` rune automatically tracks all reactive values read inside it. If an effect both reads and writes the same state, it creates an infinite loop (`effect_update_depth_exceeded`).

### Example: Auto-expanding Sidebar

**Problematic Code:**
```svelte
<script lang="ts">
  let expandedPhases = $state<Set<string>>(new Set());
  let currentPath = $state('');

  // INFINITE LOOP: reads expandedPhases (via .has()) and writes to it
  $effect(() => {
    const activePhase = findActivePhase(currentPath);
    if (activePhase && !expandedPhases.has(activePhase)) {
      expandedPhases = new Set([...expandedPhases, activePhase]);
    }
  });
</script>
```

**Why It Loops:**
1. Effect runs, reads `currentPath` and `expandedPhases`
2. Effect writes to `expandedPhases`
3. Svelte detects `expandedPhases` changed
4. Effect re-runs (because it depends on `expandedPhases`)
5. Goto step 2...

### Solution: Use `untrack()`

```svelte
<script lang="ts">
  import { untrack } from 'svelte';

  let expandedPhases = $state<Set<string>>(new Set());
  let currentPath = $state('');

  $effect(() => {
    // Only track currentPath and navigation
    const activePhase = findActivePhase(currentPath);

    if (activePhase) {
      // untrack() prevents reading expandedPhases from creating a dependency
      untrack(() => {
        if (!expandedPhases.has(activePhase)) {
          expandedPhases = new Set([...expandedPhases, activePhase]);
        }
      });
    }
  });
</script>
```

### When to Use `untrack()`

Use `untrack()` when:
- Effect needs to conditionally update state based on that state's current value
- You want to read a value without subscribing to its changes
- Breaking a read-modify-write cycle

### Alternative: Separate Read and Write Effects

```svelte
<script lang="ts">
  let activePhase = $derived(findActivePhase(currentPath));

  $effect(() => {
    // Now only depends on activePhase, not expandedPhases
    if (activePhase && !expandedPhases.has(activePhase)) {
      expandedPhases = new Set([...expandedPhases, activePhase]);
    }
  });
</script>
```

**Note:** This alternative still has the issue if `expandedPhases.has()` is called. The `untrack()` solution is more explicit.

---

## Callback Props Convention

### Problem

Inconsistent naming of callback props between component definition and usage causes silent failures (callbacks simply don't fire).

### Convention

All callback props follow the pattern `on[Action]`:

| Component | Callback Prop | Signature |
|-----------|--------------|-----------|
| `ConceptCard` | `onToggleUnderstanding` | `(conceptId: string, understood: boolean) => void` |
| `ExerciseBlock` | `onToggleComplete` | `(exerciseId: string, completed: boolean) => void` |
| `ChecklistBlock` | `onToggleItem` | `(checklistId: string, itemId: string, completed: boolean) => void` |
| `SectionNav` | `onSectionClick` | `(sectionId: string) => void` |

### Incorrect vs Correct

```svelte
<!-- WRONG: Using different prop name -->
<SectionNav
  sections={sections}
  onSectionChange={handleChange}
/>

<!-- CORRECT: Match exact prop name from interface -->
<SectionNav
  sections={sections}
  onSectionClick={handleChange}
/>
```

---

## Checklist for New Components

When creating or modifying components:

1. [ ] Define clear `interface Props` with JSDoc comments
2. [ ] Use object props for complex data (not individual properties)
3. [ ] Document whether array or Set is expected
4. [ ] Use `on[Action]` naming for callbacks
5. [ ] Test effects for infinite loops by checking console for `effect_update_depth_exceeded`
6. [ ] Use `untrack()` if effect needs to read-modify-write same state

---

## Debugging Tips

### Console Errors and Their Causes

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `Cannot read properties of undefined (reading 'X')` | Component expects object prop, received individual properties | Pass whole object: `{concept}` not `term={concept.term}` |
| `X.includes is not a function` | Passed Set where Array expected | Convert: `{[...mySet]}` |
| `X.has is not a function` | Passed Array where Set expected | Ensure state is declared as Set |
| `effect_update_depth_exceeded` | Effect reads and writes same state | Use `untrack()` for write operation |
| Callback not firing | Prop name mismatch | Check exact prop name in component interface |

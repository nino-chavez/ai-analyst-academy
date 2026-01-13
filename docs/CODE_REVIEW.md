# Code Review Process

> AI Analyst Academy code review guidelines based on Google Engineering Practices, Microsoft Code Review Best Practices, and OWASP security standards.

## Table of Contents

1. [Philosophy](#philosophy)
2. [Review Process](#review-process)
3. [What to Look For](#what-to-look-for)
4. [Academy-Specific Checks](#academy-specific-checks)
5. [Comment Guidelines](#comment-guidelines)
6. [Approval Criteria](#approval-criteria)
7. [Automated Checks](#automated-checks)

---

## Philosophy

### Core Principles

1. **Code health over perfection** — Each change should improve overall code quality, even if imperfect
2. **Feedback is about the code** — Use "this code" not "you", and "we should" not "you should"
3. **Be constructive** — Point out what's good, not just what needs fixing
4. **Speed matters** — Target feedback within hours, not days
5. **Trust but verify** — Assume good intent, but validate assumptions

### What Reviews DO Catch

- Logic errors and architectural issues
- Missing validation and security flaws
- Best practice violations
- Maintainability problems
- Knowledge gaps (mentoring opportunity)

### What Reviews DON'T Catch Well

- Runtime bugs in rarely-executed paths (need tests)
- Performance issues (need profiling)
- Concurrency problems (need specialized testing)

**Implication:** Code reviews complement—not replace—automated testing, type checking, and security scanning.

---

## Review Process

### Before Submitting (Author)

1. **Self-review first** — Read your own diff before requesting review
2. **Run all checks locally**:
   ```bash
   pnpm run check      # TypeScript + Svelte
   pnpm run build      # Build verification
   pnpm run dev        # Test routes manually
   ```
3. **Keep PRs focused** — One logical change per PR
4. **Write a clear description** — Explain the "why", not just the "what"
5. **Link issues** — Reference related issues or tickets

### During Review (Reviewer)

1. **Start with the big picture** — Understand intent before diving into details
2. **Check architecture first** — Is the approach sound?
3. **Review in logical order** — Start with entry points, follow data flow
4. **Test mentally** — Think through edge cases
5. **Leave actionable feedback** — Be specific about what to change

### Response Time Targets

| PR Size | Target Response |
|---------|-----------------|
| Small (< 100 lines) | Same day |
| Medium (100-500 lines) | 1-2 days |
| Large (500+ lines) | 2-3 days (consider splitting) |

---

## What to Look For

### 1. Design & Architecture

- [ ] Does it follow single responsibility principle?
- [ ] Is the code in the right location (route vs service vs lib)?
- [ ] Are concerns properly separated?
- [ ] Could another developer understand this easily?
- [ ] Does it introduce unnecessary complexity?

### 2. Correctness & Logic

- [ ] Does the code do what the description claims?
- [ ] Are edge cases handled?
- [ ] Is the happy path clear?
- [ ] Are error conditions handled gracefully?
- [ ] Could it be simplified?

### 3. Security (OWASP Alignment)

- [ ] **Input validation** — All user inputs validated server-side?
- [ ] **Authentication** — Protected routes check `session.user`?
- [ ] **Authorization** — Ownership verified before mutations?
- [ ] **SQL injection** — Using Supabase query builder, not string concat?
- [ ] **XSS prevention** — User content sanitized before display?
- [ ] **Sensitive data** — No secrets in logs, comments, or client code?
- [ ] **Error messages** — Generic messages to users, detailed logs server-side?

### 4. Testing

- [ ] Are new features tested?
- [ ] Do tests cover edge cases, not just happy path?
- [ ] Are tests readable and maintainable?
- [ ] Do tests verify behavior, not implementation?
- [ ] Are test names descriptive?

### 5. Code Quality

- [ ] Naming is clear and consistent?
- [ ] No magic numbers (use constants)?
- [ ] No code duplication (DRY)?
- [ ] Comments explain "why", not "what"?
- [ ] No dead code or console.logs?

### 6. TypeScript Specific

- [ ] No `any` types without justification?
- [ ] Proper use of `unknown` for external data?
- [ ] Types imported from `$lib/content/types.ts`?
- [ ] Generic types used appropriately?
- [ ] Proper null handling with optional chaining?

---

## Academy-Specific Checks

Based on our [CLAUDE.md](../CLAUDE.md), [PATTERNS.md](./PATTERNS.md), and [DESIGN_TOKENS.md](./DESIGN_TOKENS.md):

### Svelte 5 Runes (Critical)

- [ ] Uses runes (`$state`, `$derived`, `$effect`, `$props`)
- [ ] No legacy Svelte 4 patterns (stores, reactive statements)
- [ ] Effects use `untrack()` when reading AND writing same state
- [ ] Props interfaces defined for all components

```svelte
<!-- CORRECT -->
<script lang="ts">
  import { untrack } from 'svelte';

  interface Props {
    items: Item[]
    onSelect?: (item: Item) => void
  }
  let { items, onSelect }: Props = $props()

  let selected = $state<Item | null>(null)
  const count = $derived(items.length)

  // Effect that reads and writes same state
  $effect(() => {
    const newItem = findActiveItem(items);
    if (newItem) {
      untrack(() => {
        selected = newItem;  // Use untrack to avoid infinite loop
      });
    }
  });
</script>

<!-- WRONG -->
<script lang="ts">
  export let items: Item[]  // Legacy export
  $: count = items.length   // Reactive statement
</script>
```

### Component Props Pattern (Critical)

- [ ] Components receive **object props**, not destructured properties
- [ ] Sets converted to Arrays when passing to components
- [ ] Callback props use exact names from component interfaces

```svelte
<!-- CORRECT: Pass whole object -->
{#each concepts as concept (concept.id)}
  <ConceptCard
    {concept}
    understood={understoodSet.has(concept.id)}
    onToggleUnderstanding={handleToggle}
  />
{/each}

<!-- CORRECT: Convert Set to Array -->
<SectionNav
  sections={data.module.sections}
  viewedSections={[...viewedSections]}
  onSectionClick={handleSectionChange}
/>

<!-- WRONG: Destructuring object into individual props -->
{#each concepts as concept}
  <ConceptCard
    term={concept.term}
    definition={concept.definition}
    id={concept.id}
  />
{/each}

<!-- WRONG: Passing Set directly (component expects Array) -->
<SectionNav viewedSections={viewedSections} />
```

### CSS & Theming

**Critical:** CSS anti-patterns are hard to catch in automated checks. Reviewers must verify manually.

#### Checklist

- [ ] Uses semantic tokens (`--color-bg-primary`), not raw color values
- [ ] **No `[data-theme='dark']` overrides in component files** (blocking)
- [ ] Uses existing progress/learning component classes
- [ ] New colors added to `app.css` with both light/dark values

#### Grep Check (Run Before Approving)

```bash
# MUST return empty (only app.css should have theme rules)
grep -r "\[data-theme=" src/routes src/lib/components --include="*.svelte"
grep -r "prefers-color-scheme" src/routes src/lib/components --include="*.svelte"
```

If this returns results, **block the PR** until fixed.

#### Token Categories Reference

| Use Case | Semantic Tokens |
|----------|-----------------|
| Backgrounds | `--color-bg-primary`, `--color-bg-secondary`, `--color-bg-tertiary` |
| Text | `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary` |
| Borders | `--color-border-primary`, `--color-border-secondary` |
| Phase colors | `--color-phase-1`, `--color-phase-2`, `--color-phase-3`, `--color-phase-4` |
| Interactive | `--color-primary-500`, `--color-primary-600` (for buttons, links) |

```css
/* CORRECT */
.card {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: var(--border-width) solid var(--color-border-secondary);
}

/* WRONG - Raw colors with manual dark mode */
.card {
  background: #ffffff;
  color: #1a1a1a;
}
[data-theme='dark'] .card {
  background: #1a1a1a;
  color: #ffffff;
}
```

#### When Author Needs New Colors

If a new UI pattern requires colors not covered by existing tokens:

1. Author adds new semantic token to `app.css`
2. Token MUST have both light and dark mode values
3. Reviewer verifies token naming follows conventions
4. Component uses the new token (no inline dark mode)

### Learning Components

- [ ] `ConceptCard` receives `concept` object (not `term`, `definition` separately)
- [ ] `ExerciseBlock` receives `exercise` object
- [ ] `ChecklistBlock` receives `checklist` object
- [ ] `SectionNav` receives `viewedSections` as **Array**, not Set
- [ ] Callback props use exact names: `onToggleUnderstanding`, `onToggleComplete`, `onSectionClick`

```typescript
// Component interfaces to verify against
interface ConceptCardProps {
  concept: ConceptDefinition;  // NOT term, definition, id separately
  understood?: boolean;
  onToggleUnderstanding?: (conceptId: string, understood: boolean) => void;
}

interface SectionNavProps {
  sections: ContentSection[];
  viewedSections?: string[];   // Array, NOT Set<string>
  onSectionClick?: (sectionId: string) => void;  // NOT onSectionChange
}
```

### Content Types

- [ ] Types imported from `$lib/content/types.ts`
- [ ] Content objects match expected interfaces
- [ ] HTML content fields used for rendering (`htmlContent`, `htmlDefinition`, `htmlInstructions`)

### Route Patterns

- [ ] Phase routes use `[phase]` param correctly
- [ ] Module routes use `[module]` param correctly
- [ ] Lab routes use `[slug]` param correctly
- [ ] Layouts provide proper navigation context

---

## Comment Guidelines

### Severity Labels

Use labels to set clear expectations:

| Label | Meaning | Action Required |
|-------|---------|-----------------|
| (none) | Required change | Must fix before approval |
| **Nit:** | Minor polish | Optional, won't block |
| **Consider:** | Suggestion | Author decides |
| **FYI:** | Information | No action needed |
| **Question:** | Clarification needed | Please explain |

### Comment Examples

```markdown
# Required (blocks approval)
This component passes destructured props. ConceptCard expects {concept} object.
See docs/development/component-api.md.

# Required (blocks approval)
This effect reads and writes `expandedPhases` - will cause infinite loop.
Add `untrack()` around the write operation.

# Nit (optional)
Nit: Consider renaming `x` to `sectionIndex` for clarity.

# Question
Question: Why do we need to convert viewedSections to Set here
if the component expects an Array?

# FYI
FYI: There's a token for this: var(--color-bg-secondary) handles dark mode.
```

### Tone Guidelines

- "This could be simplified by..."
- "Consider using X instead of Y because..."
- "I'm not sure I understand this part. Could you explain..."
- "You should have used..."
- "This is wrong."
- "Why didn't you just..."

---

## Approval Criteria

### Must Pass (Blocking)

1. **All CI checks pass**
   - TypeScript compilation
   - Svelte check (zero errors)
   - Build successful

2. **Svelte 5 patterns followed**
   - No legacy reactive statements
   - Effects use `untrack()` where needed
   - Component props follow object pattern

3. **CSS tokens used correctly**
   - No component-level dark mode overrides
   - Semantic tokens for colors

4. **No unresolved required comments**

### Should Pass (Non-Blocking)

- Documentation updated if behavior changes
- No new TypeScript warnings
- Follows established patterns

### Approval Requirements

| Change Type | Approvals Needed |
|-------------|------------------|
| Documentation only | 1 |
| Bug fix | 1 |
| New component | 1 + verify against component-api.md |
| New route | 1 |
| Content changes | 1 |
| CSS/theming changes | 1 + grep check verified |
| Breaking change | 2 + explicit discussion |

---

## Automated Checks

### CI Pipeline Requirements

```yaml
# Required checks (must pass)
- pnpm run check        # TypeScript + Svelte
- pnpm run build        # Build verification
```

### Pre-Commit Hooks (Recommended)

```bash
# .husky/pre-commit
pnpm run check
```

### What Automation Handles

| Check | Tool | Human Review |
|-------|------|--------------|
| Formatting | Prettier | No |
| Type errors | TypeScript/Svelte | No |
| Build errors | SvelteKit | No |
| Svelte 5 patterns | Manual | Yes |
| Component props | Manual | Yes |
| CSS tokens | Manual | Yes (grep check) |
| Architecture | Manual | Yes |

---

## Quick Reference Checklist

Copy this for PR reviews:

```markdown
## Code Review Checklist

### General
- [ ] PR description explains "why"
- [ ] Code is in the right location
- [ ] No unnecessary complexity

### Svelte 5 Patterns
- [ ] Uses runes (`$state`, `$derived`, `$effect`, `$props`)
- [ ] Effects use `untrack()` when reading AND writing same state
- [ ] No legacy `$:` reactive statements or `export let`

### Component Props
- [ ] Learning components receive object props (not destructured)
- [ ] Sets converted to Arrays: `[...mySet]`
- [ ] Callback names match exactly: `onToggleUnderstanding`, `onSectionClick`

### CSS & Theming
- [ ] Uses semantic tokens (not raw colors)
- [ ] **No dark mode overrides in components** (run grep check)

### CSS Verification (Before Approving)
Run:
```bash
grep -r "\[data-theme=" src/routes src/lib/components --include="*.svelte"
grep -r "prefers-color-scheme" src/routes src/lib/components --include="*.svelte"
```
Must return empty. If not, block PR.
```

---

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) — Development guidelines and standards
- [PATTERNS.md](./PATTERNS.md) — Code patterns and conventions
- [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) — CSS token reference
- [docs/development/svelte5-patterns.md](./development/svelte5-patterns.md) — Svelte 5 patterns
- [docs/development/component-api.md](./development/component-api.md) — Component API reference

---

## Resources

### Industry Standards Referenced

- [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)
- [Microsoft Code Review Best Practices](https://microsoft.github.io/code-with-engineering-playbook/code-reviews/)
- [OWASP Secure Code Review Guide](https://owasp.org/www-project-code-review-guide/)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

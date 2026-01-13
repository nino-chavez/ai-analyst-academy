## Summary

<!-- Brief description of what this PR does and why -->

## Changes

<!-- Bullet list of specific changes -->
-

## Test Plan

<!-- How did you verify this works? -->
- [ ] Manual testing (describe steps below)
- [ ] Ran `pnpm run check && pnpm run build`
- [ ] Tested routes for console errors

### Routes Tested
<!-- Check routes relevant to your changes -->
- [ ] `/` — Landing page
- [ ] `/learn` — Curriculum overview
- [ ] `/learn/phase/[phase]` — Phase overview
- [ ] `/learn/phase/[phase]/[module]` — Module content
- [ ] `/learn/lab/[slug]` — Lab page

## Related

<!-- Link issues, PRs, or documentation -->
- Closes #
- Related to #

---

## Code Review Checklist

### General
- [ ] PR description explains the "why"
- [ ] Changes are focused (one logical change per PR)
- [ ] No unrelated changes bundled in

### Svelte 5 Patterns
- [ ] Uses runes (`$state`, `$derived`, `$effect`, `$props`)
- [ ] No legacy patterns (`export let`, `$:` reactive statements)
- [ ] Effects use `untrack()` when reading AND writing same state
- [ ] Props interfaces defined with `$props()`

### Component Props
- [ ] Learning components receive **object props** (not destructured)
  - `{concept}` not `term={concept.term}`
- [ ] Sets converted to Arrays when needed: `[...mySet]`
- [ ] Callback props use exact names:
  - `onToggleUnderstanding` (not `onToggle`)
  - `onToggleComplete` (not `onComplete`)
  - `onSectionClick` (not `onSectionChange`)

### CSS & Theming
- [ ] Uses semantic tokens (`--color-bg-primary`, `--color-text-primary`)
- [ ] No raw hex colors (`#ffffff`, `#1a1a1a`)
- [ ] No component-level dark mode overrides

### Types
- [ ] Types imported from `$lib/content/types.ts`
- [ ] No `any` types without justification

### CI Status
- [ ] `pnpm run check` passes
- [ ] `pnpm run build` succeeds

---

## CSS Verification

**Before approving**, reviewer must run:

```bash
grep -r "\[data-theme=" src/routes src/lib/components --include="*.svelte"
grep -r "prefers-color-scheme" src/routes src/lib/components --include="*.svelte"
```

- [ ] Grep check returns empty (verified by reviewer)

---

<!--
For reviewers: Use comment labels to set expectations
- (no label) = Required change, blocks approval
- Nit: = Minor polish, optional
- Consider: = Suggestion, author decides
- Question: = Clarification needed
- FYI: = Information only

See docs/CODE_REVIEW.md for full guidelines.
-->

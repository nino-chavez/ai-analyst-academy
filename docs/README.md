# AI Analyst Academy Documentation

Comprehensive documentation for the AI Analyst Academy learning platform.

## Quick Start

| Document | Purpose |
|----------|---------|
| [PROGRESS.md](PROGRESS.md) | **Implementation status and roadmap (check first)** |
| [CLAUDE.md](../CLAUDE.md) | AI agent development guidelines |
| [Svelte 5 Patterns](development/svelte5-patterns.md) | Critical patterns for Svelte 5 runes |
| [Component API](development/component-api.md) | Component props and usage |
| [Design Tokens](DESIGN_TOKENS.md) | CSS custom properties reference |

---

## Documentation Index

### Implementation Status

| Document | Description |
|----------|-------------|
| [PROGRESS.md](PROGRESS.md) | Implementation status, feature roadmap, database reference |

### Core References

| Document | Description |
|----------|-------------|
| [CLAUDE.md](../CLAUDE.md) | Project overview, tech stack, Svelte 5 patterns, component interfaces |
| [CODE_REVIEW.md](CODE_REVIEW.md) | Code review process, approval criteria, grep checks |
| [DESIGN_TOKENS.md](DESIGN_TOKENS.md) | Two-tier design token system, semantic tokens, color scales |
| [PATTERNS.md](PATTERNS.md) | Comprehensive code patterns and anti-patterns |

### Development Guides

| Document | Description |
|----------|-------------|
| [Svelte 5 Patterns](development/svelte5-patterns.md) | Runes, effects, state management, infinite loop prevention |
| [Component API](development/component-api.md) | Props interfaces, examples, type definitions |
| [Rally HQ Comparison](design/rally-hq-comparison-report.md) | Design system comparison and improvements |

### Design Documentation

| Document | Description |
|----------|-------------|
| [Academic Alignment](design/academic-alignment.md) | Bloom's taxonomy mapping, business school competencies |
| [Interactive Component Specs](design/interactive-component-specs.md) | Context Window Visualizer, Token Calculator, Risk Matrix |
| [Personas](design/personas.md) | User personas and journey maps |
| [Sitemap](design/sitemap.md) | Information architecture |
| [User Journeys](design/user-journeys.md) | Detailed user journey maps with Mermaid diagrams |
| [Wireframes](design/wireframes/) | UI wireframes and layouts |

### Architecture

| Document | Description |
|----------|-------------|
| [Architecture Decisions](architecture/decisions/) | ADRs for key technical decisions |

---

## Code Review

See [CODE_REVIEW.md](CODE_REVIEW.md) for the full code review process and [.github/PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md) for the PR template.

### Quick Checklist

Before submitting code, verify:

### Svelte 5 Patterns
- [ ] Components receive **object props**, not destructured properties
- [ ] Sets converted to Arrays when passing to components: `[...mySet]`
- [ ] Effects use `untrack()` when reading AND writing same state
- [ ] Callback props use exact names from component interfaces

### CSS & Theming
- [ ] Uses semantic tokens (`--color-bg-primary`) not raw colors
- [ ] No component-level dark mode overrides — all in `app.css`
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

## Quick Token Reference

### Semantic Tokens (Use These)

| Token | Light | Dark | Use For |
|-------|-------|------|---------|
| `--color-bg-primary` | `#ffffff` | `neutral-950` | Main background |
| `--color-bg-secondary` | `neutral-50` | `neutral-900` | Cards, sidebars |
| `--color-text-primary` | `neutral-900` | `neutral-50` | Headings, body |
| `--color-text-secondary` | `neutral-600` | `neutral-300` | Descriptions |
| `--color-border-primary` | `neutral-200` | `neutral-700` | Card borders |

### Phase Colors

| Phase | Color | Light BG | Use For |
|-------|-------|----------|---------|
| Phase 1 | `--color-phase-1` | `--color-phase-1-light` | AI Literacy |
| Phase 2 | `--color-phase-2` | `--color-phase-2-light` | Workflow Engineering |
| Phase 3 | `--color-phase-3` | `--color-phase-3-light` | Agentic Orchestration |
| Phase 4 | `--color-phase-4` | `--color-phase-4-light` | Strategy & Economics |
| Capstone | `--color-capstone` | `--color-capstone-light` | Capstone project |

---

## Fast Verification

```bash
# Type check
pnpm run check

# Build
pnpm run build

# Dev server
pnpm run dev

# Test routes:
# - / (landing)
# - /learn (curriculum overview)
# - /learn/phase/1 (phase overview)
# - /learn/phase/1/1.1-economics-of-intelligence (module)
# - /learn/lab/lab-1-persona-stress-test (lab)
```

### Console Errors to Watch For

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot read properties of undefined` | Component expects object prop | Pass `{concept}` not `term={concept.term}` |
| `X.includes is not a function` | Passed Set where Array expected | Convert: `[...mySet]` |
| `effect_update_depth_exceeded` | Effect reads and writes same state | Use `untrack()` |
| Callback not firing | Prop name mismatch | Check exact name in interface |

---

## Contributing

1. Read [CLAUDE.md](../CLAUDE.md) for project guidelines
2. Follow [Svelte 5 Patterns](development/svelte5-patterns.md)
3. Use semantic tokens from [DESIGN_TOKENS.md](DESIGN_TOKENS.md)
4. Review [CODE_REVIEW.md](CODE_REVIEW.md) for review process
5. Use [PR Template](../.github/PULL_REQUEST_TEMPLATE.md) for submissions

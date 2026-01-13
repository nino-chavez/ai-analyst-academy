# UX Audit: Learning Flow & Cognitive Overhead

**Date**: 2026-01-12
**Auditor**: AI Assistant
**Scope**: Module page information architecture, section navigation, and learning flow
**Triggered by**: User observation that tabbed sections create unclear progression path

---

## Executive Summary

The current module page design uses a **tabbed section navigation** pattern (WHY/WHAT/HOW/GENERIC) that creates **cognitive overhead** for learners by:

1. **Hiding content hierarchy** — Learners can't see the full scope of material
2. **Implying non-linearity** — Tabs suggest content can be consumed in any order
3. **Creating navigation uncertainty** — "Where am I? What's next?" is unclear
4. **Breaking scroll flow** — Forces click-to-navigate instead of natural scrolling
5. **Preventing scanning** — Can't skim ahead to understand the journey

**Recommendation**: Replace tabbed sections with **linear scrollable content** with a sticky progress indicator showing current position in the WHY → WHAT → HOW flow.

---

## Findings

### Issue 1: Tabbed Sections Hide Content Scope

**Current State**:
```
[WHY] [WHAT] [HOW] [GENERIC]    ← Only one visible at a time
         ↓
[Content for selected tab]
```

**Problems**:
- Learner can't assess total module length
- No visibility into what concepts, exercises, or checklists exist
- "0% complete" is meaningless without scope visibility
- Contradicts microlearning principle of "know what you're getting into"

**Evidence from L&D Research**:
> Learners perform better when they can see the full learning journey upfront. This is called "advance organizers" (Ausubel, 1968) — providing a conceptual scaffolding before detailed content.

**Recommendation**:
- Display full content in scrollable page
- Add a "Module Overview" card at top showing: sections, concepts, exercises
- Use visual timeline/progress bar showing current position

---

### Issue 2: Tab Navigation Implies Non-Linear Consumption

**Current State**:
The SectionNav component presents WHY/WHAT/HOW as **equal-weight tabs**, suggesting learners can click any in any order.

**Problems**:
- WHY → WHAT → HOW is a **deliberate pedagogical sequence**
- Tabs communicate "choose your adventure" — wrong mental model for structured learning
- Section titles "Why It Matters" / "Core Concepts" / "How To Apply" are descriptive but don't communicate sequence
- No visual indicator of progression (1 → 2 → 3)

**From Personas Document**:
> Career Pivoter: "Prefers structured, sequential learning"
> Team Lead wants "skip-to-key-concepts" — but even they need to understand they're skipping

**Recommendation**:
- Replace tabs with numbered steps: "Step 1: Why" → "Step 2: What" → "Step 3: How"
- Or use a progress stepper component showing sequential flow
- Show all content inline with clear section dividers

---

### Issue 3: No Clear "Next" Action After Reading

**Current State**:
After reading a section, the learner must:
1. Remember there are other tabs
2. Click the next tab
3. Figure out if they're done

**Problems**:
- No "Continue" button at section end
- No indicator of "you've completed this section"
- No guidance toward next action
- Progress tracking requires active tab-clicking

**Evidence from UX Research**:
> "Don't make me think" (Krug) — every decision point adds cognitive load. Scrolling is passive; clicking is active. Passive navigation > active navigation for learning flow.

**Recommendation**:
- Add "Continue to [Next Section]" button at end of each section
- Auto-mark sections as viewed when scrolled past
- Show inline progress: "Section 1 of 3"

---

### Issue 4: Key Concepts and Exercises Are Separated from Context

**Current State**:
```
[Section Content] ← In tabbed area
─────────────────
Key Concepts ← Always visible below tabs
Exercises ← Always visible below concepts
```

**Problems**:
- Concepts appear after ALL sections, not contextually where they're introduced
- Exercise may reference content in a different tab (back-and-forth)
- Checklist appears disconnected from learning flow
- Learner must context-switch between tabs and static content below

**From Content Analysis**:
The markdown content includes `:::concept[]` blocks inline with content, but they're extracted and displayed separately in the UI.

**Recommendation**:
- Render concepts inline where they appear in markdown
- Place exercises at end of relevant section (usually HOW)
- Checklist should be end-of-module summary, clearly labeled

---

### Issue 5: "GENERIC" Section Label is Meaningless

**Current State**:
Fourth tab labeled "GENERIC" with title "Up Next"

**Problems**:
- "GENERIC" is a type value, not user-facing label
- "Up Next" is navigation, not content
- Mixing content sections with navigation is confusing
- Users don't know what to expect in this section

**Recommendation**:
- Remove "GENERIC" as a section type for module navigation
- If "Up Next" content exists, place it after module content as a clear navigation element
- Or rename to "Summary" / "Next Steps" / "Practice"

---

### Issue 6: No Visible Learning Path Context

**Current State**:
- Module shows phase/module in breadcrumb
- Sidebar shows full curriculum
- No inline indication of where this module fits in the journey

**Problems**:
- Learner can't see: "This is module 1 of 4 in Phase 1"
- No sense of overall progress in the phase
- Completing this module doesn't feel like meaningful progress

**Recommendation**:
- Add phase progress indicator: "Module 1 of 4 in AI Literacy"
- Show overall course progress in header: "15% of curriculum complete"
- Celebrate module completion with clear "next module" CTA

---

## Proposed Redesign

### Option A: Linear Scroll with Sticky Progress (Recommended)

```
┌─────────────────────────────────────────┐
│ Module: Economics of Intelligence       │
│ Phase 1 • Module 1 of 4 • 12 min       │
├─────────────────────────────────────────┤
│ ○───●───○───○  Progress: 25%           │ ← Sticky on scroll
│ WHY  WHAT HOW  Done                     │
├─────────────────────────────────────────┤
│                                         │
│ ## WHY This Matters                     │
│                                         │
│ [Content...]                            │
│                                         │
│ ┌─ KEY CONCEPT ─────────────────────┐  │ ← Inline
│ │ tokens: A token is...             │  │
│ └───────────────────────────────────┘  │
│                                         │
│ [More content...]                       │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ ## WHAT You Need to Know               │
│                                         │
│ [Content with inline concepts...]       │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ ## HOW to Apply This                   │
│                                         │
│ [Content...]                            │
│                                         │
│ ┌─ EXERCISE ────────────────────────┐  │
│ │ Calculate token costs...          │  │
│ │ [  ] Mark complete                │  │
│ └───────────────────────────────────┘  │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ ## Module Complete!                     │
│                                         │
│ ☑ Progress Checklist                   │
│ [ ] Understand token economics          │
│ [ ] Calculate costs                     │
│ [ ] Choose appropriate models           │
│                                         │
│ [← Previous Module]  [Next Module →]   │
│                                         │
└─────────────────────────────────────────┘
```

**Benefits**:
- Natural scroll flow (no clicking required)
- Full content scope visible (can scroll to preview)
- Progress indicator tracks scroll position
- Concepts appear in context
- Clear beginning and end
- Works for all personas (Career Pivoter can read all, Team Lead can scroll to HOW)

### Option B: Stepper with Expanded Sections

```
┌─────────────────────────────────────────┐
│ Step 1 of 3: Why This Matters          │
│ ● ─ ○ ─ ○                              │
├─────────────────────────────────────────┤
│                                         │
│ [Full WHY content...]                   │
│                                         │
│        [Continue to Step 2 →]          │
│                                         │
└─────────────────────────────────────────┘
```

**Benefits**:
- Clear sequential progression
- Focused single-section view
- Explicit "continue" action
- Progress is unambiguous

**Drawbacks**:
- Still hides content (can't scan ahead)
- Requires active navigation
- Less suitable for Team Lead persona who wants to skip

---

## Implementation Priority

### P0 — Critical (Current Confusion)

1. **Replace tabs with linear scroll** — Remove SectionNav tabs, display all sections inline
2. **Add sticky progress stepper** — Show WHY/WHAT/HOW progress on scroll
3. **Inline concept cards** — Render concepts where they appear in markdown
4. **Add section continue buttons** — "Continue to Core Concepts" at section end

### P1 — Important (Learning Optimization)

5. **Add module overview card** — Show what's in this module upfront
6. **Phase progress indicator** — "Module 1 of 4"
7. **Scroll-based progress tracking** — Auto-mark sections viewed
8. **End-of-module celebration** — Clear completion state with next action

### P2 — Enhancement (Persona-Specific)

9. **Team Lead mode** — Collapsible sections for skip-to-content
10. **Key takeaways** — Summary section for time-constrained learners
11. **Bookmark/resume** — Return to last position on page load

---

## Technical Changes Required

### Files to Modify

| File | Change |
|------|--------|
| `+page.svelte` (module) | Remove SectionNav, render all sections inline |
| `SectionNav.svelte` | Repurpose as sticky progress indicator |
| `ModuleContent.svelte` | Update to render sections linearly |
| `content/loader.ts` | No change needed (sections already parsed) |
| `build-content.ts` | Keep concept blocks inline in htmlContent |

### New Components Needed

| Component | Purpose |
|-----------|---------|
| `SectionProgress.svelte` | Sticky progress stepper (WHY → WHAT → HOW) |
| `ModuleOverview.svelte` | Module scope summary card |
| `SectionDivider.svelte` | Visual divider between sections |
| `ContinueButton.svelte` | Section-to-section navigation |

---

## Validation Plan

### Metrics to Track

1. **Module completion rate** — Should increase with linear flow
2. **Time on page** — May increase (more content visible)
3. **Scroll depth** — Measure where users stop reading
4. **Section view order** — Verify WHY → WHAT → HOW sequence
5. **Back navigation** — Reduced if flow is clear

### User Testing Questions

1. "What would you do after reading this section?"
2. "How much content is in this module?"
3. "Where are you in the learning process?"
4. "What comes next after you finish this module?"

---

## References

- Ausubel, D. P. (1968). Educational Psychology: A Cognitive View — Advance organizers
- Krug, S. (2014). Don't Make Me Think — Passive vs. active navigation
- Mayer, R. E. (2009). Multimedia Learning — Cognitive load theory
- AI Analyst Academy Personas Document — Learning preferences by persona

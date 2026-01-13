# Learning UX Design Principles

This document codifies the design principles for AI Analyst Academy's learning experience. These principles are **mandatory** for all learning-related UI decisions.

---

## Core Philosophy

> **Learning flows forward. UI should follow.**

The learner's cognitive resources should be spent on understanding content, not navigating UI. Every interaction that isn't "continue learning" is cognitive overhead.

---

## The Seven Principles

### 1. Linear Flow by Default

**Principle**: Content should flow in a single, scrollable direction. Learners read top-to-bottom, left-to-right. UI should match this expectation.

**Why**:
- Scrolling is passive (low cognitive load)
- Clicking/tapping is active (requires decision)
- Tabs, accordions, and carousels hide content and require active navigation
- Hidden content creates "what am I missing?" anxiety

**Do**:
```
✅ Full page scroll with all sections visible
✅ Clear section dividers as visual waypoints
✅ Sticky progress indicator showing current position
✅ "Continue" buttons at natural pause points
```

**Don't**:
```
❌ Tabs that hide content sections
❌ Accordions that collapse by default
❌ Carousels for sequential content
❌ Pagination within a single learning unit
```

**Exception**: Large reference content (API docs, glossaries) may use tabs/accordions for findability, but never for sequential learning content.

---

### 2. Visible Scope

**Principle**: Learners must be able to see or easily preview the full scope of a learning unit before and during consumption.

**Why**:
- "Advance organizers" improve learning outcomes (Ausubel, 1968)
- Knowing "how much is left" reduces cognitive anxiety
- Ability to scan ahead helps learners build mental models
- Progress feels meaningful when scope is visible

**Do**:
```
✅ Module overview card showing: sections, concepts, exercises, time estimate
✅ Scrollable content (can scroll to preview)
✅ Progress indicators: "Section 2 of 3" or visual stepper
✅ Table of contents for longer content
```

**Don't**:
```
❌ "0% complete" without visible total
❌ Hidden sections that can't be previewed
❌ Vague progress ("In Progress" without context)
❌ Surprise content appearing after "completion"
```

---

### 3. Context Preservation

**Principle**: Related content should appear together. Never force learners to navigate away to understand the current content.

**Why**:
- Working memory is limited (7±2 items)
- Context-switching degrades comprehension
- "Back and forth" navigation loses the thread
- Inline content reinforces connections

**Do**:
```
✅ Concept definitions inline where introduced
✅ Exercises at the end of relevant section (not separate page)
✅ Examples immediately after explanations
✅ Key terms highlighted in context with hover/tooltip definitions
```

**Don't**:
```
❌ Concepts extracted to separate area below content
❌ "Click here to see the exercise" links
❌ Glossary-only definitions (no inline context)
❌ Examples in separate tabs/modals
```

---

### 4. Clear Sequencing

**Principle**: When content has a pedagogical sequence, the UI must communicate and reinforce that sequence.

**Why**:
- WHY → WHAT → HOW is deliberate instructional design
- Tabs/cards imply "choose any" — wrong mental model
- Numbers and arrows communicate sequence
- Clear sequence reduces "where should I start?" paralysis

**Do**:
```
✅ Numbered steps: "Step 1: Why This Matters"
✅ Visual progress stepper with directional flow
✅ Section headers that include sequence: "1. WHY" not just "WHY"
✅ "Continue to Step 2" buttons (explicit next action)
```

**Don't**:
```
❌ Equal-weight tabs for sequential content
❌ Section names without sequence indicators
❌ Grid layouts for ordered content
❌ "Jump to any section" without clear sequence context
```

---

### 5. Obvious Next Action

**Principle**: At every point, the learner should know exactly what to do next. The primary action should be visually dominant.

**Why**:
- Decision fatigue degrades learning
- "What now?" moments cause drop-offs
- Clear CTAs maintain momentum
- Progress feels continuous, not choppy

**Do**:
```
✅ "Continue" button at end of each section
✅ Primary action visually prominent (size, color, position)
✅ "Next Module" CTA at module completion
✅ Auto-scroll to next section option
```

**Don't**:
```
❌ Multiple equal CTAs competing for attention
❌ No clear action after reading a section
❌ "Back" more prominent than "Forward"
❌ Requiring learner to remember to click tabs
```

---

### 6. Progress That Means Something

**Principle**: Progress indicators must reflect meaningful learning milestones, not arbitrary metrics.

**Why**:
- "Viewed" ≠ "Learned" — but it's a start
- Progress should feel earned, not gamed
- Completion states should be unambiguous
- Celebrating progress maintains motivation

**Do**:
```
✅ Section completion: read-through + comprehension check
✅ Module completion: all sections + key concepts marked understood
✅ Phase completion: modules + deliverable submitted
✅ Visual celebration at meaningful milestones
```

**Don't**:
```
❌ Progress based on time spent alone
❌ Counting page views as progress
❌ Progress that can reach 100% without engagement
❌ Ambiguous "in progress" states
```

---

### 7. Respect the Skim

**Principle**: Design for both deep reading AND quick scanning. Time-constrained learners should be able to extract value quickly.

**Why**:
- Team Lead persona: "I don't have time to become an expert"
- Scanning is how learners assess relevance before investing
- Key takeaways serve returning learners (spaced repetition)
- Scannability doesn't hurt deep readers, helps skimmers

**Do**:
```
✅ Clear headings that summarize section content
✅ Bold key terms on first use
✅ TL;DR or "Key Takeaways" section at module end
✅ Concept cards visually distinct (easy to spot while scrolling)
✅ Collapsible sections for advanced/optional content
```

**Don't**:
```
❌ Walls of text without visual breaks
❌ Important points buried in paragraphs
❌ Only one reading speed supported
❌ Forcing full read to understand structure
```

---

## Applying the Principles

### Decision Framework

When designing learning UI, ask:

1. **Can the learner scroll through this?** If no, reconsider.
2. **Can they see what's ahead?** If no, add scope visibility.
3. **Is related content together?** If no, inline it.
4. **Is the sequence clear?** If no, add numbers/arrows.
5. **Do they know what to do next?** If no, add CTA.
6. **Does progress feel meaningful?** If no, redesign metric.
7. **Can a busy person skim this?** If no, add structure.

### Component Checklist

Before building a learning component, verify:

| Check | Question |
|-------|----------|
| [ ] | Does this support linear flow? |
| [ ] | Can users see full scope? |
| [ ] | Is context preserved (no navigation to understand)? |
| [ ] | Is sequence visually clear? |
| [ ] | Is the next action obvious? |
| [ ] | Does progress tracking make sense? |
| [ ] | Can time-constrained users skim effectively? |

---

## Anti-Patterns to Avoid

### The Tab Trap
Using tabs for sequential content. Tabs say "pick any" but learning says "follow the path."

### The Hidden Exercise
Separating exercises from the content they practice. Forces context-switching.

### The Mystery Progress
"25% complete" with no indication of what constitutes 100%.

### The Click Maze
Requiring multiple clicks to reach the next piece of content.

### The Wall of Text
No visual hierarchy, no scannable elements, no mercy.

### The Surprise Quiz
Assessment appearing without warning, breaking learning flow.

### The Dead End
Content that ends without a clear next action.

---

## References

- Ausubel, D. P. (1968). Educational Psychology: A Cognitive View
- Krug, S. (2014). Don't Make Me Think, Revisited
- Mayer, R. E. (2009). Multimedia Learning
- Sweller, J. (1988). Cognitive Load Theory
- Nielsen, J. (1993). Usability Engineering

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-01-12 | Initial document created | AI Assistant |

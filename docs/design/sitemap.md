# AI Analyst Academy — Information Architecture & Sitemap

> **Implementation Status:** See [PROGRESS.md](../PROGRESS.md) for current development status.

## Overview

This document defines the information architecture for the AI Analyst Academy platform. It includes the complete sitemap, URL structure, content hierarchy, and navigation patterns optimized for learning and development.

---

## Global Navigation Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           HEADER                                         │
│  [Logo] [Dashboard] [Curriculum] [Sandbox] [Progress] [Portfolio]  [⚙️] │
└─────────────────────────────────────────────────────────────────────────┘
```

### Primary Navigation Items

| Item | URL | Description | Visibility | Status |
|------|-----|-------------|------------|--------|
| **Dashboard** | `/` | Personalized home, continue learning | Always | Done |
| **Curriculum** | `/learn` | Course overview, phase navigation | Always | Done |
| **Sandbox** | `/sandbox` | AI Chat playground | Always | Demo Mode |
| **Progress** | `/progress` | Detailed progress tracking | Authenticated | UI Only |
| **Portfolio** | `/portfolio` | Deliverables and exports | Authenticated | UI Only |
| **Settings** | `/settings` | Profile, API keys, preferences | Authenticated | Done |

---

## Complete Sitemap

### Visual Sitemap with Implementation Status

Legend: ✅ Done | ⚡ Demo/Partial | 🔲 Not Started

```
ai-operator.academy/
│
├── / (Dashboard) ✅
│   ├── Continue Learning ✅
│   ├── Daily Goals 🔲
│   ├── Review Queue 🔲
│   └── Quick Actions ✅
│
├── /auth ✅
│   ├── /login ✅
│   ├── /signup ✅
│   ├── /callback ✅
│   └── /reset-password 🔲
│
├── /onboarding 🔲
│   ├── /role-selection 🔲
│   ├── /skill-assessment (optional) 🔲
│   ├── /goal-setting 🔲
│   └── /byok-setup (optional) 🔲
│
├── /learn (Curriculum Overview) ✅
│   │
│   ├── /phase/1 (AI Literacy) ✅
│   │   ├── Overview ✅
│   │   ├── /module/1 (Economics of Intelligence) ✅
│   │   ├── /module/2 (Context and Memory) ✅
│   │   ├── /module/3 (Providers and Models) ✅
│   │   ├── /module/4 (Prompting as Management) ✅
│   │   └── /deliverable (Prompt Library) 🔲
│   │
│   ├── /phase/2 (Workflow Engineering) ✅
│   │   ├── Overview ✅
│   │   ├── /module/1 (Decomposition) ✅
│   │   ├── /module/2 (Role-Based Workflows) ✅
│   │   ├── /module/3 (Human-in-the-Loop) ✅
│   │   ├── /module/4 (Quality and Iteration) ✅
│   │   └── /deliverable (Workflow Design Doc) 🔲
│   │
│   ├── /phase/3 (Implementation) ✅
│   │   ├── Overview ✅
│   │   ├── /module/1 (Triggers and Actions) ✅
│   │   ├── /module/2 (Tool Integration) ✅
│   │   ├── /module/3 (Data Flow Design) ✅
│   │   ├── /module/4 (Error Handling) ✅
│   │   └── /deliverable (Working Automation) 🔲
│   │
│   ├── /phase/4 (Strategy & Economics) ✅
│   │   ├── Overview ✅
│   │   ├── /module/1 (Build vs Buy) ✅
│   │   ├── /module/2 (AI ROI Calculation) ✅
│   │   ├── /module/3 (Risk and Governance) ✅
│   │   ├── /module/4 (Change Management) ✅
│   │   └── /deliverable (Strategic Recommendation) 🔲
│   │
│   ├── /lab/[slug] ✅
│   │   ├── persona-stress-test (Lab 1) ✅
│   │   ├── chain-of-thought-audit (Lab 2) ✅
│   │   ├── sop-translation (Lab 3) ✅
│   │   ├── unstructured-data-cleanup (Lab 4) ✅
│   │   ├── zapier-hello-world (Lab 5) ✅
│   │   ├── buy-vs-build-memo (Lab 6) ✅
│   │   └── agentic-research-report (Lab 7) ✅
│   │
│   ├── /capstone ✅ (via lab route)
│   │   ├── /briefing 🔲
│   │   ├── /project 🔲
│   │   └── /presentation 🔲
│   │
│   └── /syllabus ✅
│
├── /sandbox (AI Playground) ⚡
│   ├── (default) Free Chat Mode ⚡ (demo mode)
│   ├── /persona/[name] (Persona-specific context) 🔲
│   └── /lab/[slug] (Lab-specific context) 🔲
│
├── /progress ⚡
│   ├── Overview ⚡ (UI only)
│   ├── /phase/[number] (Phase-specific progress) 🔲
│   ├── /competencies (Bloom's taxonomy mapping) 🔲
│   ├── /review-queue (Spaced repetition) 🔲
│   └── /time-tracking 🔲
│
├── /portfolio ⚡
│   ├── Overview ⚡ (UI only)
│   ├── /deliverables 🔲
│   ├── /prompts (Saved prompt library) 🔲
│   ├── /capstone 🔲
│   └── /export 🔲
│
├── /settings ✅
│   ├── /profile ✅
│   ├── /api-keys (BYOK configuration) ✅
│   ├── /preferences 🔲
│   └── /notifications 🔲
│
├── /style-guide ✅ (not in original spec)
│
└── /api (Internal API endpoints)
    ├── /auth/* ✅
    ├── /chat ✅
    ├── /progress/* 🔲
    ├── /portfolio/* 🔲
    └── /export/* 🔲
```

---

## URL Structure & Conventions

### URL Patterns

| Pattern | Example | Description |
|---------|---------|-------------|
| `/learn/phase/[n]` | `/learn/phase/1` | Phase overview page |
| `/learn/phase/[n]/module/[m]` | `/learn/phase/1/module/2` | Specific module content |
| `/learn/phase/[n]/deliverable` | `/learn/phase/1/deliverable` | Phase deliverable page |
| `/learn/lab/[slug]` | `/learn/lab/persona-stress-test` | Lab exercise page |
| `/sandbox/persona/[name]` | `/sandbox/persona/gen-z` | Sandbox with persona context |
| `/sandbox/lab/[slug]` | `/sandbox/lab/chain-of-thought-audit` | Sandbox with lab context |

### URL Conventions

- Use lowercase with hyphens for slugs
- Numeric IDs for phases and modules (matches curriculum structure)
- Human-readable slugs for labs (SEO-friendly)
- Query params for state (e.g., `?section=why`, `?step=3`)

---

## Content Hierarchy

### Learning Content Structure

```
Academy
└── Curriculum
    └── Phase (4 total)
        ├── Overview
        │   ├── Phase Introduction
        │   ├── Learning Objectives
        │   ├── Time Estimate
        │   └── Prerequisites
        │
        ├── Modules (4 per phase)
        │   └── Module
        │       ├── WHY Section (1-2 min)
        │       │   ├── Career Relevance
        │       │   └── Real-World Problem
        │       │
        │       ├── WHAT Section (5-8 min)
        │       │   ├── Key Concepts (max 3)
        │       │   ├── Examples
        │       │   ├── Concept Cards (interactive)
        │       │   └── Diagrams/Tables
        │       │
        │       └── HOW Section (2-3 min)
        │           ├── Quick Exercise
        │           ├── Self-Check Quiz
        │           └── Lab Connection
        │
        ├── Labs (1-2 per phase)
        │   └── Lab
        │       ├── Scenario Setup
        │       ├── Instructions (numbered steps)
        │       ├── AI Sandbox Integration
        │       ├── Submission Requirements
        │       └── Rubric Preview
        │
        └── Deliverable
            ├── Requirements
            ├── Rubric
            ├── Submission Form
            └── Examples
```

### Depth Levels

| Level | Content Type | Example | Typical Time |
|-------|-------------|---------|--------------|
| 1 | Curriculum | Full course | 40-60 hours |
| 2 | Phase | AI Literacy | 8-12 hours |
| 3 | Module | Economics of Intelligence | 10-15 min |
| 4 | Section | WHY/WHAT/HOW | 2-8 min |
| 5 | Element | Concept Card, Quiz Question | 30s-2min |

---

## Navigation Patterns

### Sidebar Navigation (Learning Context)

```
┌─────────────────────────────────────┐
│  AI OPERATOR ACADEMY                │
│                                     │
│  ▼ Phase 1: AI Literacy    [70%]   │
│    ○ Overview                       │
│    ● Module 1.1: Economics  ✓      │
│    ○ Module 1.2: Context    ◐      │
│    ○ Module 1.3: Providers         │
│    ○ Module 1.4: Prompting         │
│    ─────────────────                │
│    ○ Lab 1: Persona Test           │
│    ○ Lab 2: CoT Audit              │
│    ─────────────────                │
│    ○ Deliverable: Prompt Library   │
│                                     │
│  ▶ Phase 2: Workflow Eng   [0%]    │
│  ▶ Phase 3: Agentic Orch   [0%]    │
│  ▶ Phase 4: Strategy       [0%]    │
│  ▶ Capstone Project        [0%]    │
│                                     │
│  ─────────────────                  │
│  📚 Syllabus                        │
│  🔧 AI Sandbox                      │
└─────────────────────────────────────┘

Legend:
● Current    ○ Not started
✓ Complete   ◐ In progress
▶ Collapsed  ▼ Expanded
```

### Module Content Navigation

```
┌─────────────────────────────────────────────────────────────┐
│  Module 1.2: Context and Memory                              │
│                                                              │
│  [WHY]  [WHAT]  [HOW]                    ◐ In Progress       │
│    ○      ●      ○                                           │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │  [Main Content Area]                                   │  │
│  │                                                        │  │
│  │  Current Section: WHAT                                 │  │
│  │                                                        │  │
│  │  ...content...                                        │  │
│  │                                                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  [← Prev: Module 1.1]              [Next: Section HOW →]    │
└─────────────────────────────────────────────────────────────┘
```

### Breadcrumb Pattern

```
Curriculum > Phase 1: AI Literacy > Module 1.2: Context and Memory > WHAT
```

---

## Page Templates

### 1. Dashboard Template

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Welcome back, [Name]!                              [Streak: 🔥 7 days] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐      │
│  │  CONTINUE LEARNING          │  │  TODAY'S GOAL               │      │
│  │                             │  │                             │      │
│  │  Module 1.2: Context        │  │  ████████░░░░ 23/30 min     │      │
│  │  Section: WHAT              │  │                             │      │
│  │  [Resume →]                 │  │  [Adjust Goal]              │      │
│  └─────────────────────────────┘  └─────────────────────────────┘      │
│                                                                         │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐      │
│  │  REVIEW QUEUE (3 items)     │  │  OVERALL PROGRESS           │      │
│  │                             │  │                             │      │
│  │  • Token Economics          │  │  Phase 1 ████████░░ 70%     │      │
│  │  • Context Windows          │  │  Phase 2 ░░░░░░░░░░ 0%      │      │
│  │  • Provider Selection       │  │  Phase 3 ░░░░░░░░░░ 0%      │      │
│  │                             │  │  Phase 4 ░░░░░░░░░░ 0%      │      │
│  │  [Start Review →]           │  │                             │      │
│  └─────────────────────────────┘  └─────────────────────────────┘      │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  QUICK ACTIONS                                                   │   │
│  │                                                                  │   │
│  │  [🧪 Open Sandbox]  [📚 View Syllabus]  [📁 My Portfolio]       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Module Content Template

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Sidebar]  │                    [Main Content]                         │
│             │                                                           │
│  Phase 1    │  Module 1.1: Economics of Intelligence                    │
│  ─────────  │  ──────────────────────────────────────                   │
│  ○ Overview │                                                           │
│  ● M1.1 ◐   │  [WHY]  [WHAT]  [HOW]      Est: 12 min    Progress: ◐    │
│  ○ M1.2     │                                                           │
│  ○ M1.3     │  ┌─────────────────────────────────────────────────────┐ │
│  ○ M1.4     │  │                                                      │ │
│  ─────────  │  │  ## WHY This Matters                                 │ │
│  ○ Lab 1    │  │                                                      │ │
│  ○ Lab 2    │  │  You're about to learn something that will change   │ │
│  ─────────  │  │  how you think about AI costs...                    │ │
│  ○ Deliver  │  │                                                      │ │
│             │  │  [Concept Card: Tokens]                             │ │
│             │  │                                                      │ │
│             │  │  ...more content...                                 │ │
│             │  │                                                      │ │
│             │  └─────────────────────────────────────────────────────┘ │
│             │                                                           │
│             │  [← Previous Module]    [Mark Complete]    [Next →]      │
│             │                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3. Lab Exercise Template

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Lab 1: Persona Stress Test                           Phase 1 | Lab    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  SCENARIO                                                        │   │
│  │                                                                  │   │
│  │  You've been asked to test whether different AI personas        │   │
│  │  produce meaningfully different outputs...                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  INSTRUCTIONS                                                    │   │
│  │                                                                  │   │
│  │  1. Open the AI Sandbox with Gen-Z persona                      │   │
│  │  2. Ask it to explain your product to its friends               │   │
│  │  3. Switch to Investor persona and ask the same question        │   │
│  │  4. Compare the outputs in the comparison table below           │   │
│  │                                                                  │   │
│  │  [Open AI Sandbox →]                                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  YOUR WORK                                                       │   │
│  │                                                                  │   │
│  │  | Persona    | Key Differences | Usefulness Rating |           │   │
│  │  |------------|-----------------|-------------------|           │   │
│  │  | Gen-Z      | [editable]      | [1-5 selector]    |           │   │
│  │  | Investor   | [editable]      | [1-5 selector]    |           │   │
│  │  | FDA Officer| [editable]      | [1-5 selector]    |           │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [Save Progress]                              [Submit Lab →]           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4. Sandbox Template

```
┌─────────────────────────────────────────────────────────────────────────┐
│  AI Sandbox                     [Persona: Gen-Z ▼]    [Context: Free ▼] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  [Chat History Area]                                            │   │
│  │                                                                  │   │
│  │  You: Explain tokens to me                                      │   │
│  │                                                                  │   │
│  │  AI (Gen-Z): Okay so like, tokens are basically how AI         │   │
│  │  models "see" text? It's kinda like... instead of reading      │   │
│  │  whole words, they break everything into these little pieces    │   │
│  │  called tokens...                                               │   │
│  │                                                                  │   │
│  │  Tokens used: 127 (~$0.0003)                                    │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  [Type your message...]                              [Send →]    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Session: 342 tokens | Est. cost: $0.0008 | Provider: OpenAI GPT-4o    │
│                                                                         │
│  [Save to Prompt Library]  [New Session]  [⚙️ BYOK Settings]           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Inventory

### Learning Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ModuleContent` | Module pages | Renders WHY-WHAT-HOW content |
| `ConceptCard` | Within modules | Interactive concept definitions |
| `QuizBlock` | HOW sections | Active recall questions |
| `ChecklistBlock` | Module completion | Trackable checklists |
| `ExerciseBlock` | HOW sections | Interactive exercises |
| `LabInstructions` | Lab pages | Step-by-step lab guidance |
| `RubricPreview` | Deliverable pages | Assessment criteria |

### Interactive Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `AIChatSandbox` | Sandbox, Labs | AI conversation interface |
| `PersonaSelector` | Sandbox | Switch AI personas |
| `PromptEditor` | Sandbox, Labs | Monaco-based prompt editing |
| `PromptLibrary` | Portfolio | Saved prompts browser |
| `BYOKSetup` | Settings, Onboarding | API key configuration |

### Progress Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ProgressRing` | Dashboard, Sidebar | Visual progress indicator |
| `StreakBadge` | Dashboard, Header | Streak display |
| `PhaseProgress` | Curriculum overview | Phase-level progress |
| `ReviewQueue` | Dashboard, Progress | Spaced repetition items |
| `CompetencyMap` | Progress | Bloom's taxonomy visualization |

### Layout Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `LearningLayout` | All learning pages | Sidebar + content structure |
| `Sidebar` | Learning context | Curriculum navigation |
| `Header` | Global | Primary navigation |
| `Breadcrumbs` | Content pages | Location indicator |

---

## Responsive Behavior

### Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | <640px | Sidebar hidden, hamburger menu |
| Tablet | 640-1024px | Collapsible sidebar |
| Desktop | >1024px | Full sidebar visible |

### Mobile Navigation

```
┌───────────────────────────┐
│  ☰  AI Analyst Academy   │
├───────────────────────────┤
│                           │
│  [Main Content Area]      │
│                           │
│  [Full width on mobile]   │
│                           │
│                           │
├───────────────────────────┤
│  [← Prev]    [Next →]     │
└───────────────────────────┘
```

---

## Accessibility Structure

### Landmark Regions

```html
<header role="banner">
  <!-- Primary navigation -->
</header>

<nav role="navigation" aria-label="Curriculum">
  <!-- Sidebar navigation -->
</nav>

<main role="main">
  <!-- Page content -->
</main>

<aside role="complementary">
  <!-- Progress, quick actions -->
</aside>

<footer role="contentinfo">
  <!-- Footer content -->
</footer>
```

### Heading Hierarchy

| Level | Usage |
|-------|-------|
| h1 | Page title (one per page) |
| h2 | Major sections (WHY, WHAT, HOW) |
| h3 | Subsections within major sections |
| h4 | Concept card titles, quiz questions |

### Keyboard Navigation

- Tab: Move between interactive elements
- Enter/Space: Activate buttons, links
- Arrow keys: Navigate within components (tabs, dropdowns)
- Escape: Close modals, dropdowns
- Skip link: Jump to main content

---

## Next Steps

1. **Wireframes**: Create low-fidelity wireframes for key templates
2. **Design Tokens**: Define typography, colors, spacing
3. **Prototype**: Build interactive prototype of key flows
4. **User Testing**: Validate IA with representative users

# AI Analyst Academy — Implementation Progress

> **Last Updated:** 2026-01-16
> **Purpose:** Single source of truth for implementation status. Reference this document before starting any development work.

---

## Quick Status Overview

| Area | Status | Completion |
|------|--------|------------|
| Core Learning Flow | **Production Ready** | 95% |
| Authentication | **Production Ready** | 100% |
| Content System | **Production Ready** | 100% |
| Curriculum Coverage | **Complete** | 100% |
| Progress Tracking | **Production Ready** | 90% |
| AI Sandbox | **Production Ready** | 95% |
| Portfolio | **Production Ready** | 85% |
| Onboarding | **Production Ready** | 100% |

### Curriculum Assessment

> **Verdict:** This is a specialized vocational training program for AI Analysts, not a generic AI course.

The curriculum maps **100%** of the "Business Engineer/Operator" persona skills directly to labs. All curriculum gaps have been filled with the addition of three new labs (3b, 5b, 7b).

---

## Implemented Features

### Routes — Fully Functional

| Route | Description | Status | Notes |
|-------|-------------|--------|-------|
| `/` | Landing page | Done | Hero, features, phase overview |
| `/learn` | Curriculum overview | Done | All phases, modules, labs listed |
| `/learn/phase/[phase]` | Phase overview (1-4) | Done | Modules, labs, progress indicators |
| `/learn/phase/[phase]/[module]` | Module content | Done | WHY-WHAT-HOW sections, concepts, exercises |
| `/learn/lab/[slug]` | Lab exercises | Done | 10 labs + capstone |
| `/syllabus` | Course syllabus | Done | Full curriculum structure |
| `/auth/login` | Login page | Done | Email/password (OAuth disabled) |
| `/auth/signup` | Registration | Done | Email/password only |
| `/auth/callback` | OAuth callback | Done | Ready for OAuth enablement |
| `/auth/logout` | Logout | Done | Session termination |
| `/settings` | User profile | Done | Protected route |
| `/settings/api-keys` | BYOK management | Done | API key storage ready |
| `/onboarding` | Onboarding router | Done | Redirects based on progress |
| `/onboarding/role-selection` | Persona selection | Done | 4 personas with path recommendations |
| `/onboarding/goal-setting` | Daily goal | Done | 15-90 min options |
| `/onboarding/api-setup` | BYOK intro | Done | Links to settings/api-keys |
| `/progress` | Progress dashboard | Done | Review queue, spaced repetition, achievements |
| `/portfolio` | Portfolio page | Done | Full CRUD for deliverables |
| `/portfolio/prompts` | Prompt library | Done | CRUD for saved prompts |
| `/sandbox` | AI chat | Demo | Multiple personas, demo mode only |
| `/style-guide` | Design system | Done | Token reference |

### Components — Production Ready

| Category | Components | Status |
|----------|-----------|--------|
| Layout | Header, Sidebar, LearningLayout | Done |
| Learning | ModuleContent, SectionNav, ConceptCard, ExerciseBlock, ChecklistBlock, SectionProgress, SectionDivider, RelatedModules, ContinueButton | Done |
| Progress | ProgressRing, ProgressBar | Done |
| UI | SearchBox, Skeleton, CardSkeleton, ModuleSkeleton, LabSkeleton | Done |

### Content System — Production Ready

| Feature | Status | Notes |
|---------|--------|-------|
| Markdown processing | Done | Uses marked + gray-matter |
| Build-time generation | Done | `pnpm run build:content` |
| 6 Phases | Done | All content files present |
| 26 Modules | Done | WHY-WHAT-HOW structure (includes 1.6, 5.5) |
| 14 Labs + Capstone | Done | Full exercises (includes 7c, 8) |
| Search index | Done | Infrastructure ready |

### Database Schema — Complete

| Table | Purpose | UI Integration |
|-------|---------|----------------|
| `user_profiles` | User metadata, streaks, goals | Done |
| `module_progress` | Module completion, spaced repetition | Done |
| `lab_progress` | Lab submissions, scoring | Done |
| `phase_deliverables` | Phase deliverables | Done |
| `capstone_projects` | Capstone management | Not wired |
| `sandbox_sessions` | AI chat history | Not wired |
| `saved_prompts` | Prompt library | Not wired |
| `review_queue` | Spaced repetition items | Done |
| `user_api_keys` | Encrypted API keys | Done |

### Authentication — Production Ready

| Feature | Status | Notes |
|---------|--------|-------|
| Email/password | Done | Enabled in features.ts |
| Google OAuth | Ready | Feature-flagged off |
| GitHub OAuth | Ready | Feature-flagged off |
| Session management | Done | Supabase SSR |
| Protected routes | Done | Settings, progress, portfolio, sandbox |
| Redirect after login | Done | Preserves original destination |

---

## Curriculum Coverage (Complete)

The curriculum now covers **100%** of the "Business Operator" roadmap with 14 labs plus a capstone project.

### Complete Lab Structure

| Lab | Title | Phase | Bloom's Level | Roadmap Alignment |
|-----|-------|-------|---------------|-------------------|
| 1 | Persona Stress Test | 1 | Evaluate | ✅ |
| 2 | Chain of Thought Audit | 1 | Analyze | ✅ |
| 3 | Workflow Mapping | 2 | Analyze | ✅ |
| 3b | Data Hygiene & Preparation | 2 | Apply | ✅ |
| 4 | Quality Gate Design | 2 | Create | ✅ |
| 5 | Build AI Assistant | 3 | Apply | ✅ |
| **5b** | **Multi-Agent Orchestration** | **3** | **Create** | ✅ **UPGRADED** |
| 6 | ROI Calculator | 4 | Evaluate | ✅ |
| 7 | Governance Framework | 4 | Create | ✅ |
| 7b | Agentic Research: Trust but Verify | 4 | Evaluate | ✅ |
| **7c** | **Crisis Response Simulation** | **4** | **Evaluate** | ✅ **NEW** |
| **8** | **Stakeholder Simulation** | **5** | **Apply** | ✅ **NEW** |
| 9 | Executive Pitch | 5 | Create | ✅ |
| 10 | Team Capability Assessment | 5 | Analyze | ✅ |
| 11 | Vertical Deep Dive | 6 | Analyze | ✅ |
| 12 | Portfolio Prioritization | 6 | Create | ✅ |
| — | Capstone Project | All | Create | ✅ |

### Alignment Matrix (All Gaps Filled)

| Roadmap Exercise | Lab | Status |
|------------------|-----|--------|
| Ex 1: Persona Stress Test | Lab 1: Persona Stress Test | ✅ |
| Ex 2: Chain of Thought | Lab 2: Chain of Thought Audit | ✅ |
| Ex 3: SOP Translation | Lab 3: Workflow Mapping | ✅ |
| Ex 4: Unstructured Data | Lab 3b: Data Hygiene | ✅ |
| Ex 5: Multi-Agent Systems | Lab 5b: Multi-Agent Orchestration | ✅ |
| Ex 6: Buy vs. Build Memo | Lab 6: ROI Calculator | ✅ |
| Ex 7: Agentic Research | Lab 7b: Agentic Research | ✅ |

### Strategic Updates (2026-01-12)

**Phase 3 Renamed: "Agentic Orchestration"**
- Previously: "Implementation"
- Now: "Agentic Orchestration" — Better reflects the autonomous agent focus
- All documentation and source files updated

**Module 3.5: Customization & Fine-Tuning** (Phase 3, 45 min) — *NEW*
- RAG vs Fine-Tuning economics and decision framework
- When customization is worth the investment
- Hybrid approaches for production systems
- ROI calculation for model customization

**Interactive Component Specs Documented**
- Context Window Visualizer (live token counting)
- Token Economics Calculator (provider comparison)
- Risk Matrix Builder (drag-and-drop assessment)
- Full specs at: `docs/design/interactive-component-specs.md`

### New Labs Added (2026-01-12)

**Lab 3b: Data Hygiene & Preparation** (Phase 2, 45 min)
- Transforms unstructured data into AI-ready formats
- Teaches "Garbage In, Garbage Out" principle
- Includes validation for LLM hallucinations
- Documents repeatable data preparation pipelines

**Lab 5b: Multi-Agent Orchestration** (Phase 3, 90 min) — *UPGRADED*
- Designs multi-agent systems with Worker/Manager patterns
- Implements inter-agent communication protocols
- Builds quality gates and verification loops
- Creates fault-tolerant agent orchestration
- Compares single-agent vs multi-agent approaches

**Lab 7b: Agentic Research — Trust but Verify** (Phase 4, 55 min)
- Uses agentic AI tools (Perplexity, ChatGPT browsing) for research
- Manually verifies AI-generated citations
- Identifies hallucination patterns in agentic outputs
- Designs verification protocols for organizational use

### SWOT Response Additions (2026-01-16)

Based on analysis of the curriculum against post-consulting research ("The Cognitive Foundry"), the following content was added to address identified gaps.

**Module 1.6: AI Mental Models** (Phase 1, 15 min) — *NEW*
- Addresses "Cockpit Child" risk: operators who use AI without understanding mechanics
- How LLMs actually work: tokens, attention, context windows
- Known failure modes: hallucination patterns, reasoning limits
- Building validation intuition: when to trust vs. verify

**Lab 7c: Crisis Response Simulation** (Phase 4, 75 min) — *UPDATED*
- Compressed crisis experience: "5 years of rare events in one lab"
- Five scenarios: Data Breach, Failed Pilot, Scope Creep, Ethics Alarm, **Data Betrayal**
- Time-pressured decision making with incomplete information
- Creates Crisis Response Playbook deliverable
- **New:** Data Betrayal scenario — recovering from AI-induced errors mid-presentation

**Module 5.5: Stakeholder Conversations: Observed** (Phase 5, 20 min) — *NEW*
- Addresses tacit knowledge gap: "observation before action" pedagogy
- Three expert conversation case studies with detailed analysis
- Patterns extraction: timing, tone, recovery moves
- Bridges theory (5.1-5.4) and practice (Lab 8)
- Based on research showing professionals learn best by observing experts first

**Lab 8: Stakeholder Simulation** (Phase 5, 75 min) — *NEW*
- AI-powered practice conversations with difficult stakeholders
- Five persona types: Skeptical CFO, Burned IT Leader, Budget Guardian, Vague Executive, Hostile Stakeholder
- Uses existing Sandbox infrastructure with structured prompts
- Self-evaluation rubrics and reflection questions

**Portfolio Certification Framework** — *NEW*
- Competency-based certification across 4 levels: Foundation, Practitioner, Leader, Master
- Rubric-based assessment for all phase deliverables
- Documentation at: `docs/certification/`

**Sandbox Stakeholder Personas** — *NEW*
- 5 new personas added for stakeholder practice
- Integrated into existing Sandbox with full system prompts
- Designed to work with Lab 8 but available for general practice

---

### Capstone Recommendations

With all gaps filled, consider updating Capstone requirements:
- Should include **both** a chatbot component **and** an automated workflow
- Should demonstrate data preparation/validation step (from Lab 3b)
- Should include agentic research with citation verification (from Lab 7b)
- Rubric should assess integration architecture, not just chat quality

---

## Not Yet Implemented

### High Priority — Core Functionality Gaps

| Feature | Documented In | Complexity | Dependencies |
|---------|---------------|------------|--------------|
| ~~**Progress data persistence**~~ | user-journeys.md | Medium | ✅ Done |
| ~~**Spaced repetition engine**~~ | user-journeys.md | High | ✅ Done (SM-2 algorithm) |
| ~~**Real AI sandbox integration**~~ | sitemap.md | Medium | ✅ Done (OpenAI, Anthropic, Google) |
| ~~**Search functionality wiring**~~ | sitemap.md | Low | ✅ Done (+ keyboard shortcuts) |

### Medium Priority — User Journey Gaps

| Feature | Documented In | Complexity | Dependencies |
|---------|---------------|------------|--------------|
| ~~**Redirect new users to onboarding**~~ | user-journeys.md | Low | ✅ Done |
| ~~**Streak tracking**~~ | user-journeys.md | Medium | ✅ Done |
| ~~**Review queue UI**~~ | user-journeys.md | Medium | ✅ Done (SM-2, rating buttons) |
| ~~**Deliverable submission**~~ | sitemap.md | Medium | ✅ Done (full CRUD in /portfolio) |

### Lower Priority — Enhanced Features

| Feature | Documented In | Complexity | Dependencies |
|---------|---------------|------------|--------------|
| `/progress/phase/[number]` | sitemap.md | Low | module_progress queries |
| `/progress/competencies` | sitemap.md | Medium | Bloom's taxonomy mapping |
| `/progress/review-queue` | sitemap.md | Medium | Spaced repetition |
| `/progress/time-tracking` | sitemap.md | Medium | Session timing |
| ~~`/portfolio/prompts`~~ | ~~sitemap.md~~ | ~~Low~~ | ~~saved_prompts queries~~ **Done** |
| `/portfolio/export` | sitemap.md | Medium | PDF/HTML generation |
| `/sandbox/persona/[name]` | sitemap.md | Low | Persona context loading |
| `/sandbox/lab/[slug]` | sitemap.md | Low | Lab context loading |
| Achievement/badge system | user-journeys.md | Medium | New table needed |
| Password reset flow | sitemap.md | Low | Supabase auth |
| Notifications/reminders | user-journeys.md | Medium | New infrastructure |

---

## Implementation Roadmap

### Phase 1: Data Integration (Essential) — ✅ COMPLETE

Connect existing UI to database. **All core items done.**

1. ~~**Wire module progress**~~ — ✅ Done (auto-save with debounce)
2. ~~**Wire lab progress**~~ — ✅ Done (auto-save with debounce)
3. **Enable real sandbox** — Connect to AI providers using stored API keys
4. ~~**Wire search**~~ — ✅ Done (+ "/" and Cmd/Ctrl+K shortcuts, mobile modal)
5. ~~**Streak calculation**~~ — ✅ Done (calculateStreak + updateUserStreak utilities)

### Phase 2: Onboarding & Engagement — ✅ COMPLETE

Complete user onboarding and engagement features.

1. ~~**Role selection page**~~ — ✅ Done (persona selection with 4 options)
2. ~~**Goal setting page**~~ — ✅ Done (15-90 minute daily goals)
3. ~~**BYOK setup integration**~~ — ✅ Done (intro page linking to settings/api-keys)
4. ~~**Redirect new users to onboarding**~~ — ✅ Done (auth callback checks onboarding_completed)
5. ~~**Review queue UI**~~ — ✅ Done (due items, upcoming items, rating buttons)
6. ~~**Basic spaced repetition**~~ — ✅ Done (SM-2 algorithm with ease factor and intervals)

### Phase 3: Portfolio & Deliverables

Enable portfolio and deliverable submission. **Estimated scope: 4-5 features**

1. **Deliverable submission forms** — Per-phase deliverables
2. **Prompt library management** — CRUD for saved_prompts
3. **Portfolio public view** — Share capability
4. **Export functionality** — PDF/HTML generation

### Phase 4: Advanced Features

Polish and advanced functionality. **Estimated scope: varies**

- Competency mapping (Bloom's taxonomy)
- Time tracking and analytics
- Achievement/badge system
- Peer review (future)
- OAuth enablement (Google, GitHub)

---

## UX Polish Items

### Visual Variety in Content

**Current state:** Content has ConceptCards, ExerciseBlocks, ChecklistBlocks, and SectionDividers for visual breaks. However, long text sections within WHY/WHAT/HOW lack inline callouts.

**Recommended additions:**

1. **KeyInsight component** — Highlighted callout box for important takeaways
   - Use within markdown: `:::insight[optional-title]\nImportant point here\n:::`
   - Visually distinct: accent border, icon, background tint
   - Add to `scripts/build-content.ts` block parser

2. **Diagram placeholders** — Structured image/diagram blocks
   - Use within markdown: `:::diagram[alt-text]\n![](path/to/image.svg)\n:::`
   - Centered, with caption support

3. **Quote/Callout variants** — Warning, tip, note styles
   - `:::tip`, `:::warning`, `:::note` block types

**Files to modify:**
- `scripts/build-content.ts` — Add block parsing
- `src/lib/content/types.ts` — Add types if needed
- `src/lib/components/learning/` — New component(s)

### Empty States

**Current state:** Portfolio and Progress pages have basic empty states with icon + text + CTA.

**Recommended improvements:**

| Page | Current | Recommended |
|------|---------|-------------|
| `/portfolio` | Generic briefcase icon | Personalized message based on progress ("Complete your first lab to add a deliverable") |
| `/progress` | "No activity" text | Encouraging copy + suggested first step + illustration |
| `/sandbox` (no API key) | Demo mode badge | Clear path to BYOK setup with benefit explanation |

**Design guidance:**
- Use illustration or character, not just icons
- Show concrete next action, not just "get started"
- Match phase colors where applicable

---

## Feature Flags Reference

Located in `src/lib/config/features.ts`:

```typescript
export const features = {
  auth: {
    googleOAuth: false,    // Ready, disabled
    githubOAuth: false,    // Ready, disabled
    emailPassword: true    // Active
  },
  aiProviders: {
    openai: true,          // Active (demo mode)
    anthropic: true,       // Active (demo mode)
    google: true           // Active (demo mode)
  }
}
```

---

## Database Tables Quick Reference

| Table | Ready | UI Wired | Purpose |
|-------|-------|----------|---------|
| `user_profiles` | Yes | Yes | User metadata, streaks |
| `user_api_keys` | Yes | Yes | BYOK storage |
| `module_progress` | Yes | Yes | Module tracking |
| `lab_progress` | Yes | Yes | Lab tracking |
| `phase_deliverables` | Yes | Yes | Deliverables |
| `capstone_projects` | Yes | No | Capstone |
| `sandbox_sessions` | Yes | No | Chat history |
| `saved_prompts` | Yes | Yes | Prompt library |
| `review_queue` | Yes | Yes | Spaced repetition |

---

## Files to Reference

### Before Starting Any Feature

1. **This document** — Check implementation status
2. `CLAUDE.md` — Development guidelines, Svelte 5 patterns
3. `docs/design/sitemap.md` — Route structure and templates
4. `docs/design/user-journeys.md` — User flow requirements
5. `src/lib/types/database.ts` — Database schema

### Component Development

- `docs/development/component-api.md` — Component props and usage
- `docs/development/svelte5-patterns.md` — Runes, effects, state
- `docs/DESIGN_TOKENS.md` — CSS custom properties

### Content Changes

- `content/curriculum/` — Markdown source files
- `src/lib/content/loader.ts` — Content loading utilities
- `src/lib/content/types.ts` — Content type definitions
- `docs/design/academic-alignment.md` — Bloom's taxonomy and competency mapping

---

## Quick Commands

```bash
# Verify everything works
pnpm run check && pnpm run build && pnpm run dev

# Rebuild content after markdown changes
pnpm run build:content

# Test key routes
# /
# /learn
# /learn/phase/1
# /learn/phase/1/1.1-economics-of-intelligence
# /learn/lab/lab-1-persona-stress-test
```

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-16 | **Cognitive Foundry Deep Research Response** — Added Module 5.5 (Stakeholder Conversations: Observed) for tacit knowledge transfer via "observation before action" pedagogy; Added Crisis 5 "Data Betrayal" scenario to Lab 7c for recovering from AI-induced errors | Claude |
| 2026-01-16 | **SWOT Response Implementation** — Added Module 1.6 (AI Mental Models), Lab 8 (Stakeholder Simulation), Lab 7c (Crisis Response), Portfolio Certification Framework, 5 new stakeholder personas in Sandbox. Full plan in `docs/plans/swot-response-plan.md` | Claude |
| 2026-01-13 | **Prompt Library Complete** — `/portfolio/prompts` with full CRUD, search, category filtering, copy to clipboard; wired to `saved_prompts` table; added navigation link from portfolio page | Claude |
| 2026-01-12 | **Deliverable Submission Complete** — Verified full CRUD in /portfolio; create, update, delete actions; phase selection; mark complete functionality; updated progress status to 85% | Claude |
| 2026-01-12 | **Review Queue & Spaced Repetition** — Review queue UI with SM-2 algorithm; due/upcoming items; rating buttons (Forgot, Hard, Good, Easy); ease factor and interval tracking | Claude |
| 2026-01-12 | **Data Integration Complete** — Module/lab progress persistence with auto-save; streak tracking; search wired with keyboard shortcuts (/, Cmd+K) and mobile modal; new user redirect to onboarding | Claude |
| 2026-01-12 | **Onboarding Flow Complete** — Role selection (4 personas), goal setting (15-90 min), API setup intro pages; router with progress-based redirects | Claude |
| 2026-01-12 | **Strategic Evolution** — Phase 3 renamed to "Agentic Orchestration", Module 3.5 added, Lab 5b upgraded to Multi-Agent Orchestration, interactive component specs documented | Claude |
| 2026-01-12 | **Curriculum 100% complete** — Added labs 3b, 5b, 7b; all gaps filled | Claude |
| 2026-01-12 | Expanded curriculum gaps with alignment matrix, Gap C (agentic research), exercise specs | Claude |
| 2026-01-12 | Added curriculum gaps section (data hygiene, workflow automation) | Claude |
| 2026-01-12 | Added academic alignment documentation | Claude |
| 2026-01-12 | Added UX Polish section (visual variety, empty states) | Claude |
| 2026-01-12 | Initial progress document created | Claude |

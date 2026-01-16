# SWOT Response Implementation Plan

> **Created:** 2026-01-16
> **Status:** In Progress
> **Reference:** [docs/audits/learning-content-swot-analysis.md](../audits/learning-content-swot-analysis.md)

---

## Overview

This plan addresses the gaps identified in the SWOT analysis of our learning content against post-consulting research ("The Cognitive Foundry"). Four priority items plus a deferred items roadmap.

---

## Priority 1: AI Mental Models Module

**Gap Addressed:** "Cockpit Child" risk — learners using AI without understanding *why* it works

### Placement
- **New Module:** `1.6-ai-mental-models`
- **Phase:** 1 (AI Literacy)
- **Position:** After 1.5 (Problem Classification), before Phase 1 labs
- **Estimated Time:** 15 minutes

### Content Structure

```
Module 1.6: AI Mental Models
├── WHY: The Cockpit Child Problem
│   └── Why understanding mechanics matters for validation
├── WHAT: How LLMs Actually Work
│   ├── Concept: Tokens and Tokenization
│   ├── Concept: Attention and Context Windows
│   ├── Concept: Training vs. Inference
│   └── Concept: Temperature and Sampling
├── WHAT: Known Failure Modes
│   ├── Hallucination patterns and causes
│   ├── Reasoning limits (math, logic, recent events)
│   ├── Sycophancy and confirmation bias
│   └── Context window overflow
├── HOW: Building Validation Intuition
│   ├── Exercise: Spotting confident-but-wrong outputs
│   ├── Exercise: Testing model limits
│   └── Checklist: When to trust vs. verify
└── Self-Check
```

### Key Concepts to Define
1. **Token** — The unit of text LLMs process (not words, not characters)
2. **Attention** — How models decide what context matters
3. **Hallucination** — Confident generation of false information
4. **Temperature** — Randomness in output generation
5. **Context Window** — The "working memory" limit

### Files to Create/Modify
- [ ] `content/curriculum/phases/01-ai-literacy/1.6-ai-mental-models.md` (NEW)
- [ ] `content/curriculum/phases/01-ai-literacy/_phase.yaml` (add module)
- [ ] Update Phase 1 module count references

---

## Priority 2: Stakeholder Conversation Labs

**Gap Addressed:** Limited client conversation practice — teaches frameworks but no real-time practice

### Approach
Create scenario-based labs that use the existing Sandbox infrastructure with structured prompts that make the AI play difficult stakeholder personas.

### New Lab: Lab 8 — Stakeholder Simulation

**Placement:** Phase 5 (AI Leadership), after Module 5.4

**Lab Structure:**
```
Lab 8: Stakeholder Simulation
├── Overview: Practice conversations with difficult stakeholders
├── Part 1: The Skeptical CFO
│   ├── Scenario briefing
│   ├── Persona prompt to load into Sandbox
│   ├── Conversation objectives
│   └── Self-evaluation rubric
├── Part 2: The Burned IT Leader
│   ├── Scenario briefing
│   ├── Persona prompt to load into Sandbox
│   ├── Conversation objectives
│   └── Self-evaluation rubric
├── Part 3: The Budget Guardian
│   ├── Scenario briefing
│   ├── Persona prompt to load into Sandbox
│   ├── Conversation objectives
│   └── Self-evaluation rubric
├── Part 4: Discovery Interview Practice
│   ├── Open-ended stakeholder scenario
│   ├── Discovery interview objectives
│   └── Active listening evaluation
└── Deliverable: Conversation transcripts with self-reflection
```

### Sandbox Personas to Add
Add these to the Sandbox persona selection:

| Persona | Description | Use Case |
|---------|-------------|----------|
| Skeptical CFO | Risk-averse, ROI-focused, burned by past tech investments | Budget justification, ROI defense |
| Burned IT Leader | Previous AI project failed, technical skeptic | Technical objection handling |
| Budget Guardian | Protects department budget, fears headcount reduction | Change management, job security concerns |
| Vague Executive | Has unclear requirements, changes direction | Discovery interview practice |
| Hostile Stakeholder | Actively opposes the initiative, political motivations | Conflict de-escalation |

### Files to Create/Modify
- [ ] `content/curriculum/labs/lab-8-stakeholder-simulation.md` (NEW)
- [ ] `content/curriculum/phases/05-ai-leadership/_phase.yaml` (add lab)
- [ ] `src/routes/sandbox/+page.svelte` (add stakeholder personas)
- [ ] `src/routes/api/chat/+server.ts` (add persona system prompts)

---

## Priority 3: Portfolio Certification Framework

**Gap Addressed:** Need to formalize portfolio deliverables into competency-based certification

### Framework Structure

```
AI Analyst Certification
├── Foundation Track (Phases 1-2)
│   ├── Prompt Library (Phase 1 Deliverable)
│   └── Workflow Automation Proposal (Phase 2 Deliverable)
├── Implementation Track (Phases 3-4)
│   ├── AI Assistant Build (Phase 3 Deliverable)
│   └── AI Strategy Presentation (Phase 4 Deliverable)
├── Leadership Track (Phases 5-6)
│   ├── AI Initiative Proposal (Phase 5 Deliverable)
│   └── Enterprise AI Roadmap (Phase 6 Deliverable)
└── Capstone: Integrated AI Solution
```

### Certification Criteria per Deliverable

Each deliverable has:
1. **Required Elements** — Must-have components
2. **Quality Rubric** — Evaluation criteria (1-4 scale)
3. **Competencies Demonstrated** — Skills validated
4. **Portfolio Review Checklist** — Self-assessment before submission

### Files to Create
- [ ] `docs/certification/README.md` — Certification overview
- [ ] `docs/certification/foundation-track.md` — Phases 1-2 criteria
- [ ] `docs/certification/implementation-track.md` — Phases 3-4 criteria
- [ ] `docs/certification/leadership-track.md` — Phases 5-6 criteria
- [ ] `docs/certification/capstone-criteria.md` — Capstone requirements
- [ ] `docs/certification/rubrics/` — Detailed rubrics per deliverable

### UI Integration (Future)
- Portfolio page shows certification progress
- Deliverable submission includes self-assessment against rubric
- "Request Review" functionality (future: peer review or AI evaluation)

---

## Priority 4: Crisis Scenario Labs

**Gap Addressed:** No compressed crisis/rare event experience for judgment building

### New Lab: Lab 7c — Crisis Response Simulation

**Placement:** Phase 4 (Strategy & Economics), after Lab 7b

**Lab Structure:**
```
Lab 7c: Crisis Response Simulation
├── Overview: Practice high-pressure AI-related crises
├── Part 1: The Data Breach
│   ├── Scenario: AI system exposed customer data
│   ├── Timeline: Events unfold over 72 hours (compressed)
│   ├── Stakeholder communications to draft
│   └── Decision points with consequences
├── Part 2: The Failed Pilot
│   ├── Scenario: High-profile AI pilot failed publicly
│   ├── Stakeholder: Angry executive sponsor
│   ├── Root cause analysis under pressure
│   └── Recovery plan presentation
├── Part 3: The Scope Creep
│   ├── Scenario: Project scope doubled without budget increase
│   ├── Negotiation with demanding stakeholder
│   ├── Trade-off documentation
│   └── Expectation reset communication
├── Part 4: The Ethics Alarm
│   ├── Scenario: AI system producing biased outputs
│   ├── Immediate response vs. thorough investigation
│   ├── Communication to affected parties
│   └── Remediation plan
└── Deliverable: Crisis playbook with response templates
```

### Design Principles
- **Time Pressure:** Scenarios have deadlines (simulated)
- **Incomplete Information:** Learners must decide with uncertainty
- **Consequence Visibility:** Choices affect subsequent scenarios
- **Reflection Required:** Post-crisis analysis of decisions

### Files to Create/Modify
- [ ] `content/curriculum/labs/lab-7c-crisis-response.md` (NEW)
- [ ] `content/curriculum/phases/04-strategy-economics/_phase.yaml` (add lab)

---

## Deferred Items Roadmap

### Deferred: Enterprise/B2B Offering

**Why Deferred:** High effort, requires sales infrastructure
**Prerequisites:** Core curriculum gaps addressed, initial user feedback
**Future Scope:**
- Bulk seat licensing
- Manager dashboard for team progress
- Customizable content for firm-specific tools
- White-label option for consulting firms
- Completion certificates with verification

**Target Customers:**
- Boutique consulting firms (10-50 people)
- Corporate AI/Digital teams
- L&D departments at mid-size companies

### Deferred: Full Crisis Simulation Platform

**Why Deferred:** Significant engineering for marginal benefit over Lab 7c
**Future Vision:**
- Real-time multi-actor simulations
- AI-powered stakeholder agents with persistent state
- Branching scenarios based on decisions
- Performance analytics and benchmarking

**Trigger to Revisit:** After Lab 7c validates demand for crisis training

### Deferred: VR/Third-Party Simulation Integration

**Why Deferred:** Interesting but not essential; Claude-based practice gives 80% value
**Future Options:**
- Hyperbound (sales/client conversation simulation)
- Bodyswaps (soft skills VR training)
- Custom WebRTC-based video role-play

**Trigger to Revisit:** If user feedback indicates text-based practice insufficient

### Deferred: Advanced Certification Tiers

**Why Deferred:** Base certification framework must be validated first
**Future Tiers:**
- **Specialist Certifications:**
  - AI Governance Specialist
  - Orchestration Architect
  - AI Strategy Lead
- **Renewal Requirements:** Annual continuing education
- **Peer Review System:** Certified analysts review each other's portfolios

---

## Implementation Sequence

### Week 1: Content Creation
1. ✅ Create plan document (this file)
2. Create Module 1.6: AI Mental Models
3. Create Lab 8: Stakeholder Simulation
4. Create Lab 7c: Crisis Response Simulation

### Week 2: Integration & Documentation
5. Update phase YAML files with new content
6. Add stakeholder personas to Sandbox
7. Create certification framework documentation
8. Update PROGRESS.md with new items

### Week 3: Testing & Polish
9. Build and test all new content renders correctly
10. Verify navigation and progress tracking
11. Review for consistency with existing content
12. Final documentation updates

---

## Success Metrics

| Item | Success Indicator |
|------|-------------------|
| AI Mental Models | Learners can explain why AI fails, not just how to use it |
| Stakeholder Labs | Learners practice 3+ difficult conversations before Lab 9 pitch |
| Certification Framework | Clear rubrics exist for all 6 phase deliverables |
| Crisis Labs | Learners experience 4+ compressed crisis scenarios |

---

## Files Index

### New Files to Create
```
content/curriculum/phases/01-ai-literacy/1.6-ai-mental-models.md
content/curriculum/labs/lab-8-stakeholder-simulation.md
content/curriculum/labs/lab-7c-crisis-response.md
docs/certification/README.md
docs/certification/foundation-track.md
docs/certification/implementation-track.md
docs/certification/leadership-track.md
docs/certification/capstone-criteria.md
```

### Files to Modify
```
content/curriculum/phases/01-ai-literacy/_phase.yaml
content/curriculum/phases/04-strategy-economics/_phase.yaml
content/curriculum/phases/05-ai-leadership/_phase.yaml
src/routes/sandbox/+page.svelte
docs/PROGRESS.md
```

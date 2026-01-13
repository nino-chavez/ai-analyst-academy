---
id: "lab-4-quality-gate-design"
title: "Quality Gate Design"
phase: 2
labNumber: 4
estimatedMinutes: 45
objectives:
  - Design a multi-layer quality assurance system
  - Create validation prompts and criteria
  - Build feedback loops for continuous improvement
prerequisites:
  - "2.3-quality-and-iteration"
  - "2.4-human-ai-handoffs"
---

# Lab 4: Quality Gate Design

## Lab Overview

AI without quality control is a liability. In this lab, you'll design a comprehensive quality assurance system for an AI workflow—the kind of system that lets you sleep at night knowing your AI isn't embarrassing you.

**What you'll create:**
- A complete quality gate specification
- Validation prompts and criteria
- Handoff protocols
- Feedback capture system

---

## Part 1: Choose Your Scenario (5 minutes)

### Select an AI workflow to protect:

**Option A: Customer Email Response Generation**
AI drafts responses to customer inquiries that agents can approve and send.

**Option B: Content Summarization Pipeline**
AI summarizes long documents into executive briefs for leadership.

**Option C: Data Extraction and Categorization**
AI extracts structured data from unstructured documents (invoices, contracts, etc.).

**Option D: Personalized Marketing Copy**
AI generates personalized marketing messages based on customer profiles.

**Option E: Your Choice**
An AI workflow you're building or planning.

---

## Part 2: Define Quality Criteria (10 minutes)

### Identify Quality Dimensions

For your chosen workflow, define what "quality" means:

**Dimension 1: Accuracy**
What needs to be factually correct?
- [Specific accuracy requirement 1]
- [Specific accuracy requirement 2]

**Dimension 2: Completeness**
What must be included?
- [Required element 1]
- [Required element 2]

**Dimension 3: Format/Structure**
What structure is required?
- [Format requirement 1]
- [Format requirement 2]

**Dimension 4: Tone/Voice**
What should it sound like?
- [Tone requirement 1]
- [Tone requirement 2]

**Dimension 5: Constraints**
What must be avoided?
- [Constraint 1]
- [Constraint 2]

### Create Quality Rubric

| Dimension | 1 (Fail) | 3 (Acceptable) | 5 (Excellent) | Weight |
|-----------|----------|----------------|---------------|--------|
| Accuracy | [Describe] | [Describe] | [Describe] | X% |
| Completeness | [Describe] | [Describe] | [Describe] | X% |
| Format | [Describe] | [Describe] | [Describe] | X% |
| Tone | [Describe] | [Describe] | [Describe] | X% |
| Constraints | [Describe] | [Describe] | [Describe] | X% |

**Minimum passing score:** [e.g., 3.5 weighted average]

---

## Part 3: Design Quality Gates (15 minutes)

### Gate 1: Automated Validation

What can be checked automatically without AI judgment?

```
AUTOMATED CHECKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Length within range: [min] - [max] words
□ Required sections present: [list]
□ Prohibited terms absent: [list]
□ Format requirements met: [specifics]
□ Links/references valid: [if applicable]
□ [Additional automated check]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Gate 2: AI Cross-Validation

Design a prompt that has AI evaluate AI output:

```
QUALITY EVALUATION PROMPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You are a quality reviewer. Evaluate this [content type]
against the following criteria:

CONTENT TO REVIEW:
"""
{ai_output}
"""

ORIGINAL REQUEST:
"""
{original_input}
"""

Evaluate each criterion (1-5) with explanation:

1. ACCURACY
   - Are all facts verifiable?
   - Any potential hallucinations?
   Score: [1-5]
   Issues: [List any concerns]

2. COMPLETENESS
   - All required elements present?
   - Any gaps in coverage?
   Score: [1-5]
   Issues: [List any missing items]

3. FORMAT
   - Matches expected structure?
   - Professional presentation?
   Score: [1-5]
   Issues: [List any format problems]

4. TONE
   - Appropriate for audience?
   - Consistent throughout?
   Score: [1-5]
   Issues: [List any tone problems]

5. CONSTRAINTS
   - All restrictions followed?
   - Any policy violations?
   Score: [1-5]
   Issues: [List any violations]

OVERALL ASSESSMENT:
- Pass/Fail: [Based on minimum threshold]
- Confidence: [Low/Medium/High]
- Recommended action: [Approve/Revise/Escalate]
- Specific fixes needed: [If applicable]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Gate 3: Human Review

Define when and how humans review:

```
HUMAN REVIEW TRIGGERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Always review when:
□ AI confidence < [threshold]%
□ [Specific trigger 1]
□ [Specific trigger 2]

Sample review:
□ [X]% of outputs randomly selected
□ First [N] outputs of each type
□ [Other sampling strategy]

Escalation required when:
□ [Critical condition 1]
□ [Critical condition 2]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Human Review Interface

What should reviewers see?

```
REVIEW PACKAGE CONTENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Original input/request
2. AI-generated output
3. Automated check results
4. AI evaluation scores
5. Flagged concerns
6. Suggested actions

REVIEWER OPTIONS:
□ Approve as-is
□ Approve with minor edits
□ Request revision (with feedback)
□ Reject (with reason)
□ Escalate to [role]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Part 4: Design Feedback Loop (10 minutes)

### Capture Quality Data

What should be logged for every output?

```
QUALITY LOG ENTRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Timestamp: [datetime]
Request ID: [unique identifier]
Input summary: [brief description]
Model used: [model name/version]

Automated checks: [pass/fail summary]
AI evaluation score: [weighted average]
Human review: [Approve/Edit/Reject/Escalate]
Human edits: [what was changed]
Final outcome: [what was shipped]

Processing time: [duration]
Token usage: [count]
Cost: [amount]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Define Improvement Triggers

When should you adjust the system?

| Metric | Threshold | Action |
|--------|-----------|--------|
| First-pass approval rate | < 70% | Review and improve prompts |
| Average human edit time | > [X] min | Improve AI output quality |
| Escalation rate | > 10% | Expand AI capability or scope |
| Customer complaints | Any | Root cause analysis |
| Cost per output | > [X] | Optimize model selection |

### Feedback Integration Process

```
WEEKLY QUALITY REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Pull quality metrics dashboard
2. Identify lowest-scoring areas
3. Sample rejected/edited outputs
4. Categorize common issues
5. Prioritize improvements
6. Update prompts/criteria
7. Monitor impact
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Part 5: Visualize the System (5 minutes)

### Create Quality Gate Flow Diagram

```
[AI Output Generated]
        │
        ▼
┌─────────────────┐
│ GATE 1: AUTO    │──FAIL──┐
│ Format, length, │        │
│ prohibited terms│        │
└────────┬────────┘        │
         │ PASS            │
         ▼                 │
┌─────────────────┐        │
│ GATE 2: AI EVAL │──FAIL──┤
│ Quality scoring │        │
│ Issue flagging  │        │
└────────┬────────┘        │
         │ PASS            │
         ▼                 │
┌─────────────────┐        │
│ GATE 3: HUMAN   │──FAIL──┘
│ (if triggered)  │        │
└────────┬────────┘        │
         │ PASS            │
         ▼                 ▼
    [APPROVED]        [REVISION]
                          │
                          ▼
                    [Back to AI]
```

---

## Deliverable

Create a Quality Gate Specification Document containing:

1. **Quality Criteria Definition**
   - All quality dimensions
   - Detailed rubric with examples
   - Minimum thresholds

2. **Gate Specifications**
   - Gate 1: Automated checks (complete list)
   - Gate 2: AI evaluation prompt (ready to use)
   - Gate 3: Human review protocol

3. **Handoff Design**
   - Review package contents
   - Reviewer options and actions
   - Escalation paths

4. **Feedback System**
   - Data capture schema
   - Improvement triggers
   - Review process

5. **System Diagram**
   - Visual flow of quality gates
   - Decision points and paths

---

## Extension Challenge

**Build a Working Prototype**

1. Create a prompt that generates outputs for your chosen scenario
2. Create the AI evaluation prompt
3. Run 10 test cases through both
4. Calculate your first-pass approval rate
5. Identify the most common quality issues
6. Refine your generation prompt based on findings
7. Re-run and measure improvement

Document your iteration process and results.

---
id: "lab-3b-agent-evaluation"
title: "Agent Evaluation & Benchmarking"
phase: 2
labNumber: 3.5
estimatedMinutes: 75
objectives:
  - Build a golden test set for agent evaluation
  - Define measurable success criteria and scoring rubrics
  - Run systematic evaluations and measure consistency
  - Document failure modes and propose improvements
prerequisites:
  - "2.1-process-analysis"
  - "2.2-task-decomposition"
  - "lab-3-workflow-mapping"
---

# Lab 3b: Agent Evaluation & Benchmarking

## Lab Overview

You've designed AI workflows. But how do you know if they actually work?

"It seems good" isn't good enough. This lab teaches you to systematically evaluate AI agents with the same rigor used by leading AI labs—but adapted for business applications.

**What you'll create:**
- A golden test set with input-output pairs
- Evaluation criteria and scoring rubrics
- Consistency measurements across multiple runs
- Failure mode documentation with improvement recommendations

---

## Why Evaluation Matters

> **"If you can't measure it, you can't improve it."**

AI evaluation differs from traditional software testing:

| Traditional Software | AI Applications |
|---------------------|-----------------|
| Given input X, always produces output Y | Same input may produce different outputs |
| Bugs are deterministic | Failures may be subtle (wrong tone, missed nuance) |
| Edge cases are finite | Edge cases are infinite |
| Pass/fail is binary | Quality is often subjective |

Without systematic evaluation, you're flying blind.

---

## The Agent Evaluation Matrix

Before testing, understand what you're measuring:

| Dimension | What It Tests | Key Questions |
|-----------|---------------|---------------|
| **Task Success** | Goal completion | Did it do what was asked? |
| **Output Quality** | Result correctness | Is the output accurate and useful? |
| **Tool Use** | Capability selection | Did it use the right tools correctly? |
| **Reasoning** | Decision quality | Was the logic sound? |
| **Safety** | Boundary respect | Did it stay within scope? |
| **Reliability** | Consistency | Does it work the same way each time? |

---

## Part 1: Define Success Criteria (20 minutes)

### Step 1: Choose Your Evaluation Target

Select an AI workflow to evaluate. This could be:
- An existing AI assistant or chatbot
- A workflow you designed in Lab 3
- A prompt chain you've built
- A customer support automation

**Document your target:**

```
EVALUATION TARGET
─────────────────
System name: ________________________________
Purpose: ____________________________________
Key tasks it performs:
1. _________________________________________
2. _________________________________________
3. _________________________________________
```

### Step 2: Define Success Criteria

For each key task, define what "success" looks like:

**Example for a customer support agent:**

| Task | Success Criteria | Measurement |
|------|------------------|-------------|
| Answer product questions | Factually correct, references documentation | Manual verification against source |
| Handle refund requests | Follows policy, captures required info | Checklist completion rate |
| Escalate complex issues | Recognizes triggers, routes correctly | Escalation accuracy rate |

**Your turn—define 5 success criteria:**

```
SUCCESS CRITERIA
────────────────
Task 1: ____________________
  Success means: ____________________
  Measured by: ____________________

Task 2: ____________________
  Success means: ____________________
  Measured by: ____________________

Task 3: ____________________
  Success means: ____________________
  Measured by: ____________________

Task 4: ____________________
  Success means: ____________________
  Measured by: ____________________

Task 5: ____________________
  Success means: ____________________
  Measured by: ____________________
```

### Step 3: Create a Scoring Rubric

Convert subjective criteria to scores:

**Example rubric for "response quality":**

| Score | Description | Indicators |
|-------|-------------|------------|
| 5 | Excellent | Complete, accurate, well-structured, appropriate tone |
| 4 | Good | Mostly complete, minor omissions, good tone |
| 3 | Acceptable | Addresses main point, some gaps, adequate tone |
| 2 | Poor | Incomplete or partially incorrect, tone issues |
| 1 | Failing | Wrong answer, inappropriate, or harmful |

**Create rubrics for your top 3 criteria:**

---

## Part 2: Build Your Test Set (25 minutes)

### Golden Examples (10 test cases)

Golden examples are input-output pairs where you know what "good" looks like.

**Structure:**

```
TEST CASE #___
──────────────
Input: [What the user says/submits]
Expected output: [What a good response includes]
Success criteria: [Which criteria this tests]
Evaluation notes: [What to look for when scoring]
```

**Create 10 golden examples:**

**Test Cases 1-4: Happy Path**
Standard requests that should work perfectly.

```
TEST CASE #1 (Happy Path)
Input: ________________________________________________
Expected: _____________________________________________
Tests: ________________________________________________
```

```
TEST CASE #2 (Happy Path)
Input: ________________________________________________
Expected: _____________________________________________
Tests: ________________________________________________
```

```
TEST CASE #3 (Happy Path)
Input: ________________________________________________
Expected: _____________________________________________
Tests: ________________________________________________
```

```
TEST CASE #4 (Happy Path)
Input: ________________________________________________
Expected: _____________________________________________
Tests: ________________________________________________
```

**Test Cases 5-7: Edge Cases**
Ambiguous, unusual, or boundary-testing inputs.

```
TEST CASE #5 (Edge Case - Ambiguous)
Input: ________________________________________________
Expected: _____________________________________________
Tests: ________________________________________________
```

```
TEST CASE #6 (Edge Case - Unusual)
Input: ________________________________________________
Expected: _____________________________________________
Tests: ________________________________________________
```

```
TEST CASE #7 (Edge Case - Boundary)
Input: ________________________________________________
Expected: _____________________________________________
Tests: ________________________________________________
```

**Test Cases 8-9: Adversarial**
Attempts to confuse, manipulate, or break the system.

```
TEST CASE #8 (Adversarial - Confusion)
Input: ________________________________________________
Expected: _____________________________________________
Tests: ________________________________________________
```

```
TEST CASE #9 (Adversarial - Manipulation)
Input: ________________________________________________
Expected: _____________________________________________
Tests: ________________________________________________
```

**Test Case 10: Out of Scope**
Request the agent should refuse or escalate.

```
TEST CASE #10 (Out of Scope)
Input: ________________________________________________
Expected: _____________________________________________
Tests: ________________________________________________
```

---

## Part 3: Run Evaluation (20 minutes)

### Execute Your Test Suite

Run each test case through your AI system. For each response:

1. **Record the actual output**
2. **Score against your rubric**
3. **Note any unexpected behaviors**

**Evaluation Log Template:**

```
TEST CASE #___
──────────────
Input: [copy from test set]

Actual Output:
______________________________________________
______________________________________________
______________________________________________

Scores:
  Criterion 1 (________): ___ / 5
  Criterion 2 (________): ___ / 5
  Criterion 3 (________): ___ / 5

Overall: ___ / 5

Notes:
______________________________________________
```

### Measure Consistency

Run 3 of your test cases **three times each**. Record variation:

```
CONSISTENCY CHECK
─────────────────
Test Case #___:
  Run 1 score: ___
  Run 2 score: ___
  Run 3 score: ___
  Variance: ___
  Notes on differences: _______________________

Test Case #___:
  Run 1 score: ___
  Run 2 score: ___
  Run 3 score: ___
  Variance: ___
  Notes on differences: _______________________

Test Case #___:
  Run 1 score: ___
  Run 2 score: ___
  Run 3 score: ___
  Variance: ___
  Notes on differences: _______________________
```

---

## Part 4: Document Failure Modes (10 minutes)

### Failure Categorization

Review your results and categorize any failures:

| Failure Type | Description | Your Examples |
|--------------|-------------|---------------|
| **Wrong answer** | Factually incorrect output | |
| **Incomplete** | Missing key information | |
| **Wrong tool** | Used inappropriate capability | |
| **Scope violation** | Acted outside boundaries | |
| **Tone mismatch** | Inappropriate communication style | |
| **Hallucination** | Made up information | |
| **Inconsistency** | Different answers to same input | |

### Pattern Analysis

Look for patterns in your failures:

```
FAILURE PATTERNS
────────────────
Most common failure type: _______________________
Triggers for failures: __________________________
Percentage of tests with issues: _____%

Root cause hypotheses:
1. ____________________________________________
2. ____________________________________________
3. ____________________________________________
```

### Improvement Recommendations

Based on your analysis, what changes would improve performance?

```
RECOMMENDED IMPROVEMENTS
────────────────────────
Priority 1 (Critical):
  Problem: _____________________________________
  Solution: ____________________________________
  Expected impact: _____________________________

Priority 2 (Important):
  Problem: _____________________________________
  Solution: ____________________________________
  Expected impact: _____________________________

Priority 3 (Nice to have):
  Problem: _____________________________________
  Solution: ____________________________________
  Expected impact: _____________________________
```

---

## Lab Deliverable

Compile your work into an **Agent Evaluation Report**:

```
AGENT EVALUATION REPORT
═══════════════════════

System Evaluated: _______________________________
Date: __________________________________________
Evaluator: _____________________________________

EXECUTIVE SUMMARY
─────────────────
Overall score: ___ / 5
Tests passed: ___ / 10
Consistency score: ___ (low variance = good)
Production ready: Yes / No / With changes

KEY METRICS
───────────
Task success rate: ____%
Average quality score: ___ / 5
Failure rate: ____%
Top failure type: _______________

DETAILED FINDINGS
─────────────────
Strengths:
• ___________________________________________
• ___________________________________________

Weaknesses:
• ___________________________________________
• ___________________________________________

RECOMMENDATIONS
───────────────
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

APPENDIX
────────
[Attach your test cases and evaluation logs]
```

---

## Industry Benchmarks Reference

For context, here's how leading benchmarks evaluate agents:

| Benchmark | What It Tests | Current Best Performance |
|-----------|---------------|-------------------------|
| **AgentBench** | 8 environments (OS, web, DB) | ~45% average |
| **WebArena** | 812 web tasks | ~60% (humans: 78%) |
| **GAIA** | 466 reasoning + tool tasks | Varies by difficulty |
| **ToolEmu** | Safety in high-stakes scenarios | Focus on failure prevention |

Your business evaluation doesn't need to match these formats—but understanding them helps you think systematically.

---

## Reflection Questions

1. What surprised you most about your evaluation results?
2. How would you explain these results to a non-technical stakeholder?
3. What's the minimum acceptable score for production deployment?
4. How often should you re-run this evaluation?
5. What test cases would you add for the next evaluation cycle?

---

## Next Steps

After completing this lab:
- **Lab 4**: Design quality gates based on your evaluation criteria
- **Module 3.4**: Learn deployment strategies that incorporate evaluation
- **Lab 5**: Build an assistant with evaluation built-in

---
id: "lab-2-chain-of-thought-audit"
title: "Chain of Thought Audit"
phase: 1
labNumber: 2
estimatedMinutes: 40
objectives:
  - Compare outputs with and without chain of thought prompting
  - Identify when CoT improves results significantly
  - Practice structuring reasoning prompts
prerequisites:
  - "1.4-prompting-as-management"
---

# Lab 2: Chain of Thought Audit

## Lab Overview

Chain of thought (CoT) prompting asks AI to show its reasoning, not just its conclusions. But does it actually improve output quality? In this lab, you'll run controlled experiments to find out.

**What you'll discover:**
- When chain of thought makes a significant difference
- When it's unnecessary overhead
- How to structure CoT prompts for maximum benefit

---

## Part 1: Baseline Testing (15 minutes)

### Test Case 1: Simple Question

**Without CoT:**
> "Should a startup with $500K in funding hire a full-time CFO?"

**With CoT:**
> "Should a startup with $500K in funding hire a full-time CFO? Think through the key factors step by step before giving your recommendation."

**Record both outputs and score:**
- Quality of reasoning (1-5)
- Completeness of analysis (1-5)
- Actionability of recommendation (1-5)
- Time/token efficiency (1-5)

### Test Case 2: Calculation

**Without CoT:**
> "A company has 10,000 customers paying $50/month. They want to raise prices 20% but expect to lose 15% of customers. What's the revenue impact?"

**With CoT:**
> "A company has 10,000 customers paying $50/month. They want to raise prices 20% but expect to lose 15% of customers. Calculate the revenue impact step by step, showing your work."

**Record both outputs and verify calculations.**

### Test Case 3: Complex Analysis

**Without CoT:**
> "Should we build or buy for our CRM needs? We're a 50-person company with specific requirements around integration with our proprietary inventory system."

**With CoT:**
> "Should we build or buy for our CRM needs? We're a 50-person company with specific requirements around integration with our proprietary inventory system.

> Analyze by:
> 1. First listing key decision criteria
> 2. Evaluating build option against each criterion
> 3. Evaluating buy option against each criterion
> 4. Weighing trade-offs
> 5. Making a recommendation with confidence level"

**Record both outputs and compare depth of analysis.**

---

## Part 2: Pattern Discovery (10 minutes)

### Analyze Your Results

Create a comparison table:

| Test Case | Without CoT Score | With CoT Score | Difference | Notable Observations |
|-----------|-------------------|----------------|------------|----------------------|
| Simple Question | | | | |
| Calculation | | | | |
| Complex Analysis | | | | |

### Identify Patterns

Answer these questions:

1. Which test case showed the biggest improvement with CoT?

2. Did any test case get *worse* with CoT? (e.g., over-complicated, slower)

3. For the calculation, did CoT produce a correct answer when non-CoT didn't?

4. How did response length change with CoT?

---

## Part 3: Structured CoT Techniques (10 minutes)

### Test Different CoT Structures

Use the same complex prompt but try different CoT structures:

**Structure A: Basic CoT**
> "...Think step by step."

**Structure B: Numbered Steps**
> "...Walk through this in numbered steps."

**Structure C: Framework-Driven**
> "...Use this framework: 1) Clarify the goal, 2) List options, 3) Evaluate each, 4) Recommend."

**Structure D: Devil's Advocate**
> "...First argue for build, then argue for buy, then give your actual recommendation."

**Structure E: Confidence-Calibrated**
> "...Analyze step by step. For each conclusion, state your confidence level (low/medium/high) and why."

### Compare Results

| Structure | Quality | Thoroughness | Usefulness | Best For |
|-----------|---------|--------------|------------|----------|
| Basic | | | | |
| Numbered | | | | |
| Framework | | | | |
| Devil's Advocate | | | | |
| Confidence-Calibrated | | | | |

---

## Part 4: Finding the Threshold (10 minutes)

### When Does CoT Matter?

Test these scenarios to find where CoT provides value:

**Category 1: Factual Retrieval**
> "What is the capital of France?"
> "What is the capital of France? Explain your reasoning."

**Category 2: Simple Opinion**
> "Is Slack or Microsoft Teams better for small teams?"
> "Is Slack or Microsoft Teams better for small teams? Think through the key factors."

**Category 3: Multi-Factor Decision**
> "Should I accept a job offer that pays 20% more but requires relocating?"
> "Should I accept a job offer that pays 20% more but requires relocating? Analyze the key factors step by step."

**Category 4: Creative Task**
> "Write a tagline for a sustainable coffee brand."
> "Write a tagline for a sustainable coffee brand. First brainstorm 10 concepts, evaluate them, then refine the best one."

### Build Your Decision Tree

Based on your testing, when should you use CoT?

```
Does the task require:
├── Simple fact lookup? → NO CoT
├── Basic generation (creative/simple)? → MAYBE CoT for brainstorming
├── Calculation or logic? → YES CoT (to verify steps)
├── Multi-factor analysis? → YES CoT (structured)
├── High-stakes decision support? → YES CoT (with confidence)
└── Complex reasoning? → YES CoT (framework-driven)
```

---

## Part 5: Create Your CoT Template Library

### Build Templates for Common Use Cases

**Template 1: Decision Support**
```
[Question]

Before answering:
1. List the key factors that should influence this decision
2. Evaluate each option against these factors
3. Identify the most important trade-offs
4. State your recommendation with confidence level (low/medium/high)
5. Note what additional information would increase confidence
```

**Template 2: Analysis**
```
[Analysis request]

Structure your analysis as follows:
1. Current state: What's the situation?
2. Key issues: What are the main problems/opportunities?
3. Root causes: Why do these issues exist?
4. Options: What could be done?
5. Recommendation: What should be done and why?
```

**Template 3: Calculation Verification**
```
[Calculation request]

Show your work:
1. State the known values
2. Show each calculation step
3. Verify the logic
4. Provide the final answer
5. Sanity check: Does this answer make sense?
```

### Create 2 Custom Templates

Based on your work or interests, create 2 additional CoT templates for scenarios you commonly encounter.

---

## Deliverable

Create a document containing:

1. **Comparison data** from all test cases
2. **Analysis** of when CoT improves results
3. **Your decision tree** for when to use CoT
4. **5+ CoT templates** (3 provided + 2 you created)
5. **Key learnings** about effective CoT prompting

---

## Extension Challenge

**The Verification Experiment**

For a complex calculation or analysis task:
1. Get an answer without CoT
2. Ask the AI to verify that answer with CoT reasoning
3. Compare whether the verification catches errors

Document whether asking for verification after-the-fact is as effective as CoT during generation.

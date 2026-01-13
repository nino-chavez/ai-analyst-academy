---
id: "lab-1-persona-stress-test"
title: "Persona Stress Test"
phase: 1
labNumber: 1
estimatedMinutes: 45
objectives:
  - Test how different AI personas handle the same business scenario
  - Understand how persona definition affects output quality
  - Practice iterative prompt refinement
prerequisites:
  - "1.4-prompting-as-management"
---

# Lab 1: Persona Stress Test

## Lab Overview

In this lab, you'll create and test multiple AI personas against the same challenging business scenario. You'll discover how persona design dramatically affects output quality, tone, and usefulness.

**What you'll create:**
- 3-4 distinct personas for business communication
- A "stress test" scenario that reveals persona strengths and weaknesses
- Documentation of which persona works best for which situations

---

## Part 1: Scenario Setup (10 minutes)

### The Challenge

You're the product manager at a B2B software company. A major customer (representing 15% of annual revenue) has complained publicly on LinkedIn about a recent product update. Their post is gaining traction.

**Customer's post:**
> "Another update, another disaster. @YourCompany just rolled out their 'improved' interface and now half my team can't find basic features. We've been loyal customers for 4 years but I'm starting vendor evaluations tomorrow. Anyone else frustrated?"

**Your task:** Draft a response that acknowledges the concern, preserves the relationship, and doesn't make public promises you can't keep.

---

## Part 2: Create Personas (15 minutes)

### Create 4 distinct personas to handle this scenario:

**Persona 1: The Diplomat**
Write a persona focused on de-escalation, empathy, and relationship preservation. This persona should prioritize the customer feeling heard.

**Persona 2: The Problem-Solver**
Write a persona focused on practical solutions and next steps. This persona should prioritize action over emotion.

**Persona 3: The Brand Protector**
Write a persona focused on managing public perception while being helpful. This persona balances the customer's needs with protecting company reputation.

**Persona 4: Your Design**
Create a fourth persona based on your hypothesis about what might work best.

### Persona Template

For each persona, define:

```
You are [NAME], a [ROLE] with expertise in [DOMAIN].

Your approach to customer communications:
- [Trait 1]
- [Trait 2]
- [Trait 3]

When responding to complaints, you:
- [Behavior 1]
- [Behavior 2]
- [Behavior 3]

Your tone is:
- [Descriptor 1]
- [Descriptor 2]

You avoid:
- [Anti-pattern 1]
- [Anti-pattern 2]
```

---

## Part 3: Run the Test (15 minutes)

### For each persona:

1. **Set up the conversation** with your persona as the system prompt

2. **Submit the scenario:**
   > "Draft a public LinkedIn comment response to this customer complaint: [paste the complaint]. The response should be professional and appropriate for public viewing. Keep it under 100 words."

3. **Record the output** exactly as generated

4. **Evaluate** using the rubric below

### Evaluation Rubric

| Criterion | 1 (Poor) | 3 (Acceptable) | 5 (Excellent) |
|-----------|----------|----------------|---------------|
| **Empathy** | Dismissive or defensive | Acknowledges concern | Validates feelings authentically |
| **Professionalism** | Inappropriate for public | Safe but generic | Polished and on-brand |
| **Actionability** | No next steps | Vague offer to help | Clear, specific path forward |
| **Risk management** | Makes promises, admits fault | Neutral | Protective without being defensive |
| **Authenticity** | Sounds like corporate template | Adequate | Sounds like a real person |

---

## Part 4: Analysis (10 minutes)

### Compare Results

Create a comparison table:

| Persona | Empathy | Prof. | Action | Risk | Auth. | Total | Notes |
|---------|---------|-------|--------|------|-------|-------|-------|
| Diplomat | | | | | | | |
| Problem-Solver | | | | | | | |
| Brand Protector | | | | | | | |
| Your Design | | | | | | | |

### Reflection Questions

1. Which persona performed best overall? Why?

2. Which persona would be most dangerous to use in this scenario? Why?

3. What traits from different personas could be combined for an optimal response?

4. How did your custom persona perform compared to your hypothesis?

5. What would you change about each persona based on the results?

---

## Part 5: Iteration (5 minutes)

### Create Your Optimized Persona

Based on your analysis, create an improved persona that combines the best elements:

```
OPTIMIZED CRISIS COMMUNICATION PERSONA

You are [NAME], a [ROLE] with expertise in [DOMAIN].

[Incorporate best traits from testing]

When handling public complaints:
- [Learned behavior 1]
- [Learned behavior 2]
- [Learned behavior 3]

You specifically avoid:
- [Learned anti-pattern 1]
- [Learned anti-pattern 2]
```

### Test the Optimized Persona

Run the same scenario with your optimized persona. Does it score higher than any individual persona from the original test?

---

## Deliverable

Create a document containing:

1. **The 4 original persona definitions**
2. **Each persona's raw output** for the scenario
3. **Your scoring and analysis**
4. **Your optimized persona definition**
5. **The optimized persona's output and score**
6. **Key learnings** (3-5 bullet points on what you discovered about persona design)

---

## Extension Challenge

Try these additional stress tests with your optimized persona:

1. **The aggressive follow-up**: Customer responds to your message with anger
2. **The competitor mention**: Customer says they're already talking to your competitor
3. **The technical accusation**: Customer claims the bug is a security vulnerability

Document how the persona handles each escalation.

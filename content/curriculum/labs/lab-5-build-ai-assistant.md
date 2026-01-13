---
id: "lab-5-build-ai-assistant"
title: "Build an AI Assistant"
phase: 3
labNumber: 5
estimatedMinutes: 60
objectives:
  - Build a functional AI assistant using no-code tools
  - Configure knowledge base and capabilities
  - Test and iterate on assistant performance
prerequisites:
  - "3.1-no-code-ai-tools"
  - "3.2-api-fundamentals"
---

# Lab 5: Build an AI Assistant

## Lab Overview

Stop theorizing. Build something real. In this lab, you'll create a functional AI assistant that solves a genuine business problem. You'll use no-code tools to go from concept to working product.

**What you'll create:**
- A custom AI assistant with specialized knowledge
- Tested and validated for your use case
- Ready for real users

---

## Part 1: Define Your Assistant (10 minutes)

### Choose Your Use Case

Select one:

**Option A: Subject Matter Expert Bot**
An assistant that answers questions about a specific topic (industry, product, process).

**Option B: Task Automation Assistant**
An assistant that helps users complete a specific workflow (onboarding, report generation, etc.).

**Option C: Decision Support Assistant**
An assistant that helps users make better decisions by asking good questions and analyzing options.

**Option D: Learning Companion**
An assistant that teaches a skill through conversation (explains concepts, provides practice, gives feedback).

**Option E: Your Innovation**
An assistant for a use case you've identified.

### Complete the Definition Template

```
ASSISTANT DEFINITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: [Give it a name]

Purpose:
[One sentence: What problem does it solve?]

Target users:
[Who will use this?]

Core capabilities:
1. [Primary capability]
2. [Secondary capability]
3. [Tertiary capability]

Knowledge requirements:
[What does it need to know?]

Out of scope:
[What should it NOT do?]

Success metric:
[How will you know it works?]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Part 2: Write the Instructions (15 minutes)

### Craft Your System Instructions

Using the techniques from Module 1.4, write comprehensive instructions:

```
SYSTEM INSTRUCTIONS TEMPLATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You are [NAME], a [ROLE] specialized in [DOMAIN].

YOUR PURPOSE:
[What you help users accomplish]

YOUR EXPERTISE:
- [Specific knowledge area 1]
- [Specific knowledge area 2]
- [Specific knowledge area 3]

HOW YOU COMMUNICATE:
- Tone: [Describe]
- Style: [Describe]
- Length: [Preferences]

WHEN RESPONDING:
- Always: [Required behavior]
- Never: [Prohibited behavior]
- If uncertain: [Fallback behavior]

CONVERSATION FLOW:
- First, [How to open conversations]
- Then, [How to gather needed information]
- Finally, [How to deliver value]

IMPORTANT CONSTRAINTS:
- [Constraint 1]
- [Constraint 2]
- [Constraint 3]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Write Three Versions

Create three variations of your instructions:
1. **Concise** (under 200 words)
2. **Detailed** (300-500 words)
3. **Comprehensive** (500+ words with examples)

You'll test which performs best.

---

## Part 3: Prepare Knowledge Base (10 minutes)

### Identify Knowledge Sources

What documents or information should your assistant access?

| Source | Type | Purpose |
|--------|------|---------|
| [Source 1] | PDF/Doc/Text | [Why needed] |
| [Source 2] | PDF/Doc/Text | [Why needed] |
| [Source 3] | PDF/Doc/Text | [Why needed] |

### Prepare Documents

For each source:
1. Remove irrelevant content
2. Ensure clear formatting
3. Add section headers if missing
4. Note: Most platforms have file size limits (check yours)

**If you don't have real documents**, create sample content:
- FAQ document with 10-15 common questions
- Brief guide or process documentation
- Reference material relevant to your use case

---

## Part 4: Build the Assistant (15 minutes)

### Select Your Platform

Choose one:
- **OpenAI GPT Builder** (if you have ChatGPT Plus)
- **Claude Projects** (if you have Claude Pro)
- **Poe Bot Creator** (free option)
- **Alternative** (HuggingChat, other platforms)

### Build Steps

**Step 1: Create new assistant**
- Name your assistant
- Add a description

**Step 2: Configure instructions**
- Start with your "Detailed" version
- Review platform-specific guidelines

**Step 3: Upload knowledge**
- Add your prepared documents
- Verify uploads successful

**Step 4: Configure capabilities**
- Enable/disable web browsing (if available)
- Enable/disable code interpreter (if available)
- Adjust other settings as needed

**Step 5: Add conversation starters**
Create 4-5 suggested prompts:
```
1. "[Question that showcases core capability 1]"
2. "[Question that showcases core capability 2]"
3. "[Common user question]"
4. "[Edge case question]"
5. "[Getting started question]"
```

---

## Part 5: Test and Iterate (15 minutes)

### Run Test Suite

Test your assistant with these scenarios:

**Basic functionality tests:**
| Test | Input | Expected Behavior | Pass? |
|------|-------|-------------------|-------|
| Core use case | [Typical user question] | [What should happen] | |
| Knowledge retrieval | [Question requiring documents] | [Accurate response] | |
| Clarification | [Vague question] | [Asks for details] | |
| Out of scope | [Question it shouldn't answer] | [Politely declines] | |

**Stress tests:**
| Test | Input | Expected Behavior | Pass? |
|------|-------|-------------------|-------|
| Long input | [Very detailed request] | [Handles gracefully] | |
| Ambiguous request | [Could mean multiple things] | [Seeks clarification] | |
| Edge case | [Unusual but valid question] | [Reasonable response] | |
| Adversarial | [Attempt to confuse/break] | [Maintains composure] | |

### Identify Issues

For each failed test:
```
ISSUE: [Test name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Expected: [What should have happened]
Actual: [What happened]
Root cause: [Why did it fail?]
Fix: [What to change]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Iteration Cycle

1. Review failed tests
2. Identify instruction improvements
3. Update system instructions
4. Re-test
5. Document what worked

**Track your iterations:**

| Version | Changes Made | Tests Passed | Notes |
|---------|--------------|--------------|-------|
| v1 | Initial build | X/10 | [Issues] |
| v2 | [Changes] | X/10 | [Improvement] |
| v3 | [Changes] | X/10 | [Status] |

---

## Part 6: Document Your Assistant (5 minutes)

### Create User Guide

```
[ASSISTANT NAME] - User Guide
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT THIS ASSISTANT DOES:
[Brief description]

HOW TO USE IT:
1. [Step 1]
2. [Step 2]
3. [Step 3]

BEST FOR:
• [Use case 1]
• [Use case 2]
• [Use case 3]

NOT DESIGNED FOR:
• [Limitation 1]
• [Limitation 2]

TIPS FOR BEST RESULTS:
• [Tip 1]
• [Tip 2]
• [Tip 3]

TROUBLESHOOTING:
If [problem] → Try [solution]
If [problem] → Try [solution]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Deliverable

Create a complete assistant package:

1. **Assistant Definition Document**
   - Use case and purpose
   - Target users
   - Success criteria

2. **System Instructions**
   - Final version used
   - Notes on what worked/didn't

3. **Knowledge Base Inventory**
   - List of documents uploaded
   - Why each was included

4. **Test Results**
   - All test cases and results
   - Iteration history

5. **User Guide**
   - Ready to share with potential users

6. **Link to Working Assistant**
   - Shareable link (if platform supports)
   - Or screenshots showing it works

---

## Extension Challenge

**Usage Pilot**

1. Share your assistant with 3-5 real users
2. Collect feedback:
   - What worked well?
   - What was confusing?
   - What's missing?
3. Make improvements based on feedback
4. Document the iteration

This real-world testing is where you'll learn the most.

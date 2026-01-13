---
id: "lab-3b-data-hygiene"
title: "Data Hygiene & Preparation"
phase: 2
labNumber: 3.5
estimatedMinutes: 45
objectives:
  - Transform unstructured data into AI-ready formats
  - Identify and handle common data quality issues
  - Validate LLM-processed output for hallucinations
  - Document a repeatable data preparation pipeline
prerequisites:
  - "2.1-process-analysis"
  - "2.2-task-decomposition"
---

# Lab 3b: Data Hygiene & Preparation

## Lab Overview

AI doesn't fail because it's dumb—it fails because the input data is bad. In this lab, you'll confront the "Garbage In, Garbage Out" reality that derails most AI projects.

You'll take messy, real-world data and transform it into clean, structured formats that AI can actually use. This is the unglamorous but essential skill that separates successful AI operators from those who wonder why their automations keep breaking.

**What you'll create:**
- A cleaned, structured dataset from messy source material
- A validation report identifying errors and hallucinations
- A documented data preparation pipeline

---

## The Reality Check

Before we start, acknowledge this truth:

> **80% of AI project time is spent on data preparation, not prompting.**

Most AI tutorials skip this step. They give you clean JSON and pretend that's how data arrives. In reality, you'll face:
- PDFs with inconsistent formatting
- Emails with embedded tables that don't parse
- Spreadsheets where "N/A" means five different things
- Text files with encoding issues
- Data that's technically correct but semantically wrong

This lab teaches you to handle the mess.

---

## Part 1: Assess the Damage (10 minutes)

### Your Messy Dataset

Choose one of these scenarios (or use your own real data):

**Option A: Customer Feedback Dump**
```
Email from: john.smith@company.com
Subject: RE: RE: RE: Your Product
Date: 3/15/24

Honestly the product is great but shipping took FOREVER (like 2 weeks??)
and the instructions were useless. Would rate 7/10 overall. Maybe 8 if
you fix the manual.

BTW my order # was somewhere around 50234 or 50243, can't remember.

---
Original message from support@yourcompany.com:
Thank you for your purchase! How was your experience?
---

Sent from my iPhone
```

**Option B: Meeting Notes Chaos**
```
MEETING - product review??? or was it planning
Attendees: Sarah, Mike, that new guy (James?), Lisa was on zoom but kept cutting out

- discussed Q4 roadmap (see attached... wait I don't think I attached it)
- Mike wants to push feature X to Q1 "for reasons"
- budget is either 50k or 500k depending on who you ask
- ACTION: someone needs to follow up with finance (Lisa?)
- Next meeting: soon

Note: half of this was off the record so don't share with leadership
```

**Option C: Product Catalog Nightmare**
```
SKU: PRD-001 | Widget Pro | $49.99 | Blue, Red, Green | In Stock
PRD-002,Widget Basic,$29.99,Blue only,backordered until ???
SKU PRD-003 - Widget Mini - 19.99 - all colors - discontinued BUT still selling
PRD004 | Gadget Max | fifty nine dollars | Chrome | In Stock (I think)
prd-005;Gadget Mini;$39.99;Black;in stock;NEW ARRIVAL!!
```

**Option D: Your Real Data**
Use an actual messy dataset from your work (sanitize any sensitive info).

### Document the Problems

Create an inventory of data quality issues:

| Issue Type | Example from Data | Frequency | Severity |
|------------|-------------------|-----------|----------|
| Inconsistent formatting | | | High/Med/Low |
| Missing values | | | |
| Ambiguous content | | | |
| Mixed data types | | | |
| Embedded noise | | | |
| Encoding issues | | | |

Identify at least 5 distinct problems.

---

## Part 2: Design Your Target Schema (5 minutes)

### Define What "Clean" Looks Like

Before cleaning, decide your destination. Create a target schema:

**For Customer Feedback:**
```json
{
  "feedback_id": "string (generated)",
  "customer_email": "string (valid email)",
  "date": "YYYY-MM-DD",
  "order_number": "integer or null",
  "rating": "integer 1-10 or null",
  "sentiment": "positive | negative | mixed | neutral",
  "shipping_feedback": "string or null",
  "product_feedback": "string or null",
  "suggestions": ["array of strings"],
  "confidence_score": "float 0-1"
}
```

**For Meeting Notes:**
```json
{
  "meeting_id": "string (generated)",
  "date": "YYYY-MM-DD or null",
  "meeting_type": "string",
  "attendees": ["array of names"],
  "decisions": ["array of strings"],
  "action_items": [
    {
      "task": "string",
      "owner": "string or null",
      "deadline": "string or null"
    }
  ],
  "confidential_flag": "boolean",
  "notes": "string"
}
```

### Document Your Schema

Write out:
1. Every field name
2. Expected data type
3. Required vs. optional
4. Validation rules (if any)
5. What to do when data is missing

---

## Part 3: Build Your Cleaning Prompt (15 minutes)

### The Transformation Prompt

Create a prompt that transforms messy input into your clean schema.

**Prompt Template:**
```
You are a data cleaning specialist. Transform the following unstructured
text into the specified JSON format.

RULES:
1. Extract only information that is explicitly stated
2. Use null for missing or unclear values—NEVER guess
3. Flag low-confidence extractions with confidence_score < 0.7
4. Preserve original meaning—do not interpret or summarize unless specified
5. If a value could be multiple things, choose the most likely and note alternatives

TARGET SCHEMA:
[Your schema here]

HANDLING AMBIGUITY:
- Dates: If format unclear, use ISO 8601 (YYYY-MM-DD) and note original
- Numbers: If ranges given, use midpoint and note range
- Names: Use as written, even if likely misspelled
- Missing data: Use null, not empty string or "unknown"

INPUT DATA:
"""
[Messy data here]
"""

OUTPUT:
Provide valid JSON only. No explanations before or after.
```

### Test and Iterate

1. Run your prompt on the messy data
2. Examine the output critically
3. Identify where it went wrong
4. Refine your prompt
5. Repeat until output is acceptable

### Document Your Iterations

| Iteration | Problem Found | Prompt Change Made | Result |
|-----------|---------------|-------------------|--------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## Part 4: Validate for Hallucinations (10 minutes)

### The Critical Step Most People Skip

LLMs will confidently produce structured output even when they're making things up. You MUST validate.

### Validation Checklist

For each field in your output, verify:

| Field | Source Text Evidence | Extraction Correct? | Hallucination Risk |
|-------|---------------------|--------------------|--------------------|
| | Quote the original | Yes/No/Partial | High/Med/Low |
| | | | |

### Common Hallucination Patterns

Watch for these:
- **Fabricated specifics**: LLM adds precise numbers that weren't in source
- **Over-inference**: LLM concludes things that aren't stated
- **Format conformity**: LLM forces data into schema even when it shouldn't fit
- **Plausible defaults**: LLM uses reasonable-sounding values instead of null

### Create a Validation Prompt

```
Review this extraction for accuracy. Compare the OUTPUT against the SOURCE.

SOURCE:
"""
[Original messy data]
"""

EXTRACTED OUTPUT:
[Your cleaned JSON]

For each field, answer:
1. Is there explicit evidence in the source? Quote it.
2. Is the extraction accurate to the source?
3. Was anything added that isn't in the source?
4. Confidence level: HIGH (direct quote) / MEDIUM (reasonable inference) / LOW (uncertain) / HALLUCINATION (not in source)

Format as a validation report.
```

### Document Findings

How many fields were:
- Correctly extracted: ___
- Partially correct: ___
- Hallucinated: ___
- Appropriately null: ___

---

## Part 5: Build the Pipeline (5 minutes)

### Document Your Process

Create a repeatable pipeline:

```
DATA PREPARATION PIPELINE: [Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INPUT FORMAT:
- Source type: [Email / Document / Spreadsheet / etc.]
- Expected volume: [Records per batch]
- Update frequency: [One-time / Daily / Real-time]

STEP 1: PRE-PROCESSING
- [ ] Remove headers/footers/signatures
- [ ] Standardize encoding (UTF-8)
- [ ] Split into individual records
- [ ] [Other pre-processing]

STEP 2: LLM TRANSFORMATION
- Model: [GPT-4 / Claude / etc.]
- Prompt version: [Link or paste]
- Temperature: [Recommended: 0 for extraction]
- Expected tokens: [Estimate]

STEP 3: VALIDATION
- [ ] Run validation prompt
- [ ] Check for hallucinations
- [ ] Verify required fields present
- [ ] Spot-check [N] random records manually

STEP 4: POST-PROCESSING
- [ ] Parse JSON
- [ ] Apply business rules
- [ ] Handle validation failures
- [ ] Load to destination

ERROR HANDLING:
- If parsing fails: [Action]
- If validation fails: [Action]
- If confidence < threshold: [Action]

ESTIMATED COST PER RECORD:
- Input tokens: ~[X]
- Output tokens: ~[X]
- Cost at current rates: $[X]
```

---

## Deliverable

Create a comprehensive document containing:

1. **Problem Assessment**
   - Original messy data sample
   - Inventory of data quality issues
   - Severity ratings

2. **Target Schema**
   - Complete field definitions
   - Validation rules
   - Missing data handling

3. **Transformation Prompt**
   - Final working prompt
   - Iteration history
   - Known limitations

4. **Validation Report**
   - Sample validation results
   - Hallucination analysis
   - Accuracy metrics

5. **Pipeline Documentation**
   - Step-by-step process
   - Error handling
   - Cost estimates

6. **Lessons Learned**
   - What surprised you?
   - What would you do differently?
   - Recommendations for similar data

---

## Extension Challenge

**Scale It Up**

1. Take 10 records of the same messy data type
2. Process them through your pipeline
3. Calculate:
   - Average processing time
   - Cost per record
   - Accuracy rate
   - Failure rate

4. Identify:
   - Which data patterns cause problems?
   - Where does the pipeline break?
   - What manual intervention is still needed?

Document your findings and propose pipeline improvements.

---
id: "lab-6-roi-calculator"
title: "ROI Calculator"
phase: 4
labNumber: 6
estimatedMinutes: 45
objectives:
  - Build a reusable ROI calculation framework
  - Practice quantifying AI value
  - Create presentation-ready business cases
prerequisites:
  - "4.1-ai-business-cases"
---

# Lab 6: ROI Calculator

## Lab Overview

Numbers talk. In this lab, you'll build a reusable framework for calculating and communicating the ROI of AI initiatives. This is the tool that gets projects funded.

**What you'll create:**
- A complete ROI calculation methodology
- A spreadsheet/template for repeated use
- A presentation-ready business case

---

## Part 1: Choose Your Scenario (5 minutes)

### Select an AI initiative to analyze:

**Option A: Customer Service Automation**
AI handles Tier 1 support tickets, reducing agent workload.

**Option B: Content Generation Pipeline**
AI accelerates content creation for marketing team.

**Option C: Document Processing Automation**
AI extracts data from invoices/contracts, replacing manual entry.

**Option D: Sales Email Personalization**
AI personalizes outreach emails based on prospect data.

**Option E: Your Project**
An AI initiative you're actually considering.

---

## Part 2: Document Current State (10 minutes)

### Quantify the Baseline

```
CURRENT STATE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Process: [Name of process]
Owner: [Who's responsible]
Frequency: [How often does this happen?]

VOLUME METRICS:
• Units processed per month: ____
• Time per unit: ____ minutes
• Error rate: ____%

LABOR METRICS:
• FTEs involved: ____
• Average hourly cost (fully loaded): $____
• Total monthly labor hours: ____
• Total monthly labor cost: $____

QUALITY/SPEED METRICS:
• Current cycle time: ____
• Current quality score: ____
• Customer satisfaction: ____

PAIN POINTS (with cost impact):
1. [Pain point]: $____ monthly impact
2. [Pain point]: $____ monthly impact
3. [Pain point]: $____ monthly impact
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Show Your Work

For each metric, document your source:
| Metric | Value | Source | Confidence |
|--------|-------|--------|------------|
| Units/month | | | High/Med/Low |
| Time/unit | | | High/Med/Low |
| Hourly cost | | | High/Med/Low |
| ... | | | |

---

## Part 3: Project Future State (10 minutes)

### Define the AI Solution

```
PROPOSED AI SOLUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Solution description:
[What AI will do]

Integration approach:
[How it connects to existing systems]

Human oversight model:
[Where humans remain in the loop]

Expected impact by metric:
• Volume capacity: ___% increase
• Time per unit: ___% decrease
• Error rate: ___% decrease
• Quality score: ___% increase
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Estimate Improvements

Use a conservative, moderate, and optimistic range:

| Metric | Conservative | Moderate | Optimistic | Assumption |
|--------|--------------|----------|------------|------------|
| Automation rate | | | | [Why] |
| Time savings | | | | [Why] |
| Error reduction | | | | [Why] |
| Capacity increase | | | | [Why] |

**Use moderate estimates for your primary business case.**

---

## Part 4: Calculate Costs (10 minutes)

### One-Time Costs

| Cost Category | Amount | Notes |
|---------------|--------|-------|
| AI platform/licensing | $____ | [Details] |
| Integration development | $____ | [Details] |
| Data preparation | $____ | [Details] |
| Training/change management | $____ | [Details] |
| Contingency (15-25%) | $____ | [Details] |
| **TOTAL ONE-TIME** | $____ | |

### Ongoing Costs

| Cost Category | Monthly | Annual | Notes |
|---------------|---------|--------|-------|
| AI API/subscription | $____ | $____ | [Details] |
| Maintenance/monitoring | $____ | $____ | [Details] |
| Support/training | $____ | $____ | [Details] |
| **TOTAL ONGOING** | $____ | $____ | |

### Total Cost of Ownership (3-Year)

```
Year 1: One-time ($____) + Ongoing ($____) = $____
Year 2: Ongoing ($____) = $____
Year 3: Ongoing ($____) = $____
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3-Year TCO: $____
```

---

## Part 5: Calculate Value (10 minutes)

### Quantified Benefits

**Direct Cost Savings:**
| Benefit | Calculation | Annual Value |
|---------|-------------|--------------|
| Labor hours saved | [hours] × [rate] | $____ |
| Error reduction | [errors avoided] × [cost/error] | $____ |
| [Other direct] | [calculation] | $____ |
| **Total Direct** | | $____ |

**Revenue/Capacity Impact:**
| Benefit | Calculation | Annual Value |
|---------|-------------|--------------|
| Increased capacity | [units] × [margin] | $____ |
| Faster turnaround | [value of speed] | $____ |
| Quality improvement | [value of quality] | $____ |
| **Total Revenue** | | $____ |

**Soft/Strategic Benefits (describe, don't quantify):**
- [Benefit 1: Why it matters]
- [Benefit 2: Why it matters]
- [Benefit 3: Why it matters]

### Total Annual Value

```
Direct savings:     $____
Revenue impact:     $____
━━━━━━━━━━━━━━━━━━━━━━
TOTAL ANNUAL VALUE: $____
```

---

## Part 6: Calculate ROI Metrics (5 minutes)

### ROI Calculation

```
FIRST YEAR ROI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
First-Year Value:            $____
First-Year Total Cost:       $____
First-Year Net Value:        $____
First-Year ROI: (Net/Cost) × 100 = ____%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THREE-YEAR ROI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3-Year Value:                $____
3-Year TCO:                  $____
3-Year Net Value:            $____
3-Year ROI: ____%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Payback Period

```
Monthly net benefit: $____ (Annual ÷ 12)
Total investment:    $____

Payback period: Investment ÷ Monthly benefit = ____ months
```

### Sensitivity Analysis

What if your assumptions are wrong?

| Scenario | Change | New ROI | Still Viable? |
|----------|--------|---------|---------------|
| Conservative | -30% value | ___% | Yes/No |
| Delayed adoption | +3 months to value | ___% | Yes/No |
| Cost overrun | +25% cost | ___% | Yes/No |
| Lower automation | -20% automation rate | ___% | Yes/No |

---

## Part 7: Create Executive Summary (5 minutes)

### One-Page Business Case

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[PROJECT NAME] - AI Investment Recommendation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE OPPORTUNITY
[2-3 sentences on the business problem and proposed solution]

THE NUMBERS
                        Year 1    3-Year Total
Investment Required:    $____     $____
Value Generated:        $____     $____
Net Value:              $____     $____
ROI:                    ____%     ____%

Payback Period: ____ months

KEY BENEFITS
• [Quantified benefit 1]
• [Quantified benefit 2]
• [Strategic benefit]

RISK ASSESSMENT
Even with conservative estimates (-30% value), this initiative
delivers ___% ROI. Key risks include [risk 1] and [risk 2],
mitigated by [mitigation approach].

RECOMMENDATION
[Approve/Proceed with pilot/Further analysis needed]

Request: $____ investment with [timeline]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Deliverable

Create a complete business case package:

1. **ROI Calculator Spreadsheet**
   - Current state inputs
   - Cost calculations
   - Benefit calculations
   - ROI formulas
   - Sensitivity analysis

2. **Documentation**
   - Assumptions with sources
   - Methodology notes
   - Confidence levels

3. **Executive Summary**
   - One-page business case
   - Key metrics highlighted
   - Clear recommendation

4. **Template**
   - Clean version of calculator
   - Ready for future projects

---

## Extension Challenge

**Present to a Skeptic**

Using AI, role-play presenting this business case to:
1. A skeptical CFO who wants to see conservative numbers
2. A CIO who's worried about technical risk
3. A business unit leader who fears job losses

Document the objections raised and how you'd address them.

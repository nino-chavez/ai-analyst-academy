---
id: "lab-7b-agentic-research"
title: "Agentic Research: Trust but Verify"
phase: 4
labNumber: 7.5
estimatedMinutes: 55
objectives:
  - Use agentic AI tools to research a complex topic
  - Manually verify AI-generated citations for accuracy
  - Identify hallucination patterns in agentic outputs
  - Design verification protocols for organizational use
prerequisites:
  - "4.2-organizational-change"
  - "4.3-risk-and-governance"
---

# Lab 7b: Agentic Research — Trust but Verify

## Lab Overview

AI can now browse the web, search databases, and synthesize research autonomously. This is powerful—and dangerous. Agentic AI tools confidently cite sources that don't exist, quote text that was never written, and present fabricated facts as verified research.

In this lab, you'll learn the critical skill of verifying agentic AI output. You'll find the "hallucinations in the haystack" and develop protocols to protect your organization from confidently-wrong AI.

**What you'll create:**
- A verified research report on a complex topic
- Documentation of hallucinations found during verification
- A verification methodology for your organization
- Guardrails recommendations for agentic tool adoption

---

## The Stakes

Consider this scenario:

> A consultant uses an AI research tool to prepare a client presentation. The AI cites three industry reports, two academic studies, and a quote from a competitor's CEO. The presentation goes well. A week later, the client's legal team asks for the source documents. Two of the reports don't exist. The "quote" was never said. The consultant's credibility—and their firm's—is destroyed.

This is not hypothetical. It's happening now.

**Agentic AI is not a search engine.** Search engines find documents that exist. Agentic AI synthesizes responses that *sound* like they came from documents—whether those documents exist or not.

Your job as an AI Operator is to catch the lies before they leave your organization.

---

## Part 1: Select Your Research Tool (5 minutes)

### Choose an Agentic Research Tool

Select one or more:

**Option A: Perplexity**
- Purpose-built for research with citations
- Free tier available
- Claims to cite sources for every claim
- Good test of citation accuracy

**Option B: ChatGPT with Browsing** (Plus/Team required)
- Browse the web in real-time
- Synthesizes from multiple sources
- Variable citation quality

**Option C: Claude with Web Search** (if available)
- Integrated search capabilities
- Generally conservative with claims
- Good for comparison

**Option D: Microsoft Copilot**
- Bing-powered search
- Enterprise-focused
- Often used in business contexts

**Option E: Specialized Research Agent**
- Consensus (academic papers)
- Elicit (research assistant)
- You.com (multi-source)

### Document Your Setup

```
RESEARCH TOOL CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tool: [Name]
Version/Tier: [Free/Pro/Enterprise]
Account type: [Personal/Business]
Date: [Today's date]

Why this tool:
[Why you selected it for this exercise]

Known limitations:
[Any limitations you're aware of]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Part 2: Conduct Agentic Research (15 minutes)

### Choose a Research Topic

Select a topic that's:
- Complex enough to require multiple sources
- Recent enough that information exists online
- Specific enough to have verifiable facts

**Suggested Topics:**

**Option A: Industry Analysis**
"What are the key market trends in [your industry] for 2024-2025? Include market size estimates, growth projections, and major player strategies. Cite sources."

**Option B: Technology Comparison**
"Compare the ROI of implementing [Technology A] vs [Technology B] for mid-sized businesses. Include case studies and cost data. Cite sources."

**Option C: Regulatory Update**
"What are the key AI regulations that will affect [your industry] in [your region] by 2025? Include specific requirements and compliance timelines. Cite sources."

**Option D: Competitive Intelligence**
"What is [Competitor Company]'s strategy for [specific area]? Include recent announcements, executive quotes, and market positioning. Cite sources."

**Option E: Your Research Need**
A real research question from your work that requires verified information.

### Run Your Research Query

1. Submit your query to the agentic tool
2. Request explicit citations (if not automatic)
3. Ask for specific data points, quotes, and statistics
4. Save the complete response

### Document the Raw Output

```
RESEARCH QUERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Topic: [Your topic]

Query submitted:
"""
[Exact query text]
"""

Response received:
"""
[Complete AI response - copy entire thing]
"""

Citations provided: [Number]
Statistics mentioned: [Number]
Quotes included: [Number]
Named sources: [Number]

Initial impression:
[Does this look authoritative? Trustworthy?]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Part 3: Systematic Verification (20 minutes)

### Extract Verifiable Claims

From the AI response, identify every verifiable claim:

| # | Claim Type | Claim | Cited Source | Verification Priority |
|---|------------|-------|--------------|----------------------|
| 1 | Statistic | "[Exact claim]" | [Source if given] | High/Med/Low |
| 2 | Quote | "[Exact quote]" | [Attributed to] | High/Med/Low |
| 3 | Fact | "[Factual claim]" | [Source if given] | High/Med/Low |
| 4 | Date/Event | "[Event claimed]" | [Source if given] | High/Med/Low |

**Prioritize verification of:**
- Statistics with specific numbers
- Direct quotes attributed to people
- Claims about recent events (last 12 months)
- Facts central to the research conclusion

### Verify At Least 5 Citations

For each claim you verify:

```
VERIFICATION RECORD #[N]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLAIM: "[Exact claim from AI]"

CITED SOURCE: [What AI said the source was]

VERIFICATION STEPS:
1. [What you did first]
2. [What you did next]
3. [Final verification action]

SOURCE FOUND: [Yes/No/Partial]

If found:
- Actual URL: [Link]
- Actual text: "[What source actually says]"
- Match accuracy: [Exact/Paraphrase/Distorted/Wrong]

If not found:
- Search attempts: [What you searched]
- Alternative sources checked: [What else you checked]
- Conclusion: [Likely hallucination / Misattribution / Outdated]

VERDICT:
□ Verified accurate
□ Verified with minor discrepancy
□ Significantly distorted
□ Source exists, claim doesn't
□ Source doesn't exist (hallucinated)
□ Cannot verify (inconclusive)

Notes:
[Any additional observations]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Identify Hallucination Patterns

As you verify, watch for these common patterns:

**Pattern 1: Phantom Sources**
- AI cites a report or study that doesn't exist
- URL leads to 404 or unrelated content
- Organization named has no record of publishing it

**Pattern 2: Quote Fabrication**
- Person is real, quote is fabricated
- Quote is partially real but modified
- Quote is attributed to wrong person

**Pattern 3: Number Invention**
- Statistics have no verifiable source
- Numbers are plausible but made up
- Percentages don't match any study

**Pattern 4: Date Shifting**
- Events placed in wrong time period
- Announcements that haven't happened
- Outdated information presented as current

**Pattern 5: Source Conflation**
- Real source, wrong claim attributed
- Multiple sources mixed together
- Correct data, wrong context

---

## Part 4: Document Your Findings (10 minutes)

### Create Verification Report

```
AGENTIC RESEARCH VERIFICATION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: [Date]
Researcher: [Your name]
Tool: [Agentic tool used]
Topic: [Research topic]

SUMMARY
━━━━━━━
Total claims verified: [N]
Verified accurate: [N] ([X]%)
Minor discrepancies: [N] ([X]%)
Significant errors: [N] ([X]%)
Hallucinated: [N] ([X]%)
Inconclusive: [N] ([X]%)

CRITICAL FINDINGS
━━━━━━━━━━━━━━━━
Finding 1: [Most serious hallucination found]
- Claim: [What AI said]
- Reality: [What's actually true]
- Risk: [What could have gone wrong]

Finding 2: [Second most serious]
- Claim: [What AI said]
- Reality: [What's actually true]
- Risk: [What could have gone wrong]

Finding 3: [Third finding]
- Claim: [What AI said]
- Reality: [What's actually true]
- Risk: [What could have gone wrong]

PATTERNS OBSERVED
━━━━━━━━━━━━━━━━
[Which hallucination patterns did you observe?]
□ Phantom sources
□ Quote fabrication
□ Number invention
□ Date shifting
□ Source conflation
□ Other: [Describe]

CORRECTED RESEARCH SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━
[Rewrite the key findings using ONLY verified information]

CONFIDENCE ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━
Overall reliability of AI output: [Low/Medium/High]
Suitable for: [Internal use only / With verification / Not suitable]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Part 5: Design Verification Protocol (5 minutes)

### Create Organizational Verification Standard

Based on your findings, design a protocol:

```
AGENTIC RESEARCH VERIFICATION PROTOCOL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PURPOSE
This protocol ensures AI-generated research is verified before
use in [context: client work / internal decisions / publications].

SCOPE
Applies to: [Who must follow this]
For outputs from: [Which tools]
In contexts of: [What types of work]

VERIFICATION REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━

Tier 1: Internal Use Only
• Minimum claims to verify: [N]
• Must verify: All statistics, all quotes
• Acceptable error rate: [X]%
• Reviewer: [Role]

Tier 2: External Sharing
• Minimum claims to verify: [N, higher]
• Must verify: All claims that could be cited
• Acceptable error rate: [X]%, lower
• Reviewer: [Role]

Tier 3: Publication/Legal
• Claims to verify: 100%
• Primary sources required: Yes
• Error rate: 0% (or don't publish)
• Reviewer: [Role]

VERIFICATION PROCESS
━━━━━━━━━━━━━━━━━━━━
1. [Step 1: Extract claims]
2. [Step 2: Prioritize verification]
3. [Step 3: Search primary sources]
4. [Step 4: Document findings]
5. [Step 5: Revise or reject output]
6. [Step 6: Reviewer sign-off]

RED FLAGS (Require Extra Scrutiny)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• URLs that don't resolve
• "Reports" from organizations that don't publish reports
• Quotes with no clear attribution
• Statistics without methodology
• Very recent claims (< 1 month old)
• Claims that perfectly support the research thesis

DOCUMENTATION REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━
Retain for each verified output:
• Original AI response
• Verification worksheet
• Primary sources accessed
• Corrections made
• Reviewer approval
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Deliverable

Create a complete Agentic Research Audit Package:

1. **Original Research Output**
   - Complete AI response
   - All citations as provided

2. **Verification Worksheet**
   - Minimum 5 claims verified
   - Evidence for each verification
   - Verdict for each claim

3. **Findings Report**
   - Accuracy statistics
   - Hallucinations documented
   - Patterns identified
   - Corrected summary

4. **Verification Protocol**
   - Organizational standard for verification
   - Tiered requirements by risk level
   - Red flags to watch for
   - Documentation requirements

5. **Recommendations**
   - Should your organization use this tool?
   - Under what conditions?
   - With what safeguards?

---

## Extension Challenge

**Comparative Tool Analysis**

1. Run the same research query on 3 different agentic tools
2. Verify 5 claims from each tool
3. Compare:
   - Citation accuracy rates
   - Types of hallucinations
   - Ease of verification
   - Overall reliability

Create a recommendation matrix for which tool to use for which type of research.

**"Find the Lie" Training**

1. Generate 10 AI research outputs on topics you know well
2. Identify which claims are accurate vs. hallucinated WITHOUT verification (test your instincts)
3. Then verify
4. Calculate your "hallucination detection accuracy"
5. Document what signals helped you spot lies vs. what fooled you

Use this to train your intuition and create a "signals of hallucination" checklist for your team.

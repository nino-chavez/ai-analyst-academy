---
id: "lab-10-team-capability-assessment"
title: "Team Capability Assessment"
phase: 5
labNumber: 10
estimatedMinutes: 45
objectives:
  - Assess AI capability levels across a team
  - Identify skill gaps and single points of failure
  - Design a capability development roadmap
prerequisites:
  - "5.2-building-ai-capable-teams"
---

# Lab 10: Team Capability Assessment

## Lab Overview

AI initiatives succeed or fail based on team capability. In this lab, you'll conduct a comprehensive capability assessment and design a development roadmap that builds sustainable AI fluency.

**What you'll create:**
- Team capability heat map
- Skills gap analysis
- Role-based learning paths
- 90-day capability development plan
- Success metrics framework

---

## Part 1: Define Your Team (5 minutes)

### Choose Your Scenario

**Option A: Your Actual Team**
Use your real team (or a team you work closely with).

**Option B: Hypothetical Team**
Use this retail analytics team:

```
TEAM PROFILE: Retail Analytics Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Function: Business analytics and reporting
Reports to: VP of Merchandising
Team size: 6

TEAM MEMBERS

1. Sarah (Team Lead, 8 years exp)
   - Strong SQL, Excel, Tableau
   - Has used ChatGPT for personal projects
   - Skeptical about AI hype but curious

2. Marcus (Senior Analyst, 5 years exp)
   - Strong Python, statistical modeling
   - Experimented with AI APIs
   - Enthusiastic early adopter

3. Priya (Analyst, 3 years exp)
   - Strong Excel, learning SQL
   - Uses Copilot for code completion
   - Wants to learn more

4. James (Analyst, 2 years exp)
   - Strong visualization skills
   - Limited AI exposure
   - Concerned about job security

5. Chen (Junior Analyst, 1 year exp)
   - Recent grad, data science degree
   - Familiar with ML concepts
   - Eager but needs direction

6. Lisa (Business Analyst, 4 years exp)
   - Domain expert, limited technical skills
   - Uses ChatGPT for writing
   - Focused on business outcomes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Document Your Team

```
TEAM CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Team Name: _________________________
Function: _________________________
Size: _____ people
Reporting to: _________________________

Current AI Usage:
□ None / minimal
□ Individual experimentation
□ Some production use cases
□ Integrated into workflows

Biggest capability gaps (initial guess):
1. _________________________
2. _________________________
3. _________________________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Part 2: Individual Assessments (15 minutes)

### Assess Each Team Member

For each person, rate on a 1-5 scale:
- 1 = No capability
- 2 = Basic awareness
- 3 = Can use with guidance
- 4 = Independent proficiency
- 5 = Can teach others

```
INDIVIDUAL ASSESSMENT: [Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role: _________________________
Experience: _____ years

AI CAPABILITY DIMENSIONS

Awareness (1-5): ___
□ Understands what generative AI does
□ Knows current capabilities and limitations
□ Can identify potential AI applications
□ Follows AI developments
Notes: _________________________

Tool Proficiency (1-5): ___
□ Has used at least one AI tool
□ Uses AI tools regularly
□ Navigates multiple AI platforms
□ Understands different tool strengths
Notes: _________________________

Prompt Craft (1-5): ___
□ Can write basic prompts
□ Iterates to improve outputs
□ Uses advanced techniques (role, format, examples)
□ Creates reusable templates
Notes: _________________________

Output Judgment (1-5): ___
□ Recognizes obvious errors
□ Verifies facts and claims
□ Identifies subtle quality issues
□ Knows confidence boundaries
Notes: _________________________

Integration (1-5): ___
□ Uses AI for standalone tasks
□ Combines AI with existing tools
□ Has integrated AI into workflows
□ Designs AI-enhanced processes
Notes: _________________________

Teaching (1-5): ___
□ Can explain AI basics
□ Helps colleagues troubleshoot
□ Develops training materials
□ Mentors others on AI use
Notes: _________________________

OVERALL FLUENCY LEVEL
□ Level 1: Aware
□ Level 2: User
□ Level 3: Designer
□ Level 4: Builder
□ Level 5: Strategist

NOTES
_________________________________________
_________________________________________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Complete this assessment for all team members.

---

## Part 3: Create the Capability Heat Map (5 minutes)

### Compile Individual Scores

```
TEAM CAPABILITY HEAT MAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

           │ Aware │ Tool  │ Prompt │ Output │ Integ │ Teach │ Level
           │       │ Prof  │ Craft  │ Judgmt │       │       │
───────────┼───────┼───────┼────────┼────────┼───────┼───────┼───────
[Name 1]   │   __  │   __  │   __   │   __   │   __  │   __  │  __
[Name 2]   │   __  │   __  │   __   │   __   │   __  │   __  │  __
[Name 3]   │   __  │   __  │   __   │   __   │   __  │   __  │  __
[Name 4]   │   __  │   __  │   __   │   __   │   __  │   __  │  __
[Name 5]   │   __  │   __  │   __   │   __   │   __  │   __  │  __
[Name 6]   │   __  │   __  │   __   │   __   │   __  │   __  │  __
───────────┼───────┼───────┼────────┼────────┼───────┼───────┼───────
Team Avg   │   __  │   __  │   __   │   __   │   __  │   __  │

HEAT MAP KEY
5 = ████ Expert (Can teach)
4 = ███░ Proficient (Independent)
3 = ██░░ Developing (Guided use)
2 = █░░░ Basic (Awareness only)
1 = ░░░░ None

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Analyze the Heat Map

```
CAPABILITY ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SINGLE POINTS OF FAILURE
(Only 1 person at level 4+ in this dimension)
• _________________________
• _________________________

TEAM STRENGTHS
(Average score 4+)
• _________________________
• _________________________

TEAM GAPS
(Average score below 3)
• _________________________
• _________________________

READINESS FOR AI INITIATIVES
(Based on capability distribution)
□ Not ready (most at Level 1-2)
□ Early stage (some at Level 2-3)
□ Developing (most at Level 2-3)
□ Capable (most at Level 3-4)
□ Advanced (most at Level 4-5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Part 4: Skills Gap Analysis (5 minutes)

### Identify Critical Gaps

```
SKILLS GAP ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each gap, assess urgency and difficulty:

GAP 1: _________________________
Current state: ____ (avg score)
Target state: ____ (needed score)
Urgency: □ Critical □ High □ Medium □ Low
Difficulty to close: □ High □ Medium □ Low
Why it matters:
_________________________________________

GAP 2: _________________________
Current state: ____ (avg score)
Target state: ____ (needed score)
Urgency: □ Critical □ High □ Medium □ Low
Difficulty to close: □ High □ Medium □ Low
Why it matters:
_________________________________________

GAP 3: _________________________
Current state: ____ (avg score)
Target state: ____ (needed score)
Urgency: □ Critical □ High □ Medium □ Low
Difficulty to close: □ High □ Medium □ Low
Why it matters:
_________________________________________

GAP 4: _________________________
Current state: ____ (avg score)
Target state: ____ (needed score)
Urgency: □ Critical □ High □ Medium □ Low
Difficulty to close: □ High □ Medium □ Low
Why it matters:
_________________________________________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Part 5: Role-Based Learning Paths (10 minutes)

### Design Learning Paths

Create learning paths based on current level and role needs:

```
LEARNING PATH: CORE AI LITERACY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target: All team members
Duration: 2 weeks
Goal: Everyone at Level 2 minimum

MODULE 1: AI Fundamentals (Week 1)
□ What generative AI can/cannot do
□ Tool landscape overview
□ Security and compliance basics
□ Format: 1-hour workshop + reading

MODULE 2: Hands-On Basics (Week 1-2)
□ Account setup and access
□ First prompts and outputs
□ Basic iteration techniques
□ Format: 2-hour guided session

MODULE 3: Quality and Judgment (Week 2)
□ Evaluating AI outputs
□ Verification practices
□ When to trust vs. verify
□ Format: 1-hour workshop + practice

Assessment:
□ Can explain AI basics to a colleague
□ Has used AI for a real work task
□ Demonstrates basic quality judgment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEARNING PATH: POWER USER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target: [Names of selected team members]
Prerequisite: Core AI Literacy complete
Duration: 4 weeks
Goal: Level 3 capability

MODULE 1: Advanced Prompting (Week 1-2)
□ Structured prompt frameworks
□ Chain-of-thought techniques
□ Few-shot learning
□ Format: Workshop + daily practice

MODULE 2: Workflow Integration (Week 2-3)
□ Identifying integration points
□ Building simple workflows
□ Connecting AI to existing tools
□ Format: Project-based learning

MODULE 3: Quality Systems (Week 3-4)
□ Developing evaluation criteria
□ Building quality checklists
□ Peer review practices
□ Format: Workshop + practice

MODULE 4: Documentation (Week 4)
□ Template creation
□ Best practice documentation
□ Knowledge sharing
□ Format: Project deliverable

Assessment:
□ Has created reusable templates
□ Has integrated AI into a workflow
□ Can evaluate peer AI outputs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEARNING PATH: AI CHAMPION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target: [Names of 1-2 team members]
Prerequisite: Power User complete
Duration: 6 weeks
Goal: Level 4 capability, can lead initiatives

MODULE 1: Use Case Discovery (Week 1-2)
□ Identifying high-value opportunities
□ Assessing feasibility
□ Building business cases
□ Format: Mentored project

MODULE 2: Workflow Design (Week 2-4)
□ Designing end-to-end workflows
□ Error handling and fallbacks
□ User experience considerations
□ Format: Design project

MODULE 3: Training Delivery (Week 4-5)
□ Developing training materials
□ Delivery techniques
□ Handling questions/resistance
□ Format: Prepare and deliver a session

MODULE 4: Change Management (Week 5-6)
□ Adoption strategies
□ Measuring success
□ Continuous improvement
□ Format: Planning and execution

Assessment:
□ Has led an AI initiative
□ Has trained colleagues
□ Has documented learnings
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Part 6: 90-Day Development Plan (5 minutes)

### Create the Implementation Timeline

```
90-DAY CAPABILITY DEVELOPMENT PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WEEK 1-2: FOUNDATION
┌────────────────────────────────────────────────┐
│ • Conduct individual assessments               │
│ • Identify AI Champions (2-3 people)           │
│ • Set up tool access and permissions           │
│ • Schedule Core AI Literacy workshop           │
│                                                │
│ Milestone: All team members assessed           │
└────────────────────────────────────────────────┘

WEEK 3-4: CORE TRAINING
┌────────────────────────────────────────────────┐
│ • Deliver Core AI Literacy (all team)          │
│ • First hands-on exercises                     │
│ • Start weekly "AI office hours"               │
│ • Begin Champion deep-dive track               │
│                                                │
│ Milestone: All at Level 2 minimum              │
└────────────────────────────────────────────────┘

WEEK 5-8: PRACTICE & POWER USERS
┌────────────────────────────────────────────────┐
│ • Continue weekly AI office hours              │
│ • Power User track for selected members        │
│ • First workflow integration project           │
│ • Template development begins                  │
│ • Champions start advanced track               │
│                                                │
│ Milestone: Power Users at Level 3              │
└────────────────────────────────────────────────┘

WEEK 9-10: INTEGRATION
┌────────────────────────────────────────────────┐
│ • Champions deliver first training             │
│ • Workflow projects complete                   │
│ • Template library established                 │
│ • Begin peer review practices                  │
│                                                │
│ Milestone: First AI workflow in production     │
└────────────────────────────────────────────────┘

WEEK 11-12: ASSESSMENT & PLANNING
┌────────────────────────────────────────────────┐
│ • Re-assess all team members                   │
│ • Compare to baseline                          │
│ • Document learnings                           │
│ • Plan months 4-6                              │
│                                                │
│ Milestone: Capability improvement measured     │
└────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Define Success Metrics

```
CAPABILITY DEVELOPMENT METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUANTITATIVE METRICS
┌────────────────────────┬─────────┬─────────┐
│ Metric                 │ Day 0   │ Day 90  │
├────────────────────────┼─────────┼─────────┤
│ Avg fluency level      │   __    │   __    │
│ % at Level 2+          │   __    │   __    │
│ % at Level 3+          │   __    │   __    │
│ # of AI workflows      │   __    │   __    │
│ # of templates created │   __    │   __    │
│ Training hours/person  │   __    │   __    │
└────────────────────────┴─────────┴─────────┘

QUALITATIVE INDICATORS
□ Team confidently discusses AI applications
□ AI use is normalized (not exceptional)
□ Knowledge sharing happens organically
□ New use cases proposed by team members
□ Quality judgment is consistent

ADOPTION SIGNALS
□ Daily/weekly AI tool usage
□ Peer helping with AI questions
□ Resistance has diminished
□ Requests for advanced training
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Deliverable

Create a complete Team Capability Assessment Package:

1. **Individual Assessments** (Part 2)
   - Assessment forms for all team members

2. **Capability Heat Map** (Part 3)
   - Visual heat map
   - Analysis of strengths, gaps, single points of failure

3. **Skills Gap Analysis** (Part 4)
   - Prioritized list of gaps with urgency ratings

4. **Learning Paths** (Part 5)
   - Core AI Literacy path
   - Power User path
   - AI Champion path

5. **90-Day Plan** (Part 6)
   - Week-by-week timeline
   - Milestones and success metrics

---

## Extension Challenge

**Run the Assessment**

1. If using your real team, conduct actual 1:1 assessments
2. Create a presentation of findings for your manager
3. Propose specific learning investments (budget, time, tools)
4. Track progress weekly against your baseline

Document what you learn about running capability assessments in practice.

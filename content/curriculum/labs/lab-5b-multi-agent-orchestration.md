---
id: "lab-5b-multi-agent-orchestration"
title: "Multi-Agent Orchestration"
phase: 3
labNumber: 5.5
estimatedMinutes: 90
objectives:
  - Design a multi-agent system with specialized roles
  - Implement Worker and Manager agent loops
  - Create inter-agent communication protocols
  - Build fault-tolerant agent orchestration
prerequisites:
  - "3.1-no-code-ai-tools"
  - "3.2-api-fundamentals"
  - "3.3-automation-platforms"
  - "lab-5-build-ai-assistant"
---

# Lab 5b: Multi-Agent Orchestration

## Lab Overview

Lab 5 taught you to build a single AI assistant. But real business problems are too complex for one agent.

This lab teaches you to orchestrate **multiple AI agents** that collaborate, check each other's work, and handle tasks too complex for any single agent.

This is the difference between:
- **Automation**: Pre-defined steps executed in sequence
- **Agentic AI**: Agents that reason, delegate, and adapt

**What you'll create:**
- A multi-agent system with Worker and Manager agents
- Defined communication protocols between agents
- Quality gates and verification loops
- A fault-tolerant orchestration pattern

---

## The Multi-Agent Mindset

> **One agent is a tool. Multiple agents are a team.**

Single agents hit walls:
- Context windows overflow
- Specialized tasks suffer from generalist prompts
- No error checking or verification
- Single point of failure

Multi-agent systems solve these through **division of labor** and **checks and balances**.

### Real-World Multi-Agent Examples

| System | Worker Agents | Manager Agent | Value |
|--------|--------------|---------------|-------|
| **Research Pipeline** | Web searcher, paper analyzer, fact checker | Research coordinator | Verified, comprehensive research |
| **Content Creation** | Writer, editor, fact-checker, SEO analyzer | Content lead | Publication-ready content |
| **Customer Support** | Intent classifier, knowledge retriever, response drafter, sentiment analyzer | Support orchestrator | Faster, better responses |
| **Code Review** | Syntax checker, security scanner, style analyzer, documentation verifier | Review coordinator | Comprehensive code review |

---

## Part 1: Understand Agent Patterns (15 minutes)

### Pattern 1: Worker-Manager Hierarchy

```
                    ┌─────────────┐
                    │   MANAGER   │
                    │   AGENT     │
                    └──────┬──────┘
                           │ Delegates tasks
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
     ┌──────────┐   ┌──────────┐   ┌──────────┐
     │ WORKER 1 │   │ WORKER 2 │   │ WORKER 3 │
     │ Research │   │ Analysis │   │ Writing  │
     └──────────┘   └──────────┘   └──────────┘
            │              │              │
            └──────────────┴──────────────┘
                           │ Return results
                    ┌──────▼──────┐
                    │   MANAGER   │
                    │  Synthesizes│
                    └─────────────┘
```

**Manager Agent responsibilities:**
- Breaks complex task into subtasks
- Assigns work to appropriate workers
- Tracks progress and handles failures
- Synthesizes results into final output

**Worker Agent responsibilities:**
- Specialized at one task type
- Executes assigned work
- Reports success, failure, or need for clarification
- Stays within defined scope

### Pattern 2: Pipeline with Verification

```
INPUT → [Agent A: Draft] → [Agent B: Review] → [Agent A: Revise] → OUTPUT
              ↑                                        │
              └────────────── Feedback loop ───────────┘
```

Each agent passes work to the next, with potential loops for refinement.

### Pattern 3: Consensus/Voting

```
QUERY → [Agent A] ─┐
      → [Agent B] ─┼→ [Aggregator: Compare & Synthesize] → OUTPUT
      → [Agent C] ─┘
```

Multiple agents answer the same question; an aggregator combines or selects the best response.

### Pattern 4: Specialist Routing

```
                         ┌─ [Technical Agent] → Technical Response
INPUT → [Router Agent] ──┼─ [Sales Agent] → Sales Response
                         └─ [Support Agent] → Support Response
```

A router determines which specialist should handle each request.

### Exercise: Identify the Pattern

For each scenario, identify the best multi-agent pattern:

| Scenario | Best Pattern | Why? |
|----------|--------------|------|
| Legal contract review requiring multiple expertise areas | [Your answer] | [Your reasoning] |
| Customer inquiry that could be billing, technical, or sales | [Your answer] | [Your reasoning] |
| Research report requiring web search, analysis, and writing | [Your answer] | [Your reasoning] |
| Medical symptom assessment needing high reliability | [Your answer] | [Your reasoning] |

---

## Part 2: Design Your Multi-Agent System (20 minutes)

### Choose Your Scenario

Pick one complex task that genuinely requires multiple agents:

**Scenario A: Research Brief Generator**
```
Input: Topic + Research Question
Agents needed:
  - Web Researcher: Finds and summarizes sources
  - Fact Checker: Verifies claims against sources
  - Synthesizer: Combines findings into brief
  - Quality Reviewer: Checks completeness and accuracy
Output: Research brief with citations
```

**Scenario B: Content Review Pipeline**
```
Input: Draft blog post or article
Agents needed:
  - Editor: Grammar, clarity, structure
  - Fact Checker: Verifies claims
  - Brand Voice Checker: Alignment with tone guidelines
  - SEO Analyzer: Keyword and metadata review
Output: Publication-ready content with change log
```

**Scenario C: Customer Query Resolver**
```
Input: Customer message
Agents needed:
  - Intent Classifier: What does the customer need?
  - Knowledge Retriever: Find relevant information
  - Response Drafter: Create initial response
  - Empathy Reviewer: Check tone and helpfulness
Output: Customer-ready response
```

**Scenario D: Your Business Process**
```
Input: [Real input from your work]
Agents needed:
  - [Agent 1]: [Specialized task]
  - [Agent 2]: [Specialized task]
  - [Agent 3]: [Verification/synthesis]
Output: [Business deliverable]
```

### Document Your Agent Design

```
MULTI-AGENT SYSTEM DESIGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SYSTEM NAME: [Name]

PROBLEM STATEMENT:
[What complex task does this system handle?]
[Why can't a single agent do this effectively?]

PATTERN: [Worker-Manager / Pipeline / Consensus / Routing]

INPUT:
[What triggers the system?]
[What data is provided?]

OUTPUT:
[What deliverable is produced?]
[What quality standards must it meet?]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AGENT ROSTER:

Agent 1: [NAME]
─────────────────
Role: [Manager / Worker]
Responsibility: [What this agent does]
Inputs: [What it receives]
Outputs: [What it produces]
Model: [Which LLM - consider cost/capability tradeoffs]
Key prompt elements:
  - [Instruction 1]
  - [Instruction 2]
  - [Output format]

Agent 2: [NAME]
─────────────────
Role: [Manager / Worker]
Responsibility: [What this agent does]
Inputs: [What it receives]
Outputs: [What it produces]
Model: [Which LLM]
Key prompt elements:
  - [Instruction 1]
  - [Instruction 2]
  - [Output format]

Agent 3: [NAME]
─────────────────
Role: [Manager / Worker]
Responsibility: [What this agent does]
Inputs: [What it receives]
Outputs: [What it produces]
Model: [Which LLM]
Key prompt elements:
  - [Instruction 1]
  - [Instruction 2]
  - [Output format]

[Add more agents as needed]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Part 3: Design Communication Protocols (15 minutes)

### Agent Message Format

Agents need structured communication. Define a standard message format:

```json
{
  "from_agent": "researcher",
  "to_agent": "manager",
  "message_type": "work_complete|needs_input|error|status",
  "timestamp": "2024-01-15T10:30:00Z",
  "task_id": "research-001",
  "status": "success|partial|failure",
  "payload": {
    "result": "[The work output]",
    "confidence": "high|medium|low",
    "sources": ["[citations if applicable]"],
    "notes": "[Any caveats or observations]"
  },
  "next_action": "proceed|retry|escalate|clarify"
}
```

### Define Your Communication Protocol

```
INTER-AGENT COMMUNICATION PROTOCOL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WORKFLOW SEQUENCE:

Step 1: [Manager] receives initial request
        ↓ Parses and creates task breakdown
        ↓ Sends to [Worker A]

Step 2: [Worker A] receives task
        ↓ Executes specialized work
        ↓ Returns result to [Manager]

Step 3: [Manager] evaluates result
        ↓ IF quality OK → Send to [Worker B]
        ↓ IF quality NOT OK → Return to [Worker A] with feedback

Step 4: [Worker B] receives work + prior results
        ↓ Executes next phase
        ↓ Returns to [Manager]

Step 5: [Manager] synthesizes all results
        ↓ Produces final output

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MESSAGE TYPES:

TASK_ASSIGNMENT (Manager → Worker)
{
  "task": "[What to do]",
  "context": "[Relevant background]",
  "constraints": "[Time, format, scope limits]",
  "success_criteria": "[How to know it's done well]"
}

WORK_RESULT (Worker → Manager)
{
  "result": "[The output]",
  "quality_self_assessment": "[Worker's view of quality]",
  "blockers": "[Any issues encountered]",
  "recommendations": "[Suggestions for next steps]"
}

FEEDBACK (Manager → Worker)
{
  "assessment": "[What was good/what needs work]",
  "specific_requests": "[Exact changes needed]",
  "priority": "[How urgent]"
}

FINAL_OUTPUT (Manager → System)
{
  "deliverable": "[The final product]",
  "process_summary": "[What agents did]",
  "confidence": "[Overall quality assessment]",
  "recommendations": "[Next steps if any]"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Quality Gates

Define checkpoints where agents verify work:

```
QUALITY GATES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gate 1: After [Agent A] completes
Criteria:
  - [ ] Output format correct
  - [ ] Required fields present
  - [ ] No obvious errors
  - [ ] Confidence above threshold
Pass → Continue to next agent
Fail → Retry (max 2) or escalate

Gate 2: After [Agent B] completes
Criteria:
  - [ ] Builds correctly on prior work
  - [ ] Quality maintained or improved
  - [ ] No contradictions introduced
Pass → Continue
Fail → Return to previous agent with feedback

Gate 3: Final synthesis
Criteria:
  - [ ] All components integrated
  - [ ] Meets original request requirements
  - [ ] Quality standards achieved
  - [ ] Ready for end user
Pass → Deliver output
Fail → Identify weakest component, request revision

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Part 4: Build the System (25 minutes)

### Implementation Options

Choose your implementation approach:

**Option A: Prompt Chain (Simplest)**
- Execute agents sequentially with copy/paste between
- Good for prototyping and testing
- Manual orchestration

**Option B: Automation Platform**
- Use Zapier/Make/n8n to orchestrate
- Each agent is an AI action in the workflow
- Automatic data passing between agents

**Option C: Claude Projects / GPT Assistants**
- Create separate assistants for each agent role
- Programmatically call each in sequence
- More sophisticated but requires API access

**Option D: Code-Based (Advanced)**
- Build with LangChain, CrewAI, or AutoGen
- Full control over orchestration
- Requires programming knowledge

### Write Agent Prompts

For each agent in your system, write a complete prompt:

**MANAGER AGENT PROMPT TEMPLATE:**
```
You are the Manager Agent for a [SYSTEM PURPOSE] system.

YOUR ROLE:
You coordinate a team of specialized worker agents to accomplish complex tasks.
You do NOT do the specialized work yourself—you delegate, evaluate, and synthesize.

WORKER AGENTS AVAILABLE:
1. [Worker A Name]: [What they do]
2. [Worker B Name]: [What they do]
3. [Worker C Name]: [What they do]

YOUR PROCESS:
1. Analyze the incoming request
2. Break it into subtasks for your workers
3. Evaluate each worker's output
4. Request revisions if quality insufficient
5. Synthesize final deliverable

WHEN YOU RECEIVE A NEW REQUEST:
1. Confirm you understand the request
2. Create a task breakdown:
   - Task for [Worker A]: [specific instructions]
   - Task for [Worker B]: [specific instructions]
   - Task for [Worker C]: [specific instructions]
3. Define success criteria for each task

WHEN YOU RECEIVE WORKER OUTPUT:
1. Evaluate against success criteria
2. If PASS: Acknowledge and proceed to next step
3. If FAIL: Provide specific feedback and request revision

WHEN ALL WORK IS COMPLETE:
1. Synthesize outputs into final deliverable
2. Note any limitations or caveats
3. Suggest follow-up actions if relevant

OUTPUT FORMAT:
[Define structured output format for manager communications]
```

**WORKER AGENT PROMPT TEMPLATE:**
```
You are the [WORKER NAME] Agent, a specialist in [SPECIALTY].

YOUR ROLE:
You are part of a multi-agent system managed by a Manager Agent.
You receive specific tasks and return high-quality results.

YOUR SPECIALTY:
[Detailed description of what this agent does well]

YOUR SCOPE:
DO: [What this agent should do]
DON'T: [What this agent should NOT attempt]

WHEN YOU RECEIVE A TASK:
1. Confirm you understand the assignment
2. Execute your specialized work
3. Self-assess your output quality
4. Return results in the specified format

OUTPUT FORMAT:
{
  "status": "complete|partial|blocked",
  "result": "[Your work output]",
  "confidence": "high|medium|low",
  "notes": "[Any caveats or observations]",
  "needs_from_manager": "[Any clarification or resources needed]"
}

QUALITY STANDARDS:
- [Standard 1]
- [Standard 2]
- [Standard 3]

If you cannot complete the task to quality standards, explain why
rather than producing subpar work.
```

### Test Individual Agents

Before orchestrating, test each agent in isolation:

| Agent | Test Input | Expected Output | Actual Output | Pass? |
|-------|------------|-----------------|---------------|-------|
| Manager | Sample request | Task breakdown | [Result] | ☐ |
| Worker A | Sample task | Specialized output | [Result] | ☐ |
| Worker B | Sample task | Specialized output | [Result] | ☐ |
| Worker C | Sample task | Specialized output | [Result] | ☐ |

---

## Part 5: Error Handling & Resilience (10 minutes)

### Failure Modes

Multi-agent systems can fail in new ways:

| Failure Mode | Cause | Mitigation |
|--------------|-------|------------|
| **Agent timeout** | Slow or stuck agent | Set timeouts, retry logic |
| **Quality spiral** | Agents keep rejecting each other's work | Max revision limit, human escalation |
| **Context loss** | Key info not passed between agents | Structured message formats |
| **Infinite loops** | Circular dependencies | Loop detection, max iterations |
| **Cascading failures** | One agent failure breaks chain | Fallback behaviors, partial output |

### Define Your Error Handling

```
ERROR HANDLING PROTOCOL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIMEOUTS:
- Worker agents: [X] seconds max per task
- Full pipeline: [Y] seconds max end-to-end
- On timeout: [Action]

RETRY POLICY:
- Max retries per agent: [N]
- Retry triggers: [What causes retry]
- Retry with changes: [What gets modified]

REVISION LIMITS:
- Max Manager → Worker revision loops: [N]
- On limit reached: [Action]

ESCALATION:
- Trigger: [What causes escalation]
- Escalate to: [Human role or backup system]
- Context provided: [What info accompanies escalation]

PARTIAL OUTPUT POLICY:
- When acceptable: [Conditions]
- When not acceptable: [Conditions]
- Format: [How to present partial results]

LOGGING:
- Log all inter-agent messages: [Yes/No]
- Log final output: [Yes/No]
- Log errors: [Yes/No]
- Retention: [How long]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Part 6: End-to-End Test (10 minutes)

### Run Complete System

Execute your multi-agent system with a realistic input:

```
END-TO-END TEST DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEST CASE 1: Standard Input
Input: [Realistic test input]

Agent Execution Log:
┌─────────────────────────────────────────────────────┐
│ [Timestamp] Manager: Received request               │
│ [Timestamp] Manager: Created task breakdown         │
│ [Timestamp] Manager → Worker A: Assigned task       │
│ [Timestamp] Worker A: Task complete, returning      │
│ [Timestamp] Manager: Evaluated, quality PASS        │
│ [Timestamp] Manager → Worker B: Assigned task       │
│ [Timestamp] Worker B: Task complete, returning      │
│ [Timestamp] Manager: Evaluated, quality PASS        │
│ [Timestamp] Manager: Synthesizing final output      │
│ [Timestamp] System: Output delivered                │
└─────────────────────────────────────────────────────┘

Output Quality Assessment:
- Completeness: [1-5]
- Accuracy: [1-5]
- Format: [1-5]
- Meets requirements: [Yes/No]

Time to complete: [X seconds/minutes]
Tokens used: [Approximate]
Cost: [Estimated]

TEST CASE 2: Edge Case
Input: [Unusual or challenging input]
[Same logging format]

TEST CASE 3: Error Condition
Input: [Input designed to trigger failure handling]
[Same logging format]
Error handling worked correctly: [Yes/No]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Deliverable

Create a complete multi-agent system package:

### 1. System Architecture Document
- Pattern used (Worker-Manager, Pipeline, etc.)
- Agent roster with responsibilities
- Communication flow diagram
- Quality gates defined

### 2. Agent Prompts (Complete)
- Manager agent prompt
- All worker agent prompts
- Message format specifications

### 3. Communication Protocol
- Message types and formats
- Handoff procedures
- Quality gate criteria

### 4. Error Handling Plan
- Failure modes identified
- Retry and escalation policies
- Partial output handling

### 5. Test Results
- Individual agent tests
- End-to-end test cases
- Performance metrics (time, tokens, cost)

### 6. Comparison Analysis
```
SINGLE AGENT VS. MULTI-AGENT COMPARISON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Same task performed by:
A) Single generalist agent
B) Your multi-agent system

Metric            | Single Agent | Multi-Agent | Winner
──────────────────┼──────────────┼─────────────┼────────
Quality score     │ [1-5]        │ [1-5]       │ [A/B]
Completeness      │ [1-5]        │ [1-5]       │ [A/B]
Time to complete  │ [X sec]      │ [Y sec]     │ [A/B]
Token usage       │ [X]          │ [Y]         │ [A/B]
Cost              │ [$X]         │ [$Y]        │ [A/B]
Error handling    │ [1-5]        │ [1-5]       │ [A/B]

VERDICT:
[When is multi-agent worth it for this task?]
[What task complexity threshold justifies the overhead?]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Extension Challenge

### Advanced: Self-Improving Agent System

Design (and optionally build) a system where agents improve over time:

1. **Feedback Collection Agent**
   - Gathers quality ratings on outputs
   - Identifies patterns in failures
   - Tracks which agent contributions are strongest/weakest

2. **Prompt Optimization Agent**
   - Analyzes feedback patterns
   - Suggests prompt modifications
   - A/B tests prompt variations

3. **Performance Dashboard**
   - Tracks quality over time
   - Monitors cost efficiency
   - Alerts on degradation

Document your design:
- How would agents learn from feedback?
- What metrics would you track?
- How would you prevent drift or degradation?
- What human oversight would remain?

---

## Key Takeaways

1. **Multi-agent systems solve complexity** that single agents cannot handle
2. **Clear roles and protocols** prevent chaos and duplication
3. **Quality gates** catch errors before they propagate
4. **Error handling is essential** — agents fail in new ways
5. **Measure the tradeoff** — multi-agent overhead must be justified by quality gains

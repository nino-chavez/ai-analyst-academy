# Interactive Component Specifications

> Design specifications for future interactive components that will differentiate AI Operator Academy's learning experience.

## Overview

These interactive components transform passive reading into active learning. They are strategically placed in the curriculum to reinforce key concepts through hands-on experimentation.

---

## Component 1: Context Window Visualizer

**Module placement:** 1.1 (Economics of Intelligence)

### Purpose

Demonstrate how context windows work by visualizing token consumption in real-time. Learners often underestimate how quickly context fills up, leading to truncation and cost surprises.

### User Story

> As a learner, I want to see how my prompts consume context window space so that I understand token economics before incurring real costs.

### Visual Specification

```
┌─────────────────────────────────────────────────────────────────┐
│  Context Window Visualizer                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Model: [GPT-4o ▼]        Context: 128,000 tokens               │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  │ System    User      Response Reserved    Available        │  │
│  │ 2,400     1,200     4,000               120,400           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ System Prompt:                                              ││
│  │ ┌─────────────────────────────────────────────────────────┐ ││
│  │ │ You are a helpful assistant that...                     │ ││
│  │ │                                                         │ ││
│  │ └─────────────────────────────────────────────────────────┘ ││
│  │ Tokens: 2,400 | Cost: $0.024                                ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ User Prompt:                                                ││
│  │ ┌─────────────────────────────────────────────────────────┐ ││
│  │ │ Analyze the following quarterly report...               │ ││
│  │ │                                                         │ ││
│  │ └─────────────────────────────────────────────────────────┘ ││
│  │ Tokens: 1,200 | Cost: $0.012                                ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  [ Simulate Response ]  [ Reset ]  [ Load Example ]             │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Insights:                                                   ││
│  │ • Your system prompt uses 1.9% of context                  ││
│  │ • At current usage, ~20 conversation turns before full     ││
│  │ • Estimated cost per conversation: $0.15-0.25              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Functional Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Model selection | Dropdown with GPT-4o, GPT-4o-mini, Claude 3.5 Sonnet, Claude 3.5 Haiku | P0 |
| Live token counting | Count tokens as user types using tiktoken (client-side) | P0 |
| Visual progress bar | Segmented bar showing system/user/response/available | P0 |
| Cost calculation | Real-time cost based on current pricing | P0 |
| Example loader | Pre-built examples showing different use cases | P1 |
| Response simulation | Simulate response token consumption | P1 |
| Conversation mode | Track multi-turn consumption | P2 |

### Props Interface

```typescript
interface ContextWindowVisualizerProps {
  /** Initial model selection */
  initialModel?: 'gpt-4o' | 'gpt-4o-mini' | 'claude-3-5-sonnet' | 'claude-3-5-haiku';
  /** Show cost calculations */
  showCosts?: boolean;
  /** Preloaded examples */
  examples?: ContextExample[];
  /** Callback when user interacts */
  onInteraction?: (event: VisualizerEvent) => void;
}

interface ContextExample {
  name: string;
  systemPrompt: string;
  userPrompt: string;
  description: string;
}

interface VisualizerEvent {
  type: 'model_change' | 'input_change' | 'example_loaded';
  data: Record<string, unknown>;
}
```

### Technical Notes

- Use `tiktoken` for OpenAI tokenization (available via WASM)
- Anthropic tokenization approximation: `characters / 4`
- Pricing data should be configurable (JSON file, updatable)
- Store pricing as `$/1M tokens` to match provider conventions

### Learning Objectives

After using this component, learners should understand:
1. Context windows have finite capacity
2. Longer prompts consume more tokens and cost more
3. System prompts persist across turns
4. Different models have different context sizes and costs

---

## Component 2: Token Economics Calculator

**Module placement:** 1.1 (Economics of Intelligence), 4.2 (AI ROI)

### Purpose

Compare costs across providers and models for realistic workloads. Help learners build intuition for AI economics before committing to a provider.

### User Story

> As a business operator, I want to estimate AI costs for my use case so that I can budget accurately and choose the right provider.

### Visual Specification

```
┌─────────────────────────────────────────────────────────────────┐
│  Token Economics Calculator                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📊 Define Your Workload                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Average input tokens per request:    [ 500     ] tokens     ││
│  │ Average output tokens per request:   [ 200     ] tokens     ││
│  │ Requests per day:                    [ 1,000   ] requests   ││
│  │ Working days per month:              [ 22      ] days       ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  📈 Monthly Cost Comparison                                      │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Model                    │ Input    │ Output   │ Monthly    ││
│  │ ─────────────────────────┼──────────┼──────────┼──────────  ││
│  │ GPT-4o                   │ $55.00   │ $88.00   │ $143.00    ││
│  │ GPT-4o-mini              │ $8.25    │ $13.20   │ $21.45     ││
│  │ Claude 3.5 Sonnet        │ $33.00   │ $66.00   │ $99.00     ││
│  │ Claude 3.5 Haiku         │ $5.50    │ $11.00   │ $16.50 ✓   ││
│  │ Gemini 1.5 Pro           │ $38.50   │ $77.00   │ $115.50    ││
│  │ Gemini 1.5 Flash         │ $4.13    │ $8.25    │ $12.38 ✓   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  💡 Insights                                                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ • Cheapest option: Gemini 1.5 Flash ($12.38/mo)            ││
│  │ • Most capable: GPT-4o or Claude 3.5 Sonnet                ││
│  │ • Best value: Claude 3.5 Haiku (quality/price ratio)       ││
│  │ • Annual difference: $1,567 (GPT-4o vs Gemini Flash)       ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📊 Cost Distribution                                        ││
│  │                                                             ││
│  │ GPT-4o      ████████████████████████████████████ $143      ││
│  │ GPT-4o-mini █████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ $21       ││
│  │ Sonnet      ██████████████████████████░░░░░░░░░░ $99       ││
│  │ Haiku       ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ $17       ││
│  │ Gemini Pro  ███████████████████████████████░░░░░ $116      ││
│  │ Gemini Flash ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ $12       ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  [ Export CSV ]  [ Share Link ]  [ Save Scenario ]              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Functional Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Workload inputs | Input/output tokens, requests, frequency | P0 |
| Multi-provider comparison | OpenAI, Anthropic, Google at minimum | P0 |
| Monthly cost calculation | Based on workload inputs | P0 |
| Visual comparison | Bar chart or table | P0 |
| Insights generation | Highlight cheapest, best value, etc. | P1 |
| Export functionality | CSV download of comparison | P1 |
| Shareable links | URL with workload parameters | P2 |
| Scenario saving | Local storage for saved scenarios | P2 |

### Props Interface

```typescript
interface TokenEconomicsCalculatorProps {
  /** Pre-filled workload parameters */
  initialWorkload?: WorkloadParams;
  /** Models to include in comparison */
  models?: ModelConfig[];
  /** Show advanced options (batching discounts, etc.) */
  showAdvanced?: boolean;
  /** Callback when calculation changes */
  onCalculation?: (result: CalculationResult) => void;
}

interface WorkloadParams {
  inputTokensPerRequest: number;
  outputTokensPerRequest: number;
  requestsPerDay: number;
  workingDaysPerMonth: number;
}

interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'other';
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  contextWindow: number;
}

interface CalculationResult {
  workload: WorkloadParams;
  results: ModelCost[];
  insights: string[];
}

interface ModelCost {
  modelId: string;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  annualCost: number;
}
```

### Technical Notes

- Pricing should be stored in a configurable JSON file
- Include last-updated date for pricing
- Consider caching pricing data for offline use
- Bar chart: use CSS for simplicity, consider `chart.js` for advanced views

### Learning Objectives

After using this component, learners should understand:
1. AI costs scale with volume
2. Model choice dramatically affects costs
3. Input tokens are generally cheaper than output tokens
4. Cheaper models may be sufficient for many use cases

---

## Component 3: Risk Matrix Builder

**Module placement:** 4.3 (Risk Management), Lab 7 (Governance Framework)

### Purpose

Guide learners through AI risk assessment using a structured framework. Transform abstract risk concepts into concrete, actionable analysis.

### User Story

> As a team lead evaluating AI adoption, I want to systematically assess risks so that I can present a balanced view to stakeholders.

### Visual Specification

```
┌─────────────────────────────────────────────────────────────────┐
│  Risk Matrix Builder                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📋 Use Case: [ Customer Service AI Chatbot              ▼ ]    │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Risk Categories                 Your Assessment                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ⚠️ Accuracy Risks                                          ││
│  │  ┌─────────────────────────────────────────────────────┐   ││
│  │  │ Hallucination likelihood:        [●●●○○] Medium     │   ││
│  │  │ Impact if wrong:                 [●●●●○] High       │   ││
│  │  │ Detection difficulty:            [●●○○○] Low        │   ││
│  │  │ Mitigation in place:             [●●●○○] Partial    │   ││
│  │  └─────────────────────────────────────────────────────┘   ││
│  │  Risk Score: MEDIUM-HIGH ⚠️                                ││
│  │                                                             ││
│  │  🔒 Security Risks                                          ││
│  │  ┌─────────────────────────────────────────────────────┐   ││
│  │  │ Prompt injection exposure:       [●●○○○] Low        │   ││
│  │  │ Data leakage potential:          [●●●○○] Medium     │   ││
│  │  │ Access control gaps:             [●○○○○] Minimal    │   ││
│  │  │ Mitigation in place:             [●●●●○] Strong     │   ││
│  │  └─────────────────────────────────────────────────────┘   ││
│  │  Risk Score: LOW ✓                                         ││
│  │                                                             ││
│  │  📊 Operational Risks                                       ││
│  │  ┌─────────────────────────────────────────────────────┐   ││
│  │  │ Cost overrun likelihood:         [●●●○○] Medium     │   ││
│  │  │ Dependency on provider:          [●●●●○] High       │   ││
│  │  │ Integration complexity:          [●●○○○] Low        │   ││
│  │  │ Mitigation in place:             [●●○○○] Weak       │   ││
│  │  └─────────────────────────────────────────────────────┘   ││
│  │  Risk Score: MEDIUM ⚠️                                     ││
│  │                                                             ││
│  │  ⚖️ Compliance Risks                                        ││
│  │  ┌─────────────────────────────────────────────────────┐   ││
│  │  │ Regulatory exposure:             [●●○○○] Low        │   ││
│  │  │ Data privacy concerns:           [●●●○○] Medium     │   ││
│  │  │ Audit trail adequacy:            [●●●●○] Good       │   ││
│  │  │ Mitigation in place:             [●●●○○] Partial    │   ││
│  │  └─────────────────────────────────────────────────────┘   ││
│  │  Risk Score: LOW-MEDIUM                                    ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  📊 Overall Risk Profile                                         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                     HIGH │     │     │ ⚠️  │     │         ││
│  │                          │     │     │     │     │         ││
│  │  I                  MED  │     │ ⚠️  │     │     │         ││
│  │  M                       │     │     │     │     │         ││
│  │  P                  LOW  │ ✓   │     │     │     │         ││
│  │  A                       │     │     │     │     │         ││
│  │  C                       ├─────┼─────┼─────┼─────┤         ││
│  │  T                       │ LOW │ MED │ HIGH│CRIT │         ││
│  │                          │     LIKELIHOOD      │             ││
│  │                                                              ││
│  │  Legend: ⚠️ Accuracy  🔒 Security  📊 Operations  ⚖️ Compliance ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  📝 Recommendations                                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 1. Implement human review for high-stakes responses         ││
│  │ 2. Add cost monitoring and alerts                           ││
│  │ 3. Consider multi-provider strategy to reduce dependency    ││
│  │ 4. Document decision-making process for audit trail         ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  [ Export Report ]  [ Save Assessment ]  [ Share ]              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Functional Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Use case templates | Pre-built templates for common use cases | P0 |
| Risk category sliders | 4-5 categories with sub-dimensions | P0 |
| Real-time scoring | Calculate risk scores as user adjusts | P0 |
| Visual matrix | Impact vs. likelihood grid | P0 |
| Recommendations | Context-aware suggestions based on scores | P1 |
| Report export | PDF or markdown export | P1 |
| Save/load assessments | Local storage or account-based | P2 |
| Comparison mode | Compare two assessments side-by-side | P2 |

### Props Interface

```typescript
interface RiskMatrixBuilderProps {
  /** Pre-selected use case template */
  useCase?: UseCaseTemplate;
  /** Risk categories to include */
  categories?: RiskCategory[];
  /** Show recommendations based on scores */
  showRecommendations?: boolean;
  /** Callback when assessment changes */
  onAssessmentChange?: (assessment: RiskAssessment) => void;
}

interface UseCaseTemplate {
  id: string;
  name: string;
  description: string;
  defaultScores: Partial<RiskAssessment>;
}

interface RiskCategory {
  id: string;
  name: string;
  icon: string;
  dimensions: RiskDimension[];
  weight: number; // For overall score calculation
}

interface RiskDimension {
  id: string;
  label: string;
  description: string;
  scale: 1 | 2 | 3 | 4 | 5;
}

interface RiskAssessment {
  useCase: string;
  scores: Record<string, Record<string, number>>; // category -> dimension -> score
  overallScore: number;
  recommendations: string[];
  timestamp: string;
}
```

### Technical Notes

- Slider UI: Consider accessible range inputs with visual feedback
- Score calculation: Weighted average with configurable weights
- Recommendations: Rule-based engine matching score patterns to advice
- Matrix visualization: CSS Grid or SVG for impact/likelihood plot
- Export: Generate markdown that can be converted to PDF client-side

### Learning Objectives

After using this component, learners should understand:
1. AI risks are multi-dimensional
2. Mitigation reduces but doesn't eliminate risk
3. Different use cases have different risk profiles
4. Systematic assessment enables informed decisions

---

## Implementation Priority

| Component | Phase | Complexity | Learning Value | Priority |
|-----------|-------|------------|----------------|----------|
| Context Window Visualizer | 1 | Medium | High | P0 |
| Token Economics Calculator | 1/4 | Low-Medium | High | P0 |
| Risk Matrix Builder | 4 | Medium-High | High | P1 |

### Development Sequence

1. **Week 1-2:** Context Window Visualizer
   - Core token counting
   - Model selection
   - Visual progress bar

2. **Week 3:** Token Economics Calculator
   - Workload inputs
   - Multi-provider comparison
   - Basic visualization

3. **Week 4-5:** Risk Matrix Builder
   - Category structure
   - Scoring engine
   - Matrix visualization

4. **Week 6:** Polish & Integration
   - Responsive design
   - Accessibility audit
   - Learning analytics integration

---

## Shared Design Principles

### Accessibility

All components must:
- Meet WCAG 2.1 AA standards
- Support keyboard navigation
- Include ARIA labels
- Work with screen readers
- Provide high-contrast mode

### Mobile Responsiveness

- All components stack vertically on mobile
- Touch targets minimum 44x44px
- Inputs work with on-screen keyboards
- Charts adapt to narrow viewports

### State Persistence

- Use local storage for in-progress work
- Provide explicit save/export for completed work
- Clear "reset" functionality
- URL-based state for sharing (where appropriate)

### Analytics Integration

Track for learning insights:
- Time spent interacting
- Configuration changes
- Completion of key actions
- Export/share events

---

## Related Documentation

- [Component API Reference](../development/component-api.md) — Existing component specs
- [Design Tokens](../DESIGN_TOKENS.md) — Color and spacing tokens
- [Learning UX Principles](../LEARNING_UX_PRINCIPLES.md) — Interaction guidelines

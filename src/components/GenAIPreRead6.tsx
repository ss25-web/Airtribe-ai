'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import GenAIPreReadLayout from './GenAIPreReadLayout';
import GenAIStreakCard, { GenAILatestBadgePanel } from './GenAISidebarExtras';
import QuizEngine from './QuizEngine';
import GenAIAvatar, { GenAIConversationScene, GenAIHeroCharacterStrip } from './GenAIAvatar';
import type { GenAITrack } from './genaiTypes';
import {
  ApplyItBox, ChapterSection, NextChapterTeaser, PMPrincipleBox, SituationCard,
  TiltCard, chLabel, h2, keyBox, para, pullQuote,
} from './pm-fundamentals/designSystem';
import { LangSmithFrame, LangSmithLabel, LS } from './langsmithChrome';
import {
  filterCaScenarios, type CaScenario,
  filterToolScenarios, type ToolScenario,
  filterTraceScenarios, type TraceScenario, type SpanType, type Span,
  filterGroundingScenarios, type GroundingScenario,
  filterAnomalyScenarios, type AnomalyScenario,
} from '@/data/genai/pr6-tools';

const ACCENT = '#7C3AED';
const ACCENT_RGB = '124,58,237';
const MODULE_NUM = '06';

const CONCEPTS = [
  { id: 'genai-m6-architecture', label: 'Agent Architecture',   color: '#7C3AED' },
  { id: 'genai-m6-tools',        label: 'Tool Use',             color: '#2563EB' },
  { id: 'genai-m6-reasoning',    label: 'Multi-Step Reasoning', color: '#0891B2' },
  { id: 'genai-m6-rag',          label: 'RAG in Agents',        color: '#059669' },
  { id: 'genai-m6-scale',        label: 'Scale & Observability',color: '#C2410C' },
];

const SECTIONS = [
  { id: 'genai-m6-architecture', label: '1. Agent Architecture' },
  { id: 'genai-m6-tools',        label: '2. Tool Use & Integrations' },
  { id: 'genai-m6-reasoning',    label: '3. Multi-Step Reasoning' },
  { id: 'genai-m6-rag',          label: '4. RAG in Agent Workflows' },
  { id: 'genai-m6-scale',        label: '5. Scale & Observability' },
];

const BADGES = [
  { id: 'genai-m6-architecture', icon: '🏗️', label: 'Architect',    color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'genai-m6-tools',        icon: '🔌', label: 'Tool Wirer',   color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'genai-m6-reasoning',    icon: '🧠', label: 'ReAct Thinker',color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
  { id: 'genai-m6-rag',          icon: '📚', label: 'RAG Builder',  color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'genai-m6-scale',        icon: '📈', label: 'Observer',     color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
];

const QUIZZES = [
  {
    conceptId: 'genai-m6-architecture',
    question: {
      engineer: "Aarav is asked to build an AI system that checks eligibility for a claim. The eligibility check has 3 fixed steps, always in the same order, with no branching. Should he build an agent or a chain?",
      'builder': "Rhea wants to automate a renewal reminder: pull overdue renewals → format a reminder email → send it. Always the same 3 steps. Should she use an agent or a workflow chain?",
    },
    options: {
      engineer: [
        'A. An agent — its tool-calling flexibility handles unexpected edge cases for free',
        'B. A chain — fixed sequence, no decisions to make; an agent only adds overhead',
        'C. An agent — agents outperform chains on multi-step tasks across most workloads',
        'D. A chain with an agent fallback whenever any step returns a non-happy-path result',
      ],
      'builder': [
        'A. An agent — agents are smarter and tend to handle structured tasks better',
        'B. A workflow chain — fixed steps with no decisions means an agent is the wrong tool',
        'C. An agent — agents can be reused across different tasks with minimal reconfiguration',
        'D. Neither — use a plain scheduled trigger with no AI in the loop at all',
      ],
    },
    correctIndex: { engineer: 1, 'builder': 1 },
    explanation: {
      engineer: "Agents are for tasks where the next action is uncertain. A fixed-sequence task is a chain — an agent only adds latency, token cost, and unpredictability with no benefit.",
      'builder': "An agent decides what to do next based on what it finds. A chain runs a fixed sequence. With no decisions to make, a chain is cheaper, faster, and more predictable.",
    },
    keyInsight: "Use a chain when the steps are known. Use an agent when the steps depend on what the previous step found. Most automation tasks are chains.",
  },
  {
    conceptId: 'genai-m6-tools',
    question: {
      engineer: "Aarav defines a tool called `search_claims`. The description reads: 'Searches claims.' The agent calls it with every query, even irrelevant ones. What is the most likely cause?",
      'builder': "Rhea's agent has a 'Send Email' tool. It sends an email on almost every turn — including turns where no email is needed. What should be changed?",
    },
    options: {
      engineer: [
        "A. The model is too capable — strong models over-use tools whenever any are available",
        'B. Tool description is too vague — model has no rule for when NOT to call it',
        'C. The tool schema is missing required params, so the model defaults to calling it',
        'D. The agent node is configured to invoke every available tool on every turn',
      ],
      'builder': [
        'A. The Send Email tool is too prominent — move it to a separate, gated toolset',
        'B. Tool description needs to spell out exactly when the tool should NOT be called',
        'C. Reduce the total number of tools available so the agent has fewer to over-use',
        'D. Add a human approval gate that fires before every Send Email tool call',
      ],
    },
    correctIndex: { engineer: 1, 'builder': 1 },
    explanation: {
      engineer: "Models use tool descriptions to decide when to call a tool. Add a precise trigger clause and a non-call clause: 'Call this when the user is looking for a specific claim by ID. Do not call for general questions about claims policy.'",
      'builder': "'Send Email' with no constraints tells the model it can send email whenever it seems helpful. Add: 'Only call this when the user explicitly requests an email. Do not call for summaries, lookups, or confirmations.'",
    },
    keyInsight: "Tool descriptions are instructions to the model. A good description names both when to call AND when not to call. Vague descriptions cause over-use.",
  },
  {
    conceptId: 'genai-m6-reasoning',
    question: {
      engineer: "Aarav's agent is asked: 'What is the total value of open claims filed this month?' The agent makes one tool call to get all claims, then tries to sum the amounts in its response text. The sum is wrong. What is the design gap?",
      'builder': "Rhea's agent is asked to identify the top 3 renewal-risk accounts. It returns 3 account names without explanation. Rhea can't verify the reasoning. What should be added?",
    },
    options: {
      engineer: [
        'A. Use a more capable model — it will handle arithmetic over many values more reliably',
        'B. Add a code/calc tool that sums precisely; agent narrates the deterministic result',
        'C. Give the agent richer context about the claim data format and field semantics',
        'D. Pre-filter the claim list before returning it so the agent has fewer values to sum',
      ],
      'builder': [
        'A. Ask the agent to return risk scores per account instead of names alone',
        'B. Require a scratchpad step — agent writes a one-line reason per account first',
        'C. Return 5 accounts instead of 3 so Rhea has more options to evaluate manually',
        'D. Add a human review step where someone confirms the agent ranking each time',
      ],
    },
    correctIndex: { engineer: 1, 'builder': 1 },
    explanation: {
      engineer: "LLMs are not reliable calculators. Arithmetic should be done by a deterministic tool — code node, formula node, function — and the result handed back to the agent for narration.",
      'builder': "When an agent makes a decision that needs to be auditable, require intermediate reasoning before the final answer. The scratchpad makes the ranking inspectable.",
    },
    keyInsight: "Don't ask the model to do math or make invisible decisions. Give it tools for computation and require intermediate reasoning for auditable decisions.",
  },
  {
    conceptId: 'genai-m6-rag',
    question: {
      engineer: "Aarav's RAG agent retrieves the top 3 policy documents by cosine similarity and passes them to the model. The model answers correctly 80% of the time. For the other 20%, the retrieved documents are relevant but the answer is still wrong. What is the most likely cause?",
      'builder': "Rhea's RAG chatbot retrieves 5 policy excerpts and asks the model to answer a user's question. For complex questions, the answer is inconsistent. The retrieved documents are correct. What should she investigate?",
    },
    options: {
      engineer: [
        'A. Similarity threshold is too low — irrelevant docs are being retrieved into context',
        'B. Multi-doc synthesis failure — answer spans 3 docs and the model is not combining them',
        'C. The embedding model needs to be retrained on the in-domain policy corpus',
        'D. Model context window is too small to hold all 3 retrieved documents at once',
      ],
      'builder': [
        'A. Similarity threshold is too low — raise it so fewer, better docs are retrieved',
        'B. Prompt does not instruct the model to use only the retrieved docs — training-data leakage',
        'C. Use a larger model for complex questions so reasoning has more room to play out',
        'D. Reduce the number of retrieved documents from 5 to 3 to keep context focused',
      ],
    },
    correctIndex: { engineer: 1, 'builder': 1 },
    explanation: {
      engineer: "Retrieval can be correct while generation is wrong. Multi-doc synthesis is harder than single-doc lookup. Check whether the 20% failures all need cross-doc reasoning — if so, fix presentation, not retrieval.",
      'builder': "Without explicit grounding, models blend retrieved context with training data. Add: 'Answer using only the provided documents. If the answer isn't there, say so.' Grounding makes hallucination visible.",
    },
    keyInsight: "Retrieval accuracy and generation accuracy are separate problems. Correct retrieval doesn't guarantee correct answers. Audit them independently.",
  },
  {
    conceptId: 'genai-m6-scale',
    question: {
      engineer: "Aarav's agent workflow runs 500 times per day. At month-end, the OpenAI bill is 4× the estimate. He has logging but it only records success/failure. What is missing?",
      'builder': "Rhea's agent system has been running for a month. A team member asks: 'How many times did the agent call the Send Email tool this month?' Rhea can't answer. What logging is missing?",
    },
    options: {
      engineer: [
        'A. The agent is making too many tool calls — add a hard tool-call limit per run',
        'B. Per-run token logging: input + output tokens, model, tool calls — for attribution',
        'C. Switch to a cheaper model across the board to bring monthly spend back in budget',
        'D. Add a cost alert that fires when the rolling monthly bill exceeds a threshold',
      ],
      'builder': [
        'A. A monthly dashboard showing the total number of emails sent across the workflow',
        'B. Per-run structured logs of every tool call — name, timestamp, inputs, outputs',
        'C. An audit trail showing which team members triggered the agent each session',
        'D. A weekly summary email that recaps everything the agent did last week',
      ],
    },
    correctIndex: { engineer: 1, 'builder': 1 },
    explanation: {
      engineer: "Success/failure tells you the workflow ran. Per-run token logging is what tells you what it cost — and which workflow, user, or tool is driving the bill.",
      'builder': "Knowing the workflow ran isn't the same as knowing what it did. Per-run structured logs of every tool call are the audit trail that answers 'how many emails did it send and about what.'",
    },
    keyInsight: "Logging execution is not the same as logging behaviour. Agent observability requires per-run records of every tool call, not just whether the workflow succeeded.",
  },
];

const SECTION_XP = 50;
const QUIZ_XP = 100;

const TRACK_META: Record<GenAITrack, { label: string; introTitle: string; moduleContext: string }> = {
  'builder': {
    label: 'Builder Track',
    introTitle: 'AI Agent Workflows · Operator Lens',
    moduleContext: `GenAI Launchpad · Non-Tech Track · Pre-Read 06 · AI Agent Workflows — Building & Scaling. Follows Rhea, operations lead at Northstar Health, as she moves from individual workflow automations to full agent systems — and learns where agents add genuine value vs. where they add complexity without benefit.`,
  },
  engineer: {
    label: 'Engineer Track',
    introTitle: 'AI Agent Workflows · Builder Lens',
    moduleContext: `GenAI Launchpad · Tech Track · Pre-Read 06 · AI Agent Workflows — Building & Scaling. Follows Aarav, platform engineer at Northstar Health, as he builds production-grade agent systems — tool registries, multi-step reasoning, RAG pipelines, and the observability layer that makes them trustworthy.`,
  },
};

type Props = { track: GenAITrack; onBack: () => void; onNext?: () => void; nextLabel?: string };

function computeXP(completedSections: Set<string>, conceptStates: Record<string, { pKnow: number }>) {
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = Object.values(conceptStates).reduce((sum, s) => sum + Math.round(s.pKnow * QUIZ_XP), 0);
  return { readingXP, quizXP, total: readingXP + quizXP };
}


// Chain vs Agent classifier rebuilt as the LangGraph Studio canvas.
// Top half shows the actual chain topology (linear node chain) vs the
// agent topology (Reasoner with a self-loop and tools fan-out). Bottom
// half is the task list — the learner classifies each task, the
// matching topology highlights, wrong picks flash red.
const ChainAgentClassifierCard = ({ track }: { track: GenAITrack }) => {
  const scenarios = filterCaScenarios(track);
  const [scenarioId, setScenarioId] = useState<string>(scenarios[0].id);
  const scenario: CaScenario = scenarios.find(s => s.id === scenarioId) ?? scenarios[0];
  const tasks = scenario.tasks;

  const [picks, setPicks] = useState<Record<string, 'chain' | 'agent'>>({});
  const [revealed, setRevealed] = useState(false);

  useEffect(() => { setPicks({}); setRevealed(false); }, [scenario.id]);
  const [hover, setHover] = useState<'chain' | 'agent' | null>(null);
  const allPicked = tasks.every(t => picks[t.id]);
  const score = revealed ? tasks.filter(t => picks[t.id] === t.answer).length : 0;
  const reset = () => { setPicks({}); setRevealed(false); };
  const highlight = hover ?? (allPicked ? null : null);

  // Graph dimensions
  const W = 360, H = 200;

  return (
    <LangSmithFrame project={scenario.project} view="LANGGRAPH STUDIO" status={revealed ? (score === tasks.length ? 'success' : 'error') : 'pending'}>
      {/* Scenario picker */}
      <div style={{ padding: '8px 14px', background: LS.panel, borderBottom: `1px solid ${LS.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <LangSmithLabel>WORKLOAD SET</LangSmithLabel>
        <select
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
          style={{ flex: 1, appearance: 'none' as const, cursor: 'pointer', background: LS.bg, border: `1px solid ${LS.border}`, borderRadius: 5, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: LS.inkPrimary, fontFamily: 'inherit' }}
        >
          {scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted }}>{scenarios.length} presets</span>
      </div>

      {/* Two side-by-side graph topologies */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: `1px solid ${LS.border}` }}>
        {/* Chain topology */}
        <div
          onMouseEnter={() => setHover('chain')}
          onMouseLeave={() => setHover(null)}
          style={{ padding: 14, borderRight: `1px solid ${LS.border}`, background: highlight === 'chain' ? 'rgba(34,211,238,0.05)' : LS.bg, transition: 'background 0.2s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: LS.accentAlt }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: LS.inkPrimary }}>Chain Topology</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted, padding: '1px 5px', background: 'rgba(34,211,238,0.10)', borderRadius: 3 }}>DAG</span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted }}>fixed path</span>
          </div>
          <svg width={W} height={H} style={{ display: 'block' }}>
            <defs>
              <marker id="ch-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={LS.accentAlt} opacity="0.7" />
              </marker>
            </defs>
            {/* Nodes */}
            {[
              { x: 14, y: 80, label: 'fetch',    color: LS.accentAlt },
              { x: 140, y: 80, label: 'classify', color: LS.reason },
              { x: 266, y: 80, label: 'write',    color: LS.obs },
            ].map((n, i, arr) => (
              <g key={n.label}>
                {i < arr.length - 1 && (
                  <line x1={n.x + 80} y1={n.y + 20} x2={arr[i + 1].x} y2={arr[i + 1].y + 20}
                    stroke={LS.accentAlt} strokeWidth={1.4} markerEnd="url(#ch-arr)" opacity="0.7" />
                )}
                <rect x={n.x} y={n.y} width={80} height={40} rx={6} fill={LS.panel} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x + 40} y={n.y + 25} textAnchor="middle" fill={n.color} fontSize="11" fontFamily="'JetBrains Mono', monospace" fontWeight="700">{n.label}</text>
              </g>
            ))}
            {/* START / END markers */}
            <circle cx={4} cy={100} r={4} fill={LS.accent} />
            <text x={4} y={120} textAnchor="middle" fill={LS.inkMuted} fontSize="8" fontFamily="'JetBrains Mono', monospace">START</text>
            <circle cx={356} cy={100} r={4} fill={LS.err} />
            <text x={356} y={120} textAnchor="middle" fill={LS.inkMuted} fontSize="8" fontFamily="'JetBrains Mono', monospace">END</text>
          </svg>
          <div style={{ marginTop: 8, fontSize: 10, color: LS.inkSecondary, lineHeight: 1.55 }}>
            Same path every execution. Cheaper, faster, observable. The graph itself encodes the decision.
          </div>
        </div>

        {/* Agent topology */}
        <div
          onMouseEnter={() => setHover('agent')}
          onMouseLeave={() => setHover(null)}
          style={{ padding: 14, background: highlight === 'agent' ? 'rgba(167,139,250,0.05)' : LS.bg, transition: 'background 0.2s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: LS.reason }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: LS.inkPrimary }}>Agent Topology</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted, padding: '1px 5px', background: 'rgba(167,139,250,0.10)', borderRadius: 3 }}>STATEFUL</span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted }}>dynamic</span>
          </div>
          <svg width={W} height={H} style={{ display: 'block' }}>
            <defs>
              <marker id="ag-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={LS.reason} opacity="0.8" />
              </marker>
            </defs>
            {/* Reasoner node center */}
            <rect x={140} y={70} width={80} height={50} rx={8} fill={LS.panel} stroke={LS.reason} strokeWidth={1.8} />
            <text x={180} y={92} textAnchor="middle" fill={LS.reason} fontSize="11" fontFamily="'JetBrains Mono', monospace" fontWeight="700">reasoner</text>
            <text x={180} y={107} textAnchor="middle" fill={LS.inkMuted} fontSize="8" fontFamily="'JetBrains Mono', monospace">claude-3-5-sonnet</text>

            {/* Self-loop */}
            <path d="M 220 80 C 280 60 280 120 220 100" stroke={LS.reason} strokeWidth={1.4} fill="none" markerEnd="url(#ag-arr)" opacity="0.85" strokeDasharray="3 3" />
            <text x={272} y={88} fill={LS.reason} fontSize="9" fontFamily="'JetBrains Mono', monospace" opacity="0.85">N×</text>

            {/* Tools cluster on left */}
            {[
              { x: 6,  y: 12,  label: 'get_claim',  color: LS.act },
              { x: 6,  y: 70,  label: 'policy_db',  color: LS.act },
              { x: 6,  y: 128, label: 'amendment',  color: LS.act },
            ].map(n => (
              <g key={n.label}>
                <line x1={68} y1={n.y + 18} x2={140} y2={95} stroke={LS.act} strokeWidth={1} opacity="0.4" strokeDasharray="2 3" />
                <rect x={n.x} y={n.y} width={62} height={36} rx={5} fill={LS.panel} stroke={n.color} strokeWidth={1.2} />
                <text x={n.x + 31} y={n.y + 16} textAnchor="middle" fill={n.color} fontSize="9" fontFamily="'JetBrains Mono', monospace" fontWeight="700">{n.label}</text>
                <text x={n.x + 31} y={n.y + 28} textAnchor="middle" fill={LS.inkMuted} fontSize="7" fontFamily="'JetBrains Mono', monospace">tool</text>
              </g>
            ))}

            {/* END */}
            <line x1={220} y1={95} x2={330} y2={95} stroke={LS.reason} strokeWidth={1.2} opacity="0.6" markerEnd="url(#ag-arr)" />
            <circle cx={344} cy={95} r={5} fill={LS.err} />
            <text x={344} y={115} textAnchor="middle" fill={LS.inkMuted} fontSize="8" fontFamily="'JetBrains Mono', monospace">END</text>
          </svg>
          <div style={{ marginTop: 8, fontSize: 10, color: LS.inkSecondary, lineHeight: 1.55 }}>
            Self-loop + tool fan-out. Agent decides what to call and when to stop. Higher latency, higher cost.
          </div>
        </div>
      </div>

      {/* Task list */}
      <div style={{ padding: '12px 14px', background: LS.panelAlt }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <LangSmithLabel>WORKLOADS · ROUTE TO TOPOLOGY</LangSmithLabel>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted }}>{Object.keys(picks).length}/{tasks.length} routed</span>
        </div>
        <div style={{ display: 'grid', gap: 7 }}>
          {tasks.map(t => {
            const pick = picks[t.id];
            const isRight = revealed && pick === t.answer;
            const isWrong = revealed && pick && pick !== t.answer;
            return (
              <div key={t.id} style={{
                background: isRight ? 'rgba(16,185,129,0.07)' : isWrong ? 'rgba(248,113,113,0.06)' : LS.panel,
                border: `1px solid ${isRight ? 'rgba(16,185,129,0.35)' : isWrong ? 'rgba(248,113,113,0.30)' : LS.border}`,
                borderRadius: 7,
                padding: '8px 11px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 10,
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 11.5, color: LS.inkPrimary, lineHeight: 1.45 }}>{t.label}</div>
                  {revealed && (
                    <div style={{ fontSize: 9.5, color: isRight ? LS.accent : LS.err, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                      {isRight ? '✓ ' : `✗ → ${t.answer} · `}{t.hint}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {(['chain', 'agent'] as const).map(opt => {
                    const isPicked = pick === opt;
                    const optColor = opt === 'chain' ? LS.accentAlt : LS.reason;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => !revealed && setPicks(p => ({ ...p, [t.id]: opt }))}
                        disabled={revealed}
                        style={{
                          appearance: 'none', cursor: revealed ? 'default' : 'pointer',
                          padding: '4px 12px',
                          background: isPicked ? (revealed ? (opt === t.answer ? LS.accent : LS.err) : optColor) : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isPicked ? 'transparent' : optColor + '40'}`,
                          borderRadius: 5,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          fontWeight: 800,
                          color: isPicked ? '#fff' : optColor,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase' as const,
                        }}
                      >{opt}</button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {!revealed ? (
            <button type="button" onClick={() => allPicked && setRevealed(true)} disabled={!allPicked} style={{
              appearance: 'none', cursor: allPicked ? 'pointer' : 'not-allowed',
              background: allPicked ? LS.accent : 'rgba(255,255,255,0.06)',
              border: 'none', borderRadius: 5, padding: '6px 14px',
              fontSize: 11, fontWeight: 700,
              color: allPicked ? LS.bg : LS.inkMuted,
              fontFamily: 'inherit',
            }}>EVALUATE</button>
          ) : (
            <>
              <span style={{ fontSize: 11, fontWeight: 700, color: score === tasks.length ? LS.accent : '#FCD34D', alignSelf: 'center' as const, fontFamily: "'JetBrains Mono', monospace" }}>{score}/{tasks.length} CORRECT</span>
              <button type="button" onClick={reset} style={{
                appearance: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)', border: `1px solid ${LS.border}`,
                borderRadius: 5, padding: '5px 11px',
                fontSize: 10, fontWeight: 700,
                color: LS.inkSecondary, fontFamily: "'JetBrains Mono', monospace",
              }}>RESET</button>
            </>
          )}
        </div>
      </div>
    </LangSmithFrame>
  );
};

// Tool description grader rebuilt as the LangSmith Prompt Hub / Tool
// editor. The current tool schema is shown on the left as a JSON pane
// with line numbers and syntax tinting. The learner switches between
// three description versions (tabs), then runs an eval that simulates
// 4 user queries against the description and reports correct-call %.
const ToolDescriptionGraderCard = ({ track }: { track: GenAITrack }) => {
  const scenarios = filterToolScenarios(track);
  const [scenarioId, setScenarioId] = useState<string>(scenarios[0].id);
  const scenario: ToolScenario = scenarios.find(s => s.id === scenarioId) ?? scenarios[0];
  const toolName = scenario.toolName;
  const versions = scenario.versions;
  const evalSet = scenario.evalSet;

  const [active, setActive] = useState<string>(versions[0].id);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Record<string, boolean[]>>({});

  useEffect(() => {
    setActive(scenario.versions[0].id);
    setResults({});
  }, [scenario.id, scenario.versions]);

  const activeV = versions.find(v => v.id === active)!;

  const runEval = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      // Each version produces a different correctness pattern that lines up
      // with its pct so visuals match intuition.
      const pat: Record<string, boolean[]> = {
        good:  [true, true, true, true],
        over:  [true, false, true, false],
        vague: [true, false, false, false],
      };
      // randomise a bit so non-good versions get one bonus right
      const base = pat[activeV.verdict].slice();
      if (activeV.verdict !== 'good') base[Math.floor(Math.random() * 4)] = true;
      setResults(r => ({ ...r, [active]: base }));
      setRunning(false);
    }, 600);
  }, [active, activeV.verdict]);

  const currentResults = results[active];

  return (
    <LangSmithFrame project={scenario.project} run={`tool/${toolName}`} view="PROMPT HUB · TOOL" status={currentResults ? (activeV.verdict === 'good' ? 'success' : 'error') : 'pending'}>
      {/* Scenario picker */}
      <div style={{ padding: '8px 14px', background: LS.panel, borderBottom: `1px solid ${LS.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <LangSmithLabel>TOOL</LangSmithLabel>
        <select
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
          style={{ flex: 1, appearance: 'none' as const, cursor: 'pointer', background: LS.bg, border: `1px solid ${LS.border}`, borderRadius: 5, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: LS.inkPrimary, fontFamily: 'inherit' }}
        >
          {scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted }}>{scenarios.length} presets</span>
      </div>

      {/* Tab bar for versions */}
      <div style={{ display: 'flex', background: '#080B14', borderBottom: `1px solid ${LS.border}` }}>
        {versions.map(v => {
          const isActive = v.id === active;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setActive(v.id)}
              style={{
                appearance: 'none', cursor: 'pointer',
                background: isActive ? LS.bg : 'transparent',
                border: 'none',
                borderRight: `1px solid ${LS.border}`,
                borderTop: isActive ? `2px solid ${v.verdict === 'good' ? LS.accent : LS.err}` : '2px solid transparent',
                padding: '8px 16px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10.5,
                fontWeight: 700,
                color: isActive ? LS.inkPrimary : LS.inkMuted,
                letterSpacing: '0.04em',
              }}
            >{v.label}</button>
          );
        })}
        <div style={{ flex: 1, background: 'transparent' }} />
      </div>

      {/* Body — schema editor + eval panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 0 }}>
        {/* Schema editor */}
        <div style={{ borderRight: `1px solid ${LS.border}`, background: LS.bg }}>
          <div style={{ padding: '8px 14px', borderBottom: `1px solid ${LS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <LangSmithLabel>TOOL SCHEMA · {toolName}()</LangSmithLabel>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted }}>JSON</span>
          </div>
          <div style={{ padding: '10px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, lineHeight: 1.65, color: '#D4D4D4' }}>
            {[
              { n: 1, t: <>{'{'}</> },
              { n: 2, t: <><span style={{ color: '#9CDCFE' }}>  "name"</span>: <span style={{ color: '#CE9178' }}>"{toolName}"</span>,</> },
              { n: 3, t: <><span style={{ color: '#9CDCFE' }}>  "description"</span>:</> },
              { n: 4, t: <><span style={{ color: '#CE9178' }}>    "{activeV.desc}"</span>,</> },
              { n: 5, t: <><span style={{ color: '#9CDCFE' }}>  "parameters"</span>: {'{'}</> },
              { n: 6, t: <><span style={{ color: '#9CDCFE' }}>    "type"</span>: <span style={{ color: '#CE9178' }}>"object"</span>,</> },
              { n: 7, t: <><span style={{ color: '#9CDCFE' }}>    "properties"</span>: {'{'}</> },
              { n: 8, t: <><span style={{ color: '#9CDCFE' }}>      "{scenario.paramKey}"</span>: {'{'} <span style={{ color: '#9CDCFE' }}>"type"</span>: <span style={{ color: '#CE9178' }}>"string"</span> {'}'}</> },
              { n: 9, t: <>    {'}'}</> },
              { n: 10, t: <>  {'}'}</> },
              { n: 11, t: <>{'}'}</> },
            ].map(row => (
              <div key={row.n} style={{ display: 'flex' }}>
                <span style={{ width: 30, color: LS.inkMuted, textAlign: 'right', userSelect: 'none', flexShrink: 0, paddingRight: 10 }}>{row.n}</span>
                <span style={{ flex: 1, paddingLeft: 6, whiteSpace: 'pre' as const }}>{row.t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Eval panel */}
        <div style={{ padding: '12px 14px', background: LS.panelAlt, display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <LangSmithLabel>EVAL · 4 queries</LangSmithLabel>
            <button
              type="button"
              onClick={runEval}
              disabled={running}
              style={{
                appearance: 'none', cursor: running ? 'wait' : 'pointer',
                background: running ? 'rgba(255,255,255,0.06)' : LS.accent,
                border: 'none', borderRadius: 5,
                padding: '4px 10px',
                fontSize: 10, fontWeight: 700,
                color: running ? LS.inkMuted : LS.bg,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.04em',
              }}
            >{running ? 'RUNNING…' : '▶ RUN EVAL'}</button>
          </div>

          <div style={{ display: 'grid', gap: 6 }}>
            {evalSet.map((q, i) => {
              const r = currentResults?.[i];
              return (
                <div key={i} style={{ padding: '7px 9px', background: LS.panel, border: `1px solid ${r === undefined ? LS.border : r ? 'rgba(16,185,129,0.40)' : 'rgba(248,113,113,0.40)'}`, borderRadius: 6 }}>
                  <div style={{ fontSize: 10, color: LS.inkPrimary, marginBottom: 3, lineHeight: 1.4 }}>"{q.query}"</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: q.shouldCall ? LS.act : LS.inkMuted, letterSpacing: '0.08em' }}>
                      EXPECT {q.shouldCall ? 'CALL' : 'SKIP'}
                    </span>
                    {r !== undefined && (
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: r ? LS.accent : LS.err, fontWeight: 700 }}>
                        {r ? '✓ MATCH' : '✗ WRONG'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {currentResults && (
            <div style={{ padding: '8px 10px', background: activeV.verdict === 'good' ? 'rgba(16,185,129,0.10)' : 'rgba(248,113,113,0.08)', border: `1px solid ${activeV.verdict === 'good' ? 'rgba(16,185,129,0.35)' : 'rgba(248,113,113,0.30)'}`, borderRadius: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkSecondary, letterSpacing: '0.10em' }}>SCORE</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 800, color: activeV.verdict === 'good' ? LS.accent : LS.err }}>{currentResults.filter(Boolean).length}/{currentResults.length}</span>
              </div>
              <div style={{ fontSize: 10, color: activeV.verdict === 'good' ? '#A7F3D0' : '#FECACA', lineHeight: 1.5 }}>{activeV.reason}</div>
            </div>
          )}
        </div>
      </div>
    </LangSmithFrame>
  );
};

// ReAct step explorer rebuilt as the LangSmith trace view. A run tree
// on the left lists each ReAct span (Reason / Act / Observation) with
// latency and token cost; the right pane shows the span detail (input
// / output JSON). The "predict the next span type" interaction lives
// inside the next-pending entry of the run tree.
const ReActStepExplorerCard = ({ track }: { track: GenAITrack }) => {
  const scenarios = filterTraceScenarios(track);
  const [scenarioId, setScenarioId] = useState<string>(scenarios[0].id);
  const scenario: TraceScenario = scenarios.find(s => s.id === scenarioId) ?? scenarios[0];
  const steps = scenario.steps;

  const [current, setCurrent] = useState(0);
  const [predictions, setPredictions] = useState<Record<number, SpanType>>({});
  const [showType, setShowType] = useState(false);
  const [selectedSpan, setSelectedSpan] = useState<number | null>(null);

  useEffect(() => {
    setCurrent(0); setPredictions({}); setShowType(false); setSelectedSpan(null);
  }, [scenario.id]);
  const isDone = current >= steps.length;
  const nextStep = steps[current];

  const predict = (type: SpanType) => { setPredictions(p => ({ ...p, [current]: type })); setShowType(true); };
  const advance = () => { setShowType(false); setSelectedSpan(current); setCurrent(c => c + 1); };
  const restart = () => { setCurrent(0); setPredictions({}); setShowType(false); setSelectedSpan(null); };
  const correctPredictions = Object.entries(predictions).filter(([i, v]) => v === steps[+i]?.type).length;
  const detail = selectedSpan !== null ? steps[selectedSpan] : null;

  const totalLatency = steps.slice(0, current).reduce((s, x) => s + x.latency, 0);
  const totalTokens  = steps.slice(0, current).reduce((s, x) => s + (x.tokens ?? 0), 0);

  const colorFor = (t: SpanType) => t === 'REASON' ? LS.reason : t === 'ACT' ? LS.act : LS.obs;
  const iconFor  = (t: SpanType) => t === 'REASON' ? '🧠' : t === 'ACT' ? '⚡' : '◉';

  return (
    <LangSmithFrame project={scenario.project} run={scenario.runId} view="TRACE VIEW" status={isDone ? 'success' : 'pending'}>
      {/* Scenario picker */}
      <div style={{ padding: '8px 14px', background: LS.panel, borderBottom: `1px solid ${LS.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <LangSmithLabel>TRACE</LangSmithLabel>
        <select
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
          style={{ flex: 1, appearance: 'none' as const, cursor: 'pointer', background: LS.bg, border: `1px solid ${LS.border}`, borderRadius: 5, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: LS.inkPrimary, fontFamily: 'inherit' }}
        >
          {scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted }}>{scenarios.length} presets</span>
      </div>

      {/* Run summary bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 14px', borderBottom: `1px solid ${LS.border}`, background: LS.panel, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
        <span style={{ color: LS.inkSecondary }}><span style={{ color: LS.inkMuted }}>spans </span><span style={{ color: LS.inkPrimary, fontWeight: 700 }}>{current}/{steps.length}</span></span>
        <span style={{ color: LS.inkSecondary }}><span style={{ color: LS.inkMuted }}>latency </span><span style={{ color: LS.inkPrimary, fontWeight: 700 }}>{totalLatency}ms</span></span>
        <span style={{ color: LS.inkSecondary }}><span style={{ color: LS.inkMuted }}>tokens </span><span style={{ color: LS.inkPrimary, fontWeight: 700 }}>{totalTokens}</span></span>
        <span style={{ color: LS.inkSecondary }}><span style={{ color: LS.inkMuted }}>cost </span><span style={{ color: LS.inkPrimary, fontWeight: 700 }}>${(totalTokens / 1_000_000 * 3).toFixed(4)}</span></span>
        <span style={{ marginLeft: 'auto', color: predictions ? (correctPredictions === Object.keys(predictions).length ? LS.accent : '#FCD34D') : LS.inkMuted }}>predicted {correctPredictions}/{Object.keys(predictions).length}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 0 }}>
        {/* Run tree */}
        <div style={{ borderRight: `1px solid ${LS.border}`, padding: '10px 12px', maxHeight: 380, overflow: 'auto' }}>
          <LangSmithLabel>RUN TREE</LangSmithLabel>
          <div style={{ marginTop: 8 }}>
            {/* Root run */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 0', borderBottom: `1px solid ${LS.border}`, marginBottom: 4 }}>
              <div style={{ width: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: LS.inkMuted, textAlign: 'center' }}>▾</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: LS.inkPrimary }}>agent.run</div>
                <div style={{ fontSize: 8.5, color: LS.inkMuted, fontFamily: "'JetBrains Mono', monospace" }}>claude-3-5-sonnet · ReAct</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted }}>{totalLatency}ms</span>
            </div>

            {/* Child spans */}
            {steps.slice(0, current).map((s, i) => {
              const isSelected = selectedSpan === i;
              const matched = predictions[i] === s.type;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedSpan(i)}
                  style={{
                    appearance: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%',
                    padding: '5px 6px 5px 24px',
                    background: isSelected ? 'rgba(167,139,250,0.10)' : 'transparent',
                    border: `1px solid ${isSelected ? LS.borderLight : 'transparent'}`,
                    borderRadius: 5,
                    marginBottom: 2,
                    fontFamily: 'inherit',
                    textAlign: 'left' as const,
                    position: 'relative' as const,
                  }}
                >
                  <div style={{ position: 'absolute' as const, left: 8, top: 0, bottom: i === steps.length - 1 ? 'auto' : 0, width: 1, height: i === steps.length - 1 ? '50%' : '100%', background: 'rgba(255,255,255,0.10)' }} />
                  <div style={{ position: 'absolute' as const, left: 8, top: '50%', width: 9, height: 1, background: 'rgba(255,255,255,0.18)' }} />
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: `${colorFor(s.type)}1A`, color: colorFor(s.type), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{s.type[0]}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: LS.inkPrimary, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: LS.inkMuted, display: 'flex', gap: 6 }}>
                      <span>{s.latency}ms</span>
                      {s.tokens && <span>{s.tokens}t</span>}
                      {predictions[i] !== undefined && <span style={{ color: matched ? LS.accent : LS.err, fontWeight: 700 }}>{matched ? '✓' : '✗'}</span>}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Pending span — prediction widget */}
            {!isDone && (
              <div style={{ marginTop: 4, padding: '8px 10px', background: 'rgba(252,211,77,0.06)', border: '1px dashed rgba(252,211,77,0.35)', borderRadius: 5, marginLeft: 24 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#FCD34D', letterSpacing: '0.10em', marginBottom: 6 }}>SPAN {current + 1} · PREDICT TYPE</div>
                {!showType ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                    {(['REASON', 'ACT', 'OBS'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => predict(t)}
                        style={{
                          appearance: 'none', cursor: 'pointer',
                          padding: '5px 0',
                          background: 'rgba(255,255,255,0.03)',
                          border: `1px solid ${colorFor(t)}55`,
                          borderRadius: 4,
                          fontSize: 9.5, fontWeight: 700,
                          color: colorFor(t),
                          fontFamily: "'JetBrains Mono', monospace",
                          letterSpacing: '0.04em',
                        }}
                      >{t}</button>
                    ))}
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 9.5, color: predictions[current] === nextStep.type ? LS.accent : LS.err, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                      {predictions[current] === nextStep.type ? `✓ ${predictions[current]}` : `✗ was ${nextStep.type}`}
                    </div>
                    <button type="button" onClick={advance} style={{ appearance: 'none', cursor: 'pointer', width: '100%', background: LS.reason, border: 'none', borderRadius: 4, padding: '5px 0', fontSize: 9.5, fontWeight: 700, color: '#fff', fontFamily: 'inherit' }}>
                      {current < steps.length - 1 ? '▸ ADVANCE TO NEXT SPAN' : '▸ FINISH RUN'}
                    </button>
                  </>
                )}
              </div>
            )}

            {isDone && (
              <button type="button" onClick={restart} style={{ appearance: 'none', cursor: 'pointer', marginTop: 8, padding: '5px 12px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${LS.border}`, borderRadius: 5, fontSize: 9.5, fontWeight: 700, color: LS.inkSecondary, fontFamily: "'JetBrains Mono', monospace", marginLeft: 24 }}>↺ RESTART RUN</button>
            )}
          </div>
        </div>

        {/* Span detail panel */}
        <div style={{ padding: '12px 14px', background: LS.panelAlt }}>
          <LangSmithLabel>SPAN DETAIL</LangSmithLabel>
          {detail ? (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ padding: '2px 8px', background: `${colorFor(detail.type)}1F`, border: `1px solid ${colorFor(detail.type)}60`, borderRadius: 4, fontSize: 9, fontWeight: 800, color: colorFor(detail.type), fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>{detail.type}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: LS.inkPrimary, fontFamily: "'JetBrains Mono', monospace" }}>{detail.name}</span>
                <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted }}>{detail.latency}ms{detail.tokens ? ` · ${detail.tokens}t` : ''}</span>
              </div>
              <div style={{ padding: '10px 12px', background: LS.bg, border: `1px solid ${LS.border}`, borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: detail.type === 'REASON' ? '#D4D4D4' : detail.type === 'ACT' ? '#FCD34D' : '#67E8F9', lineHeight: 1.65, whiteSpace: 'pre-wrap' as const }}>
                {detail.text}
              </div>
              <div style={{ marginTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted, lineHeight: 1.5 }}>
                {detail.type === 'REASON' ? 'Model produces internal reasoning. Drives the next ACT.' : detail.type === 'ACT' ? 'Tool call dispatched. Latency = network + remote execution.' : 'Tool returned. Result enters context window for the next REASON.'}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 10, fontSize: 11, color: LS.inkMuted, fontStyle: 'italic' as const }}>Click a span in the run tree to inspect its input / output.</div>
          )}
        </div>
      </div>
    </LangSmithFrame>
  );
};

// Grounding rebuilt as the LangSmith Run Comparison view — two columns
// side-by-side showing the same query, the same model, identical
// sampling, but the GROUNDED column has a retrieved-documents pane that
// the model used. Hallucination risk and source citations differ.
const GroundingToggleCard = ({ track }: { track: GenAITrack }) => {
  const scenarios = filterGroundingScenarios(track);
  const [scenarioId, setScenarioId] = useState<string>(scenarios[0].id);
  const scenario: GroundingScenario = scenarios.find(s => s.id === scenarioId) ?? scenarios[0];
  const query = scenario.query;
  const groundedAnswer = scenario.groundedAnswer;
  const ungroundedAnswer = scenario.ungroundedAnswer;
  const docs = scenario.docs;

  const Run = ({ grounded }: { grounded: boolean }) => {
    const accent = grounded ? LS.accent : LS.err;
    return (
      <div style={{ borderRight: grounded ? 'none' : `1px solid ${LS.border}` }}>
        {/* Header */}
        <div style={{ padding: '8px 14px', background: LS.panel, borderBottom: `1px solid ${LS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 800, color: LS.inkPrimary, letterSpacing: '0.08em' }}>RUN {grounded ? '#0b41' : '#0b40'}</span>
            <span style={{ padding: '1px 6px', borderRadius: 3, background: `${accent}1F`, fontSize: 9, fontWeight: 700, color: accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>{grounded ? 'GROUNDED' : 'NO RAG'}</span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted }}>claude-3-5-sonnet · temp 0.20</span>
        </div>

        {/* Retrieved docs (only for grounded) */}
        {grounded && (
          <div style={{ padding: '10px 14px', background: LS.panelAlt, borderBottom: `1px solid ${LS.border}` }}>
            <LangSmithLabel>RETRIEVED CONTEXT · {docs.length} docs</LangSmithLabel>
            <div style={{ marginTop: 6, display: 'grid', gap: 4 }}>
              {docs.map(d => (
                <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 8px', background: LS.panel, border: `1px solid ${LS.border}`, borderRadius: 4 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, color: LS.inkPrimary, fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                    <div style={{ fontSize: 9, color: LS.inkMuted }}>{d.span}</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: d.score > 0.85 ? LS.accent : '#FCD34D', fontFamily: "'JetBrains Mono', monospace" }}>{d.score.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Output */}
        <div style={{ padding: '10px 14px' }}>
          <LangSmithLabel>OUTPUT</LangSmithLabel>
          <div style={{ marginTop: 6, padding: '10px 12px', background: LS.bg, border: `1px solid ${LS.border}`, borderRadius: 6, fontSize: 11.5, color: LS.inkPrimary, lineHeight: 1.65 }}>
            {grounded ? groundedAnswer : ungroundedAnswer}
          </div>
        </div>

        {/* Score row */}
        <div style={{ padding: '8px 14px 12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          <div style={{ padding: '6px 8px', background: LS.panel, border: `1px solid ${LS.border}`, borderRadius: 5 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: LS.inkMuted, letterSpacing: '0.10em' }}>HALLUCINATION</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 800, color: grounded ? LS.accent : LS.err }}>{grounded ? '0.02' : '0.71'}</div>
          </div>
          <div style={{ padding: '6px 8px', background: LS.panel, border: `1px solid ${LS.border}`, borderRadius: 5 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: LS.inkMuted, letterSpacing: '0.10em' }}>CITATIONS</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 800, color: grounded ? LS.accent : LS.err }}>{grounded ? '3' : '0'}</div>
          </div>
          <div style={{ padding: '6px 8px', background: LS.panel, border: `1px solid ${LS.border}`, borderRadius: 5 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: LS.inkMuted, letterSpacing: '0.10em' }}>FAITHFULNESS</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 800, color: grounded ? LS.accent : '#FCD34D' }}>{grounded ? '0.98' : '0.43'}</div>
          </div>
        </div>

        {/* Verdict */}
        <div style={{ padding: '6px 14px 12px' }}>
          <div style={{ padding: '7px 10px', background: grounded ? 'rgba(16,185,129,0.10)' : 'rgba(248,113,113,0.10)', border: `1px solid ${accent}40`, borderRadius: 5, fontSize: 10, color: grounded ? '#A7F3D0' : '#FECACA', lineHeight: 1.55 }}>
            {grounded
              ? '✓ Specific, cited, verifiable — every claim traces to a retrieved chunk.'
              : '⚠ Plausible but not grounded — model generated from training-data patterns. High hallucination risk.'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <LangSmithFrame project={scenario.project} run="compare 0b40 ↔ 0b41" view="RUN COMPARISON">
      {/* Scenario picker */}
      <div style={{ padding: '8px 14px', background: LS.panel, borderBottom: `1px solid ${LS.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <LangSmithLabel>QUERY</LangSmithLabel>
        <select
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
          style={{ flex: 1, appearance: 'none' as const, cursor: 'pointer', background: LS.bg, border: `1px solid ${LS.border}`, borderRadius: 5, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: LS.inkPrimary, fontFamily: 'inherit' }}
        >
          {scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted }}>{scenarios.length} presets</span>
      </div>

      {/* Shared query at top */}
      <div style={{ padding: '10px 14px', background: LS.panelAlt, borderBottom: `1px solid ${LS.border}` }}>
        <LangSmithLabel>USER INPUT (shared across runs)</LangSmithLabel>
        <div style={{ marginTop: 6, padding: '8px 12px', background: LS.panel, border: `1px solid ${LS.border}`, borderRadius: 6, fontSize: 11.5, color: LS.inkPrimary, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.55 }}>{query}</div>
      </div>

      {/* Side-by-side run comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        <Run grounded={false} />
        <Run grounded={true} />
      </div>
    </LangSmithFrame>
  );
};

// Anomaly detective rebuilt as the LangSmith Monitoring dashboard —
// summary tiles (Runs, Cost, p95 latency, Tool calls), a 24-bar trend
// chart with one obvious spike, and the runs table below with an
// anomaly badge. Clicking the spike or the flagged run reveals a root
// cause picker.
const AnomalyDetectiveCard = ({ track }: { track: GenAITrack }) => {
  const scenarios = filterAnomalyScenarios(track);
  const [scenarioId, setScenarioId] = useState<string>(scenarios[0].id);
  const scenario: AnomalyScenario = scenarios.find(s => s.id === scenarioId) ?? scenarios[0];
  const rows = scenario.rows;
  const causes = scenario.causes;

  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [selectedCause, setSelectedCause] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => { setSelectedRow(null); setSelectedCause(null); setRevealed(false); }, [scenario.id]);
  const anomaly = rows.find(r => r.anomaly)!;
  const correctCause = causes.findIndex(c => c.correct);
  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  const avgTools = rows.reduce((s, r) => s + r.tools, 0) / rows.length;
  const p95Tokens = Math.max(...rows.map(r => r.in));
  const reset = () => { setSelectedRow(null); setSelectedCause(null); setRevealed(false); };

  // Trend bars — 24 bars with the anomaly spike at the configured timestamp
  const trend = Array.from({ length: 24 }, (_, i) => {
    const baseline = 14 + Math.round(Math.sin(i / 3) * 5 + Math.random() * 4);
    const isSpike = i === scenario.spikeIndex;
    return { i, h: isSpike ? 58 : baseline, isSpike };
  });

  const Tile = ({ label, value, color }: { label: string; value: string; color?: string }) => (
    <div style={{ padding: '8px 10px', background: LS.panel, border: `1px solid ${LS.border}`, borderRadius: 7 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: LS.inkMuted, letterSpacing: '0.10em' }}>{label}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 800, color: color ?? LS.inkPrimary, marginTop: 2 }}>{value}</div>
    </div>
  );

  return (
    <LangSmithFrame project={scenario.project} view="MONITORING · LAST 1H" status={revealed ? 'error' : 'pending'}>
      {/* Scenario picker */}
      <div style={{ padding: '8px 14px', background: LS.panel, borderBottom: `1px solid ${LS.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <LangSmithLabel>PROJECT</LangSmithLabel>
        <select
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
          style={{ flex: 1, appearance: 'none' as const, cursor: 'pointer', background: LS.bg, border: `1px solid ${LS.border}`, borderRadius: 5, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: LS.inkPrimary, fontFamily: 'inherit' }}
        >
          {scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted }}>{scenarios.length} presets</span>
      </div>

      {/* Summary tiles */}
      <div style={{ padding: '12px 14px', background: LS.panelAlt, borderBottom: `1px solid ${LS.border}`, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        <Tile label="RUNS"           value={String(rows.length)} />
        <Tile label="COST · 1H"      value={`$${totalCost.toFixed(3)}`} color={totalCost > 0.10 ? '#FCD34D' : LS.accent} />
        <Tile label="p95 IN-TOKENS"  value={p95Tokens.toLocaleString()} color={p95Tokens > 5000 ? LS.err : LS.accent} />
        <Tile label="AVG TOOL CALLS" value={avgTools.toFixed(1)}        color={avgTools > 3 ? LS.err : LS.accent} />
      </div>

      {/* Trend chart */}
      <div style={{ padding: '12px 14px', background: LS.bg, borderBottom: `1px solid ${LS.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <LangSmithLabel>INPUT-TOKEN VOLUME · trailing 1H</LangSmithLabel>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.err }}>1 anomaly detected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 64, padding: '4px 0', borderBottom: `1px dashed ${LS.border}` }}>
          {trend.map(b => (
            <div
              key={b.i}
              onClick={() => b.isSpike && !revealed && setSelectedRow(anomaly.id)}
              style={{
                flex: 1,
                height: `${b.h}px`,
                background: b.isSpike ? (selectedRow === anomaly.id ? LS.err : '#FCD34D') : LS.accentAlt,
                opacity: b.isSpike ? 1 : 0.45,
                borderRadius: '2px 2px 0 0',
                cursor: b.isSpike && !revealed ? 'pointer' : 'default',
                transition: 'background 0.15s',
              }}
              title={b.isSpike ? 'Anomaly — click to inspect' : ''}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: LS.inkMuted }}>
          <span>-60m</span><span>-30m</span><span>now</span>
        </div>
      </div>

      {/* Runs table */}
      <div style={{ background: LS.bg, padding: '8px 14px 12px' }}>
        <div style={{ padding: '6px 8px', display: 'grid', gridTemplateColumns: '1.4fr 0.6fr 1fr 1fr 1fr 1fr 0.6fr', gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted, letterSpacing: '0.10em', borderBottom: `1px solid ${LS.border}` }}>
          <span>RUN_ID</span><span>TIME</span><span>IN TOK</span><span>OUT TOK</span><span>TOOL CALLS</span><span>COST</span><span>STATUS</span>
        </div>
        {rows.map(r => {
          const isSelected = selectedRow === r.id;
          const isFlagged = revealed && r.anomaly;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => !revealed && setSelectedRow(r.id)}
              style={{
                appearance: 'none', cursor: revealed ? 'default' : 'pointer',
                width: '100%',
                padding: '6px 8px',
                display: 'grid', gridTemplateColumns: '1.4fr 0.6fr 1fr 1fr 1fr 1fr 0.6fr', gap: 8,
                background: isSelected ? (isFlagged ? 'rgba(248,113,113,0.10)' : 'rgba(255,255,255,0.04)') : 'transparent',
                border: 'none',
                borderBottom: `1px solid ${LS.border}`,
                color: r.anomaly && revealed ? LS.err : LS.inkPrimary,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                textAlign: 'left' as const,
              }}
            >
              <span style={{ color: isFlagged ? LS.err : LS.accentAlt }}>{r.id}{isFlagged ? ' ⚑' : ''}</span>
              <span style={{ color: LS.inkMuted }}>{r.ts}</span>
              <span>{r.in.toLocaleString()}</span>
              <span>{r.out.toLocaleString()}</span>
              <span style={{ color: r.tools > 3 ? LS.err : LS.inkPrimary, fontWeight: r.tools > 3 ? 700 : 400 }}>{r.tools}</span>
              <span>${r.cost.toFixed(3)}</span>
              <span style={{ color: r.anomaly ? LS.err : LS.accent, fontWeight: 700, fontSize: 9 }}>{r.anomaly ? 'ANOMALY' : 'OK'}</span>
            </button>
          );
        })}
      </div>

      {/* Cause picker */}
      {selectedRow && !revealed && (
        <div style={{ padding: '12px 14px', background: LS.panelAlt, borderTop: `1px solid ${LS.border}` }}>
          <LangSmithLabel>ROOT CAUSE INVESTIGATION</LangSmithLabel>
          {selectedRow !== anomaly.id ? (
            <div style={{ marginTop: 6, fontSize: 11, color: LS.inkMuted, lineHeight: 1.5 }}>
              <span style={{ color: LS.inkSecondary, fontFamily: "'JetBrains Mono', monospace" }}>{selectedRow}</span> looks normal — input tokens and tool calls are within baseline. Click the spike or the ⚑ row.
            </div>
          ) : (
            <>
              <div style={{ marginTop: 6, fontSize: 11, color: LS.inkSecondary, lineHeight: 1.5, marginBottom: 8 }}>
                Pick the most likely root cause for <span style={{ color: LS.err, fontFamily: "'JetBrains Mono', monospace" }}>{anomaly.id}</span>:
              </div>
              <div style={{ display: 'grid', gap: 5 }}>
                {causes.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedCause(i)}
                    style={{
                      appearance: 'none', cursor: 'pointer',
                      padding: '7px 10px',
                      background: selectedCause === i ? 'rgba(252,211,77,0.12)' : LS.panel,
                      border: `1px solid ${selectedCause === i ? '#FCD34D' : LS.border}`,
                      borderRadius: 5,
                      fontFamily: 'inherit',
                      fontSize: 11, color: LS.inkPrimary,
                      textAlign: 'left' as const, lineHeight: 1.5,
                    }}
                  >{c.label}</button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => selectedCause !== null && setRevealed(true)}
                disabled={selectedCause === null}
                style={{
                  appearance: 'none', cursor: selectedCause === null ? 'not-allowed' : 'pointer',
                  marginTop: 8,
                  padding: '6px 14px',
                  background: selectedCause === null ? 'rgba(255,255,255,0.06)' : LS.accent,
                  border: 'none', borderRadius: 5,
                  fontSize: 11, fontWeight: 700,
                  color: selectedCause === null ? LS.inkMuted : LS.bg,
                  fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em',
                }}
              >▶ INVESTIGATE</button>
            </>
          )}
        </div>
      )}

      {/* Resolution */}
      {revealed && (
        <div style={{ padding: '12px 14px', background: selectedCause === correctCause ? 'rgba(16,185,129,0.10)' : 'rgba(252,211,77,0.10)', borderTop: `1px solid ${LS.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 800, color: selectedCause === correctCause ? LS.accent : '#FCD34D', letterSpacing: '0.10em' }}>
              {selectedCause === correctCause ? '✓ ROOT CAUSE CONFIRMED' : '✗ NOT QUITE — actual root cause:'}
            </div>
            <button type="button" onClick={reset} style={{ appearance: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: `1px solid ${LS.border}`, borderRadius: 5, padding: '4px 10px', fontSize: 9.5, fontWeight: 700, color: LS.inkSecondary, fontFamily: "'JetBrains Mono', monospace" }}>↺ RESET</button>
          </div>
          {selectedCause !== correctCause && (
            <div style={{ fontSize: 11, color: LS.inkPrimary, lineHeight: 1.5, marginBottom: 6 }}>{causes[correctCause].label}</div>
          )}
          <div style={{ fontSize: 10.5, color: LS.inkSecondary, lineHeight: 1.6 }}>
            <span style={{ color: LS.err, fontFamily: "'JetBrains Mono', monospace" }}>{anomaly.id}</span> ran {anomaly.tools} tool calls vs baseline 1–2. High tool_calls + high input tokens is the classic agent-loop signature. <span style={{ color: LS.inkPrimary, fontWeight: 700 }}>Fix:</span> add max_iterations guard on the agent node.
          </div>
        </div>
      )}
    </LangSmithFrame>
  );
};

// ── End M6 TiltCard Mockups ───────────────────────────────────────────────────

function CoreContent({ track, completedSections = new Set<string>(), activeSection = null }: { track: GenAITrack; completedSections?: Set<string>; activeSection?: string | null }) {
  const nextSection = SECTIONS.find(s => !completedSections.has(s.id));
  return (
    <>
      {/* Module Hero */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '28px' }}>
      <div style={{ flex: 1, minWidth: 0, background: 'var(--ed-cream)', borderRadius: '14px', padding: '36px 36px 28px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-12px', top: '-8px', fontSize: '140px', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.05)`, fontFamily: "'Lora','Georgia',serif", letterSpacing: '-0.04em', userSelect: 'none' as const, pointerEvents: 'none' as const }}>06</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '10px', textTransform: 'uppercase' as const }}>GenAI Launchpad · Pre-Read 06</div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.025em', color: 'var(--ed-ink)', marginBottom: '10px', fontFamily: "'Lora', Georgia, serif" }}>AI Agent Workflows — Building & Scaling</h1>
          <p style={{ fontSize: '15px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '28px' }}>&ldquo;An agent you can&apos;t observe is a liability. An agent you can observe is infrastructure.&rdquo;</p>
          <GenAIHeroCharacterStrip track={track} mentors={['anika', 'rohan', 'leela', 'kabir']} />
          <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '16px 20px', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${ACCENT}` }}>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '10px', textTransform: 'uppercase' as const }}>Learning Objectives</div>
            {[
              'Distinguish when to use an agent vs. a fixed-sequence workflow chain',
              'Write tool descriptions that constrain agent behavior precisely',
              'Understand the ReAct reasoning loop and when to require intermediate scratchpad reasoning',
              'Build RAG pipelines in n8n — embedding lookup, similarity threshold, grounding prompt',
              'Instrument agent workflows with per-run token and tool-call logging for cost attribution and auditing',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 4 ? '8px' : 0, alignItems: 'flex-start' }}>
                <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>0{i + 1}</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, width: '162px', paddingTop: '8px' }}>
        <div className="float3d" style={{ background: 'linear-gradient(145deg, #0F0A1E 0%, #1A0F2E 100%)', borderRadius: '14px', padding: '18px 16px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE 06</div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>AI Agent Workflows</div>
          <div style={{ fontSize: '9px', color: 'rgba(240,232,216,0.45)', marginBottom: '14px' }}>GenAI Launchpad</div>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '12px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {SECTIONS.map((s, i) => {
              const done = completedSections.has(s.id);
              const active = activeSection === s.id;
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0, background: done ? '#22C55E' : active ? ACCENT : 'rgba(255,255,255,0.06)', border: `1px solid ${done ? '#22C55E' : active ? ACCENT : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: done || active ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, transition: 'all 0.3s' }}>{done ? '✓' : `0${i + 1}`}</div>
                  <div style={{ fontSize: '8px', color: done ? 'rgba(240,232,216,0.55)' : active ? 'rgba(240,232,216,0.95)' : 'rgba(240,232,216,0.3)', lineHeight: 1.3, flex: 1, transition: 'color 0.3s' }}>{s.label.replace(/^\d+\.\s+/, '')}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '12px', padding: '7px 10px', borderRadius: '6px', background: `${ACCENT}22`, border: `1px solid ${ACCENT}44` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', color: ACCENT, fontWeight: 700, marginBottom: '2px' }}>{nextSection ? 'NEXT UP' : 'COMPLETE ✓'}</div>
            <div style={{ fontSize: '8px', color: 'rgba(240,232,216,0.6)' }}>{nextSection ? nextSection.label.replace(/^\d+\.\s+/, '') : 'All sections read!'}</div>
          </div>
        </div>
      </div>
      </div>

      {/* ── Section 1: Agent Architecture ── */}
      <ChapterSection id="genai-m6-architecture" num="01" accentRgb={ACCENT_RGB} first>
        {para(track === 'engineer'
          ? "In Pre-Read 05, Aarav upgraded the claims workflow to process batches of 200+ exceptions, remap inconsistent field names from source systems, route items by confidence score rather than category alone, queue low-confidence items for human review, and isolate conversation context per user session. The automation is production-grade. This pre-read is about a different class of problem: tasks where the steps needed aren't known until the model reads the data — and where a fixed workflow chain can't make that call."
          : "In Pre-Read 05, Rhea's workflows can iterate over 80 spreadsheet rows, handle mismatched field names with a Code node, pause for her approval before any email is sent, and maintain separate memory per conversation session. The automation is solid. This pre-read is about the question her director keeps asking that no fixed workflow can answer — because answering it requires the system to decide what to look up, look it up, read the result, and decide whether to look up something else."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? "A new task: build a system that takes an exception report, looks up the relevant policy, determines the correct resolution path, and drafts a response. The steps are unknown until the exception is read. Aarav reaches for an agent. Rohan asks: are you sure an agent is the right call here?"
            : "The director wants a system that can answer ops questions in natural language: 'How many Dental renewals are overdue this week?' 'Which accounts have outstanding escalations?' Rhea has built workflows. She needs to know what she would need to build to answer questions like these."}
        </SituationCard>
        {h2(<>Agent vs. Chain: The Right Tool for Each Task</>)}
        {para(<>A workflow chain executes a fixed sequence of steps. You know step 1, step 2, step 3 before you run it. An agent chooses its next action based on what the previous action returned. The sequence is dynamic — determined at runtime by the model. This is the fundamental difference, and it determines which you should build.</>)}
        <GenAIConversationScene
          mentor="anika"
          track={track}
          accent="#7C3AED"
          techLines={[
            { speaker: 'protagonist', text: "The exception workflow needs to look up policy, determine resolution path, draft a response. That sounds like an agent to me." },
            { speaker: 'mentor', text: "Before you decide — does the sequence of steps change based on what the exception contains? Or is it always: lookup policy → determine path → draft?" },
            { speaker: 'protagonist', text: "Mostly the same sequence. But some exceptions need a second policy lookup if the first one doesn't resolve it." },
            { speaker: 'mentor', text: "That second-lookup decision is where the agent pattern starts to make sense. A fixed chain can't do conditional extra steps. An agent can decide mid-run whether it needs to look something up again." },
            { speaker: 'protagonist', text: "So if the sequence is always the same, use a chain. If it branches based on intermediate results, use an agent?" },
            { speaker: 'mentor', text: "That's the test. Agents add latency and token cost. Don't use them for tasks that don't need runtime decisions." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "To answer 'how many Dental renewals are overdue,' do I need an agent or a workflow?" },
            { speaker: 'mentor', text: "That's a fixed query. A workflow: trigger → read Google Sheet → filter for Dental + overdue → count → return. No decisions needed. A workflow chain is the right call." },
            { speaker: 'protagonist', text: "What if the question could be about anything — Health, Dental, Vision, any time range?" },
            { speaker: 'mentor', text: "Then you need a system that interprets the question and decides which data to pull. That's an agent — the model reads the question, decides what tool to call, calls it, reads the result, decides if that's enough." },
            { speaker: 'protagonist', text: "So the difference is whether the system needs to make decisions mid-task?" },
            { speaker: 'mentor', text: "Exactly. Fixed task = chain. Variable task = agent. Don't use an agent where a chain works." },
          ]}
        />
        {keyBox('Core Concepts', [
          'Planning loop — the agent\'s reasoning cycle: observe input → decide on action → execute action → observe result → decide next action. Continues until the model determines the task is complete.',
          'Tool registry — the set of tools available to the agent. Each tool has a name, a description, and a schema. The model reads descriptions to decide which tool to call and when.',
          'Observation-action cycle — each loop iteration: the model receives the accumulated context (conversation + tool results so far), generates a tool call or a final response, the tool executes, the result goes back into context.',
          'When NOT to use agents — fixed-sequence tasks, tasks where predictability matters more than flexibility, tasks where latency must be low, and tasks where cost must be tightly controlled. Agents introduce non-determinism; that is their strength and their risk.',
        ], ACCENT)}
        {PMPrincipleBox({ label: '◈ Principle', principle: "Use a chain when the steps are known. Use an agent when the steps depend on what the previous step found. Most automation tasks are chains." })}
        <GenAIAvatar
          name="Anika"
          nameColor="#7C3AED"
          borderColor="#7C3AED"
          content={<>The most expensive agent mistake is using an agent for a task that is actually a chain. You pay more per run, the output is less predictable, and debugging is harder — none of which matter if the task needed decisions that a chain can&apos;t make. The question is always: does this task have steps that are unknowable before runtime?</>}
          expandedContent={<>Agents introduce non-determinism by design. Two runs of the same input may take different paths and produce different outputs — because the model is making decisions. If your stakeholders expect identical outputs for identical inputs, an agent is the wrong tool. Use a deterministic chain and add AI at specific steps only.</>}
          question={track === 'engineer'
            ? "Aarav needs to: pull a claim, look up the matching policy, and classify the resolution. Always these 3 steps, always in this order. Which architecture?"
            : "Rhea needs to send a renewal reminder to every account overdue by more than 30 days. Same action for every qualifying account. Which architecture?"}
          options={[
            { text: "An agent — it will handle edge cases better than a chain", correct: false, feedback: "Adding an agent to a fixed-sequence task adds cost and unpredictability without benefit." },
            { text: "A workflow chain — steps are fixed and known before runtime", correct: true, feedback: "Correct. Fixed sequence, no mid-run decisions needed. A chain is cheaper, faster, and more predictable." },
            { text: "An agent with a fallback chain for simple cases", correct: false, feedback: "Hybrid architectures add complexity without solving a problem that exists." },
            { text: "A chain with an agent node at each step for flexibility", correct: false, feedback: "Adding agent nodes to a chain defeats the purpose of using a chain." },
          ]}
          conceptId="genai-m6-architecture"
        />
        <TiltCard style={{ margin: '28px 0' }}><ChainAgentClassifierCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'engineer'
          ? "List 3 tasks you have automated or are considering. For each, answer: does the sequence of steps change based on intermediate results? Mark each as 'chain' or 'agent'. Build a chain for one of the chain tasks before touching agent architecture."
          : "List 3 automation tasks relevant to your role. For each: does the task need to make decisions mid-run based on what it finds, or does it follow the same steps every time? Mark each chain vs. agent. This is your decision framework."} />
      </ChapterSection>

      {/* ── Section 2: Tool Use & Integrations ── */}
      <ChapterSection id="genai-m6-tools" num="02" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? "The agent has three tools: search_claims, lookup_policy, draft_response. The model calls search_claims on every turn — even when the user asks a policy question. The tool description reads: 'Search claims.' Nothing else."
            : "Rhea's agent has a Send Email tool and a Lookup Policy tool. It sends emails on almost every turn. Users complain it is sending unsolicited summaries. The tool description for Send Email reads: 'Sends an email.'"}
        </SituationCard>
        {h2(<>Tool Descriptions Are Instructions</>)}
        {para(<>A tool description is not documentation — it is an instruction to the model. The model reads tool descriptions to decide which tool to call, when to call it, and when not to. A vague description is a vague instruction. The result is over-use, mis-use, or unpredictable behavior.</>)}
        <GenAIConversationScene
          mentor="rohan"
          track={track}
          accent="#2563EB"
          techLines={[
            { speaker: 'protagonist', text: "The agent keeps calling search_claims even for policy questions. The description is accurate — it does search claims." },
            { speaker: 'mentor', text: "Accurate is not enough. The description needs to tell the model when to call it AND when not to. What should it say?" },
            { speaker: 'protagonist', text: "Something like: 'Call this when the user is asking about a specific claim — by ID, by patient name, or by status. Do not call this for questions about policy rules or coverage definitions.'" },
            { speaker: 'mentor', text: "That is a tool description. Now the model has a decision boundary, not just a definition." },
            { speaker: 'protagonist', text: "Is this the same as a system prompt?" },
            { speaker: 'mentor', text: "Related but separate. The system prompt defines the agent's overall behavior. Tool descriptions define when each tool is appropriate. Both need to be precise." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The agent sends emails when it shouldn't. The description just says 'Sends an email.'" },
            { speaker: 'mentor', text: "The model doesn't know when NOT to send an email. You need to add that to the description." },
            { speaker: 'protagonist', text: "Like: 'Only call this tool when the user explicitly asks for an email to be sent. Do not call for summaries, lookups, or confirmations'?" },
            { speaker: 'mentor', text: "Exactly. You've just added a constraint the model will respect. Tool descriptions with clear 'do not call' conditions prevent over-use." },
            { speaker: 'protagonist', text: "Is this a lot of work?" },
            { speaker: 'mentor', text: "Each tool needs one precise description. That is 10 minutes of work per tool. It prevents hours of debugging unexpected email sends." },
          ]}
        />
        {keyBox('Core Concepts', [
          'Tool description precision — the description should include: what the tool does, when to call it, when NOT to call it, and what inputs it expects. Vague descriptions cause over-use and mis-use.',
          'Tool schema — the JSON schema that defines the tool\'s input parameters: field names, types, required vs. optional, descriptions. The model uses the schema to generate the correct tool call payload.',
          'Tool call result handling — the model receives the tool\'s output and decides what to do next. The format of the output matters: structured JSON is easier for the model to reason about than unstructured text.',
          'Tool isolation — each tool should do exactly one thing. A tool that does multiple things based on its inputs creates ambiguity. Prefer more specific tools over fewer general tools.',
        ], '#2563EB')}
        {PMPrincipleBox({ label: '◈ Principle', principle: "A tool description tells the model when to call the tool and when not to. Precise descriptions are constraints. Vague descriptions are invitations." })}
        <GenAIAvatar
          name="Rohan"
          nameColor="#2563EB"
          borderColor="#2563EB"
          content={<>Test every tool description in isolation before running the full agent. Give the model a prompt where the tool should NOT be called and verify it isn&apos;t. If the model calls a tool when it shouldn&apos;t, the description is missing a constraint — not the model is broken.</>}
          expandedContent={<>Tool schemas are as important as descriptions. If the schema marks a field as optional but the tool actually requires it, the agent will make calls that fail. Define the schema from the tool&apos;s actual behavior — not from what you hope it will receive. Validate the schema against real outputs before deploying.</>}
          question={track === 'engineer'
            ? "A lookup_policy tool with description 'Looks up policy information' is called by the agent even when the user asks about claim status. What is the fix?"
            : "Rhea's agent has a Create_Report tool described as 'Creates a report.' It generates reports in every conversation. What is the minimum change needed?"}
          options={[
            { text: "Rename the tool to make its purpose clearer", correct: false, feedback: "The name alone doesn't provide decision constraints to the model." },
            { text: track === 'engineer' ? "Add to the description: 'Call this when the user asks about coverage rules, benefit limits, or policy definitions. Do not call for questions about specific claims, status, or processing.'" : "Add to the description: 'Only call when the user explicitly requests a report be generated. Do not call for questions, summaries, or routine responses.'", correct: true, feedback: "Correct. Adding when-to-call and when-not-to-call constraints gives the model a decision boundary." },
            { text: "Remove the tool and replace with a more specific one", correct: false, feedback: "The tool may be correct — the description is what needs work." },
            { text: "Add a human approval step before every tool call", correct: false, feedback: "Human approval is an escalation mechanism, not a fix for a vague tool description." },
          ]}
          conceptId="genai-m6-tools"
        />
        <TiltCard style={{ margin: '28px 0' }}><ToolDescriptionGraderCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'engineer'
          ? "Take one tool in your agent. Rewrite its description to include: what it does, when to call it, when NOT to call it, and expected input format. Test: give the agent a prompt where the tool should NOT fire. Verify the new description prevents the call."
          : "List the tools in your agent or planned agent. For each, write a one-sentence 'when to call' and a one-sentence 'when NOT to call.' These two sentences are the minimum for a useful tool description."} />
      </ChapterSection>

      {/* ── Section 3: Multi-Step Reasoning ── */}
      <ChapterSection id="genai-m6-reasoning" num="03" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? "The agent is asked: 'What is the total value of unresolved claims for patients enrolled in the Platinum plan this quarter?' It retrieves claims, then states a sum in its response. The sum is wrong by $4,000. There are 340 claims in the result."
            : "The agent is asked: 'Which of our top 10 accounts by premium are most at risk for non-renewal this quarter?' It returns 3 account names. The ops team cannot verify the reasoning. Rhea needs to explain how the agent reached its answer."}
        </SituationCard>
        {h2(<>How Agents Reason Across Multiple Steps</>)}
        {para(<>The ReAct pattern — Reason, then Act — describes how well-designed agents think before they call a tool. The model reasons about what it knows, what it needs, and which tool to call. After the tool returns, it reasons again: is this enough to answer the question, or do I need another step? This visible reasoning is what makes multi-step agent behavior auditable.</>)}
        <GenAIConversationScene
          mentor="kabir"
          track={track}
          accent="#0F766E"
          techLines={[
            { speaker: 'protagonist', text: "The sum in the agent's response is wrong. It retrieved 340 claims correctly but calculated the wrong total." },
            { speaker: 'mentor', text: "LLMs don't do arithmetic reliably at scale. 340 numbers is well past where in-context math breaks down. You need a calculation tool." },
            { speaker: 'protagonist', text: "A tool that just sums a field?" },
            { speaker: 'mentor', text: "A code execution tool that takes an array of numbers and returns the sum. Deterministic. The agent calls it, gets the precise answer, then frames it in the response. Math goes through code, not through the model." },
            { speaker: 'protagonist', text: "So the agent reasons about what to do, but delegates computation to a tool?" },
            { speaker: 'mentor', text: "Exactly. Model for language, code for math. The model should never be the calculator." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The agent returns 3 account names but I can't explain to the director why those 3. The reasoning is invisible." },
            { speaker: 'mentor', text: "Add a scratchpad step to the agent's system prompt: 'Before returning your final answer, write one sentence explaining why each account is at risk.' The reasoning is then in the output." },
            { speaker: 'protagonist', text: "Won't that make the response longer?" },
            { speaker: 'mentor', text: "Yes. But in a context where decisions affect accounts, invisible reasoning is a compliance risk. The extra length is the audit trail." },
            { speaker: 'protagonist', text: "So I'm asking the agent to show its work?" },
            { speaker: 'mentor', text: "Precisely. Visible reasoning is not just useful — in regulated contexts, it may be required." },
          ]}
        />
        {keyBox('Core Concepts', [
          'ReAct pattern (Reason + Act) — the agent alternates between reasoning steps and action steps. Each reasoning step produces a thought: what do I know, what do I need, what should I do? Each action step executes a tool. The pattern makes agent behavior visible and debuggable.',
          'Intermediate scratchpad — requiring the agent to write intermediate reasoning before producing a final answer. Implemented via system prompt instruction: "Before answering, write your reasoning step by step." Makes decisions auditable.',
          'Stopping conditions — criteria that tell the agent to stop the tool-calling loop. Without stopping conditions, agents can loop indefinitely. Typical conditions: "answer found," "max tool calls reached," "no new information from last tool call."',
          'Math via tools — LLMs are not reliable calculators for more than trivial arithmetic. Aggregations, sums, averages, and comparisons over data should be performed by a code execution tool. The model calls the tool; the tool does the math.',
        ], '#0891B2')}
        {PMPrincipleBox({ label: '◈ Principle', principle: "Don't ask the model to do math or make invisible decisions. Give it tools for computation. Require intermediate reasoning for any decision that needs to be auditable." })}
        <GenAIAvatar
          name="Kabir"
          nameColor="#0F766E"
          borderColor="#0F766E"
          content={<>The scratchpad pattern is not overhead — it is the difference between an agent whose decisions you can defend and one whose decisions you can&apos;t explain. In any context where a wrong decision has consequences — a misclassified claim, a wrongly escalated account — the scratchpad is what lets you trace the error back to its source.</>}
          expandedContent={<>Stopping conditions are often forgotten until an agent runs indefinitely and burns through a token budget. Define them before deployment: maximum tool calls per run (e.g., 10), maximum loop iterations, and a fallback response if the stopping condition fires without a complete answer. Never deploy an agent that has no ceiling on its tool-calling loop.</>}
          question={track === 'engineer'
            ? "Aarav's agent is asked to rank claims by risk score. It returns a ranked list. The ranking appears wrong. What is the most reliable diagnostic first step?"
            : "Rhea's agent makes a recommendation to escalate an account. She needs to explain the reasoning to her director. What should she add to the agent's prompt?"}
          options={[
            { text: track === 'engineer' ? "Switch to a more powerful model for better reasoning" : "Ask the agent to provide a confidence score alongside the recommendation", correct: false, feedback: "Model choice and confidence scores don't expose the reasoning chain." },
            { text: track === 'engineer' ? "Add a scratchpad instruction: 'Before ranking, write your reasoning for each claim's risk score'" : "Add to the system prompt: 'Before making a recommendation, write one sentence explaining the specific reason for each account you consider escalating'", correct: true, feedback: "Correct. Visible intermediate reasoning makes the ranking/recommendation auditable and debuggable." },
            { text: track === 'engineer' ? "Log the tool call inputs and outputs to check for data issues" : "Request a written report from the agent after every recommendation", correct: false, feedback: "Logging and reports are useful but don't expose the in-context reasoning." },
            { text: track === 'engineer' ? "Add a verification tool that checks the ranking against a known baseline" : "Have a human reviewer sign off on all recommendations", correct: false, feedback: "Verification and human review are downstream controls, not diagnostic tools." },
          ]}
          conceptId="genai-m6-reasoning"
        />
        <TiltCard style={{ margin: '28px 0' }}><ReActStepExplorerCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'engineer'
          ? "Take an agent that makes a ranking or classification decision. Add a scratchpad instruction to its system prompt. Run it on 5 test cases. Read the scratchpad output. Identify one case where the reasoning reveals a gap in the tool's data or the prompt's framing."
          : "Take a recommendation your agent makes. Add a one-sentence-per-item reasoning requirement to the system prompt. Run it on 3 test cases. Could you explain each recommendation to a stakeholder? If not, the prompt needs more specificity."} />
      </ChapterSection>

      {/* ── Section 4: RAG in Agent Workflows ── */}
      <ChapterSection id="genai-m6-rag" num="04" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? "The agent is answering claims questions correctly 80% of the time. For the other 20%, the retrieved policy documents are correct but the answer is still wrong. Aarav checks the retrieval — the right documents are being fetched. The problem is downstream."
            : "Rhea's policy FAQ chatbot answers complex questions inconsistently. The same question asked twice sometimes gets different answers. The retrieval is returning the right documents both times."}
        </SituationCard>
        {h2(<>Retrieval-Augmented Agents: Beyond the Similarity Score</>)}
        {para(<>RAG in an agent workflow has two distinct failure modes: retrieval failure (wrong documents) and generation failure (right documents, wrong answer). Most RAG debugging focuses on retrieval. Generation failures — where the model has the correct context but produces an incorrect or inconsistent answer — require different interventions.</>)}
        <GenAIConversationScene
          mentor="leela"
          track={track}
          accent="#C2410C"
          techLines={[
            { speaker: 'protagonist', text: "The retrieval is correct — I verified the 3 documents fetched are the right ones. But the answer is still wrong 20% of the time." },
            { speaker: 'mentor', text: "Check whether the 20% failure cases require synthesizing information across all 3 documents — not just reading one of them." },
            { speaker: 'protagonist', text: "How would I tell?" },
            { speaker: 'mentor', text: "Read the failed question and the 3 retrieved documents. Can you answer the question from one document alone? Or do you need to combine information from multiple?" },
            { speaker: 'protagonist', text: "For the failures, I need data from document 1 and document 3 combined." },
            { speaker: 'mentor', text: "Cross-document synthesis is harder than single-document lookup. Present the documents together with explicit instructions to synthesize. Or split the question into two sub-queries — one per document — and combine the answers." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "Same question, two different answers. The documents retrieved are identical. Why is the response different?" },
            { speaker: 'mentor', text: "Is the grounding instruction in the prompt? Does it tell the model to answer only from the provided documents?" },
            { speaker: 'protagonist', text: "No, the prompt just says 'Answer the user's question.'" },
            { speaker: 'mentor', text: "Without grounding, the model blends the retrieved documents with its training data. The training data varies by temperature setting, sampling — so you get different answers to the same question." },
            { speaker: 'protagonist', text: "If I add 'only use the provided documents,' the inconsistency goes away?" },
            { speaker: 'mentor', text: "For questions answerable from the documents, yes. For questions where the answer isn't in the documents, it will say so — which is actually the correct behavior." },
          ]}
        />
        {keyBox('Core Concepts', [
          'Embedding lookup — each document chunk is converted to a vector (embedding). At query time, the query is also embedded and the closest document vectors by cosine similarity are retrieved. The similarity score is a measure of semantic closeness, not factual relevance.',
          'Similarity threshold — the minimum cosine similarity score required for a document to be included in retrieval results. Too low = irrelevant documents retrieved. Too high = relevant documents missed. Calibrate against real query/document pairs.',
          'Grounding prompt — an instruction in the system prompt that constrains the model to use only the retrieved context: "Answer using only the documents provided. If the answer is not in the documents, say: I don\'t have that information." Without this, the model mixes retrieved context with training knowledge.',
          'Retrieval failure handling — what happens when no documents meet the similarity threshold, or the retrieved documents don\'t contain the answer. A RAG agent needs an explicit response for this case: it should not hallucinate an answer when retrieval fails.',
        ], '#059669')}
        {PMPrincipleBox({ label: '◈ Principle', principle: "Retrieval accuracy and generation accuracy are separate problems. Correct retrieval does not guarantee correct answers. Audit them independently." })}
        <GenAIAvatar
          name="Leela"
          nameColor="#C2410C"
          borderColor="#C2410C"
          content={<>In health insurance, a hallucinated policy answer is a compliance event — not just a quality issue. Every RAG system handling policy, coverage, or benefits questions needs an explicit &ldquo;I don&apos;t know&rdquo; path. When retrieval returns nothing above threshold, the agent should say it doesn&apos;t have the information — not generate a plausible-sounding answer from training data.</>}
          expandedContent={<>Test your RAG system with questions you know are NOT in the document corpus. The agent should say it doesn&apos;t have the information. If it instead produces a confident answer, the grounding instruction is either missing or being overridden by the model&apos;s tendency to be helpful. Fix the grounding instruction before deploying.</>}
          question={track === 'engineer'
            ? "Aarav's RAG agent retrieves 3 documents with similarity scores of 0.91, 0.88, and 0.72. The 0.72 document contains an irrelevant excerpt from an old policy version. What is the immediate fix?"
            : "Rhea's RAG chatbot confidently answers a question about a benefit that was discontinued last year. The correct policy documents do not mention this benefit. What is the root cause?"}
          options={[
            { text: track === 'engineer' ? "Increase the threshold to 0.85 to exclude the 0.72 document" : "Remove the outdated policy documents from the document corpus", correct: false, feedback: "Partial fix only — threshold tuning and corpus hygiene are maintenance tasks, not the root cause fix." },
            { text: track === 'engineer' ? "The similarity threshold is too low — also add a reranking step to evaluate semantic relevance, not just vector distance" : "The grounding instruction is missing — the model is generating the answer from training data, not from retrieved documents", correct: true, feedback: "Correct. Threshold adjustment helps retrieval; reranking improves precision. For the non-tech case, the model is generating from memory, not from context — the grounding instruction prevents this." },
            { text: track === 'engineer' ? "Use a more recent embedding model with better domain understanding" : "Increase the number of documents retrieved from 3 to 5", correct: false, feedback: "Embedding model choice and retrieval count are not the root cause in these scenarios." },
            { text: track === 'engineer' ? "The top 2 documents are sufficient — remove the third from the context" : "Add a disclaimer to all chatbot answers about policy accuracy", correct: false, feedback: "These are workarounds, not fixes." },
          ]}
          conceptId="genai-m6-rag"
        />
        <TiltCard style={{ margin: '28px 0' }}><GroundingToggleCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'engineer'
          ? "Build a minimal RAG flow: HTTP trigger → embedding lookup → top-3 retrieval → grounded response. Test with: 1) a question answerable from docs, 2) a question NOT in the docs. Verify the second returns 'I don't have that information' — not a hallucinated answer."
          : "Identify one knowledge base your team relies on (policy docs, procedure guides, FAQs). Design a RAG flow for it: what gets chunked, what gets embedded, what threshold for retrieval. Then write the grounding prompt instruction. Start there before building anything."} />
      </ChapterSection>

      {/* ── Section 5: Scale & Observability ── */}
      <ChapterSection id="genai-m6-scale" num="05" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? "The agent system has been running for 30 days. OpenAI bill is 4× the estimate. Aarav has workflow-level success/failure logs but nothing more granular. He cannot identify which workflow, which user, or which tool call is driving the cost."
            : "After a month of running, the director asks: 'How many times did the agent send an escalation email this month, and what triggered each one?' Rhea cannot answer. The workflow logs show success — but not what happened inside each run."}
        </SituationCard>
        {h2(<>Observability: Knowing What Your Agent Actually Did</>)}
        {para(<>A workflow log that records success or failure tells you the workflow ran. It does not tell you what it cost, which tools it called, how many tokens it used, or why it made the decisions it made. Agent observability requires per-run structured logs that capture behavior — not just outcome.</>)}
        <GenAIConversationScene
          mentor="rohan"
          track={track}
          accent="#2563EB"
          techLines={[
            { speaker: 'protagonist', text: "The bill is 4x. I have no idea where the tokens are going." },
            { speaker: 'mentor', text: "You need per-run logging: model used, input tokens, output tokens, number of tool calls, which tools were called. Without those four fields, cost attribution is impossible." },
            { speaker: 'protagonist', text: "Where do I add this? After the agent node?" },
            { speaker: 'mentor', text: "Add a logging step after every agent node. The agent node output includes token usage. Extract it and write it to a logging sheet or a structured log store. One row per run, four fields minimum." },
            { speaker: 'protagonist', text: "And if I want to find which workflow is most expensive?" },
            { speaker: 'mentor', text: "Tag every log row with the workflow name and trigger type. Then you can group by workflow and see which one is burning tokens." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The director wants to know how many escalation emails the agent sent and why. My logs just show 'workflow completed.'" },
            { speaker: 'mentor', text: "You need structured logs for every tool call: tool name, timestamp, inputs, outputs. Add a logging step after every tool call in the workflow." },
            { speaker: 'protagonist', text: "That's a lot of log rows." },
            { speaker: 'mentor', text: "It's the right number. One row per tool call. If the agent sent 14 escalation emails, you have 14 rows in the log with the account name, the trigger condition, and the email content." },
            { speaker: 'protagonist', text: "I could filter the log by tool name to answer the director's question." },
            { speaker: 'mentor', text: "Exactly. That is what observability enables: answerable questions about agent behavior." },
          ]}
        />
        {keyBox('Core Concepts', [
          'Per-run token logging — capturing input tokens, output tokens, model name, and tool calls for each agent execution. This is the foundation of cost attribution. Without it, unexpected bills have no actionable root cause.',
          'Structured tool call logs — a record of every tool call made during a run: tool name, timestamp, inputs, outputs, success/failure. This is the audit trail that answers "what did the agent do" vs. "did the workflow complete."',
          'Human escalation triggers — explicit conditions that route a run to human review: low confidence output, high-risk decision, detected anomaly, or any condition where the cost of a wrong answer exceeds the cost of human time.',
          'Token budget per run — a hard limit on tokens consumed per agent execution. Prevents runaway loops and cost spikes. Implement at both the agent node level and as a monitoring alert on your logging data.',
        ], '#C2410C')}
        {PMPrincipleBox({ label: '◈ Principle', principle: "Logging execution is not the same as logging behavior. Agent observability requires per-run records of every tool call — not just whether the workflow succeeded." })}
        <GenAIAvatar
          name="Rohan"
          nameColor="#2563EB"
          borderColor="#2563EB"
          content={<>The first month of any agent system in production will surprise you. Something will cost more than expected, or behave unexpectedly, or call a tool in a way you didn&apos;t intend. The difference between diagnosing it in an hour vs. a week is whether you have per-run structured logs. Build the logging before you go live — not after the first incident.</>}
          expandedContent={<>Token budgets are not optional in production. An agent in an infinite tool-calling loop can exhaust a monthly token budget in hours. Set a max-tool-calls-per-run limit in the agent node configuration. Set a separate alert when a single run exceeds 2× the average token count. These two controls prevent the most common cost surprises.</>}
          question={track === 'engineer'
            ? "Aarav adds per-run logging: model, input tokens, output tokens, tool calls. After a week, he finds one workflow consumes 60% of total tokens. What is the most productive next step?"
            : "Rhea's structured logs show the escalation email tool was called 47 times in one month. 12 of those calls were for the same account. What should she investigate?"}
          options={[
            { text: track === 'engineer' ? "Switch the workflow to a cheaper model immediately" : "Disable the escalation tool for that account", correct: false, feedback: "Acting before diagnosing is premature optimization." },
            { text: track === 'engineer' ? "Examine that workflow's tool calls per run — is it making more tool calls than expected, or using a larger context than necessary?" : "Read the 12 log entries for that account: what triggered each escalation, what data was passed, was each escalation legitimate or a false positive?", correct: true, feedback: "Correct. Structured logs exist to enable exactly this kind of behavioral audit. Read before acting." },
            { text: track === 'engineer' ? "Increase the token budget for that workflow since it's clearly more complex" : "Set a per-account escalation limit to prevent repeat triggers", correct: false, feedback: "Increasing budget or adding limits without understanding the root cause doesn't fix the underlying issue." },
            { text: track === 'engineer' ? "Split the workflow into two smaller workflows to distribute the token load" : "Ask the account manager if the escalations were expected", correct: false, feedback: "Structural changes and manual investigation are premature before reading the available log data." },
          ]}
          conceptId="genai-m6-scale"
        />
        <TiltCard style={{ margin: '28px 0' }}><AnomalyDetectiveCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'engineer'
          ? "Add a logging step to your most complex agent workflow. Log: model, input tokens, output tokens, tool calls list. Run it 10 times on varied inputs. Build a simple view of the logs (a Google Sheet is fine). Identify the run with the highest token count — read its tool call list."
          : "Add a tool call log to your most-used agent workflow: tool name, timestamp, trigger condition, output summary. Run for one week. At the end of the week, answer: which tool was called most often, and were all those calls justified?"} />
        <NextChapterTeaser text="Module 07 covers Model Context Protocol (MCP) — the emerging standard for connecting AI models to tools, data sources, and services in a way that is composable, auditable, and model-agnostic." />
      </ChapterSection>
    </>
  );
}

export default function GenAIPreRead6({ track, onBack, onNext, nextLabel }: Props) {
  const completionMessage = track === 'engineer'
    ? 'You can architect, instrument, and scale agents. Agent architecture, tool design, multi-step reasoning, RAG pipelines, and structured observability. Module 07 introduces MCP.'
    : 'Agents, tools, retrieval, and observability connected. You can now evaluate whether a task needs an agent, design the tools it uses, ground it in retrieved knowledge, and log what it does. Module 07 introduces MCP.';
  return (
    <GenAIPreReadLayout
      moduleNum="06" moduleLabel={TRACK_META[track].introTitle}
      accent={ACCENT} accentRgb={ACCENT_RGB}
      sections={SECTIONS} badges={BADGES} concepts={CONCEPTS}
      completionEmoji="◎" completionMessage={completionMessage} onBack={onBack} onNext={onNext} nextLabel={nextLabel}
    >
      <CoreContent track={track} />
    </GenAIPreReadLayout>
  );
}

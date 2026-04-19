'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import QuizEngine from './QuizEngine';
import GenAIAvatar, { GenAIMentorFace, GenAIConversationScene, AaravFace, RheaFace } from './GenAIAvatar';
import type { GenAIMentorId } from './GenAIAvatar';
import type { GenAITrack } from './genaiTypes';
import {
  ApplyItBox, ChapterSection, NextChapterTeaser, PMPrincipleBox, SituationCard,
  TiltCard, chLabel, h2, keyBox, para, pullQuote,
} from './pm-fundamentals/designSystem';

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
  { id: 'genai-m6-architecture', icon: 'AC', label: 'Architect',    color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'genai-m6-tools',        icon: 'TL', label: 'Tool Wirer',   color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'genai-m6-reasoning',    icon: 'RS', label: 'ReAct Thinker',color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
  { id: 'genai-m6-rag',          icon: 'RG', label: 'RAG Builder',  color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'genai-m6-scale',        icon: 'OB', label: 'Observer',     color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
];

const QUIZZES = [
  {
    conceptId: 'genai-m6-architecture',
    question: {
      tech: "Aarav is asked to build an AI system that checks eligibility for a claim. The eligibility check has 3 fixed steps, always in the same order, with no branching. Should he build an agent or a chain?",
      'non-tech': "Rhea wants to automate a renewal reminder: pull overdue renewals → format a reminder email → send it. Always the same 3 steps. Should she use an agent or a workflow chain?",
    },
    options: {
      tech: [
        'A. An agent — it is more flexible and can handle edge cases',
        'B. A chain — the steps are fixed and predictable; an agent adds tool-calling overhead with no benefit',
        'C. An agent — agents always perform better than chains for multi-step tasks',
        'D. A chain with an agent fallback for edge cases',
      ],
      'non-tech': [
        'A. An agent — agents are smarter and will handle the task better',
        'B. A workflow chain — fixed steps with no decisions needed means an agent is the wrong tool',
        'C. An agent because agents can be reused across different tasks',
        'D. Neither — use a scheduled trigger without any AI',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 1 },
    explanation: {
      tech: "Agents are for tasks where the sequence of actions is uncertain and the model needs to decide what to do next. Fixed-sequence tasks are chains. Using an agent for a predictable 3-step process adds latency, token cost, and unpredictability — without any benefit.",
      'non-tech': "An agent decides what to do next based on intermediate results. A chain executes a fixed sequence. If there are no decisions to make, a chain is cheaper, faster, and more predictable. Agents are the right tool when the path through the task is uncertain.",
    },
    keyInsight: "Use a chain when the steps are known. Use an agent when the steps depend on what the previous step found. Most automation tasks are chains.",
  },
  {
    conceptId: 'genai-m6-tools',
    question: {
      tech: "Aarav defines a tool called `search_claims`. The description reads: 'Searches claims.' The agent calls it with every query, even irrelevant ones. What is the most likely cause?",
      'non-tech': "Rhea's agent has a 'Send Email' tool. It sends an email on almost every turn — including turns where no email is needed. What should be changed?",
    },
    options: {
      tech: [
        'A. The agent\'s model is too powerful and over-uses available tools',
        'B. The tool description is too vague — the agent calls it whenever search might be relevant because it has no guidance on when NOT to call it',
        'C. The tool schema is missing required parameters, so the agent defaults to calling it',
        'D. The agent node is set to always call all available tools',
      ],
      'non-tech': [
        'A. The Send Email tool is too accessible — move it to a restricted toolset',
        'B. The tool description needs to specify exactly when the tool should and should not be called',
        'C. Reduce the number of tools available to the agent',
        'D. Add a human approval step before every email tool call',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 1 },
    explanation: {
      tech: "The model uses tool descriptions to decide when to call a tool. A vague description like 'Searches claims' gives the model no guidance on when NOT to use it. A precise description includes the trigger condition: 'Call this when the user is looking for a specific claim by ID or status. Do not call for general questions about claims policy.'",
      'non-tech': "Tool descriptions are instructions to the model. 'Send Email' with no constraints tells the model it can send email whenever it seems helpful. Add: 'Only call this tool when the user explicitly requests an email be sent. Do not call for summaries, lookups, or confirmations.'",
    },
    keyInsight: "Tool descriptions are instructions to the model. A good tool description tells the model both when to call the tool and when not to. Vague descriptions cause over-use.",
  },
  {
    conceptId: 'genai-m6-reasoning',
    question: {
      tech: "Aarav's agent is asked: 'What is the total value of open claims filed this month?' The agent makes one tool call to get all claims, then tries to sum the amounts in its response text. The sum is wrong. What is the design gap?",
      'non-tech': "Rhea's agent is asked to identify the top 3 renewal-risk accounts. It returns 3 account names without explanation. Rhea can't verify the reasoning. What should be added?",
    },
    options: {
      tech: [
        'A. The agent should use a more powerful model for arithmetic',
        'B. Arithmetic in response text is unreliable — add a code tool or calculation node that sums the amounts precisely and passes the result back to the agent',
        'C. The agent needs more context about the claims data format',
        'D. Filter the claims before returning them to reduce the number of values to sum',
      ],
      'non-tech': [
        'A. Ask the agent to rank by risk score instead of returning names',
        'B. Add a scratchpad step where the agent writes its reasoning for each account before selecting the top 3',
        'C. Return 5 accounts instead of 3 to give more options',
        'D. Have a human review the accounts and confirm the ranking',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 1 },
    explanation: {
      tech: "LLMs are not reliable calculators. Arithmetic done in the model's response generation is error-prone for anything beyond trivial sums. Calculations should be done by a deterministic tool — a code execution node, a formula node, or a function — and the result handed back to the agent for framing.",
      'non-tech': "When an agent makes a decision that needs to be verifiable, require it to write intermediate reasoning before the final answer. This is the scratchpad pattern: 'Before listing the top 3 accounts, explain in 1 sentence why each is a renewal risk.' The reasoning is auditable; the unexplained list is not.",
    },
    keyInsight: "Don't ask the model to do math or make invisible decisions. Give it tools for computation and require intermediate reasoning for decisions that need to be auditable.",
  },
  {
    conceptId: 'genai-m6-rag',
    question: {
      tech: "Aarav's RAG agent retrieves the top 3 policy documents by cosine similarity and passes them to the model. The model answers correctly 80% of the time. For the other 20%, the retrieved documents are relevant but the answer is still wrong. What is the most likely cause?",
      'non-tech': "Rhea's RAG chatbot retrieves 5 policy excerpts and asks the model to answer a user's question. For complex questions, the answer is inconsistent. The retrieved documents are correct. What should she investigate?",
    },
    options: {
      tech: [
        'A. The similarity threshold is too low — irrelevant documents are being retrieved',
        'B. The retrieved documents are relevant but the answer requires information that spans multiple documents and the model is not synthesizing across all 3 correctly',
        'C. The embedding model needs to be retrained on the policy domain',
        'D. The model context window is too small to hold 3 documents',
      ],
      'non-tech': [
        'A. The similarity score should be higher — increase the threshold to retrieve fewer, better documents',
        'B. The prompt does not instruct the model to use only the retrieved documents — it may be mixing in training data',
        'C. Use a larger model for complex questions',
        'D. Reduce the number of retrieved documents from 5 to 3',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 1 },
    explanation: {
      tech: "Retrieval can be correct while generation is wrong. Multi-document synthesis — combining information spread across 3 separate documents — is harder than single-document lookup. Check whether the 20% failure cases all require cross-document reasoning. If so, the issue is in how the context is presented to the model, not in retrieval.",
      'non-tech': "Without explicit grounding instructions, models blend retrieved context with training data. The prompt should state: 'Answer using only the provided documents. If the answer is not in the documents, say so.' This forces grounding and makes hallucination visible.",
    },
    keyInsight: "Retrieval accuracy and generation accuracy are separate problems. Correct retrieval does not guarantee correct answers. Audit them independently.",
  },
  {
    conceptId: 'genai-m6-scale',
    question: {
      tech: "Aarav's agent workflow runs 500 times per day. At month-end, the OpenAI bill is 4× the estimate. He has logging but it only records success/failure. What is missing?",
      'non-tech': "Rhea's agent system has been running for a month. A team member asks: 'How many times did the agent call the Send Email tool this month?' Rhea can't answer. What logging is missing?",
    },
    options: {
      tech: [
        'A. The agent is making too many tool calls — add a tool call limit',
        'B. Per-run token logging: input tokens, output tokens, model used, tool calls made. Without this, cost attribution is impossible',
        'C. Switch to a cheaper model to reduce costs automatically',
        'D. Add a cost alert when the monthly bill exceeds a threshold',
      ],
      'non-tech': [
        'A. A dashboard showing total emails sent per month',
        'B. Structured per-run logs that record every tool call made: tool name, timestamp, inputs, outputs',
        'C. An audit trail showing which team members used the agent',
        'D. A weekly summary email of agent activity',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 1 },
    explanation: {
      tech: "Success/failure logging tells you the workflow ran. It does not tell you what it cost to run. Per-run token logging (input + output tokens per model call, per workflow execution) is the foundation of cost attribution. Without it, you cannot identify which workflows, which users, or which tools are driving the bill.",
      'non-tech': "Knowing that a workflow ran is not the same as knowing what it did. Structured logs should record every tool call: which tool, when, with what inputs, producing what outputs. This is the audit trail that answers 'how many emails did the agent send' and 'what did it send them about.'",
    },
    keyInsight: "Logging execution is not the same as logging behavior. Agent observability requires per-run records of every tool call — not just whether the workflow succeeded.",
  },
];

const SECTION_XP = 50;
const QUIZ_XP = 100;

const TRACK_META: Record<GenAITrack, { label: string; introTitle: string; moduleContext: string }> = {
  'non-tech': {
    label: 'Workflow & Operator Track',
    introTitle: 'AI Agent Workflows · Operator Lens',
    moduleContext: `GenAI Launchpad · Non-Tech Track · Pre-Read 06 · AI Agent Workflows — Building & Scaling. Follows Rhea, operations lead at Northstar Health, as she moves from individual workflow automations to full agent systems — and learns where agents add genuine value vs. where they add complexity without benefit.`,
  },
  tech: {
    label: 'Tech Builder Track',
    introTitle: 'AI Agent Workflows · Builder Lens',
    moduleContext: `GenAI Launchpad · Tech Track · Pre-Read 06 · AI Agent Workflows — Building & Scaling. Follows Aarav, platform engineer at Northstar Health, as he builds production-grade agent systems — tool registries, multi-step reasoning, RAG pipelines, and the observability layer that makes them trustworthy.`,
  },
};

type Props = { track: GenAITrack; onBack: () => void };

function computeXP(completedSections: Set<string>, conceptStates: Record<string, { pKnow: number }>) {
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = Object.values(conceptStates).reduce((sum, s) => sum + Math.round(s.pKnow * QUIZ_XP), 0);
  return { readingXP, quizXP, total: readingXP + quizXP };
}

function getLevel(total: number) {
  if (total >= 600) return { label: 'Builder',  color: '#7C3AED', min: 600 };
  if (total >= 350) return { label: 'Operator', color: '#2563EB', min: 350 };
  if (total >= 150) return { label: 'Explorer', color: '#7C3AED', min: 150 };
  return { label: 'Curious', color: 'var(--ed-ink3)', min: 0 };
}

function getNextLevel(total: number) {
  if (total < 150) return { label: 'Explorer', min: 150 };
  if (total < 350) return { label: 'Operator', min: 350 };
  if (total < 600) return { label: 'Builder',  min: 600 };
  return null;
}

function LeftNav({ completedSections, activeSection }: { completedSections: Set<string>; activeSection: string | null }) {
  const donePct = Math.round((completedSections.size / SECTIONS.length) * 100);
  return (
    <aside style={{ position: 'sticky', top: '80px' }}>
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '18px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--ed-rule)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '8px' }}>Contents</div>
          <div style={{ height: '2px', background: 'var(--ed-rule)', borderRadius: '1px', overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', background: ACCENT }} animate={{ width: `${donePct}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '6px' }}>{donePct}% · {completedSections.size}/{SECTIONS.length} parts</div>
        </div>
        <nav>
          {SECTIONS.map((section, idx) => {
            const done = completedSections.has(section.id);
            const active = activeSection === section.id && !done;
            return (
              <motion.button
                key={section.id}
                onClick={() => document.querySelector(`[data-section="${section.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                whileHover={{ x: 2 }}
                style={{ display: 'flex', alignItems: 'baseline', gap: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', textAlign: 'left' as const, borderLeft: active ? `2px solid ${ACCENT}` : '2px solid transparent', paddingLeft: '8px', marginLeft: '-8px' }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: done || active ? ACCENT : 'var(--ed-rule)', minWidth: '20px' }}>{String(idx + 1).padStart(2, '0')}.</span>
                <span style={{ fontSize: '12px', fontWeight: active ? 600 : 400, color: done ? 'var(--ed-ink2)' : active ? 'var(--ed-ink)' : 'var(--ed-ink3)', lineHeight: 1.4 }}>{section.label}{done ? ' ✓' : ''}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

function Sidebar({ completedSections, progressPct, prevXp }: { completedSections: Set<string>; progressPct: number; prevXp: number }) {
  const store = useLearnerStore();
  const xp = computeXP(completedSections, store.conceptStates);
  const level = getLevel(xp.total);
  const nextLevel = getNextLevel(xp.total);

  return (
    <aside style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px' }}>Level</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: level.color }}>{level.label}</div>
          </div>
          <div style={{ textAlign: 'right' as const }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px' }}>XP</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: ACCENT, fontFamily: "'JetBrains Mono', monospace" }}>{xp.total}</div>
          </div>
        </div>
        {nextLevel && (
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>→ {nextLevel.label}</span>
              <span style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{nextLevel.min - xp.total} XP away</span>
            </div>
            <div style={{ height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${Math.min(100, ((xp.total - level.min) / (nextLevel.min - level.min)) * 100)}%` }} style={{ height: '100%', background: ACCENT }} transition={{ duration: 0.6 }} />
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1, background: 'var(--ed-cream)', borderRadius: '6px', padding: '8px', textAlign: 'center' as const }}>
            <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', marginBottom: '2px', textTransform: 'uppercase' as const }}>Reading</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'JetBrains Mono', monospace" }}>{xp.readingXP}</div>
          </div>
          <div style={{ flex: 1, background: 'var(--ed-cream)', borderRadius: '6px', padding: '8px', textAlign: 'center' as const }}>
            <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', marginBottom: '2px', textTransform: 'uppercase' as const }}>Quizzes</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'JetBrains Mono', monospace" }}>{xp.quizXP}</div>
          </div>
        </div>
      </div>
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '12px' }}>Badges</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
          {BADGES.map((badge) => {
            const unlocked = completedSections.has(badge.id);
            return (
              <div key={badge.id} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '4px', opacity: unlocked ? 1 : 0.3 }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: unlocked ? badge.bg : 'var(--ed-rule)', border: `1.5px solid ${unlocked ? badge.border : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: unlocked ? badge.color : 'var(--ed-ink3)' }}>{badge.icon}</span>
                </div>
                <div style={{ fontSize: '8px', color: unlocked ? 'var(--ed-ink3)' : 'transparent', fontWeight: 600, textAlign: 'center' as const, maxWidth: '40px', lineHeight: 1.2 }}>{badge.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-indigo)', marginBottom: '10px' }}>Concept Mastery</div>
        {CONCEPTS.map((concept) => {
          const state = store.conceptStates[concept.id] || { pKnow: 0 };
          const pct = Math.round(state.pKnow * 100);
          return (
            <div key={concept.id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--ed-ink2)', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{concept.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: concept.color, fontWeight: 700, marginLeft: '8px', flexShrink: 0 }}>{pct}%</span>
              </div>
              <div style={{ height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${pct}%` }} style={{ height: '100%', background: concept.color }} transition={{ duration: 0.6 }} />
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>Complete quizzes and mentor checks to raise mastery scores</div>
      </div>
    </aside>
  );
}

// ── M6 TiltCard Mockups ──────────────────────────────────────────────────────

const AgentArchCard = ({ track }: { track: GenAITrack }) => {
  const tools = track === 'tech'
    ? ['get_claim_data', 'query_policy_db', 'write_tracker', 'send_slack']
    : ['get_exception_data', 'lookup_policy', 'send_email', 'escalate_to_manager'];
  return (
    <div style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: '12px', padding: '20px 24px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.14em', color: '#78716C', marginBottom: '16px' }}>AI AGENT ARCHITECTURE — ORCHESTRATOR + TOOLS + MEMORY</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', alignItems: 'start' }}>
        <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#7C3AED', letterSpacing: '0.1em', marginBottom: '10px' }}>MEMORY</div>
          <div style={{ fontSize: '10px', color: '#44403C', lineHeight: 1.6 }}>
            <div style={{ marginBottom: '4px' }}>· Window Buffer (chat turns)</div>
            <div style={{ marginBottom: '4px' }}>· Session ID per user</div>
            <div>· Context injected into each prompt</div>
          </div>
        </div>
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '2px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '14px', textAlign: 'center' as const, boxShadow: '0 0 20px rgba(245,158,11,0.12)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#F59E0B', letterSpacing: '0.1em', marginBottom: '8px' }}>ORCHESTRATOR (LLM)</div>
          <div style={{ fontSize: '10px', color: '#44403C', lineHeight: 1.6 }}>
            <div>Decides which tool to call</div>
            <div>Reads tool output</div>
            <div>Reasons → acts → repeats</div>
            <div>Returns final response</div>
          </div>
        </div>
        <div style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#059669', letterSpacing: '0.1em', marginBottom: '10px' }}>TOOLS</div>
          {tools.map((t, i) => (
            <div key={i} style={{ fontSize: '9px', color: '#44403C', marginBottom: '4px', padding: '3px 6px', background: 'rgba(5,150,105,0.06)', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace" }}>{t}()</div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '12px', padding: '8px 12px', background: '#F5F5F4', borderRadius: '6px', fontSize: '10px', color: '#78716C', fontFamily: "'JetBrains Mono', monospace" }}>Chain = same steps every time. Agent = orchestrator decides steps based on intermediate results.</div>
    </div>
  );
};

const ToolRegistryCard = ({ track }: { track: GenAITrack }) => {
  const tools = track === 'tech' ? [
    { name: 'get_claim_data', when: 'User asks about a specific claim ID', whenNot: 'User asks a general policy question', input: 'claim_id: string', color: '#7C3AED' },
    { name: 'query_policy_db', when: 'User needs a policy clause or coverage rule', whenNot: 'Claim data already contains the policy text', input: 'query: string, policy_type: string', color: '#2563EB' },
    { name: 'write_tracker', when: 'Classification is confirmed with confidence ≥ 0.85', whenNot: 'Confidence < 0.85 or user is still exploring', input: 'claim_id, category, confidence: number', color: '#0F766E' },
  ] : [
    { name: 'get_exception_data', when: 'User asks about a specific exception or account', whenNot: 'User wants a general report or trend', input: 'account_id: string', color: '#7C3AED' },
    { name: 'send_email', when: 'Escalation is confirmed and recipient is specified', whenNot: 'Draft not approved or recipient unclear', input: 'to: string, subject: string, body: string', color: '#2563EB' },
    { name: 'escalate_to_manager', when: 'SLA breach confirmed AND standard path exhausted', whenNot: 'Exception is within SLA or first contact', input: 'exception_id, reason: string', color: '#DC2626' },
  ];
  return (
    <div style={{ background: '#0D1117', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8B949E', marginBottom: '14px' }}>TOOL REGISTRY — DESCRIPTION IS THE AGENT&apos;S DECISION RULE</div>
      <div style={{ display: 'grid', gap: '10px' }}>
        {tools.map((t) => (
          <div key={t.name} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${t.color}25`, borderRadius: '8px', padding: '12px 14px', borderLeft: `3px solid ${t.color}` }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: t.color, marginBottom: '6px' }}>{t.name}()</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '6px' }}>
              <div>
                <div style={{ fontSize: '8px', color: '#16A34A', letterSpacing: '0.08em', marginBottom: '2px' }}>CALL WHEN</div>
                <div style={{ fontSize: '9px', color: '#9CA3AF', lineHeight: 1.5 }}>{t.when}</div>
              </div>
              <div>
                <div style={{ fontSize: '8px', color: '#DC2626', letterSpacing: '0.08em', marginBottom: '2px' }}>DO NOT CALL WHEN</div>
                <div style={{ fontSize: '9px', color: '#9CA3AF', lineHeight: 1.5 }}>{t.whenNot}</div>
              </div>
            </div>
            <div style={{ fontSize: '9px', color: '#6B7280' }}>Input: <span style={{ color: '#A78BFA' }}>{t.input}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReActTraceCard = ({ track }: { track: GenAITrack }) => {
  const steps = track === 'tech' ? [
    { type: 'REASON', text: 'User asked about claim CLM-4412. I need to fetch claim data first before I can classify or answer.', color: '#7C3AED' },
    { type: 'ACT', text: 'get_claim_data(claim_id="CLM-4412")', color: '#F59E0B' },
    { type: 'OBS', text: 'Returns: {category: "pharmacy", policy_code: "4.2c", status: "disputed", amount: 1840}', color: '#059669' },
    { type: 'REASON', text: 'Claim is a pharmacy dispute. Policy code 4.2c is in the amendment — I should verify the current clause before classifying.', color: '#7C3AED' },
    { type: 'ACT', text: 'query_policy_db(query="clause 4.2c pharmacy override", policy_type="amendment")', color: '#F59E0B' },
    { type: 'OBS', text: 'Returns: {clause: "4.2c", permits: "Tier 2 CA override", effective: "2022-02-01"}', color: '#059669' },
    { type: 'REASON', text: 'Claim qualifies for override under §4.2c. Confidence: high. I can now write the classification.', color: '#7C3AED' },
  ] : [
    { type: 'REASON', text: 'User asked for the highest-priority exception. I need to fetch exception data for the specified account first.', color: '#7C3AED' },
    { type: 'ACT', text: 'get_exception_data(account_id="northstar-west")', color: '#F59E0B' },
    { type: 'OBS', text: 'Returns: [{id: 4412, days_open: 6, sla: 5}, {id: 4419, days_open: 2}, {id: 4433, days_open: 1}]', color: '#059669' },
    { type: 'REASON', text: 'Exception 4412 is 1 day over SLA — highest priority. Should I also check escalation history before recommending action?', color: '#7C3AED' },
    { type: 'ACT', text: 'get_exception_data(account_id="northstar-west", exception_id=4412, include_history=true)', color: '#F59E0B' },
    { type: 'OBS', text: 'Returns: {escalations: [], last_contact: "2026-03-08", notes: "awaiting docs from insured"}', color: '#059669' },
    { type: 'REASON', text: 'No prior escalations, last contact 5 days ago. Standard first escalation is appropriate.', color: '#7C3AED' },
  ];
  return (
    <div style={{ background: '#0D1117', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8B949E', marginBottom: '14px' }}>ReAct PATTERN — REASON → ACT → OBSERVE → REPEAT</div>
      <div style={{ display: 'grid', gap: '6px' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <div style={{ minWidth: '52px', padding: '2px 6px', background: `${s.color}15`, border: `1px solid ${s.color}30`, borderRadius: '4px', fontSize: '8px', fontWeight: 700, color: s.color, textAlign: 'center' as const, flexShrink: 0 }}>{s.type}</div>
            <div style={{ fontSize: '10px', color: s.type === 'ACT' ? '#F59E0B' : s.type === 'OBS' ? '#6EE7B7' : '#C9D1D9', lineHeight: 1.5, fontStyle: s.type === 'REASON' ? 'italic' : 'normal' }}>{s.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RAGPipelineCard = ({ track }: { track: GenAITrack }) => {
  const query = track === 'tech' ? 'Does Plan B Tier 2 cover physician overrides?' : 'What is the SLA for Northstar West escalations?';
  const retrieved = track === 'tech' ? ['§4.2c: Tier 2 CA override permitted... (score: 0.91)', '§3.1: Standard pharmacy benefit schedule... (score: 0.84)', '§4.2b: Tier 1 physician override rules... (score: 0.79)'] : ['Northstar SLA policy v2: escalation SLA is 5 business days... (score: 0.93)', 'Escalation matrix 2026: West region contact: ops-lead@ns... (score: 0.87)', 'Exception handling guide §2: SLA breach triggers manager... (score: 0.82)'];
  return (
    <div style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: '12px', padding: '20px 24px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.14em', color: '#78716C', marginBottom: '14px' }}>RAG PIPELINE — QUERY → EMBED → RETRIEVE → GROUND → GENERATE</div>
      <div style={{ display: 'grid', gap: '8px' }}>
        {[
          { step: '1. QUERY', content: query, color: '#7C3AED', bg: 'rgba(124,58,237,0.06)' },
          { step: '2. EMBED', content: 'query → vector [0.21, -0.84, 0.53, … 1536 dims]', color: '#2563EB', bg: 'rgba(37,99,235,0.06)' },
          { step: '3. RETRIEVE (top-3)', content: retrieved, color: '#0891B2', bg: 'rgba(8,145,178,0.06)' },
          { step: '4. GROUND', content: 'System: "Answer using ONLY the provided documents. If the answer is not in the documents, say: I don\'t have that information."', color: '#0F766E', bg: 'rgba(15,118,110,0.06)' },
          { step: '5. GENERATE', content: track === 'tech' ? 'Yes — §4.2c (amendment, Feb 2022) permits Tier 2 physician overrides for CA-based plans. This applies to Plan B.' : 'SLA for Northstar West escalations is 5 business days (Northstar SLA policy v2). A breach triggers manager-level escalation per §2 of the exception guide.', color: '#16A34A', bg: 'rgba(22,163,74,0.06)' },
        ].map((s) => (
          <div key={s.step} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '10px', alignItems: 'start' }}>
            <div style={{ padding: '4px 8px', background: s.bg, border: `1px solid ${s.color}30`, borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: s.color, textAlign: 'center' as const }}>{s.step}</div>
            <div style={{ fontSize: '10px', color: '#44403C', lineHeight: 1.5, background: '#fff', border: '1px solid #E7E5E4', borderRadius: '6px', padding: '6px 10px' }}>
              {Array.isArray(s.content) ? s.content.map((c, i) => <div key={i} style={{ marginBottom: i < s.content.length - 1 ? '3px' : 0 }}>{c}</div>) : s.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TokenCostCard = ({ track }: { track: GenAITrack }) => {
  const rows = track === 'tech' ? [
    { id: 'run-001', model: 'claude-3-5-sonnet', in: 1240, out: 380, tools: 2, cost: '$0.018' },
    { id: 'run-002', model: 'claude-3-5-sonnet', in: 8920, out: 2100, tools: 11, cost: '$0.134', flag: true },
    { id: 'run-003', model: 'claude-3-5-sonnet', in: 1180, out: 340, tools: 2, cost: '$0.017' },
    { id: 'run-004', model: 'claude-3-5-sonnet', in: 1310, out: 410, tools: 3, cost: '$0.020' },
  ] : [
    { id: 'run-001', model: 'claude-3-5-sonnet', in: 980, out: 290, tools: 1, cost: '$0.013' },
    { id: 'run-002', model: 'claude-3-5-sonnet', in: 1100, out: 320, tools: 1, cost: '$0.015' },
    { id: 'run-003', model: 'claude-3-5-sonnet', in: 6840, out: 1900, tools: 7, cost: '$0.103', flag: true },
    { id: 'run-004', model: 'claude-3-5-sonnet', in: 990, out: 300, tools: 1, cost: '$0.014' },
  ];
  const flagged = rows.find(r => r.flag);
  return (
    <div style={{ background: '#172B4D', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8993A4' }}>PER-RUN TOKEN LOG — COST ATTRIBUTION & ANOMALY DETECTION</div>
        <div style={{ fontSize: '9px', color: '#F59E0B', background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: '4px' }}>1 anomaly flagged</div>
      </div>
      <div style={{ overflowX: 'auto' as const }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #253858' }}>
              {['run_id', 'model', 'in_tokens', 'out_tokens', 'tool_calls', 'cost'].map(h => (
                <th key={h} style={{ padding: '4px 8px', textAlign: 'left' as const, color: '#8993A4', fontWeight: 600, fontSize: '9px', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #1E3A5F', background: r.flag ? 'rgba(245,158,11,0.06)' : 'transparent' }}>
                <td style={{ padding: '6px 8px', color: r.flag ? '#F59E0B' : '#C1C7D0' }}>{r.id}{r.flag ? ' ⚑' : ''}</td>
                <td style={{ padding: '6px 8px', color: '#8993A4', fontSize: '9px' }}>{r.model}</td>
                <td style={{ padding: '6px 8px', color: r.flag ? '#F59E0B' : '#C1C7D0' }}>{r.in.toLocaleString()}</td>
                <td style={{ padding: '6px 8px', color: r.flag ? '#F59E0B' : '#C1C7D0' }}>{r.out.toLocaleString()}</td>
                <td style={{ padding: '6px 8px', color: r.flag ? '#DC2626' : '#C1C7D0', fontWeight: r.flag ? 700 : 400 }}>{r.tools}</td>
                <td style={{ padding: '6px 8px', color: r.flag ? '#F59E0B' : '#C1C7D0', fontWeight: r.flag ? 700 : 400 }}>{r.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '10px', padding: '8px 10px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '6px', fontSize: '9px', color: '#D97706' }}>
        {flagged?.id} used {flagged?.tools}× tool calls vs avg 1–3. Input tokens {(flagged?.in ?? 0).toLocaleString()} vs avg ~1,100. Investigate: agent in a tool-calling loop?
      </div>
    </div>
  );
};

// ── End M6 TiltCard Mockups ───────────────────────────────────────────────────

function CoreContent({ track }: { track: GenAITrack }) {
  return (
    <>
      {/* Module Hero */}
      <div style={{ background: 'var(--ed-cream)', borderRadius: '14px', padding: '36px 36px 28px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-12px', top: '-8px', fontSize: '140px', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.05)`, fontFamily: "'Lora','Georgia',serif", letterSpacing: '-0.04em', userSelect: 'none' as const, pointerEvents: 'none' as const }}>06</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '10px', textTransform: 'uppercase' as const }}>GenAI Launchpad · Pre-Read 06</div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.025em', color: 'var(--ed-ink)', marginBottom: '10px', fontFamily: "'Lora', Georgia, serif" }}>AI Agent Workflows — Building & Scaling</h1>
          <p style={{ fontSize: '15px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '28px' }}>&ldquo;An agent you can&apos;t observe is a liability. An agent you can observe is infrastructure.&rdquo;</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const, marginBottom: '24px' }}>
            <div style={{ background: `rgba(${ACCENT_RGB},0.08)`, border: `1.5px solid rgba(${ACCENT_RGB},0.3)`, borderRadius: '10px', padding: '14px 16px', flex: '1.5', minWidth: '180px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                {track === 'tech' ? <AaravFace size={44} /> : <RheaFace size={44} />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: ACCENT }}>{track === 'tech' ? 'Aarav' : 'Rhea'}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.04em' }}>{track === 'tech' ? 'Platform Engineer · Northstar Health' : 'Operations Lead · Northstar Health'}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: ACCENT, background: `rgba(${ACCENT_RGB},0.1)`, padding: '2px 7px', borderRadius: '4px', letterSpacing: '0.06em' }}>PROTAGONIST</div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{track === 'tech' ? "Five workflows in production. Three are now complex enough that 'workflow' is the wrong word. They branch based on intermediate results, call multiple services, and hold state. Time to think in agents." : "Four automations running. The director wants a system that can answer questions about renewals, send targeted reminders, and escalate edge cases — all from one interface. Rhea needs to understand what an agent actually is."}</div>
            </div>
            {([
              { name: 'Anika', role: 'AI Workflow Strategist',  desc: 'Asks whether the task needs a decision at each step before recommending an agent.', color: '#7C3AED', mentorId: 'anika' as GenAIMentorId },
              { name: 'Rohan', role: 'Automation Engineer',     desc: 'Instruments every agent run with per-call token and tool-use logging.', color: '#2563EB', mentorId: 'rohan' as GenAIMentorId },
              { name: 'Leela', role: 'Risk & Compliance',       desc: 'Asks what the agent does when retrieval fails before calling it production-ready.', color: '#C2410C', mentorId: 'leela' as GenAIMentorId },
            ]).map(m => (
              <div key={m.name} style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '12px 14px', flex: '1', minWidth: '130px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <GenAIMentorFace mentor={m.mentorId} size={34} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '12px', color: m.color, lineHeight: 1.2 }}>{m.name}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.03em' }}>{m.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{m.desc}</div>
              </div>
            ))}
          </div>
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

      {/* ── Section 1: Agent Architecture ── */}
      <ChapterSection id="genai-m6-architecture" num="01" accentRgb={ACCENT_RGB} first>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
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
          question={track === 'tech'
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
        <TiltCard style={{ margin: '28px 0' }}><AgentArchCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech'
          ? "List 3 tasks you have automated or are considering. For each, answer: does the sequence of steps change based on intermediate results? Mark each as 'chain' or 'agent'. Build a chain for one of the chain tasks before touching agent architecture."
          : "List 3 automation tasks relevant to your role. For each: does the task need to make decisions mid-run based on what it finds, or does it follow the same steps every time? Mark each chain vs. agent. This is your decision framework."} />
      </ChapterSection>

      {/* ── Section 2: Tool Use & Integrations ── */}
      <ChapterSection id="genai-m6-tools" num="02" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
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
          question={track === 'tech'
            ? "A lookup_policy tool with description 'Looks up policy information' is called by the agent even when the user asks about claim status. What is the fix?"
            : "Rhea's agent has a Create_Report tool described as 'Creates a report.' It generates reports in every conversation. What is the minimum change needed?"}
          options={[
            { text: "Rename the tool to make its purpose clearer", correct: false, feedback: "The name alone doesn't provide decision constraints to the model." },
            { text: track === 'tech' ? "Add to the description: 'Call this when the user asks about coverage rules, benefit limits, or policy definitions. Do not call for questions about specific claims, status, or processing.'" : "Add to the description: 'Only call when the user explicitly requests a report be generated. Do not call for questions, summaries, or routine responses.'", correct: true, feedback: "Correct. Adding when-to-call and when-not-to-call constraints gives the model a decision boundary." },
            { text: "Remove the tool and replace with a more specific one", correct: false, feedback: "The tool may be correct — the description is what needs work." },
            { text: "Add a human approval step before every tool call", correct: false, feedback: "Human approval is an escalation mechanism, not a fix for a vague tool description." },
          ]}
          conceptId="genai-m6-tools"
        />
        <TiltCard style={{ margin: '28px 0' }}><ToolRegistryCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech'
          ? "Take one tool in your agent. Rewrite its description to include: what it does, when to call it, when NOT to call it, and expected input format. Test: give the agent a prompt where the tool should NOT fire. Verify the new description prevents the call."
          : "List the tools in your agent or planned agent. For each, write a one-sentence 'when to call' and a one-sentence 'when NOT to call.' These two sentences are the minimum for a useful tool description."} />
      </ChapterSection>

      {/* ── Section 3: Multi-Step Reasoning ── */}
      <ChapterSection id="genai-m6-reasoning" num="03" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
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
          question={track === 'tech'
            ? "Aarav's agent is asked to rank claims by risk score. It returns a ranked list. The ranking appears wrong. What is the most reliable diagnostic first step?"
            : "Rhea's agent makes a recommendation to escalate an account. She needs to explain the reasoning to her director. What should she add to the agent's prompt?"}
          options={[
            { text: track === 'tech' ? "Switch to a more powerful model for better reasoning" : "Ask the agent to provide a confidence score alongside the recommendation", correct: false, feedback: "Model choice and confidence scores don't expose the reasoning chain." },
            { text: track === 'tech' ? "Add a scratchpad instruction: 'Before ranking, write your reasoning for each claim's risk score'" : "Add to the system prompt: 'Before making a recommendation, write one sentence explaining the specific reason for each account you consider escalating'", correct: true, feedback: "Correct. Visible intermediate reasoning makes the ranking/recommendation auditable and debuggable." },
            { text: track === 'tech' ? "Log the tool call inputs and outputs to check for data issues" : "Request a written report from the agent after every recommendation", correct: false, feedback: "Logging and reports are useful but don't expose the in-context reasoning." },
            { text: track === 'tech' ? "Add a verification tool that checks the ranking against a known baseline" : "Have a human reviewer sign off on all recommendations", correct: false, feedback: "Verification and human review are downstream controls, not diagnostic tools." },
          ]}
          conceptId="genai-m6-reasoning"
        />
        <TiltCard style={{ margin: '28px 0' }}><ReActTraceCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech'
          ? "Take an agent that makes a ranking or classification decision. Add a scratchpad instruction to its system prompt. Run it on 5 test cases. Read the scratchpad output. Identify one case where the reasoning reveals a gap in the tool's data or the prompt's framing."
          : "Take a recommendation your agent makes. Add a one-sentence-per-item reasoning requirement to the system prompt. Run it on 3 test cases. Could you explain each recommendation to a stakeholder? If not, the prompt needs more specificity."} />
      </ChapterSection>

      {/* ── Section 4: RAG in Agent Workflows ── */}
      <ChapterSection id="genai-m6-rag" num="04" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
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
          question={track === 'tech'
            ? "Aarav's RAG agent retrieves 3 documents with similarity scores of 0.91, 0.88, and 0.72. The 0.72 document contains an irrelevant excerpt from an old policy version. What is the immediate fix?"
            : "Rhea's RAG chatbot confidently answers a question about a benefit that was discontinued last year. The correct policy documents do not mention this benefit. What is the root cause?"}
          options={[
            { text: track === 'tech' ? "Increase the threshold to 0.85 to exclude the 0.72 document" : "Remove the outdated policy documents from the document corpus", correct: false, feedback: "Partial fix only — threshold tuning and corpus hygiene are maintenance tasks, not the root cause fix." },
            { text: track === 'tech' ? "The similarity threshold is too low — also add a reranking step to evaluate semantic relevance, not just vector distance" : "The grounding instruction is missing — the model is generating the answer from training data, not from retrieved documents", correct: true, feedback: "Correct. Threshold adjustment helps retrieval; reranking improves precision. For the non-tech case, the model is generating from memory, not from context — the grounding instruction prevents this." },
            { text: track === 'tech' ? "Use a more recent embedding model with better domain understanding" : "Increase the number of documents retrieved from 3 to 5", correct: false, feedback: "Embedding model choice and retrieval count are not the root cause in these scenarios." },
            { text: track === 'tech' ? "The top 2 documents are sufficient — remove the third from the context" : "Add a disclaimer to all chatbot answers about policy accuracy", correct: false, feedback: "These are workarounds, not fixes." },
          ]}
          conceptId="genai-m6-rag"
        />
        <TiltCard style={{ margin: '28px 0' }}><RAGPipelineCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech'
          ? "Build a minimal RAG flow: HTTP trigger → embedding lookup → top-3 retrieval → grounded response. Test with: 1) a question answerable from docs, 2) a question NOT in the docs. Verify the second returns 'I don't have that information' — not a hallucinated answer."
          : "Identify one knowledge base your team relies on (policy docs, procedure guides, FAQs). Design a RAG flow for it: what gets chunked, what gets embedded, what threshold for retrieval. Then write the grounding prompt instruction. Start there before building anything."} />
      </ChapterSection>

      {/* ── Section 5: Scale & Observability ── */}
      <ChapterSection id="genai-m6-scale" num="05" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
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
          question={track === 'tech'
            ? "Aarav adds per-run logging: model, input tokens, output tokens, tool calls. After a week, he finds one workflow consumes 60% of total tokens. What is the most productive next step?"
            : "Rhea's structured logs show the escalation email tool was called 47 times in one month. 12 of those calls were for the same account. What should she investigate?"}
          options={[
            { text: track === 'tech' ? "Switch the workflow to a cheaper model immediately" : "Disable the escalation tool for that account", correct: false, feedback: "Acting before diagnosing is premature optimization." },
            { text: track === 'tech' ? "Examine that workflow's tool calls per run — is it making more tool calls than expected, or using a larger context than necessary?" : "Read the 12 log entries for that account: what triggered each escalation, what data was passed, was each escalation legitimate or a false positive?", correct: true, feedback: "Correct. Structured logs exist to enable exactly this kind of behavioral audit. Read before acting." },
            { text: track === 'tech' ? "Increase the token budget for that workflow since it's clearly more complex" : "Set a per-account escalation limit to prevent repeat triggers", correct: false, feedback: "Increasing budget or adding limits without understanding the root cause doesn't fix the underlying issue." },
            { text: track === 'tech' ? "Split the workflow into two smaller workflows to distribute the token load" : "Ask the account manager if the escalations were expected", correct: false, feedback: "Structural changes and manual investigation are premature before reading the available log data." },
          ]}
          conceptId="genai-m6-scale"
        />
        <TiltCard style={{ margin: '28px 0' }}><TokenCostCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech'
          ? "Add a logging step to your most complex agent workflow. Log: model, input tokens, output tokens, tool calls list. Run it 10 times on varied inputs. Build a simple view of the logs (a Google Sheet is fine). Identify the run with the highest token count — read its tool call list."
          : "Add a tool call log to your most-used agent workflow: tool name, timestamp, trigger condition, output summary. Run for one week. At the end of the week, answer: which tool was called most often, and were all those calls justified?"} />
        <NextChapterTeaser text="Module 07 covers Model Context Protocol (MCP) — the emerging standard for connecting AI models to tools, data sources, and services in a way that is composable, auditable, and model-agnostic." />
      </ChapterSection>
    </>
  );
}

export default function GenAIPreRead6({ track, onBack }: Props) {
  const store = useLearnerStore();
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const prevXpRef = useRef(0);

  useEffect(() => {
    store.initSession();
    CONCEPTS.forEach(c => store.ensureConceptState(c.id));
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.querySelector(`[data-section="${id}"]`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
            const t = setTimeout(() => {
              store.markSectionViewed(id);
              setCompletedSections(prev => new Set([...prev, id]));
            }, 150);
            timers.push(t);
          }
        },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach(o => o.disconnect());
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  const progressPct = Math.round((completedSections.size / SECTIONS.length) * 100);
  const xp = computeXP(completedSections, store.conceptStates);

  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)' }}>
      {/* Top Nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--ed-card)', borderBottom: '1px solid var(--ed-rule)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px', height: '56px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ed-ink3)', fontSize: '13px', fontFamily: 'inherit', padding: '4px 0', flexShrink: 0 }}>
            ← Back
          </button>
          <div style={{ width: '1px', height: '20px', background: 'var(--ed-rule)', flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: `linear-gradient(135deg, ${ACCENT} 0%, #4F46E5 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>GenAI Launchpad</span>
            <span style={{ color: 'var(--ed-rule)', fontSize: '12px' }}>›</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink2)', letterSpacing: '0.08em' }}>Pre-Read 06 · AI Agent Workflows</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ width: '180px', height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div style={{ height: '100%', background: ACCENT }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)', minWidth: '28px' }}>{progressPct}%</span>
          </div>
        </div>
      </div>

      {/* 3-column grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px minmax(0,1fr) 240px', gap: '40px', paddingTop: '36px' }}>
          <LeftNav completedSections={completedSections} activeSection={activeSection} />
          <main>
            <CoreContent track={track} />
          </main>
          <Sidebar completedSections={completedSections} progressPct={progressPct} prevXp={prevXpRef.current} />
        </div>
      </div>

      {/* Completion card */}
      <AnimatePresence>
        {progressPct >= 80 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 50, background: 'var(--ed-card)', border: `2px solid ${ACCENT}`, borderRadius: '14px', padding: '20px 24px', maxWidth: '320px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ fontSize: '24px', marginBottom: '8px', display: 'inline-block' }}
            >&#9678;</motion.div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '6px' }}>Pre-Read 06 Complete</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '8px', fontFamily: "'Lora', serif" }}>
              {track === 'tech' ? 'You can architect, instrument, and scale agents.' : 'Agents, tools, retrieval, and observability — connected.'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
              {track === 'tech'
                ? "Agent architecture, tool design, multi-step reasoning, RAG pipelines, and structured observability. Module 07 introduces MCP — the protocol layer that makes this composable across tools and models."
                : "You can now evaluate whether a task needs an agent, design the tools it uses, ground it in retrieved knowledge, and log what it does. Module 07 introduces MCP — connecting agents to the services they need."}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

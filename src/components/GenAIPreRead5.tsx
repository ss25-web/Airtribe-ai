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

const ACCENT = '#059669';
const ACCENT_RGB = '5,150,105';
const MODULE_NUM = '05';

const CONCEPTS = [
  { id: 'genai-m5-loops',     label: 'Loops & Batching',     color: '#059669' },
  { id: 'genai-m5-transforms',label: 'Data Transforms',      color: '#0891B2' },
  { id: 'genai-m5-routing',   label: 'Conditional Routing',  color: '#7C3AED' },
  { id: 'genai-m5-hitl',      label: 'Human-in-the-Loop',    color: '#C2410C' },
  { id: 'genai-m5-agents',    label: 'Memory & Chat Agents', color: '#2563EB' },
];

const SECTIONS = [
  { id: 'genai-m5-loops',      label: '1. Loops & Iteration' },
  { id: 'genai-m5-transforms', label: '2. Data Transforms' },
  { id: 'genai-m5-routing',    label: '3. Conditional Routing' },
  { id: 'genai-m5-hitl',       label: '4. Human-in-the-Loop' },
  { id: 'genai-m5-agents',     label: '5. Memory & Chat Agents' },
];

const BADGES = [
  { id: 'genai-m5-loops',      icon: 'LP', label: 'Loop Thinker',    color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'genai-m5-transforms', icon: 'TX', label: 'Data Shaper',     color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
  { id: 'genai-m5-routing',    icon: 'RT', label: 'Route Planner',   color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'genai-m5-hitl',       icon: 'HL', label: 'Gate Keeper',     color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
  { id: 'genai-m5-agents',     icon: 'AG', label: 'Agent Builder',   color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
];

const QUIZZES = [
  {
    conceptId: 'genai-m5-loops',
    question: {
      tech: "Aarav's SplitInBatches workflow processes 200 claims in batches of 10. After the batch loop, a Merge node combines all results. The first 10 claims process fine. Batches 2–20 produce empty outputs. What is the most likely cause?",
      'non-tech': "Rhea's weekly report workflow loops over 50 policy renewals and appends each to a Google Sheet. The workflow completes successfully but the sheet has only 1 row. What is the most likely design error?",
    },
    options: {
      tech: [
        'A. The AI node rate-limits after 10 requests — add a wait node between batches',
        'B. The SplitInBatches node is set to "once" mode — it only passes the first batch downstream before stopping',
        'C. The Merge node is misconfigured — it collects only the first batch and discards the rest',
        'D. The n8n execution limit caps at 10 batch iterations by default',
      ],
      'non-tech': [
        'A. The Google Sheets API rate-limits on the first write and silently drops the rest',
        'B. The loop node is set to append mode but the sheet column mapping overrides the previous row each time',
        'C. The workflow is writing all 50 rows but to a different sheet tab',
        'D. The loop runs once for the first item — the node connecting into the loop is not set to iterate',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 3 },
    explanation: {
      tech: "SplitInBatches has two execution modes. In 'once' mode it outputs the first batch and stops — the loop only continues when connected back to itself with the 'has items' output. The feedback edge to the batch node is required for multi-batch processing.",
      'non-tech': "The loop node only iterates if it receives an array and is set to process each item. A node that receives an array but has no iteration configured processes the first item and ends. Check the node's item-processing mode before assuming data volume is the problem.",
    },
    keyInsight: "A loop that runs once is not a loop — it is a node with extra steps. Verify the iteration feedback edge and the node's processing mode before testing at scale.",
  },
  {
    conceptId: 'genai-m5-transforms',
    question: {
      tech: "Aarav receives claims from two sources: API A returns `{ claimId, amount, status }` and API B returns `{ id, value, state }`. The downstream classifier expects `{ claim_id, amount, status }`. What is the correct approach?",
      'non-tech': "Rhea's workflow merges data from Google Sheets (column: 'Policy Number') and a webhook (field: 'policyNum'). The merge step finds zero matches. What is the root cause?",
    },
    options: {
      tech: [
        'A. Write two separate workflows — one per API — and merge downstream',
        'B. Add a Set node after each source that maps to the canonical schema before the merge point',
        'C. Use a Function node with a try/catch to handle both formats dynamically',
        'D. Add field aliases in the classifier prompt so it accepts both formats',
      ],
      'non-tech': [
        'A. The merge node is matching on the wrong key — it defaults to the first field, not the intended identifier',
        'B. The Google Sheets field name and the webhook field name are different strings — the merge node has no match to join on',
        'C. Google Sheets returns all fields as strings — the webhook returns numbers, so the types do not match',
        'D. The merge node requires both sources to have identical schema — this design is not supported',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 1 },
    explanation: {
      tech: "Normalizing to a canonical schema at the earliest point — right after each source — keeps all downstream nodes identical and testable. One normalization Set node per source is cleaner and safer than dynamic handling downstream.",
      'non-tech': "The merge node joins on matching field names. 'Policy Number' ≠ 'policyNum'. Rename one before the merge step — a Set node renames the field to match the other source. Field name mismatches are the most common merge failure.",
    },
    keyInsight: "Normalize data to a canonical schema at the source, not at the consumer. Every node downstream becomes simpler when the shape is consistent from the start.",
  },
  {
    conceptId: 'genai-m5-routing',
    question: {
      tech: "The AI classifier returns a confidence field: 0.0–1.0. Aarav routes claims above 0.85 to auto-process, 0.5–0.85 to human review, below 0.5 to rejection queue. After two weeks, 60% of claims are in human review. What should he investigate first?",
      'non-tech': "Rhea's workflow sends policy renewals to one of three teams based on policy type. After a week, Team C reports receiving renewals that should go to Team A. What is the most productive first diagnostic step?",
    },
    options: {
      tech: [
        'A. Lower the auto-process threshold to 0.75 to reduce the human review queue',
        'B. Audit the actual confidence score distribution — if 60% of claims cluster between 0.5–0.85, the threshold is set wrong or the classifier needs retraining',
        'C. Add a fourth route for claims between 0.75–0.85 to reduce decision fatigue',
        'D. Switch from a confidence threshold to a fixed classification label',
      ],
      'non-tech': [
        'A. Ask Team C to forward the misrouted renewals to Team A and monitor for recurrence',
        'B. Check the If/Switch node conditions — print the exact values being evaluated and compare to the conditions written',
        'C. Re-run the workflow on last week\'s data to reproduce the error',
        'D. Add a logging node after the routing step to capture which route each renewal takes',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 1 },
    explanation: {
      tech: "Before adjusting thresholds, audit the distribution. If most claims genuinely cluster in the mid-range, the problem is classifier calibration — not threshold tuning. Adjusting thresholds without understanding the distribution is guessing.",
      'non-tech': "Routing bugs are almost always a mismatch between the value being evaluated and the condition written. Print the actual runtime value before diagnosing further. The condition may be checking the wrong field, or the value format may not match what you expect.",
    },
    keyInsight: "Before tuning a routing condition, audit what values are actually arriving at the router. Most routing bugs are data shape or field name errors — not logic errors.",
  },
  {
    conceptId: 'genai-m5-hitl',
    question: {
      tech: "Aarav adds a Wait node to pause the workflow until a Slack approver clicks 'Approve.' The workflow runs but the Wait node times out after 5 minutes. The approver received the Slack message but never saw a button. What is the issue?",
      'non-tech': "Rhea's approval flow sends an email to a manager and waits for a reply. After two days, the manager replies 'Approved' but the workflow never continues. What is the most likely design gap?",
    },
    options: {
      tech: [
        'A. The Slack node does not support interactive components — use a webhook-based approval flow instead',
        'B. The Wait node is configured to resume on webhook call, but the Slack message was sent as plain text — the interactive button payload that calls the webhook was not added to the Slack message node',
        'C. The timeout is set too short — increase it to 30 minutes',
        'D. The approver needs to be added to the n8n workspace to interact with workflows',
      ],
      'non-tech': [
        'A. Email reply text is not parsed by n8n — the workflow needs an email trigger watching for a specific subject line or a structured response link',
        'B. The manager replied to the wrong email thread',
        'C. n8n does not support email-based approval flows — use Slack or a web form instead',
        'D. The Wait node expired before the manager replied — re-trigger the workflow',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 0 },
    explanation: {
      tech: "The Wait node resumes when it receives a webhook callback. The Slack message must include an interactive block (button) whose action URL points to the Wait node's webhook endpoint. Sending plain text to Slack and expecting it to trigger the Wait node is a missing connection.",
      'non-tech': "n8n's Wait node resumes on a webhook call — it cannot parse free-text email replies. Email-based approvals require either a structured link in the email body (the approver clicks it, which calls the webhook) or a form-based flow. Free-text reply parsing is not supported natively.",
    },
    keyInsight: "Human-in-the-loop means the human interacts with a structured mechanism — a link, a button, a form. Free-text replies cannot resume a Wait node. Design the approval interface before designing the workflow.",
  },
  {
    conceptId: 'genai-m5-agents',
    question: {
      tech: "Aarav builds a chat agent for internal claims queries. After 10 messages, the agent starts forgetting context from the first 3 exchanges. The Window Buffer Memory is set to 10. What is happening?",
      'non-tech': "Rhea deploys a policy FAQ chatbot with memory. After a few days, users report the bot sometimes confuses two different users' questions in a single session. What is the most likely configuration error?",
    },
    options: {
      tech: [
        'A. The model context window is smaller than 10 exchanges — reduce the buffer size',
        'B. Window Buffer Memory stores the last N messages — message 11 pushes message 1 out of the buffer. The agent has no long-term memory of exchanges beyond the window',
        'C. The agent node needs to be restarted after 10 exchanges to clear the buffer',
        'D. The memory node is not connected correctly — it is storing tokens, not messages',
      ],
      'non-tech': [
        'A. The chatbot is using a shared session ID — all users are writing to the same conversation memory',
        'B. The Window Buffer Memory is too large and is mixing context from different conversations',
        'C. The model is hallucinating cross-user data — switch to a more accurate model',
        'D. The chatbot needs a login system before memory can work correctly',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 0 },
    explanation: {
      tech: "Window Buffer Memory is a sliding window — the oldest message drops when the window is full. This is by design. For tasks requiring recall beyond the window, use a summary memory or a vector-store-backed memory that persists key facts separately from the conversation buffer.",
      'non-tech': "Session IDs are how n8n's memory nodes separate conversations. If every user hits the same fixed session ID, they all share one memory store — each message appends to everyone's context. The session ID must be unique per user conversation, not hardcoded to a static value.",
    },
    keyInsight: "Memory without session isolation is shared state. Always trace the session ID through the workflow — a static session ID means all users share the same memory.",
  },
];

const SECTION_XP = 50;
const QUIZ_XP = 100;

const TRACK_META: Record<GenAITrack, { label: string; introTitle: string; moduleContext: string }> = {
  'non-tech': {
    label: 'Workflow & Operator Track',
    introTitle: 'Advanced n8n · Operator Lens',
    moduleContext: `GenAI Launchpad · Non-Tech Track · Pre-Read 05 · Advanced n8n: Loops, Transforms & AI Agents. Follows Rhea, operations lead at Northstar Health, as she moves from single-run workflows to systems that iterate, branch, wait for human input, and hold conversation context across sessions.`,
  },
  tech: {
    label: 'Tech Builder Track',
    introTitle: 'Advanced n8n · Builder Lens',
    moduleContext: `GenAI Launchpad · Tech Track · Pre-Read 05 · Advanced n8n: Loops, Transforms & AI Agents. Follows Aarav, platform engineer at Northstar Health, as he upgrades the claims automation from a single-pass pipeline to a looping, branching, memory-enabled system that handles real-world data volume and complexity.`,
  },
};

type Props = { track: GenAITrack; onBack: () => void };

function computeXP(completedSections: Set<string>, conceptStates: Record<string, { pKnow: number }>) {
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = Object.values(conceptStates).reduce((sum, s) => sum + Math.round(s.pKnow * QUIZ_XP), 0);
  return { readingXP, quizXP, total: readingXP + quizXP };
}

function getLevel(total: number) {
  if (total >= 600) return { label: 'Builder',  color: '#059669', min: 600 };
  if (total >= 350) return { label: 'Operator', color: '#2563EB', min: 350 };
  if (total >= 150) return { label: 'Explorer', color: '#059669', min: 150 };
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

// ── M5 TiltCard Mockups ──────────────────────────────────────────────────────

const BatchSimulatorCard = ({ track }: { track: GenAITrack }) => {
  const [arraySize, setArraySize] = useState(track === 'tech' ? 20 : 50);
  const [batchSize, setBatchSize] = useState(track === 'tech' ? 5 : 10);
  const [feedbackEdge, setFeedbackEdge] = useState(false);
  const batches = Math.ceil(arraySize / batchSize);
  return (
    <div style={{ background: '#0D1117', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8B949E', marginBottom: '16px' }}>SPLITINBATCHES — BATCH SIMULATOR</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '9px', color: '#8B949E', marginBottom: '6px' }}>ARRAY SIZE: <span style={{ color: '#C9D1D9', fontWeight: 700 }}>{arraySize} items</span></div>
          <input type="range" min={10} max={track === 'tech' ? 50 : 100} value={arraySize} onChange={e => setArraySize(+e.target.value)} style={{ width: '100%', accentColor: '#059669' }} />
        </div>
        <div>
          <div style={{ fontSize: '9px', color: '#8B949E', marginBottom: '6px' }}>BATCH SIZE: <span style={{ color: '#C9D1D9', fontWeight: 700 }}>{batchSize} items</span></div>
          <input type="range" min={2} max={20} value={batchSize} onChange={e => setBatchSize(+e.target.value)} style={{ width: '100%', accentColor: '#059669' }} />
        </div>
      </div>
      <div style={{ marginBottom: '16px', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: `2px solid ${feedbackEdge ? 'rgba(5,150,105,0.4)' : 'rgba(220,38,38,0.3)'}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setFeedbackEdge(f => !f)}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: feedbackEdge ? '#6EE7B7' : '#FCA5A5', marginBottom: '2px' }}>Feedback Edge (↺ has_items → self): {feedbackEdge ? 'CONNECTED' : 'DISCONNECTED'}</div>
          <div style={{ fontSize: '9px', color: '#6B7280' }}>Click to toggle</div>
        </div>
        <div style={{ width: '36px', height: '20px', borderRadius: '10px', background: feedbackEdge ? '#059669' : '#374151', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: '2px', left: feedbackEdge ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
        </div>
      </div>
      <div style={{ display: 'grid', gap: '6px', marginBottom: '14px' }}>
        {Array.from({ length: Math.min(batches, 5) }, (_, i) => {
          const start = i * batchSize + 1;
          const end = Math.min((i + 1) * batchSize, arraySize);
          const willRun = feedbackEdge || i === 0;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: willRun ? 'rgba(5,150,105,0.06)' : 'rgba(220,38,38,0.04)', border: `1px solid ${willRun ? 'rgba(5,150,105,0.2)' : 'rgba(220,38,38,0.15)'}`, borderRadius: '6px', opacity: willRun ? 1 : 0.5 }}>
              <div style={{ fontSize: '9px', color: willRun ? '#059669' : '#6B7280', width: '60px', flexShrink: 0 }}>Batch {i + 1}{batches > 5 && i === 4 ? '…' : ''}</div>
              <div style={{ fontSize: '9px', color: '#C9D1D9', flex: 1 }}>items {start}–{end}</div>
              <div style={{ fontSize: '8px', color: willRun ? '#6EE7B7' : '#EF4444' }}>{willRun ? (i < batches - 1 ? '↺ loops' : '✓ done') : '✗ skipped'}</div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: '8px 12px', background: feedbackEdge ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.08)', border: `1px solid ${feedbackEdge ? 'rgba(5,150,105,0.25)' : 'rgba(220,38,38,0.25)'}`, borderRadius: '6px', fontSize: '10px', color: feedbackEdge ? '#6EE7B7' : '#FCA5A5', fontWeight: 600 }}>
        {feedbackEdge
          ? `✓ All ${arraySize} items processed across ${batches} batches`
          : `✗ Only ${batchSize} of ${arraySize} items processed — feedback edge missing`}
      </div>
    </div>
  );
};

const FieldMapperCard = ({ track }: { track: GenAITrack }) => {
  const sourceFields = track === 'tech'
    ? ['claimID', 'subject', 'body', 'policyCode']
    : ['row_id', 'exception_date', 'Renewal Manager', 'Status', 'Notes'];
  const targetFields = track === 'tech'
    ? ['claim_id', 'policy_code', 'classification_input']
    : ['exception_id', 'date', 'manager', 'status', 'summary_input'];
  const correct: Record<string, string> = track === 'tech'
    ? { claimID: 'claim_id', policyCode: 'policy_code', subject: 'classification_input', body: 'classification_input' }
    : { row_id: 'exception_id', exception_date: 'date', 'Renewal Manager': 'manager', Status: 'status', Notes: 'summary_input' };

  const [selected, setSelected] = useState<string | null>(null);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const mapTo = (target: string) => {
    if (!selected) return;
    setMappings(m => ({ ...m, [selected]: target }));
    setSelected(null);
    setChecked(false);
  };

  const score = Object.entries(mappings).filter(([src, tgt]) => correct[src] === tgt).length;
  const total = Object.keys(correct).length;

  return (
    <div style={{ background: '#0D1117', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8B949E', marginBottom: '4px' }}>SET NODE — FIELD MAPPER</div>
      <div style={{ fontSize: '9px', color: '#6B7280', marginBottom: '16px' }}>Click a source field, then click the target field to map it.</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '9px', color: '#DC2626', letterSpacing: '0.08em', marginBottom: '8px' }}>RAW INPUT FIELDS</div>
          {sourceFields.map(f => (
            <div key={f} onClick={() => { setSelected(f === selected ? null : f); setChecked(false); }}
              style={{ marginBottom: '6px', padding: '6px 10px', background: selected === f ? 'rgba(124,58,237,0.15)' : mappings[f] ? 'rgba(5,150,105,0.06)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selected === f ? '#7C3AED' : mappings[f] ? 'rgba(5,150,105,0.25)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '5px', fontSize: '10px', color: selected === f ? '#A78BFA' : mappings[f] ? '#6EE7B7' : '#C9D1D9', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{f}</span>
              {mappings[f] && <span style={{ fontSize: '8px', color: '#6B7280' }}>→ {mappings[f]}</span>}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: '9px', color: '#16A34A', letterSpacing: '0.08em', marginBottom: '8px' }}>TARGET SCHEMA</div>
          {targetFields.map(f => {
            const isMapped = Object.values(mappings).includes(f);
            return (
              <div key={f} onClick={() => mapTo(f)}
                style={{ marginBottom: '6px', padding: '6px 10px', background: isMapped ? 'rgba(5,150,105,0.1)' : selected ? 'rgba(22,163,74,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isMapped ? 'rgba(5,150,105,0.35)' : selected ? 'rgba(22,163,74,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '5px', fontSize: '10px', color: isMapped ? '#6EE7B7' : selected ? '#4ADE80' : '#9CA3AF', cursor: selected ? 'pointer' : 'default' }}>
                {f}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div onClick={() => setChecked(true)} style={{ padding: '6px 14px', background: '#059669', borderRadius: '5px', fontSize: '10px', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Check Mappings</div>
        <div onClick={() => { setMappings({}); setSelected(null); setChecked(false); }} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '5px', fontSize: '10px', color: '#9CA3AF', cursor: 'pointer' }}>Reset</div>
      </div>
      {checked && (
        <div style={{ marginTop: '12px', padding: '10px 12px', background: score === total ? 'rgba(5,150,105,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${score === total ? 'rgba(5,150,105,0.25)' : 'rgba(245,158,11,0.25)'}`, borderRadius: '6px', fontSize: '10px', color: score === total ? '#6EE7B7' : '#FCD34D' }}>
          {score}/{total} mappings correct. {score < total ? 'Tip: look for the canonical field name the AI node expects.' : 'All fields mapped — Set node is ready.'}
        </div>
      )}
    </div>
  );
};

const RoutePredictorCard = ({ track }: { track: GenAITrack }) => {
  const items = track === 'tech' ? [
    { label: 'Claim CLM-4412', value: '0.71', key: 'confidence', correct: 'B' },
    { label: 'Claim CLM-4413', value: '0.91', key: 'confidence', correct: 'A' },
    { label: 'Claim CLM-4414', value: '0.55', key: 'confidence', correct: 'C' },
    { label: 'Claim CLM-4415', value: '0.63', key: 'confidence', correct: 'B' },
  ] : [
    { label: 'Exception #4412', value: 'critical', key: 'status', correct: 'A' },
    { label: 'Exception #4419', value: 'pending+2d', key: 'status', correct: 'C' },
    { label: 'Exception #4433', value: 'pending+5d', key: 'status', correct: 'B' },
    { label: 'Exception #4441', value: 'critical', key: 'status', correct: 'A' },
  ];
  const branchLabels = track === 'tech'
    ? { A: 'Auto-write (≥0.85)', B: 'Human review (0.60–0.85)', C: 'Manual triage (<0.60)' }
    : { A: 'Immediate escalation', B: 'Manager follow-up', C: 'Weekly summary' };

  const [picks, setPicks] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState(false);
  const allPicked = items.every((_, i) => picks[i] !== undefined);
  const score = revealed ? items.filter((item, i) => picks[i] === item.correct).length : 0;

  return (
    <div style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: '12px', padding: '20px 24px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.14em', color: '#78716C', marginBottom: '6px' }}>ROUTE PREDICTOR — IF/SWITCH NODE</div>
      <div style={{ fontSize: '11px', color: '#78716C', marginBottom: '14px' }}>For each item, predict which branch it takes.</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '12px', padding: '8px 10px', background: '#F5F5F4', borderRadius: '6px' }}>
        {(['A', 'B', 'C'] as const).map(l => (
          <div key={l} style={{ fontSize: '9px', color: '#78716C' }}><strong>{l}:</strong> {branchLabels[l]}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gap: '8px', marginBottom: '14px' }}>
        {items.map((item, i) => {
          const userPick = picks[i];
          const isRight = revealed && userPick === item.correct;
          const isWrong = revealed && userPick && userPick !== item.correct;
          return (
            <div key={i} style={{ padding: '10px 12px', background: isRight ? 'rgba(22,163,74,0.06)' : isWrong ? 'rgba(220,38,38,0.04)' : '#fff', border: `1px solid ${isRight ? 'rgba(22,163,74,0.25)' : isWrong ? 'rgba(220,38,38,0.2)' : '#E7E5E4'}`, borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#292524' }}>{item.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#059669' }}>{item.key} = {item.value}</div>
                </div>
                {revealed && <div style={{ fontSize: '11px', fontWeight: 700, color: isRight ? '#16A34A' : '#DC2626' }}>{isRight ? '✓' : `✗ → ${item.correct}`}</div>}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['A', 'B', 'C'].map(b => (
                  <div key={b} onClick={() => !revealed && setPicks(p => ({ ...p, [i]: b }))}
                    style={{ flex: 1, padding: '5px 0', textAlign: 'center' as const, borderRadius: '5px', fontSize: '10px', fontWeight: 700, cursor: revealed ? 'default' : 'pointer', background: userPick === b ? (revealed ? (b === item.correct ? '#16A34A' : '#DC2626') : '#059669') : '#F5F5F4', color: userPick === b ? '#fff' : '#78716C', border: `1px solid ${userPick === b ? 'transparent' : '#E7E5E4'}` }}>{b}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {!revealed && <div onClick={() => allPicked && setRevealed(true)} style={{ padding: '7px 16px', background: allPicked ? '#059669' : '#D1FAE5', borderRadius: '6px', fontSize: '11px', color: allPicked ? '#fff' : '#6B7280', cursor: allPicked ? 'pointer' : 'not-allowed', fontWeight: 700 }}>Reveal Routes</div>}
        {revealed && <div style={{ fontSize: '12px', fontWeight: 700, color: score === 4 ? '#16A34A' : '#F59E0B' }}>{score}/4 correct</div>}
        {revealed && <div onClick={() => { setPicks({}); setRevealed(false); }} style={{ padding: '7px 14px', background: '#F5F5F4', border: '1px solid #E7E5E4', borderRadius: '6px', fontSize: '10px', color: '#78716C', cursor: 'pointer' }}>Try Again</div>}
      </div>
    </div>
  );
};

const ApprovalSimulatorCard = ({ track }: { track: GenAITrack }) => {
  type ItemState = 'pending' | 'approved' | 'rejected' | 'escalated';
  const [state, setState] = useState<ItemState>('pending');
  const item = track === 'tech'
    ? { id: 'CLM-4412', label: 'Pharmacy override · Tier 2', confidence: '0.71', sla: 'Thursday 17:00', channel: 'claims-review' }
    : { id: '#4412', label: 'Escalate to regional manager', days: '6d open (SLA: 5d)', sla: 'Thursday 12:00', channel: 'ops-approvals' };

  const stateColor: Record<ItemState, string> = { pending: '#F59E0B', approved: '#16A34A', rejected: '#DC2626', escalated: '#7C3AED' };
  const stateLabel: Record<ItemState, string> = { pending: 'PENDING', approved: '✓ APPROVED', rejected: '✗ REJECTED', escalated: '⇑ ESCALATED' };

  return (
    <div style={{ background: '#1A1D21', borderRadius: '12px', padding: '0', overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ background: '#19171D', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #2D2D2D' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#4A154B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>⧬</div>
        <div style={{ color: '#D1D1D1', fontSize: '12px', fontWeight: 600 }}># {item.channel}</div>
        <div style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, background: `${stateColor[state]}20`, color: stateColor[state] }}>{stateLabel[state]}</div>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ background: '#222529', border: '1px solid #2D2D2D', borderRadius: '8px', padding: '12px 14px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 700, flexShrink: 0 }}>n8</div>
            <div>
              <div style={{ fontSize: '11px', color: '#D1D1D1', fontWeight: 600 }}>n8n Workflow Bot</div>
              <div style={{ fontSize: '9px', color: '#616061' }}>Today at 09:14</div>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#D1D1D1', lineHeight: 1.6, marginBottom: '10px' }}>
            {track === 'tech'
              ? <><strong>⚑ Review Required</strong><br />Claim <span style={{ color: '#059669' }}>{item.id}</span> — confidence: <span style={{ color: '#F59E0B' }}>{item.confidence}</span><br />Suggested: <span style={{ color: '#A78BFA' }}>{item.label}</span><br />SLA: <strong>{item.sla}</strong></>
              : <><strong>⚑ Approval Required</strong><br />Exception <span style={{ color: '#059669' }}>{item.id}</span> — {item.days}<br />Action: <span style={{ color: '#A78BFA' }}>{item.label}</span><br />SLA: <strong>{item.sla}</strong></>}
          </div>
          {state === 'approved' && <div style={{ padding: '8px 12px', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: '6px', fontSize: '10px', color: '#6EE7B7' }}>✓ Approved — workflow resumed. {track === 'tech' ? 'Classification written to tracker.' : 'Escalation email sent.'}</div>}
          {state === 'rejected' && <div style={{ padding: '8px 12px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: '6px', fontSize: '10px', color: '#FCA5A5' }}>✗ Rejected — workflow stopped. {track === 'tech' ? 'Claim returned to manual triage.' : 'Exception held for re-review.'}</div>}
          {state === 'escalated' && <div style={{ padding: '8px 12px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '6px', fontSize: '10px', color: '#C4B5FD' }}>⏱ 48h timeout — auto-escalated to team lead. Webhook: /webhook/escalate fired.</div>}
          {state === 'pending' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <div onClick={() => setState('approved')} style={{ padding: '6px 16px', background: '#007A5A', borderRadius: '4px', fontSize: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>✓ Approve</div>
              <div onClick={() => setState('rejected')} style={{ padding: '6px 16px', border: '1px solid #616061', borderRadius: '4px', fontSize: '10px', color: '#D1D1D1', cursor: 'pointer' }}>✗ Reject</div>
              <div onClick={() => setState('escalated')} style={{ padding: '6px 16px', border: '1px solid #616061', borderRadius: '4px', fontSize: '10px', color: '#A78BFA', cursor: 'pointer' }}>⏱ Sim. 48h</div>
            </div>
          )}
          {state !== 'pending' && <div onClick={() => setState('pending')} style={{ marginTop: '8px', padding: '5px 12px', border: '1px solid #2D2D2D', borderRadius: '4px', fontSize: '9px', color: '#616061', cursor: 'pointer', display: 'inline-block' }}>↺ Reset</div>}
        </div>
        <div style={{ fontSize: '9px', color: '#616061' }}>Wait node holds execution until response. Timeout 48h → escalation webhook fires automatically.</div>
      </div>
    </div>
  );
};

const SessionIsolationCard = ({ track }: { track: GenAITrack }) => {
  const users = track === 'tech'
    ? [
        { id: 'user-7821', name: 'Aarav', color: '#059669', questions: ['What is deductible for Plan B, Tier 2?', 'What about Tier 3?', 'Is there a family cap?'], answers: ['Plan B Tier 2 deductible: $1,400/yr (plan schedule)', 'Plan B Tier 3: $2,100/yr. (Context: Plan B from prior turn)', 'Family OOP max for Plan B: $8,700 across all tiers.'] },
        { id: 'user-4203', name: 'Guest', color: '#7C3AED', questions: ['What is the deductible?', 'For which plan?'], answers: ['I need more context — which plan and tier are you asking about?', 'No prior context in this session. Please specify plan and tier.'] },
      ]
    : [
        { id: 'rhea-3', name: 'Rhea', color: '#059669', questions: ['List open exceptions for Northstar West.', 'Which is highest priority?', 'Draft escalation for it.'], answers: ['3 open: #4412 (6d), #4419 (2d), #4433 (1d). SLA: 5d.', '#4412 — 6d open, 1d past SLA. (Context retained)', 'Drafting escalation for #4412 (Northstar West, 6d) to regional manager…'] },
        { id: 'ops-9', name: 'Guest', color: '#7C3AED', questions: ['What is the highest priority exception?', 'Escalate it.'], answers: ['No account context in this session. Please specify account or exception ID.', 'I need an exception ID and account before escalating. (No prior context)'] },
      ];

  const [turns, setTurns] = useState<Record<string, number>>({});

  const ask = (userId: string, user: typeof users[0]) => {
    const current = turns[userId] ?? 0;
    if (current < user.questions.length) {
      setTurns(t => ({ ...t, [userId]: current + 1 }));
    }
  };

  return (
    <div style={{ background: '#0D1117', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8B949E', marginBottom: '4px' }}>AI AGENT — WINDOW BUFFER MEMORY · SESSION ISOLATION</div>
      <div style={{ fontSize: '9px', color: '#6B7280', marginBottom: '16px' }}>Two users. Separate sessions. Click &quot;Ask Next&quot; to advance each conversation.</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {users.map(user => {
          const t = turns[user.id] ?? 0;
          return (
            <div key={user.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${user.color}30`, borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: user.color }}>{user.name}</div>
                <div style={{ fontSize: '8px', color: '#374151', background: `${user.color}15`, padding: '2px 6px', borderRadius: '4px' }}>session: {user.id}</div>
              </div>
              <div style={{ minHeight: '120px', display: 'grid', gap: '5px', alignContent: 'start' }}>
                {Array.from({ length: t }, (_, i) => (
                  <React.Fragment key={i}>
                    <div style={{ fontSize: '9px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '4px 8px', color: '#C9D1D9' }}>👤 {user.questions[i]}</div>
                    <div style={{ fontSize: '9px', background: `${user.color}10`, border: `1px solid ${user.color}20`, borderRadius: '4px', padding: '4px 8px', color: '#9CA3AF' }}>🤖 {user.answers[i]}</div>
                  </React.Fragment>
                ))}
                {t === 0 && <div style={{ fontSize: '9px', color: '#374151', fontStyle: 'italic', padding: '4px 0' }}>No conversation yet.</div>}
              </div>
              <div onClick={() => ask(user.id, user)} style={{ marginTop: 'auto', padding: '5px 10px', background: t < user.questions.length ? user.color : '#374151', borderRadius: '5px', fontSize: '9px', color: '#fff', cursor: t < user.questions.length ? 'pointer' : 'not-allowed', textAlign: 'center' as const, fontWeight: 700 }}>
                {t < user.questions.length ? 'Ask Next →' : '✓ Session complete'}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: '12px', padding: '6px 10px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '4px', fontSize: '9px', color: '#D97706' }}>Each session ID keeps memory separate. {users[0].name}&apos;s context doesn&apos;t leak into Guest&apos;s session — even on the same agent.</div>
    </div>
  );
};

// ── End M5 TiltCard Mockups ───────────────────────────────────────────────────

function CoreContent({ track, completedSections, activeSection }: { track: GenAITrack; completedSections: Set<string>; activeSection: string | null }) {
  const nextSection = SECTIONS.find(s => !completedSections.has(s.id));
  const moduleContext = TRACK_META[track].moduleContext;
  return (
    <>
      {/* Module Hero */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '28px' }}>
      <div style={{ flex: 1, minWidth: 0, background: 'var(--ed-cream)', borderRadius: '14px', padding: '36px 36px 28px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-12px', top: '-8px', fontSize: '140px', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.05)`, fontFamily: "'Lora','Georgia',serif", letterSpacing: '-0.04em', userSelect: 'none' as const, pointerEvents: 'none' as const }}>05</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '10px', textTransform: 'uppercase' as const }}>GenAI Launchpad · Pre-Read 05</div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.025em', color: 'var(--ed-ink)', marginBottom: '10px', fontFamily: "'Lora', Georgia, serif" }}>Advanced n8n: Loops, Transforms & AI Agents</h1>
          <p style={{ fontSize: '15px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '28px' }}>&ldquo;A workflow that runs once on one item is a proof of concept. One that runs reliably on thousands is a system.&rdquo;</p>
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
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{track === 'tech' ? "M04 workflow works on one claim at a time. The backlog is 200+ per week. Time to make it iterate, branch, and hold state." : "The Monday report automation works for 5 rows of test data. Production has 80 renewals, three sources, and two managers who need to approve before anything sends."}</div>
            </div>
            {([
              { name: 'Rohan', role: 'Automation Engineer',     desc: 'Asks whether the loop feedback edge is connected before debugging batch failures.', color: '#2563EB', mentorId: 'rohan' as GenAIMentorId },
              { name: 'Anika', role: 'AI Workflow Strategist',  desc: 'Designs the approval gate interface before designing the workflow around it.', color: '#7C3AED', mentorId: 'anika' as GenAIMentorId },
              { name: 'Kabir', role: 'Operations Intelligence', desc: 'Traces the session ID through the workflow before calling it a memory bug.', color: '#0F766E', mentorId: 'kabir' as GenAIMentorId },
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
              'Use SplitInBatches to process arrays and paginate across APIs without overloading downstream nodes',
              'Normalize inconsistent data shapes from multiple sources using Set and Function nodes',
              'Route workflow execution using If/Switch nodes — by confidence score, data type, or exception condition',
              'Design human approval gates with Wait nodes, structured callbacks, and timeout fallbacks',
              'Build memory-enabled chat agents using Window Buffer Memory and per-user session IDs',
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
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE 05</div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>Advanced n8n</div>
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

      {/* ── Section 1: Loops & Iteration ── */}
      <ChapterSection id="genai-m5-loops" num="01" accentRgb={ACCENT_RGB} first>
        {para(track === 'tech'
          ? "In Pre-Read 04, Aarav built the exception classification workflow end-to-end — trigger, Set node, OpenAI classifier, Validate Output, dead-letter error path, and a live test against 12 real exceptions. The workflow runs reliably on one exception per trigger. This pre-read is about the three gaps that appear the moment volume arrives: a 247-item backlog that needs batching, two claim APIs whose field names don't match the classifier's input schema, and a confidence threshold that should pause for human sign-off before writing to the tracker."
          : "In Pre-Read 04, Rhea automated her Monday exception summary — mapped the manual process step by step, wired it in n8n with a service account credential, added a Slack error alert, and ran it live before showing her director. The brief now sends automatically every Monday. That success prompted a second request from her manager: build a weekly renewal digest for the 80 accounts on the renewals sheet. Rhea opens n8n. The Monday workflow handled one fixed output. This one needs to loop over 80 rows — and the renewals sheet field names don't match her prompt template."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? "The exception classifier handles one email per trigger. This week's backlog: 247 unclassified claims. Running the workflow 247 times manually defeats the purpose of building it. Aarav needs the workflow to take an array and iterate — without hitting OpenAI rate limits or losing items."
            : "The Monday brief runs perfectly. Now her manager asks for a second workflow: a weekly renewal digest from the 80 accounts on the renewals sheet. First test run: the workflow completes in 3 seconds and produces one output. Not 80. Rhea checks every node — all green. The workflow succeeded. It just only processed the first row."}
        </SituationCard>
        {h2(<>When a Single Run Isn&apos;t Enough</>)}
        {para(<>Most real data arrives as a collection — an array from an API, a list of rows from a spreadsheet, a batch of records from a webhook. The challenge is not processing one item: it is processing all of them without hitting rate limits, losing items, or overwhelming downstream nodes.</>)}
        <GenAIConversationScene
          mentor="rohan"
          track={track}
          accent="#2563EB"
          techLines={[
            { speaker: 'protagonist', text: "My workflow works on one claim. I need it to handle an array of 200. Do I just loop the whole workflow?" },
            { speaker: 'mentor', text: "No. You add a SplitInBatches node inside the workflow. It takes the array and outputs one batch at a time — you define the batch size." },
            { speaker: 'protagonist', text: "And after the batch is processed, it automatically moves to the next?" },
            { speaker: 'mentor', text: "Only if you connect the batch node's 'has items' output back to itself. That feedback edge is what makes it a loop. Without it, you process batch one and stop." },
            { speaker: 'protagonist', text: "So the loop is in the wiring, not in a separate node?" },
            { speaker: 'mentor', text: "Exactly. The feedback edge is the loop. Remove it and you have a batch processor that only runs once." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "My workflow handles one renewal. The spreadsheet has 80. Do I run the workflow 80 times?" },
            { speaker: 'mentor', text: "No — you set the workflow to iterate. The loop node takes the full array and sends one item at a time through the rest of the workflow." },
            { speaker: 'protagonist', text: "And it keeps going until all 80 are processed?" },
            { speaker: 'mentor', text: "Yes. But you need the loop's feedback connection — the 'has items' output connecting back to the loop node. That connection is the instruction to 'keep going.'" },
            { speaker: 'protagonist', text: "What happens without it?" },
            { speaker: 'mentor', text: "The first item processes. The loop ends. You get one row of output and 79 unprocessed renewals." },
          ]}
        />
        {keyBox('Core Concepts', [
          'SplitInBatches node — divides an input array into fixed-size batches. The batch size controls throughput vs. rate limit risk. Smaller batches = safer; larger batches = faster.',
          'Feedback edge — the connection from the SplitInBatches "has items" output back to itself. This is the loop mechanism. Without it, only the first batch runs.',
          'Pagination — when an API returns results in pages (e.g., page 1 of 10), the loop node requests each page in sequence, using the previous response\'s next-page cursor as the next request\'s input.',
          'Item iteration — processing each item in a collection independently. Each item gets its own execution context: its own AI call, its own error handling, its own output.',
        ], ACCENT)}
        <GenAIAvatar
          name="Rohan"
          nameColor="#2563EB"
          borderColor="#2563EB"
          content={<>Every batch loop has three things: the input array, the feedback edge, and the merge point. Before debugging a batch problem, draw those three things on paper. Most batch failures are a missing feedback edge or a merge node that collects from the wrong output.</>}
          expandedContent={<>Rate limits are the invisible constraint in batch workflows. If your AI node makes one API call per item and you have 200 items, that is 200 API calls — possibly within seconds. Most LLM APIs throttle at 60 requests/minute. Add a Wait node (500ms) between batches for any workflow running at volume.</>}
          question={track === 'tech'
            ? "Aarav's SplitInBatches workflow processes 200 claims in batches of 10. After batch 1, no more batches run. What is missing?"
            : "Rhea's loop processes the first renewal and stops. 79 renewals remain untouched. What is the most likely cause?"}
          options={[
            { text: track === 'tech' ? "The batch size is too large — reduce it to 5" : "The loop node needs a larger timeout setting", correct: false, feedback: "Batch size and timeouts are not the cause here." },
            { text: track === 'tech' ? "The feedback edge from 'has items' back to the batch node is missing" : "The loop node's 'has items' output is not connected back to the loop node", correct: true, feedback: "Correct. The feedback edge is the loop mechanism. Without it, the node processes one batch and stops." },
            { text: track === 'tech' ? "The downstream AI node doesn't support batch input" : "The Google Sheet only exported the first row", correct: false, feedback: "The downstream node is not the issue — the loop setup is." },
            { text: track === 'tech' ? "n8n limits batch workflows to one iteration by default" : "The workflow needs to be run in manual mode to iterate", correct: false, feedback: "No such default limit exists." },
          ]}
          conceptId="genai-m5-loops"
        />
        <TiltCard style={{ margin: '28px 0' }}><BatchSimulatorCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech'
          ? "Take a workflow that processes a single item. Add a SplitInBatches node with batch size 5. Connect the feedback edge. Run it on an array of 20 test items. Verify all 20 are processed — not just the first 5."
          : "Take your renewal workflow. Replace the single-item trigger with a loop that reads all rows from the spreadsheet. Run it on 10 test rows. Confirm 10 outputs are produced — not just 1."} />
      </ChapterSection>

      {/* ── Section 2: Data Transforms ── */}
      <ChapterSection id="genai-m5-transforms" num="02" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? "Claims come from two APIs. API A returns `{ claimId, amount, status }`. API B returns `{ id, value, state }`. The AI classifier expects `{ claim_id, amount, status }`. Both sources feed into the same classifier node. Nothing matches."
            : "Rhea's renewal workflow pulls account data from Google Sheets and status updates from the renewals webhook. The sheet column is 'Policy Number'. The webhook sends 'policyNum'. The merge node finds zero matches. Her first instinct: write a script to normalize both to lowercase. Then she remembers — she is working in the visual editor, not the code editor. She needs to solve this without writing a single line of code."}
        </SituationCard>
        {h2(<>Reshaping Data Between Nodes</>)}
        {para(<>Every node in n8n has an expected input shape. When two nodes connect, the output shape of the first must match the input shape of the second. When they don&apos;t — which is most of the time when working with multiple data sources — you need a transform node between them.</>)}
        <GenAIConversationScene
          mentor="kabir"
          track={track}
          accent="#0F766E"
          techLines={[
            { speaker: 'protagonist', text: "Two APIs, two different field names. The classifier needs a specific schema. Do I write a custom Function node to handle both?" },
            { speaker: 'mentor', text: "Function node works but it's fragile. A Set node after each API is cleaner — it maps each source to the canonical schema before they ever reach the classifier." },
            { speaker: 'protagonist', text: "So I normalize at the source, not at the destination?" },
            { speaker: 'mentor', text: "Always. Downstream nodes should see one consistent shape. The transform cost is low; the debugging cost of inconsistent shapes downstream is high." },
            { speaker: 'protagonist', text: "What about fields that might be missing from one source?" },
            { speaker: 'mentor', text: "Handle the null in the Set node — set a default value. Don't let null propagate downstream and fail silently in the classifier." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The merge fails because the column names are different. Do I change the column name in Google Sheets?" },
            { speaker: 'mentor', text: "You can. Or you add a Set node before the merge that renames the field. Either way, both sources need the same field name for the join to work." },
            { speaker: 'protagonist', text: "Which approach is better?" },
            { speaker: 'mentor', text: "Set node — don't change the source data. The source is authoritative. Transform in the workflow, not in the spreadsheet. If someone else also uses that spreadsheet, changing the column name breaks their work." },
            { speaker: 'protagonist', text: "So the workflow carries the transformation logic?" },
            { speaker: 'mentor', text: "Yes. Source data stays clean. Workflow handles the mapping. One Set node, one field rename." },
          ]}
        />
        {keyBox('Core Concepts', [
          'Set node — adds, overwrites, or removes fields on each item. The primary tool for canonical schema mapping. Faster and more readable than Function nodes for simple field operations.',
          'Function node — executes JavaScript on each item. Use when the transform requires computation, conditional logic, or string manipulation that Set node cannot express.',
          'Dot notation — n8n uses dot notation to access nested fields: `data.patient.id` reads `id` from `patient` inside `data`. Missing a level in the path returns undefined silently.',
          'Merge strategies — the Merge node supports four modes: Merge by Index (combine by position), Merge by Key (join on matching field value), Append (combine into one array), and Combine All (Cartesian product). Choosing the wrong mode produces silent data loss.',
        ], '#0891B2')}
        {PMPrincipleBox({ label: '◈ Principle', principle: "Normalize to a canonical schema at the source node, not at the consumer node. Every node downstream becomes simpler and more testable when the shape is consistent from the start." })}
        <GenAIAvatar
          name="Kabir"
          nameColor="#0F766E"
          borderColor="#0F766E"
          content={<>The most expensive data bugs in production are the ones that don&apos;t error — they just produce wrong output. A Set node that silently maps a missing field to an empty string lets the workflow &ldquo;succeed&rdquo; while producing garbage. Always validate the shape at the Set node, not downstream.</>}
          expandedContent={<>When merging two sources, print both inputs to the merge node before running the merge. Confirm that the join key field exists on both sides, has the same name, and has matching values. A merge that finds zero matches is almost always a field name mismatch or a type mismatch (string vs. number).</>}
          question={track === 'tech'
            ? "Aarav's Set node maps `id` → `claim_id`. But after the Set node, the downstream classifier receives items where `claim_id` is undefined. What should he check?"
            : "Rhea adds a Set node to rename 'policyNum' → 'Policy Number'. The merge still finds zero matches. What is the next diagnostic step?"}
          options={[
            { text: track === 'tech' ? "The classifier expects a different field name than claim_id" : "The Google Sheets column name has a trailing space — 'Policy Number ' ≠ 'Policy Number'", correct: false, feedback: "Possible but not the first thing to check." },
            { text: track === 'tech' ? "The Set node is using dot notation to read a nested field that doesn't exist at that path — the field is undefined before mapping" : "The Set node is correctly renaming the field but the merge node is configured to join on a different key entirely", correct: true, feedback: "Correct. If the source field path is wrong in the Set node, it reads undefined and maps undefined to the target field. Verify the input shape before the Set node." },
            { text: track === 'tech' ? "The Set node runs after the merge point — it should run before" : "The webhook is sending data after the merge node runs", correct: false, feedback: "Execution order would be visible in the workflow diagram." },
            { text: track === 'tech' ? "The Function node should be used instead of the Set node for field remapping" : "Google Sheets returns fields alphabetically — the merge node is confused by the order", correct: false, feedback: "Neither the node type nor field order is the issue here." },
          ]}
          conceptId="genai-m5-transforms"
        />
        <TiltCard style={{ margin: '28px 0' }}><FieldMapperCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech'
          ? "Take two HTTP nodes with different response schemas. Add a Set node after each that maps both to a shared canonical schema. Connect both to a Merge node. Verify the merged output has consistent field names and no undefined values."
          : "Create a small test: two data sources with different field names for the same concept. Add Set nodes to normalize both. Merge them on the shared field name. Confirm the merge finds matches — print the output before and after."} />
      </ChapterSection>

      {/* ── Section 3: Conditional Routing ── */}
      <ChapterSection id="genai-m5-routing" num="03" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? "The AI classifier returns a confidence score: 0.0–1.0. High confidence → auto-process. Mid-range → human review. Low confidence → rejection queue. Three routes. After one week, 60% of claims are stuck in human review. Either the threshold is wrong or the classifier is poorly calibrated."
            : "Rhea's renewal workflow routes to three teams based on policy type: Health, Dental, Vision. After a week, Team Vision reports receiving Dental renewals. The If/Switch node conditions look right on paper."}
        </SituationCard>
        {h2(<>Branching: Routes Are Business Logic</>)}
        {para(<>A workflow that does the same thing to every item regardless of content is a batch processor. A workflow that chooses different actions based on content is a system. Conditional routing — implemented via If and Switch nodes — is how you encode business logic into a workflow.</>)}
        <GenAIConversationScene
          mentor="anika"
          track={track}
          accent="#7C3AED"
          techLines={[
            { speaker: 'protagonist', text: "60% of claims in human review. The threshold is set at 0.5 for review. Should I lower it to 0.3 to push more through auto-process?" },
            { speaker: 'mentor', text: "Before adjusting any threshold, audit the actual distribution. What percentage of claims cluster in the 0.5–0.85 range?" },
            { speaker: 'protagonist', text: "I don't know — I just assumed the classifier was calibrated." },
            { speaker: 'mentor', text: "That's the mistake. If 60% of claims legitimately score in the mid-range, moving the threshold doesn't fix the calibration problem — it just moves which claims end up in review. Print the confidence distribution first." },
            { speaker: 'protagonist', text: "And if the distribution confirms most claims are genuinely uncertain?" },
            { speaker: 'mentor', text: "Then the problem is the classifier, not the routing. Better training data, clearer categories, or a different model — not a different number in an If node." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The conditions look right. 'policy_type equals Dental' goes to Team Dental. 'policy_type equals Vision' goes to Team Vision. But Vision is getting Dental renewals." },
            { speaker: 'mentor', text: "Print the actual value of policy_type arriving at the If node. Don't read the condition — read the runtime data." },
            { speaker: 'protagonist', text: "Oh. The webhook sends 'dental' lowercase. The condition checks for 'Dental' with a capital D." },
            { speaker: 'mentor', text: "Exact. String comparisons are case-sensitive by default. 'dental' ≠ 'Dental'. The condition fails, falls through to the default branch, and Team Vision is set as the default." },
            { speaker: 'protagonist', text: "So normalize the case before the routing node?" },
            { speaker: 'mentor', text: "Yes. A Set node that lowercases the field before the Switch node. Or enable case-insensitive comparison if the node supports it." },
          ]}
        />
        {keyBox('Core Concepts', [
          'If node — binary branch. Evaluates one condition and routes to true or false output. Use for simple yes/no decisions with one condition.',
          'Switch node — multi-way branch. Evaluates multiple conditions in order and routes to the first matching output. Has a fallback output for items that match no condition.',
          'Confidence-based routing — routing on a numeric score from an AI model. Requires knowing the score distribution before setting thresholds; otherwise thresholds are arbitrary.',
          'Fallback chain — the path an item takes when it matches no condition. If no fallback is defined, items silently disappear. Always define a default output that either handles the item or alerts.',
        ], '#7C3AED')}
        {PMPrincipleBox({ label: '◈ Principle', principle: "Before adjusting a routing condition, audit what values are actually arriving at the router. Most routing bugs are data format errors — not logic errors." })}
        <GenAIAvatar
          name="Anika"
          nameColor="#7C3AED"
          borderColor="#7C3AED"
          content={<>Routing conditions are promises: &ldquo;if the data looks like this, do that.&rdquo; When routing breaks, the first question is whether the data kept its end of the promise. Print the input to the routing node before changing the condition. The condition is usually fine. The data usually isn&apos;t.</>}
          expandedContent={<>The most dangerous routing failure is silent — an item that matches no condition and falls out of the workflow without any alert. Always wire the Switch node&apos;s fallback output to a Slack alert or a dead-letter Google Sheet. If items are disappearing from your workflow, the fallback branch tells you how many.</>}
          question={track === 'tech'
            ? "Aarav routes claims above 0.85 to auto-process. One week in, 3% of auto-processed claims are wrong. The AI confidence was above 0.85 for all of them. What is the most useful diagnostic?"
            : "Rhea's routing looks correct in the workflow but is still wrong in production. She has checked the field names and they match. What should she check next?"}
          options={[
            { text: track === 'tech' ? "Lower the threshold to 0.92 to be more conservative" : "Re-run the workflow with the most recent data and check if the issue reproduces", correct: false, feedback: "This treats the symptom, not the root cause." },
            { text: track === 'tech' ? "The confidence score field from the AI node might be a string, not a number — '0.87' > 0.85 is false in string comparison" : "The condition may be matching on a field that has extra whitespace or encoding differences not visible in the UI", correct: true, feedback: "Correct. Type mismatches and invisible character differences are the most common silent routing failures." },
            { text: track === 'tech' ? "The AI model's confidence scores are not reliable above 0.85" : "The Switch node has a known bug with string comparisons in this version of n8n", correct: false, feedback: "Blame the tool last." },
            { text: track === 'tech' ? "Add a second AI call to verify high-confidence claims before auto-processing" : "Contact n8n support to investigate the routing behavior", correct: false, feedback: "Engineering complexity before diagnosing the actual failure is premature." },
          ]}
          conceptId="genai-m5-routing"
        />
        <TiltCard style={{ margin: '28px 0' }}><RoutePredictorCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech'
          ? "Take a workflow that routes on an AI confidence score. Print the actual confidence values before the If node. Confirm they are numbers, not strings. Test with boundary values: 0.84, 0.85, 0.86. Verify each routes correctly."
          : "Take a routing workflow. Before the Switch node, add a Set node that prints the routing field value. Run it on 5 test items. Confirm the values match what the Switch conditions expect — same case, no spaces, correct format."} />
      </ChapterSection>

      {/* ── Section 4: Human-in-the-Loop ── */}
      <ChapterSection id="genai-m5-hitl" num="04" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? "Claims in the mid-confidence range (0.5–0.85) need a human reviewer before they are processed. Aarav adds a Wait node. The workflow pauses. The reviewer gets a Slack message. But the message has no button. The Wait node times out after 5 minutes."
            : "Two managers need to approve the weekly exception report before it goes to the director. Rhea adds an approval step — the workflow emails the managers and waits. Three days later, both managers have replied 'Approved' by email. The workflow is still paused."}
        </SituationCard>
        {h2(<>Pausing for Humans: Wait Nodes & Approval Gates</>)}
        {para(<>Not every step in a workflow should be automated. Some outputs need a human decision before the workflow proceeds — a compliance review, a budget approval, a content check. The Wait node pauses execution indefinitely until it receives a structured callback. The design challenge is building the mechanism that sends that callback.</>)}
        <GenAIConversationScene
          mentor="leela"
          track={track}
          accent="#C2410C"
          techLines={[
            { speaker: 'protagonist', text: "The Wait node pauses, the Slack message sends, but no one can resume the workflow. The Wait node just times out." },
            { speaker: 'mentor', text: "The Wait node resumes on a webhook call. Your Slack message needs to include a button — an interactive block — whose click triggers that webhook URL." },
            { speaker: 'protagonist', text: "So the button is the connection between the reviewer's action and the workflow?" },
            { speaker: 'mentor', text: "Exactly. The button's action URL is the Wait node's resume webhook. When the reviewer clicks 'Approve', Slack calls that URL, and the workflow continues." },
            { speaker: 'protagonist', text: "And if they click 'Reject'?" },
            { speaker: 'mentor', text: "Use two webhook URLs — one for approve, one for reject. The Wait node receives the callback and the next node reads which button was clicked." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "Both managers replied 'Approved' by email three days ago. The workflow is still waiting. What am I missing?" },
            { speaker: 'mentor', text: "The Wait node doesn't read email replies. It waits for a webhook call — a structured HTTP request to a specific URL. Free-text email replies don't trigger it." },
            { speaker: 'protagonist', text: "So email-based approval doesn't work?" },
            { speaker: 'mentor', text: "Not natively. You need to embed a link in the email — when the manager clicks it, the link calls the webhook. Or use a form: the email contains a form link, the manager submits the form, the form submission triggers the webhook." },
            { speaker: 'protagonist', text: "That's more setup than I expected." },
            { speaker: 'mentor', text: "Design the approval mechanism before you build the workflow. The Wait node is the easy part. The hard part is building what resumes it." },
          ]}
        />
        {keyBox('Core Concepts', [
          'Wait node — pauses workflow execution until a webhook is called. The node provides a unique resume URL. Execution resumes from the point after the Wait node when that URL receives a POST request.',
          'Approval interface — the UI the human uses to approve or reject. Can be a Slack button, a web form, an email link, or an n8n form. Each must POST to the Wait node\'s webhook URL.',
          'Timeout handling — Wait nodes can have a timeout. When the timeout expires, the workflow continues on the timeout branch — not the approval branch. The timeout branch must handle the "no response" case explicitly.',
          'Audit trail — every approval should write a record: who approved, when, what was approved, what decision was made. This is not optional in regulated contexts like health insurance.',
        ], '#C2410C')}
        {PMPrincipleBox({ label: '◈ Principle', principle: "Design the approval interface before designing the workflow. The Wait node is trivial to add. The mechanism that resumes it determines whether the approval is actually usable." })}
        <GenAIAvatar
          name="Leela"
          nameColor="#C2410C"
          borderColor="#C2410C"
          content={<>In health insurance, an approval that leaves no record may as well not have happened. Every human checkpoint in a workflow touching claims or patient data must write to an audit log: decision, timestamp, approver identity. A Wait node that resumes without recording who approved creates compliance risk, not safety.</>}
          expandedContent={<>Think about the timeout branch as a compliance case. If an approval is not received within 24 hours, what should happen? Silently continuing is usually wrong. Escalating to a senior reviewer, flagging in a tracking sheet, or auto-rejecting are all more defensible than a silent default. Design the timeout branch with the same care as the approval branch.</>}
          question={track === 'tech'
            ? "Aarav's Wait node has a 2-hour timeout. When the timeout fires, the workflow continues to the next node automatically. The next node sends a Slack notification: 'Claim processed.' Is this correct behavior?"
            : "Rhea's Wait node times out after 48 hours with no approval received. The workflow continues and sends the report to the director anyway. Leela flags this. Why?"}
          options={[
            { text: track === 'tech' ? "Yes — continuing after timeout is the correct fallback for real-time workflows" : "The report was sent without authorization — in a regulated context, sending without approval is a compliance violation regardless of whether the workflow continued correctly", correct: true, feedback: "Correct. Timeout fallback behavior has the same compliance weight as an explicit approval decision." },
            { text: track === 'tech' ? "No — the Wait node should retry before timing out" : "The report should have been sent sooner — 48 hours is too long a timeout", correct: false, feedback: "Timeout duration is not the issue here." },
            { text: track === 'tech' ? "No — the Slack notification should say 'Review timed out' not 'Claim processed'" : "The approval step should be removed — email approval is too slow", correct: false, feedback: "Notification wording and approval speed are not the core issue." },
            { text: track === 'tech' ? "Yes — the claim was processed, so the Slack message is accurate" : "The workflow should have a longer timeout — 72 hours is standard for approvals", correct: false, feedback: "Accuracy of notification text and timeout length miss the compliance concern entirely." },
          ]}
          conceptId="genai-m5-hitl"
        />
        <TiltCard style={{ margin: '28px 0' }}><ApprovalSimulatorCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech'
          ? "Build a minimal approval flow: an HTTP trigger → a Wait node → a Slack message with an interactive button. The button's action URL is the Wait node's resume webhook. Test it manually: trigger the workflow, click the Slack button, confirm the workflow resumes."
          : "Design an approval flow for your report workflow: email containing an approval link → Wait node → continue on click. Map out what happens on timeout (48 hours, no click). Write the timeout branch action before you build the happy path."} />
      </ChapterSection>

      {/* ── Section 5: Memory & Chat Agents ── */}
      <ChapterSection id="genai-m5-agents" num="05" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? "The claims team wants a chat interface to query the exception database in natural language. Aarav builds an Agent node with Window Buffer Memory. After 10 messages, the agent starts forgetting the context established in the first 3 exchanges. And two engineers using it simultaneously keep seeing each other's conversation context."
            : "Rhea deploys a policy FAQ chatbot for the operations team. After a week, team members report the bot is mixing up answers — one person's context appearing in another person's session. The memory is bleeding between users."}
        </SituationCard>
        {h2(<>Stateful AI: Memory and Session Isolation</>)}
        {para(<>A stateless AI node answers one question and forgets it. A memory-enabled agent answers questions in the context of a conversation — each new message informed by what was said before. The challenge is not adding memory; it is correctly scoping it so each conversation stays isolated.</>)}
        <GenAIConversationScene
          mentor="anika"
          track={track}
          accent="#7C3AED"
          techLines={[
            { speaker: 'protagonist', text: "Two engineers are using the chat agent simultaneously. They're seeing each other's context. Same session ID." },
            { speaker: 'mentor', text: "There it is. Session ID must be unique per user conversation. If it's hardcoded to a static string, every user writes to the same memory store." },
            { speaker: 'protagonist', text: "So I need a dynamic session ID — something like the user's ID or a conversation UUID?" },
            { speaker: 'mentor', text: "Exactly. Pull it from the request — user ID, chat thread ID, whatever uniquely identifies this conversation. Map it to the memory node's session ID field." },
            { speaker: 'protagonist', text: "And the 10-message forgetting issue?" },
            { speaker: 'mentor', text: "Window Buffer Memory is a sliding window. Message 11 pushes message 1 out. It's by design. For long-context recall, you need a summary memory layer or a vector store that persists key facts separately." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The chatbot is mixing up users' answers. One person asks about dental policies and the next person sees dental context even though they asked about health." },
            { speaker: 'mentor', text: "Check the session ID configuration. If all users share one session ID, they share one memory store. Every message from every user goes into the same pool." },
            { speaker: 'protagonist', text: "The session ID is set to 'northstar-ops'. Same for everyone." },
            { speaker: 'mentor', text: "That's the problem. The session ID needs to be different for each user. Something like their employee ID or their chat session token — something that's unique per person per conversation." },
            { speaker: 'protagonist', text: "How do I get that into the workflow?" },
            { speaker: 'mentor', text: "Your chat interface sends a user identifier with each message. Map that identifier to the session ID field in the memory node." },
          ]}
        />
        {keyBox('Core Concepts', [
          'Window Buffer Memory — stores the last N messages in a conversation. When the window is full, the oldest message is dropped. The model sees only what is in the current window. Good for short-to-medium conversations; unreliable for sessions requiring long-term recall.',
          'Session ID — the key that identifies a specific conversation in memory storage. Must be unique per user per conversation. A static session ID means all users share one memory store — the most common memory bug in multi-user deployments.',
          'Agent node — an n8n node that runs an LLM in a tool-calling loop: the model decides which tool to call, calls it, observes the result, and decides what to do next. The loop continues until the model signals completion.',
          'Tool-calling loop — the observe-act cycle of an agent. Each iteration: model reads conversation + tools available → decides on a tool call → executes it → reads the result → decides next action. Stopping conditions prevent infinite loops.',
        ], '#2563EB')}
        {PMPrincipleBox({ label: '◈ Principle', principle: "Memory without session isolation is shared state. Always trace the session ID through every memory node before calling a multi-user deployment ready." })}
        <GenAIAvatar
          name="Kabir"
          nameColor="#0F766E"
          borderColor="#0F766E"
          content={<>Window Buffer Memory is right for most conversational use cases. Where it fails is when a conversation requires recall of something said more than N messages ago. Before building a vector-store memory layer, ask: is the issue that the window is too small, or that the context genuinely needs to persist across sessions? Those are different problems with different solutions.</>}
          expandedContent={<>The most reliable test for session isolation: two browser windows, two different user IDs, same question asked in both. Open both at the same time. If one window's answer is influenced by the other window's conversation, the session IDs are colliding. Run this test before any production deployment of a multi-user agent.</>}
          question={track === 'tech'
            ? "Aarav sets the session ID to `{{ $json.userId }}`. Two engineers with different user IDs still see each other's context. What is the most likely cause?"
            : "Rhea sets the session ID to the employee's name. Two employees named 'Priya' at different sites report sharing context. What is the fix?"}
          options={[
            { text: track === 'tech' ? "The Window Buffer Memory node doesn't support dynamic session IDs" : "Names are not reliable unique identifiers — use a unique employee ID or a generated session token instead", correct: true, feedback: "Correct. Two users with the same name share the same session. Unique IDs must be genuinely unique across all users." },
            { text: track === 'tech' ? "The userId field is missing from the request body — it defaults to a static fallback" : "The memory node needs to be reset between sessions", correct: false, feedback: "Possible but not the most likely cause given the question framing." },
            { text: track === 'tech' ? "Window Buffer Memory doesn't support multi-user scenarios — use a vector store" : "Use a different memory node type that supports name-based isolation", correct: false, feedback: "The memory type is not the issue — the session key is." },
            { text: track === 'tech' ? "The n8n workflow needs to run in parallel execution mode for multi-user support" : "Reset the chatbot daily to clear memory contamination", correct: false, feedback: "Neither addresses the root cause: non-unique session IDs." },
          ]}
          conceptId="genai-m5-agents"
        />
        <TiltCard style={{ margin: '28px 0' }}><SessionIsolationCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech'
          ? "Build a chat agent with Window Buffer Memory. Set the session ID to a dynamic user identifier from the request. Test with two different user IDs simultaneously. Confirm context from one session does not appear in the other."
          : "Design the session ID strategy for your FAQ chatbot. What unique identifier is available per user? Map it. Test with two team members using the chatbot at the same time. Confirm their conversations are isolated."} />
        <NextChapterTeaser text="Module 06 goes beyond workflows into full agent architecture — how agents plan, use tools, reason across multiple steps, and operate at production scale with observability built in." />
      </ChapterSection>
    </>
  );
}

export default function GenAIPreRead5({ track, onBack }: Props) {
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
            <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: `linear-gradient(135deg, ${ACCENT} 0%, #0D9488 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>GenAI Launchpad</span>
            <span style={{ color: 'var(--ed-rule)', fontSize: '12px' }}>›</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink2)', letterSpacing: '0.08em' }}>Pre-Read 05 · Advanced n8n</span>
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
            <CoreContent track={track} completedSections={completedSections} activeSection={activeSection} />
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
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '6px' }}>Pre-Read 05 Complete</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '8px', fontFamily: "'Lora', serif" }}>
              {track === 'tech' ? 'You can iterate, branch, gate, and remember.' : 'Loops, routing, approvals, and memory — in one system.'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
              {track === 'tech'
                ? "The workflows from M04 run once. The patterns from M05 run at volume. Module 06 wires this into full agent architecture."
                : "Your automation can now handle real-world data size, team approvals, and stateful conversations. Module 06 shows how to scale this into production agent systems."}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

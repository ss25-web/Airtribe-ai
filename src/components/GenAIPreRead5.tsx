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
import { N8N_NW, N8N_NH, N8nFrame, N8nNodeCard, n8nBezier, N8nCanvas } from './n8nCanvas';

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
  { id: 'genai-m5-loops',      icon: '🔁', label: 'Loop Thinker',    color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'genai-m5-transforms', icon: '🧰', label: 'Data Shaper',     color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
  { id: 'genai-m5-routing',    icon: '🛣️', label: 'Route Planner',   color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'genai-m5-hitl',       icon: '👤', label: 'Gate Keeper',     color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
  { id: 'genai-m5-agents',     icon: '💬', label: 'Agent Builder',   color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
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
        'A. The OpenAI node rate-limits after 10 calls — insert a Wait node between batches',
        'B. SplitInBatches is in "once" mode — only the first batch flows downstream',
        'C. The Merge node is misconfigured and is silently discarding all but the first batch',
        'D. The n8n execution engine caps batch iterations at 10 by default for safety',
      ],
      'non-tech': [
        'A. Google Sheets API rate-limited the first write and silently dropped the rest',
        'B. Loop is in append mode but the column mapping rewrites the same row each time',
        'C. The workflow is writing all 50 rows but to a different sheet tab on the same file',
        'D. The loop runs once because the previous node is not configured to iterate the array',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 3 },
    explanation: {
      tech: "SplitInBatches in 'once' mode emits the first batch and stops — multi-batch processing requires the feedback edge from the 'has items' output back into the batch node.",
      'non-tech': "A loop that isn't iterating processes the first item and ends. Inspect the upstream node's item-processing mode before assuming the data is the problem.",
    },
    keyInsight: "A loop that runs once is not a loop — verify the iteration feedback edge and the node's processing mode before testing at scale.",
  },
  {
    conceptId: 'genai-m5-transforms',
    question: {
      tech: "Aarav receives claims from two sources: API A returns `{ claimId, amount, status }` and API B returns `{ id, value, state }`. The downstream classifier expects `{ claim_id, amount, status }`. What is the correct approach?",
      'non-tech': "Rhea's workflow merges data from Google Sheets (column: 'Policy Number') and a webhook (field: 'policyNum'). The merge step finds zero matches. What is the root cause?",
    },
    options: {
      tech: [
        'A. Run two separate workflows — one per API — and merge their results downstream',
        'B. Add a Set node after each source that maps to the canonical schema pre-merge',
        'C. Use a Function node with a try/catch that handles either format at runtime',
        'D. Add field aliases inside the classifier prompt so it accepts either shape',
      ],
      'non-tech': [
        'A. The merge node is joining on the wrong key — it defaults to the first field by name',
        "B. Google Sheets' 'Policy Number' and the webhook's 'policyNum' are different strings",
        'C. Google Sheets returns strings and the webhook returns numbers — the types collide',
        'D. The merge node requires both sources to have identical schemas — unsupported here',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 1 },
    explanation: {
      tech: "Normalising to a canonical schema right after each source keeps every downstream node identical and testable. One Set node per source is safer than dynamic handling downstream.",
      'non-tech': "Merge joins on matching field names. 'Policy Number' ≠ 'policyNum' — rename one with a Set node before the merge step. Field-name mismatches are the most common merge failure.",
    },
    keyInsight: "Normalise to a canonical schema at the source, not at the consumer. Every node downstream becomes simpler when the shape is consistent.",
  },
  {
    conceptId: 'genai-m5-routing',
    question: {
      tech: "The AI classifier returns a confidence field: 0.0–1.0. Aarav routes claims above 0.85 to auto-process, 0.5–0.85 to human review, below 0.5 to rejection queue. After two weeks, 60% of claims are in human review. What should he investigate first?",
      'non-tech': "Rhea's workflow sends policy renewals to one of three teams based on policy type. After a week, Team C reports receiving renewals that should go to Team A. What is the most productive first diagnostic step?",
    },
    options: {
      tech: [
        'A. Lower the auto-process threshold to 0.75 to drain the human review queue faster',
        'B. Audit the actual confidence distribution before re-tuning any threshold values',
        'C. Add a fourth route for the 0.75–0.85 band to spread reviewer load more evenly',
        'D. Drop confidence-band routing and switch to a fixed classification label per case',
      ],
      'non-tech': [
        'A. Ask Team C to forward the misrouted renewals to Team A and watch for repeats',
        'B. Print the exact field values the router is reading and compare them to the conditions',
        "C. Re-run the workflow on last week's data to attempt to reproduce the misroute",
        'D. Add a logging node after the router to capture which path each renewal takes',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 1 },
    explanation: {
      tech: "If 60% of claims cluster in the mid-range, the problem is classifier calibration — not threshold position. Adjusting thresholds without auditing the distribution is guessing.",
      'non-tech': "Routing bugs are almost always a mismatch between the value the router reads and the condition written. Print the runtime value before changing any logic.",
    },
    keyInsight: "Before tuning a routing condition, audit what values are actually arriving at the router. Most routing bugs are data shape or field-name errors, not logic errors.",
  },
  {
    conceptId: 'genai-m5-hitl',
    question: {
      tech: "Aarav adds a Wait node to pause the workflow until a Slack approver clicks 'Approve.' The workflow runs but the Wait node times out after 5 minutes. The approver received the Slack message but never saw a button. What is the issue?",
      'non-tech': "Rhea's approval flow sends an email to a manager and waits for a reply. After two days, the manager replies 'Approved' but the workflow never continues. What is the most likely design gap?",
    },
    options: {
      tech: [
        'A. Slack nodes do not support interactive components — switch to a webhook approval flow',
        'B. Slack message went out as plain text — the interactive button payload was never added',
        'C. The Wait node timeout is set too short — extend it from 5 to 30 minutes',
        'D. The approver needs an n8n workspace seat before they can interact with workflows',
      ],
      'non-tech': [
        'A. Free-text email replies cannot resume a Wait node — needs a structured link or form',
        'B. The manager replied to the wrong email thread and the reply never reached the workflow',
        'C. n8n does not support email-based approval flows — switch to Slack or a web form',
        'D. The Wait node expired before the manager replied — re-trigger the workflow now',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 0 },
    explanation: {
      tech: "The Wait node resumes on a webhook callback. The Slack message must carry an interactive block whose action URL points at the Wait node's webhook. Plain-text Slack cannot trigger resume.",
      'non-tech': "n8n's Wait node resumes on a webhook call — it cannot parse free-text email replies. Use a structured link (button → webhook) or a form-based flow.",
    },
    keyInsight: "Human-in-the-loop means a structured handshake — a link, a button, a form. Free-text replies cannot resume a Wait node. Design the interface first.",
  },
  {
    conceptId: 'genai-m5-agents',
    question: {
      tech: "Aarav builds a chat agent for internal claims queries. After 10 messages, the agent starts forgetting context from the first 3 exchanges. The Window Buffer Memory is set to 10. What is happening?",
      'non-tech': "Rhea deploys a policy FAQ chatbot with memory. After a few days, users report the bot sometimes confuses two different users' questions in a single session. What is the most likely configuration error?",
    },
    options: {
      tech: [
        'A. The model context window is smaller than ten exchanges — reduce the buffer size',
        'B. Window Buffer is a sliding window — message 11 evicts message 1 by design',
        'C. The agent node needs to be restarted after every ten exchanges to clear the buffer',
        'D. The memory node is mis-wired — it is storing raw tokens instead of full messages',
      ],
      'non-tech': [
        'A. A shared, hardcoded session ID — every user is writing to the same memory store',
        'B. Window Buffer Memory is too large and mixes context across separate conversations',
        'C. The model is hallucinating cross-user data — switch to a more accurate model',
        'D. The chatbot needs a login system before per-user memory can possibly work',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 0 },
    explanation: {
      tech: "Window Buffer Memory is intentionally a sliding window. For recall beyond the window, use summary memory or a vector-store-backed memory that persists key facts separately.",
      'non-tech': "n8n separates conversations by session ID. If every user hits the same hardcoded session ID, they all share one memory store. Session ID must be unique per user conversation.",
    },
    keyInsight: "Memory without session isolation is shared state. Trace the session ID through the workflow — a static session ID means all users share the same memory.",
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

type Props = { track: GenAITrack; onBack: () => void; onNext?: () => void; nextLabel?: string };

function computeXP(completedSections: Set<string>, conceptStates: Record<string, { pKnow: number }>) {
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = Object.values(conceptStates).reduce((sum, s) => sum + Math.round(s.pKnow * QUIZ_XP), 0);
  return { readingXP, quizXP, total: readingXP + quizXP };
}


// ── M5 Interactive Tools — authentic n8n editor mockups ─────────────────────

// Section 01: SplitInBatches as an n8n canvas. The learner sees the actual
// SplitInBatches node wired into a downstream Process step, drags the
// feedback edge ON/OFF, scrubs array + batch size, and watches a row of
// batch tokens animate through the loop (or stall after batch 1 when the
// feedback edge is broken).
const BatchSimulatorCard = ({ track }: { track: GenAITrack }) => {
  const [arraySize, setArraySize] = useState(track === 'tech' ? 20 : 50);
  const [batchSize, setBatchSize] = useState(track === 'tech' ? 5 : 10);
  const [feedbackEdge, setFeedbackEdge] = useState(false);
  const [running, setRunning] = useState(false);
  const [activeBatch, setActiveBatch] = useState<number | null>(null);
  const batches = Math.max(1, Math.ceil(arraySize / batchSize));
  const visibleBatches = Math.min(batches, 6);
  const willRunCount = feedbackEdge ? batches : 1;
  const processedItems = feedbackEdge ? arraySize : Math.min(batchSize, arraySize);

  const run = useCallback(() => {
    if (running) return;
    setRunning(true);
    setActiveBatch(0);
    const total = feedbackEdge ? batches : 1;
    let i = 0;
    const tick = () => {
      i += 1;
      if (i >= total) {
        setActiveBatch(total - 1);
        setTimeout(() => { setRunning(false); setActiveBatch(null); }, 600);
        return;
      }
      setActiveBatch(i);
      setTimeout(tick, 380);
    };
    setTimeout(tick, 380);
  }, [feedbackEdge, batches, running]);

  // Node geometry
  const triggerX = 12, splitX = 188, procX = 396, sheetX = 600;
  const nodeY = 30;
  // Feedback loop curve goes UP from procX above and back DOWN into splitX
  const feedbackPath = `M ${procX + N8N_NW / 2} ${nodeY} C ${procX + N8N_NW / 2} -20 ${splitX + N8N_NW / 2} -20 ${splitX + N8N_NW / 2} ${nodeY}`;

  return (
    <N8nFrame filename={track === 'tech' ? 'splitinbatches-backlog.json' : 'splitinbatches-renewals.json'} status={running ? 'IDLE' : feedbackEdge ? 'ACTIVE' : 'ERROR'}>
      {/* Canvas */}
      <N8nCanvas width={780} height={150}>
        <svg style={{ position: 'absolute' as const, top: 0, left: 0, width: 780, height: 150, pointerEvents: 'none' as const, overflow: 'visible' as const }}>
          <defs>
            <marker id="bs-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.25)" />
            </marker>
            <marker id="bs-arrow-loop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#0891B2" />
            </marker>
          </defs>
          {/* trigger → split */}
          <path d={n8nBezier(triggerX + N8N_NW, nodeY + N8N_NH / 2, splitX, nodeY + N8N_NH / 2)} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} fill="none" markerEnd="url(#bs-arrow)" />
          {/* split → process */}
          <path d={n8nBezier(splitX + N8N_NW, nodeY + N8N_NH / 2, procX, nodeY + N8N_NH / 2)} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} fill="none" markerEnd="url(#bs-arrow)" />
          {/* process → sheet */}
          <path d={n8nBezier(procX + N8N_NW, nodeY + N8N_NH / 2, sheetX, nodeY + N8N_NH / 2)} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} fill="none" markerEnd="url(#bs-arrow)" />
          {/* feedback edge (process bottom → split bottom) */}
          <path
            d={`M ${procX + N8N_NW / 2} ${nodeY + N8N_NH} C ${procX + N8N_NW / 2} ${nodeY + N8N_NH + 50} ${splitX + N8N_NW / 2} ${nodeY + N8N_NH + 50} ${splitX + N8N_NW / 2} ${nodeY + N8N_NH}`}
            stroke={feedbackEdge ? '#0891B2' : 'rgba(220,38,38,0.55)'} strokeWidth={2}
            strokeDasharray={feedbackEdge ? undefined : '6 5'} fill="none"
            markerEnd={feedbackEdge ? 'url(#bs-arrow-loop)' : undefined}
          />
        </svg>
        <N8nNodeCard x={triggerX} y={nodeY} label={track === 'tech' ? 'HTTP Pull Backlog' : 'Read Renewals Sheet'} typeKey={track === 'tech' ? 'data' : 'data'} icon={track === 'tech' ? '⇄' : '⊞'} />
        <N8nNodeCard x={splitX}   y={nodeY} label="SplitInBatches" typeKey="loop" icon="↻" subLabel={`BATCH SIZE ${batchSize}`} status={activeBatch !== null ? 'pending' : undefined} />
        <N8nNodeCard x={procX}    y={nodeY} label={track === 'tech' ? 'OpenAI Classify' : 'Claude Digest'} typeKey="ai" icon="◈" status={activeBatch !== null ? 'pending' : undefined} />
        <N8nNodeCard x={sheetX}   y={nodeY} label={track === 'tech' ? 'Tracker Sheet' : 'Send Digest'} typeKey="output" icon={track === 'tech' ? '⊞' : '✉'} />
      </N8nCanvas>

      {/* Batch ticker */}
      <div style={{ padding: '10px 16px', background: '#0A0D14', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}>EXECUTION · {batches} batches of {batchSize}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#A3A3A3' }}>{processedItems}/{arraySize} items would process</div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
          {Array.from({ length: visibleBatches }, (_, i) => {
            const willRun = i < willRunCount;
            const isActive = activeBatch === i;
            const start = i * batchSize + 1;
            const end = Math.min((i + 1) * batchSize, arraySize);
            return (
              <div key={i} style={{
                padding: '4px 8px',
                borderRadius: 5,
                background: isActive ? '#0891B2' : willRun ? 'rgba(8,145,178,0.14)' : 'rgba(220,38,38,0.10)',
                border: `1px solid ${isActive ? '#06B6D4' : willRun ? 'rgba(8,145,178,0.40)' : 'rgba(220,38,38,0.35)'}`,
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                color: isActive ? '#fff' : willRun ? '#67E8F9' : '#FCA5A5',
                transition: 'all 0.2s',
              }}>{i + 1}·{start}-{end}</div>
            );
          })}
          {batches > visibleBatches && <div style={{ padding: '4px 8px', fontSize: 10, color: '#525252', fontFamily: "'JetBrains Mono', monospace" }}>+{batches - visibleBatches} more</div>}
        </div>
      </div>

      {/* Controls + verdict */}
      <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 14, alignItems: 'center', background: '#141920', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#A3A3A3', marginBottom: 4 }}>ARRAY SIZE · {arraySize}</div>
          <input type="range" min={5} max={track === 'tech' ? 60 : 100} value={arraySize} onChange={e => setArraySize(+e.target.value)} style={{ width: '100%', accentColor: '#0891B2' }} />
        </div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#A3A3A3', marginBottom: 4 }}>BATCH SIZE · {batchSize}</div>
          <input type="range" min={2} max={20} value={batchSize} onChange={e => setBatchSize(+e.target.value)} style={{ width: '100%', accentColor: '#0891B2' }} />
        </div>
        <button
          type="button"
          onClick={run}
          disabled={running}
          style={{
            appearance: 'none', cursor: running ? 'wait' : 'pointer',
            background: running ? 'rgba(255,255,255,0.06)' : '#FF6D5A',
            border: 'none', borderRadius: 5, padding: '7px 16px',
            fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'inherit',
          }}
        >{running ? '▶ Running…' : '▶ Execute'}</button>
      </div>

      {/* Feedback edge toggle */}
      <div
        onClick={() => { setFeedbackEdge(f => !f); setActiveBatch(null); }}
        style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', background: feedbackEdge ? 'rgba(8,145,178,0.10)' : 'rgba(220,38,38,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: feedbackEdge ? '#67E8F9' : '#FCA5A5', marginBottom: 2 }}>
            FEEDBACK EDGE (has_items → SplitInBatches): {feedbackEdge ? 'CONNECTED' : 'DISCONNECTED'}
          </div>
          <div style={{ fontSize: 10, color: feedbackEdge ? 'rgba(103,232,249,0.85)' : 'rgba(252,165,165,0.85)', lineHeight: 1.5 }}>
            {feedbackEdge ? `All ${arraySize} items will process across ${batches} batches.` : `Only batch 1 (${Math.min(batchSize, arraySize)} of ${arraySize} items) processes — rest are silently dropped.`}
          </div>
        </div>
        <div style={{ width: 40, height: 22, borderRadius: 11, background: feedbackEdge ? '#0891B2' : '#374151', position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 2, left: feedbackEdge ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
        </div>
      </div>
    </N8nFrame>
  );
};

// Section 02: Field mapper rendered as the n8n Set node configuration
// pane — actual canvas above (Source → Set → Downstream), Set node
// editor below showing source schema on the left and target schema on
// the right with mapping arrows drawn between them when the learner
// connects fields.
const FieldMapperCard = ({ track }: { track: GenAITrack }) => {
  type Field = { name: string; type: string };
  const sourceFields: Field[] = track === 'tech'
    ? [
        { name: 'claimID',     type: 'string' },
        { name: 'subject',     type: 'string' },
        { name: 'body',        type: 'text'   },
        { name: 'policyCode',  type: 'string' },
      ]
    : [
        { name: 'row_id',          type: 'string' },
        { name: 'exception_date',  type: 'date'   },
        { name: 'Renewal Manager', type: 'string' },
        { name: 'Status',          type: 'string' },
        { name: 'Notes',           type: 'text'   },
      ];
  const targetFields: Field[] = track === 'tech'
    ? [
        { name: 'claim_id',             type: 'string' },
        { name: 'policy_code',          type: 'string' },
        { name: 'classification_input', type: 'text'   },
      ]
    : [
        { name: 'exception_id',  type: 'string' },
        { name: 'date',          type: 'date'   },
        { name: 'manager',       type: 'string' },
        { name: 'status',        type: 'string' },
        { name: 'summary_input', type: 'text'   },
      ];
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
  const reset = () => { setMappings({}); setSelected(null); setChecked(false); };

  const score = Object.entries(mappings).filter(([src, tgt]) => correct[src] === tgt).length;
  const total = Object.keys(correct).length;
  const allMapped = score === total;

  // Layout
  const ROW_H = 26;
  const SRC_X = 24, TGT_X = 384;
  const FIELD_W = 200;
  const HEADER_Y = 14;
  const FIRST_FIELD_Y = 44;

  const fieldY = (idx: number) => FIRST_FIELD_Y + idx * (ROW_H + 4);

  return (
    <N8nFrame filename={track === 'tech' ? 'set-node-classifier-input.json' : 'set-node-renewals-input.json'} status={checked && allMapped ? 'ACTIVE' : 'EDITING'}>
      {/* Mini canvas at top */}
      <N8nCanvas width={640} height={100}>
        <svg style={{ position: 'absolute' as const, top: 0, left: 0, width: 640, height: 100, pointerEvents: 'none' as const, overflow: 'visible' as const }}>
          <defs>
            <marker id="fm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.25)" />
            </marker>
          </defs>
          <path d={n8nBezier(12 + N8N_NW, 20 + N8N_NH / 2, 220, 20 + N8N_NH / 2)} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} fill="none" markerEnd="url(#fm-arrow)" />
          <path d={n8nBezier(220 + N8N_NW, 20 + N8N_NH / 2, 428, 20 + N8N_NH / 2)} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} fill="none" markerEnd="url(#fm-arrow)" />
        </svg>
        <N8nNodeCard x={12}  y={20} label={track === 'tech' ? 'Claims Source' : 'Renewals Sheet'} typeKey="data" icon={track === 'tech' ? '⇄' : '⊞'} />
        <N8nNodeCard x={220} y={20} label="Set (Edit Fields)" typeKey="transform" icon="⚙" subLabel={`MAPPING ${Object.keys(mappings).length}/${total}`} status={checked ? (allMapped ? 'ok' : 'fail') : undefined} />
        <N8nNodeCard x={428} y={20} label={track === 'tech' ? 'OpenAI Classify' : 'Claude Digest'} typeKey="ai" icon="◈" ghost={!checked || !allMapped} />
      </N8nCanvas>

      {/* Set node editor panel */}
      <div style={{ padding: '12px 16px', background: '#141920', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}>SET NODE · MAP RAW FIELDS → CANONICAL SCHEMA</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#A3A3A3' }}>{Object.keys(mappings).length}/{total} mapped</div>
        </div>

        <div style={{ position: 'relative' as const, height: Math.max(FIRST_FIELD_Y + Math.max(sourceFields.length, targetFields.length) * (ROW_H + 4) + 6, 200) }}>
          {/* mapping arrows */}
          <svg style={{ position: 'absolute' as const, top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' as const }}>
            {Object.entries(mappings).map(([src, tgt]) => {
              const srcIdx = sourceFields.findIndex(f => f.name === src);
              const tgtIdx = targetFields.findIndex(f => f.name === tgt);
              if (srcIdx < 0 || tgtIdx < 0) return null;
              const x1 = SRC_X + FIELD_W;
              const y1 = fieldY(srcIdx) + ROW_H / 2;
              const x2 = TGT_X;
              const y2 = fieldY(tgtIdx) + ROW_H / 2;
              const isOk = checked && correct[src] === tgt;
              const isWrong = checked && correct[src] !== tgt;
              const stroke = isOk ? '#10B981' : isWrong ? '#DC2626' : '#7C3AED';
              return <path key={`${src}-${tgt}`} d={n8nBezier(x1, y1, x2, y2)} stroke={stroke} strokeWidth={1.5} fill="none" />;
            })}
          </svg>

          {/* Column headers */}
          <div style={{ position: 'absolute' as const, top: HEADER_Y, left: SRC_X, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#FCA5A5', letterSpacing: '0.10em' }}>RAW SOURCE</div>
          <div style={{ position: 'absolute' as const, top: HEADER_Y, left: TGT_X, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#67E8F9', letterSpacing: '0.10em' }}>CANONICAL TARGET</div>

          {/* Source fields */}
          {sourceFields.map((f, i) => {
            const isSel = selected === f.name;
            const tgt = mappings[f.name];
            const isOk = checked && tgt && correct[f.name] === tgt;
            const isWrong = checked && tgt && correct[f.name] !== tgt;
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => { setSelected(prev => prev === f.name ? null : f.name); setChecked(false); }}
                style={{
                  appearance: 'none', cursor: 'pointer',
                  position: 'absolute' as const,
                  left: SRC_X, top: fieldY(i), width: FIELD_W, height: ROW_H,
                  padding: '0 10px',
                  background: isSel ? 'rgba(124,58,237,0.20)' : (isWrong ? 'rgba(220,38,38,0.10)' : isOk ? 'rgba(16,185,129,0.10)' : tgt ? 'rgba(124,58,237,0.10)' : '#0F1117'),
                  border: `1px solid ${isSel ? '#A78BFA' : isWrong ? '#DC2626' : isOk ? '#10B981' : tgt ? 'rgba(124,58,237,0.30)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 5,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: isWrong ? '#FCA5A5' : isOk ? '#86EFAC' : '#E5E5E5' }}>{f.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: '#A3A3A3' }}>{f.type}</span>
              </button>
            );
          })}

          {/* Target fields */}
          {targetFields.map((f, i) => {
            const isMapped = Object.values(mappings).includes(f.name);
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => selected && mapTo(f.name)}
                disabled={!selected}
                style={{
                  appearance: 'none', cursor: selected ? 'pointer' : 'default',
                  position: 'absolute' as const,
                  left: TGT_X, top: fieldY(i), width: FIELD_W, height: ROW_H,
                  padding: '0 10px',
                  background: isMapped ? 'rgba(8,145,178,0.14)' : selected ? 'rgba(103,232,249,0.08)' : '#0F1117',
                  border: `1px solid ${isMapped ? '#06B6D4' : selected ? 'rgba(103,232,249,0.40)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 5,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: isMapped ? '#67E8F9' : '#E5E5E5' }}>{f.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: '#A3A3A3' }}>{f.type}</span>
              </button>
            );
          })}
        </div>

        {/* Action bar */}
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 10, color: '#A3A3A3', fontFamily: "'JetBrains Mono', monospace" }}>
            {selected ? `Selected ${selected} — click a canonical field to map it.` : 'Click a raw source field, then click a canonical target to wire them.'}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={reset} style={{ appearance: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5, padding: '5px 11px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>RESET</button>
            <button type="button" onClick={() => setChecked(true)} disabled={Object.keys(mappings).length < total} style={{ appearance: 'none', cursor: Object.keys(mappings).length < total ? 'not-allowed' : 'pointer', background: Object.keys(mappings).length < total ? 'rgba(255,255,255,0.06)' : '#FF6D5A', border: 'none', borderRadius: 5, padding: '6px 14px', fontSize: 11, fontWeight: 700, color: Object.keys(mappings).length < total ? 'rgba(255,255,255,0.4)' : '#fff', fontFamily: 'inherit' }}>EXECUTE NODE</button>
          </div>
        </div>
      </div>

      {checked && (
        <div style={{ padding: '10px 16px', background: allMapped ? 'rgba(16,185,129,0.10)' : 'rgba(245,158,11,0.10)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 11.5, color: allMapped ? '#86EFAC' : '#FCD34D' }}>
            <span style={{ fontWeight: 700 }}>{score}/{total} mappings correct.</span> {allMapped ? 'Downstream node can run — every required field is wired.' : 'Red arrows are wrong; reset and look for the canonical field the downstream node expects.'}
          </span>
        </div>
      )}
    </N8nFrame>
  );
};

// Section 03: IF/Switch routing rendered as an n8n canvas with the Switch
// node fanning out to three downstream branches. The learner sees an
// inbound queue at the top, picks the branch each item should take, then
// presses Execute — items animate into the correct downstream node when
// right, into the wrong one (flashing red) when wrong.
const RoutePredictorCard = ({ track }: { track: GenAITrack }) => {
  type Branch = 'A' | 'B' | 'C';
  type Item = { id: string; label: string; field: string; value: string; correct: Branch };
  const items: Item[] = track === 'tech' ? [
    { id: 'CLM-4412', label: 'CLM-4412', field: 'confidence', value: '0.71', correct: 'B' },
    { id: 'CLM-4413', label: 'CLM-4413', field: 'confidence', value: '0.91', correct: 'A' },
    { id: 'CLM-4414', label: 'CLM-4414', field: 'confidence', value: '0.55', correct: 'C' },
    { id: 'CLM-4415', label: 'CLM-4415', field: 'confidence', value: '0.63', correct: 'B' },
  ] : [
    { id: '4412', label: '#4412', field: 'status',  value: 'critical',   correct: 'A' },
    { id: '4419', label: '#4419', field: 'status',  value: 'pending+2d', correct: 'C' },
    { id: '4433', label: '#4433', field: 'status',  value: 'pending+5d', correct: 'B' },
    { id: '4441', label: '#4441', field: 'status',  value: 'critical',   correct: 'A' },
  ];
  const BRANCHES: { id: Branch; label: string; node: string; icon: string; rule: string }[] = track === 'tech' ? [
    { id: 'A', label: 'Auto-write',     node: 'Tracker Sheet',     icon: '⊞', rule: 'confidence ≥ 0.85' },
    { id: 'B', label: 'Human review',   node: 'Review Queue',      icon: '⚑', rule: '0.60 ≤ conf < 0.85' },
    { id: 'C', label: 'Manual triage',  node: 'Triage Dead-letter', icon: '⚠', rule: 'confidence < 0.60' },
  ] : [
    { id: 'A', label: 'Immediate',      node: 'Escalate Slack',    icon: '⚡', rule: 'status = critical' },
    { id: 'B', label: 'Manager F/U',    node: 'Manager Email',     icon: '✉', rule: 'pending > 4d' },
    { id: 'C', label: 'Weekly summary', node: 'Weekly Digest',     icon: '☰', rule: 'pending ≤ 4d' },
  ];

  const [picks, setPicks] = useState<Record<string, Branch>>({});
  const [revealed, setRevealed] = useState(false);
  const allPicked = items.every(i => picks[i.id]);
  const score = revealed ? items.filter(i => picks[i.id] === i.correct).length : 0;

  // Geometry
  const switchX = 280, switchY = 160;
  const branchX = [560, 560, 560];
  const branchY = [40, 160, 280];

  return (
    <N8nFrame filename={track === 'tech' ? 'confidence-router.json' : 'priority-router.json'} status={revealed ? (score === items.length ? 'ACTIVE' : 'ERROR') : 'EDITING'}>
      <N8nCanvas width={780} height={400}>
        <svg style={{ position: 'absolute' as const, top: 0, left: 0, width: 780, height: 400, pointerEvents: 'none' as const, overflow: 'visible' as const }}>
          <defs>
            <marker id="rp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.25)" />
            </marker>
          </defs>
          {/* Switch → each branch */}
          {BRANCHES.map((b, i) => {
            const x1 = switchX + N8N_NW, y1 = switchY + N8N_NH / 2;
            const x2 = branchX[i], y2 = branchY[i] + N8N_NH / 2;
            return <path key={b.id} d={n8nBezier(x1, y1, x2, y2)} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} fill="none" markerEnd="url(#rp-arrow)" />;
          })}
        </svg>

        {/* Inbound queue (left) */}
        <div style={{ position: 'absolute' as const, left: 12, top: 30, width: 200 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginBottom: 6 }}>INBOUND QUEUE</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {items.map(item => {
              const pick = picks[item.id];
              const isRight = revealed && pick === item.correct;
              const isWrong = revealed && pick && pick !== item.correct;
              return (
                <div key={item.id} style={{
                  background: isRight ? 'rgba(16,185,129,0.10)' : isWrong ? 'rgba(220,38,38,0.10)' : '#13182A',
                  border: `1px solid ${isRight ? '#10B981' : isWrong ? '#DC2626' : 'rgba(255,255,255,0.10)'}`,
                  borderRadius: 6, padding: '7px 9px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#E5E5E5', fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</span>
                    <span style={{ fontSize: 9, color: '#A3A3A3', fontFamily: "'JetBrains Mono', monospace" }}>{item.field}={item.value}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {BRANCHES.map(b => {
                      const isPicked = pick === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => !revealed && setPicks(p => ({ ...p, [item.id]: b.id }))}
                          disabled={revealed}
                          style={{
                            appearance: 'none', cursor: revealed ? 'default' : 'pointer',
                            flex: 1, padding: '3px 0',
                            background: isPicked ? (revealed ? (b.id === item.correct ? '#10B981' : '#DC2626') : '#7C3AED') : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isPicked ? 'transparent' : 'rgba(255,255,255,0.10)'}`,
                            borderRadius: 4, fontSize: 9.5, fontWeight: 700,
                            color: isPicked ? '#fff' : '#A3A3A3',
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >{b.id}</button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Switch node center */}
        <N8nNodeCard x={switchX} y={switchY} label="Switch" typeKey="transform" icon="◆" subLabel={`ON ${items[0]?.field}`} />

        {/* Branch nodes */}
        {BRANCHES.map((b, i) => {
          const itemsInBranch = revealed ? items.filter(it => picks[it.id] === b.id) : [];
          const correctInBranch = revealed ? itemsInBranch.filter(it => it.correct === b.id).length : 0;
          const wrongInBranch = itemsInBranch.length - correctInBranch;
          return (
            <React.Fragment key={b.id}>
              <N8nNodeCard
                x={branchX[i]} y={branchY[i]}
                label={b.node}
                typeKey={b.id === 'A' ? 'output' : b.id === 'B' ? 'wait' : 'error'}
                icon={b.icon}
                subLabel={b.rule.toUpperCase()}
              />
              {revealed && itemsInBranch.length > 0 && (
                <div style={{ position: 'absolute' as const, left: branchX[i] + N8N_NW + 10, top: branchY[i] + 2, width: 100, fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}>
                  {correctInBranch > 0 && <div style={{ color: '#10B981' }}>{correctInBranch} correct</div>}
                  {wrongInBranch > 0 && <div style={{ color: '#DC2626' }}>{wrongInBranch} misrouted</div>}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </N8nCanvas>

      {/* Rule legend + actions */}
      <div style={{ padding: '10px 16px', background: '#141920', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' as const }}>
          {BRANCHES.map(b => (
            <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ padding: '2px 6px', background: 'rgba(124,58,237,0.20)', borderRadius: 3, fontSize: 9, fontWeight: 800, color: '#A78BFA', fontFamily: "'JetBrains Mono', monospace" }}>{b.id}</span>
              <span style={{ fontSize: 10, color: '#A3A3A3' }}>{b.rule}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {revealed ? (
            <>
              <span style={{ fontSize: 11, fontWeight: 700, color: score === items.length ? '#10B981' : '#F59E0B', alignSelf: 'center' as const }}>{score}/{items.length} correct</span>
              <button type="button" onClick={() => { setPicks({}); setRevealed(false); }} style={{ appearance: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5, padding: '5px 12px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>TRY AGAIN</button>
            </>
          ) : (
            <button type="button" onClick={() => allPicked && setRevealed(true)} disabled={!allPicked} style={{ appearance: 'none', cursor: allPicked ? 'pointer' : 'not-allowed', background: allPicked ? '#FF6D5A' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 5, padding: '6px 14px', fontSize: 11, fontWeight: 700, color: allPicked ? '#fff' : 'rgba(255,255,255,0.4)', fontFamily: 'inherit' }}>EXECUTE SWITCH</button>
          )}
        </div>
      </div>
    </N8nFrame>
  );
};

// Section 04: Wait + webhook approval gate rendered as an n8n canvas
// running across the top, paired with the actual Slack interactive
// message the Wait node sends. Both halves stay in sync — pressing
// Approve/Reject/Simulate-48h in Slack lights up the matching branch
// in the canvas and animates the workflow's resume.
const ApprovalSimulatorCard = ({ track }: { track: GenAITrack }) => {
  type ItemState = 'pending' | 'approved' | 'rejected' | 'escalated';
  const [state, setState] = useState<ItemState>('pending');
  const item = track === 'tech'
    ? { id: 'CLM-4412', label: 'Pharmacy override · Tier 2', confidence: '0.71', sla: 'Thursday 17:00', channel: 'claims-review' }
    : { id: '#4412', label: 'Escalate to regional manager', days: '6d open (SLA: 5d)', sla: 'Thursday 12:00', channel: 'ops-approvals' };

  const upstreamX = 12, waitX = 200, approveX = 408, rejectX = 408, escalateX = 408;
  const upstreamY = 140;
  const waitY = 140;
  const approveY = 30;
  const rejectY = 140;
  const escalateY = 250;

  return (
    <N8nFrame filename={track === 'tech' ? 'wait-approval-claim.json' : 'wait-approval-exception.json'} status={state === 'pending' ? 'IDLE' : 'ACTIVE'}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 0 }}>
        {/* LEFT: canvas */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <N8nCanvas width={620} height={340}>
            <svg style={{ position: 'absolute' as const, top: 0, left: 0, width: 620, height: 340, pointerEvents: 'none' as const, overflow: 'visible' as const }}>
              <defs>
                <marker id="ap-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.25)" />
                </marker>
              </defs>
              {/* upstream → wait */}
              <path d={n8nBezier(upstreamX + N8N_NW, upstreamY + N8N_NH / 2, waitX, waitY + N8N_NH / 2)} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} fill="none" markerEnd="url(#ap-arrow)" />
              {/* wait → approve (top) */}
              <path d={n8nBezier(waitX + N8N_NW, waitY + N8N_NH / 2, approveX, approveY + N8N_NH / 2)} stroke={state === 'approved' ? '#10B981' : 'rgba(255,255,255,0.10)'} strokeWidth={state === 'approved' ? 2 : 1.5} strokeDasharray={state === 'approved' ? undefined : '4 5'} fill="none" markerEnd="url(#ap-arrow)" />
              {/* wait → reject (middle) */}
              <path d={n8nBezier(waitX + N8N_NW, waitY + N8N_NH / 2, rejectX, rejectY + N8N_NH / 2)} stroke={state === 'rejected' ? '#DC2626' : 'rgba(255,255,255,0.10)'} strokeWidth={state === 'rejected' ? 2 : 1.5} strokeDasharray={state === 'rejected' ? undefined : '4 5'} fill="none" markerEnd="url(#ap-arrow)" />
              {/* wait → escalate (bottom) */}
              <path d={n8nBezier(waitX + N8N_NW, waitY + N8N_NH / 2, escalateX, escalateY + N8N_NH / 2)} stroke={state === 'escalated' ? '#A855F7' : 'rgba(255,255,255,0.10)'} strokeWidth={state === 'escalated' ? 2 : 1.5} strokeDasharray={state === 'escalated' ? undefined : '4 5'} fill="none" markerEnd="url(#ap-arrow)" />
            </svg>

            <N8nNodeCard x={upstreamX} y={upstreamY} label={track === 'tech' ? 'OpenAI Classify' : 'Validate Brief'} typeKey={track === 'tech' ? 'ai' : 'transform'} icon={track === 'tech' ? '◈' : '✓'} />
            <N8nNodeCard x={waitX}     y={waitY}     label="Wait (webhook)" typeKey="wait" icon="⏱" subLabel={`TIMEOUT 48H · ${state.toUpperCase()}`} status={state === 'pending' ? 'pending' : 'ok'} />
            <N8nNodeCard x={approveX}  y={approveY}  label={track === 'tech' ? 'Write Tracker' : 'Send Escalation'} typeKey="output" icon={track === 'tech' ? '⊞' : '✉'} ghost={state !== 'approved'} status={state === 'approved' ? 'ok' : undefined} />
            <N8nNodeCard x={rejectX}   y={rejectY}   label={track === 'tech' ? 'Manual Triage' : 'Hold for Review'} typeKey="error" icon="⚠" ghost={state !== 'rejected'} status={state === 'rejected' ? 'fail' : undefined} />
            <N8nNodeCard x={escalateX} y={escalateY} label="Auto-Escalate" typeKey="transform" icon="⇑" ghost={state !== 'escalated'} status={state === 'escalated' ? 'pending' : undefined} subLabel="WEBHOOK /escalate" />
          </N8nCanvas>
        </div>

        {/* RIGHT: Slack interactive message */}
        <div style={{ background: '#1A1D21', display: 'flex', flexDirection: 'column' as const }}>
          {/* Slack header */}
          <div style={{ background: '#19171D', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #2D2D2D' }}>
            <div style={{ width: 24, height: 24, borderRadius: 5, background: '#4A154B', color: '#fff', fontWeight: 900, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif' }}>⧬</div>
            <div style={{ color: '#D1D1D1', fontSize: 12, fontWeight: 700 }}># {item.channel}</div>
            <div style={{ marginLeft: 'auto', fontSize: 9, color: '#616061', fontFamily: "'JetBrains Mono', monospace" }}>Slack</div>
          </div>

          {/* Slack message */}
          <div style={{ padding: 14, flex: 1 }}>
            <div style={{ background: '#222529', border: '1px solid #2D2D2D', borderLeft: '3px solid #4A154B', borderRadius: 6, padding: '10px 12px' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 5, background: '#059669', color: '#fff', fontWeight: 900, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>n8</div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#D1D1D1' }}>n8n Workflow Bot · <span style={{ background: '#3F0E40', padding: '0 4px', borderRadius: 3, fontSize: 9, color: '#D1D1D1' }}>APP</span></div>
                  <div style={{ fontSize: 9.5, color: '#616061', marginTop: 1 }}>Today at 09:14</div>
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: '#D1D1D1', lineHeight: 1.6, marginBottom: 10 }}>
                {track === 'tech'
                  ? <><strong>⚑ Review Required</strong><br />Claim <span style={{ color: '#7BCFA0' }}>{item.id}</span> — confidence <span style={{ color: '#F5A623' }}>{item.confidence}</span><br />Suggested: <span style={{ color: '#A78BFA' }}>{item.label}</span><br />SLA: <strong>{item.sla}</strong></>
                  : <><strong>⚑ Approval Required</strong><br />Exception <span style={{ color: '#7BCFA0' }}>{item.id}</span> — {item.days}<br />Action: <span style={{ color: '#A78BFA' }}>{item.label}</span><br />SLA: <strong>{item.sla}</strong></>}
              </div>
              {state === 'pending' && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button type="button" onClick={() => setState('approved')} style={{ appearance: 'none', cursor: 'pointer', background: '#007A5A', border: 'none', borderRadius: 4, padding: '6px 14px', fontSize: 10.5, fontWeight: 700, color: '#fff', fontFamily: 'inherit' }}>✓ Approve</button>
                  <button type="button" onClick={() => setState('rejected')} style={{ appearance: 'none', cursor: 'pointer', background: 'transparent', border: '1px solid #616061', borderRadius: 4, padding: '6px 14px', fontSize: 10.5, fontWeight: 700, color: '#D1D1D1', fontFamily: 'inherit' }}>✗ Reject</button>
                  <button type="button" onClick={() => setState('escalated')} style={{ appearance: 'none', cursor: 'pointer', background: 'transparent', border: '1px solid #616061', borderRadius: 4, padding: '6px 14px', fontSize: 10.5, fontWeight: 700, color: '#A78BFA', fontFamily: 'inherit' }}>⏱ Sim. 48h</button>
                </div>
              )}
              {state === 'approved' && <div style={{ padding: '6px 10px', background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.30)', borderRadius: 4, fontSize: 10, color: '#7BCFA0' }}>✓ Approved — webhook fired. Workflow resumed at Write Tracker.</div>}
              {state === 'rejected' && <div style={{ padding: '6px 10px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.30)', borderRadius: 4, fontSize: 10, color: '#FCA5A5' }}>✗ Rejected — webhook fired. Item routed to manual triage queue.</div>}
              {state === 'escalated' && <div style={{ padding: '6px 10px', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.30)', borderRadius: 4, fontSize: 10, color: '#C4B5FD' }}>⏱ 48h timeout — workflow auto-escalated to team lead via /webhook/escalate.</div>}
            </div>
            {state !== 'pending' && (
              <button type="button" onClick={() => setState('pending')} style={{ appearance: 'none', cursor: 'pointer', marginTop: 10, padding: '5px 12px', background: 'transparent', border: '1px solid #2D2D2D', borderRadius: 4, fontSize: 9.5, color: '#616061', fontFamily: 'inherit' }}>↺ Reset state</button>
            )}
          </div>

          <div style={{ padding: '8px 14px', borderTop: '1px solid #2D2D2D', fontSize: 9, color: '#616061', fontFamily: "'JetBrains Mono', monospace" }}>
            Wait node webhook: <span style={{ color: '#A78BFA' }}>/webhook/approve-{item.id}</span>
          </div>
        </div>
      </div>
    </N8nFrame>
  );
};

// Section 05: Window Buffer Memory rendered as the n8n AI Agent canvas
// (Chat Trigger → Agent → Memory) with TWO parallel session threads
// shown as Anthropic Console-style chat panels below. The learner steps
// each session forward and watches the memory IDs stay isolated — the
// second user never sees the first user's context.
const SessionIsolationCard = ({ track }: { track: GenAITrack }) => {
  type User = { id: string; name: string; color: string; questions: string[]; answers: string[] };
  const users: User[] = track === 'tech'
    ? [
        { id: 'user-7821', name: 'Aarav', color: '#10B981', questions: ['What is deductible for Plan B, Tier 2?', 'What about Tier 3?', 'Is there a family cap?'], answers: ['Plan B Tier 2 deductible: $1,400/yr (per plan_schedule.pdf).', 'Plan B Tier 3: $2,100/yr. (Plan B inherited from prior turn.)', 'Family OOP max for Plan B: $8,700 across all tiers.'] },
        { id: 'user-4203', name: 'Guest', color: '#A855F7', questions: ['What is the deductible?', 'For which plan?'],                                  answers: ['I need more context — which plan and tier?', 'No prior context in this session. Please specify the plan and tier.'] },
      ]
    : [
        { id: 'rhea-3', name: 'Rhea', color: '#10B981', questions: ['List open exceptions for Northstar West.', 'Which is highest priority?', 'Draft escalation for it.'], answers: ['3 open: #4412 (6d), #4419 (2d), #4433 (1d). SLA: 5d.', '#4412 — 6d open, 1d past SLA. (Carried from prior turn.)', 'Drafting escalation for #4412 (Northstar West, 6d) to regional manager…'] },
        { id: 'ops-9', name: 'Guest', color: '#A855F7', questions: ['What is the highest-priority exception?', 'Escalate it.'],                       answers: ['No account context in this session. Specify an account or exception ID.', 'I need an exception ID before escalating. (No prior context.)'] },
      ];

  const [turns, setTurns] = useState<Record<string, number>>({});
  const ask = (user: User) => {
    const current = turns[user.id] ?? 0;
    if (current < user.questions.length) setTurns(prev => ({ ...prev, [user.id]: current + 1 }));
  };
  const reset = () => setTurns({});

  // Canvas geometry
  const trigX = 12, agentX = 200, memX = 388, memY = 240, outX = 388;
  const upperY = 30;

  return (
    <N8nFrame filename={track === 'tech' ? 'agent-claims-faq.json' : 'agent-ops-faq.json'} status="ACTIVE">
      {/* Mini canvas at top */}
      <N8nCanvas width={620} height={150}>
        <svg style={{ position: 'absolute' as const, top: 0, left: 0, width: 620, height: 150, pointerEvents: 'none' as const, overflow: 'visible' as const }}>
          <defs>
            <marker id="si-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.25)" />
            </marker>
          </defs>
          <path d={n8nBezier(trigX + N8N_NW, upperY + N8N_NH / 2, agentX, upperY + N8N_NH / 2)} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} fill="none" markerEnd="url(#si-arrow)" />
          <path d={n8nBezier(agentX + N8N_NW, upperY + N8N_NH / 2, outX, upperY + N8N_NH / 2)} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} fill="none" markerEnd="url(#si-arrow)" />
          {/* memory attaches below agent */}
          <path d={`M ${agentX + N8N_NW / 2} ${upperY + N8N_NH} L ${agentX + N8N_NW / 2} ${upperY + N8N_NH + 35}`} stroke="rgba(234,179,8,0.55)" strokeWidth={1.5} fill="none" strokeDasharray="4 4" />
        </svg>
        <N8nNodeCard x={trigX}  y={upperY} label="Chat Trigger"     typeKey="trigger" icon="💬" subLabel="WEBHOOK · sessionId" />
        <N8nNodeCard x={agentX} y={upperY} label="AI Agent (Claude)" typeKey="ai"      icon="◈" />
        <N8nNodeCard x={outX}   y={upperY} label="Respond to Chat"  typeKey="output"  icon="↩" />
        {/* Memory node attached under the agent */}
        <N8nNodeCard x={agentX} y={upperY + N8N_NH + 35} label="Window Buffer Memory" typeKey="memory" icon="⌬" subLabel={`KEY {{ $json.sessionId }}`} />
      </N8nCanvas>

      {/* Two session threads */}
      <div style={{ padding: '12px 16px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0A0D14' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}>LIVE SESSIONS · MEMORY STORE KEYED BY sessionId</div>
          <button type="button" onClick={reset} style={{ appearance: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5, padding: '4px 10px', fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>RESET ALL</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {users.map(user => {
            const t = turns[user.id] ?? 0;
            const done = t >= user.questions.length;
            return (
              <div key={user.id} style={{ background: '#13182A', border: `1px solid ${user.color}40`, borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                {/* Session header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: user.color, color: '#0F1117', fontWeight: 900, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{user.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#E5E5E5' }}>{user.name}</div>
                      <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>sessionId: {user.id}</div>
                    </div>
                  </div>
                  <div style={{ padding: '2px 6px', background: `${user.color}1A`, borderRadius: 4, fontSize: 8.5, fontWeight: 700, color: user.color, fontFamily: "'JetBrains Mono', monospace" }}>BUFFER {t} / 10</div>
                </div>

                {/* Thread */}
                <div style={{ minHeight: 130, display: 'grid', gap: 5, alignContent: 'start' }}>
                  {Array.from({ length: t }, (_, i) => (
                    <React.Fragment key={i}>
                      <div style={{ alignSelf: 'flex-start' as const, maxWidth: '85%', padding: '5px 9px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px 8px 8px 2px', fontSize: 10.5, color: '#D4D4D4', lineHeight: 1.45 }}>{user.questions[i]}</div>
                      <div style={{ alignSelf: 'flex-end' as const, maxWidth: '85%', padding: '5px 9px', background: `${user.color}1A`, border: `1px solid ${user.color}40`, borderRadius: '8px 8px 2px 8px', fontSize: 10.5, color: '#E5E5E5', lineHeight: 1.45 }}>{user.answers[i]}</div>
                    </React.Fragment>
                  ))}
                  {t === 0 && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' as const, padding: '4px 0' }}>No conversation yet.</div>}
                </div>

                <button
                  type="button"
                  onClick={() => ask(user)}
                  disabled={done}
                  style={{
                    appearance: 'none', cursor: done ? 'default' : 'pointer',
                    background: done ? 'rgba(255,255,255,0.06)' : user.color,
                    border: 'none', borderRadius: 5, padding: '6px 12px',
                    fontSize: 10.5, fontWeight: 700, color: done ? 'rgba(255,255,255,0.5)' : '#0F1117', fontFamily: 'inherit',
                    marginTop: 'auto' as const,
                  }}
                >{done ? '✓ Session complete' : 'Ask next turn →'}</button>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 10, padding: '7px 10px', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.30)', borderRadius: 6, fontSize: 10, color: '#FCD34D', lineHeight: 1.55 }}>
          Each <code style={{ background: 'rgba(255,255,255,0.06)', padding: '0 4px', borderRadius: 3, fontFamily: "'JetBrains Mono', monospace" }}>sessionId</code> keys a separate Window Buffer. {users[0].name}'s context doesn't leak into Guest's session — even though both hit the same Agent + Memory node.
        </div>
      </div>
    </N8nFrame>
  );
};

// ── End M5 TiltCard Mockups ───────────────────────────────────────────────────

function CoreContent({ track, completedSections = new Set<string>(), activeSection = null }: { track: GenAITrack; completedSections?: Set<string>; activeSection?: string | null }) {
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
          <GenAIHeroCharacterStrip track={track} mentors={['anika', 'rohan', 'leela', 'kabir']} />
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
          expandedContent={<>The most reliable test for session isolation: two browser windows, two different user IDs, same question asked in both. Open both at the same time. If one window&apos;s answer is influenced by the other window&apos;s conversation, the session IDs are colliding. Run this test before any production deployment of a multi-user agent.</>}
          question={track === 'tech'
            ? "Aarav sets the session ID to `{{ $json.userId }}`. Two engineers with different user IDs still see each other's context. What is the most likely cause?"
            : "Rhea sets the session ID to the employee's name. Two employees named 'Aisha' at different sites report sharing context. What is the fix?"}
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

export default function GenAIPreRead5({ track, onBack, onNext, nextLabel }: Props) {
  const completionMessage = track === 'tech'
    ? 'You can iterate, branch, gate, and remember. The workflows from M04 run once. The patterns from M05 run at volume. Module 06 wires this into full agent architecture.'
    : 'Loops, routing, approvals, and memory in one system. Your automation can now handle real-world data size, team approvals, and stateful conversations. Module 06 shows how to scale this into production agent systems.';
  return (
    <GenAIPreReadLayout
      moduleNum="05" moduleLabel={TRACK_META[track].introTitle}
      accent={ACCENT} accentRgb={ACCENT_RGB}
      sections={SECTIONS} badges={BADGES} concepts={CONCEPTS}
      completionEmoji="◎" completionMessage={completionMessage} onBack={onBack} onNext={onNext} nextLabel={nextLabel}
    >
      <CoreContent track={track} />
    </GenAIPreReadLayout>
  );
}

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
import { ClaudeDesktopFrame, CDLabel, CD } from './claudeDesktopChrome';

const ACCENT = '#0891B2';
const ACCENT_RGB = '8,145,178';
const MODULE_NUM = '03';

const CONCEPTS = [
  { id: 'genai-m3-research',     label: 'Triangulating Sources',         color: '#0891B2' },
  { id: 'genai-m3-compression',  label: 'Compression vs Transcription',  color: '#7C3AED' },
  { id: 'genai-m3-5w1h',         label: '5W1H Framework',                color: '#2563EB' },
  { id: 'genai-m3-cove',         label: 'COVE Evaluation',               color: '#0F766E' },
  { id: 'genai-m3-draft',        label: 'Audience-First Drafting',       color: '#C2410C' },
];

const SECTIONS = [
  { id: 'genai-m3-research',    label: '1. Triangulating Sources' },
  { id: 'genai-m3-compression', label: '2. Summarization as Compression' },
  { id: 'genai-m3-5w1h',        label: '3. The 5W1H Framework' },
  { id: 'genai-m3-cove',        label: '4. COVE Evaluation' },
  { id: 'genai-m3-draft',       label: '5. Drafting from Synthesis' },
];

const BADGES = [
  { id: 'genai-m3-research',    icon: '🔎', label: 'Researcher',    color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
  { id: 'genai-m3-compression', icon: '🧬', label: 'Compressor',    color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'genai-m3-5w1h',        icon: '🧭', label: '5W1H Pro',      color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'genai-m3-cove',        icon: '⚖️', label: 'COVE Analyst',  color: '#0F766E', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'genai-m3-draft',       icon: '✍️', label: 'Drafter',       color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
];

const QUIZZES = [
  {
    conceptId: 'genai-m3-research',
    question: {
      engineer: "Aarav's research assistant returns a confident policy summary citing three clauses. A senior analyst finds a fourth clause in an amendment document that wasn't in the pipeline. What's the correct diagnosis?",
      'builder': "Rhea's Claude prompt reads only the current exception ticket. A recommendation turns out wrong because it missed the prior week's context thread. What should Rhea change first?",
    },
    options: {
      engineer: [
        'A. The model needs a larger context window to catch more clauses',
        'B. The pipeline is missing the amendment document as an input source',
        'C. The prompt needs to explicitly ask the model to look for amendments',
        "D. The model's temperature is too low — it's being too conservative",
      ],
      'builder': [
        'A. Rewrite the summarisation prompt to ask for more detail',
        'B. Add the prior exception thread as an input source to the pipeline',
        'C. Switch to a more capable model that handles longer context',
        'D. Ask analysts to review AI summaries before acting on them',
      ],
    },
    correctIndex: { engineer: 1, 'builder': 1 },
    explanation: {
      engineer: "The amendment document was never passed to the model — a larger context window cannot read a file the pipeline never loaded. Source coverage is a design decision, not a prompt instruction.",
      'builder': "The prior thread is a required input for this exception type. Without it, the model has half the context a senior analyst would use. Adding it to the pipeline is the highest-leverage fix.",
    },
    keyInsight: "Research pipelines that read one source are compression tools, not research tools. Triangulation requires intentional multi-source architecture.",
  },
  {
    conceptId: 'genai-m3-compression',
    question: {
      engineer: "Aarav's prompt says 'summarise the key clauses in three bullets.' Analysts say the output is accurate but they can't use it to decide. What is the most targeted fix?",
      'builder': "Rhea's brief describes the exception backlog accurately. Her director says she can't tell what she's being asked to do. What does Rhea need to add to the drafting prompt?",
    },
    options: {
      engineer: [
        'A. Increase the number of bullets from three to five',
        'B. Add the decision the analyst is making as a parameter to the prompt',
        'C. Use a stronger model that produces more decision-oriented outputs',
        'D. Add few-shot examples of good summaries to the prompt',
      ],
      'builder': [
        'A. Make the brief longer and more detailed',
        'B. Add a section listing all open exceptions',
        'C. Add a decision frame and recommendation to the end of the output structure',
        'D. Switch to a model better suited to executive communication',
      ],
    },
    correctIndex: { engineer: 1, 'builder': 2 },
    explanation: {
      engineer: "Adding the decision type (approve/escalate/deny) transforms the compression function. The model selects and weights information differently when it knows what decision the output serves.",
      'builder': "A brief without a recommendation leaves the reader to infer your position. The decision frame — what is the director being asked to decide, and what do you recommend — is the core output of a brief.",
    },
    keyInsight: "Compression without a specified purpose produces accurate summaries that nobody acts on.",
  },
  {
    conceptId: 'genai-m3-5w1h',
    question: {
      engineer: "Two analysts run the same research query and get different summaries from the same pipeline. What is the most likely root cause?",
      'builder': "Rhea's brief is thorough but her manager keeps saying 'what do I do with this.' What 5W1H question is Rhea failing to answer?",
    },
    options: {
      engineer: [
        'A. The model has high temperature, causing non-deterministic outputs',
        'B. The query is ambiguous — unspecified dimensions are filled differently across runs',
        'C. The documents are inconsistent and produce different summaries by section priority',
        'D. The pipeline needs a caching layer to return consistent outputs for identical queries',
      ],
      'builder': [
        'A. WHO — she does not know who her reader is',
        "B. WHAT — she's answering the wrong question (what happened vs. what requires your attention)",
        "C. WHERE — she's not specifying the right backlog scope",
        "D. HOW — she's not specifying the right output format",
      ],
    },
    correctIndex: { engineer: 1, 'builder': 1 },
    explanation: {
      engineer: "'The same query' with different implicit contexts fills unspecified dimensions differently. Standardising the query inputs with 5W1H — WHO, WHAT, WHEN, WHERE, WHY, HOW — eliminates the variance.",
      'builder': "Rhea is answering 'what happened this week' when her manager is asking 'does anything need my attention.' Same data source, different question, completely different brief.",
    },
    keyInsight: "5W1H doesn't structure the output. It structures the question you're actually answering — before you write a word.",
  },
  {
    conceptId: 'genai-m3-cove',
    question: {
      engineer: "Aarav's pipeline produces a summary citing '23% of outpatient surgery claims in this category result in secondary review.' The source documents don't contain this figure. Which COVE dimension catches this first?",
      'builder': "Rhea's brief includes 'exception resolution time improved 18% since implementing the new protocol.' Her data team can't find the source. What is the correct COVE diagnosis?",
    },
    options: {
      engineer: [
        'A. Completeness — the output missed other statistics in the documents',
        'B. Originality — the model drew the figure from training data, not the provided documents',
        'C. Efficiency — the statistic makes the output unnecessarily long',
        'D. Verifiability — the claim cannot be traced to a specific source sentence in the inputs',
      ],
      'builder': [
        'A. Completeness — the brief missed other improvement metrics',
        'B. Originality only — Claude generated a number from training patterns',
        'C. Verifiability only — the 18% cannot be traced to a specific data source',
        'D. Both Originality and Verifiability — the number is model-generated AND unverifiable',
      ],
    },
    correctIndex: { engineer: 3, 'builder': 3 },
    explanation: {
      engineer: "Verifiability is the first practical check: trace the claim to a specific source sentence. If '23%' isn't in any of the provided documents, the claim is model-generated — regardless of how confident it sounds.",
      'builder': "The 18% figure fails on two dimensions: Originality (generated by Claude, not retrieved from Rhea's data) and Verifiability (cannot be traced to a source). Both flags should have triggered review before forwarding.",
    },
    keyInsight: "Convincing is not the same as correct. Specific numbers that can't be traced are the most expensive kind of wrong — they get quoted before anyone checks.",
  },
  {
    conceptId: 'genai-m3-draft',
    question: {
      engineer: "Aarav's synthesis prompt produces technically accurate briefs. His manager says they 'read like technical documents' and can't be used in stakeholder meetings. What is the most targeted fix?",
      'builder': "Rhea sends the same brief to her team, director, and regional manager. Her team says too high-level, her regional manager never responds. What is the root cause?",
    },
    options: {
      engineer: [
        'A. The synthesis needs to be shorter before drafting begins',
        'B. The drafting prompt needs an audience parameter — who reads it and what decision they make',
        'C. The model needs few-shot examples of stakeholder briefs',
        'D. The manager needs training on how to read technical briefs',
      ],
      'builder': [
        'A. The brief needs to be longer to serve all three audiences simultaneously',
        'B. Rhea should write three separate briefs manually for each audience',
        'C. The drafting prompt needs an audience parameter — one synthesis, three audience profiles, three separate prompts',
        'D. The regional manager is the problem — she does not engage with written briefs',
      ],
    },
    correctIndex: { engineer: 1, 'builder': 2 },
    explanation: {
      engineer: "Wikipedia-style output is what you get when the audience is 'general reader.' Adding audience — role, prior knowledge, decision, format — transforms the same synthesis into a brief the audience can use.",
      'builder': "One drafting prompt cannot serve three audiences. Three audience profiles — each specifying who reads, what they know, what they decide, how they read — produce three useful briefs from the same research.",
    },
    keyInsight: "The synthesis is the raw material. Who reads it determines what you build from it.",
  },
];

const SECTION_XP = 50;
const QUIZ_XP = 100;

const TRACK_META: Record<GenAITrack, { label: string; introTitle: string; moduleContext: string }> = {
  'builder': {
    label: 'Builder Track',
    introTitle: 'Research, Summarization & Drafting · Operator Lens',
    moduleContext: `GenAI Launchpad · Non-Tech Track · Pre-Read 03 · Research, Summarization & Drafting. Follows Rhea, an operations lead at Northstar Health, as she discovers that AI-generated summaries look complete but miss the 'so what' — and rebuilds her approach from source selection through to audience-first drafting.`,
  },
  engineer: {
    label: 'Engineer Track',
    introTitle: 'Research, Summarization & Drafting · Builder Lens',
    moduleContext: `GenAI Launchpad · Tech Track · Pre-Read 03 · Research, Summarization & Drafting. Follows Aarav, a platform engineer at Northstar Health, as he diagnoses why his research assistant produces fluent but untrustworthy outputs — and rebuilds it as a proper multi-stage pipeline with source triangulation, COVE evaluation, and audience-parameterised drafting.`,
  },
};

type Props = { track: GenAITrack; onBack: () => void; onNext?: () => void; nextLabel?: string };

function computeXP(completedSections: Set<string>, conceptStates: Record<string, { pKnow: number }>) {
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = Object.values(conceptStates).reduce((sum, s) => sum + Math.round(s.pKnow * QUIZ_XP), 0);
  return { readingXP, quizXP, total: readingXP + quizXP };
}


// ── M3 Interactive Tools ─────────────────────────────────────────────────────

// Section 01: Source Coverage Checker — user selects sources, pipeline evaluates coverage
// SourcePipelineCard rebuilt as Claude Projects · Knowledge — the real
// UI for attaching source documents to a Claude project. File list with
// status pills, PDF/MD/SHEET file-type icons, learner adds the required
// docs (checkbox column), then "Index for Claude" runs the simulated
// embedding flow and grades source coverage.
type Source = { id: string; label: string; required: boolean; kind: 'pdf' | 'md' | 'sheet' | 'doc'; size: string; note: string };
const SourcePipelineCard = ({ track }: { track: GenAITrack }) => {
  const sources: Source[] = track === 'engineer'
    ? [
        { id: 'primary',    label: 'plan-schedule-v3.pdf',         kind: 'pdf',   size: '212 KB', required: true,  note: 'Core terms — but does not include the 2022 amendment.' },
        { id: 'amendment',  label: 'amendment-2022-02.pdf',         kind: 'pdf',   size: '64 KB',  required: true,  note: 'Contains clause 4.2c — the override rule. Not in v3.' },
        { id: 'precedents', label: 'case-precedents.md',            kind: 'md',    size: '38 KB',  required: true,  note: 'Three prior approvals of the same type — supports the decision.' },
        { id: 'guidelines', label: 'internal-claims-guidelines.md', kind: 'md',    size: '17 KB',  required: false, note: 'Useful context but not decision-critical for this query type.' },
        { id: 'faq',        label: 'benefits-faq-public.md',        kind: 'md',    size: '11 KB',  required: false, note: 'Member-facing language — not authoritative for triage.' },
      ]
    : [
        { id: 'ticket',  label: 'current-exception.pdf',         kind: 'pdf',   size: '8 KB',   required: true,  note: 'The trigger — but context-free without prior history.' },
        { id: 'thread',  label: 'prior-week-thread.md',          kind: 'md',    size: '23 KB',  required: true,  note: 'Contains the context the AI missed in Tuesday\'s review.' },
        { id: 'policy',  label: 'sla-policy-v2.pdf',             kind: 'pdf',   size: '46 KB',  required: true,  note: 'The rule governing this exception type — must be in scope.' },
        { id: 'flags',   label: 'open-escalation-flags.sheet',    kind: 'sheet', size: '4 KB',   required: true,  note: 'Other open items on this account that change the recommendation.' },
        { id: 'history', label: 'account-history-12m.sheet',     kind: 'sheet', size: '88 KB',  required: false, note: 'Useful for trend analysis but not needed for the weekly summary.' },
      ];

  const [selected, setSelected] = useState<Set<string>>(new Set([track === 'engineer' ? 'primary' : 'ticket']));
  const [indexing, setIndexing] = useState<'idle' | 'running' | 'done'>('idle');
  const [revealed, setRevealed] = useState(false);
  const requiredIds = sources.filter(s => s.required).map(s => s.id);
  const coveredRequired = requiredIds.filter(id => selected.has(id)).length;
  const isComplete = coveredRequired === requiredIds.length;

  const toggle = (id: string) => {
    if (indexing !== 'idle' || revealed) return;
    setSelected(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const runIndex = () => {
    setIndexing('running');
    setTimeout(() => { setIndexing('done'); setRevealed(true); }, 1300);
  };

  const reset = () => { setSelected(new Set([track === 'engineer' ? 'primary' : 'ticket'])); setIndexing('idle'); setRevealed(false); };

  const projectName = track === 'engineer' ? 'Claims policy assistant' : 'Exception review assistant';
  const totalSelectedSize = sources.filter(s => selected.has(s.id)).reduce((sum, s) => sum + parseInt(s.size), 0);

  const kindIcon = (k: Source['kind']) => k === 'pdf' ? { icon: 'PDF', color: '#F87171' } : k === 'sheet' ? { icon: 'CSV', color: '#34D399' } : { icon: 'MD',  color: CD.tool };

  return (
    <ClaudeDesktopFrame chatTitle={`Project · ${projectName}`} view="KNOWLEDGE" mcpServers={0}>
      {/* Sub-header */}
      <div style={{ padding: '10px 14px', background: CD.panelAlt, borderBottom: `1px solid ${CD.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <CDLabel>PROJECT KNOWLEDGE · attach docs Claude will read every chat</CDLabel>
          <div style={{ fontSize: 11, color: CD.inkSecondary, marginTop: 4 }}>Claude will retrieve from these documents when relevant. Choose what belongs in scope for this query type.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: CD.inkMuted }}>{selected.size}/{sources.length} attached · {totalSelectedSize} KB</span>
        </div>
      </div>

      {/* File list */}
      <div style={{ background: CD.bg }}>
        {sources.map(s => {
          const isOn = selected.has(s.id);
          const isMissing = revealed && s.required && !isOn;
          const isRight = revealed && s.required && isOn;
          const isExtra = revealed && !s.required && isOn;
          const ki = kindIcon(s.kind);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(s.id)}
              disabled={revealed || indexing !== 'idle'}
              style={{
                appearance: 'none', cursor: revealed ? 'default' : 'pointer',
                display: 'block', width: '100%',
                padding: '10px 14px', borderBottom: `1px solid ${CD.border}`,
                background: isMissing ? 'rgba(248,113,113,0.07)' : isRight ? 'rgba(16,185,129,0.07)' : isExtra ? 'rgba(252,211,77,0.07)' : 'transparent',
                textAlign: 'left' as const, fontFamily: 'inherit',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '24px 36px 1fr 70px 90px', gap: 10, alignItems: 'center' }}>
                {/* Checkbox */}
                <div style={{
                  width: 16, height: 16, borderRadius: 3,
                  border: `1.5px solid ${isOn ? CD.accent : '#3A3A3A'}`,
                  background: isOn ? CD.accent : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 10, fontWeight: 800,
                }}>{isOn ? '✓' : ''}</div>

                {/* File type chip */}
                <div style={{ width: 32, height: 28, borderRadius: 4, background: `${ki.color}1A`, border: `1px solid ${ki.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 800, color: ki.color }}>{ki.icon}</div>

                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: CD.inkPrimary, fontFamily: "'JetBrains Mono', monospace" }}>{s.label}</div>
                  {revealed && <div style={{ fontSize: 10.5, color: isMissing ? '#FCA5A5' : isRight ? '#86EFAC' : '#FCD34D', marginTop: 3, lineHeight: 1.5 }}>{isMissing ? '✗ Required — missing from project' : isRight ? '✓ Required source' : '→ Optional · noisy'}<span style={{ color: CD.inkMuted, marginLeft: 8 }}>{s.note}</span></div>}
                </div>

                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: CD.inkMuted }}>{s.size}</span>

                {s.required ? (
                  <span style={{ padding: '2px 7px', borderRadius: 3, background: 'rgba(198,107,61,0.12)', border: `1px solid ${CD.accent}40`, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 800, color: CD.accent, letterSpacing: '0.06em', justifySelf: 'end' as const }}>REQUIRED</span>
                ) : (
                  <span style={{ padding: '2px 7px', borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: `1px solid ${CD.border}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: CD.inkMuted, letterSpacing: '0.06em', justifySelf: 'end' as const }}>OPTIONAL</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action bar */}
      <div style={{ padding: '10px 14px', background: CD.panelAlt, borderTop: `1px solid ${CD.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {indexing === 'running' ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, color: CD.tool, fontFamily: "'JetBrains Mono', monospace" }}>
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ width: 5, height: 5, borderRadius: '50%', background: CD.tool }} />
            embedding & indexing {selected.size} documents…
          </div>
        ) : revealed ? (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: isComplete ? CD.accent : '#FCA5A5', fontWeight: 700 }}>
            {isComplete ? `✓ ${coveredRequired}/${requiredIds.length} REQUIRED SOURCES INDEXED` : `✗ ${coveredRequired}/${requiredIds.length} required · ${requiredIds.length - coveredRequired} missing — Claude will fill the gap with training-data filler`}
          </span>
        ) : (
          <span style={{ fontSize: 10.5, color: CD.inkMuted, fontFamily: "'JetBrains Mono', monospace" }}>Click checkboxes to attach docs · then run the index</span>
        )}
        <div style={{ display: 'flex', gap: 6 }}>
          {revealed ? (
            <button type="button" onClick={reset} style={{ appearance: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: `1px solid ${CD.border}`, borderRadius: 5, padding: '5px 12px', fontSize: 10, fontWeight: 700, color: CD.inkSecondary, fontFamily: "'JetBrains Mono', monospace" }}>↺ RECONFIGURE</button>
          ) : (
            <button type="button" onClick={runIndex} disabled={indexing !== 'idle' || selected.size === 0} style={{ appearance: 'none', cursor: indexing === 'idle' && selected.size > 0 ? 'pointer' : 'not-allowed', background: indexing === 'idle' && selected.size > 0 ? CD.accent : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 5, padding: '5px 14px', fontSize: 10.5, fontWeight: 700, color: indexing === 'idle' && selected.size > 0 ? '#fff' : CD.inkMuted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>▶ INDEX FOR CLAUDE</button>
          )}
        </div>
      </div>
    </ClaudeDesktopFrame>
  );
};

// CompressionCompareCard rebuilt as a Claude Desktop reviewing-summaries
// flow: the chat shows Claude returning a candidate summary; the human
// (Aarav / Rhea) classifies it as Generic Compression or Decision-Grade.
// Each turn cycles to the next summary. Score panel on the right rail
// tracks progress.
const CompressionCompareCard = ({ track }: { track: GenAITrack }) => {
  type Summary = { text: string; answer: 'generic' | 'decision'; explain: string };
  const summaries: Summary[] = track === 'engineer' ? [
    { text: 'The case concerns a pharmacy benefit claim submitted on 14 March. There are several policy considerations that may be relevant. The claim has been flagged for review by the system.', answer: 'generic', explain: 'No action, no urgency, no decision frame — an analyst reads this and still has to decide everything.' },
    { text: 'Category: Disputed pharmacy benefit. Action: Escalate to pharmacy review — physician override requested, 48h SLA. Urgency: High. Key factor: amendment clause 4.2c absent from pipeline.', answer: 'decision', explain: 'Every sentence serves a decision: category, action, deadline, blocking factor. Nothing for the reader to re-derive.' },
    { text: 'Claim #A2241 has been processed. The relevant policy documents were reviewed and a summary was generated. Several factors were identified that may affect the outcome of the claim.', answer: 'generic', explain: '"May affect" and "several factors" are content-free — pure compression, zero decision grade.' },
  ] : [
    { text: 'This week had 23 exceptions across the portfolio. Several items were flagged for follow-up. The team is continuing to monitor the backlog.', answer: 'generic', explain: '"Several items" and "continuing to monitor" tell the director nothing actionable — status update, not a brief.' },
    { text: 'Director attention needed: 2 of 23 exceptions exceed SLA (#4412, #7089). Recommend same-day review before Friday close. Remaining 21 within tolerance — no action needed.', answer: 'decision', explain: 'Two exceptions named, action stated, deadline given, the rest explicitly cleared. The director reads one line and knows what to do.' },
    { text: 'The exception review for the week has been completed. Analysts have reviewed the items and made notes where applicable. Some items may require director-level attention.', answer: 'generic', explain: '"May require" and "where applicable" are evasions — the director reads it and finds nothing to act on.' },
  ];
  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState<'generic' | 'decision' | null>(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<('right' | 'wrong')[]>([]);
  const [done, setDone] = useState(false);
  const current = summaries[idx];

  const pick = (p: 'generic' | 'decision') => {
    if (choice) return;
    setChoice(p);
    const right = p === current.answer;
    if (right) setScore(s => s + 1);
    setHistory(h => [...h, right ? 'right' : 'wrong']);
  };
  const next = () => {
    if (idx < summaries.length - 1) { setIdx(i => i + 1); setChoice(null); }
    else setDone(true);
  };
  const reset = () => { setIdx(0); setChoice(null); setScore(0); setHistory([]); setDone(false); };

  const protagonist = track === 'engineer' ? 'Aarav' : 'Rhea';

  return (
    <ClaudeDesktopFrame chatTitle={`Reviewing summary ${idx + 1}/${summaries.length}`} view="SUMMARY REVIEW">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 220px', gap: 0 }}>
        {/* Chat */}
        <div style={{ padding: '14px 16px', minHeight: 280, background: CD.bg, borderRight: `1px solid ${CD.border}` }}>
          {/* User prompt */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#3B3B3B', color: '#fff', fontWeight: 800, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{protagonist[0]}</div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: CD.inkMuted, letterSpacing: '0.10em' }}>{protagonist.toUpperCase()}</span>
            </div>
            <div style={{ maxWidth: '90%', padding: '9px 12px', background: CD.panel, border: `1px solid ${CD.border}`, borderRadius: '12px 12px 4px 12px', fontSize: 11.5, color: CD.inkPrimary }}>
              Summarise the {track === 'engineer' ? 'claim ' + idx : 'exception batch ' + idx} for the {track === 'engineer' ? 'triage queue' : 'director brief'}.
            </div>
          </div>

          {/* Claude's draft */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: CD.accent, color: '#fff', fontWeight: 900, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif' }}>A</div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: CD.inkMuted, letterSpacing: '0.10em' }}>CLAUDE · draft</span>
            </div>
            <div style={{ maxWidth: '94%', padding: '11px 13px', background: 'transparent', border: `1px solid ${CD.border}`, borderRadius: '12px 12px 12px 4px', fontSize: 12, color: CD.inkPrimary, lineHeight: 1.65 }}>{current.text}</div>
          </div>

          {/* Classification buttons */}
          {!choice ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => pick('generic')} style={{ appearance: 'none', cursor: 'pointer', flex: 1, padding: '8px 12px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.40)', borderRadius: 7, fontSize: 11, fontWeight: 700, color: '#FCA5A5', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>GENERIC COMPRESSION</button>
              <button type="button" onClick={() => pick('decision')} style={{ appearance: 'none', cursor: 'pointer', flex: 1, padding: '8px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.40)', borderRadius: 7, fontSize: 11, fontWeight: 700, color: '#86EFAC', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>DECISION-GRADE</button>
            </div>
          ) : (
            <>
              <div style={{ padding: '9px 12px', background: choice === current.answer ? 'rgba(16,185,129,0.10)' : 'rgba(248,113,113,0.10)', border: `1px solid ${choice === current.answer ? '#10B981' : '#F87171'}40`, borderRadius: 7, fontSize: 11, color: choice === current.answer ? '#86EFAC' : '#FCA5A5', lineHeight: 1.55, marginBottom: 10 }}>
                {choice === current.answer ? '✓ ' : `✗ Actually ${current.answer.toUpperCase()} · `}{current.explain}
              </div>
              {!done && (
                <button type="button" onClick={next} style={{ appearance: 'none', cursor: 'pointer', background: CD.accent, border: 'none', borderRadius: 5, padding: '6px 14px', fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>
                  {idx < summaries.length - 1 ? '▶ NEXT SUMMARY' : '▶ FINISH'}
                </button>
              )}
              {done && (
                <button type="button" onClick={reset} style={{ appearance: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: `1px solid ${CD.border}`, borderRadius: 5, padding: '6px 14px', fontSize: 11, fontWeight: 700, color: CD.inkSecondary, fontFamily: "'JetBrains Mono', monospace" }}>↺ RESTART</button>
              )}
            </>
          )}
        </div>

        {/* Right rail */}
        <div style={{ padding: '14px 14px', background: CD.panelAlt }}>
          <CDLabel>SCORE</CDLabel>
          <div style={{ marginTop: 6, padding: '10px 12px', background: CD.panel, border: `1px solid ${CD.border}`, borderRadius: 7 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color: done && score === summaries.length ? CD.accent : CD.inkPrimary }}>{score}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: CD.inkMuted }}>/ {summaries.length}</span>
            </div>
            <div style={{ fontSize: 10, color: CD.inkMuted, marginTop: 3 }}>classified correctly</div>
          </div>

          <div style={{ marginTop: 14 }}><CDLabel>HISTORY</CDLabel></div>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
            {summaries.map((_, i) => {
              const h = history[i];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: CD.inkMuted, width: 16 }}>{i + 1}.</span>
                  {h === undefined ? (
                    <span style={{ fontSize: 10, color: CD.inkMuted }}>{i === idx ? 'current' : 'pending'}</span>
                  ) : (
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: h === 'right' ? CD.accent : '#F87171', fontWeight: 700 }}>{h === 'right' ? '✓ correct' : '✗ wrong'}</span>
                  )}
                </div>
              );
            })}
          </div>

          {done && (
            <div style={{ marginTop: 12, padding: '8px 10px', background: `${CD.accent}1A`, border: `1px solid ${CD.accent}50`, borderRadius: 6, fontSize: 10.5, color: '#FBD3B0', lineHeight: 1.5 }}>
              Decision-grade summaries name the action, the actor, the deadline, and the urgency. No inference required.
            </div>
          )}
        </div>
      </div>
    </ClaudeDesktopFrame>
  );
};

// FiveW1HCard rebuilt as a Claude Projects custom-instructions composer.
// Left pane is the structured 5W1H form; right pane is the live preview
// of the system prompt Claude will receive — exactly how Claude renders
// custom instructions in the right rail of the project view.
const FiveW1HCard = ({ track }: { track: GenAITrack }) => {
  type Dim = { key: 'WHO' | 'WHAT' | 'WHEN' | 'WHY' | 'HOW'; q: string; opts: string[]; correct: number };
  const dims: Dim[] = track === 'engineer' ? [
    { key: 'WHO',  q: 'Who is affected?',           opts: ['(empty)', 'Tier 2 claimant only',          'Claimant + treating physician',                    'Claimant + physician + pharmacy manager'],          correct: 2 },
    { key: 'WHAT', q: 'What claim scenario?',       opts: ['(empty)', 'Any pharmacy claim',            'Physician override request, clause 4.2c',         'Billing dispute'],                                  correct: 1 },
    { key: 'WHEN', q: 'When does the policy apply?', opts: ['(empty)', 'All claims after 2020',         'Claims after Jan 2022, Plan B only',              'Claims flagged by system'],                          correct: 1 },
    { key: 'WHY',  q: 'Why is this being researched?', opts: ['(empty)', 'Routine summary',              '48h SLA escalation decision — irreversible',     'Model accuracy check'],                              correct: 1 },
    { key: 'HOW',  q: 'How will the output be used?', opts: ['(empty)', 'Stored in archive',              'Case worker: approve / escalate / request info', 'Director review'],                                  correct: 1 },
  ] : [
    { key: 'WHO',  q: 'Who reads this brief?',         opts: ['(empty)', 'All analysts',                  'Regional Director — pre-meeting scan, 5 min',     'Anyone on the team'],                                correct: 1 },
    { key: 'WHAT', q: 'What question are they asking?', opts: ['(empty)', 'What happened this week?',       'Is there anything I need to act on before Friday?', 'How many exceptions were there?'],                  correct: 1 },
    { key: 'WHEN', q: 'When do they decide?',           opts: ['(empty)', 'Whenever convenient',            'Thursday AM before weekly ops call',              'End of month'],                                      correct: 1 },
    { key: 'WHY',  q: 'Why is this week different?',    opts: ['(empty)', 'Routine weekly summary',         '2 accounts breached SLA — board visibility risk', 'New exceptions added'],                              correct: 1 },
    { key: 'HOW',  q: 'How will they act on it?',       opts: ['(empty)', 'File for reference',             'Approve escalation or delegate — one decision',   'Forward to all managers'],                          correct: 1 },
  ];

  const [vals, setVals] = useState<Record<string, number>>(Object.fromEntries(dims.map(d => [d.key, 0])));
  const filled = dims.filter(d => vals[d.key] > 0).length;
  const allCorrect = dims.every(d => vals[d.key] === d.correct);

  return (
    <ClaudeDesktopFrame chatTitle="Project · Custom instructions" view="5W1H BRIEF COMPOSER">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        {/* LEFT: form */}
        <div style={{ padding: '14px 16px', borderRight: `1px solid ${CD.border}`, background: CD.bg }}>
          <CDLabel>RESEARCH BRIEF · 5W1H</CDLabel>
          <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
            {dims.map(d => {
              const v = vals[d.key];
              const isFilled = v > 0;
              const isCorrect = v === d.correct;
              const accent = isCorrect ? CD.accent : isFilled ? '#FCD34D' : CD.inkMuted;
              return (
                <div key={d.key} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ padding: '4px 0', background: 'transparent', color: accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800, textAlign: 'center' as const, borderRight: `2px solid ${accent}40` }}>{d.key}</div>
                  <div>
                    <label style={{ fontSize: 10, color: CD.inkMuted, marginBottom: 3, display: 'block', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>{d.q}</label>
                    <select
                      value={v}
                      onChange={e => setVals(prev => ({ ...prev, [d.key]: Number(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '6px 9px',
                        background: CD.panel,
                        border: `1px solid ${accent}50`,
                        borderRadius: 5,
                        color: CD.inkPrimary,
                        fontSize: 11,
                        fontFamily: 'inherit',
                        outline: 'none',
                      }}
                    >
                      {d.opts.map((opt, i) => <option key={i} value={i} style={{ background: CD.panel }}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 14, padding: '8px 10px', background: allCorrect ? 'rgba(16,185,129,0.10)' : filled === 0 ? CD.panel : 'rgba(252,211,77,0.10)', border: `1px solid ${allCorrect ? '#10B98155' : filled === 0 ? CD.border : '#FCD34D55'}`, borderRadius: 6, fontSize: 10.5, color: allCorrect ? '#86EFAC' : filled === 0 ? CD.inkSecondary : '#FCD34D', lineHeight: 1.55 }}>
            {allCorrect
              ? `✓ 5/5 dimensions specified — Claude has enough scope to produce a decision-grade output.`
              : filled === 0
              ? 'Pick the most precise option for each dimension. Unfilled rows leave gaps for Claude to fill with generic prose.'
              : `${filled}/${dims.length} filled · ${dims.length - filled} still vague — those become "???" in the system prompt.`}
          </div>
        </div>

        {/* RIGHT: system prompt preview */}
        <div style={{ padding: '14px 16px', background: CD.panelAlt }}>
          <CDLabel>SYSTEM PROMPT · what Claude will read</CDLabel>
          <div style={{ marginTop: 8, padding: '11px 13px', background: '#0E0E0E', border: `1px solid ${CD.border}`, borderRadius: 7, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: CD.inkSecondary, lineHeight: 1.7, minHeight: 200 }}>
            <span style={{ color: '#569CD6' }}>You are</span> a research assistant for the {track === 'engineer' ? 'claims triage' : 'ops exception'} team.
            <br /><br />
            <span style={{ color: '#569CD6' }}>Research scope:</span>
            <br />
            {dims.map((d, i) => {
              const v = vals[d.key];
              const isFilled = v > 0;
              return (
                <div key={d.key} style={{ display: 'block', marginLeft: 6 }}>
                  <span style={{ color: isFilled ? '#A78BFA' : '#525252' }}>• {d.key}:</span>{' '}
                  <span style={{ color: isFilled ? (v === d.correct ? '#86EFAC' : '#FCD34D') : '#F87171' }}>
                    {isFilled ? d.opts[v] : '???'}
                  </span>
                </div>
              );
            })}
            <br />
            <span style={{ color: '#569CD6' }}>Return:</span> a brief that lets the reader make their decision in one pass.
          </div>

          <div style={{ marginTop: 12 }}>
            <CDLabel>EXPECTED OUTPUT QUALITY</CDLabel>
            <div style={{ marginTop: 6, padding: '8px 10px', background: CD.panel, border: `1px solid ${CD.border}`, borderRadius: 6 }}>
              {[
                { label: 'Specificity',   pct: Math.round((filled / dims.length) * 100), color: CD.tool },
                { label: 'Right answers', pct: Math.round((dims.filter(d => vals[d.key] === d.correct).length / dims.length) * 100), color: CD.accent },
              ].map(m => (
                <div key={m.label} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: CD.inkSecondary }}>{m.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: m.color, fontWeight: 700 }}>{m.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${m.pct}%`, background: m.color, borderRadius: 2, transition: 'width 0.3s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ClaudeDesktopFrame>
  );
};

// COVECard rebuilt as a Claude Desktop fact-check / citation auditor.
// Claude returns a draft with inline citation markers; the learner clicks
// each highlighted claim to tag the COVE dimension it primarily exercises.
// Wrong tags expose the failure mode (hallucinated stat, unsourced rate,
// etc.) in red; correct tags light up the citation badge green.
const COVECard = ({ track }: { track: GenAITrack }) => {
  type Verdict = 'C' | 'O' | 'V' | 'E';
  type Claim = { id: string; text: string; verdict: Verdict; explain: string };
  const claims: Claim[] = track === 'engineer' ? [
    { id: 'a', text: 'Coverage rate for Tier 2 pharmacy benefits is 78%.',                       verdict: 'V', explain: 'Verbatim in plan_schedule.pdf row 14, "Tier 2 pharmacy cover rate". Source is exact and traceable.' },
    { id: 'b', text: 'The industry average override approval rate is 82%.',                       verdict: 'O', explain: 'Not in any document in your pipeline — model pulled it from training data. Hallucinated benchmark.' },
    { id: 'c', text: 'Claim #A2241 requires escalation under clause 4.2c, Feb 2022 amendment.', verdict: 'C', explain: 'Factually accurate — the amendment confirms §4.2c applies to Tier 2 CA plans. Clause reference is exact.' },
    { id: 'd', text: 'Recommended action: escalate to pharmacy review, 48h SLA.',                verdict: 'E', explain: 'Directly serves the case worker\'s decision. Action, queue, deadline — nothing left to infer.' },
  ] : [
    { id: 'a', text: '23 exceptions were processed this week.',                                  verdict: 'C', explain: 'Verifiable against exception tracker export (row count, current week filter). Factually accurate.' },
    { id: 'b', text: 'Resolution time improved 18% compared to last month.',                     verdict: 'O', explain: 'This figure does not appear in any document you indexed — model generated it from training patterns.' },
    { id: 'c', text: 'Accounts #4412 and #7089 are 6 and 8 days over SLA respectively.',         verdict: 'V', explain: 'Traceable to exception_tracker.sheet rows 14 + 23, column "Days Open" vs SLA column. Source explicit.' },
    { id: 'd', text: '2 accounts need your decision before Friday — rest is resolved.',          verdict: 'E', explain: 'Directly answers what the director is asking. Filters to action items, clears everything else.' },
  ];

  const OPTS: { key: Verdict; label: string; color: string }[] = [
    { key: 'C', label: 'Correctness',    color: '#22D3EE' },
    { key: 'O', label: 'Originality',    color: '#A78BFA' },
    { key: 'V', label: 'Verifiability',  color: '#60A5FA' },
    { key: 'E', label: 'Effectiveness',  color: '#10B981' },
  ];

  const [picks, setPicks] = useState<Record<string, Verdict>>({});
  const [activeClaim, setActiveClaim] = useState<string | null>(null);
  const allPicked = claims.every(c => picks[c.id]);
  const score = claims.filter(c => picks[c.id] === c.verdict).length;
  const reset = () => { setPicks({}); setActiveClaim(null); };

  return (
    <ClaudeDesktopFrame chatTitle="Fact-check Claude's draft" view="COVE AUDIT">
      <div style={{ padding: '14px 16px', background: CD.bg }}>
        <CDLabel>CLAUDE'S DRAFT · click each highlighted claim to audit it</CDLabel>

        {/* Draft as a single paragraph with inline citation badges */}
        <div style={{ marginTop: 8, padding: '14px 16px', background: CD.panel, border: `1px solid ${CD.border}`, borderRadius: 8, fontSize: 12.5, color: CD.inkPrimary, lineHeight: 2 }}>
          {claims.map((c, i) => {
            const picked = picks[c.id];
            const isRight = picked === c.verdict;
            const isActive = activeClaim === c.id;
            const ringColor = picked ? (isRight ? '#10B981' : '#F87171') : isActive ? CD.tool : '#FCD34D';
            return (
              <React.Fragment key={c.id}>
                <span
                  onClick={() => setActiveClaim(c.id)}
                  style={{
                    background: picked ? (isRight ? 'rgba(16,185,129,0.10)' : 'rgba(248,113,113,0.10)') : isActive ? 'rgba(167,139,250,0.10)' : 'rgba(252,211,77,0.08)',
                    borderBottom: `2px solid ${ringColor}`,
                    cursor: picked ? 'default' : 'pointer',
                    padding: '0 3px',
                    borderRadius: 3,
                    transition: 'all 0.2s',
                  }}
                >
                  {c.text}
                  <sup style={{
                    marginLeft: 3, padding: '0 5px', borderRadius: 3,
                    background: ringColor, color: '#fff', fontWeight: 900, fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                  }}>[{i + 1}]</sup>
                </span>
                {i < claims.length - 1 && ' '}
              </React.Fragment>
            );
          })}
        </div>

        {/* Audit panel for the active claim */}
        {activeClaim && (
          <div style={{ marginTop: 12, padding: '12px 14px', background: CD.panelAlt, border: `1px solid ${CD.border}`, borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <CDLabel>AUDITING CLAIM [{claims.findIndex(c => c.id === activeClaim) + 1}]</CDLabel>
              {picks[activeClaim] && (
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: picks[activeClaim] === claims.find(c => c.id === activeClaim)?.verdict ? CD.accent : '#F87171', fontWeight: 800, letterSpacing: '0.06em' }}>
                  {picks[activeClaim] === claims.find(c => c.id === activeClaim)?.verdict ? '✓ CORRECTLY TAGGED' : `✗ ACTUALLY ${claims.find(c => c.id === activeClaim)?.verdict}`}
                </span>
              )}
            </div>
            <div style={{ fontSize: 11.5, color: CD.inkSecondary, fontStyle: 'italic' as const, marginBottom: 10, lineHeight: 1.55 }}>"{claims.find(c => c.id === activeClaim)?.text}"</div>
            <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
              {OPTS.map(o => {
                const isPicked = picks[activeClaim] === o.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => !picks[activeClaim] && setPicks(prev => ({ ...prev, [activeClaim]: o.key }))}
                    disabled={!!picks[activeClaim]}
                    style={{
                      appearance: 'none', cursor: picks[activeClaim] ? 'default' : 'pointer',
                      flex: 1, padding: '6px 9px',
                      background: isPicked ? `${o.color}24` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isPicked ? o.color : `${o.color}40`}`,
                      borderRadius: 5,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10, fontWeight: 800,
                      color: isPicked ? o.color : CD.inkMuted,
                      letterSpacing: '0.04em',
                    }}
                  >{o.key} · {o.label}</button>
                );
              })}
            </div>
            {picks[activeClaim] && (
              <div style={{ padding: '8px 10px', background: 'rgba(167,139,250,0.06)', border: `1px solid ${CD.tool}40`, borderRadius: 6, fontSize: 11, color: CD.inkSecondary, lineHeight: 1.55 }}>
                {claims.find(c => c.id === activeClaim)?.explain}
              </div>
            )}
          </div>
        )}

        {/* Legend / footer */}
        <div style={{ marginTop: 12, padding: '8px 10px', background: CD.panelAlt, border: `1px solid ${CD.border}`, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: CD.inkMuted, fontFamily: "'JetBrains Mono', monospace" }}>
            C = Correctness · O = Originality · V = Verifiability · E = Effectiveness
          </span>
          {allPicked ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800, color: score === claims.length ? CD.accent : '#FCD34D' }}>{score}/{claims.length} CORRECT</span>
              <button type="button" onClick={reset} style={{ appearance: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: `1px solid ${CD.border}`, borderRadius: 5, padding: '4px 11px', fontSize: 10, fontWeight: 700, color: CD.inkSecondary, fontFamily: "'JetBrains Mono', monospace" }}>↺ RESET</button>
            </div>
          ) : (
            <span style={{ fontSize: 10, color: CD.inkMuted, fontFamily: "'JetBrains Mono', monospace" }}>{Object.keys(picks).length}/{claims.length} audited</span>
          )}
        </div>
      </div>
    </ClaudeDesktopFrame>
  );
};

// AudienceDraftCard rebuilt as Claude Desktop with an audience tab strip.
// One synthesis at top (the source-of-truth Claude is working from), then
// three rewrite tabs across the audience — the same facts, three briefs.
// Clicking a tab streams a new Claude reply tuned to that reader; verdict
// below explains the lens shift.
const AudienceDraftCard = ({ track }: { track: GenAITrack }) => {
  const synthesis = track === 'engineer'
    ? 'Claim #A2241: pharmacy override request by Dr. Mehta. §4.2c (Feb 2022 amendment) permits Tier 2 CA override. 48h SLA. 3 precedent approvals in Q4. Amendment not in current policy index.'
    : 'Week of Mar 10: 23 exceptions, 2 SLA breaches (#4412: 6d, #7089: 8d), 19 within tolerance, 2 pending close EOW. #4412 is third breach in 6 weeks.';

  type Audience = { id: string; label: string; subtitle: string; color: string; brief: string; why: string };
  const audiences: Audience[] = track === 'engineer' ? [
    { id: 'worker',     label: 'Case Worker',        subtitle: 'executes the call',     color: '#22D3EE', brief: 'Escalate Claim #A2241 to pharmacy review. Form: PH-7. Deadline: Thursday 5pm. Note §4.2c in submission — amendment clause, not in standard index.', why: 'Action + form + deadline, nothing else. The case worker executes — they don\'t need context or patterns.' },
    { id: 'compliance', label: 'Compliance Officer', subtitle: 'audits the decision',   color: '#A78BFA', brief: 'Override request under §4.2c (Feb 2022 amendment). CA-only provision. 3 precedent approvals on file. Audit trail: case note #A2241. Amendment currently unindexed — gap in standard policy lookup.', why: 'Clause, provision, audit trail, gap. The compliance lens is: is this defensible? is it documented?' },
    { id: 'pm',         label: 'Product Manager',    subtitle: 'fixes the system',      color: '#60A5FA', brief: 'Override flow triggered 4× in Q4. Root cause: clause 4.2c (Feb 2022 amendment) not in policy index. Case workers escalating manually each time. Fix: index the amendment. Estimated 12 affected cases/month.', why: 'Pattern + root cause + fix. Same synthesis, different question: "where does the system break and what do we build?"' },
  ] : [
    { id: 'analyst',  label: 'Team Analyst',     subtitle: 'works the queue',     color: '#22D3EE', brief: '#4412 (6d over SLA) and #7089 (8d): both need case notes before Thursday noon. Check escalation history for each. #4412 is a repeat breach — flag for supervisor review.', why: 'Specific accounts, specific tasks, specific deadline. The analyst executes — they need exact next steps.' },
    { id: 'director', label: 'Regional Director', subtitle: 'decides before the call', color: '#A78BFA', brief: 'Action needed before Friday: #4412 and #7089 exceed SLA — board visibility risk if unresolved. Recommend you flag to ops lead today. Other 21 exceptions within tolerance — no action needed from you.', why: 'One decision. Clear risk. Explicit "no action needed" for everything else. Director doesn\'t need account details.' },
    { id: 'oplead',   label: 'Operations Lead',   subtitle: 'spots the systemic issue', color: '#10B981', brief: 'SLA breach rate: 2/23 (8.7%) vs 3.2% baseline. #4412: third breach in 6 weeks — systemic flag. Recommend root-cause review for that account before next reporting cycle.', why: 'Trend + baseline + systemic flag. Ops lens is: "is this a one-off or a process problem?"' },
  ];

  const [activeId, setActiveId] = useState<string>(audiences[0].id);
  const [streamKey, setStreamKey] = useState(0);
  const chosen = audiences.find(a => a.id === activeId)!;

  const switchAudience = (id: string) => {
    setActiveId(id);
    setStreamKey(k => k + 1);
  };

  const protagonist = track === 'engineer' ? 'Aarav' : 'Rhea';

  return (
    <ClaudeDesktopFrame chatTitle="Same synthesis · different reader" view="AUDIENCE REWRITE">
      <div style={{ padding: '14px 16px', background: CD.bg }}>
        {/* Synthesis card at top */}
        <div style={{ marginBottom: 14, padding: '11px 13px', background: CD.panel, border: `1px solid ${CD.border}`, borderRadius: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ width: 4, height: 14, background: CD.accent, borderRadius: 2 }} />
            <CDLabel>SOURCE SYNTHESIS · facts Claude is working from</CDLabel>
          </div>
          <div style={{ fontSize: 12, color: CD.inkPrimary, lineHeight: 1.6 }}>{synthesis}</div>
        </div>

        {/* User prompt — tab strip rendered as a prompt */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#3B3B3B', color: '#fff', fontWeight: 800, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{protagonist[0]}</div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: CD.inkMuted, letterSpacing: '0.10em' }}>{protagonist.toUpperCase()}</span>
          </div>
          <div style={{ maxWidth: '90%', padding: '9px 12px', background: CD.panel, border: `1px solid ${CD.border}`, borderRadius: '12px 12px 4px 12px', fontSize: 11.5, color: CD.inkPrimary, lineHeight: 1.55 }}>
            Rewrite the synthesis above for a <strong style={{ color: chosen.color }}>{chosen.label}</strong>.
          </div>
        </div>

        {/* Audience tab strip */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, borderBottom: `1px solid ${CD.border}`, paddingBottom: 8 }}>
          {audiences.map(a => {
            const isActive = activeId === a.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => switchAudience(a.id)}
                style={{
                  appearance: 'none', cursor: 'pointer',
                  flex: 1,
                  padding: '8px 10px',
                  background: isActive ? `${a.color}1A` : 'transparent',
                  border: `1px solid ${isActive ? a.color : CD.border}`,
                  borderRadius: 7,
                  textAlign: 'left' as const,
                  fontFamily: 'inherit',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: isActive ? a.color : CD.inkPrimary }}>{a.label}</span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: CD.inkMuted, letterSpacing: '0.04em' }}>{a.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Claude reply for chosen audience */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: CD.accent, color: '#fff', fontWeight: 900, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif' }}>A</div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: CD.inkMuted, letterSpacing: '0.10em' }}>CLAUDE</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: chosen.color, letterSpacing: '0.06em' }}>· tone={chosen.label.toLowerCase().replace(' ', '-')}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={streamKey}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                maxWidth: '94%',
                padding: '11px 13px',
                background: 'transparent',
                border: `1px solid ${chosen.color}55`,
                borderRadius: '12px 12px 12px 4px',
                fontSize: 12,
                color: CD.inkPrimary,
                lineHeight: 1.65,
              }}
            >{chosen.brief}</motion.div>
          </AnimatePresence>
        </div>

        {/* Verdict */}
        <div style={{ padding: '8px 10px', background: `${chosen.color}12`, border: `1px solid ${chosen.color}40`, borderRadius: 6 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: chosen.color, letterSpacing: '0.10em', fontWeight: 700, marginBottom: 3 }}>WHY THE REWRITE LANDS</div>
          <div style={{ fontSize: 10.5, color: CD.inkSecondary, lineHeight: 1.55 }}>{chosen.why}</div>
        </div>
      </div>
    </ClaudeDesktopFrame>
  );
};

// ── End M3 Interactive Tools ──────────────────────────────────────────────────

function CoreContent({ track, completedSections = new Set<string>(), activeSection = null }: { track: GenAITrack; completedSections?: Set<string>; activeSection?: string | null }) {
  const nextSection = SECTIONS.find(s => !completedSections.has(s.id));
  const moduleContext = TRACK_META[track].moduleContext;
  return (
    <>
      {/* Module Hero */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 520px', minWidth: 0, background: 'var(--ed-cream)', borderRadius: '14px', padding: '36px 36px 28px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-12px', top: '-8px', fontSize: '140px', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.05)`, fontFamily: "'Lora','Georgia',serif", letterSpacing: '-0.04em', userSelect: 'none' as const, pointerEvents: 'none' as const }}>03</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '10px', textTransform: 'uppercase' as const }}>GenAI Launchpad · Pre-Read 03</div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.025em', color: 'var(--ed-ink)', marginBottom: '10px', fontFamily: "'Lora', Georgia, serif" }}>Research, Summarization &amp; Drafting</h1>
          <p style={{ fontSize: '15px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '28px' }}>&ldquo;A summary that looks complete is the most dangerous kind of wrong.&rdquo;</p>
          <GenAIHeroCharacterStrip track={track} mentors={['anika', 'rohan', 'leela', 'kabir']} />
          <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '16px 20px', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${ACCENT}` }}>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '10px', textTransform: 'uppercase' as const }}>Learning Objectives</div>
            {[
              'Design a multi-source research pipeline that triangulates instead of compresses',
              'Write summarisation prompts that specify a decision, not just a topic',
              'Apply the 5W1H framework to the brief before writing it, not after',
              'Use COVE to evaluate any AI output before it crosses a handoff point',
              'Parameterise drafting prompts by audience so one synthesis serves multiple readers',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 4 ? '8px' : 0, alignItems: 'flex-start' }}>
                <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>0{i + 1}</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: '1 1 100%', order: 3, marginBottom: '10px', padding: '16px 20px', borderRadius: '10px', background: track === 'engineer' ? 'rgba(15,118,110,0.08)' : `rgba(${ACCENT_RGB},0.08)`, border: `1px solid ${track === 'engineer' ? 'rgba(15,118,110,0.18)' : `rgba(${ACCENT_RGB},0.18)`}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: track === 'engineer' ? '#0F766E' : ACCENT, marginBottom: '8px' }}>{TRACK_META[track].label.toUpperCase()}</div>
        <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>{track === 'engineer' ? "Your lens: how do you build a research pipeline that analysts can actually trust — one that triangulates sources, surfaces conflicts, and produces decision-grade briefs, not fluent summaries?" : "Your lens: how do you design an AI-assisted research workflow that saves real hours, not just minutes — by getting source selection, summarisation purpose, and audience fit right before touching the prompt?"}</div>
      </div>
      <div style={{ flexShrink: 0, width: '162px', paddingTop: '8px', order: 2 }}>
        <div className="float3d" style={{ background: 'linear-gradient(145deg, #0F0A1E 0%, #1A0F2E 100%)', borderRadius: '14px', padding: '18px 16px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE 03</div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>Research &amp; Drafting</div>
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

      {/* ── SECTION 01 ── */}
      <ChapterSection id="genai-m3-research" num="01" accentRgb={ACCENT_RGB} first>
        {chLabel('Research, Summarization & Drafting')}
        {para(track === 'engineer'
          ? "In Pre-Read 02, Aarav learned to write structured prompts — system messages, output schemas, few-shot examples, context budgeting. That discipline improved consistency. But his research assistant is now producing consistent outputs that analysts don't trust. The issue isn't the prompt. It's what goes into the pipeline before the prompt ever runs."
          : "In Pre-Read 02, Rhea learned to write disciplined prompts — role, format, constraints, length, examples. The outputs are cleaner. But analysts still re-read source documents because the AI summaries look complete and miss critical context. The issue isn't the prompt. It's what the prompt is reading."
        )}
        {h2("Research isn't finding answers. It's triangulating sources.")}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can identify every source a claims analyst would consult for a given query type and design a pipeline that reads all of them — not just the most obvious one."
          : "\u25b6 After this section, you can list the sources your team's research pipeline currently reads and the sources it should read — and close the gap."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>Aarav&apos;s claims research assistant has been live for one week. Three analysts have flagged the same issue in three different ways: the summaries are fluent, well-structured, and wrong in ways that aren&apos;t immediately visible. One analyst escalated a claim using a policy clause the AI cited — and it was overridden in a 2022 amendment that lives in a separate document the pipeline never read.</>
            : <>Rhea&apos;s team ran their first week of AI-assisted exception prep. Usage was high — 7 of 8 analysts used it. In Tuesday&apos;s review meeting, two escalation recommendations turned out to be based on summaries that missed the context from the prior week&apos;s thread. The AI had no knowledge of the prior thread because it only read the current exception ticket.</>}
        </SituationCard>
        {para(track === 'engineer'
          ? "A single-document summary cannot triangulate — it can only compress. The footnote contradiction isn't a model failure or a prompt failure. It's a source coverage failure. The pipeline was designed to read the primary policy document. Amendments, case precedents, and internal guidelines live in separate files. The model summarised what it was given. What it was given was incomplete."
          : "The model never tells you what it's missing. It fills every gap with plausible-sounding content. When the exception ticket is the only input, the model produces a competent summary of the exception ticket. It has no mechanism to ask for the prior thread — and no way to signal that its output is missing three weeks of context."
        )}
        {keyBox('Why single-source research pipelines fail', [
          "Policy ecosystems are multi-document: primary policy + amendments + case precedents + internal guidelines rarely live in one file. A pipeline that reads one document is reading one snapshot of a larger system.",
          "The model never signals incomplete context — it produces fluent output regardless. Confident tone is not evidence of completeness. Fluent and incomplete is harder to catch than broken.",
          "Triangulation requires explicit pipeline architecture: run targeted extractions per source, then a synthesis step that surfaces agreements and flags conflicts across sources.",
          "The question 'what sources belong in this research type?' must be answered by a human before the pipeline is built — it cannot be inferred by the model from the query.",
          "Source coverage is a design decision, not a prompt instruction. Telling the model to 'be comprehensive' does not cause it to read files it was never given.",
        ], ACCENT)}
        <GenAIConversationScene
          mentor={track === 'builder' ? 'kabir' : 'anika'}
          track={track}
          accent={track === 'builder' ? '#0F766E' : '#7C3AED'}
          techLines={[
            { speaker: 'protagonist', text: "The pipeline is working. Analysts are using it. But I'm getting flagged on output quality — the summaries read perfectly." },
            { speaker: 'mentor', text: "Show me the pipeline. Walk me through what goes into the prompt." },
            { speaker: 'protagonist', text: "We pull the primary policy document, pass it to Claude, ask for a structured summary with the key clauses and any exceptions noted." },
            { speaker: 'mentor', text: "One document. You're building a research tool on one document per query." },
            { speaker: 'protagonist', text: "It's the authoritative source. Why would I need more?" },
            { speaker: 'mentor', text: "Because policy documents get amended. Amendments live in separate files. Precedents live in case histories. Your pipeline is summarising one snapshot of a policy ecosystem, not the ecosystem." },
            { speaker: 'protagonist', text: "So the pipeline needs to pull all of those?" },
            { speaker: 'mentor', text: "It needs to triangulate them. Run targeted extractions per source, then a synthesis step that surfaces where they agree and flags where they conflict. Right now you have a compression tool dressed up as a research tool." },
            { speaker: 'protagonist', text: "But if I pull five documents into one prompt, the context window gets unwieldy." },
            { speaker: 'mentor', text: "Then you don't pull five documents into one prompt. You run five targeted extractions and feed a synthesis prompt the outputs. Research is a pipeline, not a single call." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The adoption was great. But Tuesday's meeting was a disaster — two recommendations were wrong because the AI didn't know about the prior week's context." },
            { speaker: 'mentor', text: "What did you give the AI to work with?" },
            { speaker: 'protagonist', text: "The current exception ticket. That's everything the analyst has in front of them." },
            { speaker: 'mentor', text: "Is the current ticket actually everything relevant to the decision?" },
            { speaker: 'protagonist', text: "Well — no. There's usually a thread. Prior actions, previous escalations. But that's all in the history." },
            { speaker: 'mentor', text: "So your AI is making recommendations based on one data point, and you're surprised it misses context that lives somewhere else." },
            { speaker: 'protagonist', text: "I thought the model was smart enough to ask for more context if it needed it." },
            { speaker: 'mentor', text: "The model never tells you what it doesn't have. It fills gaps with plausible-sounding content. Research means giving it all the relevant sources, not the most obvious one." },
            { speaker: 'protagonist', text: "So I need to pull the prior thread into the prompt too?" },
            { speaker: 'mentor', text: "You need to decide which sources belong in the research pipeline for this exception type — current ticket, prior thread, relevant policy clause, any open flags. Then build the pipeline to assemble those. The AI didn't fail. Your source selection did." },
          ]}
        />
        <GenAIAvatar
          name={track === 'builder' ? 'Kabir' : 'Anika'}
          nameColor={track === 'builder' ? '#0F766E' : '#7C3AED'}
          borderColor={track === 'builder' ? '#0F766E' : '#7C3AED'}
          conceptId="genai-m3-research"
          content={<>{track === 'engineer' ? "A research pipeline that reads one document per query isn't doing research — it's doing compression. The design question is: what are all the sources that belong in this query type? That question must be answered by a human, not inferred by the model." : "The model produces plausible outputs from whatever it's given. 'Comprehensive' is a property of your source selection, not your prompt. An analyst's tacit knowledge about which sources matter is the most important thing to encode in the pipeline."}</>}
          expandedContent={track === 'engineer' ? "Source coverage is an architectural decision. You cannot fix a pipeline that reads the wrong inputs by improving the prompt — the model can only work with what it receives. Map every source a senior analyst would consult for this query type, then build the pipeline to assemble those inputs before the prompt runs." : "The gap between 'AI gave me a summary' and 'AI gave me a brief I can act on' is almost always a source selection problem. A research pipeline checklist — what sources does this exception type require? — is more valuable than a better prompt."}
          question={track === 'engineer' ? "Aarav's pipeline returns a confident policy summary citing three clauses. A senior analyst finds a fourth clause in an amendment document not in the pipeline. What's the correct diagnosis?" : "Rhea's Claude prompt reads only the current exception ticket. An analyst's recommendation turns out wrong because it missed the prior week's context thread. What should Rhea change first?"}
          options={track === 'engineer' ? [
            { text: "The model needs a larger context window to catch more clauses", correct: false, feedback: "Context window is not the problem — the document was never passed to the model. You cannot summarise what was never given." },
            { text: "The prompt needs to explicitly ask the model to look for amendments", correct: false, feedback: "Instructing the model to look for amendments doesn't give it access to the amendment file. Source access is a pipeline design decision." },
            { text: "The pipeline is missing the amendment document as an input source", correct: true, feedback: "Correct. The amendment document belongs in the source list for this query type. The model cannot read what the pipeline doesn't provide." },
            { text: "The model's temperature is too low — it's being too conservative", correct: false, feedback: "Temperature affects creativity and variation, not source coverage. The model produces whatever it can from the inputs it receives." },
          ] : [
            { text: "Rewrite the summarisation prompt to ask for more detail", correct: false, feedback: "The prompt quality isn't the bottleneck. The issue is what data the prompt receives, not how it asks for it." },
            { text: "Add the prior exception thread as an input source to the pipeline", correct: true, feedback: "Correct. The prior thread is a required input for this exception type. Without it, the model has half the context a senior analyst would use." },
            { text: "Switch to a more capable model that handles longer context", correct: false, feedback: "Model capability isn't the bottleneck. The pipeline is missing a source — a stronger model with the same incomplete input produces the same incomplete output." },
            { text: "Ask analysts to review AI summaries before acting on them", correct: false, feedback: "Human review catches errors after the fact. The goal is to give the model correct inputs so it produces useful outputs in the first place." },
          ]}
        />
        <TiltCard style={{ margin: '28px 0' }}><SourcePipelineCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'engineer' ? "Take the last claim your research assistant got wrong or incomplete. Map every document a senior analyst would actually consult for that claim type — primary policy, amendments, case precedents, internal memos. Count how many your current pipeline reads. Identify the highest-value missing source and sketch a targeted extraction step to pull it." : "Pick one exception type your team handles weekly. List every piece of context a strong analyst would pull before making a recommendation: current ticket, prior thread, relevant policy clause, any open flags. Check which of those your current Claude prompt actually receives. The gap is your pipeline redesign."} />
        <QuizEngine
          conceptId="genai-m3-research"
          conceptName="Triangulating Sources"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m3-research',
            question: QUIZZES[0].question[track],
            options: QUIZZES[0].options[track],
            correctIndex: QUIZZES[0].correctIndex[track],
            explanation: QUIZZES[0].explanation[track],
            keyInsight: QUIZZES[0].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'engineer' ? "Aarav has the right sources in the pipeline. Analysts still say the summaries aren't actionable. Next: the difference between compressing a document and compressing for a decision." : "Rhea's pipeline now reads the right sources. Analysts still re-read originals because the summaries don't tell them what to do. Next: what a decision-grade summary actually looks like."} />
      </ChapterSection>

      {/* ── SECTION 02 ── */}
      <ChapterSection id="genai-m3-compression" num="02" accentRgb={ACCENT_RGB}>
        {h2("Summarization is compression. What survives depends on what you\’re compressing for.")}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can add a decision frame to any summarisation prompt and explain why the same source document produces different outputs for different decision types."
          : "\u25b6 After this section, you can rewrite a summary prompt to produce a brief that ends with a recommendation — not a description."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>Aarav fixes the source coverage problem. Three documents now feed the pipeline. Analysts say the outputs are better. But they still can&apos;t use the summaries to decide without re-reading the originals. The summaries are accurate three-bullet recaps. They&apos;re not decision support.</>
            : <>Rhea redesigns her pipeline to pull the prior thread alongside the current ticket. Her team is happier. But her director looked at last week&apos;s briefing and said: &ldquo;I can&apos;t tell if I&apos;m being asked to act on this or just informed.&rdquo; The summaries describe the situation. They don&apos;t frame the decision.</>}
        </SituationCard>
        {para(track === 'engineer'
          ? "What survives summarisation depends on the compression function. 'Important clauses' and 'clauses relevant to approve/escalate/deny' compress the same document differently. The first produces a general overview. The second produces decision support. Neither is wrong — they are different specifications producing different outputs."
          : "A report gives the reader everything relevant and lets them decide. A brief gives the reader what they need to make a specific decision and says what the decision should be. If your director has to infer what you think she should do, your brief failed at its core job."
        )}
        {pullQuote(track === 'engineer' ? "Accurate and unusable is worse than slightly wrong and actionable. At least the analyst knows where to push back." : "Uncertainty is an actionable output. Neutral description isn't.")}
        {keyBox(track === 'engineer' ? "Compression is purposeful, not neutral" : "Brief vs. report: writing for a decision, not a reader", [
          track === 'engineer'
            ? "What survives summarisation depends on the compression function. 'Important clauses' and 'clauses relevant to approve/escalate/deny' compress the same document differently."
            : "A report gives the reader everything relevant and lets them decide. A brief gives the reader what they need to make a specific decision and says what the decision should be. Those are different documents.",
          track === 'engineer'
            ? "Decision-support summaries require three inputs: who is reading, what decision they're making, what information would change that decision. Without all three, you get a description."
            : "If your brief doesn't end with a recommendation or decision frame, you've written a report. That's not wrong — it's just a different document than your director asked for.",
          track === 'engineer'
            ? "Parameterise the decision frame: a prompt template with a decision_type variable produces more consistent, actionable outputs than N separate prompts for each analyst role."
            : "Uncertainty is an actionable output: 'I don't have enough data to recommend action' tells the reader what's needed next. Neutral description tells them nothing.",
          track === 'engineer'
            ? "The reader's job title is not enough to specify audience. A claims analyst doing first-pass triage and a claims analyst doing escalation review need different summaries of the same document."
            : "AI produces whatever output structure you specify. 'Write a summary' and 'write a brief that ends with a recommendation and a confidence level' produce completely different documents.",
          track === 'engineer'
            ? "Fluent + accurate + useless is the most dangerous output type — it gets approved, acted on, and is wrong in ways the reader can't see."
            : "Comprehensiveness is a failure mode when the reader has a specific question. Every line in the brief either answers that question or it doesn't belong.",
        ], '#7C3AED')}
        <GenAIConversationScene
          mentor="rohan"
          track={track}
          accent="#2563EB"
          techLines={[
            { speaker: 'protagonist', text: "I fixed the source coverage. Three documents now. Analysts still say they can't use it to decide — they have to re-read the originals." },
            { speaker: 'mentor', text: "What does your summarisation prompt ask for?" },
            { speaker: 'protagonist', text: "'Summarise the key clauses and any exceptions in three bullet points.'" },
            { speaker: 'mentor', text: "Three bullet points of what? For who? To do what?" },
            { speaker: 'protagonist', text: "The key clauses. That's what analysts need." },
            { speaker: 'mentor', text: "What do analysts actually do with the output?" },
            { speaker: 'protagonist', text: "They decide whether to approve, escalate, or deny the claim." },
            { speaker: 'mentor', text: "Then the summary isn't for reading — it's for deciding. 'Key clauses' and 'decision-relevant clauses for approve/escalate/deny' are different prompts." },
            { speaker: 'protagonist', text: "So I need to specify the decision in the prompt?" },
            { speaker: 'mentor', text: "You need to specify the reader, the decision they're making, and what information changes that decision. Compression without a purpose function produces accurate summaries that nobody acts on." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "My director said she couldn't tell if she was being asked to act or just informed. The summaries describe the situation perfectly." },
            { speaker: 'mentor', text: "What does your director do after reading the brief?" },
            { speaker: 'protagonist', text: "She decides whether to flag anything for leadership or let the team handle it." },
            { speaker: 'mentor', text: "Does your brief tell her what you think she should do?" },
            { speaker: 'protagonist', text: "No. I didn't want to presume. I thought I should give her the facts." },
            { speaker: 'mentor', text: "Then you've written a report, not a brief. A brief compresses to a recommended action. A report compresses to a complete picture. Those are different documents." },
            { speaker: 'protagonist', text: "I'm not always sure what the recommendation should be." },
            { speaker: 'mentor', text: "Then the brief should say that — 'this week's pattern is ambiguous; here's what I'd want to know before deciding.' Uncertainty is an actionable output. Neutral description isn't." },
            { speaker: 'protagonist', text: "So the brief prompt needs to end with a recommendation?" },
            { speaker: 'mentor', text: "It needs to end with a decision frame: what is the reader being asked to do? If your director is deciding whether to escalate, the brief concludes with your read on that question. Everything above it is supporting evidence." },
          ]}
        />
        <GenAIAvatar
          name="Rohan"
          nameColor="#2563EB"
          borderColor="#2563EB"
          conceptId="genai-m3-compression"
          content={<>{track === 'engineer' ? "A summarisation prompt that doesn't specify the decision is a compression function with an undefined purpose. The output is accurate in the same way a phone book is accurate — complete, useless for any specific action." : "Every brief has an implied recommendation, even when you don't write it. The question is whether the reader can find it. If your director has to infer what you think she should do, your brief failed at its core job."}</>}
          expandedContent={track === 'engineer' ? "Parameterise the decision frame as a variable in your prompt template: READER, DECISION_TYPE, WHAT_CHANGES_THE_DECISION. The same summarisation function produces analyst-triage briefs and compliance-review briefs from the same sources — with different compression functions." : "The fix is structural, not cosmetic. Add three lines to your briefing prompt before the instruction: READER (your director), DECISION (escalate or delegate?), RECOMMENDATION_REQUIRED (yes — end the brief with your read). Run it on last week's data and compare her response."}
          question={track === 'engineer' ? "Aarav's prompt says 'summarise the key clauses in three bullets.' Analysts say the output is accurate but they can't use it to decide. What is the most targeted fix?" : "Rhea's brief describes the exception backlog accurately. Her director says she can't tell what she's being asked to do. What does Rhea need to add to the drafting prompt?"}
          options={track === 'engineer' ? [
            { text: "Increase the number of bullets from three to five", correct: false, feedback: "More bullets produce more information, not more actionability. The problem is that the output has no decision frame — five accurate bullets without one are still unusable." },
            { text: "Add the decision the analyst is making as a parameter to the prompt", correct: true, feedback: "Correct. Adding the decision type (approve/escalate/deny) transforms the compression function. The model selects and weights information differently when it knows what decision the output serves." },
            { text: "Use a stronger model that produces more decision-oriented outputs", correct: false, feedback: "Model capability isn't the bottleneck. A stronger model produces a more fluent version of the same purposeless summary without a decision frame." },
            { text: "Add few-shot examples of good summaries to the prompt", correct: false, feedback: "Few-shot examples help with format and style. They don't introduce a decision frame unless the examples themselves demonstrate decision-oriented structure." },
          ] : [
            { text: "Make the brief longer and more detailed", correct: false, feedback: "Length doesn't create actionability. A longer description is still a description." },
            { text: "Add a section listing all open exceptions", correct: false, feedback: "A comprehensive list of exceptions is a report, not a brief. The director already has access to the exception list." },
            { text: "Add a decision frame and recommendation to the end of the output structure", correct: true, feedback: "Correct. A brief without a recommendation leaves the reader to infer your position. The decision frame — what is the director being asked to decide, and what do you recommend — is the core output of a brief." },
            { text: "Switch to a model better suited to executive communication", correct: false, feedback: "Model selection doesn't solve a structural prompt problem. Both models will produce a description if the prompt asks for a description." },
          ]}
        />
        <TiltCard style={{ margin: '28px 0' }}><CompressionCompareCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'engineer' ? "Take your current summarisation prompt. Add three lines before the instruction: READER: [who uses this output], DECISION: [what they're deciding], CHANGES_DECISION_IF: [what information would flip the outcome]. Rewrite the instruction to produce an output that serves that decision. Compare analyst feedback on the old vs. new version." : "Take last week's exception brief. Identify the one recommendation you were implicitly making but didn't state. Rewrite the final section to state it explicitly with a confidence level (High/Medium/Low) and the one piece of information that would change your read. Send the rewritten version to your director and note the difference in how she responds."} />
        <QuizEngine
          conceptId="genai-m3-compression"
          conceptName="Compression vs Transcription"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m3-compression',
            question: QUIZZES[1].question[track],
            options: QUIZZES[1].options[track],
            correctIndex: QUIZZES[1].correctIndex[track],
            explanation: QUIZZES[1].explanation[track],
            keyInsight: QUIZZES[1].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'engineer' ? "Aarav's summaries now serve the analyst's decision. But two analysts running the same query still get different outputs. The problem is upstream of the model — in how the query itself is formed." : "Rhea's briefs now end with a recommendation. But her regional manager keeps sending them back with 'too much — what do I do with this?' The problem is not in the summary. It's in the question she's answering."} />
      </ChapterSection>

      {/* ── SECTION 03 ── */}
      <ChapterSection id="genai-m3-5w1h" num="03" accentRgb={ACCENT_RGB}>
        {h2("5W1H isn\’t a checklist for the output. It\’s a diagnostic for the brief before you write a word.")}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can convert any open-ended research query into a 5W1H-structured query template and explain why it eliminates output variance that prompt changes can't fix."
          : "\u25b6 After this section, you can run 5W1H on your reader before writing a brief — and cut every line that doesn't answer the question they actually brought to it."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>Aarav has been asked to build a research brief template for the claims team before they run any AI query. The request came after two analysts ran the same query and got contradictory outputs — same documents, different summaries. Aarav realises the problem isn&apos;t in the pipeline. It&apos;s in how the query is formed.</>
            : <>Rhea&apos;s Monday briefings are consistently structured now, but her regional manager sent back three in a row with the same note: &ldquo;Too much. What am I supposed to do with this?&rdquo; Rhea realises she has been answering questions her manager didn&apos;t ask.</>}
        </SituationCard>
        {para(track === 'engineer'
          ? "Ambiguous queries produce variable outputs across runs — the model fills unspecified dimensions with plausible defaults that differ between calls. Two analysts asking 'the same question' with different implicit context generate different prompts. The fix is not in the prompt template. It's in the query template that generates the prompt."
          : "A brief that covers everything relevant is a report. A brief that answers one specific question is a brief. The difference is in applying 5W1H to the reader — not to the content you have — before writing anything."
        )}
        {keyBox('5W1H applied upstream of the prompt', [
          "WHO: who is the affected party in this query? (policy tier, claimant type, analyst role) — specifies the scope the model extracts for",
          "WHAT: what is the specific claim scenario or exception type? — eliminates the generic industry-overview trap",
          "WHEN: when does this policy version apply? (effective date, coverage period) — prevents the model defaulting to general policy principles",
          "WHERE: what jurisdiction, plan type, or regional context applies? — scopes the extraction to the relevant policy domain",
          "WHY: why is this being researched? what decision will this output inform? — transforms compression function from 'summarise' to 'support this decision'",
          "HOW: how will the output be used? (analyst triage / compliance review / director brief) — determines the format and level of detail",
        ], '#2563EB')}
        <GenAIConversationScene
          mentor={track === 'builder' ? 'kabir' : 'leela'}
          track={track}
          accent={track === 'builder' ? '#0F766E' : '#C2410C'}
          techLines={[
            { speaker: 'protagonist', text: "Two analysts ran the same query on the same policy document. Completely different summaries. Same prompt, same documents, same model. I don't understand how that's possible." },
            { speaker: 'mentor', text: "What was the query?" },
            { speaker: 'protagonist', text: "'Summarise coverage dispute handling for outpatient surgery claims.'" },
            { speaker: 'mentor', text: "That query has no who. No when. No jurisdiction. No claim type. Is 'outpatient surgery' the same across all policy tiers?" },
            { speaker: 'protagonist', text: "No — there are three tiers with different coverage limits." },
            { speaker: 'mentor', text: "So the query was ambiguous. Two analysts' prompts diverged slightly in context — one probably added their claim number, one didn't. The pipeline filled the ambiguity differently." },
            { speaker: 'protagonist', text: "So the fix is a more specific query?" },
            { speaker: 'mentor', text: "The fix is a query template that forces the analyst to specify WHO is affected, WHAT claim type, WHEN the policy applies, WHERE the jurisdiction, WHY this is being researched, and HOW the output will be used. You answer those before you write the query." },
            { speaker: 'protagonist', text: "That's a form, not a prompt." },
            { speaker: 'mentor', text: "Yes. The form produces the prompt. 5W1H is a pre-query diagnostic, not a summary structure. It catches the question before it becomes a bad prompt." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "My manager sent back three briefs with 'too much — what am I supposed to do with this?' I thought I was being thorough." },
            { speaker: 'mentor', text: "What does your manager use the brief for?" },
            { speaker: 'protagonist', text: "She reviews it before the regional call. She needs to know if anything in our backlog requires her attention." },
            { speaker: 'mentor', text: "That's a specific filter: does anything here require my attention? Does your brief answer that question directly?" },
            { speaker: 'protagonist', text: "It covers everything that happened that week." },
            { speaker: 'mentor', text: "Right — you answered 'what happened' when she asked 'does anything require my attention.' Different question." },
            { speaker: 'protagonist', text: "So I should filter to escalations only?" },
            { speaker: 'mentor', text: "You should run 5W1H on the brief before writing it. WHO: your manager. WHAT: items requiring her attention. WHEN: before the regional call. WHY: so she can prepare. HOW: she'll decide whether to raise or delegate. Every sentence in the brief either answers her question or it's cut." },
            { speaker: 'protagonist', text: "That's a much shorter brief." },
            { speaker: 'mentor', text: "Yes. Short and answered is worth more than long and comprehensive." },
          ]}
        />
        {PMPrincipleBox({ label: '◈ Principle', principle: "Before writing a research brief or query, state in one sentence who is reading it, what decision they're making with it, and what would make them say 'this is exactly what I needed.' If you can't, the brief isn't ready to write." })}
        <GenAIAvatar
          name={track === 'builder' ? 'Kabir' : 'Leela'}
          nameColor={track === 'builder' ? '#0F766E' : '#C2410C'}
          borderColor={track === 'builder' ? '#0F766E' : '#C2410C'}
          conceptId="genai-m3-5w1h"
          content={<>{track === 'engineer' ? "Query variance is almost always upstream of the model — it's in the query itself. Two analysts asking 'the same' question with different implicit contexts get different answers. 5W1H standardises the context before the prompt is written, not after." : "Comprehensiveness is a failure mode when the reader has a specific question. 5W1H forces you to state that question before you start — and then to answer only that question, with everything else cut."}</>}
          expandedContent={track === 'engineer' ? "A query template that enforces 5W1H before the prompt is generated reduces output variance dramatically — not because the model changed, but because the ambiguity was removed upstream. Two analysts filling the same template get the same prompt structure, with only the case-specific values differing." : "The 'how' in 5W1H is the most neglected dimension: how will the reader use this output? That question determines format — a Slack message, a slide, a recommendation memo — not the content of what you know. Get 'how' wrong and the content is irrelevant."}
          question={track === 'engineer' ? "Two analysts run the same research query and get different summaries from the same pipeline. What is the most likely root cause?" : "Rhea's brief is thorough but her manager keeps saying 'what do I do with this.' What 5W1H question is Rhea failing to answer?"}
          options={track === 'engineer' ? [
            { text: "The model has high temperature, causing non-deterministic outputs", correct: false, feedback: "Temperature causes phrasing variance, not structural variance in which policy clauses are included. The query's unspecified dimensions cause structural output differences." },
            { text: "The query is ambiguous — unspecified dimensions are filled differently across runs", correct: true, feedback: "Correct. 'The same query' with different implicit contexts fills unspecified dimensions differently. Standardising the query inputs with 5W1H eliminates the variance." },
            { text: "The documents are inconsistent and produce different summaries by section priority", correct: false, feedback: "Document inconsistency would produce the same inconsistency for all analysts. Variation between analysts indicates the source is in query formation, not document quality." },
            { text: "The pipeline needs a caching layer to return consistent outputs for identical queries", correct: false, feedback: "Caching returns identical outputs for byte-identical queries — but if two analysts' queries differ at all, caching doesn't help. Fix the query before you cache it." },
          ] : [
            { text: "WHO — she does not know who her reader is", correct: false, feedback: "Rhea knows her reader — she's written for her manager before. The problem is not identifying the reader, it's identifying the reader's specific question in this context." },
            { text: "WHAT — she's answering the wrong question (what happened vs. what requires your attention)", correct: true, feedback: "Correct. Rhea is answering 'what happened this week' when her manager is asking 'does anything need my attention.' Same data source, different question, completely different brief." },
            { text: "WHERE — she's not specifying the right backlog scope", correct: false, feedback: "Scope is a secondary issue. The primary failure is that even the correctly scoped backlog is being presented as information rather than a decision filter." },
            { text: "HOW — she's not specifying the right output format", correct: false, feedback: "Format follows function. The format problem will resolve when the question being answered is correct. A well-formatted answer to the wrong question is still the wrong answer." },
          ]}
        />
        <TiltCard style={{ margin: '28px 0' }}><FiveW1HCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'engineer' ? "Take the most common research query your claims analysts run. Write out the 5W1H for it: WHO is affected (tier/type), WHAT claim scenario, WHEN the policy applies, WHERE the jurisdiction, WHY this is being researched, HOW the output is used. Convert each answer into a parameter in the query template. Run the old and new template on the same policy document and compare output consistency across three runs." : "Pull last week's brief that got the most 'too much' feedback. Write the 5W1H for your reader: WHO is reading, WHAT question are they bringing, WHEN do they need to decide, WHERE in the process does this brief land, WHY this week vs. any other, HOW will they act on it. Count how many sentences in your brief don't directly answer her question. Those are the cuts."} />
        <QuizEngine
          conceptId="genai-m3-5w1h"
          conceptName="5W1H Framework"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m3-5w1h',
            question: QUIZZES[2].question[track],
            options: QUIZZES[2].options[track],
            correctIndex: QUIZZES[2].correctIndex[track],
            explanation: QUIZZES[2].explanation[track],
            keyInsight: QUIZZES[2].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'engineer' ? "Aarav's queries are now structured. His manager asks him to demo the research assistant to the compliance team — and two days before the presentation, a compliance officer finds that three statistics in the sample outputs can't be traced to any source document." : "Rhea's briefs are now structured and targeted. She sends one to her director with a specific claim: 'Exception resolution time improved 18% since the new protocol.' A week later, the data team asks where that number came from."} />
      </ChapterSection>

      {/* ── SECTION 04 ── */}
      <ChapterSection id="genai-m3-cove" num="04" accentRgb={ACCENT_RGB}>
        {h2("Convincing is not the same as correct. COVE is how you tell the difference.")}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can apply COVE to any AI output before it crosses a handoff point — and redesign the prompt to surface unverifiable claims before they reach compliance."
          : "\u25b6 After this section, you can run the verifiability check on any specific claim in a brief before forwarding it — and recognise the pattern of AI-generated statistics that sound sourced but aren't."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>Aarav&apos;s pipeline is producing well-structured, well-sourced summaries. His manager asks him to present the research assistant to the compliance team. Two days before the presentation, a compliance officer reviews five sample outputs and flags that three contain statistics presented as facts — with no traceable source in the documents provided.</>
            : <>Rhea sent her director a brief with a specific claim: &ldquo;Exception resolution time has improved 18% since implementing the new triage protocol.&rdquo; Her director quoted the figure in a leadership meeting. A week later, the data team asked where the 18% came from. Nobody could trace it. It came from a Claude output.</>}
        </SituationCard>
        {para(track === 'engineer'
          ? "The model produces confident outputs regardless of whether the source documents support the claim. When the prompt asks for 'key metrics and outcomes,' and the documents don't contain metrics, the model generates plausible-sounding ones from training data. That's not a hallucination in the dramatic sense — it's the model completing a pattern. The prompt invited it."
          : "Specific-sounding statistics are the most dangerous AI output type: they're specific enough to sound sourced and general enough to be unfalsifiable until someone looks. The 18% figure passed the sound-right test, the confident-tone test, and the formatting test. It failed the only test that matters: can you trace it to a source?"
        )}
        {keyBox('COVE: the four-question review', [
          "Completeness: does the output cover all the dimensions the decision requires? Gaps are usually invisible — the output looks complete because it doesn't announce what it missed.",
          "Originality: did the model draw from the provided sources, or from training data? Training-data content sounds authoritative and may be outdated or jurisdiction-specific in ways that don't apply.",
          "Verifiability: every specific claim — statistic, date, policy clause, case outcome — should trace to a specific sentence in the provided documents. If it can't be found there, assume it was generated.",
          "Efficiency: is the output the right length and format for the decision? Over-length outputs bury critical information; under-length outputs omit it. Neither serves the decision.",
          "Design COVE into the prompt: ask the model to cite its source sentence for each claim. It won't catch everything, but it surfaces unverifiable claims faster than manual review.",
        ], '#0F766E')}
        <GenAIConversationScene
          mentor="leela"
          track={track}
          accent="#C2410C"
          techLines={[
            { speaker: 'protagonist', text: "Compliance flagged three of my sample outputs. They say the statistics can't be verified in the source documents. I pulled the documents — they're right. The numbers aren't there." },
            { speaker: 'mentor', text: "What was your prompt?" },
            { speaker: 'protagonist', text: "'Summarise the key metrics and outcomes referenced in these documents.'" },
            { speaker: 'mentor', text: "The documents didn't have metrics. So where did the model get them?" },
            { speaker: 'protagonist', text: "Training data, probably. Industry averages." },
            { speaker: 'mentor', text: "So your prompt asked for metrics, the documents didn't have them, and the model generated plausible ones. That's not a model failure — that's your prompt inviting a hallucination." },
            { speaker: 'protagonist', text: "How was I supposed to know the documents didn't have metrics?" },
            { speaker: 'mentor', text: "You run COVE. Verifiability first: every claim in the output should trace to a line in the input. If it can't, it's generated, not found. You review for that before the output reaches anyone downstream." },
            { speaker: 'protagonist', text: "So I need a verification step in the pipeline?" },
            { speaker: 'mentor', text: "Two things: a prompt that asks the model to cite the specific source sentence for every claim it makes, and a human review step for outputs that will be used in compliance contexts. The model can help you catch its own hallucinations if you design the prompt to surface them." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The 18% figure came from a Claude output. I didn't check it. My director quoted it to leadership. The data team can't find the source." },
            { speaker: 'mentor', text: "How did the number get into the brief?" },
            { speaker: 'protagonist', text: "I asked Claude to 'identify any improvements since implementing the triage protocol.' It returned the 18% figure with a confident tone. It looked like analysis." },
            { speaker: 'mentor', text: "Confident tone is the danger signal, not the assurance. The more specific a number sounds, the more important it is to verify it." },
            { speaker: 'protagonist', text: "How was I supposed to know it wasn't in the data?" },
            { speaker: 'mentor', text: "COVE. Verifiability: every specific claim — especially any percentage, trend, or comparison — needs a traceable source. If you can't point to a row in your data or a line in a document, the claim doesn't go in the brief." },
            { speaker: 'protagonist', text: "That would take forever to check everything." },
            { speaker: 'mentor', text: "You don't check everything. You apply COVE selectively to claims that will be quoted. A number your director will repeat to leadership is a claim that requires verification. That's five minutes, not forever." },
            { speaker: 'protagonist', text: "What do I do about the 18% that's already out there?" },
            { speaker: 'mentor', text: "You correct it proactively — before someone else does. And you add a standing rule: any specific statistic in a brief that will be forwarded gets a source citation in parentheses. If you can't write the citation, the number doesn't go in." },
          ]}
        />
        {PMPrincipleBox({ label: '◈ Principle', principle: "Apply COVE at the handoff point — before output crosses from your workflow into someone else's decision. Completeness, Originality, Verifiability, Efficiency: four questions, five minutes, before you forward anything." })}
        <GenAIAvatar
          name="Leela"
          nameColor="#C2410C"
          borderColor="#C2410C"
          conceptId="genai-m3-cove"
          content={<>{track === 'engineer' ? "The model produces confident outputs regardless of whether the source documents support the claim. Designing your prompt to require source citations for each claim doesn't eliminate hallucination — but it makes unverifiable claims visible before they reach compliance." : "Specific-sounding numbers in AI outputs are not analysis — they're pattern completion. The model generates what a statistic would look like in this context. The question is always: can you find this number in a source, or did the model produce it?"}</>}
          expandedContent={track === 'engineer' ? "COVE is a 5-minute review, not a full audit. Apply it selectively to claims that will be acted on or forwarded — not to every line of every output. The highest-risk outputs are those containing specific numbers, dates, or named precedents, because they're precise enough to be acted on and authoritative-sounding enough to bypass scrutiny." : "The pattern is always the same: specific number, confident tone, no citation. Train yourself to pause on any specific statistic in an AI output and ask: where exactly does this come from? If you can't answer in 10 seconds, don't include it in a brief that will be forwarded."}
          question={track === 'engineer' ? "Aarav's pipeline produces a summary citing '23% of outpatient surgery claims in this category result in secondary review.' The source documents don't contain this figure. Which COVE dimension catches this first?" : "Rhea's brief includes 'exception resolution time improved 18% since implementing the new protocol.' Her data team can't find the source. What is the correct COVE diagnosis?"}
          options={track === 'engineer' ? [
            { text: "Completeness — the output missed other statistics in the documents", correct: false, feedback: "Completeness checks for missing required information, not for invented information. The issue is a claim that can't be sourced — that's a Verifiability failure." },
            { text: "Originality — the model drew the figure from training data, not the provided documents", correct: false, feedback: "Originality is the correct root-cause dimension — but Verifiability is the first practical check. If you can't verify the source, Origin doesn't matter for the immediate decision." },
            { text: "Efficiency — the statistic makes the output unnecessarily long", correct: false, feedback: "Efficiency is about length relative to the decision's needs — not about whether individual claims are accurate." },
            { text: "Verifiability — the claim cannot be traced to a specific source sentence in the inputs", correct: true, feedback: "Correct. Verifiability is the first check: trace the claim to a specific source sentence. If '23%' appears nowhere in the provided documents, the claim is model-generated regardless of how confident it sounds." },
          ] : [
            { text: "Completeness — the brief missed other improvement metrics", correct: false, feedback: "Completeness would catch missing improvement types — not a fabricated figure. The problem is that 18% is present but unverifiable, not that other metrics are absent." },
            { text: "Originality only — Claude generated a number from training patterns", correct: false, feedback: "Originality is correct — the number came from Claude's pattern completion, not Rhea's data. But B alone doesn't capture that it also failed the practical verifiability test." },
            { text: "Verifiability only — the 18% cannot be traced to a specific data source", correct: false, feedback: "Verifiability is correct as a standalone answer — but it misses that the root cause is model generation, not just a missing citation." },
            { text: "Both Originality and Verifiability — the number is model-generated AND unverifiable", correct: true, feedback: "Correct. The 18% figure fails on two dimensions: Originality (generated, not retrieved) and Verifiability (cannot be traced to a source). Both flags should have triggered review before forwarding." },
          ]}
        />
        <TiltCard style={{ margin: '28px 0' }}><COVECard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'engineer' ? "Take three outputs from your current research pipeline. For each, run COVE: (1) list the specific claims the output makes; (2) attempt to trace each claim to a specific sentence in the source documents; (3) flag any claim that can't be traced. Count the unverifiable claims per output. If it's more than one, redesign the prompt to ask the model to cite its source for each claim it makes." : "Pull the last brief you forwarded to your director. Identify every specific number, percentage, or trend statement in it. For each, spend 60 seconds trying to find the source in your data or documents. Mark each as Verified, Unverified, or Model-generated. Any Unverified or Model-generated claim that was forwarded is a process gap — decide what review step would catch it next time."} />
        <QuizEngine
          conceptId="genai-m3-cove"
          conceptName="COVE Evaluation"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m3-cove',
            question: QUIZZES[3].question[track],
            options: QUIZZES[3].options[track],
            correctIndex: QUIZZES[3].correctIndex[track],
            explanation: QUIZZES[3].explanation[track],
            keyInsight: QUIZZES[3].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'engineer' ? "Aarav now has a COVE-checked pipeline that compliance has approved. The last problem: his manager says the outputs 'read like technical documents.' The research is correct. The audience fit is wrong." : "Rhea's pipeline now produces COVE-verified briefs. The final step: she's sending the same brief to three different audiences. Her regional manager still doesn't respond."} />
      </ChapterSection>

      {/* ── SECTION 05 ── */}
      <ChapterSection id="genai-m3-draft" num="05" accentRgb={ACCENT_RGB}>
        {h2("Drafting from synthesis: the audience decides what matters, not the content.")}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can write an audience profile for three different readers of the same research output and parameterise a drafting prompt so one synthesis produces three different briefs."
          : "\u25b6 After this section, you can design a briefing workflow where one synthesis feeds three different audience-specific drafting prompts — so your team, your director, and your regional manager each receive the brief they actually need."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>Aarav is building the final stage of the research pipeline — the drafting step. He has a synthesis prompt that produces a comprehensive, COVE-checked output from the triangulated sources. His manager says it reads like a technical document, not a decision brief. Aarav realises he has been designing for content completeness, not audience fit.</>
            : <>Rhea&apos;s pipeline now runs research, validates sources, and produces a structured summary. The final step is drafting the brief. She has three different audiences: her team (operational detail), her director (escalation decisions), her regional manager (strategic flags). She has been sending the same brief to all three.</>}
        </SituationCard>
        {para(track === 'engineer'
          ? "The same synthesis produces different briefs for different audiences — not because the facts changed but because different roles filter for different signals. Technical accuracy and audience fit are orthogonal. A technically accurate document that doesn't fit the audience's decision context is worse than no document — it creates false confidence."
          : "One synthesis document is the source of truth. Three drafting prompts with different audience parameters produce three different briefs from the same underlying research. The work of drafting is deciding what the audience needs, not what the content contains."
        )}
        {keyBox(track === 'engineer' ? "Audience parameters for a drafting prompt" : "Three audiences, three drafts, one synthesis", [
          track === 'engineer'
            ? "AUDIENCE (role/title): specifies who is reading. 'Claims analyst' and 'VP of Operations' need different language density, different assumed prior knowledge, different action verbs."
            : "One synthesis, three audience-parameterised prompts. The AI drafts each brief. The human designs the audience profiles. Those are different jobs — only one of them can be delegated.",
          track === 'engineer'
            ? "PRIOR_KNOWLEDGE: what does this audience already know about this topic? A compliance officer doesn't need the policy explained. An analyst on their first week does."
            : "Your team needs operational detail: what to do, in what order, with what exceptions. Your director needs decision triggers: what escalates, what doesn't, your recommendation.",
          track === 'engineer'
            ? "DECISION: what will this audience decide after reading? The answer determines which information is foregrounded and which is supporting evidence."
            : "Your regional manager needs pattern signals: what in your data has cross-region implications. That's a completely different filter on the same source material.",
          track === 'engineer'
            ? "FORMAT: how will the audience consume it? Async read, meeting prep, quick scan. The same content packaged as a narrative, a table, and a bullet list gets used differently."
            : "Format is audience too: your team reads in Slack, your director reads in a doc, your regional manager reads in a summary table. The same content packaged differently gets used differently.",
          track === 'engineer'
            ? "The model drafts for whatever audience you specify. If you don't specify one, it defaults to 'general reader' — which serves nobody in a professional decision context."
            : "The audience question is: what decision are they making, and what do they already know? Every other specification follows from those two answers.",
        ], '#C2410C')}
        <GenAIConversationScene
          mentor="anika"
          track={track}
          accent="#7C3AED"
          techLines={[
            { speaker: 'protagonist', text: "The synthesis output is comprehensive — all sources covered, COVE-checked, structured. My manager says it reads like a technical document and she can't use it in a stakeholder meeting." },
            { speaker: 'mentor', text: "What does your drafting prompt say?" },
            { speaker: 'protagonist', text: "'Synthesise the research into a comprehensive brief covering all key findings.'" },
            { speaker: 'mentor', text: "Comprehensive to a platform engineer and comprehensive to a VP of Operations are different documents. Your prompt has no audience." },
            { speaker: 'protagonist', text: "I specify the topic. Isn't that enough context?" },
            { speaker: 'mentor', text: "No. The same topic requires different language, different detail level, different structure depending on who decides with it. A comprehensive brief for an engineer has API references and edge cases. A stakeholder brief has implications, risks, and a recommended action." },
            { speaker: 'protagonist', text: "So I need a different prompt for each audience?" },
            { speaker: 'mentor', text: "Or one prompt with audience as a parameter: AUDIENCE, PRIOR_KNOWLEDGE, DECISION, FORMAT. Feed the same synthesis into different audience frames and you get different briefs. The content doesn't change — the lens does." },
            { speaker: 'protagonist', text: "That means I need to know my audiences well enough to specify those parameters." },
            { speaker: 'mentor', text: "That's the work. The AI drafts from whatever frame you give it. Specifying the audience is not an AI problem — it's a product design problem." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "I've been sending the same brief to my team, my director, and my regional manager. My team finds it too high-level. My manager finds it useful. My regional manager hasn't responded in two weeks." },
            { speaker: 'mentor', text: "What does your regional manager do with the brief, when she does respond?" },
            { speaker: 'protagonist', text: "She flags anything with cross-region implications for a leadership discussion." },
            { speaker: 'mentor', text: "So she needs a brief filtered to cross-region patterns, not a summary of your team's week." },
            { speaker: 'protagonist', text: "My team's week is all I have." },
            { speaker: 'mentor', text: "Your team's week contains signals about cross-region patterns. A brief for your regional manager extracts those signals and frames them as implications — not your team's operations." },
            { speaker: 'protagonist', text: "That's a fundamentally different brief." },
            { speaker: 'mentor', text: "Yes. Drafting from synthesis means the synthesis is the raw material — what you build from it depends entirely on who's reading and what they do with it. One synthesis, three drafts, three prompts." },
            { speaker: 'protagonist', text: "So the AI writes three different versions from the same underlying research?" },
            { speaker: 'mentor', text: "Yes. You design the audience profiles. The AI drafts from them. The work of drafting is deciding what the audience needs — not what the content contains." },
          ]}
        />
        {PMPrincipleBox({ label: '◈ Principle', principle: "Design three audience profiles before you write one drafting prompt: who reads it, what they already know, what decision they're making, how they'll consume it. The model drafts from the profile, not from the content." })}
        <GenAIAvatar
          name="Anika"
          nameColor="#7C3AED"
          borderColor="#7C3AED"
          conceptId="genai-m3-draft"
          content={<>{track === 'engineer' ? "Comprehensive briefs that don't fit the audience's decision context are worse than no brief — they create false confidence. Audience design is a product problem that happens before the model drafts anything." : "One synthesis, three drafts. The work isn't in the AI — it's in knowing your audiences well enough to specify what each of them needs. That knowledge can't be delegated to the model."}</>}
          expandedContent={track === 'engineer' ? "Technical accuracy and audience fit are orthogonal. You can have both, either, or neither. The model produces technically accurate content easily. Audience fit requires you to specify the audience precisely enough that the model knows what to foreground, what to background, and what to cut." : "The gap between 'I sent a brief' and 'she responded to the brief' is almost always an audience fit problem. Your regional manager's silence is data — it means the brief isn't answering her question. The fix is an audience profile, not a better synthesis."}
          question={track === 'engineer' ? "Aarav's synthesis prompt produces technically accurate briefs. His manager says they 'read like technical documents.' What is the most targeted fix?" : "Rhea sends the same brief to her team, director, and regional manager. Team says too high-level, regional manager never responds. What is the root cause?"}
          options={track === 'engineer' ? [
            { text: "The synthesis needs to be shorter before drafting begins", correct: false, feedback: "Length is a symptom of missing audience specification, not the root cause. A shorter technical document is still a technical document." },
            { text: "The drafting prompt needs an audience parameter specifying who reads it and what decision they make", correct: true, feedback: "Correct. Adding audience — role, prior knowledge, decision, format — transforms the same synthesis into a brief the audience can actually use. The model drafts for whatever frame it's given." },
            { text: "The model needs few-shot examples of stakeholder briefs", correct: false, feedback: "Few-shot examples improve format consistency. They don't introduce audience fit unless the examples themselves are for the right audience." },
            { text: "The manager needs training on how to read technical briefs", correct: false, feedback: "The audience doesn't adapt to the document — the document adapts to the audience. That's the design principle." },
          ] : [
            { text: "The brief needs to be longer to serve all three audiences simultaneously", correct: false, feedback: "One longer brief serving all three audiences is not audience design — it's information overload for all three. A brief that tries to serve everyone serves nobody." },
            { text: "Rhea should write three separate briefs manually for each audience", correct: false, feedback: "Manually writing three briefs defeats the point of the pipeline. The goal is one synthesis, three audience-parameterised drafting prompts, three AI-drafted briefs." },
            { text: "The drafting prompt needs an audience parameter — one synthesis, three audience profiles, three separate prompts", correct: true, feedback: "Correct. The root cause is that one drafting prompt can't serve three audiences. Three audience profiles — each specifying who reads, what they know, what they decide, how they read — produce three useful briefs from the same research." },
            { text: "The regional manager is the problem — she doesn't engage with written briefs", correct: false, feedback: "The regional manager's silence is data, not a personality problem. She's not responding because the brief isn't answering her question. Fix the audience profile before diagnosing the reader." },
          ]}
        />
        <TiltCard style={{ margin: '28px 0' }}><AudienceDraftCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'engineer' ? "Identify the three most different audiences for your research pipeline outputs (e.g., claims analyst, compliance officer, product manager). Write an AUDIENCE PROFILE for each: role, prior knowledge of the claim type, decision they make from the brief, format they use. Build a drafting prompt template where audience is a variable. Run the same synthesis through all three profiles and compare — which output would actually be used, and why?" : "Pick the brief you send to your regional manager that she never responds to. Write her AUDIENCE PROFILE: her role, what she already knows about your team's operations, the one decision she makes from your briefs, how she reads it (morning scan / pre-meeting prep). Rewrite the drafting prompt to produce a brief for that profile specifically — filtering to cross-region signals, framing as implications, ending with a flag or 'no action needed.' Send it and note the response rate change."} />
        <QuizEngine
          conceptId="genai-m3-draft"
          conceptName="Audience-First Drafting"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m3-draft',
            question: QUIZZES[4].question[track],
            options: QUIZZES[4].options[track],
            correctIndex: QUIZZES[4].correctIndex[track],
            explanation: QUIZZES[4].explanation[track],
            keyInsight: QUIZZES[4].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'engineer' ? "Aarav now has a research pipeline that triangulates, compresses for decisions, applies 5W1H upstream, passes COVE, and drafts for audiences. Next module: wiring the whole thing into an automated workflow so analysts stop copy-pasting into ChatGPT." : "Rhea's research workflow now produces COVE-verified, audience-specific briefs. Next module: automating the plumbing around the AI calls so the workflow runs on its own every Monday morning."} />
      </ChapterSection>
    </>
  );
}

export default function GenAIPreRead3({ track, onBack, onNext, nextLabel }: Props) {
  const completionMessage = track === 'engineer'
    ? 'You now have the research pipeline toolkit: triangulated source architecture, decision-framed compression, 5W1H query templates, COVE evaluation, and audience-parameterised drafting.'
    : 'You now know how to build a research workflow that saves real hours: source selection, decision-grade summarisation, 5W1H briefing, COVE verification, and audience-specific drafting.';
  return (
    <GenAIPreReadLayout
      moduleNum="03" moduleLabel={TRACK_META[track].introTitle}
      accent={ACCENT} accentRgb={ACCENT_RGB}
      sections={SECTIONS} badges={BADGES} concepts={CONCEPTS}
      completionEmoji="◎" completionMessage={completionMessage} onBack={onBack} onNext={onNext} nextLabel={nextLabel}
    >
      <CoreContent track={track} />
    </GenAIPreReadLayout>
  );
}

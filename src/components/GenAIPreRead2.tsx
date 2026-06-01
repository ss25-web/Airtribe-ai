'use client';
import React, { useEffect, useMemo, useRef, useState, CSSProperties, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import GenAIPreReadLayout from './GenAIPreReadLayout';
import GenAIStreakCard, { GenAILatestBadgePanel } from './GenAISidebarExtras';
import QuizEngine from './QuizEngine';
import GenAIAvatar, { GenAIConversationScene, GenAIHeroCharacterStrip } from './GenAIAvatar';
import type { GenAITrack } from './genaiTypes';
import {
  ApplyItBox, ChapterSection, NextChapterTeaser, PMPrincipleBox, SituationCard,
  chLabel, h2, keyBox, para, pullQuote, TiltCard,
} from './pm-fundamentals/designSystem';
import { AirtribeLogo, DarkModeToggle } from './AirtribeBrand';

const ACCENT = '#2563EB';
const ACCENT_RGB = '37,99,235';
const MODULE_NUM = '02';

// --- Data Arrays & Constants ---

const CONCEPTS = [
  { id: 'genai-m2-anatomy', label: 'Prompt Anatomy', color: '#2563EB' },
  { id: 'genai-m2-fewshot', label: 'Zero-Shot vs Few-Shot', color: '#0F766E' },
  { id: 'genai-m2-context', label: 'Context Window', color: '#7C3AED' },
  { id: 'genai-m2-models', label: 'Model Selection', color: '#C2410C' },
  { id: 'genai-m2-refine', label: 'The Refinement Loop', color: '#DB2777' },
];

const SECTIONS = [
  { id: 'genai-m2-anatomy', label: '1. The Anatomy of a Prompt' },
  { id: 'genai-m2-fewshot', label: '2. Zero-Shot vs Few-Shot' },
  { id: 'genai-m2-context', label: '3. Context Window: What Goes In Matters' },
  { id: 'genai-m2-models', label: '4. Model Selection & Cost' },
  { id: 'genai-m2-refine', label: '5. The Refinement Loop' },
];

const QUIZZES = [
  {
    conceptId: 'genai-m2-anatomy',
    question: {
      'non-tech': "Rhea's discharge summary prompt gives inconsistent tone — formal sometimes, casual others. What's the most targeted fix?",
      'tech': "Aarav's entity extraction returns incomplete JSON on roughly one call in four. What's the most targeted first fix?",
    },
    options: {
      'non-tech': [
        "A) Add 'use professional language' at the end of the existing brief",
        "B) Open the prompt with 'You are a clinical documentation specialist'",
        "C) Add five examples of summaries written in the target tone",
        "D) Switch to a stronger model that defaults to clinical register",
      ],
      'tech': [
        "A) Raise temperature so the model varies its phrasing each call",
        "B) Add five worked examples of the expected JSON in the user message",
        "C) Define the output schema in the system message or response_format",
        "D) Wrap the call in a retry loop that discards malformed responses",
      ],
    },
    correctIndex: { 'non-tech': 1, 'tech': 2 },
    explanation: {
      'non-tech': "A role declaration anchors persona, tone, and vocabulary across runs. Vague stylistic instructions like 'be professional' get interpreted differently each call.",
      'tech': "An explicit schema tells the model exactly which fields to populate and in which shape. Examples reinforce a schema but can't replace it.",
    },
    keyInsight: "A clear role and a defined output contract eliminate the largest sources of run-to-run variance.",
  },
  {
    conceptId: 'genai-m2-fewshot',
    question: {
      'non-tech': "Slightly critical feedback keeps classifying as Neutral when it should be Negative. Best fix?",
      'tech': "Network connectivity tickets misclassify despite five existing examples in the prompt. Most impactful first move?",
    },
    options: {
      'non-tech': [
        "A) Add three more clearly-Neutral examples to balance the prompt",
        "B) Add borderline-critical examples explicitly labelled Negative",
        "C) Tell the model to be stricter when feedback sounds critical",
        "D) Ask the model to explain its reasoning before labelling",
      ],
      'tech': [
        "A) Add examples covering the misclassified subtypes you've seen live",
        "B) Fine-tune the base model on your full historical ticket dataset",
        "C) Add a confidence threshold and queue low-scoring tickets for review",
        "D) Implement retrieval over your past ticket archive at inference time",
      ],
    },
    correctIndex: { 'non-tech': 1, 'tech': 0 },
    explanation: {
      'non-tech': "Few-shot examples teach the boundary. The cases the model misclassifies are exactly the ones it needs as labelled examples — show it what borderline-negative looks like.",
      'tech': "If five examples aren't enough, the examples aren't representative of the failure modes. Add the specific subtypes that misclassify before reaching for fine-tuning or RAG.",
    },
    keyInsight: "Few-shot examples teach edge cases and boundaries — they're cheapest at the misclassified seams.",
  },
  {
    conceptId: 'genai-m2-context',
    question: {
      'non-tech': "Summarising hundreds of pages of patient history for a specialist referral gives generic output. Best first step?",
      'tech': "RAG chatbot hallucinates whenever five-to-seven large docs are stuffed into the context. Best fix?",
    },
    options: {
      'non-tech': [
        "A) Add an instruction telling the model to be more detailed",
        "B) Manually pull the sections that matter and summarise only those",
        "C) Chunk the history into ten-page pieces and summarise each chunk",
        "D) Wait for a model with a much larger context window to ship",
      ],
      'tech': [
        "A) Summarise each retrieved doc first, then answer from the summaries",
        "B) Append more retrieved docs so the model has fuller coverage",
        "C) Switch to a model with a multi-million-token context window",
        "D) Add a system message instructing 'only use the provided context'",
      ],
    },
    correctIndex: { 'non-tech': 1, 'tech': 0 },
    explanation: {
      'non-tech': "Models lose detail in long contexts ('lost in the middle'). Pre-extracting the relevant sections is the highest-leverage move — chunking helps less if every chunk is mostly noise.",
      'tech': "Compress before you answer. Per-doc summaries strip noise and free up tokens for the actual reasoning step — far more reliable than dumping everything in.",
    },
    keyInsight: "Context window management is about delivering the right tokens, not the most tokens.",
  },
  {
    conceptId: 'genai-m2-models',
    question: {
      'non-tech': "Two workflows: high-volume routine intake emails plus low-volume complex specialist referrals. Which model strategy?",
      'tech': "Daily reports (medium complexity, 100/day) plus weekly insights (high complexity, 5/week). Budget constrained. Strategy?",
    },
    options: {
      'non-tech': [
        "A) Run GPT-4o on both workflows — best quality across the board",
        "B) Run Claude Haiku on both workflows — fast and cheap end-to-end",
        "C) Haiku for the routine intake, GPT-4o for the complex referrals",
        "D) Run Gemini Flash on both workflows — balanced speed and quality",
      ],
      'tech': [
        "A) Run GPT-4o for both — eliminates routing complexity at higher cost",
        "B) Cheaper Haiku-class model for daily reports, GPT-4o for weekly insights",
        "C) Run Claude Haiku for both — minimises cost at unknown quality risk",
        "D) Run Gemini Flash for both — balances cost and quality uniformly",
      ],
    },
    correctIndex: { 'non-tech': 2, 'tech': 1 },
    explanation: {
      'non-tech': "Match model capability to task complexity and volume. The cheap fast model handles bulk routine work; reserve the premium model for the cases that genuinely need it.",
      'tech': "A hybrid routing strategy preserves quality on the small high-stakes workload while keeping cost low on the high-volume routine workload.",
    },
    keyInsight: "Model selection is a routing decision — different tasks deserve different models.",
  },
  {
    conceptId: 'genai-m2-refine',
    question: {
      'non-tech': "V3 of the consent-form prompt is more concise but now omits a legal disclaimer V1 always included. Next step?",
      'tech': "V2 improved most summaries but regressed on edge cases. Before deploying V3 to prod, what's critical?",
    },
    options: {
      'non-tech': [
        "A) Revert to V1 entirely and stop iterating until legal re-reviews",
        "B) Diff V1 vs V3, find the dropped clause, restore it as a constraint",
        "C) Tack 'include all legal disclaimers' onto the end of the V3 prompt",
        "D) Ask legal to simplify the disclaimer so V3 stays short",
      ],
      'tech': [
        "A) A/B test V3 with internal users in staging for a week",
        "B) Run V3 against the golden eval set and diff metrics vs V1 and V2",
        "C) Manually spot-check 10-20 V3 outputs and ship if they look fine",
        "D) Commit V3 to git so we can revert if anything looks off in prod",
      ],
    },
    correctIndex: { 'non-tech': 1, 'tech': 1 },
    explanation: {
      'non-tech': "Refinement is a diff, not a rewrite. Find the specific change that dropped the disclaimer and pin it back in as an explicit constraint — preserve the conciseness win.",
      'tech': "A golden eval set is what makes regressions visible. Run V3 against it and compare per-case metrics vs V1 and V2 before any traffic shifts.",
    },
    keyInsight: "Prompt refinement is version-controlled and evaluation-driven — never ship V3 without diffing the regressions.",
  },
];

const BADGES = [
  { id: 'genai-m2-anatomy', icon: '🧱', label: 'Anatomy', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'genai-m2-fewshot', icon: '🎯', label: 'Few-Shot', color: '#0F766E', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'genai-m2-context', icon: '🪟', label: 'Context', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'genai-m2-models', icon: '⚖️', label: 'Models', color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
  { id: 'genai-m2-refine', icon: '🔁', label: 'Refine', color: '#DB2777', bg: '#FDF2F8', border: '#FBCFE8' },
];

const SECTION_XP = 50;
const MAX_QUIZ_XP_PER_CONCEPT = 100;

function computeXP(completedSections: Set<string>, conceptStates: Record<string, { pKnow: number }>) {
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = Object.values(conceptStates).reduce((sum, state) => sum + Math.round(state.pKnow * MAX_QUIZ_XP_PER_CONCEPT), 0);
  return { readingXP, quizXP, total: readingXP + quizXP };
}

// AirtribeLogo imported from AirtribeBrand.tsx

// --- Shared Components ---

// --- Interactive Tool Components ---

// ─── PromptBuilderTool — REAL prompt-engineering sandbox ──────────────────
// This is a functioning sandbox, not a click-and-reveal mockup. The learner
// types their own SYSTEM message into a real textarea, selects one of three
// real test tickets, and presses Run. A deterministic prompt analyzer parses
// the SYSTEM message via regex for role declaration, category enumeration,
// format constraint, and one-word rule — each match is a real "specification
// signal" with a real weight. The simulated model response keys off those
// signals + the temperature slider:
//   • spec_quality + low temperature → exact category in target format
//   • spec_quality + high temperature → drift / wrong format / hedging
//   • missing role+format → verbose generic reply
// The learner cycles through 3 test tickets to check generalization. The
// goal is 3/3 in correct format — they will iterate on the SYSTEM until
// it generalises, which is what real prompt engineering actually is.
const PromptBuilderTool: React.FC<{ track: GenAITrack }> = ({ track }) => {
  // Test set — three real tickets across all three target categories.
  // Each has the literal text the model "sees" plus the ground-truth label.
  type Ticket = { id: string; text: string; truth: 'Network' | 'Database' | 'Server' };
  const TICKETS: Ticket[] = useMemo(() => track === 'non-tech'
    ? [
        { id: 'T-401', truth: 'Network',  text: 'Patient portal keeps timing out for staff on the 3rd floor; works fine on the 4th. Started after lunch.' },
        { id: 'T-402', truth: 'Database', text: 'EHR refuses to save new visit notes — error says "deadlock detected on row lock wait." Started ~10:30am.' },
        { id: 'T-403', truth: 'Server',   text: 'Appointment scheduler is returning 502 Bad Gateway every few minutes. Other apps on the same domain are fine.' },
      ]
    : [
        { id: 'T-401', truth: 'Network',  text: 'Sales team in Chicago getting intermittent VPN drops every 10–15 min. Other offices unaffected. Started after lunch.' },
        { id: 'T-402', truth: 'Database', text: 'Order-write API throwing "deadlock detected on row lock wait" on ~5% of requests since 10:30am. Read traffic fine.' },
        { id: 'T-403', truth: 'Server',   text: 'Checkout service returning 502 Bad Gateway intermittently. Other services on the same cluster are healthy.' },
      ]
  , [track]);

  const TASK_LINE = 'Classify the support ticket below into exactly one of: Network, Database, Server.';
  const STARTER_SYSTEM = 'You are a support classifier.';

  const [system, setSystem] = useState<string>(STARTER_SYSTEM);
  const [activeIdx, setActiveIdx] = useState(0);
  const [temperature, setTemperature] = useState(0.7);
  const [running, setRunning] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [responseKey, setResponseKey] = useState(0);
  // Verdicts per ticket: 'pending' | 'pass' (right label, right format) | 'fail-format' | 'fail-label'
  type Verdict = 'pending' | 'pass' | 'fail-format' | 'fail-label';
  const [verdicts, setVerdicts] = useState<Verdict[]>(['pending', 'pending', 'pending']);

  // ─── Deterministic prompt analyzer ────────────────────────────────────
  // Real regex parse of what the learner typed — each match is a real
  // specification signal that shifts model behaviour.
  const sigs = useMemo(() => {
    const s = system;
    return {
      hasRole:       /you are\b|act as\b/i.test(s),
      hasCategories: /\bnetwork\b/i.test(s) && /\bdatabase\b/i.test(s) && /\bserver\b/i.test(s),
      hasFormat:     /return only|respond with|output only|single word|one word|exactly one (?:word|of)/i.test(s),
      hasGuard:      /do not|don'?t (?:explain|elaborate|add|include)|no (?:prose|explanation|commentary|preamble)/i.test(s),
    };
  }, [system]);
  const specQuality = (sigs.hasRole ? 1 : 0) + (sigs.hasCategories ? 1 : 0) + (sigs.hasFormat ? 1 : 0) + (sigs.hasGuard ? 1 : 0);

  const tokenCount = useMemo(() => {
    const text = system + ' ' + TASK_LINE + ' ' + TICKETS[activeIdx].text;
    return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length * 1.35));
  }, [system, activeIdx, TICKETS]);

  // ─── Model behaviour — picks an output shape from (specQuality, temp) ─
  // and bakes the active ticket's text into it so output varies per ticket.
  const generate = useCallback((ticket: Ticket): { text: string; predicted: 'Network' | 'Database' | 'Server' | null; format: 'word' | 'verbose' | 'hedged' | 'wrong' } => {
    const t = ticket.truth;
    const tempHigh = temperature >= 1.3;
    const tempVeryHigh = temperature >= 1.7;

    // Heuristic "model classification": when categories are enumerated in
    // the system message, the model knows the label space. When not, it
    // invents categories.
    const knowsLabels = sigs.hasCategories;
    const predicted = knowsLabels ? t : null;

    // No role at all → generic verbose deflection
    if (!sigs.hasRole && !sigs.hasCategories) {
      return {
        text: `Looking at this ticket, it appears to be a technical issue that the support team should investigate. The user is reporting a problem that may need attention from the relevant team. I'd recommend looking into the symptoms described and routing accordingly.`,
        predicted: null,
        format: 'verbose',
      };
    }

    // Knows labels but no format constraint → label buried in prose
    if (knowsLabels && !sigs.hasFormat) {
      return {
        text: `This ticket sounds like a ${t.toLowerCase()} issue — the symptoms (${ticket.text.slice(0, 50).toLowerCase()}…) point to the ${t.toLowerCase()} layer. I'd categorise it as ${t}, though you may want to confirm with the team.`,
        predicted,
        format: 'verbose',
      };
    }

    // Format constraint + categories + low temperature → clean single word
    if (knowsLabels && sigs.hasFormat && !tempHigh) {
      return { text: t, predicted, format: 'word' };
    }

    // High temperature drifts even when the spec is tight
    if (knowsLabels && sigs.hasFormat && tempHigh && !tempVeryHigh) {
      if (sigs.hasGuard) return { text: t, predicted, format: 'word' };
      return { text: `${t}.`, predicted, format: 'word' };
    }

    // Very high temp → drift / hedge regardless of guard
    if (knowsLabels && tempVeryHigh) {
      return {
        text: `${t} (though it could also be classified as ${t === 'Network' ? 'Server' : 'Network'} depending on perspective)`,
        predicted,
        format: 'hedged',
      };
    }

    // Knows format but not categories → invents a label
    return {
      text: 'Connectivity',
      predicted: null,
      format: 'wrong',
    };
  }, [sigs, temperature]);

  // Ref guard prevents two stream() calls racing into the same response
  // state when Run is double-tapped or React state hasn't yet flipped the
  // disabled flag. Without this, both tick chains write interleaved bursts
  // to setResponse(prev + ...) and the output looks like scrambled gibberish.
  const streamingRef = useRef(false);
  const stream = useCallback((text: string, onDone: () => void) => {
    if (streamingRef.current) return;
    streamingRef.current = true;
    setResponse('');
    setRunning(true);
    setResponseKey(k => k + 1);
    const chars = Array.from(text);
    let i = 0;
    const tick = () => {
      if (i >= chars.length) {
        streamingRef.current = false;
        setRunning(false);
        onDone();
        return;
      }
      const burst = Math.max(1, Math.round(2 + Math.random() * 4));
      const next = chars.slice(i, i + burst).join('');
      setResponse(prev => prev + next);
      i += burst;
      setTimeout(tick, 16 + Math.random() * 12);
    };
    setTimeout(tick, 60);
  }, []);

  const run = () => {
    const ticket = TICKETS[activeIdx];
    const { text, predicted, format } = generate(ticket);
    let verdict: Verdict;
    if (predicted !== ticket.truth) verdict = 'fail-label';
    else if (format !== 'word')    verdict = 'fail-format';
    else                            verdict = 'pass';
    stream(text, () => {
      setVerdicts(prev => prev.map((v, i) => i === activeIdx ? verdict : v));
    });
  };

  const resetTest = () => {
    setVerdicts(['pending', 'pending', 'pending']);
    setResponse('');
    setResponseKey(k => k + 1);
  };

  const passCount = verdicts.filter(v => v === 'pass').length;

  // ─── Playground UI styling — matches OpenAI's actual chat Playground ──
  const playgroundBg = '#0F0F0F';
  const panelBg = '#171717';
  const panelBorder = '1px solid #262626';
  const labelStyle: CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: '#737373', textTransform: 'uppercase' };

  const verdictPill = (v: Verdict): { bg: string; fg: string; label: string } => {
    if (v === 'pass')        return { bg: 'rgba(16,163,127,0.14)', fg: '#10A37F', label: '✓ pass' };
    if (v === 'fail-format') return { bg: 'rgba(245,158,11,0.14)', fg: '#F59E0B', label: '⚠ wrong format' };
    if (v === 'fail-label')  return { bg: 'rgba(239,68,68,0.14)',  fg: '#EF4444', label: '✗ wrong label' };
    return { bg: '#171717', fg: '#737373', label: 'pending' };
  };

  return (
    <div style={{
      background: playgroundBg,
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid #1F1F1F',
      boxShadow: '0 14px 36px rgba(0,0,0,0.45)',
      color: '#E5E5E5',
      fontFamily: "Inter, -apple-system, system-ui, sans-serif",
    }}>
      {/* Top bar — Playground header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: panelBorder, background: '#0A0A0A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: 'linear-gradient(135deg, #10A37F, #0E8567)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 900 }}>◯</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#E5E5E5' }}>Playground</div>
          <div style={{ fontSize: 10, color: '#525252' }}>·</div>
          <div style={{ fontSize: 11, color: '#A3A3A3' }}>Chat</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 10, color: '#737373' }}>Goal: classify all 3 tickets · single word · correct label</div>
          <div style={{
            padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 700,
            background: passCount === 3 ? 'rgba(16,163,127,0.18)' : 'rgba(115,115,115,0.12)',
            color: passCount === 3 ? '#10A37F' : '#A3A3A3',
            border: `1px solid ${passCount === 3 ? '#10A37F' : '#262626'}`,
            fontFamily: "'JetBrains Mono', monospace",
          }}>{passCount}/3 passing</div>
        </div>
      </div>

      {/* Body — 2 column: messages | controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 220px' }}>
        {/* LEFT: messages */}
        <div style={{ borderRight: panelBorder }}>
          {/* SYSTEM — REAL TEXTAREA */}
          <div style={{ padding: '14px 16px 12px', borderBottom: panelBorder }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={labelStyle}>SYSTEM · you write this</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#525252' }}>{system.length} chars</div>
            </div>
            <textarea
              value={system}
              onChange={e => { setSystem(e.target.value); resetTest(); }}
              spellCheck={false}
              style={{
                marginTop: 8, width: '100%', boxSizing: 'border-box',
                padding: '11px 12px',
                background: panelBg, border: panelBorder, borderRadius: 8,
                minHeight: 96, resize: 'vertical' as const,
                fontSize: 12.5, color: '#E5E5E5', lineHeight: 1.65,
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                outline: 'none',
              }}
              placeholder='Try: "You are a support classifier. Categorise tickets into one of: Network, Database, Server. Respond with a single word — no explanation."'
            />
          </div>

          {/* USER — task + the active ticket */}
          <div style={{ padding: '14px 16px 12px', borderBottom: panelBorder }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={labelStyle}>USER · test ticket {activeIdx + 1} of 3</div>
              <div style={{ display: 'flex', gap: 5 }}>
                {TICKETS.map((t, i) => {
                  const isActive = i === activeIdx;
                  const v = verdicts[i];
                  const dotColor = v === 'pass' ? '#10A37F' : v === 'fail-format' ? '#F59E0B' : v === 'fail-label' ? '#EF4444' : '#525252';
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { setActiveIdx(i); setResponse(''); }}
                      style={{
                        appearance: 'none', cursor: 'pointer',
                        padding: '3px 9px', borderRadius: 5,
                        background: isActive ? 'rgba(16,163,127,0.14)' : '#171717',
                        border: `1px solid ${isActive ? '#10A37F' : '#262626'}`,
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
                        color: isActive ? '#10A37F' : '#A3A3A3',
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor }} />
                      {t.id}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ marginTop: 8, padding: '11px 12px', background: panelBg, border: panelBorder, borderRadius: 8, fontSize: 12.5, color: '#D4D4D4', lineHeight: 1.65, whiteSpace: 'pre-wrap' as const }}>
              <span style={{ color: '#737373' }}>{TASK_LINE}</span>
              {'\n\n'}
              <span style={{ color: '#E5E5E5' }}>[{TICKETS[activeIdx].id}] {TICKETS[activeIdx].text}</span>
            </div>
          </div>

          {/* ASSISTANT */}
          <div style={{ padding: '14px 16px 14px', minHeight: 110 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={labelStyle}>ASSISTANT</div>
              {running && (
                <div style={{ display: 'flex', gap: 3 }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} style={{ width: 4, height: 4, borderRadius: '50%', background: '#10A37F' }} />
                  ))}
                </div>
              )}
              {!running && verdicts[activeIdx] !== 'pending' && (() => {
                const p = verdictPill(verdicts[activeIdx]);
                return (
                  <span style={{ padding: '2px 7px', borderRadius: 4, background: p.bg, color: p.fg, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.04em' }}>{p.label}</span>
                );
              })()}
            </div>
            <div style={{ marginTop: 8, padding: response || running ? '11px 12px' : 0, background: response || running ? panelBg : 'transparent', border: response || running ? panelBorder : 'none', borderRadius: 8, fontSize: 12.5, color: '#D4D4D4', lineHeight: 1.7, whiteSpace: 'pre-wrap' as const, minHeight: response || running ? 56 : 16 }}>
              <AnimatePresence mode="wait">
                <motion.span key={responseKey} initial={{ opacity: 1 }} style={{ display: 'inline' }}>
                  {response}
                  {running && <span style={{ display: 'inline-block', width: 7, height: 13, background: '#10A37F', marginLeft: 2, verticalAlign: 'middle', animation: 'blink 0.8s steps(1) infinite' }} />}
                </motion.span>
              </AnimatePresence>
              {!response && !running && <span style={{ color: '#525252', fontStyle: 'italic' as const, fontSize: 11.5 }}>Edit the SYSTEM message above, then click Run to send this ticket.</span>}
            </div>
          </div>

          {/* Bottom action bar */}
          <div style={{ padding: '10px 14px', borderTop: panelBorder, background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#737373' }}>{tokenCount} tokens · ~${(tokenCount / 1000 * 0.005).toFixed(4)}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={resetTest}
                style={{ appearance: 'none', background: 'transparent', border: '1px solid #262626', borderRadius: 6, padding: '7px 12px', fontSize: 11, fontWeight: 600, color: '#A3A3A3', cursor: 'pointer' }}
              >Reset</button>
              <button
                type="button"
                onClick={run}
                disabled={running}
                style={{
                  appearance: 'none',
                  background: running ? '#1F1F1F' : '#10A37F',
                  border: 'none', borderRadius: 6, padding: '7px 18px',
                  fontSize: 12, fontWeight: 700,
                  color: running ? '#737373' : '#fff',
                  cursor: running ? 'wait' : 'pointer',
                  boxShadow: running ? 'none' : '0 1px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >{running ? 'Streaming…' : `Run ${TICKETS[activeIdx].id} ▶`}</button>
            </div>
          </div>
        </div>

        {/* RIGHT: controls + spec signals */}
        <div style={{ padding: '14px 14px 14px' }}>
          <div style={labelStyle}>MODEL</div>
          <div style={{ marginTop: 6, padding: '6px 10px', background: panelBg, border: panelBorder, borderRadius: 6, fontSize: 11.5, color: '#E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>gpt-4o</span>
            <span style={{ color: '#525252' }}>▾</span>
          </div>

          <div style={{ marginTop: 14, ...labelStyle }}>TEMPERATURE</div>
          <div style={{ marginTop: 6, padding: '6px 10px', background: panelBg, border: panelBorder, borderRadius: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 11.5, color: '#E5E5E5', fontFamily: "'JetBrains Mono', monospace" }}>{temperature.toFixed(2)}</span>
              <span style={{ fontSize: 9, color: '#525252' }}>0 — 2</span>
            </div>
            <input
              type="range"
              min={0} max={2} step={0.05}
              value={temperature}
              onChange={e => { setTemperature(parseFloat(e.target.value)); resetTest(); }}
              style={{ width: '100%', accentColor: '#10A37F' }}
            />
          </div>

          <div style={{ marginTop: 14, ...labelStyle }}>SPEC SIGNALS DETECTED</div>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
            {([
              ['Role declared',       sigs.hasRole,       '"You are…" / "act as…"'],
              ['Categories listed',   sigs.hasCategories, 'Network · Database · Server'],
              ['Format constraint',   sigs.hasFormat,     '"single word" / "respond with"'],
              ['Guard against prose', sigs.hasGuard,      '"do not explain" / "no commentary"'],
            ] as const).map(([label, on, hint]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 8px', background: panelBg, border: `1px solid ${on ? '#10A37F' : '#262626'}`, borderRadius: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: on ? '#10A37F' : '#3A3A3A' }} />
                  <span style={{ fontSize: 10.5, color: on ? '#E5E5E5' : '#737373', fontWeight: 600 }}>{label}</span>
                </div>
                <span title={hint} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: on ? '#10A37F' : '#525252' }}>{on ? 'on' : 'off'}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, padding: '8px 10px', background: panelBg, border: panelBorder, borderRadius: 6, fontSize: 10, color: '#A3A3A3', lineHeight: 1.5 }}>
            {passCount === 3 ? (
              <span><span style={{ color: '#10A37F' }}>●</span> 3/3 — your SYSTEM generalises. This is what a real prompt-eng iteration loop looks like.</span>
            ) : specQuality <= 1 ? (
              <span><span style={{ color: '#F59E0B' }}>●</span> Add a role <i>and</i> list the categories — the model can&apos;t pick from a set it doesn&apos;t know.</span>
            ) : !sigs.hasFormat ? (
              <span><span style={{ color: '#F59E0B' }}>●</span> The label is buried in prose. Add a format constraint — e.g. &quot;respond with a single word.&quot;</span>
            ) : temperature >= 1.3 ? (
              <span><span style={{ color: '#EF4444' }}>●</span> High temperature drifts even a tight spec. Lower to ~0.2 for classification.</span>
            ) : (
              <span><span style={{ color: '#10A37F' }}>●</span> Strong spec. Run all 3 tickets — does it generalise?</span>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes blink { 0%, 50% { opacity: 1 } 51%, 100% { opacity: 0 } }`}</style>
    </div>
  );
};

// ─── FewShotLabeler — REAL few-shot evaluation sandbox ───────────────────
// This is a functioning sandbox, not a click-and-reveal mockup. The learner
// faces 3 real test tickets — one per category — and a shot toggle (0 / 1 / 3).
// The model behaviour is a real deterministic classifier:
//   • 0-shot: knows the label space from SYSTEM but anchors to the most
//     common-sounding default, hedges in prose → typically 0/3
//   • 1-shot: anchors hard on the single example's category. Predicts THAT
//     category for every ticket → typically 1/3 (only the matching one)
//   • 3-shot: sees the boundary for all three categories → 3/3
// The learner runs each ticket against each shot setting and watches the
// accuracy matrix fill in. The pedagogical point — examples teach the
// boundary, not the rule — emerges from the data, not from a label on a card.
const FewShotLabeler: React.FC<{ track: GenAITrack }> = ({ track }) => {
  type Shot = 0 | 1 | 3;
  type Cat = 'Network' | 'Database' | 'Server';
  type CCat = 'Pre-Auth' | 'Coverage Limit' | 'Non-Emergent';
  type Turn = { role: 'user' | 'assistant'; text: string };

  const isTech = track !== 'non-tech';
  const CATS = (isTech ? ['Network', 'Database', 'Server'] : ['Pre-Auth', 'Coverage Limit', 'Non-Emergent']) as readonly (Cat | CCat)[];

  const SYSTEM = isTech
    ? 'You are an IT support classifier at Northstar Health. Given a support ticket, return exactly one category from: Network · Database · Server.'
    : 'You are a claims-routing assistant at Northstar Health. Given a claim description, return exactly one category from: Pre-Auth · Coverage Limit · Non-Emergent.';

  // The 3-shot example bank — one per category, in canonical order.
  // 1-shot uses only the FIRST pair, which is the anchor that distorts the model.
  const EXAMPLE_BANK: { cat: Cat | CCat; pair: [Turn, Turn] }[] = isTech
    ? [
        { cat: 'Network',  pair: [
          { role: 'user',      text: 'User reports "cannot connect to VPN" — auth log clean, local NIC dropped intermittently for 20 minutes.' },
          { role: 'assistant', text: 'Network' },
        ]},
        { cat: 'Database', pair: [
          { role: 'user',      text: 'Query performance degrading on the orders table. Index rebuilt yesterday, no replication lag, reads slow.' },
          { role: 'assistant', text: 'Database' },
        ]},
        { cat: 'Server',   pair: [
          { role: 'user',      text: 'app-server-07 unresponsive — ping fails, console shows kernel panic on boot, no recent deploy.' },
          { role: 'assistant', text: 'Server' },
        ]},
      ]
    : [
        { cat: 'Pre-Auth',       pair: [
          { role: 'user',      text: 'Pre-authorised cardiac procedure denied at adjudication — "service does not meet medical necessity for the requested CPT code."' },
          { role: 'assistant', text: 'Pre-Auth' },
        ]},
        { cat: 'Coverage Limit', pair: [
          { role: 'user',      text: 'Physical therapy claim denied — "exceeds coverage limits" despite a physician order for 12 sessions.' },
          { role: 'assistant', text: 'Coverage Limit' },
        ]},
        { cat: 'Non-Emergent',   pair: [
          { role: 'user',      text: 'ER visit for moderate abdominal pain denied — insurer marked the encounter as "non-emergent" after review.' },
          { role: 'assistant', text: 'Non-Emergent' },
        ]},
      ];

  // 3 real test tickets — one per category, none copy-pasted from the examples.
  type Ticket = { id: string; truth: Cat | CCat; text: string };
  const TICKETS: Ticket[] = isTech
    ? [
        { id: 'T-501', truth: 'Network',  text: 'Chicago office gets VPN drops every 10–15 min after lunch; other sites unaffected, no client update.' },
        { id: 'T-502', truth: 'Database', text: 'Order-write API returning "deadlock detected on row lock wait" on ~5% of requests since 10:30am.' },
        { id: 'T-503', truth: 'Server',   text: 'Checkout service returning 502 Bad Gateway intermittently; cluster siblings healthy, load avg climbing.' },
      ]
    : [
        { id: 'C-501', truth: 'Pre-Auth',       text: 'Pre-authorised cardiac MRI denied at adjudication — reviewer wrote "does not meet medical necessity criteria."' },
        { id: 'C-502', truth: 'Coverage Limit', text: 'Outpatient PT claim denied at session 9 of 12 — EOB says "annual benefit cap reached."' },
        { id: 'C-503', truth: 'Non-Emergent',   text: 'Urgent-care visit for sore throat denied — insurer flagged as "non-emergent presentation."' },
      ];

  // ─── Deterministic few-shot classifier ─────────────────────────────────
  // Real model behaviour as a function of (shotCount, anchor example, ticket truth).
  const classify = (shot: Shot, anchorCat: Cat | CCat | null, ticket: Ticket): { predicted: Cat | CCat | null; text: string; correct: boolean } => {
    if (shot === 0) {
      // Zero-shot: model knows the label set but hedges. Returns prose with
      // the truth label hidden inside maybes — fails on the format check
      // even when it gets the right idea.
      const fallback = (CATS[0] as Cat | CCat);
      return {
        predicted: null,
        text: `Looking at this ticket, it appears to be a ${ticket.truth.toLowerCase()}-related issue, though it could also be ${fallback.toLowerCase()}. Without more context, I'd guess ${ticket.truth} but recommend asking the team.`,
        correct: false,
      };
    }
    if (shot === 1 && anchorCat) {
      // One-shot: model anchors HARD on the example's category. Predicts
      // that label for every ticket regardless of truth.
      return {
        predicted: anchorCat,
        text: String(anchorCat),
        correct: anchorCat === ticket.truth,
      };
    }
    // Three-shot: boundary anchored across all 3 — gets it right.
    return {
      predicted: ticket.truth,
      text: String(ticket.truth),
      correct: true,
    };
  };

  const [shotCount, setShotCount] = useState<Shot>(0);
  const [anchorIdx, setAnchorIdx] = useState(0); // which example anchors the 1-shot
  const [activeIdx, setActiveIdx] = useState(0);
  const [response, setResponse] = useState('');
  const [streaming, setStreaming] = useState(false);
  // Verdict matrix: verdicts[shotKey][ticketIdx] = 'pass' | 'fail' | 'pending'
  type V = 'pass' | 'fail' | 'pending';
  const [matrix, setMatrix] = useState<Record<Shot, V[]>>({ 0: ['pending','pending','pending'], 1: ['pending','pending','pending'], 3: ['pending','pending','pending'] });

  const anchorCat = shotCount === 1 ? EXAMPLE_BANK[anchorIdx].cat : null;
  const visibleExamples: Turn[] = shotCount === 0 ? [] : shotCount === 1
    ? EXAMPLE_BANK[anchorIdx].pair
    : EXAMPLE_BANK.flatMap(b => b.pair);

  const tokenCount = useMemo(() => {
    const all = [SYSTEM, ...visibleExamples.map(t => t.text), TICKETS[activeIdx].text, response].join(' ');
    return Math.max(1, Math.round(all.split(/\s+/).filter(Boolean).length * 1.35));
  }, [visibleExamples, response, SYSTEM, TICKETS, activeIdx]);

  // Ref guard against re-entrant streams that interleave gibberish.
  const streamingRef = useRef(false);
  const stream = useCallback((text: string, onDone: () => void) => {
    if (streamingRef.current) return;
    streamingRef.current = true;
    setResponse('');
    setStreaming(true);
    const chars = Array.from(text);
    let i = 0;
    const tick = () => {
      if (i >= chars.length) {
        streamingRef.current = false;
        setStreaming(false);
        onDone();
        return;
      }
      const burst = Math.max(1, Math.round(2 + Math.random() * 4));
      setResponse(prev => prev + chars.slice(i, i + burst).join(''));
      i += burst;
      setTimeout(tick, 16 + Math.random() * 14);
    };
    setTimeout(tick, 80);
  }, []);

  const run = () => {
    const ticket = TICKETS[activeIdx];
    const result = classify(shotCount, anchorCat, ticket);
    stream(result.text, () => {
      setMatrix(prev => ({
        ...prev,
        [shotCount]: prev[shotCount].map((v, i) => i === activeIdx ? (result.correct ? 'pass' : 'fail') : v),
      }));
    });
  };

  const runAll = () => {
    if (streamingRef.current) return;
    // Fill the row instantly (no streaming — this is the "evaluate the whole set" affordance)
    const row = TICKETS.map(t => classify(shotCount, anchorCat, t).correct ? 'pass' as const : 'fail' as const);
    setMatrix(prev => ({ ...prev, [shotCount]: row }));
    setResponse(''); // clear last single-run response so the matrix is the focus
  };

  const reset = () => {
    setResponse('');
    setMatrix({ 0: ['pending','pending','pending'], 1: ['pending','pending','pending'], 3: ['pending','pending','pending'] });
  };

  const passInRow = (row: V[]) => row.filter(v => v === 'pass').length;
  const currentPass = passInRow(matrix[shotCount]);

  // ─── Anthropic Console UI ──────────────────────────────────────────────
  const ANTHROPIC = '#C66B3D';
  const consoleBg = '#FAF7F2';
  const panelBg = '#FFFFFF';
  const panelBorder = '1px solid #E8E3DA';
  const inkInk = '#1F1B16';
  const inkSub = '#6B635A';
  const labelStyle: CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: inkSub, textTransform: 'uppercase' };

  const Bubble = ({ role, text }: { role: 'user' | 'assistant'; text: string }) => (
    <div style={{ marginBottom: 6, display: 'flex', flexDirection: 'column', alignItems: role === 'user' ? 'flex-start' : 'flex-end' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em', color: role === 'user' ? '#6B635A' : ANTHROPIC, marginBottom: 3 }}>{role === 'user' ? 'HUMAN' : 'ASSISTANT'}</div>
      <div style={{
        maxWidth: '88%',
        padding: '8px 11px',
        borderRadius: role === 'user' ? '10px 10px 10px 2px' : '10px 10px 2px 10px',
        background: role === 'user' ? '#F1ECE2' : 'rgba(198,107,61,0.10)',
        border: `1px solid ${role === 'user' ? '#E2D9C8' : 'rgba(198,107,61,0.35)'}`,
        fontSize: 12.5, color: inkInk, lineHeight: 1.55,
      }}>{text}</div>
    </div>
  );

  return (
    <div style={{
      background: consoleBg,
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid #E8E3DA',
      boxShadow: '0 14px 36px rgba(60,30,10,0.12)',
      color: inkInk,
      fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
    }}>
      {/* Console header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: panelBorder, background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: ANTHROPIC, color: '#fff', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif' }}>A</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: inkInk }}>Anthropic Console</div>
          <div style={{ fontSize: 10, color: inkSub }}>·</div>
          <div style={{ fontSize: 11, color: inkSub }}>Workbench</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 10, color: inkSub }}>Northstar / claims-classifier</div>
          <div style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600, color: inkSub, border: '1px solid #E8E3DA' }}>Save preset</div>
          <div style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600, color: inkSub, border: '1px solid #E8E3DA' }}>Get code</div>
        </div>
      </div>

      {/* Body — messages | controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 220px' }}>
        {/* LEFT */}
        <div style={{ borderRight: panelBorder }}>
          {/* System prompt */}
          <div style={{ padding: '14px 16px 12px', borderBottom: panelBorder }}>
            <div style={labelStyle}>SYSTEM PROMPT</div>
            <div style={{ marginTop: 6, padding: '10px 12px', background: panelBg, border: panelBorder, borderRadius: 8, fontSize: 12, color: inkInk, lineHeight: 1.6 }}>{SYSTEM}</div>
          </div>

          {/* Thread */}
          <div style={{ padding: '14px 16px 12px', borderBottom: panelBorder, maxHeight: 320, overflow: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={labelStyle}>MESSAGES · {visibleExamples.length / 2} example{visibleExamples.length / 2 === 1 ? '' : 's'} in context</div>
              <div style={{ display: 'flex', gap: 5 }}>
                {TICKETS.map((t, i) => {
                  const isActive = i === activeIdx;
                  const v = matrix[shotCount][i];
                  const dot = v === 'pass' ? '#0E8567' : v === 'fail' ? '#B23F22' : '#A8A095';
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { setActiveIdx(i); setResponse(''); }}
                      style={{
                        appearance: 'none', cursor: 'pointer',
                        padding: '3px 9px', borderRadius: 5,
                        background: isActive ? 'rgba(198,107,61,0.14)' : '#FFFFFF',
                        border: `1px solid ${isActive ? ANTHROPIC : '#E8E3DA'}`,
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
                        color: isActive ? ANTHROPIC : inkInk,
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot }} />
                      {t.id}
                    </button>
                  );
                })}
              </div>
            </div>
            {visibleExamples.length === 0 && (
              <div style={{ padding: '10px 12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 8, fontSize: 11.5, color: '#8A4F0A', lineHeight: 1.55, marginBottom: 10 }}>
                Zero-shot — no examples in the thread. Model has only the SYSTEM prompt and the test ticket below.
              </div>
            )}
            {visibleExamples.map((t, i) => <Bubble key={i} role={t.role} text={t.text} />)}
            <Bubble role="user" text={`[${TICKETS[activeIdx].id}] ${TICKETS[activeIdx].text}`} />
            {(response || streaming) && (
              <Bubble role="assistant" text={response + (streaming ? '▍' : '')} />
            )}
          </div>

          {/* Bottom bar */}
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: inkSub }}>{tokenCount} tokens · claude-3-5-sonnet</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={reset} style={{ appearance: 'none', cursor: 'pointer', background: '#fff', border: '1px solid #E8E3DA', borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 600, color: inkSub, fontFamily: 'inherit' }}>Reset</button>
              <button type="button" onClick={runAll} disabled={streaming} style={{ appearance: 'none', cursor: streaming ? 'wait' : 'pointer', background: '#fff', border: `1px solid ${ANTHROPIC}`, borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 700, color: ANTHROPIC, fontFamily: 'inherit' }}>Run all 3</button>
              <button
                type="button"
                onClick={run}
                disabled={streaming}
                style={{
                  appearance: 'none',
                  background: streaming ? '#F1ECE2' : ANTHROPIC,
                  border: 'none', borderRadius: 6, padding: '6px 18px',
                  fontSize: 11.5, fontWeight: 700,
                  color: streaming ? inkSub : '#fff',
                  fontFamily: 'inherit',
                  cursor: streaming ? 'wait' : 'pointer',
                  boxShadow: streaming ? 'none' : '0 1px 0 rgba(60,30,10,0.20), inset 0 1px 0 rgba(255,255,255,0.30)',
                }}
              >{streaming ? 'Streaming…' : `Run ${TICKETS[activeIdx].id} ▶`}</button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ padding: '14px 14px 14px' }}>
          <div style={labelStyle}>MODEL</div>
          <div style={{ marginTop: 6, padding: '6px 10px', background: panelBg, border: panelBorder, borderRadius: 6, fontSize: 11.5, color: inkInk, display: 'flex', justifyContent: 'space-between' }}>
            <span>claude-3-5-sonnet</span><span style={{ color: inkSub }}>▾</span>
          </div>

          <div style={{ marginTop: 14, ...labelStyle }}>EXAMPLES IN CONTEXT</div>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column' as const, gap: 5 }}>
            {([0, 1, 3] as Shot[]).map(n => {
              const on = shotCount === n;
              const row = matrix[n];
              const passed = passInRow(row);
              const tested = row.filter(v => v !== 'pending').length;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setShotCount(n); setResponse(''); }}
                  style={{
                    appearance: 'none', cursor: 'pointer', textAlign: 'left' as const,
                    background: on ? 'rgba(198,107,61,0.16)' : panelBg,
                    border: `1px solid ${on ? ANTHROPIC : '#E8E3DA'}`,
                    borderRadius: 6, padding: '6px 10px',
                    fontFamily: 'inherit', color: on ? ANTHROPIC : inkInk,
                    fontSize: 11.5, fontWeight: 700,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <span>{n === 0 ? 'Zero-shot' : n === 1 ? 'One-shot' : 'Three-shot'}</span>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: tested === 0 ? inkSub : passed === 3 ? '#0E8567' : '#B23F22' }}>
                    {tested === 0 ? '—' : `${passed}/3`}
                  </span>
                </button>
              );
            })}
          </div>

          {shotCount === 1 && (
            <>
              <div style={{ marginTop: 14, ...labelStyle }}>ANCHOR EXAMPLE</div>
              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
                {EXAMPLE_BANK.map((b, i) => {
                  const on = anchorIdx === i;
                  return (
                    <button key={String(b.cat)} type="button" onClick={() => { setAnchorIdx(i); setResponse(''); }} style={{
                      appearance: 'none', cursor: 'pointer', textAlign: 'left' as const,
                      background: on ? 'rgba(198,107,61,0.12)' : panelBg,
                      border: `1px solid ${on ? ANTHROPIC : '#E8E3DA'}`,
                      borderRadius: 5, padding: '5px 9px',
                      fontFamily: 'inherit', color: on ? ANTHROPIC : inkInk,
                      fontSize: 10.5, fontWeight: 600,
                    }}>{String(b.cat)}</button>
                  );
                })}
              </div>
            </>
          )}

          <div style={{ marginTop: 14, ...labelStyle }}>ACCURACY MATRIX</div>
          <div style={{ marginTop: 6, padding: '8px 10px', background: panelBg, border: panelBorder, borderRadius: 6 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 3, fontSize: 9.5, fontFamily: "'JetBrains Mono', monospace" }}>
              <span style={{ color: inkSub }}></span>
              {TICKETS.map(t => <span key={t.id} style={{ color: inkSub, textAlign: 'center' }}>{t.id.slice(-3)}</span>)}
              {([0, 1, 3] as Shot[]).map(n => (
                <React.Fragment key={n}>
                  <span style={{ color: shotCount === n ? ANTHROPIC : inkSub, fontWeight: 700 }}>{n}-shot</span>
                  {matrix[n].map((v, i) => (
                    <span key={i} style={{
                      textAlign: 'center',
                      color: v === 'pass' ? '#0E8567' : v === 'fail' ? '#B23F22' : '#C8C0B0',
                      fontWeight: 700,
                    }}>{v === 'pass' ? '✓' : v === 'fail' ? '✗' : '·'}</span>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12, padding: '8px 10px', background: panelBg, border: panelBorder, borderRadius: 6, fontSize: 10, color: inkSub, lineHeight: 1.5 }}>
            {currentPass === 3 && shotCount === 3 ? (
              <><span style={{ color: '#0E8567' }}>●</span> 3/3 at three-shot. Now try one-shot with each anchor — watch where it drifts.</>
            ) : shotCount === 1 && currentPass < 3 && matrix[1].some(v => v === 'fail') ? (
              <><span style={{ color: '#D97706' }}>●</span> One-shot anchored on <i>{String(anchorCat)}</i> — model is over-predicting that label. Try a different anchor or step up to 3-shot.</>
            ) : shotCount === 0 ? (
              <><span style={{ color: '#B23F22' }}>●</span> Zero-shot hedges in prose — no boundary to anchor against.</>
            ) : (
              <><span style={{ color: ANTHROPIC }}>●</span> Run all 3 tickets at each shot setting. The accuracy matrix is the lesson.</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ContextWindowInspector — REAL lost-in-the-middle sandbox ────────────
// This is a functioning sandbox, not a click-and-reveal mockup. The learner
// has 5 document segments and 3 real test questions — each question is
// anchored to a specific segment. The learner toggles segments in/out and
// reorders them with ↑/↓ buttons. On Run-all, the model evaluates all 3
// questions against the current context configuration using a real position
// penalty: a fact at index 0 or last surfaces cleanly; the same fact buried
// in the middle (index >= 2 in a ≥4-item window) returns a hedged answer.
// Excluded segments are unrecoverable — the model says so. Goal: 3/3 — the
// learner discovers that order matters, not just inclusion, by experiment.
const ContextWindowInspector: React.FC<{ track: GenAITrack }> = ({ track }) => {
  type Seg = { id: string; label: string; short: string; tokens: number; content: string };
  const SEGS: Seg[] = useMemo(() => track === 'non-tech'
    ? [
        { id: 's1', label: 'Patient demographics', short: 'demographics', tokens: 320, content: 'Jane Doe, 68F, admitted 2024-03-12 with community-acquired pneumonia.' },
        { id: 's2', label: 'Admission history',    short: 'admission',    tokens: 410, content: 'COPD (GOLD II), HTN, T2DM. Presented with productive cough, fever, dyspnea, SpO2 88% RA.' },
        { id: 's3', label: 'Treatment & progress', short: 'treatment',    tokens: 540, content: 'Started azithromycin + ceftriaxone, O2 2L NC. Respiratory status improving by day 3.' },
        { id: 's4', label: 'Critical event',       short: 'critical',     tokens: 380, content: 'Day 4 AKI from suspected ACE-i + diuretic interaction. ACE-i stopped, renal function recovering.' },
        { id: 's5', label: 'Discharge plan',       short: 'discharge',    tokens: 290, content: 'Discharge 2024-03-20. Nephrology follow-up. Low-sodium diet, daily weights.' },
      ]
    : [
        { id: 's1', label: 'Incident header',      short: 'header',       tokens: 280, content: 'INC-2024-03-12 — DB outage. Primary DB01. Began 14:00 UTC.' },
        { id: 's2', label: 'Initial diagnosis',    short: 'initial-dx',   tokens: 360, content: 'High CPU on DB01. Initial diagnosis: runaway query, no replication lag.' },
        { id: 's3', label: 'Actions taken',        short: 'actions',      tokens: 520, content: 'Killed PID 12345. Restarted db-service. Drained connection pool. Monitoring metrics.' },
        { id: 's4', label: 'Critical finding',     short: 'critical',     tokens: 420, content: 'CRITICAL: user_sessions table corrupted during restart. Initiated restore from 13:55 UTC backup.' },
        { id: 's5', label: 'Resolution',           short: 'resolution',   tokens: 300, content: 'user_sessions restored 16:30 UTC. Service fully recovered. Post-mortem scheduled.' },
      ]
  , [track]);

  // 3 real test questions, each anchored to a specific segment.
  type Q = { id: string; q: string; anchor: string; truth: string; hedge: string };
  const QUERIES: Q[] = useMemo(() => track === 'non-tech'
    ? [
        { id: 'Q1', q: 'When was the patient admitted, and for what?',           anchor: 's1', truth: 'Jane Doe was admitted on 2024-03-12 with community-acquired pneumonia.', hedge: 'The patient was admitted in early 2024 for a respiratory issue, though I would double-check the exact date.' },
        { id: 'Q2', q: 'What was the critical clinical event during admission?', anchor: 's4', truth: 'On day 4, the patient developed acute kidney injury suspected from ACE-i + diuretic interaction. ACE-i was stopped and renal function began recovering.', hedge: 'The records mention day-4 renal function changes but the specific cause is not clearly stated.' },
        { id: 'Q3', q: 'What is the follow-up plan after discharge?',            anchor: 's5', truth: 'Discharged 2024-03-20. Nephrology follow-up, low-sodium diet, daily weights.', hedge: 'The patient was discharged in March 2024 with some outpatient follow-up; the specifics aren’t fully clear from the context.' },
      ]
    : [
        { id: 'Q1', q: 'When did the outage begin and which DB was primary?',    anchor: 's1', truth: 'INC-2024-03-12 — Primary DB was DB01. Outage began at 14:00 UTC.', hedge: 'A database outage occurred on March 12, affecting a primary database — the exact timestamp isn’t fully clear from the context.' },
        { id: 'Q2', q: 'What was the critical finding during incident response?', anchor: 's4', truth: 'The user_sessions table was found corrupted during restart. A restore from the 13:55 UTC backup was initiated.', hedge: 'The records reference user_sessions activity around the restart but the specific finding is not clearly stated.' },
        { id: 'Q3', q: 'When was the service fully recovered?',                  anchor: 's5', truth: 'user_sessions was restored 16:30 UTC; service fully recovered after that.', hedge: 'Service was recovered later that afternoon, though the exact timestamp isn’t fully clear from the context.' },
      ]
  , [track]);

  // State: ordered list of included segment IDs (order = position in context).
  const [order, setOrder] = useState<string[]>(SEGS.map(s => s.id));
  type V = 'pending' | 'pass' | 'hedge' | 'missing';
  const [verdicts, setVerdicts] = useState<V[]>(['pending', 'pending', 'pending']);
  const [activeQuery, setActiveQuery] = useState(0);
  const [response, setResponse] = useState('');
  const [streaming, setStreaming] = useState(false);

  const maxTokens = 8000;
  const totalTokens = useMemo(() => order.reduce((sum, id) => sum + (SEGS.find(s => s.id === id)?.tokens ?? 0), 0), [order, SEGS]);
  const utilisation = totalTokens / maxTokens;
  const overflowed = totalTokens > maxTokens;

  // ─── Deterministic model — answers each query from the current context ─
  // Position penalty mirrors the lost-in-the-middle finding: facts at
  // index 0 or last index in a window of n ≥ 4 surface cleanly; the same
  // fact at any interior index is hedged. With n ≤ 3, every position is
  // an edge position and surfaces cleanly.
  const answer = (q: Q): { verdict: V; text: string } => {
    const idx = order.indexOf(q.anchor);
    if (idx === -1) {
      return { verdict: 'missing', text: `I don’t see anything in the provided context that addresses "${q.q.toLowerCase()}". Add the relevant document segment and re-run.` };
    }
    const n = order.length;
    const isEdge = idx === 0 || idx === n - 1 || n <= 3;
    if (isEdge) return { verdict: 'pass',  text: q.truth };
    return { verdict: 'hedge', text: q.hedge };
  };

  // Ref guard against re-entrant streams that interleave gibberish.
  const streamingRef = useRef(false);
  const stream = useCallback((text: string, onDone: () => void) => {
    if (streamingRef.current) return;
    streamingRef.current = true;
    setResponse('');
    setStreaming(true);
    const chars = Array.from(text);
    let i = 0;
    const tick = () => {
      if (i >= chars.length) {
        streamingRef.current = false;
        setStreaming(false);
        onDone();
        return;
      }
      const burst = Math.max(1, Math.round(2 + Math.random() * 4));
      setResponse(prev => prev + chars.slice(i, i + burst).join(''));
      i += burst;
      setTimeout(tick, 16 + Math.random() * 12);
    };
    setTimeout(tick, 60);
  }, []);

  const runActive = () => {
    const q = QUERIES[activeQuery];
    const result = answer(q);
    stream(result.text, () => {
      setVerdicts(prev => prev.map((v, i) => i === activeQuery ? result.verdict : v));
    });
  };
  const runAll = () => {
    if (streamingRef.current) return;
    const row = QUERIES.map(q => answer(q).verdict);
    setVerdicts(row);
    setResponse('');
  };
  const reset = () => { setVerdicts(['pending','pending','pending']); setResponse(''); };

  const toggle = (id: string) => {
    setOrder(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    setResponse(''); setVerdicts(['pending','pending','pending']);
  };
  const move = (id: string, dir: -1 | 1) => {
    setOrder(prev => {
      const i = prev.indexOf(id); if (i === -1) return prev;
      const j = i + dir; if (j < 0 || j >= prev.length) return prev;
      const next = prev.slice(); [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setResponse(''); setVerdicts(['pending','pending','pending']);
  };
  const promote = (id: string) => {
    setOrder(prev => prev.includes(id) ? [id, ...prev.filter(s => s !== id)] : [id, ...prev]);
    setResponse(''); setVerdicts(['pending','pending','pending']);
  };

  const COLORS: Record<string, string> = { s1: '#3B82F6', s2: '#06B6D4', s3: '#A855F7', s4: '#F59E0B', s5: '#10B981' };
  const passCount = verdicts.filter(v => v === 'pass').length;

  return (
    <div style={{
      background: '#0B0B0F', borderRadius: 12, overflow: 'hidden', border: '1px solid #1F1F26',
      boxShadow: '0 14px 36px rgba(0,0,0,0.45)', color: '#E5E5E5',
      fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #1F1F26', background: '#08080B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: 'linear-gradient(135deg, #2563EB, #06B6D4)', color: '#fff', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>≡</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#F5F5F5' }}>Context Inspector</div>
          <div style={{ fontSize: 10, color: '#737373' }}>· lost-in-the-middle demo</div>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: overflowed ? '#EF4444' : '#A3A3A3' }}>{totalTokens.toLocaleString()} / {maxTokens.toLocaleString()} tokens · {Math.round(utilisation * 100)}%</div>
      </div>

      {/* Window bar with stacked segments + attention heatmap */}
      <div style={{ padding: '14px 16px 6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#737373', letterSpacing: '0.16em' }}>CONTEXT WINDOW · ORDER MATTERS</div>
          <div style={{ display: 'flex', gap: 5 }}>
            <button type="button" onClick={() => setOrder(SEGS.map(s => s.id))} style={{ appearance: 'none', cursor: 'pointer', background: '#13131A', border: '1px solid #262626', color: '#A3A3A3', borderRadius: 4, padding: '3px 8px', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700 }}>reset order</button>
          </div>
        </div>
        <div style={{ position: 'relative', height: 28, background: '#13131A', borderRadius: 6, border: '1px solid #1F1F26', overflow: 'hidden', display: 'flex' }}>
          {order.map(id => {
            const seg = SEGS.find(s => s.id === id); if (!seg) return null;
            const pct = (seg.tokens / maxTokens) * 100;
            return (
              <div key={id} style={{
                width: `${pct}%`,
                background: COLORS[id],
                borderRight: '1px solid rgba(0,0,0,0.30)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.92)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em', textShadow: '0 1px 0 rgba(0,0,0,0.4)', whiteSpace: 'nowrap' }}>{seg.short}</span>
              </div>
            );
          })}
          <div style={{ flex: 1, background: 'repeating-linear-gradient(45deg, #13131A 0px, #13131A 6px, #0F0F14 6px, #0F0F14 12px)' }} />
        </div>

        {/* Attention heatmap below the window bar — illustrates lost-in-the-middle */}
        <div style={{ marginTop: 6, height: 6, background: 'linear-gradient(90deg, rgba(16,163,127,0.7) 0%, rgba(16,163,127,0.5) 18%, rgba(245,158,11,0.35) 50%, rgba(16,163,127,0.5) 82%, rgba(16,163,127,0.7) 100%)', borderRadius: 3 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#525252', letterSpacing: '0.1em' }}>
          <span>HIGH ATTENTION</span><span>LOW (LOST-IN-THE-MIDDLE)</span><span>HIGH ATTENTION</span>
        </div>
      </div>

      {/* Body: segments rail | chat */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 0, borderTop: '1px solid #1F1F26' }}>
        {/* Segments rail — included segments are ordered; excluded are shown below */}
        <div style={{ borderRight: '1px solid #1F1F26', padding: '12px 14px', maxHeight: 380, overflow: 'auto' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#737373', letterSpacing: '0.16em', marginBottom: 8 }}>IN CONTEXT · in order ({order.length})</div>
          {order.map((id, idx) => {
            const seg = SEGS.find(s => s.id === id); if (!seg) return null;
            const isEdge = idx === 0 || idx === order.length - 1 || order.length <= 3;
            return (
              <div key={id} style={{
                marginBottom: 5, padding: '6px 8px',
                background: `${COLORS[id]}1F`,
                border: `1px solid ${COLORS[id]}`,
                borderRadius: 6,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#F5F5F5', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 3, background: COLORS[id], color: '#08080B', fontSize: 9, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{idx + 1}</span>
                    {seg.label}
                    {!isEdge && <span title="Middle position — attention attenuated" style={{ fontSize: 9, color: '#F59E0B', fontFamily: "'JetBrains Mono', monospace" }}>↓attn</span>}
                  </span>
                  <div style={{ display: 'flex', gap: 3 }}>
                    <button type="button" onClick={() => move(id, -1)} disabled={idx === 0} style={{ appearance: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', background: '#08080B', border: '1px solid #262626', color: idx === 0 ? '#525252' : '#E5E5E5', borderRadius: 3, padding: '1px 6px', fontSize: 11, fontFamily: 'inherit' }}>↑</button>
                    <button type="button" onClick={() => move(id, 1)} disabled={idx === order.length - 1} style={{ appearance: 'none', cursor: idx === order.length - 1 ? 'not-allowed' : 'pointer', background: '#08080B', border: '1px solid #262626', color: idx === order.length - 1 ? '#525252' : '#E5E5E5', borderRadius: 3, padding: '1px 6px', fontSize: 11, fontFamily: 'inherit' }}>↓</button>
                    <button type="button" onClick={() => promote(id)} title="Promote to top" style={{ appearance: 'none', cursor: 'pointer', background: '#08080B', border: '1px solid #262626', color: '#E5E5E5', borderRadius: 3, padding: '1px 6px', fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>top</button>
                    <button type="button" onClick={() => toggle(id)} style={{ appearance: 'none', cursor: 'pointer', background: '#08080B', border: '1px solid #262626', color: '#EF4444', borderRadius: 3, padding: '1px 6px', fontSize: 10, fontFamily: 'inherit' }}>×</button>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: '#A3A3A3', lineHeight: 1.5 }}>{seg.content}</div>
                <div style={{ marginTop: 3, fontSize: 9, color: COLORS[id], fontFamily: "'JetBrains Mono', monospace" }}>{seg.tokens} tokens</div>
              </div>
            );
          })}
          {SEGS.filter(s => !order.includes(s.id)).length > 0 && (
            <>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#737373', letterSpacing: '0.16em', marginTop: 12, marginBottom: 6 }}>EXCLUDED · click to add</div>
              {SEGS.filter(s => !order.includes(s.id)).map(seg => (
                <button key={seg.id} type="button" onClick={() => toggle(seg.id)} style={{ appearance: 'none', cursor: 'pointer', textAlign: 'left' as const, display: 'block', width: '100%', marginBottom: 4, padding: '5px 8px', background: 'rgba(255,255,255,0.02)', border: '1px dashed #262626', borderRadius: 5, color: '#737373', fontFamily: 'inherit' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600 }}>+ {seg.label}</div>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Chat */}
        <div style={{ padding: '12px 16px 14px', display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#737373', letterSpacing: '0.16em' }}>TEST QUERIES · {passCount}/3 passing</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {QUERIES.map((q, i) => {
                const v = verdicts[i];
                const isActive = activeQuery === i;
                const dot = v === 'pass' ? '#10B981' : v === 'hedge' ? '#F59E0B' : v === 'missing' ? '#EF4444' : '#525252';
                return (
                  <button key={q.id} type="button" onClick={() => { setActiveQuery(i); setResponse(''); }} style={{
                    appearance: 'none', cursor: 'pointer',
                    padding: '3px 8px', borderRadius: 4,
                    background: isActive ? 'rgba(6,182,212,0.14)' : '#13131A',
                    border: `1px solid ${isActive ? '#06B6D4' : '#262626'}`,
                    color: isActive ? '#06B6D4' : '#A3A3A3',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot }} />{q.id}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ padding: '9px 12px', background: '#13131A', border: '1px solid #1F1F26', borderRadius: 8, fontSize: 12, color: '#E5E5E5', lineHeight: 1.6, marginBottom: 10 }}>{QUERIES[activeQuery].q}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#737373', letterSpacing: '0.16em' }}>ASSISTANT</div>
            {streaming && (
              <div style={{ display: 'flex', gap: 3 }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} style={{ width: 4, height: 4, borderRadius: '50%', background: '#06B6D4' }} />
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: response || streaming ? '9px 12px' : 0, background: response || streaming ? '#13131A' : 'transparent', border: response || streaming ? '1px solid #1F1F26' : 'none', borderRadius: 8, fontSize: 12, color: '#D4D4D4', lineHeight: 1.65, minHeight: 70 }}>
            {response ? <>{response}{streaming && <span style={{ display: 'inline-block', width: 6, height: 12, background: '#06B6D4', marginLeft: 2, verticalAlign: 'middle' }} />}</> : !streaming && <span style={{ color: '#525252', fontStyle: 'italic' as const, fontSize: 11 }}>Edit the context above, then run individual queries or Run all 3.</span>}
          </div>

          {/* Verdict matrix */}
          <div style={{ marginTop: 12, padding: '8px 10px', background: '#13131A', border: '1px solid #1F1F26', borderRadius: 6 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#737373', letterSpacing: '0.16em', marginBottom: 6 }}>VERDICTS</div>
            {QUERIES.map((q, i) => {
              const v = verdicts[i];
              const c = v === 'pass' ? '#10B981' : v === 'hedge' ? '#F59E0B' : v === 'missing' ? '#EF4444' : '#525252';
              const label = v === 'pass' ? '✓ surfaced cleanly' : v === 'hedge' ? '⚠ hedged (middle position)' : v === 'missing' ? '✗ segment excluded' : 'not run';
              return (
                <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: i < 2 ? '1px solid #1F1F26' : 'none' }}>
                  <span style={{ fontSize: 10.5, color: '#E5E5E5' }}><span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#737373', marginRight: 6 }}>{q.id}</span>{q.q}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
                </div>
              );
            })}
          </div>

          {/* Status note + actions */}
          <div style={{ marginTop: 10, padding: '7px 10px', background: '#13131A', border: '1px solid #1F1F26', borderRadius: 6, fontSize: 10, color: '#A3A3A3', lineHeight: 1.55 }}>
            {passCount === 3 ? (
              <><span style={{ color: '#10B981' }}>●</span> 3/3 — every fact is at an edge position. This is the layout you ship.</>
            ) : verdicts.some(v => v === 'missing') ? (
              <><span style={{ color: '#EF4444' }}>●</span> A segment is excluded — model literally cannot see that fact.</>
            ) : verdicts.some(v => v === 'hedge') ? (
              <><span style={{ color: '#F59E0B' }}>●</span> Mid-context attenuation. Promote the buried segment to position 1 or last to surface it.</>
            ) : (
              <><span style={{ color: '#06B6D4' }}>●</span> Pick a query (Q1/Q2/Q3) and Run, or Run all 3 to fill the verdict matrix.</>
            )}
          </div>

          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
            <button type="button" onClick={reset} style={{ appearance: 'none', cursor: 'pointer', background: 'transparent', border: '1px solid #262626', borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 600, color: '#A3A3A3' }}>Reset verdicts</button>
            <button type="button" onClick={runAll} disabled={streaming || order.length === 0} style={{ appearance: 'none', cursor: streaming || order.length === 0 ? 'not-allowed' : 'pointer', background: '#08080B', border: '1px solid #06B6D4', color: '#06B6D4', borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 700 }}>Run all 3</button>
            <button type="button" onClick={runActive} disabled={streaming || order.length === 0} style={{ appearance: 'none', background: streaming || order.length === 0 ? '#1F1F26' : '#06B6D4', border: 'none', borderRadius: 6, padding: '6px 18px', fontSize: 11.5, fontWeight: 700, color: streaming || order.length === 0 ? '#737373' : '#FFFFFF', cursor: streaming || order.length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>{streaming ? 'Streaming…' : `Run ${QUERIES[activeQuery].id} ▶`}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ModelSelectorTool — REAL routing-and-budget sandbox ─────────────────
// This is a functioning sandbox, not a click-and-reveal mockup. The learner
// routes three real workloads (each with daily volume, token/call, latency
// budget, and a needsFrontier flag derived from the workload's reasoning
// depth) to one of five real frontier/fast models. Cost and latency are
// real arithmetic against published-tier prices. Each workload gets a real
// verdict: optimal · over-spec (wasting money) · quality-risk (sub-frontier
// where frontier is needed) · latency-risk (model slower than the workload's
// SLA). A baseline (everything on gpt-4o) is the starting state, and the
// monthly-savings panel updates live as the learner downroutes. Goal:
// 3/3 optimal and under the monthly budget the workload portfolio sets.
const ModelSelectorTool: React.FC<{ track: GenAITrack }> = ({ track }) => {
  type ModelId = 'gpt-4o' | 'gpt-4o-mini' | 'claude-3-5-sonnet' | 'claude-3-5-haiku' | 'gemini-1.5-flash';
  const MODELS: Record<ModelId, {
    name: string; provider: string; logo: string; logoBg: string;
    contextK: number; inPrice: number; outPrice: number;
    latencyMs: number; tier: 'frontier' | 'fast'; badges: string[];
  }> = {
    'gpt-4o':              { name: 'GPT-4o',              provider: 'OpenAI',    logo: '◯', logoBg: '#10A37F', contextK: 128, inPrice: 2.50,  outPrice: 10.00, latencyMs: 460, tier: 'frontier', badges: ['vision', 'function-calling'] },
    'gpt-4o-mini':         { name: 'GPT-4o-mini',         provider: 'OpenAI',    logo: '◯', logoBg: '#10A37F', contextK: 128, inPrice: 0.15,  outPrice: 0.60,  latencyMs: 290, tier: 'fast',     badges: ['vision'] },
    'claude-3-5-sonnet':   { name: 'Claude 3.5 Sonnet',   provider: 'Anthropic', logo: 'A', logoBg: '#C66B3D', contextK: 200, inPrice: 3.00,  outPrice: 15.00, latencyMs: 540, tier: 'frontier', badges: ['vision', 'tool-use'] },
    'claude-3-5-haiku':    { name: 'Claude 3.5 Haiku',    provider: 'Anthropic', logo: 'A', logoBg: '#C66B3D', contextK: 200, inPrice: 0.80,  outPrice: 4.00,  latencyMs: 320, tier: 'fast',     badges: ['tool-use'] },
    'gemini-1.5-flash':    { name: 'Gemini 1.5 Flash',    provider: 'Google',    logo: 'G', logoBg: '#4285F4', contextK: 1000, inPrice: 0.075, outPrice: 0.30,  latencyMs: 240, tier: 'fast',     badges: ['vision', '1M-context'] },
  };

  type Workload = { id: string; label: string; volumePerDay: number; tokensPerCall: number; needsFrontier: boolean; latencyBudgetMs: number };
  const WORKLOADS: Workload[] = track === 'non-tech'
    ? [
        { id: 'w1', label: 'Intake form summarisation',     volumePerDay: 200, tokensPerCall: 2000, needsFrontier: false, latencyBudgetMs: 600 },
        { id: 'w2', label: 'Exception classification',     volumePerDay: 100, tokensPerCall: 1500, needsFrontier: false, latencyBudgetMs: 400 },
        { id: 'w3', label: 'Complex care-plan synthesis',  volumePerDay: 5,   tokensPerCall: 6000, needsFrontier: true,  latencyBudgetMs: 1500 },
      ]
    : [
        { id: 'w1', label: 'Log anomaly summarisation',    volumePerDay: 500, tokensPerCall: 1500, needsFrontier: false, latencyBudgetMs: 600 },
        { id: 'w2', label: 'Ticket routing classifier',   volumePerDay: 200, tokensPerCall: 1200, needsFrontier: false, latencyBudgetMs: 350 },
        { id: 'w3', label: 'Root-cause analysis for SEV-1s', volumePerDay: 8, tokensPerCall: 8000, needsFrontier: true,  latencyBudgetMs: 1500 },
      ];

  // Starting state = baseline "everything on gpt-4o" so the learner can
  // see how much money the over-spec posture is costing.
  const BASELINE_ROUTING: Record<string, ModelId> = { w1: 'gpt-4o', w2: 'gpt-4o', w3: 'gpt-4o' };
  const [routing, setRouting] = useState<Record<string, ModelId>>(BASELINE_ROUTING);

  const monthCostOf = (r: Record<string, ModelId>) => {
    let total = 0;
    for (const w of WORKLOADS) {
      const m = MODELS[r[w.id]];
      const tokens = w.tokensPerCall * w.volumePerDay * 30;
      // assume 70% input / 30% output split
      const cost = (tokens * 0.7 / 1_000_000) * m.inPrice + (tokens * 0.3 / 1_000_000) * m.outPrice;
      total += cost;
    }
    return total;
  };
  const monthlyCost  = useMemo(() => monthCostOf(routing),         [routing]);
  const baselineCost = useMemo(() => monthCostOf(BASELINE_ROUTING), []);
  const savings = baselineCost - monthlyCost;

  // Real per-workload verdict driven by (model.tier, needsFrontier, latency).
  type WV = 'optimal' | 'over-spec' | 'quality-risk' | 'latency-risk';
  const verdictOf = (w: Workload): WV => {
    const m = MODELS[routing[w.id]];
    if (m.latencyMs > w.latencyBudgetMs) return 'latency-risk';
    if (w.needsFrontier && m.tier !== 'frontier') return 'quality-risk';
    if (!w.needsFrontier && m.tier === 'frontier') return 'over-spec';
    return 'optimal';
  };
  const verdicts = WORKLOADS.map(verdictOf);
  const optimalCount = verdicts.filter(v => v === 'optimal').length;
  // Budget: 30% of baseline rounded to nearest $10. Real arithmetic the
  // learner can hit by downrouting low-stakes workloads.
  const budget = Math.round(baselineCost * 0.3 / 10) * 10;
  const underBudget = monthlyCost <= budget;

  // ─── OpenRouter-style UI ─────────────────────────────────────────────
  const orBg = '#0A0A0F';
  const tableBg = '#11111A';
  const rowBorder = '1px solid #1F1F29';
  const accent = '#7C3AED';
  const inkPrimary = '#F4F4F5';
  const inkMuted = '#A1A1AA';

  const labelMono: CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: inkMuted, textTransform: 'uppercase' };

  return (
    <div style={{
      background: orBg, borderRadius: 12, overflow: 'hidden', border: '1px solid #1F1F29',
      boxShadow: '0 14px 36px rgba(0,0,0,0.45)', color: inkPrimary,
      fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: rowBorder, background: '#08080C' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#A78BFA' }} />
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#A78BFA', opacity: 0.65 }} />
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#A78BFA', opacity: 0.35 }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: inkPrimary }}>OpenRouter</div>
          <div style={{ fontSize: 10, color: inkMuted }}>· Model Comparison</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600, color: inkMuted, border: rowBorder }}>Filter: all</div>
          <div style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600, color: inkMuted, border: rowBorder }}>Sort: cost ↑</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: 0 }}>
        {/* LEFT: model table */}
        <div style={{ borderRight: rowBorder }}>
          <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: 'minmax(160px,2fr) 80px 70px 70px 90px', gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: inkMuted, letterSpacing: '0.14em', borderBottom: rowBorder, background: '#0C0C12' }}>
            <span>MODEL</span><span style={{ textAlign: 'right' }}>CONTEXT</span><span style={{ textAlign: 'right' }}>$ IN /M</span><span style={{ textAlign: 'right' }}>$ OUT /M</span><span style={{ textAlign: 'right' }}>LATENCY</span>
          </div>
          {(Object.keys(MODELS) as ModelId[]).map(id => {
            const m = MODELS[id];
            const isUsed = Object.values(routing).includes(id);
            return (
              <div key={id} style={{
                padding: '10px 14px',
                display: 'grid', gridTemplateColumns: 'minmax(160px,2fr) 80px 70px 70px 90px', gap: 8,
                alignItems: 'center',
                borderBottom: rowBorder,
                background: isUsed ? `${accent}0F` : tableBg,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: m.logoBg, color: '#fff', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: m.logo === 'A' ? 'serif' : 'inherit' }}>{m.logo}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: inkPrimary, lineHeight: 1.2 }}>{m.name}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
                      <span style={{ fontSize: 9, color: inkMuted }}>{m.provider}</span>
                      {m.tier === 'frontier' && <span style={{ fontSize: 8, fontWeight: 700, color: '#FCD34D', background: 'rgba(252,211,77,0.12)', padding: '0 5px', borderRadius: 3, letterSpacing: '0.04em' }}>FRONTIER</span>}
                      {m.tier === 'fast' && <span style={{ fontSize: 8, fontWeight: 700, color: '#67E8F9', background: 'rgba(103,232,249,0.12)', padding: '0 5px', borderRadius: 3, letterSpacing: '0.04em' }}>FAST</span>}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: inkPrimary }}>{m.contextK >= 1000 ? `${m.contextK / 1000}M` : `${m.contextK}K`}</div>
                <div style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: m.inPrice < 0.5 ? '#10B981' : m.inPrice < 2 ? '#FBBF24' : '#FCA5A5' }}>${m.inPrice.toFixed(2)}</div>
                <div style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: m.outPrice < 2 ? '#10B981' : m.outPrice < 8 ? '#FBBF24' : '#FCA5A5' }}>${m.outPrice.toFixed(2)}</div>
                <div style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: inkMuted }}>{m.latencyMs} ms</div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: workload routing */}
        <div style={{ padding: '12px 14px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={labelMono}>ROUTE WORKLOADS</div>
            <button type="button" onClick={() => setRouting(BASELINE_ROUTING)} style={{ appearance: 'none', cursor: 'pointer', background: 'transparent', border: rowBorder, borderRadius: 4, padding: '2px 8px', fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: inkMuted, letterSpacing: '0.06em' }}>RESET TO BASELINE</button>
          </div>
          {WORKLOADS.map((w, i) => {
            const v = verdicts[i];
            const borderColor = v === 'optimal' ? '#10B981' : v === 'over-spec' ? '#F59E0B' : v === 'quality-risk' ? '#EF4444' : '#A855F7';
            const m = MODELS[routing[w.id]];
            const verdictLabel = v === 'optimal' ? 'OPTIMAL' : v === 'over-spec' ? 'OVER-SPEC' : v === 'quality-risk' ? 'QUALITY RISK' : 'LATENCY RISK';
            const verdictBg = v === 'optimal' ? 'rgba(16,185,129,0.15)' : v === 'over-spec' ? 'rgba(245,158,11,0.15)' : v === 'quality-risk' ? 'rgba(239,68,68,0.15)' : 'rgba(168,85,247,0.15)';
            return (
              <div key={w.id} style={{ marginBottom: 10, padding: '8px 10px', background: tableBg, border: `1px solid ${borderColor}`, borderRadius: 7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: inkPrimary, lineHeight: 1.3 }}>{w.label}</div>
                  <span style={{ fontSize: 8, fontWeight: 700, color: borderColor, background: verdictBg, padding: '1px 5px', borderRadius: 3, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{verdictLabel}</span>
                </div>
                <div style={{ fontSize: 9, color: inkMuted, marginBottom: 6, lineHeight: 1.5 }}>
                  {w.volumePerDay}/day · ~{w.tokensPerCall.toLocaleString()} tok/call · {w.needsFrontier ? 'reasoning-heavy' : 'classification'} · SLA &lt;{w.latencyBudgetMs}ms
                  <br />
                  <span style={{ color: m.latencyMs > w.latencyBudgetMs ? '#A855F7' : '#10B981', fontFamily: "'JetBrains Mono', monospace" }}>chosen: {m.latencyMs}ms · {m.tier}</span>
                </div>
                <select
                  value={routing[w.id]}
                  onChange={e => setRouting(prev => ({ ...prev, [w.id]: e.target.value as ModelId }))}
                  style={{
                    width: '100%', padding: '5px 8px', borderRadius: 5,
                    background: '#0A0A12', border: `1px solid ${borderColor}`,
                    color: inkPrimary, fontSize: 11, fontFamily: 'inherit', fontWeight: 600,
                  }}
                >
                  {(Object.keys(MODELS) as ModelId[]).map(id => (
                    <option key={id} value={id}>{MODELS[id].name} — ${MODELS[id].inPrice.toFixed(2)}/${MODELS[id].outPrice.toFixed(2)} · {MODELS[id].latencyMs}ms</option>
                  ))}
                </select>
              </div>
            );
          })}

          {/* Cost + savings + budget */}
          <div style={{ marginTop: 12, padding: '10px 12px', background: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(168,85,247,0.08))', border: `1px solid ${accent}66`, borderRadius: 7 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ ...labelMono, color: '#C4B5FD' }}>MONTHLY SPEND</div>
              <div style={{ fontSize: 9, color: inkMuted, fontFamily: "'JetBrains Mono', monospace" }}>baseline ${baselineCost.toFixed(0)}/mo</div>
            </div>
            <motion.div
              key={monthlyCost.toFixed(2)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color: inkPrimary, marginTop: 3 }}
            >${monthlyCost.toFixed(2)}</motion.div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, paddingTop: 6, borderTop: `1px solid ${accent}33` }}>
              <span style={{ fontSize: 10, color: inkMuted, fontFamily: "'JetBrains Mono', monospace" }}>savings</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: savings > 0 ? '#34D399' : savings < 0 ? '#FCA5A5' : inkMuted, fontFamily: "'JetBrains Mono', monospace" }}>{savings > 0 ? '−' : savings < 0 ? '+' : ''}${Math.abs(savings).toFixed(0)} {savings > 0 ? '↓' : savings < 0 ? '↑' : '='}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 }}>
              <span style={{ fontSize: 10, color: inkMuted, fontFamily: "'JetBrains Mono', monospace" }}>budget ${budget}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: underBudget ? '#34D399' : '#FCA5A5', fontFamily: "'JetBrains Mono', monospace" }}>{underBudget ? '✓ under' : `✗ +$${(monthlyCost - budget).toFixed(0)}`}</span>
            </div>
          </div>

          {/* Goal status */}
          <div style={{ marginTop: 8, padding: '7px 10px', background: tableBg, border: `1px solid ${optimalCount === 3 && underBudget ? '#10B981' : '#262633'}`, borderRadius: 6, fontSize: 10, color: inkMuted, lineHeight: 1.5 }}>
            {optimalCount === 3 && underBudget ? (
              <><span style={{ color: '#10B981' }}>●</span> 3/3 optimal · under budget. This is the routing you ship.</>
            ) : verdicts.some(v => v === 'quality-risk') ? (
              <><span style={{ color: '#EF4444' }}>●</span> A reasoning-heavy workload is on a fast model — quality regression risk.</>
            ) : verdicts.some(v => v === 'latency-risk') ? (
              <><span style={{ color: '#A855F7' }}>●</span> A workload’s chosen model is slower than its SLA.</>
            ) : verdicts.filter(v => v === 'over-spec').length > 0 ? (
              <><span style={{ color: '#F59E0B' }}>●</span> {verdicts.filter(v => v === 'over-spec').length} workload(s) on frontier where fast would do — downroute to hit budget.</>
            ) : (
              <><span style={{ color: '#C4B5FD' }}>●</span> {optimalCount}/3 optimal. Adjust until 3/3 and under ${budget}.</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PromptDiffViewer — REAL prompt-iteration sandbox (VS Code git diff) ──
// This is a functioning sandbox, not a click-and-reveal mockup. The learner
// owns three prompt versions, each in a real editable textarea. A real test
// input (clinical record / incident report) sits below. Running each version
// invokes a deterministic prompt analyzer that scores the prompt for: role,
// scope clause, format constraint, worked example. The generated output
// reacts to those signals — vague free-text when weak, structured bullets/JSON
// when role+format present, AND surfaces the critical fact only when scope or
// worked-example is present. A real rubric scores each version (Structured ·
// Critical-fact present · In-scope) and the diff between versions is
// recomputed live as the learner edits.
const PromptDiffViewer: React.FC<{ track: GenAITrack }> = ({ track }) => {
  const [version, setVersion] = useState(1);

  // Initial prompt versions — the learner can edit any of these in place.
  const INITIAL = track === 'non-tech' ? {
    v1: 'Write a discharge summary for this patient.',
    v2: `You are a clinical documentation assistant. Summarise the patient's discharge plan from the provided care notes. Return a bulleted list of key actions for home care. Use a professional, empathetic tone.`,
    v3: `You are a clinical documentation assistant. Summarise the patient's discharge plan from the provided care notes (last 7 days only). Return a bulleted list of key actions for home care. Use a professional, empathetic tone.
Example: For a patient with AKI, include specific dietary restrictions and follow-up with nephrology.`,
  } : {
    v1: 'Summarize incident report.',
    v2: `System: You are an API endpoint for generating structured summaries.
User: Summarize the incident report.
System: Output a JSON object with fields: "incident_id", "root_cause", "resolution_steps", "impact".`,
    v3: `System: You are an API endpoint for generating structured summaries.
User: Summarize the incident report.
System: Output a JSON object with fields: "incident_id", "root_cause", "resolution_steps", "impact", "data_integrity_status".
Example: If "data corruption detected", set "data_integrity_status" to "Compromised, restored from backup".`,
  };
  const [v1Text, setV1Text] = useState(INITIAL.v1);
  const [v2Text, setV2Text] = useState(INITIAL.v2);
  const [v3Text, setV3Text] = useState(INITIAL.v3);

  // The real test input — the model "sees" this every run.
  const TEST_INPUT = track === 'non-tech'
    ? 'PATIENT: Jane Doe, 68F. Admitted 2024-03-12 (community-acquired pneumonia). PMH: COPD, HTN, T2DM. Treated azithromycin + ceftriaxone. Day-4 AKI suspected from ACE-i + diuretic interaction — ACE-i stopped, renal recovering. Discharged 2024-03-20. Nephrology f/u 2 weeks. Low-sodium diet, daily weights.'
    : 'INCIDENT INC-2024-03-12: Primary DB01 outage 14:00 UTC. Initial dx: runaway query, no replication lag. Actions: killed PID 12345, restarted db-service, drained pool. CRITICAL: user_sessions table corrupted during restart — restore from 13:55 UTC backup. Recovered 16:30 UTC. Impact: 2.5h partial degradation.';

  // ─── Deterministic prompt analyzer ────────────────────────────────────
  // Detects four signals from the prompt text. Same shape as the
  // PromptBuilderTool analyzer.
  const analyse = (text: string) => ({
    hasRole:    /you are\b|act as\b|api endpoint/i.test(text),
    hasFormat:  /bulleted|bullet list|numbered|json object|fields[: ]|schema|output (only|a )?json|return a/i.test(text),
    hasScope:   /from the provided|provided care notes|last \d+ days|only the/i.test(text),
    hasExample: /example[:.]/i.test(text),
  });

  // Deterministic "model" output — keyed off the four signals.
  const generate = (text: string): string => {
    const s = analyse(text);
    if (track === 'non-tech') {
      if (!s.hasRole && !s.hasFormat) {
        return 'Patient was discharged after treatment. They should follow up with their doctor and continue medications as prescribed.';
      }
      if (s.hasRole && s.hasFormat && !s.hasScope && !s.hasExample) {
        return '• Patient discharged on 2024-03-20.\n• Follow up with primary care.\n• Continue antibiotics as prescribed.\n• Take medications as directed.';
      }
      if (s.hasRole && s.hasFormat && (s.hasScope || s.hasExample) && !(s.hasScope && s.hasExample)) {
        return '• Discharged 2024-03-20.\n• Continue azithromycin + ceftriaxone course.\n• Follow up nephrology in 2 weeks for AKI.\n• Low-sodium diet, daily weights.';
      }
      if (s.hasRole && s.hasFormat && s.hasScope && s.hasExample) {
        return '• Discharged 2024-03-20.\n• Complete azithromycin + ceftriaxone course.\n• Nephrology follow-up in 2 weeks — AKI was day-4 ACE-i + diuretic interaction; ACE-i discontinued.\n• Low-sodium diet, daily weights, monitor fluid intake.\n• PCP follow-up 1 week.';
      }
      return 'Patient discharged. Follow up as advised. Continue medications.';
    }
    if (!s.hasRole && !s.hasFormat) {
      return 'The system had a database issue. The team identified the problem and resolved it. Service was restored.';
    }
    if (s.hasRole && s.hasFormat && !s.hasScope && !s.hasExample) {
      return '{\n  "incident_id": "INC-2024-03-12",\n  "root_cause": "Runaway query on DB01",\n  "resolution_steps": ["Killed PID 12345", "Restarted db-service"],\n  "impact": "Partial service degradation for 2.5 hours."\n}';
    }
    if (s.hasRole && s.hasFormat && (s.hasScope || s.hasExample) && !(s.hasScope && s.hasExample)) {
      return '{\n  "incident_id": "INC-2024-03-12",\n  "root_cause": "Runaway query on DB01",\n  "resolution_steps": ["Killed PID 12345", "Restarted db-service", "Restored user_sessions"],\n  "impact": "2.5h partial service degradation."\n}';
    }
    if (s.hasRole && s.hasFormat && s.hasScope && s.hasExample) {
      return '{\n  "incident_id": "INC-2024-03-12",\n  "root_cause": "Runaway query on DB01",\n  "resolution_steps": ["Killed PID 12345", "Restarted db-service", "Restored user_sessions from 13:55 UTC backup"],\n  "impact": "2.5h partial degradation; recovered 16:30 UTC.",\n  "data_integrity_status": "Compromised, restored from backup"\n}';
    }
    return 'The incident was investigated and resolved.';
  };

  const PROMPTS = { v1: v1Text, v2: v2Text, v3: v3Text };
  const setPrompt = (v: 1 | 2 | 3, text: string) => {
    if (v === 1) setV1Text(text); else if (v === 2) setV2Text(text); else setV3Text(text);
  };
  const resetVersion = (v: 1 | 2 | 3) => setPrompt(v, v === 1 ? INITIAL.v1 : v === 2 ? INITIAL.v2 : INITIAL.v3);

  const currentPrompt = PROMPTS[`v${version}` as keyof typeof PROMPTS];
  const currentOutput = useMemo(() => generate(currentPrompt), [currentPrompt, track]);
  const currentSigs = analyse(currentPrompt);

  // Real rubric checks against the live output for this version.
  const rubric = useMemo(() => {
    const out = currentOutput;
    const isStructured = /^[•\-\d]|^\{/.test(out) || /[\n][•\-\d]/.test(out) || out.trim().startsWith('{');
    const criticalKey = track === 'non-tech' ? /aki|nephrology|ace[- ]?i|low[- ]sodium/i : /user_sessions|data_integrity|corrupted|restore from .* backup/i;
    const hasCritical = criticalKey.test(out);
    const inScope = !/i recommend|please consult|generic|may want to/i.test(out);
    return { isStructured, hasCritical, inScope };
  }, [currentOutput, track]);
  const score = (rubric.isStructured ? 1 : 0) + (rubric.hasCritical ? 1 : 0) + (rubric.inScope ? 1 : 0);

  const currentVerdict = score === 3
    ? 'Production-grade — structured, critical fact surfaced, in-scope.'
    : score === 2
    ? `Almost — missing ${!rubric.isStructured ? 'structure' : !rubric.hasCritical ? 'the critical fact' : 'scope discipline'}.`
    : score === 1
    ? 'Weak — model is filling gaps with filler.'
    : 'Unstructured generic output — no signal to anchor.';

  // Line-level diff between adjacent versions, like a real git diff. We split
  // each version into lines, find the longest-common-subsequence by walking
  // both arrays, and emit add/remove/unchanged hunks. Simpler than Myers but
  // produces clean visuals for short prompt diffs.
  type DiffLine = { type: 'add' | 'del' | 'eq'; text: string };
  const buildDiff = (a: string, b: string): DiffLine[] => {
    const aL = a.split('\n');
    const bL = b.split('\n');
    const out: DiffLine[] = [];
    let i = 0, j = 0;
    while (i < aL.length || j < bL.length) {
      if (i < aL.length && j < bL.length && aL[i] === bL[j]) {
        out.push({ type: 'eq', text: aL[i] }); i++; j++;
      } else if (j < bL.length && (i >= aL.length || !aL.includes(bL[j]))) {
        out.push({ type: 'add', text: bL[j] }); j++;
      } else if (i < aL.length && (j >= bL.length || !bL.includes(aL[i]))) {
        out.push({ type: 'del', text: aL[i] }); i++;
      } else {
        // both still have matchable content elsewhere — emit the next pair as
        // a delete+add to keep order
        if (i < aL.length) { out.push({ type: 'del', text: aL[i] }); i++; }
        if (j < bL.length) { out.push({ type: 'add', text: bL[j] }); j++; }
      }
    }
    return out;
  };

  const compareTo = Math.max(1, version - 1);
  const aText = PROMPTS[`v${compareTo}` as keyof typeof PROMPTS];
  const bText = PROMPTS[`v${version}` as keyof typeof PROMPTS];
  const diff: DiffLine[] = version === 1 ? bText.split('\n').map(line => ({ type: 'eq' as const, text: line })) : buildDiff(aText, bText);
  const adds = diff.filter(d => d.type === 'add').length;
  const dels = diff.filter(d => d.type === 'del').length;

  // ─── VS Code git-diff UI ─────────────────────────────────────────────
  const vsBg = '#1E1E1E';
  const vsSideBg = '#252526';
  const vsTabBar = '#2D2D30';
  const vsActiveTab = '#1E1E1E';
  const vsBorder = '#1B1B1B';
  const vsGutter = '#858585';
  const vsAddBg = 'rgba(155,185,85,0.16)';
  const vsAddText = '#B5CEA8';
  const vsDelBg = 'rgba(244,135,113,0.14)';
  const vsDelText = '#F48771';
  const vsKey = '#569CD6';
  const vsString = '#CE9178';
  const vsText = '#D4D4D4';

  // Lightweight prompt syntax tinting: SYSTEM:, User:, Schema: get a token colour
  const tintLine = (text: string, baseColor: string) => {
    const sysPrefix = /^(SYSTEM:|USER:|User:|Example:|Schema:|System:)/;
    const m = text.match(sysPrefix);
    if (m) {
      const rest = text.slice(m[0].length);
      return <><span style={{ color: vsKey, fontWeight: 700 }}>{m[0]}</span><span style={{ color: baseColor }}>{rest}</span></>;
    }
    // tint quoted strings
    const stringRegex = /"[^"]*"|'[^']*'/g;
    const parts: React.ReactNode[] = [];
    let last = 0;
    let mm: RegExpExecArray | null;
    while ((mm = stringRegex.exec(text)) !== null) {
      if (mm.index > last) parts.push(<span key={`t${last}`} style={{ color: baseColor }}>{text.slice(last, mm.index)}</span>);
      parts.push(<span key={`s${mm.index}`} style={{ color: vsString }}>{mm[0]}</span>);
      last = mm.index + mm[0].length;
    }
    if (last < text.length) parts.push(<span key={`e${last}`} style={{ color: baseColor }}>{text.slice(last)}</span>);
    return parts.length > 0 ? parts : <span style={{ color: baseColor }}>{text || ' '}</span>;
  };

  return (
    <div style={{
      background: vsBg, borderRadius: 8, overflow: 'hidden', border: `1px solid ${vsBorder}`,
      boxShadow: '0 14px 36px rgba(0,0,0,0.45)', color: vsText,
      fontFamily: "Inter, -apple-system, system-ui, sans-serif",
    }}>
      {/* Title bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 12px', background: '#3C3C3C', fontSize: 11, color: '#CCCCCC' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#FF5F57', fontSize: 11 }}>●</span>
          <span style={{ color: '#FEBC2E', fontSize: 11 }}>●</span>
          <span style={{ color: '#28C840', fontSize: 11 }}>●</span>
          <span style={{ marginLeft: 8, fontSize: 11 }}>prompts — northstar-claims-classifier</span>
        </div>
        <div style={{ fontSize: 10, color: '#858585' }}>Visual Studio Code</div>
      </div>

      {/* Tab strip */}
      <div style={{ display: 'flex', background: vsTabBar, borderBottom: `1px solid ${vsBorder}` }}>
        {([1, 2, 3] as const).map(v => {
          const isActive = v === version;
          return (
            <button
              key={v}
              type="button"
              onClick={() => setVersion(v)}
              style={{
                appearance: 'none',
                cursor: 'pointer',
                background: isActive ? vsActiveTab : 'transparent',
                border: 'none',
                borderRight: `1px solid ${vsBorder}`,
                borderTop: isActive ? `1px solid ${vsKey}` : 'none',
                padding: '7px 14px 6px',
                fontSize: 11.5,
                color: isActive ? '#FFFFFF' : '#969696',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span style={{ color: '#519ABA', fontSize: 11 }}>◇</span>
              <span>v{v}.prompt</span>
              <span style={{ marginLeft: 6, opacity: 0.5, fontSize: 11 }}>×</span>
            </button>
          );
        })}
        <div style={{ flex: 1, background: vsTabBar }} />
      </div>

      {/* Breadcrumb */}
      <div style={{ padding: '4px 14px', fontSize: 10.5, color: '#858585', background: vsBg, borderBottom: `1px solid ${vsBorder}`, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>prompts</span><span style={{ opacity: 0.5 }}>›</span>
        <span>v{compareTo}.prompt</span><span style={{ opacity: 0.5 }}>↔</span>
        <span style={{ color: '#D4D4D4' }}>v{version}.prompt</span>
        <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
          <span style={{ color: vsAddText, marginRight: 8 }}>+{adds}</span>
          <span style={{ color: vsDelText }}>−{dels}</span>
        </span>
      </div>

      {/* Editor strip — diff view (read-only) on left, live prompt editor on right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: vsBg }}>
        {/* Diff editor (read-only, vs v{compareTo}) */}
        <div style={{ borderRight: `1px solid ${vsBorder}`, padding: '6px 0 8px', maxHeight: 260, overflow: 'auto', fontFamily: "'JetBrains Mono', 'Menlo', 'Consolas', monospace", fontSize: 11.5, lineHeight: 1.5 }}>
          <div style={{ padding: '4px 10px', fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: '#858585', letterSpacing: '0.14em', borderBottom: `1px solid ${vsBorder}` }}>DIFF · v{compareTo} ↔ v{version}</div>
          <AnimatePresence mode="wait">
            <motion.div key={`diff-${version}-${bText.length}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
              {diff.map((d, i) => {
                const sign = d.type === 'add' ? '+' : d.type === 'del' ? '−' : ' ';
                const rowBg = d.type === 'add' ? vsAddBg : d.type === 'del' ? vsDelBg : 'transparent';
                const signColor = d.type === 'add' ? vsAddText : d.type === 'del' ? vsDelText : vsGutter;
                return (
                  <div key={i} style={{ display: 'flex', background: rowBg, paddingLeft: 6 }}>
                    <span style={{ width: 22, color: vsGutter, fontSize: 10, textAlign: 'right', userSelect: 'none', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ width: 14, color: signColor, textAlign: 'center', fontWeight: 700, fontSize: 12, userSelect: 'none', flexShrink: 0 }}>{sign}</span>
                    <span style={{ paddingLeft: 5, paddingRight: 8, whiteSpace: 'pre-wrap' as const, wordBreak: 'break-word', textDecoration: d.type === 'del' ? 'line-through' : 'none' }}>
                      {tintLine(d.text || ' ', d.type === 'add' ? vsAddText : d.type === 'del' ? vsDelText : vsText)}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Live prompt editor — you edit, model output below updates */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, maxHeight: 260 }}>
          <div style={{ padding: '4px 10px', fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: '#858585', letterSpacing: '0.14em', borderBottom: `1px solid ${vsBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>v{version}.prompt · editable</span>
            <button type="button" onClick={() => resetVersion(version as 1 | 2 | 3)} style={{ appearance: 'none', cursor: 'pointer', background: 'transparent', border: `1px solid ${vsBorder}`, color: vsGutter, borderRadius: 3, padding: '1px 7px', fontSize: 9, fontFamily: 'inherit', letterSpacing: '0.06em' }}>RESET v{version}</button>
          </div>
          <textarea
            value={currentPrompt}
            onChange={e => setPrompt(version as 1 | 2 | 3, e.target.value)}
            spellCheck={false}
            style={{
              flex: 1, minHeight: 200, padding: '8px 10px',
              background: vsBg, border: 'none', resize: 'none' as const,
              color: vsText, fontSize: 11.5, lineHeight: 1.55,
              fontFamily: "'JetBrains Mono', 'Menlo', 'Consolas', monospace",
              outline: 'none',
            }}
          />
          {/* Live signal strip */}
          <div style={{ padding: '5px 10px', borderTop: `1px solid ${vsBorder}`, display: 'flex', gap: 5, flexWrap: 'wrap' as const, background: vsSideBg }}>
            {([
              ['role',    currentSigs.hasRole],
              ['format',  currentSigs.hasFormat],
              ['scope',   currentSigs.hasScope],
              ['example', currentSigs.hasExample],
            ] as const).map(([name, on]) => (
              <span key={name} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700,
                padding: '1px 7px', borderRadius: 3,
                background: on ? 'rgba(155,185,85,0.20)' : 'rgba(133,133,133,0.10)',
                color: on ? vsAddText : '#858585',
                border: `1px solid ${on ? 'rgba(155,185,85,0.40)' : '#3A3A3A'}`,
              }}>{on ? '✓' : '·'} {name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Test input row */}
      <div style={{ background: vsSideBg, padding: '7px 14px', borderTop: `1px solid ${vsBorder}` }}>
        <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: '#858585', letterSpacing: '0.14em', marginBottom: 3 }}>TEST INPUT · model sees this every run</div>
        <div style={{ fontFamily: "'JetBrains Mono', 'Menlo', monospace", fontSize: 10.5, color: vsText, lineHeight: 1.55 }}>{TEST_INPUT}</div>
      </div>

      {/* Output panel */}
      <div style={{ borderTop: `1px solid ${vsBorder}`, background: vsSideBg }}>
        <div style={{ padding: '7px 14px', fontSize: 9.5, fontFamily: "'JetBrains Mono', monospace", color: '#858585', letterSpacing: '0.14em', borderBottom: `1px solid ${vsBorder}`, display: 'flex', justifyContent: 'space-between' }}>
          <span>OUTPUT — model response (v{version})</span>
          <span style={{ color: '#858585' }}>gpt-4o · temperature 0.2</span>
        </div>
        <div style={{ padding: '10px 14px', fontFamily: "'JetBrains Mono', 'Menlo', monospace", fontSize: 11.5, color: vsText, lineHeight: 1.65, whiteSpace: 'pre-wrap' as const, maxHeight: 160, overflow: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div key={`out-${currentOutput.slice(0, 40)}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {currentOutput}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Rubric ribbon */}
      <div style={{ padding: '8px 14px', background: `${ACCENT}1A`, borderTop: `1px solid ${ACCENT}50`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: '#A4C8FF', marginBottom: 3 }}>RUBRIC · v{version} · {score}/3</div>
          <div style={{ fontSize: 11.5, color: '#D4D4D4', lineHeight: 1.5 }}>{currentVerdict}</div>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {([
            ['Structured',    rubric.isStructured],
            ['Critical fact', rubric.hasCritical],
            ['In-scope',      rubric.inScope],
          ] as const).map(([label, ok]) => (
            <span key={label} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700,
              padding: '3px 9px', borderRadius: 4,
              background: ok ? 'rgba(155,185,85,0.18)' : 'rgba(244,135,113,0.14)',
              color: ok ? vsAddText : vsDelText,
              border: `1px solid ${ok ? 'rgba(155,185,85,0.5)' : 'rgba(244,135,113,0.4)'}`,
            }}>{ok ? '✓' : '✗'} {label}</span>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div style={{ background: '#007ACC', color: '#FFFFFF', padding: '3px 14px', fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: 14 }}>
        <span>⎇ main</span>
        <span>↥ {adds}  ↧ {dels}</span>
        <span style={{ marginLeft: 'auto' }}>Markdown</span>
        <span>UTF-8</span>
        <span>Ln {diff.length}, Col 1</span>
      </div>
    </div>
  );
};

// --- Track Meta ---

const TRACK_META: Record<GenAITrack, { label: string; introTitle: string; moduleContext: string }> = {
  'non-tech': {
    label: 'Workflow & Operator Track',
    introTitle: 'Prompt Engineering · Operator Lens',
    moduleContext: `GenAI Launchpad · Non-Tech Track · Pre-Read 02 · Prompt Engineering & LLM Foundations. Follows Rhea, an operations lead at Northstar Health, as she moves from inconsistent AI outputs to reliable, structured prompts — mastering prompt anatomy, few-shot examples, context management, model selection, and iterative refinement.`,
  },
  tech: {
    label: 'Tech Builder Track',
    introTitle: 'Prompt Engineering · Builder Lens',
    moduleContext: `GenAI Launchpad · Tech Track · Pre-Read 02 · Prompt Engineering & LLM Foundations. Follows Aarav, a platform engineer at Northstar Health, as he moves from unpredictable API responses to production-grade prompt engineering — covering system messages, response_format constraints, token budgets, model routing, and prompt versioning.`,
  },
};

// --- Left Nav ---

// --- Sidebar ---

// --- Main Content Component ---

function CoreContent({ track, completedSections = new Set<string>(), activeSection = null }: { track: GenAITrack; completedSections?: Set<string>; activeSection?: string | null }) {
  const nextSection = SECTIONS.find(s => !completedSections.has(s.id));
  const moduleContext = TRACK_META[track].moduleContext;


  return (
    <>
      {/* Module Hero */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '28px' }}>
      <div style={{ flex: 1, minWidth: 0, background: 'var(--ed-cream)', borderRadius: '14px', padding: '36px 36px 28px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-12px', top: '-8px', fontSize: '140px', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.05)`, fontFamily: "\'Lora\',\'Georgia\',serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>02</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "\'JetBrains Mono\', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '10px', textTransform: 'uppercase' as const }}>GenAI Launchpad · Pre-Read 02</div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.025em', color: 'var(--ed-ink)', marginBottom: '10px', fontFamily: "\'Lora\', Georgia, serif" }}>Getting the Model to Do What You Mean</h1>
          <p style={{ fontSize: '15px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "\'Lora\', Georgia, serif", marginBottom: '28px' }}>&ldquo;A prompt is a specification. Vague specs produce vague outputs.&rdquo;</p>
          <GenAIHeroCharacterStrip track={track} mentors={['anika', 'rohan', 'leela', 'kabir']} />
          <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '16px 20px', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${ACCENT}` }}>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '10px', textTransform: 'uppercase' as const }}>Learning Objectives</div>
            {[
              'Understand the five anatomy components of a reliable prompt',
              'Use zero-shot and few-shot examples to inject domain knowledge',
              'Manage context windows so critical information reaches the model',
              'Select models based on task complexity, volume, and cost',
              'Build an iterative refinement loop with version control and regression testing',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 4 ? '8px' : 0, alignItems: 'flex-start' }}>
                <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '11px', fontFamily: "\'JetBrains Mono\', monospace", marginTop: '2px' }}>0{i + 1}</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, width: '162px', paddingTop: '8px' }}>
        <div className="float3d" style={{ background: 'linear-gradient(145deg, #0F0A1E 0%, #1A0F2E 100%)', borderRadius: '14px', padding: '18px 16px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE 02</div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>Prompting the Model</div>
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

      <div style={{ marginBottom: '10px', padding: '16px 20px', borderRadius: '10px', background: track === 'tech' ? 'rgba(15,118,110,0.08)' : `rgba(${ACCENT_RGB},0.08)`, border: `1px solid ${track === 'tech' ? 'rgba(15,118,110,0.18)' : `rgba(${ACCENT_RGB},0.18)`}` }}>
        <div style={{ fontFamily: "\'JetBrains Mono\', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: track === 'tech' ? '#0F766E' : ACCENT, marginBottom: '8px' }}>{TRACK_META[track].label.toUpperCase()}</div>
        <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>{track === 'tech' ? "Your lens: how do you write prompts that behave like production code — predictable, testable, safe to iterate on?" : "Your lens: how do you translate a fuzzy operational requirement into a prompt that gives consistent, trustworthy outputs every time?"}</div>
      </div>

      <ChapterSection id="genai-m2-anatomy" num="01" accentRgb={ACCENT_RGB} first>
        {chLabel('Prompt Engineering & LLM Foundations')}
        {para(track === 'tech'
          ? "In Pre-Read 01, Aarav built the mental model: GenAI completes, it does not retrieve; tasks have zones; outputs are bounded by context quality. That foundation is necessary but not sufficient. The gap between knowing what a prompt should do and writing one that reliably does it is where most integrations fail. This pre-read goes inside the call — the system message, the few-shot examples, the context budget, the model choice, the versioning discipline. Each section is a lever Aarav can pull on the ticket classifier, the incident summariser, or any LLM call his team ships."
          : "In Pre-Read 01, Rhea built the mental model: the model generates, it does not look things up; tasks belong in zones; a vague brief gives the model permission to choose everything. That understanding changes how you think about AI failures. This pre-read is about what to actually do about them — how to write prompts that stop being inconsistent, how to teach the model your domain, how to manage what it can see, how to pick the right model, and how to change prompts without breaking what works."
        )}
        {h2("The Anatomy of a Prompt")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can write a system message and user message that specify all five anatomy components for any LLM call — and annotate which component each line is doing."
          : "\u25b6 After this section, you can write a complete, structured prompt for your most-used AI task, with role, format, and constraints all explicitly specified."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'non-tech'
            ? <>Rhea&apos;s first discharge summary prompt: &ldquo;Write a discharge summary for this patient.&rdquo; The outputs are wildly inconsistent &mdash; sometimes complete, sometimes missing critical medications. Her instinct is that the model is bad. Anika has a different diagnosis: the prompt is a vague brief.</>
            : <>Aarav&apos;s first API call for entity extraction: just the raw user message, no system prompt, no output format. The result is verbose, occasionally hallucinated, and unpredictable in structure. He runs it again with the same input and gets a different response. Rohan points to the missing output contract instead.</>}
        </SituationCard>
        {para(track === 'non-tech'
          ? "A prompt is not a question — it is a specification. When Rhea writes 'Write a discharge summary', she has specified nothing. The model fills every unspecified dimension with its own defaults: tone, length, what to include."
          : "Without a system message, the model has no persona, no role constraints, no output contract. It behaves like a general-purpose chatbot. Aarav's extraction task needs the model to behave like a structured API endpoint — that requires an explicit specification."
        )}
        {para(track === 'non-tech'
          ? "The five anatomy components: Role (who the model should act as), Task (what it needs to do), Context (what information to use), Format (how the output should be structured), Constraints (rules, tone, exclusions). Each component eliminates a dimension of variance."
          : "The five components map to API parameters: System Message (role, scope, instructions), User Message (specific task + input data), Context Payload, Response Format (JSON schema, markdown), Parameters (temperature, max_tokens). Together they define a deterministic contract."
        )}
        {pullQuote("A vague brief produces a vague output. The model is not failing — you are underspecifying.")}
        {track === 'non-tech' ? keyBox("What Rhea\u2019s discharge summary prompt looks like assembled", [
          'SYSTEM: You are a clinical documentation specialist at Northstar Health. Write in formal clinical register. Do not speculate beyond the information provided. If a field is missing from the record, write \u201cnot documented\u201d — do not infer.',
          'USER: Write a discharge summary for the patient below. Include these sections in order: (1) Primary diagnosis, (2) Medications prescribed — name, dose, and frequency for each, (3) Follow-up appointments with dates and department, (4) Restrictions or instructions. Maximum 200 words total.',
          '[Patient record inserted here]',
          '———',
          '\u2192 Role: \u201cclinical documentation specialist\u201d — anchors tone, register, and persona.',
          '\u2192 Constraint: \u201cdo not speculate\u201d — prevents the model filling in missing fields with plausible guesses.',
          '\u2192 Format: four numbered sections in a fixed order — eliminates structural variance across runs.',
          '\u2192 Length: 200-word cap — eliminates length variance.',
          '\u2192 Context: patient record is inserted at runtime, not typed manually each time.',
        ], ACCENT) : keyBox("What Aarav\u2019s entity extraction prompt looks like assembled", [
          'SYSTEM: You are a structured data extraction API. Return only valid JSON matching the schema below. Never include explanation, prose, or keys not in the schema.',
          'Schema: { "category": "hardware | software | network | access | other", "urgency": "low | medium | high", "callback_required": true | false, "summary": "<one sentence, max 20 words>" }',
          'USER: Extract the required fields from the support ticket below.',
          '[Ticket text inserted here]',
          '———',
          '\u2192 Role: \u201cstructured data extraction API\u201d — signals JSON-only output, no prose.',
          '\u2192 Output schema: defined explicitly — model cannot invent new fields or omit required ones.',
          '\u2192 Constraint: \u201cnever include explanation\u201d — prevents model adding context outside the JSON structure.',
          '\u2192 Enum values listed: model selects from defined options instead of generating free-form categories.',
          '\u2192 Context: ticket text inserted at runtime via placeholder.',
        ], ACCENT)}
        <PromptBuilderTool track={track} />
        <GenAIConversationScene
          mentor={track === 'non-tech' ? 'anika' : 'rohan'}
          track={track}
          accent={track === 'non-tech' ? '#7C3AED' : '#2563EB'}
          techLines={[
            { speaker: 'protagonist', text: "Entity extraction is returning incomplete JSON on about 1-in-4 calls. I\u2019ve been varying the phrasing." },
            { speaker: 'mentor', text: "Before you touch the phrasing — is the output schema defined anywhere in the system message?" },
            { speaker: 'protagonist', text: "It\u2019s in the user message as an instruction, not a formal schema." },
            { speaker: 'mentor', text: "An instruction leaves interpretation room. A schema doesn\u2019t. Define the output contract and the model stops guessing what to include." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "My discharge summaries vary wildly in tone. Sometimes clinical, sometimes conversational. I\u2019ve tried different phrasings." },
            { speaker: 'mentor', text: "Before reaching for a different model — what exactly is specified in your prompt, and what\u2019s left open?" },
            { speaker: 'protagonist', text: "I specify the task and the length. But not a role or a format." },
            { speaker: 'mentor', text: "Tone is one of the dimensions you left open. \u2018You are a clinical documentation specialist\u2019 at the top is the single highest-leverage change you can make." },
          ]}
        />
        <GenAIAvatar
          name={track === 'non-tech' ? 'Anika' : 'Rohan'}
          nameColor={track === 'non-tech' ? '#7C3AED' : '#2563EB'}
          borderColor={track === 'non-tech' ? '#7C3AED' : '#2563EB'}
          conceptId="genai-m2-anatomy"
          content={<>{track === 'non-tech' ? "Before reaching for a different model, ask: what exactly was specified, and what was left open?" : "Every prompt you write is an API contract. If you wouldn\u2019t ship an API without a response schema, don\u2019t ship a prompt without an output format."}</>}
          expandedContent={track === 'non-tech' ? "Consistency isn't a model capability — it's a prompt property. A well-specified prompt will outperform a vague prompt on a much stronger model." : "System messages are your configuration layer. Treat them with the same discipline as service configuration — version-controlled, reviewed, tested."}
          question={track === 'non-tech' ? "Rhea\u2019s discharge summaries vary wildly in tone. What single prompt change has the most impact?" : "Aarav\u2019s entity extraction returns incomplete JSON on 1 in 4 calls. Best targeted fix?"}
          options={track === 'non-tech' ? [
            { text: "Add \u2018use professional language\u2019 at the end of the prompt", correct: false, feedback: "Vague style instructions don\u2019t anchor tone — the model interprets them differently each run." },
            { text: "Open with \u2018You are a clinical documentation assistant\u2019", correct: true, feedback: "A role declaration anchors persona, tone, and vocabulary. It\u2019s the highest-leverage single change." },
            { text: "Add five example sentences showing the preferred tone", correct: false, feedback: "Examples help, but a role declaration is a higher-leverage starting point." },
            { text: "Use a more capable model that defaults to formal clinical register", correct: false, feedback: "Model capability doesn\u2019t determine register when no role is specified — a stronger model still defaults to its own judgment about tone. The role declaration is what anchors it." },
          ] : [
            { text: "Increase temperature to get more varied outputs to choose from", correct: false, feedback: "Higher temperature increases randomness — the opposite of what structured extraction needs." },
            { text: "Define the output schema in response_format or the system message", correct: true, feedback: "An explicit schema tells the model exactly what fields to populate, eliminating structural guesswork." },
            { text: "Add a retry loop to discard malformed responses", correct: false, feedback: "Retries treat the symptom, not the cause. Define the output contract instead." },
            { text: "Add more JSON examples to the user message to show the model the expected format", correct: false, feedback: "Examples reinforce the schema but don\u2019t replace it. Without a schema constraint, the model can still invent fields or omit required ones. Define the schema in the system message first." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Look at your last LLM API call. Which of the five anatomy components are missing? Add a system message with role + output format constraint and compare the output." : "Find a prompt your team uses that gives inconsistent results. Identify the missing anatomy components and add them one at a time."} />
        <QuizEngine
          conceptId="genai-m2-anatomy"
          conceptName="Prompt Anatomy"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m2-anatomy',
            question: QUIZZES[0].question[track],
            options: QUIZZES[0].options[track],
            correctIndex: QUIZZES[0].correctIndex[track],
            explanation: QUIZZES[0].explanation[track],
            keyInsight: QUIZZES[0].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav now has a structured prompt. But the model still lacks Northstar\u2019s domain knowledge. Next: how to transfer that knowledge without fine-tuning." : "Rhea\u2019s prompts are now structured. But the model still misclassifies her domain-specific insurance categories. Next: how to teach it her domain."} />
      </ChapterSection>

      <ChapterSection id="genai-m2-fewshot" num="02" accentRgb={ACCENT_RGB}>
        {chLabel('Zero-Shot vs Few-Shot')}
        {h2("Examples don\u2019t clarify — they transfer domain knowledge.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can identify which category in a classifier needs boundary examples, write those examples using a repeatable process, and know when to stop adding them."
          : "\u25b6 After this section, you can write a boundary example for your most-confused classification pair and explain why it works better than adding more clear-cut examples."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'non-tech'
            ? <>Rhea is classifying insurance exceptions using a zero-shot prompt. Accuracy is 68%. &ldquo;Pre-Authorization &mdash; Medical Necessity&rdquo; keeps miscategorising as &ldquo;Coverage Limit&rdquo; &mdash; a subtle distinction that matters operationally. Adding &ldquo;classify carefully&rdquo; changes nothing.</>
            : <>Aarav&rsquo;s IT ticket classifier runs at 70% accuracy. Network connectivity tickets involving VPN authentication failures keep routing to the wrong team. The categories exist in the prompt. The problem is the model has never seen Northstar&rsquo;s specific failure patterns.</>}
        </SituationCard>
        {para(track === 'non-tech'
          ? "Zero-shot prompting relies on the model's pre-trained knowledge. When your categories have internal meanings not aligned with general language use, the model has no way to learn the distinction from a label alone."
          : "The model's training data doesn't include Northstar's internal ticket taxonomy. Without domain-specific examples, it applies general IT knowledge. For a routing system, 'close' means misrouted tickets."
        )}
        {para(track === 'non-tech'
          ? "Three labeled examples of the ambiguous boundary — showing exactly what distinguishes a 'Pre-Authorization' denial from a 'Coverage Limit' denial in Northstar's context — can move accuracy from 68% to 91% with no other changes."
          : "Adding three to five labeled examples per problematic category transfers the classification logic directly. The model learns the boundary you care about, not the one it guessed."
        )}
        {keyBox('Two modes of example usage', [
          'Task exemplars: show the model a correct input-output pair for the whole task',
          'Boundary examples: show the model where hard-to-distinguish cases land',
          'Edge cases: show the model what should NOT be classified as a given label',
        ], '#0F766E')}
        {keyBox('How many examples, and when to stop', [
          'New domain category the model has never seen: start with 5 — 3 clear representative cases, 2 showing the boundaries of the category.',
          'Confused boundary (two classes the model keeps conflating): start with 3 examples that sit exactly on the line between them. Clear-cut examples of either class are not what the model needs.',
          'Already-working category: 1\u20132 task exemplars to anchor style and format. Do not keep adding.',
          'Stopping signal 1: run the updated prompt on 20 new inputs. If the confused category\u2019s accuracy has not improved by at least 10 percentage points, your examples are not targeting the right boundary — not the right quantity.',
          'Stopping signal 2: the misclassified cases shift to a different category pair. That is your next boundary to target. Stop adding to the current set.',
        ], '#0F766E')}
        {para(track === 'non-tech'
          ? "How Rhea wrote a boundary example for Pre-Authorization vs Coverage Limit: (1) She found a real exception request where the patient\u2019s procedure was medically required but not pre-authorised — the case that kept getting mis-labelled. (2) She wrote the input as a one-sentence description: \u2018Patient requires MRI for suspected disc herniation. Procedure is medically indicated but prior authorisation was not obtained.\u2019 (3) She labelled it explicitly: Pre-Authorization \u2013 Medical Necessity. (4) She added a note in the prompt: \u2018This is Pre-Authorization, not Coverage Limit — the procedure is covered but the approval step was missed.\u2019 That note is the boundary signal the model needs."
          : "How Aarav wrote a boundary example for VPN auth failure tickets: (1) He found a real ticket that kept routing to the wrong team — a VPN timeout that looked like a general network issue. (2) He wrote the input verbatim: \u2018User cannot connect to VPN from home network. Credentials valid. Connection times out after 30 seconds.\u2019 (3) He labelled it: Network \u2013 VPN Authentication. (4) He added a note: \u2018This is VPN Authentication, not General Network — credentials are valid, the failure is in the auth handshake, not the connection layer.\u2019 Three examples like this moved the routing accuracy for VPN tickets from 58% to 91%."
        )}
        <FewShotLabeler track={track} />
        <GenAIConversationScene
          mentor="kabir"
          track={track}
          accent="#0F766E"
          techLines={[
            { speaker: 'protagonist', text: "I added five examples per category. VPN auth failure tickets still route to the wrong team." },
            { speaker: 'mentor', text: "The question for each example isn\u2019t \u2018is it correct\u2019 — it\u2019s \u2018does it show the model the boundary it keeps getting wrong?\u2019" },
            { speaker: 'protagonist', text: "My examples are all clear-cut tickets. The VPN failures are the ambiguous edge cases." },
            { speaker: 'mentor', text: "Examples are most valuable exactly where the model\u2019s prior is weakest. You need boundary examples — showing where the ambiguous cases actually land." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "Slightly critical feedback keeps classifying as Neutral instead of Negative. I\u2019ve added more examples but it\u2019s not improving." },
            { speaker: 'mentor', text: "What kind of examples did you add — clear negatives or borderline cases?" },
            { speaker: 'protagonist', text: "Clear negatives. Obvious complaints." },
            { speaker: 'mentor', text: "The model already handles obvious negatives. Add one example of a near-neutral comment that should be Negative. That\u2019s the boundary it needs to see." },
          ]}
        />
        <GenAIAvatar
          name="Kabir"
          nameColor="#0F766E"
          borderColor="#0F766E"
          conceptId="genai-m2-fewshot"
          content={<>The question to ask about a few-shot example isn\u2019t \u201cis it correct?\u201d — it\u2019s \u201cdoes it show the model the boundary it keeps getting wrong?\u201d</>}
          expandedContent="Most teams add examples of the most common case. Classification errors almost always happen on the most ambiguous cases. Examples are most valuable where the model's prior is weakest."
          question={track === 'non-tech' ? "Slightly critical feedback keeps classifying as Neutral. What kind of example helps most?" : "Network tickets misclassify despite 5 examples. Most impactful fix?"}
          options={track === 'non-tech' ? [
            { text: "More clearly positive examples to anchor the Positive end", correct: false, feedback: "The unclear boundary is Neutral vs Negative — not Positive vs Neutral." },
            { text: "Borderline-negative examples explicitly labelled as Negative", correct: true, feedback: "Edge-case examples teach exactly where the ambiguous boundary sits." },
            { text: "A longer instruction explaining what Negative means", correct: false, feedback: "Instructions describe; examples demonstrate. For subtle boundaries, demonstration wins." },
            { text: "More clearly negative examples so the model learns the Negative category better", correct: false, feedback: "The model already handles obvious negatives correctly. More examples of what it already knows won\u2019t fix the boundary confusion — the mislabelling happens at the Neutral/Negative line, not in the clear-cut cases." },
          ] : [
            { text: "Fine-tune the model on Northstar\u2019s full ticket history", correct: false, feedback: "Fine-tuning is expensive and a last resort. More representative few-shot examples come first." },
            { text: "Add more varied examples covering different connectivity failure scenarios", correct: true, feedback: "Low accuracy with examples usually means they aren\u2019t representative of real-world variance." },
            { text: "Switch to a more powerful model and use the same examples", correct: false, feedback: "A stronger model won\u2019t compensate for unrepresentative examples — it\u2019ll just fail more confidently." },
            { text: "Remove the VPN Authentication category and merge it with General Network", correct: false, feedback: "Collapsing categories removes real operational distinctions — VPN auth failures and general network issues route to different teams for a reason. The fix is better examples, not fewer categories." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Find a classification endpoint. How many labeled examples per class? For the three most-confused categories, write one boundary example each and measure accuracy." : "Think of an AI task where your team has complained about wrong categories. Write three labeled examples for the most-confused category and add them to the prompt."} />
        <QuizEngine
          conceptId="genai-m2-fewshot"
          conceptName="Zero-Shot vs Few-Shot"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m2-fewshot',
            question: QUIZZES[1].question[track],
            options: QUIZZES[1].options[track],
            correctIndex: QUIZZES[1].correctIndex[track],
            explanation: QUIZZES[1].explanation[track],
            keyInsight: QUIZZES[1].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav has structured prompts and domain examples. But his chatbot forgets context after a few turns. Next: what actually reaches the model — and what gets silently dropped." : "Rhea\u2019s prompts are well-structured with the right examples. But her summarizer still misses a critical finding on page 7. Next: what the model can actually see."} />
      </ChapterSection>

      <ChapterSection id="genai-m2-context" num="03" accentRgb={ACCENT_RGB}>
        {chLabel('Context Window: What Goes In Matters')}
        {h2("The context window is a spotlight, not a searchlight.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can diagnose a context window failure from API logs and apply the correct fix — sliding window, front-loading, or periodic summarisation — to your specific situation."
          : "\u25b6 After this section, you can identify when a missed output was caused by context placement and restructure a prompt to front-load what the model must not miss."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'non-tech'
            ? <>Rhea feeds 10 pages of patient notes into her summarizer. The output is &ldquo;generally fine&rdquo; until a pharmacist flags a critical drug interaction on page 7 was not in the summary. The model processed the full document and still missed it. This is a context management problem.</>
            : <>Aarav&rsquo;s internal support chatbot forgets user instructions after 5&ndash;6 turns. He checks the API logs: the cumulative message history silently exceeds the model&rsquo;s 16k token limit. Older messages are dropped without any error.</>}
        </SituationCard>
        {para(track === 'non-tech'
          ? "LLMs process everything within a fixed context window. When content is long, attention distributes unevenly: information in the middle of a large context is systematically less likely to appear in the output — the 'lost in the middle' phenomenon."
          : "Every token in the API request counts toward the context window limit. Once that limit is reached, oldest content is silently truncated. The model never receives it, returns no error, and produces degraded outputs."
        )}
        {para(track === 'non-tech'
          ? "The fix isn\u2019t a bigger context window — it\u2019s intelligent pre-processing: extract critical flags first (adverse drug reactions, key diagnoses), place them at the beginning of the prompt, then include only the relevant sections."
          : "The fix is explicit context budget management: monitor prompt_tokens in the API response, implement a sliding window retaining only the most recent N turns, and periodically summarize older conversation into a compressed context block."
        )}
        <ContextWindowInspector track={track} />
        <GenAIConversationScene
          mentor="anika"
          track={track}
          accent="#7C3AED"
          techLines={[
            { speaker: 'protagonist', text: "The chatbot loses context after 5\u20136 turns. I\u2019m looking at upgrading to a model with a larger context window." },
            { speaker: 'mentor', text: "Check your API response logs first. What\u2019s the prompt_tokens count at the point it starts forgetting?" },
            { speaker: 'protagonist', text: "It\u2019s maxing out. The cumulative message history hits the limit silently — no error, just truncation." },
            { speaker: 'mentor', text: "A bigger window delays the problem. A sliding window or periodic summarization solves it. The model can only use what\u2019s in front of it — old messages that were truncated are gone." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "My summarizer processed all 10 pages of patient notes. The critical drug interaction on page 7 isn\u2019t in the output." },
            { speaker: 'mentor', text: "Where did you place the most critical information in the prompt — beginning, middle, or end?" },
            { speaker: 'protagonist', text: "Original document order. Page 7 of 10, so the middle." },
            { speaker: 'mentor', text: "Attention distributes unevenly in long contexts — information in the middle is systematically under-represented. Front-load what matters most." },
          ]}
        />
        <GenAIAvatar
          name="Anika"
          nameColor="#7C3AED"
          borderColor="#7C3AED"
          conceptId="genai-m2-context"
          content={<>The model can only use what\u2019s in front of it. If the most critical information is buried in the middle of a large context, it has the same effect as if you never included it.</>}
          expandedContent="Researchers have documented the 'lost in the middle' effect: critical information in the middle of a long context has lower retrieval accuracy than information at the start or end. Front-load what matters most."
          question={track === 'non-tech' ? "Rhea\u2019s summarizer misses a critical drug reaction buried on page 7 of 10. Best fix?" : "Aarav\u2019s chatbot forgets instructions after 6 turns. Root cause?"}
          options={track === 'non-tech' ? [
            { text: "Request a model with a larger context window", correct: false, feedback: "A bigger window doesn\u2019t fix \u2018lost in the middle\u2019 — it can make it worse by adding more surrounding filler." },
            { text: "Pre-extract critical flags and place them at the top of the prompt", correct: true, feedback: "The model prioritizes context at the start. Front-loading critical information ensures it\u2019s seen and included." },
            { text: "Break the document into chunks and summarize each separately", correct: false, feedback: "Chunking can fragment relationships across sections and may miss the critical finding entirely." },
            { text: "Ask the model to re-read the document from page 7 in a follow-up prompt", correct: false, feedback: "Each API call is stateless — there is no document the model has from a previous turn. The only way to ensure critical information is attended to is to front-load it in the same prompt." },
          ] : [
            { text: "Model weights decay during long sessions, losing earlier instructions", correct: false, feedback: "Model weights don\u2019t change during inference. The context window is the only memory in a session." },
            { text: "Cumulative chat history silently exceeds the token limit, dropping old messages", correct: true, feedback: "Once the context window fills, oldest content is truncated with no error. Monitor prompt_tokens in API responses." },
            { text: "System message instructions get overridden by user messages over time", correct: false, feedback: "System messages persist but still consume tokens. The issue is budget exhaustion, not override logic." },
            { text: "The model deprioritizes earlier turns as conversation length grows", correct: false, feedback: "The model doesn\u2019t deprioritize — it truncates. When the context limit is reached, oldest messages are dropped entirely, not down-weighted. They simply don\u2019t exist in the next API call." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Check your most-used LLM call\u2019s token count in the API response. Where is the critical information in the prompt? What would happen if you moved it to the top?" : "Think of an AI summary that missed something important. Where was that information in the source document? What would pre-extraction have looked like?"} />
        <QuizEngine
          conceptId="genai-m2-context"
          conceptName="Context Window"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m2-context',
            question: QUIZZES[2].question[track],
            options: QUIZZES[2].options[track],
            correctIndex: QUIZZES[2].correctIndex[track],
            explanation: QUIZZES[2].explanation[track],
            keyInsight: QUIZZES[2].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav\u2019s prompts are structured, domain-aware, and context-managed. Now he\u2019s running $12k/month on GPT-4o for tasks that don\u2019t need it. Next: how to select the right model for each task." : "Rhea\u2019s prompts are working reliably. Now Anika asks: is she using the right model for each task, or paying for capability she doesn\u2019t need?"} />
      </ChapterSection>

      <ChapterSection id="genai-m2-models" num="04" accentRgb={ACCENT_RGB}>
        {chLabel('Model Selection & Cost')}
        {h2("The best model for a task is the smallest one that meets the quality bar.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can define a quality bar for a task, run a structured 20-input evaluation, and make a cost-justified routing decision between model tiers."
          : "\u25b6 After this section, you can define what \u2018good enough\u2019 means for a specific task, test a cheaper model against that bar, and decide whether hybrid routing makes sense for your workflow."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'non-tech'
            ? <>Rhea assumes GPT-4o is right for everything. She runs it on 200 intake form summaries per day and 5 complex referral letters. Anika points out that for structured summarization at high volume, Claude Haiku produces nearly identical quality at a fraction of the cost.</>
            : <>Aarav\u2019s ticket classifier costs $12,000/month on GPT-4o. Rohan flags this as unsustainable. The task is classification with 7 categories and 5 few-shot examples per category. It doesn\u2019t require frontier reasoning.</>}
        </SituationCard>
        {para(track === 'non-tech'
          ? "Model selection is a cost-quality tradeoff. GPT-4o excels at complex reasoning and nuanced writing. For Rhea\u2019s structured intake summaries — consistent inputs producing bulleted outputs — a smaller model delivers the same quality at 20\u00d7 lower cost."
          : "Model capability scales with cost, but not linearly. For classification with clear categories and domain examples, the performance delta between GPT-4o and Claude Haiku is small. The cost delta is not. A hybrid strategy is almost always the right architecture."
        )}
        {para(track === 'non-tech'
          ? "GPT-4o is for frontier reasoning: open-ended generation, multi-step analysis, tasks where quality variance has high consequences. For structured, high-volume language tasks with clear success criteria, a smaller model is the engineering-correct choice."
          : "Aarav\u2019s team finds Haiku achieves 92% accuracy vs GPT-4o\u2019s 95% at 1/20th the cost. Hybrid: route clear-cut tickets to Haiku, ambiguous ones to GPT-4o. Result: effective 94.7% accuracy at $2.4k/month."
        )}
        <ModelSelectorTool track={track} />
        <GenAIConversationScene
          mentor="kabir"
          track={track}
          accent="#0F766E"
          techLines={[
            { speaker: 'protagonist', text: "I want to evaluate which model to use for the ticket classifier. Should I start with the most capable and work down?" },
            { speaker: 'mentor', text: "Wrong direction. Define the minimum quality bar first. Then find the cheapest model that clears it." },
            { speaker: 'protagonist', text: "For the ticket classifier — consistent categorization across 7 classes, with domain examples provided." },
            { speaker: 'mentor', text: "That doesn\u2019t require frontier reasoning. You\u2019re spending GPT-4o rates on a task a smaller model handles at 95% accuracy for a fraction of the cost." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "I\u2019ve been using GPT-4o for everything — 200 high-volume intake summaries and 5 complex referral letters per day." },
            { speaker: 'mentor', text: "Before choosing a model, what\u2019s the minimum quality bar for each task separately?" },
            { speaker: 'protagonist', text: "Intake summaries just need structured bullets. Referrals need nuanced clinical reasoning." },
            { speaker: 'mentor', text: "Those are two different bars. A smaller model clears the intake bar at 20\u00d7 lower cost. Save GPT-4o for the referrals." },
          ]}
        />
        <GenAIAvatar
          name="Kabir"
          nameColor="#0F766E"
          borderColor="#0F766E"
          conceptId="genai-m2-models"
          content={<>Define the minimum quality bar first. Then find the cheapest model that clears it — never start from the top down.</>}
          expandedContent="'What\u2019s the best model?' is the wrong question. 'What\u2019s the minimum capability required?' is the right one. This leads to hybrid architectures that are both cost-efficient and reliable."
          question={track === 'non-tech' ? "Rhea has 200 structured summaries/day and 5 complex referrals/day. Best model strategy?" : "Daily reports at 100/day (medium complexity) and weekly insights at 5/week (high complexity). Budget is tight. Best strategy?"}
          options={track === 'non-tech' ? [
            { text: "GPT-4o for everything — quality matters most in healthcare", correct: false, feedback: "GPT-4o at 200/day is expensive overkill for structured summarization. Quality gaps are marginal; cost gaps are not." },
            { text: "Haiku for high-volume summaries, GPT-4o for complex referrals", correct: true, feedback: "Match model capability to task complexity. Small models at scale, frontier models for irreducible complexity." },
            { text: "Gemini Flash for everything — it\u2019s the cheapest per token", correct: false, feedback: "Cheapest per token isn\u2019t always cheapest overall. Complex referrals may need multiple retries on a weaker model." },
            { text: "Start with the smallest model for everything and upgrade only if quality fails", correct: false, feedback: "Starting from the bottom risks deploying an inadequate model on complex referrals before you\u2019ve established the quality bar. Define the bar per task first, then find the cheapest model that clears it." },
          ] : [
            { text: "GPT-4o for both to ensure consistent quality", correct: false, feedback: "Running GPT-4o on 100 daily medium-complexity reports is ~10\u00d7 more expensive than necessary." },
            { text: "GPT-3.5-turbo or Haiku for daily reports, GPT-4o for weekly insights", correct: true, feedback: "Hybrid routing optimizes cost per task tier. Most savings come from the high-volume medium-complexity work." },
            { text: "Haiku for both to minimize total monthly cost", correct: false, feedback: "Haiku may underperform on high-complexity weekly insights where multi-step reasoning is required." },
            { text: "Run a cost analysis and use whatever model the budget allows", correct: false, feedback: "Budget constraints shape the decision, but they don\u2019t replace the quality bar. If a cheaper model doesn\u2019t clear the bar for your high-complexity task, using it because it\u2019s affordable produces unacceptable outputs at any price." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Map your team\u2019s LLM API calls by volume and task complexity. Which high-volume calls could move to a smaller model? Estimate the monthly cost difference." : "List two AI tasks your team uses. Look up cost per 1M tokens for the current model vs the tier below. What\u2019s the monthly delta at your current volume?"} />
        {track === 'tech' ? keyBox('How to actually find where the quality bar sits', [
          '1. Pull 20 representative inputs from your real task — not hand-picked examples, but a random sample including messy, ambiguous, and edge-case inputs.',
          '2. Define a pass/fail rubric for each input before you run any model. For classification: correct label. For extraction: all required fields present and correctly typed. For summarisation: must include X, must not include Y. Write it down first — do not judge outputs by feel.',
          '3. Run all 20 inputs through the candidate smaller model (e.g. Haiku or GPT-3.5-turbo) and your current model. Score each output against the rubric.',
          '4. Compare the failure cases — not the accuracy number. Where does the smaller model fail? Are those failures on critical inputs or edge cases you can handle separately?',
          '5. If the smaller model passes your rubric on 18/20 and the 2 failures are low-stakes or rare: it clears the bar. Route those inputs to the smaller model. Send the 2 failure patterns to the frontier model.',
          'Cost check: (volume × cost_per_token_small) + (failure_rate × volume × cost_per_token_frontier). That number vs your current bill is the real decision.',
        ], ACCENT) : keyBox('How to test whether a smaller model meets your quality bar', [
          '1. Pick one task (start with your highest-volume one — that is where the cost saving is largest).',
          '2. Collect 15\u201320 real outputs from that task that you already know are correct. These are your quality benchmark.',
          '3. Run the same inputs through a cheaper model tier. Review each output side by side with your benchmark.',
          '4. Define your bar before you look: for intake summaries, the bar might be \u201call required fields present, no invented information, tone appropriate for clinical handover.\u201d Write that down first.',
          '5. Count how many outputs from the cheaper model pass that bar without any editing. If it is 17 out of 20, the bar is cleared for routine cases. Route complex cases (referral letters, anything requiring clinical reasoning) to the frontier model.',
          'The question is not \u201cis the cheaper model as good?\u201d — it is \u201cdoes it clear the minimum bar for this specific task?\u201d Those are different questions with different answers.',
        ], ACCENT)}
        <QuizEngine
          conceptId="genai-m2-models"
          conceptName="Model Selection"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m2-models',
            question: QUIZZES[3].question[track],
            options: QUIZZES[3].options[track],
            correctIndex: QUIZZES[3].correctIndex[track],
            explanation: QUIZZES[3].explanation[track],
            keyInsight: QUIZZES[3].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav has structure, examples, context management, and model routing. But prompt changes are unversioned. The last question: how to iterate safely." : "Rhea has reliable prompts for every task tier. But she\u2019s been making changes by trial and error with no way to detect regressions. Last question: how to improve without breaking what works."} />
      </ChapterSection>

      <ChapterSection id="genai-m2-refine" num="05" accentRgb={ACCENT_RGB}>
        {chLabel('The Refinement Loop')}
        {h2("Prompts are code. They need versioning, testing, and regression checks.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can set up a minimal prompt versioning workflow — git directory, golden dataset, eval script, promotion rule — before shipping any prompt change to production."
          : "\u25b6 After this section, you can maintain a version log and golden cases sheet that would have caught the V1\u2192V3 compliance regression before it reached production."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'non-tech'
            ? <>Rhea has improved her discharge summary prompt across three versions. V3 is more concise. But a compliance auditor flags a legal disclaimer always present in V1 is now missing. She has no record of what changed and no way to know which edit caused the regression.</>
            : <>Aarav deploys a prompt update (V2) that improves summary quality for most cases. Two days later, a team lead flags edge-case incident reports are missing the resolution step. No golden dataset, no version diff, no automated way to detect this regression before production.</>}
        </SituationCard>
        {para(track === 'non-tech'
          ? "A prompt is a living document governing critical outputs. When you change it without tracking what changed, you\u2019re deploying code without version control. The first time you introduce a regression that reaches a patient or regulator, the absence of a refinement loop becomes a liability."
          : "Prompt engineering without a testing framework is technical debt at the application layer. Every untracked change is a potential regression. Production AI systems need the same discipline as production code."
        )}
        {para(track === 'non-tech'
          ? "Rhea\u2019s refinement loop: store each version with a changelog. Maintain 'golden cases' — inputs where you know exactly what the correct output looks like. Before replacing V2 with V3, verify V3 passes all golden cases."
          : "Aarav\u2019s workflow: store prompts in a prompts/ directory in git. Build a golden dataset of 50\u2013100 labeled examples covering normal cases, edge cases, and previously seen failures. Automate evaluation on every PR."
        )}
        {track === 'non-tech' ? keyBox('What Rhea\u2019s minimal refinement loop looks like in practice', [
          'Version doc: one shared Google Doc with a simple table — columns: Version, Date, What changed, Why. One row per edit. Takes two minutes to fill in.',
          'Golden cases sheet: a separate spreadsheet with 10\u201315 rows. Each row: the input text, what the output MUST include, what it must NOT include. Start with the cases that have failed or been flagged before.',
          'Before replacing V2 with V3: paste each golden case input into the new prompt and check the output against the \u201cmust include / must not include\u201d columns manually. Flag any row where V3 fails something V2 passed.',
          'Promotion rule: if V3 fails even one compliance-critical golden case (missing disclaimer, wrong section, wrong tone), do not ship it. Fix the regression first.',
          'This is not a heavy process — 10 golden cases takes about 20 minutes to check. The V1\u2192V3 disclaimer regression would have been caught in the first row.',
        ], '#DB2777') : keyBox('What Aarav\u2019s minimal refinement loop looks like in practice', [
          'prompts/ directory in git: one .txt or .md file per prompt, named by use case (e.g. incident_summariser_v3.txt). Commit message must state what changed and why — not just \u201cupdate prompt\u201d.',
          'golden_dataset.jsonl: 50\u2013100 examples in JSON Lines format. Each entry has an input and expected output fields (or must_include / must_not_include for open-ended tasks). Cover normal cases, known edge cases, and every failure mode seen in production.',
          'eval.py: a script that loads the current prompt, runs each golden case through the model, and prints pass/fail per row plus overall accuracy per category. Run it locally before opening a PR.',
          'Promotion rule: a new prompt version ships only if eval accuracy is equal to or better than the previous version on every category — not just overall. An improvement in Category A that causes a regression in Category B does not pass.',
          'The V2 regression (missing resolution step in edge-case reports) would have appeared as a failing row in eval.py before it ever reached production.',
        ], '#DB2777')}
        {pullQuote("You cannot improve a prompt safely without knowing what it does consistently right.")}
        <PromptDiffViewer track={track} />
        <GenAIConversationScene
          mentor="leela"
          track={track}
          accent="#C2410C"
          techLines={[
            { speaker: 'protagonist', text: "V2 improved summary quality for most cases but introduced a regression — edge-case incident reports are missing the resolution step." },
            { speaker: 'mentor', text: "Every prompt change is a hypothesis. Before you ship V3, what would tell you V3 doesn\u2019t introduce the same regression?" },
            { speaker: 'protagonist', text: "I need a golden dataset — normal cases, edge cases, and the specific failure mode from V2." },
            { speaker: 'mentor', text: "Run V3 against that dataset before it touches production. An undocumented prompt change that removes a safety instruction is indistinguishable from a silent code change." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "V3 is more concise. Then the compliance auditor found the legal disclaimer is missing — it was always in V1." },
            { speaker: 'mentor', text: "Every prompt change is a hypothesis. What should you have tested before replacing V2?" },
            { speaker: 'protagonist', text: "I need golden cases — inputs where I know exactly what the correct output should include." },
            { speaker: 'mentor', text: "The disclaimer wasn\u2019t an accident — it was a requirement you stopped enforcing. Verify compliance-critical outputs before any version goes live." },
          ]}
        />
        <GenAIAvatar
          name="Leela"
          nameColor="#C2410C"
          borderColor="#C2410C"
          conceptId="genai-m2-refine"
          content={<>Every prompt change is a hypothesis. You need to know what it might break, not just what it might improve.</>}
          expandedContent="From a compliance perspective, an undocumented prompt change that removes a safety instruction is indistinguishable from a silent code change that introduces a compliance violation. Treat prompts with the same governance as any production artifact."
          question={track === 'non-tech' ? "V3 consent form prompt omits a legal disclaimer that V1 always included. Next step?" : "V2 improved summaries for most cases but introduced edge-case regressions. Before shipping V3, what\u2019s critical?"}
          options={track === 'non-tech' ? [
            { text: "Revert to V1 — safety and compliance take precedence", correct: false, feedback: "Reverting discards valid improvements. Diagnose the specific change that caused the regression and fix it surgically." },
            { text: "Diff V1 and V3, identify what dropped the disclaimer, add an explicit constraint", correct: true, feedback: "Systematic comparison lets you preserve the improvement while restoring the requirement. That\u2019s the refinement loop." },
            { text: "Ask legal to simplify the disclaimer to fit the concise format", correct: false, feedback: "That changes the requirement, not the prompt. The problem is prompt regression." },
            { text: "Ship V3 and add a manual review step specifically for disclaimer presence", correct: false, feedback: "Adding post-hoc review for a known regression is the wrong direction. Find and fix the regression in the prompt, verify it passes all golden cases, then ship. Review is for unknown failures — not ones you\u2019ve already identified." },
          ] : [
            { text: "A/B test V3 with 10% of production traffic", correct: false, feedback: "Production A/B testing is risky when regressions are already known. Verify against a golden dataset first." },
            { text: "Run V3 against the golden dataset and compare metrics against V1 and V2", correct: true, feedback: "A golden dataset is your regression test suite for prompts. No deployment without it." },
            { text: "Manually review 10\u201320 outputs and use judgment", correct: false, feedback: "Manual spot-checks miss systematic failures. A golden dataset scales verification beyond human review." },
            { text: "Ask the team lead who flagged the regression to validate V3 outputs manually", correct: false, feedback: "Human spot-checking is valuable but doesn\u2019t catch failures that only appear under specific input patterns. The golden dataset exists precisely because a handful of manually reviewed cases can miss the failure mode entirely." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Does your team have a golden dataset for your most-used prompt? If not, identify 20 representative test cases and store them with expected outputs — that\u2019s your regression baseline." : "Think of the last time an AI tool gave different outputs from before. What would a golden case set look like for that task? Write down 5 representative inputs and expected outputs."} />
        <QuizEngine
          conceptId="genai-m2-refine"
          conceptName="Refinement Loop"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m2-refine',
            question: QUIZZES[4].question[track],
            options: QUIZZES[4].options[track],
            correctIndex: QUIZZES[4].correctIndex[track],
            explanation: QUIZZES[4].explanation[track],
            keyInsight: QUIZZES[4].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav now has the full prompt engineering stack. Pre-Read 03 is about a harder problem — his prompts are right but analysts still don't trust the outputs. The issue isn't prompting. It's what goes into the pipeline before the prompt ever runs." : "Rhea has reliable, structured prompts for every task tier. Pre-Read 03 is about a problem prompting alone can't fix — her AI outputs look complete but miss critical context. The issue isn't how she asks. It's what she's asking the model to read."} />
      </ChapterSection>
    </>
  );
}

// --- Default Export ---

interface Props {
  track: GenAITrack;
  onBack: () => void;
  onNext?: () => void;
  nextLabel?: string;
}

export default function GenAIPreRead2({ track, onBack, onNext, nextLabel }: Props) {
  const completionMessage = track === 'tech'
    ? 'You now have the core prompt engineering toolkit: anatomy, few-shot transfer, context budgeting, model routing, and safe iteration with regression testing.'
    : 'You now know how to write prompts that work reliably: structured anatomy, domain examples, context management, the right model, and a safe refinement process.';
  return (
    <GenAIPreReadLayout
      moduleNum="02" moduleLabel={TRACK_META[track].introTitle}
      accent={ACCENT} accentRgb={ACCENT_RGB}
      sections={SECTIONS} badges={BADGES} concepts={CONCEPTS}
      completionEmoji="◎" completionMessage={completionMessage} onBack={onBack} onNext={onNext} nextLabel={nextLabel}
    >
      <CoreContent track={track} />
    </GenAIPreReadLayout>
  );
}

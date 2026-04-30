'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import QuizEngine from './QuizEngine';
import GenAIAvatar, { GenAIMentorFace, GenAIConversationScene, AaravFace, RheaFace } from './GenAIAvatar';
import type { GenAIMentorId } from './GenAIAvatar';
import type { GenAITrack } from './genaiTypes';
import {
  ApplyItBox,
  ChapterSection,
  NextChapterTeaser,
  PMPrincipleBox,
  SituationCard,
  TiltCard,
  chLabel,
  h2,
  keyBox,
  para,
  pullQuote,
} from './pm-fundamentals/designSystem';
import { AirtribeLogo, DarkModeToggle } from './AirtribeBrand';

const ACCENT = '#7C3AED';
const ACCENT_RGB = '124,58,237';
const TRACK_META: Record<GenAITrack, { label: string; shortLabel: string; introTitle: string; moduleContext: string }> = {
  'non-tech': {
    label: 'Workflow & Operator Track',
    shortLabel: 'Non-Tech',
    introTitle: 'Introduction to GenAI · Operator Lens',
    moduleContext: `GenAI Launchpad · Non-Tech Track · Pre-Read 01 · Introduction to Generative AI.
Follows Rhea, an operations lead at Northstar Health, as she moves from confused AI experiments to a clear mental model for what GenAI is, what it reliably does, and how to select a first use case worth building.`,
  },
  tech: {
    label: 'Tech Builder Track',
    shortLabel: 'Tech',
    introTitle: 'Introduction to GenAI · Builder Lens',
    moduleContext: `GenAI Launchpad · Tech Track · Pre-Read 01 · Introduction to Generative AI.
Follows Aarav, a platform engineer at Northstar Health, as he moves from a vague integration ticket to a clear framework for evaluating LLM use cases, understanding capability zones, and selecting the right first candidate.`,
  },
};


const QUIZZES = [
  {
    question: "AI keeps returning wrong policy details. A colleague says the model is too weak. What is the stronger first response?",
    options: [
      'A. Agree — policy tasks need a stronger model trained on recent data',
      'B. Check what context was sent and whether retrieval was part of the design',
      'C. Write much longer prompts with the full policy text pasted inline each time',
      'D. Run the prompt on three different models and use the most consistent answer',
    ],
    correctIndex: 1,
    explanation: 'Policy details require specific, current information the model cannot hold in weights. The fix is a retrieval layer — not a stronger model. Stronger models hallucinate policy details just as confidently.',
    conceptId: 'genai-m1-what-it-is',
    keyInsight: 'The model completes. It does not retrieve. These are different failure modes with different fixes.',
  },
  {
    question: 'Which task belongs in the reliable zone without a retrieval layer?',
    options: [
      'A. Check whether each exception was resolved within the 48-hour SLA window',
      'B. Classify inbound requests by type based on their description',
      'C. Pull and summarise the last 20 unread emails automatically',
      'D. Look up the current premium rate for a given policy and coverage tier',
    ],
    correctIndex: 1,
    explanation: 'Classification from a description with defined categories is a language task — no external data needed. The others require live system access the model does not have.',
    conceptId: 'genai-m1-capabilities',
    keyInsight: 'Reliable zone = language in, language out, no live data required. Everything else needs retrieval infrastructure.',
  },
  {
    question: 'A summarisation task gives excellent output sometimes and generic output other times. Most likely cause?',
    options: [
      'A. The model is non-deterministic and high variance is a fundamental limitation',
      'B. The brief is missing format or length constraints',
      'C. The prompt needs more examples to anchor the style and register',
      'D. The model is degrading — retraining on domain data would stabilise it',
    ],
    correctIndex: 1,
    explanation: 'When format, length, and structure are unspecified, the model fills those gaps differently each run. Defining them tightens variance dramatically without any model changes.',
    conceptId: 'genai-m1-mental-model',
    keyInsight: 'Variance almost always signals an underspecified brief, not a broken model.',
  },
  {
    question: 'A model works well in demo but produces poor outputs in staging. First thing to investigate?',
    options: [
      'A. Whether model drift has occurred between the demo and staging environments',
      'B. Whether the context in staging is as complete and clean as in the demo',
      'C. Whether the prompt template is rendering differently across environments',
      'D. Whether a higher-tier model is needed to handle real production edge cases',
    ],
    correctIndex: 1,
    explanation: 'Demo data is curated to be clean. Staging data is real — missing fields, truncated text, edge cases. That difference in context quality almost always explains the output quality gap.',
    conceptId: 'genai-m1-context',
    keyInsight: 'Demo-to-production gaps are a context problem. The payload is the first thing to inspect.',
  },
  {
    question: 'Which candidate makes the best first AI use case?',
    options: [
      'A. Auto-approve routine policy exceptions to cut manual review time significantly',
      'B. Classify inbound requests and flag uncertain cases for human review',
      'C. Migrate the case management system to a fully autonomous AI agent pipeline',
      'D. Generate and send personalised customer emails with async human spot-checks',
    ],
    correctIndex: 1,
    explanation: 'Classification with a review gate is bounded, language-based, easy to verify, and recoverable. The others involve irreversibility, high stakes, or scope that outpaces what the system has earned.',
    conceptId: 'genai-m1-use-case-readiness',
    keyInsight: 'Win clearly, verify easily, fail cheaply. That is the brief for the first use case.',
  },
];

const CONCEPTS = [
  { id: 'genai-m1-what-it-is', label: 'What GenAI Is', color: '#7C3AED' },
  { id: 'genai-m1-capabilities', label: 'Capability Map', color: '#2563EB' },
  { id: 'genai-m1-mental-model', label: 'Mental Model', color: '#0F766E' },
  { id: 'genai-m1-context', label: 'Context as Input', color: '#C2410C' },
  { id: 'genai-m1-use-case-readiness', label: 'Use-Case Readiness', color: '#DC2626' },
];
const SECTIONS = [
  { id: 'genai-m1-whatitis', label: 'What Is This Thing?' },
  { id: 'genai-m1-capabilities', label: 'The Capability Map' },
  { id: 'genai-m1-mental-model', label: 'The Mental Model Shift' },
  { id: 'genai-m1-context', label: 'Context Is the Input' },
  { id: 'genai-m1-apply', label: 'Your First Use Case' },
];
const BADGES = [
  { id: 'genai-m1-whatitis', icon: 'AI', label: 'Model', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'genai-m1-capabilities', icon: 'CP', label: 'Capability', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'genai-m1-mental-model', icon: 'MM', label: 'Mindset', color: '#0F766E', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'genai-m1-context', icon: 'CX', label: 'Context', color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
  { id: 'genai-m1-apply', icon: 'UC', label: 'Use Case', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
];
const SECTION_XP = 50;
const QUIZ_XP = 100;

// AirtribeLogo imported from AirtribeBrand.tsx

function computeXP(completedSections: Set<string>, conceptStates: Record<string, { pKnow: number }>) {
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = Object.values(conceptStates).reduce((sum, state) => sum + Math.round(state.pKnow * QUIZ_XP), 0);
  return { readingXP, quizXP, total: readingXP + quizXP };
}

function getLevel(total: number) {
  if (total >= 600) return { label: 'Builder', color: '#7C3AED', min: 600 };
  if (total >= 350) return { label: 'Operator', color: '#2563EB', min: 350 };
  if (total >= 150) return { label: 'Explorer', color: '#0F766E', min: 150 };
  return { label: 'Curious', color: 'var(--ed-ink3)', min: 0 };
}

function getNextLevel(total: number) {
  if (total < 150) return { label: 'Explorer', min: 150 };
  if (total < 350) return { label: 'Operator', min: 350 };
  if (total < 600) return { label: 'Builder', min: 600 };
  return null;
}

function LeftNav({ completedSections, activeSection, track }: { completedSections: Set<string>; activeSection: string | null; track: GenAITrack }) {
  const donePct = Math.round((completedSections.size / SECTIONS.length) * 100);
  return (
    <aside style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '18px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--ed-rule)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ed-ink3)', marginBottom: '8px' }}>Contents</div>
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
                style={{ display: 'flex', alignItems: 'baseline', gap: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', textAlign: 'left', borderLeft: active ? `2px solid ${ACCENT}` : '2px solid transparent', paddingLeft: '8px', marginLeft: '-8px' }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: done || active ? ACCENT : 'var(--ed-rule)', minWidth: '20px' }}>{String(idx + 1).padStart(2, '0')}.</span>
                <span style={{ fontSize: '12px', fontWeight: active ? 600 : 400, color: done ? 'var(--ed-ink2)' : active ? 'var(--ed-ink)' : 'var(--ed-ink3)', lineHeight: 1.4 }}>{section.label}{done ? ' ✓' : ''}</span>
              </motion.button>
            );
          })}
        </nav>
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--ed-rule)', fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>
          Week 0 pre-read · {TRACK_META[track].label}
        </div>
      </div>
    </aside>
  );
}

function Sidebar({ completedSections, progressPct, prevXp }: { completedSections: Set<string>; progressPct: number; prevXp: number }) {
  const store = useLearnerStore();
  const xp = computeXP(completedSections, store.conceptStates);
  const total = xp.total;
  const level = getLevel(total);
  const nextLevel = getNextLevel(total);
  const levelPct = nextLevel ? Math.round(((total - level.min) / (nextLevel.min - level.min)) * 100) : 100;
  const [showGain, setShowGain] = useState(false);
  const [gainAmt, setGainAmt] = useState(0);
  const gainRef = useRef(prevXp);

  useEffect(() => {
    const diff = total - gainRef.current;
    if (diff > 0) {
      setGainAmt(diff);
      setShowGain(true);
      gainRef.current = total;
      const timer = setTimeout(() => setShowGain(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [total]);

  return (
    <aside style={{ position: 'sticky', top: '80px', alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderTop: `3px solid ${ACCENT}`, borderRadius: '10px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ed-ink3)', marginBottom: '2px' }}>Level</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: level.color }}>{level.label}</div>
          </div>
          <div style={{ textAlign: 'right', position: 'relative' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ed-ink3)', marginBottom: '2px' }}>XP</div>
            <motion.div key={total} animate={{ scale: [1.12, 1] }} transition={{ duration: 0.25 }} style={{ fontSize: '22px', fontWeight: 900, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{total}</motion.div>
            <AnimatePresence>{showGain ? <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -20 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} style={{ position: 'absolute', right: 0, top: '-6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: '#0D7A5A' }}>+{gainAmt}</motion.div> : null}</AnimatePresence>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          <div style={{ flex: 1, padding: '5px 8px', borderRadius: '5px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
            <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', marginBottom: '2px', textTransform: 'uppercase' }}>Reading</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: ACCENT }}>{xp.readingXP} xp</div>
          </div>
          <div style={{ flex: 1, padding: '5px 8px', borderRadius: '5px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
            <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', marginBottom: '2px', textTransform: 'uppercase' }}>Quizzes</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0D7A5A' }}>{xp.quizXP} xp</div>
          </div>
        </div>
        {nextLevel ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{levelPct}% to {nextLevel.label}</span>
              <span style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{nextLevel.min - total} xp</span>
            </div>
            <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${levelPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: ACCENT, borderRadius: '2px' }} />
            </div>
          </>
        ) : <div style={{ fontSize: '11px', color: ACCENT, fontWeight: 700 }}>✦ Max level reached</div>}
      </div>

      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)' }}>Module Progress</div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: ACCENT }}>{progressPct}%</span>
        </div>
        <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: ACCENT, borderRadius: '2px' }} />
        </div>
        <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--ed-ink3)' }}>{completedSections.size} of {SECTIONS.length} parts · 20 min</div>
      </div>

      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ed-ink3)' }}>Badges</div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{completedSections.size}/{BADGES.length}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {BADGES.map((badge) => {
            const unlocked = completedSections.has(badge.id);
            return (
                <div key={badge.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: unlocked ? badge.bg : 'var(--ed-cream)', border: `1px solid ${unlocked ? badge.border : 'var(--ed-rule)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: unlocked ? badge.color : 'var(--ed-ink3)', filter: unlocked ? 'none' : 'grayscale(1) opacity(0.35)', boxShadow: unlocked ? `0 6px 16px ${badge.color}22` : 'none' }}>{badge.icon}</div>
                  <div style={{ fontSize: '8px', color: unlocked ? 'var(--ed-ink3)' : 'transparent', fontWeight: 600, textAlign: 'center', maxWidth: '40px', lineHeight: 1.2 }}>{badge.label}</div>
                </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderLeft: '3px solid var(--ed-indigo)', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ed-indigo)', marginBottom: '10px' }}>Concept Mastery</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {CONCEPTS.map((concept) => {
            const state = store.conceptStates[concept.id];
            const pct = state ? Math.round(state.pKnow * 100) : 0;
            return (
              <div key={concept.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--ed-ink2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{concept.label}</span>
                  <span style={{ fontSize: '10px', color: pct > 0 ? concept.color : 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: concept.color, borderRadius: '2px' }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>Complete quizzes and mentor checks to raise mastery scores</div>
      </div>
    </aside>
  );
}

// ── GenAI TiltCard Mockups ────────────────────────────────────────────────

const TokenProbCard = ({ track }: { track: GenAITrack }) => {
  const tokens = track === 'tech'
    ? [
        { word: 'The', probs: [{ label: 'The', p: 0.72 }, { label: 'A', p: 0.14 }, { label: 'This', p: 0.09 }] },
        { word: 'model', probs: [{ label: 'model', p: 0.68 }, { label: 'system', p: 0.18 }, { label: 'API', p: 0.09 }] },
        { word: 'generates', probs: [{ label: 'generates', p: 0.55 }, { label: 'predicts', p: 0.28 }, { label: 'returns', p: 0.12 }] },
        { word: 'plausible', probs: [{ label: 'plausible', p: 0.41 }, { label: 'likely', p: 0.33 }, { label: 'probable', p: 0.19 }] },
      ]
    : [
        { word: 'The', probs: [{ label: 'The', p: 0.72 }, { label: 'A', p: 0.14 }, { label: 'This', p: 0.09 }] },
        { word: 'procedure', probs: [{ label: 'procedure', p: 0.61 }, { label: 'process', p: 0.23 }, { label: 'protocol', p: 0.11 }] },
        { word: 'for', probs: [{ label: 'for', p: 0.79 }, { label: 'when', p: 0.12 }, { label: 'in', p: 0.07 }] },
        { word: 'compliance', probs: [{ label: 'compliance', p: 0.48 }, { label: 'regulatory', p: 0.31 }, { label: 'internal', p: 0.17 }] },
      ];
  return (
    <div style={{ background: '#0D1117', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#8B949E', marginBottom: '14px' }}>TOKEN PROBABILITY DISTRIBUTION — NEXT-TOKEN SELECTION</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginBottom: '16px' }}>
        {tokens.map((t, i) => (
          <div key={i} style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: '6px', padding: '4px 10px', fontSize: '13px', color: '#C9D1D9', fontWeight: 600 }}>{t.word}</div>
        ))}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 10px', fontSize: '13px', color: '#484F58' }}>…</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {tokens.map((t, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px 12px' }}>
            <div style={{ fontSize: '9px', color: '#7C3AED', letterSpacing: '0.1em', marginBottom: '8px' }}>AFTER &ldquo;{t.word}&rdquo;</div>
            {t.probs.map((p, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                <div style={{ width: '70px', fontSize: '11px', color: j === 0 ? '#C9D1D9' : '#484F58' }}>{p.label}</div>
                <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.p * 100}%`, background: j === 0 ? '#7C3AED' : 'rgba(124,58,237,0.3)', borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '10px', color: j === 0 ? '#7C3AED' : '#484F58', minWidth: '32px', textAlign: 'right' as const }}>{Math.round(p.p * 100)}%</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '12px', fontSize: '10px', color: '#484F58', lineHeight: 1.5 }}>The model picks the highest-probability token each step — then repeats. No retrieval. No reasoning. Pattern completion from training.</div>
    </div>
  );
};

const CapabilityZoneCard = ({ track }: { track: GenAITrack }) => {
  const zones = [
    {
      label: 'Reliable', color: '#16A34A', bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.3)',
      tasks: track === 'tech'
        ? ['Summarise case notes', 'Classify support tickets', 'Draft API docs', 'Reformat structured data']
        : ['Draft correspondence', 'Summarise case files', 'Classify escalations', 'Rewrite in plain language'],
    },
    {
      label: 'Extended', color: '#D97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.3)',
      tasks: track === 'tech'
        ? ['Coverage rate lookup (+ retrieval)', 'Policy Q&A (+ RAG)', 'Claim status check (+ tool)']
        : ['Procedure lookup (+ document retrieval)', 'Case history Q&A (+ database)', 'Compliance check (+ rules engine)'],
    },
    {
      label: 'Unreliable', color: '#DC2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.3)',
      tasks: track === 'tech'
        ? ['Precise claim arithmetic', 'Real-time account balances', 'Legally binding determinations']
        : ['Exact premium calculations', 'Live case status', 'Binding compliance decisions'],
    },
  ];
  return (
    <div style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: '12px', padding: '20px 24px' }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#78716C', fontFamily: "'JetBrains Mono', monospace", marginBottom: '16px' }}>CAPABILITY ZONE MAP</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {zones.map((z) => (
          <div key={z.label} style={{ background: z.bg, border: `1px solid ${z.border}`, borderRadius: '8px', padding: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: z.color, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: z.color }} />
              {z.label}
            </div>
            {z.tasks.map((t, i) => (
              <div key={i} style={{ fontSize: '11px', color: '#44403C', lineHeight: 1.5, marginBottom: '4px', paddingLeft: '8px', borderLeft: `2px solid ${z.border}` }}>{t}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '12px', fontSize: '11px', color: '#78716C', lineHeight: 1.6 }}>
        <strong style={{ color: '#44403C' }}>Key question:</strong> Does the correct answer require a fact from a live system not in the prompt? → Extended or Unreliable.
      </div>
    </div>
  );
};

const PromptCompareCard = ({ track }: { track: GenAITrack }) => {
  const vague = track === 'tech' ? 'Summarise this case note.' : 'What should I do about this case?';
  const specific = track === 'tech'
    ? 'You are a claims triage assistant. Given the case note below, write a 3-sentence summary covering: (1) category, (2) key action required, (3) urgency level. Use plain language for a case worker. No bullet points.'
    : 'You are a healthcare operations assistant. Given the escalation below, write a 2-sentence summary: one sentence stating the category, one sentence stating the recommended next step. Plain language. Max 60 words.';
  const vagueOutput = track === 'tech'
    ? 'The case note discusses a patient claim that was submitted. There are some issues that may need attention from the relevant team. Further review is recommended.'
    : 'Based on the information provided, there are several considerations for this case. The appropriate team should review and determine next steps based on current policies.';
  const specificOutput = track === 'tech'
    ? 'Category: Disputed claim — pharmacy benefit. Action: Escalate to pharmacy review within 48h — override requested by treating physician. Urgency: High.'
    : 'Category: Overdue exception request — provider credentialing. Recommended next step: Assign to credentialing team with 24h SLA flag; case has been pending 11 days past standard window.';
  return (
    <div style={{ background: '#F8F9FA', border: '1px solid #E9ECEF', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {[
          { label: 'Vague brief (Dev)', prompt: vague, output: vagueOutput, accent: '#DC2626', bg: 'rgba(220,38,38,0.04)' },
          { label: 'Specified brief (Priya)', prompt: specific, output: specificOutput, accent: '#16A34A', bg: 'rgba(22,163,74,0.04)' },
        ].map((col) => (
          <div key={col.label} style={{ padding: '16px', background: col.bg, borderRight: col.accent === '#DC2626' ? '1px solid #E9ECEF' : undefined }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: col.accent, letterSpacing: '0.1em', fontFamily: "'JetBrains Mono', monospace", marginBottom: '10px' }}>{col.label.toUpperCase()}</div>
            <div style={{ background: 'white', border: `1px solid ${col.accent}33`, borderRadius: '6px', padding: '10px 12px', marginBottom: '10px' }}>
              <div style={{ fontSize: '9px', color: '#6B7280', marginBottom: '4px', fontFamily: "'JetBrains Mono', monospace" }}>PROMPT</div>
              <div style={{ fontSize: '11px', color: '#374151', lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{col.prompt}&rdquo;</div>
            </div>
            <div style={{ background: 'white', border: '1px solid #E9ECEF', borderRadius: '6px', padding: '10px 12px' }}>
              <div style={{ fontSize: '9px', color: '#6B7280', marginBottom: '4px', fontFamily: "'JetBrains Mono', monospace" }}>OUTPUT</div>
              <div style={{ fontSize: '11px', color: '#374151', lineHeight: 1.6 }}>{col.output}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContextPacketCard = ({ track }: { track: GenAITrack }) => {
  const goodFields = track === 'tech'
    ? [
        { label: 'patient_id', value: 'PT-88412', ok: true },
        { label: 'claim_amount', value: '$2,840.00', ok: true },
        { label: 'case_note', value: '847 chars — complete', ok: true },
        { label: 'intake_form', value: 'structured JSON', ok: true },
        { label: 'policy_tier', value: 'Tier 2 — PPO', ok: true },
      ]
    : [
        { label: 'case_id', value: 'ESC-2024-7712', ok: true },
        { label: 'category', value: 'Provider credentialing', ok: true },
        { label: 'submitted_date', value: '2024-03-01', ok: true },
        { label: 'case_notes', value: '1,204 chars — complete', ok: true },
        { label: 'attachments', value: '2 PDFs loaded', ok: true },
      ];
  const badFields = track === 'tech'
    ? [
        { label: 'patient_id', value: 'PT-88412', ok: true },
        { label: 'claim_amount', value: 'null', ok: false },
        { label: 'case_note', value: 'truncated at 256 chars…', ok: false },
        { label: 'intake_form', value: 'flattened string blob', ok: false },
        { label: 'policy_tier', value: 'null', ok: false },
      ]
    : [
        { label: 'case_id', value: 'ESC-2024-4405', ok: true },
        { label: 'category', value: '(blank)', ok: false },
        { label: 'submitted_date', value: '2022-11-14', ok: true },
        { label: 'case_notes', value: '(blank — pre-migration)', ok: false },
        { label: 'attachments', value: '2 × "unavailable"', ok: false },
      ];
  return (
    <div style={{ background: '#0D1117', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#8B949E', marginBottom: '16px' }}>CONTEXT PACKET AUDIT — SAME PROMPT, DIFFERENT INPUTS</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {[
          { label: '✓ Complete packet', fields: goodFields, color: '#16A34A' },
          { label: '✗ Broken packet', fields: badFields, color: '#DC2626' },
        ].map((col) => (
          <div key={col.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: col.color, marginBottom: '10px' }}>{col.label}</div>
            {col.fields.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '10px', color: '#8B949E' }}>{f.label}</span>
                <span style={{ fontSize: '10px', color: f.ok ? '#16A34A' : '#DC2626', fontWeight: f.ok ? 400 : 600 }}>{f.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '12px', fontSize: '10px', color: '#484F58', lineHeight: 1.5 }}>The model generated a summary in both cases. The broken packet produced a plausible-looking but incomplete output. No error was thrown.</div>
    </div>
  );
};

// ── End TiltCard Mockups ─────────────────────────────────────────────────────

function CoreContent({ track, completedSections, activeSection }: { track: GenAITrack; completedSections: Set<string>; activeSection: string | null }) {
  const nextSection = SECTIONS.find(s => !completedSections.has(s.id));
  const moduleContext = TRACK_META[track].moduleContext;
  const protagonist = track === 'tech' ? 'Aarav' : 'Rhea';
  const protagonistRole = track === 'tech' ? 'Platform Engineer · Northstar Health' : 'Operations Lead · Northstar Health';
  const protagonistDesc = track === 'tech'
    ? 'Just handed a Jira ticket: "Integrate LLM capabilities." No acceptance criteria. No definition of success. He needs a framework before he needs code.'
    : 'Has been asked to find 20% efficiency using AI. Her team has tried it. Results are mixed. She needs a mental model before she needs a plan.';

  const MENTORS: { name: string; role: string; desc: string; color: string; mentorId: GenAIMentorId }[] = [
    { name: 'Anika', role: 'AI Workflow Strategist', desc: 'Asks who owns the failure mode before anyone designs the happy path.', color: '#7C3AED', mentorId: 'anika' },
    { name: 'Rohan', role: 'Automation Engineer', desc: 'Thinks in payloads, retries, and what the system does at 2am.', color: '#2563EB', mentorId: 'rohan' },
    { name: 'Leela', role: 'Risk & Compliance', desc: 'First to ask what happens to people when the workflow is wrong.', color: '#C2410C', mentorId: 'leela' },
    { name: 'Kabir', role: 'Operations Intelligence', desc: 'Distinguishes repetitive work from work that is actually ready for AI.', color: '#0F766E', mentorId: 'kabir' },
  ];

  return (
    <>
      {/* ── Module Hero ── */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '28px' }}>
      <div style={{ flex: 1, minWidth: 0, background: 'var(--ed-cream)', borderRadius: '14px', padding: '36px 36px 28px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-12px', top: '-8px', fontSize: '140px', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.05)`, fontFamily: "'Lora','Georgia',serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>01</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '10px', textTransform: 'uppercase' as const }}>
            GenAI Launchpad · Pre-Read 01
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.025em', color: 'var(--ed-ink)', marginBottom: '10px', fontFamily: "'Lora', Georgia, serif" }}>
            What Is This Thing, Actually?
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '28px' }}>
            &ldquo;Before you prompt anything, understand what you are talking to.&rdquo;
          </p>

          {/* Characters */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const, marginBottom: '24px' }}>
            {/* Protagonist */}
            <div style={{
              background: track === 'tech' ? 'rgba(15,118,110,0.08)' : `rgba(${ACCENT_RGB},0.08)`,
              border: `1.5px solid ${track === 'tech' ? 'rgba(15,118,110,0.3)' : `rgba(${ACCENT_RGB},0.3)`}`,
              borderRadius: '10px', padding: '14px 16px', flex: '1.5', minWidth: '180px',
            }}>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'inline-block', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: track === 'tech' ? '#0F766E' : ACCENT, background: track === 'tech' ? 'rgba(15,118,110,0.1)' : `rgba(${ACCENT_RGB},0.1)`, padding: '2px 7px', borderRadius: '4px', letterSpacing: '0.06em', marginBottom: '8px' }}>PROTAGONIST</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {track === 'tech' ? <AaravFace size={44} /> : <RheaFace size={44} />}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: track === 'tech' ? '#0F766E' : ACCENT }}>{protagonist}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.04em' }}>{protagonistRole}</div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{protagonistDesc}</div>
            </div>

            {/* Mentors */}
            {MENTORS.map(m => (
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

          {/* Learning objectives */}
          <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '16px 20px', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${ACCENT}` }}>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '10px', textTransform: 'uppercase' as const }}>Learning Objectives</div>
            {[
              'Understand what GenAI actually is — a probabilistic completion system, not an oracle',
              'Map the capability zones: what LLMs reliably do well vs where they reliably fail',
              'Make the mental model shift from search query to task specification',
              'Select your first AI use case using five concrete readiness criteria',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 3 ? '8px' : 0, alignItems: 'flex-start' }}>
                <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>0{i + 1}</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, width: '162px', paddingTop: '8px' }}>
        <div className="float3d" style={{ background: 'linear-gradient(145deg, #0F0A1E 0%, #1A0F2E 100%)', borderRadius: '14px', padding: '18px 16px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE 01</div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>What Is GenAI?</div>
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

      {/* Track lens banner */}
      <div style={{ marginBottom: '10px', padding: '16px 20px', borderRadius: '10px', background: track === 'tech' ? 'rgba(15,118,110,0.08)' : 'rgba(124,58,237,0.08)', border: `1px solid ${track === 'tech' ? 'rgba(15,118,110,0.18)' : 'rgba(124,58,237,0.18)'}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: track === 'tech' ? '#0F766E' : '#7C3AED', marginBottom: '8px' }}>
          {TRACK_META[track].label.toUpperCase()}
        </div>
        <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>
          {track === 'tech'
            ? 'Your lens throughout this module: what type of task is this, and is it in the reliable zone? Before evaluating any integration, you will evaluate the task itself — input consistency, output contract, failure cost, and context availability.'
            : 'Your lens throughout this module: what does this tool actually do, and where does it genuinely help? Before building anything, you will build a clear mental model of what AI is, what it is good for, and which of your tasks belong to it.'}
        </div>
      </div>

      <ChapterSection num="01" accentRgb={ACCENT_RGB} id="genai-m1-whatitis" first>
        {chLabel('Week 0 · Introduction to Generative AI')}
        {h2('It does not look things up. It generates what probably comes next.')}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can explain why adding a stronger model won\u2019t fix a retrieval problem — and name the architectural component that actually is missing."
          : "\u25b6 After this section, you can tell the difference between a model problem and an information problem, and know which one to fix."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>Aarav&apos;s team shipped an LLM call that returns coverage rates during claims triage. Three days after demo, the data team flags it: the numbers look right but aren&apos;t. No one panics — it was a prototype. But Aarav pulls the API call apart looking for the bug. There is no bug. The model returned plausible rates because plausible rates are what the training data looked like. There is no claim system in the call. No policy database. Just a question and a model that answered it. He messages Rohan: <em>&ldquo;I think I fundamentally misunderstood what this thing actually does.&rdquo;</em></>
            : <>Rhea&apos;s team has been using an AI assistant for policy questions for three weeks. Good adoption, saves time. Then someone follows an AI-generated escalation procedure that turns out to be wrong. Rhea calls the vendor. The support rep says: <em>&ldquo;The model doesn&apos;t have access to your internal systems. It responds based on training data.&rdquo;</em> She sits with that for a while. They had been asking it questions as if it were a well-informed colleague who had read the Northstar handbook. It hadn&apos;t. It had read everything else. She messages Anika.</>}
        </SituationCard>
        <GenAIConversationScene
          mentor={track === 'tech' ? 'rohan' : 'anika'}
          track={track}
          accent={track === 'tech' ? '#2563EB' : ACCENT}
          techLines={[
            { speaker: 'protagonist', text: "I upgraded to a larger model but the coverage rates are still wrong. There must be a bug in the API call." },
            { speaker: 'mentor', text: "Walk me through the call. Is there a retrieval layer — anything pulling from the claims system?" },
            { speaker: 'protagonist', text: "No retrieval. I'm just passing the question directly to the model." },
            { speaker: 'mentor', text: "Then the model generated plausible rates from training data. It has no idea what Northstar's actual rates are — you never gave it Northstar's rates." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The AI gave us a wrong escalation procedure. I'm looking at other tools — this one clearly doesn't understand healthcare compliance." },
            { speaker: 'mentor', text: "Tell me exactly what you asked it. Not what you wanted to know — what did you literally type?" },
            { speaker: 'protagonist', text: "I asked it to give me the escalation procedure for a compliance incident." },
            { speaker: 'mentor', text: "It generated the most plausible procedure from its training data. Northstar's actual handbook was never in the conversation — no model has that unless you put it there." },
          ]}
        />
        <GenAIAvatar
          name={track === 'tech' ? 'Rohan' : 'Anika'}
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-m1-what-it-is"
          content={track === 'tech'
            ? "The model has no claims system in your call — it generated statistically plausible rates. That\u2019s not a bug. It\u2019s the architecture."
            : "The model generated a plausible escalation procedure from generic training data. Northstar\u2019s actual handbook was never part of the conversation."}
          expandedContent={track === 'tech'
            ? "There's no claims system in your call. No policy database. So the model did what it always does: it generated the most statistically plausible continuation of the text you gave it. Rates in the right format, right range, right level of precision — because that's what coverage rate responses look like in the training data. The model has no way to know what Northstar's actual rates are. You didn't give it Northstar's rates. This isn't a hallucination bug to fix. It's an architecture question: you were asking a completion system to do retrieval. Those are different jobs."
            : "The model gave you the most plausible escalation procedure it could construct from everything it's been trained on — general healthcare operations, compliance docs, whatever made it into the pretraining set. That's not a malfunction. That's what it does. It generates the most likely continuation of the text you gave it. It has no idea what Northstar's actual procedure is unless you put it in the conversation yourself. No model does — not this one, not a newer one. What broke wasn't the model's reliability. It was the assumption underneath the question."}
          question={track === 'tech'
            ? "The data team wants to upgrade to a larger, newer model to fix the accuracy issue. What would you tell them?"
            : "Your colleague says the model is just not reliable enough for policy questions yet. What's the stronger diagnosis?"}
          options={track === 'tech'
            ? [
                { text: 'Agree — a model trained on more recent healthcare data would return accurate rates', correct: false, feedback: 'No version of this model has Northstar\'s specific rates in its weights. A newer model would generate equally plausible but equally wrong numbers.' },
                { text: 'The model is doing its job — the call needs a retrieval layer to pull actual rates from the claims system', correct: true, feedback: 'Exactly. The fix is architecture, not model quality. The model handles the language work. A retrieval layer connects it to live data.' },
                { text: 'Fine-tune the model on Northstar\'s historical claims data to improve accuracy', correct: false, feedback: 'Fine-tuning on historical data improves pattern matching, not real-time accuracy. It still won\'t have current rates.' },
                { text: 'Update the prompt to explicitly instruct the model not to make up numbers', correct: false, feedback: 'You can\'t prompt your way out of an architecture gap. Instructing the model not to hallucinate doesn\'t give it access to Northstar\'s actual rates — it will still generate from training patterns.' },
              ]
            : [
                { text: 'Agree — policy compliance tasks need a model trained on more recent regulatory data', correct: false, feedback: 'Training recency doesn\'t change the fundamental issue. No model has Northstar\'s internal procedures unless you give them as input.' },
                { text: 'The model is working as designed — it was being asked for specific data it cannot have without retrieval', correct: true, feedback: 'Yes. Policy procedures exist in specific documents, not in training patterns. The fix is putting those documents in the context, not finding a better model.' },
                { text: 'Write longer prompts that include more context about what Northstar does', correct: false, feedback: 'More context helps, but if the actual procedure document isn\'t in the prompt, no amount of background context produces the correct procedure.' },
                { text: 'Switch to a model with internet access so it can look up the correct procedure', correct: false, feedback: 'Internet access doesn\'t give the model Northstar\'s internal procedure. That lives in your internal documentation, not on the web.' },
              ]}
        />
        {para(track === 'tech'
          ? 'Generative AI models are completion systems. Given a sequence of text, they generate the most statistically plausible continuation based on patterns in training data. They have no live connection to the world — no access to your databases, no ability to check current state, no memory between calls. They generate. They do not retrieve. That distinction is not a limitation to be patched. It is the architecture.'
          : 'Generative AI models are completion systems. They generate the most plausible continuation of whatever text they receive. They have no connection to live systems, no access to internal documents they weren\'t given, and no ability to flag when they don\'t actually know something. Certainty is a text style — the model can sound completely confident about things it is factually wrong about, because confidence is in the training data too.')}
        <GenAIAvatar
          name="Kabir"
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-m1-what-it-is"
          content={track === 'tech'
            ? "Before you redesign anything — what kind of task was the coverage rate lookup, at its core? Language task or data lookup?"
            : "Rhea, before you update your team\u2019s guidelines — I want to ask you one question. The escalation procedure task: was that a language problem or an information lookup?"}
          expandedContent={track === 'tech'
            ? "That's the filter I use first. Language task: the input is text, the output is text, and you don't need anything from an external system to answer correctly. Data lookup: the correct answer lives in a specific record somewhere. Coverage rates are a lookup — they live in a claims system. The model is genuinely excellent at language tasks. It is not a database. Once you separate those two categories, most of the confusion about when to use AI and when not to dissolves immediately."
            : "Those are two different jobs. Language task: rewrite this, summarise that, draft a response — the model works from what's in the prompt and its training. Information lookup: tell me the current escalation procedure, pull the right premium for this tier — the correct answer lives in a specific document or system. The model is very good at language work. It is not a retrieval system. The moment you ask it to look something up that isn't in the context, you've crossed from one category to the other. Most AI failures I've seen come from that exact crossing."}
          question={track === 'tech'
            ? "Which of these is a pure language task that works without a retrieval layer?"
            : "Your team wants to use AI for two tasks: drafting responses to provider complaints, and checking whether claims were processed within SLA. Which one fits the language task category?"}
          options={track === 'tech'
            ? [
                { text: 'Return the current deductible for a given plan and coverage tier', correct: false, feedback: 'Current deductibles live in a plan database. That\'s a data lookup — the model needs retrieval to answer correctly.' },
                { text: 'Rewrite a dense case note into plain language for a patient communication', correct: true, feedback: 'The input is the case note. The output is a rewritten version. Nothing from an external system is required. That\'s a language task the model can do directly.' },
                { text: 'Check whether an exception request was resolved within the 48-hour SLA window', correct: false, feedback: 'SLA compliance requires a timestamp lookup from your case management system. Data lookup, not language task.' },
                { text: 'Generate a risk score for a claim based on its category and value', correct: false, feedback: 'Risk scoring on specific claim values requires arithmetic on real financial data — that\'s a data lookup and calculation, not a language task.' },
              ]
            : [
                { text: 'SLA checking — that\'s a pattern-matching task LLMs handle well', correct: false, feedback: 'SLA checking requires live timestamp data from your claims system. The model can\'t look that up without retrieval infrastructure.' },
                { text: 'Drafting complaint responses — the model only needs what\'s in the prompt, no live data required', correct: true, feedback: 'Yes. A good complaint response requires understanding the situation and writing well — both language work. The draft goes to a human before sending anyway.' },
                { text: 'Both work — modern LLMs are capable enough for both categories', correct: false, feedback: 'Capability isn\'t the issue. Architecture is. SLA checking requires current data the model simply doesn\'t have without a retrieval layer.' },
                { text: 'Complaint drafting, but only after connecting it to the patient database for richer context', correct: false, feedback: 'Complaint drafting works without the database — the situation description you paste in is sufficient. Adding a database connection is extra complexity that doesn\'t change the fundamental task type.' },
              ]}
        />
        {keyBox('What GenAI actually is', [
          'A probabilistic completion system — it generates the most plausible next text, not the most accurate.',
          'Excellent at language work: summarise, classify, draft, rewrite, extract from documents you provide.',
          'Disconnected from live data — it needs retrieval infrastructure for anything that requires current or proprietary facts.',
        ], ACCENT)}
        {para(track === 'tech'
          ? "A retrieval layer is the component that sits between your application and the model. When a user asks about current coverage rates, the retrieval layer queries your claims system first, then passes the actual rate — alongside the question — to the model as part of the prompt. The model\u2019s job is language work: formatting, synthesising, explaining the result. The retrieval layer\u2019s job is fetching the fact. They are different components doing different jobs. Without a retrieval layer, you are asking the model to remember something it was never given."
          : "A retrieval layer is the part of an AI system that looks things up before the model responds. Think of it like a research assistant: before the model writes anything, the retrieval layer finds the relevant policy document, the specific procedure, or the correct figure — and puts it in the prompt as context. Without this layer, the model writes from training data. With it, the model writes from the specific document you gave it. Most early AI failures happen because teams skip this step and ask the model to recall things it was never shown."
        )}
        {track === 'tech' ? keyBox('What a retrieval layer looks like in the call flow', [
          '1. User query arrives (e.g. "What is the deductible for Plan B, Tier 2?").',
          '2. Retrieval step: your code queries the plan database — SELECT deductible FROM plans WHERE plan=\'B\' AND tier=2 — and gets back the actual figure.',
          '3. Model call: you construct the prompt with the retrieved fact inline — "The Tier 2 deductible for Plan B is $1,400. Given this, answer the following question: ..." The model formats, explains, and responds.',
          '4. The model never touches the database. It only sees what your retrieval step fetched and injected.',
          'Common patterns: SQL lookup for structured records, vector search for document retrieval (RAG), API call for live system state. The pattern depends on where the fact lives — not on the model.',
        ], ACCENT) : keyBox('What to ask IT to build — and what you own', [
          'What IT builds: a way to attach the relevant document or record to every AI request before it reaches the model. For policy questions, that means: given the question, find the right policy document and include it in the prompt automatically.',
          'What you own: specifying which document or data source is the right one for each task, and verifying the output is using the attached content — not making things up.',
          'The simplest version: IT stores your policy documents in a searchable index. When a question comes in, the system finds the most relevant document and prepends it to the prompt. The model reads the document you gave it and answers from that.',
          'The signal that retrieval is working: ask the model a question whose answer only appears in your internal document. If the answer is correct, the document reached the model. If it hallucinated, the retrieval step failed or was skipped.',
        ], ACCENT)}
        {PMPrincipleBox({ label: '◈ Principle', principle: 'Before asking whether AI can do something, ask whether it has — or can be given — the information it needs to answer correctly.' })}
        <TiltCard style={{ margin: '28px 0' }}><TokenProbCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech' ? "Look at the last AI API call your team shipped. Was the model doing language work (completing, transforming, classifying text you gave it) or implicitly expected to know live facts? If the latter — where would the retrieval layer need to sit?" : "Think of one task your team has tried with AI that gave unreliable results. Was it a language task or an information lookup? If it was a lookup — what would a correct design have looked like?"} />
        <QuizEngine conceptId="genai-m1-what-it-is" conceptName="What GenAI Is" moduleContext={moduleContext} staticQuiz={QUIZZES[0]} />
        <NextChapterTeaser text={track === 'tech' ? "Aarav knows what the model is now. The next question is which tasks it's reliable on — and where even the most capable model consistently fails. That boundary matters more than model quality." : "Rhea knows what the model is now. The next question is which tasks it genuinely helps with and where it's reliably wrong — and that line has almost nothing to do with which tool you pick."} />
      </ChapterSection>

      <ChapterSection num="02" accentRgb={ACCENT_RGB} id="genai-m1-capabilities">
        {chLabel('The Capability Map')}
        {h2('Every model has a reliable zone. Most teams use it outside that zone.')}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can classify any proposed LLM integration into Reliable, Extended, or Unreliable zone using three diagnostic questions — and explain what to do differently in each zone."
          : "\u25b6 After this section, you can map your team\u2019s AI tasks across the three zones and identify which ones need a retrieval layer or human review step to be safe."
        )}
        <SituationCard accent="#2563EB" accentRgb="37,99,235" label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>Aarav takes a whiteboard and maps everything his team has tried with LLMs in the last quarter. Left side: worked reliably. Right side: failed or got flagged. Middle: inconsistent. He stares at the left side — classification, summarisation, extraction from forms, rewriting dense notes. He stares at the right side — arithmetic on claim amounts, questions about current patient records, contract language that had to be legally exact. The pattern is uncomfortable because it was obvious in retrospect. The model wasn&apos;t bad at some things and good at others randomly. It had a zone. Nobody had looked for it. He calls Rohan.</>
            : <>Rhea makes a list. Every AI experiment her team has run in the last two months — she writes them on a whiteboard and draws three columns. The left column fills quickly: draft an email, summarise a case note, reformat a form for a different audience. All of them language, no single right answer, easy for a human to review. The right column is slower but the pattern is just as clear: check an SLA window, look up a current premium, verify a policy was filed. All of them needing live data, all of them silently wrong when the model tried. She had never made this map before. She had been treating AI as either magic or useless. She calls Rohan.</>}
        </SituationCard>
        <GenAIConversationScene
          mentor="rohan"
          track={track}
          accent="#2563EB"
          techLines={[
            { speaker: 'protagonist', text: "I mapped everything out — classification, summarisation, extraction on the left. Arithmetic on claim amounts, current patient records, exact contract language on the right." },
            { speaker: 'mentor', text: "Good map. What do all the left-side tasks have in common that the right side doesn\u2019t?" },
            { speaker: 'protagonist', text: "The left side... doesn\u2019t need anything from an external system. Text in, text out. Everything needed is in the prompt." },
            { speaker: 'mentor', text: "That\u2019s the reliable zone. The model generates equally fluently in both columns — it just can\u2019t warn you when it\u2019s outside it." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "Left column fills fast: draft email, summarise case note, reformat a form. Right column: SLA check, current premium lookup, policy verification — all wrong." },
            { speaker: 'mentor', text: "Good map. Now look at the right column failures. Were any of those still running in production when they failed?" },
            { speaker: 'protagonist', text: "Yes — the SLA checker was deployed. It was flagging cases for weeks before someone noticed something was off." },
            { speaker: 'mentor', text: "That\u2019s the real risk. Not that the model failed — it\u2019s that nobody could tell it had." },
          ]}
        />
        <GenAIAvatar
          name="Rohan"
          nameColor="#2563EB"
          borderColor="#2563EB"
          conceptId="genai-m1-capabilities"
          content={track === 'tech'
            ? "Good map. What does the left side have in common that the right side doesn\u2019t?"
            : "Good map. Now look at the right column — the failures. Were any of those still running when they failed?"}
          expandedContent={track === 'tech'
            ? "The left side is language work. Text in, text out, everything the model needs is in the prompt. The right side is either data lookups or precision tasks where being 95% right is a liability. That's the reliable zone — language tasks where the model works from what you've given it and errors are catchable before they cause harm. Outside that zone, the model doesn't warn you. It keeps generating with exactly the same confidence. Classification works. Arithmetic on novel numbers does not. The model looks equally certain in both cases. You have to know the zones before you assign the tasks, because the model won't tell you when it's out of its depth."
            : "That's the question that matters. A model being wrong in a demo is an interesting finding. A model being wrong in a deployed workflow, on real cases, before anyone checks — that's a different problem. The capability map isn't just about what the model can do. It's about where errors are catchable. In your left column, a human reads the draft before anything happens. In your right column, the model gives a wrong number or a wrong status check and it might act on it before you see it. The zone a task lives in tells you what verification you need to build around it."}
          question={track === 'tech'
            ? "Your team wants to use AI to extract structured fields from free-text intake forms — category, urgency, callback needed. What zone does that sit in?"
            : "You want to use AI to flag inbound escalations that need same-day response. What zone does that sit in?"}
          options={track === 'tech'
            ? [
                { text: 'Unreliable — structured extraction needs deterministic parsing logic, not AI', correct: false, feedback: 'Extraction from free text is a core LLM strength. Given a clear schema, they reliably pull structured fields from unstructured input.' },
                { text: 'Reliable — extracting defined fields from text you provide is a language task with no live data dependency', correct: true, feedback: 'Yes. The form is in the context window, the schema is specified, no external system required. Reliable zone.' },
                { text: 'Extended — you\'d need retrieval infrastructure to make this work consistently', correct: false, feedback: 'Retrieval is for when you need to look things up from external systems. If the form is in the prompt, you already have what the model needs.' },
                { text: 'Reliable, but only after fine-tuning the model on intake form examples first', correct: false, feedback: 'Fine-tuning isn\'t needed for extraction from forms you provide. A well-specified prompt with the form in context handles this reliably without additional training.' },
              ]
            : [
                { text: 'Unreliable — urgency flagging requires clinical judgment the model can\'t make', correct: false, feedback: 'Classifying from a text description is a language task. It doesn\'t require clinical judgment — it requires reading the description and applying defined criteria.' },
                { text: 'Reliable — reading a case description and flagging urgency is a language task, as long as a human reviews before action', correct: true, feedback: 'Right. The model reads text and assigns a category. No live data required. And with a review step, errors are caught before they affect the case.' },
                { text: 'Extended — you\'d need retrieval of the patient\'s history to flag urgency accurately', correct: false, feedback: 'For a first pass on inbound escalations, the description itself is often enough to flag urgency. Retrieval can be added later, but it\'s not the baseline requirement.' },
                { text: 'Unreliable — the model can\'t be consistent enough across different urgency definitions', correct: false, feedback: 'Inconsistency is a prompt specification problem, not a fundamental model limitation. Define the urgency criteria explicitly in the prompt and the model applies them reliably.' },
              ]}
        />
        {para(track === 'tech'
          ? 'The zones are: reliable (language in, language out, no live data required), extended (retrieval-augmented or tool-augmented tasks that work with the right infrastructure), and unreliable (precise calculations on real numbers, real-time data without retrieval, legally exact outputs). The model generates equally fluently in all three. Only the first zone doesn\'t require you to build around its failures.'
          : 'The zones are: reliable (language work — summarise, classify, draft, extract — where the model works from what you give it), extended (tasks that need retrieval or tools to work correctly), and unreliable (precise arithmetic, live data without retrieval, legally exact claims). A map like the one on your whiteboard is more useful than any benchmark score.')}
        <GenAIAvatar
          name="Leela"
          nameColor="#2563EB"
          borderColor="#2563EB"
          conceptId="genai-m1-capabilities"
          content={track === 'tech'
            ? "Aarav, the arithmetic thing on your whiteboard — claim amounts — is that in production right now?"
            : "Rhea, I want to ask you about the middle column. The inconsistent ones. When they worked, who was checking the output before anything happened with it?"}
          expandedContent={track === 'tech'
            ? "Because that's the one I'd pull immediately. Arithmetic on real financial figures is in the unreliable zone, and the failure mode isn't 'obviously broken output' — it's 'plausibly formatted but wrong number.' Nobody flags a number that's off by 4%. It passes review. It processes. The pattern I look for is: what does a wrong output look like, and would anyone notice before it has an effect? Unreliable zone tasks with invisible failure modes are the most dangerous thing on that whiteboard."
            : "That's the pattern I always look for. When AI output has a human in the review loop, errors get caught — you learn something, you fix something, and the person affected doesn't get hurt. When AI output acts directly on something, a wrong output and a right output look the same until something downstream breaks. Your middle column is worth examining: for each one, ask whether a wrong output was catchable or whether it just proceeded. That answer tells you a lot about how to redesign those workflows."}
          question={track === 'tech'
            ? "Your team is debating whether to add AI to two more tasks: auto-formatting outgoing case correspondence, and automatically calculating and applying claim adjustments. Which is most operationally safe to proceed with?"
            : "Two tasks are up for discussion: AI-drafted summaries that go to case workers for review, and AI-generated urgency flags that auto-route cases with no human check. What's the key difference?"}
          options={track === 'tech'
            ? [
                { text: 'Both — AI accuracy is high enough that the risk difference is minimal', correct: false, feedback: 'Accuracy rates are averages. Claim adjustments that are wrong 2% of the time, undetected, are a financial and compliance liability. Format errors in correspondence are caught in review.' },
                { text: 'Formatting correspondence — errors are visible and low-stakes. Claim calculations are in the unreliable zone with consequential, potentially invisible errors', correct: true, feedback: 'Exactly. Formatting is a reliable-zone task with easy verification. Arithmetic on real claim amounts is unreliable, and wrong outputs in financial calculation can pass unnoticed.' },
                { text: 'Claim adjustments — more value, and accuracy rates on structured tasks are high enough to proceed', correct: false, feedback: 'Value doesn\'t determine safety. Arithmetic on novel numbers in the unreliable zone produces errors that look exactly like correct outputs.' },
                { text: 'Neither — both require domain expertise the model doesn\'t have', correct: false, feedback: 'Formatting correspondence doesn\'t require domain expertise — it\'s a language task the model handles well. The distinction is reliable zone (formatting) vs unreliable zone (arithmetic on real numbers), not domain expertise.' },
              ]
            : [
                { text: 'Auto-routing is more efficient — it removes a bottleneck from the review process', correct: false, feedback: 'Efficiency is the right goal eventually. But removing the human checkpoint means the model\'s errors act on real cases before anyone sees them.' },
                { text: 'Auto-routing removes the human checkpoint — a wrong urgency flag routes a case incorrectly with no one noticing until something downstream breaks', correct: true, feedback: 'Yes. In the first workflow, a wrong summary goes to a case worker who catches it. In the second, a wrong flag routes a case — and the affected person may not know until it\'s too late.' },
                { text: 'Both are equivalent — the model\'s accuracy on urgency flagging is high enough to proceed without review', correct: false, feedback: 'Accuracy rates don\'t address what happens in the failures. The question is whether errors are catchable, not just rare.' },
                { text: 'AI-drafted summaries are riskier — a wrong summary could mislead a case worker more than a wrong route', correct: false, feedback: 'A wrong summary goes to a case worker who reads it before acting — they catch it. A wrong urgency flag auto-routes before anyone sees it. The review step is the key difference, not which task feels higher-stakes.' },
              ]}
        />
        {keyBox('The three zones', [
          'Reliable: summarise, classify, draft, explain, extract, reformat. Language in, language out — no live data.',
          'Extended: retrieval-augmented Q&A, structured outputs, tool-augmented workflows. Works with the right infrastructure.',
          'Unreliable: real-time data lookups, precise arithmetic, legally exact claims, novel edge cases.',
        ], '#2563EB')}
        {keyBox('Zone check: three questions for any new task', [
          'Q1. Does this task need a fact from a system not already in the prompt — a live record, a current status, a database value? → Yes: Extended or Unreliable.',
          'Q2. Does a correct answer require precise arithmetic or a legally exact output where being close is not good enough? → Yes: Unreliable.',
          'Q3. Is everything the model needs already in the prompt — text in, text out, no external lookup required? → Yes: Reliable.',
          'If Q1 and Q2 are both No and Q3 is Yes: Reliable. If Q1 is Yes but the task can be solved with the right retrieval infrastructure: Extended. If Q2 is Yes regardless of anything else: Unreliable.',
        ], '#2563EB')}
        {para(track === 'tech'
          ? "Applied: Aarav wants to auto-calculate claim adjustment amounts. Q1: Yes — the claim amount lives in a database, not the prompt. Q2: Yes — arithmetic on real financial figures where a 3% error is a compliance issue. Zone: Unreliable. The fix is not a better prompt — it is removing this task from LLM scope and using a deterministic calculation layer."
          : "Applied: Rhea wants to flag overdue insurance exceptions. Q1: Yes — overdue status requires checking a timestamp in the case management system, which is not in the prompt. Zone: Extended. The model can classify exception descriptions you give it, but it cannot determine whether a deadline has passed without a retrieval layer pulling that data first."
        )}
        <TiltCard style={{ margin: '28px 0' }}><CapabilityZoneCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech' ? "Map your last three LLM integration attempts across the three zones. For the failures — which zone were they actually in, and what was the failure mode? Visible or invisible?" : "Take your whiteboard map and add one column: for each task, who sees the output before it affects anything? That column tells you which tasks need redesigning."} />
        <QuizEngine conceptId="genai-m1-capabilities" conceptName="Capability Map" moduleContext={moduleContext} staticQuiz={QUIZZES[1]} />
        <NextChapterTeaser text={track === 'tech' ? "Aarav has the capability map. But knowing the zones doesn't tell you how to assign tasks reliably. That takes a different shift — from the way you've been thinking about prompts." : "Rhea has the capability map. But knowing where AI is reliable doesn't automatically mean her team will use it well. That depends on something about how they're communicating with it."} />
      </ChapterSection>

      <ChapterSection num="03" accentRgb={ACCENT_RGB} id="genai-m1-mental-model">
        {chLabel('The Mental Model Shift')}
        {h2('You are not asking a question. You are specifying a task.')}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can diagnose a prompt variance problem and specify the missing dimensions — role, format, constraints, length, example — that collapse it."
          : "\u25b6 After this section, you can rewrite a vague prompt by identifying every unspecified dimension and filling it in deliberately."
        )}
        <SituationCard accent="#0F766E" accentRgb="15,118,110" label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>Aarav notices the variance problem. Same endpoint, same model, same task — &ldquo;summarise this case note&rdquo; — and the outputs range from sharp and structured to meandering and vague. He spends two hours blaming the model version. Then he looks more carefully at the calls themselves. The good outputs came from Priya&apos;s prompts. The bad ones came from Dev&apos;s. The model is the same. The prompts are not. Priya&apos;s specify a role, output format, required fields, and length. Dev&apos;s are three words followed by a case note. He messages Anika.</>
            : <>Rhea watches her team use the AI assistant for a week. She notices something: the people who get useful, consistent results are writing very different prompts from the people who get frustrating ones. Priya&apos;s prompts are long — role, format, what to include, what to skip, how long the output should be. Dev&apos;s are short: &ldquo;Summarise this.&rdquo; &ldquo;What should I do about this case?&rdquo; Same model. The outputs barely resemble each other. Rhea thinks it might be a skill gap — that Priya has some intuition Dev hasn&apos;t developed. She messages Anika to check.</>}
        </SituationCard>
        <GenAIConversationScene
          mentor="anika"
          track={track}
          accent="#0F766E"
          techLines={[
            { speaker: 'protagonist', text: "Same model, same task — Priya gets sharp, structured outputs. Dev gets meandering ones. I can\u2019t explain it." },
            { speaker: 'mentor', text: "Read me one of Dev\u2019s prompts and one of Priya\u2019s. Exactly as written." },
            { speaker: 'protagonist', text: "Dev: \u2018Summarise this case note.\u2019 Priya: role, task, format, length, what to exclude, one example output." },
            { speaker: 'mentor', text: "Dev\u2019s prompt has one dimension specified. Priya\u2019s has six. Every gap Dev leaves, the model fills with whatever seems statistically plausible — differently each run." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "Priya gets useful outputs consistently. Dev gets all over the place. I assumed Priya just has better instincts." },
            { speaker: 'mentor', text: "It\u2019s not instincts. \u2018Summarise this\u2019 is a question. Priya\u2019s version is a specification. They\u2019re different briefs." },
            { speaker: 'protagonist', text: "So the model is choosing everything Dev didn\u2019t specify — format, length, what to include." },
            { speaker: 'mentor', text: "And it chooses differently every run. Priya\u2019s prompts don\u2019t leave anything to chance. That\u2019s not intuition — it\u2019s discipline." },
          ]}
        />
        <GenAIAvatar
          name="Anika"
          nameColor="#0F766E"
          borderColor="#0F766E"
          conceptId="genai-m1-mental-model"
          content={track === 'tech'
            ? "Dev\u2019s prompt has one dimension specified. Priya\u2019s has five. Every unspecified dimension is a choice the model makes for you."
            : "It\u2019s not a skill gap. Priya is specifying a task. Dev is asking a question. Those are not the same thing."}
          expandedContent={track === 'tech'
            ? "There it is. Dev's prompt has one dimension specified: the task. Priya's has five: role, task, format, length, and constraints. Every dimension that's unspecified in a prompt is a decision the model makes for you — format, length, perspective, tone, level of detail, what to include. It fills those gaps with the most statistically plausible defaults from its training data. Sometimes that matches what you want. Often it doesn't. Dev's variance isn't a model problem. It's a specification problem. The model is doing exactly what it was asked to do — it just had to choose everything Dev didn't specify."
            : "When you type 'Summarise this', the model has to decide: how long? What format? What to include? What to leave out? What level of detail? It fills every one of those gaps with whatever seems most plausible based on its training. Sometimes that matches what you needed. Often it doesn't. Priya's prompts leave almost no gaps. Dev's prompts are almost entirely gaps. The model isn't performing differently — it's just completing very different briefs. The good news is this is immediately fixable. You don't need a new tool, a new model, or any technical changes."}
          question={track === 'tech'
            ? "Dev says 'I can't control model variance — it's a fundamental limitation.' What would you tell him?"
            : "Dev wants to know what to add to his prompt first. What would you start with?"}
          options={track === 'tech'
            ? [
                { text: 'Agree — LLM variance is a known limitation that can\'t be engineered around', correct: false, feedback: 'Variance exists, but it fills the space you leave for it. Specify format, length, and constraints, and the variance mostly disappears.' },
                { text: 'The model is filling the gaps he\'s leaving. If he specifies format, length, and what to include, the variance will collapse', correct: true, feedback: 'Exactly. "Summarise this" leaves every dimension open. "Write a 3-sentence summary covering category, key action, and urgency — in plain language for a case worker" doesn\'t.' },
                { text: 'He needs to provide more context about each case to get consistent outputs', correct: false, feedback: 'More case context helps the model understand the situation. But output variance is about output specification — format, length, structure — not input volume.' },
                { text: 'Switch to a lower temperature setting to reduce the model\'s randomness', correct: false, feedback: 'Temperature reduction helps at the margins, but output variance from an underspecified brief isn\'t primarily a temperature problem. A lower-temperature model still has to choose format, length, and structure when you leave them open.' },
              ]
            : [
                { text: 'More context about the case — the model needs more background to produce a good summary', correct: false, feedback: 'More input context helps the model understand the situation. But the inconsistency is about output specification — Dev\'s prompt doesn\'t tell the model what format, length, or structure to use.' },
                { text: 'Format and length — define what the output should look like before anything else', correct: true, feedback: 'Yes. "Write a 3-sentence summary in plain language, covering: what happened, what action is needed, and urgency level" immediately collapses most of the variance.' },
                { text: 'A role instruction — telling the model it\'s a claims specialist', correct: false, feedback: 'Role helps orient the model, but if format and length are still unspecified, the outputs will still vary significantly.' },
                { text: 'A stricter instruction at the end — \'be consistent and professional\'', correct: false, feedback: 'Vague quality instructions don\'t anchor specific dimensions. \'Be consistent\' doesn\'t tell the model what consistent looks like. Format and length specifications do.' },
              ]}
        />
        {para(track === 'tech'
          ? 'The shift is from question-asking to task specification. A question is "summarise this." A specification is: role, task, format, constraints, length, and what to exclude. When those dimensions are defined, the model stops choosing them. Variance drops. Not because the model improved — because the brief stopped leaving things to chance.'
          : 'The shift is from asking to specifying. A question leaves gaps. A specification fills them. When format, length, constraints, and structure are defined, the model executes your choices instead of making its own. That\'s true for a three-sentence summary, a draft email, or a structured triage report.')}
        <GenAIAvatar
          name="Kabir"
          nameColor="#0F766E"
          borderColor="#0F766E"
          conceptId="genai-m1-mental-model"
          content={track === 'tech'
            ? "Aarav, there\u2019s one more thing Priya does that Dev doesn\u2019t. Look at her prompts again."
            : "Rhea, there\u2019s one thing I\u2019ve watched consistently narrow the gap between what people want and what the model produces. Does Priya ever include an example in her prompts?"}
          expandedContent={track === 'tech'
            ? "She includes an example output. Not always — but for any task where the format really matters, she pastes one previous output and says 'like this.' I've watched teams spend hours writing instruction paragraphs trying to explain exactly what format they need, and then still be surprised when the model interprets it differently. One concrete example teaches format, tone, level of detail, and scope simultaneously. It shows the model what you mean instead of describing it. That's the fastest way to collapse the gap between the output you're imagining and the output you get."
            : "That's the pattern. Instructions tell the model what you want. Examples show it. When Priya includes a sample output, the model has a concrete reference for length, format, and style — not a description to interpret. I've seen teams spend a whole afternoon writing detailed prompt instructions and still get variance because there's always room to interpret a description differently. One well-chosen example closes most of that gap immediately."}
          question={track === 'tech'
            ? "You're building a reusable prompt for weekly case triage summaries. What's the most efficient way to lock in consistent format?"
            : "You're writing a prompt for a recurring task — weekly escalation summaries for the director. What's the fastest way to make sure the format stays consistent?"}
          options={track === 'tech'
            ? [
                { text: 'Write comprehensive format instructions covering every structural edge case', correct: false, feedback: 'Comprehensive instructions help but still leave interpretation space. One example is more efficient — it shows exactly what you mean.' },
                { text: 'Include one example of a good output as a reference for the model to match', correct: true, feedback: 'One well-chosen example teaches format, tone, length, and structure simultaneously. It\'s the fastest way to get consistent outputs on a recurring task.' },
                { text: 'Run it a few times and manually select the best output as the template', correct: false, feedback: 'That helps you identify what good looks like, but without embedding that standard in the prompt, every new run is still a lottery.' },
                { text: 'Add a chain-of-thought instruction so the model explains its formatting choices', correct: false, feedback: 'Chain-of-thought is useful for reasoning tasks. For format consistency on a recurring task, an example output is more direct — it shows the model what to produce rather than asking it to reason about how.' },
              ]
            : [
                { text: 'Write detailed formatting instructions and test against five cases before going live', correct: false, feedback: 'Detailed instructions help, but they still leave room for interpretation. An example gives the model a concrete reference that doesn\'t depend on interpretation.' },
                { text: 'Include one good previous summary as an example so the model has a concrete reference', correct: true, feedback: 'Exactly. One example teaches format, length, and tone simultaneously — more efficiently than any description.' },
                { text: 'Ask the model to suggest a format, then standardise on what it proposes', correct: false, feedback: 'That gives you a model-chosen format. For a recurring task with a specific audience, the format should come from you.' },
                { text: 'Send the prompt to three team members and use whichever version produces the most consistent outputs', correct: false, feedback: 'Testing with team members evaluates outputs, but doesn\'t anchor format in the prompt. An example output is what makes every future run consistent — not just the ones your team tested.' },
              ]}
        />
        {pullQuote('Vague brief, model chooses. Specific brief, you choose. The model executes either way.')}
        <TiltCard style={{ margin: '28px 0' }}><PromptCompareCard track={track} /></TiltCard>
        {keyBox('Elements of a clear task specification', [
          'Role: who the model should act as ("You are a claims triage analyst").',
          'Task: what to do, precisely ("Classify this request into one of five categories").',
          'Format: what the output must look like ("Return three sentences: what happened, action needed, urgency").',
          'Constraints: what to include, exclude, or prioritise.',
          'Example: one sample input-output pair that shows rather than describes.',
        ], '#0F766E')}
        {PMPrincipleBox({ label: '◈ Principle', principle: 'Every gap in a prompt is a decision the model makes for you. Decide intentionally or accept whatever the model chooses.' })}
        <ApplyItBox prompt={track === 'tech' ? "Take the worst-performing prompt in your current stack. List every unspecified dimension: role, output format, length, constraints, examples. Add them one at a time. Which change had the biggest effect on variance?" : "Find a prompt your team uses that gives inconsistent results. Count the gaps — format, length, perspective, what to exclude. Add specifications for each. Compare the output before and after."} />
        <QuizEngine conceptId="genai-m1-mental-model" conceptName="Mental Model Shift" moduleContext={moduleContext} staticQuiz={QUIZZES[2]} />
        <NextChapterTeaser text={track === 'tech' ? "Aarav has the specification mindset. But a well-specified prompt still fails when what the model receives is broken. The context packet is often where the real problem lives." : "Rhea can write better prompts now. But there's one more variable that determines whether a good prompt produces a good output — and it has nothing to do with the prompt itself."} />
      </ChapterSection>

      <ChapterSection num="04" accentRgb={ACCENT_RGB} id="genai-m1-context">
        {chLabel('Context Is the Input')}
        {h2('The quality of the output is bounded by the quality of what went in.')}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can identify a context assembly failure in a staging environment and know to fix the data pipeline before touching the prompt."
          : "\u25b6 After this section, you can audit what the model actually receives in a failing case and distinguish a context quality problem from a prompt problem."
        )}
        <SituationCard accent="#C2410C" accentRgb="194,65,12" label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>Aarav&apos;s team has a prompt that works well in testing — sharp outputs, right format, right length. In staging, the same prompt produces degraded outputs on roughly one in five cases. He spends most of a day in the prompt, adding constraints, clarifying the format spec, running A/B tests. The outputs barely change. Finally, a colleague suggests inspecting the actual payloads. He pulls up a failing case. The context packet has a patient record where three fields are null, a case note truncated at the API limit, and an intake form where structured fields were flattened into a single unbroken string. He messages Rohan.</>
            : <>Rhea&apos;s team has been using the summary tool for six weeks. Mostly good. Then she notices the failure cases aren&apos;t random — they cluster around older cases, cases from before the system migration, cases where the PDF attachments didn&apos;t load. She pulls up a good summary and a bad one side by side. Same prompt. The bad one came from a case with half the fields blank and two attachments that show as &ldquo;unavailable.&rdquo; She&apos;d been assuming it was the prompt. She messages Rohan.</>}
        </SituationCard>
        <GenAIConversationScene
          mentor="rohan"
          track={track}
          accent="#C2410C"
          techLines={[
            { speaker: 'protagonist', text: "My prompt works perfectly in testing. In staging, 1-in-5 cases degrade. I\u2019ve spent a day tightening the constraints." },
            { speaker: 'mentor', text: "Stop touching the prompt. Pull up a failing staging case and tell me exactly what the model received." },
            { speaker: 'protagonist', text: "Three null fields, a case note truncated at the API limit, one form flattened into an unbroken string." },
            { speaker: 'mentor', text: "The model didn\u2019t fail. It generated the best output it could from broken inputs. The bug is in your context assembly pipeline, not the prompt." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The failures cluster around older cases and cases where PDFs didn\u2019t load. I\u2019ve been rewriting the prompt for a week." },
            { speaker: 'mentor', text: "The prompt isn\u2019t your problem. Pull up a bad case and tell me what was actually in the record the model received." },
            { speaker: 'protagonist', text: "Half the fields are blank. Two attachments show as unavailable." },
            { speaker: 'mentor', text: "The model produced a summary of what it was given. It doesn\u2019t have a way to say \u2018this isn\u2019t enough.\u2019 Context quality failure — not a prompt failure." },
          ]}
        />
        <GenAIAvatar
          name="Rohan"
          nameColor="#C2410C"
          borderColor="#C2410C"
          conceptId="genai-m1-context"
          content={track === 'tech'
            ? "Before we touch the prompt — tell me what the model actually received in a failing case. Exactly what was in the payload."
            : "Before you change the prompt — pull up a failing case and tell me what's actually in the record the model received."}
          expandedContent={track === 'tech'
            ? "There it is. The model didn't fail. It did exactly what it was supposed to do — it generated the most plausible summary from what it received. Three null fields, a truncated case note, and a flattened form. That's not enough information to produce a sharp output. The model doesn't have a way to say 'this context is broken, I can't work with this.' It just generates from whatever it has. The context is the actual input. Everything the model knows about your specific case has to be in that payload at inference time. No memory between calls. No ability to look things up. If the context is broken, the output will reflect that — and it will look like a model failure when it's actually a data pipeline failure."
            : "That's the answer. The prompt is the same. The model is the same. The context is different. The good summary came from a complete record. The bad one came from a skeleton with missing attachments and blank fields. The model doesn't have a way to flag that something is missing — it generates from whatever it receives. So it produced a summary of the information that was there. That's not a model inconsistency problem. That's a context quality problem. The two cases might as well have been sent to a different model — because from the model's perspective, they might as well have been completely different documents."}
          question={track === 'tech'
            ? "Your team proposes upgrading to a larger model to fix the staging inconsistency. What would you say?"
            : "You've been debugging the prompt for a week. A colleague says 'just upgrade the model.' What's your response now?"}
          options={track === 'tech'
            ? [
                { text: 'Agree — a larger model handles incomplete context better', correct: false, feedback: 'A larger model receiving a context packet with null fields and a truncated case note will produce a better-written bad output. The constraint is the data, not the model.' },
                { text: 'Fix the context assembly pipeline first — the model is doing its job with broken inputs', correct: true, feedback: 'Exactly. The model generates from what it receives. If the payload is broken, the fix is in the data pipeline, not the model.' },
                { text: 'Add fallback instructions to the prompt for when fields are missing', correct: false, feedback: 'Fallback instructions help the model handle missing data more gracefully. But they don\'t fix missing data. The context assembly layer needs to validate before inference.' },
                { text: 'Rewrite the prompt to explicitly handle each missing field scenario', correct: false, feedback: 'You can\'t write your way out of missing data. If the case note is truncated at the API limit, no prompt instruction recovers what was cut off. Fix the data pipeline.' },
              ]
            : [
                { text: 'Agree — a better model would infer missing information from the partial context', correct: false, feedback: 'Models can\'t conjure information that isn\'t there. A larger model generates a more fluent summary of nothing.' },
                { text: 'The model is working correctly — the issue is incomplete context reaching the model. That\'s a data pipeline problem', correct: true, feedback: 'Yes. Same prompt, same model, different inputs. The variable is the context packet. Fix that layer first.' },
                { text: 'Keep debugging the prompt — there\'s probably a constraint that would make the model handle incomplete records better', correct: false, feedback: 'You can instruct the model to handle missing data gracefully, but instructions can\'t substitute for actual information. If the attachment didn\'t load, no prompt instruction retrieves it.' },
                { text: 'Add a verification step after the summary is generated, asking the model to check its own output', correct: false, feedback: 'Self-verification doesn\'t work when the model doesn\'t know what information is missing. It can only check what it received — not what should have been there.' },
              ]}
        />
        {para(track === 'tech'
          ? 'Context is not configuration. It is the actual input the model receives at inference time. Everything the model knows about your specific case must be in the context window. The model has no memory between calls, no access to your systems, no ability to retrieve information it was not sent. Output quality is bounded by context quality — not by model quality.'
          : 'The model has no memory between calls and no access to systems it wasn\'t given. Every fact it needs to produce a good output has to be in the context window when you make the call. A good prompt with broken context produces a broken output — not because the model failed, but because it did exactly what you asked with what you gave it.')}
        <GenAIAvatar
          name="Leela"
          nameColor="#C2410C"
          borderColor="#C2410C"
          conceptId="genai-m1-context"
          content={track === 'tech'
            ? "Aarav — how long was the staging environment running before you caught this?"
            : "Rhea, I want to ask you about the six weeks before you noticed the pattern."}
          expandedContent={track === 'tech'
            ? "Because that's the design problem I'm most concerned about. Not that the context packets were broken — that's fixable. The problem is the system had no way to know a context packet was broken. A null field, a truncated note, a flattened form — those all produced outputs that looked like outputs. Not error states. Not flags. Just a summary, formatted correctly, sent to whoever was waiting for it. The question for your context assembly layer is: what does it do when a required field is missing? Does it fail loudly and route the case for human review? Or does it silently proceed?"
            : "For six weeks, bad summaries were going to case workers on those older cases. Some of them may have acted on incomplete information. The thing about context quality failures is they're silent — the output looks like an output. It doesn't look like an error. Nobody sees a red flag. They just see a summary that's a bit thin or misses something important. The design question is: what should your system do when a required field is missing or an attachment doesn't load? Because right now, the answer is: proceed and generate anyway."}
          question={track === 'tech'
            ? "You're redesigning the context assembly layer. What's the most important safeguard to add?"
            : "You're redesigning the summary workflow. What's the most important thing to add to the context assembly step?"}
          options={track === 'tech'
            ? [
                { text: 'Log all API calls so you can inspect failing cases after the fact', correct: false, feedback: 'Logging is essential for debugging, but it doesn\'t prevent bad outputs from being delivered. The safeguard needs to be before inference.' },
                { text: 'Validate required fields before sending to the model — if they\'re missing, flag the case for human review instead of running inference', correct: true, feedback: 'Exactly. Silent failures are the most dangerous kind. Validate context completeness before the call. If something critical is missing, the system should know that and act accordingly.' },
                { text: 'Add a confidence score output so downstream users know when to verify the summary', correct: false, feedback: 'Confidence scores help, but they reflect the model\'s self-assessment, not context completeness. A model receiving a broken context packet doesn\'t necessarily output a low confidence score.' },
                { text: 'Set up automated regression testing that runs on a weekly batch of real cases', correct: false, feedback: 'Regression testing catches patterns after delivery. The safeguard needs to be pre-inference — if a required field is missing, the case shouldn\'t reach the model at all.' },
              ]
            : [
                { text: 'Add a disclaimer to every AI summary reminding case workers to verify against the original record', correct: false, feedback: 'Disclaimers shift the burden to the case worker without fixing the underlying issue. If the context is broken, the summary is unreliable regardless of the disclaimer.' },
                { text: 'Validate that required fields are present and attachments loaded before running the model — route incomplete cases to human review', correct: true, feedback: 'Yes. The safeguard goes before inference, not after. If the context is incomplete, the system should flag it — not silently generate a degraded summary.' },
                { text: 'Have case workers rate summaries so you can identify which ones the model struggled with', correct: false, feedback: 'Rating helps you find past failures. It doesn\'t prevent future ones from reaching case workers first.' },
                { text: 'Re-run the model on failing cases with a different prompt once they\'re identified', correct: false, feedback: 'Re-running with a different prompt doesn\'t help if the context is still broken. If the attachments didn\'t load and the fields are blank, a different prompt gets the same bad inputs.' },
              ]}
        />
        {keyBox('What belongs in a good context packet', [
          'The task input: the document, case note, or record being processed — complete and correctly structured.',
          'Relevant background: role of the reader, purpose of the output, what\'s already known.',
          'Constraints: what to include, exclude, or flag in the output.',
          'Validation: required fields present, attachments loaded, data not truncated.',
        ], '#C2410C')}
        {PMPrincipleBox({ label: '◈ Principle', principle: 'The model cannot produce what it does not have. Fix the context before you fix the prompt.' })}
        <TiltCard style={{ margin: '28px 0' }}><ContextPacketCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech' ? "Pick a production LLM call with inconsistent outputs. Compare the context packets across good and bad cases. What fields are present in good runs but missing or malformed in bad ones? What does the context assembly layer need to validate before inference?" : "Find a case where an AI tool gave you a surprisingly poor output. What was actually in the context it received? Was anything missing, truncated, or in the wrong format? What would a validated context packet look like for that case?"} />
        <QuizEngine conceptId="genai-m1-context" conceptName="Context as Input" moduleContext={moduleContext} staticQuiz={QUIZZES[3]} />
        <NextChapterTeaser text={track === 'tech' ? "Aarav has the four fundamentals: what the model is, where it's reliable, how to specify tasks, and why context quality matters. The last question is the one that has to come before any of this reaches production." : "Rhea has the four fundamentals. The last question is the most practical: given everything she now knows, which use case does she actually build first?"} />
      </ChapterSection>

      <ChapterSection num="05" accentRgb={ACCENT_RGB} id="genai-m1-apply">
        {chLabel('Your First Use Case')}
        {h2('Win clearly. Verify easily. Fail cheaply.')}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can apply three selection criteria to a list of AI candidates and make the case for which one is safe and learnable enough to build first."
          : "\u25b6 After this section, you can evaluate a proposed AI use case against three readiness criteria and identify the smallest version of the idea that passes all three."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>Aarav has three candidates for a first production AI integration. Option one: auto-approve routine claims exceptions when AI confidence is above a threshold — biggest efficiency gain, clearest ROI. Option two: classify inbound case requests by type and urgency, flagging low-confidence cases for human review. Option three: an autonomous intake agent that monitors the queue, routes requests, and takes action without human checkpoints — most technically interesting. He builds the ROI case for option one. Then he messages Anika before the presentation.</>
            : <>Rhea has three options to bring to her director. Option one: auto-resolve routine exception requests where the AI confidence is above 80% — biggest headline number, clearest headcount case. Option two: classify inbound escalations by category and urgency, with human review of anything below a confidence threshold. Option three: AI drafts responses to provider complaints, sent directly after a quick assistant spot-check. She&apos;s been building the case for option one. She calls Anika the night before the presentation.</>}
        </SituationCard>
        <GenAIConversationScene
          mentor="anika"
          track={track}
          accent={ACCENT}
          techLines={[
            { speaker: 'protagonist', text: "Option one has the clearest ROI — auto-approve routine claims when AI confidence clears 80%. I\u2019ve built the case." },
            { speaker: 'mentor', text: "Walk me through it. What happens to a case when the confidence score is high but the decision is wrong?" },
            { speaker: 'protagonist', text: "It gets approved and routes through the system. Nobody reviews it before it acts." },
            { speaker: 'mentor', text: "Confidence is the model\u2019s estimate of its own certainty — not accuracy. At 80%, one in five confident decisions is wrong. Your ROI deck doesn\u2019t price that in." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "Option one has the best headline number — auto-resolve exceptions at 80% confidence. That\u2019s the headcount case my director wants." },
            { speaker: 'mentor', text: "Walk me through what an incorrectly resolved exception looks like to the person who submitted it." },
            { speaker: 'protagonist', text: "They\u2019d get a resolution notice. But if it was wrong\u2026 they might not know until something downstream broke." },
            { speaker: 'mentor', text: "And can you tell how many wrong resolutions there have been? That\u2019s the question your director will ask when the first one surfaces." },
          ]}
        />
        <GenAIAvatar
          name="Anika"
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-m1-use-case-readiness"
          content={track === 'tech'
            ? "Walk me through option one. What happens to a case when the AI confidence score is wrong?"
            : "Walk me through option one. Auto-resolve at 80% confidence. What does an incorrectly resolved exception look like to the person who submitted it?"}
          expandedContent={track === 'tech'
            ? "A confidence score is not accuracy. It's the model's estimate of its own certainty — which correlates with accuracy but is not the same thing. An 80% threshold means roughly 1 in 5 decisions the model is confident about are wrong. Now: what does an incorrectly auto-approved exception look like, end to end? Does it route somewhere before anyone sees it? Does the person affected know? Can they appeal? Can you tell how many there have been? That's the question the ROI presentation hasn't answered. The first use case doesn't have to be the most impressive one. It has to be one where you can see what the system is doing, learn from its mistakes, and improve it. You can't do that with option one."
            : "Do they get a notification? Can they see what happened? Is there a flag in your system that says 'AI-resolved, no human review'? Because here's what I know: a confidence score is the model's estimate of its own certainty, not a guarantee of accuracy. At 80%, 1 in 5 cases the model thinks it's sure about are wrong. If those wrong cases auto-resolve and nobody catches them, you don't have an efficiency gain. You have a liability you don't know the size of yet. The first use case is how you learn what your model gets wrong. That learning requires being able to see the failures. Option one makes them invisible."}
          question={track === 'tech'
            ? "Your director pushes back: 'Option two doesn't show enough efficiency gain. Why start there?' What's the right argument?"
            : "Your director says 'Option two doesn't move the needle on headcount. Why would we do this?' What do you say?"}
          options={track === 'tech'
            ? [
                { text: 'Option two is safer from a compliance standpoint, which limits our liability exposure', correct: false, feedback: 'That frames it as caution vs. results. The real argument is about what you can actually build reliably and what you learn from it.' },
                { text: 'Option two teaches us where the model fails before those failures affect outcomes — that\'s what earns the right to do option one later', correct: true, feedback: 'Exactly. Six weeks of option two tells you which case types the model misclassifies, what the context looks like when it fails, and what accuracy looks like on real data. Option one without that foundation is a liability.' },
                { text: 'Option one requires more infrastructure than we have right now', correct: false, feedback: 'Infrastructure is a real consideration but not the strongest argument. The core issue is what happens when the model is wrong and whether you\'ll know.' },
                { text: 'Option three is the better learning opportunity — more complexity means more to learn', correct: false, feedback: 'More complexity means more variables, harder-to-attribute failures, and harder-to-recover mistakes. The first use case should maximise observability, not complexity.' },
              ]
            : [
                { text: 'Option two is the safe, compliance-friendly choice while we prove the technology', correct: false, feedback: 'That frames option two as the cautious option. It\'s actually the strategic one — it generates the data that makes option one viable later.' },
                { text: 'Option two teaches us exactly where the model fails before those failures affect real cases — that\'s what makes option one possible to do safely', correct: true, feedback: 'Exactly. Option two is how you build the foundation. Six weeks of classification data tells you what the model gets wrong, how often, and on which case types. Without that, option one\'s 80% confidence threshold is a number with no context.' },
                { text: 'Option one requires more technical complexity than we\'re ready for right now', correct: false, feedback: 'Complexity is a real factor, but the stronger argument is about observability. Option one without a review step makes failures invisible until they\'ve had an effect.' },
                { text: 'Start with option three — the drafting task is the one staff will actually adopt', correct: false, feedback: 'Adoption isn\'t the right first criterion. Option three sends AI drafts with minimal human review — it removes most of the human checkpoint. Option two\'s review step is what makes it learnable.' },
              ]}
        />
        {para(track === 'tech'
          ? 'The first use case is not about maximum impact. It is about building something you can see, understand, and improve. Bounded output, human checkpoint, easy verification, recoverable failures. Classification with a review gate is the archetype — the model suggests, a human confirms, and the team learns exactly where the model fails before those failures affect anything.'
          : 'The first use case is not the most efficient one. It is the most learnable one. Bounded output, human review, easy verification, recoverable errors. Classification with a review step is the archetype — the model reads, categorises, flags uncertainty, and a human confirms. The team learns what the model gets wrong before any of that affects a case.')}
        <GenAIAvatar
          name="Kabir"
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-m1-use-case-readiness"
          content={track === 'tech'
            ? "Aarav, I want to ask you something different. After six weeks of running option two — what would you need to see before you\u2019d feel comfortable removing the review step?"
            : "Rhea, after six weeks of running option two — what would you need to see before you\u2019d feel ready to move to option one?"}
          expandedContent={track === 'tech'
            ? "That's the question that turns a pilot into a strategy. You'd want to know: which case types does the model classify correctly 98%+ of the time? Which ones does it consistently get wrong? What does the context look like in the failures — are there patterns? How long does the review step actually take when a human catches a bad classification? Those six weeks turn the 80% confidence threshold from a number into a decision. You don't remove the review step. You narrow it — apply it only to the case types where the model has earned that trust. That's how you get to option one. Not by starting there."
            : "That's the question that connects option two to option one. Not 'when have we run it long enough?' but 'what does the data show us?' Which escalation categories is the model consistently right on? Which ones does it misclassify, and what do those cases look like? How often does the human reviewer change the classification? Once you have that, you're not guessing about 80% confidence — you have actual accuracy rates on your actual cases. You extend autonomy to the categories the model has earned it on. That's how option one becomes viable. Not by starting there on faith."}
          question={track === 'tech'
            ? "After six weeks, your classification model is 94% accurate on routine cases. Someone proposes removing the review step. What do you check first?"
            : "After six weeks, the model is correctly flagging 93% of escalations. Your director wants to move to auto-routing with no human review. What's the first question you ask?"}
          options={track === 'tech'
            ? [
                { text: 'Whether 94% meets the industry benchmark for this classification task', correct: false, feedback: 'Benchmarks compare you to other models. They don\'t tell you what the 6% failures look like in your specific workflow.' },
                { text: 'What the 6% misclassifications are — which case types, and whether a wrong classification causes recoverable or unrecoverable harm', correct: true, feedback: 'Exactly. 94% sounds high. But if the 6% that are wrong are the highest-stakes cases, removing the review step is a different decision than it looks. The failure cases tell you more than the accuracy rate does.' },
                { text: 'Whether the model has been trained on enough domain-specific cases to generalise reliably', correct: false, feedback: 'Training coverage is worth understanding, but after six weeks of live data, the question is about the actual failure modes you\'ve observed.' },
                { text: 'Whether the team has enough capacity to keep reviewing the edge cases the model flags', correct: false, feedback: 'Capacity matters for the review step, but the first question is about the failure pattern. Understanding what the 6% looks like determines whether narrowing the review step is safe — not whether you have enough reviewers.' },
              ]
            : [
                { text: 'Whether the model\'s accuracy rate is high enough to meet the SLA we\'ve committed to', correct: false, feedback: 'SLA compliance is a goal, but it doesn\'t answer what happens when the model is wrong. The question is about failure mode, not error rate.' },
                { text: 'What the 7% misclassifications look like — which case types, and whether an incorrectly routed case causes harm before it\'s caught', correct: true, feedback: 'Yes. 93% sounds reliable. But if the cases the model misclassifies are the highest-urgency ones, auto-routing them is a different risk than the headline number suggests.' },
                { text: 'Whether we can build an escalation path so misrouted cases get flagged eventually', correct: false, feedback: 'An escalation path helps catch failures after they happen. The question is whether you understand the failure pattern well enough to design that path correctly.' },
                { text: 'Whether the 93% accuracy has been consistent across all six weeks of the pilot', correct: false, feedback: 'Consistency over time matters, but it still doesn\'t tell you what the failures look like. A model that\'s consistently 93% accurate on low-stakes cases might still be failing on the highest-urgency ones.' },
              ]}
        />
        {track === 'non-tech' ? keyBox('Walking two tasks through the criteria — Rhea\u2019s candidates', [
          'Task A: AI drafts responses to provider complaints, reviewed by an assistant before sending.',
          '  \u2713 Win clearly: a good draft is readable, on-tone, and addresses the complaint. Rhea can define that before running it.',
          '  \u2713 Verify easily: the assistant reads it in 30 seconds and spots anything wrong.',
          '  \u2713 Fail cheaply: a bad draft gets edited or discarded. Nothing is sent without human sign-off.',
          '  \u2192 Passes all three. Good first use case.',
          '',
          'Task B: AI checks whether claims were processed within the SLA window.',
          '  \u2717 Win clearly: seems clear — yes or no answer. But the correct answer requires a timestamp from the case management system.',
          '  \u2717 Fail cheaply: if the model generates a wrong SLA status and it acts on a case before anyone checks, harm is done silently.',
          '  \u2192 Fails. Not a language task — it requires live data the model cannot access. Extended zone at minimum.',
        ], ACCENT) : keyBox('Walking two tasks through the criteria — Aarav\u2019s candidates', [
          'Task A: AI auto-formats outgoing case correspondence to the required template.',
          '  \u2713 Win clearly: correct formatting is visually verifiable — the fields are in the right place, the structure matches the template.',
          '  \u2713 Verify easily: anyone can read the output and spot a misplaced field or wrong section header.',
          '  \u2713 Fail cheaply: a bad format gets caught in the review step before the letter goes out.',
          '  \u2192 Passes all three. Good first use case.',
          '',
          'Task B: AI auto-calculates and applies claim adjustment amounts.',
          '  \u2717 Win clearly: the correct adjustment depends on policy terms and claim data in external systems — you cannot verify correctness from the prompt alone.',
          '  \u2717 Fail cheaply: a wrong adjustment that applies automatically is a financial and compliance error. It may not surface until something downstream breaks.',
          '  \u2192 Fails. Precise arithmetic on real claim data is Unreliable zone. Even 98% accuracy means systematic errors at scale.',
        ], ACCENT)}
        {keyBox('First use case readiness criteria', [
          'Language-based: text in, text out. No live database access needed.',
          'Bounded output: category, summary, or draft — not a final decision or irreversible action.',
          'Easy to verify: a human can quickly check whether the output is right.',
          'Recoverable: errors are caught before they affect anything downstream.',
          'Observable: you can see what the model gets wrong, not just what it gets right.',
        ], ACCENT)}
        {PMPrincipleBox({ label: '◈ Principle', principle: 'Win clearly, verify easily, fail cheaply. That is the brief for the first use case.' })}
        <ApplyItBox prompt={track === 'tech' ? "Name three AI integration candidates from your current backlog. Run each through the five criteria: language-based, bounded output, easy to verify, recoverable, observable failures. Which one scores best? What does running it first teach you that the others can't?" : "Name one AI workflow you've been considering. Run it through the five criteria. Where does it pass, where does it fail? What's the smallest, most learnable version of the same idea that clears all five?"} />
        <QuizEngine conceptId="genai-m1-use-case-readiness" conceptName="Use-Case Readiness" moduleContext={moduleContext} staticQuiz={QUIZZES[4]} />
        <NextChapterTeaser text={track === 'tech' ? "Aarav has the mental model, the capability map, the specification habit, the context discipline, and a first use case worth building. Pre-Read 02 goes inside the model: how to write prompts that stay reliable when real, messy data is flowing through them." : "Rhea now has everything she needs to think clearly about GenAI. Pre-Read 02 goes deeper: how to write prompts that produce consistent, reliable outputs when the data is real and the stakes are higher."} />
      </ChapterSection>
    </>
  );
}

interface Props {
  track: GenAITrack;
  onBack: () => void;
}

export default function GenAIPreRead1({ track, onBack }: Props) {
  const store = useLearnerStore();
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const prevXpRef = useRef(0);

  useEffect(() => {
    store.initSession();
    CONCEPTS.forEach((concept) => store.ensureConceptState(concept.id));
  }, []);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.getAttribute('data-section');
        if (!sectionId) return;
        if (entry.isIntersecting) {
          setActiveSection(sectionId);
          setCompletedSections((prev) => new Set([...prev, sectionId]));
          store.markSectionViewed(sectionId);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -25% 0px' });

    const timer = setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach((element) => sectionObserver.observe(element));
    }, 150);

    return () => {
      clearTimeout(timer);
      sectionObserver.disconnect();
    };
  }, []);

  const progressPct = Math.round((completedSections.size / SECTIONS.length) * 100);

  return (
    <div className="editorial" style={{ background: 'var(--ed-cream)', minHeight: '100vh' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
              <motion.button whileHover={{ opacity: 0.75 }} whileTap={{ scale: 0.97 }} onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', cursor: 'pointer', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>←</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)', fontFamily: "'JetBrains Mono', monospace" }}>Back</span>
              </motion.button>
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <AirtribeLogo />
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>GenAI Launchpad</span>
                <span style={{ color: 'var(--ed-rule)', fontSize: '12px' }}>›</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink2)' }}>{TRACK_META[track].introTitle}</span>
              </div>
            </div>
            <div className="top-nav-progress" style={{ flex: 1, maxWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 24px' }}>
              <div style={{ flex: 1, height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: ACCENT, borderRadius: '2px' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: ACCENT, flexShrink: 0 }}>{progressPct}%</span>
            </div>
            <DarkModeToggle />
          </motion.div>
          <div className="airtribe-bar" style={{ marginBottom: '0' }} />
        </div>
      </div>

      <div className="three-col-wrap" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
        <div className="three-col-grid" style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr) 240px', gap: '40px', alignItems: 'start', paddingTop: '36px' }}>
          <div className="left-col" style={{ alignSelf: 'stretch' }}>
            <LeftNav completedSections={completedSections} activeSection={activeSection} track={track} />
          </div>

          <motion.main initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={{ minWidth: 0 }}>
            <CoreContent track={track} completedSections={completedSections} activeSection={activeSection} />
            <AnimatePresence>
              {progressPct >= 80 ? (
                <motion.div initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} style={{ padding: '40px 32px', background: 'var(--ed-card)', borderRadius: '10px', textAlign: 'center', position: 'relative', overflow: 'hidden', marginBottom: '40px', border: '1px solid var(--ed-rule)', borderTop: `4px solid ${ACCENT}` }}>
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '40px', marginBottom: '14px' }}>◎</motion.div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: 'var(--ed-ink)', fontFamily: "'Lora', 'Georgia', serif" }}>Pre-Read 01 Complete</h3>
                  <p style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '430px', margin: '0 auto 24px' }}>
                    {track === 'tech' ? 'You now have the right Week 0 builder mental model: AI workflows are not just model calls. They are systems with triggers, payloads, orchestration, validation, review loops, and recovery paths.' : 'You now have the right Week 0 workflow mental model: AI workflows are not just prompts. They are systems with triggers, context, orchestration, review loops, and recovery paths.'}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <div style={{ height: '60px' }} />
          </motion.main>

          <div className="right-col" style={{ alignSelf: 'stretch' }}>
            <Sidebar completedSections={completedSections} progressPct={progressPct} prevXp={prevXpRef.current} />
          </div>
        </div>
      </div>
    </div>
  );
}

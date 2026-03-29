'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import QuizEngine from './QuizEngine';
import GenAIAvatar, { GenAIMentorFace } from './GenAIAvatar';
import type { GenAIMentorId } from './GenAIAvatar';
import type { GenAITrack } from './genaiTypes';
import {
  ApplyItBox,
  ChapterSection,
  NextChapterTeaser,
  PMPrincipleBox,
  SituationCard,
  chLabel,
  h2,
  keyBox,
  para,
  pullQuote,
} from './pm-fundamentals/designSystem';

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

function AirtribeLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 800, color: 'var(--ed-ink)', lineHeight: 1 }}>Airtribe</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 600, color: 'var(--ed-ink3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Learn</div>
      </div>
    </div>
  );
}

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
    <aside style={{ position: 'sticky', top: '80px' }}>
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
    <aside style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
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

function RheaFace({ size = 44 }: { size?: number }) {
  const [blink, setBlink] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    const schedule = () => {
      timerRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); schedule(); }, 130);
      }, 2800 + Math.random() * 2200);
    };
    schedule();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);
  const eyeRy = blink ? 0.6 : 4.8;
  return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.27), background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', border: '2px solid #7C3AED', overflow: 'hidden', flexShrink: 0 }}>
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#4F46E5" />
        <path d="M 34 90 Q 50 102 66 90" fill="#7C3AED" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#C98B5A" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#C98B5A" />
        {/* Hair — long, flowing */}
        <ellipse cx="50" cy="22" rx="28" ry="16" fill="#1A0D2E" />
        <path d="M 22 30 Q 18 55 22 80 Q 26 72 26 55 Z" fill="#1A0D2E" />
        <path d="M 78 30 Q 82 55 78 80 Q 74 72 74 55 Z" fill="#1A0D2E" />
        <path d="M 22 28 Q 28 20 50 18 Q 72 20 78 28 L 76 42 Q 64 35 50 35 Q 36 35 24 42 Z" fill="#1A0D2E" />
        <ellipse cx="24" cy="55" rx="4" ry="7" fill="#C98B5A" />
        <ellipse cx="76" cy="55" rx="4" ry="7" fill="#C98B5A" />
        {/* Eyebrows */}
        <path d="M 31 42 Q 38 39 45 41" stroke="#1A0D2E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 55 41 Q 62 39 69 42" stroke="#1A0D2E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        {/* Eyes */}
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.4" fill="#2D1A6E" /><circle cx="62.5" cy="50.5" r="3.4" fill="#2D1A6E" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        {/* Nose */}
        <path d="M 48 57 Q 50 61 52 57" stroke="#A96938" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Smile */}
        <path d="M 40 67 Q 50 74 60 67" stroke="#9C5D3B" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function AaravFace({ size = 44 }: { size?: number }) {
  const [blink, setBlink] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    const schedule = () => {
      timerRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); schedule(); }, 130);
      }, 2800 + Math.random() * 2200);
    };
    schedule();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);
  const eyeRy = blink ? 0.6 : 4.8;
  return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.27), background: 'linear-gradient(135deg, #0F766E 0%, #059669 100%)', border: '2px solid #0F766E', overflow: 'hidden', flexShrink: 0 }}>
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#065F46" />
        <path d="M 34 90 Q 50 102 66 90" fill="#0F766E" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#7A4A33" />
        <ellipse cx="50" cy="52" rx="27" ry="30" fill="#7A4A33" />
        {/* Short cropped hair */}
        <ellipse cx="50" cy="22" rx="27" ry="15" fill="#111" />
        <path d="M 23 32 Q 24 20 50 18 Q 76 20 77 32 L 76 44 Q 64 36 50 36 Q 36 36 24 44 Z" fill="#111" />
        <ellipse cx="24" cy="52" rx="4.5" ry="6.5" fill="#7A4A33" />
        <ellipse cx="76" cy="52" rx="4.5" ry="6.5" fill="#7A4A33" />
        {/* Eyebrows */}
        <path d="M 30 41 Q 38 38 46 40" stroke="#111" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path d="M 54 40 Q 62 38 70 41" stroke="#111" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        {/* Glasses */}
        <rect x="28" y="44" width="20" height="11" rx="3" fill="none" stroke="#222" strokeWidth="1.9" />
        <rect x="52" y="44" width="20" height="11" rx="3" fill="none" stroke="#222" strokeWidth="1.9" />
        <line x1="48" y1="49.5" x2="52" y2="49.5" stroke="#222" strokeWidth="1.7" />
        {/* Eyes (behind glasses) */}
        <ellipse cx="38" cy="49.5" rx="6" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="49.5" rx="6" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.3" cy="50" r="2.9" fill="#1A2030" /><circle cx="62.3" cy="50" r="2.9" fill="#1A2030" /></>}
        {!blink && <><circle cx="39.2" cy="48.8" r="0.8" fill="rgba(255,255,255,0.85)" /><circle cx="63.2" cy="48.8" r="0.8" fill="rgba(255,255,255,0.85)" /></>}
        {/* Nose */}
        <path d="M 48 57 Q 50 61 52 57" stroke="#5C3420" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Smile */}
        <path d="M 40 67 Q 50 72 60 67" stroke="#5C3420" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function CoreContent({ track }: { track: GenAITrack }) {
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
      <div style={{ background: 'var(--ed-cream)', borderRadius: '14px', padding: '36px 36px 28px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                {track === 'tech' ? <AaravFace size={44} /> : <RheaFace size={44} />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: track === 'tech' ? '#0F766E' : ACCENT }}>{protagonist}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.04em' }}>{protagonistRole}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: track === 'tech' ? '#0F766E' : ACCENT, background: track === 'tech' ? 'rgba(15,118,110,0.1)' : `rgba(${ACCENT_RGB},0.1)`, padding: '2px 7px', borderRadius: '4px', letterSpacing: '0.06em' }}>PROTAGONIST</div>
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
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          {track === 'tech'
            ? <>Aarav is a platform engineer at Northstar Health. His team needs to check edge-case coverage rates during claims triage. Someone adds an LLM call that returns the rates — confidently, professionally, in bullet points. The numbers look right. They are not. They are plausible extrapolations from training data, not from Northstar&apos;s actual policy database. Aarav realises the team has built a retrieval problem, not a model problem. The model was never broken. It was being asked to do something fundamentally different from what it actually does.</>
            : <>Rhea leads operations at Northstar Health. Her team starts using an AI assistant for policy questions. Someone asks it for the escalation procedure. It responds with a confident, well-formatted answer. Wrong procedure. When she asks the vendor, they say: &ldquo;The model does not have access to your systems. It responds based on training data.&rdquo; That sentence changes how Rhea thinks about every AI tool her team will ever use. The model was not broken. She had been asking it the wrong kind of question.</>}
        </SituationCard>
        {para('Generative AI models are not databases. They are not search engines. They are completion systems: given an input sequence, they generate the most statistically plausible continuation. The model has no live connection to the world. It has weights — billions of numerical parameters trained on text — and when you send it a prompt, it uses those weights to produce a response that fits.')}
        {para('That sounds abstract until you feel the implications. The model can sound completely certain about things it is factually wrong about, because certainty is a stylistic property of the text, not a function of truth. It cannot tell you current information without retrieval infrastructure. It cannot access your databases, check your live systems, or verify that its answer matches your specific context. It generates — it does not look up.')}
        {para('This is not a flaw to be fixed in a future version. It is the fundamental architecture. An LLM trained on general text will always need external infrastructure to interact with specific, live, or proprietary data. Understanding this is what separates people who get disappointed by AI from people who build things that actually work.')}
        {pullQuote('The model is finishing your sentence, not consulting your database.')}
        {keyBox('Three things GenAI is', [
          'A probabilistic text completion system trained on large corpora.',
          'Extremely capable at language tasks: summarising, classifying, drafting, transforming.',
          'Disconnected from live data — outputs reflect training patterns, not current reality.',
        ], ACCENT)}
        <GenAIAvatar
          name="Anika"
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-m1-what-it-is"
          content="When a model returns wrong information confidently, teams usually say the model hallucinated. That framing leads to the wrong fix."
          expandedContent="Hallucination is the symptom. The cause is usually a mismatch between what the model can do and what it was asked to do. If you ask a completion system for specific factual data it was never trained on, you are not using the wrong model — you are using the wrong architecture. The fix is a retrieval layer, not a stronger model."
          question="Your team&apos;s AI assistant returns incorrect policy details. A colleague says the model is too weak. What is the stronger diagnosis?"
          options={[
            { text: 'Agree — this type of factual task needs a model trained on more recent data', correct: false, feedback: 'Model recency rarely solves policy-accuracy problems. The model cannot access your live policy database regardless of its training date.' },
            { text: 'The task requires live data the model does not have — this is a retrieval gap, not a model weakness', correct: true, feedback: 'Exactly. Policy details require specific, current information the model cannot hold in weights. The fix is infrastructure, not a stronger model.' },
            { text: 'Write much more detailed prompts that include the full policy text each time', correct: false, feedback: 'Pasting policy text into the prompt is a workaround that does not scale and introduces context window constraints.' },
          ]}
        />
        <GenAIAvatar
          name="Kabir"
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-m1-what-it-is"
          content="The most useful question when evaluating an AI use case is: does this task require specific facts the model cannot have in its weights?"
          expandedContent="If the answer is yes — live data, proprietary records, current state — you are in retrieval territory. That is not bad news. It is just an architecture decision. You build the retrieval layer. The model does the language work. Those are two different problems with two different solutions."
          question="Which of these is purely a language task that needs no retrieval layer?"
          options={[
            { text: 'Return the current premium for a given policy and coverage tier', correct: false, feedback: 'That requires live system data. The model cannot produce accurate current rates without retrieval.' },
            { text: 'Rewrite a dense claims summary into plain language for a patient letter', correct: true, feedback: 'That is a language transformation task. The model has everything it needs in the input — no external data required.' },
            { text: 'Check whether an exception was resolved within the 48-hour SLA window', correct: false, feedback: 'SLA compliance requires a timestamp lookup. That is a data query, not a language task.' },
          ]}
        />
        {PMPrincipleBox({ principle: 'Before asking whether AI can do something, ask whether it has — or can be given — the information it needs.' })}
        <ApplyItBox prompt={track === 'tech' ? "Look at the last AI API call your team shipped. What was the model actually doing: completing language, or implicitly expected to know live facts? If the latter, where should the retrieval layer sit?" : "Think of one thing your team asked an AI tool to do that gave a wrong or unreliable answer. Was the task a language problem (the right tool) or a data-lookup problem (the wrong tool)? What would the right design have looked like?"} />
        <QuizEngine conceptId="genai-m1-what-it-is" conceptName="What GenAI Is" moduleContext={moduleContext} staticQuiz={QUIZZES[0]} />
        <NextChapterTeaser text={track === 'tech' ? "Aarav now knows what the model is. The next question is where it is reliable — and where even the best model consistently fails. Those boundaries matter more than model quality." : "Rhea now knows what the model is. The next question is where it is genuinely useful and where it is reliably wrong — and that boundary has very little to do with which tool you choose."} />
      </ChapterSection>

      <ChapterSection num="02" accentRgb={ACCENT_RGB} id="genai-m1-capabilities">
        {chLabel('The Capability Map')}
        {h2('Every model has a reliable zone. Most teams use it outside that zone.')}
        <SituationCard accent="#2563EB" accentRgb="37,99,235">
          {track === 'tech'
            ? <>Aarav maps the team&apos;s attempted LLM use cases on a whiteboard. Classification of inbound request types: works reliably. Summarising long case notes: works well. Extracting structured fields from free-text forms: mostly works. Performing arithmetic on claim amounts: unreliable. Answering questions about current patient records: fails without retrieval. Generating legally precise contract language: too risky without review. The pattern becomes obvious. The model is powerful inside a specific zone, and brittle outside it.</>
            : <>Rhea lists every AI experiment her team has run in the last two months. She puts them in three columns: worked well, sometimes worked, failed or caused problems. The pattern is clear. When the task was language — drafting an email, summarising a case, rewriting a form — AI helped. When the task needed specific facts, live data, or precise calculations — it consistently failed. No one had drawn this map before. They had been treating AI as uniformly capable or uniformly unreliable.</>}
        </SituationCard>
        {para('LLMs have a clear zone of reliable performance: language tasks where the input and output are both text, no live data is required, and quality can be assessed quickly by a reader. Summarisation, classification, drafting, explanation, rewriting, extraction from documents — these sit firmly in the reliable zone.')}
        {para('Beyond that zone, there is an extended zone where LLMs can perform well with the right infrastructure: retrieval-augmented tasks where the model reasons over documents you provide, structured outputs where the format is tightly controlled, or tool-augmented tasks where the model calls external systems. These work, but they require design effort.')}
        {para('Then there is the unreliable zone. Precise arithmetic on novel numbers. Accurate recall of specific facts from training data. Real-time information without retrieval. Legally or clinically sensitive outputs where every word matters. Tasks with no objective verifiable answer. The model will attempt these confidently. It will often be wrong.')}
        {para('Teams that understand this map stop over-expecting from the reliable zone and under-investing in the extended zone. They stop being surprised by failures and start designing around boundaries instead.')}
        {keyBox('The three zones', [
          'Reliable: summarise, classify, draft, explain, extract, reformat. Language in, language out.',
          'Extended: retrieval-augmented Q&A, structured outputs, tool-augmented workflows. Needs infrastructure.',
          'Unreliable: real-time data, precise calculations, sensitive factual claims, novel edge cases.',
        ], '#2563EB')}
        <GenAIAvatar
          name="Rohan"
          nameColor="#2563EB"
          borderColor="#2563EB"
          conceptId="genai-m1-capabilities"
          content="Most LLM disappointments come from tasks in the unreliable zone being treated as if they were in the reliable zone."
          expandedContent="The model does not announce when it crosses into uncertain territory. It continues generating with the same fluency. That is what makes capability mapping critical — the model looks equally confident everywhere. You have to know the zones before you assign the tasks."
          question="A team wants to use an LLM to auto-check whether submitted forms contain all required fields. Which zone does this sit in?"
          options={[
            { text: 'Unreliable — the model cannot do structured validation consistently', correct: false, feedback: 'Extraction and structured checking from documents is actually a reliable-zone task for modern LLMs, especially with a well-defined schema.' },
            { text: 'Reliable — extracting structured data from free-text forms is a core language task', correct: true, feedback: 'Exactly. Given a clear schema and consistent input format, LLMs are very good at extracting and validating structure from text.' },
            { text: 'Extended — this requires retrieval infrastructure to work at all', correct: false, feedback: 'If the form is in the prompt, no retrieval is needed. Extraction from provided text is in the reliable zone.' },
          ]}
        />
        <GenAIAvatar
          name="Leela"
          nameColor="#2563EB"
          borderColor="#2563EB"
          conceptId="genai-m1-capabilities"
          content="I think about capability zones in terms of where errors are acceptable versus where they are costly. That determines how much verification a task needs."
          expandedContent="A draft email that is 90% right saves time even if a human edits it. A premium calculation that is 90% right is a liability. The capability zone tells you what the model can produce. Risk assessment tells you whether that is good enough. Both questions matter before you assign a task."
          question="Which capability zone concern is most operationally serious?"
          options={[
            { text: 'The model is inconsistent about tone in customer-facing draft emails', correct: false, feedback: 'Tone inconsistency in drafts is a quality issue, but easily caught in human review before sending.' },
            { text: 'The model is used to compute claim payment amounts directly from submitted figures', correct: true, feedback: 'Arithmetic on real financial figures is in the unreliable zone. Errors here are both likely and consequential.' },
            { text: 'The model sometimes formats summaries differently across runs', correct: false, feedback: 'Format variance in summaries is annoying but low-risk — the information is still there and reviewable.' },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Map your last three LLM integration attempts across the three zones: reliable, extended, unreliable. For any that failed, which zone were they actually in? What would the right infrastructure have been?" : "List three AI tasks your team has tried. Label each: reliable zone, extended zone (needs retrieval/tools), or unreliable zone (should not rely on the model alone). What does that map tell you about where to invest next?"} />
        <QuizEngine conceptId="genai-m1-capabilities" conceptName="Capability Map" moduleContext={moduleContext} staticQuiz={QUIZZES[1]} />
        <NextChapterTeaser text={track === 'tech' ? "Aarav has the capability map. But knowing the zones does not tell you how to assign tasks well. That requires a shift in how you think about what you are giving the model — from question to specification." : "Rhea has the capability map. But knowing where AI is reliable does not mean her team will use it well. That depends on a different shift: from asking questions to writing specifications."} />
      </ChapterSection>

      <ChapterSection num="03" accentRgb={ACCENT_RGB} id="genai-m1-mental-model">
        {chLabel('The Mental Model Shift')}
        {h2('You are not asking a question. You are specifying a task.')}
        <SituationCard accent="#0F766E" accentRgb="15,118,110">
          {track === 'tech'
            ? <>Aarav notices a pattern in how his team writes prompts. They ask: &ldquo;Can you summarise this case?&rdquo; The model returns something. Sometimes it is one paragraph, sometimes six. Sometimes it includes risk flags, sometimes it ignores them. The frustration is real. But when he rewrites the same prompt as a specification — role, output format, required fields, length constraint, what to exclude — the variance collapses. Same model. Same task. Completely different reliability.</>
            : <>Rhea watches her team use the AI assistant for a week. She notices that the people getting useful results are writing very different kinds of prompts from the people getting frustrating ones. The useful prompts are long and specific: what the task is, what format the output should take, what to include and what to skip. The frustrating ones are short questions: &ldquo;Summarise this.&rdquo; &ldquo;What should I do?&rdquo; She realises this is not a model quality problem. It is a communication problem.</>}
        </SituationCard>
        {para('Most people approach LLMs the way they approach a search engine: type a question, expect an answer. That mental model produces inconsistent results because search engines retrieve; LLMs complete. When you type a vague question, the model fills every unspecified dimension — format, length, perspective, tone, level of detail — with plausible defaults from its training. Those defaults may not match what you need.')}
        {para('The shift is from asking to specifying. A well-specified task tells the model: what role to take, what the input is, what the output format must be, what constraints apply, and what success looks like. When those dimensions are defined, the model stops choosing them. Variance drops. Quality improves. Not because the model got better — because the brief got clearer.')}
        {para('This is the most immediately actionable insight in this entire module. You do not need new tools, new models, or new infrastructure to experience it. Write a vague prompt, note the output. Write the same task as a specification, note the output. The difference is usually dramatic.')}
        {pullQuote('Vague brief, model chooses. Specific brief, you choose. The model executes either way.')}
        {keyBox('Elements of a clear task specification', [
          'Role: who the model should behave as ("You are a claims triage analyst").',
          'Task: what to do, precisely ("Classify this request into one of five categories").',
          'Format: what the output must look like ("Return JSON with fields: category, confidence, rationale").',
          'Constraints: what to include, exclude, or prioritise.',
          'Examples: one or two demonstrations anchor style and level of detail.',
        ], '#0F766E')}
        <GenAIAvatar
          name="Anika"
          nameColor="#0F766E"
          borderColor="#0F766E"
          conceptId="genai-m1-mental-model"
          content="When outputs are inconsistent across runs, teams usually blame the model. The brief is almost always the real variable."
          expandedContent="I ask teams to run a simple experiment: take their worst-performing prompt and add format, length, and constraint specifications without changing anything else. The improvement rate is very high. Inconsistency is almost always a symptom of an underspecified brief — the model fills the gaps differently each time. Define the gaps, and the variance disappears."
          question="A summarisation task gives excellent output sometimes and generic output other times. Most likely cause?"
          options={[
            { text: 'High variance is a fundamental limitation of probabilistic models', correct: false, feedback: 'Variance is real, but it is dramatically reduced when format, length, and structure are specified explicitly.' },
            { text: 'The brief is missing format, length, or structure constraints', correct: true, feedback: 'Yes. When those dimensions are unspecified, the model fills them differently each run. Define them once, and variance collapses.' },
            { text: 'The model needs domain-specific fine-tuning to stabilise for this task', correct: false, feedback: 'Fine-tuning can help, but it is rarely the right first fix for variance caused by an underspecified brief.' },
          ]}
        />
        <GenAIAvatar
          name="Kabir"
          nameColor="#0F766E"
          borderColor="#0F766E"
          conceptId="genai-m1-mental-model"
          content="The most underused technique in prompting is examples. One good example teaches format, tone, level of detail, and scope all at once."
          expandedContent="Teams spend a lot of effort writing instructions and then wonder why the model interprets them differently than expected. An example shows, rather than tells. If I give the model a sample input and the exact output I want for it, ambiguity disappears. The model has a concrete reference point. It stops guessing about what I mean."
          question="What is the fastest way to anchor format and style in a reusable prompt?"
          options={[
            { text: 'Write detailed written instructions covering every possible edge case', correct: false, feedback: 'Detailed instructions help, but they often still leave room for interpretation. An example is more efficient at conveying format intent.' },
            { text: 'Add one sample input-output pair so the model has a concrete reference', correct: true, feedback: 'Exactly. A single well-chosen example teaches format, length, tone, and scope more efficiently than instructions alone.' },
            { text: 'Switch to a different model that better understands your domain', correct: false, feedback: 'Model choice rarely solves format consistency issues. A clearer brief almost always does.' },
          ]}
        />
        {PMPrincipleBox({ principle: 'Every gap in a prompt is a decision the model makes for you. Decide intentionally or accept whatever the model chooses.' })}
        <ApplyItBox prompt={track === 'tech' ? "Take the worst-performing LLM call in your current stack. Identify the unspecified dimensions: role, output format, constraints, examples. Rewrite the prompt with each one defined. What changed?" : "Find a prompt your team uses regularly that gives inconsistent results. Identify the unspecified gaps — format, length, perspective, what to exclude. Add them. Compare the output before and after."} />
        <QuizEngine conceptId="genai-m1-mental-model" conceptName="Mental Model Shift" moduleContext={moduleContext} staticQuiz={QUIZZES[2]} />
        <NextChapterTeaser text={track === 'tech' ? "Aarav has the specification mindset. But a well-written prompt still fails when what it processes is poor. The quality of the context packet is often the deciding variable." : "Rhea can write better specifications now. But there is one more thing that determines whether a good prompt produces a good output — what the model actually receives to work with."} />
      </ChapterSection>

      <ChapterSection num="04" accentRgb={ACCENT_RGB} id="genai-m1-context">
        {chLabel('Context Is the Input')}
        {h2('The quality of the output is bounded by the quality of what went in.')}
        <SituationCard accent="#C2410C" accentRgb="194,65,12">
          {track === 'tech'
            ? <>Aarav&apos;s team has a prompt that works well in testing. In staging, the same prompt produces poor outputs on roughly one in five cases. When he inspects the failing runs, the pattern is immediate: the context packets are broken. A patient record with missing fields. A case note that was truncated at the API limit. An intake form where the structured fields were flattened into a single string. The model was not failing. It was doing its best with damaged input.</>
            : <>Rhea notices that the AI summary tool works well when her team uses it on recent, fully completed cases, but struggles on older cases with partial records. A colleague says the model is &ldquo;inconsistent.&rdquo; Rhea pulls up two examples side by side — one good output, one poor one. The difference is not the prompt. The poor output came from a case with half the fields missing and two attached PDFs that never loaded. The model received a skeleton and wrote accordingly.</>}
        </SituationCard>
        {para('Context is not configuration. It is the actual input the model receives. Everything the model knows about your specific situation — the case, the document, the request, the background — must be in the context window at inference time. The model has no memory between calls, no access to prior sessions, no ability to retrieve information it was not sent.')}
        {para('This means the quality of your outputs is bounded by the quality of your inputs. A well-written prompt with poor, incomplete, or incorrectly structured context will produce a poor output. Not because the model failed — because it did exactly what you asked with what you gave it. The garbage-in-garbage-out principle applies more literally to LLMs than to almost any other system.')}
        {para('The most common gap between demo and production is almost always a context quality gap. Demo inputs are hand-crafted and clean. Production inputs are assembled from real, messy, incomplete, inconsistently formatted data. When a model that worked perfectly in a demo produces poor results in production, the first thing to inspect is the context packet, not the prompt.')}
        {keyBox('What belongs in a good context packet', [
          'The task input: the document, case note, request, or record being processed.',
          'Relevant background: role of the reader, purpose of the output, audience.',
          'Constraints: what to include, exclude, or flag.',
          'Format of the input: tell the model what type of data it is reading.',
        ], '#C2410C')}
        <GenAIAvatar
          name="Rohan"
          nameColor="#C2410C"
          borderColor="#C2410C"
          conceptId="genai-m1-context"
          content="When a model works in demo and fails in production, I look at the context packet first. It is the right answer 80% of the time."
          expandedContent="Demo data is curated. Someone assembled a clean, complete example specifically to show the workflow working. Production data arrives from real systems — missing fields, truncated strings, inconsistent formats, encoding issues. The model is the same. The payload is different. That gap explains almost every demo-to-production failure I have investigated."
          question="A model works well in demo but gives poor outputs in staging. Best first thing to investigate?"
          options={[
            { text: 'Whether model drift has occurred between the demo and staging environments', correct: false, feedback: 'Models do not drift between environments. The model is the same everywhere you call it.' },
            { text: 'Whether the context in staging is as complete and clean as in the demo', correct: true, feedback: 'Yes. Demo data is curated. Staging data is real — missing fields, edge cases, truncation. That difference explains most output quality gaps.' },
            { text: 'Whether a higher-tier model is needed to handle real production inputs', correct: false, feedback: 'Upgrading the model rarely solves a context quality problem. The model needs better inputs, not more parameters.' },
          ]}
        />
        <GenAIAvatar
          name="Leela"
          nameColor="#C2410C"
          borderColor="#C2410C"
          conceptId="genai-m1-context"
          content="Context assembly is where a lot of the real engineering effort lives in a production AI system — and it is where most teams underinvest."
          expandedContent="The model is the easy part. APIs are easy. The hard part is reliably assembling a complete, correctly structured context packet every time a request comes in — with the right fields, in the right format, with the right fallback when a field is missing. That is real engineering. And it is what separates a demo that works once from a workflow that works every Monday morning."
          question="Your team wants to improve AI output quality. Which investment has the highest expected return?"
          options={[
            { text: 'Upgrade to a more powerful model to handle edge cases better', correct: false, feedback: 'A more powerful model receiving a poor context packet still produces a poor output. Context quality is almost always the binding constraint.' },
            { text: 'Improve context assembly — ensure all required fields arrive clean and complete', correct: true, feedback: 'Exactly. If the context is complete and correctly structured, output quality improves dramatically without any model change.' },
            { text: 'Add more instructions to the system prompt to compensate for missing context', correct: false, feedback: 'Instructions cannot substitute for missing information. If the model does not have the data, instructions cannot conjure it.' },
          ]}
        />
        {PMPrincipleBox({ principle: 'The model cannot produce what it does not have. Fix the context before you fix the prompt.' })}
        <ApplyItBox prompt={track === 'tech' ? "Pick a production LLM call that produces inconsistent outputs. Inspect the context packet across good and bad cases. What fields are present in good runs but missing or malformed in poor ones? What does the context assembly layer need to fix?" : "Find a case where an AI tool gave you a surprisingly poor output. What was actually in the context it received? Was any important information missing, truncated, or in the wrong format? What would a complete context packet have looked like?"} />
        <QuizEngine conceptId="genai-m1-context" conceptName="Context as Input" moduleContext={moduleContext} staticQuiz={QUIZZES[3]} />
        <NextChapterTeaser text={track === 'tech' ? "Aarav now has the four fundamentals: what the model is, where it is reliable, how to specify tasks, and why context quality matters. The last question is: which task do you actually start with?" : "Rhea now has the four fundamentals. The last question is the most practical one: given everything you have learned, which use case do you actually build first?"} />
      </ChapterSection>

      <ChapterSection num="05" accentRgb={ACCENT_RGB} id="genai-m1-apply">
        {chLabel('Your First Use Case')}
        {h2('Win clearly. Verify easily. Fail cheaply.')}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          {track === 'tech'
            ? <>Aarav has three candidates for a first AI integration. Option one: auto-approve routine claims exceptions based on pattern matching and AI scoring. Option two: classify inbound case requests by type and urgency, flagging uncertain cases for human review. Option three: build an autonomous agent that monitors the intake queue, routes requests, and takes action without human checkpoints. He applies the readiness criteria. Two candidates fail immediately. One is ready to build.</>
            : <>Rhea has three candidates for a first AI workflow. Option one: draft responses to provider complaints using AI, sent directly without review. Option two: classify inbound escalations by category and urgency, with human review of low-confidence cases. Option three: automatically resolve routine exception requests based on AI confidence scores. She runs them through a simple filter. The answer is obvious once she knows what to look for.</>}
        </SituationCard>
        {para('Choosing the right first AI use case is not about finding the most impressive one. It is about finding one where success is clear, failure is cheap, and the team learns as much as possible from running it. Most teams choose the wrong first use case — too ambitious, too irreversible, or too hard to verify — and their early AI experience produces expensive confusion instead of a foundation to build on.')}
        {para('A strong first use case has five properties: the task is language-based (input and output are text, no live database queries required), the output is bounded (a category, a summary, a draft — not a final decision or an irreversible action), the output is easy to verify (a human can quickly assess whether the result is good), mistakes are recoverable (if the model is wrong, the error is caught before causing harm), and no live data is required (the task does not depend on current records the model cannot have).')}
        {para('Classification with a human review gate is the archetype. The model reads an inbound request, assigns a category and urgency, and flags low-confidence cases for a human. The model does not update any record, send any message, or take any action. It suggests. A human confirms. The system learns where it fails. That is how you build trust before you extend autonomy.')}
        {keyBox('First use case readiness criteria', [
          'Language-based: text in, text out. No live database access needed.',
          'Bounded output: category, summary, or draft — not a final action.',
          'Easy to verify: a human can quickly check whether the output is right.',
          'Recoverable: errors are caught before they cause harm.',
          'No live data dependency: the task works on documents and text you already have.',
        ], ACCENT)}
        <GenAIAvatar
          name="Anika"
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-m1-use-case-readiness"
          content="The purpose of the first use case is not efficiency. It is proof that your team can build, observe, and improve an AI system reliably."
          expandedContent="Efficiency comes later, once the system has earned it. The first deployment should teach the team where the model fails, how to catch those failures, and what the context needs in order for the model to perform well. All of that learning requires a low-stakes, easy-to-verify workflow. Choose it deliberately."
          question="Which candidate makes the best first AI use case?"
          options={[
            { text: 'Auto-approve routine policy exceptions to cut manual review time', correct: false, feedback: 'Auto-approval is an irreversible action with high stakes. It does not meet the recoverable or bounded criteria for a first use case.' },
            { text: 'Classify inbound requests and flag uncertain cases for human review', correct: true, feedback: 'Exactly. Bounded output, easy to verify, recoverable, no live data dependency. This is the archetype for a strong first use case.' },
            { text: 'Build a fully autonomous intake agent to handle requests end-to-end', correct: false, feedback: 'Full autonomy at the start skips the trust-building stages. The team has not yet learned where the model fails.' },
          ]}
        />
        <GenAIAvatar
          name="Kabir"
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-m1-use-case-readiness"
          content="Teams that start with the most ambitious use case almost always end up doing less than teams that start with the most learnable one."
          expandedContent="An ambitious first use case generates a lot of complexity and a lot of noise. The team cannot tell what is failing or why. A simple, bounded first use case generates clean signal: is the classification right? If not, which cases failed, and what did the context look like? That is the kind of learning that compounds. Start learnable. Scale to ambitious once you have the foundation."
          question="A team argues that starting with a simple classification task is too modest. They want to build a full autonomous agent for their first deployment. What is the strongest counterargument?"
          options={[
            { text: 'Agents require too much technical infrastructure to start with', correct: false, feedback: 'Infrastructure complexity is a real concern, but it is not the strongest argument against starting with an agent.' },
            { text: 'A full autonomous agent gives the team no way to learn where the model fails before it acts', correct: true, feedback: 'Exactly. Without a review gate, failures are invisible until they cause harm. A bounded first use case generates the learning needed to extend autonomy safely.' },
            { text: 'Agents are only suitable for large enterprises with dedicated AI teams', correct: false, feedback: 'Agents can work at any scale. The issue is sequencing — earning autonomy before granting it.' },
          ]}
        />
        {PMPrincipleBox({ principle: 'Win clearly, verify easily, fail cheaply. That is the brief for the first use case.' })}
        <ApplyItBox prompt={track === 'tech' ? "Name three AI integration candidates from your current team. Apply the five criteria: language-based, bounded output, easy to verify, recoverable, no live data required. Which candidate scores best? What does building it first unlock?" : "Name one AI workflow you have been considering. Run it through the five criteria. Where does it pass, and where does it fail? What would a simpler, lower-stakes version of the same idea look like that clears all five?"} />
        <QuizEngine conceptId="genai-m1-use-case-readiness" conceptName="Use-Case Readiness" moduleContext={moduleContext} staticQuiz={QUIZZES[4]} />
        <NextChapterTeaser text={track === 'tech' ? "Aarav has the mental model, the capability map, the specification habit, the context discipline, and a first use case. Pre-Read 02 goes inside the model: how to write prompts that stay reliable under production conditions." : "Rhea now has everything she needs to think clearly about GenAI. Pre-Read 02 goes deeper: how to write prompts that produce consistent, reliable outputs when real, messy data is flowing through them."} />
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
          if (entry.intersectionRatio >= 0.1) setActiveSection(sectionId);
          if (entry.intersectionRatio >= 0.25) {
            setCompletedSections((prev) => new Set([...prev, sectionId]));
            store.markSectionViewed(sectionId);
          }
        }
      });
    }, { threshold: [0.1, 0.25, 0.5] });

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
            <div style={{ width: '80px', flexShrink: 0 }} />
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
            <CoreContent track={track} />
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

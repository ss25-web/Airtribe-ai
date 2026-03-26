'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import QuizEngine from './QuizEngine';
import GenAIAvatar from './GenAIAvatar';
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
const MODULE_CONTEXT = `GenAI Launchpad · Pre-Read 01 · Orientation & AI Mindset.
Follows Rhea, an operations lead at Northstar Health, as she moves from ad-hoc AI experiments to designing reliable n8n-based workflows. Covers workflow thinking, the GenAI stack, the role of n8n as orchestration and control, early use-case judgment, and system framing.`;

const TRACK_META: Record<GenAITrack, { label: string; shortLabel: string; introTitle: string; moduleContext: string }> = {
  'non-tech': {
    label: 'Workflow & Operator Track',
    shortLabel: 'Non-Tech',
    introTitle: 'Orientation & AI Mindset · Workflow Lens',
    moduleContext: `GenAI Launchpad · Non-Tech Track · Pre-Read 01 · Orientation & AI Mindset.
Follows Rhea, an operations lead at Northstar Health, as she moves from ad-hoc AI experiments to designing reliable n8n-based workflows. Emphasizes workflow clarity, review loops, safe use cases, and business-first system thinking.`,
  },
  tech: {
    label: 'Tech Builder Track',
    shortLabel: 'Tech',
    introTitle: 'Orientation & AI Mindset · Builder Lens',
    moduleContext: `GenAI Launchpad · Tech Track · Pre-Read 01 · Orientation & AI Mindset.
Follows Aarav, a platform-minded builder at Northstar Health, as he turns messy AI experiments into reliable n8n-based workflows. Emphasizes payloads, control logic, implementation reliability, and observability.`,
  },
};

const trackText = <T,>(track: GenAITrack, values: Record<GenAITrack, T>) => values[track];

const QUIZZES = [
  {
    question: "A team says, 'We need a better prompt for our incident-triage workflow.' What is the strongest response?",
    options: [
      'A. Start rewriting the prompt first because the model is the core product',
      'B. Ask what triggers the workflow, what context is available, and what should happen when the output is uncertain',
      'C. Switch to a stronger model before looking at the workflow',
      'D. Add more examples and hope reliability improves enough',
    ],
    correctIndex: 1,
    explanation: 'Prompt quality matters, but workflow design matters first. Reliable systems depend on trigger quality, context, validation, fallback paths, and human review logic around the model.',
    conceptId: 'genai-workflow-thinking',
    keyInsight: 'The model is only one component. The workflow around it determines whether the system is trustworthy.',
  },
  {
    question: 'Which change usually improves a GenAI workflow most reliably?',
    options: [
      'A. Making the prompt longer without changing any inputs',
      'B. Improving the trigger, tightening the context, and validating the output structure',
      'C. Turning the workflow into a fully autonomous agent immediately',
      'D. Adding more downstream tools before the flow is stable',
    ],
    correctIndex: 1,
    explanation: 'Most brittle workflows fail because poor inputs, weak context, or messy outputs propagate through the system. Tightening those layers usually helps more than adding model cleverness.',
    conceptId: 'genai-orchestration',
    keyInsight: 'Reliability often comes from input discipline and control logic, not prompt cleverness.',
  },
  {
    question: 'Why is n8n the backbone of this program?',
    options: [
      'A. Because it replaces external systems and APIs',
      'B. Because it is where logic, retries, approvals, and observability can be made explicit',
      'C. Because it hides complexity so teams do not need to think about execution paths',
      'D. Because it guarantees model outputs will be correct',
    ],
    correctIndex: 1,
    explanation: 'n8n is valuable here because it acts as the orchestration and control layer. It makes workflow behavior inspectable and maintainable instead of opaque.',
    conceptId: 'genai-n8n-role',
    keyInsight: 'A good orchestration layer makes the system legible when it works and when it fails.',
  },
  {
    question: 'Which is the best early AI workflow to automate first?',
    options: [
      'A. Auto-reject job candidates based on inferred fit',
      'B. Auto-approve policy exceptions without Human Reviewer sign-off',
      'C. Categorize inbound operational requests and route ambiguous ones to a Human Reviewer',
      'D. Give an agent permission to execute any outbound action that seems useful',
    ],
    correctIndex: 2,
    explanation: 'Request classification is bounded, structured, and easy to route into Human Reviewer checkpoints. The others involve higher-risk decisions and less forgiving failure modes.',
    conceptId: 'genai-use-case-judgment',
    keyInsight: 'Strong early use cases are bounded, reviewable, and safe to recover from.',
  },
  {
    question: 'What best shows that you understand a workflow well enough to build it?',
    options: [
      'A. You know which tools are popular for the problem',
      'B. You have already drafted a very long prompt',
      'C. You can explain the trigger, context, model step, control logic, and fallback clearly',
      'D. You have decided to add an agent loop because it sounds powerful',
    ],
    correctIndex: 2,
    explanation: 'Clear system framing is the sign of real understanding. Once the workflow shape is clear, tool decisions and implementation details become much easier.',
    conceptId: 'genai-system-framing',
    keyInsight: 'Workflow clarity matters more than tool familiarity.',
  },
];

const CONCEPTS = [
  { id: 'genai-workflow-thinking', label: 'Workflow Thinking', color: '#7C3AED' },
  { id: 'genai-orchestration', label: 'Orchestration', color: '#2563EB' },
  { id: 'genai-n8n-role', label: 'n8n Role', color: '#0F766E' },
  { id: 'genai-use-case-judgment', label: 'Use-Case Judgment', color: '#C2410C' },
  { id: 'genai-system-framing', label: 'System Framing', color: '#DC2626' },
];
const SECTIONS = [
  { id: 'genai-preread-intro', label: 'AI-Native Workflows' },
  { id: 'genai-preread-stack', label: 'The GenAI Stack' },
  { id: 'genai-preread-n8n', label: 'Why n8n Matters' },
  { id: 'genai-preread-judgment', label: 'Good Use Cases' },
  { id: 'genai-preread-apply', label: 'Apply It' },
];
const BADGES = [
  { id: 'genai-preread-intro', icon: 'AI', label: 'Mindset', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'genai-preread-stack', icon: 'ST', label: 'Stack', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'genai-preread-n8n', icon: 'N8', label: 'n8n', color: '#0F766E', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'genai-preread-judgment', icon: 'JC', label: 'Judgment', color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
  { id: 'genai-preread-apply', icon: 'GO', label: 'Operator', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
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

function CoreContent({ track }: { track: GenAITrack }) {
  const moduleContext = TRACK_META[track].moduleContext;
  const protagonist = track === 'tech' ? 'Aarav' : 'Rhea';
  const protagonistRole = track === 'tech' ? 'Platform Engineer · Northstar Health' : 'Operations Lead · Northstar Health';
  const protagonistDesc = track === 'tech'
    ? 'Building reliable AI systems out of messy ad-hoc scripts and broken pipelines.'
    : 'Turning chaotic AI experiments into workflows her team can actually trust.';

  const MENTORS = [
    { name: 'Anika', role: 'AI Workflow Strategist', desc: 'System design before tool selection.', color: '#7C3AED', initial: 'A' },
    { name: 'Rohan', role: 'Automation Engineer', desc: 'Payloads, retries, and execution paths.', color: '#2563EB', initial: 'R' },
    { name: 'Leela', role: 'Risk & Compliance', desc: 'Where Human Reviewers must stay in the loop.', color: '#C2410C', initial: 'L' },
    { name: 'Kabir', role: 'Operations Intelligence', desc: 'Judgment on what to automate — and when.', color: '#0F766E', initial: 'K' },
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
            Orientation &amp; AI Mindset
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '28px' }}>
            &ldquo;The real product is not the prompt. The real product is the workflow around the prompt.&rdquo;
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
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: track === 'tech' ? 'rgba(15,118,110,0.2)' : `rgba(${ACCENT_RGB},0.15)`, border: `2px solid ${track === 'tech' ? '#0F766E' : ACCENT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px', color: track === 'tech' ? '#0F766E' : ACCENT, fontFamily: "'Lora', Georgia, serif", flexShrink: 0 }}>
                  {protagonist[0]}
                </div>
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
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: `${m.color}18`, border: `2px solid ${m.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px', color: m.color, fontFamily: "'Lora', Georgia, serif", flexShrink: 0 }}>{m.initial}</div>
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
              'Understand why workflow design matters more than prompt quality for reliable AI systems',
              'Map the GenAI stack: trigger → context → model → control → outcome',
              'Learn why n8n is the control layer, not just a connector',
              'Identify which workflows deserve AI early — and which ones don\'t yet',
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
            ? 'In this version of Module 01, we will keep asking how the workflow is implemented: what triggers the run, what payload enters the system, what output shape is required, and where validation, retries, and observability live.'
            : 'In this version of Module 01, we will keep asking whether the workflow deserves AI in the first place: what decision it helps with, where Human Reviewers belong, and how to design a useful system before getting lost in implementation detail.'}
        </div>
      </div>

      <ChapterSection num="01" accentRgb={ACCENT_RGB} id="genai-preread-intro" first>
        {chLabel('Week 0 · Orientation & AI Mindset')}
        {h2('AI is useful when you stop treating it like a magic answer engine')}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          {track === 'tech'
            ? <>Aarav is a platform engineer at Northstar Health. His team handles tooling for provider workflows, claims processing, and partner integrations. Colleagues are using AI APIs in ad-hoc scripts. Some work. Most break silently. Aarav realizes the problem is not the model. It is that there is no trigger discipline, no retry logic, no observability, and no control layer making the system legible.</>
            : <>Rhea leads operations at Northstar Health. Her team handles provider escalations, claims exceptions, partner intake, and internal follow-ups every week. People are already pasting snippets into ChatGPT to move faster. The results are mixed. Some outputs are useful. Some are wrong. Some bypass the Human Reviewer entirely. Rhea realizes the problem is not &ldquo;we need better prompts.&rdquo; The problem is that the workflow has no clear Workflow Operator, Human Reviewer, or control layer.</>}
        </SituationCard>
        {para('Most teams first approach GenAI as a model prompt problem: write a prompt, call an API, hope the answer is good enough. That is not how reliable AI systems are built. In practice, useful AI work is about designing a system around the model: what triggers it, what context it receives, what it is allowed to do, how its output is checked, and what happens when something fails.')}
        {para('That shift matters because the model is only one part of the workflow. Real work happens around it: requests arrive from forms, inboxes, internal tools, document systems, and operational queues. Someone has to orchestrate that movement, validate the context, and decide what happens next.')}
        {para('This is the mindset reset for the whole GenAI Launchpad. We are not starting from "how do I use a chatbot better?" We are starting from "what work is happening in my team, where does judgment live, and which parts of that flow can be assisted, structured, or automated safely?" That framing changes the kind of systems you build.')}
        {para('An AI-native workflow is not one where AI is used everywhere. It is one where the system is designed consciously around uncertainty. Some steps need Human Reviewer sign-off. Some steps need deterministic rules. Some steps need the model. The Business Process Owner decides which is which, and Risk / Compliance Reviewers often shape those boundaries.')}
        {pullQuote('The real product is not the prompt. The real product is the workflow around the prompt.')}
        {keyBox('What changes in AI-native work', [
          'You design around uncertainty instead of assuming deterministic outputs.',
          'You think in triggers, context, actions, review loops, and recovery paths.',
          'You separate AI suggestions from irreversible actions.',
        ], ACCENT)}
        <GenAIAvatar
          name="Anika"
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-workflow-thinking"
          content="If you only improve the prompt, you might improve the answer a little. If you improve the workflow, you improve reliability, trust, and operational usefulness."
          expandedContent="That is why this program starts with systems thinking. Before we talk about agents, toolchains, or capstones, we need the right mental model for where AI belongs in a workflow."
          question="Which framing is stronger for a production AI workflow?"
          options={[
            { text: 'The model is the product, and orchestration is secondary.', correct: false, feedback: 'That framing usually leads to fragile workflows because validation, routing, and recovery get treated as afterthoughts.' },
            { text: 'The workflow is the product, and the model is one component inside it.', correct: true, feedback: 'Exactly. Reliability usually comes from the surrounding system, not from the model alone.' },
            { text: 'A stronger model removes the need for workflow design.', correct: false, feedback: 'Even strong models still need context handling, guardrails, and clear decision boundaries.' },
          ]}
        />
        <GenAIAvatar
          name="Kabir"
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-system-framing"
          content="The easiest way to spot shallow AI thinking is this: the team can describe the prompt, but cannot describe the failure mode."
          expandedContent="If I ask what happens when the model returns the wrong structure, or when confidence is low, or when the upstream data is incomplete, and the answer is silence, then the team has built a model call, not a workflow. Strong Workflow Operators think about failure paths as early as happy paths."
          question="A team shows you an AI workflow demo that works on the happy path. What question should you ask next?"
          options={[
            { text: 'Which model did you use and what is its benchmark score?', correct: false, feedback: 'That might matter later, but it does not tell you whether the workflow is operationally trustworthy.' },
            { text: 'What happens when the output is wrong, malformed, or low confidence?', correct: true, feedback: 'Exactly. That question forces the team to reveal whether they have designed for real-world reliability.' },
            { text: 'Can we add more tools so the agent feels more advanced?', correct: false, feedback: 'More tools often increase complexity before the fundamentals are sound.' },
          ]}
        />
        {PMPrincipleBox({ principle: 'The first serious AI question is not “Can the model do this?” It is “What happens when it does this imperfectly?”' })}
        <ApplyItBox prompt="Think of one AI experiment your team has already tried. Which role was missing from the design: Business Process Owner, Human Reviewer, Risk / Compliance Reviewer, Systems / Platform Engineer, or Source System Owner?" />
        <QuizEngine conceptId="genai-workflow-thinking" conceptName="Workflow Thinking" moduleContext={moduleContext} staticQuiz={QUIZZES[0]} />
        <NextChapterTeaser text={track === 'tech' ? "Aarav now sees that prompt quality is only one layer. The next question is where the rest of the system actually lives: trigger, context, control, and destination." : "Rhea now sees that prompt quality is only one layer. The next question is where the rest of the system actually lives: trigger, context, control, and destination."} />
      </ChapterSection>

      <ChapterSection num="02" accentRgb={ACCENT_RGB} id="genai-preread-stack">
        {chLabel('The Stack')}
        {h2('Where GenAI systems actually live')}
        <SituationCard accent="#2563EB" accentRgb="37,99,235">
          {track === 'tech'
            ? <>Aarav opens a diagram of their exception-handling pipeline. Intake arrives via webhook. Policy history sits in a Postgres database. Process docs live in Notion. The team wants AI to summarize the case, estimate urgency, and suggest a route. That is the moment he sees it clearly: the model call is one step inside a much larger execution path with payloads, context fetching, output validation, and downstream routing.</>
            : <>Rhea sketches the current exception-handling process on a whiteboard. Intake comes from a form. Policy history lives in an internal system. Process docs live in Notion. The team wants AI to summarize the case, estimate urgency, and suggest a route. That is the first moment she sees it clearly: the model is only one box in a much larger path.</>}
        </SituationCard>
        {para('A useful GenAI stack usually has five layers: trigger, context, model, logic, and destination. An operational request arrives. Relevant case context is fetched. A model classifies or drafts. Logic decides whether to route, escalate, retry, or request Human Reviewer approval. Then the result lands in Slack, email, a case system, or a database.')}
        {para('The important thing is that the model does not sit alone. It sits inside a controlled execution path. That is the difference between a fun demo and a workflow the team can trust on a Monday morning.')}
        {para('This is also why the same model can feel magical in one workflow and disappointing in another. If the context is poor, if the input arrives in messy formats, if the downstream action is vague, or if the system has no recovery logic, the experience will feel brittle. The stack around the model determines whether the workflow is robust.')}
        {para('A helpful mental model is to think of the LLM as a probabilistic reasoning component inside a mostly deterministic system. The system decides when to call it, what to ask, what shape the answer must take, and what happens if the answer fails the check.')}
        {PMPrincipleBox({ principle: 'A model call without a workflow is a demo. A model call inside a controlled system is a product capability.' })}
        {keyBox('A simple execution path', [
          'Trigger: a webhook, schedule, form, or inbox event starts the run.',
          'Context: documents, CRM state, or prior messages get pulled in.',
          'Model: the LLM summarizes, classifies, extracts, or drafts.',
          'Control: logic decides whether to continue, wait, retry, or ask a human.',
          'Outcome: the result gets posted, logged, stored, or handed off.',
        ], '#2563EB')}
        <GenAIAvatar
          name="Anika"
          nameColor="#2563EB"
          borderColor="#2563EB"
          conceptId="genai-orchestration"
          content="Operators often over-focus on the model step because it feels sophisticated. In practice, the quality of the trigger and context layers often matters more."
          expandedContent="A sloppy trigger means junk enters the system. Weak context means the model guesses. No validation means downstream systems receive messy outputs. When a workflow disappoints, I look around the model before I blame the model. Usually the surrounding stack is what made the result unreliable."
          question="Which improvement most often increases reliability first?"
          options={[
            { text: 'Add more prompt cleverness without changing the inputs.', correct: false, feedback: 'Prompting helps, but if inputs and context are weak, the gains are usually limited.' },
            { text: 'Tighten the trigger, improve the context, and validate the output shape.', correct: true, feedback: 'Yes. Reliability often improves fastest when the workflow around the model becomes more disciplined.' },
            { text: 'Replace all logic with an agent loop so the system can self-correct.', correct: false, feedback: 'Agent loops can help in some cases, but they are not a substitute for clear workflow design.' },
          ]}
        />
        {ApplyItBox({ prompt: 'Draw one workflow you know using five labels only: trigger, context, model, control, outcome. Which box is weakest right now?' })}
        <QuizEngine conceptId="genai-orchestration" conceptName="The GenAI Stack" moduleContext={moduleContext} staticQuiz={QUIZZES[1]} />
        <NextChapterTeaser text={track === 'tech' ? "Once Aarav can see the stack, a more practical question appears: which layer should actually hold the logic, retries, approvals, and visibility?" : "Once Rhea can see the stack, a more practical question appears: which layer should actually hold the logic, retries, approvals, and visibility?"} />
      </ChapterSection>

      <ChapterSection num="03" accentRgb={ACCENT_RGB} id="genai-preread-n8n">
        {chLabel('Why n8n')}
        {h2('n8n is not just a connector layer. It is the control layer.')}
        <SituationCard accent="#0F766E" accentRgb="15,118,110">
          {track === 'tech'
            ? <>Aarav&apos;s team starts wiring model calls directly into Python scripts. It works until it doesn&apos;t. When he asks &ldquo;Where does the retry logic live? Where does the Human Reviewer checkpoint sit? Where does the Systems / Platform Engineer inspect a failed run?&rdquo;, the answer is nowhere. That is when n8n stops looking like a convenience layer and starts looking like the right execution surface — the place where retries, approvals, observability, and control logic can all become explicit.</>
            : <>The team&apos;s first instinct is to wire everything directly inside app scripts and prompt templates. But once Rhea asks, &ldquo;Where does the Human Reviewer step happen? Where does the Risk / Compliance Reviewer see failures? Where does the Systems / Platform Engineer inspect runs?&rdquo;, the answer is fuzzy. That is when n8n stops looking like a convenience tool and starts looking like the execution surface.</>}
        </SituationCard>
        {para('In this program, n8n is the spine of the system. It is where workflows begin, branch, validate inputs, call models, handle retries, and expose decisions clearly. That matters because the hardest part of production AI is rarely just getting a model output. It is making the system observable, maintainable, and debuggable when real work is flowing through it.')}
        {para('That is why learners will build with webhook nodes, HTTP requests, logic nodes, code nodes, LLM integrations, approvals, and recovery patterns. We are not using n8n as decoration around a chatbot. We are using it as the orchestration layer where Workflow Operator logic, Human Reviewer checkpoints, and system reliability become explicit.')}
        {para('That orchestration role is what makes n8n such a useful teaching surface. You can see the workflow. You can inspect inputs and outputs. You can trace a failed execution. You can reason about where the system branched and why. For learners, that visibility creates a much better mental model than invisible automation hidden behind a single assistant interface.')}
        {para('It also forces good engineering habits early: clear node boundaries, explicit credentials, understandable branching logic, retries for unreliable services, and approval gates for high-risk actions. Those are not “advanced extras.” They are the foundation of trustworthy AI systems.')}
        <GenAIAvatar
          name="Rohan"
          nameColor="#2563EB"
          borderColor="#2563EB"
          conceptId="genai-n8n-role"
          content="Teams get into trouble when they use a low-code tool as a place to draw arrows, but never think about Human Reviewer checkpoints, retries, edge cases, or observability."
          expandedContent="The whole point of an orchestration layer is that it makes system behavior legible. When something fails, you should be able to inspect the path, understand the decision, and recover safely."
          question="Why is n8n the core tool in this program?"
          options={[
            { text: 'Because it makes demos look fast even if the workflow is opaque.', correct: false, feedback: 'Speed helps, but opacity creates reliability problems later.' },
            { text: 'Because it acts as the workflow control layer where logic, validation, retries, and visibility live.', correct: true, feedback: 'Yes. That control layer is what turns scattered model calls into maintainable systems.' },
            { text: 'Because it replaces the need for APIs or external systems.', correct: false, feedback: 'n8n orchestrates across systems. It does not eliminate the need for them.' },
          ]}
        />
        <GenAIAvatar
          name="Leela"
          nameColor="#0F766E"
          borderColor="#0F766E"
          conceptId="genai-orchestration"
          content="The moment a workflow touches a real team, observability stops being optional. Somebody will ask why a request was routed, why an approval was skipped, or why a run failed."
          expandedContent="That is where n8n earns its place. It gives you execution history, node-level visibility, and a legible system shape. In an AI context, that matters twice as much because outputs are probabilistic. If you cannot inspect the path, you cannot debug the behavior. If you cannot debug the behavior, you cannot responsibly scale it."
          question="What makes a workflow maintainable after launch?"
          options={[
            { text: 'Only using the most capable model so the workflow rarely fails.', correct: false, feedback: 'Even strong models fail or behave inconsistently. Maintainability comes from visibility and control.' },
            { text: 'Being able to inspect runs, understand decisions, and recover from failures clearly.', correct: true, feedback: 'Exactly. Maintainability is operational clarity, not just model quality.' },
            { text: 'Reducing every workflow to a single node so it looks simple.', correct: false, feedback: 'A workflow can look simple while becoming impossible to reason about.' },
          ]}
        />
        {ApplyItBox({ prompt: 'Pick a workflow you want to automate. Where would the Business Process Owner need visibility? Where would the Human Reviewer need a checkpoint? Where would the Risk / Compliance Reviewer need an audit trail?' })}
        <QuizEngine conceptId="genai-n8n-role" conceptName="n8n as Control Layer" moduleContext={moduleContext} staticQuiz={QUIZZES[2]} />
        <NextChapterTeaser text={track === 'tech' ? "Aarav now has a place for execution logic. The next decision is harder: which workflows deserve AI at all, and which ones are still too risky?" : "Rhea now has a place for execution logic. The next decision is harder: which workflows deserve AI at all, and which ones are still too risky?"} />
      </ChapterSection>

      <ChapterSection num="04" accentRgb={ACCENT_RGB} id="genai-preread-judgment">
        {chLabel('Use-Case Judgment')}
        {h2('Not every workflow should become an agent')}
        <SituationCard accent="#C2410C" accentRgb="194,65,12">
          A senior teammate proposes an “AI ops agent” that can read requests, update records, trigger follow-ups, and approve routine exceptions automatically. Rhea likes the ambition, but she also notices that the team has not yet agreed on what counts as a safe action, what requires Human Reviewer sign-off, or what happens when the model is unsure.
        </SituationCard>
        {para('One of the most important Workflow Operator skills is deciding where AI adds leverage and where it introduces risk. A good GenAI use case usually has clear inputs, a bounded output format, recoverable mistakes, and obvious Human Reviewer checkpoints. A bad one often combines ambiguity, sensitive consequences, and no clear fallback.')}
        {para('That is why this program is not just about connecting nodes. It is about judgment. When should a workflow summarize? When should it classify? When should it suggest instead of act? When should it pause for Human Reviewer or Risk / Compliance Reviewer sign-off? Those are design choices, not tool settings.')}
        {para('A lot of teams jump too quickly from “this task is repetitive” to “this task should be fully autonomous.” That is where bad AI automation begins. Repetition alone is not enough. You also need clarity. If the task has fuzzy inputs, hidden edge cases, or high-cost mistakes, the right move may be partial automation with review rather than full autonomy.')}
        {para('The best early wins tend to be workflows where AI helps structure or accelerate a decision while humans still retain final authority. That gives the team leverage without asking them to trust the system beyond what it has earned.')}
        {keyBox('Strong early use cases', [
          'Operational request categorization with Human Reviewer handoff for low-confidence cases.',
          'Case-priority suggestions separated from actual system updates.',
          'Document or exception triage with explicit uncertainty and approval before decisions.',
        ], '#C2410C')}
        <GenAIAvatar
          name="Kabir"
          nameColor="#C2410C"
          borderColor="#C2410C"
          conceptId="genai-use-case-judgment"
          content="The best first AI workflows reduce repetitive cognitive load without hiding important operational decisions."
          expandedContent="That usually means using AI to structure, summarize, classify, enrich, or draft, while keeping sensitive approvals and irreversible actions visible to Human Reviewers, Workflow Operators, or Risk / Compliance Reviewers."
          question="Which use case is safest to automate first?"
          options={[
            { text: 'Auto-approve policy exceptions without Human Reviewer review.', correct: false, feedback: 'That combines sensitive consequences with no review gate. It is high risk.' },
            { text: 'Categorize incoming operational requests and escalate ambiguous ones to Human Reviewers.', correct: true, feedback: 'Right. It has clear inputs, a bounded task, and a safe review path for edge cases.' },
            { text: 'Auto-deny claims or applications based on inferred fit.', correct: false, feedback: 'That is too sensitive and too easy to get wrong without strong controls.' },
          ]}
        />
        <GenAIAvatar
          name="Leela"
          nameColor="#C2410C"
          borderColor="#C2410C"
          conceptId="genai-use-case-judgment"
          content="A workflow becomes dangerous when the system is allowed to take a sensitive action before the team has learned where it fails."
          expandedContent="That is why I like a staged progression. First, let AI summarize. Then let it classify. Then let it recommend. Only much later should it act automatically, and even then only when the action is reversible, well-bounded, and heavily observed. Teams that skip those stages usually learn the same lesson the expensive way."
          question="Which rollout path is more responsible?"
          options={[
            { text: 'Start with full autonomy so the team sees the biggest efficiency gains immediately.', correct: false, feedback: 'That usually creates hidden trust and quality problems before the workflow has earned autonomy.' },
            { text: 'Start with assistive outputs, learn failure patterns, then increase autonomy gradually where safe.', correct: true, feedback: 'Yes. Good AI rollouts earn trust in stages instead of demanding it upfront.' },
            { text: 'Avoid human review because it slows down the learning process.', correct: false, feedback: 'Human review is often the thing that teaches the team where the workflow still needs work.' },
          ]}
        />
        {PMPrincipleBox({ principle: 'The safest early AI systems assist decisions before they automate decisions.' })}
        <ApplyItBox prompt="Name one workflow in your world that should stay assistive for now, not autonomous. Which role would object first if it acted on its own: Human Reviewer, Workflow Operator, Risk / Compliance Reviewer, or Source System Owner?" />
        <QuizEngine conceptId="genai-use-case-judgment" conceptName="Use-Case Judgment" moduleContext={moduleContext} staticQuiz={QUIZZES[3]} />
        <NextChapterTeaser text={track === 'tech' ? "Aarav now knows what a good first use case looks like. The last step is to frame one clearly enough that building it becomes straightforward." : "Rhea now knows what a good first use case looks like. The last step is to frame one clearly enough that building it becomes straightforward."} />
      </ChapterSection>

      <ChapterSection num="05" accentRgb={ACCENT_RGB} id="genai-preread-apply">
        {chLabel('Apply It')}
        {h2('Think from your role outward')}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          {track === 'tech'
            ? <>By the end of the session, Aarav does not have a clever script. He has something more useful: one workflow drawn with five labels. A webhook triggers the run. A database fetch pulls case context. A structured LLM call proposes category and urgency. A code node validates the output shape. Ambiguous cases route to a Human Reviewer via Slack. Runs are logged. That is the beginning of a real, inspectable system.</>
            : <>By the end of the session, Rhea does not leave with a flashy agent demo. She leaves with something more valuable: one clearly framed workflow. An exception request enters through a webhook. Case context is fetched. AI proposes category and urgency. Ambiguous cases route to a Human Reviewer. The run is logged for the Business Process Owner and Risk / Compliance Reviewers. That is the beginning of a real system.</>}
        </SituationCard>
        {para('By the end of this pre-read, the goal is not that you memorize tool names. The goal is that you start seeing your work as a set of triggers, decisions, inputs, outputs, and approval loops. Once you can frame work that way, you can reason much more clearly about where AI belongs and where orchestration matters most.')}
        {para('If you are a PM, this means identifying where AI can structure demand, triage work, or surface decision-ready context. If you are an Automation Engineer or Systems / Platform Engineer, it means thinking about interfaces, failure handling, and maintainable execution paths. If you are in ops, compliance, or business operations, it means spotting repetitive operational loops where AI can reduce cognitive drag without creating silent failure.')}
        {para('The best learners in this program will not be the ones who memorize the most tools. They will be the ones who learn to describe a workflow clearly: what enters the system, what judgment happens, what the model is responsible for, what rules stay deterministic, and how the workflow behaves when something goes wrong.')}
        <GenAIAvatar
          name="Anika"
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-system-framing"
          content="If you can describe the workflow clearly enough, you are already halfway to building it."
          expandedContent="A lot of learners think their blocker is technical. Often it is actually framing. They know the pain point, but cannot yet articulate the trigger, the context, the transformation, the output, and the review rule. Once that becomes clear, tool decisions get much easier."
          question="What is the strongest sign that you understand a workflow well enough to start building?"
          options={[
            { text: 'You know the names of the tools you want to use.', correct: false, feedback: 'Tool names are useful, but they do not prove workflow clarity.' },
            { text: 'You can clearly explain the trigger, context, model step, control logic, and fallback.', correct: true, feedback: 'Exactly. Clear system framing is what makes implementation decisions coherent.' },
            { text: 'You have a long prompt drafted before anything else.', correct: false, feedback: 'Prompts matter, but they are only one component inside the system.' },
          ]}
        />
        {ApplyItBox({ prompt: 'Pick one workflow from your world. Who is the Business Process Owner? Who is the Human Reviewer? Who is the Systems / Platform Engineer or Source System Owner? What should the AI do, and what should remain explicitly human-controlled?' })}
        <QuizEngine conceptId="genai-system-framing" conceptName="System Framing" moduleContext={moduleContext} staticQuiz={QUIZZES[4]} />
        <NextChapterTeaser text="Next, we move into prompt engineering and LLM reliability inside real automation systems." />
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
            <motion.button whileHover={{ opacity: 0.75 }} whileTap={{ scale: 0.97 }} onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', cursor: 'pointer' }}>
              <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>←</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)', fontFamily: "'JetBrains Mono', monospace" }}>Curriculum</span>
            </motion.button>
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

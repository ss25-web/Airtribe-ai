'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Track } from './pm-fundamentals/designSystem';

// ─────────────────────────────────────────
// PHASE 1 — BACKGROUND QUESTIONS
// ─────────────────────────────────────────
const BACKGROUND_QS = [
  {
    q: "What best describes where you are right now?",
    sub: "No right or wrong — just helps us place you accurately.",
    options: [
      { text: "I'm exploring product management as a career move", weight: 0 },
      { text: "I'm in a related role — design, engineering, marketing, or ops", weight: 1 },
      { text: "I'm an APM or PM with under 2 years of product experience", weight: 2 },
      { text: "I've been a PM for 2+ years and own products end to end", weight: 3 },
    ],
  },
  {
    q: "Have you shipped a product feature — owned it from idea to launch?",
    sub: "Owned means you drove the decision, not just contributed to it.",
    options: [
      { text: "Not yet", weight: 0 },
      { text: "I've contributed to one, but wasn't the decision-maker", weight: 1 },
      { text: "Yes, once or twice — I owned the outcome", weight: 2 },
      { text: "Yes, multiple times across different teams or products", weight: 3 },
    ],
  },
  {
    q: "Which of these feels most true for you right now?",
    sub: "Pick the one that best captures where you're actually stuck.",
    options: [
      { text: "I'm still getting my head around what PMs actually do", weight: 0 },
      { text: "I understand the basics — I'm working on applying them consistently", weight: 1 },
      { text: "I've got the fundamentals down and I'm hitting more complex problems", weight: 2 },
      { text: "I regularly navigate strategy, tradeoffs, and senior stakeholders at once", weight: 3 },
    ],
  },
];

// ─────────────────────────────────────────
// PHASE 2 — PRACTICAL SCENARIO QUESTIONS
// ─────────────────────────────────────────
const SCENARIO_QS = [
  {
    level: 'foundational',
    q: "A user messages you: \"I want a dark mode.\" What's your first move as a PM?",
    options: [
      "Ask why they want it — understand what problem dark mode would solve for them",
      "Add it to the backlog — if users ask, it matters",
      "Survey all users to see if it's widely needed",
      "Check whether your top competitors have it",
    ],
    correct: 0,
  },
  {
    level: 'foundational',
    q: "Your manager says \"the onboarding is broken\" but gives you no data. First move?",
    options: [
      "Start redesigning — broken onboarding usually means poor UX",
      "Talk to 3–5 users who churned in week 1 — find out what \"broken\" actually means to them",
      "Schedule a design sprint with the team",
      "Ask engineering to rebuild the flow from scratch",
    ],
    correct: 1,
  },
  {
    level: 'foundational',
    q: "You have 1 engineer and 2 weeks. Sales wants a CRM integration. CS wants better reporting. How do you choose?",
    options: [
      "Build whichever stakeholder asked first",
      "Do both at 50% quality to keep everyone happy",
      "Ask the CEO to break the tie",
      "Find out which business outcome needs to move most right now — then pick what drives it",
    ],
    correct: 3,
  },
  {
    level: 'intermediate',
    q: "A feature shipped 2 weeks ago. How do you know if it worked?",
    options: [
      "Check the success metric you defined before shipping — did user behaviour actually change?",
      "No complaints means it worked",
      "Wait for the quarterly business review",
      "The team is proud of how it shipped",
    ],
    correct: 0,
  },
  {
    level: 'intermediate',
    q: "Midway through a sprint, you realise the engineer built the feature differently than you intended. You:",
    options: [
      "Write a more detailed spec for next time",
      "Escalate to the engineering manager",
      "Wait until the retro to give feedback — don't disrupt the sprint",
      "Clarify immediately — a 10-minute conversation now is cheaper than a week of rework at the end",
    ],
    correct: 3,
  },
  {
    level: 'advanced',
    q: "Retention drops 15%. Your CEO thinks it's pricing. Engineering blames tech debt. Design blames the UX. Your move?",
    options: [
      "Find the one hypothesis that fits all three views, then run the cheapest test to decide",
      "Go with whoever is most senior — they have the most context and accountability for the outcome",
      "Launch parallel A/B tests on all three — pricing change, tech debt paydown, and a UX redesign",
      "Average all three perspectives into a balanced roadmap that addresses each concern proportionally",
    ],
    correct: 0,
  },
  {
    level: 'advanced',
    q: "Your north star (sessions/user) hits an all-time high. Meanwhile: NPS drops 8 pts, churn up 15%, support tickets up 40%. What do you do?",
    options: [
      "Trust the north star — it's the primary signal for good reason, guardrail dips are expected",
      "Investigate — a rising north star with falling guardrails means the metric has decoupled from real value",
      "Fix the support spike as a separate independent workstream so both tracks can run in parallel",
      "This is normal growth-phase noise — track trends for another full quarter before acting",
    ],
    correct: 1,
  },
];

function assignTrack(backgroundScore: number, technicalScore: number): Track {
  return (backgroundScore >= 6 && technicalScore >= 5) ? 'apm' : 'new-pm';
}

const LEVEL_META: Record<string, { label: string; color: string; bg: string }> = {
  foundational: { label: 'Foundational', color: '#4F46E5', bg: 'rgba(79,70,229,0.1)' },
  intermediate:  { label: 'Intermediate',  color: '#0097A7', bg: 'rgba(0,151,167,0.1)' },
  advanced:      { label: 'Advanced',      color: '#7843EE', bg: 'rgba(120,67,238,0.1)' },
};

interface Props {
  onComplete: (track: Track, score: number) => void;
  onBack: () => void;
}

type Phase = 'background' | 'scenarios' | 'result';

// Decorative SVG dots pattern
function DotGrid() {
  return (
    <svg style={{ position: 'absolute', top: 0, right: 0, width: '320px', height: '320px', opacity: 0.04, pointerEvents: 'none' }} viewBox="0 0 320 320">
      {Array.from({ length: 10 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => (
          <circle key={`${row}-${col}`} cx={col * 32 + 16} cy={row * 32 + 16} r="2.5" fill="var(--purple)" />
        ))
      )}
    </svg>
  );
}

export default function PlacementQuiz({ onComplete, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('background');
  const [bgIdx, setBgIdx] = useState(0);
  const [bgWeights, setBgWeights] = useState<number[]>([]);
  const [scIdx, setScIdx] = useState(0);
  const [scAnswers, setScAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const backgroundScore = bgWeights.reduce((s, w) => s + w, 0);
  const technicalScore = scAnswers.reduce((s, a, i) => s + (a === SCENARIO_QS[i].correct ? 1 : 0), 0);
  const track = assignTrack(backgroundScore, technicalScore);

  const handleBgSelect = (weight: number) => {
    const next = [...bgWeights, weight];
    setBgWeights(next);
    setSelected(null);
    if (bgIdx + 1 < BACKGROUND_QS.length) {
      setBgIdx(i => i + 1);
    } else {
      setPhase('scenarios');
    }
  };

  const handleScSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => {
      const next = [...scAnswers, index];
      setScAnswers(next);
      setSelected(null);
      if (scIdx + 1 < SCENARIO_QS.length) {
        setScIdx(i => i + 1);
      } else {
        setPhase('result');
      }
    }, 380);
  };

  const bgQ = BACKGROUND_QS[bgIdx];
  const scQ = SCENARIO_QS[scIdx];
  const scProgress = (scIdx / SCENARIO_QS.length) * 100;

  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top bar ── */}
      <div className="screen-topbar" style={{
        background: 'var(--ed-card)', borderBottom: '1px solid var(--ed-rule)',
        padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ed-ink3)', fontSize: '13px', fontFamily: 'inherit' }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: 'linear-gradient(135deg, #7843EE, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)', letterSpacing: '0.1em' }}>
            {phase === 'background' ? 'ABOUT YOU' : phase === 'scenarios' ? 'PM SCENARIOS' : 'YOUR RESULT'} · PM FUNDAMENTALS
          </span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: 'var(--purple)', minWidth: '52px', textAlign: 'right' }}>
          {phase === 'background' && `${bgIdx + 1} / ${BACKGROUND_QS.length}`}
          {phase === 'scenarios' && `${scIdx + 1} / ${SCENARIO_QS.length}`}
        </div>
      </div>

      {/* ── Progress bar (scenarios only) ── */}
      {phase === 'scenarios' && (
        <div style={{ height: '3px', background: 'var(--ed-rule)' }}>
          <motion.div animate={{ width: `${scProgress}%` }} transition={{ duration: 0.4 }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #4F46E5, #7843EE)' }} />
        </div>
      )}

      {/* ── Hero gradient strip (background phase only) ── */}
      {phase === 'background' && (
        <div style={{ background: 'linear-gradient(135deg, rgba(120,67,238,0.08) 0%, rgba(79,70,229,0.04) 100%)', borderBottom: '1px solid var(--ed-rule)', padding: '28px 28px 24px', position: 'relative', overflow: 'hidden' }}>
          <DotGrid />
          <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--purple)', marginBottom: '10px' }}>
              TRACK PLACEMENT · 3 QUESTIONS
            </div>
            <h1 style={{ fontSize: 'clamp(20px, 2.8vw, 28px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '8px' }}>
              Let&apos;s find your starting point
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--ed-ink3)', lineHeight: 1.65 }}>
              No right or wrong answers — these 3 questions help us match you to the right depth of content.
            </p>
            {/* Dot stepper */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px', alignItems: 'center' }}>
              {BACKGROUND_QS.map((_, i) => (
                <div key={i} style={{
                  width: i === bgIdx ? '24px' : '8px', height: '8px',
                  borderRadius: '4px',
                  background: i < bgIdx ? 'var(--purple)' : i === bgIdx ? 'var(--purple)' : 'var(--ed-rule)',
                  transition: 'all 0.3s ease',
                }} />
              ))}
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)', marginLeft: '4px' }}>
                {bgIdx + 1} of {BACKGROUND_QS.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="quiz-content" style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '640px' }}>

          <AnimatePresence mode="wait">

            {/* ── BACKGROUND PHASE ── */}
            {phase === 'background' && (
              <motion.div key={`bg-${bgIdx}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.28 }}>

                <div style={{ marginBottom: '28px' }}>
                  <h2 style={{ fontSize: 'clamp(17px, 2.2vw, 22px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", lineHeight: 1.4, marginBottom: '6px' }}>
                    {bgQ.q}
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>{bgQ.sub}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {bgQ.options.map((opt, i) => (
                    <motion.button key={i}
                      whileHover={{ x: 5, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => handleBgSelect(opt.weight)}
                      style={{
                        textAlign: 'left', padding: '18px 22px', borderRadius: '10px',
                        border: '1.5px solid var(--ed-rule)',
                        background: 'var(--ed-card)',
                        cursor: 'pointer', fontSize: '15px', color: 'var(--ed-ink)', lineHeight: 1.55,
                        display: 'flex', alignItems: 'center', gap: '14px',
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--purple)';
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(120,67,238,0.08)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--ed-rule)';
                        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                      }}>
                      <span style={{
                        width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                        border: '1.5px solid var(--ed-rule)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', color: 'var(--ed-ink3)',
                        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                        background: 'var(--ed-cream)',
                      }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── SCENARIOS PHASE ── */}
            {phase === 'scenarios' && (
              <motion.div key={`sc-${scIdx}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>

                {/* Context strip */}
                <div style={{
                  borderRadius: '10px', padding: '16px 20px', marginBottom: '28px',
                  background: 'var(--ed-card)', border: '1px solid var(--ed-rule)',
                  borderLeft: `3px solid ${LEVEL_META[scQ.level].color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--ed-ink3)', marginBottom: '3px' }}>
                      QUESTION {scIdx + 1} OF {SCENARIO_QS.length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink2)' }}>What would you do here?</div>
                  </div>
                  <div style={{
                    padding: '4px 10px', borderRadius: '20px', flexShrink: 0,
                    fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.1em',
                    background: LEVEL_META[scQ.level].bg,
                    color: LEVEL_META[scQ.level].color,
                    border: `1px solid ${LEVEL_META[scQ.level].color}30`,
                  }}>
                    {LEVEL_META[scQ.level].label.toUpperCase()}
                  </div>
                </div>

                <h2 style={{ fontSize: 'clamp(17px, 2.2vw, 22px)', fontWeight: 700, lineHeight: 1.45, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '28px' }}>
                  {scQ.q}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                  {scQ.options.map((opt, i) => {
                    const isSelected = selected === i;
                    return (
                      <motion.button key={i}
                        whileHover={{ x: isSelected ? 0 : 3 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleScSelect(i)}
                        disabled={selected !== null}
                        style={{
                          textAlign: 'left', padding: '16px 20px', borderRadius: '10px',
                          border: isSelected ? '2px solid var(--purple)' : '1.5px solid var(--ed-rule)',
                          background: isSelected ? 'rgba(120,67,238,0.07)' : 'var(--ed-card)',
                          cursor: selected !== null ? 'default' : 'pointer', fontSize: '14px', color: isSelected ? 'var(--ed-ink)' : 'var(--ed-ink2)',
                          lineHeight: 1.6, transition: 'all 0.15s', fontWeight: isSelected ? 500 : 400,
                          fontFamily: 'inherit',
                          display: 'flex', alignItems: 'flex-start', gap: '12px',
                        }}>
                        <span style={{
                          width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                          border: isSelected ? '2px solid var(--purple)' : '1.5px solid var(--ed-rule)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                          color: isSelected ? 'var(--purple)' : 'var(--ed-ink3)',
                          background: isSelected ? 'rgba(120,67,238,0.1)' : 'transparent',
                          transition: 'all 0.15s',
                        }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>

                {selected === null && (
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', textAlign: 'center' }}>
                    Select an answer to continue
                  </div>
                )}
              </motion.div>
            )}

            {/* ── RESULT PHASE ── */}
            {phase === 'result' && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>

                {/* Track banner */}
                <div style={{
                  borderRadius: '14px', padding: '32px 28px', marginBottom: '24px',
                  background: track === 'apm'
                    ? 'linear-gradient(135deg, rgba(120,67,238,0.12) 0%, rgba(79,70,229,0.06) 100%)'
                    : 'linear-gradient(135deg, rgba(79,70,229,0.10) 0%, rgba(0,151,167,0.05) 100%)',
                  border: `1.5px solid ${track === 'apm' ? 'rgba(120,67,238,0.25)' : 'rgba(79,70,229,0.2)'}`,
                  position: 'relative', overflow: 'hidden', textAlign: 'center',
                }}>
                  <DotGrid />
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '72px', height: '72px', borderRadius: '50%',
                      background: 'var(--ed-card)',
                      border: `3px solid ${track === 'apm' ? '#7843EE' : '#4F46E5'}`,
                      fontSize: '28px', marginBottom: '20px',
                      boxShadow: `0 8px 24px ${track === 'apm' ? 'rgba(120,67,238,0.25)' : 'rgba(79,70,229,0.2)'}`,
                    }}>
                    {track === 'apm' ? '⚡' : '🌱'}
                  </motion.div>

                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: track === 'apm' ? '#7843EE' : '#4F46E5', marginBottom: '10px' }}>
                    YOUR TRACK
                  </div>
                  <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 26px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '10px', lineHeight: 1.3, position: 'relative' }}>
                    {track === 'apm' ? 'Advanced PM Track' : 'PM Foundations Track'}
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto', position: 'relative' }}>
                    {track === 'apm'
                      ? `${technicalScore}/7 on scenarios and strong experience signals. The Advanced track skips the basics and goes straight to the subtler failures.`
                      : `${technicalScore}/7 on scenarios. Foundations is built for exactly where you are — Priya's story makes the mental models stick.`}
                  </p>
                </div>

                {/* Score breakdown */}
                <div style={{
                  borderRadius: '10px', padding: '20px 24px', marginBottom: '20px',
                  background: 'var(--ed-card)', border: '1px solid var(--ed-rule)',
                }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--ed-ink3)', textTransform: 'uppercase' as const, marginBottom: '16px' }}>
                    How we placed you
                  </div>
                  <div className="result-score-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    {[
                      {
                        label: 'Experience',
                        value: `${backgroundScore}/9`,
                        note: backgroundScore >= 6 ? 'Experienced' : 'Building',
                        color: backgroundScore >= 6 ? '#34D399' : '#60A5FA',
                        icon: backgroundScore >= 6 ? '✓' : '→',
                      },
                      {
                        label: 'Scenarios',
                        value: `${technicalScore}/7`,
                        note: technicalScore >= 5 ? 'Strong' : technicalScore >= 3 ? 'Solid' : 'Developing',
                        color: technicalScore >= 5 ? '#34D399' : '#60A5FA',
                        icon: technicalScore >= 5 ? '✓' : '→',
                      },
                      {
                        label: 'Advanced needs',
                        value: '≥ 6/9',
                        note: '+ ≥ 5/7',
                        color: 'var(--ed-ink3)',
                        icon: '◎',
                      },
                    ].map(b => (
                      <div key={b.label} style={{ padding: '14px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
                        <div style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>{b.label}</div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ed-ink)', marginBottom: '4px', fontFamily: "'JetBrains Mono', monospace" }}>{b.value}</div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: b.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{b.icon}</span> {b.note}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Track detail */}
                <div style={{
                  borderRadius: '10px', padding: '20px 24px', marginBottom: '28px',
                  background: 'var(--ed-card)', border: '1px solid var(--ed-rule)',
                  borderTop: `3px solid ${track === 'apm' ? '#7843EE' : '#4F46E5'}`,
                }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: track === 'apm' ? '#7843EE' : '#4F46E5', textTransform: 'uppercase' as const, marginBottom: '8px' }}>
                    What&apos;s ahead
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
                    {track === 'apm'
                      ? "30 min · 12 concepts · Priya 2 years in — the subtle errors experienced PMs don't notice they're making."
                      : "30 min · 7 concepts · Priya's first weeks — confusion to clarity, one mental model at a time."}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <motion.button whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(120,67,238,0.35)' }} whileTap={{ scale: 0.97 }}
                    onClick={() => onComplete(track, technicalScore)}
                    style={{
                      padding: '15px 44px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, #4F46E5, #7843EE)',
                      color: '#FFFFFF', fontSize: '16px', fontWeight: 600,
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      boxShadow: '0 4px 16px rgba(120,67,238,0.3)',
                      letterSpacing: '0.01em',
                    }}>
                    Start my pre-read →
                  </motion.button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

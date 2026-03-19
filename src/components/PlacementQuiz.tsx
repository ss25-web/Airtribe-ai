'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Track } from './pm-fundamentals/designSystem';

// ─────────────────────────────────────────
// PHASE 1 — BACKGROUND QUESTIONS
// Each option carries a weight (0–3) reflecting experience level
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
// 7 scenario-based questions, mix of foundational → advanced
// ─────────────────────────────────────────
const SCENARIO_QS = [
  {
    level: 'foundational',
    q: "A user messages you: \"I want a dark mode.\" What's your first move as a PM?",
    options: [
      "Add it to the backlog — if users ask, it matters",
      "Survey all users to see if it's widely needed",
      "Ask why they want it — understand what problem dark mode would solve for them",
      "Check whether your top competitors have it",
    ],
    correct: 2,
  },
  {
    level: 'foundational',
    q: "Your manager says \"the onboarding is broken\" but gives you no data. First move?",
    options: [
      "Start redesigning — broken onboarding usually means poor UX",
      "Ask engineering to rebuild the flow from scratch",
      "Talk to 3–5 users who churned in week 1 — find out what \"broken\" actually means to them",
      "Schedule a design sprint with the team",
    ],
    correct: 2,
  },
  {
    level: 'foundational',
    q: "You have 1 engineer and 2 weeks. Sales wants a CRM integration. CS wants better reporting. How do you choose?",
    options: [
      "Build whichever stakeholder asked first",
      "Find out which business outcome needs to move most right now — then pick what drives it",
      "Do both at 50% quality to keep everyone happy",
      "Ask the CEO to break the tie",
    ],
    correct: 1,
  },
  {
    level: 'intermediate',
    q: "A feature shipped 2 weeks ago. How do you know if it worked?",
    options: [
      "No complaints means it worked",
      "The team is proud of how it shipped",
      "Check the success metric you defined before shipping — did user behaviour actually change?",
      "Wait for the quarterly business review",
    ],
    correct: 2,
  },
  {
    level: 'intermediate',
    q: "Midway through a sprint, you realise the engineer built the feature differently than you intended. You:",
    options: [
      "Wait until the retro to give feedback — don't disrupt the sprint",
      "Clarify immediately — a 10-minute conversation now is cheaper than a week of rework at the end",
      "Write a more detailed spec for next time",
      "Escalate to the engineering manager",
    ],
    correct: 1,
  },
  {
    level: 'advanced',
    q: "Retention drops 15%. Your CEO thinks it's pricing. Engineering blames tech debt. Design blames the UX. Your move?",
    options: [
      "Go with whoever is most senior — they have the most context",
      "Run A/B tests on pricing, tech debt paydown, and a UX redesign simultaneously",
      "Collect all three frames, find the hypothesis that accounts for each, then design the cheapest test to distinguish between them",
      "Average all three perspectives into a balanced solution",
    ],
    correct: 2,
  },
  {
    level: 'advanced',
    q: "Your north star (sessions/user) hits an all-time high. Meanwhile: NPS drops 8 pts, churn up 15%, support tickets up 40%. What do you do?",
    options: [
      "Trust the north star — it's the primary signal by design",
      "Fix the support issue as a separate workstream",
      "Investigate — guardrail metrics deteriorating while the north star rises means it's diverging from real user value",
      "This is expected during high-growth phases — monitor for another quarter",
    ],
    correct: 2,
  },
];

// ─────────────────────────────────────────
// SCORING LOGIC
// backgroundScore: sum of weights (max 9)
// technicalScore: correct answers (max 7)
// Advanced: experienced background (>=6) AND strong technical (>=5)
// ─────────────────────────────────────────
function assignTrack(backgroundScore: number, technicalScore: number): Track {
  const experiencedBackground = backgroundScore >= 6;
  const strongTechnical = technicalScore >= 5;
  return (experiencedBackground && strongTechnical) ? 'apm' : 'new-pm';
}

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  foundational: { label: 'Foundational', color: '#4F46E5' },
  intermediate:  { label: 'Intermediate',  color: '#0097A7' },
  advanced:      { label: 'Advanced',      color: '#7843EE' },
};

interface Props {
  onComplete: (track: Track, score: number) => void;
  onBack: () => void;
}

type Phase = 'background' | 'scenarios' | 'result';

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

  // ── Background phase handlers ──
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

  // ── Scenario phase handlers ──
  const handleScNext = () => {
    if (selected === null) return;
    const next = [...scAnswers, selected];
    setScAnswers(next);
    setSelected(null);
    if (scIdx + 1 < SCENARIO_QS.length) {
      setScIdx(i => i + 1);
    } else {
      setPhase('result');
    }
  };

  const bgQ = BACKGROUND_QS[bgIdx];
  const scQ = SCENARIO_QS[scIdx];
  const scProgress = ((scIdx) / SCENARIO_QS.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#F6F1E7', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E0D9D0', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#8A8580', fontSize: '13px' }}>
          ← Back
        </button>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#8A8580', letterSpacing: '0.1em' }}>
          {phase === 'background' ? 'ABOUT YOU' : phase === 'scenarios' ? 'PM SCENARIOS' : 'YOUR RESULT'} · PM FUNDAMENTALS
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#4F46E5', minWidth: '60px', textAlign: 'right' }}>
          {phase === 'background' && `${bgIdx + 1} / ${BACKGROUND_QS.length}`}
          {phase === 'scenarios' && `${scIdx + 1} / ${SCENARIO_QS.length}`}
        </div>
      </div>

      {/* Progress bar — only for scenarios */}
      {phase === 'scenarios' && (
        <div style={{ height: '3px', background: '#E0D9D0' }}>
          <motion.div animate={{ width: `${scProgress}%` }} transition={{ duration: 0.4 }}
            style={{ height: '100%', background: '#4F46E5' }} />
        </div>
      )}

      {/* Phase indicator dots — for background */}
      {phase === 'background' && (
        <div style={{ padding: '16px 28px 0', display: 'flex', justifyContent: 'center', gap: '6px' }}>
          {BACKGROUND_QS.map((_, i) => (
            <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i <= bgIdx ? '#4F46E5' : '#D4CEC6', transition: 'background 0.3s' }} />
          ))}
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '640px' }}>

          <AnimatePresence mode="wait">

            {/* ── BACKGROUND PHASE ── */}
            {phase === 'background' && (
              <motion.div key={`bg-${bgIdx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>

                {/* First question: show intro header */}
                {bgIdx === 0 && (
                  <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: '#7843EE', marginBottom: '12px' }}>
                      BEFORE WE BEGIN
                    </div>
                    <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, color: '#1C1814', fontFamily: "'Lora', serif", lineHeight: 1.3, marginBottom: '8px' }}>
                      Tell us a little about yourself
                    </h2>
                    <p style={{ fontSize: '15px', color: '#6A6560', lineHeight: 1.6 }}>
                      3 quick questions — no right or wrong answers. This helps us put you in the right track.
                    </p>
                  </div>
                )}

                {/* Question */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: 'clamp(17px, 2.2vw, 22px)', fontWeight: 700, color: '#1C1814', fontFamily: "'Lora', serif", lineHeight: 1.4, marginBottom: '6px' }}>
                    {bgQ.q}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#8A8580', fontStyle: 'italic' }}>{bgQ.sub}</p>
                </div>

                {/* Options — big choice cards, no labels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {bgQ.options.map((opt, i) => (
                    <motion.button key={i} whileHover={{ x: 4 }} whileTap={{ scale: 0.99 }}
                      onClick={() => handleBgSelect(opt.weight)}
                      style={{
                        textAlign: 'left', padding: '18px 22px', borderRadius: '10px',
                        border: '1.5px solid #D4CEC6', background: '#FFFFFF',
                        cursor: 'pointer', fontSize: '15px', color: '#1C1814', lineHeight: 1.55,
                        transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: '14px',
                      }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid #D4CEC6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#8A8580', fontFamily: "'JetBrains Mono', monospace" }}>
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
              <motion.div key={`sc-${scIdx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

                {/* First scenario: transition message */}
                {scIdx === 0 && (
                  <div style={{ background: '#F0EEF9', borderRadius: '8px', padding: '12px 18px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px' }}>✓</span>
                    <span style={{ fontSize: '13px', color: '#4F46E5' }}>Got it — now for some real PM scenarios.</span>
                  </div>
                )}

                {/* Level badge + question number */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: '#4F46E5' }}>
                    QUESTION {scIdx + 1} OF {SCENARIO_QS.length}
                  </div>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.1em', background: `${LEVEL_LABELS[scQ.level].color}18`, color: LEVEL_LABELS[scQ.level].color }}>
                    {LEVEL_LABELS[scQ.level].label.toUpperCase()}
                  </span>
                </div>

                <h2 style={{ fontSize: 'clamp(17px, 2.2vw, 24px)', fontWeight: 700, lineHeight: 1.4, color: '#1C1814', fontFamily: "'Lora', serif", marginBottom: '28px' }}>
                  {scQ.q}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                  {scQ.options.map((opt, i) => (
                    <motion.button key={i} whileHover={{ x: 2 }} whileTap={{ scale: 0.99 }}
                      onClick={() => setSelected(i)}
                      style={{
                        textAlign: 'left', padding: '16px 20px', borderRadius: '8px',
                        border: selected === i ? '2px solid #4F46E5' : '1px solid #D4CEC6',
                        background: selected === i ? '#F5F3FF' : '#FFFFFF',
                        cursor: 'pointer', fontSize: '14px', color: selected === i ? '#1C1814' : '#4A4540',
                        lineHeight: 1.6, transition: 'all 0.15s', fontWeight: selected === i ? 500 : 400,
                      }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: selected === i ? '#4F46E5' : '#9A9490', marginRight: '12px' }}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </motion.button>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <motion.button whileHover={{ scale: selected !== null ? 1.02 : 1 }} whileTap={{ scale: selected !== null ? 0.98 : 1 }}
                    onClick={handleScNext}
                    style={{
                      padding: '13px 28px', borderRadius: '6px',
                      background: selected !== null ? '#4F46E5' : '#D4CEC6',
                      color: '#FFFFFF', fontSize: '14px', fontWeight: 600,
                      border: 'none', cursor: selected !== null ? 'pointer' : 'not-allowed',
                      transition: 'background 0.2s',
                    }}>
                    {scIdx === SCENARIO_QS.length - 1 ? 'See my result →' : 'Next →'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── RESULT PHASE ── */}
            {phase === 'result' && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                {/* Score display */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '88px', height: '88px', borderRadius: '50%',
                    background: track === 'apm' ? '#F5F3FF' : '#F0FDF8',
                    border: `3px solid ${track === 'apm' ? '#4F46E5' : '#0D7A5A'}`,
                    fontSize: '28px', fontWeight: 900, color: track === 'apm' ? '#4F46E5' : '#0D7A5A',
                    fontFamily: "'JetBrains Mono', monospace", marginBottom: '20px',
                  }}>
                    {technicalScore}/{SCENARIO_QS.length}
                  </div>

                  <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#1C1814', fontFamily: "'Lora', serif", marginBottom: '10px', lineHeight: 1.25 }}>
                    {track === 'apm'
                      ? 'Advanced track — you\'re ready for the harder problems.'
                      : technicalScore >= 3
                        ? 'Foundations track — good instincts to build on.'
                        : 'Foundations track — exactly the right starting point.'}
                  </h2>
                  <p style={{ fontSize: '15px', color: '#6A6560', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto' }}>
                    {track === 'apm'
                      ? `${technicalScore}/7 on scenarios and strong experience signals. The Advanced track skips the basics and goes straight to the subtler failures — tradeoffs, ambiguity, and decisions where there's no obvious right answer.`
                      : `${technicalScore}/7 on scenarios. The Foundations track is built for exactly where you are — Priya's story makes the mental models stick because you see them fail before you learn them.`}
                  </p>
                </div>

                {/* Track card */}
                <div style={{
                  background: '#FFFFFF', border: '1px solid #E0D9D0', borderRadius: '10px',
                  borderTop: `4px solid ${track === 'apm' ? '#7843EE' : '#4F46E5'}`,
                  padding: '24px 28px', marginBottom: '20px',
                }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: track === 'apm' ? '#7843EE' : '#4F46E5', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Your assigned track</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#1C1814', fontFamily: "'Lora', serif", marginBottom: '6px' }}>
                    {track === 'apm' ? '⚡ Advanced PM Track' : '🌱 Foundations Track'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6A6560', lineHeight: 1.65 }}>
                    {track === 'apm'
                      ? "30 min · 12 concepts · Priya 2 years in — the subtle errors experienced PMs don't notice they're making."
                      : "30 min · 7 concepts · Priya's first weeks — confusion to clarity, one mental model at a time."}
                  </div>
                </div>

                {/* Score breakdown */}
                <div style={{ background: '#F6F1E7', borderRadius: '8px', padding: '16px 20px', marginBottom: '32px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#8A8580', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>How we placed you</div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>
                    {[
                      { label: 'Experience signals', value: `${backgroundScore}/9`, note: backgroundScore >= 6 ? 'Experienced' : 'Building', color: backgroundScore >= 6 ? '#0D7A5A' : '#4F46E5' },
                      { label: 'Scenario accuracy', value: `${technicalScore}/7`, note: technicalScore >= 5 ? 'Strong' : technicalScore >= 3 ? 'Solid' : 'Developing', color: technicalScore >= 5 ? '#0D7A5A' : '#4F46E5' },
                    ].map(b => (
                      <div key={b.label} style={{ flex: 1, minWidth: '120px' }}>
                        <div style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#8A8580', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>{b.label}</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#1C1814', marginBottom: '2px' }}>{b.value}</div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: b.color }}>{b.note}</div>
                      </div>
                    ))}
                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <div style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#8A8580', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>Advanced requires</div>
                      <div style={{ fontSize: '12px', color: '#6A6560', lineHeight: 1.6 }}>Experience ≥ 6/9<br />Scenarios ≥ 5/7</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => onComplete(track, technicalScore)}
                    style={{
                      padding: '15px 40px', borderRadius: '6px',
                      background: track === 'apm' ? '#7843EE' : '#4F46E5',
                      color: '#FFFFFF', fontSize: '16px', fontWeight: 600,
                      border: 'none', cursor: 'pointer',
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

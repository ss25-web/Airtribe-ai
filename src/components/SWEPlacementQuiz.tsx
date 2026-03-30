'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SWETrack, SWELevel } from './sweTypes';
import { PythonLogo, JavaLogo, NodejsLogo } from './SWELogos';

const TRACK_LABEL: Record<SWETrack, { name: string; color: string; gradient: string }> = {
  python: { name: 'Python',  color: '#16A34A', gradient: 'linear-gradient(135deg, #16A34A, #0D9488)' },
  java:   { name: 'Java',    color: '#0369A1', gradient: 'linear-gradient(135deg, #0369A1, #7C3AED)' },
  nodejs: { name: 'Node.js', color: '#CA8A04', gradient: 'linear-gradient(135deg, #CA8A04, #16A34A)' },
};

const TRACK_LOGOS = { python: PythonLogo, java: JavaLogo, nodejs: NodejsLogo };

// 2 background + 4 scenario questions. Each option carries a score (0–2).
// Total possible: 12. Threshold >= 7 → advanced.
const BACKGROUND_QS = [
  {
    q: 'How much coding experience do you have right now?',
    sub: 'This helps us set the right starting depth — not to exclude you from any content.',
    options: [
      { text: 'None — this is my first time learning to code', score: 0 },
      { text: 'Some online tutorials but I have not built anything real yet', score: 1 },
      { text: 'I have built at least one small project from scratch', score: 2 },
      { text: 'I write code regularly for work or personal projects', score: 3 },
    ],
  },
  {
    q: 'Which best describes where you are right now?',
    sub: 'Pick the answer that feels most accurate, even if it is not a perfect fit.',
    options: [
      { text: 'I am not sure what a variable or a function is yet', score: 0 },
      { text: 'I understand variables and loops but struggle with larger programs', score: 1 },
      { text: 'I can write functions, work with data structures, and debug basic errors', score: 2 },
      { text: 'I understand OOP, can read unfamiliar code, and have used version control', score: 3 },
    ],
  },
];

const SCENARIO_QS = [
  {
    q: 'A program crashes with "index out of range" on a list operation. What is your instinct?',
    options: [
      { text: 'I would not know where to start', score: 0 },
      { text: 'Try changing the number until it works', score: 0 },
      { text: 'Print the list length and check if the index I am using exceeds it', score: 1 },
      { text: 'Check the loop bounds, verify list length at that point, and add a guard', score: 2 },
    ],
  },
  {
    q: 'You need to store a collection of user names and quickly look them up by ID. Which data structure fits?',
    options: [
      { text: 'I am not familiar with data structures yet', score: 0 },
      { text: 'A list — store them all in order', score: 0 },
      { text: 'A dictionary or map — keys are IDs, values are names', score: 2 },
      { text: 'Depends on read vs write frequency and whether IDs are sequential', score: 2 },
    ],
  },
  {
    q: 'What does it mean for a function to "return" a value?',
    options: [
      { text: 'I am not sure yet', score: 0 },
      { text: 'It prints the result to the screen', score: 0 },
      { text: 'It sends a result back to wherever the function was called from', score: 2 },
      { text: 'It gives a value back to the caller, which can be stored or used in an expression', score: 2 },
    ],
  },
  {
    q: 'You have written a function that works on small inputs but fails on large ones. What do you investigate first?',
    options: [
      { text: 'I would not know how to investigate that', score: 0 },
      { text: 'Rewrite the function and hope it fixes itself', score: 0 },
      { text: 'Test with progressively larger inputs to find the breaking point', score: 1 },
      { text: 'Check for edge cases, measure how the time or memory use grows with input size', score: 2 },
    ],
  },
];

const THRESHOLD = 7; // out of 18 max → advanced if >= 7

function assignLevel(total: number): SWELevel {
  return total >= THRESHOLD ? 'advanced' : 'beginner';
}

interface Props {
  track: SWETrack;
  onComplete: (level: SWELevel) => void;
  onBack: () => void;
}

type Phase = 'background' | 'scenarios' | 'result';

export default function SWEPlacementQuiz({ track, onComplete, onBack }: Props) {
  const tMeta = TRACK_LABEL[track];
  const [phase, setPhase] = useState<Phase>('background');
  const [bgIdx, setBgIdx] = useState(0);
  const [scIdx, setScIdx] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const level = assignLevel(totalScore);
  const progressPct = (scIdx / SCENARIO_QS.length) * 100;

  const handleBgSelect = (score: number) => {
    const next = totalScore + score;
    setTotalScore(next);
    if (bgIdx + 1 < BACKGROUND_QS.length) {
      setBgIdx(i => i + 1);
    } else {
      setPhase('scenarios');
    }
  };

  const handleScNext = () => {
    if (selected === null) return;
    const next = totalScore + SCENARIO_QS[scIdx].options[selected].score;
    setTotalScore(next);
    setSelected(null);
    if (scIdx + 1 < SCENARIO_QS.length) {
      setScIdx(i => i + 1);
    } else {
      setPhase('result');
    }
  };

  const bgQ = BACKGROUND_QS[bgIdx];
  const scQ = SCENARIO_QS[scIdx];

  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div className="screen-topbar" style={{
        background: 'var(--ed-card)', borderBottom: '1px solid var(--ed-rule)',
        padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ed-ink3)', fontSize: '13px', fontFamily: 'inherit' }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: tMeta.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '3px' }}>
            {(() => { const Logo = TRACK_LOGOS[track]; return <Logo size={16} />; })()}
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)', letterSpacing: '0.1em' }}>
            {phase === 'background' ? 'ABOUT YOU' : phase === 'scenarios' ? 'LEVEL CHECK' : 'YOUR LEVEL'} · {tMeta.name.toUpperCase()}
          </span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: tMeta.color, minWidth: '52px', textAlign: 'right' }}>
          {phase === 'background' && `${bgIdx + 1} / ${BACKGROUND_QS.length}`}
          {phase === 'scenarios' && `${scIdx + 1} / ${SCENARIO_QS.length}`}
        </div>
      </div>

      {phase === 'scenarios' && (
        <div style={{ height: '3px', background: 'var(--ed-rule)' }}>
          <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.35 }} style={{ height: '100%', background: tMeta.gradient }} />
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '620px' }}>
          <AnimatePresence mode="wait">

            {phase === 'background' && (
              <motion.div key={`bg-${bgIdx}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: tMeta.color, marginBottom: '10px' }}>
                    LEVEL PLACEMENT · {tMeta.name.toUpperCase()} TRACK
                  </div>
                  <h1 style={{ fontSize: 'clamp(20px, 2.8vw, 26px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '8px' }}>
                    Let&apos;s find the right starting point
                  </h1>
                  <p style={{ fontSize: '14px', color: 'var(--ed-ink3)', lineHeight: 1.65 }}>{bgQ.sub}</p>
                </div>

                <h2 style={{ fontSize: 'clamp(16px, 2.2vw, 20px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", lineHeight: 1.4, marginBottom: '18px' }}>
                  {bgQ.q}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {bgQ.options.map((opt, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => handleBgSelect(opt.score)}
                      style={{ textAlign: 'left', padding: '16px 20px', borderRadius: '10px', border: '1.5px solid var(--ed-rule)', background: 'var(--ed-card)', cursor: 'pointer', fontSize: '14px', color: 'var(--ed-ink)', lineHeight: 1.55, display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'inherit' }}
                    >
                      <span style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, border: '1.5px solid var(--ed-rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, background: 'var(--ed-cream)' }}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      {opt.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {phase === 'scenarios' && (
              <motion.div key={`sc-${scIdx}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                <div style={{ borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${tMeta.color}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--ed-ink3)', marginBottom: '3px' }}>
                      SCENARIO {scIdx + 1} OF {SCENARIO_QS.length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink2)' }}>What would you do here?</div>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: '20px', flexShrink: 0, fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.1em', background: `${tMeta.color}14`, color: tMeta.color, border: `1px solid ${tMeta.color}30` }}>
                    {tMeta.name}
                  </div>
                </div>

                <h2 style={{ fontSize: 'clamp(16px, 2.2vw, 20px)', fontWeight: 700, lineHeight: 1.45, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '24px' }}>
                  {scQ.q}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                  {scQ.options.map((opt, index) => {
                    const isSelected = selected === index;
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ x: isSelected ? 0 : 3 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelected(index)}
                        style={{ textAlign: 'left', padding: '14px 18px', borderRadius: '10px', border: isSelected ? `2px solid ${tMeta.color}` : '1.5px solid var(--ed-rule)', background: isSelected ? `${tMeta.color}08` : 'var(--ed-card)', cursor: 'pointer', fontSize: '14px', color: isSelected ? 'var(--ed-ink)' : 'var(--ed-ink2)', lineHeight: 1.6, transition: 'all 0.15s', fontFamily: 'inherit', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
                      >
                        <span style={{ width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, marginTop: '1px', border: isSelected ? `2px solid ${tMeta.color}` : '1.5px solid var(--ed-rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: isSelected ? tMeta.color : 'var(--ed-ink3)', background: isSelected ? `${tMeta.color}12` : 'transparent' }}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        {opt.text}
                      </motion.button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink3)' }}>{selected === null ? 'Select an answer to continue' : ''}</div>
                  <motion.button
                    whileHover={{ scale: selected !== null ? 1.02 : 1 }}
                    whileTap={{ scale: selected !== null ? 0.97 : 1 }}
                    onClick={handleScNext}
                    style={{ padding: '13px 28px', borderRadius: '8px', background: selected !== null ? tMeta.gradient : 'var(--ed-rule)', color: selected !== null ? '#fff' : 'var(--ed-ink3)', fontSize: '14px', fontWeight: 600, border: 'none', cursor: selected !== null ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}
                  >
                    {scIdx === SCENARIO_QS.length - 1 ? 'See my level →' : 'Next →'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {phase === 'result' && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div style={{
                  borderRadius: '14px', padding: '32px 28px', marginBottom: '24px', textAlign: 'center',
                  background: level === 'advanced'
                    ? `linear-gradient(135deg, ${tMeta.color}14 0%, rgba(0,0,0,0.02) 100%)`
                    : 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0.02) 100%)',
                  border: `1.5px solid ${level === 'advanced' ? tMeta.color + '35' : 'rgba(99,102,241,0.25)'}`,
                }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', background: 'var(--ed-card)', border: `3px solid ${level === 'advanced' ? tMeta.color : '#6366F1'}`, fontSize: '28px', marginBottom: '20px' }}>
                    {level === 'advanced' ? '🚀' : '🌱'}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: level === 'advanced' ? tMeta.color : '#6366F1', marginBottom: '10px' }}>
                    {tMeta.name.toUpperCase()} · YOUR LEVEL
                  </div>
                  <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 26px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '10px', lineHeight: 1.3 }}>
                    {level === 'advanced' ? 'Advanced Track' : 'Beginner Track'}
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto' }}>
                    {level === 'advanced'
                      ? `You already have programming foundations. Your ${tMeta.name} path will move faster through basics and spend more time on architecture, patterns, and production-grade thinking.`
                      : `You are starting from the right place. Your ${tMeta.name} path will build foundations carefully — syntax, mental models, and debugging habits — before pushing into larger projects.`}
                  </p>
                </div>

                <div style={{ borderRadius: '10px', padding: '18px 22px', marginBottom: '28px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--ed-ink3)', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
                    What this means for your path
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      {
                        label: 'Module 01 depth',
                        value: level === 'advanced'
                          ? 'Skips basic syntax — focuses on execution models and ecosystem patterns'
                          : 'Builds from first principles — execution model, tools, and first programs',
                      },
                      {
                        label: 'Pacing',
                        value: level === 'advanced'
                          ? 'Moves faster through fundamentals, more time on design decisions'
                          : 'Takes time with each concept, more examples and guided practice',
                      },
                    ].map(item => (
                      <div key={item.label} style={{ padding: '12px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
                        <div style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '5px' }}>{item.label}</div>
                        <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => onComplete(level)}
                    style={{ padding: '15px 44px', borderRadius: '10px', background: tMeta.gradient, color: '#FFFFFF', fontSize: '16px', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Start {tMeta.name} {level === 'advanced' ? 'Advanced' : 'Beginner'} →
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

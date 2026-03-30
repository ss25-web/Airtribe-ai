'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GenAITrack } from './genaiTypes';

const BACKGROUND_QS = [
  {
    q: 'What best describes the work you do most often today?',
    sub: 'This helps us decide whether to start from workflow reasoning or implementation depth.',
    options: [
      { text: 'Product, operations, growth, founder, or business leadership work', weight: 0 },
      { text: 'Cross-functional role where I sometimes work with tools and data', weight: 1 },
      { text: 'Technical role, but I rarely build automations myself', weight: 2 },
      { text: 'Engineering, automation, or hands-on systems implementation work', weight: 3 },
    ],
  },
  {
    q: 'How comfortable are you with APIs, payloads, and debugging system behavior?',
    sub: 'You do not need prior experience to join either track.',
    options: [
      { text: 'I am new to all of that', weight: 0 },
      { text: 'I understand the concepts, but I do not work with them directly', weight: 1 },
      { text: 'I can usually follow them with some support', weight: 2 },
      { text: 'I already work with them regularly', weight: 3 },
    ],
  },
  {
    q: 'When you think about AI workflows, what do you want help with first?',
    sub: 'Choose the answer that feels most useful right now.',
    options: [
      { text: 'Identifying the right use cases, approvals, and human review points', weight: 0 },
      { text: 'Mapping business workflows clearly before choosing tools', weight: 1 },
      { text: 'Turning workflows into working automations with nodes, APIs, and logic', weight: 2 },
      { text: 'Designing robust implementations with retries, schemas, and failure handling', weight: 3 },
    ],
  },
];

const SCENARIO_QS = [
  {
    level: 'workflow',
    q: 'A team wants an AI workflow for inbound requests. What should happen first?',
    options: [
      'Pick a model and start prompt testing immediately',
      'Connect as many tools as possible so the workflow feels complete',
      'Skip review logic until the team sees strong results',
      'Map the request types, review points, and failure consequences before implementation',
    ],
    correct: 3,
    techBias: 0,
  },
  {
    level: 'implementation',
    q: 'A webhook sometimes sends incomplete fields and the workflow breaks downstream. What is the strongest next step?',
    options: [
      'Add validation at the workflow boundary and route invalid payloads safely',
      'Hope the model can infer the missing values',
      'Retry the same failing step until it works',
      'Remove the structured output requirement',
    ],
    correct: 0,
    techBias: 1,
  },
  {
    level: 'workflow',
    q: 'Which early AI workflow is usually the best first bet?',
    options: [
      'Auto-approve sensitive exceptions with no human review',
      'Give an agent permission to update any system it can access',
      'Classify requests and route ambiguous ones to a Human Reviewer',
      'Let the model write directly to the database as a first use case',
    ],
    correct: 2,
    techBias: 0,
  },
  {
    level: 'implementation',
    q: 'What best shows an implementation mindset for production workflows?',
    options: [
      'Optimizing the hero prompt before defining inputs',
      'Avoiding human review to keep the workflow simple',
      'Assuming a stronger model will remove the need for control logic',
      'Thinking about retries, output structure, idempotency, and observability early',
    ],
    correct: 3,
    techBias: 1,
  },
  {
    level: 'workflow',
    q: 'How should a non-technical operator usually frame an AI workflow first?',
    options: [
      'By choosing the LLM provider before defining the process',
      'By skipping approvals until phase two',
      'By describing trigger, context, decision, review, and outcome in plain language',
      'By focusing only on what the model can generate',
    ],
    correct: 2,
    techBias: 0,
  },
];

function assignTrack(backgroundScore: number, scenarioScore: number, techSignals: number): GenAITrack {
  if (backgroundScore >= 6 && scenarioScore >= 3 && techSignals >= 2) return 'tech';
  return 'non-tech';
}

const LEVEL_META: Record<string, { label: string; color: string; bg: string }> = {
  workflow: { label: 'Workflow', color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
  implementation: { label: 'Implementation', color: '#0F766E', bg: 'rgba(15,118,110,0.1)' },
};

interface Props {
  onComplete: (track: GenAITrack) => void;
  onBack: () => void;
}

type Phase = 'background' | 'scenarios' | 'result';

export default function GenAIPlacementQuiz({ onComplete, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('background');
  const [bgIdx, setBgIdx] = useState(0);
  const [bgWeights, setBgWeights] = useState<number[]>([]);
  const [scIdx, setScIdx] = useState(0);
  const [scAnswers, setScAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const backgroundScore = bgWeights.reduce((sum, value) => sum + value, 0);
  const scenarioScore = scAnswers.reduce((sum, answer, index) => sum + (answer === SCENARIO_QS[index].correct ? 1 : 0), 0);
  const techSignals = scAnswers.reduce((sum, answer, index) => sum + (answer === SCENARIO_QS[index].correct ? SCENARIO_QS[index].techBias : 0), 0);
  const track = assignTrack(backgroundScore, scenarioScore, techSignals);

  const handleBackgroundSelect = (weight: number) => {
    const next = [...bgWeights, weight];
    setBgWeights(next);
    if (bgIdx + 1 < BACKGROUND_QS.length) {
      setBgIdx((current) => current + 1);
    } else {
      setPhase('scenarios');
    }
  };

  const handleScenarioSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => {
      const next = [...scAnswers, index];
      setScAnswers(next);
      setSelected(null);
      if (scIdx + 1 < SCENARIO_QS.length) {
        setScIdx((current) => current + 1);
      } else {
        setPhase('result');
      }
    }, 380);
  };

  const bgQ = BACKGROUND_QS[bgIdx];
  const scQ = SCENARIO_QS[scIdx];
  const progressPct = (scIdx / SCENARIO_QS.length) * 100;

  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)', display: 'flex', flexDirection: 'column' }}>
      <div className="screen-topbar" style={{ background: 'var(--ed-card)', borderBottom: '1px solid var(--ed-rule)', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ed-ink3)', fontSize: '13px', fontFamily: 'inherit' }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)', letterSpacing: '0.1em' }}>
            {phase === 'background' ? 'ABOUT YOU' : phase === 'scenarios' ? 'GENAI SCENARIOS' : 'YOUR TRACK'} · GENAI LAUNCHPAD
          </span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#7C3AED', minWidth: '52px', textAlign: 'right' }}>
          {phase === 'background' && `${bgIdx + 1} / ${BACKGROUND_QS.length}`}
          {phase === 'scenarios' && `${scIdx + 1} / ${SCENARIO_QS.length}`}
        </div>
      </div>

      {phase === 'scenarios' ? (
        <div style={{ height: '3px', background: 'var(--ed-rule)' }}>
          <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.35 }} style={{ height: '100%', background: 'linear-gradient(90deg, #7C3AED, #0F766E)' }} />
        </div>
      ) : null}

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '660px' }}>
          <AnimatePresence mode="wait">
            {phase === 'background' ? (
              <motion.div key={`bg-${bgIdx}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: '#7C3AED', marginBottom: '10px' }}>
                    TRACK PLACEMENT · 3 QUESTIONS
                  </div>
                  <h1 style={{ fontSize: 'clamp(20px, 2.8vw, 28px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '8px' }}>
                    Let&apos;s choose the right GenAI path
                  </h1>
                  <p style={{ fontSize: '14px', color: 'var(--ed-ink3)', lineHeight: 1.65 }}>{bgQ.sub}</p>
                </div>

                <h2 style={{ fontSize: 'clamp(17px, 2.2vw, 22px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", lineHeight: 1.4, marginBottom: '18px' }}>
                  {bgQ.q}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {bgQ.options.map((opt, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => handleBackgroundSelect(opt.weight)}
                      style={{ textAlign: 'left', padding: '18px 22px', borderRadius: '10px', border: '1.5px solid var(--ed-rule)', background: 'var(--ed-card)', cursor: 'pointer', fontSize: '15px', color: 'var(--ed-ink)', lineHeight: 1.55, display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'inherit' }}
                    >
                      <span style={{ width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0, border: '1.5px solid var(--ed-rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, background: 'var(--ed-cream)' }}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      {opt.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {phase === 'scenarios' ? (
              <motion.div key={`sc-${scIdx}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                <div style={{ borderRadius: '10px', padding: '16px 20px', marginBottom: '28px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${LEVEL_META[scQ.level].color}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--ed-ink3)', marginBottom: '3px' }}>
                      QUESTION {scIdx + 1} OF {SCENARIO_QS.length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink2)' }}>Which instinct feels more natural to you here?</div>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: '20px', flexShrink: 0, fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.1em', background: LEVEL_META[scQ.level].bg, color: LEVEL_META[scQ.level].color, border: `1px solid ${LEVEL_META[scQ.level].color}30` }}>
                    {LEVEL_META[scQ.level].label.toUpperCase()}
                  </div>
                </div>

                <h2 style={{ fontSize: 'clamp(17px, 2.2vw, 22px)', fontWeight: 700, lineHeight: 1.45, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '28px' }}>
                  {scQ.q}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                  {scQ.options.map((opt, index) => {
                    const isSelected = selected === index;
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ x: isSelected ? 0 : 3 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleScenarioSelect(index)}
                        disabled={selected !== null}
                        style={{ textAlign: 'left', padding: '16px 20px', borderRadius: '10px', border: isSelected ? '2px solid #7C3AED' : '1.5px solid var(--ed-rule)', background: isSelected ? 'rgba(124,58,237,0.06)' : 'var(--ed-card)', cursor: selected !== null ? 'default' : 'pointer', fontSize: '14px', color: isSelected ? 'var(--ed-ink)' : 'var(--ed-ink2)', lineHeight: 1.6, transition: 'all 0.15s', fontFamily: 'inherit', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
                      >
                        <span style={{ width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, marginTop: '1px', border: isSelected ? '2px solid #7C3AED' : '1.5px solid var(--ed-rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: isSelected ? '#7C3AED' : 'var(--ed-ink3)', background: isSelected ? 'rgba(124,58,237,0.1)' : 'transparent' }}>
                          {String.fromCharCode(65 + index)}
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
            ) : null}

            {phase === 'result' ? (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div style={{ borderRadius: '14px', padding: '32px 28px', marginBottom: '24px', background: track === 'tech' ? 'linear-gradient(135deg, rgba(15,118,110,0.12) 0%, rgba(37,99,235,0.06) 100%)' : 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(79,70,229,0.06) 100%)', border: `1.5px solid ${track === 'tech' ? 'rgba(15,118,110,0.25)' : 'rgba(124,58,237,0.25)'}`, textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', background: 'var(--ed-card)', border: `3px solid ${track === 'tech' ? '#0F766E' : '#7C3AED'}`, fontSize: '28px', marginBottom: '20px' }}>
                    {track === 'tech' ? '🛠️' : '🧭'}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: track === 'tech' ? '#0F766E' : '#7C3AED', marginBottom: '10px' }}>
                    YOUR GENAI TRACK
                  </div>
                  <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 26px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '10px', lineHeight: 1.3 }}>
                    {track === 'tech' ? 'Tech Builder Track' : 'Workflow & Operator Track'}
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto' }}>
                    {track === 'tech'
                      ? 'You are ready to learn GenAI through implementation detail: payloads, nodes, APIs, control logic, retries, and production-minded workflow behavior.'
                      : 'You will get the same GenAI foundations through business-first language: workflow mapping, review loops, safe use cases, and clear decision boundaries before implementation detail.'}
                  </p>
                </div>

                <div style={{ borderRadius: '10px', padding: '20px 24px', marginBottom: '28px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--ed-ink3)', textTransform: 'uppercase', marginBottom: '14px' }}>
                    What changes in your path
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
                      <div style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Language</div>
                      <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>
                        {track === 'tech' ? 'Schemas, payloads, nodes, retries, observability' : 'Approvals, handoffs, use cases, decision quality, human review'}
                      </div>
                    </div>
                    <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
                      <div style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Module 01</div>
                      <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>
                        {track === 'tech' ? 'Focus on implementation architecture and workflow control' : 'Focus on workflow judgment and operational design'}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => onComplete(track)} style={{ padding: '15px 44px', borderRadius: '10px', background: 'linear-gradient(135deg, #7C3AED, #0F766E)', color: '#FFFFFF', fontSize: '16px', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Start my GenAI path →
                  </motion.button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


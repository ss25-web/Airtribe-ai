'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SWETrack } from './sweTypes';

const BACKGROUND_QS = [
  {
    q: 'What is your primary reason for learning software engineering?',
    sub: 'This helps us match you to the language ecosystem that fits your goals best.',
    options: [
      { text: 'Data analysis, automation scripts, or machine learning projects', votes: { python: 3, java: 0, nodejs: 0 } },
      { text: 'Enterprise backend systems, Android apps, or large-scale APIs', votes: { python: 0, java: 3, nodejs: 0 } },
      { text: 'Web apps, REST APIs, or full-stack JavaScript products', votes: { python: 0, java: 0, nodejs: 3 } },
      { text: 'General programming — I want strong fundamentals first', votes: { python: 1, java: 1, nodejs: 1 } },
    ],
  },
  {
    q: 'Which type of project excites you most right now?',
    sub: 'Choose the one that resonates most — there is no wrong answer.',
    options: [
      { text: 'A dashboard that analyses customer behaviour and surfaces insights', votes: { python: 3, java: 0, nodejs: 1 } },
      { text: 'A high-throughput transaction processing system for a financial product', votes: { python: 0, java: 3, nodejs: 1 } },
      { text: 'A real-time collaborative web app with live updates', votes: { python: 0, java: 0, nodejs: 3 } },
      { text: 'An automation tool that handles repetitive work across systems', votes: { python: 2, java: 1, nodejs: 2 } },
    ],
  },
  {
    q: 'How do you feel about structure, types, and verbosity in code?',
    sub: 'Your preference here says a lot about which language will feel most natural.',
    options: [
      { text: 'I love explicit types and clear structure — more guardrails the better', votes: { python: 0, java: 3, nodejs: 0 } },
      { text: 'I prefer concise, readable code even if it means fewer guardrails', votes: { python: 3, java: 0, nodejs: 1 } },
      { text: 'I already know JavaScript on the frontend and want to reuse those skills', votes: { python: 0, java: 0, nodejs: 3 } },
      { text: 'No strong opinion yet — I just want to build things', votes: { python: 1, java: 1, nodejs: 1 } },
    ],
  },
];

const SCENARIO_QS = [
  {
    level: 'stack',
    q: 'You need to build a script that reads a CSV of 50,000 orders, cleans duplicates, and exports a summary report. What is your instinct?',
    options: [
      { text: 'Python with pandas — it is exactly what the library is built for', votes: { python: 3, java: 0, nodejs: 0 } },
      { text: 'A Java batch processing job with streaming reads', votes: { python: 0, java: 3, nodejs: 0 } },
      { text: 'A Node.js script using csv-parser and streaming I/O', votes: { python: 0, java: 0, nodejs: 3 } },
      { text: 'Whichever language I am most comfortable with at that point', votes: { python: 1, java: 1, nodejs: 1 } },
    ],
  },
  {
    level: 'backend',
    q: 'A fintech startup needs an API that handles 500,000 concurrent users and strict transaction guarantees. Which approach sounds most appropriate?',
    options: [
      { text: 'FastAPI with async Python — modern and fast enough for most cases', votes: { python: 3, java: 0, nodejs: 1 } },
      { text: 'Spring Boot with Java — the JVM is built for this kind of workload', votes: { python: 0, java: 3, nodejs: 0 } },
      { text: 'Node.js with Express or Fastify — the event loop handles concurrency well', votes: { python: 0, java: 1, nodejs: 3 } },
    ],
  },
  {
    level: 'ecosystem',
    q: 'You are asked to add a machine learning model to an existing product that predicts user churn. Your first thought is:',
    options: [
      { text: 'Python is the obvious choice — the entire ML ecosystem lives there', votes: { python: 3, java: 0, nodejs: 0 } },
      { text: 'Call a Python or cloud ML service from my Java or Node backend via API', votes: { python: 0, java: 2, nodejs: 2 } },
      { text: 'TensorFlow.js lets me run models directly in Node without switching stacks', votes: { python: 0, java: 0, nodejs: 3 } },
    ],
  },
  {
    level: 'stack',
    q: 'A company wants to migrate a monolithic Java application to microservices. You are asked to recommend a new service framework. You suggest:',
    options: [
      { text: 'Spring Boot with Spring Cloud — mature ecosystem purpose-built for this', votes: { python: 0, java: 3, nodejs: 0 } },
      { text: 'Node.js services — lightweight, fast to write, easy to containerise', votes: { python: 0, java: 0, nodejs: 3 } },
      { text: 'FastAPI with Docker — Python services are clean and readable', votes: { python: 3, java: 0, nodejs: 0 } },
    ],
  },
  {
    level: 'backend',
    q: 'You are building a developer tool that watches files for changes and triggers automated tests in real time. What stack feels natural?',
    options: [
      { text: 'Node.js — the event-driven model is a perfect fit for file watchers', votes: { python: 0, java: 0, nodejs: 3 } },
      { text: 'Python with watchdog and subprocess — simple scripting is Python territory', votes: { python: 3, java: 0, nodejs: 0 } },
      { text: 'Java with WatchService API — structured and reliable for production tooling', votes: { python: 0, java: 3, nodejs: 0 } },
    ],
  },
];

type Votes = Record<SWETrack, number>;

function assignTrack(totalVotes: Votes): SWETrack {
  const tracks: SWETrack[] = ['python', 'java', 'nodejs'];
  return tracks.reduce((best, t) => (totalVotes[t] > totalVotes[best] ? t : best), 'python' as SWETrack);
}

const LEVEL_META: Record<string, { label: string; color: string; bg: string }> = {
  stack: { label: 'Ecosystem', color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
  backend: { label: 'Architecture', color: '#0369A1', bg: 'rgba(3,105,161,0.08)' },
  ecosystem: { label: 'Tooling', color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
};

const TRACK_RESULT_META: Record<SWETrack, {
  icon: string;
  name: string;
  desc: string;
  color: string;
  gradient: string;
  borderColor: string;
  lang1: string;
  lang2: string;
}> = {
  python: {
    icon: '🐍',
    name: 'Python Track',
    desc: 'You will learn software engineering through Python — the language of data, automation, and AI. You will build real scripts, APIs, and data pipelines while developing strong programming fundamentals.',
    color: '#16A34A',
    gradient: 'linear-gradient(135deg, #16A34A, #0369A1)',
    borderColor: 'rgba(22,163,74,0.25)',
    lang1: 'Readable syntax with fast iteration cycles',
    lang2: 'Data science, ML, automation, and web (FastAPI)',
  },
  java: {
    icon: '☕',
    name: 'Java Track',
    desc: 'You will learn software engineering through Java — the language of enterprise systems and production-grade backends. You will build REST APIs, practice OOP principles, and learn to think in strongly typed systems.',
    color: '#0369A1',
    gradient: 'linear-gradient(135deg, #0369A1, #7C3AED)',
    borderColor: 'rgba(3,105,161,0.25)',
    lang1: 'Strong typing and OOP with JVM reliability',
    lang2: 'Enterprise systems, Spring Boot, and Android',
  },
  nodejs: {
    icon: '⚡',
    name: 'Node.js Track',
    desc: 'You will learn software engineering through Node.js — JavaScript on the backend. You will build web APIs, real-time features, and full-stack products using a single language across the entire stack.',
    color: '#CA8A04',
    gradient: 'linear-gradient(135deg, #CA8A04, #16A34A)',
    borderColor: 'rgba(202,138,4,0.25)',
    lang1: 'JavaScript everywhere — frontend and backend unified',
    lang2: 'Web APIs, real-time apps, and full-stack products',
  },
};

interface Props {
  onComplete: (track: SWETrack) => void;
  onBack: () => void;
}

type Phase = 'background' | 'scenarios' | 'result';

export default function SWEPlacementQuiz({ onComplete, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('background');
  const [bgIdx, setBgIdx] = useState(0);
  const [scIdx, setScIdx] = useState(0);
  const [totalVotes, setTotalVotes] = useState<Votes>({ python: 0, java: 0, nodejs: 0 });
  const [selected, setSelected] = useState<number | null>(null);

  const track = assignTrack(totalVotes);
  const progressPct = (scIdx / SCENARIO_QS.length) * 100;

  const handleBackgroundSelect = (votes: Votes) => {
    const updated: Votes = {
      python: totalVotes.python + votes.python,
      java: totalVotes.java + votes.java,
      nodejs: totalVotes.nodejs + votes.nodejs,
    };
    setTotalVotes(updated);
    if (bgIdx + 1 < BACKGROUND_QS.length) {
      setBgIdx(i => i + 1);
    } else {
      setPhase('scenarios');
    }
  };

  const handleScenarioNext = () => {
    if (selected === null) return;
    const opt = SCENARIO_QS[scIdx].options[selected];
    const updated: Votes = {
      python: totalVotes.python + opt.votes.python,
      java: totalVotes.java + opt.votes.java,
      nodejs: totalVotes.nodejs + opt.votes.nodejs,
    };
    setTotalVotes(updated);
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
          <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: 'linear-gradient(135deg, #16A34A, #0369A1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
            </svg>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)', letterSpacing: '0.1em' }}>
            {phase === 'background' ? 'ABOUT YOU' : phase === 'scenarios' ? 'SWE SCENARIOS' : 'YOUR TRACK'} · SOFTWARE ENGINEERING
          </span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#16A34A', minWidth: '52px', textAlign: 'right' }}>
          {phase === 'background' && `${bgIdx + 1} / ${BACKGROUND_QS.length}`}
          {phase === 'scenarios' && `${scIdx + 1} / ${SCENARIO_QS.length}`}
        </div>
      </div>

      {phase === 'scenarios' && (
        <div style={{ height: '3px', background: 'var(--ed-rule)' }}>
          <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.35 }} style={{ height: '100%', background: 'linear-gradient(90deg, #16A34A, #0369A1)' }} />
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '660px' }}>
          <AnimatePresence mode="wait">

            {phase === 'background' && (
              <motion.div key={`bg-${bgIdx}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: '#16A34A', marginBottom: '10px' }}>
                    TRACK PLACEMENT · 3 QUESTIONS
                  </div>
                  <h1 style={{ fontSize: 'clamp(20px, 2.8vw, 28px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '8px' }}>
                    Let&apos;s find your engineering track
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
                      onClick={() => handleBackgroundSelect(opt.votes)}
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
            )}

            {phase === 'scenarios' && (
              <motion.div key={`sc-${scIdx}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                <div style={{ borderRadius: '10px', padding: '16px 20px', marginBottom: '28px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${LEVEL_META[scQ.level].color}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--ed-ink3)', marginBottom: '3px' }}>
                      QUESTION {scIdx + 1} OF {SCENARIO_QS.length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink2)' }}>Which approach feels most natural to you?</div>
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
                        onClick={() => setSelected(index)}
                        style={{ textAlign: 'left', padding: '16px 20px', borderRadius: '10px', border: isSelected ? '2px solid #16A34A' : '1.5px solid var(--ed-rule)', background: isSelected ? 'rgba(22,163,74,0.06)' : 'var(--ed-card)', cursor: 'pointer', fontSize: '14px', color: isSelected ? 'var(--ed-ink)' : 'var(--ed-ink2)', lineHeight: 1.6, transition: 'all 0.15s', fontFamily: 'inherit', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
                      >
                        <span style={{ width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, marginTop: '1px', border: isSelected ? '2px solid #16A34A' : '1.5px solid var(--ed-rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: isSelected ? '#16A34A' : 'var(--ed-ink3)', background: isSelected ? 'rgba(22,163,74,0.1)' : 'transparent' }}>
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
                    onClick={handleScenarioNext}
                    style={{ padding: '13px 28px', borderRadius: '8px', background: selected !== null ? 'linear-gradient(135deg, #16A34A, #0369A1)' : 'var(--ed-rule)', color: selected !== null ? '#fff' : 'var(--ed-ink3)', fontSize: '14px', fontWeight: 600, border: 'none', cursor: selected !== null ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}
                  >
                    {scIdx === SCENARIO_QS.length - 1 ? 'See my track →' : 'Next →'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {phase === 'result' && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {(() => {
                  const meta = TRACK_RESULT_META[track];
                  return (
                    <>
                      <div style={{ borderRadius: '14px', padding: '32px 28px', marginBottom: '24px', background: `linear-gradient(135deg, ${meta.borderColor.replace('0.25', '0.1')} 0%, rgba(0,0,0,0.02) 100%)`, border: `1.5px solid ${meta.borderColor}`, textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', background: 'var(--ed-card)', border: `3px solid ${meta.color}`, fontSize: '28px', marginBottom: '20px' }}>
                          {meta.icon}
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: meta.color, marginBottom: '10px' }}>
                          YOUR SWE TRACK
                        </div>
                        <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 26px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '10px', lineHeight: 1.3 }}>
                          {meta.name}
                        </h2>
                        <p style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto' }}>
                          {meta.desc}
                        </p>
                      </div>

                      <div style={{ borderRadius: '10px', padding: '20px 24px', marginBottom: '28px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)' }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--ed-ink3)', textTransform: 'uppercase' as const, marginBottom: '14px' }}>
                          What this track focuses on
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
                            <div style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Language style</div>
                            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{meta.lang1}</div>
                          </div>
                          <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
                            <div style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Ecosystem</div>
                            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{meta.lang2}</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => onComplete(track)}
                          style={{ padding: '15px 44px', borderRadius: '10px', background: meta.gradient, color: '#FFFFFF', fontSize: '16px', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          Start my {track === 'nodejs' ? 'Node.js' : track === 'python' ? 'Python' : 'Java'} path →
                        </motion.button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

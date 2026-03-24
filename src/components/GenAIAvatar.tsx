'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';

type GenAIMentorId = 'anika' | 'rohan' | 'leela' | 'kabir';

const MENTOR_META: Record<GenAIMentorId, {
  name: string;
  role: string;
  accent: string;
  gradient: string;
}> = {
  anika: {
    name: 'Anika',
    role: 'AI Workflow Strategist',
    accent: '#7C3AED',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
  },
  rohan: {
    name: 'Rohan',
    role: 'Automation Engineer',
    accent: '#2563EB',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #0F766E 100%)',
  },
  leela: {
    name: 'Leela',
    role: 'Risk & Compliance Reviewer',
    accent: '#C2410C',
    gradient: 'linear-gradient(135deg, #C2410C 0%, #DC2626 100%)',
  },
  kabir: {
    name: 'Kabir',
    role: 'Operations Intelligence Lead',
    accent: '#0F766E',
    gradient: 'linear-gradient(135deg, #0F766E 0%, #059669 100%)',
  },
};

const NAME_MAP: Record<string, GenAIMentorId> = {
  Anika: 'anika',
  Rohan: 'rohan',
  Leela: 'leela',
  Kabir: 'kabir',
};

interface AvatarOption {
  text: string;
  correct: boolean;
  feedback: string;
}

function MentorChip({ mentor }: { mentor: GenAIMentorId }) {
  const meta = MENTOR_META[mentor];
  const [blink, setBlink] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const schedule = () => {
      timerRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          schedule();
        }, 120);
      }, 2500 + Math.random() * 2500);
    };
    schedule();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const eyeRy = blink ? 0.7 : 4.8;

  const FACE_MAP: Record<GenAIMentorId, React.ReactNode> = {
    anika: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#4F46E5" />
        <path d="M 34 90 Q 50 102 66 90" fill="#7C3AED" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#C98B5A" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#C98B5A" />
        <ellipse cx="50" cy="24" rx="27" ry="15" fill="#2B1652" />
        <path d="M 25 34 Q 32 24 50 22 Q 68 24 75 34 L 75 45 Q 63 38 50 38 Q 37 38 25 45 Z" fill="#2B1652" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#C98B5A" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#C98B5A" />
        <path d="M 31 42 Q 38 39 45 41" stroke="#2B1652" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 55 41 Q 62 39 69 42" stroke="#2B1652" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#3A2417" /><circle cx="62.5" cy="50.5" r="3.3" fill="#3A2417" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 58 Q 50 63 53 58" stroke="#A96938" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 41 68 Q 50 73 59 68" stroke="#9C5D3B" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    rohan: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#0F766E" />
        <path d="M 34 90 Q 50 102 66 90" fill="#2563EB" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#7A4A33" />
        <ellipse cx="50" cy="52" rx="27" ry="30" fill="#7A4A33" />
        <ellipse cx="50" cy="24" rx="26" ry="14" fill="#131313" />
        <ellipse cx="36" cy="22" rx="6" ry="4.5" fill="#1E1E1E" />
        <ellipse cx="50" cy="20" rx="6" ry="4.5" fill="#1E1E1E" />
        <ellipse cx="64" cy="22" rx="6" ry="4.5" fill="#1E1E1E" />
        <path d="M 31 41 Q 39 37.5 46 40" stroke="#121212" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path d="M 54 40 Q 61 37.5 69 41" stroke="#121212" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="49" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="49" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.3" cy="49.8" r="3.3" fill="#23150F" /><circle cx="62.3" cy="49.8" r="3.3" fill="#23150F" /></>}
        {!blink && <><circle cx="39.5" cy="48.8" r="0.9" fill="rgba(255,255,255,0.88)" /><circle cx="63.5" cy="48.8" r="0.9" fill="rgba(255,255,255,0.88)" /></>}
        <rect x="28" y="43.5" width="20" height="11" rx="3" fill="none" stroke="#151515" strokeWidth="2" />
        <rect x="52" y="43.5" width="20" height="11" rx="3" fill="none" stroke="#151515" strokeWidth="2" />
        <line x1="48" y1="49" x2="52" y2="49" stroke="#151515" strokeWidth="1.8" />
        <path d="M 30 66 Q 30 80 50 83 Q 70 80 70 66 Q 60 71 50 71 Q 40 71 30 66 Z" fill="#111" opacity="0.88" />
        <path d="M 41 65 Q 50 69 59 65" stroke="#111" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    ),
    leela: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#991B1B" />
        <path d="M 34 90 Q 50 102 66 90" fill="#C2410C" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#E6B88E" />
        <ellipse cx="50" cy="52" rx="25" ry="30" fill="#E6B88E" />
        <ellipse cx="50" cy="24" rx="26" ry="14" fill="#3B241A" />
        <path d="M 24 33 Q 37 23 50 23 Q 63 23 76 33 L 70 62 Q 60 54 50 54 Q 40 54 30 62 Z" fill="#3B241A" />
        <path d="M 31 42 Q 38 39 45 41" stroke="#2B1B15" strokeWidth="2.1" strokeLinecap="round" fill="none" />
        <path d="M 55 41 Q 62 39 69 42" stroke="#2B1B15" strokeWidth="2.1" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.2" cy="50.2" r="3.2" fill="#344256" /><circle cx="62.2" cy="50.2" r="3.2" fill="#344256" /></>}
        {!blink && <><circle cx="39.2" cy="49.1" r="0.9" fill="rgba(255,255,255,0.92)" /><circle cx="63.2" cy="49.1" r="0.9" fill="rgba(255,255,255,0.92)" /></>}
        <path d="M 47 58 Q 50 62 53 58" stroke="#C18F64" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 42 68 Q 50 71 58 68" stroke="#A9654A" strokeWidth="1.9" fill="none" strokeLinecap="round" />
      </svg>
    ),
    kabir: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#065F46" />
        <path d="M 34 90 Q 50 102 66 90" fill="#059669" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#C98048" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#C98048" />
        <ellipse cx="50" cy="24" rx="26" ry="14" fill="#243040" />
        <path d="M 26 32 Q 50 26 74 32" fill="#243040" />
        <path d="M 30 41 Q 39 37.5 46 40" stroke="#202A38" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M 54 40 Q 61 37.5 70 41" stroke="#202A38" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7.2" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7.2" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.3" cy="50.8" r="3.3" fill="#22303C" /><circle cx="62.3" cy="50.8" r="3.3" fill="#22303C" /></>}
        {!blink && <><circle cx="39.3" cy="49.4" r="0.9" fill="rgba(255,255,255,0.88)" /><circle cx="63.3" cy="49.4" r="0.9" fill="rgba(255,255,255,0.88)" /></>}
        <path d="M 47 59 Q 50 63 53 59" stroke="#AA6A34" strokeWidth="1.7" fill="none" strokeLinecap="round" />
        <path d="M 40 68 Q 50 73 60 68" stroke="#96572A" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <motion.div
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: 66,
        height: 66,
        borderRadius: '18px',
        background: `linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.03)), ${meta.gradient}`,
        flexShrink: 0,
        boxShadow: `0 10px 24px ${meta.accent}40`,
        border: `2px solid ${meta.accent}`,
        overflow: 'hidden',
      }}
    >
      {FACE_MAP[mentor]}
    </motion.div>
  );
}

export default function GenAIAvatar({
  name,
  borderColor,
  content,
  expandedContent,
  question,
  options,
  conceptId,
}: {
  name: string;
  nameColor: string;
  borderColor: string;
  content: React.ReactNode;
  expandedContent?: React.ReactNode;
  question?: string;
  options?: AvatarOption[];
  conceptId?: string;
}) {
  const mentor = NAME_MAP[name] ?? 'anika';
  const meta = MENTOR_META[mentor];
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const store = useLearnerStore();

  const answered = selectedIdx !== null;
  const isCorrect = answered && options ? options[selectedIdx].correct : false;

  const handleAnswer = (i: number) => {
    if (answered) return;
    setSelectedIdx(i);
    if (conceptId && options) {
      store.recordQuizAttempt(conceptId, options[i].correct);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -1, boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}
      style={{
        background: 'var(--ed-card)',
        borderRadius: '10px',
        borderTop: '1px solid var(--ed-rule)',
        borderRight: '1px solid var(--ed-rule)',
        borderBottom: '1px solid var(--ed-rule)',
        borderLeft: `4px solid ${borderColor}`,
        marginTop: '28px',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          padding: '7px 18px',
          background: 'var(--ed-cream)',
          borderBottom: '1px solid var(--ed-rule)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ width: '5px', height: '5px', borderRadius: '50%', background: borderColor, display: 'inline-block' }}
          />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: borderColor }}>
            GenAI Mentor
          </span>
          {question ? (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.06em', marginLeft: '4px' }}>
              · has a question for you
            </span>
          ) : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {question && answered ? (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: isCorrect ? 'var(--ed-green)' : 'var(--coral)', letterSpacing: '0.06em' }}>
              {isCorrect ? '✓ correct' : '✕ revisit'}
            </span>
          ) : null}
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>
            ▼
          </motion.span>
        </div>
      </div>

      <div style={{ padding: '18px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <MentorChip mentor={mentor} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '1px' }}>{meta.name}</div>
          <div style={{ fontSize: '10px', color: meta.accent, fontFamily: "'JetBrains Mono', monospace", marginBottom: '10px', letterSpacing: '0.04em' }}>
            {meta.role}
          </div>
          <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.82 }}>{content}</div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            {expandedContent ? (
              <div style={{ padding: '16px 18px 20px', borderTop: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '3px', flexShrink: 0, background: borderColor, borderRadius: '2px', alignSelf: 'stretch', opacity: 0.35 }} />
                <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.9 }}>{expandedContent}</div>
              </div>
            ) : null}

            {question && options ? (
              <div style={{ padding: '18px 20px 20px', borderTop: '1px solid var(--ed-rule)', background: 'var(--ed-cream)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, background: borderColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>
                    {meta.name[0]}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', letterSpacing: '0.12em' }}>
                    {meta.name.toUpperCase()} ASKS
                  </div>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.55, marginBottom: '14px', fontFamily: "'Lora', serif" }}>
                  {question}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: answered ? '14px' : '0' }}>
                  {options.map((opt, i) => {
                    const isSelected = selectedIdx === i;
                    const showResult = answered && isSelected;
                    const resultColor = opt.correct ? 'var(--ed-green)' : 'var(--coral)';
                    const resultBg = opt.correct ? 'var(--ed-green-bg)' : 'var(--no-bg)';

                    return (
                      <motion.button
                        key={i}
                        whileHover={!answered ? { x: 3 } : {}}
                        whileTap={!answered ? { scale: 0.99 } : {}}
                        onClick={() => handleAnswer(i)}
                        style={{
                          textAlign: 'left',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: showResult ? `2px solid ${resultColor}` : isSelected ? `2px solid ${borderColor}` : '1.5px solid var(--ed-rule)',
                          background: showResult ? resultBg : isSelected ? 'rgba(120,67,238,0.05)' : 'var(--ed-card)',
                          cursor: answered ? 'default' : 'pointer',
                          fontSize: '13px',
                          color: 'var(--ed-ink2)',
                          lineHeight: 1.55,
                          fontFamily: 'inherit',
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          opacity: answered && !isSelected ? 0.5 : 1,
                        }}
                      >
                        <span
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            flexShrink: 0,
                            border: showResult ? `1.5px solid ${resultColor}` : '1.5px solid var(--ed-rule)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '9px',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 700,
                            color: showResult ? resultColor : 'var(--ed-ink3)',
                            background: showResult ? resultBg : 'transparent',
                          }}
                        >
                          {showResult ? (opt.correct ? '✓' : '✕') : String.fromCharCode(65 + i)}
                        </span>
                        {opt.text}
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {answered ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        marginTop: '12px',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        background: isCorrect ? 'var(--ed-green-bg)' : 'var(--ed-amber-bg)',
                        border: `1px solid ${isCorrect ? 'var(--ed-green-border)' : 'var(--ed-amber-border)'}`,
                      }}
                    >
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', color: isCorrect ? 'var(--ed-green)' : 'var(--ed-amber)', marginBottom: '5px' }}>
                        {isCorrect ? '✓ RIGHT TRACK' : '→ THINK AGAIN'}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>
                        {options[selectedIdx!].feedback}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

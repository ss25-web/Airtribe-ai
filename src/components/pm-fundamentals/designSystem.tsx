'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MentorFace, MENTOR_META, type MentorId } from './MentorFaces';
import { useLearnerStore } from '@/lib/learnerStore';

// Map name strings used in Avatar calls to MentorId
const NAME_TO_MENTOR: Record<string, MentorId> = {
  'Asha':  'asha',
  'Dev':   'dev',
  'Maya':  'maya',
  'Kiran': 'kiran',
  'Rohan': 'dev',
};

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
export type Track = 'new-pm' | 'apm';

// ─────────────────────────────────────────
// CSS VARIABLE SHORTHAND (used for fallback reference only)
// All components use var(--ed-*) for dark mode support
// ─────────────────────────────────────────
export const ED = {
  ink:          '#1C1814',
  ink2:         '#4A4540',
  ink3:         '#8A8580',
  rule:         '#E0D9D0',
  card:         '#FFFFFF',
  cream:        '#F6F1E7',
  cream2:       '#EDE8DC',
  indigo:       '#4F46E5',
  indigoBg:     '#F5F3FF',
  indigoBorder: '#DDD9F8',
  amber:        '#B5720A',
  amberBg:      'rgba(181,114,10,0.06)',
  amberBorder:  'rgba(181,114,10,0.2)',
  green:        '#0D7A5A',
  greenBg:      'rgba(13,122,90,0.06)',
  greenBorder:  'rgba(13,122,90,0.2)',
} as const;

// ─────────────────────────────────────────
// INTERACTIVE CARD (was: glass card)
// ─────────────────────────────────────────
export const glassCard = (_accent: string, _accentRgb: string): React.CSSProperties => ({
  background: 'var(--ed-indigo-bg)',
  borderRadius: '12px',
  padding: '28px',
  border: '1px solid var(--ed-indigo-border)',
  boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
});

// ─────────────────────────────────────────
// DEMO LABEL
// ─────────────────────────────────────────
export const demoLabel = (text: string, _color: string) => (
  <div style={{
    display: 'inline-block',
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    fontSize: '10px', fontWeight: 700,
    letterSpacing: '0.14em', textTransform: 'uppercase' as const,
    color: 'var(--ed-indigo)', marginBottom: '8px',
  }}>
    {text}
  </div>
);

// ─────────────────────────────────────────
// CHAPTER LABEL
// ─────────────────────────────────────────
type TrackHeroCardPart = {
  id?: string;
  num: string;
  label: string;
};

export const TrackHeroCard = ({
  moduleNum,
  moduleLabel,
  trackLabel,
  accent,
  parts,
  completedSections = new Set<string>(),
}: {
  moduleNum: string;
  moduleLabel: string;
  trackLabel: string;
  accent: string;
  parts: TrackHeroCardPart[];
  completedSections?: Set<string>;
}) => {
  const doneCount = parts.filter(p => p.id && completedSections.has(p.id)).length;
  const donePct = parts.length ? Math.round((doneCount / parts.length) * 100) : 0;
  const nextPart = parts.find(p => !p.id || !completedSections.has(p.id)) ?? parts[0];

  return (
    <div style={{ flexShrink: 0, width: '168px', paddingTop: '48px' }}>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
        <div className="float3d" style={{ transformStyle: 'preserve-3d' }}>
          <div style={{
            background: 'linear-gradient(145deg, #1A1218 0%, #241228 100%)',
            borderRadius: '14px',
            padding: '20px 18px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: accent, marginBottom: '10px' }}>
              MODULE {moduleNum}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>
              {moduleLabel}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(240,232,216,0.45)', marginBottom: '16px' }}>{trackLabel}</div>
            <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
              <motion.div animate={{ width: `${donePct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ height: '100%', background: accent, borderRadius: '1px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {parts.map(p => {
                const done = Boolean(p.id && completedSections.has(p.id));
                const isNext = p === nextPart;
                return (
                  <div key={`${p.num}-${p.label}`} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                      background: done ? '#0D7A5A' : isNext ? accent : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${done ? '#0D7A5A' : isNext ? accent : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '7px', color: done || isNext ? '#fff' : 'rgba(255,255,255,0.3)',
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                      transition: 'background 0.3s, border-color 0.3s',
                    }}>
                      {done ? '✓' : p.num}
                    </div>
                    <div style={{
                      fontSize: '9px',
                      color: done ? 'rgba(240,232,216,0.5)' : isNext ? 'rgba(240,232,216,0.9)' : 'rgba(240,232,216,0.3)',
                      lineHeight: 1.3,
                      flex: 1,
                      transition: 'color 0.3s',
                    }}>
                      {p.label.split(' — ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '16px', padding: '8px 10px', borderRadius: '6px', background: `${accent}22`, border: `1px solid ${accent}44` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: accent, fontWeight: 700, marginBottom: '2px' }}>
                {donePct === 100 ? 'COMPLETE' : 'NEXT UP'}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(240,232,216,0.6)' }}>
                {donePct === 100 ? `All ${parts.length} parts done` : nextPart ? nextPart.label.split(' — ')[0] : 'Start here'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const chLabel = (text: string, _color?: string) => (
  <div style={{
    display: 'inline-block',
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    fontSize: '10px', fontWeight: 700,
    letterSpacing: '0.14em', textTransform: 'uppercase' as const,
    color: 'var(--ed-indigo)', marginBottom: '14px',
  }}>
    {text}
  </div>
);

// ─────────────────────────────────────────
// BEAT LABEL
// ─────────────────────────────────────────
export const beatLabel = (text: string, _color?: string) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    fontSize: '9px', fontWeight: 700,
    letterSpacing: '0.14em', textTransform: 'uppercase' as const,
    color: 'var(--ed-ink3)', marginBottom: '10px',
  }}>
    <span style={{ width: '20px', height: '1px', background: 'var(--ed-ink3)', display: 'inline-block' }} />
    {text}
  </div>
);

// ─────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────
export const h2 = (node: React.ReactNode) => (
  <h2 style={{
    fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 700, lineHeight: 1.25,
    letterSpacing: '-0.02em', color: 'var(--ed-ink)', marginBottom: '20px',
    fontFamily: "'Lora', 'Georgia', 'Times New Roman', serif",
  }}>{node}</h2>
);

export const para = (node: React.ReactNode) => (
  <p style={{ fontSize: '16px', lineHeight: 1.85, color: 'var(--ed-ink2)', marginBottom: '18px' }}>{node}</p>
);

export const pullQuote = (text: string, _color?: string) => (
  <blockquote style={{
    position: 'relative', margin: '36px 0', padding: '20px 28px',
    background: 'var(--ed-amber-bg)', borderRadius: '4px',
    borderLeft: '4px solid var(--ed-amber)',
    borderTop: '1px solid var(--ed-amber-border)',
    borderRight: '1px solid var(--ed-amber-border)',
    borderBottom: '1px solid var(--ed-amber-border)',
  }}>
    <div style={{
      fontSize: '18px', fontStyle: 'italic', color: 'var(--ed-ink)', lineHeight: 1.7,
      fontFamily: "'Lora', 'Georgia', serif",
    }}>&ldquo;{text}&rdquo;</div>
  </blockquote>
);

export const keyBox = (title: string, items: string[], color?: string) => (
  <div style={{
    background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', margin: '24px 0',
    borderTop: '1px solid var(--ed-rule)',
    borderRight: '1px solid var(--ed-rule)',
    borderBottom: '1px solid var(--ed-rule)',
    borderLeft: `4px solid ${color ?? 'var(--ed-indigo)'}`,
  }}>
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase' as const,
      color: color ?? 'var(--ed-indigo)', marginBottom: '14px',
    }}>{title}</div>
    {items.map((item, i) => (
      <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'flex-start' }}>
        <span style={{ color: color ?? 'var(--ed-indigo)', fontSize: '12px', flexShrink: 0, fontWeight: 700, marginTop: '2px' }}>▸</span>
        <span style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>{item}</span>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────
// SITUATION CARD (narrative beat)
// ─────────────────────────────────────────
export const SituationCard = ({ children, accent: _accent, accentRgb: _accentRgb, label }: {
  children: React.ReactNode; accent?: string; accentRgb?: string; label?: string;
}) => (
  <div style={{
    position: 'relative',
    background: 'var(--ed-clay-surface-amber)',
    borderRadius: '10px',
    padding: '24px 28px',
    margin: '0 0 34px',
    borderTop: '1px solid var(--ed-clay-top-border)',
    borderRight: '1px solid var(--ed-amber-border)',
    borderBottom: '1px solid var(--ed-amber-border)',
    borderLeft: '6px solid var(--ed-amber)',
    boxShadow: '0 18px 34px var(--ed-clay-shadow), 0 6px 0 rgba(181,114,10,0.18), inset -4px -4px 10px var(--ed-clay-inset-dark), inset 4px 4px 10px var(--ed-clay-inset-light)',
    transform: 'translateZ(0)',
  }}>
    <div aria-hidden="true" style={{
      position: 'absolute',
      inset: '1px auto auto 14px',
      width: '42%',
      height: '2px',
      borderRadius: '999px',
      background: 'var(--ed-clay-highlight)',
    }} />
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800,
      letterSpacing: '0.18em', textTransform: 'uppercase' as const,
      color: 'var(--ed-amber)', marginBottom: '10px',
    }}>{label ?? "Situation"}</div>
    <div style={{
      fontSize: '15px', color: 'var(--ed-ink)', lineHeight: 1.85,
      fontStyle: 'italic', fontFamily: "'Lora', 'Georgia', serif",
    }}>{children}</div>
  </div>
);

// ─────────────────────────────────────────
// APPLY IT BOX
// ─────────────────────────────────────────
export const ApplyItBox = ({ prompt, color: _color }: { prompt: string; color?: string }) => (
  <div style={{
    background: 'var(--ed-green-bg)', borderRadius: '6px', padding: '20px 24px', margin: '28px 0 0',
    borderTop: '1px solid var(--ed-green-border)',
    borderRight: '1px solid var(--ed-green-border)',
    borderBottom: '1px solid var(--ed-green-border)',
    borderLeft: '4px solid var(--ed-green)',
  }}>
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700,
      letterSpacing: '0.16em', textTransform: 'uppercase' as const,
      color: 'var(--ed-green)', marginBottom: '10px',
    }}>✎ Apply It to Your Product</div>
    <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8 }}>{prompt}</div>
  </div>
);

// ─────────────────────────────────────────
// PM PRINCIPLE BOX
// ─────────────────────────────────────────
export const PMPrincipleBox = ({ principle, color: _color, label }: { principle: string; color?: string; label?: string }) => (
  <div style={{
    background: 'var(--ed-indigo-bg)', borderRadius: '6px', padding: '18px 22px', margin: '28px 0',
    borderTop: '1px solid var(--ed-indigo-border)',
    borderRight: '1px solid var(--ed-indigo-border)',
    borderBottom: '1px solid var(--ed-indigo-border)',
    borderLeft: '4px solid var(--ed-indigo)',
  }}>
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700,
      letterSpacing: '0.16em', textTransform: 'uppercase' as const,
      color: 'var(--ed-indigo)', marginBottom: '8px',
    }}>{label ?? '◈ PM Principle'}</div>
    <div style={{
      fontSize: '16px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.6,
      fontStyle: 'italic', fontFamily: "'Lora', 'Georgia', serif",
    }}>&ldquo;{principle}&rdquo;</div>
  </div>
);

// ─────────────────────────────────────────
// CHAPTER SECTION WRAPPER
// ─────────────────────────────────────────
export const ChapterSection = ({ num, accentRgb, id, first = false, children }: {
  num: string; accent?: string; accentRgb: string; id: string; first?: boolean; children: React.ReactNode;
}) => (
  <section data-section={id} style={{
    position: 'relative', padding: '64px 0',
    scrollMarginTop: '96px',
    borderTop: first ? 'none' : '1px solid var(--ed-rule)',
    overflow: 'hidden',
  }}>
    {/* Decorative large background number */}
    <div aria-hidden="true" style={{
      position: 'absolute', right: '-12px', top: '8px',
      fontSize: 'clamp(100px, 12vw, 160px)', fontWeight: 700, lineHeight: 1,
      color: `rgba(${accentRgb},0.04)`,
      fontFamily: "'Lora', 'Georgia', serif",
      letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none', zIndex: 0,
    }}>{num}</div>
    <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
  </section>
);

// ─────────────────────────────────────────
// AVATAR  (AI Mentor card — interactive question + concept mastery)
// ─────────────────────────────────────────
export interface AvatarOption {
  text: string;
  correct: boolean;
  feedback: string;
}

export const Avatar = ({ name, nameColor: _nameColor, borderColor, content, expandedContent, question, options, conceptId }: {
  emoji?: string; name: string; nameColor: string; borderColor: string;
  content: React.ReactNode;
  expandedContent?: React.ReactNode;
  question?: string;
  options?: AvatarOption[];
  conceptId?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const mentorId: MentorId = NAME_TO_MENTOR[name] ?? 'asha';
  const meta = MENTOR_META[mentorId];
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
        background: 'var(--ed-card)', borderRadius: '10px',
        borderTop: '1px solid var(--ed-rule)',
        borderRight: '1px solid var(--ed-rule)',
        borderBottom: '1px solid var(--ed-rule)',
        borderLeft: `4px solid ${borderColor}`,
        marginTop: '28px', overflow: 'hidden',
        transition: 'box-shadow 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}>

      {/* Header strip */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '7px 18px', background: 'var(--ed-cream)',
          borderBottom: '1px solid var(--ed-rule)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ width: '5px', height: '5px', borderRadius: '50%', background: borderColor, display: 'inline-block' }}
          />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'var(--ed-indigo)',
          }}>AI Mentor</span>
          {question && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '8px',
              color: 'var(--ed-ink3)', letterSpacing: '0.06em', marginLeft: '4px',
            }}>· has a question for you</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {question && answered && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700,
              color: isCorrect ? 'var(--ed-green)' : 'var(--coral)', letterSpacing: '0.06em',
            }}>{isCorrect ? '✓ correct' : '✗ revisit'}</span>
          )}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}
            style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>▼</motion.span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <MentorFace mentor={mentorId} size={66} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '1px' }}>{meta.name}</div>
          <div style={{
            fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace",
            marginBottom: '10px', letterSpacing: '0.04em',
          }}>{meta.role}</div>
          <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.82 }}>{content}</div>
        </div>
      </div>

      {/* Expanded: deep-dive + interactive question */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}>

            {/* Deep-dive text */}
            {expandedContent && (
              <div style={{
                padding: '16px 18px 20px', borderTop: '1px solid var(--ed-rule)',
                background: 'var(--ed-cream)', display: 'flex', gap: '16px', alignItems: 'flex-start',
              }}>
                <div style={{ width: '3px', flexShrink: 0, background: borderColor, borderRadius: '2px', alignSelf: 'stretch', opacity: 0.35 }} />
                <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.9 }}>{expandedContent}</div>
              </div>
            )}

            {/* Interactive question */}
            {question && options && (
              <div style={{
                padding: '18px 20px 20px',
                borderTop: '1px solid var(--ed-rule)',
                background: 'var(--ed-cream)',
              }}>
                {/* Question header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                    background: borderColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: 700, color: '#fff',
                  }}>{meta.name[0]}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', letterSpacing: '0.12em' }}>
                    {meta.name.toUpperCase()} ASKS
                  </div>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.55, marginBottom: '14px', fontFamily: "'Lora', serif" }}>
                  {question}
                </div>

                {/* Options */}
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
                          textAlign: 'left', padding: '12px 16px', borderRadius: '8px',
                          border: showResult ? `2px solid ${resultColor}` : isSelected ? `2px solid ${borderColor}` : '1.5px solid var(--ed-rule)',
                          background: showResult ? resultBg : isSelected ? 'rgba(120,67,238,0.05)' : 'var(--ed-card)',
                          cursor: answered ? 'default' : 'pointer',
                          fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.55,
                          fontFamily: 'inherit', transition: 'all 0.15s',
                          display: 'flex', alignItems: 'flex-start', gap: '10px',
                          opacity: answered && !isSelected ? 0.5 : 1,
                        }}>
                        <span style={{
                          width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                          border: showResult ? `1.5px solid ${resultColor}` : '1.5px solid var(--ed-rule)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                          color: showResult ? resultColor : 'var(--ed-ink3)',
                          background: showResult ? resultBg : 'transparent',
                          transition: 'all 0.15s',
                        }}>
                          {showResult ? (opt.correct ? '✓' : '✗') : String.fromCharCode(65 + i)}
                        </span>
                        {opt.text}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                      style={{
                        marginTop: '12px', padding: '12px 14px', borderRadius: '8px',
                        background: isCorrect ? 'var(--ed-green-bg)' : 'var(--ed-amber-bg)',
                        border: `1px solid ${isCorrect ? 'var(--ed-green-border)' : 'var(--ed-amber-border)'}`,
                      }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', color: isCorrect ? 'var(--ed-green)' : 'var(--ed-amber)', marginBottom: '5px' }}>
                        {isCorrect ? '✓ RIGHT TRACK' : '→ THINK AGAIN'}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>
                        {options[selectedIdx!].feedback}
                      </div>
                      {conceptId && (
                        <div style={{ marginTop: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>
                          {isCorrect ? '↑ concept mastery updated' : '· try the section quiz for more practice'}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const CharacterCallout = ({
  mentor,
  activity = 'speaks',
  children,
}: {
  mentor: MentorId;
  activity?: string;
  children: React.ReactNode;
}) => {
  const meta = MENTOR_META[mentor];

  return (
    <motion.div
      whileHover={{
        y: -3,
        boxShadow: `0 24px 44px var(--ed-clay-shadow), 0 8px 0 ${meta.accent}22, inset -5px -5px 12px var(--ed-clay-inset-dark), inset 5px 5px 12px var(--ed-clay-inset-light)`,
      }}
      style={{
        background: `linear-gradient(145deg, var(--ed-card) 0%, ${meta.accent}14 48%, var(--ed-cream2) 100%)`,
        borderRadius: '10px',
        borderTop: '1px solid var(--ed-clay-top-border)',
        borderRight: `1px solid ${meta.accent}34`,
        borderBottom: `1px solid ${meta.accent}42`,
        borderLeft: `6px solid ${meta.accent}`,
        marginTop: '30px',
        marginBottom: '34px',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s, transform 0.3s',
        boxShadow: `0 18px 34px var(--ed-clay-shadow), 0 6px 0 ${meta.accent}20, inset -4px -4px 10px var(--ed-clay-inset-dark), inset 4px 4px 10px var(--ed-clay-inset-light)`,
        transformStyle: 'preserve-3d',
      }}>
      <div style={{
        padding: '8px 18px',
        background: `linear-gradient(90deg, ${meta.accent}24, var(--ed-cream2))`,
        borderBottom: `1px solid ${meta.accent}22`,
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
      }}>
        <motion.span
          animate={{ opacity: [1, 0.35, 1], scale: [1, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: meta.accent,
            display: 'inline-block',
            boxShadow: `0 0 0 4px ${meta.accent}1A`,
          }}
        />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800,
          letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'var(--ed-indigo)',
        }}>{meta.name}</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '8px',
          color: 'var(--ed-ink3)', letterSpacing: '0.06em',
        }}>· {activity}</span>
      </div>
      <div style={{ padding: '18px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <MentorFace mentor={mentor} size={66} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ed-ink)', marginBottom: '1px' }}>{meta.name}</div>
          <div style={{
            fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace",
            marginBottom: '10px', letterSpacing: '0.04em',
          }}>{meta.role}</div>
          <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.82 }}>{children}</div>
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────
// CHAPTER TRANSITION TEASER
// ─────────────────────────────────────────
export const NextChapterTeaser = ({ text, accent: _accent }: { text: string; accent?: string }) => (
  <div style={{
    marginTop: '48px', padding: '16px 20px', borderRadius: '6px',
    background: 'var(--ed-card)',
    borderTop: '1px solid var(--ed-rule)',
    borderRight: '1px solid var(--ed-rule)',
    borderLeft: '1px solid var(--ed-rule)',
    borderBottom: '3px solid var(--ed-indigo)',
    display: 'flex', alignItems: 'center', gap: '14px',
  }}>
    <span style={{
      fontSize: '10px', color: 'var(--ed-indigo)',
      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, whiteSpace: 'nowrap' as const,
    }}>NEXT →</span>
    <span style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{text}</span>
  </div>
);

// ─────────────────────────────────────────
// TILT CARD — shared 3D mouse-tracking wrapper for all mockups
// ─────────────────────────────────────────
// ─── CharacterChip ────────────────────────────────────────────────────────────
// Squircle, opaque, fixed-width character card for pre-read hero sections.
// Face is displayed prominently on top. No desc paragraph.
// Usage: <CharacterChip name="..." role="..." accent="#..."><MentorFace ... /></CharacterChip>
export const CharacterChip = ({
  name, role, accent, children,
}: {
  name: string;
  role: string;
  accent: string;
  children: React.ReactNode;
}) => (
  <div style={{
    width: '108px',
    flexShrink: 0,
    padding: '16px 10px 14px',
    borderRadius: '20px',
    background: 'var(--ed-card)',
    border: '1px solid var(--ed-rule)',
    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    textAlign: 'center' as const,
  }}>
    <div style={{ borderRadius: '14px', overflow: 'hidden', flexShrink: 0 }}>
      {children}
    </div>
    <div style={{ fontSize: '12px', fontWeight: 700, color: accent, lineHeight: 1.2 }}>
      {name}
    </div>
    <div style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '8px',
      color: 'var(--ed-ink3)',
      lineHeight: 1.4,
    }}>
      {role}
    </div>
  </div>
);

export const TiltCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setPos({ x: (e.clientX - left) / width, y: (e.clientY - top) / height });
  }, []);
  const transform = hovered
    ? `perspective(1000px) rotateX(${(pos.y - 0.5) * -12}deg) rotateY(${(pos.x - 0.5) * 12}deg) scale3d(1.015,1.015,1.015)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transformStyle: 'preserve-3d', ...style }}
      animate={{ transform }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────
// CONVERSATION SCENE — shared Priya ↔ stakeholder dialogue bubbles
// ─────────────────────────────────────────
export type CSLine = { speaker: 'priya' | 'other'; text: string };
export type CSMentor = 'rohan' | 'kiran' | 'maya' | 'dev' | 'asha' | 'priya';

export const ConversationScene = ({
  mentor, name, role, accent = 'var(--teal)', lines,
}: {
  mentor: CSMentor; name: string; role: string; accent?: string; lines: CSLine[];
}) => (
  <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {lines.map((l, i) => {
      const isPriya = l.speaker === 'priya';
      return (
        <div key={i} style={{ display: 'flex', flexDirection: isPriya ? 'row-reverse' : 'row', gap: '10px', alignItems: 'flex-end' }}>
          <div style={{ flexShrink: 0 }}>
            {isPriya ? <MentorFace mentor="priya" size={38} /> : <MentorFace mentor={mentor === 'priya' ? 'asha' : mentor} size={38} />}
          </div>
          <div style={{ maxWidth: '72%' }}>
            {(i === 0 || lines[i - 1].speaker !== l.speaker) && (
              <div style={{ fontSize: '10px', fontWeight: 700, color: isPriya ? 'var(--indigo)' : accent, marginBottom: '4px', textAlign: isPriya ? 'right' : 'left', letterSpacing: '0.04em' }}>
                {isPriya ? 'Priya' : name}{' '}
                <span style={{ fontWeight: 400, opacity: 0.65 }}>&middot; {isPriya ? 'APM' : role}</span>
              </div>
            )}
            <div style={{ background: isPriya ? 'rgba(99,102,241,0.13)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isPriya ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: isPriya ? '14px 14px 4px 14px' : '14px 14px 14px 4px', padding: '10px 14px', fontSize: '13.5px', color: 'var(--ed-ink)', lineHeight: 1.65 }}>
              {l.text}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);


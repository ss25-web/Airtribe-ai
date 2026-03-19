'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MentorFace, MENTOR_META, type MentorId } from './MentorFaces';

// Map name strings used in Avatar calls to MentorId
const NAME_TO_MENTOR: Record<string, MentorId> = {
  'Asha':  'asha',
  'Dev':   'dev',
  'Maya':  'maya',
  'Kiran': 'kiran',
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
export const SituationCard = ({ children, accent: _accent, accentRgb: _accentRgb }: {
  children: React.ReactNode; accent?: string; accentRgb?: string;
}) => (
  <div style={{
    position: 'relative', background: 'var(--ed-amber-bg)', borderRadius: '6px',
    padding: '20px 24px', margin: '0 0 28px',
    borderTop: '1px solid var(--ed-amber-border)',
    borderRight: '1px solid var(--ed-amber-border)',
    borderBottom: '1px solid var(--ed-amber-border)',
    borderLeft: '4px solid var(--ed-amber)',
  }}>
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700,
      letterSpacing: '0.18em', textTransform: 'uppercase' as const,
      color: 'var(--ed-amber)', marginBottom: '10px',
    }}>◎ Priya&apos;s Situation</div>
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
export const PMPrincipleBox = ({ principle, color: _color }: { principle: string; color?: string }) => (
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
    }}>◈ PM Principle</div>
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
// AVATAR  (AI Mentor card with illustrated face)
// ─────────────────────────────────────────
export const Avatar = ({ name, nameColor: _nameColor, borderColor, content, expandedContent }: {
  emoji?: string; name: string; nameColor: string; borderColor: string;
  content: React.ReactNode; expandedContent: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const mentorId: MentorId = NAME_TO_MENTOR[name] ?? 'asha';
  const meta = MENTOR_META[mentorId];

  return (
    <motion.div
      whileHover={{ y: -1, boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}
      onClick={() => setOpen(o => !o)}
      style={{
        cursor: 'pointer', background: 'var(--ed-card)', borderRadius: '10px',
        borderTop: '1px solid var(--ed-rule)',
        borderRight: '1px solid var(--ed-rule)',
        borderBottom: '1px solid var(--ed-rule)',
        borderLeft: `4px solid ${borderColor}`,
        marginTop: '28px', overflow: 'hidden',
        transition: 'box-shadow 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}>

      {/* Header strip */}
      <div style={{
        padding: '7px 18px', background: 'var(--ed-cream)',
        borderBottom: '1px solid var(--ed-rule)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
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
        </div>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '8px',
          color: 'var(--ed-ink3)', letterSpacing: '0.06em',
        }}>{open ? 'collapse ↑' : 'tap to expand ↓'}</span>
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
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ fontSize: '10px', color: 'var(--ed-ink3)', flexShrink: 0, marginTop: '4px' }}>▼</motion.div>
      </div>

      {/* Expanded deep-dive */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '16px 18px 20px', borderTop: '1px solid var(--ed-rule)',
              background: 'var(--ed-cream)', display: 'flex', gap: '16px', alignItems: 'flex-start',
            }}>
              <div style={{ width: '3px', flexShrink: 0, background: borderColor, borderRadius: '2px', alignSelf: 'stretch', opacity: 0.35 }} />
              <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.9 }}>{expandedContent}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

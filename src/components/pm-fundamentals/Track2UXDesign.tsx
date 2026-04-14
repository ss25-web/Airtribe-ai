'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  h2, para, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, ApplyItBox,
} from './designSystem';
import { MentorFace } from './MentorFaces';

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────
const ACCENT = '#E07A5F';
const ACCENT_RGB = '224,122,95';
const MODULE_CONTEXT = `Module 04 of Airtribe PM Fundamentals — APM Track. Priya Sharma at EdSpark has just landed 3 enterprise clients (Salesforce, Zendesk, Infosys). Covers: UX debt as revenue risk, design systems vs. shipping speed, design critique facilitation, the speed-vs-craft threshold, and making the business case for design investment.`;

// ─────────────────────────────────────────
// CONVERSATION SCENE — Priya ↔ stakeholder
// ─────────────────────────────────────────
type CSLine = { speaker: 'priya' | 'other'; text: string };
const ConversationScene = ({ mentor, name, role, accent = 'var(--teal)', lines }: {
  mentor: 'rohan' | 'kiran' | 'maya' | 'dev' | 'asha'; name: string; role: string; accent?: string; lines: CSLine[];
}) => (
  <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {lines.map((l, i) => {
      const isPriya = l.speaker === 'priya';
      return (
        <div key={i} style={{ display: 'flex', flexDirection: isPriya ? 'row-reverse' : 'row', gap: '10px', alignItems: 'flex-end' }}>
          <div style={{ flexShrink: 0 }}>
            {isPriya ? <MentorFace mentor="priya" size={38} /> : <MentorFace mentor={mentor} size={38} />}
          </div>
          <div style={{ maxWidth: '72%' }}>
            {(i === 0 || lines[i - 1].speaker !== l.speaker) && <div style={{ fontSize: '10px', fontWeight: 700, color: isPriya ? 'var(--indigo)' : accent, marginBottom: '4px', textAlign: isPriya ? 'right' : 'left', letterSpacing: '0.04em' }}>{isPriya ? 'Priya' : name} <span style={{ fontWeight: 400, opacity: 0.65 }}>· {isPriya ? 'PM' : role}</span></div>}
            <div style={{ background: isPriya ? 'rgba(99,102,241,0.13)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isPriya ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: isPriya ? '14px 14px 4px 14px' : '14px 14px 14px 4px', padding: '10px 14px', fontSize: '13.5px', color: 'var(--ed-ink)', lineHeight: 1.65 }}>{l.text}</div>
          </div>
        </div>
      );
    })}
  </div>
);

// ─────────────────────────────────────────
// TILT CARD — 3D mouse-tracking wrapper
// ─────────────────────────────────────────
const TiltCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -7, y: x * 7, scale: 1.015 });
  };
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, scale: 1 })}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`,
        transition: 'transform 0.18s ease',
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─────────────────────────────────────────
// ENTERPRISE AUDIT MOCKUP
// Learner clicks inconsistent UI elements to flag them
// ─────────────────────────────────────────
const EnterpriseAuditMockup = () => {
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  type UIElement = {
    id: number;
    label: string;
    preview: React.ReactNode;
    isInconsistent: boolean;
    reason: string;
  };

  const elements: UIElement[] = [
    {
      id: 0, label: 'Primary Action Button', isInconsistent: true,
      reason: 'Skill Gap Tracker uses rounded-full, Coaching Analysis uses rounded-md — two different visual languages for the same action.',
      preview: (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ background: '#E07A5F', color: '#fff', borderRadius: '9999px', padding: '6px 14px', fontSize: '11px', fontWeight: 700, fontFamily: 'monospace' }}>Save</div>
          <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>vs</span>
          <div style={{ background: '#E07A5F', color: '#fff', borderRadius: '4px', padding: '6px 14px', fontSize: '11px', fontWeight: 700, fontFamily: 'monospace' }}>Save</div>
        </div>
      ),
    },
    {
      id: 1, label: 'Page Header Typography', isInconsistent: true,
      reason: 'Team Dashboard headers are 28px/700 weight. Skill Gap Tracker headers are 22px/600 weight. Same hierarchy, different sizing — disorienting across context switches.',
      preview: (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>Dashboard</span>
          <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>vs</span>
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#fff', fontFamily: 'monospace' }}>Dashboard</span>
        </div>
      ),
    },
    {
      id: 2, label: 'Error State Message', isInconsistent: false,
      reason: 'Consistent across the platform — red #EF4444 with a warning icon prefix. This one is fine.',
      preview: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '5px', padding: '6px 10px' }}>
          <span style={{ color: '#EF4444', fontSize: '11px' }}>⚠</span>
          <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#EF4444' }}>Session upload failed</span>
        </div>
      ),
    },
    {
      id: 3, label: 'Data Table Row Actions', isInconsistent: true,
      reason: 'Coaching Analysis shows inline text links ("View · Edit · Delete"). Team Dashboard uses icon-only buttons. Enterprise clients expect one consistent interaction pattern for row-level actions.',
      preview: (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['View', 'Edit', 'Delete'].map(a => <span key={a} style={{ fontFamily: 'monospace', fontSize: '10px', color: '#3A86FF', textDecoration: 'underline', cursor: 'pointer' }}>{a}</span>)}
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>vs</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['👁', '✏️', '🗑'].map(i => <div key={i} style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', cursor: 'pointer' }}>{i}</div>)}
          </div>
        </div>
      ),
    },
    {
      id: 4, label: 'Empty State Design', isInconsistent: false,
      reason: 'Consistent — all empty states use the same illustration style, centered layout, and CTA button pattern.',
      preview: (
        <div style={{ textAlign: 'center' as const, padding: '10px' }}>
          <div style={{ fontSize: '22px', marginBottom: '4px' }}>📋</div>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>No sessions yet</div>
          <div style={{ background: ACCENT, color: '#fff', borderRadius: '5px', padding: '4px 10px', fontSize: '10px', fontFamily: 'monospace', display: 'inline-block' }}>Upload first session</div>
        </div>
      ),
    },
  ];

  const correctFlagged = elements.filter(e => e.isInconsistent).map(e => e.id);
  const score = [...flagged].filter(id => elements.find(e => e.id === id)?.isInconsistent).length;
  const falsePositives = [...flagged].filter(id => !elements.find(e => e.id === id)?.isInconsistent).length;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ background: '#0F172A', borderRadius: '12px', padding: '24px', border: '1px solid #1E293B', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', marginBottom: '4px' }}>ENTERPRISE READINESS AUDIT · EDSPARK PLATFORM</div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Click each element to flag inconsistencies before the Infosys demo</div>
          </div>
          <div style={{ textAlign: 'right' as const }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', fontWeight: 700, color: flagged.size > 0 ? ACCENT : 'rgba(255,255,255,0.2)' }}>{flagged.size}</div>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>flagged</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '14px' }}>
          {elements.map((el) => {
            const isFlagged = flagged.has(el.id);
            return (
              <div key={el.id}>
                <div
                  onClick={() => {
                    if (submitted) return;
                    setFlagged(prev => {
                      const next = new Set(prev);
                      if (next.has(el.id)) next.delete(el.id); else next.add(el.id);
                      return next;
                    });
                  }}
                  style={{
                    padding: '12px 14px', borderRadius: '8px', cursor: submitted ? 'default' : 'pointer',
                    background: submitted
                      ? (el.isInconsistent && isFlagged ? 'rgba(40,200,64,0.08)' : (!el.isInconsistent && !isFlagged ? 'rgba(255,255,255,0.03)' : (!el.isInconsistent && isFlagged ? 'rgba(239,68,68,0.08)' : 'rgba(224,122,95,0.06)')))
                      : (isFlagged ? `rgba(${ACCENT_RGB},0.1)` : 'rgba(255,255,255,0.03)'),
                    border: `1px solid ${submitted
                      ? (el.isInconsistent && isFlagged ? 'rgba(40,200,64,0.35)' : (!el.isInconsistent && !isFlagged ? 'rgba(255,255,255,0.08)' : (!el.isInconsistent && isFlagged ? 'rgba(239,68,68,0.35)' : `rgba(${ACCENT_RGB},0.3)`)))
                      : (isFlagged ? `rgba(${ACCENT_RGB},0.4)` : 'rgba(255,255,255,0.08)')}`,
                    transition: 'all 0.18s ease',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>{el.label.toUpperCase()}</div>
                    {el.preview}
                  </div>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    border: `1.5px solid ${isFlagged ? ACCENT : 'rgba(255,255,255,0.2)'}`,
                    background: isFlagged ? `rgba(${ACCENT_RGB},0.15)` : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', color: isFlagged ? ACCENT : 'transparent',
                    transition: 'all 0.15s ease',
                  }}>⚑</div>
                </div>
                <AnimatePresence>
                  {submitted && isFlagged && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '8px 14px', margin: '2px 0 0', borderRadius: '6px', background: el.isInconsistent ? 'rgba(40,200,64,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${el.isInconsistent ? 'rgba(40,200,64,0.2)' : 'rgba(239,68,68,0.2)'}`, fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                        {el.isInconsistent ? '✓ ' : '✗ '}{el.reason}
                      </div>
                    </motion.div>
                  )}
                  {submitted && !isFlagged && el.isInconsistent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '8px 14px', margin: '2px 0 0', borderRadius: '6px', background: `rgba(${ACCENT_RGB},0.06)`, border: `1px solid rgba(${ACCENT_RGB},0.2)`, fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                        Missed · {el.reason}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        {!submitted ? (
          <div
            onClick={() => setSubmitted(true)}
            style={{ textAlign: 'center' as const, padding: '10px', background: `rgba(${ACCENT_RGB},0.12)`, borderRadius: '6px', border: `1px solid rgba(${ACCENT_RGB},0.3)`, cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px', color: ACCENT, fontWeight: 700, letterSpacing: '0.05em' }}
          >
            Submit Audit →
          </div>
        ) : (
          <div style={{ textAlign: 'center' as const, padding: '12px', background: score === correctFlagged.length && falsePositives === 0 ? 'rgba(40,200,64,0.08)' : 'rgba(255,255,255,0.04)', borderRadius: '6px', border: `1px solid ${score === correctFlagged.length && falsePositives === 0 ? 'rgba(40,200,64,0.25)' : 'rgba(255,255,255,0.1)'}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', fontWeight: 700, color: score >= 2 ? '#28C840' : ACCENT, marginBottom: '4px' }}>
              {score}/{correctFlagged.length} inconsistencies found
              {falsePositives > 0 ? ` · ${falsePositives} false flag${falsePositives > 1 ? 's' : ''}` : ''}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>
              {score === correctFlagged.length && falsePositives === 0 ? 'Perfect audit — Infosys won\'t catch you off guard.' : 'Enterprise procurement teams catch every one of these. Review the flagged items.'}
            </div>
          </div>
        )}
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// UX DEBT CALCULATOR
// Sliders → revenue-at-risk number
// ─────────────────────────────────────────
const UXDebtCalculator = () => {
  const [users, setUsers] = useState(1200);
  const [dropoff, setDropoff] = useState(18);
  const [acv, setAcv] = useState(24000);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const riskPerUser = acv / 12;
  const atRisk = Math.round(users * (dropoff / 100) * riskPerUser);
  const annualRisk = atRisk * 12;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div ref={ref} style={{ background: '#111827', borderRadius: '12px', padding: '28px', border: '1px solid #1F2D42', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', marginBottom: '20px', textAlign: 'center' as const }}>
          UX DEBT REVENUE CALCULATOR · KIRAN&apos;S MODEL
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px', marginBottom: '24px' }}>
          {[
            { label: 'Active Enterprise Users', val: users, set: setUsers, min: 200, max: 5000, step: 100, fmt: (v: number) => v.toLocaleString() },
            { label: 'Feature Drop-off Rate (%)', val: dropoff, set: setDropoff, min: 2, max: 60, step: 1, fmt: (v: number) => `${v}%` },
            { label: 'Avg Contract Value ($/yr)', val: acv, set: setAcv, min: 5000, max: 120000, step: 1000, fmt: (v: number) => `$${(v / 1000).toFixed(0)}k` },
          ].map(({ label, val, set, min, max, step, fmt }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700, color: ACCENT }}>{fmt(val)}</span>
              </div>
              <input
                type="range" min={min} max={max} step={step} value={val}
                onChange={e => set(Number(e.target.value))}
                style={{ width: '100%', accentColor: ACCENT, cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, background: 'rgba(224,122,95,0.08)', border: '1px solid rgba(224,122,95,0.25)', borderRadius: '10px', padding: '16px', textAlign: 'center' as const }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(224,122,95,0.6)', marginBottom: '8px', letterSpacing: '0.1em' }}>MONTHLY REVENUE AT RISK</div>
            <motion.div
              key={atRisk}
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '32px', fontWeight: 700, color: ACCENT, lineHeight: 1 }}
            >
              ${atRisk.toLocaleString()}
            </motion.div>
          </div>
          <div style={{ flex: 1, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '16px', textAlign: 'center' as const }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(239,68,68,0.6)', marginBottom: '8px', letterSpacing: '0.1em' }}>ANNUALISED RISK</div>
            <motion.div
              key={annualRisk}
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '32px', fontWeight: 700, color: '#EF4444', lineHeight: 1 }}
            >
              ${(annualRisk / 1000).toFixed(0)}k
            </motion.div>
          </div>
        </div>
        <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
            Formula: users × (drop-off%) × (ACV ÷ 12) · Based on EdSpark&apos;s actual cohort data from Q1
          </span>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// COMPONENT SPRAWL MOCKUP
// Shows button variants, then consolidates them
// ─────────────────────────────────────────
const ComponentSprawlMockup = () => {
  const [consolidated, setConsolidated] = useState(false);

  const variants = [
    { label: 'Skill Gap Tracker', bg: '#E07A5F', radius: '9999px', weight: 700, size: '12px', padding: '8px 20px' },
    { label: 'Session Analysis', bg: '#D96B50', radius: '6px', weight: 600, size: '11px', padding: '7px 16px' },
    { label: 'Team Dashboard', bg: '#C85A40', radius: '4px', weight: 700, size: '13px', padding: '9px 18px' },
    { label: 'Onboarding Flow', bg: '#E07A5F', radius: '8px', weight: 500, size: '11px', padding: '7px 14px' },
    { label: 'Admin Panel', bg: '#BF5040', radius: '3px', weight: 600, size: '12px', padding: '6px 16px' },
  ];

  const systemButton = { label: 'Design System', bg: '#E07A5F', radius: '6px', weight: 600, size: '12px', padding: '8px 18px' };

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ background: '#0D1117', borderRadius: '12px', padding: '24px', border: '1px solid #21262D', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', marginBottom: '16px', textAlign: 'center' as const }}>
          BUTTON COMPONENT AUDIT · EDSPARK CODEBASE
        </div>
        <AnimatePresence mode="wait">
          {!consolidated ? (
            <motion.div key="sprawl" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '14px', textAlign: 'center' as const }}>
                5 different primary button implementations across the platform
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
                {variants.map((v, i) => (
                  <div key={i} style={{ textAlign: 'center' as const }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.25)', marginBottom: '6px' }}>{v.label}</div>
                    <div style={{ background: v.bg, color: '#fff', borderRadius: v.radius, padding: v.padding, fontSize: v.size, fontWeight: v.weight, fontFamily: 'monospace', whiteSpace: 'nowrap' as const }}>
                      Save Changes
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.2)', marginTop: '5px' }}>
                      r:{v.radius} / w:{v.weight}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(224,122,95,0.7)', marginBottom: '10px' }}>
                  Every new feature adds another variant. Each one costs 2–4h dev time to maintain.
                </div>
                <div
                  onClick={() => setConsolidated(true)}
                  style={{ display: 'inline-block', cursor: 'pointer', padding: '8px 20px', background: `rgba(${ACCENT_RGB},0.12)`, border: `1px solid rgba(${ACCENT_RGB},0.35)`, borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', color: ACCENT, fontWeight: 700 }}
                >
                  Consolidate with Design System →
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="consolidated" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(40,200,64,0.7)', marginBottom: '14px', textAlign: 'center' as const }}>
                1 canonical component · shipped to all 5 surfaces
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0', flexWrap: 'wrap' as const, marginBottom: '20px', position: 'relative' }}>
                {variants.map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: (i - 2) * 60, opacity: 0.4 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    style={{ position: i === 0 ? 'relative' : 'absolute', opacity: i === 0 ? 1 : 0 }}
                  />
                ))}
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>Button.primary (DS v1.0)</div>
                  <div style={{ background: systemButton.bg, color: '#fff', borderRadius: systemButton.radius, padding: systemButton.padding, fontSize: systemButton.size, fontWeight: systemButton.weight, fontFamily: 'monospace' }}>
                    Save Changes
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                {[
                  { label: 'Files removed', value: '4', color: '#28C840' },
                  { label: 'Maintenance cost', value: '−80%', color: '#28C840' },
                  { label: 'Design reviews', value: '1 source', color: '#3A86FF' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' as const, padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '18px', fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div
                onClick={() => setConsolidated(false)}
                style={{ textAlign: 'center' as const, cursor: 'pointer', fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)', textDecoration: 'underline' }}
              >
                ← see the sprawl again
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// CRITIQUE SIMULATOR
// Show a wireframe + pick the right PM feedback
// ─────────────────────────────────────────
const CritiqueSimulator = () => {
  type Challenge = {
    screen: string;
    description: string;
    options: { text: string; correct: boolean; feedback: string }[];
  };

  const challenges: Challenge[] = [
    {
      screen: 'Coaching Session Analysis — Result Screen',
      description: 'Maya presents the post-analysis results layout: a wall of text with AI insights, a score percentage, and a list of "improvement areas." There\'s no visual hierarchy.',
      options: [
        { text: '"The score should be bigger and in the center, it\'s the most important thing."', correct: false, feedback: "You\'re designing, not PM-ing. You\'ve told Maya what to do without explaining why. She\'ll comply and resent it — or push back correctly because you haven\'t grounded this in user needs." },
        { text: '"From our user research, managers scan for one key number first. Does this design let them find their score without reading every paragraph?"', correct: true, feedback: "Perfect. You\'ve grounded your feedback in a specific user behaviour, named the goal (scannability), and asked a question — not given an order. Maya now has context to design the right solution herself." },
        { text: '"This doesn\'t feel polished. The spacing looks off and the fonts don\'t match our brand."', correct: false, feedback: "Aesthetics and brand are Maya\'s territory. Your job is user goals and business outcomes. This feedback signals that you\'re reviewing design taste, not product effectiveness." },
        { text: '"I think this is fine, let\'s ship it."', correct: false, feedback: "You haven\'t done your job. A PM in a critique should validate user and business goal alignment — not rubber-stamp. \'Fine\' is not feedback." },
      ],
    },
    {
      screen: 'Skill Gap Tracker — Empty State',
      description: 'Maya presents a minimal empty state: a grey placeholder box with "No skills tracked yet." No CTA, no illustration.',
      options: [
        { text: '"Can we add an illustration? Empty states look better with a graphic."', correct: false, feedback: "You\'re optimising for aesthetics. The real question is: what does a new sales manager need to do next, and does this screen answer that? Illustration might help or not — that depends on the goal, not on looking better." },
        { text: '"The empty state needs to answer: what does the user do next? A manager landing here for the first time doesn\'t know how to start. Does this design give them a path forward?"', correct: true, feedback: "This is PM thinking applied to UX. You\'ve defined the job of the empty state — reduce friction for new users — and asked whether the design achieves it. Maya can now solve the right problem." },
        { text: '"The grey colour is too sad. Make it more cheerful."', correct: false, feedback: "Colour psychology is a design decision. Your feedback doesn\'t connect to any user need or business outcome. Cheerful without a purpose is still an ineffective empty state." },
        { text: '"This is too simple, we should add more information about the feature here."', correct: false, feedback: "More information isn\'t always better. A user who just opened the tracker doesn\'t need a feature explanation — they need a clear next action. Information without direction is noise." },
      ],
    },
  ];

  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [history, setHistory] = useState<boolean[]>([]);

  const challenge = challenges[currentChallenge];
  const isLast = currentChallenge === challenges.length - 1;

  const handleNext = () => {
    if (chosen === null) return;
    const correct = challenge.options[chosen].correct;
    setHistory(h => [...h, correct]);
    if (!isLast) {
      setCurrentChallenge(c => c + 1);
      setChosen(null);
    }
  };

  const allDone = history.length === challenges.length;
  const correctCount = history.filter(Boolean).length;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1F2D42', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', marginBottom: '16px', textAlign: 'center' as const }}>
          DESIGN CRITIQUE SIMULATOR · CHOOSE THE PM RESPONSE
        </div>
        {!allDone ? (
          <>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
              {challenges.map((_, i) => (
                <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i < currentChallenge ? '#28C840' : i === currentChallenge ? ACCENT : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: '8px' }}>{challenge.screen.toUpperCase()}</div>
              <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontStyle: 'italic' }}>
                {challenge.description}
              </div>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>
              Maya asks for your feedback. What do you say?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', marginBottom: '14px' }}>
              {challenge.options.map((opt, i) => (
                <div key={i}>
                  <div
                    onClick={() => { if (chosen === null || chosen === i) setChosen(chosen === i ? null : i); }}
                    style={{
                      padding: '10px 12px', borderRadius: '7px', cursor: 'pointer',
                      background: chosen === i ? (opt.correct ? 'rgba(40,200,64,0.09)' : 'rgba(224,122,95,0.09)') : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${chosen === i ? (opt.correct ? 'rgba(40,200,64,0.4)' : `rgba(${ACCENT_RGB},0.4)`) : 'rgba(255,255,255,0.09)'}`,
                      fontFamily: "'Lora', Georgia, serif", fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, fontStyle: 'italic',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {opt.text}
                  </div>
                  <AnimatePresence>
                    {chosen === i && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '8px 12px', margin: '3px 0 0', borderRadius: '5px', background: opt.correct ? 'rgba(40,200,64,0.06)' : 'rgba(224,122,95,0.06)', border: `1px solid ${opt.correct ? 'rgba(40,200,64,0.2)' : `rgba(${ACCENT_RGB},0.2)`}`, fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                          {opt.correct ? '✓ ' : '✗ '}{opt.feedback}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            {chosen !== null && !isLast && (
              <div onClick={handleNext} style={{ textAlign: 'center' as const, padding: '9px', background: `rgba(${ACCENT_RGB},0.1)`, borderRadius: '6px', border: `1px solid rgba(${ACCENT_RGB},0.3)`, cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px', color: ACCENT, fontWeight: 700 }}>
                Next scenario →
              </div>
            )}
            {chosen !== null && isLast && (
              <div onClick={() => { handleNext(); }} style={{ textAlign: 'center' as const, padding: '9px', background: `rgba(${ACCENT_RGB},0.1)`, borderRadius: '6px', border: `1px solid rgba(${ACCENT_RGB},0.3)`, cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px', color: ACCENT, fontWeight: 700 }}>
                Finish →
              </div>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ textAlign: 'center' as const, padding: '24px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '40px', fontWeight: 700, color: correctCount === challenges.length ? '#28C840' : ACCENT, marginBottom: '8px' }}>
                {correctCount}/{challenges.length}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                {correctCount === challenges.length
                  ? 'Strong PM feedback instinct — you framed every response around user needs, not your preferences.'
                  : 'Design critique is a skill. The goal: every piece of feedback connects to a user need or business outcome — never a preference.'}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// CRAFT DECISION MATRIX
// Categorize 4 EdSpark features: invest or ship fast
// ─────────────────────────────────────────
const CraftDecisionMatrix = () => {
  type Decision = 'craft' | 'fast' | null;
  const [decisions, setDecisions] = useState<Record<number, Decision>>({});

  const features = [
    {
      name: 'AI Score Badge',
      context: 'Shown on every session analysis result. Enterprise clients see it in their weekly review export. Used daily by all managers.',
      correctDecision: 'craft' as Decision,
      explanation: 'High visibility, used in external exports, directly represents EdSpark\'s brand intelligence. Craft investment here pays dividends in every client interaction. This is the face of your AI claim.',
    },
    {
      name: 'Admin User Permissions Grid',
      context: 'Used by IT admin to configure team access during onboarding setup. Used once per client, by one person.',
      correctDecision: 'fast' as Decision,
      explanation: 'Low frequency, one user type, back-office function. Functional is enough. The admin can tolerate a dense grid — they\'re technical. Invest craft where your everyday users are.',
    },
    {
      name: 'Coaching Session Upload Button',
      context: 'First interaction in the primary user flow. Every manager touches this weekly. The upload experience sets the tone for the entire session analysis.',
      correctDecision: 'craft' as Decision,
      explanation: 'First impressions and high-frequency interactions both justify craft investment. When the entry point to your core feature feels rough, it undermines trust in everything downstream.',
    },
    {
      name: 'Billing Invoice Download',
      context: 'Accessed by finance teams quarterly to export PDF invoices. One CSV or PDF link, no interaction beyond clicking.',
      correctDecision: 'fast' as Decision,
      explanation: 'Quarterly use, finance team user, zero-interaction function. This is exactly where \'functional and fast\' is the right call. Craft here has near-zero ROI.',
    },
  ];

  const all = features.every((_, i) => decisions[i] !== undefined && decisions[i] !== null);
  const correct = features.filter((f, i) => decisions[i] === f.correctDecision).length;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ background: '#0F172A', borderRadius: '12px', padding: '24px', border: '1px solid #1E293B', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', marginBottom: '8px', textAlign: 'center' as const }}>
          SPEED vs. CRAFT DECISION MATRIX
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginBottom: '20px', textAlign: 'center' as const }}>
          For each EdSpark feature: should you invest in craft or ship fast?
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          {features.map((feat, i) => {
            const dec = decisions[i];
            const isRevealed = dec !== null && dec !== undefined;
            const isCorrect = dec === feat.correctDecision;
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>{feat.name}</div>
                <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '12px', fontStyle: 'italic' }}>{feat.context}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['craft', 'fast'] as const).map(option => {
                    const selected = dec === option;
                    const isWrong = isRevealed && selected && !isCorrect;
                    const isRight = isRevealed && selected && isCorrect;
                    const isMissed = isRevealed && !selected && feat.correctDecision === option;
                    return (
                      <div
                        key={option}
                        onClick={() => {
                          if (dec !== null && dec !== undefined) return;
                          setDecisions(d => ({ ...d, [i]: option }));
                        }}
                        style={{
                          flex: 1, padding: '8px 12px', borderRadius: '6px', cursor: isRevealed ? 'default' : 'pointer', textAlign: 'center' as const,
                          background: isRight ? 'rgba(40,200,64,0.1)' : isWrong ? 'rgba(239,68,68,0.1)' : isMissed ? 'rgba(40,200,64,0.06)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isRight ? 'rgba(40,200,64,0.4)' : isWrong ? 'rgba(239,68,68,0.3)' : isMissed ? 'rgba(40,200,64,0.25)' : 'rgba(255,255,255,0.1)'}`,
                          fontFamily: 'monospace', fontSize: '10px', fontWeight: 700,
                          color: isRight ? '#28C840' : isWrong ? '#EF4444' : isMissed ? 'rgba(40,200,64,0.6)' : 'rgba(255,255,255,0.5)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {option === 'craft' ? '✦ Invest in craft' : '⚡ Ship fast'}
                      </div>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {isRevealed && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ marginTop: '8px', padding: '8px 12px', borderRadius: '5px', background: isCorrect ? 'rgba(40,200,64,0.06)' : 'rgba(224,122,95,0.06)', border: `1px solid ${isCorrect ? 'rgba(40,200,64,0.2)' : `rgba(${ACCENT_RGB},0.2)`}`, fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                        {isCorrect ? '✓ ' : `✗ Answer: ${feat.correctDecision === 'craft' ? 'Invest in craft · '  : 'Ship fast · '}`}{feat.explanation}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        {all && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '16px', textAlign: 'center' as const, padding: '12px', background: correct >= 3 ? 'rgba(40,200,64,0.07)' : 'rgba(255,255,255,0.04)', borderRadius: '8px', border: `1px solid ${correct >= 3 ? 'rgba(40,200,64,0.2)' : 'rgba(255,255,255,0.1)'}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '20px', fontWeight: 700, color: correct >= 3 ? '#28C840' : ACCENT, marginBottom: '4px' }}>{correct}/{features.length}</div>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>
              {correct >= 3 ? 'Strong threshold instinct — you\'re categorising by user impact, not by difficulty.' : 'The pattern: craft belongs where users are frequent, features are visible, and trust is on the line.'}
            </div>
          </motion.div>
        )}
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// PITCH BUILDER MOCKUP
// Priya sequences slides to pitch Rohan
// ─────────────────────────────────────────
const PitchBuilderMockup = () => {
  type SlideKey = 'revenue' | 'competitors' | 'velocity' | 'timeline';
  const [sequence, setSequence] = useState<SlideKey[]>([]);
  const [rohanReaction, setRohanReaction] = useState<string | null>(null);

  const slides: Record<SlideKey, { label: string; preview: React.ReactNode; pitchValue: number }> = {
    revenue: {
      label: 'Revenue at Risk',
      pitchValue: 10,
      preview: (
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: 700, color: '#EF4444' }}>$486k</div>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>annualised UX debt cost</div>
        </div>
      ),
    },
    competitors: {
      label: 'Competitor Comparison',
      pitchValue: 4,
      preview: (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '4px' }}>
          {[{ name: 'Gong', rating: 5 }, { name: 'Chorus', rating: 4.5 }, { name: 'EdSpark', rating: 2.5 }].map(c => (
            <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '10px', color: c.name === 'EdSpark' ? '#EF4444' : 'rgba(255,255,255,0.5)' }}>{c.name}</span>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(s => <div key={s} style={{ width: '8px', height: '8px', borderRadius: '1px', background: s <= c.rating ? '#28C840' : 'rgba(255,255,255,0.1)' }} />)}
              </div>
            </div>
          ))}
          <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>G2 UX consistency score</div>
        </div>
      ),
    },
    velocity: {
      label: 'Dev Velocity Savings',
      pitchValue: 8,
      preview: (
        <div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '6px' }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '18px', fontWeight: 700, color: '#EF4444' }}>4h</div>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>avg per feature now</div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.2)', alignSelf: 'center' }}>→</div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '18px', fontWeight: 700, color: '#28C840' }}>45m</div>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>with design system</div>
            </div>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>~3.25h saved × 40 features/yr</div>
        </div>
      ),
    },
    timeline: {
      label: 'Phased Rollout Plan',
      pitchValue: 6,
      preview: (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
          {[{ w: 'Week 1–2', task: 'Core components (buttons, forms, typography)' }, { w: 'Week 3–4', task: 'Integrate into 3 highest-traffic screens' }, { w: 'Week 5–6', task: 'Migrate remaining surfaces + documentation' }].map(p => (
            <div key={p.w} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: ACCENT, whiteSpace: 'nowrap' as const, marginTop: '1px' }}>{p.w}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{p.task}</div>
            </div>
          ))}
        </div>
      ),
    },
  };

  const allKeys: SlideKey[] = ['revenue', 'competitors', 'velocity', 'timeline'];
  const remaining = allKeys.filter(k => !sequence.includes(k));

  const evaluate = () => {
    const [first, second] = sequence;
    if (first === 'revenue' && second === 'velocity') {
      setRohanReaction("\"Okay. You've shown me the cost of not doing this and the return I'll get. I'm listening. Walk me through the plan.\" — Rohan opens the timeline slide himself.");
    } else if (first === 'competitors') {
      setRohanReaction("\"I know we're behind on design — that's not news. Show me why we should invest 6 weeks now.\" — You've led with threat instead of financial logic. Rohan is defensive, not open.");
    } else if (first === 'revenue') {
      setRohanReaction("\"$486k is real. But what do I get back?\" — Good start. The revenue frame opened the door. Now you need the ROI slide to keep it open.");
    } else {
      setRohanReaction("\"This is a lot of information. What's the ask?\" — You've overwhelmed instead of sequenced. Rohan doesn't know what to approve. Lead with the financial risk first.");
    }
  };

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1F2D42', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', marginBottom: '6px', textAlign: 'center' as const }}>
          PITCH BUILDER · ROHAN MEETING IN 4 MINUTES
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginBottom: '20px', textAlign: 'center' as const }}>
          Choose your first 2 slides. Sequence matters.
        </div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' as const }}>
          {/* Available slides */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', letterSpacing: '0.08em' }}>AVAILABLE SLIDES</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
              {remaining.map(key => (
                <div
                  key={key}
                  onClick={() => { if (sequence.length < 4 && !rohanReaction) setSequence(s => [...s, key]); }}
                  style={{ padding: '10px 12px', borderRadius: '7px', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', transition: 'all 0.15s' }}
                >
                  <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: '8px' }}>{slides[key].label}</div>
                  {slides[key].preview}
                </div>
              ))}
            </div>
          </div>

          {/* Sequence */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', letterSpacing: '0.08em' }}>YOUR SEQUENCE</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
              {sequence.map((key, i) => (
                <div key={key} style={{ padding: '10px 12px', borderRadius: '7px', background: `rgba(${ACCENT_RGB},0.07)`, border: `1px solid rgba(${ACCENT_RGB},0.25)`, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: ACCENT, flexShrink: 0 }}>0{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '10px', color: ACCENT, fontWeight: 700, marginBottom: '6px' }}>{slides[key].label}</div>
                    {slides[key].preview}
                  </div>
                  {!rohanReaction && (
                    <div onClick={() => setSequence(s => s.filter(k => k !== key))} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.25)', fontSize: '12px', flexShrink: 0 }}>×</div>
                  )}
                </div>
              ))}
              {sequence.length < 2 && (
                <div style={{ padding: '20px', borderRadius: '7px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' as const, fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>
                  {sequence.length === 0 ? 'Select slide 1' : 'Select slide 2'}
                </div>
              )}
            </div>
          </div>
        </div>

        {sequence.length >= 2 && !rohanReaction && (
          <div onClick={evaluate} style={{ textAlign: 'center' as const, padding: '9px', background: `rgba(${ACCENT_RGB},0.1)`, borderRadius: '6px', border: `1px solid rgba(${ACCENT_RGB},0.3)`, cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px', color: ACCENT, fontWeight: 700 }}>
            Start the pitch →
          </div>
        )}

        <AnimatePresence>
          {rohanReaction && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '14px', padding: '14px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MentorFace mentor="rohan" size={36} />
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>ROHAN · CEO</div>
                  <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, fontStyle: 'italic' }}>
                    {rohanReaction}
                  </div>
                </div>
              </div>
              <div onClick={() => { setSequence([]); setRohanReaction(null); }} style={{ marginTop: '10px', textAlign: 'center' as const, cursor: 'pointer', fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)', textDecoration: 'underline' }}>
                Try a different sequence
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────
export default function Track2UXDesign() {
  return (
    <article style={{ maxWidth: '740px', margin: '0 auto', padding: '0 24px 80px' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', padding: '72px 0 48px', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-20px', top: '-10px',
          fontSize: 'clamp(140px, 18vw, 220px)', fontWeight: 700, lineHeight: 1,
          color: `rgba(${ACCENT_RGB},0.06)`,
          fontFamily: "'Lora', Georgia, serif",
          letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none',
        }}>04</div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '14px', textTransform: 'uppercase' as const }}>
            PM Fundamentals · Module 04 · APM Track
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '16px', fontFamily: "'Lora', Georgia, serif" }}>
            UX Leadership &amp;<br />Design Investment
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '40px' }}>
            &ldquo;Speed is cheap until it costs a deal.&rdquo;
          </p>

          {/* Character row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '40px' }}>
            {([
              { mentor: 'priya' as const, accent: ACCENT,    desc: 'Two years in. She knows what to build. Now she has to decide what\'s worth the investment.' },
              { mentor: 'maya'  as const, accent: '#C85A40', desc: 'Design systems advocate. She\'s right — but the timing is never as simple as she says.' },
              { mentor: 'kiran' as const, accent: '#3A86FF', desc: 'Puts a dollar figure on every design complaint. That number gets Rohan\'s attention.' },
              { mentor: 'dev'   as const, accent: '#6E7681', desc: 'Builds to spec. The design debt costs him hours he doesn\'t have.' },
              { mentor: 'rohan' as const, accent: '#4F46E5', desc: 'Wants features. Changes his mind when you show him what inconsistency costs.' },
              { mentor: 'asha'  as const, accent: '#0097A7', desc: 'Asks the question that reframes the whole trade-off.' },
            ]).map(c => (
              <div key={c.mentor} style={{ background: `${c.accent}0D`, border: `1px solid ${c.accent}33`, borderRadius: '10px', padding: '14px 16px', minWidth: '150px', flex: '1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <MentorFace mentor={c.mentor} size={44} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: c.accent, lineHeight: 1.2 }}>
                      {{ priya: 'Priya', maya: 'Maya', kiran: 'Kiran', dev: 'Dev', rohan: 'Rohan', asha: 'Asha' }[c.mentor]}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.04em' }}>
                      {{ priya: 'APM · 2 yrs', maya: 'Senior Designer', kiran: 'Data Analyst', dev: 'Eng Lead', rohan: 'CEO · EdSpark', asha: 'AI Mentor' }[c.mentor]}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{c.desc}</div>
              </div>
            ))}
          </div>

          {/* Learning objectives */}
          <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', borderLeft: `4px solid ${ACCENT}`, border: `1px solid var(--ed-rule)`, borderLeftWidth: '4px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>
              APM Track · Learning Objectives
            </div>
            {[
              'Recognise UX debt as a quantifiable revenue risk — not just a design complaint',
              'Decide when a design system is the right investment vs. premature abstraction',
              'Facilitate design critiques as a PM: strategic context, not aesthetic judgement',
              'Apply the speed-vs-craft threshold: where to invest and where \'good enough\' is correct',
              'Build a business case for design investment in the language of revenue, not craft',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 4 ? '10px' : 0, alignItems: 'flex-start' }}>
                <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '12px', marginTop: '2px' }}>0{i + 1}</span>
                <span style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 01 — The Demo That Went Quiet ── */}
      <ChapterSection id="m4-apm-demo" num="01" accentRgb={ACCENT_RGB} first>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Infosys. The procurement lead has been nodding for forty minutes. Then she pauses the screen share.
          &ldquo;Your coaching analysis tool has a different button style than the skill gap tracker. And your
          team dashboard uses a different typeface. Do you have a design system?&rdquo; Priya looks at Rohan.
          Rohan looks at Priya. Neither of them has an answer.
        </SituationCard>

        {h2(<>Inconsistent UX is a trust signal &mdash; and enterprise clients read it</>)}

        {para(<>
          Priya had spent three weeks preparing for this demo. Feature parity, roadmap timeline, integration
          capabilities, security certifications. She&apos;d anticipated every question except this one. Design
          consistency had never made it onto her readiness checklist because it had never been framed as a risk.
          It was a design concern. And design concerns lived in Maya&apos;s folder, not hers.
        </>)}

        {para(<>
          What the Infosys lead was actually asking wasn&apos;t about aesthetics. She was asking: does this
          product have a team behind it that sweats the details? Are these people going to give us a mature
          platform or a collection of features bolted together? Visual inconsistency is a proxy signal for
          engineering maturity, design discipline, and product ownership. It&apos;s not about buttons. It&apos;s
          about whether you&apos;ll be embarrassing to deploy at scale.
        </>)}

        <EnterpriseAuditMockup />

        <ConversationScene
          mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="#4F46E5"
          lines={[
            { speaker: 'priya', text: "She asked about our design system during the demo. I said we have component guidelines. I don\u2019t think it landed well." },
            { speaker: 'other', text: "That question wasn\u2019t about design. It was about trust. Enterprise procurement teams are looking for reasons to say no. Inconsistency is an easy one." },
            { speaker: 'priya', text: "So what do I do about it?" },
            { speaker: 'other', text: "Audit the demo-critical screens first. Fix the immediate risk. Then figure out the root cause before you prescribe a solution." },
          ]}
        />
        <Avatar
          name="Rohan"
          nameColor="#4F46E5"
          borderColor="#4F46E5"
          content={<>Enterprise clients see inconsistency as a signal of undisciplined engineering culture \u2014 harder integrations, more support tickets, slower iterations. The Infosys lead wasn\u2019t being difficult. She was doing her job.</>}
          expandedContent="A visually inconsistent product signals that the team ships fast but not carefully — which maps directly to how enterprise buyers assess integration risk and long-term support burden."
          conceptId="ux-apm-enterprise-trust"
          question="After the demo, Rohan asks you to 'fix the design inconsistency issue.' What do you do first?"
          options={[
            { text: "Ask Maya to audit all screens this sprint and harmonise them visually.", correct: false, feedback: "This treats a systemic problem as a cosmetic task. Harmonising screens one by one doesn't prevent the next inconsistency — it just catches up with the last batch." },
            { text: "Audit the specific UI elements enterprise clients see in demos first, then understand the root cause of inconsistency before prescribing a fix.", correct: true, feedback: "Right scope, right order. Fix the immediate risk (demo-critical screens), then diagnose the root cause (no shared design language) before deciding whether the solution is a design system, a component library, or a style guide." },
            { text: "Immediately kick off a 6-week design system project to prevent it from happening again.", correct: false, feedback: "You haven't diagnosed the scale of the problem or the size of the right solution. A 6-week project is a hypothesis, not an answer. You're prescribing before examining." },
            { text: "Tell Rohan this is a design team responsibility and loop in Maya to handle it.", correct: false, feedback: "UX consistency is a product outcome. Delegating the diagnosis to Maya without PM context means she'll solve the design problem without the business context of what's actually at stake." },
          ]}
        />

        <QuizEngine
          conceptId="ux-apm-enterprise-trust"
          conceptName="UX and Enterprise Trust"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'ux-apm-enterprise-trust',
            question: 'An enterprise prospect asks about your design system during a demo. You don\'t have one. What\'s the honest response?',
            options: [
              'A) We have component guidelines — our design system is evolving',
              'B) We\'re standardising our UI layer over the next two quarters',
              'C) We don\'t have a formal design system yet, but here\'s what we do have and what\'s planned',
              'D) Our design is consistent where it matters most — the core workflows',
            ],
            correctIndex: 2,
            explanation: 'Enterprise procurement teams can smell non-answers. Option C is honest without being alarming — it names reality, signals self-awareness, and shows a forward-looking posture. Evasion costs more trust than honesty.',
            keyInsight: 'Answering with honesty and a plan beats a spin that doesn\'t survive follow-up questions.',
          }}
        />
      </ChapterSection>

      {/* ── SECTION 02 — The Audit Kiran Runs ── */}
      <ChapterSection id="m4-apm-audit" num="02" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Kiran didn&apos;t wait to be asked. The day after the Infosys demo he pulled three months of feature
          engagement data for the coaching session analysis tool. &ldquo;Fifteen percent drop-off in the analysis
          flow. Not onboarding. Not setup. Mid-flow. And it spikes on screens where we have non-standard UI
          elements.&rdquo; He rotates his laptop. &ldquo;I put a dollar figure on it.&rdquo;
        </SituationCard>

        {h2(<>UX debt isn&apos;t a design complaint. It&apos;s a cost line.</>)}

        {para(<>
          What made Kiran&apos;s analysis different from a design audit wasn&apos;t the screenshots. It was the
          correlation. He hadn&apos;t just catalogued inconsistencies &mdash; he&apos;d mapped them against drop-off events
          and found that non-standard UI elements (inconsistent button placements, varying form field widths,
          custom-styled modals that didn&apos;t match the rest of the system) corresponded with a measurable
          increase in user hesitation and abandonment. The messy UI wasn&apos;t just embarrassing. It was costing
          engagement points that translated directly to feature adoption, and feature adoption is what justifies
          renewal conversations.
        </>)}

        {para(<>
          Priya ran the numbers herself. Fifteen percent of users dropping off mid-flow in the coaching analysis
          tool, multiplied by the average contract value for the accounts in that cohort, multiplied by twelve
          months. The number was uncomfortable. It was also the first thing that made the conversation with Rohan
          stop being abstract. Design problems are easy to defer. Revenue problems are not.
        </>)}

        <UXDebtCalculator />

        <ConversationScene
          mentor="kiran" name="Kiran" role="Data · EdSpark" accent="#3A86FF"
          lines={[
            { speaker: 'other', text: "15% drop-off in the analysis flow. Spikes on screens with non-standard UI elements. I put a dollar figure on it." },
            { speaker: 'priya', text: "How do we know it\u2019s the UI inconsistency and not something else?" },
            { speaker: 'other', text: "The data doesn\u2019t distinguish between \u2018ugly\u2019 and \u2018confusing.\u2019 But the users do. A non-standard element breaks their muscle memory. And broken muscle memory costs you a completion." },
          ]}
        />
        <Avatar
          name="Kiran"
          nameColor="#3A86FF"
          borderColor="#3A86FF"
          content={<>Every platform builds user expectation over time. When one screen uses a different pattern, users switch from automatic to deliberate \u2014 and in that moment of deliberateness, they notice everything slightly wrong. Inconsistency creates cognitive friction that interrupts the flow state essential for adoption.</>}
          expandedContent="Inconsistency doesn't just look unprofessional. It creates cognitive friction that interrupts the flow state that's essential for adoption. The drop-off wasn't about the feature — it was about the transition into it."
          conceptId="ux-apm-debt-cost"
          question="You want to bring this data to Rohan but he usually dismisses design concerns. How do you frame it?"
          options={[
            { text: '"Maya and I did a design audit and found 12 inconsistency issues across the platform."', correct: false, feedback: "This sounds like a design department update. Rohan hears '12 issues that need designer time' — not a business problem. You've lost him in the first sentence." },
            { text: '"Kiran found a 15% drop-off in coaching analysis that correlates with inconsistent UI patterns. Annualised, that\'s approximately $486k in at-risk ARR from the current cohort."', correct: true, feedback: "You've translated a UX observation into a financial risk. Rohan now has a specific number attached to a specific problem. The conversation that follows is about business risk, not design aesthetics." },
            { text: '"Our G2 scores for UI consistency are below Gong and Chorus. We\'re losing on experience."', correct: false, feedback: "Competitive context helps, but leading with it frames this as a perception problem rather than a revenue problem. Rohan is more motivated by cost than by being behind competitors on a category he doesn't closely track." },
            { text: '"Enterprise clients are asking about our design system. We need to take design seriously."', correct: false, feedback: "This is a restatement of the demo failure, not an analysis. 'Take design seriously' is not a proposal — it's a sentiment. You need to show Rohan what 'seriously' costs and what it returns." },
          ]}
        />

        <QuizEngine
          conceptId="ux-apm-debt-language"
          conceptName="UX Debt as Business Language"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'ux-apm-debt-language',
            question: 'Which metric best makes the business case for addressing UX debt to a skeptical CEO?',
            options: [
              'A) Number of design inconsistencies found in the audit',
              'B) Designer time spent on one-off component creation per sprint',
              'C) Revenue at risk from UX-correlated feature abandonment',
              'D) G2 rating difference between EdSpark and Gong',
            ],
            correctIndex: 2,
            explanation: 'Revenue at risk converts a design complaint into a financial risk. Number of inconsistencies is a design metric. Designer time is an operational metric. G2 comparisons are a competitive metric. Only option C speaks the language of a CEO\'s decision-making.',
            keyInsight: 'The same problem described in design language gets deferred. In revenue language, it gets a budget.',
          }}
        />
      </ChapterSection>

      {/* ── SECTION 03 — The Design System Argument ── */}
      <ChapterSection id="m4-apm-ds-decision" num="03" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Maya puts the proposal on the table at the Monday planning meeting. Six weeks. Two engineers. The
          output: a shared component library that covers buttons, forms, typography, modals, and loading states.
          Everything that currently exists in five incompatible variations would converge into one. Rohan listens
          to the whole thing and says: &ldquo;We just landed Salesforce and Infosys. They want features. Can we do
          this later?&rdquo; Later is never later. Priya has three minutes to decide.
        </SituationCard>

        {h2(<>A design system is not a design project. It&apos;s a velocity investment.</>)}

        {para(<>
          Priya&apos;s first instinct was to agree with Rohan. They were in a growth window. Enterprise clients
          wanted to see capabilities, not infrastructure. A six-week pause on feature delivery felt like exactly
          the wrong move at exactly the wrong time. She had said &ldquo;let&apos;s revisit&rdquo; three times in the past
          six months on design system conversations. Each time, the codebase got a little harder to change. Each
          new feature added one more inconsistent component. The cost of convergence was compounding.
        </>)}

        {para(<>
          What shifted Priya&apos;s thinking was reframing the question. Rohan was asking: &ldquo;can we build the design
          system instead of features?&rdquo; But that wasn&apos;t the actual choice. The actual choice was: continue
          paying 4 hours of engineering time per feature to wrangle inconsistent UI components, or spend 6 weeks
          building a foundation that reduces that to 45 minutes per feature forever after. The design system was
          not competing with features. It was reducing the cost of every future feature. Maya wasn&apos;t asking for
          six weeks of design time. She was asking Priya to see it as an investment with a compounding return.
        </>)}

        <ComponentSprawlMockup />

        <ConversationScene
          mentor="maya" name="Maya" role="Designer · EdSpark" accent="#C85A40"
          lines={[
            { speaker: 'priya', text: "Rohan thinks we should ship features for the enterprise clients first. How do I push back?" },
            { speaker: 'other', text: "I\u2019m not asking for six weeks to make things pretty. I\u2019m asking for six weeks so that every feature after this takes half the time." },
            { speaker: 'priya', text: "How do I say that in a way Rohan will hear?" },
            { speaker: 'other', text: "Show him the engineering math. 4 hours per feature now. 45 minutes with a shared library. You\u2019re not pausing \u2014 you\u2019re buying speed." },
          ]}
        />
        <Avatar
          name="Maya"
          nameColor="#C85A40"
          borderColor="#C85A40"
          content={<>A design system is a force multiplier. The first feature built with it might take just as long \u2014 but every subsequent one gets faster, more consistent, and cheaper to change. The real cost of not having one isn\u2019t the design quality today. It\u2019s the velocity penalty paid on every feature for the rest of the product\u2019s life.</>}
          expandedContent="'Not having a design system' is a compounding cost, not a fixed one. Every sprint without it adds one more inconsistent component to untangle later. The right time to invest is when the per-feature cost of inconsistency exceeds the amortised cost of convergence."
          conceptId="ux-apm-design-system-framing"
          question="Rohan says: 'We can't afford 6 weeks on infrastructure when we have enterprise clients wanting features.' How do you respond?"
          options={[
            { text: '"You\'re right — let\'s table it and revisit next quarter when things slow down."', correct: false, feedback: "Things don't slow down. You've been saying 'next quarter' for six months. Deferring again compounds the cost and signals to Maya that you won't advocate for work that doesn't have a delivery date." },
            { text: '"We\'re currently spending 4 hours per feature on inconsistent UI components. A 6-week design system investment reduces that to 45 minutes permanently. Over 40 features a year, that\'s 130 hours of engineering time recovered — worth roughly $52k in capacity."', correct: true, feedback: "You've translated Maya's proposal into engineering ROI. Rohan can now make a financial decision, not a design decision. This framing also shows you've done the work to understand the investment, not just forwarded Maya's ask." },
            { text: '"Maya has been asking for this for 6 months. We need to do it for the team\'s morale."', correct: false, feedback: "Designer morale is real, but it's not a business justification for a CEO making resource allocation decisions. You've changed the frame to a personnel concern instead of a product investment." },
            { text: '"The enterprise clients flagged our design inconsistency. A design system directly addresses their concern."', correct: false, feedback: "This is true but incomplete. You've framed the design system as a reaction to one client complaint rather than as a forward-looking investment. Rohan will hear 'we\'re building this because we were embarrassed' rather than 'this makes us faster forever.'" },
          ]}
        />

        <QuizEngine
          conceptId="ux-apm-system-vs-features"
          conceptName="Design System Investment"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'ux-apm-system-vs-features',
            question: 'When does building a design system make business sense?',
            options: [
              'A) When the team has time between feature sprints',
              'B) When the design inconsistency starts appearing in G2 reviews',
              'C) When the per-feature cost of inconsistency exceeds the amortised cost of a shared foundation',
              'D) When you hire your first dedicated designer',
            ],
            correctIndex: 2,
            explanation: 'A design system is an investment with a break-even point. When maintaining inconsistency costs more than building consistency, the investment is justified. That\'s a calculation, not a milestone or a headcount threshold.',
            keyInsight: 'The right time to build a design system is when inconsistency costs more per feature than convergence would.',
          }}
        />
      </ChapterSection>

      {/* ── SECTION 04 — The Critique Priya Got Wrong ── */}
      <ChapterSection id="m4-apm-critique" num="04" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The first design critique Priya ran as PM was a disaster. Not visibly — nobody walked out. But after
          Maya presented the new coaching session analysis result screen, Priya led with: &ldquo;I think the score
          badge should be bigger. And the colours feel a bit muted for enterprise.&rdquo; Maya wrote it down. Said
          nothing. Two days later the design came back with a bigger badge and brighter colours. The conversion
          problem &mdash; managers scanning for their score and missing it &mdash; was still there.
        </SituationCard>

        {h2(<>A PM in a design critique is not a judge. They&apos;re a translator.</>)}

        {para(<>
          Priya had run the critique like she was reviewing a pitch deck. She&apos;d given opinions instead of
          context. &ldquo;Bigger badge&rdquo; was a solution &mdash; but she&apos;d never named the problem it was supposed
          to solve. Maya had no reason to disagree and every reason to comply. The design changed. The user
          problem didn&apos;t. The feedback loop had produced a change without producing an improvement.
        </>)}

        {para(<>
          When Maya walked her through what a PM&apos;s role actually is in a critique, it reframed everything.
          The PM brings three things: user research context (&ldquo;here&apos;s what we know about how managers actually
          use this screen&rdquo;), business constraint context (&ldquo;here&apos;s what success looks like for this feature&rdquo;),
          and hypothesis testing (&ldquo;does this design help the user achieve the task?&rdquo;). None of those are
          aesthetic opinions. All of them are things only the PM can bring to the room.
        </>)}

        <CritiqueSimulator />

        <ConversationScene
          mentor="asha" name="Asha" role="Senior PM · EdSpark" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "I said the badge should be bigger and the colours felt muted. Maya made the changes. The problem is still there." },
            { speaker: 'other', text: "The test for PM critique feedback: can you trace it back to a user need or a business outcome?" },
            { speaker: 'priya', text: "I couldn\u2019t. I just thought it would look better for enterprise." },
            { speaker: 'other', text: "That\u2019s a preference. Preferences in a critique cost the team a design decision without giving them any insight." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="#0097A7"
          borderColor="#0097A7"
          content={<>PM feedback is only valuable in a critique when it carries context the designer doesn\u2019t have \u2014 user research, business constraints, hypothesis testing. When a PM gives goal-based feedback, the designer can make the right trade-off themselves. Preference-based feedback forecloses those trade-offs without understanding them.</>}
          expandedContent="The second approach produces better design and a better working relationship. Maya can push back on goal-based feedback with design reasoning. She can only comply with preference-based feedback."
          conceptId="ux-apm-critique-role"
          question="Maya presents a design with a prominent empty state illustration. You think it's too decorative. What's the right response?"
          options={[
            { text: '"I like the illustration but it\'s too large — it\'s taking up too much space."', correct: false, feedback: "Size and decorativeness are aesthetic opinions. You haven't told Maya anything she can act on without guessing what your underlying concern is. This will produce a smaller illustration with the same undiagnosed problem." },
            { text: '"Our user research shows managers scan dashboards quickly. Does this illustration slow them down on the path to the primary action?"', correct: true, feedback: "You've connected the design element to a specific user behaviour and asked whether the design supports or interrupts it. Maya now has something to test — and to push back on if she thinks the scanning data doesn't apply here." },
            { text: '"I think we should A/B test this against a simpler version."', correct: false, feedback: "A/B testing is a valid method, but proposing it here skips the critique entirely. You haven't given Maya any context about what you'd be testing for. This is deferral dressed as rigour." },
            { text: '"The illustration is nice but we need to prioritise function over form here."', correct: false, feedback: "Function-over-form is a principle, not feedback. Maya already knows this principle — she's a senior designer. You need to tell her specifically what function the current form is blocking, or she has nothing to act on." },
          ]}
        />

        <QuizEngine
          conceptId="ux-apm-critique-feedback"
          conceptName="Design Critique Facilitation"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'ux-apm-critique-feedback',
            question: 'Which feedback should a PM give in a design critique?',
            options: [
              'A) "This button is the wrong shade of blue."',
              'B) "The navigation hierarchy doesn\'t match how our enterprise admins structure their workflow."',
              'C) "The design needs more whitespace — it feels crowded."',
              'D) "I\'d have put the CTA in the top right."',
            ],
            correctIndex: 1,
            explanation: 'Option B connects a specific design element (navigation hierarchy) to a specific user behaviour (how enterprise admins structure their workflow). That\'s PM-context feedback. The others are aesthetic opinions — valid for designers to consider, but not what the PM uniquely adds to the room.',
            keyInsight: 'PM feedback is only valuable in a critique when it carries context the designer doesn\'t have.',
          }}
        />
      </ChapterSection>

      {/* ── SECTION 05 — The Speed-Craft Threshold ── */}
      <ChapterSection id="m4-apm-threshold" num="05" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Dev has two hours before the sprint closes. Maya&apos;s proposed completion animation for the skill gap
          tracker &mdash; a subtle burst of particles when a manager finishes their assessment &mdash; will take
          two additional days to implement correctly. The alternative is a static &ldquo;Complete ✓&rdquo; text label. Dev
          asks Priya: &ldquo;Do we need the animation?&rdquo;
        </SituationCard>

        {h2(<>The right amount of craft is determined by who&apos;s watching and how often.</>)}

        {para(<>
          Priya had learned the hard way that both extremes were wrong. Shipping everything rough meant the Infosys
          demo conversation. But chasing craft everywhere meant missing deadlines for things that didn&apos;t move
          metrics. The animation was beautiful. But was it beautiful in a place that mattered? That was the actual
          question. Not &ldquo;is it good?&rdquo; but &ldquo;is it good here, for this user, at this frequency?&rdquo;
        </>)}

        {para(<>
          The skill gap tracker completion state was used once per assessment cycle by each manager &mdash; roughly
          twice a month. It wasn&apos;t a daily touchpoint. It wasn&apos;t something enterprise clients would screenshot
          in a review. It wasn&apos;t the coaching analysis result, which went into a weekly export that 200 managers
          saw. The particle burst was lovely. The static &ldquo;Complete ✓&rdquo; was enough. Craft investment follows user
          attention, not designer ambition. And right now, user attention was on the export screen that still didn&apos;t
          have a design system component.
        </>)}

        <CraftDecisionMatrix />

        {keyBox('The Craft Investment Framework', [
          'High frequency + high visibility → invest in craft (this is the face of your product)',
          'Low frequency + back-office → ship functional, iterate if data demands it',
          'Enterprise demo flow → always invest (first impressions are disproportionately weighted)',
          'Admin / configuration screens → good enough is correct; power users tolerate density',
          'Core value delivery moments → craft here is the product, not decoration',
        ])}

        <ConversationScene
          mentor="dev" name="Dev" role="Engineer · EdSpark" accent="#6E7681"
          lines={[
            { speaker: 'other', text: "I can build the animation. But I need to know if it\u2019s worth two days. That\u2019s your call, not mine." },
            { speaker: 'priya', text: "Maya advocated for it. She thinks it\u2019ll improve the sense of completion." },
            { speaker: 'other', text: "The completion state is used twice a month per manager. Is that where we want two days of engineering time right now?" },
            { speaker: 'priya', text: "No. Ship the static label. The animation goes in the next polish sprint if frequency or visibility warrants it." },
          ]}
        />
        <Avatar
          name="Dev"
          nameColor="#6E7681"
          borderColor="#6E7681"
          content={<>Engineers often have opinions about what\u2019s worth building carefully \u2014 but they need the PM to provide context of where users spend attention and what the business prioritises. \u2018Worth it\u2019 is not a design judgement. It\u2019s a product judgement that needs user frequency data, business context, and delivery constraint awareness.</>}
          expandedContent="Speed-vs-craft decisions involve engineering time, user impact, and business priority — all things the PM owns. Deferring to a designer means a designer is making a resourcing decision without business context."
          conceptId="ux-apm-craft-threshold"
          question="Maya advocates for the animation. Dev says it's 2 days. Salesforce integration ships next week. What do you decide?"
          options={[
            { text: "Ship the animation — we need to show enterprise clients we care about craft.", correct: false, feedback: "Enterprise clients care about craft in the places they interact with daily, not in a completion state they see twice a month. You're spending 2 days of engineering time for a signal that won't be noticed by the audience you're trying to impress." },
            { text: "Skip the animation for now — completion state isn't a high-frequency, high-visibility moment. Add it to the next polish sprint.", correct: true, feedback: "Right call for the right reasons: frequency and visibility define where craft investment pays off. You've named the criteria, not just made a gut call. Maya can accept a deferral when the PM articulates the principle — not just the deadline." },
            { text: "Ask Maya to simplify the animation to something Dev can build in 4 hours.", correct: false, feedback: "You're optimising a feature that shouldn't be optimised right now. A simpler animation isn't the right answer when the underlying question is whether any animation is the right use of these 2 days. Scope the decision first, then negotiate." },
            { text: "Defer to Maya — design quality decisions should be made by the designer.", correct: false, feedback: "Speed-vs-craft decisions involve engineering time, user impact, and business priority — all things the PM owns. Deferring to Maya means a designer is making a resourcing decision without business context." },
          ]}
        />

        <QuizEngine
          conceptId="ux-apm-craft-decision"
          conceptName="Speed vs Craft"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'ux-apm-craft-decision',
            question: 'Which factor should most influence a PM\'s decision to invest engineering time in design craft?',
            options: [
              'A) The designer\'s confidence that it will improve user delight',
              'B) User frequency and visibility of the feature in the actual product experience',
              'C) Whether competitors have implemented a similar design pattern',
              'D) The engineering complexity relative to the current sprint capacity',
            ],
            correctIndex: 1,
            explanation: 'Craft earns ROI where user attention concentrates. A feature seen daily by every user justifies craft investment. A quarterly admin screen doesn\'t. Frequency and visibility are the primary filter — capacity and competitive context are secondary inputs.',
            keyInsight: 'Craft investment follows user attention. Where users look the most, you invest the most.',
          }}
        />
      </ChapterSection>

      {/* ── SECTION 06 — The Pitch That Changed the Budget ── */}
      <ChapterSection id="m4-apm-pitch" num="06" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya has 20 minutes on Rohan&apos;s calendar. She asked for it two weeks ago, before the Infosys demo
          answer was ready. Now she has the numbers, the analysis, and Maya&apos;s proposal. She also knows Rohan.
          He will tune out in slide three if slide one doesn&apos;t tell him why this is his problem.
        </SituationCard>

        {h2(<>The pitch that works leads with cost, not craft</>)}

        {para(<>
          Priya had run the same design-system conversation three times in the past year. Each time, she&apos;d
          started with the design rationale &mdash; consistency, component reuse, designer velocity. Each time,
          Rohan had nodded, said &ldquo;makes sense, let&apos;s find the right time,&rdquo; and moved on. The right time
          never came because she&apos;d never made it urgent. The problem with framing design investment as a design
          improvement is that it competes with other improvements. The problem with framing it as a revenue risk
          is that it competes with nothing. Revenue risk is always urgent.
        </>)}

        {para(<>
          Slide one was Kiran&apos;s number: $486k in annualised revenue at risk from UX-correlated feature
          abandonment. Slide two was the engineering velocity math: 4 hours per feature now, 45 minutes
          with a shared component library, 130 hours recovered per year at current output pace. Slide three
          was the phased plan: no feature delivery pause, design system components shipped alongside existing
          sprints, highest-impact screens prioritised first. By the time Priya reached the Infosys anecdote,
          Rohan had already mentally approved the budget. The story wasn&apos;t what convinced him. The numbers
          were. The story just made it real.
        </>)}

        <PitchBuilderMockup />

        {pullQuote("Rohan approved the design system on slide two. He just needed slide three to not talk him out of it.")}

        <ConversationScene
          mentor="asha" name="Asha" role="Senior PM · EdSpark" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "I\u2019ve had this design system conversation with Rohan three times. He always says \u2018makes sense, let\u2019s find the right time.\u2019 The right time never comes." },
            { speaker: 'other', text: "The problem with framing design investment as a design improvement is that it competes with other improvements." },
            { speaker: 'priya', text: "So I lead with the revenue risk." },
            { speaker: 'other', text: "Revenue risk is always urgent. The strongest pitch doesn\u2019t argue for design. It argues for velocity, revenue, and client retention \u2014 and shows that a design system is the mechanism." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="#0097A7"
          borderColor="#0097A7"
          content={<>There\u2019s a critical sequence: show the cost of the status quo first (makes the problem urgent), then the ROI of the investment (makes approval feel safe), then the implementation plan (removes the fear of disruption). Leading with the plan before establishing urgency produces nodding but no action.</>}
          expandedContent="Rohan approved the design system on slide two. The story on slide three made it real — but the numbers were what convinced him. That sequence matters in every investment pitch to a skeptical CEO."
          conceptId="ux-apm-pitch-structure"
          question="Rohan approves the design system. How do you make sure the investment delivers what you promised?"
          options={[
            { text: "Set weekly design system review meetings with Maya to track component completion.", correct: false, feedback: "Tracking components is a design team metric. Rohan approved a business investment — you promised him revenue impact, velocity savings, and client confidence. Track those, not the component count." },
            { text: "Define KPIs tied to the business outcomes you pitched: feature-build time per component, UX-correlated drop-off rate, enterprise client design satisfaction in QBRs.", correct: true, feedback: "You close the loop with the same language you used to open it. If you pitched revenue risk and velocity savings, you measure revenue recovery and velocity improvement. Anything less is losing the thread." },
            { text: "Give Maya and Dev autonomy to execute — trust the process once approved.", correct: false, feedback: "Approval is the start of PM accountability, not the end. You made business commitments on behalf of the team. Tracking those commitments is your job — not a sign of distrust." },
            { text: "Present the completed design system to Rohan in 6 weeks and assess impact at that point.", correct: false, feedback: "Impact assessment happens after deployment, not after build. A completed design system that hasn't changed user behaviour or velocity is just an internal project. You need to measure adoption and outcomes, not delivery." },
          ]}
        />

        <QuizEngine
          conceptId="ux-apm-investment-accountability"
          conceptName="Design Investment Accountability"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'ux-apm-investment-accountability',
            question: 'Six weeks after the design system launches, what should you be reporting to Rohan?',
            options: [
              'A) Number of components built and documented',
              'B) Designer satisfaction with the new system',
              'C) Change in per-feature build time and UX-correlated drop-off rate',
              'D) Number of screens migrated to the new design system',
            ],
            correctIndex: 2,
            explanation: 'You sold Rohan on velocity and revenue impact. Report back in velocity and revenue impact. Components built and screens migrated are delivery metrics — they tell you if the project was executed, not if the investment paid off. Drop-off rates and build time tell you if it worked.',
            keyInsight: 'Report the outcomes you pitched, not the deliverables you shipped.',
          }}
        />
      </ChapterSection>

      {/* ── SECTION 07 — Final Reflection ── */}
      <ChapterSection id="m4-apm-reflection" num="07" accentRgb={ACCENT_RGB}>

        {h2(<>Design leadership isn&apos;t about having taste. It&apos;s about knowing where taste matters.</>)}

        {para(<>
          Three months after the Infosys demo, EdSpark&apos;s design system has 24 core components. The average
          feature build time is down from 4 hours per screen to 55 minutes. The coaching session analysis
          drop-off rate is at 6% &mdash; down from 15%. None of that happened because Priya developed better
          design opinions. It happened because she learned to ask the right questions: where do users spend
          attention, what does inconsistency cost, and which design investments pay for themselves?
        </>)}

        {pullQuote("The PM who advocates for design in the language of business gets more design done than the PM who argues for craft.")}

        {keyBox('APM Design Leadership Principles', [
          'UX debt is a cost line — quantify it or it stays invisible',
          'Design systems are velocity investments — pitch them as ROI, not infrastructure',
          'PM critique adds user and business context — never aesthetic preference',
          'Craft investment follows user attention frequency and feature visibility',
          'Report design outcomes in business metrics: time, conversion, retention — not components',
        ])}

        <ApplyItBox prompt="Think of a UX inconsistency you've seen in a product you use or work on. Estimate: how many users encounter it weekly? What does that friction cost in time or conversion? Could you make a business case to fix it?" />

        <NextChapterTeaser text="Next: Communication for PMs — Priya has a working product and a working team. Now she has to get the board to see what she sees." />
      </ChapterSection>

    </article>
  );
}

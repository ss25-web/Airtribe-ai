'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  glassCard, demoLabel, h2, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, para,
} from './designSystem';

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────
const ACCENT = '#C85A40';
const ACCENT_RGB = '200,90,64';
const MODULE_CONTEXT = `Module 03 of Airtribe PM Fundamentals — Track: New to PM.
Follows Priya Sharma, APM at EdSpark (B2B SaaS for sales coaching). Covers: problem framing, converting feature requests into problem statements, using data for prioritization, the RICE framework, stakeholder communication, and making hard prioritization calls with clarity.`;

// ─────────────────────────────────────────
// TILT CARD — 3D mouse-tracking wrapper
// ─────────────────────────────────────────
const TiltCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -6, y: x * 6, scale: 1.012 });
  };
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, scale: 1 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`, transition: 'transform 0.18s ease', willChange: 'transform', ...style }}
    >
      {children}
    </div>
  );
};

// ─────────────────────────────────────────
// LOCAL: BACKLOG INPUTS MOCKUP (Jira-style)
// ─────────────────────────────────────────
const BacklogInputsMockup = () => {
  const items = [
    { key: 'EDU-412', title: 'CRM Integration', requester: 'Marcus · Sales', priority: 'HIGH', status: 'To Do', statusColor: '#0052CC', priorityColor: '#FF5630', age: '3d' },
    { key: 'EDU-398', title: 'Referral Feature', requester: 'Divya · Marketing', priority: 'MEDIUM', status: 'Backlog', statusColor: '#6554C0', priorityColor: '#FF8B00', age: '1w' },
    { key: 'EDU-371', title: 'Improve Search', requester: '12 users · Helpdesk', priority: 'MEDIUM', status: 'Backlog', statusColor: '#6554C0', priorityColor: '#FF8B00', age: '2w' },
    { key: 'EDU-305', title: 'Fix Onboarding', requester: 'Churn data · Kiran', priority: 'HIGH', status: 'To Do', statusColor: '#0052CC', priorityColor: '#FF5630', age: '4w' },
  ];

  return (
    <TiltCard style={{ margin: '32px 0' }}><div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #DFE1E6', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
      {/* Jira-style header bar */}
      <div style={{ background: '#172B4D', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
            <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.06em' }}>
          EdSpark &middot; Sprint Planning Board
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>4 open &middot; 0 prioritized</div>
      </div>
      {/* Column headers */}
      <div style={{ background: '#F4F5F7', borderBottom: '2px solid #DFE1E6', padding: '8px 16px', display: 'flex', gap: '0', alignItems: 'center' }}>
        {['KEY', 'SUMMARY', 'REQUESTER', 'PRIORITY', 'STATUS', 'AGE'].map((col, i) => (
          <div key={col} style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700,
            color: '#5E6C84', letterSpacing: '0.1em',
            flex: i === 1 ? 3 : i === 2 ? 2 : 1,
          }}>{col}</div>
        ))}
      </div>
      {/* Rows */}
      {items.map((item, idx) => (
        <div key={item.key} style={{
          background: '#FFFFFF',
          borderBottom: idx < items.length - 1 ? '1px solid #F4F5F7' : 'none',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '0',
        }}>
          <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '11px', color: '#0052CC', fontWeight: 600 }}>{item.key}</div>
          <div style={{ flex: 3, fontSize: '13px', color: '#172B4D', fontWeight: 500 }}>
            {item.title}
            <span style={{ marginLeft: '8px', fontFamily: 'monospace', fontSize: '8px', color: '#FF5630', background: '#FFEBE6', padding: '2px 6px', borderRadius: '3px', fontWeight: 700, letterSpacing: '0.06em' }}>REQUEST</span>
          </div>
          <div style={{ flex: 2, fontSize: '11px', color: '#5E6C84', fontFamily: 'monospace' }}>{item.requester}</div>
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: item.priorityColor, background: `${item.priorityColor}18`, padding: '2px 7px', borderRadius: '3px', letterSpacing: '0.06em' }}>{item.priority}</span>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: item.statusColor, background: `${item.statusColor}18`, padding: '2px 7px', borderRadius: '3px', letterSpacing: '0.06em' }}>{item.status}</span>
          </div>
          <div style={{ flex: 1, fontSize: '11px', color: '#97A0AF', fontFamily: 'monospace' }}>{item.age}</div>
        </div>
      ))}
      <div style={{ background: '#F4F5F7', borderTop: '1px solid #DFE1E6', padding: '8px 16px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
          &#9888; All items marked &ldquo;REQUEST&rdquo; &mdash; no problem statements defined. RICE score: N/A. Estimated effort: unknown.
        </div>
      </div>
    </div></TiltCard>
  );
};

// ─────────────────────────────────────────
// LOCAL: REFRAMING EXERCISE (flip cards)
// ─────────────────────────────────────────
const ReframingExercise = () => {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const cards = [
    {
      request: 'Build CRM Integration',
      problem: 'Sales reps lose context mid-deal because EdSpark doesn\'t sync with their CRM',
    },
    {
      request: 'Add Referral Feature',
      problem: 'Users who want to invite teammates have no in-product way to do it',
    },
    {
      request: 'Improve Search',
      problem: 'Users can\'t find a specific recording quickly, so they stop using playback',
    },
  ];

  const toggle = (i: number) => setFlipped(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <div style={{ margin: '32px 0' }}>
      {demoLabel('Click each card to reveal the problem behind the feature', ACCENT)}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            style={{ flex: '1', minWidth: '200px', cursor: 'pointer', perspective: '800px' }}
          >
            <div style={{ position: 'relative', minHeight: '160px' }}>
              <AnimatePresence mode="wait">
                {!flipped[i] ? (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 90 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: `rgba(${ACCENT_RGB},0.08)`,
                      border: `2px solid rgba(${ACCENT_RGB},0.25)`,
                      borderRadius: '10px',
                      padding: '20px 18px',
                      minHeight: '160px',
                      display: 'flex',
                      flexDirection: 'column' as const,
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '8px', fontWeight: 700,
                        letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                        color: ACCENT, background: `rgba(${ACCENT_RGB},0.12)`,
                        padding: '3px 8px', borderRadius: '4px',
                        display: 'inline-block', marginBottom: '12px',
                      }}>REQUEST</span>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.4 }}>{card.request}</div>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '12px' }}>
                      tap to reframe &rarr;
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0, rotateY: 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: -90 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: 'rgba(13,122,90,0.08)',
                      border: '2px solid rgba(13,122,90,0.25)',
                      borderRadius: '10px',
                      padding: '20px 18px',
                      minHeight: '160px',
                      display: 'flex',
                      flexDirection: 'column' as const,
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '8px', fontWeight: 700,
                        letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                        color: '#0D7A5A', background: 'rgba(13,122,90,0.12)',
                        padding: '3px 8px', borderRadius: '4px',
                        display: 'inline-block', marginBottom: '12px',
                      }}>PROBLEM</span>
                      <div style={{ fontSize: '14px', color: 'var(--ed-ink)', lineHeight: 1.6 }}>{card.problem}</div>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#0D7A5A', marginTop: '12px' }}>
                      &#10003; reframed
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '12px', fontFamily: 'monospace', fontSize: '10px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
        {Object.values(flipped).filter(Boolean).length} / {cards.length} reframed
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// LOCAL: KIRAN DATA MOCKUP (Amplitude-style)
// ─────────────────────────────────────────
const KiranDataMockup = () => {
  const metrics = [
    {
      label: 'Week-1 Churn Rate',
      value: '40%',
      trend: '&#8593; up',
      trendBad: true,
      note: 'vs 34% last quarter',
      color: ACCENT,
      borderColor: `rgba(${ACCENT_RGB},0.2)`,
    },
    {
      label: 'CRM Feature Requests',
      value: '3',
      trend: 'customers',
      trendBad: false,
      note: '0.8% of active users',
      color: '#0D7A5A',
      borderColor: 'rgba(13,122,90,0.2)',
    },
    {
      label: 'Onboarding Complete',
      value: '58%',
      trend: '&#8595; down',
      trendBad: true,
      note: 'vs 67% last quarter',
      color: '#B5720A',
      borderColor: 'rgba(181,114,10,0.2)',
    },
  ];

  return (
    <TiltCard style={{ margin: '32px 0' }}><div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #2C3E60', boxShadow: '0 24px 64px rgba(0,0,0,0.32)' }}>
      <div style={{ background: '#1B2A47', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
            <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#7FBAFF', fontWeight: 700, letterSpacing: '0.1em' }}>
          AMPLITUDE
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
          / EdSpark &middot; Product Analytics &middot; Kiran&apos;s dashboard
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#28C840', boxShadow: '0 0 6px #28C840' }} />
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>Live &middot; Q1 2024</div>
        </div>
      </div>
      <div style={{ background: '#F8F9FC', padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>
        {metrics.map((m) => (
          <div key={m.label} style={{
            flex: '1', minWidth: '160px', background: '#FFFFFF',
            borderRadius: '10px', padding: '20px 18px',
            border: `1px solid ${m.borderColor}`,
            borderTop: `3px solid ${m.color}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>{m.label}</div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: m.color, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace", marginBottom: '6px' }}>{m.value}</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, color: m.trendBad ? ACCENT : '#0D7A5A' }} dangerouslySetInnerHTML={{ __html: m.trend }} />
              <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)' }}>{m.note}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: '#F8F9FC', borderTop: '1px solid #E8EAF0', padding: '10px 24px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--ed-ink3)' }}>
          &#10022; Kiran&apos;s note: 3 CRM requests vs. 40% of all users churning in week 1. The data is not ambiguous.
        </div>
      </div>
    </div></TiltCard>
  );
};

// ─────────────────────────────────────────
// LOCAL: RICE CALCULATOR MOCKUP
// ─────────────────────────────────────────
const RICECalculatorMockup = () => {
  const rows = [
    { problem: 'Onboarding gap', reach: 500, impact: 2, confidence: 80, effort: 1, score: 800, winner: true },
    { problem: 'Search improvements', reach: 200, impact: 1, confidence: 60, effort: 2, score: 60, winner: false },
    { problem: 'CRM Integration', reach: 50, impact: 2, confidence: 50, effort: 4, score: 12.5, winner: false },
    { problem: 'Referral feature', reach: 150, impact: 1, confidence: 50, effort: 3, score: 25, winner: false },
  ];

  const cols = ['Problem', 'Reach', 'Impact', 'Confidence', 'Effort', 'RICE Score'];

  return (
    <TiltCard style={{ margin: '32px 0' }}><div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #E0D9D0', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
      <div style={{ background: `rgba(${ACCENT_RGB},0.9)`, padding: '10px 16px', display: 'flex', alignItems: 'center' }}>
        {cols.map((col, i) => (
          <div key={col} style={{
            flex: i === 0 ? 3 : 1,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px', fontWeight: 700,
            color: 'rgba(255,255,255,0.9)', letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
          }}>{col}</div>
        ))}
        <div style={{ width: '80px' }} />
      </div>
      {rows.map((row, idx) => (
        <div key={row.problem} style={{
          background: row.winner ? 'rgba(13,122,90,0.06)' : idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
          borderBottom: idx < rows.length - 1 ? '1px solid #F0EDE8' : 'none',
          borderLeft: row.winner ? '4px solid #0D7A5A' : '4px solid transparent',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{ flex: 3 }}>
            <span style={{ fontSize: '13px', color: 'var(--ed-ink)', fontWeight: row.winner ? 700 : 500 }}>{row.problem}</span>
          </div>
          <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '13px', color: 'var(--ed-ink2)' }}>{row.reach}</div>
          <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '13px', color: 'var(--ed-ink2)' }}>{row.impact}</div>
          <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '13px', color: 'var(--ed-ink2)' }}>{row.confidence}%</div>
          <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '13px', color: 'var(--ed-ink2)' }}>{row.effort}</div>
          <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '15px', fontWeight: 800, color: row.winner ? '#0D7A5A' : ACCENT }}>{row.score}</div>
          <div style={{ width: '80px', textAlign: 'right' as const }}>
            {row.winner && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: 'inline-block',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '8px', fontWeight: 700,
                  color: '#0D7A5A', background: 'rgba(13,122,90,0.12)',
                  padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em',
                }}>&#10003; PRIORITY</motion.span>
            )}
          </div>
        </div>
      ))}
      <div style={{ background: '#F8F6F2', borderTop: '1px solid #E0D9D0', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const }}>
        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--ed-ink3)' }}>
          RICE Score = (Reach &times; Impact &times; Confidence) &divide; Effort
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: `rgba(${ACCENT_RGB},0.7)` }}>
          e.g. Onboarding: (500 &times; 2 &times; 0.80) &divide; 1 = 800
        </div>
      </div>
    </div></TiltCard>
  );
};

// ─────────────────────────────────────────
// LOCAL: STAKEHOLDER REPLY MOCKUP (Slack-style)
// ─────────────────────────────────────────
const StakeholderReplyMockup = () => (
  <TiltCard style={{ margin: '32px 0' }}>
  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #1A1D21', boxShadow: '0 24px 64px rgba(0,0,0,0.32)' }}>
    <div style={{ background: '#1A1D21', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '5px' }}>
        {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
          <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
        ))}
      </div>
      <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>#</span>
      <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>product-team</span>
    </div>
    <div style={{ background: '#FFFFFF', padding: '20px 20px', display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
      {/* Marcus message */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#FF5630', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>M</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '5px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1D1C1D' }}>Marcus</span>
            <span style={{ fontSize: '10px', color: '#616061', fontFamily: 'monospace' }}>4:02 PM</span>
          </div>
          <div style={{
            padding: '12px 14px', borderRadius: '8px',
            background: '#FFF2F0', border: '1px solid #FFD9D4',
            borderLeft: `3px solid ${ACCENT}`,
            fontSize: '13px', color: '#1D1C1D', lineHeight: 1.7,
          }}>
            hey @priya &mdash; just got off a call with Meridian. they&apos;re asking about CRM sync again. if we don&apos;t have something to show them by next sprint i think we&apos;re going to lose the deal. this is blocking us from closing. can we move it up? &#128308;
          </div>
        </div>
      </div>
      {/* Priya reply */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>P</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '5px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1D1C1D' }}>Priya</span>
            <span style={{ fontSize: '10px', color: '#616061', fontFamily: 'monospace' }}>4:18 PM</span>
          </div>
          <div style={{
            padding: '14px 16px', borderRadius: '8px',
            background: '#FFFFFF', border: '1px solid #E8E8E8',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            fontSize: '13px', color: '#1D1C1D', lineHeight: 1.8,
          }}>
            <div style={{ marginBottom: '10px' }}>Hey Marcus &mdash; I hear you, and I know Meridian matters. Here&apos;s where I landed after running the numbers:</div>
            <div style={{ padding: '10px 14px', borderRadius: '6px', background: '#F8F9FC', border: '1px solid #E0E4ED', marginBottom: '10px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: '#4F46E5', letterSpacing: '0.1em', marginBottom: '6px' }}>RICE ANALYSIS</div>
              <div style={{ fontSize: '12px', color: '#5E6C84', lineHeight: 1.7 }}>
                CRM Integration: Reach=50 users &middot; Impact=2 &middot; Confidence=50% &middot; Effort=4 &rarr; <strong style={{ color: ACCENT }}>Score: 12.5</strong><br />
                Onboarding fix: Reach=500 users &middot; Impact=2 &middot; Confidence=80% &middot; Effort=1 &rarr; <strong style={{ color: '#0D7A5A' }}>Score: 800</strong>
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              Week-1 churn is at 40%. That&apos;s roughly <strong>200 users leaving every month</strong> before they see value. If we don&apos;t stop that leak, we won&apos;t have users to sell CRM sync to.
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(13,122,90,0.07)', border: '1px solid rgba(13,122,90,0.18)', marginBottom: '10px', fontStyle: 'italic' as const }}>
              This sprint: Onboarding. Q2: CRM integration &mdash; I&apos;ll flag it for sprint planning then with the Meridian context attached.
            </div>
            <div>If you have data that changes the picture on Meridian&apos;s ARR relative to our base, share it and I&apos;ll rerun the model. Happy to jump on a 15-min call before EOD. &#128591;</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </TiltCard>
);

// ─────────────────────────────────────────
// LOCAL: PRIORITIZATION CHEAT SHEET
// ─────────────────────────────────────────
const PrioritizationCheatSheet = () => {
  const sections = [
    {
      title: 'Problem Statement Template',
      icon: '&#9672;',
      color: '#4F46E5',
      items: [
        '"Users trying to [action] face [problem] causing [outcome]"',
        'Focus on behaviour and impact, not features',
        'One sentence. One problem. No solution inside.',
        'Name the user group, the broken action, and the cost',
      ],
    },
    {
      title: 'RICE Formula',
      icon: '&#8721;',
      color: ACCENT,
      items: [
        'Score = (Reach x Impact x Confidence) / Effort',
        'Reach: users affected per quarter',
        'Impact: 3=massive, 2=high, 1=medium, 0.5=low',
        'Confidence: % certainty in your estimates',
        'Effort: person-months to build',
      ],
    },
    {
      title: 'Decision Language',
      icon: '&#9678;',
      color: '#0D7A5A',
      items: [
        '"We\'re prioritising X because it affects Y% of users"',
        '"CRM is important — here\'s when we revisit it"',
        '"If you have data that changes this, let\'s look"',
        '"I disagree but I understand" = successful outcome',
      ],
    },
    {
      title: 'One-Liners to Carry',
      icon: '&#10022;',
      color: '#B5720A',
      items: [
        'Feature requests are proposed solutions, not problems',
        'RICE makes assumptions visible, not decisions easy',
        'Clarity > consensus in priority calls',
        'The best decision will upset someone. Do it anyway.',
      ],
    },
  ];

  return (
    <div style={{ margin: '36px 0' }}>
      {demoLabel('Prioritization Reference Card', ACCENT)}
      <div style={{
        borderRadius: '14px', overflow: 'hidden',
        border: `1px solid rgba(${ACCENT_RGB},0.2)`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(${ACCENT_RGB},0.85) 0%, rgba(79,70,229,0.8) 100%)`,
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2em', marginBottom: '6px' }}>PM FUNDAMENTALS &middot; MODULE 03</div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: '20px', fontWeight: 700, color: '#fff' }}>Prioritization Cheat Sheet</div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '32px', fontWeight: 700, color: 'rgba(255,255,255,0.15)', lineHeight: 1 }}>03</div>
        </div>
        <div style={{ background: '#FFFFFF', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {sections.map((section, idx) => (
            <div key={section.title} style={{
              padding: '20px 20px',
              borderRight: idx % 2 === 0 ? '1px solid #F0EDE8' : 'none',
              borderBottom: idx < 2 ? '1px solid #F0EDE8' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '16px', color: section.color }} dangerouslySetInnerHTML={{ __html: section.icon }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: section.color, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{section.title}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
                {section.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ color: section.color, fontSize: '10px', flexShrink: 0, marginTop: '3px' }}>&#9656;</span>
                    <span style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// KIRAN MENTOR CARD (custom, not Avatar component)
// ─────────────────────────────────────────
const KiranMentorCard = ({
  content,
  question,
  options,
}: {
  content: React.ReactNode;
  question?: string;
  options?: { text: string; correct: boolean; feedback: string }[];
}) => {
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const answered = selectedIdx !== null;
  const isCorrect = answered && options ? options[selectedIdx].correct : false;

  const handleAnswer = (i: number) => {
    if (answered) return;
    setSelectedIdx(i);
  };

  return (
    <motion.div
      whileHover={{ y: -1, boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}
      style={{
        background: 'var(--ed-card)', borderRadius: '10px',
        borderTop: '1px solid var(--ed-rule)',
        borderRight: '1px solid var(--ed-rule)',
        borderBottom: '1px solid var(--ed-rule)',
        borderLeft: '4px solid #3A86FF',
        marginTop: '28px', overflow: 'hidden',
        transition: 'box-shadow 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}>
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
            style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#3A86FF', display: 'inline-block' }}
          />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#3A86FF',
          }}>Team &middot; Data</span>
          {question && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '8px',
              color: 'var(--ed-ink3)', letterSpacing: '0.06em', marginLeft: '4px',
            }}>&middot; has a question for you</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {question && answered && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700,
              color: isCorrect ? 'var(--ed-green)' : ACCENT, letterSpacing: '0.06em',
            }}>{isCorrect ? '&#10003; correct' : '&#10007; revisit'}</span>
          )}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}
            style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>&#9660;</motion.span>
        </div>
      </div>
      <div style={{ padding: '18px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{
          width: '66px', height: '66px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #3A86FF 0%, #1B5FD6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '3px solid #3A86FF',
          boxShadow: '0 0 0 2px rgba(58,134,255,0.15)',
        }}>
          <span style={{ fontSize: '26px' }}>&#128202;</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '1px' }}>Kiran</div>
          <div style={{
            fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace",
            marginBottom: '10px', letterSpacing: '0.04em',
          }}>Data Analyst &middot; EdSpark</div>
          <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.82 }}>{content}</div>
        </div>
      </div>
      <AnimatePresence>
        {open && question && options && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ borderTop: '1px solid var(--ed-rule)', overflow: 'hidden' }}
          >
            <div style={{ padding: '20px 18px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#3A86FF', letterSpacing: '0.12em', marginBottom: '12px' }}>KIRAN ASKS</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.5, marginBottom: '16px' }}>{question}</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                {options.map((opt, i) => {
                  const selected = selectedIdx === i;
                  const revealed = answered;
                  const bg = !revealed ? 'var(--ed-card)' : selected ? (opt.correct ? 'rgba(13,122,90,0.08)' : `rgba(${ACCENT_RGB},0.08)`) : 'var(--ed-card)';
                  const border = !revealed ? 'var(--ed-rule)' : selected ? (opt.correct ? '#0D7A5A' : ACCENT) : 'var(--ed-rule)';
                  return (
                    <motion.button
                      key={i}
                      whileHover={!answered ? { y: -1 } : {}}
                      onClick={() => handleAnswer(i)}
                      style={{
                        padding: '12px 16px', borderRadius: '8px',
                        border: `1.5px solid ${border}`, background: bg,
                        cursor: answered ? 'default' : 'pointer', textAlign: 'left' as const,
                        transition: 'all 0.2s',
                      }}>
                      <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.5 }}>{opt.text}</div>
                      {revealed && selected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          style={{ marginTop: '8px', fontSize: '12px', color: opt.correct ? '#0D7A5A' : ACCENT, lineHeight: 1.6 }}>
                          {opt.correct ? '&#10003; ' : '&#10007; '}{opt.feedback}
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─────────────────────────────────────────
// INTRO HERO
// ─────────────────────────────────────────
const IntroHero = () => (
  <section style={{ background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', padding: '48px 0 40px', position: 'relative', overflow: 'hidden' }}>
    <div aria-hidden="true" style={{
      position: 'absolute', right: '-20px', top: '-10px',
      fontSize: 'clamp(120px, 18vw, 220px)', fontWeight: 700, lineHeight: 1,
      color: `rgba(${ACCENT_RGB},0.06)`,
      fontFamily: "'Lora', 'Georgia', serif",
      letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none',
    }}>03</div>

    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 28px', position: 'relative', zIndex: 1 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '12px', textTransform: 'uppercase' as const }}>
        MODULE 03 &middot; NEW TO PM TRACK
      </div>
      <h1 style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-0.02em' }}>
        Problem Framing &amp;<br />Prioritization
      </h1>
      <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, marginBottom: '28px', maxWidth: '640px' }}>
        Sprint planning Monday. Four stakeholders. Four &ldquo;urgent&rdquo; requests. One engineer for two weeks.
        Priya has to pick one. This is how she does it without guessing.
      </div>
      <div style={{ marginBottom: '28px', background: 'var(--ed-card)', borderRadius: '8px', padding: '16px 20px', border: '1px solid var(--ed-rule)', maxWidth: '600px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--ed-ink3)', marginBottom: '10px', textTransform: 'uppercase' as const }}>You will learn</div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
          {[
            'Turn feature requests into problem statements',
            'Use data to compare wildly different inputs',
            'Score priorities with the RICE framework',
            'Communicate hard calls without apologising',
          ].map(obj => (
            <div key={obj} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>&#10003;</span>
              <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.55 }}>{obj}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--ed-rule)', paddingTop: '20px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--ed-ink3)', marginBottom: '12px' }}>CHARACTERS IN THIS MODULE</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
          {[
            { emoji: '&#129489;&#8205;&#128188;', name: 'Priya Sharma', role: 'APM · 2 yrs · EdSpark', desc: 'Leading sprint planning. Her challenge: everyone says their request is the most important.', accent: ACCENT },
            { emoji: '&#128084;', name: 'Rohan', role: 'CEO · EdSpark', desc: 'Sets product strategy. Priya needs to align her decisions with his goals.', accent: '#E67E22' },
            { emoji: '&#128202;', name: 'Kiran', role: 'Data Analyst · EdSpark', desc: 'Pulls the Amplitude numbers that change the whole conversation.', accent: '#3A86FF' },
            { emoji: '&#129489;&#8205;&#127979;', name: 'Asha', role: 'AI Mentor', desc: 'Challenges Priya\'s reasoning throughout. The voice that asks "but why?"', accent: '#4F46E5' },
          ].map(c => (
            <div key={c.name} style={{ flex: '1', minWidth: '180px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${c.accent}`, padding: '12px 14px' }}>
              <div style={{ display: 'flex', gap: '9px', alignItems: 'center', marginBottom: '7px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${c.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: c.emoji }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--ed-ink)', lineHeight: 1.2 }}>{c.name}</div>
                  <div style={{ fontSize: '9px', color: c.accent, fontFamily: 'monospace', marginTop: '1px', fontWeight: 600 }}>{c.role}</div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────
export default function Track1Prioritization() {
  return (
    <article>
      <IntroHero />

      {/* ── PART I ── Too Many "Urgent" Problems ── */}
      <ChapterSection id="m3-raw-inputs" num="01" accentRgb={ACCENT_RGB} first>
        {h2(<>Part I &middot; Too Many &ldquo;Urgent&rdquo; Problems</>)}

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Sprint planning Monday. Priya&apos;s inbox is a warzone. Sales wants a CRM integration. Marketing wants
          a referral feature. Twelve users have complained about search. Churn data from Kiran points at
          onboarding. She has one engineer. Two weeks. And everyone says &ldquo;this is the most important thing.&rdquo;
        </SituationCard>

        {para(<>
          Priya stares at the list. She knows she can only pick one, maybe two things. But how do you compare
          a sales team&apos;s deal pressure to a user complaint logged three weeks ago to a data signal that
          nobody on the team has talked about out loud? They don&apos;t even feel like the same kind of thing.
        </>)}

        {para(<>
          That&apos;s because they aren&apos;t. Feature requests, stakeholder asks, user complaints, and data signals
          are four completely different types of inputs &mdash; each with a different source, a different level of
          confidence, and a different shelf life. You can&apos;t prioritize apples against oranges until you
          convert them into the same currency.
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--purple-light)"
          borderColor="var(--purple)"
          content={<>&ldquo;Are these even the same type of things?&rdquo; Feature requests, complaints, stakeholder asks, and data signals are all different kinds of inputs. Before you can prioritize, you need to convert them into the same currency: problem statements. Right now you have apples, oranges, and a wrench in the same bowl.</>}
        />

        {h2(<>You can&apos;t prioritize what you haven&apos;t defined</>)}

        {para(<>
          Here is the insight that changes everything: <strong>raw feature requests are not problems.</strong> They are
          proposed solutions. When Marcus from Sales says &ldquo;we need CRM integration,&rdquo; he has already skipped
          past the problem statement and landed on a solution he thinks will fix it. As a PM, your first job
          is not to evaluate his solution. Your job is to find the problem underneath it.
        </>)}

        {para(<>
          &ldquo;Build CRM integration&rdquo; is a feature. &ldquo;Sales reps lose deal context because EdSpark doesn&apos;t sync
          with their CRM&rdquo; is a problem. One tells you what to build. The other tells you what is broken &mdash; and
          leaves room for you to find the best way to fix it. That gap is where good PM thinking lives.
        </>)}

        <BacklogInputsMockup />

        {para(<>
          Look at that backlog. Four items, four requesters, zero problem statements. The items are not wrong &mdash;
          they might all be worth building. But you cannot score them, compare them, or make a defensible
          decision until you know what problem each one is actually solving. That is Priya&apos;s next step.
        </>)}

        <QuizEngine
          conceptId="raw-inputs-m3"
          conceptName="Raw Inputs"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'raw-inputs-m3',
            question: 'You get a Slack message: "We need a referral feature." What should you do first?',
            options: [
              'A) Add it to the roadmap immediately',
              'B) Ask engineering to estimate the effort',
              'C) Understand what problem this feature is meant to solve',
              'D) Ask design to start wireframing it',
            ],
            correctIndex: 2,
            explanation: 'Feature requests are proposed solutions. Your job is to find the problem first — only then can you decide whether the proposed solution is even the right answer.',
            keyInsight: 'Every feature request hides a problem statement. Surface the problem before you evaluate the solution.',
          }}
        />
      </ChapterSection>

      {/* ── PART II ── Priya Reframes Everything ── */}
      <ChapterSection id="m3-reframe" num="02" accentRgb={ACCENT_RGB}>
        {h2(<>Part II &middot; Priya Reframes Everything</>)}

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya closes Slack, opens a blank doc, and starts rewriting. Not the features &mdash; the problems behind
          them. She goes through each backlog item one by one and asks a single question: &ldquo;What are users
          actually struggling to do?&rdquo;
        </SituationCard>

        {h2(<>Turn every request into a problem statement</>)}

        {para(<>
          The reframe is not a creative exercise &mdash; it is a discipline. You are not inventing problems; you are
          uncovering them. The person who sent the feature request already knows the problem. They just told
          you the solution first. Your job is to reverse-engineer their thinking until you can name the
          underlying friction in one specific sentence.
        </>)}

        <ReframingExercise />

        {para(<>
          Now look at what happened. Priya has three reframed problem statements. They are comparable. They are specific
          about which users are affected, what behaviour is breaking down, and what the consequence is.
          And they are completely free of assumptions about what to build.
        </>)}

        {para(<>
          The key shift is subtle but important: the feature request &ldquo;improve search&rdquo; could mean a hundred
          different things. But &ldquo;users can&apos;t find a specific recording quickly, so they stop using playback&rdquo;
          has a measurable behaviour, an affected user group, and a clear outcome metric. That is something
          you can actually design and test against.
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--purple-light)"
          borderColor="var(--purple)"
          content={<>Now you have four problem statements. They&apos;re comparable. They&apos;re specific. And you can finally start asking: which one matters most?</>}
          expandedContent={<>Jobs to Be Done is the frame behind every problem statement. Users don&apos;t want features &mdash; they want to get a job done. &ldquo;Build CRM integration&rdquo; is a feature. &ldquo;Sales reps need to stay in context during deal reviews&rdquo; is a job. Find the job, and the right solution becomes obvious. The JTBD frame also helps you spot when two different feature requests are actually solving the same underlying job &mdash; which means you might only need to build one thing.</>}
        />

        {keyBox('Problem Statement Template', [
          'Users trying to ___ face ___ causing ___',
          'Focus on behaviour and impact, not features',
          'One sentence. One problem. No solution inside.',
          'Name the user group, the broken action, and the cost',
        ], ACCENT)}

        <QuizEngine
          conceptId="problem-framing-m3"
          conceptName="Problem Framing"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'problem-framing-m3',
            question: 'Which of these is a proper problem statement?',
            options: [
              'A) "We need better onboarding screens"',
              'B) "Onboarding is bad"',
              'C) "New managers don\'t know what to do after setup, so they stop logging in"',
              'D) "Users have requested an onboarding tour"',
            ],
            correctIndex: 2,
            explanation: 'Option C names a specific user (new managers), a specific behaviour gap (don\'t know what to do after setup), and a specific outcome (stop logging in). That\'s a proper problem statement. A and D are solutions or requests. B is too vague to act on.',
            keyInsight: 'A good problem statement has three parts: who, what they\'re struggling to do, and what happens when they fail.',
          }}
        />
      </ChapterSection>

      {/* ── PART III ── Data Changes Everything ── */}
      <ChapterSection id="m3-data" num="03" accentRgb={ACCENT_RGB}>
        {h2(<>Part III &middot; Data Changes Everything</>)}

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Before booking any user interviews, Priya walks over to Kiran at the data desk. &ldquo;Show me the numbers,&rdquo;
          she says. Kiran opens Amplitude. &ldquo;I&apos;ve been waiting for you to ask,&rdquo; he says.
        </SituationCard>

        {para(<>
          Kiran pulls up three charts. Week-1 churn rate: 40%. CRM feature requests in the last 90 days: three
          customers. Onboarding completion rate: 58%, down from 67% last quarter. Priya looks at the screen
          and feels the picture shift.
        </>)}

        <KiranDataMockup />

        {para(<>
          The CRM request came from three customers. The onboarding problem is hitting 40% of every single
          user who signs up. That is not a close call on the numbers alone. But data does not make the
          decision for you &mdash; it changes the frame of the conversation you need to have.
        </>)}

        <KiranMentorCard
          content={<>The CRM request came from 3 customers. The onboarding problem is hitting 40% of everyone. That&apos;s not a close call. Three vocal users generate a disproportionate number of Slack messages &mdash; but volume of noise is not the same as breadth of impact. The data is the tie-breaker.</>}
          question="Kiran shows data that contradicts a VP's feature request. What does good data hygiene tell you?"
          options={[
            { text: 'Trust the VP — they have more business context than you', correct: false, feedback: 'Seniority is not a data source. The VP\'s context matters, but it needs to be weighed against actual evidence, not deferred to.' },
            { text: 'Run the data vs. requests comparison, then present both transparently', correct: true, feedback: 'Data earns its seat at the table by being shown, not asserted. Present both the stakeholder context and the data signal — let the room decide with full information.' },
            { text: 'Ignore both and run qualitative research first', correct: false, feedback: 'You already have quantitative signal — use it before piling on more research. Adding more inputs without using existing ones is a delay, not diligence.' },
            { text: 'Survey users to find out which they prefer', correct: false, feedback: 'You can\'t survey your way out of a prioritization decision. Users will pick what sounds best, not what\'s most impactful. The data already tells you what\'s happening.' },
          ]}
        />

        {h2(<>3 customers vs. 40% of users. That&apos;s not a hard choice.</>)}

        {para(<>
          Priya feels the relief of clarity. And then immediately: &ldquo;But I still have four problems. How do I
          compare them systematically? Because if Marcus comes back with three more CRM customers, I need
          something more rigorous than my gut.&rdquo;
        </>)}

        {para(<>
          Data gives you directional clarity. But when you have multiple problems with different reach,
          different estimated impact, and different levels of confidence &mdash; you need a framework that makes
          your assumptions visible and your reasoning transferable. That is where RICE comes in.
        </>)}
      </ChapterSection>

      {/* ── PART IV ── The RICE Framework ── */}
      <ChapterSection id="m3-rice" num="04" accentRgb={ACCENT_RGB}>
        {h2(<>Part IV &middot; The RICE Framework</>)}

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Asha drops by Priya&apos;s desk with a notebook. &ldquo;You need a scoring system,&rdquo; she says. &ldquo;Something that
          makes it harder to pick with your gut &mdash; and easier to explain your reasoning to everyone else.&rdquo;
        </SituationCard>

        {h2(<>RICE: A framework for comparing apples to oranges</>)}

        {para(<>
          RICE stands for <strong>Reach, Impact, Confidence, Effort</strong>. It does not make the decision for you &mdash;
          no framework does. What it does is force you to make your assumptions explicit and convert
          your four problem statements into a single comparable number.
        </>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('RICE Formula Breakdown', ACCENT)}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
            {[
              { letter: 'R', name: 'Reach', desc: 'How many users will this affect in a quarter?', example: 'e.g. 500 users per quarter hit the broken onboarding flow' },
              { letter: 'I', name: 'Impact', desc: 'How much will it move the needle per user?', example: '3 = massive · 2 = high · 1 = medium · 0.5 = low' },
              { letter: 'C', name: 'Confidence', desc: 'How confident are you in these estimates?', example: '100% = very sure · 80% = fairly sure · 50% = uncertain' },
              { letter: 'E', name: 'Effort', desc: 'How many person-months will it take to build?', example: 'e.g. 1 = one engineer, one month' },
            ].map(item => (
              <div key={item.letter} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '12px 14px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', fontWeight: 800, color: ACCENT }}>{item.letter}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ed-ink)', marginBottom: '3px' }}>{item.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', marginBottom: '4px' }}>{item.desc}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--ed-ink3)' }}>{item.example}</div>
                </div>
              </div>
            ))}
            <div style={{ padding: '12px 14px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.08)`, border: `1px solid rgba(${ACCENT_RGB},0.2)` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 800, color: ACCENT, textAlign: 'center' as const }}>
                Score = (Reach &times; Impact &times; Confidence) &divide; Effort
              </div>
            </div>
          </div>
        </div>

        <RICECalculatorMockup />

        {para(<>
          The numbers tell a clear story. The onboarding gap scores 800. The next closest is search improvements
          at 60 &mdash; a full order of magnitude below. CRM integration, the request that has generated the most
          noise, scores 12.5. Not because CRM does not matter &mdash; but because right now it affects 50 users
          with uncertain estimates at high engineering cost.
        </>)}

        {para(<>
          Notice what the RICE score did: it made everyone&apos;s assumptions visible. The confidence score is
          where the intellectual honesty lives. When you score CRM integration at 50% confidence, you are
          admitting you do not actually know how much it would move the needle. That is important
          information, not a weakness.
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--purple-light)"
          borderColor="var(--purple)"
          content={<>RICE doesn&apos;t make the decision for you. It forces you to make your assumptions visible. When you disagree on a score, you&apos;re really disagreeing on strategy &mdash; and that&apos;s a much better conversation to have.</>}
          expandedContent={<>The confidence score is the most honest part of RICE. It&apos;s where you admit what you don&apos;t know. A team that puts 80% confidence on everything is lying to itself. A team that puts 30% on something should probably run more research before committing to build it. Low confidence is not a problem &mdash; it&apos;s a signal to gather more data before you start building.</>}
          question="What does a low RICE score for a feature request mean?"
          options={[
            { text: 'The feature is not worth building — ever', correct: false, feedback: 'RICE scores change as context changes. A low score today might be high next quarter if the strategic situation shifts.' },
            { text: 'The effort outweighs the expected reach and impact given current estimates', correct: true, feedback: "That's exactly what the formula captures. Low score = high cost relative to expected benefit at this point in time." },
            { text: 'You need more stakeholder approval before proceeding', correct: false, feedback: 'RICE is about impact vs. effort, not stakeholder politics. Approval and prioritization are separate conversations.' },
            { text: 'You should reduce scope to increase the score', correct: false, feedback: 'Scope reduction can help, but first ask whether the problem is even worth solving at this moment. Scoping down a wrong priority is still wrong.' },
          ]}
          conceptId="rice-framework-m3"
        />
      </ChapterSection>

      {/* ── PART V ── Making the Call ── */}
      <ChapterSection id="m3-call" num="05" accentRgb={ACCENT_RGB}>
        {h2(<>Part V &middot; Making the Call</>)}

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Friday morning. Priya updates her priority doc. Onboarding is #1. She books the sprint. The engineer
          starts Monday. And then at 4pm, Slack lights up. It&apos;s Marcus from Sales.
        </SituationCard>

        {h2(<>The right decision will upset someone. Do it anyway.</>)}

        {para(<>
          &ldquo;We&apos;ll lose the Meridian deal if we don&apos;t ship CRM sync this sprint,&rdquo; Marcus writes. &ldquo;They&apos;re asking
          about it again. This is blocking us from closing.&rdquo; Priya had been expecting this.
        </>)}

        {para(<>
          She takes a breath. She has two bad options and one right one. Bad option one: cave, move CRM to
          the sprint, abandon the RICE analysis. Bad option two: ignore the message and let the tension
          fester. The right option: reply with clarity, data, and a concrete path forward &mdash; without
          apologizing for the decision.
        </>)}

        <StakeholderReplyMockup />

        {para(<>
          Read Priya&apos;s reply again. She does not say &ldquo;sorry, but.&rdquo; She does not say &ldquo;I&apos;ll think about it.&rdquo;
          She explains the reasoning with data, connects the onboarding decision to the shared metric
          of retention, and gives CRM a concrete future slot with instructions for how to change
          her decision if the data warrants it. That last part is important.
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--purple-light)"
          borderColor="var(--purple)"
          content={<>Notice what Priya didn&apos;t do: she didn&apos;t apologize, and she didn&apos;t cave. She explained her reasoning with data and connected it to a metric everyone cares about. Clarity builds trust &mdash; even when people disagree with the decision.</>}
          expandedContent={<>The test of a good prioritization decision is not whether everyone agrees. It&apos;s whether everyone understands why. If a stakeholder can say &ldquo;I disagree but I understand the reasoning,&rdquo; you&apos;ve done your job. &ldquo;I disagree and I don&apos;t understand why&rdquo; means you didn&apos;t communicate well enough &mdash; not that your decision was wrong.</>}
          question="A senior stakeholder disagrees with your priority call. What do you do?"
          options={[
            { text: 'Change the priority to keep them happy', correct: false, feedback: 'This makes every future decision subject to whoever shouts loudest. It also destroys your credibility as someone who makes principled decisions.' },
            { text: 'Ignore them and move on with the sprint', correct: false, feedback: 'Ignoring valid concerns erodes trust and creates blockers later. The stakeholder won\'t forget — they\'ll just escalate harder next time.' },
            { text: 'Explain your reasoning with data and connect it to shared goals', correct: true, feedback: 'Clarity over consensus. Show your work, connect it to what they care about, and give them a way to change your mind with new data.' },
            { text: 'Escalate immediately to the CEO or VP', correct: false, feedback: 'Escalation before explanation is a last resort, not a first move. Try to resolve with data and direct conversation first.' },
          ]}
          conceptId="stakeholder-decisions-m3"
        />

        {keyBox('How to communicate a hard priority call', [
          '"We\'re prioritising X because it impacts Y% of users"',
          '"CRM is important — here\'s when we can revisit it"',
          '"If you have data that changes this, let\'s look at it together"',
          '"I disagree but I understand" is a successful outcome',
        ], ACCENT)}
      </ChapterSection>

      {/* ── PART VI ── The PM's Real Job ── */}
      <ChapterSection id="m3-stakeholder" num="06" accentRgb={ACCENT_RGB}>
        {h2(<>Part VI &middot; The PM&apos;s Real Job</>)}

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          End of Friday. The sprint is booked. The engineer knows what he&apos;s building. Marcus has his response.
          Priya closes her laptop, opens her notebook, and writes one line.
        </SituationCard>

        {h2(<>Good PMs don&apos;t just solve problems. They choose the right ones.</>)}

        {para(<>
          The week started with four &ldquo;urgent&rdquo; requests and no clear path. It ended with one focused sprint,
          a documented rationale, and a stakeholder who understood the reasoning even if he did not love it.
          That is not luck. That is a repeatable process.
        </>)}

        {para(<>
          The process is not complicated. Convert inputs into problem statements. Gather data. Score with RICE.
          Communicate with clarity. Revisit when context changes. What makes it hard is not the framework &mdash;
          it is the discipline to follow it when someone is yelling in Slack, or when your gut is telling you
          to just pick something and move.
        </>)}

        {pullQuote('The most important skill isn\'t knowing how to build. It\'s knowing what not to build.')}

        {keyBox('The Prioritization Loop', [
          'Collect inputs — feature requests, complaints, stakeholder asks, data signals',
          'Convert — reframe each input as a problem statement',
          'Score — use RICE (or similar) to compare apples to oranges',
          'Communicate — explain the why behind the what, with data',
          'Revisit — context changes; your priorities should too',
        ], ACCENT)}

        <QuizEngine
          conceptId="prioritization-summary-m3"
          conceptName="Prioritization Loop"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'prioritization-summary-m3',
            question: 'You have 5 feature requests from different stakeholders. What\'s the right order of operations?',
            options: [
              'A) Build → Decide → Understand',
              'B) Understand → Prioritize → Build',
              'C) Build everything at reduced scope to keep everyone happy',
              'D) Ask stakeholders to vote on their top priority',
            ],
            correctIndex: 1,
            explanation: 'Understand the problem first. Then prioritize based on data and impact. Then build. No shortcuts — building before understanding is the most expensive mistake in product.',
            keyInsight: 'The loop is always: Understand → Decide → Build → Measure. Rushing any step costs you more later.',
          }}
        />

        <PrioritizationCheatSheet />
      </ChapterSection>

      {/* ── PART VII ── Final Reflection ── */}
      <ChapterSection id="m3-reflection" num="07" accentRgb={ACCENT_RGB}>
        {h2(<>Part VII &middot; What Priya Learned</>)}

        {para(<>
          Priya&apos;s notebook had one line: &ldquo;The most important skill isn&apos;t knowing how to build. It&apos;s knowing
          what not to build.&rdquo; She had spent two years as an APM thinking prioritization was about saying no
          to the right people. This week she learned it is actually about saying yes to the right problems &mdash;
          and making that reasoning visible enough that the people you said no to still trust you next sprint.
        </>)}

        {para(<>
          The CRM integration will get its turn. When the context is right &mdash; when Meridian represents a larger
          share of ARR, when the onboarding churn is under control, when the confidence score goes up &mdash;
          Priya will revisit it. Good prioritization is not permanent. It is a snapshot of what matters most
          right now, with a clear record of why so you can update it cleanly when the picture changes.
        </>)}

        {keyBox('Three things to carry from this module', [
          'Every feature request contains a hidden problem statement — find it before you evaluate the solution',
          'RICE doesn\'t replace judgment; it makes your judgment transparent and transferable',
          'Communicating a hard call clearly is as important as making the right call',
        ], ACCENT)}

        <NextChapterTeaser text="Next: UX & Design Collaboration — Priya needs to turn her prioritised problem into something users can react to. Time to go from brief to prototype." />
      </ChapterSection>
    </article>
  );
}

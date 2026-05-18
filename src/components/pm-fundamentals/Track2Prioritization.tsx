'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  h2, para, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, ApplyItBox,
  TiltCard, ConversationScene, TrackHeroCard, CharacterChip,
} from './designSystem';
import { MentorFace } from './MentorFaces';
import { CorrelationVsMechanism, NowNextLaterOrbits, KillCriteriaMonitor } from './PrioritizationVisualizations';

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────
const ACCENT     = '#C85A40';
const ACCENT_RGB = '200,90,64';
const PARTS = [
  { num: '01', id: 'm3-raw-inputs', label: 'Raw Inputs at Scale' },
  { num: '02', id: 'm3-reframe', label: 'Reframe the Decision' },
  { num: '03', id: 'm3-data', label: 'Data Before Priority' },
  { num: '04', id: 'm3-rice', label: 'RICE Under Pressure' },
  { num: '05', id: 'm3-call', label: 'Make the Call' },
  { num: '06', id: 'm3-stakeholder', label: 'Stakeholder Alignment' },
  { num: '07', id: 'm3-reflection', label: 'Final Reflection' },
];
const MODULE_CONTEXT = `Module 03 of Airtribe PM Fundamentals — Track: APM (Scale Track).
Follows Priya Sharma, 2-year APM at EdSpark (B2B SaaS for sales coaching). EdSpark has just landed Salesforce, Zendesk, and Infosys as enterprise clients. Covers: strategic prioritisation at scale, opportunity scoring vs. RICE, Now/Next/Later roadmaps, managing upward on priority calls, kill criteria, and communicating hard cuts to boards and VPs.`;



// ─────────────────────────────────────────
// MOCKUP 1 — Amplitude: Interactive Enterprise Cohort Dashboard
// Full working mockup: time range selector, segment filter, view mode toggle,
// clickable rows that drill down to session-frequency breakdown, hover tooltips.
// ─────────────────────────────────────────
const COHORT_DATA = [
  { id: 'salesforce', label: 'Salesforce (Enterprise)', color: '#3B82F6', plan: 'Enterprise', seats: '1,240',
    sessions: 4.1,
    retention: { '30d': 79, '60d': 84, '90d': 87 },
    breakdown: [
      { label: '4+ sessions / wk', pct: 72, ret: 91 },
      { label: '2–3 sessions / wk', pct: 21, ret: 74 },
      { label: '< 2 sessions / wk', pct: 7,  ret: 31 },
    ],
  },
  { id: 'zendesk', label: 'Zendesk (Enterprise)', color: '#8B5CF6', plan: 'Enterprise', seats: '890',
    sessions: 3.8,
    retention: { '30d': 74, '60d': 78, '90d': 81 },
    breakdown: [
      { label: '4+ sessions / wk', pct: 61, ret: 91 },
      { label: '2–3 sessions / wk', pct: 29, ret: 74 },
      { label: '< 2 sessions / wk', pct: 10, ret: 31 },
    ],
  },
  { id: 'infosys', label: 'Infosys (Enterprise)', color: '#06B6D4', plan: 'Enterprise', seats: '560',
    sessions: 3.2,
    retention: { '30d': 70, '60d': 73, '90d': 76 },
    breakdown: [
      { label: '4+ sessions / wk', pct: 54, ret: 91 },
      { label: '2–3 sessions / wk', pct: 34, ret: 74 },
      { label: '< 2 sessions / wk', pct: 12, ret: 31 },
    ],
  },
  { id: 'smb', label: 'SMB (self-serve)', color: '#F59E0B', plan: 'SMB', seats: '4,200',
    sessions: 1.4,
    retention: { '30d': 24, '60d': 31, '90d': 38 },
    breakdown: [
      { label: '4+ sessions / wk', pct: 12, ret: 88 },
      { label: '2–3 sessions / wk', pct: 28, ret: 62 },
      { label: '< 2 sessions / wk', pct: 60, ret: 22 },
    ],
  },
  { id: 'trial', label: 'Trial (non-converted)', color: '#EF4444', plan: 'Trial', seats: '8,100',
    sessions: 0.9,
    retention: { '30d': 6, '60d': 9, '90d': 12 },
    breakdown: [
      { label: '4+ sessions / wk', pct: 4,  ret: 81 },
      { label: '2–3 sessions / wk', pct: 12, ret: 44 },
      { label: '< 2 sessions / wk', pct: 84, ret: 8 },
    ],
  },
];

const AmplitudeCohortDashboard = () => {
  const [window_, setWindow] = useState<'30d' | '60d' | '90d'>('90d');
  const [filter, setFilter] = useState<'all' | 'enterprise' | 'smb'>('all');
  const [viewMode, setViewMode] = useState<'retention' | 'sessions'>('retention');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [savedInsight, setSavedInsight] = useState(false);

  const visible = COHORT_DATA.filter(c =>
    filter === 'all' ? true : filter === 'enterprise' ? c.plan === 'Enterprise' : c.plan !== 'Enterprise'
  );

  const maxVal = viewMode === 'retention'
    ? 100
    : Math.max(...visible.map(c => c.sessions));

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 28px 72px rgba(0,0,0,0.32)' }}>

        {/* ── Title bar ── */}
        <div style={{ background: '#1B2A47', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.75)', fontWeight: 600, letterSpacing: '0.06em', flex: 1 }}>
            Amplitude &middot; EdSpark &middot; Cohort Retention by Segment
          </div>
          <motion.button onClick={() => setSavedInsight(s => !s)} whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.96 }}
            style={{ padding: '4px 10px', borderRadius: '5px', border: `1px solid ${savedInsight ? '#34D399' : 'rgba(255,255,255,0.15)'}`, background: savedInsight ? 'rgba(52,211,153,0.12)' : 'transparent', color: savedInsight ? '#34D399' : 'rgba(255,255,255,0.45)', fontSize: '9px', fontFamily: 'monospace', cursor: 'pointer', fontWeight: 700 }}>
            {savedInsight ? '✓ Saved' : '⊕ Save'}
          </motion.button>
        </div>

        {/* ── Toolbar ── */}
        <div style={{ background: '#162235', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' as const }}>
          {/* Time window */}
          <div style={{ display: 'flex', gap: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '2px' }}>
            {(['30d', '60d', '90d'] as const).map(w => (
              <button key={w} onClick={() => setWindow(w)}
                style={{ padding: '3px 10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, background: window_ === w ? '#3B82F6' : 'transparent', color: window_ === w ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}>
                {w}
              </button>
            ))}
          </div>

          {/* Segment filter */}
          <div style={{ display: 'flex', gap: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '2px' }}>
            {[['all', 'All segments'], ['enterprise', 'Enterprise'], ['smb', 'SMB + Trial']] .map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v as typeof filter)}
                style={{ padding: '3px 10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, background: filter === v ? 'rgba(255,255,255,0.12)' : 'transparent', color: filter === v ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s', whiteSpace: 'nowrap' as const }}>
                {l}
              </button>
            ))}
          </div>

          {/* View mode */}
          <div style={{ display: 'flex', gap: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '2px', marginLeft: 'auto' }}>
            {[['retention', '% Retention'], ['sessions', 'Sessions/wk']] .map(([v, l]) => (
              <button key={v} onClick={() => setViewMode(v as typeof viewMode)}
                style={{ padding: '3px 10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, background: viewMode === v ? 'rgba(255,255,255,0.12)' : 'transparent', color: viewMode === v ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s', whiteSpace: 'nowrap' as const }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* ── Metric cards ── */}
        <div style={{ background: '#111927', padding: '16px 16px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: `${window_} Retention (Ent. avg)`, value: `${Math.round((COHORT_DATA.slice(0,3).reduce((s,c) => s + c.retention[window_], 0)) / 3)}%`, delta: `vs SMB ${COHORT_DATA[3].retention[window_]}%`, good: true },
              { label: 'Avg sessions / user / wk', value: '3.7', delta: 'Enterprise avg', good: true },
              { label: 'CRM requests (last 30d)', value: '12', delta: 'from 3 accounts', good: false },
              { label: 'Session-freq. requests', value: '0', delta: 'no direct asks ← key', good: false },
            ].map(m => (
              <div key={m.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', marginBottom: '5px', lineHeight: 1.4 }}>{m.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', lineHeight: 1, fontFamily: 'monospace' }}>{m.value}</div>
                <div style={{ fontFamily: 'monospace', fontSize: '8px', color: m.good ? '#34D399' : 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{m.delta}</div>
              </div>
            ))}
          </div>

          {/* ── Chart label ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
              {window_} {viewMode === 'retention' ? 'RETENTION' : 'AVG SESSIONS / WK'} BY SEGMENT
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.2)' }}>click row to drill down</div>
          </div>

          {/* ── Cohort rows ── */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '2px', marginBottom: '16px' }}>
            {visible.map(c => {
              const val = viewMode === 'retention' ? c.retention[window_] : c.sessions;
              const pct = (val / maxVal) * 100;
              const isExpanded = expanded === c.id;
              const isHovered = hovered === c.id;
              return (
                <div key={c.id}>
                  <motion.div
                    onMouseEnter={() => setHovered(c.id)} onMouseLeave={() => setHovered(null)}
                    onClick={() => setExpanded(isExpanded ? null : c.id)}
                    animate={{ background: isExpanded ? 'rgba(255,255,255,0.07)' : isHovered ? 'rgba(255,255,255,0.04)' : 'transparent' }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 10px', borderRadius: '7px', cursor: 'pointer', transition: 'background 0.15s' }}>

                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: c.color, flexShrink: 0, boxShadow: `0 0 6px ${c.color}60` }} />
                    <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.65)', width: '185px', flexShrink: 0 }}>{c.label}</div>

                    {/* Bar */}
                    <div style={{ flex: 1, position: 'relative' }}>
                      <div style={{ height: '16px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div
                          key={`${c.id}-${window_}-${viewMode}-${filter}`}
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.55, ease: 'easeOut' }}
                          style={{ height: '100%', background: `linear-gradient(90deg, ${c.color}CC, ${c.color})`, borderRadius: '4px', boxShadow: `0 0 8px ${c.color}40` }} />
                      </div>
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          style={{ position: 'absolute', top: '-32px', left: `${Math.min(pct, 85)}%`, transform: 'translateX(-50%)', background: '#0F172A', border: `1px solid ${c.color}60`, borderRadius: '6px', padding: '4px 8px', fontFamily: 'monospace', fontSize: '10px', color: c.color, fontWeight: 700, whiteSpace: 'nowrap' as const, zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                          {viewMode === 'retention' ? `${val}% retained` : `${val} sessions/wk`}
                        </motion.div>
                      )}
                    </div>

                    <div style={{ fontFamily: 'monospace', fontSize: '11px', color: c.color, width: '44px', textAlign: 'right' as const, fontWeight: 700 }}>
                      {viewMode === 'retention' ? `${val}%` : `${val}×`}
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>{isExpanded ? '▲' : '▼'}</div>
                  </motion.div>

                  {/* ── Drill-down row ── */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden', marginLeft: '34px', marginBottom: '4px' }}>
                        <div style={{ padding: '12px 10px 12px', borderLeft: `2px solid ${c.color}40`, marginLeft: '4px', paddingLeft: '14px' }}>
                          <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginBottom: '10px' }}>
                            SESSION FREQUENCY BREAKDOWN — {c.label.split(' ')[0].toUpperCase()}
                          </div>
                          {c.breakdown.map((b, bi) => (
                            <div key={bi} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.5)', width: '140px', flexShrink: 0 }}>{b.label}</div>
                              <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${b.pct}%` }}
                                  transition={{ duration: 0.5, delay: bi * 0.1 }}
                                  style={{ height: '100%', background: `${c.color}80`, borderRadius: '4px' }} />
                              </div>
                              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.4)', width: '28px', textAlign: 'right' as const }}>{b.pct}%</div>
                              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: b.ret >= 80 ? '#34D399' : b.ret >= 60 ? '#F59E0B' : '#EF4444', width: '52px', textAlign: 'right' as const, fontWeight: 700 }}>{b.ret}% ret.</div>
                            </div>
                          ))}
                          <div style={{ marginTop: '8px', padding: '8px 10px', background: 'rgba(52,211,153,0.08)', borderRadius: '6px', border: '1px solid rgba(52,211,153,0.2)', fontSize: '10px', color: '#34D399', lineHeight: 1.6 }}>
                            Users at 4+ sessions/wk retain at 91% regardless of segment. The driver is session frequency — not plan type.
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* ── Insight bar ── */}
          <div style={{ padding: '10px 14px 14px' }}>
            <div style={{ padding: '10px 14px', background: 'rgba(59,130,246,0.08)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.2)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#3B82F6', letterSpacing: '0.1em', marginBottom: '4px' }}>⚡ KEY INSIGHT</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.65 }}>
                Enterprise users average 3.7 sessions/week and retain at {COHORT_DATA.slice(0,3).reduce((s,c) => s + c.retention[window_], 0) / 3 | 0}%. CRM requests: 12 from 3 accounts. Session-frequency requests: <strong style={{ color: '#EF4444' }}>0</strong> — yet it&apos;s the strongest retention driver in the data.
              </div>
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// MOCKUP 2 — Now / Next / Later Roadmap
// ─────────────────────────────────────────
const NNLRoadmap = () => {
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const columns = [
    {
      label: 'NOW', sub: 'This quarter · Committed', color: '#C85A40', bg: 'rgba(200,90,64,0.08)',
      items: [
        { id: 'n1', title: 'Session Scheduling v2', tag: 'Retention', note: 'Salesforce, Zendesk ask' },
        { id: 'n2', title: 'Coaching Progress Reports', tag: 'Expansion', note: 'Infosys CSM request' },
      ],
    },
    {
      label: 'NEXT', sub: 'Next quarter · Planned', color: '#E07A5F', bg: 'rgba(224,122,95,0.08)',
      items: [
        { id: 'nx1', title: 'CRM Sync (read-only)', tag: 'Enterprise', note: 'VP Sales priority' },
        { id: 'nx2', title: 'Manager Analytics Dashboard', tag: 'Expansion', note: 'Zendesk renewal risk' },
      ],
    },
    {
      label: 'LATER', sub: 'H2 · Exploratory', color: '#6B7280', bg: 'rgba(107,114,128,0.06)',
      items: [
        { id: 'l1', title: 'AI Recommendation Engine', tag: 'Innovation', note: 'ML team proposal' },
        { id: 'l2', title: 'Mobile App', tag: 'Reach', note: 'Field request' },
        { id: 'l3', title: 'Peer Benchmarking', tag: 'Expansion', note: 'Exploratory' },
      ],
    },
  ];
  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '13px', overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 20px 56px rgba(0,0,0,0.14)' }}>
        <div style={{ background: `linear-gradient(135deg, rgba(${ACCENT_RGB},0.9) 0%, rgba(79,70,229,0.85) 100%)`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: '0.06em' }}>EdSpark Product Roadmap &middot; Q2 2024 &middot; Now / Next / Later</div>
        </div>
        <div style={{ background: '#FAFAFA', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {columns.map((col, ci) => (
            <div key={col.label} style={{ padding: '18px 16px', borderRight: ci < 2 ? '1px solid #E5E7EB' : 'none' }}>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: col.color, letterSpacing: '0.1em' }}>{col.label}</div>
                <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#9CA3AF', marginTop: '2px' }}>{col.sub}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {col.items.map(item => (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHighlighted(item.id)}
                    onMouseLeave={() => setHighlighted(null)}
                    style={{ background: highlighted === item.id ? col.bg : '#fff', border: `1.5px solid ${highlighted === item.id ? col.color : '#E5E7EB'}`, borderRadius: '8px', padding: '10px 12px', cursor: 'default', transition: 'all 0.15s ease' }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>{item.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: col.color, background: col.bg, padding: '2px 6px', borderRadius: '3px' }}>{item.tag}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '8px', color: '#9CA3AF' }}>{item.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: '#F3F4F6', borderTop: '1px solid #E5E7EB', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#6B7280' }}>AI Recommendation Engine &rarr; LATER. CRM Sync &rarr; NEXT. Session Scheduling &rarr; NOW.</div>
          <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '9px', color: '#9CA3AF' }}>Hover to inspect</div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// MOCKUP 3 — Amplitude: Session Frequency vs Retention
// ─────────────────────────────────────────
const AmplitudeSessionRetention = () => {
  const bars = [
    { label: '0–1 sessions/wk', retention: 34, n: '412 users', color: '#EF4444' },
    { label: '2 sessions/wk',   retention: 61, n: '218 users', color: '#F59E0B' },
    { label: '3 sessions/wk',   retention: 79, n: '156 users', color: '#10B981' },
    { label: '4+ sessions/wk',  retention: 91, n: '87 users',  color: '#3B82F6' },
  ];
  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 28px 72px rgba(0,0,0,0.28)' }}>
        <div style={{ background: '#1B2A47', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.06em' }}>Amplitude &middot; Session Frequency &rarr; 90-Day Retention</div>
          <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>Salesforce cohort &middot; 873 users</div>
        </div>
        <div style={{ background: '#111927', padding: '20px 20px 24px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '16px' }}>90-DAY RETENTION RATE BY WEEKLY SESSION FREQUENCY</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {bars.map(b => (
              <div key={b.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>{b.label}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{b.n}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, height: '20px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${b.retention}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                      style={{ height: '100%', background: b.color, borderRadius: '4px', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}
                    >
                      <span style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: '#fff' }}>{b.retention}%</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', padding: '12px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#10B981', letterSpacing: '0.1em', marginBottom: '4px' }}>LEADING INDICATOR FOUND</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.65 }}>Users who reach 3+ sessions/week in week 1 retain at 79–91%. The Salesforce VP is asking for CRM sync. But the data says: the real unlock is anything that drives session frequency in week 1.</div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// MOCKUP 4 — Opportunity Scoring Matrix
// ─────────────────────────────────────────
const OpportunityMatrix = () => {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const rows = [
    { name: 'Session Scheduling v2',     rice: 72,  opp: 88, strategic: 'HIGH',   status: 'NOW',   riceColor: '#10B981', oppColor: '#10B981', sColor: '#C85A40' },
    { name: 'CRM Sync (read-only)',       rice: 45,  opp: 71, strategic: 'HIGH',   status: 'NEXT',  riceColor: '#F59E0B', oppColor: '#10B981', sColor: '#C85A40' },
    { name: 'Coaching Progress Reports',  rice: 63,  opp: 79, strategic: 'MED',    status: 'NOW',   riceColor: '#10B981', oppColor: '#10B981', sColor: '#F59E0B' },
    { name: 'AI Recommendation Engine',  rice: 120, opp: 38, strategic: 'LOW',    status: 'LATER', riceColor: '#3B82F6', oppColor: '#F59E0B', sColor: '#6B7280' },
    { name: 'Mobile App',                 rice: 31,  opp: 22, strategic: 'LOW',    status: 'LATER', riceColor: '#EF4444', oppColor: '#EF4444', sColor: '#6B7280' },
    { name: 'Peer Benchmarking',          rice: 28,  opp: 31, strategic: 'MED',    status: 'LATER', riceColor: '#EF4444', oppColor: '#EF4444', sColor: '#F59E0B' },
  ];
  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #DFE1E6', boxShadow: '0 20px 56px rgba(0,0,0,0.16)' }}>
        <div style={{ background: '#172B4D', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.06em' }}>EdSpark &middot; Q2 Opportunity Scoring</div>
          <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>RICE + Strategic Alignment</div>
        </div>
        <div style={{ background: '#F4F5F7', borderBottom: '2px solid #DFE1E6', padding: '7px 16px', display: 'flex', gap: '0' }}>
          {[['INITIATIVE', 4], ['RICE', 1], ['OPP SCORE', 1], ['STRATEGIC FIT', 1.5], ['DECISION', 1]].map(([col, flex]) => (
            <div key={col as string} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#5E6C84', letterSpacing: '0.08em', flex: flex as number }}>{col}</div>
          ))}
        </div>
        {rows.map((row, i) => (
          <div
            key={row.name}
            onMouseEnter={() => setActiveRow(i)}
            onMouseLeave={() => setActiveRow(null)}
            style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: activeRow === i ? '#FFFAE6' : i % 2 === 0 ? '#fff' : '#FAFAFA', borderBottom: i < rows.length - 1 ? '1px solid #F0EDE8' : 'none', transition: 'background 0.15s', cursor: 'default', gap: '0' }}
          >
            <div style={{ flex: 4, fontSize: '12px', fontWeight: 500, color: '#172B4D' }}>{row.name}</div>
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, color: row.riceColor }}>{row.rice}</span>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, color: row.oppColor }}>{row.opp}</span>
            </div>
            <div style={{ flex: 1.5 }}>
              <span style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: row.sColor, background: `${row.sColor}18`, padding: '2px 6px', borderRadius: '3px' }}>{row.strategic}</span>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: row.status === 'NOW' ? '#0D7A5A' : row.status === 'NEXT' ? '#C85A40' : '#6B7280', background: row.status === 'NOW' ? 'rgba(13,122,90,0.1)' : row.status === 'NEXT' ? 'rgba(200,90,64,0.1)' : 'rgba(107,114,128,0.1)', padding: '2px 6px', borderRadius: '3px' }}>{row.status}</span>
            </div>
          </div>
        ))}
        <div style={{ background: '#FFF8F0', borderTop: '1px solid #F0EDE8', padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#B45309' }}>AI Recommendation Engine: RICE=120 but Opp Score=38, Strategic Fit=LOW &rarr; high reach, low enterprise alignment &rarr; LATER.</div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// MOCKUP 5 — Decision Memo (Notion-style)
// ─────────────────────────────────────────
const DecisionMemo = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E8E8E8', boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}>
        <div style={{ background: '#F7F6F3', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #E8E8E8' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6B7280', fontWeight: 500 }}>EdSpark Notion &middot; Product &middot; Decision Memos &middot; Q2 2024</div>
        </div>
        <div style={{ background: '#FFFFFF', padding: '28px 32px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: '#C85A40', letterSpacing: '0.2em', marginBottom: '10px' }}>DECISION MEMO</div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '6px', lineHeight: 1.25 }}>AI Recommendation Engine: Deprioritised to H2</div>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#9CA3AF', marginBottom: '24px' }}>Priya Sharma &middot; April 10, 2024 &middot; Shared with: Rohan, ML Team, VP Engineering</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Decision', value: 'Defer to H2 2024', color: '#6B7280' },
              { label: 'Decided by', value: 'Priya + Rohan', color: '#111827' },
              { label: 'RICE Score', value: '120 (highest)', color: '#3B82F6' },
              { label: 'Opp Score', value: '38 (low enterprise fit)', color: '#EF4444' },
            ].map(f => (
              <div key={f.label} style={{ padding: '10px 14px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#9CA3AF', letterSpacing: '0.1em', marginBottom: '4px' }}>{f.label.toUpperCase()}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: f.color }}>{f.value}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: '#374151', letterSpacing: '0.12em', marginBottom: '8px' }}>REASON FOR DEFERRAL</div>
            <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.75 }}>
              The recommendation engine scores highest on RICE (120) due to reach. But EdSpark&apos;s current retention problem is not a discovery problem &mdash; it&apos;s a habit-formation problem. Users who coach at least 3&times;/week retain at 79%. The ML engine doesn&apos;t accelerate that path; session scheduling features do.
            </div>
          </div>

          <button
            onClick={() => setExpanded(e => !e)}
            style={{ fontFamily: 'monospace', fontSize: '9px', color: '#C85A40', background: 'none', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            {expanded ? '▾' : '▸'} {expanded ? 'HIDE' : 'VIEW'} KILL CRITERIA
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ marginTop: '12px', padding: '14px 16px', background: '#FFF8F0', borderRadius: '8px', border: '1px solid rgba(200,90,64,0.2)' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: '#C85A40', marginBottom: '10px', letterSpacing: '0.12em' }}>REVIVE IF ANY OF THESE CHANGE:</div>
                  {[
                    'Enterprise churn falls below 15% without session-scheduling investment',
                    'Salesforce or Zendesk requests AI recommendations in renewal conversation',
                    'Session frequency plateaus despite scheduling improvements',
                    'Competitor ships recommendation feature into our top 3 accounts',
                  ].map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ color: '#C85A40', fontFamily: 'monospace', fontSize: '10px' }}>&#9671;</span>
                      <span style={{ fontSize: '12px', color: '#374151', lineHeight: 1.6 }}>{c}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// MOCKUP 6 — Board Slide
// ─────────────────────────────────────────
const BoardSlide = () => {
  const [activebet, setActivebet] = useState<number | null>(null);
  const bets = [
    { num: 1, title: 'Session Scheduling v2', status: 'FUNDED · Q2', outcome: 'Drive 3+ sessions/week for enterprise users; target 79% retention threshold', investment: '4 engineers · 8 wks', color: '#10B981' },
    { num: 2, title: 'Coaching Progress Reports', status: 'FUNDED · Q2', outcome: 'Unlock $380K expansion pipeline at Infosys; reduce CSM escalations by 40%', investment: '3 engineers · 6 wks', color: '#3B82F6' },
    { num: 3, title: 'AI Recommendation Engine', status: 'DEFERRED · H2', outcome: 'High RICE score but low enterprise alignment; revisit after session frequency baseline established', investment: 'Unfunded this quarter', color: '#9CA3AF' },
  ];
  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #DFE1E6', boxShadow: '0 20px 56px rgba(0,0,0,0.16)' }}>
        <div style={{ background: `linear-gradient(135deg, #1e1b4b 0%, #172554 100%)`, padding: '20px 24px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', marginBottom: '8px' }}>EDSPARK &middot; Q2 BOARD UPDATE &middot; PRODUCT</div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Q2 Product Bets: 2 of 3 Funded</div>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>One bet deferred with explicit kill criteria. Capacity preserved for H2 enterprise initiative.</div>
        </div>
        <div style={{ background: '#F8FAFC', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {bets.map((bet) => (
            <div
              key={bet.num}
              onMouseEnter={() => setActivebet(bet.num)}
              onMouseLeave={() => setActivebet(null)}
              style={{ background: 'var(--ed-card)', borderRadius: '10px', border: `1.5px solid ${activebet === bet.num ? bet.color : '#E5E7EB'}`, padding: '14px 16px', transition: 'border-color 0.15s', cursor: 'default' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: bet.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: '#fff' }}>{bet.num}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{bet.title}</div>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: bet.color, background: `${bet.color}18`, padding: '3px 8px', borderRadius: '4px', flexShrink: 0 }}>{bet.status}</span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#6B7280', lineHeight: 1.65, marginBottom: '6px' }}>{bet.outcome}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#9CA3AF' }}>{bet.investment}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#F1F5F9', borderTop: '1px solid #E5E7EB', padding: '8px 20px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#64748B' }}>Deferred bet has defined kill criteria &mdash; not dropped, not frozen. Hover to inspect bets.</div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export default function Track2Prioritization({
  completedSections = new Set<string>(),
}: {
  completedSections?: Set<string>;
}) {
  return (
    <article style={{ padding: '0 0 80px' }}>

      {/* Hero */}
      <div style={{ padding: '72px 210px 48px 0', marginBottom: '48px', position: 'relative', overflow: 'visible' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-20px', top: '-10px', fontSize: 'clamp(140px, 18vw, 220px)', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.06)`, fontFamily: "'Lora','Georgia',serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>03</div>
        <div style={{ position: 'absolute', right: 0, top: '24px' }}>
          <TrackHeroCard moduleNum="03" moduleLabel="Strategic Prioritisation" trackLabel="Scale Track" accent={ACCENT} parts={PARTS} completedSections={completedSections} />
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: '10px' }}>Module 03 · Scale Track</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: 'var(--ed-ink)', lineHeight: 1.12, letterSpacing: '-0.03em', fontFamily: "'Lora','Georgia',serif", marginBottom: '16px' }}>
          Strategic Prioritisation at Scale
        </h1>
        {para(<>Priya is no longer picking between four backlog items. EdSpark just landed Salesforce, Zendesk, and Infosys. There are 30 items on the roadmap, three competing product bets, and a board deck due Friday. She has capacity for two bets.</>)}

        {/* Characters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '28px' }}>
          {([
            { mentor: 'priya' as const, name: 'Priya', role: 'APM · 2 yrs', accent: 'var(--indigo)' },
            { mentor: 'asha'  as const, name: 'Asha', role: 'AI Mentor', accent: 'var(--teal)' },
            { mentor: 'rohan' as const, name: 'Rohan', role: 'CEO · EdSpark', accent: '#F59E0B' },
            { mentor: 'kiran' as const, name: 'Kiran', role: 'Data Analyst', accent: '#3A86FF' },
          ] as const).map(c => (
            <CharacterChip key={c.mentor} name={c.name} role={c.role} accent={c.accent}>
              <MentorFace mentor={c.mentor} size={52} />
            </CharacterChip>
          ))}
        </div>
      </div>

      {/* ── PART I ── Raw Inputs at Scale */}
      <ChapterSection id="m3-raw-inputs" num="01" accentRgb={ACCENT_RGB} first>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Monday morning. Priya opens Slack. The VP of Sales has sent four messages about CRM integration. The ML team lead has sent a deck: &ldquo;Recommendation Engine — Q2 Proposal.&rdquo; Kiran has pinged a single link to an Amplitude chart with no context. The board deck is due Thursday.
        </SituationCard>
        {h2(<>What goes into a strategic prioritisation</>)}
        {para(<>At the individual contributor level, prioritisation inputs are mostly local: customer requests, support tickets, your own observations. At the APM level the inputs multiply. You are now integrating signals from enterprise CSMs, a VP with quota pressure, a technical team with a roadmap of its own, and a board that wants quarterly commitments. The challenge is not volume — it&apos;s signal quality.</>)}
        {para(<>Every input arrives with a frame already on it. The VP says &ldquo;our top accounts want CRM.&rdquo; That framing — &ldquo;top accounts want&rdquo; — is doing a lot of work. Does want mean &ldquo;would use if built,&rdquo; &ldquo;asked once in a QBR,&rdquo; or &ldquo;will churn if not delivered by June&rdquo;? Those are three completely different prioritisation signals, and they arrive in the same sentence.</>)}
        {pullQuote("The raw input isn't data yet. It's the beginning of a question.")}
        {h2(<>Reading the Amplitude chart Kiran sent</>)}
        {para(<>Kiran sent one link. No explanation. Priya clicks it. The cohort analysis shows that enterprise users who complete three or more coaching sessions per week retain at 81%. Users who complete fewer than two retain at 38%. The CRM integration requests in the data: twelve tickets in the last thirty days, all from three accounts. The session-frequency signal: zero direct requests, but the strongest retention predictor in the data.</>)}
        <AmplitudeCohortDashboard />
        {para(<>This is the classic strategic input gap: the loudest signals in Slack are not the same as the signals that actually drive the outcome you care about. The VP&apos;s CRM request is real. But the Amplitude data is telling a different story about what actually causes retention.</>)}
        <ConversationScene
          mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#3A86FF"
          lines={[
            { speaker: 'priya', text: "You sent me that chart with no context. What am I looking at?" },
            { speaker: 'other', text: "Session frequency. Three-plus sessions a week and you retain at 81%. Below two and you're at 38%." },
            { speaker: 'priya', text: "And nobody's asking for session scheduling improvements. They're asking for CRM." },
            { speaker: 'other', text: "Right. The thing that drives your outcome has no constituency. The thing with a constituency might not drive your outcome." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Strategic inputs aren&apos;t just about what&apos;s loudest. The APM&apos;s job is to find the signal that&apos;s been priced out of the conversation — the one everyone implicitly knows but no stakeholder is directly advocating for.</>}
          expandedContent={<>Every stakeholder is a constituent for something. Sales is a constituent for deals. ML is a constituent for the recommendation engine. Nobody is a constituent for session frequency — it doesn&apos;t map cleanly to anyone&apos;s bonus or project. That&apos;s often where the real signal lives.</>}
          question="Kiran finds that 3+ sessions/week drives 81% retention, but no stakeholder is asking for session scheduling improvements. What does Priya do first?"
          options={[
            { text: "Ship session scheduling because the data is clear", correct: false, feedback: "Moving straight to execution skips the 'why isn't this being asked for?' question, which is important — there might be a barrier you haven't found yet." },
            { text: "Present the data to Rohan and the VP before deciding", correct: false, feedback: "Bringing raw data without a recommendation puts the analysis burden back on the stakeholders. That's abdicating the PM role." },
            { text: "Understand why session frequency is low before prescribing a fix", correct: true, feedback: "Correct. The data shows a correlation, not a cause. Session scheduling might be the fix, or the barrier might be manager buy-in, interface friction, or something else entirely." },
            { text: "Ignore it because stakeholders haven't asked for it", correct: false, feedback: "Stakeholder silence is not a veto. In fact, the most strategically important problems often have no constituency precisely because they're hard to advocate for from the inside." },
          ]}
          conceptId="raw-inputs-m3"
        />
        <QuizEngine
          conceptId="raw-inputs-m3"
          conceptName="Strategic Inputs"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "raw-inputs-m3",
            question: "A VP of Sales says their top accounts 'want CRM integration.' Which is the most useful next question for a PM?",
            options: [
              "A) How many accounts said it?",
              "B) What would change for them if we didn't ship it by Q2?",
              "C) Can the ML team build it quickly?",
              "D) Has a competitor built it?",
            ],
            correctIndex: 1,
            explanation: "Option B surfaces urgency and consequence — the two things that separate a strategic input from a wishlist item. Volume alone (A) doesn't tell you whether this drives churn. Feasibility (C) and competitive parity (D) are secondary questions.",
            keyInsight: "Strategic inputs aren't just about who's asking. They're about what would change — for the user and for the business — if the feature were or weren't shipped.",
          }}
        />
      </ChapterSection>

      {/* ── PART II ── Reframing at Scale */}
      <ChapterSection id="m3-reframe" num="02" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya has the data. She also has thirty items on the backlog and three constituencies pushing in different directions. Her job now is not to pick one — it&apos;s to build a frame that makes the trade-offs legible to everyone.
        </SituationCard>
        {h2(<>RICE is a tool, not a verdict</>)}
        {para(<>The New PM track covers RICE as a prioritisation framework. It&apos;s a good tool for a contained backlog with a single user segment. At scale, RICE breaks down in a specific way: it treats all reach equally. One hundred enterprise users who generate $2M ARR are not the same as one hundred SMB users who generate $80K ARR. A raw RICE score won&apos;t tell you that. You have to overlay it with strategic context.</>)}
        {para(<>This is where the Now/Next/Later framework earns its keep — not as a planning tool, but as a communication tool. &ldquo;Later&rdquo; is not &ldquo;never.&rdquo; It&apos;s &ldquo;not this quarter, and here&apos;s what would change that.&rdquo; That distinction matters enormously when you&apos;re telling an ML team their six-month proposal is deprioritised.</>)}
        {keyBox("RICE at Scale", [
          "Reach: weight by segment value, not just headcount",
          "Impact: tie to the specific outcome metric (retention, expansion, NPS)",
          "Confidence: name the assumption that's doing the most work",
          "Effort: include cross-team dependencies — they're often the real cost",
        ])}
        {h2(<>Building the Now/Next/Later roadmap</>)}
        {para(<>Priya spends two hours building the roadmap. The instinct is to put CRM in Now because the VP is loudest. The data says put Session Scheduling in Now because it drives the retention outcome. The resolution isn&apos;t to ignore the VP — it&apos;s to put CRM in Next with a clear rationale: &ldquo;This is Q3, not Q2, because the session frequency problem is the bigger blocker to retention right now. That changes if any of these three conditions change.&rdquo;</>)}
        <NNLRoadmap />
        {para(<>The Now/Next/Later structure does one thing that a ranked backlog can&apos;t: it makes the logic visible. Anyone reading the roadmap can see not just what&apos;s funded, but why something is Next instead of Now, and what would need to be true for it to move.</>)}
        {pullQuote("A roadmap that can't explain its own cuts isn't a strategy — it's a wishlist with dates on it.")}
        <ConversationScene
          mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="#F59E0B"
          lines={[
            { speaker: 'priya', text: "CRM is in Next, not Now. That's a hard conversation with the VP of Sales." },
            { speaker: 'other', text: "What's the case for it being Now?" },
            { speaker: 'priya', text: "Three accounts asked for it. VP says it's blocking deals." },
            { speaker: 'other', text: "And the case for Session Scheduling being Now?" },
            { speaker: 'priya', text: "Session frequency predicts 81% retention. CRM doesn't appear in the retention model at all." },
            { speaker: 'other', text: "Then you have a case. If the VP pushes back, that's what you show them. Not the roadmap — the data." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Now/Next/Later isn&apos;t about putting things in columns. It&apos;s about making the logic of your bets visible enough that a stakeholder can disagree with the reasoning, not just the outcome.</>}
          expandedContent={<>The most common failure mode is a roadmap where everything is &ldquo;high priority.&rdquo; That&apos;s not prioritisation — that&apos;s a refusal to prioritise. A roadmap is a statement about trade-offs. If it doesn&apos;t make some people unhappy, it isn&apos;t doing its job.</>}
          question="Priya puts CRM in 'Next' instead of 'Now.' The VP of Sales pushes back. What's the strongest response?"
          options={[
            { text: "We can revisit in Q3 once we have more capacity", correct: false, feedback: "This is deferring without explaining. It might delay the argument but doesn't resolve it, and it doesn't give the VP any handle to trust the decision." },
            { text: "Session frequency drives 81% retention; CRM doesn't appear in the model — funding both now splits capacity on the stronger signal", correct: true, feedback: "Correct. This is principled prioritisation: a clear outcome metric, data-backed reasoning, and an explicit statement of what the trade-off actually is." },
            { text: "The board approved this roadmap", correct: false, feedback: "Authority isn't a reason. It ends the conversation without building understanding, and it damages your relationship with the VP." },
            { text: "We'll do a spike on CRM to assess feasibility", correct: false, feedback: "A feasibility spike might be appropriate later, but it's not an answer to the priority question right now." },
          ]}
          conceptId="problem-framing-m3"
        />
        <div className="rv">
          <NowNextLaterOrbits />
        </div>

        <QuizEngine
          conceptId="problem-framing-m3"
          conceptName="Portfolio Framing"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "problem-framing-m3",
            question: "A feature scores RICE=120. Another scores RICE=45. Why might the lower-scoring feature get funded first?",
            options: [
              "A) RICE scores aren't reliable",
              "B) The lower-scoring feature has higher strategic alignment with the current enterprise growth phase",
              "C) The lower-scoring feature is easier to build",
              "D) The team prefers to work on the lower-scoring feature",
            ],
            correctIndex: 1,
            explanation: "RICE measures expected value per unit effort — it doesn't capture strategic alignment. A RICE=45 feature that directly defends a $2M ARR enterprise account can outrank a RICE=120 feature that serves a segment not driving current growth.",
            keyInsight: "RICE is a starting point, not a verdict. Overlay it with strategic alignment scoring to catch what RICE can't see.",
          }}
        />
      </ChapterSection>

      {/* ── PART III ── Data at Scale */}
      <ChapterSection id="m3-data" num="03" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya schedules an hour with Kiran. She wants to understand not just what the session-frequency data shows, but whether it&apos;s causal or correlational — and whether there&apos;s anything actionable in the enterprise cohorts specifically.
        </SituationCard>
        {h2(<>The difference between correlation and a bet</>)}
        {para(<>The Amplitude chart shows a clean correlation: more sessions, better retention. But Priya knows the risk here. High-engagement users might retain better for independent reasons — better managers, more motivated teams, stronger product-market fit in their segment. Shipping session scheduling improvements on the basis of this correlation alone would be a guess dressed up as data.</>)}
        {para(<>What she needs is a plausible mechanism. If session frequency is a leading indicator because it builds habit — managers develop a muscle, reps get comfortable with feedback loops — then anything that reduces scheduling friction in week one should accelerate that habit formation. That&apos;s a testable bet, not just a correlation. The data doesn&apos;t make the decision. It makes the bet legible.</>)}
        <AmplitudeSessionRetention />
        {pullQuote("Data doesn't decide. It changes the quality of the conversation you can have about a decision.")}
        {h2(<>What the enterprise cohorts actually show</>)}
        {para(<>When Kiran breaks the data by enterprise account, a more specific pattern emerges: the Salesforce cohort has the highest session frequency (4.1/week) and the highest retention (87%). But the Salesforce team also has a dedicated CSM who runs weekly check-ins and manually schedules sessions with each rep. The question Priya now has to ask: is the 87% retention because of session frequency, or because of CSM attention? And if it&apos;s CSM attention, is session scheduling the right bet, or is CSM tooling?</>)}
        {para(<>This is what data analysis at the APM level looks like: not just reading the chart, but asking what the chart can&apos;t tell you, and what additional question it opens. Kiran doesn&apos;t have the answer. Neither does Priya. But they now have a better-defined uncertainty — and that&apos;s enough to inform the bet.</>)}
        <ConversationScene
          mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#3A86FF"
          lines={[
            { speaker: 'priya', text: "The Salesforce cohort has 87% retention. Is that session scheduling or CSM hand-holding?" },
            { speaker: 'other', text: "Probably both. We can't cleanly separate them in the current data. We'd need to run a holdout." },
            { speaker: 'priya', text: "We don't have time for a holdout before the board deck." },
            { speaker: 'other', text: "Then you name the uncertainty explicitly. 'We believe session frequency is the mechanism, and here's why — we'll know in 60 days.'" },
            { speaker: 'priya', text: "And if we're wrong?" },
            { speaker: 'other', text: "Then you have kill criteria. That's what a bet is." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>At the APM level, data literacy means knowing what a chart can&apos;t tell you. The Amplitude chart shows correlation. The mechanism — why that correlation holds — is a hypothesis you&apos;re betting on. Make the hypothesis explicit.</>}
          expandedContent={<>The most dangerous data misuse in product is treating a leading indicator as if it were a lagging one. Session frequency predicts retention — it doesn&apos;t cause it. Something else causes both. Your job is to find that upstream cause and act on it. That might be scheduling friction, or it might be manager confidence, or both.</>}
          question="The Salesforce cohort shows 87% retention but Priya can't determine if it's session frequency or CSM attention. What's the right move for the board deck?"
          options={[
            { text: "Don't mention the uncertainty — it will undermine confidence in the recommendation", correct: false, feedback: "Hiding uncertainty from a board is worse than naming it. Boards fund bets, not certainties. If they can't trust your framing of uncertainty, they can't evaluate the bet." },
            { text: "Name the uncertainty, state the hypothesis, and define when you'll know if you're wrong", correct: true, feedback: "Correct. This is what a well-framed bet looks like: a mechanism hypothesis, a 60-day check, and defined kill criteria. Boards respond to disciplined uncertainty better than false precision." },
            { text: "Run a holdout before the board deck to get clean data", correct: false, feedback: "A holdout takes weeks and the board deck is Thursday. This trades the right answer for a missed deadline. Get the best answer you can with what you have, and name the limitation." },
            { text: "Remove session scheduling from the roadmap until you have cleaner data", correct: false, feedback: "Waiting for perfect data before making a bet is itself a decision — to do nothing. The cost of delay is real and should be part of the analysis." },
          ]}
          conceptId="data-vs-requests-m3"
        />
        <div className="rv">
          <CorrelationVsMechanism />
        </div>

        <QuizEngine
          conceptId="data-vs-requests-m3"
          conceptName="Data vs Requests"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "data-vs-requests-m3",
            question: "12 CRM tickets came from 3 enterprise accounts. Session frequency has zero tickets but is the strongest retention predictor. How should Priya weight these signals?",
            options: [
              "A) CRM gets priority — 12 tickets is strong signal volume",
              "B) Session frequency gets priority — it's quantitative over qualitative",
              "C) Session frequency first; CRM tickets warrant investigation into churn risk, not immediate shipping",
              "D) Build both in parallel — enterprise accounts can't wait",
            ],
            correctIndex: 2,
            explanation: "Ticket volume from three accounts is concentrated noise, not broad signal. Session frequency predicts the outcome metric (retention). The right response: prioritise the retention driver, investigate whether CRM is actually a churn risk — those are different questions.",
            keyInsight: "The loudest signal is not the same as the most important signal. Always ask: which signal predicts the outcome metric we care about?",
          }}
        />
      </ChapterSection>

      {/* ── PART IV ── RICE & Opportunity Scoring */}
      <ChapterSection id="m3-rice" num="04" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The ML team&apos;s recommendation engine scores RICE=120 — the highest on the board. Session Scheduling scores RICE=72. CRM scores RICE=45. By raw RICE, the ML team should win. But Priya knows it&apos;s not that simple.
        </SituationCard>
        {h2(<>When RICE scores conflict with strategy</>)}
        {para(<>RICE is a reach-weighted expected value calculation. The recommendation engine scores 120 because it has high projected reach (all EdSpark users), high projected impact (surfaces relevant content), and moderate confidence (the ML team has built similar systems). But the 120 assumes that reach is what matters right now. It doesn&apos;t ask: does this bet serve the segment driving 80% of our ARR?</>)}
        {para(<>Priya builds a second scoring layer: opportunity score. It adds three dimensions RICE doesn&apos;t capture — strategic alignment (does this reinforce the enterprise bet?), segment weighting (is the reach enterprise or SMB?), and dependency risk (how many other teams does this need?). The recommendation engine scores 38 on this dimension. Session Scheduling scores 88.</>)}
        <OpportunityMatrix />
        {h2(<>What the matrix reveals</>)}
        {para(<>The gap between RICE and opportunity score for the recommendation engine is the most useful output of the exercise. It&apos;s not that the ML team is wrong about the product vision — a recommendation engine could eventually be transformative. It&apos;s that the timing is wrong. EdSpark&apos;s current growth phase is enterprise expansion, not feature breadth. A high-RICE bet that doesn&apos;t serve enterprise expansion is a well-executed distraction.</>)}
        {keyBox("Opportunity Score Components", [
          "Strategic alignment: does this bet reinforce the market position we're building right now?",
          "Segment weighting: is the reach concentrated in the segments that drive ARR?",
          "Dependency risk: how many other teams need to be aligned for this to ship?",
          "Kill clarity: can we define conditions under which we stop and know we were wrong?",
        ])}
        {pullQuote("A high RICE score on the wrong strategic phase is a well-resourced mistake.")}
        <ConversationScene
          mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="#F59E0B"
          lines={[
            { speaker: 'priya', text: "The ML team's recommendation engine scores highest on RICE. I'm still putting it in Later." },
            { speaker: 'other', text: "The team won't love that." },
            { speaker: 'priya', text: "I know. But enterprise alignment score is 38. Session Scheduling is 88. We're in an enterprise expansion phase." },
            { speaker: 'other', text: "What do I tell them?" },
            { speaker: 'priya', text: "Tell them the timing is wrong, not the idea. And show them the kill criteria that would bring it back to Now." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>RICE optimises for expected value. Opportunity scoring asks whether that value is relevant to the specific phase of growth you&apos;re in. Both questions matter. Only running one is how you end up with a perfectly prioritised backlog that doesn&apos;t move the company forward.</>}
          expandedContent={<>The recommendation engine scenario is a classic: the idea is good, the timing is wrong. APMs get into trouble when they say &ldquo;bad idea&rdquo; instead of &ldquo;wrong phase.&rdquo; The distinction matters for team morale and for your own mental model. Never confuse &lsquo;not now&rsquo; with &lsquo;not right.&rsquo;</>}
          question="The ML team's recommendation engine scores RICE=120. Priya's opportunity score gives it 38. Which statement correctly resolves the conflict?"
          options={[
            { text: "RICE=120 wins — it's the more rigorous framework", correct: false, feedback: "RICE is rigorous within its scope. Opportunity scoring adds dimensions RICE doesn't cover. Neither is more rigorous — they answer different questions." },
            { text: "Opportunity score wins — strategic alignment is more important than projected impact", correct: false, feedback: "Framing it as one winning is the wrong model. Both scores are inputs. The PM synthesises them into a decision with explicit reasoning." },
            { text: "Both scores are inputs; the decision is: in an enterprise expansion phase, a bet with low enterprise alignment and no clear churn linkage goes to Later regardless of RICE", correct: true, feedback: "Correct. The synthesis is the PM's job. Data doesn't decide — the PM uses the data to make the reasoning legible to the team." },
            { text: "Run both bets in parallel to avoid a conflict with the ML team", correct: false, feedback: "Parallel execution to avoid conflict is conflict avoidance disguised as resource allocation. It compounds the problem: now you've split capacity on a bet that shouldn't be funded this quarter." },
          ]}
          conceptId="rice-framework-m3"
        />
        <QuizEngine
          conceptId="rice-framework-m3"
          conceptName="RICE & Opportunity Scoring"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "rice-framework-m3",
            question: "Which of the following is NOT captured by a standard RICE score?",
            options: [
              "A) How many users will be affected (Reach)",
              "B) How confident the team is in the estimate (Confidence)",
              "C) Whether the bet serves the specific market segment driving ARR growth",
              "D) How much engineering effort the bet requires (Effort)",
            ],
            correctIndex: 2,
            explanation: "RICE treats all reach equally. 1,000 SMB users and 1,000 enterprise users (driving 10× ARR) score identically on Reach. Segment value weighting — whether the reach is in the segment driving current growth — is outside RICE's scope.",
            keyInsight: "Use RICE for expected value, then overlay opportunity scoring for strategic alignment. RICE alone can't tell you if the bet is right for this phase of growth.",
          }}
        />
      </ChapterSection>

      {/* ── PART V ── Making the Call */}
      <ChapterSection id="m3-call" num="05" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya has her recommendation: fund Session Scheduling and Coaching Progress Reports. Defer the recommendation engine to H2. Now she has to tell the ML team lead — who has spent two months on the proposal — and put it in writing.
        </SituationCard>
        {h2(<>The hardest prioritisation skill: saying no to a good idea</>)}
        {para(<>Most PM courses teach you how to prioritise. Few teach you how to communicate a deprioritisation to the people whose work you&apos;re cutting. The ML team didn&apos;t build a bad proposal. They built a good proposal at the wrong time. That distinction — not now vs. not right — is the difference between a conversation that damages trust and one that builds it.</>)}
        {para(<>The decision memo is the tool Priya uses. Not a Slack message. Not a roadmap slide. A written document that states the decision, the reasoning, the RICE and opportunity scores, the specific conditions under which the decision would change, and the name of who made it. The kill criteria are the most important part: they convert &ldquo;later&rdquo; from a vague promise into a commitment with defined conditions.</>)}
        <DecisionMemo />
        {h2(<>Kill criteria are not hedges</>)}
        {para(<>A kill criterion is a specific, observable condition that would change the prioritisation call. &ldquo;We&apos;ll revisit if competitor ships it&rdquo; is not a kill criterion — it&apos;s a hedge. &ldquo;We&apos;ll revisit if session frequency plateaus despite scheduling improvements, or if Salesforce requests recommendations in the renewal conversation&rdquo; is a kill criterion. It&apos;s specific enough that both the PM and the ML team can monitor for it independently.</>)}
        {para(<>The memo also contains the name of who made the call. This is deliberate. Anonymous decisions are resentment generators. When the ML team lead sees &ldquo;Priya + Rohan&rdquo; as the decision owners, they know who to go to if conditions change — and they know the decision was made by people who understood the trade-off, not by a committee that couldn&apos;t agree.</>)}
        {pullQuote("Kill criteria are what separate 'later' from 'never.' They're a promise that the decision can be revisited.")}
        <ConversationScene
          mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#3A86FF"
          lines={[
            { speaker: 'priya', text: "The ML team lead is going to be upset about the deferral." },
            { speaker: 'other', text: "Probably. But you have a memo. That's different from just being told no." },
            { speaker: 'priya', text: "The kill criteria feel like small comfort when your project just got deprioritised." },
            { speaker: 'other', text: "They're not comfort. They're a monitoring contract. The team can watch for those conditions. That's agency, not sympathy." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>The quality of a deprioritisation decision is measured by two things: the clarity of the reasoning, and the specificity of the conditions under which it reverses. Vague deferral is just delayed conflict.</>}
          expandedContent={<>Most teams accept hard decisions better than they accept unexplained ones. &ldquo;We&apos;re not doing it&rdquo; without a rationale invites people to fill the gap with the worst possible explanation. &ldquo;We&apos;re not doing it this quarter because of X, and here&apos;s what would change that&rdquo; gives them a frame they can work with.</>}
          question="The ML team lead pushes back: 'RICE=120 is the highest score. Why isn't it funded?' What's the correct response?"
          options={[
            { text: "Because Rohan made the final call", correct: false, feedback: "Hiding behind authority doesn't build trust. It also makes you look like you didn't own the recommendation." },
            { text: "Because RICE=120 reflects reach, but the recommendation engine has low enterprise alignment and no demonstrated link to the retention outcome we're prioritising this quarter", correct: true, feedback: "Correct. This names the specific dimension where RICE falls short for this bet, in this phase. It's principled, not arbitrary." },
            { text: "Because we don't have the capacity this quarter", correct: false, feedback: "Capacity is often real, but it's not the primary reason here. Leading with capacity instead of strategic reasoning makes the decision look accidental." },
            { text: "Because the board didn't approve it", correct: false, feedback: "The board sees the roadmap, not the individual scoring. And again — authority without reasoning doesn't build trust." },
          ]}
          conceptId="stakeholder-decisions-m3"
        />
        <QuizEngine
          conceptId="stakeholder-decisions-m3"
          conceptName="Stakeholder Decisions"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "stakeholder-decisions-m3",
            question: "Priya writes kill criteria for the deferred recommendation engine. Which is a well-written kill criterion?",
            options: [
              "A) We'll revisit if the team has more bandwidth next quarter",
              "B) We'll revisit if a competitor ships a recommendation feature",
              "C) We'll revisit if session frequency plateaus despite scheduling improvements, or if Salesforce requests recommendations in a renewal conversation",
              "D) We'll revisit when it makes more strategic sense",
            ],
            correctIndex: 2,
            explanation: "Option C is specific, observable, and tied to the reasoning behind the deferral. Bandwidth (A) is never objectively triggerable. Competitor action (B) is too broad — a competitor shipping for a different market segment wouldn't change EdSpark's situation. Option D is a restatement, not a criterion.",
            keyInsight: "A kill criterion must name a specific, observable condition — something you can monitor and know when it's been met. Vague criteria are promises you can never keep.",
          }}
        />
      </ChapterSection>

      {/* ── PART VI ── Stakeholder Communication */}
      <ChapterSection id="m3-stakeholder" num="06" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Thursday. Board deck due in three hours. Priya has the roadmap, the decision memo, and the data. Now she has to compress it into one slide that a board can consume in ninety seconds — and a conversation with the VP of Sales that has to happen before the meeting.
        </SituationCard>
        {h2(<>The VP of Sales conversation</>)}
        {para(<>Priya books a thirty-minute call with the VP before the board meeting. The instinct is to apologise for putting CRM in Next. The better frame: &ldquo;I want to walk you through the Q2 roadmap before you see it in the board deck, because there&apos;s a call in there that affects your team and I want you to understand the reasoning, not just the output.&rdquo;</>)}
        {para(<>The conversation has three parts. First: what the session-frequency data shows and why it&apos;s the primary retention driver. Second: why CRM is in Next — not because it&apos;s unimportant, but because it doesn&apos;t appear in the retention model and session scheduling does. Third: the specific conditions under which CRM would move to Now — primarily, if any of the three accounts indicate it&apos;s a churn or renewal risk.</>)}
        {keyBox("Managing Upward — The Three-Part Frame", [
          "Respect their intelligence: walk them through the data, not just the conclusion",
          "Name the trade-off explicitly: what's being funded, what's being deferred, and why",
          "Give them a monitoring handle: what conditions would change the call, and how they can flag them",
        ])}
        {h2(<>The board slide</>)}
        {para(<>The board gets one slide. It shows three bets: two funded, one deferred. Each bet has a one-line outcome statement, the investment it requires, and its status. The deferred bet includes the phrase &ldquo;defined kill criteria.&rdquo; That phrase does significant work: it signals that &ldquo;later&rdquo; was a deliberate decision with a monitoring mechanism, not a punt.</>)}
        <BoardSlide />
        <ConversationScene
          mentor="rohan" name="Board Chair" role="Board · EdSpark" accent="#F59E0B"
          lines={[
            { speaker: 'other', text: "How will you know if Session Scheduling is working?" },
            { speaker: 'priya', text: "Week-1 session frequency above 3 per user in the Salesforce cohort, within 60 days of launch. That’s the leading indicator. Retention is the lagging one — we’ll see that in 90 days." },
          ]}
        />
        {pullQuote("A board doesn't need to see every row of your spreadsheet. They need to trust your reasoning.")}
        <ConversationScene
          mentor="asha" name="Asha" role="AI Mentor" accent="var(--teal)"
          lines={[
            { speaker: 'priya', text: "The board approved everything. Even the ML deferral — they asked one question about kill criteria and moved on." },
            { speaker: 'other', text: "What question?" },
            { speaker: 'priya', text: "They asked how specific the kill criteria were. I read them out. They nodded." },
            { speaker: 'other', text: "That's because they're not funding ideas. They're funding your judgment. The kill criteria were proof you'd thought about being wrong." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Managing upward is not about getting approval — it&apos;s about giving stakeholders a coherent mental model of the trade-off. If they understand the trade-off, they can live with the outcome. If they only see the outcome, they&apos;ll re-litigate the decision every quarter.</>}
          expandedContent={<>The VP of Sales conversation is high-stakes because it&apos;s the hardest version of stakeholder management: you&apos;re delivering a decision that directly affects their team&apos;s goals and their personal credibility with their accounts. The only thing that makes this conversation go well is showing up with the data, naming the trade-off clearly, and giving them a path to change the decision if conditions change.</>}
          question="After the board meeting, the VP of Sales asks to move CRM to Now in Q3. Which of the following is the right response?"
          options={[
            { text: "Yes — they're a senior stakeholder and you need the relationship", correct: false, feedback: "Agreeing to preserve a relationship without evaluating the actual conditions is relationship-driven prioritisation. It erodes trust faster than saying no — because you'll be back in this conversation every quarter." },
            { text: "Check whether any of the defined kill criteria have been met", correct: true, feedback: "Correct. The kill criteria exist precisely for this moment. If CRM meets one of the conditions — a Salesforce renewal risk, a competitor move into the enterprise segment — it moves to Now. If not, the reasoning hasn't changed." },
            { text: "Escalate to Rohan and let him decide", correct: false, feedback: "Escalating without a recommendation is abdicating the role. Your job is to come with a position and defend it, not to pass the conversation upward." },
            { text: "Agree to scope down CRM to a lightweight version that can ship in Q3", correct: false, feedback: "Scoping down to accommodate pressure — without checking whether the conditions have changed — is still letting the conversation override the framework. A scoped-down version doesn't change whether the bet is strategically aligned." },
          ]}
          conceptId="stakeholder-decisions-m3"
        />
        <div className="rv">
          <KillCriteriaMonitor />
        </div>

        <QuizEngine
          conceptId="stakeholder-decisions-m3"
          conceptName="Stakeholder Communication"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "stakeholder-decisions-m3",
            question: "The board chair asks: 'Why is the AI recommendation engine deferred?' What's the strongest one-sentence answer?",
            options: [
              "A) It has the highest RICE score but the lowest enterprise alignment score, and we're in an enterprise expansion phase",
              "B) The ML team needs more time to refine the proposal",
              "C) Session Scheduling is more important",
              "D) It's a good idea but the timing isn't right yet",
            ],
            correctIndex: 0,
            explanation: "Option A names the framework used (RICE + opportunity score), the specific tension (high reach vs. low enterprise fit), and the strategic context (enterprise expansion phase). Options B–D are either vague, blame-shifting, or conclusions without reasoning.",
            keyInsight: "Board answers need to compress full reasoning into one sentence: framework used + specific tension + strategic context. That's what builds long-term trust in your judgment.",
          }}
        />
      </ChapterSection>

      {/* ── PART VII ── Reflection */}
      <ChapterSection id="m3-reflection" num="07" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Two weeks after the board meeting. Session Scheduling v2 is in sprint. The ML team is watching their kill criteria. The VP of Sales checked in once — Priya showed her the week-1 session frequency chart for the Salesforce cohort and she didn&apos;t follow up. The roadmap is holding.
        </SituationCard>
        {h2(<>What APM-level prioritisation actually is</>)}
        {para(<>The New PM track covers a question: how do I pick what to work on next? The APM track covers a harder question: how do I build a system that makes prioritisation decisions legible, revisable, and defensible — across a 30-item backlog, three stakeholder groups, and a board that expects quarterly accountability?</>)}
        {para(<>The system Priya used isn&apos;t complex. It&apos;s a cohort analysis, an opportunity scoring matrix, a Now/Next/Later roadmap, a decision memo with kill criteria, and a conversation she had with the VP before the board meeting. None of those tools are hard. The hard part is doing all of them consistently, in sequence, instead of jumping from input to decision without building the intermediate artefacts.</>)}
        {keyBox("The APM Prioritisation System", [
          "Read raw inputs with a frame: who is the constituency, what outcome are they actually protecting?",
          "Run RICE for expected value, then run opportunity scoring for strategic alignment",
          "Build Now/Next/Later to make the logic of trade-offs visible, not just the decisions",
          "Write decision memos with kill criteria for anything deprioritised — 'later' needs a trigger",
          "Have the stakeholder conversation before the meeting, not during it",
        ])}
        {h2(<>The thing Priya got right</>)}
        {para(<>Priya didn&apos;t get the CRM question right because she had better data than the VP. She got it right because she asked a different question. The VP asked &ldquo;what do top accounts want?&rdquo; Priya asked &ldquo;what drives retention for top accounts?&rdquo; Same accounts, different question. The difference between those two questions is the difference between a PM who manages requests and a PM who manages outcomes.</>)}
        {pullQuote("The PM who manages outcomes is always doing a different job than the one who manages requests — even when they're working on the same product.")}
        <ConversationScene
          mentor="asha" name="Asha" role="AI Mentor" accent="var(--teal)"
          lines={[
            { speaker: 'priya', text: "Two weeks in. Session scheduling is in sprint. The board isn't asking about CRM. The VP checked in once and then stopped." },
            { speaker: 'other', text: "What made the difference?" },
            { speaker: 'priya', text: "The kill criteria, I think. Once she saw that CRM wasn't dropped — just conditional — she had a handle on it." },
            { speaker: 'other', text: "The kill criteria did something else too. They told the VP exactly what she'd need to show you to change the decision. That's a much healthier conversation than 'it's in Next, trust me.'" },
            { speaker: 'priya', text: "So the memo was as much for her as for the ML team." },
            { speaker: 'other', text: "Every deprioritisation memo is for three audiences: the team whose work you cut, the stakeholder whose ask you deferred, and your future self who will have to defend the call in six months." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Strategic prioritisation at scale isn&apos;t about having a better framework. It&apos;s about doing the intermediate work — cohort analysis, opportunity scoring, kill criteria — that most PMs skip because they&apos;re in a hurry to get to the decision.</>}
          expandedContent={<>The hardest thing about APM-level prioritisation is that the work that matters most is the work that&apos;s invisible to stakeholders: the hour Priya spent with Kiran on the cohort data, the opportunity scoring matrix no one asked for, the VP conversation that happened before the board meeting. Decisions look easy when you&apos;ve done that work. They look hard when you haven&apos;t.</>}
          question="Priya reflects on why the Q2 roadmap held under pressure. What was the most important factor?"
          options={[
            { text: "She had better data than the other stakeholders", correct: false, feedback: "The VP had access to the same Amplitude data. The difference wasn't data access — it was the question she asked of the data." },
            { text: "She did the intermediate work (cohort analysis, opportunity scoring, kill criteria) that made the decisions legible and defensible", correct: true, feedback: "Correct. The roadmap held because every stakeholder could see the reasoning, not just the conclusion. That's what the intermediate artefacts create: a shared understanding of the trade-off." },
            { text: "Rohan backed her in the board meeting", correct: false, feedback: "Rohan's support helped, but it was downstream of Priya's preparation. If the reasoning hadn't been solid, Rohan's backing wouldn't have mattered for long." },
            { text: "She used the Now/Next/Later framework, which is inherently credible with boards", correct: false, feedback: "The framework is a tool. A poorly reasoned Now/Next/Later is just a poorly reasoned roadmap in a different format. The credibility comes from the quality of reasoning, not the format." },
          ]}
          conceptId="prioritization-summary-m3"
        />
        <QuizEngine
          conceptId="prioritization-summary-m3"
          conceptName="Prioritisation at Scale"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "prioritization-summary-m3",
            question: "Which statement best describes the difference between a PM who manages requests and a PM who manages outcomes?",
            options: [
              "A) The outcomes PM says no more often",
              "B) The outcomes PM asks what drives the metric, not just what stakeholders are asking for",
              "C) The outcomes PM uses more frameworks",
              "D) The outcomes PM has stronger stakeholder relationships",
            ],
            correctIndex: 1,
            explanation: "The VP asked 'what do top accounts want?' Priya asked 'what drives retention for top accounts?' Same accounts — completely different investigation. That reframe, from request-tracking to outcome-driving, is the core APM competency.",
            keyInsight: "Managing outcomes means you start with the metric you're trying to move, then work backwards to what causes it — not forwards from what stakeholders are asking for.",
          }}
        />
        <ApplyItBox prompt="Pick one feature request on your roadmap that has a strong advocate. Build an opportunity score for it: RICE score, strategic alignment (1–5), segment weighting (enterprise vs. SMB), dependency risk. Does it belong in Now, Next, or Later? Write the one-sentence rationale you would give a board member." />
        <NextChapterTeaser text="Next: UX & Design Collaboration — turning a prioritised problem into something users can actually react to." />
      </ChapterSection>

    </article>
  );
}

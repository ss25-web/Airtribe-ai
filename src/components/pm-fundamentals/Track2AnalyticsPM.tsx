'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  glassCard, demoLabel, h2, para, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, ApplyItBox,
  TiltCard, ConversationScene, PMPrincipleBox,
} from './designSystem';
import { MentorFace } from './MentorFaces';
import QuizEngine from '../QuizEngine';
import {
  FunnelDecomposer,
  ProductChangeSimulator,
  AccountHealthExplorer,
  ExperimentConsequenceEngine,
} from './AnalyticsTools';

const ACCENT     = '#158158';
const ACCENT_RGB = '21,129,88';
const MODULE_NUM = '07';
const MODULE_LABEL = 'Analytics & Metrics';
const MODULE_CONTEXT = `Module 07 of Airtribe PM Fundamentals — Scale Track. Follows Priya Sharma, established PM at EdSpark (B2B SaaS for sales coaching). Covers metric systems as strategy, measurement architecture, advanced funnel decomposition, cohort vs local improvement, B2B account health, and experiment interpretation under stakeholder pressure.`;

const PARTS = [
  { num: '01', id: 'm7-dashboard',       label: 'Healthy According to What?' },
  { num: '02', id: 'm7-north-star',      label: 'Metric Architecture, Not Just One Metric' },
  { num: '03', id: 'm7-success-metrics', label: 'Three Problems in One Funnel Shape' },
  { num: '04', id: 'm7-funnel',          label: 'Improving the Moment vs the System' },
  { num: '05', id: 'm7-cohorts',         label: 'The Account-Level Dashboard' },
  { num: '06', id: 'm7-b2b',            label: 'Statistically Positive, Strategically Incomplete' },
  { num: '07', id: 'm7-experiments',     label: 'A Better Lens on Reality' },
];

// ─────────────────────────────────────────
// TOOL · METRIC SYSTEM ARCHITECT (Part 2)
// ─────────────────────────────────────────
const NS_POOL = [
  { id: 'dau',        label: 'Daily Active Users',      quality: 'weak',   warning: 'Can rise from habit or notification gaming — not necessarily from value.' },
  { id: 'time_spent', label: 'Time Spent',               quality: 'weak',   warning: 'Improves with friction. A confused user spends more time than a successful one.' },
  { id: 'completion', label: 'Review Completion Rate',   quality: 'strong', warning: null },
  { id: 'signups',    label: 'New Signups',              quality: 'weak',   warning: 'Acquisition, not value. Users can sign up and immediately churn.' },
  { id: 'nrr',        label: 'Net Revenue Retention',    quality: 'strong', warning: null },
  { id: 'activation', label: 'Account Activation Rate',  quality: 'strong', warning: null },
];

const GUARDRAIL_POOL = [
  { id: 'retention',  label: '7-Day Retention',       type: 'leading',  critical: true  },
  { id: 'churn',      label: 'Account Churn Rate',    type: 'lagging',  critical: true  },
  { id: 'nps',        label: 'NPS Score',             type: 'lagging',  critical: false },
  { id: 'support',    label: 'Support Ticket Rate',   type: 'leading',  critical: false },
  { id: 'activation', label: 'Seat Activation',       type: 'leading',  critical: true  },
];

const SEGMENT_POOL = [
  { id: 'plan',    label: 'By Plan Type (SMB / Enterprise)' },
  { id: 'source',  label: 'By Acquisition Source' },
  { id: 'cohort',  label: 'By Signup Cohort Month' },
  { id: 'role',    label: 'By User Role (Admin / End User)' },
  { id: 'feature', label: 'By First Feature Used' },
];

const CADENCES = [
  { id: 'daily',   label: 'Daily',   fit: 'too-fast', note: 'Daily reviews of lagging metrics create noise, not insight.' },
  { id: 'weekly',  label: 'Weekly',  fit: 'good',     note: 'Right cadence for leading indicators and product metrics.' },
  { id: 'monthly', label: 'Monthly', fit: 'ok',       note: 'Good for lagging metrics and business health — too slow for product decisions.' },
  { id: 'quarterly', label: 'Quarterly', fit: 'too-slow', note: 'Organizational metrics only. Too slow to drive product decisions.' },
];

type ArchHealth = 'empty' | 'fragile' | 'partial' | 'strong';

function computeHealth(ns: string | null, guardrails: string[], segments: string[], cadence: string | null): { score: number; level: ArchHealth; warnings: string[] } {
  const warnings: string[] = [];
  let score = 0;

  const nsItem = NS_POOL.find(n => n.id === ns);
  if (!ns) { warnings.push('No north star selected — what is the team optimizing for?'); }
  else if (nsItem?.quality === 'weak') { warnings.push(`"${nsItem.label}" is a weak north star — it can improve without user value improving.`); score += 10; }
  else { score += 30; }

  if (guardrails.length === 0) { warnings.push('No guardrails — the north star can improve via harmful means with no protection.'); }
  else if (guardrails.length === 1) { warnings.push('Only 1 guardrail — architecture is fragile. Add at least one more.'); score += 10; }
  else { score += 25; }

  const hasLeading = guardrails.some(g => GUARDRAIL_POOL.find(x => x.id === g)?.type === 'leading');
  const hasLagging = guardrails.some(g => GUARDRAIL_POOL.find(x => x.id === g)?.type === 'lagging');
  if (guardrails.length >= 2 && !hasLeading) { warnings.push('All guardrails are lagging — you\'ll learn about problems months after they start.'); }
  else if (guardrails.length >= 2 && hasLeading && hasLagging) { score += 15; }

  if (segments.length === 0) { warnings.push('No segments defined — different user types may behave completely differently and you won\'t see it.'); }
  else { score += 20; }

  if (!cadence) { warnings.push('No review cadence — without rhythm, metrics become reports rather than decision tools.'); }
  else {
    const c = CADENCES.find(x => x.id === cadence);
    if (c?.fit === 'too-fast') { warnings.push(`${c.label} reviews create noise. Try Weekly for product metrics.`); score += 5; }
    else if (c?.fit === 'too-slow') { warnings.push(`${c.label} reviews are too slow for product decisions.`); score += 5; }
    else { score += 10; }
  }

  const level: ArchHealth = score >= 90 ? 'strong' : score >= 60 ? 'partial' : score >= 20 ? 'fragile' : 'empty';
  return { score, level, warnings };
}

const healthColor = (l: ArchHealth) => l === 'strong' ? '#059669' : l === 'partial' ? '#E67E22' : '#dc2626';

function MetricSystemArchitect() {
  const [ns, setNs] = useState<string | null>(null);
  const [guardrails, setGuardrails] = useState<string[]>([]);
  const [segments, setSegments] = useState<string[]>([]);
  const [cadence, setCadence] = useState<string | null>(null);
  const [simRunning, setSimRunning] = useState(false);
  const [simStep, setSimStep] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { score, level, warnings } = computeHealth(ns, guardrails, segments, cadence);
  const healthPct = Math.min(100, score);

  const toggleGuardrail = (id: string) => setGuardrails(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSegment = (id: string) => setSegments(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const SIM_EVENTS_STRONG = [
    { event: 'Week 1 — Team asks: "Did activation improve?" Metric system gives a clear answer by segment.', good: true },
    { event: 'Week 3 — Guardrail catches: completion improved in SMB but dropped 4pp in Enterprise. Team investigates before shipping broadly.', good: true },
    { event: 'Week 6 — Review cadence triggers cross-functional sync. CS, Product, and Revenue see the same data framed for their context.', good: true },
    { event: 'Quarter end — Architecture reveals: north star improved, guardrails stable, enterprise segment recovered. Org aligned on what "healthy" means.', good: true },
  ];
  const SIM_EVENTS_WEAK = [
    { event: 'Week 1 — DAU is up 9%. Team celebrates. Nobody checks what behavior actually changed.', good: false },
    { event: 'Week 3 — Push notifications inflated daily returns. Completion rate quietly declined 5%. No guardrail caught it.', good: false },
    { event: 'Week 6 — CS flags that enterprise accounts feel "busier but not better." Product team has no metric to evaluate this claim.', good: false },
    { event: 'Quarter end — North star looks great. Three at-risk accounts discovered only when CS escalates. Measurement system missed it entirely.', good: false },
  ];

  const events = level === 'strong' ? SIM_EVENTS_STRONG : SIM_EVENTS_WEAK;
  const canSimulate = ns !== null && guardrails.length >= 1;

  const runSim = () => { setSimRunning(true); setSimStep(0); };
  useEffect(() => {
    if (!simRunning) return;
    if (simStep < events.length - 1) { timerRef.current = setTimeout(() => setSimStep(s => s + 1), 1400); }
    else { setSimRunning(false); }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [simRunning, simStep, events.length]);

  const reset = () => { setNs(null); setGuardrails([]); setSegments([]); setCadence(null); setSimRunning(false); setSimStep(-1); };

  return (
    <div style={{ background: 'var(--ed-card)', borderRadius: '16px', boxShadow: '0 6px 32px rgba(0,0,0,0.12)', overflow: 'hidden', margin: '32px 0', border: `1.5px solid ${ACCENT}35` }}>
      <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${ACCENT}28 0%, ${ACCENT}14 100%)`, borderBottom: `1.5px solid ${ACCENT}30`, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${ACCENT}30`, border: `1.5px solid ${ACCENT}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏗️</div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', color: ACCENT, textTransform: 'uppercase' as const }}>Metric System Architect</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Build the measurement architecture. Watch warnings fire as fragile choices appear — then simulate a quarter.</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' as const }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, fontSize: '22px', color: healthColor(level) }}>{healthPct}%</div>
          <div style={{ fontSize: '10px', color: healthColor(level), fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{level}</div>
        </div>
      </div>

      {simStep < 0 ? (
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
            {/* North star */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>NORTH STAR — pick one</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                {NS_POOL.map(n => {
                  const isSelected = ns === n.id;
                  return (
                    <motion.div key={n.id} whileHover={{ x: 3 }} onClick={() => setNs(isSelected ? null : n.id)}
                      style={{ padding: '9px 14px', borderRadius: '8px', cursor: 'pointer', background: isSelected ? `${ACCENT}15` : 'var(--ed-card)', border: `1.5px solid ${isSelected ? ACCENT : n.quality === 'weak' && isSelected ? '#dc2626' : 'var(--ed-rule)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s' }}>
                      <span style={{ fontSize: '12px', fontWeight: isSelected ? 700 : 400, color: 'var(--ed-ink)' }}>{n.label}</span>
                      {isSelected && <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: n.quality === 'strong' ? `rgba(${ACCENT_RGB},0.15)` : 'rgba(220,38,38,0.12)', color: n.quality === 'strong' ? ACCENT : '#dc2626' }}>{n.quality === 'strong' ? '✓ Strong' : '⚠ Weak'}</span>}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Segments */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>KEY SEGMENTS — select at least one</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
                {SEGMENT_POOL.map(s => (
                  <motion.div key={s.id} whileHover={{ x: 3 }} onClick={() => toggleSegment(s.id)}
                    style={{ padding: '8px 12px', borderRadius: '7px', cursor: 'pointer', background: segments.includes(s.id) ? `${ACCENT}12` : 'var(--ed-card)', border: `1.5px solid ${segments.includes(s.id) ? ACCENT : 'var(--ed-rule)'}`, fontSize: '12px', color: 'var(--ed-ink)', transition: 'all 0.15s', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: segments.includes(s.id) ? ACCENT : 'var(--ed-rule)', fontWeight: 700, flexShrink: 0 }}>{segments.includes(s.id) ? '✓' : '○'}</span>
                    {s.label}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
            {/* Guardrails */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>GUARDRAILS — 2–3 recommended</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
                {GUARDRAIL_POOL.map(g => (
                  <motion.div key={g.id} whileHover={{ x: 3 }} onClick={() => toggleGuardrail(g.id)}
                    style={{ padding: '8px 12px', borderRadius: '7px', cursor: 'pointer', background: guardrails.includes(g.id) ? 'rgba(230,126,34,0.1)' : 'var(--ed-card)', border: `1.5px solid ${guardrails.includes(g.id) ? '#E67E22' : 'var(--ed-rule)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s' }}>
                    <span style={{ fontSize: '12px', color: 'var(--ed-ink)' }}>{g.label}</span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: g.type === 'leading' ? 'rgba(58,134,255,0.15)' : 'rgba(100,116,139,0.15)', color: g.type === 'leading' ? '#3A86FF' : '#64748b', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{g.type}</span>
                      {guardrails.includes(g.id) && <span style={{ color: '#E67E22', fontWeight: 700, fontSize: '12px' }}>✓</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Review cadence */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>REVIEW CADENCE</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                {CADENCES.map(c => (
                  <motion.button key={c.id} whileHover={{ y: -1 }} onClick={() => setCadence(cadence === c.id ? null : c.id)}
                    style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${cadence === c.id ? ACCENT : 'var(--ed-rule)'}`, background: cadence === c.id ? `${ACCENT}15` : 'var(--ed-card)', color: cadence === c.id ? ACCENT : 'var(--ed-ink3)', transition: 'all 0.15s' }}>
                    {c.label}
                  </motion.button>
                ))}
              </div>
              {cadence && (
                <div style={{ marginTop: '6px', fontSize: '11px', color: CADENCES.find(c => c.id === cadence)?.fit === 'good' ? ACCENT : '#E67E22', lineHeight: 1.5 }}>
                  {CADENCES.find(c => c.id === cadence)?.note}
                </div>
              )}
            </div>

            {/* Live health bar */}
            <div style={{ padding: '14px 16px', borderRadius: '10px', background: `${healthColor(level)}12`, border: `1.5px solid ${healthColor(level)}40` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: healthColor(level), fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>ARCHITECTURE HEALTH</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: '14px', color: healthColor(level) }}>{healthPct}%</div>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'var(--ed-rule)', overflow: 'hidden', marginBottom: '10px' }}>
                <motion.div animate={{ width: `${healthPct}%` }} transition={{ duration: 0.4 }} style={{ height: '100%', borderRadius: '4px', background: healthColor(level) }} />
              </div>
              {warnings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
                  {warnings.map((w, i) => (
                    <div key={i} style={{ fontSize: '11px', color: '#dc2626', lineHeight: 1.5, display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                      <span style={{ flexShrink: 0, marginTop: '1px' }}>⚠</span>{w}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '11px', color: ACCENT, fontWeight: 600 }}>✓ Architecture is strong. Ready to simulate.</div>
              )}
            </div>

            {canSimulate && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }} onClick={runSim}
                style={{ padding: '12px', borderRadius: '10px', background: level === 'strong' ? ACCENT : '#E67E22', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                ▶ Simulate Quarter with this architecture
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', padding: '12px 16px', borderRadius: '8px', background: level === 'strong' ? `rgba(${ACCENT_RGB},0.1)` : 'rgba(220,38,38,0.08)', border: `1.5px solid ${healthColor(level)}40` }}>
            <span style={{ fontSize: '16px' }}>{level === 'strong' ? '✓' : '⚠'}</span>
            <div style={{ fontWeight: 700, fontSize: '13px', color: healthColor(level) }}>
              {level === 'strong' ? 'Strong architecture — simulating well-instrumented quarter' : `${level.charAt(0).toUpperCase() + level.slice(1)} architecture — simulating what this system misses`}
            </div>
          </div>
          <div style={{ position: 'relative' as const, paddingLeft: '24px' }}>
            <div style={{ position: 'absolute' as const, left: '8px', top: 0, bottom: 0, width: '2px', background: 'var(--ed-rule)', borderRadius: '1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
              {events.slice(0, simStep + 1).map((e, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  style={{ position: 'relative' as const }}>
                  <div style={{ position: 'absolute' as const, left: '-20px', top: '12px', width: '12px', height: '12px', borderRadius: '50%', background: e.good ? ACCENT : '#dc2626', border: '2px solid var(--ed-card)', boxShadow: `0 0 0 2px ${e.good ? ACCENT : '#dc2626'}40` }} />
                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--ed-card)', border: `1.5px solid ${e.good ? `rgba(${ACCENT_RGB},0.3)` : 'rgba(220,38,38,0.25)'}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: '12px', color: e.good ? 'var(--ed-ink2)' : '#dc2626', lineHeight: 1.6, fontWeight: e.good ? 400 : 600 }}>{e.event}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {!simRunning && simStep >= events.length - 1 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '16px' }}>
              <div style={{ padding: '14px 16px', borderRadius: '10px', background: level === 'strong' ? `rgba(${ACCENT_RGB},0.08)` : 'rgba(220,38,38,0.06)', border: `1.5px solid ${healthColor(level)}40`, marginBottom: '10px', fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.65 }}>
                {level === 'strong'
                  ? 'A strong metric architecture made the invisible visible: the right segments surfaced early, guardrails caught harmful optimization, and the review cadence kept everyone looking at the same reality.'
                  : 'A weak metric system let the organization feel confident while missing real problems. The north star moved. The product didn\'t get better in the ways that matter.'}
              </div>
              <button onClick={reset} style={{ width: '100%', padding: '9px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', color: 'var(--ed-ink3)', fontSize: '12px', cursor: 'pointer' }}>
                ↺ Rebuild the architecture
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// EXPORT DEFAULT
// ─────────────────────────────────────────
export default function Track2AnalyticsPM({
  completedSections = new Set<string>(),
}: {
  completedSections?: Set<string>;
}) {
  const donePct  = Math.round((completedSections.size / PARTS.length) * 100);
  const nextPart = PARTS.find(p => !completedSections.has(p.id));

  return (
    <article style={{ padding: '0 0 80px' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', padding: '72px 0 48px', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-20px', top: '-10px', fontSize: 'clamp(140px,18vw,220px)', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.06)`, fontFamily: "'Lora',Georgia,serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>{MODULE_NUM}</div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '14px', textTransform: 'uppercase' as const }}>
              PM Fundamentals &middot; Module {MODULE_NUM} &middot; Scale Track
            </div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '16px', fontFamily: "'Lora',Georgia,serif" }}>
              {MODULE_LABEL}
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ed-ink2)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '560px' }}>
              You already know what a funnel is. This module is about the moments where metrics stop being reporting tools and start becoming strategy systems — where what you measure shapes what the company believes, prioritizes, and ships.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '40px' }}>
              {([
                { mentor: 'priya' as const, accent: ACCENT,    name: 'Priya',  role: 'PM · EdSpark',       desc: 'No longer asking what a funnel is. Now learning what it means when metrics carry strategic weight.' },
                { mentor: 'kiran' as const, accent: '#3A86FF', name: 'Kiran',  role: 'Data Analyst',       desc: 'The person most likely to interrupt a confident conclusion with "according to what?"' },
                { mentor: 'asha'  as const, accent: '#0097A7', name: 'Asha',   role: 'PM Mentor',          desc: 'Pushes Priya from metric tracking to measurement design.' },
                { mentor: 'rohan' as const, accent: '#E67E22', name: 'Rohit',  role: 'Growth Lead',        desc: 'Pushes for momentum. Sometimes wants the win faster than the evidence supports.' },
                { mentor: 'maya'  as const, accent: '#C85A40', name: 'Sonal',  role: 'Customer Success',   desc: 'Brings account-level reality — renewals, adoption depth, and churn signals.' },
              ]).map(c => (
                <div key={c.mentor + c.name} style={{ background: `${c.accent}0D`, border: `1px solid ${c.accent}33`, borderRadius: '10px', padding: '14px 16px', minWidth: '140px', flex: '1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <MentorFace mentor={c.mentor} size={40} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: c.accent, lineHeight: 1.2 }}>{c.name}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.04em' }}>{c.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{c.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', borderLeft: `4px solid ${ACCENT}`, border: '1px solid var(--ed-rule)', borderLeftWidth: '4px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>What you&apos;ll be able to do</div>
              {[
                'Design a metric architecture — not just pick a north star — that survives organizational pressure and ambiguity',
                'Decompose funnel drops into their underlying failure modes before jumping to a solution',
                'Read experiments as strategic evidence rather than verdicts, and communicate the tradeoffs that matter',
              ].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 2 ? '10px' : 0, alignItems: 'flex-start' }}>
                  <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '12px', marginTop: '2px' }}>0{i + 1}</span>
                  <span style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dark module card */}
          <div style={{ flexShrink: 0, width: '168px', paddingTop: '48px' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="float3d" style={{ transformStyle: 'preserve-3d' }}>
                <div style={{ background: 'linear-gradient(145deg, #0A1A0F 0%, #0D2418 100%)', borderRadius: '14px', padding: '20px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE {MODULE_NUM} · SCALE</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora',serif", lineHeight: 1.25, marginBottom: '4px' }}>{MODULE_LABEL}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(240,232,216,0.45)', marginBottom: '16px' }}>Scale Track</div>
                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
                    <motion.div animate={{ width: `${donePct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ height: '100%', background: ACCENT, borderRadius: '1px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                    {PARTS.map(p => {
                      const done = completedSections.has(p.id);
                      const isNext = p.id === nextPart?.id;
                      return (
                        <div key={p.num} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, background: done ? ACCENT : isNext ? ACCENT : 'rgba(255,255,255,0.06)', border: `1px solid ${done ? ACCENT : isNext ? ACCENT : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: done || isNext ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, opacity: done ? 0.7 : 1 }}>
                            {done ? '✓' : p.num}
                          </div>
                          <div style={{ fontSize: '9px', color: done ? 'rgba(240,232,216,0.4)' : isNext ? 'rgba(240,232,216,0.9)' : 'rgba(240,232,216,0.25)', lineHeight: 1.3, flex: 1 }}>
                            {p.label.split(' ').slice(0, 4).join(' ')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: '16px', padding: '8px 10px', borderRadius: '6px', background: `${ACCENT}22`, border: `1px solid ${ACCENT}44` }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: ACCENT, fontWeight: 700, marginBottom: '2px' }}>{donePct === 100 ? 'COMPLETE' : 'NEXT UP'}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(240,232,216,0.6)' }}>{donePct === 100 ? 'All 7 parts done' : nextPart ? nextPart.label.split(' ').slice(0, 4).join(' ') : 'Healthy According to What?'}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── PART 1 ── */}
      <ChapterSection id="m7-dashboard" num="01" accentRgb={ACCENT_RGB} first>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The quarter review begins the way many do: charts that look just healthy enough for everyone to relax. Activation has held. Usage is stable. A few growth charts are positive. Rohit opens with confidence. <strong>&ldquo;Top-of-funnel is finally moving.&rdquo;</strong> Meera is less convinced. <strong>&ldquo;Top-of-funnel is not the same as product health.&rdquo;</strong> Sonal: <strong>&ldquo;Some of the newer institutional accounts still don&apos;t feel durable.&rdquo;</strong> Dev: <strong>&ldquo;A few usage events changed definition after the instrumentation cleanup.&rdquo;</strong> Priya watches the conversation split. Then she hears herself ask the question before she fully realizes she is asking it: <strong>&ldquo;Healthy according to what?&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#3A86FF"
          lines={[
            { speaker: 'other', text: "That's the right question. And the room can't answer it — because the company hasn't agreed on what 'health' is supposed to mean here." },
            { speaker: 'priya', text: "Is it signups? Activation? Retention? Account expansion?" },
            { speaker: 'other', text: "All of those are defensible. That's the problem. A weak metric system lets all of them coexist without forcing clarity." },
            { speaker: 'priya', text: "So the problem isn't the data. It's the architecture underneath it." },
            { speaker: 'other', text: "Metric systems are strategy systems in disguise. What you measure is what the company believes is working." },
          ]}
        />

        {h2(<>When metric systems fail, strategy can look stronger than reality</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('The gap between activity and health', ACCENT)}
          {keyBox('What weak metric systems allow', [
            'Every team brings a chart that supports their view — and all charts are technically accurate',
            'The organization optimizes for what is visible, not what matters',
            'Problems become visible only when they escalate to customer level — too late to prevent',
            'Confidence grows as the measurement system gets weaker',
          ])}
        </div>

        {pullQuote("Metric systems are strategy systems in disguise. What you choose to measure is what your organization believes is working.")}

        <PMPrincipleBox principle="If the measurement system is weak, strategy can look stronger than reality. The org will make confident decisions based on an incomplete picture." />

        <ApplyItBox prompt="Think of one product team you know. If they say 'the product is doing well,' what metric system is that statement actually based on? Who owns interpreting those numbers? How often are they reviewed against what question?" />

        <QuizEngine
          conceptId="pm-analytics-basics"
          conceptName="Measurement System Design"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "pm-analytics-basics",
            question: "What is the biggest risk of a weak measurement system in a product organization?",
            options: ['Dashboards become harder to read', 'Teams optimize the wrong behavior with total confidence', 'SQL queries become more complex', 'Charts do not refresh often enough'],
            correctIndex: 1,
            explanation: "A weak metric system doesn't mean no data — it means everyone can sound confident while looking at the wrong thing. The danger is optimizing the wrong behavior with total sincerity.",
          }}
        />
      </ChapterSection>

      {/* ── PART 2 ── */}
      <ChapterSection id="m7-north-star" num="02" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Leadership asks Priya for a better measurement structure. Not another dashboard — a better architecture. Rohit immediately: <strong>&ldquo;Exactly. One metric the whole company can align around.&rdquo;</strong> Meera: <strong>&ldquo;One metric is useful. One metric is not enough.&rdquo;</strong> Kiran: <strong>&ldquo;A north star is helpful. But a metric architecture is what keeps the organization honest.&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "So I need to design a metric system, not just choose a number." },
            { speaker: 'other', text: "Right. Which means: north star tied to delivered value. Guardrails that protect against winning the north star the wrong way. Secondary metrics for diagnosis. Segment cuts for the user types that matter differently. And review rhythm that matches decision speed." },
            { speaker: 'priya', text: "That's a lot more structure than I expected." },
            { speaker: 'other', text: "It's only a lot the first time. Once it exists, decisions get faster — not slower. Because everyone is looking at the same reality." },
          ]}
        />

        {h2(<>Metric architecture: what it includes and why each layer matters</>)}

        {keyBox('The six layers of a mature metric system', [
          'North Star — the one metric that unambiguously improves when user value is delivered',
          'Guardrails — 2–3 metrics that make it impossible to win the north star the wrong way',
          'Secondary diagnostics — metrics that explain why things are moving (or not)',
          'Segment cuts — splits that surface different behavior in different user types',
          'Review rhythm — weekly for leading indicators, monthly for lagging, quarterly for strategy',
          'Ownership — who interprets each metric and escalates when it moves unexpectedly',
        ])}

        <MetricSystemArchitect />

        {pullQuote("A strong north star is useful. A strong metric architecture is what keeps an organization honest across quarters, teams, and incentive pressures.")}

        <PMPrincipleBox principle="A north star tells you what success looks like. A metric architecture ensures you can't achieve it through the wrong means — and that you find out quickly when you're drifting." />

        <ApplyItBox prompt="Choose one product area. Write: the north star, two guardrails, two segments that matter differently, and the review cadence. Then ask: if the north star improves this quarter but both guardrails slip, what does that tell you?" />

        <QuizEngine
          conceptId="north-star-metrics"
          conceptName="Metric Architecture Design"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "north-star-metrics",
            question: "Why is one north star metric often not enough for an experienced PM leading a complex product?",
            options: ['North star metrics are outdated as a concept', 'Teams also need guardrails, segments, review logic, and diagnostic metrics to build a complete system', 'Leadership dislikes metric simplicity', 'Only engineers can use north star metrics reliably'],
            correctIndex: 1,
            explanation: "A north star without guardrails is gameable. Without segments you miss different failure modes. Without review rhythm metrics become reports. The architecture — not just the metric — is what creates organizational clarity.",
          }}
        />
      </ChapterSection>

      {/* ── PART 3 ── */}
      <ChapterSection id="m7-success-metrics" num="03" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Activation review. A major drop between setup and first meaningful team use. Rohit: <strong>&ldquo;That is the step we need to fix.&rdquo;</strong> Sonal: <strong>&ldquo;Several of the accounts I&apos;m worried about are not failing there for the same reason.&rdquo;</strong> Dev: <strong>&ldquo;The instrumentation on that stage is too coarse. It captures the drop, not the failure mode.&rdquo;</strong> Maya: <strong>&ldquo;That stage bundles too many user intentions together.&rdquo;</strong> Kiran opens a segmented view. The single red bar starts to split.
        </SituationCard>

        <ConversationScene
          mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#3A86FF"
          lines={[
            { speaker: 'priya', text: "So the funnel wasn't wrong — it was just compressed?" },
            { speaker: 'other', text: "One visible drop-off was acting like a single problem because the data model flattened multiple realities into one step." },
            { speaker: 'priya', text: "How do you tell that's what's happening?" },
            { speaker: 'other', text: "When the fix that makes sense for one segment makes no sense for another. If you'd shipped the SMB fix, enterprise accounts would have gotten worse. Decomposition first saves a lot of rework." },
          ]}
        />

        {h2(<>At senior level: one drop is often several failures in one shape</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('From "there\'s a drop" to "there are three drops"', ACCENT)}
          {para(<>The junior PM instinct: find the biggest red bar and fix it. The senior PM instinct: decompose the red bar by segment before deciding what it means. Because the same surface-level drop can contain SMB users confused by UI, enterprise accounts blocked by permissions, and mid-market teams waiting for admin approval — and none of those require the same fix.</>)}
        </div>

        <FunnelDecomposer />

        {pullQuote("A visible funnel drop is often a compressed summary of multiple underlying failures — each of which needs a different fix.")}

        <PMPrincipleBox principle="Stop saying 'this stage is the problem.' Start saying 'this stage is where multiple failure modes are currently being aggregated.' That one change in language changes what the team builds next." />

        <ApplyItBox prompt="Think of one funnel step you know with a major drop. Before looking at any data, write three different user types who might be failing there for three completely different reasons. That's your decomposition hypothesis." />

        <QuizEngine
          conceptId="funnel-analysis"
          conceptName="Advanced Funnel Decomposition"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "funnel-analysis",
            question: "What is the strongest next move when a funnel stage has a major drop that likely contains mixed user behavior?",
            options: ['Optimize the stage immediately with one broad fix', 'Decompose the stage by segment before deciding what it means', 'Remove the stage from the funnel entirely', 'Ignore it unless revenue falls this quarter'],
            correctIndex: 1,
            explanation: "One broad fix for a mixed failure mode will help one segment and harm another. Decomposition first — even just 2–3 segments — reveals whether you're looking at one problem or three.",
          }}
        />
      </ChapterSection>

      {/* ── PART 4 ── */}
      <ChapterSection id="m7-funnel" num="04" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          New onboarding change launches and gets praised quickly. Completion is up. The team wants to call it a win. Rohit: <strong>&ldquo;This is great. We finally moved the top-line behavior we cared about.&rdquo;</strong> Maya: <strong>&ldquo;It improved the moment. I&apos;m not sure yet that it improved the product.&rdquo;</strong> Kiran pulls up cohort views. Week-one completion improved. Week-four retention barely moved. One segment improved a lot. Another performed worse than before.
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "So we improved completion without improving retention. How is that possible?" },
            { speaker: 'other', text: "Because you optimized a moment in the journey — not the reason users come back. Faster through a door doesn't mean they like what's inside." },
            { speaker: 'priya', text: "So the right question was never 'did we improve onboarding.'" },
            { speaker: 'other', text: "The right question was: did we improve the product in a way that lasts beyond the first interaction? That question needs cohort data — not just completion rate." },
          ]}
        />

        {h2(<>Local optimization vs system improvement</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('The three levels of a product change\'s impact', ACCENT)}
          {keyBox('From shallow to durable', [
            'Level 1 — Metric moves: the number you targeted went up (e.g. completion rate +8%). This is the easiest win to claim.',
            'Level 2 — Behavior changed: users are doing the thing you hoped — but are they coming back?',
            'Level 3 — Durable value: retention, depth of use, and account health all improve. This is what PM maturity looks like.',
          ])}
        </div>

        <ProductChangeSimulator />

        {pullQuote("Improvement at one moment in the journey is not the same as durable improvement over time. The question isn't 'did we improve onboarding.' It's 'did we improve the product in a way that lasts?'")}

        <PMPrincipleBox principle="A better first step is useful. A stronger retained behavior is better. A durable system-level improvement is what you ultimately want from a product change — and cohorts are the only way to see it." />

        <ApplyItBox prompt="Think of one product improvement you shipped or know about. What would 8-week retention data need to show for you to call it a genuine product win — not just a local metric win?" />

        <QuizEngine
          conceptId="cohort-analysis"
          conceptName="Local vs Durable Improvement"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "cohort-analysis",
            question: "Why is a local activation improvement not automatically a product win?",
            options: ['Because activation does not matter as a metric', 'Because it may not translate into durable retention or deeper product value over time', 'Because onboarding should never be a target for optimization', 'Because cohort analysis is only useful for large companies'],
            correctIndex: 1,
            explanation: "A faster door doesn't mean users like what's inside. Completion can rise while retention falls if the product change optimized the surface of the experience without improving its core value.",
          }}
        />
      </ChapterSection>

      {/* ── PART 5 ── */}
      <ChapterSection id="m7-cohorts" num="05" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          EdSpark&apos;s institutional business is becoming too important for user-only dashboards. Priya opens the standard product dashboard. Sonal stops her: <strong>&ldquo;That helps. But I can&apos;t tell which accounts are durable from this.&rdquo;</strong> Meera: <strong>&ldquo;I can&apos;t tell which are expansion-ready.&rdquo;</strong> Rohit: <strong>&ldquo;If a school is using the product heavily but only within one small team, that doesn&apos;t help me understand commercial depth.&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="kiran" name="Meera" role="Business Leader · EdSpark" accent="#7843EE"
          lines={[
            { speaker: 'priya', text: "The user dashboard shows healthy activity though. DAUs are up." },
            { speaker: 'other', text: "A product can look busy at the user level and still be fragile at the account level. Usage concentrated in two champions doesn't predict renewal." },
            { speaker: 'priya', text: "So I need to look at the account as the unit of health." },
            { speaker: 'other', text: "In B2B, the question stops being 'are users active?' and becomes 'is this account becoming more durable, more embedded, and more valuable over time?' Those are completely different questions — and they need different metrics." },
          ]}
        />

        {h2(<>The B2B analytics shift: from user health to account durability</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('The B2B health stack — four perspectives, one account', ACCENT)}
          {keyBox('What each function needs to see', [
            'Product: seat activation, feature penetration, admin setup depth, activation by account',
            'Customer Success: renewal risk signals, champion concentration, support volume, QBR readiness',
            'Revenue: NRR, expansion signals, at-risk ARR, average contract depth',
            'Leadership: accounts growing vs churning, product health score, renewal confidence',
          ])}
        </div>

        <AccountHealthExplorer />

        {pullQuote("In B2B, healthy usage is not enough. Product depth must connect to account durability and expansion readiness — not just activity counts.")}

        <PMPrincipleBox principle="The unit of analysis in B2B shifts from the user to the account. An account can be active and still be at churn risk if the usage is shallow, concentrated in one champion, or disconnected from business value." />

        <ApplyItBox prompt="Think of one B2B product. For a specific account, write the signals that would tell you it is: actively using → genuinely healthy → renewal-likely → expansion-ready. Notice how each threshold requires different data." />

        <QuizEngine
          conceptId="b2b-analytics"
          conceptName="B2B Account Health Analytics"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "b2b-analytics",
            question: "Why is a user-activity dashboard often insufficient for a B2B product health review?",
            options: ['Because B2B dashboards should only show revenue numbers', 'Because account durability depends on depth, breadth, renewal, and expansion signals — not just activity', 'Because B2B products do not need activation metrics', 'Because feature usage is irrelevant in B2B contexts'],
            correctIndex: 1,
            explanation: "User activity is a necessary but not sufficient signal in B2B. An account can be active and still be at churn risk if usage is concentrated, setup is shallow, or there's no expansion signal. The account is the commercial unit — and product health must be measured there.",
          }}
        />
      </ChapterSection>

      {/* ── PART 6 ── */}
      <ChapterSection id="m7-b2b" num="06" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Experiment review. Variant B improved the primary metric. Rohit: <strong>&ldquo;So we ship B.&rdquo;</strong> Kiran does not move on. The lift is real — but smaller than the headline. One guardrail slipped. The high-value institutional segment performed worse. Confidence is decent, not overwhelming. The room splits: Rohit wants speed, Sonal worries about the enterprise segment, Meera wants to know if the lift matters enough strategically.
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "The variant won. Isn't that the answer?" },
            { speaker: 'other', text: "It won the average. The high-value segment got worse. If that segment represents most of your expansion revenue, the average is lying to you." },
            { speaker: 'priya', text: "So statistical significance isn't enough." },
            { speaker: 'other', text: "A result can be statistically positive and still be strategically incomplete. The question is not 'did B win.' The question is: 'does this evidence justify the decision we'd make next?'" },
          ]}
        />

        {h2(<>Interpreting experiments as strategic evidence, not verdicts</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('Four questions before shipping a positive result', ACCENT)}
          {keyBox('What experienced PMs check beyond the headline', [
            '1. Is the lift meaningful? 4pp completion is real — but does it matter enough to justify organizational focus?',
            '2. What did the guardrail do? A slipping guardrail may mean the variant won the wrong way.',
            '3. Which segment got worse? If it\'s your highest-value segment, the average is actively misleading.',
            '4. Is this enough evidence to act on? 91% confidence is decent — not conclusive. Context determines whether to ship or run longer.',
          ])}
        </div>

        <ExperimentConsequenceEngine />

        {pullQuote("Experiment results become useful only when interpreted through product context — not just statistical output. A variant can win the average and lose the strategy.")}

        <PMPrincipleBox principle="Statistical significance is the floor, not the ceiling. Mature PM analytics asks: does this evidence justify the specific decision we're about to make — given who it hurts and what it costs if we're wrong?" />

        <ApplyItBox prompt="Think of a product test you might run. If the average result looks positive but your highest-value segment worsens, write the exact sequence of questions you would ask before deciding whether to ship, investigate, or hold." />

        <QuizEngine
          conceptId="ab-testing"
          conceptName="Strategic Experiment Interpretation"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "ab-testing",
            question: "What makes an experiment result strategically incomplete even when statistically positive?",
            options: ['It used bar charts instead of line charts', 'It may improve the average while harming a critical segment or causing a guardrail to slip', 'It came from a product team rather than a data science team', 'It was reviewed before the full confidence threshold was reached'],
            correctIndex: 1,
            explanation: "An average can be positive while your highest-value segment gets significantly worse. Statistical significance tells you the lift is real — it doesn't tell you whether the lift outweighs the segment damage.",
          }}
        />
      </ChapterSection>

      {/* ── PART 7 ── */}
      <ChapterSection id="m7-experiments" num="07" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          End of quarter. Priya closes her laptop and reopens the notebook she has been carrying. At the start of this module, analytics still felt like dashboards, reporting, movement, weekly reviews, being &ldquo;data-driven.&rdquo; Now it feels like something different.
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "I think I used to treat analytics like proof." },
            { speaker: 'other', text: "And now?" },
            { speaker: 'priya', text: "Now it feels more like lens design. If the lens is weak, we see the wrong reality clearly." },
            { speaker: 'other', text: "That's much closer. Mature PMs don't just read dashboards. They build measurement systems that let the company see the product more honestly." },
          ]}
        />

        {h2(<>What analytics looks like at PM maturity</>)}

        {keyBox('The shift from beginner to mature analytics thinking', [
          'From: "What moved?" → To: "Does this metric system let us ask the right question?"',
          'From: "Fix the biggest red bar" → To: "Decompose before deciding what it means"',
          'From: "The experiment won" → To: "Does this evidence justify the decision we\'d make next?"',
          'From: "Retention is stable" → To: "Whose retention? Which cohort? Compared to what baseline?"',
          'From: "User activity is healthy" → To: "Is this account becoming more durable over time?"',
        ])}

        {pullQuote("Good PMs do not just track metrics. They build measurement systems that help the company ask better product questions — repeatedly, at scale, under pressure.")}

        <PMPrincipleBox principle="Mature PMs don't just read dashboards. They design measurement systems that make sharper product decisions possible — even when the data is ambiguous, the room is under pressure, and everyone has a chart that supports their view." />

        <ApplyItBox prompt="Write the one thing you want to change about how your current team measures product health. Make it specific — not 'we need better data' but 'we need to add [segment] to our [metric] review so we can see [thing we currently can't see].'" />

        <QuizEngine
          conceptId="pm-analytics-basics"
          conceptName="Mature PM Analytics"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "pm-analytics-basics",
            question: "Which sequence best reflects mature PM analytics thinking?",
            options: ['Build dashboard → report trends → repeat next month', 'Pick one metric → optimize it aggressively', 'Define the strategic question → design the right metric system → interpret behavior patterns → make a sharper decision', 'Focus only on A/B tests and ignore qualitative signals'],
            correctIndex: 2,
            explanation: "Mature analytics is a design discipline, not a reporting discipline. It starts with the question, designs the system to answer it, and uses the data to improve judgment — not to replace it.",
          }}
        />

        <NextChapterTeaser text="Next up: Product Launch & Growth — how PMs plan go-to-market, build growth loops, and measure whether a launch actually created durable traction." />
      </ChapterSection>

    </article>
  );
}

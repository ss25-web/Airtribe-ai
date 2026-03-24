'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  h2, para, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser,
} from './designSystem';

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────
const ACCENT = '#E07A5F';
const ACCENT_RGB = '224,122,95';
const MODULE_CONTEXT = `Module 04 of Airtribe PM Fundamentals — Track: New to PM.
Follows Priya Sharma, APM at EdSpark (B2B SaaS for sales coaching). Covers: diagnosing UX failures vs feature failures, session recordings, the 45-second drop-off problem, spec completeness (loading/error/empty/success states), and how small feedback changes drive massive metric improvements.`;

// ─────────────────────────────────────────
// LOCAL: METRICS DASHBOARD MOCKUP
// ─────────────────────────────────────────
const MetricsDashboardMockup = () => (
  <div style={{ margin: '32px 0', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2A3A5C', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
    {/* Header bar */}
    <div style={{ background: '#0F1B30', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '5px' }}>
        {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
          <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
        ))}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.08em' }}>
        EdSpark Analytics &middot; Onboarding Funnel &middot; Last 14 days
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#28C840', display: 'inline-block' }}
        />
        <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>LIVE</span>
      </div>
    </div>
    {/* Metrics */}
    <div style={{ background: '#1B2A47', padding: '28px 24px', display: 'flex', gap: '20px', flexWrap: 'wrap' as const }}>
      {/* Completion Rate card */}
      <div style={{ flex: '1', minWidth: '180px', background: '#142138', borderRadius: '10px', padding: '20px', border: '1px solid rgba(224,122,95,0.3)' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
          Onboarding Completion
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '44px', fontWeight: 700, color: '#E07A5F', lineHeight: 1 }}>30%</span>
          <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '18px', color: '#E07A5F' }}>↓</span>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#E07A5F' }}>−30pts from target</span>
          </div>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '30%', height: '100%', background: '#E07A5F', borderRadius: '2px' }} />
        </div>
        <div style={{ marginTop: '8px', fontFamily: 'monospace', fontSize: '9px', color: 'rgba(224,122,95,0.7)' }}>
          ▲ 2pts vs last week &mdash; still 30pts below target
        </div>
      </div>
      {/* Target card */}
      <div style={{ flex: '1', minWidth: '180px', background: '#142138', borderRadius: '10px', padding: '20px', border: '1px solid rgba(40,200,64,0.25)', position: 'relative' as const }}>
        <div style={{ position: 'absolute' as const, top: '12px', right: '12px', fontFamily: 'monospace', fontSize: '8px', color: '#28C840', background: 'rgba(40,200,64,0.1)', padding: '2px 7px', borderRadius: '3px', letterSpacing: '0.1em' }}>TARGET</div>
        <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
          Completion Goal
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '44px', fontWeight: 700, color: '#28C840', lineHeight: 1 }}>60%</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden', position: 'relative' as const }}>
          <div style={{ width: '60%', height: '100%', background: '#28C840', borderRadius: '2px' }} />
          <div style={{ position: 'absolute' as const, left: '30%', top: '-3px', width: '2px', height: '10px', background: '#E07A5F' }} />
        </div>
        <div style={{ marginTop: '8px', fontFamily: 'monospace', fontSize: '9px', color: 'rgba(40,200,64,0.7)', borderTop: '1px dashed rgba(40,200,64,0.2)', paddingTop: '8px' }}>
          Q1 OKR &middot; Set 3 weeks ago
        </div>
      </div>
      {/* Gap callout */}
      <div style={{ flex: '1', minWidth: '180px', background: 'rgba(224,122,95,0.06)', borderRadius: '10px', padding: '20px', border: '1px dashed rgba(224,122,95,0.35)', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Gap</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '36px', fontWeight: 700, color: '#E07A5F', lineHeight: 1, marginBottom: '8px' }}>−30pts</div>
        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(224,122,95,0.8)', lineHeight: 1.6 }}>
          Two weeks post-launch.<br />Something specific is wrong.
        </div>
      </div>
    </div>
    <div style={{ background: '#0F1B30', padding: '8px 16px', borderTop: '1px solid #1A2A44' }}>
      <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>
        ⚠ Drop-off detected at Step 2 · Same cohort · Same pattern · 14 days running
      </span>
    </div>
  </div>
);

// ─────────────────────────────────────────
// LOCAL: SESSION RECORDING MOCKUP
// ─────────────────────────────────────────
const SessionRecordingMockup = () => {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const phases = [
    { label: 'File uploaded', time: '0s', desc: 'Recording uploaded — processing begins', color: '#28C840' },
    { label: 'Click: Analyze', time: '3s', desc: 'User clicks "Analyze Recording" button', color: '#3A86FF' },
    { label: 'Processing… silence', time: '5s', desc: 'Server processes. Nothing visible to user.', color: '#6E7681' },
    { label: '2nd click', time: '8s', desc: 'User clicks again — no response yet', color: '#FF8B00' },
    { label: 'Rage click ×3', time: '10s', desc: 'Three rapid clicks. Cursor highlighted red.', color: '#E07A5F' },
    { label: 'User left', time: '12s', desc: 'Tab closed. Session ended.', color: '#E07A5F' },
  ];

  const advance = () => {
    setPhase(p => {
      if (p < phases.length - 1) return p + 1;
      setIsPlaying(false);
      return p;
    });
  };

  const play = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setPhase(0);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(advance, 1400);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, phase]);

  const currentPhase = phases[phase];

  return (
    <div style={{ margin: '32px 0' }}>
      <div style={{
        borderRadius: '12px', overflow: 'hidden',
        background: '#1A1A2E', border: '1px solid #2A2A4E',
        boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
      }}>
        {/* Player header */}
        <div style={{ background: '#12122A', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #2A2A4E' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
              <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
            ))}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>
            ▶ Playing session #4821
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>EdSpark · Onboarding · Step 2</span>
          </div>
        </div>

        {/* Browser mockup */}
        <div style={{ padding: '16px' }}>
          <div style={{
            background: '#FFFFFF', borderRadius: '8px', overflow: 'hidden',
            minHeight: '220px', position: 'relative' as const,
          }}>
            {/* URL bar */}
            <div style={{ background: '#F1F3F4', padding: '7px 12px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #E0E0E0' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dadada' }} />
              <div style={{ background: '#fff', borderRadius: '4px', padding: '3px 10px', fontSize: '11px', color: '#444', fontFamily: 'monospace', flex: 1, border: '1px solid #e0e0e0' }}>
                app.edspark.io/onboarding/step-2
              </div>
            </div>
            {/* Content */}
            <div style={{ padding: '24px 28px', minHeight: '175px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#1C1814', marginBottom: '8px' }}>Step 2: Analyze your recording</div>
                <div style={{ fontSize: '13px', color: '#8A8580', marginBottom: '20px' }}>Upload complete. Click below to start AI analysis.</div>

                {/* Analyze button */}
                <motion.div
                  animate={phase === 1 ? { scale: [1, 0.97, 1], background: ['#E07A5F', '#c85f45', '#E07A5F'] } : {}}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'inline-block',
                    background: '#E07A5F', color: '#fff', fontWeight: 700,
                    padding: '12px 32px', borderRadius: '8px', fontSize: '14px',
                    cursor: 'pointer', userSelect: 'none' as const,
                    boxShadow: phase === 1 ? '0 0 0 3px rgba(224,122,95,0.4)' : '0 2px 8px rgba(224,122,95,0.3)',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  Analyze Recording
                </motion.div>
              </div>

              {/* Processing phase — silence */}
              <AnimatePresence>
                {phase >= 2 && phase < 5 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ textAlign: 'center' as const }}
                  >
                    <div style={{ fontSize: '12px', color: '#ccc', fontFamily: 'monospace' }}>
                      {/* Nothing. White space. That's the point. */}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rage click indicators */}
              <AnimatePresence>
                {phase >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
                  >
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: phase >= (3 + i) ? 1 : 0 }}
                        transition={{ delay: i * 0.1, type: 'spring', stiffness: 400 }}
                        style={{
                          width: '10px', height: '10px', borderRadius: '50%',
                          background: phase >= 5 ? '#E07A5F' : phase >= 4 ? '#FF8B00' : '#3A86FF',
                          border: `2px solid ${phase >= 5 ? '#E07A5F' : phase >= 4 ? '#FF8B00' : '#3A86FF'}`,
                        }}
                      />
                    ))}
                    {phase >= 4 && (
                      <span style={{ fontFamily: 'monospace', fontSize: '10px', color: phase >= 5 ? '#E07A5F' : '#FF8B00', marginLeft: '4px', fontWeight: 700 }}>
                        {phase >= 5 ? '⚡ rage click' : 'clicking again…'}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Session ended */}
              <AnimatePresence>
                {phase >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      background: 'rgba(224,122,95,0.1)', border: '1px solid rgba(224,122,95,0.3)',
                      borderRadius: '6px', padding: '8px 16px',
                      fontSize: '12px', color: '#E07A5F', fontFamily: 'monospace', fontWeight: 700,
                    }}
                  >
                    ✕ User navigated away
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: '12px 16px 8px', borderTop: '1px solid #2A2A4E' }}>
          <div style={{ position: 'relative' as const, height: '24px', background: '#0E0E20', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
            {/* Progress fill */}
            <motion.div
              animate={{ width: `${(phase / (phases.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
              style={{ height: '100%', background: 'rgba(58,134,255,0.3)', position: 'absolute' as const, top: 0, left: 0 }}
            />
            {/* Phase markers */}
            {phases.map((p, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute' as const,
                  left: `${(i / (phases.length - 1)) * 100}%`,
                  top: '50%', transform: 'translate(-50%, -50%)',
                  width: i === 5 ? '3px' : '2px',
                  height: i === 5 ? '16px' : '12px',
                  background: i <= phase ? p.color : 'rgba(255,255,255,0.1)',
                  borderRadius: '1px',
                  transition: 'background 0.3s',
                }}
              />
            ))}
            {/* 12s marker */}
            <div style={{ position: 'absolute' as const, right: '0', top: 0, height: '100%', display: 'flex', alignItems: 'center', paddingRight: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '8px', color: '#E07A5F', fontWeight: 700 }}>12s · User left</span>
            </div>
          </div>
          {/* Current phase label */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <motion.div
              key={phase}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: currentPhase.color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: 'monospace', fontSize: '10px', color: currentPhase.color, fontWeight: 700 }}>{currentPhase.time}</span>
              <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{currentPhase.desc}</span>
            </motion.div>
            <button
              onClick={play}
              disabled={isPlaying}
              style={{
                background: isPlaying ? 'rgba(58,134,255,0.15)' : 'rgba(224,122,95,0.15)',
                border: `1px solid ${isPlaying ? 'rgba(58,134,255,0.3)' : 'rgba(224,122,95,0.3)'}`,
                borderRadius: '5px', padding: '4px 12px',
                fontFamily: 'monospace', fontSize: '9px', fontWeight: 700,
                color: isPlaying ? '#3A86FF' : '#E07A5F',
                cursor: isPlaying ? 'default' : 'pointer',
                letterSpacing: '0.08em',
                transition: 'all 0.2s',
              }}
            >
              {isPlaying ? '▶ PLAYING…' : phase === phases.length - 1 ? '↺ REPLAY' : '▶ PLAY'}
            </button>
          </div>
        </div>
      </div>
      {/* Below mockup stats */}
      <div style={{ marginTop: '12px', display: 'flex', gap: '20px', fontFamily: 'monospace', fontSize: '11px', color: 'var(--ed-ink3)' }}>
        <span style={{ color: '#E07A5F', fontWeight: 700 }}>⚡ 3 rage clicks detected</span>
        <span>·</span>
        <span>Session ended at 12s</span>
        <span>·</span>
        <span>Process completion: 45s</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// LOCAL: DROP-OFF CHART MOCKUP
// ─────────────────────────────────────────
const DropOffChartMockup = () => {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const dataPoints = [
    { t: '0s', pct: 100, label: '' },
    { t: '5s', pct: 90, label: '' },
    { t: '10s', pct: 75, label: '' },
    { t: '12s', pct: 32, label: '68% drop-off here', alert: true },
    { t: '15s', pct: 22, label: '' },
    { t: '20s', pct: 14, label: '' },
    { t: '30s', pct: 9, label: '' },
    { t: '45s', pct: 5, label: 'Process completes', success: true },
  ];

  const maxH = 180;

  return (
    <div ref={ref} style={{ margin: '32px 0' }}>
      <div style={{
        background: '#111827', borderRadius: '12px', padding: '24px',
        border: '1px solid #1F2D42', boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>
              Kiran · User Retention During Processing
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', fontWeight: 700, color: '#fff' }}>
              % of users still waiting · by second
            </div>
          </div>
          <div style={{ textAlign: 'right' as const }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>Sample</div>
            <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#3A86FF', fontWeight: 700 }}>n = 1,240</div>
          </div>
        </div>
        {/* Chart */}
        <div style={{ position: 'relative' as const, height: `${maxH + 40}px` }}>
          {/* Y-axis labels */}
          {[100, 75, 50, 25, 0].map(v => (
            <div key={v} style={{
              position: 'absolute' as const, left: 0, top: `${((100 - v) / 100) * maxH}px`,
              fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)',
              transform: 'translateY(-50%)', userSelect: 'none' as const,
            }}>{v}%</div>
          ))}
          {/* Grid lines */}
          {[75, 50, 25].map(v => (
            <div key={v} style={{
              position: 'absolute' as const,
              left: '32px', right: 0,
              top: `${((100 - v) / 100) * maxH}px`,
              height: '1px', background: 'rgba(255,255,255,0.05)',
            }} />
          ))}
          {/* Bars */}
          <div style={{ position: 'absolute' as const, left: '36px', right: 0, top: 0, height: `${maxH}px`, display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
            {dataPoints.map((pt, i) => {
              const isDropZone = i >= 2 && i <= 3;
              const isSuccess = pt.success;
              const barH = animated ? (pt.pct / 100) * maxH : 0;
              const barColor = isDropZone
                ? `rgba(224,122,95,${0.5 + i * 0.1})`
                : isSuccess
                ? 'rgba(40,200,64,0.6)'
                : pt.pct > 60
                ? 'rgba(58,134,255,0.5)'
                : 'rgba(224,122,95,0.3)';

              return (
                <div key={pt.t} style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', position: 'relative' as const }}>
                  {/* Alert line for 12s */}
                  {pt.alert && (
                    <div style={{
                      position: 'absolute' as const, bottom: 0, width: '2px',
                      height: `${maxH}px`, background: '#E07A5F', opacity: 0.4,
                      zIndex: 2,
                    }} />
                  )}
                  {/* Success line for 45s */}
                  {pt.success && (
                    <div style={{
                      position: 'absolute' as const, bottom: 0, width: '2px',
                      height: `${maxH}px`,
                      background: 'repeating-linear-gradient(to bottom, #28C840 0px, #28C840 4px, transparent 4px, transparent 8px)',
                      opacity: 0.5, zIndex: 2,
                    }} />
                  )}
                  <motion.div
                    animate={{ height: barH }}
                    initial={{ height: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.07, ease: 'easeOut' }}
                    style={{
                      width: '100%', background: barColor,
                      borderRadius: '3px 3px 0 0',
                      position: 'relative' as const, zIndex: 1,
                    }}
                  />
                </div>
              );
            })}
          </div>
          {/* X-axis labels */}
          <div style={{ position: 'absolute' as const, left: '36px', right: 0, top: `${maxH + 8}px`, display: 'flex', gap: '6px' }}>
            {dataPoints.map((pt) => (
              <div key={pt.t} style={{ flex: 1, textAlign: 'center' as const }}>
                <span style={{ fontFamily: 'monospace', fontSize: '9px', color: pt.alert ? '#E07A5F' : pt.success ? '#28C840' : 'rgba(255,255,255,0.35)', fontWeight: (pt.alert || pt.success) ? 700 : 400 }}>
                  {pt.t}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Annotations */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(224,122,95,0.1)', padding: '7px 12px', borderRadius: '6px', border: '1px solid rgba(224,122,95,0.2)' }}>
            <div style={{ width: '3px', height: '14px', background: '#E07A5F', borderRadius: '2px' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#E07A5F', fontWeight: 700 }}>12s &mdash; 68% drop-off here</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(40,200,64,0.07)', padding: '7px 12px', borderRadius: '6px', border: '1px dashed rgba(40,200,64,0.25)' }}>
            <div style={{ width: '3px', height: '14px', background: '#28C840', borderRadius: '2px' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#28C840', fontWeight: 700 }}>45s &mdash; process completes</span>
          </div>
          <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
            Only 5% wait the full 45 seconds.
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// LOCAL: SPEC COMPARISON MOCKUP
// ─────────────────────────────────────────
const SpecComparisonMockup = () => (
  <div style={{ margin: '32px 0', borderRadius: '12px', overflow: 'hidden', border: '1px solid #DFE1E6', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
    {/* Header */}
    <div style={{ background: '#1C2938', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '5px' }}>
        {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
          <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
        ))}
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>
        EdSpark Spec &middot; Onboarding · Step 2
      </span>
    </div>
    {/* Two columns */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Before */}
      <div style={{ padding: '20px 24px', background: '#FAFAFA', borderRight: '1px solid #E8E8E8' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#6E7681', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: '#F0F0F0', padding: '2px 8px', borderRadius: '3px' }}>WHAT WAS WRITTEN</span>
          <span style={{ color: '#E07A5F' }}>Original Spec &middot; Step 2</span>
        </div>
        <div style={{ background: '#fff', border: '1px solid #E0E0E0', borderRadius: '6px', padding: '16px', fontFamily: 'monospace', fontSize: '13px', color: '#444', lineHeight: 1.9 }}>
          <span style={{ color: '#6E7681', marginRight: '10px', userSelect: 'none' as const, fontSize: '11px' }}>1</span>
          <span style={{ fontWeight: 600 }}>Step 2: Analyze recording.</span>
        </div>
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(224,122,95,0.06)', border: '1px solid rgba(224,122,95,0.2)', borderRadius: '6px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#E07A5F', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px' }}>MISSING STATES</div>
          {['Loading / processing state', 'Progress indicator', 'Time estimate', 'Error state', 'Success state'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
              <span style={{ color: '#E07A5F', fontSize: '10px' }}>✕</span>
              <span style={{ fontSize: '12px', color: '#6E7681', textDecoration: 'line-through' as const }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      {/* After */}
      <div style={{ padding: '20px 24px', background: '#F8FFF9' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#0D7A5A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: 'rgba(13,122,90,0.1)', padding: '2px 8px', borderRadius: '3px' }}>WHAT WAS NEEDED</span>
          <span>Complete Spec &middot; Step 2</span>
        </div>
        <div style={{ background: '#fff', border: '1px solid rgba(13,122,90,0.2)', borderRadius: '6px', padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: '#333', lineHeight: 2.1 }}>
          {[
            { n: '1', text: 'Step 2: Analyze recording.', bold: true },
            { n: '2', text: '' },
            { n: '3', text: 'Loading state:', bold: true },
            { n: '4', text: '  Show: "Analyzing your recording…"' },
            { n: '5', text: '  Progress bar (indeterminate OK)' },
            { n: '6', text: '  Time estimate: "~30 seconds"' },
            { n: '7', text: '' },
            { n: '8', text: 'Error state:', bold: true },
            { n: '9', text: '  "Analysis failed. Try again."' },
            { n: '10', text: '' },
            { n: '11', text: 'Success state:', bold: true },
            { n: '12', text: '  Transition to results view.' },
          ].map(({ n, text, bold }) => (
            <div key={n} style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: 'rgba(13,122,90,0.4)', fontSize: '10px', minWidth: '18px', textAlign: 'right' as const, userSelect: 'none' as const }}>{n}</span>
              <span style={{ fontWeight: bold ? 700 : 400, color: bold ? '#0D7A5A' : '#555' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────
// LOCAL: BEFORE / AFTER MOCKUP
// ─────────────────────────────────────────
const BeforeAfterMockup = () => {
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 1.2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [started]);

  const PhoneFrame = ({ children, label, badge, badgeColor }: { children: React.ReactNode; label: string; badge: string; badgeColor: string }) => (
    <div style={{ flex: 1, minWidth: '220px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: 'var(--ed-ink)' }}>{label}</span>
        <span style={{ background: badgeColor, color: '#fff', fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.06em' }}>{badge}</span>
      </div>
      <div style={{
        background: '#1A1A2E', borderRadius: '20px', padding: '3px',
        border: '3px solid #2A2A4E', boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
        overflow: 'hidden',
      }}>
        <div style={{ background: '#FFFFFF', borderRadius: '17px', minHeight: '280px', overflow: 'hidden' }}>
          {/* Status bar */}
          <div style={{ background: '#F1F3F4', padding: '8px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#999' }}>9:41</span>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#999' }}>EdSpark</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ margin: '32px 0' }}>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' as const }}>
        {/* Before */}
        <PhoneFrame label="Before" badge="BEFORE" badgeColor="#E07A5F">
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '16px', minHeight: '252px' }}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C1814', marginBottom: '6px' }}>Analyze Recording</div>
              <div style={{ fontSize: '11px', color: '#8A8580', marginBottom: '18px' }}>Click to begin AI analysis</div>
              <div style={{ background: '#E07A5F', color: '#fff', fontWeight: 700, padding: '10px 24px', borderRadius: '7px', fontSize: '13px', display: 'inline-block' }}>
                Analyze
              </div>
            </div>
            {/* Silence */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px', color: '#DDD' }}>?</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#CCC', textAlign: 'center' as const, lineHeight: 1.6 }}>
                12 seconds of silence.
                <br />Nothing visible.
              </div>
            </div>
          </div>
        </PhoneFrame>

        {/* After */}
        <PhoneFrame label="After" badge="AFTER" badgeColor="#28C840">
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '16px', minHeight: '252px' }}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C1814', marginBottom: '6px' }}>Analyze Recording</div>
              <div style={{ fontSize: '11px', color: '#8A8580', marginBottom: '18px' }}>Click to begin AI analysis</div>
              <motion.div
                whileTap={{ scale: 0.97 }}
                onClick={() => { setStarted(true); setProgress(0); }}
                style={{ background: '#E07A5F', color: '#fff', fontWeight: 700, padding: '10px 24px', borderRadius: '7px', fontSize: '13px', display: 'inline-block', cursor: 'pointer' }}
              >
                Analyze
              </motion.div>
            </div>
            {/* Feedback */}
            <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {started ? (
                <>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C1814' }}>Analyzing your recording…</div>
                  <div style={{ width: '100%', height: '6px', background: '#F0F0F0', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, #E07A5F, #F4A261)', borderRadius: '3px' }}
                    />
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#8A8580' }}>
                    {progress < 100 ? `~${Math.max(1, Math.round(30 * (1 - progress / 100)))}s remaining` : '✓ Done!'}
                  </div>
                </>
              ) : (
                <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#CCC', textAlign: 'center' as const, lineHeight: 1.6 }}>
                  Tap &ldquo;Analyze&rdquo; above<br />to see the fix in action.
                </div>
              )}
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// LOCAL: METRICS COMPARISON MOCKUP
// ─────────────────────────────────────────
const MetricsComparisonMockup = () => {
  const [visible, setVisible] = useState(false);
  const [beforeCount, setBeforeCount] = useState(0);
  const [afterCount, setAfterCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const dur = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setBeforeCount(Math.round(ease * 30));
      setAfterCount(Math.round(ease * 58));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible]);

  return (
    <div ref={ref} style={{ margin: '32px 0' }}>
      <div style={{
        background: '#111827', borderRadius: '12px', padding: '28px 24px',
        border: '1px solid #1F2D42', boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      }}>
        <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', marginBottom: '20px', textAlign: 'center' as const }}>
          ONBOARDING COMPLETION RATE &middot; ONE WEEK LATER
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' as const, marginBottom: '24px' }}>
          {/* Before */}
          <div style={{ flex: 1, minWidth: '160px', background: 'rgba(224,122,95,0.08)', border: '1px solid rgba(224,122,95,0.25)', borderRadius: '10px', padding: '20px', textAlign: 'center' as const }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(224,122,95,0.7)', letterSpacing: '0.12em', marginBottom: '12px', textTransform: 'uppercase' as const }}>Before</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '52px', fontWeight: 700, color: '#E07A5F', lineHeight: 1 }}>{beforeCount}%</div>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(224,122,95,0.5)', marginTop: '8px' }}>Original launch</div>
          </div>
          {/* Arrow + delta */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: '6px', minWidth: '80px' }}>
            <motion.div
              animate={visible ? { scale: [0.8, 1.1, 1], opacity: [0, 1] } : { scale: 0.8, opacity: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: 700, color: '#28C840' }}>+28</div>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(40,200,64,0.7)', textAlign: 'center' as const }}>points</div>
            </motion.div>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ fontFamily: 'monospace', fontSize: '20px', color: 'rgba(255,255,255,0.3)' }}>→</div>
          </div>
          {/* After */}
          <div style={{ flex: 1, minWidth: '160px', background: 'rgba(40,200,64,0.07)', border: '1px solid rgba(40,200,64,0.25)', borderRadius: '10px', padding: '20px', textAlign: 'center' as const }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(40,200,64,0.7)', letterSpacing: '0.12em', marginBottom: '12px', textTransform: 'uppercase' as const }}>After</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '52px', fontWeight: 700, color: '#28C840', lineHeight: 1 }}>{afterCount}%</div>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(40,200,64,0.5)', marginTop: '8px' }}>After loading state fix</div>
          </div>
        </div>
        {/* Change callout */}
        <div style={{ textAlign: 'center' as const, padding: '12px', background: 'rgba(40,200,64,0.05)', borderRadius: '6px', border: '1px dashed rgba(40,200,64,0.2)' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(40,200,64,0.7)', letterSpacing: '0.1em' }}>
            Change: progress feedback only · Backend unchanged · Feature unchanged
          </span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// CUSTOM MENTOR CARDS
// ─────────────────────────────────────────
const KiranCard = ({ quote }: { quote: string }) => (
  <div style={{
    margin: '24px 0',
    background: 'var(--ed-card)',
    borderLeft: '4px solid #3A86FF',
    borderTop: '1px solid var(--ed-rule)',
    borderRight: '1px solid var(--ed-rule)',
    borderBottom: '1px solid var(--ed-rule)',
    borderRadius: '0 8px 8px 0',
    padding: '18px 20px',
  }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: '#3A86FF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3A86FF', display: 'inline-block' }} />
      KIRAN · DATA ANALYST
    </div>
    <div style={{ fontSize: '15px', color: 'var(--ed-ink)', lineHeight: 1.75, fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif" }}>
      &ldquo;{quote}&rdquo;
    </div>
  </div>
);

const MayaCard = ({ quote }: { quote: string }) => (
  <div style={{
    margin: '24px 0',
    background: 'var(--ed-card)',
    borderLeft: '4px solid #E07A5F',
    borderTop: '1px solid var(--ed-rule)',
    borderRight: '1px solid var(--ed-rule)',
    borderBottom: '1px solid var(--ed-rule)',
    borderRadius: '0 8px 8px 0',
    padding: '18px 20px',
  }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: '#E07A5F', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E07A5F', display: 'inline-block' }} />
      MAYA · DESIGNER
    </div>
    <div style={{ fontSize: '15px', color: 'var(--ed-ink)', lineHeight: 1.75, fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif" }}>
      &ldquo;{quote}&rdquo;
    </div>
  </div>
);

const DevCard = ({ quote }: { quote: string }) => (
  <div style={{
    margin: '24px 0',
    background: 'var(--ed-card)',
    borderLeft: '4px solid #6E7681',
    borderTop: '1px solid var(--ed-rule)',
    borderRight: '1px solid var(--ed-rule)',
    borderBottom: '1px solid var(--ed-rule)',
    borderRadius: '0 8px 8px 0',
    padding: '18px 20px',
  }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: '#6E7681', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6E7681', display: 'inline-block' }} />
      DEV · ENGINEER
    </div>
    <div style={{ fontSize: '15px', color: 'var(--ed-ink)', lineHeight: 1.75, fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif" }}>
      &ldquo;{quote}&rdquo;
    </div>
  </div>
);

// ─────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────
export default function Track1UXDesign() {
  return (
    <article style={{ maxWidth: '740px', margin: '0 auto', padding: '0 24px 80px' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', padding: '72px 0 48px', overflow: 'hidden' }}>
        {/* Watermark */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-20px', top: '-10px',
          fontSize: 'clamp(140px, 18vw, 220px)', fontWeight: 700, lineHeight: 1,
          color: `rgba(${ACCENT_RGB},0.06)`,
          fontFamily: "'Lora', Georgia, serif",
          letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none',
        }}>04</div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '14px', textTransform: 'uppercase' as const }}>
            PM Fundamentals &middot; Module 04
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '16px', fontFamily: "'Lora', Georgia, serif" }}>
            UX &amp; Design<br />Collaboration
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '40px' }}>
            &ldquo;If it feels broken, it is broken.&rdquo;
          </p>

          {/* Character row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '40px' }}>
            {[
              { name: 'Priya', role: 'APM · 2 yrs', org: 'EdSpark', color: ACCENT, bg: `rgba(${ACCENT_RGB},0.08)`, border: `rgba(${ACCENT_RGB},0.2)` },
              { name: 'Maya', role: 'Designer', org: 'EdSpark', color: '#E07A5F', bg: 'rgba(224,122,95,0.07)', border: 'rgba(224,122,95,0.2)' },
              { name: 'Kiran', role: 'Data Analyst', org: 'EdSpark', color: '#3A86FF', bg: 'rgba(58,134,255,0.07)', border: 'rgba(58,134,255,0.2)' },
              { name: 'Asha', role: 'AI Mentor', org: '', color: '#0097A7', bg: 'rgba(0,151,167,0.07)', border: 'rgba(0,151,167,0.2)' },
            ].map(c => (
              <div key={c.name} style={{
                background: c.bg, border: `1px solid ${c.border}`,
                borderRadius: '8px', padding: '12px 16px', minWidth: '130px',
              }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: c.color, marginBottom: '3px' }}>{c.name}</div>
                <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--ed-ink3)' }}>{c.role}</div>
                {c.org && <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', opacity: 0.7 }}>{c.org}</div>}
              </div>
            ))}
          </div>

          {/* Learning objectives */}
          <div style={{
            background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px',
            borderLeft: `4px solid ${ACCENT}`,
            borderTop: '1px solid var(--ed-rule)',
            borderRight: '1px solid var(--ed-rule)',
            borderBottom: '1px solid var(--ed-rule)',
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>
              Learning Objectives
            </div>
            {[
              'Distinguish between a feature failure and an experience failure — and know which one you\'re actually facing',
              'Write specs that include every UI state: loading, error, empty, success, and edge cases',
              'Run the UX debug loop: from metric to session recording to specific friction point to targeted fix',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 2 ? '10px' : 0, alignItems: 'flex-start' }}>
                <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '12px', marginTop: '2px' }}>0{i + 1}</span>
                <span style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PART I — The Illusion of "Done" ── */}
      <ChapterSection id="m4-illusion" num="01" accentRgb={ACCENT_RGB} first>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Two weeks after launch. Onboarding completion: 30%. Target: 60%. The office has the quiet
          that follows a &ldquo;successful&rdquo; release. Kiran rotates his laptop. &ldquo;Same users. Same drop-off point. Step 2.&rdquo;
        </SituationCard>

        {para(<>
          Priya had shipped onboarding improvements with confidence. The numbers improved &mdash; just not enough.
          More importantly, she doesn&apos;t understand why. She knows the what. She doesn&apos;t know the why.
          And those are completely different problems.
        </>)}

        {h2(<>Shipping something is not the same as fixing something</>)}

        <MetricsDashboardMockup />

        <KiranCard quote="Same users. Same drop-off. We shipped something — that's not the same as solving something." />

        <Avatar
          name="Asha"
          nameColor="#0097A7"
          borderColor="#0097A7"
          content={<>Before diagnosing the fix, diagnose the understanding. Do you know <em>why</em> completion improved by 2% and not 30%? If not, you&apos;re guessing.</>}
          expandedContent="A metric moving in the right direction is not evidence that your hypothesis was correct. It might be seasonality, a different cohort, or a different behaviour entirely. Priya shipped better copy. But the core confusion — not knowing what happens after clicking Analyze — was never touched."
          conceptId="ux-ship-vs-fix"
          question="Your feature shipped and metrics improved slightly but far below target. What's your first move?"
          options={[
            { text: 'Move to the next roadmap item', correct: false, feedback: 'You haven\'t learned why it underperformed. You\'ll repeat the same mistake.' },
            { text: 'Mark it as done and optimise later', correct: false, feedback: 'Later rarely comes. And optimising without understanding is guessing with extra steps.' },
            { text: 'Investigate actual user behaviour', correct: true, feedback: 'Exactly. A small improvement with a big gap means something specific is still broken. Find it.' },
            { text: 'Increase acquisition to improve the absolute number', correct: false, feedback: 'More users hitting a broken experience = more users having a bad time.' },
          ]}
        />

        <QuizEngine
          conceptId="ux-ship-vs-fix"
          conceptName="Shipping vs. Fixing"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'ux-ship-vs-fix',
            question: 'Your completion rate is 30% against a 60% target two weeks after launch. What does this tell you?',
            options: [
              'A) The feature needs more time',
              'B) The target was unrealistic',
              'C) There\'s likely a specific friction point users are hitting',
              'D) You need more user testing',
            ],
            correctIndex: 2,
            explanation: 'A 50% miss on target almost always means something specific is wrong, not just \'needs polish\'. Two weeks is enough signal — start looking for the exact friction point.',
            keyInsight: 'A metric far below target is a diagnosis prompt, not a waiting game.',
          }}
        />
      </ChapterSection>

      {/* ── PART II — The Room You've Never Been In ── */}
      <ChapterSection id="m4-session" num="02" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Maya doesn&apos;t explain. She shows. She plugs in her laptop, opens a session recording, and presses play.
        </SituationCard>

        {h2(<>A system can work perfectly and still fail the user</>)}

        <SessionRecordingMockup />

        <MayaCard quote="I didn't say the system wasn't working. I said watch what the user does." />

        {para(<>
          Systems can be functionally correct and experientially broken. The user&apos;s mental model doesn&apos;t
          include &ldquo;the server is processing.&rdquo; All they see is nothing happening. To them, nothing
          happening means broken. They&apos;re not wrong &mdash; from their vantage point, nothing is happening.
          They have zero information. Zero is not a loading state.
        </>)}

        {para(<>
          This is the gap between engineering correctness and product design. The backend processed
          successfully every time. Every click sent a valid request. Every request got a valid response.
          The system worked perfectly. And the user left anyway.
        </>)}

        <Avatar
          name="Asha"
          nameColor="#0097A7"
          borderColor="#0097A7"
          content="There are two kinds of broken: technically broken and experientially broken. Engineering fixes the first. Product design fixes the second. Priya's team fixed neither — they optimised copy around an experience that still left users in the dark."
          conceptId="ux-two-kinds-broken"
          question="The system processes correctly but users abandon midway. What's the core issue?"
          options={[
            { text: 'Backend latency needs to be reduced', correct: false, feedback: 'The system IS processing. The latency isn\'t the problem — the silence is.' },
            { text: 'Users are impatient', correct: false, feedback: 'Users aren\'t impatient. They\'re uncertain. There\'s a difference — one is a user flaw, the other is a design flaw.' },
            { text: 'The experience gives no feedback during processing', correct: true, feedback: 'Correct. Silence = ambiguity = abandonment. Users can wait — but only if they know what they\'re waiting for.' },
            { text: 'The feature itself is wrong', correct: false, feedback: 'The feature is right. The wrapper around it — the feedback loop — is missing.' },
          ]}
        />

        <QuizEngine
          conceptId="ux-system-vs-experience"
          conceptName="System vs. Experience"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'ux-system-vs-experience',
            question: 'What did Maya\'s session recording reveal that Priya\'s dashboard couldn\'t?',
            options: [
              'A) That the backend was slow',
              'B) That the completion rate was lower than expected',
              'C) The exact moment and reason users chose to leave',
              'D) That the feature had a bug',
            ],
            correctIndex: 2,
            explanation: 'Session recordings show intent and confusion, not just outcomes. Priya already knew the metric. Maya showed the WHY behind it — the specific second the user gave up, and why.',
            keyInsight: 'Dashboards tell you what happened. Session recordings tell you why.',
          }}
        />
      </ChapterSection>

      {/* ── PART III — The 45-Second Problem ── */}
      <ChapterSection id="m4-45sec" num="03" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Kiran is already pulling up a new chart before Maya closes her laptop. &ldquo;Average processing
          time: 45 seconds. Drop-off spike: 12 seconds.&rdquo; He taps the screen. &ldquo;They&apos;re not waiting long enough.&rdquo;
        </SituationCard>

        {h2(<>Users don&apos;t abandon slow systems. They abandon uncertain ones.</>)}

        <DropOffChartMockup />

        {para(<>
          The insight isn&apos;t that 45 seconds is too long. Other apps make users wait longer. The insight
          is that at 12 seconds, the user has no reason to believe anything is happening. They have
          made a rational decision with the information available to them: nothing is happening, therefore
          this is broken, therefore I&apos;m leaving. That&apos;s not impatience. That&apos;s logic.
        </>)}

        <KiranCard quote="The drop-off isn't about patience. It's about information. At 12 seconds they have none." />

        <MayaCard quote="They don't know they should wait. 'Analyzing' isn't a state. It's a word." />

        <Avatar
          name="Asha"
          nameColor="#0097A7"
          borderColor="#0097A7"
          content="The 12-second drop-off is a design specification hiding as a data point. It's telling you: users need feedback by second 5 at the latest. Every second of silence after that is a decision point where they can leave."
          expandedContent="Processing time is a product constraint. Perceived processing time is a design problem. You can't always make things faster — but you can almost always make waiting feel intentional. Progress bars, status messages, time estimates: these don't speed up the system. They eliminate the ambiguity that causes abandonment."
          conceptId="ux-uncertainty-abandonment"
          question="Why do users leave at 12 seconds if the process takes 45 seconds?"
          options={[
            { text: 'They\'re impatient', correct: false, feedback: 'Users wait 3 minutes for an Uber. Impatience isn\'t the issue — uncertainty is.' },
            { text: 'The feature is objectively too slow', correct: false, feedback: '45 seconds is fast for AI analysis of a sales recording. Users wait longer for things they understand.' },
            { text: 'They don\'t understand what\'s happening or how long it will take', correct: true, feedback: 'Exactly. Silence = broken to the user. The 45 seconds isn\'t the problem. The 12 seconds of no feedback is.' },
            { text: 'The onboarding didn\'t prepare them', correct: false, feedback: 'Even perfectly onboarded users abandon silent processes. Feedback is a real-time need, not an onboarding fix.' },
          ]}
        />

        <QuizEngine
          conceptId="ux-loading-states"
          conceptName="Loading States"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'ux-loading-states',
            question: 'What\'s the minimum a user needs to wait comfortably for a 45-second process?',
            options: [
              'A) A guarantee the feature will work',
              'B) A faster backend',
              'C) Real-time feedback: a progress indicator and estimated time',
              'D) A notification when it\'s done',
            ],
            correctIndex: 2,
            explanation: 'Progress bar + time estimate = user stays. That\'s all it takes. The bar doesn\'t have to be accurate — it has to be present. Post-completion notifications don\'t help users who already left.',
            keyInsight: 'A progress bar doesn\'t speed up the system. It eliminates the ambiguity that causes abandonment.',
          }}
        />
      </ChapterSection>

      {/* ── PART IV — Rewriting Reality ── */}
      <ChapterSection id="m4-spec-gap" num="04" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya opens the original spec. She finds the offending line. &ldquo;Step 2: Analyze recording.&rdquo;
          That&apos;s the entire specification for a 45-second AI processing step.
        </SituationCard>

        {h2(<>UX failures often start as spec gaps, not engineering bugs</>)}

        <SpecComparisonMockup />

        <DevCard quote="I built what was written. No loading state was specified. I assumed the system feedback was handled elsewhere." />

        {para(<>
          This is the moment Priya understands something important. The engineer didn&apos;t make a mistake.
          The spec made a gap invisible. A spec that describes only the primary action &mdash; &ldquo;click Analyze&rdquo;
          &mdash; is a spec for a world where nothing goes wrong, nothing takes time, and users always know what
          to expect. That world doesn&apos;t exist.
        </>)}

        {para(<>
          A spec that doesn&apos;t describe states &mdash; loading, error, empty, success &mdash; is an incomplete spec.
          Not because the engineer missed something. Because the PM never considered them. That&apos;s
          the real root cause. Not a bug. Not a missed ticket. A hole in the thinking.
        </>)}

        <Avatar
          name="Asha"
          nameColor="#0097A7"
          borderColor="#0097A7"
          content="A spec that only describes the happy path is a spec for a world that doesn't exist. Real users hit loading states, error states, empty states. If those aren't designed, they're improvised — by engineers, in production."
          expandedContent="The loading state wasn't forgotten — it was never considered. That's the difference. Forgotten things can be added. Never-considered things require a different kind of thinking: what is every possible state this UI can be in? Write them all down before a single line of code is written."
          conceptId="ux-spec-completeness"
          question="Dev says 'I built what was written.' Who is responsible for the missing loading state?"
          options={[
            { text: 'Dev — they should have flagged the gap', correct: false, feedback: 'Engineers build to spec. Flagging design gaps isn\'t their primary responsibility — though good ones do.' },
            { text: 'The PM — the spec was incomplete', correct: true, feedback: 'The PM owns the spec. "Step 2: Analyze recording" is not a complete user experience specification. States, feedback, timing — all PM/design territory.' },
            { text: 'The designer — they should have added it to the spec', correct: false, feedback: 'In this case Priya wrote the spec without involving Maya. That\'s the real root cause.' },
            { text: 'Nobody — it was an honest oversight', correct: false, feedback: 'It was an honest oversight — but ownership still matters. Someone has to own the completeness of a spec.' },
          ]}
        />

        {keyBox('States Every Spec Must Include', [
          'Loading / processing — what does the user see while waiting?',
          'Empty state — what if there\'s no data yet?',
          'Error state — what if something goes wrong?',
          'Success state — what does done look like?',
          'Edge cases — partial data, timeouts, slow connections',
        ])}

        <QuizEngine
          conceptId="ux-spec-states"
          conceptName="Spec Completeness"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'ux-spec-states',
            question: 'You\'re writing a spec for a feature that calls an API. Which states must be explicitly designed?',
            options: [
              'A) Just the success state — that\'s the goal',
              'B) Loading and success only',
              'C) All states: loading, success, error, empty, and edge cases',
              'D) Loading and error only since success is obvious',
            ],
            correctIndex: 2,
            explanation: 'Every state a user can encounter must be deliberately designed. Undesigned states become accidental UX — improvised by engineers in production, usually badly.',
            keyInsight: 'Success is 40% of the experience. The other 60% is loading, error, empty, and edge cases.',
          }}
        />
      </ChapterSection>

      {/* ── PART V — Small Changes, Heavy Impact ── */}
      <ChapterSection id="m4-small-fix" num="05" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          They don&apos;t redesign the flow. They don&apos;t add features. Priya writes three lines in a new doc.
          Maya turns them into a design in 20 minutes. Dev ships it in an afternoon.
        </SituationCard>

        {h2(<>The best UX fix is often the smallest one</>)}

        <BeforeAfterMockup />

        {para(<>
          Three things changed: a text label (&ldquo;Analyzing your recording&hellip;&rdquo;), a progress bar (doesn&apos;t
          need to be accurate, just present), and a time estimate (&ldquo;~30 seconds&rdquo;). The backend didn&apos;t
          change. The feature didn&apos;t change. The flow didn&apos;t change. Only what the user sees during the wait.
        </>)}

        {para(<>
          This is the underrated power of small, targeted interventions. Every day PMs propose redesigns
          when the actual problem is a missing sentence. The redesign takes a quarter. The sentence
          takes an afternoon. The sentence works.
        </>)}

        <Avatar
          name="Asha"
          nameColor="#0097A7"
          borderColor="#0097A7"
          content="The fix cost one afternoon. The original gap cost two weeks of confusion, a 30% completion rate, and a post-launch investigation. That's the real cost of an incomplete spec."
          conceptId="ux-feedback-loops"
          question="What actually improved the user experience in this fix?"
          options={[
            { text: 'A faster backend', correct: false, feedback: 'The backend wasn\'t changed. Processing still takes 45 seconds.' },
            { text: 'A redesigned onboarding flow', correct: false, feedback: 'Onboarding wasn\'t touched. The fix was in the moment of action.' },
            { text: 'Clear feedback during the processing state', correct: true, feedback: 'Three additions: a label, a progress bar, a time estimate. That\'s it. The system didn\'t change — the user\'s understanding of the system did.' },
            { text: 'A new UI design', correct: false, feedback: 'No redesign. Same UI, same flow, same feature — just with visible progress.' },
          ]}
        />

        {keyBox('UX Feedback Principles', [
          'Show progress, not just results',
          'Give time estimates even if approximate',
          'Never leave the user in silence for more than 3 seconds',
          'A progress bar doesn\'t need to be accurate — it needs to be present',
        ])}

        <QuizEngine
          conceptId="ux-minimum-viable-feedback"
          conceptName="Minimum Viable Feedback"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'ux-minimum-viable-feedback',
            question: 'Which addition would most reduce user drop-off during a 45-second processing step?',
            options: [
              'A) A \'cancel\' button',
              'B) A progress bar with a time estimate',
              'C) A success sound when done',
              'D) A faster animation on the button click',
            ],
            correctIndex: 1,
            explanation: 'A progress bar with a time estimate directly answers the two questions causing drop-off: "Is this working?" and "How long will it take?" Cancel buttons help, but don\'t address the core uncertainty.',
            keyInsight: 'Answer the user\'s unspoken questions in real time: is this working, and how long?',
          }}
        />
      </ChapterSection>

      {/* ── PART VI — One Week Later ── */}
      <ChapterSection id="m4-outcome" num="06" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Kiran. Same chair. Same laptop. One number changed. Completion rate: 58%.
        </SituationCard>

        {h2(<>We didn&apos;t fix the feature. We fixed the experience.</>)}

        <MetricsComparisonMockup />

        {para(<>
          No new features. No backend changes. No redesign. Twenty-eight percentage points from
          three lines of copy, a progress bar, and a time estimate. The gap between what was
          built and what users experienced was a single missing state. One unwritten paragraph
          in a spec. One afternoon of work. Twenty-eight points.
        </>)}

        <MayaCard quote="You fixed the experience. The feature was always fine." />

        {pullQuote('Users don\'t experience features. They experience what happens between actions.')}

        <Avatar
          name="Asha"
          nameColor="#0097A7"
          borderColor="#0097A7"
          content="28 points from a loading state. That's not unusual — it's what happens when you fix the right thing. Most UX problems aren't about the feature. They're about the gaps between features."
          expandedContent="The UX debug loop: observe real users → identify the specific drop-off moment → ask what they're feeling in that moment (not what they think) → fix clarity, not just functionality → measure again. Priya ran this loop. It works every time."
          conceptId="ux-debug-loop"
          question="What does a 28-point improvement from a loading state tell you about the original spec?"
          options={[
            { text: 'The original spec was fine — this was a bonus improvement', correct: false, feedback: 'A 28-point gap doesn\'t appear from a complete spec. It appears from a missing state.' },
            { text: 'The spec was missing critical UI states, causing a fixable UX failure', correct: true, feedback: 'The spec described a feature. It didn\'t describe an experience. Those are different things.' },
            { text: 'The backend should have been faster from the start', correct: false, feedback: 'Speed wasn\'t the problem. Communication was.' },
            { text: 'Users needed more training', correct: false, feedback: 'Training doesn\'t fix bad UX. Good UX fixes bad UX.' },
          ]}
        />

        <QuizEngine
          conceptId="ux-measurement"
          conceptName="Measuring UX Impact"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: 'ux-measurement',
            question: 'After shipping the loading state fix, completion jumps from 30% to 58%. What\'s the most important follow-up question?',
            options: [
              'A) Can we get to 80%?',
              'B) What\'s still causing the 42% who don\'t complete to drop off?',
              'C) Should we redesign the whole flow now?',
              'D) Was the improvement due to the loading state or something else?',
            ],
            correctIndex: 1,
            explanation: 'You fixed one friction point. There may be others. The 42% who still don\'t complete represent the next problem to diagnose. Understand each friction point individually.',
            keyInsight: 'A metric improvement is not a finish line. It\'s permission to ask: what\'s next?',
          }}
        />
      </ChapterSection>

      {/* ── PART VII — Final Reflection ── */}
      <ChapterSection id="m4-reflection" num="07" accentRgb={ACCENT_RGB}>

        {h2(<>Confusion is the real bug</>)}

        {para(<>
          Late evening. Priya writes in her notebook. Not feature ideas. Not roadmap items. A question
          she&apos;s going to ask at the start of every spec review from now on: <em>What are all the states
          this UI can be in?</em> The loading state wasn&apos;t a missing feature. It was a missing sentence.
          One paragraph between a broken experience and a working one.
        </>)}

        {pullQuote('Great UX isn\'t about what you add. It\'s about what the user never has to question.')}

        {keyBox('The UX Debug Loop', [
          '1. Observe real users (session recordings, not surveys)',
          '2. Find the exact drop-off moment',
          '3. Ask: what is the user feeling here?',
          '4. Fix clarity, not just functionality',
          '5. Measure the specific change',
        ])}

        {keyBox('Spec Completeness Checklist', [
          'Loading state — what does the user see while waiting?',
          'Success state — what does done look like?',
          'Error state — what if something goes wrong?',
          'Empty state — what if there\'s no data yet?',
          'Edge cases — timeouts, partial data, slow connections',
        ])}

        <NextChapterTeaser text="Next: Communication for PMs — Priya has a working product. Now she needs to get the team, the stakeholders, and the board on the same page." />
      </ChapterSection>

    </article>
  );
}

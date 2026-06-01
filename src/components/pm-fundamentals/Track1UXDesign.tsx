'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  h2, para, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, ApplyItBox,
  TiltCard, ConversationScene, CharacterChip,
} from './designSystem';
import { MentorFace } from './MentorFaces';
import { AbandonmentTimeline, FigmaBeforeAfter, NielsenHeuristicsViz } from './UXDesignVisualizations';
import { MicrocopyLab, StateSpecBuilder, UXDebugLoopViz, WireframeProgressionViz, StoryboardViz } from './UXRevampVisualizations';
import { FiveStatesSolarSystem } from './SignatureVisualsTrack1';

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────
const ACCENT = '#E07A5F';
const ACCENT_RGB = '224,122,95';

const PARTS = [
  { num: '01', id: 'm5-illusion',    label: "The Illusion of Done — shipping isn’t the same as fixing" },
  { num: '02', id: 'm5-session',     label: "Session Recordings — see what users actually do" },
  { num: '03', id: 'm5-45sec',       label: "The 45-Second Drop-Off — the moment you lose them" },
  { num: '04', id: 'm5-spec-gap',    label: "Spec Completeness — loading, error, empty, success" },
  { num: '05', id: 'm5-small-fix',   label: "Small Fix, Big Impact — one label, 18-point lift" },
  { num: '06', id: 'm5-outcome',     label: "The UX Debug Loop — metric to friction to fix" },
  { num: '07', id: 'm5-reflection',  label: "Reflection — what you’ll carry forward" },
];

const MODULE_CONTEXT = `Module 05 of Airtribe PM Fundamentals — Foundations Track.
Follows Priya Sharma, APM at EdSpark (B2B SaaS for sales coaching). Covers: diagnosing UX failures vs feature failures, session recordings, the 45-second drop-off problem, spec completeness (loading/error/empty/success states), and how small feedback changes drive massive metric improvements.`;



// (Dead-code MetricsDashboardMockup removed — never rendered)

// ─────────────────────────────────────────
// LOCAL: SESSION RECORDING MOCKUP
// ─────────────────────────────────────────
// ─── SessionRecordingMockup — REAL session-replay sandbox ─────────────────
// This is a functioning sandbox, not a click-and-reveal mockup. The learner
// IS the user inside the EdSpark onboarding step. They click the silent
// "Analyze" button themselves. Their real clicks are timestamped and pushed
// into the event log live. A real rage-click detector fires when 3+ clicks
// fall inside a 2s sliding window. In BEFORE mode no feedback is shown —
// they feel the silence; the "Close tab" button is the only escape. In
// AFTER mode the same button shows a progress bar + time estimate and the
// process completes in ~6s. After running both, the learner can compare
// the two sessions side-by-side (their actual clicks, rage events, time-
// to-give-up). The pedagogical point — silence breeds rage clicks — is
// emergent from the learner's own behaviour, not narrated.
const SessionRecordingMockup = () => {
  type Mode = 'before' | 'after';
  type Evt = { t: number; kind: 'click' | 'rage' | 'process-start' | 'process-done' | 'gave-up' | 'completed' };
  type SessionSnapshot = {
    mode: Mode; events: Evt[]; durationMs: number;
    clicks: number; rageBursts: number; completed: boolean; gaveUp: boolean;
  };

  const PROCESS_MS_BEFORE = 30000; // matches the real "30 seconds remaining" — feels too long on purpose
  const PROCESS_MS_AFTER  = 6000;  // realistic active wait when there's a progress bar
  const RAGE_WINDOW_MS    = 2000;
  const RAGE_THRESHOLD    = 3;

  const [mode, setMode] = useState<Mode>('before');
  const [running, setRunning] = useState(false);
  const [tNow, setTNow] = useState(0);
  const [events, setEvents] = useState<Evt[]>([]);
  const [progressPct, setProgressPct] = useState(0);
  const [ended, setEnded] = useState<null | 'gave-up' | 'completed'>(null);
  const [snapshots, setSnapshots] = useState<Partial<Record<Mode, SessionSnapshot>>>({});

  const startRef    = useRef<number | null>(null);
  const tickRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const processRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processStartedRef = useRef(false);

  const reset = (toMode: Mode = mode) => {
    if (tickRef.current)    clearInterval(tickRef.current);
    if (processRef.current) clearTimeout(processRef.current);
    startRef.current = null;
    processStartedRef.current = false;
    setRunning(false);
    setTNow(0);
    setEvents([]);
    setProgressPct(0);
    setEnded(null);
    setMode(toMode);
  };

  const start = () => {
    reset(mode);
    startRef.current = performance.now();
    setRunning(true);
    tickRef.current = setInterval(() => {
      if (startRef.current == null) return;
      setTNow(performance.now() - startRef.current);
    }, 90);
  };

  // ─── Real rage-click detector (sliding window) ────────────────────────
  const detectRage = (clickEvents: Evt[]): number => {
    let bursts = 0; let i = 0;
    while (i < clickEvents.length) {
      const windowEnd = clickEvents[i].t + RAGE_WINDOW_MS;
      let j = i;
      while (j < clickEvents.length && clickEvents[j].t <= windowEnd) j++;
      const count = j - i;
      if (count >= RAGE_THRESHOLD) { bursts++; i = j; }
      else i++;
    }
    return bursts;
  };

  const clickAnalyze = () => {
    if (!running || ended) return;
    const t = performance.now() - (startRef.current ?? performance.now());
    setEvents(prev => {
      const next = [...prev, { t, kind: 'click' as const }];
      const clicks = next.filter(e => e.kind === 'click');
      const prevRage = detectRage(prev.filter(e => e.kind === 'click'));
      const nextRage = detectRage(clicks);
      if (nextRage > prevRage) next.push({ t, kind: 'rage' as const });
      return next;
    });

    if (mode === 'before') {
      // Silent — nothing visible happens. Process starts on first click only.
      if (!processStartedRef.current) {
        processStartedRef.current = true;
        setEvents(prev => [...prev, { t, kind: 'process-start' as const }]);
        processRef.current = setTimeout(() => {
          const doneT = performance.now() - (startRef.current ?? performance.now());
          setEvents(prev => [...prev, { t: doneT, kind: 'process-done' as const }, { t: doneT, kind: 'completed' as const }]);
          setEnded('completed');
          setRunning(false);
          if (tickRef.current) clearInterval(tickRef.current);
        }, PROCESS_MS_BEFORE);
      }
    } else {
      // After: visible feedback starts on first click.
      if (!processStartedRef.current) {
        processStartedRef.current = true;
        const procStart = t;
        setEvents(prev => [...prev, { t: procStart, kind: 'process-start' as const }]);
        const fillInterval = setInterval(() => {
          if (startRef.current == null) { clearInterval(fillInterval); return; }
          const elapsed = (performance.now() - startRef.current) - procStart;
          const pct = Math.min(100, (elapsed / PROCESS_MS_AFTER) * 100);
          setProgressPct(pct);
          if (pct >= 100) {
            clearInterval(fillInterval);
            const doneT = performance.now() - (startRef.current ?? performance.now());
            setEvents(prev => [...prev, { t: doneT, kind: 'process-done' as const }, { t: doneT, kind: 'completed' as const }]);
            setEnded('completed');
            setRunning(false);
            if (tickRef.current) clearInterval(tickRef.current);
          }
        }, 80);
      }
    }
  };

  const closeTab = () => {
    if (!running || ended) return;
    const t = tNow;
    setEvents(prev => [...prev, { t, kind: 'gave-up' as const }]);
    setEnded('gave-up');
    setRunning(false);
    if (tickRef.current)    clearInterval(tickRef.current);
    if (processRef.current) clearTimeout(processRef.current);
  };

  // Save snapshot when a session ends so we can compare both modes.
  useEffect(() => {
    if (ended) {
      const clicks = events.filter(e => e.kind === 'click').length;
      const rageBursts = events.filter(e => e.kind === 'rage').length;
      setSnapshots(prev => ({
        ...prev,
        [mode]: {
          mode, events: events.slice(),
          durationMs: tNow,
          clicks, rageBursts,
          completed: ended === 'completed',
          gaveUp: ended === 'gave-up',
        },
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ended]);

  useEffect(() => () => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (processRef.current) clearTimeout(processRef.current);
  }, []);

  const fmtT = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
  const elapsedClicks = events.filter(e => e.kind === 'click').length;
  const elapsedRages  = events.filter(e => e.kind === 'rage').length;

  const TIMELINE_MAX_MS = mode === 'before' ? 35000 : 8000;
  const colourForEvent = (k: Evt['kind']) => k === 'rage' ? '#E07A5F'
    : k === 'gave-up' ? '#EF4444'
    : k === 'completed' ? '#28C840'
    : k === 'process-start' ? '#3A86FF'
    : k === 'process-done' ? '#28C840'
    : 'rgba(255,255,255,0.7)';

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div>
        <div style={{
          borderRadius: '12px', overflow: 'hidden',
          background: '#1A1A2E', border: '1px solid #2A2A4E',
          boxShadow: '0 24px 64px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.3)',
        }}>
          {/* Player header */}
          <div style={{ background: '#12122A', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #2A2A4E' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
                <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em' }}>
              ● recording · live session
            </div>
            {/* Mode toggle */}
            <div style={{ marginLeft: '12px', display: 'inline-flex', background: '#0E0E20', border: '1px solid #2A2A4E', borderRadius: '5px', overflow: 'hidden' }}>
              {(['before', 'after'] as Mode[]).map(m => {
                const isActive = mode === m;
                return (
                  <button key={m} onClick={() => reset(m)} style={{
                    appearance: 'none', cursor: 'pointer',
                    background: isActive ? (m === 'before' ? 'rgba(224,122,95,0.18)' : 'rgba(40,200,64,0.16)') : 'transparent',
                    color: isActive ? (m === 'before' ? '#E07A5F' : '#28C840') : 'rgba(255,255,255,0.45)',
                    border: 'none', padding: '4px 12px',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em',
                  }}>{m.toUpperCase()}</button>
                );
              })}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: running ? '#E07A5F' : 'rgba(255,255,255,0.4)' }}>{fmtT(tNow)}</span>
              <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>EdSpark · Onboarding · Step 2</span>
            </div>
          </div>

          {/* Browser mockup — the learner uses this */}
          <div style={{ padding: '16px' }}>
            <div style={{
              background: '#FFFFFF', borderRadius: '8px', overflow: 'hidden',
              minHeight: '230px', position: 'relative' as const,
            }}>
              {/* URL bar with Close-tab affordance */}
              <div style={{ background: '#F1F3F4', padding: '7px 12px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #E0E0E0' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dadada' }} />
                <div style={{ background: 'var(--ed-card)', borderRadius: '4px', padding: '3px 10px', fontSize: '11px', color: '#444', fontFamily: 'monospace', flex: 1, border: '1px solid #e0e0e0' }}>
                  app.edspark.io/onboarding/step-2
                </div>
                <button
                  onClick={closeTab}
                  disabled={!running || !!ended}
                  title="Close tab — give up on this flow"
                  style={{
                    appearance: 'none', cursor: running && !ended ? 'pointer' : 'not-allowed',
                    background: 'transparent', border: '1px solid #E0E0E0', borderRadius: 4,
                    padding: '2px 9px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    color: running && !ended ? '#666' : '#CCC', fontWeight: 700,
                  }}
                >✕ close tab</button>
              </div>
              {/* Content */}
              <div style={{ padding: '24px 28px', minHeight: '185px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                {!running && !ended && (
                  <div style={{ textAlign: 'center' as const, color: '#666' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1C1814', marginBottom: 6 }}>Step 2: Analyze your recording</div>
                    <div style={{ fontSize: 12, color: '#8A8580', marginBottom: 14 }}>This is a real sandbox. Press <b>Start session</b>, then click <i>Analyze Recording</i> like a real user would.</div>
                    <button onClick={start} style={{ appearance: 'none', background: ACCENT, color: '#fff', border: 'none', padding: '8px 22px', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>▶ Start session</button>
                  </div>
                )}

                {running && (
                  <>
                    <div style={{ textAlign: 'center' as const }}>
                      <div style={{ fontSize: '17px', fontWeight: 700, color: '#1C1814', marginBottom: '6px' }}>Step 2: Analyze your recording</div>
                      <div style={{ fontSize: '12px', color: '#8A8580', marginBottom: '14px' }}>Upload complete. Click below to start AI analysis.</div>
                      {/* The button — same in both modes, behaviour differs */}
                      <button onClick={clickAnalyze} style={{
                        appearance: 'none', background: '#E07A5F', color: '#fff', fontWeight: 700,
                        padding: '11px 30px', borderRadius: 8, fontSize: 14, border: 'none',
                        cursor: 'pointer', boxShadow: '0 2px 8px rgba(224,122,95,0.30)', fontFamily: 'inherit',
                      }}>Analyze Recording</button>
                    </div>

                    {/* AFTER mode: progress bar + time estimate */}
                    {mode === 'after' && processStartedRef.current && (
                      <div style={{ width: 240, textAlign: 'center' as const }}>
                        <div style={{ fontSize: 12, color: '#1C1814', marginBottom: 4, fontWeight: 600 }}>Analyzing your recording…</div>
                        <div style={{ height: 5, background: '#EEE', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #E07A5F, #F4A261)', transition: 'width 80ms linear' }} />
                        </div>
                        <div style={{ marginTop: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#8A8580' }}>
                          {progressPct < 100 ? `~${Math.max(1, Math.round((PROCESS_MS_AFTER * (1 - progressPct / 100)) / 1000))}s remaining` : '✓ Done'}
                        </div>
                      </div>
                    )}

                    {/* BEFORE mode: deliberate emptiness. No spinner. */}
                    {mode === 'before' && processStartedRef.current && (
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#CCC', textAlign: 'center' as const, lineHeight: 1.6, marginTop: 6 }}>
                        <span style={{ color: 'transparent' }}>·</span>
                      </div>
                    )}

                    {/* Live rage badge in the UI itself */}
                    {elapsedRages > 0 && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(224,122,95,0.10)', border: '1px solid rgba(224,122,95,0.32)', padding: '4px 10px', borderRadius: 5 }}>
                        <span style={{ fontSize: 11 }}>⚡</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#E07A5F', fontWeight: 700 }}>rage detected · {elapsedRages} burst{elapsedRages === 1 ? '' : 's'}</span>
                      </motion.div>
                    )}
                  </>
                )}

                {ended === 'gave-up' && (
                  <div style={{ textAlign: 'center' as const }}>
                    <div style={{ fontSize: 13, color: '#E07A5F', fontWeight: 700, marginBottom: 6 }}>✕ You closed the tab.</div>
                    <div style={{ fontSize: 11, color: '#8A8580', marginBottom: 10 }}>Session ended at {fmtT(tNow)} after {elapsedClicks} click{elapsedClicks === 1 ? '' : 's'}{elapsedRages > 0 ? `, ${elapsedRages} rage burst${elapsedRages === 1 ? '' : 's'}` : ''}.</div>
                    <button onClick={start} style={{ appearance: 'none', background: 'transparent', color: '#666', border: '1px solid #DDD', borderRadius: 5, padding: '5px 14px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer' }}>↺ Try again</button>
                  </div>
                )}

                {ended === 'completed' && (
                  <div style={{ textAlign: 'center' as const }}>
                    <div style={{ fontSize: 13, color: '#28C840', fontWeight: 700, marginBottom: 6 }}>✓ Analysis complete.</div>
                    <div style={{ fontSize: 11, color: '#8A8580', marginBottom: 10 }}>Finished in {fmtT(tNow)} · {elapsedClicks} click{elapsedClicks === 1 ? '' : 's'}{elapsedRages > 0 ? ` · ${elapsedRages} rage burst${elapsedRages === 1 ? '' : 's'}` : ''}.</div>
                    <button onClick={start} style={{ appearance: 'none', background: 'transparent', color: '#666', border: '1px solid #DDD', borderRadius: 5, padding: '5px 14px', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer' }}>↺ Replay</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live timeline + event log */}
          <div style={{ padding: '10px 16px 12px', borderTop: '1px solid #2A2A4E' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em' }}>LIVE TIMELINE · {fmtT(tNow)} / {fmtT(TIMELINE_MAX_MS)}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.40)' }}>{elapsedClicks} click{elapsedClicks === 1 ? '' : 's'} · {elapsedRages} rage</div>
            </div>
            <div style={{ position: 'relative' as const, height: 22, background: '#0E0E20', borderRadius: 4, overflow: 'hidden' }}>
              {/* Progress line — how far through the imagined window */}
              <div style={{ position: 'absolute' as const, top: 0, left: 0, height: '100%', width: `${Math.min(100, (tNow / TIMELINE_MAX_MS) * 100)}%`, background: 'rgba(58,134,255,0.15)' }} />
              {/* Real event markers from learner's behaviour */}
              {events.map((e, i) => (
                <div key={i} style={{
                  position: 'absolute' as const,
                  left: `${Math.min(100, (e.t / TIMELINE_MAX_MS) * 100)}%`,
                  top: '50%', transform: 'translate(-50%, -50%)',
                  width: e.kind === 'rage' ? 3 : 2,
                  height: e.kind === 'gave-up' || e.kind === 'completed' ? 18 : e.kind === 'rage' ? 16 : 11,
                  background: colourForEvent(e.kind),
                  borderRadius: 1,
                }} title={`${fmtT(e.t)} · ${e.kind}`} />
              ))}
              {/* 12s "drop-off cliff" reference marker — only in BEFORE */}
              {mode === 'before' && (
                <div style={{ position: 'absolute' as const, left: `${(12000 / TIMELINE_MAX_MS) * 100}%`, top: 0, height: '100%', width: 1, background: 'rgba(224,122,95,0.35)' }} title="12s — the EdSpark drop-off cliff" />
              )}
            </div>
            <div style={{ marginTop: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, maxHeight: 36, overflow: 'auto' }}>
              {events.slice(-4).map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: colourForEvent(e.kind), width: 38 }}>{fmtT(e.t)}</span>
                  <span style={{ color: colourForEvent(e.kind), fontWeight: 700, width: 110 }}>{e.kind}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {e.kind === 'click' ? 'user clicked Analyze' :
                     e.kind === 'rage' ? `${RAGE_THRESHOLD}+ clicks within ${RAGE_WINDOW_MS/1000}s window` :
                     e.kind === 'process-start' ? 'server began processing' :
                     e.kind === 'process-done' ? 'server finished' :
                     e.kind === 'gave-up' ? 'user closed the tab' :
                     'flow completed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison panel — built from the learner's own two sessions */}
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {(['before', 'after'] as Mode[]).map(m => {
            const s = snapshots[m];
            const colour = m === 'before' ? '#E07A5F' : '#28C840';
            return (
              <div key={m} style={{ padding: '11px 13px', border: `1px solid ${s ? colour : '#2A2A4E'}`, background: s ? `${colour}10` : 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', color: colour }}>{m.toUpperCase()} · YOUR SESSION</span>
                  {s ? (
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: s.completed ? '#28C840' : '#EF4444', fontWeight: 700 }}>{s.completed ? '✓ COMPLETED' : '✕ GAVE UP'}</span>
                  ) : (
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>not run yet</span>
                  )}
                </div>
                {s ? (
                  <div style={{ display: 'flex', gap: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ed-ink3)' }}>
                    <span>{fmtT(s.durationMs)}</span><span>·</span>
                    <span>{s.clicks} click{s.clicks === 1 ? '' : 's'}</span><span>·</span>
                    <span style={{ color: s.rageBursts > 0 ? '#E07A5F' : 'inherit' }}>{s.rageBursts} rage</span>
                  </div>
                ) : (
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.32)' }}>switch to {m === mode ? 'this mode' : `${m.toUpperCase()} mode`} and run a session</div>
                )}
              </div>
            );
          })}
        </div>
        {snapshots.before && snapshots.after && (
          <div style={{ marginTop: 10, padding: '9px 12px', background: 'rgba(40,200,64,0.06)', border: '1px solid rgba(40,200,64,0.25)', borderRadius: 7, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--ed-ink2)', lineHeight: 1.6 }}>
            <span style={{ color: '#28C840', fontWeight: 700 }}>● </span>
            You triggered <b>{snapshots.before.rageBursts}</b> rage burst{snapshots.before.rageBursts === 1 ? '' : 's'} in <b>BEFORE</b> and <b>{snapshots.after.rageBursts}</b> in <b>AFTER</b>. The button didn&apos;t change — only the feedback did.
          </div>
        )}
      </div>
    </TiltCard>
  );
};

// ─── DropOffChartMockup — REAL fix-picker live chart ────────────────────
// The learner is the PM picking a fix for the 12s drop-off cliff. Five real
// PM levers — none, progress-bar, progress-bar + ETA, faster backend,
// email-when-done. Each lever has deterministic impact on the retention
// curve modelled from real product mechanics:
//   • none           → baseline 5% finish (32% retention at 12s)
//   • progress only  → 50% at 12s · 18% finish (cheap, partial win)
//   • prog + ETA     → 75% at 12s · 38% finish (cheap, best ROI)
//   • faster backend → process compresses to 15s (expensive, same shape)
//   • email-when-done→ 95% at 12s but ~60% of "wait elsewhere" never return
// The chart shows BOTH baseline and chosen-fix curves overlaid. A real
// cost/benefit panel (engineer-days vs +completion-points) drives the
// verdict. The pedagogical point — cheap UX fixes beat expensive infra
// fixes — emerges from the data, not from narration.
type FixKey = 'none' | 'progress' | 'progressETA' | 'fasterBackend' | 'emailDone';
const DROP_OFF_FIXES: { key: FixKey; label: string; effortDays: number; mechanic: string;
  curve: { t: number; pct: number }[]; completion: number;
}[] = [
  { key: 'none',          label: 'Ship nothing (baseline)',       effortDays: 0, mechanic: 'Status quo · 30% completion',
    curve: [{t:0,pct:100},{t:5,pct:90},{t:10,pct:75},{t:12,pct:32},{t:15,pct:22},{t:20,pct:14},{t:30,pct:9},{t:45,pct:5}],
    completion: 5 },
  { key: 'progress',      label: 'Progress bar only',              effortDays: 0.5, mechanic: 'Visible activity · holds early',
    curve: [{t:0,pct:100},{t:5,pct:96},{t:10,pct:88},{t:12,pct:50},{t:15,pct:42},{t:20,pct:32},{t:30,pct:24},{t:45,pct:18}],
    completion: 18 },
  { key: 'progressETA',   label: 'Progress bar + time estimate',   effortDays: 1, mechanic: 'Answers both unspoken questions',
    curve: [{t:0,pct:100},{t:5,pct:98},{t:10,pct:92},{t:12,pct:75},{t:15,pct:68},{t:20,pct:58},{t:30,pct:48},{t:45,pct:38}],
    completion: 38 },
  { key: 'fasterBackend', label: 'Optimise backend (3× faster)',   effortDays: 14, mechanic: 'Process completes at 15s · same silence',
    curve: [{t:0,pct:100},{t:5,pct:90},{t:10,pct:75},{t:12,pct:32},{t:15,pct:28},{t:20,pct:28},{t:30,pct:28},{t:45,pct:28}],
    completion: 28 },
  { key: 'emailDone',     label: 'Email user when done',           effortDays: 3, mechanic: 'Removes the wait · 40% never return',
    curve: [{t:0,pct:100},{t:5,pct:95},{t:10,pct:90},{t:12,pct:88},{t:15,pct:86},{t:20,pct:84},{t:30,pct:82},{t:45,pct:80}],
    completion: 48 }, // 80% × 60% return rate
];

const DropOffChartMockup = () => {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [activeFix, setActiveFix] = useState<FixKey>('none');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const baseline = DROP_OFF_FIXES[0];
  const chosen   = DROP_OFF_FIXES.find(f => f.key === activeFix) ?? baseline;
  const delta    = chosen.completion - baseline.completion;
  const costPerPt = chosen.effortDays > 0 ? chosen.effortDays / Math.max(0.1, delta) : 0;
  const verdict =
    chosen.key === 'none'          ? 'baseline'    :
    chosen.key === 'progress'      ? 'partial-win' :
    chosen.key === 'progressETA'   ? 'best-roi'    :
    chosen.key === 'fasterBackend' ? 'over-invested':
    'side-effect';

  const maxH = 180;
  const timeAxis = [0, 5, 10, 12, 15, 20, 30, 45];

  // ─── Build SVG polyline points from a curve ─────────────────────────
  const W = 100; const H = 100; // viewBox-relative units
  const curveToPath = (pts: { t: number; pct: number }[]) => {
    const tMin = 0, tMax = 45;
    return pts.map(p => {
      const x = ((p.t - tMin) / (tMax - tMin)) * W;
      const y = ((100 - p.pct) / 100) * H;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
  };

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div ref={ref}>
        <div style={{
          background: '#111827', borderRadius: '12px', padding: '24px',
          border: '1px solid #1F2D42', boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>
                Kiran · User Retention vs Fix Choice
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

          {/* Chart — SVG overlay of baseline + chosen */}
          <div style={{ position: 'relative' as const, height: `${maxH + 40}px`, paddingLeft: 32 }}>
            {/* Y-axis labels */}
            {[100, 75, 50, 25, 0].map(v => (
              <div key={v} style={{
                position: 'absolute' as const, left: 0, top: `${((100 - v) / 100) * maxH}px`,
                fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)',
                transform: 'translateY(-50%)', userSelect: 'none' as const,
              }}>{v}%</div>
            ))}
            {/* Grid */}
            {[75, 50, 25].map(v => (
              <div key={v} style={{
                position: 'absolute' as const,
                left: 32, right: 0,
                top: `${((100 - v) / 100) * maxH}px`,
                height: '1px', background: 'rgba(255,255,255,0.05)',
              }} />
            ))}
            {/* 12s drop cliff marker */}
            <div style={{
              position: 'absolute' as const,
              left: `${32 + (12 / 45) * (100 - 32 / (maxH / maxH)) }px`,
              top: 0, height: `${maxH}px`, width: 1,
              background: 'rgba(224,122,95,0.4)',
            }} />
            {/* SVG overlay */}
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: 'absolute' as const, left: 32, right: 0, top: 0, width: 'calc(100% - 32px)', height: `${maxH}px`, overflow: 'visible' }}>
              {/* Baseline (always shown, dim) */}
              <polyline
                points={curveToPath(baseline.curve)}
                fill="none"
                stroke="rgba(224,122,95,0.5)"
                strokeWidth={0.6}
                strokeDasharray="1.5,1.2"
                vectorEffect="non-scaling-stroke"
              />
              {/* Chosen fix curve */}
              {activeFix !== 'none' && (
                <>
                  <polyline
                    points={curveToPath(chosen.curve)}
                    fill="none"
                    stroke="#28C840"
                    strokeWidth={1.2}
                    vectorEffect="non-scaling-stroke"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(40,200,64,0.45))' }}
                    strokeDashoffset={animated ? 0 : 400}
                    strokeDasharray={400}
                  />
                  {/* End markers */}
                  {chosen.curve.map(p => (
                    <circle key={p.t} cx={(p.t / 45) * W} cy={((100 - p.pct) / 100) * H} r={0.9} fill="#28C840" vectorEffect="non-scaling-stroke" />
                  ))}
                </>
              )}
              {/* Baseline markers */}
              {baseline.curve.map(p => (
                <circle key={p.t} cx={(p.t / 45) * W} cy={((100 - p.pct) / 100) * H} r={0.7} fill="rgba(224,122,95,0.65)" vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            {/* X-axis labels */}
            <div style={{ position: 'absolute' as const, left: 32, right: 0, top: `${maxH + 8}px`, display: 'flex', justifyContent: 'space-between' }}>
              {timeAxis.map(t => (
                <span key={t} style={{ fontFamily: 'monospace', fontSize: '9px', color: t === 12 ? '#E07A5F' : t === 45 ? '#28C840' : 'rgba(255,255,255,0.35)', fontWeight: (t === 12 || t === 45) ? 700 : 400 }}>{t}s</span>
              ))}
            </div>
          </div>

          {/* Body — fixes + result */}
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 220px', gap: 18 }}>
            {/* Fix picker */}
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', marginBottom: 8 }}>PICK YOUR FIX</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {DROP_OFF_FIXES.map(f => {
                  const on = f.key === activeFix;
                  const isOverInvest = f.effortDays >= 7;
                  return (
                    <button key={f.key} onClick={() => setActiveFix(f.key)} style={{
                      appearance: 'none', cursor: 'pointer', textAlign: 'left' as const,
                      background: on ? 'rgba(40,200,64,0.12)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${on ? '#28C840' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 6, padding: '8px 10px', fontFamily: 'inherit',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: on ? '#28C840' : 'rgba(255,255,255,0.85)' }}>{f.label}</span>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700,
                          color: isOverInvest ? '#E07A5F' : f.effortDays <= 1 ? '#28C840' : '#FBBF24',
                          background: isOverInvest ? 'rgba(224,122,95,0.10)' : f.effortDays <= 1 ? 'rgba(40,200,64,0.10)' : 'rgba(251,191,36,0.10)',
                          padding: '1px 6px', borderRadius: 3, whiteSpace: 'nowrap' as const,
                        }}>{f.effortDays === 0 ? '—' : `${f.effortDays}d`}</span>
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1.45 }}>{f.mechanic}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Result */}
            <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', marginBottom: 8 }}>RESULT vs BASELINE</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, color: delta > 0 ? '#28C840' : 'rgba(255,255,255,0.4)', lineHeight: 1 }}>{chosen.completion}%</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: delta > 0 ? '#28C840' : delta < 0 ? '#E07A5F' : 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
                  {delta > 0 ? `+${delta}` : delta}pts
                </span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>completion at 45s</div>
              {chosen.effortDays > 0 && delta > 0 && (
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 10, lineHeight: 1.5 }}>
                  {chosen.effortDays}d effort · {costPerPt.toFixed(2)}d per +1pt
                </div>
              )}
              {/* Verdict */}
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10, lineHeight: 1.55,
                padding: '6px 8px', borderRadius: 5,
                background: verdict === 'best-roi' ? 'rgba(40,200,64,0.10)' : verdict === 'partial-win' ? 'rgba(251,191,36,0.08)' : verdict === 'over-invested' ? 'rgba(224,122,95,0.10)' : verdict === 'side-effect' ? 'rgba(251,191,36,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${verdict === 'best-roi' ? 'rgba(40,200,64,0.35)' : verdict === 'partial-win' ? 'rgba(251,191,36,0.30)' : verdict === 'over-invested' ? 'rgba(224,122,95,0.30)' : verdict === 'side-effect' ? 'rgba(251,191,36,0.30)' : 'rgba(255,255,255,0.10)'}`,
                color: verdict === 'best-roi' ? '#28C840' : verdict === 'partial-win' ? '#FBBF24' : verdict === 'over-invested' ? '#E07A5F' : verdict === 'side-effect' ? '#FBBF24' : 'rgba(255,255,255,0.6)',
              }}>
                {verdict === 'baseline'      && 'Status quo. The 12s cliff stays — 95% never finish.'}
                {verdict === 'partial-win'   && 'Cheap win. Halves the cliff but no time anchor.'}
                {verdict === 'best-roi'      && 'Best ROI. 1 day of design beats 14 days of infra.'}
                {verdict === 'over-invested' && 'Expensive. 14d to gain 23pts — and silence still drives drop-off at the new 15s mark.'}
                {verdict === 'side-effect'   && 'Removes the wait but ~40% never come back. Real completion ≈ 48%.'}
              </div>
            </div>
          </div>

          {/* Legend strip */}
          <div style={{ marginTop: 12, display: 'flex', gap: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: 'rgba(255,255,255,0.5)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 18, height: 1.5, background: 'rgba(224,122,95,0.5)', borderTop: '1.5px dashed rgba(224,122,95,0.5)' }} /> baseline</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 18, height: 1.5, background: '#28C840' }} /> chosen fix</span>
            <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)' }}>↓ user wait time →</span>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─── SpecComparisonMockup — REAL spec-completeness sandbox ──────────────
// The learner writes the Step 2 spec themselves in a real <textarea>. A
// deterministic linter regex-scans for the five state declarations
// (loading · error · success · empty · edge). Each detected state lights
// up a check; missing states light up a warning. The phone preview compiles
// LIVE from what the spec mentions — loading bar appears if "loading" is
// declared, error path appears if "error" is named, etc. Goal: 5/5 ship-
// ready. Pedagogically: spec completeness is binary per state, not a vibe.
const SpecComparisonMockup = () => {
  const STARTER = 'Step 2: Analyze recording.';
  const COMPLETE_EXAMPLE = `Step 2: Analyze recording.

Loading state:
  Show: "Analyzing your recording…"
  Progress bar with % complete
  Time estimate: "~30 seconds"

Error state:
  Headline: "Analysis failed."
  Body: "Reconnect and tap Retry."
  Primary action: Retry

Success state:
  Headline: "Analysis complete."
  Action: "View insights →"
  Show: 3 coaching moments summary

Empty state (new user, no recording yet):
  Headline: "Upload your first session."
  CTA: Upload recording

Edge: File > 4GB
  Validation on upload + email-when-done option.`;

  const [spec, setSpec] = useState(STARTER);

  // ─── Deterministic spec linter ───────────────────────────────────────
  const sigs = useMemo(() => ({
    hasLoading: /\bloading\b|progress|spinner|analyzing|processing/i.test(spec),
    hasError:   /\berror\b|fail(ed|ure)?|retry/i.test(spec),
    hasSuccess: /\bsuccess\b|complete|finished|done|view (?:insights|results)/i.test(spec),
    hasEmpty:   /\bempty\b|first time|first session|no recording|new user/i.test(spec),
    hasEdge:    /\bedge\b|large file|\d+\s?gb|timeout|exceeds|upload limit/i.test(spec),
  }), [spec]);
  const score = (sigs.hasLoading?1:0) + (sigs.hasError?1:0) + (sigs.hasSuccess?1:0) + (sigs.hasEmpty?1:0) + (sigs.hasEdge?1:0);

  const stateChecks: { key: keyof typeof sigs; label: string; hint: string }[] = [
    { key: 'hasLoading', label: 'Loading',  hint: 'name "loading" + visible signal'  },
    { key: 'hasError',   label: 'Error',    hint: 'name the failure + recovery path' },
    { key: 'hasSuccess', label: 'Success',  hint: 'name the win + next action'       },
    { key: 'hasEmpty',   label: 'Empty',    hint: 'first-time / no-data state'       },
    { key: 'hasEdge',    label: 'Edge',     hint: 'large file / timeout / limit'     },
  ];

  // ─── Phone preview — compiles from sigs (what the engineer would build) ──
  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #DFE1E6', boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)' }}>
        {/* Header */}
        <div style={{ background: '#1C2938', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
              <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em' }}>EdSpark Spec · Onboarding · Step 2</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: score === 5 ? '#28C840' : score >= 3 ? '#FBBF24' : '#E07A5F', fontWeight: 700, letterSpacing: '0.08em' }}>{score}/5 states specced</span>
          </div>
        </div>

        {/* Body: editor | preview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px' }}>
          {/* Editor */}
          <div style={{ background: '#FAFAFA', borderRight: '1px solid #E8E8E8', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: '#6E7681' }}>YOUR SPEC · editable</span>
              <div style={{ display: 'flex', gap: 5 }}>
                <button onClick={() => setSpec(STARTER)} style={{ appearance: 'none', cursor: 'pointer', background: 'transparent', border: '1px solid #E0E0E0', color: '#6E7681', borderRadius: 4, padding: '2px 8px', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700 }}>reset</button>
                <button onClick={() => setSpec(COMPLETE_EXAMPLE)} style={{ appearance: 'none', cursor: 'pointer', background: 'transparent', border: '1px solid #E0E0E0', color: '#6E7681', borderRadius: 4, padding: '2px 8px', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700 }}>load complete</button>
              </div>
            </div>
            <textarea
              value={spec}
              onChange={e => setSpec(e.target.value)}
              spellCheck={false}
              style={{
                width: '100%', boxSizing: 'border-box', minHeight: 280, resize: 'vertical' as const,
                padding: '12px 14px', background: 'var(--ed-card)', border: '1px solid #E0E0E0',
                borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5,
                color: '#333', lineHeight: 1.75, outline: 'none',
              }}
            />
            {/* Linter strip */}
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
              {stateChecks.map(c => {
                const on = sigs[c.key];
                return (
                  <span key={String(c.key)} title={c.hint} style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700,
                    padding: '3px 8px', borderRadius: 4,
                    background: on ? 'rgba(13,122,90,0.10)' : 'rgba(224,122,95,0.08)',
                    color: on ? '#0D7A5A' : '#B23F22',
                    border: `1px solid ${on ? 'rgba(13,122,90,0.30)' : 'rgba(224,122,95,0.28)'}`,
                  }}>{on ? '✓' : '✗'} {c.label}</span>
                );
              })}
            </div>
          </div>

          {/* Preview compiled from sigs */}
          <div style={{ background: '#F8FFF9', padding: '14px 16px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: '#0D7A5A', marginBottom: 10 }}>WHAT ENGINEERING SHIPS</div>
            <div style={{ background: '#1A1A2E', borderRadius: 16, padding: 3, border: '3px solid #2A2A4E' }}>
              <div style={{ background: '#FFFFFF', borderRadius: 13, minHeight: 250, padding: '14px 14px 18px', position: 'relative' as const }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1C1814', marginBottom: 4 }}>Step 2: Analyze</div>
                <div style={{ fontSize: 10, color: '#8A8580', marginBottom: 12 }}>Click to begin AI analysis</div>
                <div style={{ background: '#E07A5F', color: '#fff', fontWeight: 700, padding: '6px 14px', borderRadius: 6, fontSize: 12, textAlign: 'center' as const, marginBottom: 12 }}>Analyze</div>
                {/* States the spec named */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                  {sigs.hasLoading && (
                    <div style={{ padding: '6px 8px', background: 'rgba(58,134,255,0.06)', borderLeft: '2px solid #3A86FF', borderRadius: 3 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#3A86FF', fontWeight: 700, marginBottom: 2 }}>LOADING</div>
                      <div style={{ fontSize: 10, color: '#555' }}>Progress bar · "Analyzing…" · ~30s</div>
                    </div>
                  )}
                  {sigs.hasError && (
                    <div style={{ padding: '6px 8px', background: 'rgba(239,68,68,0.06)', borderLeft: '2px solid #EF4444', borderRadius: 3 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#EF4444', fontWeight: 700, marginBottom: 2 }}>ERROR</div>
                      <div style={{ fontSize: 10, color: '#555' }}>Failure copy + recovery path</div>
                    </div>
                  )}
                  {sigs.hasSuccess && (
                    <div style={{ padding: '6px 8px', background: 'rgba(40,200,64,0.06)', borderLeft: '2px solid #28C840', borderRadius: 3 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#28C840', fontWeight: 700, marginBottom: 2 }}>SUCCESS</div>
                      <div style={{ fontSize: 10, color: '#555' }}>Confirmation + "View insights →"</div>
                    </div>
                  )}
                  {sigs.hasEmpty && (
                    <div style={{ padding: '6px 8px', background: 'rgba(14,165,233,0.06)', borderLeft: '2px solid #0EA5E9', borderRadius: 3 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#0EA5E9', fontWeight: 700, marginBottom: 2 }}>EMPTY</div>
                      <div style={{ fontSize: 10, color: '#555' }}>First-time onboarding CTA</div>
                    </div>
                  )}
                  {sigs.hasEdge && (
                    <div style={{ padding: '6px 8px', background: 'rgba(249,115,22,0.06)', borderLeft: '2px solid #F97316', borderRadius: 3 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#F97316', fontWeight: 700, marginBottom: 2 }}>EDGE</div>
                      <div style={{ fontSize: 10, color: '#555' }}>Pre-upload validation</div>
                    </div>
                  )}
                  {score < 5 && (
                    <div style={{ padding: '6px 8px', background: 'rgba(224,122,95,0.06)', border: '1px dashed rgba(224,122,95,0.3)', borderRadius: 3 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#E07A5F', fontWeight: 700, marginBottom: 2 }}>UNSPECCED ({5 - score})</div>
                      <div style={{ fontSize: 10, color: '#E07A5F', lineHeight: 1.45 }}>Engineer ad-libs: gray button · 500 errors · unknown success path.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: score === 5 ? '#0D7A5A' : '#6E7681', lineHeight: 1.55 }}>
              {score === 5 ? <>✓ Ship-ready. All 5 states declared — engineering has no decisions to ad-lib.</> :
               score >= 3 ? <>Almost. Add the {5 - score} missing state{score === 4 ? '' : 's'}.</> :
               <>Spec the missing states. Anything you don&apos;t write, an engineer will make up.</>}
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// (BeforeAfterMockup body removed)

// ─── MetricsComparisonMockup — REAL multi-metric impact scoreboard ──────
// One small fix moves more than one number. The learner picks which metric
// to inspect; each one has its own before/after, its own delta, its own
// story. The pedagogical point — UX fixes have second-order effects on
// support load, NPS, and retention that don't show up in the headline
// metric — is emergent from clicking through the four tabs.
type MetricKey = 'completion' | 'timeToFinish' | 'supportTickets' | 'rageRate';
type MetricDef = {
  key: MetricKey; label: string; before: number; after: number; unit: string;
  goodDirection: 'up' | 'down'; story: string;
};
const COMPARISON_METRICS: MetricDef[] = [
  { key: 'completion',      label: 'Onboarding completion', before: 30, after: 58, unit: '%',  goodDirection: 'up',
    story: 'Headline metric. The reason the fix shipped — but not the only thing that moved.' },
  { key: 'timeToFinish',    label: 'Median time to finish', before: 12, after: 47, unit: 's',  goodDirection: 'up',
    story: 'Users who stay now actually wait the full process — instead of bailing at 12s.' },
  { key: 'supportTickets',  label: 'Onboarding tickets / wk', before: 38, after: 9, unit: '',   goodDirection: 'down',
    story: '"Is it stuck?" disappeared from the inbox. Three lines of copy did what an FAQ couldn\'t.' },
  { key: 'rageRate',        label: 'Sessions with rage clicks', before: 41, after: 6, unit: '%', goodDirection: 'down',
    story: 'Rage clicks were the loudest signal — now they\'re a fringe case. The button didn\'t change; only the feedback did.' },
];

const MetricsComparisonMockup = () => {
  const [activeKey, setActiveKey] = useState<MetricKey>('completion');
  const [visible, setVisible] = useState(false);
  const [animTick, setAnimTick] = useState(0);
  const [animBefore, setAnimBefore] = useState(0);
  const [animAfter, setAnimAfter] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const active = COMPARISON_METRICS.find(m => m.key === activeKey)!;

  useEffect(() => {
    if (!visible) return;
    const dur = 1100;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setAnimBefore(Math.round(ease * active.before));
      setAnimAfter(Math.round(ease * active.after));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, animTick, active.before, active.after]);

  const switchMetric = (k: MetricKey) => {
    setActiveKey(k);
    setAnimBefore(0); setAnimAfter(0);
    setAnimTick(n => n + 1);
  };

  const delta = active.after - active.before;
  const isImprovement = active.goodDirection === 'up' ? delta > 0 : delta < 0;
  const beforeColor = isImprovement ? '#E07A5F' : '#28C840';
  const afterColor  = isImprovement ? '#28C840' : '#E07A5F';

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div ref={ref}>
        <div style={{
          background: '#111827', borderRadius: 12, padding: '24px 22px',
          border: '1px solid #1F2D42', boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)',
        }}>
          {/* Metric tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em' }}>ONE WEEK LATER · 4 METRICS MOVED</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.30)' }}>n=1,240 · cohort match</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 18 }}>
            {COMPARISON_METRICS.map(m => {
              const on = m.key === activeKey;
              const mDelta = m.after - m.before;
              const mGood = m.goodDirection === 'up' ? mDelta > 0 : mDelta < 0;
              const colour = mGood ? '#28C840' : '#E07A5F';
              return (
                <button key={m.key} onClick={() => switchMetric(m.key)} style={{
                  appearance: 'none', cursor: 'pointer', textAlign: 'left' as const,
                  background: on ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${on ? colour : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 7, padding: '8px 10px', fontFamily: 'inherit',
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9.5, color: on ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)', lineHeight: 1.3, marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: colour, fontWeight: 700 }}>{mDelta > 0 ? '+' : ''}{mDelta}{m.unit ? m.unit : ''}</div>
                </button>
              );
            })}
          </div>

          {/* Before / after cards for active metric */}
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' as const, marginBottom: 18 }}>
            <div style={{ flex: 1, minWidth: 160, background: `${beforeColor}14`, border: `1px solid ${beforeColor}40`, borderRadius: 10, padding: 18, textAlign: 'center' as const }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: `${beforeColor}B3`, letterSpacing: '0.12em', marginBottom: 10 }}>BEFORE FIX</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 48, fontWeight: 800, color: beforeColor, lineHeight: 1 }}>{animBefore}{active.unit}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: `${beforeColor}80`, marginTop: 6 }}>Original launch</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', minWidth: 70 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: isImprovement ? '#28C840' : '#E07A5F' }}>{delta > 0 ? '+' : ''}{delta}{active.unit}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{active.goodDirection === 'up' ? '↑ better' : '↓ better'}</div>
            </div>
            <div style={{ flex: 1, minWidth: 160, background: `${afterColor}14`, border: `1px solid ${afterColor}40`, borderRadius: 10, padding: 18, textAlign: 'center' as const }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: `${afterColor}B3`, letterSpacing: '0.12em', marginBottom: 10 }}>AFTER FIX</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 48, fontWeight: 800, color: afterColor, lineHeight: 1 }}>{animAfter}{active.unit}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: `${afterColor}80`, marginTop: 6 }}>After loading state fix</div>
            </div>
          </div>

          {/* Story */}
          <div style={{ padding: '11px 14px', background: 'rgba(40,200,64,0.05)', border: '1px dashed rgba(40,200,64,0.20)', borderRadius: 7 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(40,200,64,0.7)', letterSpacing: '0.1em', marginBottom: 5 }}>WHY THIS MOVED</div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.55, fontFamily: 'inherit' }}>{active.story}</div>
          </div>

          <div style={{ marginTop: 12, textAlign: 'center' as const, fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>
            Change: progress feedback only · Backend unchanged · Feature unchanged
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─── FigmaMockup — REAL "design the After frame" sandbox ─────────────────
// The learner sits in Maya's Figma seat. The Before frame is fixed (silent
// button). For the After frame, the learner toggles which design tokens to
// drop in from a real component palette: progress bar, status label, time
// estimate, spinner, cancel, oversized hero icon, success haptic. The After
// frame composes LIVE from those choices. A real rubric scores against the
// minimum-viable fix Maya actually shipped (progress + status + time = 3
// elements). Picking more isn't better — over-design has a real "complexity"
// penalty. Goal: match Maya's 3-component fix exactly = "min viable" verdict.
type FigmaToken = {
  id: 'progressBar' | 'statusLabel' | 'timeEstimate' | 'spinner' | 'cancelBtn' | 'heroIcon' | 'successHaptic';
  label: string; mayaIncluded: boolean; complexity: number; // dev-minutes
};
const FIGMA_TOKENS: FigmaToken[] = [
  { id: 'progressBar',   label: 'Progress bar',    mayaIncluded: true,  complexity: 10 },
  { id: 'statusLabel',   label: 'Status label',    mayaIncluded: true,  complexity: 5  },
  { id: 'timeEstimate',  label: 'Time estimate',   mayaIncluded: true,  complexity: 5  },
  { id: 'spinner',       label: 'Spinner',         mayaIncluded: false, complexity: 8  },
  { id: 'cancelBtn',     label: 'Cancel button',   mayaIncluded: false, complexity: 15 },
  { id: 'heroIcon',      label: 'Hero icon',       mayaIncluded: false, complexity: 12 },
  { id: 'successHaptic', label: 'Success haptic',  mayaIncluded: false, complexity: 20 },
];

const FigmaMockup = () => {
  const [picked, setPicked] = useState<Record<FigmaToken['id'], boolean>>({
    progressBar: false, statusLabel: false, timeEstimate: false, spinner: false, cancelBtn: false, heroIcon: false, successHaptic: false,
  });
  const toggle = (id: FigmaToken['id']) => setPicked(p => ({ ...p, [id]: !p[id] }));

  // ─── Rubric vs Maya's shipped fix ─────────────────────────────────────
  const requiredHit = FIGMA_TOKENS.filter(t => t.mayaIncluded).every(t => picked[t.id]);
  const extras = FIGMA_TOKENS.filter(t => !t.mayaIncluded && picked[t.id]).length;
  const missing = FIGMA_TOKENS.filter(t => t.mayaIncluded && !picked[t.id]).length;
  const devMinutes = FIGMA_TOKENS.reduce((sum, t) => sum + (picked[t.id] ? t.complexity : 0), 0);
  const verdict = !requiredHit ? 'incomplete' : extras === 0 ? 'minViable' : extras <= 2 ? 'over-design' : 'kitchen-sink';

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #3C3C3C', boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)' }}>
        {/* Figma toolbar */}
        <div style={{ background: '#2C2C2C', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #3C3C3C' }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          </div>
          <svg width="12" height="18" viewBox="0 0 12 18" fill="none">
            <path d="M3 18C4.65685 18 6 16.6569 6 15V12H3C1.34315 12 0 13.3431 0 15C0 16.6569 1.34315 18 3 18Z" fill="#0ACF83"/>
            <path d="M0 9C0 7.34315 1.34315 6 3 6H6V12H3C1.34315 12 0 10.6569 0 9Z" fill="#A259FF"/>
            <path d="M0 3C0 1.34315 1.34315 0 3 0H6V6H3C1.34315 6 0 4.65685 0 3Z" fill="#F24E1E"/>
            <path d="M6 0H9C10.6569 0 12 1.34315 12 3C12 4.65685 10.6569 6 9 6H6V0Z" fill="#FF7262"/>
            <path d="M12 9C12 10.6569 10.6569 12 9 12C7.34315 12 6 10.6569 6 9C6 7.34315 7.34315 6 9 6C10.6569 6 12 7.34315 12 9Z" fill="#1ABCFE"/>
          </svg>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.6)', flex: 1, textAlign: 'center' as const }}>EdSpark · Analyze Flow · loading-state-fix.fig</div>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>100%</div>
          <div style={{ background: '#18A0FB', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 5, fontFamily: 'monospace' }}>Share</div>
        </div>

        {/* Main */}
        <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr 220px', height: 380, background: '#1E1E1E' }}>
          {/* Layers — auto-built from picked tokens */}
          <div style={{ background: '#2C2C2C', borderRight: '1px solid #3C3C3C', padding: '10px 0', overflow: 'auto' as const }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', padding: '0 10px', marginBottom: 8, letterSpacing: '0.1em' }}>LAYERS</div>
            <div style={{ padding: '3px 8px', fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>📁 Analyze Flow</div>
            <div style={{ padding: '3px 18px', fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>📄 Before</div>
            <div style={{ padding: '2px 28px', fontFamily: 'monospace', fontSize: 9.5, color: 'rgba(255,255,255,0.35)' }}>▭ Button</div>
            <div style={{ padding: '2px 28px', fontFamily: 'monospace', fontSize: 9.5, color: 'rgba(255,255,255,0.35)' }}>T Label</div>
            <div style={{ padding: '3px 18px', fontFamily: 'monospace', fontSize: 10, color: '#18A0FB', background: 'rgba(24,160,251,0.10)' }}>📄 After ✦</div>
            <div style={{ padding: '2px 28px', fontFamily: 'monospace', fontSize: 9.5, color: 'rgba(255,255,255,0.45)' }}>▭ Button</div>
            <div style={{ padding: '2px 28px', fontFamily: 'monospace', fontSize: 9.5, color: 'rgba(255,255,255,0.45)' }}>T Label</div>
            {FIGMA_TOKENS.filter(t => picked[t.id]).map(t => (
              <div key={t.id} style={{ padding: '2px 28px', fontFamily: 'monospace', fontSize: 9.5, color: '#A259FF' }}>
                {t.id === 'progressBar' ? '░ ' : t.id === 'statusLabel' || t.id === 'timeEstimate' ? 'T ' : t.id === 'spinner' ? '◌ ' : t.id === 'cancelBtn' ? '▭ ' : t.id === 'heroIcon' ? '◇ ' : '🔔 '}
                {t.label}
              </div>
            ))}
            {Object.values(picked).every(v => !v) && (
              <div style={{ padding: '6px 18px', fontFamily: 'monospace', fontSize: 9, color: 'rgba(224,122,95,0.7)', fontStyle: 'italic' as const }}>(empty — pick tokens →)</div>
            )}
          </div>

          {/* Canvas */}
          <div style={{ background: '#383838', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, padding: 20 }}>
            {/* Before */}
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textAlign: 'center' as const }}>BEFORE</div>
              <div style={{ width: 150, background: '#FAFAFA', borderRadius: 8, padding: '20px 16px' }}>
                <div style={{ fontSize: 10, color: '#666', marginBottom: 10, fontFamily: 'monospace' }}>Step 2: Analyze</div>
                <div style={{ background: '#0097A7', color: '#fff', borderRadius: 5, padding: '7px 12px', fontSize: 11, fontWeight: 600, textAlign: 'center' as const, fontFamily: 'monospace', marginBottom: 10 }}>Analyze ▶</div>
                <div style={{ height: 26, border: '1px dashed rgba(224,122,95,0.4)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#E07A5F' }}>nothing…</span>
                </div>
              </div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 20 }}>→</div>
            {/* After — composes from picked tokens */}
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#18A0FB', marginBottom: 6, textAlign: 'center' as const }}>AFTER ✦ your design</div>
              <div style={{ width: 170, background: '#FAFAFA', borderRadius: 8, padding: '18px 16px', border: '2px solid #18A0FB', boxShadow: '0 0 0 2px rgba(24,160,251,0.25)' }}>
                <div style={{ fontSize: 10, color: '#666', marginBottom: 10, fontFamily: 'monospace' }}>Step 2: Analyze</div>
                {picked.heroIcon && (
                  <div style={{ width: 40, height: 40, margin: '0 auto 10px', borderRadius: '50%', background: 'linear-gradient(135deg, #0097A7, #00BCD4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>◇</div>
                )}
                <div style={{ background: '#0097A7', color: '#fff', borderRadius: 5, padding: '7px 12px', fontSize: 11, fontWeight: 600, textAlign: 'center' as const, fontFamily: 'monospace', marginBottom: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                  {picked.spinner && (
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', width: 8, height: 8, border: '1.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%' }} />
                  )}
                  Analyzing…
                </div>
                {picked.statusLabel && (
                  <div style={{ fontSize: 9.5, color: '#1C1814', fontWeight: 600, textAlign: 'center' as const, marginBottom: 4 }}>Extracting coaching moments…</div>
                )}
                {picked.progressBar && (
                  <div style={{ height: 4, background: '#E8E8E8', borderRadius: 2, marginBottom: 6, overflow: 'hidden' }}>
                    <motion.div animate={{ width: ['10%', '70%', '90%'] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut' }} style={{ height: '100%', background: '#0097A7' }} />
                  </div>
                )}
                {picked.timeEstimate && (
                  <div style={{ fontFamily: 'monospace', fontSize: 8.5, color: '#888', textAlign: 'center' as const, marginBottom: picked.cancelBtn ? 8 : 0 }}>~30 seconds</div>
                )}
                {picked.cancelBtn && (
                  <div style={{ marginTop: 6, fontFamily: 'monospace', fontSize: 9, color: '#666', textAlign: 'center' as const, padding: '3px 10px', border: '1px solid #DDD', borderRadius: 4 }}>Cancel</div>
                )}
                {picked.successHaptic && (
                  <div style={{ marginTop: 6, fontSize: 8, color: '#28C840', textAlign: 'center' as const, fontFamily: 'monospace' }}>🔔 haptic feedback</div>
                )}
                {Object.values(picked).every(v => !v) && (
                  <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: 8, color: '#E07A5F' }}>same as before</div>
                )}
              </div>
            </div>
          </div>

          {/* Properties — token palette */}
          <div style={{ background: '#2C2C2C', borderLeft: '1px solid #3C3C3C', padding: 10, overflow: 'auto' as const }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 8, letterSpacing: '0.1em' }}>COMPONENT TOKENS</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
              {FIGMA_TOKENS.map(t => {
                const on = picked[t.id];
                return (
                  <button key={t.id} onClick={() => toggle(t.id)} style={{
                    appearance: 'none', cursor: 'pointer', textAlign: 'left' as const,
                    background: on ? 'rgba(162,89,255,0.16)' : 'rgba(0,0,0,0.20)',
                    border: `1px solid ${on ? '#A259FF' : '#3C3C3C'}`,
                    borderRadius: 5, padding: '5px 8px',
                    fontFamily: 'inherit',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 10.5, color: on ? '#C8A8FF' : 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{t.label}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 8.5, color: on ? '#A259FF' : 'rgba(255,255,255,0.25)' }}>{t.complexity}m</span>
                  </button>
                );
              })}
            </div>
            {/* Verdict */}
            <div style={{ marginTop: 10, padding: '6px 8px', borderRadius: 5, background: verdict === 'minViable' ? 'rgba(40,200,64,0.12)' : verdict === 'over-design' ? 'rgba(251,191,36,0.10)' : verdict === 'kitchen-sink' ? 'rgba(224,122,95,0.10)' : 'rgba(255,255,255,0.04)', border: `1px solid ${verdict === 'minViable' ? 'rgba(40,200,64,0.35)' : verdict === 'over-design' ? 'rgba(251,191,36,0.30)' : verdict === 'kitchen-sink' ? 'rgba(224,122,95,0.30)' : '#3C3C3C'}` }}>
              <div style={{ fontFamily: 'monospace', fontSize: 8.5, color: verdict === 'minViable' ? '#28C840' : verdict === 'over-design' ? '#FBBF24' : verdict === 'kitchen-sink' ? '#E07A5F' : 'rgba(255,255,255,0.5)', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 3 }}>
                {verdict === 'minViable' ? 'MIN VIABLE ✓' : verdict === 'over-design' ? 'OVER-DESIGN' : verdict === 'kitchen-sink' ? 'KITCHEN-SINK' : 'INCOMPLETE'}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 9.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>
                {verdict === 'minViable' ? <>Matches Maya&apos;s shipped fix. 3 elements · {devMinutes}m dev.</> :
                 verdict === 'over-design' ? <>Above Maya&apos;s 3-element minimum. {extras} extra · {devMinutes}m dev for marginal lift.</> :
                 verdict === 'kitchen-sink' ? <>Everything &gt; nothing — but {devMinutes}m of design debt. Strip back.</> :
                 missing > 0 ? <>{missing} of Maya&apos;s 3 elements still missing.</> :
                 <>Pick the elements you&apos;d ship.</>}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: '#2C2C2C', padding: '6px 14px', borderTop: '1px solid #3C3C3C', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
          <span>Maya Sharma · live edit</span>
          <span style={{ color: Object.values(picked).filter(Boolean).length === 3 && requiredHit ? '#28C840' : '#A259FF' }}>✦ {Object.values(picked).filter(Boolean).length} component{Object.values(picked).filter(Boolean).length === 1 ? '' : 's'} added · {devMinutes}m</span>
        </div>
      </div>
    </TiltCard>
  );
};

// (Dead-code LovableAIMockup removed — never rendered)

// (Dead-code SlackUpdateMockup removed — never rendered)

// ─────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────
export default function Track1UXDesign({
  completedSections = new Set<string>(),
}: {
  completedSections?: Set<string>;
}) {
  const donePct = Math.round((completedSections.size / PARTS.length) * 100);
  const nextPart = PARTS.find(p => !completedSections.has(p.id));

  return (
    <article style={{ padding: '0 0 80px' }}>

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

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '14px', textTransform: 'uppercase' as const }}>
            PM Fundamentals &middot; Module 05
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '16px', fontFamily: "'Lora', Georgia, serif" }}>
            UX &amp; Design<br />Collaboration
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '40px' }}>
            &ldquo;If it feels broken, it is broken.&rdquo;
          </p>

          {/* Character row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '40px' }}>
            {([
              { mentor: 'priya' as const, accent: ACCENT,    desc: 'Your protagonist. Figuring it out in real time.' },
              { mentor: 'maya'  as const, accent: '#C85A40', desc: 'Sees what users feel, not what they say.' },
              { mentor: 'kiran' as const, accent: '#3A86FF', desc: 'Brings the number nobody wants to see.' },
              { mentor: 'dev'   as const, accent: '#6E7681', desc: 'Builds exactly what the spec says. No more.' },
              { mentor: 'asha'  as const, accent: '#0097A7', desc: 'Asks the question you haven\'t asked yet.' },
            ]).map(c => (
              <CharacterChip
                name={{ priya: 'Priya', maya: 'Maya', kiran: 'Kiran', dev: 'Dev', asha: 'Asha' }[c.mentor] ?? ''}
                role={{ priya: 'APM · 2 yrs', maya: 'Designer', kiran: 'Data Analyst', dev: 'Engineer', asha: 'AI Mentor' }[c.mentor] ?? ''}
                accent={c.accent}
              >
                <MentorFace mentor={c.mentor} size={52} />
              </CharacterChip>
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
          </div>{/* end flex-1 */}

          {/* Right: floating dark module card */}
          <div style={{ flexShrink: 0, width: '168px', paddingTop: '48px' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="float3d" style={{ transformStyle: 'preserve-3d' }}>
                <div style={{
                  background: 'linear-gradient(145deg, #1A1218 0%, #241228 100%)',
                  borderRadius: '14px', padding: '20px 18px',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE 05</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>UX &amp; Design</div>
                  <div style={{ fontSize: '10px', color: 'rgba(240,232,216,0.45)', marginBottom: '16px' }}>Foundations Track</div>
                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
                    <motion.div animate={{ width: `${donePct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{ height: '100%', background: ACCENT, borderRadius: '1px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {PARTS.map(p => {
                      const done = completedSections.has(p.id);
                      const isNext = p.id === nextPart?.id;
                      return (
                        <div key={p.num} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <div style={{
                            width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                            background: done ? '#0D7A5A' : isNext ? ACCENT : 'rgba(255,255,255,0.06)',
                            border: `1px solid ${done ? '#0D7A5A' : isNext ? ACCENT : 'rgba(255,255,255,0.1)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '7px', color: done || isNext ? '#fff' : 'rgba(255,255,255,0.3)',
                            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                            transition: 'background 0.3s, border-color 0.3s',
                          }}>{done ? '✓' : p.num}</div>
                          <div style={{ fontSize: '9px', color: done ? 'rgba(240,232,216,0.5)' : isNext ? 'rgba(240,232,216,0.9)' : 'rgba(240,232,216,0.3)', lineHeight: 1.3, flex: 1, transition: 'color 0.3s' }}>
                            {p.label.split(' — ')[0]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: '16px', padding: '8px 10px', borderRadius: '6px', background: `${ACCENT}22`, border: `1px solid ${ACCENT}44` }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: ACCENT, fontWeight: 700, marginBottom: '2px' }}>
                      {donePct === 100 ? 'COMPLETE' : 'NEXT UP'}
                    </div>
                    <div style={{ fontSize: '9px', color: 'rgba(240,232,216,0.6)' }}>
                      {donePct === 100 ? 'All 7 parts done' : nextPart ? nextPart.label.split(' — ')[0] : 'The Illusion of Done'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── PART I — The Illusion of "Done" ── */}
      <ChapterSection id="m5-illusion" num="01" accentRgb={ACCENT_RGB} first>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Two weeks after launch. Onboarding completion: 30%. Target: 60%. The office has the quiet
          that follows a &ldquo;successful&rdquo; release. Kiran rotates his laptop. &ldquo;Same users. Same drop-off point. Step 2.&rdquo;
        </SituationCard>

        <FiveStatesSolarSystem />

        {para(<>
          Priya had shipped onboarding improvements with confidence. The numbers improved &mdash; just not enough.
          More importantly, she doesn&apos;t understand why. She knows the what. She doesn&apos;t know the why.
          And those are completely different problems.
        </>)}

        {h2(<>Shipping something is not the same as fixing something</>)}

        <ConversationScene
          mentor="kiran" name="Kiran" role="Data · EdSpark" accent="#3A86FF"
          lines={[
            { speaker: 'priya', text: "We shipped the onboarding update two weeks ago. Why is completion still at 30%?" },
            { speaker: 'other', text: "Same users. Same drop-off. We shipped something — that\u2019s not the same as solving something." },
            { speaker: 'priya', text: "It moved 2 points. That\u2019s something." },
            { speaker: 'other', text: "Against a 30-point gap? That gap is information. It\u2019s telling you the root cause is still there." },
          ]}
        />
        <Avatar
          name="Kiran"
          nameColor="#3A86FF"
          borderColor="#3A86FF"
          content={<>A metric moving in the right direction is not evidence your hypothesis was correct. It might be seasonality, a different cohort, or a different behaviour entirely. Before proposing solutions, ask: what specifically didn\u2019t change for the users who still aren\u2019t completing?</>}
          expandedContent="When a metric underperforms target, that gap is information. It tells you the root cause is still present — you've touched a symptom, not the system."
          conceptId="ux-metric-communication"
          question="Kiran shows you this chart. Completion is 30%, target is 60%. You have a check-in with Rohan in an hour. What do you tell him?"
          options={[
            { text: "Onboarding completion improved after the sprint — we're trending in the right direction.", correct: false, feedback: "Technically true and practically misleading. 2 points against a 30-point gap isn't trending in any meaningful sense. Rohan will ask the right follow-up and you'll have nothing." },
            { text: "We're 30 points below target and don't yet understand why — I'm digging in with Kiran now.", correct: true, feedback: "This is honest and forward-looking. You own the gap, name the unknown, and tell Rohan what's happening next. That's what leadership needs from a PM in this moment." },
            { text: "The original target of 60% was likely too aggressive for a first launch of this type.", correct: false, feedback: "Adjusting the standard before investigating the gap is avoidance. Kiran has the same data and will push back immediately if you don't have an analytical basis for this claim." },
            { text: "I'll have a full analysis ready next sprint — need more data before drawing conclusions.", correct: false, feedback: "You already have data. Asking for more time without naming what you'll investigate reads as hesitation, not rigour. The investigation starts now, not next sprint." },
          ]}
        />

        <ConversationScene
          mentor="asha" name="Asha" role="Senior PM · EdSpark" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "It improved though. Just not enough. Should I ship another fix?" },
            { speaker: 'other', text: "Before diagnosing the fix, diagnose the understanding. Do you know why it improved 2% and not 30%?" },
            { speaker: 'priya', text: "Not exactly." },
            { speaker: 'other', text: "Then you\u2019re guessing. Find the specific friction point that\u2019s still present — before you build anything else." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="#0097A7"
          borderColor="#0097A7"
          content={<>Shipping into an unknown multiplies the chance of another miss. A small improvement against a big gap means something specific is still broken. Find it before you build around it.</>}
          expandedContent="Priya shipped better copy. But the core confusion — not knowing what happens after clicking Analyze — was never touched. Metrics confirmed the gap was still there."
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
      <ChapterSection id="m5-session" num="02" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Maya doesn&apos;t explain. She shows. She plugs in her laptop, opens a session recording, and presses play.
        </SituationCard>

        {h2(<>A system can work perfectly and still fail the user</>)}

        <SessionRecordingMockup />

        <ConversationScene
          mentor="maya" name="Maya" role="Designer · EdSpark" accent="#C85A40"
          lines={[
            { speaker: 'priya', text: "The backend works. The recording gets processed. The system isn\u2019t broken." },
            { speaker: 'other', text: "I didn\u2019t say the system wasn\u2019t working. I said watch what the user does." },
            { speaker: 'priya', text: "They just\u2026 stop. They leave midway." },
            { speaker: 'other', text: "They can\u2019t tell if anything is happening. That\u2019s not a backend problem." },
          ]}
        />
        <Avatar
          name="Maya"
          nameColor="#C85A40"
          borderColor="#C85A40"
          content={<>A session recording is a window into the user\u2019s mental model. The exact moment their model of \u2018what should happen\u2019 collides with the product\u2019s model of \u2018what actually happens\u2019 — that collision is where UX problems live. It\u2019s invisible in any metric.</>}
          expandedContent="Systems can be functionally correct and experientially broken. The backend processed every request successfully. The user had zero information about it. Those aren't the same world."
          conceptId="ux-designer-collaboration"
          question="Maya asks for two hours next week to review session recordings together. Rohan says the priority is shipping the next feature. Who do you side with?"
          options={[
            { text: "Rohan — the team needs shipping velocity, especially during an onboarding dip.", correct: false, feedback: "Shipping more features into a broken onboarding will not fix the broken onboarding. You'll have more features for fewer people to discover." },
            { text: "Maya — two hours of session analysis now could prevent a month of wrong fixes later.", correct: true, feedback: "Maya isn't asking for a redesign project — she's asking for enough information to diagnose before prescribing. That investment pays off in targeted fixes, not guesses." },
            { text: "Neither — propose a 30-minute session to balance analysis with velocity.", correct: false, feedback: "Session reviews need enough depth to find patterns across users. Cutting to 30 minutes optimises for the feeling of progress, not actual progress." },
            { text: "Maya — but only if she commits to having a design ready by end of the sprint.", correct: false, feedback: "You've turned analysis into a deliverable commitment. Maya can't promise a fix before the analysis is done — that's precisely the point of doing the analysis first." },
          ]}
        />

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

        <ConversationScene
          mentor="asha" name="Asha" role="Senior PM · EdSpark" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "The system worked perfectly every time. And they still left." },
            { speaker: 'other', text: "There are two kinds of broken: technically broken and experientially broken. Engineering fixes the first. Product design fixes the second." },
            { speaker: 'priya', text: "We fixed the first. Never looked at the second." },
            { speaker: 'other', text: "You optimised copy around an experience that still left users in the dark." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="#0097A7"
          borderColor="#0097A7"
          content="Technically broken = engineering fixes it. Experientially broken = design fixes it. The two are easy to confuse and expensive to conflate. A metric gap is the first signal that you might have the wrong kind of broken."
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
      <ChapterSection id="m5-45sec" num="03" accentRgb={ACCENT_RGB}>

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

        <ConversationScene
          mentor="kiran" name="Kiran" role="Data · EdSpark" accent="#3A86FF"
          lines={[
            { speaker: 'other', text: "Average processing time: 45 seconds. Drop-off spike: 12 seconds. 67% of abandoning users leave in the first 15 seconds." },
            { speaker: 'priya', text: "They\u2019re not patient enough. We need to make the analysis faster." },
            { speaker: 'other', text: "The drop-off isn\u2019t about patience. It\u2019s about information. At 12 seconds they have none. They\u2019re not impatient — they\u2019re rational." },
          ]}
        />
        <Avatar
          name="Kiran"
          nameColor="#3A86FF"
          borderColor="#3A86FF"
          content={<>Users don\u2019t abandon slow systems. They abandon uncertain ones. At 12 seconds without feedback, leaving is the logical choice — the only information they have is that nothing is happening.</>}
          conceptId="ux-data-to-requirement"
          question="Kiran's data: 67% of abandoning users leave within 15 seconds. Average processing time: 45 seconds. What product requirement does this create?"
          options={[
            { text: "Reduce backend processing time to under 15 seconds so users don't hit the drop-off window.", correct: false, feedback: "The backend isn't the problem — the silence is. Users will wait 45 seconds for something they can see working. They won't wait 3 seconds for something that looks broken." },
            { text: "Provide the user with visible progress feedback before 12 seconds have elapsed.", correct: true, feedback: "Correct translation. The 12-second number isn't a performance target — it's a feedback deadline. Your spec needs to say: show meaningful progress within 5 seconds of user action." },
            { text: "Display a notice before the step begins: 'This analysis takes approximately 45 seconds.'", correct: false, feedback: "Pre-warnings help, but don't solve the real problem. Once the process starts and nothing changes on screen, users discount the warning. You need real-time feedback during the wait, not before it." },
            { text: "Show a loading skeleton so users see visual activity start immediately on click.", correct: false, feedback: "A skeleton is better than nothing, but it doesn't communicate duration or progress. Users will still reach the 12-second decision point without knowing how much longer they need to wait." },
          ]}
        />

        <ConversationScene
          mentor="maya" name="Maya" role="Designer · EdSpark" accent="#C85A40"
          lines={[
            { speaker: 'priya', text: "Can we at least add a label? Something like \u2018Analyzing your recording\u2019?" },
            { speaker: 'other', text: "That\u2019s what you have now. \u2018Analyzing\u2019 isn\u2019t a state. It\u2019s a word." },
            { speaker: 'priya', text: "What do they actually need?" },
            { speaker: 'other', text: "To know what\u2019s happening, how long it will take, and what comes next. \u2018Analyzing\u2019 answers none of those." },
          ]}
        />
        <Avatar
          name="Maya"
          nameColor="#C85A40"
          borderColor="#C85A40"
          content={<>A UI state needs to answer three questions: what is happening, how long will it take, what comes next. &ldquo;Analyzing&rdquo; answers none of them. It\u2019s a label pasted over silence. A real loading state is a system communicating with a user.</>}
          expandedContent="Progress bar, time estimate, context-specific message — those are what make waiting feel intentional rather than broken. Maya can design this in 20 minutes, but only if the spec is specific about all three elements."
          conceptId="ux-state-design"
          question="You're writing the spec for the loading state to hand to Maya. What's the minimum your spec must describe?"
          options={[
            { text: "Replace the button label with 'Analyzing your recording…' to confirm the action started.", correct: false, feedback: "Better copy helps, but it doesn't answer 'how long?' or 'what's happening inside?' Users still hit the same uncertainty wall — just with slightly friendlier text on the button." },
            { text: "A progress indicator showing advancement, an estimated duration, and a context-specific label.", correct: true, feedback: "Three elements: confirmation work is happening, when it will end, and what work is being done. Maya can design this in 20 minutes — but only if the spec is this specific about all three." },
            { text: "A spinner animation on the button and removal of the static label while processing.", correct: false, feedback: "A spinner answers 'is it loading?' but nothing else. Duration uncertainty is still there. Maya needs all three spec elements to build something that actually reduces abandonment." },
            { text: "An animated pulse effect on the button so users see visual confirmation of their click.", correct: false, feedback: "Animation confirms the click landed, but doesn't communicate duration or context. The spec Maya needs from you must describe three distinct elements — not just a visual style." },
          ]}
        />

        <ConversationScene
          mentor="asha" name="Asha" role="Senior PM · EdSpark" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "So we need feedback within 12 seconds." },
            { speaker: 'other', text: "Before 12. The 12-second drop-off is a design specification hiding as a data point. Users need feedback by second 5 at the latest." },
            { speaker: 'priya', text: "Every second of silence after that is a decision point." },
            { speaker: 'other', text: "Exactly. And right now you\u2019re giving them 45 seconds of silence." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="#0097A7"
          borderColor="#0097A7"
          content="Processing time is a product constraint. Perceived processing time is a design problem. You can't always make things faster — but you can almost always make waiting feel intentional. Progress bars, status messages, time estimates don't speed up the system. They eliminate the ambiguity that causes abandonment."
          expandedContent="Users can wait 3 minutes for an Uber because they have a map and a countdown. They can't wait 12 seconds for EdSpark because they have nothing. Same wait time, completely different experience."
          conceptId="ux-uncertainty-abandonment"
          question="Why do users leave at 12 seconds if the process takes 45 seconds?"
          options={[
            { text: 'They\'re impatient', correct: false, feedback: 'Users wait 3 minutes for an Uber. Impatience isn\'t the issue — uncertainty is.' },
            { text: 'The feature is objectively too slow', correct: false, feedback: '45 seconds is fast for AI analysis of a sales recording. Users wait longer for things they understand.' },
            { text: 'They don\'t understand what\'s happening or how long it will take', correct: true, feedback: 'Exactly. Silence = broken to the user. The 45 seconds isn\'t the problem. The 12 seconds of no feedback is.' },
            { text: 'The onboarding didn\'t prepare them', correct: false, feedback: 'Even perfectly onboarded users abandon silent processes. Feedback is a real-time need, not an onboarding fix.' },
          ]}
        />

        <div className="rv">
          <AbandonmentTimeline />
        </div>

        <div className="rv">
          <MicrocopyLab />
        </div>

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
      <ChapterSection id="m5-spec-gap" num="04" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya opens the original spec. She finds the offending line. &ldquo;Step 2: Analyze recording.&rdquo;
          That&apos;s the entire specification for a 45-second AI processing step.
        </SituationCard>

        {h2(<>UX failures often start as spec gaps, not engineering bugs</>)}

        <SpecComparisonMockup />

        <ConversationScene
          mentor="dev" name="Dev" role="Engineer · EdSpark" accent="#6E7681"
          lines={[
            { speaker: 'other', text: "I built what was written. \u2018Step 2: Analyze recording.\u2019 No loading state was specified. I assumed the system feedback was handled elsewhere." },
            { speaker: 'priya', text: "That was my gap. I wrote the happy path and never thought about the waiting state." },
            { speaker: 'other', text: "If you know what states a feature needs — loading, error, empty, success — tell me upfront. I can\u2019t build what isn\u2019t in the spec." },
            { speaker: 'priya', text: "Going forward — flag it in sprint planning if you see states missing." },
            { speaker: 'other', text: "Deal." },
          ]}
        />
        <Avatar
          name="Dev"
          nameColor="#6E7681"
          borderColor="#6E7681"
          content={<>Engineers build to spec. When an engineer fills in an unspecified state, they\u2019re patching a gap the PM created. The loading state wasn\u2019t forgotten — it was never considered. That\u2019s a different problem requiring a different fix.</>}
          expandedContent="'Never considered' requires a different kind of thinking going forward: what is every possible state this UI can be in? Write them all down before a single line of code is written."
          conceptId="ux-pm-engineer-spec"
          question="Dev says this in the retrospective. What's the most constructive PM response in this moment?"
          options={[
            { text: "Apologise for the oversight and commit to writing more complete specs going forward.", correct: false, feedback: "Apologies are fine but vague. 'More complete specs' isn't a process — it's a hope. Dev needs something concrete about what will actually change, not a promise to try harder." },
            { text: "Acknowledge the spec gap and ask Dev to flag unclear UI states during sprint planning review.", correct: true, feedback: "You own the gap, and you've proposed a structural fix: Dev becomes an early reviewer of spec completeness. That's a real process change — not a promise, but a loop that catches gaps before code starts." },
            { text: "Ask why Dev didn't flag the missing loading state before beginning development on the feature.", correct: false, feedback: "You're shifting accountability onto Dev for a gap in your spec. Dev's job is to build — flagging design gaps is a courtesy, not a responsibility. This response will damage the relationship." },
            { text: "Propose a new rule: all specs require Design sign-off before Dev is allowed to start coding.", correct: false, feedback: "Design sign-off helps visual quality, but doesn't solve the problem. The spec was incomplete — adding a reviewer doesn't fix what you give the reviewer to review in the first place." },
          ]}
        />

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

        <ConversationScene
          mentor="asha" name="Asha" role="Senior PM · EdSpark" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "Dev\u2019s right. I wrote the spec. I just never thought about what happens during those 45 seconds." },
            { speaker: 'other', text: "A spec that only describes the happy path is a spec for a world that doesn\u2019t exist. Real users hit loading states, error states, empty states." },
            { speaker: 'priya', text: "If those aren\u2019t designed, they\u2019re improvised." },
            { speaker: 'other', text: "By engineers. In production. Usually badly." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="#0097A7"
          borderColor="#0097A7"
          content="The loading state wasn't forgotten — it was never considered. Forgotten things can be added. Never-considered things require a different kind of thinking: what is every possible state this UI can be in? Write them all down before a single line of code is written."
          expandedContent="Success is 40% of the experience. The other 60% is loading, error, empty, and edge cases — the states most PMs never spec."
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

        <div className="rv">
          <WireframeProgressionViz />
        </div>

        <div className="rv">
          <StateSpecBuilder />
        </div>

        <div className="rv">
          <FigmaBeforeAfter />
        </div>

        <div className="rv">
          <StoryboardViz />
        </div>


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
      <ChapterSection id="m5-small-fix" num="05" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          They don&apos;t redesign the flow. They don&apos;t add features. Priya writes three lines in a new doc.
          Maya turns them into a design in 20 minutes. Dev ships it in an afternoon.
        </SituationCard>

        {h2(<>The best UX fix is often the smallest one</>)}

        {para(<>
          Before Priya asks Maya to design anything, she writes one sentence in her notebook: <em>&ldquo;Users abandon the analysis flow because the system gives them no signal it&apos;s working &mdash; not because the feature itself is broken.&rdquo;</em> This matters. A hypothesis is a testable prediction, not a plan. If the loading state fix doesn&apos;t move completion, the hypothesis was wrong and she&apos;ll know to look elsewhere. You don&apos;t skip the hypothesis step because you&apos;re confident &mdash; you write it precisely because confidence is when you&apos;re most likely to be wrong.
        </>)}

        {para(<>Maya opens Figma. Two frames. &ldquo;Before&rdquo; and &ldquo;After.&rdquo; Twenty minutes. The after frame has three additions: a status label, a progress bar, a time estimate. That&apos;s it.</>)}

        <FigmaMockup />

        {para(<>Dev opens Lovable. Pastes the design spec. &ldquo;Add a loading state to the Analyze button. Show a progress bar and ~30 seconds text while processing.&rdquo; Forty-three seconds later, it&apos;s deployed.</>)}

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

        <ConversationScene
          mentor="asha" name="Asha" role="Senior PM · EdSpark" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "Maya designed it in 20 minutes. Dev shipped it in an afternoon." },
            { speaker: 'other', text: "The fix cost one afternoon. The original gap cost two weeks of confusion, a 30% completion rate, and a post-launch investigation." },
            { speaker: 'priya', text: "One missing sentence in the spec." },
            { speaker: 'other', text: "That\u2019s the real cost of an incomplete spec." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="#0097A7"
          borderColor="#0097A7"
          content="The most expensive mistakes in product are usually missing sentences, not missing features. Every day PMs propose redesigns when the actual problem is a missing paragraph in a spec."
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
      <ChapterSection id="m5-outcome" num="06" accentRgb={ACCENT_RGB}>

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

        <div className="rv">
          <UXDebugLoopViz />
        </div>

        <ConversationScene
          mentor="maya" name="Maya" role="Designer · EdSpark" accent="#C85A40"
          lines={[
            { speaker: 'priya', text: "Completion went from 30% to 58%. From a loading state." },
            { speaker: 'other', text: "You fixed the experience. The feature was always fine." },
            { speaker: 'priya', text: "I kept thinking something was wrong with the feature itself." },
            { speaker: 'other', text: "The feature worked. The wait — the silence — that was broken." },
          ]}
        />
        <Avatar
          name="Maya"
          nameColor="#C85A40"
          borderColor="#C85A40"
          content={<>When a metric underperforms, the first question should always be: is this a feature failure or an experience failure? Feature failures need roadmap changes. Experience failures need design changes. Confusing the two is how teams ship new features into broken experiences.</>}
          expandedContent="The loading state fix was a design change, not a feature change. Same feature, same flow — just with visible progress. That distinction matters for every diagnosis going forward."
          conceptId="ux-feature-vs-experience"
          question="Completion is now 58%. Rohan asks: 'Should we redesign the full onboarding flow to close the remaining gap?' What's your answer?"
          options={[
            { text: "Yes — we're still 22 points short of target and need a more significant intervention.", correct: false, feedback: "A redesign solves a feature problem. You don't know yet if the remaining gap is a feature problem. You fixed one friction point — there may be others. Diagnose before prescribing." },
            { text: "Not yet — let's identify what's driving the remaining 42% to drop off before redesigning.", correct: true, feedback: "Exactly right. You found one experience failure and fixed it. There may be more specific ones. A full redesign risks removing what's working to solve a problem you haven't diagnosed yet." },
            { text: "No — onboarding redesigns rarely produce significant metric movement on their own.", correct: false, feedback: "This is an opinion without analytical grounding. It might be right, but it won't persuade Rohan — and it shuts down a legitimate question without offering a better path forward." },
            { text: "Yes — users need a fundamentally better onboarding experience, not incremental improvements.", correct: false, feedback: "This assumes the remaining 42% gap is structural, not specific. You have no evidence of that yet. The loading state fix worked precisely because you found the specific friction point first." },
          ]}
        />

        {para(<>
          The loop closed: understand the problem (session recordings pinpointed the exact drop-off moment), decide on the minimum targeted fix (loading state only), build it (one afternoon), measure the change (30% &rarr; 58%). The same loop now opens again on the remaining 42%. That&apos;s not a gap &mdash; it&apos;s the next diagnosis. Iterative product work isn&apos;t a series of big bets. It&apos;s a series of tightly-scoped hypothesis tests, each one narrowing the problem.
        </>)}

        {pullQuote('Users don\'t experience features. They experience what happens between actions.')}

        <ConversationScene
          mentor="asha" name="Asha" role="Senior PM · EdSpark" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "28 points from three lines of copy and a progress bar." },
            { speaker: 'other', text: "28 points from a loading state. That\u2019s not unusual — it\u2019s what happens when you fix the right thing." },
            { speaker: 'priya', text: "Most UX problems aren\u2019t in the features themselves." },
            { speaker: 'other', text: "They\u2019re in the gaps between features. What happens between actions is often more important than the actions themselves." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="#0097A7"
          borderColor="#0097A7"
          content="The UX debug loop: observe real users → find the exact drop-off moment → ask what they're feeling in that moment → fix clarity, not just functionality → measure the specific change. Priya ran this loop. It works every time."
          expandedContent="Users don't experience features. They experience what happens between actions — the waits, the transitions, the states. That's where most UX problems live, and it's invisible in any metric."
          conceptId="ux-debug-loop"
          question="What does a 28-point improvement from a loading state tell you about the original spec?"
          options={[
            { text: 'The original spec was fine — this was a bonus improvement', correct: false, feedback: 'A 28-point gap doesn\'t appear from a complete spec. It appears from a missing state.' },
            { text: 'The spec was missing critical UI states, causing a fixable UX failure', correct: true, feedback: 'The spec described a feature. It didn\'t describe an experience. Those are different things.' },
            { text: 'The backend should have been faster from the start', correct: false, feedback: 'Speed wasn\'t the problem. Communication was.' },
            { text: 'Users needed more training', correct: false, feedback: 'Training doesn\'t fix bad UX. Good UX fixes bad UX.' },
          ]}
        />

        <div className="rv">
          <NielsenHeuristicsViz />
        </div>

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
      <ChapterSection id="m5-reflection" num="07" accentRgb={ACCENT_RGB}>

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

        <ApplyItBox prompt="Find a friction point in a product you use daily — something that takes more steps than it should. Estimate: how many users hit this weekly? What is the smallest possible fix (one component, not a redesign)? Write the brief you would give a designer in two sentences." />
        <NextChapterTeaser text="Next: Communication for PMs — Priya has a working product. Now she needs to get the team, the stakeholders, and the board on the same page." />
      </ChapterSection>

    </article>
  );
}

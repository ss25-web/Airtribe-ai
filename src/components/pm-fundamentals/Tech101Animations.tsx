'use client';

/**
 * Tech101Animations — Module 09 auto-playing teaching visuals.
 * Each animation carries concept load without requiring interaction.
 *
 * 1. LayeredStackVisual       — one feature crosses multiple system layers
 * 2. LatencyPressureVisual    — technical performance becomes UX
 * 3. SchemaRelationshipBoard  — data shape decides what the product can know
 * 4. RequestResponseFlow      — APIs as contracts, not plumbing
 * 5. PermissionMatrixBloom    — enterprise complexity = permission complexity
 * 6. ScaleStressAnimation     — at scale, system behavior changes product behavior
 * 7. EstimateBreakdownCascade — estimates expand when scope becomes real
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#7843EE';
const ACCENT_RGB = '120,67,238';

const AnimationShell = ({ caption, children }: {
  title?: string; caption: string; children: React.ReactNode;
}) => (
  <div style={{ margin: '32px 0' }}>
    <div style={{ borderRadius: '16px', overflow: 'hidden', background: 'var(--ed-card)', border: `1px solid var(--ed-rule)`, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', borderLeft: `4px solid ${ACCENT}` }}>
      {children}
    </div>
    <div style={{ padding: '8px 4px 0', fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic', lineHeight: 1.6 }}>
      {caption}
    </div>
  </div>
);

// ─── 1. LAYERED STACK VISUAL ─────────────────────────────────────────────────

const STACK_LAYERS = [
  { id: 'ui',      label: 'UI Layer',          desc: 'What users see and touch', color: '#3B82F6', icon: '⬜' },
  { id: 'api',     label: 'API Contract',       desc: 'Request / response shape', color: ACCENT,    icon: '⇄'  },
  { id: 'backend', label: 'Backend Services',   desc: 'Logic, validation, rules',  color: '#0097A7', icon: '⚙' },
  { id: 'db',      label: 'Data Store',         desc: 'Tables, queries, schema',   color: '#E67E22', icon: '⬛' },
];

export function LayeredStackVisual() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [flowDir, setFlowDir] = useState<'down' | 'up'>('down');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLayer(a => {
        if (a === STACK_LAYERS.length - 1) { setFlowDir('up'); return a - 1; }
        if (a === 0 && flowDir === 'up') { setFlowDir('down'); return a + 1; }
        return flowDir === 'down' ? a + 1 : a - 1;
      });
    }, 700);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowDir]);

  return (
    <AnimationShell caption="One user action (click filter, tap export) travels through every layer. A PM request that feels like one thing is multiple system responsibilities at once.">
      <div style={{ padding: '28px 24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
        {/* Stack layers */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
          {STACK_LAYERS.map((layer, i) => {
            const isActive = i === activeLayer;
            return (
              <motion.div key={layer.id} animate={{ x: isActive ? 6 : 0, scale: isActive ? 1.02 : 1 }} transition={{ duration: 0.25 }}
                style={{ padding: '12px 16px', borderRadius: '10px', background: isActive ? `${layer.color}18` : 'var(--ed-cream)', border: `2px solid ${isActive ? layer.color : 'var(--ed-rule)'}`, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: isActive ? `0 4px 16px ${layer.color}30` : 'none', transition: 'box-shadow 0.2s' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: isActive ? `${layer.color}25` : 'var(--ed-rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', transition: 'background 0.2s' }}>
                  {layer.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: isActive ? layer.color : 'var(--ed-ink2)' }}>{layer.label}</div>
                  <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{layer.desc}</div>
                </div>
                {isActive && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: 8, height: 8, borderRadius: '50%', background: layer.color, boxShadow: `0 0 8px ${layer.color}` }} />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Flow indicator */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '6px', width: '80px' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', marginBottom: '8px' }}>REQUEST</div>
          <div style={{ height: '120px', width: '2px', background: 'var(--ed-rule)', borderRadius: '1px', position: 'relative', overflow: 'hidden' }}>
            <motion.div animate={{ y: flowDir === 'down' ? ['0%', '100%'] : ['100%', '0%'] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', width: '100%', height: '30%', background: `linear-gradient(${flowDir === 'down' ? '180deg' : '0deg'}, transparent, ${ACCENT}, transparent)`, borderRadius: '2px' }} />
          </div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', marginTop: '8px' }}>RESPONSE</div>
          <div style={{ padding: '6px 10px', borderRadius: '6px', background: `${ACCENT}12`, border: `1px solid ${ACCENT}30`, fontSize: '9px', color: ACCENT, fontWeight: 700, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
            {STACK_LAYERS[activeLayer].label}
          </div>
        </div>
      </div>
    </AnimationShell>
  );
}

// ─── 2. LATENCY PRESSURE VISUAL ─────────────────────────────────────────────

const LATENCY_STATES = [
  { label: 'Instant (< 200ms)', color: '#16A34A', mood: 'Confident', desc: 'Table loads. Filters respond. User trusts the product.', barWidth: 15, dot: '#16A34A' },
  { label: 'Delayed + feedback (1-3s)', color: '#CA8A04', mood: 'Uncertain', desc: 'Spinner appears with context. User waits but understands why.', barWidth: 55, dot: '#CA8A04' },
  { label: 'Timeout / silent failure (>5s)', color: '#EF4444', mood: 'Abandoned', desc: 'Nothing happens. User cannot tell if the product is broken or just slow.', barWidth: 100, dot: '#EF4444' },
];

export function LatencyPressureVisual() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % LATENCY_STATES.length), 2200);
    return () => clearInterval(t);
  }, []);

  const state = LATENCY_STATES[idx];

  return (
    <AnimationShell caption="The same dashboard in three response-speed conditions. When system timing changes user trust, timing becomes part of the product design — not just an engineering concern.">
      <div style={{ padding: '24px' }}>
      {/* Dashboard mock */}
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `2px solid ${state.color}40`, background: '#0f172a', maxWidth: '480px', margin: '0 auto' }}>
        {/* Browser bar */}
        <div style={{ padding: '8px 14px', background: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['#EF4444', '#F59E0B', '#10B981'].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
          <div style={{ flex: 1, marginLeft: '8px', height: '16px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <div style={{ padding: '20px' }}>
          {/* Table header */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {['Team', 'Sessions', 'Completion', 'Export'].map((h, i) => (
              <div key={i} style={{ flex: i === 0 ? 2 : 1, padding: '6px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', fontSize: '9px', color: '#64748b', fontFamily: "'JetBrains Mono', monospace" }}>{h}</div>
            ))}
          </div>

          {/* Table rows — loading state */}
          {[0, 1, 2].map(r => (
            <div key={r} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              {[0, 1, 2, 3].map(c => (
                <div key={c} style={{ flex: c === 0 ? 2 : 1, height: '28px', borderRadius: '4px', overflow: 'hidden', position: 'relative' as const }}>
                  <AnimatePresence mode="wait">
                    {idx === 0 ? (
                      <motion.div key="loaded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
                        <div style={{ width: '60%', height: '8px', borderRadius: '2px', background: 'rgba(255,255,255,0.12)' }} />
                      </motion.div>
                    ) : (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.03)', position: 'relative', overflow: 'hidden' }}>
                        {idx === 1 && (
                          <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                            style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(120,67,238,0.15), transparent)' }} />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ))}

          {/* Status strip */}
          <div style={{ marginTop: '14px', padding: '8px 12px', borderRadius: '6px', background: `${state.color}15`, border: `1px solid ${state.color}30`, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: state.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: state.color }}>{state.label}</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{state.desc}</div>
            </div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: state.color, fontFamily: "'JetBrains Mono', monospace" }}>
              {state.mood}
            </div>
          </div>

          {/* Latency bar */}
          <div style={{ marginTop: '10px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${state.barWidth}%` }} transition={{ duration: 0.4 }} style={{ height: '100%', background: state.color, borderRadius: '2px' }} />
          </div>
        </div>
      </div>
      </div>
    </AnimationShell>
  );
}

// ─── 3. SCHEMA RELATIONSHIP BOARD ────────────────────────────────────────────
// Pure SVG approach — all entities and lines in one coordinate space, no misalignment.

// SVG layout (viewBox 560×260):
//   Users      rect at (40,  40) 110×44  — top-left
//   Teams      rect at (410, 40) 110×44  — top-right
//   Workspaces rect at (40, 175) 110×44  — bottom-left
//   Events     rect at (410,175) 110×44  — bottom-right
//
// Lines:
//   Users → Teams:      (150,62) → (410,62)      "belongs to" ✓
//   Teams → Workspaces: (465,84) → (465,175) ↓ to (150,199)  "owns" ✗ MISSING
//   Users → Workspaces: (95,84)  → (95,175)       "uses" ✓
//   Workspaces → Events:(150,197)→ (410,197)       "generates" ✓

const SCHEMA_STEPS = [
  { entity: 'Users',      ex1: 40,  ey1: 40,  ew: 110, eh: 44, color: '#3B82F6', rx: 95,  ry: 62 },
  { entity: 'Teams',      ex1: 410, ey1: 40,  ew: 110, eh: 44, color: ACCENT,    rx: 465, ry: 62 },
  { entity: 'Workspaces', ex1: 40,  ey1: 175, ew: 110, eh: 44, color: '#0097A7', rx: 95,  ry: 197 },
  { entity: 'Events',     ex1: 410, ey1: 175, ew: 110, eh: 44, color: '#CA8A04', rx: 465, ry: 197 },
];

export function SchemaRelationshipBoard() {
  const [step, setStep] = useState(0); // 0=nothing, 1-4=entities, 5=lines, 6=query
  const [queryOn, setQueryOn] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = [800, 600, 600, 600, 1000, 2000, 3000];
    const advance = (s: number) => {
      t = setTimeout(() => {
        const next = s + 1;
        setStep(next);
        if (next === 6) setQueryOn(true);
        if (next < schedule.length) advance(next);
        else setTimeout(() => { setStep(0); setQueryOn(false); }, 1500);
      }, schedule[s]);
    };
    advance(step < 1 ? 0 : -1);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step === 0 ? step : -1]);

  // Which lines are lit at current step (step >= 5 means all entities shown)
  const linesLit = step >= 5;

  return (
    <AnimationShell caption="Relationships between users, teams, workspaces, and events illuminate one by one. One missing relationship stays dark — and blocks a reporting query. Product capability depends on data structure.">
      <div style={{ padding: '24px 20px', background: '#0f172a' }}>
        <svg viewBox="0 0 560 260" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* ── Lines (drawn behind entities) ── */}

          {/* Users → Teams: belongs to */}
          <motion.line x1={150} y1={62} x2={410} y2={62}
            stroke={linesLit ? '#3B82F6' : 'rgba(255,255,255,0.06)'}
            strokeWidth={linesLit ? 2 : 1} animate={{ opacity: linesLit ? 1 : 0.15 }} transition={{ duration: 0.4 }} />
          {linesLit && <text x={280} y={55} fontSize="9" fill="#64748b" textAnchor="middle" fontFamily="monospace">belongs to</text>}

          {/* Users → Workspaces: uses (vertical left) */}
          <motion.line x1={95} y1={84} x2={95} y2={175}
            stroke={linesLit ? '#0097A7' : 'rgba(255,255,255,0.06)'}
            strokeWidth={linesLit ? 2 : 1} animate={{ opacity: linesLit ? 1 : 0.15 }} transition={{ duration: 0.4 }} />
          {linesLit && <text x={73} y={132} fontSize="9" fill="#64748b" textAnchor="middle" fontFamily="monospace" transform="rotate(-90 73 132)">uses</text>}

          {/* Workspaces → Events: generates (horizontal bottom) */}
          <motion.line x1={150} y1={197} x2={410} y2={197}
            stroke={linesLit ? '#CA8A04' : 'rgba(255,255,255,0.06)'}
            strokeWidth={linesLit ? 2 : 1} animate={{ opacity: linesLit ? 1 : 0.15 }} transition={{ duration: 0.4 }} />
          {linesLit && <text x={280} y={212} fontSize="9" fill="#64748b" textAnchor="middle" fontFamily="monospace">generates</text>}

          {/* Teams → Workspaces: MISSING (dashed red) */}
          <motion.line x1={465} y1={84} x2={465} y2={175}
            stroke={linesLit ? '#EF4444' : 'rgba(255,255,255,0.04)'}
            strokeWidth={linesLit ? 2 : 1}
            strokeDasharray={linesLit ? '5 4' : '0'}
            animate={{ opacity: linesLit ? 0.8 : 0.08 }} transition={{ duration: 0.4 }} />
          {linesLit && (
            <>
              <text x={490} y={132} fontSize="9" fill="#EF4444" textAnchor="middle" fontFamily="monospace" transform="rotate(90 490 132)">⚠ missing</text>
            </>
          )}

          {/* ── Entity rectangles ── */}
          {SCHEMA_STEPS.map((e, i) => {
            const visible = step > i;
            return (
              <g key={e.entity}>
                <motion.rect x={e.ex1} y={e.ey1} width={e.ew} height={e.eh} rx={8}
                  fill={visible ? `${e.color}22` : 'rgba(255,255,255,0.03)'}
                  stroke={visible ? e.color : 'rgba(255,255,255,0.08)'}
                  strokeWidth={visible ? 2 : 1}
                  animate={{ opacity: visible ? 1 : 0.2 }}
                  transition={{ duration: 0.35 }} />
                <text x={e.ex1 + e.ew / 2} y={e.ey1 + 27} textAnchor="middle"
                  fontSize="13" fontWeight="700" fontFamily="sans-serif"
                  fill={visible ? e.color : 'rgba(255,255,255,0.15)'}>
                  {e.entity}
                </text>
              </g>
            );
          })}

          {/* ── Query result box ── */}
          {queryOn && (
            <g>
              <rect x={40} y={230} width={480} height={26} rx={6} fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.4)" strokeWidth={1} />
              <text x={280} y={247} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#f87171">
                Query &ldquo;usage by team admin&rdquo; blocked — teams → workspaces link missing
              </text>
            </g>
          )}
        </svg>
      </div>
    </AnimationShell>
  );
}

// ─── 4. REQUEST / RESPONSE FLOW ──────────────────────────────────────────────

const API_STAGES = [
  { label: 'UI sends request',     color: '#3B82F6', icon: '📱' },
  { label: 'Endpoint receives',    color: ACCENT,    icon: '⇄'  },
  { label: 'Validation runs',      color: '#0097A7', icon: '✓'  },
  { label: 'Auth gate checks',     color: '#CA8A04', icon: '🔑' },
  { label: 'Response returns',     color: '#16A34A', icon: '✅' },
];

const ERROR_STAGE = { label: 'Contract violation', color: '#EF4444', icon: '⚠' };

export function RequestResponseFlow() {
  const [step, setStep] = useState(0);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setStep(s => {
        if (s >= API_STAGES.length - 1) {
          const err = Math.random() > 0.6;
          setIsError(err);
          setTimeout(() => { setStep(0); setIsError(false); }, 800);
          return s;
        }
        return s + 1;
      });
    }, 600);
    return () => clearInterval(t);
  }, []);

  const displayStages = isError
    ? [...API_STAGES.slice(0, 2), ERROR_STAGE]
    : API_STAGES;

  return (
    <AnimationShell caption="There is a contract here, not magic. Every API interaction has defined expectations — who can ask, in what shape, and what comes back. Vague contracts create downstream confusion.">
      <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column' as const, gap: '6px', maxWidth: '360px', margin: '0 auto' }}>
        {displayStages.map((s, i) => {
          const isPast    = i < step;
          const isCurrent = i === step;
          const stageColor = isError && i === displayStages.length - 1 ? ERROR_STAGE.color : s.color;
          return (
            <motion.div key={i} animate={{ x: isCurrent ? 4 : 0, opacity: isPast ? 0.5 : 1 }} transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', background: isCurrent ? `${stageColor}15` : 'var(--ed-cream)', border: `1.5px solid ${isCurrent ? stageColor : 'var(--ed-rule)'}`, boxShadow: isCurrent ? `0 3px 12px ${stageColor}30` : 'none', transition: 'border-color 0.2s, background 0.2s' }}>
              <div style={{ width: 28, height: 28, borderRadius: '6px', background: `${stageColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div style={{ fontSize: '11px', fontWeight: isCurrent ? 700 : 400, color: isCurrent ? stageColor : 'var(--ed-ink3)' }}>{s.label}</div>
              {isCurrent && <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: stageColor, boxShadow: `0 0 6px ${stageColor}` }} />}
            </motion.div>
          );
        })}
        <div style={{ textAlign: 'center', fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", marginTop: '4px' }}>
          {isError ? '← Contract violation — error path taken' : '← Happy path'}
        </div>
      </div>
    </AnimationShell>
  );
}

// ─── 5. PERMISSION MATRIX BLOOM ──────────────────────────────────────────────

const ROLES   = ['Admin', 'Manager', 'Contributor', 'Viewer'];
const ACTIONS = ['View', 'Edit', 'Export', 'Delete'];
const PERMISSION_MATRIX: boolean[][] = [
  [true, true, true, true],
  [true, true, true, false],
  [true, true, false, false],
  [true, false, false, false],
];

export function PermissionMatrixBloom() {
  const [visibleRoles,   setVisibleRoles]   = useState(1);
  const [visibleActions, setVisibleActions] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setVisibleRoles(r => {
        if (r < ROLES.length) return r + 1;
        setVisibleActions(a => {
          if (a < ACTIONS.length) return a + 1;
          // Reset
          setTimeout(() => { setVisibleRoles(1); setVisibleActions(1); }, 1500);
          return a;
        });
        return r;
      });
    }, 500);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimationShell caption="One simple rule — &lsquo;admins see everything&rsquo; — expands automatically into a many-cell grid. Enterprise product design is often access design. The earlier PMs make it explicit, the safer the roadmap.">
      <div style={{ padding: '24px', overflowX: 'auto' as const }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
          <thead>
            <tr>
              <th style={{ padding: '6px 10px', fontSize: '9px', color: 'var(--ed-ink3)', textAlign: 'left', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>Role / Action</th>
              {ACTIONS.slice(0, visibleActions).map(a => (
                <th key={a} style={{ padding: '6px 10px', fontSize: '9px', color: ACCENT, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, textAlign: 'center' }}>{a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLES.slice(0, visibleRoles).map((role, ri) => (
              <tr key={role}>
                <td style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)', borderBottom: '1px solid var(--ed-rule)' }}>{role}</td>
                {ACTIONS.slice(0, visibleActions).map((action, ai) => {
                  const allowed = PERMISSION_MATRIX[ri][ai];
                  return (
                    <motion.td key={action} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
                      style={{ padding: '6px 10px', textAlign: 'center', borderBottom: '1px solid var(--ed-rule)' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '6px', background: allowed ? `rgba(22,163,74,0.15)` : 'rgba(239,68,68,0.1)', border: `1px solid ${allowed ? '#16A34A40' : '#EF444430'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', margin: '0 auto' }}>
                        {allowed ? <span style={{ color: '#16A34A' }}>&#10003;</span> : <span style={{ color: '#EF4444' }}>&#8211;</span>}
                      </div>
                    </motion.td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center' }}>
          {visibleRoles} role{visibleRoles > 1 ? 's' : ''} &times; {visibleActions} action{visibleActions > 1 ? 's' : ''} = {visibleRoles * visibleActions} permission decisions
        </div>
      </div>
    </AnimationShell>
  );
}

// ─── 6. SCALE STRESS ANIMATION ───────────────────────────────────────────────

const LOAD_LEVELS = [
  { label: '10 requests/sec',   load: 10,   queue: 0, async: false, color: '#16A34A', status: 'Healthy' },
  { label: '100 requests/sec',  load: 100,  queue: 2, async: false, color: '#CA8A04', status: 'Warm' },
  { label: '1,000 requests/sec', load: 1000, queue: 8, async: true,  color: '#EF4444', status: 'Degraded' },
];

export function ScaleStressAnimation() {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setLevel(l => (l + 1) % LOAD_LEVELS.length), 2000);
    return () => clearInterval(t);
  }, []);

  const ll = LOAD_LEVELS[level];

  return (
    <AnimationShell caption="Scale is not just bigger traffic. It is a different product operating mode. When load changes system behavior, product experience must change shape too — sync becomes async, instant becomes queued.">
      <div style={{ padding: '28px 24px', maxWidth: '440px', margin: '0 auto' }}>
        {/* Load dial */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace" }}>
              <span style={{ color: 'var(--ed-ink3)' }}>System load</span>
              <span style={{ color: ll.color, fontWeight: 700 }}>{ll.label}</span>
            </div>
            <div style={{ height: '8px', background: 'var(--ed-rule)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${(level + 1) * 33}%` }} transition={{ duration: 0.5 }}
                style={{ height: '100%', background: ll.color, borderRadius: '4px' }} />
            </div>
          </div>
          <div style={{ padding: '4px 10px', borderRadius: '20px', background: `${ll.color}15`, border: `1px solid ${ll.color}40`, fontSize: '10px', fontWeight: 700, color: ll.color }}>{ll.status}</div>
        </div>

        {/* Queue visualization */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '6px' }}>Request queue</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: Math.max(ll.queue, 0) }).map((_, i) => (
              <motion.div key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.06 }}
                style={{ width: 24, height: 24, borderRadius: '6px', background: `${ll.color}20`, border: `1px solid ${ll.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: ll.color }}>
                {i + 1}
              </motion.div>
            ))}
            {ll.queue === 0 && <div style={{ fontSize: '10px', color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>No queue — instant response</div>}
          </div>
        </div>

        {/* Async path */}
        <AnimatePresence>
          {ll.async && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#EF4444', marginBottom: '4px' }}>Export moved to background job</div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>&ldquo;We&apos;ll notify you when your report is ready.&rdquo; — Product experience must change shape at this load.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimationShell>
  );
}

// ─── 7. ESTIMATE BREAKDOWN CASCADE ───────────────────────────────────────────

const WORKSTREAMS = [
  { label: 'Frontend', icon: '⬜', color: '#3B82F6', risk: 'known' },
  { label: 'Backend', icon: '⚙', color: ACCENT, risk: 'known' },
  { label: 'Auth / Permissions', icon: '🔑', color: '#CA8A04', risk: 'uncertain' },
  { label: 'Analytics instrumentation', icon: '📊', color: '#0097A7', risk: 'dependency' },
  { label: 'Data migration', icon: '🗄', color: '#E67E22', risk: 'unknown' },
  { label: 'QA / Edge cases', icon: '🧪', color: '#7C3AED', risk: 'uncertain' },
  { label: 'Rollout & monitoring', icon: '🚀', color: '#16A34A', risk: 'known' },
];

const RISK_COLORS: Record<string, string> = { known: '#16A34A', uncertain: '#CA8A04', dependency: '#3B82F6', unknown: '#EF4444' };

export function EstimateBreakdownCascade() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    t = setInterval(() => {
      setVisible(v => {
        if (v >= WORKSTREAMS.length) {
          setTimeout(() => setVisible(0), 1500);
          clearInterval(t);
          return v;
        }
        return v + 1;
      });
    }, 400);
    return () => clearInterval(t);
  }, [visible === 0 ? visible : -1]);

  return (
    <AnimationShell caption="One feature card splits into many engineering workstreams. Better decomposition does not create uncertainty — it reveals uncertainty that was already hiding in the scope.">
      <div style={{ padding: '28px 24px', display: 'flex', gap: '16px', alignItems: 'flex-start', maxWidth: '480px', margin: '0 auto' }}>
        {/* Source card */}
        <div style={{ flexShrink: 0, width: '120px', padding: '12px', borderRadius: '10px', background: `${ACCENT}15`, border: `2px solid ${ACCENT}`, textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: ACCENT, marginBottom: '4px' }}>Feature</div>
          <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', lineHeight: 1.4 }}>Enterprise Admin Workspace</div>
          <div style={{ marginTop: '8px', fontSize: '10px', color: ACCENT, fontFamily: "'JetBrains Mono', monospace' " }}>{visible} / {WORKSTREAMS.length}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px', flex: 1 }}>
          {WORKSTREAMS.slice(0, visible).map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '7px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
              <span style={{ fontSize: '12px' }}>{w.icon}</span>
              <span style={{ fontSize: '10px', color: 'var(--ed-ink2)', flex: 1 }}>{w.label}</span>
              <span style={{ fontSize: '8px', padding: '2px 6px', borderRadius: '10px', background: `${RISK_COLORS[w.risk]}15`, color: RISK_COLORS[w.risk], fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{w.risk}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimationShell>
  );
}

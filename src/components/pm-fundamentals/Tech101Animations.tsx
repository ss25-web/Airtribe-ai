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
    {children}
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
    </AnimationShell>
  );
}

// ─── 3. SCHEMA RELATIONSHIP BOARD ────────────────────────────────────────────
// All 4 entities visible immediately. Only the connecting lines animate in
// one by one. Light background — blends with page content.

export function SchemaRelationshipBoard() {
  // 0 = no lines; 1 = Users→Teams; 2 = Users→Workspaces; 3 = Workspaces→Events;
  // 4 = Teams→Workspaces (missing); 5 = query warning visible
  const [linesLit, setLinesLit] = useState(0);
  const [queryOn,  setQueryOn]  = useState(false);

  useEffect(() => {
    const steps = [900, 700, 700, 700, 1800, 3000];
    const timers: ReturnType<typeof setTimeout>[] = [];
    let accumulated = 0;
    steps.forEach((delay, i) => {
      accumulated += delay;
      timers.push(setTimeout(() => {
        setLinesLit(i + 1);
        if (i + 1 === 5) setQueryOn(true);
        if (i === steps.length - 1) {
          setTimeout(() => { setLinesLit(0); setQueryOn(false); }, 1500);
        }
      }, accumulated));
    });
    return () => timers.forEach(clearTimeout);
  }, [linesLit === 0 ? linesLit : -1]);

  const E = {
    users:      { x: 40,  y: 50,  w: 120, h: 48, color: '#3B82F6', label: 'Users' },
    teams:      { x: 400, y: 50,  w: 120, h: 48, color: ACCENT,    label: 'Teams' },
    workspaces: { x: 40,  y: 190, w: 120, h: 48, color: '#0097A7', label: 'Workspaces' },
    events:     { x: 400, y: 190, w: 120, h: 48, color: '#CA8A04', label: 'Events' },
  };

  // Line endpoints (midpoints of entity edges)
  const L = {
    usersR:   { x: E.users.x + E.users.w,        y: E.users.y + 24  },
    teamsL:   { x: E.teams.x,                     y: E.teams.y + 24  },
    usersB:   { x: E.users.x + 60,               y: E.users.y + E.users.h },
    wsT:      { x: E.workspaces.x + 60,           y: E.workspaces.y  },
    wsR:      { x: E.workspaces.x + E.workspaces.w, y: E.workspaces.y + 24 },
    eventsL:  { x: E.events.x,                    y: E.events.y + 24  },
    teamsB:   { x: E.teams.x + 60,               y: E.teams.y + E.teams.h },
    wsT2:     { x: E.workspaces.x + 60,           y: E.workspaces.y  },
  };

  const lineStyle = (lit: boolean, color: string, dashed = false) => ({
    stroke: lit ? color : 'var(--ed-rule)',
    strokeWidth: lit ? 2.5 : 1.5,
    strokeDasharray: dashed ? '5 4' : undefined,
    opacity: lit ? 1 : 0.35,
    transition: 'stroke 0.35s, opacity 0.35s',
  });

  return (
    <AnimationShell caption="Relationships between entities illuminate one by one. The missing teams → workspaces link stays dark — it blocks a reporting query. Product capability depends on data structure.">
      <div style={{ borderRadius: '12px', border: '1px solid var(--ed-rule)', background: 'var(--ed-card)', padding: '20px', overflow: 'hidden' }}>
        <svg viewBox="0 0 560 290" style={{ width: '100%', height: 'auto', display: 'block' }}>

          {/* ── Relationship lines (drawn first, behind entities) ── */}

          {/* 1. Users → Teams: belongs to */}
          <line x1={L.usersR.x} y1={L.usersR.y} x2={L.teamsL.x} y2={L.teamsL.y} {...lineStyle(linesLit >= 1, '#3B82F6')} />
          {linesLit >= 1 && <text x={280} y={66} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="'JetBrains Mono',monospace">belongs to</text>}

          {/* 2. Users → Workspaces: uses */}
          <line x1={L.usersB.x} y1={L.usersB.y} x2={L.wsT.x} y2={L.wsT.y} {...lineStyle(linesLit >= 2, '#0097A7')} />
          {linesLit >= 2 && <text x={76} y={144} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="'JetBrains Mono',monospace">uses</text>}

          {/* 3. Workspaces → Events: generates */}
          <line x1={L.wsR.x} y1={L.wsR.y} x2={L.eventsL.x} y2={L.eventsL.y} {...lineStyle(linesLit >= 3, '#CA8A04')} />
          {linesLit >= 3 && <text x={280} y={210} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="'JetBrains Mono',monospace">generates</text>}

          {/* 4. Teams → Workspaces: MISSING */}
          <line x1={L.teamsB.x} y1={L.teamsB.y} x2={L.wsT2.x} y2={L.wsT2.y} {...lineStyle(linesLit >= 4, '#EF4444', true)} />
          {linesLit >= 4 && (
            <text x={240} y={144} textAnchor="middle" fontSize="10" fill="#EF4444" fontFamily="'JetBrains Mono',monospace">⚠ not defined</text>
          )}

          {/* ── Entity boxes (always visible) ── */}
          {Object.values(E).map((e) => (
            <g key={e.label}>
              <rect x={e.x} y={e.y} width={e.w} height={e.h} rx={10}
                fill={`${e.color}12`} stroke={e.color} strokeWidth={2} />
              <text x={e.x + e.w / 2} y={e.y + 29} textAnchor="middle"
                fontSize="14" fontWeight="700" fontFamily="sans-serif" fill={e.color}>
                {e.label}
              </text>
            </g>
          ))}

          {/* ── Query warning ── */}
          {queryOn && (
            <g>
              <rect x={40} y={252} width={480} height={30} rx={7}
                fill="rgba(239,68,68,0.1)" stroke="#EF4444" strokeWidth={1} strokeDasharray="4 3" />
              <text x={280} y={271} textAnchor="middle" fontSize="11"
                fontFamily="'JetBrains Mono',monospace" fill="#EF4444">
                &quot;Usage by team admin&quot; — blocked: teams → workspaces link missing
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

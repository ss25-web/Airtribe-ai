'use client';

/**
 * Tech101WorkflowVisuals — Shared 3D interactive workflow visuals for Tech101 module.
 * All components are user-triggered. No auto-play.
 * Uses CSS vars for dark mode. Framer Motion springs throughout.
 *
 * Track 1 (foundations):
 *   FeatureRequestXRay · ResponseTimeControlRoom · SchemaFactoryFloor
 *   ContractGateway · AccessMatrixConsole · TrafficLoadOpsRoom · ScopeDecompositionBoard
 *
 * Track 2 (APM):
 *   ArchitectureDebtPressureMap · ReuseLeverageSimulator · MetricTruthCalibrationRig
 *   ContractBlastRadiusMap · EnterpriseReliabilityWarRoom · VendorLockInDecisionLab
 *   RoadmapConfidenceSimulator
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Constants ────────────────────────────────────────────────────────────────

const C = {
  purple: '#7843EE',
  teal:   '#0097A7',
  blue:   '#3B82F6',
  green:  '#16A34A',
  amber:  '#CA8A04',
  coral:  '#E8875A',
  rose:   '#D96D92',
  red:    '#EF4444',
};

const sp  = { type: 'spring' as const, stiffness: 280, damping: 24 };
const spB = { type: 'spring' as const, stiffness: 340, damping: 18 };

// Dark-mode-safe raised card shadow
const raised = (c: string) =>
  `5px 5px 0 ${c}22, 0 14px 28px ${c}18, inset 0 1px 0 rgba(255,255,255,0.1)`;
const flat = '0 4px 12px rgba(0,0,0,0.08), 0 2px 0 rgba(0,0,0,0.06)';

// ─── Shared Primitives ────────────────────────────────────────────────────────

const Shell = ({ caption, children }: { caption: string; children: React.ReactNode }) => (
  <div style={{ margin: '32px 0' }}>
    {children}
    <div style={{ paddingTop: '8px', fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic', lineHeight: 1.6 }}>
      {caption}
    </div>
  </div>
);

const ClickHint = ({ text }: { text: string }) => (
  <div style={{ textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ed-ink3)', paddingTop: '8px' }}>
    ↑ {text}
  </div>
);

const Chip = ({ label, accent, active, onClick }: { label: string; accent: string; active: boolean; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.04, y: -2 }}
    whileTap={{ scale: 0.97 }}
    animate={{ boxShadow: active ? raised(accent) : flat }}
    transition={sp}
    style={{
      padding: '7px 14px', borderRadius: '10px', cursor: 'pointer',
      background: active ? `linear-gradient(145deg, ${accent}cc, ${accent})` : 'var(--ed-card)',
      border: `1.5px solid ${active ? accent : `${accent}28`}`,
      color: active ? '#fff' : accent,
      fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 800,
      letterSpacing: '0.06em', whiteSpace: 'nowrap' as const,
    }}
  >
    {label}
  </motion.button>
);

const Bar = ({ value, max = 100, color, animated = true }: { value: number; max?: number; color: string; animated?: boolean }) => (
  <div style={{ height: '6px', background: 'var(--ed-rule)', borderRadius: '3px', overflow: 'hidden' }}>
    <motion.div
      animate={{ width: `${(value / max) * 100}%` }}
      transition={animated ? { duration: 0.5 } : { duration: 0 }}
      style={{ height: '100%', background: color, borderRadius: '3px' }}
    />
  </div>
);

const GaugeRow = ({ label, value, color, width = 180 }: { label: string; value: number; color: string; width?: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
    <div style={{ width: 110, flexShrink: 0, fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)' }}>{label}</div>
    <div style={{ width, flexShrink: 0 }}>
      <Bar value={value} color={color} />
    </div>
    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 700, color }}>{value}%</div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TRACK 1 — FOUNDATIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 1. FEATURE REQUEST X-RAY ────────────────────────────────────────────────

const LAYERS = [
  { id: 'ui',       label: 'UI Layer',          consequence: 'Loading state, empty state, component re-render', color: C.blue   },
  { id: 'api',      label: 'API Contract',       consequence: 'New endpoint or new query param — update docs, break existing consumers', color: C.purple },
  { id: 'auth',     label: 'Permission Check',   consequence: 'Who is allowed to see this data? Role-based scope required', color: C.amber  },
  { id: 'backend',  label: 'Business Logic',     consequence: 'Validation rules, data aggregation, error paths', color: C.teal   },
  { id: 'db',       label: 'Database Query',     consequence: 'New join, new index, possible N+1 problem, schema migration', color: C.coral  },
  { id: 'event',    label: 'Analytics Event',    consequence: 'Instrumentation needed or metric is blind from day one', color: C.green  },
];

export function FeatureRequestXRay() {
  const [active, setActive] = useState<number | null>(null);
  const sel = active !== null ? LAYERS[active] : null;

  return (
    <Shell caption="A feature request that feels like one thing triggers responsibilities across every system layer simultaneously. Naming all of them before a sprint starts is part of the PM's job.">
      <div style={{
        borderRadius: '24px', padding: '24px',
        background: 'var(--ed-card)', border: '1px solid var(--ed-rule)',
        boxShadow: flat,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Feature request card */}
          <div style={{
            borderRadius: '16px', padding: '18px 14px',
            background: `${C.purple}10`, border: `2px solid ${C.purple}30`,
            boxShadow: raised(C.purple), textAlign: 'center' as const,
          }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>📋</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: C.purple, letterSpacing: '0.12em', marginBottom: '8px' }}>FEATURE REQUEST</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.45 }}>Show team coaching reports</div>
            <div style={{ marginTop: '12px', fontSize: '10px', color: 'var(--ed-ink3)' }}>
              Looks simple. Involves:
            </div>
            <div style={{ marginTop: '6px', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', fontWeight: 800, color: C.purple }}>
              {LAYERS.length} system responsibilities
            </div>
          </div>

          {/* 3D layer stack */}
          <div style={{ perspective: '900px', perspectiveOrigin: '50% 20%' }}>
            <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-8deg) rotateY(2deg)' }}>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                {LAYERS.map((layer, i) => {
                  const isActive = active === i;
                  return (
                    <motion.div
                      key={layer.id}
                      onClick={() => setActive(active === i ? null : i)}
                      animate={{ z: isActive ? 28 : 0, scale: isActive ? 1.02 : 1, boxShadow: isActive ? raised(layer.color) : flat }}
                      whileHover={{ z: 14, scale: 1.01 }}
                      transition={sp}
                      style={{
                        padding: '10px 14px', borderRadius: '12px', cursor: 'pointer',
                        background: `color-mix(in srgb, var(--ed-card) 88%, ${layer.color} 12%)`,
                        border: `2px solid ${isActive ? layer.color : `${layer.color}28`}`,
                        display: 'flex', alignItems: 'center', gap: '12px',
                        userSelect: 'none' as const, position: 'relative' as const,
                      }}
                    >
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800, color: `${layer.color}70`, width: '18px', flexShrink: 0 }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div style={{
                        width: 32, height: 32, borderRadius: '10px', flexShrink: 0,
                        background: `linear-gradient(145deg, ${layer.color}cc, ${layer.color})`,
                        boxShadow: isActive ? `3px 3px 0 ${layer.color}35` : `2px 2px 0 ${layer.color}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px',
                      }}>
                        {['⬜','⇄','🔑','⚙','🗄','📊'][i]}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: isActive ? layer.color : 'var(--ed-ink2)', flex: 1 }}>{layer.label}</div>
                      {isActive && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                          style={{ width: 8, height: 8, borderRadius: '50%', background: layer.color, boxShadow: `0 0 8px ${layer.color}`, flexShrink: 0 }} />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Consequence panel */}
        <AnimatePresence mode="wait">
          {sel && (
            <motion.div key={sel.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
              style={{ marginTop: '16px', padding: '14px 18px', borderRadius: '14px', background: `${sel.color}0d`, border: `1.5px solid ${sel.color}28`, borderLeft: `4px solid ${sel.color}` }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: sel.color, letterSpacing: '0.12em', marginBottom: '5px' }}>{sel.label.toUpperCase()} — PM CONSEQUENCE</div>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{sel.consequence}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ClickHint text="Click a system layer to see the PM consequence" />
    </Shell>
  );
}

// ─── 2. RESPONSE TIME CONTROL ROOM ───────────────────────────────────────────

const SPEEDS = [
  { id: '300ms', label: '300ms', badge: 'Instant Trust', color: C.green,
    screenState: 'loaded', statusMsg: 'Report loaded', userMsg: 'User sees data immediately. No anxiety. Product feels responsive.',
    uiDesc: 'Table renders completely' },
  { id: '3s',   label: '3s',    badge: 'Needs Feedback', color: C.amber,
    screenState: 'loading', statusMsg: 'Loading… 3s ETA', userMsg: 'Spinner with progress and ETA. User waits but feels informed.',
    uiDesc: 'Progress bar + ETA label required' },
  { id: '30s',  label: '30s',   badge: 'Must Go Async', color: C.red,
    screenState: 'queued', statusMsg: 'Queued — notify me', userMsg: 'User cannot wait 30 seconds. Product must queue job and notify via email or in-app.',
    uiDesc: 'Job queued — notification path required' },
];

export function ResponseTimeControlRoom() {
  const [idx, setIdx] = useState(0);
  const s = SPEEDS[idx];

  return (
    <Shell caption="The same report at three response speeds requires three different product designs. Timing is not an engineering detail — it changes what UX is even possible.">
      {/* Speed selector */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        {SPEEDS.map((sp, i) => (
          <Chip key={sp.id} label={sp.label} accent={sp.color} active={idx === i} onClick={() => setIdx(i)} />
        ))}
      </div>

      {/* Monitor */}
      <div style={{
        transform: 'perspective(1100px) rotateX(2.5deg)',
        borderRadius: '16px', overflow: 'hidden', background: '#0f172a',
        boxShadow: `0 22px 44px rgba(0,0,0,0.3), 0 7px 0 rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)`,
        border: `1.5px solid ${s.color}35`, transition: 'border-color 0.3s',
      }}>
        {/* Top bar */}
        <div style={{ padding: '8px 14px', background: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['#EF4444','#F59E0B','#10B981'].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
          <div style={{ flex: 1, marginLeft: '8px', height: '13px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)' }} />
          <motion.div animate={{ background: s.color }} transition={{ duration: 0.3 }}
            style={{ width: 8, height: 8, borderRadius: '50%', boxShadow: `0 0 8px ${s.color}` }} />
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: s.color, fontWeight: 700 }}>{s.badge}</div>
        </div>

        {/* Screen content */}
        <div style={{ padding: '20px' }}>
          {/* Mock headers */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            {['Team','Sessions','Completion','Score'].map((h, i) => (
              <div key={i} style={{ flex: i === 0 ? 2 : 1, padding: '5px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '9px', color: '#64748b', fontFamily: "'JetBrains Mono',monospace" }}>{h}</div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {s.screenState === 'loaded' && (
              <motion.div key="loaded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {[0, 1, 2].map(r => (
                  <div key={r} style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
                    {[0, 1, 2, 3].map(c => (
                      <div key={c} style={{ flex: c === 0 ? 2 : 1, height: '24px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                        <div style={{ width: `${50 + r * 12 + c * 8}%`, height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px' }} />
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
            {s.screenState === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {[0, 1, 2].map(r => (
                  <div key={r} style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
                    {[0, 1, 2, 3].map(c => (
                      <div key={c} style={{ flex: c === 0 ? 2 : 1, height: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden', position: 'relative' as const }}>
                        <motion.div animate={{ x: ['-100%','200%'] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                          style={{ position: 'absolute' as const, inset: 0, width: '60%', background: `linear-gradient(90deg, transparent, ${C.amber}25, transparent)` }} />
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '6px', background: `${C.amber}15`, border: `1px solid ${C.amber}30`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ fontSize: '14px' }}>⟳</motion.div>
                  <div style={{ fontSize: '10px', color: C.amber, fontWeight: 700 }}>Loading… estimated 3 seconds</div>
                </div>
              </motion.div>
            )}
            {s.screenState === 'queued' && (
              <motion.div key="queued" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ padding: '20px', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>📬</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: C.red, marginBottom: '6px' }}>Your report is being generated</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>This report takes ~30 seconds to compute.<br/>We&apos;ll email it to you when it&apos;s ready.</div>
                  <div style={{ marginTop: '12px', padding: '6px 14px', borderRadius: '8px', background: `${C.red}20`, border: `1px solid ${C.red}40`, display: 'inline-block', fontSize: '10px', color: C.red, fontWeight: 700 }}>
                    ✓ Queued — notification on completion
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Teaching label */}
      <AnimatePresence mode="wait">
        <motion.div key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '12px', background: `${s.color}0d`, border: `1.5px solid ${s.color}25`, borderLeft: `4px solid ${s.color}` }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: s.color, marginBottom: '4px', letterSpacing: '0.1em' }}>{s.uiDesc.toUpperCase()}</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{s.userMsg}</div>
        </motion.div>
      </AnimatePresence>
      <ClickHint text="Click a response time to see how the product design must change" />
    </Shell>
  );
}

// ─── 3. SCHEMA FACTORY FLOOR ─────────────────────────────────────────────────

type RelKey = 'u-t' | 'u-w' | 'w-s' | 't-w';
const SCHEMA_RELS: Record<RelKey, { label: string; from: string; to: string; missing: boolean }> = {
  'u-t': { label: 'Users → Teams',       from: 'users',  to: 'teams',       missing: false },
  'u-w': { label: 'Users → Workspaces',  from: 'users',  to: 'workspaces',  missing: false },
  'w-s': { label: 'Workspaces → Reports',from: 'workspaces', to: 'reports', missing: false },
  't-w': { label: 'Teams → Workspaces',  from: 'teams',  to: 'workspaces',  missing: true  },
};

export function SchemaFactoryFloor() {
  const [links, setLinks] = useState<Record<RelKey, boolean>>({ 'u-t': true, 'u-w': true, 'w-s': true, 't-w': false });
  const [ran, setRan] = useState(false);
  const [result, setResult] = useState<'success' | 'blocked' | null>(null);

  function runReport() {
    setRan(true);
    const blocked = !links['t-w'];
    setResult(blocked ? 'blocked' : 'success');
    setTimeout(() => setResult(null), 3500);
  }

  const entities = [
    { id: 'users',      label: 'Users',      color: C.blue,   x: 0   },
    { id: 'teams',      label: 'Teams',      color: C.purple, x: 1   },
    { id: 'workspaces', label: 'Workspaces', color: C.teal,   x: 2   },
    { id: 'reports',    label: 'Reports',    color: C.amber,  x: 3   },
  ];

  const joins = !links['t-w'] ? 0 : 3;
  const queryCost = Math.min(100, 20 + joins * 20);

  return (
    <Shell caption="Every product report is a database query. If the data relationships are not defined, the query cannot be written — and the product capability does not exist, no matter how good the UI looks.">
      <div style={{ borderRadius: '24px', padding: '22px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: flat }}>
        {/* Entity row */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', perspective: '800px' }}>
          {entities.map((e, i) => (
            <motion.div key={e.id}
              whileHover={{ z: 8, scale: 1.02 }}
              transition={sp}
              style={{
                flex: 1, padding: '12px 8px', borderRadius: '14px', textAlign: 'center' as const,
                background: `color-mix(in srgb, var(--ed-card) 85%, ${e.color} 15%)`,
                border: `2px solid ${e.color}35`,
                boxShadow: raised(e.color),
              }}>
              <div style={{ fontSize: '20px', marginBottom: '6px' }}>{['👤','🏢','📂','📊'][i]}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800, color: e.color }}>{e.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Relationship toggles */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '8px', letterSpacing: '0.1em' }}>RELATIONSHIP LINKS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
            {(Object.entries(links) as [RelKey, boolean][]).map(([key, on]) => {
              const rel = SCHEMA_RELS[key];
              const isMissing = rel.missing;
              const color = on ? (isMissing ? C.green : C.teal) : C.red;
              return (
                <motion.button
                  key={key}
                  onClick={() => setLinks(l => ({ ...l, [key]: !l[key] }))}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  animate={{ boxShadow: on ? raised(color) : flat }}
                  transition={sp}
                  style={{
                    padding: '7px 12px', borderRadius: '10px', cursor: 'pointer',
                    background: on ? `${color}14` : `${C.red}0d`,
                    border: `1.5px solid ${on ? color : C.red}35`,
                    color: on ? color : C.red,
                    fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  <span>{on ? '✓' : '✗'}</span>{rel.label}
                  {isMissing && !on && <span style={{ fontSize: '8px', opacity: 0.8 }}>← missing</span>}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Query cost + Run button */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '5px', letterSpacing: '0.1em' }}>QUERY COMPLEXITY</div>
            <Bar value={queryCost} color={queryCost > 70 ? C.red : queryCost > 40 ? C.amber : C.green} />
          </div>
          <motion.button
            onClick={runReport}
            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
            style={{
              padding: '10px 18px', borderRadius: '12px', cursor: 'pointer',
              background: `linear-gradient(145deg, ${C.purple}cc, ${C.purple})`,
              color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 800,
              border: 'none', boxShadow: raised(C.purple),
            }}
          >
            ▶ Run Report
          </motion.button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div key={result} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              style={{
                padding: '12px 16px', borderRadius: '12px',
                background: result === 'success' ? `${C.green}0d` : `${C.red}0d`,
                border: `1.5px solid ${result === 'success' ? C.green : C.red}30`,
                borderLeft: `4px solid ${result === 'success' ? C.green : C.red}`,
              }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: result === 'success' ? C.green : C.red, marginBottom: '3px' }}>
                {result === 'success' ? '✓ Report generated — "Usage by team admin" returned 48 rows' : '✗ Query blocked — Teams → Workspaces link missing'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
                {result === 'success' ? 'All relationships resolved. Query ran in 240ms.' : 'Cannot join Teams to Reports without the Teams → Workspaces relationship. Enable the link to run this query.'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ClickHint text="Toggle links · Click Run Report to see what the data model allows" />
    </Shell>
  );
}

// ─── 4. CONTRACT GATEWAY ─────────────────────────────────────────────────────

const WINDOWS = [
  { id: 'fields',   label: 'Request Fields',  icon: '📄', desc: 'team_id, date_range, format' },
  { id: 'auth',     label: 'Auth Gate',       icon: '🔑', desc: 'Bearer token · role: admin' },
  { id: 'response', label: 'Response Shape',  icon: '📦', desc: '{ rows: [], total, cursor }' },
  { id: 'errors',   label: 'Error Behavior',  icon: '⚠',  desc: '401 · 422 · 500 defined' },
];

export function ContractGateway() {
  const [mode, setMode] = useState<'valid' | 'broken' | null>(null);
  const [step, setStep] = useState(-1);
  const running = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function run(m: 'valid' | 'broken') {
    if (running.current) return;
    timers.current.forEach(clearTimeout);
    running.current = true;
    setMode(m);
    setStep(0);
    const count = m === 'broken' ? 2 : WINDOWS.length;
    Array.from({ length: count }).forEach((_, i) => {
      const t = setTimeout(() => {
        setStep(i);
        if (i === count - 1) {
          const ct = setTimeout(() => { setStep(-1); running.current = false; }, 1200);
          timers.current.push(ct);
        }
      }, i * 480);
      timers.current.push(t);
    });
  }

  return (
    <Shell caption="An API contract defines what can be asked, by whom, in what shape, and what returns. Vague contracts create bugs that show up in production, not in code review.">
      <div style={{ borderRadius: '24px', padding: '22px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: flat }}>
        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
          <motion.button onClick={() => run('valid')} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', background: `linear-gradient(145deg, #4ade80, ${C.green})`, color: '#fff', border: 'none', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 800, boxShadow: raised(C.green) }}>
            ▶ Send Valid Request
          </motion.button>
          <motion.button onClick={() => run('broken')} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', background: `linear-gradient(145deg, #f87171, ${C.red})`, color: '#fff', border: 'none', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 800, boxShadow: raised(C.red) }}>
            ⚡ Break the Contract
          </motion.button>
        </div>

        {/* Gateway windows */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', perspective: '800px' }}>
          {WINDOWS.map((w, i) => {
            const isPast  = step > i;
            const isCur   = step === i;
            const isFail  = mode === 'broken' && i >= 2 && step >= 2;
            const color   = isFail ? C.red : isCur ? C.teal : isPast ? C.green : C.purple;
            return (
              <motion.div key={w.id}
                animate={{
                  z: isCur ? 20 : 0,
                  scale: isCur ? 1.04 : 1,
                  boxShadow: isCur || isPast ? raised(color) : flat,
                  opacity: step === -1 ? 1 : (isCur || isPast) ? 1 : 0.35,
                }}
                transition={sp}
                style={{
                  padding: '14px 10px', borderRadius: '14px', textAlign: 'center' as const,
                  background: `color-mix(in srgb, var(--ed-card) 88%, ${color} 12%)`,
                  border: `2px solid ${(isCur || isPast) ? color : `${color}25`}`,
                }}
              >
                <div style={{ fontSize: '22px', marginBottom: '8px' }}>{isFail ? '✗' : isPast ? '✓' : w.icon}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color, marginBottom: '5px', letterSpacing: '0.08em' }}>{w.label}</div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{isFail ? 'Rejected — contract violated' : w.desc}</div>
                {isCur && <motion.div animate={{ scale: [1,1.4,1] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: '50%', background: color, margin: '8px auto 0', boxShadow: `0 0 8px ${color}` }} />}
              </motion.div>
            );
          })}
        </div>

        {/* Final state */}
        <AnimatePresence>
          {step === -1 && mode && (
            <motion.div key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '12px', background: mode === 'valid' ? `${C.green}0d` : `${C.red}0d`, border: `1.5px solid ${mode === 'valid' ? C.green : C.red}30`, borderLeft: `4px solid ${mode === 'valid' ? C.green : C.red}` }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: mode === 'valid' ? C.green : C.red }}>
                {mode === 'valid' ? '✓ Response returned — { rows: [...], total: 48, cursor: "..." }' : '✗ 422 Unprocessable — missing required field: team_id'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ClickHint text="Send a valid request or break the contract to see what happens" />
    </Shell>
  );
}

// ─── 5. ACCESS MATRIX CONSOLE ────────────────────────────────────────────────

const ROLES_AM   = ['Admin', 'Manager', 'Contributor', 'Viewer'];
const ACTIONS_AM = ['View', 'Edit', 'Export', 'Delete'];
const PERM_AM: ('allow' | 'deny' | 'escalate')[][] = [
  ['allow','allow','allow','allow'],
  ['allow','allow','allow','deny'],
  ['allow','allow','deny', 'deny'],
  ['allow','deny', 'deny', 'deny'],
];
const CELL_COLOR = { allow: C.green, deny: C.red, escalate: C.amber };

export function AccessMatrixConsole() {
  const [role,   setRole]   = useState<number | null>(null);
  const [action, setAction] = useState<number | null>(null);

  const decision = role !== null && action !== null ? PERM_AM[role][action] : null;

  return (
    <Shell caption="A sentence like 'admins can do everything' expands into a grid of decisions. Enterprise permission systems are the product — not implementation detail.">
      <div style={{ borderRadius: '24px', padding: '22px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: flat }}>
        {/* Role + Action selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '8px', letterSpacing: '0.1em' }}>SELECT ROLE</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
              {ROLES_AM.map((r, i) => (
                <Chip key={r} label={r} accent={C.purple} active={role === i} onClick={() => setRole(role === i ? null : i)} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '8px', letterSpacing: '0.1em' }}>SELECT ACTION</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
              {ACTIONS_AM.map((a, i) => (
                <Chip key={a} label={a} accent={C.teal} active={action === i} onClick={() => setAction(action === i ? null : i)} />
              ))}
            </div>
          </div>
        </div>

        {/* Matrix */}
        <div style={{ overflowX: 'auto' as const, marginBottom: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'separate' as const, borderSpacing: '5px' }}>
            <thead>
              <tr>
                <th style={{ padding: '4px 8px', fontSize: '8px', color: 'var(--ed-ink3)', textAlign: 'left' as const, fontFamily: "'JetBrains Mono',monospace" }}></th>
                {ACTIONS_AM.map((a, ai) => (
                  <th key={a} style={{ padding: '4px 8px', fontSize: '8px', fontWeight: 800, color: action === ai ? C.teal : 'var(--ed-ink3)', fontFamily: "'JetBrains Mono',monospace", textAlign: 'center' as const }}>
                    {a}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES_AM.map((r, ri) => (
                <tr key={r}>
                  <td style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 700, color: role === ri ? C.purple : 'var(--ed-ink2)', whiteSpace: 'nowrap' as const }}>{r}</td>
                  {ACTIONS_AM.map((_, ai) => {
                    const p = PERM_AM[ri][ai];
                    const c = CELL_COLOR[p];
                    const lit = role === ri || action === ai;
                    const selected = role === ri && action === ai;
                    return (
                      <motion.td key={ai} animate={{ z: selected ? 16 : 0 }} transition={sp}
                        style={{ padding: '3px', textAlign: 'center' as const, verticalAlign: 'middle' as const }}>
                        <motion.div
                          animate={{
                            y: lit ? -3 : 0,
                            boxShadow: lit ? raised(c) : flat,
                          }}
                          transition={sp}
                          style={{
                            width: 38, height: 38, borderRadius: '10px', margin: '0 auto',
                            background: `linear-gradient(145deg, ${c}cc, ${c})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '15px', color: '#fff', fontWeight: 700,
                            border: selected ? `2px solid ${c}` : 'none',
                          }}
                        >
                          {p === 'allow' ? '✓' : p === 'deny' ? '–' : '↑'}
                        </motion.div>
                      </motion.td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Decision badge */}
        <AnimatePresence mode="wait">
          {decision ? (
            <motion.div key={decision} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
              style={{ padding: '12px 16px', borderRadius: '12px', background: `${CELL_COLOR[decision]}0d`, border: `1.5px solid ${CELL_COLOR[decision]}30`, borderLeft: `4px solid ${CELL_COLOR[decision]}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '24px' }}>{decision === 'allow' ? '✅' : decision === 'deny' ? '🚫' : '⬆'}</div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800, color: CELL_COLOR[decision], marginBottom: '2px', letterSpacing: '0.1em' }}>
                  {ROLES_AM[role!]} · {ACTIONS_AM[action!]} → {decision.toUpperCase()}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink2)' }}>
                  {decision === 'allow' ? 'Access granted — this role can perform this action.' :
                   decision === 'deny'  ? 'Access denied — this role cannot perform this action.' :
                   'Escalation required — this action needs manager approval.'}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ padding: '10px', textAlign: 'center' as const, fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: 'var(--ed-ink3)', fontWeight: 600 }}>
              Select a role and action to see the decision
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ClickHint text="Select a role and action to see what the matrix decides" />
    </Shell>
  );
}

// ─── 6. TRAFFIC LOAD OPS ROOM ────────────────────────────────────────────────

const LOAD_STATES = [
  { id: 'normal',   label: 'Normal',   desc: '50 req/s',   color: C.green,  servers: [22, 18, 14], queue: 0,  async: false, sla: 99 },
  { id: 'peak',     label: 'Peak',     desc: '500 req/s',  color: C.amber,  servers: [68, 58, 44], queue: 4,  async: false, sla: 97 },
  { id: 'overload', label: 'Overload', desc: '5k req/s',   color: C.red,    servers: [94, 88, 72], queue: 12, async: true,  sla: 84 },
];
const NODES = ['Load Balancer', 'App Server', 'Database'];

export function TrafficLoadOpsRoom() {
  const [lvl, setLvl] = useState(0);
  const L = LOAD_STATES[lvl];

  return (
    <Shell caption="At scale, synchronous product experiences become technically impossible. The product design must change shape — not just the backend. When load breaks sync, async becomes the feature.">
      {/* Load selector */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {LOAD_STATES.map((l, i) => (
          <Chip key={l.id} label={`${l.label} · ${l.desc}`} accent={l.color} active={lvl === i} onClick={() => setLvl(i)} />
        ))}
      </div>

      <div style={{ borderRadius: '24px', padding: '22px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: flat }}>
        {/* Server nodes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px', perspective: '700px' }}>
          {NODES.map((name, i) => {
            const load = L.servers[i];
            const c = load > 80 ? C.red : load > 50 ? C.amber : C.green;
            const stressed = load > 80;
            return (
              <motion.div key={name}
                animate={{ x: stressed ? [-1.5, 1.5, -1.5] : 0, y: stressed ? [0,-2,0] : 0, boxShadow: raised(c) }}
                transition={stressed ? { duration: 0.12, repeat: Infinity } : sp}
                style={{
                  borderRadius: '16px', padding: '14px 10px', textAlign: 'center' as const,
                  background: `color-mix(in srgb, var(--ed-card) 84%, ${c} 16%)`,
                  border: `2px solid ${c}30`,
                }}
              >
                <div style={{ fontSize: '22px', marginBottom: '8px' }}>{['⚖','🖥','🗄'][i]}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800, color: c, marginBottom: '8px' }}>{name}</div>
                <Bar value={load} color={c} />
                <div style={{ marginTop: '4px', fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: c, fontWeight: 700 }}>{load}%</div>
              </motion.div>
            );
          })}
        </div>

        {/* Queue + SLA */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '16px', marginBottom: '14px' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '8px', letterSpacing: '0.1em' }}>REQUEST QUEUE</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' as const, minHeight: '34px', alignItems: 'flex-start' }}>
              <AnimatePresence>
                {Array.from({ length: L.queue }).map((_, i) => (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ ...spB, delay: i * 0.04 }}
                    style={{ width: 28, height: 28, borderRadius: '8px', background: `${L.color}1a`, border: `1.5px solid ${L.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: L.color, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>
                    {i + 1}
                  </motion.div>
                ))}
              </AnimatePresence>
              {L.queue === 0 && <div style={{ fontSize: '11px', color: C.green, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>✓ No queue</div>}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '8px', letterSpacing: '0.1em' }}>SLA</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '26px', fontWeight: 800, color: L.sla > 95 ? C.green : L.sla > 90 ? C.amber : C.red }}>{L.sla}%</div>
          </div>
        </div>

        {/* Async notice */}
        <AnimatePresence>
          {L.async && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ padding: '12px 16px', borderRadius: '12px', background: `${C.red}07`, border: `1.5px solid ${C.red}28`, borderLeft: `4px solid ${C.red}` }}>
              <div style={{ fontWeight: 700, fontSize: '12px', color: C.red, marginBottom: '3px' }}>Export moved to background job</div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>Sync is no longer possible. The product must queue the export and notify via email or in-app — that is a product design change, not just a backend one.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ClickHint text="Click a load level to watch system behavior change" />
    </Shell>
  );
}

// ─── 7. SCOPE DECOMPOSITION BOARD ────────────────────────────────────────────

const STREAMS = [
  { label: 'Frontend component',        icon: '⬜', color: C.blue,   risk: 'known',      est: '2–3d', owner: 'FE' },
  { label: 'Backend API endpoint',      icon: '⚙',  color: C.purple, risk: 'known',      est: '1–2d', owner: 'BE' },
  { label: 'Auth / permission scope',   icon: '🔑', color: C.amber,  risk: 'uncertain',  est: '2–5d', owner: 'BE' },
  { label: 'Analytics instrumentation', icon: '📊', color: C.teal,   risk: 'dependency', est: '1–3d', owner: 'Data' },
  { label: 'Data migration',            icon: '🗄',  color: C.coral,  risk: 'unknown',    est: '3–8d', owner: 'Data' },
  { label: 'QA + edge cases',           icon: '🧪', color: '#7C3AED', risk: 'uncertain', est: '2–4d', owner: 'QA' },
  { label: 'Rollout + monitoring',      icon: '🚀', color: C.green,  risk: 'known',      est: '1–2d', owner: 'BE' },
];
const RISK_COLORS: Record<string, string> = { known: C.green, uncertain: C.amber, dependency: C.blue, unknown: C.red };
const RISK_FILTERS = ['all', 'known', 'uncertain', 'unknown', 'dependency'] as const;

export function ScopeDecompositionBoard() {
  const [filter, setFilter] = useState<typeof RISK_FILTERS[number]>('all');
  const [exploded, setExploded] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const visible = STREAMS.filter(s => filter === 'all' || s.risk === filter);
  const totalMin = visible.reduce((a, s) => a + parseInt(s.est), 0);
  const totalMax = visible.reduce((a, s) => a + parseInt(s.est.split('–')[1] || s.est), 0);

  return (
    <Shell caption="Decomposition reveals hidden uncertainty — it doesn't create it. Every risk type was already inside the feature card before anyone decomposed it.">
      <div style={{ borderRadius: '24px', padding: '22px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: flat }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          {/* Feature card */}
          <motion.div
            onClick={() => setExploded(e => !e)}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: exploded ? raised(C.purple) : flat }}
            transition={sp}
            style={{
              flexShrink: 0, width: '120px', padding: '16px 12px', borderRadius: '18px', cursor: 'pointer',
              background: `linear-gradient(145deg, ${C.purple}cc, ${C.purple})`,
              color: '#fff', textAlign: 'center' as const, userSelect: 'none' as const,
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📦</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, letterSpacing: '0.1em', opacity: 0.8, marginBottom: '5px' }}>FEATURE</div>
            <div style={{ fontSize: '12px', fontWeight: 700, lineHeight: 1.4 }}>Export Team Analytics</div>
            <motion.div animate={{ rotate: exploded ? 45 : 0 }} style={{ marginTop: '10px', fontSize: '14px' }}>✦</motion.div>
          </motion.div>

          <div style={{ flex: 1 }}>
            {/* Filters */}
            {exploded && (
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginBottom: '12px' }}>
                {RISK_FILTERS.map(f => (
                  <Chip key={f} label={f === 'all' ? 'Show All' : f} accent={f === 'all' ? C.purple : RISK_COLORS[f] || C.purple} active={filter === f} onClick={() => setFilter(f)} />
                ))}
              </div>
            )}

            {/* Workstreams */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
              <AnimatePresence>
                {exploded && visible.map((w, i) => (
                  <motion.div key={w.label}
                    initial={{ opacity: 0, x: 28, scale: 0.92 }}
                    animate={{ opacity: 1, x: 0, scale: hovered === i ? 1.02 : 1, boxShadow: hovered === i ? raised(w.color) : flat }}
                    exit={{ opacity: 0, x: 28, scale: 0.92 }}
                    transition={{ ...sp, delay: i * 0.05 }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '9px',
                      padding: '8px 12px', borderRadius: '12px',
                      background: hovered === i ? `color-mix(in srgb, var(--ed-card) 88%, ${w.color} 12%)` : 'var(--ed-cream)',
                      border: `1.5px solid ${hovered === i ? `${w.color}40` : 'var(--ed-rule)'}`,
                    }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: '8px', background: `linear-gradient(145deg, ${w.color}cc, ${w.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>{w.icon}</div>
                    <span style={{ fontSize: '11px', color: 'var(--ed-ink2)', flex: 1 }}>{w.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: 'var(--ed-ink3)', flexShrink: 0 }}>{w.owner}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: RISK_COLORS[w.risk], background: `${RISK_COLORS[w.risk]}14`, padding: '2px 7px', borderRadius: '6px', fontWeight: 800, flexShrink: 0 }}>{w.risk}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: 'var(--ed-ink3)', flexShrink: 0 }}>{w.est}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {!exploded && (
                <div style={{ height: '42px', display: 'flex', alignItems: 'center', paddingLeft: '4px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: 'var(--ed-ink3)', fontWeight: 600 }}>Click the card to scope it →</div>
                </div>
              )}
            </div>

            {/* Estimate total */}
            {exploded && visible.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '10px', background: `${C.purple}0d`, border: `1px solid ${C.purple}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: 'var(--ed-ink3)', fontWeight: 700 }}>ESTIMATE RANGE ({visible.length} streams)</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '14px', fontWeight: 800, color: C.purple }}>{totalMin}–{totalMax}d</div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <ClickHint text="Click the feature card · filter by risk type to see estimate range shift" />
    </Shell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRACK 2 — APM
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 8. ARCHITECTURE DEBT PRESSURE MAP ───────────────────────────────────────

const ZONES = [
  { label: 'Clean Module',       icon: '✅', desc: 'Well-tested, low coupling, easy to change',         color: C.green  },
  { label: 'First Shortcut',     icon: '⚡', desc: 'Fast-follows from Q1, manageable now',              color: C.amber  },
  { label: 'Coupled Subsystem',  icon: '🔗', desc: 'Several features share brittle internal contracts', color: C.coral  },
  { label: 'Fragile Release',    icon: '💣', desc: 'Deploys are risky, incidents on change, fear-driven', color: C.red  },
];

export function ArchitectureDebtPressureMap() {
  const [quarter, setQuarter] = useState(0); // 0=Q1, 1=Q2, 2=Q3, 3=Q4

  const GAUGES = [
    { label: 'Velocity',            values: [88, 74, 56, 38], color: C.green },
    { label: 'Incident Risk',       values: [12, 28, 52, 78], color: C.red   },
    { label: 'Change Confidence',   values: [82, 66, 44, 22], color: C.blue  },
    { label: 'Roadmap Optionality', values: [90, 72, 50, 28], color: C.teal  },
  ];

  const zoneWeights = [0, quarter * 0.5, quarter * 0.9, quarter * 1.2];

  return (
    <Shell caption="Technical debt matters to PMs when it changes speed, reliability, or strategic range. The accumulation isn't visible until it's already compressing the roadmap.">
      <div style={{ borderRadius: '24px', padding: '22px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: flat }}>
        {/* Quarter slider */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '10px', letterSpacing: '0.1em' }}>MOVE QUARTER TO WATCH DEBT ACCUMULATE</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
              <Chip key={q} label={q} accent={i <= quarter ? (i < 2 ? C.green : i < 3 ? C.amber : C.red) : C.purple} active={quarter === i} onClick={() => setQuarter(i)} />
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Architecture zones */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '10px', letterSpacing: '0.1em' }}>ARCHITECTURE STATE</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
              {ZONES.map((z, i) => {
                const weight = zoneWeights[i];
                const isVisible = i <= quarter;
                return (
                  <motion.div key={z.label}
                    animate={{ opacity: isVisible ? 1 : 0.25, x: isVisible ? 0 : 10 }}
                    transition={sp}
                    style={{
                      padding: '10px 12px', borderRadius: '12px',
                      background: `color-mix(in srgb, var(--ed-card) 88%, ${z.color} 12%)`,
                      border: `2px solid ${isVisible ? `${z.color}40` : 'var(--ed-rule)'}`,
                      boxShadow: isVisible ? raised(z.color) : 'none',
                      display: 'flex', alignItems: 'center', gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{z.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: isVisible ? z.color : 'var(--ed-ink3)' }}>{z.label}</div>
                      <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', lineHeight: 1.5, marginTop: '2px' }}>{z.desc}</div>
                    </div>
                    {isVisible && weight > 0 && (
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: z.color, fontWeight: 800 }}>
                        +{Math.round(weight * 10)}%
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Pressure gauges */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '10px', letterSpacing: '0.1em' }}>SYSTEM PRESSURE</div>
            <div style={{ padding: '16px', borderRadius: '16px', background: `${C.purple}07`, border: `1px solid ${C.purple}15` }}>
              {GAUGES.map(g => (
                <GaugeRow key={g.label} label={g.label} value={g.values[quarter]} color={g.color} width={130} />
              ))}
            </div>
            <motion.div
              animate={{ background: quarter > 1 ? `${C.red}0d` : `${C.green}0d`, borderColor: quarter > 1 ? `${C.red}25` : `${C.green}25` }}
              style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid', borderLeft: `4px solid ${quarter > 1 ? C.red : C.green}` }}
            >
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: quarter > 1 ? C.red : C.green, marginBottom: '3px', letterSpacing: '0.08em' }}>
                {quarter <= 1 ? 'ROADMAP SAFE' : quarter === 2 ? 'ROADMAP CONSTRAINED' : 'ROADMAP COMPRESSED'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
                {quarter === 0 ? 'Debt is minimal. Full strategic optionality.' :
                 quarter === 1 ? 'First shortcuts visible. Monitor coupling.' :
                 quarter === 2 ? 'Coupled subsystem slowing sprint velocity.' :
                 'Fragile release path blocking roadmap execution.'}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <ClickHint text="Click a quarter to watch debt accumulate and roadmap capacity compress" />
    </Shell>
  );
}

// ─── 9. REUSE LEVERAGE SIMULATOR ─────────────────────────────────────────────

const CONSUMERS = [
  { id: 'mobile',   label: 'Mobile App',     icon: '📱' },
  { id: 'analytics',label: 'Analytics',      icon: '📊' },
  { id: 'partner',  label: 'Partner API',    icon: '🔗' },
  { id: 'admin',    label: 'Admin Exports',  icon: '📋' },
];

export function ReuseLeverageSimulator() {
  const [real, setReal] = useState<Set<string>>(new Set());

  const toggle = (id: string) => setReal(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const realCount = real.size;
  const platformPayoff = Math.min(100, realCount * 22);
  const featureCost = 35;
  const platformCost = 65;

  return (
    <Shell caption="Platform investment is justified shared leverage, not cleaner architecture for its own sake. Real consumers change the math — speculative consumers don't.">
      <div style={{ borderRadius: '24px', padding: '22px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: flat }}>
        {/* Consumer toggles */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '10px', letterSpacing: '0.1em' }}>MARK CONSUMERS AS REAL (COMMITTED) OR SPECULATIVE</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
            {CONSUMERS.map(c => {
              const isReal = real.has(c.id);
              return (
                <motion.button key={c.id} onClick={() => toggle(c.id)}
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  animate={{ boxShadow: isReal ? raised(C.green) : flat }}
                  transition={sp}
                  style={{
                    padding: '8px 14px', borderRadius: '10px', cursor: 'pointer',
                    background: isReal ? `${C.green}14` : 'var(--ed-card)',
                    border: `1.5px solid ${isReal ? C.green : `${C.amber}35`}`,
                    color: isReal ? C.green : C.amber,
                    fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 800,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                  <span>{c.icon}</span>{c.label}
                  <span style={{ fontSize: '8px', opacity: 0.8 }}>{isReal ? '✓ real' : '? spec'}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Build path comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
          {[
            { label: 'One-Off Feature', upfront: featureCost, payoff: realCount > 0 ? 15 : 30, color: C.coral, icon: '🔧', desc: 'Faster now, harder to share later' },
            { label: 'Platform Spine',  upfront: platformCost, payoff: platformPayoff, color: C.blue,  icon: '🏗', desc: 'Higher upfront, scales with consumers' },
          ].map(path => (
            <div key={path.label} style={{ borderRadius: '16px', padding: '16px', background: `color-mix(in srgb, var(--ed-card) 88%, ${path.color} 12%)`, border: `2px solid ${path.color}30`, boxShadow: raised(path.color) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>{path.icon}</span>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800, color: path.color }}>{path.label}</div>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: 'var(--ed-ink3)', marginBottom: '4px' }}>UPFRONT COST</div>
                <Bar value={path.upfront} color={path.color} />
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: 'var(--ed-ink3)', marginBottom: '4px' }}>DOWNSTREAM PAYOFF</div>
                <Bar value={path.payoff} color={path.payoff > 50 ? C.green : C.amber} />
              </div>
              <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{path.desc}</div>
            </div>
          ))}
        </div>

        {/* Verdict */}
        <AnimatePresence mode="wait">
          <motion.div key={realCount} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ padding: '12px 16px', borderRadius: '12px', background: realCount >= 3 ? `${C.blue}0d` : realCount >= 1 ? `${C.amber}0d` : `${C.coral}0d`, border: `1.5px solid ${realCount >= 3 ? C.blue : realCount >= 1 ? C.amber : C.coral}25`, borderLeft: `4px solid ${realCount >= 3 ? C.blue : realCount >= 1 ? C.amber : C.coral}` }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: realCount >= 3 ? C.blue : realCount >= 1 ? C.amber : C.coral, marginBottom: '3px', letterSpacing: '0.1em' }}>
              {realCount >= 3 ? 'PLATFORM — JUSTIFIED' : realCount >= 1 ? 'MARGINAL — DECIDE BY CERTAINTY' : 'FEATURE-FIRST — SPECULATIVE CONSUMERS'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>
              {realCount === 0 ? 'No confirmed consumers. Build the one-off feature first — prove demand before the platform investment.' :
               realCount < 3 ? `${realCount} confirmed consumer${realCount > 1 ? 's' : ''}. Assess if others will commit before committing to platform scope.` :
               `${realCount} confirmed consumers. Platform investment is justified — shared leverage outweighs upfront cost.`}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <ClickHint text="Toggle consumers as real to see when platform investment becomes justified" />
    </Shell>
  );
}

// ─── 10. METRIC TRUTH CALIBRATION RIG ────────────────────────────────────────

const EVENT_FIELDS = [
  { id: 'user_id',      label: 'user_id',       required: true },
  { id: 'team_id',      label: 'team_id',       required: true },
  { id: 'session_type', label: 'session_type',  required: true },
  { id: 'workspace_id', label: 'workspace_id',  required: false },
  { id: 'timestamp',    label: 'timestamp',     required: true },
];

export function MetricTruthCalibrationRig() {
  const [presentA, setPresentA] = useState<Set<string>>(new Set(EVENT_FIELDS.map(f => f.id)));
  const [presentB, setPresentB] = useState<Set<string>>(new Set(['user_id', 'timestamp']));

  const scoreA = Math.round((presentA.size / EVENT_FIELDS.length) * 100);
  const scoreB = Math.round((presentB.size / EVENT_FIELDS.length) * 100);
  const diverged = Math.abs(scoreA - scoreB) > 20;

  function toggleField(side: 'A' | 'B', id: string) {
    const setter = side === 'A' ? setPresentA : setPresentB;
    setter(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function metricValue(pct: number) {
    return Math.round(40 + pct * 0.52);
  }

  return (
    <Shell caption="Two teams can report 'retention' and get completely different numbers from the same product. The difference is almost always in the event definition, not the metric formula.">
      <div style={{ borderRadius: '24px', padding: '22px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: flat }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {(['A', 'B'] as const).map(side => {
            const present = side === 'A' ? presentA : presentB;
            const score = side === 'A' ? scoreA : scoreB;
            const color = score > 70 ? C.green : score > 40 ? C.amber : C.red;
            return (
              <div key={side} style={{ borderRadius: '16px', padding: '16px', background: `color-mix(in srgb, var(--ed-card) 88%, ${color} 12%)`, border: `2px solid ${color}30`, boxShadow: raised(color) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800, color }}>{side === 'A' ? 'TEAM A' : 'TEAM B'} · RETENTION EVENT</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '20px', fontWeight: 800, color }}>{metricValue(score)}%</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
                  {EVENT_FIELDS.map(f => {
                    const on = present.has(f.id);
                    return (
                      <motion.button key={f.id} onClick={() => toggleField(side, f.id)}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px', borderRadius: '7px', cursor: 'pointer',
                          background: on ? `${C.green}14` : `${C.red}0d`,
                          border: `1px solid ${on ? `${C.green}30` : `${C.red}25`}`,
                          color: on ? C.green : C.red,
                          fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, textAlign: 'left' as const,
                        }}
                      >
                        <span>{on ? '✓' : '✗'}</span>
                        <span>{f.label}</span>
                        {f.required && <span style={{ fontSize: '7px', opacity: 0.7, marginLeft: 'auto' }}>required</span>}
                      </motion.button>
                    );
                  })}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: 'var(--ed-ink3)', marginBottom: '4px' }}>INSTRUMENTATION QUALITY</div>
                  <Bar value={score} color={color} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Calibration result */}
        <motion.div
          animate={{ background: diverged ? `${C.red}0d` : `${C.green}0d`, borderColor: diverged ? `${C.red}25` : `${C.green}25` }}
          style={{ padding: '12px 16px', borderRadius: '12px', border: `1.5px solid`, borderLeft: `4px solid ${diverged ? C.red : C.green}` }}
        >
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: diverged ? C.red : C.green, marginBottom: '3px', letterSpacing: '0.1em' }}>
            {diverged ? `METRIC DIVERGENCE DETECTED — ${Math.abs(scoreA - scoreB)}% INSTRUMENTATION GAP` : 'METRIC ALIGNED — INSTRUMENTATION CONSISTENT'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>
            {diverged
              ? `Team A reports ${metricValue(scoreA)}% retention. Team B reports ${metricValue(scoreB)}% for the same metric. The difference is missing event fields — not different users.`
              : 'Both teams are capturing the same event fields. Metric definitions will produce consistent numbers across dashboards.'}
          </div>
        </motion.div>
      </div>
      <ClickHint text="Toggle event fields on each team to see reported retention diverge" />
    </Shell>
  );
}

// ─── 11. CONTRACT BLAST RADIUS MAP ───────────────────────────────────────────

const CONSUMERS_BR = [
  { id: 'web',     label: 'Web App',      icon: '🌐' },
  { id: 'mobile',  label: 'Mobile',       icon: '📱' },
  { id: 'analytics', label: 'Analytics',  icon: '📊' },
  { id: 'partner', label: 'Partner API',  icon: '🔗' },
  { id: 'admin',   label: 'Admin Export', icon: '📋' },
];
const CHANGE_TYPES = [
  { id: 'rename', label: 'Rename Field',  impact: ['web','mobile','analytics','partner','admin'], severity: 'high'   },
  { id: 'remove', label: 'Remove Field',  impact: ['web','mobile','analytics','partner'],         severity: 'high'   },
  { id: 'add',    label: 'Add Optional',  impact: [],                                             severity: 'low'    },
  { id: 'version',label: 'Version → v2', impact: ['partner','admin'],                             severity: 'medium' },
];
const SEV_COLOR: Record<string, string> = { high: C.red, medium: C.amber, low: C.green };

export function ContractBlastRadiusMap() {
  const [change, setChange] = useState<string | null>(null);
  const ct = CHANGE_TYPES.find(c => c.id === change);

  function impactColor(consumerId: string) {
    if (!ct) return C.teal;
    return ct.impact.includes(consumerId) ? SEV_COLOR[ct.severity] : C.green;
  }

  return (
    <Shell caption="Once multiple teams plan around an API, it is an organizational contract. Changes propagate to consumers the implementing team may not even talk to regularly.">
      <div style={{ borderRadius: '24px', padding: '22px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: flat }}>
        {/* Change type selector */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '10px', letterSpacing: '0.1em' }}>SELECT A CONTRACT CHANGE</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
            {CHANGE_TYPES.map(ct => (
              <Chip key={ct.id} label={ct.label} accent={SEV_COLOR[ct.severity]} active={change === ct.id} onClick={() => setChange(change === ct.id ? null : ct.id)} />
            ))}
          </div>
        </div>

        {/* Blast radius diagram */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '16px' }}>
          {/* Central contract node */}
          <motion.div
            animate={{ boxShadow: ct ? raised(SEV_COLOR[ct.severity]) : raised(C.purple) }}
            transition={sp}
            style={{
              padding: '14px 24px', borderRadius: '16px', textAlign: 'center' as const,
              background: ct ? `${SEV_COLOR[ct.severity]}14` : `${C.purple}14`,
              border: `2px solid ${ct ? SEV_COLOR[ct.severity] : C.purple}35`,
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 800, color: ct ? SEV_COLOR[ct.severity] : C.purple }}>
              /api/v1/admin/workspaces/usage
            </div>
            {ct && <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '4px' }}>{ct.label}</div>}
          </motion.div>

          {/* Consumer nodes */}
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '10px', justifyContent: 'center' }}>
            {CONSUMERS_BR.map(c => {
              const color = impactColor(c.id);
              const hit = ct ? ct.impact.includes(c.id) : false;
              return (
                <motion.div key={c.id}
                  animate={{ boxShadow: hit ? raised(color) : flat, scale: hit ? 1.04 : 1 }}
                  transition={sp}
                  style={{
                    padding: '10px 16px', borderRadius: '12px', textAlign: 'center' as const,
                    background: `color-mix(in srgb, var(--ed-card) 88%, ${color} 12%)`,
                    border: `2px solid ${color}35`,
                    minWidth: '90px',
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>{c.icon}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800, color }}>{c.label}</div>
                  {ct && (
                    <div style={{ marginTop: '5px', fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color, fontWeight: 700 }}>
                      {hit ? (ct.severity === 'high' ? '💥 Breaking' : '⚠ Partial') : '✓ Safe'}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {ct && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
            style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '12px', background: `${SEV_COLOR[ct.severity]}0d`, border: `1.5px solid ${SEV_COLOR[ct.severity]}28`, borderLeft: `4px solid ${SEV_COLOR[ct.severity]}` }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: SEV_COLOR[ct.severity], marginBottom: '3px', letterSpacing: '0.1em' }}>
              {ct.impact.length === 0 ? 'NO BLAST RADIUS' : `${ct.impact.length} CONSUMER${ct.impact.length > 1 ? 'S' : ''} AFFECTED`}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>
              {ct.id === 'rename' ? 'All consumers hard-coding this field will break. Requires coordinated migration across all teams.' :
               ct.id === 'remove' ? 'Removing a field is a breaking change for every consumer using it. Requires versioning or migration period.' :
               ct.id === 'add'    ? 'Adding an optional field is non-breaking. Existing consumers are unaffected.' :
               'Versioning isolates breaking changes to consumers that must migrate. Allows gradual adoption.'}
            </div>
          </motion.div>
        )}
      </div>
      <ClickHint text="Select a contract change to see which consumers are affected" />
    </Shell>
  );
}

// ─── 12. ENTERPRISE RELIABILITY WAR ROOM ─────────────────────────────────────

export function EnterpriseReliabilityWarRoom() {
  const [load, setLoad] = useState<'normal' | 'peak'>('normal');
  const [strategy, setStrategy] = useState<'silent' | 'transparent'>('silent');

  const METRICS = [
    { label: 'p95 Latency',         normal: [220,  820],  unit: 'ms',  color: C.teal  },
    { label: 'Error Rate',          normal: [0.2,  3.4],  unit: '%',   color: C.red   },
    { label: 'Retry Volume',        normal: [12,   340],  unit: '/min',color: C.amber },
    { label: 'Enterprise Escalations', normal: [0, 8],   unit: '/hr', color: C.coral },
  ];

  const idx = load === 'normal' ? 0 : 1;

  return (
    <Shell caption="Enterprise users don't separate product value from operational reliability once the workflow is business-critical. Reliability is part of the value proposition — not infrastructure polish.">
      <div style={{ borderRadius: '24px', padding: '22px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: flat }}>
        {/* Load toggle */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Chip label="Normal Load" accent={C.green} active={load === 'normal'} onClick={() => setLoad('normal')} />
          <Chip label="Peak Load (2×)" accent={C.red} active={load === 'peak'} onClick={() => setLoad('peak')} />
        </div>

        {/* Metric gauges */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {METRICS.map(m => {
            const val = m.normal[idx];
            const pct = Math.min(100, (val / (m.normal[1] * 1.1)) * 100);
            return (
              <div key={m.label} style={{ padding: '14px', borderRadius: '14px', background: `color-mix(in srgb, var(--ed-card) 88%, ${m.color} 12%)`, border: `1.5px solid ${m.color}28`, boxShadow: raised(m.color) }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: m.color, marginBottom: '8px', letterSpacing: '0.08em' }}>{m.label.toUpperCase()}</div>
                <motion.div animate={{ color: load === 'peak' ? C.red : m.color }} transition={{ duration: 0.3 }}
                  style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '22px', fontWeight: 800, color: m.color, marginBottom: '6px' }}>
                  {val}{m.unit}
                </motion.div>
                <Bar value={pct} color={load === 'peak' ? C.red : m.color} />
              </div>
            );
          })}
        </div>

        {/* Response strategy */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '10px', letterSpacing: '0.1em' }}>PRODUCT RESPONSE STRATEGY</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Chip label="Silent Degradation" accent={C.red} active={strategy === 'silent'} onClick={() => setStrategy('silent')} />
            <Chip label="Transparent + Async" accent={C.green} active={strategy === 'transparent'} onClick={() => setStrategy('transparent')} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={`${load}-${strategy}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ padding: '12px 16px', borderRadius: '12px', background: strategy === 'transparent' ? `${C.green}0d` : `${C.red}0d`, border: `1.5px solid ${strategy === 'transparent' ? C.green : C.red}28`, borderLeft: `4px solid ${strategy === 'transparent' ? C.green : C.red}` }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: strategy === 'transparent' ? C.green : C.red, marginBottom: '3px', letterSpacing: '0.1em' }}>
              {strategy === 'transparent' ? 'TRANSPARENT ASYNC — TRUST PRESERVED' : 'SILENT FAILURE — TRUST ERODING'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>
              {load === 'normal' && strategy === 'silent'       ? 'Load is manageable. Silent degradation is tolerable but misses an opportunity to surface system state.' :
               load === 'normal' && strategy === 'transparent'  ? 'Communicating system state even at normal load builds admin confidence in the product.' :
               load === 'peak'   && strategy === 'silent'       ? 'At peak load, silent failures accumulate. Admins notice, log issues, build workarounds. Renewal risk rises.' :
               'At peak load, transparent async with clear job status preserves trust. Admin knows what is happening and why.'}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <ClickHint text="Toggle load and response strategy to see the trust impact" />
    </Shell>
  );
}

// ─── 13. VENDOR LOCK-IN DECISION LAB ─────────────────────────────────────────

const CAPABILITIES = [
  { id: 'commodity', label: 'Commodity',         desc: 'Email delivery, payments, auth — market-standard, no differentiation', icon: '🛒' },
  { id: 'strategic', label: 'Strategic Workflow', desc: 'Core to how users experience the product — product advantage lives here', icon: '⚡' },
  { id: 'datamoat',  label: 'Data Moat',          desc: 'Where proprietary data accumulates — giving this away destroys future leverage', icon: '🏰' },
];
const GAUGES_BVB: Record<string, { differentiation: number; speed: number; control: number; switching: number; rec: string; recColor: string }> = {
  commodity: { differentiation: 10, speed: 90, control: 45, switching: 25, rec: 'BUY',    recColor: C.green },
  strategic: { differentiation: 85, speed: 55, control: 80, switching: 65, rec: 'BUILD',  recColor: C.blue  },
  datamoat:  { differentiation: 95, speed: 40, control: 95, switching: 90, rec: 'BUILD',  recColor: C.blue  },
};

export function VendorLockInDecisionLab() {
  const [cap, setCap] = useState<string | null>(null);
  const g = cap ? GAUGES_BVB[cap] : null;

  return (
    <Shell caption="Build vs buy is a bet on what should remain yours. The decisive question is not 'what is faster now?' — it is 'what must we own in 18 months?'">
      <div style={{ borderRadius: '24px', padding: '22px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: flat }}>
        {/* Capability selector */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '10px', letterSpacing: '0.1em' }}>SELECT CAPABILITY TYPE</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
            {CAPABILITIES.map(c => (
              <motion.button key={c.id} onClick={() => setCap(cap === c.id ? null : c.id)}
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                animate={{ boxShadow: cap === c.id ? raised(C.purple) : flat }}
                transition={sp}
                style={{
                  flex: 1, padding: '12px 10px', borderRadius: '14px', cursor: 'pointer',
                  background: cap === c.id ? `${C.purple}14` : 'var(--ed-card)',
                  border: `1.5px solid ${cap === c.id ? `${C.purple}40` : 'var(--ed-rule)'}`,
                  textAlign: 'center' as const,
                }}
              >
                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{c.icon}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800, color: cap === c.id ? C.purple : 'var(--ed-ink2)' }}>{c.label}</div>
                <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', marginTop: '4px', lineHeight: 1.4 }}>{c.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Gauges */}
        <AnimatePresence mode="wait">
          {g && (
            <motion.div key={cap} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
              <div style={{ padding: '16px', borderRadius: '16px', background: `${C.purple}07`, border: `1px solid ${C.purple}15`, marginBottom: '14px' }}>
                <GaugeRow label="Differentiation" value={g.differentiation} color={g.differentiation > 50 ? C.blue  : C.green} />
                <GaugeRow label="Speed to Ship"   value={g.speed}          color={g.speed > 50          ? C.green : C.amber} />
                <GaugeRow label="Future Control"  value={g.control}        color={g.control > 50         ? C.blue  : C.coral} />
                <GaugeRow label="Switching Cost"  value={g.switching}      color={g.switching > 50       ? C.red   : C.green} />
              </div>
              <div style={{ padding: '14px 18px', borderRadius: '14px', background: `${g.recColor}0d`, border: `1.5px solid ${g.recColor}30`, borderLeft: `4px solid ${g.recColor}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '28px', fontWeight: 900, color: g.recColor }}>{g.rec}</div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: g.recColor, marginBottom: '2px', letterSpacing: '0.1em' }}>RECOMMENDED DECISION</div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>
                    {cap === 'commodity' ? 'Commodity capabilities have mature vendor markets. Buy and stay focused on differentiated work.' :
                     cap === 'strategic' ? 'Strategic workflows are where competitive advantage lives. Vendor abstraction will eventually block the roadmap.' :
                     'Data moats require ownership. Outsourcing data accumulation hands your future leverage to a vendor.'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!g && (
          <div style={{ padding: '20px', textAlign: 'center' as const, fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: 'var(--ed-ink3)', fontWeight: 600 }}>
            Select a capability type to see the tradeoff analysis →
          </div>
        )}
      </div>
      <ClickHint text="Select a capability type to get the build vs buy recommendation" />
    </Shell>
  );
}

// ─── 14. ROADMAP CONFIDENCE SIMULATOR ────────────────────────────────────────

const OPEN_DECISIONS = [
  { id: 'vendor',    label: 'Vendor approval',     impact: 'Q2', color: C.amber },
  { id: 'migration', label: 'Migration risk',       impact: 'Q3', color: C.coral },
  { id: 'api',       label: 'API versioning',       impact: 'Q2', color: C.blue  },
  { id: 'loadtest',  label: 'Load test result',     impact: 'Q3', color: C.red   },
];

export function RoadmapConfidenceSimulator() {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setOpen(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const LANES = [
    { label: 'Now — Q1', type: 'committed',   baseConf: 95, impact: [] as string[] },
    { label: 'Q2',       type: 'planned',     baseConf: 80, impact: ['vendor','api'] },
    { label: 'Q3+',      type: 'contingent',  baseConf: 55, impact: ['migration','loadtest'] },
  ];

  function confidence(lane: typeof LANES[0]) {
    const hits = lane.impact.filter(d => open.has(d)).length;
    return Math.max(10, lane.baseConf - hits * 18);
  }

  const committedConf = confidence(LANES[0]);

  return (
    <Shell caption="Senior PM credibility comes from structured uncertainty — not fake certainty. Making the shape of what is unknown legible is how engineers and leadership can plan around it.">
      <div style={{ borderRadius: '24px', padding: '22px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: flat }}>
        {/* Open decision toggles */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '10px', letterSpacing: '0.1em' }}>OPEN DECISIONS (UNRESOLVED)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
            {OPEN_DECISIONS.map(d => {
              const isOpen = open.has(d.id);
              return (
                <motion.button key={d.id} onClick={() => toggle(d.id)}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  animate={{ boxShadow: isOpen ? raised(d.color) : flat }}
                  transition={sp}
                  style={{
                    padding: '7px 12px', borderRadius: '10px', cursor: 'pointer',
                    background: isOpen ? `${d.color}14` : 'var(--ed-card)',
                    border: `1.5px solid ${isOpen ? `${d.color}40` : 'var(--ed-rule)'}`,
                    color: isOpen ? d.color : 'var(--ed-ink3)',
                    fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                  <span>{isOpen ? '⚠' : '○'}</span>{d.label}
                  {isOpen && <span style={{ fontSize: '7px', opacity: 0.8 }}>affects {d.impact}</span>}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Roadmap lanes */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '16px' }}>
          {LANES.map(lane => {
            const conf = confidence(lane);
            const color = conf > 70 ? C.purple : conf > 40 ? C.amber : C.red;
            return (
              <div key={lane.label} style={{ padding: '14px 16px', borderRadius: '14px', background: `color-mix(in srgb, var(--ed-card) 88%, ${color} 12%)`, border: `2px solid ${color}28`, boxShadow: raised(color) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 800, color }}>{lane.label}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: 'var(--ed-ink3)', marginTop: '2px', letterSpacing: '0.06em' }}>{lane.type.toUpperCase()}</div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '18px', fontWeight: 800, color }}>{conf}%</div>
                </div>
                {/* Confidence band */}
                <div style={{ position: 'relative' as const, height: '12px', background: 'var(--ed-rule)', borderRadius: '6px', overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${conf}%` }} transition={{ duration: 0.5 }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${color}dd, ${color})`, borderRadius: '6px' }} />
                  {/* Uncertainty band */}
                  <motion.div animate={{ width: `${Math.max(0, 100 - conf)}%`, left: `${conf}%` }} transition={{ duration: 0.5 }}
                    style={{ position: 'absolute' as const, top: 0, height: '100%', background: `${color}20`, borderRadius: '0 6px 6px 0', borderLeft: `2px dashed ${color}50` }} />
                </div>
                {lane.impact.some(d => open.has(d)) && (
                  <div style={{ marginTop: '6px', fontSize: '9px', color, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
                    ⚠ Affected by: {lane.impact.filter(d => open.has(d)).join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div style={{ padding: '12px 16px', borderRadius: '12px', background: `${C.purple}0d`, border: `1px solid ${C.purple}20` }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 800, color: C.purple, marginBottom: '3px', letterSpacing: '0.1em' }}>
            COMMITTED CONFIDENCE: {committedConf}% · OPEN DECISIONS: {open.size}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>
            {open.size === 0
              ? 'No open decisions. Near-term commitments are solid. Structured uncertainty on Q2+ is honest and actionable.'
              : `${open.size} open decision${open.size > 1 ? 's' : ''} compressing confidence. Name these explicitly in planning communication — that is what makes uncertainty actionable.`}
          </div>
        </div>
      </div>
      <ClickHint text="Toggle open decisions to watch roadmap confidence compress" />
    </Shell>
  );
}

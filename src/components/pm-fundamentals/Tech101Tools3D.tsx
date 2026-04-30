'use client';

/**
 * Tech101Tools3D — Module 09 interactive teaching tools.
 * Each tool carries real educational weight; learners manipulate, not just observe.
 *
 * 1. FeatureToSystemMapper      — PM request → system layers affected
 * 2. LoadingStateDesignBoard    — 3 loading states + emotional impact
 * 3. QueryPathWalkthrough       — Filter → Join → Aggregate → Response
 * 4. EndpointContractViewer     — Request / response / errors side by side
 * 5. AccessDecisionSimulator    — Role + action + resource → allow/deny
 * 6. SyncAsyncExperienceBoard   — Inline wait vs background vs notify
 * 7. ScopeToEstimateDecomposer  — Feature card → tagged workstreams
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#7843EE';
const ACCENT_RGB = '120,67,238';

const TiltCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  const handle = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -5, y: ((e.clientX - r.left) / r.width - 0.5) * 5, scale: 1.01 });
  };
  return (
    <div onMouseMove={handle} onMouseLeave={() => setTilt({ x: 0, y: 0, scale: 1 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`, transition: 'transform 0.18s ease', willChange: 'transform', ...style }}>
      {children}
    </div>
  );
};

const ToolShell = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <TiltCard style={{ margin: '32px 0' }}>
    <div style={{ borderRadius: '16px', overflow: 'hidden', border: `1.5px solid ${ACCENT}30`, boxShadow: `0 8px 40px rgba(${ACCENT_RGB},0.12), 0 2px 8px rgba(0,0,0,0.08)`, background: 'var(--ed-card)' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0f0f1a 100%)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 32, height: 32, borderRadius: '8px', background: `${ACCENT}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 14, height: 14, borderRadius: '3px', background: ACCENT }} />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#F1F5F9', fontFamily: "'JetBrains Mono', monospace" }}>{title}</div>
          <div style={{ fontSize: '10px', color: 'rgba(241,245,249,0.45)', fontFamily: "'JetBrains Mono', monospace" }}>{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  </TiltCard>
);

// ─── 1. FEATURE-TO-SYSTEM MAPPER ─────────────────────────────────────────────

const FEATURE_REQUESTS = [
  {
    label: 'Admin can filter workspace usage by team',
    layers: ['frontend', 'api', 'permissions', 'query', 'cache'],
  },
  {
    label: 'Admin can export a usage report as CSV',
    layers: ['api', 'query', 'asyncJob', 'notifications'],
  },
  {
    label: 'Managers can only view their own teams',
    layers: ['permissions', 'api', 'frontend', 'audit'],
  },
];

const LAYER_META: Record<string, { label: string; desc: string; color: string }> = {
  frontend:     { label: 'Frontend',       desc: 'UI state, filter component, table rendering',          color: '#3B82F6' },
  api:          { label: 'API contract',   desc: 'Endpoint shape, request params, response format',      color: ACCENT    },
  permissions:  { label: 'Permissions',    desc: 'Role check, visibility rules, access gate',            color: '#CA8A04' },
  query:        { label: 'Data query',     desc: 'Filter logic, join complexity, aggregation cost',      color: '#0097A7' },
  cache:        { label: 'Caching',        desc: 'TTL design, cache invalidation, stale data risk',      color: '#E67E22' },
  asyncJob:     { label: 'Async job',      desc: 'Background processing, job queue, completion event',   color: '#7C3AED' },
  notifications:{ label: 'Notifications', desc: 'Email / in-app delivery once export is ready',         color: '#16A34A' },
  audit:        { label: 'Audit trail',    desc: 'Who accessed what data and when',                      color: '#EF4444' },
};

export function FeatureToSystemMapper() {
  const [selected, setSelected] = useState(0);
  const req = FEATURE_REQUESTS[selected];

  return (
    <ToolShell title="Feature-to-System Mapper" subtitle="One PM request — multiple system responsibilities">
      {/* Request selector */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ed-rule)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '4px' }}>SELECT A PM REQUEST</div>
        {FEATURE_REQUESTS.map((fr, i) => (
          <div key={i} onClick={() => setSelected(i)}
            style={{ padding: '10px 14px', borderRadius: '8px', background: selected === i ? `${ACCENT}12` : 'var(--ed-cream)', border: `1.5px solid ${selected === i ? ACCENT : 'var(--ed-rule)'}`, cursor: 'pointer', fontSize: '13px', color: selected === i ? ACCENT : 'var(--ed-ink2)', fontStyle: 'italic', transition: 'all 0.15s' }}>
            &ldquo;{fr.label}&rdquo;
          </div>
        ))}
      </div>

      {/* Layers affected */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>SYSTEM RESPONSIBILITIES ACTIVATED</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {req.layers.map((layerId, i) => {
            const layer = LAYER_META[layerId];
            return (
              <motion.div key={layerId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, duration: 0.2 }}
                style={{ display: 'flex', gap: '12px', padding: '10px 14px', borderRadius: '8px', background: `${layer.color}0D`, border: `1px solid ${layer.color}30`, alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: layer.color, flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: layer.color, marginBottom: '2px' }}>{layer.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{layer.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '6px', background: `${ACCENT}08`, border: `1px solid ${ACCENT}25`, fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>
          This request touches <strong style={{ color: ACCENT }}>{req.layers.length} system concerns</strong> — not one feature.
        </div>
      </div>
    </ToolShell>
  );
}

// ─── 2. LOADING STATE DESIGN BOARD ───────────────────────────────────────────
// Three states shown side-by-side — comparison is immediate, no toggling needed.

const PANEL_STATES = [
  {
    id: 'none',
    label: 'No feedback',
    color: '#EF4444',
    mood: 'Confused',
    moodDesc: 'Did my click do anything?',
    verdict: 'User abandons or clicks repeatedly.',
  },
  {
    id: 'spinner',
    label: 'Spinner only',
    color: '#CA8A04',
    mood: 'Uncertain',
    moodDesc: 'Something is happening... when will it end?',
    verdict: 'User waits anxiously. No trust signal.',
  },
  {
    id: 'full',
    label: 'Progress + context',
    color: '#16A34A',
    mood: 'Informed',
    moodDesc: 'Generating report — about 3 seconds.',
    verdict: 'User stays calm. Trust preserved.',
  },
];

function DashboardPanel({ panel }: { panel: typeof PANEL_STATES[0] }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Panel label */}
      <div style={{ padding: '6px 10px', borderRadius: '6px 6px 0 0', background: `${panel.color}15`, border: `1px solid ${panel.color}30`, borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: panel.color }}>{panel.label}</div>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: panel.color }} />
      </div>

      {/* Mock dashboard window */}
      <div style={{ borderRadius: '0 0 8px 8px', overflow: 'hidden', background: '#0f172a', border: `1px solid ${panel.color}30` }}>
        {/* Window chrome */}
        <div style={{ padding: '7px 10px', background: '#1e293b', display: 'flex', alignItems: 'center', gap: '5px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {['#EF4444', '#F59E0B', '#10B981'].map((c, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
          <div style={{ marginLeft: '6px', flex: 1, height: 10, borderRadius: '3px', background: 'rgba(255,255,255,0.05)' }} />
        </div>

        {/* Table header */}
        <div style={{ padding: '8px 10px 4px', display: 'flex', gap: '4px' }}>
          {['Team', 'Sessions', 'Export'].map((h, i) => (
            <div key={i} style={{ flex: i === 0 ? 2 : 1, height: 16, borderRadius: '2px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', paddingLeft: '4px' }}>
              <div style={{ width: '50%', height: 6, borderRadius: '1px', background: 'rgba(255,255,255,0.15)' }} />
            </div>
          ))}
        </div>

        {/* Table body — all rows blank/loading */}
        <div style={{ padding: '4px 10px 10px', display: 'flex', flexDirection: 'column' as const, gap: '4px' }}>
          {[0, 1, 2].map(r => (
            <div key={r} style={{ display: 'flex', gap: '4px' }}>
              {[0, 1, 2].map(c => (
                <div key={c} style={{ flex: c === 0 ? 2 : 1, height: 20, borderRadius: '3px', background: 'rgba(255,255,255,0.04)', position: 'relative' as const, overflow: 'hidden' }}>
                  {panel.id === 'none' && (
                    /* Nothing — blank area */
                    <div />
                  )}
                  {panel.id === 'spinner' && (
                    /* Shimmer effect */
                    <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay: r * 0.15 }}
                      style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(202,138,4,0.12), transparent)' }} />
                  )}
                  {panel.id === 'full' && (
                    /* Same shimmer but green tint */
                    <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: r * 0.12 }}
                      style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(22,163,74,0.12), transparent)' }} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Status bar */}
        <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.04)', minHeight: '40px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', gap: '4px' }}>
          {panel.id === 'none' && (
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.08)', textAlign: 'center' as const, fontFamily: "'JetBrains Mono', monospace" }}>—</div>
          )}
          {panel.id === 'spinner' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(202,138,4,0.2)', borderTop: '2px solid #CA8A04' }} />
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>Loading...</div>
            </div>
          )}
          {panel.id === 'full' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
                <span>Generating report...</span>
                <span style={{ color: '#16A34A' }}>~3s</span>
              </div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div animate={{ width: ['20%', '70%', '85%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ height: '100%', background: '#16A34A', borderRadius: '2px' }} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reaction label */}
      <div style={{ marginTop: '8px', padding: '8px 10px', borderRadius: '6px', background: `${panel.color}08`, border: `1px solid ${panel.color}20` }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: panel.color, marginBottom: '2px' }}>{panel.mood}</div>
        <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{panel.moodDesc}</div>
        <div style={{ marginTop: '4px', fontSize: '9px', color: 'var(--ed-ink3)' }}>{panel.verdict}</div>
      </div>
    </div>
  );
}

export function LoadingStateDesignBoard() {
  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '16px', overflow: 'hidden', border: `1.5px solid ${ACCENT}30`, boxShadow: `0 8px 40px rgba(${ACCENT_RGB},0.12)`, background: 'var(--ed-card)' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0f0f1a 100%)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: `${ACCENT}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 14, height: 14, borderRadius: '3px', background: ACCENT }} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#F1F5F9', fontFamily: "'JetBrains Mono', monospace" }}>Loading State Design Board</div>
            <div style={{ fontSize: '10px', color: 'rgba(241,245,249,0.45)', fontFamily: "'JetBrains Mono', monospace" }}>The same report-load interaction — three different UX decisions</div>
          </div>
        </div>

        <div style={{ padding: '20px', display: 'flex', gap: '12px' }}>
          {PANEL_STATES.map(panel => (
            <DashboardPanel key={panel.id} panel={panel} />
          ))}
        </div>

        <div style={{ padding: '10px 20px', background: 'var(--ed-cream)', borderTop: '1px solid var(--ed-rule)', fontSize: '11px', color: 'var(--ed-ink3)' }}>
          Loading states are a product requirement. When the system is busy, the product must communicate — the design decision is what it says and how clearly.
        </div>
      </div>
    </TiltCard>
  );
}

// ─── 3. QUERY PATH WALKTHROUGH ────────────────────────────────────────────────

const QUERY_STEPS = [
  { id: 'request', label: 'Reporting request', desc: '"Show workspace usage by team admin over last 30 days"', color: '#3B82F6', icon: '📋' },
  { id: 'filter',  label: 'Filter',             desc: 'Narrow to date range: last 30 days',                   color: ACCENT,    icon: '⊃'  },
  { id: 'join',    label: 'Join',                desc: 'Connect workspaces → teams → admin users',             color: '#0097A7', icon: '⊕'  },
  { id: 'agg',     label: 'Aggregate',           desc: 'Sum sessions per team per workspace',                  color: '#CA8A04', icon: 'Σ'  },
  { id: 'response',label: 'Response',            desc: 'Structured dataset ready for the dashboard table',     color: '#16A34A', icon: '✅' },
];

export function QueryPathWalkthrough() {
  const [step, setStep] = useState(0);
  const [missingJoin, setMissingJoin] = useState(false);

  return (
    <ToolShell title="Query Path Walkthrough" subtitle="Not SQL training — just the PM-relevant model of why queries have cost">
      {/* Missing relationship toggle */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--ed-rule)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', flex: 1 }}>Simulate: teams &rarr; workspaces relationship</div>
        <button onClick={() => setMissingJoin(m => !m)}
          style={{ padding: '5px 14px', borderRadius: '20px', border: `1.5px solid ${missingJoin ? '#EF4444' : '#16A34A'}`, background: missingJoin ? 'rgba(239,68,68,0.1)' : 'rgba(22,163,74,0.1)', color: missingJoin ? '#EF4444' : '#16A34A', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>
          {missingJoin ? '⚠ Missing' : '✓ Exists'}
        </button>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {QUERY_STEPS.map((qs, i) => {
          const isBlocked = missingJoin && qs.id === 'join';
          const isDisabled = missingJoin && i > 2;
          const isActive  = step === i;
          const isDone    = step > i;
          const c = isBlocked ? '#EF4444' : qs.color;
          return (
            <motion.div key={qs.id} animate={{ opacity: isDisabled ? 0.3 : 1 }}
              style={{ display: 'flex', gap: '12px', padding: '10px 14px', borderRadius: '9px', background: isActive ? `${c}12` : isBlocked ? 'rgba(239,68,68,0.06)' : 'var(--ed-cream)', border: `1.5px solid ${isActive ? c : isDone ? c + '40' : 'var(--ed-rule)'}`, alignItems: 'flex-start', cursor: isDisabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}
              onClick={() => !isDisabled && setStep(i)}>
              <div style={{ width: 30, height: 30, borderRadius: '8px', background: `${c}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>{qs.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: isBlocked ? '#EF4444' : isActive ? c : 'var(--ed-ink2)', marginBottom: '2px' }}>
                  {isBlocked ? '⚠ Blocked — ' : ''}{qs.label}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{isBlocked ? 'Missing relationship. Cannot join teams to workspaces.' : qs.desc}</div>
              </div>
              {isActive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, marginTop: '3px', flexShrink: 0 }} />}
            </motion.div>
          );
        })}
        {!missingJoin && step < QUERY_STEPS.length - 1 && (
          <button onClick={() => setStep(s => s + 1)}
            style={{ padding: '8px 16px', borderRadius: '7px', background: ACCENT, color: '#fff', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' }}>
            Next step &rarr;
          </button>
        )}
        {step === QUERY_STEPS.length - 1 && !missingJoin && (
          <div style={{ padding: '8px 12px', borderRadius: '7px', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', fontSize: '11px', color: '#16A34A' }}>
            Query complete — &ldquo;simple report&rdquo; required 4 distinct data operations.
          </div>
        )}
      </div>
    </ToolShell>
  );
}

// ─── 4. ENDPOINT CONTRACT VIEWER ─────────────────────────────────────────────

const CONTRACT_TABS = ['Request', 'Response', 'Auth', 'Errors'] as const;
type ContractTab = typeof CONTRACT_TABS[number];

const CONTRACT_CONTENT: Record<ContractTab, { lines: { key: string; value: string; warn?: boolean }[] }> = {
  Request: {
    lines: [
      { key: 'endpoint', value: 'GET /api/v1/admin/workspaces/usage' },
      { key: 'param: team_id', value: 'string (required)' },
      { key: 'param: date_from', value: 'ISO 8601 date (required)' },
      { key: 'param: date_to', value: 'ISO 8601 date (required)' },
      { key: 'param: format', value: '"json" | "csv" (optional)', warn: true },
    ],
  },
  Response: {
    lines: [
      { key: 'status 200', value: '{ data: WorkspaceUsage[], meta: PaginationMeta }' },
      { key: 'data[].team_id', value: 'string' },
      { key: 'data[].workspace_id', value: 'string' },
      { key: 'data[].sessions', value: 'number' },
      { key: 'data[].team_name', value: 'NOT INCLUDED', warn: true },
    ],
  },
  Auth: {
    lines: [
      { key: 'header', value: 'Authorization: Bearer <token>' },
      { key: 'required role', value: 'admin | manager' },
      { key: 'scope', value: 'workspace:read', warn: true },
      { key: 'manager visibility', value: 'own teams only (auto-filtered)' },
    ],
  },
  Errors: {
    lines: [
      { key: '400 Bad Request', value: 'Missing required param or invalid date range' },
      { key: '401 Unauthorized', value: 'Invalid or expired token' },
      { key: '403 Forbidden', value: 'Insufficient role for this workspace' },
      { key: '429 Rate Limited', value: 'Max 10 export requests/minute', warn: true },
      { key: '504 Gateway Timeout', value: 'Large date ranges may time out' },
    ],
  },
};

export function EndpointContractViewer() {
  const [tab, setTab] = useState<ContractTab>('Request');
  const content = CONTRACT_CONTENT[tab];

  return (
    <ToolShell title="Endpoint Contract Viewer" subtitle="If the contract is unclear, the feature is not actually clear">
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--ed-rule)' }}>
        {CONTRACT_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: '10px 8px', border: 'none', background: tab === t ? `${ACCENT}10` : 'transparent', borderBottom: `2px solid ${tab === t ? ACCENT : 'transparent'}`, color: tab === t ? ACCENT : 'var(--ed-ink3)', fontSize: '11px', fontWeight: tab === t ? 700 : 400, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", transition: 'all 0.15s' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '14px 20px', background: '#0f172a', minHeight: '180px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
            {content.lines.map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '6px 0', borderBottom: i < content.lines.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#64748b', flexShrink: 0, minWidth: '140px' }}>{line.key}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: line.warn ? '#fbbf24' : '#86efac', flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {line.warn && <span style={{ color: '#fbbf24' }}>&#9888;</span>}
                  {line.value}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ padding: '8px 20px', background: 'var(--ed-cream)', borderTop: '1px solid var(--ed-rule)', fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>
        &#9888; items flagged in the contract are areas of potential ambiguity.
      </div>
    </ToolShell>
  );
}

// ─── 5. ACCESS DECISION SIMULATOR ────────────────────────────────────────────

const ROLES_OPT  = ['Admin', 'Manager', 'Contributor', 'Viewer'] as const;
const ACTIONS_OPT = ['View', 'Edit', 'Export', 'Delete'] as const;
const RESOURCES_OPT = ['Own workspace', 'Team workspaces', 'All workspaces', 'Archived data'] as const;

type RoleOpt     = typeof ROLES_OPT[number];
type ActionOpt   = typeof ACTIONS_OPT[number];
type ResourceOpt = typeof RESOURCES_OPT[number];

type Decision = 'Allow' | 'Deny' | 'Escalate';

function getDecision(role: RoleOpt, action: ActionOpt, resource: ResourceOpt): { decision: Decision; reason: string } {
  if (role === 'Admin') return { decision: 'Allow', reason: 'Admins have full access across all resources and actions.' };
  if (role === 'Manager') {
    if (resource === 'All workspaces' && action !== 'View') return { decision: 'Deny', reason: 'Managers can only view cross-team data. Edit/Export/Delete requires Admin.' };
    if (resource === 'Archived data') return { decision: 'Escalate', reason: 'Accessing archived data requires Admin approval even for Managers.' };
    if (action === 'Delete') return { decision: 'Deny', reason: 'Delete is restricted to Admins across all resource types.' };
    return { decision: 'Allow', reason: 'Managers can perform this action within their team scope.' };
  }
  if (role === 'Contributor') {
    if (resource === 'Own workspace' && (action === 'View' || action === 'Edit')) return { decision: 'Allow', reason: 'Contributors can view and edit their own workspace data.' };
    return { decision: 'Deny', reason: 'Contributors are limited to their own workspace and cannot export or delete.' };
  }
  // Viewer
  if (action === 'View' && resource === 'Own workspace') return { decision: 'Allow', reason: 'Viewers can see their own workspace data.' };
  return { decision: 'Deny', reason: 'Viewers have read-only access to their own workspace only.' };
}

const DECISION_COLORS: Record<Decision, string> = { Allow: '#16A34A', Deny: '#EF4444', Escalate: '#CA8A04' };

export function AccessDecisionSimulator() {
  const [role,     setRole]     = useState<RoleOpt>('Manager');
  const [action,   setAction]   = useState<ActionOpt>('Export');
  const [resource, setResource] = useState<ResourceOpt>('All workspaces');

  const result = getDecision(role, action, resource);

  return (
    <ToolShell title="Access Decision Simulator" subtitle="One rule in English becomes many cells in a permission matrix">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0', borderBottom: '1px solid var(--ed-rule)' }}>
        {/* Role */}
        <div style={{ padding: '12px 16px', borderRight: '1px solid var(--ed-rule)' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>ROLE</div>
          {ROLES_OPT.map(r => (
            <div key={r} onClick={() => setRole(r)}
              style={{ padding: '6px 10px', borderRadius: '6px', marginBottom: '4px', background: role === r ? `${ACCENT}15` : 'transparent', border: `1px solid ${role === r ? ACCENT : 'transparent'}`, cursor: 'pointer', fontSize: '11px', color: role === r ? ACCENT : 'var(--ed-ink3)', fontWeight: role === r ? 700 : 400, transition: 'all 0.12s' }}>
              {r}
            </div>
          ))}
        </div>
        {/* Action */}
        <div style={{ padding: '12px 16px', borderRight: '1px solid var(--ed-rule)' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>ACTION</div>
          {ACTIONS_OPT.map(a => (
            <div key={a} onClick={() => setAction(a)}
              style={{ padding: '6px 10px', borderRadius: '6px', marginBottom: '4px', background: action === a ? `${ACCENT}15` : 'transparent', border: `1px solid ${action === a ? ACCENT : 'transparent'}`, cursor: 'pointer', fontSize: '11px', color: action === a ? ACCENT : 'var(--ed-ink3)', fontWeight: action === a ? 700 : 400, transition: 'all 0.12s' }}>
              {a}
            </div>
          ))}
        </div>
        {/* Resource */}
        <div style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>RESOURCE</div>
          {RESOURCES_OPT.map(r => (
            <div key={r} onClick={() => setResource(r)}
              style={{ padding: '6px 10px', borderRadius: '6px', marginBottom: '4px', background: resource === r ? `${ACCENT}15` : 'transparent', border: `1px solid ${resource === r ? ACCENT : 'transparent'}`, cursor: 'pointer', fontSize: '10px', color: resource === r ? ACCENT : 'var(--ed-ink3)', fontWeight: resource === r ? 700 : 400, transition: 'all 0.12s', lineHeight: 1.3 }}>
              {r}
            </div>
          ))}
        </div>
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        <motion.div key={`${role}-${action}-${resource}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          style={{ margin: '16px 20px', padding: '14px 18px', borderRadius: '10px', background: `${DECISION_COLORS[result.decision]}10`, border: `2px solid ${DECISION_COLORS[result.decision]}40` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: DECISION_COLORS[result.decision], fontFamily: "'JetBrains Mono', monospace" }}>{result.decision}</div>
            <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{role} trying to {action.toLowerCase()} &rarr; {resource}</div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{result.reason}</div>
        </motion.div>
      </AnimatePresence>
    </ToolShell>
  );
}

// ─── 6. SYNC VS ASYNC EXPERIENCE BOARD ───────────────────────────────────────

const EXPERIENCE_MODES = [
  {
    id: 'sync', label: 'Inline wait', color: '#CA8A04',
    steps: ['User clicks Export', 'UI freezes — spinner shows', 'Browser blocks for 40 seconds', 'Report downloads OR timeout error'],
    verdict: 'Acceptable at small scale. Breaks under load.',
    safe: 'small datasets, < 5 seconds',
  },
  {
    id: 'bg', label: 'Background job', color: ACCENT,
    steps: ['User clicks Export', 'Job queued — user gets confirmation', 'User continues working', 'Notification: report ready to download'],
    verdict: 'Best for large exports or long operations.',
    safe: 'large datasets, uncertain duration',
  },
  {
    id: 'notify', label: 'Email / async notify', color: '#16A34A',
    steps: ['User requests export', 'System queues job, confirms by email', 'User leaves page freely', 'Email arrives with download link'],
    verdict: 'Best for non-urgent, high-latency operations.',
    safe: 'overnight reports, low-urgency workflows',
  },
];

export function SyncAsyncExperienceBoard() {
  const [mode, setMode] = useState(0);
  const em = EXPERIENCE_MODES[mode];

  return (
    <ToolShell title="Sync vs Async Experience Board" subtitle="At scale, system behavior changes the product experience shape">
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--ed-rule)', display: 'flex', gap: '8px' }}>
        {EXPERIENCE_MODES.map((m, i) => (
          <button key={m.id} onClick={() => setMode(i)}
            style={{ flex: 1, padding: '8px 10px', borderRadius: '7px', border: `1.5px solid ${mode === i ? m.color : 'var(--ed-rule)'}`, background: mode === i ? `${m.color}12` : 'var(--ed-bg)', color: mode === i ? m.color : 'var(--ed-ink3)', fontSize: '10px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 20px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {em.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${em.color}20`, border: `1.5px solid ${em.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: em.color, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', paddingTop: '2px' }}>{step}</div>
              </div>
            ))}
            <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ padding: '10px 12px', borderRadius: '7px', background: `${em.color}08`, border: `1px solid ${em.color}25` }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: em.color, marginBottom: '3px' }}>When to use</div>
                <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{em.safe}</div>
              </div>
              <div style={{ padding: '10px 12px', borderRadius: '7px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', marginBottom: '3px' }}>PM takeaway</div>
                <div style={{ fontSize: '11px', color: 'var(--ed-ink2)', fontStyle: 'italic' }}>{em.verdict}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </ToolShell>
  );
}

// ─── 7. SCOPE-TO-ESTIMATE DECOMPOSER ─────────────────────────────────────────

type RiskLevel = 'known' | 'uncertain' | 'dependency' | 'edge case';

const DECOMPOSED_TASKS: { label: string; effort: string; risk: RiskLevel; team: string }[] = [
  { label: 'Admin table + filters (frontend)',         effort: '2–3d', risk: 'known',      team: 'Frontend' },
  { label: 'Usage query endpoint (backend)',           effort: '2d',   risk: 'known',      team: 'Backend'  },
  { label: 'Role-based data filtering',               effort: '1–3d', risk: 'uncertain',  team: 'Backend'  },
  { label: 'CSV export job + queue',                  effort: '2–4d', risk: 'uncertain',  team: 'Backend'  },
  { label: 'Analytics instrumentation',               effort: '1d',   risk: 'dependency', team: 'Data'     },
  { label: 'Team–workspace schema migration',         effort: '?',    risk: 'edge case',  team: 'Data'     },
  { label: 'QA — permission edge cases',              effort: '2d',   risk: 'uncertain',  team: 'QA'       },
  { label: 'Rollout flag + monitoring',               effort: '1d',   risk: 'known',      team: 'DevOps'   },
];

const RISK_COLORS_TOOL: Record<RiskLevel, string> = { known: '#16A34A', uncertain: '#CA8A04', dependency: '#3B82F6', 'edge case': '#EF4444' };

export function ScopeToEstimateDecomposer() {
  const [revealed, setRevealed] = useState(false);
  const [filter, setFilter] = useState<RiskLevel | 'all'>('all');

  const filtered = DECOMPOSED_TASKS.filter(t => filter === 'all' || t.risk === filter);
  const total = DECOMPOSED_TASKS.length;
  const knownCount = DECOMPOSED_TASKS.filter(t => t.risk === 'known').length;
  const unknownRisk = DECOMPOSED_TASKS.filter(t => t.risk !== 'known').length;

  return (
    <ToolShell title="Scope-to-Estimate Decomposer" subtitle="Better decomposition reveals uncertainty — it does not create it">
      {/* Feature card */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--ed-rule)' }}>
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: `${ACCENT}12`, border: `1.5px solid ${ACCENT}50`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: ACCENT, marginBottom: '2px' }}>Feature: Enterprise Admin Workspace</div>
            <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>Dashboard + filters + export + role-based views</div>
          </div>
          {!revealed && (
            <button onClick={() => setRevealed(true)}
              style={{ padding: '7px 16px', borderRadius: '7px', background: ACCENT, color: '#fff', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
              Decompose &rarr;
            </button>
          )}
          {revealed && (
            <div style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: ACCENT, fontWeight: 700 }}>{total} tasks</div>
          )}
        </div>
      </div>

      {revealed && (
        <div style={{ padding: '12px 20px' }}>
          {/* Risk filter */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' as const }}>
            {(['all', 'known', 'uncertain', 'dependency', 'edge case'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '3px 10px', borderRadius: '12px', border: `1px solid ${filter === f ? (f === 'all' ? ACCENT : RISK_COLORS_TOOL[f as RiskLevel]) : 'var(--ed-rule)'}`, background: filter === f ? `${f === 'all' ? ACCENT : RISK_COLORS_TOOL[f as RiskLevel]}15` : 'var(--ed-bg)', color: filter === f ? (f === 'all' ? ACCENT : RISK_COLORS_TOOL[f as RiskLevel]) : 'var(--ed-ink3)', fontSize: '9px', fontWeight: 700, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" }}>
                {f}
              </button>
            ))}
          </div>

          {/* Tasks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
            {filtered.map((task, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                style={{ display: 'flex', gap: '10px', padding: '8px 12px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', alignItems: 'center' }}>
                <div style={{ flex: 1, fontSize: '11px', color: 'var(--ed-ink2)' }}>{task.label}</div>
                <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{task.effort}</div>
                <div style={{ padding: '2px 7px', borderRadius: '10px', fontSize: '8px', fontWeight: 700, background: `${RISK_COLORS_TOOL[task.risk]}15`, color: RISK_COLORS_TOOL[task.risk], fontFamily: "'JetBrains Mono', monospace" }}>{task.risk}</div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ padding: '8px 12px', borderRadius: '7px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>{knownCount}</div>
              <div style={{ fontSize: '9px', color: '#16A34A' }}>tasks with clear scope</div>
            </div>
            <div style={{ padding: '8px 12px', borderRadius: '7px', background: 'rgba(202,138,4,0.08)', border: '1px solid rgba(202,138,4,0.2)' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#CA8A04', fontFamily: "'JetBrains Mono', monospace" }}>{unknownRisk}</div>
              <div style={{ fontSize: '9px', color: '#CA8A04' }}>tasks with uncertainty or risk</div>
            </div>
          </div>
          <div style={{ marginTop: '8px', padding: '8px 12px', borderRadius: '7px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>
            What makes an estimate trustworthy: sharper scope boundaries and earlier visibility into {unknownRisk} uncertain task{unknownRisk !== 1 ? 's' : ''}.
          </div>
        </div>
      )}
    </ToolShell>
  );
}

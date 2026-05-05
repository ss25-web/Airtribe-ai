'use client';

/**
 * Tech101Animations — Module 09 interactive 3D teaching visuals.
 * All visuals are user-triggered (click/hover), none auto-play.
 * 3D depth via CSS perspective + preserve-3d + spring physics.
 *
 * 1. LayeredStackVisual       — click a layer to trace a request in 3D space
 * 2. LatencyPressureVisual    — click speed modes to change the live dashboard
 * 3. SchemaRelationshipBoard  — click entities + connections to explore the schema
 * 4. RequestResponseFlow      — click Send / Inject Error to run the pipeline
 * 5. PermissionMatrixBloom    — hover rows / columns to inspect permissions
 * 6. ScaleStressAnimation     — click load levels to stress the system
 * 7. EstimateBreakdownCascade — click the feature card to explode it
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#7843EE';

const spring = { type: 'spring' as const, stiffness: 280, damping: 24 };
const springBounce = { type: 'spring' as const, stiffness: 340, damping: 18 };

const surf = '0 8px 24px rgba(28,24,20,0.08)';
const raised = (c: string) =>
  `0 20px 32px ${c}22, 0 6px 0 ${c}1c, inset 0 1px 0 rgba(255,255,255,0.52)`;

const AnimationShell = ({ caption, children }: { caption: string; children: React.ReactNode }) => (
  <div style={{ margin: '32px 0' }}>
    {children}
    <div style={{ padding: '8px 4px 0', fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic', lineHeight: 1.6 }}>
      {caption}
    </div>
  </div>
);

const ClickHint = ({ text }: { text: string }) => (
  <div style={{ textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ed-ink3)', paddingTop: '8px' }}>
    ↑ {text}
  </div>
);

// ─── 1. LAYERED STACK VISUAL ─────────────────────────────────────────────────

const STACK_LAYERS = [
  { id: 'ui',      label: 'UI Layer',       desc: 'Renders components, routes events',   color: '#3B82F6', icon: '⬜' },
  { id: 'api',     label: 'API Contract',   desc: 'Request / response shape defined',     color: ACCENT,    icon: '⇄'  },
  { id: 'backend', label: 'Business Logic', desc: 'Validation, rules, processing',        color: '#0097A7', icon: '⚙' },
  { id: 'db',      label: 'Data Layer',     desc: 'Tables, queries, schema',              color: '#E67E22', icon: '⬛' },
];

export function LayeredStackVisual() {
  const [active, setActive] = useState<number | null>(null);
  const [packetLayer, setPacketLayer] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function triggerFlow(startIdx: number) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setActive(startIdx);
    // Animate packet: startIdx → bottom → back up → clear
    const seq = startIdx === 0
      ? [0, 1, 2, 3]
      : [startIdx, ...Array.from({ length: STACK_LAYERS.length - startIdx }, (_, i) => startIdx + i + 1).filter(x => x < STACK_LAYERS.length)];
    seq.forEach((layerIdx, i) => {
      const t = setTimeout(() => {
        setPacketLayer(layerIdx);
        if (i === seq.length - 1) {
          const ct = setTimeout(() => setPacketLayer(null), 320);
          timers.current.push(ct);
        }
      }, i * 260);
      timers.current.push(t);
    });
  }

  return (
    <AnimationShell caption="One user action travels through every layer. A PM request that feels like one thing is multiple system responsibilities at once.">
      <div style={{
        padding: '32px 24px 24px', borderRadius: '28px',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.82) 0%, rgba(120,67,238,0.06) 100%)',
        boxShadow: surf,
        perspective: '1000px', perspectiveOrigin: '50% 30%',
      }}>
        <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-9deg) rotateY(3deg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {STACK_LAYERS.map((layer, i) => {
              const isActive = active === i;
              const hasPacket = packetLayer === i;
              return (
                <motion.div
                  key={layer.id}
                  onClick={() => triggerFlow(i)}
                  animate={{
                    z: isActive ? 32 : 0,
                    scale: isActive ? 1.025 : 1,
                    boxShadow: isActive ? raised(layer.color) : surf,
                  }}
                  whileHover={{ z: 16, scale: 1.01 }}
                  transition={spring}
                  style={{
                    padding: '14px 18px', borderRadius: '18px', cursor: 'pointer',
                    background: `linear-gradient(135deg,
                      color-mix(in srgb, white 92%, ${layer.color} 8%) 0%,
                      color-mix(in srgb, white 84%, ${layer.color} 16%) 100%)`,
                    border: `2px solid ${isActive ? layer.color : `${layer.color}2a`}`,
                    display: 'flex', alignItems: 'center', gap: '14px',
                    userSelect: 'none' as const,
                    position: 'relative' as const, overflow: 'hidden',
                  }}
                >
                  {/* Layer number */}
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 800, color: `${layer.color}55`, width: '20px', flexShrink: 0 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  {/* Icon */}
                  <div style={{
                    width: 42, height: 42, borderRadius: '14px', flexShrink: 0,
                    background: `linear-gradient(145deg, ${layer.color}cc, ${layer.color})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                    boxShadow: isActive
                      ? `0 8px 18px ${layer.color}45, 5px 5px 0 ${layer.color}28`
                      : `0 4px 10px ${layer.color}25, 3px 3px 0 ${layer.color}18`,
                  }}>
                    {layer.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: isActive ? layer.color : 'var(--ed-ink)' }}>{layer.label}</div>
                    <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '2px' }}>{layer.desc}</div>
                  </div>
                  {/* Packet indicator */}
                  <AnimatePresence>
                    {hasPacket && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                          background: layer.color,
                          boxShadow: `0 0 14px ${layer.color}, 0 0 28px ${layer.color}60`,
                        }}
                      />
                    )}
                  </AnimatePresence>
                  {/* Right-face depth illusion */}
                  <div style={{
                    position: 'absolute', right: -5, top: 6, bottom: 6, width: 8,
                    background: `${layer.color}14`, borderRadius: '0 4px 4px 0',
                    transform: 'skewY(-2deg)',
                  }} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <ClickHint text="Click any layer to trace a request packet through the stack" />
    </AnimationShell>
  );
}

// ─── 2. LATENCY PRESSURE VISUAL ─────────────────────────────────────────────

const LATENCY_STATES = [
  { id: 'fast',    badge: 'Instant',  label: '< 200ms', color: '#16A34A', mood: 'Confident',  barW: 7,   desc: 'Table loads immediately. Filters respond. User trusts the product.' },
  { id: 'slow',    badge: 'Loading',  label: '1–3s',    color: '#CA8A04', mood: 'Uncertain',  barW: 46,  desc: 'Spinner with context. User waits but understands why — UX is transparent.' },
  { id: 'timeout', badge: 'Timeout',  label: '> 5s',    color: '#EF4444', mood: 'Abandoned',  barW: 100, desc: 'Nothing happens. User cannot tell if the product is broken or just slow.' },
];

export function LatencyPressureVisual() {
  const [idx, setIdx] = useState(0);
  const s = LATENCY_STATES[idx];

  return (
    <AnimationShell caption="The same dashboard in three response-speed conditions. When system timing changes user trust, timing becomes part of the product design — not just an engineering concern.">
      {/* Speed selector */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', justifyContent: 'center' }}>
        {LATENCY_STATES.map((ls, i) => (
          <motion.button
            key={ls.id}
            onClick={() => setIdx(i)}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: idx === i ? raised(ls.color) : surf }}
            transition={spring}
            style={{
              flex: 1, padding: '12px 10px', borderRadius: '16px', cursor: 'pointer',
              background: idx === i
                ? `linear-gradient(145deg, color-mix(in srgb, white 24%, ${ls.color} 76%), ${ls.color})`
                : 'white',
              border: `2px solid ${idx === i ? ls.color : `${ls.color}30`}`,
              color: idx === i ? '#fff' : ls.color,
              fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 800,
              letterSpacing: '0.06em',
            }}
          >
            <div style={{ fontSize: '16px', marginBottom: '4px' }}>
              {i === 0 ? '⚡' : i === 1 ? '⏳' : '💀'}
            </div>
            {ls.badge}
            <div style={{ fontSize: '8px', opacity: 0.8, marginTop: '2px' }}>{ls.label}</div>
          </motion.button>
        ))}
      </div>

      {/* Browser mockup — 3D tilted */}
      <div style={{
        borderRadius: '16px', overflow: 'hidden',
        background: '#0f172a',
        transform: 'perspective(1200px) rotateX(2.5deg)',
        boxShadow: `0 24px 48px rgba(0,0,0,0.28), 0 8px 0 rgba(0,0,0,0.18)`,
        border: `1.5px solid ${s.color}35`,
        transition: 'border-color 0.3s',
      }}>
        {/* Traffic-light bar */}
        <div style={{ padding: '8px 14px', background: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['#EF4444', '#F59E0B', '#10B981'].map((c, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
          ))}
          <div style={{ flex: 1, marginLeft: '8px', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: s.color, fontWeight: 700, transition: 'color 0.3s' }}>
            {s.badge}
          </div>
        </div>

        <div style={{ padding: '18px' }}>
          {/* Column headers */}
          <div style={{ display: 'flex', gap: '7px', marginBottom: '9px' }}>
            {['Team', 'Sessions', 'Completion', 'Export'].map((h, i) => (
              <div key={i} style={{ flex: i === 0 ? 2 : 1, padding: '5px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '9px', color: '#64748b', fontFamily: "'JetBrains Mono',monospace" }}>{h}</div>
            ))}
          </div>

          {/* Table rows */}
          {[0, 1, 2].map(r => (
            <div key={r} style={{ display: 'flex', gap: '7px', marginBottom: '5px' }}>
              {[0, 1, 2, 3].map(c => (
                <div key={c} style={{ flex: c === 0 ? 2 : 1, height: '26px', borderRadius: '4px', overflow: 'hidden', position: 'relative' as const }}>
                  <AnimatePresence mode="wait">
                    {idx === 0 ? (
                      <motion.div key="loaded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                        <div style={{ width: `${50 + r * 14 + c * 9}%`, height: '7px', borderRadius: '2px', background: 'rgba(255,255,255,0.15)' }} />
                      </motion.div>
                    ) : (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.03)', position: 'relative' as const, overflow: 'hidden' }}>
                        {idx === 1 && (
                          <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                            style={{ position: 'absolute' as const, inset: 0, width: '60%', background: 'linear-gradient(90deg, transparent, rgba(120,67,238,0.18), transparent)' }} />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ))}

          {/* Status strip */}
          <AnimatePresence mode="wait">
            <motion.div key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
              style={{ marginTop: '13px', padding: '10px 12px', borderRadius: '8px', background: `${s.color}15`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <motion.div
                animate={idx === 2 ? { opacity: [1, 0.25, 1] } : { opacity: 1 }}
                transition={{ duration: 0.7, repeat: idx === 2 ? Infinity : 0 }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: s.color }}>{s.label}</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{s.desc}</div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono',monospace" }}>{s.mood}</div>
            </motion.div>
          </AnimatePresence>

          <div style={{ marginTop: '7px', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${s.barW}%` }} transition={{ duration: 0.45 }}
              style={{ height: '100%', background: s.color, borderRadius: '2px' }} />
          </div>
        </div>
      </div>
      <ClickHint text="Click a speed mode to change the system response" />
    </AnimationShell>
  );
}

// ─── 3. SCHEMA RELATIONSHIP BOARD ────────────────────────────────────────────

type EntId = 'users' | 'teams' | 'workspaces' | 'events';
type RelId = 'u-t' | 'u-w' | 'w-e' | 't-w';

const ENT: Record<EntId, { label: string; color: string; fields: string[]; cx: number; cy: number }> = {
  users:      { label: 'Users',      color: '#3B82F6', fields: ['id', 'name', 'email', 'team_id'],       cx: 115, cy: 80  },
  teams:      { label: 'Teams',      color: ACCENT,    fields: ['id', 'name', 'plan'],                   cx: 445, cy: 80  },
  workspaces: { label: 'Workspaces', color: '#0097A7', fields: ['id', 'name', 'owner_id'],               cx: 115, cy: 230 },
  events:     { label: 'Events',     color: '#CA8A04', fields: ['id', 'type', 'workspace_id', 'ts'],     cx: 445, cy: 230 },
};

const RELS: Record<RelId, { from: EntId; to: EntId; label: string; missing: boolean }> = {
  'u-t': { from: 'users',      to: 'teams',      label: 'belongs to',     missing: false },
  'u-w': { from: 'users',      to: 'workspaces', label: 'uses',           missing: false },
  'w-e': { from: 'workspaces', to: 'events',     label: 'generates',      missing: false },
  't-w': { from: 'teams',      to: 'workspaces', label: 'not defined ⚠',  missing: true  },
};

export function SchemaRelationshipBoard() {
  const [activeEnt, setActiveEnt] = useState<EntId | null>(null);
  const [activeRel, setActiveRel] = useState<RelId | null>(null);

  return (
    <AnimationShell caption="Data shape determines product capability. The missing teams → workspaces link blocks the 'usage by admin' report — discovered only after the feature ships.">
      <div style={{
        borderRadius: '24px', border: '1px solid var(--ed-rule)',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(120,67,238,0.04) 100%)',
        padding: '20px', boxShadow: surf, overflow: 'hidden',
      }}>
        <svg viewBox="0 0 560 330" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
          <defs>
            {['#3B82F6', ACCENT, '#0097A7', '#CA8A04', '#EF4444'].map((c, i) => (
              <marker key={i} id={`arr${i}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={c} opacity="0.75" />
              </marker>
            ))}
          </defs>

          {/* Relationship lines */}
          {(Object.entries(RELS) as [RelId, typeof RELS[RelId]][]).map(([id, rel]) => {
            const f = ENT[rel.from], t = ENT[rel.to];
            const isActive = activeRel === id;
            const color = rel.missing ? '#EF4444' : f.color;
            const markerIdx = ['#3B82F6', ACCENT, '#0097A7', '#CA8A04', '#EF4444'].indexOf(color);
            const mx = (f.cx + t.cx) / 2, my = (f.cy + t.cy) / 2;
            return (
              <g key={id} style={{ cursor: 'pointer' }} onClick={() => setActiveRel(r => r === id ? null : id)}>
                <line x1={f.cx} y1={f.cy} x2={t.cx} y2={t.cy}
                  stroke={color} strokeWidth={isActive ? 3 : rel.missing ? 2 : 1.5}
                  strokeDasharray={rel.missing ? '5 4' : undefined}
                  opacity={isActive ? 1 : 0.45}
                  markerEnd={`url(#arr${Math.max(0, markerIdx)})`}
                  style={{ transition: 'opacity 0.2s, stroke-width 0.2s' }}
                />
                {/* Label bubble */}
                <rect x={mx - 40} y={my - 11} width={80} height={20} rx={6}
                  fill={isActive ? color : 'rgba(255,255,255,0.95)'}
                  stroke={color} strokeWidth={isActive ? 0 : 1}
                  style={{ filter: isActive ? `drop-shadow(0 3px 8px ${color}50)` : 'none', transition: 'all 0.2s' }}
                />
                <text x={mx} y={my + 4} textAnchor="middle" fontSize="9"
                  fontFamily="'JetBrains Mono',monospace" fontWeight="700"
                  fill={isActive ? '#fff' : color}>
                  {rel.label}
                </text>
              </g>
            );
          })}

          {/* Entity boxes */}
          {(Object.entries(ENT) as [EntId, typeof ENT[EntId]][]).map(([id, e]) => {
            const isActive = activeEnt === id;
            const W = 110, H = 50;
            const extraH = isActive ? e.fields.length * 16 : 0;
            return (
              <g key={id} style={{ cursor: 'pointer' }} onClick={() => setActiveEnt(eid => eid === id ? null : id)}>
                <rect x={e.cx - W / 2} y={e.cy - H / 2} width={W} height={H + extraH} rx={14}
                  fill={`${e.color}${isActive ? '1a' : '0d'}`}
                  stroke={e.color} strokeWidth={isActive ? 2.5 : 1.5}
                  style={{
                    filter: isActive ? `drop-shadow(0 5px 14px ${e.color}45)` : 'none',
                    transition: 'all 0.25s',
                  }}
                />
                <text x={e.cx} y={e.cy + 6} textAnchor="middle"
                  fontSize="13" fontWeight="800" fontFamily="sans-serif" fill={e.color}>
                  {e.label}
                </text>
                {isActive && e.fields.map((field, fi) => (
                  <text key={field} x={e.cx - W / 2 + 12} y={e.cy + H / 2 + 10 + fi * 16}
                    fontSize="9" fontFamily="'JetBrains Mono',monospace" fill={e.color} opacity="0.75">
                    · {field}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Missing link warning */}
          {activeRel === 't-w' && (
            <g>
              <rect x={40} y={290} width={480} height={28} rx={7}
                fill="rgba(239,68,68,0.1)" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="4 3" />
              <text x={280} y={308} textAnchor="middle" fontSize="10"
                fontFamily="'JetBrains Mono',monospace" fill="#EF4444" fontWeight="700">
                &quot;Usage by team admin&quot; blocked — teams → workspaces link missing
              </text>
            </g>
          )}
        </svg>
      </div>
      <ClickHint text="Click entities to see fields · Click connections to reveal relationships" />
    </AnimationShell>
  );
}

// ─── 4. REQUEST / RESPONSE FLOW ──────────────────────────────────────────────

const API_STAGES = [
  { label: 'UI Request',    color: '#3B82F6', icon: '📱', desc: 'Client sends HTTP request with auth token'    },
  { label: 'API Gateway',   color: ACCENT,    icon: '⇄',  desc: 'Endpoint receives and routes to handler'     },
  { label: 'Validation',    color: '#0097A7', icon: '✓',  desc: 'Schema checked, types verified'              },
  { label: 'Auth Gate',     color: '#CA8A04', icon: '🔑', desc: 'Permissions verified against user role'      },
  { label: 'Response',      color: '#16A34A', icon: '✅', desc: 'Shaped payload returned to client'           },
];
const ERR_STAGE = { label: 'Contract Violation', color: '#EF4444', icon: '⚠', desc: 'Shape mismatch — client gets 400 or 422' };

export function RequestResponseFlow() {
  const [step, setStep] = useState(-1);
  const [isError, setIsError] = useState(false);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function runFlow(withError: boolean) {
    if (running) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(true);
    setIsError(withError);
    setStep(0);
    const stages = withError ? [...API_STAGES.slice(0, 2), ERR_STAGE] : API_STAGES;
    stages.forEach((_, i) => {
      const t = setTimeout(() => {
        setStep(i);
        if (i === stages.length - 1) {
          const ct = setTimeout(() => { setStep(-1); setRunning(false); }, 900);
          timers.current.push(ct);
        }
      }, i * 500);
      timers.current.push(t);
    });
  }

  const displayStages = isError ? [...API_STAGES.slice(0, 2), ERR_STAGE] : API_STAGES;

  return (
    <AnimationShell caption="There is a contract here, not magic. Every API interaction has defined expectations. Vague contracts create downstream confusion — the PM who specifies them clearly removes a whole class of bugs.">
      <div style={{
        borderRadius: '24px', padding: '24px',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.82) 0%, rgba(120,67,238,0.05) 100%)',
        boxShadow: surf,
      }}>
        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
          <motion.button
            onClick={() => runFlow(false)}
            whileHover={!running ? { scale: 1.05, y: -3 } : {}}
            whileTap={!running ? { scale: 0.97 } : {}}
            style={{
              padding: '11px 22px', borderRadius: '14px', cursor: running ? 'not-allowed' : 'pointer',
              background: running ? 'rgba(22,163,74,0.08)' : 'linear-gradient(145deg, #4ade80, #16A34A)',
              border: `2px solid ${running ? '#16A34A30' : '#16A34A'}`,
              color: running ? '#16A34A' : '#fff',
              fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 800,
              boxShadow: running ? 'none' : raised('#16A34A'),
            }}
          >
            ▶ Send Request
          </motion.button>
          <motion.button
            onClick={() => runFlow(true)}
            whileHover={!running ? { scale: 1.05, y: -3 } : {}}
            whileTap={!running ? { scale: 0.97 } : {}}
            style={{
              padding: '11px 22px', borderRadius: '14px', cursor: running ? 'not-allowed' : 'pointer',
              background: running ? 'rgba(239,68,68,0.08)' : 'linear-gradient(145deg, #f87171, #EF4444)',
              border: `2px solid ${running ? '#EF444430' : '#EF4444'}`,
              color: running ? '#EF4444' : '#fff',
              fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 800,
              boxShadow: running ? 'none' : raised('#EF4444'),
            }}
          >
            ⚡ Inject Error
          </motion.button>
        </div>

        {/* Pipeline stages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
          {displayStages.map((s, i) => {
            const isCur = step === i;
            const isPast = step > i;
            const c = (isError && i === displayStages.length - 1) ? ERR_STAGE.color : s.color;
            return (
              <motion.div
                key={`${i}-${isError}`}
                initial={{ opacity: 0, x: -18 }}
                animate={{
                  opacity: step === -1 ? 1 : isPast ? 0.38 : isCur ? 1 : 0.22,
                  x: isCur ? 8 : 0,
                  boxShadow: isCur ? raised(c) : surf,
                }}
                transition={isCur ? spring : { duration: 0.22 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '16px',
                  background: isCur
                    ? `linear-gradient(135deg, color-mix(in srgb, white 88%, ${c} 12%) 0%, color-mix(in srgb, white 80%, ${c} 20%) 100%)`
                    : 'white',
                  border: `2px solid ${isCur ? c : `${c}20`}`,
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: '12px', flexShrink: 0,
                  background: `linear-gradient(145deg, ${c}cc, ${c})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                  boxShadow: isCur ? `0 6px 16px ${c}45, 4px 4px 0 ${c}30` : `0 3px 8px ${c}20`,
                }}>
                  {s.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: isCur ? c : 'var(--ed-ink2)' }}>{s.label}</div>
                  <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '2px' }}>{s.desc}</div>
                </div>
                {isCur && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.55, repeat: Infinity }}
                    style={{ width: 10, height: 10, borderRadius: '50%', background: c, flexShrink: 0, boxShadow: `0 0 10px ${c}` }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      <ClickHint text="Click Send or Inject Error to run the API pipeline" />
    </AnimationShell>
  );
}

// ─── 5. PERMISSION MATRIX BLOOM ──────────────────────────────────────────────

const ROLES   = ['Admin', 'Manager', 'Contributor', 'Viewer'];
const ACTIONS = ['View', 'Edit', 'Export', 'Delete'];
const PERM: boolean[][] = [
  [true,  true,  true,  true ],
  [true,  true,  true,  false],
  [true,  true,  false, false],
  [true,  false, false, false],
];

export function PermissionMatrixBloom() {
  const [hRow, setHRow] = useState<number | null>(null);
  const [hCol, setHCol] = useState<number | null>(null);

  return (
    <AnimationShell caption="One simple rule — 'admins can do everything' — expands into a many-cell grid. Enterprise product design is often access design. The earlier PMs make it explicit, the safer the roadmap.">
      <div style={{
        borderRadius: '24px', padding: '24px',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.9) 0%, rgba(120,67,238,0.05) 100%)',
        boxShadow: surf,
        perspective: '1000px',
      }}>
        <div style={{ overflowX: 'auto' as const }}>
          <table style={{ width: '100%', borderCollapse: 'separate' as const, borderSpacing: '6px' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 12px', fontSize: '9px', color: 'var(--ed-ink3)', textAlign: 'left' as const, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>ROLE</th>
                {ACTIONS.map((a, ai) => (
                  <th key={a}
                    onMouseEnter={() => setHCol(ai)}
                    onMouseLeave={() => setHCol(null)}
                    style={{ padding: '6px 8px', cursor: 'default' }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800,
                      letterSpacing: '0.08em', textAlign: 'center' as const,
                      color: hCol === ai ? ACCENT : 'var(--ed-ink3)',
                      padding: '4px 8px', borderRadius: '8px',
                      background: hCol === ai ? `${ACCENT}10` : 'transparent',
                      transition: 'all 0.2s',
                    }}>
                      {a.toUpperCase()}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((role, ri) => (
                <tr key={role}
                  onMouseEnter={() => setHRow(ri)}
                  onMouseLeave={() => setHRow(null)}>
                  <td style={{ padding: '6px 12px', whiteSpace: 'nowrap' as const }}>
                    <div style={{
                      fontSize: '12px', fontWeight: 700,
                      color: hRow === ri ? ACCENT : 'var(--ed-ink2)',
                      padding: '4px 10px', borderRadius: '8px',
                      background: hRow === ri ? `${ACCENT}0e` : 'transparent',
                      transition: 'all 0.2s',
                    }}>
                      {role}
                    </div>
                  </td>
                  {ACTIONS.map((_, ai) => {
                    const allowed = PERM[ri][ai];
                    const cc = allowed ? '#16A34A' : '#EF4444';
                    const lit = hRow === ri || hCol === ai;
                    return (
                      <motion.td
                        key={ai}
                        initial={{ opacity: 0, scale: 0.3 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...springBounce, delay: (ri * 4 + ai) * 0.04 }}
                        style={{ padding: '4px', textAlign: 'center' as const, verticalAlign: 'middle' as const }}
                      >
                        <motion.div
                          animate={{
                            y: lit ? -4 : 0,
                            boxShadow: lit ? raised(cc) : `0 4px 10px ${cc}20, 0 2px 0 ${cc}18`,
                          }}
                          transition={spring}
                          style={{
                            width: 42, height: 42, borderRadius: '14px', margin: '0 auto',
                            background: allowed
                              ? 'linear-gradient(145deg, #4ade80cc, #16A34A)'
                              : 'linear-gradient(145deg, #f87171cc, #EF4444)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '17px', color: '#fff', fontWeight: 700,
                          }}
                        >
                          {allowed ? '✓' : '–'}
                        </motion.div>
                      </motion.td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '12px', textAlign: 'center' as const, fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: 'var(--ed-ink3)' }}>
          {ROLES.length} roles × {ACTIONS.length} actions = {ROLES.length * ACTIONS.length} permission decisions
        </div>
      </div>
      <ClickHint text="Hover rows and columns to inspect access" />
    </AnimationShell>
  );
}

// ─── 6. SCALE STRESS ANIMATION ───────────────────────────────────────────────

const LOAD_LEVELS = [
  { id: 0, label: '10 req/s',    color: '#16A34A', status: 'Healthy',  queue: 0, async: false },
  { id: 1, label: '100 req/s',   color: '#CA8A04', status: 'Warm',     queue: 3, async: false },
  { id: 2, label: '1,000 req/s', color: '#EF4444', status: 'Degraded', queue: 9, async: true  },
];
const SERVERS = [
  { name: 'API Server', icon: '🖥', loads: [20, 54, 96] },
  { name: 'Worker',     icon: '⚙',  loads: [18, 48, 88] },
  { name: 'Database',   icon: '🗄',  loads: [14, 38, 74] },
];

export function ScaleStressAnimation() {
  const [level, setLevel] = useState(0);
  const ll = LOAD_LEVELS[level];

  return (
    <AnimationShell caption="Scale is not just bigger traffic — it is a different product operating mode. When load changes system behavior, product experience must change shape too: sync becomes async, instant becomes queued.">
      <div style={{
        borderRadius: '24px', padding: '24px',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(120,67,238,0.05) 100%)',
        boxShadow: surf,
      }}>
        {/* Load selector */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          {LOAD_LEVELS.map(l => (
            <motion.button
              key={l.id}
              onClick={() => setLevel(l.id)}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              animate={{ boxShadow: level === l.id ? raised(l.color) : surf }}
              transition={spring}
              style={{
                flex: 1, padding: '12px 10px', borderRadius: '16px', cursor: 'pointer',
                background: level === l.id
                  ? `linear-gradient(145deg, color-mix(in srgb, white 22%, ${l.color} 78%), ${l.color})`
                  : 'white',
                border: `2px solid ${level === l.id ? l.color : `${l.color}28`}`,
                color: level === l.id ? '#fff' : l.color,
                fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 800,
              }}
            >
              {l.label}
              <div style={{ fontSize: '8px', marginTop: '3px', opacity: 0.85 }}>{l.status}</div>
            </motion.button>
          ))}
        </div>

        {/* Server blocks — 3D perspective grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px', perspective: '800px' }}>
          {SERVERS.map((srv, si) => {
            const loadPct = srv.loads[level];
            const sc = loadPct > 70 ? '#EF4444' : loadPct > 40 ? '#CA8A04' : '#16A34A';
            const isStressed = loadPct > 70;
            return (
              <motion.div
                key={srv.name}
                animate={{
                  x: isStressed ? [-1.5, 1.5, -1.5] : 0,
                  y: isStressed ? [0, -2, 0] : 0,
                  boxShadow: raised(sc),
                }}
                transition={isStressed
                  ? { duration: 0.12, repeat: Infinity, repeatType: 'loop' }
                  : spring}
                style={{
                  borderRadius: '18px', padding: '16px 12px',
                  background: `linear-gradient(160deg,
                    color-mix(in srgb, white 88%, ${sc} 12%) 0%,
                    color-mix(in srgb, white 78%, ${sc} 22%) 100%)`,
                  border: `2px solid ${sc}30`,
                  textAlign: 'center' as const,
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{srv.icon}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800, color: sc, marginBottom: '8px', letterSpacing: '0.08em' }}>
                  {srv.name}
                </div>
                <div style={{ height: '5px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '5px' }}>
                  <motion.div animate={{ width: `${loadPct}%` }} transition={{ duration: 0.5 }}
                    style={{ height: '100%', background: sc, borderRadius: '3px' }} />
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', color: sc, fontWeight: 700 }}>
                  {loadPct}%
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Queue */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '10px', fontFamily: "'JetBrains Mono',monospace", color: 'var(--ed-ink3)', fontWeight: 700, marginBottom: '8px' }}>
            REQUEST QUEUE
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const }}>
            <AnimatePresence>
              {Array.from({ length: ll.queue }).map((_, i) => (
                <motion.div key={i}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ ...springBounce, delay: i * 0.04 }}
                  style={{
                    width: 30, height: 30, borderRadius: '9px',
                    background: `${ll.color}1a`, border: `1.5px solid ${ll.color}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '9px', color: ll.color, fontWeight: 800,
                    fontFamily: "'JetBrains Mono',monospace",
                  }}>
                  {i + 1}
                </motion.div>
              ))}
            </AnimatePresence>
            {ll.queue === 0 && (
              <div style={{ fontSize: '11px', color: '#16A34A', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
                ✓ No queue — instant response
              </div>
            )}
          </div>
        </div>

        {/* Async mode notice */}
        <AnimatePresence>
          {ll.async && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ padding: '12px 16px', borderRadius: '14px', background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.28)', borderLeft: '4px solid #EF4444' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#EF4444', marginBottom: '4px' }}>Export moved to background job</div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>&ldquo;We&apos;ll notify you when your report is ready.&rdquo; — Product experience must change shape at this load level.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ClickHint text="Click a load level to change system behavior" />
    </AnimationShell>
  );
}

// ─── 7. ESTIMATE BREAKDOWN CASCADE ───────────────────────────────────────────

const WORKSTREAMS = [
  { label: 'Frontend',                   icon: '⬜', color: '#3B82F6', risk: 'known'      },
  { label: 'Backend',                    icon: '⚙',  color: ACCENT,    risk: 'known'      },
  { label: 'Auth / Permissions',         icon: '🔑', color: '#CA8A04', risk: 'uncertain'  },
  { label: 'Analytics instrumentation',  icon: '📊', color: '#0097A7', risk: 'dependency' },
  { label: 'Data migration',             icon: '🗄',  color: '#E67E22', risk: 'unknown'    },
  { label: 'QA / Edge cases',            icon: '🧪', color: '#7C3AED', risk: 'uncertain'  },
  { label: 'Rollout & monitoring',       icon: '🚀', color: '#16A34A', risk: 'known'      },
];
const RISK_COLORS: Record<string, string> = {
  known: '#16A34A', uncertain: '#CA8A04', dependency: '#3B82F6', unknown: '#EF4444',
};

export function EstimateBreakdownCascade() {
  const [exploded, setExploded] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <AnimationShell caption="One feature card splits into many engineering workstreams. Better decomposition does not create uncertainty — it reveals uncertainty that was already hiding in the scope.">
      <div style={{
        borderRadius: '24px', padding: '24px',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(120,67,238,0.05) 100%)',
        boxShadow: surf,
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          {/* Feature card — click to explode */}
          <motion.div
            onClick={() => setExploded(e => !e)}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: exploded ? raised(ACCENT) : surf }}
            transition={spring}
            style={{
              flexShrink: 0, width: '130px', padding: '18px 12px',
              borderRadius: '20px', cursor: 'pointer',
              background: `linear-gradient(145deg, color-mix(in srgb, white 22%, ${ACCENT} 78%), ${ACCENT})`,
              color: '#fff', textAlign: 'center' as const,
              userSelect: 'none' as const,
            }}
          >
            <div style={{ fontSize: '26px', marginBottom: '10px' }}>📦</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '6px', opacity: 0.8 }}>
              FEATURE
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, lineHeight: 1.45 }}>
              Enterprise Admin Workspace
            </div>
            <motion.div
              animate={{ rotate: exploded ? 45 : 0 }}
              style={{ marginTop: '12px', fontSize: '16px' }}
            >
              ✦
            </motion.div>
            <div style={{ marginTop: '6px', fontSize: '9px', opacity: 0.7, fontFamily: "'JetBrains Mono',monospace" }}>
              {exploded ? `${WORKSTREAMS.length} streams found` : 'Tap to scope'}
            </div>
          </motion.div>

          {/* Workstream list */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            <AnimatePresence>
              {exploded && WORKSTREAMS.map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30, scale: 0.9 }}
                  animate={{
                    opacity: 1, x: 0,
                    scale: hovered === i ? 1.025 : 1,
                    boxShadow: hovered === i ? raised(w.color) : surf,
                  }}
                  exit={{ opacity: 0, x: 30, scale: 0.9 }}
                  transition={{ ...spring, delay: i * 0.055 }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 12px', borderRadius: '14px', cursor: 'default',
                    background: hovered === i
                      ? `linear-gradient(135deg, color-mix(in srgb, white 90%, ${w.color} 10%) 0%, color-mix(in srgb, white 83%, ${w.color} 17%) 100%)`
                      : 'white',
                    border: `1.5px solid ${hovered === i ? `${w.color}45` : 'var(--ed-rule)'}`,
                  }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: '9px', flexShrink: 0,
                    background: `linear-gradient(145deg, ${w.color}cc, ${w.color})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                    boxShadow: hovered === i ? `0 5px 12px ${w.color}45, 3px 3px 0 ${w.color}30` : `0 2px 6px ${w.color}25`,
                  }}>
                    {w.icon}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--ed-ink2)', flex: 1, fontWeight: 500 }}>{w.label}</span>
                  <span style={{
                    fontSize: '8px', padding: '2px 8px', borderRadius: '8px', flexShrink: 0,
                    background: `${RISK_COLORS[w.risk]}16`, color: RISK_COLORS[w.risk],
                    fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, letterSpacing: '0.06em',
                    border: `1px solid ${RISK_COLORS[w.risk]}2e`,
                  }}>
                    {w.risk}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {!exploded && (
              <div style={{ display: 'flex', alignItems: 'center', height: '42px', paddingLeft: '4px' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: 'var(--ed-ink3)', fontWeight: 600, letterSpacing: '0.04em' }}>
                  Click the feature card to decompose it →
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ClickHint text="Click the feature card to reveal all engineering workstreams" />
    </AnimationShell>
  );
}

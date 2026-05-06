'use client';

/**
 * FeatureRequestXrayVisual
 *
 * Premium claymorphism 3D exploded-system visual.
 * A feature request fans out into six engineering layers, each rendered as a
 * thick floating clay slab in genuine preserve-3d space.
 *
 * Layout:   Request card (left/front) → SVG curved connectors → 6 depth-fanned slabs (right)
 * Controls: Click any slab. Default selected: Analytics Event.
 * Motion:   Framer Motion springs. Reduced-motion safe.
 * Tokens:   var(--ed-card) · var(--ed-cream) · var(--ed-ink) · var(--ed-ink2) · var(--ed-rule)
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Layer data ───────────────────────────────────────────────────────────────

const LAYERS = [
  {
    id: 'ui', num: '01', label: 'UI Layer',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    color: '#3B82F6', rgb: '59,130,246',
    hiddenWork: 'Screen state · filters · loading · empty states',
    consequence: 'A vague UI request creates edge cases the team must invent. Every null state, filter option, and error message is a design decision that has to come from somewhere.',
  },
  {
    id: 'api', num: '02', label: 'API Contract',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    ),
    color: '#7843EE', rgb: '120,67,238',
    hiddenWork: 'Endpoint shape · response fields · error states',
    consequence: 'If the contract is unclear, frontend and backend guess differently. Guesses diverge. Bugs appear at integration, not during isolated development.',
  },
  {
    id: 'perm', num: '03', label: 'Permission Check',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5l3 3L22 7l-3-3"/>
      </svg>
    ),
    color: '#D97706', rgb: '217,119,6',
    hiddenWork: 'Who can view which reports?',
    consequence: 'Access rules are product decisions, not engineering cleanup. "Admins only" is one sentence that expands into a matrix of role–resource–action combinations.',
  },
  {
    id: 'logic', num: '04', label: 'Business Logic',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
      </svg>
    ),
    color: '#0097A7', rgb: '0,151,167',
    hiddenWork: 'Which coaching sessions count?',
    consequence: 'Definitions must be explicit before anyone calculates anything. "Sessions" can mean scheduled, completed, attended, or graded — each produces a different number.',
  },
  {
    id: 'db', num: '05', label: 'Database Query',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    color: '#E8875A', rgb: '232,135,90',
    hiddenWork: 'Joins · indexes · data freshness',
    consequence: 'A simple report can become slow if data shape is ignored. Joining three unindexed tables will surface as a production incident in the next sprint.',
  },
  {
    id: 'event', num: '06', label: 'Analytics Event',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    color: '#16A34A', rgb: '22,163,74',
    hiddenWork: 'Track usage · adoption · blind spots',
    consequence: 'Without instrumentation, the PM cannot tell whether the feature worked. Day 30 arrives and no one knows if anyone clicked Export even once.',
  },
] as const;

type LayerId = typeof LAYERS[number]['id'];

// ─── Geometry constants ───────────────────────────────────────────────────────
const SLAB_H      = 64;   // slab front-face height px
const SLAB_GAP    = 10;   // gap between slabs
const BEVEL       = 10;   // clay thickness depth px
const CARD_W      = 180;  // request card width
const STAGE_PAD_T = 24;   // stage top padding for bevel overflow
const Z_STEP      = 18;   // translateZ per layer — top slab is closest

// Row top offset for slab i (inside the 3D stage)
const slabTop = (i: number) => STAGE_PAD_T + i * (SLAB_H + SLAB_GAP);
const STAGE_H = STAGE_PAD_T + 6 * SLAB_H + 5 * SLAB_GAP + BEVEL + 12;

// ─── Clay Slab ────────────────────────────────────────────────────────────────
function ClaySlab({
  layer, index, isSelected, onClick, reducedMotion,
}: {
  layer: typeof LAYERS[number];
  index: number;
  isSelected: boolean;
  onClick: () => void;
  reducedMotion: boolean;
}) {
  const z0 = (LAYERS.length - 1 - index) * Z_STEP; // base Z: top slab closest
  const zSel = z0 + 32;

  return (
    <motion.div
      onClick={onClick}
      animate={reducedMotion ? {} : {
        z: isSelected ? zSel : z0,
        y: isSelected ? -6 : 0,
        scale: isSelected ? 1.025 : 1,
      }}
      whileHover={reducedMotion ? {} : {
        z: isSelected ? zSel : z0 + 14,
        y: isSelected ? -6 : -3,
        scale: isSelected ? 1.025 : 1.01,
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      style={{
        position: 'absolute' as const,
        top: slabTop(index),
        left: CARD_W + 32,
        right: 0,
        height: SLAB_H,
        cursor: 'pointer',
        userSelect: 'none' as const,
      }}
    >
      {/* ── Top bevel face ── */}
      <div style={{
        position: 'absolute', top: -BEVEL, left: BEVEL, right: -BEVEL, height: BEVEL + 2,
        background: `linear-gradient(90deg, rgba(${layer.rgb},0.55) 0%, rgba(${layer.rgb},0.25) 100%)`,
        borderRadius: '10px 12px 0 0',
        transform: 'skewX(-3deg)',
        pointerEvents: 'none',
      }} />

      {/* ── Right bevel face ── */}
      <div style={{
        position: 'absolute', top: BEVEL, right: -BEVEL, bottom: -BEVEL, width: BEVEL + 2,
        background: `linear-gradient(180deg, rgba(${layer.rgb},0.38) 0%, rgba(${layer.rgb},0.15) 100%)`,
        borderRadius: '0 4px 4px 0',
        transform: 'skewY(-3deg)',
        pointerEvents: 'none',
      }} />

      {/* ── Bottom shadow face ── */}
      <div style={{
        position: 'absolute', bottom: -BEVEL, left: BEVEL, right: 0, height: BEVEL + 2,
        background: `rgba(${layer.rgb},0.12)`,
        borderRadius: '0 0 10px 12px',
        pointerEvents: 'none',
      }} />

      {/* ── Front face ── */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '18px',
        background: isSelected
          ? `linear-gradient(135deg,
              color-mix(in srgb, var(--ed-card) 78%, ${layer.color} 22%) 0%,
              color-mix(in srgb, var(--ed-card) 68%, ${layer.color} 32%) 100%)`
          : `linear-gradient(145deg,
              color-mix(in srgb, var(--ed-card) 91%, ${layer.color} 9%) 0%,
              color-mix(in srgb, var(--ed-card) 85%, ${layer.color} 15%) 100%)`,
        border: `2px solid ${isSelected ? layer.color : `rgba(${layer.rgb},0.22)`}`,
        boxShadow: isSelected
          ? `0 10px 28px rgba(${layer.rgb},0.28), inset 0 1px 0 rgba(255,255,255,0.22)`
          : `0 3px 10px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.12)`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        transition: 'border-color 0.18s, background 0.18s, box-shadow 0.18s',
        overflow: 'hidden',
      }}>
        {/* Number badge */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9, fontWeight: 900,
          color: `rgba(${layer.rgb},0.55)`,
          flexShrink: 0, width: 20,
        }}>
          {layer.num}
        </div>

        {/* Icon chip */}
        <div style={{
          width: 40, height: 40, borderRadius: 13, flexShrink: 0,
          background: `linear-gradient(145deg, rgba(${layer.rgb},0.8) 0%, ${layer.color} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
          boxShadow: isSelected
            ? `0 6px 18px rgba(${layer.rgb},0.5), 4px 4px 0 rgba(${layer.rgb},0.35)`
            : `0 3px 8px rgba(${layer.rgb},0.3), 3px 3px 0 rgba(${layer.rgb},0.2)`,
          transition: 'box-shadow 0.18s',
        }}>
          {layer.icon}
        </div>

        {/* Label + hidden work */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, lineHeight: 1.3,
            color: isSelected ? layer.color : 'var(--ed-ink)',
            transition: 'color 0.18s',
          }}>
            {layer.label}
          </div>
          <div style={{
            fontSize: 10, color: 'var(--ed-ink3)',
            marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
          }}>
            {layer.hiddenWork}
          </div>
        </div>

        {/* Selected pulse */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              style={{
                width: 10, height: 10, borderRadius: '50%',
                background: layer.color,
                boxShadow: `0 0 14px ${layer.color}`,
                flexShrink: 0,
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function FeatureRequestXrayVisual() {
  const [sel, setSel] = useState<LayerId>('event');
  const [reducedMotion, setReducedMotion] = useState(false);
  const selLayer = LAYERS.find(l => l.id === sel)!;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // SVG connector: from right edge of request card → left edge of each slab
  // Card right edge is at x ≈ CARD_W, center-y ≈ STAGE_H/2
  // Each slab left edge is at x = CARD_W + 32, center-y = slabTop(i) + SLAB_H/2
  const connectorPath = (i: number) => {
    const x0 = CARD_W;
    const y0 = STAGE_H / 2;
    const x1 = CARD_W + 32;
    const y1 = STAGE_PAD_T + i * (SLAB_H + SLAB_GAP) + SLAB_H / 2;
    const cx = (x0 + x1) / 2 + 16;
    return `M ${x0} ${y0} C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  };

  return (
    <div style={{ margin: '28px 0' }}>
      {/* ── Stage area ── */}
      <div style={{
        position: 'relative',
        height: STAGE_H,
        /* perspective on wrapper, preserve-3d on inner stage */
        perspective: '1100px',
        perspectiveOrigin: '45% 30%',
      }}>
        {/* Inner 3D stage — tilted so depth is visible */}
        <div style={{
          position: 'absolute', inset: 0,
          transformStyle: 'preserve-3d',
          transform: reducedMotion ? 'none' : 'rotateX(-10deg) rotateY(6deg)',
        }}>

          {/* ── Request card ── */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, z: -40, x: -20 }}
            animate={{ opacity: 1, z: 60, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.05 }}
            style={{
              position: 'absolute',
              left: 0, top: 0, bottom: 0,
              width: CARD_W,
              display: 'flex', alignItems: 'center',
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              borderRadius: 22,
              padding: '22px 16px 20px',
              background: `linear-gradient(155deg,
                color-mix(in srgb, var(--ed-card) 82%, #7843EE 18%) 0%,
                color-mix(in srgb, var(--ed-card) 72%, #7843EE 28%) 100%)`,
              border: '2px solid rgba(120,67,238,0.3)',
              boxShadow: `8px 10px 0 rgba(120,67,238,0.18), 0 20px 40px rgba(120,67,238,0.14), inset 0 1px 0 rgba(255,255,255,0.18)`,
            }}>
              {/* Card clay faces */}
              <div style={{ position: 'absolute', top: -BEVEL, left: BEVEL, right: -BEVEL, height: BEVEL + 2,
                background: 'rgba(120,67,238,0.45)', borderRadius: '10px 12px 0 0', transform: 'skewX(-3deg)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', right: -BEVEL - 1, top: BEVEL, bottom: -BEVEL, width: BEVEL + 3,
                background: 'linear-gradient(180deg, rgba(120,67,238,0.32), rgba(120,67,238,0.12))', borderRadius: '0 6px 6px 0', transform: 'skewY(-3deg)', pointerEvents: 'none' }} />

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 800,
                letterSpacing: '0.18em', color: '#7843EE', marginBottom: 12, textTransform: 'uppercase' as const }}>
                Feature Request
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ed-ink)', lineHeight: 1.4, marginBottom: 10 }}>
                Show team coaching reports
              </div>
              <div style={{ fontSize: 10, color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
                Looks simple. Actually touches{' '}
                <span style={{ color: '#7843EE', fontWeight: 700 }}>six systems</span>.
              </div>
            </div>
          </motion.div>

          {/* ── SVG connector lines ── */}
          <svg
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              pointerEvents: 'none', overflow: 'visible',
            }}
            viewBox={`0 0 800 ${STAGE_H}`}
            preserveAspectRatio="none"
          >
            <defs>
              {LAYERS.map(l => (
                <filter key={`glow-${l.id}`} id={`glow-${l.id}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              ))}
            </defs>
            {LAYERS.map((layer, i) => {
              const isSel = sel === layer.id;
              return (
                <path
                  key={layer.id}
                  d={connectorPath(i)}
                  fill="none"
                  stroke={isSel ? layer.color : `rgba(${layer.rgb},0.2)`}
                  strokeWidth={isSel ? 2.5 : 1.5}
                  strokeDasharray={isSel ? 'none' : '4 4'}
                  filter={isSel ? `url(#glow-${layer.id})` : undefined}
                  style={{ transition: 'stroke 0.25s, stroke-width 0.25s' }}
                />
              );
            })}
          </svg>

          {/* ── Six clay slabs (staggered spring entrance) ── */}
          {LAYERS.map((layer, i) => (
            <motion.div
              key={layer.id}
              initial={reducedMotion ? {} : { opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.06 + i * 0.06 }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <ClaySlab
                layer={layer}
                index={i}
                isSelected={sel === layer.id}
                onClick={() => setSel(layer.id)}
                reducedMotion={reducedMotion}
              />
            </motion.div>
          ))}

        </div>
      </div>

      {/* ── PM Consequence panel ── */}
      <div style={{
        marginTop: 20,
        minHeight: 88,
        padding: '16px 22px',
        borderRadius: 18,
        background: `rgba(${selLayer.rgb},0.07)`,
        border: `1.5px solid rgba(${selLayer.rgb},0.22)`,
        borderLeft: `4px solid ${selLayer.color}`,
        transition: 'background 0.3s, border-color 0.3s',
        display: 'flex', flexDirection: 'column' as const, justifyContent: 'center',
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={sel}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8, fontWeight: 800, letterSpacing: '0.16em',
              color: selLayer.color, marginBottom: 7,
              textTransform: 'uppercase' as const,
            }}>
              {selLayer.label} — PM Consequence
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--ed-ink2)', lineHeight: 1.72 }}>
              {selLayer.consequence}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Responsive override: mobile stacked layout */}
      <style>{`
        @media (max-width: 640px) {
          .xray-stage { perspective: none !important; }
          .xray-inner { transform: none !important; transform-style: flat !important; }
        }
      `}</style>
    </div>
  );
}

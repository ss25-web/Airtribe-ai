'use client';

/**
 * FeatureRequestXrayVisual
 *
 * Sequential tunnel: 6 system layers stacked in perspective depth.
 * Front layer = closest/largest. Back layer = farthest/smallest.
 * Auto-cycles through all 6 layers. No click required.
 * Each cycle the next layer comes to the front; consequence panel updates.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Data ─────────────────────────────────────────────────────────────────────

const LAYERS = [
  {
    id: 'ui', num: '01', label: 'UI Layer',
    color: '#3B82F6', rgb: '59,130,246', emoji: '⬜',
    work: 'Screen state · filters · loading · empty states',
    consequence: 'A vague UI request creates edge cases the team must invent. Every null state, filter combination, and error message is a design decision that has to come from somewhere.',
  },
  {
    id: 'api', num: '02', label: 'API Contract',
    color: '#7843EE', rgb: '120,67,238', emoji: '⇄',
    work: 'Endpoint shape · response fields · error codes',
    consequence: 'If the contract is unclear, frontend and backend guess differently. Guesses diverge in isolation and collide at integration — two weeks before the deadline.',
  },
  {
    id: 'perm', num: '03', label: 'Permission Check',
    color: '#D97706', rgb: '217,119,6', emoji: '🔑',
    work: 'Role access · data scoping · audit trail',
    consequence: 'Access rules are product decisions, not engineering cleanup. "Admins only" is one sentence that expands into a matrix of roles, resources, and actions.',
  },
  {
    id: 'logic', num: '04', label: 'Business Logic',
    color: '#0097A7', rgb: '0,151,167', emoji: '⚙',
    work: 'Calculation rules · edge cases · definitions',
    consequence: 'Definitions must be explicit before anyone calculates anything. "Sessions" can mean scheduled, completed, attended, or graded — each gives a different number.',
  },
  {
    id: 'db', num: '05', label: 'Database Query',
    color: '#E8875A', rgb: '232,135,90', emoji: '🗄',
    work: 'Joins · indexes · freshness · query cost',
    consequence: 'A simple report can become slow if data shape is ignored. Joining three unindexed tables will surface as a production incident in the next sprint.',
  },
  {
    id: 'event', num: '06', label: 'Analytics Event',
    color: '#16A34A', rgb: '22,163,74', emoji: '📊',
    work: 'Usage tracking · adoption signals · blind spots',
    consequence: 'Without instrumentation, the PM cannot tell whether the feature worked. Day 30 arrives and no one knows if anyone clicked Export even once.',
  },
] as const;

// Z position for each slot in the tunnel (slot 0 = front, slot 5 = back)
const Z_SLOTS = [0, -170, -310, -430, -530, -610];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeatureRequestXrayVisual() {
  const [frontIdx, setFrontIdx] = useState(0);

  // Auto-cycle
  useEffect(() => {
    const t = setInterval(() => setFrontIdx(i => (i + 1) % LAYERS.length), 2300);
    return () => clearInterval(t);
  }, []);

  const frontLayer = LAYERS[frontIdx];

  // Which depth slot does each layer occupy right now?
  const slotOf = (i: number) => (i - frontIdx + LAYERS.length) % LAYERS.length;

  const SLAB_W = 560;
  const SLAB_H = 86;

  return (
    <div style={{ margin: '28px 0' }}>

      {/* ── Feature request header ── */}
      <div style={{
        textAlign: 'center' as const,
        marginBottom: 28,
      }}>
        <div style={{
          display: 'inline-block',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9, fontWeight: 800, letterSpacing: '0.2em',
          color: 'var(--ed-ink3)', marginBottom: 8,
          textTransform: 'uppercase' as const,
        }}>
          Feature Request
        </div>
        <div style={{
          fontSize: 20, fontWeight: 800, color: 'var(--ed-ink)',
          fontFamily: "'Lora', Georgia, serif",
          marginBottom: 6,
        }}>
          &ldquo;Show team coaching reports&rdquo;
        </div>
        <div style={{ fontSize: 12, color: 'var(--ed-ink3)' }}>
          One simple ask — six engineering responsibilities
        </div>
      </div>

      {/* ── Tunnel stage ── */}
      <div style={{
        position: 'relative',
        height: 340,
        perspective: '900px',
        perspectiveOrigin: '50% 52%',
        overflow: 'visible',
      }}>
        {/* Vignette overlay — enhances tunnel depth illusion */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 65% at 50% 52%, transparent 45%, var(--ed-cream) 90%)',
        }} />

        {/* preserve-3d container */}
        <div style={{
          position: 'absolute', inset: 0,
          transformStyle: 'preserve-3d',
        }}>
          {LAYERS.map((layer, i) => {
            const slot   = slotOf(i);
            const z      = Z_SLOTS[slot];
            const isFront = slot === 0;
            // Opacity: front is fully visible, each step behind fades further
            const opacity = Math.max(0.10, 1 - slot * 0.17);
            // Ensure front slab renders visually on top
            const zIndex  = LAYERS.length - slot;

            return (
              <motion.div
                key={layer.id}
                animate={{ z, opacity }}
                transition={{ type: 'spring', stiffness: 160, damping: 24 }}
                style={{
                  position: 'absolute',
                  // Center horizontally and vertically within stage
                  left: `calc(50% - ${SLAB_W / 2}px)`,
                  top:  `calc(50% - ${SLAB_H / 2}px)`,
                  width: SLAB_W,
                  height: SLAB_H,
                  zIndex,
                }}
              >
                <div style={{
                  width: '100%', height: '100%',
                  borderRadius: 22,
                  padding: '0 20px',
                  display: 'flex', alignItems: 'center', gap: 16,
                  // Active slab gets richer background gradient
                  background: isFront
                    ? `linear-gradient(140deg,
                        color-mix(in srgb, var(--ed-card) 76%, ${layer.color} 24%) 0%,
                        color-mix(in srgb, var(--ed-card) 66%, ${layer.color} 34%) 100%)`
                    : `color-mix(in srgb, var(--ed-card) 92%, ${layer.color} 8%)`,
                  border: `2px solid ${isFront ? layer.color : `rgba(${layer.rgb},0.16)`}`,
                  boxShadow: isFront
                    ? `0 28px 56px rgba(${layer.rgb},0.32), 0 6px 0 rgba(${layer.rgb},0.16), inset 0 1px 0 rgba(255,255,255,0.20)`
                    : '0 4px 12px rgba(0,0,0,0.10)',
                  transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
                  position: 'relative' as const,
                  overflow: 'hidden',
                }}>
                  {/* Top edge highlight on active slab */}
                  {isFront && (
                    <div style={{
                      position: 'absolute', top: 0, left: '10%', right: '10%', height: 2,
                      background: `linear-gradient(90deg, transparent, ${layer.color}70, transparent)`,
                      borderRadius: '22px 22px 0 0',
                    }} />
                  )}

                  {/* Number */}
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10, fontWeight: 900, flexShrink: 0, width: 22,
                    color: `rgba(${layer.rgb},0.48)`,
                  }}>
                    {layer.num}
                  </div>

                  {/* Icon chip */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                    background: `linear-gradient(145deg, rgba(${layer.rgb},0.78), ${layer.color})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 21,
                    boxShadow: isFront
                      ? `0 8px 20px rgba(${layer.rgb},0.45), 5px 5px 0 rgba(${layer.rgb},0.26)`
                      : `0 2px 6px rgba(${layer.rgb},0.18)`,
                  }}>
                    {layer.emoji}
                  </div>

                  {/* Label + hidden work */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 15, fontWeight: 800, lineHeight: 1.25,
                      color: isFront ? layer.color : 'var(--ed-ink)',
                      marginBottom: 3,
                      transition: 'color 0.3s',
                    }}>
                      {layer.label}
                    </div>
                    <div style={{
                      fontSize: 11, color: 'var(--ed-ink3)', lineHeight: 1.4,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
                    }}>
                      {layer.work}
                    </div>
                  </div>

                  {/* Active pulse dot */}
                  {isFront && (
                    <motion.div
                      animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        width: 11, height: 11, borderRadius: '50%', flexShrink: 0,
                        background: layer.color,
                        boxShadow: `0 0 18px ${layer.color}`,
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Progress squircles ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' as const }}>
        {LAYERS.map((layer, i) => {
          const isActive = i === frontIdx;
          return (
            <motion.div
              key={layer.id}
              layout
              animate={{ background: isActive ? layer.color : `rgba(${layer.rgb},0.12)` }}
              transition={{ duration: 0.3 }}
              style={{
                height: 36, borderRadius: 10, overflow: 'hidden',
                padding: isActive ? '0 12px 0 10px' : '0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                minWidth: 36,
              }}
            >
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, fontWeight: 900, flexShrink: 0,
                color: isActive ? '#fff' : `rgba(${layer.rgb},0.65)`,
              }}>
                {layer.num}
              </span>
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.2 }}
                    style={{ fontSize: 11, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' as const }}
                  >
                    {layer.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ── PM Consequence panel ── */}
      <motion.div
        animate={{
          background: `rgba(${frontLayer.rgb},0.07)`,
          borderColor: `rgba(${frontLayer.rgb},0.22)`,
        }}
        transition={{ duration: 0.3 }}
        style={{
          minHeight: 88,
          padding: '16px 22px',
          borderRadius: 18,
          border: '1.5px solid transparent',
          borderLeft: `4px solid ${frontLayer.color}`,
          display: 'flex', flexDirection: 'column' as const, justifyContent: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={frontIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8, fontWeight: 800, letterSpacing: '0.18em',
              color: frontLayer.color, marginBottom: 7,
              textTransform: 'uppercase' as const,
            }}>
              {frontLayer.label} — PM Consequence
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--ed-ink2)', lineHeight: 1.72 }}>
              {frontLayer.consequence}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

    </div>
  );
}

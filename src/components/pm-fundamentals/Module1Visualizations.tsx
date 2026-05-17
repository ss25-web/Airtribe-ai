'use client';

import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ─── Shared ────────────────────────────────────────────────────────────────────
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function ReplayBtn({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.button onClick={onReplay} whileHover={{ opacity: 0.75, scale: 1.03 }} whileTap={{ scale: 0.96 }}
      style={{ marginTop: '14px', padding: '6px 20px', borderRadius: '8px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--ed-rule)', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>
      ↺ replay
    </motion.button>
  );
}

function VizLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '18px', textTransform: 'uppercase' as const }}>
      {children}
    </div>
  );
}

// ─── 1. UDBM LOOP — SVG circular diagram with 3D-block card styling ───────────
// Four vivid solid-colour cards at N/E/S/W. Active card lifts + glows.
// 3D depth via bottom-edge box-shadow. All cards equal size and readable.

const PHASES = [
  { id: 'understand', num: '01', label: 'Understand', sub: 'Define the real problem before any solution.',
    detail: 'Talk to users. Read the data. Never start building on a hunch.',
    color: '#6366F1', dark: '#3730A3', light: '#818CF8', glow: 'rgba(99,102,241,0.65)' },
  { id: 'decide',     num: '02', label: 'Decide',     sub: 'Choose with clarity — not by consensus.',
    detail: 'Evaluate options. Make the tradeoff explicit. Own the call.',
    color: '#0EA5E9', dark: '#0369A1', light: '#38BDF8', glow: 'rgba(14,165,233,0.65)' },
  { id: 'build',      num: '03', label: 'Build',      sub: 'Ship with the whole team aligned.',
    detail: 'Catch misalignments before the sprint. They compound fast.',
    color: '#F97316', dark: '#C2410C', light: '#FB923C', glow: 'rgba(249,115,22,0.65)' },
  { id: 'measure',    num: '04', label: 'Measure',    sub: 'Did it work? What did the data say?',
    detail: 'Check the success metric you defined before shipping.',
    color: '#22C55E', dark: '#15803D', light: '#4ADE80', glow: 'rgba(34,197,94,0.65)' },
];

const CX = 300, CY = 265, RING_R = 168;
// Card centres on the ring (N, E, S, W)
const CARD_CENTERS = [
  { x: CX,            y: CY - RING_R }, // Understand — top
  { x: CX + RING_R,   y: CY           }, // Decide — right
  { x: CX,            y: CY + RING_R }, // Build — bottom
  { x: CX - RING_R,   y: CY           }, // Measure — left
];
const CARD_W = 148, CARD_H = 92;

// Arrow tips at 45° midpoints
const ARROW_TIPS = [
  { x: CX + RING_R * Math.cos(-Math.PI / 4), y: CY + RING_R * Math.sin(-Math.PI / 4), rot: 45,  ci: 0 }, // U→D
  { x: CX + RING_R * Math.cos(Math.PI / 4),  y: CY + RING_R * Math.sin(Math.PI / 4),  rot: 135, ci: 1 }, // D→B
  { x: CX + RING_R * Math.cos(3 * Math.PI / 4), y: CY + RING_R * Math.sin(3 * Math.PI / 4), rot: 225, ci: 2 }, // B→M
  { x: CX + RING_R * Math.cos(-3 * Math.PI / 4), y: CY + RING_R * Math.sin(-3 * Math.PI / 4), rot: 315, ci: 3 }, // M→U
];

export function UDBMLoopAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(-1);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setActive(0);
    const iv = setInterval(() => setActive(a => (a + 1) % 4), 2800);
    return () => clearInterval(iv);
  }, [inView, tick]);

  const replay = () => { setActive(-1); setTick(t => t + 1); };
  const ph = active >= 0 ? PHASES[active] : null;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>The PM Operating Loop — auto-animated</VizLabel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'center' }}>

        {/* ── Left: circular diagram ── */}
        <div style={{
          position: 'relative',
          borderRadius: '24px',
          background: 'linear-gradient(145deg, #F8F5F0 0%, #EDEAE4 100%)',
          border: '1px solid var(--ed-rule)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.07)',
          overflow: 'hidden',
        }}>
          {/* SVG: ring + arrow tips only */}
          <svg viewBox="0 0 600 530" style={{ width: '100%', display: 'block' }}>
            <defs>
              <filter id="udbmCardShadow">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="rgba(0,0,0,0.18)" />
              </filter>
            </defs>
            {/* Dashed guide ring */}
            <circle cx={CX} cy={CY} r={RING_R} fill="none" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 5" />
            {/* Arrow tips (equilateral triangles, rotated) */}
            {ARROW_TIPS.map((a, i) => (
              <motion.g key={i} transform={`translate(${a.x},${a.y}) rotate(${a.rot})`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12, duration: 0.4 }}>
                <polygon points="0,-9 8,6 -8,6" fill={PHASES[a.ci].color}
                  style={{ filter: active === a.ci ? `drop-shadow(0 0 6px ${PHASES[a.ci].glow})` : 'none' }} />
              </motion.g>
            ))}
            {/* Center label */}
            <text x={CX} y={CY - 10} textAnchor="middle" style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fill: '#94A3B8', fontWeight: 800, letterSpacing: '0.16em' }}>PM</text>
            <text x={CX} y={CY + 8} textAnchor="middle" style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fill: '#94A3B8', fontWeight: 800, letterSpacing: '0.16em' }}>LOOP</text>
          </svg>

          {/* Phase cards — absolutely overlaid, matching SVG coordinate space */}
          {PHASES.map((p, i) => {
            const c = CARD_CENTERS[i];
            const isActive = active === i;
            // Convert SVG coords → % of viewBox (600 × 530)
            const leftPct = (c.x / 600) * 100;
            const topPct = (c.y / 530) * 100;
            return (
              <motion.div key={p.id}
                animate={{ y: isActive ? -10 : 0, scale: isActive ? 1.065 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  // Offset so card is centered on its point
                  marginLeft: `${-(CARD_W / 2)}px`,
                  marginTop: `${-(CARD_H / 2)}px`,
                  width: `${CARD_W}px`,
                  padding: '13px 14px 15px',
                  borderRadius: '14px',
                  background: `linear-gradient(160deg, ${p.light} 0%, ${p.color} 55%, ${p.dark} 100%)`,
                  boxShadow: isActive
                    ? `inset 0 1px 0 rgba(255,255,255,0.45), 0 6px 0 ${p.dark}, 0 10px 0 rgba(0,0,0,0.12), 0 18px 48px ${p.glow}`
                    : `inset 0 1px 0 rgba(255,255,255,0.28), 0 4px 0 ${p.dark}, 0 6px 0 rgba(0,0,0,0.08), 0 10px 28px ${p.glow}55`,
                  transition: 'box-shadow 0.4s',
                  cursor: 'default',
                  zIndex: isActive ? 3 : 1,
                }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.16em', marginBottom: '5px' }}>{p.num}</div>
                <div style={{ fontSize: '19px', fontWeight: 900, color: '#FFFFFF', marginBottom: '5px', lineHeight: 1.05, textShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>{p.label}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.45 }}>{p.sub}</div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Right: active phase detail ── */}
        <div style={{ minHeight: '220px' }}>
          <AnimatePresence mode="wait">
            {ph && (
              <motion.div key={ph.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <div style={{
                  padding: '26px 24px', borderRadius: '18px',
                  background: `linear-gradient(145deg, ${ph.light} 0%, ${ph.color} 55%, ${ph.dark} 100%)`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 0 ${ph.dark}, 0 10px 0 rgba(0,0,0,0.1), 0 20px 56px ${ph.glow}`,
                  marginBottom: '16px',
                }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.2em', marginBottom: '10px' }}>PHASE {ph.num} OF 04</div>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#FFFFFF', marginBottom: '10px', lineHeight: 1.0, textShadow: '0 3px 16px rgba(0,0,0,0.2)' }}>{ph.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, marginBottom: '14px' }}>{ph.sub}</div>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.22)', marginBottom: '14px' }} />
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.76)', lineHeight: 1.75 }}>{ph.detail}</div>
                </div>
                {/* Phase step dots */}
                <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                  {PHASES.map((p, i) => (
                    <motion.div key={i}
                      animate={{ width: active === i ? '32px' : '8px', background: active === i ? p.color : 'var(--ed-rule)' }}
                      transition={{ duration: 0.35 }}
                      style={{ height: '8px', borderRadius: '4px' }}
                    />
                  ))}
                  <span style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", marginLeft: '6px' }}>{active + 1}/4</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 2. PROBLEM ICEBERG ────────────────────────────────────────────────────────

const SYMPTOMS = [
  { text: '"The app is confusing"', x: 310, y: 58 },
  { text: '"Can\'t find anything"', x: 120, y: 88 },
  { text: '"It\'s just hard to use"', x: 500, y: 72 },
];
const ROOT_PROBLEMS = [
  { text: 'No search for past recordings', symptom: 0, x: 250, y: 268 },
  { text: 'Onboarding skips key context', symptom: 1, x: 105, y: 318 },
  { text: 'CTA text is ambiguous', symptom: 2, x: 430, y: 295 },
  { text: 'No progress indicator in upload', symptom: 0, x: 348, y: 362 },
  { text: 'Errors don\'t explain next steps', symptom: 1, x: 165, y: 378 },
];

export function ProblemIcebergViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0);
  const [vs, setVs] = useState(0);
  const [vp, setVp] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0); setVs(0); setVp(0);
    const ts = [
      setTimeout(() => setStage(1), 400),
      setTimeout(() => setVs(1), 900), setTimeout(() => setVs(2), 1600), setTimeout(() => setVs(3), 2300),
      setTimeout(() => setStage(2), 3200), setTimeout(() => setStage(3), 4000),
      setTimeout(() => setVp(1), 4400), setTimeout(() => setVp(2), 5100),
      setTimeout(() => setVp(3), 5800), setTimeout(() => setVp(4), 6500), setTimeout(() => setVp(5), 7200),
    ];
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  const replay = () => { setStage(0); setVs(0); setVp(0); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>The Problem Iceberg — what users report vs what is actually broken</VizLabel>
      <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 12px 32px rgba(0,0,0,0.07)' }}>
        <svg viewBox="0 0 620 450" style={{ width: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DBEAFE" />
              <stop offset="100%" stopColor="#BFDBFE" />
            </linearGradient>
            <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E3A5F" />
              <stop offset="100%" stopColor="#0C1F33" />
            </linearGradient>
            <linearGradient id="iceAbove" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#DBEAFE" />
            </linearGradient>
            <linearGradient id="iceBelow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0.9" />
            </linearGradient>
            <filter id="dropShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.2)" />
            </filter>
          </defs>
          <rect x="0" y="0" width="620" height="180" fill="url(#sky)" />
          <rect x="0" y="180" width="620" height="270" fill="url(#ocean)" />
          {/* Wave */}
          <path d="M0 180 Q78 173 155 180 Q232 187 310 180 Q388 173 465 180 Q542 187 620 180 L620 192 Q542 199 465 192 Q388 185 310 192 Q232 199 155 192 Q78 185 0 192Z" fill="#3B82F6" opacity="0.55" />
          <text x="10" y="198" style={{ fontSize: '8px', fontFamily: 'JetBrains Mono, monospace', fill: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}>WATER SURFACE — WHAT USERS REPORT</text>
          {/* Iceberg above */}
          <polygon points="280,28 232,180 348,180" fill="url(#iceAbove)" stroke="#BFDBFE" strokeWidth="1.5" filter="url(#dropShadow)" />
          {/* Iceberg below */}
          <motion.path d="M232 180 Q172 228 150 280 Q132 330 165 368 Q200 400 290 408 Q370 402 408 368 Q438 328 425 278 Q405 226 348 180Z"
            fill="url(#iceBelow)" stroke="#2563EB" strokeWidth="1"
            initial={{ opacity: 0 }} animate={{ opacity: stage >= 2 ? 1 : 0 }} transition={{ duration: 0.9 }} />
          {/* HIDDEN label */}
          <motion.text x="310" y="438" textAnchor="middle"
            style={{ fontSize: '8px', fontFamily: 'JetBrains Mono, monospace', fill: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em' }}
            initial={{ opacity: 0 }} animate={{ opacity: stage >= 3 ? 1 : 0 }} transition={{ duration: 0.6 }}>
            HIDDEN ROOT PROBLEMS
          </motion.text>
          {/* Symptoms */}
          {SYMPTOMS.map((s, i) => (
            <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: i < vs ? 1 : 0, y: i < vs ? 0 : 8 }} transition={{ duration: 0.45 }}>
              <rect x={s.x - 90} y={s.y - 19} width="180" height="32" rx="9" fill="#FFFFFF" stroke="#6366F1" strokeWidth="2" filter="url(#dropShadow)" />
              <text x={s.x} y={s.y + 2} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '11px', fill: '#4338CA', fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>{s.text}</text>
            </motion.g>
          ))}
          {/* Root problems */}
          {ROOT_PROBLEMS.map((p, i) => (
            <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: i < vp ? 1 : 0 }} transition={{ duration: 0.45 }}>
              <line x1={SYMPTOMS[p.symptom].x} y1="180" x2={p.x} y2={p.y - 18} stroke="rgba(147,197,253,0.45)" strokeWidth="1.2" strokeDasharray="5 3" />
              <rect x={p.x - 118} y={p.y - 17} width="236" height="28" rx="7" fill="rgba(255,255,255,0.11)" stroke="rgba(147,197,253,0.55)" strokeWidth="1.2" />
              <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '10px', fill: '#BFDBFE', fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}>{p.text}</text>
            </motion.g>
          ))}
        </svg>
      </div>
      <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>Key insight:</strong> Every complaint is a symptom. The real problems live below the surface and only appear when you ask the right follow-up question.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 3. RICE 3D BUBBLE — light background, vivid popping spheres ───────────────

const RICE_FEATS = [
  { name: 'Search by date',       reach: 8.5, impact: 9.0, effort: 1.5, conf: 0.90, hex: '#22C55E', score: 0 },
  { name: 'Slack notifications',  reach: 7.0, impact: 7.0, effort: 2.0, conf: 0.80, hex: '#84CC16', score: 0 },
  { name: 'Onboarding redesign',  reach: 9.0, impact: 8.0, effort: 8.0, conf: 0.70, hex: '#F59E0B', score: 0 },
  { name: 'Dark mode',            reach: 8.0, impact: 3.0, effort: 2.0, conf: 0.95, hex: '#F97316', score: 0 },
  { name: 'CRM integration',      reach: 4.0, impact: 9.0, effort: 9.0, conf: 0.60, hex: '#EF4444', score: 0 },
  { name: 'Analytics dashboard',  reach: 3.0, impact: 8.0, effort: 7.0, conf: 0.65, hex: '#EF4444', score: 0 },
].map(f => ({ ...f, score: Math.round((f.reach * f.impact * f.conf) / f.effort) }));

function RiceSphere({ feat, index, started }: { feat: typeof RICE_FEATS[0]; index: number; started: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hov, setHov] = useState(false);
  const t = useRef(0);
  const radius = (1 / feat.effort) * 3.8 + 0.28;
  const target = new THREE.Vector3((feat.reach - 6) * 0.72, (feat.impact - 6) * 0.65, 0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (started && t.current < 1) t.current = Math.min(t.current + delta * 0.55, 1);
    const delay = index * 0.14;
    const prog = easeInOut(clamp((t.current - delay) / (1 - delay + 0.001), 0, 1));
    meshRef.current.position.lerp(target, prog * 0.18 + (prog > 0.98 ? 0.5 : 0));
    meshRef.current.position.y += Math.sin(Date.now() * 0.0009 + index * 1.3) * 0.0007;
    meshRef.current.rotation.y += delta * 0.35;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, hov ? 0.55 : 0.18, delta * 5);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} onPointerOver={() => setHov(true)} onPointerOut={() => setHov(false)}>
      <sphereGeometry args={[radius, 40, 40]} />
      <meshStandardMaterial color={feat.hex} emissive={feat.hex} emissiveIntensity={0.18} roughness={0.18} metalness={0.35} />
      {hov && (
        <Html distanceFactor={9} style={{ pointerEvents: 'none' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '10px 14px', fontSize: '11px', whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif', minWidth: '170px', boxShadow: '0 8px 28px rgba(0,0,0,0.18)', border: `2px solid ${feat.hex}` }}>
            <div style={{ fontWeight: 800, color: feat.hex, marginBottom: '5px', fontSize: '13px' }}>{feat.name}</div>
            <div style={{ color: '#374151' }}>Reach <strong>{feat.reach}</strong> · Impact <strong>{feat.impact}</strong></div>
            <div style={{ color: '#374151' }}>Effort <strong>{feat.effort}wk</strong> · Conf <strong>{Math.round(feat.conf * 100)}%</strong></div>
            <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: `1px solid ${feat.hex}40`, fontWeight: 800, color: feat.hex, fontSize: '14px' }}>RICE: {feat.score}</div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

function RiceAxes() {
  return (
    <group>
      <mesh position={[0, -3.5, 0]}>
        <boxGeometry args={[9, 0.025, 0.025]} />
        <meshBasicMaterial color="#94A3B8" />
      </mesh>
      <mesh position={[-4.3, 0, 0]}>
        <boxGeometry args={[0.025, 8, 0.025]} />
        <meshBasicMaterial color="#94A3B8" />
      </mesh>
      {[-2,-1,0,1,2].map(i => (
        <group key={i}>
          <mesh position={[i * 1.45, 0, 0]}><boxGeometry args={[0.014, 7.2, 0.014]} /><meshBasicMaterial color="#CBD5E1" /></mesh>
          <mesh position={[0, i * 1.1, 0]}><boxGeometry args={[8.5, 0.014, 0.014]} /><meshBasicMaterial color="#CBD5E1" /></mesh>
        </group>
      ))}
      <Html position={[5.2, -3.5, 0]} style={{ color: '#64748B', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', fontWeight: 700 }}>REACH →</Html>
      <Html position={[-4.3, 4.6, 0]} style={{ color: '#64748B', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', fontWeight: 700 }}>↑ IMPACT</Html>
      <Html position={[0.5, -4.8, 0]} style={{ color: '#94A3B8', fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>sphere size = 1/effort · opacity = confidence</Html>
    </group>
  );
}

function RiceScene({ started }: { started: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={50} />
      <ambientLight intensity={0.9} color="#FFFFFF" />
      <directionalLight position={[8, 10, 8]} intensity={1.4} />
      <pointLight position={[-6, 6, 4]} intensity={0.6} color="#6366F1" />
      <pointLight position={[6, -4, 4]} intensity={0.5} color="#22C55E" />
      <RiceAxes />
      {RICE_FEATS.map((f, i) => <RiceSphere key={i} feat={f} index={i} started={started} />)}
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export function RICEBubble3D() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [started, setStarted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(t);
  }, [inView, tick]);

  const replay = () => { setStarted(false); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>RICE Priority Space — 3D · hover any feature to inspect its score</VizLabel>
      <div style={{
        borderRadius: '20px', overflow: 'hidden', height: '480px',
        background: 'linear-gradient(160deg, #F8F6F1 0%, #EEE9DF 100%)',
        border: '1px solid var(--ed-rule)',
        boxShadow: '0 20px 48px rgba(0,0,0,0.09)',
      }}>
        <Suspense fallback={<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ed-ink3)', fontFamily: 'monospace', fontSize: '12px' }}>Loading 3D scene…</div>}>
          <Canvas gl={{ antialias: true, alpha: false }} style={{ background: 'transparent' }}>
            <color attach="background" args={['#F8F6F1']} />
            <RiceScene started={started} />
          </Canvas>
        </Suspense>
      </div>
      <div style={{ marginTop: '12px', display: 'flex', gap: '18px', flexWrap: 'wrap' as const }}>
        {[{ hex: '#22C55E', label: 'High RICE — ship first' }, { hex: '#F59E0B', label: 'Medium — worth discussing' }, { hex: '#EF4444', label: 'Low RICE — defer or kill' }].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.hex, boxShadow: `0 0 6px ${item.hex}80` }} />
            <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{item.label}</span>
          </div>
        ))}
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 4. LOCAL MAXIMA TERRAIN ───────────────────────────────────────────────────

function terrainH(x: number, z: number) {
  const lo = 3.8 * Math.exp(-((x + 2.8) ** 2 + z ** 2) / 1.4);
  const hi = 6.2 * Math.exp(-((x - 2.6) ** 2 + z ** 2) / 1.8);
  return lo + hi - 0.003 * (x * x + z * z);
}

function TerrainMesh() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(16, 16, 120, 120);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setZ(i, terrainH(pos.getX(i), pos.getY(i)));
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial color="#1E3A5C" roughness={0.82} metalness={0.18} />
    </mesh>
  );
}

const BALL_WP = [{ x: -6, z: 0, t: 0 }, { x: -2.8, z: 0, t: 3.5 }, { x: -2.8, z: 0, t: 1.5 }, { x: 0.1, z: 0, t: 2.5 }, { x: 2.6, z: 0, t: 3.5 }];

function RollingBall({ elapsed }: { elapsed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    let cum = 0, x = BALL_WP[0].x, z = BALL_WP[0].z;
    for (let i = 0; i < BALL_WP.length - 1; i++) {
      const seg = BALL_WP[i + 1].t;
      if (elapsed <= cum + seg) {
        const p = easeInOut((elapsed - cum) / seg);
        x = THREE.MathUtils.lerp(BALL_WP[i].x, BALL_WP[i + 1].x, p);
        z = THREE.MathUtils.lerp(BALL_WP[i].z, BALL_WP[i + 1].z, p);
        break;
      }
      cum += seg; x = BALL_WP[i + 1].x; z = BALL_WP[i + 1].z;
    }
    ref.current.position.set(x, terrainH(x, z) + 0.32, z);
  });
  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.32, 32, 32]} />
      <meshStandardMaterial color="#FF4444" metalness={0.8} roughness={0.15} emissive="#CC0000" emissiveIntensity={0.4} />
    </mesh>
  );
}

function LMAnnotations({ elapsed }: { elapsed: number }) {
  return (
    <>
      {elapsed >= 3.5 && (
        <Html position={[-2.8, terrainH(-2.8, 0) + 1.3, 0]} center>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: '#EF4444', color: '#fff', borderRadius: '8px', padding: '7px 13px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', fontWeight: 800, boxShadow: '0 4px 18px rgba(239,68,68,0.6)' }}>
            ⚠ Local maximum<div style={{ fontSize: '9px', fontWeight: 400, opacity: 0.85, marginTop: '2px' }}>You think you&apos;re done.</div>
          </motion.div>
        </Html>
      )}
      {elapsed >= 7 && (
        <Html position={[2.6, terrainH(2.6, 0) + 1.5, 0]} center>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: '#22C55E', color: '#fff', borderRadius: '8px', padding: '7px 13px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', fontWeight: 800, boxShadow: '0 4px 18px rgba(34,197,94,0.6)' }}>
            ✓ Higher opportunity<div style={{ fontSize: '9px', fontWeight: 400, opacity: 0.85, marginTop: '2px' }}>Required going back down first.</div>
          </motion.div>
        </Html>
      )}
    </>
  );
}

function LMScene({ elapsed }: { elapsed: number }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[-1, 9, 14]} fov={42} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[8, 12, 6]} intensity={1.2} castShadow />
      <pointLight position={[-6, 6, 2]} intensity={0.6} color="#3B82F6" />
      <pointLight position={[5, 8, 2]} intensity={0.5} color="#22C55E" />
      <TerrainMesh />
      <RollingBall elapsed={elapsed} />
      <LMAnnotations elapsed={elapsed} />
      <OrbitControls enablePan={false} enableZoom={false} />
    </>
  );
}

export function LocalMaximaScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const startT = useRef<number | null>(null);
  const raf = useRef(0);
  const totalDur = BALL_WP.reduce((s, p) => s + p.t, 0);

  useEffect(() => {
    if (!inView) return;
    const d = setTimeout(() => setRunning(true), 600);
    return () => clearTimeout(d);
  }, [inView, tick]);

  useEffect(() => {
    if (!running) return;
    startT.current = performance.now() / 1000;
    const loop = () => {
      const t = Math.min(performance.now() / 1000 - (startT.current ?? 0), totalDur);
      setElapsed(t);
      if (t < totalDur) raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [running, totalDur]);

  const replay = () => { setElapsed(0); setRunning(false); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>PMF Local Maxima — 3D terrain · auto-animated</VizLabel>
      <div style={{ borderRadius: '20px', overflow: 'hidden', background: 'linear-gradient(180deg, #06101A 0%, #0A1929 100%)', border: '1px solid rgba(59,130,246,0.2)', height: '420px', boxShadow: '0 24px 48px rgba(0,0,0,0.35)' }}>
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: '12px' }}>Loading terrain…</div>}>
          <Canvas shadows>
            <LMScene elapsed={elapsed} />
          </Canvas>
        </Suspense>
      </div>
      <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#EF4444' }}>The trap:</strong> Your product is optimized — for the wrong peak. Reaching the real opportunity requires going back down first. Most teams don&apos;t, because it looks like regression.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 5. METRICS CASCADE — solid bold redesign ──────────────────────────────────
// Fully opaque cards, thick lines, vivid colours. Builds top-down then pulses up.

const NODES = {
  root: { label: 'Coaching ROI', sub: 'NORTH STAR', color: '#6366F1', x: 300, y: 44, w: 180, h: 46 },
  mid: [
    { label: 'Onboarding',    sub: 'LEADING', color: '#0EA5E9', x: 95,  y: 168, w: 144, h: 40 },
    { label: 'Session depth', sub: 'LEADING', color: '#0EA5E9', x: 300, y: 168, w: 144, h: 40 },
    { label: 'Skill scores',  sub: 'LEADING', color: '#0EA5E9', x: 505, y: 168, w: 144, h: 40 },
  ],
  leaves: [
    { label: 'Step completion',  color: '#22C55E', parentIdx: 0, x: 37,  y: 296, w: 130, h: 34 },
    { label: 'Time-to-activate', color: '#22C55E', parentIdx: 0, x: 155, y: 296, w: 130, h: 34 },
    { label: 'Call duration',    color: '#22C55E', parentIdx: 1, x: 247, y: 296, w: 120, h: 34 },
    { label: 'Replay rate',      color: '#22C55E', parentIdx: 1, x: 352, y: 296, w: 120, h: 34 },
    { label: 'Pre-score',        color: '#22C55E', parentIdx: 2, x: 448, y: 296, w: 112, h: 34 },
    { label: 'Post-score',       color: '#22C55E', parentIdx: 2, x: 556, y: 296, w: 112, h: 34 },
  ],
};

export function MetricsCascadeAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0); setPulse(false);
    const ts = [
      setTimeout(() => setStage(1), 400),
      setTimeout(() => setStage(2), 1300),
      setTimeout(() => setStage(3), 2200),
      setTimeout(() => setStage(4), 3100),
      setTimeout(() => setStage(5), 4000),
      setTimeout(() => setPulse(true), 5100),
    ];
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  const replay = () => { setStage(0); setPulse(false); setTick(t => t + 1); };

  const r = NODES.root, mids = NODES.mid, leaves = NODES.leaves;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>North Star Metrics Cascade — builds on scroll</VizLabel>
      <div style={{
        borderRadius: '20px', border: '1px solid var(--ed-rule)',
        background: 'var(--ed-card)', padding: '28px 20px 22px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        <svg viewBox="0 0 600 340" style={{ width: '100%', overflow: 'visible' }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="cardShadow">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.12)" />
            </filter>
          </defs>

          {/* Lines root → mid */}
          {mids.map((m, i) => (
            <motion.line key={i}
              x1={r.x} y1={r.y + r.h / 2} x2={m.x} y2={m.y - m.h / 2}
              stroke={r.color} strokeWidth="2.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: stage >= 2 ? 1 : 0, opacity: stage >= 2 ? 0.8 : 0 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            />
          ))}

          {/* Lines mid → leaves */}
          {leaves.map((l, i) => (
            <motion.line key={i}
              x1={mids[l.parentIdx].x} y1={mids[l.parentIdx].y + mids[l.parentIdx].h / 2}
              x2={l.x} y2={l.y - l.h / 2}
              stroke={mids[0].color} strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: stage >= 4 ? 1 : 0, opacity: stage >= 4 ? 0.65 : 0 }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            />
          ))}

          {/* Pulse dots traveling upward */}
          {pulse && leaves.map((l, i) => {
            const parent = mids[l.parentIdx];
            return (
              <motion.circle key={`p${i}`} r="5"
                cx={l.x} cy={l.y - l.h / 2}
                fill={l.color}
                animate={{
                  cx: [l.x, parent.x, r.x],
                  cy: [l.y - l.h / 2, parent.y - parent.h / 2, r.y + r.h / 2],
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{ duration: 1.8, delay: (i % 3) * 0.35, repeat: Infinity, repeatDelay: 1.2 }}
              />
            );
          })}

          {/* Root node */}
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: stage >= 1 ? 1 : 0, scale: stage >= 1 ? 1 : 0.7 }} transition={{ duration: 0.5 }}>
            <rect x={r.x - r.w / 2} y={r.y - r.h / 2} width={r.w} height={r.h} rx="12" fill={r.color} filter="url(#cardShadow)" />
            <rect x={r.x - r.w / 2} y={r.y - r.h / 2} width={r.w} height="5" rx="3" fill="rgba(255,255,255,0.3)" />
            <text x={r.x} y={r.y - 4} textAnchor="middle" style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.75)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.14em' }}>{r.sub}</text>
            <text x={r.x} y={r.y + 12} textAnchor="middle" style={{ fontSize: '14px', fill: '#FFFFFF', fontWeight: 800, fontFamily: 'system-ui, sans-serif' }}>{r.label}</text>
          </motion.g>

          {/* Mid nodes */}
          {mids.map((m, i) => (
            <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 10 }} transition={{ duration: 0.45, delay: i * 0.1 }}>
              <rect x={m.x - m.w / 2} y={m.y - m.h / 2} width={m.w} height={m.h} rx="10" fill={m.color} filter="url(#cardShadow)" />
              <rect x={m.x - m.w / 2} y={m.y - m.h / 2} width={m.w} height="4" rx="2" fill="rgba(255,255,255,0.3)" />
              <text x={m.x} y={m.y - 3} textAnchor="middle" style={{ fontSize: '7px', fill: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em' }}>{m.sub}</text>
              <text x={m.x} y={m.y + 11} textAnchor="middle" style={{ fontSize: '12px', fill: '#FFFFFF', fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>{m.label}</text>
            </motion.g>
          ))}

          {/* Leaf nodes */}
          {leaves.map((l, i) => (
            <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: stage >= 5 ? 1 : 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
              <rect x={l.x - l.w / 2} y={l.y - l.h / 2} width={l.w} height={l.h} rx="8" fill={l.color} filter="url(#cardShadow)" />
              <text x={l.x} y={l.y + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '9px', fill: '#FFFFFF', fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>{l.label}</text>
            </motion.g>
          ))}
        </svg>

        {pulse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', marginTop: '6px', fontSize: '11px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>
            ↑ operational data flows upward to the north star
          </motion.div>
        )}
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 6. GUARDRAIL DASHBOARD ────────────────────────────────────────────────────

const WKCOUNT = 14;
function series(start: number, end: number, noise = 0.05) {
  return Array.from({ length: WKCOUNT }, (_, i) => {
    const t = i / (WKCOUNT - 1);
    return (start + (end - start) * t) * (1 + (Math.random() - 0.5) * noise);
  });
}

const GD = {
  ns:      series(1.1, 2.4, 0.03),
  nps:     series(74, 44, 0.04),
  tickets: series(140, 380, 0.06),
  churn:   series(5.2, 14.8, 0.05),
};

function Sparkline({ values, week, color, alert }: { values: number[]; week: number; color: string; alert: boolean }) {
  const vis = values.slice(0, week + 1);
  const mn = Math.min(...values), mx = Math.max(...values);
  const W = 160, H = 48;
  const pt = (v: number, i: number) => `${(i / (WKCOUNT - 1)) * W},${H - ((v - mn) / (mx - mn + 0.001)) * H}`;
  const pts = vis.map((v, i) => pt(v, i)).join(' ');
  const area = vis.map((v, i) => pt(v, i)).join(' ') + ` ${((vis.length - 1) / (WKCOUNT - 1)) * W},${H} 0,${H}`;
  const lx = ((vis.length - 1) / (WKCOUNT - 1)) * W;
  const ly = H - ((vis[vis.length - 1] - mn) / (mx - mn + 0.001)) * H;
  const c = alert ? '#EF4444' : color;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={`g${c.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      {vis.length > 1 && <>
        <polygon points={area} fill={`url(#g${c.replace('#', '')})`} />
        <polyline points={pts} fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </>}
      {vis.length > 0 && <circle cx={lx} cy={ly} r="4" fill={c} />}
    </svg>
  );
}

export function GuardrailDashboardAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [week, setWeek] = useState(-1);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setWeek(-1);
    let i = 0;
    const iv = setInterval(() => { i++; setWeek(i); if (i >= WKCOUNT - 1) clearInterval(iv); }, 340);
    return () => clearInterval(iv);
  }, [inView, tick]);

  const replay = () => { setWeek(-1); setTick(t => t + 1); };
  const w = Math.max(0, week);
  const npsAlert = w >= 6 && GD.nps[w] < 60;
  const tickAlert = w >= 5 && GD.tickets[w] > 250;
  const churnAlert = w >= 6 && GD.churn[w] > 10;
  const anyAlert = npsAlert || tickAlert || churnAlert;

  const panels = [
    { key: 'ns' as const,      label: 'Sessions / user',   sub: 'NORTH STAR',  color: '#6366F1', alert: false,       fmt: (v: number) => v.toFixed(1) + 'x' },
    { key: 'nps' as const,     label: 'NPS',               sub: 'GUARDRAIL',   color: '#0EA5E9', alert: npsAlert,    fmt: (v: number) => Math.round(v).toString() },
    { key: 'tickets' as const, label: 'Support tickets/wk',sub: 'GUARDRAIL',   color: '#F97316', alert: tickAlert,   fmt: (v: number) => Math.round(v).toString() },
    { key: 'churn' as const,   label: 'Month-1 churn',     sub: 'GUARDRAIL',   color: '#22C55E', alert: churnAlert,  fmt: (v: number) => v.toFixed(1) + '%' },
  ];

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Guardrail Metrics Dashboard — {WKCOUNT} weeks · auto-animated</VizLabel>
      <div style={{ borderRadius: '20px', background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', padding: '22px', boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>EdSpark · Q2 Product Dashboard</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.55)', padding: '3px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            Week {Math.min(w + 1, WKCOUNT)} / {WKCOUNT}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {panels.map(p => {
            const val = w >= 0 ? GD[p.key][w] : GD[p.key][0];
            return (
              <motion.div key={p.key}
                animate={{ borderColor: p.alert ? 'rgba(239,68,68,0.55)' : 'rgba(255,255,255,0.07)', background: p.alert ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)' }}
                style={{ borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.07)', transition: 'background 0.5s, border-color 0.5s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: p.alert ? '#EF4444' : 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', fontWeight: p.alert ? 800 : 400, marginBottom: '3px' }}>
                      {p.sub}{p.alert ? ' ⚠' : ''}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>{p.label}</div>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", color: p.alert ? '#EF4444' : p.color }}>{p.fmt(val)}</div>
                </div>
                <div style={{ height: '52px' }}>
                  <Sparkline values={GD[p.key]} week={w} color={p.color} alert={p.alert} />
                </div>
              </motion.div>
            );
          })}
        </div>
        <AnimatePresence>
          {anyAlert && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: '18px', padding: '14px 18px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderLeft: '4px solid #EF4444' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#EF4444', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '6px' }}>⚠ GUARDRAILS FAILING</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>North star is rising. NPS dropping. Support overwhelmed. Churn climbing. Users are more &ldquo;active&rdquo; and less satisfied. <strong style={{ color: '#FBBF24' }}>The north star is lying.</strong></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>Guardrail metrics</strong> catch exactly this: the primary metric optimizes in a way that quietly destroys real value. Without guardrails, you&apos;d celebrate a worsening product.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

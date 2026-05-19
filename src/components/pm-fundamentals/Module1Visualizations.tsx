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

// ─── 1. UDBM LOOP — Scenario-driven 4-scene sprint story ─────────────────────
// Shows ONE real EdSpark sprint played out across the 4 phases.
// The visual teaches through what Priya actually did, not abstract labels.

const SPRINT_SCENES = [
  {
    num: '01', label: 'Understand',
    question: 'What problem are we actually solving?',
    color: '#6366F1', dark: '#3730A3', light: '#EEF2FF',
    situation: 'Monday, 9am. An email arrives from a churned customer: "The app is confusing. I can never find what I need."',
    action: 'Priya doesn\'t open Figma. She calls the customer directly. "What were you trying to do when it felt confusing?" — "I was looking for my call recording from last Tuesday. I had to scroll through 40 sessions to find it."',
    insight: 'It\'s not a navigation problem. It\'s a retrieval problem. No search exists.',
    outcome: '🎯 Root cause found in 15 minutes. Zero engineering time spent.',
    nextLabel: 'Now she can decide what to build.',
  },
  {
    num: '02', label: 'Decide',
    question: 'What should we build — and why now?',
    color: '#0EA5E9', dark: '#0369A1', light: '#F0F9FF',
    situation: 'Tuesday planning. Two options on the table: (A) Full navigation redesign — 3 weeks, high risk. (B) Search with date filter — 3 days, low risk.',
    action: 'Kiran pulls the data: 43% of managers never clicked a call recording in week 1. The reason, from interviews: "Too hard to find the one I want." Confidence: high. Priya picks Option B.',
    insight: 'Highest impact, lowest effort. The data and the research agree.',
    outcome: '✅ Decision made. Team aligned. Sprint planned in 30 minutes.',
    nextLabel: 'Time to build — carefully.',
  },
  {
    num: '03', label: 'Build',
    question: 'Is everyone building the same thing?',
    color: '#F97316', dark: '#C2410C', light: '#FFF7ED',
    situation: 'Wednesday, sprint start. The spec says "share results." Dev reads it as "add a copy-link button."',
    action: 'Priya spots the ambiguity before a single line of code is written. "How do managers normally share results — a link, or Slack?" Dev: "Oh, Slack." Five-minute conversation. Correct feature built from day one.',
    insight: 'That 5-minute conversation saved 4 days of rework.',
    outcome: '🚀 Search with Slack integration shipped in 3 days. Zero rework.',
    nextLabel: 'Now check if it actually worked.',
  },
  {
    num: '04', label: 'Measure',
    question: 'Did it work? What do we do next?',
    color: '#22C55E', dark: '#15803D', light: '#F0FDF4',
    situation: 'Week 2 post-launch. Kiran sends the cohort data: managers who used search vs those who didn\'t.',
    action: 'Managers who used search: 78% retained at week 2. Managers who didn\'t: 34%. The delta is clear. But: 40% of managers haven\'t discovered search at all — they don\'t know it exists.',
    insight: 'The feature works. The problem is discoverability — a new problem.',
    outcome: '↻ Loop begins again. Next sprint: Understand why 40% haven\'t found search.',
    nextLabel: 'Back to Understand. One level deeper.',
  },
];

export function UDBMLoopAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(-1);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setActive(0);
    const iv = setInterval(() => setActive(a => (a + 1) % 4), 5500);
    return () => clearInterval(iv);
  }, [inView, tick]);

  const replay = () => { setActive(-1); setTimeout(() => setActive(0), 100); setTick(t => t + 1); };
  const scene = active >= 0 ? SPRINT_SCENES[active] : null;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>The PM Operating Loop — one EdSpark sprint, four phases</VizLabel>

      <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 16px 48px rgba(0,0,0,0.07)' }}>

        {/* ── Phase selector tabs ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid var(--ed-rule)' }}>
          {SPRINT_SCENES.map((s, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: '14px 0', border: 'none', cursor: 'pointer',
              background: active === i ? s.color : 'var(--ed-card)',
              borderRight: i < 3 ? '1px solid var(--ed-rule)' : 'none',
              transition: 'background 0.35s',
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, letterSpacing: '0.14em', color: active === i ? 'rgba(255,255,255,0.7)' : 'var(--ed-ink3)', marginBottom: '4px' }}>{s.num}</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: active === i ? '#FFFFFF' : 'var(--ed-ink2)', transition: 'color 0.35s' }}>{s.label}</div>
              {active === i && (
                <motion.div layoutId="tab-indicator"
                  style={{ width: '24px', height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.6)', margin: '6px auto 0' }} />
              )}
            </button>
          ))}
        </div>

        {/* ── Scene content ── */}
        <AnimatePresence mode="wait">
          {scene && (
            <motion.div key={scene.num}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.38 }}
              style={{ background: 'var(--ed-card)' }}
            >
              {/* Colored header band */}
              <div style={{
                padding: '22px 28px',
                background: `linear-gradient(135deg, ${scene.color} 0%, ${scene.dark} 100%)`,
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.2em', marginBottom: '6px' }}>PHASE {scene.num} · {scene.label.toUpperCase()}</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2, textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>{scene.question}</div>
              </div>

              {/* Story body */}
              <div style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Left: situation + action */}
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: scene.color, letterSpacing: '0.14em', marginBottom: '8px' }}>THE SITUATION</div>
                  <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75, marginBottom: '16px', fontStyle: 'italic' }}>{scene.situation}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: scene.color, letterSpacing: '0.14em', marginBottom: '8px' }}>WHAT PRIYA DID</div>
                  <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.75 }}>{scene.action}</div>
                </div>

                {/* Right: insight + outcome */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
                  <div style={{ padding: '16px 18px', borderRadius: '12px', background: `${scene.color}18`, border: `1.5px solid ${scene.color}40`, borderLeft: `4px solid ${scene.color}` }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: scene.color, letterSpacing: '0.14em', marginBottom: '7px' }}>THE TURN</div>
                    <div style={{ fontSize: '13px', color: 'var(--ed-ink)', fontWeight: 600, lineHeight: 1.65 }}>{scene.insight}</div>
                  </div>
                  <div style={{ padding: '16px 18px', borderRadius: '12px', background: `${scene.color}14`, border: `1.5px solid ${scene.color}35` }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: scene.color, letterSpacing: '0.14em', marginBottom: '7px' }}>OUTCOME</div>
                    <div style={{ fontSize: '13px', color: scene.color, fontWeight: 700, lineHeight: 1.65 }}>{scene.outcome}</div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic', lineHeight: 1.6, paddingTop: '4px' }}>
                    → {scene.nextLabel}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ display: 'flex', gap: '0', borderTop: '1px solid var(--ed-rule)' }}>
                {SPRINT_SCENES.map((s, i) => (
                  <div key={i} style={{ flex: 1, height: '4px', background: i <= active ? s.color : 'transparent', transition: 'background 0.4s', borderRight: i < 3 ? '1px solid var(--ed-rule)' : 'none' }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          <div style={{ background: 'var(--ed-card)', borderRadius: '10px', padding: '10px 14px', fontSize: '11px', whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif', minWidth: '170px', boxShadow: '0 8px 28px rgba(0,0,0,0.18)', border: `2px solid ${feat.hex}` }}>
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
      <Html position={[5.2, -3.5, 0]} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', fontWeight: 700 }}>REACH →</Html>
      <Html position={[-4.3, 4.6, 0]} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', fontWeight: 700 }}>↑ IMPACT</Html>
      <Html position={[0.5, -4.8, 0]} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>sphere size = 1/effort · opacity = confidence</Html>
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
        background: '#0F172A',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
      }}>
        <Suspense fallback={<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', fontSize: '12px' }}>Loading 3D scene…</div>}>
          <Canvas gl={{ antialias: true, alpha: false }} style={{ background: 'transparent' }}>
            <color attach="background" args={['#0F172A']} />
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

// ─── 4. LOCAL MAXIMA · 2D STRATEGY LANDSCAPE ──────────────────────────────────
// Side-view cross-section of two product directions as peaks. Current product
// sits on a small local-max peak; real PMF is a taller peak across a valley.
// A red marker shows "you are here", an orange descent arrow goes through the
// valley, a green climb arrow reaches the higher peak. Teaches: reaching real
// PMF often requires descending first — which looks like regression and is why
// most teams stay stuck.

export function LocalMaximaScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0);
    const ts = [1,2,3,4,5,6].map((s, i) => setTimeout(() => setStage(s), 400 + i * 850));
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>PMF Local Maxima — strategy landscape</VizLabel>
      <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.12)' }}>
        <svg viewBox="0 0 720 460" style={{ width: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="lm-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FCE7BB" /><stop offset="60%" stopColor="#F8DAA8" /><stop offset="100%" stopColor="#F0C588" />
            </linearGradient>
            <linearGradient id="lm-mountain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E3A8A" /><stop offset="65%" stopColor="#1E1B4B" /><stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="lm-mountainBack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.45" /><stop offset="100%" stopColor="#3730A3" stopOpacity="0.6" />
            </linearGradient>
            <radialGradient id="lm-sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE9B0" /><stop offset="50%" stopColor="#FFD080" /><stop offset="100%" stopColor="#FFD080" stopOpacity="0" />
            </radialGradient>
            <filter id="lm-soft"><feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="rgba(0,0,0,0.15)"/></filter>
          </defs>

          {/* Sky */}
          <rect width="720" height="460" fill="url(#lm-sky)" />

          {/* Sun glow behind right (taller) peak */}
          <circle cx="600" cy="120" r="84" fill="url(#lm-sun)" />
          <circle cx="600" cy="120" r="30" fill="#FFE9B0" opacity="0.85" />

          {/* Distant violet mountain range silhouette */}
          <path d="M 0 320 L 70 270 L 140 295 L 200 250 L 280 280 L 360 240 L 440 270 L 520 230 L 600 260 L 700 235 L 720 240 L 720 460 L 0 460 Z"
                fill="url(#lm-mountainBack)" />

          {/* Y-axis dotted reference line */}
          <line x1="56" y1="60" x2="56" y2="420" stroke="#5B4423" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.35" />
          <text x="20" y="40" style={{ fontSize: '10px', fill: '#5B4423', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', fontWeight: 800 }}>↑ VALUE</text>
          <text x="700" y="448" textAnchor="end" style={{ fontSize: '10px', fill: '#5B4423', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', fontWeight: 800 }}>PRODUCT DIRECTION →</text>

          {/* Foreground terrain — TWO peaks clearly visible */}
          <motion.path
            d="M 0 400
               C 40 400, 90 340, 130 280
               C 160 230, 200 200, 250 230
               C 280 250, 310 290, 360 320
               C 390 340, 420 345, 460 335
               C 500 320, 540 250, 580 140
               C 605 80, 640 60, 670 80
               C 695 100, 710 200, 720 320
               L 720 460 L 0 460 Z"
            fill="url(#lm-mountain)"
            initial={{ opacity: 0 }} animate={{ opacity: stage >= 1 ? 1 : 0 }} transition={{ duration: 0.8 }}
          />

          {/* Topography elevation lines on the terrain */}
          {[
            { d: "M 90 372 C 145 320, 215 280, 275 290 C 320 305, 360 345, 460 360 C 540 360, 600 200, 680 140", op: 0.18 },
            { d: "M 110 350 C 165 300, 230 250, 285 265 C 330 275, 380 320, 470 340 C 540 340, 615 175, 690 115", op: 0.14 },
            { d: "M 130 325 C 180 280, 240 225, 290 240 C 335 250, 385 295, 475 320 C 540 320, 625 150, 695 95",  op: 0.10 },
          ].map((line, i) => (
            <motion.path key={i} d={line.d} fill="none" stroke="rgba(186,230,253,0.8)" strokeWidth="0.7" strokeDasharray="2 2" opacity={line.op}
              initial={{ opacity: 0 }} animate={{ opacity: stage >= 1 ? line.op : 0 }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
            />
          ))}

          {/* === LEFT PEAK · CURRENT PRODUCT === */}
          {/* Ball on small peak with "You are here" flag */}
          {stage >= 2 && (
            <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
              <line x1="240" y1="208" x2="240" y2="172" stroke="#EF4444" strokeWidth="1.5" />
              <rect x="182" y="148" width="116" height="22" rx="4" fill="#EF4444" filter="url(#lm-soft)" />
              <text x="240" y="162" textAnchor="middle" style={{ fontSize: '9.5px', fill: '#FFF', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', fontWeight: 800 }}>YOU ARE HERE</text>
              <circle cx="240" cy="208" r="9" fill="#EF4444" stroke="#FFF" strokeWidth="2" filter="url(#lm-soft)" />
              <circle cx="237" cy="206" r="2.5" fill="rgba(255,255,255,0.6)" />
            </motion.g>
          )}

          {/* Left peak label card */}
          {stage >= 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <rect x="84" y="276" width="184" height="68" rx="8" fill="#FFFFFF" stroke="#EF4444" strokeWidth="1.2" filter="url(#lm-soft)" />
              <rect x="84" y="276" width="184" height="4" rx="2" fill="#EF4444" />
              <text x="94" y="298" style={{ fontSize: '8.5px', fill: '#DC2626', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.16em', fontWeight: 800 }}>LOCAL MAXIMUM</text>
              <text x="94" y="316" style={{ fontSize: '12px', fill: '#1F2937', fontFamily: "Georgia, serif", fontWeight: 800 }}>Sales Coaching v1</text>
              <text x="94" y="332" style={{ fontSize: '9.5px', fill: '#6B7280', fontFamily: "system-ui" }}>$2.4M ARR · 11% MoM · stalling</text>
            </motion.g>
          )}

          {/* === PATH ARROW: DESCEND into the valley === */}
          {stage >= 4 && (
            <>
              <motion.path
                d="M 248 218 Q 320 280, 400 348 Q 450 360, 510 320"
                stroke="#F97316" strokeWidth="2.8" strokeDasharray="6 4" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              {/* Down-arrow icons along the descent */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}>
                <polygon points="340,290 348,290 344,302" fill="#F97316" />
                <polygon points="410,348 418,348 414,360" fill="#F97316" />
              </motion.g>
              {/* Valley warning card */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}>
                <rect x="332" y="372" width="208" height="48" rx="6" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1" filter="url(#lm-soft)" />
                <rect x="332" y="372" width="3" height="48" fill="#EF4444" />
                <text x="344" y="390" style={{ fontSize: '8.5px', fill: '#DC2626', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', fontWeight: 800 }}>THE VALLEY · MOST TEAMS QUIT HERE</text>
                <text x="344" y="406" style={{ fontSize: '10px', fill: '#7F1D1D', fontFamily: "system-ui", fontStyle: 'italic' }}>{'“'}but this feels like regression…{'”'}</text>
              </motion.g>
            </>
          )}

          {/* === PATH ARROW: CLIMB to taller peak === */}
          {stage >= 5 && (
            <>
              <motion.path
                d="M 510 320 Q 555 220, 605 138"
                stroke="#22C55E" strokeWidth="2.8" strokeDasharray="6 4" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: 'easeOut' }}
              />
              {/* Up-arrow chevrons */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}>
                <polygon points="563,228 571,228 567,216" fill="#22C55E" />
                <polygon points="600,150 608,150 604,138" fill="#22C55E" />
              </motion.g>
            </>
          )}

          {/* === RIGHT PEAK · REAL OPPORTUNITY === */}
          {stage >= 6 && (
            <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Star marker on summit */}
              <g transform="translate(620, 70)">
                <polygon points="0,-13 4,-4 14,-4 6,3 9,13 0,8 -9,13 -6,3 -14,-4 -4,-4" fill="#22C55E" stroke="#FFF" strokeWidth="1.5" filter="url(#lm-soft)" />
              </g>
              {/* REAL PMF flag pole */}
              <line x1="620" y1="70" x2="620" y2="36" stroke="#22C55E" strokeWidth="1.5" />
              <rect x="558" y="14" width="124" height="22" rx="4" fill="#22C55E" filter="url(#lm-soft)" />
              <text x="620" y="28" textAnchor="middle" style={{ fontSize: '9.5px', fill: '#FFF', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', fontWeight: 800 }}>REAL PMF · PEAK</text>
              {/* Right peak label card */}
              <rect x="452" y="150" width="200" height="68" rx="8" fill="#FFFFFF" stroke="#22C55E" strokeWidth="1.2" filter="url(#lm-soft)" />
              <rect x="452" y="150" width="200" height="4" rx="2" fill="#22C55E" />
              <text x="462" y="172" style={{ fontSize: '8.5px', fill: '#15803D', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.16em', fontWeight: 800 }}>HIGHER OPPORTUNITY</text>
              <text x="462" y="190" style={{ fontSize: '12px', fill: '#1F2937', fontFamily: "Georgia, serif", fontWeight: 800 }}>Team Workspace</text>
              <text x="462" y="206" style={{ fontSize: '9.5px', fill: '#6B7280', fontFamily: "system-ui" }}>$8M ARR potential · viral loop</text>
            </motion.g>
          )}
        </svg>
      </div>
      <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#EF4444' }}>The trap:</strong> Your product is optimised — for the wrong peak. Reaching the real opportunity requires going back down first. Most teams don&apos;t, because it looks like regression.
      </div>
      <ReplayBtn onReplay={() => { setStage(0); setTick(t => t + 1); }} />
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
  // Fixed seed pattern to avoid hydration mismatch — deterministic noise from index
  return Array.from({ length: WKCOUNT }, (_, i) => {
    const t = i / (WKCOUNT - 1);
    const deterministicNoise = ((i * 7 + 3) % 11 - 5) / 100 * noise * 10;
    return (start + (end - start) * t) * (1 + deterministicNoise);
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

'use client';

import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ─── Shared helpers ────────────────────────────────────────────────────────────

const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function ReplayBtn({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.button
      onClick={onReplay}
      whileHover={{ opacity: 0.8, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      style={{
        marginTop: '14px', padding: '6px 18px', borderRadius: '8px', cursor: 'pointer',
        background: 'transparent', border: '1px solid var(--ed-rule)',
        fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
        color: 'var(--ed-ink3)', letterSpacing: '0.08em',
      }}
    >
      ↺ replay
    </motion.button>
  );
}

// ─── 1. UNDERSTAND → DECIDE → BUILD → MEASURE LOOP ────────────────────────────
// Auto-animated circular loop showing the PM's core operating cycle.
// Each phase lights up in sequence with detailed sub-labels and connecting arrows.

const UDBM_PHASES = [
  {
    id: 'understand', label: 'Understand', num: '01',
    sub: 'What problem are we actually solving?',
    detail: 'Talk to users. Read the data. Define the problem before any solution is discussed.',
    color: '#4F46E5', rgb: '79,70,229',
  },
  {
    id: 'decide', label: 'Decide', num: '02',
    sub: 'What should we do about it — and why now?',
    detail: 'Evaluate options. Make the tradeoff explicit. Choose with clarity, not consensus.',
    color: '#0097A7', rgb: '0,151,167',
  },
  {
    id: 'build', label: 'Build', num: '03',
    sub: 'Ship with the team fully aligned.',
    detail: 'Resolve ambiguity before the sprint. Catch misalignments early. They compound.',
    color: '#E07A5F', rgb: '224,122,95',
  },
  {
    id: 'measure', label: 'Measure', num: '04',
    sub: 'Did it work? What did the data say?',
    detail: 'Check the metric you set before shipping. Learn whether the hypothesis was right.',
    color: '#158158', rgb: '21,129,88',
  },
];

export function UDBMLoopAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(-1);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    setActive(0);
    const iv = setInterval(() => {
      i = (i + 1) % UDBM_PHASES.length;
      setActive(i);
    }, 2400);
    return () => clearInterval(iv);
  }, [inView, tick]);

  const replay = () => { setActive(-1); setTick(t => t + 1); };

  // Positions: top, right, bottom, left
  const positions = [
    { top: '0%', left: '50%', transform: 'translate(-50%, 0)' },
    { top: '50%', right: '0%', transform: 'translate(0, -50%)' },
    { bottom: '0%', left: '50%', transform: 'translate(-50%, 0)' },
    { top: '50%', left: '0%', transform: 'translate(0, -50%)' },
  ];

  // Arrow paths connecting the 4 corners (SVG arcs)
  const arcs = [
    'M 200 60 Q 340 60 340 200',   // top → right
    'M 340 200 Q 340 340 200 340', // right → bottom
    'M 200 340 Q 60 340 60 200',   // bottom → left
    'M 60 200 Q 60 60 200 60',     // left → top
  ];

  const ph = active >= 0 ? UDBM_PHASES[active] : null;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{
        fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
        color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '20px',
        textTransform: 'uppercase',
      }}>
        The PM Operating Loop — auto-animated
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'center' }}>
        {/* Circle diagram */}
        <div style={{ position: 'relative', aspectRatio: '1', maxWidth: '400px' }}>
          {/* SVG arcs */}
          <svg viewBox="0 0 400 400" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <defs>
              {UDBM_PHASES.map((p, i) => (
                <marker key={i} id={`arrow-${i}`} viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={p.color} opacity="0.7" />
                </marker>
              ))}
            </defs>
            {arcs.map((d, i) => {
              const isActive = active === i;
              const phase = UDBM_PHASES[i];
              return (
                <motion.path
                  key={i} d={d} fill="none"
                  stroke={phase.color}
                  strokeWidth={isActive ? 3 : 1.5}
                  strokeDasharray="6 4"
                  opacity={isActive ? 0.9 : 0.25}
                  markerEnd={`url(#arrow-${i})`}
                  animate={{ opacity: isActive ? 0.9 : 0.25, strokeWidth: isActive ? 3 : 1.5 }}
                  transition={{ duration: 0.4 }}
                />
              );
            })}
            {/* Center label */}
            <text x="200" y="194" textAnchor="middle" style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fill: 'var(--ed-ink3)', fontWeight: 700, letterSpacing: '0.14em' }}>PM</text>
            <text x="200" y="212" textAnchor="middle" style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fill: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>LOOP</text>
          </svg>

          {/* Phase nodes */}
          {UDBM_PHASES.map((p, i) => {
            const isActive = active === i;
            return (
              <motion.div
                key={p.id}
                animate={{
                  scale: isActive ? 1.08 : 1,
                  boxShadow: isActive ? `0 0 0 3px ${p.color}40, 0 8px 28px ${p.color}30` : 'none',
                }}
                transition={{ duration: 0.35 }}
                style={{
                  position: 'absolute', ...positions[i],
                  width: '110px',
                  padding: '12px 10px',
                  borderRadius: '14px',
                  background: isActive ? `rgba(${p.rgb},0.12)` : 'var(--ed-card)',
                  border: `1.5px solid ${isActive ? p.color : 'var(--ed-rule)'}`,
                  textAlign: 'center',
                  transition: 'background 0.35s, border-color 0.35s',
                  zIndex: 2,
                }}
              >
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '8px',
                  fontWeight: 800, color: p.color, letterSpacing: '0.14em', marginBottom: '4px',
                }}>{p.num}</div>
                <div style={{
                  fontSize: '13px', fontWeight: 800, color: isActive ? p.color : 'var(--ed-ink)',
                  transition: 'color 0.35s',
                }}>{p.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Active phase detail */}
        <div style={{ minHeight: '160px' }}>
          <AnimatePresence mode="wait">
            {ph && (
              <motion.div
                key={ph.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{
                  padding: '24px 22px', borderRadius: '16px',
                  background: `rgba(${ph.rgb},0.07)`,
                  border: `1.5px solid rgba(${ph.rgb},0.25)`,
                  borderLeft: `4px solid ${ph.color}`,
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
                    fontWeight: 800, color: ph.color, letterSpacing: '0.14em', marginBottom: '8px',
                  }}>PHASE {ph.num} · {ph.label.toUpperCase()}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '10px', lineHeight: 1.4 }}>
                    {ph.sub}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
                    {ph.detail}
                  </div>
                </div>

                {/* Progress dots */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '16px', alignItems: 'center' }}>
                  {UDBM_PHASES.map((p, i) => (
                    <motion.div
                      key={i}
                      animate={{ width: active === i ? '24px' : '6px', background: active === i ? p.color : 'var(--ed-rule)' }}
                      transition={{ duration: 0.3 }}
                      style={{ height: '6px', borderRadius: '3px' }}
                    />
                  ))}
                  <span style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", marginLeft: '8px' }}>
                    {active + 1} / {UDBM_PHASES.length}
                  </span>
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

// ─── 2. PROBLEM ICEBERG VISUALIZATION ─────────────────────────────────────────
// Cinematic SVG iceberg. Symptoms float on the surface. The camera pans below
// the waterline to reveal the root problems beneath — each connected with a line.

const SYMPTOMS = [
  { text: '"The app is confusing"', x: 300, y: 60 },
  { text: '"I can\'t find anything"', x: 120, y: 90 },
  { text: '"It\'s just hard to use"', x: 480, y: 75 },
];

const ROOT_PROBLEMS = [
  { text: 'No search for past recordings', symptom: 0, x: 240, y: 260 },
  { text: 'Onboarding skips step 3 context', symptom: 1, x: 100, y: 310 },
  { text: 'CTA text is ambiguous', symptom: 2, x: 420, y: 290 },
  { text: 'No progress indicator in upload flow', symptom: 0, x: 340, y: 355 },
  { text: 'Error messages don\'t explain next steps', symptom: 1, x: 160, y: 370 },
];

export function ProblemIcebergViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0); // 0=hidden, 1=symptoms, 2=waterline, 3=problems revealed
  const [visibleSymptoms, setVisibleSymptoms] = useState(0);
  const [visibleProblems, setVisibleProblems] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0); setVisibleSymptoms(0); setVisibleProblems(0);
    const t1 = setTimeout(() => setStage(1), 400);
    const t2 = setTimeout(() => setVisibleSymptoms(1), 900);
    const t3 = setTimeout(() => setVisibleSymptoms(2), 1600);
    const t4 = setTimeout(() => setVisibleSymptoms(3), 2300);
    const t5 = setTimeout(() => setStage(2), 3200);
    const t6 = setTimeout(() => setStage(3), 4000);
    const t7 = setTimeout(() => setVisibleProblems(1), 4400);
    const t8 = setTimeout(() => setVisibleProblems(2), 5100);
    const t9 = setTimeout(() => setVisibleProblems(3), 5800);
    const t10 = setTimeout(() => setVisibleProblems(4), 6500);
    const t11 = setTimeout(() => setVisibleProblems(5), 7200);
    return () => [t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11].forEach(clearTimeout);
  }, [inView, tick]);

  const replay = () => { setStage(0); setVisibleSymptoms(0); setVisibleProblems(0); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{
        fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
        color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '16px',
        textTransform: 'uppercase',
      }}>
        The Problem Iceberg — what users say vs what's actually broken
      </div>

      <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--ed-rule)' }}>
        <svg viewBox="0 0 620 440" style={{ width: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8F4FD" />
              <stop offset="100%" stopColor="#C5DFF5" />
            </linearGradient>
            <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A3A5C" />
              <stop offset="100%" stopColor="#0A1929" />
            </linearGradient>
            <linearGradient id="icebergAbove" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#D8EEF8" />
            </linearGradient>
            <linearGradient id="icebergBelow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A7CA8" />
              <stop offset="100%" stopColor="#1E4D6B" />
            </linearGradient>
            <clipPath id="aboveWater">
              <rect x="0" y="0" width="620" height="175" />
            </clipPath>
            <clipPath id="belowWater">
              <rect x="0" y="175" width="620" height="265" />
            </clipPath>
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width="620" height="175" fill="url(#skyGrad)" />
          {/* Ocean */}
          <rect x="0" y="175" width="620" height="265" fill="url(#oceanGrad)" />

          {/* Waterline */}
          <path d="M0 175 Q 78 170 155 175 Q 232 180 310 175 Q 388 170 465 175 Q 542 180 620 175 L 620 185 Q 542 190 465 185 Q 388 180 310 185 Q 232 190 155 185 Q 78 180 0 185 Z"
            fill="#2A7DB5" opacity="0.7" />
          <text x="10" y="190" style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fill: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
            WATER SURFACE — WHAT USERS REPORT
          </text>

          {/* Iceberg above water */}
          <polygon
            points="280,30 240,175 340,175"
            fill="url(#icebergAbove)"
            stroke="#B8D4E8" strokeWidth="1"
          />
          {/* Iceberg below water (larger) */}
          <motion.path
            d="M240 175 Q 180 220 160 270 Q 140 320 170 360 Q 200 390 280 400 Q 360 395 400 360 Q 430 320 420 270 Q 400 220 340 175 Z"
            fill="url(#icebergBelow)"
            stroke="#3A7CA8" strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 2 ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* Label: VISIBLE */}
          <text x="310" y="145" textAnchor="middle" style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fill: '#2A5C8A', fontWeight: 800, letterSpacing: '0.1em' }}>
            VISIBLE (symptoms)
          </text>

          {/* Label: HIDDEN */}
          <motion.text
            x="310" y="430" textAnchor="middle"
            style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fill: 'rgba(255,255,255,0.45)', fontWeight: 800, letterSpacing: '0.1em' }}
            initial={{ opacity: 0 }} animate={{ opacity: stage >= 3 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          >
            HIDDEN (root problems)
          </motion.text>

          {/* Symptoms above water */}
          {SYMPTOMS.map((s, i) => (
            <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: i < visibleSymptoms ? 1 : 0, y: i < visibleSymptoms ? 0 : 10 }} transition={{ duration: 0.5 }}>
              <rect x={s.x - 80} y={s.y - 18} width="160" height="30" rx="8"
                fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.5" />
              <text x={s.x} y={s.y} textAnchor="middle" dominantBaseline="middle"
                style={{ fontSize: '10px', fill: '#4F46E5', fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
                {s.text}
              </text>
            </motion.g>
          ))}

          {/* Root problems below water */}
          {ROOT_PROBLEMS.map((p, i) => (
            <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: i < visibleProblems ? 1 : 0 }} transition={{ duration: 0.5 }}>
              {/* Connecting dotted line to symptom */}
              <line
                x1={SYMPTOMS[p.symptom].x} y1="175"
                x2={p.x} y2={p.y - 18}
                stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3"
              />
              <rect x={p.x - 110} y={p.y - 18} width="220" height="28" rx="7"
                fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
                style={{ fontSize: '10px', fill: 'rgba(255,255,255,0.85)', fontFamily: 'system-ui, sans-serif' }}>
                {p.text}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>

      <div style={{
        marginTop: '14px', padding: '12px 16px', borderRadius: '10px',
        background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.18)',
        fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7,
      }}>
        <strong style={{ color: 'var(--ed-indigo)' }}>Key insight:</strong> Every user complaint is a symptom. The real problems live below the surface — and they only appear when you ask the right questions.
      </div>

      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 3. RICE 3D BUBBLE CHART ───────────────────────────────────────────────────
// Three.js scene: each feature is a glowing sphere. X = Reach, Y = Impact,
// sphere radius = 1/Effort. Color = RICE score. Camera auto-rotates.

const RICE_FEATURES_3D = [
  { name: 'Search by date',        reach: 8.5, impact: 9, effort: 1.5, confidence: 0.9, color: '#22C55E' },
  { name: 'Slack notifications',   reach: 7, impact: 7, effort: 2, confidence: 0.8, color: '#84CC16' },
  { name: 'Onboarding redesign',   reach: 9, impact: 8, effort: 8, confidence: 0.7, color: '#F59E0B' },
  { name: 'Dark mode',             reach: 8, impact: 3, effort: 2, confidence: 0.95, color: '#F97316' },
  { name: 'CRM integration',       reach: 4, impact: 9, effort: 9, confidence: 0.6, color: '#EF4444' },
  { name: 'Analytics dashboard',   reach: 3, impact: 8, effort: 7, confidence: 0.65, color: '#EF4444' },
];

function FeatureSphere({ feat, index, started }: {
  feat: typeof RICE_FEATURES_3D[0]; index: number; started: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetPos = new THREE.Vector3(
    (feat.reach - 5.5) * 0.7,
    (feat.impact - 5.5) * 0.6,
    0,
  );
  const startPos = new THREE.Vector3(0, 0, 0);
  const t = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (started) {
      t.current = Math.min(t.current + delta * 0.6, 1);
      const ease = easeInOut(t.current);
      const delay = index * 0.15;
      const delayedEase = easeInOut(clamp((t.current - delay) / (1 - delay), 0, 1));
      meshRef.current.position.lerpVectors(startPos, targetPos, delayedEase);
    }
    // Gentle float
    meshRef.current.position.y += Math.sin(Date.now() * 0.001 + index) * 0.0008;
    // Slow rotation
    meshRef.current.rotation.y += delta * 0.4;
  });

  const radius = (1 / feat.effort) * 3.5 + 0.25;

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={feat.color}
        emissive={feat.color}
        emissiveIntensity={hovered ? 0.5 : 0.2}
        roughness={0.3}
        metalness={0.4}
        transparent
        opacity={feat.confidence}
      />
      {hovered && (
        <Html distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(0,0,0,0.85)', color: '#fff', borderRadius: '8px',
            padding: '8px 12px', fontSize: '11px', whiteSpace: 'nowrap',
            fontFamily: 'system-ui, sans-serif', minWidth: '160px',
            border: `1px solid ${feat.color}60`,
          }}>
            <div style={{ fontWeight: 700, marginBottom: '4px', color: feat.color }}>{feat.name}</div>
            <div>Reach: {feat.reach} · Impact: {feat.impact}</div>
            <div>Effort: {feat.effort} wks · Conf: {Math.round(feat.confidence * 100)}%</div>
            <div style={{ marginTop: '4px', fontWeight: 700, color: feat.color }}>
              Score: {Math.round((feat.reach * feat.impact * feat.confidence) / feat.effort)}
            </div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

function RICEAxes() {
  return (
    <group>
      {/* X axis — Reach */}
      <mesh position={[0, -3.2, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[8, 0.02, 0.02]} />
        <meshBasicMaterial color="#ffffff20" />
      </mesh>
      {/* Y axis — Impact */}
      <mesh position={[-3.8, 0, 0]}>
        <boxGeometry args={[0.02, 7, 0.02]} />
        <meshBasicMaterial color="#ffffff20" />
      </mesh>
      {/* Grid lines */}
      {[-2, -1, 0, 1, 2].map(i => (
        <group key={i}>
          <mesh position={[i * 1.4, 0, 0]}>
            <boxGeometry args={[0.01, 6.5, 0.01]} />
            <meshBasicMaterial color="#ffffff08" />
          </mesh>
          <mesh position={[0, i * 1.0, 0]}>
            <boxGeometry args={[7.5, 0.01, 0.01]} />
            <meshBasicMaterial color="#ffffff08" />
          </mesh>
        </group>
      ))}
      <Html position={[4.2, -3.2, 0]} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
        REACH →
      </Html>
      <Html position={[-3.8, 3.8, 0]} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
        ↑ IMPACT
      </Html>
      <Html position={[0, -4.2, 0]} style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
        sphere size = ease of effort · opacity = confidence
      </Html>
    </group>
  );
}

function RICEScene({ started }: { started: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
      <ambientLight intensity={0.4} />
      <pointLight position={[8, 8, 8]} intensity={1.2} />
      <pointLight position={[-8, -4, 4]} intensity={0.6} color="#4F46E5" />
      <RICEAxes />
      {RICE_FEATURES_3D.map((f, i) => (
        <FeatureSphere key={i} feat={f} index={i} started={started} />
      ))}
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
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
      <div style={{
        fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
        color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '16px',
        textTransform: 'uppercase',
      }}>
        RICE Priority Space — 3D · hover a feature to inspect its score
      </div>

      <div style={{
        borderRadius: '20px', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0A0F1E 0%, #0D1B2A 100%)',
        border: '1px solid rgba(79,70,229,0.25)',
        height: '460px',
        boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
      }}>
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: '12px' }}>
            Loading 3D scene…
          </div>
        }>
          <Canvas>
            <RICEScene started={started} />
          </Canvas>
        </Suspense>
      </div>

      <div style={{
        marginTop: '14px', display: 'flex', gap: '16px', flexWrap: 'wrap',
      }}>
        {[
          { color: '#22C55E', label: 'High priority — high score' },
          { color: '#F59E0B', label: 'Medium priority' },
          { color: '#EF4444', label: 'Low priority — low score' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
            <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 4. LOCAL MAXIMA TERRAIN SCENE ────────────────────────────────────────────
// Three.js terrain with two Gaussian peaks. A metallic sphere auto-rolls up
// to the local maximum, pauses, then reveals the higher global peak.
// Teaches: "Your product may be optimized for the wrong peak."

function terrainHeight(x: number, z: number) {
  const local = 3.8 * Math.exp(-((x + 2.8) ** 2 + z ** 2) / 1.4);
  const global_ = 6.2 * Math.exp(-((x - 2.6) ** 2 + z ** 2) / 1.8);
  const base = -0.1 * (x * x + z * z) * 0.04;
  return local + global_ + base;
}

function TerrainMesh() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(16, 16, 120, 120);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, terrainHeight(x, y));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial
        color="#1a3a5c"
        roughness={0.85}
        metalness={0.15}
        wireframe={false}
      />
    </mesh>
  );
}

// Waypoints: [x, z, time_to_reach_from_previous]
const BALL_PATH = [
  { x: -6, z: 0, t: 0 },
  { x: -2.8, z: 0, t: 3.5 },  // local peak
  { x: -2.8, z: 0, t: 1.5 },  // pause at local peak
  { x: 0.1, z: 0, t: 2.5 },   // valley
  { x: 2.6, z: 0, t: 3.5 },   // global peak
];

function RollingBall({ elapsed, totalDur }: { elapsed: number; totalDur: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    let t = elapsed;
    let cumT = 0;
    let x = BALL_PATH[0].x;
    let z = BALL_PATH[0].z;

    for (let i = 0; i < BALL_PATH.length - 1; i++) {
      const seg = BALL_PATH[i + 1].t;
      if (t <= cumT + seg) {
        const progress = easeInOut((t - cumT) / seg);
        x = THREE.MathUtils.lerp(BALL_PATH[i].x, BALL_PATH[i + 1].x, progress);
        z = THREE.MathUtils.lerp(BALL_PATH[i].z, BALL_PATH[i + 1].z, progress);
        break;
      }
      cumT += seg;
      x = BALL_PATH[i + 1].x;
      z = BALL_PATH[i + 1].z;
    }

    const y = terrainHeight(x, z) + 0.32;
    meshRef.current.position.set(x, y, z);
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[0.32, 32, 32]} />
      <meshStandardMaterial color="#FF6B6B" metalness={0.8} roughness={0.15} emissive="#FF2020" emissiveIntensity={0.3} />
    </mesh>
  );
}

function LocalMaximaAnnotations({ elapsed }: { elapsed: number }) {
  const showLocal = elapsed >= 3.5;
  const showGlobal = elapsed >= 7;

  return (
    <>
      {showLocal && (
        <Html position={[-2.8, terrainHeight(-2.8, 0) + 1.2, 0]} center>
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{
              background: 'rgba(239,68,68,0.92)', color: '#fff',
              borderRadius: '8px', padding: '6px 12px', fontSize: '11px',
              fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap',
              fontWeight: 700, boxShadow: '0 4px 16px rgba(239,68,68,0.5)',
            }}
          >
            ⚠ Local maximum
            <div style={{ fontSize: '9px', fontWeight: 400, opacity: 0.85, marginTop: '2px' }}>
              You think you&apos;re done.
            </div>
          </motion.div>
        </Html>
      )}
      {showGlobal && (
        <Html position={[2.6, terrainHeight(2.6, 0) + 1.4, 0]} center>
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{
              background: 'rgba(21,129,88,0.92)', color: '#fff',
              borderRadius: '8px', padding: '6px 12px', fontSize: '11px',
              fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap',
              fontWeight: 700, boxShadow: '0 4px 16px rgba(21,129,88,0.5)',
            }}
          >
            ✓ Higher opportunity
            <div style={{ fontSize: '9px', fontWeight: 400, opacity: 0.85, marginTop: '2px' }}>
              Required going back down first.
            </div>
          </motion.div>
        </Html>
      )}
    </>
  );
}

function LocalMaximaSceneInner({ elapsed }: { elapsed: number }) {
  const totalDur = BALL_PATH.reduce((s, p) => s + p.t, 0);
  return (
    <>
      <PerspectiveCamera makeDefault position={[-1, 9, 14]} fov={42} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 12, 6]} intensity={1.1} castShadow />
      <pointLight position={[-6, 6, 2]} intensity={0.5} color="#3A86FF" />
      <pointLight position={[5, 8, 2]} intensity={0.4} color="#22C55E" />
      <TerrainMesh />
      <RollingBall elapsed={elapsed} totalDur={totalDur} />
      <LocalMaximaAnnotations elapsed={elapsed} />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
    </>
  );
}

export function LocalMaximaScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;
    const delay = setTimeout(() => setRunning(true), 600);
    return () => clearTimeout(delay);
  }, [inView, tick]);

  useEffect(() => {
    if (!running) return;
    startTime.current = performance.now() / 1000;
    const totalDur = BALL_PATH.reduce((s, p) => s + p.t, 0);

    const animate = () => {
      const now = performance.now() / 1000;
      const t = Math.min(now - (startTime.current ?? now), totalDur);
      setElapsed(t);
      if (t < totalDur) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  const replay = () => {
    setElapsed(0);
    setRunning(false);
    setTick(t => t + 1);
  };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{
        fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
        color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '16px',
        textTransform: 'uppercase',
      }}>
        PMF Local Maxima — 3D terrain · auto-animated
      </div>

      <div style={{
        borderRadius: '20px', overflow: 'hidden',
        background: 'linear-gradient(180deg, #061018 0%, #0A1929 100%)',
        border: '1px solid rgba(58,134,255,0.2)',
        height: '420px',
        boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
      }}>
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: '12px' }}>
            Loading 3D terrain…
          </div>
        }>
          <Canvas shadows>
            <LocalMaximaSceneInner elapsed={elapsed} />
          </Canvas>
        </Suspense>
      </div>

      <div style={{
        marginTop: '14px', padding: '12px 16px', borderRadius: '10px',
        background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)',
        fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7,
      }}>
        <strong style={{ color: '#EF4444' }}>The local maxima trap:</strong> Your product is optimized — but for the wrong peak. Getting to the real opportunity requires going back down first. Most teams don&apos;t because it looks like regression.
      </div>

      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 5. METRICS CASCADE ANIMATION ─────────────────────────────────────────────
// SVG tree builds itself top-down: North Star → Leading Indicators → Operational Metrics.
// After full build, data pulses upward to show the causal chain.

const CASCADE_NODES = {
  root: { id: 'ns', label: 'Coaching ROI', sub: 'North Star Metric', color: '#4F46E5', x: 300, y: 40 },
  mid: [
    { id: 'l1', label: 'Onboarding', sub: 'Leading indicator', color: '#0097A7', x: 100, y: 160 },
    { id: 'l2', label: 'Session depth', sub: 'Leading indicator', color: '#0097A7', x: 300, y: 160 },
    { id: 'l3', label: 'Skill scores', sub: 'Leading indicator', color: '#0097A7', x: 500, y: 160 },
  ],
  leaves: [
    { id: 'op1', label: 'Step completion', color: '#158158', parentIdx: 0, x: 40, y: 290 },
    { id: 'op2', label: 'Time-to-activate', color: '#158158', parentIdx: 0, x: 155, y: 290 },
    { id: 'op3', label: 'Call duration', color: '#158158', parentIdx: 1, x: 260, y: 290 },
    { id: 'op4', label: 'Replay rate', color: '#158158', parentIdx: 1, x: 345, y: 290 },
    { id: 'op5', label: 'Pre-score', color: '#158158', parentIdx: 2, x: 440, y: 290 },
    { id: 'op6', label: 'Post-score', color: '#158158', parentIdx: 2, x: 545, y: 290 },
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
    const t1 = setTimeout(() => setStage(1), 500);   // root appears
    const t2 = setTimeout(() => setStage(2), 1400);  // lines to mid
    const t3 = setTimeout(() => setStage(3), 2300);  // mid nodes
    const t4 = setTimeout(() => setStage(4), 3200);  // lines to leaves
    const t5 = setTimeout(() => setStage(5), 4100);  // leaves appear
    const t6 = setTimeout(() => setPulse(true), 5200); // upward pulse
    return () => [t1,t2,t3,t4,t5,t6].forEach(clearTimeout);
  }, [inView, tick]);

  const replay = () => { setStage(0); setPulse(false); setTick(t => t + 1); };

  // SVG line from root to each mid node
  const rootToMid = CASCADE_NODES.mid.map(m => ({
    d: `M ${CASCADE_NODES.root.x} ${CASCADE_NODES.root.y + 28} L ${m.x} ${m.y - 20}`,
    color: CASCADE_NODES.root.color,
  }));

  // SVG line from each mid to each leaf
  const midToLeaf = CASCADE_NODES.leaves.map(l => {
    const parent = CASCADE_NODES.mid[l.parentIdx];
    return {
      d: `M ${parent.x} ${parent.y + 24} L ${l.x} ${l.y - 16}`,
      color: parent.color,
    };
  });

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{
        fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
        color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '16px',
        textTransform: 'uppercase',
      }}>
        North Star Metrics Cascade — builds automatically on scroll
      </div>

      <div style={{ borderRadius: '20px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '24px 16px', overflow: 'hidden' }}>
        <svg viewBox="0 0 600 330" style={{ width: '100%', overflow: 'visible' }}>
          {/* Lines root → mid */}
          {rootToMid.map((line, i) => (
            <motion.path
              key={i} d={line.d} fill="none"
              stroke={line.color} strokeWidth="2" strokeDasharray="5 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: stage >= 2 ? 1 : 0, opacity: stage >= 2 ? 0.6 : 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            />
          ))}

          {/* Lines mid → leaves */}
          {midToLeaf.map((line, i) => (
            <motion.path
              key={i} d={line.d} fill="none"
              stroke={CASCADE_NODES.mid[0].color} strokeWidth="1.5" strokeDasharray="4 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: stage >= 4 ? 1 : 0, opacity: stage >= 4 ? 0.45 : 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            />
          ))}

          {/* Pulse lines (upward, after full build) */}
          {pulse && midToLeaf.map((line, i) => (
            <motion.circle
              key={`pulse-${i}`} r="4" fill={CASCADE_NODES.leaves[i].color}
              initial={{ offsetDistance: '100%', opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.4, delay: (i % 3) * 0.3, repeat: Infinity, repeatDelay: 1 }}
            />
          ))}

          {/* Root node */}
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: stage >= 1 ? 1 : 0, scale: stage >= 1 ? 1 : 0.7 }} transition={{ duration: 0.5 }}>
            <rect x={CASCADE_NODES.root.x - 80} y={CASCADE_NODES.root.y - 18} width="160" height="40" rx="10"
              fill={CASCADE_NODES.root.color} opacity="0.15" stroke={CASCADE_NODES.root.color} strokeWidth="1.5" />
            <text x={CASCADE_NODES.root.x} y={CASCADE_NODES.root.y + 2} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: '12px', fill: CASCADE_NODES.root.color, fontWeight: 800, fontFamily: 'system-ui' }}>
              {CASCADE_NODES.root.label}
            </text>
            <text x={CASCADE_NODES.root.x} y={CASCADE_NODES.root.y + 17} textAnchor="middle"
              style={{ fontSize: '8px', fill: CASCADE_NODES.root.color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', opacity: 0.7 }}>
              {CASCADE_NODES.root.sub.toUpperCase()}
            </text>
          </motion.g>

          {/* Mid nodes */}
          {CASCADE_NODES.mid.map((m, i) => (
            <motion.g key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 10 }} transition={{ duration: 0.45, delay: i * 0.1 }}>
              <rect x={m.x - 65} y={m.y - 16} width="130" height="36" rx="8"
                fill={m.color} opacity="0.1" stroke={m.color} strokeWidth="1.2" />
              <text x={m.x} y={m.y + 1} textAnchor="middle" dominantBaseline="middle"
                style={{ fontSize: '11px', fill: m.color, fontWeight: 700, fontFamily: 'system-ui' }}>
                {m.label}
              </text>
              <text x={m.x} y={m.y + 15} textAnchor="middle"
                style={{ fontSize: '8px', fill: m.color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em', opacity: 0.6 }}>
                {m.sub.toUpperCase()}
              </text>
            </motion.g>
          ))}

          {/* Leaf nodes */}
          {CASCADE_NODES.leaves.map((l, i) => (
            <motion.g key={l.id} initial={{ opacity: 0 }} animate={{ opacity: stage >= 5 ? 1 : 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
              <rect x={l.x - 58} y={l.y - 14} width="116" height="26" rx="6"
                fill={l.color} opacity="0.08" stroke={l.color} strokeWidth="1" />
              <text x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle"
                style={{ fontSize: '9px', fill: l.color, fontWeight: 600, fontFamily: 'system-ui' }}>
                {l.label}
              </text>
            </motion.g>
          ))}
        </svg>

        {pulse && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}
          >
            ↑ data flows upward from operational metrics to north star
          </motion.div>
        )}
      </div>

      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 6. GUARDRAIL DASHBOARD ANIMATION ─────────────────────────────────────────
// Auto-plays through 12 weeks. North Star climbs steadily.
// Three guardrail metrics deteriorate. At week 10: alarm state.
// Teaches: a single metric will always lie to you eventually.

const WEEKS = 14;

function generateTimeSeries(start: number, end: number, noise = 0.05) {
  return Array.from({ length: WEEKS }, (_, i) => {
    const t = i / (WEEKS - 1);
    const base = start + (end - start) * t;
    return base * (1 + (Math.random() - 0.5) * noise);
  });
}

const GD_DATA = {
  ns:       generateTimeSeries(1.1, 2.4, 0.03),
  nps:      generateTimeSeries(74, 44, 0.04),
  tickets:  generateTimeSeries(140, 380, 0.06),
  churn:    generateTimeSeries(5.2, 14.8, 0.05),
};

function Sparkline({ values, week, color, alert }: { values: number[]; week: number; color: string; alert: boolean }) {
  const visible = values.slice(0, week + 1);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const W = 160, H = 48;

  const pts = visible.map((v, i) => {
    const x = (i / (WEEKS - 1)) * W;
    const y = H - ((v - min) / (max - min + 0.001)) * H;
    return `${x},${y}`;
  }).join(' ');

  const area = visible.map((v, i) => {
    const x = (i / (WEEKS - 1)) * W;
    const y = H - ((v - min) / (max - min + 0.001)) * H;
    return `${x},${y}`;
  }).join(' ') + ` ${((visible.length - 1) / (WEEKS - 1)) * W},${H} 0,${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {visible.length > 1 && (
        <>
          <polygon points={area} fill={`url(#grad-${color.replace('#', '')})`} />
          <polyline points={pts} fill="none" stroke={alert ? '#EF4444' : color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {visible.length > 0 && (() => {
        const last = visible[visible.length - 1];
        const lx = ((visible.length - 1) / (WEEKS - 1)) * W;
        const ly = H - ((last - min) / (max - min + 0.001)) * H;
        return <circle cx={lx} cy={ly} r="3.5" fill={alert ? '#EF4444' : color} />;
      })()}
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
    const iv = setInterval(() => {
      i++;
      setWeek(i);
      if (i >= WEEKS - 1) clearInterval(iv);
    }, 350);
    return () => clearInterval(iv);
  }, [inView, tick]);

  const replay = () => { setWeek(-1); setTick(t => t + 1); };

  const w = Math.max(0, week);
  const nsAlert = false;
  const npsAlert = w >= 6 && GD_DATA.nps[w] < 60;
  const ticketsAlert = w >= 5 && GD_DATA.tickets[w] > 250;
  const churnAlert = w >= 6 && GD_DATA.churn[w] > 10;
  const anyAlert = npsAlert || ticketsAlert || churnAlert;

  const panels = [
    {
      label: 'Sessions / user', sub: 'North Star', key: 'ns' as const,
      format: (v: number) => v.toFixed(1) + 'x',
      color: '#4F46E5', alert: false, dir: '↑',
    },
    {
      label: 'NPS', sub: 'Guardrail', key: 'nps' as const,
      format: (v: number) => Math.round(v).toString(),
      color: '#0097A7', alert: npsAlert, dir: '↓',
      threshold: '< 60 → alert',
    },
    {
      label: 'Support tickets / wk', sub: 'Guardrail', key: 'tickets' as const,
      format: (v: number) => Math.round(v).toString(),
      color: '#E07A5F', alert: ticketsAlert, dir: '↑',
      threshold: '> 250 → alert',
    },
    {
      label: 'Month-1 churn', sub: 'Guardrail', key: 'churn' as const,
      format: (v: number) => v.toFixed(1) + '%',
      color: '#158158', alert: churnAlert, dir: '↑',
      threshold: '> 10% → alert',
    },
  ];

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{
        fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
        color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '16px',
        textTransform: 'uppercase',
      }}>
        Guardrail Metrics Dashboard — {WEEKS} weeks · auto-animated
      </div>

      <div style={{
        borderRadius: '20px', overflow: 'hidden',
        background: '#0D1117', border: '1px solid rgba(255,255,255,0.08)',
        padding: '24px',
        boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
      }}>
        {/* Week counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
            EdSpark · Q2 Product Dashboard
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.6)',
            padding: '3px 10px', borderRadius: '6px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          }}>
            Week {Math.min(w + 1, WEEKS)} / {WEEKS}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {panels.map((panel) => {
            const val = w >= 0 ? GD_DATA[panel.key][w] : GD_DATA[panel.key][0];
            const isAlert = panel.alert;
            return (
              <motion.div
                key={panel.key}
                animate={{ borderColor: isAlert ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)' }}
                style={{
                  borderRadius: '14px', padding: '16px',
                  background: isAlert ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'background 0.5s, border-color 0.5s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: '8px',
                      color: isAlert ? '#EF4444' : 'rgba(255,255,255,0.35)',
                      letterSpacing: '0.12em', marginBottom: '3px',
                      fontWeight: isAlert ? 800 : 400,
                    }}>
                      {panel.sub.toUpperCase()}{isAlert ? ' ⚠' : ''}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{panel.label}</div>
                  </div>
                  <div style={{
                    fontSize: '22px', fontWeight: 900,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: isAlert ? '#EF4444' : panel.color,
                  }}>
                    {panel.format(val)}
                  </div>
                </div>
                <div style={{ height: '52px' }}>
                  <Sparkline values={GD_DATA[panel.key]} week={w} color={panel.color} alert={isAlert} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Alert callout */}
        <AnimatePresence>
          {anyAlert && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: '20px', padding: '14px 18px', borderRadius: '12px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)',
                borderLeft: '4px solid #EF4444',
              }}
            >
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
                color: '#EF4444', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '6px',
              }}>
                ⚠ GUARDRAILS FAILING
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                The north star is rising. But NPS is dropping, support is overwhelmed, and churn is climbing. Users are more &ldquo;active&rdquo; — and less satisfied. The north star is lying.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{
        marginTop: '14px', padding: '12px 16px', borderRadius: '10px',
        background: 'rgba(21,129,88,0.06)', border: '1px solid rgba(21,129,88,0.18)',
        fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7,
      }}>
        <strong style={{ color: '#158158' }}>Guardrail metrics</strong> exist to catch exactly this: your primary metric optimizes in a way that destroys real value. Without them, you&apos;d celebrate a worsening product.
      </div>

      <ReplayBtn onReplay={replay} />
    </div>
  );
}

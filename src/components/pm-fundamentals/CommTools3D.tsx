'use client';

/**
 * CommTools3D — Phase 1 3D visual teaching tools for Module 06.
 *
 * T1-01  CommunicationPrism      — one message split into 4 stakeholder beams
 * T1-04  NarrativeStaircase      — storytelling as an ascending platform sequence
 * T1-05  RoadmapPressureChamber  — roadmap wording creates ripple effects on stakeholder pods
 * T2-02  StakeholderCalibrationRoom — inspect stakeholder motives before the meeting
 * T2-04  ExecReviewTheater       — sort content into exec narrative vs appendix
 */

import React, { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Float, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────
// SHARED CONSTANTS
// ─────────────────────────────────────────
const ACCENT = '#0284C7';

const canvasStyle: React.CSSProperties = {
  width: '100%',
  height: '420px',
  borderRadius: '12px',
  overflow: 'hidden',
  background: 'linear-gradient(160deg, #060F1A 0%, #0A1628 60%, #0D0A1E 100%)',
};

const CanvasShell = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div style={{ margin: '32px 0' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>{label}</div>
      <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>· drag to rotate · scroll to zoom</div>
    </div>
    <div style={canvasStyle}>
      {children}
    </div>
  </div>
);

// ─────────────────────────────────────────
// T1-01 · COMMUNICATION PRISM
// ─────────────────────────────────────────
const BEAM_DATA = [
  { id: 'eng',        label: 'Engineering', color: '#3A86FF', angle: Math.PI * 0.15,  desc: 'Problem, constraints, scope, dependencies, success criteria' },
  { id: 'design',     label: 'Design',      color: '#C85A40', angle: Math.PI * 0.38,  desc: 'User need, friction points, edge cases, experience intent' },
  { id: 'sales',      label: 'Sales / CS',  color: '#E67E22', angle: Math.PI * 0.62,  desc: 'Value statement, readiness signal, safe claims, limitations' },
  { id: 'leadership', label: 'Leadership',  color: '#7843EE', angle: Math.PI * 0.85,  desc: 'Business outcome, tradeoff, risk, why-now logic' },
];

function PrismMesh({ onClick }: { onClick: () => void }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { ref.current.rotation.y += dt * 0.3; });
  return (
    <mesh ref={ref} onClick={onClick} position={[0, 0, 0]}>
      <octahedronGeometry args={[0.9, 0]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transparent opacity={0.18}
        metalness={0.0} roughness={0.0}
        transmission={0.95}
        thickness={1.5}
        ior={1.5}
        wireframe={false}
      />
    </mesh>
  );
}

function PrismWireframe() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { ref.current.rotation.y += dt * 0.3; });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.92, 0]} />
      <meshBasicMaterial color="#88aaff" transparent opacity={0.35} wireframe />
    </mesh>
  );
}

function InputBeam() {
  const points = useMemo(() => [new THREE.Vector3(-4, 0, 0), new THREE.Vector3(-0.9, 0, 0)], []);
  return <Line points={points} color="white" lineWidth={2} dashed={false} />;
}

function OutputBeam({ angle, color, active }: { angle: number; color: string; active: boolean }) {
  const len = 3.2;
  const x = Math.cos(angle) * len;
  const y = (Math.sin(angle) - 0.5) * len * 0.8;
  const points = useMemo(() => [new THREE.Vector3(0.9, 0, 0), new THREE.Vector3(x, y, 0)], [x, y]);
  return (
    <Line
      points={points}
      color={color}
      lineWidth={active ? 3.5 : 1.5}
      dashed={false}
      transparent
      opacity={active ? 1 : 0.4}
    />
  );
}

function BeamLabel({ angle, color, label, active, onClick }: { angle: number; color: string; label: string; active: boolean; onClick: () => void }) {
  const len = 3.6;
  const x = Math.cos(angle) * len;
  const y = (Math.sin(angle) - 0.5) * len * 0.8;
  return (
    <Html position={[x, y, 0]} center>
      <div
        onClick={onClick}
        style={{
          padding: '5px 12px', borderRadius: '20px', cursor: 'pointer',
          background: active ? color : 'rgba(255,255,255,0.07)',
          border: `1.5px solid ${color}`,
          color: active ? '#fff' : color,
          fontSize: '11px', fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.06em', whiteSpace: 'nowrap',
          transition: 'all 0.2s',
          boxShadow: active ? `0 0 16px ${color}60` : 'none',
        }}
      >
        {label}
      </div>
    </Html>
  );
}

function InputLabel() {
  return (
    <Html position={[-4.5, 0, 0]} center>
      <div style={{ padding: '5px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', fontSize: '10px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' }}>
        Product Initiative
      </div>
    </Html>
  );
}

export function CommunicationPrism() {
  const [active, setActive] = useState<string | null>(null);
  const activeBeam = BEAM_DATA.find(b => b.id === active);

  return (
    <div>
      <CanvasShell label="T1-01 · Communication Prism">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[-5, 2, 3]} intensity={1.2} color="#8899ff" />
          <pointLight position={[5, -2, 3]} intensity={0.8} color="#ffaa55" />
          <Suspense fallback={null}>
            <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
              <PrismMesh onClick={() => setActive(null)} />
              <PrismWireframe />
            </Float>
            <InputBeam />
            <InputLabel />
            {BEAM_DATA.map(b => (
              <React.Fragment key={b.id}>
                <OutputBeam angle={b.angle} color={b.color} active={active === b.id} />
                <BeamLabel angle={b.angle} color={b.color} label={b.label} active={active === b.id} onClick={() => setActive(active === b.id ? null : b.id)} />
              </React.Fragment>
            ))}
          </Suspense>
          <OrbitControls enablePan={false} minDistance={5} maxDistance={14} />
        </Canvas>
      </CanvasShell>

      {/* Info panel below canvas */}
      <AnimatePresence mode="wait">
        {activeBeam ? (
          <motion.div key={activeBeam.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ marginTop: '12px', padding: '14px 18px', borderRadius: '10px', border: `1.5px solid ${activeBeam.color}50`, background: `${activeBeam.color}0D`, display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeBeam.color, flexShrink: 0, marginTop: '3px', boxShadow: `0 0 10px ${activeBeam.color}` }} />
            <div>
              <div style={{ fontWeight: 700, color: activeBeam.color, fontSize: '13px', marginBottom: '4px', fontFamily: "'JetBrains Mono', monospace" }}>{activeBeam.label} needs to know:</div>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{activeBeam.desc}</div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ marginTop: '12px', padding: '10px 16px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', fontSize: '12px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
            One product initiative enters the prism. Four different messages emerge. Click any beam to see what each stakeholder needs.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────
// T1-04 · NARRATIVE STAIRCASE
// ─────────────────────────────────────────
const STEPS = [
  { id: 0, label: 'Context',         color: '#94a3b8', y: -2.4, x: -3.0, desc: 'What is happening in the product or business?' },
  { id: 1, label: 'Problem',         color: '#fb923c', y: -1.6, x: -2.0, desc: 'What is not working, and why is it worth attention?' },
  { id: 2, label: 'Evidence',        color: '#facc15', y: -0.8, x: -1.0, desc: 'What do users, data, or observations show?' },
  { id: 3, label: 'Why Now',         color: ACCENT,    y:  0.0, x:  0.0, desc: 'Why does this matter at this specific moment?' },
  { id: 4, label: 'Proposed Path',   color: '#34d399', y:  0.8, x:  1.0, desc: 'What are you recommending?' },
  { id: 5, label: 'Expected Impact', color: '#60a5fa', y:  1.6, x:  2.0, desc: 'What should change if this works?' },
  { id: 6, label: 'Ask',            color: '#c084fc', y:  2.4, x:  3.0, desc: 'What decision, support, or alignment is needed now?' },
];

const WEAK_MISSING = new Set([0, 1]); // weak narrative: context + problem missing

function StepPlatform({ step, active, weakMode, onClick }: { step: typeof STEPS[0]; active: boolean; weakMode: boolean; onClick: () => void }) {
  const ref = useRef<THREE.Mesh>(null!);
  const isMissing = weakMode && WEAK_MISSING.has(step.id);

  useFrame((_, dt) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, isMissing ? 0.08 : active ? 0.9 : 0.55, dt * 4);
    }
  });

  return (
    <group position={[step.x, step.y, 0]}>
      <mesh ref={ref} onClick={onClick}>
        <boxGeometry args={[1.6, 0.22, 1.2]} />
        <meshStandardMaterial
          color={isMissing ? '#334155' : step.color}
          transparent opacity={0.6}
          emissive={step.color}
          emissiveIntensity={active ? 0.5 : isMissing ? 0 : 0.1}
        />
      </mesh>
      {/* Step edge glow */}
      {!isMissing && (
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[1.62, 0.03, 1.22]} />
          <meshBasicMaterial color={step.color} transparent opacity={active ? 0.9 : 0.3} />
        </mesh>
      )}
      <Html position={[0, 0.28, 0]} center>
        <div style={{
          fontSize: '9px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
          color: isMissing ? '#334155' : active ? '#fff' : step.color,
          letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
          cursor: 'pointer', padding: '2px 6px',
          textShadow: active ? `0 0 12px ${step.color}` : 'none',
          transition: 'all 0.2s',
        }}>
          {isMissing ? '· · ·' : step.label}
        </div>
      </Html>
    </group>
  );
}

function GlowSphere({ step, weakMode }: { step: typeof STEPS[0] | null; weakMode: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const targetY = useRef(0);
  const targetX = useRef(0);

  if (step) {
    targetY.current = step.y + 0.5;
    targetX.current = step.x;
  }

  useFrame((_, dt) => {
    if (!ref.current || !step) return;
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY.current, dt * 3);
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX.current, dt * 3);
    ref.current.rotation.y += dt * 1.5;
  });

  if (!step || (weakMode && WEAK_MISSING.has(step.id))) return null;

  return (
    <mesh ref={ref} position={[step?.x ?? 0, (step?.y ?? 0) + 0.5, 0]}>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial color={step?.color ?? '#fff'} emissive={step?.color ?? '#fff'} emissiveIntensity={2} />
    </mesh>
  );
}

export function NarrativeStaircase() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [weakMode, setWeakMode] = useState(false);
  const active = STEPS.find(s => s.id === activeStep) ?? null;

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '0', alignItems: 'center' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>T1-04 · Narrative Staircase</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          {(['Strong', 'Weak'] as const).map(mode => (
            <button key={mode} onClick={() => setWeakMode(mode === 'Weak')}
              style={{ padding: '4px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${(mode === 'Weak') === weakMode ? (mode === 'Weak' ? '#dc2626' : ACCENT) : 'var(--ed-rule)'}`, background: (mode === 'Weak') === weakMode ? (mode === 'Weak' ? '#dc262620' : `${ACCENT}20`) : 'var(--ed-card)', color: (mode === 'Weak') === weakMode ? (mode === 'Weak' ? '#dc2626' : ACCENT) : 'var(--ed-ink3)' }}>
              {mode} Narrative
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...canvasStyle, marginTop: '10px' }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 48 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[0, 6, 4]} intensity={1.0} color="#ffffff" />
          <pointLight position={[0, -6, 4]} intensity={0.4} color="#334466" />
          <Suspense fallback={null}>
            {STEPS.map(step => (
              <StepPlatform
                key={step.id}
                step={step}
                active={activeStep === step.id}
                weakMode={weakMode}
                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              />
            ))}
            <GlowSphere step={active} weakMode={weakMode} />
          </Suspense>
          <OrbitControls enablePan={false} minDistance={6} maxDistance={16} />
        </Canvas>
      </div>

      {weakMode && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '10px', padding: '10px 16px', borderRadius: '8px', background: '#fef2f220', border: '1px solid #dc262640', fontSize: '12px', color: '#fca5a5' }}>
          ⚠ Without Context and Problem as your foundation, the audience has nothing to care about. Starting with the solution first feels efficient — it lands as noise.
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {active && !weakMode ? (
          <motion.div key={active.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ marginTop: '10px', padding: '14px 18px', borderRadius: '10px', border: `1.5px solid ${active.color}50`, background: `${active.color}0D`, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: active.color, flexShrink: 0, marginTop: '3px', boxShadow: `0 0 10px ${active.color}` }} />
            <div>
              <div style={{ fontWeight: 700, color: active.color, fontSize: '12px', marginBottom: '4px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>STEP {active.id + 1} · {active.label.toUpperCase()}</div>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{active.desc}</div>
            </div>
          </motion.div>
        ) : !active && !weakMode ? (
          <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ marginTop: '10px', padding: '10px 16px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', fontSize: '12px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
            Click any step to understand what it adds to the narrative. Toggle to see what happens when foundations are missing.
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────
// T1-05 · ROADMAP PRESSURE CHAMBER
// ─────────────────────────────────────────
const ROADMAP_STATES = [
  {
    id: 'exploring',
    label: 'Exploring',
    color: '#94a3b8',
    rippleIntensity: 0.3,
    pods: [
      { name: 'Customer',    reaction: 'Uncertain. May not rely on this.', tension: 0.2 },
      { name: 'Sales',       reaction: 'Cannot make a promise.',           tension: 0.3 },
      { name: 'CS',          reaction: 'Will manage expectations down.',   tension: 0.2 },
      { name: 'Leadership',  reaction: 'Noted as possible direction.',     tension: 0.1 },
      { name: 'Engineering', reaction: 'Not yet in planning.',             tension: 0.1 },
    ],
  },
  {
    id: 'planned',
    label: 'Planned',
    color: '#facc15',
    rippleIntensity: 0.55,
    pods: [
      { name: 'Customer',    reaction: 'Hopeful. Will ask for dates.',     tension: 0.5 },
      { name: 'Sales',       reaction: 'Will signal it is coming.',        tension: 0.4 },
      { name: 'CS',          reaction: 'Needs clearer timeline.',          tension: 0.4 },
      { name: 'Leadership',  reaction: 'Expects progress updates.',        tension: 0.3 },
      { name: 'Engineering', reaction: 'Will begin rough scoping.',        tension: 0.3 },
    ],
  },
  {
    id: 'committed',
    label: 'Committed',
    color: '#34d399',
    rippleIntensity: 0.85,
    pods: [
      { name: 'Customer',    reaction: 'Will hold you to this.',           tension: 0.8 },
      { name: 'Sales',       reaction: 'Will promise it to prospects.',    tension: 0.7 },
      { name: 'CS',          reaction: 'Will set customer expectations.',  tension: 0.6 },
      { name: 'Leadership',  reaction: 'Will track against delivery.',     tension: 0.5 },
      { name: 'Engineering', reaction: 'Must be in current sprint plan.',  tension: 0.8 },
    ],
  },
  {
    id: 'available',
    label: 'Available Now',
    color: '#60a5fa',
    rippleIntensity: 1.0,
    pods: [
      { name: 'Customer',    reaction: 'Expects it immediately.',          tension: 1.0 },
      { name: 'Sales',       reaction: 'Selling it today.',                tension: 0.9 },
      { name: 'CS',          reaction: 'Onboarding customers on it now.',  tension: 0.9 },
      { name: 'Leadership',  reaction: 'Expects adoption metrics.',        tension: 0.6 },
      { name: 'Engineering', reaction: 'Must be fully shipped and stable.', tension: 1.0 },
    ],
  },
];

const POD_POSITIONS: [number, number, number][] = [
  [0, 2.8, 0],   // top — Customer
  [2.6, 1.0, 0], // top-right — Sales
  [2.6, -1.0, 0], // bottom-right — CS
  [-2.6, 1.0, 0], // top-left — Leadership
  [-2.6, -1.0, 0], // bottom-left — Engineering
];

function PressurePod({ position, tension, color, name, active }: {
  position: [number, number, number];
  tension: number;
  color: string;
  name: string;
  active: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const targetScale = 0.35 + tension * 0.45;

  useFrame((_, dt) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, dt * 3);
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, targetScale, dt * 3);
    ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, targetScale, dt * 3);
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, tension * 0.8, dt * 3);
    // gentle pulse
    ref.current.rotation.y += dt * (0.5 + tension * 0.8);
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={color}
          transparent opacity={0.7}
          emissive={color}
          emissiveIntensity={tension * 0.5}
          wireframe={false}
        />
      </mesh>
      {/* Wireframe overlay */}
      <mesh scale={[targetScale * 1.05, targetScale * 1.05, targetScale * 1.05]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} wireframe />
      </mesh>
      <Html position={[0, 0.9, 0]} center>
        <div style={{ fontSize: '9px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: active ? '#fff' : color, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', textShadow: `0 0 8px ${color}` }}>
          {name}
        </div>
      </Html>
    </group>
  );
}

function RippleRing({ intensity, color }: { intensity: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  const scale = useRef(0.1);

  useFrame((_, dt) => {
    if (!ref.current) return;
    scale.current += dt * (0.8 + intensity * 1.2);
    if (scale.current > 4.5) scale.current = 0.1;
    ref.current.scale.set(scale.current, scale.current, scale.current);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = Math.max(0, (1 - scale.current / 4.5) * intensity * 0.6);
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 1.0, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

function CentralStatement({ label, color }: { label: string; color: string }) {
  return (
    <Html position={[0, 0, 0]} center>
      <div style={{ padding: '8px 16px', borderRadius: '10px', border: `2px solid ${color}`, background: `${color}18`, backdropFilter: 'blur(8px)', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', boxShadow: `0 0 24px ${color}40` }}>
        {label}
      </div>
    </Html>
  );
}

export function RoadmapPressureChamber() {
  const [stateIdx, setStateIdx] = useState(0);
  const [activePod, setActivePod] = useState<number | null>(null);
  const current = ROADMAP_STATES[stateIdx];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>T1-05 · Roadmap Pressure Chamber</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          {ROADMAP_STATES.map((s, i) => (
            <button key={s.id} onClick={() => { setStateIdx(i); setActivePod(null); }}
              style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${stateIdx === i ? s.color : 'var(--ed-rule)'}`, background: stateIdx === i ? `${s.color}20` : 'var(--ed-card)', color: stateIdx === i ? s.color : 'var(--ed-ink3)', transition: 'all 0.15s', fontFamily: "'JetBrains Mono', monospace" }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={canvasStyle}>
        <Canvas camera={{ position: [0, 0, 9], fov: 52 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[0, 0, 4]} intensity={0.8} color={current.color} />
          <Suspense fallback={null}>
            <CentralStatement label={current.label} color={current.color} />
            <RippleRing intensity={current.rippleIntensity} color={current.color} />
            <RippleRing intensity={current.rippleIntensity * 0.6} color={current.color} />
            {current.pods.map((pod, i) => (
              <PressurePod
                key={pod.name}
                position={POD_POSITIONS[i]}
                tension={pod.tension}
                color={current.color}
                name={pod.name}
                active={activePod === i}
              />
            ))}
          </Suspense>
          <OrbitControls enablePan={false} minDistance={6} maxDistance={14} />
        </Canvas>
      </div>

      {/* Pod reactions */}
      <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
        {current.pods.map((pod, i) => (
          <div key={pod.name} style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--ed-card)', border: `1px solid ${current.color}30`, borderTop: `3px solid ${current.color}` }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: current.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '4px' }}>{pod.name.toUpperCase()}</div>
            <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{pod.reaction}</div>
            <div style={{ marginTop: '6px', height: '3px', borderRadius: '2px', background: 'var(--ed-rule)', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${pod.tension * 100}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: current.color, borderRadius: '2px' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '10px', padding: '10px 16px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', fontSize: '12px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
        One word changes everything. The same feature — different label — creates completely different pressure across every team.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// T2-02 · STAKEHOLDER CALIBRATION ROOM
// ─────────────────────────────────────────
const CAL_PODS = [
  {
    name: 'Sales',    color: '#E67E22',
    wants: 'Broader feature promises to close deals',
    fears: 'Losing deals to competitors with a stronger roadmap story',
    trusts: 'Customer quotes, competitive comparison, pipeline data',
    position: [2.5, 1.5, 0] as [number, number, number],
  },
  {
    name: 'Engineering', color: '#3A86FF',
    wants: 'Narrower, stable scope to hit committed date',
    fears: 'Scope creep that breaks the delivery promise',
    trusts: 'Technical feasibility data, clear non-goals, locked scope',
    position: [2.5, -1.5, 0] as [number, number, number],
  },
  {
    name: 'Leadership', color: '#7843EE',
    wants: 'Clear business outcome with defined risk',
    fears: 'Wasted investment or a miss that looks bad to the board',
    trusts: 'Outcome metrics, strategic tradeoff logic, confidence levels',
    position: [0, 2.8, 0] as [number, number, number],
  },
  {
    name: 'CS', color: '#059669',
    wants: 'Predictable timeline to manage customer expectations',
    fears: 'Getting caught off-guard by a customer asking about something not shipped',
    trusts: 'Specific language guides, launch briefs, clear scope boundaries',
    position: [-2.5, 1.5, 0] as [number, number, number],
  },
  {
    name: 'Design', color: '#C85A40',
    wants: 'Clear user problem and enough discovery time',
    fears: 'Being handed a solution and asked to design around it',
    trusts: 'User research, problem statements, defined constraints',
    position: [-2.5, -1.5, 0] as [number, number, number],
  },
];

function CalibrationPod({ pod, active, onClick }: { pod: typeof CAL_PODS[0]; active: boolean; onClick: () => void }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * (active ? 1.2 : 0.4);
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, active ? 0.6 : 0.1, dt * 5);
  });

  return (
    <group position={pod.position}>
      <mesh ref={ref} onClick={onClick} scale={active ? 1.2 : 1}>
        <dodecahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color={pod.color} transparent opacity={0.8} emissive={pod.color} emissiveIntensity={0.1} />
      </mesh>
      <Html position={[0, 0.85, 0]} center>
        <div onClick={onClick} style={{ fontSize: '10px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: active ? '#fff' : pod.color, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', cursor: 'pointer', padding: '3px 8px', borderRadius: '4px', background: active ? `${pod.color}40` : 'transparent', transition: 'all 0.2s' }}>
          {pod.name}
        </div>
      </Html>
    </group>
  );
}

function CentralTable() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.08, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[1.22, 1.22, 0.02, 32]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.5} />
      </mesh>
      <Html position={[0, 0.2, 0]} center>
        <div style={{ fontSize: '9px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.4 }}>
          AI Workflow<br />Assistant Launch
        </div>
      </Html>
    </group>
  );
}

export function StakeholderCalibrationRoom() {
  const [active, setActive] = useState<number | null>(null);
  const pod = active !== null ? CAL_PODS[active] : null;

  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const, marginBottom: '10px' }}>
        T2-02 · Stakeholder Calibration Room · Click each pod to inspect their incentives
      </div>
      <div style={canvasStyle}>
        <Canvas camera={{ position: [0, 1.5, 9], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 4, 4]} intensity={0.8} color="#ffffff" />
          {CAL_PODS.map((pod, i) => (
            <pointLight key={pod.name} position={pod.position} intensity={active === i ? 0.6 : 0.1} color={pod.color} />
          ))}
          <Suspense fallback={null}>
            <CentralTable />
            {CAL_PODS.map((pod, i) => (
              <CalibrationPod key={pod.name} pod={pod} active={active === i} onClick={() => setActive(active === i ? null : i)} />
            ))}
          </Suspense>
          <OrbitControls enablePan={false} minDistance={6} maxDistance={14} />
        </Canvas>
      </div>

      <AnimatePresence mode="wait">
        {pod ? (
          <motion.div key={pod.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ marginTop: '12px', borderRadius: '10px', border: `1.5px solid ${pod.color}50`, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: `${pod.color}15`, borderBottom: `1px solid ${pod.color}30` }}>
              <span style={{ fontWeight: 700, color: pod.color, fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>{pod.name.toUpperCase()}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
              {[
                { k: 'Wants', v: pod.wants, icon: '→' },
                { k: 'Fears', v: pod.fears, icon: '⚠' },
                { k: 'Trusts', v: pod.trusts, icon: '✓' },
              ].map((row, i) => (
                <div key={row.k} style={{ padding: '12px 16px', borderRight: i < 2 ? `1px solid ${pod.color}20` : 'none' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: pod.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>{row.icon} {row.k.toUpperCase()}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{row.v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ marginTop: '12px', padding: '10px 16px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', fontSize: '12px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
            Good alignment starts before the meeting. Inspect each stakeholder — understand what they want, fear, and trust before you frame your message.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────
// T2-04 · EXEC REVIEW THEATER
// ─────────────────────────────────────────
type BlockType = 'main' | 'appendix';
const EXEC_BLOCKS: { id: string; label: string; correct: BlockType; color: string; why: string }[] = [
  { id: 'e1', label: 'Enterprise churn: 8% → 5.2%', correct: 'main',     color: '#059669', why: 'This is a business result with direct board relevance. Lead with this.' },
  { id: 'e2', label: 'Sprint velocity: 42 pts avg',  correct: 'appendix', color: '#6b7280', why: 'Velocity is execution data. It belongs in working notes, not exec narrative.' },
  { id: 'e3', label: 'AI adoption: 34% of accounts', correct: 'main',     color: '#60a5fa', why: 'A direct outcome metric — exactly what leadership needs to see.' },
  { id: 'e4', label: '14 feature updates shipped',   correct: 'appendix', color: '#6b7280', why: 'Activity, not outcome. Leadership does not need a feature diary.' },
  { id: 'e5', label: 'SSO delay — 2 deals at risk',  correct: 'main',     color: '#dc2626', why: 'A risk with direct revenue impact. Must be surfaced, not buried.' },
  { id: 'e6', label: 'Design token system launched', correct: 'appendix', color: '#6b7280', why: 'A process improvement. Useful internally, not exec-level.' },
  { id: 'e7', label: 'Q3: AI custom workflow expand', correct: 'main',    color: '#7843EE', why: 'Forward direction. Leadership needs this to allocate resources.' },
  { id: 'e8', label: 'Need eng headcount approval',  correct: 'main',     color: ACCENT,    why: 'A clear leadership ask. This is exactly what a QBR must surface.' },
];

function ExecBlock({ block, placed, correct, feedback, onClick }: { block: typeof EXEC_BLOCKS[0]; placed: boolean; correct: boolean | null; feedback: boolean; onClick: () => void }) {
  const border = feedback ? (correct ? '#059669' : '#dc2626') : placed ? 'var(--ed-rule)' : ACCENT;
  const bg = feedback ? (correct ? '#05966910' : '#dc262610') : placed ? 'var(--ed-card)' : `${ACCENT}08`;

  return (
    <motion.div whileHover={!placed ? { y: -2 } : {}} onClick={!placed ? onClick : undefined}
      style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px', color: 'var(--ed-ink)', cursor: placed ? 'default' : 'pointer', border: `1.5px solid ${border}`, background: bg, opacity: placed ? 0.5 : 1, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '8px' }}>
      {feedback && <span style={{ color: correct ? '#059669' : '#dc2626', fontWeight: 700 }}>{correct ? '✓' : '✗'}</span>}
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: block.color, flexShrink: 0 }} />
      {block.label}
    </motion.div>
  );
}

export function ExecReviewTheater() {
  const [mainSlots, setMainSlots] = useState<string[]>([]);
  const [appendixSlots, setAppendixSlots] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const placed = new Set([...mainSlots, ...appendixSlots]);
  const allPlaced = placed.size === EXEC_BLOCKS.length;

  const place = (zone: BlockType) => {
    if (!selected) return;
    if (zone === 'main') setMainSlots(prev => [...prev, selected]);
    else setAppendixSlots(prev => [...prev, selected]);
    setSelected(null);
  };

  const correctFor = (id: string) => EXEC_BLOCKS.find(b => b.id === id)!.correct;
  const score = mainSlots.filter(id => correctFor(id) === 'main').length + appendixSlots.filter(id => correctFor(id) === 'appendix').length;

  return (
    <div style={{ margin: '32px 0', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ background: `rgba(${ACCENT.slice(1).match(/../g)!.map(h => parseInt(h, 16)).join(',')},0.08)`, borderBottom: '1px solid var(--ed-rule)', padding: '14px 20px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>T2-04 · Exec Review Theater</div>
        <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '3px' }}>
          {selected ? `"${EXEC_BLOCKS.find(b => b.id === selected)!.label}" selected — click Executive Narrative or Appendix to place it` : 'Click a content block to select it, then place it in the right zone.'}
        </div>
      </div>
      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '16px' }}>
        {/* Available blocks */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>RAW CONTENT</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {EXEC_BLOCKS.filter(b => !placed.has(b.id)).map(block => (
              <ExecBlock key={block.id} block={block} placed={false} correct={null} feedback={false}
                onClick={() => setSelected(selected === block.id ? null : block.id)} />
            ))}
          </div>
        </div>

        {/* Drop zones */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          {(['main', 'appendix'] as const).map(zone => (
            <motion.div key={zone} whileHover={selected ? { scale: 1.01 } : {}} onClick={() => place(zone)}
              style={{ flex: 1, padding: '14px', borderRadius: '10px', border: `2px dashed ${selected ? (zone === 'main' ? '#059669' : '#6b7280') : 'var(--ed-rule)'}`, cursor: selected ? 'pointer' : 'default', background: selected ? (zone === 'main' ? '#05966908' : 'rgba(107,114,128,0.05)') : 'var(--ed-card)', minHeight: '140px', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: zone === 'main' ? '#059669' : '#6b7280', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>
                {zone === 'main' ? '⬡ EXECUTIVE NARRATIVE' : '≡ APPENDIX'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                {(zone === 'main' ? mainSlots : appendixSlots).map(id => {
                  const block = EXEC_BLOCKS.find(b => b.id === id)!;
                  const isCorrect = block.correct === zone;
                  return (
                    <div key={id} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', background: revealed ? (isCorrect ? '#05966915' : '#dc262615') : 'var(--ed-cream)', border: `1px solid ${revealed ? (isCorrect ? '#059669' : '#dc2626') : 'var(--ed-rule)'}`, color: 'var(--ed-ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {revealed && <span style={{ color: isCorrect ? '#059669' : '#dc2626', fontWeight: 700 }}>{isCorrect ? '✓' : '✗'}</span>}
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: block.color, flexShrink: 0 }} />
                      {block.label}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Score / instructions */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>EXEC RULE</div>
          <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.65 }}>
            Executive Narrative = outcomes, risk, direction, ask.<br /><br />
            Appendix = activity, implementation, internal process.
          </div>
          {allPlaced && !revealed && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setRevealed(true)}
              style={{ marginTop: 'auto', padding: '10px', borderRadius: '8px', background: ACCENT, color: '#fff', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Check answers →
            </motion.button>
          )}
          {revealed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ marginTop: 'auto', padding: '12px', borderRadius: '8px', background: score >= 6 ? `${ACCENT}15` : 'var(--ed-cream)', border: `1px solid ${score >= 6 ? ACCENT : 'var(--ed-rule)'}`, textAlign: 'center' as const }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{score >= 6 ? '🎯' : '📊'}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 700, color: ACCENT }}>{score}/8</div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', marginTop: '4px' }}>correct placements</div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Reasoning for wrong placements */}
      {revealed && [...mainSlots, ...appendixSlots].filter(id => EXEC_BLOCKS.find(b => b.id === id)!.correct !== (mainSlots.includes(id) ? 'main' : 'appendix')).map(id => {
        const block = EXEC_BLOCKS.find(b => b.id === id)!;
        return (
          <div key={id} style={{ margin: '0 20px 10px', padding: '10px 14px', borderRadius: '8px', background: '#fef2f220', border: '1px solid #dc262640', fontSize: '12px', color: '#fca5a5' }}>
            <strong>{block.label}</strong> — {block.why}
          </div>
        );
      })}
    </div>
  );
}

'use client';

import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ─── Shared ────────────────────────────────────────────────────────────────────
function ReplayBtn({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.button onClick={onReplay} whileHover={{ opacity: 0.75, scale: 1.03 }} whileTap={{ scale: 0.96 }}
      style={{ marginTop: '16px', padding: '7px 22px', borderRadius: '10px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--ed-rule)', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>
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

// ─── 1. ABANDONMENT TIMELINE ──────────────────────────────────────────────────
// A cinematic horizontal timeline showing a user's 45-second wait.
// The cursor moves confidently, then slows at second 12, then leaves at second 18.
// Teaches: users abandon uncertain UIs, not slow ones. 12 seconds = the threshold.

const TIMELINE_BEATS = [
  { t: 0,  label: 'Upload starts',           cursor: 'moving',    zone: 'safe',    note: 'User is patient. System is processing.' },
  { t: 6,  label: 'Still processing…',        cursor: 'moving',    zone: 'safe',    note: 'No feedback yet. User assumes it\'s working.' },
  { t: 12, label: '⚠ Uncertainty kicks in',  cursor: 'slowing',   zone: 'danger',  note: 'No progress signal. User doesn\'t know if it\'s working.' },
  { t: 18, label: 'Cursor moves to tab bar', cursor: 'leaving',   zone: 'danger',  note: 'Leaving is now more logical than waiting.' },
  { t: 25, label: 'User abandons',           cursor: 'gone',      zone: 'lost',    note: 'Task incomplete. 40% of users leave here.' },
];

export function AbandonmentTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [elapsed, setElapsed] = useState(-1);
  const [tick, setTick] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!inView) return;
    setElapsed(-1);
    const t = setTimeout(() => {
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed(e => {
          if (e >= 45) { if (timerRef.current) clearInterval(timerRef.current); return 45; }
          return e + 0.5;
        });
      }, 80);
    }, 500);
    return () => { clearTimeout(t); if (timerRef.current) clearInterval(timerRef.current); };
  }, [inView, tick]);

  const replay = () => { if (timerRef.current) clearInterval(timerRef.current); setElapsed(-1); setTick(t => t + 1); };
  const pct = Math.min((elapsed / 45) * 100, 100);
  const activeBeat = TIMELINE_BEATS.reduce((acc, b) => b.t <= elapsed ? b : acc, TIMELINE_BEATS[0]);
  const zone = elapsed < 12 ? 'safe' : elapsed < 25 ? 'danger' : 'lost';
  const zoneColor = zone === 'safe' ? '#22C55E' : zone === 'danger' ? '#F59E0B' : '#EF4444';

  // Cursor position
  const cursorX = elapsed < 12 ? pct * 0.6 : elapsed < 18 ? 72 + (elapsed - 12) * 3 : 90;
  const cursorY = elapsed < 18 ? 50 : 50 - (elapsed - 18) * 4;
  const cursorOpacity = elapsed >= 25 ? 0 : 1;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>The 12-second threshold — users abandon uncertain UIs, not slow ones</VizLabel>

      <div style={{ borderRadius: '24px', overflow: 'hidden', background: 'linear-gradient(170deg, #0A1220 0%, #0D1929 100%)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 56px rgba(0,0,0,0.3)', padding: '32px 28px' }}>

        {/* Live clock */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', marginBottom: '4px' }}>ELAPSED TIME</div>
            <div style={{ fontFamily: 'monospace', fontSize: '42px', fontWeight: 900, color: zoneColor, lineHeight: 1, transition: 'color 0.5s' }}>
              {elapsed < 0 ? '00' : String(Math.floor(elapsed)).padStart(2, '0')}<span style={{ fontSize: '20px', opacity: 0.5 }}>s</span>
            </div>
          </div>
          <div style={{ padding: '10px 18px', borderRadius: '12px', background: `${zoneColor}18`, border: `1.5px solid ${zoneColor}40`, transition: 'all 0.5s' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: zoneColor, letterSpacing: '0.14em', marginBottom: '3px' }}>
              {zone === 'safe' ? 'SAFE ZONE' : zone === 'danger' ? '⚠ DANGER ZONE' : '✕ USER LOST'}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{activeBeat.note}</div>
          </div>
        </div>

        {/* Timeline bar */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <div style={{ height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${pct}%` }} style={{ height: '100%', background: `linear-gradient(90deg, #22C55E 0%, #22C55E 26%, #F59E0B 26.1%, #F59E0B 55%, #EF4444 55.1%, #EF4444 100%)`, borderRadius: '6px' }} transition={{ duration: 0.08 }} />
          </div>
          {/* Zone markers */}
          <div style={{ position: 'absolute', top: '-18px', left: '26.6%', transform: 'translateX(-50%)' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#F59E0B', fontWeight: 800 }}>12s</div>
          </div>
          <div style={{ position: 'absolute', top: '-18px', left: '55.5%', transform: 'translateX(-50%)' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#EF4444', fontWeight: 800 }}>25s</div>
          </div>
        </div>

        {/* Cursor simulation area */}
        <div style={{ height: '120px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ position: 'absolute', top: '12px', left: '14px', fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>EdSpark · Uploading recording…</div>
          {/* Fake upload button */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '10px 24px', borderRadius: '8px', background: elapsed >= 25 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)', border: `1px solid ${elapsed >= 25 ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.12)'}`, fontFamily: 'monospace', fontSize: '11px', color: elapsed >= 25 ? '#EF4444' : 'rgba(255,255,255,0.6)', transition: 'all 0.4s' }}>
            {elapsed >= 25 ? 'Analysis failed (user left)' : 'Analyzing recording…'}
          </div>
          {/* Cursor */}
          {elapsed >= 0 && (
            <motion.div
              animate={{ left: `${cursorX}%`, top: `${cursorY}%`, opacity: cursorOpacity }}
              transition={{ duration: 0.3, ease: 'linear' }}
              style={{ position: 'absolute', fontSize: '18px', pointerEvents: 'none', filter: `drop-shadow(0 2px 6px ${zoneColor}60)`, userSelect: 'none' }}>
              ↖
            </motion.div>
          )}
        </div>

        {/* Beat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {TIMELINE_BEATS.map((b, i) => {
            const past = elapsed >= b.t;
            const active = activeBeat.t === b.t;
            const color = b.zone === 'safe' ? '#22C55E' : b.zone === 'danger' ? '#F59E0B' : '#EF4444';
            return (
              <motion.div key={i} animate={{ opacity: past ? 1 : 0.3, scale: active ? 1.04 : 1 }}
                style={{ padding: '10px 10px', borderRadius: '10px', background: past ? `${color}14` : 'rgba(255,255,255,0.03)', border: `1px solid ${past ? color + '35' : 'rgba(255,255,255,0.06)'}`, transition: 'background 0.4s, border-color 0.4s' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '9px', color: color, fontWeight: 800, marginBottom: '4px' }}>{b.t}s</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4, fontWeight: 600 }}>{b.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#F59E0B' }}>The fix costs nothing:</strong> a progress bar, a status label (&ldquo;Extracting coaching moments…&rdquo;), and a time estimate. Three lines of spec. Users who see progress wait indefinitely. Users who see silence leave at 12 seconds.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 2. UI STATE GALAXY (Three.js) ────────────────────────────────────────────
// The happy path is the central star. All other UI states — Loading, Error,
// Empty, Edge — orbit it as planets. A spec that only covers the sun is incomplete.
// Teaches: every screen needs 5 states specced, not just the success state.

const UI_STATES = [
  { id: 'happy',   label: 'Success State',  sub: 'The happy path — what you spec first',   color: '#F59E0B', emissive: '#D97706', r: 0.7,  orbit: 0,   speed: 0, angle: 0, desc: 'The state everyone designs. Shows the data, complete and correct. But it\'s only one of five.' },
  { id: 'loading', label: 'Loading State',  sub: '"Analyzing recording…" for 45 seconds',  color: '#6366F1', emissive: '#4338CA', r: 0.45, orbit: 2.4, speed: 0.4, angle: 0, desc: 'What does the user see while waiting? A blank button? A spinner? A progress bar? This state is used constantly — and rarely specced.' },
  { id: 'error',   label: 'Error State',    sub: '"Something went wrong" tells users nothing', color: '#EF4444', emissive: '#B91C1C', r: 0.4,  orbit: 3.6, speed: 0.25, angle: 1.6, desc: 'What happens when the upload fails? Does the user know why? Can they retry? Error states written by engineers look like stack traces.' },
  { id: 'empty',   label: 'Empty State',    sub: 'First-use: no data yet',                 color: '#22C55E', emissive: '#15803D', r: 0.35, orbit: 4.8, speed: 0.18, angle: 3.2, desc: 'What does a new user see before any recordings exist? A blank screen is abandonment-inducing. Empty states need guidance.' },
  { id: 'edge',    label: 'Edge State',     sub: '200-character title, 5MB file, 3 users',  color: '#94A3B8', emissive: '#64748B', r: 0.3,  orbit: 6.0, speed: 0.12, angle: 4.8, desc: 'What happens at the limits? A 200-character filename truncated badly. A file that\'s 1MB over the limit with no guidance. Engineers improvise edge states.' },
];

function GalaxyScene({ onSelect }: { onSelect: (id: string) => void }) {
  const anglesRef = useRef(UI_STATES.map(s => s.angle));
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    // Orbit planets
    UI_STATES.forEach((s, i) => {
      if (s.orbit === 0 || !meshRefs.current[i]) return;
      anglesRef.current[i] += s.speed * delta;
      const a = anglesRef.current[i];
      meshRefs.current[i]!.position.set(
        s.orbit * Math.cos(a),
        Math.sin(a * 0.6) * 0.4,
        s.orbit * Math.sin(a),
      );
    });
    // Pulse sun
    if (sunRef.current) {
      const mat = sunRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.002) * 0.2;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[2, 6, 12]} fov={48} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={4} color="#F59E0B" distance={12} decay={2} />
      <pointLight position={[8, 4, 0]} intensity={0.8} color="#6366F1" />
      <pointLight position={[-6, -2, 4]} intensity={0.5} color="#22C55E" />

      {/* Orbit rings */}
      {UI_STATES.slice(1).map((s, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[s.orbit, 0.02, 8, 80]} />
          <meshBasicMaterial color={s.color} transparent opacity={0.12} />
        </mesh>
      ))}

      {/* State spheres */}
      {UI_STATES.map((s, i) => (
        <mesh
          key={s.id}
          ref={el => { meshRefs.current[i] = el; if (i === 0) (sunRef.current as unknown) = el; }}
          position={s.orbit === 0 ? [0, 0, 0] : [s.orbit, 0, 0]}
          onClick={() => onSelect(s.id)}
        >
          <sphereGeometry args={[s.r, 32, 32]} />
          <meshStandardMaterial color={s.color} emissive={s.emissive} emissiveIntensity={s.orbit === 0 ? 0.6 : 0.2} roughness={0.25} metalness={0.3} />
          <Html distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', fontWeight: 800, color: s.color, whiteSpace: 'nowrap', textShadow: `0 0 8px ${s.color}` }}>
              {s.label}
            </div>
          </Html>
        </mesh>
      ))}

      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.35} />
    </>
  );
}

export function UIStateGalaxy() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setStarted(true), 400);
    return () => clearTimeout(t);
  }, [inView]);

  const selectedState = UI_STATES.find(s => s.id === selected);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>UI State Galaxy — a spec that covers only the happy path is missing 4 planets</VizLabel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'center' }}>
        <div style={{ borderRadius: '20px', overflow: 'hidden', height: '480px', background: 'radial-gradient(ellipse at center, #0D1929 0%, #060D14 100%)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 56px rgba(0,0,0,0.35)' }}>
          <Suspense fallback={<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: '12px' }}>Loading galaxy…</div>}>
            <Canvas>
              {started && <GalaxyScene onSelect={setSelected} />}
            </Canvas>
          </Suspense>
        </div>

        <div>
          <AnimatePresence mode="wait">
            {selectedState ? (
              <motion.div key={selectedState.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <div style={{ padding: '20px', borderRadius: '16px', background: `${selectedState.color}14`, border: `1.5px solid ${selectedState.color}40`, borderLeft: `4px solid ${selectedState.color}`, marginBottom: '12px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: selectedState.color, letterSpacing: '0.14em', marginBottom: '8px' }}>{selectedState.label.toUpperCase()}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '8px', lineHeight: 1.4 }}>{selectedState.sub}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{selectedState.desc}</div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', fontStyle: 'italic', marginBottom: '16px' }}>Click any planet to see what that state requires in a spec.</div>
                {UI_STATES.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer' }} onClick={() => setSelected(s.id)}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color, boxShadow: `0 0 6px ${s.color}80`, flexShrink: 0 }} />
                    <div style={{ fontSize: '12px', fontWeight: 700, color: s.color }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>The PM&apos;s spec checklist:</strong> for every screen — what does loading look like? What does an error say? What does a first-time user see before any data exists? What breaks at the edges? If you can&apos;t answer all four, the spec is incomplete.
      </div>
    </div>
  );
}

// ─── 3. FIGMA BEFORE/AFTER ────────────────────────────────────────────────────
// A working Figma window mockup with two artboards: Before (silence) and After
// (progress bar + label + time estimate). The After artboard plays the animation live.
// Teaches: the minimum viable fix — 3 additions moved completion from 30% to 58%.

export function FigmaBeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setProgress(0); setRunning(false);
    const t1 = setTimeout(() => setRunning(true), 800);
    return () => clearTimeout(t1);
  }, [inView, tick]);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(iv); return 100; }
        return p + 1.2;
      });
    }, 60);
    return () => clearInterval(iv);
  }, [running]);

  const replay = () => { setProgress(0); setRunning(false); setTick(t => t + 1); };
  const timeLeft = Math.max(0, Math.round(45 * (1 - progress / 100)));

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Figma — the minimum viable fix: 3 additions, +28 points completion</VizLabel>

      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 24px 56px rgba(0,0,0,0.15)' }}>
        {/* Figma title bar */}
        <div style={{ background: '#1E1E1E', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ width: '20px', height: '20px', borderRadius: '5px', background: 'linear-gradient(135deg, #F24E1E, #FF7262)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900, color: '#fff', flexShrink: 0 }}>F</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, flex: 1 }}>
            EdSpark App &middot; onboarding-upload-states.fig
          </div>
          {/* Zoom */}
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }}>75%</div>
        </div>

        {/* Figma body */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 220px', background: '#2C2C2C', minHeight: '400px' }}>
          {/* Left panel — layers */}
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', padding: '12px 10px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '10px' }}>LAYERS</div>
            {['📄 Frame — Before', '  □ Button', '  T Label "Analyzing…"', '📄 Frame — After', '  □ Button', '  ░ Progress bar', '  T Status label', '  T Time estimate'].map((l, i) => (
              <div key={i} style={{ fontFamily: 'monospace', fontSize: '10px', color: i === 3 ? '#F24E1E' : 'rgba(255,255,255,0.45)', padding: '3px 4px', borderRadius: '3px', background: i === 3 ? 'rgba(242,78,30,0.1)' : 'transparent', marginBottom: '2px', whiteSpace: 'nowrap' as const }}>
                {l}
              </div>
            ))}
          </div>

          {/* Canvas */}
          <div style={{ background: '#383838', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', padding: '40px', alignItems: 'center', justifyItems: 'center' }}>
            {/* Before artboard */}
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginBottom: '10px', textAlign: 'center' as const }}>BEFORE</div>
              <div style={{ width: '200px', background: '#F8F7F5', borderRadius: '12px', padding: '28px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                <div style={{ height: '6px', background: '#E5E2DD', borderRadius: '3px', marginBottom: '20px' }} />
                <div style={{ height: '6px', background: '#E5E2DD', borderRadius: '3px', width: '70%', marginBottom: '28px' }} />
                <div style={{ padding: '11px 20px', borderRadius: '8px', background: '#6B6B6B', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Analyzing recording…</div>
                </div>
                <div style={{ marginTop: '12px', textAlign: 'center' as const, fontSize: '10px', color: '#999' }}>⠋</div>
              </div>
              <div style={{ marginTop: '10px', textAlign: 'center' as const, padding: '6px 10px', borderRadius: '8px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#EF4444', fontWeight: 700 }}>30% completion</div>
              </div>
            </div>

            {/* After artboard */}
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#28C840', marginBottom: '10px', textAlign: 'center' as const }}>AFTER ✓</div>
              <div style={{ width: '200px', background: '#F8F7F5', borderRadius: '12px', padding: '28px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', border: '2px solid rgba(40,200,64,0.4)' }}>
                <div style={{ height: '6px', background: '#E5E2DD', borderRadius: '3px', marginBottom: '20px' }} />
                <div style={{ height: '6px', background: '#E5E2DD', borderRadius: '3px', width: '70%', marginBottom: '20px' }} />
                {/* Progress bar */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontSize: '10px', color: '#4B5563', fontWeight: 600 }}>
                      {progress < 100 ? 'Extracting coaching moments…' : 'Analysis complete ✓'}
                    </div>
                    <div style={{ fontSize: '10px', color: '#6366F1', fontWeight: 800, fontFamily: 'monospace' }}>{Math.round(progress)}%</div>
                  </div>
                  <div style={{ height: '6px', background: '#E5E2DD', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: '#6366F1', borderRadius: '3px' }} transition={{ duration: 0.06 }} />
                  </div>
                </div>
                {/* Time estimate */}
                <div style={{ textAlign: 'center' as const, fontSize: '10px', color: '#9CA3AF', marginBottom: '12px' }}>
                  {progress < 100 ? `~${timeLeft}s remaining` : 'Done!'}
                </div>
                <div style={{ padding: '11px 20px', borderRadius: '8px', background: '#6366F1', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Processing…</div>
                </div>
              </div>
              <div style={{ marginTop: '10px', textAlign: 'center' as const, padding: '6px 10px', borderRadius: '8px', background: 'rgba(40,200,64,0.15)', border: '1px solid rgba(40,200,64,0.3)' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#28C840', fontWeight: 700 }}>58% completion ↑</div>
              </div>
            </div>
          </div>

          {/* Right panel — properties */}
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '12px 10px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '10px' }}>WHAT CHANGED</div>
            {[
              { label: '+ Progress bar', color: '#6366F1', note: 'Shows forward motion' },
              { label: '+ Status label', color: '#0EA5E9', note: '"Extracting coaching moments"' },
              { label: '+ Time estimate', color: '#22C55E', note: '"~38s remaining"' },
            ].map((c, i) => (
              <div key={i} style={{ padding: '8px 10px', borderRadius: '8px', background: `${c.color}12`, border: `1px solid ${c.color}30`, marginBottom: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: c.color, marginBottom: '3px' }}>{c.label}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{c.note}</div>
              </div>
            ))}
            <div style={{ marginTop: '12px', padding: '8px 10px', borderRadius: '8px', background: 'rgba(40,200,64,0.1)', border: '1px solid rgba(40,200,64,0.25)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#28C840', fontWeight: 800, marginBottom: '4px' }}>RESULT</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>30% → 58% completion. No backend changes.</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>The lesson:</strong> the spec didn&apos;t say what the loading state should look like. So it shipped as a blank button. Three lines of spec text — that&apos;s all this fix required.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 4. SESSION HEATMAP REPLAY ────────────────────────────────────────────────
// 8 users' cursor paths overlaid on a single UI. Confusion clusters visually.
// Teaches: session recordings show WHY — the exact moment confusion hit.

const SESSION_PATHS = [
  { color: '#6366F1', path: [{ x: 15, y: 60 }, { x: 35, y: 60 }, { x: 55, y: 55 }, { x: 55, y: 55 }, { x: 55, y: 55 }, { x: 40, y: 70 }], stopped: 4 },
  { color: '#0EA5E9', path: [{ x: 20, y: 50 }, { x: 45, y: 55 }, { x: 55, y: 58 }, { x: 55, y: 58 }, { x: 60, y: 65 }, { x: 60, y: 65 }], stopped: 3 },
  { color: '#22C55E', path: [{ x: 10, y: 70 }, { x: 30, y: 65 }, { x: 50, y: 60 }, { x: 55, y: 57 }, { x: 55, y: 57 }, { x: 45, y: 80 }], stopped: 4 },
  { color: '#F59E0B', path: [{ x: 25, y: 45 }, { x: 40, y: 52 }, { x: 55, y: 56 }, { x: 55, y: 56 }, { x: 58, y: 62 }, { x: 65, y: 55 }], stopped: 3 },
  { color: '#EF4444', path: [{ x: 18, y: 65 }, { x: 38, y: 60 }, { x: 55, y: 58 }, { x: 55, y: 58 }, { x: 55, y: 58 }, { x: 35, y: 75 }], stopped: 4 },
  { color: '#8B5CF6', path: [{ x: 22, y: 55 }, { x: 42, y: 58 }, { x: 54, y: 59 }, { x: 54, y: 59 }, { x: 60, y: 68 }, { x: 55, y: 75 }], stopped: 3 },
  { color: '#EC4899', path: [{ x: 12, y: 72 }, { x: 32, y: 63 }, { x: 52, y: 60 }, { x: 55, y: 58 }, { x: 55, y: 58 }, { x: 50, y: 70 }], stopped: 4 },
  { color: '#14B8A6', path: [{ x: 28, y: 48 }, { x: 44, y: 54 }, { x: 55, y: 57 }, { x: 55, y: 57 }, { x: 62, y: 60 }, { x: 68, y: 52 }], stopped: 3 },
];

export function SessionHeatmap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [frame, setFrame] = useState(-1);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setFrame(-1);
    const t = setTimeout(() => {
      let f = 0;
      const iv = setInterval(() => {
        f++;
        setFrame(f);
        if (f >= 5) clearInterval(iv);
      }, 700);
    }, 600);
    return () => clearTimeout(t);
  }, [inView, tick]);

  const replay = () => { setFrame(-1); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Session replay heatmap — 8 users, one UI, one confusion point</VizLabel>

      <div style={{ borderRadius: '20px', overflow: 'hidden', background: '#0D1117', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 56px rgba(0,0,0,0.3)' }}>
        {/* Dovetail-style header */}
        <div style={{ background: '#161B22', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>Dovetail &middot; Session Recording &middot; EdSpark Upload Flow &middot; 8 sessions</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            {SESSION_PATHS.map((s, i) => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, opacity: frame >= 0 ? 1 : 0.3, transition: 'opacity 0.4s' }} />
            ))}
          </div>
        </div>

        {/* The UI being replayed */}
        <div style={{ position: 'relative', height: '280px', background: '#F9F8F6' }}>
          {/* Fake UI elements */}
          <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', height: '28px', background: '#E8E5E0', borderRadius: '6px' }} />
          <div style={{ position: 'absolute', top: '52px', left: '14px', width: '55%', height: '18px', background: '#E8E5E0', borderRadius: '4px' }} />
          <div style={{ position: 'absolute', top: '78px', left: '14px', width: '40%', height: '14px', background: '#E8E5E0', borderRadius: '4px' }} />
          {/* THE problematic button */}
          <div style={{ position: 'absolute', top: '44%', left: '44%', transform: 'translate(-50%, -50%)', padding: '10px 24px', borderRadius: '8px', background: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 1s linear infinite' }} />
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Analyzing…</div>
          </div>
          {/* Confusion marker */}
          {frame >= 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              style={{ position: 'absolute', top: '33%', left: '42%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239,68,68,0.15)', border: '2px dashed rgba(239,68,68,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#EF4444', fontWeight: 800, textAlign: 'center' as const, lineHeight: 1.3 }}>8/8<br />users<br />paused</div>
            </motion.div>
          )}
          {/* Cursor paths */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
            {SESSION_PATHS.map((s, si) => {
              if (frame < 0) return null;
              const pts = s.path.slice(0, Math.min(frame + 1, s.path.length));
              const pathStr = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
              const last = pts[pts.length - 1];
              const stopped = frame >= s.stopped;
              return (
                <g key={si}>
                  {pts.length > 1 && <motion.path d={pathStr} fill="none" stroke={s.color} strokeWidth="0.5" opacity="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />}
                  {last && <circle cx={last.x} cy={last.y} r={stopped ? 1.2 : 0.8} fill={s.color} opacity={stopped ? 0.9 : 0.7} />}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Insight bar */}
        {frame >= 4 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', borderTop: '1px solid rgba(239,68,68,0.2)' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#EF4444', letterSpacing: '0.1em', marginBottom: '4px', fontWeight: 800 }}>⚠ CLUSTER DETECTED — 8 / 8 SESSIONS</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.65 }}>
              Every user paused at the &ldquo;Analyzing…&rdquo; button. No user abandoned because it was slow — they abandoned because they didn&apos;t know if it was working.
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>What analytics can&apos;t tell you:</strong> why users left. Session recordings show the exact moment confusion hit — the cursor stops moving. No number in your dashboard tells you that.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 5. COMPONENT SPRAWL 3D (Three.js) ────────────────────────────────────────
// 9 button variants floating in 3D chaos. "Apply design system" snaps them to one.
// Teaches: UX debt is invisible until you see it all at once.

const VARIANTS = [
  { color: '#3B82F6', label: 'Primary v1', textColor: '#fff', rounding: 4 },
  { color: '#2563EB', label: 'Primary v2', textColor: '#fff', rounding: 8 },
  { color: '#1D4ED8', label: 'Primary v3', textColor: '#fff', rounding: 12 },
  { color: '#4F46E5', label: 'Action btn', textColor: '#fff', rounding: 6 },
  { color: '#6366F1', label: 'Submit',     textColor: '#fff', rounding: 16 },
  { color: '#7C3AED', label: 'Confirm',    textColor: '#fff', rounding: 3 },
  { color: '#1E40AF', label: 'CTA',        textColor: '#fff', rounding: 10 },
  { color: '#0EA5E9', label: 'Upload btn', textColor: '#fff', rounding: 7 },
  { color: '#0369A1', label: 'Proceed →',  textColor: '#fff', rounding: 20 },
];

const CHAOS_POSITIONS: [number, number, number][] = [
  [-3.5, 2, 0.5], [0, 3, -1], [3.5, 2, 0.5],
  [-4, 0, 1], [0, 0, 2], [4, 0, 1],
  [-3.5, -2, 0.5], [0, -3, -1], [3.5, -2, 0.5],
];

const GRID_POSITIONS: [number, number, number][] = [
  [-3, 1.5, 0], [0, 1.5, 0], [3, 1.5, 0],
  [-3, 0, 0], [0, 0, 0], [3, 0, 0],
  [-3, -1.5, 0], [0, -1.5, 0], [3, -1.5, 0],
];

function SprawlCard({ index, consolidated, variant }: { index: number; consolidated: boolean; variant: typeof VARIANTS[0] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = consolidated ? GRID_POSITIONS[index] : CHAOS_POSITIONS[index];
  const targetColor = consolidated ? '#6366F1' : variant.color;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.position.lerp(new THREE.Vector3(...targetPos), delta * 4);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, consolidated ? 0 : Math.sin(index * 1.3) * 0.2, delta * 3);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, consolidated ? 0 : Math.cos(index * 1.7) * 0.3, delta * 3);
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const tc = new THREE.Color(targetColor);
    mat.color.lerp(tc, delta * 3);
    mat.emissive.lerp(tc, delta * 2);
  });

  return (
    <mesh ref={meshRef} position={CHAOS_POSITIONS[index]} castShadow>
      <boxGeometry args={[2.2, 0.7, 0.18]} />
      <meshStandardMaterial color={variant.color} emissive={variant.color} emissiveIntensity={0.15} roughness={0.25} metalness={0.2} />
      <Html center distanceFactor={7} style={{ pointerEvents: 'none' }}>
        <div style={{ fontSize: '10px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', fontFamily: 'system-ui', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
          {consolidated ? 'Primary Button' : variant.label}
        </div>
      </Html>
    </mesh>
  );
}

function SprawlScene({ consolidated }: { consolidated: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={50} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 10, 6]} intensity={1.2} castShadow />
      <pointLight position={[-6, -4, 4]} intensity={0.6} color="#6366F1" />
      {VARIANTS.map((v, i) => <SprawlCard key={i} index={i} consolidated={consolidated} variant={v} />)}
      <OrbitControls enablePan={false} enableZoom={false} autoRotate={!consolidated} autoRotateSpeed={0.5} />
    </>
  );
}

export function ComponentSprawl3D() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [consolidated, setConsolidated] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setConsolidated(false);
  }, [inView, tick]);

  const replay = () => { setConsolidated(false); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Component sprawl — 9 teams, 9 button variants, zero design system</VizLabel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '20px', alignItems: 'center' }}>
        <div style={{ borderRadius: '20px', overflow: 'hidden', height: '420px', background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 56px rgba(0,0,0,0.3)' }}>
          <Suspense fallback={<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: '12px' }}>Loading 3D scene…</div>}>
            <Canvas shadows>
              <SprawlScene consolidated={consolidated} />
            </Canvas>
          </Suspense>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
          <div style={{ padding: '18px', borderRadius: '16px', background: consolidated ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)', border: `1.5px solid ${consolidated ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.25)'}`, transition: 'all 0.5s' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: consolidated ? '#22C55E' : '#EF4444', letterSpacing: '0.14em', marginBottom: '6px' }}>
              {consolidated ? '✓ DESIGN SYSTEM APPLIED' : '⚠ 9 BUTTON VARIANTS'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink)', fontWeight: 600, lineHeight: 1.5 }}>
              {consolidated
                ? 'One canonical component. Every team ships the same button. 45-minute build time vs 4 hours.'
                : 'Each team built their own version. None is wrong. All are incompatible. This is how UX debt accumulates.'}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setConsolidated(c => !c)}
            style={{
              padding: '14px', borderRadius: '14px', cursor: 'pointer', fontSize: '13px', fontWeight: 800,
              background: consolidated
                ? 'rgba(239,68,68,0.1)'
                : 'linear-gradient(160deg, #22C55E 0%, #15803D 100%)',
              color: consolidated ? '#EF4444' : '#fff',
              border: `1.5px solid ${consolidated ? 'rgba(239,68,68,0.3)' : 'transparent'}`,
              boxShadow: consolidated ? 'none' : '0 6px 0 #15803D, 0 10px 24px rgba(34,197,94,0.4)',
              transition: 'all 0.3s',
            }}>
            {consolidated ? '← Show the sprawl' : '✓ Apply design system'}
          </motion.button>

          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.65 }}>
            {consolidated
              ? 'Before: 4 hours per feature screen. After: 45 minutes. 130 hours recovered annually.'
              : 'Orbit to see all 9 variants. Each was a reasonable decision in isolation.'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>Pitch it as ROI, not infrastructure:</strong> &ldquo;A 6-week design system investment reduces per-feature cost from 4 hours to 45 minutes — 130 hours recovered annually. That&apos;s ~$52k in capacity.&rdquo; Rohan approved on slide 2.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 6. CRAFT DECISION MATRIX ─────────────────────────────────────────────────
// Interactive 2×2: Frequency × Visibility. Click any screen card to get the
// craft investment verdict. Teaches: not every screen deserves equal polish.

const MATRIX_SCREENS = [
  { label: 'Call recording player', freq: 'high', vis: 'high', craft: 'full', note: 'Used 5x/day by every rep. This screen IS the product. Full craft investment justified.', color: '#6366F1', x: 72, y: 22 },
  { label: 'Manager coaching dashboard', freq: 'high', vis: 'high', craft: 'full', note: 'VPs see this in every demo. Retention depends on it. High polish required.', color: '#6366F1', x: 80, y: 38 },
  { label: 'Team analytics feed', freq: 'high', vis: 'low', craft: 'functional+', note: 'Seen daily but internal. Functional with micro-polish on key numbers only.', color: '#0EA5E9', x: 28, y: 28 },
  { label: 'Settings page', freq: 'low', vis: 'low', craft: 'functional', note: 'Set once. Nobody cares about the design. Ship it fast. Don\'t spend more than half a day.', color: '#94A3B8', x: 22, y: 68 },
  { label: 'Billing & invoices', freq: 'low', vis: 'low', craft: 'functional', note: 'Monthly, admin-only. Standard inputs. No animation needed. Copy matters more than design.', color: '#94A3B8', x: 32, y: 78 },
  { label: 'Onboarding flow', freq: 'low', vis: 'high', craft: 'high', note: 'First impression. Enterprise procurement judges by this. 2+ days of craft investment worth it.', color: '#F97316', x: 72, y: 68 },
];

const CRAFT_LEVELS = {
  full: { label: 'Full Craft', color: '#6366F1', desc: 'Motion, micro-interactions, pixel-perfect spacing. Every hover state designed.' },
  'functional+': { label: 'Functional+', color: '#0EA5E9', desc: 'Clean and consistent. Some micro-polish on key numbers. No animation engineering.' },
  high: { label: 'High Polish', color: '#F97316', desc: 'Needs to impress. Onboarding = first impression. Invest 2+ days.' },
  functional: { label: 'Functional Only', color: '#94A3B8', desc: 'Works correctly. Standard components. No animation. Ship in hours, not days.' },
};

export function CraftInvestmentMatrix() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0);
    MATRIX_SCREENS.forEach((_, i) => setTimeout(() => setVisible(i + 1), 400 + i * 350));
  }, [inView, tick]);

  const replay = () => { setVisible(0); setSelected(null); setTick(t => t + 1); };
  const sel = MATRIX_SCREENS.find(s => s.label === selected);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Craft decision matrix — frequency × visibility = how much polish to invest</VizLabel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '20px', alignItems: 'start' }}>
        {/* Matrix */}
        <div style={{ borderRadius: '20px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
          {/* Axis labels */}
          <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr', borderBottom: '1px solid var(--ed-rule)' }}>
            <div />
            {[{ l: 'LOW VISIBILITY', c: '#94A3B8' }, { l: 'HIGH VISIBILITY', c: '#6366F1' }].map((h, i) => (
              <div key={i} style={{ padding: '10px', textAlign: 'center' as const, borderLeft: i > 0 ? '1px solid var(--ed-rule)' : 'none' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: h.c, letterSpacing: '0.12em' }}>{h.l}</div>
              </div>
            ))}
          </div>

          {/* Quadrants */}
          <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
            {/* Row labels */}
            <div style={{ gridRow: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--ed-rule)' }}>
              <div style={{ writingMode: 'vertical-lr' as const, transform: 'rotate(180deg)', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#22C55E', letterSpacing: '0.12em' }}>HIGH FREQ</div>
            </div>
            <div style={{ gridRow: '2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ writingMode: 'vertical-lr' as const, transform: 'rotate(180deg)', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.12em' }}>LOW FREQ</div>
            </div>

            {/* 4 quadrants */}
            {[
              { freq: 'high', vis: 'low',  bg: 'rgba(14,165,233,0.05)',  label: 'Functional+',   color: '#0EA5E9' },
              { freq: 'high', vis: 'high', bg: 'rgba(99,102,241,0.07)', label: 'Full Craft',    color: '#6366F1' },
              { freq: 'low',  vis: 'low',  bg: 'rgba(148,163,184,0.04)', label: 'Functional',    color: '#94A3B8' },
              { freq: 'low',  vis: 'high', bg: 'rgba(249,115,22,0.06)', label: 'High Polish',   color: '#F97316' },
            ].map((q, qi) => (
              <div key={qi} style={{ padding: '16px', minHeight: '160px', background: q.bg, borderLeft: '1px solid var(--ed-rule)', borderTop: qi < 2 ? 'none' : '1px solid var(--ed-rule)', position: 'relative' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: q.color, letterSpacing: '0.12em', marginBottom: '10px' }}>{q.label}</div>
                {MATRIX_SCREENS.filter(s => s.freq === q.freq && s.vis === q.vis).map((s, si) => (
                  <AnimatePresence key={s.label}>
                    {MATRIX_SCREENS.indexOf(s) < visible && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: selected === s.label ? 1.04 : 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        onClick={() => setSelected(selected === s.label ? null : s.label)}
                        style={{ padding: '8px 10px', borderRadius: '10px', background: selected === s.label ? `${s.color}18` : 'var(--ed-card)', border: `1.5px solid ${selected === s.label ? s.color + '50' : 'var(--ed-rule)'}`, cursor: 'pointer', marginBottom: '6px', transition: 'border-color 0.2s, background 0.2s' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.3 }}>{s.label}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div>
          <AnimatePresence mode="wait">
            {sel ? (
              <motion.div key={sel.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
                <div style={{ padding: '20px', borderRadius: '16px', background: `${sel.color}12`, border: `1.5px solid ${sel.color}40`, borderLeft: `4px solid ${sel.color}`, marginBottom: '12px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: sel.color, letterSpacing: '0.14em', marginBottom: '6px' }}>{CRAFT_LEVELS[sel.craft as keyof typeof CRAFT_LEVELS].label.toUpperCase()}</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ed-ink)', marginBottom: '8px' }}>{sel.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7, marginBottom: '10px' }}>{sel.note}</div>
                  <div style={{ height: '1px', background: `${sel.color}30`, marginBottom: '10px' }} />
                  <div style={{ fontSize: '11px', color: sel.color, fontWeight: 600, lineHeight: 1.6 }}>{CRAFT_LEVELS[sel.craft as keyof typeof CRAFT_LEVELS].desc}</div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', fontStyle: 'italic', marginBottom: '16px' }}>Click any screen to see the craft investment verdict.</div>
                {Object.entries(CRAFT_LEVELS).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: v.color, flexShrink: 0 }} />
                    <div style={{ fontSize: '12px', fontWeight: 700, color: v.color }}>{v.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>The discipline:</strong> a completion state used 2×/month doesn&apos;t warrant 2 days of animation engineering. A recording player used 5×/day does. This matrix is your negotiating framework with design.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

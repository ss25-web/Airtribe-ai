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
  const [manual, setManual] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!inView || manual) return;
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
  }, [inView, tick, manual]);

  const replay = () => { if (timerRef.current) clearInterval(timerRef.current); setManual(false); setElapsed(-1); setTick(t => t + 1); };
  const onScrub = (val: number) => { if (timerRef.current) clearInterval(timerRef.current); setManual(true); setElapsed(val); };
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

        {/* Scrubber — learner controls the clock */}
        <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="range" min={0} max={45} step={0.5}
            value={Math.max(0, elapsed)}
            onChange={e => onScrub(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: zoneColor, cursor: 'pointer' }}
            aria-label="Scrub the 45-second timeline"
          />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', minWidth: 86, textAlign: 'right' as const }}>
            {manual ? 'SCRUBBING · paused' : 'AUTO · drag to scrub'}
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
              <div style={{ width: '200px', background: 'var(--ed-card)', borderRadius: '12px', padding: '28px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', border: '2px solid rgba(40,200,64,0.4)' }}>
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

// ─── 5. COMPONENT SPRAWL 3D (Three.js) ────────────────────────────────────────
// 9 button variants floating in 3D chaos. "Apply design system" snaps them to one.
// Teaches: UX debt is invisible until you see it all at once.

// 9 actual rendered button variants — each subtly different.
// The problem is visible the instant you see them together.
// "Apply design system" animates them all to one canonical button.

const BUTTON_VARIANTS = [
  { team: 'Onboarding team',  quarter: 'Q1 2023', bg: '#3B82F6', radius: '4px',  fw: 500, px: '18px', py: '9px',  fs: '13px', ls: '0', text: 'Save Recording' },
  { team: 'Analytics team',   quarter: 'Q2 2023', bg: '#2563EB', radius: '10px', fw: 600, px: '22px', py: '10px', fs: '13px', ls: '0', text: 'Save Recording' },
  { team: 'Mobile team',      quarter: 'Q2 2023', bg: '#1D4ED8', radius: '20px', fw: 700, px: '20px', py: '11px', fs: '12px', ls: '0.04em', text: 'Save Recording' },
  { team: 'Enterprise team',  quarter: 'Q3 2023', bg: '#4F46E5', radius: '6px',  fw: 600, px: '19px', py: '10px', fs: '14px', ls: '0', text: 'Save Recording' },
  { team: 'Settings team',    quarter: 'Q3 2023', bg: '#6366F1', radius: '8px',  fw: 700, px: '24px', py: '12px', fs: '12px', ls: '0.05em', text: 'SAVE RECORDING' },
  { team: 'Reports team',     quarter: 'Q4 2023', bg: '#7C3AED', radius: '3px',  fw: 500, px: '16px', py: '9px',  fs: '13px', ls: '0', text: 'Save Recording' },
  { team: 'Search team',      quarter: 'Q4 2023', bg: '#1E40AF', radius: '12px', fw: 600, px: '20px', py: '10px', fs: '13px', ls: '0.02em', text: 'Save recording' },
  { team: 'Upload team',      quarter: 'Q1 2024', bg: '#0EA5E9', radius: '7px',  fw: 600, px: '21px', py: '11px', fs: '12px', ls: '0', text: 'Save Recording' },
  { team: 'Sharing team',     quarter: 'Q1 2024', bg: '#0369A1', radius: '16px', fw: 700, px: '22px', py: '11px', fs: '13px', ls: '0', text: 'Save Recording →' },
];

const DS_BUTTON = { bg: '#6366F1', radius: '8px', fw: 700, px: '20px', py: '10px', fs: '13px', ls: '0' };

export function ComponentSprawl3D() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [consolidated, setConsolidated] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0); setConsolidated(false);
    BUTTON_VARIANTS.forEach((_, i) => setTimeout(() => setVisible(i + 1), 300 + i * 200));
  }, [inView, tick]);

  const replay = () => { setVisible(0); setConsolidated(false); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Component sprawl — 9 teams, 9 sprints, 9 different "Save Recording" buttons</VizLabel>

      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', background: consolidated ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.05)', borderBottom: '1px solid var(--ed-rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.5s' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: consolidated ? '#22C55E' : '#EF4444', letterSpacing: '0.14em', marginBottom: '3px' }}>
              {consolidated ? '✓ DESIGN SYSTEM APPLIED' : '⚠ UX DEBT ACCUMULATED OVER 4 QUARTERS'}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)' }}>
              {consolidated ? 'One canonical component. 45 min to build. Zero ambiguity.' : 'Same button. 9 teams. 9 reasonable decisions. All incompatible.'}
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setConsolidated(c => !c)}
            style={{
              padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '12px', fontWeight: 800, flexShrink: 0,
              background: consolidated ? 'rgba(239,68,68,0.1)' : 'linear-gradient(160deg, #22C55E 0%, #15803D 100%)',
              color: consolidated ? '#EF4444' : '#fff',
              border: `1.5px solid ${consolidated ? 'rgba(239,68,68,0.3)' : 'transparent'}`,
              boxShadow: consolidated ? 'none' : '0 5px 0 #15803D, 0 8px 20px rgba(34,197,94,0.35)',
              transition: 'all 0.3s',
            }}>
            {consolidated ? '← Show the problem' : '✓ Apply design system'}
          </motion.button>
        </div>

        <div style={{ background: 'var(--ed-card)', padding: '28px 24px' }}>
          <AnimatePresence mode="wait">
            {!consolidated ? (
              /* BEFORE: 3×3 grid of actual rendered buttons */
              <motion.div key="before" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {BUTTON_VARIANTS.map((v, i) => (
                  <AnimatePresence key={i}>
                    {i < visible && (
                      <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                        style={{ padding: '16px', borderRadius: '14px', background: `${v.bg}08`, border: `1.5px solid ${v.bg}30`, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '10px' }}>
                        {/* The actual button */}
                        <div style={{
                          padding: `${v.py} ${v.px}`,
                          borderRadius: v.radius,
                          background: v.bg,
                          fontSize: v.fs,
                          fontWeight: v.fw,
                          color: '#fff',
                          letterSpacing: v.ls,
                          boxShadow: `0 3px 0 ${v.bg}90, 0 4px 10px ${v.bg}40`,
                          inset: `0 1px 0 rgba(255,255,255,0.25)`,
                          fontFamily: 'system-ui, sans-serif',
                          whiteSpace: 'nowrap' as const,
                          textAlign: 'center' as const,
                          minWidth: '120px',
                        }}>
                          {v.text}
                        </div>
                        {/* Team label */}
                        <div style={{ textAlign: 'center' as const }}>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink2)' }}>{v.team}</div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', marginTop: '2px' }}>{v.quarter}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </motion.div>
            ) : (
              /* AFTER: one canonical button prominently centred */
              <motion.div key="after" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', padding: '40px 20px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#22C55E', letterSpacing: '0.16em', marginBottom: '24px' }}>
                  ONE CANONICAL COMPONENT
                </div>
                {/* The single canonical button */}
                <div style={{
                  padding: `${DS_BUTTON.py} ${DS_BUTTON.px}`, borderRadius: DS_BUTTON.radius,
                  background: DS_BUTTON.bg, fontSize: DS_BUTTON.fs, fontWeight: DS_BUTTON.fw,
                  color: '#fff', fontFamily: 'system-ui, sans-serif',
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 0 #3730A3, 0 10px 0 rgba(0,0,0,0.1), 0 18px 40px rgba(99,102,241,0.5)`,
                  marginBottom: '32px',
                }}>
                  Save Recording
                </div>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%', maxWidth: '500px' }}>
                  {[
                    { label: 'Build time', before: '4 hours', after: '45 min', color: '#22C55E' },
                    { label: 'Teams aligned', before: '9 variants', after: '1 spec', color: '#6366F1' },
                    { label: 'Annual savings', before: '—', after: '130 hrs', color: '#F97316' },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' as const, padding: '14px 12px', borderRadius: '14px', background: `${s.color}10`, border: `1.5px solid ${s.color}30` }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: s.color, letterSpacing: '0.12em', marginBottom: '6px' }}>{s.label.toUpperCase()}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', marginBottom: '4px', textDecoration: 'line-through' }}>{s.before}</div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: s.color, fontFamily: 'monospace' }}>{s.after}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>What you&apos;re looking at:</strong> every single one of those buttons was a reasonable decision when it was made. Nobody was wrong. The system accumulated debt because there was no shared constraint.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 6. CRAFT DECISION MATRIX ─────────────────────────────────────────────────
// Interactive 2×2: Frequency × Visibility. Click any screen card to get the
// craft investment verdict. Teaches: not every screen deserves equal polish.

// Four quadrant cards with visual screen thumbnails. Each quadrant has a
// distinct colour, clear label, and example screens shown as mini mockups.
// Click any card to get the craft investment rationale.

const QUADRANTS = [
  {
    freq: 'HIGH', vis: 'LOW', color: '#0EA5E9', dark: '#0369A1', bg: 'rgba(14,165,233,0.08)',
    verdict: 'Functional+', time: '~1 day',
    rule: 'Clean and consistent. Micro-polish on key numbers only. No animation engineering.',
    screens: [
      { name: 'Team analytics feed', usage: 'Daily · internal', icon: '📊',
        note: 'Seen every day but only by managers. Key numbers should be clear. No animation.' },
      { name: 'Rep activity log',    usage: 'Daily · internal', icon: '📋',
        note: 'High frequency but low stakes. Tabular data. Functional with good typography.' },
    ],
  },
  {
    freq: 'HIGH', vis: 'HIGH', color: '#6366F1', dark: '#3730A3', bg: 'rgba(99,102,241,0.08)',
    verdict: 'Full Craft', time: '2–4 days',
    rule: 'Motion, micro-interactions, pixel-perfect spacing. Every hover and error state designed.',
    screens: [
      { name: 'Call recording player', usage: '5× daily · product core', icon: '▶',
        note: 'THIS IS THE PRODUCT. Used 5 times a day. Every pixel earns its place. Full craft.' },
      { name: 'Coaching dashboard',    usage: 'Daily · VP-visible', icon: '🎯',
        note: 'VPs see this in every demo. Retention depends on it. Invest accordingly.' },
    ],
  },
  {
    freq: 'LOW', vis: 'LOW', color: '#94A3B8', dark: '#64748B', bg: 'rgba(148,163,184,0.06)',
    verdict: 'Functional', time: 'Hours',
    rule: 'Works correctly. Standard components. No animation. Ship in hours, not days.',
    screens: [
      { name: 'Account settings',    usage: 'Set once · admin', icon: '⚙️',
        note: 'Users visit once during setup. Nobody judges design here. Copy matters more.' },
      { name: 'Billing & invoices',  usage: 'Monthly · admin',  icon: '💳',
        note: 'Monthly, finance-only. Standard form inputs. Zero animation needed.' },
    ],
  },
  {
    freq: 'LOW', vis: 'HIGH', color: '#F97316', dark: '#C2410C', bg: 'rgba(249,115,22,0.08)',
    verdict: 'High Polish', time: '2–3 days',
    rule: 'First impression. Enterprise procurement judges by this screen. Invest in it.',
    screens: [
      { name: 'Onboarding flow',    usage: 'Once · enterprise demo', icon: '🚀',
        note: 'First thing a new rep sees. Enterprise buyers judge product quality here.' },
      { name: 'Empty state screens', usage: 'Once per user',          icon: '🌟',
        note: 'New users hit these before they see real data. Blank = abandoned. Design it.' },
    ],
  },
];

export function CraftInvestmentMatrix() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0);
    QUADRANTS.forEach((_, i) => setTimeout(() => setVisible(i + 1), 300 + i * 400));
  }, [inView, tick]);

  const replay = () => { setVisible(0); setSelected(null); setTick(t => t + 1); };
  const sel = selected !== null ? QUADRANTS[selected] : null;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Craft decision matrix — frequency × visibility = how much to invest</VizLabel>

      {/* Axis labels + grid */}
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 1fr', background: 'var(--ed-card)', borderBottom: '1px solid var(--ed-rule)' }}>
          <div />
          <div style={{ padding: '12px 16px', textAlign: 'center' as const, borderLeft: '1px solid var(--ed-rule)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.14em' }}>👁 LOW VISIBILITY</div>
            <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '3px' }}>Internal, team-only</div>
          </div>
          <div style={{ padding: '12px 16px', textAlign: 'center' as const, borderLeft: '1px solid var(--ed-rule)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#6366F1', letterSpacing: '0.14em' }}>👁 HIGH VISIBILITY</div>
            <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '3px' }}>Customer-facing, demo-ready</div>
          </div>
        </div>

        {/* 2×2 grid — explicit grid positions so row labels stay in col 1 and
            quadrants land in their correct (row, col). Without these, CSS
            auto-placement was filling row 1 first (label, label, quadrant0)
            and pushing the rest into row 2, causing the overlap.            */}
        <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
          {/* Row labels — pinned to column 1 */}
          {[{ label: '↑ HIGH FREQ', color: '#22C55E', sub: 'Used daily' }, { label: '↓ LOW FREQ', color: '#F59E0B', sub: 'Used monthly' }].map((r, ri) => (
            <div key={ri} style={{ gridColumn: 1, gridRow: ri + 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '8px 0', borderTop: ri > 0 ? '1px solid var(--ed-rule)' : 'none', gap: '4px' }}>
              <div style={{ writingMode: 'vertical-lr' as const, transform: 'rotate(180deg)', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: r.color, letterSpacing: '0.1em' }}>{r.label}</div>
              <div style={{ writingMode: 'vertical-lr' as const, transform: 'rotate(180deg)', fontSize: '9px', color: 'var(--ed-ink3)' }}>{r.sub}</div>
            </div>
          ))}

          {/* 4 quadrant cards: [top-left, top-right, bot-left, bot-right] = [0,1,2,3]
              QUADRANTS order is row-major starting from HIGH FREQ row:
              0=HF×LV (r1c2)  1=HF×HV (r1c3)  2=LF×LV (r2c2)  3=LF×HV (r2c3) */}
          {QUADRANTS.map((q, qi) => {
            const gridCol = (qi % 2 === 0) ? 2 : 3;
            const gridRow = qi < 2 ? 1 : 2;
            return (
            <AnimatePresence key={qi}>
              {qi < visible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  onClick={() => setSelected(selected === qi ? null : qi)}
                  style={{
                    gridColumn: gridCol, gridRow: gridRow,
                    background: selected === qi ? q.bg : 'var(--ed-card)',
                    borderLeft: '1px solid var(--ed-rule)',
                    borderTop: qi < 2 ? 'none' : '1px solid var(--ed-rule)',
                    padding: '18px 16px', cursor: 'pointer',
                    outline: selected === qi ? `2px solid ${q.color}` : 'none',
                    outlineOffset: '-2px',
                    transition: 'background 0.3s, outline 0.3s',
                  }}>
                  {/* Verdict chip */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ padding: '4px 10px', borderRadius: '6px', background: q.color, boxShadow: `0 3px 0 ${q.dark}`, fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.1em' }}>
                      {q.verdict}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '10px', color: q.color, fontWeight: 700 }}>{q.time}</div>
                  </div>
                  {/* Screen cards */}
                  {q.screens.map((s, si) => (
                    <div key={si} style={{ padding: '10px 12px', borderRadius: '10px', background: selected === qi ? 'rgba(255,255,255,0.6)' : 'var(--ed-cream, #F5F0E8)', border: `1px solid ${q.color}25`, marginBottom: si < q.screens.length - 1 ? '8px' : '0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ fontSize: '20px', flexShrink: 0 }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.3 }}>{s.name}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: q.color, marginTop: '2px', fontWeight: 700 }}>{s.usage}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            );
          })}
        </div>
      </div>

      {/* Selected detail */}
      <AnimatePresence>
        {sel && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
            style={{ marginTop: '16px', padding: '18px 20px', borderRadius: '16px', background: `${sel.color}10`, border: `1.5px solid ${sel.color}40`, borderLeft: `4px solid ${sel.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' as const }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: sel.color, letterSpacing: '0.14em', marginBottom: '6px' }}>
                  {sel.verdict.toUpperCase()} — {sel.time} build time
                </div>
                <div style={{ fontSize: '13px', color: 'var(--ed-ink)', fontWeight: 600, lineHeight: 1.65 }}>{sel.rule}</div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {sel.screens.map((s, si) => (
                  <div key={si} style={{ padding: '10px 14px', borderRadius: '12px', background: `${sel.color}18`, border: `1px solid ${sel.color}35`, textAlign: 'center' as const, minWidth: '120px' }}>
                    <div style={{ fontSize: '18px', marginBottom: '4px' }}>{s.icon}</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: sel.color, marginBottom: '3px' }}>{s.name}</div>
                    <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', lineHeight: 1.4 }}>{s.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>The rule:</strong> a completion state used 2×/month doesn&apos;t warrant 2 days of animation engineering. A recording player used 5×/day does. This matrix is your negotiating framework with design — use it.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── UX LAWS ──────────────────────────────────────────────────────────────────

const EXPORT_MANY = ['Export as PDF', 'Export as CSV', 'Export as Excel', 'Export as PowerPoint', 'Share via Slack', 'Share via Email', 'Copy link'];
const EXPORT_FEW  = [{ icon: '⬇', text: 'Download (PDF · CSV · Excel)' }, { icon: '📤', text: 'Share (Slack · Email · Link)' }];

export function HicksLawViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [phase, setPhase] = useState<0|1|2>(0);
  const [ms, setMs] = useState(0);
  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setPhase(0); setMs(0);
    const t1 = setTimeout(() => {
      const start = Date.now();
      ivRef.current = setInterval(() => {
        const e = Date.now() - start;
        setMs(Math.min(e, 2400));
        if (e >= 2400) { if (ivRef.current) clearInterval(ivRef.current); setPhase(1); }
      }, 30);
    }, 600);
    const t2 = setTimeout(() => setPhase(2), 4400);
    return () => { clearTimeout(t1); clearTimeout(t2); if (ivRef.current) clearInterval(ivRef.current); };
  }, [inView, tick]);

  const replay = () => { setPhase(0); setMs(0); if (ivRef.current) clearInterval(ivRef.current); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ padding: '4px 12px', borderRadius: '8px', background: '#6366F1', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.14em', boxShadow: '0 3px 0 #3730A3' }}>HICK&apos;S LAW</div>
        <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', fontWeight: 600 }}>Decision time = b × log₂(n+1) — more choices = slower decisions</div>
      </div>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ padding: '24px 20px', borderRight: '1px solid var(--ed-rule)', background: 'rgba(239,68,68,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#EF4444', letterSpacing: '0.12em' }}>7 OPTIONS</div>
              <div style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: 900, color: '#EF4444' }}>{(Math.min(ms, 2400) / 1000).toFixed(1)}s</div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', marginBottom: '10px', letterSpacing: '0.1em' }}>EXPORT RECORDING</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px', marginBottom: '14px' }}>
              {EXPORT_MANY.map((opt, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                  style={{ padding: '9px 12px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', fontSize: '12px', color: 'var(--ed-ink2)' }}>
                  {opt}
                </motion.div>
              ))}
            </div>
            <div style={{ height: '8px', background: 'var(--ed-rule)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${Math.min((ms / 2400) * 100, 100)}%` }} transition={{ duration: 0.04 }}
                style={{ height: '100%', background: '#EF4444', borderRadius: '4px' }} />
            </div>
            <div style={{ marginTop: '6px', fontSize: '11px', color: '#EF4444', fontFamily: 'monospace', fontWeight: 700 }}>~2.4 seconds to decide</div>
          </div>
          <div style={{ padding: '24px 20px', background: 'rgba(34,197,94,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#22C55E', letterSpacing: '0.12em' }}>2 GROUPS</div>
              <div style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: 900, color: phase >= 1 ? '#22C55E' : 'var(--ed-ink3)' }}>
                {phase >= 2 ? '0.8s' : phase >= 1 ? '…' : '—'}
              </div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', marginBottom: '10px', letterSpacing: '0.1em' }}>EXPORT RECORDING</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '14px' }}>
              {EXPORT_FEW.map((opt, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 6 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }}
                  transition={{ delay: phase >= 1 ? i * 0.1 : 0, duration: 0.35 }}
                  style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(34,197,94,0.08)', border: '1.5px solid rgba(34,197,94,0.25)', fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{opt.icon}</span> {opt.text}
                </motion.div>
              ))}
            </div>
            {phase >= 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ height: '8px', background: 'var(--ed-rule)', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: '33%' }} transition={{ duration: 0.8 }}
                    style={{ height: '100%', background: '#22C55E', borderRadius: '4px' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#22C55E', fontFamily: 'monospace', fontWeight: 700 }}>~0.8 seconds to decide</div>
              </motion.div>
            )}
          </div>
        </div>
        {phase >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: '14px 20px', background: 'rgba(99,102,241,0.07)', borderTop: '1px solid rgba(99,102,241,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)' }}>3× faster. Same 7 actions — better grouped. Zero information lost.</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#6366F1', fontWeight: 800 }}>T = b × log₂(n + 1)</div>
          </motion.div>
        )}
      </div>
      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>PM rule:</strong> every option you add increases decision time for every user, every time. Grouping and chunking restore speed. Don&apos;t ship choices — ship decisions.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

const WIDGETS = [
  { name: 'Session recordings', icon: '▶', core: true },  { name: 'Coaching score', icon: '⭐', core: true },
  { name: 'Team activity', icon: '👥', core: true },       { name: 'Weekly summary', icon: '📋', core: true },
  { name: 'Integration status', icon: '🔗', core: false }, { name: 'Streak tracker', icon: '🔥', core: false },
  { name: 'Peer benchmarks', icon: '📊', core: false },    { name: 'AI suggestions', icon: '🤖', core: false },
  { name: 'Alerts feed', icon: '🔔', core: false },        { name: 'Export shortcuts', icon: '📤', core: false },
  { name: 'Recent activity', icon: '🕐', core: false },    { name: 'Usage analytics', icon: '📈', core: false },
];

export function CognitivLoadViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [showing, setShowing] = useState(0);
  const [tick, setTick] = useState(0);
  const LIMIT = 7;

  useEffect(() => {
    if (!inView) return;
    setShowing(0);
    const iv = setInterval(() => setShowing(n => { if (n >= WIDGETS.length) { clearInterval(iv); return n; } return n + 1; }), 500);
    return () => clearInterval(iv);
  }, [inView, tick]);

  const replay = () => { setShowing(0); setTick(t => t + 1); };
  const overloaded = showing > LIMIT;
  const ramColor = showing <= 4 ? '#22C55E' : showing <= LIMIT ? '#F59E0B' : '#EF4444';

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ padding: '4px 12px', borderRadius: '8px', background: '#F97316', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.14em', boxShadow: '0 3px 0 #C2410C' }}>MILLER&apos;S LAW</div>
        <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', fontWeight: 600 }}>Working memory holds 7 ± 2 items — every element costs a slot</div>
      </div>
      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '24px', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '24px', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em' }}>
                EDSPARK DASHBOARD — {showing} WIDGETS
              </div>
              {overloaded && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ padding: '3px 10px', borderRadius: '6px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', fontFamily: 'monospace', fontSize: '9px', color: '#EF4444', fontWeight: 800 }}>
                  ⚠ OVERLOADED
                </motion.div>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {WIDGETS.slice(0, showing).map((w, i) => (
                <motion.div key={w.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  style={{ padding: '10px', borderRadius: '10px', background: i >= LIMIT ? 'rgba(239,68,68,0.08)' : w.core ? 'rgba(99,102,241,0.07)' : 'var(--ed-card)', border: `1.5px solid ${i >= LIMIT ? 'rgba(239,68,68,0.3)' : w.core ? 'rgba(99,102,241,0.2)' : 'var(--ed-rule)'}`, opacity: i >= LIMIT ? 0.65 : 1 }}>
                  <div style={{ fontSize: '20px', marginBottom: '5px' }}>{w.icon}</div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: i >= LIMIT ? '#EF4444' : 'var(--ed-ink2)', lineHeight: 1.3 }}>{w.name}</div>
                  {!w.core && <div style={{ fontFamily: 'monospace', fontSize: '7px', color: 'var(--ed-ink3)', marginTop: '3px' }}>added later</div>}
                </motion.div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
            <div style={{ padding: '14px', borderRadius: '14px', background: `${ramColor}12`, border: `1.5px solid ${ramColor}35`, transition: 'all 0.5s' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: ramColor, letterSpacing: '0.12em', marginBottom: '6px', transition: 'color 0.5s' }}>WORKING MEMORY</div>
              <div style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'monospace', color: ramColor, transition: 'color 0.5s', lineHeight: 1 }}>{showing}<span style={{ fontSize: '14px', opacity: 0.5 }}>/{LIMIT}</span></div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '4px', lineHeight: 1.4 }}>
                {showing <= 4 ? 'Focused — easy to process' : showing <= LIMIT ? 'Approaching limit' : 'Users stop processing new items'}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '3px' }}>
              {WIDGETS.slice(0, LIMIT + 1).map((w, i) => (
                <motion.div key={i}
                  animate={{ background: i < showing ? (i >= LIMIT ? '#EF4444' : i >= LIMIT - 2 ? '#F59E0B' : '#6366F1') : 'var(--ed-rule)' }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '14px', borderRadius: '4px', display: 'flex', alignItems: 'center', paddingLeft: '6px', fontSize: '10px' }}>
                  {i < showing ? w.icon : ''}
                </motion.div>
              ))}
            </div>
            {overloaded && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ padding: '10px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', fontSize: '10px', color: '#EF4444', fontWeight: 600, lineHeight: 1.55 }}>
                Everything after slot 7 is invisible to most users.
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#F97316' }}>PM rule:</strong> every widget or option you ship consumes a working memory slot. When the budget is exceeded users don&apos;t complain — they stop engaging. The fix is removal, not redesign.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

const STATUS_VARIANTS = [
  { id: 'none',    label: 'No feedback',            icon: '⬛', color: '#EF4444', abandon: 73, waitSec: 12,
    verdict: 'No signal = uncertainty. Leaving feels rational at 12 seconds.' },
  { id: 'spinner', label: 'Spinner only',            icon: '⏳', color: '#F59E0B', abandon: 41, waitSec: 20,
    verdict: 'Better — but no time estimate. Users still leave when patience runs out.' },
  { id: 'full',    label: 'Progress + label + time', icon: '✅', color: '#22C55E', abandon: 12, waitSec: 45,
    verdict: 'Users see forward motion and a time expectation. They wait the full 45s.' },
];

export function VisibilityOfStatusViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [revealed, setRevealed] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setRevealed(0);
    STATUS_VARIANTS.forEach((_, i) => setTimeout(() => setRevealed(i + 1), 500 + i * 1100));
  }, [inView, tick]);

  const replay = () => { setRevealed(0); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ padding: '4px 12px', borderRadius: '8px', background: '#0EA5E9', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.14em', boxShadow: '0 3px 0 #0369A1' }}>NIELSEN #1</div>
        <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', fontWeight: 600 }}>Visibility of System Status — always keep users informed of what is happening</div>
      </div>
      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '24px', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {STATUS_VARIANTS.map((d, i) => (
            <AnimatePresence key={d.id}>
              {i < revealed && (
                <motion.div initial={{ opacity: 0, y: 14, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
                  <div style={{ padding: '20px 16px', borderRadius: '16px', background: 'linear-gradient(160deg, #F8F6F1 0%, #EFECE6 100%)', border: '1px solid var(--ed-rule)', marginBottom: '12px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '8px', minHeight: '110px', justifyContent: 'center' }}>
                    <div style={{ width: '90%', padding: '10px 14px', borderRadius: '8px', background: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {d.id === 'spinner' && <div style={{ width: '11px', height: '11px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', flexShrink: 0 }} />}
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#fff', flex: 1, textAlign: 'center' as const }}>
                        {d.id === 'full' ? 'Extracting coaching moments…' : 'Analyzing recording…'}
                      </div>
                    </div>
                    {d.id === 'full' && <>
                      <div style={{ width: '90%', height: '5px', background: '#E5E2DD', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div animate={{ width: ['0%', '70%', '70%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ height: '100%', background: '#6366F1', borderRadius: '3px' }} />
                      </div>
                      <div style={{ fontSize: '9px', color: '#9CA3AF', fontFamily: 'monospace' }}>~38s remaining</div>
                    </>}
                    {d.id === 'none' && <div style={{ fontSize: '9px', color: '#D1CBC4', fontStyle: 'italic' }}>nothing else visible</div>}
                  </div>
                  <div style={{ padding: '14px', borderRadius: '14px', background: `${d.color}0D`, border: `1.5px solid ${d.color}35`, borderLeft: `4px solid ${d.color}` }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: d.color, letterSpacing: '0.12em', marginBottom: '8px' }}>{d.icon} {d.label.toUpperCase()}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontFamily: 'monospace', fontSize: '28px', fontWeight: 900, color: d.color, lineHeight: 1 }}>{d.abandon}%</div>
                        <div style={{ fontSize: '9px', color: 'var(--ed-ink3)' }}>abandoned</div>
                      </div>
                      <div style={{ textAlign: 'right' as const }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: d.color }}>{d.waitSec}s avg wait</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.55, fontStyle: 'italic' }}>{d.verdict}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#0EA5E9' }}>PM rule (Nielsen #1):</strong> the loading state is not a nice-to-have — it is a feature that directly drives completion rate. If it is not in your spec, your engineer ships option A. That is a PM mistake, not a design gap.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── NIELSEN'S 10 HEURISTICS EVALUATION ──────────────────────────────────────
// Full heuristic audit of EdSpark. Each heuristic shows a real violation in the
// product and the specific fix. PMs use this framework to give designers precise,
// evidence-based feedback — not aesthetic preferences.

const HEURISTICS = [
  {
    n: 1, name: 'Visibility of System Status',
    principle: 'Always keep users informed about what is going on.',
    color: '#6366F1', dark: '#3730A3',
    violation: 'The upload button says "Analyzing…" for 45 seconds with no progress indicator. Users have no signal the system is working.',
    fix: 'Progress bar + "Extracting coaching moments…" label + "~38s remaining". Completion rate rose from 30% to 58%.',
    severity: 'Critical',
  },
  {
    n: 2, name: 'Match Between System and Real World',
    principle: 'Use words, phrases, and concepts familiar to the user.',
    color: '#0EA5E9', dark: '#0369A1',
    violation: '"Session metadata payload" appears in an error message. Sales managers do not speak in API terms.',
    fix: '"Your call recording details failed to save. Try again or contact support." Uses the language of the user, not the engineer.',
    severity: 'High',
  },
  {
    n: 3, name: 'User Control and Freedom',
    principle: 'Users need a clearly marked "emergency exit" from mistakes.',
    color: '#22C55E', dark: '#15803D',
    violation: 'Archiving a coaching session is permanent with no undo. One accidental click loses weeks of coaching data.',
    fix: 'A 10-second undo toast: "Session archived. Undo?" Destructive actions should always be reversible within a short window.',
    severity: 'High',
  },
  {
    n: 4, name: 'Consistency and Standards',
    principle: 'Users should not have to wonder whether different words, situations, or actions mean the same thing.',
    color: '#F97316', dark: '#C2410C',
    violation: '9 different button styles across 9 teams. "Save", "SAVE", "Submit", "Confirm" all do the same thing in different screens.',
    fix: 'One canonical "Primary Button" component in the design system. One word, one style, one behaviour — everywhere.',
    severity: 'High',
  },
  {
    n: 5, name: 'Error Prevention',
    principle: 'Eliminate error-prone conditions or check for them and present a confirmation option.',
    color: '#EF4444', dark: '#B91C1C',
    violation: '"Delete all recordings" is the same size and colour as "Export all". Both sit next to each other in the toolbar.',
    fix: 'Destructive actions are smaller, outlined (not filled), require typed confirmation for bulk actions, and are separated from primary CTAs.',
    severity: 'Critical',
  },
  {
    n: 6, name: 'Recognition Rather Than Recall',
    principle: 'Minimise the user\'s memory load by making objects, actions, and options visible.',
    color: '#8B5CF6', dark: '#6D28D9',
    violation: 'After watching a coaching recording, the user must remember which rep, which deal, which date. None of this context is shown.',
    fix: 'Recording header shows: rep photo, name, deal name, date, and duration before the recording starts playing.',
    severity: 'Medium',
  },
  {
    n: 7, name: 'Flexibility and Efficiency of Use',
    principle: 'Accelerators — unseen by the novice user — may speed up the interaction for the expert.',
    color: '#EC4899', dark: '#BE185D',
    violation: 'No keyboard shortcuts. Power users (VPs, heavy users) must click through 4 steps for every action they perform 20 times a day.',
    fix: 'K = search recordings, N = new session, E = export current, ↑↓ = navigate list. Documented in a discoverable shortcut sheet.',
    severity: 'Medium',
  },
  {
    n: 8, name: 'Aesthetic and Minimalist Design',
    principle: 'Dialogues should not contain irrelevant or rarely needed information.',
    color: '#14B8A6', dark: '#0F766E',
    violation: '12 dashboard widgets are shown to every user by default. 8 of them are used by fewer than 10% of users in week 1.',
    fix: '4 core widgets shown by default. The rest are accessible behind "Customise dashboard". First-week cognitive load drops by ~60%.',
    severity: 'High',
  },
  {
    n: 9, name: 'Help Users Recognise, Diagnose, and Recover from Errors',
    principle: 'Error messages should be expressed in plain language, precisely indicate the problem, and constructively suggest a solution.',
    color: '#F59E0B', dark: '#D97706',
    violation: 'When Salesforce sync fails the user sees: "Error 403: Forbidden. Request could not be authorised."',
    fix: '"Your Salesforce connection has expired. Reconnect in Settings → Integrations → Salesforce. This takes about 2 minutes."',
    severity: 'Critical',
  },
  {
    n: 10, name: 'Help and Documentation',
    principle: 'It\'s better if the system can be used without documentation, but it may be necessary to provide help.',
    color: '#64748B', dark: '#475569',
    violation: 'New users land on a blank dashboard with no guidance. 43% never complete a second session — they don\'t know where to start.',
    fix: 'A "First coaching session" checklist appears for users in day 1–3. Inline tooltips on first interaction with each key feature.',
    severity: 'High',
  },
];

const SEVERITY_COLOR = { Critical: '#EF4444', High: '#F97316', Medium: '#F59E0B', Low: '#22C55E' };

export function NielsenHeuristicsViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0); setActive(null);
    HEURISTICS.forEach((_, i) => setTimeout(() => setVisible(i + 1), 200 + i * 180));
    setTimeout(() => setActive(0), 200 + HEURISTICS.length * 180 + 400);
  }, [inView, tick]);

  const replay = () => { setVisible(0); setActive(null); setTick(t => t + 1); };
  const sel = active !== null ? HEURISTICS[active] : null;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ padding: '4px 12px', borderRadius: '8px', background: '#1F2937', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.14em', boxShadow: '0 3px 0 #111827' }}>
          NIELSEN&apos;S 10 HEURISTICS
        </div>
        <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', fontWeight: 600 }}>EdSpark heuristic audit — every violation has a fix</div>
      </div>

      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
        {/* 2×5 heuristic grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--ed-card)' }}>
          {HEURISTICS.map((h, i) => {
            const isActive = active === i;
            const show = i < visible;
            return (
              <AnimatePresence key={h.n}>
                {show && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    onClick={() => setActive(isActive ? null : i)}
                    style={{
                      padding: '14px 16px', textAlign: 'left' as const, cursor: 'pointer',
                      background: isActive ? `linear-gradient(135deg, ${h.color} 0%, ${h.dark} 100%)` : 'var(--ed-card)',
                      border: 'none',
                      borderRight: (i % 2 === 0) ? '1px solid var(--ed-rule)' : 'none',
                      borderBottom: i < 8 ? '1px solid var(--ed-rule)' : 'none',
                      outline: isActive ? `2px solid ${h.color}` : 'none',
                      outlineOffset: '-2px',
                      transition: 'background 0.3s, outline 0.3s',
                      display: 'flex', alignItems: 'center', gap: '12px',
                    }}>
                    {/* Number badge */}
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
                      background: isActive ? 'rgba(255,255,255,0.2)' : `${h.color}18`,
                      border: `1.5px solid ${isActive ? 'rgba(255,255,255,0.35)' : h.color + '40'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 900,
                      color: isActive ? '#fff' : h.color,
                      boxShadow: isActive ? 'none' : `0 3px 0 ${h.color}30`,
                    }}>
                      {h.n}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: isActive ? '#fff' : 'var(--ed-ink)', lineHeight: 1.25, marginBottom: '2px', transition: 'color 0.3s' }}>
                        {h.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActive ? 'rgba(255,255,255,0.6)' : (SEVERITY_COLOR[h.severity as keyof typeof SEVERITY_COLOR] || '#94A3B8'), flexShrink: 0 }} />
                        <div style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: isActive ? 'rgba(255,255,255,0.65)' : 'var(--ed-ink3)', letterSpacing: '0.1em' }}>
                          {h.severity.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {sel && (
            <motion.div key={sel.n} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              style={{ borderTop: '1px solid var(--ed-rule)' }}>
              {/* Header */}
              <div style={{ padding: '16px 20px', background: `linear-gradient(135deg, ${sel.color} 0%, ${sel.dark} 100%)`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.18em', marginBottom: '4px' }}>
                    HEURISTIC {sel.n} OF 10
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff', marginBottom: '4px' }}>{sel.name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>&ldquo;{sel.principle}&rdquo;</div>
                </div>
                <div style={{ padding: '4px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#fff', letterSpacing: '0.12em', flexShrink: 0 }}>
                  {sel.severity.toUpperCase()}
                </div>
              </div>
              {/* Violation + Fix */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--ed-card)' }}>
                <div style={{ padding: '18px 20px', borderRight: '1px solid var(--ed-rule)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#EF4444', letterSpacing: '0.14em', marginBottom: '8px' }}>
                    ❌ VIOLATION IN EDSPARK
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.7 }}>{sel.violation}</div>
                </div>
                <div style={{ padding: '18px 20px', background: 'rgba(34,197,94,0.04)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#22C55E', letterSpacing: '0.14em', marginBottom: '8px' }}>
                    ✓ THE FIX
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.7 }}>{sel.fix}</div>
                </div>
              </div>
              {/* Nav */}
              <div style={{ padding: '10px 20px', background: 'var(--ed-card)', borderTop: '1px solid var(--ed-rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <motion.button whileHover={{ opacity: 0.75 }} onClick={() => setActive(a => a !== null && a > 0 ? a - 1 : 9)}
                  style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--ed-rule)', background: 'var(--ed-card)', cursor: 'pointer', fontSize: '12px', color: 'var(--ed-ink3)' }}>
                  ← prev
                </motion.button>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {HEURISTICS.map((h, i) => (
                    <div key={i} onClick={() => setActive(i)} style={{ width: active === i ? '20px' : '6px', height: '6px', borderRadius: '3px', background: active === i ? h.color : 'var(--ed-rule)', cursor: 'pointer', transition: 'all 0.3s' }} />
                  ))}
                </div>
                <motion.button whileHover={{ opacity: 0.75 }} onClick={() => setActive(a => a !== null && a < 9 ? a + 1 : 0)}
                  style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--ed-rule)', background: 'var(--ed-card)', cursor: 'pointer', fontSize: '12px', color: 'var(--ed-ink3)' }}>
                  next →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(31,41,55,0.07)', border: '1px solid rgba(31,41,55,0.15)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--ed-ink)' }}>How PMs use heuristics:</strong> not as aesthetic preferences but as specific, named principles. &ldquo;The error message violates Heuristic 9 — it doesn&apos;t tell the user what to do next&rdquo; is actionable feedback. &ldquo;The error message looks bad&rdquo; is not.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

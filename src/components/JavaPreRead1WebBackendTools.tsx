'use client';
/**
 * JavaPreRead1WebBackendTools — REBUILT FROM SCRATCH
 *
 * Every visual is a genuine 3D animated teaching system:
 * - Real CSS preserve-3d with perspective for spatial depth
 * - Auto-animated sequences that teach concepts through motion and state change
 * - Saturated claymorphism: thick objects, beveled edges, ambient shadows
 * - No passive decorations — every animation answers a learning question
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Color system — saturated, not muted ─────────────────────────────────────
const COL = {
  sky:    '#0EA5E9',  // bright blue
  violet: '#8B5CF6',  // vivid violet
  teal:   '#06B6D4',  // cyan teal
  green:  '#22C55E',  // vivid green
  amber:  '#F59E0B',  // warm amber
  rose:   '#F43F5E',  // vivid rose/red
  indigo: '#6366F1',  // indigo
  lime:   '#84CC16',  // lime green
};

// ─── Clay material helpers ────────────────────────────────────────────────────
const clay = (color: string, depth = 8) => ({
  background: `linear-gradient(145deg, ${color}dd 0%, ${color} 60%, ${color}bb 100%)`,
  borderRadius: '20px',
  boxShadow: `0 ${depth}px 0 0 color-mix(in srgb, ${color} 55%, black 45%), 0 ${depth+6}px ${depth*3}px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.15)`,
});

const clayFlat = (color: string) => ({
  background: `linear-gradient(145deg, ${color}ee 0%, ${color} 100%)`,
  borderRadius: '14px',
  boxShadow: `0 4px 0 color-mix(in srgb, ${color} 55%, black 45%), 0 6px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)`,
});

const sp = { type: 'spring' as const, stiffness: 120, damping: 18 };
const spFast = { type: 'spring' as const, stiffness: 260, damping: 22 };

// ─── Shell wrapper ────────────────────────────────────────────────────────────
const VisualShell = ({ label, caption, children }: { label: string; caption: string; children: React.ReactNode }) => (
  <div style={{ margin: '32px 0' }}>
    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 800, letterSpacing: '0.18em', color: COL.sky, textTransform: 'uppercase' as const, marginBottom: 4 }}>{label}</div>
    {children}
    <div style={{ marginTop: 10, fontSize: 11, color: 'var(--ed-ink3)', fontStyle: 'italic', lineHeight: 1.65 }}>{caption}</div>
  </div>
);

const CtrlBtn = ({ label, active, color, onClick }: { label: string; active?: boolean; color: string; onClick: () => void }) => (
  <motion.button onClick={onClick} whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.95 }}
    style={{ padding: '7px 14px', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 800,
      background: active ? `linear-gradient(145deg, ${color}ee, ${color})` : 'var(--ed-card)',
      borderRadius: 10,
      color: active ? '#fff' : color,
      boxShadow: active ? `0 4px 0 color-mix(in srgb,${color} 55%,black 45%), 0 6px 18px ${color}50, inset 0 1px 0 rgba(255,255,255,0.4)` : `0 3px 0 rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.15)`,
      border: `2px solid ${active ? 'transparent' : color+'30'}`,
    }}>
    {label}
  </motion.button>
);

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — DNS JOURNEY CINEMA
// Auto-animated 3D scene: packet flies through DNS resolution chain in depth
// ═══════════════════════════════════════════════════════════════════════════════

const DNS_STATIONS = [
  { id: 'browser',   label: 'Browser',           sub: 'ledgerlite.finova.com',  color: COL.sky,    icon: '🌐' },
  { id: 'cache',     label: 'OS / Browser Cache', sub: 'Check local memory',     color: COL.violet, icon: '💾' },
  { id: 'resolver',  label: 'Recursive Resolver', sub: 'ISP DNS server',         color: COL.teal,   icon: '📡' },
  { id: 'auth',      label: 'Authoritative DNS',  sub: 'Source of truth',        color: COL.amber,  icon: '🏛' },
  { id: 'ip',        label: 'IP Address',         sub: '203.0.113.42',           color: COL.green,  icon: '📍' },
];

export function DNSLookupVisual() {
  const [phase, setPhase] = useState<number>(-1); // -1=idle, 0-4=active station, 5=done
  const [mode, setMode] = useState<'miss'|'hit'>('miss');
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const SEQUENCE = mode === 'hit' ? [0, 4] : [0, 1, 2, 3, 4];

  function play() {
    if (running) return;
    timers.current.forEach(clearTimeout); timers.current = [];
    setRunning(true); setPhase(0);
    SEQUENCE.forEach((si, i) => {
      const t = setTimeout(() => {
        setPhase(si);
        if (i === SEQUENCE.length - 1) {
          const done = setTimeout(() => { setPhase(5); setRunning(false); }, 900);
          timers.current.push(done);
        }
      }, i * 900);
      timers.current.push(t);
    });
  }
  function reset() { timers.current.forEach(clearTimeout); setPhase(-1); setRunning(false); }

  const packetX = (() => {
    if (phase < 0) return '0%';
    const pct = [0, 25, 50, 75, 100][phase] ?? 100;
    return `${pct}%`;
  })();

  return (
    <VisualShell label="DNS Resolution — The First Hop" caption="Before any HTTP request, the browser resolves the domain to an IP. This is invisible to users but essential for every click.">

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' as const }}>
        <CtrlBtn label="▶ Cache Miss (full chain)" active={!running && mode === 'miss'} color={COL.amber} onClick={() => { setMode('miss'); reset(); }} />
        <CtrlBtn label="⚡ Cache Hit (fast path)" active={!running && mode === 'hit'} color={COL.green} onClick={() => { setMode('hit'); reset(); }} />
        <CtrlBtn label="▶ Animate" active={running} color={COL.sky} onClick={play} />
        <CtrlBtn label="↺" color={COL.violet} onClick={reset} />
      </div>

      {/* 3D Scene */}
      <div style={{ perspective: '1100px', perspectiveOrigin: '50% 35%', height: 280, position: 'relative', overflow: 'visible' }}>
        <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-14deg) rotateY(0deg)', position: 'absolute', inset: 0 }}>

          {/* Ground plane */}
          <div style={{ position: 'absolute', bottom: 0, left: '2%', right: '2%', height: 18, background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(139,92,246,0.06))', borderRadius: 12, transform: 'translateZ(-40px) rotateX(90deg)', transformOrigin: 'bottom', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)' }} />

          {/* DNS Station nodes */}
          {DNS_STATIONS.map((st, i) => {
            const x = i * 24; // percent across
            const zDepth = (DNS_STATIONS.length - 1 - i) * 30; // depth
            const isActive = phase === i;
            const isDone = phase > i || phase === 5;
            const isSkipped = mode === 'hit' && i > 0 && i < 4;
            if (isSkipped) return null;

            return (
              <motion.div key={st.id}
                animate={{ z: isActive ? zDepth + 28 : zDepth, scale: isActive ? 1.08 : 1 }}
                transition={sp}
                style={{ position: 'absolute', left: `${x}%`, top: '30%', width: '20%', zIndex: DNS_STATIONS.length - i }}
              >
                <div style={{
                  ...clay(isDone ? st.color : isActive ? st.color : `color-mix(in srgb, ${st.color} 55%, #334155 45%)`, isActive ? 10 : 6),
                  padding: '12px 10px', textAlign: 'center' as const,
                  opacity: isSkipped ? 0.25 : 1,
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{st.icon}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 800, color: '#fff', marginBottom: 3, letterSpacing: '0.06em' }}>{st.label}</div>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{st.sub}</div>
                  {isActive && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: [1,1.4,1], opacity: [1,0.6,1] }} transition={{ duration: 0.7, repeat: Infinity }}
                      style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff', margin: '8px auto 0', boxShadow: `0 0 16px ${st.color}` }} />
                  )}
                  {isDone && phase !== -1 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      style={{ position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: '50%', background: COL.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, boxShadow: `0 3px 0 color-mix(in srgb,${COL.green} 50%,black 50%)` }}>
                      ✓
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Animated packet */}
          {running && phase >= 0 && phase < 5 && (
            <motion.div
              animate={{ left: packetX, top: '18%' }}
              transition={{ type: 'spring', stiffness: 80, damping: 16 }}
              style={{ position: 'absolute', zIndex: 20, transform: 'translateX(-50%)' }}
            >
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                style={{ width: 36, height: 36, ...clay(COL.sky, 4), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                📦
              </motion.div>
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.5, repeat: Infinity }}
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: COL.sky, textAlign: 'center' as const, marginTop: 4, whiteSpace: 'nowrap' as const }}>
                DNS query
              </motion.div>
            </motion.div>
          )}

          {/* Connection lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
            {DNS_STATIONS.slice(0, -1).map((_, i) => {
              if (mode === 'hit' && i > 0 && i < 4) return null;
              const x1 = i * 24 + 10; const x2 = (i+1) * 24 + 10;
              const done = phase > i;
              return <line key={i} x1={`${x1}%`} y1="50%" x2={`${x2}%`} y2="50%"
                stroke={done ? COL.green : 'rgba(148,163,184,0.3)'} strokeWidth="0.6"
                strokeDasharray={done ? 'none' : '2 1'} style={{ transition: 'stroke 0.4s' }} />;
            })}
          </svg>
        </div>
      </div>

      {/* Result display */}
      <AnimatePresence>
        {phase === 5 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ marginTop: 14, padding: '12px 18px', ...clayFlat(COL.green), color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700 }}>
            ✓ {mode === 'hit' ? 'Cache hit — 1ms resolution' : 'Full resolution — 4 hops'} → 203.0.113.42 — Browser opens TCP connection
          </motion.div>
        )}
      </AnimatePresence>
    </VisualShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — HTTP ANATOMY EXPLODER
// A sealed envelope decomposes in 3D — each layer flies to a position in space
// ═══════════════════════════════════════════════════════════════════════════════

const HTTP_LAYERS = [
  { id: 'method',  label: 'METHOD',  value: 'GET',                         color: COL.sky,    detail: 'Declares the action — GET reads, POST creates, PATCH updates, DELETE removes', icon: '⚡' },
  { id: 'path',    label: 'PATH',    value: '/api/transactions?risk=high',  color: COL.violet, detail: 'Names the resource and filters — transactions filtered to risk=high', icon: '🛤' },
  { id: 'headers', label: 'HEADERS', value: 'Authorization · Content-Type · Accept', color: COL.teal, detail: 'Metadata — proves identity, describes body format, states expected response', icon: '📎' },
  { id: 'body',    label: 'BODY',    value: '(empty — GET has no body)',    color: COL.amber,  detail: 'Payload — present on POST/PATCH with JSON data. GET requests have no body.', icon: '📦' },
];

export function HTTPPacketScanner() {
  const [exploded, setExploded] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Layer positions when exploded
  const positions: Record<string, { x: number; y: number; rotate: number }> = {
    method:  { x: -160, y: -80,  rotate: -6 },
    path:    { x: 120,  y: -60,  rotate: 4  },
    headers: { x: -120, y: 80,   rotate: -3 },
    body:    { x: 160,  y: 90,   rotate: 5  },
  };

  return (
    <VisualShell label="HTTP Request Anatomy — The Exploder" caption="Every HTTP message has structure. Explode it to see the four components the backend must understand.">
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <CtrlBtn label={exploded ? '⟵ Reassemble' : '💥 Explode Request'} active={exploded} color={COL.violet} onClick={() => { setExploded(e => !e); setActive(null); }} />
      </div>

      {/* 3D Stage */}
      <div style={{ perspective: '900px', perspectiveOrigin: '50% 50%', height: 340, position: 'relative', overflow: 'visible', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transformStyle: 'preserve-3d', transform: exploded ? 'rotateX(-8deg) rotateY(3deg)' : 'rotateX(0deg)', transition: 'transform 0.6s ease', position: 'relative' }}>

          {/* The envelope (sealed state) */}
          <AnimatePresence>
            {!exploded && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }}
                style={{ ...clay(COL.indigo, 12), padding: '24px 36px', cursor: 'pointer', textAlign: 'center' as const, minWidth: 280 }}
                onClick={() => setExploded(true)}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✉</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 6 }}>HTTP REQUEST</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>GET /api/transactions?risk=high</div>
                <div style={{ marginTop: 14, fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>Click to explode →</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exploded layers */}
          <AnimatePresence>
            {exploded && HTTP_LAYERS.map((layer) => {
              const pos = positions[layer.id];
              const isActive = active === layer.id;
              return (
                <motion.div key={layer.id}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                  animate={{ x: pos.x, y: pos.y, opacity: 1, scale: isActive ? 1.08 : 1, rotate: isActive ? 0 : pos.rotate, z: isActive ? 40 : 0 }}
                  exit={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                  transition={isActive ? spFast : sp}
                  onClick={() => setActive(active === layer.id ? null : layer.id)}
                  style={{ position: 'absolute', cursor: 'pointer', width: 170 }}
                >
                  <div style={{ ...clay(layer.color, isActive ? 10 : 6), padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18 }}>{layer.icon}</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 800, color: '#fff', letterSpacing: '0.12em' }}>{layer.label}</span>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.9)', marginBottom: isActive ? 8 : 0, lineHeight: 1.4 }}>{layer.value}</div>
                    {isActive && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 8 }}>{layer.detail}</div>}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      {exploded && <div style={{ textAlign: 'center' as const, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--ed-ink3)', marginTop: 8 }}>Click any layer to inspect it</div>}
    </VisualShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — CORS WORLD GATE (full 3D scene)
// Two origin islands — a request beam tries to cross the CORS gate
// ═══════════════════════════════════════════════════════════════════════════════

export function CORSBrowserGate() {
  const [frontOrigin, setFrontOrigin] = useState('localhost:3000');
  const [allowedOrigin, setAllowedOrigin] = useState('localhost:3000');
  const [phase, setPhase] = useState<'idle'|'traveling'|'checking'|'allowed'|'blocked'>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const allowed = `http://${frontOrigin}` === `http://${allowedOrigin}` || allowedOrigin === '*';

  function send() {
    timers.current.forEach(clearTimeout); timers.current = [];
    setPhase('traveling');
    timers.current.push(setTimeout(() => setPhase('checking'), 1000));
    timers.current.push(setTimeout(() => setPhase(allowed ? 'allowed' : 'blocked'), 2000));
    timers.current.push(setTimeout(() => setPhase('idle'), 4500));
  }

  const ORIGINS = ['localhost:3000', 'localhost:4000', 'app.finova.com'];
  const ALLOWED = ['localhost:3000', 'localhost:4000', '*', 'app.finova.com'];

  return (
    <VisualShell label="CORS Browser Gate — Origin Enforcement" caption="The browser blocks cross-origin responses unless the server explicitly permits them. Postman doesn't have this restriction — only browsers do.">
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' as const }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: 5, letterSpacing: '0.1em' }}>FRONTEND ORIGIN</div>
          <div style={{ display: 'flex', gap: 5 }}>
            {ORIGINS.map(o => <CtrlBtn key={o} label={o} active={frontOrigin===o} color={COL.sky} onClick={() => { setFrontOrigin(o); setPhase('idle'); }} />)}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: 5, letterSpacing: '0.1em' }}>SERVER CORS HEADER</div>
          <div style={{ display: 'flex', gap: 5 }}>
            {ALLOWED.map(o => <CtrlBtn key={o} label={o} active={allowedOrigin===o} color={COL.teal} onClick={() => { setAllowedOrigin(o); setPhase('idle'); }} />)}
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div style={{ perspective: '1000px', perspectiveOrigin: '50% 40%', height: 260, position: 'relative' }}>
        <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-10deg)', position: 'absolute', inset: 0 }}>

          {/* Frontend island */}
          <div style={{ position: 'absolute', left: '3%', top: '20%', width: '26%', transformStyle: 'preserve-3d' }}>
            <div style={{ ...clay(COL.sky, 12), padding: '18px 14px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>🌐</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 800, color: '#fff', marginBottom: 3 }}>BROWSER</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)', fontFamily: "'JetBrains Mono',monospace" }}>http://{frontOrigin}</div>
            </div>
          </div>

          {/* CORS Gate */}
          <motion.div
            animate={{ scale: phase==='checking'?1.12:1 }}
            style={{ position: 'absolute', left: '36%', top: '15%', width: '27%' }}>
            <motion.div animate={{
              background: phase==='allowed' ? `linear-gradient(145deg, ${COL.green}dd, ${COL.green})` :
                          phase==='blocked' ? `linear-gradient(145deg, ${COL.rose}dd, ${COL.rose})` :
                          phase==='checking' ? `linear-gradient(145deg, ${COL.amber}dd, ${COL.amber})` :
                          `linear-gradient(145deg, #334155dd, #1e293b)`,
              boxShadow: phase==='allowed' ? `0 8px 0 color-mix(in srgb,${COL.green} 50%,black 50%), 0 14px 32px ${COL.green}60` :
                         phase==='blocked' ? `0 8px 0 color-mix(in srgb,${COL.rose} 50%,black 50%), 0 14px 32px ${COL.rose}60` :
                         '0 8px 0 #0f172a, 0 12px 24px rgba(0,0,0,0.4)',
            }} transition={{ duration: 0.4 }}
              style={{ padding: '18px 12px', borderRadius: 20, textAlign: 'center' as const, border: '2px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
              <motion.div animate={{ rotate: phase==='checking'?[0,15,-15,0]:0 }} transition={{ duration: 0.4, repeat: phase==='checking'?Infinity:0 }}
                style={{ fontSize: 30, marginBottom: 6 }}>
                {phase==='allowed'?'✅':phase==='blocked'?'🚫':phase==='checking'?'🔍':'🛡'}
              </motion.div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 800, color: '#fff', marginBottom: 3 }}>CORS GATE</div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4, fontFamily: "'JetBrains Mono',monospace" }}>
                {phase==='idle'?'Waiting':'Allowed: '+allowedOrigin}
              </div>
            </motion.div>
          </motion.div>

          {/* API island */}
          <div style={{ position: 'absolute', right: '3%', top: '20%', width: '26%' }}>
            <div style={{ ...clay(COL.teal, 12), padding: '18px 14px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>☕</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 800, color: '#fff', marginBottom: 3 }}>JAVA API</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)', fontFamily: "'JetBrains Mono',monospace" }}>localhost:8080</div>
            </div>
          </div>

          {/* Request capsule */}
          <AnimatePresence>
            {(phase==='traveling'||phase==='checking') && (
              <motion.div
                initial={{ left: '30%', top: '28%', opacity: 0 }}
                animate={{ left: phase==='checking'?'47%':'38%', top: '28%', opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 60, damping: 14 }}
                style={{ position: 'absolute', zIndex: 10 }}
              >
                <motion.div animate={{ y: [0,-4,0] }} transition={{ duration: 0.5, repeat: Infinity }}
                  style={{ width: 40, height: 40, ...clay(COL.violet, 5), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  →
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.button onClick={send} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
        style={{ ...clay(COL.violet, 6), color: '#fff', border: 'none', padding: '10px 22px', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 800, marginTop: 8 }}>
        ▶ Send Request
      </motion.button>

      <AnimatePresence>
        {(phase==='allowed'||phase==='blocked') && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
            style={{ marginTop: 12, padding: '12px 18px', borderRadius: 14, background: phase==='allowed'?`${COL.green}12`:`${COL.rose}12`, border: `2px solid ${phase==='allowed'?COL.green:COL.rose}40`, borderLeft: `4px solid ${phase==='allowed'?COL.green:COL.rose}` }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:phase==='allowed'?COL.green:COL.rose, marginBottom:4, letterSpacing:'0.1em' }}>
              {phase==='allowed'?'CORS ALLOWED — response reaches browser':'CORS BLOCKED — browser discards response'}
            </div>
            <div style={{ fontSize:12, color:'var(--ed-ink2)' }}>
              {phase==='allowed'?`Access-Control-Allow-Origin: ${allowedOrigin} ✓ matches http://${frontOrigin}`:`Server returned Allow-Origin: ${allowedOrigin} — browser expected http://${frontOrigin} and blocked the response`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </VisualShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — AUTH CHECKPOINT TUNNEL (3D tunnel looking down)
// Request enters a 3D tunnel with two scanner rings
// ═══════════════════════════════════════════════════════════════════════════════

type TokenT = 'none'|'analyst'|'manager';
type RouteT = 'own'|'all';

export function AuthCheckpointTunnel() {
  const [token, setToken] = useState<TokenT>('manager');
  const [route, setRoute] = useState<RouteT>('all');
  const [capsuleZ, setCapsuleZ] = useState(-200);
  const [ring1, setRing1] = useState<'idle'|'pass'|'fail'>('idle');
  const [ring2, setRing2] = useState<'idle'|'pass'|'fail'>('idle');
  const [result, setResult] = useState<{status:number;msg:string}|null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function run() {
    timers.current.forEach(clearTimeout); timers.current = [];
    setCapsuleZ(-200); setRing1('idle'); setRing2('idle'); setResult(null);
    const pass1 = token !== 'none';
    const pass2 = pass1 && (route==='own' || token==='manager');

    timers.current.push(setTimeout(() => setCapsuleZ(-80), 200));
    timers.current.push(setTimeout(() => setRing1(pass1?'pass':'fail'), 900));
    if (!pass1) {
      timers.current.push(setTimeout(() => { setCapsuleZ(-200); setResult({status:401,msg:'No token — identity unknown. Request rejected.'}); }, 1800));
      return;
    }
    timers.current.push(setTimeout(() => setCapsuleZ(80), 1400));
    timers.current.push(setTimeout(() => setRing2(pass2?'pass':'fail'), 2100));
    if (!pass2) {
      timers.current.push(setTimeout(() => { setCapsuleZ(-200); setResult({status:403,msg:`${token} role lacks permission for this route.`}); }, 3000));
      return;
    }
    timers.current.push(setTimeout(() => setCapsuleZ(220), 2600));
    timers.current.push(setTimeout(() => setResult({status:200,msg:'Identity verified. Role permitted. Data returned.'}), 3200));
  }

  const ringColor = (state: 'idle'|'pass'|'fail') =>
    state==='pass'?COL.green:state==='fail'?COL.rose:'rgba(148,163,184,0.35)';

  return (
    <VisualShell label="Auth Checkpoint — 2 Scanners in Sequence" caption="Authentication and authorization are separate checks. Passing one does not guarantee passing the other.">
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' as const }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: 5, letterSpacing: '0.1em' }}>TOKEN</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['none','analyst','manager'] as TokenT[]).map(t => <CtrlBtn key={t} label={t==='none'?'No token':t} active={token===t} color={t==='none'?COL.rose:t==='analyst'?COL.sky:COL.violet} onClick={()=>{setToken(t);setResult(null);setRing1('idle');setRing2('idle');setCapsuleZ(-200);}} />)}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: 5, letterSpacing: '0.1em' }}>ENDPOINT</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <CtrlBtn label="Own queue" active={route==='own'} color={COL.teal} onClick={()=>{setRoute('own');setResult(null);setRing1('idle');setRing2('idle');setCapsuleZ(-200);}} />
            <CtrlBtn label="All high-risk (manager)" active={route==='all'} color={COL.amber} onClick={()=>{setRoute('all');setResult(null);setRing1('idle');setRing2('idle');setCapsuleZ(-200);}} />
          </div>
        </div>
      </div>

      {/* 3D Tunnel */}
      <div style={{ perspective: '800px', perspectiveOrigin: '50% 45%', height: 240, position: 'relative', overflow: 'hidden' }}>
        <div style={{ transformStyle: 'preserve-3d', position: 'absolute', inset: 0 }}>

          {/* Tunnel walls */}
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ position: 'absolute', left: `${18 + i*2}%`, right: `${18 + i*2}%`, top: `${20 + i*3}%`, bottom: `${20 + i*3}%`, border: `2px solid rgba(99,102,241,${0.12 - i*0.02})`, borderRadius: 40, transform: `translateZ(${-i * 50}px)`, pointerEvents: 'none' }} />
          ))}

          {/* Ring 1: Identity scanner */}
          <motion.div animate={{ borderColor: ringColor(ring1), boxShadow: ring1!=='idle'?`0 0 40px ${ringColor(ring1)}80, inset 0 0 20px ${ringColor(ring1)}20`:'none' }}
            style={{ position: 'absolute', left: '22%', right: '22%', top: '18%', bottom: '18%', transform: 'translateZ(-60px)', borderRadius: 40, border: `4px solid ${ringColor(ring1)}`, transition: 'border-color 0.4s, box-shadow 0.4s', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0 16px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 800, color: ring1==='idle'?'rgba(148,163,184,0.5)':ringColor(ring1) }}>
              {ring1==='idle'?'IDENTITY':'IDENTITY '+(ring1==='pass'?'✓':'✗')}
            </div>
          </motion.div>

          {/* Ring 2: Permission scanner */}
          <motion.div animate={{ borderColor: ringColor(ring2), boxShadow: ring2!=='idle'?`0 0 40px ${ringColor(ring2)}80, inset 0 0 20px ${ringColor(ring2)}20`:'none' }}
            style={{ position: 'absolute', left: '14%', right: '14%', top: '12%', bottom: '12%', transform: 'translateZ(-130px)', borderRadius: 50, border: `4px solid ${ringColor(ring2)}`, transition: 'border-color 0.4s, box-shadow 0.4s', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 20px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 800, color: ring2==='idle'?'rgba(148,163,184,0.5)':ringColor(ring2) }}>
              {ring2==='idle'?'PERMISSION':'PERMISSION '+(ring2==='pass'?'✓':'✗')}
            </div>
          </motion.div>

          {/* Request capsule */}
          <motion.div animate={{ z: capsuleZ }} transition={sp}
            style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 10 }}>
            <motion.div animate={{ rotate: capsuleZ > -100 ? [0,360] : 0 }} transition={{ duration: 1, repeat: capsuleZ > -100 ? Infinity : 0, ease: 'linear' }}
              style={{ width: 48, height: 48, ...clay(COL.violet, 6), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              🔐
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.button onClick={run} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
        style={{ ...clay(COL.indigo, 6), color: '#fff', border: 'none', padding: '10px 22px', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 800, marginTop: 8 }}>
        ▶ Run Auth Check
      </motion.button>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            style={{ marginTop: 12, padding: '12px 18px', borderRadius: 14, background: result.status===200?`${COL.green}12`:`${COL.rose}12`, border: `2px solid ${result.status===200?COL.green:COL.rose}40`, borderLeft: `4px solid ${result.status===200?COL.green:COL.rose}` }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:900, color:result.status===200?COL.green:COL.rose, marginBottom:4 }}>
              HTTP {result.status} {result.status===200?'OK':result.status===401?'Unauthorized':'Forbidden'}
            </div>
            <div style={{ fontSize:12, color:'var(--ed-ink2)' }}>{result.msg}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </VisualShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE TOOL — REST ROUTE WORKSHOP
// ═══════════════════════════════════════════════════════════════════════════════

const REST_Q = [
  { action:'Show high-risk transactions', good:'GET /api/transactions?risk=high', bad:'/getHighRiskThingsForDashboard' },
  { action:'Create a new transaction',   good:'POST /api/transactions',           bad:'/createNewTransaction' },
  { action:'Mark TX-1001 as reviewed',   good:'PATCH /api/transactions/TX-1001/status', bad:'/doMarkReviewed?id=TX-1001' },
  { action:'Delete transaction TX-1002', good:'DELETE /api/transactions/TX-1002', bad:'/removeTransaction' },
];

export function RESTRouteWorkshop() {
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<string|null>(null);
  const q = REST_Q[qi];
  const opts = [q.good, q.bad].sort(() => Math.random()-0.5);
  function next() { setPicked(null); setQi(i=>(i+1)%REST_Q.length); }

  return (
    <VisualShell label="REST Route Workshop — Identify the resource endpoint" caption="REST names resources, not actions. The method tells the server what to do. The path tells it where.">
      <div style={{ marginBottom: 18, padding: '16px 20px', ...clayFlat(COL.indigo), color: '#fff', borderRadius: 16 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 800, opacity: 0.7, marginBottom: 8, letterSpacing: '0.12em' }}>PRODUCT ACTION</div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{q.action}</div>
        <div style={{ marginTop: 6, fontSize: 10, opacity: 0.75, fontFamily: "'JetBrains Mono',monospace" }}>Scenario {qi+1}/{REST_Q.length}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, marginBottom: 14 }}>
        {opts.map(opt => {
          const correct = opt===q.good;
          const chosen = picked===opt;
          return (
            <motion.button key={opt} onClick={()=>!picked&&setPicked(opt)} disabled={!!picked}
              whileHover={!picked?{ scale:1.02, x:4 }:{}}
              style={{ padding: '12px 16px', cursor: picked?'default':'pointer', textAlign: 'left' as const, fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700,
                background: chosen ? (correct ? COL.green : COL.rose) : 'var(--ed-card)',
                borderRadius: 12,
                boxShadow: chosen ? `0 4px 0 color-mix(in srgb,${correct?COL.green:COL.rose} 55%,black 45%), 0 6px 16px ${correct?COL.green:COL.rose}40, inset 0 1px 0 rgba(255,255,255,0.3)` : '0 3px 0 rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.1)',
                color: chosen?'#fff':'var(--ed-ink2)', border: chosen?'none':`1.5px solid ${correct?COL.green+'30':COL.rose+'20'}` }}>
              {opt}
              {chosen && <span style={{ marginLeft:10, fontWeight:900 }}>{correct?'✓ Resource-based':'✗ Action in path'}</span>}
            </motion.button>
          );
        })}
      </div>
      {picked && <motion.button onClick={next} whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
        style={{ ...clay(COL.green,6), color:'#fff', border:'none', padding:'9px 20px', cursor:'pointer', fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800 }}>
        Next →
      </motion.button>}
    </VisualShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE TOOL — STATUS CODE DECK
// ═══════════════════════════════════════════════════════════════════════════════

const SC_Q = [
  { scene:'Valid GET request — list returned',             correct:200, opts:[200,404,500,201] },
  { scene:'POST — new transaction record created',         correct:201, opts:[200,201,400,500] },
  { scene:'POST body missing required id field',           correct:400, opts:[400,401,500,200] },
  { scene:'GET without any Authorization header',          correct:401, opts:[401,403,404,500] },
  { scene:'Valid token but analyst role on manager route', correct:403, opts:[401,403,404,500] },
  { scene:'GET /api/transactions/TX-DOESNOTEXIST',         correct:404, opts:[200,400,404,500] },
  { scene:'Database connection crashed unexpectedly',      correct:500, opts:[400,404,500,503] },
];
const SC_LABELS: Record<number,string> = {200:'200 OK',201:'201 Created',400:'400 Bad Request',401:'401 Unauthorized',403:'403 Forbidden',404:'404 Not Found',500:'500 Error',503:'503 Unavailable'};
const SC_COLS: Record<number,string> = {200:COL.green,201:COL.teal,400:COL.amber,401:COL.amber,403:COL.rose,404:COL.violet,500:COL.rose,503:COL.rose};

export function StatusCodeDeck() {
  const [qi,setQi] = useState(0);
  const [picked,setPicked] = useState<number|null>(null);
  const score = useRef(0);
  const q = SC_Q[qi];
  function pick(c:number){if(picked!==null)return;setPicked(c);if(c===q.correct)score.current++;}
  function next(){setPicked(null);setQi(i=>(i+1)%SC_Q.length);}

  return (
    <VisualShell label="Status Code Deck — Choose the right response" caption="Status codes are the backend's first word. The body explains. The status code must be accurate.">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div style={{ padding:'8px 16px', ...clayFlat(COL.indigo), fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:'#fff', borderRadius:12 }}>{q.scene}</div>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:COL.green, fontWeight:800 }}>Score: {score.current}/{SC_Q.length}</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
        {q.opts.map(c=>{
          const chosen=picked===c; const correct=c===q.correct; const dim=picked!==null&&!chosen;
          return <motion.button key={c} onClick={()=>pick(c)} disabled={!!picked}
            whileHover={!picked?{scale:1.04,y:-2}:{}}
            style={{ padding:'14px', cursor:picked?'default':'pointer', textAlign:'center' as const, fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:800,
              background: chosen ? SC_COLS[c] : 'var(--ed-card)',
              borderRadius: 14,
              boxShadow: chosen ? `0 6px 0 color-mix(in srgb,${SC_COLS[c]} 55%,black 45%), 0 8px 24px ${SC_COLS[c]}45, inset 0 1px 0 rgba(255,255,255,0.35)` : '0 4px 0 rgba(0,0,0,0.12), 0 6px 18px rgba(0,0,0,0.1)',
              color:chosen?'#fff':SC_COLS[c], opacity:dim?0.4:1, border:chosen?'none':`2px solid ${SC_COLS[c]}30` }}>
            {SC_LABELS[c]}
          </motion.button>;
        })}
      </div>
      {picked!==null && <>
        <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
          style={{ padding:'10px 16px', borderRadius:12, background:`${picked===q.correct?COL.green:COL.rose}14`, border:`2px solid ${picked===q.correct?COL.green:COL.rose}40`, fontSize:12, color:'var(--ed-ink2)', marginBottom:10 }}>
          {picked===q.correct?`✓ Correct — ${SC_LABELS[q.correct]}`:`✗ Expected ${SC_LABELS[q.correct]}`}
        </motion.div>
        <motion.button onClick={next} whileHover={{scale:1.04}} whileTap={{scale:0.96}} style={{...clay(COL.green,6),color:'#fff',border:'none',padding:'9px 20px',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:800}}>Next →</motion.button>
      </>}
    </VisualShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE TOOL — POSTMAN MISSION CONTROL
// ═══════════════════════════════════════════════════════════════════════════════

type RoleP = 'anonymous'|'analyst'|'manager';
const ROUTES_P = [
  {method:'GET',path:'/api/transactions?risk=high',auth:true,roles:['analyst','manager'],status:200,body:[{id:'TX-1001',amount:150000,currency:'USD',risk:'HIGH'},{id:'TX-1003',amount:220000,currency:'EUR',risk:'HIGH'}]},
  {method:'GET',path:'/api/transactions/TX-1001',auth:true,roles:['analyst','manager'],status:200,body:{id:'TX-1001',amount:150000,currency:'USD',risk:'HIGH'}},
  {method:'POST',path:'/api/transactions',auth:true,roles:['manager'],status:201,body:{id:'TX-1004',created:true}},
];

export function PostmanMissionControl() {
  const [method,setMethod] = useState('GET');
  const [path,setPath] = useState('/api/transactions?risk=high');
  const [role,setRole] = useState<RoleP>('manager');
  const [out,setOut] = useState<{status:number;body:unknown;ms:number}|null>(null);

  function send(){
    const route = ROUTES_P.find(r=>r.method===method&&(r.path===path||path.startsWith(r.path.split('?')[0])));
    const ms = 80+Math.round(Math.random()*60);
    if(!route){setOut({status:404,body:{error:'Not Found'},ms});return;}
    if(route.auth&&role==='anonymous'){setOut({status:401,body:{error:'Unauthorized'},ms});return;}
    if(!route.roles.includes(role)){setOut({status:403,body:{error:`Forbidden — ${role} role not permitted`},ms});return;}
    setOut({status:route.status,body:route.body,ms});
  }

  const sc = out?.status;
  const scCol = sc===200||sc===201?COL.green:sc===401||sc===403?COL.amber:COL.rose;

  return (
    <VisualShell label="Postman Mission Control — API Test Suite" caption="Test the API contract before the frontend depends on it. A clear contract passes without the UI.">
      <div style={{ display:'grid', gridTemplateColumns:'100px 1fr 140px', gap:10, marginBottom:14, alignItems:'end' }}>
        {[
          {label:'METHOD', content:<select value={method} onChange={e=>setMethod(e.target.value)} style={{width:'100%',padding:'7px 8px',borderRadius:9,border:'1px solid var(--ed-rule)',background:'var(--ed-card)',color:COL.sky,fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:800}}>{['GET','POST','PATCH','DELETE'].map(m=><option key={m}>{m}</option>)}</select>},
          {label:'URL', content:<input value={path} onChange={e=>setPath(e.target.value)} style={{width:'100%',padding:'7px 10px',borderRadius:9,border:'1px solid var(--ed-rule)',background:'var(--ed-card)',color:'var(--ed-ink)',fontFamily:"'JetBrains Mono',monospace",fontSize:11}}/>},
          {label:'ROLE', content:<select value={role} onChange={e=>setRole(e.target.value as RoleP)} style={{width:'100%',padding:'7px 8px',borderRadius:9,border:'1px solid var(--ed-rule)',background:'var(--ed-card)',color:'var(--ed-ink)',fontFamily:"'JetBrains Mono',monospace",fontSize:11}}><option value="anonymous">No token</option><option value="analyst">Analyst</option><option value="manager">Manager</option></select>},
        ].map(f=><div key={f.label}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:800,color:'var(--ed-ink3)',marginBottom:5,letterSpacing:'0.1em'}}>{f.label}</div>{f.content}</div>)}
      </div>
      <div style={{display:'flex',gap:6,marginBottom:14,flexWrap:'wrap' as const}}>
        {[
          {l:'High-risk list',m:'GET',p:'/api/transactions?risk=high',r:'manager' as RoleP},
          {l:'No token',m:'GET',p:'/api/transactions?risk=high',r:'anonymous' as RoleP},
          {l:'Wrong role',m:'POST',p:'/api/transactions',r:'analyst' as RoleP},
          {l:'404',m:'GET',p:'/api/transactions/TX-404',r:'manager' as RoleP},
        ].map(s=><motion.button key={s.l} onClick={()=>{setMethod(s.m);setPath(s.p);setRole(s.r);setOut(null);}} whileHover={{scale:1.04}} style={{padding:'5px 10px',borderRadius:8,cursor:'pointer',background:'var(--ed-cream)',border:'1px solid var(--ed-rule)',fontSize:10,color:'var(--ed-ink3)',fontFamily:"'JetBrains Mono',monospace"}}>{s.l}</motion.button>)}
      </div>
      <motion.button onClick={send} whileHover={{scale:1.04}} whileTap={{scale:0.97}} style={{...clay(COL.green,6),color:'#fff',border:'none',padding:'10px 22px',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:800,marginBottom:14}}>▶ Send</motion.button>
      <AnimatePresence mode="wait">
        {out&&<motion.div key={JSON.stringify(out)} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
          <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:8}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:900,color:scCol}}>{out.status}</div>
            <div style={{fontSize:10,color:'var(--ed-ink3)',fontFamily:"'JetBrains Mono',monospace"}}>{out.ms}ms</div>
          </div>
          <pre style={{background:'#0f172a',color:scCol,fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.8,padding:'14px 18px',borderRadius:12,margin:0,overflowX:'auto' as const}}>{JSON.stringify(out.body,null,2)}</pre>
        </motion.div>}
      </AnimatePresence>
    </VisualShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO ILLUSTRATION — LedgerLite Web Request World (3D isometric towers)
// ═══════════════════════════════════════════════════════════════════════════════

export function LedgerLiteWebWorld() {
  const [active, setActive] = useState<number>(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const NODES = [
    { icon:'💻', label:'Browser',      sub:'Analyst clicks',     color:COL.sky },
    { icon:'📡', label:'DNS',          sub:'Resolves IP',         color:COL.violet },
    { icon:'⚖',  label:'Load Balancer',sub:'Routes traffic',      color:COL.amber },
    { icon:'☕', label:'Java Service', sub:'Processes request',    color:COL.green },
    { icon:'🗄',  label:'Database',    sub:'Returns records',      color:COL.teal },
  ];

  useEffect(() => {
    const interval = setInterval(() => setActive(a => (a+1) % NODES.length), 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ margin:'28px 0', perspective:'1000px', perspectiveOrigin:'50% 30%' }}>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:COL.sky, letterSpacing:'0.16em', marginBottom:14, textTransform:'uppercase' as const }}>LedgerLite Web Request World</div>
      <div style={{ transformStyle:'preserve-3d', transform:'rotateX(-12deg) rotateY(4deg)', display:'flex', gap:12, padding:'28px 20px', background:'linear-gradient(160deg,rgba(14,165,233,0.06),rgba(139,92,246,0.08))', borderRadius:28, border:'1px solid rgba(99,102,241,0.2)' }}>
        {NODES.map((n,i) => {
          const isActive = active===i;
          const isPast = i < active;
          return (
            <React.Fragment key={n.label}>
              <motion.div animate={{ z: isActive?30:0, scale:isActive?1.07:1 }} transition={sp}
                style={{ flex:1, cursor:'pointer' }} onClick={() => setActive(i)}>
                <div style={{ ...clay(isActive?n.color:'color-mix(in srgb,'+n.color+' 40%,#1e293b 60%)', isActive?12:6), padding:'16px 10px', textAlign:'center' as const, transition:'all 0.3s' }}>
                  <motion.div animate={{ rotate:isActive?[0,10,-10,0]:0 }} transition={{ duration:0.6, repeat:isActive?Infinity:0 }} style={{ fontSize:26, marginBottom:8 }}>{n.icon}</motion.div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:'#fff', marginBottom:3 }}>{n.label}</div>
                  <div style={{ fontSize:8, color:'rgba(255,255,255,0.7)', lineHeight:1.4 }}>{n.sub}</div>
                  {isActive && <motion.div initial={{scale:0}} animate={{scale:1}} style={{ width:8, height:8, borderRadius:'50%', background:'#fff', margin:'8px auto 0', boxShadow:`0 0 16px ${n.color}` }} />}
                </div>
              </motion.div>
              {i<NODES.length-1 && (
                <div style={{ display:'flex', alignItems:'center', flexShrink:0, width:24 }}>
                  <motion.div animate={{ opacity:isPast||i===active?1:0.25, scaleX:isPast||i===active?1:0.5 }}
                    style={{ width:'100%', height:3, background:`linear-gradient(90deg,${NODES[i].color},${NODES[i+1].color})`, borderRadius:2, boxShadow:isPast||i===active?`0 0 12px ${NODES[i].color}`:'none', transition:'all 0.4s' }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ marginTop:12, textAlign:'center' as const, fontSize:11, color:'var(--ed-ink3)', fontStyle:'italic' }}>
        Click any system to focus. One analyst click — five systems involved.
      </div>
    </div>
  );
}

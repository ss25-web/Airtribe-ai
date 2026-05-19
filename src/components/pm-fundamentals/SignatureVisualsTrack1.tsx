'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

function ReplayBtn({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.button onClick={onReplay} whileHover={{ opacity: 0.75, scale: 1.03 }} whileTap={{ scale: 0.96 }}
      style={{ marginTop: '16px', padding: '7px 22px', borderRadius: '10px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--ed-rule)', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>
      ↺ replay
    </motion.button>
  );
}

function InsightBox({ color, label, children }: { color: string; label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: `${color}0D`, border: `1px solid ${color}30`, fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
      <strong style={{ color }}>{label}</strong>{children}
    </div>
  );
}

// ─── M01 · T1 · THE SIGNAL SWITCHBOARD ────────────────────────────────────────
// A 1950s operator's wooden switchboard cabinet. Three caller candlestick phones
// (Users / Business / Engineering) send coiled brass cords into the plug bank.
// Indicator lamps light as patches are made. A printed Decision slip emerges
// from the side slot. Teaches: PM connects existing signals, doesn't originate.

const CALLERS = [
  { id: 'users', label: 'USERS',       color: '#6366F1', dark: '#3730A3', tx: 90,  ty: 110, plugX: 285, plugY: 195, cordSide: 'right' as const, delay: 0 },
  { id: 'biz',   label: 'BUSINESS',    color: '#F97316', dark: '#9A3412', tx: 630, ty: 110, plugX: 435, plugY: 195, cordSide: 'left'  as const, delay: 0.25 },
  { id: 'eng',   label: 'ENGINEERING', color: '#22C55E', dark: '#15803D', tx: 360, ty: 470, plugX: 360, plugY: 285, cordSide: 'top'   as const, delay: 0.5 },
];

function CandlestickPhone({ color, dark, label }: { color: string; dark: string; label: string }) {
  return (
    <g>
      {/* Floor shadow */}
      <ellipse cx="0" cy="58" rx="34" ry="4" fill="rgba(0,0,0,0.28)" />
      {/* Round weighted base */}
      <ellipse cx="0" cy="52" rx="30" ry="8" fill="#0F0805" />
      <ellipse cx="0" cy="49" rx="28" ry="6" fill="url(#sw-brass)" />
      <ellipse cx="0" cy="48" rx="26" ry="4.5" fill="#2A1A0A" />
      {/* Vertical stem */}
      <rect x="-2.5" y="14" width="5" height="36" fill="#1A1208" />
      <rect x="-2.5" y="14" width="1.4" height="36" fill="rgba(255,255,255,0.2)" />
      {/* Side hook bracket */}
      <path d="M -3 24 Q -14 21 -14 30 Q -14 35 -10 35" stroke="#1A1208" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Earpiece hanging on the hook */}
      <g transform="translate(-16 36) rotate(-12)">
        <rect x="-4" y="-3" width="8" height="18" rx="2" fill="#1A1208" stroke="#3D2410" strokeWidth="0.5" />
        <ellipse cx="0" cy="-2" rx="5" ry="2.5" fill="url(#sw-brass)" />
        <ellipse cx="0" cy="15" rx="4.5" ry="2.2" fill="#0A0603" />
      </g>
      {/* Trumpet mouthpiece on top */}
      <path d="M -3 10 L -10 0 L 10 0 L 3 10 Z" fill="url(#sw-brass)" stroke="rgba(80,50,15,0.5)" strokeWidth="0.4" />
      <ellipse cx="0" cy="0" rx="10" ry="2.6" fill="#0A0603" />
      <ellipse cx="0" cy="0" rx="8" ry="1.8" fill="#1A0E05" />
      {[-5, -2.5, 0, 2.5, 5].map(x => <circle key={x} cx={x} cy="0" r="0.5" fill="rgba(255,200,90,0.55)" />)}
      {/* Name plate */}
      <g transform="translate(0 74)">
        <rect x="-48" y="-13" width="96" height="22" rx="4" fill={color} filter="url(#sw-soft)" />
        <rect x="-48" y="-13" width="96" height="4" rx="2" fill="rgba(255,255,255,0.32)" />
        <rect x="-48" y="5" width="96" height="4" rx="2" fill={dark} />
        <text x="0" y="3" textAnchor="middle" style={{ fontSize: '10px', fill: '#FFF', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: '0.16em' }}>{label}</text>
      </g>
    </g>
  );
}

// Coiled-cord path: oscillating curve from (x1,y1) to (x2,y2) with N coils.
function coiledCord(x1: number, y1: number, x2: number, y2: number, coils: number) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  const amp = 10;
  let d = `M ${x1} ${y1}`;
  for (let i = 1; i <= coils; i++) {
    const t = i / coils;
    const cxA = x1 + dx * (t - 0.6 / coils) + px * amp;
    const cyA = y1 + dy * (t - 0.6 / coils) + py * amp;
    const cxB = x1 + dx * (t - 0.1 / coils) - px * amp * 0.5;
    const cyB = y1 + dy * (t - 0.1 / coils) - py * amp * 0.5;
    const xe = x1 + dx * t;
    const ye = y1 + dy * t;
    d += ` C ${cxA} ${cyA}, ${cxB} ${cyB}, ${xe} ${ye}`;
  }
  return d;
}

export function SignalSwitchboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0);
    const ts = [1,2,3,4,5,6].map((s, i) => setTimeout(() => setStage(s), 400 + i * 700));
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.12)' }}>
        <svg viewBox="0 0 720 540" style={{ width: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="sw-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F2E9D2" /><stop offset="100%" stopColor="#D9C8A0" />
            </linearGradient>
            <pattern id="sw-wallpaper" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="14" cy="14" r="1" fill="#B89F66" opacity="0.32" />
              <circle cx="0" cy="0" r="1" fill="#B89F66" opacity="0.22" />
              <circle cx="28" cy="28" r="1" fill="#B89F66" opacity="0.22" />
            </pattern>
            <linearGradient id="sw-wood" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3D2410" /><stop offset="20%" stopColor="#6B4220" />
              <stop offset="50%" stopColor="#7B4F2A" /><stop offset="80%" stopColor="#5C381D" />
              <stop offset="100%" stopColor="#3D2410" />
            </linearGradient>
            <linearGradient id="sw-brass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FCD981" /><stop offset="45%" stopColor="#D9A347" />
              <stop offset="80%" stopColor="#8E6722" /><stop offset="100%" stopColor="#5C4015" />
            </linearGradient>
            <linearGradient id="sw-brassFlat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBD279" /><stop offset="100%" stopColor="#A37A28" />
            </linearGradient>
            <radialGradient id="sw-lampOff" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#3A2410" /><stop offset="100%" stopColor="#0F0805" />
            </radialGradient>
            <radialGradient id="sw-lampOn" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFF7C2" /><stop offset="35%" stopColor="#FFC247" />
              <stop offset="100%" stopColor="#7A3D08" />
            </radialGradient>
            <radialGradient id="sw-lampGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,200,70,0.55)" />
              <stop offset="100%" stopColor="rgba(255,200,70,0)" />
            </radialGradient>
            <linearGradient id="sw-paper" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBF6E6" /><stop offset="100%" stopColor="#E5D6A8" />
            </linearGradient>
            <linearGradient id="sw-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A2C16" /><stop offset="100%" stopColor="#1F1208" />
            </linearGradient>
            <filter id="sw-soft"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.22)"/></filter>
            <filter id="sw-cast"><feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="rgba(0,0,0,0.35)"/></filter>
          </defs>

          {/* Wall + wallpaper pattern */}
          <rect width="720" height="540" fill="url(#sw-wall)" />
          <rect width="720" height="540" fill="url(#sw-wallpaper)" />

          {/* Wood floor with perspective lines */}
          <polygon points="0,430 720,430 720,540 0,540" fill="url(#sw-floor)" />
          <line x1="0" y1="430" x2="720" y2="430" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" />
          {[0.18, 0.36, 0.52, 0.68, 0.84].map((p, i) => (
            <line key={i} x1={p * 720} y1="430" x2={p * 720 + (p - 0.5) * 280} y2="540" stroke="rgba(0,0,0,0.28)" strokeWidth="0.7" />
          ))}
          {/* Skirting board */}
          <rect x="0" y="425" width="720" height="6" fill="#2A180A" />
          <rect x="0" y="425" width="720" height="1.5" fill="url(#sw-brass)" opacity="0.5" />

          {/* Cast shadow under cabinet */}
          <rect x="234" y="78" width="252" height="356" rx="8" fill="rgba(0,0,0,0.4)" filter="url(#sw-cast)" />

          {/* Cabinet body */}
          <rect x="230" y="74" width="260" height="360" rx="8" fill="url(#sw-wood)" />
          {/* Wood grain striations */}
          {[100, 140, 180, 220, 260, 300, 340, 380, 420].map((y, i) => (
            <path key={i} d={`M 234 ${y} Q ${320 + Math.sin(i * 1.7) * 12} ${y + 1.5} ${410 + Math.cos(i * 1.3) * 8} ${y - 0.8} T 486 ${y + 1}`}
              stroke="rgba(0,0,0,0.22)" strokeWidth="0.6" fill="none" />
          ))}
          <rect x="230" y="74" width="3" height="360" fill="rgba(255,255,255,0.08)" />
          <rect x="487" y="74" width="3" height="360" fill="rgba(0,0,0,0.32)" />

          {/* Brass top & bottom trim */}
          <rect x="226" y="68" width="268" height="20" rx="3" fill="url(#sw-brass)" filter="url(#sw-soft)" />
          <rect x="226" y="86" width="268" height="2.5" fill="rgba(0,0,0,0.5)" />
          <rect x="226" y="430" width="268" height="14" rx="2" fill="url(#sw-brass)" />
          <rect x="226" y="430" width="268" height="2" fill="rgba(0,0,0,0.4)" />

          {/* Engraved oval nameplate */}
          <ellipse cx="360" cy="106" rx="118" ry="15" fill="url(#sw-brassFlat)" stroke="rgba(80,50,15,0.6)" strokeWidth="0.6" filter="url(#sw-soft)" />
          <ellipse cx="360" cy="106" rx="114" ry="12" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.4" />
          <text x="360" y="105" textAnchor="middle" style={{ fontSize: '10px', fill: '#3D2410', fontFamily: "Georgia, serif", fontWeight: 700, letterSpacing: '0.32em' }}>BELL &amp; CO · PM SWITCHBOARD</text>
          <text x="360" y="116" textAnchor="middle" style={{ fontSize: '6.5px', fill: '#5C381D', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.5em' }}>EST · MCMLII</text>

          {/* Corner brass screws */}
          {[[238,76],[478,76],[238,420],[478,420]].map(([x,y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="3.5" fill="url(#sw-brass)" stroke="#3D2410" strokeWidth="0.5" />
              <line x1={x-2} y1={y-2} x2={x+2} y2={y+2} stroke="#3D2410" strokeWidth="0.7" />
            </g>
          ))}

          {/* Indicator lamp row */}
          {[265, 295, 325, 355, 385, 415, 445, 475].map((x, i) => {
            const litThreshold = i < 3 ? 3 : i < 6 ? 4 : 5;
            const on = stage >= litThreshold;
            return (
              <g key={i}>
                {on && <circle cx={x} cy="138" r="14" fill="url(#sw-lampGlow)" />}
                <circle cx={x} cy="138" r="5" fill={on ? 'url(#sw-lampOn)' : 'url(#sw-lampOff)'} stroke="#1A0E05" strokeWidth="0.8" />
                <circle cx={x - 1.2} cy="136.5" r="1.2" fill={on ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.12)'} />
              </g>
            );
          })}

          {/* "LINE 01 — 08" brass strip */}
          <rect x="246" y="152" width="228" height="13" rx="2" fill="url(#sw-brassFlat)" opacity="0.92" />
          <rect x="246" y="163" width="228" height="1.5" fill="rgba(0,0,0,0.35)" />
          <text x="360" y="161" textAnchor="middle" style={{ fontSize: '7px', fill: '#3D2410', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.4em', fontWeight: 800 }}>LINE 01 — 08</text>

          {/* Plug-jack bank: two rows */}
          {[180, 215].map((rowY, rowI) => (
            <g key={rowY}>
              <rect x="246" y={rowY - 4} width="228" height="26" rx="2" fill="#0F0805" stroke="#3D2410" strokeWidth="0.6" />
              <rect x="246" y={rowY + 18} width="228" height="2" fill="rgba(0,0,0,0.6)" />
              {[265, 295, 325, 355, 385, 415, 445, 475].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy={rowY + 9} r="8" fill="url(#sw-brass)" stroke="#3D2410" strokeWidth="0.8" />
                  <circle cx={x} cy={rowY + 9} r="6.2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                  <circle cx={x} cy={rowY + 9} r="4" fill="#080402" stroke="#3D2410" strokeWidth="0.5" />
                  <circle cx={x} cy={rowY + 9} r="1.8" fill="#1A0E05" />
                </g>
              ))}
              {[265, 295, 325, 355, 385, 415, 445, 475].map((x, i) => (
                <text key={i} x={x} y={rowY + 26} textAnchor="middle" style={{ fontSize: '5px', fill: '#FCD981', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', opacity: 0.55 }}>
                  {String(rowI * 8 + i + 1).padStart(2, '0')}
                </text>
              ))}
            </g>
          ))}

          {/* OPERATOR brass plate */}
          <rect x="305" y="305" width="110" height="34" rx="4" fill="#1A0E05" stroke="url(#sw-brass)" strokeWidth="1.5" filter="url(#sw-soft)" />
          <text x="360" y="319" textAnchor="middle" style={{ fontSize: '7.5px', fill: '#FCD981', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.32em', fontWeight: 700 }}>OPERATOR</text>
          <circle cx="360" cy="332" r="7" fill="url(#sw-brass)" stroke="#3D2410" strokeWidth="0.6" />
          <text x="360" y="335" textAnchor="middle" style={{ fontSize: '9px', fill: '#3D2410', fontFamily: "Georgia, serif", fontWeight: 900 }}>PM</text>

          {/* Dial knob */}
          <g transform="translate(266 322)">
            <circle r="22" fill="rgba(0,0,0,0.35)" filter="url(#sw-soft)" />
            <circle r="20" fill="url(#sw-brass)" stroke="#3D2410" strokeWidth="1" />
            <circle r="16" fill="none" stroke="#3D2410" strokeWidth="0.5" />
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(ang => (
              <line key={ang} x1="0" y1="-17" x2="0" y2="-14" stroke="#3D2410" strokeWidth="0.7" transform={`rotate(${ang})`} />
            ))}
            <circle r="9" fill="#1A0E05" />
            <line x1="0" y1="0" x2="0" y2="-13" stroke="#FCD981" strokeWidth="2.2" strokeLinecap="round" transform="rotate(-42)" />
            <circle r="2.4" fill="#FCD981" />
          </g>

          {/* Operator headset on hook */}
          <g transform="translate(450 318)">
            <path d="M 0 -16 L 0 -4 Q 0 2 6 2" stroke="url(#sw-brass)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <circle cx="0" cy="-16" r="2" fill="url(#sw-brass)" />
            <path d="M -16 4 Q 0 -12 16 4" stroke="#1A0E05" strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="-16" cy="6" rx="5.5" ry="7" fill="#3D2410" stroke="#1A0E05" strokeWidth="0.8" />
            <ellipse cx="16" cy="6" rx="5.5" ry="7" fill="#3D2410" stroke="#1A0E05" strokeWidth="0.8" />
            <ellipse cx="-16" cy="6" rx="3" ry="4" fill="#0A0603" />
            <ellipse cx="16" cy="6" rx="3" ry="4" fill="#0A0603" />
            <ellipse cx="-16" cy="6" rx="1.5" ry="2" fill="rgba(255,200,90,0.25)" />
            <path d="M 16 12 Q 22 18 18 26 Q 14 34 22 42 Q 28 50 24 58 Q 20 66 26 74" stroke="#1A0E05" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </g>

          {/* Paper PATCH LOG pinned at side */}
          <g transform="translate(252 358) rotate(-4)">
            <rect width="44" height="58" fill="url(#sw-paper)" stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" filter="url(#sw-soft)" />
            <circle cx="22" cy="3" r="1.8" fill="url(#sw-brass)" stroke="#3D2410" strokeWidth="0.3" />
            <text x="22" y="13" textAnchor="middle" style={{ fontSize: '5px', fill: '#3D2410', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', fontWeight: 700 }}>PATCH LOG</text>
            <line x1="4" y1="16" x2="40" y2="16" stroke="#3D2410" strokeWidth="0.3" />
            {['LN-01 ✓', 'LN-02 ✓', 'LN-03 ✓', 'LN-04 ·', 'LN-05 ·'].map((s, i) => (
              <text key={i} x="4" y={26 + i * 7} style={{ fontSize: '5px', fill: '#3D2410', fontFamily: "'JetBrains Mono', monospace" }}>{s}</text>
            ))}
          </g>

          {/* Decision slot in cabinet side */}
          <rect x="487" y="252" width="6" height="26" fill="#080402" />
          <rect x="487" y="252" width="6" height="2" fill="rgba(0,0,0,0.7)" />

          {/* Decision slip emerging from slot */}
          {stage >= 6 && (
            <motion.g initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
              <rect x="491" y="256" width="100" height="18" fill="url(#sw-paper)" stroke="rgba(0,0,0,0.35)" strokeWidth="0.5" filter="url(#sw-soft)" />
              {[260, 264, 268, 272].map(y => <circle key={y} cx="494" cy={y} r="0.6" fill="rgba(0,0,0,0.3)" />)}
              <text x="541" y="263" textAnchor="middle" style={{ fontSize: '5px', fill: '#3D2410', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.22em' }}>OPERATOR SLIP №147</text>
              <text x="541" y="271" textAnchor="middle" style={{ fontSize: '8px', fill: '#5C381D', fontFamily: "Georgia, serif", fontWeight: 800, letterSpacing: '0.1em' }}>DECISION</text>
            </motion.g>
          )}

          {/* Caller phones */}
          {CALLERS.map((c) => (
            <motion.g key={c.id} transform={`translate(${c.tx} ${c.ty})`}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : 8 }}
              transition={{ delay: 0.2 + c.delay, duration: 0.5 }}>
              <CandlestickPhone color={c.color} dark={c.dark} label={c.label} />
            </motion.g>
          ))}

          {/* Coiled cords from each phone to its plug */}
          {CALLERS.map((c, i) => {
            const show = stage >= i + 2;
            const cordStartX = c.tx;
            const cordStartY = c.id === 'eng' ? c.ty - 8 : c.ty + 6;
            return show ? (
              <g key={c.id}>
                <motion.path d={coiledCord(cordStartX, cordStartY + 2, c.plugX, c.plugY + 2, c.id === 'eng' ? 6 : 8)}
                  stroke="rgba(0,0,0,0.18)" strokeWidth="4" fill="none" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.0, ease: 'easeOut' }} />
                <motion.path d={coiledCord(cordStartX, cordStartY, c.plugX, c.plugY, c.id === 'eng' ? 6 : 8)}
                  stroke={c.color} strokeWidth="3" fill="none" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.0, ease: 'easeOut' }} />
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.3 }}>
                  <ellipse cx={c.plugX} cy={c.plugY} rx="6" ry="4" fill="url(#sw-brass)" stroke="#3D2410" strokeWidth="0.5" />
                  <circle cx={c.plugX} cy={c.plugY} r="2.2" fill={c.dark} />
                  <circle cx={c.plugX - 1} cy={c.plugY - 1} r="0.8" fill="rgba(255,255,255,0.6)" />
                </motion.g>
              </g>
            ) : null;
          })}

          {/* Caller-station hint labels */}
          <text x="90" y="56" textAnchor="middle" style={{ fontSize: '8px', fill: '#6366F1', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', fontWeight: 800 }}>NEEDS</text>
          <text x="630" y="56" textAnchor="middle" style={{ fontSize: '8px', fill: '#F97316', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', fontWeight: 800 }}>GOALS</text>
          <text x="360" y="525" textAnchor="middle" style={{ fontSize: '8px', fill: '#22C55E', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', fontWeight: 800 }}>CONSTRAINTS</text>

          {stage >= 6 && (
            <motion.text x="540" y="245" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              style={{ fontSize: '8px', fill: '#5C381D', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', fontWeight: 800 }}>
              OUTPUT →
            </motion.text>
          )}
        </svg>
      </div>
      <InsightBox color="#6366F1" label="PM role: ">
        {' '}not the one talking — the one connecting the right signal to the right listener. Three cords come in. The PM patches them through. A printed decision comes out the side slot.
      </InsightBox>
      <ReplayBtn onReplay={() => { setStage(0); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M02 · T1 · THE BET BOARD ─────────────────────────────────────────────────
// A horse-racing tote board showing EdSpark's three strategic bets with odds,
// expected payout, and status. Teaches: strategy = choosing which bets to make.

const BETS = [
  { name: 'Fix Onboarding', code: 'OB-01', odds: '2/1', status: 'NOW', statusColor: '#22C55E', payout: '+28pp retention', desc: 'Clear the 40% week-2 drop', color: '#22C55E', dark: '#15803D' },
  { name: 'Analytics Dashboard', code: 'AN-04', odds: '4/1', status: 'NEXT', statusColor: '#6366F1', payout: '+ARR expansion', desc: 'Give managers proof of ROI', color: '#6366F1', dark: '#3730A3' },
  { name: 'Salesforce Integration', code: 'SF-07', odds: '8/1', status: 'LATER', statusColor: '#94A3B8', payout: 'Unknown', desc: 'Enterprise unlock — unvalidated', color: '#94A3B8', dark: '#64748B' },
];

export function BetBoard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [flicker, setFlicker] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0); setFlicker(false);
    const t1 = setTimeout(() => setFlicker(true), 300);
    const t2 = setTimeout(() => setFlicker(false), 700);
    BETS.forEach((_, i) => setTimeout(() => setVisible(i + 1), 800 + i * 600));
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(245,158,11,0.3)', boxShadow: '0 20px 48px rgba(0,0,0,0.12)' }}>
        {/* Board header */}
        <div style={{ background: '#1A1208', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '22px' }}>🏇</div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 900, color: '#F59E0B', letterSpacing: '0.2em' }}>EDSPARK STRATEGY · Q2 PRODUCT BETS</div>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>CHIPS AVAILABLE: 12 ENGINEER-WEEKS · PICK YOUR BETS WISELY</div>
          </div>
          <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '11px', color: flicker ? '#F59E0B' : 'rgba(245,158,11,0.5)', transition: 'color 0.1s', fontWeight: 700 }}>LIVE ●</div>
        </div>

        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px 120px', gap: '0', background: '#251A05', padding: '8px 20px' }}>
          {['BET', 'CODE', 'ODDS', 'STATUS', 'EXPECTED PAYOUT'].map((h, i) => (
            <div key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#D97706', letterSpacing: '0.14em' }}>{h}</div>
          ))}
        </div>

        {/* Bet rows */}
        <div style={{ background: '#1A1208' }}>
          {BETS.map((bet, i) => (
            <AnimatePresence key={bet.code}>
              {i < visible && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px 120px', gap: '0', padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#F0E8D8' }}>{bet.name}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{bet.desc}</div>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{bet.code}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 900, color: '#F59E0B' }}>{bet.odds}</div>
                  <div>
                    <div style={{ padding: '4px 10px', borderRadius: '6px', background: `${bet.statusColor}20`, border: `1px solid ${bet.statusColor}50`, display: 'inline-block' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 900, color: bet.statusColor, letterSpacing: '0.12em' }}>{bet.status}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: bet.statusColor }}>{bet.payout}</div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Footer */}
        {visible >= BETS.length && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ background: '#251A05', padding: '10px 20px', borderTop: '1px solid rgba(245,158,11,0.2)', fontFamily: 'monospace', fontSize: '10px', color: '#D97706' }}>
            STRATEGY IS NOT THE FEATURE LIST. IT IS THE SEQUENCE OF BETS AND THE CHIPS YOU PLACE ON EACH.
          </motion.div>
        )}
      </div>
      <InsightBox color="#F59E0B" label="Strategy = ">
        {' '}choosing which bets to place with finite chips. The bet you don&apos;t take is as important as the one you do. Odds reflect confidence. Sequencing reflects dependencies.
      </InsightBox>
      <ReplayBtn onReplay={() => { setVisible(0); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M03 · T1 · THE RESEARCH FISHING NETS ────────────────────────────────────
// Underwater scene. Three nets at different depths. Each catches different fish
// (insights). Fine mesh near surface = interviews. Large mesh mid-depth = surveys.
// Sonar beam in the dark deep = analytics. Teaches: method choice determines what you find.

const NET_ZONES = [
  { depth: 0, label: 'SURFACE', sublabel: 'Qualitative Interviews', color: '#6366F1', y: 30, fishColor: '#818CF8', fishLabel: 'Motivations, feelings, context', mesh: 'fine', icon: '🎤' },
  { depth: 1, label: 'MID-WATER', sublabel: 'Surveys & Polls', color: '#0EA5E9', y: 160, fishColor: '#38BDF8', fishLabel: 'Frequency, patterns, volume', mesh: 'medium', icon: '📋' },
  { depth: 2, label: 'DEEP WATER', sublabel: 'Analytics & Data', color: '#22C55E', y: 285, fishColor: '#4ADE80', fishLabel: 'Behaviour, funnels, cohorts', mesh: 'sonar', icon: '📊' },
];

export function ResearchFishingNets() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0);
    NET_ZONES.forEach((_, i) => setTimeout(() => setVisible(i + 1), 500 + i * 900));
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}>
        <svg viewBox="0 0 600 420" style={{ width: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="15%" stopColor="#7DD3FC" />
              <stop offset="40%" stopColor="#0369A1" />
              <stop offset="70%" stopColor="#1E3A5F" />
              <stop offset="100%" stopColor="#0A1929" />
            </linearGradient>
            <filter id="net-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Ocean background */}
          <rect x="0" y="0" width="600" height="420" fill="url(#ocean)" />

          {/* Sky */}
          <rect x="0" y="0" width="600" height="45" fill="linear-gradient(#87CEEB, #BAE6FD)" />
          <rect x="0" y="0" width="600" height="45" fill="#C0E8F8" />

          {/* Water surface ripple */}
          <path d="M0 45 Q75 40 150 45 Q225 50 300 45 Q375 40 450 45 Q525 50 600 45 L600 55 Q525 60 450 55 Q375 50 300 55 Q225 60 150 55 Q75 50 0 55 Z" fill="#7DD3FC" opacity="0.6" />

          {/* Boat at top */}
          <rect x="250" y="20" width="100" height="18" rx="4" fill="#92400E" />
          <polygon points="300,6 320,20 280,20" fill="#78350F" />
          {/* Boat label */}
          <text x="300" y="15" textAnchor="middle" style={{ fontSize: '8px', fill: '#FFFFFF', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.1em' }}>RESEARCH BOAT</text>

          {NET_ZONES.map((zone, i) => {
            const show = i < visible;
            return (
              <g key={zone.label}>
                {/* Fishing line from boat */}
                {show && (
                  <motion.line x1="300" y1="38" x2="300" y2={zone.y + 30}
                    stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="3 3"
                    initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5 }} />
                )}

                {/* Net */}
                {show && (
                  <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
                    {/* Net bag */}
                    <ellipse cx="300" cy={zone.y + 40} rx="80" ry="30" fill="none" stroke={zone.color} strokeWidth="1.5" opacity="0.7" />
                    {/* Net grid lines */}
                    {[-40, -20, 0, 20, 40].map(dx => (
                      <line key={dx} x1={300 + dx} y1={zone.y + 10} x2={300 + dx * 0.8} y2={zone.y + 70} stroke={zone.color} strokeWidth="0.8" opacity="0.5" />
                    ))}
                    {[0, 15, 30].map((dy, di) => (
                      <ellipse key={di} cx="300" cy={zone.y + 20 + dy} rx={75 - di * 10} ry="5" fill="none" stroke={zone.color} strokeWidth="0.8" opacity="0.5" />
                    ))}

                    {/* Fish caught */}
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                      <ellipse cx="280" cy={zone.y + 42} rx="12" ry="6" fill={zone.fishColor} opacity="0.8" />
                      <polygon points={`268,${zone.y + 42} 260,${zone.y + 37} 260,${zone.y + 47}`} fill={zone.fishColor} opacity="0.8" />
                      <ellipse cx="310" cy={zone.y + 48} rx="10" ry="5" fill={zone.fishColor} opacity="0.6" />
                      <polygon points={`300,${zone.y + 48} 293,${zone.y + 44} 293,${zone.y + 52}`} fill={zone.fishColor} opacity="0.6" />
                    </motion.g>

                    {/* Label card */}
                    <rect x="390" y={zone.y + 18} width="180" height="46" rx="8" fill="rgba(15,23,42,0.85)" stroke={zone.color} strokeWidth="1.2" />
                    <text x="400" y={zone.y + 33} style={{ fontSize: '8px', fill: zone.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.12em' }}>
                      {zone.icon} {zone.label}
                    </text>
                    <text x="400" y={zone.y + 47} style={{ fontSize: '9px', fill: 'rgba(255,255,255,0.75)', fontFamily: 'system-ui' }}>{zone.sublabel}</text>
                    <text x="400" y={zone.y + 60} style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.45)', fontFamily: 'system-ui' }}>{zone.fishLabel}</text>
                  </motion.g>
                )}
              </g>
            );
          })}

          {/* Depth markers */}
          {[60, 180, 300].map((y, i) => (
            <text key={i} x="16" y={y} style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace' }}>{i === 0 ? '0m' : i === 1 ? '5m' : '20m'}</text>
          ))}
        </svg>
      </div>
      <InsightBox color="#6366F1" label="Research method = ">
        {' '}depth and mesh size. Interviews catch nuanced insight near the surface. Surveys capture volume in mid-water. Analytics tracks behaviour in the deep. Each method misses what the others find.
      </InsightBox>
      <ReplayBtn onReplay={() => { setVisible(0); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M04 · T1 · THE PRIORITISATION FUNNEL ────────────────────────────────────
// 47 inputs pour in at the top. They filter through labelled layers and narrow
// to 2 sprint items at the bottom. Teaches: prioritisation is filtration.

const FUNNEL_LAYERS = [
  { label: '5 Whys → Root Problem', color: '#EF4444', kept: 28 },
  { label: 'Data validation', color: '#F97316', kept: 14 },
  { label: 'RICE scoring', color: '#F59E0B', kept: 7 },
  { label: 'MoSCoW: Must Have?', color: '#6366F1', kept: 3 },
  { label: 'Sprint capacity', color: '#22C55E', kept: 2 },
];

export function PrioritisationFunnelViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0);
    [0,1,2,3,4,5].forEach(i => setTimeout(() => setVisible(i + 1), 400 + i * 600));
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.08)' }}>
        <svg viewBox="0 0 600 480" style={{ width: '100%', display: 'block', background: 'linear-gradient(170deg, #F8F5F0 0%, #EDE8DF 100%)' }}>
          <defs><filter id="funnel-shadow"><feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(0,0,0,0.12)"/></filter></defs>

          {/* Input chaos at top */}
          {visible >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x="300" y="30" textAnchor="middle" style={{ fontSize: '11px', fill: '#EF4444', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.1em' }}>47 INPUTS — SLACK, EMAIL, SALES, SUPPORT</text>
              {/* Scattered input chips */}
              {[60,110,160,210,260,310,360,410,460,510,540,80,140,200,260,320,380,440,500].map((x, i) => (
                <motion.rect key={i} x={x} y={42 + (i % 3) * 14} width={36 + (i % 4) * 8} height="10" rx="5"
                  fill={['#EF4444','#F97316','#F59E0B','#6366F1','#8B5CF6'][i % 5]}
                  opacity="0.7"
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 0.7, y: 0 }}
                  transition={{ delay: i * 0.04 }} />
              ))}
            </motion.g>
          )}

          {/* Funnel shape */}
          {FUNNEL_LAYERS.map((layer, i) => {
            const topWidth = 560 - i * 80;
            const botWidth = 560 - (i + 1) * 80;
            const topX = (600 - topWidth) / 2;
            const botX = (600 - botWidth) / 2;
            const y = 90 + i * 66;
            const show = visible >= i + 2;
            return (
              <AnimatePresence key={i}>
                {show && (
                  <motion.g initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.4 }} style={{ transformOrigin: `300px ${y}px` }}>
                    <polygon points={`${topX},${y} ${topX + topWidth},${y} ${botX + botWidth},${y + 60} ${botX},${y + 60}`}
                      fill={layer.color} opacity="0.15" stroke={layer.color} strokeWidth="1.5" filter="url(#funnel-shadow)" />
                    {/* Layer label */}
                    <text x="300" y={y + 22} textAnchor="middle" style={{ fontSize: '10px', fill: layer.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: '0.1em' }}>
                      {layer.label}
                    </text>
                    {/* Items remaining */}
                    <text x="300" y={y + 42} textAnchor="middle" style={{ fontSize: '11px', fill: layer.color, fontFamily: 'monospace', fontWeight: 900 }}>
                      {layer.kept} items remain
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            );
          })}

          {/* Output at bottom */}
          {visible >= 7 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              style={{ transformOrigin: '300px 440px' }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
              <rect x="220" y="420" width="160" height="44" rx="12" fill="#22C55E" filter="url(#funnel-shadow)" />
              <rect x="220" y="420" width="160" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
              <text x="300" y="438" textAnchor="middle" style={{ fontSize: '9px', fill: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.14em' }}>THIS SPRINT</text>
              <text x="300" y="454" textAnchor="middle" style={{ fontSize: '13px', fill: '#fff', fontFamily: 'monospace', fontWeight: 900 }}>2 FEATURES</text>
            </motion.g>
          )}
        </svg>
      </div>
      <InsightBox color="#6366F1" label="Prioritisation = ">
        {' '}filtration. 47 things came in. 2 shipped. Every layer removed things that didn&apos;t survive scrutiny. The funnel is the system — without it, everything feels equally urgent.
      </InsightBox>
      <ReplayBtn onReplay={() => { setVisible(0); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M05 · T1 · FIVE STATES SOLAR SYSTEM ─────────────────────────────────────
// Success state = the Sun. Four UI states orbit it as planets.
// Most PMs spec only the Sun and forget the 4 planets.

const UI_STATE_PLANETS = [
  { id: 'loading', label: 'Loading', angle: -90, orbitR: 100, r: 22, color: '#6366F1', dark: '#3730A3', icon: '⏳', note: 'What the user sees while waiting — the most-used, least-specced state' },
  { id: 'error',   label: 'Error',   angle: 0,   orbitR: 140, r: 18, color: '#EF4444', dark: '#B91C1C', icon: '⚠️', note: 'What the user sees when something breaks — always written by engineers' },
  { id: 'empty',   label: 'Empty',   angle: 90,  orbitR: 100, r: 16, color: '#F59E0B', dark: '#D97706', icon: '📭', note: 'Day-1 experience before any data exists — abandonment lives here' },
  { id: 'edge',    label: 'Edge',    angle: 180, orbitR: 130, r: 14, color: '#94A3B8', dark: '#64748B', icon: '🔧', note: 'Files too large, names too long, network too slow — found in production' },
];

export function FiveStatesSolarSystem() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0); setSelected(null);
    setTimeout(() => setVisible(1), 400);
    UI_STATE_PLANETS.forEach((_, i) => setTimeout(() => setVisible(i + 2), 1000 + i * 700));
    setTimeout(() => setSelected('loading'), 1000 + UI_STATE_PLANETS.length * 700 + 400);
  }, [inView, tick]);

  const CX = 240, CY = 210;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', background: 'radial-gradient(ellipse at center, #0D1929 0%, #060D14 100%)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 56px rgba(0,0,0,0.35)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', alignItems: 'center' }}>
          <svg viewBox="0 0 480 420" style={{ width: '100%', display: 'block' }}>
            {/* Orbit rings */}
            {UI_STATE_PLANETS.map((p, i) => (
              <circle key={i} cx={CX} cy={CY} r={p.orbitR} fill="none" stroke={p.color} strokeWidth="0.8" strokeDasharray="4 4" opacity={visible >= i + 2 ? 0.3 : 0} />
            ))}

            {/* Sun — Success State */}
            {visible >= 1 && (
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ transformOrigin: `${CX}px ${CY}px` }}>
                {/* Sun glow */}
                <circle cx={CX} cy={CY} r="55" fill="rgba(245,158,11,0.1)" />
                <circle cx={CX} cy={CY} r="42" fill="rgba(245,158,11,0.2)" />
                <motion.circle cx={CX} cy={CY} r="32"
                  fill="#F59E0B"
                  animate={{ r: [32, 35, 32] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ filter: 'drop-shadow(0 0 12px rgba(245,158,11,0.8))' }} />
                <text x={CX} y={CY - 6} textAnchor="middle" style={{ fontSize: '9px', fill: '#fff', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.1em' }}>SUCCESS</text>
                <text x={CX} y={CY + 8} textAnchor="middle" style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace' }}>STATE</text>
                <text x={CX} y={CY + 22} textAnchor="middle" style={{ fontSize: '9px', fill: 'rgba(245,158,11,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>☀ THE SUN</text>
              </motion.g>
            )}

            {/* Planets */}
            {UI_STATE_PLANETS.map((p, i) => {
              const rad = p.angle * Math.PI / 180;
              const px = CX + p.orbitR * Math.cos(rad);
              const py = CY + p.orbitR * Math.sin(rad);
              const isSel = selected === p.id;
              return (
                <AnimatePresence key={p.id}>
                  {visible >= i + 2 && (
                    <motion.g initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: isSel ? 1.2 : 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                      style={{ transformOrigin: `${px}px ${py}px`, cursor: 'pointer' }}
                      onClick={() => setSelected(selected === p.id ? null : p.id)}>
                      <circle cx={px} cy={py} r={p.r} fill={p.color}
                        style={{ filter: isSel ? `drop-shadow(0 0 8px ${p.color})` : 'none' }} />
                      {isSel && <circle cx={px} cy={py} r={p.r + 8} fill="none" stroke={p.color} strokeWidth="2" opacity="0.4" />}
                      <text x={px} y={py + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: p.r < 18 ? '10px' : '12px', pointerEvents: 'none' }}>
                        {p.icon}
                      </text>
                      <text x={px} y={py + p.r + 12} textAnchor="middle" style={{ fontSize: '8px', fill: p.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>
                        {p.label}
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>
              );
            })}

            {/* Legend */}
            <text x="24" y="400" style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>click any planet to learn why it matters</text>
          </svg>

          {/* Right panel */}
          <div style={{ padding: '24px 20px' }}>
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  {UI_STATE_PLANETS.filter(p => p.id === selected).map(p => (
                    <div key={p.id} style={{ padding: '18px', borderRadius: '16px', background: `${p.color}14`, border: `1.5px solid ${p.color}40`, borderLeft: `4px solid ${p.color}` }}>
                      <div style={{ fontSize: '24px', marginBottom: '10px' }}>{p.icon}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: p.color, letterSpacing: '0.14em', marginBottom: '8px' }}>{p.label.toUpperCase()} STATE</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontWeight: 600 }}>{p.note}</div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.14em', marginBottom: '12px' }}>THE PM MISTAKE</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75 }}>
                    Most PMs spec only the Sun — the success state. The product ships. Then 4 forgotten planets crash in from orbit.
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                    A spec that covers only success is 20% complete.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <InsightBox color="#F59E0B" label="Every screen has 5 states. ">
        {' '}Spec the Success State and you&apos;re done with 20%. The four planets — Loading, Error, Empty, Edge — are used constantly and specced almost never.
      </InsightBox>
      <ReplayBtn onReplay={() => { setVisible(0); setSelected(null); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M06 · T1 · THE SIGNAL PRISM ─────────────────────────────────────────────
// One beam of product truth enters a prism. Four coloured beams exit, each
// the right translation for a different stakeholder.

export function SignalPrism() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0);
    [1,2,3,4,5].forEach((s, i) => setTimeout(() => setStage(s), 400 + i * 600));
  }, [inView, tick]);

  const BEAMS = [
    { label: 'Engineering', sub: 'API contract + scope', color: '#3A86FF', angle: -35, ex: 430, ey: 140 },
    { label: 'Design',      sub: 'User job + context', color: '#E07A5F', angle: -12, ex: 445, ey: 185 },
    { label: 'Leadership',  sub: 'Outcome + tradeoff', color: '#7843EE', angle: 12,  ex: 445, ey: 230 },
    { label: 'Sales / CS',  sub: 'What to promise',    color: '#059669', angle: 35,  ex: 430, ey: 275 },
  ];

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.08)' }}>
        <svg viewBox="0 0 600 400" style={{ width: '100%', display: 'block', background: 'linear-gradient(160deg, #F8F5F0 0%, #EDE8DF 100%)' }}>
          <defs>
            <filter id="prism-glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Input beam */}
          {stage >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x="40" y="190" width="100" height="36" rx="10" fill="#1F2937" />
              <text x="90" y="203" textAnchor="middle" style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>PRODUCT TRUTH</text>
              <text x="90" y="218" textAnchor="middle" style={{ fontSize: '9px', fill: '#fff', fontFamily: 'system-ui', fontWeight: 700 }}>&ldquo;Search is shipping&rdquo;</text>
              <motion.line x1="140" y1="208" x2="235" y2="208" stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
            </motion.g>
          )}

          {/* Prism */}
          {stage >= 2 && (
            <motion.polygon points="240,150 310,208 240,266" fill="rgba(99,102,241,0.15)" stroke="#6366F1" strokeWidth="2"
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              style={{ transformOrigin: '270px 208px' }} />
          )}

          {/* Output beams */}
          {BEAMS.map((beam, i) => (
            stage >= i + 3 && (
              <motion.g key={beam.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                <motion.line x1="310" y1="208" x2={beam.ex - 80} y2={beam.ey}
                  stroke={beam.color} strokeWidth="2.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                {/* Stakeholder card */}
                <rect x={beam.ex - 75} y={beam.ey - 18} width="200" height="36" rx="8" fill={beam.color} opacity="0.9" filter="url(#prism-glow)" />
                <text x={beam.ex - 65} y={beam.ey - 3} style={{ fontSize: '11px', fill: '#fff', fontWeight: 800, fontFamily: 'system-ui' }}>{beam.label}</text>
                <text x={beam.ex - 65} y={beam.ey + 12} style={{ fontSize: '9px', fill: 'rgba(255,255,255,0.75)', fontFamily: 'system-ui' }}>{beam.sub}</text>
              </motion.g>
            )
          ))}

          {/* Prism label */}
          {stage >= 2 && (
            <text x="272" y="295" textAnchor="middle" style={{ fontSize: '9px', fill: '#6366F1', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>PM</text>
          )}
        </svg>
      </div>
      <InsightBox color="#6366F1" label="Same truth, four translations. ">
        {' '}Engineering needs the contract. Design needs the user. Leadership needs the outcome. Sales needs what they can promise. Sending all four the same message serves none of them.
      </InsightBox>
      <ReplayBtn onReplay={() => { setStage(0); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M07 · T1 · THE METRIC CONSTELLATION ─────────────────────────────────────
// North Star = brightest central star. Guardrail metrics = ring of mid-size stars.
// Secondary/diagnostic = outer ring of small stars. Dotted lines show causality.

const NORTH_STAR = { label: 'Coaching ROI', sub: 'North Star', x: 300, y: 190 };
const GUARDRAILS = [
  { label: 'Week-2 retention', color: '#6366F1', angle: -120, r: 110 },
  { label: 'Session depth', color: '#0EA5E9', angle: -60, r: 110 },
  { label: 'Activation rate', color: '#22C55E', angle: 0, r: 110 },
  { label: 'Support load', color: '#F97316', angle: 60, r: 110 },
  { label: 'NPS', color: '#8B5CF6', angle: 120, r: 110 },
  { label: 'Churn rate', color: '#EF4444', angle: 180, r: 110 },
];
const SECONDARY = [
  { label: 'Onboarding\ncompletion', color: '#94A3B8', angle: -150, r: 185 },
  { label: 'Search\nusage', color: '#94A3B8', angle: -90, r: 185 },
  { label: 'Coach\ncomments', color: '#94A3B8', angle: -30, r: 185 },
  { label: 'DAU/MAU', color: '#94A3B8', angle: 30, r: 185 },
  { label: 'Feature\nadoption', color: '#94A3B8', angle: 90, r: 185 },
  { label: 'Ramp\ntime', color: '#94A3B8', angle: 150, r: 185 },
];

export function MetricConstellation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0);
    [1,2,3].forEach((s, i) => setTimeout(() => setStage(s), 400 + i * 800));
  }, [inView, tick]);

  const toXY = (angle: number, r: number) => ({
    x: NORTH_STAR.x + r * Math.cos(angle * Math.PI / 180),
    y: NORTH_STAR.y + r * Math.sin(angle * Math.PI / 180),
  });

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 45%, #0D1929 0%, #040810 100%)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 56px rgba(0,0,0,0.35)' }}>
        <svg viewBox="0 0 600 400" style={{ width: '100%', display: 'block' }}>
          {/* Background stars */}
          {Array.from({ length: 40 }, (_, i) => ({ x: (i * 47 + 13) % 590, y: (i * 83 + 29) % 390 })).map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={0.8} fill="rgba(255,255,255,0.2)" />
          ))}

          {/* Connection lines to North Star */}
          {stage >= 2 && GUARDRAILS.map((g, i) => {
            const pos = toXY(g.angle, g.r);
            return (
              <motion.line key={i} x1={NORTH_STAR.x} y1={NORTH_STAR.y} x2={pos.x} y2={pos.y}
                stroke={g.color} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.35"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: i * 0.08 }} />
            );
          })}

          {/* Secondary dots */}
          {stage >= 3 && SECONDARY.map((s, i) => {
            const pos = toXY(s.angle, s.r);
            return (
              <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22, delay: i * 0.08 }}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}>
                <circle cx={pos.x} cy={pos.y} r="5" fill={s.color} opacity="0.5" />
                <text x={pos.x} y={pos.y + 15} textAnchor="middle" style={{ fontSize: '7px', fill: 'rgba(255,255,255,0.35)', fontFamily: 'system-ui', lineHeight: 1.3 }}>
                  {s.label.split('\n')[0]}
                </text>
              </motion.g>
            );
          })}

          {/* Guardrail stars */}
          {stage >= 2 && GUARDRAILS.map((g, i) => {
            const pos = toXY(g.angle, g.r);
            return (
              <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22, delay: i * 0.1 }}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}>
                <circle cx={pos.x} cy={pos.y} r="10" fill={g.color} style={{ filter: `drop-shadow(0 0 5px ${g.color})` }} />
                <text x={pos.x} y={pos.y + 20} textAnchor="middle" style={{ fontSize: '8px', fill: g.color, fontFamily: 'system-ui', fontWeight: 700 }}>
                  {g.label}
                </text>
              </motion.g>
            );
          })}

          {/* North Star */}
          {stage >= 1 && (
            <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ transformOrigin: `${NORTH_STAR.x}px ${NORTH_STAR.y}px` }}>
              <motion.circle cx={NORTH_STAR.x} cy={NORTH_STAR.y} r="26"
                fill="#F59E0B" animate={{ r: [26, 29, 26] }} transition={{ duration: 3, repeat: Infinity }}
                style={{ filter: 'drop-shadow(0 0 14px rgba(245,158,11,0.9))' }} />
              <text x={NORTH_STAR.x} y={NORTH_STAR.y - 6} textAnchor="middle" style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>NORTH</text>
              <text x={NORTH_STAR.x} y={NORTH_STAR.y + 6} textAnchor="middle" style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>STAR</text>
              <text x={NORTH_STAR.x} y={NORTH_STAR.y + 44} textAnchor="middle" style={{ fontSize: '9px', fill: '#F59E0B', fontFamily: 'system-ui', fontWeight: 700 }}>{NORTH_STAR.label}</text>
            </motion.g>
          )}

          {/* Legend */}
          {[{ c: '#F59E0B', l: 'North Star' }, { c: '#6366F1', l: 'Guardrails (6)' }, { c: '#94A3B8', l: 'Diagnostics (6)' }].map((item, i) => (
            <g key={i}>
              <circle cx={28} cy={355 + i * 16} r="4" fill={item.c} />
              <text x="38" y={360 + i * 16} style={{ fontSize: '9px', fill: 'rgba(255,255,255,0.5)', fontFamily: 'system-ui' }}>{item.l}</text>
            </g>
          ))}
        </svg>
      </div>
      <InsightBox color="#F59E0B" label="Metrics form a system. ">
        {' '}North Star sits at the top. Guardrail metrics ring it — they protect against gaming the north star. Diagnostic metrics sit in the outer ring — they explain why things move. Manage all three layers or the system misleads you.
      </InsightBox>
      <ReplayBtn onReplay={() => { setStage(0); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M08 · T1 · THE LAUNCH RUNWAY ────────────────────────────────────────────
// Runway viewed from cockpit. Markers show launch stages as the aircraft taxis.
// Teaches: launch is a process, not a cliff-edge jump.

const RUNWAY_STAGES = [
  { label: 'Internal Beta', sub: 'Team only', color: '#94A3B8', pct: 0.12 },
  { label: 'Design Partners', sub: '3-5 accounts', color: '#6366F1', pct: 0.28 },
  { label: 'Paid Pilot', sub: '10–20 accounts', color: '#0EA5E9', pct: 0.46 },
  { label: 'Controlled Release', sub: 'Segment gating', color: '#F97316', pct: 0.66 },
  { label: 'General Availability', sub: 'All users', color: '#22C55E', pct: 0.88 },
];

export function LaunchRunwayViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [planePos, setPlanePos] = useState(0);
  const [activeStage, setActiveStage] = useState(-1);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setPlanePos(0); setActiveStage(-1);
    const total = 4000;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / total, 1);
      setPlanePos(t);
      const stageIdx = RUNWAY_STAGES.findIndex((s, i) => t >= s.pct && (i === RUNWAY_STAGES.length - 1 || t < RUNWAY_STAGES[i + 1].pct));
      setActiveStage(stageIdx);
      if (t < 1) requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.08)' }}>
        <svg viewBox="0 0 600 320" style={{ width: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="sky-rw" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="60%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#F0F9FF" />
            </linearGradient>
            <linearGradient id="runway-rw" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1F2937" />
            </linearGradient>
            {/* Perspective transform for vanishing point */}
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width="600" height="200" fill="url(#sky-rw)" />
          {/* Horizon clouds */}
          <ellipse cx="120" cy="60" rx="60" ry="20" fill="rgba(255,255,255,0.7)" />
          <ellipse cx="400" cy="45" rx="80" ry="22" fill="rgba(255,255,255,0.8)" />

          {/* Runway in perspective */}
          <polygon points="230,200 370,200 590,320 10,320" fill="url(#runway-rw)" />
          {/* Centre line */}
          {[0,1,2,3,4,5,6,7].map(i => {
            const y1 = 200 + i * 15;
            const midX = 300;
            const spread = i * 25;
            return <line key={i} x1={midX - spread * 0.1} y1={y1} x2={midX + spread * 0.1} y2={y1 + 10} stroke="rgba(255,255,255,0.4)" strokeWidth="3" />;
          })}
          {/* Runway edge lines */}
          <line x1="230" y1="200" x2="10" y2="320" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <line x1="370" y1="200" x2="590" y2="320" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

          {/* Stage markers */}
          {RUNWAY_STAGES.map((s, i) => {
            const baseY = 200 + (s.pct * 0.7) * 120;
            const markerX = 300 + (i % 2 === 0 ? -1 : 1) * (90 - i * 10);
            const isActive = i <= activeStage;
            return (
              <g key={i}>
                {/* Marker line */}
                <line x1={300 - (s.pct * 60)} y1={baseY} x2={300 + (s.pct * 60)} y2={baseY}
                  stroke={isActive ? s.color : 'rgba(255,255,255,0.2)'} strokeWidth="2.5" />
                {/* Stage card */}
                <rect x={markerX - 60} y={baseY - 28} width="120" height="26" rx="6"
                  fill={isActive ? s.color : 'rgba(30,40,50,0.7)'} opacity={isActive ? 0.9 : 0.6} />
                <text x={markerX} y={baseY - 16} textAnchor="middle"
                  style={{ fontSize: '8px', fill: '#fff', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.08em' }}>
                  {s.label}
                </text>
                <text x={markerX} y={baseY - 5} textAnchor="middle"
                  style={{ fontSize: '7px', fill: 'rgba(255,255,255,0.65)', fontFamily: 'system-ui' }}>
                  {s.sub}
                </text>
              </g>
            );
          })}

          {/* Aircraft — perspective position */}
          {(() => {
            const y = 200 + planePos * 0.7 * 120;
            const scale = 0.4 + planePos * 0.6;
            const cx = 300;
            return (
              <motion.g style={{ transform: `translate(${cx}px,${y}px) scale(${scale})` }}>
                {/* Simple aircraft silhouette */}
                <ellipse cx="0" cy="0" rx="20" ry="6" fill="#1F2937" />
                <polygon points="-8,-4 -20,-12 -20,-6" fill="#374151" />
                <polygon points="8,-4 20,-12 20,-6" fill="#374151" />
                <polygon points="-18,0 -30,6 -25,6" fill="#374151" />
              </motion.g>
            );
          })()}
        </svg>
      </div>
      <InsightBox color="#22C55E" label="Launch is a runway, not a cliff. ">
        {' '}You don&apos;t jump from &ldquo;not live&rdquo; to &ldquo;all users&rdquo; in one step. Each stage gates the next. Miss a stage and you increase blast radius — not speed.
      </InsightBox>
      <ReplayBtn onReplay={() => { setPlanePos(0); setActiveStage(-1); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M09 · T1 · THE RESTAURANT KITCHEN ────────────────────────────────────────
// Floor plan from above. Four zones: Front of house (frontend), Kitchen (backend),
// Pantry (database), Pass-through window (API). Order ticket travels through all zones.

const KITCHEN_ZONES = [
  { id: 'foh', label: 'Front of House', sub: 'Frontend', color: '#6366F1', x: 60, y: 60, w: 200, h: 160, desc: 'What users see and interact with. Displays data, captures input.' },
  { id: 'window', label: 'Pass-Through', sub: 'API', color: '#F59E0B', x: 260, y: 110, w: 80, h: 60, desc: 'The contract between frontend and backend. Defines what can be asked and what comes back.' },
  { id: 'kitchen', label: 'Kitchen', sub: 'Backend', color: '#EF4444', x: 340, y: 60, w: 200, h: 160, desc: 'Business logic, validation, rules. Processes requests, coordinates data.' },
  { id: 'pantry', label: 'Pantry', sub: 'Database', color: '#22C55E', x: 400, y: 240, w: 140, h: 120, desc: 'Where data lives. Tables, queries, relationships, migrations.' },
];

const TICKET_PATH = [
  { x: 120, y: 180 }, // Customer at table
  { x: 260, y: 140 }, // Pass-through window
  { x: 420, y: 140 }, // Kitchen
  { x: 450, y: 280 }, // Pantry
  { x: 420, y: 140 }, // Back to kitchen
  { x: 260, y: 140 }, // Back through window
  { x: 120, y: 180 }, // Back to customer
];

export function RestaurantKitchenViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [ticketStep, setTicketStep] = useState(-1);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setTicketStep(-1);
    TICKET_PATH.forEach((_, i) => setTimeout(() => setTicketStep(i), 600 + i * 700));
  }, [inView, tick]);

  const ticketPos = ticketStep >= 0 && ticketStep < TICKET_PATH.length ? TICKET_PATH[ticketStep] : TICKET_PATH[0];
  const sel = KITCHEN_ZONES.find(z => z.id === selectedZone);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px' }}>
          <svg viewBox="0 0 600 400" style={{ width: '100%', display: 'block', background: 'linear-gradient(160deg, #F8F5F0 0%, #EDE8DF 100%)' }}>
            <defs><filter id="zone-shadow"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.12)"/></filter></defs>

            {/* Zone rectangles */}
            {KITCHEN_ZONES.map(zone => (
              <g key={zone.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}>
                <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="12"
                  fill={selectedZone === zone.id ? `${zone.color}25` : `${zone.color}10`}
                  stroke={zone.color} strokeWidth={selectedZone === zone.id ? 2.5 : 1.5}
                  filter="url(#zone-shadow)" style={{ transition: 'all 0.3s' }} />
                <text x={zone.x + zone.w / 2} y={zone.y + 28} textAnchor="middle"
                  style={{ fontSize: '11px', fill: zone.color, fontFamily: 'system-ui', fontWeight: 800 }}>{zone.label}</text>
                <text x={zone.x + zone.w / 2} y={zone.y + 44} textAnchor="middle"
                  style={{ fontSize: '9px', fill: zone.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, opacity: 0.7 }}>{zone.sub}</text>
              </g>
            ))}

            {/* Ticket trail */}
            {ticketStep > 0 && Array.from({ length: Math.min(ticketStep, TICKET_PATH.length - 1) }, (_, i) => (
              <line key={i}
                x1={TICKET_PATH[i].x} y1={TICKET_PATH[i].y}
                x2={TICKET_PATH[i + 1].x} y2={TICKET_PATH[i + 1].y}
                stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 3" opacity="0.6" />
            ))}

            {/* Ticket */}
            {ticketStep >= 0 && (
              <motion.g animate={{ x: ticketPos.x, y: ticketPos.y }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
                <rect x="-18" y="-10" width="36" height="20" rx="4" fill="#F59E0B" />
                <text x="0" y="4" textAnchor="middle" style={{ fontSize: '8px', fill: '#fff', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>ORDER</text>
              </motion.g>
            )}

            {/* Direction arrows between zones */}
            <text x="300" y="380" textAnchor="middle" style={{ fontSize: '8px', fill: 'var(--ed-ink3)', fontFamily: 'JetBrains Mono, monospace' }}>click any zone to learn what it does — watch the order ticket travel</text>
          </svg>

          {/* Detail panel */}
          <div style={{ padding: '20px', borderLeft: '1px solid var(--ed-rule)', background: 'var(--ed-card)' }}>
            <AnimatePresence mode="wait">
              {sel ? (
                <motion.div key={sel.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <div style={{ padding: '14px', borderRadius: '12px', background: `${sel.color}12`, border: `1.5px solid ${sel.color}35`, borderLeft: `4px solid ${sel.color}` }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: sel.color, letterSpacing: '0.14em', marginBottom: '6px' }}>{sel.sub.toUpperCase()}</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ed-ink)', marginBottom: '8px' }}>{sel.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{sel.desc}</div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '10px' }}>THE TECH STACK</div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>Every restaurant you&apos;ve been to runs on the same model as the software you ship.</div>
                  {KITCHEN_ZONES.map(z => (
                    <div key={z.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: z.color, flexShrink: 0 }} />
                      <div style={{ fontSize: '11px', color: 'var(--ed-ink2)' }}><strong style={{ color: z.color }}>{z.sub}</strong> = {z.label}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <InsightBox color="#6366F1" label="The tech stack is just a kitchen. ">
        {' '}Frontend = dining room. API = pass-through window. Backend = kitchen. Database = pantry. Every order travels the same path. Understanding this changes how PMs write specs and estimate work.
      </InsightBox>
      <ReplayBtn onReplay={() => { setTicketStep(-1); setSelectedZone(null); setTick(t => t + 1); }} />
    </div>
  );
}

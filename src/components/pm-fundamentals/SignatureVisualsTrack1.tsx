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

// ─── M01 · T1 · THE PM TRANSLATION DESK ───────────────────────────────────────
// A real PM Monday morning: three input panels (User support inbox / Retention
// dashboard / Eng Slack) each speak a different "language" about the same
// underlying problem. Priya's PRD synthesises all three into ONE coherent
// decision that explicitly cites each input. Teaches: PM = translator across
// three vocabularies who produces one coherent priority.

// Card geometry — three even input panels: 30 margin / 200 width / 30 gap
const CARDS = [
  { x: 30,  cx: 130, color: '#6366F1', headerFill: '#6366F1', langLabel: 'USER LANGUAGE',     langQuote: '“the thing is broken”',  bgTint: 'rgba(99,102,241,0.06)' },
  { x: 260, cx: 360, color: '#F97316', headerFill: '#1B2A47', langLabel: 'BUSINESS LANGUAGE', langQuote: '“the number is wrong”',  bgTint: 'rgba(249,115,22,0.06)' },
  { x: 490, cx: 590, color: '#22C55E', headerFill: '#3F0E40', langLabel: 'ENG LANGUAGE',      langQuote: '“the system is fragile”', bgTint: 'rgba(34,197,94,0.06)' },
];

export function SignalSwitchboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0);
    const ts = [1,2,3,4,5,6].map((s, i) => setTimeout(() => setStage(s), 300 + i * 750));
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.10)' }}>
        <svg viewBox="0 0 720 700" style={{ width: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="m1-page" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F7F4EC" /><stop offset="100%" stopColor="#EFEAD9" />
            </linearGradient>
            <linearGradient id="m1-redArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
            </linearGradient>
            <filter id="m1-soft"><feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="rgba(0,0,0,0.10)"/></filter>
            <filter id="m1-priya"><feDropShadow dx="0" dy="6" stdDeviation="14" floodColor="rgba(79,70,229,0.30)"/></filter>
          </defs>

          {/* Page */}
          <rect width="720" height="700" fill="url(#m1-page)" />

          {/* Status bar */}
          <rect x="0" y="0" width="720" height="36" fill="#1E1B2E" />
          <circle cx="20" cy="18" r="4" fill="#22C55E" />
          <text x="32" y="22" style={{ fontSize: '11px', fill: '#FFF', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.08em' }}>EdSpark</text>
          <text x="93" y="22" style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>·</text>
          <text x="104" y="22" style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>Sprint 14</text>
          <text x="167" y="22" style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>·</text>
          <text x="178" y="22" style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>Mon 09:42</text>
          <text x="710" y="22" textAnchor="end" style={{ fontSize: '10px', fill: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em' }}>PRIYA&apos;S MONDAY MORNING</text>

          {/* Caption */}
          <text x="360" y="62" textAnchor="middle" style={{ fontSize: '11px', fill: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.22em', fontWeight: 800 }}>THREE INPUTS · THREE LANGUAGES</text>

          {/* ═══ Card 1: Support Inbox ═══ */}
          <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : 12 }} transition={{ duration: 0.5 }}>
            <rect x="30" y="80" width="200" height="240" rx="10" fill="#FFFFFF" stroke="#E0DBC9" strokeWidth="1" filter="url(#m1-soft)" />
            {/* Header */}
            <path d="M 30 90 Q 30 80 40 80 L 220 80 Q 230 80 230 90 L 230 112 L 30 112 Z" fill="#6366F1" />
            <circle cx="44" cy="96" r="4" fill="#FFF" />
            <rect x="40" y="92" width="8" height="2" fill="#6366F1" />
            <text x="56" y="100" style={{ fontSize: '11px', fill: '#FFF', fontFamily: "system-ui", fontWeight: 800 }}>Support · Inbox</text>
            <text x="222" y="100" textAnchor="end" style={{ fontSize: '9px', fill: 'rgba(255,255,255,0.9)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>47 OPEN</text>

            {/* 4 ticket rows */}
            {[
              { user: 'Sarah K.', msg: '“keeps logging me out”',  time: '8m',  pri: '#EF4444' },
              { user: 'Marcus T.', msg: '“can’t stay signed in”', time: '14m', pri: '#EF4444' },
              { user: 'Priya N.',  msg: '“log in 5x per session”',     time: '22m', pri: '#F59E0B' },
              { user: 'Devon R.',  msg: '“keeps booting me out”',      time: '41m', pri: '#EF4444' },
            ].map((t, i) => (
              <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: stage >= 1 ? 1 : 0, x: 0 }} transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}>
                <rect x="40" y={124 + i * 36} width="180" height="30" rx="5" fill="#FAF8F2" stroke="#E5DDC1" strokeWidth="0.6" />
                <rect x="40" y={124 + i * 36} width="3" height="30" rx="1" fill={t.pri} />
                <circle cx="54" cy={139 + i * 36} r="6" fill="#E5E7EB" />
                <text x="54" y={142 + i * 36} textAnchor="middle" style={{ fontSize: '7px', fill: '#6B7280', fontWeight: 800, fontFamily: 'system-ui' }}>{t.user[0]}</text>
                <text x="66" y={137 + i * 36} style={{ fontSize: '9px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 700 }}>{t.user}</text>
                <text x="215" y={137 + i * 36} textAnchor="end" style={{ fontSize: '8px', fill: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace" }}>{t.time}</text>
                <text x="66" y={149 + i * 36} style={{ fontSize: '8.5px', fill: '#4B5563', fontFamily: "system-ui" }}>{t.msg}</text>
              </motion.g>
            ))}

            {/* Footer language band (inside card) */}
            <rect x="30" y="280" width="200" height="40" fill="rgba(99,102,241,0.07)" />
            <rect x="30" y="280" width="200" height="1" fill="rgba(99,102,241,0.25)" />
            <text x="130" y="296" textAnchor="middle" style={{ fontSize: '8.5px', fill: '#6366F1', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: '0.2em' }}>USER LANGUAGE</text>
            <text x="130" y="311" textAnchor="middle" style={{ fontSize: '10px', fill: '#3730A3', fontFamily: "system-ui", fontStyle: 'italic' }}>{'“'}the thing is broken{'”'}</text>
          </motion.g>

          {/* ═══ Card 2: Exec Dashboard ═══ */}
          <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 12 }} transition={{ duration: 0.5 }}>
            <rect x="260" y="80" width="200" height="240" rx="10" fill="#FFFFFF" stroke="#E0DBC9" strokeWidth="1" filter="url(#m1-soft)" />
            <path d="M 260 90 Q 260 80 270 80 L 450 80 Q 460 80 460 90 L 460 112 L 260 112 Z" fill="#1B2A47" />
            <rect x="272" y="92" width="10" height="8" rx="1" fill="#F97316" />
            <rect x="276" y="90" width="2" height="10" fill="#F97316" />
            <text x="290" y="100" style={{ fontSize: '11px', fill: '#FFF', fontFamily: "system-ui", fontWeight: 800 }}>Exec Dashboard</text>
            <text x="452" y="100" textAnchor="end" style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em' }}>WEEKLY</text>

            <text x="272" y="130" style={{ fontSize: '9px', fill: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', fontWeight: 700 }}>WEEK-2 RETENTION</text>
            <text x="272" y="166" style={{ fontSize: '32px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 900, letterSpacing: '-0.02em' }}>32%</text>
            <rect x="346" y="148" width="58" height="22" rx="11" fill="#FEE2E2" />
            <text x="375" y="163" textAnchor="middle" style={{ fontSize: '11px', fill: '#DC2626', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>−8.3pp</text>
            <text x="272" y="184" style={{ fontSize: '9px', fill: '#9CA3AF', fontFamily: "system-ui" }}>vs last sprint · target 45%</text>

            {/* Chart */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: stage >= 2 ? 1 : 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <rect x="272" y="196" width="178" height="78" rx="6" fill="#FAFAFA" stroke="#E5E7EB" strokeWidth="0.6" />
              {[214, 232, 250, 268].map(y => <line key={y} x1="282" y1={y} x2="442" y2={y} stroke="#E5E7EB" strokeWidth="0.4" />)}
              <line x1="282" y1="216" x2="442" y2="216" stroke="#22C55E" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6" />
              <text x="441" y="214" textAnchor="end" style={{ fontSize: '7px', fill: '#22C55E', fontFamily: "'JetBrains Mono', monospace" }}>target 45%</text>
              <polygon points="282,212 300,214 318,218 336,224 354,232 372,242 390,252 408,258 426,264 442,266 442,272 282,272" fill="url(#m1-redArea)" />
              <motion.path d="M 282 212 L 300 214 L 318 218 L 336 224 L 354 232 L 372 242 L 390 252 L 408 258 L 426 264 L 442 266"
                fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: stage >= 2 ? 1 : 0 }} transition={{ duration: 0.9, delay: 0.4 }} />
              <circle cx="442" cy="266" r="3" fill="#EF4444" stroke="#FFF" strokeWidth="1.2" />
            </motion.g>

            {/* Footer */}
            <rect x="260" y="280" width="200" height="40" fill="rgba(249,115,22,0.08)" />
            <rect x="260" y="280" width="200" height="1" fill="rgba(249,115,22,0.3)" />
            <text x="360" y="296" textAnchor="middle" style={{ fontSize: '8.5px', fill: '#C2410C', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: '0.2em' }}>BUSINESS LANGUAGE</text>
            <text x="360" y="311" textAnchor="middle" style={{ fontSize: '10px', fill: '#9A3412', fontFamily: "system-ui", fontStyle: 'italic' }}>{'“'}the number is wrong{'”'}</text>
          </motion.g>

          {/* ═══ Card 3: Eng Slack ═══ */}
          <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 12 }} transition={{ duration: 0.5 }}>
            <rect x="490" y="80" width="200" height="240" rx="10" fill="#FFFFFF" stroke="#E0DBC9" strokeWidth="1" filter="url(#m1-soft)" />
            <path d="M 490 90 Q 490 80 500 80 L 680 80 Q 690 80 690 90 L 690 112 L 490 112 Z" fill="#3F0E40" />
            <text x="502" y="100" style={{ fontSize: '13px', fill: '#FFF', fontFamily: "system-ui", fontWeight: 900 }}>#</text>
            <text x="514" y="100" style={{ fontSize: '11px', fill: '#FFF', fontFamily: "system-ui", fontWeight: 800 }}>eng-platform</text>
            <text x="682" y="100" textAnchor="end" style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em' }}>8 ONLINE</text>

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: stage >= 3 ? 1 : 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
              <rect x="500" y="124" width="30" height="30" rx="5" fill="#3A86FF" />
              <text x="515" y="144" textAnchor="middle" style={{ fontSize: '13px', fill: '#FFF', fontFamily: "system-ui", fontWeight: 900 }}>K</text>
              <text x="538" y="138" style={{ fontSize: '11px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 800 }}>Kiran</text>
              <text x="572" y="138" style={{ fontSize: '9px', fill: '#9CA3AF', fontFamily: "system-ui" }}>9:38 AM</text>
              <text x="538" y="152" style={{ fontSize: '9.5px', fill: '#1F2937', fontFamily: "system-ui" }}>auth service is melting.</text>
            </motion.g>

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: stage >= 3 ? 1 : 0 }} transition={{ delay: 0.35, duration: 0.4 }}>
              <text x="538" y="170" style={{ fontSize: '9.5px', fill: '#1F2937', fontFamily: "system-ui" }}>every tab-switch mints</text>
              <text x="538" y="184" style={{ fontSize: '9.5px', fill: '#1F2937', fontFamily: "system-ui" }}>a new JWT. p99 = 4.2s.</text>
            </motion.g>

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: stage >= 3 ? 1 : 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
              <rect x="500" y="196" width="180" height="48" rx="4" fill="#0D1117" />
              <text x="508" y="212" style={{ fontSize: '8.5px', fill: '#9CD7FF', fontFamily: "'JetBrains Mono', monospace" }}>auth-service.ts:142</text>
              <text x="508" y="226" style={{ fontSize: '8.5px', fill: '#7EE787', fontFamily: "'JetBrains Mono', monospace" }}>{`// mintJWT() — O(n) per call`}</text>
              <text x="508" y="238" style={{ fontSize: '8.5px', fill: '#FFA657', fontFamily: "'JetBrains Mono', monospace" }}>cache fix · 2 sprints</text>
            </motion.g>

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: stage >= 3 ? 1 : 0 }} transition={{ delay: 0.7, duration: 0.4 }}>
              <text x="500" y="262" style={{ fontSize: '9.5px', fill: '#1F2937', fontFamily: "system-ui" }}>need PM call @priya:</text>
              <text x="500" y="275" style={{ fontSize: '9.5px', fill: '#1F2937', fontFamily: "system-ui" }}>ship-cache or rollback?</text>
            </motion.g>

            <rect x="490" y="280" width="200" height="40" fill="rgba(34,197,94,0.08)" />
            <rect x="490" y="280" width="200" height="1" fill="rgba(34,197,94,0.3)" />
            <text x="590" y="296" textAnchor="middle" style={{ fontSize: '8.5px', fill: '#15803D', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: '0.2em' }}>ENG LANGUAGE</text>
            <text x="590" y="311" textAnchor="middle" style={{ fontSize: '10px', fill: '#14532D', fontFamily: "system-ui", fontStyle: 'italic' }}>{'“'}the system is fragile{'”'}</text>
          </motion.g>

          {/* ═══ Convergence band ═══ */}
          {stage >= 4 && (
            <>
              {/* Soft synthesis lane background */}
              <rect x="0" y="340" width="720" height="124" fill="rgba(79,70,229,0.04)" />
              <text x="360" y="358" textAnchor="middle" style={{ fontSize: '9px', fill: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.24em', fontWeight: 800 }}>THE PM SYNTHESISES</text>

              {/* Three converging arrows */}
              {CARDS.map((c, i) => (
                <motion.path key={i}
                  d={`M ${c.cx} 372 Q ${c.cx} 400 360 420`}
                  stroke={c.color} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="5 3" fill="none"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: i * 0.12 }}
                />
              ))}

              {/* Priya badge */}
              <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55, type: 'spring', stiffness: 280, damping: 22 }}>
                <circle cx="360" cy="420" r="26" fill="#FFF" stroke="#4F46E5" strokeWidth="2.5" filter="url(#m1-priya)" />
                <circle cx="360" cy="420" r="18" fill="#4F46E5" />
                <text x="360" y="426" textAnchor="middle" style={{ fontSize: '16px', fill: '#FFF', fontFamily: "Georgia, serif", fontWeight: 900 }}>P</text>
                <text x="360" y="460" textAnchor="middle" style={{ fontSize: '10px', fill: '#4F46E5', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: '0.2em' }}>PRIYA · PM</text>
              </motion.g>
            </>
          )}

          {/* ═══ Priya's PRD ═══ */}
          {stage >= 5 && (
            <motion.g initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Card */}
              <rect x="30" y="490" width="660" height="190" rx="12" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.5" filter="url(#m1-priya)" />
              <rect x="30" y="490" width="660" height="6" rx="3" fill="#4F46E5" />

              {/* Tab */}
              <rect x="46" y="508" width="100" height="20" rx="4" fill="#EEF2FF" />
              <text x="96" y="521" textAnchor="middle" style={{ fontSize: '9px', fill: '#4F46E5', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', fontWeight: 800 }}>PRIYA&apos;S PRD</text>
              <text x="156" y="523" style={{ fontSize: '10px', fill: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace" }}>· Sprint 15 · v0.1</text>

              {/* Title */}
              <text x="46" y="552" style={{ fontSize: '17px', fill: '#1F2937', fontFamily: "Georgia, serif", fontWeight: 800 }}>Decision · Ship the auth-cache (2-sprint refactor)</text>

              {/* Three callouts */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }}>
                {/* User */}
                <rect x="46" y="572" width="204" height="68" rx="8" fill="#EEF0FF" stroke="#C7D2FE" strokeWidth="0.8" />
                <rect x="46" y="572" width="3" height="68" rx="1" fill="#6366F1" />
                <text x="58" y="590" style={{ fontSize: '9px', fill: '#6366F1', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', fontWeight: 800 }}>USERS REPORT</text>
                <text x="58" y="608" style={{ fontSize: '10.5px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 600 }}>47 tickets / week</text>
                <text x="58" y="624" style={{ fontSize: '10.5px', fill: '#1F2937', fontFamily: "system-ui" }}>{'“'}keeps logging me out{'”'}</text>

                {/* Business */}
                <rect x="258" y="572" width="204" height="68" rx="8" fill="#FFF4E6" stroke="#FED7AA" strokeWidth="0.8" />
                <rect x="258" y="572" width="3" height="68" rx="1" fill="#F97316" />
                <text x="270" y="590" style={{ fontSize: '9px', fill: '#C2410C', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', fontWeight: 800 }}>BUSINESS IMPACT</text>
                <text x="270" y="608" style={{ fontSize: '10.5px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 600 }}>Retention −8.3pp WoW</text>
                <text x="270" y="624" style={{ fontSize: '10.5px', fill: '#1F2937', fontFamily: "system-ui" }}>at 32% · target 45%</text>

                {/* Eng */}
                <rect x="470" y="572" width="204" height="68" rx="8" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="0.8" />
                <rect x="470" y="572" width="3" height="68" rx="1" fill="#22C55E" />
                <text x="482" y="590" style={{ fontSize: '9px', fill: '#15803D', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', fontWeight: 800 }}>ENG ROOT CAUSE</text>
                <text x="482" y="608" style={{ fontSize: '10.5px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 600 }}>JWT mint per tab-switch</text>
                <text x="482" y="624" style={{ fontSize: '10.5px', fill: '#1F2937', fontFamily: "system-ui" }}>cache layer · 2 sprints</text>
              </motion.g>

              {/* Strap inside PRD */}
              {stage >= 6 && (
                <motion.text x="360" y="662" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                  style={{ fontSize: '10px', fill: '#4F46E5', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.22em', fontWeight: 800 }}>
                  ONE DECISION · CITES ALL THREE INPUTS
                </motion.text>
              )}
            </motion.g>
          )}
        </svg>
      </div>
      <InsightBox color="#4F46E5" label="PM = translator across three vocabularies. ">
        {' '}Users report a feeling (&ldquo;keeps logging me out&rdquo;). Business sees a number (&ldquo;retention −8.3pp&rdquo;). Engineering names a root cause (&ldquo;JWT mint per tab&rdquo;). The PM&apos;s job is to write the one sentence that makes all three lines true.
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

// ─── M09 · T1 · ONE TICKET, THREE LAYERS ─────────────────────────────────────
// A real Linear-style ticket sits at top: EDS-1402 "Add CSV export to weekly
// retention report". Three stacked layer cards show the diff that ONE ticket
// produces: a new React button (FE), a new API endpoint (BE), a new SQL query
// (DB). A vertical pulse line cascades through them. Teaches: knowing which
// layer your spec touches = knowing what work it costs.

export function RestaurantKitchenViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0);
    const ts = [1,2,3,4,5].map((s, i) => setTimeout(() => setStage(s), 400 + i * 750));
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.10)' }}>
        <svg viewBox="0 0 720 620" style={{ width: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="m9-page" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F7F4EC" /><stop offset="100%" stopColor="#EFEAD9" />
            </linearGradient>
            <linearGradient id="m9-feStripe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" /><stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="m9-beStripe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A855F7" /><stop offset="100%" stopColor="#7E22CE" />
            </linearGradient>
            <linearGradient id="m9-dbStripe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0EA5E9" /><stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <filter id="m9-soft"><feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="rgba(0,0,0,0.10)"/></filter>
            <filter id="m9-glow"><feGaussianBlur stdDeviation="3"/></filter>
          </defs>

          {/* Page */}
          <rect width="720" height="620" fill="url(#m9-page)" />

          {/* Linear-style top status bar */}
          <rect x="0" y="0" width="720" height="30" fill="#1E1B2E" />
          <circle cx="20" cy="15" r="4" fill="#22C55E" />
          <text x="32" y="19" style={{ fontSize: '11px', fill: '#FFF', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.08em' }}>Linear</text>
          <text x="76" y="19" style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>·</text>
          <text x="87" y="19" style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>EDS Engineering</text>
          <text x="710" y="19" textAnchor="end" style={{ fontSize: '10px', fill: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em' }}>SPRINT 14 · ACTIVE</text>

          {/* Caption */}
          <text x="360" y="56" textAnchor="middle" style={{ fontSize: '11px', fill: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.22em', fontWeight: 800 }}>ONE TICKET · THREE LAYERS OF WORK</text>

          {/* ═══════════ THE TICKET ═══════════ */}
          <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : -8 }} transition={{ duration: 0.5 }}>
            <rect x="30" y="72" width="660" height="74" rx="10" fill="#FFFFFF" stroke="#E0DBC9" strokeWidth="1" filter="url(#m9-soft)" />
            {/* Priority + ID */}
            <rect x="44" y="86" width="78" height="22" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="0.8" />
            <circle cx="54" cy="97" r="3.5" fill="#F59E0B" />
            <text x="63" y="101" style={{ fontSize: '10px', fill: '#92400E', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: '0.06em' }}>EDS-1402</text>
            {/* Title */}
            <text x="138" y="103" style={{ fontSize: '15px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 800 }}>Add CSV export to weekly retention report</text>
            {/* Description */}
            <text x="138" y="124" style={{ fontSize: '11px', fill: '#6B7280', fontFamily: "system-ui" }}>Sales managers want to share the retention table over email</text>
            {/* Status pill */}
            <rect x="556" y="86" width="92" height="22" rx="4" fill="#DBEAFE" />
            <circle cx="566" cy="97" r="3.5" fill="#3B82F6" />
            <text x="575" y="101" style={{ fontSize: '9.5px', fill: '#1E40AF', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: '0.08em' }}>IN PROGRESS</text>
            {/* Assignee */}
            <circle cx="664" cy="97" r="10" fill="#4F46E5" />
            <text x="664" y="100" textAnchor="middle" style={{ fontSize: '10px', fill: '#FFF', fontFamily: "system-ui", fontWeight: 900 }}>P</text>
            {/* Comments / branch row */}
            <text x="138" y="138" style={{ fontSize: '9px', fill: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace" }}>· 3 comments · feature/csv-export · est: ?</text>
          </motion.g>

          {/* ═══════════ CASCADE LINE (animated) ═══════════ */}
          {/* Vertical line connecting ticket through all 3 layers */}
          <line x1="100" y1="146" x2="100" y2="558" stroke="rgba(0,0,0,0.08)" strokeWidth="2" strokeDasharray="4 3" />
          {/* Animated pulse */}
          {stage >= 2 && (
            <motion.line x1="100" y1="146" x2="100" y2="558" stroke="#F59E0B" strokeWidth="3" strokeDasharray="4 3" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: stage >= 5 ? 1 : (stage - 1) * 0.34 }} transition={{ duration: 0.6, ease: 'easeOut' }} />
          )}
          {/* Joint dots at each layer */}
          {[200, 350, 500].map((y, i) => (
            <circle key={i} cx="100" cy={y} r="5" fill={stage >= i + 2 ? '#F59E0B' : '#E5E7EB'} stroke="#FFF" strokeWidth="1.5" />
          ))}

          {/* ═══════════ LAYER 1 · FRONTEND ═══════════ */}
          <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: stage >= 2 ? 1 : 0, x: stage >= 2 ? 0 : -8 }} transition={{ duration: 0.5 }}>
            <rect x="130" y="160" width="560" height="130" rx="10" fill="#FFFFFF" stroke="#E0DBC9" strokeWidth="1" filter="url(#m9-soft)" />
            {/* Layer stripe (left) */}
            <rect x="130" y="160" width="6" height="130" rx="3" fill="url(#m9-feStripe)" />
            {/* Layer header */}
            <rect x="146" y="174" width="22" height="22" rx="4" fill="#DBEAFE" />
            <text x="157" y="190" textAnchor="middle" style={{ fontSize: '13px', fill: '#1D4ED8', fontFamily: "system-ui", fontWeight: 900 }}>{'⟨/⟩'}</text>
            <text x="178" y="184" style={{ fontSize: '9px', fill: '#3B82F6', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', fontWeight: 800 }}>01 · FRONTEND</text>
            <text x="178" y="197" style={{ fontSize: '13px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 800 }}>React component</text>
            <text x="312" y="197" style={{ fontSize: '10px', fill: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace" }}>· src/components/RetentionReport.tsx</text>

            {/* UI mockup of EdSpark retention table */}
            <rect x="148" y="208" width="316" height="70" rx="4" fill="#FAFAFA" stroke="#E5E7EB" strokeWidth="0.6" />
            {/* Table header */}
            <rect x="148" y="208" width="316" height="14" fill="#F3F4F6" />
            <text x="156" y="218" style={{ fontSize: '8px', fill: '#6B7280', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.06em' }}>WEEK · COHORT · RETENTION</text>
            {/* Table rows */}
            {[0, 1, 2].map(i => (
              <g key={i}>
                <rect x="148" y={224 + i * 16} width="316" height="14" fill={i % 2 === 0 ? '#FFFFFF' : '#FAFAFA'} />
                <text x="156" y={234 + i * 16} style={{ fontSize: '9px', fill: '#374151', fontFamily: "system-ui" }}>{['W14', 'W13', 'W12'][i]}</text>
                <text x="220" y={234 + i * 16} style={{ fontSize: '9px', fill: '#374151', fontFamily: "system-ui" }}>{['Enterprise', 'Mid-market', 'SMB'][i]}</text>
                <text x="380" y={234 + i * 16} style={{ fontSize: '9px', fill: '#374151', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{['58%', '41%', '32%'][i]}</text>
              </g>
            ))}

            {/* Existing buttons */}
            <rect x="476" y="216" width="58" height="22" rx="4" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="0.6" />
            <text x="505" y="230" textAnchor="middle" style={{ fontSize: '10px', fill: '#374151', fontFamily: "system-ui", fontWeight: 600 }}>Filter</text>
            <rect x="540" y="216" width="58" height="22" rx="4" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="0.6" />
            <text x="569" y="230" textAnchor="middle" style={{ fontSize: '10px', fill: '#374151', fontFamily: "system-ui", fontWeight: 600 }}>Sort</text>

            {/* NEW button — highlighted */}
            <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: stage >= 2 ? 1 : 0, scale: 1 }} transition={{ delay: 0.4, duration: 0.4 }}>
              <rect x="476" y="246" width="122" height="24" rx="4" fill="#D1FAE5" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="488" y="261" style={{ fontSize: '11px', fill: '#15803D', fontFamily: "system-ui", fontWeight: 900 }}>+</text>
              <text x="498" y="261" style={{ fontSize: '10.5px', fill: '#15803D', fontFamily: "system-ui", fontWeight: 800 }}>Export CSV</text>
              <rect x="476" y="270" width="122" height="3" fill="#22C55E" opacity="0.6" />
            </motion.g>
            {/* "NEW" badge */}
            <rect x="606" y="248" width="38" height="14" rx="3" fill="#22C55E" />
            <text x="625" y="259" textAnchor="middle" style={{ fontSize: '8px', fill: '#FFF', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: '0.1em' }}>NEW</text>
          </motion.g>

          {/* ═══════════ LAYER 2 · BACKEND ═══════════ */}
          <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: stage >= 3 ? 1 : 0, x: stage >= 3 ? 0 : -8 }} transition={{ duration: 0.5 }}>
            <rect x="130" y="305" width="560" height="130" rx="10" fill="#FFFFFF" stroke="#E0DBC9" strokeWidth="1" filter="url(#m9-soft)" />
            <rect x="130" y="305" width="6" height="130" rx="3" fill="url(#m9-beStripe)" />
            <rect x="146" y="319" width="22" height="22" rx="4" fill="#F3E8FF" />
            <text x="157" y="335" textAnchor="middle" style={{ fontSize: '13px', fill: '#7E22CE', fontFamily: "system-ui", fontWeight: 900 }}>{'{ }'}</text>
            <text x="178" y="329" style={{ fontSize: '9px', fill: '#A855F7', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', fontWeight: 800 }}>02 · BACKEND</text>
            <text x="178" y="342" style={{ fontSize: '13px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 800 }}>API endpoint</text>
            <text x="278" y="342" style={{ fontSize: '10px', fill: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace" }}>· api/reports/export.ts</text>

            {/* Code editor */}
            <rect x="148" y="353" width="528" height="74" rx="4" fill="#0D1117" />
            {/* Line numbers */}
            {[1,2,3,4,5,6].map((n, i) => (
              <text key={n} x="158" y={368 + i * 10} style={{ fontSize: '9px', fill: '#6E7681', fontFamily: "'JetBrains Mono', monospace" }}>{n}</text>
            ))}
            {/* Code with + diff markers */}
            {[
              { mark: '+', text: 'router.post("/api/reports/export",', col: '#7EE787' },
              { mark: '+', text: '  async (req, res) => {',              col: '#7EE787' },
              { mark: '+', text: '    const rows = await db.retention', col: '#7EE787' },
              { mark: '+', text: '      .findMany({ orgId });',           col: '#7EE787' },
              { mark: '+', text: '    res.send(toCSV(rows));',            col: '#7EE787' },
              { mark: '+', text: '  });',                                  col: '#7EE787' },
            ].map((line, i) => (
              <g key={i}>
                <rect x="172" y={361 + i * 10} width="492" height="10" fill="rgba(126,231,135,0.08)" />
                <text x="178" y={368 + i * 10} style={{ fontSize: '9px', fill: line.col, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{line.mark}</text>
                <text x="190" y={368 + i * 10} style={{ fontSize: '9px', fill: '#E6EDF3', fontFamily: "'JetBrains Mono', monospace" }}>{line.text}</text>
              </g>
            ))}
            {/* "+6 lines" diff badge */}
            <rect x="624" y="319" width="56" height="20" rx="3" fill="#D1FAE5" stroke="#22C55E" strokeWidth="0.6" />
            <text x="652" y="332" textAnchor="middle" style={{ fontSize: '9px', fill: '#15803D', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>+6 lines</text>
          </motion.g>

          {/* ═══════════ LAYER 3 · DATABASE ═══════════ */}
          <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: stage >= 4 ? 1 : 0, x: stage >= 4 ? 0 : -8 }} transition={{ duration: 0.5 }}>
            <rect x="130" y="450" width="560" height="130" rx="10" fill="#FFFFFF" stroke="#E0DBC9" strokeWidth="1" filter="url(#m9-soft)" />
            <rect x="130" y="450" width="6" height="130" rx="3" fill="url(#m9-dbStripe)" />
            <rect x="146" y="464" width="22" height="22" rx="4" fill="#E0F2FE" />
            <rect x="151" y="468" width="12" height="3" rx="0.6" fill="#0369A1" />
            <rect x="151" y="473" width="12" height="3" rx="0.6" fill="#0369A1" opacity="0.6" />
            <rect x="151" y="478" width="12" height="3" rx="0.6" fill="#0369A1" opacity="0.3" />
            <text x="178" y="474" style={{ fontSize: '9px', fill: '#0EA5E9', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', fontWeight: 800 }}>03 · DATABASE</text>
            <text x="178" y="487" style={{ fontSize: '13px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 800 }}>SQL query</text>
            <text x="252" y="487" style={{ fontSize: '10px', fill: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace" }}>· retention_weekly table</text>

            {/* SQL snippet */}
            <rect x="148" y="498" width="280" height="68" rx="4" fill="#0D1117" />
            {[
              { text: 'SELECT week, cohort,', col: '#FFA657' },
              { text: '       retention_pct',  col: '#E6EDF3' },
              { text: 'FROM   retention_weekly', col: '#E6EDF3' },
              { text: 'WHERE  org_id = $1',     col: '#E6EDF3' },
              { text: 'ORDER BY week DESC;',     col: '#E6EDF3' },
            ].map((line, i) => (
              <text key={i} x="156" y={511 + i * 11} style={{ fontSize: '9px', fill: line.col, fontFamily: "'JetBrains Mono', monospace" }}>{line.text}</text>
            ))}
            {/* Schema mini-card */}
            <rect x="440" y="498" width="226" height="68" rx="4" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="0.8" />
            <text x="450" y="510" style={{ fontSize: '8px', fill: '#0369A1', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', fontWeight: 800 }}>retention_weekly</text>
            <line x1="450" y1="514" x2="656" y2="514" stroke="#BAE6FD" strokeWidth="0.6" />
            {[
              { col: 'org_id',         type: 'uuid'  },
              { col: 'week',           type: 'date'  },
              { col: 'cohort',         type: 'text'  },
              { col: 'retention_pct',  type: 'float' },
            ].map((row, i) => (
              <g key={i}>
                <text x="450" y={528 + i * 9} style={{ fontSize: '8.5px', fill: '#1F2937', fontFamily: "'JetBrains Mono', monospace" }}>{row.col}</text>
                <text x="640" y={528 + i * 9} textAnchor="end" style={{ fontSize: '8.5px', fill: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace" }}>{row.type}</text>
              </g>
            ))}
          </motion.g>

          {/* ═══════════ FINAL STRAP ═══════════ */}
          {stage >= 5 && (
            <motion.text x="360" y="600" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
              style={{ fontSize: '10px', fill: '#92400E', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.22em', fontWeight: 800 }}>
              ONE TICKET · THREE LAYERS · ALL MUST CHANGE
            </motion.text>
          )}
        </svg>
      </div>
      <InsightBox color="#A855F7" label="Every feature has three lives. ">
        {' '}A simple &ldquo;add CSV export&rdquo; touches the React component (the button), the API endpoint (the route + handler), and the database query (where the data lives). Knowing which layer your spec touches is how PMs estimate work that doesn&apos;t bleed into 3-week refactors.
      </InsightBox>
      <ReplayBtn onReplay={() => { setStage(0); setTick(t => t + 1); }} />
    </div>
  );
}

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

// ─── M05 · T1 · ONE SCREEN, FIVE STATES ──────────────────────────────────────
// A single EdSpark retention-dashboard mockup rendered five ways, side by side
// in a tabbed phone frame: Empty (Day 1 · no data yet), Loading (skeleton bars),
// Partial (2 rows + 'loading more'), Error (failed request + retry), Success
// (full table). Each state has its own micro-copy and what-broke note. Teaches:
// spec the Success State and you're 20% done. The other four are the experience
// most users actually live in.

const UI_STATES = [
  { id: 'empty',   label: 'EMPTY',   color: '#F59E0B', dark: '#9A3412', note: 'Day-1 experience before any data exists.', whoSpecs: 'Often nobody. Designer writes the copy at the last minute.', tab: 'Empty' },
  { id: 'loading', label: 'LOADING', color: '#6366F1', dark: '#3730A3', note: 'What the user sees during every fetch — the most-used state in the app.', whoSpecs: 'Engineer picks a spinner. PM rarely specs.', tab: 'Loading' },
  { id: 'partial', label: 'PARTIAL', color: '#0EA5E9', dark: '#0369A1', note: 'Some rows rendered while the rest stream in. Users expect to act on what is visible.', whoSpecs: 'Edge case the team finds in QA — or in production.', tab: 'Partial' },
  { id: 'error',   label: 'ERROR',   color: '#EF4444', dark: '#B91C1C', note: 'Request failed, network broke, server tripped. User gets the only message they see when things break.', whoSpecs: 'Engineer ships the default. Microcopy is the alert text.', tab: 'Error' },
  { id: 'success', label: 'SUCCESS', color: '#22C55E', dark: '#15803D', note: 'The state the PM speccs. Specced once, ships forever.', whoSpecs: 'The PM. With three rounds of review.', tab: 'Success' },
];

function PhoneStateMockup({ state }: { state: string }) {
  const headerRow = (
    <div style={{ background: '#1B2A47', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', fontWeight: 700 }}>EDSPARK</div>
        <div style={{ fontSize: '10px', color: '#FFF', fontFamily: 'system-ui', fontWeight: 700, marginTop: '1px' }}>Retention Report</div>
      </div>
      <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em' }}>SPRINT 14</div>
    </div>
  );

  // EMPTY · Day 1
  if (state === 'empty') return (
    <div style={{ flex: 1, background: '#FFF', display: 'flex', flexDirection: 'column' as const }}>
      {headerRow}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '24px 16px', textAlign: 'center' as const, background: 'linear-gradient(180deg, #FFF 0%, #FEF3C7 100%)' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', border: '2px dashed #F59E0B' }}>
          <span style={{ fontSize: '20px' }}>📭</span>
        </div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', marginBottom: '6px' }}>No retention data yet</div>
        <div style={{ fontSize: '9px', color: '#92400E', opacity: 0.7, lineHeight: 1.5, marginBottom: '14px' }}>Once your team has had its first week, your cohort retention will appear here.</div>
        <button style={{ padding: '7px 14px', borderRadius: '6px', background: '#F59E0B', color: '#FFF', fontSize: '9px', fontWeight: 800, border: 'none', fontFamily: 'system-ui', letterSpacing: '0.04em' }}>
          Invite your team →
        </button>
      </div>
    </div>
  );

  // LOADING · skeleton
  if (state === 'loading') return (
    <div style={{ flex: 1, background: '#FFF', display: 'flex', flexDirection: 'column' as const }}>
      {headerRow}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
          {[60, 80, 50].map((w, i) => <div key={i} style={{ height: '8px', width: `${w}px`, background: 'rgba(99,102,241,0.18)', borderRadius: '2px' }} />)}
        </div>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#E5E7EB' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: '4px' }}>
              <div style={{ height: '7px', width: '70%', background: '#E5E7EB', borderRadius: '2px' }} />
              <div style={{ height: '6px', width: '40%', background: '#F3F4F6', borderRadius: '2px' }} />
            </div>
            <div style={{ width: '32px', height: '10px', background: '#E5E7EB', borderRadius: '2px' }} />
          </div>
        ))}
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <div style={{ width: '12px', height: '12px', border: '2px solid #6366F1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <div style={{ fontSize: '8px', color: '#6366F1', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>FETCHING COHORTS…</div>
        </div>
      </div>
    </div>
  );

  // PARTIAL · 2 rows + still loading
  if (state === 'partial') return (
    <div style={{ flex: 1, background: '#FFF', display: 'flex', flexDirection: 'column' as const }}>
      {headerRow}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
        <div style={{ fontSize: '7px', color: '#6B7280', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>WEEK · COHORT · RETENTION</div>
        {[
          { w: 'W14', c: 'Enterprise', r: '58%' },
          { w: 'W13', c: 'Mid-market', r: '41%' },
        ].map((row, i) => (
          <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#1F2937' }}>{row.w} · {row.c}</div>
            </div>
            <div style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: '#0EA5E9' }}>{row.r}</div>
          </div>
        ))}
        {/* The "still loading" placeholders */}
        {[0,1].map(i => (
          <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ height: '8px', width: '110px', background: '#E5E7EB', borderRadius: '2px' }} />
            <div style={{ height: '8px', width: '28px', background: '#E5E7EB', borderRadius: '2px' }} />
          </div>
        ))}
        <div style={{ marginTop: '8px', padding: '6px 8px', background: 'rgba(14,165,233,0.07)', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', border: '1.5px solid #0EA5E9', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <div style={{ fontSize: '8px', color: '#0369A1', fontFamily: "'JetBrains Mono', monospace" }}>Loading 12 more cohorts…</div>
        </div>
      </div>
    </div>
  );

  // ERROR
  if (state === 'error') return (
    <div style={{ flex: 1, background: '#FFF', display: 'flex', flexDirection: 'column' as const }}>
      {headerRow}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '20px 16px', textAlign: 'center' as const, background: 'linear-gradient(180deg, #FFF 0%, #FEE2E2 100%)' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', border: '2px solid #EF4444' }}>
          <span style={{ fontSize: '22px' }}>⚠</span>
        </div>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#991B1B', marginBottom: '6px' }}>Couldn&apos;t load retention data</div>
        <div style={{ fontSize: '9px', color: '#7F1D1D', opacity: 0.85, lineHeight: 1.5, marginBottom: '4px' }}>Request to <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>/api/cohorts</span> timed out after 8s.</div>
        <div style={{ fontSize: '9px', color: '#7F1D1D', opacity: 0.7, lineHeight: 1.5, marginBottom: '14px' }}>Your data is safe — refresh to try again.</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button style={{ padding: '6px 14px', borderRadius: '6px', background: '#EF4444', color: '#FFF', fontSize: '9px', fontWeight: 800, border: 'none', fontFamily: 'system-ui' }}>
            Retry
          </button>
          <button style={{ padding: '6px 14px', borderRadius: '6px', background: 'transparent', color: '#991B1B', fontSize: '9px', fontWeight: 700, border: '1px solid #EF4444', fontFamily: 'system-ui' }}>
            Report
          </button>
        </div>
        <div style={{ marginTop: '12px', fontSize: '7px', color: '#7F1D1D', opacity: 0.5, fontFamily: "'JetBrains Mono', monospace" }}>error id · ERR-A47F2</div>
      </div>
    </div>
  );

  // SUCCESS · full table
  return (
    <div style={{ flex: 1, background: '#FFF', display: 'flex', flexDirection: 'column' as const }}>
      {headerRow}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '7px', color: '#6B7280', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', fontWeight: 700 }}>WEEK-2 RETENTION</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#1F2937', marginTop: '2px' }}>32% <span style={{ fontSize: '9px', color: '#DC2626', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>−8.3pp</span></div>
          </div>
          <div style={{ padding: '3px 7px', borderRadius: '3px', background: '#DCFCE7', fontSize: '8px', color: '#15803D', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: '0.08em' }}>LIVE</div>
        </div>
        <div style={{ fontSize: '7px', color: '#6B7280', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '4px' }}>WEEK · COHORT · RETENTION</div>
        {[
          { w: 'W14', c: 'Enterprise', r: '58%', col: '#15803D' },
          { w: 'W13', c: 'Mid-market', r: '41%', col: '#F59E0B' },
          { w: 'W12', c: 'SMB',        r: '32%', col: '#DC2626' },
          { w: 'W11', c: 'Enterprise', r: '61%', col: '#15803D' },
        ].map((row, i) => (
          <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#1F2937' }}>{row.w} · {row.c}</div>
            </div>
            <div style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: row.col }}>{row.r}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FiveStatesSolarSystem() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [active, setActive] = useState('success');
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!inView || !autoPlay) return;
    const id = setInterval(() => {
      setActive(prev => {
        const idx = UI_STATES.findIndex(s => s.id === prev);
        return UI_STATES[(idx + 1) % UI_STATES.length].id;
      });
    }, 2400);
    return () => clearInterval(id);
  }, [inView, autoPlay]);

  const current = UI_STATES.find(s => s.id === active)!;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.10)', background: 'linear-gradient(160deg, #F7F4EC 0%, #EFEAD9 100%)' }}>

        {/* Top status bar */}
        <div style={{ background: '#1E1B2E', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }} />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#FFF', fontWeight: 700, letterSpacing: '0.06em' }}>One screen · five states</div>
          <div style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em' }}>EDSPARK · RETENTION REPORT</div>
        </div>

        {/* Tab strip */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--ed-rule)', background: 'var(--ed-card)' }}>
          {UI_STATES.map(s => {
            const isActive = active === s.id;
            return (
              <button key={s.id} onClick={() => { setActive(s.id); setAutoPlay(false); }}
                style={{ flex: 1, padding: '12px 8px', background: isActive ? s.color : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '2px', borderBottom: isActive ? `3px solid ${s.dark}` : '3px solid transparent', transition: 'all 0.2s' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, letterSpacing: '0.16em', color: isActive ? '#FFF' : 'var(--ed-ink3)' }}>{s.label}</div>
                <div style={{ fontSize: '8px', color: isActive ? 'rgba(255,255,255,0.85)' : 'var(--ed-ink3)', fontFamily: 'system-ui' }}>state {UI_STATES.indexOf(s) + 1} of 5</div>
              </button>
            );
          })}
        </div>

        {/* Main split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', minHeight: '440px' }}>
          {/* LEFT: phone mockup */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 20px', background: 'rgba(0,0,0,0.04)' }}>
            <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              style={{ width: '260px', height: '380px', borderRadius: '28px', background: '#1F2937', padding: '8px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>
              {/* Notch */}
              <div style={{ height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '54px', height: '4px', borderRadius: '2px', background: '#0F172A' }} />
              </div>
              {/* Screen */}
              <div style={{ width: '100%', height: 'calc(100% - 14px)', borderRadius: '22px', overflow: 'hidden', background: '#FFF', display: 'flex', flexDirection: 'column' as const }}>
                <PhoneStateMockup state={active} />
              </div>
            </motion.div>
          </div>

          {/* RIGHT: info panel */}
          <div style={{ padding: '24px 22px', background: 'var(--ed-card)', borderLeft: '1px solid var(--ed-rule)', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }}>
            <motion.div key={active} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: current.color, letterSpacing: '0.2em', marginBottom: '8px' }}>{current.label} STATE</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ed-ink)', marginBottom: '14px', lineHeight: 1.4, fontFamily: 'Georgia, serif' }}>{current.note}</div>
              <div style={{ padding: '12px 14px', borderRadius: '8px', background: `${current.color}12`, borderLeft: `3px solid ${current.color}`, marginBottom: '14px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: current.dark, letterSpacing: '0.14em', marginBottom: '4px' }}>WHO SPECS IT</div>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.55 }}>{current.whoSpecs}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.1em' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: autoPlay ? '#22C55E' : '#9CA3AF' }} />
                {autoPlay ? 'AUTO-CYCLING · CLICK A TAB TO PAUSE' : 'PAUSED · CLICK TABS TO COMPARE'}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom strap */}
        <div style={{ background: '#1E1B2E', padding: '12px 20px', textAlign: 'center' as const, fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#F59E0B', letterSpacing: '0.22em', fontWeight: 800 }}>
          SPEC THE SUCCESS STATE · YOU&apos;RE 20% DONE
        </div>
      </div>
      <InsightBox color="#F59E0B" label="Every screen has 5 states. ">
        {' '}Spec the Success State and you&apos;re done with 20%. Empty, Loading, Partial and Error are used constantly — and specced almost never. They are the experience users actually live in between every successful render.
      </InsightBox>
      <button onClick={() => setAutoPlay(true)} style={{ marginTop: '16px', padding: '7px 22px', borderRadius: '10px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--ed-rule)', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>
        ↺ replay auto-cycle
      </button>
    </div>
  );
}

// ─── M06 · T1 · ONE TRUTH · FOUR TRANSLATIONS ────────────────────────────────
// The same fact ("Search is shipping Friday") rendered in the four native
// surfaces each audience actually lives in: a Jira ticket for Engineering,
// a Figma comment thread for Design, a one-slide executive deck for
// Leadership, a release-note email for Sales/CS. Each card lives in its
// real tool chrome so a learner recognises the surface before reading.
// Teaches: same data, four formats — sending all four the same message
// serves none of them.

export function SignalPrism() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0);
    const ts = [1,2,3,4,5,6].map((s, i) => setTimeout(() => setStage(s), 350 + i * 650));
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.10)' }}>
        <svg viewBox="0 0 720 680" style={{ width: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="sp-page" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F7F4EC" /><stop offset="100%" stopColor="#EFEAD9" />
            </linearGradient>
            <filter id="sp-soft"><feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="rgba(0,0,0,0.10)"/></filter>
          </defs>

          <rect width="720" height="680" fill="url(#sp-page)" />

          {/* === PRODUCT TRUTH banner (the single source fact) === */}
          {stage >= 1 && (
            <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <rect x="180" y="20" width="360" height="58" rx="10" fill="#1F2937" filter="url(#sp-soft)" />
              <text x="360" y="40" textAnchor="middle" style={{ fontSize: '8.5px', fill: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.24em', fontWeight: 800 }}>THE PRODUCT TRUTH</text>
              <text x="360" y="62" textAnchor="middle" style={{ fontSize: '14px', fill: '#FFF', fontFamily: "Georgia, serif", fontWeight: 800 }}>{'“'}Search ships Friday{'”'}</text>
              {/* Down arrow */}
              <line x1="360" y1="86" x2="360" y2="104" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="3 3" />
              <polygon points="354,102 366,102 360,112" fill="#9CA3AF" />
            </motion.g>
          )}

          {/* === FOUR AUDIENCE CARDS — 2×2 grid === */}

          {/* ─ Top-left · JIRA · Engineering ─ */}
          {stage >= 2 && (
            <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Card */}
              <rect x="20" y="130" width="338" height="240" rx="10" fill="#FFFFFF" stroke="#E0DBC9" strokeWidth="1" filter="url(#sp-soft)" />
              {/* Jira header */}
              <path d="M 20 140 Q 20 130 30 130 L 348 130 Q 358 130 358 140 L 358 162 L 20 162 Z" fill="#172B4D" />
              <rect x="32" y="142" width="10" height="10" rx="1" fill="#2684FF" />
              <rect x="34" y="139" width="6" height="16" fill="#2684FF" />
              <text x="50" y="152" style={{ fontSize: '11px', fill: '#FFF', fontFamily: "system-ui", fontWeight: 800 }}>Jira</text>
              <text x="79" y="152" style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.5)', fontFamily: "system-ui" }}>·</text>
              <text x="91" y="152" style={{ fontSize: '10.5px', fill: 'rgba(255,255,255,0.85)', fontFamily: "system-ui" }}>EDS Engineering · Sprint 14</text>
              {/* Audience label tab */}
              <rect x="280" y="138" width="68" height="18" rx="3" fill="#3A86FF" />
              <text x="314" y="151" textAnchor="middle" style={{ fontSize: '8.5px', fill: '#FFF', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.16em', fontWeight: 800 }}>ENG</text>

              {/* Ticket ID + priority pill */}
              <rect x="34" y="178" width="70" height="20" rx="3" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="0.6" />
              <circle cx="44" cy="188" r="3" fill="#F59E0B" />
              <text x="52" y="192" style={{ fontSize: '10px', fill: '#92400E', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>EDS-1402</text>
              {/* Status */}
              <rect x="110" y="178" width="84" height="20" rx="3" fill="#DBEAFE" />
              <text x="152" y="192" textAnchor="middle" style={{ fontSize: '9px', fill: '#1E40AF', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', fontWeight: 800 }}>IN PROGRESS</text>
              {/* Assignee */}
              <circle cx="320" cy="188" r="9" fill="#3A86FF" />
              <text x="320" y="191" textAnchor="middle" style={{ fontSize: '9px', fill: '#FFF', fontFamily: "system-ui", fontWeight: 900 }}>K</text>
              {/* Title */}
              <text x="34" y="220" style={{ fontSize: '13px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 800 }}>Full-text search across retention table</text>
              {/* AC bullets */}
              {[
                { l: '— Postgres GIN index on retention_weekly.notes' },
                { l: '— /api/search endpoint · p95 < 300ms' },
                { l: '— React <SearchBox/> · debounced 250ms' },
                { l: '— Tests: ≥ 95% coverage on new code' },
              ].map((b, i) => (
                <text key={i} x="34" y={244 + i * 16} style={{ fontSize: '10px', fill: '#374151', fontFamily: "system-ui" }}>{b.l}</text>
              ))}
              {/* Bottom row: branch + points + labels */}
              <rect x="34" y="334" width="120" height="20" rx="3" fill="#F3F4F6" />
              <text x="42" y="348" style={{ fontSize: '9px', fill: '#7C3AED', fontFamily: "'JetBrains Mono', monospace" }}>feature/search-v1</text>
              <rect x="162" y="334" width="36" height="20" rx="3" fill="#E0F2FE" />
              <text x="180" y="348" textAnchor="middle" style={{ fontSize: '9.5px', fill: '#0369A1', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>5 pts</text>
              <rect x="206" y="334" width="142" height="20" rx="3" fill="#F3F4F6" />
              <text x="277" y="348" textAnchor="middle" style={{ fontSize: '9px', fill: '#374151', fontFamily: "system-ui" }}>frontend · backend · db</text>
            </motion.g>
          )}

          {/* ─ Top-right · FIGMA · Design ─ */}
          {stage >= 3 && (
            <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <rect x="362" y="130" width="338" height="240" rx="10" fill="#FFFFFF" stroke="#E0DBC9" strokeWidth="1" filter="url(#sp-soft)" />
              {/* Figma header */}
              <path d="M 362 140 Q 362 130 372 130 L 690 130 Q 700 130 700 140 L 700 162 L 362 162 Z" fill="#1E1E1E" />
              {/* Figma F logo */}
              <g transform="translate(374 138)">
                <rect width="6" height="6" fill="#F24E1E" />
                <rect y="6" width="6" height="6" fill="#FF7262" />
                <rect y="12" width="6" height="6" fill="#A259FF" />
                <rect x="6" y="6" width="6" height="6" fill="#1ABCFE" />
                <rect x="6" width="6" height="6" fill="#0ACF83" />
              </g>
              <text x="388" y="152" style={{ fontSize: '11px', fill: '#FFF', fontFamily: "system-ui", fontWeight: 800 }}>Figma</text>
              <text x="423" y="152" style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.5)', fontFamily: "system-ui" }}>·</text>
              <text x="435" y="152" style={{ fontSize: '10.5px', fill: 'rgba(255,255,255,0.85)', fontFamily: "system-ui" }}>EdSpark · Retention/Search v3</text>
              <rect x="618" y="138" width="76" height="18" rx="3" fill="#E07A5F" />
              <text x="656" y="151" textAnchor="middle" style={{ fontSize: '8.5px', fill: '#FFF', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.16em', fontWeight: 800 }}>DESIGN</text>

              {/* Frame canvas with mockup */}
              <rect x="376" y="176" width="220" height="182" rx="4" fill="#FAFAFA" stroke="#D1D5DB" strokeWidth="0.6" />
              <text x="382" y="190" style={{ fontSize: '7.5px', fill: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em' }}>RetentionTable · 1440</text>
              {/* Search input row (the new component) */}
              <rect x="384" y="198" width="204" height="20" rx="3" fill="#FFFFFF" stroke="#A78BFA" strokeWidth="1.6" strokeDasharray="3 2" />
              <circle cx="394" cy="208" r="3.5" fill="none" stroke="#9CA3AF" strokeWidth="1" />
              <line x1="397" y1="211" x2="400" y2="214" stroke="#9CA3AF" strokeWidth="1" />
              <text x="404" y="212" style={{ fontSize: '8.5px', fill: '#9CA3AF', fontFamily: "system-ui", fontStyle: 'italic' }}>Search retention notes…</text>
              {/* Comment pin */}
              <circle cx="588" cy="208" r="9" fill="#E07A5F" stroke="#FFF" strokeWidth="1.4" filter="url(#sp-soft)" />
              <text x="588" y="211" textAnchor="middle" style={{ fontSize: '9px', fill: '#FFF', fontFamily: "system-ui", fontWeight: 900 }}>P</text>
              {/* Table rows below */}
              {[0,1,2,3].map(i => (
                <g key={i}>
                  <rect x="384" y={228 + i * 14} width="204" height="12" fill={i % 2 === 0 ? '#FFFFFF' : '#F9FAFB'} stroke="#E5E7EB" strokeWidth="0.4" />
                  <rect x="388" y={232 + i * 14} width="40" height="4" rx="1" fill="#D1D5DB" />
                  <rect x="436" y={232 + i * 14} width="60" height="4" rx="1" fill="#D1D5DB" />
                  <rect x="510" y={232 + i * 14} width="74" height="4" rx="1" fill="#D1D5DB" />
                </g>
              ))}

              {/* Comment thread under the frame */}
              <rect x="608" y="180" width="86" height="174" rx="4" fill="#FAFAFA" stroke="#E5E7EB" strokeWidth="0.6" />
              <text x="616" y="192" style={{ fontSize: '7px', fill: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', fontWeight: 700 }}>2 COMMENTS</text>
              <circle cx="616" cy="206" r="5" fill="#E07A5F" />
              <text x="616" y="209" textAnchor="middle" style={{ fontSize: '6px', fill: '#FFF', fontFamily: "system-ui", fontWeight: 900 }}>P</text>
              <text x="626" y="208" style={{ fontSize: '8px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 700 }}>Priya</text>
              <text x="616" y="220" style={{ fontSize: '7.5px', fill: '#4B5563', fontFamily: "system-ui" }}>Use the same input</text>
              <text x="616" y="230" style={{ fontSize: '7.5px', fill: '#4B5563', fontFamily: "system-ui" }}>component as the global</text>
              <text x="616" y="240" style={{ fontSize: '7.5px', fill: '#4B5563', fontFamily: "system-ui" }}>nav search? consistency</text>
              <circle cx="616" cy="260" r="5" fill="#C85A40" />
              <text x="616" y="263" textAnchor="middle" style={{ fontSize: '6px', fill: '#FFF', fontFamily: "system-ui", fontWeight: 900 }}>M</text>
              <text x="626" y="262" style={{ fontSize: '8px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 700 }}>Maya</text>
              <text x="616" y="274" style={{ fontSize: '7.5px', fill: '#4B5563', fontFamily: "system-ui" }}>Yes — already in the</text>
              <text x="616" y="284" style={{ fontSize: '7.5px', fill: '#4B5563', fontFamily: "system-ui" }}>system. Token: input/sm</text>
              <text x="616" y="298" style={{ fontSize: '7px', fill: '#9CA3AF', fontFamily: "system-ui", fontStyle: 'italic' }}>Resolved by Maya</text>
            </motion.g>
          )}

          {/* ─ Bottom-left · 1-SLIDE · Leadership ─ */}
          {stage >= 4 && (
            <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <rect x="20" y="382" width="338" height="240" rx="10" fill="#FFFFFF" stroke="#E0DBC9" strokeWidth="1" filter="url(#sp-soft)" />
              {/* Slide header bar */}
              <path d="M 20 392 Q 20 382 30 382 L 348 382 Q 358 382 358 392 L 358 414 L 20 414 Z" fill="#F8F5F0" stroke="#E5E7EB" strokeWidth="0.6" />
              <rect x="32" y="394" width="14" height="14" rx="2" fill="#7843EE" />
              <text x="36" y="405" style={{ fontSize: '9px', fill: '#FFF', fontFamily: "Georgia, serif", fontWeight: 900 }}>E</text>
              <text x="54" y="404" style={{ fontSize: '10px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 800 }}>EdSpark · Board update · Q3</text>
              <rect x="280" y="390" width="68" height="18" rx="3" fill="#7843EE" />
              <text x="314" y="403" textAnchor="middle" style={{ fontSize: '8.5px', fill: '#FFF', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.16em', fontWeight: 800 }}>LEADER</text>

              {/* Slide content */}
              <text x="34" y="440" style={{ fontSize: '8.5px', fill: '#7843EE', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', fontWeight: 800 }}>SLIDE 7 OF 12 · SEARCH</text>
              <text x="34" y="464" style={{ fontSize: '15px', fill: '#1F2937', fontFamily: "Georgia, serif", fontWeight: 800 }}>Search ships Friday →</text>
              <text x="34" y="482" style={{ fontSize: '15px', fill: '#1F2937', fontFamily: "Georgia, serif", fontWeight: 800 }}>unblocks self-serve scale</text>
              {/* 3 outcome bullets */}
              {[
                { l: '+ Cuts support tickets ~30% (modelled)' },
                { l: '+ Unblocks $2.4M enterprise pipeline' },
                { l: '+ Closes parity gap vs Gong' },
              ].map((b, i) => (
                <text key={i} x="34" y={508 + i * 18} style={{ fontSize: '11px', fill: '#374151', fontFamily: "system-ui", fontWeight: 500 }}>{b.l}</text>
              ))}
              {/* Tradeoff line */}
              <rect x="34" y="572" width="314" height="38" rx="4" fill="#FEF3E2" stroke="#F59E0B" strokeWidth="0.6" />
              <rect x="34" y="572" width="3" height="38" fill="#F59E0B" />
              <text x="46" y="586" style={{ fontSize: '8px', fill: '#92400E', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', fontWeight: 800 }}>TRADEOFF</text>
              <text x="46" y="602" style={{ fontSize: '10px', fill: '#1F2937', fontFamily: "system-ui" }}>Mobile parity slips by 1 sprint</text>
            </motion.g>
          )}

          {/* ─ Bottom-right · RELEASE NOTE · Sales/CS ─ */}
          {stage >= 5 && (
            <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <rect x="362" y="382" width="338" height="240" rx="10" fill="#FFFFFF" stroke="#E0DBC9" strokeWidth="1" filter="url(#sp-soft)" />
              {/* Newsletter header */}
              <path d="M 362 392 Q 362 382 372 382 L 690 382 Q 700 382 700 392 L 700 414 L 362 414 Z" fill="#059669" />
              <text x="374" y="404" style={{ fontSize: '11px', fill: '#FFF', fontFamily: "system-ui", fontWeight: 800 }}>EdSpark · What&apos;s New</text>
              <text x="496" y="404" style={{ fontSize: '10px', fill: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>· Sprint 14</text>
              <rect x="618" y="390" width="76" height="18" rx="3" fill="#FFF" opacity="0.95" />
              <text x="656" y="403" textAnchor="middle" style={{ fontSize: '8.5px', fill: '#059669', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.16em', fontWeight: 800 }}>SALES/CS</text>

              {/* Hero headline */}
              <text x="378" y="442" style={{ fontSize: '8.5px', fill: '#059669', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', fontWeight: 800 }}>NEW · FRIDAY</text>
              <text x="378" y="466" style={{ fontSize: '17px', fill: '#1F2937', fontFamily: "Georgia, serif", fontWeight: 800 }}>Find anything, fast.</text>
              <text x="378" y="486" style={{ fontSize: '10.5px', fill: '#6B7280', fontFamily: "system-ui" }}>Search every retention note in milliseconds.</text>

              {/* Hero illustration */}
              <rect x="378" y="498" width="304" height="60" rx="6" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="0.8" />
              <rect x="390" y="514" width="240" height="28" rx="14" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.8" />
              <circle cx="406" cy="528" r="4.5" fill="none" stroke="#9CA3AF" strokeWidth="1.4" />
              <line x1="410" y1="532" x2="414" y2="536" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" />
              <text x="420" y="532" style={{ fontSize: '10px', fill: '#374151', fontFamily: "system-ui" }}>onboarding drop-off</text>
              <rect x="538" y="520" width="88" height="16" rx="3" fill="#059669" />
              <text x="582" y="531" textAnchor="middle" style={{ fontSize: '9px', fill: '#FFF', fontFamily: "system-ui", fontWeight: 800 }}>Search</text>

              {/* Customer-facing bullets */}
              {[
                { l: '✓ Search by keyword across all retention data' },
                { l: '✓ 3× faster than the old filter view' },
                { l: '✓ Available to all paid customers on Friday' },
              ].map((b, i) => (
                <text key={i} x="378" y={578 + i * 14} style={{ fontSize: '10px', fill: '#374151', fontFamily: "system-ui" }}>{b.l}</text>
              ))}
            </motion.g>
          )}

          {/* Bottom strap */}
          {stage >= 6 && (
            <motion.text x="360" y="652" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
              style={{ fontSize: '11px', fill: '#7843EE', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.22em', fontWeight: 800 }}>
              ONE FACT · FOUR FORMATS · EACH AUDIENCE IN ITS NATIVE TOOL
            </motion.text>
          )}
        </svg>
      </div>
      <InsightBox color="#7843EE" label="Same truth, four formats. ">
        {' '}Engineering needs the contract — story points, acceptance criteria, branch. Design needs the screen — frame, comment thread, component token. Leadership needs the outcome — one headline, three bullets, one tradeoff. Sales needs the talk track — what to promise, when, to whom. Send all four the same message and you serve none of them.
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

// ─── M08 · T1 · PHASED ROLLOUT TIMELINE ──────────────────────────────────────
// Linear-style horizontal launch board for EdSpark Team Workspace v1. Five
// phase cards left→right show number, name, week, blast-radius visualisation
// (visibly different per phase), audience count, goal, exit-gate criteria
// and status pill. Vertical dashed dividers between phases each carry a "→"
// chevron — visual proof that each gate opens the next. Teaches: launch in
// phases of increasing blast radius; gates aren't optional.

const LR_PHASES = [
  { n: '01', name: 'Internal Alpha',     week: 'WEEK 0',   color: '#94A3B8', dark: '#475569', bg: 'rgba(148,163,184,0.10)', count: '5 USERS',       audience: 'EdSpark team only',     goal: 'Workflow holds together', exitText: '0 P1 bugs · 24h burn-in', status: 'DONE ✓',     statusBg: '#22C55E' },
  { n: '02', name: 'Design Partners',    week: 'WEEK 1-2', color: '#6366F1', dark: '#3730A3', bg: 'rgba(99,102,241,0.10)',  count: '3 ACCOUNTS',    audience: 'Close design partners', goal: 'Real workflows survive', exitText: '80%+ task completion',    status: 'DONE ✓',     statusBg: '#22C55E' },
  { n: '03', name: 'Paid Beta',          week: 'WEEK 3-4', color: '#F97316', dark: '#9A3412', bg: 'rgba(249,115,22,0.10)',  count: '15 ACCOUNTS',   audience: 'Pricing cohort',        goal: 'Willingness to pay',     exitText: '< 2% week-1 churn',       status: 'ACTIVE',    statusBg: '#F97316' },
  { n: '04', name: 'Controlled',         week: 'WEEK 5-6', color: '#3B82F6', dark: '#1E40AF', bg: 'rgba(59,130,246,0.10)',  count: '~200 ACCOUNTS', audience: 'Tier-1 segment only',   goal: 'Ops scale holds',        exitText: 'Support load stable',     status: 'NEXT',      statusBg: '#6366F1' },
  { n: '05', name: 'GA',                 week: 'WEEK 7+',  color: '#22C55E', dark: '#15803D', bg: 'rgba(34,197,94,0.10)',   count: '1,800 ACCOUNTS', audience: 'All EdSpark customers', goal: 'Live to entire base',    exitText: 'Live',                    status: 'LATER',     statusBg: '#94A3B8' },
];

function BlastViz({ phase, color, dark, cx, cy }: { phase: string; color: string; dark: string; cx: number; cy: number }) {
  if (phase === '01') {
    return (
      <g>
        {[{dx:-16,dy:-8},{dx:0,dy:-12},{dx:16,dy:-8},{dx:-8,dy:6},{dx:8,dy:6}].map((p, i) => (
          <g key={i}>
            <circle cx={cx+p.dx} cy={cy+p.dy} r="6" fill={color} stroke="#FFF" strokeWidth="1.4" />
            <circle cx={cx+p.dx-1.5} cy={cy+p.dy-1.5} r="1.6" fill="rgba(255,255,255,0.55)" />
          </g>
        ))}
      </g>
    );
  }
  if (phase === '02') {
    return (
      <g>
        {[-30, 0, 30].map((dx, i) => (
          <g key={i} transform={`translate(${cx+dx}, ${cy})`}>
            <rect x="-9" y="-14" width="18" height="22" fill={color} />
            <polygon points="-10,-14 0,-22 10,-14" fill={dark} />
            {[-4, 0, 4].map(wx => <rect key={wx} x={wx-1.5} y="-7" width="3" height="3" fill="rgba(255,255,255,0.65)" />)}
            {[-4, 0, 4].map(wx => <rect key={`b${wx}`} x={wx-1.5} y="0" width="3" height="3" fill="rgba(255,255,255,0.45)" />)}
          </g>
        ))}
      </g>
    );
  }
  if (phase === '03') {
    return (
      <g>
        {Array.from({ length: 16 }).map((_, idx) => {
          const r = Math.floor(idx / 4), c = idx % 4;
          const filled = idx < 15;
          return <circle key={idx} cx={cx - 22 + c * 14} cy={cy - 22 + r * 14} r="4" fill={filled ? color : '#E5E7EB'} stroke={filled ? '#FFF' : 'none'} strokeWidth="0.8" />;
        })}
      </g>
    );
  }
  if (phase === '04') {
    return (
      <g>
        {Array.from({ length: 42 }).map((_, idx) => {
          const r = Math.floor(idx / 7), c = idx % 7;
          const tier1 = r < 3 || (r === 3 && c < 4);
          return <circle key={idx} cx={cx - 30 + c * 10} cy={cy - 24 + r * 9} r="2.6" fill={tier1 ? color : 'rgba(0,0,0,0.12)'} />;
        })}
      </g>
    );
  }
  // phase 05
  return (
    <g>
      {Array.from({ length: 70 }).map((_, idx) => {
        const r = Math.floor(idx / 10), c = idx % 10;
        return <circle key={idx} cx={cx - 41 + c * 9} cy={cy - 27 + r * 8} r="2.4" fill={color} opacity={0.6 + Math.sin(idx * 0.9) * 0.3} />;
      })}
    </g>
  );
}

export function LaunchRunwayViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0);
    const ts = [1,2,3,4,5,6].map((s, i) => setTimeout(() => setStage(s), 300 + i * 600));
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.10)' }}>
        <svg viewBox="0 0 720 480" style={{ width: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="lr-page" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F7F4EC" /><stop offset="100%" stopColor="#EFEAD9" />
            </linearGradient>
            <filter id="lr-soft"><feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="rgba(0,0,0,0.10)"/></filter>
            <filter id="lr-active"><feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="rgba(249,115,22,0.30)"/></filter>
          </defs>

          <rect width="720" height="480" fill="url(#lr-page)" />

          {/* Status bar */}
          <rect x="0" y="0" width="720" height="32" fill="#1E1B2E" />
          <circle cx="20" cy="16" r="4" fill="#22C55E" />
          <text x="32" y="20" style={{ fontSize: '11px', fill: '#FFF', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.06em' }}>Linear</text>
          <text x="76" y="20" style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>·</text>
          <text x="87" y="20" style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.78)', fontFamily: "'JetBrains Mono', monospace" }}>EdSpark Launch · Team Workspace v1</text>
          <text x="710" y="20" textAnchor="end" style={{ fontSize: '10px', fill: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em' }}>WEEK 3 · MON</text>

          {/* Caption */}
          <text x="360" y="56" textAnchor="middle" style={{ fontSize: '11px', fill: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.22em', fontWeight: 800 }}>PHASED ROLLOUT · EACH GATE OPENS THE NEXT</text>

          {/* Phase columns: 16 margin · 5 × 120 width · 4 × 22 gates */}
          {LR_PHASES.map((p, i) => {
            const x = 16 + i * 142;
            const show = stage >= i + 1;
            const isActive = p.status === 'ACTIVE';
            return (
              <motion.g key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }} transition={{ duration: 0.45 }}>
                {/* Card */}
                <rect x={x} y="78" width="120" height="340" rx="10" fill="#FFFFFF" stroke={isActive ? p.color : '#E0DBC9'} strokeWidth={isActive ? 1.5 : 1} filter={isActive ? 'url(#lr-active)' : 'url(#lr-soft)'} />
                {/* Color band top */}
                <path d={`M ${x+10} 78 L ${x+110} 78 Q ${x+120} 78 ${x+120} 88 L ${x+120} 108 L ${x} 108 L ${x} 88 Q ${x} 78 ${x+10} 78 Z`} fill={p.color} />
                <text x={x+60} y={97} textAnchor="middle" style={{ fontSize: '11px', fill: '#FFF', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', fontWeight: 900 }}>{`PHASE ${p.n}`}</text>

                {/* Name + week */}
                <text x={x+60} y={128} textAnchor="middle" style={{ fontSize: '12px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 800 }}>{p.name}</text>
                <text x={x+60} y={144} textAnchor="middle" style={{ fontSize: '8.5px', fill: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.16em', fontWeight: 700 }}>{p.week}</text>

                {/* Blast radius visualisation (varies per phase) */}
                <BlastViz phase={p.n} color={p.color} dark={p.dark} cx={x + 60} cy={195} />

                {/* Count + audience */}
                <text x={x+60} y={258} textAnchor="middle" style={{ fontSize: '10.5px', fill: p.dark, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', fontWeight: 800 }}>{p.count}</text>
                <text x={x+60} y={272} textAnchor="middle" style={{ fontSize: '8.5px', fill: '#6B7280', fontFamily: "system-ui" }}>{p.audience}</text>

                {/* Goal */}
                <text x={x+60} y={295} textAnchor="middle" style={{ fontSize: '8.5px', fill: '#9CA3AF', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.16em', fontWeight: 700 }}>GOAL</text>
                <text x={x+60} y={309} textAnchor="middle" style={{ fontSize: '9.5px', fill: '#374151', fontFamily: "system-ui" }}>{p.goal}</text>

                {/* Exit-gate criteria card */}
                <rect x={x+8} y={325} width="104" height="50" rx="6" fill={p.bg} stroke={p.color} strokeWidth="0.8" strokeDasharray="3 2" />
                <text x={x+60} y={342} textAnchor="middle" style={{ fontSize: '8.5px', fill: p.dark, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', fontWeight: 800 }}>EXIT GATE</text>
                <text x={x+60} y={359} textAnchor="middle" style={{ fontSize: '9.5px', fill: '#1F2937', fontFamily: "system-ui", fontWeight: 600 }}>{p.exitText}</text>

                {/* Status pill */}
                <rect x={x+34} y={388} width="52" height="20" rx="10" fill={p.statusBg} />
                <text x={x+60} y={401} textAnchor="middle" style={{ fontSize: '9px', fill: '#FFF', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.16em', fontWeight: 800 }}>{p.status}</text>
              </motion.g>
            );
          })}

          {/* Gate dividers between phases */}
          {[0,1,2,3].map(i => {
            const gx = 147 + i * 142;
            const show = stage >= i + 2; // gate fills after phase i+1 reveals
            const passed = i < 2;        // phases 1 and 2 are done
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: 0.35 }}>
                <line x1={gx} y1="86" x2={gx} y2="418" stroke="rgba(0,0,0,0.18)" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx={gx} cy="240" r="13" fill="#FFFFFF" stroke={passed ? '#22C55E' : '#D1D5DB'} strokeWidth="1.4" filter="url(#lr-soft)" />
                {passed ? (
                  <path d={`M ${gx-5} 240 L ${gx-1} 244 L ${gx+5} 236`} stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                ) : (
                  <text x={gx} y={244} textAnchor="middle" style={{ fontSize: '12px', fill: '#9CA3AF', fontFamily: "system-ui", fontWeight: 900 }}>→</text>
                )}
              </motion.g>
            );
          })}

          {/* Bottom strap */}
          {stage >= 6 && (
            <motion.text x="360" y="452" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
              style={{ fontSize: '10px', fill: '#15803D', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.22em', fontWeight: 800 }}>
              BLAST RADIUS GROWS · NEVER SKIP A GATE
            </motion.text>
          )}
        </svg>
      </div>
      <InsightBox color="#22C55E" label="Launch in phases, not in jumps. ">
        {' '}You don&apos;t go from &ldquo;not live&rdquo; to &ldquo;all 1,800 accounts&rdquo; in one step. Each phase has a specific blast radius and an exit-gate criterion that must clear before the next opens. Skipping a gate doesn&apos;t buy speed — it buys blast radius.
      </InsightBox>
      <ReplayBtn onReplay={() => { setStage(0); setTick(t => t + 1); }} />
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

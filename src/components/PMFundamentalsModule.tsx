'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import Track1NewPM from './pm-fundamentals/Track1NewPM';
import Track2APM from './pm-fundamentals/Track2APM';
import type { Track } from './pm-fundamentals/designSystem';

// Roman numeral helper
const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const toRoman = (n: number) => ROMAN[n - 1] ?? String(n);

// ─────────────────────────────────────────
// TRACK CONFIG
// ─────────────────────────────────────────
const TRACK_CONFIG: Record<Track, {
  accent: string; accentRgb: string; label: string; emoji: string; time: string;
  sections: { id: string; label: string }[];
  concepts: { id: string; label: string; color: string }[];
}> = {
  'new-pm': {
    accent: '#4F46E5', accentRgb: '79,70,229',
    label: 'New PM Foundations', emoji: '🌱', time: '30 min · 7 parts',
    sections: [
      { id: 'part1-what-is-pm',    label: 'What is a PM' },
      { id: 'part2-first-mistake', label: 'The First Mistake' },
      { id: 'part3-teams',         label: 'Working with Teams' },
      { id: 'part4-decisions',     label: 'Making Decisions' },
      { id: 'part5-building',      label: 'Building & Alignment' },
      { id: 'part6-measuring',     label: 'Measuring Outcomes' },
      { id: 'final-reflection',    label: 'Final Reflection' },
    ],
    concepts: [
      { id: 'pm-role',            label: 'PM Role',           color: '#4F46E5' },
      { id: 'problem-definition', label: 'Problem Definition',color: '#0097A7' },
      { id: 'strategy',           label: 'Strategy',          color: '#3A86FF' },
      { id: 'prioritization',     label: 'Prioritization',    color: '#C85A40' },
      { id: 'collaboration',      label: 'Collaboration',     color: '#0D7A5A' },
      { id: 'north-star',         label: 'North Star',        color: '#7843EE' },
    ],
  },
  'apm': {
    accent: '#7843EE', accentRgb: '120,67,238',
    label: 'APM Advanced', emoji: '⚡', time: '30 min · 12 concepts',
    sections: [
      { id: 'm1-pm-role',          label: 'The PM Role' },
      { id: 'm1-product-triangle', label: 'Product Triangle' },
      { id: 'm2-problem-solution', label: 'Problem vs Solution' },
      { id: 'm2-research',         label: 'Research Methods' },
      { id: 'm3-strategy',         label: 'What is Strategy' },
      { id: 'm3-pmf',              label: 'Product-Market Fit' },
      { id: 'm4-prioritization',   label: 'Prioritization' },
      { id: 'm4-frameworks',       label: 'Frameworks' },
      { id: 'm5-teams',            label: 'Working with Teams' },
      { id: 'm5-execution',        label: 'Execution Risks' },
      { id: 'm6-metrics',          label: 'Metrics' },
      { id: 'm6-north-star',       label: 'North Star' },
    ],
    concepts: [
      { id: 'pm-role',            label: 'PM Role',           color: '#4F46E5' },
      { id: 'problem-definition', label: 'Problem Definition',color: '#0097A7' },
      { id: 'strategy',           label: 'Strategy',          color: '#3A86FF' },
      { id: 'prioritization',     label: 'Prioritization',    color: '#C85A40' },
      { id: 'collaboration',      label: 'Collaboration',     color: '#0D7A5A' },
      { id: 'north-star',         label: 'North Star',        color: '#7843EE' },
    ],
  },
};

const ALL_CONCEPT_IDS = ['pm-role','problem-definition','strategy','prioritization','collaboration','north-star'];

// ─────────────────────────────────────────
// XP SYSTEM
// ─────────────────────────────────────────
const SECTION_XP = 50;
const MAX_QUIZ_XP_PER_CONCEPT = 100;

function computeXP(
  completedSections: Set<string>,
  conceptStates: Record<string, { pKnow: number }>,
): { readingXP: number; quizXP: number; total: number } {
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = Object.values(conceptStates)
    .reduce((sum, s) => sum + Math.round(s.pKnow * MAX_QUIZ_XP_PER_CONCEPT), 0);
  return { readingXP, quizXP, total: readingXP + quizXP };
}

const LEVELS = [
  { min: 0,   label: 'Curious',      color: 'var(--ed-ink3)'  },
  { min: 150, label: 'Thinker',      color: '#0097A7' },
  { min: 350, label: 'Practitioner', color: '#3A86FF' },
  { min: 600, label: 'PM-Minded',    color: '#4F46E5' },
  { min: 850, label: 'PM Thinker',   color: '#C85A40' },
];
function getLevel(xp: number) {
  let lvl = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.min) lvl = l; }
  return lvl;
}
function getNextLevel(xp: number) {
  const idx = LEVELS.findIndex(l => l.min > xp);
  return idx === -1 ? null : LEVELS[idx];
}

// ─────────────────────────────────────────
// ACHIEVEMENTS
// ─────────────────────────────────────────
const ACHIEVEMENTS_NEW_PM = [
  { id: 'part1-what-is-pm',    icon: '🌱', label: 'First Step',  desc: 'Learned what a PM actually does' },
  { id: 'part2-first-mistake', icon: '🔍', label: 'Dig Deeper',  desc: 'Problem vs solution thinking' },
  { id: 'part3-teams',         icon: '🤝', label: 'Team Player', desc: 'Lead without authority' },
  { id: 'part4-decisions',     icon: '⚖️',  label: 'Decisive',    desc: 'Made a hard prioritization call' },
  { id: 'part5-building',      icon: '🔗', label: 'Aligned',     desc: 'Built with clarity' },
  { id: 'part6-measuring',     icon: '📊', label: 'Data Driven', desc: 'Measured what matters' },
  { id: 'final-reflection',    icon: '🎯', label: 'PM Thinker',  desc: 'Completed the full loop' },
];
const ACHIEVEMENTS_APM = [
  { id: 'm1-pm-role',          icon: '🎯', label: 'PM Role',      desc: 'Understood the PM influence model' },
  { id: 'm1-product-triangle', icon: '🔺', label: 'Triangle',     desc: 'Mastered the product triangle' },
  { id: 'm2-problem-solution', icon: '🔍', label: 'Root Cause',   desc: 'Diagnosed problem vs solution' },
  { id: 'm2-research',         icon: '📋', label: 'Researcher',   desc: 'Applied research methods' },
  { id: 'm3-strategy',         icon: '🗺️', label: 'Strategist',  desc: 'Defined product strategy' },
  { id: 'm3-pmf',              icon: '🎯', label: 'PMF',          desc: 'Found product-market fit signals' },
  { id: 'm4-prioritization',   icon: '⚖️',  label: 'Prioritizer', desc: 'Made hard tradeoff decisions' },
  { id: 'm4-frameworks',       icon: '🛠️', label: 'Frameworks',  desc: 'Applied RICE and other frameworks' },
  { id: 'm5-teams',            icon: '🤝', label: 'Leader',       desc: 'Led without authority' },
  { id: 'm5-execution',        icon: '🚀', label: 'Executor',     desc: 'Managed execution risks' },
  { id: 'm6-metrics',          icon: '📊', label: 'Data Driven',  desc: 'Defined success metrics' },
  { id: 'm6-north-star',       icon: '⭐', label: 'North Star',   desc: 'Set the North Star metric' },
];

// ─────────────────────────────────────────
// AIRTRIBE LOGO MARK
// ─────────────────────────────────────────
function AirtribeLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Stylized "A" mark */}
      <div style={{
        width: '28px', height: '28px', borderRadius: '7px',
        background: 'linear-gradient(135deg, #7843EE 0%, #4F46E5 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(120,67,238,0.3)',
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '13px', fontWeight: 800, color: 'var(--ed-ink)',
          letterSpacing: '-0.02em', lineHeight: 1,
        }}>Airtribe</div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '8px', fontWeight: 600, color: 'var(--ed-ink3)',
          letterSpacing: '0.1em', lineHeight: 1, marginTop: '2px',
          textTransform: 'uppercase' as const,
        }}>Learn</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// LEFT NAV — Editorial CONTENTS sidebar
// ─────────────────────────────────────────
function LeftNav({
  track, sections, completedSections, activeSection, accent,
}: {
  track: Track; sections: { id: string; label: string }[];
  completedSections: Set<string>; activeSection: string | null; accent: string;
}) {
  const scrollTo = (id: string) => {
    document.querySelector(`[data-section="${id}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const donePct = Math.round((completedSections.size / sections.length) * 100);

  return (
    <aside style={{ position: 'sticky', top: '80px' }}>
      <div style={{
        background: 'var(--ed-card)',
        border: '1px solid var(--ed-rule)',
        borderRadius: '10px', padding: '18px 16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--ed-rule)' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)',
            marginBottom: '8px',
          }}>Contents</div>
          {/* Reading progress */}
          <div style={{ height: '2px', background: 'var(--ed-rule)', borderRadius: '1px', overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: accent, borderRadius: '1px' }}
              animate={{ width: `${donePct}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '6px' }}>
            {donePct}% · {completedSections.size}/{sections.length} parts
          </div>
        </div>

        {/* Section list */}
        <nav>
          {sections.map((sec, idx) => {
            const done = completedSections.has(sec.id);
            const active = activeSection === sec.id && !done;
            return (
              <motion.button
                key={sec.id}
                onClick={() => scrollTo(sec.id)}
                whileHover={{ x: 2 }}
                style={{
                  display: 'flex', alignItems: 'baseline', gap: '10px',
                  width: '100%', background: 'none', border: 'none',
                  cursor: 'pointer', padding: '6px 0',
                  textAlign: 'left' as const,
                  borderLeft: active ? `2px solid ${accent}` : '2px solid transparent',
                  paddingLeft: '8px',
                  marginLeft: '-8px',
                  transition: 'border-color 0.2s',
                }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700,
                  color: done ? accent : active ? accent : 'var(--ed-rule)',
                  flexShrink: 0, minWidth: '20px', lineHeight: 1,
                }}>
                  {toRoman(idx + 1)}.
                </span>
                <span style={{
                  fontSize: '12px', fontWeight: active ? 600 : 400,
                  color: done ? 'var(--ed-ink2)' : active ? 'var(--ed-ink)' : 'var(--ed-ink3)',
                  lineHeight: 1.4, wordBreak: 'break-word' as const,
                  transition: 'color 0.2s',
                }}>
                  {sec.label}{done ? ' ✓' : ''}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* Track label */}
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--ed-rule)' }}>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>
            {track === 'new-pm' ? "Following Priya's journey" : 'Advanced PM track'}
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────
// RIGHT SIDEBAR — Gamified Progress
// ─────────────────────────────────────────
function Sidebar({
  track, onSwitchTrack, completedSections, progressPct, xp, prevXp,
}: {
  track: Track; onSwitchTrack: () => void;
  completedSections: Set<string>; progressPct: number;
  xp: { readingXP: number; quizXP: number; total: number }; prevXp: number;
}) {
  const store = useLearnerStore();
  const cfg = TRACK_CONFIG[track];
  const total = xp.total;
  const level = getLevel(total);
  const nextLevel = getNextLevel(total);
  const levelPct = nextLevel
    ? Math.round(((total - level.min) / (nextLevel.min - level.min)) * 100)
    : 100;

  const [showGain, setShowGain] = useState(false);
  const [gainAmt, setGainAmt] = useState(0);
  const gainRef = useRef(prevXp);

  useEffect(() => {
    const diff = total - gainRef.current;
    if (diff > 0) {
      setGainAmt(diff);
      setShowGain(true);
      gainRef.current = total;
      const t = setTimeout(() => setShowGain(false), 1800);
      return () => clearTimeout(t);
    }
  }, [total]);

  const achievements = track === 'new-pm' ? ACHIEVEMENTS_NEW_PM : ACHIEVEMENTS_APM;
  const unlockedCount = achievements.filter(a => completedSections.has(a.id)).length;
  const latestUnlock = achievements.slice().reverse().find(a => completedSections.has(a.id));

  const cardStyle: React.CSSProperties = {
    background: 'var(--ed-card)',
    border: '1px solid var(--ed-rule)',
    borderRadius: '10px', padding: '16px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
  };

  return (
    <aside style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>

      {/* ── XP + Level ── */}
      <div style={{ ...cardStyle, borderTop: `3px solid ${cfg.accent}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px',
            }}>Level</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: level.color, whiteSpace: 'nowrap' as const }}>{level.label}</div>
          </div>
          <div style={{ textAlign: 'right' as const, position: 'relative', overflow: 'visible' }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px',
            }}>XP</div>
            <motion.div
              key={total} animate={{ scale: [1.12, 1] }} transition={{ duration: 0.25 }}
              style={{ fontSize: '22px', fontWeight: 900, color: cfg.accent, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
              {total}
            </motion.div>
            <AnimatePresence>
              {showGain && (
                <motion.div
                  initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -20 }}
                  exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
                  style={{ position: 'absolute', right: 0, top: '-6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: '#0D7A5A', pointerEvents: 'none', whiteSpace: 'nowrap' as const }}>
                  +{gainAmt}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* XP breakdown */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          {[{ label: 'Reading', val: xp.readingXP, color: cfg.accent }, { label: 'Quizzes', val: xp.quizXP, color: '#0D7A5A' }].map(b => (
            <div key={b.label} style={{ flex: 1, padding: '5px 8px', borderRadius: '5px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
              <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', marginBottom: '2px', textTransform: 'uppercase' as const }}>{b.label}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: b.color }}>{b.val} xp</div>
            </div>
          ))}
        </div>

        {/* Level progress bar */}
        {nextLevel ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{levelPct}% to {nextLevel.label}</span>
              <span style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{nextLevel.min - total} xp</span>
            </div>
            <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${levelPct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ height: '100%', background: cfg.accent, borderRadius: '2px' }}
              />
            </div>
          </>
        ) : (
          <div style={{ fontSize: '11px', color: cfg.accent, fontWeight: 700 }}>✦ Max level reached</div>
        )}
      </div>

      {/* ── Module progress ── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)' }}>Module Progress</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: cfg.accent }}>{progressPct}%</span>
            <motion.button
              whileHover={{ opacity: 0.75 }}
              onClick={onSwitchTrack}
              style={{ background: 'var(--ed-indigo-bg)', border: '1px solid var(--ed-indigo-border)', borderRadius: '4px', padding: '2px 7px', fontSize: '8px', fontWeight: 700, color: 'var(--ed-indigo)', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>
              SWITCH
            </motion.button>
          </div>
        </div>
        <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }}
            style={{ height: '100%', background: cfg.accent, borderRadius: '2px' }}
          />
        </div>
        <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--ed-ink3)' }}>
          {completedSections.size} of {cfg.sections.length} parts · {cfg.time}
        </div>
      </div>

      {/* ── Achievements ── */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)' }}>
            Badges
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{unlockedCount}/{achievements.length}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', padding: '2px' }}>
          {achievements.map(a => {
            const unlocked = completedSections.has(a.id);
            return (
              <div key={a.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: unlocked ? 'var(--ed-indigo-bg)' : 'var(--ed-cream)',
                    border: `1px solid ${unlocked ? 'var(--ed-indigo-border)' : 'var(--ed-rule)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '17px',
                    filter: unlocked ? 'none' : 'grayscale(1) opacity(0.3)',
                    transition: 'all 0.3s', cursor: 'default',
                  }}>
                  {a.icon}
                </motion.div>
                <div style={{
                  fontSize: '8px', color: unlocked ? 'var(--ed-ink3)' : 'transparent',
                  fontWeight: 600, textAlign: 'center' as const,
                  maxWidth: '40px', lineHeight: 1.2, wordBreak: 'break-word' as const,
                }}>
                  {a.label}
                </div>
              </div>
            );
          })}
        </div>
        {latestUnlock && (
          <div style={{ marginTop: '10px', padding: '8px 10px', borderRadius: '6px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
            <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--ed-ink3)', letterSpacing: '0.1em', marginBottom: '3px' }}>LATEST</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px', flexShrink: 0 }}>{latestUnlock.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.3 }}>{latestUnlock.label}</div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.4, wordBreak: 'break-word' as const }}>{latestUnlock.desc}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Concept Mastery ── */}
      <div style={{ ...cardStyle, borderLeft: '3px solid var(--ed-indigo)' }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-indigo)', marginBottom: '10px',
        }}>Concept Mastery</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {cfg.concepts.map(c => {
            const state = store.conceptStates[c.id];
            const pct = state ? Math.round(state.pKnow * 100) : 0;
            return (
              <div key={c.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--ed-ink2)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{c.label}</span>
                  <span style={{ fontSize: '10px', color: pct > 0 ? c.color : 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, flexShrink: 0 }}>{pct}%</span>
                </div>
                <div style={{ height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
                    style={{ height: '100%', background: c.color, borderRadius: '2px' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
          Complete quizzes to raise mastery scores
        </div>
      </div>

      {/* ── Streak ── */}
      {store.streakDays > 0 && (
        <div style={{ ...cardStyle, borderLeft: '3px solid #C85A40' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <motion.span
              animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
              style={{ fontSize: '20px', flexShrink: 0 }}>🔥</motion.span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#C85A40', lineHeight: 1 }}>{store.streakDays} day{store.streakDays !== 1 ? 's' : ''}</div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '2px' }}>learning streak</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
interface Props {
  startTrack: Track;
  onBack: () => void;
}

export default function PMFundamentalsModule({ startTrack, onBack }: Props) {
  const store = useLearnerStore();
  const [track] = useState<Track>(startTrack);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const prevXpRef = useRef(0);

  useEffect(() => {
    store.initSession();
    ALL_CONCEPT_IDS.forEach(id => store.ensureConceptState(id));
  }, []);

  useEffect(() => {
    if (!track) return;
    // Section observer — tracks reading progress and active section
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const sid = entry.target.getAttribute('data-section');
        if (!sid) return;
        if (entry.isIntersecting) {
          if (entry.intersectionRatio >= 0.1) setActiveSection(sid);
          if (entry.intersectionRatio >= 0.25) {
            setCompletedSections(prev => new Set([...prev, sid]));
            store.markSectionViewed(sid);
          }
        }
      });
    }, { threshold: [0.1, 0.25, 0.5] });

    const tid = setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach(el => sectionObserver.observe(el));
    }, 150);

    return () => { clearTimeout(tid); sectionObserver.disconnect(); };
  }, [track]);

  useEffect(() => {
    if (!track) return;
    // Per-element reveal observer — staggered, individual triggers
    let revealObserver: IntersectionObserver;
    const tid = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll('.rv,.rvl,.rvr'));
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

      elements.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          // Already in view — reveal with brief stagger
          setTimeout(() => el.classList.add('in'), Math.min(i, 6) * 60);
        } else {
          revealObserver.observe(el);
        }
      });
    }, 200);

    return () => { clearTimeout(tid); if (revealObserver) revealObserver.disconnect(); };
  }, [track]);

  const cfg = TRACK_CONFIG[track];
  const totalSections = cfg.sections.length;
  const progressPct = Math.round((completedSections.size / totalSections) * 100);
  const xp = computeXP(completedSections, store.conceptStates);

  return (
    <div className="editorial" style={{ background: 'var(--ed-cream)', minHeight: '100vh', transition: 'background 0.4s, color 0.4s' }}>

      {/* ── Sticky top nav bar ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', backdropFilter: 'blur(12px)', transition: 'background 0.4s' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
        <motion.div
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '11px 0',
          }}>

          {/* Left: Airtribe logo + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
            <AirtribeLogo />
            <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>PM Fundamentals</span>
              <span style={{ color: 'var(--ed-rule)', fontSize: '12px' }}>›</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink2)' }}>
                {cfg.label}
              </span>
            </div>
          </div>

          {/* Center: reading progress */}
          <div className="top-nav-progress" style={{ flex: 1, maxWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 24px' }}>
            <div style={{ flex: 1, height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }}
                style={{ height: '100%', background: cfg.accent, borderRadius: '2px' }}
              />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: cfg.accent, flexShrink: 0 }}>{progressPct}%</span>
          </div>

          {/* Right: back button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Back button */}
            <motion.button
              whileHover={{ opacity: 0.75 }} whileTap={{ scale: 0.97 }}
              onClick={onBack}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 12px', borderRadius: '6px',
                background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', cursor: 'pointer',
              }}>
              <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>←</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)', fontFamily: "'JetBrains Mono', monospace" }}>Curriculum</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Airtribe gradient accent bar */}
        <div className="airtribe-bar" style={{ marginBottom: '0' }} />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="three-col-wrap" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>

        {/* ── Three-column layout ── */}
        <div className="three-col-grid" style={{
          display: 'grid',
          gridTemplateColumns: '200px minmax(0, 1fr) 240px',
          gap: '40px',
          alignItems: 'start',
          paddingTop: '36px',
        }}>

          {/* LEFT: CONTENTS */}
          <div className="left-col">
            <LeftNav
              track={track}
              sections={cfg.sections}
              completedSections={completedSections}
              activeSection={activeSection}
              accent={cfg.accent}
            />
          </div>

          {/* CENTER: Content */}
          <AnimatePresence mode="wait">
            <motion.main
              key={track}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3 }}
              style={{ minWidth: 0 }}>

              {track === 'new-pm' ? <Track1NewPM /> : <Track2APM />}

              {/* Completion card */}
              <AnimatePresence>
                {progressPct >= 87 && (
                  <motion.div
                    initial={{ opacity: 0, y: 28, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{
                      padding: '40px 32px', background: 'var(--ed-card)',
                      borderRadius: '10px', textAlign: 'center' as const,
                      position: 'relative', overflow: 'hidden', marginBottom: '40px',
                      border: '1px solid var(--ed-rule)',
                      borderTop: `4px solid ${cfg.accent}`,
                    }}>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      style={{ fontSize: '40px', marginBottom: '14px' }}>🎯</motion.div>
                    <h3 style={{
                      fontSize: '22px', fontWeight: 700, marginBottom: '10px',
                      color: 'var(--ed-ink)', fontFamily: "'Lora', 'Georgia', serif",
                    }}>
                      Module 01 Complete
                    </h3>
                    <p style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '400px', margin: '0 auto 24px' }}>
                      {track === 'new-pm'
                        ? 'You followed Priya through all 7 parts. Understand → Decide → Build → Measure. That loop never stops.'
                        : "You've sharpened your judgment on tradeoffs, framing, strategy, and metrics."}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{ padding: '12px 28px', borderRadius: '6px', background: cfg.accent, color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                      Next → Module 02
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ height: '60px' }} />
            </motion.main>
          </AnimatePresence>

          {/* RIGHT: Gamified sidebar */}
          <div className="right-col">
            <Sidebar
              track={track}
              onSwitchTrack={onBack}
              completedSections={completedSections}
              progressPct={progressPct}
              xp={xp}
              prevXp={prevXpRef.current}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

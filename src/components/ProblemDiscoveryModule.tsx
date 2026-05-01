'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import type { Track } from './pm-fundamentals/designSystem';
import Track1ProblemDiscovery from './pm-fundamentals/Track1ProblemDiscovery';
import Track2ProblemDiscovery from './pm-fundamentals/Track2ProblemDiscovery';
import { AirtribeLogo, DarkModeToggle } from './AirtribeBrand';

const ROMAN = ['I','II','III','IV','V','VI','VII'];
const toRoman = (n: number) => ROMAN[n - 1] ?? String(n);

const ACCENT       = '#0097A7';
const ACCENT_RGB   = '0,151,167';
const MODULE_LABEL = 'Problem Discovery';
const MODULE_TIME  = '45 min · 6 parts';

const SECTIONS = [
  { id: 'm2-discovery-mindset', label: 'Discovery Mindset' },
  { id: 'm2-customer-segments', label: 'Know Your Users' },
  { id: 'm2-research-methods',  label: 'Research Methods' },
  { id: 'm2-interview',         label: 'Run an Interview' },
  { id: 'm2-synthesis',         label: 'Synthesize Insights' },
  { id: 'm2-problem-statement', label: 'Discovery Brief' },
  { id: 'm2-reflection',        label: 'Final Reflection' },
];

const CONCEPTS = [
  { id: 'user-research',      label: 'User Research',      color: '#0097A7' },
  { id: 'customer-segments',  label: 'Customer Segments',  color: '#4F46E5' },
  { id: 'jtbd',               label: 'Jobs to Be Done',    color: '#7843EE' },
  { id: 'research-methods',   label: 'Research Methods',   color: '#C85A40' },
  { id: 'insight-synthesis',  label: 'Insight Synthesis',  color: '#158158' },
  { id: 'problem-framing',    label: 'Problem Framing',    color: '#B5720A' },
];

const ACHIEVEMENTS = [
  { id: 'm2-discovery-mindset', icon: '🔭', label: 'Discoverer',  desc: 'Resisted the urge to build first' },
  { id: 'm2-customer-segments', icon: '👥', label: 'Segmenter',   desc: 'Found the right users to research' },
  { id: 'm2-research-methods',  icon: '🔬', label: 'Researcher',  desc: 'Matched method to question' },
  { id: 'm2-interview',         icon: '🎤', label: 'Interviewer', desc: 'Asked questions that got real answers' },
  { id: 'm2-synthesis',         icon: '🗂️', label: 'Synthesizer', desc: 'Turned notes into insights' },
  { id: 'm2-problem-statement', icon: '📋', label: 'Briefed',     desc: 'Wrote a crisp discovery brief' },
  { id: 'm2-reflection',        icon: '🎯', label: 'Discoverer',  desc: 'Completed the discovery loop' },
];

const CONCEPT_IDS = CONCEPTS.map(c => c.id);

const SECTION_XP = 50;
const MAX_QUIZ_XP_PER_CONCEPT = 100;
const MODULE_ID = 'pm-03';
const EMPTY_SECTIONS: string[] = [];

function computeXP(
  completedSections: Set<string>,
  conceptStates: Record<string, { pKnow: number }>,
) {
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

// AirtribeLogo imported from AirtribeBrand.tsx

// ─────────────────────────────────────────
// LEFT NAV
// ─────────────────────────────────────────
function LeftNav({ completedSections, activeSection }: { completedSections: Set<string>; activeSection: string | null }) {
  const scrollTo = (id: string) => {
    document.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const donePct = Math.round((completedSections.size / SECTIONS.length) * 100);

  return (
    <aside style={{ position: 'sticky', top: '80px' }}>
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '18px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--ed-rule)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '8px' }}>Contents</div>
          <div style={{ height: '2px', background: 'var(--ed-rule)', borderRadius: '1px', overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', background: ACCENT, borderRadius: '1px' }} animate={{ width: `${donePct}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '6px' }}>{donePct}% · {completedSections.size}/{SECTIONS.length} parts</div>
        </div>
        <nav>
          {SECTIONS.map((sec, idx) => {
            const done = completedSections.has(sec.id);
            const active = activeSection === sec.id && !done;
            return (
              <motion.button key={sec.id} onClick={() => scrollTo(sec.id)} whileHover={{ x: 2 }}
                style={{ display: 'flex', alignItems: 'baseline', gap: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', textAlign: 'left' as const, borderLeft: active ? `2px solid ${ACCENT}` : '2px solid transparent', paddingLeft: '8px', marginLeft: '-8px', transition: 'border-color 0.2s' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: done ? ACCENT : active ? ACCENT : 'var(--ed-rule)', flexShrink: 0, minWidth: '20px', lineHeight: 1 }}>{toRoman(idx + 1)}.</span>
                <span style={{ fontSize: '12px', fontWeight: active ? 600 : 400, color: done ? 'var(--ed-ink2)' : active ? 'var(--ed-ink)' : 'var(--ed-ink3)', lineHeight: 1.4, wordBreak: 'break-word' as const, transition: 'color 0.2s' }}>
                  {sec.label}{done ? ' ✓' : ''}
                </span>
              </motion.button>
            );
          })}
        </nav>
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--ed-rule)' }}>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>Following Priya&apos;s journey</div>
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────
// RIGHT SIDEBAR
// ─────────────────────────────────────────
function Sidebar({ completedSections, progressPct, xp, prevXp }: {
  completedSections: Set<string>; progressPct: number;
  xp: { readingXP: number; quizXP: number; total: number }; prevXp: number;
}) {
  const store = useLearnerStore();
  const total = xp.total;
  const level = getLevel(total);
  const nextLevel = getNextLevel(total);
  const levelPct = nextLevel ? Math.round(((total - level.min) / (nextLevel.min - level.min)) * 100) : 100;

  const [showGain, setShowGain] = useState(false);
  const [gainAmt, setGainAmt] = useState(0);
  const gainRef = useRef(prevXp);

  useEffect(() => {
    const diff = total - gainRef.current;
    if (diff > 0) {
      setGainAmt(diff); setShowGain(true);
      gainRef.current = total;
      const t = setTimeout(() => setShowGain(false), 1800);
      return () => clearTimeout(t);
    }
  }, [total]);

  const unlockedCount = ACHIEVEMENTS.filter(a => completedSections.has(a.id)).length;
  const latestUnlock = ACHIEVEMENTS.slice().reverse().find(a => completedSections.has(a.id));

  const cardStyle: React.CSSProperties = { background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' };

  return (
    <aside style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>

      {/* XP + Level */}
      <div style={{ ...cardStyle, borderTop: `3px solid ${ACCENT}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px' }}>Level</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: level.color, whiteSpace: 'nowrap' as const }}>{level.label}</div>
          </div>
          <div style={{ textAlign: 'right' as const, position: 'relative', overflow: 'visible' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px' }}>XP</div>
            <motion.div key={total} animate={{ scale: [1.12, 1] }} transition={{ duration: 0.25 }}
              style={{ fontSize: '22px', fontWeight: 900, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
              {total}
            </motion.div>
            <AnimatePresence>
              {showGain && (
                <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -20 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
                  style={{ position: 'absolute', right: 0, top: '-6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: '#0D7A5A', pointerEvents: 'none', whiteSpace: 'nowrap' as const }}>
                  +{gainAmt}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          {[{ label: 'Reading', val: xp.readingXP, color: ACCENT }, { label: 'Quizzes', val: xp.quizXP, color: '#0D7A5A' }].map(b => (
            <div key={b.label} style={{ flex: 1, padding: '5px 8px', borderRadius: '5px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
              <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', marginBottom: '2px', textTransform: 'uppercase' as const }}>{b.label}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: b.color }}>{b.val} xp</div>
            </div>
          ))}
        </div>
        {nextLevel ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{levelPct}% to {nextLevel.label}</span>
              <span style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{nextLevel.min - total} xp</span>
            </div>
            <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${levelPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: ACCENT, borderRadius: '2px' }} />
            </div>
          </>
        ) : (
          <div style={{ fontSize: '11px', color: ACCENT, fontWeight: 700 }}>✦ Max level reached</div>
        )}
      </div>

      {/* Module progress */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)' }}>Module Progress</div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: ACCENT }}>{progressPct}%</span>
        </div>
        <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: ACCENT, borderRadius: '2px' }} />
        </div>
        <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--ed-ink3)' }}>
          {completedSections.size} of {SECTIONS.length} parts · {MODULE_TIME}
        </div>
      </div>

      {/* Badges */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)' }}>Badges</div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{unlockedCount}/{ACHIEVEMENTS.length}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', padding: '2px' }}>
          {ACHIEVEMENTS.map(a => {
            const unlocked = completedSections.has(a.id);
            return (
              <div key={a.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <motion.div whileHover={{ scale: 1.08 }}
                  title={unlocked ? `${a.label}: ${a.desc}` : 'Locked'}
                  style={{ width: '36px', height: '36px', borderRadius: '8px', background: unlocked ? `rgba(${ACCENT_RGB},0.12)` : 'var(--ed-cream)', border: `1px solid ${unlocked ? `rgba(${ACCENT_RGB},0.3)` : 'var(--ed-rule)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', filter: unlocked ? 'none' : 'grayscale(1) opacity(0.3)', transition: 'all 0.3s', cursor: 'default' }}>
                  {a.icon}
                </motion.div>
                <div style={{ fontSize: '8px', color: unlocked ? 'var(--ed-ink3)' : 'transparent', fontWeight: 600, textAlign: 'center' as const, maxWidth: '40px', lineHeight: 1.2, wordBreak: 'break-word' as const }}>
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

      {/* Concept Mastery */}
      <div style={{ ...cardStyle, borderLeft: `3px solid ${ACCENT}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '10px' }}>Concept Mastery</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {CONCEPTS.map(c => {
            const state = store.conceptStates[c.id];
            const pct = state ? Math.round(state.pKnow * 100) : 0;
            return (
              <div key={c.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--ed-ink2)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{c.label}</span>
                  <span style={{ fontSize: '10px', color: pct > 0 ? c.color : 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, flexShrink: 0 }}>{pct}%</span>
                </div>
                <div style={{ height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: c.color, borderRadius: '2px' }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>Complete quizzes to raise mastery scores</div>
      </div>

      {/* Streak */}
      {store.streakDays > 0 && (
        <div style={{ ...cardStyle, borderLeft: '3px solid #C85A40' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ fontSize: '20px', flexShrink: 0 }}>🔥</motion.span>
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
  onBack: () => void;
  track?: Track | null;
}

export default function ProblemDiscoveryModule({ onBack, track }: Props) {
  const store = useLearnerStore();
  const storedSections = useLearnerStore(s => s.completedSections[MODULE_ID] ?? EMPTY_SECTIONS);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set(storedSections));
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const prevXpRef = useRef(0);

  useEffect(() => {
    store.initSession();
    CONCEPT_IDS.forEach(id => store.ensureConceptState(id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const sid = entry.target.getAttribute('data-section');
        if (!sid) return;
        if (entry.isIntersecting) {
          setActiveSection(sid);
          setCompletedSections(prev => new Set([...prev, sid]));
          store.markSectionViewed(sid);
          store.markSectionCompleted(MODULE_ID, sid);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -25% 0px' });

    const tid = setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach(el => sectionObserver.observe(el));
    }, 150);

    return () => { clearTimeout(tid); sectionObserver.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
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
          setTimeout(() => el.classList.add('in'), Math.min(i, 6) * 60);
        } else {
          revealObserver.observe(el);
        }
      });
    }, 200);
    return () => { clearTimeout(tid); if (revealObserver) revealObserver.disconnect(); };
  }, []);

  const progressPct = Math.round((completedSections.size / SECTIONS.length) * 100);
  const xp = computeXP(completedSections, store.conceptStates);

  return (
    <div className="editorial" style={{ background: 'var(--ed-cream)', minHeight: '100vh', transition: 'background 0.4s, color 0.4s' }}>

      {/* Sticky top nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', backdropFilter: 'blur(12px)', transition: 'background 0.4s' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
              <motion.button whileHover={{ opacity: 0.75 }} whileTap={{ scale: 0.97 }} onClick={onBack}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', cursor: 'pointer', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>←</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)', fontFamily: "'JetBrains Mono', monospace" }}>Back</span>
              </motion.button>
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <AirtribeLogo />
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>Module 03</span>
                <span style={{ color: 'var(--ed-rule)', fontSize: '12px' }}>›</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink2)' }}>{MODULE_LABEL}</span>
              </div>
            </div>

            <div className="top-nav-progress" style={{ flex: 1, maxWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 24px' }}>
              <div style={{ flex: 1, height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: ACCENT, borderRadius: '2px' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: ACCENT, flexShrink: 0 }}>{progressPct}%</span>
            </div>

            <DarkModeToggle />
          </motion.div>
          <div className="airtribe-bar" />
        </div>
      </div>

      {/* Three-column layout */}
      <div className="three-col-wrap" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
        <div className="three-col-grid" style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr) 240px', gap: '40px', alignItems: 'start', paddingTop: '36px' }}>

          <div className="left-col" style={{ alignSelf: 'stretch' }}>
            <LeftNav completedSections={completedSections} activeSection={activeSection} />
          </div>

          <motion.main key="m2-content" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={{ minWidth: 0 }}>
            {track === 'apm' ? <Track2ProblemDiscovery /> : <Track1ProblemDiscovery />}

            <AnimatePresence>
              {progressPct >= 87 && (
                <motion.div initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  style={{ padding: '40px 32px', background: 'var(--ed-card)', borderRadius: '10px', textAlign: 'center' as const, position: 'relative', overflow: 'hidden', marginBottom: '40px', border: '1px solid var(--ed-rule)', borderTop: `4px solid ${ACCENT}` }}>
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '40px', marginBottom: '14px' }}>🔭</motion.div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: 'var(--ed-ink)', fontFamily: "'Lora', 'Georgia', serif" }}>
                    Module 03 Complete
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '400px', margin: '0 auto 24px' }}>
                    You followed Priya through the full discovery loop. Symptom → Research → Insight → Brief. That sequence never changes.
                  </p>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onBack}
                    style={{ padding: '12px 28px', borderRadius: '6px', background: ACCENT, color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                    Back to Curriculum →
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ height: '60px' }} />
          </motion.main>

          <div className="right-col" style={{ alignSelf: 'stretch' }}>
            <Sidebar
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

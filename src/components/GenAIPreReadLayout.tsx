'use client';

/**
 * GenAIPreReadLayout — shared shell for all 7 GenAI pre-read modules.
 *
 * Handles: completedSections (hydrated from store), IntersectionObserver,
 * XP calculation, left nav, right sidebar, DarkModeToggle, AirtribeLogo,
 * progress bar, completion screen.
 *
 * Usage:
 *   export default function GenAIPreRead3({ onBack }: Props) {
 *     return (
 *       <GenAIPreReadLayout
 *         moduleNum="03" moduleLabel="Pre-Read 03 · AI Writing" accent="#0D9488" accentRgb="13,148,136"
 *         sections={SECTIONS} badges={BADGES} concepts={CONCEPTS}
 *         completionEmoji="✍" completionMessage="You now understand..." onBack={onBack}
 *       >
 *         <CoreContent />
 *       </GenAIPreReadLayout>
 *     );
 *   }
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import { AirtribeLogo, DarkModeToggle } from './AirtribeBrand';
import { GenAILatestBadgePanel } from './GenAISidebarExtras';
import GenAIStreakCard from './GenAISidebarExtras';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface GenAILayoutSection { id: string; label: string; icon?: string; }
export interface GenAILayoutBadge   { id: string; icon: string; label: string; color: string; desc?: string; }
export interface GenAILayoutConcept { id: string; label: string; color: string; }

export interface GenAIPreReadLayoutProps {
  moduleNum: string;           // '01' | '02' | … | '07'
  moduleLabel: string;         // breadcrumb label, e.g. 'Pre-Read 01 · AI Foundations'
  accent: string;
  accentRgb: string;
  sections: GenAILayoutSection[];
  badges: GenAILayoutBadge[];
  concepts: GenAILayoutConcept[];
  completionEmoji: string;
  completionMessage: string;
  onBack: () => void;
  onNext?: () => void;
  nextLabel?: string;
  children:
    | React.ReactNode
    | ((state: { completedSections: Set<string>; activeSection: string | null }) => React.ReactNode);
}

// ─── Internals ────────────────────────────────────────────────────────────────

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
const toRoman = (n: number) => ROMAN[n - 1] ?? String(n);

const SECTION_XP = 50;
const MAX_QUIZ_XP = 100;
const EMPTY_SECTIONS: string[] = [];

function computeXP(completed: Set<string>, conceptStates: Record<string, { pKnow: number }>) {
  return {
    readingXP: completed.size * SECTION_XP,
    quizXP: Object.values(conceptStates).reduce((s, c) => s + Math.round(c.pKnow * MAX_QUIZ_XP), 0),
    get total() { return this.readingXP + this.quizXP; },
  };
}

const LEVELS = [
  { min: 0,   label: 'Curious',   color: 'var(--ed-ink3)' },
  { min: 150, label: 'Operator',  color: '#7843EE' },
  { min: 350, label: 'Builder',   color: '#3A86FF' },
  { min: 600, label: 'Architect', color: '#0D7A5A' },
  { min: 850, label: 'AI-Native', color: '#C85A40' },
];
function getLevel(xp: number) { let l = LEVELS[0]; for (const x of LEVELS) { if (xp >= x.min) l = x; } return l; }
function getNext(xp: number) { const i = LEVELS.findIndex(l => l.min > xp); return i === -1 ? null : LEVELS[i]; }

// ─── LeftNav ──────────────────────────────────────────────────────────────────

function LeftNav({ sections, accent, completedSections, activeSection }: {
  sections: GenAILayoutSection[]; accent: string;
  completedSections: Set<string>; activeSection: string | null;
}) {
  const scrollTo = (id: string) =>
    document.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const sectionIds = new Set(sections.map(s => s.id));
  const trackDone = new Set([...completedSections].filter(id => sectionIds.has(id)));
  const donePct   = Math.round((trackDone.size / sections.length) * 100);

  return (
    <aside style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '18px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--ed-rule)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '8px' }}>Contents</div>
          <div style={{ height: '2px', background: 'var(--ed-rule)', borderRadius: '1px', overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', background: accent, borderRadius: '1px' }} animate={{ width: `${donePct}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '6px' }}>{donePct}% · {trackDone.size}/{sections.length} parts</div>
        </div>
        <nav>
          {sections.map((sec, idx) => {
            const done   = completedSections.has(sec.id);
            const active = activeSection === sec.id && !done;
            return (
              <motion.button key={sec.id} onClick={() => scrollTo(sec.id)} whileHover={{ x: 2 }}
                style={{ display: 'flex', alignItems: 'baseline', gap: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', textAlign: 'left' as const, borderLeft: active ? `2px solid ${accent}` : '2px solid transparent', paddingLeft: '8px', marginLeft: '-8px', transition: 'border-color 0.2s' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: done ? accent : active ? accent : 'var(--ed-rule)', flexShrink: 0, minWidth: '20px', lineHeight: 1 }}>
                  {toRoman(idx + 1)}.
                </span>
                <span style={{ fontSize: '12px', fontWeight: active ? 600 : 400, color: done ? 'var(--ed-ink2)' : active ? 'var(--ed-ink)' : 'var(--ed-ink3)', lineHeight: 1.4, wordBreak: 'break-word' as const, transition: 'color 0.2s' }}>
                  {sec.label}{done ? ' ✓' : ''}
                </span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ accent, accentRgb, sections, badges, concepts, completedSections, progressPct, xp, prevXp }: {
  accent: string; accentRgb: string;
  sections: GenAILayoutSection[]; badges: GenAILayoutBadge[]; concepts: GenAILayoutConcept[];
  completedSections: Set<string>; progressPct: number;
  xp: { readingXP: number; quizXP: number; total: number }; prevXp: number;
}) {
  const store = useLearnerStore();
  const total = xp.total;
  const level = getLevel(total);
  const next  = getNext(total);
  const levelPct = next ? Math.round(((total - level.min) / (next.min - level.min)) * 100) : 100;

  const [showGain, setShowGain] = useState(false);
  const [gainAmt,  setGainAmt]  = useState(0);
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

  const unlockedCount = badges.filter(b => completedSections.has(b.id)).length;
  const sectionIds    = new Set(sections.map(s => s.id));
  const trackDone     = new Set([...completedSections].filter(id => sectionIds.has(id)));

  const card: React.CSSProperties = {
    padding: '14px 16px', borderRadius: '10px', background: 'var(--ed-card)',
    border: '1px solid var(--ed-rule)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', marginBottom: '12px',
  };

  return (
    <aside style={{ position: 'sticky', top: '80px' }}>
      {/* Level + XP */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', position: 'relative' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '4px' }}>Level</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: level.color }}>{level.label}</div>
          </div>
          <div style={{ textAlign: 'right' as const, position: 'relative' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '4px' }}>XP</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: accent, fontFamily: "'JetBrains Mono', monospace" }}>{total}</div>
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
          {[{ label: 'Reading', val: xp.readingXP, color: accent }, { label: 'Quizzes', val: xp.quizXP, color: '#0D7A5A' }].map(b => (
            <div key={b.label} style={{ flex: 1, padding: '5px 8px', borderRadius: '5px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
              <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', marginBottom: '2px', textTransform: 'uppercase' as const }}>{b.label}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: b.color }}>{b.val} xp</div>
            </div>
          ))}
        </div>
        {next ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{levelPct}% to {next.label}</span>
              <span style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{next.min - total} xp</span>
            </div>
            <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${levelPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: accent, borderRadius: '2px' }} />
            </div>
          </>
        ) : <div style={{ fontSize: '11px', color: accent, fontWeight: 700 }}>✦ Max level reached</div>}
      </div>

      {/* Module progress */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)' }}>Module Progress</div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: accent }}>{progressPct}%</span>
        </div>
        <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: accent, borderRadius: '2px' }} />
        </div>
        <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--ed-ink3)' }}>
          {trackDone.size} of {sections.length} parts
        </div>
      </div>

      {/* Badges */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)' }}>Badges</div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{unlockedCount}/{badges.length}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {badges.map(b => {
            const unlocked = completedSections.has(b.id);
            return (
              <div key={b.id} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '3px' }}>
                <motion.div whileHover={{ scale: 1.08 }} title={unlocked ? `${b.label}${b.desc ? `: ${b.desc}` : ''}` : 'Locked'}
                  style={{ width: '36px', height: '36px', borderRadius: '8px', background: unlocked ? `rgba(${accentRgb},0.12)` : 'var(--ed-cream)', border: `1px solid ${unlocked ? `rgba(${accentRgb},0.3)` : 'var(--ed-rule)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', filter: unlocked ? 'none' : 'grayscale(1) opacity(0.3)', transition: 'all 0.3s', cursor: 'default' }}>
                  {b.icon}
                </motion.div>
                <div style={{ fontSize: '8px', color: unlocked ? 'var(--ed-ink3)' : 'transparent', fontWeight: 600, textAlign: 'center' as const, maxWidth: '40px', lineHeight: 1.2, wordBreak: 'break-word' as const }}>
                  {b.label}
                </div>
              </div>
            );
          })}
        </div>
        <GenAILatestBadgePanel badges={badges} completedSections={completedSections} />
      </div>

      {/* Concept mastery */}
      {concepts.length > 0 && (
        <div style={{ ...card, borderLeft: `3px solid ${accent}` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '10px' }}>Concept Mastery</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '9px' }}>
            {concepts.map(c => {
              const state = store.conceptStates[c.id];
              const pct   = state ? Math.round(state.pKnow * 100) : 0;
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
      )}

      <GenAIStreakCard />
    </aside>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function GenAIPreReadLayout({
  moduleNum, moduleLabel, accent, accentRgb,
  sections, badges, concepts,
  completionEmoji, completionMessage,
  onBack, onNext, nextLabel, children,
}: GenAIPreReadLayoutProps) {
  const store = useLearnerStore();
  const moduleId      = `genai-pr-${moduleNum}`;
  const storedSections = useLearnerStore(s => s.completedSections[moduleId] ?? EMPTY_SECTIONS);

  // Hydrate completedSections from store on mount (fixes progress retention across sessions)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set(storedSections));
  const [activeSection,     setActiveSection]     = useState<string | null>(null);
  const prevXpRef = useRef(0);

  useEffect(() => {
    store.initSession();
    concepts.forEach(c => store.ensureConceptState(c.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Section scroll tracking
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const sid = entry.target.getAttribute('data-section');
        if (!sid) return;
        if (entry.isIntersecting) {
          setActiveSection(sid);
          setCompletedSections(prev => new Set([...prev, sid]));
          store.markSectionViewed(sid);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -25% 0px' });

    const t = setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));
    }, 150);

    return () => { clearTimeout(t); observer.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reveal animations
  useEffect(() => {
    let revealObs: IntersectionObserver;
    const t = setTimeout(() => {
      const els = Array.from(document.querySelectorAll('.rv,.rvl,.rvr'));
      revealObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top < window.innerHeight) setTimeout(() => el.classList.add('in'), Math.min(i, 6) * 60);
        else revealObs.observe(el);
      });
    }, 200);
    return () => { clearTimeout(t); if (revealObs!) revealObs.disconnect(); };
  }, []);

  const sectionIds   = new Set(sections.map(s => s.id));
  const trackDone    = new Set([...completedSections].filter(id => sectionIds.has(id)));
  const progressPct  = Math.min(100, Math.round((trackDone.size / sections.length) * 100));
  const xp           = computeXP(trackDone, store.conceptStates);
  const content = typeof children === 'function'
    ? children({ completedSections: trackDone, activeSection })
    : React.isValidElement(children)
      ? React.cloneElement(
          children as React.ReactElement<{ completedSections?: Set<string>; activeSection?: string | null }>,
          { completedSections: trackDone, activeSection }
        )
      : children;

  return (
    <div className="editorial" style={{ background: 'var(--ed-cream)', minHeight: '100vh', transition: 'background 0.4s, color 0.4s' }}>

      {/* Sticky top nav — standardized across all 7 modules */}
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
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>GenAI Launchpad</span>
                <span style={{ color: 'var(--ed-rule)', fontSize: '12px' }}>›</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{moduleLabel}</span>
              </div>
            </div>
            <div className="top-nav-progress" style={{ flex: 1, maxWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 24px' }}>
              <div style={{ flex: 1, height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: accent, borderRadius: '2px' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: accent, flexShrink: 0 }}>{progressPct}%</span>
            </div>
            <DarkModeToggle />
          </motion.div>
          <div className="airtribe-bar" />
        </div>
      </div>

      {/* 3-column layout */}
      <div className="three-col-wrap" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
        <div className="three-col-grid" style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr) 240px', gap: '40px', alignItems: 'start', paddingTop: '36px' }}>

          <div className="left-col" style={{ alignSelf: 'stretch' }}>
            <LeftNav sections={sections} accent={accent} completedSections={completedSections} activeSection={activeSection} />
          </div>

          <motion.main initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={{ minWidth: 0 }}>
            {content}

            <AnimatePresence>
              {progressPct >= 80 && (
                <motion.div initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  style={{ padding: '40px 32px', background: 'var(--ed-card)', borderRadius: '10px', textAlign: 'center' as const, position: 'relative', overflow: 'hidden', marginBottom: '40px', border: '1px solid var(--ed-rule)', borderTop: `4px solid ${accent}` }}>
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '40px', marginBottom: '14px' }}>
                    {completionEmoji}
                  </motion.div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: 'var(--ed-ink)', fontFamily: "'Lora', 'Georgia', serif" }}>
                    Pre-Read {moduleNum} Complete
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '430px', margin: '0 auto 24px' }}>
                    {completionMessage}
                  </p>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onNext ?? onBack}
                    style={{ padding: '12px 28px', borderRadius: '6px', background: accent, color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                    {onNext ? `Next → ${nextLabel ?? 'Next Pre-read'}` : 'Back to Curriculum →'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ height: '60px' }} />
          </motion.main>

          <div className="right-col" style={{ alignSelf: 'stretch' }}>
            <Sidebar
              accent={accent} accentRgb={accentRgb}
              sections={sections} badges={badges} concepts={concepts}
              completedSections={completedSections} progressPct={progressPct}
              xp={xp} prevXp={prevXpRef.current}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import { SWEMentorFace } from './sweDesignSystem';
import { AirtribeLogo, DarkModeToggle } from './AirtribeBrand';

// ─── Constants ───
const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
const toRoman = (n: number) => ROMAN[n - 1] ?? String(n);

const SECTION_XP = 50;
const QUIZ_XP = 100;

const LEVELS = [
  { min: 600, label: 'Lead Engineer', color: '#7C3AED' },
  { min: 350, label: 'Senior Developer', color: '#2563EB' },
  { min: 150, label: 'Junior Dev', color: '#0F766E' },
  { min: 0,   label: 'Intern', color: 'var(--ed-ink3)' },
];

function getLevel(total: number) {
  for (const lvl of LEVELS) {
    if (total >= lvl.min) return lvl;
  }
  return LEVELS[LEVELS.length - 1];
}

function getNextLevel(total: number) {
  const idx = LEVELS.findIndex(l => l.min <= total);
  if (idx === 0) return null; // Max level
  return LEVELS[idx - 1];
}

function badgeLabel(label: string) {
  return label
    .replace(/&amp;/g, '&')
    .replace(/\s+—\s+.*$/, '')
    .replace(/:\s+.*$/, '');
}

// ─── Components ───

// AirtribeLogo imported from AirtribeBrand.tsx

// ─── Main Layout Component ───

export interface SWEPreReadLayoutProps {
  trackConfig: {
    name: string;
    accent: string;
    accentRgb: string;
    protagonist: string;
    role: string;
    company: string;
    mentor: string;
    mentorRole: string;
    mentorColor: string;
  };
  moduleLabel: string;
  title: string;
  sections: { id: string; label: string; icon?: string }[];
  completedModules: Set<string>;
  activeSection: string | null;
  onBack: () => void;
  hideArticleHeader?: boolean;
  hideHeaderStats?: boolean;
  /** Pass module-specific concepts for labeled concept mastery. Falls back to generic "Concept N" labels when omitted. */
  concepts?: { id: string; label: string; color?: string }[];
  children: React.ReactNode;
}

export default function SWEPreReadLayout({
  trackConfig, moduleLabel, title, sections, completedModules, activeSection, onBack, hideArticleHeader = false, hideHeaderStats = false, concepts, children
}: SWEPreReadLayoutProps) {
  const store = useLearnerStore();
  const [hydrated, setHydrated] = useState(false);
  
  // XP Calculations
  const xp = useMemo(() => {
    const readingXP = completedModules.size * SECTION_XP;
    const quizXP = Object.values(store.conceptStates)
      .reduce((sum, s) => sum + Math.round(s.pKnow * QUIZ_XP), 0);
    return { readingXP, quizXP, total: readingXP + quizXP };
  }, [completedModules, store.conceptStates]);

  const [totalXP, setTotalXP] = useState(0);
  const [showGain, setShowGain] = useState(false);
  const [gainAmt, setGainAmt] = useState(0);
  const prevXpRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    store.initSession();
    setHydrated(true);
    setTotalXP(xp.total);
    prevXpRef.current = xp.total;
    const check = () => setIsMobile(window.innerWidth < 860);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (hydrated && xp.total > prevXpRef.current) {
      setGainAmt(xp.total - prevXpRef.current);
      setShowGain(true);
      setTotalXP(xp.total);
      prevXpRef.current = xp.total;
      const t = setTimeout(() => setShowGain(false), 2000);
      return () => clearTimeout(t);
    }
  }, [xp.total, hydrated]);

  if (!hydrated) return <div style={{ minHeight: '100vh', background: 'var(--ed-cream)' }} />;

  const currentLevel = getLevel(totalXP);
  const nextLevel = getNextLevel(totalXP);
  const levelPct = nextLevel ? Math.round(((totalXP - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100) : 100;
  const progressPct = Math.round((completedModules.size / sections.length) * 100);
  const showHeaderStats = !hideHeaderStats;
  const unlockedCount = sections.filter(s => completedModules.has(s.id)).length;
  const latestUnlock = sections.slice().reverse().find(s => completedModules.has(s.id));

  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)', color: 'var(--ed-ink)' }}>
      {/* ─── Sticky Header ─── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--ed-cream)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--ed-rule)', transition: 'background 0.4s',
      }}>
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '11px', paddingBottom: '11px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
            <motion.button
              onClick={onBack} whileHover={{ opacity: 0.75 }} whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', cursor: 'pointer', flexShrink: 0 }}
            >
              <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>←</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)', fontFamily: "'JetBrains Mono', monospace" }}>Back</span>
            </motion.button>
            <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
            <AirtribeLogo />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '32px' }}>
            {showHeaderStats && !isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {sections.map((s, i) => (
                    <div key={i} style={{ width: '20px', height: '3px', borderRadius: '1.5px', background: completedModules.has(s.id) ? trackConfig.accent : 'var(--ed-rule)' }} />
                  ))}
                </div>
                <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.05em' }}>
                  MODULE PROGRESS · {progressPct}%
                </div>
              </div>
            )}
            {showHeaderStats && isMobile && (
              <div style={{ fontSize: '10px', fontWeight: 700, color: trackConfig.accent, fontFamily: "'JetBrains Mono', monospace" }}>
                {completedModules.size}/{sections.length}
              </div>
            )}
            
            {showHeaderStats && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', textTransform: 'uppercase' }}>XP Gain</div>
                  <div style={{ position: 'relative' }}>
                     <motion.div key={totalXP} animate={{ scale: [1.1, 1] }} style={{ fontSize: '18px', fontWeight: 900, color: trackConfig.accent, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{totalXP}</motion.div>
                     <AnimatePresence>
                       {showGain && (
                         <motion.div 
                           initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -25 }} exit={{ opacity: 0 }}
                           style={{ position: 'absolute', right: 0, top: -10, fontSize: '12px', fontWeight: 900, color: '#0D7A5A', fontFamily: "'JetBrains Mono', monospace" }}
                         >
                           +{gainAmt}
                         </motion.div>
                       )}
                     </AnimatePresence>
                  </div>
                </div>
              </div>
            )}
            <DarkModeToggle />
          </div>
        </motion.div>
        <div className="airtribe-bar" />
      </header>

      {/* ─── Main Content Grid (matches PM/GenAI three-col standard) ─── */}
      <div className="three-col-wrap" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
        <div className="three-col-grid" style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr) 240px', gap: '40px', alignItems: 'start', paddingTop: '36px' }}>

          {/* Left: Contents Nav */}
          <aside style={{ position: 'sticky', top: '80px', alignSelf: 'start', display: isMobile ? 'none' : 'block' }}>
            <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid var(--ed-rule)' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ed-ink3)', marginBottom: '10px' }}>Contents</div>
                <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div style={{ height: '100%', background: trackConfig.accent }} animate={{ width: `${progressPct}%` }} />
                </div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '8px', fontWeight: 600 }}>{progressPct}% · {completedModules.size}/{sections.length} parts</div>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {sections.map((s, i) => {
                  const done = completedModules.has(s.id);
                  const active = activeSection === s.id;
                  return (
                    <motion.button
                      key={s.id}
                      onClick={() => document.querySelector(`[data-section="${s.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                      whileHover={{ x: 2 }}
                      style={{
                        display: 'flex', alignItems: 'baseline', gap: '10px', width: '100%',
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '6px 0', textAlign: 'left' as const,
                        borderLeft: `2px solid ${active ? trackConfig.accent : 'transparent'}`,
                        paddingLeft: '8px', marginLeft: '-8px',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700,
                        color: done ? trackConfig.accent : active ? trackConfig.accent : 'var(--ed-rule)',
                        flexShrink: 0, minWidth: '20px', lineHeight: 1,
                      }}>
                        {done ? '✓' : `${toRoman(i + 1)}.`}
                      </span>
                      <span style={{
                        fontSize: '12px', fontWeight: active ? 600 : 400,
                        color: done ? 'var(--ed-ink2)' : active ? 'var(--ed-ink)' : 'var(--ed-ink3)',
                        lineHeight: 1.4, wordBreak: 'break-word' as const, transition: 'color 0.2s',
                      }}>
                        {s.label.split(':')[0]}{done ? ' ✓' : ''}
                      </span>
                    </motion.button>
                  );
                })}
              </nav>
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--ed-rule)', fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>
                {trackConfig.name === 'Python' ? 'Backend Python Track' : `SWE track · ${trackConfig.name}`}
              </div>
            </div>
          </aside>

          {/* Center: Main Article */}
          <main style={{ minWidth: 0 }}>
            {!hideArticleHeader && (
              <div style={{ marginBottom: '60px' }}>
                <div style={{ 
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, 
                  color: trackConfig.accent, letterSpacing: '0.15em', marginBottom: '20px', 
                  textTransform: 'uppercase' 
                }}>
                  {moduleLabel}
                </div>
                <h1 style={{ 
                  fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: 'var(--ed-ink)', 
                  lineHeight: 1.05, marginBottom: '28px', fontFamily: "'Lora', serif",
                  letterSpacing: '-0.03em' 
                }}>
                  {title}
                </h1>
                <div style={{ width: '60px', height: '4px', background: trackConfig.accent, borderRadius: '2px' }} />
              </div>
            )}

            {children}
          </main>

          {/* Right: Stats & Gamification */}
          <aside style={{ position: 'sticky', top: '100px', display: isMobile ? 'none' : 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* XP and Level Card */}
            <div style={{ 
              background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', 
              borderTop: `4px solid ${trackConfig.accent}`, borderRadius: '12px', 
              padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current Rank</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: currentLevel.color }}>{currentLevel.label}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total XP</div>
                  <motion.div key={totalXP} animate={{ scale: [1.1, 1] }} style={{ fontSize: '28px', fontWeight: 900, color: trackConfig.accent, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{totalXP}</motion.div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div style={{ flex: 1, padding: '8px 10px', background: 'var(--ed-cream)', borderRadius: '8px', border: '1px solid var(--ed-rule)' }}>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: 'var(--ed-ink3)', textTransform: 'uppercase', marginBottom: '2px' }}>Reading</div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: trackConfig.accent }}>{xp.readingXP} <span style={{ fontSize: '9px', fontWeight: 500 }}>xp</span></div>
                </div>
                <div style={{ flex: 1, padding: '8px 10px', background: 'var(--ed-cream)', borderRadius: '8px', border: '1px solid var(--ed-rule)' }}>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: 'var(--ed-ink3)', textTransform: 'uppercase', marginBottom: '2px' }}>Quizzes</div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#0D7A5A' }}>{xp.quizXP} <span style={{ fontSize: '9px', fontWeight: 500 }}>xp</span></div>
                </div>
              </div>

              {nextLevel ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)' }}>
                    <span>{levelPct}% to {nextLevel.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{nextLevel.min - totalXP} XP LEFT</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--ed-rule)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div animate={{ width: `${levelPct}%` }} style={{ height: '100%', background: trackConfig.accent }} />
                  </div>
                </>
              ) : (
                <div style={{ fontSize: '11px', fontWeight: 800, color: trackConfig.accent }}>✦ TOP RANK ACHIEVED</div>
              )}
            </div>

            {/* Badges card */}
            <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Badges</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: trackConfig.accent }}>{unlockedCount}/{sections.length}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px 8px' }}>
                {sections.map((s) => {
                  const done = completedModules.has(s.id);
                  const label = badgeLabel(s.label);
                  return (
                    <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: 0 }}>
                      <motion.div whileHover={{ scale: 1.08 }} title={done ? `${label}: completed` : 'Locked'} style={{ 
                      width: '38px', height: '38px', borderRadius: '9px', 
                      background: done ? `${trackConfig.accent}12` : 'var(--ed-cream)',
                      border: done ? `1.5px solid ${trackConfig.accent}44` : '1px solid var(--ed-rule)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px', filter: done ? 'none' : 'grayscale(1) opacity(0.3)',
                      transition: 'all 0.3s', cursor: 'default'
                    }}>
                      {s.icon ?? '✨'}
                    </motion.div>
                    <div style={{ fontSize: '8px', lineHeight: 1.2, fontWeight: 700, color: done ? 'var(--ed-ink3)' : 'transparent', textAlign: 'center', maxWidth: '50px', wordBreak: 'break-word' }}>
                      {label}
                    </div>
                  </div>
                  );
                })}
              </div>
              {latestUnlock && (
                <div style={{ marginTop: '14px', padding: '10px 12px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
                  <div style={{ fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>Latest</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', flexShrink: 0 }}>{latestUnlock.icon ?? '✨'}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--ed-ink)', lineHeight: 1.25 }}>{badgeLabel(latestUnlock.label)}</div>
                      <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.4 }}>Completed this checkpoint</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Concept Mastery card */}
            <div style={{ 
              background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', 
              borderLeft: `4px solid ${trackConfig.accent}`, borderRadius: '12px', 
              padding: '20px' 
            }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '18px' }}>Concept Mastery</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {concepts
                  ? concepts.map((c) => {
                      const state = store.conceptStates[c.id];
                      const pct = state ? Math.round(state.pKnow * 100) : 0;
                      const barColor = c.color ?? trackConfig.accent;
                      return (
                        <div key={c.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', fontWeight: 700 }}>
                            <span style={{ color: 'var(--ed-ink2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, maxWidth: '75%' }}>{c.label}</span>
                            <span style={{ color: barColor, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{pct}%</span>
                          </div>
                          <div style={{ height: '3px', background: 'var(--ed-rule)', borderRadius: '1.5px', overflow: 'hidden' }}>
                            <motion.div animate={{ width: `${pct}%` }} style={{ height: '100%', background: barColor }} />
                          </div>
                        </div>
                      );
                    })
                  : Object.entries(store.conceptStates).slice(0, 5).map(([id, state], i) => (
                      <div key={id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', fontWeight: 700 }}>
                          <span style={{ color: 'var(--ed-ink2)' }}>Concept {i + 1}</span>
                          <span style={{ color: trackConfig.accent, fontFamily: "'JetBrains Mono', monospace" }}>{Math.round(state.pKnow * 100)}%</span>
                        </div>
                        <div style={{ height: '3px', background: 'var(--ed-rule)', borderRadius: '1.5px', overflow: 'hidden' }}>
                          <motion.div animate={{ width: `${state.pKnow * 100}%` }} style={{ height: '100%', background: trackConfig.accent }} />
                        </div>
                      </div>
                    ))
                }
              </div>
            </div>

            {store.streakDays > 0 && (
              <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderLeft: '4px solid #C85A40', borderRadius: '12px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ fontSize: '22px', flexShrink: 0 }}>🔥</motion.span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#C85A40', lineHeight: 1 }}>{store.streakDays} day{store.streakDays !== 1 ? 's' : ''}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', marginTop: '3px' }}>learning streak</div>
                  </div>
                </div>
              </div>
            )}

          </aside>

        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import { SWEMentorFace } from './sweDesignSystem';
import { AirtribeLogo, DarkModeToggle } from './AirtribeBrand';

// ─── Constants ───
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
  children: React.ReactNode;
}

export default function SWEPreReadLayout({
  trackConfig, moduleLabel, title, sections, completedModules, activeSection, onBack, hideArticleHeader = false, hideHeaderStats = false, children
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
        position: 'sticky', top: 0, zIndex: 100, 
        background: 'var(--ed-cream)', opacity: 0.9, backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--ed-rule)', padding: '12px 0' 
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              onClick={onBack} 
              style={{ 
                background: 'none', border: 'none', cursor: 'pointer', 
                color: 'var(--ed-ink3)', fontSize: '11px', fontWeight: 700, 
                textTransform: 'uppercase', letterSpacing: '0.1em' 
              }}
            >
              ← Back
            </button>
            <div style={{ width: '1px', height: '16px', background: 'var(--ed-rule)' }} />
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
        </div>
      </header>

      {/* ─── Main Content Grid ─── */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr 260px', gap: isMobile ? '0' : '48px', alignItems: 'flex-start' }}>

          {/* Left: Contents Nav */}
          <aside style={{ position: 'sticky', top: '100px', display: isMobile ? 'none' : 'block' }}>
            <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid var(--ed-rule)' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ed-ink3)', marginBottom: '10px' }}>Contents</div>
                <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div style={{ height: '100%', background: trackConfig.accent }} animate={{ width: `${progressPct}%` }} />
                </div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '8px', fontWeight: 600 }}>{progressPct}% · {completedModules.size}/{sections.length} parts</div>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {sections.map((s, i) => {
                  const done = completedModules.has(s.id);
                  const active = activeSection === s.id;
                  return (
                    <motion.button
                      key={s.id}
                      onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
                      whileHover={{ x: 2 }}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '12px', width: '100%', 
                        background: active ? `${trackConfig.accent}08` : 'none', 
                        border: 'none', cursor: 'pointer', padding: '10px 12px', textAlign: 'left',
                        borderRadius: '6px', borderLeft: `3px solid ${active ? trackConfig.accent : 'transparent'}`,
                        transition: 'background 0.2s'
                      }}
                    >
                      <span style={{ 
                        fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, 
                        color: done || active ? trackConfig.accent : 'var(--ed-rule)', width: '20px' 
                      }}>
                        {done ? '✓' : (i + 1).toString().padStart(2, '0')}.
                      </span>
                      <span style={{ 
                        fontSize: '13px', fontWeight: active ? 700 : 500, 
                        color: done ? 'var(--ed-ink2)' : active ? 'var(--ed-ink)' : 'var(--ed-ink3)', 
                        lineHeight: 1.3 
                      }}>
                        {s.label}
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
                      {done ? (s.icon ?? '✨') : '🔒'}
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
                {Object.entries(store.conceptStates).slice(0, 5).map(([id, state], i) => (
                  <div key={id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', fontWeight: 700 }}>
                      <span style={{ color: 'var(--ed-ink2)' }}>Concept {i + 1}</span>
                      <span style={{ color: trackConfig.accent, fontFamily: "'JetBrains Mono', monospace" }}>{Math.round(state.pKnow * 100)}%</span>
                    </div>
                    <div style={{ height: '3px', background: 'var(--ed-rule)', borderRadius: '1.5px', overflow: 'hidden' }}>
                      <motion.div animate={{ width: `${state.pKnow * 100}%` }} style={{ height: '100%', background: trackConfig.accent }} />
                    </div>
                  </div>
                ))}
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

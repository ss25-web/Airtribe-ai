'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import type { Track } from './pm-fundamentals/designSystem';
import Track1ProblemDiscovery from './pm-fundamentals/Track1ProblemDiscovery';
import Track2ProblemDiscovery from './pm-fundamentals/Track2ProblemDiscovery';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const toRoman = (n: number) => ROMAN[n - 1] ?? String(n);

type TrackConfig = {
  accent: string;
  accentRgb: string;
  label: string;
  time: string;
  sections: { id: string; label: string }[];
  concepts: { id: string; label: string; color: string }[];
  achievements: { id: string; icon: string; label: string; desc: string }[];
};

const TRACK_CONFIG: Record<Track, TrackConfig> = {
  'new-pm': {
    accent: '#0097A7',
    accentRgb: '0,151,167',
    label: 'Problem Discovery',
    time: '45 min · 7 parts',
    sections: [
      { id: 'm2-discovery-mindset', label: 'Discovery Mindset' },
      { id: 'm2-customer-segments', label: 'Know Your Users' },
      { id: 'm2-research-methods', label: 'Research Methods' },
      { id: 'm2-interview', label: 'Run an Interview' },
      { id: 'm2-synthesis', label: 'Synthesize Insights' },
      { id: 'm2-problem-statement', label: 'Discovery Brief' },
      { id: 'm2-reflection', label: 'Final Reflection' },
    ],
    concepts: [
      { id: 'user-research', label: 'User Research', color: '#0097A7' },
      { id: 'customer-segments', label: 'Customer Segments', color: '#4F46E5' },
      { id: 'jtbd', label: 'Jobs to Be Done', color: '#7843EE' },
      { id: 'research-methods', label: 'Research Methods', color: '#C85A40' },
      { id: 'insight-synthesis', label: 'Insight Synthesis', color: '#158158' },
      { id: 'problem-framing', label: 'Problem Framing', color: '#B5720A' },
    ],
    achievements: [
      { id: 'm2-discovery-mindset', icon: '🔭', label: 'Discoverer', desc: 'Resisted the urge to build first' },
      { id: 'm2-customer-segments', icon: '👥', label: 'Segmenter', desc: 'Found the right users to research' },
      { id: 'm2-research-methods', icon: '🔬', label: 'Researcher', desc: 'Matched method to question' },
      { id: 'm2-interview', icon: '🎤', label: 'Interviewer', desc: 'Asked questions that got real answers' },
      { id: 'm2-synthesis', icon: '🗂️', label: 'Synthesizer', desc: 'Turned notes into insights' },
      { id: 'm2-problem-statement', icon: '📋', label: 'Briefed', desc: 'Wrote a crisp discovery brief' },
      { id: 'm2-reflection', icon: '🎯', label: 'Discoverer', desc: 'Completed the discovery loop' },
    ],
  },
  apm: {
    accent: '#7843EE',
    accentRgb: '120,67,238',
    label: 'Strategic Discovery',
    time: '50 min · 7 parts',
    sections: [
      { id: 'm2-discovery-mindset', label: 'Research Design' },
      { id: 'm2-customer-segments', label: 'Who to Research' },
      { id: 'm2-research-methods', label: 'Triangulating Evidence' },
      { id: 'm2-interview', label: 'Bias in the Room' },
      { id: 'm2-synthesis', label: 'Synthesis Under Uncertainty' },
      { id: 'm2-problem-statement', label: 'Strategic Brief' },
      { id: 'm2-reflection', label: 'Final Reflection' },
    ],
    concepts: [
      { id: 'user-research', label: 'Research Design', color: '#7843EE' },
      { id: 'customer-segments', label: 'Participant Selection', color: '#0097A7' },
      { id: 'jtbd', label: 'Jobs to Be Done', color: '#4F46E5' },
      { id: 'research-methods', label: 'Mixed Methods', color: '#C85A40' },
      { id: 'insight-synthesis', label: 'Synthesis', color: '#158158' },
      { id: 'problem-framing', label: 'Strategic Framing', color: '#B5720A' },
    ],
    achievements: [
      { id: 'm2-discovery-mindset', icon: '🧭', label: 'Designer', desc: 'Designed an unbiased research program' },
      { id: 'm2-customer-segments', icon: '🎯', label: 'Selector', desc: 'Chose the right participants' },
      { id: 'm2-research-methods', icon: '🔺', label: 'Triangulator', desc: 'Used multiple methods together' },
      { id: 'm2-interview', icon: '⚡', label: 'Bias-Buster', desc: 'Called out organizational bias' },
      { id: 'm2-synthesis', icon: '🗂️', label: 'Synthesizer', desc: 'Synthesized under uncertainty' },
      { id: 'm2-problem-statement', icon: '📋', label: 'Strategist', desc: 'Wrote a nuanced strategic brief' },
      { id: 'm2-reflection', icon: '🎯', label: 'Senior PM', desc: 'Completed strategic discovery' },
    ],
  },
};

const ALL_CONCEPT_IDS = ['user-research', 'customer-segments', 'jtbd', 'research-methods', 'insight-synthesis', 'problem-framing'];
const SECTION_XP = 50;
const MAX_QUIZ_XP_PER_CONCEPT = 100;

function computeXP(completedSections: Set<string>, conceptStates: Record<string, { pKnow: number }>) {
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = Object.values(conceptStates).reduce((sum, s) => sum + Math.round(s.pKnow * MAX_QUIZ_XP_PER_CONCEPT), 0);
  return { readingXP, quizXP, total: readingXP + quizXP };
}

const LEVELS = [
  { min: 0, label: 'Curious', color: 'var(--ed-ink3)' },
  { min: 150, label: 'Thinker', color: '#0097A7' },
  { min: 350, label: 'Practitioner', color: '#3A86FF' },
  { min: 600, label: 'PM-Minded', color: '#4F46E5' },
  { min: 850, label: 'PM Thinker', color: '#C85A40' },
];

function getLevel(xp: number) {
  let lvl = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.min) lvl = l;
  }
  return lvl;
}

function getNextLevel(xp: number) {
  const idx = LEVELS.findIndex(l => l.min > xp);
  return idx === -1 ? null : LEVELS[idx];
}

function AirtribeLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #7843EE 0%, #4F46E5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(120,67,238,0.3)' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 800, color: 'var(--ed-ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>Airtribe</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 600, color: 'var(--ed-ink3)', letterSpacing: '0.1em', lineHeight: 1, marginTop: '2px', textTransform: 'uppercase' as const }}>Learn</div>
      </div>
    </div>
  );
}

function LeftNav({
  track,
  sections,
  accent,
  completedSections,
  activeSection,
}: {
  track: Track;
  sections: { id: string; label: string }[];
  accent: string;
  completedSections: Set<string>;
  activeSection: string | null;
}) {
  const scrollTo = (id: string) => {
    document.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const donePct = Math.round((completedSections.size / sections.length) * 100);

  return (
    <aside style={{ position: 'sticky', top: '80px' }}>
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '18px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--ed-rule)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '8px' }}>Contents</div>
          <div style={{ height: '2px', background: 'var(--ed-rule)', borderRadius: '1px', overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', background: accent, borderRadius: '1px' }} animate={{ width: `${donePct}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '6px' }}>{donePct}% · {completedSections.size}/{sections.length} parts</div>
        </div>
        <nav>
          {sections.map((sec, idx) => {
            const done = completedSections.has(sec.id);
            const active = activeSection === sec.id && !done;
            return (
              <motion.button key={sec.id} onClick={() => scrollTo(sec.id)} whileHover={{ x: 2 }} style={{ display: 'flex', alignItems: 'baseline', gap: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', textAlign: 'left' as const, borderLeft: active ? `2px solid ${accent}` : '2px solid transparent', paddingLeft: '8px', marginLeft: '-8px', transition: 'border-color 0.2s' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: done ? accent : active ? accent : 'var(--ed-rule)', flexShrink: 0, minWidth: '20px', lineHeight: 1 }}>{toRoman(idx + 1)}.</span>
                <span style={{ fontSize: '12px', fontWeight: active ? 600 : 400, color: done ? 'var(--ed-ink2)' : active ? 'var(--ed-ink)' : 'var(--ed-ink3)', lineHeight: 1.4, wordBreak: 'break-word' as const, transition: 'color 0.2s' }}>
                  {sec.label}{done ? ' ✓' : ''}
                </span>
              </motion.button>
            );
          })}
        </nav>
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--ed-rule)' }}>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>
            {track === 'new-pm' ? "Following Priya's journey" : 'Advanced discovery track'}
          </div>
        </div>
      </div>
    </aside>
  );
}

function Sidebar({
  track,
  completedSections,
  progressPct,
  xp,
}: {
  track: Track;
  completedSections: Set<string>;
  progressPct: number;
  xp: { readingXP: number; quizXP: number; total: number };
}) {
  const store = useLearnerStore();
  const cfg = TRACK_CONFIG[track];
  const total = xp.total;
  const level = getLevel(total);
  const nextLevel = getNextLevel(total);
  const levelPct = nextLevel ? Math.round(((total - level.min) / (nextLevel.min - level.min)) * 100) : 100;

  const [showGain, setShowGain] = useState(false);
  const [gainAmt, setGainAmt] = useState(0);
  const gainRef = useRef(0);

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

  const unlockedCount = cfg.achievements.filter(a => completedSections.has(a.id)).length;
  const cardStyle: React.CSSProperties = { background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' };

  return (
    <aside style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
      <div style={{ ...cardStyle, borderTop: `3px solid ${cfg.accent}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px' }}>Level</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: level.color, whiteSpace: 'nowrap' as const }}>{level.label}</div>
          </div>
          <div style={{ textAlign: 'right' as const, position: 'relative', overflow: 'visible' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px' }}>XP</div>
            <motion.div key={total} animate={{ scale: [1.12, 1] }} transition={{ duration: 0.25 }} style={{ fontSize: '22px', fontWeight: 900, color: cfg.accent, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
              {total}
            </motion.div>
            <AnimatePresence>
              {showGain && (
                <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -20 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} style={{ position: 'absolute', right: 0, top: '-6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: '#0D7A5A', pointerEvents: 'none', whiteSpace: 'nowrap' as const }}>
                  +{gainAmt}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          {[{ label: 'Reading', val: xp.readingXP, color: cfg.accent }, { label: 'Quizzes', val: xp.quizXP, color: '#0D7A5A' }].map(b => (
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
              <motion.div animate={{ width: `${levelPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: cfg.accent, borderRadius: '2px' }} />
            </div>
          </>
        ) : (
          <div style={{ fontSize: '11px', color: cfg.accent, fontWeight: 700 }}>✦ Max level reached</div>
        )}
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)' }}>Module Progress</div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: cfg.accent }}>{progressPct}%</span>
        </div>
        <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: cfg.accent, borderRadius: '2px' }} />
        </div>
        <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--ed-ink3)' }}>
          {completedSections.size} of {cfg.sections.length} parts · {cfg.time}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)' }}>Badges</div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{unlockedCount}/{cfg.achievements.length}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', padding: '2px' }}>
          {cfg.achievements.map(a => {
            const unlocked = completedSections.has(a.id);
            return (
              <div key={a.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <motion.div whileHover={{ scale: 1.08 }} title={unlocked ? `${a.label}: ${a.desc}` : 'Locked'} style={{ width: '36px', height: '36px', borderRadius: '8px', background: unlocked ? `rgba(${cfg.accentRgb},0.12)` : 'var(--ed-cream)', border: `1px solid ${unlocked ? `rgba(${cfg.accentRgb},0.3)` : 'var(--ed-rule)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', filter: unlocked ? 'none' : 'grayscale(1) opacity(0.3)', transition: 'all 0.3s', cursor: 'default' }}>
                  {a.icon}
                </motion.div>
                <div style={{ fontSize: '8px', color: unlocked ? 'var(--ed-ink3)' : 'transparent', fontWeight: 600, textAlign: 'center' as const, maxWidth: '40px', lineHeight: 1.2, wordBreak: 'break-word' as const }}>
                  {a.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ ...cardStyle, borderLeft: `3px solid ${cfg.accent}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '10px' }}>Concept Mastery</div>
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
                  <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: c.color, borderRadius: '2px' }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>Complete quizzes to raise mastery scores</div>
      </div>

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

interface Props {
  track: Track;
  onBack: () => void;
}

export default function ProblemDiscoveryModule({ track, onBack }: Props) {
  const store = useLearnerStore();
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const cfg = TRACK_CONFIG[track];

  useEffect(() => {
    store.initSession();
    ALL_CONCEPT_IDS.forEach(id => store.ensureConceptState(id));
  }, [store]);

  useEffect(() => {
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

    return () => {
      clearTimeout(tid);
      sectionObserver.disconnect();
    };
  }, [store, track]);

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

    return () => {
      clearTimeout(tid);
      if (revealObserver) revealObserver.disconnect();
    };
  }, [track]);

  const progressPct = Math.round((completedSections.size / cfg.sections.length) * 100);
  const xp = computeXP(completedSections, store.conceptStates);

  return (
    <div className="editorial" style={{ background: 'var(--ed-cream)', minHeight: '100vh', transition: 'background 0.4s, color 0.4s' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', backdropFilter: 'blur(12px)', transition: 'background 0.4s' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
              <AirtribeLogo />
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>Module 02</span>
                <span style={{ color: 'var(--ed-rule)', fontSize: '12px' }}>›</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink2)' }}>{cfg.label}</span>
              </div>
            </div>

            <div className="top-nav-progress" style={{ flex: 1, maxWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 24px' }}>
              <div style={{ flex: 1, height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: cfg.accent, borderRadius: '2px' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: cfg.accent, flexShrink: 0 }}>{progressPct}%</span>
            </div>

            <motion.button whileHover={{ opacity: 0.75 }} whileTap={{ scale: 0.97 }} onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', cursor: 'pointer' }}>
              <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>←</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)', fontFamily: "'JetBrains Mono', monospace" }}>Curriculum</span>
            </motion.button>
          </motion.div>
          <div className="airtribe-bar" />
        </div>
      </div>

      <div className="three-col-wrap" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
        <div className="three-col-grid" style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr) 240px', gap: '40px', alignItems: 'start', paddingTop: '36px' }}>
          <div className="left-col" style={{ alignSelf: 'stretch' }}>
            <LeftNav track={track} sections={cfg.sections} accent={cfg.accent} completedSections={completedSections} activeSection={activeSection} />
          </div>

          <motion.main key={track} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={{ minWidth: 0 }}>
            {track === 'new-pm' ? <Track1ProblemDiscovery /> : <Track2ProblemDiscovery />}

            <AnimatePresence>
              {progressPct >= 87 && (
                <motion.div initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} style={{ padding: '40px 32px', background: 'var(--ed-card)', borderRadius: '10px', textAlign: 'center' as const, position: 'relative', overflow: 'hidden', marginBottom: '40px', border: '1px solid var(--ed-rule)', borderTop: `4px solid ${cfg.accent}` }}>
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '40px', marginBottom: '14px' }}>🔭</motion.div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: 'var(--ed-ink)', fontFamily: "'Lora', 'Georgia', serif" }}>Module 02 Complete</h3>
                  <p style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '400px', margin: '0 auto 24px' }}>
                    {track === 'new-pm'
                      ? 'You followed Priya through the full discovery loop. Symptom → Research → Insight → Brief. That sequence never changes.'
                      : 'You scoped the right enterprise segment, surfaced the hard blockers, and turned nuanced research into a decision leadership could actually use.'}
                  </p>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onBack} style={{ padding: '12px 28px', borderRadius: '6px', background: cfg.accent, color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                    Back to Curriculum →
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ height: '60px' }} />
          </motion.main>

          <div className="right-col" style={{ alignSelf: 'stretch' }}>
            <Sidebar track={track} completedSections={completedSections} progressPct={progressPct} xp={xp} />
          </div>
        </div>
      </div>
    </div>
  );
}

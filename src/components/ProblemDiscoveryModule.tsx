'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import type { Track } from './pm-fundamentals/designSystem';
import Track1ProblemDiscovery from './pm-fundamentals/Track1ProblemDiscovery';
import Track2ProblemDiscovery from './pm-fundamentals/Track2ProblemDiscovery';

const TRACK_CONFIG = {
  'new-pm': {
    accent: '#0097A7',
    accentRgb: '0,151,167',
    label: 'Problem Discovery',
    sublabel: "Priya's first full discovery loop",
    emoji: '🔎',
    time: '45 min · 7 parts',
    sections: [
      { id: 'm2-discovery-mindset', label: 'Discovery Mindset', cue: 'Start with the problem, not the fix' },
      { id: 'm2-customer-segments', label: 'Know Your Users', cue: 'Talk to the right people' },
      { id: 'm2-research-methods', label: 'Research Methods', cue: 'Match method to question' },
      { id: 'm2-interview', label: 'Run an Interview', cue: 'Get to the real why' },
      { id: 'm2-synthesis', label: 'Synthesize Insights', cue: 'Turn notes into patterns' },
      { id: 'm2-problem-statement', label: 'Discovery Brief', cue: 'Frame the real problem' },
      { id: 'm2-reflection', label: 'Final Reflection', cue: 'Close the loop' },
    ],
    concepts: [
      { id: 'user-research', label: 'User Research', color: '#0097A7' },
      { id: 'customer-segments', label: 'Customer Segments', color: '#4F46E5' },
      { id: 'jtbd', label: 'Jobs to Be Done', color: '#7843EE' },
      { id: 'research-methods', label: 'Research Methods', color: '#C85A40' },
      { id: 'insight-synthesis', label: 'Insight Synthesis', color: '#158158' },
      { id: 'problem-framing', label: 'Problem Framing', color: '#B5720A' },
    ],
    badges: [
      { id: 'm2-discovery-mindset', icon: '🔭', label: 'Discoverer' },
      { id: 'm2-customer-segments', icon: '👥', label: 'Segmenter' },
      { id: 'm2-research-methods', icon: '🔬', label: 'Researcher' },
      { id: 'm2-interview', icon: '🎤', label: 'Interviewer' },
      { id: 'm2-synthesis', icon: '🗂️', label: 'Synthesizer' },
      { id: 'm2-problem-statement', icon: '📋', label: 'Briefed' },
      { id: 'm2-reflection', icon: '🎯', label: 'Loop Closed' },
    ],
    completion: 'You followed Priya through the full discovery loop. Symptom to research to insight to brief.',
  },
  apm: {
    accent: '#7843EE',
    accentRgb: '120,67,238',
    label: 'Strategic Discovery',
    sublabel: 'Advanced PM track for ambiguous bets',
    emoji: '⚡',
    time: '50 min · 7 parts',
    sections: [
      { id: 'm2-discovery-mindset', label: 'Bias-Resistant Discovery', cue: 'Design research that can say no' },
      { id: 'm2-customer-segments', label: 'Decision-Maker Map', cue: 'Enterprise has multiple customers' },
      { id: 'm2-research-methods', label: 'Mixed-Methods Plan', cue: 'Triangulate across sources' },
      { id: 'm2-interview', label: 'Signal-Rich Interviews', cue: 'Separate excitement from readiness' },
      { id: 'm2-synthesis', label: 'Confidence & Tradeoffs', cue: 'State what is true and how sure you are' },
      { id: 'm2-problem-statement', label: 'Strategic Brief', cue: 'Recommend a path, not a shrug' },
      { id: 'm2-reflection', label: 'Operating Lesson', cue: 'Hold the line with evidence' },
    ],
    concepts: [
      { id: 'user-research', label: 'Bias-Resistant Research', color: '#7843EE' },
      { id: 'customer-segments', label: 'Enterprise Segmentation', color: '#3A86FF' },
      { id: 'jtbd', label: 'Buyer/User/JTBD', color: '#0097A7' },
      { id: 'research-methods', label: 'Method Triangulation', color: '#C85A40' },
      { id: 'insight-synthesis', label: 'Confidence Signaling', color: '#158158' },
      { id: 'problem-framing', label: 'Strategic Framing', color: '#B5720A' },
    ],
    badges: [
      { id: 'm2-discovery-mindset', icon: '🧭', label: 'Truth Seeker' },
      { id: 'm2-customer-segments', icon: '🏢', label: 'Coalition Mapper' },
      { id: 'm2-research-methods', icon: '🧪', label: 'Triangulator' },
      { id: 'm2-interview', icon: '🎙️', label: 'Signal Hunter' },
      { id: 'm2-synthesis', icon: '📶', label: 'Confidence Caller' },
      { id: 'm2-problem-statement', icon: '📝', label: 'Strategy Writer' },
      { id: 'm2-reflection', icon: '🛡️', label: 'Decision Guard' },
    ],
    completion:
      'You navigated discovery under pressure: multiple stakeholders, conflicting evidence, and a recommendation leadership can actually use.',
  },
} satisfies Record<Track, {
  accent: string; accentRgb: string; label: string; sublabel: string; emoji: string; time: string;
  sections: { id: string; label: string; cue: string }[];
  concepts: { id: string; label: string; color: string }[];
  badges: { id: string; icon: string; label: string }[];
  completion: string;
}>;

const ALL_CONCEPT_IDS = ['user-research', 'customer-segments', 'jtbd', 'research-methods', 'insight-synthesis', 'problem-framing'];
const LEVELS = [
  { min: 0, label: 'Curious', color: 'var(--ed-ink3)' },
  { min: 150, label: 'Thinker', color: '#0097A7' },
  { min: 350, label: 'Practitioner', color: '#3A86FF' },
  { min: 600, label: 'PM-Minded', color: '#4F46E5' },
  { min: 850, label: 'PM Thinker', color: '#C85A40' },
];

const getLevel = (xp: number) => LEVELS.reduce((curr, item) => (xp >= item.min ? item : curr), LEVELS[0]);
const getNextLevel = (xp: number) => LEVELS.find((item) => item.min > xp) ?? null;
const computeXP = (completedSections: Set<string>, conceptStates: Record<string, { pKnow: number }>) => ({
  readingXP: completedSections.size * 50,
  quizXP: Object.values(conceptStates).reduce((sum, state) => sum + Math.round(state.pKnow * 100), 0),
  total: completedSections.size * 50 + Object.values(conceptStates).reduce((sum, state) => sum + Math.round(state.pKnow * 100), 0),
});

function AirtribeLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #7843EE 0%, #4F46E5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 800, color: 'var(--ed-ink)', lineHeight: 1 }}>Airtribe</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 600, color: 'var(--ed-ink3)', lineHeight: 1, marginTop: '2px', textTransform: 'uppercase' as const }}>Learn</div>
      </div>
    </div>
  );
}

function LeftNav({ cfg, completedSections, activeSection }: { cfg: (typeof TRACK_CONFIG)[Track]; completedSections: Set<string>; activeSection: string | null }) {
  const donePct = Math.round((completedSections.size / cfg.sections.length) * 100);
  const scrollTo = (id: string) => document.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <aside style={{ position: 'sticky', top: '80px' }}>
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '18px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--ed-rule)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '8px' }}>Contents</div>
          <div style={{ height: '2px', background: 'var(--ed-rule)', borderRadius: '1px', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${donePct}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: cfg.accent }} />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '6px' }}>{donePct}% · {completedSections.size}/{cfg.sections.length} parts</div>
        </div>
        <nav>
          {cfg.sections.map((section, index) => {
            const done = completedSections.has(section.id);
            const active = activeSection === section.id && !done;
            return (
              <motion.button key={section.id} onClick={() => scrollTo(section.id)} whileHover={{ x: 2 }} style={{ display: 'flex', alignItems: 'baseline', gap: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', textAlign: 'left' as const, borderLeft: active ? `2px solid ${cfg.accent}` : '2px solid transparent', paddingLeft: '8px', marginLeft: '-8px' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: done || active ? cfg.accent : 'var(--ed-rule)', minWidth: '20px' }}>{['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][index]}.</span>
                <span style={{ fontSize: '12px', fontWeight: active ? 600 : 400, color: done ? 'var(--ed-ink2)' : active ? 'var(--ed-ink)' : 'var(--ed-ink3)', lineHeight: 1.4 }}>{section.label}{done ? ' ✓' : ''}</span>
              </motion.button>
            );
          })}
        </nav>
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--ed-rule)', fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{cfg.sublabel}</div>
      </div>
    </aside>
  );
}

function Sidebar({ cfg, completedSections, activeSection, progressPct, xp }: { cfg: (typeof TRACK_CONFIG)[Track]; completedSections: Set<string>; activeSection: string | null; progressPct: number; xp: { readingXP: number; quizXP: number; total: number } }) {
  const store = useLearnerStore();
  const level = getLevel(xp.total);
  const nextLevel = getNextLevel(xp.total);
  const focus = cfg.sections.find((item) => item.id === activeSection) ?? cfg.sections[0];
  const [showGain, setShowGain] = useState(false);
  const [gainAmt, setGainAmt] = useState(0);
  const gainRef = useRef(0);

  useEffect(() => {
    const diff = xp.total - gainRef.current;
    if (diff > 0) {
      setGainAmt(diff);
      setShowGain(true);
      gainRef.current = xp.total;
      const timer = setTimeout(() => setShowGain(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [xp.total]);

  const card: React.CSSProperties = { background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' };

  return (
    <aside style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
      <div style={{ ...card, borderTop: `3px solid ${cfg.accent}`, background: `linear-gradient(180deg, rgba(${cfg.accentRgb},0.08) 0%, var(--ed-card) 48%)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px' }}>Level</div><div style={{ fontSize: '14px', fontWeight: 800, color: level.color }}>{level.label}</div></div>
          <div style={{ textAlign: 'right' as const, position: 'relative' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px' }}>XP</div>
            <motion.div key={xp.total} animate={{ scale: [1.12, 1] }} transition={{ duration: 0.25 }} style={{ fontSize: '22px', fontWeight: 900, color: cfg.accent, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{xp.total}</motion.div>
            <AnimatePresence>{showGain && <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -20 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} style={{ position: 'absolute', right: 0, top: '-6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: '#0D7A5A' }}>+{gainAmt}</motion.div>}</AnimatePresence>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          {[{ label: 'Reading', val: xp.readingXP, color: cfg.accent }, { label: 'Quizzes', val: xp.quizXP, color: '#0D7A5A' }].map((item) => (
            <div key={item.label} style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
              <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', textTransform: 'uppercase' as const }}>{item.label}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: item.color }}>{item.val} xp</div>
            </div>
          ))}
        </div>
        {nextLevel && <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{nextLevel.min - xp.total} xp to {nextLevel.label}</div>}
      </div>

      <div style={card}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: cfg.accent, marginBottom: '8px' }}>Current Focus</div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '4px' }}>{focus.label}</div>
        <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>{focus.cue}</div>
      </div>

      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)' }}>Module Progress</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: cfg.accent }}>{progressPct}%</div></div>
        <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}><motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: cfg.accent }} /></div>
        <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--ed-ink3)' }}>{completedSections.size} of {cfg.sections.length} parts · {cfg.time}</div>
      </div>

      <div style={card}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {cfg.badges.map((badge) => {
            const unlocked = completedSections.has(badge.id);
            return (
              <div key={badge.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: unlocked ? `rgba(${cfg.accentRgb},0.12)` : 'var(--ed-cream)', border: `1px solid ${unlocked ? `rgba(${cfg.accentRgb},0.3)` : 'var(--ed-rule)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', filter: unlocked ? 'none' : 'grayscale(1) opacity(0.3)' }}>{badge.icon}</div>
                <div style={{ fontSize: '8px', color: unlocked ? 'var(--ed-ink3)' : 'transparent', textAlign: 'center' as const, lineHeight: 1.2 }}>{badge.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ ...card, borderLeft: `3px solid ${cfg.accent}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: cfg.accent, marginBottom: '10px' }}>Concept Mastery</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {cfg.concepts.map((concept) => {
            const state = store.conceptStates[concept.id];
            const pct = state ? Math.round(state.pKnow * 100) : 0;
            return (
              <div key={concept.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '4px' }}><span style={{ fontSize: '11px', color: 'var(--ed-ink2)' }}>{concept.label}</span><span style={{ fontSize: '10px', color: pct > 0 ? concept.color : 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{pct}%</span></div>
                <div style={{ height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}><motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: concept.color }} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

interface Props { track: Track; onBack: () => void; }

export default function ProblemDiscoveryModule({ track, onBack }: Props) {
  const store = useLearnerStore();
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const cfg = useMemo(() => TRACK_CONFIG[track], [track]);

  useEffect(() => { store.initSession(); ALL_CONCEPT_IDS.forEach((id) => store.ensureConceptState(id)); }, [store]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('data-section');
        if (!id) return;
        if (entry.isIntersecting) {
          if (entry.intersectionRatio >= 0.1) setActiveSection(id);
          if (entry.intersectionRatio >= 0.25) {
            setCompletedSections((prev) => new Set([...prev, id]));
            store.markSectionViewed(id);
          }
        }
      });
    }, { threshold: [0.1, 0.25, 0.5] });
    const timer = setTimeout(() => document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el)), 150);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [track, store]);

  useEffect(() => {
    let revealObserver: IntersectionObserver | undefined;
    const timer = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll('.rv,.rvl,.rvr'));
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver?.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
      elements.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) setTimeout(() => el.classList.add('in'), Math.min(idx, 6) * 60);
        else revealObserver?.observe(el);
      });
    }, 200);
    return () => { clearTimeout(timer); revealObserver?.disconnect(); };
  }, [track]);

  const progressPct = Math.round((completedSections.size / cfg.sections.length) * 100);
  const xp = computeXP(completedSections, store.conceptStates);

  return (
    <div className="editorial" style={{ background: 'var(--ed-cream)', minHeight: '100vh' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', backdropFilter: 'blur(12px)' }}>
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
            <div className="top-nav-progress" style={{ flex: 1, maxWidth: '260px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 24px' }}>
              <div style={{ flex: 1, height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}><motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: cfg.accent }} /></div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: cfg.accent }}>{progressPct}%</span>
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
          <div className="left-col"><LeftNav cfg={cfg} completedSections={completedSections} activeSection={activeSection} /></div>
          <AnimatePresence mode="wait">
            <motion.main key={track} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3 }} style={{ minWidth: 0 }}>
              {track === 'new-pm' ? <Track1ProblemDiscovery /> : <Track2ProblemDiscovery />}
              <AnimatePresence>
                {progressPct >= 87 && (
                  <motion.div initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} style={{ padding: '40px 32px', background: 'var(--ed-card)', borderRadius: '10px', textAlign: 'center' as const, marginBottom: '40px', border: '1px solid var(--ed-rule)', borderTop: `4px solid ${cfg.accent}` }}>
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '40px', marginBottom: '14px' }}>{cfg.emoji}</motion.div>
                    <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: 'var(--ed-ink)', fontFamily: "'Lora', 'Georgia', serif" }}>{cfg.label} Complete</h3>
                    <p style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '460px', margin: '0 auto 24px' }}>{cfg.completion}</p>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onBack} style={{ padding: '12px 28px', borderRadius: '6px', background: cfg.accent, color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Back to Curriculum →</motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div style={{ height: '60px' }} />
            </motion.main>
          </AnimatePresence>
          <div className="right-col"><Sidebar cfg={cfg} completedSections={completedSections} activeSection={activeSection} progressPct={progressPct} xp={xp} /></div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  glassCard, demoLabel, chLabel, h2, para, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, ApplyItBox, PMPrincipleBox, NextChapterTeaser,
  TiltCard, ConversationScene,
} from './designSystem';
import { MentorFace } from './MentorFaces';

// Local helper for rich-content boxes
const InfoBox = ({ title, accent = 'var(--teal)', children }: { title: string; accent?: string; children: React.ReactNode }) => (
  <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', margin: '24px 0', border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${accent}` }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: accent, marginBottom: '14px' }}>{title}</div>
    {children}
  </div>
);

// Tool badge
const ToolBadge = ({ name, desc, accent = 'var(--teal)' }: { name: string; desc: string; accent?: string }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '8px', background: 'var(--ed-card)', border: `1px solid var(--ed-rule)`, borderLeft: `3px solid ${accent}`, margin: '4px 0' }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: accent, letterSpacing: '0.08em' }}>{name}</div>
    <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{desc}</div>
  </div>
);



// ─────────────────────────────────────────
// NOTION AFFINITY BOARD
// ─────────────────────────────────────────
const NotionAffinityBoard = () => {
  type ThemeId = 'no-next-step' | 'no-good-looks' | 'prove-value';
  const notes = [
    { id: 'n1', text: 'Completed setup fine — no friction with onboarding' },
    { id: 'n2', text: 'Opened dashboard, did not know what to do next' },
    { id: 'n3', text: '"I did not know what I was supposed to do with the recordings"' },
    { id: 'n4', text: 'No feedback on whether coaching sessions were working' },
    { id: 'n5', text: '"I could not tell if 7 out of 10 was good or not"' },
    { id: 'n6', text: 'Director asks every quarter if coaching is worth the investment' },
    { id: 'n7', text: '"I churned because I was flying blind the whole time"' },
    { id: 'n8', text: 'Wanted the product to show them what good looks like' },
  ];
  const themes: { id: ThemeId; label: string; color: string }[] = [
    { id: 'no-next-step', label: 'No clear next step', color: '#0097A7' },
    { id: 'no-good-looks', label: "Doesn't know what good looks like", color: '#7C3AED' },
    { id: 'prove-value', label: 'Job: prove coaching works', color: '#C85A40' },
  ];
  const [assignments, setAssignments] = useState<Record<string, ThemeId>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const unassigned = notes.filter(n => !assignments[n.id]);
  return (
    <TiltCard style={{ margin: '24px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E0D9D0', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', background: '#fff' }}>
        <div style={{ background: '#F7F6F3', borderBottom: '1px solid #E0D9D0', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ fontSize: '11px', color: '#999', fontFamily: 'monospace', background: '#EDEDEC', padding: '3px 12px', borderRadius: '5px' }}>
              affinity-map.notion · EdSpark Manager Research
            </div>
          </div>
          <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#0097A7' }}>{Object.keys(assignments).length}/{notes.length} placed</div>
        </div>
        <div style={{ padding: '8px 18px', background: 'rgba(0,151,167,0.05)', borderBottom: '1px solid #E0D9D0', fontSize: '11px', color: '#0097A7' }}>
          Select an observation, then assign it to a theme. This is how Priya groups findings after interviews in Notion.
        </div>
        <div style={{ display: 'flex', minHeight: '320px' }}>
          <div style={{ width: '230px', borderRight: '1px solid #E0D9D0', padding: '14px 12px', flexShrink: 0, background: '#FAFAFA' }}>
            <div style={{ fontSize: '8px', fontFamily: 'monospace', color: '#999', letterSpacing: '0.1em', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span>INTERVIEW NOTES</span>
              <span>{unassigned.length} remaining</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {unassigned.map(note => (
                <button
                  key={note.id}
                  onClick={() => setSelected(selected === note.id ? null : note.id)}
                  style={{
                    padding: '9px 11px', borderRadius: '6px', textAlign: 'left',
                    background: selected === note.id ? 'rgba(0,151,167,0.1)' : '#fff',
                    border: `1.5px solid ${selected === note.id ? '#0097A7' : '#E0D9D0'}`,
                    cursor: 'pointer', fontSize: '11px', color: '#37352F', lineHeight: 1.5,
                    boxShadow: selected === note.id ? '0 2px 8px rgba(0,151,167,0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  {note.text}
                </button>
              ))}
              {unassigned.length === 0 && (
                <div style={{ fontSize: '11px', color: '#0097A7', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>All observations placed</div>
              )}
            </div>
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ marginTop: '12px', padding: '10px', borderRadius: '8px', background: '#fff', border: '1.5px solid #0097A7' }}
                >
                  <div style={{ fontSize: '8px', fontFamily: 'monospace', color: '#0097A7', letterSpacing: '0.1em', marginBottom: '8px' }}>ASSIGN TO THEME</div>
                  {themes.map(theme => (
                    <motion.button
                      key={theme.id}
                      whileHover={{ x: 3 }}
                      onClick={() => {
                        const sel = selected;
                        if (sel) { setAssignments(prev => ({ ...prev, [sel]: theme.id })); setSelected(null); }
                      }}
                      style={{ display: 'block', width: '100%', padding: '7px 10px', marginBottom: '4px', borderRadius: '5px', border: 'none', background: `${theme.color}18`, cursor: 'pointer', textAlign: 'left', fontSize: '10px', fontWeight: 600, color: theme.color }}
                    >
                      {'→'} {theme.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {themes.map((theme, ti) => {
              const themeNotes = notes.filter(n => assignments[n.id] === theme.id);
              const isFinding = themeNotes.length >= 3;
              return (
                <div key={theme.id} style={{ borderRight: ti < 2 ? '1px solid #E0D9D0' : 'none', padding: '12px', background: themeNotes.length > 0 ? `${theme.color}06` : '#fff' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '9px', fontFamily: 'monospace', fontWeight: 700, color: theme.color, letterSpacing: '0.06em', marginBottom: '4px' }}>{theme.label.toUpperCase()}</div>
                    {isFinding && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ fontSize: '8px', background: theme.color, color: '#fff', padding: '2px 6px', borderRadius: '3px', display: 'inline-block', fontWeight: 700 }}>
                        FINDING &middot; {themeNotes.length}
                      </motion.div>
                    )}
                  </div>
                  <AnimatePresence>
                    {themeNotes.map(note => (
                      <motion.div key={note.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '8px 10px', borderRadius: '6px', background: '#fff', border: `1px solid ${theme.color}33`, marginBottom: '6px', fontSize: '10px', color: '#37352F', lineHeight: 1.5, boxShadow: `0 1px 4px ${theme.color}15` }}>
                        {note.text}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {themeNotes.length === 0 && (
                    <div style={{ height: '50px', borderRadius: '6px', border: `1.5px dashed ${theme.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: `${theme.color}70` }}>
                      place notes here
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// KRAFTFUL ANALYZER
// ─────────────────────────────────────────
const KraftfulAnalyzer = () => {
  const [phase, setPhase] = useState<'raw' | 'loading' | 'clustered'>('raw');
  const [loadingPct, setLoadingPct] = useState(0);
  const [expandedCluster, setExpandedCluster] = useState<number | null>(null);
  const tickets = [
    { id: 1, text: 'Setup was fine, but I opened the dashboard and just sat there. What was I supposed to do?', from: 'Rahul S. · Sales Manager' },
    { id: 2, text: 'I uploaded 3 recordings. Nothing changed. I have no idea if the AI is analysing them or if I did something wrong.', from: 'Support #4821' },
    { id: 3, text: 'Is there a way to see if coaching is actually improving? I cannot tell if the number going up means anything real.', from: 'Support #5103' },
    { id: 4, text: 'I got charged twice this month. Please refund one payment.', from: 'Support #4996' },
    { id: 5, text: 'I do not know what a good coaching score looks like. Is 7 out of 10 good? What should I be aiming for?', from: 'Kavita R. · Sales Director' },
    { id: 6, text: 'I invited 4 reps last week. None of them have uploaded anything yet. How do I get them started?', from: 'Support #5267' },
    { id: 7, text: 'I cannot figure out how to export data to Excel. Is that on the roadmap?', from: 'Support #5312' },
    { id: 8, text: 'My director asked me to show the ROI of this tool. I have no idea where to find that number.', from: 'Support #5089' },
  ];
  const clusters = [
    {
      label: 'No sense of progress or proof',
      color: '#00BCD4', pct: 50, ticketIds: [2, 3, 5, 8],
      summary: 'Users complete setup but cannot tell if the product is working. No progress signal, no benchmark, no ROI view.',
    },
    {
      label: "Doesn't know what to do next",
      color: '#7C3AED', pct: 25, ticketIds: [1, 6],
      summary: 'After onboarding, users stall at the dashboard. No clear first action is surfaced.',
    },
    {
      label: 'Billing and feature requests',
      color: '#8A8580', pct: 25, ticketIds: [4, 7],
      summary: 'Billing error and missing export feature. Different investigation tracks from the core churn problem.',
    },
  ];
  const handleAnalyze = () => {
    setPhase('loading');
    setLoadingPct(0);
    const steps = [12, 28, 44, 60, 73, 83, 91, 97, 100];
    steps.forEach((pct, i) => {
      setTimeout(() => {
        setLoadingPct(pct);
        if (pct === 100) setTimeout(() => setPhase('clustered'), 350);
      }, i * 160 + 80);
    });
  };
  return (
    <TiltCard style={{ margin: '24px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #1E3A3F', boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}>
        <div style={{ background: '#0D1F24', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57', '#FFBD2E', '#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#00BCD4', letterSpacing: '0.1em' }}>KRAFTFUL</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>/ EdSpark &middot; Support tickets &middot; Last 90 days</div>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>8 tickets loaded</div>
        </div>
        <div style={{ background: '#111C1F', padding: '20px 24px' }}>
          <AnimatePresence mode="wait">
            {phase === 'raw' && (
              <motion.div key="raw" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: '14px' }}>RAW TICKETS &middot; UNANALYSED &middot; 8 total</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {tickets.map(t => (
                    <div key={t.id} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: '4px' }}>{t.text}</div>
                      <div style={{ fontSize: '9px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)' }}>{t.from}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAnalyze}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, #00BCD4, #0097A7)', border: 'none', cursor: 'pointer', color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em' }}
                >
                  CLUSTER WITH AI
                </button>
              </motion.div>
            )}
            {phase === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00BCD4', marginBottom: '20px', letterSpacing: '0.08em' }}>Analysing patterns across feedback...</div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
                    <motion.div animate={{ width: `${loadingPct}%` }} transition={{ duration: 0.15 }} style={{ height: '100%', background: '#00BCD4', borderRadius: '2px' }} />
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{loadingPct}% &middot; identifying theme clusters</div>
                </div>
              </motion.div>
            )}
            {phase === 'clustered' && (
              <motion.div key="clustered" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}>THEME CLUSTERS &middot; click to see raw tickets</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#00BCD4' }}>8 tickets &middot; 3 clusters</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                  {clusters.map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                      <button
                        onClick={() => setExpandedCluster(expandedCluster === i ? null : i)}
                        style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <div style={{ padding: '12px 16px', borderRadius: expandedCluster === i ? '8px 8px 0 0' : '8px', background: expandedCluster === i ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${expandedCluster === i ? c.color + '55' : 'rgba(255,255,255,0.08)'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: i === 0 ? 600 : 400 }}>{c.label}</span>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{c.ticketIds.length} tickets</span>
                              <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: c.color }}>{c.pct}%</span>
                              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>{expandedCluster === i ? '▲' : '▼'}</span>
                            </div>
                          </div>
                          <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${c.pct}%`, background: c.color, borderRadius: '2px', opacity: 0.85 }} />
                          </div>
                        </div>
                      </button>
                      <AnimatePresence>
                        {expandedCluster === i && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '12px 16px 14px', borderRadius: '0 0 8px 8px', background: 'rgba(255,255,255,0.025)', border: `1px solid ${c.color}40`, borderTop: 'none' }}>
                              <div style={{ fontSize: '9px', fontFamily: 'monospace', color: c.color, letterSpacing: '0.08em', marginBottom: '6px' }}>CLUSTER SUMMARY</div>
                              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '12px' }}>{c.summary}</div>
                              <div style={{ fontSize: '9px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '6px' }}>RAW TICKETS</div>
                              {c.ticketIds.map(tid => {
                                const t = tickets.find(tk => tk.id === tid);
                                if (!t) return null;
                                return (
                                  <div key={tid} style={{ padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '4px' }}>
                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '2px' }}>{t.text}</div>
                                    <div style={{ fontSize: '8px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>{t.from}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,188,212,0.08)', border: '1px solid rgba(0,188,212,0.2)' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#00BCD4', letterSpacing: '0.1em', marginBottom: '4px' }}>KIRAN&apos;S NOTE</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                    These are users who cared enough to write in. Silent churners have the same problems but you are not seeing them here. Use these clusters to sharpen interview hypotheses, not to replace talking to users.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// DOVETAIL TAGGING SESSION
// ─────────────────────────────────────────
const DovetailTaggingSession = () => {
  const transcript = [
    { id: 0, speaker: 'Priya', text: 'Tell me what happened when you first signed up for EdSpark.', isQuestion: true },
    { id: 1, speaker: 'Rahul', text: 'Setup was quick — maybe 20 minutes. Uploaded my first session recording. No problems there.', isQuestion: false },
    { id: 2, speaker: 'Rahul', text: 'But then I opened the dashboard and I just... sat there. I did not know what I was supposed to do next.', isQuestion: false },
    { id: 3, speaker: 'Priya', text: 'What were you hoping to see?', isQuestion: true },
    { id: 4, speaker: 'Rahul', text: 'I wanted to know if my coaching was actually improving. Was it working? I had no way to tell.', isQuestion: false },
    { id: 5, speaker: 'Priya', text: 'Why does that matter to you?', isQuestion: true },
    { id: 6, speaker: 'Rahul', text: 'My director asks every quarter if the coaching programme is worth the investment. I need to be able to answer that.', isQuestion: false },
    { id: 7, speaker: 'Rahul', text: 'I cancelled after about a week. I felt like I was flying blind the whole time.', isQuestion: false },
  ];
  const TAGS = [
    { id: 'no-next-step', label: 'no clear next step', color: '#0097A7' },
    { id: 'no-progress', label: 'no progress signal', color: '#7C3AED' },
    { id: 'prove-value', label: 'job: prove value', color: '#C85A40' },
    { id: 'setup-fine', label: 'setup was fine', color: '#158158' },
    { id: 'churn', label: 'decision to churn', color: '#DC2626' },
  ];
  const [selected, setSelected] = useState<number | null>(null);
  const [tagged, setTagged] = useState<Record<number, string>>({});
  const taggableCount = transcript.filter(s => !s.isQuestion).length;
  const taggedCount = Object.keys(tagged).length;
  return (
    <TiltCard style={{ margin: '24px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E0D9D0', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
        <div style={{ background: '#1A1523', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#B794F4', letterSpacing: '0.1em' }}>DOVETAIL</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>/ Interview 01 &mdash; Rahul Shah &middot; Sales Manager</div>
          <div style={{ marginLeft: 'auto', fontSize: '9px', fontFamily: 'monospace', color: taggedCount >= 4 ? '#00C781' : 'rgba(255,255,255,0.3)' }}>
            {taggedCount}/{taggableCount} tagged
          </div>
        </div>
        <div style={{ display: 'flex', background: '#FAFAFA', minHeight: '380px' }}>
          <div style={{ flex: 1.4, padding: '16px 18px', borderRight: '1px solid #E0D9D0' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#999', letterSpacing: '0.12em', marginBottom: '12px' }}>TRANSCRIPT &middot; click a response to tag it</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {transcript.map(seg => {
                const tagId = tagged[seg.id];
                const tagDef = TAGS.find(t => t.id === tagId);
                const isSelected = selected === seg.id;
                const isTagged = !!tagId;
                return (
                  <div key={seg.id}>
                    <div style={{ fontSize: '8px', fontFamily: 'monospace', color: seg.isQuestion ? '#0097A7' : '#888', letterSpacing: '0.06em', marginBottom: '3px', fontWeight: 600 }}>
                      {seg.speaker.toUpperCase()}
                    </div>
                    <div
                      onClick={!seg.isQuestion ? () => setSelected(isSelected ? null : seg.id) : undefined}
                      style={{
                        padding: '8px 12px', borderRadius: '8px', fontSize: '12px', color: '#37352F', lineHeight: 1.65,
                        border: `1px solid ${isTagged && tagDef ? tagDef.color + '55' : isSelected ? '#0097A7' : '#E0D9D0'}`,
                        background: isTagged && tagDef ? `${tagDef.color}10` : seg.isQuestion ? '#F0FAFB' : isSelected ? 'rgba(0,151,167,0.07)' : '#fff',
                        cursor: seg.isQuestion ? 'default' : 'pointer',
                        fontStyle: seg.isQuestion ? 'italic' : 'normal',
                      }}
                    >
                      {seg.text}
                      {isTagged && tagDef && (
                        <span style={{ marginLeft: '8px', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: tagDef.color, color: '#fff', fontFamily: 'monospace', fontWeight: 700 }}>
                          {tagDef.label}
                        </span>
                      )}
                    </div>
                    <AnimatePresence>
                      {isSelected && !isTagged && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ padding: '8px 10px', background: '#F0FAFB', borderRadius: '0 0 8px 8px', border: '1px solid #0097A7', borderTop: 'none', display: 'flex', gap: '6px', flexWrap: 'wrap' as const, alignItems: 'center' }}>
                            <span style={{ fontSize: '8px', fontFamily: 'monospace', color: '#0097A7', letterSpacing: '0.08em', marginRight: '4px' }}>TAG AS:</span>
                            {TAGS.map(tag => (
                              <button
                                key={tag.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTagged(prev => ({ ...prev, [seg.id]: tag.id }));
                                  setSelected(null);
                                }}
                                style={{ padding: '4px 10px', borderRadius: '12px', background: `${tag.color}18`, border: `1px solid ${tag.color}55`, cursor: 'pointer', fontSize: '10px', fontWeight: 600, color: tag.color }}
                              >
                                {tag.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ width: '210px', padding: '14px', flexShrink: 0 }}>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#999', letterSpacing: '0.12em', marginBottom: '12px' }}>OBSERVATIONS</div>
            <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {TAGS.map(tag => {
                const count = Object.values(tagged).filter(t => t === tag.id).length;
                if (count === 0) return null;
                return (
                  <div key={tag.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '9px', color: tag.color, fontWeight: 600 }}>{tag.label}</span>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: tag.color, fontWeight: 700 }}>{count}</span>
                    </div>
                    <div style={{ height: '3px', background: '#E0D9D0', borderRadius: '2px', overflow: 'hidden' }}>
                      <motion.div animate={{ width: `${(count / taggableCount) * 100}%` }} transition={{ duration: 0.4 }} style={{ height: '100%', background: tag.color, borderRadius: '2px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <AnimatePresence>
              {(Object.entries(tagged) as [string, string][]).map(([segIdStr, tagId]) => {
                const segId = parseInt(segIdStr);
                const seg = transcript.find(s => s.id === segId);
                const tagDef = TAGS.find(t => t.id === tagId);
                if (!seg || !tagDef) return null;
                return (
                  <motion.div key={segId} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} style={{ padding: '8px 10px', borderRadius: '7px', background: `${tagDef.color}10`, border: `1px solid ${tagDef.color}30`, marginBottom: '6px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 700, color: tagDef.color, fontFamily: 'monospace', marginBottom: '4px', letterSpacing: '0.06em' }}>{tagDef.label.toUpperCase()}</div>
                    <div style={{ fontSize: '10px', color: '#37352F', lineHeight: 1.5, fontStyle: 'italic' }}>
                      &ldquo;{seg.text.length > 65 ? seg.text.slice(0, 65) + '...' : seg.text}&rdquo;
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {taggedCount === 0 && (
              <div style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
                Tag quotes to build your observations
              </div>
            )}
          </div>
        </div>
        <div style={{ background: '#F7F3FF', borderTop: '1px solid #E0D9D0', padding: '10px 18px' }}>
          <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 600 }}>
            {taggedCount === 0
              ? 'Click any response to start tagging observations'
              : taggedCount < 3
              ? `${taggedCount} observation${taggedCount > 1 ? 's' : ''} tagged — keep going to see patterns form`
              : 'Patterns forming — observations with the same tag build your synthesis'}
          </span>
        </div>
      </div>
    </TiltCard>
  );
};

const MODULE_CONTEXT = `Module 02 of Airtribe PM Fundamentals — Track: New to PM.
Continues with Priya Sharma, PM at EdSpark (B2B SaaS for sales coaching). She must investigate why 40% of users churn in week 2. Covers: resisting premature solutions, customer segmentation, Jobs to Be Done, choosing research methods (using Notion for notes, Dovetail for synthesis, Kraftful for AI analysis), running user interviews, affinity mapping, and writing a discovery brief.`;

const QUIZZES = [
  {
    question: "Your manager says '40% of users churn in week 2 — fix it.' You have a theory about onboarding. What do you do first?",
    options: [
      'A. Start redesigning the onboarding — your instinct is probably right',
      'B. Talk to 5–6 churned users before touching anything',
      'C. Run a survey to all users asking what they find confusing',
      'D. Ask engineering to instrument better analytics first',
    ],
    correctIndex: 1,
    explanation: "Your instinct might be right — or it might be completely wrong. Priya spent a weekend building 14 Figma screens for an onboarding problem that turned out not to be an onboarding problem at all. Five conversations would have saved two days. Talk first, build second.",
    conceptId: 'user-research',
    keyInsight: "The cost of five conversations is hours. The cost of building the wrong thing is weeks. Always talk first.",
  },
  {
    question: "EdSpark has 340 churned users last month. You need to understand why managers specifically are churning. Who do you interview?",
    options: [
      'A. Your 10 most active managers — they know the product best',
      'B. A random sample of 20 users to avoid selection bias',
      'C. Managers who churned in the last 2–3 weeks — while it\'s still fresh',
      'D. Enterprise managers — they represent the most valuable segment',
    ],
    correctIndex: 2,
    explanation: "Research participants must match your research question. If the question is 'why do managers churn?', you talk to churned managers — and recent ones, because memory fades fast. Active managers can't tell you why others left. Enterprise managers are a different segment with different context.",
    conceptId: 'customer-segments',
    keyInsight: "Match participants to the question. The wrong respondents give you the wrong insights.",
  },
  {
    question: "Kiran's Amplitude data shows 43% of managers never click 'Add Recording' in their first session. What does this tell you?",
    options: [
      'A. The button is broken or hard to find — fix the UI',
      'B. WHERE the problem shows up. Not WHY. Interview users to find the root cause.',
      'C. Managers don\'t understand the product — add an onboarding tutorial',
      'D. The product isn\'t useful to managers — consider a pivot',
    ],
    correctIndex: 1,
    explanation: "Analytics show you where and when. They don't show you why. 43% never clicking 'Add Recording' could mean the button is hard to find, OR they don't understand why to add recordings, OR they got interrupted, OR they're waiting for their team to set up first. Only conversations reveal which it is.",
    conceptId: 'research-methods',
    keyInsight: "Data shows you where. Interviews show you why. Use both — but in the right order.",
  },
  {
    question: "Midway through an interview, Rahul says 'I wasn't sure what to do next.' You should:",
    options: [
      'A. Note "user felt lost" and move to the next question',
      'B. Ask: "When you say you weren\'t sure what to do — can you walk me through what you tried?"',
      'C. Validate: "Did you find the product confusing?"',
      'D. Move on — you have 20 more questions to get through',
    ],
    correctIndex: 1,
    explanation: "'I wasn't sure what to do next' is an observation, not an insight. What did he try? What was he hoping to see? What would have made it clear? The follow-up question is the whole job. Asking 'did you find it confusing?' is leading — you're suggesting the answer. And racing through 20 questions means you'll miss the one thing that matters.",
    conceptId: 'user-research',
    keyInsight: "'Tell me more' and 'Can you walk me through that?' are the two most powerful interview questions. Use them every time.",
  },
  {
    question: "Rahul said 'I just wanted to see if my coaching was actually working.' As a PM, what's the job?",
    options: [
      'A. Better analytics dashboard — that\'s what he\'s asking for',
      'B. Coaching effectiveness visibility — he hired EdSpark to prove his coaching is improving his team',
      'C. Notification emails — remind managers to check their data',
      'D. A/B test the dashboard layout to see what drives engagement',
    ],
    correctIndex: 1,
    explanation: "'See if coaching was working' isn't a request for a dashboard — it's a job: prove to himself (and his manager) that he's making his team better. That's about confidence, credibility, and career safety. The product solution might be a dashboard — or an automated report, or a Slack summary, or a weekly email. The job determines the direction. The feature is just one possible answer.",
    conceptId: 'jtbd',
    keyInsight: "Every feature request hides a job. Find the job first — then decide what to build.",
  },
  {
    question: "After 6 interviews you have 8 pages of notes. 5 of 6 users mentioned not knowing what to do after setup. 1 user had a billing issue. How do you weight these?",
    options: [
      'A. Report both equally — every data point deserves equal weight in the synthesis',
      'B. 5/6 on "no clear next step" is your signal; note billing as a separate issue',
      'C. Discard the billing issue — single mentions are outliers and shouldn\'t influence your findings',
      'D. Do more interviews until billing comes up at least twice before treating it as a separate finding',
    ],
    correctIndex: 1,
    explanation: "Frequency across independent respondents is signal. 5 of 6 users independently describing the same experience is a finding — not a coincidence. 1 user with a billing issue is a data point worth noting, but it's a different problem requiring separate investigation. Don't let one loud outlier dilute a clear pattern.",
    conceptId: 'insight-synthesis',
    keyInsight: "Patterns across users are insights. Individual issues are data points. Weight them accordingly.",
  },
  {
    question: "You've written your discovery brief. How do you open the Friday meeting with Rohan?",
    options: [
      'A. \"Based on my research, I recommend adding coaching examples to onboarding. Here\'s the detailed plan I\'ve put together.\"',
      'B. \"We found that managers use EdSpark to prove their coaching works — but the product never shows them what good looks like.\"',
      'C. \"The interviews raised a lot of interesting questions. I think I need at least two more rounds before I can propose anything.\"',
      'D. \"After talking to users, it\'s clear they\'re confused — my read is we need a complete redesign of the onboarding flow.\"',
    ],
    correctIndex: 1,
    explanation: "Option A leads with a solution — you've already decided, and the meeting becomes a presentation, not a problem-solving session. Option B leads with the discovery — you present what you learned and let the team think. Option C is avoidance. Option D is a vague symptom, not an insight. Lead with what you learned. The team will find better solutions than you would alone.",
    conceptId: 'problem-framing',
    keyInsight: "Present the problem, not the solution. A clear problem statement unlocks the team's best thinking.",
  },
];

// ─────────────────────────────────────────
// INTERACTIVE 1: RESEARCH METHOD CHOOSER
// ─────────────────────────────────────────
const RESEARCH_SCENARIOS = [
  {
    scenario: "You want to know WHY 40% of managers churn in week 2, but you have no hypothesis yet.",
    methods: [
      { label: 'User interviews', fit: 'Best fit', color: 'var(--green)', rgb: '21,129,88', reason: "You don't know what to look for yet. Interviews let you follow unexpected threads — like when Rahul mentioned coaching evidence rather than onboarding confusion. The right tool when the problem is still fuzzy." },
      { label: 'Session recordings', fit: 'Useful but partial', color: 'var(--blue)', rgb: '58,134,255', reason: "Shows what users do, not why they stop. Use after interviews to confirm patterns — 'do users actually pause at this screen the way Rahul described?'" },
      { label: 'NPS survey', fit: 'Wrong tool', color: 'var(--coral)', rgb: '224,122,95', reason: "NPS tells you satisfaction at a single point in time. It won't tell you why users churned, or what they were trying to accomplish when they gave up." },
    ],
  },
  {
    scenario: "Kiran found that managers who add a recording in session 1 retain at 78%. You want to know which onboarding prompt drives this behaviour.",
    methods: [
      { label: 'A/B test', fit: 'Best fit', color: 'var(--green)', rgb: '21,129,88', reason: "You have a clear success metric (recording added in session 1), a hypothesis, and enough traffic. A/B tests are built for exactly this: 'does change X cause behaviour Y?'" },
      { label: 'User interviews', fit: 'Wrong tool here', color: 'var(--coral)', rgb: '224,122,95', reason: "You're past the 'why' question — Kiran's data already gave you the hypothesis. Interviews give you opinions on hypotheticals. Test behaviour instead." },
      { label: 'Funnel analytics', fit: 'Partial signal', color: 'var(--blue)', rgb: '58,134,255', reason: "Useful for measuring the current baseline before the test, and tracking results after. Doesn't tell you which variant wins on its own." },
    ],
  },
  {
    scenario: "Maya wants to understand what 'job' managers hire EdSpark to do when they first sign up.",
    methods: [
      { label: 'JTBD interviews', fit: 'Best fit', color: 'var(--green)', rgb: '21,129,88', reason: "Ask users to walk you through the moment they decided to sign up. 'What was going on in your work life when you first looked for a product like this?' The switch moment reveals the job — no other method gets there." },
      { label: 'Usage analytics', fit: 'Indirect hint', color: 'var(--blue)', rgb: '58,134,255', reason: "Which features they touch hints at the job, but two users touching the same feature might have completely different jobs. Analytics are a starting point, not the answer." },
      { label: 'Support tickets via Kraftful', fit: 'Good starting point', color: 'var(--teal)', rgb: '0,151,167', reason: "Kraftful can cluster tickets by theme and reveal patterns in what users struggle with. Great for scoping — but support tickets over-represent frustrated users, not successful ones. Combine with interviews." },
    ],
  },
];

const ResearchMethodChooser = () => {
  const [activeScenario, setActiveScenario] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const scenario = RESEARCH_SCENARIOS[activeScenario];
  const reveal = (key: string) => setRevealed(r => ({ ...r, [key]: true }));

  return (
    <div style={glassCard('var(--teal)', '0,151,167')}>
      {demoLabel('Match the method to the question', 'var(--teal)')}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {RESEARCH_SCENARIOS.map((s, i) => (
          <button key={i} onClick={() => { setActiveScenario(i); setRevealed({}); }}
            style={{ padding: '6px 12px', borderRadius: '7px', fontSize: '11px', fontWeight: i === activeScenario ? 700 : 400, border: `2px solid ${i === activeScenario ? 'var(--teal)' : 'var(--ed-rule)'}`, background: i === activeScenario ? 'rgba(0,151,167,0.1)' : 'var(--ed-card)', color: i === activeScenario ? 'var(--teal)' : 'var(--ed-ink3)', cursor: 'pointer', transition: 'all 0.18s' }}>
            Scenario {i + 1}
          </button>
        ))}
      </div>
      <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', marginBottom: '20px', fontSize: '14px', fontStyle: 'italic', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        &ldquo;{scenario.scenario}&rdquo;
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {scenario.methods.map((m, i) => {
          const key = `${activeScenario}-${i}`;
          const isRevealed = revealed[key];
          return (
            <motion.button key={key} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
              onClick={() => reveal(key)}
              style={{ padding: '14px 18px', borderRadius: '12px', border: `2px solid ${isRevealed ? m.color : 'rgba(0,151,167,0.18)'}`, background: isRevealed ? `rgba(${m.rgb},0.06)` : 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isRevealed ? '8px' : 0 }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)' }}>{m.label}</span>
                {isRevealed && <span style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, color: m.color, letterSpacing: '0.1em' }}>{m.fit.toUpperCase()}</span>}
              </div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>{m.reason}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 2: INTERVIEW QUESTION QUALITY
// ─────────────────────────────────────────
const INTERVIEW_QS = [
  {
    question: '"Would you use a feature that shows example coaching sessions in onboarding?"',
    verdict: 'Avoid',
    verdictColor: 'var(--coral)',
    why: "Hypothetical. Users say yes to things they'll never use — agreeing is easy and costs nothing. This tells you nothing about actual behaviour. Rahul would have said yes to this, then churned anyway.",
    better: '"Tell me about a time you tried to figure out what good coaching looks like. What did you do?"',
  },
  {
    question: '"Walk me through what happened when you first logged into EdSpark."',
    verdict: 'Great',
    verdictColor: 'var(--green)',
    why: "Past behaviour, open-ended, non-leading. This is how Priya found out Rahul completed setup but then didn't know what to do — a detail that never would have appeared in a survey.",
    better: null,
  },
  {
    question: '"Did you find it confusing when you couldn\'t figure out where to start?"',
    verdict: 'Avoid',
    verdictColor: 'var(--coral)',
    why: "Double problem: leading (suggesting 'confusing') and compound (two questions in one). The user will agree because it seems like what you want to hear. Priya made this mistake live — Rahul said 'a little, yeah' and she nearly moved on.",
    better: '"When you weren\'t sure what to do next — what did you try?"',
  },
  {
    question: '"What was going on in your work at the time that made you look for something like EdSpark?"',
    verdict: 'Great',
    verdictColor: 'var(--green)',
    why: "This is the JTBD opener. It surfaces the context, the trigger, and the job — all in one question. Rahul's answer ('my team's close rate had dropped two quarters in a row') revealed more about the job than any product question would have.",
    better: null,
  },
  {
    question: '"On a scale of 1–10, how likely are you to recommend EdSpark to a colleague?"',
    verdict: 'Context-dependent',
    verdictColor: 'var(--blue)',
    why: "Useful for benchmarking NPS at scale — but useless in a discovery interview. A '4' tells you almost nothing. Only useful if immediately followed by 'tell me more about what's driving that score' — and then the number doesn't matter anyway.",
    better: null,
  },
];

const InterviewQuality = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  return (
    <div style={glassCard('var(--purple)', '120,67,238')}>
      {demoLabel('Good question or one to avoid? Tap to see why.', 'var(--purple)')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {INTERVIEW_QS.map((item, i) => {
          const isRevealed = revealed[i];
          return (
            <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
              onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
              style={{ padding: '16px 18px', borderRadius: '12px', border: `2px solid ${isRevealed ? item.verdictColor : 'rgba(120,67,238,0.18)'}`, background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--ed-ink2)', lineHeight: 1.6, marginBottom: isRevealed ? '10px' : 0 }}>{item.question}</div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, color: item.verdictColor, letterSpacing: '0.12em', marginBottom: '8px' }}>{item.verdict.toUpperCase()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7, marginBottom: item.better ? '10px' : 0 }}>{item.why}</div>
                    {item.better && (
                      <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(21,129,88,0.07)', border: '1px solid rgba(21,129,88,0.2)', borderLeft: '3px solid var(--green)' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--green)', letterSpacing: '0.12em', marginBottom: '5px' }}>TRY INSTEAD</div>
                        <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', fontStyle: 'italic', lineHeight: 1.6 }}>{item.better}</div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 3: JTBD MATCHER
// ─────────────────────────────────────────
const JTBD_ITEMS = [
  {
    quote: '"I need to quickly prep for my 2pm coaching call without digging through old recordings."',
    job: 'Fast context retrieval before a time-pressured meeting',
    notJob: 'Recording organisation',
    explanation: "The urgency and time-bound nature reveal the real job: speed + recency under pressure, not organisation. A search bar that shows 'most recent from this rep' solves it. A folder system doesn't.",
  },
  {
    quote: '"My manager wants to see proof that the coaching programme is working."',
    job: 'Build credibility with leadership using data',
    notJob: 'Better reporting features',
    explanation: "This person doesn't want a report — they want to look competent to their boss. The job is political: demonstrate impact. The product needs to make that effortless, not just export data.",
  },
  {
    quote: '"I joined EdSpark because my team\'s close rate dropped two quarters in a row and I needed to do something."',
    job: 'Prove to myself and my manager that I\'m fixing the problem',
    notJob: 'Sales coaching tools',
    explanation: "Rahul's actual job. He's not shopping for a coaching tool — he's under performance pressure and needs evidence that he's responding to it. EdSpark is a credibility tool as much as a coaching tool.",
  },
];

const JTBDMatcher = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  return (
    <div style={glassCard('var(--coral)', '224,122,95')}>
      {demoLabel("What's the real job? Tap to reveal.", 'var(--coral)')}
      <div style={{ marginBottom: '14px', fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>Users say what they want. PMs listen for what they&apos;re actually trying to accomplish.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {JTBD_ITEMS.map((item, i) => {
          const isRevealed = revealed[i];
          return (
            <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
              onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
              style={{ padding: '16px 18px', borderRadius: '12px', border: `2px solid ${isRevealed ? 'var(--coral)' : 'rgba(224,122,95,0.2)'}`, background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--ed-ink)', lineHeight: 1.6, marginBottom: isRevealed ? '12px' : 0 }}>&ldquo;{item.quote}&rdquo;</div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(21,129,88,0.08)', border: '1px solid rgba(21,129,88,0.2)' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--green)', letterSpacing: '0.1em', marginBottom: '5px' }}>THE REAL JOB</div>
                        <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', fontWeight: 600, lineHeight: 1.5 }}>{item.job}</div>
                      </div>
                      <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(224,122,95,0.07)', border: '1px solid rgba(224,122,95,0.2)' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--coral)', letterSpacing: '0.1em', marginBottom: '5px' }}>NOT JUST</div>
                        <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', fontWeight: 600, lineHeight: 1.5 }}>{item.notJob}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>{item.explanation}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 4: INSIGHT OR OPINION?
// ─────────────────────────────────────────
const INSIGHT_ITEMS = [
  { statement: '"Users probably find the product confusing because it has too many options."', type: 'Opinion', color: 'var(--coral)', explanation: "No evidence. 'Probably' is an opinion marker. This might be true — but it might not. You need to observe it happening before you can act on it." },
  { statement: '"5 of 6 interviewed managers said they didn\'t know what to do after completing account setup."', type: 'Insight', color: 'var(--green)', explanation: "Specific, observable, and consistent across independent respondents. This is what Priya found. It directly implies there\'s a gap between setup completion and the product delivering value." },
  { statement: '"I think the main issue is managers don\'t understand the product\'s value proposition."', type: 'Opinion', color: 'var(--coral)', explanation: "This is a hypothesis, not a finding. It might be right — but 'I think' without evidence is just an assumption wearing the clothes of an insight." },
  { statement: '"Every interviewed manager mentioned wanting to show their boss that coaching was having an impact."', type: 'Insight', color: 'var(--green)', explanation: "Consistent, unprompted, across all participants. That's the job — and it implies EdSpark needs to make coaching impact visible, not just record calls." },
  { statement: '"Kraftful clustered 34% of support tickets as \'not knowing where to start\' — so that\'s the main problem."', type: 'Partial insight', color: 'var(--blue)', explanation: "Support tickets are real signal, but they over-represent users who were frustrated enough to write in. They may not represent the silent majority who just churned. Use it to scope interviews, not to make the final call." },
];

const InsightOrOpinion = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  return (
    <div style={glassCard('var(--blue)', '58,134,255')}>
      {demoLabel('Insight, opinion, or in between? Tap to reveal.', 'var(--blue)')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {INSIGHT_ITEMS.map((item, i) => {
          const isRevealed = revealed[i];
          return (
            <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
              onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
              style={{ padding: '14px 18px', borderRadius: '12px', border: `2px solid ${isRevealed ? item.color : 'rgba(58,134,255,0.2)'}`, background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: isRevealed ? '10px' : 0 }}>{item.statement}</div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, color: item.color, letterSpacing: '0.12em', marginBottom: '7px' }}>{item.type.toUpperCase()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>{item.explanation}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 5: DISCOVERY BRIEF BUILDER
// ─────────────────────────────────────────
const BRIEF_OPTIONS = {
  segment: {
    label: 'Who is affected?',
    options: [
      'Sales managers at small teams (2–20 reps)',
      'Individual sales reps in their first week',
      'Power users with 50+ saved recordings',
    ],
  },
  behaviour: {
    label: 'What are they trying to do?',
    options: [
      'prove that their coaching is improving their team\'s close rate',
      'find specific coaching moments quickly before a call',
      'understand whether EdSpark is worth continuing to use',
    ],
  },
  barrier: {
    label: 'What gets in the way?',
    options: [
      'the product never shows them what good coaching looks like, so they can\'t tell if they\'re using it right',
      'search only works by date, not by rep name or call outcome',
      'there\'s no signal that the product is working — no benchmark, no improvement score, no highlight',
    ],
  },
} as const;
type BriefField = keyof typeof BRIEF_OPTIONS;

const DiscoveryBriefBuilder = () => {
  const [sel, setSel] = useState<Partial<Record<BriefField, string>>>({});
  const order: BriefField[] = ['segment', 'behaviour', 'barrier'];
  const currentStep = order.find(f => !sel[f]) ?? null;
  const done = order.every(f => sel[f]);
  const pick = (field: BriefField, val: string) => setSel(s => ({ ...s, [field]: val }));
  const reset = () => setSel({});

  return (
    <div style={glassCard('var(--teal)', '0,151,167')}>
      {demoLabel('Build a discovery brief — the output that gets teams aligned', 'var(--teal)')}
      <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', marginBottom: '20px', fontSize: '14px', lineHeight: 1.9, color: 'var(--ed-ink2)' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>DISCOVERY BRIEF</span>
        <span style={{ color: sel.segment ? 'var(--ed-ink)' : 'var(--ed-ink3)', fontStyle: sel.segment ? 'normal' : 'italic', fontWeight: sel.segment ? 600 : 400 }}>{sel.segment ?? '[ who is affected ]'}</span>
        {' are trying to '}
        <span style={{ color: sel.behaviour ? 'var(--ed-ink)' : 'var(--ed-ink3)', fontStyle: sel.behaviour ? 'normal' : 'italic', fontWeight: sel.behaviour ? 600 : 400 }}>{sel.behaviour ?? '[ do what ]'}</span>
        {', but '}
        <span style={{ color: sel.barrier ? 'var(--ed-ink)' : 'var(--ed-ink3)', fontStyle: sel.barrier ? 'normal' : 'italic', fontWeight: sel.barrier ? 600 : 400 }}>{sel.barrier ?? '[ what gets in the way ]'}</span>
        {done ? '.' : ' …'}
      </div>
      {!done && currentStep && (
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ed-ink2)', marginBottom: '10px' }}>
            Step {order.indexOf(currentStep) + 1} / 3 — {BRIEF_OPTIONS[currentStep].label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {BRIEF_OPTIONS[currentStep].options.map((opt, i) => (
              <motion.button key={i} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                onClick={() => pick(currentStep, opt)}
                style={{ padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(0,151,167,0.22)', background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', fontSize: '13px', color: 'var(--ed-ink2)', transition: 'all 0.18s' }}>
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      )}
      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'rgba(21,129,88,0.08)', border: '1px solid rgba(21,129,88,0.2)', borderLeft: '4px solid var(--green)', marginBottom: '12px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--green)', letterSpacing: '0.12em', marginBottom: '6px' }}>BRIEF COMPLETE</div>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>
                This is what Priya handed Rohan on Friday. Specific user, specific job, specific barrier — no solution. The team generated three solutions in ten minutes. That&apos;s what a clear problem statement does.
              </div>
            </div>
            <motion.button whileHover={{ opacity: 0.8 }} onClick={reset}
              style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ed-ink3)', background: 'none', border: '1px solid var(--ed-rule)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
              Try different choices →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────
// INTRO HERO
// ─────────────────────────────────────────
const IntroHero = () => (
  <section style={{ background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', padding: '48px 0 40px' }}>
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'flex-start', gap: '40px', flexWrap: 'wrap' as const }}>
      <div style={{ flex: 1, minWidth: '280px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--teal)', marginBottom: '12px', textTransform: 'uppercase' as const }}>
          MODULE 02 · PROBLEM DISCOVERY
        </div>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: '32px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.2, marginBottom: '16px' }}>
          Problem Discovery<br />&amp; User Research
        </h1>
        <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, marginBottom: '24px' }}>
          The most expensive thing a PM can build is the wrong thing. Discovery is how you avoid it — not by doing more research, but by talking to the right people before you open Figma.
        </div>
        <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'rgba(0,151,167,0.06)', border: '1px solid rgba(0,151,167,0.18)', marginBottom: '24px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.14em', marginBottom: '10px' }}>BY THE END OF THIS MODULE</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
            {[
              'Stop building before you understand the problem',
              'Run a user interview that gives you real insight, not polite agreement',
              'Find the job a user is actually trying to get done',
              'Turn messy notes into a crisp brief that gets the team aligned in 10 minutes',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>→</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tools used in this module */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: '10px' }}>TOOLS PRIYA USES IN THIS MODULE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <ToolBadge name="Notion" desc="Interview notes template + affinity mapping board" accent="var(--blue)" />
            <ToolBadge name="Dovetail" desc="Research repository — tag, cluster, find patterns" accent="var(--purple)" />
            <ToolBadge name="Kraftful" desc="AI analysis of support tickets — fast pattern detection" accent="var(--teal)" />
          </div>
        </div>

        {/* Characters */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--ed-ink3)', marginBottom: '10px' }}>CHARACTERS IN THIS MODULE</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
            {([
              { mentor: 'priya' as const, accent: 'var(--teal)', accentHex: '#0097A7', desc: '14 Figma screens ready. About to send the wrong thing.' },
              { mentor: 'maya'  as const, accent: '#C85A40',      accentHex: '#C85A40', desc: 'Watches session recordings. Knows what users actually mean.' },
              { mentor: 'kiran' as const, accent: '#3A86FF',      accentHex: '#3A86FF', desc: 'Has the churn segmentation. Waiting for someone to ask.' },
              { mentor: 'dev'   as const, accent: '#6E7681',      accentHex: '#6E7681', desc: 'Builds what you ask for. Problem is you haven\'t asked the right thing yet.' },
              { mentor: 'asha'  as const, accent: '#7843EE',      accentHex: '#7843EE', desc: 'Keeps asking "what problem are you actually solving?"' },
            ]).map(c => (
              <div key={c.mentor} style={{ background: `${c.accentHex}0D`, border: `1px solid ${c.accentHex}33`, borderRadius: '10px', padding: '14px 16px', minWidth: '130px', flex: '1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <MentorFace mentor={c.mentor} size={44} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: c.accent, lineHeight: 1.2 }}>{{ priya: 'Priya', maya: 'Maya', kiran: 'Kiran', dev: 'Dev', asha: 'Asha' }[c.mentor]}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.04em' }}>{{ priya: 'APM · 2 yrs', maya: 'Designer', kiran: 'Data Analyst', dev: 'Engineer', asha: 'AI Mentor' }[c.mentor]}</div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '18px 22px', borderRadius: '8px', background: 'var(--ed-card)', borderTop: '1px solid var(--ed-rule)', borderRight: '1px solid var(--ed-rule)', borderBottom: '1px solid var(--ed-rule)', borderLeft: '4px solid var(--teal)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--teal)', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Where we left Priya</div>
          <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.8 }}>
            It&apos;s Monday morning. Rohan messaged Friday at 11:43pm: <strong style={{ color: 'var(--ed-ink)' }}>&ldquo;Need a plan on week-2 churn. Stakeholder call Thursday. Make it good.&rdquo;</strong> Priya spent the weekend building. She has 14 screens in Figma. She&apos;s about to send the link in Slack.
          </div>
        </div>
      </div>

      {/* Module card */}
      <div style={{ flexShrink: 0, width: '168px', paddingTop: '48px' }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="float3d" style={{ transformStyle: 'preserve-3d' }}>
            <div style={{ background: 'linear-gradient(145deg, #0A1A1C 0%, #0D2426 100%)', borderRadius: '14px', padding: '20px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: '#00BCD4', marginBottom: '10px' }}>MODULE 02</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#E8F8FA', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>Problem Discovery</div>
              <div style={{ fontSize: '10px', color: 'rgba(232,248,250,0.45)', marginBottom: '16px' }}>Foundations Track</div>
              <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '15%' }} transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }} style={{ height: '100%', background: '#00BCD4', borderRadius: '1px' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[{ val: '6', lbl: 'parts' }, { val: '45', lbl: 'min' }].map(s => (
                  <div key={s.lbl} style={{ flex: 1, padding: '6px 0', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', textAlign: 'center' as const }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#E8F8FA', fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</div>
                    <div style={{ fontSize: '8px', color: 'rgba(232,248,250,0.4)', letterSpacing: '0.08em' }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'linear-gradient(135deg, #7843EE, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round" /><path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </div>
          <span style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.1em' }}>AIRTRIBE LEARN</span>
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────
export default function Track1ProblemDiscovery() {
  return (
    <>
      <IntroHero />

      {/* ── PART 1: Don't Build Yet ── */}
      <ChapterSection num="01" accentRgb="0,151,167" id="m2-discovery-mindset" first>
        <div className="rv">
          {chLabel('Part 1 · Discovery Mindset', 'var(--teal)')}
          {h2(<>You spent the weekend building the wrong thing</>)}

          <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'rgba(0,151,167,0.06)', border: '1px solid rgba(0,151,167,0.18)', marginBottom: '28px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.14em', marginBottom: '10px' }}>BY THE END OF THIS PART</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
              {['Know why symptoms and root causes are not the same thing', 'Understand the cost of building before understanding', "See what Asha's discovery process looks like in Notion"].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          <SituationCard accent="var(--teal)" accentRgb="0,151,167">
            9:17am Monday. Priya has 14 screens in Figma — a completely redesigned onboarding: 7 steps collapsed to 4, new progress indicators, rewritten welcome email, cleaner copy. She worked Saturday and Sunday on it. She&apos;s proud of it. She&apos;s about to paste the link into Slack when Asha pulls up a chair.
          </SituationCard>

          {para(<>&ldquo;Nice mockup,&rdquo; Asha says, looking at the screen. &ldquo;When did you talk to users?&rdquo;</>)}
          {para(<>&ldquo;I haven&apos;t yet. But the problem seems—&rdquo;</>)}
          {para(<>Asha interrupts quietly. &ldquo;Pull up the churn data. When exactly are users dropping off?&rdquo;</>)}
          {para(<>Priya clicks through to the dashboard. She&apos;d looked at the headline number — 40% — but not the shape of it. The drop-off isn&apos;t on day 1. It peaks between days 3 and 7. &ldquo;Day 3 to 7,&rdquo; she says slowly.</>)}
          {para(<>&ldquo;And do those users complete setup before they churn?&rdquo;</>)}
          {para(<>Another click. 62% of churned users completed setup. &ldquo;Yes,&rdquo; Priya says. &ldquo;Most of them.&rdquo;</>)}
          {para(<>Asha lets that sit for a moment. &ldquo;So they get through your onboarding. They create an account, set everything up. And then they leave anyway.&rdquo;</>)}
          {para(<>Priya stares at the screen. She has 14 screens of a redesigned onboarding for users who already got through the onboarding just fine. She closes Figma.</>)}
        </div>

        <div className="rv">
          <ConversationScene
            mentor="asha" name="Asha" role="Senior PM · EdSpark" accent="var(--purple)"
            lines={[
              { speaker: 'priya', text: "I spent all weekend on this. 14 screens. And none of it is right." },
              { speaker: 'other', text: "You saw a number \u2014 40% churn \u2014 and your brain jumped to a cause: \u2018the onboarding must be confusing.\u2019 Then you spent a weekend solving that cause before checking whether it was real." },
              { speaker: 'priya', text: "So what do I do now?" },
              { speaker: 'other', text: "The number is a symptom. You don\u2019t know the cause yet. Talk to five churned users before you open Figma again. You caught it before you shipped it. Most PMs don\u2019t." },
            ]}
          />
          <Avatar
            name="Asha"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>A number tells you something is wrong. It doesn&apos;t tell you why. The gap between symptom and cause is where most product time gets wasted \u2014 building the right solution to the wrong problem.</>}
            expandedContent={<>The template I use for every discovery sprint has three sections: raw notes from each interview, an affinity map organized by theme (not by user), and a one-page brief at the end. By Wednesday you&apos;ll have something better than 14 Figma screens. And it&apos;ll actually solve the right problem.</>}
            conceptId="user-research"
            question="Your manager says '40% of users churn in week 2 — fix it.' You have a theory about onboarding. What do you do first?"
            options={[
              { text: "Start redesigning the onboarding — your instinct is probably right", correct: false, feedback: "Priya's instinct was wrong. She spent a weekend building 14 screens for a problem that didn't exist. Talk to users first — before you invest any time in solutions." },
              { text: "Talk to 5–6 churned users before touching anything", correct: true, feedback: "Exactly what Asha recommended. Five conversations take hours. A weekend of building takes a weekend. Talk first, build second." },
              { text: "Run a survey to all users asking what they find confusing", correct: false, feedback: "Surveys give you opinions on a question you've already assumed. When you don't know what the problem is, you need conversations — not checkboxes." },
            ]}
          />
        </div>

        <div className="rv">
          {pullQuote("Build the right thing slowly. Don't build the wrong thing fast.", 'var(--teal)')}

          <InfoBox title="Symptom vs Root Cause" accent="var(--teal)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Symptom', desc: "What you observe: '40% churn in week 2.' Real, measurable, but tells you nothing about why." },
                { label: 'Theory', desc: "What your brain invents to explain it: 'The onboarding is confusing.' May be right. May be completely wrong." },
                { label: 'Root cause', desc: "What's actually happening: You can only find this by talking to users. It might match your theory. It often doesn't." },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '3px 10px', borderRadius: '20px', background: 'rgba(0,151,167,0.12)', border: '1px solid rgba(0,151,167,0.25)', fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--teal)', flexShrink: 0, whiteSpace: 'nowrap' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6, paddingTop: '3px' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </InfoBox>

          <NotionAffinityBoard />

          <QuizEngine conceptId="user-research" conceptName="User Research" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[0]} />

          <ResearchMethodChooser />
        </div>
      </ChapterSection>

      {/* ── PART 2: Know Your Users ── */}
      <ChapterSection num="02" accentRgb="120,67,238" id="m2-customer-segments">
        <div className="rv">
          {chLabel('Part 2 · Customer Segments', 'var(--purple)')}
          {h2(<>340 churned users. Three completely different problems.</>)}

          <SituationCard accent="var(--purple)" accentRgb="120,67,238">
            Priya pulls up the list of churned users. 340 names, emails, account types. She stares at it. &ldquo;I can&apos;t interview 340 people.&rdquo; Maya, EdSpark&apos;s designer, rolls her chair over. &ldquo;You don&apos;t need to. You need to figure out which 340 people this actually is.&rdquo;
          </SituationCard>

          {para(<>Maya opens a spreadsheet. She starts sorting — first by role: 180 are individual sales reps, 110 are sales managers, 50 are ops or admin. Then by company size: solo, small team (2–20 reps), larger org (20+). Then by where they stopped: 220 churned after setup, 80 churned before completing it, 40 set up and used it for a few sessions then stopped.</>)}
          {para(<>&ldquo;Now look at this,&rdquo; Maya says. She points at the manager segment. &ldquo;A sales manager who churned after 5 days of using it — what job were they trying to do when they signed up?&rdquo;</>)}
          {para(<>Priya: &ldquo;Improve their team&apos;s coaching?&rdquo;</>)}
          {para(<>&ldquo;Specifically. They&apos;re not using EdSpark themselves — they&apos;re using it to manage their team&apos;s development. Now look at the sales rep who churned on day 2. What job were they trying to do?&rdquo;</>)}
          {para(<>&ldquo;Track their own performance?&rdquo;</>)}
          {para(<>&ldquo;Completely different job. Different context, different success criteria, different failure mode. If you build one solution for 'churned users,' it fits neither of them.&rdquo;</>)}
          {para(<>Priya looks at the two groups. EdSpark is called a &ldquo;Sales Coaching Platform.&rdquo; The managers are the buyers — the people who pay for it and decide whether to keep it. &ldquo;Then I research the managers,&rdquo; she says. &ldquo;That&apos;s the segment that matters most for retention.&rdquo;</>)}
          {para(<>&ldquo;Good,&rdquo; Maya says. &ldquo;Now: which managers? You need to narrow further.&rdquo;</>)}
        </div>

        <div className="rv">
          <ConversationScene
            mentor="maya" name="Maya" role="Designer · EdSpark" accent="var(--coral)"
            lines={[
              { speaker: 'priya', text: "Which managers do I reach out to? I can\u2019t interview all 340." },
              { speaker: 'other', text: "Interview managers who churned in the last 10 days, at teams of 5\u201320 reps. Recent enough to remember. Representative enough to generalize. Not enterprise \u2014 too many variables. Not solo reps \u2014 different job entirely." },
              { speaker: 'priya', text: "And where do I put the notes?" },
              { speaker: 'other', text: "I\u2019ve set up a Dovetail workspace for the team. Every transcript, clip, and tag goes in there. By the time you\u2019ve done 5 interviews, the patterns start forming automatically. I\u2019ll add you tonight." },
            ]}
          />
          <Avatar
            name="Maya"
            nameColor="var(--coral)"
            borderColor="var(--coral)"
            content={<>Dovetail stores transcripts and notes, and the real value is tagging: as you read each interview, tag observations like &ldquo;didn&apos;t know what to do first.&rdquo; Once all interviews are tagged, Dovetail shows you which tags appear most \u2014 automatically surfacing the patterns across 8 pages of notes.</>}
            expandedContent={<>It turns raw notes into a prioritized list of themes. The tool does the clustering. Your job is to interpret what the clusters mean \u2014 that\u2019s the synthesis step that no tool can do for you.</>}
            conceptId="customer-segments"
            question="EdSpark has 340 churned users last month. You need to understand why managers specifically are churning. Who do you interview?"
            options={[
              { text: "Your 10 most active managers — they know the product best", correct: false, feedback: "Active managers can tell you what's working. They can't tell you why others left. You need churned users, not retained ones." },
              { text: "Managers who churned in the last 2–3 weeks — while it's still fresh", correct: true, feedback: "Exactly. Recent churners remember why they left. Older churners rationalise differently ('I just got busy') or forget entirely. Recency matters enormously in research." },
              { text: "A random sample of all 340 churned users to avoid bias", correct: false, feedback: "Random sampling makes sense for surveys with statistical claims. For qualitative discovery, you want people whose experience matches your research question — recent churned managers, not a random cross-section." },
            ]}
          />
        </div>

        <div className="rv">
          {pullQuote("Segmentation isn't about personas with names and stock photos. It's about finding where the problem is actually different.", 'var(--purple)')}

          <InfoBox title="Jobs to Be Done" accent="var(--purple)">
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.85 }}>
              The &ldquo;job&rdquo; is the progress a person is trying to make in a specific situation. Not &ldquo;use EdSpark&rdquo; — that&apos;s a feature. The job might be: <em>&ldquo;prove to my director that my coaching programme is improving the team&apos;s numbers before the quarterly review.&rdquo;</em><br /><br />
              Two managers could use EdSpark for completely different jobs — one tracking team improvement, one benchmarking her reps before a reorg. They&apos;d need different things. Find the job before you design the solution.
            </div>
          </InfoBox>

          <QuizEngine conceptId="customer-segments" conceptName="Customer Segments" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[1]} />

          <JTBDMatcher />
        </div>
      </ChapterSection>

      {/* ── PART 3: Choose Your Method ── */}
      <ChapterSection num="03" accentRgb="58,134,255" id="m2-research-methods">
        <div className="rv">
          {chLabel('Part 3 · Research Methods', 'var(--blue)')}
          {h2(<>Data shows you where. Users tell you why.</>)}

          <SituationCard accent="var(--blue)" accentRgb="58,134,255">
            Before Priya books a single interview, Kiran rolls his chair over with his laptop open. &ldquo;Before you talk to anyone — look at this.&rdquo; Three Amplitude charts. He&apos;s been sitting on these for a week.
          </SituationCard>

          {para(<>The first chart: 43% of managers who complete setup never click &ldquo;Add Recording&rdquo; in their first session. The second: of managers who <em>do</em> add a recording in session 1, 78% are still active in week 2. Of managers who don&apos;t, 91% churn. Third chart: median time between signup and first recording is 4.2 days — for churned users. For retained users, it&apos;s 18 hours.</>)}
          {para(<>&ldquo;So,&rdquo; Kiran says, &ldquo;if a manager adds their first recording within 24 hours of signup, they almost always stick. If they don&apos;t add one in the first 4 days, they almost always leave.&rdquo;</>)}
          {para(<>Priya: &ldquo;So the fix is to get them to add a recording faster. Better prompt, maybe a tooltip—&rdquo;</>)}
          {para(<>Asha: &ldquo;Maybe. Or maybe the problem is they don&apos;t understand <em>why</em> to add a recording. Or they don&apos;t know what to look for once they do. The data shows WHERE the problem is. It doesn&apos;t show WHY.&rdquo;</>)}
          {para(<>Kiran nods, surprisingly. &ldquo;Exactly. I can tell you that not adding a recording predicts churn. I can&apos;t tell you what&apos;s going through their head when they don&apos;t.&rdquo;</>)}
        </div>

        <div className="rv">
          <ConversationScene
            mentor="kiran" name="Kiran" role="Data · EdSpark" accent="var(--teal)"
            lines={[
              { speaker: 'other', text: "Before you go interview people \u2014 look at this. We ran three months of support tickets through Kraftful. 34% are about \u2018not knowing where to start.\u2019 28%: \u2018not understanding the difference between features.\u2019 18% technical." },
              { speaker: 'priya', text: "So this confirms the onboarding is the issue." },
              { speaker: 'other', text: "Careful. These are users who cared enough to write in. The silent churners might have a completely different story. Use this to sharpen your interview questions. Not to replace the interviews." },
            ]}
          />
          <Avatar
            name="Kiran"
            nameColor="var(--teal)"
            borderColor="var(--teal)"
            content={<>Kraftful uses AI to cluster support tickets by theme automatically. It tells you what users who spoke up are struggling with. The limitation: 40% of users who churn never write in. Kraftful tells you nothing about them. Use it to scope your research \u2014 not to finish it.</>}
            expandedContent={<>Think of Kraftful as a lens on the vocal minority. It&apos;s valuable signal \u2014 just not a complete picture. Pair it with interviews and you get both the volume and the depth.</>}
            conceptId="research-methods"
            question="Kiran's Amplitude data shows 43% of managers never click 'Add Recording' in their first session. What does this tell you?"
            options={[
              { text: "The button is broken or hard to find — fix the UI", correct: false, feedback: "That's one possible cause. But it could also mean they don't understand WHY to add a recording, or they're waiting for their team to use it first, or they got interrupted. Data shows where. Interviews show why." },
              { text: "WHERE the problem shows up. Not WHY. Interview users to find the root cause.", correct: true, feedback: "Exactly what Asha said. Kiran's data is invaluable — it narrows the problem to a specific behaviour. Now you need to understand what's behind that behaviour. That requires conversations." },
              { text: "Managers don't find the product useful — consider a different approach", correct: false, feedback: "78% of managers who DO add a recording stay active. The product is useful — for users who get past this specific point. The problem is getting them there, not the product itself." },
            ]}
          />
        </div>

        <div className="rv">
          {para(<>Priya writes in her Notion doc: <em>&ldquo;Research question: Why do managers not add a recording in their first 24 hours? What&apos;s happening in their head at that point?&rdquo;</em> Kiran&apos;s data gave her a specific behaviour to investigate. Now she needs to understand what&apos;s behind it.</>)}

          {pullQuote("Qualitative research finds the why. Quantitative confirms whether the why is widespread.", 'var(--blue)')}

          <InfoBox title="When to use each method" accent="var(--blue)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { method: 'User interviews', use: "When the problem is fuzzy and you don't know what to look for", limit: 'Small sample — can\'t prove scale' },
                { method: 'Funnel analytics', use: 'Finding where users drop off at scale', limit: 'Shows what, not why' },
                { method: 'Kraftful / AI ticket analysis', use: 'Fast pattern detection across support tickets and feedback', limit: 'Only captures users who spoke up' },
                { method: 'A/B tests', use: 'Testing whether change X causes behaviour Y', limit: 'Needs a clear hypothesis and enough traffic first' },
                { method: 'Dovetail', use: 'Organising and finding patterns across interview notes', limit: 'Only as good as your tagging' },
              ].map(row => (
                <div key={row.method} style={{ paddingBottom: '8px', borderBottom: '1px solid var(--ed-rule)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--ed-ink)', fontSize: '12px', marginBottom: '4px' }}>{row.method}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--green)', lineHeight: 1.5 }}>✓ {row.use}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>✗ {row.limit}</div>
                  </div>
                </div>
              ))}
            </div>
          </InfoBox>

          <KraftfulAnalyzer />

          <QuizEngine conceptId="research-methods" conceptName="Research Methods" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[2]} />

          <InsightOrOpinion />
        </div>
      </ChapterSection>

      {/* ── PART 4: Run the Interview ── */}
      <ChapterSection num="04" accentRgb="224,122,95" id="m2-interview">
        <div className="rv">
          {chLabel('Part 4 · The Interview', 'var(--coral)')}
          {h2(<>Rahul says the thing that changes everything</>)}

          <SituationCard accent="var(--coral)" accentRgb="224,122,95">
            Tuesday 11am. Priya has her first interview: Rahul Shah, sales manager at a 12-person team. He signed up for EdSpark 9 days ago and stopped logging in after day 6. He agreed to a 30-minute call. Priya has 22 questions prepared. Asha looked at the list before the call: &ldquo;You need one. &lsquo;Tell me what happened when you first signed up for EdSpark.&rsquo; Then follow the story.&rdquo;
          </SituationCard>

          {para(<>The call starts. Priya takes a breath and asks the one question.</>)}
          {para(<>Rahul: &ldquo;Yeah — so I saw an ad, it said something about improving coaching outcomes. That&apos;s exactly what I&apos;d been thinking about. My team&apos;s close rate had dropped two quarters in a row and my director was asking questions. I figured I needed to do something visible. I signed up.&rdquo;</>)}
          {para(<>Priya is writing fast. [Job: prove to director that I&apos;m responding to the performance drop. Not &lsquo;improve coaching&apos; — prove I&apos;m doing something about the problem.]</>)}
          {para(<>Priya: &ldquo;What happened when you first got into the product?&rdquo;</>)}
          {para(<>Rahul: &ldquo;Setup was pretty smooth actually. Connected my team&apos;s accounts, configured the basics — took maybe 20 minutes. Then I was on the main dashboard and I just... wasn&apos;t sure what to do next. There were charts. Some options. But nothing was telling me where to start.&rdquo;</>)}
          {para(<>Priya (internal): He got through setup. He&apos;s describing exactly what Kiran&apos;s data showed — he didn&apos;t add a recording in his first session. But why?</>)}
          {para(<>Priya: &ldquo;What did you do when you weren&apos;t sure what to do?&rdquo;</>)}
          {para(<>Rahul laughs a little. &ldquo;Honestly? Opened another tab. Checked some emails. Told myself I&apos;d come back and figure it out properly when I had more time.&rdquo;</>)}
          {para(<>Priya makes her first mistake: &ldquo;Did you find it confusing?&rdquo;</>)}
          {para(<>Rahul: &ldquo;A little, yeah.&rdquo;</>)}
          {para(<>Priya writes: &ldquo;User found product confusing.&rdquo; She moves to her next question. But a Slack message pops up from Asha, who&apos;s been reading the transcript in real time: <em>&ldquo;Don&apos;t accept &apos;confusing.&apos; Ask what was confusing. Dig.&rdquo;</em></>)}
          {para(<>Priya: &ldquo;Sorry — going back for a second. When you say confusing, can you be more specific about what felt unclear?&rdquo;</>)}
          {para(<>Rahul: &ldquo;I knew I was supposed to add call recordings. But I didn&apos;t understand... what I was supposed to do with them. Like, what am I looking for? What does good coaching sound like? I&apos;ve been a manager for 3 years but I&apos;ve never actually heard someone tell me what great sales coaching looks like in a recording. The product just gave me the tool. It didn&apos;t tell me how to use it.&rdquo;</>)}
          {para(<>Priya goes very still. <em>That</em> is not an onboarding problem.</>)}
        </div>

        <div className="rv">
          <ConversationScene
            mentor="asha" name="Asha" role="Senior PM · EdSpark" accent="var(--purple)"
            lines={[
              { speaker: 'priya', text: "So my 14 screens were completely wrong. The problem isn\u2019t navigation. It\u2019s not even onboarding confusion." },
              { speaker: 'other', text: "The product gave him a toolbox without showing him how to use a single tool. He\u2019d still churn at exactly the same point even if you\u2019d shipped everything you designed." },
              { speaker: 'priya', text: "And the follow-up question was what made the difference." },
              { speaker: 'other', text: "Always. \u2018Can you be more specific?\u2019 is the whole job. The insight lives in the second answer, not the first." },
            ]}
          />
          <Avatar
            name="Asha"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>Rahul didn&apos;t churn because the product was confusing. He churned because EdSpark assumes managers already know what great coaching looks like. They don&apos;t. That&apos;s a completely different problem than UX confusion \u2014 and a completely different solution.</>}
            expandedContent={<>After the call, Priya tags the transcript in Dovetail: &ldquo;doesn&apos;t know what good looks like.&rdquo; And: &ldquo;job is proving value to director.&rdquo; She has five more interviews to run. But she already has a hypothesis to test: EdSpark assumes expertise the user was never given.</>}
            conceptId="user-research"
            question="Midway through an interview, Rahul says 'I wasn't sure what to do next.' You should:"
            options={[
              { text: "Note 'user felt lost' and move to the next question", correct: false, feedback: "'Wasn't sure what to do next' is an observation, not an insight. What did he try? What was he expecting to see? What would have made it clear? The follow-up is the actual research." },
              { text: "Ask: 'When you say you weren't sure — can you walk me through what you tried?'", correct: true, feedback: "Exactly. 'Tell me more' and 'walk me through what you tried' are the two most powerful follow-ups in research. Priya used them — and Rahul's answer changed her entire understanding of the problem." },
              { text: "Validate: 'Did you find it confusing?'", correct: false, feedback: "This is leading — you're suggesting the answer. Rahul said 'a little yeah' because it seemed like what Priya wanted to hear. It's confirmation bias disguised as research." },
            ]}
          />
        </div>

        <div className="rv">
          {pullQuote("The insight isn't in the first answer. It's in the question after the first answer.", 'var(--coral)')}

          <InterviewQuality />

          <InfoBox title="The 5 rules Priya learned the hard way" accent="var(--coral)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { num: '01', rule: "Ask about what happened, not what they'd do", detail: "'Walk me through your first session' beats 'would you use this feature' every time." },
                { num: '02', rule: 'Never suggest the answer', detail: '"Did you find it confusing?" vs "What felt unclear?" — the first one gave Priya a useless answer.' },
                { num: '03', rule: "Don't accept the first answer", detail: "Rahul's breakthrough came when Priya asked a follow-up Asha pushed her to ask. The real insight is almost never in the first sentence." },
                { num: '04', rule: 'Silence is a tool', detail: 'Three seconds of silence after an answer. Users often add the most important thing after they think you\'re done listening.' },
                { num: '05', rule: 'The story is the research', detail: 'Drop your question list. Follow what the user is telling you. The unexpected thread is usually where the real problem lives.' },
              ].map(item => (
                <div key={item.num} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: 'var(--coral)', flexShrink: 0, paddingTop: '3px' }}>{item.num}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)', marginBottom: '3px' }}>{item.rule}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </InfoBox>

          <QuizEngine conceptId="user-research" conceptName="Interview Technique" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[3]} />
        </div>
      </ChapterSection>

      {/* ── PART 5: Synthesis ── */}
      <ChapterSection num="05" accentRgb="21,129,88" id="m2-synthesis">
        <div className="rv">
          {chLabel('Part 5 · Insight Synthesis', 'var(--green)')}
          {h2(<>Eight pages of notes. Three things that matter.</>)}

          <SituationCard accent="var(--green)" accentRgb="21,129,88">
            Wednesday afternoon. Priya has run 6 interviews. She&apos;s added all six transcripts to Dovetail. Now she&apos;s in the tagging phase — reading each interview, highlighting key moments, applying tags. It&apos;s slow. It&apos;s also where the actual research happens.
          </SituationCard>

          {para(<>Tag: <em>&ldquo;doesn&apos;t know what good looks like&rdquo;</em> — Rahul, interview 1. She keeps reading.</>)}
          {para(<>Interview 2: Kavita, a sales manager at a 7-person team. &ldquo;I connected everything, set it up, and then I opened a recording and just... watched it. I didn&apos;t know what I was looking for. Was that a good call? A bad one? I had no frame of reference.&rdquo; Tag: <em>&ldquo;doesn&apos;t know what good looks like.&rdquo;</em></>)}
          {para(<>Interview 3: Sanjay. Different team, different city, different role. But at minute 12 he says: &ldquo;I kept hoping the product would tell me what to do with the data. Like, here&apos;s what this means about your team.&rdquo; Tag: <em>&ldquo;doesn&apos;t know what good looks like.&rdquo;</em></>)}
          {para(<>By interview 5, the same tag has appeared in 5 of 5 sessions. Priya looks at her Dovetail board. That tag — unprompted, across five independent conversations — is glowing. It&apos;s not confirmation bias. It&apos;s a pattern.</>)}
          {para(<>The 6th interview is different. Mihir had a billing issue on day 2 and gave up. That&apos;s its own problem, logged separately. It doesn&apos;t dilute the pattern in the other five.</>)}
        </div>

        <div className="rv">
          <ConversationScene
            mentor="maya" name="Maya" role="Designer · EdSpark" accent="var(--coral)"
            lines={[
              { speaker: 'priya', text: "I\u2019ve tagged all six interviews. The \u2018doesn\u2019t know what good looks like\u2019 tag shows up in five of them. Is that my finding?" },
              { speaker: 'other', text: "That\u2019s your signal. Dovetail shows you which themes appear across the most interviews \u2014 5 of 6 is hard to argue with. But the tool doesn\u2019t tell you what it means." },
              { speaker: 'priya', text: "They didn\u2019t just have trouble with a feature. They had no frame of reference for good coaching at all." },
              { speaker: 'other', text: "That\u2019s not in the data. That\u2019s your synthesis. EdSpark gives them a mirror \u2014 nobody gave them a benchmark. That\u2019s a completely different problem than UX confusion." },
            ]}
          />
          <Avatar
            name="Maya"
            nameColor="var(--coral)"
            borderColor="var(--coral)"
            content={<>A note is what happened. An insight is what it means. &ldquo;User didn&apos;t know what to do after setup&rdquo; is a note. &ldquo;EdSpark assumes managers know what great coaching looks like \u2014 but most of them have never been taught&rdquo; is an insight. That&apos;s the goal of synthesis.</>}
            expandedContent={<>An insight explains the pattern, points to a root cause, and implies a direction without dictating a solution. If your synthesis is just a summary of observations, you haven&apos;t synthesized yet.</>}
            conceptId="insight-synthesis"
            question="After 6 interviews you have 8 pages of notes. 5 of 6 users mentioned not knowing what to do after setup. 1 user had a billing issue. How do you weight these?"
            options={[
              { text: "Report both equally — every user's feedback matters and should carry equal weight in synthesis", correct: false, feedback: "All feedback is data — but not all data is equal. 5/6 independent users saying the same thing unprompted is a pattern. 1 user with a billing issue is a separate problem that needs its own investigation." },
              { text: "5/6 on 'no clear next step' is your signal; note billing as a separate issue", correct: true, feedback: "Exactly. Priya's report led with the 5/6 pattern. The billing issue was noted in an appendix as 'worth investigating separately.' Weighted correctly, the findings are clear." },
              { text: "Run more interviews until you see billing mentioned at least twice more before deciding", correct: false, feedback: "You'd be chasing a pattern that probably doesn't exist. 6 interviews on a consistent theme is enough to act. Do more research if you're uncertain — not to balance a clear finding against an outlier." },
            ]}
          />
        </div>

        <div className="rv">
          {para(<>By Thursday morning, Priya has her synthesis. From 8 pages of notes, three insights:</>)}

          <InfoBox title="Priya's Three Findings — from 6 interviews via Dovetail" accent="var(--green)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                {
                  num: '1', tag: '5 of 6 interviews', insight: 'No benchmark for good',
                  detail: "Managers set up EdSpark and open recordings — but don't know what to look for. They've never been shown what great sales coaching sounds like. EdSpark provides the mirror; nobody provided the reference.",
                  implication: "The problem isn't feature confusion — it's missing context. The product assumes expertise the user doesn't have.",
                },
                {
                  num: '2', tag: '4 of 6 interviews', insight: 'Job is visibility, not improvement',
                  detail: "Managers signed up not to improve coaching but to prove to their director that they were responding to a performance problem. They need evidence of action as much as actual coaching improvement.",
                  implication: "The product needs to make coaching effort visible quickly — not just track it quietly in the background.",
                },
                {
                  num: '3', tag: '3 of 6 interviews', insight: 'No signal that it\'s working',
                  detail: "After adding recordings, managers had no way to tell if anything was improving. No before/after, no benchmark, no nudge from the product.",
                  implication: "Without a signal of progress, there's no reason to come back. The product has no activation moment — no early win.",
                },
              ].map(item => (
                <div key={item.num} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--ed-rule)' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '6px', alignItems: 'flex-start' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(21,129,88,0.15)', border: '1px solid rgba(21,129,88,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, color: 'var(--green)', flexShrink: 0, marginTop: '1px' }}>{item.num}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)' }}>{item.insight}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--green)', background: 'rgba(21,129,88,0.1)', padding: '2px 7px', borderRadius: '10px' }}>{item.tag}</div>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65, marginBottom: '6px' }}>{item.detail}</div>
                      <div style={{ fontSize: '11px', color: 'var(--green)', lineHeight: 1.6, fontStyle: 'italic' }}>→ {item.implication}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </InfoBox>

          <DovetailTaggingSession />

          {pullQuote("A note is what happened. An insight is what it means. Synthesis is the gap between them.", 'var(--green)')}

          <QuizEngine conceptId="insight-synthesis" conceptName="Insight Synthesis" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[5]} />
        </div>
      </ChapterSection>

      {/* ── PART 6: Discovery Brief ── */}
      <ChapterSection num="06" accentRgb="181,114,10" id="m2-problem-statement">
        <div className="rv">
          {chLabel('Part 6 · The Discovery Brief', 'var(--amber)')}
          {h2(<>One page that unlocks the whole team</>)}

          <SituationCard accent="var(--amber)" accentRgb="181,114,10">
            Thursday evening. The stakeholder call is tomorrow at 10am. Priya opens Notion and starts writing her brief. Her first draft begins: &ldquo;Based on user interviews, I recommend adding example coaching sessions to the onboarding flow...&rdquo; She sends it to Asha. Asha replies in 3 minutes: &ldquo;You led with a solution. What did you discover?&rdquo;
          </SituationCard>

          {para(<>Priya stares at the screen. She&apos;s been sitting on this hypothesis since Rahul&apos;s interview two days ago. She knows what she wants to build. She&apos;s already thought about how it would work. But Asha is right — the brief is supposed to describe the problem, not prescribe the answer.</>)}
          {para(<>She deletes everything after the first paragraph and starts again.</>)}
          {para(<>The second draft: &ldquo;Sales managers at small teams (5–20 reps) sign up for EdSpark with one job in mind: prove to their leadership that they&apos;re responding to a performance problem. But the product assumes they already know what great coaching looks like. They don&apos;t. So they complete setup, open a recording, and have no frame of reference for what they&apos;re seeing. 5 of 6 churned managers described a version of this: &lsquo;I didn&apos;t know what I was supposed to be creating.&rsquo; The product has never shown them what success looks like.&rdquo;</>)}
          {para(<>She shows it to Asha. A single reply: &ldquo;That&apos;s it.&rdquo;</>)}
        </div>

        <div className="rv">
          <ConversationScene
            mentor="dev" name="Dev" role="Engineer · EdSpark" accent="var(--blue)"
            lines={[
              { speaker: 'other', text: "Priya walked in Friday with one page. Rohan read it in 90 seconds, looked up, and said \u2018What\u2019s the fix?\u2019" },
              { speaker: 'priya', text: "I have a hypothesis \u2014 but I want to hear what the team thinks first." },
              { speaker: 'other', text: "What if we showed an anonymised example coaching session the first time you add a recording? A real before/after call. I can build that in a day. Maya said: or a 60-second video. Kiran said: A/B test both." },
              { speaker: 'priya', text: "None of those were in my original plan." },
              { speaker: 'other', text: "On Monday with 14 wireframes, I would have built exactly what you asked for. It would have been wrong. On Friday you gave us the problem. We built the right thing together." },
            ]}
          />
          <Avatar
            name="Dev"
            nameColor="var(--blue)"
            borderColor="var(--blue)"
            content={<>When a PM presents a clear problem, the team&apos;s collective intelligence \u2014 engineering&apos;s knowledge of what&apos;s feasible, design&apos;s knowledge of what&apos;s usable, analytics&apos;s knowledge of what&apos;s measurable \u2014 produces better ideas than any one person could generate alone.</>}
            expandedContent={<>The PM&apos;s job is to make the problem so clear that the solution becomes obvious. Not to arrive with both. That&apos;s the brief&apos;s job \u2014 and why it ends with a question, not an answer.</>}
            conceptId="problem-framing"
            question="You've written your discovery brief. How do you open the Friday meeting with Rohan?"
            options={[
              { text: "\"My recommendation: add coaching examples to onboarding. I've mapped out a two-sprint delivery plan to share.\"", correct: false, feedback: "You've already decided — and the meeting becomes a presentation, not a problem-solving session. Dev wouldn't have proposed the before/after idea if Priya had arrived with wireframes." },
              { text: "\"We found that managers use EdSpark to prove their coaching works — but the product never shows what good looks like.\"", correct: true, feedback: "This is exactly what Priya did. She led with the discovery, not the solution. In ten minutes, the team generated three solutions she hadn't thought of — including one that was better than her original idea." },
              { text: "\"There were interesting patterns in the interviews — but I'd like to gather more data before presenting any conclusions to the team.\"", correct: false, feedback: "5 of 6 churned managers saying the same thing unprompted is enough to act. 'Needs more research' is sometimes avoidance — a way of delaying the discomfort of commitment." },
            ]}
          />
        </div>

        <div className="rv">
          {pullQuote("Make the problem so clear that the solution becomes obvious. That's the PM's job in discovery.", 'var(--amber)')}

          <DiscoveryBriefBuilder />

          <PMPrincipleBox
            principle="Symptom → Research → Insight → Brief → Ideation. Discovery is not a phase — it's the habit that separates PMs who build the right thing from PMs who build things right."
          />

          <QuizEngine conceptId="problem-framing" conceptName="Problem Framing" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[6]} />
        </div>
      </ChapterSection>

      {/* ── FINAL REFLECTION ── */}
      <ChapterSection num="07" accentRgb="120,67,238" id="m2-reflection">
        <div className="rv">
          {chLabel('Final Reflection · Module 02', 'var(--purple)')}
          {h2(<>What changed between Monday and Friday</>)}

          {para(<>Monday morning: 14 Figma screens. A redesigned onboarding for a problem that didn&apos;t exist. Two days of weekend work pointed in completely the wrong direction.</>)}
          {para(<>Friday morning: one page. Three insights. A brief that took ten minutes to produce three better ideas than the one Priya had arrived with on Monday.</>)}
          {para(<>She didn&apos;t know what the problem was until she asked. The Amplitude data gave her where. Kraftful gave her a starting hypothesis. The interviews gave her why. Dovetail helped her see the pattern. The brief turned the pattern into something her team could act on.</>)}
          {para(<>None of that required genius. It required asking before building.</>)}

          {pullQuote("Discovery is not a phase. It's the habit you build to stop solving the wrong problems.", 'var(--purple)')}

          <InfoBox title="The full toolkit Priya used this week" accent="var(--purple)">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { icon: '🔭', label: 'Discovery first', text: 'Resist the solution. Kiran\'s data, not Figma.' },
                { icon: '👥', label: 'Segmentation', text: 'Managers ≠ reps. Different jobs, different problems.' },
                { icon: '💼', label: 'JTBD', text: 'Rahul\'s job: prove coaching works to his director.' },
                { icon: '📊', label: 'Amplitude + Kraftful', text: 'Where it breaks + what users already say.' },
                { icon: '🎤', label: 'Interviews', text: 'Follow the story. Follow-ups over question lists.' },
                { icon: '🗂️', label: 'Dovetail + Notion', text: 'Tag, cluster, find the pattern. Then write the brief.' },
              ].map(item => (
                <div key={item.label} style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(120,67,238,0.06)', border: '1px solid rgba(120,67,238,0.15)' }}>
                  <div style={{ fontSize: '18px', marginBottom: '6px' }}>{item.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>{item.text}</div>
                </div>
              ))}
            </div>
          </InfoBox>
        </div>

        <div className="rv">
          <QuizEngine conceptId="jtbd" conceptName="Jobs to Be Done" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[4]} />

          <ApplyItBox
            prompt="Pick one thing your team is building right now. Write the job: '[User type] is trying to [accomplish what] in [what situation].' Now ask: have you talked to anyone who's failed to accomplish that job? If not — that's this week's research."
          />

          <NextChapterTeaser
            text="Module 03 · Problem Framing & Prioritization — Priya has three insights and a brief. Now: which one does she solve first? And how does she make that case to a team that wants to build all three?"
          />
        </div>
      </ChapterSection>
    </>
  );
}

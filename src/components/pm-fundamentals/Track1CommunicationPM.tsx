'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  h2, para, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, ApplyItBox, ConversationScene, CharacterChip,
} from './designSystem';
import { MentorFace } from './MentorFaces';
import QuizEngine from '../QuizEngine';
import { CommunicationPrism, NarrativeStaircase, RoadmapPressureChamber } from './CommTools3D';

const ACCENT     = '#0284C7';
const ACCENT_RGB = '2,132,199';
const MODULE_NUM = '06';
const MODULE_LABEL = 'Effective Communication';

const PARTS = [
  { num: '01', id: 'm6-comm-job',     label: 'Communication Is the Job' },
  { num: '02', id: 'm6-stakeholders', label: 'Stakeholder Communication Across Levels' },
  { num: '03', id: 'm6-prd',          label: 'Writing a Great PRD with AI' },
  { num: '04', id: 'm6-storytelling', label: 'Storytelling for PMs' },
  { num: '05', id: 'm6-b2b',          label: 'B2B Communication & Sales Enablement' },
  { num: '06', id: 'm6-conflict',     label: 'Difficult Conversations' },
  { num: '07', id: 'm6-executive',    label: 'Executive Communication & Roadmaps' },
];

// ─────────────────────────────────────────
// PM PRINCIPLE CARD
// ─────────────────────────────────────────
const PMPrinciple = ({ text }: { text: string }) => (
  <div style={{ margin: '28px 0', padding: '20px 24px', background: `rgba(${ACCENT_RGB},0.06)`, borderLeft: `4px solid ${ACCENT}`, borderRadius: '0 8px 8px 0' }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: ACCENT, marginBottom: '8px', textTransform: 'uppercase' as const }}>PM Principle</div>
    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.65, fontStyle: 'italic', fontFamily: "'Lora', serif" }}>&ldquo;{text}&rdquo;</div>
  </div>
);

// ─────────────────────────────────────────
// TOOL 1 · STAKEHOLDER SIGNAL ROOM (Parts 1–2)
// ─────────────────────────────────────────
const cards = [
  { id: 'c1', text: '34% of search attempts fail',        correct: 'leadership', hint: 'Business impact belongs with leadership.' },
  { id: 'c2', text: 'Users search by contact name, not date', correct: 'design',  hint: 'User behaviour guides design decisions.' },
  { id: 'c3', text: 'Transcript search is not committed', correct: 'sales',       hint: 'Scope clarity protects sales messaging.' },
  { id: 'c4', text: 'Dependency: backend indexing work',  correct: 'engineering', hint: 'Technical dependencies belong with engineering.' },
  { id: 'c5', text: 'Primary user is returning account owner', correct: 'design', hint: 'Who we are designing for guides design choices.' },
  { id: 'c6', text: 'Expected impact: improved repeat usage', correct: 'leadership', hint: 'Business outcomes matter most to leadership.' },
  { id: 'c7', text: 'Need customer-safe wording for launch', correct: 'sales',    hint: 'External messaging is a GTM concern.' },
];
const buckets = ['engineering', 'design', 'leadership', 'sales'] as const;
type Bucket = typeof buckets[number];
const bucketLabels: Record<Bucket, string> = { engineering: 'Engineering', design: 'Design', leadership: 'Leadership', sales: 'Sales / CS' };
const bucketColors: Record<Bucket, string> = { engineering: '#3A86FF', design: '#C85A40', leadership: '#7843EE', sales: '#059669' };

const StakeholderSignalRoom = () => {
  const [assignments, setAssignments] = useState<Record<string, Bucket | null>>(() => Object.fromEntries(cards.map(c => [c.id, null])));
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'wrong' | null>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const assign = (bucket: Bucket) => {
    if (!selected) return;
    const card = cards.find(c => c.id === selected)!;
    const isCorrect = card.correct === bucket;
    setAssignments(prev => ({ ...prev, [selected]: bucket }));
    setFeedback(prev => ({ ...prev, [selected]: isCorrect ? 'correct' : 'wrong' }));
    setSelected(null);
    const newAssignments = { ...assignments, [selected]: bucket };
    if (Object.values(newAssignments).every(v => v !== null)) setDone(true);
  };

  const unassigned = cards.filter(c => assignments[c.id] === null);
  const allCorrect = cards.every(c => feedback[c.id] === 'correct');

  return (
    <div style={{ margin: '32px 0', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ background: `rgba(${ACCENT_RGB},0.08)`, borderBottom: '1px solid var(--ed-rule)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '16px' }}>🎯</span>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>Stakeholder Signal Room</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Click a card, then click the right stakeholder bucket.</div>
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        {/* Unassigned cards */}
        {unassigned.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>MESSAGES TO SORT</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
              {unassigned.map(card => (
                <motion.div key={card.id} whileHover={{ y: -2 }} onClick={() => setSelected(selected === card.id ? null : card.id)}
                  style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px', color: 'var(--ed-ink)', cursor: 'pointer', background: selected === card.id ? `rgba(${ACCENT_RGB},0.12)` : 'var(--ed-cream)', border: `1.5px solid ${selected === card.id ? ACCENT : 'var(--ed-rule)'}`, transition: 'all 0.15s', fontWeight: selected === card.id ? 600 : 400 }}>
                  {card.text}
                </motion.div>
              ))}
            </div>
          </div>
        )}
        {/* Buckets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {buckets.map(bucket => {
            const assigned = cards.filter(c => assignments[c.id] === bucket);
            return (
              <motion.div key={bucket} whileHover={selected ? { scale: 1.01 } : {}} onClick={() => assign(bucket)}
                style={{ borderRadius: '10px', border: `2px dashed ${selected ? bucketColors[bucket] : 'var(--ed-rule)'}`, padding: '14px', minHeight: '90px', cursor: selected ? 'pointer' : 'default', background: selected ? `${bucketColors[bucket]}08` : 'var(--ed-card)', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: bucketColors[bucket], fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>{bucketLabels[bucket].toUpperCase()}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                  {assigned.map(card => (
                    <div key={card.id} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: feedback[card.id] === 'correct' ? `${bucketColors[bucket]}20` : '#fef2f2', border: `1px solid ${feedback[card.id] === 'correct' ? bucketColors[bucket] : '#fca5a5'}`, color: feedback[card.id] === 'correct' ? 'var(--ed-ink)' : '#dc2626' }}>
                      {feedback[card.id] === 'correct' ? '✓ ' : '✗ '}{card.text}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* Feedback for wrong answers */}
        {cards.filter(c => feedback[c.id] === 'wrong' && assignments[c.id] !== null).map(card => (
          <motion.div key={card.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fca5a5', fontSize: '12px', color: '#dc2626' }}>
            <strong>{card.text}</strong> — {card.hint}
          </motion.div>
        ))}
        {/* Completion */}
        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '16px', padding: '16px 20px', borderRadius: '10px', background: allCorrect ? `rgba(${ACCENT_RGB},0.08)` : 'var(--ed-cream)', border: `1px solid ${allCorrect ? ACCENT : 'var(--ed-rule)'}`, textAlign: 'center' as const }}>
            <div style={{ fontSize: '22px', marginBottom: '8px' }}>{allCorrect ? '🎯' : '💡'}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '4px' }}>One project. Four messages. That is PM communication.</div>
            <div style={{ fontSize: '12px', color: 'var(--ed-ink3)' }}>Each stakeholder needs different context to act well — not more information, the right information.</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// TOOL 2 · AI PRD STUDIO (Part 3)
// ─────────────────────────────────────────
const prdInputs = [
  { id: 'i1', text: 'Users can\'t find recordings from specific contacts', section: 'problem' },
  { id: 'i2', text: '34% search failure rate', section: 'evidence' },
  { id: 'i3', text: 'Most searches are by contact name', section: 'evidence' },
  { id: 'i4', text: 'Transcript search adds 4 more weeks', section: 'nongoal' },
  { id: 'i5', text: 'Sales wants enterprise team filters too', section: 'openq' },
  { id: 'i6', text: 'Need a measurable win this quarter', section: 'metric' },
];
const prdSections = [
  { id: 'problem', label: 'Problem Statement' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'metric', label: 'Success Metric' },
  { id: 'nongoal', label: 'Non-Goals' },
  { id: 'openq', label: 'Open Questions' },
];
const aiDraft = `**Problem:** Users struggle to locate past call recordings, impacting workflow efficiency.

**Evidence:** 34% of search attempts fail. Users primarily search by contact name.

**Success Metric:** Improve search success rate from 66% to 85% within 30 days of launch.

**Non-Goals:** Transcript search, team-based filtering (future phases).

**Open Questions:** Should enterprise accounts get custom filter options?`;

const pmDraft = `**Problem:** Users frequently cannot retrieve past call recordings with specific contacts, causing repeated friction in a high-frequency workflow.

**Evidence:** 34% of search attempts end without a result. Search behaviour analysis shows contact-name search is 3x more common than date-based search.

**Success Metric:** Search success rate ≥85% within 30 days. Secondary: repeat usage of search feature +20%.

**Non-Goals (explicit):** Transcript-level search and team filtering are intentionally excluded from v1 to maintain a committable timeline this quarter.

**Open Questions:** Enterprise filter demand from sales — needs validation before committing.`;

const AIPRDStudio = () => {
  const [placed, setPlaced] = useState<Record<string, string | null>>(() => Object.fromEntries(prdInputs.map(i => [i.id, null])));
  const [selected, setSelected] = useState<string | null>(null);
  const [stage, setStage] = useState<'sort' | 'ai' | 'review'>('sort');
  const [blindAccept, setBlindAccept] = useState(false);

  const allPlaced = Object.values(placed).every(v => v !== null);

  const placeInput = (sectionId: string) => {
    if (!selected) return;
    setPlaced(prev => ({ ...prev, [selected]: sectionId }));
    setSelected(null);
  };

  return (
    <div style={{ margin: '32px 0', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ background: `rgba(${ACCENT_RGB},0.08)`, borderBottom: '1px solid var(--ed-rule)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '16px' }}>📋</span>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>AI PRD Studio</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>
            {stage === 'sort' ? 'Step 1: Sort raw inputs into PRD sections.' : stage === 'ai' ? 'Step 2: Review the AI-generated draft.' : 'Step 3: Compare AI draft vs PM-reviewed version.'}
          </div>
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        {stage === 'sort' && (
          <>
            {/* Unplaced inputs */}
            {prdInputs.filter(i => placed[i.id] === null).length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>RAW INPUTS — click one, then click a section</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
                  {prdInputs.filter(i => placed[i.id] === null).map(input => (
                    <motion.div key={input.id} whileHover={{ y: -2 }} onClick={() => setSelected(selected === input.id ? null : input.id)}
                      style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px', color: 'var(--ed-ink)', cursor: 'pointer', background: selected === input.id ? `rgba(${ACCENT_RGB},0.12)` : 'var(--ed-cream)', border: `1.5px solid ${selected === input.id ? ACCENT : 'var(--ed-rule)'}`, transition: 'all 0.15s' }}>
                      {input.text}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
              {prdSections.map(sec => (
                <motion.div key={sec.id} onClick={() => placeInput(sec.id)} whileHover={selected ? { x: 4 } : {}}
                  style={{ padding: '12px 16px', borderRadius: '8px', border: `1.5px dashed ${selected ? ACCENT : 'var(--ed-rule)'}`, cursor: selected ? 'pointer' : 'default', background: selected ? `rgba(${ACCENT_RGB},0.04)` : 'var(--ed-card)', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>{sec.label.toUpperCase()}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                    {prdInputs.filter(i => placed[i.id] === sec.id).map(input => (
                      <div key={input.id} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: `rgba(${ACCENT_RGB},0.1)`, border: `1px solid ${ACCENT}`, color: 'var(--ed-ink)' }}>
                        {input.text}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            {allPlaced && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setStage('ai')}
                style={{ marginTop: '16px', padding: '10px 24px', borderRadius: '8px', background: ACCENT, color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', width: '100%' }}>
                Generate AI Draft →
              </motion.button>
            )}
          </>
        )}
        {stage === 'ai' && (
          <>
            <div style={{ padding: '16px', borderRadius: '8px', background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#6b7280', marginBottom: '12px', letterSpacing: '0.1em' }}>AI GENERATED DRAFT</div>
              <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.75, whiteSpace: 'pre-line' as const }}>{aiDraft}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <motion.button whileHover={{ opacity: 0.85 }} onClick={() => { setBlindAccept(true); setStage('review'); }}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#374151', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Accept AI Draft
              </motion.button>
              <motion.button whileHover={{ opacity: 0.85 }} onClick={() => { setBlindAccept(false); setStage('review'); }}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', background: ACCENT, color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Review &amp; Refine →
              </motion.button>
            </div>
          </>
        )}
        {stage === 'review' && (
          <>
            {blindAccept && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fca5a5' }}>
                <div style={{ fontSize: '13px', color: '#dc2626', fontWeight: 600 }}>⚠ This draft sounds polished, but the PM still needs to verify whether the framing, scope, and tradeoffs are actually correct.</div>
              </motion.div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', marginBottom: '8px' }}>AI DRAFT</div>
                <div style={{ padding: '14px', borderRadius: '8px', background: '#0d1117', border: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: '#9ca3af', lineHeight: 1.7, whiteSpace: 'pre-line' as const }}>{aiDraft}</div>
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.1em', marginBottom: '8px' }}>PM REVIEWED</div>
                <div style={{ padding: '14px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.06)`, border: `1px solid ${ACCENT}40`, fontSize: '12px', color: 'var(--ed-ink)', lineHeight: 1.7, whiteSpace: 'pre-line' as const }}>{pmDraft}</div>
              </div>
            </div>
            <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', textAlign: 'center' as const }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)' }}>AI improves drafting speed. PM judgment protects product quality.</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// TOOL 3 · NARRATIVE BOARDROOM (Part 4)
// ─────────────────────────────────────────
const narrativeBlocks = [
  { id: 'n1', label: 'Context',          text: 'EdSpark onboarding completion is 22%. Target was 60%.', correctPos: 1 },
  { id: 'n2', label: 'Problem',          text: 'Users consistently drop off before completing setup.', correctPos: 2 },
  { id: 'n3', label: 'Evidence',         text: '34% of search attempts fail. Most searches are by contact name, not date.', correctPos: 3 },
  { id: 'n4', label: 'Why Now',          text: 'Q2 is our retention quarter. The board sees these numbers next month.', correctPos: 4 },
  { id: 'n5', label: 'Proposed Path',    text: 'Contact-first search in v1. Transcript search in v2 after validation.', correctPos: 5 },
  { id: 'n6', label: 'Ask',             text: 'Approve scope without transcript search to hit the committed timeline.', correctPos: 6 },
];

const NarrativeBoardroom = () => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const addBlock = (id: string) => {
    if (sequence.includes(id)) return;
    setSequence(prev => [...prev, id]);
  };
  const removeBlock = (id: string) => {
    if (submitted) return;
    setSequence(prev => prev.filter(s => s !== id));
  };

  const isCorrect = () => sequence.every((id, idx) => {
    const block = narrativeBlocks.find(b => b.id === id)!;
    return block.correctPos === idx + 1;
  }) && sequence.length === narrativeBlocks.length;

  const startsWithSolution = sequence.length > 0 && ['n5', 'n6'].includes(sequence[0]);

  return (
    <div style={{ margin: '32px 0', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ background: `rgba(${ACCENT_RGB},0.08)`, borderBottom: '1px solid var(--ed-rule)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '16px' }}>🎬</span>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>Narrative Boardroom</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Click blocks in the order that makes the strongest PM story.</div>
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        {/* Available blocks */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>STORY BLOCKS — click to add in order</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
            {narrativeBlocks.filter(b => !sequence.includes(b.id)).map(block => (
              <motion.div key={block.id} whileHover={{ y: -2 }} onClick={() => addBlock(block.id)}
                style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px', color: 'var(--ed-ink)', cursor: 'pointer', background: 'var(--ed-cream)', border: '1.5px solid var(--ed-rule)', transition: 'all 0.15s' }}>
                <span style={{ fontWeight: 700, color: ACCENT }}>{block.label}</span>: {block.text}
              </motion.div>
            ))}
          </div>
        </div>
        {/* Sequence */}
        <div style={{ background: '#0d1117', borderRadius: '10px', padding: '16px', minHeight: '120px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#6b7280', marginBottom: '12px', letterSpacing: '0.1em' }}>YOUR NARRATIVE SEQUENCE</div>
          {sequence.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#4b5563', fontStyle: 'italic' }}>Click blocks above to build your story...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
              {sequence.map((id, idx) => {
                const block = narrativeBlocks.find(b => b.id === id)!;
                return (
                  <div key={id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff', flexShrink: 0, marginTop: '1px' }}>{idx + 1}</div>
                    <div style={{ flex: 1, fontSize: '12px', color: '#e2e8f0', lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 700, color: ACCENT }}>{block.label}:</span> {block.text}
                    </div>
                    <div onClick={() => removeBlock(id)} style={{ color: '#6b7280', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}>×</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Feedback */}
        <AnimatePresence>
          {startsWithSolution && !submitted && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fca5a5', fontSize: '12px', color: '#dc2626' }}>
              You started with the answer before building urgency. Try leading with context and the problem first.
            </motion.div>
          )}
        </AnimatePresence>
        {sequence.length === narrativeBlocks.length && !submitted && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSubmitted(true)}
            style={{ marginTop: '12px', width: '100%', padding: '10px', borderRadius: '8px', background: ACCENT, color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Submit Narrative →
          </motion.button>
        )}
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '12px', padding: '16px 20px', borderRadius: '10px', background: isCorrect() ? `rgba(${ACCENT_RGB},0.08)` : 'var(--ed-cream)', border: `1px solid ${isCorrect() ? ACCENT : 'var(--ed-rule)'}`, textAlign: 'center' as const }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>{isCorrect() ? '🎯' : '💡'}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '6px' }}>
              {isCorrect() ? 'Good PM storytelling builds shared understanding before pushing action.' : 'The strongest order: Context → Problem → Evidence → Why Now → Path → Ask'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ed-ink3)' }}>Without tension, the work feels optional. Without evidence, it feels like opinion.</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// TOOL 4 · SALES ENABLEMENT DESK (Part 5)
// ─────────────────────────────────────────
const salesQuestions = [
  {
    id: 'sq1',
    question: 'Can I tell prospects advanced search launches next month?',
    options: [
      { label: 'Yes, should be live next month.', type: 'risky', feedback: 'This creates customer expectation risk — timeline is not committed.' },
      { label: 'Contact-based search is actively being built. Broader search capabilities are being evaluated but we are not committing a date.', type: 'safe', feedback: 'Precise, useful, and non-misleading. This is exactly the right framing.' },
      { label: 'I\'m not sure, check back later.', type: 'vague', feedback: 'This protects you, but does not help sales communicate clearly.' },
    ],
  },
  {
    id: 'sq2',
    question: 'Can we promise transcript search support?',
    options: [
      { label: 'Yes, transcript search is on our roadmap.', type: 'risky', feedback: '"On roadmap" + customer expectation = future disappointment. Roadmap ≠ commitment.' },
      { label: 'Definitely, we are building it.', type: 'risky', feedback: 'This is a false commitment. Transcript search is not yet scoped.' },
      { label: 'Transcript search is being explored for a future phase — it\'s not committed in the current release.', type: 'safe', feedback: 'Honest, clear, and sets correct expectations without closing the door.' },
    ],
  },
  {
    id: 'sq3',
    question: 'Customer asks if a feature will be live by Q3. Scope is still being validated.',
    options: [
      { label: 'Yes, likely Q3.', type: 'risky', feedback: 'Never confirm a date you haven\'t committed internally. This will come back.' },
      { label: 'It\'s on our radar, but we are not committing to a date yet — we\'re still validating scope.', type: 'safe', feedback: 'This is the PM standard: honest status + not closing the door + no false dates.' },
      { label: 'Sales will update you.', type: 'vague', feedback: 'This deflects rather than communicates. Not helpful to the customer or to sales.' },
    ],
  },
];
const typeColors: Record<string, string> = { safe: '#059669', risky: '#dc2626', vague: '#d97706' };
const typeLabels: Record<string, string> = { safe: 'Safe', risky: 'Risky', vague: 'Too vague' };

const SalesEnablementDesk = () => {
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const choose = (qId: string, optIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setRevealed(prev => ({ ...prev, [qId]: true }));
  };

  return (
    <div style={{ margin: '32px 0', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ background: `rgba(${ACCENT_RGB},0.08)`, borderBottom: '1px solid var(--ed-rule)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '16px' }}>💼</span>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>Sales Enablement Desk</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Choose the best response for each customer or sales question.</div>
        </div>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
        {salesQuestions.map((q, qi) => (
          <div key={q.id}>
            <div style={{ padding: '12px 14px', background: 'var(--ed-cream)', borderRadius: '8px', borderLeft: `3px solid ${ACCENT}`, marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '4px' }}>QUESTION {qi + 1}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)' }}>{q.question}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
              {q.options.map((opt, oi) => {
                const chosen = answers[q.id] === oi;
                const show = revealed[q.id];
                return (
                  <motion.div key={oi} whileHover={!show ? { x: 3 } : {}} onClick={() => !show && choose(q.id, oi)}
                    style={{ padding: '10px 14px', borderRadius: '8px', cursor: show ? 'default' : 'pointer', border: `1.5px solid ${show ? typeColors[opt.type] : chosen ? ACCENT : 'var(--ed-rule)'}`, background: show ? `${typeColors[opt.type]}10` : chosen ? `rgba(${ACCENT_RGB},0.08)` : 'var(--ed-card)', transition: 'all 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ flex: 1, fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.5 }}>{opt.label}</div>
                      {show && <div style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, color: typeColors[opt.type], background: `${typeColors[opt.type]}15`, flexShrink: 0 }}>{typeLabels[opt.type]}</div>}
                    </div>
                    {show && chosen && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${typeColors[opt.type]}30`, fontSize: '12px', color: typeColors[opt.type], lineHeight: 1.6 }}>
                        {opt.feedback}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
        {Object.keys(answers).length === salesQuestions.length && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '14px 18px', borderRadius: '10px', background: `rgba(${ACCENT_RGB},0.08)`, border: `1px solid ${ACCENT}40`, textAlign: 'center' as const }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)' }}>Good B2B PM communication protects trust while still enabling the field.</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// TOOL 5 · EXEC ROADMAP ROOM (Part 7)
// ─────────────────────────────────────────
const roadmapItems = [
  { id: 'r1', text: 'Contact-based search improvement', correct: 'committed' },
  { id: 'r2', text: 'Onboarding redesign — reduce drop-off at Step 2', correct: 'committed' },
  { id: 'r3', text: 'Transcript-level search', correct: 'exploratory' },
  { id: 'r4', text: 'Team-based filtering for enterprise', correct: 'exploratory' },
  { id: 'r5', text: 'Dashboard refresh — UI modernisation', correct: 'exploratory' },
  { id: 'r6', text: 'Approve Q3 resource allocation for enterprise features', correct: 'ask' },
];
const execBuckets = [
  { id: 'committed',  label: 'Committed this quarter', color: '#059669' },
  { id: 'exploratory', label: 'Exploratory / next phase', color: '#d97706' },
  { id: 'ask',        label: 'Leadership ask',           color: '#7843EE' },
];

const ExecRoadmapRoom = () => {
  const [placed, setPlaced] = useState<Record<string, string | null>>(() => Object.fromEntries(roadmapItems.map(r => [r.id, null])));
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const place = (bucketId: string) => {
    if (!selected) return;
    setPlaced(prev => ({ ...prev, [selected]: bucketId }));
    setSelected(null);
    const newPlaced = { ...placed, [selected]: bucketId };
    if (Object.values(newPlaced).every(v => v !== null)) setSubmitted(true);
  };

  const unplaced = roadmapItems.filter(r => placed[r.id] === null);
  const allCorrect = submitted && roadmapItems.every(r => placed[r.id] === r.correct);

  return (
    <div style={{ margin: '32px 0', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ background: `rgba(${ACCENT_RGB},0.08)`, borderBottom: '1px solid var(--ed-rule)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '16px' }}>📊</span>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>Exec Roadmap Room</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Sort roadmap items for a leadership update. Click an item, then click a bucket.</div>
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        {unplaced.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>ROADMAP ITEMS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
              {unplaced.map(item => (
                <motion.div key={item.id} whileHover={{ y: -2 }} onClick={() => setSelected(selected === item.id ? null : item.id)}
                  style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px', color: 'var(--ed-ink)', cursor: 'pointer', background: selected === item.id ? `rgba(${ACCENT_RGB},0.12)` : 'var(--ed-cream)', border: `1.5px solid ${selected === item.id ? ACCENT : 'var(--ed-rule)'}`, transition: 'all 0.15s' }}>
                  {item.text}
                </motion.div>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
          {execBuckets.map(bucket => (
            <motion.div key={bucket.id} onClick={() => place(bucket.id)} whileHover={selected ? { x: 3 } : {}}
              style={{ padding: '12px 16px', borderRadius: '10px', border: `1.5px dashed ${selected ? bucket.color : 'var(--ed-rule)'}`, cursor: selected ? 'pointer' : 'default', background: selected ? `${bucket.color}08` : 'var(--ed-card)', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: bucket.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>{bucket.label.toUpperCase()}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                {roadmapItems.filter(r => placed[r.id] === bucket.id).map(item => {
                  const isCorrect = submitted && item.correct === bucket.id;
                  const isWrong = submitted && item.correct !== bucket.id;
                  return (
                    <div key={item.id} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', background: isWrong ? '#fef2f2' : `${bucket.color}15`, border: `1px solid ${isWrong ? '#fca5a5' : bucket.color}`, color: isWrong ? '#dc2626' : 'var(--ed-ink)' }}>
                      {submitted ? (isCorrect ? '✓' : '✗') : ''} {item.text}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '16px', padding: '16px 20px', borderRadius: '10px', background: allCorrect ? `rgba(${ACCENT_RGB},0.08)` : 'var(--ed-cream)', border: `1px solid ${allCorrect ? ACCENT : 'var(--ed-rule)'}`, textAlign: 'center' as const }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '6px' }}>
              {allCorrect ? 'A roadmap is strongest when it communicates direction, confidence, and tradeoffs — not just features.' : 'A leadership update needs: committed work, what\'s exploratory, and a clear ask.'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ed-ink3)' }}>Leadership does not need a feature diary. They need a legible view of business progress, risk, and decisions needed.</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// EXPORT DEFAULT
// ─────────────────────────────────────────
export default function Track1CommunicationPM({
  completedSections = new Set<string>(),
}: {
  completedSections?: Set<string>;
}) {
  const donePct  = Math.round((completedSections.size / PARTS.length) * 100);
  const nextPart = PARTS.find(p => !completedSections.has(p.id));

  return (
    <article style={{ padding: '0 0 80px' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', padding: '72px 0 48px', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-20px', top: '-10px', fontSize: 'clamp(140px, 18vw, 220px)', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.06)`, fontFamily: "'Lora', Georgia, serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>{MODULE_NUM}</div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '14px', textTransform: 'uppercase' as const }}>
              PM Fundamentals &middot; Module {MODULE_NUM}
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '16px', fontFamily: "'Lora', Georgia, serif" }}>
              {MODULE_LABEL}
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '40px' }}>
              &ldquo;Saying the right thing to the right person at the right level of detail.&rdquo;
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '40px' }}>
              {([
                { mentor: 'priya' as const, accent: ACCENT,    desc: 'Your protagonist. She now understands the PM loop — the harder part is explaining it.' },
                { mentor: 'asha'  as const, accent: '#0097A7', desc: 'Shows Priya that communication is a core PM skill, not a soft extra.' },
                { mentor: 'dev'   as const, accent: '#3A86FF', desc: 'Needs clarity, not speeches.' },
                { mentor: 'maya'  as const, accent: '#C85A40', desc: 'Communicates through user intent, not feature language.' },
                { mentor: 'kiran' as const, accent: '#158158', desc: 'Brings evidence when opinions get loud.' },
                { mentor: 'rohan' as const, accent: '#E67E22', desc: 'Sales pressure, urgency, and external messaging.' },
              ]).map(c => (
                <CharacterChip name={{ priya: 'Priya', asha: 'Asha', dev: 'Dev', maya: 'Maya', kiran: 'Kiran', rohan: 'Rohit' }[c.mentor] as string} role={{ priya: 'APM · EdSpark', asha: 'PM Mentor', dev: 'Engineer', maya: 'Designer', kiran: 'Data Analyst', rohan: 'Sales Lead' }[c.mentor] as string} accent={c.accent}>
                  <MentorFace mentor={c.mentor} size={52} />
                </CharacterChip>
              ))}
            </div>

            <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', borderLeft: `4px solid ${ACCENT}`, border: '1px solid var(--ed-rule)', borderLeftWidth: '4px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>Learning Objectives</div>
              {[
                'Communicate the same initiative differently to engineers, designers, sales, and leadership',
                'Write a structured PRD using AI as a drafting partner — while keeping judgment firmly in your hands',
                'Handle stakeholder conflict, external messaging, and executive updates with clarity',
              ].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 2 ? '10px' : 0, alignItems: 'flex-start' }}>
                  <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '12px', marginTop: '2px' }}>0{i + 1}</span>
                  <span style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dark module card */}
          <div style={{ flexShrink: 0, width: '168px', paddingTop: '48px' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="float3d" style={{ transformStyle: 'preserve-3d' }}>
                <div style={{ background: 'linear-gradient(145deg, #1A1218 0%, #241228 100%)', borderRadius: '14px', padding: '20px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE {MODULE_NUM}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>{MODULE_LABEL}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(240,232,216,0.45)', marginBottom: '16px' }}>Foundations Track</div>
                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
                    <motion.div animate={{ width: `${donePct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ height: '100%', background: ACCENT, borderRadius: '1px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                    {PARTS.map(p => {
                      const done = completedSections.has(p.id);
                      const isNext = p.id === nextPart?.id;
                      return (
                        <div key={p.num} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, background: done ? '#0D7A5A' : isNext ? ACCENT : 'rgba(255,255,255,0.06)', border: `1px solid ${done ? '#0D7A5A' : isNext ? ACCENT : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: done || isNext ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, transition: 'background 0.3s, border-color 0.3s' }}>
                            {done ? '✓' : p.num}
                          </div>
                          <div style={{ fontSize: '9px', color: done ? 'rgba(240,232,216,0.5)' : isNext ? 'rgba(240,232,216,0.9)' : 'rgba(240,232,216,0.3)', lineHeight: 1.3, flex: 1, transition: 'color 0.3s' }}>
                            {p.label.split(' & ')[0].split(' Across')[0]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: '16px', padding: '8px 10px', borderRadius: '6px', background: `${ACCENT}22`, border: `1px solid ${ACCENT}44` }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: ACCENT, fontWeight: 700, marginBottom: '2px' }}>{donePct === 100 ? 'COMPLETE' : 'NEXT UP'}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(240,232,216,0.6)' }}>{donePct === 100 ? 'All 7 parts done' : nextPart ? nextPart.label.split(' & ')[0].split(' Across')[0] : 'Communication Is the Job'}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── PART 1 · COMMUNICATION IS THE JOB ── */}
      <ChapterSection id="m6-comm-job" num="01" accentRgb={ACCENT_RGB} first>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The search improvement project is moving into build. Priya feels good. Then, before lunch, four messages arrive. Dev: <strong>&ldquo;What exactly are we optimizing for in v1?&rdquo;</strong> Maya: <strong>&ldquo;Who is the primary user here?&rdquo;</strong> Rohit from sales: <strong>&ldquo;Can I mention this to customers next week?&rdquo;</strong> Meera, her manager: <strong>&ldquo;What business metric is this expected to move?&rdquo;</strong> Same project. Same week. Four completely different questions.
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "I thought we were aligned. But everyone is asking for different things." },
            { speaker: 'other', text: "They're not asking for different things. They're looking at the same thing from different responsibilities." },
            { speaker: 'priya', text: "So what do I do?" },
            { speaker: 'other', text: "Stop thinking of communication as 'sharing an update.' Start thinking of it as helping each person act well." },
          ]}
        />

        {h2(<>What a PM is really doing when they communicate</>)}

        {para(<>A PM is usually trying to do one or more of these things: explain the problem clearly, align people on what matters now, reduce ambiguity before work begins, make tradeoffs legible, prevent false assumptions, or create trust in uncertainty. That is why communication is not polish. It is operating leverage. A weak PM update creates noise. A strong PM update changes how decisions get made.</>)}

        <CommunicationPrism />

        {keyBox('What each stakeholder needs from you', [
          'Engineering: what problem, what constraints, what is in scope right now',
          'Design: who is the user, what are they trying to do, where does the experience break',
          'Sales / CS: what can I safely say externally, who is this for, what should I not promise',
          'Leadership: why now, what outcome are we driving, what tradeoff are we making',
        ])}

        <PMPrinciple text="Communication is not complete when the PM sends the message. It is complete when the other person can act with clarity." />

        <ApplyItBox prompt="Think of one feature you know well. Write four one-line versions of it — one for engineering, one for design, one for leadership, one for sales. If all four sound identical, you are communicating at the wrong level." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>PM communication is not one message broadcast everywhere. It is context translated for action. Too little detail creates confusion. Too much irrelevant detail creates fog. Both feel like misalignment.</>}
          question="A PM sends the same long update to engineering, sales, design, and leadership. Nobody responds clearly. What is the most likely issue?"
          options={[
            { text: 'The stakeholders are not interested in the project', correct: false, feedback: 'Disengagement is rarely the root cause — misframing is far more common.' },
            { text: 'The PM communicated information, but not context tailored to each audience', correct: true, feedback: 'Exactly. Each person needed to understand something different to act — and the same message served none of them.' },
            { text: 'The update was probably sent at the wrong time of day', correct: false, feedback: 'Timing is rarely the issue when multiple different stakeholders all fail to act.' },
          ]}
          conceptId="pm-communication-basics"
        />

        <QuizEngine
          conceptId="pm-communication-basics"
          conceptName="PM Communication Basics"
          moduleContext="Module 06 of Airtribe PM Fundamentals. Covers stakeholder communication, PRD writing with AI, storytelling, B2B communication, and executive updates. Follows Priya Sharma at EdSpark."
          staticQuiz={{
            conceptId: "pm-communication-basics",
            question: "A PM sends the same long update to engineering, sales, design, and leadership. Nobody responds clearly. What is the most likely issue?",
            options: ['The stakeholders are not interested', 'The update was sent at the wrong time', 'The PM communicated information but not context tailored to each audience', 'The project is too small to care about'],
            correctIndex: 2,
            explanation: "Different stakeholders need different context to act well. The same message served none of them because it was framed for no one in particular.",
          }}
        />
      </ChapterSection>

      {/* ── PART 2 · STAKEHOLDER COMMUNICATION ACROSS LEVELS ── */}
      <ChapterSection id="m6-stakeholders" num="02" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya rewrites her update. She sends tailored messages to each person. This time, everyone responds. Meera replies: &ldquo;Good framing. Add expected impact.&rdquo; Priya feels relieved — until Asha asks one more question: &ldquo;Do you know what changed across those messages?&rdquo;
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "I changed the detail level for each person." },
            { speaker: 'other', text: "Partly. But more importantly, you changed the decision each person needed to make." },
            { speaker: 'priya', text: "So I'm not just simplifying — I'm identifying what they need to do next?" },
            { speaker: 'other', text: "Exactly. Good PM communication is decision-aware. Not just: what should I say? But: what does this person need in order to decide, contribute, or move?" },
          ]}
        />

        {h2(<>Three directions of PM communication</>)}

        {keyBox('Upward — to managers and leadership', [
          'Outcomes, priority, tradeoffs, risks, what support is needed',
          'They do NOT need every implementation detail',
        ])}

        {keyBox('Downward — to engineering, design, data', [
          'User problem, scope, constraints, edge cases, success criteria, dependencies',
          'They do NOT need vague motivation without specificity',
        ])}

        {keyBox('Lateral — to peers like sales, CS, marketing', [
          'What is changing, what it means for them, what to expect, where uncertainty exists',
          'They do NOT need internal ambiguity disguised as certainty',
        ])}

        {para(<>Same project. Different explanations. Each one shaped around a different decision. That is the discipline. Priya had assumed communication meant being clear. Asha is saying it means being useful.</>)}

        <PMPrinciple text="The same project needs different explanations because different stakeholders are making different decisions." />

        <ApplyItBox prompt="Choose one current initiative. For each group, finish the sentence: 'Leadership needs to know...' / 'Engineering needs to know...' / 'Sales or CS needs to know...' That sentence is often the start of better communication." />

        <QuizEngine
          conceptId="stakeholder-communication"
          conceptName="Stakeholder Communication"
          moduleContext="Module 06 of Airtribe PM Fundamentals. Stakeholder communication across engineering, design, leadership, and GTM teams."
          staticQuiz={{
            conceptId: "stakeholder-communication",
            question: "Your head of business asks for an update on a feature. Which is the best starting point?",
            options: ['The final UI screens are almost ready', 'Engineering has completed 11 tickets', 'The problem being solved, expected business impact, current risk, and what decision is needed', 'The Figma file is ready for review'],
            correctIndex: 2,
            explanation: "Leadership needs outcome-framed updates — not activity or implementation status. They are making resource and priority decisions, not design or engineering decisions.",
          }}
        />
      </ChapterSection>

      {/* ── PART 3 · WRITING A GREAT PRD WITH AI ── */}
      <ChapterSection id="m6-prd" num="03" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya has notes everywhere. User interview snippets. Slack messages from Dev. Comments from Maya on edge cases. A data dump from Kiran. A voice note from a customer call. And three half-written PRD sections that still sound vague. She opens a blank section titled <strong>Problem Statement</strong> and writes: &ldquo;Users find search confusing.&rdquo; Then deletes it.
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "I'm not blocked because I have no information. I'm blocked because I have too much unstructured information." },
            { speaker: 'other', text: "This is exactly where AI can help. Not by deciding for you — by helping you think in structure." },
            { speaker: 'priya', text: "So I just paste all my notes in?" },
            { speaker: 'other', text: "Start with a prompt: 'Summarize these user interview notes and analytics into: problem statement, target user, current friction, hypotheses, and open questions.' The output won't be perfect — but it will be useful." },
          ]}
        />

        {h2(<>What a beginner PM should include in a PRD</>)}

        {keyBox('A useful PRD structure', [
          '1. Problem statement — what is not working right now?',
          '2. Who this affects — which user is experiencing this?',
          '3. Why this matters now — why should the team care about this now?',
          '4. Goal — what are we trying to improve?',
          '5. Proposed solution — what are we planning to build?',
          '6. Scope and non-goals — what is included, what is intentionally excluded?',
          '7. Success metrics — how will we know it worked?',
          '8. Dependencies / constraints — what might block or shape this work?',
          '9. Open questions — what still needs to be resolved?',
        ])}

        <AIPRDStudio />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>The most dangerous AI output is not bad writing. It is confident writing that hides weak thinking. If AI turns your vague notes into a polished PRD, it can create the illusion of clarity. Your job is to check whether the document became clearer — or merely more professional-sounding.</>}
          question="What is the biggest risk of using AI for PRD writing?"
          options={[
            { text: 'The PRD becomes too short', correct: false, feedback: 'Length is not the risk — AI tends to make things longer, not shorter.' },
            { text: 'The PM may accept polished language without checking whether the underlying thinking is correct', correct: true, feedback: 'AI output that sounds confident can mask weak problem framing, wrong scope, or unvalidated assumptions. The PM must own the judgment, not just the editing.' },
            { text: 'AI will always remove metrics from the document', correct: false, feedback: 'AI does not systematically remove metrics — this is not a known failure mode.' },
          ]}
          conceptId="prd-with-ai"
        />

        <PMPrinciple text="AI can draft the document. The PM still owns the thinking." />

        <ApplyItBox prompt="Take one feature idea and write: one-line problem statement, target user, one success metric, one non-goal. If you can't fill those four clearly, the PRD should not move forward yet." />

        <QuizEngine
          conceptId="prd-with-ai"
          conceptName="PRD Writing with AI"
          moduleContext="Module 06 of Airtribe PM Fundamentals. Using AI for PRD drafting while maintaining PM judgment on scope, priorities, and tradeoffs."
          staticQuiz={{
            conceptId: "prd-with-ai",
            question: "What is the biggest risk of using AI for PRD writing?",
            options: ['The PRD becomes too short', 'The PM may accept polished language without checking if the thinking is correct', 'The PRD becomes impossible for engineering to read', 'AI will always remove metrics from the document'],
            correctIndex: 1,
            explanation: "AI output that sounds confident can mask weak problem framing, wrong scope, or unvalidated assumptions. The PM must own the judgment — not just approve the wording.",
          }}
        />
      </ChapterSection>

      {/* ── PART 4 · STORYTELLING FOR PMS ── */}
      <ChapterSection id="m6-storytelling" num="04" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya has to present the search initiative in the weekly product review. She prepares a thorough slide: problem summary, metrics, wireframe, scope list, edge cases, timeline, risks. Halfway through her practice run, Asha stops her. <strong>&ldquo;What are you trying to make the room understand?&rdquo;</strong> Priya: <strong>&ldquo;The full context.&rdquo;</strong> Asha: <strong>&ldquo;No. What do they need to believe by the end?&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "This is information. Not narrative." },
            { speaker: 'other', text: "Storytelling for PMs is not drama. It is sequence. Deciding what the listener needs to understand first, what tension matters, what evidence supports it, and what decision follows." },
            { speaker: 'priya', text: "So I shouldn't start with the feature?" },
            { speaker: 'other', text: "Don't start with the feature. Start with the tension. Without tension, the work feels optional. Without evidence, it feels like opinion." },
          ]}
        />

        {h2(<>A simple PM storytelling structure</>)}

        {keyBox('The six-part PM narrative', [
          '1. Context — what is happening in the product or business?',
          '2. Tension / problem — what is not working, and why is it worth attention?',
          '3. Evidence — what do users, data, or team observations show?',
          '4. Proposed path — what are we recommending?',
          '5. Expected impact — what should change if this works?',
          '6. Ask — what decision, support, or alignment is needed now?',
        ])}

        <NarrativeStaircase />

        <PMPrinciple text="Storytelling is how PMs turn scattered information into aligned decisions." />

        <ApplyItBox prompt="Take a feature or problem you know. Write it in this order: what is happening, what is going wrong, what proves it, what should happen next. That is the beginning of a PM story." />

        <QuizEngine
          conceptId="pm-storytelling"
          conceptName="PM Storytelling"
          moduleContext="Module 06 of Airtribe PM Fundamentals. Structuring product communication as a narrative to drive alignment."
          staticQuiz={{
            conceptId: "pm-storytelling",
            question: "What is the best opening for a PM prioritization discussion?",
            options: ['Here\'s the feature we want to build.', 'We designed three different UI options.', 'Users are repeatedly failing in a high-frequency workflow, and here is the evidence.', 'Engineering says this is feasible.'],
            correctIndex: 2,
            explanation: "Good storytelling starts with the problem and evidence — not the solution. If you open with the feature, people argue about execution before they agree the problem matters.",
          }}
        />
      </ChapterSection>

      {/* ── PART 5 · B2B COMMUNICATION ── */}
      <ChapterSection id="m6-b2b" num="05" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Rohit from sales pings Priya: <strong>&ldquo;Quick one. Can I tell prospects that advanced search is launching next month?&rdquo;</strong> Priya opens the spec. Contact-first search is in scope for v1. Transcript search is not committed. Team filtering is still under discussion. Launch timing is still soft. Then Rohit sends another message: <strong>&ldquo;Need answer in 5 min. Customer asked on a call.&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="rohan" name="Rohit" role="Sales Lead · EdSpark" accent="#E67E22"
          lines={[
            { speaker: 'other', text: "What exactly did the customer ask?" },
            { speaker: 'priya', text: "They want to know whether we'll support search by contact, transcript, and team filters soon." },
            { speaker: 'other', text: "So what should I say?" },
            { speaker: 'priya', text: "Contact-first search is in scope right now. Transcript and team filters are not committed yet. Here's exactly how to say it without overcommitting..." },
          ]}
        />

        {h2(<>PM communication in B2B settings</>)}

        {para(<>When the PM is imprecise, customer expectations get inflated faster than the product can deliver. That is why wording matters.</>)}

        {keyBox('These phrases are not the same', [
          '"Available now" — committed and already shipped',
          '"Launching this cycle" — committed, near-term',
          '"On the roadmap" — intended direction, not a date promise',
          '"Exploring" — being considered, no commitment',
          '"Not currently prioritised" — not in scope for now',
        ])}

        <RoadmapPressureChamber />

        <PMPrinciple text="Helpful communication is not the same as optimistic communication. In B2B product work, precision builds trust." />

        <ApplyItBox prompt="Take one feature your team is discussing but has not fully committed to. Write one sentence you would be comfortable saying to a customer. If the sentence sounds stronger than reality, rewrite it." />

        <QuizEngine
          conceptId="b2b-pm-communication"
          conceptName="B2B PM Communication"
          moduleContext="Module 06 of Airtribe PM Fundamentals. Sales enablement, roadmap communication, and avoiding customer expectation risk."
          staticQuiz={{
            conceptId: "b2b-pm-communication",
            question: "A customer asks whether a requested feature will be live by next quarter. Scope is still being validated. What is the best PM response?",
            options: ['Yes, that should happen.', 'It\'s definitely coming.', 'We understand the need and are evaluating scope, but we\'re not committing a timeline yet.', 'Ask sales.'],
            correctIndex: 2,
            explanation: "This response is honest about current state, useful to the customer, and avoids creating an expectation you cannot keep. Precision protects trust.",
          }}
        />
      </ChapterSection>

      {/* ── PART 6 · DIFFICULT CONVERSATIONS ── */}
      <ChapterSection id="m6-conflict" num="06" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The product review is going well until Meera raises a concern: <strong>&ldquo;Why are we not including transcript search? That seems like the more powerful feature.&rdquo;</strong> Dev says: &ldquo;Because it adds four weeks.&rdquo; Rohit jumps in: &ldquo;But transcript search is what customers will care about.&rdquo; Suddenly the room shifts. This is no longer an update. It is conflict.
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "Let me restate the tradeoff. We are trying to improve search success this quarter. Contact-based search addresses the most common user behaviour in a shorter time frame." },
            { speaker: 'other', text: "Keep going." },
            { speaker: 'priya', text: "If we believe the goal is broader search power rather than faster search success, we can revisit the decision. But that would mean changing the outcome we're optimizing for." },
            { speaker: 'other', text: "You did something important there. You moved the disagreement from 'who is right' to 'what outcome matters most.' That's the PM move in conflict." },
          ]}
        />

        {h2(<>What strong PMs do in conflict</>)}

        {keyBox('Do not', [
          'Get personal or defensive',
          'Get vague under pressure',
          'Hide behind process or hierarchy',
          'Confuse confidence with certainty',
        ])}

        {keyBox('Do', [
          'Restate the actual decision being made',
          'Make the tradeoff explicit — not implied',
          'Separate goals from personal preferences',
          'Use evidence calmly — not as a weapon',
          'Invite disagreement at the right level of abstraction',
        ])}

        {para(<>Conflict often gets worse when people are arguing about different questions without noticing it. A PM&apos;s role is often to expose the real layer of disagreement — and that requires clarity, not force.</>)}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>When a room feels tense, a PM often assumes the problem is emotion. It usually is not. It is usually ambiguity. The room does not know whether it is arguing about user value, timing, technical effort, or business priority. Your job is to name the layer clearly.</>}
          question="A stakeholder pushes back strongly on your prioritization decision. What is the strongest PM move?"
          options={[
            { text: 'Repeat the decision until they stop arguing', correct: false, feedback: 'Repetition without new reasoning just increases friction, not alignment.' },
            { text: 'Ask engineering to defend it instead', correct: false, feedback: 'Deflecting makes you look like you can\'t hold the decision — that erodes trust faster than the conflict would.' },
            { text: 'Clarify the goal, make the tradeoff explicit, and anchor the discussion in evidence', correct: true, feedback: 'This reframes the disagreement from personality to logic — and gives the room a productive place to land.' },
          ]}
          conceptId="difficult-conversations"
        />

        <PMPrinciple text="In conflict, the PM's job is not to win the argument. It is to make the real tradeoff visible." />

        <ApplyItBox prompt="Think of one recent disagreement in a team. Ask: were people disagreeing about the same thing? Or were they actually using different definitions of success? Write the real tradeoff in one sentence." />

        <QuizEngine
          conceptId="difficult-conversations"
          conceptName="Difficult Conversations"
          moduleContext="Module 06 of Airtribe PM Fundamentals. Handling stakeholder conflict, managing pushback, and making tradeoffs visible."
          staticQuiz={{
            conceptId: "difficult-conversations",
            question: "A stakeholder pushes back strongly on your prioritization decision. What is the strongest PM move?",
            options: ['Repeat the decision until they stop arguing', 'Ask engineering to defend it instead', 'Clarify the goal, make the tradeoff explicit, and anchor the discussion in evidence', 'End the conversation and follow up later'],
            correctIndex: 2,
            explanation: "This reframes the disagreement from personality to logic — and gives the room a productive place to land. Conflict is usually not about emotion; it is about ambiguity.",
          }}
        />
      </ChapterSection>

      {/* ── PART 7 · EXECUTIVE COMMUNICATION & ROADMAPS ── */}
      <ChapterSection id="m6-executive" num="07" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          At the end of the month, Meera asks Priya to present the initiative in the product leadership review. Priya prepares what she knows: problem, feature scope, user behaviour, risks, team status. Meera reviews the draft and says: <strong>&ldquo;This is good product thinking. But it still sounds like a working-team update. I need to know: what changed, why it matters, what risk remains, and what support is needed.&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="kiran" name="Meera" role="Business Head · EdSpark" accent="#158158"
          lines={[
            { speaker: 'priya', text: "I thought I was being thorough." },
            { speaker: 'other', text: "You were. But executive communication is not 'more important communication.' It is communication shaped around business visibility and decisions." },
            { speaker: 'priya', text: "So less detail?" },
            { speaker: 'other', text: "Not less detail — different detail. What outcome are we trying to move? What changed? What tradeoff did we make? What risk remains? What do you need from leadership?" },
          ]}
        />

        {h2(<>What leadership usually needs</>)}

        {keyBox('Six questions an exec update should answer', [
          '1. What outcome are we trying to move?',
          '2. What is the current state?',
          '3. What changed or what did we learn?',
          '4. What tradeoff did we make?',
          '5. What risk or blocker matters now?',
          '6. What decision or support is needed?',
        ])}

        {h2(<>Product roadmap communication</>)}

        {para(<>A roadmap is not a list of everything the team wants to build. A useful roadmap communicates themes, problem spaces, priority direction, sequencing logic, confidence level, and what is committed versus exploratory.</>)}

        {para(<><strong>Weak roadmap:</strong> &ldquo;Here are all the features.&rdquo;<br /><strong>Strong roadmap:</strong> &ldquo;This quarter we are focusing on activation and retrieval because those are the two bottlenecks affecting retention. Search improvements are committed. Deeper discovery features remain exploratory.&rdquo;</>)}

        <ExecRoadmapRoom />

        <PMPrinciple text="Executive communication is not about showing activity. It is about making product direction legible." />

        <ApplyItBox prompt="Write a 4-line leadership update using this structure: what outcome matters, what changed, what risk remains, what decision or support is needed. If you can do that clearly, your communication is already improving." />

        <QuizEngine
          conceptId="executive-communication"
          conceptName="Executive Communication"
          moduleContext="Module 06 of Airtribe PM Fundamentals. Executive updates, roadmap communication, and tying product work to business outcomes."
          staticQuiz={{
            conceptId: "executive-communication",
            question: "Which sounds most like a strong executive-level product update?",
            options: ['We completed six tickets and reviewed the latest Figma file.', 'The team is very busy and making progress.', 'We prioritised contact-based search to improve retrieval success this quarter. Early evidence supports the direction, but transcript search remains a risk area if enterprise demand grows.', 'Engineering is halfway done.'],
            correctIndex: 2,
            explanation: "Executive updates need outcomes, tradeoffs, and risks — not activity or implementation status. The third option answers: what we bet on, why, and what remains uncertain.",
          }}
        />

        <NextChapterTeaser text="Next up: Analytics & Metrics — how PMs define, measure, and act on the numbers that actually matter." />
      </ChapterSection>

    </article>
  );
}

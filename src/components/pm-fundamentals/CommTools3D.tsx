'use client';

/**
 * CommTools3D — Module 06 interactive teaching tools.
 * Genuine cause-and-effect simulations. Vibrant colors. No click-to-reveal.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────
// SHARED SHELL
// ─────────────────────────────────────────
const ACCENT = '#0284C7';

const ToolCard = ({ title, subtitle, icon, color, children }: {
  title: string; subtitle: string; icon: string; color: string; children: React.ReactNode;
}) => (
  <div style={{ background: 'var(--ed-card)', borderRadius: '16px', boxShadow: '0 6px 32px rgba(0,0,0,0.12)', overflow: 'hidden', margin: '32px 0', border: `1.5px solid ${color}35` }}>
    <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${color}28 0%, ${color}14 100%)`, borderBottom: `1.5px solid ${color}30`, display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${color}30`, border: `1.5px solid ${color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', color, textTransform: 'uppercase' as const }}>{title}</div>
        <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>{subtitle}</div>
      </div>
    </div>
    <div style={{ padding: '24px' }}>{children}</div>
  </div>
);

const Pill = ({ text, color }: { text: string; color: string }) => (
  <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: `${color}22`, border: `1px solid ${color}50`, color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', whiteSpace: 'nowrap' as const }}>
    {text}
  </span>
);

// ─────────────────────────────────────────
// TOOL 1 · MESSAGE TRANSFORMER
// (replaces CommunicationPrism / StakeholderTranslationTool)
// ─────────────────────────────────────────
const RAW_MSG = 'We are improving search because users struggle to find past call recordings.';

const STAKEHOLDER_DATA = [
  {
    id: 'eng', label: 'Engineering', emoji: '⚙️', color: '#3A86FF',
    generic:  { reaction: 'Stalling', quote: "What problem exactly? What's in scope?", action: null, actionColor: '' },
    tailored: {
      message: 'Problem: users fail to retrieve recordings by contact. v1 scope: contact-first search only. Transcript search is explicitly out of scope. Success: retrieval rate ≥85%.',
      reaction: 'Building', quote: 'Clear. We can start sprint planning.', action: 'Starts sprint planning', actionColor: '#3A86FF',
    },
  },
  {
    id: 'design', label: 'Design', emoji: '🎨', color: '#C85A40',
    generic:  { reaction: 'Uncertain', quote: 'Who is the primary user? What does the flow look like?', action: null, actionColor: '' },
    tailored: {
      message: 'User: returning account owner searching by contact name. Friction: no contact-based entry point. Edge case: partial name matches and no-result states need clarity.',
      reaction: 'Designing', quote: 'Got it. Starting with the contact search entry point.', action: 'Opens Figma', actionColor: '#C85A40',
    },
  },
  {
    id: 'sales', label: 'Sales / CS', emoji: '💼', color: '#E67E22',
    generic:  { reaction: 'Overpromising', quote: 'So can I tell clients search will be fully upgraded?', action: null, actionColor: '' },
    tailored: {
      message: 'Safe: "improved call retrieval experience." Do NOT promise transcript search or team filters. Who benefits: high call-volume teams. External: available in next release.',
      reaction: 'Informed', quote: 'Perfect. I know exactly what I can and can\'t say.', action: 'Updates prospect messaging', actionColor: '#E67E22',
    },
  },
  {
    id: 'leadership', label: 'Leadership', emoji: '📊', color: '#7843EE',
    generic:  { reaction: 'Redirecting', quote: 'Why now? What business outcome does this drive?', action: null, actionColor: '' },
    tailored: {
      message: 'Why now: 34% of searches fail — high-frequency friction in our core workflow. Expected: search success rate +20pp. Tradeoff: transcript search deferred to v2 for timeline.',
      reaction: 'Aligned', quote: 'Good tradeoff. This is the right bet this quarter.', action: 'Approves scope', actionColor: '#7843EE',
    },
  },
];

export function CommunicationPrism() {
  const [mode, setMode] = useState<'generic' | 'tailored'>('generic');
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = STAKEHOLDER_DATA.find(s => s.id === activeId);

  return (
    <ToolCard title="Message Transformer" subtitle="Send the same initiative generically vs tailored. Watch how each stakeholder reacts — and whether they act." icon="🔀" color={ACCENT}>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid var(--ed-rule)' }}>
        {(['generic', 'tailored'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setActiveId(null); }}
            style={{ flex: 1, padding: '11px', border: 'none', cursor: 'pointer', background: mode === m ? (m === 'generic' ? '#dc2626' : ACCENT) : 'var(--ed-card)', color: mode === m ? '#fff' : 'var(--ed-ink3)', fontWeight: 700, fontSize: '13px', transition: 'all 0.2s' }}>
            {m === 'generic' ? '📤 Generic Message' : '✉️ Tailored Messages'}
          </button>
        ))}
      </div>

      {/* Raw message */}
      <div style={{ padding: '14px 18px', borderRadius: '10px', background: mode === 'generic' ? 'rgba(220,38,38,0.08)' : `rgba(2,132,199,0.08)`, border: `1.5px solid ${mode === 'generic' ? '#dc2626' : ACCENT}35`, marginBottom: '20px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: mode === 'generic' ? '#dc2626' : ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>
          {mode === 'generic' ? 'SAME MESSAGE SENT TO EVERYONE' : 'SELECT A STAKEHOLDER — SEE THEIR VERSION'}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--ed-ink)', fontStyle: 'italic', lineHeight: 1.6 }}>&ldquo;{RAW_MSG}&rdquo;</div>
      </div>

      {/* Stakeholder grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {STAKEHOLDER_DATA.map(s => {
          const data = mode === 'generic' ? s.generic : s.tailored;
          const isActive = activeId === s.id;
          return (
            <motion.div key={s.id} whileHover={{ y: -3 }} onClick={() => setActiveId(isActive ? null : s.id)}
              style={{ borderRadius: '12px', border: `2px solid ${isActive ? s.color : s.color + '40'}`, background: isActive ? `${s.color}12` : 'var(--ed-card)', cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s', boxShadow: isActive ? `0 4px 20px ${s.color}30` : '0 2px 8px rgba(0,0,0,0.06)' }}>
              {/* Header */}
              <div style={{ padding: '10px 14px', background: `${s.color}18`, borderBottom: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{s.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: s.color }}>{s.label}</span>
                </div>
                <Pill
                  text={mode === 'generic' ? s.generic.reaction : s.tailored.reaction}
                  color={mode === 'generic' ? '#dc2626' : s.color}
                />
              </div>
              {/* Content */}
              <div style={{ padding: '10px 14px' }}>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', fontStyle: 'italic', lineHeight: 1.55, marginBottom: mode === 'tailored' && s.tailored.action ? '8px' : '0' }}>
                  &ldquo;{data.quote}&rdquo;
                </div>
                <AnimatePresence>
                  {isActive && mode === 'tailored' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${s.color}25`, fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.6, background: `${s.color}08`, padding: '8px 10px', borderRadius: '6px' }}>
                        {s.tailored.message}
                      </div>
                      {s.tailored.action && (
                        <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.tailored.actionColor, display: 'inline-block', flexShrink: 0 }} />
                          <span style={{ fontSize: '11px', fontWeight: 700, color: s.tailored.actionColor }}>{s.tailored.action}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ padding: '12px 16px', borderRadius: '8px', background: mode === 'generic' ? 'rgba(220,38,38,0.06)' : `rgba(2,132,199,0.06)`, border: `1px solid ${mode === 'generic' ? '#dc2626' : ACCENT}30`, fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.6, textAlign: 'center' as const }}>
        {mode === 'generic'
          ? 'Every stakeholder gets the same message. Everyone is confused in a different way. Nobody acts clearly.'
          : 'Click any stakeholder to see the message that actually helps them act. Communication is complete when the other person can move — not when you send.'}
      </div>
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 2 · NARRATIVE SEQUENCE BUILDER
// (replaces NarrativeStaircase)
// ─────────────────────────────────────────
const STORY_BLOCKS = [
  { id: 'context',  label: 'Context',         emoji: '🌍', correctPos: 0, desc: 'What is happening in the product right now?' },
  { id: 'problem',  label: 'Problem',          emoji: '⚡', correctPos: 1, desc: 'What is not working and why does it matter?' },
  { id: 'evidence', label: 'Evidence',         emoji: '📊', correctPos: 2, desc: '34% of searches fail. Users search by contact name.' },
  { id: 'whynow',   label: 'Why Now',          emoji: '⏱',  correctPos: 3, desc: 'Q2 is our retention quarter. Board sees this next month.' },
  { id: 'path',     label: 'Proposed Path',    emoji: '🗺️', correctPos: 4, desc: 'Contact-first search in v1. Transcript in v2.' },
  { id: 'impact',   label: 'Expected Impact',  emoji: '📈', correctPos: 5, desc: 'Search success rate +20pp. Repeat usage follows.' },
  { id: 'ask',      label: 'Ask',             emoji: '✋', correctPos: 6, desc: 'Approve v1 scope without transcript search.' },
];

const AUDIENCE_REACTIONS = [
  'The room is listening. Context acknowledged.',
  'Problem landed. Tension in the room is the right kind.',
  'Evidence accepted. Nobody arguing this is wrong.',
  '"Why now" creates urgency — nobody wants to delay.',
  'Path understood. Room evaluating feasibility.',
  'Impact visible. Leadership mentally saying yes.',
  'Clear ask. Ready to decide.',
];

const BAD_START_BLOCKS = new Set(['path', 'impact', 'ask']);

export function NarrativeStaircase() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const alignmentScore = sequence.reduce((score, id, i) => {
    const block = STORY_BLOCKS.find(b => b.id === id)!;
    return score + (block.correctPos === i ? 1 : 0);
  }, 0);
  const pct = sequence.length > 0 ? Math.round((alignmentScore / STORY_BLOCKS.length) * 100) : 0;
  const startsWrong = sequence.length > 0 && BAD_START_BLOCKS.has(sequence[0]);
  const available = STORY_BLOCKS.filter(b => !sequence.includes(b.id));

  const add = (id: string) => { if (!submitted) setSequence(prev => [...prev, id]); };
  const remove = (id: string) => { if (!submitted) setSequence(prev => prev.filter(x => x !== id)); };

  const alignColor = pct >= 80 ? '#059669' : pct >= 50 ? '#E67E22' : '#dc2626';

  return (
    <ToolCard title="Narrative Sequence Builder" subtitle="Arrange the story blocks. Watch the audience alignment meter respond in real time as you build your PM narrative." icon="🎬" color="#7843EE">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left: block pool */}
        <div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>STORY BLOCKS</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {available.map(block => (
              <motion.div key={block.id} whileHover={{ x: 4 }} onClick={() => add(block.id)}
                style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', background: 'var(--ed-card)', border: '1.5px solid var(--ed-rule)', display: 'flex', gap: '10px', alignItems: 'center', transition: 'all 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{block.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--ed-ink)' }}>{block.label}</div>
                  <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.4, marginTop: '1px' }}>{block.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: sequence + meter */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          {/* Alignment meter */}
          <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'var(--ed-card)', border: `1.5px solid ${alignColor}40`, boxShadow: `0 2px 12px ${alignColor}20` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: alignColor, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>AUDIENCE ALIGNMENT</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: '18px', color: alignColor }}>{pct}%</div>
            </div>
            <div style={{ height: '8px', borderRadius: '4px', background: 'var(--ed-rule)', overflow: 'hidden', marginBottom: '8px' }}>
              <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} style={{ height: '100%', borderRadius: '4px', background: alignColor }} />
            </div>
            {sequence.length > 0 && sequence.length <= AUDIENCE_REACTIONS.length && (
              <div style={{ fontSize: '11px', color: alignColor, lineHeight: 1.5, fontWeight: 600 }}>
                {AUDIENCE_REACTIONS[sequence.length - 1]}
              </div>
            )}
          </div>

          {/* Sequence */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>YOUR SEQUENCE</div>
            {sequence.length === 0 ? (
              <div style={{ padding: '20px', borderRadius: '8px', border: '1.5px dashed var(--ed-rule)', fontSize: '12px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
                Click blocks to add them in order
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
                {sequence.map((id, i) => {
                  const block = STORY_BLOCKS.find(b => b.id === id)!;
                  const isCorrect = submitted && block.correctPos === i;
                  const isWrong = submitted && block.correctPos !== i;
                  return (
                    <motion.div key={id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '7px 10px', borderRadius: '7px', background: submitted ? (isCorrect ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.08)') : `rgba(120,67,238,0.08)`, border: `1px solid ${submitted ? (isCorrect ? '#059669' : '#dc2626') : '#7843EE'}30` }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: '#7843EE', minWidth: '16px' }}>{i + 1}</span>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>{block.emoji}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ed-ink)', flex: 1 }}>{block.label}</span>
                      {!submitted && (
                        <span onClick={() => remove(id)} style={{ cursor: 'pointer', color: 'var(--ed-ink3)', fontSize: '14px', lineHeight: 1, flexShrink: 0 }}>×</span>
                      )}
                      {submitted && <span style={{ fontSize: '12px', fontWeight: 700, color: isCorrect ? '#059669' : '#dc2626' }}>{isCorrect ? '✓' : '✗'}</span>}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Warnings and actions */}
          <AnimatePresence>
            {startsWrong && !submitted && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
                ⚠ Starting with &ldquo;{STORY_BLOCKS.find(b => b.id === sequence[0])?.label}&rdquo; — the room will argue about execution before understanding the problem.
              </motion.div>
            )}
          </AnimatePresence>

          {sequence.length === STORY_BLOCKS.length && !submitted && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }} onClick={() => setSubmitted(true)}
              style={{ padding: '11px', borderRadius: '8px', background: '#7843EE', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Check narrative order →
            </motion.button>
          )}

          {submitted && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ padding: '12px 14px', borderRadius: '8px', background: pct >= 80 ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.08)', border: `1px solid ${pct >= 80 ? '#059669' : '#dc2626'}40`, fontSize: '12px', color: 'var(--ed-ink)', marginBottom: '8px', lineHeight: 1.6 }}>
                {pct >= 80 ? '✓ Strong narrative. Context and problem are the foundation — the room built shared understanding before you proposed anything.' : 'Correct order: Context → Problem → Evidence → Why Now → Path → Impact → Ask. Foundation steps let the solution land.'}
              </div>
              <button onClick={() => { setSequence([]); setSubmitted(false); }}
                style={{ width: '100%', padding: '9px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', color: 'var(--ed-ink3)', fontSize: '12px', cursor: 'pointer' }}>
                ↺ Try again
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 3 · ROADMAP LANGUAGE RIPPLE
// (replaces RoadmapPressureChamber — more vibrant, more animated)
// ─────────────────────────────────────────
type RoadmapStatus = 'Exploring' | 'Planned' | 'Committed' | 'Available Now';

const STATUS_CONFIG: Record<RoadmapStatus, {
  color: string; bg: string;
  trust: number; clarity: number; expectationRisk: number; deliveryPressure: number;
  pods: { name: string; emoji: string; quote: string; risk: 'low' | 'medium' | 'high' }[];
}> = {
  Exploring: {
    color: '#64748b', bg: 'rgba(100,116,139,0.12)',
    trust: 0.62, clarity: 0.38, expectationRisk: 0.18, deliveryPressure: 0.12,
    pods: [
      { name: 'Customer',    emoji: '🧑‍💼', quote: 'Probably not coming soon. I\'ll manage expectations.', risk: 'low' },
      { name: 'Sales',       emoji: '🤝',  quote: 'Can\'t really promise this. Will note as future possibility.', risk: 'low' },
      { name: 'CS',          emoji: '💬',  quote: 'Will manage customer expectations down. Low urgency.', risk: 'low' },
      { name: 'Leadership',  emoji: '📋',  quote: 'Noted as possible direction. Not tracking this.', risk: 'low' },
      { name: 'Engineering', emoji: '⚙️',  quote: 'Not in planning. No pressure yet.', risk: 'low' },
    ],
  },
  Planned: {
    color: '#E67E22', bg: 'rgba(230,126,34,0.12)',
    trust: 0.68, clarity: 0.56, expectationRisk: 0.52, deliveryPressure: 0.42,
    pods: [
      { name: 'Customer',    emoji: '🧑‍💼', quote: 'So I can buy this soon? I\'ll mention to my team.', risk: 'medium' },
      { name: 'Sales',       emoji: '🤝',  quote: 'Telling prospects "planned" — they assume Q2.', risk: 'medium' },
      { name: 'CS',          emoji: '💬',  quote: 'Customers keep asking for a date. Hard to hold them off.', risk: 'medium' },
      { name: 'Leadership',  emoji: '📋',  quote: 'Expecting progress updates. When is "planned" actually shipping?', risk: 'medium' },
      { name: 'Engineering', emoji: '⚙️',  quote: 'Beginning rough scoping. No hard deadline yet.', risk: 'low' },
    ],
  },
  Committed: {
    color: '#059669', bg: 'rgba(5,150,105,0.12)',
    trust: 0.82, clarity: 0.82, expectationRisk: 0.78, deliveryPressure: 0.88,
    pods: [
      { name: 'Customer',    emoji: '🧑‍💼', quote: 'We\'re building our implementation plan around this.', risk: 'high' },
      { name: 'Sales',       emoji: '🤝',  quote: 'Promising it to prospects. It\'s in the proposal.', risk: 'high' },
      { name: 'CS',          emoji: '💬',  quote: 'Customers will hold us to this. Already communicated it.', risk: 'high' },
      { name: 'Leadership',  emoji: '📋',  quote: 'Tracking this as a delivery. Board aware.', risk: 'medium' },
      { name: 'Engineering', emoji: '⚙️',  quote: 'In sprint plan. Any delay is a problem now.', risk: 'high' },
    ],
  },
  'Available Now': {
    color: '#3A86FF', bg: 'rgba(58,134,255,0.12)',
    trust: 0.92, clarity: 0.96, expectationRisk: 1.0, deliveryPressure: 1.0,
    pods: [
      { name: 'Customer',    emoji: '🧑‍💼', quote: 'I need access right now. Where do I find it?', risk: 'high' },
      { name: 'Sales',       emoji: '🤝',  quote: 'Selling it on calls today. Live demo ready?', risk: 'high' },
      { name: 'CS',          emoji: '💬',  quote: 'Customers are asking where it is. Onboarding needed immediately.', risk: 'high' },
      { name: 'Leadership',  emoji: '📋',  quote: 'Expecting adoption metrics by end of week.', risk: 'high' },
      { name: 'Engineering', emoji: '⚙️',  quote: 'Must be fully shipped and stable. No bugs acceptable.', risk: 'high' },
    ],
  },
};

const riskColor = (r: 'low' | 'medium' | 'high') => r === 'high' ? '#dc2626' : r === 'medium' ? '#E67E22' : '#059669';

const LiveMeter = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div style={{ flex: 1 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.07em' }}>{label}</span>
      <span style={{ fontSize: '10px', fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace" }}>{Math.round(value * 100)}%</span>
    </div>
    <div style={{ height: '7px', borderRadius: '4px', background: 'var(--ed-rule)', overflow: 'hidden' }}>
      <motion.div animate={{ width: `${value * 100}%` }} transition={{ duration: 0.45 }} style={{ height: '100%', borderRadius: '4px', background: color }} />
    </div>
  </div>
);

export function RoadmapPressureChamber() {
  const [status, setStatus] = useState<RoadmapStatus>('Planned');
  const cfg = STATUS_CONFIG[status];

  return (
    <ToolCard title="Roadmap Language Ripple" subtitle="Change one word. Watch every stakeholder's interpretation update — and the system pressure cascade." icon="📡" color={cfg.color}>
      {/* Status selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
        {(Object.keys(STATUS_CONFIG) as RoadmapStatus[]).map(s => (
          <motion.button key={s} whileHover={{ y: -2 }} onClick={() => setStatus(s)}
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: `2px solid ${STATUS_CONFIG[s].color}`, background: status === s ? STATUS_CONFIG[s].color : STATUS_CONFIG[s].bg, color: status === s ? '#fff' : STATUS_CONFIG[s].color, transition: 'all 0.2s', boxShadow: status === s ? `0 4px 16px ${STATUS_CONFIG[s].color}50` : 'none' }}>
            {s}
          </motion.button>
        ))}
      </div>

      {/* Central statement */}
      <motion.div key={status} initial={{ scale: 0.97 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }}
        style={{ textAlign: 'center' as const, marginBottom: '20px', padding: '16px', borderRadius: '12px', background: cfg.bg, border: `2px solid ${cfg.color}50`, boxShadow: `0 4px 24px ${cfg.color}25` }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>ROADMAP STATEMENT</div>
        <div style={{ fontSize: '16px', color: 'var(--ed-ink)', lineHeight: 1.5 }}>
          &ldquo;Advanced reporting is&nbsp;
          <motion.span key={status} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontWeight: 900, color: cfg.color, padding: '2px 12px', borderRadius: '6px', background: `${cfg.color}20`, display: 'inline-block' }}>
            {status}
          </motion.span>
          &#46;&rdquo;
        </div>
      </motion.div>

      {/* Live meters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', padding: '14px 16px', background: 'var(--ed-card)', borderRadius: '10px', border: '1px solid var(--ed-rule)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <LiveMeter label="Trust" value={cfg.trust} color={cfg.trust > 0.65 ? '#059669' : '#E67E22'} />
        <LiveMeter label="Clarity" value={cfg.clarity} color={cfg.clarity > 0.65 ? '#059669' : '#E67E22'} />
        <LiveMeter label="Expectation Risk" value={cfg.expectationRisk} color={cfg.expectationRisk > 0.6 ? '#dc2626' : '#E67E22'} />
        <LiveMeter label="Delivery Pressure" value={cfg.deliveryPressure} color={cfg.deliveryPressure > 0.6 ? '#dc2626' : '#E67E22'} />
      </div>

      {/* Stakeholder pods */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
        {cfg.pods.map((pod, i) => (
          <motion.div key={pod.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            style={{ borderRadius: '10px', background: `${riskColor(pod.risk)}12`, border: `1.5px solid ${riskColor(pod.risk)}35`, padding: '10px 8px', textAlign: 'center' as const, boxShadow: `0 2px 8px ${riskColor(pod.risk)}20` }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>{pod.emoji}</div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginBottom: '6px' }}>{pod.name.toUpperCase()}</div>
            <div style={{ fontSize: '10px', color: 'var(--ed-ink2)', fontStyle: 'italic', lineHeight: 1.45 }}>&ldquo;{pod.quote}&rdquo;</div>
            <div style={{ marginTop: '6px' }}>
              <Pill text={pod.risk.toUpperCase()} color={riskColor(pod.risk)} />
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '8px', background: `${cfg.color}10`, border: `1px solid ${cfg.color}30`, fontSize: '12px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
        &ldquo;Planned&rdquo; and &ldquo;Committed&rdquo; are not synonyms. Toggle between them to see the system-wide difference.
      </div>
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 4 · MEETING CALIBRATION SIMULATOR
// (replaces StakeholderCalibrationRoom)
// ─────────────────────────────────────────
const STAKEHOLDERS_CAL = [
  {
    id: 'sales', name: 'Farah', role: 'Sales Director', emoji: '🤝', color: '#E67E22',
    wants: 'Broader feature promises to close the Q3 enterprise deal',
    fears: 'Losing deals to a competitor with a stronger roadmap story',
    trusts: 'Customer quotes, competitive data, pipeline risk numbers',
    uncalibrated: 'Pushes for a public commitment on transcript search during the meeting.',
    calibrated: 'Opens by showing the pipeline at risk — you\'re ready for it.',
  },
  {
    id: 'eng', name: 'Neeraj', role: 'Principal Engineer', emoji: '⚙️', color: '#3A86FF',
    wants: 'Narrower, locked scope so he can hit the committed date',
    fears: 'Scope creep that breaks the delivery promise he\'s already made',
    trusts: 'Technical constraints, feasibility data, explicit non-goals',
    uncalibrated: 'Interrupts to question any scope expansion, slowing the meeting.',
    calibrated: 'Comes in knowing scope is locked. Focuses on delivery clarity.',
  },
  {
    id: 'leadership', name: 'Leena', role: 'VP Product', emoji: '📋', color: '#7843EE',
    wants: 'A clear business outcome with explicit risk and confidence level',
    fears: 'Wasted investment or a miss that looks bad to the board',
    trusts: 'Outcome metrics, strategic tradeoff logic, confidence levels',
    uncalibrated: 'Asks "why now?" mid-meeting — the agenda falls apart.',
    calibrated: 'Strategic framing is pre-aligned. Meeting moves to decision.',
  },
];

type CalStep = 'intro' | 'calibrate' | 'meeting';

export function StakeholderCalibrationRoom() {
  const [step, setStep] = useState<CalStep>('intro');
  const [calibrated, setCalibrated] = useState<Set<string>>(new Set());
  const [choice, setChoice] = useState<'cold' | 'prepared' | null>(null);
  const [meetingStep, setMeetingStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = (id: string) => setCalibrated(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const runMeeting = (c: 'cold' | 'prepared') => {
    setChoice(c);
    setStep('meeting');
    setPlaying(true);
    setMeetingStep(0);
  };

  const events = STAKEHOLDERS_CAL.map(s => ({
    name: s.name, role: s.role, emoji: s.emoji, color: s.color,
    event: choice === 'cold' ? s.uncalibrated : s.calibrated,
    good: choice === 'prepared',
  }));

  useEffect(() => {
    if (!playing) return;
    if (meetingStep < events.length - 1) {
      timerRef.current = setTimeout(() => setMeetingStep(x => x + 1), 1400);
    } else {
      setPlaying(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, meetingStep, events.length]);

  const reset = () => { setStep('intro'); setCalibrated(new Set()); setChoice(null); setMeetingStep(-1); setPlaying(false); };

  return (
    <ToolCard title="Meeting Calibration Simulator" subtitle="Choose to walk in cold or calibrate first. Watch the meeting play out differently based on your preparation." icon="🗺️" color="#7843EE">
      {step === 'intro' && (
        <div>
          <div style={{ padding: '16px 18px', borderRadius: '10px', background: 'rgba(120,67,238,0.1)', border: '1.5px solid rgba(120,67,238,0.3)', marginBottom: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#7843EE', marginBottom: '4px' }}>Alignment meeting in 5 minutes.</div>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>Farah (Sales), Neeraj (Engineering), and Leena (VP Product) are about to discuss the AI Workflow Assistant roadmap. You can walk in now or spend 2 minutes calibrating each stakeholder first.</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <motion.button whileHover={{ y: -2 }} onClick={() => runMeeting('cold')}
              style={{ flex: 1, padding: '13px', borderRadius: '10px', border: '2px solid #dc2626', background: 'rgba(220,38,38,0.1)', color: '#dc2626', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              🚪 Walk in now (cold)
            </motion.button>
            <motion.button whileHover={{ y: -2 }} onClick={() => setStep('calibrate')}
              style={{ flex: 1, padding: '13px', borderRadius: '10px', border: '2px solid #7843EE', background: 'rgba(120,67,238,0.1)', color: '#7843EE', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              🗺️ Calibrate first (2 min)
            </motion.button>
          </div>
        </div>
      )}

      {step === 'calibrate' && (
        <div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginBottom: '16px' }}>Click each stakeholder to understand their position before walking in.</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '20px' }}>
            {STAKEHOLDERS_CAL.map(s => {
              const isOpen = calibrated.has(s.id);
              return (
                <motion.div key={s.id} style={{ borderRadius: '12px', border: `2px solid ${isOpen ? s.color : s.color + '40'}`, background: isOpen ? `${s.color}10` : 'var(--ed-card)', overflow: 'hidden', transition: 'all 0.2s', boxShadow: isOpen ? `0 4px 16px ${s.color}25` : 'none' }}>
                  <div onClick={() => toggle(s.id)} style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '22px' }}>{s.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: s.color }}>{s.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{s.role}</div>
                    </div>
                    <Pill text={isOpen ? 'CALIBRATED ✓' : 'INSPECT'} color={isOpen ? '#059669' : s.color} />
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: `1px solid ${s.color}25` }}>
                          {[['→ Wants', s.wants], ['⚠ Fears', s.fears], ['✓ Trusts', s.trusts]].map(([k, v]) => (
                            <div key={k as string} style={{ padding: '10px 14px', borderRight: '1px solid var(--ed-rule)' }}>
                              <div style={{ fontSize: '9px', fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: '4px' }}>{k as string}</div>
                              <div style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.55 }}>{v as string}</div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => runMeeting('prepared')}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#7843EE', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            ✓ Walk into the meeting →
          </motion.button>
        </div>
      )}

      {step === 'meeting' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', padding: '12px 16px', borderRadius: '8px', background: choice === 'cold' ? 'rgba(220,38,38,0.1)' : 'rgba(5,150,105,0.1)', border: `1.5px solid ${choice === 'cold' ? '#dc2626' : '#059669'}40` }}>
            <span style={{ fontSize: '18px' }}>{choice === 'cold' ? '🚪' : '🗺️'}</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: choice === 'cold' ? '#dc2626' : '#059669' }}>
              {choice === 'cold' ? 'Walking in cold — no calibration done' : 'Walking in prepared — all 3 stakeholders calibrated'}
            </div>
          </div>
          <div style={{ position: 'relative' as const, paddingLeft: '24px' }}>
            <div style={{ position: 'absolute' as const, left: '8px', top: 0, bottom: 0, width: '2px', background: 'var(--ed-rule)', borderRadius: '1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
              {events.slice(0, meetingStep + 1).map((e, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  style={{ position: 'relative' as const, paddingLeft: '0' }}>
                  <div style={{ position: 'absolute' as const, left: '-20px', top: '12px', width: '12px', height: '12px', borderRadius: '50%', background: e.good ? '#059669' : '#dc2626', border: '2px solid var(--ed-card)', boxShadow: `0 0 0 2px ${e.good ? '#059669' : '#dc2626'}40` }} />
                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--ed-card)', border: `1.5px solid ${e.color}40`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '18px' }}>{e.emoji}</span>
                      <div>
                        <span style={{ fontWeight: 700, color: e.color, fontSize: '12px' }}>{e.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--ed-ink3)', marginLeft: '6px' }}>{e.role}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: e.good ? 'var(--ed-ink2)' : '#dc2626', lineHeight: 1.6, fontWeight: e.good ? 400 : 600 }}>{e.event}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {!playing && meetingStep >= events.length - 1 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '16px' }}>
              <div style={{ padding: '14px 16px', borderRadius: '10px', background: choice === 'cold' ? 'rgba(220,38,38,0.08)' : `rgba(5,150,105,0.08)`, border: `1.5px solid ${choice === 'cold' ? '#dc2626' : '#059669'}40`, marginBottom: '10px', fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.65 }}>
                {choice === 'cold'
                  ? 'Without calibration, each stakeholder surfaced their unmet need live in the room — the meeting became reactive. Two minutes of pre-work would have changed every interaction.'
                  : 'Calibration converted three potential objections into three aligned voices. The meeting moved to decision because you removed ambiguity before the room filled.'}
              </div>
              <button onClick={reset} style={{ width: '100%', padding: '9px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', color: 'var(--ed-ink3)', fontSize: '12px', cursor: 'pointer' }}>
                ↺ Try the other approach
              </button>
            </motion.div>
          )}
        </div>
      )}
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 5 · EXEC CONTENT SELECTOR
// (replaces ExecReviewTheater / ExecAltitudeTool)
// ─────────────────────────────────────────
const CONTENT_POOL = [
  { id: 'c1',  label: '14 features shipped this quarter', emoji: '📦', category: 'activity', reaction: 'glazed',   impact: -15, note: 'Activity log. Not exec-relevant.' },
  { id: 'c2',  label: 'Enterprise churn: 8% → 5.2%',     emoji: '📉', category: 'outcome',  reaction: 'engaged',  impact: +25, note: 'Business result. Board-level relevance.' },
  { id: 'c3',  label: 'Sprint velocity: 42 pts avg',      emoji: '🏃', category: 'activity', reaction: 'glazed',   impact: -10, note: 'Engineering metric. Not a leadership concern.' },
  { id: 'c4',  label: 'AI adoption: 34% of accounts',     emoji: '🤖', category: 'outcome',  reaction: 'engaged',  impact: +20, note: 'Direct outcome metric.' },
  { id: 'c5',  label: 'SSO delay — 2 deals at risk',      emoji: '⚠️', category: 'risk',     reaction: 'alert',    impact: +18, note: 'Risk with commercial consequence. Must be surfaced.' },
  { id: 'c6',  label: 'Figma token system launched',      emoji: '🎨', category: 'activity', reaction: 'glazed',   impact: -8,  note: 'Internal process. Not exec-level.' },
  { id: 'c7',  label: 'Need headcount approval: analytics', emoji: '✋', category: 'ask',   reaction: 'decisive', impact: +22, note: 'Clear leadership ask. This is why you\'re in the room.' },
  { id: 'c8',  label: 'Q3 priority: AI workflow expansion', emoji: '🎯', category: 'direction', reaction: 'engaged', impact: +20, note: 'Forward direction. Leadership needs this to plan.' },
];

const REACTION_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  glazed:   { label: 'Eyes glazing',  color: '#94a3b8', emoji: '😐' },
  engaged:  { label: 'Leaning in',    color: '#059669', emoji: '👀' },
  alert:    { label: 'Alert',         color: '#dc2626', emoji: '🚨' },
  decisive: { label: 'Ready to act',  color: '#7843EE', emoji: '✅' },
};

const MAX_ITEMS = 5;

export function ExecReviewTheater() {
  const [selected, setSelected] = useState<string[]>([]);
  const [presented, setPresented] = useState(false);
  const [presentStep, setPresentStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = (id: string) => {
    if (!presented) setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < MAX_ITEMS ? [...prev, id] : prev);
  };

  const present = () => {
    setPresented(true);
    setPlaying(true);
    setPresentStep(0);
  };

  const selectedItems = selected.map(id => CONTENT_POOL.find(c => c.id === id)!);
  const totalImpact = selectedItems.reduce((s, c) => s + c.impact, 0);
  const engagementScore = Math.max(0, Math.min(100, 50 + totalImpact));

  useEffect(() => {
    if (!playing || !presented) return;
    if (presentStep < selected.length - 1) {
      timerRef.current = setTimeout(() => setPresentStep(s => s + 1), 1200);
    } else {
      setPlaying(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, presentStep, selected.length, presented]);

  const engColor = engagementScore >= 70 ? '#059669' : engagementScore >= 50 ? '#E67E22' : '#dc2626';

  const reset = () => { setSelected([]); setPresented(false); setPresentStep(-1); setPlaying(false); };

  return (
    <ToolCard title="Exec Content Selector" subtitle="Pick 5 items for your leadership update. Watch exec attention respond live as each item lands." icon="🏛️" color="#7843EE">
      {!presented ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--ed-ink3)' }}>Select up to 5 items for your executive update</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: selected.length >= MAX_ITEMS ? '#dc2626' : 'var(--ed-ink3)' }}>{selected.length}/{MAX_ITEMS} selected</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', marginBottom: '16px' }}>
            {CONTENT_POOL.map(item => {
              const isSelected = selected.includes(item.id);
              const r = REACTION_CONFIG[item.reaction];
              return (
                <motion.div key={item.id} whileHover={{ x: 3 }} onClick={() => toggle(item.id)}
                  style={{ padding: '10px 14px', borderRadius: '8px', cursor: selected.length >= MAX_ITEMS && !isSelected ? 'not-allowed' : 'pointer', background: isSelected ? 'rgba(120,67,238,0.1)' : 'var(--ed-card)', border: `1.5px solid ${isSelected ? '#7843EE' : 'var(--ed-rule)'}`, display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.15s', opacity: selected.length >= MAX_ITEMS && !isSelected ? 0.5 : 1 }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.emoji}</span>
                  <span style={{ flex: 1, fontSize: '13px', fontWeight: isSelected ? 600 : 400, color: 'var(--ed-ink)' }}>{item.label}</span>
                  <Pill text={`${r.emoji} ${r.label}`} color={r.color} />
                </motion.div>
              );
            })}
          </div>
          {selected.length === MAX_ITEMS && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }} onClick={present}
              style={{ width: '100%', padding: '13px', borderRadius: '10px', background: '#7843EE', color: '#fff', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              ▶ Present to Leadership
            </motion.button>
          )}
        </>
      ) : (
        <>
          {/* Engagement meter — live */}
          <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'var(--ed-card)', border: `1.5px solid ${engColor}40`, marginBottom: '20px', boxShadow: `0 2px 12px ${engColor}20` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: engColor, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>EXEC ENGAGEMENT</div>
              <motion.div key={engagementScore} animate={{ scale: [1.15, 1] }} transition={{ duration: 0.25 }} style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, fontSize: '20px', color: engColor }}>
                {engagementScore}%
              </motion.div>
            </div>
            <div style={{ height: '10px', borderRadius: '5px', background: 'var(--ed-rule)', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${engagementScore}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', borderRadius: '5px', background: `linear-gradient(90deg, ${engColor}, ${engColor}cc)` }} />
            </div>
          </div>

          {/* Item-by-item presentation */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '16px' }}>
            {selectedItems.slice(0, presentStep + 1).map((item, i) => {
              const r = REACTION_CONFIG[item.reaction];
              return (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--ed-card)', border: `1.5px solid ${r.color}40`, display: 'flex', gap: '12px', alignItems: 'center', boxShadow: `0 2px 8px ${r.color}20` }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ed-ink)', marginBottom: '3px' }}>{item.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{item.note}</div>
                  </div>
                  <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                    <div style={{ fontSize: '20px' }}>{r.emoji}</div>
                    <Pill text={r.label} color={r.color} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {!playing && presentStep >= selected.length - 1 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ padding: '14px 16px', borderRadius: '10px', background: engagementScore >= 70 ? `rgba(5,150,105,0.1)` : 'rgba(220,38,38,0.08)', border: `1.5px solid ${engColor}40`, marginBottom: '10px', fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.65 }}>
                {engagementScore >= 70
                  ? 'Strong exec update. Outcomes, risk, direction, and a clear ask — leadership has what they need to decide.'
                  : 'Too much activity, not enough outcome. Feature lists and velocity stats are noise at leadership altitude. Lead with results, risk, and ask.'}
              </div>
              <button onClick={reset} style={{ width: '100%', padding: '9px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', color: 'var(--ed-ink3)', fontSize: '12px', cursor: 'pointer' }}>
                ↺ Rebuild the update
              </button>
            </motion.div>
          )}
        </>
      )}
    </ToolCard>
  );
}

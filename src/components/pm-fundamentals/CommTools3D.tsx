'use client';

/**
 * CommTools3D — Interactive teaching tools for Module 06: Effective Communication.
 *
 * Visual style: light, colorful, product-workspace feel.
 * No dark backgrounds. No spinning WebGL objects.
 * Teaching through direct manipulation, visible cause-and-effect, live meters.
 *
 * Track 1 (Beginner):
 *   CommunicationPrism      → StakeholderTranslationTool
 *   NarrativeStaircase      → NarrativeStaircase (kept — staircase metaphor is sound)
 *   RoadmapPressureChamber  → RoadmapPressureSimulator (redesigned)
 *
 * Track 2 (Experienced):
 *   StakeholderCalibrationRoom → StakeholderCalibrationRoom (kept)
 *   ExecReviewTheater          → ExecAltitudeTool (redesigned)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────
// SHARED DESIGN TOKENS
// ─────────────────────────────────────────
const STAKEHOLDER_COLORS = {
  engineering: '#3A86FF',
  design:      '#0097A7',
  sales:       '#E67E22',
  leadership:  '#7843EE',
};

const toolCard: React.CSSProperties = {
  background: 'var(--ed-card)',
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
  overflow: 'hidden',
  margin: '32px 0',
};

const toolHeader = (color: string): React.CSSProperties => ({
  padding: '14px 20px',
  background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
  borderBottom: `1px solid ${color}20`,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

const Meter = ({ label, value, color, inverse = false }: { label: string; value: number; color: string; inverse?: boolean }) => (
  <div style={{ flex: 1 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>{label.toUpperCase()}</span>
      <span style={{ fontSize: '10px', fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace" }}>{Math.round(value * 100)}%</span>
    </div>
    <div style={{ height: '6px', borderRadius: '3px', background: 'var(--ed-rule)', overflow: 'hidden' }}>
      <motion.div animate={{ width: `${value * 100}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', borderRadius: '3px', background: color }} />
    </div>
  </div>
);

const Avatar = ({ emoji, label, color, size = 44 }: { emoji: string; label: string; color: string; size?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '4px' }}>
    <div style={{ width: size, height: size, borderRadius: '50%', background: `${color}18`, border: `2px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.45 }}>
      {emoji}
    </div>
    <div style={{ fontSize: '9px', fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' }}>{label}</div>
  </div>
);

const SpeechBubble = ({ text, color, align = 'left' }: { text: string; color: string; align?: 'left' | 'right' }) => (
  <div style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: align === 'left' ? '0 10px 10px 10px' : '10px 0 10px 10px', padding: '8px 12px', fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.5, maxWidth: '180px', position: 'relative' as const }}>
    {text}
  </div>
);

// ─────────────────────────────────────────
// TOOL 1 · STAKEHOLDER TRANSLATION TOOL (T1-01)
// ─────────────────────────────────────────
type StakeholderKey = 'engineering' | 'design' | 'sales' | 'leadership';

const TRANSLATIONS: Record<StakeholderKey, { icon: string; label: string; points: string[]; noNeed: string; action: string }> = {
  engineering: {
    icon: '⚙️', label: 'Engineering',
    points: ['Problem: users fail to retrieve old call recordings', 'Primary use case: search by contact name', 'Scope for v1: contact-first retrieval only', 'Constraints: transcript search is out of scope', 'Success metric: retrieval success rate ≥85%'],
    noNeed: 'Business strategy, sales positioning',
    action: 'Build with clear scope and constraints',
  },
  design: {
    icon: '🎨', label: 'Design',
    points: ['User trying to find older calls in a workflow', 'Current friction: no clear search entry point by contact', 'Likely confusion: date vs name search intent', 'Edge cases: no results, partial name matches', 'Experience goal: fewer than 2 steps to retrieve a call'],
    noNeed: 'Business metrics, technical constraints',
    action: 'Design the search experience for the right user intent',
  },
  sales: {
    icon: '💼', label: 'Sales / CS',
    points: ['Customer value: faster access to past conversations', 'Safe phrasing: "improved call retrieval experience"', 'Do not promise: transcript search, advanced filters', 'Who benefits most: teams with high call volume', 'What to say externally: available in next release'],
    noNeed: 'Technical scope, implementation detail',
    action: 'Communicate value without overcommitting',
  },
  leadership: {
    icon: '📊', label: 'Leadership',
    points: ['Why now: 34% of searches fail — high-frequency friction', 'User pain tied to repeat usage and retention', 'Why prioritized: highest-confidence fix this quarter', 'Expected outcome: search success rate +20pts', 'Key tradeoff: transcript search deferred to v2'],
    noNeed: 'Implementation detail, design specifics',
    action: 'Approve scope and priority direction',
  },
};

export function CommunicationPrism() {
  const [selected, setSelected] = useState<StakeholderKey | null>(null);
  const [showGeneric, setShowGeneric] = useState(false);

  const RAW_MESSAGE = 'We are improving search because users struggle to find past call recordings.';
  const GENERIC_PROBLEM = 'This message gives everyone the same high-level context — no one gets what they need to act.';

  return (
    <div style={toolCard}>
      <div style={toolHeader('#0284C7')}>
        <span style={{ fontSize: '18px' }}>🔀</span>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#0284C7', textTransform: 'uppercase' as const }}>Stakeholder Translation Tool</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>One message. Different framing. Click a stakeholder to see the translation.</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          {(['Generic', 'Tailored'] as const).map(mode => (
            <button key={mode} onClick={() => setShowGeneric(mode === 'Generic')}
              style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${(mode === 'Generic') === showGeneric ? '#dc2626' : '#0284C7'}`, background: (mode === 'Generic') === showGeneric ? 'rgba(220,38,38,0.1)' : 'rgba(2,132,199,0.1)', color: (mode === 'Generic') === showGeneric ? '#dc2626' : '#0284C7', fontFamily: "'JetBrains Mono', monospace" }}>
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px', background: 'linear-gradient(160deg, rgba(2,132,199,0.05) 0%, rgba(2,132,199,0.02) 100%)' }}>
        {/* Raw message */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>RAW PRODUCT MESSAGE</div>
          <div style={{ background: 'var(--ed-card)', borderRadius: '10px', padding: '14px 18px', border: '2px solid #0284C730', boxShadow: '0 2px 12px rgba(2,132,199,0.1)', fontSize: '14px', color: 'var(--ed-ink)', lineHeight: 1.6, fontStyle: 'italic' }}>
            &ldquo;{RAW_MESSAGE}&rdquo;
          </div>
        </div>

        {showGeneric ? (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '16px 18px', borderRadius: '10px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', marginBottom: '4px', fontFamily: "'JetBrains Mono', monospace" }}>⚠ GENERIC VERSION</div>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.6 }}>{GENERIC_PROBLEM}</div>
          </motion.div>
        ) : null}

        {/* Stakeholder panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {(Object.keys(TRANSLATIONS) as StakeholderKey[]).map(key => {
            const t = TRANSLATIONS[key];
            const color = STAKEHOLDER_COLORS[key];
            const isSelected = selected === key;
            return (
              <motion.div key={key} whileHover={{ y: -2, boxShadow: `0 8px 24px ${color}25` }} onClick={() => setSelected(isSelected ? null : key)}
                style={{ background: isSelected ? `${color}0A` : 'var(--ed-card)', borderRadius: '12px', border: `2px solid ${isSelected ? color : color + '30'}`, cursor: 'pointer', overflow: 'hidden', transition: 'border 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                {/* Panel header */}
                <div style={{ padding: '12px 16px', background: `${color}10`, borderBottom: `1px solid ${color}20`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{t.icon}</span>
                  <div style={{ fontWeight: 700, fontSize: '13px', color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.label}</div>
                  <div style={{ marginLeft: 'auto', width: '18px', height: '18px', borderRadius: '50%', background: isSelected ? color : 'transparent', border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: isSelected ? '#fff' : color, transition: 'all 0.2s' }}>
                    {isSelected ? '✓' : '→'}
                  </div>
                </div>

                <AnimatePresence>
                  {isSelected && !showGeneric && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '9px', fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>WHAT THEY NEED TO HEAR</div>
                        {t.points.map((p, i) => (
                          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px', alignItems: 'flex-start' }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, flexShrink: 0, marginTop: '6px' }} />
                            <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.55 }}>{p}</div>
                          </div>
                        ))}
                        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                          <div style={{ padding: '8px 12px', borderRadius: '7px', background: 'rgba(220,38,38,0.08)', fontSize: '11px', color: 'var(--ed-ink)' }}>
                            <strong>Not needed:</strong> {t.noNeed}
                          </div>
                          <div style={{ padding: '8px 12px', borderRadius: '7px', background: `${color}10`, fontSize: '11px', color, fontWeight: 600 }}>
                            → {t.action}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {!isSelected && !showGeneric && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ padding: '10px 16px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>What they care about · What helps them act</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {!selected && !showGeneric && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ marginTop: '14px', padding: '10px 16px', borderRadius: '8px', background: 'rgba(2,132,199,0.06)', border: '1px solid #0284C720', fontSize: '12px', color: 'var(--ed-ink2)', textAlign: 'center' as const }}>
            Same initiative — four different translations. Click any panel to see what that stakeholder needs to act well.
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// TOOL 2 · NARRATIVE STAIRCASE (T1-04)
// ─────────────────────────────────────────
const STEPS = [
  { id: 0, label: 'Context',         emoji: '🌍', color: 'var(--ed-ink3)', desc: 'What is happening in the product or business right now?' },
  { id: 1, label: 'Problem',         emoji: '⚡', color: '#E67E22', desc: 'What is not working, and why does it deserve attention?' },
  { id: 2, label: 'Evidence',        emoji: '📊', color: '#E67E22', desc: 'What does data, user behaviour, or research show?' },
  { id: 3, label: 'Why Now',         emoji: '⏱',  color: '#0284C7', desc: 'Why does this matter at this specific moment?' },
  { id: 4, label: 'Proposed Path',   emoji: '🗺️', color: '#059669', desc: 'What are you recommending the team do?' },
  { id: 5, label: 'Expected Impact', emoji: '📈', color: '#059669', desc: 'What should measurably change if this works?' },
  { id: 6, label: 'Ask',            emoji: '✋', color: '#7843EE', desc: 'What decision, support, or alignment do you need now?' },
];

const WEAK_MISSING = new Set([0, 1]);

export function NarrativeStaircase() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [weakMode, setWeakMode] = useState(false);

  return (
    <div style={toolCard}>
      <div style={toolHeader('#7843EE')}>
        <span style={{ fontSize: '18px' }}>🪜</span>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#7843EE', textTransform: 'uppercase' as const }}>Narrative Staircase</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>PM storytelling works in sequence. You cannot start at the wrong layer.</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          {(['Strong', 'Weak'] as const).map(m => (
            <button key={m} onClick={() => { setWeakMode(m === 'Weak'); setActiveStep(null); }}
              style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", border: `1.5px solid ${(m === 'Weak') === weakMode ? '#dc2626' : '#7843EE'}`, background: (m === 'Weak') === weakMode ? 'rgba(220,38,38,0.1)' : 'rgba(120,67,238,0.1)', color: (m === 'Weak') === weakMode ? '#dc2626' : '#7843EE' }}>
              {m} Narrative
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px', background: 'linear-gradient(160deg, rgba(120,67,238,0.05) 0%, rgba(120,67,238,0.02) 100%)' }}>
        {weakMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', fontSize: '13px', color: 'var(--ed-ink)' }}>
            ⚠ <strong>Weak narrative:</strong> Steps 1–2 (Context + Problem) are missing. The audience has no reason to care before you reach the solution. The upper steps have no foundation to stand on.
          </motion.div>
        )}

        {/* Staircase visual */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', marginBottom: '16px' }}>
          {STEPS.map((step, idx) => {
            const isMissing = weakMode && WEAK_MISSING.has(step.id);
            const isActive = activeStep === step.id;
            const indent = idx * 28;
            return (
              <motion.div key={step.id} whileHover={!isMissing ? { x: 4 } : {}}
                onClick={() => !isMissing && setActiveStep(isActive ? null : step.id)}
                style={{ marginLeft: indent, opacity: isMissing ? 0.2 : 1, cursor: isMissing ? 'default' : 'pointer', transition: 'opacity 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', background: isActive ? `${step.color}12` : 'var(--ed-card)', border: `2px solid ${isActive ? step.color : step.color + '25'}`, boxShadow: isActive ? `0 4px 16px ${step.color}20` : '0 1px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{isMissing ? '···' : step.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: isMissing ? '#cbd5e1' : step.color }}>
                      {isMissing ? '[ Missing ]' : `Step ${idx + 1} · ${step.label}`}
                    </div>
                    {isActive && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: '12px', color: 'var(--ed-ink2)', marginTop: '3px', lineHeight: 1.5 }}>
                        {step.desc}
                      </motion.div>
                    )}
                  </div>
                  {!isMissing && (
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: isActive ? step.color : 'transparent', border: `2px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: isActive ? '#fff' : step.color, flexShrink: 0, transition: 'all 0.2s' }}>
                      {isActive ? '✓' : idx + 1}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(120,67,238,0.06)', border: '1px solid #7843EE20', fontSize: '12px', color: 'var(--ed-ink2)', textAlign: 'center' as const }}>
          {weakMode
            ? 'When foundations are missing, no amount of evidence or solution detail creates alignment.'
            : 'Click any step to see what it contributes. Toggle to Weak Narrative to see what breaks without foundations.'}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// TOOL 3 · ROADMAP PRESSURE SIMULATOR (T1-05 / T1-03)
// ─────────────────────────────────────────
type RoadmapStatus = 'Exploring' | 'Planned' | 'Committed' | 'Available Now';

const STATUS_DATA: Record<RoadmapStatus, {
  color: string;
  trust: number;
  clarity: number;
  expectationRisk: number;
  deliveryPressure: number;
  interpretations: { name: string; emoji: string; quote: string }[];
}> = {
  'Exploring': {
    color: 'var(--ed-ink3)', trust: 0.6, clarity: 0.35, expectationRisk: 0.2, deliveryPressure: 0.15,
    interpretations: [
      { name: 'Customer',    emoji: '🧑‍💼', quote: 'Probably not coming soon...' },
      { name: 'Sales',       emoji: '🤝', quote: 'Can\'t really promise this.' },
      { name: 'CS',          emoji: '💬', quote: 'Will manage expectations down.' },
      { name: 'Leadership',  emoji: '📋', quote: 'Noted as possible direction.' },
      { name: 'Engineering', emoji: '⚙️', quote: 'Not in our planning yet.' },
    ],
  },
  'Planned': {
    color: '#E67E22', trust: 0.65, clarity: 0.55, expectationRisk: 0.5, deliveryPressure: 0.4,
    interpretations: [
      { name: 'Customer',    emoji: '🧑‍💼', quote: 'So I can buy this soon?' },
      { name: 'Sales',       emoji: '🤝', quote: 'Can I promise this?' },
      { name: 'CS',          emoji: '💬', quote: 'Customers will keep asking.' },
      { name: 'Leadership',  emoji: '📋', quote: 'Why is this not priority?' },
      { name: 'Engineering', emoji: '⚙️', quote: 'What\'s the real plan?' },
    ],
  },
  'Committed': {
    color: '#059669', trust: 0.8, clarity: 0.8, expectationRisk: 0.75, deliveryPressure: 0.85,
    interpretations: [
      { name: 'Customer',    emoji: '🧑‍💼', quote: 'We\'re building our plan around this.' },
      { name: 'Sales',       emoji: '🤝', quote: 'I\'m telling prospects it\'s coming.' },
      { name: 'CS',          emoji: '💬', quote: 'Customers will hold us to this.' },
      { name: 'Leadership',  emoji: '📋', quote: 'We\'ll track this as a delivery.' },
      { name: 'Engineering', emoji: '⚙️', quote: 'This needs to be in the sprint.' },
    ],
  },
  'Available Now': {
    color: '#0284C7', trust: 0.9, clarity: 0.95, expectationRisk: 1.0, deliveryPressure: 1.0,
    interpretations: [
      { name: 'Customer',    emoji: '🧑‍💼', quote: 'I need access today.' },
      { name: 'Sales',       emoji: '🤝', quote: 'Selling it on calls right now.' },
      { name: 'CS',          emoji: '💬', quote: 'Customers are asking where to find it.' },
      { name: 'Leadership',  emoji: '📋', quote: 'Expecting adoption metrics.' },
      { name: 'Engineering', emoji: '⚙️', quote: 'Must be fully shipped and stable.' },
    ],
  },
};

const RISK_LEVEL = (v: number) => v < 0.35 ? '#059669' : v < 0.65 ? '#E67E22' : '#dc2626';

export function RoadmapPressureChamber() {
  const [status, setStatus] = useState<RoadmapStatus>('Planned');
  const data = STATUS_DATA[status];

  return (
    <div style={toolCard}>
      <div style={toolHeader(data.color)}>
        <span style={{ fontSize: '18px' }}>📡</span>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: data.color, textTransform: 'uppercase' as const }}>Roadmap Pressure Simulator</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>One word on your roadmap creates a different system effect for every stakeholder.</div>
        </div>
      </div>

      <div style={{ padding: '24px', background: 'linear-gradient(160deg, rgba(21,129,88,0.05) 0%, rgba(21,129,88,0.02) 100%)' }}>
        {/* Central statement */}
        <div style={{ textAlign: 'center' as const, marginBottom: '24px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>ROADMAP STATEMENT</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--ed-card)', borderRadius: '12px', padding: '14px 20px', border: `2px solid ${data.color}40`, boxShadow: `0 4px 20px ${data.color}15`, fontSize: '14px', color: 'var(--ed-ink)', fontStyle: 'italic' }}>
            &ldquo;Advanced reporting is&nbsp;<span style={{ fontWeight: 800, color: data.color, fontStyle: 'normal', padding: '2px 10px', borderRadius: '6px', background: `${data.color}15` }}>{status}</span>&#46;&rdquo;
          </div>

          {/* Status toggle */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
            {(Object.keys(STATUS_DATA) as RoadmapStatus[]).map(s => (
              <motion.button key={s} whileHover={{ y: -1 }} onClick={() => setStatus(s)}
                style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", border: `2px solid ${STATUS_DATA[s].color}`, background: status === s ? STATUS_DATA[s].color : 'var(--ed-card)', color: status === s ? '#fff' : STATUS_DATA[s].color, transition: 'all 0.2s', boxShadow: status === s ? `0 4px 12px ${STATUS_DATA[s].color}40` : 'none' }}>
                {s}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Stakeholder interpretations */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {data.interpretations.map((interp, i) => (
            <motion.div key={interp.name} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: 'var(--ed-card)', borderRadius: '12px', padding: '14px 10px', textAlign: 'center' as const, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${data.color}20` }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>{interp.emoji}</div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginBottom: '8px' }}>{interp.name.toUpperCase()}</div>
              <div style={{ background: `${data.color}10`, border: `1px solid ${data.color}25`, borderRadius: '7px', padding: '6px 8px', fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.45, fontStyle: 'italic' }}>
                &ldquo;{interp.quote}&rdquo;
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live meters */}
        <div style={{ background: 'var(--ed-card)', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '12px' }}>LIVE SYSTEM IMPACT</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Meter label="Trust" value={data.trust} color={data.trust > 0.65 ? '#059669' : '#E67E22'} />
            <Meter label="Clarity" value={data.clarity} color={data.clarity > 0.65 ? '#059669' : '#E67E22'} />
            <Meter label="Expectation Risk" value={data.expectationRisk} color={RISK_LEVEL(data.expectationRisk)} />
            <Meter label="Delivery Pressure" value={data.deliveryPressure} color={RISK_LEVEL(data.deliveryPressure)} />
          </div>
        </div>

        <div style={{ marginTop: '12px', padding: '10px 16px', borderRadius: '8px', background: 'rgba(2,132,199,0.06)', border: '1px solid #0284C720', fontSize: '12px', color: 'var(--ed-ink2)', textAlign: 'center' as const }}>
          &ldquo;Planned&rdquo; and &ldquo;Committed&rdquo; are not the same word. Toggle between them to see the system difference.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// TOOL 4 · STAKEHOLDER CALIBRATION ROOM (T2-02)
// ─────────────────────────────────────────
const CAL_PODS = [
  { name: 'Sales',       color: '#E67E22', emoji: '🤝', wants: 'Broader feature promises to close deals', fears: 'Losing deals to competitors with a stronger roadmap story', trusts: 'Customer quotes, competitive comparison, pipeline data' },
  { name: 'Engineering', color: '#3A86FF', emoji: '⚙️', wants: 'Narrower, stable scope to hit the committed date', fears: 'Scope creep that breaks the delivery promise', trusts: 'Technical feasibility data, clear non-goals, locked scope' },
  { name: 'Leadership',  color: '#7843EE', emoji: '📋', wants: 'Clear business outcome with defined risk', fears: 'Wasted investment or a miss that looks bad to the board', trusts: 'Outcome metrics, strategic tradeoff logic, confidence levels' },
  { name: 'CS',          color: '#059669', emoji: '💬', wants: 'Predictable timeline to manage customer expectations', fears: 'Getting caught off-guard by a customer asking about something not shipped', trusts: 'Specific language guides, launch briefs, clear scope boundaries' },
  { name: 'Design',      color: '#C85A40', emoji: '🎨', wants: 'Clear user problem and enough discovery time', fears: 'Being handed a solution and asked to design around it', trusts: 'User research, problem statements, defined constraints' },
];

export function StakeholderCalibrationRoom() {
  const [active, setActive] = useState<number | null>(null);
  const pod = active !== null ? CAL_PODS[active] : null;

  return (
    <div style={toolCard}>
      <div style={toolHeader('#7843EE')}>
        <span style={{ fontSize: '18px' }}>🗺️</span>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#7843EE', textTransform: 'uppercase' as const }}>Stakeholder Calibration Room</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Good alignment starts before the meeting. Inspect each stakeholder.</div>
        </div>
      </div>

      <div style={{ padding: '24px', background: 'linear-gradient(160deg, rgba(120,67,238,0.05) 0%, rgba(120,67,238,0.02) 100%)' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' as const }}>
          {CAL_PODS.map((pod, i) => (
            <motion.div key={pod.name} whileHover={{ y: -3, boxShadow: `0 8px 24px ${pod.color}25` }} onClick={() => setActive(active === i ? null : i)}
              style={{ flex: 1, minWidth: '100px', background: active === i ? `${pod.color}0D` : 'var(--ed-card)', borderRadius: '12px', padding: '14px 12px', textAlign: 'center' as const, cursor: 'pointer', border: `2px solid ${active === i ? pod.color : pod.color + '30'}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>{pod.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: '12px', color: pod.color }}>{pod.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '3px' }}>{active === i ? 'click to close' : 'click to inspect'}</div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {pod ? (
            <motion.div key={pod.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              style={{ background: 'var(--ed-card)', borderRadius: '12px', border: `2px solid ${pod.color}30`, overflow: 'hidden', boxShadow: `0 4px 20px ${pod.color}15` }}>
              <div style={{ padding: '12px 18px', background: `${pod.color}10`, borderBottom: `1px solid ${pod.color}20`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>{pod.emoji}</span>
                <span style={{ fontWeight: 700, color: pod.color, fontSize: '14px' }}>{pod.name}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[{ k: '→ Wants', v: pod.wants }, { k: '⚠ Fears', v: pod.fears }, { k: '✓ Trusts', v: pod.trusts }].map((row, i) => (
                  <div key={row.k} style={{ padding: '14px 16px', borderRight: i < 2 ? `1px solid ${pod.color}15` : 'none' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: pod.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>{row.k.toUpperCase()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{row.v}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ padding: '14px 18px', borderRadius: '10px', background: 'rgba(120,67,238,0.06)', border: '1px solid #7843EE20', fontSize: '12px', color: 'var(--ed-ink2)', textAlign: 'center' as const }}>
              Click each stakeholder to understand what they want, fear, and trust before you walk into the room.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// TOOL 5 · EXEC ALTITUDE TOOL (T2-04)
// ─────────────────────────────────────────
const ALTITUDE_LEVELS = [
  {
    id: 'team',
    label: 'Team View',
    icon: '👷',
    color: 'var(--ed-ink3)',
    altitude: 0,
    content: [
      { emoji: '🎫', text: 'Sprint: 14 tickets in progress, 6 in review' },
      { emoji: '🎨', text: 'Figma handoff complete for onboarding screens' },
      { emoji: '🔧', text: 'Backend indexing dependency — Neeraj estimates 3 days' },
      { emoji: '📝', text: 'Edge cases documented for empty-state handling' },
    ],
    note: 'Execution detail. Valuable for the team. Noise for leadership.',
  },
  {
    id: 'cross',
    label: 'Cross-functional',
    icon: '🤝',
    color: '#0097A7',
    altitude: 1,
    content: [
      { emoji: '📊', text: 'Onboarding completion: trending from 30% → 38%' },
      { emoji: '⚠️', text: 'Risk: CS not yet briefed on new feature scope' },
      { emoji: '📅', text: 'Launch readiness: GTM brief needs sign-off by Thu' },
      { emoji: '🔗', text: 'Dependency on design review — blocking 2 tickets' },
    ],
    note: 'Impact and readiness. Useful for alignment across teams.',
  },
  {
    id: 'exec',
    label: 'Executive View',
    icon: '📋',
    color: '#7843EE',
    altitude: 2,
    content: [
      { emoji: '🎯', text: 'Objective: improve onboarding completion from 30% to 60%' },
      { emoji: '📈', text: 'Current state: 38% — on trajectory, 2 weeks to launch' },
      { emoji: '⚡', text: 'Key risk: SSO dependency could delay enterprise rollout' },
      { emoji: '✋', text: 'Ask: approval to deprioritise reporting in this cycle' },
    ],
    note: 'Outcome, risk, direction, ask. This is what leadership needs.',
  },
];

export function ExecReviewTheater() {
  const [level, setLevel] = useState(1);
  const current = ALTITUDE_LEVELS[level];

  return (
    <div style={toolCard}>
      <div style={toolHeader('#7843EE')}>
        <span style={{ fontSize: '18px' }}>🏔️</span>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#7843EE', textTransform: 'uppercase' as const }}>Exec Altitude Tool</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Leadership communication is not less detail. It is different altitude.</div>
        </div>
      </div>

      <div style={{ padding: '24px', background: 'linear-gradient(160deg, rgba(120,67,238,0.05) 0%, rgba(120,67,238,0.02) 100%)' }}>
        {/* Altitude selector */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '24px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--ed-rule)' }}>
          {ALTITUDE_LEVELS.map((l, i) => (
            <motion.button key={l.id} whileHover={{ opacity: 0.9 }} onClick={() => setLevel(i)}
              style={{ flex: 1, padding: '12px 16px', border: 'none', cursor: 'pointer', background: level === i ? l.color : 'var(--ed-card)', color: level === i ? '#fff' : 'var(--ed-ink3)', fontWeight: level === i ? 700 : 400, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRight: i < 2 ? '1px solid var(--ed-rule)' : 'none', transition: 'all 0.2s' }}>
              <span>{l.icon}</span> {l.label}
            </motion.button>
          ))}
        </div>

        {/* Layered platforms */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '20px' }}>
          {[...ALTITUDE_LEVELS].reverse().map((l, ri) => {
            const i = 2 - ri;
            const isCurrent = level === i;
            const isBelow = i < level;
            return (
              <motion.div key={l.id} animate={{ opacity: isCurrent ? 1 : isBelow ? 0.4 : 0.65, scale: isCurrent ? 1 : 0.97 }} transition={{ duration: 0.3 }}
                onClick={() => setLevel(i)}
                style={{ borderRadius: '12px', border: `2px solid ${isCurrent ? l.color : l.color + '30'}`, overflow: 'hidden', cursor: 'pointer', background: isCurrent ? `${l.color}08` : 'var(--ed-card)', boxShadow: isCurrent ? `0 4px 16px ${l.color}20` : 'none' }}>
                <div style={{ padding: '10px 14px', background: isCurrent ? `${l.color}15` : 'var(--ed-cream2)', borderBottom: `1px solid ${l.color}20`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{l.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '12px', color: l.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>{l.label.toUpperCase()}</span>
                  {isCurrent && <span style={{ marginLeft: 'auto', fontSize: '10px', color: l.color, fontWeight: 600 }}>← CURRENT ALTITUDE</span>}
                </div>
                <AnimatePresence>
                  {isCurrent && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {l.content.map((c, ci) => (
                          <div key={ci} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '8px 10px', borderRadius: '8px', background: `${l.color}08`, border: `1px solid ${l.color}15` }}>
                            <span style={{ fontSize: '14px', flexShrink: 0 }}>{c.emoji}</span>
                            <span style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.5 }}>{c.text}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: '8px 16px 14px', fontSize: '12px', color: l.color, fontWeight: 600, fontStyle: 'italic' }}>
                        → {l.note}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div style={{ padding: '10px 16px', borderRadius: '8px', background: 'rgba(120,67,238,0.06)', border: '1px solid #7843EE20', fontSize: '12px', color: 'var(--ed-ink2)', textAlign: 'center' as const }}>
          Move between altitudes to see how the same initiative changes. Executive communication compresses without distorting — not just fewer words.
        </div>
      </div>
    </div>
  );
}

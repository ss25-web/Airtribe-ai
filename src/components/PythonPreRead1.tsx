'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useLearnerStore } from '@/lib/learnerStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChapterSection, para, h2, keyBox, ApplyItBox,
} from './pm-fundamentals/designSystem';
import SWEPreReadLayout from './SWEPreReadLayout';
import { MentorFace } from './pm-fundamentals/MentorFaces';
// SWEConversationScene not used — using local ConvoScene instead
import QuizEngine from './QuizEngine';

const ACCENT = '#16A34A';
const ACCENT_RGB = '22,163,74';
const MODULE_ID = 'python-pr-01';

const SECTIONS = [
  { id: 'variables',    label: 'Variables — Names, Not Boxes' },
  { id: 'data-types',   label: 'Data Types & Structures' },
  { id: 'functions',    label: 'Functions & Reuse' },
  { id: 'lambda',       label: 'Lambda & Transformation' },
  { id: 'type-hints',   label: 'Type Hints' },
  { id: 'synthesis',    label: 'Putting It Together' },
  { id: 'reflection',   label: 'What Arjun Finally Understood' },
];

const TRACK_CONFIG = {
  name: 'Python',
  accent: ACCENT,
  accentRgb: ACCENT_RGB,
  protagonist: 'Arjun',
  role: 'Aspiring Backend Engineer',
  company: 'Learning Python',
  mentor: 'Nisha',
  mentorRole: 'Backend Mentor',
  mentorColor: '#0369A1',
};

// ─────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────
const CodeBlock = ({ code, filename }: { code: string; filename?: string }) => (
  <div style={{ margin: '20px 0', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(134,239,172,0.15)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
    {filename && (
      <div style={{ background: '#1e293b', padding: '8px 16px', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#64748b', letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {filename}
      </div>
    )}
    <pre style={{ background: '#0f172a', color: '#86efac', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', lineHeight: 1.75, padding: '20px 24px', margin: 0, overflowX: 'auto' as const }}>
      <code>{code}</code>
    </pre>
  </div>
);

const ConvoScene = ({ lines, mentorName, mentorColor }: {
  lines: { speaker: 'arjun' | 'mentor'; text: string }[];
  mentorName: string;
  mentorColor: string;
}) => (
  <div style={{ margin: '24px 0', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
    {lines.map((line, i) => {
      const isMentor = line.speaker === 'mentor';
      return (
        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: isMentor ? 'row-reverse' : 'row' as const }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isMentor ? `${mentorColor}25` : `rgba(${ACCENT_RGB},0.18)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px', color: isMentor ? mentorColor : ACCENT, flexShrink: 0 }}>
            {isMentor ? mentorName[0] : 'A'}
          </div>
          <div style={{ maxWidth: '80%' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: isMentor ? mentorColor : ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: '3px', textAlign: isMentor ? 'right' as const : 'left' as const }}>
              {isMentor ? mentorName.toUpperCase() : 'ARJUN'}
            </div>
            <div style={{ padding: '10px 14px', borderRadius: isMentor ? '12px 4px 12px 12px' : '4px 12px 12px 12px', background: isMentor ? `${mentorColor}10` : `rgba(${ACCENT_RGB},0.08)`, border: `1px solid ${isMentor ? mentorColor : ACCENT}25`, fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.65 }}>
              {line.text}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const SceneSetter = ({ title, story, mentorQuote, mentorName, mentorColor }: {
  title: string; story: string; mentorQuote: string; mentorName: string; mentorColor: string;
}) => (
  <div style={{ margin: '0 0 28px', padding: '20px 24px', background: `rgba(${ACCENT_RGB},0.05)`, borderLeft: `4px solid ${ACCENT}`, borderRadius: '0 10px 10px 0', border: `1px solid ${ACCENT}25`, borderLeftWidth: '4px' }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, marginBottom: '8px', textTransform: 'uppercase' as const }}>
      {title}
    </div>
    <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.75, marginBottom: '14px' }}>{story}</div>
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 14px', borderRadius: '8px', background: `${mentorColor}10`, border: `1px solid ${mentorColor}30` }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: `${mentorColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px', color: mentorColor, flexShrink: 0 }}>{mentorName[0]}</div>
      <div style={{ fontSize: '13px', color: 'var(--ed-ink)', fontStyle: 'italic', lineHeight: 1.65 }}>
        <span style={{ fontWeight: 700, color: mentorColor, fontStyle: 'normal' }}>{mentorName}: </span>&ldquo;{mentorQuote}&rdquo;
      </div>
    </div>
  </div>
);

const PythonPrinciple = ({ text }: { text: string }) => (
  <div style={{ margin: '28px 0', padding: '20px 24px', background: `rgba(${ACCENT_RGB},0.07)`, borderLeft: `4px solid ${ACCENT}`, borderRadius: '0 8px 8px 0' }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: ACCENT, marginBottom: '8px', textTransform: 'uppercase' as const }}>Python Principle</div>
    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.65, fontStyle: 'italic', fontFamily: "'Lora', serif" }}>&ldquo;{text}&rdquo;</div>
  </div>
);

// ─────────────────────────────────────────
// TOOL 1 · PYTHON DATA STRUCTURE LAB
// ─────────────────────────────────────────
const DATA_ITEMS = [
  { id: 'd1', label: '"ravi@example.com"',     type: 'email',       correct: 'dict',   reason: 'Emails belong inside a user dictionary with a named "email" key.' },
  { id: 'd2', label: '["Ravi", "Aman", "Priya"]', type: 'userlist', correct: 'list',   reason: 'An ordered collection of names — order matters, duplicates possible.' },
  { id: 'd3', label: '(12.9716, 77.5946)',      type: 'coords',     correct: 'tuple',  reason: 'Coordinates are a fixed pair — order matters, values should not change.' },
  { id: 'd4', label: '{"python", "api", "backend"}', type: 'tags',  correct: 'set',    reason: 'Tags need uniqueness. A set automatically removes duplicates.' },
  { id: 'd5', label: 'name, age, email, is_admin', type: 'profile', correct: 'dict',   reason: 'Named fields = dictionary. Each key maps to its value.' },
  { id: 'd6', label: 'cart items in order',     type: 'cart',       correct: 'list',   reason: 'Cart items have order, can repeat, and change over time — that\'s a list.' },
];

const STRUCTURE_ZONES: { id: string; label: string; color: string; icon: string; desc: string }[] = [
  { id: 'list',  label: 'list',  color: '#3A86FF', icon: '[ ]', desc: 'Ordered, changeable, allows duplicates' },
  { id: 'tuple', label: 'tuple', color: '#7843EE', icon: '( )', desc: 'Ordered, fixed, allows duplicates' },
  { id: 'set',   label: 'set',   color: '#E67E22', icon: '{ }', desc: 'Unordered, unique items only' },
  { id: 'dict',  label: 'dict',  color: ACCENT,    icon: '{k:v}', desc: 'Named key-value pairs' },
];

function DataStructureLab() {
  const [placements, setPlacements] = useState<Record<string, string | null>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const place = (zoneId: string) => {
    if (!selected) return;
    const item = DATA_ITEMS.find(d => d.id === selected)!;
    const correct = item.correct === zoneId;
    setPlacements(prev => ({ ...prev, [selected]: zoneId }));
    setFeedback(prev => ({ ...prev, [selected]: correct }));
    setSelected(null);
  };

  const unplaced = DATA_ITEMS.filter(d => !placements[d.id]);
  const score = DATA_ITEMS.filter(d => feedback[d.id]).length;
  const allDone = DATA_ITEMS.every(d => placements[d.id]);

  return (
    <div style={{ background: 'var(--ed-card)', borderRadius: '16px', border: `1.5px solid ${ACCENT}35`, overflow: 'hidden', margin: '28px 0', boxShadow: '0 6px 24px rgba(0,0,0,0.10)' }}>
      <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${ACCENT}22 0%, ${ACCENT}10 100%)`, borderBottom: `1px solid ${ACCENT}25`, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: `${ACCENT}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔬</div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>Python Data Structure Lab</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Click a data item, then click the right structure. See why each choice matters.</div>
        </div>
      </div>
      <div style={{ padding: '24px', background: `linear-gradient(160deg, rgba(${ACCENT_RGB},0.04) 0%, rgba(${ACCENT_RGB},0.02) 100%)` }}>
        {/* Pool */}
        {unplaced.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>DATA ITEMS — click to select, then place</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
              {unplaced.map(item => (
                <motion.div key={item.id} whileHover={{ y: -2 }} onClick={() => setSelected(selected === item.id ? null : item.id)}
                  style={{ padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', background: selected === item.id ? `rgba(${ACCENT_RGB},0.12)` : 'var(--ed-card)', border: `1.5px solid ${selected === item.id ? ACCENT : 'var(--ed-rule)'}`, fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: selected === item.id ? ACCENT : 'var(--ed-ink)', fontWeight: selected === item.id ? 700 : 400, transition: 'all 0.15s' }}>
                  {item.label}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Structure zones */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          {STRUCTURE_ZONES.map(zone => (
            <motion.div key={zone.id} whileHover={selected ? { scale: 1.01 } : {}} onClick={() => place(zone.id)}
              style={{ borderRadius: '12px', border: `2px dashed ${selected ? zone.color : 'var(--ed-rule)'}`, padding: '12px 14px', cursor: selected ? 'pointer' : 'default', background: selected ? `${zone.color}08` : 'var(--ed-card)', transition: 'all 0.2s', minHeight: '80px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 800, color: zone.color }}>{zone.icon}</code>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: zone.color, letterSpacing: '0.08em' }}>{zone.label}</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginBottom: '8px' }}>{zone.desc}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '5px' }}>
                {DATA_ITEMS.filter(d => placements[d.id] === zone.id).map(item => (
                  <div key={item.id} style={{ padding: '3px 10px', borderRadius: '5px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", background: feedback[item.id] ? `${zone.color}18` : 'rgba(220,38,38,0.1)', border: `1px solid ${feedback[item.id] ? zone.color + '50' : 'rgba(220,38,38,0.4)'}`, color: feedback[item.id] ? zone.color : '#dc2626', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {feedback[item.id] ? '✓' : '✗'} {item.label}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Wrong placement explanations */}
        {DATA_ITEMS.filter(d => placements[d.id] && !feedback[d.id]).map(item => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '6px', padding: '9px 14px', borderRadius: '8px', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.25)', fontSize: '12px', color: 'var(--ed-ink2)' }}>
            <strong style={{ color: '#dc2626' }}>{item.label}</strong> → Correct: <code style={{ fontFamily: "'JetBrains Mono', monospace", color: STRUCTURE_ZONES.find(z => z.id === item.correct)?.color }}>{item.correct}</code>. {item.reason}
          </motion.div>
        ))}

        {allDone && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '14px 18px', borderRadius: '10px', background: score >= 5 ? `rgba(${ACCENT_RGB},0.08)` : 'rgba(230,126,34,0.08)', border: `1.5px solid ${score >= 5 ? ACCENT : '#E67E22'}40`, textAlign: 'center' as const }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{score >= 5 ? '🔬' : '💡'}</div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: score >= 5 ? ACCENT : '#E67E22' }}>{score}/{DATA_ITEMS.length} correct</div>
            <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '4px' }}>Backend engineering is full of choosing the right structure for the right kind of information.</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// TOOL 2 · FUNCTION BUILDER STUDIO
// ─────────────────────────────────────────
type BuildStep = 'identify' | 'name' | 'params' | 'return' | 'done';

function FunctionBuilderStudio() {
  const [step, setStep] = useState<BuildStep>('identify');
  const [funcName, setFuncName] = useState('');
  const [selectedParams, setSelectedParams] = useState<string[]>([]);
  const [returnType, setReturnType] = useState('');

  const PARAM_OPTIONS = ['price', 'tax', 'discount', 'quantity'];
  const RETURN_OPTIONS = ['float', 'int', 'str', 'bool'];

  const REPEATED_CODE = `# Order 1
total = 499.0 + 499.0 * 0.18
print(total)

# Order 2
total = 299.0 + 299.0 * 0.18
print(total)

# Order 3
total = 99.0 + 99.0 * 0.18
print(total)`;

  const buildResult = funcName && selectedParams.length > 0 && returnType
    ? `def ${funcName}(${selectedParams.join(', ')}: float) -> ${returnType}:\n    total = ${selectedParams[0]} + ${selectedParams[0]} * ${selectedParams[1] || '0.18'}\n    return total`
    : '';

  const toggleParam = (p: string) => setSelectedParams(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  return (
    <div style={{ background: 'var(--ed-card)', borderRadius: '16px', border: `1.5px solid ${ACCENT}35`, overflow: 'hidden', margin: '28px 0', boxShadow: '0 6px 24px rgba(0,0,0,0.10)' }}>
      <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${ACCENT}22 0%, ${ACCENT}10 100%)`, borderBottom: `1px solid ${ACCENT}25`, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: `${ACCENT}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔧</div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>Function Builder Studio</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>See repeated code → name it → give it parameters → define what it returns.</div>
        </div>
      </div>
      <div style={{ padding: '24px', background: `linear-gradient(160deg, rgba(${ACCENT_RGB},0.04) 0%, rgba(${ACCENT_RGB},0.02) 100%)` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Left: repeated code */}
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#dc2626', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>REPEATED CODE — same pattern, 3 times</div>
            <div style={{ background: '#0f172a', borderRadius: '10px', padding: '14px 18px', border: '1px solid rgba(220,38,38,0.2)', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#86efac', lineHeight: 1.75 }}>
              {REPEATED_CODE.split('\n').map((line, i) => (
                <div key={i} style={{ color: line.startsWith('#') ? '#64748b' : '#86efac' }}>{line || ' '}</div>
              ))}
            </div>
          </div>

          {/* Right: build the function */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
            {/* Step 1: name */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>1. NAME THE FUNCTION</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                {['do_thing', 'calculate', 'calculate_order_total', 'price_func'].map(name => (
                  <button key={name} onClick={() => setFuncName(name)}
                    style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${funcName === name ? ACCENT : 'var(--ed-rule)'}`, background: funcName === name ? `rgba(${ACCENT_RGB},0.12)` : 'var(--ed-card)', color: funcName === name ? ACCENT : 'var(--ed-ink3)' }}>
                    {name}
                  </button>
                ))}
              </div>
              {funcName === 'calculate_order_total' && <div style={{ marginTop: '5px', fontSize: '11px', color: ACCENT }}>✓ Clear, descriptive, readable</div>}
              {funcName && funcName !== 'calculate_order_total' && <div style={{ marginTop: '5px', fontSize: '11px', color: '#E67E22' }}>⚠ Try a more descriptive name</div>}
            </div>

            {/* Step 2: params */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>2. CHOOSE PARAMETERS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                {PARAM_OPTIONS.map(p => (
                  <button key={p} onClick={() => toggleParam(p)}
                    style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${selectedParams.includes(p) ? ACCENT : 'var(--ed-rule)'}`, background: selectedParams.includes(p) ? `rgba(${ACCENT_RGB},0.12)` : 'var(--ed-card)', color: selectedParams.includes(p) ? ACCENT : 'var(--ed-ink3)' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: return type */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>3. RETURN TYPE</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {RETURN_OPTIONS.map(r => (
                  <button key={r} onClick={() => setReturnType(r)}
                    style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${returnType === r ? ACCENT : 'var(--ed-rule)'}`, background: returnType === r ? `rgba(${ACCENT_RGB},0.12)` : 'var(--ed-card)', color: returnType === r ? ACCENT : 'var(--ed-ink3)' }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Result */}
        {buildResult && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>YOUR FUNCTION</div>
            <div style={{ background: '#0f172a', borderRadius: '10px', padding: '14px 18px', border: `1px solid ${ACCENT}30`, fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#86efac', lineHeight: 1.75 }}>
              {buildResult.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
            <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.08)`, border: `1px solid ${ACCENT}30`, fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>
              ✓ One function now replaces three repeated blocks. Change the logic once — it updates everywhere it&apos;s used.
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ─────────────────────────────────────────
// ANIMATION · DATA TRANSFORMATION FLOW
// Genuine animated pipeline: data flows through sort → filter → map
// ─────────────────────────────────────────
const USERS_RAW = [
  { id: 'a', name: 'Aman',  age: 28, active: true  },
  { id: 'b', name: 'Priya', age: 24, active: false },
  { id: 'c', name: 'Ravi',  age: 31, active: true  },
  { id: 'd', name: 'Neha',  age: 22, active: true  },
];

type PipelineStage = 'sort' | 'filter' | 'map';

const PIPELINE_META: Record<PipelineStage, { emoji: string; color: string; label: string; code: string; desc: string }> = {
  sort:   { emoji: '↑↓', color: '#3A86FF', label: 'sort()', code: 'users.sort(key=lambda u: u["age"])', desc: 'Lambda defines what to sort by. Cards rearrange by age — youngest first.' },
  filter: { emoji: '🔍', color: '#E67E22', label: 'filter()', code: 'list(filter(lambda u: u["active"], users))', desc: 'Lambda defines what to keep. Inactive users fade out and are removed.' },
  map:    { emoji: '🔄', color: '#7843EE', label: 'map()', code: 'list(map(lambda u: u["name"].upper(), users))', desc: 'Lambda defines how to transform each item. Every card becomes its uppercase name.' },
};

function UserCard({ user, stage, order }: { user: typeof USERS_RAW[0]; stage: PipelineStage; order: number }) {
  const isFading = stage === 'filter' && !user.active;
  const isMapped = stage === 'map';
  const sortedOrder = stage === 'sort' ? [22, 24, 28, 31].indexOf(user.age) : order;

  return (
    <motion.div
      layout
      key={user.id}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: isFading ? 0.12 : 1, scale: isFading ? 0.85 : 1, filter: isFading ? 'grayscale(1)' : 'none' }}
      transition={{ duration: 0.55, ease: 'easeInOut', layout: { duration: 0.55, ease: 'easeInOut' } }}
      style={{ padding: isMapped ? '12px 18px' : '10px 14px', borderRadius: '10px', background: isMapped ? `rgba(120,67,238,0.12)` : 'var(--ed-card)', border: `1.5px solid ${isMapped ? '#7843EE' : isFading ? '#e2e8f0' : ACCENT}50`, minWidth: isMapped ? '80px' : '110px', textAlign: 'center' as const, boxShadow: isFading ? 'none' : '0 3px 10px rgba(0,0,0,0.08)', position: 'relative' as const }}>
      {isMapped ? (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 800, color: '#7843EE', letterSpacing: '0.04em' }}>
          &ldquo;{user.name.toUpperCase()}&rdquo;
        </div>
      ) : (
        <>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700, color: isFading ? '#94a3b8' : ACCENT, marginBottom: '3px' }}>{user.name}</div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginBottom: '2px' }}>age: <strong style={{ color: stage === 'sort' ? '#3A86FF' : 'var(--ed-ink3)' }}>{user.age}</strong></div>
          <div style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: user.active ? ACCENT : '#dc2626' }}>{user.active ? '● active' : '● inactive'}</div>
        </>
      )}
    </motion.div>
  );
}

function DataTransformationFlow() {
  const [stage, setStage] = useState<PipelineStage>('sort');
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const meta = PIPELINE_META[stage];
  const stages: PipelineStage[] = ['sort', 'filter', 'map'];

  // Auto-cycle through stages
  useEffect(() => {
    if (!playing) return;
    timerRef.current = setTimeout(() => {
      setStage(s => {
        const idx = stages.indexOf(s);
        return stages[(idx + 1) % stages.length];
      });
    }, 3000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [stage, playing]);

  const displayUsers = stage === 'sort'
    ? [...USERS_RAW].sort((a, b) => a.age - b.age)
    : USERS_RAW;

  return (
    <div style={{ background: 'var(--ed-card)', borderRadius: '16px', border: `1.5px solid ${meta.color}35`, overflow: 'hidden', margin: '28px 0', boxShadow: `0 6px 32px ${meta.color}18` }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${meta.color}20 0%, ${meta.color}0C 100%)`, borderBottom: `1.5px solid ${meta.color}25`, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${meta.color}25`, border: `1.5px solid ${meta.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 900, color: meta.color, fontFamily: "'JetBrains Mono', monospace" }}>
          {meta.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: meta.color, textTransform: 'uppercase' as const }}>Data Transformation Flow · {meta.label}</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Watch data change shape as it passes through each operation.</div>
        </div>
        <button onClick={() => setPlaying(p => !p)}
          style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${meta.color}50`, background: `${meta.color}12`, color: meta.color, fontFamily: "'JetBrains Mono', monospace" }}>
          {playing ? '⏸' : '▶'}
        </button>
      </div>

      <div style={{ padding: '24px', background: `linear-gradient(160deg, rgba(${ACCENT_RGB},0.04) 0%, rgba(${ACCENT_RGB},0.02) 100%)` }}>
        {/* Stage selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {stages.map(s => {
            const m = PIPELINE_META[s];
            return (
              <motion.button key={s} whileHover={{ y: -1 }} onClick={() => { setStage(s); setPlaying(false); }}
                style={{ flex: 1, padding: '9px 6px', borderRadius: '8px', border: `2px solid ${stage === s ? m.color : 'var(--ed-rule)'}`, background: stage === s ? `${m.color}15` : 'var(--ed-card)', color: stage === s ? m.color : 'var(--ed-ink3)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: stage === s ? `0 4px 14px ${m.color}25` : 'none' }}>
                {m.emoji} {m.label}
              </motion.button>
            );
          })}
        </div>

        {/* Pipeline visualization */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: '0', alignItems: 'center', marginBottom: '20px', minHeight: '140px' }}>
          {/* Input */}
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px', textAlign: 'center' as const }}>INPUT</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', alignItems: 'center' }}>
              {USERS_RAW.map((u, i) => (
                <motion.div key={u.id} style={{ padding: '6px 12px', borderRadius: '7px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', width: '100%', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: ACCENT, flex: 1 }}>{u.name}</div>
                  <div style={{ fontSize: '9px', color: 'var(--ed-ink3)' }}>age:{u.age}</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: u.active ? ACCENT : '#dc2626', fontFamily: "'JetBrains Mono', monospace" }}>{u.active ? '●' : '○'}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pipeline arrow + operator */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '8px' }}>
            <motion.div key={stage} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}
              style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${meta.color}20`, border: `2px solid ${meta.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: meta.color, boxShadow: `0 0 20px ${meta.color}30` }}>
              {meta.emoji}
            </motion.div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: meta.color, textAlign: 'center' as const }}>{meta.label}</div>
            {/* Animated arrow */}
            <div style={{ position: 'relative' as const, width: '60px', height: '4px', overflow: 'hidden', borderRadius: '2px', background: 'var(--ed-rule)' }}>
              <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1, repeat: Infinity, ease: 'linear', repeatDelay: 0 }}
                style={{ position: 'absolute' as const, width: '40px', height: '100%', background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`, borderRadius: '2px' }} />
            </div>
          </div>

          {/* Output */}
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: meta.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px', textAlign: 'center' as const }}>OUTPUT</div>
            <AnimatePresence mode="popLayout">
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', alignItems: 'center' }}>
                {(stage === 'sort' ? [...USERS_RAW].sort((a,b) => a.age - b.age) : stage === 'filter' ? USERS_RAW.filter(u => u.active) : USERS_RAW).map((u, i) => (
                  <motion.div key={`${stage}-${u.id}`}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    style={{ padding: '6px 12px', borderRadius: '7px', background: `${meta.color}10`, border: `1.5px solid ${meta.color}40`, width: '100%', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {stage === 'map' ? (
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: meta.color, flex: 1 }}>&ldquo;{u.name.toUpperCase()}&rdquo;</div>
                    ) : (
                      <>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: meta.color, flex: 1 }}>{u.name}</div>
                        {stage === 'sort' && <div style={{ fontSize: '9px', fontWeight: 800, color: '#3A86FF', fontFamily: "'JetBrains Mono', monospace" }}>age:{u.age}</div>}
                        {stage === 'filter' && <div style={{ fontSize: '9px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace" }}>● active</div>}
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        </div>

        {/* Code + description */}
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '10px 16px', marginBottom: '12px', border: `1px solid ${meta.color}25` }}>
          <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#86efac' }}>{meta.code}</code>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: '8px', background: `${meta.color}08`, border: `1px solid ${meta.color}25`, fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
          {meta.desc}
        </div>

        {/* Stage progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          {stages.map(s => (
            <div key={s} onClick={() => { setStage(s); setPlaying(false); }}
              style={{ width: stage === s ? '24px' : '8px', height: '8px', borderRadius: '4px', background: stage === s ? meta.color : 'var(--ed-rule)', cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// TOOL 3 · TYPE HINT CLARITY LAB
// ─────────────────────────────────────────
const HINT_EXAMPLES = [
  {
    id: 'add',
    without: 'def add(a, b):\n    return a + b',
    with_hints: 'def add(a: int, b: int) -> int:\n    return a + b',
    question: 'What types does add() accept?',
    answer_without: 'Unknown — have to read the body or docs.',
    answer_with: 'Immediately clear: two ints, returns an int.',
  },
  {
    id: 'total',
    without: 'def get_total(prices):\n    return sum(prices)',
    with_hints: 'def get_total(prices: list[float]) -> float:\n    return sum(prices)',
    question: 'What should you pass to get_total()?',
    answer_without: 'Unclear — could be a list, a tuple, anything.',
    answer_with: 'A list of floats. The return is also a float.',
  },
  {
    id: 'format',
    without: 'def format_user(user):\n    return f"{user[\'name\']} <{user[\'email\']}>"',
    with_hints: "def format_user(user: dict[str, str]) -> str:\n    return f\"{user['name']} <{user['email']}>\"",
    question: 'What shape is the user parameter?',
    answer_without: 'Have to inspect the function body to guess.',
    answer_with: 'A dict mapping strings to strings — clear before reading the body.',
  },
];

function TypeHintClarityLab() {
  const [example, setExample] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const ex = HINT_EXAMPLES[example];

  return (
    <div style={{ background: 'var(--ed-card)', borderRadius: '16px', border: `1.5px solid ${ACCENT}35`, overflow: 'hidden', margin: '28px 0', boxShadow: '0 6px 24px rgba(0,0,0,0.10)' }}>
      <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${ACCENT}22 0%, ${ACCENT}10 100%)`, borderBottom: `1px solid ${ACCENT}25`, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: `${ACCENT}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📖</div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>Type Hint Clarity Lab</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Toggle type hints on and off. See how fast you can understand the function before reading its body.</div>
        </div>
      </div>
      <div style={{ padding: '24px', background: `linear-gradient(160deg, rgba(${ACCENT_RGB},0.04) 0%, rgba(${ACCENT_RGB},0.02) 100%)` }}>
        {/* Example selector */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
          {HINT_EXAMPLES.map((e, i) => (
            <button key={e.id} onClick={() => { setExample(i); setShowHints(false); }}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${example === i ? ACCENT : 'var(--ed-rule)'}`, background: example === i ? `rgba(${ACCENT_RGB},0.1)` : 'var(--ed-card)', color: example === i ? ACCENT : 'var(--ed-ink3)' }}>
              {e.id === 'add' ? 'add()' : e.id === 'total' ? 'get_total()' : 'format_user()'}
            </button>
          ))}
        </div>

        {/* Code comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#dc2626', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>WITHOUT TYPE HINTS</div>
            <div style={{ background: '#0f172a', borderRadius: '10px', padding: '14px 18px', border: '1px solid rgba(220,38,38,0.2)', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#94a3b8', lineHeight: 1.75 }}>
              {ex.without.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>WITH TYPE HINTS</div>
            <div style={{ background: '#0f172a', borderRadius: '10px', padding: '14px 18px', border: `1px solid ${ACCENT}30`, fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#86efac', lineHeight: 1.75 }}>
              {ex.with_hints.split('\n').map((line, i) => (
                <div key={i} style={{ color: line.includes(':') && line.includes('->') ? '#86efac' : line.includes(':') ? '#93c5fd' : '#86efac' }}>{line}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Question */}
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', marginBottom: '12px' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '5px' }}>QUESTION</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)' }}>{ex.question}</div>
        </div>

        <motion.button whileHover={{ scale: 1.01 }} onClick={() => setShowHints(!showHints)}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', background: showHints ? `rgba(${ACCENT_RGB},0.1)` : ACCENT, color: showHints ? ACCENT : '#fff', fontSize: '12px', fontWeight: 700, border: `1.5px solid ${ACCENT}`, cursor: 'pointer', marginBottom: '12px' }}>
          {showHints ? '← Back to question' : 'Reveal answers →'}
        </motion.button>

        <AnimatePresence>
          {showHints && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.25)' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#dc2626', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: '5px' }}>WITHOUT HINTS</div>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{ex.answer_without}</div>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.08)`, border: `1px solid ${ACCENT}35` }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: '5px' }}>WITH HINTS</div>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{ex.answer_with}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
interface Props { onBack: () => void; }

export default function PythonPreRead1({ onBack }: Props) {
  const store = useLearnerStore();
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set(['variables']));

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute("data-section");
          if (id) { setActiveSection(id); setCompletedModules(prev => new Set([...prev, id])); store.markSectionCompleted(MODULE_ID, id); }
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20% 0px' });
    const tid = setTimeout(() => { document.querySelectorAll('[data-section]').forEach(el => obs.observe(el)); }, 150);
    return () => { clearTimeout(tid); obs.disconnect(); };
  }, []);

  return (
    <SWEPreReadLayout
      trackConfig={TRACK_CONFIG}
      moduleLabel="PYTHON PRE-READ 01"
      title="Python Foundations for Backend Engineers"
      sections={SECTIONS}
      completedModules={completedModules}
      activeSection={activeSection}
      onBack={onBack}
    >
      {/* ── HERO ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ marginBottom: '56px' }}>
        <p style={{ fontSize: '17px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora',Georgia,serif", marginBottom: '36px', maxWidth: '580px' }}>
          &ldquo;Python is not just syntax. It is a way of organizing data, behavior, and thought.&rdquo;
        </p>

        {/* Characters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '36px' }}>
          {([
            { name: 'Arjun', face: 'priya' as const,  role: 'Aspiring Backend Engineer', desc: 'Can write small snippets. Learning how Python code holds together.', color: ACCENT },
            { name: 'Nisha', face: 'asha'  as const,  role: 'Backend Mentor',            desc: 'Teaches first principles, not shortcuts.', color: '#0369A1' },
            { name: 'Kabir', face: 'kiran' as const,  role: 'Senior Backend Engineer',   desc: 'Cares about readable, reusable, and safe code.', color: '#7843EE' },
            { name: 'Meera', face: 'maya'  as const,  role: 'Data-focused Teammate',     desc: 'Thinks in structures, patterns, and clean transformations.', color: '#C85A40' },
          ]).map(c => (
            <div key={c.name} style={{ background: `${c.color}0D`, border: `1px solid ${c.color}33`, borderRadius: '10px', padding: '14px 16px', minWidth: '140px', flex: '1' }}>
              <div style={{ marginBottom: '8px' }}><MentorFace mentor={c.face} size={40} /></div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: c.color, marginBottom: '2px' }}>{c.name}</div>
              <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: 'monospace', letterSpacing: '0.04em', marginBottom: '6px' }}>{c.role}</div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{c.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', borderLeft: `4px solid ${ACCENT}`, border: '1px solid var(--ed-rule)', borderLeftWidth: '4px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>What this pre-read covers</div>
          {['Variables as names, not boxes — and why that distinction matters later', 'Python\'s data types and how to match structure to the shape of the data', 'Functions, lambda, and type hints — the habits that make code trustworthy'].map((obj, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 2 ? '10px' : 0, alignItems: 'flex-start' }}>
              <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '12px', marginTop: '2px' }}>0{i + 1}</span>
              <span style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{obj}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── PART 1 · VARIABLES ── */}
      <ChapterSection id="variables" data-nav-id="variables" num="01" accentRgb={ACCENT_RGB} first>
        <SceneSetter title="What is a variable, really?" story="Arjun is writing a small script to manage user data — name, age, is_admin. Kabir walks past and asks: 'What is name here?' Arjun gives the usual answer: a place where data is stored. Kabir pauses — that answer works at the beginning, but Python is more precise than that." mentorQuote="A variable is better understood as a name bound to a value. A label. Not a magical storage box with independent existence." mentorName="Kabir" mentorColor="#7843EE" />

        <ConvoScene
          lines={[
            { speaker: 'mentor', text: 'Think of it like this: Python lets you give a meaningful name to a value so your program can reason about it later.' },
            { speaker: 'arjun', text: 'So x = 24 and age = 24 are both valid — but one makes the code think?' },
            { speaker: 'mentor', text: 'Exactly. The program works either way. But the first one makes your future self (and every other engineer) work harder to understand it.' },
          ]}
          mentorName="Nisha"
          mentorColor="#0369A1"
        />

        {h2(<>Names vs boxes</>)}

        {para(<>If a variable is just a label attached to a value, then Python code starts looking less like a set of containers and more like a network of names pointing at values. That matters later when data gets more complex.</>)}

        <CodeBlock filename="bad_names.py" code={`x = "Ravi"
y = 24
z = True`} />

        <CodeBlock filename="good_names.py" code={`user_name = "Ravi"
user_age = 24
is_admin = True`} />

        {para(<>The program is still tiny. But one version already feels like backend code. Real engineering is not just about making things work — it is about making them understandable.</>)}

        <PythonPrinciple text="A variable is not just storage. It is a name that helps your code think clearly about a value." />

        <ApplyItBox prompt="You need to store a user email, an order amount, and whether payment succeeded. What would you name those three variables so another engineer could understand them instantly — without reading a comment?" />

        <QuizEngine
          conceptId="python-variables"
          conceptName="Python Variables"
          moduleContext="Python Pre-Read 01: Python Foundations for Backend Engineers. Covers variables as names, data types, functions, lambda, and type hints."
          staticQuiz={{
            conceptId: "python-variables",
            question: "If user_name = 'Ravi', what is user_name?",
            options: ['The actual string object itself', 'A label pointing to a value', 'A Python function', 'A data type declaration'],
            correctIndex: 1,
            explanation: "In Python, variables are names — labels bound to values. user_name points to the string 'Ravi', not a separate container that holds it.",
          }}
        />
      </ChapterSection>

      {/* ── PART 2 · DATA TYPES ── */}
      <ChapterSection id="data-types" data-nav-id="data-types" num="02" accentRgb={ACCENT_RGB}>
        <SceneSetter title="One user — four possible Python shapes" story="Arjun is asked to represent a user in code. He starts with user = 'Ravi'. Meera laughs: that's a name, not a user. He tries a list: [name, age, email, is_admin]. Kabir asks: do you know what each position means without remembering the order? Arjun stares at the list. Not really." mentorQuote="Backend engineering is full of choosing the right structure for the right kind of information." mentorName="Kabir" mentorColor="#7843EE" />

        {h2(<>Python&apos;s simple values</>)}

        {para(<>At the smallest level, Python gives you a few core building blocks: integers like <code>24</code>, floats like <code>99.5</code>, strings like <code>"Ravi"</code>, booleans like <code>True</code>, and <code>None</code> when a value is absent. But backend systems rarely stay at this level.</>)}

        {h2(<>Four collection types — each with a job</>)}

        <CodeBlock filename="list_example.py" code={`# Ordered, changeable, allows duplicates
users = ["Ravi", "Aman", "Priya"]`} />

        <CodeBlock filename="tuple_example.py" code={`# Ordered, fixed — won't accidentally change
coordinates = (12.9716, 77.5946)`} />

        <CodeBlock filename="set_example.py" code={`# Uniqueness guaranteed — no duplicates
tags = {"python", "api", "backend"}`} />

        <CodeBlock filename="dict_example.py" code={`# Named key-value pairs — the shape of most real data
user = {
    "name": "Ravi",
    "age": 24,
    "email": "ravi@example.com",
    "is_admin": True
}`} />

        {para(<>The question is not &ldquo;which syntax uses curly braces?&rdquo; It is: what kind of thing am I representing? Does order matter? Do names matter? Do duplicates matter? Should this change later? That is how engineers choose data structures.</>)}

        <DataStructureLab />

        <PythonPrinciple text="The right Python structure depends on the shape and meaning of the data, not just on syntax." />

        <ApplyItBox prompt="Which would you use for each? A list of cart items. A pair of latitude/longitude values. A set of unique user roles. A user profile with named fields. Try to explain why before checking." />

        <QuizEngine
          conceptId="python-data-structures"
          conceptName="Python Data Structures"
          moduleContext="Python Pre-Read 01: Python Foundations for Backend Engineers."
          staticQuiz={{
            conceptId: "python-data-structures",
            question: "Which Python structure is best for representing a user with named fields like name, email, and role?",
            options: ['list — because it holds multiple values', 'tuple — because it is fixed', 'set — because users are unique', 'dictionary — because it maps names to values'],
            correctIndex: 3,
            explanation: "A dictionary maps names to values — exactly what named fields require. user['name'], user['email'] is readable and self-documenting. A list would require remembering positions.",
          }}
        />
      </ChapterSection>

      {/* ── PART 3 · FUNCTIONS ── */}
      <ChapterSection id="functions" data-nav-id="functions" num="03" accentRgb={ACCENT_RGB}>
        <SceneSetter title="The code works. But I keep repeating myself." story="Arjun has written enough lines to notice a pattern — the same price calculation logic appears in three different places. The code works. It also feels messy. Nisha looks at the file and asks: what part of this logic do you expect to reuse?" mentorQuote="Then that is exactly what should become a function. A function is not just a syntax feature — it is a way of naming reusable logic." mentorName="Nisha" mentorColor="#0369A1" />

        <ConvoScene
          lines={[
            { speaker: 'mentor', text: "A good function should do one clear thing. If I read its name, I should be able to guess its job." },
            { speaker: 'arjun', text: "So the name matters as much as the logic?" },
            { speaker: 'mentor', text: "The name is the interface. The logic is the implementation. Future engineers read the name first." },
          ]}
          mentorName="Kabir"
          mentorColor="#7843EE"
        />

        <CodeBlock filename="weak_function.py" code={`def do_everything(x, y):
    return x + y`} />

        <CodeBlock filename="better_function.py" code={`def calculate_total_price(base_price: float, tax_amount: float) -> float:
    return base_price + tax_amount`} />

        {h2(<>Higher-order functions and lambda</>)}

        {para(<>Some functions do not just take data. Some take other functions. Python can treat functions like values — passing them around, storing them, and using them as arguments.</>)}

        <CodeBlock filename="higher_order.py" code={`def apply_function(func, value):
    return func(value)

def square(x):
    return x * x

print(apply_function(square, 5))  # 25`} />

        {para(<>Lambda is the concise version for tiny, local, one-off transformations. Use it when the logic fits on one line and adding a full function name would add more ceremony than clarity.</>)}

        <CodeBlock filename="lambda_example.py" code={`# Lambda: good for short, local transformations
square = lambda x: x * x

# Named function: good for anything that needs to be reused or explained
def calculate_discount(price: float, rate: float) -> float:
    return price - (price * rate)`} />

        <FunctionBuilderStudio />

        <PythonPrinciple text="Functions turn repeated logic into named, reusable behavior. If you read the name, you should know the job." />

        <ApplyItBox prompt="Think of any repeated action in code — formatting a full name, calculating tax, checking admin access. What would the function be called? What inputs would it need? What should it return?" />

        <QuizEngine
          conceptId="python-functions"
          conceptName="Python Functions"
          moduleContext="Python Pre-Read 01: Python Foundations for Backend Engineers."
          staticQuiz={{
            conceptId: "python-functions",
            question: "What is the strongest reason to create a function?",
            options: ['To make the code file longer', 'To organize reusable logic with a clear name', 'To avoid using variables', 'To replace all loops in a program'],
            correctIndex: 1,
            explanation: "Functions name reusable logic. The name is the interface. Fix the logic once — everything that calls the function gets the fix.",
          }}
        />
      </ChapterSection>

      {/* ── PART 4 · LAMBDA ── */}
      <ChapterSection id="lambda" data-nav-id="lambda" num="04" accentRgb={ACCENT_RGB}>
        <SceneSetter title="Lambda stopped feeling fancy — it started feeling practical." story="Meera shows Arjun a list of users and asks him to sort by age. He starts writing a full function. Kabir stops him: you can, but do you need to? He shows users.sort(key=lambda user: user['age']). This is the first time lambda feels genuinely useful — not mysterious, not decorative." mentorQuote="The logic is tiny, only needed here. Giving it a full function name would add more ceremony than clarity." mentorName="Meera" mentorColor="#C85A40" />

        {h2(<>Sort, filter, map — the three transformation patterns</>)}

        <CodeBlock filename="transformations.py" code={`users = [
    {"name": "Aman", "age": 28},
    {"name": "Priya", "age": 24},
    {"name": "Ravi", "age": 31}
]

# Sort by age
users.sort(key=lambda user: user["age"])

# Filter: keep only items matching a rule
numbers = [1, 2, 3, 4]
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))

# Map: transform every item
squared = list(map(lambda x: x * x, numbers))`} />

        {para(<>These patterns show up constantly in backend work. Data is always being reshaped, filtered, selected, sorted, and prepared for responses. Lambda keeps the transformation local and readable — as long as it stays short.</>)}

        <DataTransformationFlow />

        {keyBox('The lambda rule', [
          'Use lambda when the logic fits on one line and the intent is obvious',
          'Use a named function when you need to reuse it, test it, or explain it',
          'If it stops being obvious, stop using lambda',
        ])}

        <PythonPrinciple text="Lambda is useful when it makes a tiny transformation clearer — not when it makes code more clever than readable." />

        <ApplyItBox prompt="Which of these is a good lambda use case — and which needs a named function? Sorting users by age. One small filter rule. A long multi-step permission check. Why does the length and reuse matter?" />

        <QuizEngine
          conceptId="python-lambda"
          conceptName="Python Lambda"
          moduleContext="Python Pre-Read 01: Python Foundations for Backend Engineers."
          staticQuiz={{
            conceptId: "python-lambda",
            question: "When is lambda usually most useful in Python?",
            options: ['For long, complex business logic with multiple steps', 'For short one-off functions used locally — like a sort key', 'To replace all named functions in a program', 'For writing class definitions'],
            correctIndex: 1,
            explanation: "Lambda shines when the logic is tiny, local, and obvious. users.sort(key=lambda u: u['age']) is cleaner than defining a separate function for a one-liner. If it grows, convert it.",
          }}
        />
      </ChapterSection>

      {/* ── PART 5 · TYPE HINTS ── */}
      <ChapterSection id="type-hints" data-nav-id="type-hints" num="05" accentRgb={ACCENT_RGB}>
        <SceneSetter title="Arjun understood the function before reading the implementation." story="Arjun opens a function written by Kabir with full type hints: prices: list[float], discount: float, return type float. He reads it once and realizes something unusual — he understands the shape of the function before even thinking about the implementation. That is new." mentorQuote="Type hints don't make Python stop being Python. They make code easier to reason about — which matters when functions become interfaces between layers." mentorName="Kabir" mentorColor="#7843EE" />

        <ConvoScene
          lines={[
            { speaker: 'arjun', text: "I've been treating type hints as optional decoration. But this feels different." },
            { speaker: 'mentor', text: "In backend code, functions often become interfaces — between request parsing and validation, between service code and business logic, between helpers and handlers. Knowing what kind of data a function expects becomes extremely valuable." },
            { speaker: 'arjun', text: "So it's not about strictness. It's about clarity." },
            { speaker: 'mentor', text: "Type hints help the reader build a mental model faster. That's the real value." },
          ]}
          mentorName="Nisha"
          mentorColor="#0369A1"
        />

        <CodeBlock filename="without_hints.py" code={`def add(a, b):
    return a + b

def get_total(prices):
    return sum(prices)`} />

        <CodeBlock filename="with_hints.py" code={`def add(a: int, b: int) -> int:
    return a + b

def get_total(prices: list[float]) -> float:
    return sum(prices)

def format_user(user: dict[str, str]) -> str:
    return f"{user['name']} <{user['email']}>"` } />

        <TypeHintClarityLab />

        <PythonPrinciple text="Type hints do not replace thinking. They make the intended shape of the code easier to see — before reading the implementation." />

        <ApplyItBox prompt="Pick any function you know: calculate price, format an email, get a cart total. Add type hints to its inputs and its return value. What did you have to think about to add them correctly?" />

        <QuizEngine
          conceptId="python-type-hints"
          conceptName="Python Type Hints"
          moduleContext="Python Pre-Read 01: Python Foundations for Backend Engineers."
          staticQuiz={{
            conceptId: "python-type-hints",
            question: "Why are type hints useful in Python?",
            options: ['They turn Python into a statically typed language like Java', 'They improve readability and help tools catch mismatches early', 'They remove the need for debugging entirely', 'They make functions run faster by default'],
            correctIndex: 1,
            explanation: "Type hints improve readability and let tools (editors, linters, type checkers) catch mismatches before runtime. They don't change how Python runs — they change how engineers read and understand code.",
          }}
        />
      </ChapterSection>

      {/* ── PART 6 · SYNTHESIS ── */}
      <ChapterSection id="synthesis" data-nav-id="synthesis" num="06" accentRgb={ACCENT_RGB}>
        <SceneSetter title="The small script that finally felt like real backend code." story="By end of week, Arjun decides to combine everything into one small example — a cart processor. This time he thinks in pieces: what data types? what structure? what function? where would type hints help? what names make the code readable?" mentorQuote="Real backend engineering is not built from giant leaps. It is built from stacking simple concepts correctly." mentorName="Kabir" mentorColor="#7843EE" />

        <CodeBlock filename="cart_processor.py" code={`def calculate_final_price(prices: list[float], discount: float) -> float:
    total = sum(prices)
    discount_amount = total * discount
    return total - discount_amount

cart_prices = [499.0, 199.0, 99.0]
final_price = calculate_final_price(cart_prices, 0.10)
print(final_price)  # 718.2`} />

        {para(<>What matters here is not that the code is complex — it isn&apos;t. What matters is that it is structured. Arjun used: a list for related values, floats for prices, a function for reusable logic, a clear return value, type hints for readability, and names that explain intention.</>)}

        {keyBox('What makes this feel like engineering code', [
          'A list for related values (not a tuple — cart prices change)',
          'A function for reusable logic — call it anywhere, fix it once',
          'Type hints — the next engineer knows what to pass before reading the body',
          'Names that explain intention — calculate_final_price, not calc or do_thing',
        ])}

        <PythonPrinciple text="Good Python code is not just correct. It is structured so the next layer of code can trust it." />

        <ApplyItBox prompt="Try rewriting a tiny real-world example: cart total, user summary, order discount, or list of product names. Use one function, one collection, one clear variable name, and at least one type hint." />

        <QuizEngine
          conceptId="python-synthesis"
          conceptName="Python Code Quality"
          moduleContext="Python Pre-Read 01: Python Foundations for Backend Engineers."
          staticQuiz={{
            conceptId: "python-synthesis",
            question: "What makes a small Python script start feeling like 'real engineering code'?",
            options: ['It becomes longer and more complex', 'It uses more advanced syntax like decorators', 'It combines simple concepts clearly and intentionally', 'It avoids using functions to keep things flat'],
            correctIndex: 2,
            explanation: "Real engineering code is not defined by complexity — it is defined by intentional structure. Clear names + right structures + reusable functions + type hints = code the next layer can trust.",
          }}
        />
      </ChapterSection>

      {/* ── PART 7 · REFLECTION ── */}
      <ChapterSection id="reflection" data-nav-id="reflection" num="07" accentRgb={ACCENT_RGB}>
        <SceneSetter title="At the end of the week, Arjun rereads his notes." story="At the beginning, Python still felt like syntax, brackets, snippets, tutorial exercises. Now it feels different. He sees variables as names, structures as choices, functions as named logic, transformations as careful reshaping, and type hints as clarity tools." mentorQuote="What do you think Python foundations actually are?" mentorName="Nisha" mentorColor="#0369A1" />

        <ConvoScene
          lines={[
            { speaker: 'arjun', text: "They're the rules that make larger code possible." },
            { speaker: 'mentor', text: "That's close." },
            { speaker: 'mentor', text: "They're the habits that stop small code from becoming messy code." },
            { speaker: 'arjun', text: "Now I see why we started here. It's not about memorizing list methods or lambda syntax." },
            { speaker: 'mentor', text: "It's about building the judgment to choose well when the code gets harder." },
          ]}
          mentorName="Kabir"
          mentorColor="#7843EE"
        />

        {keyBox('What Python foundations are really about', [
          'Representing values properly — choosing names, not just labels',
          'Choosing the right structure for the shape of the data',
          'Organizing logic into reusable, well-named functions',
          'Transforming data carefully with map, filter, sort, and lambda',
          'Making code readable for future work with type hints',
        ])}

        <PythonPrinciple text="Python foundations are not about memorizing syntax. They are about learning the habits that make code readable, reusable, and trustworthy." />

        <div style={{ margin: '32px 0', padding: '24px', background: 'var(--ed-card)', borderRadius: '12px', border: `1.5px solid ${ACCENT}25` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '14px', textTransform: 'uppercase' as const }}>Thought Exercise — before Pre-Read 2</div>
          {para(<>Imagine you are building a very small backend for a movie ticket booking app. You need to represent: one movie, one user, selected seats, unique theater facilities, a function to calculate total cost, and a function to sort movies by rating.</>)}
          {para(<>Ask yourself: which Python data type fits each piece? Which collection is right? Where should you use a function? Where would a type hint make the code easier to trust? Write it out before moving forward.</>)}
        </div>

        <QuizEngine
          conceptId="python-foundations-final"
          conceptName="Python Foundations"
          moduleContext="Python Pre-Read 01: Python Foundations for Backend Engineers."
          staticQuiz={{
            conceptId: "python-foundations-final",
            question: "Which sequence best reflects strong beginner Python thinking?",
            options: ['Write code quickly — add syntax and structure later', 'Pick random structures — fix it when it breaks', 'Understand the data → choose the right structure → organize logic into functions → add clarity with type hints', 'Use lambda everywhere to write compact one-liners'],
            correctIndex: 2,
            explanation: "Strong Python thinking is sequential: understand the data first, then choose the right structure, then organize logic into reusable functions, then add type hints so the code communicates its intent.",
          }}
        />
      </ChapterSection>

    </SWEPreReadLayout>
  );
}

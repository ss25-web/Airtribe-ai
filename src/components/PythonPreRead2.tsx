'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLearnerStore } from '@/lib/learnerStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterSection, para, h2, keyBox, ApplyItBox } from './pm-fundamentals/designSystem';
import SWEPreReadLayout from './SWEPreReadLayout';
import QuizEngine from './QuizEngine';
import { MentorFace } from './pm-fundamentals/MentorFaces';

const ACCENT = '#16A34A';
const ACCENT_RGB = '22,163,74';
const MODULE_ID = 'python-pr-02';

const SECTIONS = [
  { id: 'pr2-structure',   label: 'The Script That Became a Mess' },
  { id: 'pr2-classes',     label: 'Classes: Blueprint for Real Things' },
  { id: 'pr2-self',        label: 'Understanding self' },
  { id: 'pr2-inheritance', label: 'Inheritance: Reuse with Care' },
  { id: 'pr2-abstract',    label: 'Abstract Classes: Required Behavior' },
  { id: 'pr2-modules',     label: 'Modules & Packages' },
  { id: 'pr2-reflection',  label: 'What Arjun Finally Understood' },
];

const TRACK_CONFIG = {
  name: 'Python', accent: ACCENT, accentRgb: ACCENT_RGB,
  protagonist: 'Arjun', role: 'Aspiring Backend Engineer', company: 'Learning Python',
  mentor: 'Nisha', mentorRole: 'Backend Mentor', mentorColor: '#0369A1',
};

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────
const CodeBlock = ({ code, filename }: { code: string; filename?: string }) => (
  <div style={{ margin: '18px 0', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(134,239,172,0.15)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
    {filename && <div style={{ background: '#1e293b', padding: '7px 16px', fontSize: '10px', fontFamily: "'JetBrains Mono',monospace", color: '#64748b', letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{filename}</div>}
    <pre style={{ background: '#0f172a', color: '#86efac', fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', lineHeight: 1.75, padding: '18px 22px', margin: 0, overflowX: 'auto' as const }}>
      <code>{code}</code>
    </pre>
  </div>
);

const SceneSetter = ({ title, story, mentorQuote, mentorName, mentorColor }: { title: string; story: string; mentorQuote: string; mentorName: string; mentorColor: string }) => (
  <div style={{ margin: '0 0 26px', padding: '18px 22px', background: `rgba(${ACCENT_RGB},0.05)`, borderLeft: `4px solid ${ACCENT}`, borderRadius: '0 10px 10px 0', border: `1px solid ${ACCENT}25`, borderLeftWidth: '4px' }}>
    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, marginBottom: '7px', textTransform: 'uppercase' as const }}>{title}</div>
    <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.75, marginBottom: '12px' }}>{story}</div>
    <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', padding: '9px 12px', borderRadius: '7px', background: `${mentorColor}10`, border: `1px solid ${mentorColor}30` }}>
      <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: `${mentorColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', color: mentorColor, flexShrink: 0 }}>{mentorName[0]}</div>
      <div style={{ fontSize: '13px', color: 'var(--ed-ink)', fontStyle: 'italic', lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: mentorColor, fontStyle: 'normal' }}>{mentorName}: </span>&ldquo;{mentorQuote}&rdquo;
      </div>
    </div>
  </div>
);

const ConvoScene = ({ lines, mentorName, mentorColor }: { lines: { speaker: 'arjun' | 'mentor'; text: string }[]; mentorName: string; mentorColor: string }) => (
  <div style={{ margin: '22px 0', display: 'flex', flexDirection: 'column' as const, gap: '9px' }}>
    {lines.map((line, i) => {
      const isMentor = line.speaker === 'mentor';
      return (
        <div key={i} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', flexDirection: isMentor ? 'row-reverse' : 'row' as const }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: isMentor ? `${mentorColor}22` : `rgba(${ACCENT_RGB},0.18)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', color: isMentor ? mentorColor : ACCENT, flexShrink: 0 }}>{isMentor ? mentorName[0] : 'A'}</div>
          <div style={{ maxWidth: '80%' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: isMentor ? mentorColor : ACCENT, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', marginBottom: '3px', textAlign: isMentor ? 'right' as const : 'left' as const }}>{isMentor ? mentorName.toUpperCase() : 'ARJUN'}</div>
            <div style={{ padding: '9px 13px', borderRadius: isMentor ? '12px 4px 12px 12px' : '4px 12px 12px 12px', background: isMentor ? `${mentorColor}10` : `rgba(${ACCENT_RGB},0.08)`, border: `1px solid ${isMentor ? mentorColor : ACCENT}22`, fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.65 }}>{line.text}</div>
          </div>
        </div>
      );
    })}
  </div>
);

const PythonPrinciple = ({ text }: { text: string }) => (
  <div style={{ margin: '26px 0', padding: '18px 22px', background: `rgba(${ACCENT_RGB},0.07)`, borderLeft: `4px solid ${ACCENT}`, borderRadius: '0 8px 8px 0' }}>
    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: ACCENT, marginBottom: '7px', textTransform: 'uppercase' as const }}>Python Principle</div>
    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.65, fontStyle: 'italic', fontFamily: "'Lora',serif" }}>&ldquo;{text}&rdquo;</div>
  </div>
);

// ─── TOOL 1 · CLASS BUILDER STUDIO ─────────────────────────────────────────
const FRAGMENTS = [
  { id: 'name',         label: 'name',               type: 'attr', belongs: true,  why: 'Core user data — belongs as an attribute.' },
  { id: 'email',        label: 'email',              type: 'attr', belongs: true,  why: 'Core user contact — belongs as an attribute.' },
  { id: 'is_active',    label: 'is_active',           type: 'attr', belongs: true,  why: 'User state — belongs as an attribute.' },
  { id: 'display_info', label: 'display_info()',      type: 'method', belongs: true, why: 'Describes the user using its own data — belongs as a method.' },
  { id: 'send_welcome', label: 'send_welcome_email()', type: 'method', belongs: true, why: 'Sends a welcome email to the user — belongs as a method.' },
  { id: 'cart_total',   label: 'cart_total',          type: 'attr', belongs: false, why: 'This is Order data, not User data. Wrong class.' },
  { id: 'discount_rate',label: 'discount_rate',       type: 'attr', belongs: false, why: 'This belongs in pricing logic, not a User class.' },
];

// vibrant palette — solid opaque only
const C = { blue: '#2563EB', purple: '#7C3AED', green: '#059669', red: '#DC2626', amber: '#D97706', teal: '#0891B2', pink: '#DB2777', indigo: '#4F46E5', orange: '#EA580C' };
const INSTANCES = [
  { name: 'Ravi',  email: 'ravi@example.com',  active: true,  color: C.blue   },
  { name: 'Priya', email: 'priya@example.com', active: true,  color: C.purple },
  { name: 'Aman',  email: 'aman@example.com',  active: false, color: C.orange },
];

function ClassBuilderStudio() {
  const [placed, setPlaced] = useState<Record<string, 'attr' | 'method' | null>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [showInstances, setShowInstances] = useState(false);

  const place = (zone: 'attr' | 'method') => {
    if (!selected) return;
    const frag = FRAGMENTS.find(f => f.id === selected)!;
    setPlaced(prev => ({ ...prev, [selected]: zone }));
    setFeedback(prev => ({ ...prev, [selected]: frag.belongs }));
    setSelected(null);
  };
  const remove = (id: string) => setPlaced(prev => { const n = {...prev}; delete n[id]; return n; });
  const unplaced = FRAGMENTS.filter(f => !placed[f.id]);
  const attrs = FRAGMENTS.filter(f => placed[f.id] === 'attr');
  const methods = FRAGMENTS.filter(f => placed[f.id] === 'method');
  const wrongItems = FRAGMENTS.filter(f => placed[f.id] && !feedback[f.id]);
  const coreBuilt = attrs.filter(f => feedback[f.id]).length >= 2 && methods.filter(f => feedback[f.id]).length >= 1;

  const Tag = ({ label, type, selected: isSel, correct, onRemove }: { label: string; type: string; selected?: boolean; correct?: boolean | null; onRemove?: () => void }) => {
    const baseColor = type === 'attr' ? C.blue : C.purple;
    const bg = correct === true ? C.green : correct === false ? C.red : isSel ? C.indigo : baseColor;
    return (
      <motion.div whileHover={!onRemove ? { y: -2 } : {}} style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', padding: '5px 11px', borderRadius: '6px', background: bg, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 2px 8px ${bg}60`, transition: 'all 0.2s' }}>
        <span style={{ opacity: 0.7, fontSize: '9px' }}>{type}</span>
        {correct === true && '✓ '}{correct === false && '✗ '}{label}
        {onRemove && <span onClick={e => { e.stopPropagation(); onRemove(); }} style={{ opacity: 0.7, marginLeft: '2px', cursor: 'pointer' }}>×</span>}
      </motion.div>
    );
  };

  return (
    <div style={{ background: 'var(--ed-card)', borderRadius: '16px', border: `2px solid ${C.blue}`, overflow: 'hidden', margin: '28px 0', boxShadow: `0 8px 32px ${C.blue}25` }}>
      <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${C.blue} 0%, ${C.purple} 100%)`, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏗️</div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#fff', textTransform: 'uppercase' as const }}>Class Builder Studio</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>Click a fragment, then click Attributes or Methods. Remove anything that doesn&apos;t belong.</div>
        </div>
      </div>
      <div style={{ padding: '24px', background: '#0F172A' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Fragment pool */}
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>CODE FRAGMENTS</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
              {unplaced.map(f => (
                <motion.div key={f.id} whileHover={{ x: 4 }} onClick={() => setSelected(selected === f.id ? null : f.id)}>
                  <Tag label={f.label} type={f.type} selected={selected === f.id} />
                </motion.div>
              ))}
            </div>
          </div>
          {/* Class builder */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', fontWeight: 700, color: ACCENT, marginBottom: '10px' }}>
              class <span style={{ color: '#60a5fa' }}>User</span>:
            </div>
            <motion.div whileHover={selected ? { scale: 1.01 } : {}} onClick={() => place('attr')}
              style={{ borderRadius: '10px', border: `2px solid ${selected ? C.blue : '#1e293b'}`, padding: '12px', cursor: selected ? 'pointer' : 'default', background: '#1e293b', marginBottom: '8px', minHeight: '65px', transition: 'border-color 0.2s' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, color: C.blue, letterSpacing: '0.1em', marginBottom: '8px' }}>ATTRIBUTES {selected ? '← DROP HERE' : ''}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '5px' }}>
                {attrs.map(f => <Tag key={f.id} label={f.label} type={f.type} correct={feedback[f.id] ? true : false} onRemove={() => remove(f.id)} />)}
              </div>
            </motion.div>
            <motion.div whileHover={selected ? { scale: 1.01 } : {}} onClick={() => place('method')}
              style={{ borderRadius: '10px', border: `2px solid ${selected ? C.purple : '#1e293b'}`, padding: '12px', cursor: selected ? 'pointer' : 'default', background: '#1e293b', minHeight: '65px', transition: 'border-color 0.2s' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, color: C.purple, letterSpacing: '0.1em', marginBottom: '8px' }}>METHODS {selected ? '← DROP HERE' : ''}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '5px' }}>
                {methods.map(f => <Tag key={f.id} label={f.label} type={f.type} correct={feedback[f.id] ? true : false} onRemove={() => remove(f.id)} />)}
              </div>
            </motion.div>
          </div>
        </div>

        {wrongItems.map(f => (
          <motion.div key={f.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '8px', padding: '9px 14px', borderRadius: '8px', background: C.red, color: '#fff', fontSize: '12px', fontWeight: 600 }}>
            ✗ <code style={{ fontFamily: "'JetBrains Mono',monospace" }}>{f.label}</code> — {f.why}
          </motion.div>
        ))}

        {coreBuilt && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '16px' }}>
            <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowInstances(x => !x)}
              style={{ width: '100%', padding: '11px', borderRadius: '8px', background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`, color: '#fff', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 16px ${C.blue}50`, marginBottom: showInstances ? '14px' : '0' }}>
              {showInstances ? '← Back to class' : '▶ Create object instances from this class →'}
            </motion.button>
            {showInstances && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                {INSTANCES.map((inst, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.12, type: 'spring', stiffness: 300 }}
                    style={{ padding: '14px', borderRadius: '10px', background: inst.color, color: '#fff', boxShadow: `0 6px 20px ${inst.color}50` }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, opacity: 0.8, marginBottom: '8px' }}>user_{i+1} = User(...)</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '14px', fontWeight: 800, marginBottom: '3px' }}>{inst.name}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>{inst.email}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, marginTop: '6px', opacity: 0.9 }}>{inst.active ? '● active' : '● inactive'}</div>
                  </motion.div>
                ))}
                <div style={{ gridColumn: '1/-1', padding: '10px 14px', borderRadius: '8px', background: ACCENT, color: '#fff', fontSize: '12px', fontWeight: 600, lineHeight: 1.6 }}>
                  ✓ Same class blueprint → three different objects. Same structure, different state.
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── ANIMATION A · CLASS STRUCTURE VISUALIZER ────────────────────────────────
function ClassStructureAnimation() {
  const [phase, setPhase] = useState(0);
  const phases = [
    { label: 'Scattered variables', color: '#dc2626', items: [{ text: 'name = "Ravi"', kind: 'loose' }, { text: 'email = "ravi@x.com"', kind: 'loose' }, { text: 'is_active = True', kind: 'loose' }, { text: 'def display_info():', kind: 'loose' }] },
    { label: 'Grouped into a class', color: C.blue, items: [{ text: 'name', kind: 'attr' }, { text: 'email', kind: 'attr' }, { text: 'is_active', kind: 'attr' }, { text: 'display_info()', kind: 'method' }] },
    { label: 'Instantiated as objects', color: C.green, items: [] },
  ];
  const cur = phases[phase];

  useEffect(() => {
    const t = setInterval(() => setPhase(p => (p + 1) % phases.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: '#0F172A', borderRadius: '14px', border: `2px solid ${cur.color}`, padding: '20px 24px', margin: '28px 0', boxShadow: `0 8px 32px ${cur.color}30`, transition: 'border-color 0.5s, box-shadow 0.5s' }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, color: cur.color, letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: '16px' }}>
        Class Structure Visualizer · {cur.label}
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' as const }}>
        {phase === 0 && phases[0].items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            style={{ padding: '8px 14px', borderRadius: '8px', background: '#dc2626', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', fontWeight: 700, boxShadow: '0 4px 12px rgba(220,38,38,0.5)' }}>
            {item.text}
          </motion.div>
        ))}
        {phase === 1 && (
          <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ padding: '20px 24px', borderRadius: '14px', background: '#1e293b', border: `2px solid ${C.blue}`, minWidth: '240px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', fontWeight: 800, color: '#60a5fa', marginBottom: '12px' }}>class User:</div>
            <div style={{ marginBottom: '10px' }}>
              {phases[1].items.filter(i => i.kind === 'attr').map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  style={{ padding: '4px 12px', marginBottom: '4px', borderRadius: '6px', background: C.blue, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', fontWeight: 700, display: 'inline-block', marginRight: '6px', boxShadow: `0 2px 8px ${C.blue}60` }}>
                  {item.text}
                </motion.div>
              ))}
            </div>
            {phases[1].items.filter(i => i.kind === 'method').map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                style={{ padding: '4px 12px', borderRadius: '6px', background: C.purple, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', fontWeight: 700, display: 'inline-block', boxShadow: `0 2px 8px ${C.purple}60` }}>
                {item.text}
              </motion.div>
            ))}
          </motion.div>
        )}
        {phase === 2 && INSTANCES.map((inst, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.15, type: 'spring', stiffness: 250 }}
            style={{ padding: '14px 18px', borderRadius: '12px', background: inst.color, color: '#fff', minWidth: '120px', textAlign: 'center' as const, boxShadow: `0 6px 20px ${inst.color}60` }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', opacity: 0.8, marginBottom: '6px' }}>user_{i + 1}</div>
            <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '3px' }}>{inst.name}</div>
            <div style={{ fontSize: '10px', opacity: 0.8 }}>{inst.active ? '● active' : '● inactive'}</div>
          </motion.div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
        {phases.map((p, i) => <div key={i} onClick={() => setPhase(i)} style={{ width: phase === i ? '28px' : '8px', height: '8px', borderRadius: '4px', background: phase === i ? cur.color : '#334155', cursor: 'pointer', transition: 'all 0.3s' }} />)}
      </div>
    </div>
  );
}

// ─── ANIMATION 1 · BLUEPRINT TO OBJECT ──────────────────────────────────────
function BlueprintToObjectAnimation() {
  const [phase, setPhase] = useState<'blueprint' | 'spawning' | 'calling'>('blueprint');
  const [callTarget, setCallTarget] = useState<number | null>(null);
  const instances = [
    { name: 'Ravi',  color: C.blue   },
    { name: 'Priya', color: C.purple },
    { name: 'Aman',  color: C.orange },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('spawning'), 1200);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div style={{ background: '#0F172A', borderRadius: '16px', border: `2px solid ${C.blue}`, overflow: 'hidden', margin: '28px 0', boxShadow: `0 8px 32px ${C.blue}30` }}>
      <div style={{ padding: '12px 20px', background: `linear-gradient(135deg, ${C.blue} 0%, ${C.purple} 100%)`, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📐</div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#fff', textTransform: 'uppercase' as const }}>Blueprint to Object — class, instance, and self</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '1px' }}>Click greet() on each instance — watch self resolve to that instance&apos;s own name.</div>
        </div>
      </div>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          {/* Blueprint */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', marginBottom: '8px', textAlign: 'center' as const }}>CLASS BLUEPRINT</div>
            <motion.div animate={{ boxShadow: phase === 'blueprint' ? `0 0 28px ${C.blue}80` : `0 4px 16px ${C.blue}30` }}
              style={{ padding: '16px 18px', borderRadius: '12px', background: '#1e293b', border: `2px solid ${C.blue}`, minWidth: '170px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', fontWeight: 800, color: '#60a5fa', marginBottom: '10px' }}>class User:</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '4px' }}>
                <span style={{ padding: '3px 9px', borderRadius: '5px', background: C.blue, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', fontWeight: 700, display: 'inline-block' }}>self.name</span>
                <span style={{ padding: '3px 9px', borderRadius: '5px', background: C.blue, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', fontWeight: 700, display: 'inline-block' }}>self.email</span>
                <span style={{ padding: '3px 9px', borderRadius: '5px', background: C.purple, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', fontWeight: 700, display: 'inline-block', marginTop: '4px' }}>def greet(self)</span>
              </div>
            </motion.div>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', paddingTop: '52px', gap: '4px' }}>
            {phase !== 'blueprint' && (
              <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '3px' }}>
                <div style={{ width: '36px', height: '3px', background: `linear-gradient(to right, ${C.blue}, ${C.purple})`, borderRadius: '2px' }} />
                <div style={{ fontSize: '8px', color: '#60a5fa', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>instantiate</div>
                <div style={{ color: '#60a5fa', fontSize: '16px' }}>→</div>
              </motion.div>
            )}
          </div>

          {/* Instances */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', marginBottom: '8px', textAlign: 'center' as const }}>OBJECT INSTANCES</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
              {instances.map((inst, i) => (
                <AnimatePresence key={inst.name}>
                  {phase !== 'blueprint' && (
                    <motion.div initial={{ opacity: 0, x: 24, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: i * 0.18, type: 'spring', stiffness: 300 }}
                      style={{ padding: '12px 14px', borderRadius: '10px', background: inst.color, color: '#fff', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: `0 4px 16px ${inst.color}50` }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', fontWeight: 700, opacity: 0.85, marginBottom: '2px' }}>user_{i+1} = User(&quot;{inst.name}&quot;, ...)</div>
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>self.name = &quot;<strong>{inst.name}</strong>&quot;</div>
                      </div>
                      <motion.button whileHover={{ scale: 1.08 }} onClick={() => setCallTarget(callTarget === i ? null : i)}
                        style={{ padding: '6px 12px', borderRadius: '7px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', background: 'rgba(255,255,255,0.25)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono',monospace" }}>
                        greet()
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
            <AnimatePresence>
              {callTarget !== null && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ marginTop: '10px', padding: '12px 14px', borderRadius: '10px', background: instances[callTarget].color, color: '#fff', boxShadow: `0 4px 16px ${instances[callTarget].color}50` }}>
                  <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', opacity: 0.8 }}>user_{callTarget + 1}.greet() → </code>
                  <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', fontWeight: 800 }}>&quot;Hello, {instances[callTarget].name}&quot;</code>
                  <div style={{ marginTop: '6px', fontSize: '11px', opacity: 0.85 }}>
                    <code style={{ fontFamily: "'JetBrains Mono',monospace", background: 'rgba(255,255,255,0.2)', padding: '1px 5px', borderRadius: '3px' }}>self.name</code> resolves to <strong>&quot;{instances[callTarget].name}&quot;</strong> — this instance&apos;s own value.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ANIMATION B · INHERITANCE TREE ──────────────────────────────────────────
function InheritanceTreeAnimation() {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { const t = setTimeout(() => setRevealed(true), 800); return () => clearTimeout(t); }, []);

  const child1 = { name: 'AdminUser', color: C.blue,   extra: 'permission_level' };
  const child2 = { name: 'GuestUser', color: C.teal,   extra: 'expiry_date' };

  return (
    <div style={{ background: '#0F172A', borderRadius: '14px', border: `2px solid ${C.purple}`, padding: '20px 24px', margin: '28px 0', boxShadow: `0 8px 32px ${C.purple}30` }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, color: C.purple, letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: '20px' }}>
        Inheritance Tree Visualizer · One parent — two specialized children
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '0' }}>
        {/* Parent */}
        <motion.div animate={{ boxShadow: `0 0 24px ${C.purple}60` }}
          style={{ padding: '14px 22px', borderRadius: '12px', background: C.purple, color: '#fff', textAlign: 'center' as const, minWidth: '180px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', opacity: 0.7, marginBottom: '3px' }}>parent class</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>User</div>
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
            {['name', 'email'].map(a => <span key={a} style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.22)', fontSize: '10px', fontFamily: "'JetBrains Mono',monospace" }}>{a}</span>)}
            <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.22)', fontSize: '10px', fontFamily: "'JetBrains Mono',monospace" }}>greet()</span>
          </div>
        </motion.div>

        {/* Connector */}
        {revealed && (
          <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.3 }}
            style={{ width: '2px', height: '24px', background: '#334155', transformOrigin: 'top' }} />
        )}

        {/* Children */}
        {revealed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            {[child1, child2].map((child, i) => (
              <div key={child.name} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center' }}>
                <div style={{ width: '2px', height: '20px', background: '#334155' }} />
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 + i * 0.15, type: 'spring', stiffness: 300 }}
                  style={{ padding: '12px 18px', borderRadius: '10px', background: child.color, color: '#fff', textAlign: 'center' as const, minWidth: '160px', boxShadow: `0 4px 16px ${child.color}50` }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', opacity: 0.7, marginBottom: '3px' }}>extends User</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>{child.name}</div>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
                    <span style={{ padding: '2px 7px', borderRadius: '4px', background: 'rgba(255,255,255,0.15)', fontSize: '9px', fontFamily: "'JetBrains Mono',monospace', opacity: 0.7" }}>name ✓</span>
                    <span style={{ padding: '2px 7px', borderRadius: '4px', background: 'rgba(255,255,255,0.15)', fontSize: '9px', fontFamily: "'JetBrains Mono',monospace', opacity: 0.7" }}>greet() ✓</span>
                    <span style={{ padding: '2px 7px', borderRadius: '4px', background: 'rgba(255,255,255,0.3)', fontSize: '9px', fontFamily: "'JetBrains Mono',monospace'", fontWeight: 700 }}>{child.extra} ★</span>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        )}

        {revealed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            style={{ marginTop: '16px', padding: '10px 16px', borderRadius: '8px', background: C.purple, color: '#fff', fontSize: '12px', fontWeight: 600, textAlign: 'center' as const, boxShadow: `0 4px 12px ${C.purple}40` }}>
            ✓ Children inherit name + greet(). Each adds only what makes it specialized.
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── TOOL 2 · INHERITANCE RELATIONSHIP LAB ──────────────────────────────────
const PAIRS = [
  { id: 'p1', parent: 'User',    child: 'AdminUser',         valid: true,  reason: 'AdminUser IS a User — it adds permissions but shares core identity. Real is-a relationship.' },
  { id: 'p2', parent: 'Vehicle', child: 'Car',               valid: true,  reason: 'Car IS a Vehicle — it specializes the concept. Shared structure makes sense.' },
  { id: 'p3', parent: 'Notification', child: 'EmailNotification', valid: true, reason: 'EmailNotification IS a Notification — different delivery, same concept.' },
  { id: 'p4', parent: 'Product', child: 'DiscountCalculator', valid: false, reason: 'DiscountCalculator is not a type of Product — it performs a calculation. Utility, not identity.' },
];

function InheritanceRelationshipLab() {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const submit = (id: string, choice: boolean) => { setAnswers(prev => ({ ...prev, [id]: choice })); setRevealed(prev => ({ ...prev, [id]: true })); };
  const score = PAIRS.filter(p => answers[p.id] === p.valid).length;

  return (
    <div style={{ background: '#0F172A', borderRadius: '16px', border: `2px solid ${C.indigo}`, overflow: 'hidden', margin: '28px 0', boxShadow: `0 8px 32px ${C.indigo}30` }}>
      <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${C.indigo} 0%, ${C.purple} 100%)`, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🔗</div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#fff', textTransform: 'uppercase' as const }}>Inheritance Relationship Lab</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>For each pair: Valid is-a relationship or not? Decide — then reveal.</div>
        </div>
      </div>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
        {PAIRS.map(pair => {
          const isRevealed = revealed[pair.id];
          const correct = answers[pair.id] === pair.valid;
          const bgColor = isRevealed ? (correct ? C.green : C.red) : '#1e293b';
          return (
            <div key={pair.id} style={{ borderRadius: '12px', background: bgColor, overflow: 'hidden', transition: 'background 0.4s', boxShadow: isRevealed ? `0 4px 16px ${bgColor}50` : 'none' }}>
              <div style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ padding: '8px 14px', borderRadius: '8px', background: C.purple, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', fontWeight: 800 }}>{pair.parent}</div>
                <div style={{ fontSize: '18px', color: '#64748b' }}>⟵?</div>
                <div style={{ padding: '8px 14px', borderRadius: '8px', background: C.teal, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', fontWeight: 800 }}>{pair.child}</div>
                <div style={{ fontSize: '12px', color: isRevealed ? '#fff' : '#94a3b8', flex: 1, fontStyle: 'italic', opacity: 0.9 }}>{pair.child} is a type of {pair.parent}?</div>
                {!isRevealed ? (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <motion.button whileHover={{ scale: 1.05 }} onClick={() => submit(pair.id, true)}
                      style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', background: C.green, color: '#fff', border: 'none', boxShadow: `0 3px 10px ${C.green}60` }}>
                      ✓ Valid
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} onClick={() => submit(pair.id, false)}
                      style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', background: C.red, color: '#fff', border: 'none', boxShadow: `0 3px 10px ${C.red}60` }}>
                      ✗ Invalid
                    </motion.button>
                  </div>
                ) : <span style={{ fontSize: '22px' }}>{correct ? '✓' : '✗'}</span>}
              </div>
              {isRevealed && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '12px', color: '#fff', lineHeight: 1.6, fontWeight: 600 }}>
                    {pair.valid ? '✓ Valid.' : '✗ Not a true is-a.'} {pair.reason}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
        {Object.keys(revealed).length === PAIRS.length && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: '12px 16px', borderRadius: '10px', background: C.indigo, color: '#fff', textAlign: 'center' as const, fontSize: '13px', fontWeight: 800, boxShadow: `0 4px 16px ${C.indigo}50` }}>
            {score}/{PAIRS.length} correct — Inheritance works when one class IS truly a specialized form of another.
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── ANIMATION 2 · ABSTRACT CONTRACT ─────────────────────────────────────────
function AbstractContractAnimation() {
  const [step, setStep] = useState(0);
  const [calledPayment, setCalledPayment] = useState<string | null>(null);
  const children = [
    { name: 'CardPayment',   color: C.blue,   impl: 'Processed card payment of ₹500'   },
    { name: 'UPIPayment',    color: C.purple, impl: 'Processed UPI payment of ₹500'    },
    { name: 'WalletPayment', color: C.teal,   impl: 'Processed wallet payment of ₹500'  },
  ];
  useEffect(() => { const t = setTimeout(() => setStep(s => Math.min(s + 1, 2)), 900); return () => clearTimeout(t); }, [step]);

  return (
    <div style={{ background: '#0F172A', borderRadius: '16px', border: `2px solid ${C.amber}`, overflow: 'hidden', margin: '28px 0', boxShadow: `0 8px 32px ${C.amber}30` }}>
      <div style={{ padding: '12px 20px', background: `linear-gradient(135deg, ${C.amber} 0%, ${C.orange} 100%)`, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📋</div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#fff', textTransform: 'uppercase' as const }}>Abstract Contract — Required Behavior</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginTop: '1px' }}>Click each payment type to call process_payment() — same contract, different implementation.</div>
        </div>
      </div>
      <div style={{ padding: '24px' }}>
        {/* Abstract class */}
        <div style={{ textAlign: 'center' as const, marginBottom: '16px' }}>
          <motion.div animate={{ boxShadow: step === 0 ? `0 0 32px ${C.amber}80` : `0 4px 16px ${C.amber}40` }}
            style={{ display: 'inline-block', padding: '14px 28px', borderRadius: '14px', background: C.amber, border: `2px solid ${C.amber}` }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>@abstractclass</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '15px', fontWeight: 800, color: '#fff' }}>class Payment(ABC):</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginTop: '6px' }}>@abstractmethod</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: '#fff', fontWeight: 700 }}>process_payment(amount) → required</div>
          </motion.div>
          <div style={{ fontSize: '10px', color: C.red, fontWeight: 800, marginTop: '6px', fontFamily: "'JetBrains Mono',monospace" }}>❌ Cannot be instantiated directly</div>
        </div>

        {step >= 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'center', gap: '60px', marginBottom: '12px' }}>
            {children.map((c, i) => (
              <motion.div key={c.name} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.1 }}
                style={{ transformOrigin: 'top', width: '3px', height: '28px', background: `linear-gradient(to bottom, ${C.amber}, ${c.color})`, borderRadius: '2px' }} />
            ))}
          </motion.div>
        )}

        {step >= 2 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
            {children.map(c => (
              <motion.div key={c.name} whileHover={{ y: -3, boxShadow: `0 8px 24px ${c.color}60` }} onClick={() => setCalledPayment(calledPayment === c.name ? null : c.name)}
                style={{ padding: '14px', borderRadius: '12px', cursor: 'pointer', background: calledPayment === c.name ? c.color : '#1e293b', border: `2px solid ${c.color}`, textAlign: 'center' as const, boxShadow: `0 4px 12px ${c.color}30`, transition: 'all 0.2s', color: calledPayment === c.name ? '#fff' : c.color }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>{c.name}</div>
                <div style={{ fontSize: '9px', opacity: 0.7, fontFamily: "'JetBrains Mono',monospace", marginBottom: '8px' }}>extends Payment</div>
                <div style={{ padding: '5px 8px', borderRadius: '6px', background: calledPayment === c.name ? 'rgba(255,255,255,0.25)' : `${c.color}20`, fontSize: '10px', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
                  def process_payment(self)
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {calledPayment && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '10px', background: children.find(c => c.name === calledPayment)!.color, color: '#fff', boxShadow: `0 4px 16px ${children.find(c => c.name === calledPayment)!.color}50` }}>
              <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', opacity: 0.85 }}>{calledPayment}().process_payment(500) → </code>
              <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', fontWeight: 800 }}>&quot;{children.find(c => c.name === calledPayment)?.impl}&quot;</code>
              <div style={{ marginTop: '5px', fontSize: '11px', opacity: 0.85 }}>Same contract enforced by the abstract class — different implementation each time.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── ANIMATION C · MODULE FILING ANIMATION ───────────────────────────────────
function ModuleFilingAnimation() {
  const [step, setStep] = useState(0);
  const files = [
    { name: 'User', pkg: 'users/',    color: C.green  },
    { name: 'CardPayment', pkg: 'payments/', color: C.purple },
    { name: 'auth_helper', pkg: 'auth/',    color: C.blue   },
    { name: 'Order',       pkg: 'orders/',  color: C.orange },
  ];
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % (files.length + 2)), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: '#0F172A', borderRadius: '14px', border: `2px solid ${C.teal}`, padding: '20px 24px', margin: '28px 0', boxShadow: `0 8px 32px ${C.teal}30` }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: '18px' }}>
        Module Filing Animation · Code organized by responsibility
      </div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        {/* Incoming files */}
        <div style={{ flexShrink: 0, width: '140px' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', fontFamily: "'JetBrains Mono',monospace", marginBottom: '8px' }}>CODE UNITS</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {files.map((f, i) => (
              <motion.div key={f.name} animate={{ opacity: step > i ? 0.3 : 1, x: step === i + 1 ? 20 : 0 }} transition={{ duration: 0.4 }}
                style={{ padding: '6px 12px', borderRadius: '7px', background: step > i ? '#1e293b' : f.color, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', fontWeight: 700, boxShadow: step <= i ? `0 2px 8px ${f.color}50` : 'none', transition: 'background 0.3s' }}>
                {f.name}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ paddingTop: '40px', color: C.teal, fontSize: '22px' }}>→</div>

        {/* Package folders */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { name: 'users/',    color: C.green,  files: ['User'] },
            { name: 'payments/', color: C.purple, files: ['CardPayment'] },
            { name: 'auth/',     color: C.blue,   files: ['auth_helper'] },
            { name: 'orders/',   color: C.orange, files: ['Order'] },
          ].map(pkg => {
            const filled = files.filter((f, i) => f.pkg === pkg.name && step > i + 1).length > 0;
            return (
              <div key={pkg.name} style={{ padding: '10px 12px', borderRadius: '10px', border: `2px solid ${pkg.color}`, background: filled ? `${pkg.color}15` : '#1e293b', transition: 'background 0.4s' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 800, color: pkg.color, marginBottom: '5px' }}>📁 {pkg.name}</div>
                {pkg.files.filter(f => files.find(fi => fi.name === f && step > files.findIndex(x => x.name === f) + 1)).map(f => (
                  <motion.div key={f} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ padding: '3px 8px', borderRadius: '5px', background: pkg.color, color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 700, display: 'inline-block', boxShadow: `0 2px 8px ${pkg.color}60` }}>
                    {f}.py
                  </motion.div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── TOOL 3 · MODULE & PACKAGE ARCHITECTURE LAB ──────────────────────────────
const CODE_UNITS = [
  { id: 'User',          label: 'User',               type: 'class', correct: 'users',    color: C.green  },
  { id: 'AdminUser',     label: 'AdminUser',          type: 'class', correct: 'users',    color: C.green  },
  { id: 'auth_helper',   label: 'auth_helper()',      type: 'func',  correct: 'auth',     color: C.blue   },
  { id: 'CardPayment',   label: 'CardPayment',        type: 'class', correct: 'payments', color: C.purple },
  { id: 'invoice_gen',   label: 'generate_invoice()', type: 'func',  correct: 'payments', color: C.purple },
  { id: 'Order',         label: 'Order',              type: 'class', correct: 'orders',   color: C.orange },
  { id: 'price_rule',    label: 'apply_pricing()',    type: 'func',  correct: 'orders',   color: C.orange },
  { id: 'validate_email',label: 'validate_email()',   type: 'func',  correct: 'utils',    color: C.teal   },
];

const PACKAGES = [
  { id: 'users',    label: 'users/',    color: C.green,  emoji: '👤' },
  { id: 'payments', label: 'payments/', color: C.purple, emoji: '💳' },
  { id: 'orders',   label: 'orders/',   color: C.orange, emoji: '📦' },
  { id: 'auth',     label: 'auth/',     color: C.blue,   emoji: '🔐' },
  { id: 'utils',    label: 'utils/',    color: C.teal,   emoji: '🔧' },
];

function ModuleArchitectureLab() {
  const [placements, setPlacements] = useState<Record<string, string | null>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const place = (pkgId: string) => {
    if (!selected) return;
    const unit = CODE_UNITS.find(u => u.id === selected)!;
    setFeedback(prev => ({ ...prev, [selected]: unit.correct === pkgId }));
    setPlacements(prev => ({ ...prev, [selected]: pkgId }));
    setSelected(null);
  };

  const unplaced = CODE_UNITS.filter(u => !placements[u.id]);
  const score = CODE_UNITS.filter(u => feedback[u.id]).length;
  const allDone = CODE_UNITS.every(u => placements[u.id]);

  return (
    <div style={{ background: '#0F172A', borderRadius: '16px', border: `2px solid ${C.teal}`, overflow: 'hidden', margin: '28px 0', boxShadow: `0 8px 32px ${C.teal}30` }}>
      <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${C.teal} 0%, ${C.blue} 100%)`, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📁</div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#fff', textTransform: 'uppercase' as const }}>Module & Package Architecture Lab</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>Click a code unit, then click the right package. Organize by system responsibility.</div>
        </div>
      </div>
      <div style={{ padding: '20px 24px' }}>
        {/* Pool */}
        {unplaced.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>CODE UNITS — click to select</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '7px' }}>
              {unplaced.map(u => (
                <motion.div key={u.id} whileHover={{ y: -2 }} onClick={() => setSelected(selected === u.id ? null : u.id)}
                  style={{ padding: '6px 13px', borderRadius: '7px', cursor: 'pointer', background: selected === u.id ? u.color : '#1e293b', border: `2px solid ${u.color}`, fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: selected === u.id ? '#fff' : u.color, fontWeight: 700, transition: 'all 0.15s', display: 'flex', gap: '6px', alignItems: 'center', boxShadow: selected === u.id ? `0 4px 14px ${u.color}60` : 'none' }}>
                  <span style={{ padding: '1px 5px', borderRadius: '3px', background: 'rgba(255,255,255,0.2)', fontSize: '8px', fontWeight: 700 }}>{u.type}</span>
                  {u.label}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Packages grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '8px' }}>
          {PACKAGES.map(pkg => {
            const items = CODE_UNITS.filter(u => placements[u.id] === pkg.id);
            return (
              <motion.div key={pkg.id} whileHover={selected ? { scale: 1.03 } : {}} onClick={() => place(pkg.id)}
                style={{ borderRadius: '10px', border: `2px solid ${selected ? pkg.color : '#334155'}`, padding: '10px 8px', cursor: selected ? 'pointer' : 'default', background: selected ? `${pkg.color}18` : '#1e293b', minHeight: '110px', transition: 'all 0.2s', boxShadow: selected ? `0 4px 16px ${pkg.color}30` : 'none' }}>
                <div style={{ fontSize: '18px', textAlign: 'center' as const, marginBottom: '4px' }}>{pkg.emoji}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 800, color: pkg.color, letterSpacing: '0.06em', marginBottom: '7px', textAlign: 'center' as const }}>{pkg.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '3px' }}>
                  {items.map(u => (
                    <div key={u.id} style={{ padding: '3px 7px', borderRadius: '5px', fontSize: '9px', fontFamily: "'JetBrains Mono',monospace", background: feedback[u.id] ? pkg.color : C.red, color: '#fff', fontWeight: 700, boxShadow: `0 2px 6px ${feedback[u.id] ? pkg.color : C.red}50` }}>
                      {feedback[u.id] ? '✓' : '✗'} {u.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Wrong placement hints */}
        {CODE_UNITS.filter(u => placements[u.id] && !feedback[u.id]).map(u => {
          const correctPkg = PACKAGES.find(p => p.id === u.correct)!;
          return (
            <motion.div key={u.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '7px', padding: '9px 14px', borderRadius: '8px', background: C.red, color: '#fff', fontSize: '12px', fontWeight: 600, boxShadow: `0 3px 10px ${C.red}50` }}>
              ✗ <code style={{ fontFamily: "'JetBrains Mono',monospace", background: 'rgba(255,255,255,0.2)', padding: '1px 5px', borderRadius: '3px' }}>{u.label}</code> belongs in <strong>{correctPkg.label}</strong> — that&apos;s where {u.type === 'class' ? 'this entity' : 'this logic'} lives.
            </motion.div>
          );
        })}

        {allDone && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '10px', background: score >= 6 ? C.green : C.amber, color: '#fff', textAlign: 'center' as const, boxShadow: `0 4px 16px ${score >= 6 ? C.green : C.amber}50` }}>
            <div style={{ fontWeight: 800, fontSize: '15px' }}>{score}/{CODE_UNITS.length} correct</div>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '3px' }}>A file answers: what logic lives here? A package answers: what system area this belongs to.</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
interface Props { onBack: () => void; }

export default function PythonPreRead2({ onBack }: Props) {
  const store = useLearnerStore();
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set(['pr2-structure']));

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
    <SWEPreReadLayout trackConfig={TRACK_CONFIG} moduleLabel="PYTHON PRE-READ 02" title="Writing Structured Python" sections={SECTIONS} completedModules={completedModules} activeSection={activeSection} onBack={onBack}>

      {/* ── HERO ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '52px' }}>
        <p style={{ fontSize: '17px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora',Georgia,serif", marginBottom: '34px', maxWidth: '580px' }}>
          &ldquo;Code can work and still be too messy to build on. Structure is what makes code safe to grow.&rdquo;
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '34px' }}>
          {([
            { name: 'Arjun', face: 'priya' as const, role: 'Backend Learner', desc: 'Understands Python basics. Now hitting the pain of unstructured code.', color: ACCENT },
            { name: 'Nisha', face: 'asha'  as const, role: 'Backend Mentor', desc: 'Structure is not style. It is engineering safety.', color: '#0369A1' },
            { name: 'Kabir', face: 'kiran' as const, role: 'Senior Backend Engineer', desc: 'Pushes for code organization, cleaner boundaries, stronger design.', color: '#7843EE' },
            { name: 'Meera', face: 'maya'  as const, role: 'Data-focused Teammate', desc: 'Helps model code around real entities and relationships.', color: '#C85A40' },
          ]).map(c => (
            <div key={c.name} style={{ background: `${c.color}0D`, border: `1px solid ${c.color}33`, borderRadius: '10px', padding: '12px 14px', flex: '1', minWidth: '130px' }}>
              <div style={{ marginBottom: '6px' }}><MentorFace mentor={c.face} size={38} /></div>
              <div style={{ fontWeight: 700, fontSize: '12px', color: c.color, marginBottom: '2px' }}>{c.name}</div>
              <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: 'monospace', letterSpacing: '0.04em', marginBottom: '5px' }}>{c.role}</div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '18px 22px', borderLeft: `4px solid ${ACCENT}`, border: '1px solid var(--ed-rule)', borderLeftWidth: '4px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '10px', textTransform: 'uppercase' as const }}>What this pre-read covers</div>
          {['Why structure matters — and what happens when it is missing', 'Classes, self, inheritance, and abstract classes — when each one earns its place', 'Modules and packages — organizing a backend project by responsibility'].map((obj, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 2 ? '8px' : 0, alignItems: 'flex-start' }}>
              <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '11px', marginTop: '2px' }}>0{i + 1}</span>
              <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{obj}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── PART 1 · STRUCTURE ── */}
      <ChapterSection id="pr2-structure" data-nav-id="pr2-structure" num="01" accentRgb={ACCENT_RGB} first>
        <SceneSetter title="The script that worked — until it became a mess." story="Arjun has been building an order-processing prototype. At first, one file felt enough. Then it grew. Now it contains user information, product information, order totals, discount logic, payment rules, repeated validation, debug print statements, and random helpers at the bottom. He opens the file and scrolls. And scrolls again." mentorQuote="Does it work? — Yes. — Can you explain where each kind of logic belongs? — ...no." mentorName="Kabir" mentorColor="#7843EE" />

        <ConvoScene lines={[
          { speaker: 'mentor', text: 'This is the point where a Python script stops being enough. A script is fine when the program is tiny. But backend systems do not stay tiny.' },
          { speaker: 'arjun', text: "So it's not about syntax anymore. It's about how to organize the code?" },
          { speaker: 'mentor', text: "Exactly. The problem is no longer what you're saying. It's where you're putting it." },
        ]} mentorName="Nisha" mentorColor="#0369A1" />

        {h2(<>Good code is code where responsibility is visible</>)}
        {para(<>Beginner code does not fail immediately. It fails slowly — not because it stops running, but because it becomes too confusing to extend safely. When code starts representing real entities like users, orders, and payments, one file becomes the wrong shape.</>)}

        <PythonPrinciple text="When code starts representing real entities and repeated behavior, structure becomes an engineering need, not a stylistic preference." />
        <ApplyItBox prompt="Think of a small project: an order system, a task manager, a user account service. What kinds of logic would start getting mixed together if everything stayed in one file?" />

        <QuizEngine conceptId="python-structure" conceptName="Code Structure" moduleContext="Python Pre-Read 02: Writing Structured Python. Covers classes, inheritance, abstract classes, and modules."
          staticQuiz={{ conceptId: "python-structure", question: "What is the strongest sign that code needs better structure?", options: ['It has more than 20 lines of code', 'It works, but it is hard to explain where different logic belongs', 'It uses functions', 'It has comments'], correctIndex: 1, explanation: "Code can be correct and still be unstructured. The sign is when you can't explain where each kind of logic lives — not how much there is." }} />
      </ChapterSection>

      {/* ── PART 2 · CLASSES ── */}
      <ChapterSection id="pr2-classes" data-nav-id="pr2-classes" num="02" accentRgb={ACCENT_RGB}>
        <SceneSetter title="The day classes finally made sense." story="Meera writes three words on a board: User. Product. Order. Then she asks: are these just values in your code, or are they real things your system understands? Arjun thinks about it. A user has a name, an email, an active status. An order has items, a user, a total, a state. That is when classes start making sense." mentorQuote="A class is not 'advanced Python.' It is a way to define a blueprint for a kind of thing your system cares about." mentorName="Kabir" mentorColor="#7843EE" />

        <CodeBlock filename="user_class.py" code={`class User:
    def __init__(self, name: str, email: str, is_active: bool):
        self.name = name
        self.email = email
        self.is_active = is_active

    def display_info(self) -> str:
        return f"{self.name} <{self.email}>"

user_1 = User("Ravi", "ravi@example.com", True)
print(user_1.display_info())`} />

        {para(<>Instead of data floating around as separate variables, the system now has a coherent object with related data and related behavior together. Classes help when data and behavior belong together.</>)}

        <ClassStructureAnimation />
        <ClassBuilderStudio />

        <PythonPrinciple text="Classes help when the code needs to represent real entities with both data and behavior." />
        <ApplyItBox prompt="Think of a backend object like Order. What data belongs inside it? What behavior belongs inside it?" />

        <QuizEngine conceptId="python-classes" conceptName="Python Classes" moduleContext="Python Pre-Read 02."
          staticQuiz={{ conceptId: "python-classes", question: "Why would you use a class in Python?", options: ['To make Python look advanced', 'To group related data and behavior into one structured unit', 'To avoid using functions entirely', 'To replace all dictionaries'], correctIndex: 1, explanation: "Classes group related data and behavior together. When your code keeps representing the same kind of thing with the same kind of behavior, a class makes it much easier to think." }} />
      </ChapterSection>

      {/* ── PART 3 · SELF ── */}
      <ChapterSection id="pr2-self" data-nav-id="pr2-self" num="03" accentRgb={ACCENT_RGB}>
        <SceneSetter title="The self problem that was really about perspective." story="Arjun is okay with class syntax for ten minutes. Then self starts bothering him. Why is it everywhere? Why does every method need it? Kabir decides not to answer with jargon." mentorQuote="Imagine you have three different User objects. They all have a name, but not the same name. When a method runs, how should Python know which object's data it should use? That's what self solves." mentorName="Kabir" mentorColor="#7843EE" />

        <ConvoScene lines={[
          { speaker: 'mentor', text: "self is just the current object talking about itself." },
          { speaker: 'arjun', text: "So it's how the method knows which user's data to use?" },
          { speaker: 'mentor', text: "Exactly. user_1.greet() and user_2.greet() call the same method — but self.name resolves to the right name for each one." },
        ]} mentorName="Meera" mentorColor="#C85A40" />

        <CodeBlock filename="self_example.py" code={`class User:
    def __init__(self, name: str):
        self.name = name

    def greet(self) -> str:
        return f"Hello, {self.name}"

user_1 = User("Ravi")
user_2 = User("Priya")

print(user_1.greet())  # Hello, Ravi
print(user_2.greet())  # Hello, Priya
# Same method. Different object state. self is the difference.`} />

        <BlueprintToObjectAnimation />

        <PythonPrinciple text="A class is a blueprint. An object is a real instance. self is how that instance refers to its own state." />
        <ApplyItBox prompt="If you create five Product objects from one class, what should stay shared across all of them — and what should differ for each one?" />

        <QuizEngine conceptId="python-self" conceptName="Python self" moduleContext="Python Pre-Read 02."
          staticQuiz={{ conceptId: "python-self", question: "What does self represent in a Python method?", options: ['The whole program', 'The current object instance', 'The class name', 'The return value'], correctIndex: 1, explanation: "self is how each object instance refers to its own data. It is not magic — it is instance-specific reference. user_1.greet() passes user_1 as self automatically." }} />
      </ChapterSection>

      {/* ── PART 4 · INHERITANCE ── */}
      <ChapterSection id="pr2-inheritance" data-nav-id="pr2-inheritance" num="04" accentRgb={ACCENT_RGB}>
        <SceneSetter title="The inheritance shortcut that almost became copy-paste design." story="Arjun needs to add AdminUser. His instinct: copy the User class and make a second version. Kabir stops him immediately." mentorQuote="Copy-paste is not structure. It is hidden duplication. If AdminUser is really a more specific kind of User, inheritance can make sense." mentorName="Kabir" mentorColor="#7843EE" />

        <CodeBlock filename="inheritance_example.py" code={`class User:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email

    def display_info(self) -> str:
        return f"{self.name} <{self.email}>"

class AdminUser(User):
    def __init__(self, name: str, email: str, permission_level: int):
        super().__init__(name, email)       # inherit from User
        self.permission_level = permission_level  # admin-specific

admin = AdminUser("Ravi", "ravi@example.com", 3)
print(admin.display_info())  # inherited from User`} />

        <ConvoScene lines={[
          { speaker: 'mentor', text: "Inheritance is useful when the relationship is real. Not when you are forcing it just to reduce typing." },
          { speaker: 'arjun', text: "So AdminUser is-a User makes sense. But what about something like using Product as a parent for DiscountCalculator?" },
          { speaker: 'mentor', text: "That's forced. A discount calculator is not a type of product — it just uses product data. Wrong relationship." },
        ]} mentorName="Nisha" mentorColor="#0369A1" />

        <InheritanceTreeAnimation />
        <InheritanceRelationshipLab />

        <PythonPrinciple text="Inheritance works best when one class is truly a more specific version of another." />
        <ApplyItBox prompt="What is one good inheritance example in a backend system? What is one bad forced example? Why does the difference matter?" />

        <QuizEngine conceptId="python-inheritance" conceptName="Python Inheritance" moduleContext="Python Pre-Read 02."
          staticQuiz={{ conceptId: "python-inheritance", question: "When is inheritance most appropriate?", options: ['Whenever two classes share a few fields', 'When one class is a true specialized form of another', 'Whenever you want shorter code', 'Only in Java, not in Python'], correctIndex: 1, explanation: "Inheritance should reflect real specialization. AdminUser is-a User. Car is-a Vehicle. But DiscountCalculator is not-a Product — it uses product data but is not a type of product." }} />
      </ChapterSection>

      {/* ── PART 5 · ABSTRACT CLASSES ── */}
      <ChapterSection id="pr2-abstract" data-nav-id="pr2-abstract" num="05" accentRgb={ACCENT_RGB}>
        <SceneSetter title="The moment Arjun learned the difference between shared code and required behavior." story="The project now has multiple payment types: card, UPI, wallet. They all need process_payment() behavior, but the implementation differs. Nisha asks: what if you want to guarantee that every payment type defines process_payment(), even if each does it differently?" mentorQuote="Abstract classes define a required contract. Children must implement it. Inheritance can share structure — abstract classes can also enforce required behavior." mentorName="Kabir" mentorColor="#7843EE" />

        <CodeBlock filename="abstract_example.py" code={`from abc import ABC, abstractmethod

class Payment(ABC):          # abstract — cannot be instantiated directly
    @abstractmethod
    def process_payment(self, amount: float) -> str:
        pass                 # child classes MUST implement this

class CardPayment(Payment):
    def process_payment(self, amount: float) -> str:
        return f"Processed card payment of {amount}"

class UPIPayment(Payment):
    def process_payment(self, amount: float) -> str:
        return f"Processed UPI payment of {amount}"

# Payment()        # TypeError — cannot instantiate abstract class
CardPayment().process_payment(500)   # works`} />

        <AbstractContractAnimation />

        <PythonPrinciple text="Abstract classes are useful when different implementations must all fulfill the same required behavior." />
        <ApplyItBox prompt="Think of one backend example where multiple classes should all implement the same method differently: payment gateways, notification channels, storage adapters. What is the shared contract?" />

        <QuizEngine conceptId="python-abstract" conceptName="Abstract Classes" moduleContext="Python Pre-Read 02."
          staticQuiz={{ conceptId: "python-abstract", question: "Why would you use an abstract class?", options: ['To make all child classes identical', 'To guarantee that child classes implement required behavior', 'To avoid using inheritance entirely', 'To remove methods from child classes'], correctIndex: 1, explanation: "Abstract classes define a contract. Every child must implement the required methods — but each implements them differently. This creates consistency across multiple implementations." }} />
      </ChapterSection>

      {/* ── PART 6 · MODULES ── */}
      <ChapterSection id="pr2-modules" data-nav-id="pr2-modules" num="06" accentRgb={ACCENT_RGB}>
        <SceneSetter title="The file structure problem that turned into a project architecture problem." story="Arjun's code inside each file looks better. But the overall project still feels messy. He has user.py, payment.py, helpers.py, utils.py, misc.py, one file with authentication, another with validation, and one file that still does too much." mentorQuote="Now we have a project structure problem. A file should answer: what kind of logic lives here? A package should answer: what part of the system this belongs to." mentorName="Kabir" mentorColor="#7843EE" />

        <CodeBlock filename="project_structure.py" code={`project/
    users/
        __init__.py
        user.py          # User, AdminUser classes
        auth.py          # authentication helpers
    payments/
        __init__.py
        gateway.py       # CardPayment, UPIPayment, WalletPayment
        invoice.py       # generate_invoice()
    orders/
        __init__.py
        order.py         # Order class
        pricing.py       # apply_pricing_rule()

# Imports now make sense:
from users.user import User
from payments.gateway import CardPayment`} />

        <ModuleFilingAnimation />
        <ModuleArchitectureLab />

        <PythonPrinciple text="Modules separate logic. Packages organize system responsibility." />
        <ApplyItBox prompt="If you were organizing a backend project, what would go into users/, payments/, orders/, auth/, and utils/? Which should be packages and which should be single modules?" />

        <QuizEngine conceptId="python-modules" conceptName="Modules and Packages" moduleContext="Python Pre-Read 02."
          staticQuiz={{ conceptId: "python-modules", question: "What is the main difference between a module and a package in Python?", options: ['Modules are classes; packages are functions', 'A module is a Python file; a package is a group of related modules', 'Packages are only for large companies', 'Modules replace directory folders entirely'], correctIndex: 1, explanation: "A module is a single .py file. A package is a directory that groups related modules. The real value is organizing code by system responsibility — not by random file accumulation." }} />
      </ChapterSection>

      {/* ── PART 7 · REFLECTION ── */}
      <ChapterSection id="pr2-reflection" data-nav-id="pr2-reflection" num="07" accentRgb={ACCENT_RGB}>
        <SceneSetter title="The week Arjun's Python finally started looking like engineering." story="Arjun reopens the project. Where there was once one growing script, there is now: cleaner entity modeling, classes where real concepts are represented, inheritance only where it makes sense, abstract contracts where behavior must be guaranteed, and modules with clearer responsibility." mentorQuote="Most beginner code doesn't fail because it's wrong. It fails because it becomes too messy to trust." mentorName="Kabir" mentorColor="#7843EE" />

        <ConvoScene lines={[
          { speaker: 'mentor', text: "What changed most for you this week?" },
          { speaker: 'arjun', text: "At first I thought structure was mostly about style. Now it feels more like safety." },
          { speaker: 'mentor', text: "That's exactly right. When backend code grows, structure is what keeps small code from becoming dangerous code." },
        ]} mentorName="Nisha" mentorColor="#0369A1" />

        {keyBox('What structured Python actually gives you', [
          'Easier to read — another engineer can navigate the code without your help',
          'Easier to extend — adding a new payment type means adding a new class, not editing a mess',
          'Easier to test — isolated responsibilities are much easier to test in isolation',
          'Easier to trust — when responsibility is visible, the code feels less fragile',
        ])}

        <PythonPrinciple text="Structured Python is not about making code look formal. It is about making code safer to grow." />

        <div style={{ margin: '28px 0', padding: '22px', background: 'var(--ed-card)', borderRadius: '12px', border: `1.5px solid ${ACCENT}25` }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>Thought Exercise — before Pre-Read 3</div>
          {para(<>Imagine you are building a backend for a food delivery app. You need a User, a Restaurant, an Order, different Payment types, authentication logic, validation helpers, and pricing rules.</>)}
          {para(<>Ask yourself: which should be classes? Where might inheritance help? Where might an abstract class make sense? How would you split this into modules? Which modules belong in the same package? Write the structure before moving forward.</>)}
        </div>

        <QuizEngine conceptId="python-structure-final" conceptName="Python Structure" moduleContext="Python Pre-Read 02."
          staticQuiz={{ conceptId: "python-structure-final", question: "Which sequence best reflects strong Python structuring thinking?", options: ['Write everything in one file, split later if needed', 'Start with entities and responsibilities, group data and behavior, reuse carefully, organize by system area', 'Use inheritance everywhere to reduce repetition', 'Make one file per function'], correctIndex: 1, explanation: "Strong structuring starts with understanding what real entities and responsibilities exist — then groups them cleanly, reuses only where meaningful, and organizes files so another engineer can navigate without a guide." }} />
      </ChapterSection>

    </SWEPreReadLayout>
  );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

function ReplayBtn({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.button onClick={onReplay} whileHover={{ opacity: 0.75, scale: 1.03 }} whileTap={{ scale: 0.96 }}
      style={{ marginTop: '16px', padding: '7px 22px', borderRadius: '10px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--ed-rule)', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>
      ↺ replay
    </motion.button>
  );
}
function VizLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '18px', textTransform: 'uppercase' as const }}>
      {children}
    </div>
  );
}
function LawBadge({ law, color, dark }: { law: string; color: string; dark: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <div style={{ padding: '4px 12px', borderRadius: '8px', background: color, fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.14em', boxShadow: `0 3px 0 ${dark}` }}>{law}</div>
    </div>
  );
}

// ─── 1. MICROCOPY LAB ─────────────────────────────────────────────────────────
// Same upload button, 4 different copy options. Click each to see what users
// experienced and the resulting abandonment rate. Teaches: words are UX decisions
// that belong in the PM's spec — not afterthoughts decided by engineers.

const COPY_OPTIONS = [
  {
    id: 'blank',
    label: 'No copy (engineer default)',
    buttonText: 'Submit',
    subText: null,
    abandon: 78,
    waitSec: 8,
    color: '#EF4444',
    experience: 'Users see a generic word with no context. They have no idea the system received their file, let alone what it\'s doing with it. Leaving at 8 seconds is rational.',
    pmNote: 'This is what ships when the spec says nothing about copy. The engineer chose the path of least resistance.',
  },
  {
    id: 'generic',
    label: 'Generic processing copy',
    buttonText: 'Processing...',
    subText: null,
    abandon: 62,
    waitSec: 14,
    color: '#F59E0B',
    experience: 'Better — users know something is happening. But "processing" could mean anything. No sense of duration, no sense of what success looks like.',
    pmNote: 'Most PMs stop here. It\'s technically correct. But it\'s not designed for the user\'s mental model.',
  },
  {
    id: 'task',
    label: 'Task-specific copy',
    buttonText: 'Analyzing your recording…',
    subText: null,
    abandon: 41,
    waitSec: 22,
    color: '#F97316',
    experience: 'Users know what the system is doing with their specific content. Abandonment drops significantly. Still no time expectation.',
    pmNote: 'This is the minimum viable copy for a processing state. Specific to the user\'s action, not the system\'s action.',
  },
  {
    id: 'full',
    label: 'Full feedback copy',
    buttonText: 'Extracting coaching moments…',
    subText: '~38 seconds · 60% complete',
    abandon: 12,
    waitSec: 45,
    color: '#22C55E',
    experience: 'Users know what\'s happening, why it matters, and how long it will take. They wait the full 45 seconds. The copy did the UX work that no visual design could.',
    pmNote: 'Three decisions a PM owns: (1) what verb describes the action, (2) what noun frames the value, (3) whether to show progress. None of these are design decisions.',
  },
];

export function MicrocopyLab() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [active, setActive] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const order = ['blank', 'generic', 'task', 'full'];
    const advance = () => {
      setActive(order[i % order.length]);
      i++;
    };
    advance();
    const iv = setInterval(advance, 3000);
    return () => clearInterval(iv);
  }, [inView, tick]);

  const replay = () => { setActive(null); setTick(t => t + 1); };
  const sel = COPY_OPTIONS.find(o => o.id === active);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <LawBadge law="MICROCOPY IS A PM DECISION" color="#6366F1" dark="#3730A3" />
      <VizLabel>Same button. Same upload. Four copy choices. Radically different outcomes.</VizLabel>

      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
        {/* 4 option selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid var(--ed-rule)' }}>
          {COPY_OPTIONS.map((o, i) => (
            <button key={o.id} onClick={() => setActive(o.id)}
              style={{
                padding: '12px 8px', border: 'none', cursor: 'pointer',
                background: active === o.id ? o.color : 'var(--ed-card)',
                borderRight: i < 3 ? '1px solid var(--ed-rule)' : 'none',
                transition: 'background 0.3s',
              }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, letterSpacing: '0.14em', color: active === o.id ? 'rgba(255,255,255,0.75)' : 'var(--ed-ink3)', marginBottom: '5px' }}>
                OPTION {i + 1}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 900, color: active === o.id ? '#fff' : o.color, lineHeight: 1 }}>{100 - o.abandon}%</div>
              <div style={{ fontSize: '9px', color: active === o.id ? 'rgba(255,255,255,0.65)' : 'var(--ed-ink3)', marginTop: '3px' }}>completed</div>
              {active === o.id && <motion.div layoutId="tab-line" style={{ width: '24px', height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.6)', margin: '6px auto 0' }} />}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {sel && (
            <motion.div key={sel.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', alignItems: 'stretch' }}>
                {/* Button mockup */}
                <div style={{ padding: '32px 24px', borderRight: '1px solid var(--ed-rule)', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'linear-gradient(160deg, #F8F6F1 0%, #EFECE6 100%)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: sel.color, letterSpacing: '0.14em', marginBottom: '4px' }}>{sel.label.toUpperCase()}</div>
                  <div style={{ width: '200px', padding: '12px 18px', borderRadius: '10px', background: '#1F2937', textAlign: 'center' as const, boxShadow: '0 4px 0 #111827, 0 6px 16px rgba(0,0,0,0.25)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: sel.subText ? '6px' : '0' }}>{sel.buttonText}</div>
                    {sel.subText && <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace' }}>{sel.subText}</div>}
                  </div>
                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', marginTop: '8px' }}>
                    <div style={{ padding: '10px', borderRadius: '10px', background: `${sel.color}12`, border: `1.5px solid ${sel.color}35`, textAlign: 'center' as const }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: 900, color: sel.color, lineHeight: 1 }}>{sel.abandon}%</div>
                      <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', marginTop: '3px' }}>abandoned</div>
                    </div>
                    <div style={{ padding: '10px', borderRadius: '10px', background: `${sel.color}12`, border: `1.5px solid ${sel.color}35`, textAlign: 'center' as const }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: 900, color: sel.color, lineHeight: 1 }}>{sel.waitSec}s</div>
                      <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', marginTop: '3px' }}>avg wait</div>
                    </div>
                  </div>
                </div>

                {/* Story */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: '8px' }}>WHAT USERS EXPERIENCED</div>
                    <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.75, fontStyle: 'italic' }}>&ldquo;{sel.experience}&rdquo;</div>
                  </div>
                  <div style={{ padding: '14px 16px', borderRadius: '14px', background: `${sel.color}10`, border: `1.5px solid ${sel.color}30`, borderLeft: `4px solid ${sel.color}` }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: sel.color, letterSpacing: '0.14em', marginBottom: '7px' }}>THE PM&apos;S DECISION HERE</div>
                    <div style={{ fontSize: '13px', color: 'var(--ed-ink)', fontWeight: 600, lineHeight: 1.65 }}>{sel.pmNote}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>PM ownership:</strong> the spec must name the copy for every state — not just the success state. &ldquo;The button should say something useful&rdquo; is not a spec. &ldquo;Loading: &lsquo;Extracting coaching moments…&rsquo; + % complete&rdquo; is.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 2. STATE SPEC BUILDER ────────────────────────────────────────────────────
// An interactive spec for a real EdSpark screen. User must complete all 5 state
// tabs. Teaches: spec completeness means 5 states, not 1. Each tab forces the PM
// to think through what the user sees when things go wrong, are loading, or are empty.

const STATES_SPEC = [
  {
    id: 'loading', label: 'Loading', icon: '⏳', color: '#6366F1', dark: '#3730A3',
    question: 'What does the user see while the recording is being processed?',
    bad: 'The button just grays out.',
    good: 'Progress bar (0→100%), label "Extracting coaching moments…", time estimate "~38s remaining".',
    consequence: 'Without this spec, engineers ship a gray button. 62% of users abandon.',
  },
  {
    id: 'empty', label: 'Empty', icon: '📭', color: '#0EA5E9', dark: '#0369A1',
    question: 'What does a brand-new user see before they have any recordings?',
    bad: 'A blank page with no guidance.',
    good: 'Empty state illustration + headline "Your first coaching session starts here" + CTA "Upload a recording".',
    consequence: 'Without this, new users see a blank screen and assume the product is broken. Day-1 activation drops 40%.',
  },
  {
    id: 'error', label: 'Error', icon: '⚠️', color: '#EF4444', dark: '#B91C1C',
    question: 'What happens when the Salesforce sync fails during processing?',
    bad: '"Error 403: Forbidden. Request could not be authorised."',
    good: '"Salesforce connection expired. Your recording was saved — reconnect in Settings → Integrations to finish syncing. (2 min)"',
    consequence: 'Without this, support tickets spike after CRM re-auth cycles. Enterprise users lose trust.',
  },
  {
    id: 'success', label: 'Success', icon: '✅', color: '#22C55E', dark: '#15803D',
    question: 'What does the user see when processing completes?',
    bad: 'The button disappears and the page reloads to the recordings list.',
    good: 'In-place completion: "Analysis complete. 3 coaching moments found." with a "View insights →" CTA and a summary of what was found.',
    consequence: 'Without a success state, users don\'t know the job is done. They wait, re-submit, or leave.',
  },
  {
    id: 'edge', label: 'Edge', icon: '🔧', color: '#F97316', dark: '#C2410C',
    question: 'What happens if the uploaded file is 4.9GB (just under the 5GB limit)?',
    bad: 'Processing starts, times out after 4 minutes, shows "Error 500".',
    good: 'File size validation on upload with a warning: "Large files take 3–5 minutes. We\'ll email you when it\'s ready." + background processing option.',
    consequence: 'Without edge state specs, engineers discover these cases in production. Not in the spec review.',
  },
];

export function StateSpecBuilder() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [showAnswer, setShowAnswer] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setActive(0); setCompleted(new Set()); setShowAnswer(false);
  }, [inView, tick]);

  const handleReveal = () => {
    setShowAnswer(true);
    setCompleted(prev => new Set([...prev, active]));
  };

  const replay = () => { setActive(0); setCompleted(new Set()); setShowAnswer(false); setTick(t => t + 1); };
  const s = STATES_SPEC[active];
  const allDone = completed.size === STATES_SPEC.length;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <LawBadge law="SPEC COMPLETENESS" color="#0EA5E9" dark="#0369A1" />
      <VizLabel>Every screen has 5 states. A spec that covers only success is 20% complete.</VizLabel>

      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
        {/* State tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', borderBottom: '1px solid var(--ed-rule)' }}>
          {STATES_SPEC.map((st, i) => {
            const done = completed.has(i);
            const isAct = active === i;
            return (
              <button key={st.id} onClick={() => { setActive(i); setShowAnswer(done); }}
                style={{
                  padding: '12px 6px', border: 'none', cursor: 'pointer',
                  background: isAct ? `linear-gradient(135deg, ${st.color} 0%, ${st.dark} 100%)` : done ? `${st.color}10` : 'var(--ed-card)',
                  borderRight: i < 4 ? '1px solid var(--ed-rule)' : 'none', transition: 'background 0.3s',
                }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{done ? '✓' : st.icon}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, letterSpacing: '0.1em', color: isAct ? '#fff' : done ? st.color : 'var(--ed-ink3)' }}>
                  {st.label.toUpperCase()}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active state */}
        <div style={{ padding: '28px 24px', background: 'var(--ed-card)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: s.color, letterSpacing: '0.14em', marginBottom: '12px' }}>
            {s.icon} {s.label.toUpperCase()} STATE — EDSPARK UPLOAD FLOW
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '20px', lineHeight: 1.45 }}>{s.question}</div>

          {!showAnswer ? (
            <div style={{ padding: '20px', borderRadius: '14px', background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.2)', marginBottom: '16px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#EF4444', letterSpacing: '0.14em', marginBottom: '8px' }}>❌ WHAT ENGINEERS BUILD WITHOUT THIS SPEC</div>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink)', fontStyle: 'italic', lineHeight: 1.65 }}>&ldquo;{s.bad}&rdquo;</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div style={{ padding: '18px', borderRadius: '14px', background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.2)' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#EF4444', letterSpacing: '0.14em', marginBottom: '8px' }}>❌ WITHOUT THE SPEC</div>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink)', fontStyle: 'italic', lineHeight: 1.65 }}>{s.bad}</div>
              </div>
              <div style={{ padding: '18px', borderRadius: '14px', background: `${s.color}0D`, border: `1.5px solid ${s.color}35` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: s.color, letterSpacing: '0.14em', marginBottom: '8px' }}>✓ WHAT THE SPEC MUST SAY</div>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink)', lineHeight: 1.65 }}>{s.good}</div>
              </div>
            </div>
          )}

          {showAnswer && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65, marginBottom: '16px' }}>
              <strong style={{ color: '#EF4444' }}>Consequence of missing this:</strong> {s.consequence}
            </motion.div>
          )}

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {!showAnswer ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleReveal}
                style={{ padding: '10px 24px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: 800, background: `linear-gradient(160deg, ${s.color} 0%, ${s.dark} 100%)`, color: '#fff', border: 'none', boxShadow: `0 5px 0 ${s.dark}, 0 8px 20px ${s.color}40` }}>
                What should the spec say? →
              </motion.button>
            ) : (
              active < STATES_SPEC.length - 1 && (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => { setActive(active + 1); setShowAnswer(completed.has(active + 1)); }}
                  style={{ padding: '10px 24px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: 800, background: `linear-gradient(160deg, ${STATES_SPEC[active + 1].color} 0%, ${STATES_SPEC[active + 1].dark} 100%)`, color: '#fff', border: 'none', boxShadow: `0 5px 0 ${STATES_SPEC[active + 1].dark}` }}>
                  Next state: {STATES_SPEC[active + 1].label} →
                </motion.button>
              )
            )}
            <div style={{ display: 'flex', gap: '5px' }}>
              {STATES_SPEC.map((_, i) => (
                <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: completed.has(i) ? STATES_SPEC[i].color : 'var(--ed-rule)', transition: 'background 0.3s' }} />
              ))}
            </div>
          </div>

          {allDone && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ marginTop: '16px', padding: '14px 18px', borderRadius: '14px', background: 'rgba(34,197,94,0.08)', border: '1.5px solid rgba(34,197,94,0.3)', fontSize: '13px', fontWeight: 700, color: '#22C55E', lineHeight: 1.6 }}>
              ✓ Spec complete. 5 states specced — not just success. This is what PM ownership of UX looks like.
            </motion.div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#0EA5E9' }}>The checklist:</strong> for every screen — Loading, Empty, Error, Success, Edge. If you cannot answer all five, the spec is incomplete and engineers will make decisions you should have made.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 3. UX DEBUG LOOP ─────────────────────────────────────────────────────────
// The 4-step UX diagnostic loop shown as Priya's actual sprint: Observe → Hypothesize
// → Test → Measure. Each step reveals what Priya did and what it unlocked next.
// Teaches: UX problems don't get fixed by redesigning — they get fixed by diagnosing.

const DEBUG_LOOP = [
  {
    step: 1, label: 'Observe', icon: '👁',
    color: '#6366F1', dark: '#3730A3',
    question: 'What is the user actually experiencing?',
    action: 'Priya watches 6 session recordings. She sees users clicking the "Analyze" button, waiting in silence for 12 seconds, then leaving — not because they gave up, but because the product gave them no signal it received their file.',
    unlock: 'The problem is not the 45-second processing time. The problem is the 0 seconds of feedback.',
    tool: 'Session recordings, not dashboards',
  },
  {
    step: 2, label: 'Hypothesize', icon: '💡',
    color: '#0EA5E9', dark: '#0369A1',
    question: 'What specific change would fix the specific problem?',
    action: '"If users see a progress bar, a label describing what\'s happening, and a time estimate — they will wait the full processing time instead of leaving at 12 seconds. We predict completion rises from 30% to 50%+"',
    unlock: 'A testable hypothesis: specific cause, specific fix, specific metric, specific threshold for success.',
    tool: 'Hypothesis statement — not a design brief',
  },
  {
    step: 3, label: 'Test', icon: '🔬',
    color: '#F97316', dark: '#C2410C',
    question: 'How do we test it with the minimum engineering investment?',
    action: 'Maya designs a progress bar + "Extracting coaching moments…" + "~38s remaining" in 20 minutes. Dev ships it in an afternoon. No backend changes. No feature work. Three lines of copy and a CSS animation.',
    unlock: 'Ship the smallest possible version that tests the hypothesis. Optimize after you know it works.',
    tool: 'Smallest test, not most polished version',
  },
  {
    step: 4, label: 'Measure', icon: '📊',
    color: '#22C55E', dark: '#15803D',
    question: 'Did it work — and what does the remaining gap tell us?',
    action: 'Completion: 30% → 58%. The hypothesis was confirmed (+28pp). But 42% still leave. The loading state was not the only problem. The loop begins again: what are those 42% experiencing?',
    unlock: 'The remaining gap is the next diagnostic. Don\'t redesign — re-observe. The loop is continuous.',
    tool: 'Metric + remaining gap analysis',
  },
];

export function UXDebugLoopViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [active, setActive] = useState(-1);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setActive(-1);
    const t = setTimeout(() => {
      setActive(0);
      const iv = setInterval(() => setActive(a => (a + 1) % DEBUG_LOOP.length), 4000);
      return () => clearInterval(iv);
    }, 500);
    return () => clearTimeout(t);
  }, [inView, tick]);

  const replay = () => { setActive(-1); setTick(t => t + 1); };
  const sel = active >= 0 ? DEBUG_LOOP[active] : null;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <LawBadge law="THE UX DEBUG LOOP" color="#22C55E" dark="#15803D" />
      <VizLabel>Observe → Hypothesize → Test → Measure. UX problems are diagnosed, not redesigned.</VizLabel>

      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Step nav */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
          {DEBUG_LOOP.map((s, i) => {
            const isAct = active === i;
            const isPast = active > i;
            return (
              <div key={s.step} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center' }}>
                <motion.button onClick={() => setActive(i)}
                  animate={{ background: isAct ? s.color : isPast ? `${s.color}18` : 'var(--ed-card)', borderColor: isAct ? s.color : isPast ? `${s.color}40` : 'var(--ed-rule)' }}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1.5px solid var(--ed-rule)', cursor: 'pointer', textAlign: 'left' as const, boxShadow: isAct ? `0 4px 0 ${s.dark}, 0 8px 20px ${s.color}40` : 'none', transition: 'box-shadow 0.3s' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{isPast ? '✓' : s.icon}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: isAct ? '#fff' : isPast ? s.color : 'var(--ed-ink3)', letterSpacing: '0.1em' }}>
                    {s.step}. {s.label.toUpperCase()}
                  </div>
                </motion.button>
                {i < DEBUG_LOOP.length - 1 && (
                  <div style={{ width: '2px', height: '10px', background: active > i ? s.color : 'var(--ed-rule)', transition: 'background 0.5s', margin: '2px 0' }} />
                )}
              </div>
            );
          })}
          <div style={{ marginTop: '6px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(99,102,241,0.07)', border: '1px dashed rgba(99,102,241,0.3)', textAlign: 'center' as const }}>
            <div style={{ fontSize: '10px', color: '#6366F1', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>↺ loops every sprint</div>
          </div>
        </div>

        {/* Story card */}
        <AnimatePresence mode="wait">
          {sel && (
            <motion.div key={sel.step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.32 }}
              style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: `0 16px 40px ${sel.color}20` }}>
              <div style={{ padding: '18px 22px', background: `linear-gradient(135deg, ${sel.color} 0%, ${sel.dark} 100%)` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.18em', marginBottom: '6px' }}>
                  STEP {sel.step} OF 4 — {sel.label.toUpperCase()}
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', lineHeight: 1.35, marginBottom: '4px' }}>{sel.question}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>TOOL: {sel.tool}</div>
              </div>
              <div style={{ background: 'var(--ed-card)', padding: '20px 22px', display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: '8px' }}>WHAT PRIYA DID</div>
                  <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.75 }}>{sel.action}</div>
                </div>
                <div style={{ padding: '14px 16px', borderRadius: '12px', background: `${sel.color}10`, border: `1.5px solid ${sel.color}30`, borderLeft: `4px solid ${sel.color}` }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: sel.color, letterSpacing: '0.14em', marginBottom: '6px' }}>WHAT THIS UNLOCKED</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.6 }}>{sel.unlock}</div>
                </div>
                {/* Progress dots */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {DEBUG_LOOP.map((s, i) => (
                    <motion.div key={i} animate={{ width: active === i ? '26px' : '7px', background: active === i ? s.color : 'var(--ed-rule)' }} transition={{ duration: 0.3 }} style={{ height: '7px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setActive(i)} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ marginTop: '16px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#22C55E' }}>The loop never stops:</strong> the 42% who still leave after the fix are the next Observe step. Every metric result opens the next diagnostic question. PMs who stop at &ldquo;we shipped the fix&rdquo; miss the loop entirely.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 4. ACCESSIBILITY CHECKER ─────────────────────────────────────────────────
// Real EdSpark UI elements with findable accessibility violations.
// Learner identifies each issue. Shows why accessibility = usability, not compliance.

const A11Y_ITEMS = [
  {
    id: 'contrast', label: 'Upload button',
    violation: 'Text contrast ratio: 2.8:1 (fails WCAG AA: requires 4.5:1)',
    visual: { bg: '#9CA3AF', text: '#D1D5DB', label: 'Upload Recording' },
    why: '8% of people have colour-related vision differences. Low contrast also fails in bright sunlight on mobile — relevant for managers reviewing calls between meetings.',
    fix: 'Minimum 4.5:1 for normal text, 3:1 for large text. Use a contrast checker before spec sign-off.',
    fixVisual: { bg: '#1D4ED8', text: '#FFFFFF', label: 'Upload Recording' },
    severity: 'Critical',
  },
  {
    id: 'tapTarget', label: 'Delete icon',
    violation: 'Tap target size: 16×16px (fails WCAG: requires 44×44px)',
    visual: { icon: '🗑', note: '16px icon, no padding' },
    why: 'Motor impairments affect 15%+ of adults. A 16px icon next to a 60px button means every wrong tap deletes a coaching session. This is also a mobile UX failure — finger width is ~44px.',
    fix: 'Minimum 44×44px tap target. Add padding, not just icon size. Separate destructive actions from primary ones.',
    severity: 'High',
  },
  {
    id: 'label', label: 'Search input',
    violation: 'Missing accessible label — only placeholder text',
    visual: { placeholder: 'Search recordings...' },
    why: 'Screen readers read placeholder text as label text — but placeholders disappear when users start typing. Someone using a screen reader loses context mid-input. Also fails voice control.',
    fix: 'Always use a visible <label> or aria-label. Placeholder text is supplementary, never the primary label.',
    severity: 'High',
  },
  {
    id: 'focus', label: 'Navigation tabs',
    violation: 'No visible keyboard focus indicator on tab buttons',
    visual: { tabs: ['Recordings', 'Insights', 'Team', 'Settings'], active: 0 },
    why: 'Power users and keyboard-only users (motor disabilities, developers) cannot navigate without focus indicators. Enterprise software is disproportionately used by people with assistive needs.',
    fix: 'Add :focus-visible styles — a visible 2px ring in the brand colour. This is a 2-line CSS change.',
    severity: 'Medium',
  },
];

export function AccessibilityChecker() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [showFix, setShowFix] = useState<Set<string>>(new Set());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setFlagged(new Set()); setShowFix(new Set());
  }, [inView, tick]);

  const flag = (id: string) => setFlagged(prev => new Set([...prev, id]));
  const reveal = (id: string) => setShowFix(prev => new Set([...prev, id]));
  const replay = () => { setFlagged(new Set()); setShowFix(new Set()); setTick(t => t + 1); };
  const allFlagged = flagged.size === A11Y_ITEMS.length;

  const SEV_COLOR = { Critical: '#EF4444', High: '#F97316', Medium: '#F59E0B' };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <LawBadge law="ACCESSIBILITY AS UX" color="#8B5CF6" dark="#6D28D9" />
      <VizLabel>Accessibility violations are findable — flag each one, then see the fix</VizLabel>

      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '24px', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {A11Y_ITEMS.map((item) => {
            const isFlagged = flagged.has(item.id);
            const isFixed = showFix.has(item.id);
            return (
              <div key={item.id} style={{ borderRadius: '16px', overflow: 'hidden', border: `1.5px solid ${isFlagged ? (SEV_COLOR[item.severity as keyof typeof SEV_COLOR] + '50') : 'var(--ed-rule)'}`, transition: 'border-color 0.3s' }}>
                {/* Element preview */}
                <div style={{ padding: '16px', background: 'linear-gradient(160deg, #F8F6F1 0%, #EFECE6 100%)', borderBottom: '1px solid var(--ed-rule)', minHeight: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', position: 'absolute', top: '8px', left: '10px' }}>
                    {item.label.toUpperCase()}
                  </div>
                  {/* Visual representation */}
                  {item.id === 'contrast' && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ padding: '8px 18px', borderRadius: '8px', background: item.visual.bg, fontSize: '12px', fontWeight: 700, color: item.visual.text }}>{item.visual.label}</div>
                      {isFixed && <div style={{ padding: '8px 18px', borderRadius: '8px', background: item.fixVisual?.bg, fontSize: '12px', fontWeight: 700, color: item.fixVisual?.text }}>{item.fixVisual?.label}</div>}
                    </div>
                  )}
                  {item.id === 'tapTarget' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: isFixed ? '2px dashed #F97316' : 'none' }}>🗑</div>
                      {isFixed && <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(249,115,22,0.12)', border: '2px dashed #F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🗑</div>}
                    </div>
                  )}
                  {item.id === 'label' && (
                    <input readOnly value="" placeholder={item.visual.placeholder}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: `1.5px solid ${isFixed ? '#8B5CF6' : '#D1D5DB'}`, fontSize: '12px', color: '#9CA3AF', background: '#fff', width: '160px' }} />
                  )}
                  {item.id === 'focus' && (
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {item.visual.tabs?.map((tab, ti) => (
                        <div key={tab} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: ti === 0 ? 700 : 400, background: ti === 0 ? '#6366F1' : 'transparent', color: ti === 0 ? '#fff' : '#6B7280', outline: isFixed && ti === 1 ? '2px solid #6366F1' : 'none', outlineOffset: '2px' }}>
                          {tab}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Info */}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: SEV_COLOR[item.severity as keyof typeof SEV_COLOR], letterSpacing: '0.12em' }}>
                      {item.severity.toUpperCase()}
                    </div>
                    {isFlagged && !isFixed && (
                      <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.03 }} onClick={() => reveal(item.id)}
                        style={{ padding: '3px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '9px', fontWeight: 800, background: '#22C55E', color: '#fff', border: 'none', fontFamily: 'monospace' }}>
                        See fix →
                      </motion.button>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.55, marginBottom: '8px' }}>{item.violation}</div>
                  {isFlagged && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: isFixed ? '8px' : '0' }}>{item.why}</div>
                      {isFixed && <div style={{ fontSize: '11px', fontWeight: 700, color: '#22C55E', lineHeight: 1.55 }}>✓ {item.fix}</div>}
                    </motion.div>
                  )}
                  {!isFlagged && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => flag(item.id)}
                      style={{ padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, background: `${SEV_COLOR[item.severity as keyof typeof SEV_COLOR]}12`, color: SEV_COLOR[item.severity as keyof typeof SEV_COLOR], border: `1px solid ${SEV_COLOR[item.severity as keyof typeof SEV_COLOR]}35` }}>
                      Flag violation
                    </motion.button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {allFlagged && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ marginTop: '16px', padding: '14px 18px', borderRadius: '14px', background: 'rgba(139,92,246,0.08)', border: '1.5px solid rgba(139,92,246,0.3)', fontSize: '13px', fontWeight: 700, color: '#8B5CF6', lineHeight: 1.6 }}>
            ✓ Audit complete. 4 violations found — all fixable in under a day. Accessibility is not a redesign. It&apos;s a checklist.
          </motion.div>
        )}
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#8B5CF6' }}>PM framing:</strong> accessibility violations are findable, measurable, and fixable. &ldquo;Make it accessible&rdquo; is not a spec. &ldquo;All interactive elements must have a 44×44px touch target and 4.5:1 contrast ratio&rdquo; is.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 5. DESIGN SYSTEM ROI CALCULATOR ─────────────────────────────────────────
// Proper interactive calculator showing the real math behind a design system
// investment. PM-friendly inputs: number of features, screens, time saved.
// Teaches: design system = velocity investment with a calculable break-even.

export function DesignSystemROICalc() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [featuresPerQtr, setFeaturesPerQtr] = useState(12);
  const [screensPerFeature, setScreensPerFeature] = useState(4);
  const [investmentWeeks, setInvestmentWeeks] = useState(6);

  const beforeHrs = 4;
  const afterHrs = 0.75;
  const savedPerScreen = beforeHrs - afterHrs;
  const totalScreensPerQtr = featuresPerQtr * screensPerFeature;
  const savedHrsPerQtr = totalScreensPerQtr * savedPerScreen;
  const investmentHrs = investmentWeeks * 40;
  const breakEvenWeeks = Math.ceil(investmentHrs / (savedHrsPerQtr / 13));
  const year1NetHrs = savedHrsPerQtr * 4 - investmentHrs;
  const year1NetCost = Math.round(year1NetHrs * 100); // $100/hr

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <LawBadge law="DESIGN SYSTEM ROI" color="#F97316" dark="#C2410C" />
      <VizLabel>Adjust your product — see when the investment pays back and what it earns</VizLabel>

      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          {/* Inputs */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: '16px' }}>YOUR PRODUCT VARIABLES</div>
            {[
              { label: 'Features shipped per quarter', val: featuresPerQtr, set: setFeaturesPerQtr, min: 4, max: 30, step: 1 },
              { label: 'Avg screens per feature', val: screensPerFeature, set: setScreensPerFeature, min: 1, max: 10, step: 1 },
              { label: 'Design system investment (weeks)', val: investmentWeeks, set: setInvestmentWeeks, min: 2, max: 16, step: 1 },
            ].map((inp, i) => (
              <div key={i} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ed-ink2)' }}>{inp.label}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 900, color: '#F97316' }}>{inp.val}</div>
                </div>
                <input type="range" min={inp.min} max={inp.max} step={inp.step} value={inp.val}
                  onChange={e => inp.set(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#F97316', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: 'monospace', marginTop: '3px' }}>
                  <span>{inp.min}</span><span>{inp.max}</span>
                </div>
              </div>
            ))}
            {/* Assumptions */}
            <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)', fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.65 }}>
              <strong style={{ color: '#F97316' }}>Fixed assumptions:</strong><br />
              Before DS: 4 hrs per screen. After DS: 45 min per screen. Eng cost: $100/hr.
            </div>
          </div>

          {/* Output */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: '16px' }}>THE MATH</div>
            {[
              { label: 'Screens per quarter', value: totalScreensPerQtr, unit: 'screens', color: '#6366F1' },
              { label: 'Hours saved per quarter', value: Math.round(savedHrsPerQtr), unit: 'hours', color: '#0EA5E9' },
              { label: 'Investment cost', value: investmentHrs, unit: 'hours', color: '#EF4444' },
              { label: 'Break-even', value: breakEvenWeeks, unit: 'weeks', color: '#F59E0B' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', background: `${row.color}08`, border: `1px solid ${row.color}25`, marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink2)' }}>{row.label}</div>
                <div style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 900, color: row.color }}>{row.value}<span style={{ fontSize: '11px', fontWeight: 400, marginLeft: '4px', opacity: 0.7 }}>{row.unit}</span></div>
              </div>
            ))}

            {/* Net result */}
            <motion.div
              animate={{ background: year1NetHrs > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)', borderColor: year1NetHrs > 0 ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.3)' }}
              transition={{ duration: 0.4 }}
              style={{ padding: '16px', borderRadius: '14px', border: '1.5px solid', marginTop: '4px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: year1NetHrs > 0 ? '#22C55E' : '#EF4444', letterSpacing: '0.14em', marginBottom: '8px' }}>
                {year1NetHrs > 0 ? '✓ YEAR 1 NET CAPACITY GAIN' : '⚠ ROI NEGATIVE IN YEAR 1'}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '32px', fontWeight: 900, color: year1NetHrs > 0 ? '#22C55E' : '#EF4444', lineHeight: 1 }}>
                {year1NetHrs > 0 ? '+' : ''}{Math.abs(year1NetHrs)} hrs
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '6px' }}>
                ≈ ${Math.abs(year1NetCost).toLocaleString()} {year1NetHrs > 0 ? 'recovered' : 'net cost in year 1'}
              </div>
              {year1NetHrs <= 0 && (
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#EF4444', fontWeight: 600 }}>
                  Reduce investment weeks or increase shipping cadence to show positive ROI.
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#F97316' }}>How to pitch it:</strong> lead with break-even week (usually week 8–14 for a typical product team). Rohan doesn&apos;t need to believe in design systems — he needs to see when it pays back. Numbers do what arguments cannot.
      </div>
    </div>
  );
}

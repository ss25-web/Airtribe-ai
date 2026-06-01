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

// ─── MicrocopyLab — REAL copy-writing sandbox ─────────────────────────────
// The learner WRITES the button copy themselves in a real textarea, plus an
// optional sub-text line. A deterministic linter scores their text on 4 PM
// signals — verb (present-continuous), task-specific noun (their content,
// not the system's), progress indicator, time/duration. The signals feed a
// real abandonment-prediction formula derived from the four canonical copy
// tiers (78% → 62% → 41% → 12%). Goal: write copy that drops predicted
// abandonment under 20%. Compare against the 4 preset tiers via "load preset".
export function MicrocopyLab() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const [buttonText, setButtonText] = useState('Submit');
  const [subText, setSubText]       = useState('');

  // Real linter — 4 PM signals
  const verbRe   = /\b(analyz|extract|process|generat|sync|load|render|comput|fetch|upload|transcrib|index)(e|ing)?\b/i;
  const nounRe   = /\b(recording|coaching moment|session|file|video|moment|insight|transcript|conversation)s?\b/i;
  const progRe   = /\b(\d{1,3}\s*%|progress|complete|done|of\s*\d|step\s*\d)/i;
  const timeRe   = /(\b\d+\s*(sec|second|min|minute|s\b|m\b))|(\b~?\d+\s*s\b)|(remaining|left|eta)/i;
  const combined = `${buttonText}\n${subText}`;
  const hasVerb  = verbRe.test(combined);
  const hasNoun  = nounRe.test(combined);
  const hasProg  = progRe.test(combined);
  const hasTime  = timeRe.test(combined);
  const score    = (hasVerb?1:0)+(hasNoun?1:0)+(hasProg?1:0)+(hasTime?1:0);
  // Predicted abandonment = 78% baseline, each signal halves the gap to 12%
  const predictedAbandon = (() => {
    const tiers = [78, 62, 41, 22, 12];
    return tiers[score];
  })();
  const waitSec = (() => {
    const tiers = [8, 14, 22, 33, 45];
    return tiers[score];
  })();
  const tierColor = score === 0 ? '#EF4444' : score === 1 ? '#F59E0B' : score === 2 ? '#F97316' : score === 3 ? '#10B981' : '#22C55E';

  const loadPreset = (preset: string) => {
    const opt = COPY_OPTIONS.find(o => o.id === preset)!;
    setButtonText(opt.buttonText);
    setSubText(opt.subText ?? '');
  };
  const replay = () => { setButtonText('Submit'); setSubText(''); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <LawBadge law="MICROCOPY IS A PM DECISION" color="#6366F1" dark="#3730A3" />
      <VizLabel>Write the loading-state copy yourself. The linter scores it. The model predicts abandonment.</VizLabel>

      <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
        {/* Preset chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid var(--ed-rule)' }}>
          {COPY_OPTIONS.map((o, i) => (
            <button key={o.id} onClick={() => loadPreset(o.id)}
              style={{
                padding: '10px 8px', border: 'none', cursor: 'pointer',
                background: buttonText === o.buttonText ? o.color : 'var(--ed-card)',
                borderRight: i < 3 ? '1px solid var(--ed-rule)' : 'none',
                color: buttonText === o.buttonText ? '#fff' : 'var(--ed-ink2)',
                fontFamily: 'inherit',
              }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 800, letterSpacing: '0.14em', color: buttonText === o.buttonText ? 'rgba(255,255,255,0.75)' : 'var(--ed-ink3)', marginBottom: 4 }}>PRESET {i + 1}</div>
              <div style={{ fontSize: 10.5, lineHeight: 1.3, color: 'inherit' }}>{o.label.replace(/\(.*?\)/, '').trim()}</div>
            </button>
          ))}
        </div>

        {/* Editor + preview */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr' }}>
          {/* Button preview */}
          <div style={{ padding: '32px 22px', borderRight: '1px solid var(--ed-rule)', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 12, background: 'linear-gradient(160deg, #F8F6F1 0%, #EFECE6 100%)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 800, color: tierColor, letterSpacing: '0.14em', marginBottom: 4 }}>YOUR COPY · LIVE</div>
            <div style={{ width: 210, padding: '12px 18px', borderRadius: 10, background: '#1F2937', textAlign: 'center' as const, boxShadow: '0 4px 0 #111827, 0 6px 16px rgba(0,0,0,0.25)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: subText ? 6 : 0, minHeight: 16 }}>{buttonText || <span style={{ opacity: 0.4 }}>(empty)</span>}</div>
              {subText && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace' }}>{subText}</div>}
            </div>
            {/* Predicted stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', marginTop: 8 }}>
              <div style={{ padding: 10, borderRadius: 10, background: `${tierColor}12`, border: `1.5px solid ${tierColor}35`, textAlign: 'center' as const }}>
                <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 900, color: tierColor, lineHeight: 1 }}>{predictedAbandon}%</div>
                <div style={{ fontSize: 9, color: 'var(--ed-ink3)', marginTop: 3 }}>predicted abandon</div>
              </div>
              <div style={{ padding: 10, borderRadius: 10, background: `${tierColor}12`, border: `1.5px solid ${tierColor}35`, textAlign: 'center' as const }}>
                <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 900, color: tierColor, lineHeight: 1 }}>{waitSec}s</div>
                <div style={{ fontSize: 9, color: 'var(--ed-ink3)', marginTop: 3 }}>median wait</div>
              </div>
            </div>
          </div>

          {/* Editor + linter */}
          <div style={{ padding: 22 }}>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: 5 }}>BUTTON COPY · editable</div>
              <input
                value={buttonText}
                onChange={e => setButtonText(e.target.value)}
                spellCheck={false}
                placeholder='e.g. "Extracting coaching moments…"'
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '8px 12px',
                  background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: 8,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--ed-ink)', outline: 'none',
                }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: 5 }}>SUB-TEXT · optional</div>
              <input
                value={subText}
                onChange={e => setSubText(e.target.value)}
                spellCheck={false}
                placeholder='e.g. "~38 seconds · 60% complete"'
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '8px 12px',
                  background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: 8,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ed-ink)', outline: 'none',
                }}
              />
            </div>

            {/* Linter */}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: 6 }}>LINTER · {score}/4 signals</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5, marginBottom: 12 }}>
              {([
                ['Action verb',     hasVerb, '"analyzing", "extracting", "processing"'],
                ['Specific noun',   hasNoun, '"your recording", "coaching moments"'],
                ['Progress signal', hasProg, '"60% complete" / "step 2 of 3"'],
                ['Time expectation',hasTime, '"~38 seconds" / "remaining"'],
              ] as const).map(([label, on, hint]) => (
                <span key={label} title={hint} style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700,
                  padding: '3px 8px', borderRadius: 4,
                  background: on ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.06)',
                  color: on ? '#15803D' : '#B23F22',
                  border: `1px solid ${on ? 'rgba(34,197,94,0.30)' : 'rgba(239,68,68,0.24)'}`,
                }}>{on ? '✓' : '✗'} {label}</span>
              ))}
            </div>

            {/* Verdict */}
            <div style={{ padding: '11px 14px', borderRadius: 10, background: `${tierColor}10`, border: `1.5px solid ${tierColor}30`, borderLeft: `4px solid ${tierColor}`, fontSize: 13, color: 'var(--ed-ink)', lineHeight: 1.6 }}>
              {score === 4 ? <><strong style={{ color: tierColor }}>Ship it.</strong> Verb · noun · progress · time. 12% abandon — at parity with EdSpark&apos;s shipped copy.</> :
               score === 3 ? <><strong style={{ color: tierColor }}>Close.</strong> One more signal — add {!hasTime ? 'a time estimate' : !hasProg ? 'a progress indicator' : !hasNoun ? 'a specific noun' : 'an action verb'} for the remaining drop.</> :
               score === 2 ? <><strong style={{ color: tierColor }}>Halfway.</strong> Users know <i>something</i> is happening — not <i>what</i> or <i>how long</i>.</> :
               score === 1 ? <><strong style={{ color: tierColor }}>Weak.</strong> Generic processing copy. Better than nothing — but not by much.</> :
               <><strong style={{ color: tierColor }}>Silent.</strong> &ldquo;{buttonText || '(empty)'}&rdquo; tells the user nothing. 78% bail.</>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, padding: '12px 18px', borderRadius: 12, background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 13, color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>PM ownership:</strong> the spec must name the copy for every state — not just the success state. &ldquo;The button should say something useful&rdquo; is not a spec. &ldquo;Loading: &lsquo;Extracting coaching moments…&rsquo; + % complete&rdquo; is.
      </div>
      {inView && <ReplayBtn onReplay={replay} />}
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

// ─── StateSpecBuilder — REAL per-state spec-writing sandbox ──────────────
// One textarea per state (loading · empty · error · success · edge). A
// deterministic linter scores each spec on 3 signals: visible UI (what the
// user sees), next-action (the CTA / recovery path), and triggering signal
// (timing / quantity / data condition). Each state's tab shows pass / partial /
// fail at a glance. Goal: 5 tabs × 3 signals = 15/15. The completeness
// principle "every screen has 5 states" emerges from the score, not narration.
type StateSig = { hasVisible: boolean; hasAction: boolean; hasTrigger: boolean };
const STATE_LINTERS: Record<string, (text: string) => StateSig> = {
  loading: (t) => ({
    hasVisible: /progress|spinner|bar|extracting|analyz|processing|"/i.test(t),
    hasAction:  /\bcancel\b|remain|background|notify|email|wait/i.test(t),
    hasTrigger: /\bupload\b|file|started|invoked|on submit|after/i.test(t),
  }),
  empty: (t) => ({
    hasVisible: /headline|illustration|placeholder|empty|"/i.test(t),
    hasAction:  /cta|upload|get started|create|button|click|tap/i.test(t),
    hasTrigger: /first[-\s]?time|new user|no \w+ yet|0\s*(items?|recordings?)|never/i.test(t),
  }),
  error: (t) => ({
    hasVisible: /headline|message|copy|"|error|fail/i.test(t),
    hasAction:  /retry|reconnect|contact|settings|recover|saved|preserved/i.test(t),
    hasTrigger: /(\d{3}|expired|disconnect|timeout|fail(ed|ure)?|when|if)/i.test(t),
  }),
  success: (t) => ({
    hasVisible: /headline|"|summary|illustration|found|moments?|insights?/i.test(t),
    hasAction:  /view|next|cta|button|→|continue|see|review/i.test(t),
    hasTrigger: /complete|finished|processed|done|after \w+ finish/i.test(t),
  }),
  edge: (t) => ({
    hasVisible: /warning|alert|banner|"|validation/i.test(t),
    hasAction:  /email|background|alternative|option|skip|defer|notify/i.test(t),
    hasTrigger: /\d+\s*(gb|mb|files?|items?|minutes?|hours?)|limit|exceeds?|over|large/i.test(t),
  }),
};

export function StateSpecBuilder() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [active, setActive] = useState(0);
  const [specs, setSpecs] = useState<string[]>(['', '', '', '', '']);
  const [tick, setTick] = useState(0);

  useEffect(() => { if (inView) { setActive(0); } }, [inView, tick]);
  const replay = () => { setSpecs(['', '', '', '', '']); setActive(0); setTick(t => t + 1); };

  const s = STATES_SPEC[active];
  const myText = specs[active];

  const sigs = STATE_LINTERS[s.id](myText);
  const stateScore = (sigs.hasVisible?1:0) + (sigs.hasAction?1:0) + (sigs.hasTrigger?1:0);
  const stateDone = stateScore === 3;
  const completeStates = specs.reduce((n, txt, i) => {
    const lin = STATE_LINTERS[STATES_SPEC[i].id](txt);
    return n + ((lin.hasVisible && lin.hasAction && lin.hasTrigger) ? 1 : 0);
  }, 0);
  const totalScore = specs.reduce((n, txt, i) => {
    const lin = STATE_LINTERS[STATES_SPEC[i].id](txt);
    return n + (lin.hasVisible?1:0) + (lin.hasAction?1:0) + (lin.hasTrigger?1:0);
  }, 0);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <LawBadge law="SPEC COMPLETENESS" color="#0EA5E9" dark="#0369A1" />
      <VizLabel>Every screen has 5 states. Write the spec for each. The linter scores each on 3 signals.</VizLabel>

      <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
        {/* Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', borderBottom: '1px solid var(--ed-rule)' }}>
          {STATES_SPEC.map((st, i) => {
            const isAct = active === i;
            const lin = STATE_LINTERS[st.id](specs[i]);
            const tabScore = (lin.hasVisible?1:0) + (lin.hasAction?1:0) + (lin.hasTrigger?1:0);
            const done = tabScore === 3;
            return (
              <button key={st.id} onClick={() => setActive(i)}
                style={{
                  padding: '12px 6px', border: 'none', cursor: 'pointer',
                  background: isAct ? `linear-gradient(135deg, ${st.color} 0%, ${st.dark} 100%)` : done ? `${st.color}10` : 'var(--ed-card)',
                  borderRight: i < 4 ? '1px solid var(--ed-rule)' : 'none', transition: 'background 0.3s',
                  fontFamily: 'inherit',
                }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{done ? '✓' : st.icon}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 800, letterSpacing: '0.1em', color: isAct ? '#fff' : done ? st.color : 'var(--ed-ink3)' }}>
                  {st.label.toUpperCase()}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: isAct ? 'rgba(255,255,255,0.6)' : 'var(--ed-ink3)', marginTop: 2 }}>{tabScore}/3</div>
              </button>
            );
          })}
        </div>

        {/* Active state */}
        <div style={{ padding: '24px 22px', background: 'var(--ed-card)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 800, color: s.color, letterSpacing: '0.14em', marginBottom: 10 }}>
            {s.icon} {s.label.toUpperCase()} STATE — EDSPARK UPLOAD FLOW
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ed-ink)', marginBottom: 14, lineHeight: 1.45 }}>{s.question}</div>

          {/* Editor */}
          <div style={{ marginBottom: 12 }}>
            <textarea
              value={myText}
              onChange={e => setSpecs(prev => prev.map((t, i) => i === active ? e.target.value : t))}
              spellCheck={false}
              placeholder={`Write your spec for the ${s.label.toLowerCase()} state…`}
              style={{
                width: '100%', boxSizing: 'border-box', minHeight: 110, resize: 'vertical' as const,
                padding: '12px 14px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)',
                borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5,
                color: 'var(--ed-ink)', lineHeight: 1.7, outline: 'none',
              }}
            />
          </div>

          {/* Linter strip */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const, marginBottom: 14 }}>
            {([
              ['Visible UI',     sigs.hasVisible, 'what the user sees · headline / copy / illustration'],
              ['Next action',    sigs.hasAction,  'CTA · recovery path · cancel · retry'],
              ['Trigger named',  sigs.hasTrigger, 'when this state fires · timing / quantity / condition'],
            ] as const).map(([label, on, hint]) => (
              <span key={label} title={hint} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700,
                padding: '3px 9px', borderRadius: 4,
                background: on ? `${s.color}15` : 'rgba(239,68,68,0.06)',
                color: on ? s.dark : '#B23F22',
                border: `1px solid ${on ? `${s.color}50` : 'rgba(239,68,68,0.25)'}`,
              }}>{on ? '✓' : '✗'} {label}</span>
            ))}
          </div>

          {/* Per-state verdict + reveal canonical */}
          <details style={{ marginBottom: 14, background: 'rgba(0,0,0,0.02)', border: '1px solid var(--ed-rule)', borderRadius: 10, padding: '8px 12px' }}>
            <summary style={{ cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ed-ink3)', letterSpacing: '0.14em', fontWeight: 700 }}>show canonical spec (peek if stuck)</summary>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ed-ink2)', lineHeight: 1.65 }}>
              <span style={{ color: s.color, fontWeight: 700 }}>Canonical: </span>{s.good}
            </div>
          </details>

          {/* State-level callout */}
          <div style={{ padding: '11px 14px', borderRadius: 10, background: stateDone ? `${s.color}10` : 'rgba(239,68,68,0.07)', border: `1px solid ${stateDone ? `${s.color}40` : 'rgba(239,68,68,0.2)'}`, fontSize: 12, color: 'var(--ed-ink2)', lineHeight: 1.6 }}>
            {stateDone ? (
              <><strong style={{ color: s.color }}>✓ Spec ships.</strong> Engineer has no decisions to ad-lib for this state.</>
            ) : (
              <><strong style={{ color: '#B23F22' }}>If shipped as-is:</strong> {s.consequence}</>
            )}
          </div>

          {/* Footer nav */}
          <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {STATES_SPEC.map((st, i) => {
                const lin = STATE_LINTERS[st.id](specs[i]);
                const tabDone = lin.hasVisible && lin.hasAction && lin.hasTrigger;
                return (
                  <div key={st.id} style={{ width: 9, height: 9, borderRadius: '50%', background: tabDone ? st.color : 'var(--ed-rule)' }} />
                );
              })}
            </div>
            {active < STATES_SPEC.length - 1 ? (
              <button onClick={() => setActive(active + 1)} style={{ appearance: 'none', cursor: 'pointer', padding: '8px 18px', borderRadius: 10, background: `linear-gradient(160deg, ${STATES_SPEC[active + 1].color} 0%, ${STATES_SPEC[active + 1].dark} 100%)`, color: '#fff', border: 'none', fontWeight: 800, fontSize: 12, fontFamily: 'inherit' }}>
                Next: {STATES_SPEC[active + 1].label} →
              </button>
            ) : (
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ed-ink3)' }}>{completeStates}/5 states ship-ready · {totalScore}/15 signals</div>
            )}
          </div>

          {completeStates === 5 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 14, padding: '14px 18px', borderRadius: 14, background: 'rgba(34,197,94,0.08)', border: '1.5px solid rgba(34,197,94,0.3)', fontSize: 13, fontWeight: 700, color: '#15803D', lineHeight: 1.6 }}>
              ✓ Spec complete · 5 states · 15/15 signals. This is what PM ownership of UX looks like.
            </motion.div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, padding: '12px 18px', borderRadius: 12, background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.2)', fontSize: 13, color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#0EA5E9' }}>The checklist:</strong> for every screen — Loading, Empty, Error, Success, Edge. If you cannot write all five, the spec is incomplete and engineers will make decisions you should have made.
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

// ─── UXDebugLoopViz — REAL diagnostic-loop sandbox ───────────────────────
// The learner runs Priya's UX debug loop on a NEW problem: post-fix, 42% of
// users still leave. At each step (Observe → Hypothesize → Test → Measure)
// the learner makes a real choice between 3 candidates. Only one matches
// the loop discipline: ground in observation, narrow the hypothesis, ship
// the smallest test, measure the right thing. Picking the wrong candidate
// is the pedagogy — the loop fails when PMs leap to redesign at step 2,
// or measure vanity metrics at step 4. Each step's verdict is real.
type StepChoice = { id: string; label: string; verdict: 'correct' | 'leap' | 'vanity'; rationale: string };
const STEP_CHOICES: { step: number; question: string; choices: StepChoice[] }[] = [
  {
    step: 0,
    question: 'You shipped the loading-state fix. 42% still leave. What do you do first?',
    choices: [
      { id: 'o-redesign', label: 'Propose a full onboarding redesign',                                                              verdict: 'leap',    rationale: 'Skipping observation — you don\'t know what those 42% are experiencing yet. This is exactly the redesign-instead-of-diagnose trap.' },
      { id: 'o-watch',    label: 'Watch 10 new session recordings of users in the 42% bucket',                                       verdict: 'correct', rationale: 'Observe before hypothesise. The 42% have their own story — you have to see it before you guess.' },
      { id: 'o-survey',   label: 'Send an NPS survey to every user who didn\'t complete',                                             verdict: 'vanity',  rationale: 'NPS averages the loud minority and the silent majority into a number that hides the cause. Sessions show behaviour.' },
    ],
  },
  {
    step: 1,
    question: 'Observation: many in the 42% bucket pause at the upload screen for 30s+ before clicking. What\'s the testable hypothesis?',
    choices: [
      { id: 'h-broad',  label: '"Upload UX is bad — needs full redesign."',                                                          verdict: 'leap',    rationale: 'Untestable. No specific cause, no specific fix, no specific metric. This is a brief, not a hypothesis.' },
      { id: 'h-precise',label: '"If we add file-format hints on the upload zone, drop-off at upload falls from 42% to <30%."',       verdict: 'correct', rationale: 'Cause (uncertainty about format) · fix (hints) · metric (upload drop-off) · threshold (<30%). Testable.' },
      { id: 'h-feel',   label: '"The upload screen needs to feel more welcoming."',                                                  verdict: 'vanity',  rationale: '"Feel" isn\'t measurable. You can\'t run this test or know if it worked.' },
    ],
  },
  {
    step: 2,
    question: 'Maya has bandwidth for ONE thing this sprint. Which is the smallest test?',
    choices: [
      { id: 't-mvp',     label: 'Add one line of supported-format hint text under the upload zone',                                  verdict: 'correct', rationale: 'Smallest possible spec change. Tests the hypothesis without a redesign. Ship today, measure tomorrow.' },
      { id: 't-overhaul',label: 'Redesign the upload zone with drag-and-drop animations, progress, and tooltips',                    verdict: 'leap',    rationale: 'Tests four things at once. If it works, you don\'t know which change moved the metric.' },
      { id: 't-onboard', label: 'Add a full onboarding tour explaining every step',                                                  verdict: 'vanity',  rationale: 'Adds friction at the moment of action. Tour completion will look good but upload conversion may drop.' },
    ],
  },
  {
    step: 3,
    question: 'A week later. What\'s the most honest measurement?',
    choices: [
      { id: 'm-vanity',  label: 'NPS rose from 32 to 38 — ship and move on.',                                                        verdict: 'vanity',  rationale: 'NPS doesn\'t tell you whether THIS change worked. You measured a vibe, not the hypothesis.' },
      { id: 'm-honest',  label: 'Upload drop-off: 42% → 26%. Hypothesis confirmed. New gap is now adjudication — re-Observe.',         verdict: 'correct', rationale: 'You measured the specific metric named in step 2, and the remaining gap opens the next Observe step. Loop continues.' },
      { id: 'm-conclude',label: 'Completion is now 71%. Done — close the project.',                                                  verdict: 'leap',    rationale: 'Stopping early. The remaining 29% are the next diagnostic, not a finish line.' },
    ],
  },
];
type Picked = (string | null)[];

export function UXDebugLoopViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [active, setActive] = useState(0);
  const [picks, setPicks] = useState<Picked>([null, null, null, null]);
  const [tick, setTick] = useState(0);
  useEffect(() => { if (inView) setActive(0); }, [inView, tick]);
  const replay = () => { setPicks([null, null, null, null]); setActive(0); setTick(t => t + 1); };

  const step = DEBUG_LOOP[active];
  const choices = STEP_CHOICES[active];
  const myPick = picks[active];
  const myChoice = myPick ? choices.choices.find(c => c.id === myPick) : null;
  const stepDone = myPick && myChoice?.verdict === 'correct';
  const correctCount = picks.filter((p, i) => p && STEP_CHOICES[i].choices.find(c => c.id === p)?.verdict === 'correct').length;

  const pick = (id: string) => setPicks(prev => prev.map((p, i) => i === active ? id : p));

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <LawBadge law="THE UX DEBUG LOOP" color="#22C55E" dark="#15803D" />
      <VizLabel>Post-fix, 42% still leave. Run the loop yourself — Observe → Hypothesize → Test → Measure.</VizLabel>

      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Step nav */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {DEBUG_LOOP.map((s, i) => {
            const isAct = active === i;
            const myP = picks[i];
            const myC = myP ? STEP_CHOICES[i].choices.find(c => c.id === myP) : null;
            const done = myC?.verdict === 'correct';
            const wrong = myC && myC.verdict !== 'correct';
            return (
              <div key={s.step} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center' }}>
                <button onClick={() => setActive(i)} style={{
                  width: '100%', padding: '12px 14px', borderRadius: 14,
                  background: isAct ? s.color : done ? `${s.color}18` : wrong ? 'rgba(239,68,68,0.08)' : 'var(--ed-card)',
                  border: `1.5px solid ${isAct ? s.color : done ? `${s.color}40` : wrong ? 'rgba(239,68,68,0.3)' : 'var(--ed-rule)'}`,
                  cursor: 'pointer', textAlign: 'left' as const,
                  boxShadow: isAct ? `0 4px 0 ${s.dark}, 0 8px 20px ${s.color}40` : 'none',
                  fontFamily: 'inherit',
                }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{done ? '✓' : wrong ? '✗' : s.icon}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 800, color: isAct ? '#fff' : done ? s.color : wrong ? '#B23F22' : 'var(--ed-ink3)', letterSpacing: '0.1em' }}>
                    {s.step}. {s.label.toUpperCase()}
                  </div>
                </button>
                {i < DEBUG_LOOP.length - 1 && (
                  <div style={{ width: 2, height: 10, background: done ? s.color : 'var(--ed-rule)', margin: '2px 0' }} />
                )}
              </div>
            );
          })}
          <div style={{ marginTop: 6, padding: '8px 12px', borderRadius: 10, background: 'rgba(99,102,241,0.07)', border: '1px dashed rgba(99,102,241,0.3)', textAlign: 'center' as const }}>
            <div style={{ fontSize: 10, color: '#6366F1', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>↺ loops every sprint</div>
          </div>
        </div>

        {/* Story card */}
        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: `0 16px 40px ${step.color}20` }}>
          <div style={{ padding: '18px 22px', background: `linear-gradient(135deg, ${step.color} 0%, ${step.dark} 100%)` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.18em', marginBottom: 6 }}>
              STEP {step.step} OF 4 — {step.label.toUpperCase()}
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.4 }}>{choices.question}</div>
          </div>
          <div style={{ background: 'var(--ed-card)', padding: '18px 22px' }}>
            {/* Choices */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, marginBottom: 14 }}>
              {choices.choices.map(c => {
                const isPicked = myPick === c.id;
                const colour = c.verdict === 'correct' ? '#22C55E' : c.verdict === 'leap' ? '#EF4444' : '#F59E0B';
                return (
                  <button key={c.id} onClick={() => pick(c.id)} disabled={!!myPick && !isPicked} style={{
                    appearance: 'none', cursor: !!myPick && !isPicked ? 'default' : 'pointer',
                    textAlign: 'left' as const, padding: '11px 14px', borderRadius: 10,
                    background: isPicked ? `${colour}12` : !!myPick ? 'rgba(0,0,0,0.02)' : 'var(--ed-card)',
                    border: `1.5px solid ${isPicked ? colour : 'var(--ed-rule)'}`,
                    fontSize: 13, color: isPicked ? 'var(--ed-ink)' : !!myPick && !isPicked ? 'var(--ed-ink3)' : 'var(--ed-ink2)',
                    lineHeight: 1.55, fontFamily: 'inherit',
                  }}>
                    {c.label}
                  </button>
                );
              })}
            </div>
            {/* Verdict */}
            {myChoice && (
              <div style={{ padding: '12px 14px', borderRadius: 10, background: myChoice.verdict === 'correct' ? `${step.color}10` : 'rgba(239,68,68,0.07)', border: `1.5px solid ${myChoice.verdict === 'correct' ? `${step.color}40` : 'rgba(239,68,68,0.25)'}`, borderLeft: `4px solid ${myChoice.verdict === 'correct' ? step.color : '#EF4444'}` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 800, color: myChoice.verdict === 'correct' ? step.color : '#B23F22', letterSpacing: '0.14em', marginBottom: 6 }}>
                  {myChoice.verdict === 'correct' ? '✓ ON-LOOP' : myChoice.verdict === 'leap' ? '✗ LEAP — SKIPPED A STEP' : '⚠ VANITY METRIC / SOFT GOAL'}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--ed-ink)', lineHeight: 1.6 }}>{myChoice.rationale}</div>
              </div>
            )}
            {/* Footer */}
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: 'var(--ed-ink3)' }}>{correctCount}/4 steps on-loop</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {active > 0 && <button onClick={() => setActive(active - 1)} style={{ appearance: 'none', cursor: 'pointer', padding: '6px 14px', borderRadius: 8, background: 'transparent', border: '1px solid var(--ed-rule)', fontSize: 11, color: 'var(--ed-ink3)', fontFamily: 'inherit' }}>← prev</button>}
                {active < DEBUG_LOOP.length - 1 && (
                  <button onClick={() => setActive(active + 1)} disabled={!stepDone}
                    style={{ appearance: 'none', cursor: stepDone ? 'pointer' : 'not-allowed', padding: '6px 16px', borderRadius: 8, background: stepDone ? `linear-gradient(160deg, ${DEBUG_LOOP[active + 1].color} 0%, ${DEBUG_LOOP[active + 1].dark} 100%)` : 'var(--ed-rule)', color: stepDone ? '#fff' : 'var(--ed-ink3)', border: 'none', fontSize: 12, fontWeight: 800, fontFamily: 'inherit' }}>
                    Next: {DEBUG_LOOP[active + 1].label} →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: '12px 18px', borderRadius: 12, background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', fontSize: 13, color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#22C55E' }}>The loop never stops:</strong> the 26% who still leave after the upload-hint fix are the next Observe step. PMs who stop at &ldquo;we shipped the fix&rdquo; miss the loop entirely.
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

// ─── WIREFRAME PROGRESSION ────────────────────────────────────────────────────
// Wireframes go from rough sketch → low-fi → high-fi. Each level serves a
// different purpose at a different stage. PMs need to know which level to
// request — and why asking for high-fi too early wastes everyone's time.

const WIREFRAME_LEVELS = [
  {
    level: 'Sketch', fidelity: 'Lo-fi', time: '5 minutes', color: '#94A3B8', dark: '#64748B',
    purpose: 'Align on layout and structure before any design work starts.',
    when: 'First conversation with design. "Does the structure make sense?" not "Does it look right?"',
    elements: ['Boxes for content areas', 'Placeholder text', 'Basic layout', 'No colours or fonts'],
    mistake: 'Asking for a high-fi mockup when you haven\'t agreed on the layout yet. Designers spend 3 hours on something you\'ll restructure.',
  },
  {
    level: 'Wireframe', fidelity: 'Mid-fi', time: '30 minutes – 2 hours', color: '#6366F1', dark: '#3730A3',
    purpose: 'Test user flows and information hierarchy without visual distraction.',
    when: 'User testing, stakeholder reviews, developer handoff planning. You\'re testing the structure, not the aesthetics.',
    elements: ['Real content (not lorem ipsum)', 'Interaction states (hover, click)', 'Navigation flows', 'No brand colours'],
    mistake: 'Using wireframes to get stakeholder approval on visual design. Grey boxes don\'t convey emotional response — use wireframes for structural decisions only.',
  },
  {
    level: 'Mockup', fidelity: 'Hi-fi', time: '1–3 days', color: '#22C55E', dark: '#15803D',
    purpose: 'Communicate the intended visual design for build sign-off and developer handoff.',
    when: 'Structure is agreed. You\'re approving how it looks and feels, not what it does.',
    elements: ['Brand colours and typography', 'All states (loading, error, empty)', 'Real images / content', 'Pixel-accurate spacing'],
    mistake: 'Requesting hi-fi for every exploratory idea. Each hi-fi mockup takes 3× longer than a wireframe. Explore in lo-fi, commit in hi-fi.',
  },
];

export function WireframeProgressionViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0); setActive(0);
    WIREFRAME_LEVELS.forEach((_, i) => setTimeout(() => setVisible(i + 1), 400 + i * 700));
    const iv = setInterval(() => setActive(a => (a + 1) % WIREFRAME_LEVELS.length), 4000);
    return () => clearInterval(iv);
  }, [inView, tick]);

  const replay = () => { setVisible(0); setTick(t => t + 1); };
  const sel = WIREFRAME_LEVELS[active];

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Wireframe fidelity — request the right level at the right stage</VizLabel>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {WIREFRAME_LEVELS.map((w, i) => {
          const show = i < visible;
          const isAct = active === i;
          return (
            <AnimatePresence key={w.level}>
              {show && (
                <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  onClick={() => setActive(i)}
                  style={{ padding: '0', border: 'none', cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', boxShadow: isAct ? `0 6px 0 ${w.dark}, 0 10px 24px ${w.color}40` : '0 3px 10px rgba(0,0,0,0.07)', transition: 'box-shadow 0.3s' }}>
                  {/* Visual preview */}
                  <div style={{ padding: '20px', background: isAct ? `linear-gradient(160deg, ${w.color}EE 0%, ${w.dark} 100%)` : 'linear-gradient(160deg, #F8F6F1 0%, #EFECE6 100%)', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '6px' }}>
                    {i === 0 && (
                      <svg width="80" height="60" viewBox="0 0 80 60">
                        <rect x="4" y="4" width="72" height="12" rx="2" fill={isAct ? 'rgba(255,255,255,0.3)' : '#CBD5E1'} />
                        <rect x="4" y="22" width="44" height="8" rx="2" fill={isAct ? 'rgba(255,255,255,0.2)' : '#CBD5E1'} />
                        <rect x="4" y="34" width="72" height="20" rx="2" fill={isAct ? 'rgba(255,255,255,0.15)' : '#E2E8F0'} />
                        <text x="40" y="47" textAnchor="middle" style={{ fontSize: '7px', fill: isAct ? 'rgba(255,255,255,0.5)' : '#94A3B8' }}>content area</text>
                      </svg>
                    )}
                    {i === 1 && (
                      <svg width="80" height="60" viewBox="0 0 80 60">
                        <rect x="4" y="4" width="72" height="10" rx="2" fill={isAct ? 'rgba(255,255,255,0.3)' : '#94A3B8'} />
                        <text x="8" y="12" style={{ fontSize: '5px', fill: isAct ? 'rgba(255,255,255,0.8)' : '#374151', fontWeight: 700 }}>Search recordings</text>
                        <rect x="4" y="18" width="72" height="6" rx="2" fill={isAct ? 'rgba(255,255,255,0.15)' : '#CBD5E1'} />
                        <rect x="4" y="28" width="72" height="6" rx="2" fill={isAct ? 'rgba(255,255,255,0.15)' : '#CBD5E1'} />
                        <rect x="4" y="38" width="72" height="6" rx="2" fill={isAct ? 'rgba(255,255,255,0.15)' : '#CBD5E1'} />
                        <rect x="4" y="50" width="28" height="8" rx="3" fill={isAct ? 'rgba(255,255,255,0.35)' : '#6366F1'} />
                        <text x="18" y="56" textAnchor="middle" style={{ fontSize: '5px', fill: '#fff', fontWeight: 700 }}>Search</text>
                      </svg>
                    )}
                    {i === 2 && (
                      <svg width="80" height="60" viewBox="0 0 80 60">
                        <rect x="0" y="0" width="80" height="12" rx="0" fill={isAct ? 'rgba(255,255,255,0.25)' : '#1F2937'} />
                        <text x="8" y="9" style={{ fontSize: '5px', fill: isAct ? 'rgba(255,255,255,0.9)' : '#fff', fontWeight: 700 }}>EdSpark</text>
                        <rect x="4" y="16" width="72" height="7" rx="4" fill={isAct ? 'rgba(255,255,255,0.2)' : '#E5E7EB'} />
                        <rect x="4" y="28" width="34" height="22" rx="6" fill={isAct ? 'rgba(255,255,255,0.15)' : '#F3F4F6'} />
                        <rect x="42" y="28" width="34" height="22" rx="6" fill={isAct ? 'rgba(255,255,255,0.15)' : '#F3F4F6'} />
                        <rect x="24" y="53" width="32" height="6" rx="3" fill={isAct ? 'rgba(255,255,255,0.35)' : '#6366F1'} />
                        <text x="40" y="58" textAnchor="middle" style={{ fontSize: '4px', fill: '#fff', fontWeight: 700 }}>Search recordings</text>
                      </svg>
                    )}
                  </div>
                  <div style={{ padding: '12px 14px', background: 'var(--ed-card)', textAlign: 'left' as const }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: w.color, letterSpacing: '0.12em', marginBottom: '3px' }}>{w.fidelity}</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ed-ink)' }}>{w.level}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', marginTop: '2px' }}>{w.time}</div>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.level} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
            style={{ padding: '20px', borderRadius: '16px', background: `${sel.color}0D`, border: `1.5px solid ${sel.color}30`, borderLeft: `4px solid ${sel.color}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: sel.color, letterSpacing: '0.12em', marginBottom: '6px' }}>WHEN TO USE</div>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink)', lineHeight: 1.65 }}>{sel.when}</div>
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: sel.color, letterSpacing: '0.12em', marginBottom: '6px' }}>INCLUDES</div>
                {sel.elements.map((e, ei) => <div key={ei} style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.55 }}>· {e}</div>)}
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#EF4444', letterSpacing: '0.12em', marginBottom: '6px' }}>COMMON MISTAKE</div>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{sel.mistake}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>PM rule:</strong> explore in lo-fi, commit in hi-fi. Every hi-fi mockup requested before the structure is agreed adds 3× the time and creates attachment to an approach that might be wrong.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── STORYBOARD VIZ ───────────────────────────────────────────────────────────
// Storyboards communicate user journeys — not just screens. A storyboard shows
// the before/during/after of a user experience, forcing the PM to think about
// context, emotion, and outcome — not just interface states.

const STORYBOARD_PANELS = [
  {
    frame: 1, scene: 'Monday morning', icon: '☀️', color: '#F59E0B',
    situation: 'Marcus (sales manager) opens his laptop. His VP just sent a Slack: "Show me coaching ROI for this quarter\'s board deck. Need by Friday."',
    emotion: 'Stressed. He has 3 coaching sessions this week and no data to point to.',
    pmInsight: 'This is the trigger moment. EdSpark needs to be the first thing Marcus thinks of when this message arrives — not Google Sheets.',
  },
  {
    frame: 2, scene: 'Opens EdSpark', icon: '📱', color: '#6366F1',
    situation: 'Marcus opens the dashboard. He sees: team coaching score trending up, top 3 improvement areas, and a one-click "Coaching ROI report" button.',
    emotion: 'Relieved. The data is already there — organised the way his VP will ask for it.',
    pmInsight: 'The product must anticipate the job before the user articulates it. "Coaching ROI" is the job. The UI must surface it without the user having to know it exists.',
  },
  {
    frame: 3, scene: 'Reviews a session', icon: '▶️', color: '#0EA5E9',
    situation: 'Marcus clicks a recording from last week. He skips to the flagged moment: a rep who struggled with pricing objections. He leaves a timestamped comment: "Use the 3-year ROI calculation here."',
    emotion: 'Focused. This is the actual coaching work. He\'s in flow.',
    pmInsight: 'The coaching moment must be frictionless. Every click that isn\'t coaching is a reason to close the app. Timestamps, comments, flagged moments — all spec.',
  },
  {
    frame: 4, scene: 'Shares the report', icon: '📊', color: '#22C55E',
    situation: 'Marcus clicks "Generate board deck slide." EdSpark creates a one-page summary: ramp time down 28 days, top 3 call skills improved, 4 reps promoted to senior. He forwards it to his VP.',
    emotion: 'Confident. He has the data and it\'s formatted for the conversation he needs to have.',
    pmInsight: 'The output must match the actual use case — not just show data. Marcus\'s VP needs a slide, not a dashboard screenshot. The PM who specs this is the PM who thinks about the whole journey.',
  },
  {
    frame: 5, scene: 'Friday board prep', icon: '✅', color: '#F97316',
    situation: 'The VP forwards Marcus\'s one-pager to the CEO. "Coaching is working." EdSpark renewal is approved without negotiation.',
    emotion: 'Vindicated. The product didn\'t just help Marcus — it made him look good to his VP.',
    pmInsight: 'The real user outcome isn\'t "saw coaching data." It\'s "felt like a good manager who could prove it." Design for that outcome, not for the screen.',
  },
];

export function StoryboardViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0); setActive(null);
    STORYBOARD_PANELS.forEach((_, i) => setTimeout(() => setVisible(i + 1), 300 + i * 400));
    setTimeout(() => setActive(0), 300 + STORYBOARD_PANELS.length * 400 + 300);
  }, [inView, tick]);

  const replay = () => { setVisible(0); setActive(null); setTick(t => t + 1); };
  const sel = active !== null ? STORYBOARD_PANELS[active] : null;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Storyboard — communicate the user journey, not just the screens</VizLabel>

      {/* Panel strip */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto' as const, paddingBottom: '4px' }}>
        {STORYBOARD_PANELS.map((p, i) => {
          const show = i < visible;
          const isAct = active === i;
          return (
            <AnimatePresence key={p.frame}>
              {show && (
                <motion.button initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  onClick={() => setActive(isAct ? null : i)}
                  style={{ flexShrink: 0, width: '120px', padding: '0', border: 'none', cursor: 'pointer', borderRadius: '14px', overflow: 'hidden', boxShadow: isAct ? `0 5px 0 ${p.color}90, 0 8px 20px ${p.color}40` : '0 2px 8px rgba(0,0,0,0.08)', transition: 'box-shadow 0.3s' }}>
                  <div style={{ padding: '14px 12px', background: isAct ? `linear-gradient(160deg, ${p.color} 0%, ${p.color}CC 100%)` : 'linear-gradient(160deg, #F8F6F1 0%, #EFECE6 100%)', textAlign: 'center' as const }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>{p.icon}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 800, color: isAct ? 'rgba(255,255,255,0.7)' : '#94A3B8', letterSpacing: '0.1em' }}>FRAME {p.frame}</div>
                  </div>
                  <div style={{ padding: '8px 10px', background: 'var(--ed-card)' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: isAct ? p.color : 'var(--ed-ink)', lineHeight: 1.3 }}>{p.scene}</div>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* Detail */}
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.frame} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
            style={{ borderRadius: '20px', overflow: 'hidden', border: `1.5px solid ${sel.color}35`, boxShadow: `0 10px 28px ${sel.color}18` }}>
            <div style={{ padding: '16px 20px', background: `linear-gradient(135deg, ${sel.color}15 0%, ${sel.color}05 100%)`, borderBottom: `1px solid ${sel.color}20` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: sel.color, letterSpacing: '0.14em', marginBottom: '4px' }}>
                {sel.icon} FRAME {sel.frame} — {sel.scene.toUpperCase()}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--ed-card)' }}>
              {[
                { label: 'WHAT HAPPENS', text: sel.situation },
                { label: 'WHAT MARCUS FEELS', text: sel.emotion },
                { label: 'PM INSIGHT', text: sel.pmInsight, accent: true },
              ].map((col, ci) => (
                <div key={ci} style={{ padding: '16px', borderLeft: ci > 0 ? '1px solid var(--ed-rule)' : 'none' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: col.accent ? sel.color : 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '7px' }}>{col.label}</div>
                  <div style={{ fontSize: '12px', color: col.accent ? 'var(--ed-ink)' : 'var(--ed-ink2)', lineHeight: 1.7, fontWeight: col.accent ? 700 : 400 }}>{col.text}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>Storyboards over specs:</strong> a storyboard forces you to think about context (what triggered this?), emotion (how does the user feel at each step?), and outcome (what changed?). Most specs describe screens. Storyboards describe experiences.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

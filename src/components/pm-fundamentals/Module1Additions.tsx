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

// ─── 1. PRODUCT SENSE ─────────────────────────────────────────────────────────
// Product sense = the ability to form and defend opinions about what makes a
// product good vs mediocre. It's not listing features — it's making a judgment.
// 4-move framework applied to a real product: Notion vs Linear.

const PRODUCTS = [
  {
    name: 'Notion', icon: '📝', category: 'Note-taking / wiki',
    moves: [
      { label: 'The job it does', text: 'Gives knowledge workers a flexible space to capture, connect, and share thinking across teams.', verdict: null },
      { label: 'The bet they made', text: 'Flexibility over speed. The block system lets you build anything — but requires upfront effort to design your own structure.', verdict: null },
      { label: 'The trade-off', text: 'Power users love it. Beginners abandon it. The same flexibility that delights senior teams overwhelms new users who just want to take a note.', verdict: 'deliberate' },
      { label: 'My take', text: 'Good product. The trade-off is justified — Notion consciously chose the power-user audience. The onboarding gap is a known cost, not a mistake.', verdict: 'good' },
    ],
  },
  {
    name: 'Linear', icon: '⚡', category: 'Issue tracker',
    moves: [
      { label: 'The job it does', text: 'Helps engineering teams track work at the speed they actually move — without Jira friction slowing down every action.', verdict: null },
      { label: 'The bet they made', text: 'Speed and opinionation over flexibility. Linear makes decisions for you — fixed structure, keyboard-first, no customisation rabbit holes.', verdict: null },
      { label: 'The trade-off', text: 'Eng teams love it. Non-technical stakeholders struggle. The opinionation that makes devs fast creates friction when PMs or execs need visibility.', verdict: 'deliberate' },
      { label: 'My take', text: 'Great product within its lane. The bet on dev-first is right. The risk is when the company grows and non-eng teams need to see work — Linear has to solve that without betraying the bet.', verdict: 'good' },
    ],
  },
  {
    name: 'Slack', icon: '💬', category: 'Team communication',
    moves: [
      { label: 'The job it does', text: 'Replaces email for real-time team communication — conversations in context, organised by topic rather than inbox thread.', verdict: null },
      { label: 'The bet they made', text: 'Channels over email threads. The assumption: if you organise communication by topic, people will find information without asking.', verdict: null },
      { label: 'The trade-off', text: 'The bet is partially right. Channels are better than email threads — but Slack became the new notification hell. The problem it solved (email overload) moved to Slack overload.', verdict: 'partial' },
      { label: 'My take', text: 'Mediocre-to-good product. The original bet was right but the execution created a new version of the problem it solved. DMs replaced emails, and channels replaced inboxes — but the cognitive load is the same.', verdict: 'mediocre' },
    ],
  },
];

const VERDICT_STYLES: Record<string, { bg: string; border: string; color: string }> = {
  good:       { bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.3)',   color: '#22C55E' },
  mediocre:   { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.3)', color: '#F59E0B' },
  deliberate: { bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.3)', color: '#6366F1' },
  partial:    { bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.3)', color: '#F97316' },
};

export function ProductSenseViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [activeProd, setActiveProd] = useState(0);
  const [revealedMoves, setRevealedMoves] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setRevealedMoves(0);
    const delays = [600, 1600, 2800, 4000];
    const timers = delays.map((d, i) => setTimeout(() => setRevealedMoves(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, [inView, tick, activeProd]);

  const replay = () => { setRevealedMoves(0); setTick(t => t + 1); };
  const product = PRODUCTS[activeProd];

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Product sense — forming and defending opinions about what makes products good vs mediocre</VizLabel>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {PRODUCTS.map((p, i) => (
          <button key={p.name} onClick={() => { setActiveProd(i); setTick(t => t + 1); }}
            style={{ padding: '8px 18px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, background: activeProd === i ? '#6366F1' : 'var(--ed-card)', color: activeProd === i ? '#fff' : 'var(--ed-ink3)', border: `1.5px solid ${activeProd === i ? '#6366F1' : 'var(--ed-rule)'}`, boxShadow: activeProd === i ? '0 4px 0 #3730A3, 0 6px 16px rgba(99,102,241,0.35)' : 'none', transition: 'all 0.25s' }}>
            {p.icon} {p.name}
          </button>
        ))}
      </div>

      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ed-rule)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '24px' }}>{product.icon}</div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--ed-ink)' }}>{product.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{product.category}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#6366F1', letterSpacing: '0.14em' }}>4-MOVE TEARDOWN</div>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          {product.moves.map((move, i) => {
            const show = i < revealedMoves;
            const vs = move.verdict ? VERDICT_STYLES[move.verdict] : null;
            return (
              <AnimatePresence key={`${activeProd}-${i}`}>
                {show && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                    style={{ padding: '16px 18px', borderRadius: '14px', background: vs ? vs.bg : 'var(--ed-card)', border: `1.5px solid ${vs ? vs.border : 'var(--ed-rule)'}`, borderLeft: `4px solid ${vs ? vs.color : '#6366F1'}` }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: vs ? vs.color : '#6366F1', letterSpacing: '0.14em', marginBottom: '7px' }}>
                      MOVE {i + 1} — {move.label.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.75, fontWeight: i === 3 ? 700 : 500 }}>{move.text}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>Product sense is an opinion, not a description.</strong> &ldquo;Notion has blocks, pages, and databases&rdquo; is not product sense. &ldquo;Notion bet on flexibility and won with power users — that trade-off is intentional and right for their market&rdquo; is product sense.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 2. B2B vs B2C ────────────────────────────────────────────────────────────
// The same PM skill (prioritisation) looks completely different in B2B vs B2C.
// Side-by-side shows: who you listen to, how decisions are made, what success
// looks like, and how long the feedback loop is.

const DIMENSIONS = [
  {
    dimension: 'Who are your users?',
    b2b: { text: '50–200 enterprise accounts. You know most of them by name. Their VP signs the contract.', icon: '🏢' },
    b2c: { text: '50,000–5M consumers. Anonymous. Most will never contact you.', icon: '👥' },
  },
  {
    dimension: 'Who makes the buying decision?',
    b2b: { text: 'Economic buyer (VP/C-suite), technical evaluator, end users — often in a committee. Procurement, legal, security all have vetoes.', icon: '📋' },
    b2c: { text: 'The user themselves — sometimes influenced by reviews, friends, or ads. One click to sign up, one click to cancel.', icon: '👆' },
  },
  {
    dimension: 'How long is the feedback loop?',
    b2b: { text: '6–18 month sales cycle. Quarterly business reviews. Annual contracts. Feedback is structured and delayed.', icon: '📅' },
    b2c: { text: 'Days. You ship, watch metrics drop or rise, iterate within the same sprint.', icon: '⚡' },
  },
  {
    dimension: 'What does "success" look like?',
    b2b: { text: 'Net Revenue Retention (NRR), expansion ARR, enterprise health scores, multi-year contracts, reference accounts.', icon: '📈' },
    b2c: { text: 'DAU, retention curves, virality, conversion funnels, LTV/CAC ratios.', icon: '📊' },
  },
  {
    dimension: 'How do you prioritise features?',
    b2b: { text: '3 enterprise accounts ask for CRM integration → that\'s a $480k ARR signal. One customer\'s problem can justify 6 weeks of engineering.', icon: '🎯' },
    b2c: { text: '3 users ask for dark mode → statistically irrelevant. You need data at scale. One user\'s problem needs 10,000x validation.', icon: '📉' },
  },
  {
    dimension: 'How do you validate hypotheses?',
    b2b: { text: 'Customer conversations, pilot programs, POC with 1–3 accounts before building. The customer tells you if it\'s right.', icon: '🤝' },
    b2c: { text: 'A/B tests, cohort analysis, quantitative experiments. The data tells you if it\'s right.', icon: '🧪' },
  },
];

export function B2BvsB2CViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0);
    DIMENSIONS.forEach((_, i) => setTimeout(() => setVisible(i + 1), 300 + i * 280));
  }, [inView, tick]);

  const replay = () => { setVisible(0); setActive(null); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>B2B vs B2C — the same PM skill looks completely different depending on who your customer is</VizLabel>

      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--ed-rule)' }}>
          <div style={{ padding: '14px 16px', background: 'var(--ed-card)', borderRight: '1px solid var(--ed-rule)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em' }}>DIMENSION</div>
          </div>
          {[{ label: 'B2B', sub: 'e.g. EdSpark, Salesforce, Jira', color: '#6366F1', dark: '#3730A3' }, { label: 'B2C', sub: 'e.g. Spotify, Instagram, Duolingo', color: '#F97316', dark: '#C2410C' }].map((h, i) => (
            <div key={i} style={{ padding: '14px 16px', borderLeft: i > 0 ? '1px solid var(--ed-rule)' : 'none' }}>
              <div style={{ padding: '5px 12px', borderRadius: '8px', background: h.color, display: 'inline-block', boxShadow: `0 3px 0 ${h.dark}`, marginBottom: '4px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.14em' }}>{h.label}</div>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{h.sub}</div>
            </div>
          ))}
        </div>

        {DIMENSIONS.map((d, i) => {
          const show = i < visible;
          const isActive = active === i;
          return (
            <AnimatePresence key={i}>
              {show && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
                  onClick={() => setActive(isActive ? null : i)}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < DIMENSIONS.length - 1 ? '1px solid var(--ed-rule)' : 'none', cursor: 'pointer', background: isActive ? 'rgba(99,102,241,0.04)' : 'var(--ed-card)', transition: 'background 0.2s' }}>
                  <div style={{ padding: '14px 16px', borderRight: '1px solid var(--ed-rule)', display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ed-ink)' }}>{d.dimension}</div>
                  </div>
                  {[d.b2b, d.b2c].map((side, si) => (
                    <div key={si} style={{ padding: '14px 16px', borderLeft: si > 0 ? '1px solid var(--ed-rule)' : 'none' }}>
                      <div style={{ fontSize: '18px', marginBottom: '6px' }}>{side.icon}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{side.text}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>The key shift:</strong> in B2B, 3 customer conversations can justify building something. In B2C, 3 users asking for a feature is noise. The size of your evidence threshold changes everything about how you work.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

'use client';

/**
 * AnalyticsTools — Genuine cause-and-effect simulations for Module 07.
 *
 * Every tool here teaches through CONSEQUENCE, not reveal:
 * - You manipulate a parameter
 * - The system responds visibly
 * - You infer the lesson from observing what changed
 *
 * No click-to-reveal. No glorified MCQs.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#158158';
const ACCENT_RGB = '21,129,88';

// ─────────────────────────────────────────
// SHARED SHELL
// ─────────────────────────────────────────
const ToolCard = ({ title, subtitle, icon, color, children }: {
  title: string; subtitle: string; icon: string; color: string; children: React.ReactNode;
}) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
  return (
    <div style={{ background: 'var(--ed-card)', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', overflow: 'hidden', margin: '32px 0', border: `1px solid ${color}20` }}>
      <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${color}20 0%, ${color}0C 100%)`, borderBottom: `1px solid ${color}25`, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{icon}</div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color, textTransform: 'uppercase' as const }}>{title}</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ padding: '24px', background: `linear-gradient(160deg, rgba(${r},${g},${b},0.05) 0%, rgba(${r},${g},${b},0.02) 100%)` }}>{children}</div>
    </div>
  );
};

// ─────────────────────────────────────────
// TOOL 1 · METRIC CONSEQUENCE SIMULATOR
// replaces MetricMapBuilder
// ─────────────────────────────────────────
const ALL_METRICS = [
  { id: 'dau',        label: 'Daily Active Users',     zone: null as string | null },
  { id: 'time_spent', label: 'Time Spent',              zone: null as string | null },
  { id: 'completion', label: 'Review Completion Rate', zone: null as string | null },
  { id: 'signups',    label: 'New Signups',             zone: null as string | null },
  { id: 'retention',  label: '7-Day Retention',         zone: null as string | null },
  { id: 'churn',      label: 'Account Churn Rate',      zone: null as string | null },
  { id: 'search',     label: 'Search Success Rate',     zone: null as string | null },
  { id: 'nps',        label: 'NPS Score',               zone: null as string | null },
];

type SimEvent = { week: string; team: string; metric: string; metricColor: string; reality: string; realityColor: string };

const SIMULATION_OUTCOMES: Record<string, { events: SimEvent[]; verdict: string; verdictColor: string }> = {
  dau: {
    events: [
      { week: 'Week 1', team: 'Team added daily email digests and push notifications to drive daily returns', metric: 'DAU ↑ 11%', metricColor: '#059669', reality: 'Users opening notifications but not completing actual reviews', realityColor: '#E67E22' },
      { week: 'Week 2', team: 'Built a "suggested recordings" widget on the home screen to increase touchpoints', metric: 'DAU ↑ 17%', metricColor: '#059669', reality: 'Session starts up. Meaningful completions unchanged. Support tickets: "app feels pushy"', realityColor: '#dc2626' },
      { week: 'Week 3', team: 'Leadership happy — "DAU is our best week ever." New features planned around engagement', metric: 'DAU ↑ 22%', metricColor: '#059669', reality: 'Review completion rate quietly declined 4%. No guardrail caught it.', realityColor: '#dc2626' },
      { week: 'Week 4', team: 'Quarterly retrospective: "Strong DAU growth"', metric: 'DAU ↑ 24%', metricColor: '#059669', reality: '30-day retention declined 6%. The team optimized for returns, not for value.', realityColor: '#dc2626' },
    ],
    verdict: 'DAU rewarded visits, not value. The metric improved. The product did not.',
    verdictColor: '#dc2626',
  },
  time_spent: {
    events: [
      { week: 'Week 1', team: 'Added "related recordings" sidebar to encourage exploration within sessions', metric: 'Time spent ↑ 14%', metricColor: '#059669', reality: 'Users browsing but not reviewing. Task completion rate unchanged.', realityColor: '#E67E22' },
      { week: 'Week 2', team: 'Redesigned search results to show more options, slower to scan', metric: 'Time spent ↑ 19%', metricColor: '#059669', reality: 'Users spending more time in search — but finding recordings slower. Friction rewarded.', realityColor: '#dc2626' },
      { week: 'Week 3', team: 'Added loading animations and confirmation steps to feel "more considered"', metric: 'Time spent ↑ 23%', metricColor: '#059669', reality: 'Support: "the app feels slow lately." Quality perception declining.', realityColor: '#dc2626' },
      { week: 'Week 4', team: 'Product review: "Time spent is the highest it has ever been"', metric: 'Time spent ↑ 26%', metricColor: '#059669', reality: 'Review completion rate down 8%. Users taking longer to do less. Friction was the reward.', realityColor: '#dc2626' },
    ],
    verdict: 'Time spent rewarded friction instead of value. A user getting stuck improves this metric.',
    verdictColor: '#dc2626',
  },
  completion: {
    events: [
      { week: 'Week 1', team: 'Audited every friction point in the review flow. Found 4 unnecessary confirmation steps.', metric: 'Completion ↑ 6%', metricColor: '#059669', reality: 'Users completing reviews faster. Sessions shorter but more purposeful.', realityColor: '#059669' },
      { week: 'Week 2', team: 'Fixed contact-first search based on actual user behavior data. Reduced "no result" outcomes.', metric: 'Completion ↑ 11%', metricColor: '#059669', reality: 'Users finding what they need and returning the next day. DAU starts rising as a byproduct.', realityColor: '#059669' },
      { week: 'Week 3', team: 'Identified that enterprise users were completing at 40% vs 70% for SMB. Started investigating.', metric: 'Completion ↑ 13% overall', metricColor: '#059669', reality: 'Found permission-blocking issue for enterprise. Guardrail caught the segment gap.', realityColor: '#059669' },
      { week: 'Week 4', team: 'Quarterly review: metric architecture forced the team to look at the right thing every week.', metric: 'Completion ↑ 15%, Retention ↑ 7%', metricColor: '#059669', reality: 'Aligned behavior: fixing real friction created real retention. Both metrics moved together.', realityColor: '#059669' },
    ],
    verdict: 'Review completion unambiguously improves when users get value. The team built the right things.',
    verdictColor: '#059669',
  },
  signups: {
    events: [
      { week: 'Week 1', team: 'Invested heavily in SEO and top-of-funnel ads. Signup flow simplified.', metric: 'Signups ↑ 34%', metricColor: '#059669', reality: 'New users arriving but most not completing their first review.', realityColor: '#E67E22' },
      { week: 'Week 2', team: 'Launched referral program. More signups.', metric: 'Signups ↑ 52%', metricColor: '#059669', reality: 'Activation rate dropping — more users arriving but fewer experiencing core value.', realityColor: '#dc2626' },
      { week: 'Week 3', team: 'Growth team pushing hard. Signup flow reduced to 1 step.', metric: 'Signups ↑ 68%', metricColor: '#059669', reality: 'Qualified activation down 18%. Support volume up. Product health declining.', realityColor: '#dc2626' },
      { week: 'Week 4', team: 'Board presentation: "Best signup quarter ever"', metric: 'Signups ↑ 70%', metricColor: '#059669', reality: 'Retention down 14%. Optimizing the door did nothing for what happens inside.', realityColor: '#dc2626' },
    ],
    verdict: 'Signups measure who arrived, not who got value. Activation and retention were left to rot.',
    verdictColor: '#dc2626',
  },
};

const GUARDRAIL_BONUS: Record<string, string> = {
  retention: 'Your retention guardrail caught the problem in Week 3 — before the quarter ended.',
  churn: 'Your churn guardrail flagged 4 at-risk accounts in Week 2. The team investigated early.',
  nps: 'Your NPS guardrail showed declining satisfaction 3 weeks before retention dropped.',
};

export function MetricConsequenceSimulator() {
  const [metrics, setMetrics] = useState(ALL_METRICS.map(m => ({ ...m })));
  const [selected, setSelected] = useState<string | null>(null);
  const [simState, setSimState] = useState<'idle' | 'running' | 'done'>('idle');
  const [simStep, setSimStep] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const northStar = metrics.find(m => m.zone === 'northstar');
  const guardrails = metrics.filter(m => m.zone === 'guardrail');
  const placed = metrics.filter(m => m.zone !== null);

  const place = (zone: string) => {
    if (!selected) return;
    if (zone === 'northstar' && metrics.filter(m => m.zone === 'northstar').length >= 1) return;
    setMetrics(prev => prev.map(m => m.id === selected ? { ...m, zone } : m));
    setSelected(null);
  };

  const runSimulation = () => {
    if (!northStar) return;
    setSimState('running');
    setSimStep(0);
  };

  useEffect(() => {
    if (simState !== 'running') return;
    const outcomes = SIMULATION_OUTCOMES[northStar?.id ?? 'dau'];
    if (simStep < outcomes.events.length - 1) {
      timerRef.current = setTimeout(() => setSimStep(s => s + 1), 1400);
    } else {
      timerRef.current = setTimeout(() => setSimState('done'), 1400);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [simState, simStep, northStar]);

  const reset = () => {
    setMetrics(ALL_METRICS.map(m => ({ ...m })));
    setSelected(null);
    setSimState('idle');
    setSimStep(-1);
  };

  const outcomes = northStar ? SIMULATION_OUTCOMES[northStar.id] : null;
  const guardrailBonus = guardrails.find(g => GUARDRAIL_BONUS[g.id]);

  const zones = [
    { id: 'northstar', label: 'North Star', color: ACCENT, max: 1, desc: 'The one metric that reflects user value' },
    { id: 'guardrail', label: 'Guardrails',  color: '#E67E22', max: 3, desc: 'Protect against bad optimization' },
    { id: 'secondary', label: 'Secondary',   color: '#3A86FF', max: 5, desc: 'Diagnostic metrics' },
  ];

  return (
    <ToolCard title="Metric Consequence Simulator" subtitle="Build your metric architecture, then simulate a quarter. Watch what your team builds based on the metrics you chose." icon="⚡" color={ACCENT}>
      {simState === 'idle' && (
        <>
          {/* Pool */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>
              METRIC POOL — click a metric, then click a zone to place it
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
              {metrics.filter(m => !m.zone).map(m => (
                <motion.div key={m.id} whileHover={{ y: -2 }} onClick={() => setSelected(selected === m.id ? null : m.id)}
                  style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', color: 'var(--ed-ink)', cursor: 'pointer', background: selected === m.id ? `rgba(${ACCENT_RGB},0.12)` : 'var(--ed-card)', border: `1.5px solid ${selected === m.id ? ACCENT : 'var(--ed-rule)'}`, fontWeight: selected === m.id ? 600 : 400, transition: 'all 0.15s' }}>
                  {m.label}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Zones */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {zones.map(zone => (
              <motion.div key={zone.id} whileHover={selected ? { scale: 1.02 } : {}} onClick={() => place(zone.id)}
                style={{ borderRadius: '12px', border: `2px dashed ${selected ? zone.color : 'var(--ed-rule)'}`, padding: '14px', minHeight: '110px', cursor: selected ? 'pointer' : 'default', background: selected ? `${zone.color}08` : 'var(--ed-card)', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: zone.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '3px' }}>{zone.label.toUpperCase()}</div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginBottom: '10px' }}>{zone.desc}</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
                  {metrics.filter(m => m.zone === zone.id).map(m => (
                    <div key={m.id} style={{ padding: '5px 10px', borderRadius: '6px', fontSize: '11px', background: `${zone.color}15`, border: `1px solid ${zone.color}40`, color: 'var(--ed-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {m.label}
                      <span onClick={e => { e.stopPropagation(); setMetrics(prev => prev.map(x => x.id === m.id ? { ...x, zone: null } : x)); }}
                        style={{ cursor: 'pointer', color: 'var(--ed-ink3)', fontSize: '13px', lineHeight: 1, paddingLeft: '6px' }}>×</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {northStar ? (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }} onClick={runSimulation}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', background: ACCENT, color: '#fff', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>
              ▶ Simulate Quarter with &ldquo;{northStar.label}&rdquo; as North Star
            </motion.button>
          ) : (
            <div style={{ padding: '12px 16px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.06)`, border: `1px solid ${ACCENT}20`, fontSize: '12px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
              Place at least one metric as your North Star to run the simulation.
            </div>
          )}
        </>
      )}

      {(simState === 'running' || simState === 'done') && outcomes && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)' }}>
              Simulating with <span style={{ color: ACCENT }}>"{northStar?.label}"</span> as North Star
            </div>
            {guardrails.length > 0 && (
              <div style={{ fontSize: '11px', color: '#E67E22', background: 'rgba(230,126,34,0.1)', border: '1px solid rgba(230,126,34,0.3)', padding: '3px 10px', borderRadius: '6px' }}>
                🛡 {guardrails.length} guardrail{guardrails.length > 1 ? 's' : ''} active
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px', marginBottom: '16px' }}>
            {outcomes.events.map((event, i) => (
              <AnimatePresence key={i}>
                {simStep >= i && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    style={{ borderRadius: '12px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ padding: '8px 14px', background: `rgba(${ACCENT_RGB},0.08)`, borderBottom: '1px solid var(--ed-rule)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.1em' }}>{event.week.toUpperCase()}</div>
                    </div>
                    <div style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: '4px' }}>TEAM BUILT</div>
                        <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.55 }}>{event.team}</div>
                      </div>
                      <div style={{ padding: '6px 12px', borderRadius: '8px', background: `${event.metricColor}15`, border: `1px solid ${event.metricColor}40`, textAlign: 'center' as const, minWidth: '80px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: event.metricColor, fontFamily: "'JetBrains Mono', monospace" }}>{event.metric}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: '4px' }}>WHAT ACTUALLY HAPPENED</div>
                        <div style={{ fontSize: '12px', color: event.realityColor, lineHeight: 1.55, fontWeight: 600 }}>{event.reality}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>

          {simState === 'done' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {guardrailBonus && (
                <div style={{ marginBottom: '10px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(230,126,34,0.08)', border: '1px solid rgba(230,126,34,0.3)', fontSize: '12px', color: '#E67E22' }}>
                  🛡 {GUARDRAIL_BONUS[guardrailBonus.id]}
                </div>
              )}
              <div style={{ padding: '16px 20px', borderRadius: '12px', background: outcomes.verdictColor === '#059669' ? `rgba(${ACCENT_RGB},0.08)` : 'rgba(220,38,38,0.06)', border: `1.5px solid ${outcomes.verdictColor}40` }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: outcomes.verdictColor, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>QUARTER VERDICT</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.6 }}>{outcomes.verdict}</div>
              </div>
              <button onClick={reset} style={{ marginTop: '12px', width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', color: 'var(--ed-ink3)', fontSize: '12px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" }}>
                ↺ Try a different metric architecture
              </button>
            </motion.div>
          )}
        </>
      )}
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 2 · METRIC BEHAVIOR LAB
// replaces NorthStarSimulator
// ─────────────────────────────────────────
const BEHAVIOR_SCENARIOS = [
  {
    id: 'search', label: 'Search in a call-review app',
    icon: '🔍',
    metrics: [
      { id: 'searches_run',  label: 'Searches run per session', strong: false },
      { id: 'success_rate',  label: 'Search success rate',      strong: true  },
      { id: 'time_in_search', label: 'Time spent in search',   strong: false },
      { id: 'screen_views',  label: 'Search page views',        strong: false },
    ],
    stories: {
      searches_run: [
        { week: 'Week 1', action: 'Team adds autocomplete that fires on every keystroke', outcome: 'Searches/session jumps 40%', warning: 'Users typing 3 letters trigger 3 "searches" — metric inflated by interaction design' },
        { week: 'Week 3', action: 'New feature: suggested searches on empty state', outcome: 'Metric up another 25%', warning: 'Users doing more searches per session — but retrieval success rate unchanged at 67%' },
        { week: 'Week 6', action: 'Leadership: "Search is clearly improving"', outcome: 'Metric ↑ 65% since launch', warning: 'Users still failing to find recordings at the same rate. The metric rose without solving anything.' },
      ],
      success_rate: [
        { week: 'Week 1', action: 'Team analyzes failure patterns. 71% of failures are name-spelled-differently searches.', outcome: 'Identifies root cause', warning: null },
        { week: 'Week 3', action: 'Ships fuzzy name matching and contact-first indexing', outcome: 'Success rate ↑ 14pp', warning: null },
        { week: 'Week 6', action: 'Users trust search — return visits start correlating with successful searches', outcome: 'Success rate ↑ 19pp, 7-day retention ↑ 8%', warning: null },
      ],
      time_in_search: [
        { week: 'Week 1', action: 'Team adds more filters and sorting options to "enrich" the search experience', outcome: 'Time in search ↑ 22%', warning: 'More options = more deliberation = slower task completion' },
        { week: 'Week 3', action: 'Adds preview pane to keep users in search longer', outcome: 'Time in search ↑ 38%', warning: 'Feature adds friction disguised as richness' },
        { week: 'Week 6', action: 'Users spending more time searching but completing fewer reviews', outcome: 'Time in search ↑ 45%', warning: 'Retrieval success rate down 6%. Slower search rewarded.' },
      ],
      screen_views: [
        { week: 'Week 1', action: 'Team adds navigation prompts and "try searching" empty states', outcome: 'Search page views ↑ 30%', warning: 'More views from confusion and re-navigation, not discovery' },
        { week: 'Week 3', action: 'Adds search to main navigation to increase visibility', outcome: 'Views ↑ 52%', warning: 'Users landing on search more — but still not finding recordings' },
        { week: 'Week 6', action: 'Metric looks excellent. Product review is confident.', outcome: 'Views ↑ 61%', warning: 'Underlying success rate unchanged. More visits to a broken experience.' },
      ],
    },
  },
];

export function MetricBehaviorLab() {
  const [chosen, setChosen] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sc = BEHAVIOR_SCENARIOS[0];

  const chosenMetric = sc.metrics.find(m => m.id === chosen);
  const story = chosen ? (sc.stories as Record<string, {week: string; action: string; outcome: string; warning: string | null}[]>)[chosen] : null;

  const start = () => {
    setPlaying(true);
    setStep(0);
  };

  useEffect(() => {
    if (!playing || !story) return;
    if (step < story.length - 1) {
      timerRef.current = setTimeout(() => setStep(s => s + 1), 1600);
    } else {
      setPlaying(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, step, story]);

  const reset = () => { setChosen(null); setPlaying(false); setStep(-1); };

  return (
    <ToolCard title="Metric Behavior Lab" subtitle="Choose a metric as north star. Watch what the team builds — and what actually happens to users over 6 weeks." icon="🔬" color={ACCENT}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
        <span style={{ fontSize: '18px' }}>{sc.icon}</span>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)' }}>{sc.label}</div>
      </div>

      {!chosen || (!playing && step === -1) ? (
        <>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '12px' }}>
            CHOOSE A METRIC — which one would you make the north star?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {sc.metrics.map(m => (
              <motion.div key={m.id} whileHover={{ y: -2, boxShadow: `0 6px 20px rgba(${ACCENT_RGB},0.15)` }} onClick={() => { setChosen(m.id); setStep(-1); }}
                style={{ padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', background: 'var(--ed-card)', border: `2px solid ${chosen === m.id ? ACCENT : 'var(--ed-rule)'}`, transition: 'all 0.2s' }}>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ed-ink)' }}>{m.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', marginTop: '4px' }}>Click to test as north star →</div>
              </motion.div>
            ))}
          </div>
        </>
      ) : null}

      {chosen && step === -1 && !playing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', background: `rgba(${ACCENT_RGB},0.08)`, border: `1px solid ${ACCENT}30`, marginBottom: '14px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.1em', marginBottom: '4px' }}>YOU CHOSE</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)' }}>{chosenMetric?.label}</div>
            <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '3px' }}>as the team&apos;s north star. Let&apos;s watch 6 weeks play out.</div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} onClick={start}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', background: ACCENT, color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            ▶ Play 6-week simulation
          </motion.button>
        </motion.div>
      )}

      {story && step >= 0 && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '14px' }}>
            {story.slice(0, step + 1).map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                style={{ borderRadius: '12px', background: 'var(--ed-card)', border: `1px solid ${s.warning ? 'rgba(220,38,38,0.25)' : `rgba(${ACCENT_RGB},0.2)`}`, overflow: 'hidden' }}>
                <div style={{ padding: '8px 14px', background: s.warning ? 'rgba(220,38,38,0.06)' : `rgba(${ACCENT_RGB},0.06)`, borderBottom: `1px solid ${s.warning ? 'rgba(220,38,38,0.15)' : `rgba(${ACCENT_RGB},0.15)`}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: s.warning ? '#dc2626' : ACCENT, letterSpacing: '0.1em' }}>{s.week.toUpperCase()}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: s.warning ? '#dc2626' : ACCENT }}>{s.outcome}</span>
                </div>
                <div style={{ padding: '10px 14px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', marginBottom: s.warning ? '6px' : '0', lineHeight: 1.55 }}>{s.action}</div>
                  {s.warning && (
                    <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600, lineHeight: 1.5 }}>⚠ {s.warning}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          {!playing && step === (story.length - 1) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ padding: '14px 18px', borderRadius: '12px', background: chosenMetric?.strong ? `rgba(${ACCENT_RGB},0.08)` : 'rgba(220,38,38,0.06)', border: `1.5px solid ${chosenMetric?.strong ? ACCENT : '#dc2626'}40`, marginBottom: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: chosenMetric?.strong ? ACCENT : '#dc2626', marginBottom: '4px' }}>
                  {chosenMetric?.strong ? '✓ Strong north star.' : '✗ This metric shaped the wrong behavior.'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>
                  {chosenMetric?.strong
                    ? 'Search success rate unambiguously improves when users find what they need. The team was forced to solve the real problem.'
                    : 'The metric you chose can improve while the underlying user problem stays unsolved — or gets worse.'}
                </div>
              </div>
              <button onClick={reset} style={{ width: '100%', padding: '9px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', color: 'var(--ed-ink3)', fontSize: '12px', cursor: 'pointer' }}>
                ↺ Try a different metric
              </button>
            </motion.div>
          )}
        </div>
      )}
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 3 · FUNNEL DECOMPOSER
// replaces FunnelExplorer — bars physically split when segments toggled
// ─────────────────────────────────────────
const FUNNEL_BASE = [
  { id: 'signup',   label: 'Signed Up',           total: 1000, color: '#3A86FF' },
  { id: 'upload',   label: 'Uploaded First Call',  total: 720,  color: '#0097A7' },
  { id: 'analysis', label: 'Ran Analysis',          total: 390,  color: '#E67E22', isDropStage: true },
  { id: 'results',  label: 'Viewed Results',        total: 310,  color: '#7843EE' },
  { id: 'share',    label: 'Shared Output',         total: 180,  color: ACCENT },
];

const SEGMENTS = {
  smb:        { label: 'SMB',         color: '#3A86FF', pct: 0.60,
    values:   [600, 440, 302, 252, 160],
    dropNote: 'SMB drops at Analysis: unclear what to do after uploading. UI doesn\'t guide them.' },
  midmarket:  { label: 'Mid-Market',  color: '#7843EE', pct: 0.30,
    values:   [300, 220,  68,  50,  18],
    dropNote: 'Mid-Market drops sharply: admin permissions required before analysis. IT approval needed.' },
  enterprise: { label: 'Enterprise',  color: '#dc2626', pct: 0.10,
    values:   [100,  60,  20,   8,   2],
    dropNote: 'Enterprise almost fully drops: complex SSO + custom workflow requirements block this step entirely.' },
};

type SegKey = keyof typeof SEGMENTS;

export function FunnelDecomposer() {
  const [activeSegs, setActiveSegs] = useState<SegKey[]>([]);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const maxH = 220;
  const maxVal = 1000;

  const toggleSeg = (seg: SegKey) =>
    setActiveSegs(prev => prev.includes(seg) ? prev.filter(s => s !== seg) : [...prev, seg]);

  return (
    <ToolCard title="Funnel Decomposer" subtitle="Toggle segments to physically split each bar. Watch one drop-off become three different failure modes." icon="📉" color="#E67E22">
      {/* Segment toggles */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', alignSelf: 'center', marginRight: '4px' }}>Segment by:</div>
        {(Object.entries(SEGMENTS) as [SegKey, typeof SEGMENTS[SegKey]][]).map(([key, seg]) => (
          <motion.button key={key} whileHover={{ y: -1 }} onClick={() => toggleSeg(key)}
            style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: `2px solid ${activeSegs.includes(key) ? seg.color : 'var(--ed-rule)'}`, background: activeSegs.includes(key) ? `${seg.color}15` : 'var(--ed-card)', color: activeSegs.includes(key) ? seg.color : 'var(--ed-ink3)', transition: 'all 0.2s' }}>
            {seg.label} ({Math.round(seg.pct * 100)}%)
          </motion.button>
        ))}
      </div>

      <div style={{ background: 'var(--ed-card)', borderRadius: '12px', border: '1px solid var(--ed-rule)', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: `${maxH + 30}px`, paddingBottom: '30px', position: 'relative' as const }}>
          {FUNNEL_BASE.map((stage, si) => {
            const isSplit = activeSegs.length > 0;
            const prevTotal = si > 0 ? FUNNEL_BASE[si - 1].total : stage.total;
            const dropPct = si > 0 ? Math.round((1 - stage.total / prevTotal) * 100) : 0;
            const isDropped = stage.isDropStage && activeSegs.length > 0;

            return (
              <div key={stage.id} style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'flex-end', height: '100%', position: 'relative' as const }}
                onMouseEnter={() => setHoveredStage(stage.id)} onMouseLeave={() => setHoveredStage(null)}>

                {/* Drop indicator */}
                {dropPct > 0 && <div style={{ position: 'absolute' as const, top: 0, fontSize: '10px', fontWeight: 700, color: isDropped ? '#dc2626' : 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>-{dropPct}%</div>}

                {/* Bars */}
                {!isSplit ? (
                  <motion.div
                    animate={{ height: `${(stage.total / maxVal) * maxH}px` }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', borderRadius: '6px 6px 0 0', background: stage.color, opacity: 0.85 }}
                  />
                ) : (
                  <div style={{ width: '100%', display: 'flex', gap: '2px', alignItems: 'flex-end', height: `${maxH}px` }}>
                    {activeSegs.map(segKey => {
                      const seg = SEGMENTS[segKey];
                      const val = seg.values[si];
                      return (
                        <motion.div key={segKey}
                          animate={{ height: `${(val / maxVal) * maxH}px` }}
                          transition={{ duration: 0.5 }}
                          style={{ flex: 1, borderRadius: '4px 4px 0 0', background: seg.color, opacity: 0.85, minWidth: 0 }}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Label */}
                <div style={{ position: 'absolute' as const, bottom: 0, textAlign: 'center' as const, width: '100%' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'JetBrains Mono', monospace" }}>{stage.total}</div>
                  <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', lineHeight: 1.3, marginTop: '2px' }}>{stage.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Segment legend */}
        {activeSegs.length > 0 && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, paddingTop: '12px', borderTop: '1px solid var(--ed-rule)' }}>
            {activeSegs.map(segKey => {
              const seg = SEGMENTS[segKey];
              return (
                <div key={segKey} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: seg.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: 'var(--ed-ink2)' }}>{seg.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Drop-off explanations when analysis stage hovered or active segs */}
      <AnimatePresence>
        {activeSegs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#dc2626', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>
              THE ANALYSIS DROP-OFF — three different failures, one bar
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
              {activeSegs.map(segKey => (
                <div key={segKey} style={{ padding: '10px 14px', borderRadius: '8px', background: 'var(--ed-card)', border: `1px solid ${SEGMENTS[segKey].color}40`, display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: SEGMENTS[segKey].color, flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <span style={{ fontWeight: 700, color: SEGMENTS[segKey].color, fontSize: '12px' }}>{SEGMENTS[segKey].label}</span>
                    <span style={{ fontSize: '12px', color: 'var(--ed-ink2)', marginLeft: '8px' }}>{SEGMENTS[segKey].dropNote}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.06)`, border: `1px solid ${ACCENT}20`, fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
              The single red bar was never one problem. Fixing &ldquo;the analysis drop&rdquo; with one solution would have solved only one of three different failure modes.
            </div>
          </motion.div>
        )}
        {activeSegs.length === 0 && (
          <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(230,126,34,0.06)', border: '1px solid rgba(230,126,34,0.2)', fontSize: '12px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
            Toggle segment filters above to watch the single drop-off bar split into three separate failure modes.
          </motion.div>
        )}
      </AnimatePresence>
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 4 · PRODUCT CHANGE SIMULATOR
// replaces CohortPlayground — choose intervention, watch curves animate forward
// ─────────────────────────────────────────
const CHANGES = [
  {
    id: 'simplify',
    label: 'Simplify Step 1',
    desc: 'Reduce onboarding from 6 steps to 3. Remove confirmation screens.',
    icon: '✂️',
    curves: {
      before: [85, 71, 62, 58, 55, 54, 53, 53],
      after:  [92, 80, 72, 68, 66, 65, 64, 64],
    },
    insight: 'Simplified onboarding improves week-1 AND retention. Friction removal often creates durable improvement when the friction was genuinely in the way.',
    insightColor: '#059669',
  },
  {
    id: 'notifications',
    label: 'Add Weekly Email Digest',
    desc: 'Send users a "your recordings this week" email with re-engagement prompts.',
    icon: '📧',
    curves: {
      before: [85, 71, 62, 58, 55, 54, 53, 53],
      after:  [85, 74, 64, 58, 54, 51, 49, 47],
    },
    insight: 'Email nudges create a short-term bump in week-2 returns, but users who aren\'t retaining naturally don\'t form the habit. By week 6, retention is actually worse — notification fatigue and irrelevant pings damage trust.',
    insightColor: '#dc2626',
  },
  {
    id: 'value',
    label: 'Fix Core Value Delivery',
    desc: 'Ship contact-first search + cleaner analysis output. Focus on core job-to-be-done.',
    icon: '🎯',
    curves: {
      before: [85, 71, 62, 58, 55, 54, 53, 53],
      after:  [85, 75, 70, 68, 67, 67, 68, 69],
    },
    insight: 'When you fix the core reason users come back, retention improves durably. Week-6 and week-8 retention keep improving after launch — the product is genuinely more valuable, not just more triggered.',
    insightColor: '#059669',
  },
];
const WEEKS_8 = ['W1','W2','W3','W4','W5','W6','W7','W8'];

export function ProductChangeSimulator() {
  const [chosen, setChosen] = useState<string | null>(null);
  const [launched, setLaunched] = useState(false);
  const [animWeek, setAnimWeek] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const change = CHANGES.find(c => c.id === chosen);

  const launch = () => {
    setLaunched(true);
    setAnimWeek(0);
  };

  useEffect(() => {
    if (!launched || !change) return;
    if (animWeek < WEEKS_8.length - 1) {
      timerRef.current = setTimeout(() => setAnimWeek(w => w + 1), 250);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [launched, animWeek, change]);

  const reset = () => { setChosen(null); setLaunched(false); setAnimWeek(0); };
  const maxH = 160;

  return (
    <ToolCard title="Product Change Simulator" subtitle="Choose an intervention. Launch it. Watch cohort curves animate forward 8 weeks — not all improvements are equal." icon="🚀" color={ACCENT}>
      {!launched ? (
        <>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '12px' }}>
            CHOOSE A PRODUCT CHANGE TO SHIP
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '20px' }}>
            {CHANGES.map(c => (
              <motion.div key={c.id} whileHover={{ x: 4 }} onClick={() => setChosen(chosen === c.id ? null : c.id)}
                style={{ padding: '14px 16px', borderRadius: '10px', cursor: 'pointer', background: chosen === c.id ? `rgba(${ACCENT_RGB},0.08)` : 'var(--ed-card)', border: `2px solid ${chosen === c.id ? ACCENT : 'var(--ed-rule)'}`, display: 'flex', gap: '12px', alignItems: 'flex-start', transition: 'all 0.2s' }}>
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{c.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ed-ink)', marginBottom: '3px' }}>{c.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
          {chosen && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }} onClick={launch}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: ACCENT, color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              🚀 Launch &ldquo;{change?.label}&rdquo; — watch 8 weeks of cohort data
            </motion.button>
          )}
        </>
      ) : change && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>{change.icon}</span>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ed-ink)' }}>{change.label} shipped at W1</div>
            {animWeek < WEEKS_8.length - 1 && (
              <div style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: ACCENT }}>
                watching {WEEKS_8[animWeek]}…
              </div>
            )}
          </div>

          {/* Chart */}
          <div style={{ background: 'var(--ed-card)', borderRadius: '12px', border: '1px solid var(--ed-rule)', padding: '16px', marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: '12px' }}>RETENTION RATE — before vs after launch</div>
            <svg width="100%" height={maxH + 20} viewBox={`0 0 ${WEEKS_8.length * 72} ${maxH + 20}`} style={{ display: 'block', overflow: 'visible' }}>
              {/* Grid */}
              {[0, 0.25, 0.5, 0.75, 1].map(f => (
                <line key={f} x1={0} y1={f * maxH} x2={WEEKS_8.length * 72} y2={f * maxH} stroke="var(--ed-rule)" strokeWidth="1" strokeDasharray={f === 0 ? 'none' : '4 4'} />
              ))}
              {/* Before curve — always shown */}
              <polygon points={`0,${maxH} ${change.curves.before.map((v,i) => `${i*72},${maxH - (v/100)*maxH}`).join(' ')} ${(WEEKS_8.length-1)*72},${maxH}`} fill="rgba(148,163,184,0.12)" />
              <polyline points={change.curves.before.map((v,i) => `${i*72},${maxH - (v/100)*maxH}`).join(' ')} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 3" />
              {/* After curve — animates week by week */}
              {animWeek > 0 && (
                <>
                  <polygon
                    points={`0,${maxH} ${change.curves.after.slice(0, animWeek + 1).map((v,i) => `${i*72},${maxH - (v/100)*maxH}`).join(' ')} ${animWeek*72},${maxH}`}
                    fill={`${change.insightColor}18`}
                  />
                  <polyline
                    points={change.curves.after.slice(0, animWeek + 1).map((v,i) => `${i*72},${maxH - (v/100)*maxH}`).join(' ')}
                    fill="none" stroke={change.insightColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  />
                  {change.curves.after.slice(0, animWeek + 1).map((v,i) => (
                    <circle key={i} cx={i*72} cy={maxH - (v/100)*maxH} r="4" fill={change.insightColor} stroke="var(--ed-card)" strokeWidth="2" />
                  ))}
                </>
              )}
              {/* X labels */}
              {WEEKS_8.map((w,i) => (
                <text key={w} x={i*72} y={maxH + 16} textAnchor="middle" fontSize="10" fill="var(--ed-ink3)" fontFamily="JetBrains Mono, monospace">{w}</text>
              ))}
            </svg>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '16px', height: '2px', background: '#94a3b8', borderRadius: '1px' }} /><span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>Before launch</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '16px', height: '2px', background: change.insightColor, borderRadius: '1px' }} /><span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>After launch</span></div>
            </div>
          </div>

          {animWeek >= WEEKS_8.length - 1 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ padding: '14px 18px', borderRadius: '12px', background: change.insightColor === '#059669' ? `rgba(${ACCENT_RGB},0.08)` : 'rgba(220,38,38,0.06)', border: `1.5px solid ${change.insightColor}40`, marginBottom: '10px' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: change.insightColor, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>8-WEEK VERDICT</div>
                <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.65 }}>{change.insight}</div>
              </div>
              <button onClick={reset} style={{ width: '100%', padding: '9px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', color: 'var(--ed-ink3)', fontSize: '12px', cursor: 'pointer' }}>
                ↺ Try a different change
              </button>
            </motion.div>
          )}
        </>
      )}
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 5 · ACCOUNT HEALTH EXPLORER
// replaces B2BHealthDashboard — assess 4 accounts, see what you missed
// ─────────────────────────────────────────
const ACCOUNTS = [
  {
    id: 'a1', name: 'Riverdale Academy', type: 'Mid-Market · 80 seats',
    signals: [
      { label: 'Weekly Active Users', value: '64 / 80', icon: '👤', good: true },
      { label: 'Seat Activation', value: '80%', icon: '🪑', good: true },
      { label: 'Admin Setup Depth', value: '35%', icon: '⚙️', good: false },
      { label: 'Feature Penetration', value: '2 / 8 features', icon: '🔧', good: false },
      { label: 'Support Tickets', value: '12 this month', icon: '🎫', good: false },
      { label: 'Contract Renewal', value: 'In 4 months', icon: '📅', good: null },
    ],
    truth: 'at-risk',
    explanation: 'High DAU can mask shallow adoption. Usage is concentrated in 2 features, admin setup is incomplete, and support volume is rising. This account looks active but isn\'t deeply embedded. Churn risk is real.',
  },
  {
    id: 'a2', name: 'Northgate School District', type: 'Enterprise · 240 seats',
    signals: [
      { label: 'Weekly Active Users', value: '88 / 240', icon: '👤', good: false },
      { label: 'Seat Activation', value: '37%', icon: '🪑', good: false },
      { label: 'Admin Setup Depth', value: '91%', icon: '⚙️', good: true },
      { label: 'Feature Penetration', value: '7 / 8 features', icon: '🔧', good: true },
      { label: 'Support Tickets', value: '2 this month', icon: '🎫', good: true },
      { label: 'Time Since Last QBR', value: '3 weeks', icon: '📋', good: true },
    ],
    truth: 'expansion',
    explanation: 'Low DAU relative to seats sounds alarming — but look deeper. 91% admin setup, 7/8 feature penetration, minimal support tickets. This is a large district rolling out gradually. They\'re deeply embedded and likely to expand seats. The usage metric is misleading without context.',
  },
  {
    id: 'a3', name: 'Sunbury College', type: 'SMB · 25 seats',
    signals: [
      { label: 'Weekly Active Users', value: '23 / 25', icon: '👤', good: true },
      { label: 'Seat Activation', value: '92%', icon: '🪑', good: true },
      { label: 'Admin Setup Depth', value: '85%', icon: '⚙️', good: true },
      { label: 'Feature Penetration', value: '6 / 8 features', icon: '🔧', good: true },
      { label: 'Support Tickets', value: '0 this month', icon: '🎫', good: true },
      { label: 'NPS Response', value: '9/10', icon: '⭐', good: true },
    ],
    truth: 'healthy',
    explanation: 'High engagement, deep setup, broad feature adoption, zero support friction, strong NPS. This is what a genuinely healthy account looks like across all signal types — not just activity.',
  },
  {
    id: 'a4', name: 'Westfield Learning Co.', type: 'Mid-Market · 60 seats',
    signals: [
      { label: 'Weekly Active Users', value: '51 / 60', icon: '👤', good: true },
      { label: 'Seat Activation', value: '85%', icon: '🪑', good: true },
      { label: 'Admin Setup Depth', value: '72%', icon: '⚙️', good: true },
      { label: 'Feature Penetration', value: '4 / 8 features', icon: '🔧', good: null },
      { label: 'Support Tickets', value: '1 this month', icon: '🎫', good: true },
      { label: 'Champion Users', value: '2 power users', icon: '⚡', good: false },
    ],
    truth: 'at-risk',
    explanation: 'Looks healthy on the surface — high DAU, good activation. But usage is concentrated in just 2 power users. If either leaves, adoption collapses. Champion concentration is one of the strongest early churn signals in B2B SaaS.',
  },
];

type AccountTruth = 'healthy' | 'at-risk' | 'expansion';
const TRUTH_CONFIG: Record<AccountTruth, { label: string; color: string; icon: string }> = {
  healthy:   { label: 'Genuinely Healthy',  color: '#059669', icon: '✅' },
  'at-risk': { label: 'At Churn Risk',      color: '#dc2626', icon: '⚠️' },
  expansion: { label: 'Expansion Ready',    color: '#3A86FF', icon: '🚀' },
};

export function AccountHealthExplorer() {
  const [activeAccount, setActiveAccount] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<Record<string, AccountTruth>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const account = ACCOUNTS.find(a => a.id === activeAccount);
  const assessment = account ? assessments[account.id] : null;
  const isRevealed = account ? revealed[account.id] : false;

  const assess = (verdict: AccountTruth) => {
    if (!account) return;
    setAssessments(prev => ({ ...prev, [account.id]: verdict }));
    setRevealed(prev => ({ ...prev, [account.id]: true }));
  };

  const score = ACCOUNTS.filter(a => assessments[a.id] === a.truth).length;
  const allDone = ACCOUNTS.every(a => revealed[a.id]);

  return (
    <ToolCard title="Account Health Explorer" subtitle="Click an account. Read all its signals. Assess its health. See what you missed." icon="🏢" color={ACCENT}>
      {/* Account selector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        {ACCOUNTS.map(a => {
          const done = revealed[a.id];
          const correct = assessments[a.id] === a.truth;
          return (
            <motion.div key={a.id} whileHover={{ y: -2 }} onClick={() => setActiveAccount(a.id === activeAccount ? null : a.id)}
              style={{ padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', background: activeAccount === a.id ? `rgba(${ACCENT_RGB},0.08)` : 'var(--ed-card)', border: `2px solid ${activeAccount === a.id ? ACCENT : done ? (correct ? '#059669' : '#dc2626') : 'var(--ed-rule)'}`, transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ed-ink)' }}>{a.name}</div>
                {done && <span style={{ fontSize: '14px' }}>{correct ? '✓' : '✗'}</span>}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', marginTop: '2px' }}>{a.type}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Account detail */}
      <AnimatePresence mode="wait">
        {account && (
          <motion.div key={account.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ background: 'var(--ed-card)', borderRadius: '12px', border: '1px solid var(--ed-rule)', padding: '16px', marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {account.signals.map((sig, i) => (
                  <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', background: sig.good === true ? `rgba(${ACCENT_RGB},0.06)` : sig.good === false ? 'rgba(220,38,38,0.06)' : 'var(--ed-cream)', border: `1px solid ${sig.good === true ? `rgba(${ACCENT_RGB},0.2)` : sig.good === false ? 'rgba(220,38,38,0.2)' : 'var(--ed-rule)'}`, display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{sig.icon}</span>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginBottom: '2px' }}>{sig.label}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: sig.good === true ? ACCENT : sig.good === false ? '#dc2626' : 'var(--ed-ink)' }}>{sig.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!isRevealed ? (
              <>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ed-ink)', marginBottom: '10px' }}>Your assessment of {account.name}:</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(Object.entries(TRUTH_CONFIG) as [AccountTruth, typeof TRUTH_CONFIG[AccountTruth]][]).map(([key, cfg]) => (
                    <motion.button key={key} whileHover={{ y: -2 }} onClick={() => assess(key)}
                      style={{ flex: 1, padding: '10px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: `2px solid ${cfg.color}`, background: `${cfg.color}10`, color: cfg.color, transition: 'all 0.2s' }}>
                      {cfg.icon} {cfg.label}
                    </motion.button>
                  ))}
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ padding: '14px 16px', borderRadius: '10px', background: assessments[account.id] === account.truth ? `rgba(${ACCENT_RGB},0.08)` : 'rgba(220,38,38,0.06)', border: `1.5px solid ${assessments[account.id] === account.truth ? ACCENT : '#dc2626'}40`, marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '16px' }}>{TRUTH_CONFIG[account.truth as AccountTruth].icon}</span>
                    <span style={{ fontWeight: 700, color: TRUTH_CONFIG[account.truth as AccountTruth].color, fontSize: '13px' }}>{TRUTH_CONFIG[account.truth as AccountTruth].label}</span>
                    {assessments[account.id] !== account.truth && <span style={{ fontSize: '12px', color: '#dc2626', marginLeft: 'auto' }}>You guessed: {TRUTH_CONFIG[assessments[account.id]].label}</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{account.explanation}</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        {!account && (
          <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: '14px 18px', borderRadius: '10px', background: `rgba(${ACCENT_RGB},0.06)`, border: `1px solid ${ACCENT}20`, fontSize: '12px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
            Click an account to see its signals. Read all of them before making your assessment.
          </motion.div>
        )}
      </AnimatePresence>

      {allDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '10px', background: `rgba(${ACCENT_RGB},0.08)`, border: `1px solid ${ACCENT}30`, textAlign: 'center' as const }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 800, color: ACCENT }}>{score}/4 accounts assessed correctly</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '4px' }}>B2B health requires reading signals together — no single metric tells the full story.</div>
        </motion.div>
      )}
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 6 · EXPERIMENT CONSEQUENCE ENGINE
// replaces ExperimentDecisionStudio — decisions play out over 12 weeks
// ─────────────────────────────────────────
const EXP_DATA = {
  primary: { label: 'Onboarding Completion', control: 54, variant: 58, lift: '+4pp' },
  guardrail: { label: '7-Day Retention', control: 62, variant: 59, change: '-3pp' },
  confidence: 91,
  segments: [
    { name: 'SMB accounts',        lift: '+6pp', good: true },
    { name: 'Enterprise accounts', lift: '-7pp', good: false },
  ],
};

type ExpDecision = 'ship' | 'investigate' | 'hold';

const TIMELINES: Record<ExpDecision, { week: string; event: string; color: string; icon: string }[]> = {
  ship: [
    { week: 'Week 1', event: 'Variant B shipped to 100% of users', color: ACCENT, icon: '🚀' },
    { week: 'Week 2', event: 'Completion metric continues trending up. Team celebrates.', color: ACCENT, icon: '📈' },
    { week: 'Week 4', event: 'First enterprise QBR: "The onboarding felt rushed. We didn\'t finish setup."', color: '#E67E22', icon: '⚠️' },
    { week: 'Week 6', event: '3 enterprise accounts flagged as churn risk by CS. New flow optimized for SMB speed, not enterprise setup depth.', color: '#dc2626', icon: '🔴' },
    { week: 'Week 8', event: 'Engineering and PM scramble to build enterprise-specific variant. Should have been caught before shipping.', color: '#dc2626', icon: '🔥' },
    { week: 'Week 12', event: 'Net retention for enterprise cohort: -9%. SMB strong. Enterprise significantly worse. Cost: 2 months of reactive work.', color: '#dc2626', icon: '📉' },
  ],
  investigate: [
    { week: 'Week 1', event: 'Hold ship. Run deep-dive on enterprise segment (-7pp). Pull session recordings for enterprise users.', color: ACCENT, icon: '🔍' },
    { week: 'Week 2', event: 'Finding: enterprise variant removed admin confirmation step that enterprise orgs actually need for compliance.', color: ACCENT, icon: '💡' },
    { week: 'Week 3', event: 'Ship Variant B to SMB only. Build enterprise-specific flow that preserves compliance step.', color: ACCENT, icon: '✂️' },
    { week: 'Week 5', event: 'Enterprise variant tested and confirmed: +5pp completion with no retention drop.', color: ACCENT, icon: '✅' },
    { week: 'Week 8', event: 'Both segments improving. Guardrail stable. No churn risk. CS not scrambling.', color: ACCENT, icon: '📈' },
    { week: 'Week 12', event: 'Both SMB (+6pp) and enterprise (+5pp) improving durably. One extra week of investigation saved 2 months of firefighting.', color: ACCENT, icon: '🎯' },
  ],
  hold: [
    { week: 'Week 1', event: 'Variant B shelved. Team told to "run another experiment."', color: '#E67E22', icon: '⏸' },
    { week: 'Week 2', event: 'No improvement shipped. Completion rate stagnant. Team morale dips.', color: '#E67E22', icon: '😔' },
    { week: 'Week 4', event: 'New experiment takes 3 weeks to set up. SMB would have already benefited from Variant B.', color: '#dc2626', icon: '⏳' },
    { week: 'Week 8', event: 'Quarter ends without shipping an improvement. Real learnings from Variant B discarded.', color: '#dc2626', icon: '📦' },
    { week: 'Week 12', event: 'Rejection was too strong. Variant B had real signal for SMB — that value was abandoned unnecessarily.', color: '#dc2626', icon: '❌' },
  ],
};

const VERDICTS: Record<ExpDecision, { text: string; color: string }> = {
  ship:        { text: 'Shipping without investigating the enterprise segment created 2 months of reactive damage. The average lift was real — but averages hide segment reality.', color: '#dc2626' },
  investigate: { text: 'One extra week of investigation let you ship safely to both segments. The statistical result was the starting point, not the decision. This is mature PM analytics.', color: '#059669' },
  hold:        { text: 'Rejection was too strong. Variant B had real, positive evidence for SMB. The right move was investigation — not abandonment. Real signal was wasted.', color: '#E67E22' },
};

export function ExperimentConsequenceEngine() {
  const [tab, setTab] = useState<'data' | 'decide'>('data');
  const [decision, setDecision] = useState<ExpDecision | null>(null);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timeline = decision ? TIMELINES[decision] : null;

  const makeDecision = (d: ExpDecision) => {
    setDecision(d);
    setPlaying(true);
    setStep(0);
  };

  useEffect(() => {
    if (!playing || !timeline) return;
    if (step < timeline.length - 1) {
      timerRef.current = setTimeout(() => setStep(s => s + 1), 1200);
    } else {
      setPlaying(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, step, timeline]);

  const reset = () => { setDecision(null); setPlaying(false); setStep(-1); setTab('data'); };

  return (
    <ToolCard title="Experiment Consequence Engine" subtitle="Review the experiment. Make your decision. Watch 12 weeks play out — see what your choice actually caused." icon="🧪" color={ACCENT}>
      {!decision ? (
        <>
          {/* Data tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
            {(['data', 'decide'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, padding: '9px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: `2px solid ${tab === t ? ACCENT : 'var(--ed-rule)'}`, background: tab === t ? `rgba(${ACCENT_RGB},0.1)` : 'var(--ed-card)', color: tab === t ? ACCENT : 'var(--ed-ink3)', transition: 'all 0.2s' }}>
                {t === 'data' ? '📊 Review Results' : '⚖️ Make Decision'}
              </button>
            ))}
          </div>

          {tab === 'data' && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
              {/* Primary */}
              <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'var(--ed-card)', border: `1.5px solid rgba(${ACCENT_RGB},0.3)` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>PRIMARY METRIC</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)', marginTop: '2px' }}>{EXP_DATA.primary.label}</div>
                  </div>
                  <div style={{ textAlign: 'right' as const }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: ACCENT, fontFamily: "'JetBrains Mono', monospace" }}>{EXP_DATA.primary.lift}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{EXP_DATA.confidence}% confidence</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, textAlign: 'center' as const, padding: '8px', borderRadius: '6px', background: 'var(--ed-cream)' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#64748b', fontFamily: "'JetBrains Mono', monospace" }}>{EXP_DATA.primary.control}%</div>
                    <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>Control</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--ed-ink3)' }}>→</div>
                  <div style={{ flex: 1, textAlign: 'center' as const, padding: '8px', borderRadius: '6px', background: `rgba(${ACCENT_RGB},0.08)` }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: ACCENT, fontFamily: "'JetBrains Mono', monospace" }}>{EXP_DATA.primary.variant}%</div>
                    <div style={{ fontSize: '10px', color: ACCENT }}>Variant B</div>
                  </div>
                </div>
              </div>
              {/* Guardrail */}
              <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'var(--ed-card)', border: '1.5px solid rgba(220,38,38,0.3)' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#dc2626', fontFamily: "'JetBrains Mono', monospace', letterSpacing: '0.08em", marginBottom: '6px' }}>⚠ GUARDRAIL DIPPED</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)' }}>{EXP_DATA.guardrail.label}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#dc2626', fontFamily: "'JetBrains Mono', monospace" }}>{EXP_DATA.guardrail.change}</div>
                </div>
              </div>
              {/* Segments */}
              {EXP_DATA.segments.map(seg => (
                <div key={seg.name} style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--ed-card)', border: `1.5px solid ${seg.good ? `rgba(${ACCENT_RGB},0.25)` : 'rgba(220,38,38,0.25)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)' }}>{seg.name}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: seg.good ? ACCENT : '#dc2626', fontFamily: "'JetBrains Mono', monospace" }}>{seg.lift}</div>
                </div>
              ))}
              <button onClick={() => setTab('decide')} style={{ padding: '10px', borderRadius: '8px', background: ACCENT, color: '#fff', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                I&apos;ve reviewed the data → Make my decision
              </button>
            </div>
          )}

          {tab === 'decide' && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)', marginBottom: '4px' }}>Variant B improved completion +4pp but hurt 7-day retention and enterprise accounts.</div>
              <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginBottom: '16px' }}>Your decision determines what happens next. Choose — then watch 12 weeks play out.</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                {([['ship', '🚀 Ship Variant B now', '#059669', 'Primary metric won. Move fast.'], ['investigate', '🔍 Investigate before shipping', ACCENT, 'Enterprise drop needs explanation first.'], ['hold', '❌ Reject — too risky', '#dc2626', 'Guardrail dip + segment concern. Don\'t ship.']] as const).map(([d, lbl, col, desc]) => (
                  <motion.button key={d} whileHover={{ x: 4 }} onClick={() => makeDecision(d)}
                    style={{ padding: '14px 16px', borderRadius: '10px', border: `2px solid ${col}40`, background: `${col}08`, color: 'var(--ed-ink)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', textAlign: 'left' as const, display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>{lbl.split(' ')[0]}</span>
                    <div>
                      <div style={{ color: col }}>{lbl.slice(2)}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', fontWeight: 400, marginTop: '2px' }}>{desc}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : timeline && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ed-ink)' }}>
              You chose: <span style={{ color: decision === 'investigate' ? ACCENT : decision === 'ship' ? '#059669' : '#dc2626' }}>
                {decision === 'ship' ? '🚀 Ship Now' : decision === 'investigate' ? '🔍 Investigate First' : '❌ Hold / Reject'}
              </span>
            </div>
            {playing && <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>timeline playing…</div>}
          </div>

          <div style={{ position: 'relative' as const, paddingLeft: '24px' }}>
            <div style={{ position: 'absolute' as const, left: '8px', top: 0, bottom: 0, width: '2px', background: 'var(--ed-rule)', borderRadius: '1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
              {timeline.slice(0, step + 1).map((event, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  style={{ position: 'relative' as const }}>
                  <div style={{ position: 'absolute' as const, left: '-20px', top: '10px', width: '12px', height: '12px', borderRadius: '50%', background: event.color, border: '2px solid var(--ed-card)', boxShadow: `0 0 0 2px ${event.color}40` }} />
                  <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--ed-card)', border: `1px solid ${event.color}30` }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px' }}>{event.icon}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: event.color, letterSpacing: '0.1em' }}>{event.week.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{event.event}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {!playing && step >= timeline.length - 1 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '16px' }}>
              <div style={{ padding: '14px 18px', borderRadius: '12px', background: VERDICTS[decision].color === '#059669' ? `rgba(${ACCENT_RGB},0.08)` : VERDICTS[decision].color === '#dc2626' ? 'rgba(220,38,38,0.06)' : 'rgba(230,126,34,0.06)', border: `1.5px solid ${VERDICTS[decision].color}40`, marginBottom: '10px' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: VERDICTS[decision].color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>12-WEEK OUTCOME</div>
                <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.65 }}>{VERDICTS[decision].text}</div>
              </div>
              <button onClick={reset} style={{ width: '100%', padding: '9px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', color: 'var(--ed-ink3)', fontSize: '12px', cursor: 'pointer' }}>
                ↺ Try a different decision
              </button>
            </motion.div>
          )}
        </>
      )}
    </ToolCard>
  );
}

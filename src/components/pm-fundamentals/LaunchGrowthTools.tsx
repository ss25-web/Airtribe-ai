'use client';

/**
 * LaunchGrowthTools — Module 08 interactive teaching tools.
 * All genuine cause-and-effect simulations.
 *
 * 1. MVPScopeBuilder        — place features, watch 3 force meters respond in real time
 * 2. LaunchReadinessSimulator — adjust 6 sliders, see launch type recommendation + consequences update
 * 3. AhaMomentJourneyLab    — adjust 5 activation variables, watch user flow animate toward/away from aha
 * 4. GrowthLoopPlayground   — toggle loop elements, watch 8-week growth trajectory animate
 * 5. PricingModelExplorer   — switch pricing model, watch adoption/conversion/value meters shift
 * 6. GTMPathVisualizer      — adjust 5 product variables, watch motion recommendation + path change
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#0D7A5A';
const ACCENT_RGB = '13,122,90';

// ─────────────────────────────────────────
// SHARED SHELL
// ─────────────────────────────────────────
export const ToolCard = ({ title, subtitle, icon, color, children }: {
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
    <div style={{ padding: '24px', background: `linear-gradient(160deg, rgba(${ACCENT_RGB},0.04) 0%, rgba(${ACCENT_RGB},0.02) 100%)` }}>{children}</div>
  </div>
);

const ForceMeter = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div style={{ flex: 1 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.07em' }}>{label}</span>
      <span style={{ fontSize: '10px', fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace" }}>{Math.round(value)}%</span>
    </div>
    <div style={{ height: '8px', borderRadius: '4px', background: 'var(--ed-rule)', overflow: 'hidden' }}>
      <motion.div animate={{ width: `${value}%` }} transition={{ duration: 0.4 }} style={{ height: '100%', borderRadius: '4px', background: color }} />
    </div>
  </div>
);

const Slider = ({ label, value, onChange, color = ACCENT }: { label: string; value: number; onChange: (v: number) => void; color?: string }) => (
  <div style={{ marginBottom: '12px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)' }}>{label}</span>
      <span style={{ fontSize: '10px', fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
    </div>
    <input type="range" min={0} max={100} value={value} onChange={e => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: color, cursor: 'pointer', height: '4px' }} />
  </div>
);

// ─────────────────────────────────────────
// TOOL 1 · MVP SCOPE BUILDER
// ─────────────────────────────────────────
const FEATURES = [
  { id: 'notes',       label: 'Shared Notes',        emoji: '📝', value: 30, speed: 15, learning: 25, desc: 'Core collaboration — users leave context on calls' },
  { id: 'collab',      label: 'Team Commenting',     emoji: '💬', value: 25, speed: 10, learning: 20, desc: 'Teammates respond to notes inline' },
  { id: 'perms',       label: 'Basic Permissions',   emoji: '🔒', value: 15, speed: -5, learning: 10, desc: 'Who can see what — needed for safe rollout' },
  { id: 'templates',   label: 'Review Templates',    emoji: '📋', value: 15, speed: -8, learning: 8,  desc: 'Structured formats for call reviews' },
  { id: 'analytics',   label: 'Analytics Summary',   emoji: '📊', value: 10, speed: -10, learning: 5, desc: 'Aggregate team usage stats' },
  { id: 'nudges',      label: 'Coaching Nudges',     emoji: '💡', value: 8,  speed: -12, learning: 4,  desc: 'AI-generated coaching suggestions' },
  { id: 'notifs',      label: 'Notifications',       emoji: '🔔', value: 12, speed: -6,  learning: 7,  desc: 'Alerts when teammates tag you' },
  { id: 'export',      label: 'Export Options',      emoji: '📤', value: 5,  speed: -8,  learning: 3,  desc: 'Download notes and summaries' },
];

type Zone = 'mvp' | 'phase2' | 'later';
const ZONES: { id: Zone; label: string; color: string; emoji: string; max: number }[] = [
  { id: 'mvp',    label: 'Must Have for MVP', color: ACCENT,    emoji: '✅', max: 4 },
  { id: 'phase2', label: 'Phase 2',           color: '#3A86FF', emoji: '📅', max: 4 },
  { id: 'later',  label: 'Not Now',           color: '#94a3b8', emoji: '⏸',  max: 6 },
];

export function MVPScopeBuilder() {
  const [placements, setPlacements] = useState<Record<string, Zone | null>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const place = (zone: Zone) => {
    if (!selected) return;
    setPlacements(prev => ({ ...prev, [selected]: zone }));
    setSelected(null);
  };

  const mvpItems = FEATURES.filter(f => placements[f.id] === 'mvp');
  const userValue = Math.min(100, mvpItems.reduce((s, f) => s + f.value, 0) * 1.4);
  const speedToLaunch = Math.min(100, Math.max(0, 80 + mvpItems.reduce((s, f) => s + f.speed, 0)));
  const learningQuality = Math.min(100, mvpItems.reduce((s, f) => s + f.learning, 0) * 1.6);

  const overScoped = mvpItems.length > 4;
  const underScoped = mvpItems.length < 2;
  const missingCore = mvpItems.length >= 2 && !mvpItems.find(f => f.id === 'notes') && !mvpItems.find(f => f.id === 'collab');

  const unplaced = FEATURES.filter(f => !placements[f.id]);

  const valueColor = userValue >= 60 ? ACCENT : userValue >= 30 ? '#E67E22' : '#dc2626';
  const speedColor = speedToLaunch >= 60 ? ACCENT : speedToLaunch >= 30 ? '#E67E22' : '#dc2626';
  const learnColor = learningQuality >= 50 ? ACCENT : learningQuality >= 25 ? '#E67E22' : '#dc2626';

  return (
    <ToolCard title="MVP Scope Builder" subtitle="Place features into zones. Watch the three forces respond — then find the right balance." icon="⚖️" color={ACCENT}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left: pool + zones */}
        <div>
          {unplaced.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>
                FEATURE POOL — click to select, then place in a zone
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
                {unplaced.map(f => (
                  <motion.div key={f.id} whileHover={{ x: 3 }} onClick={() => setSelected(selected === f.id ? null : f.id)}
                    style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', background: selected === f.id ? `rgba(${ACCENT_RGB},0.12)` : 'var(--ed-card)', border: `1.5px solid ${selected === f.id ? ACCENT : 'var(--ed-rule)'}`, display: 'flex', gap: '8px', alignItems: 'center', transition: 'all 0.15s' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{f.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: selected === f.id ? 700 : 400, fontSize: '12px', color: 'var(--ed-ink)' }}>{f.label}</div>
                      <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.4 }}>{f.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Zones */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
            {ZONES.map(zone => (
              <motion.div key={zone.id} whileHover={selected ? { scale: 1.01 } : {}} onClick={() => place(zone.id)}
                style={{ borderRadius: '10px', border: `2px dashed ${selected ? zone.color : 'var(--ed-rule)'}`, padding: '10px 12px', cursor: selected ? 'pointer' : 'default', background: selected ? `${zone.color}08` : 'var(--ed-card)', transition: 'all 0.2s', minHeight: '56px' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: zone.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>
                  {zone.emoji} {zone.label.toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '5px' }}>
                  {FEATURES.filter(f => placements[f.id] === zone.id).map(f => (
                    <div key={f.id} style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', background: `${zone.color}18`, border: `1px solid ${zone.color}40`, color: 'var(--ed-ink)', display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <span>{f.emoji}</span>{f.label}
                      <span onClick={e => { e.stopPropagation(); setPlacements(prev => { const n = {...prev}; delete n[f.id]; return n; }); }}
                        style={{ cursor: 'pointer', color: 'var(--ed-ink3)', marginLeft: '2px', lineHeight: 1 }}>×</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: live meters + feedback */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
          <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '14px' }}>LIVE FORCES</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
              <ForceMeter label="User Value" value={userValue} color={valueColor} />
              <ForceMeter label="Speed to Launch" value={speedToLaunch} color={speedColor} />
              <ForceMeter label="Learning Quality" value={learningQuality} color={learnColor} />
            </div>
          </div>

          {/* Feedback warnings */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
            <AnimatePresence>
              {overScoped && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
                  ⚠ Over-scoped. Speed drops, complexity rises. An MVP with 5+ features is often a v1 in disguise.
                </motion.div>
              )}
              {underScoped && mvpItems.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(230,126,34,0.1)', border: '1px solid rgba(230,126,34,0.3)', fontSize: '12px', color: '#E67E22', fontWeight: 600 }}>
                  ⚠ Under-scoped. Too little to create meaningful value or test the core hypothesis.
                </motion.div>
              )}
              {missingCore && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(230,126,34,0.1)', border: '1px solid rgba(230,126,34,0.3)', fontSize: '12px', color: '#E67E22', fontWeight: 600 }}>
                  ⚠ Missing core collaboration (notes or commenting). The hypothesis can't be tested without the key value.
                </motion.div>
              )}
              {!overScoped && !underScoped && !missingCore && mvpItems.length >= 2 && userValue >= 55 && learningQuality >= 40 && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '10px 14px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.1)`, border: `1px solid ${ACCENT}40`, fontSize: '12px', color: ACCENT, fontWeight: 600 }}>
                  ✓ Balanced MVP. Enough value to test, fast enough to learn, scoped to prove the hypothesis.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {mvpItems.length === 0 && (
            <div style={{ padding: '14px', borderRadius: '10px', background: `rgba(${ACCENT_RGB},0.06)`, border: `1px solid ${ACCENT}20`, fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
              Click a feature from the pool, then click a zone to place it. The three force meters update in real time as you scope.
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 2 · LAUNCH READINESS SIMULATOR
// ─────────────────────────────────────────
type LaunchType = 'Internal Beta' | 'Closed Pilot' | 'Phased Release' | 'Broad Launch';

function getLaunchType(stability: number, support: number, rollback: number, audience: number, messaging: number, instrumentation: number): LaunchType {
  const readiness = (stability + support + rollback + messaging) / 4;
  if (readiness < 40) return 'Internal Beta';
  if (readiness < 60 || audience < 40) return 'Closed Pilot';
  if (readiness < 78 || audience < 70) return 'Phased Release';
  return 'Broad Launch';
}

const LAUNCH_TYPE_CONFIG: Record<LaunchType, { color: string; emoji: string; desc: string }> = {
  'Internal Beta':  { color: '#64748b', emoji: '🔬', desc: 'Team-only. Fix issues before exposing externally.' },
  'Closed Pilot':   { color: '#E67E22', emoji: '🎯', desc: 'Trusted users only. Low blast radius, high learning.' },
  'Phased Release': { color: '#3A86FF', emoji: '🌊', desc: 'Staged exposure. Control risk while expanding learning.' },
  'Broad Launch':   { color: ACCENT,    emoji: '🚀', desc: 'Full exposure. High readiness required across all dimensions.' },
};

export function LaunchReadinessSimulator() {
  const [stability, setStability] = useState(55);
  const [support, setSupport] = useState(50);
  const [rollback, setRollback] = useState(60);
  const [audience, setAudience] = useState(40);
  const [messaging, setMessaging] = useState(55);
  const [instrumentation, setInstrumentation] = useState(65);

  const type = getLaunchType(stability, support, rollback, audience, messaging, instrumentation);
  const cfg = LAUNCH_TYPE_CONFIG[type];

  const learningSpeed = Math.round((instrumentation * 0.5 + audience * 0.5) * 0.9);
  const supportLoad = Math.round(audience * 0.6 * (1 - support / 150));
  const trustRisk = Math.round(Math.max(0, (audience - stability) * 0.5 + (100 - support) * 0.3));
  const bugExposure = Math.round(audience * (1 - stability / 120));

  const riskColor = (v: number) => v > 65 ? '#dc2626' : v > 40 ? '#E67E22' : ACCENT;

  return (
    <ToolCard title="Launch Readiness Simulator" subtitle="Adjust the 6 inputs. Watch the recommended launch type and all four consequences shift in real time." icon="🎛️" color={ACCENT}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Sliders */}
        <div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '14px' }}>LAUNCH INPUTS</div>
          <Slider label="Feature Stability" value={stability} onChange={setStability} />
          <Slider label="Support Readiness" value={support} onChange={setSupport} />
          <Slider label="Rollback Confidence" value={rollback} onChange={setRollback} />
          <Slider label="Audience Size" value={audience} onChange={setAudience} color="#3A86FF" />
          <Slider label="Messaging Readiness" value={messaging} onChange={setMessaging} />
          <Slider label="Instrumentation Quality" value={instrumentation} onChange={setInstrumentation} color="#7843EE" />
        </div>

        {/* Recommendation + consequences */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
          {/* Launch type */}
          <motion.div key={type} initial={{ scale: 0.97 }} animate={{ scale: 1 }}
            style={{ padding: '16px', borderRadius: '12px', background: `${cfg.color}15`, border: `2px solid ${cfg.color}50`, textAlign: 'center' as const, boxShadow: `0 4px 20px ${cfg.color}25` }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>{cfg.emoji}</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: cfg.color, marginBottom: '4px' }}>{type}</div>
            <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{cfg.desc}</div>
          </motion.div>

          {/* Consequence meters */}
          <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '12px' }}>CONSEQUENCES</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
              <ForceMeter label="Learning Speed" value={learningSpeed} color={learningSpeed > 60 ? ACCENT : '#E67E22'} />
              <ForceMeter label="Support Load" value={Math.min(100, supportLoad)} color={riskColor(supportLoad)} />
              <ForceMeter label="Trust Risk" value={Math.min(100, trustRisk)} color={riskColor(trustRisk)} />
              <ForceMeter label="Bug Exposure" value={Math.min(100, bugExposure)} color={riskColor(bugExposure)} />
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 3 · AHA MOMENT JOURNEY LAB
// ─────────────────────────────────────────
const JOURNEY_STAGES = [
  { id: 'acquired',   label: 'Acquired',           emoji: '👤' },
  { id: 'opened',     label: 'Opened Product',     emoji: '🚪' },
  { id: 'first_action', label: 'First Action',     emoji: '⚡' },
  { id: 'collab',     label: 'Collaboration Starts', emoji: '🤝' },
  { id: 'aha',        label: 'Aha Moment',         emoji: '💡' },
  { id: 'return',     label: 'Returns Next Day',   emoji: '🔄' },
];

export function AhaMomentJourneyLab() {
  const [clarity, setClarity] = useState(50);
  const [friction, setFriction] = useState(50);
  const [sampleData, setSampleData] = useState(false);
  const [guidance, setGuidance] = useState(50);
  const [notifications, setNotifications] = useState(40);

  // Compute user % at each stage
  const s0 = 100;
  const s1 = Math.round(s0 * (1 - (friction / 300)));
  const s2 = Math.round(s1 * (clarity / 100) * 0.7 + s1 * (guidance / 100) * 0.3);
  const s3 = Math.round(s2 * (sampleData ? 0.78 : 0.45) * (clarity / 120 + 0.2));
  const s4 = Math.round(s3 * (notifications / 150 + 0.4) * (guidance / 150 + 0.4));
  const s5 = Math.round(s4 * (notifications / 120 + 0.3) * 0.85);

  const percentages = [s0, s1, Math.min(s1, s2), Math.min(s2, s3), Math.min(s3, s4), Math.min(s4, s5)].map(v => Math.max(0, Math.min(100, v)));
  const ahaRate = percentages[4];

  const ahaColor = ahaRate >= 55 ? ACCENT : ahaRate >= 30 ? '#E67E22' : '#dc2626';

  return (
    <ToolCard title="Aha Moment Journey Lab" subtitle="Adjust the 5 activation variables. Watch the user flow animate — and see where users stall or reach value." icon="💡" color={ACCENT}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Controls */}
        <div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '14px' }}>ACTIVATION VARIABLES</div>
          <Slider label="Onboarding Clarity" value={clarity} onChange={setClarity} />
          <Slider label={`Setup Friction (lower = better) — ${friction}`} value={friction} onChange={setFriction} color="#dc2626" />
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)' }}>Sample Data on Signup</span>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => setSampleData(x => !x)}
              style={{ padding: '5px 16px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${sampleData ? ACCENT : 'var(--ed-rule)'}`, background: sampleData ? `rgba(${ACCENT_RGB},0.15)` : 'var(--ed-card)', color: sampleData ? ACCENT : 'var(--ed-ink3)', transition: 'all 0.2s' }}>
              {sampleData ? 'ON ✓' : 'OFF'}
            </motion.button>
          </div>
          <Slider label="In-app Guidance" value={guidance} onChange={setGuidance} />
          <Slider label="Notifications / Prompts" value={notifications} onChange={setNotifications} color="#7843EE" />

          {/* Aha score */}
          <div style={{ marginTop: '8px', padding: '12px 16px', borderRadius: '10px', background: `${ahaColor}12`, border: `1.5px solid ${ahaColor}40`, textAlign: 'center' as const }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: ahaColor, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '4px' }}>USERS REACHING AHA MOMENT</div>
            <motion.div key={ahaRate} animate={{ scale: [1.1, 1] }} transition={{ duration: 0.25 }} style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, fontSize: '28px', color: ahaColor }}>{ahaRate}%</motion.div>
          </div>
        </div>

        {/* Journey visualization */}
        <div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '14px' }}>USER JOURNEY — % reaching each stage</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {JOURNEY_STAGES.map((stage, i) => {
              const pct = percentages[i];
              const dropFrom = i > 0 ? percentages[i - 1] - pct : 0;
              const isAha = stage.id === 'aha';
              const stageColor = isAha ? ahaColor : pct > 70 ? ACCENT : pct > 40 ? '#E67E22' : '#dc2626';
              return (
                <div key={stage.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '14px', flexShrink: 0 }}>{stage.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontSize: '11px', fontWeight: isAha ? 700 : 400, color: isAha ? ahaColor : 'var(--ed-ink2)' }}>{stage.label}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: stageColor }}>{pct}%</span>
                      </div>
                      <div style={{ height: '6px', borderRadius: '3px', background: 'var(--ed-rule)', overflow: 'hidden' }}>
                        <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} style={{ height: '100%', borderRadius: '3px', background: stageColor }} />
                      </div>
                    </div>
                  </div>
                  {i > 0 && dropFrom > 8 && (
                    <div style={{ marginLeft: '22px', marginBottom: '3px', fontSize: '10px', color: '#dc2626', fontWeight: 600 }}>
                      ↓ {dropFrom}% dropped {i === 2 && friction > 60 ? '(friction)' : i === 3 && !sampleData ? '(nothing to collaborate on yet)' : i === 4 && notifications < 40 ? '(not notified)' : ''}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '10px', padding: '10px 12px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.06)`, border: `1px solid ${ACCENT}20`, fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.55 }}>
            Getting users in is not the same as getting users to value. Adjust friction and guidance to see how much the aha rate changes.
          </div>
        </div>
      </div>
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 4 · GROWTH LOOP PLAYGROUND
// ─────────────────────────────────────────
const LOOP_ELEMENTS = [
  { id: 'value',    label: 'User Gets Value',        emoji: '⭐', power: 20, desc: 'Core value delivered per session' },
  { id: 'sharing',  label: 'Shares with Teammates',  emoji: '📤', power: 18, desc: 'Users share notes/reviews with others' },
  { id: 'invites',  label: 'Sends Invitations',      emoji: '✉️', power: 22, desc: 'Explicit in-product invite flow' },
  { id: 'collab',   label: 'Collaborative Usage',    emoji: '🤝', power: 20, desc: 'Multiple users creating shared context' },
  { id: 'content',  label: 'Content Created',        emoji: '📝', power: 15, desc: 'Notes and recordings that pull others in' },
  { id: 'repeat',   label: 'Repeat Usage',           emoji: '🔄', power: 18, desc: 'Users return due to value + habit' },
];

export function GrowthLoopPlayground() {
  const [active, setActive] = useState<Set<string>>(new Set());
  const [simulating, setSimulating] = useState(false);
  const [week, setWeek] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = (id: string) => {
    if (simulating) return;
    setActive(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    setWeek(0);
  };

  const loopStrength = Array.from(active).reduce((s, id) => s + (LOOP_ELEMENTS.find(e => e.id === id)?.power ?? 0), 0);
  const hasCore = active.has('value');
  const hasDistribution = active.has('invites') || active.has('sharing');
  const hasRetention = active.has('repeat');
  const compoundable = hasCore && hasDistribution && hasRetention && active.size >= 3;

  const getUsers = (w: number) => {
    if (!hasCore) return Math.round(100 + w * 2);
    if (!compoundable) return Math.round(100 + w * (loopStrength / 10));
    const base = loopStrength / 10;
    return Math.round(100 * Math.pow(1 + base / 80, w * 2));
  };

  const simulate = () => { setSimulating(true); setWeek(1); };
  useEffect(() => {
    if (!simulating || week >= 8) { if (week >= 8) setSimulating(false); return; }
    timerRef.current = setTimeout(() => setWeek(w => w + 1), 500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [simulating, week]);

  const maxUsers = getUsers(8);
  const weeks = Array.from({ length: 9 }, (_, i) => ({ w: i, u: getUsers(i) }));

  return (
    <ToolCard title="Growth Loop Playground" subtitle="Toggle loop elements. See if your system compounds or stalls. Strong loops create their own momentum." icon="🔄" color={ACCENT}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Loop builder */}
        <div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>BUILD YOUR GROWTH LOOP</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', marginBottom: '16px' }}>
            {LOOP_ELEMENTS.map(el => {
              const isOn = active.has(el.id);
              return (
                <motion.div key={el.id} whileHover={{ x: 3 }} onClick={() => toggle(el.id)}
                  style={{ padding: '9px 12px', borderRadius: '8px', cursor: simulating ? 'default' : 'pointer', background: isOn ? `rgba(${ACCENT_RGB},0.12)` : 'var(--ed-card)', border: `1.5px solid ${isOn ? ACCENT : 'var(--ed-rule)'}`, display: 'flex', gap: '8px', alignItems: 'center', transition: 'all 0.15s' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{el.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: isOn ? 700 : 400, fontSize: '12px', color: 'var(--ed-ink)' }}>{el.label}</div>
                    <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{el.desc}</div>
                  </div>
                  {isOn && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />}
                </motion.div>
              );
            })}
          </div>

          {/* Loop health indicators */}
          <div style={{ padding: '12px 14px', borderRadius: '10px', background: compoundable ? `rgba(${ACCENT_RGB},0.08)` : 'rgba(220,38,38,0.06)', border: `1px solid ${compoundable ? ACCENT : '#dc2626'}40`, marginBottom: '10px', fontSize: '12px', lineHeight: 1.6 }}>
            {!hasCore && <div style={{ color: '#dc2626', fontWeight: 600 }}>⚠ Add "User Gets Value" first — without it there is nothing to loop.</div>}
            {hasCore && !hasDistribution && <div style={{ color: '#E67E22', fontWeight: 600 }}>⚠ No distribution mechanism. Users get value but it doesn't spread.</div>}
            {hasCore && hasDistribution && !hasRetention && <div style={{ color: '#E67E22', fontWeight: 600 }}>⚠ No repeat usage. Loop acquires but doesn't compound.</div>}
            {compoundable && <div style={{ color: ACCENT, fontWeight: 600 }}>✓ Loop structure can compound. Simulate to see growth trajectory.</div>}
          </div>

          {!simulating && (
            <motion.button whileHover={{ scale: 1.02 }} onClick={() => { setWeek(0); simulate(); }}
              style={{ width: '100%', padding: '11px', borderRadius: '10px', background: active.size >= 2 ? ACCENT : 'var(--ed-rule)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: active.size >= 2 ? 'pointer' : 'default', opacity: active.size < 2 ? 0.5 : 1 }}>
              ▶ Simulate 8 weeks
            </motion.button>
          )}
        </div>

        {/* Trajectory chart */}
        <div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>USER GROWTH TRAJECTORY</div>
          <div style={{ background: 'var(--ed-card)', borderRadius: '12px', border: '1px solid var(--ed-rule)', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <svg width="100%" height="180" viewBox="0 0 280 180" style={{ display: 'block', overflow: 'visible' }}>
              {[0, 0.25, 0.5, 0.75, 1].map(f => (
                <line key={f} x1={0} y1={f * 160} x2={280} y2={f * 160} stroke="var(--ed-rule)" strokeWidth="1" strokeDasharray={f === 0 ? 'none' : '4 4'} />
              ))}
              {weeks.slice(0, week + 1).length >= 2 && (
                <>
                  <polygon
                    points={`0,160 ${weeks.slice(0, week + 1).map((p, i) => `${i * 35},${160 - Math.min(1, p.u / Math.max(maxUsers, 200)) * 150}`).join(' ')} ${(week) * 35},160`}
                    fill={`rgba(${ACCENT_RGB},0.15)`}
                  />
                  <polyline
                    points={weeks.slice(0, week + 1).map((p, i) => `${i * 35},${160 - Math.min(1, p.u / Math.max(maxUsers, 200)) * 150}`).join(' ')}
                    fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  />
                  {weeks.slice(0, week + 1).map((p, i) => (
                    <circle key={i} cx={i * 35} cy={160 - Math.min(1, p.u / Math.max(maxUsers, 200)) * 150} r="4" fill={ACCENT} stroke="var(--ed-card)" strokeWidth="2" />
                  ))}
                </>
              )}
              {[0,1,2,3,4,5,6,7,8].map(w => (
                <text key={w} x={w * 35} y={176} textAnchor="middle" fontSize="9" fill="var(--ed-ink3)" fontFamily="JetBrains Mono, monospace">W{w}</text>
              ))}
            </svg>
            {week > 0 && (
              <div style={{ marginTop: '8px', textAlign: 'center' as const }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>USERS AT WEEK {week}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, fontSize: '22px', color: ACCENT }}>{getUsers(week).toLocaleString()}</div>
                {compoundable && week >= 6 && <div style={{ fontSize: '11px', color: ACCENT, fontWeight: 600, marginTop: '2px' }}>↑ Compounding. Usage is generating more usage.</div>}
                {!compoundable && week >= 4 && <div style={{ fontSize: '11px', color: '#E67E22', fontWeight: 600, marginTop: '2px' }}>→ Linear only. Growth stops when push stops.</div>}
              </div>
            )}
          </div>
          {week === 0 && (
            <div style={{ padding: '10px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.06)`, border: `1px solid ${ACCENT}20`, fontSize: '11px', color: 'var(--ed-ink3)', textAlign: 'center' as const, marginTop: '8px' }}>
              A funnel moves users through. A loop creates conditions where usage generates more usage. Build your loop — then simulate.
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 5 · PRICING MODEL EXPLORER
// ─────────────────────────────────────────
type PricingModel = 'freemium' | 'trial' | 'usage' | 'team' | 'enterprise';

const PRICING_MODELS: { id: PricingModel; label: string; emoji: string; color: string; adoption: number; ahaTime: number; convPressure: number; ltv: number; upgradePath: number; behavior: string }[] = [
  { id: 'freemium',   label: 'Freemium',        emoji: '🆓', color: '#3A86FF', adoption: 90, ahaTime: 60, convPressure: 25, ltv: 55, upgradePath: 50, behavior: 'Wide top-of-funnel, but users may never hit the paywall. Conversion depends on hitting a meaningful limit.' },
  { id: 'trial',      label: 'Free Trial',       emoji: '⏱',  color: '#E67E22', adoption: 72, ahaTime: 80, convPressure: 75, ltv: 68, upgradePath: 65, behavior: 'Time pressure accelerates activation — but if aha moment comes late in the trial, conversion suffers.' },
  { id: 'usage',      label: 'Usage-Based',      emoji: '📊', color: ACCENT,    adoption: 65, ahaTime: 85, convPressure: 35, ltv: 82, upgradePath: 80, behavior: 'Aligns cost with value. Low barrier to start, natural expansion. Best for products with clear value-per-use.' },
  { id: 'team',       label: 'Team Plan',        emoji: '👥', color: '#7843EE', adoption: 55, ahaTime: 70, convPressure: 55, ltv: 78, upgradePath: 72, behavior: 'Targets groups not individuals. Expansion happens per seat. B2B-friendly but needs champion to drive adoption.' },
  { id: 'enterprise', label: 'Enterprise',       emoji: '🏢', color: '#C85A40', adoption: 30, ahaTime: 55, convPressure: 45, ltv: 95, upgradePath: 88, behavior: 'Highest value per contract. Narrow funnel but deep commitment. Requires sales-led motion and onboarding support.' },
];

export function PricingModelExplorer() {
  const [model, setModel] = useState<PricingModel>('freemium');
  const m = PRICING_MODELS.find(p => p.id === model)!;

  return (
    <ToolCard title="Pricing Model Explorer" subtitle="Switch pricing models. Watch adoption, aha-moment timing, and value capture all shift — simultaneously." icon="💰" color={ACCENT}>
      {/* Model selector */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' as const }}>
        {PRICING_MODELS.map(p => (
          <motion.button key={p.id} whileHover={{ y: -2 }} onClick={() => setModel(p.id)}
            style={{ flex: 1, minWidth: '80px', padding: '10px 8px', borderRadius: '10px', border: `2px solid ${model === p.id ? p.color : 'var(--ed-rule)'}`, background: model === p.id ? `${p.color}15` : 'var(--ed-card)', color: model === p.id ? p.color : 'var(--ed-ink3)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: model === p.id ? `0 4px 16px ${p.color}30` : 'none', textAlign: 'center' as const }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{p.emoji}</div>
            {p.label}
          </motion.button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Meters */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '14px' }}>BEHAVIORAL IMPACT</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
              <ForceMeter label="Adoption Breadth" value={m.adoption} color={m.adoption > 65 ? ACCENT : '#E67E22'} />
              <ForceMeter label="Aha Moment Speed" value={m.ahaTime} color={m.ahaTime > 65 ? ACCENT : '#E67E22'} />
              <ForceMeter label="Conversion Pressure" value={m.convPressure} color={m.convPressure > 60 ? '#dc2626' : m.convPressure > 35 ? '#E67E22' : ACCENT} />
              <ForceMeter label="Long-Term Value" value={m.ltv} color={m.ltv > 70 ? ACCENT : '#E67E22'} />
              <ForceMeter label="Upgrade Path Quality" value={m.upgradePath} color={m.upgradePath > 65 ? ACCENT : '#E67E22'} />
            </div>
          </div>
        </div>

        {/* Behavior description + comparison */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          <motion.div key={model} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '16px', borderRadius: '12px', background: `${m.color}12`, border: `2px solid ${m.color}40`, boxShadow: `0 4px 16px ${m.color}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '24px' }}>{m.emoji}</span>
              <span style={{ fontWeight: 700, fontSize: '16px', color: m.color }}>{m.label}</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{m.behavior}</div>
          </motion.div>

          <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>COMPARE ALL MODELS</div>
            {PRICING_MODELS.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', opacity: p.id === model ? 1 : 0.55, cursor: 'pointer' }} onClick={() => setModel(p.id)}>
                <span style={{ fontSize: '14px', flexShrink: 0 }}>{p.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ height: '6px', borderRadius: '3px', background: 'var(--ed-rule)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.ltv}%`, borderRadius: '3px', background: p.color, opacity: p.id === model ? 1 : 0.4 }} />
                  </div>
                </div>
                <span style={{ fontSize: '9px', color: p.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, minWidth: '28px' }}>LTV {p.ltv}%</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 12px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.06)`, border: `1px solid ${ACCENT}20`, fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.55 }}>
            Pricing isn&apos;t just how you earn money. It shapes what users try, when they upgrade, and whether they reach value before they leave.
          </div>
        </div>
      </div>
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 6 · B2B GTM PATH VISUALIZER
// ─────────────────────────────────────────
type GTMMotion = 'PLG' | 'Hybrid' | 'Sales-led';

function getGTMMotion(complexity: number, timeToValue: number, price: number, onboarding: number, buyers: number): GTMMotion {
  const score = (complexity + timeToValue + price + onboarding + buyers) / 5;
  if (score < 33) return 'PLG';
  if (score < 60) return 'Hybrid';
  return 'Sales-led';
}

const GTM_CONFIG: Record<GTMMotion, {
  color: string; emoji: string; desc: string;
  path: { step: string; emoji: string }[];
}> = {
  PLG: {
    color: '#3A86FF', emoji: '🚀',
    desc: 'Product complexity is low and time-to-value is fast. Users can self-serve to value without sales involvement.',
    path: [
      { step: 'Self-serve signup', emoji: '👤' },
      { step: 'In-app onboarding', emoji: '📱' },
      { step: 'Aha moment (fast)', emoji: '💡' },
      { step: 'Viral / invite spread', emoji: '📤' },
      { step: 'Auto-conversion', emoji: '💳' },
      { step: 'Expansion by seat', emoji: '📈' },
    ],
  },
  Hybrid: {
    color: ACCENT, emoji: '⚡',
    desc: 'Mix of self-serve for exploration and sales touch for conversion. Product leads, sales closes.',
    path: [
      { step: 'Self-serve trial', emoji: '🔬' },
      { step: 'Product-led activation', emoji: '💡' },
      { step: 'Sales engaged at intent', emoji: '📞' },
      { step: 'Guided proof-of-value', emoji: '✅' },
      { step: 'Pilot-to-paid conversion', emoji: '💳' },
      { step: 'Land-and-expand', emoji: '📈' },
    ],
  },
  'Sales-led': {
    color: '#7843EE', emoji: '🤝',
    desc: 'High complexity, high price, or multi-stakeholder buying. Sales drives the motion from first contact.',
    path: [
      { step: 'Sales-initiated outbound', emoji: '📬' },
      { step: 'Discovery + demo', emoji: '🎯' },
      { step: 'Enterprise pilot', emoji: '🏗️' },
      { step: 'Stakeholder alignment', emoji: '👥' },
      { step: 'Contract + onboarding', emoji: '📝' },
      { step: 'Expansion to more teams', emoji: '📈' },
    ],
  },
};

export function GTMPathVisualizer() {
  const [complexity, setComplexity] = useState(45);
  const [timeToValue, setTimeToValue] = useState(40);
  const [price, setPrice] = useState(35);
  const [onboarding, setOnboarding] = useState(40);
  const [buyers, setBuyers] = useState(35);

  const gtmMotion = getGTMMotion(complexity, timeToValue, price, onboarding, buyers);
  const cfg = GTM_CONFIG[gtmMotion];

  return (
    <ToolCard title="GTM Path Visualizer" subtitle="Adjust 5 product variables. Watch the GTM motion recommendation shift — and the downstream path change." icon="🗺️" color={ACCENT}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Sliders */}
        <div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '14px' }}>PRODUCT VARIABLES</div>
          <Slider label="Product Complexity" value={complexity} onChange={setComplexity} color="#7843EE" />
          <Slider label="Time to Value (higher = slower)" value={timeToValue} onChange={setTimeToValue} color="#E67E22" />
          <Slider label="Price Point" value={price} onChange={setPrice} color="#C85A40" />
          <Slider label="Onboarding Effort Required" value={onboarding} onChange={setOnboarding} color="#E67E22" />
          <Slider label="Number of Buyers / Stakeholders" value={buyers} onChange={setBuyers} color="#7843EE" />

          {/* Motion recommendation badge */}
          <motion.div key={gtmMotion} initial={{ scale: 0.97 }} animate={{ scale: 1 }}
            style={{ marginTop: '16px', padding: '14px', borderRadius: '12px', background: `${cfg.color}15`, border: `2px solid ${cfg.color}50`, textAlign: 'center' as const, boxShadow: `0 4px 20px ${cfg.color}25` }}>
            <div style={{ fontSize: '22px', marginBottom: '5px' }}>{cfg.emoji}</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: cfg.color, marginBottom: '4px' }}>{gtmMotion}</div>
            <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{cfg.desc}</div>
          </motion.div>
        </div>

        {/* Path visualization */}
        <div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '14px' }}>
            {gtmMotion.toUpperCase()} PATH — {gtmMotion === 'PLG' ? 'from signup to expansion' : gtmMotion === 'Hybrid' ? 'product-led then sales-close' : 'sales-led to land-and-expand'}
          </div>
          <div style={{ position: 'relative' as const, paddingLeft: '20px' }}>
            <div style={{ position: 'absolute' as const, left: '8px', top: 0, bottom: 0, width: '2px', background: `${cfg.color}40`, borderRadius: '1px' }} />
            <AnimatePresence mode="wait">
              <motion.div key={gtmMotion} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {cfg.path.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ position: 'relative' as const, marginBottom: '8px' }}>
                    <div style={{ position: 'absolute' as const, left: '-16px', top: '10px', width: '10px', height: '10px', borderRadius: '50%', background: cfg.color, border: '2px solid var(--ed-card)', boxShadow: `0 0 0 2px ${cfg.color}40` }} />
                    <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--ed-card)', border: `1px solid ${cfg.color}30`, display: 'flex', gap: '10px', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>{step.emoji}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ed-ink)' }}>{step.step}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          <div style={{ marginTop: '10px', padding: '10px 12px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.06)`, border: `1px solid ${ACCENT}20`, fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.55 }}>
            The right GTM motion is not the one that sounds modern. It is the one that fits the product&apos;s complexity, time-to-value, and adoption reality.
          </div>
        </div>
      </div>
    </ToolCard>
  );
}

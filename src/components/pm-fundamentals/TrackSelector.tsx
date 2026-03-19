'use client';

import { motion } from 'framer-motion';
import type { Track } from './designSystem';

const tracks: {
  id: Track;
  emoji: string;
  title: string;
  subtitle: string;
  scenario: string;
  outcomes: string[];
  time: string;
  accent: string;
  accentRgb: string;
  tag: string;
}[] = [
  {
    id: 'new-pm',
    emoji: '🌱',
    title: 'New to Product Management',
    subtitle: 'Career switcher or first PM role',
    scenario: 'Your manager just handed you a Notion doc with 47 feature requests and said "prioritize this by Friday." Every row is marked High. You have no framework, no context, and three days.',
    outcomes: [
      'Understand what a PM actually does — and what they don\'t',
      'Separate problems from solutions before opening Figma',
      'Make your first prioritization call with confidence',
      'Choose and defend a north star metric',
    ],
    time: '30 min',
    accent: 'var(--teal)',
    accentRgb: '0,151,167',
    tag: 'Foundations',
  },
  {
    id: 'apm',
    emoji: '⚡',
    title: 'Experienced in Product',
    subtitle: 'APM, associate PM, or product-adjacent role',
    scenario: 'You\'ve been a PM for 2 years. Your metrics look fine. Your products ship. But something\'s not landing — user value, stakeholder alignment, strategy clarity. You can feel the ceiling but can\'t name it.',
    outcomes: [
      'Make sharper tradeoff decisions under constraints',
      'Diagnose execution failures at the mental-model level',
      'Reframe strategy as what you say no to',
      'Build guardrail metrics that protect your north star',
    ],
    time: '30 min',
    accent: 'var(--purple)',
    accentRgb: '120,67,238',
    tag: 'Advanced',
  },
];

interface Props {
  onSelect: (track: Track) => void;
}

export default function TrackSelector({ onSelect }: Props) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative' }}>

      {/* Background glow */}
      <div aria-hidden="true" style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse at center, rgba(120,67,238,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '820px', width: '100%' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(120,67,238,0.1)', border: '1px solid rgba(120,67,238,0.25)', fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--purple-light)', marginBottom: '24px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--purple)', display: 'inline-block' }} />
            Module 01 · PM Fundamentals
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Before we start —
            <br />
            <span style={{ background: 'linear-gradient(135deg, var(--purple-light), var(--teal))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              which describes you?
            </span>
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--tx3)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto' }}>
            This module adapts to where you are. Same concepts — different depth, different story, different applications.
          </p>
        </motion.div>

        {/* Track cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {tracks.map((track, i) => (
            <motion.button
              key={track.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              whileHover={{ y: -4, boxShadow: `0 32px 80px rgba(0,0,0,0.3), 0 0 60px rgba(${track.accentRgb},0.08)` }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(track.id)}
              style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '20px', padding: '28px', border: `1px solid rgba(${track.accentRgb},0.2)`, borderTop: `3px solid ${track.accent}`, cursor: 'pointer', transition: 'box-shadow 0.3s' }}>

              {/* Tag + emoji */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ padding: '4px 10px', borderRadius: '4px', background: `rgba(${track.accentRgb},0.12)`, border: `1px solid rgba(${track.accentRgb},0.25)`, fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: track.accent }}>
                  {track.tag}
                </div>
                <div style={{ fontSize: '28px', lineHeight: 1 }}>{track.emoji}</div>
              </div>

              {/* Title */}
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--tx)', marginBottom: '4px', letterSpacing: '-0.02em' }}>{track.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--tx3)', marginBottom: '20px' }}>{track.subtitle}</div>

              {/* Scenario */}
              <div style={{ background: `rgba(${track.accentRgb},0.07)`, borderRadius: '10px', padding: '14px', marginBottom: '20px', borderLeft: `3px solid ${track.accent}` }}>
                <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: track.accent, marginBottom: '6px' }}>Your Situation</div>
                <div style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.8, fontStyle: 'italic' }}>{track.scenario}</div>
              </div>

              {/* Outcomes */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: '10px' }}>You&apos;ll be able to</div>
                {track.outcomes.map((o, j) => (
                  <div key={j} style={{ display: 'flex', gap: '10px', marginBottom: '7px', alignItems: 'flex-start' }}>
                    <span style={{ color: track.accent, fontSize: '10px', flexShrink: 0, marginTop: '2px', fontWeight: 700 }}>✓</span>
                    <span style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.6 }}>{o}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: `1px solid rgba(${track.accentRgb},0.12)` }}>
                <span style={{ fontSize: '11px', color: 'var(--tx3)', fontFamily: 'monospace' }}>⏱ {track.time}</span>
                <motion.span whileHover={{ x: 4 }} style={{ fontSize: '12px', fontWeight: 700, color: track.accent }}>
                  Start this track →
                </motion.span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer note */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ textAlign: 'center', fontSize: '11px', color: 'var(--tx3)', marginTop: '24px', fontFamily: 'monospace' }}>
          You can switch tracks from the sidebar at any time
        </motion.p>

      </div>
    </div>
  );
}

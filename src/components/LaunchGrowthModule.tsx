'use client';

import ModuleShell, { type ModuleConfig } from '@/components/ModuleShell';
import type { Track } from './pm-fundamentals/designSystem';
import Track1LaunchGrowth from './pm-fundamentals/Track1LaunchGrowth';
import Track2LaunchGrowth from './pm-fundamentals/Track2LaunchGrowth';

const CONFIG: ModuleConfig = {
  accent: '#0D7A5A',
  accentRgb: '13,122,90',
  moduleNum: '08',
  moduleLabel: 'Launch & Growth',
  moduleTime: '40 min · 7 parts',
  completionEmoji: '🚀',
  completionMessage: 'You followed Priya from "when do we launch?" to a full picture of launch strategy, MVP discipline, rollout, activation, growth loops, monetization, and B2B GTM motion.',
  sections: [
    { id: 'm8-launch',   label: 'Launch Strategy' },
    { id: 'm8-mvp',     label: 'MVP Scoping' },
    { id: 'm8-rollout', label: 'Rollout Strategy' },
    { id: 'm8-aha',     label: 'Aha Moment' },
    { id: 'm8-growth',  label: 'Growth Loops' },
    { id: 'm8-pricing', label: 'Monetization' },
    { id: 'm8-gtm',     label: 'B2B GTM Motion' },
  ],
  concepts: [
    { id: 'launch-growth-basics', label: 'Launch Strategy',    color: '#0D7A5A' },
    { id: 'mvp-scoping',         label: 'MVP Scoping',         color: '#3A86FF' },
    { id: 'launch-rollout',      label: 'Phased Rollout',      color: '#7843EE' },
    { id: 'activation-aha',      label: 'Aha Moment',          color: '#E67E22' },
    { id: 'growth-loops',        label: 'Growth Loops',        color: '#0097A7' },
    { id: 'pricing-monetization', label: 'Monetization',       color: '#C85A40' },
    { id: 'b2b-gtm',             label: 'B2B GTM Motion',      color: '#0D7A5A' },
  ],
  achievements: [
    { id: 'm8-launch',   icon: '🎯', label: 'Launch Thinker',  desc: 'Separated shipping from launching' },
    { id: 'm8-mvp',     icon: '⚖️',  label: 'MVP Disciplined', desc: 'Scoped for learning, not completeness' },
    { id: 'm8-rollout', icon: '🌊', label: 'Risk Manager',     desc: 'Designed a phased rollout' },
    { id: 'm8-aha',     icon: '💡', label: 'Activator',        desc: 'Found the aha moment gap' },
    { id: 'm8-growth',  icon: '🔄', label: 'Loop Builder',     desc: 'Built a compounding growth system' },
    { id: 'm8-pricing', icon: '💰', label: 'Monetizer',        desc: 'Understood pricing as product design' },
    { id: 'm8-gtm',     icon: '🗺️', label: 'GTM Strategist',  desc: 'Matched motion to product reality' },
  ],
};

interface Props { onBack: () => void; track?: Track | null; }

export default function LaunchGrowthModule({ onBack, track }: Props) {
  return (
    <ModuleShell
      config={CONFIG}
      track={track}
      onBack={onBack}
      Track1={Track1LaunchGrowth}
      Track2={Track2LaunchGrowth}
    />
  );
}

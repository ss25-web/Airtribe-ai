'use client';

import ModuleShell, { type ModuleConfig, type ModuleSection, type ModuleAchievement } from '@/components/ModuleShell';
import Track1ProductStrategy from './pm-fundamentals/Track1ProductStrategy';
import Track2ProductStrategy from './pm-fundamentals/Track2ProductStrategy';
import type { Track } from './pm-fundamentals/designSystem';

const CONFIG: ModuleConfig = {
  accent: '#7C3AED', accentRgb: '124,58,237',
  moduleNum: '02', moduleLabel: 'Product Strategy', moduleTime: '45 min · 5 parts',
  completionEmoji: '🧭',
  completionMessage: 'You followed Priya from reactive feature shipping to owning a real product strategy. Vision → Moats → Bets. That’s the sequence that separates PMs from product owners.',
  sections: [
    { id: 'm2s-strategy-vs-features', label: 'Strategy vs Features'  },
    { id: 'm2s-vision-moats',         label: 'Vision & Moats'        },
    { id: 'm2s-systems-thinking',     label: 'Systems Thinking'      },
    { id: 'm2s-bet-sizing',           label: 'Bet Sizing'            },
    { id: 'm2s-b2b-strategy',         label: 'B2B & Interviews'      },
  ],
  concepts: [
    { id: 'product-strategy',  label: 'Product Strategy',  color: '#7C3AED' },
    { id: 'competitive-moats', label: 'Competitive Moats', color: '#4F46E5' },
    { id: 'systems-thinking',  label: 'Systems Thinking',  color: '#0097A7' },
    { id: 'bet-sizing',        label: 'Bet Sizing',        color: '#C85A40' },
    { id: 'b2b-strategy',      label: 'B2B Strategy',      color: '#158158' },
  ],
  achievements: [
    { id: 'm2s-strategy-vs-features', icon: '🧭', label: 'Strategist',   desc: 'Separated strategy from features'   },
    { id: 'm2s-vision-moats',         icon: '🏰', label: 'Moat Builder', desc: 'Identified competitive advantages'  },
    { id: 'm2s-systems-thinking',     icon: '🕸️', label: 'Systems PM',   desc: 'Anticipated second-order effects'   },
    { id: 'm2s-bet-sizing',           icon: '🎯', label: 'Bet Sizer',    desc: 'Allocated resources to right bets'  },
    { id: 'm2s-b2b-strategy',         icon: '📈', label: 'B2B Thinker',  desc: 'Mastered land-and-expand strategy'  },
  ],
};

const SECTIONS_APM: ModuleSection[] = [
  { id: 'm2a-strategy-pressure',   label: 'Strategy Discipline'   },
  { id: 'm2a-platform-inflection', label: 'Platform vs Product'   },
  { id: 'm2a-portfolio-systems',   label: 'Portfolio Thinking'    },
  { id: 'm2a-kill-criteria',       label: 'Kill Criteria'         },
  { id: 'm2a-series-b-narrative',  label: 'Series B Narrative'    },
];

const ACHIEVEMENTS_APM: ModuleAchievement[] = [
  { id: 'm2a-strategy-pressure',   icon: '🏋️', label: 'Disciplined', desc: 'Held strategy under reactive pressure' },
  { id: 'm2a-platform-inflection', icon: '🏗',  label: 'Architect',   desc: 'Sized a platform bet correctly'         },
  { id: 'm2a-portfolio-systems',   icon: '🎲',  label: 'Portfolio PM',desc: 'Managed a three-bet portfolio'          },
  { id: 'm2a-kill-criteria',       icon: '✂️',  label: 'Kill Artist', desc: 'Stopped something already started'      },
  { id: 'm2a-series-b-narrative',  icon: '📖',  label: 'Storyteller', desc: 'Built a fundable Series B thesis'       },
];

interface Props { onBack: () => void; track?: Track | null; }

export default function ProductStrategyModule({ onBack, track }: Props) {
  return (
    <ModuleShell
      config={CONFIG}
      track={track}
      onBack={onBack}
      Track1={Track1ProductStrategy}
      Track2={Track2ProductStrategy}
      sectionsApm={SECTIONS_APM}
      achievementsApm={ACHIEVEMENTS_APM}
    />
  );
}

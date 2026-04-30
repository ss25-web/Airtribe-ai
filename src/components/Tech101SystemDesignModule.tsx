'use client';

import ModuleShell, { type ModuleConfig } from '@/components/ModuleShell';
import type { Track } from './pm-fundamentals/designSystem';
import Track1Tech101SystemDesign from './pm-fundamentals/Track1Tech101SystemDesign';
import Track2Tech101SystemDesign from './pm-fundamentals/Track2Tech101SystemDesign';

const CONFIG: ModuleConfig = {
  accent: '#7843EE',
  accentRgb: '120,67,238',
  moduleNum: '09',
  moduleLabel: 'Tech 101 & System Design',
  moduleTime: '45 min · 7 parts',
  completionEmoji: '⚙',
  completionMessage: 'You followed Priya from vague PM feature requests to a clear mental model of system layers, API contracts, data shape, permission matrices, scale tradeoffs, and what makes estimates trustworthy.',
  sections: [
    { id: 'm9-stack',       label: 'System Layers' },
    { id: 'm9-latency',     label: 'Latency & UX' },
    { id: 'm9-schema',      label: 'Data Shape' },
    { id: 'm9-api',         label: 'API Contracts' },
    { id: 'm9-permissions', label: 'Permissions' },
    { id: 'm9-scale',       label: 'Scale' },
    { id: 'm9-estimation',  label: 'Estimation' },
  ],
  concepts: [
    { id: 'tech101-system-layers', label: 'System Layers',    color: '#7843EE' },
    { id: 'tech101-latency-ux',    label: 'Latency & UX',     color: '#3B82F6' },
    { id: 'tech101-data-shape',    label: 'Data Shape',        color: '#E67E22' },
    { id: 'tech101-api-contracts', label: 'API Contracts',     color: '#0097A7' },
    { id: 'tech101-permissions',   label: 'Permissions',       color: '#CA8A04' },
    { id: 'tech101-scale',         label: 'Scale',             color: '#EF4444' },
    { id: 'tech101-estimation',    label: 'Estimation',        color: '#16A34A' },
  ],
  achievements: [
    { id: 'm9-stack',       icon: '🔍', label: 'Stack Reader',      desc: 'Saw the system behind the feature' },
    { id: 'm9-latency',     icon: '⏱',  label: 'UX Timer',          desc: 'Treated latency as a product problem' },
    { id: 'm9-schema',      icon: '🗄',  label: 'Schema Thinker',   desc: 'Asked data shape before building' },
    { id: 'm9-api',         icon: '⇄',  label: 'Contract Owner',    desc: 'Understood APIs as product promises' },
    { id: 'm9-permissions', icon: '🔑', label: 'Access Designer',   desc: 'Built the matrix, not the sentence' },
    { id: 'm9-scale',       icon: '📈', label: 'Scale PM',          desc: 'Adapted experience shape to load' },
    { id: 'm9-estimation',  icon: '🎯', label: 'Scope Sharpener',   desc: 'Resolved ambiguity before planning' },
  ],
};

interface Props { onBack: () => void; track?: Track | null; }

export default function Tech101SystemDesignModule({ onBack, track }: Props) {
  return (
    <ModuleShell
      config={CONFIG}
      track={track}
      onBack={onBack}
      Track1={Track1Tech101SystemDesign}
      Track2={Track2Tech101SystemDesign}
    />
  );
}

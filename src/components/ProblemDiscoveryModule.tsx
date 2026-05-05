'use client';

import ModuleShell, { type ModuleConfig } from '@/components/ModuleShell';
import Track1ProblemDiscovery from './pm-fundamentals/Track1ProblemDiscovery';
import Track2ProblemDiscovery from './pm-fundamentals/Track2ProblemDiscovery';
import type { Track } from './pm-fundamentals/designSystem';

const CONFIG: ModuleConfig = {
  accent: '#0097A7', accentRgb: '0,151,167',
  moduleNum: '03', moduleLabel: 'Problem Discovery', moduleTime: '45 min · 7 parts',
  completionEmoji: '🔭',
  completionMessage: 'You followed Priya through the full discovery loop. Symptom → Research → Insight → Brief. That sequence never changes.',
  sections: [
    { id: 'm2-discovery-mindset', label: 'Discovery Mindset' },
    { id: 'm2-customer-segments', label: 'Know Your Users' },
    { id: 'm2-research-methods',  label: 'Research Methods' },
    { id: 'm2-interview',         label: 'Run an Interview' },
    { id: 'm2-synthesis',         label: 'Synthesize Insights' },
    { id: 'm2-problem-statement', label: 'Discovery Brief' },
    { id: 'm2-reflection',        label: 'Final Reflection' },
  ],
  concepts: [
    { id: 'user-research',     label: 'User Research',     color: '#0097A7' },
    { id: 'customer-segments', label: 'Customer Segments', color: '#4F46E5' },
    { id: 'jtbd',              label: 'Jobs to Be Done',   color: '#7843EE' },
    { id: 'research-methods',  label: 'Research Methods',  color: '#C85A40' },
    { id: 'insight-synthesis', label: 'Insight Synthesis', color: '#158158' },
    { id: 'problem-framing',   label: 'Problem Framing',   color: '#B5720A' },
  ],
  achievements: [
    { id: 'm2-discovery-mindset', icon: '🔭', label: 'Discoverer',  desc: 'Resisted the urge to build first' },
    { id: 'm2-customer-segments', icon: '👥', label: 'Segmenter',   desc: 'Found the right users to research' },
    { id: 'm2-research-methods',  icon: '🔬', label: 'Researcher',  desc: 'Matched method to question' },
    { id: 'm2-interview',         icon: '🎤', label: 'Interviewer', desc: 'Asked questions that got real answers' },
    { id: 'm2-synthesis',         icon: '🗂️', label: 'Synthesizer', desc: 'Turned notes into insights' },
    { id: 'm2-problem-statement', icon: '📋', label: 'Briefed',     desc: 'Wrote a crisp discovery brief' },
    { id: 'm2-reflection',        icon: '🎯', label: 'Discoverer',  desc: 'Completed the discovery loop' },
  ],
};

interface Props { onBack: () => void; track?: Track | null; }

export default function ProblemDiscoveryModule({ onBack, track }: Props) {
  return (
    <ModuleShell
      config={CONFIG}
      track={track}
      onBack={onBack}
      Track1={Track1ProblemDiscovery}
      Track2={Track2ProblemDiscovery}
    />
  );
}

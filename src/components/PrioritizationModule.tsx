'use client';

import ModuleShell, { type ModuleConfig } from '@/components/ModuleShell';
import Track1Prioritization from './pm-fundamentals/Track1Prioritization';
import Track2Prioritization from './pm-fundamentals/Track2Prioritization';
import type { Track } from './pm-fundamentals/designSystem';

const CONFIG: ModuleConfig = {
  accent: '#C85A40', accentRgb: '200,90,64',
  moduleNum: '04', moduleLabel: 'Problem Framing & Prioritization', moduleTime: '45 min · 7 parts',
  completionEmoji: '🎯',
  completionMessage: 'You followed Priya through the full prioritisation loop. Raw inputs → problem statements → data → RICE → defensible call. That sequence never changes.',
  sections: [
    { id: 'm4-raw-inputs',  label: 'Raw Inputs' },
    { id: 'm4-reframe',     label: 'Reframe the List' },
    { id: 'm4-data',        label: 'Data Changes Everything' },
    { id: 'm4-rice',        label: 'RICE Framework' },
    { id: 'm4-call',        label: 'Making the Call' },
    { id: 'm4-stakeholder', label: "The PM's Real Job" },
    { id: 'm4-reflection',  label: 'Final Reflection' },
  ],
  concepts: [
    { id: 'raw-inputs-m3',             label: 'Problem Framing',       color: '#C85A40' },
    { id: 'problem-framing-m3',        label: 'Problem Statements',    color: '#4F46E5' },
    { id: 'data-vs-requests-m3',       label: 'Data vs Opinions',      color: '#3A86FF' },
    { id: 'rice-framework-m3',         label: 'RICE Framework',        color: '#0D7A5A' },
    { id: 'stakeholder-decisions-m3',  label: 'Stakeholder Calls',     color: '#7843EE' },
    { id: 'prioritization-summary-m3', label: 'Prioritization Loop',   color: '#B5720A' },
  ],
  achievements: [
    { id: 'm4-raw-inputs',  icon: '📥', label: 'Framer',      desc: 'Converted raw inputs to problems' },
    { id: 'm4-reframe',     icon: '🔄', label: 'Reframer',    desc: 'Turned requests into problem statements' },
    { id: 'm4-data',        icon: '📊', label: 'Data-Driven', desc: 'Let data guide the priority call' },
    { id: 'm4-rice',        icon: '⚖️', label: 'Scorer',      desc: 'Applied RICE to compare problems' },
    { id: 'm4-call',        icon: '🎯', label: 'Decider',     desc: 'Made a defensible priority call' },
    { id: 'm4-stakeholder', icon: '🗣️', label: 'Communicator', desc: 'Explained the why behind the what' },
    { id: 'm4-reflection',  icon: '🧠', label: 'PM-Minded',   desc: 'Completed the prioritization loop' },
  ],
};

interface Props { onBack: () => void; onNext?: () => void; nextLabel?: string; track?: Track | null; }

export default function PrioritizationModule({ onBack, onNext, nextLabel, track }: Props) {
  return (
    <ModuleShell
      config={CONFIG}
      track={track}
      onBack={onBack} onNext={onNext} nextLabel={nextLabel}
      Track1={Track1Prioritization}
      Track2={Track2Prioritization}
    />
  );
}

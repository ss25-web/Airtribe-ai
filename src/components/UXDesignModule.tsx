'use client';

import ModuleShell, { type ModuleConfig, type ModuleSection, type ModuleAchievement } from '@/components/ModuleShell';
import Track1UXDesign from './pm-fundamentals/Track1UXDesign';
import Track2UXDesign from './pm-fundamentals/Track2UXDesign';
import type { Track } from './pm-fundamentals/designSystem';

const CONFIG: ModuleConfig = {
  accent: '#E07A5F', accentRgb: '224,122,95',
  moduleNum: '05', moduleLabel: 'UX & Design Collaboration', moduleTime: '45 min · 7 parts',
  completionEmoji: '🎯',
  completionMessage: 'You followed Priya from a 30% completion rate to 58% — with three lines of copy and a progress bar. Systems can be correct and experiences can still fail. Now you know how to tell the difference.',
  sections: [
    { id: 'm4-illusion',   label: 'The Illusion of Done' },
    { id: 'm4-session',    label: 'Session Recording' },
    { id: 'm4-45sec',      label: '45-Second Problem' },
    { id: 'm4-spec-gap',   label: 'Spec Gaps' },
    { id: 'm4-small-fix',  label: 'Small Changes' },
    { id: 'm4-outcome',    label: 'One Week Later' },
    { id: 'm4-reflection', label: 'Final Reflection' },
  ],
  concepts: [
    { id: 'ux-ship-vs-fix',             label: 'Ship vs Fix',           color: '#E07A5F' },
    { id: 'ux-two-kinds-broken',        label: 'Two Kinds of Broken',   color: '#4F46E5' },
    { id: 'ux-uncertainty-abandonment', label: 'Uncertainty & Drop-off',color: '#3A86FF' },
    { id: 'ux-spec-completeness',       label: 'Spec States',           color: '#0D7A5A' },
    { id: 'ux-feedback-loops',          label: 'Feedback Loops',        color: '#7843EE' },
    { id: 'ux-debug-loop',              label: 'UX Debug Loop',         color: '#B5720A' },
  ],
  achievements: [
    { id: 'm4-illusion',   icon: '🔍', label: 'Observer',   desc: 'Saw past the "shipped" illusion' },
    { id: 'm4-session',    icon: '🎬', label: 'Watcher',    desc: 'Watched a real user struggle' },
    { id: 'm4-45sec',      icon: '⏱️', label: 'Analyst',    desc: 'Found the 12-second drop-off' },
    { id: 'm4-spec-gap',   icon: '📋', label: 'Specwriter', desc: 'Wrote all the states' },
    { id: 'm4-small-fix',  icon: '✨', label: 'Fixer',      desc: 'Fixed clarity, not features' },
    { id: 'm4-outcome',    icon: '📈', label: 'Measurer',   desc: 'Measured the specific change' },
    { id: 'm4-reflection', icon: '🧠', label: 'UX-Minded',  desc: 'Completed the UX debug loop' },
  ],
};

const SECTIONS_APM: ModuleSection[] = [
  { id: 'm4-apm-demo',        label: 'UX Debt as Revenue Risk'   },
  { id: 'm4-apm-audit',       label: 'Design Audit'              },
  { id: 'm4-apm-ds-decision', label: 'Design System Decision'    },
  { id: 'm4-apm-critique',    label: 'Design Critique'           },
  { id: 'm4-apm-threshold',   label: 'Speed vs Craft'            },
  { id: 'm4-apm-pitch',       label: 'Business Case'             },
  { id: 'm4-apm-reflection',  label: 'Final Reflection'          },
];

const ACHIEVEMENTS_APM: ModuleAchievement[] = [
  { id: 'm4-apm-demo',        icon: '💸', label: 'Debt Spotter',  desc: 'Tied UX debt to revenue risk'      },
  { id: 'm4-apm-audit',       icon: '🔎', label: 'Auditor',       desc: 'Ran a structured design audit'     },
  { id: 'm4-apm-ds-decision', icon: '🏗',  label: 'DS Decider',    desc: 'Made the design system call'       },
  { id: 'm4-apm-critique',    icon: '💬', label: 'Critiquer',     desc: 'Gave structured design feedback'   },
  { id: 'm4-apm-threshold',   icon: '⚖️', label: 'Calibrator',    desc: 'Set the craft vs speed threshold'  },
  { id: 'm4-apm-pitch',       icon: '📣', label: 'Advocate',      desc: 'Built a UX business case'          },
  { id: 'm4-apm-reflection',  icon: '🧠', label: 'APM UX-Minded', desc: 'Completed the senior UX loop'      },
];

interface Props { onBack: () => void; track?: Track | null; }

export default function UXDesignModule({ onBack, track }: Props) {
  return (
    <ModuleShell
      config={CONFIG}
      track={track}
      onBack={onBack}
      Track1={Track1UXDesign}
      Track2={Track2UXDesign}
      sectionsApm={SECTIONS_APM}
      achievementsApm={ACHIEVEMENTS_APM}
    />
  );
}

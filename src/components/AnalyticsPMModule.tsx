'use client';

import ModuleShell, { type ModuleConfig } from '@/components/ModuleShell';
import type { Track } from './pm-fundamentals/designSystem';
import Track1AnalyticsPM from './pm-fundamentals/Track1AnalyticsPM';
import Track2AnalyticsPM from './pm-fundamentals/Track2AnalyticsPM';

const CONFIG: ModuleConfig = {
  accent: '#158158',
  accentRgb: '21,129,88',
  moduleNum: '07',
  moduleLabel: 'Analytics & Metrics',
  moduleTime: '40 min · 7 parts',
  completionEmoji: '📊',
  completionMessage: 'You followed Priya through a week of metrics that lied, averaged, and confused — until she learned to ask the right question before reaching for a chart.',
  sections: [
    { id: 'm7-dashboard',       label: 'Dashboard Review' },
    { id: 'm7-north-star',      label: 'The Right Metric' },
    { id: 'm7-success-metrics', label: 'Success Metrics' },
    { id: 'm7-funnel',          label: 'Funnel Analysis' },
    { id: 'm7-cohorts',         label: 'Cohort Analysis' },
    { id: 'm7-b2b',            label: 'B2B Analytics' },
    { id: 'm7-experiments',     label: 'A/B Experiments' },
  ],
  concepts: [
    { id: 'pm-analytics-basics', label: 'Analytics Basics',  color: '#158158' },
    { id: 'north-star-metrics',  label: 'North Star',        color: '#3A86FF' },
    { id: 'success-metrics',     label: 'Success Metrics',   color: '#7843EE' },
    { id: 'funnel-analysis',     label: 'Funnel Analysis',   color: '#E67E22' },
    { id: 'cohort-analysis',     label: 'Cohort Analysis',   color: '#0097A7' },
    { id: 'b2b-analytics',       label: 'B2B Analytics',     color: '#C85A40' },
    { id: 'ab-testing',          label: 'A/B Experiments',   color: '#158158' },
  ],
  achievements: [
    { id: 'm7-dashboard',       icon: '🔭', label: 'Questioner',   desc: 'Identified the question before the metric' },
    { id: 'm7-north-star',      icon: '⭐', label: 'North Star',   desc: 'Built a three-zone metric system' },
    { id: 'm7-success-metrics', icon: '🎯', label: 'Measurer',     desc: 'Defined success through behavior' },
    { id: 'm7-funnel',          icon: '📉', label: 'Investigator', desc: 'Read a funnel as a map, not an answer' },
    { id: 'm7-cohorts',         icon: '📊', label: 'Analyst',      desc: 'Uncovered what the average hid' },
    { id: 'm7-b2b',            icon: '🏢', label: 'B2B Thinker',  desc: 'Switched to account-level health' },
    { id: 'm7-experiments',     icon: '🧪', label: 'Experimenter', desc: 'Made the decision, not just read the result' },
  ],
};

interface Props { onBack: () => void; track?: Track | null; }

export default function AnalyticsPMModule({ onBack, track }: Props) {
  return (
    <ModuleShell
      config={CONFIG}
      track={track}
      onBack={onBack}
      Track1={Track1AnalyticsPM}
      Track2={Track2AnalyticsPM}
    />
  );
}

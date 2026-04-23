'use client';

import ModuleShell, { type ModuleConfig } from '@/components/ModuleShell';
import type { Track } from './pm-fundamentals/designSystem';
import Track1CommunicationPM from './pm-fundamentals/Track1CommunicationPM';
import Track2CommunicationPM from './pm-fundamentals/Track2CommunicationPM';

const CONFIG: ModuleConfig = {
  accent: '#E07A5F',
  accentRgb: '224,122,95',
  moduleNum: '06',
  moduleLabel: 'Effective Communication',
  moduleTime: '40 min · 7 parts',
  completionEmoji: '🎤',
  completionMessage: 'You followed Priya through seven real communication moments — from confused Slack messages to executive roadmap updates. The skill is not saying more. It is saying the right thing to the right person.',
  sections: [
    { id: 'm6-comm-job',     label: 'Communication Is the Job' },
    { id: 'm6-stakeholders', label: 'Stakeholder Communication' },
    { id: 'm6-prd',          label: 'PRD Writing with AI' },
    { id: 'm6-storytelling', label: 'Storytelling for PMs' },
    { id: 'm6-b2b',          label: 'B2B Communication' },
    { id: 'm6-conflict',     label: 'Difficult Conversations' },
    { id: 'm6-executive',    label: 'Executive Communication' },
  ],
  concepts: [
    { id: 'pm-communication-basics', label: 'PM Communication',      color: '#E07A5F' },
    { id: 'stakeholder-communication', label: 'Stakeholder Comms',   color: '#3A86FF' },
    { id: 'prd-with-ai',              label: 'PRD with AI',          color: '#7843EE' },
    { id: 'pm-storytelling',          label: 'PM Storytelling',      color: '#C85A40' },
    { id: 'b2b-pm-communication',     label: 'B2B Communication',    color: '#059669' },
    { id: 'difficult-conversations',  label: 'Conflict & Tradeoffs', color: '#D97706' },
    { id: 'executive-communication',  label: 'Executive Updates',    color: '#0097A7' },
  ],
  achievements: [
    { id: 'm6-comm-job',     icon: '📡', label: 'Signal Sender',  desc: 'Learned that communication is the job' },
    { id: 'm6-stakeholders', icon: '🎯', label: 'Calibrated',     desc: 'Matched message to stakeholder' },
    { id: 'm6-prd',          icon: '📋', label: 'PRD Author',     desc: 'Used AI without losing judgment' },
    { id: 'm6-storytelling', icon: '🎬', label: 'Narrator',       desc: 'Turned facts into a PM narrative' },
    { id: 'm6-b2b',          icon: '🤝', label: 'GTM Partner',    desc: 'Enabled sales without overcommitting' },
    { id: 'm6-conflict',     icon: '⚖️',  label: 'Mediator',       desc: 'Made the real tradeoff visible' },
    { id: 'm6-executive',    icon: '📊', label: 'Exec-Ready',     desc: 'Made product direction legible' },
  ],
};

interface Props { onBack: () => void; track?: Track | null; }

export default function CommunicationPMModule({ onBack, track }: Props) {
  return (
    <ModuleShell
      config={CONFIG}
      track={track}
      onBack={onBack}
      Track1={Track1CommunicationPM}
      Track2={Track2CommunicationPM}
    />
  );
}

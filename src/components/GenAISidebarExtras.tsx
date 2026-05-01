'use client';

import { useLearnerStore } from '@/lib/learnerStore';

interface BadgeLike {
  id: string;
  icon: string;
  label: string;
  color: string;
  desc?: string;
}

interface Props {
  badges: BadgeLike[];
  completedSections: Set<string>;
}

export function GenAILatestBadgePanel({ badges, completedSections }: Props) {
  const latestUnlock = badges.slice().reverse().find(badge => completedSections.has(badge.id));

  if (!latestUnlock) return null;

  return (
    <div style={{
      marginTop: '10px',
      padding: '8px 10px',
      borderRadius: '6px',
      background: 'var(--ed-cream)',
      border: '1px solid var(--ed-rule)',
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '8px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: 'var(--ed-ink3)',
        textTransform: 'uppercase',
        marginBottom: '3px',
      }}>Latest</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '14px', fontWeight: 800, color: latestUnlock.color, flexShrink: 0 }}>
          {latestUnlock.icon}
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.3 }}>
            {latestUnlock.label}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.4, wordBreak: 'break-word' }}>
            {latestUnlock.desc ?? `Completed the ${latestUnlock.label} section`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GenAIStreakCard() {
  const streakDays = Math.max(1, useLearnerStore(s => s.streakDays));

  return (
    <div style={{
      padding: '14px 16px',
      borderRadius: '10px',
      background: 'var(--ed-card)',
      border: '1px solid var(--ed-rule)',
      borderLeft: '3px solid #C2410C',
      boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      <div style={{ fontSize: '20px', lineHeight: 1 }}>🔥</div>
      <div>
        <div style={{ fontSize: '16px', fontWeight: 900, color: '#C2410C', lineHeight: 1.1 }}>
          {streakDays} {streakDays === 1 ? 'day' : 'days'}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '2px' }}>
          learning streak
        </div>
      </div>
    </div>
  );
}

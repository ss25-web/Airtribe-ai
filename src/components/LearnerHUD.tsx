'use client';

import { useLearnerStore, getOverallProgress } from '@/lib/learnerStore';
import { motion } from 'framer-motion';

export default function LearnerHUD() {
  const store = useLearnerStore();
  const progress = getOverallProgress(store);
  const { streakDays, theme, toggleTheme, preferredDifficulty } = store;

  const difficultyColors = {
    easy: '#0097A7',
    medium: '#7843EE',
    hard: '#E07A5F',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {/* Streak */}
      {streakDays > 0 && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={hudItem}
          title={`${streakDays} day streak!`}
        >
          <span style={{ fontSize: '14px' }}>🔥</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#E07A5F' }}>{streakDays}</span>
        </motion.div>
      )}

      {/* Difficulty badge */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{
          ...hudItem,
          borderColor: `${difficultyColors[preferredDifficulty]}40`,
        }}
        title={`Adaptive difficulty: ${preferredDifficulty}`}
      >
        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          color: difficultyColors[preferredDifficulty],
        }}>
          {preferredDifficulty}
        </span>
      </motion.div>

      {/* Mastery ring */}
      {progress > 0 && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={hudItem}
          title={`Overall mastery: ${Math.round(progress * 100)}%`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" fill="none" stroke="var(--dim)" strokeWidth="2.5" />
            <motion.circle
              cx="12" cy="12" r="9"
              fill="none"
              stroke="var(--purple)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${progress * 56.5} 56.5`}
              transform="rotate(-90 12 12)"
              animate={{ strokeDasharray: `${progress * 56.5} 56.5` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </svg>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--tx2)', marginLeft: '-2px' }}>
            {Math.round(progress * 100)}%
          </span>
        </motion.div>
      )}

      {/* Theme toggle */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          ...hudItem,
          cursor: 'pointer',
          background: 'var(--bg2)',
        }}
      >
        <span style={{ fontSize: '14px' }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
        <span style={{ fontSize: '11px', color: 'var(--tx2)', fontWeight: 600 }}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </span>
      </motion.button>
    </motion.div>
  );
}

const hudItem: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  background: 'var(--bg2)',
  border: '1px solid var(--dim)',
  borderRadius: '40px',
  backdropFilter: 'blur(12px)',
};

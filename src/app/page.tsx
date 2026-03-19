'use client';

import { useEffect, useState } from 'react';
import type { Track } from '@/components/pm-fundamentals/designSystem';
import SeriesHomepage from '@/components/SeriesHomepage';
import PlacementQuiz from '@/components/PlacementQuiz';
import PMFundamentalsModule from '@/components/PMFundamentalsModule';

type Stage = 'home' | 'quiz' | 'reading';

export default function Home() {
  const [stage, setStage] = useState<Stage>('home');
  const [assignedTrack, setAssignedTrack] = useState<Track | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark class to <html> so all CSS vars cascade correctly everywhere
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDark = () => setDarkMode(d => !d);

  if (stage === 'home') {
    return (
      <SeriesHomepage
        onSelectPM={() => setStage('quiz')}
        darkMode={darkMode}
        onToggleDark={toggleDark}
      />
    );
  }

  if (stage === 'quiz') {
    return (
      <PlacementQuiz
        onComplete={(track) => {
          setAssignedTrack(track);
          setStage('reading');
        }}
        onBack={() => setStage('home')}
      />
    );
  }

  if (stage === 'reading' && assignedTrack) {
    return (
      <PMFundamentalsModule
        startTrack={assignedTrack}
        onBack={() => setStage('home')}
      />
    );
  }

  return null;
}

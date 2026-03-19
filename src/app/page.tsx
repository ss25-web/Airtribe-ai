'use client';

import { useEffect, useState } from 'react';
import type { Track } from '@/components/pm-fundamentals/designSystem';
import SeriesHomepage from '@/components/SeriesHomepage';
import PlacementQuiz from '@/components/PlacementQuiz';
import PMFundamentalsModule from '@/components/PMFundamentalsModule';

type Stage = 'home' | 'quiz' | 'reading';

const LS_STAGE = 'airtribe_stage';
const LS_TRACK = 'airtribe_track';
const LS_DARK  = 'airtribe_dark';

export default function Home() {
  const [stage, setStage] = useState<Stage>('home');
  const [assignedTrack, setAssignedTrack] = useState<Track | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore persisted state on mount
  useEffect(() => {
    const savedStage = localStorage.getItem(LS_STAGE) as Stage | null;
    const savedTrack = localStorage.getItem(LS_TRACK) as Track | null;
    const savedDark  = localStorage.getItem(LS_DARK) === 'true';

    if (savedStage === 'reading' && savedTrack) {
      setStage('reading');
      setAssignedTrack(savedTrack);
    } else if (savedStage === 'quiz') {
      setStage('quiz');
    }
    setDarkMode(savedDark);
    setHydrated(true);
  }, []);

  // Sync dark mode to <html> class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (hydrated) localStorage.setItem(LS_DARK, String(darkMode));
  }, [darkMode, hydrated]);

  const goHome = () => {
    setStage('home');
    setAssignedTrack(null);
    localStorage.setItem(LS_STAGE, 'home');
    localStorage.removeItem(LS_TRACK);
  };

  const goQuiz = () => {
    setStage('quiz');
    localStorage.setItem(LS_STAGE, 'quiz');
  };

  const goReading = (track: Track) => {
    setAssignedTrack(track);
    setStage('reading');
    localStorage.setItem(LS_STAGE, 'reading');
    localStorage.setItem(LS_TRACK, track);
  };

  const toggleDark = () => setDarkMode(d => !d);

  // Avoid flash of wrong screen before hydration
  if (!hydrated) return null;

  if (stage === 'home') {
    return (
      <SeriesHomepage
        onSelectPM={goQuiz}
        darkMode={darkMode}
        onToggleDark={toggleDark}
      />
    );
  }

  if (stage === 'quiz') {
    return (
      <PlacementQuiz
        onComplete={(track) => goReading(track)}
        onBack={goHome}
      />
    );
  }

  if (stage === 'reading' && assignedTrack) {
    return (
      <PMFundamentalsModule
        startTrack={assignedTrack}
        onBack={goHome}
      />
    );
  }

  return null;
}

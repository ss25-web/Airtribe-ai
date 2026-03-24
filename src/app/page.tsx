'use client';

import { useEffect, useState } from 'react';
import type { Track } from '@/components/pm-fundamentals/designSystem';
import SeriesHomepage from '@/components/SeriesHomepage';
import PlacementQuiz from '@/components/PlacementQuiz';
import CourseOverview from '@/components/CourseOverview';
import PMFundamentalsModule from '@/components/PMFundamentalsModule';
import ProblemDiscoveryModule from '@/components/ProblemDiscoveryModule';
import GenAIPlacementQuiz from '@/components/GenAIPlacementQuiz';
import GenAILaunchpadOverview from '@/components/GenAILaunchpadOverview';
import GenAIPreRead1 from '@/components/GenAIPreRead1';
import type { GenAITrack } from '@/components/genaiTypes';

type Stage = 'home' | 'quiz' | 'overview' | 'reading' | 'genai-quiz' | 'genai' | 'genai-reading';

const LS_STAGE  = 'airtribe_stage';
const LS_TRACK  = 'airtribe_track';
const LS_GENAI_TRACK = 'airtribe_genai_track';
const LS_DARK   = 'airtribe_dark';
const LS_MODULE = 'airtribe_module';

export default function Home() {
  const [stage, setStage] = useState<Stage>('home');
  const [assignedTrack, setAssignedTrack] = useState<Track | null>(null);
  const [genaiTrack, setGenaiTrack] = useState<GenAITrack | null>(null);
  const [activeModule, setActiveModule] = useState<string>('01');
  const [darkMode, setDarkMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore persisted state on mount
  useEffect(() => {
    const savedStage = localStorage.getItem(LS_STAGE) as Stage | null;
    const savedTrack = localStorage.getItem(LS_TRACK) as Track | null;
    const savedGenAITrack = localStorage.getItem(LS_GENAI_TRACK) as GenAITrack | null;
    const savedDark  = localStorage.getItem(LS_DARK) === 'true';

    const savedModule = localStorage.getItem(LS_MODULE) ?? '01';
    if ((savedStage === 'reading' || savedStage === 'overview') && savedTrack) {
      setStage(savedStage);
      setAssignedTrack(savedTrack);
      setActiveModule(savedModule);
    } else if (savedStage === 'genai-quiz') {
      setStage('genai-quiz');
      if (savedGenAITrack === 'tech' || savedGenAITrack === 'non-tech') setGenaiTrack(savedGenAITrack);
    } else if (savedStage === 'genai') {
      setStage('genai');
      if (savedGenAITrack === 'tech' || savedGenAITrack === 'non-tech') setGenaiTrack(savedGenAITrack);
    } else if (savedStage === 'genai-reading') {
      setStage('genai-reading');
      if (savedGenAITrack === 'tech' || savedGenAITrack === 'non-tech') setGenaiTrack(savedGenAITrack);
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
    setGenaiTrack(null);
    localStorage.setItem(LS_STAGE, 'home');
    localStorage.removeItem(LS_TRACK);
    localStorage.removeItem(LS_GENAI_TRACK);
  };

  const goQuiz = () => {
    setStage('quiz');
    localStorage.setItem(LS_STAGE, 'quiz');
  };

  const goGenAI = () => {
    setStage('genai-quiz');
    localStorage.setItem(LS_STAGE, 'genai-quiz');
    localStorage.removeItem(LS_TRACK);
  };

  const goGenAIOverview = (track: GenAITrack) => {
    setGenaiTrack(track);
    setStage('genai');
    localStorage.setItem(LS_STAGE, 'genai');
    localStorage.setItem(LS_GENAI_TRACK, track);
    localStorage.removeItem(LS_TRACK);
  };

  const goGenAIPreRead = () => {
    setStage('genai-reading');
    localStorage.setItem(LS_STAGE, 'genai-reading');
    localStorage.removeItem(LS_TRACK);
  };

  const goBackToGenAIOverview = () => {
    setStage('genai');
    localStorage.setItem(LS_STAGE, 'genai');
  };

  const goOverview = (track: Track) => {
    setAssignedTrack(track);
    setStage('overview');
    localStorage.setItem(LS_STAGE, 'overview');
    localStorage.setItem(LS_TRACK, track);
  };

  const goReading = (moduleNum: string) => {
    setActiveModule(moduleNum);
    setStage('reading');
    localStorage.setItem(LS_STAGE, 'reading');
    localStorage.setItem(LS_MODULE, moduleNum);
  };

  const toggleDark = () => setDarkMode(d => !d);

  // Avoid flash of wrong screen before hydration
  if (!hydrated) return null;

  if (stage === 'home') {
    return (
      <SeriesHomepage
        onSelectPM={goQuiz}
        onSelectGenAI={goGenAI}
        darkMode={darkMode}
        onToggleDark={toggleDark}
      />
    );
  }

  if (stage === 'quiz') {
    return (
      <PlacementQuiz
        onComplete={(track) => goOverview(track)}
        onBack={goHome}
      />
    );
  }

  if (stage === 'genai') {
    if (!genaiTrack) {
      return <GenAIPlacementQuiz onComplete={goGenAIOverview} onBack={goHome} />;
    }
    return <GenAILaunchpadOverview track={genaiTrack} onBack={goHome} onStartPreRead={goGenAIPreRead} />;
  }

  if (stage === 'genai-quiz') {
    return <GenAIPlacementQuiz onComplete={goGenAIOverview} onBack={goHome} />;
  }

  if (stage === 'genai-reading' && genaiTrack) {
    return <GenAIPreRead1 track={genaiTrack} onBack={goBackToGenAIOverview} />;
  }

  if (stage === 'overview' && assignedTrack) {
    return (
      <CourseOverview
        track={assignedTrack}
        onStartModule={(num) => goReading(num)}
        onBack={goHome}
      />
    );
  }

  const goBackToOverview = () => {
    setStage('overview');
    localStorage.setItem(LS_STAGE, 'overview');
  };

  if (stage === 'reading' && assignedTrack) {
    if (activeModule === '02') {
      return <ProblemDiscoveryModule track={assignedTrack} onBack={goBackToOverview} />;
    }
    return (
      <PMFundamentalsModule
        startTrack={assignedTrack}
        onBack={goBackToOverview}
      />
    );
  }

  return null;
}

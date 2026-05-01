'use client';

import { useEffect, useState } from 'react';
import type { Track } from '@/components/pm-fundamentals/designSystem';
import SeriesHomepage from '@/components/SeriesHomepage';
import CourseOverview from '@/components/CourseOverview';
import PMFundamentalsModule from '@/components/PMFundamentalsModule';
import ProductStrategyModule from '@/components/ProductStrategyModule';
import ProblemDiscoveryModule from '@/components/ProblemDiscoveryModule';
import PrioritizationModule from '@/components/PrioritizationModule';
import UXDesignModule from '@/components/UXDesignModule';
import CommunicationPMModule from '@/components/CommunicationPMModule';
import AnalyticsPMModule from '@/components/AnalyticsPMModule';
import LaunchGrowthModule from '@/components/LaunchGrowthModule';
import Tech101SystemDesignModule from '@/components/Tech101SystemDesignModule';
import GenAILaunchpadOverview from '@/components/GenAILaunchpadOverview';
import GenAIPreRead1 from '@/components/GenAIPreRead1';
import GenAIPreRead2 from '@/components/GenAIPreRead2';
import GenAIPreRead3 from '@/components/GenAIPreRead3';
import GenAIPreRead4 from '@/components/GenAIPreRead4';
import GenAIPreRead5 from '@/components/GenAIPreRead5';
import GenAIPreRead6 from '@/components/GenAIPreRead6';
import GenAIPreRead7 from '@/components/GenAIPreRead7';
import SWETrackSelection from '@/components/SWETrackSelection';
import SWELaunchpadOverview from '@/components/SWELaunchpadOverview';
import SWEPreRead1 from '@/components/SWEPreRead1';
import SWELanguageBasics from '@/components/SWELanguageBasics';
import PythonPreRead1 from '@/components/PythonPreRead1';
import PythonPreRead2 from '@/components/PythonPreRead2';
import PythonPreRead3 from '@/components/PythonPreRead3';
import TrackChoiceCards, { type TrackChoiceOption } from '@/components/TrackChoiceCards';
import type { GenAITrack } from '@/components/genaiTypes';
import type { SWETrack, SWELevel } from '@/components/sweTypes';

type Stage = 'home' | 'quiz' | 'overview' | 'reading' | 'genai-quiz' | 'genai' | 'genai-reading' | 'swe-select' | 'swe-quiz' | 'swe' | 'swe-reading' | 'swe-lang-basics';

const LS_STAGE  = 'airtribe_stage';
const LS_TRACK  = 'airtribe_track';
const LS_GENAI_TRACK = 'airtribe_genai_track';
const LS_SWE_TRACK = 'airtribe_swe_track';
const LS_SWE_LEVEL = 'airtribe_swe_level';
const LS_DARK   = 'airtribe_dark';
const LS_MODULE = 'airtribe_module';

const PM_TRACK_OPTIONS: TrackChoiceOption<Track>[] = [
  {
    id: 'new-pm',
    eyebrow: 'PM track',
    title: 'New PM Foundations',
    description: 'Start here if you are building product judgment from first principles: user problems, decisions, tradeoffs, and working with teams.',
    accent: '#4F46E5',
    accentRgb: '79,70,229',
    icon: 'PM',
    details: ['Foundations', 'Story-led', 'Beginner friendly'],
  },
  {
    id: 'apm',
    eyebrow: 'PM track',
    title: 'APM Practice Track',
    description: 'Choose this if you want a faster applied path with sharper product scenarios, execution habits, and interview-ready thinking.',
    accent: '#0D7A5A',
    accentRgb: '13,122,90',
    icon: 'AP',
    details: ['Applied', 'Scenario heavy', 'Career prep'],
  },
];

const GENAI_TRACK_OPTIONS: TrackChoiceOption<GenAITrack>[] = [
  {
    id: 'non-tech',
    eyebrow: 'GenAI track',
    title: 'Operator Track',
    description: 'For product, business, operations, and growth learners who want to use AI well without needing to code the underlying systems.',
    accent: '#7C3AED',
    accentRgb: '124,58,237',
    icon: 'AI',
    details: ['No-code friendly', 'Workflows', 'Use cases'],
  },
  {
    id: 'tech',
    eyebrow: 'GenAI track',
    title: 'Builder Track',
    description: 'For technical learners who want to reason about prompts, retrieval, tools, automation, and production-grade AI behavior.',
    accent: '#2563EB',
    accentRgb: '37,99,235',
    icon: '</>',
    details: ['Technical', 'Systems', 'Automation'],
  },
];

const SWE_LEVEL_OPTIONS: TrackChoiceOption<SWELevel>[] = [
  {
    id: 'beginner',
    eyebrow: 'Starting level',
    title: 'Beginner',
    description: 'Choose this if you want the foundations explained carefully, with more mental models before implementation detail.',
    accent: '#16A34A',
    accentRgb: '22,163,74',
    icon: '01',
    details: ['Foundations', 'Slower ramp', 'More context'],
  },
  {
    id: 'advanced',
    eyebrow: 'Starting level',
    title: 'Advanced',
    description: 'Choose this if you already know basic programming and want denser explanations, stronger patterns, and faster practice.',
    accent: '#0369A1',
    accentRgb: '3,105,161',
    icon: '02',
    details: ['Faster ramp', 'Patterns', 'Practice heavy'],
  },
];

export default function Home() {
  const [stage, setStage] = useState<Stage>('home');
  const [assignedTrack, setAssignedTrack] = useState<Track | null>(null);
  const [genaiTrack, setGenaiTrack] = useState<GenAITrack | null>(null);
  const [sweTrack, setSweTrack] = useState<SWETrack | null>(null);
  const [sweLevel, setSweLevel] = useState<SWELevel | null>(null);
  const [activeModule, setActiveModule] = useState<string>('01');
  const [genaiModule, setGenaiModule] = useState<string>('01');
  const [sweModule, setSweModule] = useState<string>('01');
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
      setGenaiModule(localStorage.getItem('airtribe_genai_module') ?? '01');
    } else if (savedStage === 'swe-select') {
      setStage('swe-select');
    } else if (savedStage === 'swe-quiz') {
      setStage('swe-quiz');
      const savedSWETrack = localStorage.getItem(LS_SWE_TRACK) as SWETrack | null;
      if (savedSWETrack === 'python' || savedSWETrack === 'java' || savedSWETrack === 'nodejs') setSweTrack(savedSWETrack);
    } else if (savedStage === 'swe') {
      setStage('swe');
      const savedSWETrack = localStorage.getItem(LS_SWE_TRACK) as SWETrack | null;
      const savedSWELevel = localStorage.getItem(LS_SWE_LEVEL) as SWELevel | null;
      if (savedSWETrack === 'python' || savedSWETrack === 'java' || savedSWETrack === 'nodejs') setSweTrack(savedSWETrack);
      if (savedSWELevel === 'beginner' || savedSWELevel === 'advanced') setSweLevel(savedSWELevel);
    } else if (savedStage === 'swe-lang-basics') {
      setStage('swe-lang-basics');
      const savedSWETrack = localStorage.getItem(LS_SWE_TRACK) as SWETrack | null;
      const savedSWELevel = localStorage.getItem(LS_SWE_LEVEL) as SWELevel | null;
      if (savedSWETrack === 'python' || savedSWETrack === 'java' || savedSWETrack === 'nodejs') setSweTrack(savedSWETrack);
      if (savedSWELevel === 'beginner' || savedSWELevel === 'advanced') setSweLevel(savedSWELevel);
    } else if (savedStage === 'swe-reading') {
      setStage('swe-reading');
      const savedSWETrack = localStorage.getItem(LS_SWE_TRACK) as SWETrack | null;
      const savedSWELevel = localStorage.getItem(LS_SWE_LEVEL) as SWELevel | null;
      if (savedSWETrack === 'python' || savedSWETrack === 'java' || savedSWETrack === 'nodejs') setSweTrack(savedSWETrack);
      if (savedSWELevel === 'beginner' || savedSWELevel === 'advanced') setSweLevel(savedSWELevel);
      setSweModule(localStorage.getItem('airtribe_swe_module') ?? '01');
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
    setSweTrack(null);
    setSweLevel(null);
    localStorage.setItem(LS_STAGE, 'home');
    localStorage.removeItem(LS_TRACK);
    localStorage.removeItem(LS_GENAI_TRACK);
    localStorage.removeItem(LS_SWE_TRACK);
    localStorage.removeItem(LS_SWE_LEVEL);
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

  const goGenAIPreRead = (num: string = '01') => {
    setGenaiModule(num);
    setStage('genai-reading');
    localStorage.setItem(LS_STAGE, 'genai-reading');
    localStorage.setItem('airtribe_genai_module', num);
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

  const goSWE = () => {
    setStage('swe-select');
    localStorage.setItem(LS_STAGE, 'swe-select');
    localStorage.removeItem(LS_TRACK);
  };

  const goSWEQuiz = (track: SWETrack) => {
    setSweTrack(track);
    setStage('swe-quiz');
    localStorage.setItem(LS_STAGE, 'swe-quiz');
    localStorage.setItem(LS_SWE_TRACK, track);
  };

  const goSWEOverview = (level: SWELevel) => {
    setSweLevel(level);
    setStage('swe');
    localStorage.setItem(LS_STAGE, 'swe');
    localStorage.setItem(LS_SWE_LEVEL, level);
  };

  const goSWEPreRead = (moduleNum: string) => {
    if (moduleNum === '00') {
      setStage('swe-lang-basics');
      localStorage.setItem(LS_STAGE, 'swe-lang-basics');
    } else {
      setSweModule(moduleNum);
      setStage('swe-reading');
      localStorage.setItem(LS_STAGE, 'swe-reading');
      localStorage.setItem('airtribe_swe_module', moduleNum);
    }
  };

  const goBackToSWEOverview = () => {
    setStage('swe');
    localStorage.setItem(LS_STAGE, 'swe');
  };

  const goBackToSWESelect = () => {
    setStage('swe-select');
    setSweTrack(null);
    setSweLevel(null);
    localStorage.setItem(LS_STAGE, 'swe-select');
    localStorage.removeItem(LS_SWE_TRACK);
    localStorage.removeItem(LS_SWE_LEVEL);
  };

  const toggleDark = () => setDarkMode(d => !d);

  // Avoid flash of wrong screen before hydration
  if (!hydrated) return null;

  if (stage === 'home') {
    return (
      <SeriesHomepage
        onSelectPM={goQuiz}
        onSelectGenAI={goGenAI}
        onSelectSWE={goSWE}
        darkMode={darkMode}
        onToggleDark={toggleDark}
      />
    );
  }

  if (stage === 'swe-select') {
    return <SWETrackSelection onSelect={goSWEQuiz} onBack={goHome} />;
  }

  if (stage === 'swe-quiz') {
    if (!sweTrack) return <SWETrackSelection onSelect={goSWEQuiz} onBack={goHome} />;
    return (
      <TrackChoiceCards
        label={`${sweTrack.toUpperCase()} LEVEL`}
        title="Choose your starting level"
        subtitle="Pick the level that feels honest for where you are today; you can still review any module later."
        options={SWE_LEVEL_OPTIONS}
        onSelect={goSWEOverview}
        onBack={goBackToSWESelect}
      />
    );
  }

  if (stage === 'swe') {
    if (!sweTrack) return <SWETrackSelection onSelect={goSWEQuiz} onBack={goHome} />;
    if (!sweLevel) {
      return (
        <TrackChoiceCards
          label={`${sweTrack.toUpperCase()} LEVEL`}
          title="Choose your starting level"
          subtitle="Pick the level that feels honest for where you are today; you can still review any module later."
          options={SWE_LEVEL_OPTIONS}
          onSelect={goSWEOverview}
          onBack={goBackToSWESelect}
        />
      );
    }
    return <SWELaunchpadOverview track={sweTrack} level={sweLevel} onBack={goHome} onStartPreRead={goSWEPreRead} />;
  }

  if (stage === 'swe-lang-basics') {
    if (!sweTrack) return <SWETrackSelection onSelect={goSWEQuiz} onBack={goHome} />;
    if (!sweLevel) return <TrackChoiceCards label={`${sweTrack.toUpperCase()} LEVEL`} title="Choose your starting level" subtitle="Pick the level that feels honest for where you are today." options={SWE_LEVEL_OPTIONS} onSelect={goSWEOverview} onBack={goBackToSWESelect} />;
    return <SWELanguageBasics track={sweTrack} level={sweLevel} onBack={goBackToSWEOverview} />;
  }

  if (stage === 'swe-reading') {
    if (!sweTrack) return <SWETrackSelection onSelect={goSWEQuiz} onBack={goHome} />;
    if (!sweLevel) return <TrackChoiceCards label={`${sweTrack.toUpperCase()} LEVEL`} title="Choose your starting level" subtitle="Pick the level that feels honest for where you are today." options={SWE_LEVEL_OPTIONS} onSelect={goSWEOverview} onBack={goBackToSWESelect} />;
    
    if (sweTrack === 'python') {
      if (sweModule === '03') return <PythonPreRead3 onBack={goBackToSWEOverview} />;
      if (sweModule === '02') return <PythonPreRead2 onBack={goBackToSWEOverview} />;
      return <PythonPreRead1 onBack={goBackToSWEOverview} />;
    }

    return <SWEPreRead1 track={sweTrack} level={sweLevel} onBack={goBackToSWEOverview} />;
  }

  if (stage === 'quiz') {
    return (
      <TrackChoiceCards
        label="PM TRACK"
        title="Choose your PM path"
        subtitle="Choose the track that matches what you want to practice right now."
        options={PM_TRACK_OPTIONS}
        onSelect={goOverview}
        onBack={goHome}
      />
    );
  }

  if (stage === 'genai') {
    if (!genaiTrack) {
      return (
        <TrackChoiceCards
          label="GENAI TRACK"
          title="Choose your GenAI path"
          subtitle="Pick the lens you want: practical AI operations or technical AI building."
          options={GENAI_TRACK_OPTIONS}
          onSelect={goGenAIOverview}
          onBack={goHome}
        />
      );
    }
    return <GenAILaunchpadOverview track={genaiTrack} onBack={goHome} onStartModule={goGenAIPreRead} />;
  }

  if (stage === 'genai-quiz') {
    return (
      <TrackChoiceCards
        label="GENAI TRACK"
        title="Choose your GenAI path"
        subtitle="Pick the lens you want: practical AI operations or technical AI building."
        options={GENAI_TRACK_OPTIONS}
        onSelect={goGenAIOverview}
        onBack={goHome}
      />
    );
  }

  if (stage === 'genai-reading' && genaiTrack) {
    if (genaiModule === '07') return <GenAIPreRead7 track={genaiTrack} onBack={goBackToGenAIOverview} />;
    if (genaiModule === '06') return <GenAIPreRead6 track={genaiTrack} onBack={goBackToGenAIOverview} />;
    if (genaiModule === '05') return <GenAIPreRead5 track={genaiTrack} onBack={goBackToGenAIOverview} />;
    if (genaiModule === '04') return <GenAIPreRead4 track={genaiTrack} onBack={goBackToGenAIOverview} />;
    if (genaiModule === '03') return <GenAIPreRead3 track={genaiTrack} onBack={goBackToGenAIOverview} />;
    if (genaiModule === '02') return <GenAIPreRead2 track={genaiTrack} onBack={goBackToGenAIOverview} />;
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
      return <ProductStrategyModule track={assignedTrack} onBack={goBackToOverview} />;
    }
    if (activeModule === '03') {
      return <ProblemDiscoveryModule track={assignedTrack} onBack={goBackToOverview} />;
    }
    if (activeModule === '04') {
      return <PrioritizationModule track={assignedTrack} onBack={goBackToOverview} />;
    }
    if (activeModule === '05') {
      return <UXDesignModule track={assignedTrack} onBack={goBackToOverview} />;
    }
    if (activeModule === '06') {
      return <CommunicationPMModule track={assignedTrack} onBack={goBackToOverview} />;
    }
    if (activeModule === '07') {
      return <AnalyticsPMModule track={assignedTrack} onBack={goBackToOverview} />;
    }
    if (activeModule === '08') {
      return <LaunchGrowthModule track={assignedTrack} onBack={goBackToOverview} />;
    }
    if (activeModule === '09') {
      return <Tech101SystemDesignModule track={assignedTrack} onBack={goBackToOverview} />;
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

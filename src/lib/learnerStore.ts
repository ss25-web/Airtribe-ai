'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConceptState, createConceptState, updateConceptState, getOverallMastery, predictOptimalDifficulty } from './bkt';
import { FSRSCard, createCard, scheduleCard, Rating } from './fsrs';

export interface LearnerEvent {
  type: 'section_view' | 'section_complete' | 'quiz_attempt' | 'quiz_correct' | 'quiz_wrong' | 'concept_hover' | 'scroll_depth';
  data: Record<string, unknown>;
  timestamp: number;
}

export interface SessionMetrics {
  startTime: number;
  scrollDepth: number;
  sectionsViewed: string[];
  timePerSection: Record<string, number>;
  engagementScore: number;
}

interface LearnerStore {
  // Identity
  learnerId: string;

  // Knowledge state (BKT)
  conceptStates: Record<string, ConceptState>;
  recentAnswers: boolean[];

  // Spaced repetition (FSRS)
  cards: Record<string, FSRSCard>;

  // Session tracking
  currentSession: SessionMetrics | null;
  events: LearnerEvent[];

  // Adaptive settings
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  hintsUsed: number;
  streakDays: number;
  lastActiveDate: string;

  // Theme
  theme: 'dark' | 'light';

  // Actions
  initSession: () => void;
  trackEvent: (event: Omit<LearnerEvent, 'timestamp'>) => void;
  recordQuizAttempt: (conceptId: string, correct: boolean) => void;
  updateScrollDepth: (depth: number) => void;
  markSectionViewed: (sectionId: string) => void;
  reviewCard: (cardId: string, rating: Rating) => void;
  ensureConceptState: (conceptId: string) => void;
  ensureCard: (cardId: string, conceptId: string) => void;
  toggleTheme: () => void;
  getEngagementScore: () => number;
}

export const useLearnerStore = create<LearnerStore>()(
  persist(
    (set, get) => ({
      learnerId: `learner_${Math.random().toString(36).slice(2, 9)}`,
      conceptStates: {},
      recentAnswers: [],
      cards: {},
      currentSession: null,
      events: [],
      preferredDifficulty: 'medium',
      hintsUsed: 0,
      streakDays: 0,
      lastActiveDate: '',
      theme: 'dark',

      initSession: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastActiveDate, streakDays } = get();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        let newStreak = streakDays;
        if (lastActiveDate === yesterday) {
          newStreak = streakDays + 1;
        } else if (lastActiveDate !== today) {
          newStreak = 1;
        }

        set({
          currentSession: {
            startTime: Date.now(),
            scrollDepth: 0,
            sectionsViewed: [],
            timePerSection: {},
            engagementScore: 0,
          },
          lastActiveDate: today,
          streakDays: newStreak,
        });
      },

      trackEvent: (event) => {
        set(state => ({
          events: [...state.events.slice(-500), { ...event, timestamp: Date.now() }],
        }));
      },

      recordQuizAttempt: (conceptId, correct) => {
        set(state => {
          const existing = state.conceptStates[conceptId] ?? createConceptState(conceptId);
          const updated = updateConceptState(existing, correct);
          const newAnswers = [...state.recentAnswers, correct].slice(-10);
          const difficulty = predictOptimalDifficulty(newAnswers);

          return {
            conceptStates: { ...state.conceptStates, [conceptId]: updated },
            recentAnswers: newAnswers,
            preferredDifficulty: difficulty,
          };
        });

        get().trackEvent({
          type: correct ? 'quiz_correct' : 'quiz_wrong',
          data: { conceptId, correct },
        });
      },

      updateScrollDepth: (depth) => {
        set(state => ({
          currentSession: state.currentSession
            ? { ...state.currentSession, scrollDepth: Math.max(state.currentSession.scrollDepth, depth) }
            : null,
        }));
      },

      markSectionViewed: (sectionId) => {
        set(state => {
          if (!state.currentSession) return state;
          const viewed = state.currentSession.sectionsViewed;
          if (viewed.includes(sectionId)) return state;
          return {
            currentSession: {
              ...state.currentSession,
              sectionsViewed: [...viewed, sectionId],
            },
          };
        });

        get().trackEvent({ type: 'section_view', data: { sectionId } });
      },

      reviewCard: (cardId, rating) => {
        set(state => {
          const card = state.cards[cardId];
          if (!card) return state;
          return { cards: { ...state.cards, [cardId]: scheduleCard(card, rating) } };
        });
      },

      ensureConceptState: (conceptId) => {
        set(state => {
          if (state.conceptStates[conceptId]) return state;
          return {
            conceptStates: {
              ...state.conceptStates,
              [conceptId]: createConceptState(conceptId),
            },
          };
        });
      },

      ensureCard: (cardId, conceptId) => {
        set(state => {
          if (state.cards[cardId]) return state;
          return { cards: { ...state.cards, [cardId]: createCard(cardId, conceptId) } };
        });
      },

      toggleTheme: () => {
        set(state => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';
          if (typeof document !== 'undefined') {
            document.body.classList.toggle('light', newTheme === 'light');
          }
          return { theme: newTheme };
        });
      },

      getEngagementScore: () => {
        const { currentSession, events } = get();
        if (!currentSession) return 0;
        const scrollScore = currentSession.scrollDepth * 0.3;
        const sectionScore = Math.min(currentSession.sectionsViewed.length / 10, 1) * 0.3;
        const interactionScore = Math.min(events.filter(e =>
          e.timestamp > currentSession.startTime &&
          ['quiz_attempt', 'quiz_correct'].includes(e.type)
        ).length / 5, 1) * 0.4;
        return scrollScore + sectionScore + interactionScore;
      },
    }),
    {
      name: 'airtribe-learner',
      version: 2, // bumped: conceptStates now start at 0% not 35%
      partialize: (state) => ({
        learnerId: state.learnerId,
        conceptStates: state.conceptStates,
        cards: state.cards,
        recentAnswers: state.recentAnswers,
        preferredDifficulty: state.preferredDifficulty,
        streakDays: state.streakDays,
        lastActiveDate: state.lastActiveDate,
        theme: state.theme,
      }),
    }
  )
);

export function getOverallProgress(store: LearnerStore): number {
  const states = Object.values(store.conceptStates);
  if (states.length === 0) return 0;
  return getOverallMastery(states);
}

'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import { useSound } from './SoundManager';
import type { GeneratedQuiz } from '@/app/api/quiz/route';

interface StaticQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptId: string;
  keyInsight?: string;
}

interface QuizEngineProps {
  conceptId: string;
  conceptName: string;
  moduleContext: string;
  staticQuiz?: StaticQuiz;
  onComplete?: (correct: boolean) => void;
}

type QuizState = 'idle' | 'loading' | 'active' | 'answered' | 'error';

export default function QuizEngine({
  conceptId,
  conceptName,
  moduleContext,
  staticQuiz,
  onComplete,
}: QuizEngineProps) {
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [quiz, setQuiz] = useState<StaticQuiz | GeneratedQuiz | null>(staticQuiz || null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  const { recordQuizAttempt, conceptStates, preferredDifficulty, trackEvent } = useLearnerStore();
  const { playCorrect, playWrong, playReveal } = useSound();

  const conceptState = conceptStates[conceptId];

  useEffect(() => {
    if (staticQuiz) {
      setQuiz(staticQuiz);
      setQuizState('active');
    }
  }, [staticQuiz]);

  const generateQuiz = useCallback(async () => {
    setQuizState('loading');
    setSelectedOption(null);
    setShowExplanation(false);

    try {
      const masteredConcepts = Object.entries(conceptStates)
        .filter(([, s]) => s.masteryReached)
        .map(([id]) => id);

      const weakConcepts = Object.entries(conceptStates)
        .filter(([, s]) => s.pKnow < 0.4)
        .map(([id]) => id);

      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId,
          conceptName,
          difficulty: preferredDifficulty,
          moduleContext,
          masteredConcepts,
          weakConcepts,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');

      const generated: GeneratedQuiz = await res.json();
      setQuiz(generated);
      setQuizState('active');
      setGeneratedCount(c => c + 1);
      playReveal();
    } catch {
      setQuizState('error');
    }
  }, [conceptId, conceptName, preferredDifficulty, moduleContext, conceptStates, playReveal]);

  const handleAnswer = useCallback((index: number) => {
    if (quizState !== 'active' || !quiz) return;

    setSelectedOption(index);
    setQuizState('answered');

    const correct = index === quiz.correctIndex;

    recordQuizAttempt(conceptId, correct);
    trackEvent({ type: 'quiz_attempt', data: { conceptId, correct, selectedIndex: index } });

    if (correct) {
      playCorrect();
      setTimeout(() => setShowExplanation(true), 300);
    } else {
      playWrong();
      setTimeout(() => setShowExplanation(true), 400);
    }

    onComplete?.(correct);
  }, [quizState, quiz, conceptId, recordQuizAttempt, trackEvent, playCorrect, playWrong, onComplete]);

  const reset = useCallback(() => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (staticQuiz) {
      setQuiz(staticQuiz);
      setQuizState('active');
    } else {
      generateQuiz();
    }
  }, [staticQuiz, generateQuiz]);

  const isCorrect = selectedOption !== null && quiz && selectedOption === quiz.correctIndex;
  const difficultyColor = preferredDifficulty === 'hard' ? '#E07A5F' : preferredDifficulty === 'medium' ? '#7843EE' : '#0097A7';

  return (
    <div
      style={{
        background: 'var(--bg2)',
        border: '1px solid var(--dim)',
        borderRadius: 'var(--r)',
        padding: '28px',
        margin: '24px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Difficulty indicator */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: difficultyColor,
        opacity: 0.8,
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--purple-light)',
          }}>
            Quiz · {conceptName}
          </span>
          {conceptState && (
            <span style={{
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '20px',
              background: `color-mix(in srgb, ${difficultyColor} 15%, transparent)`,
              border: `1px solid ${difficultyColor}40`,
              color: difficultyColor,
              fontWeight: 600,
            }}>
              {preferredDifficulty}
            </span>
          )}
        </div>

        {conceptState && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--tx3)' }}>Mastery</span>
            <div style={{
              width: '60px',
              height: '4px',
              background: 'var(--dim)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <motion.div
                style={{ height: '100%', background: 'var(--green)', borderRadius: '2px' }}
                animate={{ width: `${conceptState.pKnow * 100}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--tx3)', minWidth: '28px' }}>
              {Math.round(conceptState.pKnow * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* States */}
      <AnimatePresence mode="wait">
        {quizState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '20px 0' }}
          >
            <p style={{ color: 'var(--tx2)', fontSize: '14px', marginBottom: '16px' }}>
              Ready for an adaptive quiz on <strong style={{ color: 'var(--tx)' }}>{conceptName}</strong>?
            </p>
            <button onClick={generateQuiz} style={btnStyle}>
              Generate Quiz ✦
            </button>
          </motion.div>
        )}

        {quizState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: '20px 0' }}
          >
            <div style={{
              height: '20px',
              borderRadius: '4px',
              marginBottom: '16px',
              width: '75%',
            }} className="shimmer" />
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                height: '48px',
                borderRadius: '10px',
                marginBottom: '8px',
              }} className="shimmer" />
            ))}
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span style={{
                fontSize: '12px',
                color: 'var(--tx3)',
                fontFamily: 'monospace',
              }}>
                Claude is crafting a {preferredDifficulty} question for you...
              </span>
            </div>
          </motion.div>
        )}

        {(quizState === 'active' || quizState === 'answered') && quiz && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p style={{
              fontSize: '17px',
              fontWeight: 700,
              marginBottom: '16px',
              lineHeight: 1.4,
              color: 'var(--tx)',
            }}>
              {quiz.question}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {quiz.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isRight = i === quiz.correctIndex;
                const answered = quizState === 'answered';

                let borderColor = 'var(--dim)';
                let bg = 'var(--bg3)';
                let textColor = 'var(--tx2)';

                if (answered) {
                  if (isRight) {
                    borderColor = 'var(--green)';
                    bg = 'var(--ok-bg)';
                    textColor = 'var(--tx)';
                  } else if (isSelected && !isRight) {
                    borderColor = 'var(--coral)';
                    bg = 'var(--no-bg)';
                  } else {
                    bg = 'var(--bg2)';
                    textColor = 'var(--tx3)';
                  }
                }

                return (
                  <motion.button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    whileHover={!answered ? { scale: 1.01, borderColor: 'var(--purple)' } : {}}
                    whileTap={!answered ? { scale: 0.99 } : {}}
                    style={{
                      padding: '14px 16px',
                      background: bg,
                      border: `1px solid ${borderColor}`,
                      borderRadius: '10px',
                      cursor: answered ? 'default' : 'pointer',
                      fontSize: '14px',
                      color: textColor,
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.2s',
                      opacity: answered && !isSelected && !isRight ? 0.4 : 1,
                    }}
                  >
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: `1.5px solid ${answered ? (isRight ? 'var(--green)' : isSelected ? 'var(--coral)' : 'var(--dim)') : 'var(--dim)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: answered && isRight ? 'var(--green)' : answered && isSelected ? 'var(--coral)' : 'var(--tx3)',
                      flexShrink: 0,
                    }}>
                      {answered && isRight ? '✓' : answered && isSelected && !isRight ? '✗' : 'ABCD'[i]}
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: '10px',
                    borderLeft: `3px solid ${isCorrect ? 'var(--green)' : 'var(--coral)'}`,
                    background: isCorrect ? 'var(--ok-bg)' : 'var(--no-bg)',
                  }}>
                    <div style={{
                      fontFamily: 'monospace',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: isCorrect ? 'var(--green)' : 'var(--coral)',
                      marginBottom: '6px',
                      fontWeight: 700,
                    }}>
                      {isCorrect ? '✓ Correct' : '✗ Not quite'}
                    </div>
                    <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--tx2)' }}>
                      {quiz.explanation}
                    </p>
                    {'keyInsight' in quiz && quiz.keyInsight && (
                      <div style={{
                        marginTop: '12px',
                        padding: '10px 14px',
                        background: 'rgba(120,67,238,0.08)',
                        borderRadius: '8px',
                        borderLeft: '3px solid var(--purple)',
                      }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--purple-light)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          Key Insight
                        </span>
                        <p style={{ fontSize: '13px', color: 'var(--tx2)', marginTop: '4px', fontStyle: 'italic' }}>
                          {quiz.keyInsight}
                        </p>
                      </div>
                    )}
                  </div>

                  {!staticQuiz && (
                    <div style={{ marginTop: '12px', textAlign: 'right' }}>
                      <button onClick={reset} style={{
                        ...btnStyle,
                        fontSize: '12px',
                        padding: '8px 18px',
                        background: 'transparent',
                        border: '1px solid var(--dim)',
                        color: 'var(--tx2)',
                      }}>
                        New Question →
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {quizState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '20px' }}
          >
            <p style={{ color: 'var(--coral)', marginBottom: '12px', fontSize: '14px' }}>
              Failed to generate quiz. Check your API key.
            </p>
            <button onClick={generateQuiz} style={btnStyle}>Retry</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '10px 24px',
  borderRadius: '40px',
  background: 'var(--purple)',
  color: '#fff',
  fontSize: '13px',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s',
};

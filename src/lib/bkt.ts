// Bayesian Knowledge Tracing (BKT)
// Models student knowledge as a Hidden Markov Model
// Predicts knowledge state for adaptive question selection

export interface BKTParams {
  pLearn: number;    // P(L0) - prior knowledge probability
  pTransit: number;  // P(T) - learning rate per attempt
  pSlip: number;     // P(S) - P(wrong | knows)
  pGuess: number;    // P(G) - P(correct | doesn't know)
}

export interface ConceptState {
  conceptId: string;
  pKnow: number;         // Current knowledge probability
  attempts: number;
  correct: number;
  lastUpdated: Date;
  masteryReached: boolean;
}

// Default BKT parameters calibrated for PM concepts
const DEFAULT_PARAMS: BKTParams = {
  pLearn: 0.0,   // start at 0% — mastery earned through activity only
  pTransit: 0.12,
  pSlip: 0.08,
  pGuess: 0.25,
};

const MASTERY_THRESHOLD = 0.85;

export function updateKnowledge(
  pKnow: number,
  correct: boolean,
  params: BKTParams = DEFAULT_PARAMS
): number {
  const { pTransit, pSlip, pGuess } = params;

  let pKnowGivenObs: number;

  if (correct) {
    const numerator = pKnow * (1 - pSlip);
    const denominator = pKnow * (1 - pSlip) + (1 - pKnow) * pGuess;
    pKnowGivenObs = denominator > 0 ? numerator / denominator : pKnow;
  } else {
    const numerator = pKnow * pSlip;
    const denominator = pKnow * pSlip + (1 - pKnow) * (1 - pGuess);
    pKnowGivenObs = denominator > 0 ? numerator / denominator : pKnow;
  }

  // Apply learning transition
  return pKnowGivenObs + (1 - pKnowGivenObs) * pTransit;
}

export function createConceptState(conceptId: string, initialPKnow?: number): ConceptState {
  return {
    conceptId,
    pKnow: initialPKnow ?? DEFAULT_PARAMS.pLearn,
    attempts: 0,
    correct: 0,
    lastUpdated: new Date(),
    masteryReached: false,
  };
}

export function updateConceptState(
  state: ConceptState,
  correct: boolean,
  params?: BKTParams
): ConceptState {
  const newPKnow = updateKnowledge(state.pKnow, correct, params);
  return {
    ...state,
    pKnow: newPKnow,
    attempts: state.attempts + 1,
    correct: state.correct + (correct ? 1 : 0),
    lastUpdated: new Date(),
    masteryReached: newPKnow >= MASTERY_THRESHOLD,
  };
}

export function getDifficultyForConcept(pKnow: number): 'easy' | 'medium' | 'hard' {
  if (pKnow < 0.4) return 'easy';
  if (pKnow < 0.7) return 'medium';
  return 'hard';
}

export function getWeakConcepts(states: ConceptState[], threshold = 0.5): ConceptState[] {
  return states
    .filter(s => s.pKnow < threshold)
    .sort((a, b) => a.pKnow - b.pKnow);
}

export function getMasteredConcepts(states: ConceptState[]): ConceptState[] {
  return states.filter(s => s.masteryReached);
}

export function getOverallMastery(states: ConceptState[]): number {
  if (states.length === 0) return 0;
  return states.reduce((sum, s) => sum + s.pKnow, 0) / states.length;
}

export function getLearningVelocity(
  states: ConceptState[],
  previousStates: ConceptState[]
): number {
  if (previousStates.length === 0) return 0;
  const currentMastery = getOverallMastery(states);
  const prevMastery = getOverallMastery(previousStates);
  return currentMastery - prevMastery;
}

// Predicts optimal quiz difficulty for engagement (Vygotsky ZPD)
// Target: 70-75% success rate
export function predictOptimalDifficulty(recentScores: boolean[]): 'easy' | 'medium' | 'hard' {
  if (recentScores.length < 3) return 'medium';
  const recentAccuracy = recentScores.slice(-5).filter(Boolean).length / Math.min(5, recentScores.length);
  if (recentAccuracy > 0.80) return 'hard';
  if (recentAccuracy < 0.50) return 'easy';
  return 'medium';
}

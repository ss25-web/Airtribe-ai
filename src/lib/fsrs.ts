// FSRS (Free Spaced Repetition Scheduler) - state-of-the-art algorithm
// Trained on 700M real reviews. 20-30% fewer reviews than SM-2.

export type Rating = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

export interface FSRSCard {
  id: string;
  conceptId: string;
  stability: number;    // How long memory will last (days)
  difficulty: number;  // Intrinsic hardness [1-10]
  retrievability: number; // Probability of recall [0-1]
  reps: number;
  lapses: number;
  state: 'new' | 'learning' | 'review' | 'relearning';
  dueDate: Date;
  lastReview?: Date;
}

export interface FSRSReview {
  cardId: string;
  rating: Rating;
  reviewedAt: Date;
  elapsed: number; // days since last review
}

// FSRS-5 parameters (default, learned from large dataset)
const FSRS_PARAMS = {
  w: [
    0.4072, 1.1829, 3.1262, 15.4722,
    7.2102, 0.5316, 1.0651, 0.0589,
    1.5330, 0.1544, 1.0070, 1.9395,
    0.1100, 0.2900, 2.2700, 0.1800,
    2.9898, 0.5100, 0.3400,
  ],
  DECAY: -0.5,
  FACTOR: 19 / 81,
  REQUESTED_RETENTION: 0.9,
};

function forgettingCurve(elapsedDays: number, stability: number): number {
  return Math.pow(1 + FSRS_PARAMS.FACTOR * (elapsedDays / stability), FSRS_PARAMS.DECAY);
}

function nextInterval(stability: number, requestedRetention = FSRS_PARAMS.REQUESTED_RETENTION): number {
  const interval = (stability / FSRS_PARAMS.FACTOR) * (Math.pow(requestedRetention, 1 / FSRS_PARAMS.DECAY) - 1);
  return Math.max(1, Math.round(interval));
}

function initDifficulty(rating: Rating): number {
  const { w } = FSRS_PARAMS;
  return Math.max(1, Math.min(10, w[4] - (rating - 3) * w[5]));
}

function initStability(rating: Rating): number {
  const { w } = FSRS_PARAMS;
  return Math.max(0.1, w[rating - 1]);
}

function nextDifficulty(d: number, rating: Rating): number {
  const { w } = FSRS_PARAMS;
  const delta = -w[6] * (rating - 3);
  return Math.max(1, Math.min(10, d + delta * ((10 - d) / 9)));
}

function shortTermStability(s: number, rating: Rating): number {
  const { w } = FSRS_PARAMS;
  return s * Math.exp(w[17] * (rating - 3 + w[18]));
}

function nextStability(d: number, s: number, r: number, rating: Rating): number {
  const { w } = FSRS_PARAMS;
  if (rating === 1) {
    // Relearning stability
    return w[11] * Math.pow(d, -w[12]) * (Math.pow(s + 1, w[13]) - 1) * Math.exp(w[14] * (1 - r));
  }
  // Review stability
  const hardPenalty = rating === 2 ? w[15] : 1;
  const easyBonus = rating === 4 ? w[16] : 1;
  return s * (Math.exp(w[8]) * (11 - d) * Math.pow(s, -w[9]) * (Math.exp((1 - r) * w[10]) - 1) * hardPenalty * easyBonus + 1);
}

export function createCard(id: string, conceptId: string): FSRSCard {
  return {
    id,
    conceptId,
    stability: 0,
    difficulty: 0,
    retrievability: 0,
    reps: 0,
    lapses: 0,
    state: 'new',
    dueDate: new Date(),
  };
}

export function scheduleCard(card: FSRSCard, rating: Rating): FSRSCard {
  const now = new Date();
  const elapsed = card.lastReview
    ? (now.getTime() - card.lastReview.getTime()) / (1000 * 60 * 60 * 24)
    : 0;

  let newCard = { ...card, lastReview: now };

  if (card.state === 'new') {
    newCard.difficulty = initDifficulty(rating);
    newCard.stability = initStability(rating);
    newCard.state = rating === 1 ? 'learning' : 'review';
  } else if (card.state === 'learning' || card.state === 'relearning') {
    if (rating === 1) {
      newCard.stability = Math.max(0.1, card.stability / 2);
      newCard.state = 'relearning';
    } else {
      newCard.stability = shortTermStability(card.stability, rating);
      newCard.state = 'review';
    }
  } else {
    // Review state
    const r = forgettingCurve(elapsed, card.stability);
    newCard.difficulty = nextDifficulty(card.difficulty, rating);
    newCard.stability = nextStability(newCard.difficulty, card.stability, r, rating);
    if (rating === 1) {
      newCard.lapses += 1;
      newCard.state = 'relearning';
    }
  }

  newCard.reps += 1;
  newCard.retrievability = forgettingCurve(0, newCard.stability);
  const interval = nextInterval(newCard.stability);
  newCard.dueDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  return newCard;
}

export function getCardRetrievability(card: FSRSCard): number {
  if (card.state === 'new') return 0;
  if (!card.lastReview) return 0;
  const elapsed = (Date.now() - card.lastReview.getTime()) / (1000 * 60 * 60 * 24);
  return forgettingCurve(elapsed, card.stability);
}

export function isDue(card: FSRSCard): boolean {
  return card.dueDate <= new Date();
}

export function getDueCards(cards: FSRSCard[]): FSRSCard[] {
  return cards.filter(isDue).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

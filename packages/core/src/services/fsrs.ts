/**
 * FSRS (Free Spaced Repetition Scheduler) Service
 * 
 * Implements the FSRS-4.5 algorithm with:
 * 1. Short-term scheduling (minute-level) for new/learning cards
 * 2. Long-term scheduling (day-level) for graduated cards
 * 3. Fuzz factor to prevent review date clustering
 * 
 * Reference: https://github.com/open-spaced-repetition/fsrs4anki
 */

import type {
  FSRSState,
  FSRSRating,
  FSRSParameters,
  SchedulingResult,
  UserWordProgress
} from "../types/vocabulary"
import {
  DEFAULT_FSRS_PARAMS,
  LEARNING_STEPS,
  LEARNING_GRADUATION_STEPS
} from "../types/vocabulary"

/**
 * FSRS-4.5 Algorithm Implementation
 */
export class FSRSScheduler {
  private params: FSRSParameters

  constructor(params: FSRSParameters = DEFAULT_FSRS_PARAMS) {
    this.params = params
  }

  /**
   * Calculate initial difficulty for a card based on first rating
   * D0(G) = w4 - (G-3) * w5
   */
  private initDifficulty(rating: FSRSRating): number {
    const { w } = this.params
    return Math.max(1, Math.min(10, w[4] - (rating - 3) * w[5]))
  }

  /**
   * Calculate initial stability for a card based on first rating
   * S0(G) = w[G-1]
   */
  private initStability(rating: FSRSRating): number {
    const { w } = this.params
    return Math.max(0.1, w[rating - 1])
  }

  /**
   * Calculate new difficulty after review
   * D'(D,G) = w7 * D0(G) + (1-w7) * D
   */
  private nextDifficulty(difficulty: number, rating: FSRSRating): number {
    const { w } = this.params
    const d0 = this.initDifficulty(rating)
    const newD = w[7] * d0 + (1 - w[7]) * difficulty

    // Mean reversion towards initial difficulty
    const meanReversion = w[7] * (d0 - newD)
    return Math.max(1, Math.min(10, newD + meanReversion))
  }

  /**
   * Calculate retrievability (recall probability)
   * R(t,S) = (1 + t/(9*S))^(-1)
   */
  private retrievability(elapsedDays: number, stability: number): number {
    if (stability <= 0) return 0
    return Math.pow(1 + elapsedDays / (9 * stability), -1)
  }

  /**
   * Calculate next interval based on desired retention
   * I(r,S) = 9*S*(1/r - 1)
   */
  private nextInterval(stability: number, retention: number = this.params.requestRetention): number {
    if (stability <= 0 || retention <= 0 || retention >= 1) return 1
    return Math.round(9 * stability * (1 / retention - 1))
  }

  /**
   * Calculate new stability after successful review (Good/Easy)
   * S'_r(D,S,R,G) = S * (e^w8 * (11-D) * S^(-w9) * (e^(w10*(1-R)) - 1) * w15 (if G=2) * w16 (if G=4) + 1)
   */
  private nextStabilitySuccess(
    difficulty: number,
    stability: number,
    retrievability: number,
    rating: FSRSRating
  ): number {
    const { w } = this.params
    const hardPenalty = rating === 2 ? w[15] : 1
    const easyBonus = rating === 4 ? w[16] : 1

    const newS = stability * (
      Math.exp(w[8]) *
      (11 - difficulty) *
      Math.pow(stability, -w[9]) *
      (Math.exp(w[10] * (1 - retrievability)) - 1) *
      hardPenalty *
      easyBonus + 1
    )

    return Math.max(0.1, Math.min(newS, this.params.maximumInterval))
  }

  /**
   * Calculate new stability after failed review (Again)
   * S'_f(D,S,R) = w11 * D^(-w12) * ((S+1)^w13 - 1) * e^(w14*(1-R))
   */
  private nextStabilityFailure(
    difficulty: number,
    stability: number,
    retrievability: number
  ): number {
    const { w } = this.params
    const newS = w[11] *
      Math.pow(difficulty, -w[12]) *
      (Math.pow(stability + 1, w[13]) - 1) *
      Math.exp(w[14] * (1 - retrievability))

    return Math.max(0.1, Math.min(newS, stability))
  }

  /**
   * Add fuzz factor to interval to prevent review clustering
   * Adds ±5% randomness to intervals > 2 days
   */
  private fuzzInterval(interval: number): number {
    if (interval <= 2) return interval
    
    const fuzzFactor = 0.05 // ±5%
    const fuzzRange = Math.max(1, Math.round(interval * fuzzFactor))
    const fuzz = Math.floor(Math.random() * (2 * fuzzRange + 1)) - fuzzRange
    
    return Math.max(1, interval + fuzz)
  }

  /**
   * Process a review and calculate the next scheduling
   */
  review(
    progress: Pick<UserWordProgress, 'state' | 'difficulty' | 'stability' | 'learning_step' | 'is_learning_phase' | 'elapsed_days' | 'reps' | 'lapses'>,
    rating: FSRSRating,
    now: Date = new Date()
  ): SchedulingResult {
    const { state, is_learning_phase } = progress

    // Handle cards in learning phase (minute-based scheduling)
    if (is_learning_phase || state === "new" || state === "learning") {
      return this.reviewLearningPhase(progress, rating, now)
    }

    // Handle cards in review phase (day-based scheduling)
    return this.reviewDayPhase(progress, rating, now)
  }

  /**
   * Handle learning phase review (minute-based scheduling)
   */
  private reviewLearningPhase(
    progress: Pick<UserWordProgress, 'state' | 'difficulty' | 'stability' | 'learning_step' | 'reps' | 'lapses'>,
    rating: FSRSRating,
    now: Date
  ): SchedulingResult {
    const { learning_step } = progress
    const intervalMinutes = LEARNING_STEPS[rating]

    // First review - initialize FSRS parameters
    if (progress.state === "new") {
      const newDifficulty = this.initDifficulty(rating)
      const newStability = this.initStability(rating)

      // Again: stay in learning phase at step 0
      if (rating === 1) {
        return {
          state: "learning",
          difficulty: newDifficulty,
          stability: newStability,
          retrievability: 1,
          elapsed_days: 0,
          scheduled_days: 0,
          due_at: new Date(now.getTime() + intervalMinutes * 60 * 1000),
          learning_step: 0,
          is_learning_phase: true
        }
      }

      // Easy: skip learning phase entirely, graduate to review
      if (rating === 4) {
        const interval = Math.max(1, this.nextInterval(newStability))
        return {
          state: "review",
          difficulty: newDifficulty,
          stability: newStability,
          retrievability: 1,
          elapsed_days: 0,
          scheduled_days: this.fuzzInterval(interval),
          due_at: this.addDays(now, this.fuzzInterval(interval)),
          learning_step: 0,
          is_learning_phase: false
        }
      }

      // Good/Hard: advance in learning phase
      const nextStep = rating === 3 ? 1 : 0
      const shouldGraduate = nextStep >= LEARNING_GRADUATION_STEPS

      if (shouldGraduate) {
        const interval = Math.max(1, this.nextInterval(newStability))
        return {
          state: "review",
          difficulty: newDifficulty,
          stability: newStability,
          retrievability: 1,
          elapsed_days: 0,
          scheduled_days: this.fuzzInterval(interval),
          due_at: this.addDays(now, this.fuzzInterval(interval)),
          learning_step: 0,
          is_learning_phase: false
        }
      }

      return {
        state: "learning",
        difficulty: newDifficulty,
        stability: newStability,
        retrievability: 1,
        elapsed_days: 0,
        scheduled_days: 0,
        due_at: new Date(now.getTime() + intervalMinutes * 60 * 1000),
        learning_step: nextStep,
        is_learning_phase: true
      }
    }

    // Already in learning phase
    const currentDifficulty = progress.difficulty || this.initDifficulty(3)
    const currentStability = progress.stability || this.initStability(3)

    // Again: reset to step 0
    if (rating === 1) {
      return {
        state: "learning",
        difficulty: currentDifficulty,
        stability: Math.max(0.1, currentStability * 0.5), // Reduce stability on lapse
        retrievability: 1,
        elapsed_days: 0,
        scheduled_days: 0,
        due_at: new Date(now.getTime() + intervalMinutes * 60 * 1000),
        learning_step: 0,
        is_learning_phase: true
      }
    }

    // Easy: graduate immediately
    if (rating === 4) {
      const newStability = Math.max(currentStability * 1.5, 1) // Boost stability
      const interval = Math.max(1, this.nextInterval(newStability))
      return {
        state: "review",
        difficulty: this.nextDifficulty(currentDifficulty, rating),
        stability: newStability,
        retrievability: 1,
        elapsed_days: 0,
        scheduled_days: this.fuzzInterval(interval),
        due_at: this.addDays(now, this.fuzzInterval(interval)),
        learning_step: 0,
        is_learning_phase: false
      }
    }

    // Good/Hard: advance step
    const stepIncrement = rating === 3 ? 1 : 0
    const nextStep = learning_step + stepIncrement
    const shouldGraduate = nextStep >= LEARNING_GRADUATION_STEPS

    if (shouldGraduate) {
      const interval = Math.max(1, this.nextInterval(currentStability))
      return {
        state: "review",
        difficulty: this.nextDifficulty(currentDifficulty, rating),
        stability: currentStability,
        retrievability: 1,
        elapsed_days: 0,
        scheduled_days: this.fuzzInterval(interval),
        due_at: this.addDays(now, this.fuzzInterval(interval)),
        learning_step: 0,
        is_learning_phase: false
      }
    }

    return {
      state: "learning",
      difficulty: currentDifficulty,
      stability: currentStability,
      retrievability: 1,
      elapsed_days: 0,
      scheduled_days: 0,
      due_at: new Date(now.getTime() + intervalMinutes * 60 * 1000),
      learning_step: nextStep,
      is_learning_phase: true
    }
  }

  /**
   * Handle day-phase review (FSRS algorithm)
   */
  private reviewDayPhase(
    progress: Pick<UserWordProgress, 'state' | 'difficulty' | 'stability' | 'elapsed_days' | 'reps' | 'lapses'>,
    rating: FSRSRating,
    now: Date
  ): SchedulingResult {
    const { difficulty, stability, elapsed_days } = progress
    const retrievability = this.retrievability(elapsed_days, stability)

    // Again: card lapses, go to relearning
    if (rating === 1) {
      const newStability = this.nextStabilityFailure(difficulty, stability, retrievability)
      const intervalMinutes = LEARNING_STEPS[1] // 1 minute

      return {
        state: "relearning",
        difficulty: this.nextDifficulty(difficulty, rating),
        stability: newStability,
        retrievability: 0,
        elapsed_days: 0,
        scheduled_days: 0,
        due_at: new Date(now.getTime() + intervalMinutes * 60 * 1000),
        learning_step: 0,
        is_learning_phase: true
      }
    }

    // Hard/Good/Easy: successful review
    const newDifficulty = this.nextDifficulty(difficulty, rating)
    const newStability = this.nextStabilitySuccess(difficulty, stability, retrievability, rating)
    const interval = Math.max(1, Math.min(this.nextInterval(newStability), this.params.maximumInterval))
    const fuzzedInterval = this.fuzzInterval(interval)

    return {
      state: "review",
      difficulty: newDifficulty,
      stability: newStability,
      retrievability: this.retrievability(0, newStability),
      elapsed_days: 0,
      scheduled_days: fuzzedInterval,
      due_at: this.addDays(now, fuzzedInterval),
      learning_step: 0,
      is_learning_phase: false
    }
  }

  /**
   * Add days to a date
   */
  private addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  /**
   * Calculate estimated review intervals for display
   */
  getSchedulePreview(
    progress: Pick<UserWordProgress, 'state' | 'difficulty' | 'stability' | 'learning_step' | 'is_learning_phase' | 'elapsed_days' | 'reps' | 'lapses'>
  ): Record<FSRSRating, string> {
    const now = new Date()
    const previews: Record<FSRSRating, string> = {
      1: "",
      2: "",
      3: "",
      4: ""
    }

    for (const rating of [1, 2, 3, 4] as FSRSRating[]) {
      const result = this.review(progress, rating, now)
      if (result.is_learning_phase) {
        const minutes = Math.round((result.due_at.getTime() - now.getTime()) / 60000)
        if (minutes < 60) {
          previews[rating] = `${minutes}m`
        } else {
          previews[rating] = `${Math.round(minutes / 60)}h`
        }
      } else {
        const days = result.scheduled_days
        if (days === 1) {
          previews[rating] = "1d"
        } else if (days < 30) {
          previews[rating] = `${days}d`
        } else if (days < 365) {
          previews[rating] = `${Math.round(days / 30)}mo`
        } else {
          previews[rating] = `${Math.round(days / 365)}y`
        }
      }
    }

    return previews
  }
}

/**
 * Default FSRS scheduler instance
 */
export const fsrsScheduler = new FSRSScheduler()

/**
 * Helper function to create initial word progress
 */
export function createInitialWordProgress(
  userId: string,
  wordId: string,
  bookId: string
): Omit<UserWordProgress, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
    word_id: wordId,
    book_id: bookId,
    state: "new",
    difficulty: 0,
    stability: 0,
    retrievability: 1,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    learning_step: 0,
    is_learning_phase: true,
    last_review_at: null,
    due_at: new Date().toISOString(),
    total_reviews: 0,
    correct_reviews: 0
  }
}

/**
 * Convert FSRSState to display mastery level
 */
export function stateToMasteryLevel(state: FSRSState, stability: number): "new" | "learning" | "mastered" {
  if (state === "new") return "new"
  if (state === "review" && stability > 21) return "mastered" // Stable for 3+ weeks
  return "learning"
}


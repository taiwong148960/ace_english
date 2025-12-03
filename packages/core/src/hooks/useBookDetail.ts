/**
 * useBookDetail Hook
 * Manages state and data fetching for the vocabulary book detail page
 */

import { useState, useEffect, useCallback } from "react"
import {
  getBookWithDetails,
  getTodayLearningSession,
  getRecentWords,
  getDifficultWords,
  initializeBookProgress
} from "../services/vocabulary-detail"
import { stateToMasteryLevel } from "../services/fsrs"
import type {
  VocabularyBook,
  UserBookProgress,
  BookDetailStats,
  WordWithProgress,
  TodayLearningSession,
  FSRSState
} from "../types/vocabulary"

/**
 * Book detail page data
 */
export interface BookDetailData {
  book: VocabularyBook | null
  progress: UserBookProgress | null
  stats: BookDetailStats | null
  recentWords: WordWithProgress[]
  difficultWords: WordWithProgress[]
  todaySession: TodayLearningSession | null
  isLoading: boolean
  error: string | null
}

/**
 * Hook return type
 */
export interface UseBookDetailReturn extends BookDetailData {
  refetch: () => Promise<void>
  initializeProgress: () => Promise<void>
}

/**
 * Default book stats
 */
const defaultStats: BookDetailStats = {
  totalWords: 0,
  mastered: 0,
  learning: 0,
  newWords: 0,
  todayReview: 0,
  todayNew: 0,
  estimatedMinutes: 0,
  streak: 0,
  accuracy: 0,
  averageStability: 0
}

/**
 * Hook for managing vocabulary book detail page data
 */
export function useBookDetail(bookId: string | null, userId: string | null): UseBookDetailReturn {
  const [book, setBook] = useState<VocabularyBook | null>(null)
  const [progress, setProgress] = useState<UserBookProgress | null>(null)
  const [stats, setStats] = useState<BookDetailStats | null>(null)
  const [recentWords, setRecentWords] = useState<WordWithProgress[]>([])
  const [difficultWords, setDifficultWords] = useState<WordWithProgress[]>([])
  const [todaySession, setTodaySession] = useState<TodayLearningSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch all book detail data
   */
  const fetchData = useCallback(async () => {
    if (!bookId || !userId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Fetch book with details
      const bookData = await getBookWithDetails(bookId, userId)
      
      if (!bookData) {
        setError("Book not found")
        setIsLoading(false)
        return
      }

      setBook(bookData.book)
      setProgress(bookData.progress)
      setStats(bookData.stats)

      // Fetch related data in parallel
      const [recent, difficult, session] = await Promise.all([
        getRecentWords(bookId, userId, 5),
        getDifficultWords(bookId, userId, 5),
        getTodayLearningSession(bookId, userId)
      ])

      setRecentWords(recent)
      setDifficultWords(difficult)
      setTodaySession(session)
    } catch (err) {
      console.error("Error fetching book detail:", err)
      setError(err instanceof Error ? err.message : "Failed to load book details")
    } finally {
      setIsLoading(false)
    }
  }, [bookId, userId])

  /**
   * Initialize book progress if not exists
   */
  const initializeProgress = useCallback(async () => {
    if (!bookId || !userId) return

    try {
      const newProgress = await initializeBookProgress(userId, bookId)
      if (newProgress) {
        setProgress(newProgress)
      }
    } catch (err) {
      console.error("Error initializing progress:", err)
    }
  }, [bookId, userId])

  // Fetch data on mount and when bookId/userId changes
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    book,
    progress,
    stats,
    recentWords,
    difficultWords,
    todaySession,
    isLoading,
    error,
    refetch: fetchData,
    initializeProgress
  }
}

/**
 * Convert WordWithProgress to display format
 */
export function formatWordForDisplay(word: WordWithProgress): {
  id: string
  word: string
  mastery: "new" | "learning" | "mastered"
  lastReviewed: string | null
  nextReview: string | null
} {
  const mastery = stateToMasteryLevel(word.state, word.stability)
  
  return {
    id: word.id,
    word: word.word,
    mastery,
    lastReviewed: word.last_review_at ? formatRelativeTime(word.last_review_at) : null,
    nextReview: word.due_at ? formatRelativeTime(word.due_at, true) : null
  }
}

/**
 * Format timestamp to relative time
 */
function formatRelativeTime(timestamp: string, isFuture: boolean = false): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = isFuture ? date.getTime() - now.getTime() : now.getTime() - date.getTime()
  
  if (diffMs < 0 && isFuture) return "now"
  
  const diffMinutes = Math.abs(Math.round(diffMs / 60000))
  
  if (diffMinutes < 1) return "just now"
  if (diffMinutes < 60) return `${diffMinutes}m ${isFuture ? "" : "ago"}`
  
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ${isFuture ? "" : "ago"}`
  
  const diffDays = Math.round(diffHours / 24)
  if (diffDays === 1) return isFuture ? "tomorrow" : "yesterday"
  if (diffDays < 7) return `${diffDays}d ${isFuture ? "" : "ago"}`
  
  const diffWeeks = Math.round(diffDays / 7)
  if (diffWeeks < 4) return `${diffWeeks}w ${isFuture ? "" : "ago"}`
  
  const diffMonths = Math.round(diffDays / 30)
  return `${diffMonths}mo ${isFuture ? "" : "ago"}`
}

export default useBookDetail


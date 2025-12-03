/**
 * useVocabularyBooks Hook
 * TanStack Query hook for fetching vocabulary books with progress
 */

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserBooksWithProgress, getSystemBooksWithProgress } from "../services/vocabulary"
import { queryKeys } from "../query"
import type { VocabularyBookWithProgress } from "../types/vocabulary"

interface UseVocabularyBooksOptions {
  userId: string | undefined
  isAuthenticated: boolean
  enabled?: boolean
}

interface UseVocabularyBooksReturn {
  userBooks: VocabularyBookWithProgress[]
  systemBooks: VocabularyBookWithProgress[]
  isLoading: boolean
  isRefetching: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook for fetching vocabulary books (user and system) with progress
 */
export function useVocabularyBooks({
  userId,
  isAuthenticated,
  enabled = true
}: UseVocabularyBooksOptions): UseVocabularyBooksReturn {
  // Fetch user books (only if authenticated)
  const userBooksQuery = useQuery({
    queryKey: queryKeys.vocabularyBooks.user(userId || ""),
    queryFn: () => getUserBooksWithProgress(userId!),
    enabled: enabled && isAuthenticated && !!userId,
    staleTime: 2 * 60 * 1000 // 2 minutes
  })

  // Fetch system books (always available)
  const systemBooksQuery = useQuery({
    queryKey: queryKeys.vocabularyBooks.system(userId || ""),
    queryFn: () => getSystemBooksWithProgress(userId || ""),
    enabled: enabled,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  const refetch = async () => {
    await Promise.all([
      systemBooksQuery.refetch(),
      isAuthenticated && userId ? userBooksQuery.refetch() : Promise.resolve()
    ])
  }

  return {
    userBooks: userBooksQuery.data ?? [],
    systemBooks: systemBooksQuery.data ?? [],
    isLoading: userBooksQuery.isLoading || systemBooksQuery.isLoading,
    isRefetching: userBooksQuery.isRefetching || systemBooksQuery.isRefetching,
    error: userBooksQuery.error ?? systemBooksQuery.error ?? null,
    refetch
  }
}

/**
 * Invalidate vocabulary books cache
 * Call this after creating, updating, or deleting a book
 */
export function useInvalidateVocabularyBooks() {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: queryKeys.vocabularyBooks.all }),
    invalidateUser: (userId: string) => 
      queryClient.invalidateQueries({ queryKey: queryKeys.vocabularyBooks.user(userId) }),
    invalidateSystem: (userId: string) => 
      queryClient.invalidateQueries({ queryKey: queryKeys.vocabularyBooks.system(userId) })
  }
}

export default useVocabularyBooks


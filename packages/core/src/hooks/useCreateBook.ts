/**
 * useCreateBook Hook
 * TanStack Query mutation hook for creating vocabulary books
 */

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBook } from "../services/vocabulary"
import { queryKeys } from "../query"
import type { CreateVocabularyBookInput, VocabularyBook } from "../types/vocabulary"

interface UseCreateBookOptions {
  userId: string
  onSuccess?: (book: VocabularyBook) => void
  onError?: (error: Error) => void
}

interface UseCreateBookReturn {
  createBook: (input: CreateVocabularyBookInput) => Promise<VocabularyBook>
  isCreating: boolean
  error: Error | null
  reset: () => void
}

/**
 * Hook for creating a new vocabulary book
 */
export function useCreateBook({
  userId,
  onSuccess,
  onError
}: UseCreateBookOptions): UseCreateBookReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (input: CreateVocabularyBookInput) => createBook(userId, input),
    onSuccess: (data) => {
      // Invalidate user books cache to refetch with new book
      queryClient.invalidateQueries({ queryKey: queryKeys.vocabularyBooks.user(userId) })
      onSuccess?.(data)
    },
    onError: (error: Error) => {
      onError?.(error)
    }
  })

  return {
    createBook: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error ?? null,
    reset: mutation.reset
  }
}

export default useCreateBook


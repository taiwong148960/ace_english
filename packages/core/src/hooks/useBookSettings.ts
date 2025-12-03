/**
 * useBookSettings Hook
 * TanStack Query hook for managing vocabulary book settings
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getBookSettings, updateBookSettings } from "../services/vocabulary"
import { queryKeys } from "../query"
import type { BookSettings, UpdateBookSettingsInput } from "../types/vocabulary"

interface UseBookSettingsOptions {
  userId: string
  bookId: string
  enabled?: boolean
}

interface UseBookSettingsReturn {
  settings: BookSettings | undefined
  isLoading: boolean
  error: Error | null
  updateSettings: (input: UpdateBookSettingsInput) => Promise<BookSettings>
  isUpdating: boolean
  updateError: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook for fetching and updating book settings
 */
export function useBookSettings({
  userId,
  bookId,
  enabled = true
}: UseBookSettingsOptions): UseBookSettingsReturn {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.vocabularyBooks.settings(userId, bookId)

  // Query for fetching settings
  const settingsQuery = useQuery({
    queryKey,
    queryFn: () => getBookSettings(userId, bookId),
    enabled: enabled && !!userId && !!bookId,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Mutation for updating settings
  const updateMutation = useMutation({
    mutationFn: (input: UpdateBookSettingsInput) => updateBookSettings(userId, bookId, input),
    onSuccess: (data) => {
      // Update the cache with the new data
      queryClient.setQueryData(queryKey, data)
    }
  })

  const refetch = async () => {
    await settingsQuery.refetch()
  }

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    error: settingsQuery.error ?? null,
    updateSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error ?? null,
    refetch
  }
}

export default useBookSettings


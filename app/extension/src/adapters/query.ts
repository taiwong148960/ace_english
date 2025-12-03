/**
 * QueryClient setup for Chrome Extension
 * Provides a shared QueryClient configuration for all extension entry points
 */

import { QueryClient } from "@ace-ielts/core"

/**
 * Create a QueryClient instance configured for the extension
 */
export function createExtensionQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false
      },
      mutations: {
        retry: 1
      }
    }
  })
}

// Export a singleton for the extension
// Each tab/popup will have its own instance since they are separate contexts
export const extensionQueryClient = createExtensionQueryClient()


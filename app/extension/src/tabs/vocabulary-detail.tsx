import React, { useEffect } from "react"
import {
  PlatformProvider,
  setLanguageStorageAdapter,
  initI18nWithStorage,
  QueryClientProvider
} from "@ace-ielts/core"
import { VocabularyBookDetail } from "@ace-ielts/ui"
import { 
  extensionPlatformContext, 
  extensionLanguageStorageAdapter,
  createExtensionQueryClient 
} from "../adapters"

import "../styles/globals.css"

// Configure i18n with extension storage
setLanguageStorageAdapter(extensionLanguageStorageAdapter)

// Create QueryClient instance for this tab
const queryClient = createExtensionQueryClient()

/**
 * Plasmo Tab Entry Point for Vocabulary Book Detail
 * This creates a new tab page accessible via chrome-extension://[id]/tabs/vocabulary-detail.html
 */
function VocabularyDetailTab() {
  useEffect(() => {
    // Initialize i18n with stored language
    initI18nWithStorage()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <PlatformProvider context={extensionPlatformContext}>
        <VocabularyBookDetail />
      </PlatformProvider>
    </QueryClientProvider>
  )
}

export default VocabularyDetailTab

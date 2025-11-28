import React, { useEffect } from "react"
import {
  PlatformProvider,
  setLanguageStorageAdapter,
  initI18nWithStorage
} from "@ace-ielts/core"
import { VocabularyBooks } from "@ace-ielts/ui"
import { extensionPlatformContext, extensionLanguageStorageAdapter } from "../adapters"

import "../styles/globals.css"

// Configure i18n with extension storage
setLanguageStorageAdapter(extensionLanguageStorageAdapter)

/**
 * Plasmo Tab Entry Point for Vocabulary Books
 * This creates a new tab page accessible via chrome-extension://[id]/tabs/vocabulary.html
 */
function VocabularyTab() {
  useEffect(() => {
    // Initialize i18n with stored language
    initI18nWithStorage()
  }, [])

  return (
    <PlatformProvider context={extensionPlatformContext}>
      <VocabularyBooks />
    </PlatformProvider>
  )
}

export default VocabularyTab


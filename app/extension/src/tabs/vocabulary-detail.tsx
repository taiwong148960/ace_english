import React, { useEffect } from "react"
import {
  PlatformProvider,
  setLanguageStorageAdapter,
  initI18nWithStorage
} from "@ace-ielts/core"
import { VocabularyBookDetail } from "@ace-ielts/ui"
import { extensionPlatformContext, extensionLanguageStorageAdapter } from "../adapters"

import "../styles/globals.css"

// Configure i18n with extension storage
setLanguageStorageAdapter(extensionLanguageStorageAdapter)

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
    <PlatformProvider context={extensionPlatformContext}>
      <VocabularyBookDetail />
    </PlatformProvider>
  )
}

export default VocabularyDetailTab


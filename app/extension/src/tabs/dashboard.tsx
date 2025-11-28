import React, { useEffect } from "react"
import {
  PlatformProvider,
  setLanguageStorageAdapter,
  initI18nWithStorage
} from "@ace-ielts/core"
import { Dashboard } from "@ace-ielts/ui"
import { extensionPlatformContext, extensionLanguageStorageAdapter } from "../adapters"

import "../styles/globals.css"

// Configure i18n with extension storage
setLanguageStorageAdapter(extensionLanguageStorageAdapter)

/**
 * Plasmo Tab Entry Point
 * This creates a new tab page accessible via chrome-extension://[id]/tabs/dashboard.html
 */
function DashboardTab() {
  useEffect(() => {
    // Initialize i18n with stored language
    initI18nWithStorage()
  }, [])

  return (
    <PlatformProvider context={extensionPlatformContext}>
      <Dashboard />
    </PlatformProvider>
  )
}

export default DashboardTab

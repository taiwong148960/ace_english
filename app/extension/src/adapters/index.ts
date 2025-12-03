/**
 * Chrome Extension Platform Adapters
 * Barrel export for all extension-specific adapters
 */

import type { IPlatformContext, LanguageStorageAdapter } from "@ace-ielts/core"
import { chromeStorageAdapter } from "./storage"
import { chromeNavigationAdapter } from "./navigation"
import { chromeEnvironmentAdapter } from "./environment"

/**
 * Complete platform context for Chrome extension
 */
export const extensionPlatformContext: IPlatformContext = {
  platform: "extension",
  storage: chromeStorageAdapter,
  navigation: chromeNavigationAdapter,
  environment: chromeEnvironmentAdapter
}

/**
 * Language storage adapter for i18n using chrome.storage
 */
export const extensionLanguageStorageAdapter: LanguageStorageAdapter = {
  async getLanguage() {
    const result = await chromeStorageAdapter.get<string>("ace-ielts-language")
    return result as "en" | "zh" | null
  },
  async setLanguage(lng) {
    await chromeStorageAdapter.set("ace-ielts-language", lng)
  }
}

export { chromeStorageAdapter, chromeNavigationAdapter, chromeEnvironmentAdapter }
export { extensionQueryClient, createExtensionQueryClient } from "./query"

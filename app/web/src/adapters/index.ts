/**
 * Web Platform Adapters
 * Barrel export for all web-specific adapters
 */

import type { IPlatformContext, LanguageStorageAdapter } from "@ace-ielts/core"
import { webStorageAdapter } from "./storage"
import { webNavigationAdapter, createWebNavigationAdapter } from "./navigation"
import { webEnvironmentAdapter } from "./environment"

/**
 * Complete platform context for Web
 */
export const webPlatformContext: IPlatformContext = {
  platform: "web",
  storage: webStorageAdapter,
  navigation: webNavigationAdapter,
  environment: webEnvironmentAdapter
}

/**
 * Create a platform context with custom navigation (for React Router integration)
 */
export function createWebPlatformContext(
  navigate: (path: string) => void
): IPlatformContext {
  return {
    platform: "web",
    storage: webStorageAdapter,
    navigation: createWebNavigationAdapter(navigate),
    environment: webEnvironmentAdapter
  }
}

/**
 * Language storage adapter for i18n using localStorage
 */
export const webLanguageStorageAdapter: LanguageStorageAdapter = {
  async getLanguage() {
    const result = await webStorageAdapter.get<string>("ace-ielts-language")
    return result as "en" | "zh" | null
  },
  async setLanguage(lng) {
    await webStorageAdapter.set("ace-ielts-language", lng)
  }
}

export { webStorageAdapter, webNavigationAdapter, webEnvironmentAdapter, createWebNavigationAdapter }

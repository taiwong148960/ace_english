/**
 * Chrome Extension Environment Adapter
 * Implements IEnvironmentAdapter for extension context
 */

import type { IEnvironmentAdapter, Platform } from "@ace-ielts/core"

/**
 * Chrome extension environment adapter
 */
export const chromeEnvironmentAdapter: IEnvironmentAdapter = {
  getPlatform(): Platform {
    return "extension"
  },

  isDevelopment(): boolean {
    // Check if running in development mode
    return process.env.NODE_ENV === "development"
  },

  getBaseUrl(): string {
    return chrome.runtime.getURL("")
  },

  getApiUrl(): string {
    // In development, use mock data
    // In production, use the real API URL
    return process.env.PLASMO_PUBLIC_API_URL || ""
  }
}

export default chromeEnvironmentAdapter


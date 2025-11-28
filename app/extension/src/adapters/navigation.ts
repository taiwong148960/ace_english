/**
 * Chrome Extension Navigation Adapter
 * Implements INavigationAdapter for extension context
 */

import type { INavigationAdapter } from "@ace-ielts/core"

/**
 * Map routes to extension tab files
 * Handles nested routes like /vocabulary/:id by mapping to appropriate tabs
 */
function resolveTabPath(path: string): string {
  // Remove leading slash
  const cleanPath = path.replace(/^\//, "")
  
  // Map routes to tab files
  if (cleanPath === "dashboard" || cleanPath === "") {
    return "dashboard"
  }
  
  // Vocabulary routes
  if (cleanPath.match(/^vocabulary\/[^/]+\/learn$/)) {
    // /vocabulary/:id/learn -> vocabulary-learn
    return "vocabulary-learn"
  }
  if (cleanPath.match(/^vocabulary\/[^/]+$/)) {
    // /vocabulary/:id -> vocabulary-detail
    return "vocabulary-detail"
  }
  if (cleanPath === "vocabulary") {
    return "vocabulary"
  }
  
  // Default: use the clean path
  return cleanPath
}

/**
 * Chrome extension navigation adapter
 */
export const chromeNavigationAdapter: INavigationAdapter = {
  navigate(path: string): void {
    // For extension, navigate within tabs
    const tabPath = resolveTabPath(path)
    const fullUrl = chrome.runtime.getURL(`tabs/${tabPath}.html`)
    chrome.tabs.create({ url: fullUrl })
  },

  openExternal(url: string): void {
    chrome.tabs.create({ url })
  },

  getCurrentPath(): string {
    // Get the current page path from URL
    const url = window.location.href
    const match = url.match(/tabs\/([^.]+)\.html/)
    return match ? match[1] : "dashboard"
  },

  goBack(): void {
    window.history.back()
  }
}

export default chromeNavigationAdapter


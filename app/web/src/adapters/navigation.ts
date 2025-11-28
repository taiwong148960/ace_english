/**
 * Web Platform Navigation Adapter
 * Implements INavigationAdapter for web context using React Router
 */

import type { INavigationAdapter } from "@ace-ielts/core"

/**
 * Create a web navigation adapter with router integration
 */
export function createWebNavigationAdapter(
  navigate: (path: string) => void
): INavigationAdapter {
  return {
    navigate(path: string): void {
      navigate(path)
    },

    openExternal(url: string): void {
      window.open(url, "_blank", "noopener,noreferrer")
    },

    getCurrentPath(): string {
      return window.location.pathname
    },

    goBack(): void {
      window.history.back()
    }
  }
}

/**
 * Default web navigation adapter (without router)
 */
export const webNavigationAdapter: INavigationAdapter = {
  navigate(path: string): void {
    window.location.href = path
  },

  openExternal(url: string): void {
    window.open(url, "_blank", "noopener,noreferrer")
  },

  getCurrentPath(): string {
    return window.location.pathname
  },

  goBack(): void {
    window.history.back()
  }
}

export default webNavigationAdapter



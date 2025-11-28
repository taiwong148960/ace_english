/**
 * Web Platform Environment Adapter
 * Implements IEnvironmentAdapter for web context
 */

import type { IEnvironmentAdapter, Platform } from "@ace-ielts/core"

/**
 * Web environment adapter
 */
export const webEnvironmentAdapter: IEnvironmentAdapter = {
  getPlatform(): Platform {
    return "web"
  },

  isDevelopment(): boolean {
    return import.meta.env.DEV
  },

  getBaseUrl(): string {
    return import.meta.env.BASE_URL || ""
  },

  getApiUrl(): string {
    return import.meta.env.VITE_API_URL || ""
  }
}

export default webEnvironmentAdapter



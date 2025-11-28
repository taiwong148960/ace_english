/**
 * Web Platform Storage Adapter
 * Implements IStorageAdapter using localStorage API
 */

import type { IStorageAdapter } from "@ace-ielts/core"

/**
 * Web localStorage adapter
 */
export const webStorageAdapter: IStorageAdapter = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      console.error("Failed to save to localStorage:", key)
    }
  },

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key)
  },

  async clear(): Promise<void> {
    localStorage.clear()
  }
}

export default webStorageAdapter



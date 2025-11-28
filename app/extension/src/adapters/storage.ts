/**
 * Chrome Extension Storage Adapter
 * Implements IStorageAdapter using chrome.storage.local API
 */

import type { IStorageAdapter } from "@ace-ielts/core"

/**
 * Chrome extension storage adapter using chrome.storage.local
 */
export const chromeStorageAdapter: IStorageAdapter = {
  async get<T>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] ?? null)
      })
    })
  },

  async set<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve()
      })
    })
  },

  async remove(key: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove([key], () => {
        resolve()
      })
    })
  },

  async clear(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.clear(() => {
        resolve()
      })
    })
  }
}

export default chromeStorageAdapter


import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/en.json"
import zh from "./locales/zh.json"

/**
 * Supported languages configuration
 */
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "zh", name: "Chinese", nativeName: "中文" }
] as const

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"]

/**
 * Default language fallback
 */
const DEFAULT_LANGUAGE: LanguageCode = "en"

/**
 * Storage adapter interface for cross-platform language persistence
 */
export interface LanguageStorageAdapter {
  getLanguage(): Promise<LanguageCode | null>
  setLanguage(lng: LanguageCode): Promise<void>
}

/**
 * Default localStorage adapter
 */
const defaultStorageAdapter: LanguageStorageAdapter = {
  async getLanguage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ace-ielts-language")
      if (stored && SUPPORTED_LANGUAGES.some((lang) => lang.code === stored)) {
        return stored as LanguageCode
      }
    }
    return null
  },
  async setLanguage(lng: LanguageCode) {
    if (typeof window !== "undefined") {
      localStorage.setItem("ace-ielts-language", lng)
    }
  }
}

let storageAdapter = defaultStorageAdapter

/**
 * Configure storage adapter for i18n
 */
export function setLanguageStorageAdapter(adapter: LanguageStorageAdapter) {
  storageAdapter = adapter
}

/**
 * Get stored language preference
 */
const getStoredLanguage = (): LanguageCode => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("ace-ielts-language")
    if (stored && SUPPORTED_LANGUAGES.some((lang) => lang.code === stored)) {
      return stored as LanguageCode
    }
  }
  return DEFAULT_LANGUAGE
}

/**
 * Initialize i18next with React integration
 */
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh }
  },
  lng: getStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false // React already escapes by default
  }
})

/**
 * Change language and persist using storage adapter
 */
export const changeLanguage = async (lng: LanguageCode) => {
  await i18n.changeLanguage(lng)
  await storageAdapter.setLanguage(lng)
}

/**
 * Initialize i18n with async storage (for extension)
 */
export const initI18nWithStorage = async () => {
  const stored = await storageAdapter.getLanguage()
  if (stored) {
    await i18n.changeLanguage(stored)
  }
}

export { i18n }
export default i18n


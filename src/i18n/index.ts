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
 * Get stored language preference from localStorage
 */
const getStoredLanguage = (): LanguageCode => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("ace-english-language")
    if (
      stored &&
      SUPPORTED_LANGUAGES.some((lang) => lang.code === stored)
    ) {
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
 * Change language and persist to localStorage
 */
export const changeLanguage = (lng: LanguageCode) => {
  i18n.changeLanguage(lng)
  if (typeof window !== "undefined") {
    localStorage.setItem("ace-english-language", lng)
  }
}

export default i18n


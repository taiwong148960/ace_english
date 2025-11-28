/**
 * Shared React Hooks
 * Platform-agnostic hooks for common functionality
 */

export {
  usePlatform,
  useStorage,
  useNavigation,
  useEnvironment,
  usePlatformType
} from "../adapters/context"

// Re-export i18n hook from react-i18next
export { useTranslation } from "react-i18next"


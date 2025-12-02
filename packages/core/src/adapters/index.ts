/**
 * Platform Adapters barrel export
 */

// Types
export type {
  Platform,
  IStorageAdapter,
  INavigationAdapter,
  IEnvironmentAdapter,
  IAnalyticsAdapter,
  IPlatformContext
} from "./types"

// Context and hooks
export {
  PlatformProvider,
  PlatformContext,
  usePlatform,
  useStorage,
  useNavigation,
  useEnvironment,
  usePlatformType
} from "./context"

// Auth context and hooks
export {
  AuthProvider,
  AuthContext,
  useAuth,
  useIsAuthenticated,
  useUser
} from "./auth-context"


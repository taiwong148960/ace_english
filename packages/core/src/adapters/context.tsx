/**
 * Platform Context Provider
 * Provides platform-specific adapters to the entire application
 */

import { createContext, useContext, type ReactNode } from "react"
import type { IPlatformContext, Platform } from "./types"

/**
 * Default no-op context for SSR/testing
 */
const defaultContext: IPlatformContext = {
  platform: "web",
  storage: {
    get: async () => null,
    set: async () => {},
    remove: async () => {},
    clear: async () => {}
  },
  navigation: {
    navigate: () => {},
    openExternal: () => {},
    getCurrentPath: () => "/",
    goBack: () => {}
  },
  environment: {
    getPlatform: () => "web" as Platform,
    isDevelopment: () => true,
    getBaseUrl: () => "",
    getApiUrl: () => ""
  }
}

/**
 * Platform context
 */
const PlatformContext = createContext<IPlatformContext>(defaultContext)

/**
 * Platform provider props
 */
interface PlatformProviderProps {
  children: ReactNode
  context: IPlatformContext
}

/**
 * Platform provider component
 * Wrap your app with this to provide platform-specific functionality
 */
export function PlatformProvider({ children, context }: PlatformProviderProps) {
  return (
    <PlatformContext.Provider value={context}>
      {children}
    </PlatformContext.Provider>
  )
}

/**
 * Hook to access the platform context
 */
export function usePlatform(): IPlatformContext {
  const context = useContext(PlatformContext)
  if (!context) {
    throw new Error("usePlatform must be used within a PlatformProvider")
  }
  return context
}

/**
 * Hook to access storage adapter
 */
export function useStorage() {
  const { storage } = usePlatform()
  return storage
}

/**
 * Hook to access navigation adapter
 */
export function useNavigation() {
  const { navigation } = usePlatform()
  return navigation
}

/**
 * Hook to access environment adapter
 */
export function useEnvironment() {
  const { environment } = usePlatform()
  return environment
}

/**
 * Hook to check current platform
 */
export function usePlatformType(): Platform {
  const { platform } = usePlatform()
  return platform
}

export { PlatformContext }


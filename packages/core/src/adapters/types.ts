/**
 * Platform Adapter Types
 * Define interfaces for platform-specific functionality
 * Allows the same core logic to work across Web, Desktop, and Mobile platforms
 */

/**
 * Platform types supported by the application
 * - web: Browser-based web application
 * - desktop: Tauri desktop application (Windows, macOS, Linux)
 * - mobile: Mobile application (future - Capacitor)
 */
export type Platform = "web" | "desktop" | "mobile"

/**
 * Storage adapter interface for cross-platform data persistence
 */
export interface IStorageAdapter {
  /**
   * Get a value from storage
   */
  get<T>(key: string): Promise<T | null>
  
  /**
   * Set a value in storage
   */
  set<T>(key: string, value: T): Promise<void>
  
  /**
   * Remove a value from storage
   */
  remove(key: string): Promise<void>
  
  /**
   * Clear all storage
   */
  clear(): Promise<void>
}

/**
 * Navigation adapter interface for cross-platform navigation
 */
export interface INavigationAdapter {
  /**
   * Navigate to a specific route
   */
  navigate(path: string): void
  
  /**
   * Open a URL in a new tab/window
   */
  openExternal(url: string): void
  
  /**
   * Get the current path
   */
  getCurrentPath(): string
  
  /**
   * Go back in history
   */
  goBack(): void
}

/**
 * Environment adapter interface for platform-specific environment info
 */
export interface IEnvironmentAdapter {
  /**
   * Get the current platform
   */
  getPlatform(): Platform
  
  /**
   * Check if running in development mode
   */
  isDevelopment(): boolean
  
  /**
   * Get the base URL for the application
   */
  getBaseUrl(): string
  
  /**
   * Get the API base URL
   */
  getApiUrl(): string
}

/**
 * Analytics adapter interface for cross-platform analytics
 */
export interface IAnalyticsAdapter {
  /**
   * Track a page view
   */
  trackPageView(pageName: string): void
  
  /**
   * Track an event
   */
  trackEvent(eventName: string, properties?: Record<string, unknown>): void
}

/**
 * Platform context containing all adapters
 */
export interface IPlatformContext {
  platform: Platform
  storage: IStorageAdapter
  navigation: INavigationAdapter
  environment: IEnvironmentAdapter
  analytics?: IAnalyticsAdapter
}


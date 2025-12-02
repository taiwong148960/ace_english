/**
 * Auth type definitions
 */

import type { User, Session } from "@supabase/supabase-js"

/**
 * OAuth provider types
 */
export type OAuthProvider = "github" | "google"

/**
 * Auth state
 */
export interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

/**
 * Auth context value
 */
export interface AuthContextValue extends AuthState {
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

/**
 * User profile for the application
 */
export interface AppUserProfile {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  provider: OAuthProvider | null
  createdAt: string
}

/**
 * Convert Supabase User to AppUserProfile
 */
export function userToProfile(user: User): AppUserProfile {
  const metadata = user.user_metadata || {}
  
  return {
    id: user.id,
    email: user.email || "",
    name: metadata.full_name || metadata.name || metadata.user_name || user.email?.split("@")[0] || "User",
    avatarUrl: metadata.avatar_url || metadata.picture || null,
    provider: (user.app_metadata?.provider as OAuthProvider) || null,
    createdAt: user.created_at
  }
}


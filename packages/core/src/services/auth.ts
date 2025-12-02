/**
 * Auth Service
 * Handles authentication operations with Supabase
 */

import type { OAuthProvider } from "../types/auth"
import { getSupabase } from "./supabase"

/**
 * Sign in with OAuth provider (GitHub or Google)
 */
export async function signInWithOAuth(
  provider: OAuthProvider,
  redirectTo?: string
): Promise<void> {
  const supabase = getSupabase()
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectTo || `${window.location.origin}/auth/callback`
    }
  })

  if (error) {
    throw new Error(`Failed to sign in with ${provider}: ${error.message}`)
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = getSupabase()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(`Failed to sign out: ${error.message}`)
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = getSupabase()
  
  const { data, error } = await supabase.auth.getSession()
  
  if (error) {
    throw new Error(`Failed to get session: ${error.message}`)
  }
  
  return data.session
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const supabase = getSupabase()
  
  const { data, error } = await supabase.auth.getUser()
  
  if (error) {
    // Not authenticated is not an error
    if (error.message.includes("not authenticated")) {
      return null
    }
    throw new Error(`Failed to get user: ${error.message}`)
  }
  
  return data.user
}

/**
 * Refresh the current session
 */
export async function refreshSession() {
  const supabase = getSupabase()
  
  const { data, error } = await supabase.auth.refreshSession()
  
  if (error) {
    throw new Error(`Failed to refresh session: ${error.message}`)
  }
  
  return data.session
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: unknown) => void
) {
  const supabase = getSupabase()
  
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}


/**
 * Supabase Client
 * Configurable Supabase client for auth and database operations
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let supabaseClient: SupabaseClient | null = null

/**
 * Supabase configuration options
 */
export interface SupabaseConfig {
  supabaseUrl: string
  supabaseAnonKey: string
}

/**
 * Initialize the Supabase client
 * Must be called before using any Supabase functionality
 */
export function initializeSupabase(config: SupabaseConfig): SupabaseClient {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key are required")
  }

  supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })

  return supabaseClient
}

/**
 * Get the initialized Supabase client
 * Throws if client has not been initialized
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    throw new Error(
      "Supabase client not initialized. Call initializeSupabase() first."
    )
  }
  return supabaseClient
}

/**
 * Check if Supabase client is initialized
 */
export function isSupabaseInitialized(): boolean {
  return supabaseClient !== null
}


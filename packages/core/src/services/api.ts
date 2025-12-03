/**
 * API Service Layer
 * Handles dashboard data fetching from Supabase
 * Following the Interface Segregation Principle (ISP)
 */

import type { DashboardData, TakeawayStats } from "../types"
import { isSupabaseInitialized } from "./supabase"

/**
 * Configuration for API behavior
 */
interface ApiConfig {
  baseUrl?: string
}

/**
 * Default configuration
 */
const defaultConfig: ApiConfig = {}

let config = { ...defaultConfig }

/**
 * Configure API behavior
 */
export function configureApi(newConfig: Partial<ApiConfig>) {
  config = { ...config, ...newConfig }
}

/**
 * Dashboard API interface
 */
export interface IDashboardApi {
  getDashboardData(): Promise<DashboardData>
  getTakeawayStats(timeRange: TakeawayStats["timeRange"]): Promise<TakeawayStats>
}

/**
 * Dashboard API implementation
 */
export const dashboardApi: IDashboardApi = {
  /**
   * Fetch complete dashboard data from Supabase
   * TODO: Implement real Supabase queries for dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    if (!isSupabaseInitialized()) {
      throw new Error("Supabase not initialized")
    }

    // TODO: Implement real Supabase queries
    // This should fetch from Supabase tables:
    // - user_profiles, study_stats, skills_breakdown, practice_tasks, etc.
    throw new Error("Dashboard data fetching not yet implemented. Please implement Supabase queries in services/api.ts")
  },

  /**
   * Fetch takeaway statistics by time range from Supabase
   * TODO: Implement real Supabase queries for takeaway stats
   */
  async getTakeawayStats(
    _timeRange: TakeawayStats["timeRange"]
  ): Promise<TakeawayStats> {
    if (!isSupabaseInitialized()) {
      throw new Error("Supabase not initialized")
    }

    // TODO: Implement real Supabase queries
    // This should fetch from Supabase tables based on timeRange
    throw new Error("Takeaway stats fetching not yet implemented. Please implement Supabase queries in services/api.ts")
  }
}

export default dashboardApi


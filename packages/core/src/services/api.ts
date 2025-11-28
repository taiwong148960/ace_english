/**
 * API Service Layer
 * Abstraction layer that can switch between mock and real backend
 * Following the Interface Segregation Principle (ISP)
 */

import type { DashboardData, TakeawayStats } from "../types"
import { withDelay } from "../utils"
import { getMockDashboardData, getMockTakeawayStats } from "./mock-data"

/**
 * Configuration for API behavior
 */
interface ApiConfig {
  useMock: boolean
  baseUrl?: string
  mockDelay?: number
}

/**
 * Default configuration - use mock data in development
 */
const defaultConfig: ApiConfig = {
  useMock: true,
  mockDelay: 300
}

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
   * Fetch complete dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    if (config.useMock) {
      return withDelay(getMockDashboardData(), config.mockDelay)
    }

    // Real API call would go here
    const response = await fetch(`${config.baseUrl}/api/dashboard`)
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data")
    }
    return response.json()
  },

  /**
   * Fetch takeaway statistics by time range
   */
  async getTakeawayStats(
    timeRange: TakeawayStats["timeRange"]
  ): Promise<TakeawayStats> {
    if (config.useMock) {
      return withDelay(getMockTakeawayStats(timeRange), config.mockDelay)
    }

    // Real API call would go here
    const response = await fetch(
      `${config.baseUrl}/api/takeaway?range=${timeRange}`
    )
    if (!response.ok) {
      throw new Error("Failed to fetch takeaway stats")
    }
    return response.json()
  }
}

export default dashboardApi


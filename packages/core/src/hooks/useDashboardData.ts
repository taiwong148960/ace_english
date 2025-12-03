/**
 * useDashboardData Hook
 * TanStack Query hook for fetching dashboard data
 */

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { dashboardApi } from "../services/api"
import { queryKeys } from "../query"
import type { DashboardData, TakeawayStats } from "../types"

interface UseDashboardDataReturn {
  data: DashboardData | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook for fetching dashboard data
 */
export function useDashboardData(): UseDashboardDataReturn {
  const dashboardQuery = useQuery({
    queryKey: queryKeys.dashboard.data(),
    queryFn: () => dashboardApi.getDashboardData(),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  const refetch = async () => {
    await dashboardQuery.refetch()
  }

  return {
    data: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    error: dashboardQuery.error ?? null,
    refetch
  }
}

interface UseTakeawayStatsOptions {
  initialTimeRange?: TakeawayStats["timeRange"]
}

interface UseTakeawayStatsReturn {
  stats: TakeawayStats | undefined
  isLoading: boolean
  error: Error | null
  fetchStats: (timeRange: TakeawayStats["timeRange"]) => Promise<TakeawayStats>
  isFetching: boolean
}

/**
 * Hook for fetching takeaway stats by time range
 */
export function useTakeawayStats({
  initialTimeRange = "week"
}: UseTakeawayStatsOptions = {}): UseTakeawayStatsReturn {
  const queryClient = useQueryClient()

  const statsQuery = useQuery({
    queryKey: queryKeys.dashboard.takeawayStats(initialTimeRange),
    queryFn: () => dashboardApi.getTakeawayStats(initialTimeRange),
    staleTime: 2 * 60 * 1000 // 2 minutes
  })

  const fetchStats = async (timeRange: TakeawayStats["timeRange"]): Promise<TakeawayStats> => {
    // Use fetchQuery to get stats for specific time range
    return queryClient.fetchQuery({
      queryKey: queryKeys.dashboard.takeawayStats(timeRange),
      queryFn: () => dashboardApi.getTakeawayStats(timeRange),
      staleTime: 2 * 60 * 1000
    })
  }

  return {
    stats: statsQuery.data,
    isLoading: statsQuery.isLoading,
    error: statsQuery.error ?? null,
    fetchStats,
    isFetching: statsQuery.isFetching
  }
}

export default useDashboardData


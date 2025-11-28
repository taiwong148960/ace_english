import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

import { MainLayout } from "~/components/layout"
import {
  BlogCard,
  InflectionCard,
  SkillsBreakdownCard,
  TakeawayCard,
  WelcomeCard
} from "~/components/dashboard"
import { dashboardApi } from "~/services/api"
import type { BlogArticle, DashboardData, TakeawayStats } from "~/services/types"

/**
 * Loading spinner component
 */
function LoadingState() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-8 w-8 text-primary" />
          </motion.div>
          <span className="text-text-secondary text-sm">Loading dashboard...</span>
        </motion.div>
      </div>
    </MainLayout>
  )
}

/**
 * Error state component
 */
function ErrorState({ message }: { message: string }) {
  return (
    <MainLayout>
      <div className="flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="text-functional-error text-lg font-medium mb-2">
            Oops! Something went wrong
          </div>
          <div className="text-text-secondary text-sm">{message}</div>
        </motion.div>
      </div>
    </MainLayout>
  )
}

/**
 * Dashboard page component
 * Main landing page showing user progress and recommended tasks
 * Layout follows the prototype with:
 * - Top row: Welcome card with score gauge
 * - Second row: Inflection (tasks) | Skills Breakdown
 * - Third row: Takeaway stats | Last Test Status
 */
export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const dashboardData = await dashboardApi.getDashboardData()
        setData(dashboardData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle time range change for takeaway stats
  const handleTimeRangeChange = async (
    range: TakeawayStats["timeRange"]
  ): Promise<TakeawayStats> => {
    return dashboardApi.getTakeawayStats(range)
  }

  // Handle task toggle
  const handleTaskToggle = (taskId: string, completed: boolean) => {
    if (!data) return
    setData({
      ...data,
      practiceTasks: data.practiceTasks.map((task) =>
        task.id === taskId ? { ...task, completed } : task
      )
    })
  }

  // Handle start practice
  const handleStartPractice = (_taskId: string) => {
    // Will navigate to practice page when implemented
  }

  // Handle view all blog articles
  const handleViewAllBlog = () => {
    window.open("https://aceielts.com/blog", "_blank")
  }

  // Handle blog article click
  const handleArticleClick = (article: BlogArticle) => {
    window.open(article.url, "_blank")
  }

  // Handle navigation
  const handleNavigate = (_itemId: string) => {
    // Will implement navigation when other pages are ready
  }

  // Loading state
  if (isLoading) {
    return <LoadingState />
  }

  // Error state
  if (error || !data) {
    return <ErrorState message={error || "Failed to load data"} />
  }

  return (
    <MainLayout activeNav="dashboard" onNavigate={handleNavigate}>
      <motion.div 
        className="max-w-7xl mx-auto flex flex-col gap-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top row: Welcome card spanning full width */}
        <WelcomeCard user={data.user} studyStats={data.studyStats} />

        {/* Second row: Inflection and Skills Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-stretch">
          {/* Inflection card - takes 2/3 of the width */}
          <div className="lg:col-span-2">
            <InflectionCard
              tasks={data.practiceTasks}
              onToggleTask={handleTaskToggle}
              onStartPractice={handleStartPractice}
              className="h-full"
            />
          </div>

          {/* Skills Breakdown - takes 1/3 of the width */}
          <div>
            <SkillsBreakdownCard 
              skillsBreakdown={data.skillsBreakdown} 
              className="h-full"
            />
          </div>
        </div>

        {/* Third row: Takeaway and Blog */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-stretch">
          {/* Takeaway card - takes 2/3 of the width */}
          <div className="lg:col-span-2">
            <TakeawayCard
              initialStats={data.takeawayStats}
              browsingHistory={data.browsingHistory}
              onTimeRangeChange={handleTimeRangeChange}
              className="h-full"
            />
          </div>

          {/* Blog - takes 1/3 of the width */}
          <div>
            <BlogCard
              articles={data.blogArticles}
              onViewAll={handleViewAllBlog}
              onArticleClick={handleArticleClick}
              className="h-full"
            />
          </div>
        </div>
      </motion.div>
    </MainLayout>
  )
}

export default Dashboard

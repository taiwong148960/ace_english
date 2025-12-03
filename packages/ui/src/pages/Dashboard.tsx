/**
 * Shared Dashboard Page Component
 * Uses platform adapters for cross-platform compatibility
 */

import { motion } from "framer-motion"
import {
  useNavigation,
  useTranslation,
  useAuth,
  userToProfile,
  useDashboardData,
  useTakeawayStats,
  type BlogArticle,
  type TakeawayStats
} from "@ace-ielts/core"

import { MainLayout } from "../layout"
import {
  WelcomeCard,
  InflectionCard,
  SkillsBreakdownCard,
  TakeawayCard,
  BlogCard
} from "../dashboard"

/**
 * Error state component
 */
function ErrorState({ message }: { message: string }) {
  const { t } = useTranslation()

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
            {t("dashboard.error")}
          </div>
          <div className="text-text-secondary text-sm">{message}</div>
        </motion.div>
      </div>
    </MainLayout>
  )
}

/**
 * Shared Dashboard page component
 * Works across both Extension and Web platforms via useNavigation adapter
 */
export function Dashboard() {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { user: authUser } = useAuth()

  // Use TanStack Query hooks for data fetching
  const { data, isLoading, error } = useDashboardData()
  const { fetchStats } = useTakeawayStats()

  // Merge real user data with dashboard data if authenticated
  const dashboardData = data ? {
    ...data,
    user: authUser ? {
      ...data.user,
      id: authUser.id,
      name: userToProfile(authUser).name,
      email: userToProfile(authUser).email,
      avatarUrl: userToProfile(authUser).avatarUrl || undefined
    } : data.user
  } : null

  const handleTimeRangeChange = async (
    range: TakeawayStats["timeRange"]
  ): Promise<TakeawayStats> => {
    return fetchStats(range)
  }

  const handleTaskToggle = (_taskId: string, _completed: boolean) => {
    // This is local state management, not needed for TanStack Query
    // Could be enhanced with a mutation if needed
  }

  const handleStartPractice = (_taskId: string) => {
    // Will navigate to practice page when implemented
    navigation.navigate("/practice")
  }

  const handleViewAllBlog = () => {
    navigation.openExternal("https://aceielts.com/blog")
  }

  const handleArticleClick = (article: BlogArticle) => {
    navigation.openExternal(article.url)
  }

  const handleNavigate = (itemId: string) => {
    navigation.navigate(`/${itemId}`)
  }

  if (error) {
    return <ErrorState message={error.message || t("dashboard.failedToLoad")} />
  }

  if (isLoading || !dashboardData) {
    return <MainLayout><></></MainLayout>
  }

  return (
    <MainLayout activeNav="dashboard" onNavigate={handleNavigate}>
      <motion.div
        className="max-w-7xl mx-auto flex flex-col gap-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <WelcomeCard user={dashboardData.user} studyStats={dashboardData.studyStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-stretch">
          <div className="lg:col-span-2">
            <InflectionCard
              tasks={dashboardData.practiceTasks}
              onToggleTask={handleTaskToggle}
              onStartPractice={handleStartPractice}
              className="h-full"
            />
          </div>

          <div>
            <SkillsBreakdownCard
              skillsBreakdown={dashboardData.skillsBreakdown}
              className="h-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-stretch">
          <div className="lg:col-span-2">
            <TakeawayCard
              initialStats={dashboardData.takeawayStats}
              browsingHistory={dashboardData.browsingHistory}
              onTimeRangeChange={handleTimeRangeChange}
              className="h-full"
            />
          </div>

          <div>
            <BlogCard
              articles={dashboardData.blogArticles}
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

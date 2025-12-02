/**
 * Services barrel export
 */
export { dashboardApi, configureApi } from "./api"
export type { IDashboardApi } from "./api"
export {
  getMockDashboardData,
  getMockTakeawayStats,
  mockUserProfile,
  mockStudyStats,
  mockSkillsBreakdown,
  mockPracticeTasks,
  mockTakeawayStats,
  mockBrowsingHistory,
  mockMockTestStatus,
  mockBlogArticles
} from "./mock-data"

// Supabase
export {
  initializeSupabase,
  getSupabase,
  isSupabaseInitialized,
  type SupabaseConfig
} from "./supabase"

// Auth
export {
  signInWithOAuth,
  signOut,
  getSession,
  getCurrentUser,
  refreshSession,
  onAuthStateChange
} from "./auth"


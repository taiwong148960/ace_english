/**
 * Mock data service for development
 * Provides realistic sample data that mimics backend responses
 */

import type {
  BlogArticle,
  BrowsingHistoryItem,
  DashboardData,
  MockTestStatus,
  PracticeTask,
  SkillsBreakdown,
  StudyStats,
  TakeawayStats,
  UserProfile
} from "../types"

/**
 * Mock user profile
 */
export const mockUserProfile: UserProfile = {
  id: "user-001",
  name: "Alex",
  email: "alex@example.com",
  goalBand: 7.5,
  currentLevel: 6.5,
  joinedDate: "2024-06-15"
}

/**
 * Mock study statistics
 */
export const mockStudyStats: StudyStats = {
  dayStreak: 12,
  todayMinutes: 45,
  totalMinutes: 3420
}

/**
 * Mock skills breakdown
 */
export const mockSkillsBreakdown: SkillsBreakdown = {
  skills: [
    { skill: "listening", score: 7.0, maxScore: 9.0 },
    { skill: "reading", score: 7.5, maxScore: 9.0 },
    { skill: "writing", score: 8.0, maxScore: 9.0, hasWarning: true },
    { skill: "speaking", score: 6.5, maxScore: 9.0 }
  ]
}

/**
 * Mock practice tasks
 */
export const mockPracticeTasks: PracticeTask[] = [
  {
    id: "task-001",
    type: "writing",
    title: "Task 1 Bar Chart Practice",
    duration: 20,
    completed: false,
    priority: "high"
  },
  {
    id: "task-002",
    type: "vocabulary",
    title: "Review Yesterday's Errors (15 words)",
    duration: 10,
    completed: false,
    priority: "medium"
  },
  {
    id: "task-003",
    type: "reading",
    title: "Academic Reading Passage",
    duration: 15,
    completed: false,
    priority: "medium"
  }
]

/**
 * Mock takeaway statistics by time range
 */
export const mockTakeawayStats: Record<TakeawayStats["timeRange"], TakeawayStats> = {
  day: {
    wordsViewed: 87,
    articlesRead: 3,
    videosWatched: 2,
    timeRange: "day"
  },
  week: {
    wordsViewed: 542,
    articlesRead: 21,
    videosWatched: 8,
    timeRange: "week"
  },
  month: {
    wordsViewed: 1254,
    articlesRead: 87,
    videosWatched: 32,
    timeRange: "month"
  },
  all: {
    wordsViewed: 4521,
    articlesRead: 312,
    videosWatched: 98,
    timeRange: "all"
  }
}

/**
 * Mock browsing history items
 */
export const mockBrowsingHistory: BrowsingHistoryItem[] = [
  {
    id: "history-001",
    type: "word",
    title: "ubiquitous",
    source: "BBC News",
    timestamp: "2024-11-28T09:30:00Z"
  },
  {
    id: "history-002",
    type: "article",
    title: "Climate Change Impact on Global Agriculture",
    source: "The Guardian",
    timestamp: "2024-11-28T08:45:00Z",
    url: "https://theguardian.com/article/climate-agriculture"
  },
  {
    id: "history-003",
    type: "video",
    title: "TED Talk: The Future of AI",
    source: "YouTube",
    timestamp: "2024-11-28T07:20:00Z",
    url: "https://youtube.com/watch?v=abc123"
  },
  {
    id: "history-004",
    type: "word",
    title: "ephemeral",
    source: "The Economist",
    timestamp: "2024-11-27T22:15:00Z"
  },
  {
    id: "history-005",
    type: "article",
    title: "Breakthrough in Quantum Computing Research",
    source: "Nature",
    timestamp: "2024-11-27T20:30:00Z",
    url: "https://nature.com/articles/quantum-breakthrough"
  },
  {
    id: "history-006",
    type: "word",
    title: "ameliorate",
    source: "Academic Paper",
    timestamp: "2024-11-27T18:00:00Z"
  },
  {
    id: "history-007",
    type: "video",
    title: "IELTS Speaking Band 9 Sample",
    source: "YouTube",
    timestamp: "2024-11-27T15:45:00Z",
    url: "https://youtube.com/watch?v=def456"
  }
]

/**
 * Mock test status
 */
export const mockMockTestStatus: MockTestStatus = {
  daysSinceLastTest: 24,
  lastTestScore: 6.5,
  lastTestDate: "2024-11-03"
}

/**
 * Mock blog articles
 */
export const mockBlogArticles: BlogArticle[] = [
  {
    id: "blog-001",
    title: "10 Essential Tips for IELTS Writing Task 2",
    url: "https://aceielts.com/blog/writing-task-2-tips",
    category: "Writing",
    readTimeMinutes: 5,
    publishedAt: "2024-11-25"
  },
  {
    id: "blog-002",
    title: "How to Improve Your Listening Score by 1.0 Band",
    url: "https://aceielts.com/blog/listening-improvement",
    category: "Listening",
    readTimeMinutes: 7,
    publishedAt: "2024-11-22"
  },
  {
    id: "blog-003",
    title: "Common Speaking Test Mistakes to Avoid",
    url: "https://aceielts.com/blog/speaking-mistakes",
    category: "Speaking",
    readTimeMinutes: 4,
    publishedAt: "2024-11-18"
  }
]

/**
 * Get complete dashboard data
 */
export function getMockDashboardData(): DashboardData {
  return {
    user: mockUserProfile,
    studyStats: mockStudyStats,
    skillsBreakdown: mockSkillsBreakdown,
    practiceTasks: mockPracticeTasks,
    takeawayStats: mockTakeawayStats.month,
    browsingHistory: mockBrowsingHistory,
    mockTestStatus: mockMockTestStatus,
    blogArticles: mockBlogArticles
  }
}

/**
 * Get takeaway stats by time range
 */
export function getMockTakeawayStats(
  timeRange: TakeawayStats["timeRange"]
): TakeawayStats {
  return mockTakeawayStats[timeRange]
}


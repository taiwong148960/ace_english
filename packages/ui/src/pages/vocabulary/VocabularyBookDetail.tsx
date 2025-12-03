/**
 * Vocabulary Book Detail Page
 * Shows learning progress, statistics, and provides entry to learning session
 */

import { motion } from "framer-motion"
import {
  ArrowLeft,
  Brain,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Target
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { cn, useNavigation, useTranslation } from "@ace-ielts/core"

import { MainLayout } from "../../layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  fadeInUp
} from "../../components"

/**
 * Mock book detail data - will be replaced with real data later
 */
interface WordProgress {
  id: string
  word: string
  mastery: "new" | "learning" | "mastered"
  lastReviewed: string | null
  nextReview: string | null
}

interface BookStats {
  totalWords: number
  mastered: number
  learning: number
  newWords: number
  todayReview: number
  todayNew: number
  estimatedMinutes: number
  streak: number
  accuracy: number
}

const mockBookDetail = {
  id: "ielts-core",
  name: "IELTS Core 3000",
  description: "Essential vocabulary for IELTS Band 6-7",
  coverColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
  stats: {
    totalWords: 3000,
    mastered: 1250,
    learning: 580,
    newWords: 1170,
    todayReview: 45,
    todayNew: 20,
    estimatedMinutes: 25,
    streak: 7,
    accuracy: 78
  } as BookStats,
  recentWords: [
    { id: "1", word: "procrastinate", mastery: "learning", lastReviewed: "2h ago", nextReview: "tomorrow" },
    { id: "2", word: "ubiquitous", mastery: "learning", lastReviewed: "1d ago", nextReview: "today" },
    { id: "3", word: "ephemeral", mastery: "mastered", lastReviewed: "3d ago", nextReview: "next week" },
    { id: "4", word: "pragmatic", mastery: "learning", lastReviewed: "5h ago", nextReview: "tomorrow" },
    { id: "5", word: "meticulous", mastery: "mastered", lastReviewed: "1w ago", nextReview: "2 weeks" }
  ] as WordProgress[],
  difficultWords: [
    { id: "6", word: "serendipity", mastery: "learning", lastReviewed: "2d ago", nextReview: "today" },
    { id: "7", word: "paradigm", mastery: "learning", lastReviewed: "1d ago", nextReview: "today" },
    { id: "8", word: "dichotomy", mastery: "new", lastReviewed: null, nextReview: null },
    { id: "9", word: "ephemeral", mastery: "learning", lastReviewed: "3d ago", nextReview: "today" },
    { id: "10", word: "ubiquitous", mastery: "learning", lastReviewed: "2d ago", nextReview: "tomorrow" }
  ] as WordProgress[]
}


/**
 * Progress ring component
 */
function ProgressRing({
  progress,
  size = 105,
  strokeWidth = 8,
  label,
  value
}: {
  progress: number
  size?: number
  strokeWidth?: number
  label: string
  value: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-neutral-border"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className="text-primary"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          style={{
            strokeDasharray: circumference
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-text-primary">{value}</span>
        <span className="text-xs text-text-secondary">{label}</span>
      </div>
    </div>
  )
}

/**
 * Word list item component
 */
function WordListItem({ word, index }: { word: WordProgress; index: number }) {
  const masteryColors = {
    new: "bg-slate-100 text-slate-600",
    learning: "bg-amber-100 text-amber-700",
    mastered: "bg-emerald-100 text-emerald-700"
  }

  const masteryLabels = {
    new: "New",
    learning: "Learning",
    mastered: "Mastered"
  }

  return (
    <motion.div
      className="flex items-center justify-between py-2 border-b border-neutral-border last:border-0"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-center gap-3">
        <span className="font-medium text-text-primary">{word.word}</span>
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", masteryColors[word.mastery])}>
          {masteryLabels[word.mastery]}
        </span>
      </div>
      {word.nextReview && (
        <span className="text-xs text-text-tertiary">Next: {word.nextReview}</span>
      )}
    </motion.div>
  )
}

function ForgettingCurveChart({
  masteredS = 30,
  learningS = 7,
  newS = 2,
  days = 30
}: {
  masteredS?: number
  learningS?: number
  newS?: number
  days?: number
}) {
  const { t } = useTranslation()
  
  // Calculate retention data points
  const retention = (d: number, S: number) => Math.exp(-d / S)
  const data = Array.from({ length: days + 1 }, (_, i) => ({
    day: i,
    mastered: retention(i, masteredS),
    learning: retention(i, learningS),
    new: retention(i, newS)
  }))

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null

    const day = payload[0].payload.day
    
    return (
      <div className="bg-white border border-neutral-border rounded-lg shadow-lg p-3 space-y-2">
        <p className="text-sm font-medium text-text-primary border-b pb-2">
          {t("vocabulary.bookDetail.tooltipDays", { days: day })}
        </p>
        {payload.map((entry: any) => {
          const labelMap: Record<string, string> = {
            mastered: t("vocabulary.bookDetail.tooltipMastered", { strength: masteredS }),
            learning: t("vocabulary.bookDetail.tooltipLearning", { strength: learningS }),
            new: t("vocabulary.bookDetail.tooltipNew", { strength: newS })
          }
          const colorMap: Record<string, string> = {
            mastered: "#059669",
            learning: "#d97706",
            new: "#475569"
          }
          return (
            <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: colorMap[entry.dataKey] || entry.color }}
              />
              <span className="text-text-secondary">{labelMap[entry.dataKey]}:</span>
              <span className="font-medium text-text-primary">
                {t("vocabulary.bookDetail.tooltipRetention", { percent: (entry.value * 100).toFixed(1) })}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 15, left: 5, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
          <XAxis
            dataKey="day"
            label={{ value: t("vocabulary.bookDetail.xAxisLabel"), position: "insideBottom", offset: -3, style: { textAnchor: "middle", fill: "#6b7280", fontSize: 11 } }}
            stroke="#9ca3af"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            domain={[0, days]}
          />
          <YAxis
            label={{ value: t("vocabulary.bookDetail.yAxisLabel"), angle: -90, position: "insideLeft", style: { textAnchor: "middle", fill: "#6b7280", fontSize: 11 } }}
            stroke="#9ca3af"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            domain={[0, 1]}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: "10px" }}
            iconType="line"
            formatter={(value) => {
              const labelMap: Record<string, string> = {
                mastered: t("vocabulary.bookDetail.mastered"),
                learning: t("vocabulary.bookDetail.learning"),
                new: t("vocabulary.bookDetail.new")
              }
              return labelMap[value] || value
            }}
          />
          <Line
            type="monotone"
            dataKey="mastered"
            stroke="#059669"
            strokeWidth={2}
            dot={false}
            name="mastered"
          />
          <Line
            type="monotone"
            dataKey="learning"
            stroke="#d97706"
            strokeWidth={2}
            dot={false}
            name="learning"
          />
          <Line
            type="monotone"
            dataKey="new"
            stroke="#475569"
            strokeWidth={2}
            dot={false}
            name="new"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * Main VocabularyBookDetail page component
 */
export function VocabularyBookDetail() {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const book = mockBookDetail

  const masteredPercent = Math.round((book.stats.mastered / book.stats.totalWords) * 100)
  const learningPercent = Math.round((book.stats.learning / book.stats.totalWords) * 100)
  const newPercent = Math.round((book.stats.newWords / book.stats.totalWords) * 100)

  // Calculate estimated completion time
  const remainingWords = book.stats.newWords + book.stats.learning
  const dailyWords = book.stats.todayNew + book.stats.todayReview || 1 // Default to 1 if no daily words
  const estimatedDays = Math.ceil(remainingWords / dailyWords)
  
  const getEstimatedCompletionText = () => {
    if (estimatedDays < 7) {
      return t("vocabulary.bookDetail.estimatedCompletionDays", { days: estimatedDays })
    } else if (estimatedDays < 30) {
      const weeks = Math.ceil(estimatedDays / 7)
      return t("vocabulary.bookDetail.estimatedCompletionWeeks", { weeks })
    } else {
      const months = Math.ceil(estimatedDays / 30)
      return t("vocabulary.bookDetail.estimatedCompletionMonths", { months })
    }
  }

  const handleBack = () => {
    navigation.navigate("/vocabulary")
  }

  const handleStartLearning = () => {
    navigation.navigate(`/vocabulary/${book.id}/learn`)
  }

  const handleNavigate = (itemId: string) => {
    navigation.navigate(`/${itemId}`)
  }

  return (
    <MainLayout activeNav="vocabulary" onNavigate={handleNavigate}>
      <motion.div
        className="max-w-6xl mx-auto flex flex-col gap-lg"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button & Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-primary">{book.name}</h1>
            <p className="text-text-secondary text-sm">{book.description}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          {/* Row 1: Overview & Today's Goal - same height */}
          {/* Overview Card */}
          <Card className="lg:col-span-2 flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4 text-primary" />
                  {t("vocabulary.bookDetail.overview")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Progress Ring */}
                  <ProgressRing
                    progress={masteredPercent}
                    label={t("vocabulary.bookDetail.mastered")}
                    value={`${masteredPercent}%`}
                  />

                  {/* Stats Breakdown */}
                  <div className="flex-1 grid grid-cols-3 gap-3 w-full">
                    <div className="text-center p-3 rounded-lg bg-emerald-50">
                      <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-600 mb-1.5" />
                      <p className="text-xl font-bold text-emerald-700">{book.stats.mastered}</p>
                      <p className="text-xs text-emerald-600">{t("vocabulary.bookDetail.mastered")}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-amber-50">
                      <BookOpen className="h-5 w-5 mx-auto text-amber-600 mb-1.5" />
                      <p className="text-xl font-bold text-amber-700">{book.stats.learning}</p>
                      <p className="text-xs text-amber-600">{t("vocabulary.bookDetail.learning")}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-slate-50">
                      <Sparkles className="h-5 w-5 mx-auto text-slate-600 mb-1.5" />
                      <p className="text-xl font-bold text-slate-700">{book.stats.newWords}</p>
                      <p className="text-xs text-slate-600">{t("vocabulary.bookDetail.new")}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-text-secondary">
                      {t("vocabulary.wordsCount", { count: book.stats.totalWords })}
                    </span>
                  </div>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="h-2.5 bg-neutral-border rounded-full overflow-hidden flex">
                          <motion.div
                            className="bg-emerald-500 h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(book.stats.mastered / book.stats.totalWords) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                          <motion.div
                            className="bg-amber-500 h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(book.stats.learning / book.stats.totalWords) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                          />
                          <motion.div
                            className="bg-slate-400 h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(book.stats.newWords / book.stats.totalWords) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>{t("vocabulary.bookDetail.mastered")}: {masteredPercent}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-amber-600" />
                            <span>{t("vocabulary.bookDetail.learning")}: {learningPercent}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-slate-600" />
                            <span>{t("vocabulary.bookDetail.new")}: {newPercent}%</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Estimated Completion Time */}
                {remainingWords > 0 && (
                  <div className="mt-3 pt-3 border-t border-neutral-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-text-secondary" />
                        <span className="text-xs text-text-secondary">
                          {t("vocabulary.bookDetail.estimatedCompletion")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-text-primary">
                          {getEstimatedCompletionText()}
                        </span>
                        <span className="text-xs text-text-tertiary">
                          {t("vocabulary.bookDetail.estimatedCompletionAtPace")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          {/* Today's Learning Plan Card - same row as Overview */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-primary" />
                {t("vocabulary.bookDetail.todayPlan")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Learning Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-text-secondary">
                        {t("vocabulary.bookDetail.wordsToReview", { count: book.stats.todayReview })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-text-secondary">
                        {t("vocabulary.bookDetail.newWordsToday", { count: book.stats.todayNew })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="pt-2 border-t border-neutral-border">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-text-secondary" />
                    <span className="text-sm text-text-secondary">
                      {t("vocabulary.bookDetail.estimatedTime", { minutes: book.stats.estimatedMinutes })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Start Learning Button */}
              <Button
                onClick={handleStartLearning}
                className="w-full mt-4 gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                {t("vocabulary.bookDetail.startSession")}
              </Button>
            </CardContent>
          </Card>

          {/* Row 2: Forgetting Curve Chart */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="pb-1">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                {t("vocabulary.bookDetail.forgettingCurve")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-4 flex-1 flex flex-col min-h-0">
              <div className="mb-2 text-xs text-text-secondary">{t("vocabulary.bookDetail.retentionProbability")}</div>
              <div className="flex-1 min-h-[280px]">
                <ForgettingCurveChart
                  masteredS={30}
                  learningS={7}
                  newS={2}
                  days={30}
                />
              </div>
              <div className="mt-2 text-xs text-text-tertiary">{t("vocabulary.bookDetail.fsrsHint")}</div>
            </CardContent>
          </Card>

          {/* Right Column - Stats & Words */}
          <div className="space-y-lg">
            {/* Recent Words */}
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  {t("vocabulary.bookDetail.recentWords")}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                {book.recentWords.map((word, index) => (
                  <WordListItem key={word.id} word={word} index={index} />
                ))}
              </CardContent>
            </Card>

            {/* Difficult Words */}
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-base flex items-center gap-2 text-amber-600">
                  <Brain className="h-4 w-4" />
                  {t("vocabulary.bookDetail.difficult")}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                {book.difficultWords.map((word, index) => (
                  <WordListItem key={word.id} word={word} index={index} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  )
}

export default VocabularyBookDetail

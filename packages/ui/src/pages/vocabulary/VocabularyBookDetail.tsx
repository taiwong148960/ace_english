/**
 * Vocabulary Book Detail Page - 词本学习进度和概况
 * Shows learning progress, statistics, and provides entry to learning session
 */

import { motion } from "framer-motion"
import {
  ArrowLeft,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react"
import { cn, useNavigation, useTranslation } from "@ace-ielts/core"

import { MainLayout } from "../../layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  fadeInUp,
  staggerContainer,
  staggerItem
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
    { id: "8", word: "dichotomy", mastery: "new", lastReviewed: null, nextReview: null }
  ] as WordProgress[]
}

/**
 * Stat card component
 */
function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  color,
  index
}: {
  icon: React.ElementType
  label: string
  value: string | number
  subValue?: string
  color: string
  index: number
}) {
  return (
    <motion.div
      variants={staggerItem}
      custom={index}
      initial="hidden"
      animate="visible"
    >
      <Card className="relative overflow-hidden">
        <div className={cn("absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 rounded-full opacity-10", color)} />
        <CardContent className="pt-4">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", color.replace("bg-", "bg-opacity-15 text-"))}>
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-sm text-text-secondary mb-1">{label}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          {subValue && (
            <p className="text-xs text-text-tertiary mt-1">{subValue}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Progress ring component
 */
function ProgressRing({
  progress,
  size = 120,
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
      className="flex items-center justify-between py-3 border-b border-neutral-border last:border-0"
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

/**
 * Main VocabularyBookDetail page component
 */
export function VocabularyBookDetail() {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const book = mockBookDetail

  const masteredPercent = Math.round((book.stats.mastered / book.stats.totalWords) * 100)

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
          {/* Left Column - Overview & Today's Goal */}
          <div className="lg:col-span-2 space-y-lg">
            {/* Overview Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {t("vocabulary.bookDetail.overview")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  {/* Progress Ring */}
                  <ProgressRing
                    progress={masteredPercent}
                    label={t("vocabulary.bookDetail.mastered")}
                    value={`${masteredPercent}%`}
                  />

                  {/* Stats Breakdown */}
                  <div className="flex-1 grid grid-cols-3 gap-4 w-full">
                    <div className="text-center p-4 rounded-lg bg-emerald-50">
                      <CheckCircle2 className="h-6 w-6 mx-auto text-emerald-600 mb-2" />
                      <p className="text-2xl font-bold text-emerald-700">{book.stats.mastered}</p>
                      <p className="text-xs text-emerald-600">{t("vocabulary.bookDetail.mastered")}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-amber-50">
                      <Brain className="h-6 w-6 mx-auto text-amber-600 mb-2" />
                      <p className="text-2xl font-bold text-amber-700">{book.stats.learning}</p>
                      <p className="text-xs text-amber-600">{t("vocabulary.bookDetail.learning")}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-slate-50">
                      <Sparkles className="h-6 w-6 mx-auto text-slate-600 mb-2" />
                      <p className="text-2xl font-bold text-slate-700">{book.stats.newWords}</p>
                      <p className="text-xs text-slate-600">{t("vocabulary.bookDetail.new")}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">
                      {t("vocabulary.wordsCount", { count: book.stats.totalWords })}
                    </span>
                    <span className="text-primary font-medium">
                      {t("vocabulary.progress", { percent: masteredPercent })}
                    </span>
                  </div>
                  <div className="h-3 bg-neutral-border rounded-full overflow-hidden flex">
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Goal Card */}
            <Card className={cn("relative overflow-hidden", book.coverColor)}>
              <div className="absolute inset-0 bg-black/20" />
              <CardContent className="relative pt-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {t("vocabulary.bookDetail.todayGoal")}
                    </h3>
                    <div className="space-y-1 text-sm text-white/90">
                      <p>{t("vocabulary.bookDetail.wordsToReview", { count: book.stats.todayReview })}</p>
                      <p>{t("vocabulary.bookDetail.newWordsToday", { count: book.stats.todayNew })}</p>
                      <p className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {t("vocabulary.bookDetail.estimatedTime", { minutes: book.stats.estimatedMinutes })}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleStartLearning}
                    className="bg-white text-primary hover:bg-white/90 gap-2 shadow-lg"
                    size="lg"
                  >
                    <PlayCircle className="h-5 w-5" />
                    {t("vocabulary.bookDetail.startSession")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Words */}
          <div className="space-y-lg">
            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <StatCard
                icon={Flame}
                label="Streak"
                value={book.stats.streak}
                subValue="days"
                color="bg-orange-500"
                index={0}
              />
              <StatCard
                icon={TrendingUp}
                label="Accuracy"
                value={`${book.stats.accuracy}%`}
                color="bg-emerald-500"
                index={1}
              />
            </motion.div>

            {/* Recent Words */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  {t("vocabulary.bookDetail.recentWords")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {book.recentWords.map((word, index) => (
                  <WordListItem key={word.id} word={word} index={index} />
                ))}
              </CardContent>
            </Card>

            {/* Difficult Words */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-amber-600">
                  <Brain className="h-4 w-4" />
                  {t("vocabulary.bookDetail.difficult")}
                </CardTitle>
              </CardHeader>
              <CardContent>
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


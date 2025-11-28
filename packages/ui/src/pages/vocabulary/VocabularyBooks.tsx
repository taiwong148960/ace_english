/**
 * Vocabulary Books Page - 词本管理
 * Displays all vocabulary books (user's and system) with search and navigation
 */

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  Plus,
  Search,
  ChevronRight,
  Clock,
  Star,
  Sparkles
} from "lucide-react"
import { cn, useNavigation, useTranslation } from "@ace-ielts/core"

import { MainLayout } from "../../layout"
import {
  Card,
  CardContent,
  Button,
  Progress,
  fadeInUp,
  staggerContainer,
  staggerItem
} from "../../components"

/**
 * Mock vocabulary book data - will be replaced with real data later
 */
interface VocabularyBook {
  id: string
  name: string
  description: string
  wordCount: number
  masteredCount: number
  lastStudied: string | null
  isSystemBook: boolean
  coverColor: string
  icon: "ielts" | "academic" | "business" | "custom"
}

const mockBooks: VocabularyBook[] = [
  {
    id: "ielts-core",
    name: "IELTS Core 3000",
    description: "Essential vocabulary for IELTS Band 6-7",
    wordCount: 3000,
    masteredCount: 1250,
    lastStudied: "2h ago",
    isSystemBook: true,
    coverColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
    icon: "ielts"
  },
  {
    id: "ielts-advanced",
    name: "IELTS Advanced 2000",
    description: "Advanced vocabulary for IELTS Band 7+",
    wordCount: 2000,
    masteredCount: 450,
    lastStudied: "1d ago",
    isSystemBook: true,
    coverColor: "bg-gradient-to-br from-violet-500 to-purple-600",
    icon: "ielts"
  },
  {
    id: "academic-words",
    name: "Academic Word List",
    description: "570 word families common in academic texts",
    wordCount: 570,
    masteredCount: 320,
    lastStudied: "3d ago",
    isSystemBook: true,
    coverColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
    icon: "academic"
  },
  {
    id: "my-words",
    name: "My Saved Words",
    description: "Words collected while browsing",
    wordCount: 156,
    masteredCount: 45,
    lastStudied: "5m ago",
    isSystemBook: false,
    coverColor: "bg-gradient-to-br from-amber-500 to-orange-600",
    icon: "custom"
  },
  {
    id: "business-english",
    name: "Business English",
    description: "Professional vocabulary for workplace",
    wordCount: 800,
    masteredCount: 120,
    lastStudied: null,
    isSystemBook: true,
    coverColor: "bg-gradient-to-br from-slate-600 to-slate-800",
    icon: "business"
  }
]

/**
 * Book cover icon component
 */
function BookIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case "ielts":
      return <Sparkles className={className} />
    case "academic":
      return <BookOpen className={className} />
    case "business":
      return <Star className={className} />
    default:
      return <BookOpen className={className} />
  }
}

/**
 * Single vocabulary book card component
 */
function VocabularyBookCard({
  book,
  onClick,
  index
}: {
  book: VocabularyBook
  onClick: () => void
  index: number
}) {
  const { t } = useTranslation()
  const progressPercent = Math.round((book.masteredCount / book.wordCount) * 100)

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Card
        className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
        onClick={onClick}
      >
        {/* Book Cover Header */}
        <div className={cn("h-24 relative", book.coverColor)}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <BookIcon
              type={book.icon}
              className="h-12 w-12 text-white/90"
            />
          </div>
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 right-2 w-16 h-16 border border-white/30 rounded-full" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border border-white/30 rounded-full" />
          </div>
        </div>

        <CardContent className="pt-4">
          {/* Book Title */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
              {book.name}
            </h3>
            <ChevronRight className="h-4 w-4 text-text-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
          </div>

          {/* Description */}
          <p className="text-xs text-text-secondary line-clamp-2 mb-3 min-h-[32px]">
            {book.description}
          </p>

          {/* Stats */}
          <div className="space-y-2">
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">
                {t("vocabulary.wordsCount", { count: book.wordCount })}
              </span>
              <span className="text-primary font-medium">
                {t("vocabulary.progress", { percent: progressPercent })}
              </span>
            </div>
            <Progress value={progressPercent} animated className="h-1.5" />

            {/* Last studied */}
            <div className="flex items-center gap-1.5 text-xs text-text-tertiary pt-1">
              <Clock className="h-3 w-3" />
              <span>
                {book.lastStudied
                  ? t("vocabulary.lastStudied", { time: book.lastStudied })
                  : t("vocabulary.never")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Main VocabularyBooks page component
 */
export function VocabularyBooks() {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")

  const systemBooks = mockBooks.filter((book) => book.isSystemBook)
  const userBooks = mockBooks.filter((book) => !book.isSystemBook)

  const filteredSystemBooks = systemBooks.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredUserBooks = userBooks.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBookClick = (bookId: string) => {
    navigation.navigate(`/vocabulary/${bookId}`)
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
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {t("vocabulary.pageTitle")}
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {t("vocabulary.wordsCount", {
                count: mockBooks.reduce((acc, book) => acc + book.wordCount, 0)
              })}{" "}
              across {mockBooks.length} books
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
              <input
                type="text"
                placeholder={t("vocabulary.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-md border border-neutral-border bg-neutral-card text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Create Book Button */}
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("vocabulary.createBook")}
            </Button>
          </div>
        </div>

        {/* My Books Section */}
        {filteredUserBooks.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t("vocabulary.myBooks")}
            </h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredUserBooks.map((book, index) => (
                <VocabularyBookCard
                  key={book.id}
                  book={book}
                  onClick={() => handleBookClick(book.id)}
                  index={index}
                />
              ))}
            </motion.div>
          </section>
        )}

        {/* System Books Section */}
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t("vocabulary.systemBooks")}
          </h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredSystemBooks.map((book, index) => (
              <VocabularyBookCard
                key={book.id}
                book={book}
                onClick={() => handleBookClick(book.id)}
                index={index}
              />
            ))}
          </motion.div>
        </section>

        {/* Empty State */}
        {filteredSystemBooks.length === 0 && filteredUserBooks.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <BookOpen className="h-16 w-16 mx-auto text-text-tertiary mb-4" />
            <p className="text-text-secondary">No vocabulary books found</p>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  )
}

export default VocabularyBooks


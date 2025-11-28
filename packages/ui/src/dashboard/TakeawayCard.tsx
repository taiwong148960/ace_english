import React, { useState } from "react"
import { BookOpen, FileText, Play, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn, formatNumber, useTranslation, type TakeawayStats, type BrowsingHistoryItem } from "@ace-ielts/core"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { ToggleGroup, ToggleGroupItem } from "../components/toggle-group"

type TimeRange = TakeawayStats["timeRange"]

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: number
  iconBg: string
  accentColor: string
  delay?: number
}

function StatCard({ icon: Icon, label, value, iconBg, accentColor, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      className="flex-1 relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-center gap-4 p-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
          iconBg
        )}>
          <Icon className={cn("h-6 w-6", accentColor)} />
        </div>
        
        <motion.span 
          className="text-3xl font-bold font-display tracking-tight text-text-primary"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.1, type: "spring" }}
        >
          {formatNumber(value)}
        </motion.span>
        
        <span className="text-base text-text-secondary font-medium">{label}</span>
      </div>
    </motion.div>
  )
}

interface HistoryItemProps {
  item: BrowsingHistoryItem
  index: number
}

function useRelativeTime(timestamp: string): string {
  const { t } = useTranslation()
  const now = new Date()
  const time = new Date(timestamp)
  const diffMs = now.getTime() - time.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return t("dashboard.justNow")
  if (diffMins < 60) return t("dashboard.minutesAgo", { count: diffMins })
  if (diffHours < 24) return t("dashboard.hoursAgo", { count: diffHours })
  return t("dashboard.daysAgo", { count: diffDays })
}

function getTypeConfig(type: BrowsingHistoryItem["type"]) {
  switch (type) {
    case "article":
      return { 
        icon: BookOpen, 
        bgColor: "bg-blue-500/15", 
        textColor: "text-blue-600 dark:text-blue-400",
        hoverBg: "hover:bg-blue-500/10",
        dotColor: "bg-blue-500"
      }
    case "video":
      return { 
        icon: Play, 
        bgColor: "bg-rose-500/15", 
        textColor: "text-rose-600 dark:text-rose-400",
        hoverBg: "hover:bg-rose-500/10",
        dotColor: "bg-rose-500"
      }
    default:
      return { 
        icon: BookOpen, 
        bgColor: "bg-blue-500/15", 
        textColor: "text-blue-600 dark:text-blue-400",
        hoverBg: "hover:bg-blue-500/10",
        dotColor: "bg-blue-500"
      }
  }
}

function HistoryItem({ item, index }: HistoryItemProps) {
  const config = getTypeConfig(item.type)
  const Icon = config.icon
  const relativeTime = useRelativeTime(item.timestamp)

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 py-2.5 px-3 rounded-xl",
        "transition-all duration-200 group cursor-pointer",
        "border border-transparent",
        config.hoverBg,
        "hover:border-border/50 hover:shadow-sm"
      )}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ x: 4 }}
    >
      <div className={cn(
        "p-2 rounded-lg flex-shrink-0 transition-transform duration-200",
        "group-hover:scale-110",
        config.bgColor, 
        config.textColor
      )}>
        <Icon className="h-4 w-4" />
      </div>

      <span className="text-sm font-medium text-text-primary truncate flex-1 min-w-0 group-hover:text-text-primary/90">
        {item.title}
      </span>

      <div className="flex items-center gap-2 text-xs flex-shrink-0">
        {item.source && (
          <>
            <span className="px-2 py-0.5 rounded-full bg-neutral-background text-text-tertiary truncate max-w-[100px]">
              {item.source}
            </span>
            <span className={cn("w-1 h-1 rounded-full", config.dotColor, "opacity-40")} />
          </>
        )}
        <span className="text-text-tertiary whitespace-nowrap tabular-nums">
          {relativeTime}
        </span>
      </div>

      <ExternalLink className={cn(
        "h-3.5 w-3.5 text-text-tertiary flex-shrink-0",
        "opacity-0 group-hover:opacity-60 transition-all duration-200",
        "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      )} />
    </motion.a>
  )
}

interface TakeawayCardProps {
  initialStats: TakeawayStats
  browsingHistory: BrowsingHistoryItem[]
  onTimeRangeChange?: (range: TimeRange) => Promise<TakeawayStats>
  className?: string
}

/**
 * Takeaway statistics card with time range selector and browsing history
 */
export function TakeawayCard({
  initialStats,
  browsingHistory,
  onTimeRangeChange,
  className
}: TakeawayCardProps) {
  const { t } = useTranslation()
  const [stats, setStats] = useState(initialStats)
  const [selectedRange, setSelectedRange] = useState<TimeRange>(initialStats.timeRange)
  const [isLoading, setIsLoading] = useState(false)

  const handleRangeChange = async (value: string) => {
    if (!value) return
    const range = value as TimeRange
    setSelectedRange(range)

    if (onTimeRangeChange) {
      setIsLoading(true)
      try {
        const newStats = await onTimeRangeChange(range)
        setStats(newStats)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: "day", label: t("dashboard.timeRanges.day") },
    { value: "week", label: t("dashboard.timeRanges.week") },
    { value: "month", label: t("dashboard.timeRanges.month") },
    { value: "all", label: t("dashboard.timeRanges.all") }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="h-full"
    >
      <Card className={cn("h-full flex flex-col", className)}>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>
            {t("dashboard.takeaway")}
          </CardTitle>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <ToggleGroup
              type="single"
              value={selectedRange}
              onValueChange={handleRangeChange}
            >
              {timeRangeOptions.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.5 + index * 0.05 }}
                >
                  <ToggleGroupItem value={option.value}>
                    {option.label}
                  </ToggleGroupItem>
                </motion.div>
              ))}
            </ToggleGroup>
          </motion.div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col gap-5 pt-0">
          <motion.div
            className={cn(
              "transition-opacity duration-300",
              isLoading && "opacity-50 pointer-events-none"
            )}
            animate={{ opacity: isLoading ? 0.5 : 1 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${stats.wordsViewed}-${stats.articlesRead}-${stats.videosWatched}`}
                className="grid grid-cols-3 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <StatCard
                  icon={FileText}
                  label={t("dashboard.wordsViewed")}
                  value={stats.wordsViewed}
                  iconBg="bg-amber-50"
                  accentColor="text-amber-600/70"
                  delay={0}
                />
                <StatCard
                  icon={BookOpen}
                  label={t("dashboard.articlesRead")}
                  value={stats.articlesRead}
                  iconBg="bg-blue-50"
                  accentColor="text-blue-600/70"
                  delay={0.1}
                />
                <StatCard
                  icon={Play}
                  label={t("dashboard.videosWatched")}
                  value={stats.videosWatched}
                  iconBg="bg-rose-50"
                  accentColor="text-rose-600/70"
                  delay={0.2}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="flex-1 overflow-hidden flex flex-col -mx-2">
            <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              {browsingHistory.slice(0, 10).map((item, index) => (
                <HistoryItem key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default TakeawayCard


import React from "react"
import { BookOpen, FileText, MessageSquare, PenTool, Play, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { cn, useTranslation, type PracticeTask } from "@ace-ielts/core"
import { Button } from "../components/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Checkbox } from "../components/checkbox"

/**
 * Get icon component based on task type
 */
function getTaskIcon(type: PracticeTask["type"]) {
  const iconMap: Record<PracticeTask["type"], React.ElementType> = {
    writing: PenTool,
    vocabulary: MessageSquare,
    reading: BookOpen,
    listening: FileText,
    speaking: FileText,
    grammar: FileText
  }
  return iconMap[type] || FileText
}

/**
 * Get accent color based on task type
 */
function getTaskAccentColor(type: PracticeTask["type"]): string {
  const colorMap: Record<PracticeTask["type"], string> = {
    writing: "bg-accent-purple",
    vocabulary: "bg-accent-orange",
    reading: "bg-accent-blue",
    listening: "bg-accent-blue",
    speaking: "bg-accent-orange",
    grammar: "bg-accent-purple"
  }
  return colorMap[type] || "bg-accent-blue"
}

interface TaskItemProps {
  task: PracticeTask
  isFirst: boolean
  index: number
  onToggle?: (taskId: string, completed: boolean) => void
  onStartPractice?: (taskId: string) => void
}

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

function TaskItem({ task, isFirst, index, onToggle, onStartPractice }: TaskItemProps) {
  const { t } = useTranslation()
  const Icon = getTaskIcon(task.type)
  const accentColor = getTaskAccentColor(task.type)

  if (isFirst) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 rounded-lg bg-primary/5 blur-sm"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          whileHover={{ scale: 1.01, x: 4 }}
          className={cn(
            "relative flex items-center gap-4 p-5 rounded-lg transition-all",
            "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
            "border-l-4 border-l-primary border border-primary/20",
            "shadow-md shadow-primary/10"
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="absolute -top-2 left-4 px-2 py-0.5 bg-primary text-white text-xs font-semibold rounded-full flex items-center gap-1"
          >
            <Zap className="h-3 w-3" />
            {t("dashboard.todaysFocus")}
          </motion.div>

          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onToggle?.(task.id, checked === true)}
            className="border-primary data-[state=checked]:bg-primary"
          />

          <motion.div 
            className={cn("p-3 rounded-lg", accentColor, "ring-2 ring-primary/20")}
            animate={pulseAnimation}
          >
            <Icon className="h-6 w-6 text-text-primary" />
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                {t(`dashboard.taskTypes.${task.type}`)}
              </span>
              <span className="text-xs text-text-tertiary">
                • {task.duration} {t("dashboard.minutesShort")}
              </span>
            </div>
            <span className="text-base font-semibold text-text-primary">
              {task.title}
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Button
              onClick={() => onStartPractice?.(task.id)}
              className="gap-2 shadow-lg shadow-primary/25"
              size="lg"
            >
              <Play className="h-4 w-4" />
              {t("dashboard.startPractice")}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.02)" }}
      className="flex items-center gap-4 p-4 rounded-lg transition-colors"
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => onToggle?.(task.id, checked === true)}
      />

      <motion.div 
        className={cn("p-2 rounded-md", accentColor)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="h-5 w-5 text-text-primary" />
      </motion.div>

      <div className="flex-1">
        <span className="text-sm text-text-secondary">
          [{t(`dashboard.taskTypes.${task.type}`)}]
        </span>
        <span className="ml-2 text-sm font-medium text-text-primary">
          {task.title}
        </span>
        <span className="ml-2 text-sm text-text-tertiary">
          ({task.duration}m)
        </span>
      </div>
    </motion.div>
  )
}

interface InflectionCardProps {
  tasks: PracticeTask[]
  onToggleTask?: (taskId: string, completed: boolean) => void
  onStartPractice?: (taskId: string) => void
  className?: string
}

/**
 * Inflection card showing today's practice tasks
 */
export function InflectionCard({
  tasks,
  onToggleTask,
  onStartPractice,
  className
}: InflectionCardProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full"
    >
      <Card className={cn("h-full flex flex-col", className)}>
        <CardHeader className="pb-md">
          <CardTitle>
            {t("dashboard.inflection")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 flex-1">
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              isFirst={index === 0}
              index={index}
              onToggle={onToggleTask}
              onStartPractice={onStartPractice}
            />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default InflectionCard


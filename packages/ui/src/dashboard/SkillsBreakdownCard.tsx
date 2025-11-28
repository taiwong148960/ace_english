import React from "react"
import { AlertTriangle, Headphones, BookOpen, PenTool, Mic } from "lucide-react"
import { motion } from "framer-motion"
import { cn, useTranslation, type SkillScore, type SkillsBreakdown } from "@ace-ielts/core"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Progress } from "../components/progress"

/**
 * Get icon for each skill type
 */
function getSkillIcon(skill: SkillScore["skill"]) {
  const iconMap: Record<SkillScore["skill"], React.ElementType> = {
    listening: Headphones,
    reading: BookOpen,
    writing: PenTool,
    speaking: Mic
  }
  return iconMap[skill]
}

/**
 * Get accent color for each skill type
 */
function getSkillColor(skill: SkillScore["skill"]): string {
  const colorMap: Record<SkillScore["skill"], string> = {
    listening: "#5B8FD9",
    reading: "#4CAF85",
    writing: "#9575CD",
    speaking: "#D4A054"
  }
  return colorMap[skill]
}

interface SkillItemProps {
  skillScore: SkillScore
  index: number
}

/**
 * Individual skill progress item with animation
 */
function SkillItem({ skillScore, index }: SkillItemProps) {
  const { t } = useTranslation()
  const Icon = getSkillIcon(skillScore.skill)
  const percentage = (skillScore.score / skillScore.maxScore) * 100
  const color = getSkillColor(skillScore.skill)

  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="flex-shrink-0"
      >
        <Icon className="h-5 w-5 text-text-tertiary" />
      </motion.div>

      <span className="text-sm text-text-secondary w-20 flex-shrink-0 truncate">
        {t(`dashboard.skills.${skillScore.skill}`)}
      </span>

      <div className="flex-1">
        <Progress 
          value={percentage} 
          className="h-2.5"
          indicatorColor={color}
          animated
        />
      </div>

      <motion.span 
        className="text-sm font-medium text-text-primary w-8 text-right font-display"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.08 + 0.2 }}
      >
        {skillScore.score}
      </motion.span>

      {skillScore.hasWarning && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.08 + 0.3 }}
        >
          <AlertTriangle className="h-4 w-4 text-functional-warning flex-shrink-0" />
        </motion.div>
      )}
    </motion.div>
  )
}

interface SkillsBreakdownCardProps {
  skillsBreakdown: SkillsBreakdown
  className?: string
}

/**
 * Skills breakdown card showing progress for each English skill
 */
export function SkillsBreakdownCard({
  skillsBreakdown,
  className
}: SkillsBreakdownCardProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-full"
    >
      <Card className={cn("h-full flex flex-col", className)}>
        <CardHeader className="pb-6">
          <CardTitle>
            {t("dashboard.skillsBreakdown")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-evenly pt-0 pb-6">
          {skillsBreakdown.skills.map((skill, index) => (
            <SkillItem key={skill.skill} skillScore={skill} index={index} />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SkillsBreakdownCard


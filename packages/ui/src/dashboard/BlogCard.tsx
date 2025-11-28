import React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Clock, Newspaper } from "lucide-react"
import { cn, useTranslation, type BlogArticle } from "@ace-ielts/core"
import { Button } from "../components/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"

interface BlogCardProps {
  articles: BlogArticle[]
  onViewAll?: () => void
  onArticleClick?: (article: BlogArticle) => void
  className?: string
}

function ArticleItem({
  article,
  index,
  onClick
}: {
  article: BlogArticle
  index: number
  onClick?: () => void
}) {
  const { t } = useTranslation()

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick()
        }
      }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
      whileHover={{ x: 4 }}
      className="group flex items-start gap-3 p-2 -mx-2 rounded-md hover:bg-surface-secondary/50 transition-colors cursor-pointer"
    >
      {article.thumbnailUrl ? (
        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-surface-secondary">
          <img
            src={article.thumbnailUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-md flex-shrink-0 bg-gradient-to-br from-primary/20 to-accent-purple/20 flex items-center justify-center">
          <Newspaper className="w-5 h-5 text-primary" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
          {article.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="w-3 h-3 text-text-tertiary" />
          <span className="text-xs text-text-tertiary">
            {t("dashboard.blog.readTime", { count: article.readTimeMinutes })}
          </span>
          {article.category && (
            <>
              <span className="text-text-tertiary">·</span>
              <span className="text-xs text-primary/80">{article.category}</span>
            </>
          )}
        </div>
      </div>

      <motion.div
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ x: -4 }}
        whileHover={{ x: 0 }}
      >
        <ArrowUpRight className="w-4 h-4 text-text-tertiary" />
      </motion.div>
    </motion.a>
  )
}

/**
 * Blog card showing latest articles from the official website
 */
export function BlogCard({
  articles,
  onViewAll,
  onArticleClick,
  className
}: BlogCardProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="h-full"
    >
      <Card className={cn("h-full flex flex-col", className)}>
        <CardHeader className="pb-md">
          <div className="flex items-center justify-between">
            <CardTitle>
              {t("dashboard.blog.title")}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 flex-1 flex flex-col">
          <div className="flex-1 space-y-1">
            {articles.slice(0, 3).map((article, index) => (
              <ArticleItem
                key={article.id}
                article={article}
                index={index}
                onClick={onArticleClick ? () => onArticleClick(article) : undefined}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2"
          >
            <Button
              variant="secondary"
              onClick={onViewAll}
              className="w-full"
            >
              {t("dashboard.blog.viewAll")}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default BlogCard


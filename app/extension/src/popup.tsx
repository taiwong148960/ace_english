import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, ExternalLink } from "lucide-react"
import { 
  PlatformProvider, 
  useTranslation,
  setLanguageStorageAdapter,
  initI18nWithStorage
} from "@ace-ielts/core"
import { Button } from "@ace-ielts/ui"

import "./styles/globals.css"
import { extensionPlatformContext, extensionLanguageStorageAdapter } from "./adapters"

// Configure i18n with extension storage
setLanguageStorageAdapter(extensionLanguageStorageAdapter)

/**
 * Popup content component
 */
function PopupContent() {
  const { t } = useTranslation()

  useEffect(() => {
    // Initialize i18n with stored language
    initI18nWithStorage()
  }, [])

  const handleOpenDashboard = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("tabs/dashboard.html")
    })
  }

  return (
    <motion.div 
      className="w-[280px] p-4 bg-neutral-card"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header with logo */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div 
          className="p-2 bg-primary-50 rounded-md"
          whileHover={{ scale: 1.05 }}
        >
          <BookOpen className="h-5 w-5 text-primary" />
        </motion.div>
        <div>
          <h1 className="text-h3 font-bold font-display text-text-primary">
            {t("common.appName")}
          </h1>
          <p className="text-xs text-text-tertiary">
            Ace Your IELTS
          </p>
        </div>
      </div>

      {/* Quick stats preview */}
      <motion.div 
        className="bg-neutral-background rounded-sm p-3 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Current Level</span>
          <span className="text-lg font-bold font-display text-primary">6.5</span>
        </div>
      </motion.div>

      {/* Open dashboard button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.15 }}
      >
        <Button 
          onClick={handleOpenDashboard}
          className="w-full gap-2"
        >
          <span>Open Dashboard</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  )
}

/**
 * Extension popup component
 * Provides quick access to open the dashboard
 */
function Popup() {
  return (
    <PlatformProvider context={extensionPlatformContext}>
      <PopupContent />
    </PlatformProvider>
  )
}

export default Popup


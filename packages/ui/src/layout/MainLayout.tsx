import React from "react"
import { motion } from "framer-motion"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

interface MainLayoutProps {
  children: React.ReactNode
  activeNav?: string
  onNavigate?: (itemId: string) => void
}

/**
 * Main layout component combining sidebar, header, and content area
 * Follows the design system's layout specifications with Framer Motion animations
 */
export function MainLayout({
  children,
  activeNav = "dashboard",
  onNavigate
}: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-neutral-background">
      {/* Sidebar */}
      <Sidebar activeItem={activeNav} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content with animated entrance */}
        <motion.main 
          className="flex-1 overflow-auto p-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}

export default MainLayout


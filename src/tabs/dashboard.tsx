import React from "react"

import "~/styles/globals.css"
import "~/i18n"

import { Dashboard } from "~/pages/Dashboard"

/**
 * Plasmo Tab Entry Point
 * This creates a new tab page accessible via chrome-extension://[id]/tabs/dashboard.html
 * The extension icon click handler opens this tab
 */
function DashboardTab() {
  return <Dashboard />
}

export default DashboardTab


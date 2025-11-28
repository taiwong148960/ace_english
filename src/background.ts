/**
 * Background Service Worker
 * Handles extension icon clicks and manages the dashboard tab
 */

// Tab URL for the dashboard
const DASHBOARD_TAB_URL = "tabs/dashboard.html"

/**
 * Handle extension icon click
 * Opens dashboard in a new tab or focuses existing tab if already open
 */
chrome.action.onClicked.addListener(async () => {
  try {
    // Get all tabs to check if dashboard is already open
    const tabs = await chrome.tabs.query({})
    
    // Find existing dashboard tab
    const existingTab = tabs.find((tab) => 
      tab.url?.includes(chrome.runtime.id) && 
      tab.url?.includes(DASHBOARD_TAB_URL)
    )

    if (existingTab && existingTab.id) {
      // Dashboard tab exists - focus it
      await chrome.tabs.update(existingTab.id, { active: true })
      
      // Also focus the window containing the tab
      if (existingTab.windowId) {
        await chrome.windows.update(existingTab.windowId, { focused: true })
      }
    } else {
      // Create new dashboard tab
      await chrome.tabs.create({
        url: chrome.runtime.getURL(DASHBOARD_TAB_URL)
      })
    }
  } catch (error) {
    console.error("Error handling extension click:", error)
    // Fallback: just open a new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL(DASHBOARD_TAB_URL)
    })
  }
})

/**
 * Handle extension installation/update
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Open dashboard on first install
    chrome.tabs.create({
      url: chrome.runtime.getURL(DASHBOARD_TAB_URL)
    })
  }
})

export {}


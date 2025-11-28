import React from "react"
import { Routes, Route } from "react-router-dom"
import {
  Dashboard,
  VocabularyBooks,
  VocabularyBookDetail,
  VocabularyLearning
} from "@ace-ielts/ui"

import { LandingPage } from "./pages/LandingPage"

/**
 * Main App component for Web application
 * Handles routing between Landing page and Dashboard
 */
export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/vocabulary" element={<VocabularyBooks />} />
      <Route path="/vocabulary/:bookId" element={<VocabularyBookDetail />} />
      <Route path="/vocabulary/:bookId/learn" element={<VocabularyLearning />} />
    </Routes>
  )
}

export default App



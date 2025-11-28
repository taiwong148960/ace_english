import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import {
  PlatformProvider,
  setLanguageStorageAdapter
} from "@ace-ielts/core"
import "@ace-ielts/core/i18n"

import "./styles/globals.css"
import { App } from "./App"
import { webPlatformContext, webLanguageStorageAdapter } from "./adapters"

// Configure i18n with web storage
setLanguageStorageAdapter(webLanguageStorageAdapter)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PlatformProvider context={webPlatformContext}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PlatformProvider>
  </React.StrictMode>
)



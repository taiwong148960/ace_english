/**
 * Auth Callback Page
 * Handles OAuth callback and redirects to dashboard
 */

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useAuth, useNavigation } from "@ace-ielts/core"

type CallbackStatus = "loading" | "success" | "error"

/**
 * Auth callback page component
 */
export function AuthCallback() {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading } = useAuth()
  const navigation = useNavigation()
  const [status, setStatus] = useState<CallbackStatus>("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check URL for errors
    const url = new URL(window.location.href)
    const errorParam = url.searchParams.get("error")
    const errorDescription = url.searchParams.get("error_description")

    if (errorParam) {
      setStatus("error")
      setError(errorDescription || errorParam)
      return
    }

    // Wait for auth state to settle
    if (!isLoading) {
      if (isAuthenticated) {
        setStatus("success")
        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          navigation.navigate("/dashboard")
        }, 1500)
      } else {
        // Still waiting or failed
        const timer = setTimeout(() => {
          if (!isAuthenticated) {
            setStatus("error")
            setError(t("auth.error.callbackFailed"))
          }
        }, 5000)

        return () => clearTimeout(timer)
      }
    }
  }, [isAuthenticated, isLoading, navigation, t])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/50 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#0E7569]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#0E7569]/10 to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 text-center"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl shadow-slate-200/50">
          {status === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#0E7569]/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#0E7569] animate-spin" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("auth.signingIn")}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {t("auth.pleaseWait")}
                </p>
              </div>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("auth.loginSuccess")}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {t("auth.redirecting")}
                </p>
              </div>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("auth.loginFailed")}
                </h2>
                <p className="text-sm text-red-500 mt-1 max-w-xs">
                  {error || t("auth.error.unknown")}
                </p>
              </div>
              <a
                href="/login"
                className="mt-4 text-sm text-[#0E7569] hover:underline"
              >
                {t("auth.tryAgain")}
              </a>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default AuthCallback


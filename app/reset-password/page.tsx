"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [isValidToken, setIsValidToken] = useState(true)

  useEffect(() => {
    const hash = window.location.hash // "#error=access_denied&error_code=otp_expired&error_description=..."
    const params = new URLSearchParams(hash.slice(1)) // Remove the "#" and parse it

    if (hash.includes("error=access_denied")) {
      const errorCode = params.get("error_code")
      const errorDescription = params.get("error_description")

      console.log(errorCode, errorDescription)
      setIsValidToken(false)
      // Optionally store the error message for display
    } else {
      const tokenParam = params.get("access_token")
      setToken(tokenParam)
      setIsValidToken(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setIsLoading(true)

    try {
      // Validate passwords
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long")
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords don't match")
      }

      // Simulate API call
      //await new Promise((resolve) => setTimeout(resolve, 1500))

      // call an api to reset the password
      const apiUrl: string = `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/reset-password`

      const response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ token, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setStatus("error")
        throw new Error(errorData.error || "Failed to reset password")
      }

      setStatus("success")
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4"
        >
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Invalid or expired link</h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Button onClick={() => router.push("/forgot-password")} className="w-full">
              Request new link
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4"
      >
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>

        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-900"
          >
            Create new password
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mt-2"
          >
            Your new password must be different from previously used passwords
          </motion.p>
        </div>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Password reset successful</h2>
            <p className="text-gray-600 mb-6">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Button onClick={() => router.push("/login")} className="w-full">
              Sign in
            </Button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-md bg-red-50 flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Must be at least 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                "Reset password"
              )}
            </Button>
          </motion.form>
        )}
      </motion.div>
    </div>
  )
}

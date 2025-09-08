"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

//import { supabase } from "@/lib/supabaseClient"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [user, setUser] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    linkedin_handle: "",
    profile_picture_url: "",
    plan: "",
    plan_started_at: "",
    plan_expires_at: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // get token from localstorage
  useEffect(() => {
    const accessToken = window.localStorage.getItem("lia_access_token")
    if (accessToken) {
      setToken(accessToken)
    }
  }, [])

  // fetch user using the token
  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setIsAuthenticated(false)
            setUser({
              ...data
            })
            setEmail(data.email)
          } else {
            setIsAuthenticated(true)
          }
        })
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setIsLoading(true)

    try {
      // Validate emails
      if (!email.includes("@") || !email.includes(".")) {
        throw new Error("Please enter a valid email address")
      }

      // call an api to reset the password
      await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/promotions/influencer-offer/confirm`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?.id, promotionCode: 'INFLUENCER', email }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          if (data.error) {
            throw new Error(data.error || "Failed to create offer")
          }
        })

      setStatus("success")
      setIsLoading(false)
    } catch (err) {
      setStatus("error")
      setIsLoading(false)
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container flex h-screen items-center justify-center fixed z-10 w-full bg-white"
      >
        <div className="text-center">
          <Image src="/logo.svg" alt="LIA Logo" width={48} height={48} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground mb-6">Please wait while we get your offer.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <>
    <motion.div className="absolute inset-0 z-[60] h-full w-full">
      <img src="/images/poster/using-lia-chatbot.jpg" className='w-full h-full object-cover'/>
    </motion.div>
    <motion.div className="w-full h-full absolute z-[60] bg-gradient-to-tr from-blue-500 to-red-500 mix-blend-overlay backdrop-blur-sm">

    </motion.div>
    <div className="min-h-screen relative z-[100] flex items-center justify-center bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4"
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-900"
          >
            Get the Offer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mt-2"
          >
            3 Months free access to LIA 🎉 
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
            <h2 className="text-xl font-semibold mb-2">Congratulations! Your request has been approved</h2>
            <p className="text-gray-600 mb-6">
              You should have received an email with the details of your offer.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Dashboard
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
              <Label htmlFor="email">Enter the email you used to create your account</Label>
              <div className="relative">
                <Input
                  id="email"
                  type={"email"}
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
              </div>
              <p className="text-xs text-gray-500">Must be at least 8 characters</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting things up password...
                </>
              ) : (
                "Confirm Offer"
              )}
            </Button>
          </motion.form>
        )}
      </motion.div>
    </div>
    </>
  )
}
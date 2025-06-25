"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Pencil, User } from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"

export default function DashboardPage() {
  const [usageStats, setUsageStats] = useState({
    post_rewrites: 0,
    comment_suggestions: 0,
    post_suggestions: 0,
    total_tokens_used: 0,
    total_usage: 0,
    ai_improve_posts: 0, // ai_improve_post_grammar, ai_improve_post_shorten, ai_improve_post_expand, ai_improve_post_rewrite, ai_improve_post_emoji
  })

  const [getStatsStatus, setGetStatsStatus] = useState("idle")
  const [activity, setActivity] = useState([])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  useEffect(() => {
    function getStats () {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/usage/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("lia_access_token")}`,
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched usage stats:", data)
          if (data.error) {
            console.error("Invalid token, redirecting to refresh token page")
            // Redirect to refresh token page if the token is invalid
            window.location.href = '/refresh-token'
            return
          }
          setUsageStats(data)
          setGetStatsStatus("success")
        })
        .catch((err) => {
          console.error("Error fetching usage stats:", err)
          setGetStatsStatus("error")
          // If the token is expired, try to refresh it by redirecting to the refresh token page
          window.location.href = '/refresh-token'
          
        })
      }

      getStats()
      console.log("getStatsStatus:", getStatsStatus)

  }, [])

  // get activity
  useEffect(() => {
    function getActivity() {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/usage/activity`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("lia_access_token")}`,
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched activity:", data)
          if (data.error) {
            console.error("Invalid token, redirecting to refresh token page")
            // Redirect to refresh token page if the token is invalid
            window.location.href = '/refresh-token'
            return
          }
          setActivity(data)
        })
        .catch((err) => {
          console.error("Error fetching activity:", err)
          // If the token is expired, try to refresh it by redirecting to the refresh token page
          window.location.href = '/refresh-token'
        })
    }

    getActivity()
  }
  , [])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 container py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your LinkedIn AI Assistant usage
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-3"
        >
          <motion.div variants={itemVariants}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Post Rewrites</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{usageStats.post_rewrites}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  AI-generated enhancements to posts
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">AI Improvements</CardTitle>
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{usageStats.ai_improve_posts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Content improvements: Rewrite Sentence, Shorten, Expand, Grammar Check, Emoji Suggestions
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Comment Replies</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{usageStats.comment_suggestions}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  AI-assisted responses
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <User className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Your activity will appear here
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  As you use the LinkedIn AI Assistant to create posts, improve content, and reply to comments, your
                  activity will be tracked here.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="border-t py-6"
      >
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LinkedIn Intelligent Assistant. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground">
              Support
            </Link>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

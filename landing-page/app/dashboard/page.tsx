"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Pencil, User, TrendingUp } from "lucide-react"
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
    function getStats() {
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
            window.location.href = "/refresh-token"
            return
          }
          setUsageStats(data)
          setGetStatsStatus("success")
        })
        .catch((err) => {
          console.error("Error fetching usage stats:", err)
          setGetStatsStatus("error")
          // If the token is expired, try to refresh it by redirecting to the refresh token page
          window.location.href = "/refresh-token"
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
            window.location.href = "/refresh-token"
            return
          }
          setActivity(data)
        })
        .catch((err) => {
          console.error("Error fetching activity:", err)
          // If the token is expired, try to refresh it by redirecting to the refresh token page
          window.location.href = "/refresh-token"
        })
    }

    getActivity()
  }, [])

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
          <p className="text-muted-foreground">Track your LinkedIn AI Assistant usage</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={itemVariants}>
            <Card className="h-full transition-all hover:shadow-md border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Post Rewrites</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{usageStats.post_rewrites}</div>
                <p className="text-xs text-muted-foreground mt-1">AI-generated enhancements</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full transition-all hover:shadow-md border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">AI Improvements</CardTitle>
                <Pencil className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{usageStats.ai_improve_posts}</div>
                <p className="text-xs text-muted-foreground mt-1">Grammar, length & style fixes</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full transition-all hover:shadow-md border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Comment Replies</CardTitle>
                <MessageSquare className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{usageStats.comment_suggestions}</div>
                <p className="text-xs text-muted-foreground mt-1">AI-assisted responses</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full transition-all hover:shadow-md border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {usageStats.post_rewrites + usageStats.ai_improve_posts + usageStats.comment_suggestions}
                </div>
                <p className="text-xs text-muted-foreground mt-1">All AI interactions</p>
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
              {activity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <User className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Your activity will appear here</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    As you use the LinkedIn AI Assistant to create posts, improve content, and reply to comments, your
                    activity will be tracked here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activity.slice(0, 10).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {item.type === "post_rewrite" ? (
                          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                            <Pencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        ) : item.type === "chat_created" ? (
                          <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                            <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                        ) : (
                          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2">
                            <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">
                            {item.type === "post_rewrite" && "Post Rewrite"}
                            {item.type === "chat_created" && "New Chat Session"}
                          </h4>
                          <time className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.type === "post_rewrite" && "AI enhanced your LinkedIn post content"}
                          {item.type === "chat_created" &&
                            `Started new conversation${item.chat_id ? ` • ${item.chat_id.slice(0, 8)}...` : ""}`}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {activity.length > 10 && (
                    <div className="text-center pt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing 10 most recent activities • {activity.length - 10} more
                      </p>
                    </div>
                  )}
                </div>
              )}
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

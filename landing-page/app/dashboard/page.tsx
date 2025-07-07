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

  interface ActivityItem {
    type: string
    timestamp: string
    chat_id?: string
    // add other properties if needed
  }

  const [activity, setActivity] = useState<ActivityItem[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)

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

  // Calculate pagination
  const totalPages = Math.ceil(activity.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentActivities = activity.length > 0 ? activity.slice(startIndex, endIndex) : []

  // Helper function to get activity details
  const getActivityDetails = (item: ActivityItem) => {
    switch (item.type) {
      case "post_rewrite":
        return {
          icon: <Pencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
          bgColor: "bg-blue-100 dark:bg-blue-900",
          title: "Post Rewrite",
          description: "AI enhanced your LinkedIn post content",
        }
      case "comment_suggestion":
        return {
          icon: <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />,
          bgColor: "bg-green-100 dark:bg-green-900",
          title: "Comment Suggestion",
          description: "AI generated a comment response",
        }
      case "post_suggestion":
        return {
          icon: <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
          bgColor: "bg-purple-100 dark:bg-purple-900",
          title: "Post Suggestion",
          description: "AI created a new post suggestion",
        }
      case "chat_message":
        return {
          icon: <MessageSquare className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
          bgColor: "bg-orange-100 dark:bg-orange-900",
          title: "Chat Message",
          description: "New message in AI chat conversation",
        }
      case "ai_improve_post_grammar":
        return {
          icon: <Pencil className="h-4 w-4 text-red-600 dark:text-red-400" />,
          bgColor: "bg-red-100 dark:bg-red-900",
          title: "Grammar Check",
          description: "AI improved post grammar and spelling",
        }
      case "ai_improve_post_shorten":
        return {
          icon: <Pencil className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
          bgColor: "bg-yellow-100 dark:bg-yellow-900",
          title: "Shorten Content",
          description: "AI shortened your post content",
        }
      case "ai_improve_post_expand":
        return {
          icon: <Pencil className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
          bgColor: "bg-indigo-100 dark:bg-indigo-900",
          title: "Expand Content",
          description: "AI expanded your post with more details",
        }
      case "ai_improve_post_rewrite":
        return {
          icon: <Pencil className="h-4 w-4 text-pink-600 dark:text-pink-400" />,
          bgColor: "bg-pink-100 dark:bg-pink-900",
          title: "Rewrite Content",
          description: "AI rewrote your post content",
        }
      case "ai_improve_post_emoji":
        return {
          icon: <Pencil className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />,
          bgColor: "bg-cyan-100 dark:bg-cyan-900",
          title: "Add Emojis",
          description: "AI added emojis to your post",
        }
      default:
        return {
          icon: <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />,
          bgColor: "bg-gray-100 dark:bg-gray-800",
          title: "Activity",
          description: "AI assistant activity",
        }
    }
  }

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
                  {currentActivities.map((item, index) => {
                    const details = getActivityDetails(item)
                    return (
                      <motion.div
                        key={`${item.type}-${item.timestamp}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className={`rounded-full ${details.bgColor} p-2`}>{details.icon}</div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">{details.title}</h4>
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
                            {details.description}
                            {item.chat_id && ` • ${item.chat_id.slice(0, 8)}...`}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-6 border-t">
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1}-{Math.min(endIndex, activity.length)} of {activity.length} activities
                      </div>
                      <div className="flex items-center gap-2 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm border rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        >
                          Previous
                        </button>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                currentPage === page ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                              } flex-shrink-0`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 text-sm border rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        >
                          Next
                        </button>
                      </div>
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

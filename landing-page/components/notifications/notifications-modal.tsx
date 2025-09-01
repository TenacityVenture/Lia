"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface Notification {
  id: string
  type: string
  message: string
  created_at: string
  seen: boolean
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationsModal({ isOpen, onClose }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("lia_access_token")}`,
      },
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setNotifications(data)
      })
      .finally(() => setLoading(false))
  }, [isOpen])

  const markAsRead = (id: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/notifications/${id}/read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("lia_access_token")}`,
      },
      credentials: "include",
    })
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, seen: true } : n))
    )
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-white dark:bg-black rounded-lg w-full max-w-md p-6 overflow-y-auto max-h-[80vh] shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-sm text-muted-foreground">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No notifications</p>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <Card
                key={n.id}
                className={`cursor-pointer transition-all ${
                  n.seen ? "opacity-50" : "opacity-100 bg-accent/10 dark:bg-accent/20"
                }`}
                onClick={() => markAsRead(n.id)}
              >
                <CardHeader className="flex justify-between items-center p-3">
                  <CardTitle className="text-sm font-medium">{n.type}</CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </CardHeader>
                <CardContent className="p-3 pt-0 text-sm">{n.message}</CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
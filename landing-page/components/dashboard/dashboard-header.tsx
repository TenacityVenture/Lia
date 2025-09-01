"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Button,
} from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, User, LogOut, BellRing } from "lucide-react"
import NotificationsModal from "../notifications/notifications-modal"

interface UserType {
  id: string
  name: string
  email: string
  profile_picture_url: string
  plan: string
  plan_expires_at: string
  linkedin_name?: string
  linkedin_profile_url?: string
  linkedin_headline?: string
  linkedin_about?: string
}

interface Notification {
  id: string
  type: string
  message: string
  created_at: string
  seen: boolean
}

export default function DashboardHeader() {
  const pathname = usePathname()
  const [user, setUser] = useState<UserType | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false)

  // Unread count
  const unreadCount = notifications.filter(n => !n.seen).length

  // Fetch user
  const getUser = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("lia_access_token")}`,
      },
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) window.location.href = "/refresh-token"
        else setUser(data)
      })
  }

  // Fetch notifications
  const getNotifications = () => {
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
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (user?.id) getNotifications()
  }, [user])

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container flex h-screen items-center justify-center fixed z-40 w-full bg-white"
      >
        <div className="text-center">
          <Image src="/logo.svg" alt="LIA Logo" width={48} height={48} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground mb-6">Please wait while we load your dashboard.</p>
        </div>
      </motion.div>
    )
  }

  const isOnboardingComplete =
    Boolean(user.linkedin_name?.trim()) &&
    Boolean(user.linkedin_profile_url?.trim()) &&
    Boolean(user.linkedin_headline?.trim()) &&
    Boolean(user.linkedin_about?.trim())

  if (!isOnboardingComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container flex h-screen items-center justify-center fixed z-40 w-full bg-white"
      >
        <div className="text-center">
          <Image src="/logo.svg" alt="LIA Logo" width={48} height={48} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Onboarding Required</h1>
          <p className="text-muted-foreground mb-6">
            Please complete the onboarding process to access your dashboard.
          </p>
          <Button className="w-full" variant={"default"} onClick={() => (window.location.href = "/onboarding")}>
            Go to Onboarding
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b"
      >
        <div className="container flex h-16 items-center justify-between">
          {/* Logo + Nav */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="LIA Logo" width={24} height={24} />
              <span className="text-xl font-bold text-primary">LIA</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link
                href="/dashboard"
                className={`transition-colors hover:text-foreground ${
                  pathname === "/dashboard" ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/profile"
                className={`transition-colors hover:text-foreground ${
                  pathname === "/dashboard/profile" ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                Profile
              </Link>
              <Link
                href="/pricing"
                className={`transition-colors hover:text-foreground ${
                  pathname === "/pricing" ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                Pricing
              </Link>
            </nav>
            <p className="font-bold ml-5">
              You are on <span className="text-blue-500">{user.plan}</span> plan
            </p>
          </div>

          {/* User + Notifications */}
          <div className="flex items-center gap-4">
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profile_picture_url} alt={user.name} />
                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center cursor-pointer">
                    <Home className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pricing" className="flex items-center cursor-pointer">
                    💳 <span className="ml-2">Pricing</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <Link href="/logout">Log out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <BellRing className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Notifications</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      You have {unreadCount} unread
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.slice(0, 5).map(n => (
                  <DropdownMenuItem
                    key={n.id}
                    className={`flex flex-col justify-start items-start space-y-1 cursor-pointer ${
                      n.seen ? "opacity-50" : "bg-accent/10 dark:bg-accent/20"
                    }`}
                    onClick={() => {
                      fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/${n.id}/read`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem("lia_access_token")}`,
                        },
                        credentials: "include",
                      })
                      setNotifications(prev =>
                        prev.map(nt => (nt.id === n.id ? { ...nt, seen: true } : nt))
                      )
                    }}
                  >
                    <p className="text-sm font-medium text-[#4a4a4a]">{n.type}</p>
                    <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsNotifModalOpen(true)}>
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
      />
    </>
  )
}

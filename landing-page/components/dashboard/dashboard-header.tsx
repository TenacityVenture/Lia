"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, User, LogOut } from "lucide-react"

import { useEffect, useState } from "react"

export default function DashboardHeader() {
  const [user, setUser] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    linkedin_handle: "",
    profile_picture_url: "",
    plan: "",
    plan_expires_at: "",
    linkedin_name: "",
    linkedin_profile_url: "",
    linkedin_headline: "",
    linkedin_about: ""
  })

  // Get the current pathname to highlight the active link
  const pathname = usePathname()

  function getUser () {
    // this function would typically fetch user data from the api-server

    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("lia_access_token")}`,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched user data:", data)
        if (data.error) {
          console.error("Invalid token, redirecting to refresh token page")
          // Redirect to refresh token page if the token is invalid
          window.location.href = '/refresh-token'
        } else {
          console.log("User data:", data)
          setUser(data)
        }
      })
  }

  useEffect(() => {
    getUser()
  }, [])

  if (!user || !user.id) {
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

  // check if the user has linkedin_name etc
  // if it doesn't we know that they haven't completed the onboarding process
  const isOnboardingComplete =
  Boolean(user.linkedin_name?.trim()) &&
  Boolean(user.linkedin_profile_url?.trim()) &&
  Boolean(user.linkedin_headline?.trim()) &&
  Boolean(user.linkedin_about?.trim());

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
            <Button className="w-full" variant={"default"} onClick={() => {
              // Redirect to onboarding page
              window.location.href = "/onboarding"
            }}>
              Go to Onboarding
            </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border-b"
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="LIA Logo" width={24} height={24} className="h-6 w-6" />
              <span className="text-xl font-bold text-primary">LIA</span>
            </Link>
          </div>
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
                pathname === "/dashboard/profile" ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              Pricing
            </Link>
          </nav>
          <p className="font-bold ml-5">You are on <span className="text-blue-500">{user.plan}</span> plan</p>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/testimonials/avatar1.jpg" alt="User" />
                  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user ? user.email : ''}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center cursor-pointer">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
                <DropdownMenuItem asChild>
                <Link href="/pricing" className="flex items-center cursor-pointer">
                  <span className="mr-2 h-4 w-4">💳</span>
                  <span>Pricing</span>
                </Link>
                </DropdownMenuItem>
              <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-default">
                <span className="flex flex-col">
                  <span className="font-medium">{user.plan === 'free' ? 'Free Trial' : 'Plan'} expires</span>
                  <span className="text-xs text-muted-foreground">
                  {user.plan_expires_at
                    ? (() => {
                      const expires = new Date(user.plan_expires_at)
                      const now = new Date()
                      const diff = expires.getTime() - now.getTime()
                      if (diff <= 0) return "Expired"
                      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
                      if (days > 1) return `${days} days`
                      if (days === 1) return "1 day"
                      const hours = Math.floor(diff / (1000 * 60 * 60))
                      if (hours > 1) return `${hours} hours`
                      if (hours === 1) return "1 hour"
                      return "Less than 1 hour"
                    })()
                    : "Unknown"}
                  </span>
                </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <Link href={"/logout"} className="w-full h-full">Log out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}
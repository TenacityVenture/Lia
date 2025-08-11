"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Loader2,
  Save,
  UserIcon,
  MailIcon,
  BuildingIcon,
  BriefcaseIcon,
  AtSignIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "lucide-react"

type ProfileFormData = {
  name: string
  email: string
  linkedin_name: string 
  linkedin_profile_url: string
  linkedin_headline: string
  linkedin_about: string
  username: string
  company: string
  job_title: string
  bio?: string
}

type UserProfile = {
  id: string
  name: string
  username: string
  email: string
  linkedin_name: string 
  linkedin_profile_url: string
  linkedin_headline: string
  linkedin_about: string
  profile_picture_url: string
  company: string
  job_title: string
  bio?: string
  created_at?: string
}

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    linkedin_name: "",
    linkedin_profile_url: "",
    linkedin_headline: "",
    linkedin_about: "",
    username: "",
    company: "",
    job_title: "",
  })

  const [user, setUser] = useState<UserProfile>({
    id: "",
    name: "",
    username: "",
    email: "",
    linkedin_name: "",
    linkedin_profile_url: "",
    linkedin_headline: "",
    linkedin_about: "",
    profile_picture_url: "",
    company: "",
    job_title: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setHasChanges(true)
    // Clear messages when user starts typing
    if (saveError) setSaveError(null)
    if (saveSuccess) setSaveSuccess(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("lia_access_token")}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          job_title: formData.job_title,
          username: formData.username,
          linkedin_name: formData.linkedin_name,
          linkedin_profile_url: ('https://www.linkedin.com/in/' + formData.linkedin_profile_url.replace('https://www.linkedin.com/in/', '')),
          linkedin_headline: formData.linkedin_headline,
          linkedin_about: formData.linkedin_about,
        }),
        credentials: "include",
      })

      const data = await response.json()

      if (data.error) {
        setSaveError(data.error)
      } else {
        // Update user state with new data
        setUser((prev) => ({
          ...prev,
          name: formData.name,
          email: formData.email,
          company: formData.company,
          job_title: formData.job_title,
          username: formData.username,
          linkedin_profile_url: formData.linkedin_profile_url,
        }))
        setSaveSuccess("Profile updated successfully!")
        setHasChanges(false)

        // Auto-clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(null), 3000)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setSaveError("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const getUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("lia_access_token")}`,
        },
        credentials: "include",
      })

      const data = await response.json()

      if (data.error) {
        console.error("Invalid token, redirecting to refresh token page")
        window.location.href = "/refresh-token"
      } else {
        setUser(data)
        // Initialize form data with user data
        setFormData({
          name: data.name || "",
          email: data.email || "",
          linkedin_name: data.linkedin_name || "",
          linkedin_profile_url: data.linkedin_profile_url || "",
          linkedin_headline: data.linkedin_headline || "",
          linkedin_about: data.linkedin_about || "",
          username: data.username || "",
          company: data.company || "",
          job_title: data.job_title || "",
        })
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      window.location.href = "/refresh-token"
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 container py-12">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    )
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
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
          {/* Profile Overview Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.profile_picture_url || "/placeholder.svg"} alt="Profile picture" />
                    <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center space-y-1">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.username ? '@'+user.username : ''}</p>
                    {user.job_title && user.company && (
                      <p className="text-sm text-muted-foreground">
                        {user.job_title} at {user.company}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.linkedin_profile_url && (
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`https://linkedin.com/in/${user.linkedin_profile_url.replace("https://www.linkedin.com/in/", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        linkedin.com/in/{user.linkedin_profile_url.replace("https://www.linkedin.com/in/", "")}
                      </a>
                    </div>
                  )}
                  {user.created_at && (
                    <div className="flex items-center gap-2 text-sm">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {hasChanges && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                      <AlertCircleIcon className="h-4 w-4" />
                      You have unsaved changes
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      <UserIcon className="h-4 w-4 inline mr-2" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">
                      <AtSignIcon className="h-4 w-4 inline mr-2" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_name">
                    LinkedIn Full Name
                  </Label>
                  <Input
                    id="linkedin_name"
                    name="linkedin_name"
                    type="linkedin_name"
                    value={formData.linkedin_name}
                    onChange={handleChange}
                    placeholder="Same as your LinkedIn Full Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <MailIcon className="h-4 w-4 inline mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_profile_url">
                    <ExternalLinkIcon className="h-4 w-4 inline mr-2" />
                    LinkedIn Handle
                  </Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      linkedin.com/in/
                    </span>
                    <Input
                      id="linkedin_profile_url"
                      name="linkedin_profile_url"
                      value={formData.linkedin_profile_url.replace("https://www.linkedin.com/in/", "")}
                      onChange={handleChange}
                      placeholder="your-handle"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">
                      <BuildingIcon className="h-4 w-4 inline mr-2" />
                      Company
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Enter your company"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job_title">
                      <BriefcaseIcon className="h-4 w-4 inline mr-2" />
                      Job Title
                    </Label>
                    <Input
                      id="job_title"
                      name="job_title"
                      value={formData.job_title}
                      onChange={handleChange}
                      placeholder="Enter your job title"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_headline">
                    LinkedIn Headline
                  </Label>
                  <Input
                    id="linkedin_headline"
                    name="linkedin_headline"
                    type="linkedin_headline"
                    value={formData.linkedin_headline}
                    onChange={handleChange}
                    placeholder="Same as your LinkedIn headline"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_about">LinkedIn About</Label>
                  <Textarea
                    id="linkedin_about"
                    name="linkedin_about"
                    value={formData.linkedin_about}
                    onChange={handleChange}
                    placeholder="Tell us about yourself...same as your LinkedIn about section"
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">{formData.linkedin_about?.length || 0}/500 characters</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-2">
                  {saveError && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircleIcon className="h-4 w-4" />
                      {saveError}
                    </div>
                  )}
                  {saveSuccess && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircleIcon className="h-4 w-4" />
                      {saveSuccess}
                    </div>
                  )}
                </div>
                <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
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
            <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="/support" className="text-sm text-muted-foreground hover:text-foreground">
              Support
            </a>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

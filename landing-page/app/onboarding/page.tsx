"use client"

import { useEffect, useState } from "react"
//import { useEffect } from "react"
import { useRouter } from "next/navigation"
//import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"

const linkedinFormSchema = z.object({
  linkedin_handle: z.string().min(3, "Required"),
  linkedin_name: z.string().min(3, "Required"),
  linkedin_headline: z.string().min(10, "Too short"),
  linkedin_about: z.string().min(50, "Too short"),
})

type LinkedinFormData = z.infer<typeof linkedinFormSchema>

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  //const searchParams = useSearchParams()

  const form = useForm<LinkedinFormData>({
    resolver: zodResolver(linkedinFormSchema),
    defaultValues: {
      linkedin_handle: "",
      linkedin_name: "",
      linkedin_headline: "",
      linkedin_about: "",
    },
  })

  useEffect(() => {
    // check if user has completed onboarding
    const hasCompleteOnboarding = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("lia_access_token")}`,
        },
        credentials: "include",
      }).then((res) => {
        if (!res.ok) {
          // try to refresh the token
          window.location.href = "/refresh-token"
        }
        return res.json()
      })
      .then((data) => {
        console.log("Fetched user data:", data)
        if (data.error) {
          console.error("Invalid token, redirecting to refresh token page")
          // Redirect to refresh token page if the token is invalid
          window.location.href = "/refresh-token"
        } else {
          console.log("User data:", data)
          if (data.linkedin_name || data.linkedin_headline || data.linkedin_about) {
            router.push("/dashboard?success=account_created")
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err)
        // If the token is expired, try to refresh it by redirecting to the refresh token page
        window.location.href = "/refresh-token"
      })
    }

    hasCompleteOnboarding()
  }, [])

  /*useEffect(() => {
    const fromSignup = searchParams.get("from") === "signup"
    if (!fromSignup) {
      router.push("/login")
    }
  }, [searchParams, router])*/

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 2))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const onSubmit = async (values: LinkedinFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/update-profile/linkedin-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("lia_access_token")}`,
        },
        body: JSON.stringify(values),
        credentials: "include",
      })

      const data = await response.json()
      if (data.error) {
        form.setError("root", { message: data.error })
      } else {
        nextStep()
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      form.setError("root", { message: "Something went wrong" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const completeOnboarding = (route: string) => {
    router.push(route)
  }

  {/*const skipOnboarding = () => {
    router.push("/dashboard?success=account_created")
  }*/}

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex">
      {/* Left side - Progress & Info */}
    <div
      className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12"
      style={{
        background:
        "linear-gradient(135deg, rgba(50,160,241,1) 0%, rgba(136,245,255,0.3) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
      }}
    >
      <div>
        <div className="mb-12">
        <h1 className="text-2xl font-semibold text-primary dark:text-white mb-2">
          <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
            <Link href="/" className="flex items-center justify-center gap-1">
            <Image src="/logo.svg" alt="LIA Logo" width={24} height={24} />
            <span className="text-primary">LIA</span>
            </Link>
          </div>{" "}
          Welcome to Lia
        </h1>
        <p className="text-gray-700 dark:text-gray-400">
          Set up your profile in a few quick steps
        </p>
        </div>

        <div className="space-y-8">
        <div className={`flex items-center space-x-4 ${currentStep >= 0 ? "opacity-100" : "opacity-40"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 0
              ? "bg-primary text-white dark:bg-white dark:text-primary"
              : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>
          <div>
            <p className="font-medium text-primary dark:text-white">LinkedIn Handle</p>
            <p className="text-sm text-gray-600">Your profile URL</p>
          </div>
        </div>

        <div className={`flex items-center space-x-4 ${currentStep >= 1 ? "opacity-100" : "opacity-40"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 1
              ? "bg-primary text-white dark:bg-white dark:text-primary"
              : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <div>
            <p className="font-medium text-primary dark:text-white">Professional Info</p>
            <p className="text-sm text-gray-600">Headline and about</p>
          </div>
        </div>

        <div className={`flex items-center space-x-4 ${currentStep >= 2 ? "opacity-100" : "opacity-40"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= 2
              ? "bg-primary text-white dark:bg-white dark:text-primary"
              : "bg-gray-200 text-gray-500"
            }`}
          >
            3
          </div>
          <div>
            <p className="font-medium text-primary dark:text-white">All Set</p>
            <p className="text-sm text-gray-500">Ready to go</p>
          </div>
        </div>
        </div>
      </div>

      <div className="text-sm text-gray-500">Step {currentStep + 1} of 3</div>
    </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-primary dark:text-white">What&apos;s your LinkedIn handle?</h2>
                  <p className="text-gray-600 dark:text-gray-400">We&apos;ll use this to personalize your experience</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_handle" className="text-sm font-medium">
                      LinkedIn URL
                    </Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 text-sm">
                        linkedin.com/in/
                      </span>
                      <Input
                        id="linkedin_handle"
                        placeholder="yourname"
                        className="rounded-l-none border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-white"
                        {...form.register("linkedin_handle")}
                      />
                    </div>
                    {form.formState.errors.linkedin_handle && (
                      <p className="text-sm text-red-600">{form.formState.errors.linkedin_handle.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_name" className="text-sm font-medium">
                      LinkedIn Full Name
                    </Label>
                    <div className="flex">
                      <Input
                        id="linkedin_name"
                        placeholder="must be same as your LinkedIn profile name"
                        className="rounded-l-none border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-white"
                        {...form.register("linkedin_name")}
                      />
                    </div>
                    {form.formState.errors.linkedin_name && (
                      <p className="text-sm text-red-600">{form.formState.errors.linkedin_name.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    {/*<Button
                      type="button"
                      variant="ghost"
                      onClick={skipOnboarding}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Skip for now
                    </Button>*/}
                    <Button
                      onClick={nextStep}
                      disabled={!form.watch("linkedin_handle")}
                      className="bg-primary hover:bg-gray-800 text-white dark:bg-white dark:text-primary dark:hover:bg-gray-100"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-primary dark:text-white">Tell us about yourself</h2>
                  <p className="text-gray-600 dark:text-gray-400">Copy from your LinkedIn profile for best results</p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_headline" className="text-sm font-medium">
                      Professional headline
                    </Label>
                    <Input
                      id="linkedin_headline"
                      placeholder="Senior Software Engineer at Company"
                      className="border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-white"
                      {...form.register("linkedin_headline")}
                    />
                    {form.formState.errors.linkedin_headline && (
                      <p className="text-sm text-red-600">{form.formState.errors.linkedin_headline.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin_about" className="text-sm font-medium">
                      About section
                    </Label>
                    <Textarea
                      id="linkedin_about"
                      placeholder="Paste your LinkedIn about section here..."
                      rows={6}
                      className="resize-none border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-white"
                      {...form.register("linkedin_about")}
                    />
                    {form.formState.errors.linkedin_about && (
                      <p className="text-sm text-red-600">{form.formState.errors.linkedin_about.message}</p>
                    )}
                  </div>

                  {form.formState.errors.root && (
                    <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-gray-800 text-white dark:bg-white dark:text-primary dark:hover:bg-gray-100"
                    >
                      {isSubmitting ? "Saving..." : "Complete setup"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 text-center"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-8 h-8 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-primary dark:text-white">You&apos;re all set</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Lia is ready to assist you with intelligent LinkedIn interactions
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 ">

                <Button
                  onClick={() => completeOnboarding("/dashboard")}
                  className="w-full bg-primary hover:bg-gray-800 text-white dark:bg-white dark:text-primary dark:hover:bg-gray-100"
                >
                  <Link href="/dashboard" className="flex items-center justify-center">
                  Go to Dashboard
                  </Link>
                </Button>
                <Button
                  className="w-full bg-gray-800 hover:bg-primary text-white dark:bg-white dark:text-primary dark:hover:bg-gray-100"
                >
                  <Link href="https://chromewebstore.google.com/detail/heoeljdamfonjeellpecmbdboabniimp" className="flex items-center justify-center" target="_blank">
                    Download Extension
                  </Link>
                </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Download, Sparkles, Gift, Star } from "lucide-react"

function CompleteContent() {
  const searchParams = useSearchParams()
  const [subscriptionStatus, setSubscriptionStatus] = useState<"loading" | "success" | "error">("loading")
  const [planName, setPlanName] = useState("")

  const plan = searchParams.get("plan") || "starter" // fallback to starter plan for testing
  const subscriptionId = searchParams.get("subscription_id") || 1234 // fallback id for testing
  const token = searchParams.get("token") || "test-token" // fallback token for 
  const status = searchParams.get("status")
  console.log(status)

  useEffect(() => {
    // Simulate subscription verification
    const verifySubscription = async () => {
      try {
        // fetch user/me
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("lia_access_token")}`,
          },
        })

        if (!response.ok) {
          // try to refresh the token
          window.location.href = "/refresh-token"

          throw new Error("Failed to verify subscription")
        }

        const user = await response.json()
        // Assuming the response contains user user with plan information
        if (!user || !user.plan) {
          throw new Error("No plan information found")
        }
        // Set the plan name based on the plan type
        if (user.plan === "standard") {
          setPlanName('Starter Plan')
        } else if (user.plan === "pro") {
          setPlanName("Professional Plan")
        }

        setSubscriptionStatus("success")
      } catch (error) {
        console.error("Error verifying subscription:", error)
        setSubscriptionStatus("error")
      }
    }

    if (subscriptionId && token) {
      verifySubscription()
    } else {
      setSubscriptionStatus("error")
    }
  }, [subscriptionId, token, plan])

  if (subscriptionStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Subscription</h2>
            <p className="text-gray-600">Please wait while we confirm your PayPal payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (subscriptionStatus === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <CheckCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-red-900 mb-2">Payment Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t verify your payment. Please contact support if you believe this is an error.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/support">Contact Support</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/pricing">Back to Pricing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center shadow-2xl border-0">
        <CardHeader className="pb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-10"></div>
          <div className="relative">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <Badge variant="secondary" className="bg-green-100 text-green-800 font-semibold">
                Payment Successful
              </Badge>
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Welcome to LIA {planName === 'Starter Plan' ? 'Starter!' : 'Pro!'} 🎉
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              {status === 'active' ? (
                `Already have an active subscription of: ${plan === 'standard' ? 'Starter Plan' : 'Professional Plan'}`
              ) : (
                <>
                  Your <span className="font-semibold text-blue-600">{plan}</span> subscription is now active and ready
                  to supercharge your LinkedIn presence.
                </>
              )}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-6">
          {/* Success Message */}
          <div className="rounded-xl bg-gradient-to-r from-green-50 to-blue-50 p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <Gift className="h-6 w-6 text-green-600" />
              <h3 className="font-bold text-green-900 text-lg">What&apos;s Next?</h3>
            </div>
            <ul className="text-sm text-green-800 space-y-2 text-left">
              <li className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Download the Chrome extension
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Add your OpenAI API key in settings
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Start creating amazing LinkedIn content
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Access your analytics dashboard
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              asChild
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              size="lg"
            >
              <Link href="https://chrome.google.com/webstore" target="_blank">
                <Download className="mr-2 h-5 w-5" />
                Download Extension
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full h-12 text-lg border-2 border-blue-200 hover:bg-blue-50 bg-transparent"
            >
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Subscription Details */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Subscription Details</h4>
            <div className="space-y-1 text-gray-600">
              <p>
                <span className="font-medium">Plan:</span> {planName}
              </p>
              <p>
                <span className="font-medium">Billing:</span> Monthly via PayPal
              </p>
              <p>
                <span className="font-medium">Status:</span> <span className="text-green-600 font-medium">Active</span>
              </p>
            </div>
          </div>

          {/* Support Info */}
          <div className="text-xs text-muted-foreground bg-blue-50 rounded-lg p-4">
            <p className="font-medium text-blue-900 mb-1">Need help getting started?</p>
            <p className="text-blue-700">
              Contact our support team at{" "}
              <a href="mailto:support@getlia.live" className="underline hover:text-blue-900">
                support@getlia.live
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BillingCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <CompleteContent />
    </Suspense>
  )
}

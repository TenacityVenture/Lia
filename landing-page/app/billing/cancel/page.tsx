"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { XCircle, ArrowLeft, MessageCircle, RefreshCw, Heart, HelpCircle } from "lucide-react"

function CancelContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan")

  const planName = plan === "starter" ? "Starter Plan" : plan === "professional" ? "Professional Plan" : "Selected Plan"

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center shadow-2xl border-0">
        <CardHeader className="pb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-10"></div>
          <div className="relative">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 shadow-lg">
              <XCircle className="h-10 w-10 text-white" />
            </div>
            <Badge variant="secondary" className="mb-3 bg-orange-100 text-orange-800 font-semibold">
              Payment Cancelled
            </Badge>
            <CardTitle className="text-3xl font-bold text-gray-900">No Worries! 😊</CardTitle>
            <CardDescription className="text-lg mt-2">
              Your <span className="font-semibold text-orange-600">{planName}</span> subscription wasn&apos;t created and you
              haven&apos;t been charged.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-6">
          {/* Reassurance Message */}
          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-6 w-6 text-blue-600" />
              <h3 className="font-bold text-blue-900 text-lg">Still Interested?</h3>
            </div>
            <p className="text-sm text-blue-800 text-left">
              You can always come back and subscribe later. We&apos;ll be here when you&apos;re ready to supercharge your LinkedIn
              presence with AI-powered content creation!
            </p>
          </div>

          {/* Why Users Cancel */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-gray-600" />
              Common Questions
            </h3>
            <div className="space-y-3 text-sm text-left">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Need more time to decide?</p>
                  <p className="text-gray-600">Take your time! Our pricing and features won&apos;t change.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Want to see it in action first?</p>
                  <p className="text-gray-600">Check out our demo to see how LIA can help you.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Have questions about features?</p>
                  <p className="text-gray-600">Our support team is here to help clarify anything.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              asChild
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              size="lg"
            >
              <Link href="/pricing">
                <RefreshCw className="mr-2 h-5 w-5" />
                Try Again
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                asChild
                variant="outline"
                className="h-11 border-2 border-gray-200 hover:bg-gray-50 bg-transparent"
              >
                <Link href="/demo">Watch Demo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 border-2 border-gray-200 hover:bg-gray-50 bg-transparent"
              >
                <Link href="/support">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Get Help
                </Link>
              </Button>
            </div>

            <Button asChild variant="ghost" className="w-full text-gray-600 hover:text-gray-900">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          {/* Special Offer */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-green-600 text-white">Limited Time</Badge>
            </div>
            <h3 className="font-bold text-green-900 mb-2">Still thinking it over?</h3>
            <p className="text-sm text-green-800 mb-4">
              Get 20% off your first month when you subscribe within the next 24 hours!
            </p>
            <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
              <Link href="/pricing?discount=SAVE20">Claim Discount</Link>
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-xs text-muted-foreground bg-blue-50 rounded-lg p-4">
            <p className="font-medium text-blue-900 mb-1">Questions? We&apos;re here to help!</p>
            <p className="text-blue-700">
              Email us at{" "}
              <a href="mailto:support@getlia.live" className="underline hover:text-blue-900">
                support@getlia.live
              </a>{" "}
              or check out our{" "}
              <Link href="/documentation" className="underline hover:text-blue-900">
                documentation
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BillingCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <CancelContent />
    </Suspense>
  )
}

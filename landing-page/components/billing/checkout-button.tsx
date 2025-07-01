"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

// PayPal type definitions
interface OnApproveData {
  orderID: string
  payerID?: string
  paymentID?: string
  billingToken?: string
  facilitatorAccessToken?: string
}

interface PayPalButtonStyle {
  layout?: "vertical" | "horizontal"
  color?: "gold" | "blue" | "silver" | "white" | "black"
  shape?: "rect" | "pill"
  label?: "paypal" | "checkout" | "buynow" | "pay" | "installment"
  tagline?: boolean
  height?: number
}

interface CheckoutButtonProps {
  plan: "free-trial" | "starter" | "professional"
  email?: string
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "secondary"
}

const planDetails = {
  "free-trial": {
    name: "Free Trial",
    price: 0,
    description: "Try our service for free",
    planKey: "free-trial",
    popular: false,
    quantity: 1,
  },
  starter: {
    name: "Starter",
    price: 5,
    description: "Basic features for individuals and small teams.",
    planKey: "starter",
    popular: false,
    quantity: 1,
  },
  professional: {
    name: "Professional",
    price: 10,
    description: "Advanced AI features for serious LinkedIn growth and engagement.",
    planKey: "professional",
    popular: true,
    quantity: 1,
  },
}

export function CheckoutButton({ plan, email, children, className, variant = "default" }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const selectedPlan = planDetails[plan]

  // For free trial, handle differently
  const handleFreeTrialCheckout = async () => {
    setIsLoading(true)
    try {
      // Handle free trial signup logic here
      const response = await fetch("/api/free-trial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, plan }),
      })

      if (!response.ok) {
        throw new Error("Failed to start free trial")
      }

      const data = await response.json()
      console.log("Free trial started:", data)

      // Redirect to success page
      window.location.href = "/welcome"
    } catch (error) {
      console.error("Error starting free trial:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // PayPal configuration
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "USD",
    intent: "capture",
  }

  const paypalButtonStyle: PayPalButtonStyle = {
    layout: "vertical",
    color: "gold",
    shape: "rect",
    label: "paypal",
    height: 40,
  }

  const onCreateOrder = async (): Promise<string> => {
    setIsLoading(true)
    // first check if the user already have an active subscription by making a call to api/user/me
    // which has the plan the plan_created_at and plan_expires_at if it does tell them that they already have an activite subscriptin
    // and redirect them to billing/complete
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST || ""}/api/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("lia_access_token"), // Use token from localStorage
      },
      credentials: "include",
    })
    if (!response.ok) {
      // try refreshing the token and try again
      window.location.href = "/refresh-token"
    }

    const userData = await response.json()
    console.log(userData)
    if (userData.plan && userData.plan_expires_at && new Date(userData.plan_expires_at) > new Date()) {
      // User already has an active subscription
      console.log("User already has an active subscription:", userData.plan)
      window.location.href = `/billing/complete?plan=${userData.plan}&status=active`
      setIsLoading(false)
      return ""
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST || ""}/api/paypal/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("lia_access_token"), // Use token from localStorage
        },
        credentials: "include",
        body: JSON.stringify({
          cart: [selectedPlan || plan],
          email,
          amount: selectedPlan?.price || 0,
          planName: selectedPlan?.name || plan,
        }),
      })

      if (!response.ok) {
        // try refreshing the token and try again
        try {
          const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_HOST || ""}/api/auth/refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
          if (!refreshResponse.ok) {
            throw new Error("Failed to refresh access token")
          }
          const refreshData = await refreshResponse.json()
          localStorage.setItem("lia_access_token", refreshData.accessToken) // Update localStorage

          // Retry the create order request with the new token
          const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_HOST || ""}/api/paypal/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("lia_access_token"),
            },
            credentials: "include",
            body: JSON.stringify({
              cart: [selectedPlan || plan],
              email,
              amount: selectedPlan?.price || 0,
              planName: selectedPlan?.name || plan,
            }),
          })
          if (!retryResponse.ok) {
            const retryErrorData = await retryResponse.json().catch(() => ({}))
            throw new Error(retryErrorData.message || `HTTP error! status: ${retryResponse.status}`)
          }
          const retryData = await retryResponse.json()
          console.log("Order created successfully on retry:", retryData)

          if (!retryData.id) {
            throw new Error("No order ID returned from server")
          }

          return retryData.id
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError)
          throw new Error("Failed to refresh access token")
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Order created successfully:", data)

      if (!data.id) {
        throw new Error("No order ID returned from server")
      }

      return data.id
    } catch (error) {
      console.error("Error during payment:", error)
      throw error // Re-throw the error so PayPal can handle it
    } finally {
      setIsLoading(false)
    }
  }

  const onApprove = async (data: OnApproveData): Promise<unknown> => {
    setIsLoading(true)

    if (!data.orderID) {
      console.error("Order ID is missing")
      setIsLoading(false)
      throw new Error("Order ID is required to capture the order")
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST || ""}/api/paypal/orders/capture/${data.orderID}`,
        {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("lia_access_token"), // Use token from localStorage
          },
          credentials: "include",
        },
      )

      if (!response.ok) {
        // try refreshing the token and try again
        try {
          const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_HOST || ""}/api/auth/refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
          if (!refreshResponse.ok) {
            throw new Error("Failed to refresh access token")
          }
          const refreshData = await refreshResponse.json()
          localStorage.setItem("lia_access_token", refreshData.accessToken) // Update localStorage

          // Retry the capture request with the new token
          const retryResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST || ""}/api/paypal/orders/capture/${data.orderID}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("lia_access_token"),
              },
              credentials: "include",
            },
          )
          if (!retryResponse.ok) {
            const retryErrorData = await retryResponse.json().catch(() => ({}))
            throw new Error(retryErrorData.message || `HTTP error! status: ${retryResponse.status}`)
          }
          const retryData = await retryResponse.json()
          console.log("Order captured successfully on retry:", retryData)
          return retryData
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError)
          throw new Error("Failed to refresh access token")
        }

        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const orderData = await response.json()
      console.log("Order captured successfully:", orderData)

      // Redirect to success page
      window.location.href = "/billing/complete"
      return orderData
    } catch (error) {
      console.error("Error capturing order:", error)
      throw error // Re-throw the error so PayPal can handle it
    } finally {
      setIsLoading(false)
    }
  }

  const onError = (error: Record<string, unknown>) => {
    setIsLoading(false)
    console.error("PayPal Button Error:", error)

    // redirect to error page
    // window.location.href = '/payment-error';
  }

  const onCancel = (data: Record<string, unknown>) => {
    setIsLoading(false)
    console.log("PayPal payment cancelled:", data)
    
    // redirect to cancellation page
    window.location.href = '/billing/cancel'
  }

  // For free trial, show regular button
  if (plan === "free-trial") {
    return (
      <Button onClick={handleFreeTrialCheckout} disabled={isLoading} className={className} variant={variant}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Starting Trial...
          </>
        ) : (
          children
        )}
      </Button>
    )
  }

  // For paid plans, show PayPal buttons
  return (
    <div className={className}>
      {!initialOptions.clientId ? (
        <Button disabled variant="outline">
          PayPal Client ID not configured
        </Button>
      ) : (
        <PayPalScriptProvider options={initialOptions}>
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            <PayPalButtons
              style={paypalButtonStyle}
              createOrder={onCreateOrder}
              onApprove={onApprove}
              onError={onError}
              onCancel={onCancel}
              disabled={isLoading}
            />
          </div>
        </PayPalScriptProvider>
      )}
    </div>
  )
}

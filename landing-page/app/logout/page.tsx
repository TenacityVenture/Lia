"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";

export default function LogoutPage() {

  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      // Clear all authentication data
      localStorage.removeItem("user")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("access_token")
      localStorage.removeItem("lia_access_token")
      //localStorage.removeItem("userPreferences")
      sessionStorage.clear()

      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })

      // Clear the access token cookie
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

      try {
        // Send a message to the extension to clear the tokens
        window.postMessage({ type: "CLEAR_JWTs" }, "*"); // * means all domains (should be restricted to lia extension id)
      } catch (err) {
        console.warn("Error sending CLEAR_JWTs message to extension:", err);
      }

      // Wait a moment to show the logout animation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // logout the user from the Supabase session
      // This is optional if you want to ensure the session is cleared on the server side
      const response = fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensure cookies are sent with the request
      });

      response.then((res) => {
          if (!res.ok) {
              console.error("Failed to log out from the server");
          }
          // clear refresh_token in cookie
          document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      }).catch((error) => {
          console.error("Error logging out from the server:", error);
      });

      // Redirect to login
      router.push("/login?success=logged_out")
    }

    performLogout()
  }, [router])    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Logged Out Successfully
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-6"
          >
            You have been safely logged out of your account.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-500"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting to login...</span>
          </motion.div>
        </motion.div>
      </div>
    )

}
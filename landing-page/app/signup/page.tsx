"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className="absolute left-4 top-4 md:hidden md:z-50 md:left-2/4 md:top-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary"> 
            <Image
                src="/images/writing.jpg"
                alt="Background"
                fill
                className="object-cover opacity-30"
            />
        </div>
        <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
          <Link href="/" className="flex items-center justify-center gap-1">
            <Image src="/logo.svg" alt="LIA Logo" width={24} height={24} />
            <span>LIA</span>
          </Link> 
        </div>
        <div className="relative z-20 mt-auto">
          <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute bottom-8 right-8 p-4 shadow-lg dark:bg-slate-800">
                <blockquote className="space-y-2">
                    <p className="text-lg">
                    "LIA has completely transformed how I engage on LinkedIn. The AI-powered suggestions have helped me create
                    more engaging content and grow my professional network."
                    </p>
                    <footer className="text-sm">Jennifer Lee, Content Strategist</footer>
                </blockquote>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Getting Started</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account and get started with LIA
            </p>
          </div>

          <SignupForm />

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

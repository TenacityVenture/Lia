"use client"

//import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
//import { FaqItem } from "@/components/faq-item" // Import FaqItem component

import { Button } from "@/components/ui/button"
import { HeroDemo } from "@/components/hero-demo"
import { FeatureCard } from "@/components/feature-card"
import { DemoTabs } from "@/components/demo-tabs"
import Footer from "@/components/footer"
import { ProblemSolutionSection } from "@/components/problem-solution-section"
import { JourneyTimeline } from "@/components/journey-timeline"
//import { TestimonialsCarousel } from "@/components/testimonial-carousel"
//import { LogosBar } from "@/components/logos-bar"
import { FeatureShowcase } from "@/components/feature-showcase"
import { FaqItem } from "@/components/faq-item"

// check if access_token is still valid by getting the user
async function getMe(token: string) {
  const me = await fetch("https://api.getlia.live/api/user/me", {
    headers: { Authorization: `Bearer ${token}` },
  })

  return me
}

// refreshToken function
const refreshToken = async () => {
  try {
    const response = await fetch("https://api.getlia.live/api/auth/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // include credentials to allow cookies to be sent
      credentials: "include",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to refresh token")
    }

    // send token to the chrome extension
    if (data.access_token && data.refresh_token) {
      window.postMessage({ type: "SEND_JWTs", access_token: data.access_token, refresh_token: data.refresh_token }, "*") // * means all domains (shoule be restricted to lia extension id)

      // Save tokens to localStorage
      localStorage.setItem("lia_access_token", data.access_token)
    }

    return data.access_token
  } catch (error) {
    console.error("Error refreshing token:", error)
    return null
  }
}

export default function Home() {
  const [user, setUser] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    linkedin_handle: "",
    profile_picture_url: "",
    plan: "",
    plan_started_at: "",
    plan_expires_at: "",
  })

  useEffect(() => {
    // Check if the user is logged in by checking if the access token is in localStorage
    const accessToken = localStorage.getItem("lia_access_token")
    if (accessToken) {
      // If the access token exists, get the user data
      getMe(accessToken).then(async (response) => {
        if (response && response.ok) {
          const data = await response.json()
          setUser(data)
        } else {
          // If the access token is invalid, refresh it
          refreshToken().then((newToken) => {
            if (newToken) {
              getMe(newToken).then(async (userResponse) => {
                if (userResponse && userResponse.ok) {
                  const userData = await userResponse.json()
                  setUser(userData)
                }
              })
            }
          })
        }
      })
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="LIA Logo" width={32} height={32} className="h-8 w-8" />
            <span className="text-xl font-bold text-primary">LIA</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#demo" className="text-sm font-medium transition-colors hover:text-primary">
              Demo
            </Link>
            <Link href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
              FAQ
            </Link>
            <Link href="/installation" className="text-sm font-medium transition-colors hover:text-primary">
              Installation
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              {user && user.id ? <Link href="/dashboard">Dashboard</Link> : <Link href="/signup">Get Started</Link>}
            </Button>
            <Button asChild size="sm" className="hidden sm:flex">
              <Link href="https://chromewebstore.google.com/detail/heoeljdamfonjeellpecmbdboabniimp" target="_blank">
                Download
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 space-y-8 md:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h1 className="font-heading text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
              Enhance Your <span className="text-primary">LinkedIn</span> Presence with AI
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Create engaging posts, craft thoughtful replies, and improve your content with the power of artificial
              intelligence.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="https://chromewebstore.google.com/detail/heoeljdamfonjeellpecmbdboabniimp" target="_blank">
                  Download Extension
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#demo">
                  See Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <HeroDemo />
        </section>

        {/* Features Section */}
        <section id="features" className="container py-20 space-y-16">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Powerful AI Features</h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              LIA provides intelligent tools to enhance your LinkedIn experience and boost your professional presence.
            </p>
          </div>

          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:max-w-none lg:grid-cols-3">
            <FeatureCard
              icon="post"
              title="Post Creation Assistant"
              description="Generate professional, engaging LinkedIn posts with just a click. Brainstorm ideas with LIA Chat, give it a rough idea and get feedback or a well written post in your own authentic voice"
            />
            <FeatureCard
              icon="comment"
              title="Comment Reply Suggestions"
              description="Never struggle with comment replies again. Get AI-powered suggestions that are contextually relevant and maintain your professional voice."
            />
            <FeatureCard
              icon="improve"
              title="Post Improvement Analysis"
              description="Analyze your existing posts and get AI-powered suggestions to improve engagement, clarity, and professional impact."
            />
          </div>
        </section>

        {/* Problem-Solution Section */}
        <ProblemSolutionSection />

        {/* Interactive Feature Showcase Section */}
        <FeatureShowcase />

        {/* Demo Section */}
        <section id="demo" className="bg-slate-50 dark:bg-slate-900 py-20">
          <div className="container space-y-8">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <h2 className="font-heading text-3xl font-bold sm:text-4xl">See LIA in Action</h2>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Experience how LIA seamlessly integrates with LinkedIn to enhance your professional networking.
              </p>
            </div>

            <DemoTabs />
          </div>
        </section>

        {/* Journey Timeline */}
        <JourneyTimeline />

        {/* Testimonials Carousel */}
        {/*<TestimonialsCarousel />

        <motion.section initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} id="testimonials" className="bg-slate-50 dark:bg-slate-900 py-20">
          <div className="container space-y-8">
            <h2 className="text-3xl font-bold text-center">What Professionals Are Saying</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {[
                { quote: "LIA tripled my engagement!", author: "Alice, Designer at SaaSCo", avatar: "/images/male2.jpg" },
                { quote: "Post suggestions save me hours.", author: "Bob, Recruiter at TalentX", avatar: "/images/female4.jpg" },
                { quote: "My content is more professional now.", author: "Charlie, Founder at StartupHub", avatar: "/images/male3.jpg" }
              ].map((t, i) => (
                <div key={i} className="flex flex-col items-center text-center bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                  <Image src={t.avatar} alt={t.author} width={64} height={64} className="rounded-full" />
                  <p className="mt-4 italic">"{t.quote}"</p>
                  <span className="mt-2 text-sm text-muted-foreground">{t.author}</span>
                </div>
              ))}
            </div>
          </div>
              </motion.section>*/}

        {/* Logos Bar */}
        {/*<LogosBar />*/}

        {/* FAQ Section */}
        <section id="faq" className="bg-slate-50 dark:bg-slate-900 py-20">
          <div className="container space-y-8">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <h2 className="font-heading text-3xl font-bold sm:text-4xl">Frequently Asked Questions</h2>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Find answers to common questions about LIA.
              </p>
            </div>

            <div className="mx-auto grid max-w-3xl gap-4">
              <FaqItem
                question="How does the LinkedIn Intelligent Assistant work?"
                answer="LIA is a Chrome extension that integrates with LinkedIn's interface. It uses advanced AI models to generate post suggestions, comment replies, and content improvements based on your preferences and the context of your LinkedIn activity."
              />
              <FaqItem
                question="Is my data secure when using this extension?"
                answer="Yes, your data security is our priority. The extension only processes the content you explicitly choose to enhance. It does not store or transmit any personal data to our servers without your consent. Lia uses enterprise-grade encryption, doesn't store your LinkedIn credentials, and only processes the content you explicitly share with our AI."
              />
              <FaqItem
                question="Does Lia access my LinkedIn account?"
                answer="No, LIA does not require access to your LinkedIn account. It operates entirely within your browser and interacts with LinkedIn's interface to provide suggestions without needing to log in or access your account details. You will need to log on the LIA website to get a token for the extension to work. Other than that, it does not require any permissions to access your LinkedIn account."
              />
              <FaqItem
                question="Will the content generated by the AI sound like me?"
                answer="The AI generates suggestions based on your industry and preferred tone settings. You can always edit the suggestions before posting to ensure they match your personal voice. The more you use the extension, the better you'll get at selecting and customizing suggestions that align with your style."
              />
              <FaqItem
                question="How much does it cost to use LIA?"
                answer="The extension itself is free to use for 1 month. However, for more advance features once your subscription ends, you will need to upgrade to pro. For most users, the cost is minimal (often just a few cents per day with regular usage). Visit the pricing page for more details on pro features."
              />
            </div>
          </div>
            </section>

        {/* CTA Section */}
        <section className="container py-20">
          <div className="mx-auto max-w-3xl rounded-lg bg-primary p-8 text-center text-primary-foreground shadow-lg">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl mb-4">
              Ready to Enhance Your LinkedIn Presence?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/90">
              Download the LIA extension today and start creating more engaging, professional content with the power of
              AI.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="https://chromewebstore.google.com/detail/heoeljdamfonjeellpecmbdboabniimp" target="_blank">
                Download Extension
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { X, Check, MessageSquare, Clock, Zap, Target, TrendingUp, Users } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function ProblemSolutionSection() {
  const [visibleProblems, setVisibleProblems] = useState<number[]>([])
  const [visibleSolutions, setVisibleSolutions] = useState<number[]>([])
  const [showTransition, setShowTransition] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const type = entry.target.getAttribute("data-type")
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")

            if (type === "problem") {
              setVisibleProblems((prev) => [...new Set([...prev, index])])
            } else if (type === "solution") {
              setVisibleSolutions((prev) => [...new Set([...prev, index])])
            }
          }
        })
      },
      { threshold: 0.2 },
    )

    const elements = sectionRef.current?.querySelectorAll("[data-type]")
    elements?.forEach((el) => observer.observe(el))

    const transitionTimer = setTimeout(() => {
      if (visibleProblems.length > 0) {
        setShowTransition(true)
      }
    }, 1500)

    return () => {
      observer.disconnect()
      clearTimeout(transitionTimer)
    }
  }, [visibleProblems])

  const problems = [
    {
      icon: MessageSquare,
      title: "Manual Comment Struggles",
      description: "Spending hours crafting individual responses to LinkedIn comments and posts",
    },
    {
      icon: Clock,
      title: "Writer's Block",
      description: "Staring at blank screens, unable to create engaging professional content",
    },
    {
      icon: TrendingUp,
      title: "Poor Engagement",
      description: "Posts getting minimal likes, comments, and meaningful professional connections",
    },
  ]

  const solutions = [
    {
      icon: Zap,
      title: "AI-Powered Responses",
      description: "Generate contextually relevant comments and replies in seconds with advanced AI",
    },
    {
      icon: Target,
      title: "Content Creation Assistant",
      description: "Break through writer's block with intelligent post suggestions tailored to your industry",
    },
    {
      icon: Users,
      title: "Engagement Optimization",
      description: "Boost your professional presence with content designed to drive meaningful interactions",
    },
  ]

  return (
    <section className="container py-20 space-y-16" ref={sectionRef}>
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl text-balance">Transform Your LinkedIn Experience</h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-pretty">
          See how LIA solves the most common LinkedIn challenges professionals face every day.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start relative">
        <div
          className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block
          transition-all duration-1000 ease-out ${showTransition ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        >
          <div className="bg-accent text-accent-foreground px-4 py-2 rounded-full font-semibold text-sm shadow-lg animate-pulse-slow">
            LIA Transforms →
          </div>
        </div>

        {/* Problems Side */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
              <X className="h-5 w-5 text-destructive" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">LinkedIn Pain Points</h3>
          </div>

          {problems.map((problem, index) => (
            <Card
              key={index}
              data-type="problem"
              data-index={index}
              className={`p-6 border-l-4 border-l-destructive/20 bg-card hover:shadow-md hover:scale-105 hover:-translate-y-1
                transition-all duration-500 ease-out transform
                ${visibleProblems.includes(index) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg bg-destructive/10 transition-all duration-300
                  ${visibleProblems.includes(index) ? "animate-shake-once" : ""}`}
                >
                  <problem.icon className="h-6 w-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2 text-card-foreground">{problem.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Solutions Side */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">LIA Solutions</h3>
          </div>

          {solutions.map((solution, index) => (
            <Card
              key={index}
              data-type="solution"
              data-index={index}
              className={`p-6 border-l-4 border-l-primary bg-card hover:shadow-md hover:scale-105 hover:-translate-y-1
                transition-all duration-500 ease-out transform
                ${visibleSolutions.includes(index) ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 transition-all duration-300
                  ${visibleSolutions.includes(index) ? "animate-bounce-once" : ""}`}
                >
                  <solution.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2 text-card-foreground">{solution.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{solution.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

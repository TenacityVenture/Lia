"use client"

import { Card } from "@/components/ui/card"
import { ArrowRight, Frown, Meh, Smile, TrendingUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function JourneyTimeline() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = Number.parseInt(entry.target.getAttribute("data-step") || "0")
            setVisibleSteps((prev) => [...new Set([...prev, stepIndex])])
          }
        })
      },
      { threshold: 0.3 },
    )

    const stepElements = timelineRef.current?.querySelectorAll("[data-step]")
    stepElements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const timelineSteps = [
    {
      phase: "Before LIA",
      icon: Frown,
      title: "Frustrated Posting",
      description: "Struggling to create engaging content, spending hours on single posts",
      status: "problem",
      color: "text-destructive",
    },
    {
      phase: "Before LIA",
      icon: Meh,
      title: "No Engagement",
      description: "Posts receiving minimal likes and comments, feeling invisible on LinkedIn",
      status: "problem",
      color: "text-destructive",
    },
    {
      phase: "Getting Started",
      icon: ArrowRight,
      title: "Install LIA",
      description: "Download the Chrome extension and sigup for free and complete onboarding",
      status: "action",
      color: "text-accent",
    },
    {
      phase: "With LIA",
      icon: Smile,
      title: "Consistent Engagement",
      description: "Creating compelling content effortlessly with LIA Chat",
      status: "success",
      color: "text-primary",
    },
    {
      phase: "With LIA",
      icon: TrendingUp,
      title: "Professional Growth",
      description: "Building meaningful connections and establishing thought leadership",
      status: "success",
      color: "text-primary",
    },
  ]

  return (
    <section className="bg-muted/30 py-12 md:py-20">
      <div className="container space-y-12 md:space-y-16 px-4">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-balance">
            Your LinkedIn Transformation Journey
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground text-base md:text-xl md:leading-8 text-pretty">
            See how LIA transforms your LinkedIn experience from frustration to professional success.
          </p>
        </div>

        <div className="relative" ref={timelineRef}>
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-border hidden lg:block overflow-hidden">
            <div
              className="w-full bg-primary transition-all duration-1000 ease-out"
              style={{
                height: `${(visibleSteps.length / timelineSteps.length) * 100}%`,
                transformOrigin: "top",
              }}
            />
          </div>

          <div className="space-y-8 md:space-y-12 lg:space-y-16">
            {timelineSteps.map((step, index) => (
              <div
                key={index}
                data-step={index}
                className={`flex items-center gap-4 md:gap-8 
                  ${/* Mobile: all left-aligned */ ""}
                  ${/* Desktop: alternating sides */ index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} 
                  transition-all duration-700 ease-out transform
                  ${visibleSteps.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Content Card */}
                <div className="flex-1 lg:max-w-md">
                  <Card
                    className={`p-4 md:p-6 ${step.status === "problem" ? "border-l-4 border-l-destructive/20" : step.status === "success" ? "border-l-4 border-l-primary" : "border-l-4 border-l-accent"} 
                      hover:shadow-lg hover:scale-105 transition-all duration-300 hover:-translate-y-1
                      ${visibleSteps.includes(index) ? "animate-pulse-once" : ""}`}
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div
                        className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-500 flex-shrink-0
                          ${step.status === "problem" ? "bg-destructive/10 hover:bg-destructive/20" : step.status === "success" ? "bg-primary/10 hover:bg-primary/20" : "bg-accent/10 hover:bg-accent/20"}
                          ${visibleSteps.includes(index) ? "animate-bounce-once" : ""}`}
                      >
                        <step.icon
                          className={`h-5 w-5 md:h-6 md:w-6 ${step.color} transition-transform duration-300 hover:scale-110`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs md:text-sm font-medium text-[#4a4a4a] mb-1">{step.phase}</div>
                        <h3 className="font-semibold text-base md:text-lg mb-2 text-card-foreground leading-tight">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div
                  className={`hidden lg:flex items-center justify-center w-4 h-4 rounded-full border-4 border-background shadow-lg z-10 transition-all duration-500
                  ${visibleSteps.includes(index) ? "bg-primary scale-125 animate-pulse-slow" : "bg-muted scale-100"}`}
                />

                {/* Spacer for alternating layout - desktop only */}
                <div className="flex-1 lg:max-w-md hidden lg:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
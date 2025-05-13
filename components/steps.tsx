"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"

export function Steps() {
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < 4 ? prev + 1 : 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const steps = [
    { id: 1, title: "Install Extension" },
    { id: 2, title: "Get API Key" },
    { id: 3, title: "Configure LIA" },
    { id: 4, title: "Start Using" },
  ]

  return (
    <div className="w-full">
      <div className="flex justify-between">
        {steps.map((step) => (
          <div key={step.id} className="relative flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                step.id < activeStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : step.id === activeStep
                    ? "border-primary text-primary"
                    : "border-muted-foreground/30 text-muted-foreground/50"
              }`}
            >
              {step.id < activeStep ? <Check className="h-5 w-5" /> : <span>{step.id}</span>}
            </div>
            <div className="mt-2 text-center text-sm font-medium">{step.title}</div>
            {step.id < steps.length && (
              <div
                className={`absolute left-[calc(50%+20px)] top-5 h-[2px] w-[calc(100%-40px)] -translate-y-1/2 transition-colors duration-300 ${
                  step.id < activeStep ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                style={{ width: "calc(100vw / 4 - 40px)" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

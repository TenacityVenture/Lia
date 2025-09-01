"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, PenTool, BookOpen, Sparkles, ArrowRight, Play, X, ZoomIn, ZoomOut } from "lucide-react"
import Image from "next/image"

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  const features = [
    {
      id: "ai-comments",
      title: "AI-Powered Comment Suggestions",
      description: "Get contextual, professional comment suggestions that match your voice and industry expertise.",
      icon: MessageSquare,
      image:
        "/images/feature/lia-comment-suggestions-and-tooltip-in-comment.png",
      badge: "Most Popular",
      benefits: ["3x faster engagement", "Professional tone", "Context-aware responses"],
    },
    {
      id: "smart-replies",
      title: "Intelligent Reply Generation",
      description: "Respond to comments and messages with AI-generated replies that maintain authentic conversations.",
      icon: PenTool,
      image:
        "/images/feature/lia-replying-to-comment-suggestions.png",
      badge: "Time Saver",
      benefits: ["Instant responses", "Maintains authenticity", "Builds relationships"],
    },
    {
      id: "content-notes",
      title: "Smart Content Notes",
      description: "Organize ideas, save insights, and reference content seamlessly while browsing LinkedIn.",
      icon: BookOpen,
      image:
        "/images/feature/lia-notes-mode.png",
      badge: "Productivity",
      benefits: ["Never lose ideas", "Organized insights", "Quick reference"],
    },
    {
      id: "ai-rewrite",
      title: "AI Content Enhancement",
      description: "Transform your posts with AI-powered rewriting that improves clarity, engagement, and impact.",
      icon: Sparkles,
      image:
        "/images/feature/lia-ai-rewrite.png",
      badge: "Game Changer",
      benefits: ["Better engagement", "Professional polish", "Thought leadership"],
    },
  ]

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))
  }

  const openModal = () => {
    setIsModalOpen(true)
    setZoomLevel(1)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setZoomLevel(1)
  }

  return (
    <>
      <section className="container py-12 md:py-20 space-y-8 md:space-y-12">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center px-4">
          <Badge variant="secondary" className="mb-2 animate-fade-in">
            Sneak Peek into LIA
          </Badge>
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-balance">
            Experience the power of using LIA Intelligent Features
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground text-base md:text-xl md:leading-8 text-pretty">
            Click on any feature to see LIA in action with real LinkedIn interface screenshots.
          </p>
        </div>

        <div className="lg:hidden space-y-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.id}
                className={`p-4 md:p-6 cursor-pointer transition-all duration-500 hover:shadow-lg border-2 ${
                  activeFeature === index ? "border-primary bg-primary/5 shadow-md" : "hover:border-primary/50"
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="space-y-4">
                  {/* Text/Card Content */}
                  <div className="flex items-start gap-3 md:gap-4">
                    <div
                      className={`p-2 md:p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                        activeFeature === index
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted hover:bg-primary/10"
                      }`}
                    >
                      <Icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="font-semibold text-base md:text-lg leading-tight">{feature.title}</h3>
                        <Badge
                          variant={activeFeature === index ? "default" : "outline"}
                          className="text-xs transition-all duration-300 flex-shrink-0"
                        >
                          {feature.badge}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                      <div className="flex flex-wrap gap-1 md:gap-2 mt-2 md:mt-3">
                        {feature.benefits.map((benefit, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className={`text-xs transition-all duration-300 ${
                              activeFeature === index ? "bg-primary/10" : ""
                            }`}
                          >
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Image on bottom for mobile */}
                  {activeFeature === index && (
                    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-inner">
                      <div className="relative group cursor-pointer" onClick={openModal}>
                        <Image
                          src={feature.image || "/placeholder.svg"}
                          alt={feature.title}
                          width={600}
                          height={400}
                          className="w-full h-auto transition-all duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            View Full Size
                          </Button>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="text-xs bg-white/90 dark:bg-black/90">
                          Click to zoom
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Feature List - Left side */}
          <div className="space-y-3 md:space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={feature.id}
                  className={`p-4 md:p-6 cursor-pointer transition-all duration-500 hover:shadow-lg border-2 ${
                    activeFeature === index
                      ? "border-primary bg-primary/5 shadow-md scale-105"
                      : "hover:border-primary/50 hover:scale-102"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div
                      className={`p-2 md:p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                        activeFeature === index
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted hover:bg-primary/10"
                      }`}
                    >
                      <Icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="font-semibold text-base md:text-lg leading-tight">{feature.title}</h3>
                        <Badge
                          variant={activeFeature === index ? "default" : "outline"}
                          className="text-xs transition-all duration-300 flex-shrink-0"
                        >
                          {feature.badge}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                      <div className="flex flex-wrap gap-1 md:gap-2 mt-2 md:mt-3">
                        {feature.benefits.map((benefit, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className={`text-xs transition-all duration-300 ${
                              activeFeature === index ? "bg-primary/10" : ""
                            }`}
                          >
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {activeFeature === index && (
                      <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-primary animate-pulse flex-shrink-0" />
                    )}
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Image - Right side */}
          <div className="relative">
            <Card className="p-6 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-0 shadow-2xl transition-all">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg">{features[activeFeature].title}</h4>
                  <Badge variant="outline" className="text-xs">
                    Real Extension UI
                  </Badge>
                </div>

                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-inner">
                  <div className="relative group cursor-pointer" onClick={openModal}>
                    <Image
                      src={features[activeFeature].image || "/placeholder.svg"}
                      alt={features[activeFeature].title}
                      width={600}
                      height={400}
                      className="w-full h-auto transition-all duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        View Full Size
                      </Button>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="text-xs bg-white/90 dark:bg-black/90">
                      Click to zoom
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live Demo - {features[activeFeature].badge}
                  </div>
                </div>
              </div>
            </Card>

            <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/20 rounded-full animate-bounce blur-sm"></div>
            <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-accent/30 rounded-full animate-bounce delay-1000 blur-sm"></div>
            <div className="absolute top-1/2 -left-4 w-4 h-4 bg-secondary/40 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-7xl max-h-[90vh] w-full mx-4">
            {/* Modal Header */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-white/90 dark:bg-black/90">
                  {features[activeFeature].title}
                </Badge>
                <div className="flex items-center gap-2 bg-white/90 dark:bg-black/90 rounded-lg px-3 py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.5}
                    className="h-8 w-8 p-0 hover:bg-black/10"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[3rem] text-center">{Math.round(zoomLevel * 100)}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                    className="h-8 w-8 p-0 hover:bg-black/10"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="h-8 w-8 p-0 bg-white/90 dark:bg-black/90 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div
              className="overflow-auto max-h-[90vh] rounded-lg bg-white dark:bg-black"
              style={{
                cursor: zoomLevel < 3 ? "zoom-in" : zoomLevel > 0.5 ? "zoom-out" : "default",
              }}
              onClick={(e) => {
                if (e.detail === 2) {
                  // Double click
                  if (zoomLevel < 3) handleZoomIn()
                  else if (zoomLevel > 0.5) handleZoomOut()
                }
              }}
            >
              <Image
                src={features[activeFeature].image || "/placeholder.svg"}
                alt={features[activeFeature].title}
                width={1200}
                height={800}
                className="w-full h-auto transition-transform duration-300"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center center",
                }}
              />
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <Badge variant="secondary" className="bg-white/90 dark:bg-black/90 text-xs">
                Double-click to zoom • Use zoom controls • ESC to close
              </Badge>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote, Star, Play, Pause } from "lucide-react"
import Image from "next/image"

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const testimonials = [
    {
      quote:
        "LIA has completely transformed how I engage on LinkedIn. The AI suggestions are incredibly relevant to my industry, and I'm seeing 3x more engagement on my posts.",
      author: "Sarah Chen",
      role: "Marketing Director",
      company: "TechFlow Solutions",
      avatar: "/professional-woman-marketing-director.png",
      rating: 5,
      metrics: { engagement: "+300%", time_saved: "5hrs/week" },
    },
    {
      quote:
        "As someone who struggled with writer's block, LIA has been a game-changer. I'm posting consistently and building meaningful professional relationships.",
      author: "Marcus Rodriguez",
      role: "Sales Manager",
      company: "CloudScale Inc",
      avatar: "/professional-man-sales-manager.png",
      rating: 5,
      metrics: { posts: "+150%", connections: "+200%" },
    },
    {
      quote:
        "The comment suggestions are brilliant. I can engage authentically with my network without spending hours crafting responses. My LinkedIn presence has never been stronger.",
      author: "Jennifer Park",
      role: "Product Manager",
      company: "InnovateLabs",
      avatar: "/professional-woman-product-manager.png",
      rating: 5,
      metrics: { response_time: "-80%", authenticity: "100%" },
    },
    {
      quote:
        "LIA's post improvement feature is like having a professional editor. My content is more engaging and I'm establishing myself as a thought leader in my field.",
      author: "David Thompson",
      role: "Startup Founder",
      company: "NextGen Ventures",
      avatar: "/startup-founder.png",
      rating: 5,
      metrics: { thought_leadership: "+250%", content_quality: "A+" },
    },
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(nextTestimonial, 5000)
  }

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    if (isAutoPlaying && !isPaused) {
      startAutoPlay()
    } else {
      stopAutoPlay()
    }
    return () => stopAutoPlay()
  }, [isAutoPlaying, isPaused])

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  return (
    <section className="container py-12 md:py-20 space-y-8 px-4">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-balance">
          What Professionals Are Saying
        </h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground text-base md:text-xl md:leading-8 text-pretty">
          Join thousands of professionals who have transformed their LinkedIn presence with LIA.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div
          className="relative overflow-hidden rounded-2xl"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="flex transition-all duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <Card className="mx-2 md:mx-4 p-6 md:p-10 lg:p-12 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm border-0 shadow-2xl relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-12 -translate-x-12"></div>

                  <div className="relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
                      {/* Quote icon with animation */}
                      <div className="relative">
                        <Quote className="h-12 w-12 md:h-16 md:w-16 text-primary/20" />
                        <div className="absolute inset-0 animate-ping">
                          <Quote className="h-12 w-12 md:h-16 md:w-16 text-primary/10" />
                        </div>
                      </div>

                      {/* Star rating */}
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 md:h-6 md:w-6 fill-amber-400 text-amber-400 animate-pulse"
                            style={{ animationDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </div>

                      {/* Quote text */}
                      <blockquote className="text-lg md:text-xl lg:text-2xl leading-relaxed text-card-foreground max-w-4xl font-medium relative">
                        <span className="text-primary/40 text-4xl md:text-6xl absolute -top-4 -left-2 md:-left-4 font-serif">
                          &quot;
                        </span>
                        <span className="relative z-10">{testimonial.quote}</span>
                        <span className="text-primary/40 text-4xl md:text-6xl absolute -bottom-8 -right-2 md:-right-4 font-serif">
                          &quot;
                        </span>
                      </blockquote>

                      {/* Metrics */}
                      <div className="flex flex-wrap justify-center gap-4 md:gap-6 py-4">
                        {Object.entries(testimonial.metrics).map(([key, value],) => (
                          <div key={key} className="text-center">
                            <div className="text-xl md:text-2xl font-bold text-primary">{value}</div>
                            <div className="text-xs md:text-sm text-muted-foreground capitalize">
                              {key.replace("_", " ")}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Author info */}
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                          <Image
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.author}
                            width={80}
                            height={80}
                            className="relative rounded-full border-4 border-primary/20 shadow-xl w-16 h-16 md:w-20 md:h-20"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-card-foreground text-lg md:text-xl">{testimonial.author}</div>
                          <div className="text-sm md:text-base text-muted-foreground font-medium">
                            {testimonial.role}
                          </div>
                          <div className="text-sm md:text-base text-primary font-semibold">{testimonial.company}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex justify-center items-center gap-4 md:gap-6 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={prevTestimonial}
            className="rounded-full w-12 h-12 md:w-14 md:h-14 p-0 bg-background/90 backdrop-blur-sm border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="rounded-full w-12 h-12 md:w-14 md:h-14 p-0 bg-background/90 backdrop-blur-sm border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 hover:scale-110 shadow-lg"
          >
            {isAutoPlaying ? <Pause className="h-4 w-4 md:h-5 md:w-5" /> : <Play className="h-4 w-4 md:h-5 md:w-5" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={nextTestimonial}
            className="rounded-full w-12 h-12 md:w-14 md:h-14 p-0 bg-background/90 backdrop-blur-sm border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 md:gap-3 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative transition-all duration-500 ${
                index === currentIndex
                  ? "w-8 md:w-12 h-2 md:h-3 bg-primary rounded-full"
                  : "w-2 md:w-3 h-2 md:h-3 bg-border hover:bg-primary/50 rounded-full"
              }`}
            >
              {index === currentIndex && isAutoPlaying && !isPaused && (
                <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

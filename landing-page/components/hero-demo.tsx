"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function HeroDemo() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative mx-auto mt-16 w-full max-w-4xl overflow-hidden rounded-xl border bg-background shadow-xl">
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          linkedin.com
        </div>
        <div className="w-16" />
      </div>
      <div className="relative aspect-video bg-muted p-4">
        <Image
          src="/lia-demo.png"
          alt="LinkedIn Interface"
          fill
          className="object-cover"
        />
        
        <AnimatePresence>
          {isVisible && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="hidden sm:block absolute bottom-8 right-8 max-w-xs rounded-lg bg-white p-4 shadow-lg dark:bg-slate-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-medium">AI Suggestions</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Your post could be improved with more specific details and a question to engage your audience.
              </p>
              <div className="flex justify-end">
                <button className="text-xs font-medium text-primary">
                  Apply Suggestions
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
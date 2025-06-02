"use client"

import type React from "react"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface DashboardActionButtonProps {
  icon: React.ReactNode
  text: string
  href: string
  variants?: any
}

export default function DashboardActionButton({ icon, text, href, variants }: DashboardActionButtonProps) {
  return (
    <motion.div
      variants={variants}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button asChild variant="outline" className="h-auto p-4 justify-start w-full" size="lg">
        <Link href={href}>
          {icon}
          {text}
        </Link>
      </Button>
    </motion.div>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LIA - LinkedIn Intelligent Assistant",
  description:
    "Enhance your LinkedIn presence with AI-powered post creation, comment replies, and content improvements.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "LIA - LinkedIn Intelligent Assistant",
    description:
      "Enhance your LinkedIn presence with AI-powered post creation, comment replies, and content improvements.",
    url: "https://getlia.live",
    siteName: "LIA - LinkedIn Intelligent Assistant",
    images: [
      {
        url: "https://getlia.live/lia-demo.png",
        width: 1200,
        height: 630,
        alt: "LIA - LinkedIn Intelligent Assistant",
      },
    ],
    locale: "en_US",
    type: "website",

  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

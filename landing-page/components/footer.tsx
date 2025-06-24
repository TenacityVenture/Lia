import Image from "next/image";
import Link from "next/link";
import {Github, Linkedin, Twitter } from 'lucide-react'

export default function () {
    return (
        <footer className="border-t bg-slate-50 dark:bg-slate-900">
        <div className="container py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image 
                  src="/logo.svg" 
                  alt="LIA Logo" 
                  width={32} 
                  height={32} 
                  className="h-8 w-8" 
                />
                <span className="text-xl font-bold text-primary">LIA</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enhance your LinkedIn presence with AI-powered post creation, comment replies, and content improvements.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="text-muted-foreground transition-colors hover:text-foreground">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="/installation" className="text-muted-foreground transition-colors hover:text-foreground">
                    Installation Guide
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-muted-foreground transition-colors hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/docs" className="text-muted-foreground transition-colors hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground transition-colors hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-muted-foreground transition-colors hover:text-foreground">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="https://github.com/TenacityVenture/lia" className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2" target='_blank'>
                    <Github className="h-4 w-4" />
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="https://x.com/getliah" className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2" target='_blank'>
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="https://www.linkedin.com/company/getlia" className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2" target='_blank'>
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} LinkedIn Intelligent Assistant. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    )
}
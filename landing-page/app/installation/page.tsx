/* eslint-disable react/no-unescaped-entities */

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Download, Key } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Steps } from '@/components/steps'

export default function InstallationPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold">Installation Guide</h1>
        <p className="text-xl text-muted-foreground">
          Follow these simple steps to install and set up LIA - LinkedIn Intelligent Assistant
        </p>
      </div>

      <Steps />

      <div className="space-y-8 mt-16">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Install the Chrome Extension</CardTitle>
            <CardDescription>
              Add LIA to your Chrome browser from the Chrome Web Store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border">
              <Image 
                src="/installation/chrome-store.jpg" 
                alt="Chrome Web Store" 
                width={800} 
                height={450} 
                className="w-full"
              />
              
            </div>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Visit the <Link href="https://chrome.google.com/webstore" className="text-primary hover:underline" target="_blank">Chrome Web Store</Link></li>
              <li>Search for "LIA - LinkedIn Intelligent Assistant"</li>
              <li>Click the "Add to Chrome" button</li>
              <li>Confirm the installation when prompted</li>
            </ol>
            <Button asChild size="lg" className="w-full sm:w-auto mt-4">
              <Link href="https://chrome.google.com/webstore" target="_blank">
                <Download className="mr-2 h-4 w-4" />
                Download from Chrome Web Store
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Create an account on the LIA website</CardTitle>
            <CardDescription>
              Visit <a href="https://www.getlia.live" className='text-primary hover:underline'>www.getlia.live</a> and register an account on the LIA website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg overflow-hidden border">
              <Image 
                src="/images/openai-apikey-dashboard.png" 
                alt="OpenAI API Dashboard" 
                width={800} 
                height={450} 
                className="w-full"
              />
            </div>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Create an account using <span className='text-primary'>Email and Password</span>, <span className='text-primary'>Google</span> or <span className='text-primary'>LinkedIn</span> </li>
             
              <li>Navigate to dashboard to see your analytics of your usage of the extension</li>
              <li>Navigate also to profile if you want to update your profile information</li>
            </ol>
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-amber-800 dark:text-amber-200 mt-4">
              <p className="text-sm flex items-start">
                <Key className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>Your account is private and safe with us. LIA stores your account on our encrypted servers and never shared.</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Configure LIA</CardTitle>
            <CardDescription>
              Set up your preferences and API key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg overflow-hidden border">
              <Image 
                src="/images/lia-configuration-dashboard.png" 
                alt="LIA Configuration" 
                width={800} 
                height={450} 
                className="w-full"
              />
            </div>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Click the LIA icon in your Chrome toolbar / addon if you're on Edge</li>
              <li>A popup will show where you can configure LIA to you liking</li>
              <li>Select your industry and preferred tone</li>
              <li>Choose which features you want to enable</li>
              <li>Click "Save" to apply your settings</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 4: Start Using LIA on LinkedIn</CardTitle>
            <CardDescription>
              Enhance your LinkedIn experience with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="rounded-lg overflow-hidden border">
                  <Image 
                    src="/images/comment-reply.png" 
                    alt="Comment Reply" 
                    width={250} 
                    height={200} 
                    className="w-full"
                  />
                </div>
                <h3 className="font-medium">Comment Replies</h3>
                <p className="text-sm text-muted-foreground">
                  Use the "AI Reply" button when responding to comments
                </p>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg overflow-hidden border">
                  <Image 
                    src="/images/lia-ai-rewrite.png" 
                    alt="Post Improvement" 
                    width={250} 
                    height={200} 
                    className="w-full"
                  />
                </div>
                <h3 className="font-medium">Post Rewriting</h3>
                <p className="text-sm text-muted-foreground">
                  Click "AI Rewrite" on your existing content inorder for LIA to rewrites it
                </p>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg overflow-hidden border">
                  <Image 
                    src="/images/lia-chatbot.png" 
                    alt="Chatbot Mode" 
                    width={250} 
                    height={200} 
                    className="w-full"
                  />
                </div>
                <h3 className="font-medium">Chatbot Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Ask LIA about anything related to LinkedIn content creation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center space-y-4">
        <h2 className="text-2xl font-bold">Need Help?</h2>
        <p className="text-muted-foreground">
          If you encounter any issues during installation or setup, please visit our support page or contact us directly.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Button asChild variant="outline">
            <Link href="/docs">
              View Documentation
            </Link>
          </Button>
          <Button asChild>
            <Link href="/support">
              Get Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Book,
  Video,
  FileText,
  Zap,
  Download,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Support - Lia AI Assistant",
  description: "Get help with Lia AI Assistant. FAQs, contact support, and comprehensive help resources.",
}

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I install the Lia AI Assistant extension?",
        answer:
          "You can install Lia from the Chrome Web Store by searching for 'Lia AI Assistant' and clicking 'Add to Chrome'. Alternatively, visit our installation page for detailed step-by-step instructions.",
      },
      {
        question: "Do I need to create an account to use Lia?",
        answer:
          "Yes, you'll need to create a free account to access Lia's features. This allows us to personalize your experience and sync your preferences across devices.",
      },
      {
        question: "Is Lia compatible with all browsers?",
        answer:
          "Currently, Lia is available as a Chrome extension. We're working on support for other browsers like Firefox and Safari. Stay tuned for updates!",
      },
    ],
  },
  {
    category: "Features & Usage",
    questions: [
      {
        question: "What can Lia help me with on LinkedIn?",
        answer:
          "Lia can help you create engaging posts, improve comments, generate content ideas, analyze your performance, and provide personalized suggestions to enhance your LinkedIn presence.",
      },
      {
        question: "How does the Reference Mode work?",
        answer:
          "Reference Mode (Pro feature) allows you to hover over LinkedIn posts, comments, or articles and click to capture them for AI analysis. You can then ask contextual questions about the content.",
      },
      {
        question: "Can I customize Lia's writing style?",
        answer:
          "Yes! Lia adapts to your preferred tone and style. You can specify whether you want professional, casual, enthusiastic, or other tones in your requests.",
      },
    ],
  },
  {
    category: "Billing & Subscriptions",
    questions: [
      {
        question: "What's included in the free plan?",
        answer:
          "The free plan includes basic AI assistance for post creation, comment improvement, and limited daily usage. Pro features like Reference Mode and advanced analytics require a subscription.",
      },
      {
        question: "How much does the Pro subscription cost?",
        answer:
          "Our Pro subscription is $9.99/month or $99/year (save 17%). It includes unlimited usage, Reference Mode, advanced analytics, and priority support.",
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer:
          "You can cancel your subscription at any time from your dashboard. You'll continue to have Pro access until the end of your billing period.",
      },
    ],
  },
  {
    category: "Privacy & Security",
    questions: [
      {
        question: "How does Lia protect my data?",
        answer:
          "We take privacy seriously. Lia uses enterprise-grade encryption, doesn't store your LinkedIn credentials, and only processes the content you explicitly share with our AI.",
      },
      {
        question: "Does Lia access my LinkedIn account?",
        answer:
          "No, Lia doesn't access your LinkedIn account directly. It works by analyzing content visible on your screen and providing suggestions through our interface.",
      },
      {
        question: "Where is my data stored?",
        answer:
          "Your data is securely stored on encrypted servers in the US. We comply with GDPR and other privacy regulations. You can request data deletion at any time.",
      },
    ],
  },
  {
    category: "Troubleshooting",
    questions: [
      {
        question: "Lia isn't showing up on LinkedIn. What should I do?",
        answer:
          "First, ensure the extension is enabled in Chrome. Try refreshing the LinkedIn page. If the issue persists, try disabling and re-enabling the extension, or contact our support team.",
      },
      {
        question: "The AI responses seem slow or aren't working.",
        answer:
          "This might be due to high server load or connectivity issues. Try refreshing the page or waiting a few minutes. If problems persist, check our status page or contact support.",
      },
      {
        question: "I'm having trouble logging into my account.",
        answer:
          "Try clearing your browser cache and cookies, then attempt to log in again. If you've forgotten your password, use the 'Forgot Password' link. Contact support if issues continue.",
      },
    ],
  },
]

const supportChannels = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Get instant help from our support team",
    availability: "24/7 for Pro users, Business hours for free users",
    action: "Start Chat",
    primary: true,
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us a detailed message",
    availability: "Response within 24 hours",
    action: "Send Email",
    primary: false,
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our team",
    availability: "Pro users only, Business hours",
    action: "Schedule Call",
    primary: false,
  },
]

const resources = [
  {
    icon: Book,
    title: "Documentation",
    description: "Comprehensive guides and tutorials",
    link: "/documentation",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    link: "#",
  },
  {
    icon: FileText,
    title: "Best Practices",
    description: "Tips for maximizing your LinkedIn presence",
    link: "/blog",
  },
  {
    icon: Download,
    title: "Installation Guide",
    description: "Detailed setup instructions",
    link: "/installation",
  },
]

export default function SupportPage() {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="container max-w-4xl py-12">
        <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8"
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
        </Link>
      </div>
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers to common questions, get in touch with our support team, or explore our comprehensive help
              resources.
            </p>

            {/* Quick Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Input type="text" placeholder="Search for help..." className="pl-10 pr-4 py-3 text-lg" />
                <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Support Channels */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Get Support</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <Card
                key={index}
                className={`text-center ${channel.primary ? "border-2 border-blue-500 shadow-lg" : ""}`}
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      channel.primary ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <channel.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{channel.title}</CardTitle>
                  <CardDescription>{channel.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                    <Clock className="h-4 w-4" />
                    {channel.availability}
                  </div>
                  <Button
                    className={`w-full ${channel.primary ? "" : "variant-outline"}`}
                    variant={channel.primary ? "default" : "outline"}
                  >
                    {channel.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="mb-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Send us a Message</CardTitle>
              <CardDescription className="text-center">
                Can't find what you're looking for? Send us a detailed message and we'll get back to you soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <Input placeholder="Brief description of your issue" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Low - General question</option>
                    <option>Medium - Feature request</option>
                    <option>High - Technical issue</option>
                    <option>Urgent - Service disruption</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <Textarea
                    placeholder="Please provide as much detail as possible about your question or issue..."
                    rows={6}
                  />
                </div>

                <Button className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>

          <Tabs defaultValue="Getting Started" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              {faqs.map((category) => (
                <TabsTrigger key={category.category} value={category.category} className="text-xs lg:text-sm">
                  {category.category}
                </TabsTrigger>
              ))}
            </TabsList>

            {faqs.map((category) => (
              <TabsContent key={category.category} value={category.category}>
                <Card>
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Help Resources */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Help Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <resource.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={resource.link}>Explore</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Status & Updates */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <CardTitle>System Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Assistant</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Analytics Dashboard</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reference Mode</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">User Authentication</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                View Status Page
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-blue-600" />
                <CardTitle>Latest Updates</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-sm">Reference Mode Launch</h4>
                  <p className="text-xs text-gray-600">New Pro feature for content analysis</p>
                  <span className="text-xs text-gray-500">Jan 15, 2024</span>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-sm">Performance Improvements</h4>
                  <p className="text-xs text-gray-600">Faster AI response times</p>
                  <span className="text-xs text-gray-500">Jan 10, 2024</span>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-sm">Analytics Dashboard</h4>
                  <p className="text-xs text-gray-600">Enhanced engagement tracking</p>
                  <span className="text-xs text-gray-500">Jan 5, 2024</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                View All Updates
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Support */}
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">Need Urgent Help?</h3>
            <p className="text-red-700 mb-6">
              If you're experiencing a critical issue that's preventing you from using Lia, our emergency support team
              is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="destructive">
                <Phone className="h-4 w-4 mr-2" />
                Emergency Support
              </Button>
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                Report Critical Bug
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    <Footer />
    </>
  )
}

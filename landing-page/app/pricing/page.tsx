import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckoutButton } from "@/components/billing/checkout-button"
import {
  Check,
  Star,
  Zap,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  Headphones,
  BarChart3,
  MessageSquare,
  FileText,
  CreditCard,
  ArrowLeft
} from "lucide-react"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Pricing - LIA",
  description: "Choose the perfect plan for your LinkedIn success. Simple pricing with powerful AI features.",
}

const plans = [
  {
    name: "Starter",
    price: "$9",
    period: "per month",
    description: "Perfect for professionals getting started with LinkedIn Intelligence Assistant",
    features: [
      "Unlimited use of LIA Chat",
      "Smart comment assistance",
      "Content improvement analysis",
      "Multiple tone options",
      "Email support",
    ],
    planKey: "starter" as const,
    popular: false,
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    name: "Professional",
    price: "$29",
    period: "per month",
    description: "Advanced AI features for serious LinkedIn growth and engagement",
    features: [
      "Everything in Starter",
      "Advanced AI models",
      "Content analytics dashboard",
      "Priority support",
      "Custom tone training",
      "Reference mode"
    ],
    planKey: "professional" as const,
    popular: true,
    icon: Star,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
]

const features = [
  {
    icon: MessageSquare,
    title: "AI Post Generation",
    description: "Create engaging LinkedIn posts with advanced AI assistance via LIAChat",
  },
  {
    icon: FileText,
    title: "Comment Enhancement",
    description: "Craft thoughtful, professional replies that drive engagement",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track performance and optimize your LinkedIn strategy",
    badge: "Pro",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data stays secure with enterprise-grade encryption",
  },
]

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time through your PayPal subscription settings. Changes take effect at your next billing cycle.",
  },
  {
    question: "What's included in the free trial?",
    answer:
      "The 14 days free trial comes with everything in the starter plan. You get full access to all features during the trial period with no restrictions.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact support for a full refund.",
  },
  {
    question: "How does billing work?",
    answer:
      "We don't store your credit card and you're billed monthly through PayPal, our secure payment processor. When your trial or subscription ends, you'll have to manually pay every month to continue using the service.",
  },
  {
    question: "Is PayPal the only payment method?",
    answer:
      "Currently, we use PayPal for secure subscription billing. PayPal accepts credit cards, debit cards, and bank transfers, so you don't need a PayPal account to subscribe.",
  },
]

export default function PricingPage() {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
      <Button asChild variant="ghost" className="mt-10 mx-auto container text-gray-600 hover:text-gray-900">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
              💰 Simple, Transparent Pricing
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your LinkedIn Success Plan</h1>
            <p className="text-xl text-gray-600 mb-8">
              Start with a free trial and upgrade as you grow. All plans include our core AI features to enhance your
              LinkedIn presence.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>Secure payments powered by PayPal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.popular ? "border-2 border-blue-500 shadow-xl scale-105" : "border shadow-lg"} transition-all hover:shadow-xl`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className={`w-16 h-16 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className={`w-8 h-8 ${plan.color}`} />
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <CardDescription className="mt-4 text-base">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <CheckoutButton
                  plan={plan.planKey}
                  className={`w-full`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </CheckoutButton>

                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-900">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* PayPal Trust Badge */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white rounded-lg px-6 py-3 shadow-md border">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Secure Payment</p>
              <p className="text-xs text-gray-600">Powered by PayPal • SSL Encrypted</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to succeed on LinkedIn</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered features help you create better content, engage more effectively, and grow your
              professional network.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    {feature.badge && (
                      <Badge variant="secondary" className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Got questions? We&apos;ve got answers.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-sm text-gray-600">Your data is protected with enterprise-grade security</p>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">99.9% Uptime</h3>
              <p className="text-sm text-gray-600">Reliable service you can count on</p>
            </div>
            <div className="flex flex-col items-center">
              <Headphones className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-sm text-gray-600">Get help from LinkedIn and AI specialists</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to transform your LinkedIn presence?</h2>
            <p className="text-gray-600 mb-6">
              Join thousands of professionals who are already using LIA to create better content and grow their
              networks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CheckoutButton plan="professional" className="px-8">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </CheckoutButton>
              <Button variant="outline" size="lg" asChild>
                <Link href="/demo">Watch Demo</Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">No credit card required • 14-day free trial • Cancel anytime</p>
          </CardContent>
        </Card>
      </div>
    </div>
    <Footer />
    </>
  )
}

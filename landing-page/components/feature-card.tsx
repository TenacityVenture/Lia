import { Calendar, MessageSquare, FileText } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  icon: "post" | "comment" | "improve"
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "post":
        return <FileText className="h-10 w-10 text-primary" />
      case "comment":
        return <MessageSquare className="h-10 w-10 text-primary" />
      case "improve":
        return <Calendar className="h-10 w-10 text-primary" />
      default:
        return null
    }
  }

  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-md">
      <CardHeader>
        <div className="rounded-full w-16 h-16 flex items-center justify-center bg-primary/10 mb-4">{getIcon()}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

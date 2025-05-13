import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { QuoteIcon } from 'lucide-react'

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  avatar: string
}

export function TestimonialCard({ quote, author, role, avatar }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <QuoteIcon className="h-8 w-8 text-primary/20" />
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <p className="text-muted-foreground italic">{quote}</p>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <Image 
              src={avatar || "/placeholder.svg"} 
              alt={author} 
              width={40} 
              height={40} 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{author}</div>
            <div className="text-sm text-muted-foreground">{role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
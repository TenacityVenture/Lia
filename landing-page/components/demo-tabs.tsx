/* eslint-disable react/no-unescaped-entities */
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export function DemoTabs() {
  const videos = {
    "post-creation": "https://www.youtube.com/embed/nn2Sk2zneyQ", // using lia chat to create viral post
    "comment-reply": "https://www.youtube.com/embed/9E9fW3upVX4", // generating contextual comment
    "post-improvement": "https://www.youtube.com/embed/BsgN8WMS0yc", // rewrite post with lia
    "reference-mode": "https://www.youtube.com/embed/DsHjotoLp9A", // reference mode
  }

  return (
    <Tabs defaultValue="post-creation" className="w-full max-w-5xl mx-auto">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 rounded-2xl bg-muted/40 p-1">
        <TabsTrigger value="post-creation" className="rounded-xl">
          Post Creation
        </TabsTrigger>
        <TabsTrigger value="comment-reply" className="rounded-xl">
          Comment Reply
        </TabsTrigger>
        <TabsTrigger value="post-improvement" className="rounded-xl">
          Post Improvement
        </TabsTrigger>
        <TabsTrigger value="reference-mode" className="rounded-xl">
          Reference Mode
        </TabsTrigger>
      </TabsList>

      {Object.entries(videos).map(([key, url]) => (
        <TabsContent key={key} value={key}>
          <Card className="mt-10 sm:mt-5 p-4 sm:p-6 min-h-[300px] md:min-h-[450px] flex flex-col items-center justify-center rounded-2xl shadow-lg bg-background">
            <div className="relative w-full aspect-video max-w-4xl rounded-xl overflow-hidden shadow-md">
              <iframe
                width="100%"
                height="100%"
                src={`${url}?rel=0&modestbranding=1`}
                title={`${key} demo`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-xl"
              ></iframe>
            </div>
            <div className="mt-4 flex items-center gap-2 text-muted-foreground text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              Watch how LIA enhances your {key.replace("-", " ")}.
            </div>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}

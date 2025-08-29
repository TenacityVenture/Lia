/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function DemoTabs() {
  const [showSuggestions, setShowSuggestions] = useState({
    postCreation: false,
    commentReply: false,
    postImprovement: false,
  })
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleSuggestions = (tab: keyof typeof showSuggestions) => {
    setShowSuggestions((prev) => ({
      ...prev,
      [tab]: !prev[tab],
    }))
  }

  return (
    <Tabs defaultValue="post-creation" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 h-20 sm:h-auto">
        <TabsTrigger value="post-creation">Post Creation</TabsTrigger>
        <TabsTrigger value="comment-reply">Comment Reply</TabsTrigger>
        <TabsTrigger value="post-improvement" className="col-span-2 sm:col-span-1">Post Improvement</TabsTrigger>
      </TabsList>

      <TabsContent value="post-creation">
        <Card className="p-6 relative min-h-[350] md:min-h-[450px] overflow-hidden">
          {/*<div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/images/female1.jpg"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium">Sarah Johnson</div>
                <div className="text-sm text-muted-foreground">Marketing Director at TechCorp</div>
                <div className="mt-3">
                  <p className="text-sm mb-2">Working on a new marketing strategy for Q3...</p>
                  <textarea
                    placeholder="What do you want to talk about?"
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  ></textarea>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 flex items-center gap-1"
                  onClick={() => toggleSuggestions("postCreation")}
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Assist
                </Button>

                {showSuggestions.postCreation && (
                  <div className="mt-4 rounded-md border bg-muted/50 p-4">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                      AI Post Suggestions
                    </h3>
                    <div className="space-y-3">
                      <div className="rounded-md bg-background p-3 text-sm cursor-pointer hover:bg-primary/5">
                        Excited to share that we're developing our Q3 marketing strategy at TechCorp! 🚀 We're focusing
                        on data-driven approaches to better understand customer needs and deliver more personalized
                        experiences. What marketing trends are you incorporating into your Q3 planning?
                        #MarketingStrategy #DataDrivenMarketing #Q3Planning
                      </div>
                      <div className="rounded-md bg-background p-3 text-sm cursor-pointer hover:bg-primary/5">
                        Q3 planning is in full swing at TechCorp! 📊 Our marketing team is exploring innovative ways to
                        blend traditional and digital channels for maximum impact. I'd love to hear what's working for
                        other marketing professionals - drop your insights below! #MarketingInnovation #Q3Strategy
                        #DigitalMarketing
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <Button variant="ghost" size="sm">
                        Dismiss
                      </Button>
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>*/}
          <div className="absolute inset-0 z-0 h-full w-full`">
            <video
              ref={videoRef}
              className="h-full w-full object-cover object-right"
              poster="/images/poster/using-lia-chatbot.jpg"
              loop
              playsInline
              autoPlay
              controls
            >
              <source src="/videos/using-lia-chatbot.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Overlay */}
            <div className="absolute inset-0 from-blue-600 to-blue-700 mix-blend-overlay"></div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="comment-reply">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/images/male1.jpg"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium">Michael Chen</div>
                <div className="text-sm text-muted-foreground">Software Engineer at DevTech</div>
                <div className="mt-2">
                  <p className="text-sm">
                    Just published my article on microservices architecture patterns. Check it out and let me know your
                    thoughts!
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-start gap-2 mb-4">
                    <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src="/images/female2.jpg"
                        alt="Commenter Avatar"
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Emily Rodriguez</div>
                      <p className="text-sm">
                        Great article! I'm curious about how you handle service discovery in your microservices
                        architecture?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src="/images/female1.jpg"
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <textarea
                        placeholder="Write a reply..."
                        rows={2}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      ></textarea>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 flex items-center gap-1"
                        onClick={() => toggleSuggestions("commentReply")}
                      >
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI Reply
                      </Button>

                      {showSuggestions.commentReply && (
                        <div className="mt-4 rounded-md border bg-muted/50 p-4">
                          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <Sparkles className="h-4 w-4 text-primary" />
                            AI Reply Suggestions
                          </h3>
                          <div className="space-y-3">
                            <div className="rounded-md bg-background p-3 text-sm cursor-pointer hover:bg-primary/5">
                              Thanks for the question, Emily! For service discovery, we're using a combination of Consul
                              for registry and health monitoring, along with client-side load balancing. This has worked
                              well for our scale, though we're also exploring service mesh solutions like Istio for more
                              complex scenarios. Have you implemented service discovery in your architecture?
                            </div>
                            <div className="rounded-md bg-background p-3 text-sm cursor-pointer hover:bg-primary/5">
                              Great question, Emily! We've implemented a centralized service registry with Consul that
                              handles both discovery and health checks. Each service registers itself on startup and
                              deregisters on shutdown. For larger clusters, we've found this approach scales better than
                              hardcoded configurations. What approach are you currently using?
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 mt-3">
                            <Button variant="ghost" size="sm">
                              Dismiss
                            </Button>
                            <Button variant="outline" size="sm">
                              Regenerate
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="post-improvement">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/images/female1.jpg"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium">Sarah Johnson</div>
                <div className="text-sm text-muted-foreground">Marketing Director at TechCorp</div>
                <div className="mt-2">
                  <p className="text-sm">
                    Just finished our quarterly marketing meeting. We discussed a lot of strategies for the upcoming
                    quarter. Looking forward to implementing them.
                  </p>
                </div>

                <div className="flex items-center justify-end mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-primary"
                    onClick={() => toggleSuggestions("postImprovement")}
                  >
                    <Sparkles className="h-4 w-4" />
                    Improve Post
                  </Button>
                </div>

                {showSuggestions.postImprovement && (
                  <div className="mt-4 rounded-md border bg-muted/50 p-4">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Post Improvement Suggestions
                    </h3>
                    <div className="space-y-3">
                      <div className="rounded-md bg-background p-3 text-sm">
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>
                            <strong>Add specificity:</strong> Share 1-2 key strategies discussed in the meeting to
                            provide value to your network.
                          </li>
                          <li>
                            <strong>Include a question:</strong> End with a question to encourage engagement, such as
                            "What marketing strategies are you focusing on this quarter?"
                          </li>
                          <li>
                            <strong>Add relevant hashtags:</strong> Include industry-specific hashtags like
                            #MarketingStrategy #Q3Planning #DigitalMarketing
                          </li>
                          <li>
                            <strong>Incorporate a call to action:</strong> Invite connections to share their thoughts or
                            reach out if they want to discuss similar initiatives.
                          </li>
                          <li>
                            <strong>Add visual elements:</strong> Consider adding a relevant image or infographic to
                            increase engagement.
                          </li>
                        </ol>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <Button variant="ghost" size="sm">
                        Dismiss
                      </Button>
                      <Button variant="outline" size="sm">
                        Apply All
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

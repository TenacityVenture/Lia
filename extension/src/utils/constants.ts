// Shared constants extracted from content.tsx

export interface Persona {
  name: string;
  description: string;
  icon: string;
  prompt: string;
}

export interface Template {
  name: string;
  description: string;
  icon: string;
  example: {
    author: string;
    content: string;
    engagement: { likes: string; comments: string };
  };
  prompt: string;
}

export const PERSONAS: Record<string, Persona> = {
  professional: {
    name: "Professional",
    description: "Formal, industry-focused responses",
    icon: "💼",
    prompt: "Respond in a professional, formal tone suitable for business networking",
  },
  conversational: {
    name: "Conversational",
    description: "Friendly, approachable tone",
    icon: "💬",
    prompt: "Respond in a friendly, conversational tone that builds rapport",
  },
  thoughtLeader: {
    name: "Thought Leader",
    description: "Insightful, question-provoking responses",
    icon: "🧠",
    prompt: "Respond as a thought leader with insightful, authoritative, strategic perspectives",
  },
  supportive: {
    name: "Supportive",
    description: "Encouraging, positive reinforcement",
    icon: "🤝",
    prompt: "Respond with encouragement and positive reinforcement",
  },
  analytical: {
    name: "Analytical",
    description: "Data-driven, logical responses",
    icon: "📊",
    prompt: "Respond with analytical, data-driven insights and logical reasoning",
  },
  networking: {
    name: "Networking",
    description: "Connection-building, relationship-focused",
    icon: "🌐",
    prompt: "Respond with a focus on building connections and relationships",
  },
  conciseExpert: {
    name: "Concise Expert",
    description: "Short, direct, minimal words but maximum insight",
    icon: "🎯",
    prompt: "Respond as a concise expert: use minimal words, be direct, and deliver maximum insight in each reply",
  },
};

export const TEMPLATES: Record<string, Template> = {
  microContent: {
    name: "Micro-Content",
    description: "Very short sentences. Each on new line. Maximum impact.",
    icon: "⚡",
    example: {
      author: "Sarah Chen",
      content:
        "Just shipped our biggest feature yet.\n\n6 months of work.\n\n3 failed attempts.\n\n1 breakthrough moment.\n\nSometimes persistence is everything.\n\nWhat's your biggest win this quarter?",
      engagement: { likes: "847", comments: "23" },
    },
    prompt: "Write in micro-content style with very short sentences, each on a new line for maximum impact",
  },
  storyArc: {
    name: "Story Arc",
    description: "Hook → Context → Challenge → Resolution → Lesson",
    icon: "📖",
    example: {
      author: "Marcus Rodriguez",
      content:
        "I almost quit my job last month.\n\nAfter 3 years at the company, I felt stuck. No growth, same tasks, same meetings. The Sunday scaries were real.\n\nThen my manager pulled me aside: \"We're launching a new division. Want to lead it?\"\n\nSometimes the breakthrough comes right when you're about to give up.\n\nLesson: Have the difficult conversations before making big decisions.",
      engagement: { likes: "1.2K", comments: "67" },
    },
    prompt: "Structure your post as a story with a clear hook, context, challenge, resolution, and lesson learned",
  },
  listFormat: {
    name: "List Format",
    description: "Numbered insights, bullet points, structured takeaways",
    icon: "📝",
    example: {
      author: "Jennifer Park",
      content:
        "5 things I learned building a remote team:\n\n1. Overcommunicate everything\n2. Document decisions in writing\n3. Create virtual water cooler moments\n4. Respect time zones religiously\n5. Invest in good tools\n\nRemote work isn't just office work from home.\n\nIt's a completely different operating system.\n\nWhat would you add to this list?",
      engagement: { likes: "923", comments: "45" },
    },
    prompt: "Structure your content as a numbered list or bullet points with clear takeaways",
  },
  questionDriven: {
    name: "Question-Driven",
    description: "Starts with provocative question, builds to answer",
    icon: "❓",
    example: {
      author: "David Kim",
      content:
        "What if I told you the best networking happens when you're not trying to network?\n\nLast week at a coffee shop, I helped someone with their laptop. No business cards exchanged. No LinkedIn requests.\n\nJust one human helping another.\n\n3 days later, they introduced me to their CEO.\n\nAuthentic relationships > transactional connections.\n\nWhen did you last help someone without expecting anything back?",
      engagement: { likes: "1.5K", comments: "89" },
    },
    prompt: "Start with a provocative question and build your narrative around answering it",
  },
  vulnerableLeader: {
    name: "Vulnerable Leader",
    description: "Shares failures/struggles, shows humanity",
    icon: "💝",
    example: {
      author: "Rachel Thompson",
      content:
        "I made a $50K mistake last quarter.\n\nApproved a campaign without proper testing. It flopped spectacularly.\n\nMy first instinct? Hide it. Blame external factors. Make excuses.\n\nInstead, I called an all-hands meeting and owned it completely.\n\nThe team's response surprised me. They shared their own mistakes. We problem-solved together.\n\nVulnerability isn't weakness in leadership.\n\nIt's the foundation of trust.",
      engagement: { likes: "2.1K", comments: "134" },
    },
    prompt: "Share a personal failure or struggle that led to growth, showing vulnerability and humanity",
  },
  contrarian: {
    name: "Contrarian Take",
    description: "Challenges common beliefs, 'unpopular opinion' posts",
    icon: "🔥",
    example: {
      author: "Alex Morgan",
      content:
        "Unpopular opinion: Most networking events are a waste of time.\n\nHere's why:\n\n→ Surface-level conversations\n→ Everyone's in 'pitch mode'\n→ No real connection happens\n→ Follow-ups feel forced\n\nBetter alternatives:\n\n→ Industry workshops\n→ Volunteer opportunities  \n→ Online communities\n→ One-on-one coffee chats\n\nStop collecting business cards.\n\nStart building real relationships.\n\nAgree or disagree?",
      engagement: { likes: "856", comments: "92" },
    },
    prompt: "Present a contrarian viewpoint that challenges conventional wisdom in your industry",
  },
};

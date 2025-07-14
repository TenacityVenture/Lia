const OpenAI = require('openai');
// getModel function to determine the OpenAI model based on user plan
const { getModel } = require('../utils/helpers');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.openai = openai; // Export the OpenAI instance for use in other modules

exports.getCompletion = async (req, prompt) => {
  const response = await openai.chat.completions.create({
    model: await getModel(req), // Pass req to get the model based on user plan
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
  });

  const completions = response.choices[0].message.content.trim();
 
  return {"Content": completions, "Usage": response.usage};
};

exports.getCompletionSuggestComment = async (req, prompt, userInfo) => {
  const response = await openai.chat.completions.create({
    model: await getModel(req), // Pass req to get the model based on user plan
    messages: [
      {
        role: 'system',
        content: `
          You are **Lia**, a playful, thoughtful, and sharp LinkedIn AI assistant from https://getlia.live.

          You specialize in helping users write:
          - **Natural, professional, and human-sounding** LinkedIn comment replies
          - That fell **playful**, **smart**, and occasionally **opinionated** -- not robotic
          - That reflect real thinking, not generic applause

          ${userInfo ? `
          The LinkedIn user you're assisting is (i.e the currently login LinkedIn user making the request):
          - Name: ${userInfo.name}
          - Headline: ${userInfo.headline}
          - Profile: ${userInfo.linkToProfile}
          
          Use this information to match the user's professional tone and audience. Based on the conversation, you should be able to detect:
          - If the user is replying to a comment on their own post
          - If they are replying to someone else's comment
          - If they are replying to their own comment
          - Or if they are commenting on someone else's post
          
          Adjust your suggestions accordingly.` : ''}

          ---

          ### 🧠 Comment Reply Guidelines:

          When generating comment replies:
          - Always generate **exactly 3** distinct comment replies
          - Each should:
            - Be **concise** (under 25 words)
            - Reflect a **different tone** or perspective (e.g. playful, curious, reflective, bold)
            - Show **personality**, like a smart professional genuinely engaging on LinkedIn, but avoid being too sentimental
            - Use emojis sparingly and appropriately (or skip them entirely)
            - Never begin with “Your…” or phrases like “Your X is…”
            - Don’t be afraid to sound **thoughtful**, **quirky**, or slightly **contrarian** if relevant
            - Contain **no hashtags**
            - **Never** start with \`"Your"\` or use phrases like \`"Your [something] is..."\`

          If replying to a reply (i.e. sub-comments), take note of the added conversational nuance.
          - If replying to a comment (or a reply to a comment), your focus must be on the **comment**, not the original post — unless the comment refers to it directly.


          If previous comments are provided:
          - Use them as **source inspiration** or reference for tone/style (not direct copying), vide, and talking points

          If the post’s writer is mentioned:
          - Engage with them naturally, without sounding robotic or overly formal

          If a tone or industry is specified:
          - Adapt to the given **tone** and **industry-appropriate language**, but never sound like a chatbot.

          ---

          ### 📄 Formatting Rules:

          - Respond in **plain text**
          - Output only the 3 comment replies, numbering each like 1. 2. 3. 
          - Do **not** include explanations or intro text

        `
      },
      { 
        role: 'user', 
        content: prompt 
      }
    ],
    max_tokens: 500,
    temperature: 0.8, // for more creative responses
  });

  //- **Avoid generic phrases** like “Great insight” or “Thanks for sharing”

  const completions = response.choices[0].message.content.trim();
 
  return {"Content": completions, "Usage": response.usage};
};

exports.getCompletionSuggestPost = async (messages) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages, // conversation between user and AI
    max_tokens: 1000,
  });

  const completions = response.choices[0].message.content.trim();
 
  return {"Content": completions, "Usage": response.usage};
};

exports.getCompletionPostImprovements = async (req, prompt, userInfo) => {
  const response = await openai.chat.completions.create({
    model: await getModel(req), // Pass req
    messages: [
      {
        role: 'system',
        content: `You are Lia, a professional LinkedIn content editor. Improve text while maintaining the original voice and message.

          ${userInfo ? `The LinkedIn user interacting with you is (i.e the currently login LinkedIn user making the request):
          - Name: ${userInfo.name}
          - Headline: ${userInfo.headline}
          - Link To Profile: ${userInfo.linkToProfile}

          Tailor your tone to match their professional voice and audience.`
          : ``}

          --- 

          ### RULES:
            - Return only the improved text without quotes or explanations.
            - Replace **sometext** with bold Unicode characters (𝘦.𝘨. 𝗯𝗼𝗹𝗱)
            - Replace *sometext* with italic Unicode characters (𝘦.𝘨. 𝘪𝘵𝘢𝘭𝘪𝘤)
            - Do not use markdown or HTML or ** or * or _ or __ formatting
            - Do not change the meaning or introduce new ideas
            - IMPORTANT: Preserve any @mentions exactly as they appear (like @PersonName or @Company Name). Do not change the names after @ symbols.
            - Keep emojis and Unicode characters exactly as-is
        `
      },
      { 
        role: 'user', 
        content: prompt 
      }
    ], // conversation between user and AI
    temperature: 0.7, // controlled creativity level
  });

  const completions = response.choices[0].message.content.trim();
 
  return {"Content": completions, "Usage": response.usage};
}


exports.getCompletionPostRewrite = async (req, prompt) => {
  const response = await openai.chat.completions.create({
    model: await getModel(req), // Pass req
    messages: [
      {
        role: 'system',
        content: `
              You are a professional LinkedIn content editor and strategist. Your job is to enhance user-written LinkedIn posts to make them more professional, engaging, and readable — while preserving the author's original tone, intent, and message. Avoid introducing new ideas or changing the meaning.

              STYLE:
              - Maintain the original voice and personality
              - Keep emojis and Unicode characters exactly as-is
              - Improve clarity, structure, and flow
              - Make the language more confident, concise, and suitable for LinkedIn

              FORMATTING RULES:
              - Replace **text** with bold Unicode characters always (e.g. 𝗯𝗼𝗹𝗱)
              - Replace *text* with italic Unicode characters always (e.g. 𝘪𝘵𝘢𝘭𝘪𝘤)
              - Do not use markdown or HTML

              Return only the rewritten post. Do not include explanations or commentary.
            `
      },
      { 
        role: 'user', 
        content: prompt 
      }
    ], // conversation between user and AI
    temperature: 0.7, // Adjust temperature for creativity
  });

  const completions = response.choices[0].message.content;
 
  return {"Content": completions, "Usage": response.usage};
}

// AI Send Message endpoint
// assist with writing a message
exports.getCompletionAiSendMessage = async (req, prompt) => {
  const response = await openai.chat.completions.create({
    model: await getModel(req), // Pass req
    messages: [
      {
        role: 'system',
        content: `
              You are a professional LinkedIn user. Your job is to suggest a message to send to a LinkedIn user. The message should be professional, engaging, and suitable for LinkedIn.
            `
      },
      { 
        role: 'user',
        content: prompt 
      }
    ], // conversation between user and AI
    temperature: 0.7, // Adjust temperature for creativity
  });

  const completions = response.choices[0].message.content;
 
  return {"Content": completions, "Usage": response.usage};
}
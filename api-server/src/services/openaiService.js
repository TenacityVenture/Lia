const OpenAI = require('openai');
// getModelName function to determine the OpenAI model based on user plan
const { getModelName } = require('../utils/helpers/modelSelector');

// System messages for different AI interactions
const { 
  commentSystemMessage,
  postImprovementSystemMessage,
  postRewriteSystemMessage,
 } = require('../utils/helpers/systemMessages');

require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.openai = openai; // Export the OpenAI instance for use in other modules

exports.getCompletion = async (req, prompt) => {
  const response = await openai.chat.completions.create({
    model: await getModelName(req), // Pass req to get the model based on user plan
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
  });

  const completions = response.choices[0].message.content.trim();
 
  return {"Content": completions, "Usage": response.usage};
};

exports.getCompletionSuggestComment = async (req, prompt, userInfo) => {
  const response = await openai.chat.completions.create({
    model: await getModelName(req), // Pass req to get the model based on user plan
    messages: [
      commentSystemMessage(userInfo),
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
    model: await getModelName(req), // Pass req
    messages: [
      postImprovementSystemMessage(userInfo),
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
    model: await getModelName(req), // Pass req
    messages: [
      postRewriteSystemMessage(),
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
    model: await getModelName(req), // Pass req
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

// AI Enhance Note
exports.getCompletionEnhanceNote = async (req, prompt, content, context) => {
  const response = await openai.chat.completions.create({
    model: await getModelName(req), // Pass req
    messages: [
      {
        role: 'system',
        content: `
              You are a professional LinkedIn user. Your job is to enhance a note based on the provided content and type. The note should be professional, engaging, and suitable for LinkedIn.
            `
      },
      { 
        role: 'user', 
        content: prompt + `\n\nContent: ${content}\nType: ${context.type || 'general'}`
      }
    ], // conversation between user and AI
    temperature: 0.7, // Adjust temperature for creativity
  });
  const completions = response.choices[0].message.content;
 
  return {"Content": completions, "Usage": response.usage};
}
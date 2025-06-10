const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.openai = openai; // Export the OpenAI instance for use in other modules

exports.getCompletion = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
  });

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

exports.getCompletionPostImprovements = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are Lia, a professional LinkedIn content editor. Improve text while maintaining the original voice and message.'
      },
      { 
        role: 'user', 
        content: prompt 
      }
    ], // conversation between user and AI
    temperature: 0.7, // Adjust temperature for creativity
  });

  const completions = response.choices[0].message.content.trim();
 
  return {"Content": completions, "Usage": response.usage};
}


exports.getCompletionPostRewrite = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a professional LinkedIn content editor. You improve posts to be more engaging and professional while maintaining the original voice and message. You keep unicode characters intact.'
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
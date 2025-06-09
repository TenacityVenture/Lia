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

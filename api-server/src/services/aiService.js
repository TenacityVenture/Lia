require('dotenv').config();
const { invokeAI } = require('./invokeAI'); // your abstraction layer

const { 
  commentSystemMessage,
  postImprovementSystemMessage,
  postRewriteSystemMessage,
  postChangeSummarySystemMessage
} = require('../utils/helpers/systemMessages');

// 1. General text completion
exports.getCompletion = async (req, prompt) => {
  try {
    const result = await invokeAI({
      req,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      maxTokens: 500
    });
    return result;
  } catch (err) {
    return fallbackResponse(err);
  }
};

// 2. Suggest 3 smart comments
exports.getCompletionSuggestComment = async (req, prompt, userInfo) => {
  try {
    const result = await invokeAI({
      req,
      messages: [
        commentSystemMessage(userInfo),
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      maxTokens: 500
    });
    return result;
  } catch (err) {
    return fallbackResponse(err);
  }
};

// 3. Generate post from conversation
exports.getCompletionSuggestPost = async (req, messages) => {
  try {
    const result = await invokeAI({
      req,
      messages,
      temperature: 0.7,
      maxTokens: 1000
    });
    return result;
  } catch (err) {
    return fallbackResponse(err);
  }
};

// 4. Post improvement
exports.getCompletionPostImprovements = async (req, prompt, userInfo) => {
  try {
    const result = await invokeAI({
      req,
      messages: [
        postImprovementSystemMessage(userInfo),
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      maxTokens: 1000
    });
    return result;
  } catch (err) {
    return fallbackResponse(err);
  }
};

// 5. Post rewrite
exports.getCompletionPostRewrite = async (req, prompt) => {
  try {
    const result = await invokeAI({
      req,
      messages: [
        postRewriteSystemMessage(),
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      maxTokens: 1000
    });
    return result;
  } catch (err) {
    return fallbackResponse(err);
  }
};

// 6. Check Improvements made
exports.getCompletionCheckImprovements = async (req, prompt) => {
  try {
    const result = await invokeAI({
      req,
      messages: [
        postChangeSummarySystemMessage(),
        { role: 'user', content: `Check the following improvements made to the post:\n\nOriginal Post: ${prompt.originalPost}\n\nImproved Post: ${prompt.improvedPost}` }
      ],
      temperature: 0.7,
      maxTokens: 500
    });
    return result;
  } catch (err) {
    return fallbackResponse(err);
  }
};

// 6. Message composer
exports.getCompletionAiSendMessage = async (req, prompt) => {
  try {
    const result = await invokeAI({
      req,
      messages: [
        {
          role: 'system',
          content: `
            You are a professional LinkedIn user. Your job is to suggest a message to send to another LinkedIn user.
            The message should be professional, friendly, and suitable for a networking platform.
          `
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      maxTokens: 500
    });
    return result;
  } catch (err) {
    return fallbackResponse(err);
  }
};

// 7. Enhance note
exports.getCompletionEnhanceNote = async (req, prompt, content, context) => {
  try {
    const result = await invokeAI({
      req,
      messages: [
        {
          role: 'system',
          content: `
            You are a professional LinkedIn user. Your job is to enhance a note based on the provided content and type.
            The note should be professional, concise, and useful for future reference.
          `
        },
        { 
          role: 'user', 
          content: `${prompt}\n\nContent: ${content}\nType: ${context?.type || 'general'}`
        }
      ],
      temperature: 0.7,
      maxTokens: 500
    });
    return result;
  } catch (err) {
    return fallbackResponse(err);
  }
};

// 🔄 Fallback error handler
function fallbackResponse(err) {
  console.error('AI Service Error:', err);
  return {
    Content: 'Something went wrong. Please try again shortly.',
    Usage: {},
    Error: err.message
  };
}

const aiService = require('../services/aiService');
const usageLogger = require('../services/usageLogger');

exports.rewritePost = async (req, res) => {
  const userId = req.user.sub; // Extract user ID from the request object
  // prompt has been structured in the extension
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // the original text is also passed in the request body
  let { originalText } = req.body;
  if (!originalText) {
    originalText = prompt; // Fallback to prompt if originalText is not provided
  }

  try {
    const {Content: rewritten, Usage: usage} = await aiService.getCompletionPostRewrite(req, prompt);

    // log usage to usage table in supabase
    await usageLogger.log({ 
        userId, 
        type: 'post_rewrite', 
        original_text: originalText, 
        suggested_text: rewritten, 
        token_used: usage.total_tokens || 0 // Fallback to 0 if not available
    })

    // return the AI rewritten post
    res.json({ response: rewritten });
  } catch (error) {
    console.error('Rewrite failed:', error.message);
    res.status(500).json({ error: 'AI rewrite failed' });
  }
};


exports.suggestReply = async (req, res) => {
  const { comment_text } = req.body;
  const userId = req.user.sub;
  let { userInfo } = req.user;

  if (!comment_text) {
    return res.status(400).json({ error: 'Missing comment_text' });
  }

  if (!userInfo) {
    userInfo = {
      linkedin_name: "empty",
      linkedin_headline: "empty",
      linkedin_about: "empty",
      linkedin_profile_url: "empty"
    }
  }

  try {
    //const prompt = `Suggest a professional, thoughtful reply to this LinkedIn comment:\n\n"${comment_text}"`;
    const prompt = comment_text; // the comment text itself is the prompt -- structured in the extension
    const {Content: suggestion, Usage: usage} = (await aiService.getCompletionSuggestComment(req, prompt, userInfo));

    // Log usage
    await usageLogger.log({
      userId,
      type: 'comment_suggestion',
      original_text: comment_text,
      suggested_text: suggestion,
      token_used: usage.total_tokens || 0 // Fallback to 0 if not available
    });

    const suggestions = suggestion
      .split(/\d+\.\s+/) // Split by numbered list (e.g., "1. ", "2. ")
      .filter(s => s.trim()) // Remove empty entries
      .map(s => s.trim());

    // if suggestions are structured as a numbered list, return all suggestions in a list
    res.json({ suggestions });
  } catch (error) {
    console.error('Suggest reply failed:', error.message);
    res.status(500).json({ error: 'AI reply suggestion failed' });
  }
};




// AI Improvement endpoint 
// makes a text better by rewriting it with a more professional tone
// makes text bold
// makes text italic
// makes text shorter
// makes text longer/extend
// add emojis
// fix grammar
// rewrite sentence
exports.aiImprovePost = async (req, res) => {
  const userId = req.user.sub;
  if (!req.body || !req.body.prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  // the prompt has already been structured in the extension
  const { prompt, type } = req.body; // Expecting a string prompt
  let { userInfo } = req.user; 

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid prompt format' });
  }
  if (!type || typeof type !== 'string') {
    return res.status(400).json({ error: 'Invalid type format' });
  }

  if (!userInfo) {
    userInfo = {
      linkedin_name: "empty",
      linkedin_headline: "empty",
      linkedin_about: "empty",
      linkedin_profile_url: "empty"
    }
  }

  console.log('this is the user info', userInfo)

  try {
    // generate the AI response
    const {Content: response, Usage: usage} = await aiService.getCompletionPostImprovements(req, prompt, userInfo);
    if (!response) {
      return res.status(400).json({ error: 'AI response is empty' });
    }

    // log usage
    await usageLogger.log({
      userId,
      type: 'ai_improve_post_' + type, // e.g., ai_improve_post_bold, ai_improve_post_grammar
      original_text: prompt,
      suggested_text: response,
      token_used: usage.total_tokens || 0 // Fallback to 0 if not available
    });

    // return the AI response
    res.status(200).json({ response });
  } catch (error) {
    console.error('AI Improvement failed:', error.message);
    res.status(500).json({ error: 'AI Improvement failed' });
  }
}

exports.aiSendMessage = async (req, res) => {
  const userId = req.user.sub;
  if (!req.body || !req.body.context) {
    return res.status(400).json({ error: 'Context is required' });
  }
  
  // the prompt has already been structured in the extension
  const { context } = req.body; // Expecting a string prompt
  if (!context || context.length === 0 || !context.messages || !Array.isArray(context.messages)) {
    return res.status(400).json({ error: 'Invalid context format' });
  }

  try {
    let prompt = 'Here is a context of a LinkedIn user messaging: || ' + context.messages.map(m => {
      return `${m.time} : ${m.sender} : ${m.message} || `; // Format each message as "role: message"
    }).join('\n'); // Join messages into a single prom

    prompt += `\n Suggest 3 LinkedIn messages to reply to the last message in the conversation.
    The messages should be relevant to the conversation and should not repeat the last message.`
    prompt += `The tone should be ${context.tone || 'professional'}. And industry should be ${context.industry || 'general'}.`
    prompt += `\n\nEach suggestion should be a numbered list, like this:
    1. First suggestion
    2. Second suggestion
    3. Third suggestion
    
    concise, relevant, and professional suggestions are preferred.
    Do not use markdown or HTML formatting, just plain text.
    Do not use any special characters or formatting like **bold** or *italic*.
    Avoid introducing new ideas or being overly creative.
    Do not use emojis or Unicode characters.
    
    ${context.linkedInUser ? `This is the current LinkedIn User info:
      Name: ${context.linkedInUser.name}
      Headline: ${context.linkedInUser.headline}
      Profile URL: ${context.linkedInUser.linkedinUrl}` : ''}`;
  
    // generate the AI response
    const {Content: suggestion, Usage: usage} = await aiService.getCompletionAiSendMessage(req, prompt);
    if (!suggestion) {
      return res.status(400).json({ error: 'AI response is empty' });
    }

    // last message in the context is the one we are replying to
    const lastMessage = context.messages[context.messages.length - 1];
    if (!lastMessage || !lastMessage.message) {
      return res.status(400).json({ error: 'Last message in context is empty' });
    }

    // log usage
    await usageLogger.log({
      userId,
      type: 'send_message',
      original_text: context.messages[context.messages.length - 1]?.message || '', // Log the last message's content
      suggested_text: suggestion,
      token_used: usage.total_tokens || 0 // Fallback to 0 if not available
    });

    const suggestions = suggestion
      .split(/\d+\.\s+/) // Split by numbered list (e.g., "1. ", "2. ")
      .filter(s => s.trim()) // Remove empty entries
      .map(s => s.trim());

    // return the AI response
    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('AI Send Message failed:', error.message);
    res.status(500).json({ error: 'AI Send Message failed' });
  }
}

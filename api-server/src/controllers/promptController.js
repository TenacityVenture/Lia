// src/controllers/promptController.js
const openaiService = require('../services/openaiService');
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
    const {Content: rewritten, Usage: usage} = await openaiService.getCompletionPostRewrite(req, prompt);

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

  if (!comment_text) {
    return res.status(400).json({ error: 'Missing comment_text' });
  }

  try {
    //const prompt = `Suggest a professional, thoughtful reply to this LinkedIn comment:\n\n"${comment_text}"`;
    const prompt = comment_text; // the comment text itself is the prompt -- structured in the extension
    const {Content: suggestion, Usage: usage} = (await openaiService.getCompletion(req, prompt));

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
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid prompt format' });
  }
  if (!type || typeof type !== 'string') {
    return res.status(400).json({ error: 'Invalid type format' });
  }

  try {
    // generate the AI response
    const {Content: response, Usage: usage} = await openaiService.getCompletionPostImprovements(req, prompt);
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
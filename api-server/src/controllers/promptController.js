// src/controllers/promptController.js
const openaiService = require('../services/openaiService');

exports.rewritePost = async (req, res) => {
  const { original_text, tone, length } = req.body;
  const userId = req.user.id;

  if (!original_text || !tone || !length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const prompt = `Rewrite this LinkedIn post in a ${tone} tone and ${length} length:\n\n${original_text}`;
    const suggestion = await openaiService.getCompletion(prompt);

    // log usage to usage table in supabase
    await usageLogger.log({ 
        userId, 
        type: 'post_rewrite', 
        original_text, 
        suggested_text: suggestion 
    })

    res.json({ suggestion });
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
    const prompt = `Suggest a professional, thoughtful reply to this LinkedIn comment:\n\n"${comment_text}"`;
    const suggestion = await openaiService.getCompletion(prompt);

    // Log usage
    await usageLogger.log({
      userId,
      type: 'comment_suggestion',
      original_text: comment_text,
      suggested_text: suggestion
    });

    res.json({ suggestion });
  } catch (error) {
    console.error('Suggest reply failed:', error.message);
    res.status(500).json({ error: 'AI reply suggestion failed' });
  }
};

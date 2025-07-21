const openaiService = require('../services/openaiService');
const usageLogger = require('../services/usageLogger');
const { openai } = require('../services/openaiService');
const { message } = require('./chatController');

// Enhance Note endpoint
exports.enhanceNote = async (req, res) => {
  const userId = req.user.sub;
  if (!req.body || !req.body.content || typeof req.body.content !== 'string') {
    return res.status(400).json({ error: 'Note content is required and should be a text string' });
  } if (!req.body.type || typeof req.body.type !== 'string') {
    return res.status(400).json({ error: 'Type is required and should be a string' });
  } if (!req.body.prompt || typeof req.body.prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and should be a string' });
  } if (!req.body.context || typeof req.body.context !== 'object') {
    return res.status(400).json({ error: 'Context is required and should be an object' });
  }

  // the note has already been structured in the extension
  const { content, type, prompt, context } = req.body;

  try {
    // Call the AI service to enhance the note
    const { Content: enhancedNote, Usage: usage } = await openaiService.getCompletionEnhanceNote(req, content, prompt, context);
    if (!enhancedNote) {
      return res.status(400).json({ error: 'AI response is empty' });
    }

    // Log usage
    await usageLogger.log({
      userId,
      type: 'ai_enhance_note_' + (type == 'tags' ? 'add_tags' : type), // e.g., ai_enhance_note_structure, ai_enhance_note_expand, ai_enhance_note_summarize
      original_text: content,
      suggested_text: enhancedNote,
      token_used: usage.total_tokens || 0 // Fallback to 0 if not available
    });

    return res.status(200).json({ enhancedNote });
  } catch (error) {
    console.error('AI Enhance Note failed:', error.message);
    return res.status(500).json({ error: 'AI Enhance Note failed' });
  }
};

// Generate Title endpoint
exports.generateTitle = async (req, res) => {
    if (!req.body || !req.body.content || typeof req.body.content !== 'string') {
        return res.status(400).json({ error: 'Content is required and should be a text string' });
    }

    let { content } = req.body;
    content = content.length > 1000 ? content.slice(0, 1000) + '...' : content; // Truncate if too long

    const title = await generateNoteTitle(req, res, content);
    if (!title) {
        return res.status(400).json({ error: 'AI response is empty', message: 'Failed to generate title' });
    }

    return res.status(200).json({ title });
}
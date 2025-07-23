const openaiService = require('../services/openaiService');
const usageLogger = require('../services/usageLogger');
const supabase = require('../utils/supabaseClient');
const { generateNoteTitle } = require('../utils/helpers');

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

    let title = await generateNoteTitle(req, content);
    if (!title) {
      return res.status(400).json({ error: 'AI response is empty', message: 'Failed to generate title' });
    }

    return res.status(200).json({ title });
}

exports.saveNotes = async (req, res) => {
  const userId = req.user.sub;
  const { notes } = req.body;

  if (!notes || !Array.isArray(notes) || notes.length === 0) {
    return res.status(400).json({ error: 'Notes are required and should be an array' });
  }

  const notesIds = notes.map(note => note.id).filter(Boolean);

  // Fetch all existing notes for the user
  const { data: existingNotes, error: fetchError } = await supabase
    .from('notes')
    .select('id')
    .eq('user_id', userId);

  if (fetchError) return res.status(500).json({ error: fetchError.message });

  const existingIds = existingNotes.map(note => note.id);
  const toDeleteIds = existingIds.filter(id => !notesIds.includes(id));

  if (notesIds.length === 0) {
    // Delete everything
    await supabase.from('notes').delete().eq('user_id', userId);
    await supabase.from('note_messages').delete().eq('user_id', userId);
    return res.status(200).json({ success: true });
  }

  // Delete removed notes
  if (toDeleteIds.length > 0) {
    const { error: deleteNotesError } = await supabase
      .from('notes')
      .delete()
      .in('id', toDeleteIds);
    if (deleteNotesError) return res.status(500).json({ error: deleteNotesError.message });

    const { error: deleteMessagesError } = await supabase
      .from('note_messages')
      .delete()
      .in('note_id', toDeleteIds);
    if (deleteMessagesError) return res.status(500).json({ error: deleteMessagesError.message });
  }

  // 🔄 Optional: delete all messages for incoming notes in a single batch
  const { error: batchDeleteError } = await supabase
    .from('note_messages')
    .delete()
    .in('note_id', notesIds);
  if (batchDeleteError) return res.status(500).json({ error: batchDeleteError.message });

  for (const note of notes) {
    const {
      id,
      title,
      tags,
      timestamp,
      lastModified,
      context,
      content
    } = note;

    // Upsert the note
    const { error: noteError } = await supabase.from('notes').upsert([{
      id,
      user_id: userId,
      title,
      tags,
      created_at: new Date(timestamp).toISOString(),
      updated_at: new Date(lastModified).toISOString(),
      context
    }]);

    if (noteError) return res.status(500).json({ error: noteError.message });

    const contentBlocks = Array.isArray(content) ? content : [];

    // Build content inserts safely
    const contentInserts = contentBlocks
      .map((block, index) => {
        if (!block || !block.type || !block.contentId) return null;

        const base = {
          note_id: id,
          user_id: userId,
          content_id: block.contentId,
          type: block.type,
          sort_index: index
        };

        if (block.type === 'text') {
          if (!block.text) return null;
          return { ...base, text: block.text };
        }

        if (block.type === 'reference') {
          const ref = block.content;
          if (!ref || !ref.text) return null;

          return {
            ...base,
            ref_author: ref.author,
            ref_text: ref.text,
            ref_url: ref.url,
            ref_timestamp: ref.timestamp,
            ref_likes: ref.engagement?.likes,
            ref_comments: ref.engagement?.comments
          };
        }

        return null;
      })
      .filter(Boolean); // remove any null entries

    if (contentInserts.length > 0) {
      const { error: messageError } = await supabase
        .from('note_messages')
        .insert(contentInserts);

      if (messageError) return res.status(500).json({ error: messageError.message });
    }
  }

  res.status(200).json({ success: true });
};

exports.getNotes = async (req, res) => {
  const userId = req.user.sub;

  // Fetch notes and their messages
  const { data: notes, error: notesError } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)

  if (notesError) return res.status(500).json({ error: notesError.message })

  const noteIds = notes.map(n => n.id)
  const { data: messages, error: messagesError } = await supabase
    .from('note_messages')
    .select('*')
    .in('note_id', noteIds)
    .order('sort_index', { ascending: true })

  if (messagesError) return res.status(500).json({ error: messagesError.message })
  
  // Group messages by note_id
  const grouped = Object.fromEntries(noteIds.map(id => [id, []]))
  for (const msg of messages) {
    if (msg.type === 'text') {
      grouped[msg.note_id].push({
        contentId: msg.content_id,
        type: 'text',
        text: msg.text
      })
    } else if (msg.type === 'reference') {
      grouped[msg.note_id].push({
        contentId: msg.content_id,
        type: 'reference',
        content: {
          author: msg.ref_author,
          text: msg.ref_text,
          url: msg.ref_url,
          timestamp: msg.ref_timestamp,
          engagement: {
            likes: msg.ref_likes,
            comments: msg.ref_comments
          }
        }
      })
    }
  }

  // Reconstruct notes in original client shape
  const formatted = notes.map(note => ({
    id: note.id,
    title: note.title,
    tags: note.tags,
    timestamp: note.timestamp,
    lastModified: note.last_modified,
    context: note.context,
    content: grouped[note.id] ?? []
  }))

  res.json(formatted)
}
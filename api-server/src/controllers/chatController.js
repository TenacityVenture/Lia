const supabase = require('../utils/supabaseClient');
const { openai } = require('../services/openaiService');
const { getModel } = require('../utils/helpers')

/** Create a new chat
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {string} req.body.title - Title of the chat
*/
exports.createChat = async (req, res) => {
  const userId = req.user.sub;
  const { title } = req.body;

  try {
    const { data, error } = await supabase
      .from('chats')
      .insert({ user_id: userId, title: title || 'New Chat' })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // push one message in chat ie the ai message
    await supabase.from('chat_messages').insert([
      { 
        chat_id: data.id, 
        user_id: userId, 
        role: 'assistant', 
        content: "Hi! I'm Lia, your LinkedIn Intelligence Assistant. <br/><br/> I'm here to help you write posts, polish comments, and improve your content. <br/><br/>What can I assist you with today?" 
      }
    ]);

    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating chat:', err);
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

/** Get chat history for a user
* @param {Object} req - Express request object
* @param {Object} res - Express response object
*/
exports.chats = async (req, res) => {
  const userId = req.user.sub;

  try {
    const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

    if (error) {
        return res.status(500).json({ error: error.message });
    };

    res.json(data);
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

/** Get full messages for a specific chat
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {string} req.params.chatId - ID of the chat to fetch messages for
*/
exports.getChatMessages = async (req, res) => {
  const userId = req.user.sub;
  const chatId = req.params.chatId;

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Filter messages to ensure they belong to the user
    const messages = data.filter(message => message.user_id === userId);

    res.json({messages});
  } catch (err) {
    console.error('Error fetching chat messages:', err);
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
};

/** Add a new message to a chat and get AI response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.chatId - ID of the chat to add the message to
 * @param {string} req.body.message - Content of the message
 */
exports.message = async (req, res) => {
  const userId = req.user.sub;
  const chatId = req.params.chatId;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  try {

    // 1. Fetch last N messages for context
    const { data: history } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(10); // Adjust the limit as needed

    const messages = [...(history || [])]
      .map(m => ({ role: m.role, content: m.content }))
      .concat([{ role: 'user', content: message }]);

    // if history is grater than or equal to 2
    // generate a title for the chat based on the first two messages
    // do this only if the chat has at least 2 messages - only once
    if (history.length === 1) {
      const titlePrompt = `Generate a concise title for a LinkedIn chat based on this message: "${message}". Maximum 4 words. Return only the title without any quotes or additional text.`;
      
      const { choices } = await openai.chat.completions.create({
        model: getModel(req),
        messages: [{ role: 'system', content: titlePrompt }],
      });

      const title = choices[0].message.content || 'New Chat';
      
      // Update chat title if it exists
      await supabase
        .from('chats')
        .update({ title })
        .eq('id', chatId)
        .eq('user_id', userId);
    }
      
    // 2. GET AI response
    //first lets insert a key role to start of the messages array
    messages.unshift(
      { role: 'system', 
        content: `You are Lia (https://getlia.live), a helpful LinkedIn AI assistant. You help users create engaging LinkedIn posts, write professional comments, and improve their content. Respond helpfully and professionally. If they\'re asking for LinkedIn content help, provide specific suggestions. If the user is asking about the referenced content, provide specific insights, analysis or help related to the referenced content. If there are asking for enhancing or rewriting post, return only the enhanced or customized post, your focus should be on applying the enhancement or customization to the post. Keep responses concise but helpful. Use emojis sparingly but appropriately.
        
        FORMATTING RULES:
        - Always respond in markdown format
        - Use **bold** for important points
        - Use *italics* for emphasis
        - Use \`code\` for technical terms
        - Use bullet points and lists for clarity
        - Include proper line breaks

        You help users create engaging LinkedIn posts, write professional comments, and improve their content.

        NOTE FOR REFERENCED CONTENT:
        - the user may ask you to:
        - summarize
        - suggest improvements
        - provide insights
        - provide comments suggestions
        - write a post based on the referenced content
        - or just general help with the referenced content, like rewriting or asking for details (like "what is this about?", "what is the main point?", "what are the key takeaways?", etc.)
` 
        // - use \`\`\`code\`\`\` for key contents like summaries, posts content or comments suggestions - include proper line breaks withing the code block
      });
    const openaiRes = await openai.chat.completions.create({
      model: getModel(req),
      messages: messages,
    });

    const aiResponse = openaiRes.choices[0].message.content || 'No response from AI';
    const usage = openaiRes.usage.total_tokens || 0; // Fallback to 0 if not available

    // 3. Save user + assistant messages
    await supabase.from('chat_messages').insert([
      { chat_id: chatId, user_id: userId, role: 'user', content: message },
      { chat_id: chatId, user_id: userId, role: 'assistant', content: aiResponse, tokens: usage }
    ]);

    // 4. Update last used
    await supabase
      .from('chats')
      .update({ updated_at: new Date() })
      .eq('id', chatId);

    // 5. Log usage in usage table
    await supabase.from('usage').insert({
      user_id: userId,
      chat_id: chatId,
      type: 'chat_message',
      token_used: usage
    });

    res.json({ reply: aiResponse });
  } catch (err) {
    console.error('Error adding message:', err);
    res.status(500).json({ error: 'Failed to add message' });
  }
};

/** Delete a chat
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.chatId - ID of the chat to delete
 */
exports.deleteChat = async (req, res) => {
  const userId = req.user.sub;
  const chatId = req.params.chatId;

  try {
    // Check if chat belongs to user
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .eq('user_id', userId)
      .single();

    if (chatError || !chat) {
      return res.status(404).json({ error: 'Chat not found or does not belong to user' });
    }

    // Delete messages first
    //await supabase.from('chat_messages').delete().eq('chat_id', chatId);

    // Then delete the chat itself (cascade delete --> chat_messages will be deleted automatically)
    const { error } = await supabase.from('chats').delete().eq('id', chatId);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Chat deleted successfully' });
  } catch (err) {
    console.error('Error deleting chat:', err);
    res.status(500).json({ error: 'Failed to delete chat' });
  }

}

/** Update chat title
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.chatId - ID of the chat to update
 * @param {string} req.body.title - New title for the chat
 */
exports.updateChatTitle = async (req, res) => {
  const userId = req.user.sub;
  const chatId = req.params.chatId;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const { data, error } = await supabase
      .from('chats')
      .update({ title })
      .eq('id', chatId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Chat not found or does not belong to user' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error updating chat title:', err);
    res.status(500).json({ error: 'Failed to update chat title' });
  }
}

/** Get chat by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.chatId - ID of the chat to fetch
 */
exports.getChatById = async (req, res) => {
  const userId = req.user.sub;
  const chatId = req.params.chatId;

  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Chat not found or does not belong to user' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error fetching chat by ID:', err);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
}

/** update chat last used
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.chatId - ID of the chat to update
 */
exports.updateChatLastUsed = async (req, res) => {
  const userId = req.user.sub;
  const chatId = req.params.chatId;

  try {
    const { error } = await supabase
      .from('chats')
      .update({ updated_at: new Date() })
      .eq('id', chatId)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Chat last used updated successfully' });
  } catch (err) {
    console.error('Error updating chat last used:', err);
    res.status(500).json({ error: 'Failed to update chat last used' });
  }
}
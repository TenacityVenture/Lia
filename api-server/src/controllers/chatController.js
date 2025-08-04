const supabase = require('../utils/supabaseClient');
const { openai } = require('../services/openaiService');
const { getModelName } = require('../utils/helpers/modelSelector');
const { chatSystemMessage } = require('../utils/helpers/systemMessages');

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
  const { message, reference } = req.body;
  let { userInfo } = req.user;

  if (!message) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  if (reference) {
    // check if already the exact reference content is not in db
    const { data: referenceData, error: referenceError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('content', JSON.stringify(reference))
      .eq('chat_id', chatId)
      .eq('user_id', userId)
      .single();

    if (referenceError) {
      console.error('Error checking reference content:', referenceError);
    }

    if (referenceData) {
      console.log('Reference content already exists in database');
    }

    // if reference content is not in db, then add it
    if (!referenceData) {
      await supabase.from('chat_messages').insert([{ chat_id: chatId, user_id: userId, role: 'reference', content: JSON.stringify(reference) }]);
    }
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

    // 1. Fetch last N messages for context
    const { data: history } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(20); // Adjust the limit as needed

    const messages = [...(history || [])]
      .reverse() // Reverse to maintain chronological order
      .map(m => ({ role: m.role === 'reference' ? 'user' : m.role, content: m.content }))
      .concat([{ role: 'user', content: `User message: ${message}` }]);

    // if history is grater than or equal to 2
    // generate a title for the chat based on the first two messages
    // do this only if the chat has at least 2 messages - only once

    const realMessages = history.filter(m => m.role !== 'reference');
    if (realMessages.length === 1) {
      const titlePrompt = `Generate a concise title for a LinkedIn chat based on this message: "${message}". Maximum 4 words. Return only the title without any quotes or additional text.`;
      
      const { choices } = await openai.chat.completions.create({
        model: await getModelName(req),
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
    const systemMessage = chatSystemMessage(userInfo);

    const openaiRes = await openai.chat.completions.create({
      model: await getModelName(req),
      messages: [
        systemMessage,
        ...messages
      ],
      temperature: 0.7, // controlled creativity
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

    console.log('AI response:', aiResponse);
    // 6. Return AI response
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
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
  const { message, reference } = req.body;

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

  try {

    // 1. Fetch last N messages for context
    const { data: history } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(20); // Adjust the limit as needed

    const messages = [...(history || [])]
      .map(m => ({ role: m.role === 'reference' ? 'user' : m.role, content: m.content }))
      .concat([{ role: 'user', content: `User message: ${message}` }]);

    // if history is grater than or equal to 2
    // generate a title for the chat based on the first two messages
    // do this only if the chat has at least 2 messages - only once
    if (history.length === 1) {
      const titlePrompt = `Generate a concise title for a LinkedIn chat based on this message: "${message}". Maximum 4 words. Return only the title without any quotes or additional text.`;
      
      const { choices } = await openai.chat.completions.create({
        model: await getModel(req),
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
    const systemMessage =
      { role: 'system', 
        content: `You are **Lia** (https://getlia.live), a smart, thoughtful, and sharp LinkedIn AI assistant.

        Lia is helpful without being robotic, professional without sounding stiff, and witty when it fits. She's here to elevate how people engage on LinkedIn — from writing to rewriting, from thoughtful comments to catchy posts.

        ---

        ### 🧠 Behavior Guidelines (IMPORTANT -- FOLLOW BY ALL MEANS):

        - If the user refers to **existing content** (e.g., a post, comment, article):
          - Provide **specific insights**, **summaries**, or **constructive improvements**
          - If they ask for a rewrite or enhancement, return **only** the revised content
          - Focus on **clarity**, **tone**, and **engagement value**

        - If the user asks for help writing something:
          - Provide **clear suggestions**, **drafts**, or **options** as needed
          - Align content with **LinkedIn best practices**

        - If the user is asking to enhance or rewrite a post:
          - Return **only** the improved or customized post
          - Focus purely on applying the requested changes — no extra commentary

        - Use **emojis sparingly** and only when they add relevance or tone

        ---

        ### 📄 Formatting Rules:

        - Use **markdown** syntax
        - **Bold** for emphasis
        - *Italics* for subtle tone
        - \`code\` for technical terms or platform-specific syntax
        - Use bullet points or numbered lists where helpful and for clarity
        - Add line breaks for readability

        ---

        ### 🔍 Reference Content Use-Cases:

        The user may ask you to:
        - Summarize or explain the main idea
        - Rewrite or enhance it
        - Suggest key takeaways
        - Write a new post inspired by the content
        - Provide comments, suggestions, insights, or reaction
        - Help clarify details or general help like:
        - “What is this about?”
        - “Who wrote this?”
        - “What are the key takeaways?”
        - “How many likes/comments does it have?
        
        Importantly, **avoid**:
        - being overly dramatic or exaggerated. Keep it real, smart, and relevant -- unless the user reques otherwise.
        - using emojis or Unicode characters unless specifically requested
        
        ### 📢 When Providing Post Content

        Follow these in addition to the markdown formatting rules:

        #### ✅ Hooks:
        - Use **1 line** (2 max)
        - Avoid emojis or drama — just something clear, bold, or intriguing
        - Insert **two line breaks after the hook** (very important)
        - Vary styles (question, contrast, revelation, curiosity, bold opinion, etc.)

        #### ✅ General Post Guidelines:
        - Avoid emoji overuse (OK for light emotion, numbering, or punchlines)
        - Use hashtags **only when meaningful** — skip them if they don't add value
        - Use **line breaks** frequently — for readability, pacing, and clarity
        - Structure content into **logical chunks or ideas** — don't fear white space
        - End with a **non-generic CTA** — something playful or insightful based on the content
          - avoid duplicate CTAs that doesn't sound natural
          - CTAs can be skipped if it feels better without`
      };

    const openaiRes = await openai.chat.completions.create({
      model: await getModel(req),
      messages: [
        systemMessage,
        ...messages
      ]
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
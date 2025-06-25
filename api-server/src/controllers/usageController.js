const supabase = require('../utils/supabaseClient');

exports.getUsageStats = async (req, res) => {
  const userId = req.user.sub;

  try {
    // Fetch usage data from the database
    const { data, error } = await supabase
      .from('usage')
      .select('type, token_used')
      .eq('user_id', userId);

    if (error) throw error;

    // Aggregate usage stats
    const stats = {
      post_rewrites: data.filter(entry => entry.type === 'post_rewrite').length,
      comment_suggestions: data.filter(entry => entry.type === 'comment_suggestion').length,
      post_suggestions: data.filter(entry => entry.type === 'post_suggestion').length,
      ai_improve_posts: data.filter(entry => entry.type && entry.type.startsWith('ai_improve_post')).length,
      total_tokens_used: data.reduce((acc, entry) => acc + (entry.token_used || 0), 0),
      total_usage: data.length,
    };

    res.json(stats);
  } catch (err) {
    console.error('Error fetching usage stats:', err);
    res.status(500).json({ error: 'Failed to fetch usage stats' });
  }
};

exports.getRecentActivity = async (req, res) => {
  const userId = req.user.sub;

  try {
    // Fetch recent activity from the database

    // fetch the last 10 usage entries for the user
    // ordered by created_at in descending order
    const { data, error } = await supabase
      .from('usage')
      .select('type, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(60);

    if (error) throw error;

    // fetch the last 3 chats created by the user
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .select('id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (chatError) throw chatError;

    // Format the activity data
    const activity = data.map(entry => ({
      type: entry.type,
      timestamp: entry.created_at,
    }));

    // Add chat activity if available
    if (chatData && chatData.length > 0) {
      const chatActivity = chatData.map(chat => ({
        type: 'chat_created',
        timestamp: chat.created_at,
        chat_id: chat.id, // Assuming chat.id is available
      }));
      activity.push(...chatActivity);
    }

    res.json(activity);
  } catch (err) {
    console.error('Error fetching recent activity:', err);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
}
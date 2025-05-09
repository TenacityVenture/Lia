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
      reply_suggestions: data.filter(entry => entry.type === 'reply_suggestion').length,
      total_tokens_used: data.reduce((acc, entry) => acc + (entry.token_used || 0), 0),
      total_usage: data.length,
    };

    res.json(stats);
  } catch (err) {
    console.error('Error fetching usage stats:', err);
    res.status(500).json({ error: 'Failed to fetch usage stats' });
  }
};

const supabase = require('../utils/supabaseClient');

exports.getCurrentUser = async (req, res) => {
  const userId = req.user.sub;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, name, username, email, linkedin_handle, profile_picture_url')
    .eq('id', userId)
    .single();


  if (error) return res.status(404).json({ error: 'User not found' });

  res.json(data);
};

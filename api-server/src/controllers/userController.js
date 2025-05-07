const supabase = require('../utils/supabaseClient');

exports.getCurrentUser = async (req, res) => {
  const userId = req.user.sub;

  const { data, error } = await supabase
    .from('users')
    .select('id, name, username, email, linkedin_handle, profile_picture_url')
    .eq('id', userId)
    .single();

  if (error) return res.status(404).json({ error: 'User not found' });

  res.json(data);
};

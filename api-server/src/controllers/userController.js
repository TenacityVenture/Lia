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


exports.updateProfile = async (req, res) => {
  const userId = req.user.sub;
  const { username, linkedin_handle } = req.body;

  const { error } = await supabase
    .from('users')
    .update({ username, linkedin_handle })
    .eq('id', userId);

  if (error) return res.status(400).json({ error: 'Update failed', details: error.message });

  res.json({ message: 'Profile updated successfully.' });
};

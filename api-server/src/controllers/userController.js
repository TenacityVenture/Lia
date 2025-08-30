const supabase = require('../utils/supabaseClient');

exports.getCurrentUser = async (req, res) => {
  const userId = req.user.sub;
  console.log(req.user);

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, name, username, email, profile_picture_url, plan, plan_started_at, plan_expires_at, linkedin_name, linkedin_headline, linkedin_about, linkedin_profile_url, company, job_title')
    .eq('id', userId)
    .single();


  if (error) return res.status(404).json({ error: 'User not found' });

  res.json(data);
};


exports.updateProfile = async (req, res) => {
  const userId = req.user.sub;
  const { username, name, job_title, company } = req.body;
  const { linkedin_name, linkedin_headline, linkedin_about, linkedin_profile_url } = req.body;

  const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_]{3,}$/i;


  // Ensuring the username is not empty
  if (!username || username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  // Making sure users are not passing malicious
  // or broken links
  if (linkedin_profile_url && !linkedinRegex.test(linkedin_profile_url)) {
    return res.status(400).json({ error: 'Invalid LinkedIn URL format' });
  }

  // Two users cannot have the same username
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .neq('id', userId)
    .single();

    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
  }

  const { error } = await supabase
    .from('users')
    .update({ username, name, job_title, company, linkedin_name, linkedin_headline, linkedin_about, linkedin_profile_url })
    .eq('id', userId);

  if (error) return res.status(400).json({ error: 'Update failed', details: error.message });

  res.json({ message: 'Profile updated successfully.' });
};

exports.updateProfileLinkedinInfo = async (req, res) => {
  const userId = req.user.sub;
  const { linkedin_name, linkedin_headline, linkedin_about, linkedin_handle } = req.body;
  
  const linkedin_profile_url = `https://www.linkedin.com/in/${linkedin_handle}`;
  

  const { error } = await supabase
    .from('users')
    .update({ linkedin_name, linkedin_headline, linkedin_about, linkedin_profile_url })
    .eq('id', userId);

  if (error) return res.status(400).json({ error: 'Update failed', details: error.message });

  res.json({ message: 'Profile updated successfully.' });
};

exports.getSubscription = async (req, res) => {
  const userId = req.user.sub;
  
  const { data, error } = await supabase
    .from('users')
    .select('plan, plan_expires_at')
    .eq('id', userId)
    .single();

  if (error) {
    return res.status(400).json({ error: 'Failed to get user plan', details: error.message})
  }

  // Determine if the user should be treated as "pro"
  // - If plan is already "pro" → isPro = true
  // - If plan is "free" but their free trial (plan_expires_at) is still valid → isPro = true
  // - Else → isPro = false

  const now = new Date();
  const isTrialActive = data.plan === 'free' && data.plan_expires_at && new Date(data.plan_expires_at) > now;
  const isPro = data.plan === 'pro' || isTrialActive; 

  res.json({...data, isPro})
}

exports.marketingUnsubscribe = async (req, res) => {
  const uid = req.body?.uid || req.query?.uid;
  if (!uid) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Update user preferences in the database
    const { data, error } = await supabase
      .from('users')
      .update({ marketing_emails: false })
      .eq('id', uid);

    if (error) {
      throw error;
    }

    return res.status(200).json({ message: 'Successfully unsubscribed' });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return res.status(500).json({ error: 'Failed to unsubscribe' });
  }
}

exports.updateCustomizations = async (req, res) => {
  const userId = req.user.sub;
  try {
    const { nickname, occupation, personality, traits, additionalInfo } = req.body

    // Insert or update customization for the user
    const { data, error } = await supabase
      .from("customizations")
      .upsert(
        {
          user_id: userId,
          nickname,
          occupation,
          personality,
          traits,
          additional_info: additionalInfo,
        },
        { onConflict: ["user_id"] } // ensures update if already exists
      )

    if (error) throw error

    res.json({ success: true, customization: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to save customization" })
  }
}
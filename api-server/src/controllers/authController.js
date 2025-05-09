const supabase = require('../utils/supabaseClient');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    // sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    // checks if there was an error during sign in
    if (error) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // Send user and session in response
    res.status(200).json({ user: data.user, session: data.session.access_token });
}

const registerUser = async (req, res) => {
  const { email, password, name, username } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        username
      }
    }
  });

  if (error) return res.status(400).json({ error: 'Registration failed', details: error.message });

  const user = data.user;

  let generatedUsername = null;
  if (name) {
    generatedUsername = username || name.toLowerCase().replace(/\s+/g, '-');
  }

  // Insert into the `users` table to synchronize with auth.users
  await supabase.from('users').upsert({
    id: user.id, // same UUID as auth.users
    email,
    name,
    username: generatedUsername,
    linkedin_handle: null,
    profile_picture_url: null
  }, { onConflict: 'id' });

  // Gets the access_token
  const token = data.session.access_token;
	if (!token) return res.status(401).json({ error: 'Token generation failed' });

  res.json({ token, user });
};

module.exports = {
    loginUser,
    registerUser,
};
const supabase = require('../utils/supabaseClient');

/**
 * Handles logging in a user with their email and password.
 * and returns a JSON response with the user and their session token.
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * 
 * @returns {Promise<void>}
 */
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

    const accessToken = data.session.access_token;
    const refreshToken = data.session.refresh_token;

    // We are storing the refresh token securely in a cookie to 
    // not expose it to the client-side JavaScript. It the safe way for 
    // storing the refresh token.
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // The frontend or extension will store this access token in memory or local storage
    res.status(200).json({ user: data.user, token: accessToken });
}


/**
 * Registers a new user using their email, password, name, and optional username.
 * Handles authentication via Supabase and stores user details in the database.
 * 
 * @param {Object} req - The request object, containing user registration details in req.body.
 * @param {Object} res - The response object used to send the JSON response or error message.
 * 
 * @returns {Promise<void>}
 */
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

  // check the registration provider used
  // const provider = user.provider || 'email';


  // Insert into the `users` table to synchronize with auth.users
  await supabase.from('users').upsert({
    id: user.id, // same UUID as auth.users
    email,
    name,
    username: generatedUsername,
    linkedin_handle: null,
    profile_picture_url: null,
    social_provider: 'email'
  }, { onConflict: 'id' });

  /**
   * Just like loginUser, Supabase gives us both an access_token and refresh_token at registration. 
   * We will treat those exactly the same. What I mean is that we return the access_token to the client, 
   * but keep the refresh_token secure in an httpOnly cookie.”
   */

  const accessToken = data.session.access_token;
  const refreshToken = data.session.refresh_token;

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ error: 'Token generation failed' });
  }

  // We set the refresh token in a secure cookie (just like we did in loginUser)
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  // We return the access token so the frontend can start authenticated requests
  res.status(201).json({ token: accessToken, user });
};


/**
 * Handles refreshing an access token using the refresh token stored in a secure cookie.
 * Used by the client to silently get a new access token when the previous one expires.
 * 
 * @param {Object} req - The request object, containing the secure cookie with the refresh token.
 * @param {Object} res - The response object used to send the JSON response or error message.
 * 
 * @returns {Promise<void>}
 */
const refreshAccessToken = async (req, res) => {
  // Just as we discussed previous standup meeting, we want to keep things secure.
 // The client won't touch the refresh token directly - it's in a cookie.
 // We just want to give them a new access token silently if the old one is expires.

  const refreshToken = req.cookies.refresh_token;

  // If there's no cookie, the client isn't allowed to refresh — simple as that
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token missing' });
  }

  // Asking Supabase to refresh the session using the token from our cookie
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken
  });

  if (error || !data.session) {
    // If Supabase fails, the token is probably expired or revoked
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }

  const newAccessToken = data.session.access_token;
  const newRefreshToken = data.session.refresh_token;

  // We rotate refresh token for extra security
  res.cookie('refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000
  });

  // Give the client a new access token so they can retry failed requests
  res.json({ token: newAccessToken });
};

module.exports = {
    loginUser,
    registerUser,
    refreshAccessToken
};


/**
 * Syncs the OAuth user with the Supabase instance. 
 * Requires 'access_token' in the request body.
 * Returns a JSON response with the user and their session token.
 * 
 * Status Codes:
 *  - 200: Successful sync
 *  - 400: Sync failed
 */
exports.syncOAuthUser = async (req, res) => {
  const supabaseUser = req.user; // this comes from the JWT decoded by our middleware

  // optional: check if already exists
  const { data: existingUser } = await db
    .from('users')
    .select('id')
    .eq('id', supabaseUser.sub)
    .single();

  if (!existingUser) {
    const { email, name, picture } = supabaseUser;
    
    await db.from('users').insert({
      id: supabaseUser.sub,
      email,
      name: name || '',
      username: null,
      linkedin_handle: null,
      profile_picture_url: picture || null,
      social_provider: 'linkedin'
    });
  }

  res.status(200).json({
    message: 'OAuth user synced successfully',
    user: {
      id: supabaseUser.sub,
      email: supabaseUser.email,
      name: supabaseUser.name
    }
  });
};

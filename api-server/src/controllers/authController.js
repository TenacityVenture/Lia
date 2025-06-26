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
      sameSite: 'None', // <== allow cross-site cookie
      domain: '.getlia.live',  // <== apply to all subdomains
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // The frontend or extension will store this access token in memory or local storage
    res.status(200).json({ user: data.user, access_token: accessToken, refresh_token: refreshToken });
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
    sameSite: 'None', // <== allow cross-site cookie
    domain: '.getlia.live',  // <== apply to all subdomains
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  // We return the access token so the frontend can start authenticated requests
  res.status(201).json({ access_token: accessToken, refresh_token: refreshToken, user });
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

  let refreshToken = req.cookies.refresh_token;

  // fallback for extension if the refresh_token is not in cookies
  if (!refreshToken) {
    // If the refresh token is not in cookies, we can check the body for the refresh_token
    const { refresh_token: bodyRefreshToken } = req.body;
    if (bodyRefreshToken) {
      // If we got it from the body, we can use it
      refreshToken = bodyRefreshToken;
    }

  }

  // If there's no cookie, the client isn't allowed to refresh — simple as that
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token missing' });
  }

  // Asking Supabase to refresh the session using the token from our cookie
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken
  });

  if (error || !data.session) {
    // If Supabase fails, the token is probably expired, revoked or has bee used already
    return res.status(error?.status || 403).json({ error: error?.message || 'Invalid or expired refresh token' });
  }

  const newAccessToken = data.session.access_token;
  const newRefreshToken = data.session.refresh_token;

  // We rotate refresh token for extra security
  res.cookie('refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None', // <== allow cross-site cookie
    domain: '.getlia.live',  // <== apply to all subdomains
    maxAge: 24 * 60 * 60 * 1000
  });

  // Give the client a new access token so they can retry failed requests
  res.json({ access_token: newAccessToken, refresh_token: newRefreshToken });
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
const syncOAuthUser = async (req, res) => {
  const supabaseUser = req.user; // this comes from the JWT decoded by our middleware

  // optional: check if already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', supabaseUser.sub)
    .single();

  if (!existingUser) {
    const { email, name, picture } = supabaseUser;
    
    await supabase.from('users').insert({
      id: supabaseUser.sub,
      email,
      name: name || '',
      username: null,
      linkedin_handle: null,
      profile_picture_url: picture || null,
      social_provider: 'linkedin'
    });
  }

  // send refresh token in a secure cookie
  // first we need to get the new refresh token from Supabase
  // this is needed because the user might have logged in with a different provider
  let newRefreshToken = supabase.auth.session()?.refresh_token;
  await supabase.auth.getSession().then(({ data: { session } }) => {
    newRefreshToken = session?.refresh_token;
    if (!session || !session.refresh_token) {
      return res.status(400).json({ error: 'Failed to get session' });
    }
  });

  res.cookie('refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None', // <== allow cross-site cookie
    domain: '.getlia.live',  // <== apply to all subdomains
    maxAge: 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    message: 'OAuth user synced successfully',
    user: {
      id: supabaseUser.sub,
      email: supabaseUser.email,
      name: supabaseUser.name
    }
  });
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
const syncGoogleOAuthUser = async (req, res) => {
  const supabaseUser = req.user; // this comes from the JWT decoded by our middleware

  // optional: check if already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', supabaseUser.sub)
    .single();

  if (!existingUser) {
    const { email, name, picture } = supabaseUser;
    
    await supabase.from('users').insert({
      id: supabaseUser.sub,
      email,
      name: name || '',
      username: null,
      linkedin_handle: null,
      profile_picture_url: picture || null,
      social_provider: 'google'
    });
  }

  // send refresh token in a secure cookie
  // first we need to get the new refresh token from Supabase
  // this is needed because the user might have logged in with a different provider
  let newRefreshToken = supabase.auth.session()?.refresh_token;
  await supabase.auth.getSession().then(({ data: { session } }) => {
    newRefreshToken = session?.refresh_token;
    if (!session || !session.refresh_token) {
      return res.status(400).json({ error: 'Failed to get session' });
    }
  });

  res.cookie('refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None', // <== allow cross-site cookie
    domain: '.getlia.live',  // <== apply to all subdomains
    maxAge: 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    message: 'OAuth user synced successfully',
    user: {
      id: supabaseUser.sub,
      email: supabaseUser.email,
      name: supabaseUser.name
    }
  });
};

/**
 * Logs out the user by clearing the refresh token cookie and
 * revoking the Supabase session.
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  // Clear the refresh_token cookie
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None', // <== allow cross-site cookie
    domain: '.getlia.live',  // <== apply to all subdomains

  });

  // Revoke the session with Supabase. This will revoke the
  // token server-side. It is optional but I think it's a
  // good practice to do so.
  if (refreshToken) {
    await supabase.auth.signOut(); 
  }

  res.status(200).json({ message: 'Successfully logged out' });
};

/**
 * Allows a logged-in user to change their password.
 * Requires Authorization header (access_token).
 *
 * @param {Object} req - Express request (with req.user from middleware)
 * @param {Object} res - Express response
 */
const changePassword = async (req, res) => {
  // I won’t ask for their old password for now — Supabase
  // will validates the current session. After password 
  // change, Supabase will invalidate the refresh token
  // automatically, so we'll log them out.


  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Supabase uses the current session to verify the user identity
  const { error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    return res.status(500).json({ error: 'Failed to update password', details: error.message });
  }

  // Supabase will invalidate the refresh token after password change
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });

  return res.status(200).json({ message: 'Password updated. Please log in again.' });
};


module.exports = {
    loginUser,
    registerUser,
    refreshAccessToken,
    syncOAuthUser,
    syncGoogleOAuthUser,
    logoutUser,
    changePassword,
    syncGoogleOAuthUser
};


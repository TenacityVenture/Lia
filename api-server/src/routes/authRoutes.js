// src/routes/promptRoutes.js
const express = require('express');
const router = express.Router();

const {  
    loginUser, 
    registerUser, 
    refreshAccessToken,
    syncOAuthUser,
    logoutUser,
    changePassword
} = require('../controllers/authController');

const { authenticate } = require('../middlewares/authMiddleware');

// POST /api/auth/sign-in -> login and get access token
router.post('/sign-in', loginUser);

// POST /api/auth/register -> create new user and receive access token
router.post('/register', registerUser);

// POST /api/auth/logout -> logout user and clear refresh token
router.post('/logout', logoutUser);

// POST /api/auth/change-password -> change user password
router.put('/change-password', authenticate, changePassword);

/**
 * Since we are managing authentication server-side, the refresh-token endpoint
 * must be part of the same auth router. This keeps all related logic together.
 * It eliminates duplication, and lets the middleware and error handling stay 
 * clean and organized.
 */

// POST /auth/refresh-token → refresh access token using cookie-based refresh_token
router.post('/refresh-token', refreshAccessToken);

// POST /api/auth/oauth/linkedIn-sync -> sync LinkedIn user
// This endpoint is called by the website after we signed in with LinkedIn
/**
 *  When user clicks "Sign up with LinkedIn" on landing page or extension:
        Supabase handles OAuth

        We get:

        email, name, profile pic, Supabase user ID

    We upsert into users table with:

    name, email, avatar_url

    leave linkedin_handle null

    Extension will later extract the handle and send it via /update-profile

    Then we redirect to the extension or website with the access token.

    Lastly, we sync the user with the LinkedIn profile.
 */
router.get('/oauth/linkedIn-sync', authenticate, syncOAuthUser);


module.exports = router;

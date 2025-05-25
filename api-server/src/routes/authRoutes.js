// src/routes/promptRoutes.js
const express = require('express');
const router = express.Router();

const {  
    loginUser, 
    registerUser, 
    refreshAccessToken,
    syncOAuthUser,
    syncGoogleOAuthUser,
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

// sync auth.users table with our custom users table after user signup with linkedin
router.get('/oauth/linkedIn-sync', authenticate, syncOAuthUser);

// sync auth.users table with our custom users table after user signup with linkedin
router.get('/oauth/google-sync', authenticate, syncGoogleOAuthUser);

module.exports = router;

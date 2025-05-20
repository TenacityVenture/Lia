// src/routes/promptRoutes.js
const express = require('express');
const router = express.Router();

const {  
    loginUser, 
    registerUser, 
    refreshAccessToken,
    syncOAuthUser
} = require('../controllers/authController');

const { authenticate } = require('../middleware/authMiddleware');

// POST /api/auth/sign-in -> login and get access token
router.post('/sign-in', loginUser);

// POST /api/auth/register -> create new user and receive access token
router.post('/register', registerUser);

/**
 * Since we are managing authentication server-side, the refresh-token endpoint
 * must be part of the same auth router. This keeps all related logic together.
 * It eliminates duplication, and lets the middleware and error handling stay 
 * clean and organized.
 */



// POST /auth/refresh-token → refresh access token using cookie-based refresh_token
router.post('/refresh-token', refreshAccessToken);
router.get('/oauth/linkedIn-sync', authenticate, syncOAuthUser);


module.exports = router;

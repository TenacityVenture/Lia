// src/routes/promptRoutes.js
const express = require('express');
const router = express.Router();
const {  loginUser } = require('../controllers/authController');
const { registerUser } = require('../controllers/authController');
const { syncOAuthUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/sign-in', loginUser);

router.post('/register', registerUser);

router.get('/oauth/linkedIn-sync', authenticate, syncOAuthUser);


module.exports = router;

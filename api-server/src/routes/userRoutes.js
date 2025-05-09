const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { getCurrentUser } = require('../controllers/userController');
const { updateProfile } = require('../controllers/userController');

router.get('/me', authenticate, getCurrentUser);

router.put('/update-profile', authenticate, updateProfile);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { getCurrentUser } = require('../controllers/userController');
const { updateProfile } = require('../controllers/userController');
const { getSubscription } = require('../controllers/userController');

router.get('/me', authenticate, getCurrentUser);

router.put('/update-profile', authenticate, updateProfile);

router.get('/subscription', authenticate, getSubscription);

module.exports = router;

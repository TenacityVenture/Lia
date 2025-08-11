const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { 
    getCurrentUser,
    updateProfile,
    updateProfileLinkedinInfo,
    getSubscription 
} = require('../controllers/userController');

router.get('/me', authenticate, getCurrentUser);

router.put('/update-profile', authenticate, updateProfile);

router.put('/update-profile/linkedin-info', authenticate, updateProfileLinkedinInfo);

router.get('/subscription', authenticate, getSubscription);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { 
    getCurrentUser,
    updateProfile,
    updateProfileLinkedinInfo,
    getSubscription,
    marketingUnsubscribe 
} = require('../controllers/userController');
const { listNotifications, markAsRead } = require("../controllers/userController.js");

router.get('/me', authenticate, getCurrentUser);

router.put('/update-profile', authenticate, updateProfile);

router.put('/update-profile/linkedin-info', authenticate, updateProfileLinkedinInfo);

router.get('/subscription', authenticate, getSubscription);

router.get('/notifications', authenticate, listNotifications)

router.post("/:id/read", authenticate, markAsRead);

// Marketing unsubscribe route
// This allows users to opt out of marketing emails
router.put('/unsubscribe', marketingUnsubscribe);


module.exports = router;

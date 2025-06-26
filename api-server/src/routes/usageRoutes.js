const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { getUsageStats } = require('../controllers/usageController');
const { getRecentActivity } = require('../controllers/usageController')

router.get('/stats', authenticate, getUsageStats);
router.get('/activity', authenticate, getRecentActivity)

module.exports = router;

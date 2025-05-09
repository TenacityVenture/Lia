const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { getUsageStats } = require('../controllers/usageController');

router.get('/stats', authenticate, getUsageStats);

module.exports = router;

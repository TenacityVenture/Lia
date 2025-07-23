const express = require('express');
const { authenticate, checkPlan} = require('../middlewares/authMiddleware');
const router = express.Router();
const { generateSpeech } = require('../controllers/ttsController');

router.post('/generate', authenticate, checkPlan("standard"), generateSpeech);

module.exports = router;
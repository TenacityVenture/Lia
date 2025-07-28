const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();
const { generateSpeech } = require('../controllers/ttsController');

router.post('/generate', authenticate, generateSpeech);

module.exports = router;
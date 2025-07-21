const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { checkPlan } = require('../middlewares/authMiddleware');

const { enhanceNote } = require('../controllers/promptController');
router.post('/enhance-note', authenticate, enhanceNote);

const { generateTitle } = require('../controllers/noteController');
router.post('/generate-title', authenticate, generateTitle);

module.exports = router;
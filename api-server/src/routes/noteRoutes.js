const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { checkPlan } = require('../middlewares/authMiddleware');

const { enhanceNote } = require('../controllers/promptController');
router.post('/enhance-note', authenticate, checkPlan('standard'), enhanceNote);

module.exports = router;
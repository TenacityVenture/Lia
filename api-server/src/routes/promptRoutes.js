// src/routes/promptRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { checkPlan } = require('../middlewares/authMiddleware');

const { rewritePost } = require('../controllers/promptController');
const { suggestReply } = require('../controllers/promptController');
const { aiImprovePost } = require('../controllers/promptController');
const { aiSendMessage } = require('../controllers/promptController');

router.post('/rewrite', authenticate, checkPlan('standard'), rewritePost);

router.post('/suggest-reply', authenticate, checkPlan('standard'), suggestReply);

router.post('/improve', authenticate, checkPlan('standard'), aiImprovePost);

router.post('/message', authenticate, checkPlan('standard'), aiSendMessage);

module.exports = router;

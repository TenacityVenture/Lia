// src/routes/promptRoutes.js
const express = require('express');
const router = express.Router();
const { rewritePost } = require('../controllers/promptController');
const { authenticate } = require('../middlewares/authMiddleware');

const { suggestReply } = require('../controllers/promptController');


router.post('/rewrite', authenticate, rewritePost);

router.post('/suggest-reply', authenticate, suggestReply);

module.exports = router;

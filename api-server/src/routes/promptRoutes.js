// src/routes/promptRoutes.js
const express = require('express');
const router = express.Router();
const { rewritePost } = require('../controllers/promptController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/rewrite', authenticate, rewritePost);

module.exports = router;

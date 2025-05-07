const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { getCurrentUser } = require('../controllers/userController');

router.get('/me', authenticate, getCurrentUser);

module.exports = router;

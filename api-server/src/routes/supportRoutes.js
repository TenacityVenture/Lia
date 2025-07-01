const express = require('express');
const dotenv = require('dotenv');
const { authenticate } = require('../middlewares/authMiddleware');
const { 
    sendMessage,
 } = require('../controllers/paypalController');
dotenv.config();

// Initialize the express router
const router = express.Router();

// send message to support
// POST /api/support/message
router.post('/message', authenticate, sendMessage);


module.exports = router;
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');

const { influencerPromotion } = require('../controllers/promotionController');
router.post('/influencer-offer/confirm', authenticate, influencerPromotion);

module.exports = router;

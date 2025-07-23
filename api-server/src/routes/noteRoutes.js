const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');

const { enhanceNote } = require('../controllers/noteController');
router.post('/enhance-note', authenticate, enhanceNote);

const { generateTitle } = require('../controllers/noteController');
router.post('/generate-title', authenticate, generateTitle);

const { saveNotes } = require('../controllers/noteController')
router.post('/notes', authenticate, saveNotes)

const { getNotes } = require('../controllers/noteController');
router.get('/notes', authenticate, getNotes);

module.exports = router;
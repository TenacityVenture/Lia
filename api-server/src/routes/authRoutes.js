// src/routes/promptRoutes.js
const express = require('express');
const router = express.Router();
const {  loginUser } = require('../controllers/authController');
const { registerUser } = require('../controllers/authController');

router.post('/sign-in', loginUser);

router.post('/register', registerUser);


module.exports = router;

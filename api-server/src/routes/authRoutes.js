// src/routes/promptRoutes.js
const express = require('express');
const router = express.Router();
const {  loginUser } = require('../controllers/authController');
const { signUpNewUser } = require('../controllers/authController');

router.post('/sign-in', loginUser);

router.post('/sign-up', signUpNewUser);


module.exports = router;

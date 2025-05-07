// src/routes/promptRoutes.js
const express = require('express');
const router = express.Router();
const {  signInWithPassword } = require('../controllers/authController');
const { signUpNewUser } = require('../controllers/authController');

router.post('/sign-in', signInWithPassword);

router.post('/sign-up', signUpNewUser);


module.exports = router;

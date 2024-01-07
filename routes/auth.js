const express = require('express');
const router = express.Router();
const {authController} = require('../controllers');

//Signup
router.post('/signup', authController.signup);

//Signin
router.post('/signin',authController.signin);

//Get Me
router.get('/me',authController.getMe);

module.exports= router
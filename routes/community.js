const express = require('express');
const router = express.Router();
const {communityController} = require('../controllers');

//Create a Role
router.post('/community', communityController.create);
router.get('/community', communityController.getAll);
router.get('/community/:id/members',communityController.getAllMembers);
module.exports= router
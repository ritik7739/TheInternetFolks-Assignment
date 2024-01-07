const express = require('express');
const router = express.Router();
const {rolesController} = require('../controllers');

//Create a Role
router.post('/role', rolesController.createRole);

//Get Roles
router.get('/role',rolesController.getRole);

module.exports= router
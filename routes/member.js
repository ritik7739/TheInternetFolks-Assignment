const express = require('express');
const router = express.Router();

const { addMember } = require('../controllers/memberController');  // Assuming addMember is in memberController

// Define the route for adding a member to a community
router.post('/member', addMember);

module.exports = router;

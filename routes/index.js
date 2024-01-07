const express = require("express");
const authRoutes = require('./auth');
const rolesRoutes = require('./roles');
const communityRoutes = require('./community');
const memberRoutes = require('./member');

const router = express.Router();

router.use('/auth',authRoutes);
router.use('/roles',rolesRoutes);
router.use('/community',communityRoutes);
router.use('/member',memberRoutes);

module.exports = router;

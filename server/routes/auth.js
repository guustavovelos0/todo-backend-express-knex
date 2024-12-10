const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');

router.post('/sign-in', controller.signin);
router.post('/sign-up', controller.signup);

module.exports = router;
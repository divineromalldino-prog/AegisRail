const express = require('express');
const router = express.Router();
const { loginMerchant } = require('../controllers/authController');

router.post('/login', loginMerchant);

module.exports = router;

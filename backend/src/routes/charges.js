const express = require('express');
const router = express.Router();
const { createCharge } = require('../controllers/chargesController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, createCharge);

module.exports = router;

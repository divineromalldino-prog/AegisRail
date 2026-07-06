const express = require('express');
const router = express.Router();
const { getTransactions, getTransactionByReference } = require('../controllers/transactionsController');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, getTransactions);
router.get('/:reference', authenticate, getTransactionByReference);

module.exports = router;

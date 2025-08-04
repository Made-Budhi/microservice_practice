const express = require('express');
const router = express.Router();

const listTransactionController = require('../controllers/list_transaction.controller');

/**
 * Get all transactions
 */
router.get('/', listTransactionController.getAll);

module.exports = router;
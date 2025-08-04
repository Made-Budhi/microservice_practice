const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/event.transaction.controller');

// GET semua transaksi (termasuk user & produk)
// router.get('/', transactionController.getAll);

// GET transaksi berdasarkan ID
// router.get('/:id', transactionController.getById);

// POST buat transaksi baru
router.post('/create-transaction', transactionController.create);

module.exports = router;

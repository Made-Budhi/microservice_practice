require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');

const TransactionServiceApi = process.env.TRANSACTION_SERVICE_API;
const ListTransactionServiceApi = process.env.LIST_TRANSACTION_SERVICE_API;
const productServiceApi = process.env.PRODUCT_SERVICE_API;
const BASE_URL = '/api/events';

/**
 * Perform data insertion into the transaction database on product creation.
 * It inserts the exact duplicate of the product data into the transaction database.
 */
router.post(`${BASE_URL}/create-product`, async (req, res) => {
    const data = req.body;

    console.log(data);
    try {
        await axios.post(`${TransactionServiceApi}/api/events/create-product`, data);
        await axios.post(`${ListTransactionServiceApi}/api/events/create-product`, data);
        res.send({ status: 'OK Event submitted' });
    } catch (error) {
        res.status(500).json({ error: error.message + ` from ${BASE_URL}/create-product endpoint.` });
    }
})

/**
 * Perform data update in the transaction database on product update.
 * It updates the exact duplicate of the product data in the transaction database.
 */
router.post(`${BASE_URL}/update-product/:id`, async (req, res) => {
    const data = req.body;

    try {
        await axios.put(`${TransactionServiceApi}/api/events/update-product/${req.params.id}`, data);
        res.send({ status: 'OK Event submitted' });
    } catch (error) {
        res.status(500).json({ error: error.message + ` from ${BASE_URL}/update-product/:id endpoint.` });
    }
})

/**
 * Perform data deletion in the transaction database on product deletion.
 * It deletes the exact duplicate of the product data in the transaction database.
 */
router.post(`${BASE_URL}/delete-product/:id`, async (req, res) => {
    try {
        await axios.delete(`${TransactionServiceApi}/api/events/delete-product/${req.params.id}`);
        res.send({ status: 'OK Event submitted' });
    } catch (error) {
        res.status(500).json({ error: error.message + ` from ${BASE_URL}/delete-product/:id endpoint.` });
    }
})

/**
 * Perform data update in the product database on stock change upon transaction creation.
 */
router.post(`${BASE_URL}/update-stock/:id`, async (req, res) => {
    try {
        const quantity = req.body.quantity;
        const id = req.params.id;

        console.log(quantity);
        await axios.put(`${productServiceApi}/api/products/update-stock/${id}`, {quantity});
        res.send({ status: 'OK Event submitted' });
    } catch (error) {
        res.status(500).json({ error: error.message + ` from ${BASE_URL}/update-stock/:id endpoint.` });
    }
})

module.exports = router;
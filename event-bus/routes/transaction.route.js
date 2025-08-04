require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');

// It's good practice to have a separate environment variable for each service
const listTransactionServiceApi = process.env.LIST_TRANSACTION_SERVICE_API;
const BASE_URL = '/api/events';

// Call list transaction endpoint upon transaction creation
router.post(`${BASE_URL}/create-transaction`, async (req, res) => {
    const data = req.body;

    console.log(data);
    try {
        await axios.post(`${listTransactionServiceApi}/api/events/create-transaction`, data);
        res.send({ status: 'OK Event submitted' });
    } catch (error) {
        res.status(500).json({ error: error.message + ` from ${BASE_URL}/create-transaction endpoint.` });
    }
})

module.exports = router;
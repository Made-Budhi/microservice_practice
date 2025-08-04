require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');

// It's good practice to have a separate environment variable for each service
const TransactionServiceApi = process.env.TRANSACTION_SERVICE_API;
const ListTransactionServiceApi = process.env.LIST_TRANSACTION_SERVICE_API;
const BASE_URL = '/api/events';

/**
 * Perform data insertion into the transaction database on user creation.
 * It sends an event to insert a duplicate of the user data into the transaction database.
 */
router.post(`${BASE_URL}/create-user`, async (req, res) => {
    const data = req.body;

    console.log("User data passed ", data);

    try {
        // Forward the user creation event to the transaction service
        await axios.post(`${TransactionServiceApi}/api/events/create-user`, data);
        await axios.post(`${ListTransactionServiceApi}/api/events/create-user`, data);
        res.send({ status: 'OK. User creation event submitted.' });
    } catch (error) {
        res.status(500).json({ error: error.message + ` from ${BASE_URL}/create-user endpoint.` });
    }
});

/**
 * Perform data update in the transaction database on user update.
 * It sends an event to update the duplicate user data in the transaction database.
 */
router.post(`${BASE_URL}/update-user/:id`, async (req, res) => {
    const data = req.body;

    console.log("User data passed ", data);
    try {
        // Forward the user update event to the transaction service
        await axios.put(`${TransactionServiceApi}/api/events/update-user/${req.params.id}`, data);
        res.send({ status: 'OK. User update event submitted.' });
    } catch (error) {
        res.status(500).json({ error: error.message + ` from ${BASE_URL}/update-user/:id endpoint.` });
    }
});

/**
 * Perform data deletion in the transaction database on user deletion.
 * It sends an event to delete the duplicate user data from the transaction database.
 */
router.post(`${BASE_URL}/delete-user/:id`, async (req, res) => {
    try {
        // Forward the user deletion event to the transaction service
        await axios.delete(`${TransactionServiceApi}/api/events/delete-user/${req.params.id}`);
        res.send({ status: 'OK. User deletion event submitted.' });
    } catch (error) {
        res.status(500).json({ error: error.message + ` from ${BASE_URL}/delete-user/:id endpoint.` });
    }
});

module.exports = router;

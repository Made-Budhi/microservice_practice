const express = require('express');
const axios = require('axios');

const app = express();

// Routes import
const productRoutes = require('./routes/product.route');
const userRoutes = require('./routes/user.route');
const transactionRoutes = require('./routes/transaction.route');

// Environment variables
require('dotenv').config();
const productServiceApi = process.env.PRODUCT_SERVICE_API;
const TransactionServiceApi = process.env.TRANSACTION_SERVICE_API;
const userServiceApi = process.env.USER_SERVICE_API;

app.use(express.json());

app.use(userRoutes);
app.use(productRoutes);
app.use(transactionRoutes);

app.get("/", (req, res) => res.send("Successfully called this api"));

app.post('/events', async (req, res) => {
    const event = req.body;

    switch(event.type) {
        case 'ProductCreated':
            axios.post(`${TransactionServiceApi}/api/events/create-product`, event.data);
            break;
        case 'TransactionCreated':
            axios.post(`${TransactionServiceApi}/api/events`, event.data);
            break;
        case 'UserCreated':
            axios.post(`${TransactionServiceApi}/api/events/create-user`, event.data);
            break;
        default:
            break;
    }

    res.send({ status: 'OK Event submitted' });
});

app.listen(4005, () => {
    console.log('Listening on port http://localhost:4005');
});
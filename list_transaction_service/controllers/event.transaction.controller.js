const db = require('../models');
const Transaction = db.Transaction;
const productService = require('../services/product.service');

exports.create = async (req, res) => {
    try {
        const { userId, productId, quantity, totalPrice } = req.body;

        let transaction = await Transaction.create({
            userId,
            productId,
            quantity,
            totalPrice
        });

        transaction = transaction.dataValues;

        // Reduce the amount of product in stock
        await productService.stockChange(productId, quantity);

        console.log("Transaction Created", transaction);
        res.status(201).json(transaction);

    } catch (err) {
        console.log("ERROR: ", err);
    }
};
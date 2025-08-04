const db = require("../models");
const Transaction = db.Transaction;
const User = db.User;
const Product = db.Product;

exports.getAll = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            // The 'include' option performs the JOIN
            include: [
                {
                    model: User,
                    // attributes: ['id', 'name', 'email']
                },
                {
                    model: Product,
                    // attributes: ['id', 'name', 'price']
                }
            ]
        });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
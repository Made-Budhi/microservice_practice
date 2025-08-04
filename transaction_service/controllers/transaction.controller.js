const db = require('../models');
const Transaction = db.Transaction;
const userService = require('../services/user.service');
const productService = require('../services/product.service');
const axios = require("axios");

exports.getAll = async (req, res) => {
  try {
    const data = await Transaction.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be greater than 0.' });
    }
    // Call user service.
    // This will throw an error if the user is not found.
    await userService.getUserById(userId);

    // Call product service.
    let product = await productService.getProductById(productId);
    product = product.dataValues;

    // Stock and quantity checking
    if (product.stock < quantity || product.stock - quantity < 0) {
      return res.status(400).json({ error: 'Insufficient stock.' });
    }

    console.log("Product before ", product);

    // Get price variable
    let price = product.price;

    // Calculate total price
    const totalPrice = price * quantity;

    let transaction = await Transaction.create({
      userId,
      productId,
      quantity,
      totalPrice
    });

    transaction = transaction.dataValues;

    // Trigger event bus to create a duplicate of the transaction data in the list transaction database
    await axios.post(`${process.env.EVENT_BUS_API}/create-transaction`, transaction)
    // Reduce the amount of product in stock
    await productService.stockChange(productId, quantity);

    console.log("Transaction Created", transaction);
    res.status(201).json(transaction);

  } catch (err) {
    if (err.isAxiosError) {
      // This means the error came from an axios (HTTP) call to another service
      if (err.response) {
        // The other service responded with an error (e.g., 404, 500)
        console.error("ERROR RESPONSE FROM DEPENDENT SERVICE:", err.response.data);
        return res.status(500).json({
          message: "A dependent service returned an error.",
          service: err.config.url, // Tells you which service failed
          error: err.response.data
        });
      } else if (err.request) {
        // The request was made, but no response was received (service is down)
        console.error("NO RESPONSE FROM DEPENDENT SERVICE:", err.config.url);
        return res.status(500).json({
          message: "No response from a dependent service. It might be down.",
          service: err.config.url,
          error: err.message
        });
      }
    }

    // If it's not an Axios error, it's an internal database or logic error
    console.error("INTERNAL SERVER ERROR:", err);
    return res.status(500).json({
      message: "An internal server error occurred.",
      error: err.message
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Transaction.destroy({ where: { id: req.params.id } });
    if (deleted === 0) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    res.json({ message: 'Transaksi dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

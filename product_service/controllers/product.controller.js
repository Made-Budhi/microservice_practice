require('dotenv').config();

const axios = require('axios');
const db = require('../models');
const Product = db.Product;
const {Sequelize} = require('sequelize');

const eventBusApi = process.env.EVENT_BUS_API;

exports.getAll = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    let product = await Product.create(req.body);
    product = product.dataValues;

    // Trigger event bus to create a duplicate of the product data in the transaction database
    await axios.post(`${eventBusApi}/api/events/create-product`, product)

    res.status(201).json(product);
    console.log("Product Created", product);
  } catch (err) {
    res.status(500).json({ error: err.message + " from product.controller.js" });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    // Will return the number of rows updated
    const [updated] = await Product.update(req.body, {
      where: { id: id }
    });

    // Trigger event bus to update the duplicate product data in the transaction database
    if (updated === 1) {
      // Get the product data from the database
      let product = await Product.findByPk(id);
      product = product.dataValues;

      await axios.post(`${eventBusApi}/api/events/update-product/${id}`, product)

      return res.json({ message: 'Produk diperbarui' });
    }

    // If more than one row is updated, return an error
    if (updated > 1) return res.status(500).json({ error: 'More than one row is updated. This should not happen considering one unique ID is owned by one product only. ' +
          'Please contact the developer for more information.' });

    // If no row is updated, return an error
    if (updated === 0) return res.status(404).json({ error: 'Produk tidak ditemukan' });
  } catch (err) {
    // This enhanced error handling will give us the real error.
    if (err.response) {
      // The event-bus responded with an error (e.g., 400, 500)
      console.error("ERROR FROM EVENT BUS:", err.response.data);
      return res.status(500).json({
        message: "The Event Bus returned an error.",
        error: err.response.data
      });
    } else if (err.request) {
      // The request was made, but no response was received.
      // Is the event-bus service running and accessible?
      console.error("NO RESPONSE FROM EVENT BUS:", err.request);
      return res.status(500).json({
        message: "No response from Event Bus. Is the service down?",
        error: err.message
      });
    } else {
      // Something else went wrong setting up the request
      console.error("AXIOS SETUP ERROR:", err.message);
      return res.status(500).json({
        message: "An error occurred before the event could be sent.",
        error: err.message
      });
    }
  }
};

exports.stockChange = async (req, res) => {
  const id = req.params.id;
  const quantity = req.body.quantity;

  console.log("Stock Change", quantity);
  try {
    // Will return the number of rows updated
    const [updated] = await Product.update(
      { stock: Sequelize.literal(`stock - ${quantity}`) },
      { where: { id: id }});

    if (updated === 0) return res.status(404).json({ error: 'Produk tidak ditemukan' });
    if (updated > 1) return res.status(500).json({ error: 'More than one row is updated. This should not happen considering one unique ID is owned by one product only.'})
    res.json({ message: 'Stock Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id }
    });

    // Trigger event bus to delete the duplicate product data in the transaction database
    if (deleted === 1) {
      await axios.post(`${eventBusApi}/api/events/delete-product/${req.params.id}`);
      return res.json({ message: 'Produk dihapus' });
    }

    if (deleted === 0) return res.status(404).json({ error: 'Produk tidak ditemukan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

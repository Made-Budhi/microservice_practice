const { Sequelize } = require('sequelize');
const db = require('../models');
const axios = require("axios");
const Product = db.Product;

require('dotenv').config();
const eventBusApi = process.env.EVENT_BUS_API;

exports.getProductById = async (id) => {
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  } catch (err) {
    console.log("Error: ", err.message);
  }
};

/**
 * TODO: also add updatedAt to send the exact duplicate data to the product database
 *
 *
 * @param id
 * @param quantity
 * @returns {Promise<void>}
 */
exports.stockChange = async (id, quantity) => {
  try {
    // Perform the update in a single atomic database operation.
    // Sequelize.literal() creates a raw SQL expression.
    const [updatedRows] = await Product.update(
        { stock: Sequelize.literal(`stock - ${quantity}`) },
        { where: { id: id } }
    );

    // If no rows were updated, it means the product ID was not found.
    if (updatedRows === 0) {
      throw new Error(`Product with ID ${id} not found.`);
    }

    // Trigger the event bus with the change in quantity.
    // This is more robust than sending the new total.
    await axios.post(`${eventBusApi}/update-stock/${id}`, {quantity});

    console.log(`Stock for product ${id} successfully updated.`);

  } catch (err) {
    // This will catch errors from both the database update and the axios call.
    console.error("Error during stock change: ", err.message);
  }
};
const db = require("../models");
const Product = db.Product;

exports.createProduct = async (req, res) => {
    const data = req.body;

    try {
        const product = await Product.create(data);
        res.status(201).json(product);
        console.log("Product Created", data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateProduct = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const product = await Product.update(data, {
            where: { id: id }
        });
        res.status(201).json(product);
        console.log(`Product with id: ${id} Updated`, data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteProduct = async (req, res) => {
    const id = req.params.id;

    try {
        const product = await Product.destroy({
            where: { id: id }
        });
        res.status(201).json(product);
        console.log(`Product with id: ${id} Deleted`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
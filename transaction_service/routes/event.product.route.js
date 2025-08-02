const express = require('express');
const eventProductController = require("../controllers/event.product.controller");
const router = express.Router();

router.post('/create-product', eventProductController.createProduct);
router.put('/update-product/:id', eventProductController.updateProduct);
router.delete('/delete-product/:id', eventProductController.deleteProduct);

module.exports = router;
const express = require('express');
const router = express.Router();
const eventUserController = require('../controllers/event.user.controller');

router.post('/create-user', eventUserController.createUser);
router.put('/update-user/:id', eventUserController.updateUser);
router.delete('/delete-user/:id', eventUserController.deleteUser);

module.exports = router;
const db = require('../models');
const User = db.User;

exports.createUser = async (req, res) => {
    const data = req.body;

    try {
        const user = await User.create(data);
        res.status(201).json(user);
        console.log("User Created", data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const user = await User.update(data, {
            where: { id: id }
        });
        res.status(201).json(user);
        console.log(`User with id: ${id} Updated`, data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.destroy({
            where: { id: id }
        });
        res.status(201).json(user);
        console.log(`User with id: ${id} Deleted`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
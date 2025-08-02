const axios = require('axios');
const db = require('../models');
const User = db.User;

const eventBusApi = process.env.EVENT_BUS_API;

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    let user = await User.create(req.body);
    user = user.dataValues;

    console.log("User Created", user);
    await axios.post(`${eventBusApi}/api/events/create-user`, user)

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message + " from user.controller.js" });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [updated] = await User.update(req.body, {
      where: { id: id }
    });

    // Trigger event bus to update the duplicate user data in the transaction database
    if (updated === 1) {
      // Get the user data from the database
      let user = await User.findByPk(id);
      user = user.dataValues;

      console.log("User Updated", user);
      await axios.post(`${eventBusApi}/api/events/update-user/${id}`, user)

      return res.json({ message: 'User updated' });
    }

    // If more than one row is updated, return an error
    if (updated > 1) return res.status(500).json({ error: 'More than one row is updated. This should not happen ' +
          'considering one unique ID is owned by one user only. Please contact the developer for more information.' });

    // If no row is updated, return an error
    if (updated === 0) return res.status(404).json({ error: 'User not found.' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  const id = req.params.id;

  try {
    const deleted = await User.destroy({
      where: { id: req.params.id }
    });

    // Trigger event bus to delete the duplicate user data in the transaction database
    if (deleted === 1) {
      await axios.post(`${eventBusApi}/api/events/delete-user/${id}`);
      return res.json({ message: 'User dihapus' });
    }

    if (deleted === 0) return res.status(404).json({ error: 'User tidak ditemukan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

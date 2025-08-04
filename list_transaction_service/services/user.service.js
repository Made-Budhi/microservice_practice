const db = require('../models');

exports.getUserById = async (id) => {
  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  } catch (err) {
    console.log("Error: ", err.message);
  }
};
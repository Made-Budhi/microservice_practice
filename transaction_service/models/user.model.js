const db = require('./index');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  });

  db.associate = () => {
    User.hasMany(db.Transaction, { foreignKey: "userId" });
  }

  return User;
};
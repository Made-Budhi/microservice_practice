const db = require("./index");

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction", {
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER,
  });
  
  db.associate = () => {
    Transaction.belongsTo(db.Product, { foreignKey: "productId" });
    Transaction.belongsTo(db.User, { foreignKey: "userId" });
  }

  return Transaction;
};
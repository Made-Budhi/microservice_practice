module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction", {
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER,
  });

  // Define associate as a static method on the Transaction model
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Product, { foreignKey: "productId" });
    Transaction.belongsTo(models.User, { foreignKey: "userId" });
  }

  return Transaction;
};
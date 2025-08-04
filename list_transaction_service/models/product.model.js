module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
  });

  // Define associate as a static method on the Product model
  Product.associate = (models) => {
    Product.hasMany(models.Transaction, { foreignKey: "productId" });
  }

  return Product;
};
const db = require('./index');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
  });

  db.associate = () => {
    Product.hasMany(db.Transaction, { foreignKey: "productId" });   
  }

  return Product;
};
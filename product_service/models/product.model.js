module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Product", {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
  });
};

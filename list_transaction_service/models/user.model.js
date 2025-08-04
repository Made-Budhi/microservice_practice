module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  });

  // Define associate as a static method on the User model
  User.associate = (models) => {
    User.hasMany(models.Transaction, { foreignKey: "userId" });
  }

  return User;
};
const { DataTypes } = require("sequelize");
const sequelize = require("../api/database");

const CategoryData = sequelize.define(
  "CategoryData",
  {
    categoryid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "category",
    timestamps: false,
  }
);

module.exports = CategoryData;

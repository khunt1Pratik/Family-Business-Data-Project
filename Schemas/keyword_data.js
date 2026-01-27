const { DataTypes } = require("sequelize");
const sequelize = require("../api/database");

const Keyword = sequelize.define(
  "Keyword",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    keyword_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "keywords",
    timestamps: false,
  }
);

module.exports = Keyword;

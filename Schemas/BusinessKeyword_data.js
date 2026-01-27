const { DataTypes } = require("sequelize");
const sequelize = require("../api/database");

const BusinessKeyword = sequelize.define(
  "BusinessKeyword",
  {
    business_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    keyword_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "business_keywords",
    timestamps: false,
  }
);

module.exports = BusinessKeyword;

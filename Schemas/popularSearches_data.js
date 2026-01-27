const { DataTypes } = require("sequelize");
const sequelize = require("../api/database");

const PopularSearch = sequelize.define(
  "PopularSearch",
  {
    search_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    keyword: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    search_count: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    last_searched_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "popular_searches",
    timestamps: false,
  }
);

module.exports = PopularSearch;

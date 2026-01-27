const { DataTypes } = require("sequelize");
const sequelize = require("../api/database");
const CategoryData = require("./Category_data");

const BusinessData = sequelize.define(
  "BusinessData",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    categoryid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "category",
        key: "categoryid",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    BusinessName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    BusinessWebsite: DataTypes.STRING,
    BusinessAddress: DataTypes.TEXT,
    BusinessCard: DataTypes.STRING,
    BusinessLogo: DataTypes.STRING,
    BusinessDescription: DataTypes.STRING,

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "business",
    timestamps: false,
  }
);

BusinessData.belongsTo(CategoryData, {
  foreignKey: "categoryid",
});

CategoryData.hasMany(BusinessData, {
  foreignKey: "categoryid",
});

module.exports = BusinessData;

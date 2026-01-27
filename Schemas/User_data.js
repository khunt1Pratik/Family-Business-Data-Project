const { DataTypes } = require("sequelize");
const sequelize = require("../api/database");

const UserData = sequelize.define(
  "UserData",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    FirstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    MiddleName: {
      type: DataTypes.STRING,
    },

    LastName: {
      type: DataTypes.STRING,
    },

    VillageName: {
      type: DataTypes.STRING,
    },

    CityName: {
      type: DataTypes.STRING,
    },

    Email: {
      type: DataTypes.TEXT,
    },

    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    auth_provider: {
      type: DataTypes.ENUM("local", "google"),
      defaultValue: "local",
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = UserData;

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "family_business_data", //db name
  "family",// databse user
  "kp123", // password
  {
    host: "localhost", 
    dialect: "mysql",
    port: 3306
  }
);

module.exports = sequelize;

// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   "railway", //db name
//   "root",// databse user
//   "EGoCxgcXEnkQlKDdQKHAwtvWWmFHfTCj", // password
//   {
//     host: "mysql.railway.internal", 
//     dialect: "mysql",
//     port: 3306
//   }
// );

// module.exports = sequelize;


// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   "taraviya",     // db name
//   "root",                   // username
//   "admin123",                         // <-- EMPTY PASSWORD
//   {
//     host: "localhost",
//     dialect: "mysql",
//     port: 3306
//   }
// );

// module.exports = sequelize;

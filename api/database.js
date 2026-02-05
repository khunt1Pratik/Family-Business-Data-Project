// local 

// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   "family_business_data", //db name
//   "family",// databse user
//   "kp123", // password
//   {
//     host: "localhost", 
//     dialect: "mysql",
//     port: 3306
//   }
// );

// module.exports = sequelize;

// railway --------------------------------------------------------------------

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "railway", //db name
  "root",// databse user
  "EGoCxgcXEnkQlKDdQKHAwtvWWmFHfTCj", // password
  {
    host: "mysql.railway.internal", 
    dialect: "mysql",
    port: 3306
  }
);

module.exports = sequelize;

// webseek--------------------------------------------------------------------------

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



// rander -----------------------------------------------------------------------------


// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   "family_sql",     // db name
//   "family_sql_user",                   // username
//   "STh3DWbj7E2wYArrWgCamlykYIGXziYu",                         // <-- EMPTY PASSWORD
//   {
//     host: "dpg-d62a6i14tr6s73c9cnug-a",
//     dialect: "postgresql",
//     port: 5432
//   }
// );

// module.exports = sequelize;

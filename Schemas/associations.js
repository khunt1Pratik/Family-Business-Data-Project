const Business = require("./Business_data");
const Keyword = require("./keyword_data");
const BusinessKeyword = require("./BusinessKeyword_data");

// Business ↔ Keyword many-to-many
Business.belongsToMany(Keyword, {
  through: BusinessKeyword,
  foreignKey: "business_id",
  otherKey: "keyword_id",
  as: "keywords",
});

Keyword.belongsToMany(Business, {
  through: BusinessKeyword,
  foreignKey: "keyword_id",
  otherKey: "business_id",
  as: "businesses",
});

module.exports = {
  Business,
  Keyword,
  BusinessKeyword
};

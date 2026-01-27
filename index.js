require('dotenv').config();
require("./Schemas/associations");
const express = require('express');
const app = express();
const sequelize = require('./api/database');
const cors = require("cors");
const AuthRoute = require('./api/Routers/AuthRoute');
const UserRouter = require("./api/Routers/UserRoute")
const BusinessRouter = require("./api/Routers/BusinessRoute");
const PopularSearches = require("./api/Routers/popularSrarchRoute");
const path = require("path");
const Keyword = require("./api/Routers/keywordRoute");
const UserData = require('./Schemas/User_data');
const Business = require('./Schemas/Business_data');
const categoryRoutes = require('./api/Routers/CategoryRoute')
const businessKeywordsRouter = require("./api/Routers/BusinessKeywordRoute");

const auth = require("./api/middleware/staticAuth");

app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "authorization",
    "x-api-key"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));



app.use(express.json());

sequelize.authenticate()
  .then(() => console.log("✅ Railway MySQL connected"))
  .catch(err => console.error("❌ DB connection failed:", err));


// Sync database
sequelize.sync()
  .then(() => console.log('Daatabase synced...'))
  .catch(err => console.error('Sync error: ' + err));

// Define associations
Business.belongsTo(UserData, { foreignKey: 'user_id' });
UserData.hasMany(Business, { foreignKey: 'user_id' });


app.use('/api/auth', AuthRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(auth);
app.use('/user' , UserRouter);
app.use("/business", BusinessRouter);
app.use("/popularsearches", PopularSearches);
app.use("/categories", categoryRoutes);
app.use("/keyword", Keyword);
app.use("/businessKeywords", businessKeywordsRouter);




const PORT = process.env.PORT ;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

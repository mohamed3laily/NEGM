// Include Sequelize module
const { Sequelize } = require("sequelize");
// Creating new Object of Sequelize
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER_NAME,
  process.env.DATABASE_PASSWORD,
  {
    // Explicitly specifying
    // mysql database
    dialect: "mysql",

    // By default host is 'localhost'
    host: "localhost",
  }
);

// Exporting the sequelize object.
// We can use it in another file
// for creating models

const db = {};
db.sequelize = sequelize;
db.models = {};
db.models.USER = require("./userModel")(sequelize, Sequelize.DataTypes);
db.models.NGOM = require("./ngomModel")(sequelize, Sequelize.DataTypes);
db.models.LEAGUE = require("./leaguesModel")(sequelize, Sequelize.DataTypes);
module.exports = db;

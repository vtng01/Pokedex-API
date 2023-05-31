const { db } = require("./db.js");
const { Users, Pokedex, Logs } = require("./models/index.js");

//Associations
Users.hasMany(Pokedex);
Pokedex.belongsTo(Users);

//Logs
Users.hasMany(Logs);
Logs.belongsTo(Users);

async function connectToDatabase() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

connectToDatabase();

module.exports = { db, Users, Pokedex, Logs };

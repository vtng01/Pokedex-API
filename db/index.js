import {db} from "./db.js";
import {Users, Pokedex, Logs} from "./models/index.js";

//Associations
Users.hasMany(Pokedex);
Pokedex.belongsTo(Users);

//Logs
Users.hasMany(Logs);
Logs.belongsTo(Users);

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
}

export {db, Users, Pokedex, Logs};

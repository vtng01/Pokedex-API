import {db} from "./testDB.js";
import {Users, PokeDex, Logs} from "./models/index.js";

Users.hasMany(Pokedex);
Pokedex.belongsTo(Users);

export {Users, Pokedex, Logs};

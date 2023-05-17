import { db } from "../db.js";
import { Sequelize, DataTypes, STRING } from "sequelize";

const Pokedex = db.define("Pokedex", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export { Pokedex };

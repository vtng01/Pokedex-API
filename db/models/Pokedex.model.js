const { db } = require("../db.js");
const { Sequelize, DataTypes, STRING } = require("sequelize");

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

module.exports = { Pokedex };

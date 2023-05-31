const { db } = require("../db.js");
const { Sequelize, DataTypes } = require("sequelize");

const Logs = db.define("Log", {
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  event: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { Logs };

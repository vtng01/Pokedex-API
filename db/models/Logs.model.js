import { db } from "../db.js";
import { Sequelize, DataTypes } from "sequelize";

const Logs = db.define("Log", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entry: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export { Logs };

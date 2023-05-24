import { db } from "../db.js";
import { Sequelize, DataTypes } from "sequelize";

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

export { Logs };
